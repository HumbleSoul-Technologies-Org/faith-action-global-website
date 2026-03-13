'use client'

import { useState,useEffect } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { set } from 'react-hook-form'
import { apiRequest } from '@/lib/query-client'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
     await apiRequest('POST','/messages/contact', formData)
    
   } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
   } finally {
    setSubmitting(false)
    setSubmitted(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
   }
  }

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' })}, [])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-linear-to-b from-primary/10 to-transparent py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We'd love to hear from you. Reach out with any questions or to learn more about our community.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                {
                  icon: Phone,
                  title: 'Phone',
                  info: '(555) 123-4567',
                  detail: 'Mon-Fri, 9am-5pm',
                },
                {
                  icon: Mail,
                  title: 'Email',
                  info: 'hello@gospel.org',
                  detail: 'We respond within 24 hours',
                },
                {
                  icon: MapPin,
                  title: 'Location',
                  info: '123 Faith Street',
                  detail: 'Hope City, ST 12345',
                },
                {
                  icon: Clock,
                  title: 'Service Times',
                  info: 'Sunday 10am & 6pm',
                  detail: 'Wednesday 7pm Bible Study',
                },
              ].map((contact) => (
                <div
                  key={contact.title}
                  className="bg-card rounded-lg border border-border p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <contact.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{contact.title}</h3>
                  <p className="text-primary font-semibold text-sm mb-1">{contact.info}</p>
                  <p className="text-xs text-muted-foreground">{contact.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-12 md:py-16 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>
                 <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                   
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="7xx-xxx-xxxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="volunteer">Volunteer Opportunity</option>
                      <option value="prayer">Prayer Request</option>
                      <option value="membership">Membership</option>
                      <option value="event">Event Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Share your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all font-medium ${submitting ? 'cursor-not-allowed opacity-70' : ''}`}
                    disabled={submitting}
                  >
                    {submitting ? <span className='flex items-center justify-center gap-2'>Sending Message... <Send className='w-4 h-4 animate-bounce' /></span> : 'Send Message'}
                  </button>

                  {submitted && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                      Thank you! Your message has been sent. We'll be in touch soon.
                    </div>
                  )}
                </form>
              </div>

              {/* Google Map */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">Visit Us</h2>
                <div className="bg-white rounded-lg border border-border overflow-hidden h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345092476!2d-122.41941562346822!3d37.77492957120327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808581e0f5555555%3A0x1234567890abcdef!2s123%20Faith%20Street%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1707123456789"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Gospel Ministry Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What are your service times?',
                  a: 'We hold services on Sundays at 10:00 AM and 6:00 PM. We also have a Bible study on Wednesday evenings at 7:00 PM.',
                },
                {
                  q: 'Are newcomers welcome?',
                  a: 'Absolutely! We welcome everyone. Our community is open and inclusive, and we\'d love to have you join us.',
                },
                {
                  q: 'How can I get involved with the ministry?',
                  a: 'There are many ways to get involved! Contact us to learn about volunteer opportunities, prayer groups, and community service projects.',
                },
                {
                  q: 'Do you have a children\'s program?',
                  a: 'Yes! We offer children\'s ministry during our services. Feel free to reach out with any questions about our programs.',
                },
              ].map((faq, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
