export const config = {
  app: {
    name: "Real Estate Platform",
    description: "Find your perfect property",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  },
  database: {
    uri: process.env.MONGODB_URI!,
    name: process.env.MONGODB_DB!,
  },
  storage: {
    token: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
  },
  features: {
    enableImageUpload: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    enableDatabase: !!process.env.MONGODB_URI,
  },
} as const

export default config
