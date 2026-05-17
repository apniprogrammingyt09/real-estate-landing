import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const agentId = params.id

    // Get recent contacts
    const contacts = await db.getContacts()
    const agentContacts = contacts
      .filter((c) => c.agentId === agentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)

    // Get recent bookings
    const bookings = await db.getBookings()
    const agentBookings = bookings
      .filter((b) => b.agentId === agentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)

    // Combine and format activity
    const activity = [
      ...agentContacts.map((contact) => ({
        id: contact.id,
        type: "lead" as const,
        title: `New lead from ${contact.name}`,
        description: contact.subject,
        time: new Date(contact.createdAt).toLocaleDateString(),
        status: contact.status,
      })),
      ...agentBookings.map((booking) => ({
        id: booking.id,
        type: "booking" as const,
        title: `Viewing scheduled`,
        description: `${booking.name} wants to view a property`,
        time: new Date(booking.createdAt).toLocaleDateString(),
        status: booking.status,
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Error fetching agent activity:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}
