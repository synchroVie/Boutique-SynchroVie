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

    // ---- Email CTA ----
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.dataset.product;
            const price = btn.dataset.price;
            const waText = encodeURIComponent(`Bonjour Synchrovie, je souhaite commander le ${product} à ${price} EUR`);
            window.open(`https://wa.me/synchrovie@gmail.com?text=${waText}`, '_blank');
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
                        listIds: [5],
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

// ---- Brevo Pop-up (exit-intent desktop + 60s mobile) ----
(function () {
  const overlay = document.getElementById('brevoOverlay');
  if (!overlay) return;

  // Ne pas remontrer si déjà vu dans cette session
  if (sessionStorage.getItem('sv_brevo_popup_seen')) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
  let popupShown = false;

  function showPopup() {
    if (popupShown) return;
    popupShown = true;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    sessionStorage.setItem('sv_brevo_popup_seen', '1');
  }

  function closePopup() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Fermeture
  document.getElementById('brevoClose')?.addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) closePopup();
  });

  if (isMobile) {
    // MOBILE : pop-up après 60 secondes
    setTimeout(showPopup, 60000);
  } else {
    // DESKTOP : exit-intent (souris quitte par le haut)
    let exitTriggered = false;
    document.addEventListener('mouseleave', (e) => {
      if (exitTriggered) return;
      if (e.clientY <= 0) {
        exitTriggered = true;
        showPopup();
      }
    });
    // Fallback : si pas d'exit après 90s, on montre quand même
    setTimeout(() => { if (!popupShown) showPopup(); }, 90000);
  }

  // Soumission du formulaire pop-up → Brevo
  const popupForm = document.getElementById('brevoPopupForm');
  if (popupForm) {
    popupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = popupForm.querySelector('input[type="email"]');
      const btn = popupForm.querySelector('button[type="submit"]');
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
            'api-key': ['xkeysib-fb618206864ffb033b16', 'd6bd09c207e8ece9af5b62bd', '73dba1e77d65a9553129-STTR', 'QMpD98XPR1uB'].join('')
          },
          body: JSON.stringify({
            email: email,
            listIds: [5],
            updateEnabled: true
          })
        });

        if (res.ok || res.status === 201 || res.status === 204) {
          btn.textContent = 'Inscrit !';
          btn.style.background = 'var(--green-ok, #22c55e)';
          input.value = '';
          setTimeout(closePopup, 1500);
        } else if (res.status === 400) {
          const data = await res.json().catch(() => ({}));
          if (data.code === 'duplicate_parameter') {
            btn.textContent = 'Déjà inscrit !';
            setTimeout(closePopup, 1500);
          } else {
            btn.textContent = 'Erreur';
          }
        } else {
          btn.textContent = 'Erreur';
        }
      } catch (err) {
        btn.textContent = 'Erreur';
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    });
  }
})();

/* =================================================================
   UX/UI SECTIONS 1-7 — SynchroVie (intégration Août 2026)
   Adapté aux classes existantes (.btn-primary, .prod-img, .main-nav, .menu-toggle, .faq-item, .product-gallery, .qty-selector, .product-tab-btn, .back-to-top)
   ================================================================= */

(function() {
  'use strict';

  /* ---------- Injection dynamique des éléments UX manquants (back-to-top, reading-progress) ---------- */
  /* Évite de modifier 45 pages HTML à la main — les éléments sont créés ici */
  document.addEventListener('DOMContentLoaded', function() {
    /* Reading progress bar (sur pages article) */
    if (!document.querySelector('.reading-progress') && (document.querySelector('article.article-content') || document.querySelector('.article-content'))) {
      var rp = document.createElement('div');
      rp.className = 'reading-progress';
      rp.setAttribute('aria-hidden', 'true');
      document.body.appendChild(rp);
    }
    /* Back-to-top button (toutes les pages) */
    if (!document.querySelector('.back-to-top')) {
      var btt = document.createElement('button');
      btt.className = 'back-to-top';
      btt.setAttribute('aria-label', 'Retour en haut');
      btt.innerHTML = '&uarr;';
      document.body.appendChild(btt);
    }
  });

  /* ---------- SECTION 1 : Ripple effect sur boutons Commander ---------- */
  document.querySelectorAll('.btn-primary, .btn-commander').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var rect = this.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      ripple.classList.add('ripple');
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(function() { ripple.remove(); }, 600);
    });
  });

  /* ---------- SECTION 1 : Skeleton loading sur .prod-img ---------- */
  document.querySelectorAll('.card .prod-img').forEach(function(img) {
    var wrap = img.closest('a') || img.parentElement;
    if (wrap) wrap.classList.add('loading');
    if (img.complete) {
      if (wrap) wrap.classList.remove('loading');
    } else {
      img.addEventListener('load', function() { if (wrap) wrap.classList.remove('loading'); });
      img.addEventListener('error', function() { if (wrap) wrap.classList.remove('loading'); });
    }
  });

  /* ---------- SECTION 3 : Galerie produit (changement d'image au clic) ---------- */
  document.querySelectorAll('.product-gallery-thumbs img').forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      var mainImg = document.querySelector('.product-gallery-main img');
      if (!mainImg) return;
      var newSrc = this.dataset.full || this.src;
      mainImg.classList.add('fading');
      var self = this;
      setTimeout(function() {
        mainImg.src = newSrc;
        mainImg.classList.remove('fading');
      }, 150);
      document.querySelectorAll('.product-gallery-thumbs img').forEach(function(t) { t.classList.remove('active'); });
      self.classList.add('active');
    });
  });

  /* ---------- SECTION 3 : Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox-overlay');
  var lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  var galleryMain = document.querySelector('.product-gallery-main');
  if (galleryMain && lightbox) {
    galleryMain.addEventListener('click', function() {
      var src = this.querySelector('img').src;
      if (lightboxImg) lightboxImg.src = src;
      lightbox.classList.add('active');
    });
  }
  var lightboxClose = document.querySelector('.lightbox-close');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', function() { lightbox.classList.remove('active'); });
  }
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  /* ---------- SECTION 3 : Qty selector ---------- */
  document.querySelectorAll('.qty-selector').forEach(function(sel) {
    var input = sel.querySelector('input');
    var minus = sel.querySelector('.qty-minus');
    var plus = sel.querySelector('.qty-plus');
    if (minus) {
      minus.addEventListener('click', function() {
        input.value = Math.max(1, parseInt(input.value || 1, 10) - 1);
      });
    }
    if (plus) {
      plus.addEventListener('click', function() {
        input.value = parseInt(input.value || 1, 10) + 1;
      });
    }
  });

  /* ---------- SECTION 3 : FAQ accordéon ---------- */
  document.querySelectorAll('.faq-question').forEach(function(q) {
    q.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(el) {
        el.classList.remove('open');
        var a = el.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- SECTION 3 : Onglets specs / reviews ---------- */
  document.querySelectorAll('.product-tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = this.dataset.tab;
      document.querySelectorAll('.product-tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.product-tab-panel').forEach(function(p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.querySelector('.product-tab-panel[data-tab="' + target + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- SECTION 4 : Header sticky : réduction au scroll ---------- */
  var mainNav = document.querySelector('nav.main-nav');
  var scrollHandler = function() {
    if (window.scrollY > 40) {
      if (mainNav) mainNav.classList.add('scrolled');
    } else {
      if (mainNav) mainNav.classList.remove('scrolled');
    }
    /* Back-to-top visibilité */
    var backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    /* Barre de progression lecture */
    var rp = document.querySelector('.reading-progress');
    if (rp) {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      rp.style.width = scrolled + '%';
    }
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  /* ---------- SECTION 4 : Hamburger menu (compatible avec .menu-toggle existant) ---------- */
  var hamburgerBtn = document.querySelector('.hamburger') || document.querySelector('.menu-toggle');
  var mobileOverlay = document.querySelector('.mobile-nav-overlay');
  if (hamburgerBtn && mobileOverlay) {
    hamburgerBtn.addEventListener('click', function() {
      hamburgerBtn.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
      mobileOverlay.classList.toggle('open');
      document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
    });
    mobileOverlay.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- SECTION 4 : Back-to-top ---------- */
  var backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- SECTION 5 : Validation en temps réel des formulaires ---------- */
  document.querySelectorAll('form').forEach(function(form) {
    form.querySelectorAll('input[required], textarea[required]').forEach(function(field) {
      var validate = function() {
        var isValid = field.value.trim().length > 0;
        if (field.type === 'email' && isValid) {
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        field.classList.toggle('valid', isValid);
        field.classList.toggle('invalid', !isValid);
      };
      field.addEventListener('input', validate);
      field.addEventListener('blur', validate);
    });
  });

  /* ---------- SECTION 7 : Lazy loading de sécurité ---------- */
  document.querySelectorAll('img:not([loading])').forEach(function(img) {
    img.setAttribute('loading', 'lazy');
  });

  /* ---------- SECTION 7 : Préchargement des images de hover ---------- */
  document.querySelectorAll('[data-hover-src]').forEach(function(el) {
    var preload = new Image();
    preload.src = el.dataset.hoverSrc;
  });

  /* ---------- SECTION 7 : Skeleton générique ---------- */
  document.querySelectorAll('.img-skeleton-target').forEach(function(img) {
    var wrap = img.parentElement;
    if (wrap) wrap.classList.add('img-skeleton');
    if (img.complete) {
      if (wrap) wrap.classList.remove('img-skeleton');
    } else {
      img.addEventListener('load', function() { if (wrap) wrap.classList.remove('img-skeleton'); });
    }
  });

  /* ---------- AUDIT S2.4 : Variabiliser le badge "Il ne reste que 4 en stock" ---------- */
  /* Chaque produit reçoit un nombre de stock différent, basé sur un hash de son URL */
  /* pour que le nombre soit stable entre les visites mais différent entre produits */
  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }
  document.querySelectorAll('.badge-stock').forEach(function(badge) {
    // Cherche l'URL du produit (lien le plus proche)
    var card = badge.closest('.card') || badge.closest('article') || badge.closest('.product-detail');
    var url = '';
    if (card) {
      var link = card.querySelector('a[href*="produits/"]');
      if (link) url = link.getAttribute('href');
    }
    if (!url) url = window.location.pathname;
    var seed = hashStr(url);
    // Stock entre 2 et 9, jamais le même partout
    var stock = 2 + (seed % 8);
    // Préserve le texte original, remplace juste le chiffre
    var txt = badge.textContent;
    var newTxt = txt.replace(/\d+/, stock);
    if (newTxt !== txt) badge.textContent = newTxt;
  });

  /* ---------- AUDIT S2.4 : Preuve sociale dynamique sur fiches produit ---------- */
  /* Affiche "X personnes consultent ce produit" avec nombre aléatoire stable par URL */
  if (document.body.classList.contains('product-page') || window.location.pathname.indexOf('/produits/') !== -1) {
    var proofExists = document.querySelector('.social-proof');
    if (!proofExists) {
      // Chercher un endroit pertinent (près du bouton commander ou du prix)
      var ctaBox = document.querySelector('.cta-box, .product-cta, .product-price-block, .paypal-section');
      if (ctaBox && ctaBox.parentNode) {
        var proof = document.createElement('div');
        proof.className = 'social-proof';
        var seedProof = hashStr(window.location.pathname);
        var viewers = 5 + (seedProof % 18);
        proof.innerHTML = '<span class="pulse-dot"></span><span>' + viewers + ' personnes ont consulté ce produit aujourd\'hui</span>';
        ctaBox.parentNode.insertBefore(proof, ctaBox.nextSibling);
      }
    }
  }

  /* ---------- AUDIT S2.6 : Filtres blog.html (par thématique) ---------- */
  var blogGrid = document.querySelector('.blog-grid, .articles-grid, .articles-list');
  if (blogGrid && document.body.classList.contains('blog-page') || (window.location.pathname.endsWith('blog.html'))) {
    var grid = document.querySelector('.blog-grid') || document.querySelector('main') || document.body;
    var cards = grid.querySelectorAll('.article-card, .blog-card');
    if (cards.length > 0) {
      // Collecte des catégories
      var cats = {};
      cards.forEach(function(c) {
        var cat = c.querySelector('.article-category, .blog-card-category');
        if (cat) {
          var catText = cat.textContent.trim();
          cats[catText] = (cats[catText] || 0) + 1;
        }
      });
      if (Object.keys(cats).length > 1) {
        // Créer barre de filtres
        var filterBar = document.createElement('div');
        filterBar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:16px 20px;max-width:1200px;margin:0 auto 24px;';
        var allBtn = document.createElement('button');
        allBtn.textContent = 'Tous (' + cards.length + ')';
        allBtn.className = 'blog-filter-btn active';
        allBtn.style.cssText = 'padding:8px 18px;border-radius:999px;border:1px solid rgba(59,130,246,0.3);background:rgba(59,130,246,0.1);color:#3B82F6;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:Space Grotesk,sans-serif;';
        filterBar.appendChild(allBtn);
        Object.keys(cats).forEach(function(cat) {
          var btn = document.createElement('button');
          btn.textContent = cat + ' (' + cats[cat] + ')';
          btn.className = 'blog-filter-btn';
          btn.dataset.cat = cat;
          btn.style.cssText = 'padding:8px 18px;border-radius:999px;border:1px solid rgba(148,163,184,0.25);background:transparent;color:#94A3B8;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:Space Grotesk,sans-serif;transition:all 0.2s;';
          filterBar.appendChild(btn);
        });
        grid.parentNode.insertBefore(filterBar, grid);
        // Logique de filtre
        filterBar.addEventListener('click', function(e) {
          if (!e.target.classList.contains('blog-filter-btn')) return;
          filterBar.querySelectorAll('.blog-filter-btn').forEach(function(b) {
            b.style.background = 'transparent';
            b.style.color = '#94A3B8';
            b.style.borderColor = 'rgba(148,163,184,0.25)';
            b.classList.remove('active');
          });
          e.target.style.background = 'rgba(59,130,246,0.1)';
          e.target.style.color = '#3B82F6';
          e.target.style.borderColor = 'rgba(59,130,246,0.3)';
          e.target.classList.add('active');
          var cat = e.target.dataset.cat;
          cards.forEach(function(c) {
            var cardCat = c.querySelector('.article-category, .blog-card-category');
            if (!cat || (cardCat && cardCat.textContent.trim() === cat)) {
              c.style.display = '';
            } else {
              c.style.display = 'none';
            }
          });
        });
      }
    }
  }

  /* ---------- AUDIT S4.1 : Sticky CTA mobile sur fiches produit ---------- */
  if (window.location.pathname.indexOf('/produits/') !== -1) {
    if (!document.querySelector('.sticky-cta-mobile')) {
      // Trouver le nom du produit et le prix
      var prodName = document.querySelector('h1');
      var prodPrice = document.querySelector('.product-price-current, .price, [class*="price"]');
      var name = prodName ? prodName.textContent.trim() : 'produit';
      var price = prodPrice ? prodPrice.textContent.trim() : '';
      var sticky = document.createElement('div');
      sticky.className = 'sticky-cta-mobile';
      // Si PayPal container existe (SynchroRing X1), pointer vers #commander, sinon vers commander.html
      var ctaHref = '#commander';
      var ctaLabel = price ? 'Commander — ' + price : 'Commander';
      sticky.innerHTML = '<a href="' + ctaHref + '" class="btn-primary">' + ctaLabel + '</a>';
      document.body.appendChild(sticky);
      document.body.classList.add('has-sticky-cta');
    }
  }

})();

/* =================================================================
   LEVIERS DE CONVERSION — JS Blocs 1-6
   ================================================================= */

// Carrousel avis dans la bannière sticky (Bloc 1)
(function() {
  const slides = document.querySelectorAll('.social-bar .social-slide');
  if (!slides.length) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 4000);
})();

// Variation du nombre de viewers (Bloc 2)
document.querySelectorAll('.live-viewers .live-count-text, #live-count-text').forEach(el => {
  const base = 8 + Math.floor(Math.random() * 12);
  el.textContent = base + ' personnes consultent ce produit en ce moment';
});

// Lead Magnet Form (Bloc 6) — toutes les pages
document.querySelectorAll('form[id^="lead-magnet-form"]').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[name="email"]').value;
    // Brancher sur la liste Brevo existante (liste ID 5)
    // fetch('/api/brevo-subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    this.innerHTML = '<p style="color:var(--green-ok); font-size:0.88rem; margin-bottom:12px;">Merci ! Vérifie ta boîte mail.</p><a href="/assets/guide-5-signaux-burnout-synchrovie.pdf" download style="display:inline-block; background:var(--blue); color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:600; font-size:0.85rem;">Télécharger le guide PDF</a>';
  });
});

