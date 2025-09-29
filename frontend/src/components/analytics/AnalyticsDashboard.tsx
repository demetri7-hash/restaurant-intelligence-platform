'use client'

import React from 'react'
import { 
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export function AnalyticsDashboard() {
  const timeRanges = ['Today', '7 Days', '30 Days', '90 Days', 'Year']
  const [selectedRange, setSelectedRange] = React.useState('30 Days')

  const analyticsData = {
    'Today': {
      revenue: 3247.50,
      orders: 89,
      customers: 76,
      avgOrderValue: 36.48,
      conversionRate: 85.4,
      growthRate: 8.2
    },
    '7 Days': {
      revenue: 18940.25,
      orders: 542,
      customers: 487,
      avgOrderValue: 34.94,
      conversionRate: 89.8,
      growthRate: 12.5
    },
    '30 Days': {
      revenue: 84567.80,
      orders: 2347,
      customers: 1956,
      avgOrderValue: 36.04,
      conversionRate: 83.3,
      growthRate: 15.8
    },
    '90 Days': {
      revenue: 243890.50,
      orders: 6892,
      customers: 5234,
      avgOrderValue: 35.38,
      conversionRate: 75.9,
      growthRate: 22.3
    },
    'Year': {
      revenue: 756789.25,
      orders: 21456,
      customers: 16789,
      avgOrderValue: 35.27,
      conversionRate: 78.2,
      growthRate: 18.9
    }
  }

  const currentData = analyticsData[selectedRange as keyof typeof analyticsData]

  const salesTrends = [
    { period: 'Week 1', revenue: 18940, orders: 542, growth: 12.5 },
    { period: 'Week 2', revenue: 21350, orders: 589, growth: 15.2 },
    { period: 'Week 3', revenue: 19780, orders: 567, growth: 8.9 },
    { period: 'Week 4', revenue: 24497, orders: 649, growth: 18.7 }
  ]

  const categoryBreakdown = [
    { category: 'Entrees', revenue: 35240, percentage: 41.7, color: 'bg-blue-500' },
    { category: 'Beverages', revenue: 16920, percentage: 20.0, color: 'bg-green-500' },
    { category: 'Appetizers', revenue: 14676, percentage: 17.4, color: 'bg-yellow-500' },
    { category: 'Desserts', revenue: 10190, percentage: 12.1, color: 'bg-purple-500' },
    { category: 'Salads', revenue: 7541, percentage: 8.9, color: 'bg-pink-500' }
  ]

  const hourlyData = [
    { hour: '11 AM', orders: 12, revenue: 432 },
    { hour: '12 PM', orders: 28, revenue: 1008 },
    { hour: '1 PM', orders: 34, revenue: 1224 },
    { hour: '2 PM', orders: 19, revenue: 684 },
    { hour: '3 PM', orders: 8, revenue: 288 },
    { hour: '4 PM', orders: 6, revenue: 216 },
    { hour: '5 PM', orders: 15, revenue: 540 },
    { hour: '6 PM', orders: 31, revenue: 1116 },
    { hour: '7 PM', orders: 42, revenue: 1512 },
    { hour: '8 PM', orders: 38, revenue: 1368 },
    { hour: '9 PM', orders: 25, revenue: 900 },
    { hour: '10 PM', orders: 11, revenue: 396 }
  ]

  const topMetrics = [
    {
      title: 'Total Revenue',
      value: `$${currentData.revenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      growth: currentData.growthRate,
      period: selectedRange
    },
    {
      title: 'Total Orders',
      value: currentData.orders.toLocaleString(),
      icon: ShoppingBagIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      growth: 12.3,
      period: selectedRange
    },
    {
      title: 'Unique Customers',
      value: currentData.customers.toLocaleString(),
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      growth: 8.7,
      period: selectedRange
    },
    {
      title: 'Avg Order Value',
      value: `$${currentData.avgOrderValue.toFixed(2)}`,
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      growth: 5.2,
      period: selectedRange
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Detailed performance insights and trends</p>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            {timeRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topMetrics.map((metric) => {
          const IconComponent = metric.icon
          return (
            <div key={metric.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    +{metric.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                <p className={`text-2xl font-bold ${metric.color} mt-1`}>
                  {metric.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  vs previous {metric.period.toLowerCase()}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sales Trends and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sales Trends</h2>
          <div className="space-y-4">
            {salesTrends.map((week, index) => (
              <div key={week.period} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{week.period}</p>
                    <p className="text-xs text-gray-500">{week.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${week.revenue.toLocaleString()}</p>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+{week.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h2>
          <div className="space-y-4">
            {categoryBreakdown.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <span className="text-sm text-gray-500">{category.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Revenue</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${category.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {hourlyData.map((hour) => (
            <div key={hour.hour} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm font-medium text-gray-600">{hour.hour}</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-blue-600">{hour.orders}</p>
                <p className="text-xs text-gray-500">orders</p>
                <p className="text-sm font-semibold text-gray-900">${hour.revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Strong Growth</h3>
            <p className="text-sm text-gray-600 mt-1">
              Revenue increased by {currentData.growthRate.toFixed(1)}% compared to previous period
            </p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-3">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Customer Retention</h3>
            <p className="text-sm text-gray-600 mt-1">
              {currentData.conversionRate.toFixed(1)}% conversion rate with strong repeat business
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-3">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Order Efficiency</h3>
            <p className="text-sm text-gray-600 mt-1">
              Average order value of ${currentData.avgOrderValue.toFixed(2)} shows healthy margins
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}