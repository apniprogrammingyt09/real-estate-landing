import Header from "@/components/header"
import Footer from "@/components/footer"
import { FileText, Scale, Shield, AlertTriangle, Users, Mail } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Please read these terms carefully before using our real estate services and website.
            </p>
            <p className="text-blue-200 mt-4">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {/* Acceptance of Terms */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acceptance of Terms</h2>
                </div>

                <div className="text-gray-600 dark:text-gray-400 space-y-4">
                  <p>
                    By accessing and using this website and our real estate services, you accept and agree to be bound
                    by the terms and provision of this agreement. If you do not agree to abide by the above, please do
                    not use this service.
                  </p>
                  <p>
                    These Terms of Service ("Terms") govern your use of our website located at realestate.com (the
                    "Service") operated by RealEstate ("us", "we", or "our").
                  </p>
                </div>
              </div>

              {/* Use of Services */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Use of Our Services</h2>
                </div>

                <div className="space-y-6 text-gray-600 dark:text-gray-400">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Permitted Use</h3>
                    <p className="mb-4">You may use our services for:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Searching for and viewing property listings</li>
                      <li>Contacting real estate agents and property owners</li>
                      <li>Listing properties for sale or rent (with proper authorization)</li>
                      <li>Accessing market information and resources</li>
                      <li>Using our tools and calculators for informational purposes</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Prohibited Use</h3>
                    <p className="mb-4">You agree not to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Use the service for any unlawful purpose or to solicit unlawful activity</li>
                      <li>Post false, inaccurate, misleading, or fraudulent information</li>
                      <li>Impersonate any person or entity or misrepresent your affiliation</li>
                      <li>Interfere with or disrupt the service or servers</li>
                      <li>Attempt to gain unauthorized access to any portion of the website</li>
                      <li>Use automated systems to access the service without permission</li>
                      <li>Harvest or collect user information without consent</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Property Listings */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Property Listings and Information
                  </h2>
                </div>

                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Accuracy of Information
                    </h3>
                    <p>
                      While we strive to provide accurate and up-to-date property information, we cannot guarantee the
                      accuracy, completeness, or timeliness of all listings. Property information is provided by third
                      parties and may contain errors or omissions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Listing Responsibilities
                    </h3>
                    <p className="mb-4">If you list a property on our platform, you represent and warrant that:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>You have the legal right to list the property</li>
                      <li>All information provided is accurate and complete</li>
                      <li>You will promptly update or remove listings when necessary</li>
                      <li>You comply with all applicable fair housing laws</li>
                      <li>You have proper authorization to use any photos or content</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* User Accounts */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Accounts</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    When you create an account with us, you must provide information that is accurate, complete, and
                    current at all times. You are responsible for safeguarding the password and for all activities that
                    occur under your account.
                  </p>
                  <p>
                    You agree not to disclose your password to any third party and to take sole responsibility for
                    activities and actions under your password, whether or not you have authorized such activities or
                    actions.
                  </p>
                  <p>
                    You must immediately notify us of any unauthorized use of your account or any other breach of
                    security.
                  </p>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Intellectual Property Rights</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive
                    property of RealEstate and its licensors. The Service is protected by copyright, trademark, and
                    other laws.
                  </p>
                  <p>
                    Our trademarks and trade dress may not be used in connection with any product or service without our
                    prior written consent.
                  </p>
                  <p>
                    You retain ownership of any content you submit to our platform, but you grant us a license to use,
                    display, and distribute such content in connection with our services.
                  </p>
                </div>
              </div>

              {/* Disclaimers */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Disclaimers and Limitations</h2>
                </div>

                <div className="space-y-6 text-gray-600 dark:text-gray-400">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Important Notice</h3>
                    <p>
                      The information on this website is provided on an "as is" basis. To the fullest extent permitted
                      by law, this Company excludes all representations, warranties, conditions and terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Service Availability</h3>
                    <p>
                      We do not guarantee that our service will be available at all times. We may experience hardware,
                      software, or other problems or need to perform maintenance related to the service, resulting in
                      interruptions, delays, or errors.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Third-Party Services</h3>
                    <p>
                      Our service may contain links to third-party websites or services that are not owned or controlled
                      by us. We have no control over and assume no responsibility for the content, privacy policies, or
                      practices of any third-party websites or services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Limitation of Liability</h2>
                <div className="text-gray-600 dark:text-gray-400 space-y-4">
                  <p>
                    In no event shall RealEstate, nor its directors, employees, partners, agents, suppliers, or
                    affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages,
                    including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                    resulting from your use of the Service.
                  </p>
                  <p>
                    Our total liability to you for any damages arising from or related to this agreement shall not
                    exceed the amount you have paid us in the twelve (12) months preceding the claim.
                  </p>
                </div>
              </div>

              {/* Indemnification */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Indemnification</h2>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>
                    You agree to defend, indemnify, and hold harmless RealEstate and its licensee and licensors, and
                    their employees, contractors, agents, officers and directors, from and against any and all claims,
                    damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to
                    attorney's fees).
                  </p>
                </div>
              </div>

              {/* Termination */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Termination</h2>
                <div className="text-gray-600 dark:text-gray-400 space-y-4">
                  <p>
                    We may terminate or suspend your account and bar access to the Service immediately, without prior
                    notice or liability, under our sole discretion, for any reason whatsoever and without limitation,
                    including but not limited to a breach of the Terms.
                  </p>
                  <p>
                    If you wish to terminate your account, you may simply discontinue using the Service or contact us to
                    request account deletion.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Governing Law</h2>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>
                    These Terms shall be interpreted and governed by the laws of the State of Massachusetts, without
                    regard to its conflict of law provisions. Our failure to enforce any right or provision of these
                    Terms will not be considered a waiver of those rights.
                  </p>
                </div>
              </div>

              {/* Changes to Terms */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Changes to Terms</h2>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                    revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                    What constitutes a material change will be determined at our sole discretion.
                  </p>
                  <p className="mt-4">
                    By continuing to access or use our Service after any revisions become effective, you agree to be
                    bound by the revised terms.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
                  <div className="space-y-2">
                    <p>
                      <strong>Email:</strong> legal@realestate.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                    <p>
                      <strong>Address:</strong> 132 Dartmouth Street, Boston, MA 02156
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
