import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyRole } from "@/lib/jwt"

export async function GET() {
  try {
    const user = await verifyRole("admin")
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allProperties = await db.getProperties()
    const activeProperties = allProperties.filter((p) => p.status === "active")
    const pendingProperties = allProperties.filter((p) => p.status === "pending")
    const rejectedProperties = allProperties.filter((p) => p.status === "rejected")

    return NextResponse.json({
      active: activeProperties,
      pending: pendingProperties,
      rejected: rejectedProperties,
      total: allProperties.length,
    })
  } catch (error) {
    console.error("Error fetching admin properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyRole("admin")
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, agentId, featured, best, flags, reason } = body
    const propertyId = body.propertyId !== undefined ? Number(body.propertyId) : undefined

    console.log("Admin action received:", { action, propertyId, agentId, featured, best, flags, reason })

    switch (action) {
      case "approve":
        if (!propertyId) {
          return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
        }

        const approvedProperty = await db.approveProperty(propertyId, agentId)
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
        if (flags !== undefined) updates.flags = flags

        const updatedProperty = await db.updateProperty(propertyId, updates)
        if (!updatedProperty) {
          return NextResponse.json({ error: "Property not found" }, { status: 404 })
        }

        console.log("Property tags updated:", updatedProperty)
        return NextResponse.json(updatedProperty)

      case "assignAgent":
        if (!propertyId || !agentId) {
          console.error("assignAgent: missing IDs", { propertyId, agentId, rawPropertyId: body.propertyId })
          return NextResponse.json({ error: "Property ID and Agent ID are required" }, { status: 400 })
        }

        console.log("assignAgent: attempting with", { propertyId, agentId, propertyIdType: typeof propertyId })
        const assigned = await db.assignAgentToProperty(propertyId, agentId)
        console.log("assignAgent: result =", assigned)
        if (!assigned) {
          return NextResponse.json({ error: "Property or agent not found" }, { status: 404 })
        }

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
