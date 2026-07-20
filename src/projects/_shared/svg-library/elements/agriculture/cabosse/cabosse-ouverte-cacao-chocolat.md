# Cabosse ouverte (CabosseOuverture)

**Issu de** : `CabosseOuverture.tsx` (cacao-chocolat-short) — transition B2→B3 (territoire → matière cacao)
**Registre** : encre narrative (fond `#e8dcc0` parchemin, encre `#2b2117`)
**ViewBox source** : composant parent 1080×1920, centre à `CX=540, CY=900` (recentré sur 0,0 dans le SVG documenté ici)

## Parties

### Demi-cabosse (forme ovale côtelée, dessinée en miroir ×2)
- `halfPath` : `M0 -150 C70 -150 110 -70 110 0 C110 70 70 150 0 150 Z`
- `ribs` (nervures/côtes internes) : `M0 -130 L0 130 M40 -120 C58 -60 58 60 40 120 M78 -90 C92 -45 92 45 78 90`
- Moitié gauche = `scale(-1 1)` de la moitié droite (vraie symétrie miroir, pas 2 géométries distinctes)
- Écartement horizontal des 2 moitiés (`gap`) = geste d'ouverture — objet INERTE, ne glisse jamais latéralement, s'écarte seulement sur place

### Fèves révélées (`id="feves"`)
5 ellipses `rx=18 ry=28`, positions et rotations fixes (pas aléatoires — valeurs codées en dur) :
`[0,-40,-12°]`, `[-28,10,8°]`, `[26,18,-6°]`, `[-6,64,14°]`, `[30,-22,4°]`

## Palette

| Élément | Couleur | Rôle |
|---|---|---|
| Corps cabosse | `#a26432` (POD) | fill principal, colorisation progressive (`colorOp`) |
| Côtes/nervures | `#7a3f1f` (POD_DARK) | détail texture, suit `colorOp` |
| Fèves | `#6b3e22` (BEAN) | révélées à l'ouverture |
| Trait | `#2b2117` (INK) | contour, largeur 5 (cabosse) / 2.5 (fèves) |

## Paramètres d'animation réels (prop unique `CabosseOuverture`)

Un seul prop, `progress` (0..1), pilote 5 phases séquentielles (aucun autre paramètre n'existe dans le code) :

| Plage `progress` | Effet |
|---|---|
| 0 → 0.4 | `draw` : le contour se trace (`strokeDashoffset`, longueur dash 1200) |
| 0.2 → 0.45 | `colorOp` : colorisation brun-vie (fill s'installe) |
| 0.45 → 0.75 | `open` : écartement horizontal des 2 moitiés (`gap = open * 70`) |
| 0.55 → 0.78 | `beansOp` : les 5 fèves apparaissent au centre |
| 0.78 → 1 | `fade` : disparition globale (opacité du groupe entier) |

## Fichier source réel (ne pas dupliquer le code TypeScript)

`src/projects/souverain/cacao-chocolat-short/components/CabosseOuverture.tsx` — exporte `CabosseOuverture({ progress })`. Toute réutilisation doit importer depuis ce fichier.

## Note doctrine (objet inerte)

Conforme à la règle "un objet inerte ne glisse jamais" (mémoire projet) : la cabosse ne se déplace pas dans le cadre, elle se trace, se colorise, s'ouvre sur place puis fade. Aucun `translateX`/`translateY` animé sur l'objet entier.
