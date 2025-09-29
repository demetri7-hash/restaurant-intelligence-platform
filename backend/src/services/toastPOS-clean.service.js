import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Toast POS API Service
 * Clean JavaScript implementation for Toast POS system integration
 */
export class ToastPOSService {
  constructor() {
    this.config = {
      clientId: process.env.TOAST_CLIENT_ID || '',
      clientSecret: process.env.TOAST_CLIENT_SECRET || '',
      baseUrl: 'https://ws-api.toasttab.com',
      restaurantGuid: process.env.TOAST_RESTAURANT_GUID || ''
    };

    this.accessToken = null;
    this.tokenExpiry = null;

    // Validate required configuration
    this.validateConfig();
  }

  validateConfig() {
    const required = ['clientId', 'clientSecret', 'restaurantGuid'];
    const missing = required.filter(key => !this.config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required Toast API configuration: ${missing.join(', ')}`);
    }
  }

  isTokenValid() {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry;
  }

  async authenticate() {
    try {
      console.log('Authenticating with Toast API...');
      
      // Use OAuth2 client-credentials flow as per Toast documentation
      const response = await axios.post(`${this.config.baseUrl}/authentication/v1/authentication/login`, {
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        userAccessType: 'TOAST_MACHINE_CLIENT'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      // Extract token from the response structure
      if (response.data && response.data.token) {
        const tokenData = response.data.token;
        this.accessToken = tokenData.accessToken;
        // Set expiry to 5 minutes before actual expiry for safety
        this.tokenExpiry = Date.now() + (tokenData.expiresIn * 1000) - 300000;

        console.log('Toast authentication successful');
        return {
          success: true,
          data: { 
            token: this.accessToken, 
            expiresIn: tokenData.expiresIn 
          }
        };
      } else {
        throw new Error('Invalid response structure from Toast API');
      }
    } catch (error) {
      console.error('Toast authentication failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Authentication failed'
      };
    }
  }

  async makeAuthenticatedRequest(endpoint, options = {}) {
    try {
      // Ensure we have a valid token
      if (!this.isTokenValid()) {
        const authResult = await this.authenticate();
        if (!authResult.success) {
          throw new Error(`Authentication failed: ${authResult.error}`);
        }
      }

      // Make the request with proper headers
      const response = await axios.get(`${this.config.baseUrl}${endpoint}`, {
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
    } catch (error) {
      console.error(`Toast API request failed for ${endpoint}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'API request failed'
      };
    }
  }

  async getRestaurant() {
    console.log('Getting restaurant information...');
    return await this.makeAuthenticatedRequest('/restaurants/v1/restaurants');
  }

  async getMenus() {
    console.log('Getting menu information...');
    return await this.makeAuthenticatedRequest('/menus/v1/menus');
  }

  async getOrders(startDate, endDate) {
    console.log('Getting orders...');
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const endpoint = `/orders/v2/orders${params.toString() ? '?' + params.toString() : ''}`;
    return await this.makeAuthenticatedRequest(endpoint);
  }

  async testConnection() {
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
    } catch (error) {
      return {
        success: false,
        message: 'Connection test failed',
        details: error.message
      };
    }
  }
}

export default ToastPOSService;