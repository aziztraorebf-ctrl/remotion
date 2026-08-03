# Reverse-engineering d'un style vidéo tiers → pipeline assets déterministe

> Prouvé 2026-07-17 sur le "style Vox papercraft" d'une vidéo Higgsfield (Zinho Automates).
> But : reproduire un rendu premium qu'on voit ailleurs, SANS l'outil tiers (Higgsfield ~200 crédits/vidéo,
> re-tirés à chaque essai), en HYBRIDE : images générées 1× (réutilisables) + overlays codés gratuits en Remotion.
> Doctrine sœur : [[MOTEURS-VISUELS-ET-SOCLE]] · gotcha réseau : `tools/gemini.md` (IPv6→curl IPv4).

## Le pipeline (5 étapes, reproductible)

1. **Extraire la portion pertinente** de la vidéo (yt-dlp `--force-ipv4` → `ffmpeg -ss X -to Y`). Un clip ciblé (~1-2 min) suffit, pas toute la vidéo.
2. **Envoyer la VIDÉO complète à Gemini 3.1 Pro** (Files API, upload REST **curl -4** — le SDK Python stalle en IPv6 sandbox). Gemini voit le MOUVEMENT (transitions, timing, pop) — supérieur aux frames figées. Script : `scripts/tools/gemini-vox-reverse-breakdown.py`.
3. **Breakdown JSON qui TRANCHE image-générée vs overlay-code** pour CHAQUE élément (voir gotchas prompt ci-dessous).
4. **Générer les assets "image"** via Gemini 3.1 Flash image + **frame réelle jointe en référence** (image-ref > texte).
5. **Coder les overlays + l'animation** en Remotion (texte, chart, flèches, pop/wiggle) = gratuit, déterministe, itérable à l'infini.

## Gotchas prompt breakdown (corrigés en V2, NON-NÉGOCIABLES la prochaine fois)

- ⛔ **PROMPT NEUTRE, zéro biais de forme.** V1 disait "reproduire en SVG" + exemple "SVG code" → Gemini a docilement classé un avion 3D texturé en "SVG plat". FAUX (Aziz l'a vu, pas moi). En V2, forcer Gemini à trancher la NATURE de chaque élément : `image_generee` (volume/matière/ombres/texture → IMPOSSIBLE en SVG plat) vs `overlay_code` (texte/chart/flèche/forme plate). Ne jamais mettre la conclusion technique dans la bouche du modèle avant qu'il analyse (= anti-pattern INTENTION→FORME→TEMPLATE dans le mauvais ordre).
- ⛔ **`maxOutputTokens` GÉNÉREUX** (≥12000). Un budget serré + JSON large (N éléments + timeline + palette) → Gemini RATIONNE les prompts de génération (une ligne générique au lieu d'un prompt exhaustif). Symptôme : prompts trop courts. Fix = plus de tokens.
- ✅ **Claude affine les prompts, pas 1 appel Gemini/asset.** Prouvé : le petit prompt Gemini de l'avion + enrichissement Claude (couleurs #hex, direction lumière "top-left", "match material/volume/lighting of reference") = résultat au niveau du tiers. Donc PAS besoin de N appels Gemini dédiés (1/asset = inutile) : Claude sert de "seconde barrière premium" qui complète le prompt. Économise ~6 appels.

## Verdict moteur image pour le style "papier 3D texturé / papercraft"

- **Gemini 3.1 Flash image = LE bon moteur.** Suit fidèlement le style papier 3D texturé, respecte "objet isolé", cohérence de matière entre assets. Testé sur avion ✅ + siège ✅.
- **Recraft = tire vers la pâte à modeler (clay), pas le papier.** Son style le plus proche (`digital_illustration/handmade_3d`) dérive vers claymation. Pas mauvais en soi — c'est son STYLE INTERNE qui colle moins bien que Gemini pour CE look. Recraft reste meilleur pour du **vrai vectoriel plat** (icônes/logos/SVG). Détail : `tools/recraft.md`.
- **Règle** : style à matière/relief (papercraft, photo, 3D) → **Gemini**. Style vectoriel plat pur → **Recraft**.

## Carte type d'un style "explainer Vox papercraft"

IMAGES à générer (Gemini, 1× réutilisable) : avion/objets papercraft, sièges, photos halftone d'archive, cartes 3D papercraft, silhouettes, fond papier journal.
CODE overlay (Remotion, gratuit) : chiffres/dates/labels (Impact bold sur bandeau déchiré), chart à barres (scaleY spring), flèches (SVG stroke-dashoffset), croix/formes plates, pop+wiggle stop-motion, drop-shadow papier.

## Boucle de RAFFINEMENT V2 (validée 2026-07-17) — notre rendu VS réf → Gemini → écarts

Une fois un 1er montage rendu (V1), la boucle qui converge vers le niveau du tiers :
1. Rendre notre plan (mp4 court).
2. **Envoyer LES DEUX vidéos à Gemini 3.1 Pro** (notre rendu = A, la réf tierce = B) → breakdown JSON des ÉCARTS actionnables. Script : `scripts/tools/gemini-compare-2videos.py` (upload REST curl -4, même pattern).
3. **CROISER 3 perspectives, ne jamais coder Gemini aveuglément** :
   - Gemini attrape de vrais écarts qu'on rate (échelle, police manuscrite vs serif…).
   - Gemini HALLUCINE aussi des éléments inexistants — prouvé : il a inventé "5 barres" (il y en a 4), "flèche noire" (c'est l'axe en L), "sommet jaune", "animation 3→6 sièges". Si on code ça, on ajoute du faux.
   - Aziz attrape ce que Gemini ET Claude ratent — prouvé : sens de l'avion (nez à gauche au lieu de droite), fond trop clair vs réf plus sombre/chaude. → sa relecture visuelle est un maillon du crible, pas optionnelle.
4. Claude produit la LISTE CORRIGÉE (vrais écarts, hallucinations retirées, ajouts d'Aziz) → code la V2 → re-render → re-boucle si besoin.

Écarts V1→V2 typiques sur ce style : agrandir l'objet (les objets sont souvent trop petits au 1er jet), miroiter si le sens diffère, assombrir le fond (multiply teinte chaude), grossir chart + labels, police manuscrite + scotch visible sur les étiquettes.

Détourage d'un asset généré (fond blanc → transparent pour le poser sur un autre) : flood-fill depuis les bords + érosion `MinFilter` de la frange + 2e passe qui retire les POCHES blanches enclavées (le flood ne les atteint pas). Sinon halo blanc résiduel visible.

## À RETRAVAILLER (prochaine session, PAS urgent — Aziz : motion graphics ≠ priorité)

Plan avion V2.1 quasi-parfait, restent 3 finitions (feedback Aziz 2026-07-17) :
- **Décaler l'avion vers la GAUCHE** jusqu'au bord de l'image (quitte à le couper à gauche) — il est trop collé à droite et touche le graphique. Dégager la concurrence avion/chart.
- **Frange blanche du détourage TOUJOURS présente** → LEÇON : ne PAS s'acharner en flood-fill code. La bonne méthode = **faire retirer le fond/la frange par GEMINI** (image-edit : "remove white background, clean transparent edges"). Plus propre que l'érosion PIL. À appliquer.
- Puis c'était "quasiment parfait" (mot d'Aziz).

**Reco DURÉE pour la suite** : tester le workflow sur des clips **15-30s**, PAS 5s. À 5s par test, c'est trop long/coûteux en itérations pour ce que ça rend ; le workflow devient vraiment intéressant sur une séquence plus longue (plusieurs plans enchaînés).

## PISTE FUTURE — style "whiteboard doodle" (Higgsfield) comme INSPIRATION pour scènes SVG narratives

Segment de référence extrait : **vidéo YouTube `LiQPU7_5v68` (Zinho Automates), 8:55→9:44** = style whiteboard animation Higgsfield. Fichiers : `public/_rnd/vox-repro/whiteboard_segment.mp4` + `whiteboard-bougies-ref.jpg` + `whiteboard-etageres-ref.jpg`.

Analyse (Aziz + Claude d'accord, 2026-07-17) : NE PAS copier ce style tel quel, mais **s'en inspirer pour ENRICHIR nos scènes SVG génératives narratives** (le registre trait noir + hachures rappelle GGW / nos scènes "par chemin" noir & blanc) :
- ✅ **Reproductible en SVG** (via GLM-5.2 / GPT-5.6 Sol) : décors au trait main + hachures d'ombre — bougies/lampes (frame 0:18), étagères de fioles/bocaux avec remplissage couleur crayonné (frame 0:32). Donnerait de la MATIÈRE à nos fonds SVG actuellement trop épurés.
- ❌ **PAS reproductible** : le personnage organique (scientifique, visage/proportions naturels, anim fluide) = génération IA. Nos persos restent schématiques (StickRig, perso d'encre) — ne pas viser l'organique.
Idée à recréer prochaine session (décor whiteboard SVG, pas le perso). Lien doctrines SVG : [[SVG-SCENES-GENERATIVES]] · [[PERSONNAGE-VIVANT-INDEX]].

### Clarification technique whiteboard : SVG-animé vs vidéo-générée (recherche web 2026-07-17)
3 familles distinctes, ne pas confondre :
- **Outils "main qui dessine" (Doodly, VideoScribe)** : base SVG/vectoriel, le logiciel anime le TRACÉ (stroke-dashoffset). MAIS les figures organiques complexes = assets PRÉ-DESSINÉS par des humains, importés — l'outil ne les CRÉE pas, il révèle un dessin existant.
- **Génération SVG native par IA** : un prompt → code SVG (paths) généré + animé. Outil packagé = **Thinking Line** (thinkingline.com : "1 prompt → vidéo whiteboard OU SVG éditable en <3min"). = MÊME philosophie que NOTRE pipeline (GLM-5.2/GPT-5.6 Sol → SVG → Remotion). Donc PAS besoin de cet outil : on refait pareil chez nous, gratuit + contrôlé. Décor au trait OK ; perso organique fluide = le point dur (beaucoup de courbes à interpoler).
- **Génération VIDÉO IA (Higgsfield, Animaker Whiteboard 3.0 fin-2025, BigMotion, Storyboard-AI github)** : génère des PIXELS entraînés au look whiteboard → c'est ÇA qui explique le perso organique fluide de la vidéo montrée (pas du SVG animé, de la vidéo hallucinée). Inimitable en SVG déterministe.
CONCLUSION : le whiteboard "outil" EST du SVG (Aziz avait raison) ; mais l'organique fluide de la réf Higgsfield est de la vidéo générée, pas du SVG. Pour nos scènes narratives → viser le DÉCOR whiteboard en SVG (notre pipeline = équivalent Thinking Line), pas le perso organique.
Inspiration à voir (sans Higgsfield) : chaînes RSA Animate, CGP Grey, Kurzgesagt, TED-Ed ; assets libres The Noun Project / unDraw / Open Doodles.

## Assets R&D produits (2026-07-17)
`public/_rnd/vox-repro/higgsfield-analysis/` : clip, transcript, breakdown-vox-v2.json, gen-avion-01.png (✅ niveau tiers), gen-seat-gemini.png (✅) vs gen-seat-recraft.webp (clay). Proto SVG plat abandonné (VoxPapercutAvion16x9.tsx — garde la valeur des overlays, PAS de l'avion).

## ⭐ MISE À JOUR 2026-08-03 (session refs TED-Ed/GEOlayers, Gazoduc) — simplicité RECONFIRMÉE + filtre feutre testé (statique seulement)

Nouvelle analyse de refs (TED-Ed "poverty", TED-Ed Mansa Musa, whiteboard/feutre) : **CONFIRME** la
conclusion whiteboard ci-dessus (§ 2026-07-17) par la preuve la plus forte possible — nos VRAIES
productions publiées (cacao, GGW) n'ont **jamais eu besoin** de personnages humains articulés
complexes pour porter le message ; elles passent par la métaphore graphique (arbre/racines/objets).
La simplicité n'est pas juste une contrainte technique acceptée, c'est ce qui MARCHE en pratique sur
nos propres livrables.

**Nouveau test technique — filtre SVG natif "feutre à main levée"** : `feTurbulence` +
`feDisplacementMap` en double-trace décalée (2 copies du même path, chacune légèrement déplacée par
le displacement map, superposées) reproduit avec succès le grain "tracé à main levée au feutre" sur
nos formes SVG existantes — **gratuit et natif**, aucun appel API. ⚠️ **Testé UNIQUEMENT sur image
fixe, jamais en mouvement** (frame figée) — le comportement en animation (le displacement doit-il
rester figé ou varier par frame comme le grain `feTurbulence` documenté dans `tools/remotion.md`
ligne 265 `seed={Math.floor(frame/4)}` ?) reste à vérifier avant tout usage en production. Piste
gardée en réserve, **pas retenue pour Gazoduc** (le globe D3 ne s'y prête pas — registre différent).

**Mains articulées (TED-Ed safran, main+mortier-pilon)** : testé, PAS viable en un jet — détail
technique complet (pourquoi, ce qui a été tenté) dans `PERSONNAGE-VIVANT-INDEX.md` § "Mains à
doigts individuels articulés".
