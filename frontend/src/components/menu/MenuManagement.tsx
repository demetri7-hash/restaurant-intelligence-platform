'use client'

import React from 'react'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  featured: boolean
  image?: string
  prepTime: number
  allergens: string[]
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  sales: {
    today: number
    thisWeek: number
    trend: 'up' | 'down' | 'stable'
    trendPercent: number
  }
  rating: number
  reviews: number
}

export function MenuManagement() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showAddModal, setShowAddModal] = React.useState(false)

  const categories = ['All', 'Entrees', 'Appetizers', 'Salads', 'Desserts', 'Beverages', 'Specials']
  
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Mediterranean Chicken Gyro',
      description: 'Tender grilled chicken with fresh vegetables, tzatziki sauce, and warm pita bread',
      price: 18.50,
      category: 'Entrees',
      available: true,
      featured: true,
      prepTime: 8,
      allergens: ['Gluten', 'Dairy'],
      nutritionalInfo: {
        calories: 650,
        protein: 35,
        carbs: 45,
        fat: 28
      },
      sales: {
        today: 45,
        thisWeek: 287,
        trend: 'up',
        trendPercent: 12.5
      },
      rating: 4.8,
      reviews: 234
    },
    {
      id: '2',
      name: 'Greek Village Salad',
      description: 'Fresh tomatoes, cucumbers, olives, red onion, and feta cheese with olive oil dressing',
      price: 14.50,
      category: 'Salads',
      available: true,
      featured: false,
      prepTime: 5,
      allergens: ['Dairy'],
      nutritionalInfo: {
        calories: 320,
        protein: 12,
        carbs: 18,
        fat: 24
      },
      sales: {
        today: 38,
        thisWeek: 198,
        trend: 'up',
        trendPercent: 8.2
      },
      rating: 4.9,
      reviews: 187
    },
    {
      id: '3',
      name: 'Lamb Shawarma Platter',
      description: 'Slow-cooked lamb with rice, hummus, grilled vegetables, and garlic sauce',
      price: 22.00,
      category: 'Entrees',
      available: false,
      featured: true,
      prepTime: 12,
      allergens: ['Gluten', 'Sesame'],
      nutritionalInfo: {
        calories: 780,
        protein: 42,
        carbs: 52,
        fat: 38
      },
      sales: {
        today: 31,
        thisWeek: 156,
        trend: 'down',
        trendPercent: -3.1
      },
      rating: 4.7,
      reviews: 145
    },
    {
      id: '4',
      name: 'Hummus & Pita Platter',
      description: 'House-made hummus with warm pita bread, olives, and fresh vegetables',
      price: 12.50,
      category: 'Appetizers',
      available: true,
      featured: false,
      prepTime: 3,
      allergens: ['Gluten', 'Sesame'],
      nutritionalInfo: {
        calories: 420,
        protein: 15,
        carbs: 58,
        fat: 16
      },
      sales: {
        today: 29,
        thisWeek: 145,
        trend: 'up',
        trendPercent: 15.8
      },
      rating: 4.6,
      reviews: 98
    },
    {
      id: '5',
      name: 'Baklava',
      description: 'Traditional honey-sweetened pastry with nuts and phyllo layers',
      price: 8.50,
      category: 'Desserts',
      available: true,
      featured: false,
      prepTime: 2,
      allergens: ['Gluten', 'Nuts', 'Dairy'],
      nutritionalInfo: {
        calories: 290,
        protein: 6,
        carbs: 35,
        fat: 15
      },
      sales: {
        today: 24,
        thisWeek: 134,
        trend: 'stable',
        trendPercent: 0.5
      },
      rating: 4.9,
      reviews: 76
    },
    {
      id: '6',
      name: 'Greek Coffee',
      description: 'Traditional strong coffee served with a glass of cold water',
      price: 4.50,
      category: 'Beverages',
      available: true,
      featured: false,
      prepTime: 4,
      allergens: [],
      nutritionalInfo: {
        calories: 25,
        protein: 1,
        carbs: 3,
        fat: 0
      },
      sales: {
        today: 67,
        thisWeek: 456,
        trend: 'up',
        trendPercent: 22.3
      },
      rating: 4.5,
      reviews: 203
    }
  ]

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant menu items and pricing</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Menu Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FireIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <p className="text-xl font-bold text-gray-900">{menuItems.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-xl font-bold text-gray-900">
                {menuItems.filter(item => item.available).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <StarIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Featured</p>
              <p className="text-xl font-bold text-gray-900">
                {menuItems.filter(item => item.featured).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircleIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Out of Stock</p>
              <p className="text-xl font-bold text-gray-900">
                {menuItems.filter(item => !item.available).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Item Header */}
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    {item.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-xl font-bold text-blue-600">${item.price.toFixed(2)}</span>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{item.rating} ({item.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{item.prepTime}m</span>
                    </div>
                    <span>•</span>
                    <span className="capitalize">{item.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Availability</span>
                  <div className="flex items-center">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.available ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.available ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`ml-2 text-sm ${
                      item.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Performance */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today's Sales</p>
                  <p className="text-lg font-semibold text-gray-900">{item.sales.today}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-lg font-semibold text-gray-900">{item.sales.thisWeek}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {getTrendIcon(item.sales.trend)}
                    <span className={`ml-1 text-sm font-medium ${getTrendColor(item.sales.trend)}`}>
                      {item.sales.trend !== 'stable' && (item.sales.trendPercent > 0 ? '+' : '')}
                      {item.sales.trendPercent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">vs last week</p>
                </div>
              </div>
            </div>

            {/* Allergens */}
            {item.allergens.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Contains:</p>
                <div className="flex flex-wrap gap-1">
                  {item.allergens.map(allergen => (
                    <span key={allergen} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}