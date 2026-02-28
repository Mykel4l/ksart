/* ============================================
   KS ART — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Loader ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
    }

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Stat Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const start = performance.now();

            const updateCounter = (timestamp) => {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                stat.textContent = Math.floor(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    // Trigger counters when hero stats are visible
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateCounters, 500);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // --- Portfolio Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxMeta = document.getElementById('lightboxMeta');
    const lightboxDownload = document.getElementById('lightboxDownload');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox) {
        document.querySelectorAll('.portfolio-card').forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('.portfolio-card-img img');
                const info = card.querySelector('.portfolio-card-info');
                const category = info ? info.querySelector('.portfolio-category') : null;
                const title = info ? info.querySelector('h3') : null;
                const desc = info ? info.querySelector('p') : null;
                const meta = info ? info.querySelector('.portfolio-card-meta') : null;

                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxTag.textContent = category ? category.textContent : '';
                lightboxTitle.textContent = title ? title.textContent : '';
                lightboxDesc.textContent = desc ? desc.textContent : '';
                lightboxMeta.innerHTML = meta ? meta.innerHTML : '';

                // View Full Size button
                lightboxDownload.onclick = () => window.open(img.src, '_blank');

                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content') === false && !e.target.closest('.lightbox-content')) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // --- Testimonial Slider ---
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testPrev = document.getElementById('testPrev');
    const testNext = document.getElementById('testNext');

    if (testimonialTrack) {
        let currentSlide = 0;
        const slides = testimonialTrack.querySelectorAll('.testimonial-card');
        const totalSlides = slides.length;

        function goToSlide(index) {
            currentSlide = (index + totalSlides) % totalSlides;
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        if (testPrev) testPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
        if (testNext) testNext.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Auto-play
        let autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);

        testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
        testimonialTrack.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll(
        '.about, .about-grid > *, .service-card, .portfolio-item, .blog-card, .travel-card, .hire-detail, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Newsletter Form ---
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const email = input.value.trim();
            
            if (email && email.includes('@')) {
                try {
                    await API.subscribe(email);
                    input.value = '';
                    input.placeholder = 'Subscribed! ✓';
                } catch (err) {
                    input.placeholder = 'Already subscribed!';
                }
                setTimeout(() => { input.placeholder = 'Your email address'; }, 3000);
            }
        });
    }

    // --- Hire Form ---
    const hireForm = document.getElementById('hireForm');
    if (hireForm) {
        hireForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = hireForm.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            const formData = new FormData(hireForm);
            const data = Object.fromEntries(formData);
            
            try {
                await API.submitInquiry(data);
                hireForm.style.display = 'none';
                const success = document.querySelector('.form-success');
                if (success) success.classList.add('show');
            } catch (err) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                alert('Something went wrong. Please try again or email kseniaart134@gmail.com directly.');
            }
        });
    }

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Active nav link highlight ---
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // --- Parallax effect for hero ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }
        });
    }

    // --- Image lazy loading with fade ---
    const images = document.querySelectorAll('img[data-src]');
    if (images.length) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // Dynamic Content Loaders
    // ============================================

    // --- Dynamic Portfolio (index.html) ---
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid && typeof API !== 'undefined') {
        loadPortfolio();
    }

    async function loadPortfolio(category) {
        if (!portfolioGrid) return;
        try {
            const items = await API.getPortfolio(category);
            portfolioGrid.innerHTML = items.map(item => `
                <div class="portfolio-item ${item.featured ? 'reveal visible' : 'reveal visible'}" data-category="${item.category}">
                    <div class="portfolio-card" data-slug="${item.slug}">
                        <div class="portfolio-card-img">
                            <img src="${item.image_url}" alt="${item.title} — ${item.medium} artwork by Ksenia" loading="lazy">
                            <div class="portfolio-overlay">
                                <span class="portfolio-category">${item.category === 'mixed' ? 'Mixed Media' : item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                            </div>
                        </div>
                        <div class="portfolio-card-info">
                            <span class="portfolio-category">${item.category === 'mixed' ? 'Mixed Media' : item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                            <h3>${item.title}</h3>
                            <p>${item.description || ''}</p>
                            <div class="portfolio-card-meta">
                                <span><i class="fas fa-ruler-combined"></i> ${item.dimensions || ''}</span>
                                <span><i class="fas fa-palette"></i> ${item.medium || ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            // Re-bind lightbox clicks
            bindPortfolioLightbox();
            // Re-bind filter buttons for dynamic data
            bindPortfolioFilters();
        } catch (e) {
            console.log('Portfolio: using static HTML (API unavailable)');
        }
    }

    function bindPortfolioLightbox() {
        document.querySelectorAll('.portfolio-card').forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('.portfolio-card-img img');
                const info = card.querySelector('.portfolio-card-info');
                const category = info ? info.querySelector('.portfolio-category') : null;
                const title = info ? info.querySelector('h3') : null;
                const desc = info ? info.querySelector('p') : null;
                const meta = info ? info.querySelector('.portfolio-card-meta') : null;

                if (lightbox) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightboxTag.textContent = category ? category.textContent : '';
                    lightboxTitle.textContent = title ? title.textContent : '';
                    lightboxDesc.textContent = desc ? desc.textContent : '';
                    lightboxMeta.innerHTML = meta ? meta.innerHTML : '';
                    lightboxDownload.onclick = () => window.open(img.src, '_blank');
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    function bindPortfolioFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            // Remove old listeners by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', async () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                newBtn.classList.add('active');
                const filter = newBtn.dataset.filter;

                if (typeof API !== 'undefined') {
                    await loadPortfolio(filter === 'all' ? null : filter);
                } else {
                    // Fallback: static filtering
                    document.querySelectorAll('.portfolio-item').forEach(item => {
                        if (filter === 'all' || item.dataset.category === filter) {
                            item.classList.remove('hidden');
                            item.style.animation = 'fadeUp 0.5s ease forwards';
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                }
            });
        });
    }

    // --- Dynamic Blog (blog.html) ---
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid && typeof API !== 'undefined') {
        loadBlogPosts();
    }

    async function loadBlogPosts() {
        if (!blogGrid) return;
        try {
            const posts = await API.getPosts();
            blogGrid.innerHTML = posts.map(post => {
                const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                return `
                <article class="blog-card reveal visible">
                    <div class="blog-card-image">
                        <img src="${post.cover_image}" alt="${post.title}" loading="lazy">
                        <span class="blog-category">${post.category}</span>
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-meta">
                            <span><i class="far fa-calendar"></i> ${date}</span>
                            <span><i class="far fa-clock"></i> ${post.read_time} min read</span>
                        </div>
                        <h3>${post.title}</h3>
                        <p>${post.excerpt}</p>
                        <a href="/post.html?slug=${post.slug}" class="read-more">Read Article <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
            `}).join('');
        } catch (e) {
            console.log('Blog: using static HTML (API unavailable)');
        }
    }

    // --- Dynamic Workshops (workshops.html) ---
    const workshopGrid = document.getElementById('workshopGrid');
    if (workshopGrid && typeof API !== 'undefined') {
        loadWorkshops();
    }

    async function loadWorkshops() {
        if (!workshopGrid) return;
        try {
            const workshops = await API.getWorkshops();
            workshopGrid.innerHTML = workshops.map(ws => `
                <div class="workshop-card reveal visible">
                    <div class="workshop-card-image">
                        <img src="${ws.image_url}" alt="${ws.title}" loading="lazy">
                        <span class="workshop-level">${ws.level}</span>
                    </div>
                    <div class="workshop-card-content">
                        <h3>${ws.title}</h3>
                        <p>${ws.description}</p>
                        <div class="workshop-details">
                            <span><i class="far fa-calendar"></i> ${new Date(ws.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</span>
                            <span><i class="far fa-clock"></i> ${ws.time}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${ws.location}</span>
                            <span><i class="fas fa-users"></i> ${ws.spots_left} spots left</span>
                        </div>
                        <div class="workshop-footer">
                            <span class="workshop-price">$${ws.price}</span>
                            <button class="btn btn-primary btn-book-workshop" data-id="${ws.id}" data-title="${ws.title}" ${ws.spots_left <= 0 ? 'disabled' : ''}>
                                ${ws.spots_left <= 0 ? 'Sold Out' : 'Book Now'}
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Bind booking buttons
            document.querySelectorAll('.btn-book-workshop').forEach(btn => {
                btn.addEventListener('click', () => {
                    const workshopId = btn.dataset.id;
                    const workshopTitle = btn.dataset.title;
                    showBookingModal(workshopId, workshopTitle);
                });
            });
        } catch (e) {
            console.log('Workshops: using static HTML (API unavailable)');
        }
    }

    // --- Dynamic Testimonials (index.html) ---
    const testimonialTrackEl = document.getElementById('testimonialTrack');
    if (testimonialTrackEl && typeof API !== 'undefined') {
        loadTestimonials();
    }

    async function loadTestimonials() {
        if (!testimonialTrackEl) return;
        try {
            const testimonials = await API.getTestimonials();
            if (testimonials.length) {
                testimonialTrackEl.innerHTML = testimonials.map(t => `
                    <div class="testimonial-card">
                        <div class="testimonial-stars">
                            ${'<i class="fas fa-star"></i>'.repeat(t.rating)}
                        </div>
                        <p>"${t.quote}"</p>
                        <div class="testimonial-author">
                            <div class="testimonial-avatar">${t.name.charAt(0)}</div>
                            <div>
                                <strong>${t.name}</strong>
                                <span>${t.role || ''}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (e) {
            console.log('Testimonials: using static HTML (API unavailable)');
        }
    }

    // --- Booking Modal ---
    function showBookingModal(workshopId, workshopTitle) {
        // Check if modal already exists
        let modal = document.getElementById('bookingModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bookingModal';
            modal.className = 'lightbox';
            modal.innerHTML = `
                <div class="lightbox-content" style="grid-template-columns:1fr; max-width:500px; padding:40px;">
                    <button class="lightbox-close" onclick="this.closest('.lightbox').classList.remove('active'); document.body.style.overflow='';">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2 class="lightbox-title" id="bookingTitle" style="margin-bottom:24px;"></h2>
                    <form id="bookingForm">
                        <input type="hidden" id="bookingWorkshopId" name="workshop_id">
                        <div class="form-group" style="margin-bottom:16px;">
                            <label for="bookingName">Full Name *</label>
                            <input type="text" id="bookingName" name="name" required style="width:100%; padding:12px; background:var(--dark-3); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--white);">
                        </div>
                        <div class="form-group" style="margin-bottom:16px;">
                            <label for="bookingEmail">Email *</label>
                            <input type="email" id="bookingEmail" name="email" required style="width:100%; padding:12px; background:var(--dark-3); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--white);">
                        </div>
                        <div class="form-group" style="margin-bottom:16px;">
                            <label for="bookingGuests">Guests</label>
                            <input type="number" id="bookingGuests" name="guests" value="1" min="1" max="5" style="width:100%; padding:12px; background:var(--dark-3); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--white);">
                        </div>
                        <div class="form-group" style="margin-bottom:24px;">
                            <label for="bookingNotes">Notes (optional)</label>
                            <textarea id="bookingNotes" name="notes" rows="3" style="width:100%; padding:12px; background:var(--dark-3); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--white); resize:vertical;"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;"><i class="fas fa-check"></i> Confirm Booking</button>
                    </form>
                    <div id="bookingSuccess" style="display:none; text-align:center; padding:20px 0;">
                        <i class="fas fa-check-circle" style="font-size:3rem; color:var(--primary); margin-bottom:16px;"></i>
                        <h3 style="color:var(--white);">Booking Confirmed!</h3>
                        <p style="color:var(--gray);">Check your email for confirmation details.</p>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Handle booking submit
            document.getElementById('bookingForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const btn = form.querySelector('button[type="submit"]');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
                btn.disabled = true;

                try {
                    await API.createBooking({
                        workshop_id: parseInt(document.getElementById('bookingWorkshopId').value),
                        name: document.getElementById('bookingName').value,
                        email: document.getElementById('bookingEmail').value,
                        guests: parseInt(document.getElementById('bookingGuests').value) || 1,
                        notes: document.getElementById('bookingNotes').value,
                    });
                    form.style.display = 'none';
                    document.getElementById('bookingSuccess').style.display = 'block';
                    // Refresh workshops
                    setTimeout(() => loadWorkshops(), 1000);
                } catch (err) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Confirm Booking';
                    btn.disabled = false;
                    alert(err.message || 'Booking failed. Please try again.');
                }
            });

            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Reset and show
        document.getElementById('bookingWorkshopId').value = workshopId;
        document.getElementById('bookingTitle').textContent = 'Book: ' + workshopTitle;
        document.getElementById('bookingForm').style.display = '';
        document.getElementById('bookingForm').reset();
        document.getElementById('bookingSuccess').style.display = 'none';
        const btn = document.querySelector('#bookingForm button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-check"></i> Confirm Booking';
        btn.disabled = false;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

});
