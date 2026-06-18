# Décodage templates Hera AI — chantier EN COURS

> Démarré 2026-06-18. Matière préservée : `out/_r-and-d/decode-hera/` (15 vidéos `.mov` + 45 frames + README).
> **Point d'entrée matière = `out/_r-and-d/decode-hera/README.md`** (classification 6 familles × 3 registres).
> Lié : [[remotion-effects-rack-natif]] · [[feedback_hooks-style-objet-matiere]] · `ProtoEffect_MapDrawParchemin` (registre parchemin clair, déjà validé).

## Contexte
Aziz s'est inscrit sur **hera.video** (Y Combinator, gratuit), a généré ~15 clips de templates data-viz/motion.
Hypothèse : 100% reproductibles voire améliorables avec notre stack (comme mapanimation). But = extraire le
**langage graphique** (fonds, palettes, overlays, grammaire) pour bâtir NOTRE doctrine cohérente — pas copier.
Décision Aziz (2026-06-18) : **coder les protos d'abord (séquentiel), doctrine déduite ensuite** ; garder les
bons protos et les pousser loin ; **sketch V14 = nouveau registre à explorer**.

## RECHERCHE HERA.VIDEO (2026-06-18) — ce qu'on peut récupérer

- **Le site = `hera.video`** (pas hera.ai). App = `app.hera.video`. Text-to-motion + **100+ templates** (charts/maps/infographics).
- **Pas d'export alpha annoncé** (MP4 only selon une source comparateur) — MAIS V11 montre un damier transparent.
  Contradiction non tranchée (peut avoir changé / dépend du plan). À vérifier si on veut un export transparent comme eux.
- **Galerie templates publique** : `hera.video/templates` (13 templates orientés marketing/SaaS, chacun avec
  page détaillée = script beats + asset checklist + **copy-paste prompt**) + templates partagés `app.hera.video/shared/<uuid>`.
- ⚠️ **Vidéos MP4 NON récupérables via curl/tavily** : l'app charge la vidéo via API JS (le HTML ne contient que "Loading...").
  Pour télécharger un MP4 il faudrait **Playwright** (ouvrir page → intercepter l'URL `storage.googleapis.com/hera-video/...` du `<video>`).
  Pas nécessaire : on a déjà nos 15 captures + frames. Le filon "écrasable" est CONFIRMÉ (chart paramétré par prompt).
- ✅ **Les prompts SONT lisibles** sur les pages `/shared/`. Exemple capté (template "Bar Chart with Gradient Bars") :
  « Keep the style of this bar chart, only change the data depending on the user prompt » / « make this a bar chart
  with 20 bars » / « remove the 0 on the y axis make the x axis label horizontal ». = prompts d'édition incrémentale.

## ⭐ GRAMMAIRE NARRATIVE HERA (la vraie découverte) — 5 beats, identique sur tous les templates data
1. **Pose la question** que la donnée répond.
2. Montre la **baseline / point de comparaison**.
3. **Anime** le chiffre / trend / ranking clé (le geste).
4. **Traduit** le chiffre en langage simple (le takeaway).
5. **Source** + action (CTA / lien).

Polish Hera (= recoupe NOTRE doctrine Souverain, validation externe) :
- Retirer toute donnée qui ne sert pas le takeaway principal.
- **Labels directs, pas de légendes.**
- **Pause après le chiffre le plus important** (= notre count-up land + breathe).

## 3 REGISTRES DE FOND CANON (réponse au problème récurrent "quel background ?")
| Registre | Couleurs Hera | Notre appropriation Souverain |
|---|---|---|
| **Parchemin / quadrillé clair** | papier `#F2EFEC` · quadrillé `#E7E7E7` | papier `#e4ddca` · grille or-sable `#c2a96a` · contour navy `#16213a` · accent or `#c8a951` (cf. ProtoEffect_MapDrawParchemin) |
| **Carte estompée** | clair `#F4F4F4` ou sombre `#898B8F` | à définir (chart-sur-carte = famille B, notre point faible) |
| **Terminal néon noir** | `#111111` + grille sombre + glow cyan/magenta/vert | à définir (registre "tech/marché" — V09 V15) |
| **Sketch / whiteboard** (NOUVEAU, V14) | papier clair + trait crayon + flèche manuscrite + smiley | à explorer — décision Aziz : oui, nouveau registre |

## 6 FAMILLES (détail + mapping briques dans le README matière)
A carte fill/contagion · B chart-sur-carte · C charts (bar/line/donut/poll) · D big-number count-up ·
E article/presse · F timeline/fiches. On a déjà ~70% des briques (FlagFill, MapDraw, HeroVerticalBars, donut,
count-up odomètre, EvidenceBoard, WarMapDimmedOverlay).

## PLAN PROTOS (séquentiel, registre par registre) — ✅ 5/5 CODÉS + RENDUS (2026-06-18)
Compos dans `src/projects/_proto-16-9/ProtoHera_*.tsx`, enregistrées Root.tsx. Géo : `westAfricaPath.ts` (18 pays d3-geo).
- [x] **Proto 1 — `ProtoHera_ChartsParchemin`** (famille C, registre parchemin) : 3 scènes bars/poll/line à
      la charte Souverain (parchemin+navy+or). ✅ Concluant. Poll-bar = la plus forte. À ajuster : line trop basse dans le cadre.
- [x] **Proto 2 — `ProtoHera_ChartOnMap`** (famille B, réf V08) : barre OR + axe sur vraie carte Afrique de l'Ouest
      estompée navy + titre pastille. ⭐ LE MEILLEUR — directement réutilisable en prod Souverain. Manque : série multi-barres.
- [x] **Proto 3 — `ProtoHera_TerminalNeon`** (registre néon, réfs V09+V15) : line cyan/magenta glow + donut 4 quadrants fluo.
      ✅ Technique parfaite (glow SVG headless OK). MAIS hors charte premium Souverain — registre réservé sujets marché/tech.
- [x] **Proto 4 — `ProtoHera_Sketch`** (NOUVEAU registre, réf V14) : barres crayon (feDisplacementMap) + smiley + flèche
      manuscrite rouge + label cursif. ✅ Charme réel. Gotcha : police Caveat = fallback (à installer si on garde).
- [x] **Proto 5 — `ProtoHera_Timeline`** (famille F, réf V10) : frise dorée + médaillons + fiches sur carte estompée.
      ✅ Élégant. NOTE : médaillons (initiale or) au lieu de vraies photos rondes — en prod, clip rond + vraie photo.

### Ce qui MARCHE chez nous (vs Hera)
- **On écrase Hera facilement** sur parchemin/carte-estompée/timeline (notre charte est plus premium, vraie géo d3-geo).
- **Glow néon** rend nickel en headless (feGaussianBlur+feMerge). **Effet crayon** rend nickel (feTurbulence+feDisplacementMap).
- La **grammaire Hera 5-beats** + polish (labels directs, pause sur le chiffre) recoupe notre doctrine = validation externe.
### Ce qui RESTE / décisions ouvertes
- Registre néon : garder comme option "marché/tech" mais PAS pour l'éco-politique premium.
- Sketch : si on garde → installer vraie police manuscrite (Caveat).
- Famille F : prévoir le clip-rond photo réelle pour la prod (asset Gemini = validation Aziz avant).
- Frames rendues (preuves) : `/tmp/hera-p1-*.png` `hera-p2-150` `hera-p3-*` `hera-p4b` `hera-p5` (régénérables).

## REPRODUCTIONS FIDÈLES (méthode mapanimation — ajout 2026-06-18, retour Aziz)
⚠️ **RÈGLE GRAVÉE** : copier le template À L'IDENTIQUE d'abord (couleurs/layout/texte des frames), PUIS approprier.
Sinon impossible de juger le template en soi. Fichier : `ProtoHeraFidele_Repros.tsx` (compos `HeraFidele_*`).
- V08 chart-carte Europe, V13 bars Pagare/Prendere, V01 poll Yes/No, V10 timeline Radcliffe, V04 drapeaux+then/now, V02 presse.
- Conclusion : **Hera est "écrasable"** — on reproduit sans effort. L'écart fidèle→Souverain = palette + police + géo + fond.

## VALIDATIONS AZIZ (2026-06-18)
- ✅ **Chart-sur-carte clair APPROUVÉ** (concept prouvé). Carte = VRAIE géo d3-geo (`westAfricaPath.ts`, 18 pays Natural Earth),
  PAS dessinée main. "Fait graphisme" = juste l'aplat uni ; améliorable via relief/dégradé/Mapbox satellite estompé.
  ⚠️ Version navy sombre REJETÉE (étouffait la carte) → corrigée en CLAIR LUMINEUX (ivory + carte gris-doré + barre or). C'est la bonne.
- ✅ **Timeline APPROUVÉE** en l'état (`ProtoHera_Timeline`).
- ✅ **Presse V02 COMPLÉTÉE** : portrait stipple WSJ généré (Gemini `gemini-3.1-flash-image-preview`, businessman générique
  réutilisable) → `public/_proto/hera/press-portrait.png`, intégré en `mixBlendMode:multiply` (fond blanc disparaît sur crème).

## GOTCHAS TECHNIQUES (gravés)
- ⛔ **Path SVG lourd (879KB) en string littérale CASSE le bundle Remotion** (mort silencieuse ~60% bundling, pas d'erreur).
  Solution : sortir le path vers `public/` (JSON) + charger via `fetch`+`delayRender`/`continueRender`. Cf. `world-land.json` + hook `useWorldLand`.
- **Intégrer illustration fond blanc sans détourage** : `mixBlendMode:"multiply"` (garde les traits noirs, fond disparaît sur clair).
- Gemini ignore souvent la demande d'alpha (fond blanc rendu). OK si fond cible clair + multiply ; sinon Recraft remove_background.

## MP4 catbox (2026-06-18)
Souverain : chart-carte CLAIR `q1chyq` · timeline `2cbzky` · charts parchemin `s790z1` · néon `n4mhbn` · sketch `oz59bs`.
Fidèles : V08 `gqif3h` · V13 `otband` · V01 `1du4aj` · V10 `d5ph0n` · V04 carte+drapeaux `cg76lu` · V02 presse+portrait `olfzlr`.

## CATALOGUE HERA — exploré en entier, puis TRIÉ (review Aziz 2026-06-18)
Lot 2 (`ProtoHeraFidele_Repros2.tsx`) — après exploration des 5 derniers, Aziz a TRANCHÉ :
- ❌ V05 contagion + V06 contour SUPPRIMÉS : on fait bien mieux en Mapbox 3D frame-driven (FlagFill, contours
  qui se tracent, mouvement caméra) + pas notre style. Repros SVG plates = en-dessous de notre niveau.
- ❌ V11 count-up SUPPRIMÉ : basique Remotion déjà maîtrisé de plusieurs façons, pas besoin de template.
- ✅ V03 texte cinétique CONSERVÉ : esthétique d'emphase (mettre l'accent sur un mot) — catbox `n8fwsx`
- ✅ V12 line chart bande jaune CONSERVÉ : variation 2 couleurs très modulable (décliner couleurs/styles plus tard) — catbox `kdht12`
⚠️ `heraScenePaths.ts` supprimé (servait V05/V06). Correction README matière : V12 = line chart bande highlight (pas une intro).

## ⭐ LEÇON DE TRI (gravée) : ne PAS garder un template Hera juste parce qu'on sait le reproduire.
Le garder seulement si (a) il apporte un registre qu'on n'a pas, ET (b) Hera ne le fait pas mieux que notre stack.
Carte/contagion/contour → notre Mapbox 3D écrase la repro SVG. Count-up → déjà natif Remotion. = supprimés.

## NEXT (après protos) — TOUT le catalogue est décodé
Doctrine "fonds + palettes + familles" : quel fond + quelle palette + quel graphe pour quel message → couvrir
TOUT sans re-explorer. Comparer/unifier avec notre kraft existant. Garder les protos forts (chart-carte clair = prêt prod), les pousser en candidats.
Plus de template Hera à explorer — place à la DOCTRINE + appropriation Souverain des registres validés.
