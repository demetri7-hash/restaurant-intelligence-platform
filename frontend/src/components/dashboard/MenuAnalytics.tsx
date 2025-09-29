'use client'

import React from 'react'
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  FireIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  soldToday: number
  revenue: number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  rating: number
  prepTime: number
}

export function MenuAnalytics() {
  const topItems: MenuItem[] = [
    {
      id: '1',
      name: 'Chicken Gyro Plate',
      category: 'Entrees',
      price: 18.50,
      soldToday: 45,
      revenue: 832.50,
      trend: 'up',
      trendPercent: 12.5,
      rating: 4.8,
      prepTime: 8
    },
    {
      id: '2',
      name: 'Greek Village Salad',
      category: 'Salads',
      price: 14.50,
      soldToday: 38,
      revenue: 551.00,
      trend: 'up',
      trendPercent: 8.2,
      rating: 4.9,
      prepTime: 5
    },
    {
      id: '3',
      name: 'Lamb Shawarma',
      category: 'Entrees',
      price: 22.00,
      soldToday: 31,
      revenue: 682.00,
      trend: 'down',
      trendPercent: -3.1,
      rating: 4.7,
      prepTime: 12
    },
    {
      id: '4',
      name: 'Hummus & Pita Platter',
      category: 'Appetizers',
      price: 12.50,
      soldToday: 29,
      revenue: 362.50,
      trend: 'up',
      trendPercent: 15.8,
      rating: 4.6,
      prepTime: 3
    },
    {
      id: '5',
      name: 'Baklava',
      category: 'Desserts',
      price: 8.50,
      soldToday: 24,
      revenue: 204.00,
      trend: 'stable',
      trendPercent: 0.5,
      rating: 4.9,
      prepTime: 2
    }
  ]

  const categoryPerformance = [
    {
      category: 'Entrees',
      items: 12,
      totalSold: 156,
      revenue: 3247.50,
      avgRating: 4.7,
      trend: 'up',
      trendPercent: 8.5
    },
    {
      category: 'Appetizers',
      items: 8,
      totalSold: 89,
      revenue: 967.50,
      avgRating: 4.5,
      trend: 'up',
      trendPercent: 12.3
    },
    {
      category: 'Salads',
      items: 6,
      totalSold: 67,
      revenue: 834.50,
      avgRating: 4.8,
      trend: 'up',
      trendPercent: 5.2
    },
    {
      category: 'Desserts',
      items: 5,
      totalSold: 45,
      revenue: 342.50,
      avgRating: 4.6,
      trend: 'down',
      trendPercent: -2.1
    },
    {
      category: 'Beverages',
      items: 10,
      totalSold: 134,
      revenue: 456.75,
      avgRating: 4.4,
      trend: 'stable',
      trendPercent: 1.2
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowDownIcon className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Performing Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Items</h2>
            <div className="flex items-center space-x-2">
              <FireIcon className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-500">Today&apos;s bestsellers</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sold Today
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prep Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-600">
                      {item.soldToday}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.revenue.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTrendIcon(item.trend)}
                      <span className={`ml-1 text-sm font-medium ${getTrendColor(item.trend)}`}>
                        {item.trend !== 'stable' && (item.trendPercent > 0 ? '+' : '')}
                        {item.trendPercent.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{item.prepTime}m</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categoryPerformance.map((category) => (
              <div key={category.category} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">{category.category}</h3>
                  <div className="flex items-center">
                    {getTrendIcon(category.trend)}
                    <span className={`ml-1 text-xs font-medium ${getTrendColor(category.trend)}`}>
                      {category.trend !== 'stable' && (category.trendPercent > 0 ? '+' : '')}
                      {category.trendPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Items:</span>
                    <span className="text-xs font-medium text-gray-900">{category.items}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Sold:</span>
                    <span className="text-xs font-medium text-gray-900">{category.totalSold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Revenue:</span>
                    <span className="text-xs font-medium text-gray-900">${category.revenue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Rating:</span>
                    <div className="flex items-center">
                      <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-xs font-medium text-gray-900">{category.avgRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}