"use client"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Search, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

export default function ListingsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section Skeleton */}
      <section className="relative gradient-primary text-white section-padding">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Property</h1>
            <p className="text-lg text-blue-100 mb-8">
              Browse our extensive collection of properties and find your dream home
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>

          <div className="mt-4 card-base p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-32 mb-2" />
                <div className="flex space-x-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>

          <div className="flex justify-center mt-12 space-x-2">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function PropertyCardSkeleton() {
  return (
    <div className="card-base overflow-hidden">
      <Skeleton className="w-full h-64 mb-4" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}
