"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface InteractiveMapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLat?: number
  initialLng?: number
}

export default function InteractiveMap({ onLocationSelect, initialLat, initialLng }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        const L = (await import("leaflet")).default

        // Fix for default markers in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        setMapLoaded(true)
        return L
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      const initMap = async () => {
        const L = (await import("leaflet")).default

        // Default to New York City if no initial coordinates
        const defaultLat = initialLat || 40.7128
        const defaultLng = initialLng || -74.006

        // Initialize the map
        const newMap = L.map(mapRef.current!, {
          center: [defaultLat, defaultLng],
          zoom: 13,
          zoomControl: true,
        })

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(newMap)

        setMap(newMap)

        // Add marker for initial location
        const newMarker = L.marker([defaultLat, defaultLng], {
          draggable: true,
        }).addTo(newMap)

        setMarker(newMarker)

        // Handle marker drag events
        newMarker.on("dragend", async (e: any) => {
          const position = e.target.getLatLng()
          const address = await reverseGeocode(position.lat, position.lng)
          onLocationSelect(position.lat, position.lng, address)
        })

        // Handle map click events
        newMap.on("click", async (e: any) => {
          const { lat, lng } = e.latlng
          newMarker.setLatLng([lat, lng])
          const address = await reverseGeocode(lat, lng)
          onLocationSelect(lat, lng, address)
        })

        // Initial address lookup
        const initialAddress = await reverseGeocode(defaultLat, defaultLng)
        onLocationSelect(defaultLat, defaultLng, initialAddress)
      }

      initMap()
    }
  }, [mapLoaded, initialLat, initialLng, onLocationSelect])

  // Simple reverse geocoding using Nominatim (OpenStreetMap's geocoding service)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  // Forward geocoding using Nominatim
  const searchLocation = async () => {
    if (!searchQuery.trim() || !map || !marker) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        const lat = Number.parseFloat(result.lat)
        const lng = Number.parseFloat(result.lon)

        // Update map and marker
        map.setView([lat, lng], 15)
        marker.setLatLng([lat, lng])

        // Notify parent component
        onLocationSelect(lat, lng, result.display_name)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocation()
  }

  return (
    <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      {/* Search Box */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white dark:bg-gray-800 shadow-lg"
          />
          <Button type="submit" size="sm" disabled={isSearching} className="bg-primary hover:bg-primary/90">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>

      <div ref={mapRef} className="absolute inset-0">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Loading Map...</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3 h-3 text-red-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Click or drag to select location</span>
        </div>
      </div>
    </div>
  )
}
