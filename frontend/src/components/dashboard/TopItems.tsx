'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { toastApi } from '../../services/toastApi'

interface TopItem {
  name: string
  orders: number
  revenue: number
  category?: string
  trend: 'up' | 'down' | 'stable'
}

export function TopItems() {
  const [topItems, setTopItems] = useState<TopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTopItems = async () => {
      try {
        setError(null)
        setLoading(true)
        console.log('🚀 Loading top-selling Toast items...')
        
        const analyticsResponse = await toastApi.getAnalytics({
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
          endDate: new Date().toISOString().split('T')[0],
          period: 'week'
        })

        if (analyticsResponse.success) {
          const { topItems: items } = analyticsResponse.data
          
          const formattedItems: TopItem[] = items.slice(0, 5).map((item, index) => ({
            name: item.name,
            orders: item.quantity,
            revenue: item.revenue,
            category: item.category,
            // Mock trend based on position - in real implementation, compare with previous period
            trend: index < 2 ? 'up' : index > 3 ? 'down' : 'stable'
          }))

          setTopItems(formattedItems)
          console.log('✅ Top Toast items loaded successfully:', formattedItems.length, 'items')
        }
      } catch (error) {
        console.error('❌ Error loading top items:', error)
        setError('Failed to load top-selling items')
        
        // Fallback data in case of error
        setTopItems([
          {
            name: 'Sample Menu Item',
            orders: 0,
            revenue: 0,
            trend: 'stable'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadTopItems()
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Selling Items</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse">
            <div className="text-gray-500">Loading top-selling items...</div>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Top Selling Items</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Items →
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {topItems.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No sales data available. Items will appear here once Toast POS orders start coming in.
        </div>
      ) : (
        <div className="space-y-4">
          {topItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{item.orders} orders</span>
                  <span>${item.revenue.toFixed(2)} revenue</span>
                  {item.category && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {getTrendIcon(item.trend)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}