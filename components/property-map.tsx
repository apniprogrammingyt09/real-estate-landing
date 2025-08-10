"use client"

import LeafletMap from "./leaflet-map"

interface PropertyMapProps {
  location: {
    lat: number
    lng: number
    address: string
  }
  className?: string
}

export default function PropertyMap({ location, className = "" }: PropertyMapProps) {
  return <LeafletMap location={location} className={className} interactive={false} />
}
