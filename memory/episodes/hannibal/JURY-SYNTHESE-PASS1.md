# Jury Pass 1 — Synthèse Hannibal : Traversée des Alpes

> Jury : GPT-4o + Gemini 2.5 Pro + Grok 3. Date : 2026-05-04.

---

## 1. Tableau de triage

| Idée | Source(s) | Outil | Difficulté | Verdict |
|------|-----------|-------|------------|---------|
| Sprite-decay éléphants (37 icônes SVG s'éteignent 1 à 1) | GPT-4o, Gemini, Grok | SVG + interpolate() | Moyenne | **CONVERGENCE FORTE** |
| Dernier éléphant pulse or (freeze-frame 1.5s) | GPT-4o | SVG + spring() | Faible | **CONVERGENCE FORTE** |
| Densité de la colonne qui se raréfie visuellement | Gemini | PixelLab sprites + CSS opacity | Moyenne | **CONVERGENCE FORTE** |
| Compteur numérique gros plan (46 000 → 20 000) | Grok, GPT-4o | StatGauge + interpolate() | Faible | **CONVERGENCE FORTE** |
| FocusBubble nuit sur le rocher — tension Allobroges | Grok, GPT-4o | FocusBubble existant | Faible | **CONVERGENCE FORTE** |
| Beat 3 : 4 sous-séquences de ~6s (col / pertes / vinaigre / Italie) | GPT-4o | Multi-Sequence Remotion | Moyenne | **BONNE IDÉE À VALIDER** |
| Barre d'altitude HUD (monte/descend en temps réel) | Grok | StatGauge SVG vertical | Moyenne | **BONNE IDÉE À VALIDER** |
| Bezier animé Rhône (fleuve turbulent) + éléphant radeau | Gemini | SVG path animé + sprite | Haute | **BONNE IDÉE À VALIDER** |
| Dutch tilt + vibration rocher vinaigre | GPT-4o | transform rotate + spring() | Faible | **BONNE IDÉE À VALIDER** |
| Dolly-out révèle ITALIA label au bas des Alpes | GPT-4o | interpolate() scale/translate | Faible | **BONNE IDÉE À VALIDER** |
| Trait pointillé doré qui trace la route = "cicatrice" | GPT-4o | SVG stroke-dasharray animé | Moyenne | **BONNE IDÉE À VALIDER** |
| Deux cartes côte à côte (contexte + zoom zone) | Grok | d3-geo dual composition | Haute | **IDÉE RISQUÉE** (format portrait déjà contraint) |
| Projection personnalisée orientée NW-SE | Grok | d3-geo rotate + clip | Très haute | **IDÉE RISQUÉE** (R&D non validée) |
| Pan vertical carte (Espagne bas → Italie haut) | Grok, Gemini | d3-geo + interpolate() | Moyenne | **À DÉCIDER** (voir alerte ci-dessous) |

---

## 2. Alerte critique — Projection portrait Méditerranée (Grok)

**Problème** : La zone narrative Espagne→Alpes→Italie est horizontale par nature. En portrait 1080×1920, la Mercator standard l'écrase en bande étroite au centre — illisible et sans impact.

### Option A — Pan vertical de sud à nord
La carte reste en Mercator standard, mais le viewport "descend" du sud (Espagne) vers le nord (Italie) via `interpolate()` sur la translation d3-geo. La montagne devient le point haut du cadre.

- **Pour** : Exploite la verticalité du portrait. Sentiment de voyage réel. Facile à implémenter avec notre stack d3-geo.
- **Contre** : On ne voit jamais la vue d'ensemble complète. Nécessite un Beat de contextualisation en amont.
- **Effort** : Faible — pattern similaire à l'existant Atlas.

### Option B — Projection rotée NW-SE (diagonale)
Pivoter la projection pour aligner Espagne-Italie diagonalement dans le cadre portrait.

- **Pour** : Peut-être la solution la plus fidèle géographiquement, sans écrasement.
- **Contre** : Aucune validation dans notre stack. R&D requise (d3-geo `rotate` + `clipAngle`). Risque élevé de rendu bizarre sur cartes Natural Earth.
- **Effort** : Haute — ne pas tenter sans prototype isolé d'abord.

### Option C — Vue cropped zoom Beat 1 puis pan progressif
Commencer avec une vue large contexte (toute la Méd visible) pendant le Hook/Contexte, puis zoomer et panner sur la zone Alpes pour les beats narratifs.

- **Pour** : Donne le contexte global en ouverture (meilleur storytelling), puis entre dans le détail. Compatible avec notre pattern d'ouverture Atlas.
- **Contre** : La vue large sera écrasée aussi en portrait. Acceptable si c'est juste 5-8s de contexte.
- **Effort** : Faible — deux états d3-geo interpolés.

**Recommandation** : Option A en principal (pan nord-sud) + vue contexte courte en ouverture (Option C pendant le Hook uniquement). Ne PAS tenter Option B sans prototype validé.

---

## 3. Recommandations production — Top 7

Classées par priorité narrative + faisabilité :

1. **Option A + C combinées** (projection) — Résoudre l'alerte architecturale avant tout. Hook = vue contexte large (5s), Beat 2 = pan sud→nord commence.

2. **Sprite-decay éléphants** — 37 icônes SVG en colonne, s'éteignent de droite à gauche par vague. Dernier pulse or = money shot. Implémentation : SVG + `interpolate()` sur `opacity` par index.

3. **FocusBubble nuit sur le rocher** — Zoom sur Hannibal, blur background, spotlight dramatique. Existant dans `_shared/`. À déclencher au sommet du Beat 3, pendant le passage Allobroges.

4. **Compteur numérique gros plan** — Chiffres `46 000 → 20 000` en gros au moment de la révélation des pertes. Couplé au sprite-decay pour double impact.

5. **Barre d'altitude HUD** — StatGauge vertical qui monte pendant la montée et descend à la descente. Visible pendant tout le Beat 3 (25s). Signature RPG cohérente avec memory/feedback_atlas-rpg-hud-patterns.md.

6. **Dutch tilt + vibration vinaigre** — `transform: rotate(3-5deg)` + spring() shake pendant 2-3s. Moment d'action pure, contraste avec la carte statique.

7. **Dolly-out révèle ITALIA** — Après la descente, `interpolate()` scale qui recule pour révéler le label "ITALIA" + plaine du Pô. Clôture visuelle du Beat 4 avant la Conséquence.

---

*Idées conservées pour Pass 2 (si Aziz valide) : trait pointillé doré "cicatrice", bezier Rhône animé (Beat 2 optionnel).*
