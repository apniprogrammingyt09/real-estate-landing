import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  MapPin, Users, Bath, Square, Calendar, ArrowLeft, Share2, Heart, Sparkles, Building2, Key, Info, Plus, ArrowUpRight,
  Sun, DoorOpen, Box, Layers, Car, Crown, WashingMachine, Waves, Trees, Utensils, Dumbbell, Shield, Wifi, Wind, Flame, Dog, Check
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PropertyMap from "@/components/property-map"
import SimilarProperties from "@/components/similar-properties"
import BookingForm from "@/components/booking-form"
import PropertyImageGallery from "@/components/property-image-gallery"
import ShareButton from "@/components/share-button"
import LikeButton from "@/components/like-button"
import { getPropertyBySlugServer } from "@/lib/properties-server"

function getFeatureIcon(feature: string) {
  const name = feature.toLowerCase()
  if (name.includes("terrace")) return Sun
  if (name.includes("balcony")) return DoorOpen
  if (name.includes("storage")) return Box
  if (name.includes("basement")) return Layers
  if (name.includes("garage") || name.includes("parking")) return Car
  if (name.includes("suite") || name.includes("master")) return Crown
  if (name.includes("laundry") || name.includes("washer") || name.includes("dryer") || name.includes("washing")) return WashingMachine
  if (name.includes("pool") || name.includes("swimming")) return Waves
  if (name.includes("garden") || name.includes("backyard") || name.includes("yard")) return Trees
  if (name.includes("kitchen")) return Utensils
  if (name.includes("gym") || name.includes("fitness")) return Dumbbell
  if (name.includes("security") || name.includes("alarm") || name.includes("cctv")) return Shield
  if (name.includes("wifi") || name.includes("internet")) return Wifi
  if (name.includes("ac") || name.includes("air condition") || name.includes("cooling")) return Wind
  if (name.includes("heat") || name.includes("fireplace")) return Flame
  if (name.includes("pet") || name.includes("dog") || name.includes("cat")) return Dog
  return Check
}

interface PropertyPageProps {
  params: Promise<{ slug: string }>
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = await getPropertyBySlugServer(slug)

  if (!property) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f5] font-sans selection:bg-[#ececee] selection:text-[#09090b]">
      <Header />

      {/* Main Container */}
      <main className="flex-1 container-custom pt-[60px] pb-[60px]">
        {/* Back Link */}
        <Link
          href="/listings"
          className="group inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.05em] text-[#71717a] hover:text-[#09090b] transition-colors mb-8 rounded-full"
        >
          <ArrowLeft className="mr-3 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Return to Collection
        </Link>

        {/* Premium Split-Pane Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">

          {/* Left Side: Modern Aspect Ratio Image Frame & Details */}
          <div className="lg:col-span-8 space-y-12">

            {/* Main Picture Frame */}
            <div className="relative rounded-[36px] overflow-hidden aspect-[16/10] bg-white border border-[#ececee]">
              <PropertyImageGallery images={property.images} title={property.title} className="h-full w-full" />

              {/* Overlay Tags */}
              <div className="absolute top-6 left-6 flex gap-2 z-10">
                <span className="px-4 py-1.5 rounded-[12px] bg-white/90 backdrop-blur-md text-[#18181b] text-[12px] font-semibold border border-[#ececee]">
                  {property.priceType === "sale" ? "For Sale" : "For Rent"}
                </span>
                {property.featured && (
                  <span className="px-4 py-1.5 rounded-[12px] bg-[#3f3f46] text-[#fafafa] text-[12px] font-semibold flex items-center gap-2 border border-[#3f3f46]">
                    <Sparkles className="w-3 h-3 text-[#fafafa]" /> Featured
                  </span>
                )}
                {property.best && (
                  <span className="px-4 py-1.5 rounded-[12px] bg-[#ff5a00] text-white text-[12px] font-semibold border border-[#ff5a00]">
                    Premium Elite
                  </span>
                )}
              </div>
            </div>

            {/* Description Narrative */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-[#18181b] rounded-full"></div>
                <h2 className="text-[32px] leading-[1.5] font-sans font-bold text-[#09090b]">The Vision of Living</h2>
              </div>
              <p className="text-[15px] text-[#52525b] leading-[1.45] font-sans">
                {property.description}
              </p>
            </div>

            {/* Curated Amenities List */}
            <div className="space-y-6">
              <h3 className="text-[20px] font-sans font-semibold leading-[1.5] flex items-center gap-3 text-[#09090b]">
                <Sparkles className="w-5 h-5 text-[#18181b]" /> Curated Amenities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.features.map((feature, index) => {
                  const IconComponent = getFeatureIcon(feature)
                  return (
                    <div key={index} className="flex items-center gap-4 p-5 bg-[#fafafa] rounded-[14px] border border-[#ececee] group hover:border-[#d4d4d8] transition-all">
                      <div className="w-8 h-8 rounded-[12px] bg-white flex items-center justify-center text-[#18181b] border border-[#ececee]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[#3f3f46] font-semibold text-[14px]">{feature}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Location Map */}
            <div className="space-y-6">
              <h3 className="text-[20px] font-sans font-semibold leading-[1.5] flex items-center gap-3 text-[#09090b]">
                <MapPin className="w-5 h-5 text-[#18181b]" /> Neighborhood Context
              </h3>
              <div className="rounded-[36px] overflow-hidden border border-[#ececee]">
                <PropertyMap location={property.location} />
              </div>
            </div>

          </div>

          {/* Right Side: Split-Design Details Side Panel */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">

            {/* Clean Premium Floating Card */}
            <div className="bg-[#ffffff] border border-[#ececee] rounded-[36px] p-8 space-y-8">

              {/* Header: Title, Address & Bookmark */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <p className="text-[15px] font-semibold text-[#09090b] leading-[1.45]">
                    {property.title}
                  </p>
                  <p className="text-[14px] text-[#71717a] flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-[#52525b] flex-shrink-0" />
                    {property.address}
                  </p>
                </div>
                <LikeButton
                  propertyId={property.id}
                  propertyTitle={property.title}
                  variant="outline"
                  className="rounded-[14px] w-10 h-10 border border-[#ececee] hover:bg-[#fafafa] flex-shrink-0"
                />
              </div>

              {/* Stats Horizontal Panel */}
              <div className="grid grid-cols-3 gap-2 border-y border-[#ececee] py-6">
                {property.type.toLowerCase() !== "land" ? (
                  <>
                    <div className="text-center">
                      <span className="block text-[32px] font-semibold text-[#09090b] leading-none">{property.bedrooms}</span>
                      <span className="text-[12px] text-[#71717a] font-normal uppercase tracking-wider mt-2 block">beds</span>
                    </div>
                    <div className="text-center border-x border-[#ececee]">
                      <span className="block text-[32px] font-semibold text-[#09090b] leading-none">{property.bathrooms}</span>
                      <span className="text-[12px] text-[#71717a] font-normal uppercase tracking-wider mt-2 block">baths</span>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 text-center border-r border-[#ececee] flex flex-col justify-center">
                    <span className="block text-[15px] font-semibold text-[#18181b] leading-none">Premium Land</span>
                    <span className="text-[12px] text-[#71717a] font-normal uppercase tracking-wider mt-2 block">type</span>
                  </div>
                )}
                <div className="text-center">
                  <span className="block text-[32px] font-semibold text-[#09090b] leading-none">{property.size}</span>
                  <span className="text-[12px] text-[#71717a] font-normal uppercase tracking-wider mt-2 block">sqft</span>
                </div>
              </div>

              {/* Price & Action Badge */}
              <div className="flex justify-between items-center gap-2">
                <div className="text-[32px] font-bold text-[#09090b] tracking-tight">
                  ${property.price.toLocaleString()}
                  {property.priceType === "rent" && <span className="text-[15px] font-normal text-[#52525b]">/mo</span>}
                </div>
              </div>

              {/* Modern Agent Block */}
              {property.agentId && property.agentName && (
                <div className="bg-[#fafafa] rounded-[14px] p-5 border border-[#ececee] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#e4e4e7] flex items-center justify-center font-bold text-[#18181b] text-[14px] border border-[#d4d4d8]">
                      {property.agentName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <span className="block text-[12px] font-normal text-[#71717a] uppercase tracking-wider">Agent</span>
                      <span className="block text-[14px] font-semibold text-[#18181b] leading-none mt-1">{property.agentName}</span>
                    </div>
                  </div>
                  <Link href={`/agents`}>
                    <span className="text-[13px] font-medium text-[#18181b] bg-white px-4 py-2 rounded-[14px] border border-[#ececee] cursor-pointer hover:bg-[#fafafa]">
                      Contact
                    </span>
                  </Link>
                </div>
              )}

              {/* Main Booking/Request Tour */}
              <div className="space-y-4 pt-2">
                <BookingForm propertyId={property.id} propertyTitle={property.title} />
                <p className="text-[13px] text-center text-[#71717a] font-normal">
                  Earliest tour slot at 11:00 tomorrow
                </p>
              </div>

            </div>

            {/* Support Tip pill */}
            <div className="p-6 bg-[#27272a] rounded-[14px] text-[#fafafa] flex gap-4 items-start border border-[#3f3f46]">
              <Info className="w-6 h-6 flex-shrink-0 mt-0.5 text-[#a1a1aa]" />
              <p className="text-[14px] leading-[1.45] font-normal">
                This property has extremely high demand. Reserve a viewing slot early to secure a place next week.
              </p>
            </div>

          </div>

        </div>

        {/* Narrative & Secondary Gallery (Visual Narrative) */}
        <section className="py-[60px] border-t border-[#ececee]">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-[40px] leading-[1.28] font-sans font-bold tracking-tight text-[#09090b]">Visual Narrative</h2>
            <p className="text-[15px] text-[#52525b] font-normal leading-[1.45]">
              Every room tells a story of craftsmanship and thoughtful design. Explore the details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {property.images?.map((image, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-[36px] overflow-hidden group cursor-zoom-in border border-[#ececee] bg-white">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Perspective ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Similar Collection */}
        <section className="py-[60px] border-t border-[#ececee]">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-2">
              <h2 className="text-[40px] leading-[1.28] font-sans font-bold tracking-tight text-[#09090b]">You might also like</h2>
              <p className="text-[#52525b] max-w-sm text-[15px] leading-[1.45]">Hand-picked alternatives from our elite property portfolio.</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="rounded-[14px] px-8 h-14 border border-[#ececee] font-medium text-[14px] hover:bg-[#fafafa] bg-white text-[#18181b]">
                Browse All <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <SimilarProperties currentPropertySlug={property.slug} />
        </section>

      </main>

      <Footer />
    </div>
  )
}
