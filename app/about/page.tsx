import Image from "next/image"
import { CheckCircle2, Users, Award, Star, TrendingUp, Clock, Phone } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white section-padding">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-lg text-blue-100 mb-8">
              We're dedicated to helping you find the perfect property that meets all your needs
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Founded in 2010, our real estate company has grown from a small local agency to a trusted name in the
                property market. With over a decade of experience, we've helped thousands of clients find their dream
                homes and make smart property investments.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our journey began with a simple mission: to make the process of buying, selling, and renting properties
                as seamless and stress-free as possible. Today, we continue to uphold this mission while expanding our
                services and embracing innovative technologies to better serve our clients.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                What sets us apart is our deep understanding of the local market, our commitment to personalized
                service, and our unwavering dedication to client satisfaction. We believe that finding the right
                property is about more than just location and price—it's about finding a place where you can build your
                future.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://media.istockphoto.com/id/899471458/photo/purchase-agreement-for-new-house.jpg?s=612x612&w=0&k=20&c=S97ewd-sqqOYk3kX5Wg-1FWJBndPW9AgI0VBHmDHMeA="
                alt="Our office building"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These core principles guide everything we do and help us deliver exceptional service to our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-base card-hover p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Client-Centered</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We put our clients' needs first, listening carefully to their requirements and working tirelessly to
                exceed their expectations.
              </p>
            </div>

            <div className="card-base card-hover p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We strive for excellence in every aspect of our business, from the properties we list to the service we
                provide.
              </p>
            </div>

            <div className="card-base card-hover p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Integrity</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We conduct our business with honesty, transparency, and ethical practices, building trust with our
                clients and partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the advantages of working with our experienced real estate team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Expert Local Knowledge</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our team has in-depth knowledge of the local property market, including pricing trends, neighborhood
                  insights, and future development plans.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Personalized Service</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We take the time to understand your unique needs and preferences, providing tailored solutions that
                  match your requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Extensive Network</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our connections with developers, property owners, and industry professionals give you access to a wide
                  range of opportunities, including off-market properties.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Innovative Technology</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We leverage cutting-edge technology to streamline the property search process, offering virtual tours,
                  detailed property information, and seamless communication.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Transparent Process</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We believe in complete transparency throughout the buying, selling, or renting process, keeping you
                  informed at every step.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">After-Sale Support</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our relationship doesn't end when the deal is closed. We provide ongoing support and advice to ensure
                  your continued satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Achievements */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Achievements</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A track record of success in the real estate industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="card-base card-hover p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Properties Sold</p>
            </div>

            <div className="card-base card-hover p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10,000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Happy Clients</p>
            </div>

            <div className="card-base card-hover p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">15+</h3>
              <p className="text-gray-600 dark:text-gray-400">Industry Awards</p>
            </div>

            <div className="card-base card-hover p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">13+</h3>
              <p className="text-gray-600 dark:text-gray-400">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>
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
