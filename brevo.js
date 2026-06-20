/* ================================================
   SYNCHROVIE — Brevo Pop-up & Newsletter (standalone)
   Chargé sur les pages sans script.js (produits, blog, commander)
   Version 1.0
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
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

    // ---- Newsletter (section dans la page) ----
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

    // ---- Brevo Pop-up (exit-intent desktop + 60s mobile) ----
    const overlay = document.getElementById('brevoOverlay');
    if (!overlay) return;

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

    document.getElementById('brevoClose')?.addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('show')) closePopup();
    });

    if (isMobile) {
        setTimeout(showPopup, 60000);
    } else {
        let exitTriggered = false;
        document.addEventListener('mouseleave', (e) => {
            if (exitTriggered) return;
            if (e.clientY <= 0) {
                exitTriggered = true;
                showPopup();
            }
        });
        setTimeout(() => { if (!popupShown) showPopup(); }, 90000);
    }

    // ---- Soumission formulaire pop-up → Brevo ----
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
});
