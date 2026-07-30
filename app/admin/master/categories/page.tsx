"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, Plus, Check, Layers, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminPropertyCategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Property Categories State
  const [propertyCategories, setPropertyCategories] = useState<string[]>([])
  const [originalCategories, setOriginalCategories] = useState<string[]>([])
  const [newCategoryInput, setNewCategoryInput] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.propertyCategories) {
        setPropertyCategories(data.propertyCategories)
        setOriginalCategories(data.propertyCategories)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const addPropertyCategory = () => {
    if (!newCategoryInput.trim()) {
      toast.error("Please enter a valid category name")
      return
    }
    if (propertyCategories.includes(newCategoryInput.trim())) {
      toast.error("This category already exists")
      return
    }
    setPropertyCategories([...propertyCategories, newCategoryInput.trim()])
    setNewCategoryInput("")
  }

  const removePropertyCategory = (categoryToRemove: string) => {
    setPropertyCategories(propertyCategories.filter((c) => c !== categoryToRemove))
  }

  const saveCategories = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyCategories }),
      })

      if (response.ok) {
        toast.success("Property categories updated successfully")
        setSaved(true)
        setOriginalCategories(propertyCategories)
        setIsEditing(false)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to update property categories")
      }
    } catch (error) {
      console.error("Error saving property categories:", error)
      toast.error("An error occurred while saving")
    } finally {
      setSaving(false)
    }
  }

  const hasUnsavedChanges = JSON.stringify(propertyCategories) !== JSON.stringify(originalCategories)
  const showSave = isEditing || hasUnsavedChanges

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
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 dark:text-white">Property Categories</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
          Manage active transaction/deal categories (e.g. For Rent, For Sale, Commercial) displayed in filters and property submissions.
        </p>
      </div>

      <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xl font-serif flex items-center gap-3">
              <Layers className="w-5 h-5 text-emerald-500" /> Active Taxonomy Categories
            </CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl gap-1 text-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              {isEditing ? "Editing..." : "Edit / Delete"}
            </Button>
          </div>
          <CardDescription>Create or remove listing categories.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4 bg-gray-50/50 dark:bg-gray-900/30 p-6 rounded-2xl border dark:border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Create Property Category</h3>
              <div className="space-y-3">
                <Label htmlFor="newCategory">Category Name</Label>
                <Input
                  id="newCategory"
                  placeholder="e.g. For Rent, Commercial"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="rounded-xl bg-white dark:bg-gray-950"
                />
                <Button onClick={addPropertyCategory} className="w-full rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-wider text-xs h-11">
                  <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Active Property Categories</h3>
              <div className="flex flex-wrap gap-2.5 min-h-[120px] p-5 rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-950 items-center justify-start">
                {propertyCategories.map((cat, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {cat}
                    {isEditing && (
                      <button 
                        onClick={() => removePropertyCategory(cat)}
                        className="w-5 h-5 rounded-lg bg-gray-200/50 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 rotate-45" />
                      </button>
                    )}
                  </span>
                ))}
                {propertyCategories.length === 0 && (
                  <p className="text-xs text-gray-400 w-full text-center">No categories created yet.</p>
                )}
              </div>
            </div>
          </div>

          {showSave && (
            <div className="flex justify-end pt-6 border-t dark:border-gray-800 animate-in fade-in duration-200">
              <Button 
                onClick={saveCategories}
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
                {saving ? "Saving..." : saved ? "Saved!" : "Save Property Categories"}
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
