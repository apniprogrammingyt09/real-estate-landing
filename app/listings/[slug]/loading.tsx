"use client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function PropertyLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />

      {/* Property Images Gallery Skeleton */}
      <section className="relative w-full h-[50vh] lg:h-[65vh] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Skeleton className="w-full h-full animate-pulse" />

        {/* Property Tags Overlay Skeleton */}
        <div className="absolute top-6 left-6 flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        {/* Action Buttons Overlay Skeleton */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </section>

      {/* Property Details Skeleton */}
      <section className="py-[60px] bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Back Button Skeleton */}
              <Skeleton className="h-5 w-32 rounded-md" />

              {/* Title and Address */}
              <div className="space-y-6">
                <Skeleton className="h-16 w-3/4 rounded-3xl" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-64 rounded-md" />
                </div>
                <Skeleton className="h-12 w-48 rounded-2xl" />
              </div>

              {/* Stats Block Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-[3rem]">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="text-center space-y-3">
                    <Skeleton className="h-8 w-8 mx-auto rounded-full" />
                    <Skeleton className="h-6 w-12 mx-auto rounded-md" />
                    <Skeleton className="h-4 w-16 mx-auto rounded-md" />
                  </div>
                ))}
              </div>

              {/* Description Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              </div>

              {/* Features Skeleton */}
              <div className="space-y-6">
                <Skeleton className="h-8 w-56 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Skeleton className="w-2.5 h-2.5 rounded-full" />
                      <Skeleton className="h-4 w-48 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-10">
              {/* Agent Card Skeleton */}
              <div className="bg-card text-card-foreground p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800/80 space-y-6 shadow-sm">
                <Skeleton className="h-6 w-36 rounded-md" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-28 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-gray-850">
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
              </div>

              {/* Schedule Booking Skeleton */}
              <div className="bg-card text-card-foreground p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800/80 space-y-6 shadow-sm">
                <Skeleton className="h-6 w-44 rounded-md" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                  <Skeleton className="h-16 w-full rounded-[2rem] pt-4" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Similar Properties Skeleton */}
      <section className="py-[60px] border-t border-gray-100 dark:border-gray-800/80 bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Skeleton className="h-12 w-64 mx-auto rounded-2xl" />
            <Skeleton className="h-4 w-96 mx-auto rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-card text-card-foreground rounded-[2.5rem] border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-sm space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-8 space-y-4">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
