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
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const email = input.value;
            
            // Simple validation
            if (email && email.includes('@')) {
                input.value = '';
                input.placeholder = 'Subscribed! ✓';
                setTimeout(() => {
                    input.placeholder = 'Your email address';
                }, 3000);
            }
        });
    }

    // --- Hire Form ---
    const hireForm = document.getElementById('hireForm');
    if (hireForm) {
        hireForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const formData = new FormData(hireForm);
            const data = Object.fromEntries(formData);
            
            console.log('Form submission:', data);
            
            // Show success
            hireForm.style.display = 'none';
            const success = document.querySelector('.form-success');
            if (success) success.classList.add('show');
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

});
