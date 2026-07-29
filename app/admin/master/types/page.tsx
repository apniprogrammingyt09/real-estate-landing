"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, Plus, Check, Home, Settings2, Trash2, ChevronDown, ChevronRight, BedDouble, Bath, Square, Car, TreePine, Flame, Zap, Wifi, Wind, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

type AmenityField = {
  key: string
  label: string
  icon: string
  unit?: string
}

type TypeAmenityConfig = {
  typeName: string
  amenities: AmenityField[]
}

const AVAILABLE_ICONS = [
  { id: "bed", label: "Bed", icon: BedDouble },
  { id: "bath", label: "Bath", icon: Bath },
  { id: "square", label: "Area", icon: Square },
  { id: "car", label: "Garage", icon: Car },
  { id: "tree", label: "Garden", icon: TreePine },
  { id: "flame", label: "Heating", icon: Flame },
  { id: "zap", label: "Power", icon: Zap },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "wind", label: "AC", icon: Wind },
  { id: "layers", label: "Floors", icon: Layers },
]

const IconComponent = ({ iconId, className }: { iconId: string; className?: string }) => {
  const found = AVAILABLE_ICONS.find(i => i.id === iconId)
  if (!found) return <Square className={className} />
  const Ico = found.icon
  return <Ico className={className} />
}

export default function AdminPropertyTypesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [newTypeInput, setNewTypeInput] = useState("")

  const [typeAmenityConfigs, setTypeAmenityConfigs] = useState<TypeAmenityConfig[]>([])
  const [expandedType, setExpandedType] = useState<string | null>(null)
  const [newAmenity, setNewAmenity] = useState<Record<string, Partial<AmenityField>>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.propertyTypes) setPropertyTypes(data.propertyTypes)
      if (data.typeAmenityConfigs) setTypeAmenityConfigs(data.typeAmenityConfigs)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const addPropertyType = () => {
    if (!newTypeInput.trim()) { toast.error("Please enter a valid type name"); return }
    if (propertyTypes.includes(newTypeInput.trim())) { toast.error("This property type already exists"); return }
    setPropertyTypes([...propertyTypes, newTypeInput.trim()])
    setNewTypeInput("")
  }

  const removePropertyType = (typeToRemove: string) => {
    setPropertyTypes(propertyTypes.filter(t => t !== typeToRemove))
    setTypeAmenityConfigs(typeAmenityConfigs.filter(c => c.typeName !== typeToRemove))
  }

  const getTypeConfig = (typeName: string): TypeAmenityConfig => {
    return typeAmenityConfigs.find(c => c.typeName === typeName) || { typeName, amenities: [] }
  }

  const setTypeConfig = (config: TypeAmenityConfig) => {
    const existing = typeAmenityConfigs.find(c => c.typeName === config.typeName)
    if (existing) {
      setTypeAmenityConfigs(typeAmenityConfigs.map(c => c.typeName === config.typeName ? config : c))
    } else {
      setTypeAmenityConfigs([...typeAmenityConfigs, config])
    }
  }

  const addAmenityField = (typeName: string) => {
    const draft = newAmenity[typeName] || {}
    if (!draft.key || !draft.label) { toast.error("Key and Label are required"); return }
    const config = getTypeConfig(typeName)
    if (config.amenities.find(a => a.key === draft.key)) { toast.error("Key already exists for this type"); return }
    const field: AmenityField = {
      key: draft.key!.toLowerCase().replace(/\s+/g, "_"),
      label: draft.label!,
      icon: draft.icon || "square",
      unit: draft.unit || ""
    }
    setTypeConfig({ ...config, amenities: [...config.amenities, field] })
    setNewAmenity(prev => ({ ...prev, [typeName]: {} }))
    toast.success(`Added "${field.label}" field to ${typeName}`)
  }

  const removeAmenityField = (typeName: string, key: string) => {
    const config = getTypeConfig(typeName)
    setTypeConfig({ ...config, amenities: config.amenities.filter(a => a.key !== key) })
  }

  const saveTypes = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyTypes, typeAmenityConfigs }),
      })
      if (response.ok) {
        toast.success("Property types & amenity fields saved")
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to update property types")
      }
    } catch (error) {
      console.error("Error saving:", error)
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
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 dark:text-white">Property Types</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
          Manage active property taxonomy types and configure the amenity fields (beds, baths, area, etc.) shown per type on listings and property cards.
        </p>
      </div>

      {/* Types Card */}
      <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
          <CardTitle className="text-xl font-serif flex items-center gap-3">
            <Home className="w-5 h-5 text-emerald-500" /> Active Property Types
          </CardTitle>
          <CardDescription>Create or remove property types used in listings and search filters.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4 bg-gray-50/50 dark:bg-gray-900/30 p-6 rounded-2xl border dark:border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Create Property Type</h3>
              <div className="space-y-3">
                <Label htmlFor="newType">Type Name</Label>
                <Input
                  id="newType"
                  placeholder="e.g. Duplex, Mansion"
                  value={newTypeInput}
                  onChange={(e) => setNewTypeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPropertyType()}
                  className="rounded-xl bg-white dark:bg-gray-950"
                />
                <Button onClick={addPropertyType} className="w-full rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-wider text-xs h-11">
                  <Plus className="w-4 h-4 mr-2" /> Add Type
                </Button>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Active Property Types</h3>
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
                  <p className="text-xs text-gray-400 w-full text-center">No types created yet.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenity Fields Card */}
      {propertyTypes.length > 0 && (
        <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
          <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
            <CardTitle className="text-xl font-serif flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-emerald-500" /> Amenity Fields per Type
            </CardTitle>
            <CardDescription>
              Define which quick-info fields (beds, baths, area, floors, etc.) appear on property cards and listing pages for each type.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {propertyTypes.map(typeName => {
              const config = getTypeConfig(typeName)
              const isExpanded = expandedType === typeName
              const draft = newAmenity[typeName] || {}

              return (
                <div key={typeName} className="rounded-2xl border dark:border-gray-800 overflow-hidden">
                  <button
                    onClick={() => setExpandedType(isExpanded ? null : typeName)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">{typeName}</span>
                      <span className="text-xs text-gray-400 bg-gray-200/60 dark:bg-gray-800 px-2.5 py-1 rounded-full font-medium">
                        {config.amenities.length} field{config.amenities.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-6 space-y-6 bg-white dark:bg-gray-950">
                      {/* Current amenity fields */}
                      {config.amenities.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Fields</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {config.amenities.map(amenity => (
                              <div key={amenity.key} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-800">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                  <IconComponent iconId={amenity.icon} className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{amenity.label}</p>
                                  <p className="text-xs text-gray-400 font-mono">{amenity.key}{amenity.unit ? ` (${amenity.unit})` : ""}</p>
                                </div>
                                <button
                                  onClick={() => removeAmenityField(typeName, amenity.key)}
                                  className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors text-gray-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add new amenity field */}
                      <div className="space-y-4 bg-gray-50/60 dark:bg-gray-900/30 p-5 rounded-2xl border dark:border-gray-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Add Amenity Field</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Key <span className="text-gray-400">(e.g. bedrooms)</span></Label>
                            <Input
                              placeholder="bedrooms"
                              value={draft.key || ""}
                              onChange={e => setNewAmenity(prev => ({ ...prev, [typeName]: { ...prev[typeName], key: e.target.value } }))}
                              className="rounded-xl text-xs h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Label <span className="text-gray-400">(e.g. Beds)</span></Label>
                            <Input
                              placeholder="Beds"
                              value={draft.label || ""}
                              onChange={e => setNewAmenity(prev => ({ ...prev, [typeName]: { ...prev[typeName], label: e.target.value } }))}
                              className="rounded-xl text-xs h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Unit <span className="text-gray-400">(e.g. sqft)</span></Label>
                            <Input
                              placeholder="sqft"
                              value={draft.unit || ""}
                              onChange={e => setNewAmenity(prev => ({ ...prev, [typeName]: { ...prev[typeName], unit: e.target.value } }))}
                              className="rounded-xl text-xs h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Icon</Label>
                            <select
                              value={draft.icon || "square"}
                              onChange={e => setNewAmenity(prev => ({ ...prev, [typeName]: { ...prev[typeName], icon: e.target.value } }))}
                              className="w-full h-9 rounded-xl text-xs border border-input bg-background px-3 py-1"
                            >
                              {AVAILABLE_ICONS.map(ico => (
                                <option key={ico.id} value={ico.id}>{ico.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <Button
                          onClick={() => addAmenityField(typeName)}
                          size="sm"
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Field
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={saveTypes}
          disabled={saving}
          className={cn(
            "rounded-full px-8 font-bold transition-all duration-300 shadow-md",
            saved ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5"
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Property Types"}
        </Button>
      </div>
    </div>
  )
}
