"use client"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Sparkles } from "lucide-react"

export default function ListingsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />

      {/* Hero Section Skeleton */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/20 -z-10 animate-pulse"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom relative">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              Elite Collection
            </div>
            <div className="space-y-4">
              <Skeleton className="h-16 md:h-20 w-3/4 rounded-3xl" />
              <Skeleton className="h-16 md:h-20 w-1/2 rounded-3xl" />
            </div>
            <Skeleton className="h-6 w-2/3 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Search & Filters Skeleton */}
      <section className="sticky top-0 z-40 bg-background/85 backdrop-blur-2xl border-y border-gray-100 dark:border-gray-800/80 py-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Input Skeleton */}
            <div className="lg:col-span-4">
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>

            {/* Dropdowns Skeleton */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>

            {/* View Toggle / Active Count Skeleton */}
            <div className="lg:col-span-2 flex items-center justify-end gap-3">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid Skeleton */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-6 w-32 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>

          <div className="flex justify-center mt-20 gap-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function PropertyCardSkeleton() {
  return (
    <div className="group bg-card text-card-foreground rounded-[2.5rem] border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900 animate-pulse">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-6 left-6 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="absolute bottom-6 left-6 flex gap-2">
          <Skeleton className="h-8 w-12 rounded-xl" />
          <Skeleton className="h-8 w-12 rounded-xl" />
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-8 space-y-4">
        {/* Address */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-40 rounded-md" />
        </div>
        
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-4 pt-2">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-2/3 rounded-md" />
          </div>
          <Skeleton className="h-7 w-24 rounded-lg flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
