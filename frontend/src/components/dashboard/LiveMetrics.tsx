'use client'

import React from 'react'

export function LiveMetrics() {
  const metrics = [
    {
      label: 'Orders in Queue',
      value: '7',
      status: 'normal',
      detail: 'Avg wait: 12 min'
    },
    {
      label: 'Active Tables',
      value: '23/32',
      status: 'good',
      detail: '72% occupied'
    },
    {
      label: 'Kitchen Status',
      value: 'On Time',
      status: 'good',
      detail: 'All stations active'
    },
    {
      label: 'Staff On Duty',
      value: '8',
      status: 'normal',
      detail: '2 servers, 3 kitchen, 3 support'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Live Metrics</h2>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Updated 30s ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
          >
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-sm font-medium">{metric.label}</div>
            <div className="text-xs mt-1 opacity-75">{metric.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}