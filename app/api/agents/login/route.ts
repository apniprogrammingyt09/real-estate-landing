import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { signJWT } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Verify agent credentials using email
    const agent = await db.verifyAgentPassword(email, password)

    if (!agent) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...agentWithoutPassword } = agent

    // Create JWT
    const token = await signJWT({
      id: agent.id,
      email: agent.email,
      role: "agent",
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
      success: true,
      ...agentWithoutPassword,
      role: "agent",
      token,
    })
  } catch (error) {
    console.error("Error during agent login:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
