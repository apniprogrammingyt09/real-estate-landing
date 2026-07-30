import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyRole } from "@/lib/jwt"

export async function GET() {
  try {
    const user = await verifyRole("admin")
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await db.getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
