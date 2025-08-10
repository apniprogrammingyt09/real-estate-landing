export interface Property {
  id: number
  title: string
  address: string
  price: number
  priceType: string
  bedrooms: number
  bathrooms: number
  size: number
  type: string
  featured: boolean
  best: boolean
  status: string
  images: string[]
  slug: string
  description: string
  yearBuilt: number
  propertyId: string | null
  neighborhood: string
  features: string[]
  location: {
    lat: number
    lng: number
    address: string
  }
  agentId: string | null
  agentName: string | null
  createdAt: string
  updatedAt: string
  submittedBy?: {
    name: string
    email: string
    phone: string
  }
}

// Client-side data fetching functions
export async function getProperties(filters?: {
  type?: string
  status?: string
  featured?: boolean
  best?: boolean
}): Promise<Property[]> {
  const params = new URLSearchParams()

  if (filters?.type) params.append("type", filters.type)
  if (filters?.status) params.append("status", filters.status)
  if (filters?.featured) params.append("featured", "true")
  if (filters?.best) params.append("best", "true")

  const response = await fetch(`/api/properties?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch properties")
  }
  return response.json()
}

export async function getProperty(id: number): Promise<Property | null> {
  const response = await fetch(`/api/properties/${id}`)
  if (!response.ok) {
    return null
  }
  return response.json()
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    // Check if we're on the server side
    if (typeof window === "undefined") {
      // Server-side: use the database directly
      const { db } = await import("./db")
      return await db.getPropertyBySlug(slug)
    }

    // Client-side: use fetch with absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/properties/slug/${slug}`)
    if (!response.ok) {
      return null
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching property by slug:", error)
    return null
  }
}

export async function createProperty(property: Partial<Property>): Promise<Property> {
  const response = await fetch("/api/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(property),
  })

  if (!response.ok) {
    throw new Error("Failed to create property")
  }

  return response.json()
}

export async function updateProperty(id: number, updates: Partial<Property>): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error("Failed to update property")
  }

  return response.json()
}

export async function deleteProperty(id: number): Promise<void> {
  const response = await fetch(`/api/properties/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete property")
  }
}

// Admin functions
export async function getAdminProperties(): Promise<{
  active: Property[]
  pending: Property[]
  total: number
}> {
  const response = await fetch("/api/admin/properties")
  if (!response.ok) {
    throw new Error("Failed to fetch admin properties")
  }
  return response.json()
}

export async function approveProperty(propertyId: number): Promise<void> {
  const response = await fetch("/api/admin/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "approve", propertyId }),
  })

  if (!response.ok) {
    throw new Error("Failed to approve property")
  }
}

export async function rejectProperty(propertyId: number): Promise<void> {
  const response = await fetch("/api/admin/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "reject", propertyId }),
  })

  if (!response.ok) {
    throw new Error("Failed to reject property")
  }
}

export async function updatePropertyTags(
  propertyId: number,
  tags: { featured?: boolean; best?: boolean },
): Promise<void> {
  const response = await fetch("/api/admin/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "updateTags", propertyId, ...tags }),
  })

  if (!response.ok) {
    throw new Error("Failed to update property tags")
  }
}

export async function assignAgentToProperty(propertyId: number, agentId: string): Promise<void> {
  const response = await fetch("/api/admin/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "assignAgent", propertyId, agentId }),
  })

  if (!response.ok) {
    throw new Error("Failed to assign agent to property")
  }
}

// Helper functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function uploadImage(file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name}`

  const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
    method: "POST",
    body: file,
  })

  if (!response.ok) {
    throw new Error("Failed to upload image")
  }

  const { url } = await response.json()
  return url
}

export function generatePropertyId(): string {
  // This will be handled server-side, but keeping for compatibility
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `PR-${timestamp}-${random}`
}
