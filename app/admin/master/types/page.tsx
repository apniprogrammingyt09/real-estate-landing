"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  Loader2, Save, Plus, Check, Home, Trash2, Edit, X,
  BedDouble, Bath, Square, Car, TreePine, Flame, Zap, Wifi, Wind, Layers 
} from "lucide-react"
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

  // Property Types state
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [isAddingType, setIsAddingType] = useState(false)
  const [newTypeInput, setNewTypeInput] = useState("")

  // Amenity Configs state
  const [typeAmenityConfigs, setTypeAmenityConfigs] = useState<TypeAmenityConfig[]>([])
  const [editingType, setEditingType] = useState<string | null>(null)
  
  // Input state for adding individual amenity fields
  const [newAmenityKey, setNewAmenityKey] = useState("")
  const [newAmenityLabel, setNewAmenityLabel] = useState("")
  const [newAmenityUnit, setNewAmenityUnit] = useState("")
  const [newAmenityIcon, setNewAmenityIcon] = useState("square")

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

  const handleAddPropertyType = () => {
    const trimmed = newTypeInput.trim()
    if (!trimmed) {
      toast.error("Please enter a property type name")
      return
    }
    if (propertyTypes.includes(trimmed)) {
      toast.error("This property type already exists")
      return
    }
    setPropertyTypes([...propertyTypes, trimmed])
    setNewTypeInput("")
    setIsAddingType(false)
    toast.success(`Added type "${trimmed}" locally. Click Save to publish.`)
  }

  const handleRemovePropertyType = (typeToRemove: string) => {
    setPropertyTypes(propertyTypes.filter(t => t !== typeToRemove))
    setTypeAmenityConfigs(typeAmenityConfigs.filter(c => c.typeName !== typeToRemove))
    if (editingType === typeToRemove) {
      setEditingType(null)
    }
    toast.success(`Removed type "${typeToRemove}" locally. Click Save to publish.`)
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

  const handleAddAmenityField = (typeName: string) => {
    if (!newAmenityKey.trim() || !newAmenityLabel.trim()) {
      toast.error("Key and Label are required for the amenity field")
      return
    }
    const config = getTypeConfig(typeName)
    const normalizedKey = newAmenityKey.trim().toLowerCase().replace(/\s+/g, "_")
    
    if (config.amenities.find(a => a.key === normalizedKey)) {
      toast.error("An amenity field with this key already exists")
      return
    }

    const field: AmenityField = {
      key: normalizedKey,
      label: newAmenityLabel.trim(),
      icon: newAmenityIcon,
      unit: newAmenityUnit.trim() || undefined
    }

    setTypeConfig({ ...config, amenities: [...config.amenities, field] })
    
    // Clear amenity input fields
    setNewAmenityKey("")
    setNewAmenityLabel("")
    setNewAmenityUnit("")
    setNewAmenityIcon("square")
    
    toast.success(`Added "${field.label}" locally.`)
  }

  const handleRemoveAmenityField = (typeName: string, keyToRemove: string) => {
    const config = getTypeConfig(typeName)
    setTypeConfig({ ...config, amenities: config.amenities.filter(a => a.key !== keyToRemove) })
    toast.success("Removed field locally.")
  }

  const saveAllSettings = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyTypes, typeAmenityConfigs }),
      })
      if (response.ok) {
        toast.success("Settings saved successfully")
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to save settings")
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
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 font-sans">
      <div className="space-y-2 border-b pb-6 dark:border-gray-800">
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 dark:text-white">Property Types & Amenities</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
          Manage listing types and their quick-info specifications (like Beds, Baths, Area, etc.) rendered on property details and cards.
        </p>
      </div>

      <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-serif flex items-center gap-3 text-gray-900 dark:text-white">
              <Home className="w-5 h-5 text-emerald-500" /> Taxonomy & Specifications
            </CardTitle>
            <CardDescription className="mt-1">
              Add property types and configure custom specs for each type.
            </CardDescription>
          </div>
          
          <Button 
            onClick={() => setIsAddingType(!isAddingType)}
            className="rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs uppercase tracking-wider h-11 px-5"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Property Type
          </Button>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Add Property Type Form (Inline / Dynamic) */}
          {isAddingType && (
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Add New Property Type</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="typeName">Type Name</Label>
                  <Input 
                    id="typeName" 
                    placeholder="e.g. Duplex, Penthouse, Land" 
                    value={newTypeInput}
                    onChange={(e) => setNewTypeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddPropertyType()}
                    className="rounded-xl h-11 bg-white dark:bg-gray-950"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddPropertyType}
                    className="rounded-xl h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase"
                  >
                    Confirm Add
                  </Button>
                  <Button 
                    onClick={saveAllSettings}
                    disabled={saving}
                    className="rounded-xl h-11 px-5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setIsAddingType(false); setNewTypeInput(""); }}
                    className="rounded-xl h-11 px-4 text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Table of Types & Amenities */}
          <div className="rounded-2xl border dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Property Type</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Configured Specifications</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {propertyTypes.map((typeName) => {
                    const config = getTypeConfig(typeName)
                    const isEditingThis = editingType === typeName

                    return (
                      <React.Fragment key={typeName}>
                        <tr className={cn(
                          "hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors",
                          isEditingThis && "bg-emerald-50/5 dark:bg-emerald-950/5"
                        )}>
                          <td className="px-6 py-5 font-bold text-gray-900 dark:text-white">
                            {typeName}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              {config.amenities.map((amenity) => (
                                <span 
                                  key={amenity.key} 
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 dark:bg-gray-900 border text-xs font-semibold text-gray-700 dark:text-gray-300"
                                >
                                  <IconComponent iconId={amenity.icon} className="w-3.5 h-3.5 text-gray-500" />
                                  {amenity.label}
                                  {amenity.unit && <span className="text-[10px] text-gray-400 font-normal">({amenity.unit})</span>}
                                </span>
                              ))}
                              {config.amenities.length === 0 && (
                                <span className="text-xs text-gray-400 italic">No specifications defined</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant={isEditingThis ? "default" : "outline"}
                                onClick={() => setEditingType(isEditingThis ? null : typeName)}
                                className="rounded-xl h-9 text-xs font-semibold flex items-center gap-1.5"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                {isEditingThis ? "Close Panel" : "Edit Specs"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemovePropertyType(typeName)}
                                className="rounded-xl h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-gray-200 dark:border-gray-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Inline Expandable Edit Panel for Specifications */}
                        {isEditingThis && (
                          <tr className="bg-gray-50/30 dark:bg-gray-900/5">
                            <td colSpan={3} className="px-8 py-6 border-b dark:border-gray-800">
                              <div className="space-y-6">
                                <div className="flex justify-between items-center border-b pb-3 dark:border-gray-800">
                                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Configure specifications for "{typeName}"
                                  </h4>
                                  <button onClick={() => setEditingType(null)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Current specifications table/list */}
                                {config.amenities.length > 0 && (
                                  <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Active Specifications</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                      {config.amenities.map((amenity) => (
                                        <div key={amenity.key} className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-gray-950 border dark:border-gray-800 shadow-sm">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                                              <IconComponent iconId={amenity.icon} className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div>
                                              <p className="text-xs font-bold text-gray-850 dark:text-white">{amenity.label}</p>
                                              <p className="text-[10px] text-gray-400 font-mono">{amenity.key} {amenity.unit ? `(${amenity.unit})` : ""}</p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => handleRemoveAmenityField(typeName, amenity.key)}
                                            className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                            title="Delete field"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Add Specification Field Form */}
                                <div className="p-5 rounded-xl border dark:border-gray-800 bg-white dark:bg-gray-950 space-y-4">
                                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Add Specification Field</h5>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1.5">
                                      <Label className="text-xs">Field Key (Unique, e.g. beds)</Label>
                                      <Input 
                                        placeholder="e.g. beds"
                                        value={newAmenityKey}
                                        onChange={e => setNewAmenityKey(e.target.value)}
                                        className="rounded-xl h-10 text-xs"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-xs">Display Label (e.g. Beds)</Label>
                                      <Input 
                                        placeholder="e.g. Beds"
                                        value={newAmenityLabel}
                                        onChange={e => setNewAmenityLabel(e.target.value)}
                                        className="rounded-xl h-10 text-xs"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-xs">Unit (Optional, e.g. sqft)</Label>
                                      <Input 
                                        placeholder="e.g. sqft"
                                        value={newAmenityUnit}
                                        onChange={e => setNewAmenityUnit(e.target.value)}
                                        className="rounded-xl h-10 text-xs"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-xs">Icon Representation</Label>
                                      <select
                                        value={newAmenityIcon}
                                        onChange={e => setNewAmenityIcon(e.target.value)}
                                        className="w-full h-10 rounded-xl text-xs border border-input bg-background px-3 py-2"
                                      >
                                        {AVAILABLE_ICONS.map(ico => (
                                          <option key={ico.id} value={ico.id}>{ico.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleAddAmenityField(typeName)}
                                      size="sm"
                                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs px-4"
                                    >
                                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Field
                                    </Button>
                                    <Button
                                      onClick={saveAllSettings}
                                      disabled={saving}
                                      size="sm"
                                      className="rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-wider text-xs px-4 flex items-center gap-2"
                                    >
                                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                      Save Settings
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                  {propertyTypes.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-10 text-gray-400 text-sm italic">
                        No property types configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Footer Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={saveAllSettings}
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
