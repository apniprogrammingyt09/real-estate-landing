"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  AlertTriangle,
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
  deleteProperty,
  type Property,
} from "@/lib/properties-data"
import { getAgents, type Agent } from "@/lib/agents-data"
import { useToast } from "@/hooks/use-toast"
import { BeautifulLoading } from "@/components/ui/beautiful-loading"
import { cn, formatPrice } from "@/lib/utils"

export default function PropertiesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  // Data States
  const [activeProperties, setActiveProperties] = useState<Property[]>([])
  const [pendingProperties, setPendingProperties] = useState<Property[]>([])
  const [rejectedProperties, setRejectedProperties] = useState<Property[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [settings, setSettings] = useState<any>(null)
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [actionLoading, setActionLoading] = useState<{ [key: number]: string }>({})
  
  // Rejection Form states
  const [showRejectionForm, setShowRejectionForm] = useState<{ [key: number]: boolean }>({})
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    fetchData()
  }, [isAuthenticated, user, router])

  const fetchData = async () => {
    try {
      const [propertiesData, agentsData, settingsData] = await Promise.all([
        getAdminProperties(),
        getAgents(),
        fetch("/api/settings").then((res) => res.json()),
      ])
      setActiveProperties(propertiesData.active)
      setPendingProperties(propertiesData.pending)
      setRejectedProperties(propertiesData.rejected || [])
      setAgents(agentsData)
      setSettings(settingsData)
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
      await fetchData()
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

  const handleRejectSubmit = async (propertyId: number) => {
    const reason = rejectionReasons[propertyId]
    if (!reason?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please specify a rejection reason",
        variant: "destructive",
      })
      return
    }

    setActionLoading((prev) => ({ ...prev, [propertyId]: "reject" }))
    try {
      await rejectProperty(propertyId, reason)
      toast({
        title: "Success",
        description: "Property rejected successfully",
      })
      setShowRejectionForm(prev => ({ ...prev, [propertyId]: false }))
      setRejectionReasons(prev => ({ ...prev, [propertyId]: "" }))
      await fetchData()
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

  const handleDelete = async (propertyId: number) => {
    if (confirm("Are you sure you want to permanently delete this property listing?")) {
      setActionLoading((prev) => ({ ...prev, [propertyId]: "delete" }))
      try {
        await deleteProperty(propertyId)
        toast({
          title: "Success",
          description: "Property deleted successfully",
        })
        await fetchData()
      } catch (error) {
        console.error("Error deleting property:", error)
        toast({
          title: "Error",
          description: "Failed to delete property",
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
    const targetAgentId = agentId === "none" ? "" : agentId
    try {
      await assignAgentToProperty(propertyId, targetAgentId)
      toast({
        title: "Success",
        description: "Agent assigned successfully",
      })
      await fetchData()
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
      await fetchData()
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
      await fetchData()
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

  // Filter lists based on Search Query
  const matchesSearch = (p: Property) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())

  const filteredActive = activeProperties.filter(matchesSearch)
  const filteredPending = pendingProperties.filter(matchesSearch)
  const filteredRejected = rejectedProperties.filter(matchesSearch)
  
  // "All" list holds everything matched by search
  const filteredAll = [...activeProperties, ...pendingProperties, ...rejectedProperties].filter(matchesSearch)

  // Property Card layout
  const PropertyAdminCard = ({ property }: { property: Property }) => {
    const isPending = property.status === "pending"
    const isRejected = property.status === "rejected"
    const isActive = property.status === "active"

    return (
      <div className="bg-white rounded-[24px] border border-gray-150 p-5 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-5 relative">
        <div className="relative w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {isActive && (
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold py-1">APPROVED</Badge>
            )}
            {isPending && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] uppercase font-bold py-1">PENDING</Badge>
            )}
            {isRejected && (
              <Badge className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-bold py-1">REJECTED</Badge>
            )}
            {property.flags && property.flags.map((flag) => (
              <Badge key={flag} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase font-bold py-1">{flag}</Badge>
            ))}
            {(!property.flags || property.flags.length === 0) && (
              <>
                {property.featured && <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase font-bold py-1">FEATURED</Badge>}
                {property.best && <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] uppercase font-bold py-1">PREMIUM</Badge>}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {property.address}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem asChild>
                    <Link href={`/listings/${property.slug}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Listing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/properties/${property.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Property
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(property.id)}
                    className="text-red-600 hover:text-red-700 focus:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Listing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Spec Icons */}
            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 font-semibold">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-gray-400" />
                {property.bedrooms} Beds
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1 text-gray-400" />
                {property.bathrooms} Baths
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1 text-gray-400" />
                {property.size} sqft
              </div>
              {property.propertyId && (
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">ID: {property.propertyId}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t dark:border-gray-800">
            <div>
              <div className="text-xl font-black text-gray-900">
                {formatPrice(property.price, settings?.activeCurrency)}
                {property.priceType === "rent" && <span className="text-xs text-gray-500 font-normal">/month</span>}
              </div>
              {property.submittedBy && (
                <div className="text-[10px] text-gray-400 font-medium">
                  By: {property.submittedBy.name} ({property.submittedBy.email})
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Agent Assignment Selection */}
              {isActive && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">Agent:</span>
                  <Select
                    value={property.agentId || "none"}
                    onValueChange={(value) => handleAssignAgent(property.id, value)}
                  >
                    <SelectTrigger className="w-[140px] rounded-xl h-9">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="none">None</SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Dynamic Tag Controls for Active listings */}
              {isActive && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {(settings?.propertyFlags || ["Featured", "Premium"]).map((flag: string) => {
                    const isChecked = property.flags?.includes(flag) || 
                      (flag === "Featured" && property.featured) || 
                      (flag === "Premium" && property.best)
                    
                    return (
                      <Button
                        key={flag}
                        size="sm"
                        variant={isChecked ? "default" : "outline"}
                        className="h-9 px-3 rounded-xl text-xs gap-1"
                        onClick={async () => {
                          const currentFlags = property.flags || [
                            ...(property.featured ? ["Featured"] : []),
                            ...(property.best ? ["Premium"] : [])
                          ]
                          const newFlags = isChecked
                            ? currentFlags.filter(f => f !== flag)
                            : [...currentFlags, flag]
                          
                          setActionLoading((prev) => ({ ...prev, [property.id]: flag }))
                          try {
                            const isFeatured = newFlags.includes("Featured")
                            const isPremium = newFlags.includes("Premium")
                            await updatePropertyTags(property.id, { 
                              featured: isFeatured,
                              best: isPremium,
                              flags: newFlags
                            })
                            toast({
                              title: "Success",
                              description: `Property tag "${flag}" updated`,
                            })
                            await fetchData()
                          } catch (error) {
                            console.error("Error updating tags:", error)
                            toast({
                              title: "Error",
                              description: "Failed to update tags",
                              variant: "destructive",
                            })
                          } finally {
                            setActionLoading((prev) => {
                              const newLoading = { ...prev }
                              delete newLoading[property.id]
                              return newLoading
                            })
                          }
                        }}
                        disabled={!!actionLoading[property.id]}
                      >
                        {flag === "Featured" && <Star className={cn("h-3.5 w-3.5", isChecked && "fill-current")} />}
                        {flag}
                      </Button>
                    )
                  })}
                </div>
              )}

              {/* Approval controls for Pending listings */}
              {isPending && !showRejectionForm[property.id] && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(property.id)}
                    disabled={!!actionLoading[property.id]}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRejectionForm(prev => ({ ...prev, [property.id]: true }))}
                    disabled={!!actionLoading[property.id]}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 rounded-xl h-9"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Expanded Rejection Reason Form */}
          {showRejectionForm[property.id] && (
            <div className="mt-4 p-4 rounded-xl border border-rose-100 bg-rose-50/50 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <Label htmlFor={`reject-reason-${property.id}`} className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Reason for Rejection
              </Label>
              <Textarea
                id={`reject-reason-${property.id}`}
                placeholder="Enter feedback or explanation for rejection..."
                value={rejectionReasons[property.id] || ""}
                onChange={(e) => setRejectionReasons(prev => ({ ...prev, [property.id]: e.target.value }))}
                className="bg-white rounded-xl resize-none"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl h-8 text-xs text-gray-500"
                  onClick={() => setShowRejectionForm(prev => ({ ...prev, [property.id]: false }))}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-8 text-xs font-bold"
                  onClick={() => handleRejectSubmit(property.id)}
                  disabled={actionLoading[property.id] === "reject"}
                >
                  Confirm Reject
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b pb-6 dark:border-gray-800">
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 dark:text-white">Property Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
          Review submissions, manage active listings, and update premium visibility flags.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by title, location or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 rounded-2xl h-11 border-gray-200 dark:border-gray-800"
        />
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-1 w-full md:w-auto h-auto grid grid-cols-4 md:inline-flex border dark:border-gray-800">
          <TabsTrigger value="all" className="rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            All ({loading ? "..." : filteredAll.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            Approved ({loading ? "..." : activeProperties.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            Pending ({loading ? "..." : pendingProperties.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            Rejected ({loading ? "..." : rejectedProperties.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: All Properties */}
        <TabsContent value="all" className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <BeautifulLoading key={i} variant="card" className="w-full h-36 rounded-2xl" />
              ))}
            </div>
          ) : filteredAll.length > 0 ? (
            filteredAll.map((property) => (
              <PropertyAdminCard key={property.id} property={property} />
            ))
          ) : (
            <div className="text-center py-16 border border-dashed rounded-[2rem] bg-gray-50/50 dark:bg-gray-900/30">
              <div className="relative w-36 h-36 mx-auto mb-4">
                <Image src="/no-data.webp" alt="No properties" fill className="object-contain" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No properties</p>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Approved Properties */}
        <TabsContent value="approved" className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <BeautifulLoading key={i} variant="card" className="w-full h-36 rounded-2xl" />
              ))}
            </div>
          ) : filteredActive.length > 0 ? (
            filteredActive.map((property) => (
              <PropertyAdminCard key={property.id} property={property} />
            ))
          ) : (
            <div className="text-center py-16 border border-dashed rounded-[2rem] bg-gray-50/50 dark:bg-gray-900/30">
              <div className="relative w-36 h-36 mx-auto mb-4">
                <Image src="/no-data.webp" alt="No properties" fill className="object-contain" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No properties</p>
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Pending Properties */}
        <TabsContent value="pending" className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <BeautifulLoading key={i} variant="card" className="w-full h-36 rounded-2xl" />
              ))}
            </div>
          ) : filteredPending.length > 0 ? (
            filteredPending.map((property) => (
              <PropertyAdminCard key={property.id} property={property} />
            ))
          ) : (
            <div className="text-center py-16 border border-dashed rounded-[2rem] bg-gray-50/50 dark:bg-gray-900/30">
              <div className="relative w-36 h-36 mx-auto mb-4">
                <Image src="/no-data.webp" alt="No properties" fill className="object-contain" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No properties</p>
            </div>
          )}
        </TabsContent>

        {/* Tab 4: Rejected Properties */}
        <TabsContent value="rejected" className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <BeautifulLoading key={i} variant="card" className="w-full h-36 rounded-2xl" />
              ))}
            </div>
          ) : filteredRejected.length > 0 ? (
            filteredRejected.map((property) => (
              <PropertyAdminCard key={property.id} property={property} />
            ))
          ) : (
            <div className="text-center py-16 border border-dashed rounded-[2rem] bg-gray-50/50 dark:bg-gray-900/30">
              <div className="relative w-36 h-36 mx-auto mb-4">
                <Image src="/no-data.webp" alt="No properties" fill className="object-contain" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No properties</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
