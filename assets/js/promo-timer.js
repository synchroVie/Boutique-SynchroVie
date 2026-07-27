/* SynchroVie — Minuteur promo SynchroRing X1 (PROMINENT) */
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
            timer.innerHTML = '<div style="background:rgba(255,107,53,0.15);border:2px solid rgba(255,107,53,0.4);border-radius:12px;padding:20px;text-align:center;"><p style="color:#FF6B35;font-weight:800;margin:0;font-size:1.1rem;">⏰ OFFRE TERMINÉE</p><p style="color:#F8FAFC;margin:8px 0 0 0;font-size:1.4rem;font-weight:700;">Prix normal : ' + priceAfter + ' EUR</p></div>';
            const priceEl = document.querySelector('[data-product-price]');
            if (priceEl) {
                priceEl.textContent = priceAfter + ' EUR';
                priceEl.style.color = '#3B82F6';
                priceEl.style.fontSize = '2.6rem';
            }
            return;
        }
        
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        
        timer.innerHTML = '<div style="background:linear-gradient(135deg,rgba(255,107,53,0.2),rgba(59,130,246,0.1));border:2px solid rgba(255,107,53,0.4);border-radius:12px;padding:18px 20px;text-align:center;">' +
            '<p style="color:#FF6B35;font-weight:800;margin:0 0 12px 0;font-size:0.9rem;letter-spacing:0.08em;text-transform:uppercase;">⏰ L'offre se termine dans</p>' +
            '<div style="display:flex;justify-content:center;gap:16px;font-family:Space Grotesk,sans-serif;">' +
            '<div style="text-align:center;min-width:60px;"><span style="font-size:2rem;font-weight:800;color:#FF6B35;display:block;line-height:1;">' + days + '</span><span style="font-size:0.7rem;color:#94A3B8;text-transform:uppercase;">Jours</span></div>' +
            '<div style="text-align:center;min-width:60px;"><span style="font-size:2rem;font-weight:800;color:#FF6B35;display:block;line-height:1;">' + String(hours).padStart(2,'0') + '</span><span style="font-size:0.7rem;color:#94A3B8;text-transform:uppercase;">Heures</span></div>' +
            '<div style="text-align:center;min-width:60px;"><span style="font-size:2rem;font-weight:800;color:#FF6B35;display:block;line-height:1;">' + String(mins).padStart(2,'0') + '</span><span style="font-size:0.7rem;color:#94A3B8;text-transform:uppercase;">Min</span></div>' +
            '<div style="text-align:center;min-width:60px;"><span style="font-size:2rem;font-weight:800;color:#FF6B35;display:block;line-height:1;">' + String(secs).padStart(2,'0') + '</span><span style="font-size:0.7rem;color:#94A3B8;text-transform:uppercase;">Sec</span></div>' +
            '</div>' +
            '<p style="color:#cbd5e1;margin:12px 0 0 0;font-size:0.8rem;">Après cette date : <span style="text-decoration:line-through;color:#64748b;">558 EUR</span> → prix normal</p>' +
            '</div>';
    }
    
    update();
    setInterval(update, 1000);
});
