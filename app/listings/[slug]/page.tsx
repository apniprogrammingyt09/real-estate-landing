import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Bath, Square, Calendar, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PropertyMap from "@/components/property-map"
import SimilarProperties from "@/components/similar-properties"
import BookingForm from "@/components/booking-form"
import PropertyImageGallery from "@/components/property-image-gallery"
import ShareButton from "@/components/share-button"
import LikeButton from "@/components/like-button"
import AgentContactSection from "@/components/agent-contact-section"
import { getPropertyBySlug } from "@/lib/properties-data"

interface PropertyPageProps {
  params: Promise<{ slug: string }>
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Property Images Gallery */}
      <section className="relative">
        <PropertyImageGallery images={property.images} title={property.title} className="h-[50vh] lg:h-[60vh]" />

        {/* Property Tags Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span
            className={`${property.type === "FOR SALE" ? "bg-secondary" : "bg-primary"} text-white px-3 py-1 rounded-full text-sm font-medium`}
          >
            {property.type}
          </span>
          {property.featured && (
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">FEATURED</span>
          )}
          {property.best && (
            <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">PREMIUM</span>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <LikeButton
            propertyId={property.id}
            propertyTitle={property.title}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          />
          <ShareButton
            url={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/listings/${property.slug}`}
            title={property.title}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          />
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8 lg:py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              {/* Back Button */}
              <Link
                href="/listings"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Listings
              </Link>

              {/* Property Header */}
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center mb-6">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">{property.address}</span>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-6">
                  ${property.price.toLocaleString()}
                  {property.priceType === "rent" && (
                    <span className="text-lg text-gray-500 dark:text-gray-400">/month</span>
                  )}
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <Users className="h-6 lg:h-8 w-6 lg:w-8 text-primary mx-auto mb-2" />
                  <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="h-6 lg:h-8 w-6 lg:w-8 text-primary mx-auto mb-2" />
                  <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    {property.bathrooms}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="h-6 lg:h-8 w-6 lg:w-8 text-primary mx-auto mb-2" />
                  <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{property.size}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sq Ft</div>
                </div>
                <div className="text-center">
                  <Calendar className="h-6 lg:h-8 w-6 lg:w-8 text-primary mx-auto mb-2" />
                  <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    {property.yearBuilt}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Year Built</div>
                </div>
              </div>

              {/* Property Description */}
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About This Property
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{property.description}</p>
              </div>

              {/* Property Features */}
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      {property.propertyId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Property ID:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{property.propertyId}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Neighborhood:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{property.neighborhood}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Year Built:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{property.yearBuilt}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Property Size:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{property.size} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bedrooms:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{property.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bathrooms:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{property.bathrooms}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Location */}
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">Location</h2>
                <PropertyMap location={property.location} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:space-y-8">
              {/* Agent Contact */}
              {property.agentId && property.agentName && (
                <AgentContactSection
                  agentId={property.agentId}
                  agentName={property.agentName}
                  propertyTitle={property.title}
                  propertyId={property.id}
                />
              )}

              {/* Booking Form */}
              <div className="card-base p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4">Schedule a Viewing</h3>
                <BookingForm propertyId={property.id} propertyTitle={property.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Gallery Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Property Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.images?.map((image, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm text-gray-900">
                      View Full Size
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Similar Properties
          </h2>
          <SimilarProperties currentPropertySlug={property.slug} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
