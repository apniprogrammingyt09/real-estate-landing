"use client"

import { MapPin } from "lucide-react"

interface MapFallbackProps {
  location: {
    lat: number
    lng: number
    address: string
  }
  className?: string
}

export default function MapFallback({ location, className = "" }: MapFallbackProps) {
  return (
    <div
      className={`relative w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Map Location</p>
          <p className="text-gray-900 dark:text-white font-medium">{location.address}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  )
}
