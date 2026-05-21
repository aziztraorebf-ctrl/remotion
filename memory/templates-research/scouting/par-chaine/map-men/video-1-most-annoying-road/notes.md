# The world's most annoying road
URL : https://www.youtube.com/watch?v=knCojy_3bmk | Durée : 802s (13:22) | Date upload : 2026-03-20

## Axe 1 — Palette de couleurs
- Couleurs dominantes (frame carte clé Panama/Colombie) : violet vif `#7B4FB5`, orange saturé `#E58B3A`, fond gris très clair `#E8EAEC`, frontières blanches `#FFFFFF` (épaisseur ~3px), texte noir `#1A1A1A`. Drapeaux en couleurs réelles (rouge/bleu/jaune)
- Ratio approx (frame 18) : gris clair ~55%, violet 22%, orange 10%, blanc 8%, texte/drapeaux 5%
- Mood : encyclopédie pour enfants, primaire flat, fortement contrasté, pas de gradient
- **Verdict palette** : 🟡 — palette pop "atlas enfant" éloignée de l'identité Souverain (noir+or). Référence utile pour épisode "ton léger / didactique" mais à filtrer fort

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Pin drapeau** sur tige fine noire planté dans le pays (drapeau 2D vectoriel ~80×50px)
  - **Label allcaps** sans-serif Bold blanc avec stroke sombre, posé directement sur le territoire
  - **Sous-label parenthèse** "(NOT COLOMBIA)" — pattern signature humour/clarification
  - **Insert carte papier vintage** (frame 15) : carte topographique scannée superposée en bottom-right, bordure trait fin, no shadow
  - **Vintage portrait clipping** (frame 2) : photo noir-et-blanc d'historique détourée sur fond animé live-action room
- **Verdict assets** : 🟢 — le pin-drapeau-sur-tige + label allcaps directement sur territoire est ultra-réutilisable Mapbox (symbol layer + text-field). L'insert carte papier vintage en overlay est aussi un pattern propre pour Souverain (texture archive)

## Axe 3 — Mouvements caméra
- Patterns dominants : statique + cuts secs. Quasi pas de pan/zoom sur la carte vectorielle. Quand mouvement = apparition séquentielle d'éléments (drapeau apparaît, label apparaît, pays change couleur)
- Durée moyenne des plans carte : 2-4s, puis cut vers live-action sketch
- Spécificités : la carte n'est pas un personnage qu'on caresse (≠ RealLifeLore ken burns). Elle est un panneau d'information. Tout le mouvement vient du build-up additif d'éléments dessus
- **Verdict caméra** : 🟢 — modèle "panneau statique avec build-up séquentiel" très adapté Short Souverain quand on veut citer rapidement 5-6 pays sans caresse géographique. Économise budget animation

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : background gris très clair (#E8EAEC), water blanc pur, fill-color par pays au choix, line blanche épaisse 3px, hide tous labels Mapbox natifs
- Projection inférée : Mercator standard (pas de globe 3D ici)
- Layers principaux : country fill (admin-0), country borders (white stroke), custom symbol layer pour pin-drapeau (icon + text-field), custom text overlay pour labels allcaps Remotion (pas Mapbox)
- Animations Remotion : opacity fade-in séquentielle pour drapeau→label→sous-label, color interpolate sur fill-color via setPaintProperty, zéro pan/zoom
- Difficulté de reproduction : ☑ basse

## Frames sélectionnées
- `frame-0018-panama-flat-flags.jpg` : signature Map Men en flat ultra-lisible — pin drapeau, label allcaps "(NOT COLOMBIA)", fill par pays
- `frame-0015-darien-overlay.jpg` : insert carte papier vintage en overlay sur live-action — pattern "archive collée"
- `frame-0002-vintage-portrait-screen.jpg` : compositing humoristique portrait XIXe sur écran de présentation — pas reproductible sans skit (skip)

## Verdict global vidéo : 🟡
Beaucoup de live-action + sketches non reproductibles, mais 2 patterns cartographiques solides à backloguer (pin-drapeau, insert papier).
