"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AgentAuthProvider, useAgentAuth } from "@/lib/agent-auth"
import { AgentNavigation } from "@/components/agent/agent-navigation"

function AgentLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAgentAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/agent/login") {
      router.push("/agent/login")
    }
  }, [isAuthenticated, loading, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (pathname === "/agent/login") {
    return <div className="min-h-screen">{children}</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AgentNavigation />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentAuthProvider>
      <AgentLayoutContent>{children}</AgentLayoutContent>
    </AgentAuthProvider>
  )
}
