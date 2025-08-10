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
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: "Property Sales",
      description:
        "Expert guidance through the entire buying and selling process with market insights and negotiation expertise.",
      features: ["Market Analysis", "Property Valuation", "Negotiation Support", "Legal Assistance"],
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Key,
      title: "Property Rentals",
      description: "Comprehensive rental services for landlords and tenants with full property management support.",
      features: ["Tenant Screening", "Rent Collection", "Property Maintenance", "Legal Compliance"],
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: TrendingUp,
      title: "Investment Consulting",
      description: "Strategic real estate investment advice to maximize your portfolio returns and minimize risks.",
      features: ["ROI Analysis", "Market Trends", "Portfolio Diversification", "Risk Assessment"],
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Calculator,
      title: "Property Valuation",
      description: "Accurate property assessments using advanced analytics and local market expertise.",
      features: ["Comparative Analysis", "Market Reports", "Investment Potential", "Future Projections"],
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: FileText,
      title: "Legal Documentation",
      description: "Complete legal support for all property transactions with experienced real estate attorneys.",
      features: ["Contract Review", "Title Search", "Closing Support", "Legal Compliance"],
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Users,
      title: "Property Management",
      description: "Full-service property management for residential and commercial properties.",
      features: ["Maintenance Coordination", "Tenant Relations", "Financial Reporting", "Emergency Response"],
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "We start with a comprehensive consultation to understand your specific needs and goals.",
    },
    {
      step: "02",
      title: "Market Analysis",
      description: "Our experts conduct thorough market research and analysis to provide you with accurate insights.",
    },
    {
      step: "03",
      title: "Strategy Development",
      description: "We develop a customized strategy tailored to your requirements and market conditions.",
    },
    {
      step: "04",
      title: "Implementation",
      description: "Our team executes the plan with precision, keeping you informed throughout the process.",
    },
    {
      step: "05",
      title: "Ongoing Support",
      description: "We provide continued support and guidance even after the transaction is complete.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white section-padding">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Real Estate Services</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Comprehensive real estate solutions designed to meet all your property needs. From buying and selling to
              investment consulting, we're your trusted partner in real estate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/listings">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-blue border-white text-white hover:bg-white hover:text-primary"
                >
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive suite of real estate services is designed to provide you with everything you need for
              successful property transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-base card-hover p-8">
                <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mb-6`}>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle2 className={`h-5 w-5 ${service.color} mr-3`} />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Our Process</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              We follow a proven methodology to ensure the best outcomes for our clients at every step of their real
              estate journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    {step.step}
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-600 -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">Why Choose Our Services?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Expert Knowledge</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our team has deep expertise in local markets and industry trends.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Trusted Service</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We prioritize transparency and integrity in all our dealings.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Personalized Approach</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Every client receives customized solutions tailored to their unique needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://t4.ftcdn.net/jpg/03/54/33/15/360_F_354331596_xakrkhPWRW2cT9o106NEycxmEHDEv8ri.jpg?height=500&width=600"
                alt="Real estate consultation"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Contact us today to discuss your real estate needs and discover how our services can help you achieve your
            goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-secondary hover:bg-gray-100">
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/agents">
              <Button
                variant="outline"
                size="lg"
                className="bg-emerald-600 border-white text-white hover:bg-white hover:text-secondary"
              >
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
