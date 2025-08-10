"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import AdminNavigation from "@/components/admin/admin-navigation"
import LoadingAnimation from "@/components/admin/loading-animation"
import { getProperty, updateProperty, type Property } from "@/lib/properties-data"

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    address: "",
    neighborhood: "",
    price: "",
    priceType: "sale",
    bedrooms: "",
    bathrooms: "",
    size: "",
    yearBuilt: "",
    features: [] as string[],
    featured: false,
    best: false,
  })

  const propertyTypes = ["House", "Apartment", "Condo", "Villa", "Townhouse", "Studio", "Duplex", "Commercial"]

  const availableFeatures = [
    "Swimming Pool",
    "Garden",
    "Garage",
    "Parking",
    "Balcony",
    "Terrace",
    "Fireplace",
    "Air Conditioning",
    "Heating",
    "Gym",
    "Security System",
    "Elevator",
    "Storage Room",
    "Laundry Room",
    "Walk-in Closet",
  ]

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    loadProperty()
  }, [isAuthenticated, user, router])

  const loadProperty = async () => {
    try {
      const { id } = await params
      const propertyData = await getProperty(Number.parseInt(id))

      if (!propertyData) {
        setError("Property not found")
        return
      }

      setProperty(propertyData)
      setFormData({
        title: propertyData.title,
        description: propertyData.description,
        type: propertyData.type,
        address: propertyData.address,
        neighborhood: propertyData.neighborhood,
        price: propertyData.price.toString(),
        priceType: propertyData.priceType,
        bedrooms: propertyData.bedrooms.toString(),
        bathrooms: propertyData.bathrooms.toString(),
        size: propertyData.size.toString(),
        yearBuilt: propertyData.yearBuilt.toString(),
        features: propertyData.features,
        featured: propertyData.featured,
        best: propertyData.best,
      })
    } catch (error) {
      console.error("Error loading property:", error)
      setError("Failed to load property")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleSave = async () => {
    if (!property) return

    setSaving(true)
    setSaveStatus("loading")
    setError(null)

    try {
      const updates = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        address: formData.address.trim(),
        neighborhood: formData.neighborhood.trim(),
        price: Number.parseFloat(formData.price),
        priceType: formData.priceType,
        bedrooms: Number.parseInt(formData.bedrooms),
        bathrooms: Number.parseFloat(formData.bathrooms),
        size: Number.parseInt(formData.size),
        yearBuilt: Number.parseInt(formData.yearBuilt),
        features: formData.features,
        featured: formData.featured,
        best: formData.best,
      }

      await updateProperty(property.id, updates)
      setSaveStatus("success")

      setTimeout(() => {
        router.push("/admin/properties")
      }, 1500)
    } catch (error) {
      console.error("Error updating property:", error)
      setError("Failed to update property")
      setSaveStatus("error")
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminNavigation />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <LoadingAnimation status="loading" message="Loading property..." />
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminNavigation />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Property not found"}</p>
            <Link href="/admin/properties">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminNavigation />

      <div className="flex-1 lg:ml-64 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/admin/properties" className="mr-4">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Edit Property</h1>
                  <p className="text-sm text-gray-500">{property.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <LoadingAnimation
                  status={saveStatus}
                  message={
                    saveStatus === "loading"
                      ? "Saving..."
                      : saveStatus === "success"
                        ? "Saved successfully!"
                        : saveStatus === "error"
                          ? "Save failed"
                          : ""
                  }
                />
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update the basic property details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Property Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Property Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priceType">Listing Type</Label>
                      <Select
                        value={formData.priceType}
                        onValueChange={(value) => handleInputChange("priceType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num === 0 ? "Studio" : `${num} Bedroom${num > 1 ? "s" : ""}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Select
                        value={formData.bathrooms}
                        onValueChange={(value) => handleInputChange("bathrooms", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num} Bathroom{num > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="size">Size (sq ft)</Label>
                      <Input
                        id="size"
                        type="number"
                        value={formData.size}
                        onChange={(e) => handleInputChange("size", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="yearBuilt">Year Built</Label>
                      <Input
                        id="yearBuilt"
                        type="number"
                        value={formData.yearBuilt}
                        onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>Property location details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="neighborhood">Neighborhood</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features & Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Features & Tags</CardTitle>
                  <CardDescription>Property features and promotional tags</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Promotional Tags */}
                  <div>
                    <Label className="text-base font-medium">Promotional Tags</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
                        />
                        <Label htmlFor="featured">Featured Property</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="best"
                          checked={formData.best}
                          onCheckedChange={(checked) => handleInputChange("best", checked as boolean)}
                        />
                        <Label htmlFor="best">Premium Property</Label>
                      </div>
                    </div>
                  </div>

                  {/* Property Features */}
                  <div>
                    <Label className="text-base font-medium">Property Features</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {availableFeatures.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature}
                            checked={formData.features.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                          />
                          <Label htmlFor={feature} className="text-sm">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
