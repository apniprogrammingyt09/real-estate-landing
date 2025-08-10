import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import * as bcrypt from "bcryptjs"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agent = await db.getAgent(params.id)

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...agentWithoutPassword } = agent

    return NextResponse.json(agentWithoutPassword)
  } catch (error) {
    console.error("Error fetching agent:", error)
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    // Check if username is being updated and if it's already taken
    if (updates.username) {
      const agents = await db.getAgents()
      const existingAgent = agents.find((agent) => agent.username === updates.username && agent.id !== params.id)

      if (existingAgent) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 })
      }
    }

    // Handle password update
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10)
    } else {
      // Remove empty password to avoid overwriting existing password
      delete updates.password
    }

    const agent = await db.updateAgent(params.id, updates)

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...agentWithoutPassword } = agent

    return NextResponse.json(agentWithoutPassword)
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await db.deleteAgent(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
