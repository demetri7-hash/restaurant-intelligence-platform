import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

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
    
    if (missing.length > 0) {
      throw new Error(`Missing required Toast API configuration: ${missing.join(', ')}`);
    }
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
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const endpoint = `/orders/v2/orders${params.toString() ? '?' + params.toString() : ''}`;
    return await this.makeAuthenticatedRequest(endpoint);
  }

  async testConnection(): Promise<ToastConnectionTestResult> {
    try {
      console.log('Testing Toast POS connection...');
      
      // First authenticate
      const authResult = await this.authenticate();
      if (!authResult.success) {
        return {
          success: false,
          message: 'Authentication failed',
          details: authResult.error
        };
      }

      // Try to get restaurant info
      const restaurantResult = await this.getRestaurant();
      if (!restaurantResult.success) {
        return {
          success: false,
          message: 'Failed to retrieve restaurant information',
          details: restaurantResult.error
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
        message: 'Connection test failed',
        details: error.message
      };
    }
  }
}

export default ToastPOSService;