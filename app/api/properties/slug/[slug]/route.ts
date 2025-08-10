import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params
    const properties = await db.getProperties({ status: "active" })
    const property = properties.find((p) => p.slug === slug)

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property by slug:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}
