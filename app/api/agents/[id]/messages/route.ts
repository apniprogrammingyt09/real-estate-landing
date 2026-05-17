import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const agentId = params.id

    // First, get all properties assigned to this agent
    const agentProperties = await db.getProperties({ agentId, status: "active" })
    const propertyIds = agentProperties.map((p) => p.id)

    // Get all contacts/messages
    const allContacts = await db.getContacts()

    // Filter messages to only include:
    // 1. Messages that mention the agent specifically (agentId field)
    // 2. Messages from contact forms on properties assigned to this agent
    // 3. Messages from agent contact buttons for this agent
    const agentMessages = allContacts.filter((contact) => {
      // Direct agent contact (from agent contact modal)
      if (contact.agentId === agentId) {
        return true
      }

      // Property-related messages for agent's properties
      if (contact.propertyId && propertyIds.includes(contact.propertyId)) {
        return true
      }

      // Check if message content mentions this agent
      if (contact.message && contact.message.toLowerCase().includes(`agent: ${agentId}`)) {
        return true
      }

      return false
    })

    // Transform contacts to messages format and add property details
    const messages = await Promise.all(
      agentMessages.map(async (contact) => {
        let propertyTitle = null
        let propertyAddress = null

        if (contact.propertyId) {
          const property = await db.getProperty(contact.propertyId)
          if (property) {
            propertyTitle = property.title
            propertyAddress = property.address
          }
        }

        return {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          subject: contact.subject,
          message: contact.message,
          status: contact.status,
          source: contact.propertyId ? "property_inquiry" : contact.agentId ? "agent_contact" : "contact_form",
          propertyId: contact.propertyId,
          propertyTitle: propertyTitle || contact.propertyTitle,
          propertyAddress,
          agentId: contact.agentId || agentId,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        }
      }),
    )

    return NextResponse.json(messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  } catch (error) {
    console.error("Error fetching agent messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
