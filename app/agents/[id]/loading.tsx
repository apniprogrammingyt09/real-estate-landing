"use client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function AgentLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />

      {/* Agent Hero Section Skeleton */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800/80">
        <div className="container-custom relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Agent Bio Grid */}
              <div className="lg:col-span-8 space-y-8">
                {/* Back Button Skeleton */}
                <Skeleton className="h-5 w-32 rounded-md" />

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  {/* Photo Skeleton */}
                  <Skeleton className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl flex-shrink-0 animate-pulse" />

                  <div className="space-y-4 flex-1">
                    <div>
                      <Skeleton className="h-10 w-64 rounded-xl mx-auto md:mx-0" />
                      <Skeleton className="h-5 w-36 rounded-md mt-2 mx-auto md:mx-0" />
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-3 gap-6 max-w-sm pt-4 mx-auto md:mx-0">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-6 w-10 mx-auto md:mx-0 rounded-md" />
                          <Skeleton className="h-4 w-16 mx-auto md:mx-0 rounded-md" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Skeleton */}
              <div className="lg:col-span-4 bg-card text-card-foreground p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/80 shadow-sm space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <div className="space-y-3 pt-2">
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-48 rounded-md" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-36 rounded-md" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Bio Details Skeleton */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Properties Listing Skeleton */}
      <section className="py-20 bg-background border-t border-gray-100 dark:border-gray-800/80">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <Skeleton className="h-8 w-56 rounded-xl" />
            <Skeleton className="h-5 w-24 rounded-md" />
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
