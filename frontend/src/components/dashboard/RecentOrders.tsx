'use client'

import React from 'react'

export function RecentOrders() {
  const recentOrders = [
    {
      id: '#12456',
      customer: 'Sarah Johnson',
      time: '2:34 PM',
      items: ['Chicken Gyro', 'Greek Salad'],
      total: 24.50,
      status: 'preparing',
      paymentMethod: 'Card'
    },
    {
      id: '#12455',
      customer: 'Mike Chen',
      time: '2:28 PM',
      items: ['Lamb Shawarma', 'Hummus Plate'],
      total: 31.00,
      status: 'ready',
      paymentMethod: 'Cash'
    },
    {
      id: '#12454',
      customer: 'Emily Davis',
      time: '2:22 PM',
      items: ['Beef Kebab', 'Baklava'],
      total: 22.75,
      status: 'completed',
      paymentMethod: 'Card'
    },
    {
      id: '#12453',
      customer: 'John Smith',
      time: '2:15 PM',
      items: ['Greek Salad', 'Pita Bread'],
      total: 18.50,
      status: 'completed',
      paymentMethod: 'Online'
    },
    {
      id: '#12452',
      customer: 'Anna Wilson',
      time: '2:08 PM',
      items: ['Chicken Gyro', 'French Fries'],
      total: 19.25,
      status: 'completed',
      paymentMethod: 'Card'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Preparing'
      case 'ready': return 'Ready'
      case 'completed': return 'Completed'
      default: return status
    }
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
      </div>

      <div className="overflow-hidden">
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
      </div>
    </div>
  )
}