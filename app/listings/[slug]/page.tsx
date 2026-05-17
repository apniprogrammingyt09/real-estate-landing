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
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      {/* Main Container */}
      <main className="flex-1 container-custom pt-32 pb-16">
        {/* Back Link */}
        <Link
          href="/listings"
          className="group inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-emerald-600 transition-colors mb-8"
        >
          <ArrowLeft className="mr-3 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Return to Collection
        </Link>

        {/* Premium Split-Pane Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
          
          {/* Left Side: Modern Aspect Ratio Image Frame & Details */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Main Picture Frame */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[16/10] bg-gray-100 dark:bg-gray-900 border dark:border-gray-800">
              <PropertyImageGallery images={property.images} title={property.title} className="h-full w-full" />
              
              {/* Overlay Tags */}
              <div className="absolute top-6 left-6 flex gap-2 z-10">
                <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-100/50 dark:border-emerald-500/20 shadow-sm">
                  {property.priceType === "sale" ? "For Sale" : "For Rent"}
                </span>
                {property.featured && (
                  <span className="px-4 py-1.5 rounded-full bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Featured
                  </span>
                )}
                {property.best && (
                  <span className="px-4 py-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    Premium Elite
                  </span>
                )}
              </div>
            </div>

            {/* Description Narrative */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-serif tracking-tight">The Vision of Living</h2>
              </div>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                {property.description}
              </p>
            </div>

            {/* Curated Amenities List */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif tracking-tight flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-500" /> Curated Amenities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.features.map((feature, index) => {
                  const IconComponent = getFeatureIcon(feature)
                  return (
                    <div key={index} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800/80 group hover:border-emerald-500/20 transition-all">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">{feature}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Location Map */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif tracking-tight flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" /> Neighborhood Context
              </h3>
              <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl">
                <PropertyMap location={property.location} />
              </div>
            </div>

          </div>

          {/* Right Side: Split-Design Details Side Panel */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            {/* Clean Premium Floating Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-[2.5rem] p-8 shadow-xl space-y-8">
              
              {/* Header: Title, Address & Bookmark */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                    {property.title}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 flex-shrink-0" />
                    {property.address}
                  </p>
                </div>
                <LikeButton
                  propertyId={property.id}
                  propertyTitle={property.title}
                  variant="outline"
                  className="rounded-full w-10 h-10 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0 shadow-sm"
                />
              </div>

              {/* Stats Horizontal Panel */}
              <div className="grid grid-cols-3 gap-2 border-y border-gray-100 dark:border-gray-800 py-6">
                {property.type.toLowerCase() !== "land" ? (
                  <>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-gray-900 dark:text-white leading-none">{property.bedrooms}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">beds</span>
                    </div>
                    <div className="text-center border-x border-gray-100 dark:border-gray-800">
                      <span className="block text-2xl font-bold text-gray-900 dark:text-white leading-none">{property.bathrooms}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">baths</span>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 text-center border-r border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                    <span className="block text-sm font-bold text-emerald-600 leading-none">Premium Land</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">type</span>
                  </div>
                )}
                <div className="text-center">
                  <span className="block text-2xl font-bold text-gray-900 dark:text-white leading-none">{property.size}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">sqft</span>
                </div>
              </div>

              {/* Price & Action Badge */}
              <div className="flex justify-between items-center gap-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  ${property.price.toLocaleString()}
                  {property.priceType === "rent" && <span className="text-sm font-normal text-gray-400">/mo</span>}
                </div>
              </div>

              {/* Modern Agent Block */}
              {property.agentId && property.agentName && (
                <div className="bg-gray-50 dark:bg-gray-950/60 rounded-3xl p-5 border border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-700 text-sm overflow-hidden border border-emerald-200">
                      {property.agentName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agent</span>
                      <span className="block text-sm font-bold text-gray-900 dark:text-white leading-none mt-0.5">{property.agentName}</span>
                    </div>
                  </div>
                  <Link href={`/agents`}>
                    <span className="text-xs font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50">
                      Contact
                    </span>
                  </Link>
                </div>
              )}

              {/* Main Booking/Request Tour */}
              <div className="space-y-4 pt-2">
                <BookingForm propertyId={property.id} propertyTitle={property.title} />
                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider">
                  ⚡ Earliest tour slot at 11:00 tomorrow
                </p>
              </div>

            </div>

            {/* Support Tip pill */}
            <div className="p-6 bg-emerald-600 rounded-[2rem] text-white flex gap-4 items-start shadow-lg">
              <Info className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-semibold">
                This property has extremely high demand. Reserve a viewing slot early to secure a place next week.
              </p>
            </div>

          </div>

        </div>

        {/* Narrative & Secondary Gallery (Visual Narrative) */}
        <section className="py-24 border-t border-gray-100 dark:border-gray-800/80">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight">Visual Narrative</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Every room tells a story of craftsmanship and thoughtful design. Explore the details.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {property.images?.map((image, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden group cursor-zoom-in shadow-md border dark:border-gray-800">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Perspective ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Similar Collection */}
        <section className="py-24 border-t border-gray-100 dark:border-gray-800/80">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight">You might also like</h2>
              <p className="text-gray-500 max-w-sm text-sm">Hand-picked alternatives from our elite property portfolio.</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="rounded-full px-8 h-14 border-2 font-bold uppercase tracking-widest text-[9px]">
                Browse All <ArrowUpRight className="ml-2 w-3.5 h-3.5" />
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
