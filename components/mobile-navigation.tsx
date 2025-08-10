"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, Info, MessageCircle } from "lucide-react"

export default function MobileNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/listings", icon: Search, label: "Search" },
    { href: "/add-property", icon: PlusSquare, label: "Add Property" },
    { href: "/about", icon: Info, label: "About" },
    { href: "/contact", icon: MessageCircle, label: "Contact" },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg">
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center transition-all duration-300 hover:-translate-y-1 ${isActive ? "text-primary" : "text-gray-600 dark:text-gray-400 hover:text-primary"}`}
            >
              <Icon
                className={`h-6 w-6 ${isActive ? "" : "transition-transform duration-300 group-hover:scale-110"}`}
              />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
