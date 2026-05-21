# Key Learnings — Remotion / Souverain

Lecons transversales, patterns et anti-patterns valides au fil des sessions.

---

### 2026-05-13 — Règle 6 — GEMINI DIFF VISUEL OBLIGATOIRE APRÈS PREMIER RENDER (NON-NEGOTIABLE)

**Règle :** Après chaque premier render d'un nouveau composant, TOUJOURS envoyer le render + le mockup original à Gemini 3.1 Pro (`gemini-2.5-pro-preview-05-06`) pour analyse diff avant toute itération manuelle.

**Pourquoi :** Itérer à l'aveugle sur 3 composants = 9+ passes. Gemini diff en une passe = corrections exactes en une passe. Fidélité mockup passée de ~60% à ~90% en un seul pass.

**Protocole exact :**
1. Render first v1 (50% chance d'écart notable)
2. Envoyer au LLM : render PNG + mockup PNG + prompt `"Liste les 5 différences visuelles majeures entre le mockup et le render. Pour chaque différence, donne la correction CSS/React exacte (valeur en px, couleur hex, propriété Tailwind)."`
3. Appliquer TOUTES les corrections en une passe
4. Render v2 = version finale (ne pas rendre une v3 sauf retour Aziz)
5. NE JAMAIS présenter un v1 à Aziz sans avoir fait le diff LLM d'abord

**Modèle à utiliser :** `gemini-2.5-pro-preview-05-06` (le seul qui retourne des hex codes complets et des coords SVG exactes). `gemini-flash` pour brainstorm uniquement, jamais pour diff visuel précis.

**S'applique à :** tout nouveau composant Remotion, tout nouveau template, tout beat avec layout custom.

---

### 2026-05-13 — Brief agents : 3 règles supplémentaires (background, proportions, dimensions)

**Problème observé :** FillScreen, OdometerFlip, RadarPing codés par agents — 3 écarts systématiques vs mockups Gemini malgré la règle visualWeight déjà en place.

**Règle 3 — BACKGROUND (NON-NEGOTIABLE) :**
- Famille reveal-mécanique : fond par défaut = `#080d14` ou plus sombre (`#060a10`)
- JAMAIS `bg-navy` (#141c2e) sans instruction explicite — les agents defaultent dessus
- Si le mockup Gemini montre quasi-noir = utiliser `backgroundColor: "#060a10"` inline
- Astuce brief : écrire explicitement `"background": "#060a10 — PAS bg-navy"` dans le JSON

**Règle 4 — PROPORTIONS LABELS (NON-NEGOTIABLE) :**
- Labels textuels (titre haut, sous-titre bas) dans les composants reveal-mécanique = fontSize MAX 32px, opacity 0.6-0.7, tracking large
- Ils sont DÉCORATIFS — l'élément central prend toute la place
- Si un label occupe >15% de l'espace écran = trop grand
- Astuce brief : écrire `"labels": "DÉCORATIFS — fontSize 28-32px max, opacity 0.65"` dans le JSON

**Règle 5 — DIMENSIONS EXPLICITES EN PX (NON-NEGOTIABLE) :**
- Tout élément central doit avoir ses dimensions écrites en px dans le brief, non-réductibles
- Exemples validés : OdometerFlip CASE_WIDTH=240, CASE_HEIGHT=300, fontSize=220, nbCases=4
- FillScreen centralValue fontSize=280px minimum
- Écrire dans le brief : `"dimensionsNonReductibles": { "caseWidth": 240, "caseHeight": 300, "fontSize": 220, "nbCases": 4 }` — l'agent ne peut pas descendre en dessous

### 2026-05-13 — Brief agents : visualWeight obligatoire + placeholders realistes

**Probleme observe :** Les agents de codage respectent les valeurs numeriques du breakdown JSON (ex: fontSize:130) mais pas l'intention visuelle du mockup. Resultat : CountdownReveal avec chiffre trop petit (320px au lieu de 380px+), PortraitGeometry avec typo 2x trop petite.

**Regle 1 — visualWeight dans le brief :**
Tout brief d'agent doit inclure une section `"visualWeight"` pour les elements dominants :
- Ex: `"visualWeight": "le chiffre doit remplir 60-70% du diametre du cercle"`
- Ex: `"visualWeight": "countryName doit etre aussi large que le cercle au-dessus"`

**Regle 2 — Placeholder realiste obligatoire :**
Quand un composant accepte une image externe (portrait, photo archive, carte), toujours generer un placeholder realiste Gemini Flash AVANT le render de validation — jamais un PNG 1px.
- PNG 1px = rendu injugeable (fond vert ou gris uni)
- Placeholder Gemini = peut juger le rendu final immediatement
- Exception acceptable : composants purement CSS/SVG sans image externe
