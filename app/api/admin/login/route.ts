import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const admin = await db.verifyAdminPassword(email, password)

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Don't send password in response
    const { password: _, ...adminData } = admin

    return NextResponse.json({
      ...adminData,
      role: "admin",
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
