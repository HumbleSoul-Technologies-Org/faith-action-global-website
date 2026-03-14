'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  username: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('authState')
    if (storedAuth) {
      try {
        const { isLoggedIn: logged, username: user } = JSON.parse(storedAuth)
        setIsLoggedIn(logged)
        setUsername(user)
      } catch (error) {
        console.error('Failed to load auth state:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

    if (email === validEmail && password === validPassword) {
      setIsLoggedIn(true)
      setUsername(email)
      // Persist to localStorage
      localStorage.setItem(
        'authState',
        JSON.stringify({
          isLoggedIn: true,
          username: email,
        })
      )
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUsername(null)
    // Clear from localStorage
    localStorage.removeItem('authState')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
