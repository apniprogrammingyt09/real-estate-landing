"use client"
import Image from "next/image"
import Link from "next/link"
import { MapPin, BedDouble, Bath, Square, Car, TreePine, Flame, Zap, Wifi, Wind, Layers } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"

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
  flags?: string[]
  [key: string]: any
}

interface AmenityField {
  key: string
  label: string
  icon: string
  unit?: string
}

interface TypeAmenityConfig {
  typeName: string
  amenities: AmenityField[]
}

interface PropertyCardProps {
  property: Property
  currency?: { symbol: string; position: "prefix" | "suffix" }
  priority?: boolean
  typeAmenityConfigs?: TypeAmenityConfig[]
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  bed: BedDouble,
  bath: Bath,
  square: Square,
  car: Car,
  tree: TreePine,
  flame: Flame,
  zap: Zap,
  wifi: Wifi,
  wind: Wind,
  layers: Layers,
}

const AmenityIcon = ({ icon, className }: { icon: string; className?: string }) => {
  const Ico = ICON_MAP[icon] || Square
  return <Ico className={className} />
}

const DEFAULT_AMENITIES: AmenityField[] = [
  { key: "bedrooms", label: "Beds", icon: "bed", unit: "" },
  { key: "bathrooms", label: "Baths", icon: "bath", unit: "" },
  { key: "size", label: "Area", icon: "square", unit: "sqft" },
]

export default function PropertyCard({ property, currency, priority, typeAmenityConfigs }: PropertyCardProps) {
  // Find amenity config for this property's type (case-insensitive)
  const typeConfig = typeAmenityConfigs?.find(
    (c) => c.typeName.toLowerCase() === property.type?.toLowerCase()
  )
  const amenities = typeConfig?.amenities?.length ? typeConfig.amenities : DEFAULT_AMENITIES

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
            priority={priority || property.featured}
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-[12px] bg-white/90 backdrop-blur-md text-[13px] font-medium text-[#18181b] border border-[#ececee]">
              {property.priceType === "sale" ? "For Sale" : property.priceType === "rent" ? "For Rent" : property.priceType}
            </span>
            {property.flags && property.flags.length > 0 ? (
              property.flags.map((flag) => {
                const isPremium = flag.toLowerCase() === "premium"
                return (
                  <span
                    key={flag}
                    className={cn(
                      "px-3 py-1 rounded-[12px] text-[13px] font-medium border",
                      isPremium
                        ? "bg-[#ff5a00] text-white border-[#ff5a00]"
                        : "bg-[#3f3f46] text-[#fafafa] border-[#3f3f46]"
                    )}
                  >
                    {flag}
                  </span>
                )
              })
            ) : (
              <>
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
              </>
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
              {formatPrice(property.price, currency)}
              {property.priceType === "rent" && <span className="text-[13px] text-[#71717a] font-normal block text-right mt-1">/mo</span>}
            </div>
          </div>

          <div className="flex items-center text-[#71717a] text-[14px] mb-6 line-clamp-1">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span>{property.address}</span>
          </div>

          {/* Dynamic Amenity Fields */}
          <div className="mt-auto flex flex-wrap gap-2">
            {amenities.map((amenity) => {
              const value = property[amenity.key]
              if (value === undefined || value === null || value === "") return null
              return (
                <div
                  key={amenity.key}
                  className="px-2.5 py-1 rounded-[12px] border border-[#ececee] text-[#18181b] text-[13px] flex items-center gap-1.5 bg-transparent"
                >
                  <AmenityIcon icon={amenity.icon} className="w-3.5 h-3.5 text-[#52525b]" />
                  <span>
                    {value}
                    {amenity.unit ? ` ${amenity.unit}` : ""}{" "}
                    {amenity.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Link>
  )
}
