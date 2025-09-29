import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();

interface ToastConfig {
  clientId: string;
  clientSecret: string;
  environment: string;
  baseUrl: string;
  authUrl: string;
  restaurantGuid: string;
  managementGroupGuid: string;
}

interface ToastAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface ToastPagination {
  page: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ToastServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: ToastPagination;
  metadata?: {
    requestId?: string;
    executionTime?: number;
    timestamp?: string;
    orderCount?: number;
    [key: string]: any;
  };
}

/**
 * Toast POS API Service
 * Comprehensive service for Toast POS system integration
 * Supports OAuth 2.0, real-time data sync, and complete restaurant operations
 */
export class ToastPOSService {
  private config: ToastConfig;
  private httpClient: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    // Initialize configuration from environment variables
    this.config = {
      clientId: process.env.TOAST_CLIENT_ID || '',
      clientSecret: process.env.TOAST_CLIENT_SECRET || '',
      environment: process.env.TOAST_ENVIRONMENT || 'production',
      baseUrl: process.env.TOAST_BASE_URL || 'https://ws-api.toasttab.com',
      authUrl: process.env.TOAST_AUTH_URL || 'https://ws-api.toasttab.com',
      restaurantGuid: process.env.TOAST_RESTAURANT_GUID || '',
      managementGroupGuid: process.env.TOAST_MANAGEMENT_GROUP_GUID || ''
    };

    // Validate required configuration
    this.validateConfig();

    // Initialize HTTP client with default headers
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor for automatic token refresh and restaurant GUID
    this.httpClient.interceptors.request.use(async (config) => {
      if (!this.isTokenValid()) {
        await this.refreshAccessToken();
      }
      
      if (this.accessToken && !config.url?.includes('oauth')) {
        config.headers!.Authorization = `Bearer ${this.accessToken}`;
        // CRITICAL: Toast API requires Restaurant-GUID header for authorization
        config.headers!['Toast-Restaurant-External-ID'] = this.config.restaurantGuid;
      }
      
      return config;
    });

    // Add response interceptor for error handling and logging
    this.httpClient.interceptors.response.use(
      (response) => {
        // Log successful responses for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`📡 Toast API Success: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
        }
        return response;
      },
      async (error) => {
        // Log error details for debugging
        console.error(`❌ Toast API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.error(`Status: ${error.response?.status}, Message: ${error.response?.data?.message || error.message}`);
        
        if (error.response?.status === 401 && !(error.config as any)._retry) {
          (error.config as any)._retry = true;
          console.log('🔄 Refreshing Toast token due to 401 error...');
          await this.refreshAccessToken();
          error.config.headers.Authorization = `Bearer ${this.accessToken}`;
          error.config.headers['Toast-Restaurant-External-ID'] = this.config.restaurantGuid;
          return this.httpClient.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Validate required configuration
   */
  private validateConfig(): void {
    const required = ['clientId', 'clientSecret', 'restaurantGuid'];
    const missing = required.filter(key => !this.config[key as keyof ToastConfig]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required Toast API configuration: ${missing.join(', ')}`);
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
    );
  }

  /**
   * OAuth 2.0 Client Credentials Flow for Toast API
   */
  async refreshAccessToken(): Promise<ToastServiceResponse<ToastAuthResponse>> {
    try {
      console.log('🔐 Authenticating with Toast API...');

      const authData = {
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      };

      const response: AxiosResponse<ToastAuthResponse> = await axios.post(
        `${this.config.baseUrl}/authentication/v1/authentication/login`,
        authData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Toast-Restaurant-External-ID': this.config.restaurantGuid
          },
          timeout: 10000
        }
      );

      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        // Set expiry with 5-minute buffer for safety
        this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000) - 300000);
        
        console.log('✅ Toast authentication successful');
        return {
          success: true,
          data: response.data,
          message: 'Authentication successful'
        };
      } else {
        throw new Error('Invalid authentication response from Toast API');
      }
    } catch (error: any) {
      console.error('❌ Toast authentication failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error_description || error.message || 'Authentication failed'
      };
    }
  }

  /**
   * Test Toast API connection
   */
  async testConnection(): Promise<ToastServiceResponse> {
    try {
      console.log('🧪 Testing Toast POS connection...');
      
      // First authenticate
      const authResult = await this.refreshAccessToken();
      if (!authResult.success) {
        return {
          success: false,
          error: 'Authentication failed',
          message: authResult.error
        };
      }

      // Try to get restaurant info
      const restaurantResult = await this.getRestaurant();
      if (!restaurantResult.success) {
        return {
          success: false,
          error: 'Failed to retrieve restaurant information',
          message: restaurantResult.error
        };
      }

      return {
        success: true,
        message: 'Toast POS connection successful',
        data: {
          authenticated: true,
          restaurant: restaurantResult.data,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Connection test failed',
        message: error.message
      };
    }
  }

  /**
   * Get restaurant information
   */
  async getRestaurant(): Promise<ToastServiceResponse> {
    try {
      console.log('🏪 Fetching restaurant information...');
      const response = await this.httpClient.get('/restaurants/v1/restaurants');
      return {
        success: true,
        data: response.data,
        message: 'Restaurant information retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch restaurant information'
      };
    }
  }

  /**
   * Get menu information (alias for backward compatibility)
   */
  async getMenus(): Promise<ToastServiceResponse> {
    return this.getMenuItems();
  }

  /**
   * Get configuration (for debugging)
   */
  getConfig(): Partial<ToastConfig> {
    return {
      environment: this.config.environment,
      baseUrl: this.config.baseUrl,
      restaurantGuid: this.config.restaurantGuid
    };
  }

  /**
   * Direct authenticate method for backward compatibility
   */
  async authenticate(): Promise<ToastServiceResponse<ToastAuthResponse>> {
    return this.refreshAccessToken();
  }

  /**
   * Get orders with pagination support
   */
  async getOrders(startDateOrOptions?: string | any, endDate?: string): Promise<ToastServiceResponse> {
    try {
      console.log('📦 Fetching orders...');
      
      let startDate: string | undefined;
      let actualEndDate: string | undefined;
      let page = 1;
      let pageSize = 50;
      
      // Handle both string parameters and options object
      if (typeof startDateOrOptions === 'string') {
        startDate = startDateOrOptions;
        actualEndDate = endDate;
      } else if (startDateOrOptions && typeof startDateOrOptions === 'object') {
        startDate = startDateOrOptions.startDate;
        actualEndDate = startDateOrOptions.endDate;
        page = startDateOrOptions.page || 1;
        pageSize = startDateOrOptions.pageSize || 50;
      }
      
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (actualEndDate) params.append('endDate', actualEndDate);
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      
      const endpoint = `/orders/v2/orders?${params.toString()}`;
      const response = await this.httpClient.get(endpoint);
      
      // Mock pagination data since Toast API may not return it in expected format
      const orders = Array.isArray(response.data) ? response.data : response.data?.data || [];
      const totalResults = orders.length;
      const totalPages = Math.ceil(totalResults / pageSize);
      
      const pagination: ToastPagination = {
        page,
        pageSize,
        totalResults,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };
      
      return {
        success: true,
        data: orders,
        message: 'Orders retrieved successfully',
        pagination,
        metadata: {
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch orders'
      };
    }
  }

  /**
   * Get single order by ID
   */
  async getOrder(orderId: string): Promise<ToastServiceResponse> {
    try {
      console.log(`📦 Fetching order ${orderId}...`);
      const response = await this.httpClient.get(`/orders/v2/orders/${orderId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Order retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch order'
      };
    }
  }

  /**
   * Get menu items with pagination support
   */
  async getMenuItems(options?: any): Promise<ToastServiceResponse> {
    try {
      console.log('� Fetching menu items...');
      
      const page = options?.page || 1;
      const pageSize = options?.pageSize || 50;
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      
      const endpoint = `/menus/v1/menus?${params.toString()}`;
      const response = await this.httpClient.get(endpoint);
      
      // Extract menu items from nested structure
      const menus = Array.isArray(response.data) ? response.data : response.data?.data || [];
      const menuItems = menus.flatMap((menu: any) => menu.menuItems || []);
      
      const totalResults = menuItems.length;
      const totalPages = Math.ceil(totalResults / pageSize);
      
      const pagination: ToastPagination = {
        page,
        pageSize,
        totalResults,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };
      
      return {
        success: true,
        data: menuItems,
        message: 'Menu items retrieved successfully',
        pagination,
        metadata: {
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch menu items'
      };
    }
  }

  /**
   * Get customers with pagination support
   */
  async getCustomers(options?: any): Promise<ToastServiceResponse> {
    try {
      console.log('👥 Fetching customers...');
      
      const page = options?.page || 1;
      const pageSize = options?.pageSize || 50;
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      
      const endpoint = `/customers/v1/customers?${params.toString()}`;
      const response = await this.httpClient.get(endpoint);
      
      const customers = Array.isArray(response.data) ? response.data : response.data?.data || [];
      const totalResults = customers.length;
      const totalPages = Math.ceil(totalResults / pageSize);
      
      const pagination: ToastPagination = {
        page,
        pageSize,
        totalResults,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };
      
      return {
        success: true,
        data: customers,
        message: 'Customers retrieved successfully',
        pagination,
        metadata: {
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch customers'
      };
    }
  }

  /**
   * Sync all data from Toast API
   */
  async syncAllData(options?: any): Promise<ToastServiceResponse> {
    try {
      console.log('🔄 Syncing all data from Toast...');
      
      const startTime = Date.now();
      
      const [restaurant, menus, orders, customers] = await Promise.all([
        this.getRestaurant(),
        this.getMenus(),
        this.getOrders(),
        this.getCustomers()
      ]);

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          restaurant: restaurant.data,
          menus: menus.data,
          orders: orders.data,
          customers: customers.data,
          syncStats: {
            restaurantSynced: restaurant.success,
            menusSynced: menus.success,
            ordersSynced: orders.success,
            customersSynced: customers.success
          }
        },
        message: 'All data synced successfully',
        metadata: {
          executionTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sync data'
      };
    }
  }

  /**
   * Get comprehensive analytics from Toast data
   */
  async getAnalytics(startDate?: string, endDate?: string): Promise<ToastServiceResponse> {
    try {
      console.log('📊 Generating comprehensive analytics...');
      
      const ordersResult = await this.getOrders(startDate, endDate);
      if (!ordersResult.success) {
        return ordersResult;
      }

      const orders = ordersResult.data || [];
      
      // Calculate comprehensive analytics
      const analytics = this.calculateAnalytics(orders, startDate, endDate);

      return {
        success: true,
        data: analytics,
        message: 'Analytics generated successfully',
        metadata: {
          timestamp: new Date().toISOString(),
          orderCount: orders.length
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to generate analytics'
      };
    }
  }

  /**
   * Calculate comprehensive analytics from order data
   */
  private calculateAnalytics(orders: any[], startDate?: string, endDate?: string) {
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + (order.checks?.reduce((checkSum: number, check: any) => checkSum + (check.totalAmount || 0), 0) || 0);
    }, 0);

    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group orders by service type
    const ordersByService = orders.reduce((acc: Record<string, number>, order: any) => {
      const service = order.diningOption?.name || order.restaurantService || 'unknown';
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {});

    // Hourly breakdown
    const hourlyBreakdown = this.getOrdersByHour(orders);

    // Payment methods analysis
    const paymentMethods = this.getPaymentMethodsAnalysis(orders);

    // Top selling items (if menu items are available in order data)
    const topSellingItems = this.getTopSellingItems(orders);

    // Customer analysis
    const customerStats = this.getCustomerStats(orders);

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        period: {
          startDate: startDate || 'recent',
          endDate: endDate || 'now'
        }
      },
      ordersByService,
      hourlyBreakdown,
      paymentMethods,
      topSellingItems,
      customerStats,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Get detailed hourly order breakdown
   */
  private getOrdersByHour(orders: any[]) {
    const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orders: 0,
      revenue: 0,
      averageOrderValue: 0
    }));
    
    orders.forEach((order: any) => {
      const hour = new Date(order.orderOpenedDate || order.openedDate).getHours();
      const revenue = order.checks?.reduce((sum: number, check: any) => sum + (check.totalAmount || 0), 0) || 0;
      
      hourlyBreakdown[hour].orders++;
      hourlyBreakdown[hour].revenue += revenue;
      hourlyBreakdown[hour].averageOrderValue = hourlyBreakdown[hour].orders > 0 
        ? hourlyBreakdown[hour].revenue / hourlyBreakdown[hour].orders 
        : 0;
    });
    
    return hourlyBreakdown;
  }

  /**
   * Analyze payment methods usage
   */
  private getPaymentMethodsAnalysis(orders: any[]) {
    const paymentMethods: Record<string, { count: number; amount: number; percentage: number }> = {};
    let totalAmount = 0;
    let totalTransactions = 0;
    
    orders.forEach((order: any) => {
      order.checks?.forEach((check: any) => {
        check.payments?.forEach((payment: any) => {
          const method = payment.type || 'unknown';
          const amount = payment.amount || 0;
          
          if (!paymentMethods[method]) {
            paymentMethods[method] = { count: 0, amount: 0, percentage: 0 };
          }
          
          paymentMethods[method].count++;
          paymentMethods[method].amount += amount;
          totalAmount += amount;
          totalTransactions++;
        });
      });
    });

    // Calculate percentages
    Object.keys(paymentMethods).forEach(method => {
      paymentMethods[method].percentage = totalAmount > 0 
        ? (paymentMethods[method].amount / totalAmount) * 100 
        : 0;
    });
    
    return {
      methods: paymentMethods,
      totals: {
        totalAmount,
        totalTransactions
      }
    };
  }

  /**
   * Get top selling items from order data
   */
  private getTopSellingItems(orders: any[]) {
    const itemStats: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    orders.forEach((order: any) => {
      order.checks?.forEach((check: any) => {
        check.selections?.forEach((selection: any) => {
          const itemId = selection.item?.guid || selection.itemGroup?.guid || 'unknown';
          const itemName = selection.item?.name || selection.itemGroup?.name || 'Unknown Item';
          const quantity = selection.quantity || 0;
          const revenue = selection.price || 0;
          
          if (!itemStats[itemId]) {
            itemStats[itemId] = { name: itemName, quantity: 0, revenue: 0 };
          }
          
          itemStats[itemId].quantity += quantity;
          itemStats[itemId].revenue += revenue;
        });
      });
    });
    
    // Sort by quantity and return top 10
    return Object.entries(itemStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }

  /**
   * Get customer statistics
   */
  private getCustomerStats(orders: any[]) {
    const uniqueCustomers = new Set();
    let totalGuests = 0;
    let ordersWithCustomers = 0;
    
    orders.forEach((order: any) => {
      if (order.customer?.guid) {
        uniqueCustomers.add(order.customer.guid);
        ordersWithCustomers++;
      }
      totalGuests += order.numberOfGuests || 1;
    });
    
    return {
      uniqueCustomers: uniqueCustomers.size,
      totalGuests,
      averageGuestsPerOrder: orders.length > 0 ? totalGuests / orders.length : 0,
      customerOrderRate: orders.length > 0 ? (ordersWithCustomers / orders.length) * 100 : 0
    };
  }
}

// Create and export instance for backward compatibility
export const toastPOS = new ToastPOSService();
export default ToastPOSService;