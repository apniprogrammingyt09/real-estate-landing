"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, Plus, Check, Trash2, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminPropertyFlagsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Property Flags State
  const [propertyFlags, setPropertyFlags] = useState<string[]>([])
  const [newFlagInput, setNewFlagInput] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.propertyFlags) {
        setPropertyFlags(data.propertyFlags)
      } else {
        setPropertyFlags(["Featured", "Premium"])
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const addPropertyFlag = () => {
    if (!newFlagInput.trim()) {
      toast.error("Please enter a valid flag name")
      return
    }
    if (propertyFlags.includes(newFlagInput.trim())) {
      toast.error("This flag already exists")
      return
    }
    setPropertyFlags([...propertyFlags, newFlagInput.trim()])
    setNewFlagInput("")
  }

  const removePropertyFlag = (flagToRemove: string) => {
    setPropertyFlags(propertyFlags.filter((f) => f !== flagToRemove))
  }

  const saveFlags = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyFlags }),
      })

      if (response.ok) {
        toast.success("Property promotional flags updated successfully")
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to update property flags")
      }
    } catch (error) {
      console.error("Error saving property flags:", error)
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
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 dark:text-white">Property Flags</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
          Manage promotional tags and flags (e.g. Featured, Premium, Hot Deal) displayed on property listing cards.
        </p>
      </div>

      <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
          <CardTitle className="text-xl font-serif flex items-center gap-3">
            <Tag className="w-5 h-5 text-emerald-500" /> Promotional Tags & Flags
          </CardTitle>
          <CardDescription>Configure the dynamic display labels for premium listings.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="newFlag">New Flag Name</Label>
              <Input 
                id="newFlag"
                placeholder="e.g. Hot Deal, New Listing" 
                value={newFlagInput}
                onChange={(e) => setNewFlagInput(e.target.value)}
                className="rounded-xl border-gray-250 dark:border-gray-800 h-11"
              />
            </div>
            <Button 
              onClick={addPropertyFlag} 
              type="button"
              className="rounded-xl px-6 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Flag
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Current Active Flags</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {propertyFlags.map((flag) => (
                <div key={flag} className="flex justify-between items-center p-4 rounded-2xl border dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 group hover:border-emerald-500/25 transition-all">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {flag}
                  </span>
                  
                  <button 
                    onClick={() => removePropertyFlag(flag)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete Flag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t dark:border-gray-800">
            <Button 
              onClick={saveFlags}
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
              {saving ? "Saving..." : saved ? "Saved!" : "Save Property Flags"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
