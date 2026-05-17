import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { env } from "@/lib/env"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "File must be an image or a video" }, { status: 400 })
    }

    // Validate file size (50MB limit for hero background)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 })
    }

    // Check if blob token is available
    if (!env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not configured")
      return NextResponse.json({ 
        error: "File upload is not configured. Please configure Vercel Blob storage." 
      }, { status: 500 })
    }

    // Generate a unique filename
    const folder = isImage ? "hero-images" : "hero-videos"
    const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error uploading to blob storage:", error)
    return NextResponse.json({ 
      error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
