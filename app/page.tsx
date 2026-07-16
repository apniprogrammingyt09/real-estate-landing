"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PropertyCard from "@/components/property-card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Search, MapPin, Home, Users, Award, TrendingUp, Star, Loader2, Tag, Key, Building, Plus, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react"
import { getProperties, type Property } from "@/lib/properties-data"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState("")
  const [propertyType, setPropertyType] = useState("all")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [premiumProperties, setPremiumProperties] = useState<Property[]>([])
  const [sellProperties, setSellProperties] = useState<Property[]>([])
  const [rentProperties, setRentProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"featured" | "sale" | "rent" | "premium">("featured")
  const [settings, setSettings] = useState<any>(null)
  const [currentPremiumIndex, setCurrentPremiumIndex] = useState(0)
  const [activeThumbIndex, setActiveThumbIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    fetchProperties()
    fetchSettings()
  }, [])

  useEffect(() => {
    if (premiumProperties.length > 0) {
      const interval = setInterval(() => {
        setCurrentPremiumIndex((prev) => (prev + 1) % premiumProperties.length)
        setActiveThumbIndex(0) // Reset thumbnail when property changes
      }, 8000) // Slower luxury pace (8 seconds)
      return () => clearInterval(interval)
    }
  }, [premiumProperties])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch featured properties from database
      const featuredData = await getProperties({ featured: true, status: "active" })
      setFeaturedProperties(featuredData.slice(0, 6))

      // Fetch premium properties from database
      const premiumData = await getProperties({ best: true, status: "active" })
      setPremiumProperties(premiumData.slice(0, 3))

      // Fetch sell properties
      const sellData = await getProperties({ priceType: "sale", status: "active" })
      setSellProperties(sellData.slice(0, 6))

      // Fetch rent properties
      const rentData = await getProperties({ priceType: "rent", status: "active" })
      setRentProperties(rentData.slice(0, 6))
    } catch (error) {
      console.error("Error fetching properties:", error)
      setError("Failed to load properties. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchLocation.trim()) params.set("search", searchLocation.trim())
    if (propertyType !== "all") params.set("type", propertyType)
    if (category !== "all") {
      if (category === "featured") params.set("featured", "true")
      else if (category === "premium") params.set("priceType", "premium")
      else params.set("priceType", category)
    }
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-")
      if (min) params.set("minPrice", min)
      if (max && max !== "+") params.set("maxPrice", max)
    }

    const queryString = params.toString()
    window.location.href = `/listings${queryString ? `?${queryString}` : ""}`
  }

  const showcaseContent = {
    featured: {
      heading: "Best Sellers",
      subheading: "Top Rated Items",
      description: "India's most-loved properties — chosen by 12,000+ happy homeowners. Handpicked for quality, value, and lifestyle.",
      color: "text-gray-900 dark:text-white"
    },
    sale: {
      heading: "Properties for Sale",
      subheading: "Permanent Homes",
      description: "Discover your dream home from our latest listings. From cozy apartments to luxury villas, find where you belong.",
      color: "text-gray-900 dark:text-white"
    },
    rent: {
      heading: "Properties for Rent",
      subheading: "Flexible Stays",
      description: "Looking for a temporary stay? Browse our curated list of rental properties in prime locations with flexible terms.",
      color: "text-gray-900 dark:text-white"
    },
    premium: {
      heading: "Premium Collection",
      subheading: "Luxury Living",
      description: "Exclusive luxury properties for the most discerning buyers. Experience the finest in real estate with exceptional amenities.",
      color: "text-gray-900 dark:text-white"
    }
  }

  const currentContent = showcaseContent[activeTab]

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-white selection:bg-gray-200 selection:text-gray-900 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-[60px]">
        <div className="absolute inset-0 z-0">
          {settings?.heroBackground?.type === "video" ? (
            <video
              src={settings.heroBackground.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover brightness-[0.7]"
            />
          ) : (
            <Image
              src={settings?.heroBackground?.url || "https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=2070"}
              alt="Futuristic Home"
              fill
              className="object-cover brightness-[0.7]"
              priority
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-[#0a0a0a]"></div>
        </div>

        <div className="container-custom relative z-10 py-[60px]">
          <div className="max-w-4xl space-y-10">
            <div className="flex flex-wrap gap-3">
              {["BUILD", "FUTURE", "PROPERTY"].map((tag) => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-[0.2em] text-white">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter">
              Build Your Future, One Property at a Time.
            </h1>

            <p className="text-xl text-white/80 max-w-xl leading-relaxed">
              Experience the pinnacle of modern living. We provide exclusive access to the world&apos;s most innovative and sustainable properties.
            </p>

            {/* Floating Search Bar */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl border border-white/20 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="space-y-1 px-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Looking for</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 bg-transparent text-gray-900 dark:text-white font-semibold">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {(settings?.propertyTypes || ["House", "Apartment", "Condo", "Villa", "Land"]).map((type: string) => (
                        <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 px-4 border-l border-gray-100 dark:border-gray-800">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 bg-transparent text-gray-900 dark:text-white font-semibold text-left">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 px-4 border-l border-gray-100 dark:border-gray-800">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Place</label>
                  <Input 
                    placeholder="Enter City" 
                    className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent text-gray-900 dark:text-white font-semibold placeholder:text-gray-300"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-1 px-4 border-l border-gray-100 dark:border-gray-800">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 bg-transparent text-gray-900 dark:text-white font-semibold">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="0-200000">Under $200K</SelectItem>
                      <SelectItem value="200000-500000">$200K - $500K</SelectItem>
                      <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                      <SelectItem value="1000000+">$1M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch} className="h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-2xl hover:scale-[1.02] transition-transform font-bold">
                  Search Property
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Section (Dynamic Auto-Slider) */}
      <section className="py-[60px] bg-[#f8f8f8] dark:bg-[#0a0a0a]">
        <div className="container-custom">
          {premiumProperties.length > 0 ? (
            <div className="animate-in fade-in duration-700">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 text-gray-900 dark:text-white">
                <h2 className="text-5xl md:text-7xl font-sans font-medium leading-[1.05] tracking-tight max-w-3xl">
                  Your primary home might <br/> begin to feel left out.
                </h2>
                <div className="flex items-center gap-4 max-w-xs">
                  <div className="relative w-24 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image 
                      src={premiumProperties[currentPremiumIndex].images[1] || premiumProperties[currentPremiumIndex].images[0]} 
                      alt="Video thumbnail" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-gray-900 border-b-[4px] border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-tight font-sans">
                    Each listing offers unique features, exceptional quality, and prime locations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Main Large Image Column */}
                <div className="lg:col-span-6">
                  <div className="relative h-full min-h-[500px] rounded-[3rem] overflow-hidden group">
                    <Image 
                      key={`${premiumProperties[currentPremiumIndex].id}-${activeThumbIndex}`}
                      src={premiumProperties[currentPremiumIndex].images[activeThumbIndex] || premiumProperties[currentPremiumIndex].images[0]} 
                      alt={premiumProperties[currentPremiumIndex].title} 
                      fill 
                      className="object-cover transition-all duration-700 group-hover:scale-105 animate-in fade-in duration-500"
                    />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md border border-white/20 flex gap-4 items-center">
                      {premiumProperties[currentPremiumIndex].images.slice(0, 3).map((img, i) => (
                        <div 
                          key={i} 
                          onClick={() => setActiveThumbIndex(i)}
                          className={`w-10 h-10 rounded-full border-2 ${activeThumbIndex === i ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'} overflow-hidden cursor-pointer transition-all duration-300`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt="Property thumbnail" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Card Column */}
                <div className="lg:col-span-3">
                  <div className="h-full bg-card text-card-foreground rounded-[3rem] p-10 flex flex-col justify-center text-center space-y-6">
                    <h3 className="text-3xl font-medium leading-tight text-gray-900 dark:text-white">
                      {premiumProperties[currentPremiumIndex].title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-sans line-clamp-3">
                      {premiumProperties[currentPremiumIndex].description}
                    </p>
                    <div className="pt-4">
                      <Link href={`/listings/${premiumProperties[currentPremiumIndex].slug}`}>
                        <Button variant="outline" className="rounded-full px-10 py-6 h-auto text-gray-900 border-gray-900 font-sans hover:bg-gray-900 hover:text-white transition-all duration-300 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-gray-900">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Property Price Card Column */}
                <div className="lg:col-span-3">
                  <div className="h-full bg-card text-card-foreground rounded-[3rem] p-6 flex flex-col">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8">
                      <Image 
                        src={premiumProperties[currentPremiumIndex].images[2] || premiumProperties[currentPremiumIndex].images[0]} 
                        alt="Minimalist Home" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="px-4 space-y-6 pb-4 flex-1 flex flex-col justify-between items-center text-center">
                      <div className="space-y-1">
                        <p className="text-gray-500 text-sm font-sans">Pricing Start at</p>
                        <p className="text-2xl font-bold font-sans text-gray-900 dark:text-white">
                          ${premiumProperties[currentPremiumIndex].price.toLocaleString()}
                        </p>
                      </div>
                      <Link href="/listings?priceType=premium" className="w-full">
                        <Button className="w-full rounded-full py-6 h-auto bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] font-bold">
                          Explore Properties <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Footer */}
              <div className="mt-16 flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
                <p className="text-gray-500 max-w-xl text-sm leading-relaxed font-sans">
                  Whether it&apos;s creating a cozy corner for relaxation or transforming a small area into a workspace
                </p>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-14 h-14 rounded-full border-gray-200 dark:border-gray-800 text-gray-300 hover:text-gray-900 hover:border-gray-900 transition-all"
                    onClick={() => {
                      setCurrentPremiumIndex((prev) => (prev - 1 + premiumProperties.length) % premiumProperties.length);
                      setActiveThumbIndex(0);
                    }}
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-14 h-14 rounded-full border-gray-900 text-gray-900 dark:text-white dark:border-gray-700 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all"
                    onClick={() => {
                      setCurrentPremiumIndex((prev) => (prev + 1) % premiumProperties.length);
                      setActiveThumbIndex(0);
                    }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="h-[600px] flex items-center justify-center text-gray-400 font-sans uppercase tracking-widest text-xs">
              Loading Premium Collection...
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-gray-400 font-sans uppercase tracking-widest text-xs">
              No Collection
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-[60px] bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Map Visual (Left) */}
            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1715520000000!5m2!1sen!2sin" 
                className="w-full h-full border-0 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              {/* Custom Pin Overlay (Purely visual branding) */}
              <div className="absolute inset-0 flex items-center justify-center -translate-y-12 pointer-events-none">
                <div className="relative flex flex-col items-center">
                  {/* The Pin Head */}
                  <div className="w-20 h-20 bg-white text-gray-900 rounded-full border-[5px] border-white dark:border-gray-900 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center animate-bounce-slow relative z-10">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
                        <Home className="w-3.5 h-3.5 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Pin Tail */}
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white -mt-1 relative z-0"></div>
                  
                  {/* Label Pill - Compact and Professional */}
                  <div className="mt-2 px-6 py-2 bg-white text-gray-900 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.1)] border-2 border-white dark:border-gray-900 flex items-center gap-2">
                    <span className="text-gray-900 font-bold text-sm tracking-tight whitespace-nowrap">
                      Dream Home 😊
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content (Right) */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-sans font-medium text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                  Discover Properties <br/> with the Best Value
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed max-w-lg font-sans">
                  From minimalist interiors to compact solutions, small spaces inspire big ideas, proving that you don&apos;t need much room.
                </p>
              </div>
              <Button className="rounded-full px-10 h-16 bg-black dark:bg-white text-white dark:text-gray-900 font-bold font-sans text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 transition-transform">
                Find Nearest Properties <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Property Showcase Section */}
      <section id="showcase" className="py-[60px] bg-background">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-20 gap-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight">{currentContent.heading}</h2>
              <p className="text-gray-500 max-w-2xl">{currentContent.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-800">
                {["featured", "sale", "rent", "premium"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300",
                      activeTab === tab
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-xl"
                        : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {tab === "featured" ? "Featured" : tab === "sale" ? "For Sale" : tab === "rent" ? "For Rent" : "Premium"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-[60px] flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-gray-900 dark:text-white" />
              <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Synchronizing Inventory</div>
            </div>
          ) : error ? (
            <div className="text-center py-[60px] bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-red-600 dark:text-red-400 mb-8 font-medium">{error}</p>
              <Button onClick={fetchProperties} variant="outline" className="rounded-full px-10 py-6 border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {(activeTab === "featured" ? featuredProperties : 
                activeTab === "sale" ? sellProperties : 
                activeTab === "rent" ? rentProperties : 
                premiumProperties).slice(0, 6).map((property, idx) => (
                <div key={property.id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" style={{ animationDelay: `${idx * 150}ms` }}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* List Your Property CTA Section */}
      <section className="py-[60px] bg-background border-t border-gray-50 dark:border-gray-900/60 overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 dark:border-gray-800 text-[10px] tracking-[0.2em] font-bold uppercase rounded-md text-gray-400">
                <Sparkles className="w-3.5 h-3.5 text-gray-900 dark:text-white animate-pulse" /> Owners Partnership
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-7xl font-serif tracking-tight leading-[1.05] text-gray-900 dark:text-white font-normal">
                  List your estate. <br />
                  <span className="italic text-gray-900 dark:text-white dark:text-gray-500 font-light">Reach collectors.</span>
                </h2>
                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-sans max-w-lg">
                  Expose your digital showcase directly to thousands of high-net-worth investors, premium buyers, and verified renters daily. Our architectural platform provides the absolute perfect home for your property.
                </p>
              </div>
              
              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="flex gap-4 items-start">
                  <span className="font-serif text-3xl font-light text-gray-900 dark:text-white/70 dark:text-gray-500/70 leading-none">01</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Maximum Exposure</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">Featured homepage showcase shared across global channels.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <span className="font-serif text-3xl font-light text-gray-900 dark:text-white/70 dark:text-gray-500/70 leading-none">02</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">5-Minute Onboarding</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">Submit details, specs, and map coordinates in just a few taps.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="font-serif text-3xl font-light text-gray-900 dark:text-white/70 dark:text-gray-500/70 leading-none">03</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Verified Request Leads</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">Clean, filtered viewing booking requests sent direct to your email.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="font-serif text-3xl font-light text-gray-900 dark:text-white/70 dark:text-gray-500/70 leading-none">04</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Zero Hidden Fees</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">Complete pricing transparency, list entirely free of charge.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Composition Column */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[3.5rem] overflow-hidden aspect-[4/3] md:aspect-[16/12] shadow-2xl group border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40">
                {/* Visual masterpiece photo */}
                <Image 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"
                  alt="Modern Masterpiece Villa"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                />
                
                {/* Vignette styling overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Floating tags */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" /> Live Showcase Pass
                </div>

                <div className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest shadow-sm">
                  Elite Circle
                </div>

                {/* Overlapping statistics overlays */}
                <div className="absolute top-28 left-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 dark:bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold font-sans">Avg. Sell Time</div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white font-sans">14 Days Only</div>
                  </div>
                </div>

                <div className="absolute top-44 right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 dark:bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white">
                    <Star className="w-4.5 h-4.5 fill-current" />
                  </div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold font-sans">Satisfaction</div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white font-sans">98.4% Rate</div>
                  </div>
                </div>

                {/* Glassmorphic call-to-action bar */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/15 dark:border-white/5 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-2xl">
                  <div className="space-y-1 text-left">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold font-sans">Join 1,200+ Active Owners</div>
                    <h3 className="text-lg md:text-xl font-serif text-white font-light">
                      Ready to list your estate?
                    </h3>
                  </div>
                  <Link href="/add-property" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-14 rounded-full bg-white hover:bg-gray-100 dark:bg-gray-800 text-gray-900 hover:text-white font-bold text-xs uppercase tracking-widest px-8 transition-all duration-300 shadow-lg hover:shadow-gray-900/10 hover:-translate-y-0.5">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-[60px] bg-gray-50 dark:bg-gray-900/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Frequently asked questions</h2>
              <p className="text-gray-500 leading-relaxed">
                Everything you need to know about our process, financing, and property management services.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-4">
              {(settings?.faqs || [
                { question: "What types of properties do you sell?", answer: "We specialize in modern residential properties, including smart homes, eco-friendly villas, and luxury urban apartments." },
                { question: "How do I know if a property is a good investment?", answer: "We provide comprehensive market analysis and data-driven insights for every property listed on our platform." },
                { question: "Do I need to hire a real estate agent?", answer: "While we facilitate the process, we recommend working with our certified partners to ensure a smooth transaction." },
                { question: "What's the process for buying a property?", answer: "From viewing to closing, we guide you through every legal and financial step with total transparency." }
              ]).map((faq: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={cn(
                    "group bg-card text-card-foreground rounded-3xl p-8 border transition-all cursor-pointer",
                    openFaq === i ? "border-gray-900 dark:border-white shadow-lg shadow-gray-900/10" : "border-gray-100 dark:border-gray-800 hover:border-gray-900 dark:border-white"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <h4 className={cn("text-lg font-bold transition-colors", openFaq === i ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white")}>
                      {faq.question || faq.q}
                    </h4>
                    <div className={cn("transition-transform duration-300", openFaq === i ? "rotate-45" : "rotate-0")}>
                      <Plus className={cn("w-5 h-5", openFaq === i ? "text-gray-900 dark:text-white" : "text-gray-400")} />
                    </div>
                  </div>
                  {openFaq === i && (
                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-gray-500 leading-relaxed font-sans">
                        {faq.answer || faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[60px] bg-background">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight max-w-xl">What our clients say about us</h2>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-gray-100">
                    <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" width={48} height={48} />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold">More than 500+ <br/> <span className="text-gray-400 font-medium tracking-normal">Direct Feedback</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-gray-50 dark:bg-gray-900 rounded-[4rem] overflow-hidden p-10 lg:p-20 border border-gray-100 dark:border-gray-800">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden">
              <Image 
                src={settings?.testimonials?.[0]?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1974"} 
                alt="Client" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="space-y-10 lg:pl-10">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-xl">
                <Tag className="w-8 h-8 text-gray-900 dark:text-white" />
              </div>
              <blockquote className="text-2xl md:text-3xl font-serif leading-snug">
                &quot;{settings?.testimonials?.[0]?.quote || "Working with this team was a pleasure. They understood our vision and helped us find a property that exceeded our expectations. We couldn't have done it without them!"}&quot;
              </blockquote>
              <div>
                <div className="text-xl font-bold">{settings?.testimonials?.[0]?.name || "Sophia Lorenza"}</div>
                <div className="text-gray-500 font-medium">{settings?.testimonials?.[0]?.role || "CEO of LuxSpace"}</div>
              </div>
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-900 dark:hover:bg-white hover:border-gray-900 dark:hover:border-white hover:text-white dark:hover:text-gray-900 transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-900 dark:hover:bg-white hover:border-gray-900 dark:hover:border-white hover:text-white dark:hover:text-gray-900 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Luxury CTA Section */}
      <section className="py-[60px] bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/10 to-transparent -z-10"></div>
        <div className="container-custom">
          <div className="relative bg-[#18181b] rounded-[4rem] overflow-hidden p-12 md:p-24 border border-white/10 shadow-2xl">
            {/* Background elements */}
            <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-gray-100 dark:bg-gray-800 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-gray-100 dark:bg-gray-800 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
              {/* Left Column: Premium Text */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em]">
                  <Sparkles className="w-4 h-4 text-white" />
                  {settings?.cta?.badgeText || "Curated Living"}
                </div>
                <h2 className="text-4xl md:text-7xl font-serif text-white tracking-tight leading-[0.95] max-w-2xl">
                  {settings?.cta?.title || "Ready to Make Your Dream Property a Reality?"}
                </h2>
                <p className="text-lg text-gray-400 max-w-xl leading-relaxed font-sans">
                  {settings?.cta?.description || "Connect with our certified experts today to receive customized layout options, off-market pricing lists, and an unparalleled service experience."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href={settings?.cta?.buttonLink || "/listings"}>
                    <Button size="lg" className="h-16 px-10 rounded-full bg-white text-white font-bold text-sm tracking-widest uppercase hover:bg-gray-200 text-[#09090b] hover:scale-105 transition-all duration-300 shadow-lg shadow-gray-900/10">
                      {settings?.cta?.buttonText || "Get Started"}
                    </Button>
                  </Link>
                  {settings?.cta?.secondaryButtonText && (
                    <Link href={settings?.cta?.secondaryButtonLink || "/contact"}>
                      <button className="h-16 px-10 rounded-full border border-white/20 text-white font-bold text-sm tracking-widest uppercase hover:bg-white hover:text-[#09090b] hover:border-white transition-all duration-300 bg-transparent flex items-center justify-center font-sans">
                        {settings?.cta?.secondaryButtonText}
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column: Layered Images with Gold Borders */}
              <div className="lg:col-span-5 relative hidden lg:block">
                <div className="relative w-full aspect-[4/5] max-w-[360px] mx-auto">
                  {/* Decorative Frame */}
                  <div className="absolute -inset-4 rounded-[3rem] border border-white/10 translate-x-4 translate-y-4 -z-10"></div>
                  
                  {/* Primary Image */}
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl">
                    <Image 
                      src={settings?.cta?.backgroundImage || "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&q=80&w=2070"} 
                      alt="Luxury Interior" 
                      fill 
                      className="object-cover hover:scale-110 transition-transform duration-1000"
                    />
                  </div>

                  {/* Overlapping Gold Badge */}
                  {settings?.cta?.ratingText && (
                    <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 border border-white/10 p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-bounce duration-[3s]">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 dark:bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-white">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-sans">Premium Service</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white font-sans">{settings?.cta?.ratingText}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
