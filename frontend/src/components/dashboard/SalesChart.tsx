'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'
import { toastApi } from '../../services/toastApi'

interface SalesDataPoint {
  date: string
  revenue: number
  orders: number
  label: string
}

export function SalesChart() {
  const [chartData, setChartData] = useState<SalesDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week')

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        setError(null)
        setLoading(true)
        console.log('🚀 Loading Toast sales chart data...')
        
        // Calculate date range based on period
        const endDate = new Date()
        const startDate = new Date()
        
        switch (period) {
          case 'day':
            // Last 24 hours by hour
            startDate.setDate(startDate.getDate() - 1)
            break
          case 'week':
            // Last 7 days
            startDate.setDate(startDate.getDate() - 7)
            break
          case 'month':
            // Last 30 days
            startDate.setDate(startDate.getDate() - 30)
            break
        }
        
        const analyticsResponse = await toastApi.getAnalytics({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          period: period
        })

        if (analyticsResponse.success && analyticsResponse.data.salesTrends) {
          const trends = analyticsResponse.data.salesTrends
          
          // Format data for chart
          const formattedData: SalesDataPoint[] = trends.map((trend, index) => ({
            date: trend.date,
            revenue: trend.revenue,
            orders: trend.orders,
            label: formatDateLabel(trend.date, period, index)
          }))

          // If no data, generate sample points to show chart structure
          if (formattedData.length === 0) {
            const sampleData: SalesDataPoint[] = []
            const points = period === 'day' ? 24 : period === 'week' ? 7 : 30
            
            for (let i = 0; i < points; i++) {
              const date = new Date()
              if (period === 'day') {
                date.setHours(date.getHours() - (points - i - 1))
              } else {
                date.setDate(date.getDate() - (points - i - 1))
              }
              
              sampleData.push({
                date: date.toISOString(),
                revenue: 0,
                orders: 0,
                label: formatDateLabel(date.toISOString(), period, i)
              })
            }
            
            setChartData(sampleData)
          } else {
            setChartData(formattedData)
          }
          
          console.log('✅ Toast sales chart data loaded successfully:', formattedData.length, 'data points')
        }
      } catch (error) {
        console.error('❌ Error loading sales chart data:', error)
        setError('Failed to load sales data')
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    loadSalesData()
  }, [period])

  const formatDateLabel = (dateStr: string, period: string, index: number): string => {
    const date = new Date(dateStr)
    
    switch (period) {
      case 'day':
        return `${date.getHours()}:00`
      case 'week':
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      default:
        return date.toLocaleDateString()
    }
  }

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1) // Minimum 1 to avoid division by zero
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0)
  const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Sales Analytics
          </h2>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Loading sales data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Sales Analytics
        </h2>
        <div className="flex space-x-2">
          <select 
            className="text-sm border border-gray-300 rounded px-3 py-1"
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Sales Revenue Trends
          </span>
          <span>Peak: ${maxRevenue.toFixed(2)}</span>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-1">
          {chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No sales data available for this period
            </div>
          ) : (
            chartData.map((data, index) => (
              <div
                key={index}
                className="flex-1 bg-blue-200 hover:bg-blue-300 transition-colors rounded-t relative group min-h-[4px]"
                style={{ height: `${Math.max((data.revenue / maxRevenue) * 100, 2)}%` }}
              >
                {/* Tooltip */}
                <div className="invisible group-hover:visible absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  <div>{data.label}</div>
                  <div>${data.revenue.toFixed(2)} • {data.orders} orders</div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          {chartData.length > 0 && (
            <>
              <span>{chartData[0]?.label}</span>
              {chartData.length > 4 && <span>{chartData[Math.floor(chartData.length / 4)]?.label}</span>}
              {chartData.length > 2 && <span>{chartData[Math.floor(chartData.length / 2)]?.label}</span>}
              {chartData.length > 4 && <span>{chartData[Math.floor(chartData.length * 3 / 4)]?.label}</span>}
              <span>{chartData[chartData.length - 1]?.label}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {totalOrders}
          </div>
          <div className="text-sm text-gray-500">Total Orders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
          </div>
          <div className="text-sm text-gray-500">Avg Order Value</div>
        </div>
      </div>
    </div>
  )
}