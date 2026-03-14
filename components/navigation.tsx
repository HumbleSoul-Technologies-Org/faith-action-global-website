'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn } = useAuth()
  const pathname = usePathname() ?? '/'

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/resources', label: 'Resources' },
    { href: '/testimonies', label: 'Testimonies' },
    // { href: '/empowerment', label: 'Empowerment' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-2xl flex items-center  font-serif font-bold text-primary">
            <img src="/logo.png" alt="Faith Action Global" className="w-15 h-10 sm:h-20 sm:w-30 sm:-mr-5" />Faith Action Global
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/')

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-primary hover:text-primary/80 transition-colors font-medium ${
                    isActive ? 'text-primary/80' : ''
                  } ${isActive ? 'border-b-2 border-amber-300' : ''}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Dashboard/Login Link */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-opacity-90 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-primary-foreground hidden rounded-md hover:bg-opacity-90 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-border pt-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/')

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-foreground hover:text-primary transition-colors font-medium ${
                    isActive ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-opacity-90 transition-all text-center"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-opacity-90 transition-all text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
