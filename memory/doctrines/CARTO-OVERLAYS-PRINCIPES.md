# ⭐ CARTO-OVERLAYS-PRINCIPES — doctrine des overlays géo-ancrés sur carte Souverain V5

> Doctrine maîtresse pour TOUT élément posé sur une carte Mapbox Souverain (cible [[CartoSouverainV5]]).
> Prouvée par render (session 2026-06-21, scène test `TokenShowcaseV5`). À lire AVANT de poser un marqueur,
> un jeton, un drapeau, une plaque, un flux sur une carte. Gate à venir : `scripts/tools/carto-selfreview.py`.

---

## ⛔ RÈGLE ZÉRO — anti-dérive (NON-NEGOTIABLE, déjà prouvée CartoGeoStickTest)
TOUT élément ancré à un lieu (marqueur, jeton, plaque, label, flux, drapeau) calcule sa position par
`map.project([lon,lat])` **RECALCULÉ À CHAQUE FRAME** (appeler `useCurrentFrame()` dans l'enfant pour forcer
le re-render). JAMAIS de `left/top` fixe en pixels. Sinon l'élément DÉRIVE quand la caméra bouge.

---

## 5 PRINCIPES OVERLAY (issus des retours Aziz sur la scène gisements E1)
- **P1 — jamais de texte nu sur la carte** → toujours une géoplaque (`GeoCountryPlaque`), un jeton ou une plaque cadrée.
- **P2 — plaque déportée** dans l'océan / à gauche (colonne libre), reliée au point, jamais posée SUR le continent.
- **P3 — leader FLÉCHÉ** visible du point géo vers la plaque déportée (ligne or + pointe).
- **P4 — marqueurs gros + pulse rapide**, viser au-delà du cercle (sonar qui se propage).
- **P5 — drift continu** : la caméra n'est JAMAIS parfaitement immobile (micro-oscillation, intégrée dans CartoSouverainV5).

---

## 🎯 JETONS GÉO-ANCRÉS — le système (prouvé 2026-06-21)

### Le cadre universel : `TokenFrame` (hexagone navy + liseré or)
Brique : `src/projects/_shared/mapbox/GisementTokens.tsx`. Un hexagone (navy + liseré or 2.5px + halo or
respirant + ombre portée) qui RÉSOUT le « jeton qui flotte dans le vide » : le contenu est toujours CADRÉ, posé,
il appartient à la carte. **2 MODES** :
- **mode `navy`** : fond navy + contenu posé dessus. Pour un **SVG natif animé** (l'animation a ses propres
  couleurs/motifs, le navy lui sert de toile). Ex : flamme de gaz, sonar.
- **mode `fill`** : le contenu REMPLIT tout l'hexagone (clippé à la forme), on ne garde que le liseré or.
  Pour une **image** (Gemini), un **drapeau**, un **sceau**. (Plus de navy visible dans les coins.)

### 5 variantes prouvées (`GisementKind` = "sonar" | "gas" | "oil" | "flag" | "seal")
| kind | contenu | mode | usage |
|---|---|---|---|
| `gas`   | torchère/flamme SVG natif qui vacille | navy | gisement gaz |
| `oil`   | illustration Gemini (plateforme offshore) | fill | gisement pétrole |
| `sonar` | point + anneaux concentriques (témoin sobre) | — | marqueur discret/secondaire |
| `flag`  | vrai drapeau clippé dans l'hexagone (ondule) | fill | acteur/pays (petit), PAS le pays-sujet |
| `seal`  | sceau or + étoile gravée (s'estampe) | fill | marquer un ÉVÉNEMENT (découverte, signature) |

### ⛔ Taille pilotée par le ZOOM (anti-agglutination — prouvé)
Le jeton a une taille FIXE en pixels → au DÉZOOM, des points géographiquement proches s'agglutinent/se chevauchent.
FIX : `sizeFactor = clamp((zoom - 6.0) / (7.4 - 6.0), 0.26, 1)`, appliqué au `scale` du jeton. Petit point au loin
(vue large), hexagone plein au plongeon. `GisementMarker` prend un prop `zoom` (= `map.getZoom()`).

### Anti-collision clipPath
Plusieurs jetons `fill`/`oil` coexistant = collision d'`id` SVG. Passer un `uid` unique par jeton (`GisementMarker`
prop `uid`) → les clipPath sont préfixés. Sans uid, fallback sur les coords arrondies.

### Caméra-plonge « établir puis plonger » (idée Aziz, validée)
Le dynamisme dès le départ : vue large ~2s pour poser les points (THREE FIELDS), PUIS plongée relief successive
(spring) sur chaque point (zoom ~7.4, pitch ~38). ~2.8s de tenue par point = l'animation des jetons respire
plusieurs cycles. Remontée large pour le raccord. Pattern `camKeys` (cf. `SceneGisementsV5Effets`/`TokenShowcaseV5`).

### Fix asset image dans un jeton
Une image Gemini réduite dans un petit cercle s'assombrit (image sombre + fond navy = double assombrissement).
FIX : (1) prompt de génération « lumineux/contrasté, halo clair » ; (2) côté code, **fond ivoire clair** sous
l'image (pas navy). Réf : `jeton-petrole-bright-square.png`.

---

## ⛔⛔ PROJETER SUR UN PAYS — 3 MÉTHODES, 2 PIÈGES (la grande leçon 2026-06-21)

Pour « peindre » un drapeau/une identité sur la silhouette d'un pays, **3 méthodes testées, 2 ÉCHOUENT** :

| méthode | comportement | verdict |
|---|---|---|
| ❌ **SVG clippé** (`useClipFlags`, `ClipFlagsLayer`, `MapboxFlagFill`) | image 2D plate dans une bbox → **DÉRIVE au pitch** (ne suit pas le terrain 3D incliné, le drapeau glisse/déborde) | **BANNI sur carte avec pitch** |
| ❌ **fill-pattern Mapbox** (`addCountryFlagFill`) | suit le terrain MAIS **carrelle/bouillie au dézoom** (la tuile garde sa taille pixel → illisible quand le pays devient petit) | à éviter pour les drapeaux |
| ✅ **source-image découpée à la silhouette** (`MapboxCountryFlagDecal`) | source `image` Mapbox (4 coords = bbox pays) + canvas pré-découpé à la silhouette → drapé sur le terrain : suit pitch/zoom/pan ET jamais de carrelage | **LA solution (drapeau-héros)** |

**Brique définitive** : `src/projects/_shared/mapbox/MapboxCountryFlagDecal.tsx`
`<MapboxCountryFlagDecal mapRef={...} iso="SEN" geoNames={["Senegal"]} drawFlag={(s)=>drawFlagCanvas("SEN",s)} />`

### Hiérarchie de remplissage pays (3 niveaux, du discret au fort)
1. **Aplat uni** (or/navy) — neutre.
2. **Couleurs nationales** (bandes du drapeau, SANS emblème) — pays SECONDAIRE évoqué. Carte vivante quand on
   parle de plusieurs pays. À utiliser avec PARCIMONIE (pas tout le continent = illisible). (Même brique decal,
   canvas couleurs-only ; testé sur Mali voisin, opacity ~0.78.)
3. **Drapeau complet projeté** (`MapboxCountryFlagDecal`) — le pays-SUJET (héros), un seul par scène en général.

⚠️ Le drapeau-pays NE doit PAS onduler (style GeoLes3 : plat, solidaire du terrain, suit la caméra sans grouiller).
L'ondulation est réservée au petit jeton-drapeau (`FlagToken`, mode fill).

---

## Génération du SVG des jetons (appel LLM dédié)
Pour ne pas deviner le SVG : appel dédié à un LLM qui génère le contenu de PLUSIEURS jetons d'un coup.
Script : `scripts/tools/llm-gen-svg.py` (Gemini 3.1 Pro vs GPT-5.5). Le LLM ne dessine QUE le contenu intérieur
(centré 0,0, rayon 40, animé par `f` = frame) ; le cadre + l'ancrage sont gérés par `TokenFrame`/`GisementMarker`.
Verdict du test Gemini vs GPT : voir [[key-learnings]] (section jetons SVG).

---

## Références
- Cible : `src/projects/_shared/mapbox/CartoSouverainV5.tsx` (3 modes caméra, drift P5).
- Briques : `GisementTokens.tsx` · `MapboxCountryFlagDecal.tsx` · `MapboxBase.tsx` (`addCountryFlagFill` = fill-pattern, marqué « carrelle au dézoom »).
- Showcase de référence (NE PAS supprimer) : `src/projects/_shared/mapbox/_demos/TokenShowcaseV5.tsx` (5 jetons + caméra-plonge + drapeau decal + couleurs nationales).
- Reprise : [[REPRISE-SYSTEME-CARTO-V5]].
