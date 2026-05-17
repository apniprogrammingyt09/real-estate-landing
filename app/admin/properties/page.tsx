"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Users,
  Bath,
  Square,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  getAdminProperties,
  approveProperty,
  rejectProperty,
  updatePropertyTags,
  assignAgentToProperty,
  type Property,
} from "@/lib/properties-data"
import { getAgents, type Agent } from "@/lib/agents-data"
import { Suspense } from "react"
import { BeautifulLoading } from "@/components/ui/beautiful-loading"
import { useToast } from "@/hooks/use-toast"

function PropertiesContent() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeProperties, setActiveProperties] = useState<Property[]>([])
  const [pendingProperties, setPendingProperties] = useState<Property[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<{ [key: number]: string }>({})

  const activeTab = searchParams.get("tab") || "approved"

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    fetchData()
  }, [isAuthenticated, user, router])

  const fetchData = async () => {
    try {
      const [propertiesData, agentsData] = await Promise.all([getAdminProperties(), getAgents()])
      setActiveProperties(propertiesData.active)
      setPendingProperties(propertiesData.pending)
      setAgents(agentsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch properties data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (propertyId: number) => {
    setActionLoading((prev) => ({ ...prev, [propertyId]: "approve" }))

    try {
      await approveProperty(propertyId)
      toast({
        title: "Success",
        description: "Property approved successfully",
      })
      await fetchData() // Refresh data
    } catch (error) {
      console.error("Error approving property:", error)
      toast({
        title: "Error",
        description: "Failed to approve property",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => {
        const newLoading = { ...prev }
        delete newLoading[propertyId]
        return newLoading
      })
    }
  }

  const handleReject = async (propertyId: number) => {
    if (confirm("Are you sure you want to reject this property?")) {
      setActionLoading((prev) => ({ ...prev, [propertyId]: "reject" }))

      try {
        await rejectProperty(propertyId)
        toast({
          title: "Success",
          description: "Property rejected successfully",
        })
        await fetchData() // Refresh data
      } catch (error) {
        console.error("Error rejecting property:", error)
        toast({
          title: "Error",
          description: "Failed to reject property",
          variant: "destructive",
        })
      } finally {
        setActionLoading((prev) => {
          const newLoading = { ...prev }
          delete newLoading[propertyId]
          return newLoading
        })
      }
    }
  }

  const handleAssignAgent = async (propertyId: number, agentId: string) => {
    setActionLoading((prev) => ({ ...prev, [propertyId]: "assign" }))

    try {
      await assignAgentToProperty(propertyId, agentId)
      toast({
        title: "Success",
        description: "Agent assigned successfully",
      })
      await fetchData() // Refresh data immediately
    } catch (error) {
      console.error("Error assigning agent:", error)
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => {
        const newLoading = { ...prev }
        delete newLoading[propertyId]
        return newLoading
      })
    }
  }

  const handleToggleFeatured = async (propertyId: number, currentValue: boolean) => {
    setActionLoading((prev) => ({ ...prev, [propertyId]: "feature" }))

    try {
      await updatePropertyTags(propertyId, { featured: !currentValue })
      toast({
        title: "Success",
        description: `Property ${!currentValue ? "marked as featured" : "removed from featured"}`,
      })
      await fetchData() // Refresh data
    } catch (error) {
      console.error("Error updating featured status:", error)
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => {
        const newLoading = { ...prev }
        delete newLoading[propertyId]
        return newLoading
      })
    }
  }

  const handleToggleBest = async (propertyId: number, currentValue: boolean) => {
    setActionLoading((prev) => ({ ...prev, [propertyId]: "best" }))

    try {
      await updatePropertyTags(propertyId, { best: !currentValue })
      toast({
        title: "Success",
        description: `Property ${!currentValue ? "marked as premium" : "removed from premium"}`,
      })
      await fetchData() // Refresh data
    } catch (error) {
      console.error("Error updating premium status:", error)
      toast({
        title: "Error",
        description: "Failed to update premium status",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => {
        const newLoading = { ...prev }
        delete newLoading[propertyId]
        return newLoading
      })
    }
  }

  const filteredActiveProperties = activeProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPendingProperties = pendingProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const ApprovedPropertyCard = ({ property }: { property: Property }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200">
      <div className="flex">
        <div className="relative w-48 h-32">
          <Image
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover rounded-l-lg"
          />
          <div className="absolute top-2 left-2 flex space-x-1">
            {property.featured && <Badge className="bg-primary text-white text-xs">FEATURED</Badge>}
            {property.best && <Badge className="bg-accent text-white text-xs">PREMIUM</Badge>}
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/listings/${property.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/properties/${property.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleToggleFeatured(property.id, property.featured)}
                  disabled={!!actionLoading[property.id]}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {property.featured ? "Remove Featured" : "Mark Featured"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleToggleBest(property.id, property.best)}
                  disabled={!!actionLoading[property.id]}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {property.best ? "Remove Premium" : "Mark Premium"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
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

          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                ${property.price.toLocaleString()}
                {property.priceType === "rent" && <span className="text-sm text-gray-500">/month</span>}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Agent:</span>
                <Select
                  value={property.agentId || ""}
                  onValueChange={(value) => handleAssignAgent(property.id, value)}
                  disabled={!!actionLoading[property.id]}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assign agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {actionLoading[property.id] === "assign" && (
                <div className="flex items-center text-sm text-emerald-600">
                  <div className="animate-spin h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full mr-2"></div>
                  Assigning agent...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const PendingPropertyCard = ({ property }: { property: Property }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200">
      <div className="flex">
        <div className="relative w-48 h-32">
          <Image
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover rounded-l-lg"
          />
        </div>

        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/listings/${property.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
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

          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                ${property.price.toLocaleString()}
                {property.priceType === "rent" && <span className="text-sm text-gray-500">/month</span>}
              </div>
              <div className="text-xs text-gray-500">
                {property.submittedBy && `Submitted by: ${property.submittedBy.name}`}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(property.id)}
                  disabled={!!actionLoading[property.id]}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(property.id)}
                  disabled={!!actionLoading[property.id]}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
              {actionLoading[property.id] && (
                <div className="flex items-center text-sm text-emerald-600">
                  <div className="animate-spin h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full mr-2"></div>
                  {actionLoading[property.id] === "approve" ? "Approving..." : "Rejecting..."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
        <p className="text-gray-600">Manage approved listings and review pending submissions</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="approved">Approved Listings ({activeProperties.length})</TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href="/admin/approve">Pending Approval ({pendingProperties.length})</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Approved Properties</h2>
            <div className="flex space-x-2">
              <Button asChild>
                <Link href="/admin/approve">Review Pending ({pendingProperties.length})</Link>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <BeautifulLoading key={i} variant="card" className="w-full" />
                ))}
            </div>
          ) : filteredActiveProperties.length > 0 ? (
            filteredActiveProperties.map((property) => <ApprovedPropertyCard key={property.id} property={property} />)
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No approved properties found</div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  )
}
