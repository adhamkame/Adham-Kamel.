/* ==========================================
   ADHAM KAMEL - PORTFOLIO JAVASCRIPT
   Version: 2.0 - Premium Interactive
   ========================================== */

'use strict';

// ==========================================
// LOADING SCREEN
// ==========================================
document.body.classList.add('no-scroll');

window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('done');
            document.body.classList.remove('no-scroll');
        }
        // Trigger initial animations
        setTimeout(animateOnScroll, 300);
    }, 2500);
});

// ==========================================
// CUSTOM CURSOR
// ==========================================
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    (function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.12;
        outlineY += (mouseY - outlineY) * 0.12;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    })();

    // Hover effect
    document.querySelectorAll('a, button, .nav-toggle, .project-card, .skill-card, .cert-card, .highlight-card, .contact-info-card, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('active'));
    });
}

// ==========================================
// PARTICLES BACKGROUND
// ==========================================
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mousePos = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Mouse repulsion
            if (mousePos.x !== null) {
                const dx = mousePos.x - this.x;
                const dy = mousePos.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mousePos.radius) {
                    const force = (mousePos.radius - dist) / mousePos.radius;
                    this.x -= dx * force * 0.015;
                    this.y -= dy * force * 0.015;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const opacity = (1 - dist / 130) * 0.12;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}

// ==========================================
// NAVIGATION
// ==========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const backToTop = document.getElementById('backToTop');

// Scroll handler
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar scroll
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Back to top
    backToTop.classList.toggle('visible', scrollY > 500);

    // Update progress circle
    updateScrollProgress();

    // Active nav
    updateActiveNav();

    // Scroll animations
    animateOnScroll();

    lastScroll = scrollY;
});

// Mobile toggle
navToggle.addEventListener('click', () => {
    const isActive = navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active', isActive);
    document.body.classList.toggle('no-scroll', isActive);
});

// Close mobile on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Back to top
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll progress on back to top button
function updateScrollProgress() {
    const circle = document.querySelector('.back-to-top-circle circle');
    if (!circle) return;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = window.scrollY / scrollHeight;
    const dashOffset = 283 - (283 * scrollPercent);
    circle.style.strokeDashoffset = dashOffset;
}

// ==========================================
// ACTIVE NAV LINK
// ==========================================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === id);
            });
        }
    });
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================
const typewriterEl = document.getElementById('typewriter');
const titles = [
    'Web Developer',
    'Angular Developer',
    'Frontend Engineer',
    'UI/UX Enthusiast',
    'Creative Problem Solver'
];

let titleIdx = 0;
let charIdx = 0;
let deleting = false;

function typewriterLoop() {
    const current = titles[titleIdx];

    if (deleting) {
        charIdx--;
        typewriterEl.textContent = current.substring(0, charIdx);
    } else {
        charIdx++;
        typewriterEl.textContent = current.substring(0, charIdx);
    }

    let speed = deleting ? 40 : 80;

    if (!deleting && charIdx === current.length) {
        speed = 2500;
        deleting = true;
    } else if (deleting && charIdx === 0) {
        deleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        speed = 400;
    }

    setTimeout(typewriterLoop, speed);
}

setTimeout(typewriterLoop, 3000);

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function animateOnScroll() {
    // Data-animate elements
    document.querySelectorAll('[data-animate]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add('visible');
        }
    });

    // Skill bars
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50 && bar.style.width === '0%') {
            bar.style.width = bar.dataset.width;
        }
    });
}

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    function update() {
        current += increment;
        if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }
    update();
}

// Observe counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ==========================================
// STAGGER CARD ANIMATIONS
// ==========================================
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.children;
            Array.from(cards).forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 100);
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.skills-grid, .projects-grid, .certificates-grid, .about-highlight-cards, .contact-info-grid').forEach(grid => {
    staggerObserver.observe(grid);
});

// ==========================================
// 3D TILT EFFECT ON CARDS
// ==========================================
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = (y - cy) / 18;
            const rotateY = (cx - x) / 18;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ==========================================
// PARALLAX ON HERO
// ==========================================
if (window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');

        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
            heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
        }
        if (heroVisual && scrollY < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
    });
}

// ==========================================
// MAGNETIC BUTTONS
// ==========================================
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn, .social-link, .nav-logo').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==========================================
// CONTACT FORM - WHATSAPP
// ==========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Your WhatsApp number
        const phoneNumber = '201204407183';

        // Create WhatsApp message
        const whatsappMessage = `Hello Adham 👋

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`;

        // Create WhatsApp URL
        const whatsappURL =
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Open WhatsApp
        window.open(whatsappURL, '_blank');
    });
}
// ==========================================
// FOOTER YEAR
// ==========================================
const yearEl = document.getElementById('current-year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ==========================================
// ABOUT TEXT REVEAL
// ==========================================
const textRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            textRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.about-text p').forEach((p, i) => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(20px)';
    p.style.transition = `all 0.5s ease ${i * 0.15}s`;
    textRevealObserver.observe(p);
});

// ==========================================
// CONSOLE BRANDING
// ==========================================
console.log(
    '%c 🚀 Adham Kamel | Web Developer Portfolio ',
    'background: linear-gradient(135deg, #00d4ff, #7c3aed); color: #0a0a1a; font-size: 14px; padding: 10px 20px; border-radius: 6px; font-weight: bold;'
);
console.log(
    '%c Built with passion, creativity, and lots of ☕',
    'color: #9898b0; font-size: 11px;'
);