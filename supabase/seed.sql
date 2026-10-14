-- Moments Production Seed Data
-- 15 Services, Packages, Business Settings, Hours & Demo Gallery

-- 1. Insert Default Business Settings
INSERT INTO public.business_settings (
  business_name,
  tagline,
  email,
  phone,
  alt_phone,
  address_line1,
  address_line2,
  city,
  state,
  postal_code,
  country,
  timezone,
  advance_booking_days,
  buffer_minutes,
  min_notice_hours,
  cancellation_cutoff_hours,
  reschedule_cutoff_hours,
  instagram_url,
  facebook_url,
  youtube_url,
  whatsapp_number,
  terms_summary,
  cancellation_policy
) VALUES (
  'Moments Production',
  'Editorial Photography & Cinematic Visual Storytelling',
  'contact@momentsproduction.com',
  '+91 98765 43210',
  '+91 98250 12345',
  'Studio 402, Signature Square, Alkapuri',
  'Opposite Circuit House, Race Course Circle',
  'Vadodara',
  'Gujarat',
  '390007',
  'India',
  'Asia/Kolkata',
  60,
  30,
  24,
  48,
  24,
  'https://instagram.com/momentsproduction',
  'https://facebook.com/momentsproduction',
  'https://youtube.com/@momentsproduction',
  '+919876543210',
  'Sessions require booking verification. Slot holds are reserved for up to 30 minutes during booking. Studio terms apply.',
  'Cancellations made 48 hours or more prior to the scheduled session can be rescheduled without penalty or held as credit.'
) ON CONFLICT DO NOTHING;

-- 2. Insert Business Hours (0=Sunday to 6=Saturday)
INSERT INTO public.business_hours (day_of_week, day_name, is_open, open_time, close_time) VALUES
(1, 'Monday', true, '10:00:00', '19:00:00'),
(2, 'Tuesday', true, '10:00:00', '19:00:00'),
(3, 'Wednesday', true, '10:00:00', '19:00:00'),
(4, 'Thursday', true, '10:00:00', '19:00:00'),
(5, 'Friday', true, '10:00:00', '19:00:00'),
(6, 'Saturday', true, '10:00:00', '20:00:00'),
(0, 'Sunday', true, '11:00:00', '17:00:00')
ON CONFLICT (day_of_week) DO UPDATE SET
  is_open = EXCLUDED.is_open,
  open_time = EXCLUDED.open_time,
  close_time = EXCLUDED.close_time;

-- 3. Insert 15 Photography Services
INSERT INTO public.services (id, slug, name, category, short_description, full_description, base_price, duration_minutes, is_active, featured_image, gallery_images, sort_order) VALUES
(
  'e1000000-0000-0000-0000-000000000001',
  'studio-sessions',
  'Photography Studio Sessions',
  'Studio',
  'Controlled high-end studio lighting, bespoke backdrops, and creative art direction in our Alkapuri facility.',
  'Experience master-crafted studio sessions tailored for artists, creators, and discerning clients. Our Vadodara studio features Profoto lighting, seamless color backdrops, tethered monitor previews, and experienced lighting technicians to sculpt every detail.',
  8500.00,
  90,
  true,
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80'
  ],
  1
),
(
  'e1000000-0000-0000-0000-000000000002',
  'individual-portraits',
  'Individual Photography',
  'Portraits',
  'Expressive, character-driven personal portraiture crafted with intimacy and nuance.',
  'An individual portrait session at Moments Production is an artistic exploration of presence, style, and persona. Ideal for personal branding, milestone moments, or creative portfolios.',
  6000.00,
  60,
  true,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  ],
  2
),
(
  'e1000000-0000-0000-0000-000000000003',
  'events-parties',
  'Events and Parties',
  'Events',
  'Dynamic documentary coverage for milestone birthdays, galas, anniversaries, and cultural festivities.',
  'We document the energy, candid laughter, ambient architecture, and key speeches of your private parties and high-profile celebrations without disrupting the flow of the evening.',
  18000.00,
  180,
  true,
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'
  ],
  3
),
(
  'e1000000-0000-0000-0000-000000000004',
  'corporate-photography',
  'Corporate Photography',
  'Commercial',
  'Executive boardroom imagery, annual report visuals, corporate conferences, and facility showcases.',
  'High-impact visuals reflecting corporate leadership, teamwork, innovation, and technological capability across Vadodara, Ahmedabad, and Gujarat industrial corridors.',
  22000.00,
  240,
  true,
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
  ],
  4
),
(
  'e1000000-0000-0000-0000-000000000005',
  'maternity-newborn',
  'Maternity and Newborn Photography',
  'Family',
  'Gentle, tender, and hygienic sessions celebrating the miracle of new life and motherhood.',
  'Specialized gentle newborn sessions with climate-controlled sanitization, safety-certified baby wrapping, and ethereal maternity portraits in studio or private estate gardens.',
  12500.00,
  120,
  true,
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
  ],
  5
),
(
  'e1000000-0000-0000-0000-000000000006',
  'family-group',
  'Family and Group Photography',
  'Family',
  'Timeless multi-generational family heirlooms captured with warmth and cinematic coherence.',
  'Bring parents, grandparents, children, and loved ones together. We choreograph comfortable natural groupings that highlight authentic family dynamics and heirloom quality.',
  11000.00,
  90,
  true,
  'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80'
  ],
  6
),
(
  'e1000000-0000-0000-0000-000000000007',
  'product-photography',
  'Product Photography',
  'Commercial',
  'Ultra-sharp e-commerce catalog, luxury packshots, cosmetic, jewelry, and lifestyle hero imagery.',
  'Precision color-managed product photography with multi-focus stacking, high-CRI continuous lighting, and transparent or custom gradient styled sets ready for global storefronts.',
  15000.00,
  180,
  true,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  ],
  7
),
(
  'e1000000-0000-0000-0000-000000000008',
  'real-estate-property',
  'Property and Real-Estate Photography',
  'Architecture',
  'Architectural interior design, luxury villas, commercial developments, and hospitality shoots.',
  'Wide-angle perspective-corrected imagery, twilight exteriors, and ambient HDR lighting showcasing architectural harmony and finish materials for developers and interior designers.',
  16500.00,
  150,
  true,
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  ],
  8
),
(
  'e1000000-0000-0000-0000-000000000009',
  'headshots-portraits',
  'Headshots and Portraits',
  'Portraits',
  'Modern professional headshots for LinkedIn, doctors, lawyers, founders, and executives.',
  'Distinguish your professional footprint with a curated session featuring expert posing coaching, instant digital proofing, and skin-texture-preserving retouching.',
  5000.00,
  45,
  true,
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  ],
  9
),
(
  'e1000000-0000-0000-0000-000000000010',
  'weddings-engagements',
  'Weddings and Engagements',
  'Weddings',
  'Grand Gujarati wedding ceremonies, royal heritage venues, intimate vows, and cinematic wedding films.',
  'Our signature wedding production blends photojournalistic storytelling with editorial grandeur. From Sangeet and Haldi rituals at heritage palaces to poignant vows and midnight pheras.',
  55000.00,
  480,
  true,
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
  ],
  10
),
(
  'e1000000-0000-0000-0000-000000000011',
  'school-portraits',
  'School Portraits',
  'Education',
  'Organized, friendly, high-volume class and yearbook photography for leading educational institutions.',
  'Seamless multi-station photography days for private academies and universities across Gujarat. Organized student indexing, teacher portraits, sports team captures, and parent portals.',
  14000.00,
  240,
  true,
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80'
  ],
  11
),
(
  'e1000000-0000-0000-0000-000000000012',
  'pre-wedding',
  'Pre-Wedding Photography',
  'Weddings',
  'Cinematic romantic destination visuals at historic palaces, lakesides, and architectural landmarks.',
  'Escape with our cinematographers and stylists to picturesque locales like Champaner-Pavagadh, Laxmi Vilas Palace vicinity, or coastal Gujarat for an editorial love story film.',
  35000.00,
  360,
  true,
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
  ],
  12
),
(
  'e1000000-0000-0000-0000-000000000013',
  'photo-printing',
  'Photo Printing',
  'Print & Craft',
  'Museum-grade 12-color archival giclée prints on Hahnemühle fine-art cotton rag papers.',
  'Experience master prints that last beyond a century. We calibrate every file with custom ICC profiles on 100% acid-free cotton rag, metallic lustre, and baryta fine-art papers.',
  2500.00,
  30,
  true,
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  ],
  13
),
(
  'e1000000-0000-0000-0000-000000000014',
  'custom-framing',
  'Framing',
  'Print & Craft',
  'Bespoke hand-joined teak wood, champagne gilt, floating acrylic, and anti-reflective museum glass.',
  'Every print deserves conservation framing. Our master framers craft solid Italian mouldings, archival acid-free museum mats, and UV-filtering optical glass to protect your visual legacy.',
  4500.00,
  30,
  true,
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
  ],
  14
),
(
  'e1000000-0000-0000-0000-000000000015',
  'bespoke-albums',
  'Albums',
  'Print & Craft',
  'Handcrafted Italian leather flush-mount photobooks with debossed typography and lay-flat panoramic spreads.',
  'Our signature albums are hand-bound treasures crafted in genuine leather, silk shantung, or natural linen. Thick rigid pages lay flat with continuous panoramic spreads showcasing your stories.',
  16000.00,
  45,
  true,
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
  ],
  15
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  base_price = EXCLUDED.base_price,
  duration_minutes = EXCLUDED.duration_minutes,
  featured_image = EXCLUDED.featured_image,
  gallery_images = EXCLUDED.gallery_images,
  sort_order = EXCLUDED.sort_order;

-- 4. Packages for Services
INSERT INTO public.service_packages (service_id, name, description, price, duration_minutes, includes, sort_order) VALUES
('e1000000-0000-0000-0000-000000000001', 'Signature Studio', '1 outfit look with 8 retouched digital masters', 8500.00, 90, '["90-minute studio session", "1 backdrop choice", "8 high-res master retouched images", "Online private gallery", "Print release"]'::jsonb, 1),
('e1000000-0000-0000-0000-000000000001', 'Editorial Masterclass', '3 outfit looks with 20 retouched masters + styling assistant', 16500.00, 150, '["2.5 hours studio time", "Up to 3 outfit changes", "20 high-res retouched images", "Hair & makeup touch-up styling", "Two 12x18 fine-art archival prints"]'::jsonb, 2),

('e1000000-0000-0000-0000-000000000010', 'Heritage Wedding Day', 'Full day coverage of primary ceremony and reception', 55000.00, 480, '["8 hours dual-photographer coverage", "Traditional + candid perspectives", "350+ color-graded high-resolution photos", "Highlight teaser reel", "Online gallery with 1-year hosting"]'::jsonb, 1),
('e1000000-0000-0000-0000-000000000010', 'Royal Multi-Day Celebration', '3 days comprehensive coverage including Sangeet, Haldi, Wedding & Reception', 145000.00, 1200, '["3 full days with senior cinematography team", "Drone aerial coverage where permitted", "12x18 Italian leather master album (40 pages)", "15-minute cinematic film + 3-minute teaser", "Complete RAW footage delivery on SSD"]'::jsonb, 2),

('e1000000-0000-0000-0000-000000000012', 'Cinematic Romance', 'Full sunset location shoot in Vadodara surroundings', 35000.00, 360, '["6 hours on-location shoot", "2 scenic locations", "35 retouched creative portraits", "3-minute cinematic music video", "Wardrobe coordination guide"]'::jsonb, 1),

('e1000000-0000-0000-0000-000000000009', 'Executive Headshot', 'Focused corporate headshot session with 3 master edits', 5000.00, 45, '["45 minutes in studio or office", "2 backdrop colors", "3 master retouched portraits in web + print resolution", "LinkedIn & publication crop specifications", "48-hour expedited delivery"]'::jsonb, 1)
ON CONFLICT DO NOTHING;

-- 5. Seed Curated Gallery Items
INSERT INTO public.gallery_items (title, category, image_url, client_tag, aspect_ratio, is_featured, sort_order) VALUES
('Royal Heritage Wedding at Laxmi Vilas', 'Weddings', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', 'Rohan & Ananya', 'portrait', true, 1),
('High-Key Minimalist Studio Portrait', 'Studio', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80', 'Editorial Spotlight', 'landscape', true, 2),
('Architectural Lines of Vasna Villa', 'Architecture', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'Moda Living', 'landscape', true, 3),
('Champaner Sunset Pre-Wedding Silhouette', 'Weddings', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80', 'Karan & Meera', 'portrait', true, 4),
('Haute Horlogerie Luxury Product Focus', 'Commercial', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', 'Aethel Watches', 'square', true, 5),
('Executive Leadership Series', 'Portraits', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80', 'Finovate Capital', 'portrait', true, 6),
('Ethereal Maternity Golden Hour', 'Family', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80', 'Priya & Dev', 'portrait', false, 7),
('Annual Gala Night Celebration', 'Events', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', 'Baroda Rotary', 'landscape', false, 8)
ON CONFLICT DO NOTHING;
