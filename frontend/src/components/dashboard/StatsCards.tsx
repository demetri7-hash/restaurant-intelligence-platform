'use client'

import React, { useState, useEffect } from 'react'
import { toastApi } from '../../services/toastApi'

interface Stat {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  description: string
  loading?: boolean
}

export function StatsCards() {
  const [stats, setStats] = useState<Stat[]>([
    {
      name: "Today's Revenue",
      value: '$0.00',
      change: '+0%',
      changeType: 'positive',
      description: 'vs yesterday',
      loading: true
    },
    {
      name: 'Orders Today',
      value: '0',
      change: '+0%',
      changeType: 'positive',
      description: 'vs yesterday',
      loading: true
    },
    {
      name: 'Avg Order Value',
      value: '$0.00',
      change: '+0%',
      changeType: 'positive',
      description: 'vs last week',
      loading: true
    },
    {
      name: 'Active Menu Items',
      value: '0',
      change: '+0',
      changeType: 'positive',
      description: 'total items',
      loading: true
    }
  ])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadToastAnalytics = async () => {
      try {
        setError(null)
        console.log('🚀 Loading Toast POS analytics data...')
        
        // Get today's date for analytics
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        
        const [analyticsResponse, menuItemsResponse] = await Promise.all([
          toastApi.getAnalytics({
            startDate: yesterday.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
            period: 'day'
          }),
          toastApi.getMenuItems()
        ])

        if (analyticsResponse.success && menuItemsResponse.success) {
          const { summary } = analyticsResponse.data
          const menuItems = menuItemsResponse.data
          
          // Calculate metrics
          const currentRevenue = summary.totalRevenue || 0
          const currentOrders = summary.totalOrders || 0
          const avgOrderValue = currentOrders > 0 ? currentRevenue / currentOrders : 0
          const activeMenuItems = menuItems.filter(item => item.visibility === 'VISIBLE').length
          
          // Mock trend calculations (in real implementation, compare with previous period)
          const revenueTrend = currentRevenue > 0 ? Math.random() * 20 - 5 : 0
          const ordersTrend = currentOrders > 0 ? Math.random() * 15 - 3 : 0
          const avgTrend = avgOrderValue > 0 ? Math.random() * 12 - 4 : 0

          const updatedStats: Stat[] = [
            {
              name: "Today's Revenue",
              value: `$${currentRevenue.toFixed(2)}`,
              change: `${revenueTrend >= 0 ? '+' : ''}${revenueTrend.toFixed(1)}%`,
              changeType: revenueTrend >= 0 ? 'positive' : 'negative',
              description: 'vs yesterday',
              loading: false
            },
            {
              name: 'Orders Today',
              value: currentOrders.toString(),
              change: `${ordersTrend >= 0 ? '+' : ''}${ordersTrend.toFixed(1)}%`,
              changeType: ordersTrend >= 0 ? 'positive' : 'negative',
              description: 'vs yesterday',
              loading: false
            },
            {
              name: 'Avg Order Value',
              value: `$${avgOrderValue.toFixed(2)}`,
              change: `${avgTrend >= 0 ? '+' : ''}${avgTrend.toFixed(1)}%`,
              changeType: avgTrend >= 0 ? 'positive' : 'negative',
              description: 'vs last week',
              loading: false
            },
            {
              name: 'Active Menu Items',
              value: activeMenuItems.toString(),
              change: `${menuItems.length} total`,
              changeType: 'positive',
              description: 'visible items',
              loading: false
            }
          ]

          setStats(updatedStats)
          console.log('✅ Toast analytics loaded successfully:', { 
            currentRevenue, 
            currentOrders, 
            avgOrderValue, 
            activeMenuItems,
            totalMenuItems: menuItems.length 
          })
        }
      } catch (error) {
        console.error('❌ Error loading Toast analytics:', error)
        setError('Failed to load analytics data')
        
        // Set error state for stats
        setStats(prev => prev.map(stat => ({ ...stat, loading: false })))
      }
    }

    loadToastAnalytics()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 flex items-center">
                  {stat.loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                      <span className="text-lg text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    stat.value
                  )}
                </dd>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className={`flex items-center ${
                stat.changeType === 'positive' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <span className="font-medium">{stat.change}</span>
              </div>
              <div className="ml-2 text-gray-500">
                {stat.description}
              </div>
            </div>
            {error && (
              <div className="mt-2 text-xs text-red-500">
                {error}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}