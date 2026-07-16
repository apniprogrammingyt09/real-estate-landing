import { type NextRequest, NextResponse } from "next/server"
import { blobStorage } from "@/lib/blob-storage"
import { env } from "@/lib/env"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 })
    }

    // Check if cloudinary is available
    if (!env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.error("Cloudinary is not configured")
      return NextResponse.json({ 
        error: "File upload is not configured. Please configure Cloudinary." 
      }, { status: 500 })
    }

    // Generate a unique filename
    const filename = `agent-avatars/${Date.now()}-${file.name.replace(/\\s+/g, "-")}`

    // Upload to Cloudinary
    const url = await blobStorage.uploadImage(file, filename)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    return NextResponse.json({ 
      error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
