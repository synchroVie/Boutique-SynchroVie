/* SynchroVie — Minuteur promo SynchroRing X1
   Affiche un compte à rebours et bascule le prix à 558€ à l'échéance */
document.addEventListener('DOMContentLoaded', () => {
    const timer = document.getElementById('promo-timer');
    if (!timer) return;
    
    const endDate = new Date(timer.dataset.end).getTime();
    const priceBefore = parseInt(timer.dataset.priceBefore || '458');
    const priceAfter = parseInt(timer.dataset.priceAfter || '558');
    
    function update() {
        const now = Date.now();
        const diff = endDate - now;
        
        if (diff <= 0) {
            // Promo terminée — basculer le prix
            timer.innerHTML = '<div class="promo-ended" style="background:rgba(255,107,53,0.1);border:1px solid rgba(255,107,53,0.3);border-radius:8px;padding:12px 16px;text-align:center;margin-top:12px;"><p style="color:#FF6B35;font-weight:700;margin:0;font-size:0.9rem;">Offre terminée — Prix normal : ' + priceAfter + ' EUR</p></div>';
            const priceEl = document.querySelector('[data-product-price]');
            if (priceEl) priceEl.textContent = priceAfter + ' EUR';
            return;
        }
        
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        
        timer.innerHTML = '<div class="promo-banner" style="background:linear-gradient(135deg,rgba(255,107,53,0.15),rgba(201,169,110,0.1));border:1px solid rgba(255,107,53,0.3);border-radius:10px;padding:14px 18px;margin-top:12px;text-align:center;"><p style="color:#FF6B35;font-weight:700;margin:0 0 8px 0;font-size:0.85rem;letter-spacing:0.05em;">OFFRE LIMITÉE — ' + priceBefore + ' EUR au lieu de ' + priceAfter + ' EUR</p><div style="display:flex;justify-content:center;gap:12px;font-family:Space Grotesk,sans-serif;"><div style="text-align:center;"><span style="font-size:1.8rem;font-weight:800;color:#3B82F6;display:block;">' + days + '</span><span style="font-size:0.7rem;color:#94A3B8;">JOURS</span></div><div style="text-align:center;"><span style="font-size:1.8rem;font-weight:800;color:#3B82F6;display:block;">' + String(hours).padStart(2,'0') + '</span><span style="font-size:0.7rem;color:#94A3B8;">HEURES</span></div><div style="text-align:center;"><span style="font-size:1.8rem;font-weight:800;color:#3B82F6;display:block;">' + String(mins).padStart(2,'0') + '</span><span style="font-size:0.7rem;color:#94A3B8;">MIN</span></div><div style="text-align:center;"><span style="font-size:1.8rem;font-weight:800;color:#3B82F6;display:block;">' + String(secs).padStart(2,'0') + '</span><span style="font-size:0.7rem;color:#94A3B8;">SEC</span></div></div></div>';
    }
    
    update();
    setInterval(update, 1000);
});
