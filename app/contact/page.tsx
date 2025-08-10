"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, Send } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your message has been sent successfully! We'll get back to you soon.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Rest of the component remains the same, but update the form JSX:

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white section-padding">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-blue-100 mb-8">
              Have questions or need assistance? We're here to help you with all your real estate needs
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card-base card-hover p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Office</h3>
              <p className="text-gray-600 dark:text-gray-400">
                132 Dartmouth Street
                <br />
                Boston, Massachusetts 02156
                <br />
                United States
              </p>
            </div>

            <div className="card-base card-hover p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Phone & Email</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">+1012 3456 789</p>
              <p className="text-gray-600 dark:text-gray-400">demo@gmail.com</p>
            </div>

            <div className="card-base card-hover p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Working Hours</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Monday - Friday: 9AM - 6PM</p>
              <p className="text-gray-600 dark:text-gray-400">Saturday: 10AM - 4PM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card-base p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-gray-900 dark:text-white">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus-visible:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-gray-900 dark:text-white">
                      Your Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus-visible:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-gray-900 dark:text-white">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus-visible:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-gray-900 dark:text-white">
                    Subject
                  </label>
                  <Select value={formData.subject} onValueChange={handleSubjectChange} required>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-primary">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="property">Property Information</SelectItem>
                      <SelectItem value="viewing">Schedule a Viewing</SelectItem>
                      <SelectItem value="selling">Selling My Property</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-gray-900 dark:text-white">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message here..."
                    className="min-h-[150px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus-visible:ring-primary"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Map */}
            <div className="card-base p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Location</h2>
              <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {/* In a real app, you would integrate with Google Maps or similar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Map showing our office location at:</p>
                    <p className="text-gray-900 dark:text-white font-medium">132 Dartmouth Street, Boston</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Reach Us</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">By Car:</span> Parking available in
                      front of the building and nearby parking garages.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">Public Transit:</span> 5-minute walk
                      from Downtown Station (Red Line).
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">From Airport:</span> 20-minute drive
                      from Boston Logan International Airport.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our services and processes
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="card-base card-hover p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  How do I schedule a property viewing?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You can schedule a property viewing by contacting us through our website, calling our office, or
                  sending an email. We'll arrange a convenient time for you to visit the property with one of our
                  agents.
                </p>
              </div>

              <div className="card-base card-hover p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  What documents do I need to sell my property?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To sell your property, you'll typically need proof of ownership, property tax records, mortgage
                  information, and any relevant permits or certificates. Our team can guide you through the specific
                  requirements based on your situation.
                </p>
              </div>

              <div className="card-base card-hover p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  How long does the buying process usually take?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The buying process typically takes 30-90 days from offer acceptance to closing, depending on factors
                  such as financing, inspections, and any contingencies. Our experienced agents will help you navigate
                  each step efficiently.
                </p>
              </div>

              <div className="card-base card-hover p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Do you help with financing options?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, we work with trusted financial partners who can provide various financing options tailored to
                  your needs. Our team can connect you with mortgage brokers and lenders to help you secure the best
                  possible terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Real Estate Journey?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Whether you're buying, selling, or renting, our team is here to guide you every step of the way
          </p>
          <Button className="bg-white text-accent hover:bg-gray-100">Browse Our Properties</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
