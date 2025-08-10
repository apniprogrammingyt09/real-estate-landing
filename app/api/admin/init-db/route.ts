import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Force re-initialization of the database
    await db.initializeDatabase(true)

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with sample data",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
