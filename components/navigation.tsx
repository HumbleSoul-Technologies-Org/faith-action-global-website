'use client'

import Link from 'next/link'
import { useState ,useEffect} from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useQuery } from '@tanstack/react-query'
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

  const { data: sermonData } = useQuery<any[]>({
    queryKey: ['sermons', 'all'],
  })
  const { data: quoteData } = useQuery<any[]>({
    queryKey: ['quotes', 'all'],
  })
  const { data: devotionalsData } = useQuery<any[]>({
    queryKey: ['devotionals', 'all'],
  })
  const { data: testimonyData } = useQuery<any[]>({
    queryKey: ['testimony', 'all'],
  })

  const [sermons, setSermons] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [devotionals, setDevotionals] = useState<any[]>([])
  const [testimonies, setTestimonies] = useState<any[]>([])

  useEffect(() => { 
    if (sermonData) {
       setSermons(sermonData)
    }
    if (quoteData) {
       setQuotes(quoteData)
    }
    if (devotionalsData) {
       setDevotionals(devotionalsData)
    }
    if (testimonyData) {
       setTestimonies(testimonyData)
      
    }
  }, [sermonData, quoteData, devotionalsData, testimonyData])
  

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-2xl flex items-center  font-serif font-bold text-primary">
            <img src="/logo.png" alt="Faith Action Global" className="w-15 h-10 sm:h-15 sm:w-21 sm:-mr-2" />Faith Action Global
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
            className="md:hidden relative text-foreground"
            aria-label="Toggle menu"
          >
            
            {isOpen ? <X size={24} /> : <><span className='w-3 h-3 animate-pulse absolute -top-1 -right-1 rounded-full bg-primary'/><Menu size={24} /></>}
            
            
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
                  {link.label === 'Resources' && ` (${sermons.length + quotes.length + devotionals.length})`}
                  {link.label === 'Testimonies' && ` (${testimonies.length})`}
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
