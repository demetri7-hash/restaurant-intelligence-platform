'use client'

import React from 'react'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export function PerformanceMetrics() {
  const metrics = [
    {
      title: 'Sales Growth',
      value: '+12.5%',
      comparison: 'vs last month',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Order Volume',
      value: '2,847',
      comparison: 'this month',
      trend: 'up',
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Avg Order Time',
      value: '12.3 min',
      comparison: '-1.2 min vs last week',
      trend: 'up',
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      comparison: '+0.2 vs last month',
      trend: 'up',
      icon: ChartBarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    }
  ]

  const periodMetrics = [
    { period: 'Today', revenue: 3247, orders: 89, avgOrder: 36.48 },
    { period: 'This Week', revenue: 18940, orders: 542, avgOrder: 34.94 },
    { period: 'This Month', revenue: 84567, orders: 2347, avgOrder: 36.04 },
    { period: 'This Year', revenue: 756789, orders: 21456, avgOrder: 35.27 }
  ]

  return (
    <div className="space-y-6">
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon
          return (
            <div key={metric.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  {metric.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {metric.value.includes('%') ? metric.value.replace(/[+-]/, '') : ''}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                <p className={`text-2xl font-semibold ${metric.color} mt-1`}>
                  {metric.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{metric.comparison}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Period Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Performance by Period</h2>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {periodMetrics.map((period, index) => {
                const growthRate = index > 0 ? 
                  (((period.revenue - periodMetrics[index-1].revenue) / periodMetrics[index-1].revenue) * 100) : 0
                
                return (
                  <tr key={period.period} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{period.period}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${period.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {period.orders.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${period.avgOrder.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index > 0 && (
                        <div className="flex items-center">
                          {growthRate >= 0 ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}