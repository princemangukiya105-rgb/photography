import {
  BusinessHours,
  BusinessSettings,
  GalleryItem,
  Service,
  ServicePackage,
  Booking,
} from '@/types/database';

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  business_name: 'Moments Production',
  tagline: 'Editorial Photography & Cinema Agency',
  email: 'contact@momentsproduction.com',
  phone: '+91 98765 43210',
  alt_phone: '+91 98250 12345',
  address_line1: 'Studio 402, Signature Square, Alkapuri',
  address_line2: 'Opposite Circuit House, Race Course Circle',
  city: 'Vadodara',
  state: 'Gujarat',
  postal_code: '390007',
  country: 'India',
  timezone: 'Asia/Kolkata',
  advance_booking_days: 60,
  buffer_minutes: 30,
  min_notice_hours: 24,
  cancellation_cutoff_hours: 48,
  reschedule_cutoff_hours: 24,
  instagram_url: 'https://instagram.com/momentsproduction',
  facebook_url: 'https://facebook.com/momentsproduction',
  youtube_url: 'https://youtube.com/@momentsproduction',
  whatsapp_number: '+919876543210',
  terms_summary:
    'All studio and location bookings require verification. Slot holds are reserved for up to 30 minutes during booking.',
  cancellation_policy:
    'Cancellations made 48 hours or more prior to the scheduled session are eligible for full rescheduling or deposit credit toward future commissions.',
};

export const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
  { id: 'h-1', day_of_week: 1, day_name: 'Monday', is_open: true, open_time: '10:00', close_time: '19:00' },
  { id: 'h-2', day_of_week: 2, day_name: 'Tuesday', is_open: true, open_time: '10:00', close_time: '19:00' },
  { id: 'h-3', day_of_week: 3, day_name: 'Wednesday', is_open: true, open_time: '10:00', close_time: '19:00' },
  { id: 'h-4', day_of_week: 4, day_name: 'Thursday', is_open: true, open_time: '10:00', close_time: '19:00' },
  { id: 'h-5', day_of_week: 5, day_name: 'Friday', is_open: true, open_time: '10:00', close_time: '19:00' },
  { id: 'h-6', day_of_week: 6, day_name: 'Saturday', is_open: true, open_time: '10:00', close_time: '20:00' },
  { id: 'h-0', day_of_week: 0, day_name: 'Sunday', is_open: true, open_time: '11:00', close_time: '17:00' },
];

export const DEFAULT_PACKAGES: Record<string, ServicePackage[]> = {
  'studio-sessions': [
    {
      id: 'pkg-studio-1',
      service_id: 'e1000000-0000-0000-0000-000000000001',
      name: 'Essential Studio Session',
      description: 'Single look with 8 master retouched portraits in studio.',
      price: 8500,
      duration_minutes: 90,
      includes: [
        '90 minutes of studio shoot time',
        '1 outfit styling change',
        '8 master retouched high-res files',
        'Private proofing gallery',
        'Full personal print rights',
      ],
      sort_order: 1,
      is_active: true,
    },
    {
      id: 'pkg-studio-2',
      service_id: 'e1000000-0000-0000-0000-000000000001',
      name: 'Editorial Masterclass',
      description: 'Extended three-look creative commission with makeup touch-up & fine-art prints.',
      price: 16500,
      duration_minutes: 150,
      includes: [
        '2.5 hours of studio shoot time',
        'Up to 3 outfit changes with backdrop rotation',
        '20 high-res editorial retouched master files',
        'Dedicated styling assistant for touch-ups',
        'Two 12x18 archival museum cotton prints',
      ],
      sort_order: 2,
      is_active: true,
    },
  ],
  'individual-portraits': [
    {
      id: 'pkg-portrait-1',
      service_id: 'e1000000-0000-0000-0000-000000000002',
      name: 'Signature Portrait',
      description: 'Character-focused personal portraiture session.',
      price: 6000,
      duration_minutes: 60,
      includes: [
        '60 minutes session',
        'Studio or Vadodara heritage outdoor venue',
        '6 retouched high-resolution files',
        'Web and print formats',
      ],
      sort_order: 1,
      is_active: true,
    },
  ],
  'weddings-engagements': [
    {
      id: 'pkg-wedding-1',
      service_id: 'e1000000-0000-0000-0000-000000000010',
      name: 'Heritage Ceremony Day',
      description: 'Full day coverage of main ceremony and evening reception.',
      price: 55000,
      duration_minutes: 480,
      includes: [
        '8 hours dual-photographer coverage',
        'Traditional + candid storytelling',
        '350+ color-graded high-resolution photos',
        'Online cloud gallery for 1 year',
        'Highlight teaser reel',
      ],
      sort_order: 1,
      is_active: true,
    },
    {
      id: 'pkg-wedding-2',
      service_id: 'e1000000-0000-0000-0000-000000000010',
      name: 'Royal Multi-Day Celebration',
      description: '3 days comprehensive coverage including Sangeet, Haldi, Ceremony & Reception.',
      price: 145000,
      duration_minutes: 1200,
      includes: [
        '3 full days coverage with senior crew',
        'Cinematic drone footage where permitted',
        '12x18 Italian leather master album (40 pages)',
        '15-minute cinematic film + 3-minute teaser',
        'Complete original RAW archive delivery',
      ],
      sort_order: 2,
      is_active: true,
    },
  ],
  'pre-wedding': [
    {
      id: 'pkg-prewed-1',
      service_id: 'e1000000-0000-0000-0000-000000000012',
      name: 'Cinematic Sunset Romance',
      description: 'Scenic outdoor pre-wedding destination session in Vadodara or Champaner.',
      price: 35000,
      duration_minutes: 360,
      includes: [
        '6 hours on-location shoot',
        '2 scenic locations',
        '35 retouched creative portraits',
        '3-minute cinematic music video',
        'Wardrobe coordination guide',
      ],
      sort_order: 1,
      is_active: true,
    },
  ],
  'headshots-portraits': [
    {
      id: 'pkg-headshot-1',
      service_id: 'e1000000-0000-0000-0000-000000000009',
      name: 'Executive LinkedIn & Press Headshot',
      description: 'Focused session with instant monitor proofing and 3 master edits.',
      price: 5000,
      duration_minutes: 45,
      includes: [
        '45 minutes in studio',
        '2 backdrop changes',
        '3 retouched master images with commercial license',
        'Square, portrait & banner crops ready for web',
        '48-hour rush delivery option',
      ],
      sort_order: 1,
      is_active: true,
    },
  ],
};

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    slug: 'studio-sessions',
    name: 'Photography Studio Sessions',
    category: 'Studio',
    short_description:
      'Controlled high-end studio lighting, bespoke backdrops, and creative art direction in our Alkapuri facility.',
    full_description:
      'Experience master-crafted studio sessions tailored for artists, creators, and discerning clients. Our Vadodara studio features Profoto lighting, seamless color backdrops, tethered monitor previews, and experienced lighting technicians to sculpt every detail.',
    base_price: 8500,
    duration_minutes: 90,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 1,
    packages: DEFAULT_PACKAGES['studio-sessions'],
  },
  {
    id: 'e1000000-0000-0000-0000-000000000002',
    slug: 'individual-portraits',
    name: 'Individual Photography',
    category: 'Portraits',
    short_description:
      'Expressive, character-driven personal portraiture crafted with intimacy and nuance.',
    full_description:
      'An individual portrait session at Moments Production is an artistic exploration of presence, style, and persona. Ideal for personal branding, milestone moments, or creative portfolios.',
    base_price: 6000,
    duration_minutes: 60,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 2,
    packages: DEFAULT_PACKAGES['individual-portraits'],
  },
  {
    id: 'e1000000-0000-0000-0000-000000000003',
    slug: 'events-parties',
    name: 'Events and Parties',
    category: 'Events',
    short_description:
      'Dynamic documentary coverage for milestone birthdays, galas, anniversaries, and cultural festivities.',
    full_description:
      'We document the energy, candid laughter, ambient architecture, and key speeches of your private parties and high-profile celebrations without disrupting the flow of the evening.',
    base_price: 18000,
    duration_minutes: 180,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 3,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000004',
    slug: 'corporate-photography',
    name: 'Corporate Photography',
    category: 'Commercial',
    short_description:
      'Executive boardroom imagery, annual report visuals, corporate conferences, and facility showcases.',
    full_description:
      'High-impact visuals reflecting corporate leadership, teamwork, innovation, and technological capability across Vadodara, Ahmedabad, and Gujarat industrial corridors.',
    base_price: 22000,
    duration_minutes: 240,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 4,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000005',
    slug: 'maternity-newborn',
    name: 'Maternity and Newborn Photography',
    category: 'Family',
    short_description:
      'Gentle, tender, and hygienic sessions celebrating the miracle of new life and motherhood.',
    full_description:
      'Specialized gentle newborn sessions with climate-controlled sanitization, safety-certified baby wrapping, and ethereal maternity portraits in studio or private estate gardens.',
    base_price: 12500,
    duration_minutes: 120,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 5,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000006',
    slug: 'family-group',
    name: 'Family and Group Photography',
    category: 'Family',
    short_description:
      'Timeless multi-generational family heirlooms captured with warmth and cinematic coherence.',
    full_description:
      'Bring parents, grandparents, children, and loved ones together. We choreograph comfortable natural groupings that highlight authentic family dynamics and heirloom quality.',
    base_price: 11000,
    duration_minutes: 90,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 6,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000007',
    slug: 'product-photography',
    name: 'Product Photography',
    category: 'Commercial',
    short_description:
      'Ultra-sharp e-commerce catalog, luxury packshots, cosmetic, jewelry, and lifestyle hero imagery.',
    full_description:
      'Precision color-managed product photography with multi-focus stacking, high-CRI continuous lighting, and transparent or custom gradient styled sets ready for global storefronts.',
    base_price: 15000,
    duration_minutes: 180,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 7,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000008',
    slug: 'real-estate-property',
    name: 'Property and Real-Estate Photography',
    category: 'Architecture',
    short_description:
      'Architectural interior design, luxury villas, commercial developments, and hospitality shoots.',
    full_description:
      'Wide-angle perspective-corrected imagery, twilight exteriors, and ambient HDR lighting showcasing architectural harmony and finish materials for developers and interior designers.',
    base_price: 16500,
    duration_minutes: 150,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 8,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000009',
    slug: 'headshots-portraits',
    name: 'Headshots and Portraits',
    category: 'Portraits',
    short_description:
      'Modern professional headshots for LinkedIn, doctors, lawyers, founders, and executives.',
    full_description:
      'Distinguish your professional footprint with a curated session featuring expert posing coaching, instant digital proofing, and skin-texture-preserving retouching.',
    base_price: 5000,
    duration_minutes: 45,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 9,
    packages: DEFAULT_PACKAGES['headshots-portraits'],
  },
  {
    id: 'e1000000-0000-0000-0000-000000000010',
    slug: 'weddings-engagements',
    name: 'Weddings and Engagements',
    category: 'Weddings',
    short_description:
      'Grand Gujarati wedding ceremonies, royal heritage venues, intimate vows, and cinematic wedding films.',
    full_description:
      'Our signature wedding production blends photojournalistic storytelling with editorial grandeur. From Sangeet and Haldi rituals at heritage palaces to poignant vows and midnight pheras.',
    base_price: 55000,
    duration_minutes: 480,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 10,
    packages: DEFAULT_PACKAGES['weddings-engagements'],
  },
  {
    id: 'e1000000-0000-0000-0000-000000000011',
    slug: 'school-portraits',
    name: 'School Portraits',
    category: 'Education',
    short_description:
      'Organized, friendly, high-volume class and yearbook photography for leading educational institutions.',
    full_description:
      'Seamless multi-station photography days for private academies and universities across Gujarat. Organized student indexing, teacher portraits, sports team captures, and parent portals.',
    base_price: 14000,
    duration_minutes: 240,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 11,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000012',
    slug: 'pre-wedding',
    name: 'Pre-Wedding Photography',
    category: 'Weddings',
    short_description:
      'Cinematic romantic destination visuals at historic palaces, lakesides, and architectural landmarks.',
    full_description:
      'Escape with our cinematographers and stylists to picturesque locales like Champaner-Pavagadh, Laxmi Vilas Palace vicinity, or coastal Gujarat for an editorial love story film.',
    base_price: 35000,
    duration_minutes: 360,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 12,
    packages: DEFAULT_PACKAGES['pre-wedding'],
  },
  {
    id: 'e1000000-0000-0000-0000-000000000013',
    slug: 'photo-printing',
    name: 'Photo Printing',
    category: 'Print & Craft',
    short_description:
      'Museum-grade 12-color archival giclée prints on Hahnemühle fine-art cotton rag papers.',
    full_description:
      'Experience master prints that last beyond a century. We calibrate every file with custom ICC profiles on 100% acid-free cotton rag, metallic lustre, and baryta fine-art papers.',
    base_price: 2500,
    duration_minutes: 30,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 13,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000014',
    slug: 'custom-framing',
    name: 'Framing',
    category: 'Print & Craft',
    short_description:
      'Bespoke hand-joined teak wood, champagne gilt, floating acrylic, and anti-reflective museum glass.',
    full_description:
      'Every print deserves conservation framing. Our master framers craft solid Italian mouldings, archival acid-free museum mats, and UV-filtering optical glass to protect your visual legacy.',
    base_price: 4500,
    duration_minutes: 30,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 14,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000015',
    slug: 'bespoke-albums',
    name: 'Albums',
    category: 'Print & Craft',
    short_description:
      'Handcrafted Italian leather flush-mount photobooks with debossed typography and lay-flat panoramic spreads.',
    full_description:
      'Our signature albums are hand-bound treasures crafted in genuine leather, silk shantung, or natural linen. Thick rigid pages lay flat with continuous panoramic spreads showcasing your stories.',
    base_price: 16000,
    duration_minutes: 45,
    is_active: true,
    featured_image:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    ],
    sort_order: 15,
  },
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Royal Heritage Wedding at Laxmi Vilas',
    category: 'Weddings',
    image_url:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    client_tag: 'Rohan & Ananya',
    aspect_ratio: 'portrait',
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 'gal-2',
    title: 'High-Key Minimalist Studio Portrait',
    category: 'Studio',
    image_url:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    client_tag: 'Editorial Spotlight',
    aspect_ratio: 'landscape',
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 'gal-3',
    title: 'Architectural Lines of Vasna Villa',
    category: 'Architecture',
    image_url:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    client_tag: 'Moda Living',
    aspect_ratio: 'landscape',
    is_featured: true,
    sort_order: 3,
  },
  {
    id: 'gal-4',
    title: 'Champaner Sunset Pre-Wedding Silhouette',
    category: 'Weddings',
    image_url:
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    client_tag: 'Karan & Meera',
    aspect_ratio: 'portrait',
    is_featured: true,
    sort_order: 4,
  },
  {
    id: 'gal-5',
    title: 'Haute Horlogerie Luxury Product Focus',
    category: 'Commercial',
    image_url:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    client_tag: 'Aethel Watches',
    aspect_ratio: 'square',
    is_featured: true,
    sort_order: 5,
  },
  {
    id: 'gal-6',
    title: 'Executive Leadership Series',
    category: 'Portraits',
    image_url:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
    client_tag: 'Finovate Capital',
    aspect_ratio: 'portrait',
    is_featured: true,
    sort_order: 6,
  },
  {
    id: 'gal-7',
    title: 'Ethereal Maternity Golden Hour',
    category: 'Family',
    image_url:
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    client_tag: 'Priya & Dev',
    aspect_ratio: 'portrait',
    is_featured: false,
    sort_order: 7,
  },
  {
    id: 'gal-8',
    title: 'Annual Gala Night Celebration',
    category: 'Events',
    image_url:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    client_tag: 'Baroda Rotary',
    aspect_ratio: 'landscape',
    is_featured: false,
    sort_order: 8,
  },
];

export const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: 'b-001',
    booking_reference: 'MP-2026-X8K9',
    access_token: '11111111-2222-3333-4444-555555555555',
    service_id: 'e1000000-0000-0000-0000-000000000001',
    package_id: 'pkg-studio-1',
    customer_name: 'Aarav Patel',
    customer_email: 'aarav.patel@example.com',
    customer_phone: '+91 98251 23456',
    session_location_type: 'studio',
    booking_date: '2026-10-20',
    start_time: '14:00',
    end_time: '15:30',
    total_price: 8500,
    currency: 'INR',
    status: 'confirmed',
    customer_notes: 'Looking for moody, low-key lighting for fashion portfolio.',
    internal_notes: 'Profoto softbox ready on grid 2.',
    created_at: '2026-10-12T10:00:00Z',
    updated_at: '2026-10-12T11:00:00Z',
  },
  {
    id: 'b-002',
    booking_reference: 'MP-2026-M4P7',
    access_token: '22222222-3333-4444-5555-666666666666',
    service_id: 'e1000000-0000-0000-0000-000000000010',
    package_id: 'pkg-wedding-1',
    customer_name: 'Diya Shah',
    customer_email: 'diya.shah@example.com',
    customer_phone: '+91 98980 45678',
    session_location_type: 'on_location',
    location_address: 'Kabir Farm, Sevasi, Vadodara',
    booking_date: '2026-10-25',
    start_time: '10:00',
    end_time: '18:00',
    total_price: 55000,
    currency: 'INR',
    status: 'pending',
    customer_notes: 'Day wedding and dusk reception ceremony.',
    internal_notes: 'Requires drone clearance check with Sevasi farm authority.',
    created_at: '2026-10-14T09:30:00Z',
    updated_at: '2026-10-14T09:30:00Z',
  },
];
