"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Loader2, ArrowRight, Building2 } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await login(formData.email, formData.password, "admin")

      if (success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        })
        router.push("/admin")
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#09090b] font-sans selection:bg-white/20 selection:text-white">
      {/* Left side abstract/branding */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 lg:p-24 bg-[#09090b] text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="z-10">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white rounded-[14px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#09090b]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Elite Group</span>
          </Link>
        </div>
        
        <div className="z-10 space-y-8 max-w-md">
          <h1 className="text-6xl lg:text-8xl font-sans tracking-tighter leading-[0.9]">
            System <br/> Control.
          </h1>
          <p className="text-gray-400 font-medium leading-relaxed text-lg">
            Authorized access only. Manage the global portfolio and oversee agent operations securely.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center bg-white rounded-t-[3rem] md:rounded-l-[3rem] md:rounded-tr-none p-8 lg:p-24 relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-sans tracking-tight text-[#09090b]">Admin Login</h2>
            <p className="text-gray-500 font-medium">Enter your credentials to access the dashboard.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="admin@elitegroup.com"
                className="h-16 rounded-[14px] bg-[#f4f4f5] border-[#ececee] focus-visible:ring-[#ececee] px-6 font-medium text-[#09090b]"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Password</label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="h-16 rounded-[14px] bg-[#f4f4f5] border-[#ececee] focus-visible:ring-[#ececee] px-6 font-medium text-[#09090b]"
                required
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-16 rounded-[2rem] bg-[#09090b] hover:bg-gray-800 text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-transform hover:scale-105" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="ml-3 w-4 h-4" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
