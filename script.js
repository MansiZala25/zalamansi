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

    // 9. Technical Skills Section Tabs & Progress Animations
    initSkillsSection();
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
/* ==========================================================================
   THREE.JS ANIMATED INTERACTIVE 3D CODE MATRIX NETWORK
   ========================================================================== */
function initThreeMesh() {
    const container = document.getElementById('mesh-canvas');
    if (!container || typeof THREE === "undefined") return;

    let scene, camera, renderer;
    let particles = [];
    let linesGeometry, linePositions, lineColors;
    let lineMesh;
    const maxParticles = 65;
    const minDistance = 110;
    
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Function to generate glowing code characters canvas textures
    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, 64, 64);
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.fillText(text, 32, 32);
        
        return new THREE.CanvasTexture(canvas);
    }

    const symbols = ['</>', '{ }', '[ ]', '1 0', '=>', 'git', '&&', '||', 'func', 'var'];

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
        camera.position.z = 250;

        // Generate Materials for each symbol
        const materials = symbols.map(sym => new THREE.MeshBasicMaterial({
            map: createTextTexture(sym),
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));

        const planeGeom = new THREE.PlaneGeometry(16, 16);

        // Spawn particles (meshes)
        const bounds = 250;
        for (let i = 0; i < maxParticles; i++) {
            const mat = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(planeGeom, mat);
            
            mesh.position.set(
                (Math.random() - 0.5) * bounds * 2,
                (Math.random() - 0.5) * bounds * 2,
                (Math.random() - 0.5) * bounds * 2
            );

            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                0
            );

            // Downward and drifting float velocity
            mesh.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.2,
                    -0.3 - Math.random() * 0.4,
                    (Math.random() - 0.5) * 0.2
                ),
                rotSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                )
            };

            scene.add(mesh);
            particles.push(mesh);
        }

        // Lines Geometry setup
        linesGeometry = new THREE.BufferGeometry();
        const maxConnections = maxParticles * maxParticles * 3;
        linePositions = new Float32Array(maxConnections);
        lineColors = new Float32Array(maxConnections);

        linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        lineMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
        scene.add(lineMesh);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onMouseMove);
    }

    function onMouseMove(e) {
        mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 60;
        mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 60;
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        // Camera parallax movement
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        camera.position.x = mouse.x;
        camera.position.y = -mouse.y;
        camera.lookAt(scene.position);

        let vertexIdx = 0;
        let colorIdx = 0;
        let numConnected = 0;

        const bounds = 250;

        // Move and rotate particles
        particles.forEach(p => {
            p.position.add(p.userData.velocity);
            p.rotation.x += p.userData.rotSpeed.x;
            p.rotation.y += p.userData.rotSpeed.y;

            // Wrap vertical bounds
            if (p.position.y < -bounds) {
                p.position.y = bounds;
                p.position.x = (Math.random() - 0.5) * bounds * 2;
            }
            if (p.position.x < -bounds) p.position.x = bounds;
            if (p.position.x > bounds) p.position.x = -bounds;
        });

        // Draw dynamic network connections
        for (let i = 0; i < maxParticles; i++) {
            const p1 = particles[i];
            const x1 = p1.position.x;
            const y1 = p1.position.y;
            const z1 = p1.position.z;

            for (let j = i + 1; j < maxParticles; j++) {
                const p2 = particles[j];
                const x2 = p2.position.x;
                const y2 = p2.position.y;
                const z2 = p2.position.z;

                const dx = x1 - x2;
                const dy = y1 - y2;
                const dz = z1 - z2;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < minDistance) {
                    const alpha = (1.0 - (dist / minDistance)) * 0.22;

                    linePositions[vertexIdx++] = x1;
                    linePositions[vertexIdx++] = y1;
                    linePositions[vertexIdx++] = z1;
                    linePositions[vertexIdx++] = x2;
                    linePositions[vertexIdx++] = y2;
                    linePositions[vertexIdx++] = z2;

                    // Mapped to blue/sky colors (29, 78, 216)
                    const r = (29 / 255) * alpha;
                    const g = (78 / 255) * alpha;
                    const b = (216 / 255) * alpha;

                    lineColors[colorIdx++] = r;
                    lineColors[colorIdx++] = g;
                    lineColors[colorIdx++] = b;

                    lineColors[colorIdx++] = r;
                    lineColors[colorIdx++] = g;
                    lineColors[colorIdx++] = b;

                    numConnected++;
                }
            }
        }

        lineMesh.geometry.setDrawRange(0, numConnected * 2);
        lineMesh.geometry.attributes.position.needsUpdate = true;
        lineMesh.geometry.attributes.color.needsUpdate = true;

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

    let radius = window.innerWidth < 768 ? (window.innerWidth < 480 ? 110 : 155) : 240;
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

    window.addEventListener("resize", () => {
        radius = window.innerWidth < 768 ? (window.innerWidth < 480 ? 110 : 155) : 240;
    });

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
    const devCursor = document.getElementById("dev-cursor");
    const cursorSym = devCursor ? devCursor.querySelector(".cursor-sym") : null;

    if (!glow && !devCursor) return;

    document.addEventListener("mousemove", (e) => {
        if (glow) {
            gsap.to(glow, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15
            });
        }

        if (devCursor) {
            gsap.to(devCursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.08
            });
        }

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

    // Hover effect on links and buttons
    const hoverables = document.querySelectorAll("a, button, .skill-category-tab, .glass-card, .center-hub, .orbiting-service-card");
    hoverables.forEach(item => {
        item.addEventListener("mouseenter", () => {
            if (devCursor) {
                devCursor.classList.add("cursor-hover");
                if (cursorSym) cursorSym.textContent = "{ }";
            }
        });
        item.addEventListener("mouseleave", () => {
            if (devCursor) {
                devCursor.classList.remove("cursor-hover");
                if (cursorSym) cursorSym.textContent = "</>";
            }
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

/* ==========================================================================
   TECHNICAL SKILLS DYNAMIC TAB INTERACTION
   ========================================================================== */
function initSkillsSection() {
    const tabs = document.querySelectorAll(".skill-category-tab");
    const panes = document.querySelectorAll(".skill-pane");

    if (tabs.length === 0) return;

    // Animate progress bar fills in the active pane
    function animatePaneBars(pane) {
        const fills = pane.querySelectorAll(".progress-bar-fill");
        fills.forEach(fill => {
            fill.style.width = "0%";
        });
        setTimeout(() => {
            fills.forEach(fill => {
                const targetWidth = fill.getAttribute("data-width") || "0%";
                fill.style.width = targetWidth;
            });
        }, 100);
    }

    // Trigger initial animation when section enters viewport
    const activePane = document.querySelector(".skill-pane.active");
    if (activePane) {
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.create({
                trigger: "#expertise-wall",
                start: "top 75%",
                once: true,
                onEnter: () => animatePaneBars(activePane)
            });
        } else {
            animatePaneBars(activePane);
        }
    }

    // Handle Category Tab Switches
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const category = tab.getAttribute("data-category");
            const targetPane = document.getElementById(`pane-${category}`);

            if (!targetPane) return;

            // Remove active states from all tabs and panes
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            // Set clicked tab and pane active
            tab.classList.add("active");
            targetPane.classList.add("active");

            // Animate progress bars for newly opened tab
            animatePaneBars(targetPane);
        });
    });
}
