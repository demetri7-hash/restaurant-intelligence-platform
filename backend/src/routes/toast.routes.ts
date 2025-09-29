import express from 'express'
import { PrismaClient } from '@prisma/client'
import { toastPOS } from '../services/toastPOS.service.js'

const router = express.Router()
const prisma = new PrismaClient()

/**
 * Toast POS API Routes
 * Provides endpoints for Toast POS integration, data sync, and analytics
 */

// Test Toast API connection
router.get('/test-connection', async (req, res) => {
  try {
    console.log('🧪 Testing Toast POS connection...')
    
    const result = await toastPOS.testConnection()
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Toast POS connection successful',
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
    const result = await toastPOS.getRestaurant()
    
    if (result.success) {
      res.json({
        success: true,
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
    const options = {
      pageSize: parseInt(req.query.pageSize as string) || 100,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    }

    const result = await toastPOS.getMenuItems(options)
    
    if (result.success) {
      res.json({
        success: true,
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
    const options = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      pageSize: parseInt(req.query.pageSize as string) || 100
    }

    const result = await toastPOS.getOrders(options)
    
    if (result.success) {
      res.json({
        success: true,
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

// Get specific order by ID
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const result = await toastPOS.getOrder(orderId)
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
        error: result.error,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Order fetch failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Get customers from Toast
router.get('/customers', async (req, res) => {
  try {
    const options = {
      pageSize: parseInt(req.query.pageSize as string) || 100,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    }

    const result = await toastPOS.getCustomers(options)
    
    if (result.success) {
      res.json({
        success: true,
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

// Comprehensive data sync - Pull all Toast data
router.post('/sync', async (req, res) => {
  try {
    console.log('🔄 Starting Toast POS data synchronization...')
    
    const options = {
      startDate: req.body.startDate as string,
      endDate: req.body.endDate as string,
      pageSize: parseInt(req.body.pageSize as string) || 100
    }

    const result = await toastPOS.syncAllData(options)
    
    if (result.success && result.data) {
      // Store synchronized data in our database
      const syncResults = await Promise.allSettled([
        syncRestaurantData(result.data.restaurant),
        syncMenuData(result.data.menuItems),
        syncOrderData(result.data.orders),
        syncCustomerData(result.data.customers)
      ])

      const syncSummary = {
        restaurant: result.data.restaurant ? 'synced' : 'skipped',
        menuItems: result.data.menuItems.length,
        orders: result.data.orders.length,
        customers: result.data.customers.length,
        timeEntries: result.data.timeEntries.length,
        errors: syncResults.filter(r => r.status === 'rejected').map(r => 
          r.status === 'rejected' ? r.reason : null
        ).filter(Boolean)
      }

      console.log('✅ Toast POS data sync completed:', syncSummary)

      res.json({
        success: true,
        message: 'Toast POS data synchronized successfully',
        data: result.data,
        syncSummary,
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Data synchronization failed',
        error: result.error,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('❌ Toast sync error:', error)
    res.status(500).json({
      success: false,
      message: 'Synchronization failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Analytics endpoint - Toast data analytics
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    // Get recent Toast orders for analytics
    const ordersResult = await toastPOS.getOrders({
      startDate: startDate as string,
      endDate: endDate as string,
      pageSize: 500
    })

    if (!ordersResult.success || !ordersResult.data) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders for analytics',
        error: ordersResult.error
      })
    }

    // Calculate analytics from Toast data
    const orders = ordersResult.data
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.checks?.reduce((checkSum, check) => checkSum + check.totalAmount, 0) || 0)
    }, 0)

    const analytics = {
      totalOrders: orders.length,
      totalRevenue,
      averageTicket: orders.length > 0 ? totalRevenue / orders.length : 0,
      ordersByService: orders.reduce((acc, order) => {
        acc[order.restaurantService] = (acc[order.restaurantService] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      ordersByHour: getOrdersByHour(orders),
      topPaymentMethods: getTopPaymentMethods(orders),
      period: {
        startDate: startDate || 'recent',
        endDate: endDate || 'today'
      }
    }

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Analytics calculation failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Helper functions for data synchronization
async function syncRestaurantData(restaurant: any) {
  if (!restaurant) return

  await prisma.restaurant.upsert({
    where: { posLocationId: restaurant.guid },
    update: {
      name: restaurant.restaurantName,
      address: restaurant.address?.address1 || '',
      city: restaurant.address?.city || '',
      state: restaurant.address?.stateCode || '',
      zipCode: restaurant.address?.zipCode || '',
      phone: restaurant.phoneNumber || '',
      timezone: restaurant.timeZone,
      posSystem: 'toast',
      updatedAt: new Date()
    },
    create: {
      name: restaurant.restaurantName,
      slug: restaurant.restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      address: restaurant.address?.address1 || '',
      city: restaurant.address?.city || '',
      state: restaurant.address?.stateCode || '',
      zipCode: restaurant.address?.zipCode || '',
      country: restaurant.address?.countryCode || 'US',
      phone: restaurant.phoneNumber || '',
      cuisineType: 'Mixed', // Default, could be enhanced
      posSystem: 'toast',
      posLocationId: restaurant.guid,
      timezone: restaurant.timeZone,
      status: 'active'
    }
  })
}

async function syncMenuData(menuItems: any[]) {
  for (const item of menuItems) {
    if (item.isArchived) continue

    await prisma.menuItem.upsert({
      where: { 
        restaurantId_posItemId: {
          restaurantId: await getRestaurantId(),
          posItemId: item.guid
        }
      },
      update: {
        name: item.name,
        description: item.description || '',
        basePrice: item.pricingRules?.default || 0,
        status: item.visibility === 'NONE' ? 'inactive' : 'active',
        updatedAt: new Date()
      },
      create: {
        restaurantId: await getRestaurantId(),
        posItemId: item.guid,
        name: item.name,
        description: item.description || '',
        basePrice: item.pricingRules?.default || 0,
        status: item.visibility === 'NONE' ? 'inactive' : 'active'
      }
    })
  }
}

async function syncOrderData(orders: any[]) {
  for (const order of orders) {
    if (order.deleted || order.voided) continue

    const totalAmount = order.checks?.reduce((sum: number, check: any) => sum + check.totalAmount, 0) || 0

    await prisma.transaction.upsert({
      where: { posTransactionId: order.guid },
      update: {
        totalAmount,
        transactionDate: new Date(order.openedDate),
        paymentMethod: getPaymentMethod(order),
        orderType: mapOrderType(order.restaurantService),
        updatedAt: new Date()
      },
      create: {
        restaurantId: await getRestaurantId(),
        posTransactionId: order.guid,
        totalAmount,
        subtotal: totalAmount, // Simplified for now
        taxAmount: 0, // Would need to calculate from checks
        tipAmount: 0, // Would need to extract from payments
        transactionDate: new Date(order.openedDate),
        paymentMethod: getPaymentMethod(order),
        orderType: mapOrderType(order.restaurantService),
        guestCount: order.numberOfGuests || 1
      }
    })
  }
}

async function syncCustomerData(customers: any[]) {
  for (const customer of customers) {
    if (!customer.email && !customer.phone) continue

    await prisma.customer.upsert({
      where: { 
        restaurantId_posCustomerId: {
          restaurantId: await getRestaurantId(),
          posCustomerId: customer.guid
        }
      },
      update: {
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        updatedAt: new Date()
      },
      create: {
        restaurantId: await getRestaurantId(),
        posCustomerId: customer.guid,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || ''
      }
    })
  }
}

// Helper functions
async function getRestaurantId(): Promise<string> {
  const restaurant = await prisma.restaurant.findFirst({
    where: { posSystem: 'toast' }
  })
  
  if (!restaurant) {
    throw new Error('No Toast restaurant found in database')
  }
  
  return restaurant.id
}

function getPaymentMethod(order: any): string {
  const payments = order.checks?.flatMap((check: any) => check.payments || []) || []
  if (payments.length === 0) return 'unknown'
  
  const primaryPayment = payments[0]
  return primaryPayment.type.toLowerCase()
}

function mapOrderType(restaurantService: string): string {
  const mapping: Record<string, string> = {
    'DINE_IN': 'dine_in',
    'TAKEOUT': 'takeout',
    'DELIVERY': 'delivery',
    'CATERING': 'catering',
    'OTHER': 'other'
  }
  return mapping[restaurantService] || 'other'
}

function getOrdersByHour(orders: any[]): Record<number, number> {
  return orders.reduce((acc, order) => {
    const hour = new Date(order.openedDate).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {} as Record<number, number>)
}

function getTopPaymentMethods(orders: any[]): Record<string, number> {
  const payments = orders.flatMap(order => 
    order.checks?.flatMap((check: any) => check.payments || []) || []
  )
  
  return payments.reduce((acc, payment) => {
    acc[payment.type] = (acc[payment.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

export default router