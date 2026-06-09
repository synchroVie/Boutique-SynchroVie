/* ================================================
   SYNCHROVIE — Interactive System
   Version 2.0
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🧬 Système Synchrovie initialisé.');

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenuBtn');
    let overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        mobileMenu.classList.add('open');
        overlay.classList.add('show');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenuFn() {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('show');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);
    overlay.addEventListener('click', closeMenuFn);

    // Close menu on link click
    document.querySelectorAll('.mobile-nav a, .mobile-submenu a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenuFn();
        });
    });

    // ---- Sticky Header Scroll Effect ----
    const header = document.getElementById('mainHeader');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // ---- Back to Top ----
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Cart System ----
    let cartCount = 0;
    const cartBadge = document.getElementById('cartBadge');

    function updateCartBadge() {
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            if (cartCount > 0) {
                cartBadge.classList.add('show');
            } else {
                cartBadge.classList.remove('show');
            }
        }
    }

    function showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // WhatsApp CTA buttons (replaced fake cart)
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.dataset.product;
            const price = btn.dataset.price;
            const waText = encodeURIComponent(`Bonjour Synchrovie, je souhaite commander le ${product} à ${price} EUR`);
            window.open(`https://wa.me/22360625155?text=${waText}`, '_blank');
        });
    });

    // ---- Hero Particles ----
    const particlesContainer = document.getElementById('heroParticles');
    
    if (particlesContainer) {
        function createParticle() {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(0, 229, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 8}s linear infinite;
                pointer-events: none;
            `;
            particlesContainer.appendChild(particle);

            // Limit particles
            if (particlesContainer.children.length > 30) {
                particlesContainer.removeChild(particlesContainer.firstChild);
            }
        }

        // Create initial particles
        for (let i = 0; i < 20; i++) {
            createParticle();
        }

        // Add particle animation to CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Newsletter Form ----
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const btn = newsletterForm.querySelector('button[type="submit"]');

            btn.textContent = 'Envoi...';
            btn.disabled = true;

            try {
                const res = await fetch('https://api.brevo.com/v3/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': 'TA_CLE_API_BREVO'
                    },
                    body: JSON.stringify({
                        email: email,
                        listIds: [ID_LISTE_BREVO],
                        updateEnabled: true
                    })
                });

                if (res.ok || res.status === 204) {
                    btn.textContent = '✓ Vous êtes inscrit !';
                    btn.style.background = 'linear-gradient(90deg,#00C9A7,#00C9A7)';
                    newsletterForm.querySelector('input').value = '';
                    showToast('✓ Merci ! Vous recevrez nos prochaines actualités.');
                } else {
                    throw new Error('Erreur');
                }
            } catch(err) {
                btn.textContent = 'Réessayer';
                btn.disabled = false;
                showToast('Erreur d\'inscription. Réessayez.');
            }
        });
    }

    // ---- Review Form ----
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('✓ Merci pour votre avis ! Il sera publié après modération.');
            reviewForm.reset();
        });
    }

    // ---- Intersection Observer for Animations ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.card, .category-card, .reassurance-card, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ---- Search Button (placeholder) ----
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showToast('🔍 Recherche bientôt disponible');
        });
    }

    // ---- Performance: Lazy loading detection ----
    if ('loading' in HTMLImageElement.prototype) {
        console.log('✓ Lazy loading natif supporté');
    } else {
        // Fallback for older browsers
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imgObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imgObserver.observe(img));
    }
});
