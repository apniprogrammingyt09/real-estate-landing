"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, MapPin, Home, User, Loader2, CheckCircle, X, ImageIcon, ArrowLeft, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { generateSlug } from "@/lib/properties-data"
import InteractiveMap from "@/components/interactive-map"

export default function AddPropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)

  const totalSteps = 5

  const [formData, setFormData] = useState({
    // Step 1: Property Details
    title: "",
    description: "",
    type: "",
    price: "",
    priceType: "sale",
    bedrooms: "",
    bathrooms: "",
    size: "",
    yearBuilt: "",

    // Step 2: Location
    address: "",
    neighborhood: "",
    locationLat: "",
    locationLng: "",
    locationAddress: "",

    // Step 3: Images
    images: [] as string[],

    // Step 4: Features
    features: [] as string[],

    // Step 5: Contact Information
    submittedByName: "",
    submittedByEmail: "",
    submittedByPhone: "",
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
    "Hardwood Floors",
    "Updated Kitchen",
    "Master Suite",
    "Basement",
    "Deck/Patio",
  ]

  const handleInputChange = (field: string, value: string) => {
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

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({
      ...prev,
      locationLat: lat.toString(),
      locationLng: lng.toString(),
      locationAddress: address,
    }))
  }

  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < Math.min(files.length, 10); i++) {
        const file = files[i]

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`File ${file.name} is not an image`)
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB`)
        }

        const filename = `property-${Date.now()}-${i}-${file.name}`

        const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
          method: "POST",
          body: file,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const { url } = await response.json()
        uploadedUrls.push(url)
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }))
    } catch (error) {
      console.error("Error uploading images:", error)
      setError(error instanceof Error ? error.message : "Failed to upload images")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.title &&
          formData.description &&
          formData.type &&
          formData.price &&
          formData.bedrooms &&
          formData.bathrooms &&
          formData.size
        )
      case 2:
        return !!formData.address
      case 3:
        return true // Images are optional
      case 4:
        return true // Features are optional
      case 5:
        return !!(formData.submittedByName && formData.submittedByEmail && formData.submittedByPhone)
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setError(null)
    } else {
      setError("Please fill in all required fields before proceeding")
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.submittedByEmail)) {
        throw new Error("Please enter a valid email address")
      }

      // Validate numeric fields
      const price = Number.parseFloat(formData.price)
      const bedrooms = Number.parseInt(formData.bedrooms)
      const bathrooms = Number.parseFloat(formData.bathrooms)
      const size = Number.parseInt(formData.size)

      if (isNaN(price) || price <= 0) {
        throw new Error("Please enter a valid price")
      }
      if (isNaN(bedrooms) || bedrooms < 0) {
        throw new Error("Please enter a valid number of bedrooms")
      }
      if (isNaN(bathrooms) || bathrooms < 0) {
        throw new Error("Please enter a valid number of bathrooms")
      }
      if (isNaN(size) || size <= 0) {
        throw new Error("Please enter a valid size")
      }

      // Generate location coordinates if not provided
      let lat = 40.7128 + (Math.random() - 0.5) * 0.1
      let lng = -74.006 + (Math.random() - 0.5) * 0.1

      if (formData.locationLat && formData.locationLng) {
        const parsedLat = Number.parseFloat(formData.locationLat)
        const parsedLng = Number.parseFloat(formData.locationLng)
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
          lat = parsedLat
          lng = parsedLng
        }
      }

      // Prepare property data
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        address: formData.address.trim(),
        neighborhood: formData.neighborhood.trim() || "Not specified",
        price: price,
        priceType: formData.priceType,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        size: size,
        yearBuilt: formData.yearBuilt ? Number.parseInt(formData.yearBuilt) : new Date().getFullYear(),
        features: formData.features,
        images:
          formData.images.length > 0
            ? formData.images
            : [
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-30%20at%2012.20.24%E2%80%AFAM-z9ZmkKKHl1OQ879ALMWr3qcoRXJzsW.png",
              ],
        slug: generateSlug(formData.title),
        location: {
          lat: lat,
          lng: lng,
          address: formData.locationAddress.trim() || formData.address.trim(),
        },
        submittedBy: {
          name: formData.submittedByName.trim(),
          email: formData.submittedByEmail.trim(),
          phone: formData.submittedByPhone.trim(),
        },
        status: "pending",
        featured: false,
        best: false,
        propertyId: null,
        agentId: null,
        agentName: null,
      }

      // Submit to API
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit property")
      }

      setSubmitted(true)

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push("/listings")
      }, 3000)
    } catch (error) {
      console.error("Error submitting property:", error)
      setError(error instanceof Error ? error.message : "Failed to submit property")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex items-center justify-center py-16">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Property Submitted!</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your property has been submitted for review. Our admin team will review and approve it shortly.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Redirecting to listings page...</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Property Details</span>
              </CardTitle>
              <CardDescription>Tell us about your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Beautiful 3BR Family Home"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
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
                  <Label htmlFor="priceType">Listing Type *</Label>
                  <Select value={formData.priceType} onValueChange={(value) => handleInputChange("priceType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 750000"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bedrooms" />
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
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bathrooms" />
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
                  <Label htmlFor="size">Size (sq ft) *</Label>
                  <Input
                    id="size"
                    type="number"
                    placeholder="e.g., 1200"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    placeholder="e.g., 2020"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location & Map</span>
              </CardTitle>
              <CardDescription>Where is your property located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Main St, New York, NY 10001"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    placeholder="e.g., Downtown, Suburbs"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="locationAddress">Location Address (if different)</Label>
                  <Input
                    id="locationAddress"
                    placeholder="e.g., Specific location address"
                    value={formData.locationAddress}
                    onChange={(e) => handleInputChange("locationAddress", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Select Location on Map</Label>
                  <div className="mt-2">
                    <InteractiveMap
                      onLocationSelect={handleLocationSelect}
                      initialLat={formData.locationLat ? Number.parseFloat(formData.locationLat) : undefined}
                      initialLng={formData.locationLng ? Number.parseFloat(formData.locationLng) : undefined}
                    />
                  </div>
                  {formData.locationLat && formData.locationLng && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected coordinates: {Number.parseFloat(formData.locationLat).toFixed(4)},{" "}
                      {Number.parseFloat(formData.locationLng).toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Property Images</span>
              </CardTitle>
              <CardDescription>Upload high-quality images of your property (max 10 images, 5MB each)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="images">Upload Images</Label>
                <div className="mt-2">
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("images")?.click()}
                    disabled={uploadingImages || formData.images.length >= 10}
                    className="w-full"
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Images ({formData.images.length}/10)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
              <CardDescription>Select all features that apply to your property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Contact Information</span>
              </CardTitle>
              <CardDescription>Provide your contact details for potential buyers/renters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="submittedByName">Full Name *</Label>
                  <Input
                    id="submittedByName"
                    placeholder="Your full name"
                    value={formData.submittedByName}
                    onChange={(e) => handleInputChange("submittedByName", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="submittedByEmail">Email Address *</Label>
                  <Input
                    id="submittedByEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.submittedByEmail}
                    onChange={(e) => handleInputChange("submittedByEmail", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="submittedByPhone">Phone Number *</Label>
                  <Input
                    id="submittedByPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.submittedByPhone}
                    onChange={(e) => handleInputChange("submittedByPhone", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">List Your Property</h1>
            <p className="text-lg text-blue-100 mb-8">
              Submit your property for review and reach thousands of potential buyers and renters
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Step Content */}
            <div className="mb-8">{renderStep()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} className="flex items-center bg-primary hover:bg-primary/90">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Property
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              <p>
                By submitting this form, you agree that your property will be reviewed by our admin team before being
                published. You will be contacted once the review is complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
