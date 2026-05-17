import type { Agent } from "./db"
export type { Agent }

// Client-side data fetching functions for agents
export async function getAgents(): Promise<Agent[]> {
  const response = await fetch("/api/agents")
  if (!response.ok) {
    throw new Error("Failed to fetch agents")
  }
  return response.json()
}

export async function getAgent(id: string): Promise<Agent | null> {
  const response = await fetch(`/api/admin/agents/${id}`)
  if (!response.ok) {
    return null
  }
  return response.json()
}

export async function createAgent(agentData: Partial<Agent>): Promise<Agent> {
  const response = await fetch("/api/admin/agents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agentData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create agent")
  }

  return response.json()
}

export async function updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
  const response = await fetch(`/api/admin/agents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error("Failed to update agent")
  }

  return response.json()
}

export async function deleteAgent(id: string): Promise<void> {
  const response = await fetch(`/api/admin/agents/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete agent")
  }
}

export async function getAgentProperties(agentId: string): Promise<{
  assigned: any[]
  available: any[]
}> {
  const response = await fetch(`/api/agents/${agentId}/properties`)
  if (!response.ok) {
    throw new Error("Failed to fetch agent properties")
  }
  return response.json()
}

// Admin functions
export async function getAdminAgents(): Promise<Agent[]> {
  const response = await fetch("/api/admin/agents")
  if (!response.ok) {
    throw new Error("Failed to fetch admin agents")
  }
  return response.json()
}
