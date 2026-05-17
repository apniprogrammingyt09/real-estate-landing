import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const admin = await db.getAdminById(params.id)

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...adminData } = admin

    return NextResponse.json(adminData)
  } catch (error) {
    console.error("Error fetching admin profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const updates = await request.json()

    const updatedAdmin = await db.updateAdmin(params.id, updates)

    if (!updatedAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...adminData } = updatedAdmin

    return NextResponse.json(adminData)
  } catch (error) {
    console.error("Error updating admin profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
