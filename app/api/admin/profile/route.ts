import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    return NextResponse.json(session.user)
  } catch (error) {
    console.error("Error fetching admin profile:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await request.json()
    const { name, email } = data

    const { db } = await connectToDatabase()

    // Update the admin user in the database
    await db.collection("admins").updateOne({ email: session.user.email }, { $set: { name, email } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating admin profile:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
