"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropertyImageGalleryProps {
  images: string[]
  title: string
  className?: string
}

export default function PropertyImageGallery({ images, title, className }: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className={cn("relative bg-gray-100 rounded-lg overflow-hidden", className)}>
        <div className="aspect-[16/10] flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
              <ZoomIn className="w-8 h-8" />
            </div>
            <p>No images available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={cn("relative bg-gray-100 rounded-lg overflow-hidden", className)}>
        {/* Main Image */}
        <div className="relative aspect-[16/10]">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-gray-200"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-gray-200"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Fullscreen Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-gray-200"
            onClick={() => setIsFullscreen(true)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-4 bg-white">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={cn(
                    "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    currentImageIndex === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {currentImageIndex === index && <div className="absolute inset-0 bg-primary/20"></div>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/10 border-white/20 text-white hover:bg-white/20 z-10"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation in Fullscreen */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Fullscreen Image */}
            <div className="relative max-w-7xl max-h-full w-full h-full">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Fullscreen Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Fullscreen Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 max-w-md overflow-x-auto scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={cn(
                      "relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                      currentImageIndex === index
                        ? "border-white ring-2 ring-white/50"
                        : "border-white/30 hover:border-white/60",
                    )}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${title} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
