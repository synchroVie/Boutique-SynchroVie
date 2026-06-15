/* ================================================
   SYNCHROVIE — Interactive System
   Version 4.0 — Unified Blue Design
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
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

    // ---- Newsletter ----
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button[type="submit"]');
            btn.textContent = 'Inscrit !';
            btn.style.background = 'var(--green-ok)';
            showToast('Merci ! Vous recevrez nos actualités.');
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
