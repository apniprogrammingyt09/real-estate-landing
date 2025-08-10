import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const agent = await db.getAgent(params.id)

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...agentData } = agent

    return NextResponse.json(agentData)
  } catch (error) {
    console.error("Error fetching agent profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const updatedAgent = await db.updateAgent(params.id, updates)

    if (!updatedAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...agentData } = updatedAgent

    return NextResponse.json(agentData)
  } catch (error) {
    console.error("Error updating agent profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
