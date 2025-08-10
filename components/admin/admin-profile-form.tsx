"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "next-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { patch } from "@/lib/api"

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface AdminProfileFormProps {
  user: User
}

export default function AdminProfileForm({ user }: AdminProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      await patch("/api/admin/profile", data)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Something went wrong",
        description: "Your profile could not be updated. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" {...form.register("name")} disabled={isLoading} />
        {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Your email" {...form.register("email")} disabled={isLoading} />
        {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}
