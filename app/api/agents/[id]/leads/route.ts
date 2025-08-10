import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agentId = params.id

    // First, get all properties assigned to this agent
    const agentProperties = await db.getProperties({ agentId })
    const propertyIds = agentProperties.map((p) => p.id)

    // Get all contacts/leads
    const allContacts = await db.getContacts()

    // Filter leads to only include those related to agent's properties or direct agent contact
    const agentLeads = allContacts.filter((contact) => {
      // Direct agent contact
      if (contact.agentId === agentId) {
        return true
      }

      // Property-related leads for agent's properties
      if (contact.propertyId && propertyIds.includes(contact.propertyId)) {
        return true
      }

      return false
    })

    // Transform contacts to leads format and add property details
    const leads = await Promise.all(
      agentLeads.map(async (contact) => {
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
          source: contact.propertyId ? "property_inquiry" : "agent_contact",
          propertyId: contact.propertyId,
          propertyTitle,
          propertyAddress,
          agentId: contact.agentId || agentId,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        }
      }),
    )

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching agent leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}
