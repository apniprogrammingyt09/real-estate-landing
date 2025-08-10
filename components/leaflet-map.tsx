"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface LeafletMapProps {
  location: {
    lat: number
    lng: number
    address: string
  }
  className?: string
  interactive?: boolean
  onLocationSelect?: (lat: number, lng: number, address: string) => void
}

export default function LeafletMap({
  location,
  className = "",
  interactive = false,
  onLocationSelect,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)

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
    if (mapLoaded && mapRef.current && location) {
      const initMap = async () => {
        const L = (await import("leaflet")).default

        // Initialize the map
        const newMap = L.map(mapRef.current!, {
          center: [location.lat, location.lng],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: interactive,
          dragging: interactive,
          touchZoom: interactive,
          doubleClickZoom: interactive,
          boxZoom: interactive,
          keyboard: interactive,
        })

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(newMap)

        setMap(newMap)

        // Add marker for property location
        const newMarker = L.marker([location.lat, location.lng], {
          draggable: interactive,
        }).addTo(newMap)

        // Add popup with address
        newMarker.bindPopup(`<div class="p-2"><strong>${location.address}</strong></div>`).openPopup()

        setMarker(newMarker)

        if (interactive && onLocationSelect) {
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
        }
      }

      initMap()
    }
  }, [mapLoaded, location, interactive, onLocationSelect])

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

  // Update marker position if location changes
  useEffect(() => {
    if (map && marker && location) {
      marker.setLatLng([location.lat, location.lng])
      map.setView([location.lat, location.lng], map.getZoom())
    }
  }, [map, marker, location])

  return (
    <div className={`relative w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <div ref={mapRef} className="absolute inset-0">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <MapPin className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Loading Map...</p>
            </div>
          </div>
        )}
      </div>

      {interactive && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3 h-3 text-red-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {interactive ? "Click or drag to select location" : "Property Location"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
