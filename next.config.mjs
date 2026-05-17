/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevent server-only native Node.js packages from leaking into client bundles.
  // These are pulled in by the MongoDB driver and cause webpack factory crashes
  // (TypeError: Cannot read properties of undefined (reading 'call')) during hydration.
  // NOTE: In Next.js 15 this key was promoted to `serverExternalPackages` (stable).
  //       We are on Next.js 14 so we use the `experimental` namespace.
  serverExternalPackages: [
    "mongodb",
    "mongoose",
    "bcryptjs",
    "kerberos",
    "snappy",
    "@mongodb-js/zstd",
    "mongodb-client-encryption",
    "gcp-metadata",
    "socks",
    "aws4",
    "@aws-sdk/credential-providers",
    "nodemailer",
  ],
  experimental: {
    // Keep experimental empty or add other experimental flags if needed
  },
}

export default nextConfig
