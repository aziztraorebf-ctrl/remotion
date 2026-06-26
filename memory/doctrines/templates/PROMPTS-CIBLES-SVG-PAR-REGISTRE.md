# ⭐ BIBLIOTHEQUE DE PROMPTS-CIBLES SVG — un prompt par REGISTRE (pas un prompt unique)

> Gravee 2026-06-22 (insight Aziz). Le succes du SVG generatif n'est PAS un seul prompt-cible pour toute scene,
> mais une BIBLIOTHEQUE : un prompt-cible CALIBRE par registre/famille, deduit de l'analyse de NOS prototypes
> qui marchent. Chaque prompt vise le NIVEAU DE COMPLEXITE REELLEMENT FAISABLE en SVG (pas une illustration).
> Complete [[SVG-FAISABILITE-AMONT]] (la methode) + [[SVG-SCENES-GENERATIVES]] (les registres prouves).

## 🖼️ CHAQUE REGISTRE = PROMPT + IMAGE-REFERENCE (toujours joindre les deux) — regle Aziz 2026-06-22
Images-ref durables : `public/_shared/refs/svg-registres/` (frames de protos prouves, une par registre).
PROCEDURE pour TOUTE generation d'image-cible d'un beat :
1. Choisir le registre -> prendre SON image-ref (ex hachure-encre = `REGISTRE_hachure-encre_arbre.png`).
2. La JOINDRE a la generation AVEC le prompt, en precisant explicitement : "ATTACHED = STYLE/LEVEL REFERENCE ONLY
   (match this drawing complexity & ink style), the SCENE I want is DIFFERENT: [decrire la scene du beat]".
   -> le modele connait alors EXACTEMENT le niveau faisable (il l'a deja produit) + dessine une scene NOUVELLE.
3. Resultat : fidelite/proximite des le 1er coup, peu importe le type de scene, sans se casser la tete.

| Registre | Image-ref | Prompt | Statut |
|---|---|---|---|
| hachure-encre | `svg-registres/REGISTRE_hachure-encre_arbre.png` | REGISTRE 1 ci-dessous | ✅ CALIBRE |
| braise-or | `svg-registres/REGISTRE_braise-or_mine.png` | REGISTRE 2A ci-dessous | ✅ CALIBRE (2026-06-25) |
| or-jour | `svg-registres/REGISTRE_or-jour_hero.png` | REGISTRE 2B ci-dessous | ✅ CALIBRE (2026-06-25) |
| papier-decoupe | `svg-registres/REGISTRE_papier-decoupe_arbre.png` | REGISTRE 2C ci-dessous | ✅ CALIBRE (2026-06-25) |
| medaille/tactique (carte schema) | `svg-registres/REGISTRE_medaille-tactique_carte-schema.png` | REGISTRE 3 ci-dessous | ✅ CALIBRE (2026-06-25) |

## 🛠️ CLAUDE = EDITEUR SVG APRES GENERATION (rappel, deja approuve Aziz)
Un element genere qui ne plait pas (la pelle, le soleil, une racine) -> NE PAS regenerer : je le LOCALISE dans le SVG
et je le REDESSINE/ameliore a la main en code (precedent prouve : la fumee de la scene Soudan rendue plus epaisse).
Le LLM genere la MASSE, je retouche les details. Voir [[SVG-SCENES-GENERATIVES]] § capacite B (Claude editeur SVG).

## ⛔ LA REGLE QUI A DEBLOQUE CECI (cause racine d'une perte de temps, 2026-06-22)
On generait des image-cibles = ILLUSTRATIONS DENSES (gravure de musee type wuar68 : milliers de hachures de plume)
-> magnifiques en raster MAIS INFAISABLES en SVG vectoriel -> ecart "intensif" image->SVG.
LECON : l'image-cible doit RESSEMBLER DEJA A UN SVG FAISABLE. "Ce qu'on voit dans la cible = ce qu'on obtient en SVG."
Pour calibrer un prompt-cible : PARTIR D'UNE FRAME D'UN PROTO QUI MARCHE (la joindre comme ref), pas d'une idee abstraite.

## 2 FAMILLES FAISABLES (toutes nos scenes prouvees y tombent — voir frames `out/_r-and-d/svg-scenes-refs/`)
1. **APLATS + DEGRADES** (chaud) : graine paper-cut, hero-or, mine, creuset, ville. Premium = couches empilees +
   degrades doux + epure + couleur semantique. AUCUNE hachure.
2. **TRAIT GRAVE EPURE** (encre/medaille) : ⭐ arbre-hachure, etat-major, offshore-blueprint. Premium = trait `stroke`
   animable (se-dessine) + hachures MESUREES (strates, zones) + lignes de construction + colorisation discrete sur le trait.
> Le "premium" ne vient JAMAIS de la densite de trait. Il vient de l'EPURE + le MOUVEMENT (couleur semantique, se-dessine, tomber-sec).

---

## ⭐⭐⭐ LECON MAJEURE 2026-06-23 — SCENE NARRATIVE > SCHEMA ANNOTE (cause racine retrouvee)
On derivait vers des SCHEMAS ANNOTES (coupe/blueprint avec cotes, labels, 8000km) = froids, "plan technique".
Nos protos REUSSIS (piece Senegal, port, etat-major, hero-or) sont des SCENES NARRATIVES : un MOMENT + 4-5 OBJETS-HEROS
charges de sens, qui RACONTENT. CAUSE de la derive : (1) je pensais "schema/dispositif explicatif" au lieu de "scene qui
raconte" ; (2) l'image-ref de calibrage etait une PLANCHE ANNOTEE -> les modeles (qui suivent tres bien la ref) rendaient
des planches. CORRECTION PROUVEE (render `qu8pwk.png` / `ryf0wi.png`) :
- Definir une INTENTION NARRATIVE (le moment, pas le schema). Ex hook GGW = "le mur fier ecrase par l'immensite" (ruban
  d'arbres minuscule + dunes ecrasantes + soleil de plomb + pelle plantee abandonnee). Pendant de la piece Senegal (derrick vs ocean).
- Donner comme image-ref de calibrage une SCENE NARRATIVE prouvee (`REF-NARRATIVE_piece-derrick-ocean.png`), PAS une planche.
- Consigne explicite : "SCENE NARRATIVE, PAS un schema, ZERO cote/label/annotation technique, 4-5 objets-heros qui racontent".
- Le transfert MARCHE : les 2 modeles savent rendre le narratif en encre OU en chaud-medaille.
⭐ CHOIX REGISTRE selon ANIMATION : l'ENCRE neutre = MEILLEUR CANEVAS pour le PILOTAGE COULEUR SEMANTIQUE (monde en encre,
seuls certains elements se colorent timeo sur la voix : pelle coloree d'emblee -> arbres qui verdissent -> soleil ardent ->
desert reste encre = oilSpread inverse). Le chaud-medaille est plus beau en STATIQUE mais "deja tout colore" = zero munition
couleur. => scene a colorisation progressive timee -> ENCRE. Scene one-shot deja chaude -> medaille. (Aziz prefere l'encre ici.)
⭐ GPT-5.5 decoupe PLUS FIN (17-18 <g id> vs 8 pour Gemini) = mieux pour animer element par element ; Gemini = dessin/dunes
plus organique. Generer les 2 reste la regle. Reutiliser les assets SVG existants (geminiTrees.ts = arbres profil tronc+
feuillage etage) plutot que regenerer. Refs narratives + registres : `public/_shared/refs/svg-registres/`.

## REGISTRE 1 — HACHURE / ENCRE EPUREE (coupe technique, planche d'etude) ✅ CALIBRE & PROUVE
> Calibre sur le proto `REF_arbre-hachure-encre_horizontal_colorisation.mp4` (catbox 80vb3k). Frame-cible : ARBRE_0.97.
> Cibles generees validees : v1 https://files.catbox.moe/wj74vx.png · v2 https://files.catbox.moe/zn0ws4.png
> USAGE : toute scene COUPE / SCHEMA TECHNIQUE / planche d'etude en encre brune sur creme (sol, mecanisme, infrastructure).
> A joindre TOUJOURS : une frame d'un proto encre-epure (ARBRE_0.97) comme image de reference de NIVEAU.

PROMPT (remplacer [SCENE] par l'objet de la scene) :
```
The ATTACHED IMAGE is the EXACT target style and complexity level — match it precisely. It is a real animatable SVG
frame: sparse brown-black ink LINE-ART on warm cream parchment, EPURED schematic engraving (NOT a dense museum
engraving, NOT photorealistic, NOT a busy plate).
Generate a VERTICAL 9:16 [SCENE] at EXACTLY this drawing level:
- Brown-black thin ink outlines on cream #e8dcc0. NO solid color fills, NO photoreal, NO dense plume hatching.
- Hatching ONLY as sparse schematic strata / zones (a few parallel or wavy lines each) + light corner construction grids.
- Sun drawn with dotted/dashed rays; rain/flux as a few dashed lines.
- A few technical construction/measurement guides: dotted depth lines, sparse labels/cotes ("+17 m", "nappe", "15 N").
- Everything as separable line shapes (animatable in stroke-dasharray). EPURE: 5-7 hero elements, each readable in 1 s.
- Premium editorial flat-engraving look, like a clean animated explainer schematic.
```
NETTOYAGE EN CODE attendu apres generation : cotes parfois doublees/mal placees (+17m vs +1.5m) -> garder une seule,
la recoler au bon element. Colorisation = AJOUTEE EN CODE (tronc->vert, nappe->bleu) par-dessus le trait encre.

---

## REGISTRE 2A — APLATS + DEGRADES CHAUD SOMBRE (braise-or : mine, ressource, désert ardent) ✅ CALIBRÉ

> Calibré sur protos `MineGeminiAnimee.tsx` (lkf0ia) + `CreusetAnimee.tsx` (yonpoq). Frame-ref : `REGISTRE_braise-or_mine.png`.
> Modèle : **Gemini** (gagne sur l'organique/profondeur). Générer Gemini + GPT, choisir sur render statique.
> USAGE : scène chaude et matérée (mine, ressource africaine, désert ardent, conflit pour une richesse, nuit de braise).

PROMPT (remplacer [SCENE] par l'objet de la scène) :
```
The ATTACHED IMAGE is the EXACT target style and complexity level — match it precisely. It is a real animatable SVG
frame: warm dark earth tones with glowing gold accents, flat vector with smooth gradients, NO hatching, NO photoreal.
Generate a VERTICAL 9:16 [SCENE] at EXACTLY this style level:
- Dark warm earth base: #1c1108 / #2a1a0d. NO blue, NO grey, NO cold tones.
- Ocre layers: #7a4a22 / #9c5f2c / #b8763a. Gold accent: #e8b44a / #f2cf72 / #ffe39a (luminous, not metallic).
- Ember/conflict accent (use sparingly): #d6552e / #c23a1e.
- Flat solid color fills + smooth gradient overlays for depth. NO hachures, NO outlines, NO technical labels.
- 4-5 hero elements, each readable in 1s. Layered depth (foreground / midground / background clearly separated).
- Premium warm editorial look: depth by layering, not by density. Everything as separable <g id="..."> groups.
```
NETTOYAGE attendu : vérifier que `fill` n'utilise pas de couleurs froides (bleu/gris) — les remplacer par les ocres/ors ci-dessus. Gemini peut ajouter des ombres en `<style>`/`class` → extraire en `fill-opacity` inline animable.

---

## REGISTRE 2B — APLATS + DEGRADES CHAUD LUMINEUX (or-jour : héros en action, matin doré, victoire) ✅ CALIBRÉ

> Calibré sur proto `HeroGptAnimee.tsx` (1ws3kh). Frame-ref : `REGISTRE_or-jour_hero.png`.
> Modèle : **GPT-5.5** (gagne sur la lisibilité du personnage en action). Générer les 2, choisir.
> USAGE : scène lumineuse et premium (personnage actif, matin doré, découverte, victoire, contraste chaud/lumière).

PROMPT (remplacer [SCENE] par l'objet de la scène) :
```
The ATTACHED IMAGE is the EXACT target style — match this luminous warm illustration level precisely.
Generate a VERTICAL 9:16 [SCENE]:
- Sky: bright amber #f2cf72 / #ffd98a / #ffe8b8. Clouds: ivory #f7eccf. NO blue sky, NO night.
- Ground/earth: clear warm ocre #c98a4a / #b8763a / #e0b878 (LIGHT, not dark).
- Gold light: #f2cf72 / #ffe39a. Conflict accent (very discrete): #d6552e.
- NO blue, NO grey, NO flat black fills. Premium luminous morning look.
- Flat vector, solid fills + soft gradient overlays. NO hatching, NO photoreal, NO dense outlines.
- 4-5 hero elements, each crisp and readable in 1s. Everything as separable <g id="..."> groups (animatable).
- The scene should feel ACTIVE and LUMINOUS, not dramatic or dark.
```

---

## REGISTRE 2C — PAPIER DÉCOUPÉ PÉDAGOGIQUE (paper-cut : cycle, croissance, explainer) ✅ CALIBRÉ

> Calibré sur proto `GraineGeminiAnimee.tsx` (ft5l5g / wv4xlm). Frame-ref : `REGISTRE_papier-decoupe_arbre.png`.
> Modèle : **Gemini** (gagne nettement — couches organiques empilées + ombres douces = sa force).
> USAGE : scène pédagogique/explainer (croissance, cycle, processus, Kurzgesagt-papier). Joyeux, clair, accessible.

PROMPT (remplacer [SCENE] par l'objet de la scène) :
```
The ATTACHED IMAGE is the EXACT target style — match this layered paper-cut illustration level precisely.
Generate a VERTICAL 9:16 [SCENE]:
- Sky layer: pastel blue #bfe3ef / #a8d8e8. Ground layer: cream #fdf3df / #f7ecd2.
- Earth layers: warm ocre #caa46a / #b3823f / #8a5a2c. Greens stacked: #3e7c34 / #569b43 / #7cba5a / #a8d678.
- Wood/bark: #8a5a2c / #a06b35. Soft gold light: #f2cf72 / #ffd98a. Accent: coral #e0795b (warm, not aggressive).
- FLAT SOLID COLOR FILLS only (no gradients, no hatching, no outlines). Each shape = a distinct opaque layer.
- Soft drop-shadow under each layer (subtle, not graphic). Depth by stacking layers, NOT by shading.
- 4-6 elements, each a distinct paper-cut silhouette. Clean, joyful, premium. Everything as separable <g id="..."> groups.
- NO black, NO flat grey, NO cold colors. NO dense detail. Minimal and expressive.
```
NETTOYAGE attendu : Gemini peut ajouter ombres en `<style>`/`class` → extraire en `filter:drop-shadow` ou `fill-opacity` inline.

---

## REGISTRE 3 — CARTE/SCHEMA TACTIQUE (médaille/tactique : zones, flèches, liens) ✅ CALIBRÉ

> Calibré sur protos `EtatMajorGptAnimee.tsx` (pt5od0) + `DefenseGptAnimee.tsx` (05xbm1). Frame-ref : `REGISTRE_medaille-tactique_carte-schema.png`.
> Modèle : **GPT-5.5** gagne (géométrie nette, flèches à poids, cartouche propre). Générer les 2, choisir.
> USAGE : encart conceptuel — un PRINCIPE, un RAPPORT DE FORCE, un PACTE (PAS une carte géo-réaliste → d3-geo pour ça).
> ⚠️ PAS une carte géo réelle : la vraie géo s'effondre en SVG (test top-down). SVG = schéma/abstraction UNIQUEMENT.

PROMPT (remplacer [SCENE] par le concept à illustrer) :
```
The ATTACHED IMAGE is the EXACT target style — match this tactical schematic level precisely.
Generate a VERTICAL 9:16 [SCENE] as a SCHEMATIC (NOT a geographic map, NOT an illustration):
- Background: very dark blue #0b1526. Grid lines: faint #1a2a45 (barely visible).
- Main strokes: off-white #e8eef5 + steel blue #5a8fc0 for connections/links.
- THREAT/enemy: RED-ORANGE #d6552e (strong, clear). SOLIDARITY/shield: GOLD #c8a951.
- 4-6 hero elements: nodes (circles/hexagons) + weighted arrows + labels. Each element separable <g id="...">.
- Arrows: strokeDasharray-animatable (drawn progressively). Nodes: simple geometric shapes (circle, hex).
- NO photoreal, NO organic shapes, NO dense detail. Schematic precision + editorial clarity.
- Cartouche / legend block in corner (optional but premium).
```
NETTOYAGE attendu : GPT peut oublier les `id` sur certains `<g>` → les ajouter manuellement pour l'animation. Flèches parfois sans `marker-end` → rajouter un `<marker>` SVG.

---

## METHODE POUR AJOUTER UN REGISTRE A CETTE BIBLIOTHEQUE (reproductible)
1. Reperer le ou les protos qui incarnent le registre (frames dans `out/_r-and-d/svg-scenes-refs/`).
2. Extraire une frame-cible representative (apogee).
3. Ecrire le prompt-cible qui DECRIT ce que la frame montre (le NIVEAU faisable), la joindre comme ref a la generation.
4. Generer 1-2 image-cibles -> verifier qu'elles ressemblent au proto (pas plus denses).
5. TEST D'ECART (image->SVG, [[SVG-FAISABILITE-AMONT]]) -> confirmer ecart quasi-nul -> graver le prompt ici.
```
```
