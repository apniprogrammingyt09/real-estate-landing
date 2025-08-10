"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<number[]>([])

  const faqCategories = [
    {
      title: "Buying Properties",
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
        {
          question: "How long does the buying process take?",
          answer:
            "The typical home buying process takes 30-60 days from offer acceptance to closing. This can vary based on financing, inspections, and any contingencies. Cash purchases can close much faster, sometimes within 1-2 weeks.",
        },
        {
          question: "What are closing costs and how much should I expect?",
          answer:
            "Closing costs typically range from 2-5% of the home's purchase price and include fees for inspections, appraisals, title insurance, attorney fees, and lender charges. We'll provide a detailed estimate early in the process.",
        },
      ],
    },
    {
      title: "Selling Properties",
      faqs: [
        {
          question: "How do I determine my home's value?",
          answer:
            "We provide a comprehensive market analysis comparing your home to recently sold properties in your area. Factors include location, size, condition, recent improvements, and current market conditions. This analysis is free and helps set the right listing price.",
        },
        {
          question: "What should I do to prepare my home for sale?",
          answer:
            "Start with decluttering and deep cleaning. Consider minor repairs, fresh paint in neutral colors, and improving curb appeal. We'll provide a detailed preparation checklist and can recommend trusted contractors for any needed work. Professional staging can also help your home sell faster and for a better price.",
        },
        {
          question: "How long will it take to sell my home?",
          answer:
            "The average time on market varies by location and price range, but typically ranges from 30-90 days. Factors affecting sale time include pricing, condition, location, and market conditions. We'll provide local market statistics and develop a strategy to sell your home as quickly as possible.",
        },
        {
          question: "Do I need to make repairs before selling?",
          answer:
            "Not necessarily. We'll help you evaluate which repairs will provide the best return on investment. Some repairs are essential for safety and marketability, while others might not be worth the cost. We can also explore selling 'as-is' if that better fits your situation.",
        },
      ],
    },
    {
      title: "Renting Properties",
      faqs: [
        {
          question: "What do I need to qualify for a rental?",
          answer:
            "Most landlords require proof of income (typically 3x the monthly rent), good credit score, employment verification, and references from previous landlords. You'll also need to provide identification and may need to pay a security deposit and first month's rent upfront.",
        },
        {
          question: "How much should I budget for renting?",
          answer:
            "A good rule of thumb is that rent should not exceed 30% of your gross monthly income. Don't forget to budget for utilities, renter's insurance, parking fees, and any pet deposits or fees if applicable.",
        },
        {
          question: "What's included in the lease agreement?",
          answer:
            "Lease agreements typically include rent amount, lease term, security deposit, pet policies, maintenance responsibilities, and rules about modifications. We'll review all lease terms with you before signing to ensure you understand your rights and responsibilities.",
        },
        {
          question: "Can I break my lease early?",
          answer:
            "Lease terms vary, but most allow early termination under specific circumstances such as job relocation, military deployment, or uninhabitable conditions. There may be penalties involved. We recommend reviewing your lease agreement and discussing options with your landlord.",
        },
      ],
    },
    {
      title: "Investment Properties",
      faqs: [
        {
          question: "What makes a good investment property?",
          answer:
            "Look for properties in growing areas with good rental demand, reasonable purchase prices relative to rental income, and potential for appreciation. Consider factors like location, condition, rental yield, and your investment goals. Our investment specialists can help analyze potential returns.",
        },
        {
          question: "How much money do I need to invest in real estate?",
          answer:
            "Investment property down payments typically range from 20-25% of the purchase price. You'll also need funds for closing costs, repairs, and several months of expenses as a buffer. We can help you explore different financing options and investment strategies.",
        },
        {
          question: "Should I manage the property myself or hire a company?",
          answer:
            "This depends on your time, experience, and proximity to the property. Self-management saves money but requires time and knowledge. Property management companies typically charge 8-12% of rental income but handle all aspects of management. We can recommend trusted management companies.",
        },
        {
          question: "What are the tax implications of investment properties?",
          answer:
            "Investment properties offer several tax benefits including depreciation, mortgage interest deductions, and expense deductions. However, you'll pay taxes on rental income and potentially capital gains when selling. We recommend consulting with a tax professional for personalized advice.",
        },
      ],
    },
    {
      title: "General Questions",
      faqs: [
        {
          question: "Do I need a real estate agent?",
          answer:
            "While not legally required, a good agent provides valuable expertise in pricing, marketing, negotiations, and navigating complex paperwork. Our agents have access to market data, professional networks, and experience that can save you time and money while reducing stress.",
        },
        {
          question: "How do real estate agent commissions work?",
          answer:
            "Typically, the seller pays both the listing agent and buyer's agent commissions, usually totaling 5-6% of the sale price. The commission is split between the agents and their brokerages. For buyers, our services are essentially free as the seller covers the commission.",
        },
        {
          question: "What's the difference between pre-qualification and pre-approval?",
          answer:
            "Pre-qualification is an informal estimate based on self-reported financial information. Pre-approval involves a thorough review of your finances and credit, resulting in a conditional commitment for a specific loan amount. Pre-approval carries more weight with sellers.",
        },
        {
          question: "Can I buy a home with bad credit?",
          answer:
            "Yes, but it may be more challenging and expensive. Options include FHA loans (which accept lower credit scores), working with specialized lenders, or improving your credit before applying. We can connect you with lenders who work with various credit situations.",
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white section-padding">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Find answers to common questions about buying, selling, renting, and investing in real estate. Can't find
              what you're looking for? Contact our team for personalized assistance.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search frequently asked questions..."
                  className="pl-12 bg-white border-0 text-gray-900 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  No FAQs found matching your search. Try different keywords or browse all categories.
                </p>
                <Button onClick={() => setSearchTerm("")} className="bg-primary hover:bg-primary/90 text-white">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredFAQs.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="card-base p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                      {category.title}
                    </h2>
                    <div className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => {
                        const itemId = categoryIndex * 1000 + faqIndex
                        const isOpen = openItems.includes(itemId)

                        return (
                          <div key={faqIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                            <button
                              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                              onClick={() => toggleItem(categoryIndex, faqIndex)}
                            >
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                {faq.question}
                              </h3>
                              {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              )}
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-4">
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                              </div>
                            )}
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
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Still Have Questions?</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Our team is here to help. Contact us for personalized assistance with your real estate needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card-base p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Call Us</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Speak directly with our experts</p>
                <p className="text-primary font-medium">+1 (555) 123-4567</p>
              </div>

              <div className="card-base p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Get detailed answers via email</p>
                <p className="text-secondary font-medium">info@realestate.com</p>
              </div>

              <div className="card-base p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Chat with us in real-time</p>
                <p className="text-accent font-medium">Available 9AM-6PM</p>
              </div>
            </div>

            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
