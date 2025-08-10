import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agentId = params.id

    // First, get all properties assigned to this agent
    const agentProperties = await db.getProperties({ agentId })
    const propertyIds = agentProperties.map((p) => p.id)

    // Get all bookings
    const allBookings = await db.getBookings()

    // Filter bookings to only include those for agent's properties
    const agentBookings = allBookings.filter((booking) => propertyIds.includes(booking.propertyId))

    // Add property address to bookings
    const bookingsWithDetails = await Promise.all(
      agentBookings.map(async (booking) => {
        const property = agentProperties.find((p) => p.id === booking.propertyId)
        return {
          ...booking,
          propertyAddress: property?.address || null,
        }
      }),
    )

    return NextResponse.json(bookingsWithDetails)
  } catch (error) {
    console.error("Error fetching agent bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
