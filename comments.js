/* ================================================
   SYNCHROVIE — Système de commentaires clients
   Stockage : localStorage (côté client, pas de serveur)
   Version 1.0
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Trouver le conteneur de commentaires
    const commentsSection = document.getElementById('commentsSection');
    if (!commentsSection) return;

    // Récupérer l'ID du produit (basé sur l'URL)
    const productId = window.location.pathname.split('/').pop().replace('.html', '');

    // Clé de stockage
    const storageKey = `sv_comments_${productId}`;

    // Récupérer les commentaires existants
    function getComments() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || '[]');
        } catch (e) {
            return [];
        }
    }

    // Sauvegarder les commentaires
    function saveComments(comments) {
        localStorage.setItem(storageKey, JSON.stringify(comments));
    }

    // Générer les étoiles
    function generateStars(rating, interactive = false) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= rating ? '★' : '☆';
            const cls = interactive ? `star-input star-${i}` : '';
            stars += `<span class="${cls}" data-rating="${i}">${filled}</span>`;
        }
        return stars;
    }

    // Formater la date
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Afficher les commentaires
    function renderComments() {
        const comments = getComments();
        const listContainer = document.getElementById('commentsList');
        if (!listContainer) return;

        if (comments.length === 0) {
            listContainer.innerHTML = '<p class="no-comments">Soyez le premier à laisser un commentaire.</p>';
            return;
        }

        const sorted = comments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        listContainer.innerHTML = sorted.map(c => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(c.name)}</span>
                    <span class="comment-stars">${generateStars(c.rating)}</span>
                    <span class="comment-date">${formatDate(c.date)}</span>
                </div>
                <p class="comment-text">${escapeHtml(c.text)}</p>
            </div>
        `).join('');
    }

    // Échapper le HTML
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Construire le HTML du système
    commentsSection.innerHTML = `
        <div class="comments-wrap">
            <h3 class="comments-title">Avis clients</h3>
            
            <div id="commentsList" class="comments-list"></div>
            
            <div class="comment-form-wrap">
                <h4 class="comment-form-title">Laisser un commentaire</h4>
                <form id="commentForm" class="comment-form">
                    <div class="form-row">
                        <input type="text" id="commentName" placeholder="Votre prénom" required maxlength="50" class="comment-input">
                    </div>
                    <div class="form-row">
                        <label class="rating-label">Votre note :</label>
                        <div id="ratingInput" class="rating-input">
                            <span class="star-input star-1" data-rating="1">★</span>
                            <span class="star-input star-2" data-rating="2">★</span>
                            <span class="star-input star-3" data-rating="3">★</span>
                            <span class="star-input star-4" data-rating="4">★</span>
                            <span class="star-input star-5" data-rating="5">★</span>
                        </div>
                        <input type="hidden" id="commentRating" value="5">
                    </div>
                    <div class="form-row">
                        <textarea id="commentText" placeholder="Partagez votre expérience..." required maxlength="500" rows="4" class="comment-textarea"></textarea>
                    </div>
                    <button type="submit" class="comment-submit">Publier mon commentaire</button>
                </form>
            </div>
        </div>
    `;

    // Ajouter le CSS
    if (!document.getElementById('commentsCSS')) {
        const style = document.createElement('style');
        style.id = 'commentsCSS';
        style.textContent = `
            .comments-wrap { max-width: 700px; margin: 40px auto; padding: 0 20px; }
            .comments-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; color: #F8FAFC; margin-bottom: 20px; }
            .comments-list { margin-bottom: 30px; }
            .no-comments { color: #94A3B8; font-style: italic; text-align: center; padding: 30px 0; }
            .comment-item { background: #0a1628; border: 1px solid #1e3a5f; border-radius: 10px; padding: 16px 20px; margin-bottom: 12px; }
            .comment-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
            .comment-author { font-weight: 600; color: #F8FAFC; font-size: 0.95rem; }
            .comment-stars { color: #FFB800; letter-spacing: 1px; font-size: 1rem; }
            .comment-date { color: #64748b; font-size: 0.8rem; margin-left: auto; }
            .comment-text { color: #cbd5e1; font-size: 0.92rem; line-height: 1.6; margin: 0; }
            .comment-form-wrap { background: #0a1628; border: 1px solid #1e3a5f; border-radius: 12px; padding: 24px; }
            .comment-form-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; color: #3B82F6; margin: 0 0 16px 0; }
            .comment-form .form-row { margin-bottom: 14px; }
            .comment-input, .comment-textarea { width: 100%; background: #071126; border: 1px solid #1e3a5f; border-radius: 8px; padding: 12px 16px; color: #F8FAFC; font-family: 'Inter', sans-serif; font-size: 0.95rem; }
            .comment-input:focus, .comment-textarea:focus { outline: none; border-color: #3B82F6; }
            .comment-textarea { resize: vertical; min-height: 80px; }
            .rating-label { color: #94A3B8; font-size: 0.9rem; display: block; margin-bottom: 6px; }
            .rating-input { display: flex; gap: 4px; font-size: 1.8rem; }
            .star-input { cursor: pointer; color: #1e3a5f; transition: color 0.15s; }
            .star-input.active { color: #FFB800; }
            .star-input:hover { color: #60A5FA; }
            .comment-submit { width: 100%; background: #3B82F6; color: #071126; border: none; border-radius: 8px; padding: 14px; font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
            .comment-submit:hover { background: #60A5FA; }
            @media (max-width: 768px) {
                .comment-date { margin-left: 0; width: 100%; }
                .comment-header { gap: 8px; }
            }
        `;
        document.head.appendChild(style);
    }

    // Gérer les étoiles cliquables
    let selectedRating = 5;
    const ratingInput = document.getElementById('ratingInput');
    if (ratingInput) {
        ratingInput.querySelectorAll('.star-input').forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                document.getElementById('commentRating').value = selectedRating;
                ratingInput.querySelectorAll('.star-input').forEach(s => {
                    s.classList.toggle('active', parseInt(s.dataset.rating) <= selectedRating);
                });
            });
        });
        // Activer 5 étoiles par défaut
        ratingInput.querySelectorAll('.star-input').forEach(s => {
            if (parseInt(s.dataset.rating) <= 5) s.classList.add('active');
        });
    }

    // Gérer la soumission du formulaire
    const form = document.getElementById('commentForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('commentName').value.trim();
            const text = document.getElementById('commentText').value.trim();
            const rating = parseInt(document.getElementById('commentRating').value) || 5;

            if (!name || !text) return;

            const comments = getComments();
            comments.push({
                name: name,
                rating: rating,
                text: text,
                date: new Date().toISOString()
            });
            saveComments(comments);

            // Réinitialiser le formulaire
            form.reset();
            selectedRating = 5;
            document.getElementById('commentRating').value = 5;
            ratingInput.querySelectorAll('.star-input').forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.rating) <= 5);
            });

            // Recharger les commentaires
            renderComments();

            // Message de confirmation
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = 'Merci ! Votre commentaire a été publié.';
            document.body.appendChild(toast);
            requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
            setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
        });
    }

    // Afficher les commentaires au chargement
    renderComments();
});
