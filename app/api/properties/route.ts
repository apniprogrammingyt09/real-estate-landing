import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const priceType = searchParams.get("priceType")
    const status = searchParams.get("status")
    const featured = searchParams.get("featured") === "true"
    const best = searchParams.get("best") === "true"

    const filters: any = {}

    if (status) filters.status = status
    if (featured) filters.featured = true
    if (best) filters.best = true

    let properties = await db.getProperties(filters)

    // Apply additional filters with safety checks
    if (type && type !== "all") {
      properties = properties.filter((p) => p.type && p.type.toLowerCase() === type.toLowerCase())
    }

    if (priceType && priceType !== "all") {
      properties = properties.filter((p) => p.priceType && p.priceType.toLowerCase() === priceType.toLowerCase())
    }

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create property with pending status for admin approval
    const newProperty = await db.createProperty({
      ...body,
      status: "pending",
      featured: false,
      best: false,
      propertyId: null,
      agentId: null,
      agentName: null,
    })

    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
