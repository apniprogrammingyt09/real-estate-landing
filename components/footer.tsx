import Link from "next/link"
import { Building, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-primary p-2 w-[40px] h-[40px] flex items-center justify-center text-white rounded-lg">
                  <Building className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">RealEstate</span>
              </Link>
              <p className="text-gray-300 leading-relaxed">
                Your trusted partner in finding the perfect property. We make real estate dreams come true with
                exceptional service and expertise.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-primary">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-primary">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-primary">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-primary">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { name: "Home", href: "/" },
                  { name: "Properties", href: "/listings" },
                  { name: "Services", href: "/services" },
                  { name: "Agents", href: "/agents" },
                  { name: "About Us", href: "/about" },
                  { name: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Our Services</h3>
              <ul className="space-y-2">
                {[
                  "Property Sales",
                  "Property Rentals",
                  "Property Management",
                  "Investment Consulting",
                  "Market Analysis",
                  "Mortgage Assistance",
                ].map((service) => (
                  <li key={service}>
                    <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-300">
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">132 Dartmouth Street, Boston, MA 02156</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">info@realestate.com</span>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/contact">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">Get In Touch</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">© {currentYear} RealEstate. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
