# Starter Prompt — Suite carousels Instagram Kora & Cartes

> Session du 2026-05-31. Coller en début de prochaine session.

---

## Contexte

Nous avons lancé la chaîne Kora & Cartes. 9 vidéos sont planifiées via Postiz (2-20 juin 2026). En parallèle, nous produisons des carousels Instagram 8 slides pour accompagner chaque vidéo.

**Pipeline carousel validé :** Gemini Flash Image (`gemini-3.1-flash-image-preview`), brief par slide, frames vidéo comme références. Toutes les règles sont dans `memory/tools/gemini.md` section "Pipeline Carousel Instagram".

## Carousels — Statut actuel

| Carousel | Date pub | Statut |
|---|---|---|
| Or Africain | 2 juin | ✅ VALIDÉ |
| Vraie Taille Afrique | 4 juin | pending |
| Thiaroye | 6 juin | ✅ VALIDÉ |
| Niger Uranium | 9 juin | ❌ ABANDONNÉ |
| Mansa Moussa | 11 juin | ✅ VALIDÉ |
| Empire Ghana | 13 juin | pending |
| Soundjata | 16 juin | pending |
| Silicon Savannah | 18 juin | pending |
| Sénégal Pétrole | 20 juin | pending |

## Ordre de production prioritaire

1. **Vraie Taille Afrique** (sort le 4 juin — urgent)
2. **Empire Ghana** (13 juin)
3. **Soundjata** (16 juin)
4. **Silicon Savannah** (18 juin)
5. **Sénégal Pétrole** (20 juin — mid-form, cas particulier)

## Ce qu'Aziz veut faire en début de session

Aziz aura des instructions et recherches à faire AVANT de continuer les carousels. Attendre ses instructions avant de lancer quoi que ce soit.

## Règles critiques à appliquer (résumé)

1. **Contenu = vidéo source uniquement** — extraire frames toutes les 10s, lire les sous-titres, ne jamais improviser des faits (`feedback_carousel-content-source.md`)
2. **Langue** — ajouter dans chaque brief : "Tout le texte en français uniquement. Zéro mot anglais."
3. **Cartes géo** — injecter nos frames Mapbox, jamais demander à Gemini de dessiner une carte
4. **Graphiques avec textes structurels** — Option B (génération libre) pas Option A (overlay)
5. **CTA dernière slide** — "La vidéo complète est sur notre profil. / Clique sur notre avatar @koraetcartes en haut de ce post." (clic avatar = zéro friction. NB : "lien en bio" ne pénalise PAS le reach — démenti Mosseri ; c'est le trafic sortant réel qui est défavorisé)
6. **Header** — UNE SEULE rangée de 8 barres, pas de "SLIDE X/8", pas de chiffres sous les barres
7. **Rogner les sous-titres** — crop 18% bas de chaque frame avant envoi à Gemini
8. **Inspecter les personnages** — Gemini peut modifier bérets/uniformes, corriger en i2i si nécessaire
9. **Contact sheet** — générer PIL 4×2 grid + uploader catbox pour validation Aziz avant de valider le carousel
10. **RATIO** — ⛔ JAMAIS 9:16 unique. IG/FB carrousel = **4:5 (1080×1350)** ; TikTok Photo Mode = 9:16 séparé. La slide 1 fixe le ratio de tout le carrousel.

## Fichiers de référence

- **Stratégie distribution complète (3 flux + corrections vérifiées 2026)** : `memory/STRATEGIE-DISTRIBUTION-INSTAGRAM-2026.md` ⭐
- Pipeline complet : `memory/tools/gemini.md` section "Pipeline Carousel Instagram"
- Script scheduling Postiz : `scripts/schedule-postiz.py`
- Angle éditorial : `memory/ANGLE-MACRO-SOUVERAIN.md`
