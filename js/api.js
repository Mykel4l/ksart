/* ============================================
   KS ART — API Client
   Shared JS module for all pages to call Worker APIs
   ============================================ */

const API = {
  base: '',  // same origin

  async _fetch(path, opts = {}) {
    const url = this.base + path;
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    const res = await fetch(url, { ...opts, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  // Portfolio
  async getPortfolio(category) {
    const params = category && category !== 'all' ? `?category=${category}` : '';
    return this._fetch(`/api/portfolio${params}`);
  },

  async getPortfolioItem(slug) {
    return this._fetch(`/api/portfolio/${slug}`);
  },

  // Blog posts
  async getPosts(category) {
    const params = category ? `?category=${category}` : '';
    return this._fetch(`/api/posts${params}`);
  },

  async getPost(slug) {
    return this._fetch(`/api/posts/${slug}`);
  },

  // Workshops
  async getWorkshops() {
    return this._fetch('/api/workshops');
  },

  async getWorkshop(slug) {
    return this._fetch(`/api/workshops/${slug}`);
  },

  // Bookings
  async createBooking(data) {
    return this._fetch('/api/bookings', { method: 'POST', body: JSON.stringify(data) });
  },

  // Inquiries (hire form)
  async submitInquiry(data) {
    return this._fetch('/api/inquiries', { method: 'POST', body: JSON.stringify(data) });
  },

  // Newsletter
  async subscribe(email) {
    return this._fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
  },

  // Testimonials
  async getTestimonials() {
    return this._fetch('/api/testimonials');
  },
};
