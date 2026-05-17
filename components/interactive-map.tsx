"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MapPin, Search, Crosshair } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

interface InteractiveMapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLat?: number
  initialLng?: number
}

// A free minimalist raster tile style using OpenStreetMap
const mapStyle = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
} as const

export default function InteractiveMap({ onLocationSelect, initialLat, initialLng }: InteractiveMapProps) {
  const [markerPosition, setMarkerPosition] = useState({
    lat: initialLat || 40.7128,
    lng: initialLng || -74.006,
  })
  
  const [viewState, setViewState] = useState({
    longitude: initialLng || -74.006,
    latitude: initialLat || 40.7128,
    zoom: 13
  })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const mapRef = useRef<any>(null)

  // Reverse geocoding using Nominatim (free OSM geocoder)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      onLocationSelect(lat, lng, address)
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    }
  }

  // Initial reverse geocode on mount
  useEffect(() => {
    reverseGeocode(markerPosition.lat, markerPosition.lng)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        setMarkerPosition({ lat, lng })
        setViewState({ ...viewState, latitude: lat, longitude: lng, zoom: 15 })
        reverseGeocode(lat, lng)
        setIsLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to retrieve your location. Please check your browser permissions.")
        setIsLocating(false)
      }
    )
  }

  const handleMapClick = (e: any) => {
    const lat = e.lngLat.lat
    const lng = e.lngLat.lng
    setMarkerPosition({ lat, lng })
    reverseGeocode(lat, lng)
  }

  const handleMarkerDragEnd = (e: any) => {
    const lat = e.lngLat.lat
    const lng = e.lngLat.lng
    setMarkerPosition({ lat, lng })
    reverseGeocode(lat, lng)
  }

  const searchLocation = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&addressdetails=1`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        const lat = Number.parseFloat(result.lat)
        const lng = Number.parseFloat(result.lon)

        setMarkerPosition({ lat, lng })
        setViewState({ ...viewState, latitude: lat, longitude: lng, zoom: 15 })
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
      {/* Search Box */}
      <div className="absolute top-4 left-4 right-4 z-[10]">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white dark:bg-gray-800 shadow-lg"
          />
          <Button type="submit" size="sm" disabled={isSearching} className="bg-primary hover:bg-primary/90 text-white shadow-lg">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>
        <div className="mt-2 flex justify-end">
          <Button 
            type="button" 
            size="sm" 
            variant="secondary"
            onClick={getUserLocation}
            disabled={isLocating}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {isLocating ? (
              <div className="w-4 h-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4 mr-2" />
            )}
            Use My Location
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapLib={maplibregl as any}
          mapStyle={mapStyle as any}
          onClick={handleMapClick}
        >
          <NavigationControl position="bottom-right" />
          
          <Marker
            longitude={markerPosition.lng}
            latitude={markerPosition.lat}
            anchor="bottom"
            draggable
            onDragEnd={handleMarkerDragEnd}
          >
            <MapPin className="h-8 w-8 text-red-500 fill-white dark:fill-gray-900 drop-shadow-md cursor-pointer" />
          </Marker>
        </Map>
      </div>

      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[10] border dark:border-gray-700 pointer-events-none">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3 h-3 text-red-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Click or drag pin to select location</span>
        </div>
      </div>
    </div>
  )
}
