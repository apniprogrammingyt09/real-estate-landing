import Header from "@/components/header"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function PropertyLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Property Images Gallery Skeleton */}
      <section className="relative">
        <Skeleton className="h-[50vh] lg:h-[60vh] w-full" />

        {/* Property Tags Overlay Skeleton */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        {/* Action Buttons Overlay Skeleton */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </section>

      {/* Property Details Skeleton */}
      <section className="py-8 lg:py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              {/* Back Button Skeleton */}
              <Skeleton className="h-6 w-32" />

              {/* Property Header Skeleton */}
              <div>
                <Skeleton className="h-8 lg:h-12 w-3/4 mb-4" />
                <div className="flex items-center mb-6">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 lg:h-12 w-48 mb-6" />
              </div>

              {/* Property Stats Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="text-center">
                    <Skeleton className="h-6 lg:h-8 w-6 lg:w-8 mx-auto mb-2" />
                    <Skeleton className="h-6 lg:h-8 w-8 mx-auto mb-1" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                ))}
              </div>

              {/* Property Description Skeleton */}
              <div>
                <Skeleton className="h-6 lg:h-8 w-48 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Property Features Skeleton */}
              <div>
                <Skeleton className="h-6 lg:h-8 w-56 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <Skeleton className="w-2 h-2 rounded-full mr-3" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Details Skeleton */}
              <div>
                <Skeleton className="h-6 lg:h-8 w-40 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Property Location Skeleton */}
              <div>
                <Skeleton className="h-6 lg:h-8 w-24 mb-4" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6 lg:space-y-8">
              {/* Agent Contact Skeleton */}
              <div className="card-base p-4 lg:p-6">
                <Skeleton className="h-6 lg:h-7 w-32 mb-4" />
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>

              {/* Booking Form Skeleton */}
              <div className="card-base p-4 lg:p-6">
                <Skeleton className="h-6 lg:h-7 w-40 mb-4" />
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-12 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Gallery Section Skeleton */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 lg:h-10 w-48 mb-8 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="aspect-[4/3] rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Similar Properties Skeleton */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 lg:h-10 w-56 mb-8 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="card-base overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 lg:p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-4 mr-1" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-4 mr-1" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-4 mr-1" />
                        <Skeleton className="h-4 w-6" />
                      </div>
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
