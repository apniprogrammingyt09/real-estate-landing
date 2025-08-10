"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"

interface Property {
  id: number
  title: string
  address: string
  price: number
  priceType: "sale" | "rent"
  bedrooms: number
  bathrooms: number
  size: number
  type: string
  featured: boolean
  best?: boolean
  images: string[]
  slug: string
  neighborhood?: string
}

interface SimilarPropertiesProps {
  currentPropertySlug: string
}

export default function SimilarProperties({ currentPropertySlug }: SimilarPropertiesProps) {
  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        // Use absolute URL for client-side fetch
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

        const response = await fetch(`${baseUrl}/api/properties?status=active`)

        if (!response.ok) {
          throw new Error("Failed to fetch properties")
        }

        const allProperties = await response.json()

        // Filter out current property and get 3 similar ones
        const filtered = allProperties.filter((p: Property) => p.slug !== currentPropertySlug).slice(0, 3)

        setSimilarProperties(filtered)
      } catch (error) {
        console.error("Error fetching similar properties:", error)
        // Fallback to empty array on error
        setSimilarProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarProperties()
  }, [currentPropertySlug])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="card-base rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  if (similarProperties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No similar properties found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {similarProperties.map((property) => (
        <div key={property.id} className="card-base rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <Link href={`/listings/${property.slug}`}>
            <div className="relative h-48 w-full">
              <Image
                src={property.images?.[0] || "/placeholder.svg?height=300&width=400"}
                alt={property.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=300&width=400"
                }}
              />
              <div className="absolute top-2 left-2 flex space-x-1">
                {property.featured && (
                  <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">FEATURED</span>
                )}
                {property.best && (
                  <span className="bg-accent text-white px-2 py-1 rounded text-xs font-medium">PREMIUM</span>
                )}
              </div>
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/listings/${property.slug}`}>
              <h3 className="text-gray-900 dark:text-white font-medium hover:text-primary transition-colors mb-2">
                {property.title}
              </h3>
            </Link>
            <div className="flex items-center mt-1 mb-2">
              <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1" />
              <span className="text-gray-500 dark:text-gray-400 text-xs">{property.address}</span>
            </div>
            <div className="text-primary font-bold">
              ${property.price.toLocaleString()}
              {property.priceType === "rent" && (
                <span className="text-xs text-gray-500 dark:text-gray-400">/month</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
