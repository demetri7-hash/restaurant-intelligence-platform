'use client'

import React from 'react'
import { StatsCards } from './StatsCards'
import { RecentOrders } from './RecentOrders'
import { SalesChart } from './SalesChart'
import { TopItems } from './TopItems'
import { LiveMetrics } from './LiveMetrics'

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening at your restaurant today.
        </p>
      </div>

      {/* Live Metrics */}
      <LiveMetrics />

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        
        {/* Top Items */}
        <div className="lg:col-span-1">
          <TopItems />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  )
}