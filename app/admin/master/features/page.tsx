"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, Plus, Check, Trash2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminFeaturesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Data States
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [featureConfigs, setFeatureConfigs] = useState<{ name: string; iconUrl: string; associatedTypes: string[] }[]>([])

  // Helper States
  const [newFeatureName, setNewFeatureName] = useState("")
  const [newFeatureIconUrl, setNewFeatureIconUrl] = useState("")
  const [newFeatureTypes, setNewFeatureTypes] = useState<string[]>([])
  const [featureUploading, setFeatureUploading] = useState(false)
  const featureFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.propertyTypes) setPropertyTypes(data.propertyTypes)
      if (data.featureConfigs) setFeatureConfigs(data.featureConfigs)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Valid formats: SVG, PNG, GIF
    const allowedTypes = ["image/png", "image/svg+xml", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid format. Only SVG, PNG, and GIF icon files are accepted.")
      return
    }

    // Max size 1MB
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Icon size should be under 1MB")
      return
    }

    // Exact 80x80px dimensions validation
    try {
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new window.Image()
        img.src = URL.createObjectURL(file)
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
          URL.revokeObjectURL(img.src)
        }
        img.onerror = () => {
          reject(new Error("Failed to read image dimensions"))
          URL.revokeObjectURL(img.src)
        }
      })

      if (dimensions.width !== 80 || dimensions.height !== 80) {
        toast.error(`Icon must be exactly 80X80px. Selected icon: ${dimensions.width}X${dimensions.height}px`)
        return
      }
    } catch (err) {
      toast.error("Error validating icon size/dimensions")
      return
    }

    setFeatureUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload/icon", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setNewFeatureIconUrl(data.url)
        toast.success("Icon uploaded successfully (80X80px)")
      } else {
        const error = await response.json()
        toast.error(error.error || "Icon upload failed")
      }
    } catch (error) {
      console.error("Error uploading feature icon:", error)
      toast.error("Failed to upload icon")
    } finally {
      setFeatureUploading(false)
    }
  }

  const addFeature = () => {
    if (!newFeatureName.trim()) {
      toast.error("Please enter a feature name")
      return
    }
    if (!newFeatureIconUrl) {
      toast.error("Please upload an 80X80px icon for the feature")
      return
    }
    if (featureConfigs.some(f => f.name.toLowerCase() === newFeatureName.trim().toLowerCase())) {
      toast.error("This feature already exists")
      return
    }

    setFeatureConfigs([...featureConfigs, {
      name: newFeatureName.trim(),
      iconUrl: newFeatureIconUrl,
      associatedTypes: newFeatureTypes
    }])
    setNewFeatureName("")
    setNewFeatureIconUrl("")
    setNewFeatureTypes([])
  }

  const removeFeature = (index: number) => {
    setFeatureConfigs(featureConfigs.filter((_, i) => i !== index))
  }

  const toggleNewFeatureTypeAssociation = (typeName: string) => {
    if (newFeatureTypes.includes(typeName)) {
      setNewFeatureTypes(newFeatureTypes.filter(t => t !== typeName))
    } else {
      setNewFeatureTypes([...newFeatureTypes, typeName])
    }
  }

  const saveFeatures = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureConfigs }),
      })

      if (response.ok) {
        toast.success("Property features updated successfully")
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to update property features")
      }
    } catch (error) {
      console.error("Error saving features:", error)
      toast.error("An error occurred while saving")
    } finally {
      setSaving(false)
    }
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
      <div className="space-y-2 border-b pb-6 dark:border-gray-800">
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 dark:text-white">Property Features</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
          Manage amenities and features shown in properties and filter sections. All icons must be strictly 80X80px.
        </p>
      </div>

      <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
          <CardTitle className="text-xl font-serif flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-500" /> Amenities Config & Icons
          </CardTitle>
          <CardDescription>Setup features linked with specific property types.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">

          {/* Add Feature Form */}
          <div className="p-6 rounded-2xl border bg-gray-50/50 dark:bg-gray-900/30 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Add New Property Feature</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featureName">Feature Name</Label>
                  <Input
                    id="featureName"
                    value={newFeatureName}
                    onChange={(e) => setNewFeatureName(e.target.value)}
                    placeholder="e.g. Swimming Pool, Smart Lock"
                    className="rounded-xl bg-white dark:bg-gray-950"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="block">Associated Property Types</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {propertyTypes.map((t) => {
                      const isAssoc = newFeatureTypes.includes(t)
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleNewFeatureTypeAssociation(t)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                            isAssoc
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800"
                              : "bg-white border-gray-200 text-gray-600 dark:bg-gray-950 dark:border-gray-800"
                          )}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Icon Upload with dimension validation */}
              <div className="space-y-4">
                <Label className="block">Upload Icon (SVG, PNG, GIF - Exactly 80X80px)</Label>

                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl border bg-white dark:bg-gray-950 flex items-center justify-center overflow-hidden relative">
                    {newFeatureIconUrl ? (
                      <img src={newFeatureIconUrl} alt="Feature Icon Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-gray-400 text-center px-1">80x80 Icon</span>
                    )}
                    {featureUploading && (
                      <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={featureFileInputRef}
                      className="hidden"
                      accept=".svg,image/svg+xml,image/png,image/gif"
                      onChange={handleFeatureIconUpload}
                      disabled={featureUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl text-xs"
                      disabled={featureUploading}
                      onClick={() => featureFileInputRef.current?.click()}
                    >
                      Choose Icon File
                    </Button>
                    <p className="text-[10px] text-gray-400">Allowed formats: SVG, PNG, GIF. Image dimensions must be exactly 80X80px.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={addFeature}
                className="rounded-xl px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Feature Config
              </Button>
            </div>
          </div>

          {/* Active Features List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Configured Property Features</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureConfigs.map((feature, idx) => (
                <div key={idx} className="p-4 rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-950 flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden border dark:border-gray-800">
                      <img src={feature.iconUrl} alt={feature.name} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-gray-800 dark:text-white">{feature.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {feature.associatedTypes?.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-900 text-[9px] font-semibold text-gray-500">
                            {t}
                          </span>
                        ))}
                        {(!feature.associatedTypes || feature.associatedTypes.length === 0) && (
                          <span className="text-[9px] text-gray-400 italic">No types linked</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFeature(idx)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                    title="Remove Feature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {featureConfigs.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-800">
                  No features configured yet. Fill out the form above to add features.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t dark:border-gray-800">
            <Button
              onClick={saveFeatures}
              disabled={saving}
              className={cn(
                "rounded-full px-8 font-bold transition-all duration-300 shadow-md",
                saved ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5"
              )}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : saved ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Property Features"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
