import { v2 as cloudinary } from "cloudinary"
import { env } from "./env"

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
})



// Keep the existing BlobStorageService for backward compatibility
export class BlobStorageService {
  async uploadImage(file: File, pathname: string): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const folder = pathname.includes('/') ? pathname.substring(0, pathname.lastIndexOf('/')) : ''
      const public_id = pathname.includes('/') ? pathname.substring(pathname.lastIndexOf('/') + 1) : pathname
      
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder, 
            public_id: public_id.replace(/\.[^/.]+$/, "") // Remove extension
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error)
              reject(new Error("Failed to upload image to Cloudinary"))
            } else {
              // Generate the URL with on-the-fly transformations
              const optimizedUrl = cloudinary.url(result!.public_id, {
                secure: true,
                transformation: [
                  { width: 800, crop: "scale" },
                  { quality: "auto" }
                ]
              })
              resolve(optimizedUrl)
            }
          }
        )
        uploadStream.end(buffer)
      })
    } catch (error) {
      console.error("Error preparing to upload to cloudinary:", error)
      throw new Error("Failed to upload image")
    }
  }

  async uploadMultipleImages(files: File[], basePath = "properties"): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        const pathname = `${basePath}/${Date.now()}-${index}-${file.name.replace(/\\s+/g, "-")}`
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
      // Extract public_id from Cloudinary URL
      // Format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<public_id>.<ext>
      const urlParts = url.split('/')
      const uploadIndex = urlParts.findIndex(part => part === 'upload')
      if (uploadIndex !== -1) {
        // Skip 'v' version string if present
        let startIndex = uploadIndex + 1
        if (urlParts[startIndex].startsWith('v') && !isNaN(parseInt(urlParts[startIndex].substring(1)))) {
          startIndex++
        }
        const publicIdWithExt = urlParts.slice(startIndex).join('/')
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "") // Remove extension
        
        await cloudinary.uploader.destroy(publicId)
      }
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error)
      throw new Error("Failed to delete image")
    }
  }

  async listImages(prefix?: string) {
    try {
      const result = await cloudinary.search
        .expression(prefix ? `folder:${prefix}*` : "")
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute()
        
      return result.resources.map((res: any) => ({
        url: res.secure_url,
        pathname: res.public_id,
        size: res.bytes,
        uploadedAt: new Date(res.created_at)
      }))
    } catch (error) {
      console.error("Error listing Cloudinary files:", error)
      throw new Error("Failed to list images")
    }
  }
}

export const blobStorage = new BlobStorageService()
