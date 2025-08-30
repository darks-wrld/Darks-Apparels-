document.addEventListener("DOMContentLoaded", () => {
    // --- Fade-in Page ---
    document.body.classList.add("loaded");

    // Animate fade-in sections
    document.querySelectorAll(".fade-in").forEach((el, i) => {
        setTimeout(() => el.classList.add("show"), i * 200);
    });

    // --- Mobile Menu Toggle with Auto-Close ---
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    let menuTimeout;

    if (menuToggle && navLinks) {
        // Toggle menu when hamburger clicked
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");

            if (navLinks.classList.contains("show")) {
                // Restart timer each time menu opens
                clearTimeout(menuTimeout);
                menuTimeout = setTimeout(() => {
                    navLinks.classList.remove("show");
                }, 4000); // Auto-close after 4 seconds
            }
        });

        // Close menu immediately when a link is clicked
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show");
                clearTimeout(menuTimeout);
            });
        });
    }
});

// --- Floating particle background ---
const canvas = document.getElementById("bg-animation");
if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function update() {
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });
    }

    function animate() {
        draw();
        update();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
