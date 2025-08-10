"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Building, Search, Plus, MapPin, Users, Bath, Square } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { assignAgentToProperty, type Property } from "@/lib/properties-data"
import { getAgentProperties } from "@/lib/agents-data"
import { getAgent } from "@/lib/agents-data"

interface AgentPropertiesPageProps {
  params: {
    id: string
  }
}

export default function AgentPropertiesPage({ params }: AgentPropertiesPageProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [agentProperties, setAgentProperties] = useState<Property[]>([])
  const [availableProperties, setAvailableProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [agentName, setAgentName] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    fetchAgentProperties()
  }, [isAuthenticated, user, router, params.id])

  const fetchAgentProperties = async () => {
    try {
      const data = await getAgentProperties(params.id)
      const agent = await getAgent(params.id)

      if (agent) {
        setAgentName(agent.name)
      }

      setAgentProperties(data.assigned)
      setAvailableProperties(data.available)
    } catch (error) {
      console.error("Error fetching agent properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignProperty = async (propertyId: number) => {
    try {
      await assignAgentToProperty(propertyId, params.id)
      await fetchAgentProperties() // Refresh data
    } catch (error) {
      console.error("Error assigning property:", error)
    }
  }

  const filteredAvailableProperties = availableProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/agents" className="mr-4">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">{agentName} - Properties</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assigned Properties</p>
                  <p className="text-2xl font-semibold text-gray-900">{agentProperties.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-secondary/10 rounded-lg p-3">
                  <Plus className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available to Assign</p>
                  <p className="text-2xl font-semibold text-gray-900">{availableProperties.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-accent/10 rounded-lg p-3">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${agentProperties.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Properties */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Assigned Properties</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
              </div>
            ) : agentProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentProperties.map((property) => (
                  <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.address}
                      </div>
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {property.bedrooms}
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms}
                        </div>
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.size}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        ${property.price.toLocaleString()}
                        {property.priceType === "rent" && <span className="text-sm text-gray-500">/month</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No properties assigned to this agent yet.</p>
              </div>
            )}
          </div>

          {/* Available Properties to Assign */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Available Properties</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                      <div className="flex">
                        <div className="w-32 h-24 bg-gray-200 rounded"></div>
                        <div className="flex-1 ml-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : filteredAvailableProperties.length > 0 ? (
              <div className="space-y-4">
                {filteredAvailableProperties.map((property) => (
                  <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex p-4">
                      <div className="relative w-32 h-24">
                        <Image
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {property.address}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {property.bedrooms} beds
                              </div>
                              <div className="flex items-center">
                                <Bath className="h-4 w-4 mr-1" />
                                {property.bathrooms} baths
                              </div>
                              <div className="flex items-center">
                                <Square className="h-4 w-4 mr-1" />
                                {property.size} sq ft
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary mb-2">
                              ${property.price.toLocaleString()}
                              {property.priceType === "rent" && <span className="text-sm text-gray-500">/month</span>}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAssignProperty(property.id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No available properties to assign.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
