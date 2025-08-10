import { z } from "zod"

const envSchema = z.object({
  MONGODB_URI: z.string().optional(),
  MONGODB_DB: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
})

export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
})
