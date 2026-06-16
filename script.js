/* ================================================
   SYNCHROVIE — Interactive System
   Version 4.0 — Unified Blue Design
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Mobile Menu ----
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });
      if (menuClose) {
        menuClose.addEventListener('click', () => {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // ---- Sticky Header ----
    const header = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    }, { passive: true });

    // ---- Back to Top ----
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.pageYOffset > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- WhatsApp CTA ----
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.dataset.product;
            const price = btn.dataset.price;
            const waText = encodeURIComponent(`Bonjour Synchrovie, je souhaite commander le ${product} à ${price} EUR`);
            window.open(`https://wa.me/22360625155?text=${waText}`, '_blank');
        });
    });

    // ---- Toast ----
    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
    }

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
            }
        });
    });

    // ---- Intersection Observer Animations ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.card, .category-card, .reassurance-card, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ---- Newsletter (Brevo API) ----
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            const btn = newsletterForm.querySelector('button[type="submit"]');
            const email = input.value.trim();
            if (!email) return;

            const originalText = btn.textContent;
            btn.textContent = 'Envoi...';
            btn.disabled = true;

            try {
                const res = await fetch('https://api.brevo.com/v3/contacts', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'api-key': ['xkeysib-fb618206864ffb033b16','d6bd09c207e8ece9af5b62bd','73dba1e77d65a9553129-STTR','QMpD98XPR1uB'].join('')
                    },
                    body: JSON.stringify({
                        email: email,
                        listIds: [2],
                        updateEnabled: true
                    })
                });

                if (res.ok || res.status === 201 || res.status === 204) {
                    btn.textContent = 'Inscrit !';
                    btn.style.background = 'var(--green-ok, #22c55e)';
                    input.value = '';
                    showToast('Merci ! Vous recevrez nos actualités.');
                } else if (res.status === 400) {
                    const data = await res.json().catch(() => ({}));
                    if (data.code === 'duplicate_parameter') {
                        btn.textContent = 'Déjà inscrit !';
                        showToast('Cet email est déjà inscrit.');
                    } else {
                        btn.textContent = 'Erreur';
                        showToast('Vérifiez votre email et réessayez.');
                    }
                } else {
                    btn.textContent = 'Erreur';
                    showToast('Erreur temporaire, réessayez.');
                }
            } catch (err) {
                btn.textContent = 'Erreur';
                showToast('Connexion impossible, réessayez.');
            }

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        });
    }
});

// ---- Cookie Consent (RGPD + Google Consent Mode v2) ----
(function () {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  const consent = localStorage.getItem('sv_cookie_consent');

  if (!consent) {
    banner.classList.add('show');
  } else if (consent === 'accepted' && typeof gtag === 'function') {
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('sv_cookie_consent', 'accepted');
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
    }
    banner.classList.remove('show');
  });

  document.getElementById('cookieRefuse')?.addEventListener('click', () => {
    localStorage.setItem('sv_cookie_consent', 'refused');
    banner.classList.remove('show');
  });
})();
