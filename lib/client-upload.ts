"use client"

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
