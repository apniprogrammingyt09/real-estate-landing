"use client"

import { useState, useEffect } from "react"
import { useAgentAuth } from "@/lib/agent-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Search, Filter, Phone, Mail, MessageSquare, Building, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  source: "contact_form" | "property_inquiry" | "agent_contact" | "phone_call"
  propertyId?: number
  propertyTitle?: string
  createdAt: string
  updatedAt: string
  agentId?: string
}

export default function AgentLeads() {
  const { agent } = useAgentAuth()
  const { toast } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")

  useEffect(() => {
    fetchLeads()
  }, [agent?.id])

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/agents/${agent?.id}/leads`)
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error("Error fetching leads:", error)
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contacts/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setLeads(leads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus as any } : lead)))
        toast({
          title: "Success",
          description: "Lead status updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating lead status:", error)
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      })
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "qualified":
        return "bg-purple-100 text-purple-800"
      case "converted":
        return "bg-green-100 text-green-800"
      case "lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "contact_form":
        return <MessageSquare className="h-4 w-4" />
      case "property_inquiry":
        return <Building className="h-4 w-4" />
      case "agent_contact":
        return <Users className="h-4 w-4" />
      case "phone_call":
        return <Phone className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Leads Management</h1>
              <p className="text-gray-600 mt-1">Track and manage your property leads</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <span className="text-lg font-bold">{filteredLeads.length}</span>
                <span className="text-sm">Total Leads</span>
              </div>
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <span className="text-lg font-bold">{filteredLeads.filter((l) => l.status === "new").length}</span>
                <span className="text-sm">New</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="contact_form">Contact Form</SelectItem>
                  <SelectItem value="property_inquiry">Property Inquiry</SelectItem>
                  <SelectItem value="agent_contact">Agent Contact</SelectItem>
                  <SelectItem value="phone_call">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>Manage and track your property leads</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLeads.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Contact</TableHead>
                      <TableHead className="min-w-[150px]">Subject</TableHead>
                      <TableHead className="min-w-[150px]">Property</TableHead>
                      <TableHead className="min-w-[120px]">Source</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {lead.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{lead.name}</div>
                              <div className="text-sm text-gray-500 truncate">{lead.email}</div>
                              <div className="text-sm text-gray-500">{lead.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{lead.subject}</div>
                            <div className="text-sm text-gray-500 truncate">{lead.message}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.propertyTitle ? (
                            <div className="text-sm">
                              <div className="font-medium truncate">{lead.propertyTitle}</div>
                              <div className="text-gray-500">ID: {lead.propertyId}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">General Inquiry</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getSourceIcon(lead.source)}
                            <span className="text-sm capitalize">{lead.source.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                            <SelectTrigger className="w-32">
                              <Badge className={getStatusColor(lead.status)} variant="secondary">
                                {lead.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${lead.phone}`}>
                                <Phone className="h-3 w-3" />
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={`mailto:${lead.email}`}>
                                <Mail className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
                    ? "Try adjusting your filters"
                    : "New leads will appear here when customers contact you"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
