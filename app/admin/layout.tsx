"use client"

import type React from "react"
import { useAuth } from "@/lib/auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import AdminNavigation from "@/components/admin/admin-navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Don't show navigation on login page
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!loading && !isLoginPage && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, user, loading, router, isLoginPage])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // For login page, render without navigation
  if (isLoginPage) {
    return <>{children}</>
  }

  // For other admin pages, check authentication
  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <div className="lg:ml-64">
        <main>{children}</main>
      </div>
    </div>
  )
}
