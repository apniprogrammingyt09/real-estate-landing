"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, User, MessageSquare, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AgentContactModalProps {
  isOpen: boolean
  onClose: () => void
  agent: {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
  }
  propertyTitle?: string
  propertyId?: number
}

export default function AgentContactModal({
  isOpen,
  onClose,
  agent,
  propertyTitle,
  propertyId,
}: AgentContactModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: propertyTitle ? `Inquiry about ${propertyTitle}` : `Contact Agent: ${agent.name}`,
          message: `${formData.message}\n\n---\nAgent: ${agent.name}\n${propertyTitle ? `Property: ${propertyTitle}` : ""}`,
          propertyId: propertyId,
          propertyTitle: propertyTitle,
          agentId: agent.id,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Message sent successfully!",
          description: "The agent will get back to you soon.",
        })
        setTimeout(() => {
          setIsSuccess(false)
          setFormData({ name: "", email: "", phone: "", message: "" })
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCallAgent = () => {
    window.location.href = `tel:${agent.phone}`
  }

  const handleEmailAgent = () => {
    const subject = propertyTitle ? `Inquiry about ${propertyTitle}` : `Real Estate Inquiry`
    const body = `Hello ${agent.name},\n\nI'm interested in learning more about ${propertyTitle || "your real estate services"}.\n\nPlease contact me at your earliest convenience.\n\nThank you!`
    window.location.href = `mailto:${agent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {agent.name}</DialogTitle>
          <DialogDescription>
            {propertyTitle ? `Get in touch about ${propertyTitle}` : "Send a message to this agent"}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600">Your message has been sent to {agent.name}. They will contact you soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleCallAgent} className="bg-green-600 hover:bg-green-700 text-white">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button
                onClick={handleEmailAgent}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or send a message</span>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Your Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Your Phone</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <div className="relative mt-1">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="message"
                    placeholder="Enter your message..."
                    className="pl-10 min-h-[100px]"
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
