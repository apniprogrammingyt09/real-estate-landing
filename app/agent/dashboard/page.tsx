"use client"

import { useState, useEffect } from "react"
import { useAgentAuth } from "@/lib/agent-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, Users, Calendar, MessageSquare, Eye, Phone, Mail, Clock } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalProperties: number
  activeListings: number
  totalLeads: number
  newLeads: number
  scheduledViewings: number
  todayViewings: number
  totalMessages: number
  unreadMessages: number
}

interface RecentActivity {
  id: string
  type: "lead" | "booking" | "message" | "property"
  title: string
  description: string
  time: string
  status?: string
}

export default function AgentDashboard() {
  const { agent } = useAgentAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch agent-specific stats
        const [statsRes, activityRes] = await Promise.all([
          fetch(`/api/agents/${agent?.id}/stats`),
          fetch(`/api/agents/${agent?.id}/activity`),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (activityRes.ok) {
          const activityData = await activityRes.json()
          setRecentActivity(activityData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (agent?.id) {
      fetchDashboardData()
    }
  }, [agent?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 lg:p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats?.totalProperties || 0,
      change: "+2 this month",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Listings",
      value: stats?.activeListings || 0,
      change: "Currently listed",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Leads",
      value: stats?.totalLeads || 0,
      change: `+${stats?.newLeads || 0} new`,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Scheduled Viewings",
      value: stats?.scheduledViewings || 0,
      change: `${stats?.todayViewings || 0} today`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Messages",
      value: stats?.totalMessages || 0,
      change: `${stats?.unreadMessages || 0} unread`,
      icon: MessageSquare,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 lg:h-16 lg:w-16">
                <AvatarImage src={agent?.avatar || "/placeholder.svg"} alt={agent?.name} />
                <AvatarFallback className="text-sm lg:text-lg">
                  {agent?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Welcome back, {agent?.name?.split(" ")[0]}!
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  {agent?.role} • {agent?.specialization}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-xs lg:text-sm text-gray-500 space-y-1 sm:space-y-0">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    <span className="truncate">{agent?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    <span>{agent?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-gray-500">Last login</p>
              <p className="text-sm font-medium">
                {agent?.lastLogin ? new Date(agent.lastLogin).toLocaleDateString() : "First time"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-2 lg:p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 lg:h-6 lg:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/agent/properties">
                <Button className="w-full justify-start" variant="outline">
                  <Building className="mr-2 h-4 w-4" />
                  My Properties
                </Button>
              </Link>
              <Link href="/agent/leads">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  View All Leads
                </Button>
              </Link>
              <Link href="/agent/bookings">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Bookings
                </Button>
              </Link>
              <Link href="/agent/messages">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Check Messages
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === "lead" && <Users className="h-5 w-5 text-purple-500" />}
                        {activity.type === "booking" && <Calendar className="h-5 w-5 text-orange-500" />}
                        {activity.type === "message" && <MessageSquare className="h-5 w-5 text-blue-500" />}
                        {activity.type === "property" && <Building className="h-5 w-5 text-green-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                        <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{activity.time}</span>
                          {activity.status && (
                            <Badge variant="secondary" className="text-xs">
                              {activity.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400">Your recent interactions will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
