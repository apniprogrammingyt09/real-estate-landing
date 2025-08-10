import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import * as bcrypt from "bcryptjs"

export async function GET() {
  try {
    const agents = await db.getAgents()
    return NextResponse.json(agents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "role", "specialization", "experience", "licenseNumber"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Check if email already exists
    const existingAgents = await db.getAgents()
    if (existingAgents.some((agent) => agent.email === body.email)) {
      return NextResponse.json({ error: "Agent with this email already exists" }, { status: 400 })
    }

    // Check if username already exists
    if (body.username && existingAgents.some((agent) => agent.username === body.username)) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Hash password if provided
    let hashedPassword
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10)
    }

    const agent = await db.createAgent({
      ...body,
      password: hashedPassword,
      status: body.status || "active",
      joinedDate: new Date().toISOString().split("T")[0],
      avatar: body.avatar || "",
      rating: body.rating || 0,
    })

    // Remove password from response
    const { password, ...agentWithoutPassword } = agent

    return NextResponse.json(agentWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
