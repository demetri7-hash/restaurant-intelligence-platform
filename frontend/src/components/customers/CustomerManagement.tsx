'use client'

import React from 'react'
import { 
  UserPlusIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  HeartIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  joinDate: string
  lastOrder: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  favoriteItems: string[]
  rating: number
  status: 'active' | 'inactive' | 'vip'
  notes?: string
  birthday?: string
  preferences?: string[]
}

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedStatus, setSelectedStatus] = React.useState('all')
  // const [showAddModal, setShowAddModal] = React.useState(false) // TODO: Implement add modal

  const statusFilters = [
    { key: 'all', label: 'All Customers', count: 1856 },
    { key: 'active', label: 'Active', count: 1432 },
    { key: 'inactive', label: 'Inactive', count: 387 },
    { key: 'vip', label: 'VIP', count: 37 }
  ]

  const customers: Customer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      address: '123 Oak Street, Downtown',
      joinDate: '2023-03-15',
      lastOrder: '2024-01-15',
      totalOrders: 47,
      totalSpent: 1683.50,
      averageOrderValue: 35.82,
      favoriteItems: ['Chicken Gyro', 'Greek Salad', 'Baklava'],
      rating: 4.9,
      status: 'vip',
      notes: 'Prefers extra tzatziki sauce. Regular customer for lunch.',
      birthday: '1985-07-22',
      preferences: ['Gluten-Free Options', 'Extra Sauce']
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 987-6543',
      address: '456 Pine Avenue, Midtown',
      joinDate: '2023-05-20',
      lastOrder: '2024-01-14',
      totalOrders: 32,
      totalSpent: 1248.75,
      averageOrderValue: 39.02,
      favoriteItems: ['Lamb Shawarma', 'Hummus Plate'],
      rating: 4.7,
      status: 'active',
      birthday: '1990-11-08',
      preferences: ['Spicy Food', 'Large Portions']
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '(555) 456-7890',
      address: '789 Elm Drive, Uptown',
      joinDate: '2023-01-10',
      lastOrder: '2024-01-12',
      totalOrders: 28,
      totalSpent: 892.25,
      averageOrderValue: 31.87,
      favoriteItems: ['Greek Village Salad', 'Vegetarian Wrap'],
      rating: 4.8,
      status: 'active',
      notes: 'Vegetarian. Always orders delivery.',
      birthday: '1992-04-15',
      preferences: ['Vegetarian', 'Delivery Only']
    },
    {
      id: '4',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 321-9876',
      joinDate: '2022-11-05',
      lastOrder: '2023-08-22',
      totalOrders: 15,
      totalSpent: 487.50,
      averageOrderValue: 32.50,
      favoriteItems: ['Beef Kebab', 'Greek Coffee'],
      rating: 4.3,
      status: 'inactive',
      birthday: '1978-12-03'
    },
    {
      id: '5',
      name: 'Anna Wilson',
      email: 'anna.wilson@email.com',
      phone: '(555) 654-3210',
      address: '321 Maple Lane, Southside',
      joinDate: '2023-08-12',
      lastOrder: '2024-01-13',
      totalOrders: 19,
      totalSpent: 724.80,
      averageOrderValue: 38.15,
      favoriteItems: ['Mediterranean Bowl', 'Greek Yogurt Parfait'],
      rating: 4.6,
      status: 'active',
      birthday: '1988-09-30',
      preferences: ['Healthy Options', 'No Nuts']
    }
  ]

  const filteredCustomers = customers.filter(customer => {
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vip': return <StarIcon className="h-4 w-4 text-yellow-600" />
      case 'active': return <HeartIcon className="h-4 w-4 text-green-600" />
      case 'inactive': return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
    }
  }

  const isUpcomingBirthday = (birthday: string) => {
    const today = new Date()
    const birthDate = new Date(birthday)
    const thisYear = new Date(birthDate.setFullYear(today.getFullYear()))
    const daysDiff = Math.ceil((thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff >= 0 && daysDiff <= 7
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and preferences</p>
        </div>
        <button 
          // onClick={() => setShowAddModal(true)} // TODO: Implement add modal
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <UserPlusIcon className="h-5 w-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-xl font-bold text-gray-900">1,856</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <HeartIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active This Month</p>
              <p className="text-xl font-bold text-gray-900">1,432</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <StarIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">VIP Customers</p>
              <p className="text-xl font-bold text-gray-900">37</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Customer Value</p>
              <p className="text-xl font-bold text-gray-900">$684</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
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
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Customer Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(customer.status)}`}>
                          {getStatusIcon(customer.status)}
                          <span className="ml-1 capitalize">{customer.status}</span>
                        </span>
                        {customer.birthday && isUpcomingBirthday(customer.birthday) && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-800">
                            <GiftIcon className="h-3 w-3 mr-1" />
                            Birthday Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                    {customer.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{customer.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">${customer.totalSpent.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">${customer.averageOrderValue.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Avg Order</p>
                </div>
              </div>
            </div>

            {/* Customer Rating and Last Order */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{customer.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500 ml-1">rating</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Order</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(customer.lastOrder).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Favorite Items */}
            <div className="px-6 pb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Favorite Items</h4>
              <div className="flex flex-wrap gap-1">
                {customer.favoriteItems.slice(0, 3).map((item, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {item}
                  </span>
                ))}
                {customer.favoriteItems.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    +{customer.favoriteItems.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Preferences */}
            {customer.preferences && customer.preferences.length > 0 && (
              <div className="px-6 pb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences</h4>
                <div className="flex flex-wrap gap-1">
                  {customer.preferences.map((pref, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {customer.notes && (
              <div className="px-6 pb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                <p className="text-sm text-gray-600">{customer.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Member since {new Date(customer.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Orders
                  </button>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    New Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}