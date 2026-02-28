-- ============================================
-- KS ART — D1 Database Schema
-- ============================================

-- Portfolio items
CREATE TABLE IF NOT EXISTS portfolio (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    slug       TEXT UNIQUE NOT NULL,
    category   TEXT NOT NULL DEFAULT 'painting',  -- painting | sketch | mixed
    description TEXT,
    image_url  TEXT NOT NULL,
    dimensions TEXT,
    medium     TEXT,
    year       INTEGER,
    featured   INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    slug         TEXT UNIQUE NOT NULL,
    excerpt      TEXT,
    body         TEXT NOT NULL,
    cover_image  TEXT,
    category     TEXT DEFAULT 'art',  -- art | technique | studio | travel
    tags         TEXT,                -- JSON array
    published    INTEGER DEFAULT 0,
    read_time    INTEGER DEFAULT 5,
    published_at TEXT,
    created_at   TEXT DEFAULT (datetime('now')),
    updated_at   TEXT DEFAULT (datetime('now'))
);

-- Workshops
CREATE TABLE IF NOT EXISTS workshops (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    description TEXT,
    date        TEXT NOT NULL,
    time        TEXT,
    duration    TEXT,
    location    TEXT,
    capacity    INTEGER DEFAULT 12,
    spots_left  INTEGER DEFAULT 12,
    price       REAL,
    level       TEXT DEFAULT 'All Levels',
    image_url   TEXT,
    active      INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
);

-- Commission inquiries (hire form)
CREATE TABLE IF NOT EXISTS inquiries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    email       TEXT NOT NULL,
    service     TEXT NOT NULL,
    budget      TEXT,
    timeline    TEXT,
    description TEXT NOT NULL,
    reference   TEXT,
    status      TEXT DEFAULT 'new',  -- new | reviewed | replied | closed
    created_at  TEXT DEFAULT (datetime('now'))
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT UNIQUE NOT NULL,
    subscribed_at TEXT DEFAULT (datetime('now')),
    active        INTEGER DEFAULT 1
);

-- Workshop bookings
CREATE TABLE IF NOT EXISTS bookings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    workshop_id INTEGER NOT NULL,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    guests      INTEGER DEFAULT 1,
    notes       TEXT,
    status      TEXT DEFAULT 'confirmed',  -- confirmed | cancelled
    created_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (workshop_id) REFERENCES workshops(id)
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    role       TEXT,
    quote      TEXT NOT NULL,
    rating     INTEGER DEFAULT 5,
    avatar_url TEXT,
    featured   INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Seed: Portfolio items (from current static data)
INSERT INTO portfolio (title, slug, category, description, image_url, dimensions, medium, year, featured, sort_order) VALUES
('Abstract Emotions', 'abstract-emotions', 'painting', 'A vibrant exploration of color and feeling, layered with acrylics and palette knife work on gallery-wrapped canvas.', '/img/artwork1.jpeg', '36×48 in', 'Acrylic on Canvas', 2024, 1, 1),
('Urban Fragments', 'urban-fragments', 'mixed', 'Mixed-media collage combining street photography, ink washes, and found materials to capture city energy.', '/img/artwork2.jpeg', '24×30 in', 'Mixed Media', 2024, 1, 2),
('Layered Horizons', 'layered-horizons', 'painting', 'Textured landscape merging oil and cold wax medium, evoking the quiet drama of a sky just before sunset.', '/img/artwork3.jpeg', '40×30 in', 'Oil & Cold Wax', 2023, 1, 3),
('Golden Hour', 'golden-hour', 'painting', 'Warm, impressionistic study of light filtering through autumn trees, painted en plein air during golden hour.', '/img/painting1.jpeg', '18×24 in', 'Oil on Panel', 2024, 0, 4),
('Midnight Bloom', 'midnight-bloom', 'painting', 'Dark floral still life exploring contrast and luminosity, with petals emerging from deep shadow.', '/img/painting2.jpeg', '20×24 in', 'Oil on Linen', 2023, 0, 5),
('Figure Study No. 7', 'figure-study-no-7', 'sketch', 'A detailed pencil study exploring human form and movement, using cross-hatching and contour lines.', '/img/sketch1.jpeg', '14×17 in', 'Graphite on Paper', 2024, 0, 6),
('Charcoal Whispers', 'charcoal-whispers', 'sketch', 'Expressive charcoal drawing capturing gesture and emotion through bold, sweeping strokes on toned paper.', '/img/sketch2.jpeg', '18×24 in', 'Charcoal on Toned Paper', 2024, 0, 7);

-- Seed: Blog posts
INSERT INTO posts (title, slug, excerpt, body, cover_image, category, read_time, published, published_at) VALUES
('My Creative Process: From Blank Canvas to Finished Piece', 'my-creative-process', 'A behind-the-scenes look at how I approach each new artwork, from initial sketches to the final brushstroke.', '<p>Every piece starts with a feeling. Sometimes it''s triggered by a color I saw on a walk, other times by music or a memory. Here''s how I move from that spark to a finished painting...</p><p>The first step is always loose sketching — thumbnail compositions in a small sketchbook. I don''t judge these; they''re just for getting the energy out. From those thumbnails, I''ll choose which has the most potential and begin a larger study.</p><p>Color mixing is where the magic happens. I create custom palettes for each piece, often limiting myself to 4-5 colors plus white. Constraints breed creativity.</p><p>The actual painting process is intuitive — I layer and scrape, build up and tear down, until the piece feels alive. Knowing when to stop is the hardest part.</p>', '/img/artwork1.jpeg', 'art', 5, 1, '2024-12-15'),
('5 Lessons Learned from Painting En Plein Air', '5-lessons-plein-air', 'Painting outdoors taught me more in one summer than years in the studio. Here are my biggest takeaways.', '<p>This past summer I committed to painting outdoors at least twice a week. The experience completely changed my understanding of light and color.</p><p><strong>Lesson 1: Speed is your friend.</strong> When the light changes every 20 minutes, you learn to make decisive marks.</p><p><strong>Lesson 2: Simplify ruthlessly.</strong> You can''t paint every leaf. Learn to see masses and shapes.</p><p><strong>Lesson 3: Bring less gear.</strong> A French easel, limited palette, and two brushes is all you need.</p><p><strong>Lesson 4: Embrace imperfection.</strong> Plein air paintings have an energy that studio work can''t replicate.</p><p><strong>Lesson 5: Talk to people.</strong> Some of my best connections came from curious passersby watching me paint.</p>', '/img/painting1.jpeg', 'technique', 7, 1, '2024-11-28'),
('The Art of Pricing Your Creative Work', 'pricing-creative-work', 'The honest truth about pricing creative work — formulas, psychology, and confidence-building strategies.', '<p>Pricing artwork is one of the most uncomfortable topics for artists. Here''s what I''ve learned after years of trial and error.</p><p>Start with a formula: (Materials + Time × Hourly Rate + Overhead) × Markup = Base Price. But the formula is just the floor.</p><p>Your price communicates value. Underpricing doesn''t make you more accessible — it makes people question the quality. I learned this the hard way when doubling my prices actually increased sales.</p><p>Be transparent with clients about what goes into a commission. When they understand the 40+ hours behind a portrait, the price becomes a conversation about value, not cost.</p>', '/img/artwork2.jpeg', 'studio', 6, 1, '2024-11-10'),
('Painting Through the Seasons: A Year in Review', 'painting-through-seasons', 'Reflecting on 12 months of art, growth, and the unexpected ways nature influences my palette.', '<p>Looking back at a year of work, it''s fascinating to see how the seasons shaped my palette. Winter brought muted blues and warm grays. Spring exploded with yellow-greens I''d never used before. Summer was all about saturated warmth, and autumn... autumn was golden hour everything.</p><p>The lesson? Get outside. Let the world around you inform your color choices. It''s the most natural way to evolve your palette.</p>', '/img/painting2.jpeg', 'art', 4, 1, '2024-10-20'),
('Why Every Artist Should Keep a Sketchbook', 'keep-a-sketchbook', 'Not for perfection — for freedom. How daily sketching transformed my ability to see and create.', '<p>I sketch every single day. Not because I have to, but because it''s become the most important part of my practice.</p><p>A sketchbook is a judgment-free zone. It''s where bad drawings live alongside breakthroughs. It''s where I process ideas without the pressure of a canvas.</p><p>The habit has sharpened my observational skills, sped up my painting process, and given me an archive of ideas to pull from. If you''re not sketching daily, start today — even 10 minutes counts.</p>', '/img/sketch1.jpeg', 'technique', 4, 1, '2024-10-05'),
('Studio Tour: Where the Magic Happens', 'studio-tour', 'Take a peek inside my studio — from the organized chaos of my paint shelves to my favorite north-facing window.', '<p>My studio is a converted garage with skylights I installed myself. North-facing light is everything for a painter — consistent, cool, and flattering to color.</p><p>Organization is controlled chaos. Paints are sorted by temperature (warm left, cool right). Brushes hang bristle-down. Reference images cover one entire wall. And there''s always music playing.</p><p>The most important tool in my studio? A comfortable chair. Seriously — stepping back and sitting with a painting is when the best decisions happen.</p>', '/img/artwork3.jpeg', 'studio', 3, 1, '2024-09-18');

-- Seed: Testimonials
INSERT INTO testimonials (name, role, quote, rating) VALUES
('Sarah Mitchell', 'Interior Designer', 'Absolutely incredible work. The mural transformed our entire office space and everyone who visits comments on it. True talent!', 5),
('James Rodriguez', 'Private Collector', 'Ksenia captured exactly what I envisioned and more. The attention to detail and emotional depth in her work is remarkable.', 5),
('Emma Thompson', 'Gallery Owner', 'One of the most talented emerging artists I''ve had the pleasure to exhibit. Every piece tells a compelling story.', 5);

-- Seed: Workshops
INSERT INTO workshops (title, slug, description, date, time, duration, location, capacity, spots_left, price, level, image_url) VALUES
('Expressive Painting with Acrylics', 'expressive-acrylics', 'Dive deep into expressive techniques using acrylics. Learn palette knife work, color mixing, layering, and how to let emotion guide your brush. All materials provided.', '2026-03-15', '10:00 AM – 4:00 PM', '6 hours', 'Studio — Downtown Art District', 12, 4, 180, 'All Levels', '/img/artwork1.jpeg'),
('Urban Sketching Masterclass', 'urban-sketching', 'Take your sketchbook to the streets! We''ll explore quick capture techniques with pen, ink, and watercolor wash, drawing the city around us in real time.', '2026-03-22', '9:00 AM – 1:00 PM', '4 hours', 'Meet at Central Park Fountain', 15, 8, 120, 'Beginner Friendly', '/img/sketch1.jpeg'),
('Mixed Media Collage Workshop', 'mixed-media-collage', 'Explore the exciting world of mixed media — combining painting, found objects, paper, and texture mediums to create layered, narrative artworks.', '2026-04-05', '11:00 AM – 5:00 PM', '6 hours', 'Studio — Downtown Art District', 10, 10, 200, 'Intermediate', '/img/artwork2.jpeg');
