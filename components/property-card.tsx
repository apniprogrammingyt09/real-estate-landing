"use client"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, Bath, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  image?: string
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
        <div className="bg-card text-card-foreground rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer flex group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
          <div className="relative w-96 h-64 overflow-hidden">
            <Image
              src={property.images?.[0] || property.image || "/placeholder.svg?height=400&width=600"}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              priority={property.featured}
            />
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm">
                {property.priceType === "sale" ? "For Sale" : "For Rent"}
              </span>
              {property.featured && (
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  FEATURED
                </span>
              )}
              {property.best && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-1">
                  ★ PREMIUM
                </span>
              )}
            </div>
          </div>
          <div className="p-10 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start text-emerald-600 font-bold text-[10px] tracking-widest uppercase">
                <MapPin className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2 break-words">{property.address}</span>
              </div>
              <h3 className="text-3xl font-serif tracking-tight text-gray-900 dark:text-white leading-tight line-clamp-1 break-words">
                {property.title}
              </h3>
            </div>
            
            <div className="flex items-center space-x-8">
            {property.type.toLowerCase() !== "land" && (
              <>
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-bold">{property.bedrooms}</span> <span className="ml-1">Beds</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Bath className="w-4 h-4 mr-2" />
                  <span className="font-bold">{property.bathrooms}</span> <span className="ml-1">Baths</span>
                </div>
              </>
            )}
              <div className="flex items-center text-gray-500 text-sm">
                <Square className="w-4 h-4 mr-2" />
                <span className="font-bold">{property.size}</span> <span className="ml-1">m²</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
              <div className="text-3xl font-bold tracking-tighter">
                ${property.price.toLocaleString()}
                {property.priceType === "rent" && <span className="text-sm text-gray-500 font-normal">/mo</span>}
              </div>
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12">
                <Users className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/listings/${property.slug}`}>
      <div className="group bg-card text-card-foreground rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images?.[0] || property.image || "/placeholder.svg?height=400&width=600"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            priority={property.featured}
          />
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm">
              {property.priceType === "sale" ? "For Sale" : "For Rent"}
            </span>
            {property.featured && (
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                FEATURED
              </span>
            )}
            {property.best && (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-1">
                ★ PREMIUM
              </span>
            )}
          </div>
          
          {property.type.toLowerCase() !== "land" && (
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="flex gap-2">
                <div className="px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  <span className="text-xs font-bold">{property.bedrooms}</span>
                </div>
                <div className="px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center gap-2">
                  <Bath className="w-3 h-3" />
                  <span className="text-xs font-bold">{property.bathrooms}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-lg scale-0 group-hover:scale-100 transition-transform duration-500">
                <Users className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-8 space-y-4">
          <div className="flex items-start text-emerald-600 font-bold text-[10px] tracking-widest uppercase">
            <MapPin className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2 break-words">{property.address}</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-2xl font-serif tracking-tight text-gray-900 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 break-words flex-1">
              {property.title}
            </h3>
            <div className="text-xl font-bold tracking-tighter text-right flex-shrink-0">
              ${property.price.toLocaleString()}
              {property.priceType === "rent" && <div className="text-[10px] text-gray-400 font-normal uppercase tracking-widest">per month</div>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
