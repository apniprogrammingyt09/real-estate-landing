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

    // Validate file type (image/png, image/svg+xml, image/gif)
    const allowedTypes = ["image/png", "image/svg+xml", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PNG, SVG, and GIF files are allowed for icons" }, { status: 400 })
    }

    // Validate file size (1MB limit for small icons)
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ error: "Icon file size must be less than 1MB" }, { status: 400 })
    }

    // Check if cloudinary is available
    if (!env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.error("Cloudinary is not configured")
      return NextResponse.json({ 
        error: "File upload is not configured. Please configure Cloudinary." 
      }, { status: 500 })
    }

    // Generate a unique filename
    const filename = `feature-icons/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    // Upload to Cloudinary using uploadIcon method
    const url = await blobStorage.uploadIcon(file, filename)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading icon to Cloudinary:", error)
    return NextResponse.json({ 
      error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
