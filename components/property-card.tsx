"use client"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, Bath, Square } from "lucide-react"
import ShareButton from "@/components/share-button"
import LikeButton from "@/components/like-button"

interface Property {
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
  image: string
  images?: string[]
  slug: string
}

interface PropertyCardProps {
  property: Property
  viewType?: "grid" | "list"
}

export default function PropertyCard({ property, viewType = "grid" }: PropertyCardProps) {
  const propertyUrl =
    typeof window !== "undefined" ? `${window.location.origin}/listings/${property.slug}` : `/listings/${property.slug}`

  if (viewType === "list") {
    return (
      <Link href={`/listings/${property.slug}`}>
        <div className="card-base card-hover overflow-hidden cursor-pointer flex group">
          <div className="relative w-80 h-48 overflow-hidden">
            <Image
              src={property.images?.[0] || property.image || "/placeholder.svg?height=300&width=400"}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=300&width=400"
              }}
              priority={property.featured}
            />
            <div className="absolute top-4 left-4 flex space-x-2">
              <span
                className={`${property.type === "FOR SALE" ? "bg-secondary" : "bg-primary"} text-white px-2 py-1 rounded text-xs font-medium`}
              >
                {property.type}
              </span>
              {property.featured && (
                <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">FEATURED</span>
              )}
              {property.best && (
                <span className="bg-accent text-white px-2 py-1 rounded text-xs font-medium">PREMIUM</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div onClick={(e) => e.preventDefault()}>
                <LikeButton
                  propertyId={property.id}
                  propertyTitle={property.title}
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 rounded-full shadow-sm"
                />
              </div>

              <div onClick={(e) => e.preventDefault()}>
                <ShareButton
                  url={propertyUrl}
                  title={property.title}
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="p-6 flex-1">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center mb-4">
              <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2 flex-shrink-0 stroke-2" />
              <span className="text-gray-500 dark:text-gray-400 text-sm">{property.address}</span>
            </div>
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center group-hover:text-primary transition-colors">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 stroke-2" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{property.bedrooms} beds</span>
              </div>
              <div className="flex items-center group-hover:text-primary transition-colors">
                <Bath className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 stroke-2" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{property.bathrooms} baths</span>
              </div>
              <div className="flex items-center group-hover:text-primary transition-colors">
                <Square className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0 stroke-2" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{property.size} sq ft</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform origin-left">
              ${property.price.toLocaleString()}
              {property.priceType === "rent" && (
                <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/listings/${property.slug}`}>
      <div className="card-base card-hover overflow-hidden cursor-pointer group">
        <div className="relative overflow-hidden">
          <Image
            src={property.images?.[0] || property.image || "/placeholder.svg?height=300&width=400"}
            alt={property.title}
            width={500}
            height={300}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=400"
            }}
            priority={property.featured}
          />
          <div className="absolute top-4 left-4 flex space-x-2">
            <span
              className={`${property.type === "FOR SALE" ? "bg-secondary" : "bg-primary"} text-white px-2 py-1 rounded text-xs font-medium`}
            >
              {property.type}
            </span>
            {property.featured && (
              <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">FEATURED</span>
            )}
            {property.best && (
              <span className="bg-accent text-white px-2 py-1 rounded text-xs font-medium">PREMIUM</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div onClick={(e) => e.preventDefault()}>
              <LikeButton
                propertyId={property.id}
                propertyTitle={property.title}
                variant="secondary"
                className="bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 rounded-full shadow-sm"
              />
            </div>

            <div onClick={(e) => e.preventDefault()}>
              <ShareButton
                url={propertyUrl}
                title={property.title}
                variant="secondary"
                className="bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center mb-4">
            <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-1 flex-shrink-0 stroke-2" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">{property.address}</span>
          </div>
          <div className="flex justify-between mb-6">
            <div className="flex items-center group-hover:text-primary transition-colors">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1 flex-shrink-0 stroke-2" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center group-hover:text-primary transition-colors">
              <Bath className="w-4 h-4 text-green-600 dark:text-green-400 mr-1 flex-shrink-0 stroke-2" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center group-hover:text-primary transition-colors">
              <Square className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-1 flex-shrink-0 stroke-2" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{property.size}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform origin-left">
            ${property.price.toLocaleString()}
            {property.priceType === "rent" && <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
