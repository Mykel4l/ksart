/* ============================================
   KS ART — Cloudflare Worker (Dynamic)
   ============================================ */

// ---- Helpers ----

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });

const err = (message, status = 400) => json({ error: message }, status);

const cors = (methods = "GET, POST, PUT, DELETE, OPTIONS") =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": methods,
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Simple auth check for admin routes
function isAuthed(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  return token === env.ADMIN_TOKEN;
}

// ---- Router ----

class Router {
  constructor() {
    this.routes = [];
  }

  add(method, pattern, handler) {
    const regex = new RegExp(
      "^" + pattern.replace(/:(\w+)/g, "(?<$1>[^/]+)") + "$"
    );
    this.routes.push({ method, regex, handler });
  }

  get(p, h) { this.add("GET", p, h); }
  post(p, h) { this.add("POST", p, h); }
  put(p, h) { this.add("PUT", p, h); }
  delete(p, h) { this.add("DELETE", p, h); }

  match(method, pathname) {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const match = pathname.match(route.regex);
      if (match) return { handler: route.handler, params: match.groups || {} };
    }
    return null;
  }
}

// ---- API Routes ----

const api = new Router();

// -- Portfolio --

api.get("/api/portfolio", async (req, env) => {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured");

  let query = "SELECT * FROM portfolio";
  const conditions = [];
  const binds = [];

  if (category && category !== "all") {
    conditions.push("category = ?");
    binds.push(category);
  }
  if (featured === "1") {
    conditions.push("featured = 1");
  }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY sort_order ASC";

  const { results } = await env.DB.prepare(query).bind(...binds).all();
  return json(results);
});

api.get("/api/portfolio/:id", async (req, env, { id }) => {
  const item = await env.DB.prepare("SELECT * FROM portfolio WHERE id = ? OR slug = ?").bind(id, id).first();
  return item ? json(item) : err("Not found", 404);
});

api.post("/api/portfolio", async (req, env) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const body = await req.json();
  const slug = body.slug || slugify(body.title);
  const { success } = await env.DB.prepare(
    `INSERT INTO portfolio (title, slug, category, description, image_url, dimensions, medium, year, featured, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(body.title, slug, body.category || "painting", body.description || "", body.image_url, body.dimensions || "", body.medium || "", body.year || new Date().getFullYear(), body.featured ? 1 : 0, body.sort_order || 0).run();
  return success ? json({ ok: true, slug }, 201) : err("Insert failed");
});

api.put("/api/portfolio/:id", async (req, env, { id }) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const body = await req.json();
  const { success } = await env.DB.prepare(
    `UPDATE portfolio SET title=?, category=?, description=?, image_url=?, dimensions=?, medium=?, year=?, featured=?, sort_order=?, updated_at=datetime('now') WHERE id=?`
  ).bind(body.title, body.category, body.description, body.image_url, body.dimensions, body.medium, body.year, body.featured ? 1 : 0, body.sort_order || 0, id).run();
  return success ? json({ ok: true }) : err("Update failed");
});

api.delete("/api/portfolio/:id", async (req, env, { id }) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  await env.DB.prepare("DELETE FROM portfolio WHERE id = ?").bind(id).run();
  return json({ ok: true });
});

// -- Blog Posts --

api.get("/api/posts", async (req, env) => {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const all = url.searchParams.get("all");

  let query = "SELECT id, title, slug, excerpt, cover_image, category, tags, read_time, published, published_at, created_at FROM posts";
  const conditions = [];
  const binds = [];

  if (!all || !isAuthed(req, env)) {
    conditions.push("published = 1");
  }
  if (category) {
    conditions.push("category = ?");
    binds.push(category);
  }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY published_at DESC";

  const { results } = await env.DB.prepare(query).bind(...binds).all();
  return json(results);
});

api.get("/api/posts/:slug", async (req, env, { slug }) => {
  const post = await env.DB.prepare("SELECT * FROM posts WHERE slug = ? OR id = ?").bind(slug, slug).first();
  return post ? json(post) : err("Not found", 404);
});

api.post("/api/posts", async (req, env) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const body = await req.json();
  const slug = body.slug || slugify(body.title);
  const { success } = await env.DB.prepare(
    `INSERT INTO posts (title, slug, excerpt, body, cover_image, category, tags, read_time, published, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(body.title, slug, body.excerpt || "", body.body, body.cover_image || "", body.category || "art", JSON.stringify(body.tags || []), body.read_time || 5, body.published ? 1 : 0, body.published ? new Date().toISOString() : null).run();
  return success ? json({ ok: true, slug }, 201) : err("Insert failed");
});

api.put("/api/posts/:id", async (req, env, { id }) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const body = await req.json();
  const { success } = await env.DB.prepare(
    `UPDATE posts SET title=?, excerpt=?, body=?, cover_image=?, category=?, tags=?, read_time=?, published=?, published_at=COALESCE(published_at, CASE WHEN ? THEN datetime('now') ELSE NULL END), updated_at=datetime('now') WHERE id=?`
  ).bind(body.title, body.excerpt, body.body, body.cover_image, body.category, JSON.stringify(body.tags || []), body.read_time, body.published ? 1 : 0, body.published ? 1 : 0, id).run();
  return success ? json({ ok: true }) : err("Update failed");
});

api.delete("/api/posts/:id", async (req, env, { id }) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  return json({ ok: true });
});

// -- Workshops --

api.get("/api/workshops", async (req, env) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM workshops WHERE active = 1 ORDER BY date ASC"
  ).all();
  return json(results);
});

api.get("/api/workshops/:slug", async (req, env, { slug }) => {
  const ws = await env.DB.prepare("SELECT * FROM workshops WHERE slug = ? OR id = ?").bind(slug, slug).first();
  return ws ? json(ws) : err("Not found", 404);
});

api.post("/api/workshops", async (req, env) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const body = await req.json();
  const slug = body.slug || slugify(body.title);
  const { success } = await env.DB.prepare(
    `INSERT INTO workshops (title, slug, description, date, time, duration, location, capacity, spots_left, price, level, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(body.title, slug, body.description, body.date, body.time, body.duration, body.location, body.capacity || 12, body.capacity || 12, body.price, body.level || "All Levels", body.image_url || "").run();
  return success ? json({ ok: true, slug }, 201) : err("Insert failed");
});

// -- Bookings --

api.post("/api/bookings", async (req, env) => {
  const body = await req.json();
  if (!body.workshop_id || !body.name || !body.email) return err("Missing required fields");

  const ws = await env.DB.prepare("SELECT spots_left FROM workshops WHERE id = ?").bind(body.workshop_id).first();
  if (!ws) return err("Workshop not found", 404);
  if (ws.spots_left < (body.guests || 1)) return err("Not enough spots available");

  await env.DB.prepare(
    `INSERT INTO bookings (workshop_id, name, email, guests, notes) VALUES (?, ?, ?, ?, ?)`
  ).bind(body.workshop_id, body.name, body.email, body.guests || 1, body.notes || "").run();

  await env.DB.prepare(
    "UPDATE workshops SET spots_left = spots_left - ? WHERE id = ?"
  ).bind(body.guests || 1, body.workshop_id).run();

  return json({ ok: true, message: "Booking confirmed!" }, 201);
});

api.get("/api/bookings", async (req, env) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const { results } = await env.DB.prepare(
    `SELECT b.*, w.title as workshop_title FROM bookings b
     JOIN workshops w ON b.workshop_id = w.id ORDER BY b.created_at DESC`
  ).all();
  return json(results);
});

// -- Inquiries (Hire form) --

api.post("/api/inquiries", async (req, env) => {
  const body = await req.json();
  if (!body.firstName || !body.email || !body.service || !body.description) {
    return err("Missing required fields");
  }

  const { success } = await env.DB.prepare(
    `INSERT INTO inquiries (first_name, last_name, email, service, budget, timeline, description, reference)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(body.firstName, body.lastName || "", body.email, body.service, body.budget || "", body.timeline || "", body.description, body.reference || "").run();

  return success ? json({ ok: true, message: "Inquiry received! I'll get back to you within 48 hours." }, 201) : err("Submission failed");
});

api.get("/api/inquiries", async (req, env) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const { results } = await env.DB.prepare(
    "SELECT * FROM inquiries ORDER BY created_at DESC"
  ).all();
  return json(results);
});

api.put("/api/inquiries/:id", async (req, env, { id }) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const body = await req.json();
  await env.DB.prepare("UPDATE inquiries SET status = ? WHERE id = ?").bind(body.status, id).run();
  return json({ ok: true });
});

// -- Newsletter --

api.post("/api/subscribe", async (req, env) => {
  const body = await req.json();
  if (!body.email || !body.email.includes("@")) return err("Invalid email");

  try {
    await env.DB.prepare(
      "INSERT INTO subscribers (email) VALUES (?) ON CONFLICT(email) DO UPDATE SET active = 1"
    ).bind(body.email).run();
    return json({ ok: true, message: "Subscribed!" }, 201);
  } catch (e) {
    return json({ ok: true, message: "Already subscribed!" });
  }
});

api.get("/api/subscribers", async (req, env) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const { results } = await env.DB.prepare(
    "SELECT * FROM subscribers WHERE active = 1 ORDER BY subscribed_at DESC"
  ).all();
  return json(results);
});

// -- Testimonials --

api.get("/api/testimonials", async (req, env) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM testimonials WHERE featured = 1 ORDER BY created_at DESC"
  ).all();
  return json(results);
});

api.post("/api/testimonials", async (req, env) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const body = await req.json();
  await env.DB.prepare(
    `INSERT INTO testimonials (name, role, quote, rating, avatar_url, featured) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(body.name, body.role || "", body.quote, body.rating || 5, body.avatar_url || "", body.featured ? 1 : 0).run();
  return json({ ok: true }, 201);
});

// -- Stats (admin dashboard) --

api.get("/api/stats", async (req, env) => {
  if (!isAuthed(req, env)) return err("Unauthorized", 401);
  const [portfolio, posts, inquiries, subscribers, bookings] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as count FROM portfolio").first(),
    env.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE published = 1").first(),
    env.DB.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'").first(),
    env.DB.prepare("SELECT COUNT(*) as count FROM subscribers WHERE active = 1").first(),
    env.DB.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'").first(),
  ]);
  return json({
    portfolio: portfolio.count,
    posts: posts.count,
    newInquiries: inquiries.count,
    subscribers: subscribers.count,
    bookings: bookings.count,
  });
});

// ---- Main Handler ----

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
      return cors();
    }

    // API routes
    if (pathname.startsWith("/api/")) {
      try {
        const match = api.match(request.method, pathname);
        if (match) {
          return await match.handler(request, env, match.params);
        }
        return err("Not found", 404);
      } catch (e) {
        console.error("API Error:", e);
        return err("Internal server error: " + e.message, 500);
      }
    }

    // Static assets
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      const headers = new Headers(response.headers);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("X-Frame-Options", "DENY");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

      const ext = pathname.split(".").pop();
      if (["css", "js", "jpeg", "jpg", "png", "webp", "svg", "woff2"].includes(ext)) {
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        headers.set("Cache-Control", "public, max-age=3600, must-revalidate");
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // 404 fallback
    const fallback = await env.ASSETS.fetch(new Request(new URL("/index.html", url.origin)));
    return new Response(fallback.body, {
      status: 404,
      headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-cache" },
    });
  },
};
