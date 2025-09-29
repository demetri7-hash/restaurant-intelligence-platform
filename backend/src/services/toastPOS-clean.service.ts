import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
// Environment variables are loaded in main index.ts

interface ToastConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  authUrl: string;
  restaurantGuid: string;
}

interface ToastAuthResponse {
  token: {
    accessToken: string;
    expiresIn: number;
  };
}

interface ToastApiResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ToastConnectionTestResult {
  success: boolean;
  message: string;
  details?: string;
  data?: {
    authenticated: boolean;
    restaurant: any;
    timestamp: string;
  };
}

/**
 * Toast POS API Service
 * TypeScript implementation for Toast POS system integration
 */
export class ToastPOSService {
  private config: ToastConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.config = {
      clientId: process.env.TOAST_CLIENT_ID || '',
      clientSecret: process.env.TOAST_CLIENT_SECRET || '',
      baseUrl: process.env.TOAST_BASE_URL || 'https://ws-api.toasttab.com',
      authUrl: process.env.TOAST_AUTH_URL || 'https://authentication.toasttab.com',
      restaurantGuid: process.env.TOAST_RESTAURANT_GUID || ''
    };

    // Validate required configuration
    this.validateConfig();
  }

  // Method to get all available client secrets for testing
  private getClientSecrets(): string[] {
    const secrets: string[] = [];
    if (process.env.TOAST_CLIENT_SECRET) {
      secrets.push(process.env.TOAST_CLIENT_SECRET);
    }
    if (process.env.TOAST_CLIENT_SECRET2) {
      secrets.push(process.env.TOAST_CLIENT_SECRET2);
    }
    return secrets;
  }

  private validateConfig(): void {
    const required: (keyof ToastConfig)[] = ['clientId', 'clientSecret', 'restaurantGuid'];
    const missing = required.filter(key => !this.config[key]);
    
    console.log('🔧 Toast API Configuration:');
    console.log(`  Client ID: ${this.config.clientId ? this.config.clientId.substring(0, 8) + '...' : 'NOT SET'}`);
    console.log(`  Client Secret: ${this.config.clientSecret ? this.config.clientSecret.substring(0, 8) + '...' : 'NOT SET'}`);
    console.log(`  Restaurant GUID: ${this.config.restaurantGuid ? this.config.restaurantGuid.substring(0, 8) + '...' : 'NOT SET'}`);
    console.log(`  Base URL: ${this.config.baseUrl}`);
    console.log(`  Auth URL: ${this.config.authUrl}`);
    
    if (missing.length > 0) {
      const errorMsg = `Missing required Toast API configuration: ${missing.join(', ')}`;
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('✅ Toast API configuration validated successfully');
  }

  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry;
  }

  async authenticate(): Promise<ToastApiResult<{ token: string; expiresIn: number }>> {
    const secrets = this.getClientSecrets();
    console.log(`\n🔑 Testing authentication with ${secrets.length} client secrets...`);
    
    for (let i = 0; i < secrets.length; i++) {
      const secret = secrets[i];
      const secretLabel = `Secret ${i + 1}`;
      console.log(`\n🔍 Testing ${secretLabel}: ${secret.substring(0, 8)}...${secret.substring(secret.length - 8)}`);
      
      try {
        const result = await this.authenticateWithSecret(secret, secretLabel);
        if (result.success) {
          console.log(`✅ ${secretLabel} SUCCESS! Authentication worked.`);
          return result;
        } else {
          console.log(`❌ ${secretLabel} FAILED: ${result.error}`);
        }
      } catch (error: any) {
        console.log(`❌ ${secretLabel} ERROR: ${error.message}`);
      }
    }
    
    return {
      success: false,
      error: `All ${secrets.length} client secrets failed authentication`
    };
  }

  private async authenticateWithSecret(clientSecret: string, label: string): Promise<ToastApiResult<{ token: string; expiresIn: number }>> {
    try {
      console.log(`${label} - Making Toast authentication request...`);
      console.log(`${label} - Using Client ID: ${this.config.clientId}`);
      console.log(`${label} - Using Secret: ${clientSecret.substring(0, 8)}...${clientSecret.substring(clientSecret.length - 8)}`);
      
      // Toast API uses its own authentication endpoint with JSON format
      // NOT OAuth2 /oauth/token endpoint!
      const authEndpoint = `${this.config.baseUrl}/authentication/v1/authentication/login`;
      
      const requestData = {
        clientId: this.config.clientId,
        clientSecret: clientSecret,
        userAccessType: 'TOAST_MACHINE_CLIENT'
      };

      console.log(`${label} - Auth endpoint: ${authEndpoint}`);
      console.log(`${label} - Request data (JSON):`, JSON.stringify(requestData, null, 2));

      const response: AxiosResponse<any> = await axios.post(
        authEndpoint,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000,
          validateStatus: function (status) {
            return status < 500; // Don't throw on 4xx errors so we can see the response
          }
        }
      );

      console.log(`${label} - Response status:`, response.status);
      console.log(`${label} - Response headers:`, JSON.stringify(response.headers, null, 2));
      console.log(`${label} - Response data:`, JSON.stringify(response.data, null, 2));

      if (response.status === 200 && response.data) {
        // Toast API returns token in a specific format
        const accessToken = response.data.token?.accessToken;
        const expiresIn = response.data.token?.expiresIn || 3600;
        
        if (accessToken) {
          this.accessToken = accessToken;
          // Set expiry to 5 minutes before actual expiry for safety
          this.tokenExpiry = Date.now() + (expiresIn * 1000) - 300000;

          console.log(`${label} - Toast authentication successful!`);
          return {
            success: true,
            data: { 
              token: accessToken, 
              expiresIn: expiresIn 
            }
          };
        } else {
          console.log(`${label} - No access token in response`);
        }
      } else {
        console.log(`${label} - Authentication failed: HTTP ${response.status}`);
      }

      return {
        success: false,
        error: `Authentication failed with HTTP ${response.status}: ${JSON.stringify(response.data)}`
      };
    } catch (error: any) {
      console.error(`${label} - Toast authentication error:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Authentication failed'
      };
    }
  }

  private async makeAuthenticatedRequest<T = any>(
    endpoint: string, 
    options: AxiosRequestConfig = {}
  ): Promise<ToastApiResult<T>> {
    try {
      // Ensure we have a valid token
      if (!this.isTokenValid()) {
        const authResult = await this.authenticate();
        if (!authResult.success) {
          throw new Error(`Authentication failed: ${authResult.error}`);
        }
      }

      // Make the request with proper headers
      if (!this.accessToken) {
        throw new Error('No access token available');
      }
      
      const response: AxiosResponse<T> = await axios.get(`${this.config.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Toast-Restaurant-External-ID': this.config.restaurantGuid,
          'Content-Type': 'application/json',
          ...options.headers
        },
        timeout: 10000,
        ...options
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error(`Toast API request failed for ${endpoint}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'API request failed'
      };
    }
  }

  async getRestaurant(): Promise<ToastApiResult> {
    console.log('Getting restaurant information...');
    // Use the restaurant GUID in the endpoint path
    return await this.makeAuthenticatedRequest(`/restaurants/v1/restaurants/${this.config.restaurantGuid}`);
  }

  async getMenus(): Promise<ToastApiResult> {
    console.log('Getting menu information...');
    return await this.makeAuthenticatedRequest('/menus/v1/menus');
  }

  async getOrders(startDate?: string, endDate?: string): Promise<ToastApiResult> {
    console.log('Getting orders...');
    const params = new URLSearchParams();
    
    if (startDate && endDate) {
      // Check if it's the same day - if so, use businessDate instead to avoid 1-hour limit
      const start = new Date(startDate);
      const end = new Date(endDate);
      const sameDay = start.toDateString() === end.toDateString();
      
      if (sameDay) {
        // Use businessDate for same-day queries (avoids 1-hour limit)
        const businessDate = start.toISOString().split('T')[0]; // YYYY-MM-DD
        params.append('businessDate', businessDate);
        console.log(`📦 Using businessDate (same day): ${businessDate}`);
      } else {
        // Use date range for multi-day queries
        params.append('startDate', startDate);
        params.append('endDate', endDate);
        console.log(`📦 Using date range: ${startDate} to ${endDate}`);
      }
    } else {
      // Default to today's business date
      const today = new Date();
      const businessDate = today.toISOString().split('T')[0];
      params.append('businessDate', businessDate);
      console.log(`📦 Using default businessDate: ${businessDate}`);
    }
    
    const endpoint = `/orders/v2/orders?${params.toString()}`;
    console.log(`📦 Full orders URL: ${this.config.baseUrl}${endpoint}`);
    return await this.makeAuthenticatedRequest(endpoint);
  }

  async getOrder(orderId: string): Promise<ToastApiResult> {
    console.log(`Getting order ${orderId}...`);
    return await this.makeAuthenticatedRequest(`/orders/v2/orders/${orderId}`);
  }

  async getCustomers(): Promise<ToastApiResult> {
    console.log('Getting customers...');
    return await this.makeAuthenticatedRequest('/customers/v1/customers');
  }

  async syncAllData(): Promise<ToastApiResult> {
    console.log('Syncing all data...');
    // This would be a complex operation to sync all data
    // For now, just return a placeholder
    return {
      success: false,
      error: 'Sync all data not fully implemented yet'
    };
  }

  async testConnection(): Promise<ToastConnectionTestResult> {
    try {
      console.log('\n🧪 === TOAST POS CONNECTION TEST ===');
      console.log('Testing Toast POS connection...');
      
      // Check configuration first
      try {
        this.validateConfig();
      } catch (configError) {
        return {
          success: false,
          message: 'Configuration validation failed',
          details: configError instanceof Error ? configError.message : 'Invalid configuration'
        };
      }
      
      // First authenticate
      console.log('\n🔐 Step 1: Authentication...');
      const authResult = await this.authenticate();
      if (!authResult.success) {
        console.error('❌ Authentication failed:', authResult.error);
        return {
          success: false,
          message: 'Authentication failed',
          details: authResult.error
        };
      }
      
      console.log('✅ Authentication successful');

      // Try to get restaurant info
      console.log('\n🏪 Step 2: Testing restaurant data access...');
      const restaurantResult = await this.getRestaurant();
      if (!restaurantResult.success) {
        console.error('❌ Restaurant data access failed:', restaurantResult.error);
        return {
          success: false,
          message: 'Failed to retrieve restaurant information',
          details: restaurantResult.error
        };
      }

      console.log('✅ Restaurant data access successful');
      console.log('\n🎉 === TOAST POS CONNECTION TEST PASSED ===\n');

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
      console.error('❌ Toast API test connection failed:', error);
      return {
        success: false,
        message: 'Connection test failed',
        details: error.message
      };
    }
  }

  // Get configuration info for debugging (with sensitive data masked)
  getConfig() {
    return {
      clientId: this.config.clientId ? `${this.config.clientId.substring(0, 8)}...` : 'NOT SET',
      clientSecret: this.config.clientSecret ? `${this.config.clientSecret.substring(0, 8)}...` : 'NOT SET',
      restaurantGuid: this.config.restaurantGuid ? `${this.config.restaurantGuid.substring(0, 8)}...` : 'NOT SET',
      baseUrl: this.config.baseUrl,
      authUrl: this.config.authUrl,
      hasAccessToken: !!this.accessToken,
      tokenExpiry: this.tokenExpiry ? new Date(this.tokenExpiry).toISOString() : null
    };
  }
}

export default ToastPOSService;