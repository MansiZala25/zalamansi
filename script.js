/* ==========================================================================
   INITIALIZATION & MAIN ENGINE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Icon Pack (Lucide)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Initialize Core Features
    initThemeEngine();
    initNavigation();
    initStatsEngine();
    initSkillsEngine();
    initPortfolioEngine();
    initContactEngine();
    initScrollToTop();
    
    // 3. Initialize Animations (GSAP with fallback)
    initScrollAnimations();
});

/* ==========================================================================
   THEME SWITCHING SYSTEM (Dark / Light Mode)
   ========================================================================== */
function initThemeEngine() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const root = document.documentElement;

    if (!themeToggle || !themeIcon) return;

    // Check saved theme or system settings
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    // Apply initial theme
    applyTheme(initialTheme);

    // Toggle click handler
    themeToggle.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
    });

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        // Update Toggle Icon
        if (theme === "dark") {
            themeIcon.setAttribute("data-lucide", "sun");
        } else {
            themeIcon.setAttribute("data-lucide", "moon");
        }

        // Recreate icons in container
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

/* ==========================================================================
   NAVIGATION ENGINE
   ========================================================================== */
function initNavigation() {
    const header = document.getElementById("header");
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const progressBar = document.getElementById("scroll-progress");

    if (!header) return;

    // Sticky Navbar & Progress Indicator
    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        
        // Sticky Header toggle
        if (scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Scroll Progress Bar calculation
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (documentHeight > 0 && progressBar) {
            const scrollPercent = (scrollY / documentHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Active Navigation Link detection
        updateActiveNavLink();
    });

    // Toggle menu in mobile view
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("open");
            navMenu.classList.toggle("open");
        });

        // Close menu on navigation click
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("open");
                navMenu.classList.remove("open");
            });
        });
    }

    // Update nav-link highlights based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll("section");
        const scrollPosition = window.scrollY + 120; // offset header padding

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }
}

/* ==========================================================================
   GSAP & FALLBACK SCROLL REVEAL ENGINE
   ========================================================================== */
function initScrollAnimations() {
    const reveals = document.querySelectorAll(".reveal-element");

    // Check if GSAP and ScrollTrigger are loaded correctly
    const gsapAvailable = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

    if (gsapAvailable) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // 1. Hero Content stagger
        const heroTl = gsap.timeline();
        heroTl.from("#header", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" })
              .from("#hero .hero-content > *", { y: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, "-=0.4")
              .from("#hero .hero-mockup-wrapper", { scale: 0.9, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.6");

        // 2. Reveal Elements loop
        reveals.forEach((element) => {
            gsap.fromTo(element, 
                { opacity: 0, y: 40 },
                {
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );
        });

        // 3. About Timeline line filler progress animation
        const timelineProgress = document.getElementById("timeline-progress");
        if (timelineProgress) {
            gsap.fromTo(timelineProgress, 
                { height: "0%" },
                {
                    scrollTrigger: {
                        trigger: "#about .timeline-wrapper",
                        start: "top 40%",
                        end: "bottom 60%",
                        scrub: true
                    },
                    height: "100%",
                    ease: "none"
                }
            );
        }
    } else {
        // Fallback: Custom Intersection Observer for reveal animations without GSAP
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, observerOptions);

        reveals.forEach(element => {
            element.classList.add("reveal-element");
            observer.observe(element);
        });

        // Fallback timeline line loader
        window.addEventListener("scroll", () => {
            const timeline = document.querySelector("#about .timeline-wrapper");
            const progress = document.getElementById("timeline-progress");
            if (timeline && progress) {
                const rect = timeline.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const elapsed = windowHeight - rect.top;
                    const percent = Math.min(100, Math.max(0, (elapsed / rect.height) * 100));
                    progress.style.height = `${percent}%`;
                }
            }
        });
    }
}

/* ==========================================================================
   STATISTICS ENGINE (Counting Numbers)
   ========================================================================== */
function initStatsEngine() {
    const statsSection = document.querySelector(".hero-stats-row") || document.getElementById("hero");
    const statNums = document.querySelectorAll(".stat-num");

    if (!statsSection || statNums.length === 0) return;

    let hasRun = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                runCounter();
                hasRun = true;
            }
        });
    }, { threshold: 0.4 });

    observer.observe(statsSection);

    function runCounter() {
        statNums.forEach(num => {
            const target = parseInt(num.getAttribute("data-val"));
            let current = 0;
            const duration = 2000; // ms
            const stepTime = Math.max(Math.floor(duration / target), 30);
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    num.innerText = `${target}+`;
                    clearInterval(timer);
                } else {
                    num.innerText = `${current}+`;
                }
            }, stepTime);
        });
    }
}

/* ==========================================================================
   SKILLS PROGRESS BAR FILL ENGINE
   ========================================================================== */
function initSkillsEngine() {
    const skillsSection = document.getElementById("skills");
    const skillBars = document.querySelectorAll(".skill-bar-fill");

    if (!skillsSection || skillBars.length === 0) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                fillSkills();
                hasAnimated = true;
            }
        });
    }, { threshold: 0.2 });

    observer.observe(skillsSection);

    function fillSkills() {
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute("data-percent");
            bar.style.width = targetWidth;
        });
    }
}

/* ==========================================================================
   PORTFOLIO FILTER ENGINE
   ========================================================================== */
function initPortfolioEngine() {
    const filters = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".portfolio-card");

    if (filters.length === 0 || cards.length === 0) return;

    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            // Remove active classes from buttons
            filters.forEach(btn => btn.classList.remove("active"));
            // Set active class
            filter.classList.add("active");

            const filterValue = filter.getAttribute("data-filter");

            // Filter portfolio cards
            cards.forEach(card => {
                const category = card.getAttribute("data-category");
                
                // Set initial transition styles if not already present
                card.style.transition = "transform 0.4s ease, opacity 0.4s ease";
                
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 400);
                }
            });

            // Re-evaluate GSAP scroll triggers after changing grid layout
            if (typeof ScrollTrigger !== "undefined") {
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 410);
            }
        });
    });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION ENGINE
   ========================================================================== */
function initContactEngine() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    if (!form || !status) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("form-name").value.trim();
        const email = document.getElementById("form-email").value.trim();
        const subject = document.getElementById("form-subject").value.trim();
        const message = document.getElementById("form-message").value.trim();

        if (!name || !email || !subject || !message) {
            showMsg("All fields are required.", "error");
            return;
        }

        // Mock Submission animation
        showMsg("Sending your message...", "info");
        const submitBtn = form.querySelector("button[type='submit']");
        const originalBtnHTML = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader" class="animate-spin" style="width:16px; height:16px;"></i> Sending...`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            showMsg("Thank you! Your message has been sent successfully. Mansi will get back to you shortly.", "success");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            form.reset();
        }, 1500);
    });

    function showMsg(text, type) {
        status.innerText = text;
        status.className = "form-status"; // reset classes
        status.classList.add(type);
    }
}

/* ==========================================================================
   BACK TO TOP SCROLLER
   ========================================================================== */
function initScrollToTop() {
    const backBtn = document.getElementById("back-to-top");

    if (!backBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backBtn.classList.add("visible");
        } else {
            backBtn.classList.remove("visible");
        }
    });

    backBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


