import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const settings = await db.getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json()
    const settings = await db.updateSettings(updates)
    
    if (!settings) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 400 })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
