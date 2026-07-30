import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { signJWT } from "@/lib/jwt"
import { cookies } from "next/headers"

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

    // Create JWT
    const token = await signJWT({
      id: admin.id,
      email: admin.email,
      role: "admin",
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    })

    return NextResponse.json({
      ...adminData,
      role: "admin",
      token, // Also send in body just in case
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
