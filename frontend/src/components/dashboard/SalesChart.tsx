'use client'

import React from 'react'

export function SalesChart() {
  // Mock data for demonstration
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    sales: Math.floor(Math.random() * 200) + 50,
    orders: Math.floor(Math.random() * 15) + 5
  }))

  const maxSales = Math.max(...chartData.map(d => d.sales))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Sales Analytics</h2>
        <div className="flex space-x-2">
          <select className="text-sm border border-gray-300 rounded px-3 py-1">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Simple bar chart visualization */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Hourly Sales Revenue</span>
          <span>Peak: ${maxSales}</span>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-1">
          {chartData.map((data, index) => (
            <div
              key={index}
              className="flex-1 bg-blue-200 hover:bg-blue-300 transition-colors rounded-t relative group"
              style={{ height: `${(data.sales / maxSales) * 100}%` }}
            >
              {/* Tooltip */}
              <div className="invisible group-hover:visible absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                {data.hour}:00 - ${data.sales}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${chartData.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Sales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {chartData.reduce((sum, d) => sum + d.orders, 0)}
          </div>
          <div className="text-sm text-gray-500">Total Orders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${(chartData.reduce((sum, d) => sum + d.sales, 0) / chartData.reduce((sum, d) => sum + d.orders, 0)).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Avg Order</div>
        </div>
      </div>
    </div>
  )
}