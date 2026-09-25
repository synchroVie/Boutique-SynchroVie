# TODO manuel — cannibalisation synchrovie.github.io

Vérifié le 25/09/2026. Ne pas désactiver GitHub Pages : c’est l’hébergement de synchro-vie.com.

## Ce qui est déjà correct (ne pas retoucher)

- Canonical : 70/70 HTML → `https://synchro-vie.com/...` (0 github.io)
- sitemap.xml live : 62 URL, toutes `https://synchro-vie.com`, 0 github.io
- robots.txt : `Allow: /` + sitemap custom domain (ne PAS mettre `Disallow: /` ici, ça désindexerait synchro-vie.com)
- 0 href `https://synchrovie.github.io` dans le repo
- Les mentions `github.io` restantes = script JS de redirection hostname (à garder)
- HTTP live :
  - `https://synchrovie.github.io/Boutique-SynchroVie/` → **301** → `https://synchro-vie.com/`
  - une fiche produit github.io → **301** → la même fiche sur synchro-vie.com
  - `https://synchrovie.github.io/` (racine user, hors repo) → **404**
- CNAME = `synchro-vie.com`
- Pas de branche `gh-pages` (déploiement = `main`)

## Problème restant

Google a encore des URL `synchrovie.github.io/Boutique-SynchroVie/...` dans l’index
(ex. recherche `site:synchrovie.github.io`). Le 301 existe ; l’index met du temps
à basculer. Ça se règle dans Search Console, pas dans le code.

## 1. Search Console (obligatoire)

1. Ouvre https://search.google.com/search-console
2. Vérifie que les deux propriétés existent (sinon ajoute-les) :
   - `https://synchro-vie.com/`
   - `https://synchrovie.github.io/Boutique-SynchroVie/` (préfixe URL)
3. Propriété **github.io** → menu **Suppressions** (Removals) :
   https://search.google.com/search-console/removals
4. Nouvelle demande → **Supprimer une URL temporairement** puis, si proposé,
   **Obsolète** / **Expiré** pour le préfixe :
   `https://synchrovie.github.io/Boutique-SynchroVie/`
5. Propriété **synchro-vie.com** → Inspection d’URL sur 2–3 pages citées par l’audit
   (`/produits/masque-sommeil-ondes-delta.html`, fiche bague) → Demander une
   indexation si besoin.
6. Attendre 1–14 jours. Ne pas s’attendre à un SERP propre le jour même.

## 2. GitHub Settings (vérification seulement)

https://github.com/synchroVie/Boutique-SynchroVie/settings/pages

Doit afficher :
- Source : branche `main` (racine)
- Custom domain : `synchro-vie.com`
- Enforce HTTPS : coché
- **Ne pas** « Remove » le custom domain
- **Ne pas** Unpublish le site

## 3. Interdit

- Ne pas mettre `Disallow: /` dans le `robots.txt` de `main`
- Ne pas mettre `noindex` global sur toutes les pages (ça noindex aussi synchro-vie.com)
- Ne pas supprimer le script JS « Redirection forcée GitHub Pages »
