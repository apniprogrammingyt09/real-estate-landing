import { type NextRequest, NextResponse } from "next/server"
import { blobStorage } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    // Get the filename from the query parameter
    const filename = request.nextUrl.searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 })
    }

    // Get the file from the request
    const file = await request.blob()

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
    }

    // Check file type
    const fileType = file.type
    if (!fileType.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Upload to Cloudinary via our service
    const url = await blobStorage.uploadImage(file as any, filename)

    // Return the URL of the uploaded file
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: `Failed to upload: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
