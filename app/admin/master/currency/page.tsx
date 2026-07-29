"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, Check, Coins } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminCurrencyPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Currency State
  const [activeCurrency, setActiveCurrency] = useState({
    code: "USD",
    symbol: "$",
    position: "prefix" as "prefix" | "suffix"
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.activeCurrency) {
        setActiveCurrency(data.activeCurrency)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const saveCurrency = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeCurrency }),
      })

      if (response.ok) {
        toast.success("Currency settings updated successfully")
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to update currency settings")
      }
    } catch (error) {
      console.error("Error saving currency:", error)
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
        <h1 className="text-4xl font-serif tracking-tight text-gray-900 dark:text-white">Currency Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
          Setup active currency settings, symbols, and formatting options displayed dynamically across pricing widgets.
        </p>
      </div>

      <Card className="rounded-[2rem] shadow-xl shadow-emerald-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b p-8 rounded-t-[2rem]">
          <CardTitle className="text-xl font-serif flex items-center gap-3">
            <Coins className="w-5 h-5 text-emerald-500" /> Currency Formatting
          </CardTitle>
          <CardDescription>Configure currency labels and symbol positions.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currencyCode">Currency Code</Label>
              <Input 
                id="currencyCode"
                value={activeCurrency.code}
                onChange={(e) => setActiveCurrency({ ...activeCurrency, code: e.target.value.toUpperCase() })}
                placeholder="e.g. USD, EUR, GBP"
                className="rounded-xl bg-white dark:bg-gray-950"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currencySymbol">Currency Symbol</Label>
              <Input 
                id="currencySymbol"
                value={activeCurrency.symbol}
                onChange={(e) => setActiveCurrency({ ...activeCurrency, symbol: e.target.value })}
                placeholder="e.g. $, €, £, ₹"
                className="rounded-xl bg-white dark:bg-gray-950"
              />
            </div>

            <div className="space-y-2">
              <Label className="block mb-2">Symbol Position</Label>
              <RadioGroup 
                value={activeCurrency.position} 
                onValueChange={(val: any) => setActiveCurrency({ ...activeCurrency, position: val })}
                className="flex gap-6 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefix" id="prefix" />
                  <Label htmlFor="prefix" className="font-semibold cursor-pointer">Prefix (e.g. $500k)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suffix" id="suffix" />
                  <Label htmlFor="suffix" className="font-semibold cursor-pointer">Suffix (e.g. 500k €)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-gray-400">Sample Price Rendering:</span>
            <span className="font-serif text-lg font-bold text-emerald-600">
              {activeCurrency.position === "prefix" 
                ? `${activeCurrency.symbol}1,250,000` 
                : `1,250,000 ${activeCurrency.symbol}`}
            </span>
          </div>

          <div className="flex justify-end pt-6 border-t dark:border-gray-800">
            <Button 
              onClick={saveCurrency}
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
              {saving ? "Saving..." : saved ? "Saved!" : "Save Currency Settings"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
