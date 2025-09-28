-- Restaurant Intelligence Platform Database Schema
-- PostgreSQL Database Schema for POS Data Analytics

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Restaurants Table
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    cuisine_type VARCHAR(100),
    pos_system VARCHAR(50), -- 'square', 'toast', 'revel', 'micros'
    pos_location_id VARCHAR(255), -- POS system's location ID
    timezone VARCHAR(50) DEFAULT 'UTC',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'trial'
    subscription_plan VARCHAR(50) DEFAULT 'trial', -- 'trial', 'basic', 'premium', 'enterprise'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (Restaurant owners, staff, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- for local auth, nullable for OAuth users
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'owner', -- 'owner', 'manager', 'staff', 'admin'
    phone VARCHAR(20),
    oauth_provider VARCHAR(50), -- 'google', 'auth0', null for local
    oauth_id VARCHAR(255), -- OAuth provider user ID
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Menu Categories Table
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id),
    pos_item_id VARCHAR(255), -- POS system's item ID
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2), -- Cost to make the item
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    prep_time_minutes INTEGER DEFAULT 0,
    calories INTEGER,
    dietary_restrictions TEXT[], -- ['vegetarian', 'vegan', 'gluten-free', etc.]
    ingredients TEXT[],
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table (inferred from transaction patterns)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    pos_customer_id VARCHAR(255), -- POS system customer ID if available
    phone VARCHAR(20),
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    total_visits INTEGER DEFAULT 1,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    average_ticket DECIMAL(10,2) DEFAULT 0.00,
    last_visit TIMESTAMP WITH TIME ZONE,
    preferred_items TEXT[], -- Array of most ordered item names
    customer_segment VARCHAR(50), -- 'new', 'regular', 'vip', 'at-risk'
    lifetime_value DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table (main sales data from POS)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    pos_transaction_id VARCHAR(255) UNIQUE NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    tip_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- 'card', 'cash', 'digital', 'other'
    order_type VARCHAR(50), -- 'dine-in', 'takeout', 'delivery', 'catering'
    server_name VARCHAR(255),
    table_number VARCHAR(20),
    guest_count INTEGER DEFAULT 1,
    pos_raw_data JSONB, -- Store complete POS response for backup
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transaction Items Table (individual items in each transaction)
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    pos_item_id VARCHAR(255),
    item_name VARCHAR(255) NOT NULL, -- Store name for historical accuracy
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    modifications TEXT[], -- ['no onions', 'extra cheese', etc.]
    cost_price DECIMAL(10,2), -- Cost per unit at time of sale
    profit_margin DECIMAL(10,4), -- Calculated profit margin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily Analytics Table (pre-computed daily metrics)
CREATE TABLE daily_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    analytics_date DATE NOT NULL,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    total_transactions INTEGER DEFAULT 0,
    total_customers INTEGER DEFAULT 0,
    average_ticket DECIMAL(10,2) DEFAULT 0.00,
    total_items_sold INTEGER DEFAULT 0,
    labor_cost DECIMAL(10,2) DEFAULT 0.00,
    food_cost DECIMAL(10,2) DEFAULT 0.00,
    gross_profit DECIMAL(10,2) DEFAULT 0.00,
    profit_margin DECIMAL(10,4) DEFAULT 0.00,
    weather_condition VARCHAR(100),
    temperature_fahrenheit INTEGER,
    peak_hour INTEGER, -- Hour with highest revenue (0-23)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(restaurant_id, analytics_date)
);

-- Staff Table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    pos_employee_id VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50), -- 'server', 'cook', 'manager', 'host', 'bartender'
    hourly_wage DECIMAL(8,2),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'terminated'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Shifts Table (for labor cost tracking)
CREATE TABLE staff_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    shift_date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    hours_worked DECIMAL(5,2),
    hourly_rate DECIMAL(8,2),
    total_pay DECIMAL(10,2),
    total_sales DECIMAL(10,2) DEFAULT 0.00, -- Sales attributed to this shift
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Items Table
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- 'produce', 'meat', 'dairy', 'dry-goods', etc.
    unit_of_measure VARCHAR(50), -- 'lbs', 'oz', 'each', 'cases', etc.
    unit_cost DECIMAL(8,4), -- Cost per unit
    supplier VARCHAR(255),
    par_level INTEGER, -- Minimum stock level
    current_stock DECIMAL(10,2) DEFAULT 0,
    last_ordered TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_transactions_restaurant_date ON transactions(restaurant_id, transaction_date);
CREATE INDEX idx_transactions_pos_id ON transactions(pos_transaction_id);
CREATE INDEX idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_customers_restaurant ON customers(restaurant_id);
CREATE INDEX idx_daily_analytics_restaurant_date ON daily_analytics(restaurant_id, analytics_date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_staff_shifts_date ON staff_shifts(restaurant_id, shift_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_analytics_updated_at BEFORE UPDATE ON daily_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_shifts_updated_at BEFORE UPDATE ON staff_shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();