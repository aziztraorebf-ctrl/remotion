# ⭐ BIBLIOTHEQUE DE PROMPTS-CIBLES SVG — un prompt par REGISTRE (pas un prompt unique)

> Gravee 2026-06-22 (insight Aziz). Le succes du SVG generatif n'est PAS un seul prompt-cible pour toute scene,
> mais une BIBLIOTHEQUE : un prompt-cible CALIBRE par registre/famille, deduit de l'analyse de NOS prototypes
> qui marchent. Chaque prompt vise le NIVEAU DE COMPLEXITE REELLEMENT FAISABLE en SVG (pas une illustration).
> Complete [[SVG-FAISABILITE-AMONT]] (la methode) + [[SVG-SCENES-GENERATIVES]] (les registres prouves).

## ⚠️ REGISTRES 2-3 A CALIBRER — ACTION REQUISE PROCHAINE SESSION

> **REGISTRE 2 (aplats+dégradés : or-jour, braise-or, papier-decoupe) et REGISTRE 3 (carte/schéma tactique) sont des TODO.** La prochaine session qui génère une scène de l'un de ces registres DOIT graver le prompt ici (15 min). Procédure : § METHODE POUR AJOUTER UN REGISTRE ci-dessous.

## 🖼️ CHAQUE REGISTRE = PROMPT + IMAGE-REFERENCE (toujours joindre les deux) — regle Aziz 2026-06-22
Images-ref durables : `public/_shared/refs/svg-registres/` (frames de protos prouves, une par registre).
PROCEDURE pour TOUTE generation d'image-cible d'un beat :
1. Choisir le registre -> prendre SON image-ref (ex hachure-encre = `REGISTRE_hachure-encre_arbre.png`).
2. La JOINDRE a la generation AVEC le prompt, en precisant explicitement : "ATTACHED = STYLE/LEVEL REFERENCE ONLY
   (match this drawing complexity & ink style), the SCENE I want is DIFFERENT: [decrire la scene du beat]".
   -> le modele connait alors EXACTEMENT le niveau faisable (il l'a deja produit) + dessine une scene NOUVELLE.
3. Resultat : fidelite/proximite des le 1er coup, peu importe le type de scene, sans se casser la tete.
| Registre | Image-ref | Prompt |
|---|---|---|
| hachure-encre | `svg-registres/REGISTRE_hachure-encre_arbre.png` | REGISTRE 1 ci-dessous ✅ |
| papier-decoupe | `svg-registres/REGISTRE_papier-decoupe_arbre.png` | REGISTRE 2 (a calibrer) |
| or-jour | `svg-registres/REGISTRE_or-jour_hero.png` | REGISTRE 2 (a calibrer) |
| braise-or | `svg-registres/REGISTRE_braise-or_mine.png` | REGISTRE 2 (a calibrer) |
| medaille/tactique (carte schema) | `svg-registres/REGISTRE_medaille-tactique_carte-schema.png` | REGISTRE 3 (a calibrer) |

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

## REGISTRE 2 — APLATS + DEGRADES CHAUD (scene-heros, terre/desert/ressource) ⏳ A CALIBRER
> Famille prouvee (hero-or 1ws3kh, mine, creuset, graine paper-cut). Premium = degrades doux + couches + epure + couleur.
> TODO prochaine fois qu'on en a besoin : partir d'une frame (hero-or_0.92 / graine_0.97), la joindre, deriver le prompt
> "flat vector, solid fills, smooth gradients, layered depth, 4-5 hero elements, NO hatching, NO photoreal".

## REGISTRE 3 — CARTE/SCHEMA TACTIQUE (medaille/tactique : zones, fleches, liens) ⏳ A CALIBRER
> Prouve : etat-major (pt5od0) = "carte" SCHEMATIQUE qui marche (zones hachurees + fleches tracees). ⚠️ une vraie carte
> GEO-REALISTE s'effondre en SVG (test d'ecart top-down) -> pour de la vraie geo : d3-geo, pas le SVG-LLM.
> TODO : deriver le prompt depuis une frame etat-major quand on en aura besoin.

---

## METHODE POUR AJOUTER UN REGISTRE A CETTE BIBLIOTHEQUE (reproductible)
1. Reperer le ou les protos qui incarnent le registre (frames dans `out/_r-and-d/svg-scenes-refs/`).
2. Extraire une frame-cible representative (apogee).
3. Ecrire le prompt-cible qui DECRIT ce que la frame montre (le NIVEAU faisable), la joindre comme ref a la generation.
4. Generer 1-2 image-cibles -> verifier qu'elles ressemblent au proto (pas plus denses).
5. TEST D'ECART (image->SVG, [[SVG-FAISABILITE-AMONT]]) -> confirmer ecart quasi-nul -> graver le prompt ici.
```
```
