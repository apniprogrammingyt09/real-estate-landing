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
    flags: [] as string[],
  })

  const [propertyTypes, setPropertyTypes] = useState<string[]>(["House", "Apartment", "Condo", "Villa", "Townhouse", "Studio", "Duplex", "Commercial"])
  const [featureConfigs, setFeatureConfigs] = useState<{ name: string; iconUrl: string; associatedTypes: string[] }[]>([])
  const [settings, setSettings] = useState<any>(null)

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

  const currentFeaturesToShow = featureConfigs.length > 0
    ? featureConfigs.filter(f => !f.associatedTypes || f.associatedTypes.length === 0 || f.associatedTypes.includes(formData.type))
    : availableFeatures.map(f => ({ name: f, iconUrl: "" }))

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

      try {
        const settingsRes = await fetch("/api/settings")
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
        if (settingsData.propertyTypes) {
          setPropertyTypes(settingsData.propertyTypes)
        }
        if (settingsData.featureConfigs) {
          setFeatureConfigs(settingsData.featureConfigs)
        }
      } catch (e) {
        console.error("Error fetching settings:", e)
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
        flags: propertyData.flags || [
          ...(propertyData.featured ? ["Featured"] : []),
          ...(propertyData.best ? ["Premium"] : [])
        ],
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
        bedrooms: formData.type.toLowerCase() === "land" ? 0 : Number.parseInt(formData.bedrooms) || 0,
        bathrooms: formData.type.toLowerCase() === "land" ? 0 : Number.parseFloat(formData.bathrooms) || 0,
        size: Number.parseInt(formData.size) || 0,
        yearBuilt: formData.type.toLowerCase() === "land" ? 0 : Number.parseInt(formData.yearBuilt) || 0,
        features: formData.features,
        featured: formData.flags.includes("Featured"),
        best: formData.flags.includes("Premium"),
        flags: formData.flags,
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation status="loading" message="Loading property..." />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/admin/properties" className="mr-4">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Edit Property</h1>
                  <p className="text-xs text-gray-500 font-sans">{property.title}</p>
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
                <Button onClick={handleSave} disabled={saving} className="rounded-xl shadow-md">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Basic Information */}
              <Card className="rounded-[2rem] border border-gray-150 shadow-sm shadow-emerald-500/5">
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
                          {(settings?.propertyCategories || ["For Sale", "For Rent"]).map((category: string) => {
                            let val = category.toLowerCase().replace("for ", "");
                            return (
                              <SelectItem key={category} value={val}>
                                {category}
                              </SelectItem>
                            )
                          })}
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

                    {formData.type.toLowerCase() !== "land" && (
                      <>
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
                      </>
                    )}

                    <div>
                      <Label htmlFor="size">Size (sq ft)</Label>
                      <Input
                        id="size"
                        type="number"
                        value={formData.size}
                        onChange={(e) => handleInputChange("size", e.target.value)}
                      />
                    </div>

                    {formData.type.toLowerCase() !== "land" && (
                      <div>
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <Input
                          id="yearBuilt"
                          type="number"
                          value={formData.yearBuilt}
                          onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                        />
                      </div>
                    )}

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
              <Card className="rounded-[2rem] border border-gray-150 shadow-sm shadow-emerald-500/5">
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
              <Card className="rounded-[2rem] border border-gray-150 shadow-sm shadow-emerald-500/5">
                <CardHeader>
                  <CardTitle>Features & Tags</CardTitle>
                  <CardDescription>Property features and promotional tags</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Promotional Tags */}
                  <div>
                    <Label className="text-base font-medium">Promotional Tags</Label>
                    <div className="mt-3 flex flex-wrap gap-4">
                      {(settings?.propertyFlags || ["Featured", "Premium"]).map((flag: string) => {
                        const isChecked = formData.flags.includes(flag)
                        return (
                          <div key={flag} className="flex items-center space-x-2 p-2 rounded-lg border dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer">
                            <Checkbox
                              id={`flag-${flag}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newFlags = checked
                                  ? [...formData.flags, flag]
                                  : formData.flags.filter(f => f !== flag)
                                handleInputChange("flags", newFlags)
                              }}
                            />
                            <Label htmlFor={`flag-${flag}`} className="text-sm font-semibold cursor-pointer">{flag}</Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Property Features</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {currentFeaturesToShow.map((feat) => {
                        const feature = feat.name
                        return (
                          <div key={feature} className="flex items-center space-x-2 p-2 rounded-lg border dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
                            <Checkbox
                              id={feature}
                              checked={formData.features.includes(feature)}
                              onCheckedChange={() => handleFeatureToggle(feature)}
                            />
                            <Label htmlFor={feature} className="text-sm flex items-center gap-2 cursor-pointer">
                              {feat.iconUrl && (
                                <img src={feat.iconUrl} alt="" className="w-5 h-5 object-contain" />
                              )}
                              <span>{feature}</span>
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
