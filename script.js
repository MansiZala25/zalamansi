/* ==========================================================================
   MansiVerse Premium Portfolio JavaScript Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Libraries & Components
    initThreeBackground();
    initAOS();
    initNavbar();
    initCustomCursor();
    initTypewriter();
    initCounters();
    initSkillsFill();
    initPortfolioFilters();
    initProjectModal();
    initContactForm();
});

/* ==========================================================================
   AOS (Animate On Scroll)
   ========================================================================== */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 120,
            easing: 'ease-out-cubic'
        });
    }
}

/* ==========================================================================
   THREE.JS PARTICLE BACKGROUND
   ========================================================================== */
function initThreeBackground() {
    const container = document.getElementById('particles-js');
    if (!container) return;

    let scene, camera, renderer, particles;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 2000);
        camera.position.z = 1000;

        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        // Generate 1200 random particles
        const particleCount = 1200;
        for (let i = 0; i < particleCount; i++) {
            vertices.push(
                Math.random() * 2000 - 1000, // x
                Math.random() * 2000 - 1000, // y
                Math.random() * 2000 - 1000  // z
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        // Material config - soft primary & accent blue colors
        const material = new THREE.PointsMaterial({
            color: 0x1E88E5,
            size: 4,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        // Drift background particles slowly
        particles.rotation.x += 0.0008;
        particles.rotation.y += 0.0005;

        // Smooth camera drift based on mouse coordinates
        camera.position.x += (mouseX * 0.25 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.25 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    init();
    animate();
}

/* ==========================================================================
   NAVBAR & PROGRESS BAR
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const progressBar = document.getElementById('scroll-progress');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    // Sticky Scroll Logic & Scroll Progress
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Sticky Header
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progress Bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const scrollPercent = (scrollY / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }

        // Active Link Highlighting
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile Hamburger Toggle
    if (toggle && mobileNav) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }
}

/* ==========================================================================
   CUSTOM CURSOR & GLASS GLOW HOVER MOUSE COORDINATES
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');
    const interactiveElements = document.querySelectorAll('a, button, select, input, textarea, .filter-btn, .portfolio-card');

    if (!cursor || !dot) return;

    document.addEventListener('mousemove', (e) => {
        // Move Custom Cursors with small GSAP delay
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.02 });

        // Update CSS Variables for all glass-cards to follow mouse lighting
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Hover scale effects
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });
}

/* ==========================================================================
   TYPEWRITER EFFECT (Highlight Words: Websites, Brands, Digitally)
   ========================================================================== */
function initTypewriter() {
    const words = ["Websites", "Brands", "Digitally"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let txt = '';
    
    // Target element: We append a typewriter target span in script if needed,
    // or type inside a custom container. Let's find or create a span for highlights.
    const heading = document.querySelector('.hero-heading');
    if (!heading) return;

    // We will target highlights specifically
    const highlightWords = ["Websites", "Brands", "Digitally"];
    
    // We rewrite the title dynamically: "Building Modern Websites & Growing Brands Digitally"
    // Let's create an elegant cycling typewriter animation for the final word:
    // "Building Modern Websites & Growing Brands Digitally" -> Let's keep it clean
}

// Simple and robust typewriter implementation
let wordsList = ["Websites", "Brands", "Digitally"];
let wordIdx = 0;
let charIdx = 0;
let isTypingDelete = false;

function typeWriterEffect() {
    const target = document.querySelector('.highlight-brand');
    if (!target) return;

    const currentWord = wordsList[wordIdx];
    
    if (isTypingDelete) {
        target.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
    } else {
        target.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
    }

    let typeSpeed = isTypingDelete ? 60 : 150;

    if (!isTypingDelete && charIdx === currentWord.length) {
        typeSpeed = 1500; // Hold word
        isTypingDelete = true;
    } else if (isTypingDelete && charIdx === 0) {
        isTypingDelete = false;
        wordIdx = (wordIdx + 1) % wordsList.length;
        typeSpeed = 400; // Pause before next word
    }

    setTimeout(typeWriterEffect, typeSpeed);
}

// Start Typewriter
setTimeout(typeWriterEffect, 1000);

/* ==========================================================================
   ACHIEVEMENT COUNTERS (Intersection Observer)
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length === 0) return;

    const options = {
        threshold: 0.5,
        rootMargin: "0px"
    };

    const countUp = (entry) => {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const duration = 2000; // ms
        const increment = target / (duration / 16); // ~60fps
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current >= target) {
                entry.target.textContent = target + (target === 100 ? '%' : '+');
            } else {
                entry.target.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCount);
            }
        };

        updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   SKILLS PROGRESS FILL (Intersection Observer)
   ========================================================================== */
function initSkillsFill() {
    const skillsSection = document.getElementById('expertise');
    const progressFills = document.querySelectorAll('.skill-progress-bar-fill');

    if (!skillsSection || progressFills.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressFills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = width;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(skillsSection);
}

/* ==========================================================================
   PORTFOLIO FILTER ENGINE
   ========================================================================== */
function initPortfolioFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-card');

    if (filters.length === 0 || cards.length === 0) return;

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active classes
            filters.forEach(btn => btn.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.getAttribute('data-filter');

            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });
}

/* ==========================================================================
   PROJECT DETAILS MODAL & DETAILS DATABASE
   ========================================================================== */
const projectData = {
    veaimpex: {
        title: "VEA Impex Corporate Portal",
        category: "Development",
        desc: "Redesigned a responsive catalog export website for a leading pharma manufacturer. Rewrote frontend templates for mobile optimization, speed improvement, and structured MySQL search indexes.",
        deliverables: "Web Development, Database Design, Responsive Audit",
        tech: "PHP Laravel, MySQL, Bootstrap CSS",
        img: `<svg width="100%" height="100%" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="background:#0B1F3A;">
                <rect x="20" y="30" width="260" height="150" rx="8" fill="#1E3A8A"/>
                <circle cx="60" cy="90" r="30" fill="#38BDF8" opacity="0.8"/>
                <rect x="110" y="70" width="130" height="12" rx="4" fill="#FFFFFF"/>
                <rect x="110" y="95" width="90" height="8" rx="4" fill="#64748B"/>
                <circle cx="220" cy="140" r="15" fill="#34D399" opacity="0.6"/>
              </svg>`
    },
    wpredesign: {
        title: "WordPress Corporate Redesign",
        category: "WordPress",
        desc: "Complete transformation of a business marketing platform. Created custom element grids, clean typography spacing, custom plugins configuration, and optimized search index visibility.",
        deliverables: "Website Redesign, SEO Audits, PageSpeed Optimization",
        tech: "WordPress CMS, Elementor Pro, Custom CSS",
        img: `<svg width="100%" height="100%" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="background:#f1f5f9;">
                <circle cx="150" cy="100" r="50" fill="#1E88E5" opacity="0.1"/>
                <path d="M150 60 C127.9 60 110 77.9 110 100 C110 122.1 127.9 140 150 140 Z" fill="#21759B"/>
              </svg>`
    },
    metaload: {
        title: "Meta Lead Campaigns",
        category: "Digital Marketing",
        desc: "Constructed high-ROI advertising funnels, pixel tracking, lead capture integrations, and target copywriting assets, generating substantial business growth.",
        deliverables: "Meta Ads, Copywriting, Marketing Funnels",
        tech: "Facebook Business Suite, Ads Manager, Canva",
        img: `<svg width="100%" height="100%" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="background:#e0f2fe;">
                <rect x="40" y="40" width="220" height="120" rx="10" fill="#ffffff" stroke="#38BDF8" stroke-width="2"/>
                <path d="M70 120 L110 90 L160 110 L220 70" fill="none" stroke="#1E88E5" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    },
    branding: {
        title: "Logo & Graphic Branding",
        category: "Branding & Design",
        desc: "Created premium client branding guidelines, vector logo assets, corporate brochures, and social media media grids.",
        deliverables: "Branding Guidelines, Canva Layouts, Logo Art",
        tech: "Canva Pro, Adobe Illustrator",
        img: `<svg width="100%" height="100%" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="background:#fae8ff;">
                <polygon points="150,40 240,160 60,160" fill="#38BDF8" opacity="0.6"/>
                <circle cx="150" cy="110" r="45" fill="#c084fc" opacity="0.7"/>
              </svg>`
    }
};

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const triggers = document.querySelectorAll('.portfolio-detail-trigger, .portfolio-card .portfolio-overlay');

    if (!modal || !closeBtn) return;

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            // Get data-project attribute
            let projectKey = '';
            if (trigger.classList.contains('portfolio-detail-trigger')) {
                projectKey = trigger.getAttribute('data-project');
            } else {
                // Clicked overlay, find sibling or child
                const triggerBtn = trigger.closest('.portfolio-card').querySelector('.portfolio-detail-trigger');
                projectKey = triggerBtn.getAttribute('data-project');
            }

            const data = projectData[projectKey];
            if (!data) return;

            // Inject content
            document.getElementById('modal-img-container').innerHTML = data.img;
            document.getElementById('modal-cat').textContent = data.category;
            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-desc').textContent = data.desc;
            document.getElementById('modal-deliverables').textContent = data.deliverables;
            document.getElementById('modal-tech').textContent = data.tech;

            // Open Modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock scroll
    }
}

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            showStatus("Please complete all required fields.", "error");
            return;
        }

        // Visual submit animation
        showStatus("Submitting your project details...", "info");
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        setTimeout(() => {
            showStatus("Thank you! Your details have been submitted successfully. Mansi will contact you shortly.", "success");
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });

    function showStatus(msg, type) {
        status.textContent = msg;
        status.className = "form-status " + type;
    }
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
const backBtn = document.getElementById('back-to-top');
if (backBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    });

    backBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
