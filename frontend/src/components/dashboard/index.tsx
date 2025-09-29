'use client'

import React from 'react'
import { StatsCards } from './StatsCards'
import { LiveMetrics } from './LiveMetrics'
import { SalesChart } from './SalesChart'
import { TopItems } from './TopItems'
import { RecentOrders } from './RecentOrders'
import { PerformanceMetrics } from './PerformanceMetrics'
import { QuickActions } from './QuickActions'
import { MenuAnalytics } from './MenuAnalytics'

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Intelligence Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time insights and analytics for your restaurant operations</p>
      </div>

      {/* Quick Stats Row */}
      <StatsCards />

      {/* Live Metrics */}
      <LiveMetrics />

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopItems />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Menu Analytics */}
      <MenuAnalytics />

      {/* Performance Metrics */}
      <PerformanceMetrics />

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  )
}