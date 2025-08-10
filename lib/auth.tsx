"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "agent"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string, role: "admin" | "agent") => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("auth_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, role: "admin" | "agent"): Promise<boolean> => {
    try {
      const endpoint = role === "admin" ? "/api/admin/login" : "/api/agents/login"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        const user = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || role,
          avatar: userData.avatar,
        }

        setUser(user)
        setIsAuthenticated(true)
        localStorage.setItem("auth_user", JSON.stringify(user))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("auth_user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function for admin check
export const isAdmin = (user?: User | null) => {
  return user?.role === "admin"
}

// Helper function for agent check
export const isAgent = (user?: User | null) => {
  return user?.role === "agent"
}

// Auth options for NextAuth (if needed for future integration)
export const authOptions = {
  providers: [],
  callbacks: {
    async session({ session, token }: any) {
      return session
    },
    async jwt({ token, user }: any) {
      return token
    },
  },
}
