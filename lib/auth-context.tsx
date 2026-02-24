'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  username: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded credentials
const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'password123'

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

  const login = (inputUsername: string, inputPassword: string) => {
    if (inputUsername === VALID_USERNAME && inputPassword === VALID_PASSWORD) {
      setIsLoggedIn(true)
      setUsername(inputUsername)
      // Persist to localStorage
      localStorage.setItem(
        'authState',
        JSON.stringify({
          isLoggedIn: true,
          username: inputUsername,
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
