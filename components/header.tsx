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
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-2xl rounded-full h-16 flex items-center justify-between px-8 w-full max-w-5xl pointer-events-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="bg-gray-900 dark:bg-white p-1.5 rounded-full">
            <Building className="h-5 w-5 text-white dark:text-gray-900" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">RealEstate</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <WishlistDrawer />
          
          <Link href="/add-property" className="hidden md:flex">
            <Button size="sm" variant="outline" className="rounded-full px-4 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
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
