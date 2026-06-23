/* ==========================================================================
   Mansi Zala Awwwards-Style Premium Portfolio JavaScript Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Loader dismissal
    initLoader();
    
    // 2. Initialize Lenis Momentum Scroll
    const lenis = initLenis();
    
    // 3. Three.js Animated Gradient Mesh
    initThreeMesh();
    
    // 4. GSAP Timelines & Scroll Actions
    initGsapAnimations(lenis);
    
    // 5. Circular Services Orbit Layout
    initCircularOrbit();
    
    // 6. Magnetic Cards & Parallax Glow
    initMagneticCards();
    initCursorGlow();
    
    // 7. Typewriter & Contact Forms
    initTypewriter();
    initContactForm();

    // 8. Responsive Glassmorphic Header Navigation
    initHeaderNav(lenis);
});

/* ==========================================================================
   PAGE LOADER
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById("page-loader");
    if (loader) {
        window.addEventListener("load", () => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loader.style.display = "none";
                    // Trigger Hero load transitions
                    triggerHeroEntrance();
                }
            });
        });
        
        // Fallback if load event already fired or delayed
        setTimeout(() => {
            if (loader.style.display !== "none") {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => { loader.style.display = "none"; triggerHeroEntrance(); }
                });
            }
        }, 2500);
    }
}

/* ==========================================================================
   LENIS MOMENTUM SCROLL
   ========================================================================== */
function initLenis() {
    if (typeof Lenis === "undefined") return null;
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.update();
        }
    });

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    return lenis;
}

/* ==========================================================================
   THREE.JS ANIMATED GRADIENT MESH BACKGROUND
   ========================================================================== */
function initThreeMesh() {
    const container = document.getElementById('mesh-canvas');
    if (!container || typeof THREE === "undefined") return;

    let scene, camera, renderer, geometry, material, mesh;
    let lights = [];
    const clock = new THREE.Clock();

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 1000);
        camera.position.z = 220;

        // Plane geometry with segments to create waves
        geometry = new THREE.PlaneGeometry(600, 400, 24, 24);

        // White material with high roughness to reflect light colors
        material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            flatShading: true
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 3;
        mesh.position.y = -50;
        scene.add(mesh);

        // Colorful lights rotating to form a liquid mesh gradient
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(ambientLight);

        // Accent Blue
        const blueLight = new THREE.PointLight(0x1D4ED8, 2.5, 500);
        scene.add(blueLight);
        lights.push({ obj: blueLight, angle: 0, speed: 0.8, radius: 150, height: 80 });

        // Sky Blue
        const skyLight = new THREE.PointLight(0x38BDF8, 2.0, 500);
        scene.add(skyLight);
        lights.push({ obj: skyLight, angle: Math.PI * 0.7, speed: 0.6, radius: 120, height: 60 });

        // Deep Navy Light
        const navyLight = new THREE.PointLight(0x081F4D, 3.0, 600);
        scene.add(navyLight);
        lights.push({ obj: navyLight, angle: Math.PI * 1.4, speed: 0.5, radius: 180, height: 100 });

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // 1. Move Light orbits
        lights.forEach(light => {
            light.angle += light.speed * 0.01;
            light.obj.position.x = Math.cos(light.angle) * light.radius;
            light.obj.position.y = Math.sin(light.angle * 1.5) * light.height;
            light.obj.position.z = Math.sin(light.angle) * 50 + 50;
        });

        // 2. Animate vertices to create waves
        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            // mathematical noise
            const z = Math.sin(x / 60 + elapsedTime * 0.8) * Math.cos(y / 60 + elapsedTime * 0.5) * 16;
            pos.setZ(i, z);
        }
        pos.needsUpdate = true;
        geometry.computeVertexNormals();

        renderer.render(scene, camera);
    }

    init();
    animate();
}

/* ==========================================================================
   GSAP HERO ENTRANCE & SCROLL TRIGGERS
   ========================================================================== */
function triggerHeroEntrance() {
    const tl = gsap.timeline();
    tl.to("#hero-tag-anim", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .to("#hero-title-anim span", { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power4.out" }, "-=0.3")
      .to("#hero-typewriter-anim", { opacity: 1, duration: 0.5 }, "-=0.4")
      .to("#hero-btn-anim", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .to("#hero-blob-anim", { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.75)" }, "-=0.8");
}

function initGsapAnimations(lenis) {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Initial states for entrance timelines
    gsap.set("#hero-title-anim span", { y: 40, opacity: 0 });
    gsap.set("#hero-btn-anim", { y: 20, opacity: 0 });
    gsap.set("#hero-blob-anim", { scale: 0.8, opacity: 0 });

    // 1. Horizontal Scroll Storyteller Section
    const scrollContainer = document.getElementById("horizontal-scroll-container");
    if (scrollContainer) {
        gsap.to(scrollContainer, {
            x: () => -(scrollContainer.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: "#horizontal-about",
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => "+=" + (scrollContainer.scrollWidth - window.innerWidth),
                invalidateOnRefresh: true
            }
        });
    }

    // 2. Timeline node filler line
    const progressFill = document.getElementById("journey-progress-fill");
    if (progressFill) {
        gsap.to(progressFill, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".journey-timeline-wrapper",
                start: "top 40%",
                end: "bottom 60%",
                scrub: true
            }
        });
    }

    // 3. Highlight nodes along the timeline
    const nodes = document.querySelectorAll(".journey-node");
    nodes.forEach(node => {
        gsap.to(node, {
            scrollTrigger: {
                trigger: node,
                start: "top 60%",
                onEnter: () => node.classList.add("active"),
                onLeaveBack: () => node.classList.remove("active"),
                toggleActions: "play none none reverse"
            }
        });
    });

    // 4. Project block animations (zig-zag slide ups)
    const projects = document.querySelectorAll(".project-block");
    projects.forEach(project => {
        const img = project.querySelector(".project-img-frame");
        const content = project.querySelector(".project-content-col");
        
        gsap.from(img, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: project,
                start: "top 75%"
            }
        });

        gsap.from(content, {
            opacity: 0,
            x: project.classList.contains("left-aligned") ? 50 : -50,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: project,
                start: "top 70%"
            }
        });
    });

    // 5. Scroll Progress Bar Update
    const scrollProgressBar = document.getElementById("scroll-progress");
    if (scrollProgressBar) {
        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const percent = (scrollY / docHeight) * 100;
                scrollProgressBar.style.width = percent + "%";
            }
        });
    }
}

/* ==========================================================================
   CIRCULAR SERVICES ECOSYSTEM
   ========================================================================== */
function initCircularOrbit() {
    const orbitCards = document.querySelectorAll(".orbiting-service-card");
    const center = document.querySelector(".center-hub");
    if (orbitCards.length === 0 || !center) return;

    const radius = 240; // Orbital circle radius
    const total = orbitCards.length;

    let baseAngle = 0;

    function arrangeNodes() {
        orbitCards.forEach((card, idx) => {
            const angle = baseAngle + (idx * (2 * Math.PI / total));
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Continuously rotate orbital cards slowly
    function rotateOrbit() {
        baseAngle += 0.0012; // Speed parameter
        arrangeNodes();
        requestAnimationFrame(rotateOrbit);
    }

    arrangeNodes();
    rotateOrbit();
}

/* ==========================================================================
   MAGNETIC SKILL CARDS & PARALLAX MOUSE GLOW
   ========================================================================== */
function initMagneticCards() {
    const cards = document.querySelectorAll(".skill-wall-card, .why-feature-block");
    
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate relative offset from center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Displace card slightly toward mouse
            gsap.to(card, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener("mouseleave", () => {
            // Snap back
            gsap.to(card, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
}

function initCursorGlow() {
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;

    document.addEventListener("mousemove", (e) => {
        gsap.to(glow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15
        });

        // Set card hover lighting coordinates mapping variables
        const cards = document.querySelectorAll(".glass-card");
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   TYPEWRITER CYCLES
   ========================================================================== */
function initTypewriter() {
    const words = ["Full Stack Developer", "WordPress Expert", "Digital Marketer"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const target = document.querySelector(".typewriter-text");
        if (!target) return;

        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            target.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            target.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 120;

        if (!isDeleting && charIdx === currentWord.length) {
            speed = 1800; // Hold word visible
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            speed = 400; // Pause before next
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 1500);
}

/* ==========================================================================
   CONTACT FORM HANDLERS
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("portfolio-contact-form");
    const status = document.getElementById("form-status");

    if (!form || !status) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("c-name").value.trim();
        const email = document.getElementById("c-email").value.trim();
        const message = document.getElementById("c-message").value.trim();

        if (!name || !email || !message) {
            showMsg("Required fields missing.", "error");
            return;
        }

        showMsg("Submitting details...", "info");
        const submitBtn = form.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        setTimeout(() => {
            showMsg("Project request submitted successfully! Mansi will reach out soon.", "success");
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });

    function showMsg(text, type) {
        status.textContent = text;
        status.style.display = "block";
        status.style.padding = "0.75rem 1rem";
        status.style.borderRadius = "4px";
        status.style.fontWeight = "600";
        status.style.fontSize = "0.85rem";
        
        if (type === "success") {
            status.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
            status.style.color = "#10b981";
            status.style.border = "1px solid rgba(16, 185, 129, 0.2)";
        } else if (type === "error") {
            status.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
            status.style.color = "#ef4444";
            status.style.border = "1px solid rgba(239, 68, 68, 0.2)";
        } else {
            status.style.backgroundColor = "rgba(29, 78, 216, 0.1)";
            status.style.color = "#1d4ed8";
            status.style.border = "1px solid rgba(29, 78, 216, 0.2)";
        }
    }
}

/* ==========================================================================
   RESPONSIVE GLASSMORPHIC HEADER NAVIGATION
   ========================================================================== */
function initHeaderNav(lenis) {
    const header = document.getElementById("main-header");
    const mobileToggle = document.getElementById("mobile-toggle");
    const mobileOverlay = document.getElementById("mobile-nav-overlay");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link, .header-logo");

    if (!header) return;

    // 1. Shrink header background on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 2. Toggle Mobile Drawer Menu
    if (mobileToggle && mobileOverlay) {
        mobileToggle.addEventListener("click", () => {
            mobileToggle.classList.toggle("active");
            mobileOverlay.classList.toggle("active");
            // Prevent scrolling on body when mobile nav is open
            if (mobileOverlay.classList.contains("active")) {
                document.body.style.overflow = "hidden";
                if (lenis) lenis.stop();
            } else {
                document.body.style.overflow = "";
                if (lenis) lenis.start();
            }
        });
    }

    // 3. Smooth Scroll to Sections using Lenis
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mobileOverlay && mobileOverlay.classList.contains("active")) {
                    mobileToggle.classList.remove("active");
                    mobileOverlay.classList.remove("active");
                    document.body.style.overflow = "";
                    if (lenis) lenis.start();
                }

                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    if (lenis) {
                        // Offset by header height
                        const offset = header.offsetHeight || 70;
                        lenis.scrollTo(targetEl, {
                            offset: -offset,
                            duration: 1.2
                        });
                    } else {
                        targetEl.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }
        });
    });

    // 4. Scroll Active State Highlighting via ScrollTrigger
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        const sections = [
            { id: "hero-split", linkId: "#hero-split" },
            { id: "horizontal-about", linkId: "#horizontal-about" },
            { id: "services-ecosystem", linkId: "#services-ecosystem" },
            { id: "featured-projects", linkId: "#featured-projects" },
            { id: "contact", linkId: "#contact" }
        ];

        sections.forEach(sec => {
            const el = document.getElementById(sec.id);
            if (el) {
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 40%",
                    end: "bottom 40%",
                    onToggle: (self) => {
                        if (self.isActive) {
                            // Deactivate all
                            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                            // Activate matching desktop link
                            const activeLink = document.querySelector(`.desktop-nav a[href="${sec.linkId}"]`);
                            if (activeLink) {
                                activeLink.classList.add("active");
                            }
                        }
                    }
                });
            }
        });
    }
}
