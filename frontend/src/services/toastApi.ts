/**
 * Toast POS API Service
 * Frontend service for connecting to Toast POS backend APIs
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://provincial-rhianon-restaurantintelligence-b8a4dd49.koyeb.app'
  : 'http://localhost:3001'

class ToastApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/api/toast${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Test Toast connection
  async testConnection() {
    return this.fetchApi<{
      success: boolean
      message: string
      data?: unknown
      timestamp: string
    }>('/test-connection')
  }

  // Get restaurant info
  async getRestaurant() {
    return this.fetchApi<{
      success: boolean
      data: {
        id: string
        name: string
        description?: string
        timeZone: string
        currency: string
        location?: {
          address1: string
          city: string
          stateCode: string
          zipCode: string
        }
      }
    }>('/restaurant')
  }

  // Get menu items
  async getMenuItems() {
    return this.fetchApi<{
      success: boolean
      data: Array<{
        id: string
        name: string
        description?: string
        price: number
        category?: string
        visibility: string
        modifiedDate: string
      }>
    }>('/menu-items')
  }

  // Get orders with pagination
  async getOrders(options?: {
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
  }) {
    const params = new URLSearchParams()
    if (options?.page) params.set('page', options.page.toString())
    if (options?.pageSize) params.set('pageSize', options.pageSize.toString())
    if (options?.startDate) params.set('startDate', options.startDate)
    if (options?.endDate) params.set('endDate', options.endDate)

    const endpoint = `/orders${params.toString() ? `?${params.toString()}` : ''}`
    
    return this.fetchApi<{
      success: boolean
      data: Array<{
        id: string
        orderNumber: string
        orderDate: string
        totalAmount: number
        tip?: number
        tax?: number
        status: string
        customer?: {
          firstName?: string
          lastName?: string
          email?: string
          phone?: string
        }
        items?: Array<{
          name: string
          quantity: number
          price: number
        }>
      }>
      pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
      }
    }>(endpoint)
  }

  // Get specific order by ID
  async getOrder(orderId: string) {
    return this.fetchApi<{
      success: boolean
      data: {
        id: string
        orderNumber: string
        orderDate: string
        totalAmount: number
        tip?: number
        tax?: number
        status: string
        customer?: {
          firstName?: string
          lastName?: string
          email?: string
          phone?: string
        }
        items?: Array<{
          name: string
          quantity: number
          price: number
          modifiers?: Array<{
            name: string
            price: number
          }>
        }>
      }
    }>(`/orders/${orderId}`)
  }

  // Get customers
  async getCustomers() {
    return this.fetchApi<{
      success: boolean
      data: Array<{
        id: string
        firstName?: string
        lastName?: string
        email?: string
        phone?: string
        createdDate: string
        lastVisit?: string
      }>
    }>('/customers')
  }

  // Get analytics data
  async getAnalytics(options?: {
    startDate?: string
    endDate?: string
    period?: 'day' | 'week' | 'month'
  }) {
    const params = new URLSearchParams()
    if (options?.startDate) params.set('startDate', options.startDate)
    if (options?.endDate) params.set('endDate', options.endDate)
    if (options?.period) params.set('period', options.period)

    const endpoint = `/analytics${params.toString() ? `?${params.toString()}` : ''}`
    
    return this.fetchApi<{
      success: boolean
      data: {
        summary: {
          totalRevenue: number
          totalOrders: number
          averageOrderValue: number
          totalCustomers: number
        }
        salesTrends: Array<{
          date: string
          revenue: number
          orders: number
        }>
        topItems: Array<{
          name: string
          revenue: number
          quantity: number
          category?: string
        }>
        customerMetrics: {
          newCustomers: number
          returningCustomers: number
          averageOrdersPerCustomer: number
        }
      }
    }>(endpoint)
  }

  // Sync Toast data with local database
  async syncData() {
    return this.fetchApi<{
      success: boolean
      message: string
      data: {
        syncedRecords: {
          restaurants: number
          menuItems: number
          transactions: number
          customers: number
        }
        lastSyncTime: string
      }
    }>('/sync', {
      method: 'POST'
    })
  }
}

export const toastApi = new ToastApiService()
export default toastApi