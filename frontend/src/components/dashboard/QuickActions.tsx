'use client'

import React from 'react'
import { 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

export function QuickActions() {
  const quickStats = [
    {
      label: 'Active Orders',
      value: '23',
      change: '+3',
      changeType: 'increase',
      icon: ShoppingBagIcon,
      action: 'View Orders'
    },
    {
      label: 'Customers Today',
      value: '156',
      change: '+12',
      changeType: 'increase',
      icon: UserGroupIcon,
      action: 'View Customers'
    },
    {
      label: 'Today\'s Revenue',
      value: '$3,247',
      change: '+8.5%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      action: 'View Reports'
    },
    {
      label: 'Avg Wait Time',
      value: '12 min',
      change: '-2 min',
      changeType: 'decrease',
      icon: ClockIcon,
      action: 'View Kitchen'
    }
  ]

  const actionButtons = [
    {
      title: 'New Order',
      description: 'Create a new order',
      icon: '🍽️',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('New Order')
    },
    {
      title: 'Quick Menu Update',
      description: 'Update menu items',
      icon: '📋',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Menu Update')
    },
    {
      title: 'Staff Management',
      description: 'Manage staff schedule',
      icon: '👥',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Staff Management')
    },
    {
      title: 'Inventory Check',
      description: 'Check inventory levels',
      icon: '📦',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => console.log('Inventory Check')
    },
    {
      title: 'Financial Reports',
      description: 'View financial data',
      icon: '💰',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => console.log('Financial Reports')
    },
    {
      title: 'Customer Feedback',
      description: 'Review customer reviews',
      icon: '⭐',
      color: 'bg-pink-500 hover:bg-pink-600',
      action: () => console.log('Customer Feedback')
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {stat.changeType === 'increase' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">
                    {stat.action}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-500">Most frequently used functions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionButtons.map((action) => (
            <button
              key={action.title}
              onClick={action.action}
              className={`${action.color} text-white rounded-lg p-4 transition-colors duration-200 text-left group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <h3 className="font-medium text-white group-hover:text-gray-100">
                    {action.title}
                  </h3>
                  <p className="text-sm text-white/80 group-hover:text-white/90 mt-1">
                    {action.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-700">Toast POS Connection</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Connected</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-700">Database</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Online</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-700">Payment Processing</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-700">Kitchen Display</span>
            </div>
            <span className="text-sm text-yellow-600 font-medium">Updating</span>
          </div>
        </div>
      </div>
    </div>
  )
}