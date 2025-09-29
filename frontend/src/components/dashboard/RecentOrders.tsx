'use client'

import React, { useState, useEffect } from 'react'
import { toastApi } from '../../services/toastApi'

interface Order {
  id: string
  orderNumber: string
  customer: string
  time: string
  items: string[]
  total: number
  status: string
  paymentMethod: string
}

export function RecentOrders() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        setError(null)
        setLoading(true)
        console.log('🚀 Loading recent Toast orders...')
        
        const ordersResponse = await toastApi.getOrders({ 
          pageSize: 5,
          // Get orders from today
          startDate: new Date().toISOString().split('T')[0]
        })

        if (ordersResponse.success) {
          const orders = ordersResponse.data.map(order => ({
            id: order.orderNumber || order.id,
            orderNumber: order.orderNumber,
            customer: order.customer?.firstName && order.customer?.lastName 
              ? `${order.customer.firstName} ${order.customer.lastName}`
              : order.customer?.firstName 
              || order.customer?.lastName 
              || 'Guest Customer',
            time: new Date(order.orderDate).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            items: order.items?.map(item => item.name) || ['Order Details Unavailable'],
            total: order.totalAmount || 0,
            status: order.status?.toLowerCase() || 'pending',
            paymentMethod: 'Card' // Toast doesn't always provide payment method details
          }))

          setRecentOrders(orders)
          console.log('✅ Recent Toast orders loaded successfully:', orders.length, 'orders')
        }
      } catch (error) {
        console.error('❌ Error loading recent orders:', error)
        setError('Failed to load recent orders')
        
        // Fallback to sample data in case of error
        setRecentOrders([
          {
            id: '#Sample',
            orderNumber: '#Sample',
            customer: 'Sample Order',
            time: '-- --',
            items: ['Unable to load orders'],
            total: 0,
            status: 'error',
            paymentMethod: '--'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadRecentOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': 
      case 'in_progress': 
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'ready': 
      case 'fulfilled': return 'bg-green-100 text-green-800'
      case 'completed': 
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': 
      case 'in_progress': return 'Preparing'
      case 'pending': return 'Pending'
      case 'ready': 
      case 'fulfilled': return 'Ready'
      case 'completed': 
      case 'closed': return 'Completed'
      case 'error': return 'Error'
      default: return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse">
            <div className="text-gray-500">Loading Toast orders...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Orders →
          </button>
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded">
            {error}
          </div>
        )}
      </div>

      <div className="overflow-hidden">
        {recentOrders.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">
            No recent orders found. Orders will appear here once you start receiving Toast POS orders.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}