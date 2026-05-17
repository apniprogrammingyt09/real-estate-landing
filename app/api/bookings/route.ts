import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const bookings = await db.getBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyId, name, email, phone, date, time, message } = body

    console.log("Booking request received:", { propertyId, name, email, phone, date, time })

    // Validate required fields
    if (!propertyId || !name || !email || !phone || !date || !time) {
      console.error("Missing required fields:", { propertyId, name, email, phone, date, time })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Parse propertyId to ensure it's a number
    const parsedPropertyId = typeof propertyId === "string" ? Number.parseInt(propertyId, 10) : propertyId

    if (isNaN(parsedPropertyId)) {
      console.error("Invalid property ID format:", propertyId)
      return NextResponse.json({ error: "Invalid property ID format" }, { status: 400 })
    }

    // Get property details to get the title and assigned agent
    const property = await db.getProperty(parsedPropertyId)
    if (!property) {
      console.error("Property not found with ID:", parsedPropertyId)
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    console.log("Property found:", property.title)

    const booking = await db.createBooking({
      propertyId: parsedPropertyId,
      propertyTitle: property.title,
      name,
      email,
      phone,
      date,
      time,
      message,
      status: "pending",
      agentId: property.agentId || undefined, // Link booking to property's agent
    })

    console.log("Booking created successfully:", booking.id)
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
