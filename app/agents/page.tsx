"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Star, Award, TrendingUp, Users, Loader2, Building } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AgentContactModal from "@/components/agent-contact-modal"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  role: string
  specialization: string
  experience: string
  bio?: string
  avatar?: string
  rating: number
  propertiesCount: number
  status: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/agents")
      if (!response.ok) {
        throw new Error("Failed to fetch agents")
      }
      const data = await response.json()
      setAgents(data)
    } catch (error) {
      console.error("Error fetching agents:", error)
      setError("Failed to load agents. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleContactAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsModalOpen(true)
  }

  const handleCallAgent = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleViewProperties = (agentId: string) => {
    window.open(`/listings?agent=${agentId}`, "_blank")
  }

  const teamStats = [
    { icon: Users, label: "Expert Agents", value: `${agents.length}+`, color: "text-primary" },
    { icon: TrendingUp, label: "Properties Sold", value: "2,500+", color: "text-secondary" },
    { icon: Award, label: "Industry Awards", value: "15+", color: "text-accent" },
    { icon: Star, label: "Client Satisfaction", value: "98%", color: "text-primary" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white section-padding">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Expert Team</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Our experienced real estate professionals are dedicated to helping you achieve your property goals. With
              deep market knowledge and personalized service, we're here to guide you every step of the way.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamStats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div
                  className={`mx-auto w-16 h-16 ${stat.color} bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-gray-700 dark:text-gray-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Our Real Estate Professionals</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Each member of our team brings unique expertise and a commitment to exceptional service. Find the right
              agent for your specific needs.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={fetchAgents} variant="outline">
                Try Again
              </Button>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No agents available at the moment.</p>
              <Link href="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <div key={agent.id} className="card-base card-hover overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={agent.avatar || "/placeholder-user.jpg"}
                      alt={agent.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-user.jpg";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {agent.rating > 0 ? agent.rating.toFixed(1) : "New"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{agent.name}</h3>
                      <p className="text-primary font-medium">{agent.role}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {agent.specialization} • {agent.experience}
                      </p>
                    </div>

                    {agent.bio && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{agent.bio}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Active Properties:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{agent.propertiesCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{agent.experience}</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{agent.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{agent.email}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Button
                        onClick={() => handleCallAgent(agent.phone)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call Agent
                      </Button>

                      <Button
                        onClick={() => handleContactAgent(agent)}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>

                      <Button
                        onClick={() => handleViewProperties(agent.id)}
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        <Building className="mr-2 h-4 w-4" />
                        View Properties
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Why Work With Our Team?</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Our agents are more than just real estate professionals – they're your partners in achieving your property
              goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Local Expertise</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Deep knowledge of local markets, neighborhoods, and property values.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Proven Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track record of successful transactions and satisfied clients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Industry Recognition</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Award-winning agents recognized for excellence and innovation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Market Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access to the latest market data and investment opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Connect with one of our expert agents today and take the first step towards your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-secondary hover:bg-gray-100">
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/listings">
              <Button
                variant="outline"
                size="lg"
                className="bg-emerald-600 border-white text-white hover:bg-white hover:text-secondary"
              >
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Contact Modal */}
      {selectedAgent && (
        <AgentContactModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedAgent(null)
          }}
          agent={selectedAgent}
        />
      )}
    </div>
  )
}
