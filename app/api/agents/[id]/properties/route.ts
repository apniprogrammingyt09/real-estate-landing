import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agentId = params.id

    // Get properties assigned to this agent
    const properties = await db.getProperties({ agentId })

    // Get stats for each property
    const [allContacts, allBookings] = await Promise.all([db.getContacts(), db.getBookings()])

    const propertyStats: Record<number, any> = {}

    for (const property of properties) {
      const propertyContacts = allContacts.filter(
        (contact) => contact.propertyId === property.id || contact.agentId === agentId,
      )
      const propertyBookings = allBookings.filter((booking) => booking.propertyId === property.id)

      propertyStats[property.id] = {
        views: Math.floor(Math.random() * 100) + 10, // Simulated views
        leads: propertyContacts.length,
        bookings: propertyBookings.length,
        messages: propertyContacts.length,
      }
    }

    return NextResponse.json({
      properties,
      stats: propertyStats,
    })
  } catch (error) {
    console.error("Error fetching agent properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}
