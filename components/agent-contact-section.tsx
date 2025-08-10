"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Home, Building } from "lucide-react"
import AgentContactModal from "@/components/agent-contact-modal"
import Image from "next/image"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
}

interface AgentContactSectionProps {
  agentId: string
  agentName: string
  propertyTitle?: string
  propertyId?: number
}

export default function AgentContactSection({
  agentId,
  agentName,
  propertyTitle,
  propertyId,
}: AgentContactSectionProps) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgent()
  }, [agentId])

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/admin/agents/${agentId}`)
      if (response.ok) {
        const agentData = await response.json()
        setAgent(agentData)
      }
    } catch (error) {
      console.error("Error fetching agent:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCallAgent = () => {
    if (agent) {
      window.location.href = `tel:${agent.phone}`
    }
  }

  const handleViewProperties = () => {
    window.open(`/agents?agent=${agentId}`, "_blank")
  }

  if (loading) {
    return (
      <div className="card-base p-4 lg:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="card-base p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Agent</h3>
        <p className="text-gray-600 dark:text-gray-400">Agent information not available.</p>
      </div>
    )
  }

  return (
    <>
      <div className="card-base p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Agent</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              {agent.avatar ? (
                <Image src={agent.avatar || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100">
                  <Home className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">{agent.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{agent.role}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={handleCallAgent} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Phone className="mr-2 h-4 w-4" />
              Call Agent
            </Button>

            <Button onClick={() => setIsModalOpen(true)} className="w-full bg-primary hover:bg-primary/90 text-white">
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </Button>

            <Button
              onClick={handleViewProperties}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Building className="mr-2 h-4 w-4" />
              View Properties
            </Button>
          </div>
        </div>
      </div>

      <AgentContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agent={agent}
        propertyTitle={propertyTitle}
        propertyId={propertyId}
      />
    </>
  )
}
