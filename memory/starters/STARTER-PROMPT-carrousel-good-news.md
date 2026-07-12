# Carrousel "Good News Macro" — Démarrage & Décisions

> Créé 2026-06-01. 3e type de carrousel Kora & Cartes (après hybride-vidéo et analytique-newsletter).
> Origine : longue conversation Gemini (Aziz) sur stratégie Instagram + veille hebdo last30days.

## Concept

Carrousel **bonnes nouvelles africaines à angle MACRO** : pas seulement "c'est bien pour l'Afrique",
mais "voici comment cette avancée impacte Tokyo / Paris / Montréal / le reste du monde".
Objectif = aimant grand public (entonnoir) qui nourrit l'audience premium des carrousels analytiques.

Anti-pattern proscrit : ton naïf "feel good" / photos d'enfants qui sourient. La charte reste premium K&C.
Différentiel = nouvelles positives + rigueur data + perspective macro mondiale (quasi inexistant dans la niche).

## Décisions validées (Aziz, 2026-06-01)

1. **Volume** : 3-4 nouvelles DÉVELOPPÉES (pas 10 listicle). Chaque nouvelle = 1 slide fait-brut + 1 slide bascule macro.
2. **Source data** : `last30days` automatisé sur fenêtre 7j (exécution dimanche/lundi), filtré "bonnes nouvelles Afrique impact macro mondial". 95% automatisé comme GEO Africa Watch.
3. **Premier livrable** : 1 carrousel prototype complet AVANT d'automatiser le pipeline. Juger sur pièce.

## Décisions techniques validées (2026-06-01, suite)

- **Charte Good News = LUMINEUSE** (pas le navy sombre du flux analytique). Fond ivoire `#fbf7ec`→`#f0e6cf` + halo doré, texte navy `#16213a`, accents gold/goldDeep. Fichier : `good-news/theme.ts` (objet `GN`). Distingue visuellement le flux positif du flux grave.
- **Visuels = 100% Remotion animé** (PAS d'illustrations Gemini — abandonnées). Raison : signature unique non-clonable, 0$, animé (dwell time), data-driven (le chiffre EST le visuel). Gemini good-news testé puis écarté (trop sombre, décoratif, "c'est de l'IA").
- **Approche "mix briques"** : petite bibliothèque de briques animées réutilisables assemblées selon la nouvelle. Briques : `gauge` (jauge/compteur ✅ fait), `map` (Mapbox tracé/spotlight), `bars` (classement/dépassement), `flow` (chaîne d'impact). Dossier : `good-news/bricks/`.
- **Liaison slide fait ↔ slide macro = CONTINUITÉ NARRATIVE** (pas panoramique technique). Chaque slide a sa propre animation indépendante (Instagram reboucle chaque slide séparément — la continuité technique se brise à la 2e lecture). Slide fait = chiffre qui se construit ; slide macro = chiffre rappelé en PETIT + NOUVELLE animation montrant l'impact monde. Pas de redondance, chaque slide apporte du neuf.
- **Rythme animation = LENT/posé** (~2,8s remplissage jauge, pas 2s). Plus premium.

## Structure type (validée conversation Gemini)

- Slide 1 : Couverture hook ("3 avancées africaines qui changent la donne mondiale cette semaine")
- Slides 2,4,6 : Fait brut (nouvelle + chiffre)
- Slides 3,5,7 : Bascule macro ("Pourquoi Tokyo/Paris regardent : ...")
- Slide finale : CTA — pour les 10 premiers tests, formulation SIMPLE "clique sur notre avatar @koraetcartes" (PAS de ManyChat/DM au début, 0$ dépensé).

## Pipeline technique (réutilise l'existant)

Composants : `src/projects/souverain/carousels/hybrid/` — `CarouselSlideHybrid.tsx`, `CarouselCtaSlide.tsx`.
Charte : navy `#16213a` · gold `#c8a951` · ivory `#f5efe0` · serif Georgia. Format 4:5 (1080×1350).
Pour Good News statique : fonds = illustrations Gemini OU fond navy + motif carte filigrane (pas besoin de vidéo Mapbox).

## Outils écosystème (réf conversation Gemini)

- **Postiz** (open source) : planification multi-plateforme. NE FAIT PAS l'automatisation DM.
- **ManyChat** : leader DM auto (commentaire→lien DM). Gratuit = 25 contacts/mois seulement. Payant dès 14$/mois.
- Alternatives freemium DM : Brevo (généreux, français), SocialBu. Open source : n8n / Chatwoot / Typebot (technique).
- **Stratégie de départ** : 0$ — clic avatar direct, pas de DM auto. Brancher freemium seulement si volume le justifie après 10 vidéos.

## Carrousel hybride (mécanique vidéo en fond) — noté pour plus tard

Instagram/TikTok/Facebook acceptent slides vidéo mixées avec images dans un carrousel.
Stratégie : texte statique premium + boucle vidéo 5-10s en fond (extrait Remotion/Mapbox de la vidéo déjà publiée).
Booste dwell time + clics profil = signal algo fort. 1re frame carrousel = thumbnail de la vidéo (zéro friction).
Faisable via export segments Remotion (frames X→Y) en MP4 vertical, puis array mixte JPG+MP4 via Postiz.

## PUBLIÉ — Carrousel Good News #1 (2026-06-02)
Programmé sur Postiz pour **mercredi 3 juin 2026, 12h Paris (10h UTC)** — Instagram + Facebook.
Script : `scripts/schedule-goodnews-carousel.py`. Slides avec musique Mande (or-africain) : `out/_r-and-d/good-news/final/with-audio/`.
postIds : IG `cmpvw6snr01ydmt0yq53p5f44`, FB `cmpvw6spd01yemt0y4hubifoy`, TikTok `cmpvwb94y01z1mt0yxsnc5dit`.
TikTok = vidéo unique `gn-FULL-tiktok.mp4` (34,5s, 8 slides concaténées + musique, son ON) via `scripts/schedule-goodnews-tiktok.py` (le carrousel vidéo y est impossible).

⚠️ **GOTCHA TikTok carrousel** : le Photo Mode TikTok via Postiz n'accepte QUE des images statiques en multi-éléments, PAS des slides vidéo ("Only pictures are supported when selecting multiple items"). Pour TikTok : soit carrousel d'images PNG (perd l'animation), soit poster gn-FULL-preview.mp4 en vidéo unique. À traiter séparément.

## VALIDÉ v3 (2026-06-01) — prototype approuvé Aziz
Full preview en ligne : https://files.catbox.moe/aw0kz8.mp4
Review Gemini 3.1 Pro intégrée (6 points).

## PIPELINE AUTOMATISÉ (2026-06-02) — semi-auto data-driven
Contenu séparé du code : `carousel-data.ts` (`CURRENT_EDITION`) = source unique. Preview + 8 compositions `gn-XX` (via `slide-props.ts`) en dérivent. Changer de semaine = éditer carousel-data.ts SEUL.
Workflow : 1) `python3 scripts/prepare-goodnews-weekly.py` (last30days→BRIEF) · 2) Claude sélectionne/vérifie 3 nouvelles + remplit carousel-data.ts · 3) `./scripts/render-goodnews-carousel.sh` (slides+musique+TikTok) · 4) scripts schedule-goodnews-*.py (Postiz).
Jugement factuel = HUMAIN/Claude (jamais auto, anti-hallucination chiffres). Détails : `good-news/README.md`.

## État production — PROTOTYPE COMPLET (2026-06-01)

8 slides rendues : `out/_r-and-d/good-news/final/gn-00..07.mp4` + `gn-FULL-preview.mp4`.
Compositions Root.tsx Folder `CarouselGoodNews` (ids `gn-00-hook` ... `gn-07-cta`).

Briques codées (`good-news/bricks/`) : `GaugeBrick` (jauge %), `FlowBrick` (chaîne d'impact 2 nœuds + particules), `BarsBrick` (dépassement de rang). Slide map : `GoodNewsSlideMap.tsx` (Mapbox Caspian beige + tracé SVG géocodé MCP).
Slide générique lumineuse : `GoodNewsSlideLight.tsx` (modes fact/hook/cta, props brick).
Charte : `good-news/theme.ts` (GN).

Mapping briques → nouvelles :
- Maroc : fait=bars (Maroc 100 dépasse Afrique du Sud 86), macro=flow (Usines 🏭 → Airbus ✈️)
- Kenya : fait=gauge (90%), macro=flow (Énergie ⚡ → Data centers 🖥️)
- Algérie : fait=map Caspian (corridor Alger→Berlin), macro=flow (Hydrogène 💧 → Europe 🇪🇺)

### Itération 2 (2026-06-01) — corrections feedback Aziz
- Algérie : fade-in global 10 frames + tracé décalé frame 24 → masque le clipping de chargement Mapbox (sinon flash au début de boucle, agaçant).
- Maroc bars : agrandi (BAR_W 900, BAR_H 130, chiffres 64px) + zone brique recentrée (top 130, bottom 560) → vide entre barres et texte supprimé.
- FlowBrick : nœuds agrandis (R 112, glyphe 96px) + prop `layout` (horizontal/diagonal/vertical) pour varier la disposition (Maroc + Algérie en diagonal montant = "l'Afrique fournit vers le haut", Kenya horizontal). Évite la répétition "2 cercles identiques".
- Hook : `GlobeBadge` (globe doré + 3 points d'impact) en haut + typewriter sur le titre + sous-titre fade. Durée 165 frames.
- CTA : bouton play pulsant agrandi (150px + halo) + typewriter + texte 60px. Durée 150 frames. Inspiré du CarouselCtaSlide hybride.

### BUG REPO PRÉEXISTANT contourné (2026-06-01)
Root.tsx importait 4 beats Maroc Batteries inexistants (`Beat1Phosphate`, `Beat3Acteurs`, `Beat4Geographie`, `Beat5Question`) → bundle Remotion cassé (Module not found), bloquait TOUT render. Créé des stubs placeholder neutres dans `src/projects/souverain/maroc-batteries/beats/`. À remplacer par les vrais beats quand le Short Maroc Batteries (A2-A6) sera produit. NON lié au carrousel Good News — dette préexistante.

### FIX TECHNIQUE IMPORTANT (2026-06-01)
`scripts/render-mapbox.sh` avait un chemin chrome-headless-shell hardcodé mort (`ms-playwright/chromium_headless_shell-1217`). Corrigé : pointe vers `node_modules/.remotion/chrome-headless-shell/...` (obtenu via `npx remotion browser ensure`) + fallback Playwright glob. Sans ce binaire, le rendu Mapbox headless produit une carte VIDE (le `--gl=angle` seul ne suffit pas). Toujours `npx remotion browser ensure` après un `npm install` frais.

## Sujets candidats Good News macro (recherche 2026-06-01)

- Kenya : >90% électricité renouvelable / géothermie → hub data centers verts pour l'IA mondiale (alternative Europe saturée).
- Hydrogène vert : Namibie/Mauritanie/Afrique du Sud → déserts côtiers = pôles export énergie pour l'Europe qui se défossilise.
- Maroc : 1re puissance industrielle d'Afrique (BAD mai 2026) → automobile/aéro dans chaînes appro Airbus.
- BAD : combler déficit infra = +4,5 pts PIB/an.
- Sommet nucléaire Kigali (18-21 mai 2026).
