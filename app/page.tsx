'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Link from 'next/link'
import {   events } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import { ArrowRight, Book, Users, Heart, Calendar, BookOpenText } from 'lucide-react'
import { useQuery } from "@tanstack/react-query";
import {useState,useEffect} from 'react'


export default function Home() {

  const { data: sermonsData, isLoading: sermonsLoading, error: sermonsError } = useQuery<any[]>({
    queryKey: ['sermons','all'],
  })
  const { data: testimonyData, isLoading: testimonyLoading, error: testimonyError } = useQuery<any[]>({
    queryKey: ['testimony','all'],
  })
  const { data: quotesData, isLoading: quotesLoading, error: quotesError } = useQuery<any[]>({
    queryKey: ['quotes','all'],
  })
  const [sermons, setSermons] = useState<any[]>([]);
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  // const [events, setEvents] = useState([]);

   
  useEffect(() => {
    document.title = "Gospel Ministry - Spreading God's Word and Empowering Lives";
if(sermonsData) setSermons(sermonsData);
    if (testimonyData) { setTestimonies(testimonyData) }
if(quotesData) setQuotes(quotesData);
   }, [sermonsData, testimonyData, quotesData]);
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero Section with Video Background */}
        <section className="relative h-screen md:h-150 overflow-hidden flex items-center justify-center">
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-screen  object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          
          {/* Dark Overlay */}s
          <div className="absolute inset-0 bg-black/45 z-10" />
          
          {/* Hero Content */}
          <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 text-balance">
              Welcome to Our Gospel Ministry
            </h1>
            <p className="text-lg md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed">
              Spreading God's word, building community, and empowering lives through faith, service, and spiritual growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/resources"
                className="px-8 py-3 bg-secondary text-foreground rounded-md hover:bg-secondary/90 transition-all font-bold flex items-center justify-center gap-2"
              >
                Explore Resources
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/testimonies"
                className="px-8 py-3 border-2 border-white text-white rounded-md hover:bg-white hover:text-primary transition-all font-bold"
              >
                View Testimonies
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-primary mb-12">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Book, title: 'Sermons', desc: 'Inspiring teachings from Scripture' },
                { icon: Heart, title: 'Testimonies', desc: 'Real stories of faith and transformation' },
                { icon: Users, title: 'Community', desc: 'Connect with believers like you' },
                { icon: BookOpenText, title: 'Quotes', desc: 'Inspirational messages from Scripture' },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Sermons */}
        {  sermons.length > 0 && (
           <section className="py-16 md:py-24 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Latest Sermons</h2>
              <Link href="/resources" className="text-primary hover:underline font-medium">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sermons.slice(0, 3).map((sermon) => (
                <div key={sermon._id} className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-foreground mb-2">{sermon.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">by {sermon.speaker}</p>
                  <p className="text-sm text-foreground mb-4">{sermon.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{sermon.scripture}</span>
                    <span>{sermon.duration}</span>
                  </div>
                  <div className="inline-flex w-full items-center justify-end gap-2 text-primary hover:gap-4 transition-all font-medium mt-4">
                     <Link href={`/resources/${sermon._id}`} className="inline-flex  items-center gap-2 text-primary hover:gap-4 transition-all font-medium mt-4">
                    Listen Now <ArrowRight size={16} />
                  </Link>
                 </div>
                </div>
              ))}
            </div>
          </div>
        </section>
       )}

        {/* Daily Quote */}
        {  quotes.length > 0 && (<section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-lg p-8 md:p-12 border border-border">
              <h2 className="text-2xl font-serif font-bold text-primary text-center mb-6">
                Gospel Quote of the Day
              </h2>
              <blockquote className="text-center mb-6">
                <p className="text-lg md:text-xl text-foreground mb-4 leading-relaxed">
                  "{quotes[0]?.quote}"
                </p>
                <footer className="text-muted-foreground">— {quotes[0]?.scripture}</footer>
              </blockquote>
            </div>
          </div>
        </section>)
        }

          {/* Testimonies */}
        {  testimonies.length > 0 && (
        <section className="py-16 md:py-24 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Testimony Hub </h2>
              <Link href="/testimonies" className="text-primary hover:underline font-medium">
                View More
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonies.slice(0, 3).map((testimony,i) => (
                <Link href={`/testimonies/${testimony._id}`} key={i} className="bg-white rounded-lg border border-border  hover:shadow-lg transition-shadow">
                  {testimony.image.url && (
                    <img
                      src={testimony.image.url}
                      alt={testimony.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <span className="p-6 block">
                    <h3 className="text-lg font-bold text-foreground mb-2">{testimony.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{testimony.name}</p>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3">{testimony.description}</p></span>
                  <Link href={`/testimonies/${testimony._id}`} className="inline-flex text-right p-2  items-center gap-2 text-primary hover:gap-4 transition-all font-medium mt-4">
                    See Details<ArrowRight size={16} />
                  </Link>
                </Link >
              ))}
            </div>
          </div>
        </section>
        )}

         

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-linear-to-r from-primary to-accent text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-lg mb-8">
              Be part of a loving community that supports and encourages one another in faith.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-primary-foreground text-primary rounded-md hover:shadow-lg transition-shadow font-medium"
            >
              Get Connected
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
