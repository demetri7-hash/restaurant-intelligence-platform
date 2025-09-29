import axios, { AxiosInstance, AxiosResponse } from 'axios'
import qs from 'qs'
import dotenv from 'dotenv'
import { 
  ToastAuthResponse, 
  ToastApiResponse, 
  ToastConfig, 
  ToastServiceResponse,
  ToastSyncOptions,
  ToastRestaurant,
  ToastMenuItem,
  ToastMenuGroup,
  ToastOrder,
  ToastCustomer,
  ToastTimeEntry
} from '../types/toast.types.js'

dotenv.config()

/**
 * Toast POS API Service
 * Comprehensive service for Toast POS system integration
 * Supports OAuth 2.0, real-time data sync, and complete restaurant operations
 */
export class ToastPOSService {
  private config: ToastConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null
  private httpClient: AxiosInstance

  constructor() {
    // Initialize configuration from environment variables
    this.config = {
      clientId: process.env.TOAST_CLIENT_ID || '',
      clientSecret: process.env.TOAST_CLIENT_SECRET || '',
      environment: (process.env.TOAST_ENVIRONMENT as 'sandbox' | 'production') || 'production',
      baseUrl: process.env.TOAST_BASE_URL || 'https://ws-api.toasttab.com',
      authUrl: process.env.TOAST_AUTH_URL || 'https://authentication.toasttab.com',
      restaurantGuid: process.env.TOAST_RESTAURANT_GUID || '',
      managementGroupGuid: process.env.TOAST_MANAGEMENT_GROUP_GUID || ''
    }

    // Validate required configuration
    this.validateConfig()

    // Initialize HTTP client with default headers
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // Add request interceptor for automatic token refresh and restaurant GUID
    this.httpClient.interceptors.request.use(async (config) => {
      if (!this.isTokenValid()) {
        await this.refreshAccessToken()
      }
      
      if (this.accessToken && !config.url?.includes('oauth')) {
        config.headers.Authorization = `Bearer ${this.accessToken}`
        // CRITICAL: Toast API requires Restaurant-GUID header for authorization
        config.headers['Toast-Restaurant-External-ID'] = this.config.restaurantGuid
      }
      
      return config
    })

    // Add response interceptor for error handling and logging
    this.httpClient.interceptors.response.use(
      (response) => {
        // Log successful responses for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`📡 Toast API Success: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`)
        }
        return response
      },
      async (error) => {
        // Log error details for debugging
        console.error(`❌ Toast API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`)
        console.error(`Status: ${error.response?.status}, Message: ${error.response?.data?.message || error.message}`)
        
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true
          console.log('🔄 Refreshing Toast token due to 401 error...')
          await this.refreshAccessToken()
          error.config.headers.Authorization = `Bearer ${this.accessToken}`
          error.config.headers['Toast-Restaurant-External-ID'] = this.config.restaurantGuid
          return this.httpClient.request(error.config)
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * Validate required configuration
   */
  private validateConfig(): void {
    const required = ['clientId', 'clientSecret', 'restaurantGuid']
    const missing = required.filter(key => !this.config[key as keyof ToastConfig])
    
    if (missing.length > 0) {
      throw new Error(`Missing required Toast API configuration: ${missing.join(', ')}`)
    }
  }

  /**
   * Check if access token is valid and not expired
   */
  private isTokenValid(): boolean {
    return !!(
      this.accessToken && 
      this.tokenExpiry && 
      this.tokenExpiry > new Date()
    )
  }

  /**
   * OAuth 2.0 Authentication - Get access token with all required scopes
   */
  public async authenticate(): Promise<ToastServiceResponse<ToastAuthResponse>> {
    try {
      const scopes = process.env.TOAST_SCOPES || 'cashmgmt:read config:read delivery_info.address:read digital_schedule:read guest.pi:read kitchen:read labor:read labor.employees:read menus:read orders:read packaging:read restaurants:read stock:read'
      
      const tokenData = qs.stringify({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        scope: scopes
      })

      const response: AxiosResponse<ToastAuthResponse> = await axios.post(
        `${this.config.authUrl}/v1/oauth/token`,
        tokenData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      const { access_token, expires_in, scope } = response.data
      
      // Store token and calculate expiry (subtract 60 seconds for buffer)
      this.accessToken = access_token
      this.tokenExpiry = new Date(Date.now() + (expires_in - 60) * 1000)

      console.log(`✅ Toast POS authenticated successfully`)
      console.log(`🔑 Token expires: ${this.tokenExpiry}`)
      console.log(`🏪 Restaurant GUID: ${this.config.restaurantGuid}`)
      console.log(`📋 Granted scopes: ${scope || 'all requested scopes'}`)

      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.error('❌ Toast authentication failed:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.error_description || 'Authentication failed'
      }
    }
  }

  /**
   * Refresh access token automatically
   */
  private async refreshAccessToken(): Promise<void> {
    const result = await this.authenticate()
    if (!result.success) {
      throw new Error(`Token refresh failed: ${result.error}`)
    }
  }

  /**
   * Get restaurant information
   */
  public async getRestaurant(): Promise<ToastServiceResponse<ToastRestaurant>> {
    try {
      const response = await this.httpClient.get<ToastApiResponse<ToastRestaurant>>(
        `${this.config.baseUrl}/config/v1/restaurants/${this.config.restaurantGuid}`
      )

      return {
        success: true,
        data: response.data.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch restaurant info'
      }
    }
  }

  /**
   * Get all menu items for the restaurant
   */
  public async getMenuItems(options: ToastSyncOptions = {}): Promise<ToastServiceResponse<ToastMenuItem[]>> {
    try {
      const params = {
        pageSize: options.pageSize || 100,
        ...(options.startDate && { startDate: options.startDate }),
        ...(options.endDate && { endDate: options.endDate })
      }

      const response = await this.httpClient.get<ToastApiResponse<ToastMenuItem[]>>(
        `${this.config.baseUrl}/config/v1/restaurants/${this.config.restaurantGuid}/menuItems`,
        { params }
      )

      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination ? {
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalResults: response.data.pagination.totalResults
        } : undefined
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch menu items'
      }
    }
  }

  /**
   * Get menu groups (categories)
   */
  public async getMenuGroups(): Promise<ToastServiceResponse<ToastMenuGroup[]>> {
    try {
      const response = await this.httpClient.get<ToastApiResponse<ToastMenuGroup[]>>(
        `${this.config.baseUrl}/config/v1/restaurants/${this.config.restaurantGuid}/menuGroups`
      )

      return {
        success: true,
        data: response.data.data || []
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch menu groups'
      }
    }
  }

  /**
   * Get orders within a date range
   */
  public async getOrders(options: ToastSyncOptions = {}): Promise<ToastServiceResponse<ToastOrder[]>> {
    try {
      const today = new Date()
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      
      const params = {
        startDate: options.startDate || yesterday.toISOString().split('T')[0],
        endDate: options.endDate || today.toISOString().split('T')[0],
        pageSize: options.pageSize || 100
      }

      const response = await this.httpClient.get<ToastApiResponse<ToastOrder[]>>(
        `${this.config.baseUrl}/orders/v2/restaurants/${this.config.restaurantGuid}/orders`,
        { params }
      )

      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination ? {
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalResults: response.data.pagination.totalResults
        } : undefined
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders'
      }
    }
  }

  /**
   * Get specific order by GUID
   */
  public async getOrder(orderGuid: string): Promise<ToastServiceResponse<ToastOrder>> {
    try {
      const response = await this.httpClient.get<ToastApiResponse<ToastOrder>>(
        `${this.config.baseUrl}/orders/v2/restaurants/${this.config.restaurantGuid}/orders/${orderGuid}`
      )

      return {
        success: true,
        data: response.data.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order'
      }
    }
  }

  /**
   * Get customers
   */
  public async getCustomers(options: ToastSyncOptions = {}): Promise<ToastServiceResponse<ToastCustomer[]>> {
    try {
      const params = {
        pageSize: options.pageSize || 100,
        ...(options.startDate && { startDate: options.startDate }),
        ...(options.endDate && { endDate: options.endDate })
      }

      const response = await this.httpClient.get<ToastApiResponse<ToastCustomer[]>>(
        `${this.config.baseUrl}/customers/v1/restaurants/${this.config.restaurantGuid}/customers`,
        { params }
      )

      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination ? {
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalResults: response.data.pagination.totalResults
        } : undefined
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch customers'
      }
    }
  }

  /**
   * Get time entries (labor data)
   */
  public async getTimeEntries(options: ToastSyncOptions = {}): Promise<ToastServiceResponse<ToastTimeEntry[]>> {
    try {
      const today = new Date()
      const params = {
        businessDate: options.startDate || today.toISOString().split('T')[0],
        pageSize: options.pageSize || 100
      }

      const response = await this.httpClient.get<ToastApiResponse<ToastTimeEntry[]>>(
        `${this.config.baseUrl}/labor/v1/restaurants/${this.config.restaurantGuid}/timeEntries`,
        { params }
      )

      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination ? {
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalResults: response.data.pagination.totalResults
        } : undefined
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch time entries'
      }
    }
  }

  /**
   * Sync all restaurant data - comprehensive data pull
   */
  public async syncAllData(options: ToastSyncOptions = {}): Promise<ToastServiceResponse<{
    restaurant: ToastRestaurant | undefined
    menuItems: ToastMenuItem[]
    orders: ToastOrder[]
    customers: ToastCustomer[]
    timeEntries: ToastTimeEntry[]
  }>> {
    try {
      console.log('🔄 Starting comprehensive Toast POS data sync...')

      // Execute all API calls in parallel for efficiency
      const [
        restaurantResult,
        menuItemsResult,
        ordersResult,
        customersResult,
        timeEntriesResult
      ] = await Promise.all([
        this.getRestaurant(),
        this.getMenuItems(options),
        this.getOrders(options),
        this.getCustomers(options),
        this.getTimeEntries(options)
      ])

      // Check for any critical failures
      const errors: string[] = []
      if (!restaurantResult.success) errors.push(`Restaurant: ${restaurantResult.error}`)
      if (!menuItemsResult.success) errors.push(`Menu Items: ${menuItemsResult.error}`)
      if (!ordersResult.success) errors.push(`Orders: ${ordersResult.error}`)
      if (!customersResult.success) errors.push(`Customers: ${customersResult.error}`)
      if (!timeEntriesResult.success) errors.push(`Time Entries: ${timeEntriesResult.error}`)

      if (errors.length > 0) {
        console.warn('⚠️  Some data sync operations failed:', errors)
      }

      const syncedData = {
        restaurant: restaurantResult.data,
        menuItems: menuItemsResult.data || [],
        orders: ordersResult.data || [],
        customers: customersResult.data || [],
        timeEntries: timeEntriesResult.data || []
      }

      console.log('✅ Toast POS data sync completed:', {
        restaurant: !!syncedData.restaurant,
        menuItems: syncedData.menuItems.length,
        orders: syncedData.orders.length,
        customers: syncedData.customers.length,
        timeEntries: syncedData.timeEntries.length
      })

      return {
        success: true,
        data: syncedData
      }
    } catch (error: any) {
      console.error('❌ Comprehensive data sync failed:', error)
      return {
        success: false,
        error: error.message || 'Data sync failed'
      }
    }
  }

  /**
   * Test connection to Toast POS API
   */
  public async testConnection(): Promise<ToastServiceResponse<{
    authenticated: boolean
    restaurant: string | null
    apiVersion: string
    timestamp: string
  }>> {
    try {
      // First test authentication
      const authResult = await this.authenticate()
      if (!authResult.success) {
        return {
          success: false,
          error: `Authentication failed: ${authResult.error}`
        }
      }

      // Test restaurant API call
      const restaurantResult = await this.getRestaurant()
      
      return {
        success: true,
        data: {
          authenticated: true,
          restaurant: restaurantResult.data?.restaurantName || null,
          apiVersion: 'v1/v2',
          timestamp: new Date().toISOString()
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Connection test failed'
      }
    }
  }

  /**
   * Get configuration summary
   */
  public getConfig(): Partial<ToastConfig> {
    return {
      environment: this.config.environment,
      baseUrl: this.config.baseUrl,
      restaurantGuid: this.config.restaurantGuid,
      // Don't expose sensitive data
      clientId: this.config.clientId ? `${this.config.clientId.substring(0, 8)}...` : 'Not set'
    }
  }
}

// Create singleton instance
export const toastPOS = new ToastPOSService()
export default toastPOS