'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const validateField = (name: string, value: string) => {
    let error = ''

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address'
        }
        break

      case 'password':
        if (!value.trim()) {
          error = 'Password is required'
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters'
        }
        break

      default:
        break
    }

    return error
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const validateForm = () => {
    const newErrors = {
      email: validateField('email', email),
      password: validateField('password', password),
    }

    setErrors(newErrors)
    setTouched({
      email: true,
      password: true,
    })

    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        description: "Check the fields highlighted in red.",
      });
      return
    }

    setIsLoading(true)

    const success = login(email, password)
    if (success) {
      toast.success('Login successful!')
      router.push('/admin')
    } else {
      toast.error('Invalid credentials')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`bg-gray-200 ${
                  errors.email && touched.email
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
                placeholder="admin@gospelplug.com"
              />
              {errors.email && touched.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`bg-gray-200 ${
                  errors.password && touched.password
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
                placeholder="Enter your password"
              />
              {errors.password && touched.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}