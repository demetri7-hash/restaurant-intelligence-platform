import express from 'express'
import { toastPOS } from '../services/toastPOS.service.js'

const router = express.Router()

/**
 * Toast POS API Routes - Simplified for initial testing
 * Provides endpoints for Toast POS integration and live data access
 */

// Test Toast API connection
router.get('/test-connection', async (req, res) => {
  try {
    console.log('🧪 Testing Toast POS connection with real credentials...')
    
    const result = await toastPOS.testConnection()
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Toast POS connection successful! 🎉',
        data: {
          ...result.data,
          config: toastPOS.getConfig()
        },
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Toast POS connection failed',
        error: result.error,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('❌ Toast connection test error:', error)
    res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Get restaurant information from Toast
router.get('/restaurant', async (req, res) => {
  try {
    console.log('📋 Fetching restaurant info from Toast POS...')
    const result = await toastPOS.getRestaurant()
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Restaurant data retrieved successfully',
        data: result.data,
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch restaurant data',
        error: result.error,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Restaurant data fetch failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Get menu items from Toast
router.get('/menu-items', async (req, res) => {
  try {
    console.log('🍽️  Fetching menu items from Toast POS...')
    const options = {
      pageSize: parseInt(req.query.pageSize as string) || 20,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    }

    const result = await toastPOS.getMenuItems(options)
    
    if (result.success) {
      res.json({
        success: true,
        message: `Found ${result.data?.length || 0} menu items`,
        data: result.data,
        pagination: result.pagination,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch menu items',
        error: result.error,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Menu items fetch failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Get orders from Toast
router.get('/orders', async (req, res) => {
  try {
    console.log('📄 Fetching orders from Toast POS...')
    const options = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      pageSize: parseInt(req.query.pageSize as string) || 10
    }

    const result = await toastPOS.getOrders(options)
    
    if (result.success) {
      res.json({
        success: true,
        message: `Found ${result.data?.length || 0} orders`,
        data: result.data,
        pagination: result.pagination,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: result.error,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Orders fetch failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Get customers from Toast
router.get('/customers', async (req, res) => {
  try {
    console.log('👥 Fetching customers from Toast POS...')
    const options = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    }

    const result = await toastPOS.getCustomers(options)
    
    if (result.success) {
      res.json({
        success: true,
        message: `Found ${result.data?.length || 0} customers`,
        data: result.data,
        pagination: result.pagination,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customers',
        error: result.error,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Customers fetch failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Get comprehensive data overview
router.get('/overview', async (req, res) => {
  try {
    console.log('🔍 Fetching Toast POS data overview...')
    
    const options = {
      pageSize: 5 // Small sample for overview
    }

    // Get sample data from each endpoint
    const [
      restaurantResult,
      menuItemsResult,
      ordersResult,
      customersResult
    ] = await Promise.all([
      toastPOS.getRestaurant(),
      toastPOS.getMenuItems(options),
      toastPOS.getOrders(options),
      toastPOS.getCustomers(options)
    ])

    const overview = {
      restaurant: {
        success: restaurantResult.success,
        data: restaurantResult.data,
        error: restaurantResult.error
      },
      menuItems: {
        success: menuItemsResult.success,
        count: menuItemsResult.data?.length || 0,
        sample: menuItemsResult.data?.slice(0, 3) || [],
        error: menuItemsResult.error
      },
      orders: {
        success: ordersResult.success,
        count: ordersResult.data?.length || 0,
        sample: ordersResult.data?.slice(0, 2) || [],
        error: ordersResult.error
      },
      customers: {
        success: customersResult.success,
        count: customersResult.data?.length || 0,
        sample: customersResult.data?.slice(0, 2) || [],
        error: customersResult.error
      },
      summary: {
        totalEndpoints: 4,
        successfulEndpoints: [restaurantResult, menuItemsResult, ordersResult, customersResult]
          .filter(r => r.success).length,
        hasErrors: [restaurantResult, menuItemsResult, ordersResult, customersResult]
          .some(r => !r.success)
      }
    }

    res.json({
      success: true,
      message: 'Toast POS overview complete',
      data: overview,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Overview fetch failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Authentication status
router.get('/auth-status', async (req, res) => {
  try {
    const authResult = await toastPOS.authenticate()
    
    res.json({
      success: authResult.success,
      message: authResult.success ? 'Toast POS authenticated' : 'Authentication failed',
      data: {
        authenticated: authResult.success,
        config: toastPOS.getConfig(),
        scopes: process.env.TOAST_SCOPES?.split(' ') || []
      },
      error: authResult.error,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Auth status check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

export default router