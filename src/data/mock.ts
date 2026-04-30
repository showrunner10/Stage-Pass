export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  city: string;
  venue: string;
  promoter: string;
  commission: number;
  commissionFixed: number;
  category: string;
  status: 'Draft' | 'Live' | 'Paused' | 'Ended';
  inventoryCap: number;
  soldCount: number;
  ticketTiers: {
    name: string;
    price: number;
    description: string;
  }[];
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  niche: string;
  audienceSize: string;
  socialLinks: { platform: string; url: string }[];
  fitScore: number;
  tier: 'Default' | 'Established' | 'Headline';
}

export interface Campaign {
  id: string;
  creatorId: string;
  eventId: string;
  name: string;
  status: 'Draft' | 'Live' | 'Paused';
  format: 'Tracked Link' | 'Landing Page';
  slug: string;
  headline: string;
  note: string;
  clicks: number;
  ticketsSold: number;
  revenue: number;
  commission: number;
  conversionRate: number;
  createdAt: string;
}

export const events: Event[] = [
  {
    id: '1',
    slug: 'solstice-festival-2026',
    title: 'Solstice Festival 2026',
    description: 'The ultimate summer celebration in Byron Bay. Three days of music, art, and connection.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2070&q=80',
    date: 'Dec 20-22, 2026',
    location: 'North Byron Parklands',
    city: 'Byron Bay',
    venue: 'North Byron Parklands',
    promoter: 'Secret Sounds',
    commission: 12,
    commissionFixed: 45,
    category: 'Festival',
    status: 'Live',
    inventoryCap: 5000,
    soldCount: 1250,
    ticketTiers: [
      { name: 'GA Weekend', price: 349, description: '3-day access to all stages' },
      { name: 'VIP Garden', price: 599, description: 'Premium viewing and private bars' }
    ]
  },
  {
    id: '2',
    slug: 'warehouse-techno-sydney',
    title: 'Pulse: Warehouse Sessions',
    description: 'An immersive underground techno experience in a transformed industrial space.',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2070&q=80',
    date: 'May 15, 2026',
    location: 'Marrickville Warehouse',
    city: 'Sydney',
    venue: 'Marrickville Warehouse',
    promoter: 'Pulse Events',
    commission: 15,
    commissionFixed: 12,
    category: 'Warehouse Party',
    status: 'Live',
    inventoryCap: 800,
    soldCount: 450,
    ticketTiers: [
      { name: 'Early Bird', price: 65, description: 'Limited release' },
      { name: 'General Admission', price: 85, description: 'Standard entry' }
    ]
  },
  {
    id: '3',
    slug: 'melbourne-wine-wildflower',
    title: 'Wine & Wildflower Garden',
    description: 'A premium wine tasting event featuring the best boutique wineries from Victoria.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
    date: 'June 12, 2026',
    location: 'Royal Exhibition Building',
    city: 'Melbourne',
    venue: 'Royal Exhibition Building',
    promoter: 'Vino Events',
    commission: 10,
    commissionFixed: 15,
    category: 'Wine Event',
    status: 'Live',
    inventoryCap: 2000,
    soldCount: 1100,
    ticketTiers: [
      { name: 'Standard Tasting', price: 95, description: 'Includes 10 tasting tokens' },
      { name: 'Connoisseur Pass', price: 165, description: 'Unlimited tastings + masterclass' }
    ]
  },
  {
    id: '4',
    slug: 'brisbane-tech-summit',
    title: 'Horizon Tech Summit',
    description: 'The future of AI and Web3 discussed by global leaders in the heart of Brisbane.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
    date: 'Aug 5-6, 2026',
    location: 'Brisbane Convention Centre',
    city: 'Brisbane',
    venue: 'Brisbane Convention Centre',
    promoter: 'Horizon Media',
    commission: 8,
    commissionFixed: 80,
    category: 'Conference',
    status: 'Live',
    inventoryCap: 1200,
    soldCount: 300,
    ticketTiers: [
      { name: 'Delegate Pass', price: 899, description: 'Full access to all sessions' },
      { name: 'Startup Pass', price: 450, description: 'Discounted for early stage founders' }
    ]
  },
  {
    id: '5',
    slug: 'rooftop-jazz-sydney',
    title: 'Skyline Jazz Nights',
    description: 'Intimate jazz performances with the best view of Sydney Harbour.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop',
    date: 'July 10, 2026',
    location: 'MCA Rooftop',
    city: 'Sydney',
    venue: 'MCA Rooftop',
    promoter: 'Skyline Productions',
    commission: 12,
    commissionFixed: 18,
    category: 'Live Music',
    status: 'Live',
    inventoryCap: 250,
    soldCount: 180,
    ticketTiers: [
      { name: 'Seated Admission', price: 120, description: 'Guaranteed seat + drink' },
      { name: 'Standing Room', price: 75, description: 'Bar access' }
    ]
  },
  {
    id: '6',
    slug: 'laneway-melbourne-2026',
    title: 'Laneway Festival Melbourne',
    description: 'The premier indie and alternative music festival returning to Footscray.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    date: 'Feb 14, 2026',
    location: 'Footscray Park',
    city: 'Melbourne',
    venue: 'Footscray Park',
    promoter: 'Laneway Presents',
    commission: 10,
    commissionFixed: 25,
    category: 'Festival',
    status: 'Live',
    inventoryCap: 15000,
    soldCount: 8900,
    ticketTiers: [
      { name: 'General Admission', price: 189, description: 'Single day entry' },
      { name: 'VIP', price: 320, description: 'Express entry + VIP area' }
    ]
  },
  {
    id: '7',
    slug: 'underground-art-brisbane',
    title: 'Canvas & Chaos',
    description: 'An experimental art and light installation in a subterranean car park.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    date: 'Sept 18, 2026',
    location: 'Fortitude Valley Sub-Level',
    city: 'Brisbane',
    venue: 'Fortitude Valley Sub-Level',
    promoter: 'Chaos Collective',
    commission: 20,
    commissionFixed: 10,
    category: 'Warehouse Party',
    status: 'Live',
    inventoryCap: 500,
    soldCount: 120,
    ticketTiers: [
      { name: 'General Entry', price: 45, description: 'Includes 1 drink' }
    ]
  },
  {
    id: '8',
    slug: 'byron-yoga-retreat',
    title: 'Zenith Yoga Retreat',
    description: 'A transformative 3-day wellness experience overlooking the Pacific Ocean.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop',
    date: 'Oct 5-7, 2026',
    location: 'Elements of Byron',
    city: 'Byron Bay',
    venue: 'Elements of Byron',
    promoter: 'Zenith Wellness',
    commission: 15,
    commissionFixed: 150,
    category: 'Conference',
    status: 'Live',
    inventoryCap: 100,
    soldCount: 45,
    ticketTiers: [
      { name: 'All-Inclusive', price: 1250, description: 'Accommodation + meals + sessions' }
    ]
  }
];

export const creators: Creator[] = [
  {
    id: 'c1',
    name: 'Maya Rodriguez',
    handle: 'maya.rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=maya',
    niche: 'Music & Lifestyle',
    audienceSize: '125K',
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'TikTok', url: '#' }
    ],
    fitScore: 98,
    tier: 'Headline'
  },
  {
    id: 'c2',
    name: 'Alex Chen',
    handle: 'alextalksevents',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    niche: 'Nightlife & Culture',
    audienceSize: '45K',
    socialLinks: [
      { platform: 'Instagram', url: '#' }
    ],
    fitScore: 85,
    tier: 'Established'
  },
  {
    id: 'c3',
    name: 'Sarah Jenkins',
    handle: 'sarah.j',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    niche: 'Food & Wine',
    audienceSize: '82K',
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'Newsletter', url: '#' }
    ],
    fitScore: 92,
    tier: 'Established'
  },
  {
    id: 'c4',
    name: 'Marcus Thorne',
    handle: 'marcus.tech',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    niche: 'Business & Tech',
    audienceSize: '210K',
    socialLinks: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Podcast', url: '#' }
    ],
    fitScore: 78,
    tier: 'Headline'
  },
  {
    id: 'c5',
    name: 'Luna Wilde',
    handle: 'lunawilde',
    avatar: 'https://i.pravatar.cc/150?u=luna',
    niche: 'Wellness & Travel',
    audienceSize: '35K',
    socialLinks: [
      { platform: 'Instagram', url: '#' }
    ],
    fitScore: 95,
    tier: 'Default'
  }
];

export const campaigns: Campaign[] = [
  {
    id: 'camp1',
    creatorId: 'c1',
    eventId: '1',
    name: 'Solstice 2026 Promo',
    status: 'Live',
    format: 'Landing Page',
    slug: 'maya-solstice',
    headline: 'Join me at the most magical festival of the year!',
    note: "I've been going to Solstice for 3 years and it's literally life-changing. Use my link for a special creator discount!",
    clicks: 1240,
    ticketsSold: 86,
    revenue: 30014,
    commission: 3601.68,
    conversionRate: 6.9,
    createdAt: '2026-03-01'
  },
  {
    id: 'camp2',
    creatorId: 'c1',
    eventId: '2',
    name: 'Pulse Warehouse Party',
    status: 'Live',
    format: 'Tracked Link',
    slug: 'maya-pulse',
    headline: 'Techno in a warehouse? Say no more.',
    note: "Sydney's techno scene is peaking right now. Don't miss this one.",
    clicks: 450,
    ticketsSold: 32,
    revenue: 2720,
    commission: 408,
    conversionRate: 7.1,
    createdAt: '2026-03-15'
  },
  {
    id: 'camp3',
    creatorId: 'c3',
    eventId: '3',
    name: 'Wine & Wildflower Promo',
    status: 'Live',
    format: 'Landing Page',
    slug: 'sarah-wine',
    headline: 'My favourite Melbourne wine event is back!',
    note: "I'll be hosting a small tasting session here. Grab tickets through my page to join us.",
    clicks: 890,
    ticketsSold: 54,
    revenue: 5130,
    commission: 513,
    conversionRate: 6.1,
    createdAt: '2026-03-10'
  },
  {
    id: 'camp4',
    creatorId: 'c2',
    eventId: '6',
    name: 'Laneway Hype',
    status: 'Paused',
    format: 'Tracked Link',
    slug: 'alex-laneway',
    headline: 'Laneway is the one.',
    note: 'Playlist drops + last minute ticket reminders.',
    clicks: 2100,
    ticketsSold: 97,
    revenue: 18333,
    commission: 1833.3,
    conversionRate: 4.6,
    createdAt: '2026-02-05'
  },
  {
    id: 'camp5',
    creatorId: 'c4',
    eventId: '4',
    name: 'Horizon Summit Keynotes',
    status: 'Live',
    format: 'Landing Page',
    slug: 'marcus-horizon',
    headline: 'If you build in AI, you should be in this room.',
    note: 'Use my page for the best delegate experience and updates.',
    clicks: 640,
    ticketsSold: 21,
    revenue: 18879,
    commission: 1510.32,
    conversionRate: 3.3,
    createdAt: '2026-03-28'
  },
  {
    id: 'camp6',
    creatorId: 'c5',
    eventId: '8',
    name: 'Zenith Retreat Invite',
    status: 'Draft',
    format: 'Landing Page',
    slug: 'luna-zenith',
    headline: 'A reset on the coast.',
    note: 'A calm, premium retreat I’m genuinely excited about.',
    clicks: 120,
    ticketsSold: 2,
    revenue: 2500,
    commission: 375,
    conversionRate: 1.7,
    createdAt: '2026-04-10'
  }
];

export const ledgerEntries = [
  { id: 'l1', date: '2026-04-25', description: 'Commission - Solstice Festival (Maya R)', amount: 45.00, status: 'Cleared' },
  { id: 'l2', date: '2026-04-24', description: 'Commission - Solstice Festival (Maya R)', amount: 45.00, status: 'Cleared' },
  { id: 'l3', date: '2026-04-24', description: 'Commission - Pulse Warehouse (Alex C)', amount: 12.75, status: 'Pending' },
  { id: 'l4', date: '2026-04-23', description: 'Commission - Wine & Wildflower (Sarah J)', amount: 16.50, status: 'Cleared' },
  { id: 'l5', date: '2026-04-23', description: 'Payout - Stripe Express', amount: -1250.00, status: 'Completed' },
  { id: 'l6', date: '2026-04-22', description: 'Commission - Horizon Tech (Marcus T)', amount: 80.00, status: 'Cleared' },
  { id: 'l7', date: '2026-04-22', description: 'Commission - Horizon Tech (Marcus T)', amount: 80.00, status: 'Cleared' },
  { id: 'l8', date: '2026-04-21', description: 'Commission - Skyline Jazz (Maya R)', amount: 18.00, status: 'Cleared' },
  { id: 'l9', date: '2026-04-21', description: 'Commission - Laneway Festival (Alex C)', amount: 25.00, status: 'Pending' },
  { id: 'l10', date: '2026-04-20', description: 'Commission - Zenith Retreat (Luna W)', amount: 150.00, status: 'Cleared' }
];
