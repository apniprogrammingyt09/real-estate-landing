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
import { MessageSquare, Search, Filter, Phone, Mail, Clock, Building, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  propertyId?: number
  propertyTitle?: string
  status: "unread" | "read" | "replied"
  source: "contact_form" | "property_inquiry" | "agent_contact"
  createdAt: string
  updatedAt: string
}

export default function AgentMessages() {
  const { agent } = useAgentAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")

  useEffect(() => {
    fetchMessages()
  }, [agent?.id])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/agents/${agent?.id}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/contacts/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "read" }),
      })

      if (response.ok) {
        setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, status: "read" as any } : msg)))
        toast({
          title: "Success",
          description: "Message marked as read",
        })
      }
    } catch (error) {
      console.error("Error updating message status:", error)
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      })
    }
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || message.status === statusFilter
    const matchesSource = sourceFilter === "all" || message.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800"
      case "read":
        return "bg-blue-100 text-blue-800"
      case "replied":
        return "bg-green-100 text-green-800"
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Manage customer inquiries and communications</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <span className="text-lg font-bold">{filteredMessages.length}</span>
                <span className="text-sm">Total Messages</span>
              </div>
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <span className="text-lg font-bold">
                  {filteredMessages.filter((m) => m.status === "unread").length}
                </span>
                <span className="text-sm">Unread</span>
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
                  placeholder="Search messages..."
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
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
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
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Messages</CardTitle>
            <CardDescription>View and manage customer communications</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredMessages.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Contact</TableHead>
                      <TableHead className="min-w-[200px]">Subject & Message</TableHead>
                      <TableHead className="min-w-[150px]">Property</TableHead>
                      <TableHead className="min-w-[120px]">Source</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className={message.status === "unread" ? "bg-blue-50" : ""}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{message.name}</div>
                              <div className="text-sm text-gray-500 truncate">{message.email}</div>
                              <div className="text-sm text-gray-500">{message.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{message.subject}</div>
                            <div className="text-sm text-gray-500 truncate">{message.message}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {message.propertyTitle ? (
                            <div className="text-sm">
                              <div className="font-medium truncate">{message.propertyTitle}</div>
                              <div className="text-gray-500">ID: {message.propertyId}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">General Inquiry</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getSourceIcon(message.source)}
                            <span className="text-sm capitalize">{message.source.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(message.status)} variant="secondary">
                            {message.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {message.status === "unread" && (
                              <Button size="sm" variant="outline" onClick={() => markAsRead(message.id)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${message.phone}`}>
                                <Phone className="h-3 w-3" />
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
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
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Customer messages will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
