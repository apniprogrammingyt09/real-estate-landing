import { db } from "./db"
import { type Property } from "./properties-data"

export async function getPropertiesServer(filters?: {
  type?: string
  status?: string
  featured?: boolean
  best?: boolean
}): Promise<Property[]> {
  return await db.getProperties(filters)
}

export async function getPropertyServer(id: number): Promise<Property | null> {
  const property = await db.getProperty(id)
  return property as Property | null
}

export async function getPropertyBySlugServer(slug: string): Promise<Property | null> {
  const property = await db.getPropertyBySlug(slug)
  return property as Property | null
}
