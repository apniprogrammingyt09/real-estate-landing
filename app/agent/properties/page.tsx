"use client"

import { useState, useEffect } from "react"
import { useAgentAuth } from "@/lib/agent-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building,
  Search,
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Calendar,
  Users,
  Plus,
  Mail,
  Phone,
  User,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Property {
  id: number
  title: string
  address: string
  price: number
  priceType: string
  bedrooms: number
  bathrooms: number
  size: number
  type: string
  status: string
  images: string[]
  slug: string
  description: string
  yearBuilt: number
  propertyId: string | null
  neighborhood: string
  features: string[]
  createdAt: string
  updatedAt: string
  submittedBy: {
    name: string
    email: string
    phone: string
  }
}

interface PropertyStats {
  views: number
  leads: number
  bookings: number
  messages: number
}

export default function AgentProperties() {
  const { agent } = useAgentAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [propertyStats, setPropertyStats] = useState<Record<number, PropertyStats>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const fetchProperties = async () => {
      if (!agent?.id) return

      try {
        const response = await fetch(`/api/agents/${agent.id}/properties`)
        if (response.ok) {
          const data = await response.json()
          setProperties(data.properties || [])
          setPropertyStats(data.stats || {})
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [agent?.id])

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    const matchesType = typeFilter === "all" || property.type.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600">Manage your property listings and track performance</p>
          </div>
          <Link href="/add-property">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
                <Building className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {properties.filter((p) => p.status === "active").length}
                  </p>
                </div>
                <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {Object.values(propertyStats).reduce((sum, stats) => sum + stats.leads, 0)}
                  </p>
                </div>
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {Object.values(propertyStats).reduce((sum, stats) => sum + stats.bookings, 0)}
                  </p>
                </div>
                <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={property.images[0] || "/placeholder.svg?height=200&width=300"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant={
                        property.status === "active"
                          ? "default"
                          : property.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {property.status}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-white">
                      {property.type}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-primary font-bold text-lg">
                        <DollarSign className="h-4 w-4" />
                        {property.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{property.propertyId || `ID: ${property.id}`}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {property.size} sq ft
                      </div>
                    </div>

                    {/* Submitted By Information */}
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted By:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{property.submittedBy?.name || "Not specified"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{property.submittedBy?.email || "Not specified"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{property.submittedBy?.phone || "Not specified"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2">
                      <Link href={`/listings/${property.slug}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Property
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 lg:p-12 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more properties."
                  : "You don't have any properties yet. Add your first property to get started."}
              </p>
              <Link href="/add-property">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Property
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
