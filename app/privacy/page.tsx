import Header from "@/components/header"
import Footer from "@/components/footer"
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative gradient-primary text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal
              information.
            </p>
            <p className="text-emerald-200 mt-4">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {/* Information We Collect */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
                </div>

                <div className="space-y-6 text-gray-600 dark:text-gray-400">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
                    <p className="mb-4">We collect information you provide directly to us, including:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Name, email address, and phone number</li>
                      <li>Property preferences and search criteria</li>
                      <li>Financial information for pre-qualification (when applicable)</li>
                      <li>Communication preferences and feedback</li>
                      <li>Property listing information (for sellers)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Automatically Collected Information
                    </h3>
                    <p className="mb-4">When you use our website, we automatically collect:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>IP address and device information</li>
                      <li>Browser type and operating system</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Referring website and search terms</li>
                      <li>Location data (with your permission)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
                </div>

                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide and improve our real estate services</li>
                    <li>Match you with suitable properties and agents</li>
                    <li>Communicate about properties, market updates, and services</li>
                    <li>Process transactions and maintain records</li>
                    <li>Personalize your experience on our website</li>
                    <li>Analyze website usage and improve functionality</li>
                    <li>Comply with legal obligations and protect our rights</li>
                    <li>Send marketing communications (with your consent)</li>
                  </ul>
                </div>
              </div>

              {/* Information Sharing */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information Sharing</h2>
                </div>

                <div className="space-y-6 text-gray-600 dark:text-gray-400">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      We may share your information with:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Real Estate Agents:</strong> To facilitate property transactions and provide services
                      </li>
                      <li>
                        <strong>Service Providers:</strong> Third-party companies that help us operate our business
                        (e.g., payment processors, email services)
                      </li>
                      <li>
                        <strong>Legal Authorities:</strong> When required by law or to protect our rights and safety
                      </li>
                      <li>
                        <strong>Business Partners:</strong> With your consent, for joint marketing or service offerings
                      </li>
                      <li>
                        <strong>Successors:</strong> In the event of a merger, acquisition, or sale of our business
                      </li>
                    </ul>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">We do not:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Sell your personal information to third parties</li>
                      <li>Share your information for others' marketing without consent</li>
                      <li>Use your information for purposes other than those disclosed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
                </div>

                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p className="mt-4">
                    While we strive to protect your information, no method of transmission over the internet is 100%
                    secure. We cannot guarantee absolute security but are committed to protecting your data using
                    industry-standard practices.
                  </p>
                </div>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Rights and Choices</h2>
                </div>

                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Access:</strong> Request a copy of the personal information we have about you
                    </li>
                    <li>
                      <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of your personal information (subject to legal
                      requirements)
                    </li>
                    <li>
                      <strong>Portability:</strong> Request transfer of your information to another service
                    </li>
                    <li>
                      <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time
                    </li>
                    <li>
                      <strong>Restriction:</strong> Request limitation on how we use your information
                    </li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, please contact us using the information provided below. We will respond to
                    your request within 30 days.
                  </p>
                </div>
              </div>

              {/* Cookies and Tracking */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Cookies and Tracking Technologies
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and advertisements</li>
                    <li>Improve website functionality and user experience</li>
                  </ul>
                  <p className="mt-4">
                    You can control cookies through your browser settings. However, disabling cookies may affect the
                    functionality of our website.
                  </p>
                </div>
              </div>

              {/* Third-Party Links */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Third-Party Links</h2>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>
                    Our website may contain links to third-party websites. We are not responsible for the privacy
                    practices or content of these external sites. We encourage you to review the privacy policies of any
                    third-party websites you visit.
                  </p>
                </div>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Children's Privacy</h2>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>
                    Our services are not intended for children under 13 years of age. We do not knowingly collect
                    personal information from children under 13. If we become aware that we have collected such
                    information, we will take steps to delete it promptly.
                  </p>
                </div>
              </div>

              {/* Changes to Policy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Changes to This Policy</h2>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>
                    We may update this privacy policy from time to time. We will notify you of any material changes by
                    posting the new policy on our website and updating the "Last updated" date. Your continued use of
                    our services after such changes constitutes acceptance of the updated policy.
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
                  <p className="mb-4">
                    If you have any questions about this privacy policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p>
                      <strong>Email:</strong> privacy@realestate.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                    <p>
                      <strong>Address:</strong> 132 Dartmouth Street, Boston, MA 02156
                    </p>
                  </div>
                  <p className="mt-4">We are committed to resolving any privacy concerns you may have.</p>
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
