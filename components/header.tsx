"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Building, Phone, Plus, Sun, Moon } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Properties", href: "/listings", icon: Building },
    { name: "Services", href: "/services", icon: Building },
    { name: "Agents", href: "/agents", icon: Building },
    { name: "About", href: "/about", icon: Building },
    { name: "Contact", href: "/contact", icon: Phone },
  ]

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 w-[40px] h-[40px] flex items-center justify-center text-white rounded-lg transition-transform duration-300 hover:scale-110">
              <Building className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">RealEstate</span>
          </Link>

          {/* Tablet/Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-700 dark:text-gray-300 hover:text-primary"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Link href="/add-property">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                List Property
              </Button>
            </Link>
            <Link href="/listings">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-700 dark:text-gray-300"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
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
