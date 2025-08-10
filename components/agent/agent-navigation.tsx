"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAgentAuth } from "@/lib/agent-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building, Home, Users, Calendar, MessageSquare, BarChart3, Settings, LogOut, Menu, X } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/agent/dashboard", icon: Home },
  { name: "My Properties", href: "/agent/properties", icon: Building },
  { name: "Leads", href: "/agent/leads", icon: Users },
  { name: "Bookings", href: "/agent/bookings", icon: Calendar },
  { name: "Messages", href: "/agent/messages", icon: MessageSquare },
]

export function AgentNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { agent, logout } = useAgentAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/agent/login")
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/agent/dashboard" className="flex items-center space-x-2">
                <div className="bg-primary p-2 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Agent Portal</span>
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={agent?.avatar || "/placeholder.svg"} alt={agent?.name} />
                    <AvatarFallback>
                      {agent?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{agent?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{agent?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/agent/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="lg:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Navigation */}
      <div className="hidden md:block lg:hidden border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center py-2 px-3 text-sm font-medium ${
                    isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={agent?.avatar || "/placeholder.svg"} alt={agent?.name} />
                  <AvatarFallback>
                    {agent?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{agent?.name}</div>
                <div className="text-sm font-medium text-gray-500">{agent?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/agent/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
