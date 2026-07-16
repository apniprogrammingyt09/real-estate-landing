"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Grid, List, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpRight, Loader2, Sparkles } from "lucide-react"
import PropertyCard from "@/components/property-card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getProperties, type Property } from "@/lib/properties-data"
import { cn } from "@/lib/utils"
import ListingsLoading from "./loading"

function ListingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    type: "all",
    location: "all",
    bedrooms: "all",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    bathrooms: "any",
    priceType: "all",
    featured: "all",
    best: "all",
    features: [],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [settings, setSettings] = useState<any>(null)

  // Add these state variables after other state declarations
  const [currentPage, setCurrentPage] = useState(1)
  const [propertiesPerPage] = useState(9)

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch only active properties from database
        const data = await getProperties({ status: "active" })
        setProperties(data)
        setFilteredProperties(data)
      } catch (error) {
        console.error("Error fetching properties:", error)
        setError("Failed to load properties. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchProperties()
    fetchSettings()
  }, [])

  // Initialize from URL parameters (handles initial load and back/forward navigation)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || ""
    const urlType = searchParams.get("type") || "all"
    const urlMinPrice = searchParams.get("minPrice") || ""
    const urlMaxPrice = searchParams.get("maxPrice") || ""
    const urlPriceType = searchParams.get("priceType") || "all"
    const urlFeatured = searchParams.get("featured") || "all"
    const urlSort = searchParams.get("sort") || "newest"

    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch)
    }

    if (urlSort !== sortBy) {
      setSortBy(urlSort)
    }

    setFilters((prev) => {
      let finalPriceType = urlPriceType
      if (urlFeatured === "true" && urlPriceType === "all") {
        finalPriceType = "featured"
      }
      const best = finalPriceType === "premium" ? "true" : "all"
      const featured = (urlFeatured === "true" || finalPriceType === "featured") ? "true" : "all"
      
      if (
        prev.type === urlType &&
        prev.minPrice === urlMinPrice &&
        prev.maxPrice === urlMaxPrice &&
        prev.priceType === finalPriceType &&
        prev.featured === featured &&
        prev.best === best
      ) {
        return prev
      }
      
      return {
        ...prev,
        type: urlType,
        minPrice: urlMinPrice,
        maxPrice: urlMaxPrice,
        priceType: finalPriceType,
        featured: featured,
        best: best
      }
    })
  }, [searchParams])

  useEffect(() => {
    // 1. Filter properties
    let filtered = [...properties]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((property) => property.type.toLowerCase() === filters.type.toLowerCase())
    }

    // Filter by priceType (Category select dropdown: sale, rent, premium, featured)
    if (filters.priceType && filters.priceType !== "all") {
      if (filters.priceType === "premium") {
        filtered = filtered.filter((property) => property.best === true)
      } else if (filters.priceType === "featured") {
        filtered = filtered.filter((property) => property.featured === true)
      } else {
        filtered = filtered.filter((property) => property.priceType.toLowerCase() === filters.priceType.toLowerCase())
      }
    }

    // Filter by featured explicitly if set from URL parameter and not already covered by priceType
    if (filters.featured === "true" && filters.priceType !== "featured") {
      filtered = filtered.filter((property) => property.featured === true)
    }

    // Filter by best explicitly if set and not already covered by priceType
    if (filters.best === "true" && filters.priceType !== "premium") {
      filtered = filtered.filter((property) => property.best === true)
    }

    // Filter by bedrooms
    if (filters.bedrooms !== "all") {
      const minBedrooms = Number.parseInt(filters.bedrooms)
      filtered = filtered.filter((property) => property.bedrooms >= minBedrooms)
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter((property) => property.price >= Number.parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((property) => property.price <= Number.parseInt(filters.maxPrice))
    }

    // Filter by size range
    if (filters.minSize) {
      filtered = filtered.filter((property) => property.size >= Number.parseInt(filters.minSize))
    }
    if (filters.maxSize) {
      filtered = filtered.filter((property) => property.size <= Number.parseInt(filters.maxSize))
    }

    // Filter by bathrooms
    if (filters.bathrooms !== "any") {
      const minBathrooms = Number.parseInt(filters.bathrooms)
      filtered = filtered.filter((property) => property.bathrooms >= minBathrooms)
    }

    // Sort results
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "size-asc":
        filtered.sort((a, b) => a.size - b.size)
        break
      case "size-desc":
        filtered.sort((a, b) => b.size - a.size)
        break
      default:
        // newest - sort by creation date
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredProperties(filtered)
  }, [filters, searchTerm, sortBy, properties])

  const updateURL = (newFilters: typeof filters, newSearch: string, newSort: string) => {
    const params = new URLSearchParams()
    if (newSearch) params.set("search", newSearch)
    if (newFilters.type !== "all") params.set("type", newFilters.type)
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice)
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice)
    if (newFilters.priceType !== "all") params.set("priceType", newFilters.priceType)
    if (newFilters.featured === "true" && newFilters.priceType !== "featured") {
      params.set("featured", "true")
    }
    if (newSort !== "newest") params.set("sort", newSort)

    const queryString = params.toString()
    const currentQuery = searchParams.toString()
    
    if (queryString !== currentQuery) {
      router.replace(`/listings${queryString ? `?${queryString}` : ""}`, { scroll: false })
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    let newFilters = { ...filters, [key]: value }
    
    // Special handling for the Category dropdown (priceType)
    if (key === "priceType") {
      if (value === "featured") {
        newFilters = { ...newFilters, priceType: "featured", featured: "true", best: "all" }
      } else if (value === "premium") {
        newFilters = { ...newFilters, priceType: "premium", best: "true", featured: "all" }
      } else {
        newFilters = { ...newFilters, priceType: value, featured: "all", best: "all" }
      }
    }
    
    setFilters(newFilters)
    updateURL(newFilters, searchTerm, sortBy)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateURL(filters, searchTerm, value)
  }

  // Debounced URL update for search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(filters, searchTerm, sortBy)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    // URL update is handled by the debounced effect above
  }

  const handleSearch = () => {
    updateURL(filters, searchTerm, sortBy)
  }

  if (loading) {
    return <ListingsLoading />
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full px-10 py-6 h-auto border-2">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage)

  // Get current properties
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty)

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative py-[60px] md:py-[60px] overflow-hidden">
        <div className="absolute inset-0 bg-[#f4f4f5] dark:bg-emerald-950/20 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-transparent dark:bg-[#f4f4f5]0/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-transparent dark:bg-[#f4f4f5]0/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-[#09090b] dark:text-[#52525b] font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              <Sparkles className="w-4 h-4" />
              Elite Collection
            </div>
            <h1 className="text-6xl md:text-8xl font-sans text-gray-900 dark:text-white leading-[0.9] tracking-tighter mb-8">
              Discover your next <br/> legendary stay.
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
              Explore our hand-picked selection of properties that define the future of living. From urban gems to coastal retreats.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border-y border-[#ececee] dark:border-gray-800 py-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Main Search */}
            <div className="lg:col-span-4 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#09090b] transition-colors" />
              <Input
                placeholder="Search location, neighborhood..."
                className="pl-14 h-14 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-900 border-[#ececee] dark:border-gray-800 focus-visible:ring-[#ececee]"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Selects */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger className="h-14 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-900 border-[#ececee] dark:border-gray-800 text-[11px] font-bold uppercase tracking-widest">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border-[#ececee] dark:border-gray-800">
                  <SelectItem value="all">All Types</SelectItem>
                  {(settings?.propertyTypes || ["House", "Apartment", "Condo", "Villa", "Land"]).map((type: string) => (
                    <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.priceType} onValueChange={(value) => handleFilterChange("priceType", value)}>
                <SelectTrigger className="h-14 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-900 border-[#ececee] dark:border-gray-800 text-[11px] font-bold uppercase tracking-widest">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border-[#ececee] dark:border-gray-800">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
                <SelectTrigger className="h-14 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-900 border-[#ececee] dark:border-gray-800 text-[11px] font-bold uppercase tracking-widest">
                  <SelectValue placeholder="Beds" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border-[#ececee] dark:border-gray-800">
                  <SelectItem value="all">Any Beds</SelectItem>
                  <SelectItem value="1">1+ Bed</SelectItem>
                  <SelectItem value="2">2+ Beds</SelectItem>
                  <SelectItem value="3">3+ Beds</SelectItem>
                  <SelectItem value="4">4+ Beds</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-14 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-900 border-[#ececee] dark:border-gray-800 text-[11px] font-bold uppercase tracking-widest">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border-[#ececee] dark:border-gray-800">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low</SelectItem>
                  <SelectItem value="price-desc">Price: High</SelectItem>
                  <SelectItem value="size-desc">Largest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="lg:col-span-2 flex gap-2">
              <Button 
                variant={viewType === "grid" ? "default" : "outline"} 
                size="icon" 
                onClick={() => setViewType("grid")}
                className={cn("h-14 w-14 rounded-[14px]", viewType === "grid" ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200" : "border-[#ececee] dark:border-gray-800")}
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button 
                variant={viewType === "list" ? "default" : "outline"} 
                size="icon" 
                onClick={() => setViewType("list")}
                className={cn("h-14 w-14 rounded-[14px]", viewType === "list" ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200" : "border-[#ececee] dark:border-gray-800")}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-[60px] flex-1">
        <div className="container-custom">
          {/* Results Summary */}
          <div className="flex justify-between items-end mb-16 border-b border-gray-50 dark:border-gray-900 pb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Inventory</p>
              <h2 className="text-4xl font-sans tracking-tight">
                Showing {filteredProperties.length} matches
              </h2>
            </div>
            <p className="text-sm text-gray-400 font-medium italic">
              Prices are inclusive of all taxes & local fees.
            </p>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="py-[60px] text-center bg-[#f4f4f5] dark:bg-gray-900/50 rounded-[36px] border border-dashed border-[#ececee] dark:border-gray-800">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-[36px] flex items-center justify-center mx-auto mb-8 border border-[#ececee] shadow-none">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No results found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">We couldn&apos;t find any properties matching your current filters. Try broadening your search.</p>
              <Button
                onClick={() => {
                  const resetFilters = {
                    type: "all",
                    location: "all",
                    bedrooms: "all",
                    minPrice: "",
                    maxPrice: "",
                    minSize: "",
                    maxSize: "",
                    bathrooms: "any",
                    priceType: "all",
                    featured: "all",
                    best: "all",
                    features: [],
                  }
                  setFilters(resetFilters)
                  setSearchTerm("")
                  updateURL(resetFilters, "", sortBy)
                }}
                className="rounded-full px-12 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-sm hover:scale-105 transition-transform"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className={viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "space-y-8"}>
              {currentProperties.map((property, idx) => (
                <div key={property.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both" style={{ animationDelay: `${idx * 100}ms` }}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProperties.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-32">
              <div className="flex items-center p-2 rounded-full bg-[#f4f4f5] dark:bg-gray-900 border border-[#ececee] dark:border-gray-800 border border-[#ececee] shadow-none">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full hover:bg-white dark:hover:bg-gray-800"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <div className="px-6 flex gap-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-12 h-12 rounded-full text-xs font-bold transition-all duration-300",
                        currentPage === page 
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 border border-[#ececee] shadow-none scale-110" 
                          : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full hover:bg-white dark:hover:bg-gray-800"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsLoading />}>
      <ListingsContent />
    </Suspense>
  )
}
