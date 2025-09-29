// Restaurant Intelligence Platform API Types
export interface Restaurant {
  id: string
  name: string
  slug: string
  address?: string
  city?: string
  state?: string
  cuisineType?: string
  posSystem?: string
  status: string
  subscriptionPlan: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  restaurantId: string
  posTransactionId: string
  transactionDate: Date
  subtotal: number
  taxAmount: number
  tipAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod?: string
  orderType?: string
  serverName?: string
  tableNumber?: string
  guestCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description?: string
  basePrice: number
  costPrice?: number
  imageUrl?: string
  isAvailable: boolean
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface DailyAnalytic {
  id: string
  restaurantId: string
  analyticsDate: Date
  totalRevenue: number
  totalTransactions: number
  totalCustomers: number
  averageTicket: number
  totalItemsSold: number
  laborCost: number
  foodCost: number
  grossProfit: number
  profitMargin: number
  weatherCondition?: string
  temperatureFahrenheit?: number
  peakHour?: number
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  restaurantId: string
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  totalVisits: number
  totalSpent: number
  averageTicket: number
  lastVisit?: Date
  customerSegment?: string
  lifetimeValue: number
  createdAt: Date
  updatedAt: Date
}

export interface DashboardData {
  restaurant: Restaurant
  todayRevenue: number
  yesterdayRevenue: number
  totalTransactions: number
  averageTicket: number
  totalCustomers: number
  topMenuItems: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  recentTransactions: Transaction[]
  dailyAnalytics: DailyAnalytic[]
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}