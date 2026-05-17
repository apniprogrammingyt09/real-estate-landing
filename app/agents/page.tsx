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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/20 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              <Star className="w-4 h-4" />
              Elite Agents
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-gray-900 dark:text-white leading-[0.9] tracking-tighter mb-8">
              Meet the masters <br/> of modern living.
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-10">
              Our exclusive network of real estate professionals is dedicated to curating the finest properties for our discerning clientele.
            </p>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24 border-y border-gray-100 dark:border-gray-800 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {teamStats.map((stat, index) => (
              <div key={index} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-serif tracking-tight text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="max-w-3xl mb-24">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4">The Team</p>
            <h2 className="text-5xl md:text-6xl font-serif tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Curators of fine properties.
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : error ? (
            <div className="text-center py-32 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 mb-6 font-medium">{error}</p>
              <Button onClick={fetchAgents} variant="outline" className="rounded-full px-8 h-12">
                Try Again
              </Button>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 font-medium mb-6">No agents available at the moment.</p>
              <Link href="/contact">
                <Button className="rounded-full px-8 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 transition-transform">
                  Contact Us
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {agents.map((agent) => (
                <div key={agent.id} className="group flex flex-col">
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 bg-gray-200 dark:bg-gray-800">
                    <Image
                      src={agent.avatar || "/placeholder-user.jpg"}
                      alt={agent.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-user.jpg";
                      }}
                    />
                    <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
                      <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {agent.rating > 0 ? agent.rating.toFixed(1) : "New"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-3xl font-serif text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{agent.name}</h3>
                      <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{agent.role}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-100 dark:border-gray-800">
                      <span>{agent.specialization}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span>{agent.experience} exp.</span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleContactAgent(agent)}
                        className="flex-1 rounded-full h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 transition-transform"
                      >
                        Message
                      </Button>
                      <Button
                        onClick={() => handleViewProperties(agent.id)}
                        variant="outline"
                        className="h-12 w-12 rounded-full border-gray-200 dark:border-gray-800 hover:border-emerald-500 hover:text-emerald-500 transition-colors p-0"
                      >
                        <Building className="h-4 w-4" />
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
      <section className="py-32 bg-background border-t border-gray-100 dark:border-gray-800">
        <div className="container-custom">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/50 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white tracking-tight mb-6">
                Ready to find your match?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                Connect with one of our expert agents today and take the first step towards your real estate goals.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide hover:scale-105 transition-transform">
                    Schedule Consultation
                  </Button>
                </Link>
                <Link href="/listings">
                  <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-bold tracking-wide">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </div>
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
