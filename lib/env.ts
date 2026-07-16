import { z } from "zod"

const envSchema = z.object({
  MONGODB_URI: z.string().optional(),
  MONGODB_DB: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
})

export const env = envSchema.parse({
  MONGODB_URI: typeof process !== "undefined" ? process.env.MONGODB_URI : undefined,
  MONGODB_DB: typeof process !== "undefined" ? process.env.MONGODB_DB : undefined,
  CLOUDINARY_API_KEY: typeof process !== "undefined" ? process.env.CLOUDINARY_API_KEY : undefined,
  CLOUDINARY_API_SECRET: typeof process !== "undefined" ? process.env.CLOUDINARY_API_SECRET : undefined,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: typeof process !== "undefined" ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : undefined,
  NEXT_PUBLIC_BASE_URL: typeof process !== "undefined" ? process.env.NEXT_PUBLIC_BASE_URL : undefined,
  ADMIN_EMAIL: typeof process !== "undefined" ? process.env.ADMIN_EMAIL : undefined,
  NODE_ENV: typeof process !== "undefined" ? (process.env.NODE_ENV as "development" | "production" | "test") : undefined,
})
