"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail, Sparkles, HelpCircle, ArrowRight, Plus, Minus } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<number[]>([])

  const faqCategories = [
    {
      title: "Buying Experience",
      faqs: [
        {
          question: "How do I start the home buying process?",
          answer:
            "Start by getting pre-approved for a mortgage to understand your budget. Then, work with one of our agents to identify your needs and preferences. We'll help you search for properties, schedule viewings, and guide you through the entire process from offer to closing.",
        },
        {
          question: "What documents do I need to buy a property?",
          answer:
            "You'll typically need proof of income, bank statements, tax returns, employment verification, and identification. For financing, your lender will provide a complete list of required documents. Our team can help you prepare all necessary paperwork.",
        },
      ],
    },
    {
      title: "Selling Strategy",
      faqs: [
        {
          question: "How do I determine my home's value?",
          answer:
            "We provide a comprehensive market analysis comparing your home to recently sold properties in your area. Factors include location, size, condition, recent improvements, and current market conditions. This analysis is free and helps set the right listing price.",
        },
        {
          question: "What should I do to prepare my home for sale?",
          answer:
            "Start with decluttering and deep cleaning. Consider minor repairs, fresh paint in neutral colors, and improving curb appeal. Professional staging can also help your home sell faster and for a better price.",
        },
      ],
    },
    {
      title: "Luxury Rentals",
      faqs: [
        {
          question: "What do I need to qualify for a rental?",
          answer:
            "Most landlords require proof of income (typically 3x the monthly rent), good credit score, employment verification, and references from previous landlords. You'll also need to provide identification and pay a security deposit.",
        },
      ],
    },
  ]

  const toggleItem = (categoryIndex: number, faqIndex: number) => {
    const itemId = categoryIndex * 1000 + faqIndex
    setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-amber-50 dark:bg-amber-950/10 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/50 dark:bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              <HelpCircle className="w-4 h-4" />
              Information Hub
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-gray-900 dark:text-white leading-[0.9] tracking-tighter mb-12">
              Common questions, <br/> expert answers.
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <Input
                placeholder="Search for a topic..."
                className="h-20 pl-16 pr-8 rounded-[2rem] bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-2xl focus-visible:ring-amber-500/20 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Sidebar / Quick Links */}
            <div className="lg:col-span-4 space-y-12">
              <div className="p-10 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8">
                <h3 className="text-xl font-serif tracking-tight">Need direct help?</h3>
                <div className="space-y-4">
                   <Link href="/contact" className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl hover:border-amber-500/30 border border-transparent transition-all group">
                    <div className="flex items-center gap-4">
                      <Phone className="w-5 h-5 text-amber-500" />
                      <span className="font-bold text-sm">Call Support</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                  </Link>
                   <Link href="/contact" className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl hover:border-amber-500/30 border border-transparent transition-all group">
                    <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5 text-amber-500" />
                      <span className="font-bold text-sm">Email Inquiry</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Stats Card */}
              <div className="p-10 bg-amber-500 rounded-[3rem] text-white space-y-4">
                <Sparkles className="w-10 h-10" />
                <h3 className="text-3xl font-serif tracking-tight leading-tight">Personalized <br/> Consulting</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Our elite agents are available for private consultations to discuss your unique investment goals.
                </p>
                <Button className="w-full h-14 rounded-full bg-white text-amber-600 font-bold text-[10px] uppercase tracking-widest hover:bg-white/90">
                  Book a session
                </Button>
              </div>
            </div>

            {/* Main FAQ List */}
            <div className="lg:col-span-8">
              {filteredFAQs.length === 0 ? (
                <div className="py-24 text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold">No results found</h3>
                  <Button onClick={() => setSearchTerm("")} variant="outline" className="rounded-full px-10 border-2">Clear Search</Button>
                </div>
              ) : (
                <div className="space-y-16">
                  {filteredFAQs.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-1.5 bg-amber-500 rounded-full"></div>
                        <h2 className="text-3xl font-serif tracking-tight">{category.title}</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {category.faqs.map((faq, faqIndex) => {
                          const itemId = categoryIndex * 1000 + faqIndex
                          const isOpen = openItems.includes(itemId)

                          return (
                            <div 
                              key={faqIndex} 
                              className={cn(
                                "group rounded-[2rem] border transition-all duration-500 overflow-hidden",
                                isOpen 
                                  ? "bg-white dark:bg-gray-900 border-amber-500/30 shadow-2xl shadow-amber-500/5" 
                                  : "bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 hover:border-amber-500/20"
                              )}
                            >
                              <button
                                className="w-full px-10 py-8 text-left flex items-center justify-between"
                                onClick={() => toggleItem(categoryIndex, faqIndex)}
                              >
                                <h3 className={cn(
                                  "text-lg font-bold transition-colors duration-300",
                                  isOpen ? "text-amber-600" : "text-gray-900 dark:text-white"
                                )}>
                                  {faq.question}
                                </h3>
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                  isOpen ? "bg-amber-500 text-white rotate-0" : "bg-white dark:bg-gray-800 text-gray-400 rotate-90"
                                )}>
                                  {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                              </button>
                              
                              <div className={cn(
                                "grid transition-all duration-500 ease-in-out",
                                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                              )}>
                                <div className="overflow-hidden">
                                  <div className="px-10 pb-10">
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                      {faq.answer}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="container-custom">
          <div className="bg-gray-900 rounded-[4rem] p-16 md:p-24 text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
            <h2 className="text-4xl md:text-7xl font-serif text-white tracking-tighter max-w-4xl mx-auto leading-[0.9]">
              Still have questions about your future home?
            </h2>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link href="/contact">
                <Button className="h-20 px-12 rounded-full bg-white text-gray-900 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                  Contact Our Team
                </Button>
              </Link>
              <Link href="/listings">
                <Button variant="outline" className="h-20 px-12 rounded-full border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10">
                  Explore Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
