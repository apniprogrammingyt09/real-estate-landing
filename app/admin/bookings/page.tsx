"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, Clock, CheckCircle, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string
  propertyId: number
  propertyTitle: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  message?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.phone.includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: status as any } : booking)))
        toast({
          title: "Success",
          description: "Booking status updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return variants[status as keyof typeof variants] || variants.pending
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
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1">Manage property viewing appointments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "pending").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "completed").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Viewings</CardTitle>
          <CardDescription>
            {filteredBookings.length} of {bookings.length} bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{booking.propertyTitle}</TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(booking.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, "confirmed")}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, "completed")}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
