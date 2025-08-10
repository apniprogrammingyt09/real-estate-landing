"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StatsCard from "@/components/admin/stats-card"
import {
  Building,
  Users,
  Plus,
  FileText,
  Settings,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
} from "lucide-react"

interface AdminStats {
  totalProperties: number
  activeProperties: number
  pendingProperties: number
  totalAgents: number
  activeAgents: number
  featuredProperties: number
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
  newContacts: number
  pendingBookings: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin User</p>
        </div>
        <Button asChild>
          <Link href="/admin/profile">
            <Settings className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          icon={Building}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Active Properties"
          value={stats?.activeProperties || 0}
          icon={CheckCircle}
          trend="+8%"
          trendUp={true}
        />
        <StatsCard
          title="New Contacts"
          value={stats?.newContacts || 0}
          icon={MessageSquare}
          trend="+15%"
          trendUp={true}
        />
        <StatsCard
          title="Pending Bookings"
          value={stats?.pendingBookings || 0}
          icon={Calendar}
          trend="+5%"
          trendUp={true}
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/properties?status=pending">
                <Clock className="mr-2 h-4 w-4" />
                Review Pending Properties ({stats?.pendingProperties || 0})
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/agents/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Agent
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/properties">
                <FileText className="mr-2 h-4 w-4" />
                Manage Properties
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/agents">
                <Users className="mr-2 h-4 w-4" />
                Manage Agents
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/contacts">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Contacts ({stats?.newContacts || 0} new)
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/bookings">
                <Calendar className="mr-2 h-4 w-4" />
                View Bookings ({stats?.pendingBookings || 0} pending)
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity?.length ? (
                stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
            <p className="text-xs text-muted-foreground">Manage listings and approvals</p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/properties">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {stats?.totalProperties || 0} total properties
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAgents || 0}</div>
            <p className="text-xs text-muted-foreground">Manage team and assignments</p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/agents">
                  <Users className="mr-2 h-4 w-4" />
                  {stats?.totalAgents || 0} total agents
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming soon</div>
            <p className="text-xs text-muted-foreground">View reports and insights</p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" disabled>
                <TrendingUp className="mr-2 h-4 w-4" />
                Coming soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
