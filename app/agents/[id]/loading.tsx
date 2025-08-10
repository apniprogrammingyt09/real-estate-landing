import Header from "@/components/header"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function AgentLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Agent Hero Section Skeleton */}
      <section className="py-12 lg:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              {/* Back Button Skeleton */}
              <Skeleton className="h-6 w-32 mb-6" />

              <div className="flex flex-col md:flex-row gap-6">
                {/* Agent Photo Skeleton */}
                <Skeleton className="w-32 h-32 rounded-full mx-auto md:mx-0" />

                <div className="flex-1 text-center md:text-left">
                  {/* Agent Name Skeleton */}
                  <Skeleton className="h-8 lg:h-10 w-48 mb-2 mx-auto md:mx-0" />
                  <Skeleton className="h-5 w-32 mb-4 mx-auto md:mx-0" />

                  {/* Agent Stats Skeleton */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="text-center">
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </div>
                    ))}
                  </div>

                  {/* Contact Buttons Skeleton */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card Skeleton */}
            <div className="card-base p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-3" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-3" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-3" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Bio Section Skeleton */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </section>

      {/* Agent Properties Section Skeleton */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card-base overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
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
