# Ksenia Art — Portfolio & Creative Studio

A dynamic artist portfolio website for **Ksenia**, powered by **Cloudflare Workers + D1**. Showcases expressive paintings, detailed sketches, custom commissions, workshops, and an art-inspired travel blog — with a full REST API and admin panel.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat&logo=cloudflare&logoColor=white)

---

## Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Hero, showcase strip, about section, dynamic portfolio gallery with lightbox, services, testimonials, newsletter CTA |
| **Art Blog** | `blog.html` | Dynamic blog posts from D1 database |
| **Travel Blog** | `travel.html` | Art-inspired travel stories with a featured story and destination cards |
| **Hire Me** | `hire.html` | Commission request form → saves to D1, pricing tiers, process overview, FAQ |
| **Workshops** | `workshops.html` | Dynamic workshop listings from D1 with live booking |
| **Book Now** | `book.html` | Booking calendar and contact cards |
| **Admin** | `admin.html` | Dashboard to manage portfolio, posts, inquiries, subscribers, workshops, bookings |

## Features

- **Dynamic Content** — Portfolio, blog, workshops, and testimonials loaded from Cloudflare D1 (SQLite) via REST API
- **Working Forms** — Hire form and newsletter signup submit to the Worker API and persist in D1
- **Workshop Bookings** — Real-time spot tracking with booking modal
- **Admin Panel** — Token-protected dashboard at `/admin.html` to manage all content
- **Portfolio Gallery** — Filterable grid (All / Paintings / Sketches / Mixed Media) with designed lightbox detail view
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile
- **Dark Theme** — Elegant dark aesthetic with accent colors (`#e63946`, `#f4a261`)
- **Security Headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **SEO Optimized** — Meta descriptions, Open Graph, Twitter Cards, canonical URLs, JSON-LD structured data, sitemap, robots.txt
- **Graceful Fallback** — If the API is unavailable, pages render from static HTML

## Tech Stack

- **Cloudflare Workers** — Edge compute runtime for API + static asset serving
- **Cloudflare D1** — SQLite database at the edge (portfolio, posts, inquiries, subscribers, workshops, bookings, testimonials)
- **HTML5** — Semantic markup with accessibility considerations
- **CSS3** — Custom properties, CSS Grid, Flexbox, aspect-ratio, backdrop-filter, keyframe animations
- **Vanilla JavaScript** — No frameworks or dependencies
- **Google Fonts** — Playfair Display (headings) + Inter (body)
- **Font Awesome 6.5** — Icon library via CDN

## Project Structure

```
ksart/
├── worker.js           # Cloudflare Worker — API router + static asset server
├── wrangler.json       # Wrangler config (D1 binding, assets, secrets)
├── schema.sql          # D1 database schema + seed data
├── build.js            # Build script — copies site files to dist/
├── package.json        # npm scripts (build, deploy, db:migrate)
├── index.html          # Homepage (dynamic portfolio, testimonials, newsletter)
├── blog.html           # Art blog (dynamic posts from D1)
├── travel.html         # Travel blog
├── hire.html           # Commission form (→ API → D1)
├── workshops.html      # Dynamic workshops + booking modal
├── book.html           # Booking page
├── admin.html          # Admin dashboard (token-protected)
├── css/
│   └── style.css       # All styles
├── js/
│   ├── api.js          # Frontend API client
│   └── main.js         # UI interactivity + dynamic content loaders
├── img/                # Artwork & profile images
├── sitemap.xml         # XML sitemap with image entries
├── robots.txt          # Crawler directives
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/portfolio` | — | List portfolio items (filterable by `?category=`) |
| GET | `/api/portfolio/:id` | — | Get single item by ID or slug |
| POST | `/api/portfolio` | Bearer | Create portfolio item |
| PUT | `/api/portfolio/:id` | Bearer | Update portfolio item |
| DELETE | `/api/portfolio/:id` | Bearer | Delete portfolio item |
| GET | `/api/posts` | — | List published blog posts |
| GET | `/api/posts/:slug` | — | Get full post by slug |
| POST | `/api/posts` | Bearer | Create post |
| PUT | `/api/posts/:id` | Bearer | Update post |
| DELETE | `/api/posts/:id` | Bearer | Delete post |
| GET | `/api/workshops` | — | List active workshops |
| POST | `/api/workshops` | Bearer | Create workshop |
| POST | `/api/bookings` | — | Book a workshop |
| GET | `/api/bookings` | Bearer | List all bookings |
| POST | `/api/inquiries` | — | Submit hire form inquiry |
| GET | `/api/inquiries` | Bearer | List all inquiries |
| PUT | `/api/inquiries/:id` | Bearer | Update inquiry status |
| POST | `/api/subscribe` | — | Newsletter signup |
| GET | `/api/subscribers` | Bearer | List subscribers |
| GET | `/api/testimonials` | — | List featured testimonials |
| GET | `/api/stats` | Bearer | Dashboard stats |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (installed as dev dependency)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mykel4l/ksart.git
   cd ksart
   npm install
   ```

2. **Create the D1 database**
   ```bash
   npx wrangler d1 create ksart-db
   ```
   Copy the `database_id` from the output and paste it into `wrangler.json` → `d1_databases[0].database_id`.

3. **Run the schema + seed data**
   ```bash
   npx wrangler d1 execute ksart-db --file=schema.sql --remote
   ```

4. **Set your admin token**
   Edit `wrangler.json` → `vars.ADMIN_TOKEN` to a secure random string. Or use a secret:
   ```bash
   npx wrangler secret put ADMIN_TOKEN
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

### Local Development

```bash
# Migrate DB locally
npx wrangler d1 execute ksart-db --file=schema.sql --local

# Start dev server
npm run dev
```

## Configuration

- **Domain / URLs** — Search for `kseniaart.studio` across HTML files and `sitemap.xml` to update canonical URLs and OG tags.
- **Email** — Contact email is `kseniaart134@gmail.com` in `hire.html` and `book.html`.
- **Admin Token** — Set `ADMIN_TOKEN` in `wrangler.json` or via `wrangler secret put`. Use it to log in at `/admin.html`.
- **Images** — Swap files in `img/` and update the `image_url` column in D1 via the admin panel or API.

## License

© Ksenia Art. All rights reserved.
