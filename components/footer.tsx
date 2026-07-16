import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-[#0a0a0a] pt-32 pb-12 border-t border-gray-100 dark:border-gray-800 font-sans">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 space-y-10">
            <h2 className="text-5xl md:text-7xl font-serif text-gray-900 dark:text-white leading-[1] tracking-tighter">
              Let&apos;s find your <br /> perfect corner.
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/listings">
                <Button className="rounded-full px-10 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold hover:scale-105 transition-transform text-[11px] uppercase tracking-widest">
                  View Listings
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="rounded-full px-10 h-16 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-[11px] uppercase tracking-widest">
                  Talk to an Agent
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Company</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                    About Us <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                    Services <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                    FAQ <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                    Contact <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Discover</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/listings?priceType=sale" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Buy a Home</Link>
                </li>
                <li>
                  <Link href="/listings?priceType=rent" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Rent a Home</Link>
                </li>
                <li>
                  <Link href="/listings?featured=true" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Featured Properties</Link>
                </li>
                <li>
                  <Link href="/listings?priceType=premium" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Luxury Collection</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Portal</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/agent/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium underline decoration-emerald-500/30 underline-offset-4">Agent Login</Link>
                </li>
                <li className="flex gap-4 pt-4">
                  <Link href="#" className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all">
                    <Facebook className="h-4 w-4" />
                  </Link>
                  <Link href="#" className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all">
                    <Twitter className="h-4 w-4" />
                  </Link>
                  <Link href="#" className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all">
                    <Instagram className="h-4 w-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-gray-100 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <p>© {currentYear} Elite Group Elite. Crafted with passion.</p>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
