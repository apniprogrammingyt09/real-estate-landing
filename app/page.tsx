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
import { Search, MapPin, Home, Users, Award, TrendingUp, Star, Loader2 } from "lucide-react"
import { getProperties, type Property } from "@/lib/properties-data"

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState("")
  const [propertyType, setPropertyType] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [premiumProperties, setPremiumProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

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
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-")
      if (min) params.set("minPrice", min)
      if (max && max !== "+") params.set("maxPrice", max)
    }

    const queryString = params.toString()
    window.location.href = `/listings${queryString ? `?${queryString}` : ""}`
  }

  const stats = [
    { icon: Home, label: "Properties Listed", value: "2,500+", color: "text-blue-600" },
    { icon: Users, label: "Happy Clients", value: "1,200+", color: "text-emerald-600" },
    { icon: Award, label: "Awards Won", value: "25+", color: "text-amber-600" },
    { icon: TrendingUp, label: "Years Experience", value: "15+", color: "text-blue-600" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white section-padding overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  Find Your Dream <span className="text-amber-400">Home</span> Today
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Discover the perfect property with our comprehensive real estate platform. From luxury homes to
                  affordable apartments, we have something for everyone.
                </p>
              </div>

              {/* Search Form */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Enter location..."
                      className="pl-10 bg-white border-0 text-gray-900"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch()
                        }
                      }}
                    />
                  </div>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="bg-white border-0 text-gray-900">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="bg-white border-0 text-gray-900">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-200000">Under $200K</SelectItem>
                      <SelectItem value="200000-500000">$200K - $500K</SelectItem>
                      <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                      <SelectItem value="1000000+">$1M+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/listings">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Browse Properties
                  </Button>
                </Link>
                <Link href="/add-property">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-blue border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="https://clippinghomes.com/wp-content/uploads/Real-Estate-Photo-Editing-1.png?height=600&width=800"
                  alt="Beautiful modern home"
                  width={800}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-amber-500/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div
                  className={`mx-auto w-16 h-16 ${stat.color} bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-gray-700 dark:text-gray-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-12">
            <h2 className="heading-2">Featured Properties</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties that offer exceptional value and quality.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={fetchProperties} variant="outline">
                Try Again
              </Button>
            </div>
          ) : featuredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link href="/listings">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    View All Properties
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No featured properties available at the moment.</p>
              <Link href="/listings">
                <Button variant="outline">Browse All Properties</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Premium Properties */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-8 w-8 text-amber-500" />
              <h2 className="heading-2">Premium Properties</h2>
              <Star className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Exclusive luxury properties for the most discerning buyers. Experience the finest in real estate.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={fetchProperties} variant="outline">
                Try Again
              </Button>
            </div>
          ) : premiumProperties.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {premiumProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No premium properties available at the moment.</p>
              <Link href="/listings">
                <Button variant="outline">Browse All Properties</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-secondary text-white">
        <div className="container-custom text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream properties with us. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Start Searching
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="bg-emerald-600 border-white text-white hover:bg-white hover:text-emerald-600"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
