"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Compass } from "lucide-react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Editorial Luxury Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-[140px] animate-pulse"></div>
        
        {/* Fine Architectural Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] bg-[linear-gradient(to_right,#bc9d6a_1px,transparent_1px),linear-gradient(to_bottom,#bc9d6a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Luxury Badge Accent */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/50 dark:border-emerald-900/50 text-[#0E4B3E] dark:text-[#bc9d6a] text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
          <Compass className="w-4 h-4 animate-spin duration-[10s]" />
          Lost in Splendor
        </div>

        {/* Majestic Serif 404 Header */}
        <div className="relative">
          <h1 className="text-[12rem] md:text-[16rem] font-serif font-bold text-gray-900 dark:text-white leading-[0.8] tracking-tighter select-none relative z-10">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[12rem] h-[12rem] md:w-[16rem] md:h-[16rem] bg-emerald-100 dark:bg-emerald-950/20 rounded-full blur-2xl opacity-60"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 max-w-lg mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-white tracking-tight leading-tight">
            An Uncharted Path.
          </h2>
          
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
            The destination you requested has departed to a finer location. Allow us to guide you back to our elite collection of luxury estates and urban retreats.
          </p>
        </div>

        {/* Elegant Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/">
            <Button size="lg" className="h-16 px-10 rounded-full bg-[#0E4B3E] hover:bg-[#0a362c] text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl shadow-emerald-900/10 dark:shadow-none hover:scale-105">
              Back to Sanctuary
            </Button>
          </Link>

          <Link href="/listings">
            <button className="h-16 px-10 rounded-full border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-xs tracking-widest uppercase hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300 bg-transparent flex items-center justify-center font-sans">
              Browse Estates
            </button>
          </Link>
        </div>

        {/* Dynamic Navigation Help */}
        <button
          onClick={() => window.history.back()}
          className="group inline-flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-[#0E4B3E] dark:hover:text-[#bc9d6a] uppercase tracking-widest transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Previous
        </button>

      </div>
    </div>
  )
}
