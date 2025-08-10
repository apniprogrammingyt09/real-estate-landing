"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAgentAuth } from "@/lib/agent-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Loader2, User, Lock, Briefcase } from "lucide-react"

interface AgentProfile {
  id: string
  name: string
  email: string
  phone: string
  bio?: string
  specialization: string
  experience: string
  licenseNumber: string
  languages?: string
  avatar?: string
}

export default function AgentProfilePage() {
  const { agent, isAuthenticated } = useAgentAuth()
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (isAuthenticated && agent) {
      fetchProfile()
    }
  }, [isAuthenticated, agent])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/agents/${agent?.id}/profile`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/agents/${agent?.id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          bio: profile.bio,
          specialization: profile.specialization,
          experience: profile.experience,
          licenseNumber: profile.licenseNumber,
          languages: profile.languages,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/agents/${agent?.id}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Access denied. Please log in.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile?.avatar || "/placeholder.svg"} />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Agent Profile</h1>
          <p className="text-muted-foreground">Manage your professional profile</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>Update your personal and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile?.name || ""}
                    onChange={(e) => setProfile((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    onChange={(e) => setProfile((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile?.phone || ""}
                  onChange={(e) => setProfile((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile?.bio || ""}
                  onChange={(e) => setProfile((prev) => (prev ? { ...prev, bio: e.target.value } : null))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Professional Details</span>
            </CardTitle>
            <CardDescription>Update your professional information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={profile?.specialization || ""}
                onChange={(e) => setProfile((prev) => (prev ? { ...prev, specialization: e.target.value } : null))}
                placeholder="e.g., Residential Sales"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={profile?.experience || ""}
                onChange={(e) => setProfile((prev) => (prev ? { ...prev, experience: e.target.value } : null))}
                placeholder="e.g., 5 years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={profile?.licenseNumber || ""}
                onChange={(e) => setProfile((prev) => (prev ? { ...prev, licenseNumber: e.target.value } : null))}
                placeholder="Enter license number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                value={profile?.languages || ""}
                onChange={(e) => setProfile((prev) => (prev ? { ...prev, languages: e.target.value } : null))}
                placeholder="e.g., English, Spanish"
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updatePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
