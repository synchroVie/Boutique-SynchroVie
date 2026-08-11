# Brief d'Actualisation — 2026-07-15

## Article à actualiser
- **Fichier** : `blog/abonnement-bague-connectee-donnees-sante.html`
- **Titre actuel** : Abonnement bague connectée : que valent les données santé ?
- **Description actuelle** : Abonnement bague connectée : que valent les données santé mesurées ? VFC, SpO2, sommeil — on décortique ce qui est utile et ce qui est marketing.
- **Dernière modification** : 2026-07-13

## Tâche d'actualisation

Cet article n'a pas été modifié depuis plus de 14 jours. Pour maintenir
le signal 'freshness' SEO, il faut l'actualiser.

### Actions à effectuer
1. **Ajouter un paragraphe 'Mise à jour 2026-07-15'** en haut de l'article (juste après l'intro)
   - Mentionner une donnée récente (étude 2025-2026, statistique marché)
   - 150-200 mots maximum
   - Format : `<aside class="update-notice">...</aside>`

2. **Vérifier et mettre à jour les liens externes**
   - Identifier les liens morts (404)
   - Remplacer par des sources équivalentes récentes

3. **Mettre à jour les chiffres/datess** dans le corps
   - Si l'article mentionne 'en 2024', mettre 'en 2026'
   - Si une étude de 2022 est citée, vérifier s'il existe une version 2025

4. **Mettre à jour le lastmod dans sitemap.xml**
   - Automatique via Agent 3

5. **Mettre à jour le JSON-LD Article**
   - Ajouter `dateModified: "2026-07-15"`

## Workflow
1. GLM (moi) génère ce brief automatiquement
2. Tu copies le brief + le contenu actuel de l'article → Claude
3. Claude propose la version actualisée
4. Tu colles le résultat final dans l'article
5. Commit + push

## Rappel des règles éditoriales SynchroVie
- Mots interdits : Découvrez, Révolutionnaire, N'attendez plus, Optimisez votre, etc.
- Ton : humain, professionnel, jamais commercial agressif
- Douleur avant promesse
- Sources scientifiques citées [1], [2]

## À faire manuellement après réception du résultat Claude
- [ ] Vérifier que le format HTML est conforme aux autres articles
- [ ] Vérifier les liens internes (vers produits SynchroVie)
- [ ] Mettre à jour `dateModified` dans le JSON-LD
- [ ] Tester la page en mobile
