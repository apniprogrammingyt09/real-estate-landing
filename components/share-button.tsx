"use client"

import { useState } from "react"
import { Share2, Check, Copy, Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"

interface ShareButtonProps {
  url: string
  title: string
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  iconOnly?: boolean
}

export default function ShareButton({
  url,
  title,
  variant = "secondary",
  size = "icon",
  className = "",
  iconOnly = true,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  // Use the current URL if none provided
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")

  const handleShare = (platform: string) => {
    // Ensure we're on the client side
    if (typeof window === "undefined") return

    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)

    let shareLink = ""

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
        break
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`
        break
      case "instagram":
        toast({
          title: "Instagram sharing",
          description: "Copy the link and share it on Instagram manually.",
        })
        if (navigator?.clipboard) {
          navigator.clipboard.writeText(shareUrl)
        }
        return
      case "email":
        shareLink = `mailto:?subject=${encodedTitle}&body=Check out this property: ${shareUrl}`
        break
      case "copy":
        if (navigator?.clipboard) {
          navigator.clipboard.writeText(shareUrl)
          setCopied(true)
          toast({
            title: "Link copied!",
            description: "Property link has been copied to clipboard.",
          })
          setTimeout(() => setCopied(false), 2000)
        }
        return
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${className} ${iconOnly ? "p-2 h-9 w-9" : ""}`}
          aria-label="Share property"
        >
          <Share2 className={`h-4 w-4 ${!iconOnly && "mr-2"}`} />
          {!iconOnly && "Share"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="grid gap-1">
          <Button
            variant="ghost"
            className="flex items-center justify-start h-9"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-start h-9"
            onClick={() => handleShare("twitter")}
          >
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-start h-9"
            onClick={() => handleShare("whatsapp")}
          >
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.6 6.31999C16.8669 5.58141 15.9943 4.99596 15.033 4.59767C14.0716 4.19938 13.0406 3.99622 12 3.99999C10.6089 4.00135 9.24248 4.36819 8.03771 5.06377C6.83294 5.75935 5.83208 6.75926 5.13534 7.96335C4.4386 9.16745 4.07046 10.5335 4.06776 11.9246C4.06507 13.3158 4.42793 14.6832 5.12 15.89L4 20L8.2 18.9C9.35975 19.5452 10.6629 19.8891 11.99 19.9C14.0997 19.9 16.124 19.0668 17.6222 17.5815C19.1205 16.0962 19.9704 14.0797 19.98 11.97C19.983 10.9173 19.7682 9.87634 19.3581 8.9068C18.948 7.93725 18.3505 7.05819 17.6 6.31999ZM12 18.53C10.8177 18.5308 9.65701 18.213 8.64 17.61L8.4 17.46L5.91 18.12L6.57 15.69L6.41 15.44C5.55925 14.0667 5.24174 12.429 5.51762 10.8372C5.7935 9.24545 6.64361 7.81015 7.9069 6.80322C9.1702 5.79628 10.7589 5.28765 12.3721 5.37368C13.9853 5.4597 15.511 6.13441 16.66 7.26999C17.916 8.49818 18.635 10.1735 18.66 11.93C18.6523 13.6859 17.9339 15.3645 16.6582 16.6048C15.3825 17.8451 13.6856 18.5175 11.93 18.48L12 18.53ZM15.61 13.59C15.41 13.49 14.44 13.01 14.26 12.95C14.08 12.89 13.94 12.85 13.81 13.05C13.6144 13.3181 13.404 13.5751 13.18 13.82C13.07 13.96 12.95 13.97 12.75 13.82C11.6097 13.3694 10.6597 12.5394 10.06 11.47C9.85 11.12 10.26 11.14 10.64 10.39C10.6681 10.3359 10.6827 10.2759 10.6827 10.215C10.6827 10.1541 10.6681 10.0941 10.64 10.04C10.64 9.93999 10.19 8.95999 10.03 8.56999C9.87 8.17999 9.71 8.23999 9.58 8.22999H9.19C9.08895 8.23154 8.9894 8.25465 8.898 8.29776C8.8066 8.34087 8.72546 8.403 8.66 8.47999C8.43562 8.62783 8.24251 8.81461 8.08901 9.02999C7.93551 9.24536 7.82419 9.48541 7.76 9.73999C7.76 10.24 8.1 10.74 8.23 10.87C8.23 10.87 9.11 12.75 11.14 13.61C11.5675 13.7995 12.0226 13.9250 12.49 13.98C12.9671 14.0476 13.4498 13.9676 13.88 13.75C14.1296 13.6164 14.3521 13.4368 14.54 13.22C14.7279 13.0032 14.8493 12.7328 14.89 12.44C14.89 12.31 14.85 12.17 14.7 12.07L15.61 13.59Z"></path>
            </svg>
            WhatsApp
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-start h-9"
            onClick={() => handleShare("instagram")}
          >
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </Button>
          <Button variant="ghost" className="flex items-center justify-start h-9" onClick={() => handleShare("email")}>
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </Button>
          <Button variant="ghost" className="flex items-center justify-start h-9" onClick={() => handleShare("copy")}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
