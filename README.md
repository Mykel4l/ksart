# Ksenia Art — Portfolio & Creative Studio

A personal artist portfolio website for **Ksenia**, showcasing expressive paintings, detailed sketches, custom commissions, workshops, and an art-inspired travel blog.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Hero, showcase strip, about section, portfolio gallery with lightbox, services, testimonials, newsletter CTA |
| **Art Blog** | `blog.html` | Articles on creative process, technique breakdowns, and studio updates |
| **Travel Blog** | `travel.html` | Art-inspired travel stories with a featured story and destination cards |
| **Hire Me** | `hire.html` | Commission request form, pricing tiers, process overview, FAQ |
| **Workshops** | `workshops.html` | Upcoming workshop listings, what to expect, private session info |
| **Book Now** | `book.html` | Booking calendar (Bokun widget placeholder) and contact cards |

## Features

- **Portfolio Gallery** — Filterable grid (All / Paintings / Sketches / Mixed Media) with designed lightbox detail view
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile
- **Dark Theme** — Elegant dark aesthetic with accent colors (`#e63946`, `#f4a261`)
- **Scroll Animations** — Intersection Observer–based reveal animations and counter effects
- **Testimonial Slider** — Auto-rotating client testimonials with manual navigation
- **Lightbox** — Split-layout detail view with image, description, dimensions, medium metadata, and action buttons
- **SEO Optimized** — Meta descriptions, Open Graph, Twitter Cards, canonical URLs, JSON-LD structured data, sitemap, robots.txt
- **Smooth Loading** — Animated page loader with fade-in transition

## Tech Stack

- **HTML5** — Semantic markup with accessibility considerations
- **CSS3** — Custom properties, CSS Grid, Flexbox, aspect-ratio, backdrop-filter, keyframe animations
- **Vanilla JavaScript** — No frameworks or dependencies
- **Google Fonts** — Playfair Display (headings) + Inter (body)
- **Font Awesome 6.5** — Icon library via CDN

## Project Structure

```
ksart/
├── index.html          # Homepage
├── blog.html           # Art blog
├── travel.html         # Travel blog
├── hire.html           # Commission / hire page
├── workshops.html      # Workshop listings
├── book.html           # Booking page
├── css/
│   └── style.css       # All styles (~1900 lines)
├── js/
│   └── main.js         # All interactivity (~300 lines)
├── img/                # Artwork & profile images
│   ├── artwork1.jpeg
│   ├── artwork2.jpeg
│   ├── artwork3.jpeg
│   ├── painting1.jpeg
│   ├── painting2.jpeg
│   ├── sketch1.jpeg
│   ├── sketch2.jpeg
│   └── me(ksenia!).jpeg
├── sitemap.xml         # XML sitemap with image entries
├── robots.txt          # Crawler directives
└── README.md
```

## Getting Started

No build step required — this is a static site.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mykel4l/ksart.git
   cd ksart
   ```

2. **Open locally**
   Open `index.html` in a browser, or use a local server:
   ```bash
   # Python
   python -m http.server 8000

   # Node (npx)
   npx serve .

   # VS Code
   # Use the Live Server extension
   ```

3. **Deploy**
   Drop the entire folder onto any static host — GitHub Pages, Netlify, Vercel, or a traditional web server.

## Configuration

- **Domain / URLs** — Search for `kseniaart.studio` across HTML files and `sitemap.xml` to update canonical URLs and OG tags to your actual domain.
- **Email** — Contact email is set to `kseniaart134@gmail.com` in `hire.html` and `book.html`.
- **Booking Widget** — Replace the placeholder calendar in `book.html` with your actual Bokun embed code.
- **Images** — Swap files in `img/` and update the `src` and `alt` attributes in the HTML.

## License

© Ksenia Art. All rights reserved.
