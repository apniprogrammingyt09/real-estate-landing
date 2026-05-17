"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  Loader2, Save, Image as ImageIcon, Video, Plus, Check, Trash2, 
  HelpCircle, MessageSquare, Megaphone, Home, Sparkles, ChevronRight, Layers
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [savedSections, setSavedSections] = useState<Record<string, boolean>>({})

  // Settings State
  const [bgType, setBgType] = useState<"image" | "video">("image")
  const [url, setUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([])
  const [testimonials, setTestimonials] = useState<{ name: string; role: string; quote: string; image: string }[]>([])
  const [cta, setCta] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    backgroundImage: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    badgeText: "",
    ratingText: ""
  })
  const [propertyTypes, setPropertyTypes] = useState<string[]>(["House", "Apartment", "Condo", "Villa", "Land"])

  // Helper State for adding new property type
  const [newTypeInput, setNewTypeInput] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.heroBackground) {
        setBgType(data.heroBackground.type)
        setUrl(data.heroBackground.url)
      }
      if (data.faqs) setFaqs(data.faqs)
      if (data.testimonials) setTestimonials(data.testimonials)
      if (data.cta) setCta({
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        backgroundImage: "",
        secondaryButtonText: "",
        secondaryButtonLink: "",
        badgeText: "",
        ratingText: "",
        ...data.cta
      })
      if (data.propertyTypes) setPropertyTypes(data.propertyTypes)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const formatSectionName = (key: string) => {
    switch (key) {
      case "heroBackground": return "Hero Background"
      case "propertyTypes": return "Property Taxonomies"
      case "testimonials": return "Customer Testimonials"
      case "cta": return "CTA Section"
      case "faqs": return "Frequently Asked Questions"
      default: return "Settings Section"
    }
  }

  const saveSection = async (sectionKey: string, payload: any) => {
    setSavingSection(sectionKey)
    setSavedSections(prev => ({ ...prev, [sectionKey]: false }))
    
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [sectionKey]: payload
        }),
      })

      if (response.ok) {
        toast.success(`${formatSectionName(sectionKey)} updated successfully`)
        setSavedSections(prev => ({ ...prev, [sectionKey]: true }))
        setTimeout(() => {
          setSavedSections(prev => ({ ...prev, [sectionKey]: false }))
        }, 3000)
      } else {
        toast.error(`Failed to update ${formatSectionName(sectionKey)}`)
      }
    } catch (error) {
      console.error(`Error saving ${sectionKey}:`, error)
      toast.error("An error occurred while saving changes")
    } finally {
      setSavingSection(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (bgType === "image") {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB")
        return
      }

      // Async dimension validation
      try {
        const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const img = new window.Image()
          img.src = URL.createObjectURL(file)
          img.onload = () => {
            resolve({ width: img.width, height: img.height })
            URL.revokeObjectURL(img.src)
          }
          img.onerror = () => {
            reject(new Error("Failed to load image"))
            URL.revokeObjectURL(img.src)
          }
        })

        if (dimensions.width < 1200 || dimensions.height < 600) {
          toast.error(`For best results, hero background image should be at least 1200x600px. (Current: ${dimensions.width}x${dimensions.height}px)`)
          return
        }
      } catch (err) {
        toast.error("Could not validate image dimensions")
        return
      }
    }

    if (bgType === "video") {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a video file")
        return
      }
      if (file.size > 25 * 1024 * 1024) {
        toast.error("Video file size must be less than 25MB")
        return
      }
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload/hero", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUrl(data.url)
        toast.success("Background asset uploaded successfully")
      } else {
        const error = await response.json()
        toast.error(error.error || "Upload failed")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("An error occurred during upload")
    } finally {
      setUploading(false)
    }
  }

  // FAQ Operations
  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }])
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index))
  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs]
    newFaqs[index] = { ...newFaqs[index], [field]: value }
    setFaqs(newFaqs)
  }

  // Testimonial Operations
  const addTestimonial = () => setTestimonials([...testimonials, { name: "", role: "", quote: "", image: "" }])
  const removeTestimonial = (index: number) => setTestimonials(testimonials.filter((_, i) => i !== index))
  const updateTestimonial = (index: number, field: "name" | "role" | "quote" | "image", value: string) => {
    const newTestimonials = [...testimonials]
    newTestimonials[index] = { ...newTestimonials[index], [field]: value }
    setTestimonials(newTestimonials)
  }

  // Property Type Operations
  const addPropertyType = () => {
    if (!newTypeInput.trim()) {
      toast.error("Please enter a valid type name")
      return
    }
    if (propertyTypes.includes(newTypeInput.trim())) {
      toast.error("This property type already exists")
      return
    }
    setPropertyTypes([...propertyTypes, newTypeInput.trim()])
    setNewTypeInput("")
  }

  const removePropertyType = (typeToRemove: string) => {
    setPropertyTypes(propertyTypes.filter((t) => t !== typeToRemove))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      
      {/* Title Header Block */}
      <div className="space-y-2 border-b pb-6 dark:border-gray-800">
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 dark:text-white">Site Administration</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
          Manage and configure individual sections of your landing page instantly with isolated module saves.
        </p>
      </div>

      {/* Modern Tabs Section */}
      <Tabs defaultValue="hero" className="w-full space-y-8">
        
        {/* Navigation list */}
        <TabsList className="grid grid-cols-2 md:flex md:flex-wrap md:w-auto h-auto p-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
          <TabsTrigger value="hero" className="rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Hero Banner
          </TabsTrigger>
          <TabsTrigger value="types" className="rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <Home className="w-4 h-4" /> Taxonomies
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Testimonials
          </TabsTrigger>
          <TabsTrigger value="cta" className="rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <Megaphone className="w-4 h-4" /> CTA Banner
          </TabsTrigger>
          <TabsTrigger value="faqs" className="rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> FAQs
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Hero Banner */}
        <TabsContent value="hero" className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
              <CardTitle className="text-xl font-serif flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-emerald-500" /> Hero Section Background
              </CardTitle>
              <CardDescription>Configure the landing page hero wallpaper. Choose either a premium static image or a sleek cinematic video.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Form Controls */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-wider font-bold text-gray-400">Background Style</Label>
                    <RadioGroup value={bgType} onValueChange={(value) => setBgType(value as any)} className="flex gap-8">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="image" id="image" />
                        <Label htmlFor="image" className="font-semibold cursor-pointer">Static Image</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="video" />
                        <Label htmlFor="video" className="font-semibold cursor-pointer">Cinematic Video</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="url" className="text-xs uppercase tracking-wider font-bold text-gray-400">Background URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="url"
                        placeholder={bgType === "image" ? "https://example.com/image.jpg" : "https://example.com/video.mp4"}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="rounded-xl border-gray-200 dark:border-gray-800"
                      />
                      
                      {/* Custom Upload Button */}
                      <div className="relative">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept={bgType === "image" ? "image/*" : "video/*"}
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                        <Button
                          variant="outline"
                          type="button"
                          className="rounded-xl px-5 h-10 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800"
                          disabled={uploading}
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Frame */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider font-bold text-gray-400">Live Preview Frame</Label>
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-800 flex items-center justify-center">
                    {bgType === "image" ? (
                      url ? <img src={url} alt="Preview" className="w-full h-full object-cover" /> : null
                    ) : (
                      url ? <video src={url} autoPlay muted loop className="w-full h-full object-cover" /> : null
                    )}
                    {!url && (
                      <span className="text-xs text-gray-400">No background asset loaded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Individual Section Save */}
              <div className="flex justify-end pt-6 border-t dark:border-gray-800">
                <Button 
                  onClick={() => saveSection("heroBackground", { type: bgType, url })}
                  disabled={savingSection !== null || uploading}
                  className={cn(
                    "rounded-full px-8 font-bold transition-all duration-300 shadow-md",
                    savedSections["heroBackground"] ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5"
                  )}
                >
                  {savingSection === "heroBackground" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : savedSections["heroBackground"] ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savingSection === "heroBackground" ? "Updating..." : savedSections["heroBackground"] ? "Saved!" : "Save Background"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Property Types */}
        <TabsContent value="types" className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
              <CardTitle className="text-xl font-serif flex items-center gap-3">
                <Home className="w-5 h-5 text-emerald-500" /> Property Taxonomies
              </CardTitle>
              <CardDescription>Manage active taxonomy category types used inside listing submissions and property search filters.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Side: Create Type */}
                <div className="md:col-span-5 space-y-4 bg-gray-50/50 dark:bg-gray-900/30 p-6 rounded-2xl border dark:border-gray-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Create New Taxonomy</h3>
                  <div className="space-y-3">
                    <Label htmlFor="newType">Category Name</Label>
                    <Input
                      id="newType"
                      placeholder="e.g. Duplex, Mansion"
                      value={newTypeInput}
                      onChange={(e) => setNewTypeInput(e.target.value)}
                      className="rounded-xl bg-white dark:bg-gray-950"
                    />
                    <Button onClick={addPropertyType} className="w-full rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-wider text-xs h-11">
                      <Plus className="w-4 h-4 mr-2" /> Add Category
                    </Button>
                  </div>
                </div>

                {/* Right Side: Active Categories list */}
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Active Taxonomies</h3>
                  
                  <div className="flex flex-wrap gap-2.5 min-h-[120px] p-5 rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-950 items-center justify-start">
                    {propertyTypes.map((type, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {type}
                        <button 
                          onClick={() => removePropertyType(type)}
                          className="w-5 h-5 rounded-lg bg-gray-200/50 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 rotate-45" />
                        </button>
                      </span>
                    ))}
                    {propertyTypes.length === 0 && (
                      <p className="text-xs text-gray-400 w-full text-center">No categories created yet.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Individual Section Save */}
              <div className="flex justify-end pt-6 border-t dark:border-gray-800">
                <Button 
                  onClick={() => saveSection("propertyTypes", propertyTypes)}
                  disabled={savingSection !== null}
                  className={cn(
                    "rounded-full px-8 font-bold transition-all duration-300 shadow-md",
                    savedSections["propertyTypes"] ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5"
                  )}
                >
                  {savingSection === "propertyTypes" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : savedSections["propertyTypes"] ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savingSection === "propertyTypes" ? "Updating..." : savedSections["propertyTypes"] ? "Saved!" : "Save Taxonomies"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Testimonials */}
        <TabsContent value="testimonials" className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem] flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-serif flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-500" /> Customer Testimonials
                </CardTitle>
                <CardDescription>Curate real feedback quotes from elite buyers and investors to increase platform conversion rates.</CardDescription>
              </div>
              <Button onClick={addTestimonial} variant="outline" className="rounded-full bg-white dark:bg-gray-950">
                <Plus className="w-4 h-4 mr-2 text-emerald-500" /> Add Testimonial
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-6 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/20 relative group hover:border-emerald-500/10 transition-all space-y-4">
                    
                    <button 
                      className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                      onClick={() => removeTestimonial(index)}
                      title="Remove Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Client Full Name</Label>
                        <Input 
                          value={testimonial.name} 
                          onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                          placeholder="e.g. Sophia Lorenza"
                          className="rounded-xl bg-white dark:bg-gray-950"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Client Role / Company</Label>
                        <Input 
                          value={testimonial.role} 
                          onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                          placeholder="e.g. CEO of LuxSpace"
                          className="rounded-xl bg-white dark:bg-gray-950"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quote Text</Label>
                        <Input 
                          value={testimonial.quote} 
                          onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                          placeholder="Enter testimonial quote..."
                          className="rounded-xl bg-white dark:bg-gray-950"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Profile Picture URL</Label>
                        <Input 
                          value={testimonial.image} 
                          onChange={(e) => updateTestimonial(index, "image", e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className="rounded-xl bg-white dark:bg-gray-950"
                        />
                      </div>
                    </div>

                  </div>
                ))}

                {testimonials.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-800">
                    No testimonials configured yet. Click 'Add Testimonial' to list client feedback.
                  </div>
                )}
              </div>

              {/* Individual Section Save */}
              <div className="flex justify-end pt-6 border-t dark:border-gray-800">
                <Button 
                  onClick={() => saveSection("testimonials", testimonials)}
                  disabled={savingSection !== null}
                  className={cn(
                    "rounded-full px-8 font-bold transition-all duration-300 shadow-md",
                    savedSections["testimonials"] ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5"
                  )}
                >
                  {savingSection === "testimonials" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : savedSections["testimonials"] ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savingSection === "testimonials" ? "Updating..." : savedSections["testimonials"] ? "Saved!" : "Save Testimonials"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: CTA Banner */}
        <TabsContent value="cta" className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
              <CardTitle className="text-xl font-serif flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-emerald-500" /> Marketing CTA Banner
              </CardTitle>
              <CardDescription>Configure settings for the dynamic Call To Action registration billboard located at the bottom of the listings page.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Inputs */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ctaBadge">Top Display Badge</Label>
                      <Input 
                        id="ctaBadge"
                        value={cta.badgeText} 
                        onChange={(e) => setCta({ ...cta, badgeText: e.target.value })}
                        placeholder="e.g. Curated Living"
                        className="rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ctaRating">Rating Badge Text</Label>
                      <Input 
                        id="ctaRating"
                        value={cta.ratingText} 
                        onChange={(e) => setCta({ ...cta, ratingText: e.target.value })}
                        placeholder="Rated 4.9/5 by Clients"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaTitle">CTA Display Title</Label>
                    <Input 
                      id="ctaTitle"
                      value={cta.title} 
                      onChange={(e) => setCta({ ...cta, title: e.target.value })}
                      placeholder="e.g. Ready to Make Your Dream Property a Reality?"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaDescription">CTA Description Text</Label>
                    <textarea 
                      id="ctaDescription"
                      value={cta.description} 
                      onChange={(e) => setCta({ ...cta, description: e.target.value })}
                      placeholder="Connect with our certified experts today..."
                      rows={3}
                      className="w-full flex rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ctaBtn">Button Label</Label>
                      <Input 
                        id="ctaBtn"
                        value={cta.buttonText} 
                        onChange={(e) => setCta({ ...cta, buttonText: e.target.value })}
                        placeholder="Get Started"
                        className="rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ctaLink">Redirect Link</Label>
                      <Input 
                        id="ctaLink"
                        value={cta.buttonLink} 
                        onChange={(e) => setCta({ ...cta, buttonLink: e.target.value })}
                        placeholder="/listings"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ctaSecBtn">Secondary Button Label</Label>
                      <Input 
                        id="ctaSecBtn"
                        value={cta.secondaryButtonText} 
                        onChange={(e) => setCta({ ...cta, secondaryButtonText: e.target.value })}
                        placeholder="Speak to an Agent"
                        className="rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ctaSecLink">Secondary Redirect Link</Label>
                      <Input 
                        id="ctaSecLink"
                        value={cta.secondaryButtonLink} 
                        onChange={(e) => setCta({ ...cta, secondaryButtonLink: e.target.value })}
                        placeholder="/contact"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaBg">Wallpaper Image URL</Label>
                    <Input 
                      id="ctaBg"
                      value={cta.backgroundImage} 
                      onChange={(e) => setCta({ ...cta, backgroundImage: e.target.value })}
                      placeholder="https://example.com/cta-bg.jpg"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* Live Preview Frame */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider font-bold text-gray-400">Live Aspect Billboard Preview</Label>
                  <div className="relative rounded-3xl overflow-hidden border dark:border-gray-800 p-8 flex flex-col justify-between bg-gradient-to-br from-[#0E4B3E] via-[#093229] to-[#041713] min-h-[340px] text-white shadow-xl">
                    
                    <div className="space-y-4">
                      {cta.badgeText && (
                        <div className="inline-block text-[9px] uppercase tracking-widest text-[#bc9d6a] bg-white/5 border border-white/10 px-3 py-1 rounded-full font-bold">
                          {cta.badgeText}
                        </div>
                      )}
                      <h4 className="font-serif text-2xl leading-tight font-semibold">{cta.title || "Headline Here"}</h4>
                      <p className="text-xs text-emerald-100/70 line-clamp-3 leading-relaxed">{cta.description || "Description placeholder..."}</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="rounded-full bg-[#bc9d6a] hover:bg-[#a88856] text-white font-bold text-[10px] px-4 py-2 h-9 shadow-sm transition-colors uppercase tracking-wider">
                        {cta.buttonText || "Get Started"}
                      </Button>
                      {cta.secondaryButtonText && (
                        <Button variant="outline" className="rounded-full border-white/20 hover:bg-white text-white hover:text-[#0E4B3E] font-bold text-[10px] px-4 py-2 h-9 transition-colors uppercase tracking-wider">
                          {cta.secondaryButtonText}
                        </Button>
                      )}
                    </div>

                    {cta.ratingText && (
                      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 border border-[#bc9d6a]/40 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-[9px] font-bold text-gray-900 dark:text-white">
                        <span className="text-amber-500">★</span> {cta.ratingText}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Individual Section Save */}
              <div className="flex justify-end pt-6 border-t dark:border-gray-800">
                <Button 
                  onClick={() => saveSection("cta", cta)}
                  disabled={savingSection !== null}
                  className={cn(
                    "rounded-full px-8 font-bold transition-all duration-300 shadow-md",
                    savedSections["cta"] ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5"
                  )}
                >
                  {savingSection === "cta" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : savedSections["cta"] ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savingSection === "cta" ? "Updating..." : savedSections["cta"] ? "Saved!" : "Save CTA Section"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQs */}
        <TabsContent value="faqs" className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem] flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-serif flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-emerald-500" /> Frequently Asked Questions
                </CardTitle>
                <CardDescription>Setup questions and corresponding descriptive text blocks shown inside the homepage FAQ section.</CardDescription>
              </div>
              <Button onClick={addFaq} variant="outline" className="rounded-full bg-white dark:bg-gray-950">
                <Plus className="w-4 h-4 mr-2 text-emerald-500" /> Add FAQ
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-6 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/20 relative group hover:border-emerald-500/10 transition-all space-y-4">
                    
                    <button 
                      className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                      onClick={() => removeFaq(index)}
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-2 pr-6">
                      <Label>Question Headline {index + 1}</Label>
                      <Input 
                        value={faq.question} 
                        onChange={(e) => updateFaq(index, "question", e.target.value)}
                        placeholder="e.g. What is the average duration of the buying process?"
                        className="rounded-xl bg-white dark:bg-gray-950"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Detailed Answer Block</Label>
                      <Input 
                        value={faq.answer} 
                        onChange={(e) => updateFaq(index, "answer", e.target.value)}
                        placeholder="Enter the comprehensive answer description here..."
                        className="rounded-xl bg-white dark:bg-gray-950"
                      />
                    </div>

                  </div>
                ))}

                {faqs.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-800">
                    No FAQs configured yet. Click 'Add FAQ' to build list of questions.
                  </div>
                )}
              </div>

              {/* Individual Section Save */}
              <div className="flex justify-end pt-6 border-t dark:border-gray-800">
                <Button 
                  onClick={() => saveSection("faqs", faqs)}
                  disabled={savingSection !== null}
                  className={cn(
                    "rounded-full px-8 font-bold transition-all duration-300 shadow-md",
                    savedSections["faqs"] ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5"
                  )}
                >
                  {savingSection === "faqs" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : savedSections["faqs"] ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savingSection === "faqs" ? "Updating..." : savedSections["faqs"] ? "Saved!" : "Save FAQs"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
