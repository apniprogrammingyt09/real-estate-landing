"use client"

import { useState } from "react"
import {
  Menu, X, Home, Building, Users, Plus, Clock,
  MessageSquare, Calendar, LogOut, ChevronDown, ChevronRight, Settings, Sparkles, Coins, Layers, Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

const AdminNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [masterOpen, setMasterOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }
  const mainNavigationItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/agents", icon: Users, label: "Agents" },
    { href: "/admin/contacts", icon: MessageSquare, label: "Contacts" },
    { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
    { href: "/admin/settings", icon: Settings, label: "Site Settings" },
  ]
  const propertyItems = [
    { href: "/admin/properties", icon: Building, label: "All Properties" },
    { href: "/add-property", icon: Plus, label: "Add Property" },
  ]
  const masterItems = [
    { href: "/admin/master/types", icon: Home, label: "Property Types" },
    { href: "/admin/master/categories", icon: Layers, label: "Categories" },
    { href: "/admin/master/currency", icon: Coins, label: "Currency" },
    { href: "/admin/master/features", icon: Sparkles, label: "Features" },
    { href: "/admin/master/flags", icon: Tag, label: "Property Flags" },
  ]

  const isMasterActive = masterItems.some(item => pathname === item.href)
  const isPropertiesActive = propertyItems.some(item => pathname === item.href)

  const renderNavLinks = (onItemClick?: () => void) => {
    return (
      <div className="space-y-1">
        {/* Dashboard Link (Standard) */}
        {mainNavigationItems.slice(0, 1).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
              onClick={onItemClick}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* Properties Dropdown Toggle */}
        <div className="space-y-1">
          <button
            onClick={() => setPropertiesOpen(!propertiesOpen)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left",
              isPropertiesActive
                ? "bg-gray-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Properties</span>
            </div>
            {propertiesOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* Sub menu items for Properties */}
          {propertiesOpen && (
            <div className="pl-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {propertyItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={onItemClick}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Other Main Nav items (excluding Dashboard) */}
        {mainNavigationItems.slice(1).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
              onClick={onItemClick}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* Master Dropdown Toggle */}
        <div className="space-y-1">
          <button
            onClick={() => setMasterOpen(!masterOpen)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left",
              isMasterActive
                ? "bg-gray-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <Layers className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Master</span>
            </div>
            {masterOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* Sub menu items for Master */}
          {masterOpen && (
            <div className="pl-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {masterItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={onItemClick}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-lg hover:shadow-xl"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-900 dark:text-white" />
        ) : (
          <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="space-y-2">
            {renderNavLinks(() => setMobileMenuOpen(false))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors mt-4"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 z-30">
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h2>
            <nav className="space-y-2">
              {renderNavLinks()}
            </nav>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminNavigation
