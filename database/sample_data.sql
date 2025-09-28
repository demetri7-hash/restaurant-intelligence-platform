-- Sample data for testing Restaurant Intelligence Platform database
-- This will be used to test real data operations

-- Insert a sample restaurant
INSERT INTO restaurants (name, slug, address, city, state, pos_system, pos_location_id, cuisine_type)
VALUES 
('Mario''s Italian Bistro', 'marios-italian-bistro', '123 Main St', 'New York', 'NY', 'square', 'SQUARE_LOC_001', 'Italian');

-- Get the restaurant ID for subsequent inserts
DO $$
DECLARE
    restaurant_uuid UUID;
BEGIN
    SELECT id INTO restaurant_uuid FROM restaurants WHERE slug = 'marios-italian-bistro';
    
    -- Insert sample user (restaurant owner)
    INSERT INTO users (restaurant_id, email, first_name, last_name, role, oauth_provider)
    VALUES (restaurant_uuid, 'mario@mariosbistro.com', 'Mario', 'Rossi', 'owner', 'google');
    
    -- Insert menu categories
    INSERT INTO menu_categories (restaurant_id, name, description, display_order)
    VALUES 
    (restaurant_uuid, 'Appetizers', 'Delicious starters to begin your meal', 1),
    (restaurant_uuid, 'Pasta', 'Fresh handmade pasta dishes', 2),
    (restaurant_uuid, 'Pizza', 'Wood-fired pizzas', 3),
    (restaurant_uuid, 'Desserts', 'Sweet endings', 4);
    
    -- Insert sample menu items
    INSERT INTO menu_items (restaurant_id, category_id, pos_item_id, name, description, base_price, cost_price)
    VALUES 
    (restaurant_uuid, (SELECT id FROM menu_categories WHERE name = 'Appetizers' AND restaurant_id = restaurant_uuid), 'ITEM_001', 'Bruschetta', 'Toasted bread with tomatoes and basil', 8.50, 2.25),
    (restaurant_uuid, (SELECT id FROM menu_categories WHERE name = 'Pasta' AND restaurant_id = restaurant_uuid), 'ITEM_002', 'Spaghetti Carbonara', 'Classic Roman pasta with eggs, cheese, and pancetta', 16.50, 4.75),
    (restaurant_uuid, (SELECT id FROM menu_categories WHERE name = 'Pizza' AND restaurant_id = restaurant_uuid), 'ITEM_003', 'Margherita Pizza', 'Fresh mozzarella, tomatoes, and basil', 14.00, 3.50),
    (restaurant_uuid, (SELECT id FROM menu_categories WHERE name = 'Desserts' AND restaurant_id = restaurant_uuid), 'ITEM_004', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 7.50, 2.00);
    
    -- Insert sample customer
    INSERT INTO customers (restaurant_id, phone, first_name, last_name, total_visits, total_spent, customer_segment)
    VALUES (restaurant_uuid, '+1-555-123-4567', 'John', 'Smith', 3, 87.50, 'regular');
    
    -- Insert sample transaction
    INSERT INTO transactions (restaurant_id, customer_id, pos_transaction_id, transaction_date, subtotal, tax_amount, tip_amount, total_amount, payment_method, order_type)
    VALUES (restaurant_uuid, 
            (SELECT id FROM customers WHERE phone = '+1-555-123-4567' AND restaurant_id = restaurant_uuid),
            'TXN_001_' || EXTRACT(EPOCH FROM NOW())::text,
            CURRENT_TIMESTAMP - INTERVAL '2 hours',
            32.50, 2.60, 6.50, 41.60, 'card', 'dine-in');
    
    -- Insert transaction items
    INSERT INTO transaction_items (transaction_id, menu_item_id, pos_item_id, item_name, quantity, unit_price, total_price, cost_price)
    VALUES 
    ((SELECT id FROM transactions WHERE pos_transaction_id LIKE 'TXN_001_%'), 
     (SELECT id FROM menu_items WHERE pos_item_id = 'ITEM_001' AND restaurant_id = restaurant_uuid),
     'ITEM_001', 'Bruschetta', 1, 8.50, 8.50, 2.25),
    ((SELECT id FROM transactions WHERE pos_transaction_id LIKE 'TXN_001_%'),
     (SELECT id FROM menu_items WHERE pos_item_id = 'ITEM_002' AND restaurant_id = restaurant_uuid),
     'ITEM_002', 'Spaghetti Carbonara', 1, 16.50, 16.50, 4.75),
    ((SELECT id FROM transactions WHERE pos_transaction_id LIKE 'TXN_001_%'),
     (SELECT id FROM menu_items WHERE pos_item_id = 'ITEM_004' AND restaurant_id = restaurant_uuid),
     'ITEM_004', 'Tiramisu', 1, 7.50, 7.50, 2.00);
     
END $$;