export async function uploadAgentAvatar(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload/agent-avatar", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Upload API error:", error)
      throw new Error(error.error || `Upload failed with status: ${response.status}`)
    }

    const { url } = await response.json()
    if (!url) {
      throw new Error("No URL returned from upload service")
    }
    
    return url
  } catch (error) {
    console.error("Error uploading agent avatar:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to upload file")
  }
}

// Keep the existing BlobStorageService for backward compatibility
import { put, del, list } from "@vercel/blob"
import { env } from "./env"

export class BlobStorageService {
  private token: string

  constructor() {
    this.token = env.BLOB_READ_WRITE_TOKEN || ""
  }

  async uploadImage(file: File, pathname: string): Promise<string> {
    try {
      const blob = await put(pathname, file, {
        access: "public",
        token: this.token,
      })
      return blob.url
    } catch (error) {
      console.error("Error uploading to blob storage:", error)
      throw new Error("Failed to upload image")
    }
  }

  async uploadMultipleImages(files: File[], basePath = "properties"): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        const pathname = `${basePath}/${Date.now()}-${index}-${file.name}`
        return this.uploadImage(file, pathname)
      })

      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error("Error uploading multiple images:", error)
      throw new Error("Failed to upload images")
    }
  }

  async deleteImage(url: string): Promise<void> {
    try {
      await del(url, { token: this.token })
    } catch (error) {
      console.error("Error deleting from blob storage:", error)
      throw new Error("Failed to delete image")
    }
  }

  async listImages(prefix?: string) {
    try {
      const { blobs } = await list({
        prefix,
        token: this.token,
      })
      return blobs
    } catch (error) {
      console.error("Error listing blob storage files:", error)
      throw new Error("Failed to list images")
    }
  }
}

export const blobStorage = new BlobStorageService()
