import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ToastPOSService } from '../services/toastPOS-clean.service.js'

const router = express.Router()
const prisma = new PrismaClient()

// Initialize Toast POS service instance  
const toastPOS = new ToastPOSService()

/**
 * Toast POS API Routes
 * Provides endpoints for Toast POS integration, data sync, and analytics
 */

// Get available date presets and current Pacific time info
router.get('/date-options', (req, res) => {
  try {
    const now = new Date()
    const pacificTime = now.toLocaleString('en-US', { 
      timeZone: 'America/Los_Angeles',
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
    
    const presets = {
      today: {
        ...getDateRange('today'),
        displayDates: {
          startDate: getPacificDateOnly(new Date()),
          endDate: getPacificDateOnly(new Date())
        }
      },
      yesterday: {
        ...getDateRange('yesterday'),
        displayDates: {
          startDate: getPacificDateOnly(new Date(new Date().getTime() - 24*60*60*1000)),
          endDate: getPacificDateOnly(new Date(new Date().getTime() - 24*60*60*1000))
        }
      },
      last7days: {
        ...getDateRange('last7days'),
        displayDates: {
          startDate: getPacificDateOnly(new Date(new Date().getTime() - 7*24*60*60*1000)),
          endDate: getPacificDateOnly(new Date())
        }
      },
      lastweek: {
        ...getDateRange('lastweek'),
        displayDates: {
          startDate: "Previous Monday",
          endDate: "Previous Sunday"
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        currentPacificTime: pacificTime,
        timezone: 'America/Los_Angeles',
        availablePresets: {
          today: { 
            label: 'Today', 
            description: 'Current business day',
            ...presets.today 
          },
          yesterday: { 
            label: 'Yesterday', 
            description: 'Previous business day',
            ...presets.yesterday 
          },
          last7days: { 
            label: 'Last 7 Days', 
            description: 'Past week including today',
            ...presets.last7days 
          },
          lastweek: { 
            label: 'Last Week', 
            description: 'Monday through Sunday of previous week',
            ...presets.lastweek 
          }
        },
        customDateInfo: {
          format: 'YYYY-MM-DD',
          parameters: 'startDate and endDate',
          example: '?startDate=2025-09-01&endDate=2025-09-28'
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get date options',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Debug configuration endpoint (for troubleshooting production issues)
router.get('/debug-config', (req, res) => {
  try {
    const config = toastPOS.getConfig()
    res.json({
      success: true,
      message: 'Toast configuration status',
      config: config,
      environment: {
        TOAST_CLIENT_ID: process.env.TOAST_CLIENT_ID ? `${process.env.TOAST_CLIENT_ID.substring(0, 8)}...` : 'NOT SET',
        TOAST_CLIENT_SECRET: process.env.TOAST_CLIENT_SECRET ? `${process.env.TOAST_CLIENT_SECRET.substring(0, 8)}...` : 'NOT SET',
        TOAST_RESTAURANT_GUID: process.env.TOAST_RESTAURANT_GUID ? `${process.env.TOAST_RESTAURANT_GUID.substring(0, 8)}...` : 'NOT SET'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get configuration',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

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
        details: result.details,
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

    const result = await toastPOS.getMenus()
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
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
    console.log('📦 Orders endpoint called with params:', req.query)
    const { preset, startDate: customStartDate, endDate: customEndDate, pageSize } = req.query
    
    // Get date range based on preset or custom dates
    const { startDate, endDate } = getDateRange(
      preset as string, 
      customStartDate as string, 
      customEndDate as string
    )
    
    console.log(`📦 Using date range (Pacific timezone): ${startDate} to ${endDate}`)
    if (preset) {
      console.log(`📦 Preset used: ${preset}`)
    }

    const result = await toastPOS.getOrders(startDate, endDate)
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
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

    const result = await toastPOS.getCustomers()
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
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

    const result = await toastPOS.syncAllData()
    
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
// Helper function to get dates in Pacific timezone with proper Toast API format
function getPacificDateTime(date: Date, isStartOfDay: boolean = true): string {
  // Create a new date in Pacific timezone
  const pacificOffset = -8 * 60; // Pacific Standard Time is UTC-8
  const isDST = isDaylightSavingTime(date);
  const offset = isDST ? -7 * 60 : -8 * 60; // PDT is UTC-7, PST is UTC-8
  
  const pacificDate = new Date(date.getTime() + (offset * 60 * 1000));
  
  if (isStartOfDay) {
    pacificDate.setUTCHours(0, 0, 0, 0);
  } else {
    pacificDate.setUTCHours(23, 59, 59, 999);
  }
  
  // Format for Toast API: yyyy-MM-dd'T'HH:mm:ss.SSSZ
  const year = pacificDate.getUTCFullYear();
  const month = String(pacificDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(pacificDate.getUTCDate()).padStart(2, '0');
  const hours = String(pacificDate.getUTCHours()).padStart(2, '0');
  const minutes = String(pacificDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(pacificDate.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(pacificDate.getUTCMilliseconds()).padStart(3, '0');
  
  const offsetHours = Math.abs(offset / 60);
  const offsetSign = offset < 0 ? '-' : '+';
  const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}00`;
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`;
}

function isDaylightSavingTime(date: Date): boolean {
  // Simple DST check for Pacific timezone (March-November roughly)
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  
  // DST starts second Sunday in March
  if (month < 2 || month > 10) return false; // Jan, Feb, Dec
  if (month > 2 && month < 10) return true; // Apr-Oct
  
  // March and November need day calculations
  if (month === 2) { // March
    return day >= (14 - dayOfWeek);
  } else { // November
    return day < (7 - dayOfWeek);
  }
}

function getPacificDateOnly(date: Date): string {
  // Get just the date part in Pacific timezone (YYYY-MM-DD)
  return date.toLocaleDateString('en-CA', { 
    timeZone: 'America/Los_Angeles'
  });
}

function getDateRange(preset?: string, customStartDate?: string, customEndDate?: string): { startDate: string, endDate: string } {
  const now = new Date();
  
  // Use custom dates if provided (convert to Toast API format)
  if (customStartDate && customEndDate) {
    const startDateObj = new Date(`${customStartDate}T00:00:00`);
    const endDateObj = new Date(`${customEndDate}T23:59:59`);
    return { 
      startDate: getPacificDateTime(startDateObj, true), 
      endDate: getPacificDateTime(endDateObj, false) 
    };
  }
  
  // Handle preset options
  switch (preset) {
    case 'today':
      return { 
        startDate: getPacificDateTime(now, true), 
        endDate: getPacificDateTime(now, false) 
      };
      
    case 'yesterday':
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return { 
        startDate: getPacificDateTime(yesterday, true), 
        endDate: getPacificDateTime(yesterday, false) 
      };
      
    case 'last7days':
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      return { 
        startDate: getPacificDateTime(sevenDaysAgo, true), 
        endDate: getPacificDateTime(now, false) 
      };
      
    case 'lastweek':
      // Get last Monday through Sunday in Pacific timezone
      const lastSunday = new Date(now);
      const daysFromSunday = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      lastSunday.setDate(now.getDate() - daysFromSunday - 7); // Go to last Sunday
      
      const lastMonday = new Date(lastSunday);
      lastMonday.setDate(lastSunday.getDate() + 1); // Monday after last Sunday
      
      return {
        startDate: getPacificDateTime(lastMonday, true),
        endDate: getPacificDateTime(lastSunday, false)
      };
      
    default:
      // Default to last 7 days
      const defaultStart = new Date(now);
      defaultStart.setDate(now.getDate() - 7);
      return { 
        startDate: getPacificDateTime(defaultStart, true), 
        endDate: getPacificDateTime(now, false) 
      };
  }
}

router.get('/analytics', async (req, res) => {
  try {
    console.log('📊 Analytics endpoint called with params:', req.query)
    const { preset, startDate: customStartDate, endDate: customEndDate } = req.query
    
    // Get date range based on preset or custom dates
    const { startDate, endDate } = getDateRange(
      preset as string, 
      customStartDate as string, 
      customEndDate as string
    )
    
    console.log(`📊 Using date range (Pacific timezone): ${startDate} to ${endDate}`)
    if (preset) {
      console.log(`📊 Preset used: ${preset}`)
    }
    
    // Get recent Toast orders for analytics with proper date format
    console.log('📊 Fetching Toast orders for analytics...')
    const ordersResult = await toastPOS.getOrders(startDate, endDate)

    if (!ordersResult.success) {
      console.error('❌ Failed to fetch orders for analytics:', ordersResult.error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders for analytics',
        error: ordersResult.error || 'Unknown error'
      })
    }

    if (!ordersResult.data) {
      console.log('⚠️ No order data returned from Toast API')
      return res.json({
        success: true,
        data: {
          summary: {
            totalRevenue: 0,
            totalOrders: 0,
            averageOrderValue: 0,
            totalCustomers: 0
          },
          salesTrends: [],
          topItems: [],
          customerMetrics: {
            newCustomers: 0,
            returningCustomers: 0,
            averageOrdersPerCustomer: 0
          }
        },
        message: 'No orders found for the specified period'
      })
    }

    console.log('✅ Toast orders fetched successfully, processing analytics...')
    
    // Calculate analytics from Toast data
    const orders = Array.isArray(ordersResult.data) ? ordersResult.data : [ordersResult.data]
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + (order.checks?.reduce((checkSum: number, check: any) => 
        checkSum + (check.totalAmount || 0), 0) || 0)
    }, 0)

    const summary = {
      totalRevenue,
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      totalCustomers: new Set(orders.map((order: any) => order.guid).filter(Boolean)).size
    }

    // Mock sales trends for now (in real implementation, group by date)
    const salesTrends = [{
      date: new Date().toISOString().split('T')[0],
      revenue: totalRevenue,
      orders: orders.length
    }]

    // Mock top items (in real implementation, analyze order items)
    const topItems = [{
      name: 'Sample Item',
      revenue: totalRevenue * 0.3,
      quantity: Math.floor(orders.length * 0.4),
      category: 'Food'
    }]

    const analytics = {
      summary,
      salesTrends,
      topItems,
      customerMetrics: {
        newCustomers: Math.floor(summary.totalCustomers * 0.7),
        returningCustomers: Math.floor(summary.totalCustomers * 0.3),
        averageOrdersPerCustomer: summary.totalCustomers > 0 ? 
          summary.totalOrders / summary.totalCustomers : 0
      }
    }

    console.log('📊 Analytics calculated successfully:', summary)

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Analytics calculation failed:', error)
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

  // First check if restaurant exists by posLocationId
  const existingRestaurant = await prisma.restaurant.findFirst({
    where: { posLocationId: restaurant.guid }
  })

  if (existingRestaurant) {
    // Update existing restaurant
    await prisma.restaurant.update({
      where: { id: existingRestaurant.id },
      data: {
        name: restaurant.restaurantName,
        address: restaurant.address?.address1 || '',
        city: restaurant.address?.city || '',
        state: restaurant.address?.stateCode || '',
        zipCode: restaurant.address?.zipCode || '',
        phone: restaurant.phoneNumber || '',
        timezone: restaurant.timeZone,
        posSystem: 'toast',
        updatedAt: new Date()
      }
    })
  } else {
    // Create new restaurant
    await prisma.restaurant.create({
      data: {
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
}

async function syncMenuData(menuItems: any[]) {
  const restaurantId = await getRestaurantId()
  
  for (const item of menuItems) {
    if (item.isArchived) continue

    try {
      // Check if menu item exists
      const existingItem = await prisma.menuItem.findFirst({
        where: { 
          restaurantId: restaurantId,
          posItemId: item.guid
        }
      })

      const menuItemData = {
        name: item.name,
        description: item.description || '',
        basePrice: parseFloat(item.price) || 0,
        status: item.visibility === 'HIDDEN' ? 'inactive' : 'active',
        updatedAt: new Date()
      }

      if (existingItem) {
        await prisma.menuItem.update({
          where: { id: existingItem.id },
          data: menuItemData
        })
      } else {
        await prisma.menuItem.create({
          data: {
            ...menuItemData,
            restaurantId: restaurantId,
            posItemId: item.guid,
            isAvailable: !item.isArchived
          }
        })
      }
    } catch (error) {
      console.error(`Failed to sync menu item ${item.name}:`, error)
    }
  }
}

async function syncOrderData(orders: any[]) {
  const restaurantId = await getRestaurantId()
  
  for (const order of orders) {
    if (order.deleted || order.voided) continue

    try {
      const totalAmount = order.checks?.reduce((sum: number, check: any) => sum + (check.totalAmount || 0), 0) || 0
      const taxAmount = order.checks?.reduce((sum: number, check: any) => sum + (check.taxAmount || 0), 0) || 0
      const tipAmount = order.checks?.reduce((sum: number, check: any) => sum + (check.tipAmount || 0), 0) || 0

      // Check if transaction exists
      const existingTransaction = await prisma.transaction.findFirst({
        where: { posTransactionId: order.guid }
      })

      const transactionData = {
        totalAmount,
        subtotal: totalAmount - taxAmount,
        taxAmount,
        tipAmount,
        transactionDate: new Date(order.orderOpenedDate || order.openedDate),
        paymentMethod: getPaymentMethod(order),
        orderType: mapOrderType(order.diningOption?.name || order.restaurantService),
        guestCount: order.numberOfGuests || 1,
        updatedAt: new Date()
      }

      if (existingTransaction) {
        await prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: transactionData
        })
      } else {
        await prisma.transaction.create({
          data: {
            ...transactionData,
            restaurantId: restaurantId,
            posTransactionId: order.guid
          }
        })
      }
    } catch (error) {
      console.error(`Failed to sync order ${order.guid}:`, error)
    }
  }
}

async function syncCustomerData(customers: any[]) {
  const restaurantId = await getRestaurantId()
  
  for (const customer of customers) {
    if (!customer.email && !customer.phone) continue

    try {
      // Check if customer exists
      const existingCustomer = await prisma.customer.findFirst({
        where: { 
          restaurantId: restaurantId,
          posCustomerId: customer.guid
        }
      })

      const customerData = {
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        updatedAt: new Date()
      }

      if (existingCustomer) {
        await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: customerData
        })
      } else {
        await prisma.customer.create({
          data: {
            ...customerData,
            restaurantId: restaurantId,
            posCustomerId: customer.guid
          }
        })
      }
    } catch (error) {
      console.error(`Failed to sync customer ${customer.guid}:`, error)
    }
  }
}

// Placeholder functions for missing sync methods
async function syncMenuDataPlaceholder(menuItems: any[]) {
  console.log('Menu data sync not implemented yet')
}

async function syncOrderDataPlaceholder(orders: any[]) {
  console.log('Order data sync not implemented yet')
}

async function syncCustomerDataPlaceholder(customers: any[]) {
  console.log('Customer data sync not implemented yet')
}

// Helper functions for analytics
function getOrdersByHour(orders: any[]) {
  const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    orders: 0,
    revenue: 0
  }))
  
  orders.forEach((order: any) => {
    const hour = new Date(order.orderOpenedDate).getHours()
    const revenue = order.checks?.reduce((sum: number, check: any) => sum + check.totalAmount, 0) || 0
    hourlyBreakdown[hour].orders++
    hourlyBreakdown[hour].revenue += revenue
  })
  
  return hourlyBreakdown
}

function getTopPaymentMethods(orders: any[]) {
  const paymentMethods: Record<string, { count: number; amount: number }> = {}
  
  orders.forEach((order: any) => {
    order.checks?.forEach((check: any) => {
      check.payments?.forEach((payment: any) => {
        const method = payment.type || 'unknown'
        if (!paymentMethods[method]) {
          paymentMethods[method] = { count: 0, amount: 0 }
        }
        paymentMethods[method].count++
        paymentMethods[method].amount += payment.amount
      })
    })
  })
  
  return paymentMethods
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

export default router