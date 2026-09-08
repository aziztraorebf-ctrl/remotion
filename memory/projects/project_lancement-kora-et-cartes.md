---
name: lancement-kora-et-cartes
description: "Milestone lancement officiel Kora & Cartes — 9 vidéos planifiées Postiz, 4 plateformes, juin 2026"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0534844a-967f-4178-b547-eccd5c13c151
---

# Lancement Kora & Cartes — 2026-05-29 (lancement initial)

> ⚠️ MISE A JOUR 2026-06-06 : le lancement initial a ETE UN FAUX DEPART (thumbnails vides). Voir le bloc ci-dessous AVANT d'agir. Le contenu d'origine (stack, gotchas Postiz, titres) reste valable, mais le cadre "lancement reussi, tout roule" est PERIME.

## ETAT REEL au 2026-06-06 (corrige)

**Diagnostic apres 5 jours :** IG/TikTok ~0 traction. CAUSE = thumbnails VIDES (bug Postiz : pas de champ couverture -> plateformes prennent la frame 0, souvent un aplat de couleur). Prouve par analytics (vignette vide = 0 vue) + code + frame bleue. PAS le contenu (YouTube OK : 28 abos, 2.9K vues ; Facebook 24 abos), PAS le warm-up, PAS l'automatisation.

**Actions prises :** posts Postiz en attente supprimes ; solution racine = FRAME 0 integree a la video (ffmpeg, methode 0.5s quasi-invisible) ; nouvel outil TryPost (MCP) adopte pour YT/FB/IG, Postiz garde pour TikTok (frame 0 repare son bug).

**Source de verite a jour (LIRE EN PREMIER) :**
- [[ARCHITECTURE-DISTRIBUTION-FINALE]] — repartition outil/plateforme, methode frame 0, statut par plateforme.
- [[STRATEGIE-DISTRIBUTION-OUTIL]] — diagnostic complet + comparatif outils (TryPost choisi, Ayrshare elimine).
- [[ORDRE-POSTS-POSTIZ-SAUVEGARDE]] — calendrier a jour (Niger retire, switch Senegal Short le 8 juin).
- [[TODO-PASSE-EDITORIALE-ANGLE-MILITANT]] — session separee : Mansa Moussa "plus riche que Rockefeller" non prouve, Thiaroye titrage.
(Tous dans memory/episodes/lancement-kora/)

**How to apply :** Le lancement n'est PAS "fait et reussi" — il est en cours de REPRISE avec couvertures corrigees. Ne pas republier sur une plateforme ou la video est deja publiee (eviter doublons). Le calendrier original ci-dessous est PERIME — utiliser ORDRE-POSTS-POSTIZ-SAUVEGARDE.

---

## Contenu d'origine (29 mai — stack et gotchas encore valables)

---

## Stack publication

- **Outil** : Postiz (API REST) — `scripts/schedule-postiz.py`
- **Clé API** : `POSTIZ_API_KEY` dans `.env`
- **Plateformes connectées** :
  - YouTube : `cmpsuxkke00h9ru0yk8mcfubf` (@koracartes)
  - Instagram : `cmpsydwti013eru0y5skhzjm1` (@koraetcartes)
  - TikTok : `cmpsuyefy00hbru0yqe2ez8ip` (@koraetcartes)
  - Facebook : `cmpsuzy1p00horu0yga3na02r` (@koraetcartes)

## Calendrier initial (3 vidéos/semaine, lun/mer/ven, 15h UTC)

| Date | Titre | Fichier source |
|------|-------|----------------|
| 2 juin | Le Ghana a signé l'accord que 6 pays refusaient | or-africain-FINAL.mp4 |
| 4 juin | Les USA, la Chine et l'Europe tiennent dans l'Afrique | vraie-taille-afrique-FINAL.mp4 |
| 6 juin | Ils ont libéré la France. Elle les a massacrés. | thiaroye-v5-FINAL.mp4 |
| 9 juin | Le Niger recevait 9 centimes sur l'euro depuis 53 ans | niger-uranium-FINAL.mp4 |
| 11 juin | Il a fait s'effondrer l'or mondial. Par accident. | mansa-moussa-atlas-v2-FINAL.mp4 |
| 13 juin | Au Sahara, le sel valait autant que l'or | empire-ghana-FINAL-v2.mp4 |
| 16 juin | Il était paralysé. Il a fondé le plus grand empire d'Afrique de l'Ouest | sonjata-v7-FINAL.mp4 |
| 18 juin | Le pays qui a inventé le paiement mobile avant Apple | silicon-savannah-FINAL.mp4 |
| 20 juin | Comment le Sénégal évite le piège du Niger | senegal-petrole-gaz-FINAL-compressed.mp4 |

## Règles Postiz (gotchas découverts)

- L'API Postiz (`PUT /posts/{id}`) n'existe pas — impossible de modifier un post existant
- Workflow correct pour modifier : DELETE puis recréer avec le bon contenu
- Les vidéos uploadées restent sur `uploads.postiz.com` même après DELETE du post — réutilisables
- Limit upload : 50 MB par fichier via API directe
- Format caption TikTok : 150 caractères max, 3-4 hashtags suffisent
- Facebook : `"settings": {"__type": "facebook"}` sans champ title — le content fait tout

## Décisions stratégiques publication

- **Cadence** : 3/semaine pour les 3 premières semaines, ajuster ensuite selon traction
- **Ordre** : Or Africain en premier (hook universel richesse), Sénégal mid-form en dernier (base construite)
- **Titres** : règle hybride 2 couches obligatoires (Test Tokyo + format empirique 50 car.)
- **Formules interdites dans captions** : "On vous a caché ça à l'école", "Ce qu'ils cachent", "La vraie raison"
- **Short-first validé** : Paperlore (8770 abonnés en 2 mois, Seedance 2.0, paper cut) confirme le modèle
- **Long form** : Sénégal 7m39s uniquement sur YouTube, les autres plateformes = shorts autonomes

## Prochaines vidéos à planifier

1. **Maroc Batteries Short** (pré-prod complète, audio prêt) — priorité 1
2. Nouveaux épisodes Souverain selon pipeline Beat
3. Pour chaque nouveau mid-form : créer un short autonome condensé en parallèle
