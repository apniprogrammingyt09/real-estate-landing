import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { signJWT } from "@/lib/jwt"
import { cookies } from "next/headers"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const database = await getDatabase()
    const user = await database.collection("users").findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set last login time
    const lastLogin = new Date().toISOString()
    await database.collection("users").updateOne({ id: user.id }, { $set: { lastLogin } })

    // Generate JWT
    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
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

    const { password: _, _id: __, ...userData } = user

    return NextResponse.json({
      success: true,
      ...userData,
      lastLogin,
      token,
    })
  } catch (error) {
    console.error("Unified login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
