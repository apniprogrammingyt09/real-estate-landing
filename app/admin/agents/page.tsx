"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, Plus, Search, MoreHorizontal, Edit, Trash2, Star, Phone, Mail, User } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  role: string
  specialization: string
  experience: string
  bio?: string
  licenseNumber: string
  languages?: string
  status: "active" | "inactive"
  avatar?: string
  rating?: number
  joinedDate: string
  username?: string
}

export default function AgentsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specializationFilter, setSpecializationFilter] = useState("all")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    fetchAgents()
  }, [isAuthenticated, user, router])

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/admin/agents")
      if (response.ok) {
        const data = await response.json()
        setAgents(data)
      }
    } catch (error) {
      console.error("Error fetching agents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAgent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const response = await fetch(`/api/admin/agents/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAgents(agents.filter((agent) => agent.id !== id))
      } else {
        alert("Failed to delete agent")
      }
    } catch (error) {
      console.error("Error deleting agent:", error)
      alert("Failed to delete agent")
    }
  }

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter
    const matchesSpecialization = specializationFilter === "all" || agent.specialization === specializationFilter

    return matchesSearch && matchesStatus && matchesSpecialization
  })

  const renderStars = (rating = 0) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents Management</h1>
          <p className="text-gray-600 mt-1">Manage your real estate agents</p>
        </div>
        <Button asChild>
          <Link href="/admin/agents/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Agent
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter((a) => a.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.length > 0
                ? (agents.reduce((sum, agent) => sum + (agent.rating || 0), 0) / agents.length).toFixed(1)
                : "0.0"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter((a) => (a.rating || 0) >= 4).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search agents by name, email, or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="Residential Properties">Residential</SelectItem>
                <SelectItem value="Commercial Properties">Commercial</SelectItem>
                <SelectItem value="Luxury Properties">Luxury</SelectItem>
                <SelectItem value="Investment Properties">Investment</SelectItem>
                <SelectItem value="New Developments">New Developments</SelectItem>
                <SelectItem value="Rental Properties">Rental</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agents ({filteredAgents.length})</CardTitle>
          <CardDescription>Manage your real estate agents and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role & Specialization</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={agent.avatar || "/placeholder-user.jpg"} alt={agent.name} />
                          <AvatarFallback>
                            {agent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-500">License: {agent.licenseNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {agent.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {agent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agent.role}</div>
                        <div className="text-sm text-gray-500">{agent.specialization}</div>
                        {agent.languages && (
                          <div className="text-xs text-gray-400 mt-1">Languages: {agent.languages}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {agent.username ? (
                        <Badge variant="outline" className="font-mono">
                          {agent.username}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{agent.experience}</Badge>
                    </TableCell>
                    <TableCell>{renderStars(agent.rating)}</TableCell>
                    <TableCell>
                      <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(agent.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/agents/${agent.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/agents/${agent.id}/properties`}>
                              <Building className="mr-2 h-4 w-4" />
                              View Properties
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteAgent(agent.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" || specializationFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first agent."}
              </p>
              {!searchTerm && statusFilter === "all" && specializationFilter === "all" && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/agents/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Agent
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
