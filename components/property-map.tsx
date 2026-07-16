"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

interface PropertyMapProps {
  location: {
    lat: number
    lng: number
    address: string
  }
  className?: string
}

// A free minimalist raster tile style using CartoDB Voyager (Premium look, similar to Google Maps)
const mapStyle = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: ["https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
} as const

export default function PropertyMap({ location, className = "" }: PropertyMapProps) {
  const [viewState, setViewState] = useState({
    longitude: location.lng || -74.006,
    latitude: location.lat || 40.7128,
    zoom: 15,
  })

  return (
    <div className={`relative w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border ${className}`}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapLib={maplibregl as any}
        mapStyle={mapStyle as any}
        scrollZoom={false} // Disable scroll zoom for embedded static-feel map
      >
        <NavigationControl position="bottom-right" />
        
        <Marker longitude={location.lng} latitude={location.lat} anchor="bottom">
          <MapPin className="h-8 w-8 text-red-500 fill-white dark:fill-gray-900 drop-shadow-md" />
        </Marker>
      </Map>

      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[10] border dark:border-gray-700 max-w-[250px]">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-900 dark:text-white leading-relaxed">
            {location.address}
          </span>
        </div>
      </div>
    </div>
  )
}
