"use client"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, Bath, Square } from "lucide-react"

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
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/listings/${property.slug}`}>
      <div className="bg-white rounded-[36px] border border-[#ececee] overflow-hidden cursor-pointer group flex flex-col h-full hover:border-[#d4d4d8] transition-colors">
        {/* Top Image Half */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#f4f4f5]">
          <Image
            src={property.images?.[0] || property.image || "/placeholder.svg?height=400&width=600"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={property.featured}
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-[12px] bg-white/90 backdrop-blur-md text-[13px] font-medium text-[#18181b] border border-[#ececee]">
              {property.priceType === "sale" ? "For Sale" : "For Rent"}
            </span>
            {property.featured && (
              <span className="px-3 py-1 rounded-[12px] bg-[#3f3f46] text-[#fafafa] text-[13px] font-medium border border-[#3f3f46]">
                Featured
              </span>
            )}
            {property.best && (
              <span className="px-3 py-1 rounded-[12px] bg-[#ff5a00] text-white text-[13px] font-medium border border-[#ff5a00]">
                Premium
              </span>
            )}
          </div>
        </div>
        
        {/* Bottom Content Area */}
        <div className="p-[28px] flex flex-col flex-1">
          <div className="flex justify-between items-start mb-4 gap-4">
            <h3 className="text-[20px] font-semibold text-[#09090b] leading-tight line-clamp-2">
              {property.title}
            </h3>
            <div className="text-[20px] font-semibold text-[#09090b] whitespace-nowrap">
              ${property.price.toLocaleString()}
              {property.priceType === "rent" && <span className="text-[13px] text-[#71717a] font-normal block text-right mt-1">/mo</span>}
            </div>
          </div>
          
          <div className="flex items-center text-[#71717a] text-[14px] mb-6 line-clamp-1">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span>{property.address}</span>
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            {property.type.toLowerCase() !== "land" && (
              <>
                <div className="px-2.5 py-1 rounded-[12px] border border-[#ececee] text-[#18181b] text-[13px] flex items-center gap-1.5 bg-transparent">
                  <Users className="w-3.5 h-3.5 text-[#52525b]" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="px-2.5 py-1 rounded-[12px] border border-[#ececee] text-[#18181b] text-[13px] flex items-center gap-1.5 bg-transparent">
                  <Bath className="w-3.5 h-3.5 text-[#52525b]" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </>
            )}
            <div className="px-2.5 py-1 rounded-[12px] border border-[#ececee] text-[#18181b] text-[13px] flex items-center gap-1.5 bg-transparent">
              <Square className="w-3.5 h-3.5 text-[#52525b]" />
              <span>{property.size} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
