"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft, Zap } from "lucide-react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Trigger glitch effect periodically
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1
            className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 select-none transition-all duration-200 ${
              glitchActive ? "transform skew-x-2 skew-y-1" : ""
            }`}
          >
            404
          </h1>

          {/* Glitch overlay */}
          {glitchActive && (
            <>
              <h1 className="absolute top-0 left-0 text-8xl md:text-9xl font-black text-red-500 opacity-70 transform translate-x-1 -translate-y-1 select-none">
                404
              </h1>
              <h1 className="absolute top-0 left-0 text-8xl md:text-9xl font-black text-cyan-500 opacity-70 transform -translate-x-1 translate-y-1 select-none">
                404
              </h1>
            </>
          )}
        </div>

        {/* Floating Icons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <Home className="w-8 h-8 text-blue-400 opacity-60" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float animation-delay-1000">
            <Search className="w-6 h-6 text-purple-400 opacity-60" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-float animation-delay-2000">
            <Zap className="w-7 h-7 text-yellow-400 opacity-60" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Oops! Page Not Found</h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have vanished into the digital void. Don't worry, even the best
            explorers sometimes take a wrong turn!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button asChild size="lg" className="group">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Back to Home</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/listings" className="flex items-center space-x-2">
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Browse Properties</span>
              </Link>
            </Button>
          </div>

          {/* Go Back Button */}
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="group text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2 mt-12">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}
