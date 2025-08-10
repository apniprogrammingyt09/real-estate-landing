"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, CheckCircle, XCircle, MapPin, Users, Bath, Square, ArrowLeft, Eye, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAdminProperties, approveProperty, rejectProperty, type Property } from "@/lib/properties-data"
import { BeautifulLoading } from "@/components/ui/beautiful-loading"
import LoadingAnimation from "@/components/admin/loading-animation"

export default function ApproveListingsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [pendingProperties, setPendingProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<{ [key: number]: "approve" | "reject" }>({})
  const [actionStatus, setActionStatus] = useState<{ [key: number]: "loading" | "success" | "error" }>({})
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({})
  const [showRejectionForm, setShowRejectionForm] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    fetchPendingProperties()
  }, [isAuthenticated, user, router])

  const fetchPendingProperties = async () => {
    try {
      const data = await getAdminProperties()
      setPendingProperties(data.pending)
    } catch (error) {
      console.error("Error fetching pending properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const setPropertyStatus = (propertyId: number, status: "loading" | "success" | "error") => {
    setActionStatus((prev) => ({ ...prev, [propertyId]: status }))

    if (status === "success" || status === "error") {
      setTimeout(() => {
        setActionStatus((prev) => {
          const newStatus = { ...prev }
          delete newStatus[propertyId]
          return newStatus
        })
        setActionLoading((prev) => {
          const newLoading = { ...prev }
          delete newLoading[propertyId]
          return newLoading
        })
      }, 2000)
    }
  }

  const handleApprove = async (propertyId: number) => {
    setActionLoading((prev) => ({ ...prev, [propertyId]: "approve" }))
    setPropertyStatus(propertyId, "loading")

    try {
      await approveProperty(propertyId)
      setPropertyStatus(propertyId, "success")
      await fetchPendingProperties()
    } catch (error) {
      console.error("Error approving property:", error)
      setPropertyStatus(propertyId, "error")
    }
  }

  const handleReject = async (propertyId: number) => {
    const reason = rejectionReasons[propertyId]
    if (!reason?.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    setActionLoading((prev) => ({ ...prev, [propertyId]: "reject" }))
    setPropertyStatus(propertyId, "loading")

    try {
      await rejectProperty(propertyId, reason)
      setPropertyStatus(propertyId, "success")
      setShowRejectionForm((prev) => ({ ...prev, [propertyId]: false }))
      setRejectionReasons((prev) => ({ ...prev, [propertyId]: "" }))
      await fetchPendingProperties()
    } catch (error) {
      console.error("Error rejecting property:", error)
      setPropertyStatus(propertyId, "error")
    }
  }

  const toggleRejectionForm = (propertyId: number) => {
    setShowRejectionForm((prev) => ({ ...prev, [propertyId]: !prev[propertyId] }))
  }

  const filteredPendingProperties = pendingProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/admin/properties" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Approve Listings</h1>
            <p className="text-gray-600">Review and approve property submissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-orange-600">{pendingProperties.length}</div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">
              {
                pendingProperties.filter((p) => actionStatus[p.id] === "success" && actionLoading[p.id] === "approve")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Approved Today</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-red-600">
              {
                pendingProperties.filter((p) => actionStatus[p.id] === "success" && actionLoading[p.id] === "reject")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Rejected Today</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pending properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <BeautifulLoading key={i} variant="card" className="w-full" />
              ))}
          </div>
        ) : filteredPendingProperties.length > 0 ? (
          filteredPendingProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Property Image */}
                <div className="relative w-full lg:w-80 h-48 lg:h-64">
                  <Image
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
                  />
                  {property.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {property.images.length} Photos
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="flex-1 p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.address}
                      </div>

                      {/* Property Stats */}
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
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

                      {/* Price */}
                      <div className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                        ${property.price.toLocaleString()}
                        {property.priceType === "rent" && <span className="text-lg text-gray-500">/month</span>}
                      </div>

                      {/* Submitter Info */}
                      {property.submittedBy && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="text-sm text-gray-600">Submitted by:</div>
                          <div className="font-medium">{property.submittedBy.name}</div>
                          <div className="text-sm text-gray-500">{property.submittedBy.email}</div>
                          <div className="text-sm text-gray-500">{property.submittedBy.phone}</div>
                        </div>
                      )}

                      {/* Description Preview */}
                      {property.description && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 mb-1">Description:</div>
                          <p className="text-gray-700 line-clamp-3">{property.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-3 lg:ml-6 lg:min-w-[200px]">
                      {/* View Button */}
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/listings/${property.slug}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Property
                        </Link>
                      </Button>

                      {/* Approve Button */}
                      <Button
                        onClick={() => handleApprove(property.id)}
                        disabled={!!actionLoading[property.id]}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>

                      {/* Reject Button */}
                      <Button
                        variant="outline"
                        onClick={() => toggleRejectionForm(property.id)}
                        disabled={!!actionLoading[property.id]}
                        className="w-full text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>

                      {/* Loading Animation */}
                      <LoadingAnimation
                        status={actionStatus[property.id] || "idle"}
                        message={
                          actionLoading[property.id] === "approve"
                            ? "Approving property..."
                            : actionLoading[property.id] === "reject"
                              ? "Rejecting property..."
                              : actionStatus[property.id] === "success"
                                ? "Action completed!"
                                : actionStatus[property.id] === "error"
                                  ? "Action failed"
                                  : ""
                        }
                      />
                    </div>
                  </div>

                  {/* Rejection Form */}
                  {showRejectionForm[property.id] && (
                    <div className="border-t pt-4 mt-4">
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <MessageSquare className="h-5 w-5 text-red-600 mr-2" />
                          <h4 className="font-medium text-red-900">Reason for Rejection</h4>
                        </div>
                        <Textarea
                          placeholder="Please provide a detailed reason for rejecting this property..."
                          value={rejectionReasons[property.id] || ""}
                          onChange={(e) => setRejectionReasons((prev) => ({ ...prev, [property.id]: e.target.value }))}
                          className="mb-3"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleReject(property.id)}
                            disabled={!rejectionReasons[property.id]?.trim() || !!actionLoading[property.id]}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Confirm Rejection
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => toggleRejectionForm(property.id)}
                            disabled={!!actionLoading[property.id]}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Properties</h3>
            <p className="text-gray-500">All property submissions have been reviewed.</p>
          </div>
        )}
      </div>
    </div>
  )
}
