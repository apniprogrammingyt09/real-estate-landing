import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const allProperties = await db.getProperties()
    const activeProperties = allProperties.filter((p) => p.status === "active")
    const pendingProperties = allProperties.filter((p) => p.status === "pending")

    return NextResponse.json({
      active: activeProperties,
      pending: pendingProperties,
      total: allProperties.length,
    })
  } catch (error) {
    console.error("Error fetching admin properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, propertyId, agentId, featured, best, reason } = body

    console.log("Admin action received:", { action, propertyId, agentId, featured, best, reason })

    switch (action) {
      case "approve":
        if (!propertyId) {
          return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
        }

        const approvedProperty = await db.approveProperty(propertyId)
        if (!approvedProperty) {
          return NextResponse.json({ error: "Property not found or already processed" }, { status: 404 })
        }

        console.log("Property approved:", approvedProperty)
        return NextResponse.json(approvedProperty)

      case "reject":
        if (!propertyId) {
          return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
        }

        const rejected = await db.rejectProperty(propertyId, reason)
        if (!rejected) {
          return NextResponse.json({ error: "Property not found or already processed" }, { status: 404 })
        }

        console.log("Property rejected:", propertyId)
        return NextResponse.json({ success: true })

      case "updateTags":
        if (!propertyId) {
          return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
        }

        const updates: any = {}
        if (featured !== undefined) updates.featured = featured
        if (best !== undefined) updates.best = best

        const updatedProperty = await db.updateProperty(propertyId, updates)
        if (!updatedProperty) {
          return NextResponse.json({ error: "Property not found" }, { status: 404 })
        }

        console.log("Property tags updated:", updatedProperty)
        return NextResponse.json(updatedProperty)

      case "assignAgent":
        if (!propertyId || !agentId) {
          return NextResponse.json({ error: "Property ID and Agent ID are required" }, { status: 400 })
        }

        const assigned = await db.assignAgentToProperty(propertyId, agentId)
        if (!assigned) {
          return NextResponse.json({ error: "Property or agent not found" }, { status: 404 })
        }

        console.log("Agent assigned to property:", { propertyId, agentId })
        return NextResponse.json({ success: true })

      default:
        console.error("Invalid action:", action)
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing admin action:", error)
    return NextResponse.json(
      {
        error: "Failed to process action",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
