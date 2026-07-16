"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Building, Phone, Plus, Sun, Moon, UserCircle } from "lucide-react"
import WishlistDrawer from "@/components/wishlist-drawer"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Properties", href: "/listings", icon: Building },
    { name: "Agents", href: "/agents", icon: Building },
    { name: "Services", href: "/services", icon: Building },
    { name: "About", href: "/about", icon: Building },
    { name: "Contact", href: "/contact", icon: Phone },
  ]

  return (
    <header className="sticky top-0 inset-x-0 z-50 flex justify-center bg-white border-b border-transparent shadow-none">
      <div className="flex items-center justify-between px-8 py-4 w-full max-w-[1200px]">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="bg-[#09090b] p-1.5 rounded-[14px]">
            <Building className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#09090b]">Elite Group</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-[14px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-all rounded-full"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/agent/login" className="hidden md:flex text-[14px] font-medium text-[#18181b] hover:text-[#09090b]">
            Log in
          </Link>

          <Link href="/add-property" className="hidden md:flex">
            <Button size="sm" className="rounded-full px-6">
              List Property
            </Button>
          </Link>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/agent/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary border border-gray-200 dark:border-gray-700"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Agent Login
                </Button>
              </Link>
              <Link href="/add-property" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  List Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
