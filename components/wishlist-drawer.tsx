"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Property {
  id: number
  title: string
  address: string
  price: number
  priceType: string
  images?: string[]
  image?: string
  slug: string
}

export default function WishlistDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [likedIds, setLikedIds] = useState<number[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)

  // Load liked properties from localStorage
  const loadLikes = () => {
    if (typeof window !== "undefined") {
      const likes = JSON.parse(localStorage.getItem("likedProperties") || "[]")
      setLikedIds(likes)
    }
  }

  // Load properties when drawer opens
  useEffect(() => {
    if (isOpen) {
      loadLikes()
      fetchProperties()
    }
  }, [isOpen])

  // Listen for local storage changes or custom events from LikeButton
  useEffect(() => {
    loadLikes()
    
    // Add event listener for dynamic like updates
    const handleLikesUpdate = () => {
      loadLikes()
    }
    window.addEventListener("likes-updated", handleLikesUpdate)
    return () => {
      window.removeEventListener("likes-updated", handleLikesUpdate)
    }
  }, [])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Error fetching properties for wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeLike = (propertyId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const updatedLikes = likedIds.filter((id) => id !== propertyId)
    localStorage.setItem("likedProperties", JSON.stringify(updatedLikes))
    setLikedIds(updatedLikes)
    
    // Dispatch event to update LikeButtons in page components
    window.dispatchEvent(new Event("likes-updated"))
  }

  const likedProperties = properties.filter((p) => likedIds.includes(p.id))

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer shadow-sm flex items-center justify-center"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-transform group-hover:scale-110 ${likedIds.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
          {likedIds.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {likedIds.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md bg-white dark:bg-gray-950 border-l dark:border-gray-800 flex flex-col h-full p-6">
        <SheetHeader className="pb-6 border-b dark:border-gray-800">
          <SheetTitle className="text-xl font-serif flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            My Wishlist
            {likedProperties.length > 0 && (
              <span className="bg-red-50 dark:bg-red-950/30 text-red-600 text-xs px-2.5 py-1 rounded-full font-bold">
                {likedProperties.length} {likedProperties.length === 1 ? "Property" : "Properties"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            View and manage your saved luxury properties in one place.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable wishlist list */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 animate-pulse border dark:border-gray-800/40">
                  <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 pt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : likedProperties.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 mb-4 animate-pulse">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[240px] mb-8 leading-relaxed">
                Save your favorite luxury estates and explore them anytime in one click.
              </p>
              <Link href="/listings" onClick={() => setIsOpen(false)}>
                <Button className="rounded-full px-8 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold transition-all shadow-md">
                  Explore Collection
                </Button>
              </Link>
            </div>
          ) : (
            likedProperties.map((property) => (
              <Link
                key={property.id}
                href={`/listings/${property.slug}`}
                onClick={() => setIsOpen(false)}
                className="group flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border dark:border-gray-800">
                  <Image
                    src={property.images?.[0] || property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-6 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {property.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 flex items-center font-medium">
                      <MapPin className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </p>
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                    ${property.price.toLocaleString()}
                    {property.priceType === "rent" && <span className="text-[10px] text-gray-400 font-normal">/mo</span>}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => removeLike(property.id, e)}
                  className="absolute right-3 top-3 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
