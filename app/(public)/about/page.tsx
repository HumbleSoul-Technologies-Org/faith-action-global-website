import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Users, Target, Heart, BookOpen } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              About Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Learn about our mission, vision, and the community we serve.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-card rounded-lg border border-border p-8 md:p-12">
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Mission</h2>
              <p className="text-lg text-foreground leading-relaxed mb-8">
                Our mission is to spread God's word, build a loving and inclusive community, and empower people to live out their faith with purpose and passion. We believe in the transformative power of Scripture, prayer, and genuine fellowship.
              </p>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Vision</h2>
              <p className="text-lg text-foreground leading-relaxed">
                We envision a world where God's love is actively demonstrated through service, compassion, and spiritual growth. We aim to be a beacon of hope that inspires individuals and families to deepen their faith while making a positive impact in their communities.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 md:py-16 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Heart,
                  title: 'Love',
                  desc: 'We show Christ\'s love through compassion and genuine care for one another.',
                },
                {
                  icon: BookOpen,
                  title: 'Scripture',
                  desc: 'We are grounded in biblical truth and committed to studying God\'s word.',
                },
                {
                  icon: Users,
                  title: 'Community',
                  desc: 'We believe in the power of fellowship and supporting one another in faith.',
                },
                {
                  icon: Target,
                  title: 'Purpose',
                  desc: 'We help others discover and live out their God-given purpose and calling.',
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
              Our Leadership
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Pastor James Mitchell',
                  role: 'Senior Pastor',
                  bio: 'With over 20 years of ministry experience, Pastor James leads our congregation with grace and wisdom.',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
                },
                {
                  name: 'Pastor Sarah Johnson',
                  role: 'Associate Pastor',
                  bio: 'Pastor Sarah leads our women\'s ministry and empowerment programs with passionate dedication.',
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
                },
                {
                  name: 'David Chen',
                  role: 'Ministry Coordinator',
                  bio: 'David serves as our ministry coordinator, helping organize events and community outreach programs.',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
                },
              ].map((leader) => (
                <div
                  key={leader.name}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">{leader.name}</h3>
                    <p className="text-sm font-medium text-primary mb-3">{leader.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-12 md:py-16 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                Gospel Ministry was founded with a simple mission: to create a welcoming space where people of all backgrounds can encounter God's love, grow in their faith, and serve their communities with purpose.
              </p>
              <p>
                Over the years, we've grown from a small gathering to a vibrant community of believers. Yet, our core values remain unchanged—we're committed to biblical teaching, authentic community, and practical service that makes a real difference in people's lives.
              </p>
              <p>
                Today, we continue to serve our community through worship, teaching, counseling, community outreach, and empowerment programs. We invite you to join us on this journey of faith, growth, and transformation.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
