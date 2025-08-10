import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const agents = await db.getAgents()
    // Only return active agents for public API
    const activeAgents = agents.filter((agent) => agent.status === "active")
    return NextResponse.json(activeAgents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}
