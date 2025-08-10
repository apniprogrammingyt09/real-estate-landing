"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

interface LikeButtonProps {
  propertyId: number
  propertyTitle: string
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  iconOnly?: boolean
}

export default function LikeButton({
  propertyId,
  propertyTitle,
  variant = "secondary",
  size = "icon",
  className = "",
  iconOnly = true,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)

  // Load liked properties from localStorage on component mount
  useEffect(() => {
    const likedProperties = JSON.parse(localStorage.getItem("likedProperties") || "[]")
    setIsLiked(likedProperties.includes(propertyId))
  }, [propertyId])

  // Handle like/unlike property
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const likedProperties = JSON.parse(localStorage.getItem("likedProperties") || "[]")

    if (isLiked) {
      // Remove from liked properties
      const updatedLikes = likedProperties.filter((id: number) => id !== propertyId)
      localStorage.setItem("likedProperties", JSON.stringify(updatedLikes))
      toast({
        title: "Property removed from favorites",
        description: `${propertyTitle} has been removed from your favorites.`,
      })
    } else {
      // Add to liked properties
      likedProperties.push(propertyId)
      localStorage.setItem("likedProperties", JSON.stringify(likedProperties))
      toast({
        title: "Property added to favorites",
        description: `${propertyTitle} has been added to your favorites.`,
      })
    }

    setIsLiked(!isLiked)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`${className} ${iconOnly ? "p-2 h-9 w-9" : ""} ${isLiked ? "text-red-500 hover:text-red-600" : ""}`}
            onClick={handleLike}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""} ${!iconOnly && "mr-2"}`} />
            {!iconOnly && (isLiked ? "Saved" : "Save")}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLiked ? "Remove from favorites" : "Add to favorites"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
