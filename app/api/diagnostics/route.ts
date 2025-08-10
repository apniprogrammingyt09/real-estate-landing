import { NextResponse } from "next/server"
import { env } from "@/lib/env"
import { getDatabase } from "@/lib/mongodb"
import { blobStorage } from "@/lib/blob-storage"

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    services: {
      database: {
        configured: !!env.MONGODB_URI,
        connected: false,
        error: null as string | null,
      },
      blobStorage: {
        configured: !!env.BLOB_READ_WRITE_TOKEN,
        accessible: false,
        error: null as string | null,
      },
      admin: {
        configured: !!env.ADMIN_EMAIL,
        email: env.ADMIN_EMAIL ? "***@***.***" : null,
      },
    },
    config: {
      baseUrl: env.NEXT_PUBLIC_BASE_URL || "Not configured",
      databaseName: env.MONGODB_DB || "Not configured",
    },
  }

  // Test database connection
  try {
    const db = await getDatabase()
    await db.admin().ping()
    diagnostics.services.database.connected = true
  } catch (error) {
    diagnostics.services.database.error = error instanceof Error ? error.message : "Unknown error"
  }

  // Test blob storage
  try {
    await blobStorage.listImages()
    diagnostics.services.blobStorage.accessible = true
  } catch (error) {
    diagnostics.services.blobStorage.error = error instanceof Error ? error.message : "Unknown error"
  }

  return NextResponse.json(diagnostics)
}
