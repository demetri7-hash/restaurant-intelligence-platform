'use client'

import React from 'react'

export function StatsCards() {
  const stats = [
    {
      name: 'Today\'s Revenue',
      value: '$2,847',
      change: '+12.5%',
      changeType: 'positive' as const,
      description: 'vs yesterday'
    },
    {
      name: 'Orders Today',
      value: '156',
      change: '+8.2%',
      changeType: 'positive' as const,
      description: 'vs yesterday'
    },
    {
      name: 'Avg Order Value',
      value: '$18.25',
      change: '+4.1%',
      changeType: 'positive' as const,
      description: 'vs last week'
    },
    {
      name: 'Customer Satisfaction',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive' as const,
      description: 'out of 5.0'
    }
  ]

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
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.value}
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
          </div>
        </div>
      ))}
    </div>
  )
}