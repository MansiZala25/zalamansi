/* ==========================================================================
   INITIALIZATION & SERVICES
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all components
    initHeaderEffects();
    initMobileMenu();
    initParticleBackground();
    initGSAPAnimations();
    initStatsCounter();
    initSkillsAnimation();
    initProjectFilters();
    initSpotlightEffect();
    initContactForm();
});

/* ==========================================================================
   HEADER SCROLL & PROGRESS EFFECTS
   ========================================================================== */
function initHeaderEffects() {
    const header = document.querySelector("header");
    const progress = document.getElementById("scroll-progress");

    window.addEventListener("scroll", () => {
        // Sticky Header compact size & glassmorphism toggle
        if (window.scrollY > 50) {
            header.classList.add("glass-header");
            header.querySelector("nav").classList.remove("py-4");
            header.querySelector("nav").classList.add("py-2.5");
        } else {
            header.classList.remove("glass-header");
            header.querySelector("nav").classList.remove("py-2.5");
            header.querySelector("nav").classList.add("py-4");
        }

        // Top progress bar update
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (winScroll / height) * 100;
        progress.style.width = scrolled + "%";
    });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const menuIcon = document.getElementById("menu-icon");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelectorAll(".mobile-nav-link");

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove("hidden");
            menuIcon.setAttribute("data-lucide", "x");
            lucide.createIcons();
            // GSAP mobile menu slide in
            gsap.fromTo(mobileMenu, 
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
        } else {
            gsap.to(mobileMenu, {
                opacity: 0,
                y: -20,
                duration: 0.2,
                onComplete: () => {
                    mobileMenu.classList.add("hidden");
                    menuIcon.setAttribute("data-lucide", "menu");
                    lucide.createIcons();
                }
            });
        }
    }

    menuToggle.addEventListener("click", toggleMenu);

    // Close menu on nav link clicks
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (isMenuOpen) toggleMenu();
        });
    });
}

/* ==========================================================================
   INTERACTIVE CANVAS PARTICLE BACKGROUND
   ========================================================================== */
function initParticleBackground() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener("mousemove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init();
    });

    // Particle Object
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update coordinates
        update() {
            // Check boundaries
            if (this.x > width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Mouse interaction (repulsion)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * 5;
                    let directionY = forceDirectionY * force * 5;

                    this.x -= directionX;
                    this.y -= directionY;
                }
            }

            this.draw();
        }
    }

    // Populate particles
    function init() {
        particlesArray = [];
        // Scale particle density with screen width
        let numberOfParticles = Math.floor((width * height) / 13000);
        if (numberOfParticles > 90) numberOfParticles = 90;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 2 + 0.5;
            let x = Math.random() * (width - size * 2) + size;
            let y = Math.random() * (height - size * 2) + size;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            // Choose subtle accent colors
            let colors = [
                "rgba(56, 189, 248, 0.15)", // Primary Blue
                "rgba(99, 102, 241, 0.12)", // Indigo
                "rgba(139, 92, 246, 0.1)"   // Purple
            ];
            let color = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles with thin lines
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 130) {
                    opacityValue = 1 - (distance / 130);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.05})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    init();
    animate();
}

/* ==========================================================================
   GSAP & SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initGSAPAnimations() {
    // 1. Hero Content Entrance
    const heroTl = gsap.timeline();
    heroTl.from("header nav", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from("#hero .inline-flex", { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3")
          .from("#hero-name", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
          .from("#hero h3", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
          .from("#hero p", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
          .from("#hero .flex-col, #hero .sm\\:flex-row a", { y: 15, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.4")
          .from("#hero .lg\\:col-span-5", { scale: 0.9, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

    // 2. Section Headers Reveal
    const headers = document.querySelectorAll("section h2, section h3, section .h-1");
    headers.forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    // 3. Grid items fade/slide stagger animations
    animateStaggered(".about-fact-card", "#about");
    animateStaggered(".project-card", "#projects-grid");
    animateStaggered("#services .grid > div", "#services");

    function animateStaggered(selector, trigger) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        gsap.from(elements, {
            scrollTrigger: {
                trigger: trigger,
                start: "top 75%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });
    }

    // 4. Timeline Progress Line height fill
    const progressLine = document.getElementById("timeline-progress-line");
    if (progressLine) {
        gsap.fromTo(progressLine, 
            { height: "0%" },
            {
                scrollTrigger: {
                    trigger: "#experience",
                    start: "top 60%",
                    end: "bottom 60%",
                    scrub: true
                },
                height: "100%",
                ease: "none"
            }
        );
    }

    // Timeline item contents entering
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach(item => {
        const node = item.querySelector(".absolute");
        const leftContent = item.querySelector(".timeline-content-left");
        const rightContent = item.querySelector(".timeline-content-right");

        gsap.from(node, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%"
            },
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: "back.out(2)"
        });

        if (leftContent) {
            gsap.from(leftContent, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%"
                },
                x: -30,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        }

        if (rightContent) {
            gsap.from(rightContent, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%"
                },
                x: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    });
}

/* ==========================================================================
   ANIMATED STATISTICS COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statsData = [
        { id: "stat-years", endVal: 1, suffix: "+" },
        { id: "stat-websites", endVal: 15, suffix: "+" },
        { id: "stat-freelance", endVal: 10, suffix: "+" },
        { id: "stat-campaigns", endVal: 20, suffix: "+" }
    ];

    statsData.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (!element) return;

        ScrollTrigger.create({
            trigger: "#stats",
            start: "top 85%",
            onEnter: () => {
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: stat.endVal,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                        element.innerText = Math.floor(obj.val) + stat.suffix;
                    }
                });
            },
            once: true
        });
    });
}

/* ==========================================================================
   SKILLS SECTION FILL ON SCROLL
   ========================================================================== */
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll("[data-skill-level]");
    
    skillBars.forEach(bar => {
        const targetPercent = bar.getAttribute("data-skill-level");
        
        ScrollTrigger.create({
            trigger: "#skills",
            start: "top 80%",
            onEnter: () => {
                bar.style.width = targetPercent;
            },
            once: true
        });
    });
}

/* ==========================================================================
   INTERACTIVE PROJECT GRID FILTERS
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll("#project-filters button");
    const projectCards = document.querySelectorAll(".project-card");
    const grid = document.getElementById("projects-grid");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active classes
            filterButtons.forEach(btn => {
                btn.classList.remove("active-filter");
                btn.classList.remove("text-white", "bg-white/10");
                btn.classList.add("text-gray-400");
            });

            // Set clicked button active
            button.classList.add("active-filter");
            button.classList.remove("text-gray-400");

            const filterValue = button.getAttribute("data-filter");

            // GSAP stagger out cards, update visibility, stagger back in
            gsap.to(projectCards, {
                opacity: 0,
                scale: 0.9,
                y: 15,
                duration: 0.3,
                stagger: 0.05,
                onComplete: () => {
                    projectCards.forEach(card => {
                        const category = card.getAttribute("data-category");
                        if (filterValue === "all" || category === filterValue) {
                            card.style.display = "flex";
                        } else {
                            card.style.display = "none";
                        }
                    });

                    // Trigger refresh to re-evaluate ScrollTrigger offsets
                    ScrollTrigger.refresh();

                    // Filter in remaining cards
                    const visibleCards = Array.from(projectCards).filter(c => c.style.display !== "none");
                    gsap.fromTo(visibleCards, 
                        { opacity: 0, scale: 0.9, y: 15 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
                    );
                }
            });
        });
    });
}

/* ==========================================================================
   SPOTLIGHT GLOWING GRADIENT BORDER (MouseMove Interaction)
   ========================================================================== */
function initSpotlightEffect() {
    const cards = document.querySelectorAll(".glass-card, .project-card");
    
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validation check
        if (!name || !email || !subject || !message) {
            showStatus("All fields are required.", "error");
            return;
        }

        // Mock Submission animation
        showStatus("Submitting your message...", "info");
        const submitBtn = form.querySelector("button[type='submit']");
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Submitting...`;
        lucide.createIcons();

        setTimeout(() => {
            // Success response
            showStatus("Thank you, Mansi will get back to you shortly!", "success");
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
            lucide.createIcons();
            form.reset();
        }, 1800);
    });

    function showStatus(msg, type) {
        status.innerText = msg;
        status.classList.remove("hidden", "success", "error", "text-blue-400");
        
        if (type === "success") {
            status.classList.add("success");
        } else if (type === "error") {
            status.classList.add("error");
        } else {
            status.classList.add("text-blue-400");
        }
    }
}
