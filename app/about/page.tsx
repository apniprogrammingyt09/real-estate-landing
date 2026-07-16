import Image from "next/image"
import { CheckCircle2, Users, Award, Star, TrendingUp, Clock, Phone, Sparkles, Building2, Globe, Heart, ArrowUpRight } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-[#ececee] selection:text-emerald-900">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-[60px] overflow-hidden">
        <div className="absolute inset-0 bg-[#f4f4f5] dark:bg-emerald-950/10 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-transparent dark:bg-[#f4f4f5]0/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-custom relative">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="flex items-center justify-center gap-2 text-[#09090b] dark:text-[#52525b] font-bold text-[10px] uppercase tracking-[0.2em]">
              <Globe className="w-4 h-4" />
              Elite Real Estate Group
            </div>
            <h1 className="text-7xl md:text-9xl font-sans text-gray-900 dark:text-white leading-[0.85] tracking-tighter">
              Redefining the <br/> luxury experience.
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
              We are a collective of visionaries, dedicated to curating the world&apos;s most extraordinary living spaces since 2010.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story / Philosophy */}
      <section className="py-[60px]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden border border-[#ececee] shadow-none group">
              <Image
                src="https://images.unsplash.com/photo-1600607687960-ce8746a66263?auto=format&fit=crop&q=80&w=1974"
                alt="Architecture meeting"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-md rounded-[36px] border border-white/20 text-white">
                <p className="text-sm font-medium italic">&quot;Excellence is not an act, but a habit that we practice in every transaction and every relationship.&quot;</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-5xl font-sans tracking-tight leading-tight text-gray-900 dark:text-white">A Decade of Architectural <br/> Mastery & Trust</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Founded on the principles of transparency and uncompromising quality, our journey began with a single vision: to transform the way people discover and acquire their primary homes.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#f4f4f5] dark:bg-[#f4f4f5]0/10 flex items-center justify-center text-[#09090b]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">The Elite Standard</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">We don&apos;t just list properties; we verify them through a rigorous 150-point quality assessment.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#f4f4f5] dark:bg-[#f4f4f5]0/10 flex items-center justify-center text-[#09090b]">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Client Collective</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Join a community of 10,000+ satisfied homeowners who have found their future through us.</p>
                </div>
              </div>

              <Button className="rounded-full h-16 px-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform">
                Read Our Full Story <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-[60px] bg-[#f4f4f5] dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-24">
            <h2 className="text-4xl md:text-6xl font-sans tracking-tight">Our Core Ethos</h2>
            <p className="text-gray-500 font-medium leading-relaxed">These pillars guide our daily operations and long-term strategy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card text-card-foreground p-12 rounded-[36px] border border-[#ececee] dark:border-gray-800 border border-[#ececee] shadow-none hover:border border-[#ececee] shadow-none hover:-translate-y-2 transition-all duration-500 group text-center">
              <div className="w-16 h-16 bg-[#f4f4f5] dark:bg-[#f4f4f5]0/10 rounded-[14px] flex items-center justify-center mx-auto mb-8 text-[#09090b] group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-sans tracking-tight mb-4">Integrity First</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">Transparency is the bedrock of our business. We provide honest insights, even when they aren&apos;t convenient.</p>
            </div>

            <div className="bg-card text-card-foreground p-12 rounded-[36px] border border-[#ececee] dark:border-gray-800 border border-[#ececee] shadow-none hover:border border-[#ececee] shadow-none hover:-translate-y-2 transition-all duration-500 group text-center">
              <div className="w-16 h-16 bg-[#f4f4f5] dark:bg-[#f4f4f5]0/10 rounded-[14px] flex items-center justify-center mx-auto mb-8 text-[#09090b] group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-sans tracking-tight mb-4">Mastery</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">Our agents are world-class specialists with deep knowledge of luxury market trends and architectural heritage.</p>
            </div>

            <div className="bg-card text-card-foreground p-12 rounded-[36px] border border-[#ececee] dark:border-gray-800 border border-[#ececee] shadow-none hover:border border-[#ececee] shadow-none hover:-translate-y-2 transition-all duration-500 group text-center">
              <div className="w-16 h-16 bg-[#ececee] dark:bg-[#ececee] rounded-[14px] flex items-center justify-center mx-auto mb-8 text-[#09090b] group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-sans tracking-tight mb-4">Innovation</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">We leverage AI and immersive virtual reality to bring properties to life before you even step foot in them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-[60px] bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 text-center">
            <div className="space-y-2">
              <div className="text-6xl md:text-8xl font-sans tracking-tighter text-white">13+</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Years Active</div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl md:text-8xl font-sans tracking-tighter text-white">5k+</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Homes Sold</div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl md:text-8xl font-sans tracking-tighter text-white">24/7</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Support Availability</div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl md:text-8xl font-sans tracking-tighter text-white">10k+</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-[60px] text-center">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-8xl font-sans tracking-tighter leading-[0.9]">Start your legacy today.</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Discover why the world&apos;s most discerning homeowners choose the Elite Group for their real estate journey.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/listings">
                <Button className="h-20 px-16 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                  Browse Collection
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-20 px-16 rounded-full border-2 border-[#ececee] dark:border-gray-800 font-bold text-sm uppercase tracking-widest hover:bg-[#f4f4f5] dark:hover:bg-gray-900 transition-all">
                  Join the Team
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
