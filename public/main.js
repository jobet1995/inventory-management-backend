/**
 * API Landing Page - Optimized Professional Interaction Engine
 * Optimized for 60fps scroll performance.
 */

document.addEventListener('DOMContentLoaded', () => {
    updateYear();
    initStarfield();
    initIntersectionObserver();
    init3DCardEffects();
    initClipboard();
    initParallax();
});

function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/**
 * Optimized Starfield - Batch Drawing Mode
 */
function initStarfield() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for non-transparent canvas
    let stars = [];
    let w, h;
    let isScrolling = false;
    let scrollTimeout;

    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => isScrolling = false, 100);
    }, { passive: true });
    
    resize();

    class Star {
        constructor() { this.init(); }
        init() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.z = Math.random() * w;
            this.size = 0.5 + Math.random();
            this.speed = 0.05 + Math.random() * 0.1;
            this.opacity = 0.1 + Math.random() * 0.5;
            this.color = Math.random() > 0.8 ? '#2dd4bf' : '#3b82f6';
        }
        update() {
            if (isScrolling) return; // Freeze stars during scroll for max FPS
            this.z -= this.speed * 6;
            if (this.z <= 0) this.init();
        }
    }

    const starCount = Math.min(Math.floor(w / 12), 120);
    for (let i = 0; i < starCount; i++) stars.push(new Star());

    function animate() {
        // Draw deep space background
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);

        // Group stars by color for batched drawing
        const groups = { '#2dd4bf': [], '#3b82f6': [] };
        
        stars.forEach(s => {
            s.update();
            let x = (s.x - w / 2) * (w / s.z) + w / 2;
            let y = (s.y - h / 2) * (w / s.z) + h / 2;
            const size = (1 - s.z / w) * s.size * 5;
            
            if (x > 0 && x < w && y > 0 && y < h) {
                groups[s.color].push({ x, y, size, opacity: s.opacity });
            }
        });

        // Batch draw each color group
        Object.keys(groups).forEach(color => {
            ctx.fillStyle = color;
            groups[color].forEach(p => {
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    animate();
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/**
 * Throttled 3D Effects
 */
function init3DCardEffects() {
    const cards = document.querySelectorAll('.glass-card');
    let ticking = false;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const rotateX = (rect.height / 2 - y) / 25;
                    const rotateY = (x - rect.width / 2) / 25;

                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

function initClipboard() {
    const copyBtn = document.querySelector('.copy-btn');
    if (!copyBtn) return;
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText("curl -X GET http://localhost:5000/health").then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.innerHTML = original, 2000);
        });
    });
}

/**
 * Throttled Parallax
 */
function initParallax() {
    const blobs = document.querySelectorAll('.glow-blob');
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                blobs.forEach((blob, i) => {
                    blob.style.transform = `translate(${x * (i + 1) * 0.4}px, ${y * (i + 1) * 0.4}px) translateZ(0)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
