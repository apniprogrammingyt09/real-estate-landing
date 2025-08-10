import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    // Clear existing data
    const database = await getDatabase()

    await Promise.all([
      database.collection("properties").deleteMany({}),
      database.collection("agents").deleteMany({}),
      database.collection("activities").deleteMany({}),
      database.collection("counters").deleteMany({}),
    ])

    // Reinitialize with new data
    await db.initializeDatabase()

    return NextResponse.json({
      success: true,
      message: "Database reset and reinitialized successfully",
    })
  } catch (error) {
    console.error("Error resetting database:", error)
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 })
  }
}
