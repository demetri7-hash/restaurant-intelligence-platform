import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
// Import Toast service for live API testing
import { ToastPOSService } from './services/toastPOS-clean.service.js'

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables only in development
// In production, Koyeb provides system environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

// Initialize Prisma client
const prisma = new PrismaClient()

// Initialize Toast POS service
const toastService = new ToastPOSService()

// Initialize Express app
const app = express()

// Port configuration
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Middleware
app.use(helmet()) // Security headers
app.use(compression()) // Gzip compression
app.use(morgan('combined')) // Logging
app.use(limiter) // Rate limiting
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant Intelligence Platform API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Database connection test
app.get('/api/test-connection', async (req, res) => {
  try {
    // Test database connection with actual queries
    const restaurantCount = await prisma.restaurant.count()
    const transactionCount = await prisma.transaction.count()
    const menuItemCount = await prisma.menuItem.count()

    // Get sample restaurant data
    const sampleRestaurant = await prisma.restaurant.findFirst({
      include: {
        transactions: {
          take: 5,
          orderBy: { transactionDate: 'desc' },
          include: {
            transactionItems: {
              include: {
                menuItem: true
              }
            }
          }
        },
        menuItems: {
          take: 10,
          where: { status: 'active' }
        }
      }
    })

    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        database: 'Koyeb PostgreSQL',
        status: 'Connected',
        counts: {
          restaurants: restaurantCount,
          transactions: transactionCount,
          menuItems: menuItemCount
        },
        sampleRestaurant: sampleRestaurant ? {
          id: sampleRestaurant.id,
          name: sampleRestaurant.name,
          city: sampleRestaurant.city,
          state: sampleRestaurant.state,
          posSystem: sampleRestaurant.posSystem,
          recentTransactions: sampleRestaurant.transactions.length,
          menuItems: sampleRestaurant.menuItems.length
        } : null
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Toast POS API Test Endpoint - Now with REAL API calls!
app.get('/api/toast/test-connection', async (req, res) => {
  try {
    console.log('🧪 Testing Toast POS connection with real credentials and restaurant GUID...')
    const result = await toastService.testConnection()
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Toast POS connection successful! 🎉',
        data: {
          ...result.data,
          authenticated: true
        },
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Toast POS connection failed',
        error: result.details || 'Connection failed',
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

// Get real restaurant data from Toast API
app.get('/api/toast/restaurant', async (req, res) => {
  try {
    console.log('📋 Fetching restaurant info from Toast POS...')
    const result = await toastService.getRestaurant()
    
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

// API Routes (to be implemented)
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { status: 'active' },
      include: {
        _count: {
          select: {
            transactions: true,
            menuItems: true,
            customers: true
          }
        }
      }
    })
    
    res.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

app.get('/api/analytics/dashboard/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params
    
    // Calculate today's metrics
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const [
      todayTransactions,
      totalCustomers,
      topMenuItems,
      recentTransactions
    ] = await Promise.all([
      // Today's transactions
      prisma.transaction.findMany({
        where: {
          restaurantId,
          transactionDate: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      
      // Total unique customers
      prisma.customer.count({
        where: { restaurantId }
      }),
      
      // Top menu items by quantity sold
      prisma.transactionItem.groupBy({
        by: ['itemName'],
        where: {
          transaction: {
            restaurantId,
            transactionDate: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        },
        _sum: {
          quantity: true,
          totalPrice: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      }),
      
      // Recent transactions
      prisma.transaction.findMany({
        where: { restaurantId },
        include: {
          customer: true,
          transactionItems: {
            include: {
              menuItem: true
            }
          }
        },
        orderBy: { transactionDate: 'desc' },
        take: 10
      })
    ])

    const todayRevenue = todayTransactions.reduce((sum: number, t: any) => sum + Number(t.totalAmount), 0)
    const averageTicket = todayTransactions.length > 0 ? todayRevenue / todayTransactions.length : 0

    res.json({
      success: true,
      data: {
        todayRevenue,
        totalTransactions: todayTransactions.length,
        averageTicket,
        totalCustomers,
        topMenuItems: topMenuItems.map((item: any) => ({
          name: item.itemName,
          quantity: item._sum.quantity || 0,
          revenue: Number(item._sum.totalPrice || 0)
        })),
        recentTransactions
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Serve static files from the frontend build (only in production)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend build directory
  const frontendBuildPath = path.join(__dirname, '../../frontend/out')
  console.log('Frontend build path:', frontendBuildPath)
  console.log('Path exists:', fs.existsSync(frontendBuildPath))
  
  app.use(express.static(frontendBuildPath))
  
  // Handle client-side routing - serve index.html for non-API routes
  app.use((req, res, next) => {
    // Skip API routes and health checks
    if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
      return next()
    }
    
    console.log('Serving SPA route for:', req.path)
    // Serve index.html for all other routes (SPA routing)
    res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err)
        return next()
      }
    })
  })
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Restaurant Intelligence Platform API running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🗄️  Database: Connected to Koyeb PostgreSQL`)
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
})

export default app