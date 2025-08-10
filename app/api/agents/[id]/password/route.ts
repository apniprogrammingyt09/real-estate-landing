import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    // Get agent to verify current password
    const agent = await db.getAgent(params.id)
    if (!agent || !agent.password) {
      return NextResponse.json({ error: "Agent not found or no password set" }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, agent.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Update password
    const success = await db.updateAgentPassword(params.id, newPassword)

    if (!success) {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error updating agent password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
