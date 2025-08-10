"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PropertyCard from "@/components/property-card"
import ListingsLoading from "./loading"
import { getProperties, type Property } from "@/lib/properties-data"

function ListingsContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewType, setViewType] = useState("grid")
  const [filters, setFilters] = useState({
    type: "all",
    location: "all",
    bedrooms: "all",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    bathrooms: "any",
    features: [],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

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

    fetchProperties()
  }, [])

  // Initialize from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get("search")
    const urlType = searchParams.get("type")
    const urlMinPrice = searchParams.get("minPrice")
    const urlMaxPrice = searchParams.get("maxPrice")

    if (urlSearch) {
      setSearchTerm(urlSearch)
    }

    if (urlType) {
      setFilters((prev) => ({
        ...prev,
        type: urlType,
      }))
    }

    if (urlMinPrice) {
      setFilters((prev) => ({
        ...prev,
        minPrice: urlMinPrice,
      }))
    }

    if (urlMaxPrice) {
      setFilters((prev) => ({
        ...prev,
        maxPrice: urlMaxPrice,
      }))
    }
  }, [searchParams])

  useEffect(() => {
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    // Search is handled by useEffect
  }

  if (loading) {
    return <ListingsLoading />
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
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

      {/* Search Filters */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
                <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Bedrooms</SelectItem>
                  <SelectItem value="1">1+ Bedroom</SelectItem>
                  <SelectItem value="2">2+ Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                <span>Search</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 card-base p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Price Range</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  />
                  <span className="text-gray-600 dark:text-gray-400">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Property Size (sq ft)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    value={filters.minSize}
                    onChange={(e) => handleFilterChange("minSize", e.target.value)}
                  />
                  <span className="text-gray-600 dark:text-gray-400">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    value={filters.maxSize}
                    onChange={(e) => handleFilterChange("maxSize", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Bathrooms</label>
                <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange("bathrooms", value)}>
                  <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Listings */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredProperties.length} Properties Found
            </h2>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="size-asc">Size: Small to Large</SelectItem>
                  <SelectItem value="size-desc">Size: Large to Small</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={`border-gray-300 dark:border-gray-600 ${
                    viewType === "grid"
                      ? "bg-primary text-white border-primary"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setViewType("grid")}
                >
                  <LayoutGrid className="h-4 w-4 flex-shrink-0" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`border-gray-300 dark:border-gray-600 ${
                    viewType === "list"
                      ? "bg-primary text-white border-primary"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setViewType("list")}
                >
                  <List className="h-4 w-4 flex-shrink-0" />
                </Button>
              </div>
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No properties found matching your criteria.</p>
              <Button
                onClick={() => {
                  setFilters({
                    type: "all",
                    location: "all",
                    bedrooms: "all",
                    minPrice: "",
                    maxPrice: "",
                    minSize: "",
                    maxSize: "",
                    bathrooms: "any",
                    features: [],
                  })
                  setSearchTerm("")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} viewType={viewType} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProperties.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-900 dark:text-white flex-shrink-0" />
                  <span className="sr-only">Previous page</span>
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1
                  return (
                    <Button
                      key={pageNumber}
                      variant="outline"
                      className={
                        pageNumber === currentPage
                          ? "border-primary bg-primary text-white hover:bg-primary/90"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                      }
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}

                {totalPages > 5 && <span className="px-2 text-gray-500">...</span>}

                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  <ChevronRight className="h-4 w-4 text-gray-900 dark:text-white flex-shrink-0" />
                  <span className="sr-only">Next page</span>
                </Button>
              </nav>
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
