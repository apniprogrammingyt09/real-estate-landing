"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAgentAuth } from "@/lib/agent-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building,
  Home,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/agent/dashboard", icon: Home },
  { name: "My Properties", href: "/agent/properties", icon: Building },
  { name: "Leads", href: "/agent/leads", icon: Users },
  { name: "Bookings", href: "/agent/bookings", icon: Calendar },
  { name: "Messages", href: "/agent/messages", icon: MessageSquare },
]

export function AgentNavigation() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { agent, logout } = useAgentAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/agent/login")
  }

  const initials = agent?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  /* ─── Sidebar content (shared between desktop & mobile) ─── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex-shrink-0 bg-white/20 p-2 rounded-xl">
          <Building className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight truncate">
            Agent Portal
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-white text-primary shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`flex-shrink-0 h-5 w-5 transition-transform duration-200 ${
                  isActive ? "text-primary" : "text-white/70 group-hover:text-white"
                }`}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: profile + actions */}
      <div className="border-t border-white/10 px-3 py-4 space-y-2">
        {/* Profile settings */}
        <Link
          href="/agent/profile"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Settings className="flex-shrink-0 h-5 w-5" />
          {!collapsed && <span>Profile Settings</span>}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="flex-shrink-0 h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Agent info */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 pt-3 border-t border-white/10 mt-2">
            <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white/20">
              <AvatarImage src={agent?.avatar || "/placeholder.svg"} alt={agent?.name} />
              <AvatarFallback className="bg-white/20 text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{agent?.name}</p>
              <p className="text-white/50 text-xs truncate">{agent?.email}</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center pt-2">
            <Avatar className="h-8 w-8 ring-2 ring-white/20">
              <AvatarImage src={agent?.avatar || "/placeholder.svg"} alt={agent?.name} />
              <AvatarFallback className="bg-white/20 text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden md:flex flex-col relative flex-shrink-0 transition-all duration-300 ease-in-out
          bg-gradient-to-b from-emerald-700 to-emerald-900 shadow-xl
          ${collapsed ? "w-[72px]" : "w-64"}`}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:text-primary transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* ── Mobile top bar + drawer ── */}
      <div className="md:hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14 px-4 bg-gradient-to-r from-emerald-700 to-emerald-900 shadow">
          <Link href="/agent/dashboard" className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Building className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-base">Agent Portal</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile drawer overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-64 h-full bg-gradient-to-b from-emerald-700 to-emerald-900 shadow-2xl flex flex-col">
              <SidebarContent />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
