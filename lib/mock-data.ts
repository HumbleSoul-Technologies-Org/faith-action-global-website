// Mock Data for Gospel Ministry Website

export interface Sermon {
  id: string
  title: string
  speaker: string
  date: string
  duration: string
  description: string
  passage: string
  audioUrl?: string
  videoId?: string
  videoUrl?: string
  likes?: number
  reactions?: { [key: string]: number }
}

export interface SermonComment {
  id: string
  name: string
  message: string
  date: string
}

export interface Quote {
  id: string
  text: string
  author: string
  passage: string
  views?: number
  likes?: number
  reactions?: { [key: string]: number }
}

export interface Devotional {
  id: string
  title: string
  date: string
  scripture: string
  reflection: string
  prayer: string
  views?: number
  likes?: number
  reactions?: { [key: string]: number }
}

export interface Testimony {
  id: string
  name: string
  title: string
  content: string
  image?: string
  videoUrl?: string
  videoId?: string
  audioUrl?: string
  date?: string
  category?: string
  views?: number
  likes?: number
  reactions?: { [key: string]: number }
}

export interface Article {
  id: string
  title: string
  author: string
  date: string
  category: string
  content: string
  image?: string
  views?: number
  likes?: number
  reactions?: { [key: string]: number }
}

export interface ArticleComment {
  id: string
  name: string
  message: string
  date: string
}

export interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image?: string
  latitude?: number
  longitude?: number
  views?: number
  likes?: number
  reactions?: { [key: string]: number }
}

export interface EventComment {
  id: string
  name: string
  message: string
  date: string
}

export interface Message {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  isRead: boolean
  reply?: {
    repliedOn?: string
    reply?: string
  }
}

export interface Notification {
  id: string
  title: string
  type: 'sys' | 'comment' | 'like' | 'view' | 'message'
  href?: string
  description: string
  date: string
  isSeen: boolean
}

// Sermons
export const sermons: Sermon[] = [
  {
    id: '1',
    title: 'The Power of Faith',
    speaker: 'AP. Joshua Salman',
    date: '2024-02-18',
    duration: '1hr: 32 Mins',
    description: 'An inspiring message about trusting God in difficult times and finding strength through faith.',
    passage: 'Hebrews 11:1',
    videoId: 'hMMl6KqQY_4',
    likes: 87,
    reactions: { heart: 62, amen: 25, inspiring: 0 },
   
  },
  {
    id: '2',
    title: 'Love Your Neighbor',
    speaker: 'Pastor Sarah',
    date: '2024-02-11',
    duration: '38 min',
    description: 'Exploring the greatest commandment and how to show genuine love to those around us.',
    passage: 'Matthew 22:37-40',
    audioUrl: '/audio_sermon.mp3',
    likes: 64,
    reactions: { heart: 48, amen: 16, inspiring: 0 },
  },
  {
    id: '3',
    title: 'Living with Purpose',
    speaker: 'Pastor David',
    date: '2024-02-04',
    duration: '42 min',
    description: 'Finding your calling and living a life aligned with God\'s plan.',
    passage: 'Ephesians 2:10',
    videoUrl: '/sermon.mp4',
    likes: 102,
    reactions: { heart: 75, amen: 27, inspiring: 0 },
  },
]

// Gospel Quotes
export const quotes: Quote[] = [
  {
    id: '1',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    author: 'Bible',
    passage: 'John 3:16',
    views: 234,
    likes: 145,
    reactions: { love: 98, inspire: 47, pray: 0 },
  },
  {
    id: '2',
    text: 'I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.',
    author: 'Bible',
    passage: 'John 16:33',
    views: 189,
    likes: 112,
    reactions: { love: 76, inspire: 36, pray: 0 },
  },
  {
    id: '3',
    text: 'Therefore, as God\'s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.',
    author: 'Bible',
    passage: 'Colossians 3:12',
    views: 267,
    likes: 178,
    reactions: { love: 124, inspire: 54, pray: 0 },
  },
  {
    id: '4',
    text: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?',
    author: 'Bible',
    passage: 'Psalm 27:1',
    views: 156,
    likes: 98,
    reactions: { love: 65, inspire: 33, pray: 0 },
  },
]

// Devotionals (Word of Day)
export const devotionals: Devotional[] = [
  {
    id: '1',
    title: 'Trust in His Timing',
    date: '2024-02-21',
    scripture: 'Proverbs 3:5-6',
    reflection: 'God\'s timing is always perfect, even when we cannot see the path ahead. When we surrender our worries and trust in His plan, we find peace and clarity.',
    prayer: 'Help me to trust in Your perfect timing, Lord. Guide my steps and help me to have faith in Your plan for my life.',
    views: 312,
    likes: 203,
    reactions: { love: 138, inspire: 65, pray: 0 },
  },
  {
    id: '2',
    title: 'Strength in Weakness',
    date: '2024-02-20',
    scripture: '2 Corinthians 12:9',
    reflection: 'Our weaknesses become opportunities for God to demonstrate His strength. When we acknowledge our limitations and turn to Him, we experience true power.',
    prayer: 'Lord, help me to find strength in my weakness. Use my struggles to draw me closer to You.',
    views: 278,
    likes: 167,
    reactions: { love: 112, inspire: 55, pray: 0 },
  },
]

// Testimonies
export const testimonies: Testimony[] = [
  {
    id: '1',
    name: 'Mary Johnson',
    title: 'Found Hope Again',
    content: 'Our marriage was on the brink of collapse and we felt like we were out of options. Through the ministry\'s prayers, counseling, and the support of a caring community, hope gently restored us. We learned to forgive, rebuild trust, and rediscover a shared faith. Today our marriage is stronger, filled with grace, patience, and renewed purpose to serve God together.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    videoId: 'K1deLdDENAI',
    videoUrl: '',
    date: '2024-02-10',
    category: 'Spiritual Renewal',
    views: 342,
    likes: 124,
    reactions: { heart: 89, pray: 35, amen: 0 },
  },
  {
    id: '2',
    name: 'Sylvia Puentes',
    title: 'Transformed by Grace',
    content: `

In this engaging episode, we dive deep into personal story of transformation, faith, and the life-changing power of God's grace. We'll hear from Sylvia Puentes, who shares her journey from darkness to light, from doubt to faith.

Join us as Sylvia recounts her encounter with Jesus and the profound impact it had on her life.

Here are some key highlights to know more about this episode:

    Sylvia shares her powerful testimony of encountering God's presence and experiencing a profound transformation in her life.

    Sylvia opens up about the challenges she faced, including struggles with identity, forgiveness, and the influence of the enemy.

    Despite facing doubts and fears, Sylvia shares how she found solace and strength in her relationship with Jesus.

    Through her journey, Sylvia learned the importance of forgiveness and its liberating power

    Sylvia emphasizes the significance of obedience and surrender in her spiritual journey.

    Sylvia encourages listeners to share the love of God with others, emphasizing the transformative impact of His love on our lives.

 

One moment in His [Jesus'] presence will transform your life, and that's what it did for me. So, when I came out of that encounter, my life was completely different. I was completely different. He healed me from the inside out.  - Sylvia Puentes

Never underestimate the power of sharing the gospel and praying for someone.  - Sylvia Puentes

About the Guest:

Sylvia Puentes, creator & host of Saved by Grace Podcast, is a faith-based coach, mentor, entrepreneur, and mother of two. Despite facing adversity, Sylvia discovered her identity as a child of God with a purpose. Her journey includes founding a successful home healthcare agency in New York and Flourish Coaching, empowering women to embrace their faith and leadership roles. Through her podcast Saved by Grace, Sylvia shares stories of hope, restoration, and God's unwavering love, inspiring listeners from all walks of life.

Connect with Sylvia Puentes at:

Website: https://www.sylviapuentesspeaks.com/

Facebook: https://www.facebook.com/sylvia.puentes.79

Instagram: https://www.instagram.com/sylpuentes/?hl=en

Podcast: https://podcasts.apple.com/us/podcast/saved-by-grace-podcast/id1707939654

Youtube: https://www.youtube.com/@savedbygracepodcast
 `,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    videoId: '',
    audioUrl: '/grace-testimony.mp3',
    date: '2024-02-05',
    category: 'Life Change',
    views: 521,
    likes: 98,
    reactions: { heart: 72, pray: 26, amen: 0 },
  },
  {
    id: '3',
    name: 'Grace Williams',
    title: 'A New Beginning',
    content: 'After years of searching, I finally found my purpose serving others in this community. The empowerment programs have given me confidence to live boldly for Christ. Now I\'m helping others find the same hope and strength I\'ve discovered.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    videoId: '',
    videoUrl: '/hope.mp4',
    date: '2024-01-28',
    category: 'Purpose & Mission',
    views: 428,
    likes: 156,
    reactions: { heart: 110, pray: 46, amen: 0 },
  },
]

// Women Empowerment Articles
export const empowermentArticles: Article[] = [
  {
    id: '1',
    title: 'Finding Strength in Faith',
    author: 'Dr. Rachel Smith',
    date: '2024-02-15',
    category: 'Spiritual Growth',
    content: 'Women in the Bible demonstrate incredible strength and faith. This article explores how we can draw inspiration from their stories to empower ourselves.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiWxHN_Shq5GFkX8U9bRe__mO09rESp0Ifew&s',
    views: 234,
    likes: 156,
    reactions: { heart: 112, inspire: 44, pray: 0 },
  },
  {
    id: '2',
    title: 'Leadership from the Heart',
    author: 'Pastor Amanda',
    date: '2024-02-10',
    category: 'Leadership',
    content: 'Authentic leadership comes from serving others with genuine love and compassion. Learn how to lead with your heart and transform your community.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRItg_yTqB-QlptEZrIWng3wlBLSuZOs9m-Nw&s',
    views: 189,
    likes: 124,
    reactions: { heart: 88, inspire: 36, pray: 0 },
  },
  {
    id: '3',
    title: 'Breaking Free from Fear',
    author: 'Counselor Michelle',
    date: '2024-02-05',
    category: 'Personal Growth',
    content: 'Fear often holds us back from pursuing our God-given gifts. Discover practical strategies to overcome fear and embrace the life God has for you.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvB7lCwVT-ySWiqU3qZshxHjN8pWZOXLdq7w&s',
    views: 267,
    likes: 178,
    reactions: { heart: 128, inspire: 50, pray: 0 },
  },
]

// Events
export const events: Event[] = [
  {
    id: '1',
    title: 'Sunday Service',
    date: '2024-02-25',
    time: '10:00 AM - 11:30 AM',
    location: 'FaithLife Ministreis, Kitetika,Gayaza Rd, Kampala',
    description: 'Join us for our weekly Sunday worship service as we celebrate our faith together.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4NoNVu0xhE8WQqvsItWcNg0-eqwzaHpfddg&s',
    latitude: 37.7749,
    longitude: -122.4194,
    views: 156,
    likes: 89,
    reactions: { heart: 64, inspire: 25, pray: 0 },
  },
  {
    id: '2',
    title: 'Bible Study & Prayer Night',
    date: '2024-02-28',
    time: '7:00 PM - 8:30 PM',
    location: 'Fellowship Room, Tohbani Center,jinja Rd, Kampala',
    description: 'Join us for an intimate gathering to study Scripture and pray together as we grow in our faith.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrL4HPRu3Osbh9KFRkhztpkggBEtjjta0ljA&ss',
    latitude: 37.7849,
    longitude: -122.4094,
    views: 124,
    likes: 67,
    reactions: { heart: 48, inspire: 19, pray: 0 },
  },
  {
    id: '3',
    title: 'Community Service Day',
    date: '2024-03-02',
    time: '8:00 AM - 12:00 PM',
    location: 'Community Center, kazo, kawempe, Kampala',
    description: 'Come serve alongside us as we make a difference in our community through various outreach initiatives.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop',
    latitude: 37.7649,
    longitude: -122.4294,
    views: 203,
    likes: 134,
    reactions: { heart: 96, inspire: 38, pray: 0 },
  },
]

// Messages
export const messages: Message[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    subject: 'Prayer Request',
    message: 'I would like to request prayers for my family during this difficult time.',
    date: '2024-02-20',
    isRead: false,
    reply: {
      repliedOn: '2024-02-21',
      reply: 'We have added your family to our prayer list. God bless you.',
    },
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    subject: 'Volunteer Inquiry',
    message: 'I am interested in volunteering with your youth program.',
    date: '2024-02-19',
    isRead: true,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '(555) 345-6789',
    subject: 'Event Registration',
    message: 'I would like to register for the upcoming community service day.',
    date: '2024-02-18',
    isRead: true,
    reply: {
      repliedOn: '2024-02-18',
      reply: 'Thank you for registering! We look forward to seeing you there.',
    },
  },
  {
    id: '4',
    name: 'Lisa Davis',
    email: 'ldavis@example.com',
    phone: '(555) 456-7890',
    subject: 'General Inquiry',
    message: 'Can you provide more information about your membership program?',
    date: '2024-02-17',
    isRead: false,
  },
]

// Notifications
export const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Message',
    type: 'message',
    href: '/dashboard/messages/1',
    description: 'John Smith sent you a message about prayer requests.',
    date: '2024-02-20',
    isSeen: false,
  },
  {
    id: '2',
    title: 'System Update',
    type: 'sys',
    description: 'The website has been updated with new resources.',
    date: '2024-02-20',
    isSeen: false,
  },
  {
    id: '3',
    title: 'New Comment',
    type: 'comment',
    href: '/resources/1',
    description: 'Someone commented on your sermon.',
    date: '2024-02-19',
    isSeen: true,
  },
  {
    id: '4',
    title: 'New Like',
    type: 'like',
    href: '/testimonies/2',
    description: 'Your testimony received a new like.',
    date: '2024-02-19',
    isSeen: true,
  },
  {
    id: '5',
    title: 'Views Milestone',
    type: 'view',
    href: '/resources/2',
    description: 'Your article reached 100 views!',
    date: '2024-02-18',
    isSeen: true,
  },
]
