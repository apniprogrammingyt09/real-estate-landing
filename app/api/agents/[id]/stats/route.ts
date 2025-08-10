import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agentId = params.id

    // Get agent's properties
    const agentProperties = await db.getProperties({ agentId, status: "active" })
    const propertyIds = agentProperties.map((p) => p.id)

    // Get all contacts and bookings
    const [allContacts, allBookings] = await Promise.all([db.getContacts(), db.getBookings()])

    // Filter data for this agent
    const agentContacts = allContacts.filter((contact) => {
      return contact.agentId === agentId || (contact.propertyId && propertyIds.includes(contact.propertyId))
    })

    const agentBookings = allBookings.filter((booking) => {
      return booking.agentId === agentId || propertyIds.includes(booking.propertyId)
    })

    // Calculate real stats
    const totalProperties = agentProperties.length
    const activeListings = agentProperties.filter((p) => p.status === "active").length

    const totalLeads = agentContacts.length
    const newLeads = agentContacts.filter((c) => c.status === "new").length

    const scheduledViewings = agentBookings.filter((b) => b.status === "pending" || b.status === "confirmed").length
    const today = new Date().toISOString().split("T")[0]
    const todayViewings = agentBookings.filter(
      (b) => (b.status === "pending" || b.status === "confirmed") && b.date === today,
    ).length

    const totalMessages = agentContacts.length
    const unreadMessages = agentContacts.filter((c) => c.status === "new").length

    return NextResponse.json({
      totalProperties,
      activeListings,
      totalLeads,
      newLeads,
      scheduledViewings,
      todayViewings,
      totalMessages,
      unreadMessages,
    })
  } catch (error) {
    console.error("Error fetching agent stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
