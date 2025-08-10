import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const property = await db.getProperty(id)

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updates = await request.json()

    const property = await db.updateProperty(id, updates)

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const deleted = await db.deleteProperty(id)

    if (!deleted) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}
