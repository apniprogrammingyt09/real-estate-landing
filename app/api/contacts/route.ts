import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const contacts = await db.getContacts()
    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, propertyId, agentId } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // If propertyId is provided, get property details and agent info
    let propertyTitle = null
    let assignedAgentId = agentId

    if (propertyId) {
      const property = await db.getProperty(Number.parseInt(propertyId))
      if (property) {
        propertyTitle = property.title
        // If no agentId provided but property has an agent, use property's agent
        if (!assignedAgentId && property.agentId) {
          assignedAgentId = property.agentId
        }
      }
    }

    const contact = await db.createContact({
      name,
      email,
      phone,
      subject,
      message,
      status: "new",
      propertyId: propertyId ? Number.parseInt(propertyId) : undefined,
      propertyTitle,
      agentId: assignedAgentId,
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
