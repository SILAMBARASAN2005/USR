/* =========================================
   USR BUILDERS – JavaScript Interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =====================
       NAVBAR – Scroll & Sticky
       ===================== */
    const navbar = document.getElementById('navbar');
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        const scrollY = window.scrollY;

        // Sticky navbar
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();

        // Scroll reveal
        revealElements();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run once on load

    /* =====================
       BACK TO TOP
       ===================== */
    const homeSection = document.getElementById('home');

    backToTop.addEventListener('click', function () {
        if (!homeSection) return;
        const offset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--total-header').trim()) || 130;
        window.history.replaceState(null, '', '#home');
        window.scrollTo({ top: homeSection.offsetTop - offset, behavior: 'smooth' });
    });

    /* =====================
       HAMBURGER MENU
       ===================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when nav link clicked
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* =====================
       ACTIVE NAV LINK
       ===================== */
    function updateActiveNavLink() {
        const scrollY = window.scrollY + 160;
        sections.forEach(function (section) {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + section.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* =====================
       HERO SLIDER
       ===================== */
    const heroSlides = document.querySelectorAll('.hero-slide');
    const slideDots = document.querySelectorAll('#slide-dots .dot');
    const slidePrev = document.getElementById('slide-prev');
    const slideNext = document.getElementById('slide-next');
    let currentSlide = 0;
    let slideTimer;

    function goToSlide(index) {
        heroSlides[currentSlide].classList.remove('active');
        slideDots[currentSlide].classList.remove('active');
        currentSlide = (index + heroSlides.length) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
        slideDots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startSlideTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 5000);
    }

    slideNext.addEventListener('click', function () { nextSlide(); startSlideTimer(); });
    slidePrev.addEventListener('click', function () { prevSlide(); startSlideTimer(); });

    slideDots.forEach(function (dot, index) {
        dot.addEventListener('click', function () { goToSlide(index); startSlideTimer(); });
    });

    startSlideTimer();

    /* =====================
       COUNTER ANIMATION
       ===================== */
    const counters = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;
        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            countersStarted = true;
            counters.forEach(function (counter) {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const start = performance.now();
                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(update);
                    else counter.textContent = target;
                }
                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    setTimeout(animateCounters, 500); // Try on load too

    /* =====================
       PROJECT FILTER
       ===================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(function (card) {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* =====================
       TESTIMONIALS CAROUSEL
       ===================== */
    const track = document.getElementById('testimonials-track');
    const tCards = track ? track.querySelectorAll('.testimonial-card') : [];
    const tDots = document.querySelectorAll('.t-dot');
    const tPrev = document.getElementById('t-prev');
    const tNext = document.getElementById('t-next');
    let tCurrent = 0;
    let tVisible = getVisibleCards();
    let tTimer;

    function getVisibleCards() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function updateCarousel() {
        tVisible = getVisibleCards();
        const maxIndex = Math.max(0, tCards.length - tVisible);
        if (tCurrent > maxIndex) tCurrent = maxIndex;
        const cardWidth = tCards[0] ? tCards[0].offsetWidth + 28 : 0; // gap
        track.style.transform = 'translateX(-' + (tCurrent * cardWidth) + 'px)';
        // Update dots
        tDots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === tCurrent);
        });
    }

    function tGoNext() {
        const maxIndex = Math.max(0, tCards.length - getVisibleCards());
        tCurrent = tCurrent >= maxIndex ? 0 : tCurrent + 1;
        updateCarousel();
    }
    function tGoPrev() {
        const maxIndex = Math.max(0, tCards.length - getVisibleCards());
        tCurrent = tCurrent <= 0 ? maxIndex : tCurrent - 1;
        updateCarousel();
    }

    if (tNext) tNext.addEventListener('click', function () { tGoNext(); clearInterval(tTimer); startTTimer(); });
    if (tPrev) tPrev.addEventListener('click', function () { tGoPrev(); clearInterval(tTimer); startTTimer(); });

    tDots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            tCurrent = index;
            updateCarousel();
        });
    });

    function startTTimer() {
        tTimer = setInterval(tGoNext, 4500);
    }

    window.addEventListener('resize', function () {
        updateCarousel();
    });

    startTTimer();
    setTimeout(updateCarousel, 100);

    /* =====================
       CONTACT FORM
       ===================== */
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formResetBtn = document.getElementById('form-reset-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const service = document.getElementById('form-service').value;
            const budget = document.getElementById('form-budget').value;
            const message = document.getElementById('form-message').value.trim();

            if (!name || !phone || !service || !message) {
                if (!name) document.getElementById('form-name').style.borderColor = '#c0392b';
                if (!phone) document.getElementById('form-phone').style.borderColor = '#c0392b';
                if (!service) document.getElementById('form-service').style.borderColor = '#c0392b';
                if (!message) document.getElementById('form-message').style.borderColor = '#c0392b';
                return;
            }

            const submitBtn = document.getElementById('form-submit-btn');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Use relative URL so it works in production and development
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        email,
                        service,
                        budget,
                        message
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Failed to send email');
                }

                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                contactForm.reset();
            } catch (error) {
                console.error('Email error:', error);
                alert('Failed to send email: ' + error.message);
                submitBtn.textContent = 'Send Request';
                submitBtn.disabled = false;
            }
        });

        // Reset border color on input
        contactForm.querySelectorAll('input, select').forEach(function (el) {
            el.addEventListener('input', function () {
                el.style.borderColor = '';
            });
        });
    }

    if (formResetBtn) {
        formResetBtn.addEventListener('click', function () {
            contactForm.style.display = 'block';
            formSuccess.style.display = 'none';
            contactForm.reset();
            const submitBtn = document.getElementById('form-submit-btn');
            submitBtn.textContent = 'Send Request';
            submitBtn.disabled = false;
        });
    }

    const contactFloat = document.getElementById('contact-float');
    const contactFloatToggle = document.getElementById('contact-float-toggle');

    if (contactFloat && contactFloatToggle) {
        contactFloatToggle.addEventListener('click', function () {
            const isOpen = contactFloat.classList.toggle('open');
            contactFloatToggle.setAttribute('aria-expanded', String(isOpen));
            contactFloatToggle.setAttribute('aria-label', isOpen ? 'Close contact options' : 'Open contact options');
        });

        document.addEventListener('click', function (event) {
            if (!contactFloat.contains(event.target)) {
                contactFloat.classList.remove('open');
                contactFloatToggle.setAttribute('aria-expanded', 'false');
                contactFloatToggle.setAttribute('aria-label', 'Open contact options');
            }
        });
    }

    /* =====================
       NEWSLETTER FORM
       ===================== */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const btn = document.getElementById('newsletter-submit-btn');
            btn.textContent = '✓';
            btn.style.background = '#2d8a4e';
            emailInput.value = '';
            setTimeout(function () {
                btn.textContent = '→';
                btn.style.background = '';
            }, 3000);
        });
    }

    /* =====================
       SCROLL REVEAL
       ===================== */
    function addRevealClasses() {
        // Add reveal class to key elements
        const elementsToReveal = [
            '.service-card',
            '.project-card',
            '.why-card',
            '.testimonial-card',
            '.contact-card',
            '.process-step',
            '.about-grid',
            '.footer-grid > *'
        ];

        elementsToReveal.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el, index) {
                if (!el.classList.contains('reveal')) {
                    el.classList.add('reveal');
                    if (index % 4 === 1) el.classList.add('reveal-delay-1');
                    if (index % 4 === 2) el.classList.add('reveal-delay-2');
                    if (index % 4 === 3) el.classList.add('reveal-delay-3');
                }
            });
        });
    }

    function revealElements() {
        document.querySelectorAll('.reveal:not(.revealed)').forEach(function (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('revealed');
            }
        });
    }

    addRevealClasses();
    revealElements();

    /* =====================
       SMOOTH SCROLL
       ===================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--total-header').trim()) || 130;
                const top = target.offsetTop - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* =====================
       HEADER TOP INFO TICKER (mobile)
       ===================== */
    // Ensure header height CSS variable is accurate
    function setHeaderHeight() {
        const hTop = document.querySelector('.header-top');
        const hNav = document.querySelector('.navbar');
        if (hTop && hNav) {
            const total = hTop.offsetHeight + hNav.offsetHeight;
            document.documentElement.style.setProperty('--total-header', total + 'px');
        }
    }
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    /* =====================
       SERVICE CARD HOVER EFFECT (touch devices)
       ===================== */
    if ('ontouchstart' in window) {
        document.querySelectorAll('.project-card').forEach(function (card) {
            card.addEventListener('touchstart', function () {
                this.classList.toggle('touch-active');
            }, { passive: true });
        });
    }

    console.log('%cUSR Builders Website Loaded', 'color:#c9972b;font-size:18px;font-weight:bold;');
    console.log('%cBuilding Dreams Into Reality 🏗️', 'color:#1a3a5c;font-size:14px;');
});
