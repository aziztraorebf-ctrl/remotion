# Cacaoyer (CacaoTree)

**Issu de** : `VergerCacao.tsx` (cacao-chocolat-short)
**Registre** : encre narrative (fond `#e8dcc0` parchemin, encre `#2b2117`)
**ViewBox source** : composant parent 1080×1920 — coordonnées relatives (0,0) = base du tronc, Y négatif = vers le haut

## Parties

### Tronc (`id="tronc"`)
Silhouette pleine (pas un double-trait comme l'arbre Sahel) — un seul path fermé, ramifié en haut.
- `M-34 0 C-22 -92 -24 -165 -28 -252 C-12 -266 12 -266 30 -252 C24 -165 30 -92 42 0 Z`
- fill = couleur brun-vie `#4a2c14` (COCOA_DARK) si vivant, `none` si mort (trait seul)

### Branches (`id="branches"`)
4 amorces courtes, restent SOUS la couronne (pas de squelette qui dépasse au-dessus du houppier).
- `M-12 0 C-8 -90 -6 -170 -12 -254 C-30 -278 -52 -300 -72 -330 M-10 -254 C14 -284 40 -306 70 -336 M-6 -200 C24 -226 54 -238 84 -252 M-13 -160 C-40 -188 -68 -208 -94 -232`

### Couronne (`id="couronne"`, groupe translaté (0,-260))
Silhouette irrégulière pleine (pas des cercles empilés comme l'arbre Sahel — un seul contour organique).
- `M-194 -340 C-238 -410 -182 -488 -100 -474 C-66 -558 58 -562 102 -480 C184 -502 250 -426 204 -350 C238 -292 150 -232 70 -262 C18 -212 -92 -222 -126 -282 C-188 -268 -238 -302 -194 -340 Z`
- Plus 3 paths de nervures internes (texture feuillage).

### Cabosses sur tronc (`id="cabosses-tronc"`, signature du cacaoyer)
4 ellipses de tailles dégressives, dans la couronne (pas au sol) :
- `[cx=4, cy=-128, rx=23, ry=42]`, `[cx=-46, cy=-206, rx=19, ry=37]`, `[cx=50, cy=-182, rx=18, ry=35]`, `[cx=-14, cy=-238, rx=15, ry=29]`
- Plus des côtes striées par cabosse (texture, path composé).

## Palette de couleurs selon `alive`

| État | Tronc (barkFill) | Couronne (leafFill) | Cabosses (podFill) | Trait |
|------|------------------|----------------------|---------------------|-------|
| `alive=0` (encre morte) | `none` (trait seul) | `none` (trait seul, remplissage parchemin `#e8dcc0` à 0.92) | `none` | `#5a4b38` (DEAD), opacity `deadOpacity` (défaut 0.55-0.72 selon appelant) |
| `alive=1` (brun-vie plein) | `#4a2c14` (COCOA_DARK) | `#6b4423` / `#5e7245` / `#8a5a2f` (3 tons `LEAF_TONES`, sélectionnés par `tone`) | `#a26432` (POD) | `#2b2117` (INK), opacity 1 |

`fillOpacity` = `alive` directement (colorisation = buvard progressif, pas un cross-fade binaire).

## Paramètres d'animation réels (props `CacaoTree`)

Tous existent dans le code source — aucun paramètre inventé ici :

| Prop | Rôle | Défaut |
|------|------|--------|
| `alive` (0..1) | Colorisation encre morte → brun-vie plein | requis |
| `deadOpacity` | Densité du trait mort (pour qu'on compte les 14 arbres du champ) | 0.55 |
| `tone` (index) | Sélectionne le ton de feuillage dans `LEAF_TONES` — fait "respirer" le champ (pas 14 bruns identiques) | 0 |
| `grow` (0..1) | Croissance : tronc pousse d'abord (0→0.5, scaleY depuis le sol), couronne éclot ensuite (0.4→1, scale avec overshoot cubique) | 1 |
| `breath` (≈1 ±0.025) | Micro-respiration de la couronne (appliquée en `scale` sur le groupe couronne) | 1 |
| `podWf` (frame/phase) | Phase pour le pulse de maturation des cabosses (sinusoïdal, amplitude ~5%, seulement si `alive > 0.3`) | 0 (figé) |
| `podIdx` (index arbre) | Déphase le pulse des cabosses entre arbres d'un même champ | 0 |

## Composant parent `VergerCacao` (le champ de 14 arbres)

`VergerCacao.tsx` place 14 `CacaoTree` en perspective (positions `TREES: {x,y,s}[]`), pilote 3 états narratifs via props (`greenProgress[]`, `appearProgress[]`, `crackProgress`) : `mort` (B3, 2/14 vivants = "un septième"), `reverdit` (B4A, cascade de colorisation), `fissure` (B4B, veine d'encre qui fend le sol). Contient aussi : soleil animé (lever + glow + rayons + nuages + oiseaux), sol en perspective avec sillons, racines qui s'éveillent (`rootLife`), chapeau + cabosses ouvertes au sol (artefact humain).

Le champ applique en plus un balancement au vent permanent par arbre (`swayPermanent`, sinusoïdal déphasé par index) et un sur-balancement des arbres vivants (`livelySway`, proportionnel à `alive` — un arbre colorisé "vit plus" qu'un mort, distinction par le mouvement pas seulement la couleur).

## Fichier source réel (ne pas dupliquer le code TypeScript)

`src/projects/souverain/cacao-chocolat-short/components/VergerCacao.tsx` — exporte `CacaoTree` (1 arbre paramétrique) et `VergerCacao` (champ de 14 + décor complet). Toute réutilisation doit importer depuis ce fichier, pas recopier le JSX.

## Placement dans la scène source (14 arbres, `TREES` dans `VergerCacao.tsx`)

Perspective 3/4 plongeante, avant-plan non dominant, échelle 0.30 (fond) à 0.88 (premier plan). Les 2 arbres "vivants" en B3 (`VIVANTS_B3 = [13, 7]`) = 1 grand premier-plan + 1 milieu, pour que "2/14" saute aux yeux visuellement.
