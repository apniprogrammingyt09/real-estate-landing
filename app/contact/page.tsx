"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, Send, Mail, Sparkles, ArrowRight, MessageSquare, Loader2 } from "lucide-react"
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

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-[#ececee] selection:text-emerald-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-[60px] pb-[60px] overflow-hidden">
        <div className="absolute inset-0 bg-[#f4f4f5] dark:bg-emerald-950/20 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-transparent dark:bg-[#f4f4f5]0/10 rounded-full blur-3xl -z-10"></div>

        <div className="container-custom relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-[#09090b] dark:text-[#52525b] font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              <MessageSquare className="w-4 h-4" />
              Connect With Us
            </div>
            <h1 className="text-6xl md:text-8xl font-sans text-gray-900 dark:text-white leading-[0.9] tracking-tighter mb-8">
              Let&apos;s start a <br /> conversation.
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
              Whether you&apos;re looking to buy, sell, or simply have a question, our elite team is ready to guide you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-[60px]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-16">
              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-6 group">
                  <div className="w-14 h-14 rounded-[14px] bg-[#f4f4f5] dark:bg-[#f4f4f5]0/10 flex items-center justify-center text-[#09090b] group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-sans tracking-tight">Main Headquarters</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      8215 Green Park Way, <br />
                      Indore, MP 452001, India
                    </p>
                  </div>
                </div>

                <div className="space-y-6 group">
                  <div className="w-14 h-14 rounded-[14px] bg-[#f4f4f5] dark:bg-[#f4f4f5]0/10 flex items-center justify-center text-[#09090b] group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-sans tracking-tight">Direct Support</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      +91 98765 43210 <br />
                      Mon - Sat, 9am - 7pm
                    </p>
                  </div>
                </div>

                <div className="space-y-6 group">
                  <div className="w-14 h-14 rounded-[14px] bg-[#f4f4f5] dark:bg-[#f4f4f5]0/10 flex items-center justify-center text-[#09090b] group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-sans tracking-tight">Email Inquiries</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      hello@Elite Groupelite.com <br />
                      partners@Elite Groupelite.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini CTA */}
              <div className="p-10 bg-gray-900 rounded-[36px] text-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f4f4f5]0/20 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-sans tracking-tight">Are you an Agent?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Join our network of 500+ elite agents and get access to exclusive listings and tools.
                </p>
                <Button variant="outline" className="rounded-full border-white/20 hover:bg-white hover:text-gray-900 transition-all text-[10px] uppercase tracking-widest font-bold">
                  Apply Now
                </Button>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-gray-900 p-12 lg:p-16 rounded-[36px] border border-[#ececee] dark:border-gray-800 border border-[#ececee] shadow-none space-y-12">
                <div className="space-y-4">
                  <h2 className="text-3xl font-sans tracking-tight">Send a message</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">We usually respond within 24 business hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Your Name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="h-16 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-800/50 border-[#ececee] dark:border-gray-800 focus-visible:ring-[#ececee]"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="h-16 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-800/50 border-[#ececee] dark:border-gray-800 focus-visible:ring-[#ececee]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 000 000 0000"
                        className="h-16 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-800/50 border-[#ececee] dark:border-gray-800 focus-visible:ring-[#ececee]"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Inquiry Type</label>
                      <Select value={formData.subject} onValueChange={handleSubjectChange} required>
                        <SelectTrigger className="h-16 rounded-[14px] bg-[#f4f4f5] dark:bg-gray-800/50 border-[#ececee] dark:border-gray-800 focus:ring-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[14px]">
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="property">Property Info</SelectItem>
                          <SelectItem value="viewing">Schedule Viewing</SelectItem>
                          <SelectItem value="selling">Selling Property</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Your Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about what you're looking for..."
                      className="min-h-[180px] rounded-[2rem] bg-[#f4f4f5] dark:bg-gray-800/50 border-[#ececee] dark:border-gray-800 focus-visible:ring-[#ececee] p-8"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-20 rounded-[2rem] bg-[#09090b] hover:bg-[#09090b] text-white font-bold text-sm uppercase tracking-widest border border-[#ececee] shadow-none shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send Message <ArrowRight className="ml-3 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-[60px]">
        <div className="container-custom">
          <div className="relative h-[600px] rounded-[36px] overflow-hidden border border-[#ececee] dark:border-gray-800 group border border-[#ececee] shadow-none">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1715520000000!5m2!1sen!2sin"
              className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-80 group-hover:opacity-100"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
