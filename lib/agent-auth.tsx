"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  username: string
  role: string
  specialization: string
  avatar?: string
  lastLogin?: string
}

interface AgentAuthContextType {
  agent: Agent | null
  isAuthenticated: boolean
  loading: boolean
  logout: () => void
  refreshAgent: () => void
  login: (email: string, password: string) => Promise<boolean>
}

const AgentAuthContext = createContext<AgentAuthContextType | undefined>(undefined)

export function AgentAuthProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedAgent = localStorage.getItem("agent_user")
    if (storedAgent) {
      try {
        const agentData = JSON.parse(storedAgent)
        setAgent(agentData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing stored agent data:", error)
        localStorage.removeItem("agent_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/agents/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const agentData = await response.json()
        setAgent(agentData)
        setIsAuthenticated(true)
        localStorage.setItem("agent_user", JSON.stringify(agentData))
        return true
      }

      return false
    } catch (error) {
      console.error("Agent login error:", error)
      return false
    }
  }

  const logout = () => {
    setAgent(null)
    setIsAuthenticated(false)
    localStorage.removeItem("agent_user")
  }

  const refreshAgent = () => {
    const storedAgent = localStorage.getItem("agent_user")
    if (storedAgent) {
      try {
        const agentData = JSON.parse(storedAgent)
        setAgent(agentData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error refreshing agent data:", error)
        logout()
      }
    }
  }

  return (
    <AgentAuthContext.Provider value={{ agent, isAuthenticated, loading, logout, refreshAgent, login }}>
      {children}
    </AgentAuthContext.Provider>
  )
}

export function useAgentAuth() {
  const context = useContext(AgentAuthContext)
  if (context === undefined) {
    throw new Error("useAgentAuth must be used within an AgentAuthProvider")
  }
  return context
}
