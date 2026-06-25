# 🌐 GUIDE CONFIGURATION DOMAINE synchro-vie.com CHEZ AMEN

## Ce qui a déjà été fait côté GitHub ✅

- Fichier `CNAME` créé dans le dépôt → contient `synchro-vie.com`
- Custom domain activé via API GitHub Pages
- HTTPS enforced activé
- Toutes les URLs du site mises à jour vers `synchro-vie.com/`
- Sitemap.xml mis à jour
- Redirection `synchrovie.github.io/Boutique-SynchroVie/` → `synchro-vie.com/` déjà active

**Ce qui manque** : configurer les DNS chez Amen pour que `synchro-vie.com` pointe vers les serveurs GitHub Pages.

---

## ÉTAPES À FAIRE CHEZ AMEN (15 minutes)

### Étape 1 — Connecte-toi à ton espace Amen

1. Va sur https://www.amen.fr/
2. Clique "Mon compte" en haut à droite
3. Connecte-toi avec ton identifiant Amen + mot de passe

### Étape 2 — Accède à la gestion DNS de synchro-vie.com

1. Dans ton tableau de bord, clique sur **"Mes domaines"**
2. Trouve `synchro-vie.com` dans la liste
3. Clique sur **"Gérer"** ou **"Configurer"** à côté du domaine
4. Cherche l'onglet **"DNS"** ou **"Zone DNS"** ou **"Gestion avancée DNS"**
5. Clique sur **"Modifier la zone DNS"**

### Étape 3 — Ajoute les 4 enregistrements A

Dans la zone DNS, ajoute ces 4 lignes (enregistrements A) :

| Type | Nom/Hôte | Valeur/Cible | TTL |
|---|---|---|---|
| **A** | `@` (ou vide) | `185.199.108.153` | 3600 (ou défaut) |
| **A** | `@` (ou vide) | `185.199.109.153` | 3600 |
| **A** | `@` (ou vide) | `185.199.110.153` | 3600 |
| **A** | `@` (ou vide) | `185.199.111.153` | 3600 |

**Important** : 
- Le "Nom" doit être `@` (qui représente le domaine racine `synchro-vie.com`)
- Le "TTL" (Time To Live) peut rester à sa valeur par défaut (généralement 3600 secondes = 1h)
- Tu dois ajouter 4 enregistrements A séparés (pas une seule ligne avec les 4 IPs)

### Étape 4 — Ajoute l'enregistrement CNAME www

Ajoute cette ligne (enregistrement CNAME) :

| Type | Nom/Hôte | Valeur/Cible | TTL |
|---|---|---|---|
| **CNAME** | `www` | `synchrovie.github.io` | 3600 |

**Important** :
- Le "Nom" est `www` (pas `www.synchro-vie.com`)
- La "Valeur" est `synchrovie.github.io` (SANS le `https://` et SANS slash final)
- C'est bien `synchrovie.github.io` (le compte GitHub), PAS `synchrovie.github.io/Boutique-SynchroVie/`

### Étape 5 — Sauvegarde

1. Clique **"Sauvegarder"** ou **"Valider"** ou **"Appliquer"**
2. Amen affiche normalement "Modifications prises en compte. Propagation DNS en cours."

### Étape 6 — Patiente (15 min à 24h)

La propagation DNS prend généralement :
- **15-30 minutes** pour les fournisseurs français principaux (Orange, Free, SFR, Bouygues)
- **1-4 heures** pour la majorité des FAI européens
- **Jusqu'à 24-48h** pour une propagation mondiale complète

### Étape 7 — Vérifie que le domaine est actif

Après 30 minutes, teste :
1. Ouvre https://synchro-vie.com/ dans ton navigateur
2. Tu devrais voir ton site SynchroVie
3. Le certificat HTTPS sera peut-être en cours d'émission par GitHub (24h max)

---

## VÉRIFICATIONS À FAIRE APRÈS PROPAGATION

### Test 1 — Site accessible
```
https://synchro-vie.com/ → doit afficher ton site
```

### Test 2 — HTTPS actif
- Vérifie que le cadenas 🔒 apparaît dans le navigateur
- Si "Connexion non sécurisée", attends 24h que GitHub émette le certificat Let's Encrypt

### Test 3 — Redirection www
```
https://www.synchro-vie.com/ → doit rediriger vers https://synchro-vie.com/
```

### Test 4 — Sitemap accessible
```
https://synchro-vie.com/sitemap.xml → doit afficher le XML
```

### Test 5 — DNS propagés
Vérifie sur https://dnschecker.org/ :
- Tape `synchro-vie.com`
- Vérifie que les 4 IPs GitHub (185.199.108.153, 109.153, 110.153, 111.153) apparaissent

---

## APRÈS PROPAGATION — SOUMETTRE À GOOGLE SEARCH CONSOLE

Une fois le domaine actif :

1. Va sur https://search.google.com/search-console
2. Ajoute une nouvelle propriété : `https://synchro-vie.com/`
3. Google va te demander de vérifier la propriété (via enregistrement TXT DNS ou balise meta)
4. Choisis "Enregistrement TXT" et ajoute la valeur fournie par Google dans ta zone DNS Amen
5. Une fois validé, soumets le nouveau sitemap : `https://synchro-vie.com/sitemap.xml`

### Garder l'ancienne propriété GSC ?
**OUI**, garde-la. Google va comprendre automatiquement la redirection 301 de `synchrovie.github.io/Boutique-SynchroVie/` vers `synchro-vie.com/` et transférer le link equity.

---

## EN CAS DE PROBLÈME

### Le site n'est pas accessible après 24h
1. Vérifie ta zone DNS chez Amen (capture d'écran)
2. Vérifie sur https://dnschecker.org/ que les IPs sont bien propagées
3. Envoie-moi la capture, je diagnostique

### HTTPS ne fonctionne pas
1. Va dans GitHub : Settings > Pages
2. Vérifie que "Enforce HTTPS" est coché
3. Si la case est grisée, attends 24h que GitHub détecte le domaine
4. Re-coche "Enforce HTTPS"

### www ne redirige pas
Vérifie que le CNAME `www` pointe bien vers `synchrovie.github.io` (pas vers autre chose)

---

## RÉCAPITULATIF DES ENREGISTREMENTS DNS À AJOUTER

```
Type  | Nom | Valeur                    | TTL
------|-----|---------------------------|--------
A     | @   | 185.199.108.153           | 3600
A     | @   | 185.199.109.153           | 3600
A     | @   | 185.199.110.153           | 3600
A     | @   | 185.199.111.153           | 3600
CNAME | www | synchrovie.github.io.     | 3600
```

**Note pour le CNAME** : Chez certains registrars, il faut ajouter un point final après `synchrovie.github.io.` (point indiquant la racine DNS). Chez Amen, teste sans le point d'abord. Si ça ne marche pas, ajoute-le.

---

## CE QUE FAIT GLM APRÈS PROPAGATION

Dès que tu me confirmes que synchro-vie.com est accessible :

1. ✅ Je teste les URLs live (HTTP 200)
2. ✅ Je soumets le sitemap à Google (ping)
3. ✅ Je vérifie que HTTPS est actif
4. ✅ Je confirme que la redirection www fonctionne
5. ✅ Je mets à jour les URLs dans les brouillons Medium/Quora/Reddit (qui utilisent encore synchrovie.github.io)
6. ✅ Je met à jour les prompts Claude (URLs à utiliser dans les articles)

**Dis-moi quand le domaine est accessible.**
