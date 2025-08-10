"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, Mail, Phone, Building, Upload, Star } from "lucide-react"
import Link from "next/link"
import { createAgent } from "@/lib/agents-data"
import { uploadAgentAvatar } from "@/lib/blob-storage"
import Image from "next/image"

export default function NewAgentPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    specialization: "",
    experience: "",
    bio: "",
    licenseNumber: "",
    languages: "",
    avatar: "",
    rating: "0",
    username: "",
    password: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const imageUrl = await uploadAgentAvatar(file)
      setFormData((prev) => ({ ...prev, avatar: imageUrl }))
      console.log("Image uploaded successfully:", imageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image. Please try again."
      alert(`Upload failed: ${errorMessage}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createAgent({
        ...formData,
        rating: Number.parseFloat(formData.rating),
        // If no avatar was uploaded, use a default placeholder
        avatar: formData.avatar || "/placeholder-user.jpg",
      })
      router.push("/admin/agents")
    } catch (error) {
      console.error("Error creating agent:", error)
      alert("Failed to create agent. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/admin/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/agents" className="mr-4">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">Add New Agent</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Profile Image */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Image</h3>
                <div className="flex items-center space-x-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border">
                    {formData.avatar ? (
                      <Image
                        src={formData.avatar || "/placeholder.svg"}
                        alt="Agent profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="avatar" className="block mb-2">
                      Upload Profile Image
                    </Label>
                    <div className="flex items-center">
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingImage ? "Uploading..." : "Choose File"}
                        <input
                          id="avatar-upload"
                          name="avatar"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                      {formData.avatar && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => setFormData((prev) => ({ ...prev, avatar: "" }))}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG or GIF. Max 2MB. 
                      {!formData.avatar && " (Optional - will use default placeholder if not uploaded)"}
                    </p>
                    {uploadingImage && (
                      <p className="mt-1 text-xs text-blue-600">Uploading image...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Rating</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <div className="relative mt-1">
                      <Star className="absolute left-3 top-3 h-4 w-4 text-yellow-400" />
                      <Select value={formData.rating} onValueChange={(value) => handleInputChange("rating", value)}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Not Rated</SelectItem>
                          <SelectItem value="1">1 - Poor</SelectItem>
                          <SelectItem value="2">2 - Fair</SelectItem>
                          <SelectItem value="3">3 - Good</SelectItem>
                          <SelectItem value="4">4 - Very Good</SelectItem>
                          <SelectItem value="5">5 - Excellent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Number.parseInt(formData.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="Enter license number"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="role">Role/Title</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Real Estate Agent">Real Estate Agent</SelectItem>
                        <SelectItem value="Senior Real Estate Agent">Senior Real Estate Agent</SelectItem>
                        <SelectItem value="Property Manager">Property Manager</SelectItem>
                        <SelectItem value="Commercial Specialist">Commercial Specialist</SelectItem>
                        <SelectItem value="Investment Advisor">Investment Advisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => handleInputChange("specialization", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential Properties">Residential Properties</SelectItem>
                        <SelectItem value="Commercial Properties">Commercial Properties</SelectItem>
                        <SelectItem value="Luxury Properties">Luxury Properties</SelectItem>
                        <SelectItem value="Investment Properties">Investment Properties</SelectItem>
                        <SelectItem value="New Developments">New Developments</SelectItem>
                        <SelectItem value="Rental Properties">Rental Properties</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleInputChange("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="6-10 years">6-10 years</SelectItem>
                        <SelectItem value="11-15 years">11-15 years</SelectItem>
                        <SelectItem value="15+ years">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="languages">Languages Spoken</Label>
                    <Input
                      id="languages"
                      placeholder="e.g. English, Spanish, French"
                      value={formData.languages}
                      onChange={(e) => handleInputChange("languages", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Login Credentials */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Login Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Username for agent login</p>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea
                  id="bio"
                  placeholder="Enter agent bio and description..."
                  className="mt-1 min-h-[120px]"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link href="/admin/agents">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={loading || uploadingImage}>
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Agent
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
