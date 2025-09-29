'use client'

import React from 'react'

export function TopItems() {
  const topItems = [
    {
      name: 'Chicken Gyro',
      orders: 45,
      revenue: 742.50,
      image: '/placeholder-food.jpg',
      trend: 'up'
    },
    {
      name: 'Lamb Shawarma',
      orders: 32,
      revenue: 608.00,
      image: '/placeholder-food.jpg',
      trend: 'up'
    },
    {
      name: 'Greek Salad',
      orders: 28,
      revenue: 336.00,
      image: '/placeholder-food.jpg',
      trend: 'stable'
    },
    {
      name: 'Beef Kebab',
      orders: 22,
      revenue: 374.00,
      image: '/placeholder-food.jpg',
      trend: 'down'
    },
    {
      name: 'Hummus Plate',
      orders: 19,
      revenue: 190.00,
      image: '/placeholder-food.jpg',
      trend: 'up'
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      default: return '➡️'
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Top Menu Items</h2>
        <select className="text-sm border border-gray-300 rounded px-3 py-1">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="space-y-4">
        {topItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-sm text-gray-500">
                {item.orders} orders • ${item.revenue.toFixed(2)}
              </p>
            </div>
            
            <div className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
              <span className="text-lg">{getTrendIcon(item.trend)}</span>
              <span className="text-sm font-medium">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Full Menu Analytics →
        </button>
      </div>
    </div>
  )
}