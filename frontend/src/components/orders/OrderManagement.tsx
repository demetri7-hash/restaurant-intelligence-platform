'use client'

import React from 'react'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PrinterIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  modifications?: string[]
}

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    phone?: string
    email?: string
  }
  items: OrderItem[]
  total: number
  tax: number
  tip?: number
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  orderType: 'dine-in' | 'takeout' | 'delivery'
  orderTime: string
  estimatedTime?: string
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  notes?: string
  table?: string
  deliveryAddress?: string
}

export function OrderManagement() {
  const [selectedStatus, setSelectedStatus] = React.useState('all')
  const [selectedOrderType, setSelectedOrderType] = React.useState('all')
  // const [showOrderModal, setShowOrderModal] = React.useState(false) // TODO: Implement order modal
  // const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null) // TODO: Implement order details

  const statusFilters = [
    { key: 'all', label: 'All Orders', count: 47 },
    { key: 'pending', label: 'Pending', count: 8 },
    { key: 'preparing', label: 'Preparing', count: 12 },
    { key: 'ready', label: 'Ready', count: 6 },
    { key: 'completed', label: 'Completed', count: 19 },
    { key: 'cancelled', label: 'Cancelled', count: 2 }
  ]

  const orderTypeFilters = [
    { key: 'all', label: 'All Types' },
    { key: 'dine-in', label: 'Dine-in' },
    { key: 'takeout', label: 'Takeout' },
    { key: 'delivery', label: 'Delivery' }
  ]

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: '#12456',
      customer: {
        name: 'Sarah Johnson',
        phone: '(555) 123-4567',
        email: 'sarah.j@email.com'
      },
      items: [
        { id: '1', name: 'Chicken Gyro', quantity: 1, price: 18.50 },
        { id: '2', name: 'Greek Salad', quantity: 1, price: 14.50, modifications: ['No olives'] },
        { id: '3', name: 'Greek Coffee', quantity: 2, price: 4.50 }
      ],
      total: 42.00,
      tax: 3.36,
      tip: 8.40,
      status: 'preparing',
      orderType: 'dine-in',
      orderTime: '2:34 PM',
      estimatedTime: '2:50 PM',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      table: 'Table 8',
      notes: 'Customer requested extra tzatziki sauce'
    },
    {
      id: '2',
      orderNumber: '#12455',
      customer: {
        name: 'Mike Chen',
        phone: '(555) 987-6543'
      },
      items: [
        { id: '1', name: 'Lamb Shawarma', quantity: 1, price: 22.00 },
        { id: '2', name: 'Hummus Plate', quantity: 1, price: 12.50 }
      ],
      total: 34.50,
      tax: 2.76,
      status: 'ready',
      orderType: 'takeout',
      orderTime: '2:28 PM',
      estimatedTime: '2:45 PM',
      paymentMethod: 'Cash',
      paymentStatus: 'paid'
    },
    {
      id: '3',
      orderNumber: '#12454',
      customer: {
        name: 'Emily Davis',
        phone: '(555) 456-7890',
        email: 'emily.davis@email.com'
      },
      items: [
        { id: '1', name: 'Mediterranean Bowl', quantity: 2, price: 16.50 },
        { id: '2', name: 'Baklava', quantity: 1, price: 8.50 }
      ],
      total: 41.50,
      tax: 3.32,
      tip: 6.50,
      status: 'pending',
      orderType: 'delivery',
      orderTime: '2:22 PM',
      estimatedTime: '3:00 PM',
      paymentMethod: 'Online Payment',
      paymentStatus: 'paid',
      deliveryAddress: '123 Main St, Apt 4B',
      notes: 'Ring doorbell twice'
    },
    {
      id: '4',
      orderNumber: '#12453',
      customer: {
        name: 'John Smith',
        phone: '(555) 321-9876'
      },
      items: [
        { id: '1', name: 'Greek Village Salad', quantity: 1, price: 14.50 },
        { id: '2', name: 'Pita Bread', quantity: 2, price: 4.00 }
      ],
      total: 22.50,
      tax: 1.80,
      tip: 4.50,
      status: 'completed',
      orderType: 'takeout',
      orderTime: '2:15 PM',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid'
    }
  ]

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesType = selectedOrderType === 'all' || order.orderType === selectedOrderType
    return matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-4 w-4" />
      case 'preparing': return <ClockIcon className="h-4 w-4" />
      case 'ready': return <CheckCircleIcon className="h-4 w-4" />
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />
      case 'cancelled': return <XCircleIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In real implementation, this would update the order via API
    console.log(`Updating order ${orderId} to status ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all restaurant orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <ShoppingBagIcon className="h-5 w-5" />
            <span>New Order</span>
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <PrinterIcon className="h-5 w-5" />
            <span>Print All</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Orders Today</p>
              <p className="text-xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Revenue Today</p>
              <p className="text-xl font-bold text-gray-900">$3,247</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Order Time</p>
              <p className="text-xl font-bold text-gray-900">12m</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Orders</p>
              <p className="text-xl font-bold text-gray-900">26</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedStatus(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedStatus === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedStatus === filter.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Type</h3>
            <div className="flex flex-wrap gap-2">
              {orderTypeFilters.map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedOrderType(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedOrderType === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{order.orderTime}</span>
                      {order.estimatedTime && (
                        <>
                          <span className="mx-2">•</span>
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>Est. {order.estimatedTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{order.customer.name}</span>
                    </div>
                    {order.customer.phone && (
                      <div className="flex items-center space-x-2 mt-1">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{order.customer.phone}</span>
                      </div>
                    )}
                    {order.deliveryAddress && (
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{order.deliveryAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 capitalize">
                    {order.orderType}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start bg-gray-50 rounded-lg p-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {item.quantity}x {item.name}
                        </span>
                      </div>
                      {item.modifications && item.modifications.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500">
                            Modifications: {item.modifications.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">${(order.total - order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                </div>
                {order.tip && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tip:</span>
                    <span className="text-gray-900">${order.tip.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">${(order.total + (order.tip || 0)).toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    // onClick={() => setSelectedOrder(order)} // TODO: Implement order details
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
                    <PrinterIcon className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                  {order.customer.phone && (
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
                      <PhoneIcon className="h-4 w-4" />
                      <span>Call</span>
                    </button>
                  )}
                </div>

                {/* Status Update Buttons */}
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <div className="flex items-center space-x-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded transition-colors"
                      >
                        Complete Order
                      </button>
                    )}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="text-red-600 hover:text-red-700 text-sm px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Notes:</strong> {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}