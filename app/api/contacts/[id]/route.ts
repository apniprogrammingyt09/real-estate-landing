import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updates = await request.json()

    const contact = await db.updateContact(id, updates)

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updates = await request.json()

    const contact = await db.updateContact(id, updates)

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}
