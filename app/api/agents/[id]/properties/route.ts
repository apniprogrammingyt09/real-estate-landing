import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const agentId = params.id

    // Get all properties
    const allProperties = await db.getProperties({})

    // Split into assigned to this agent vs available (unassigned or assigned to another)
    const assigned = allProperties.filter((p) => p.agentId === agentId)
    const available = allProperties.filter((p) => !p.agentId || p.agentId !== agentId)

    // Get stats for assigned properties
    const [allContacts, allBookings] = await Promise.all([db.getContacts(), db.getBookings()])

    const propertyStats: Record<number, any> = {}
    for (const property of assigned) {
      const propertyContacts = allContacts.filter(
        (contact) => contact.propertyId === property.id || contact.agentId === agentId,
      )
      const propertyBookings = allBookings.filter((booking) => booking.propertyId === property.id)

      propertyStats[property.id] = {
        views: Math.floor(Math.random() * 100) + 10,
        leads: propertyContacts.length,
        bookings: propertyBookings.length,
        messages: propertyContacts.length,
      }
    }

    return NextResponse.json({ assigned, available, stats: propertyStats })
  } catch (error) {
    console.error("Error fetching agent properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}
