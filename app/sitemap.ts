import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://realestate.com"

  // Base routes
  const routes = [
    "",
    "/listings",
    "/about",
    "/contact",
    "/faq",
    "/services",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  try {
    const properties = await db.getProperties()
    const activeProperties = properties.filter((p) => p.status === "active")

    const propertyRoutes = activeProperties.map((property) => ({
      url: `${siteUrl}/listings/${property.slug}`,
      lastModified: property.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...routes, ...propertyRoutes]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return routes
  }
}
