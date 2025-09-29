import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection by querying restaurants
    const restaurantCount = await prisma.restaurant.count()
    const transactionCount = await prisma.transaction.count()
    const menuItemCount = await prisma.menuItem.count()

    // Get sample restaurant if exists
    const sampleRestaurant = await prisma.restaurant.findFirst({
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

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        databaseStatus: 'Connected to Koyeb PostgreSQL',
        counts: {
          restaurants: restaurantCount,
          transactions: transactionCount,
          menuItems: menuItemCount
        },
        sampleRestaurant: sampleRestaurant ? {
          name: sampleRestaurant.name,
          city: sampleRestaurant.city,
          state: sampleRestaurant.state,
          posSystem: sampleRestaurant.posSystem,
          status: sampleRestaurant.status,
          transactionCount: sampleRestaurant._count.transactions,
          menuItemCount: sampleRestaurant._count.menuItems,
          customerCount: sampleRestaurant._count.customers
        } : null,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}