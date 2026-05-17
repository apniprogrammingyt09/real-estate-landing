"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Key,
  TrendingUp,
  Calculator,
  FileText,
  Users,
  Shield,
  CheckCircle2,
  ArrowRight,
  Star,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  ArrowUpRight
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: "Strategic Acquisitions",
      description:
        "Expert guidance through the elite buying process with deep market insights and exclusive off-market access.",
      features: ["Premium Valuation", "Priority Viewings", "Negotiation Mastery", "Legal Concierge"],
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      icon: Key,
      title: "Portfolio Management",
      description: "Full-spectrum management for luxury assets, ensuring maximum yield and meticulous property care.",
      features: ["Vetted Tenants", "Predictive Maintenance", "Financial Mastery", "24/7 Support"],
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      icon: TrendingUp,
      title: "Investment Analytics",
      description: "Data-driven consulting to optimize your real estate portfolio across global markets and asset classes.",
      features: ["ROI Projection", "Risk Mitigation", "Tax Optimization", "Future-proofing"],
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      icon: Calculator,
      title: "Market Intelligence",
      description: "Precision property assessments using advanced AI analytics and hyper-local historical data.",
      features: ["Competitive Audits", "Historical Trends", "Growth Analysis", "Certified Reports"],
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      icon: FileText,
      title: "Legal & Compliance",
      description: "Seamless documentation handling with world-class real estate attorneys and compliance experts.",
      features: ["Contract Architecture", "Title Insurance", "Cross-border Support", "Audit Defense"],
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      icon: ShieldCheck,
      title: "Asset Protection",
      description: "Ensuring your real estate legacy through strategic insurance and security architecture.",
      features: ["Luxury Insurance", "Security Audits", "Privacy Shields", "Wealth Integration"],
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
  ]

  const steps = [
    {
      step: "01",
      title: "Strategic Discovery",
      description: "A deep dive into your lifestyle goals and investment parameters.",
    },
    {
      step: "02",
      title: "Market Sourcing",
      description: "Global search across public and exclusive private inventories.",
    },
    {
      step: "03",
      title: "Vetting & Validation",
      description: "Rigorous quality audits and financial stress-testing of targets.",
    },
    {
      step: "04",
      title: "Elite Execution",
      description: "Masterful negotiation and seamless legal closure of the deal.",
    },
    {
      step: "05",
      title: "Legacy Management",
      description: "Ongoing support and portfolio optimization for generations.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/10 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom relative">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              <Zap className="w-4 h-4" />
              Elite Service Suite
            </div>
            <h1 className="text-7xl md:text-9xl font-serif text-gray-900 dark:text-white leading-[0.85] tracking-tighter">
              Bespoke solutions <br/> for every asset.
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
              We provide a full-spectrum of real estate services designed for the world&apos;s most discerning property owners.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/contact">
                <Button className="h-20 px-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                  Inquire Now
                </Button>
              </Link>
              <Link href="/listings">
                <Button variant="outline" className="h-20 px-12 rounded-full border-2 border-gray-100 dark:border-gray-800 font-bold text-sm uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
                  View Listings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div key={index} className="group p-12 bg-card text-card-foreground rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 space-y-8">
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform", service.bgColor)}>
                  <service.icon className={cn("h-10 w-10", service.color)} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif tracking-tight">{service.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-sm">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-3 pt-6 border-t border-gray-50 dark:border-gray-800">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact Process */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mb-24 space-y-6">
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight">The Blueprint of <br/> Our Methodology</h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">A standardized path to exceptional outcomes, refined over a decade.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="space-y-8 group">
                <div className="relative">
                  <div className="text-8xl font-serif text-white/5 tracking-tighter transition-colors group-hover:text-emerald-500/20">{step.step}</div>
                  <div className="absolute bottom-4 left-0 w-12 h-1 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Service Spotlight */}
      <section className="py-32 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center bg-gray-50 dark:bg-gray-900 rounded-[4rem] p-12 md:p-24 border border-gray-100 dark:border-gray-800 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="space-y-12 relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                  <Star className="w-3 h-3 fill-current" /> Premium Exclusive
                </div>
                <h2 className="text-5xl font-serif tracking-tighter leading-tight">Virtual Reality <br/> Immersive Tours</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Experience properties in hyper-realistic detail from anywhere in the world. Our in-house tech team builds custom VR environments for every elite listing.
                </p>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["8K Resolution", "AI Enhancements", "Global Access", "Expert Narration"].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest text-gray-400">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="h-16 px-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform">
                Experience Demo <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=1978"
                alt="VR Real Estate"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 text-center bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-8xl font-serif tracking-tighter leading-[0.9]">Elevate your property strategy.</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Discover why institutional investors and private collectors trust our world-class real estate services.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/contact">
                <Button className="h-20 px-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all hover:scale-105">
                  Start Consultation
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="h-20 px-16 rounded-full border-2 border-gray-100 dark:border-gray-800 font-bold text-sm uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
                  Meet the Team
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
