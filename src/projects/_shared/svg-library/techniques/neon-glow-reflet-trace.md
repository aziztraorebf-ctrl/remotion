# Glow multi-couches, reflet au sol, pointe lumineuse de tracé

**Contexte** : donner à une forme SVG la sensation de LUMIÈRE PHYSIQUE (tube au néon, objet incandescent,
titre qui irradie) et l'ancrer dans un LIEU (reflet sur sol mouillé). Trois finitions indépendantes,
combinables, 100% SVG.
**Coût visuel** : léger (filtres `blur` CSS) — pas de WebGL, pas d'API, rendu headless OK
**Compatibilité** : Remotion frame-driven pur
**Briques** : `elements/effects/NeonSign.tsx` → `GlowStroke`, `DrawnPath`, `flicker()`, `GroundReflection`

> **Origine (2026-07-25)** : démo virale « Opus 5 launch ad », annoncée *pure HTML canvas*. Analyse frame
> par frame avec Aziz → c'était du SVG (pointe lumineuse au bout du tracé = `strokeDashoffset`). L'écart
> avec nos scènes ne venait PAS du substrat mais de ces 3 finitions. Banc d'essai reproduit à niveau :
> `_rnd/neon-test/NeonSignTest16x9.tsx`.

---

## 1. Glow multi-couches — la finition qui change tout

**Le principe** : un néon n'est pas un trait coloré, c'est un TUBE. Un seul `drop-shadow` donne « joli trait
orange ». Quatre passes superposées donnent « tube allumé ». C'est l'EMPILEMENT qui crée la lumière.

```tsx
// 4 passes sur le MÊME path, de la plus large/diffuse à la plus fine/chaude
<path d={d} stroke={color} strokeWidth={w * 3.4} opacity={0.10} style={{ filter: `blur(${w * 1.7}px)` }} />
<path d={d} stroke={color} strokeWidth={w * 1.9} opacity={0.34} style={{ filter: `blur(${w * 0.6}px)` }} />
<path d={d} stroke={color} strokeWidth={w}       opacity={0.95} />
<path d={d} stroke="#fff"  strokeWidth={w * 0.34} opacity={0.85} />  {/* LE COEUR — le détail décisif */}
```

| Couche | Rôle | Sans elle |
|---|---|---|
| diffusion (×3.4, blur fort, 10%) | « salit » l'air autour du tube | la lumière ne déborde pas, tout reste plat |
| halo proche (×1.9) | transition douce | passage brutal entre tube et fond |
| corps (×1) | la couleur franche | — |
| **cœur blanc (×0.34)** | le gaz incandescent au centre | **le trait reste « peint », jamais « allumé »** |

**Le même empilement s'applique au TEXTE** (4 `<text>` superposés, mêmes ratios) — c'est ce qui fait un titre
au néon lisible et chaud.

## 2. Pointe lumineuse de tracé — « on écrit » vs « ça apparaît »

Notre `strokeDashoffset-drawing.md` révèle un trait. Ce qui manquait : la petite lumière qui COURT au bout.

```tsx
const ref = React.useRef<SVGPathElement>(null);
const [len, setLen] = React.useState(0);
React.useEffect(() => { if (ref.current) setLen(ref.current.getTotalLength()); }, [d]);
const pt = ref.current?.getPointAtLength(len * progress);   // position exacte de la pointe
// puis : un cercle blanc + un halo flou à (pt.x, pt.y)
```

- Mesurer avec `getTotalLength()` (jamais l'heuristique « nb commandes × 14 » — cf
  `feedback_svg-path-length-heuristique-jamais-fiable`).
- Repli sans pointe si la mesure échoue : le tracé reste correct dans tous les cas.
- **Plusieurs tracés simultanés = plusieurs pointes** — c'est ce qui rend un tracé multi-branches vivant.

## 3. Reflet au sol — l'ancrage dans un lieu

Copie miroir + flou + masque dégradé. Transforme un fond noir en SOL MOUILLÉ.

```tsx
<mask id="m"><rect y={groundY} height={H - groundY} fill="url(#grad-qui-s-eteint-vers-le-bas)" /></mask>
<g mask="url(#m)" opacity={0.58} style={{ filter: "blur(2.2px)" }}>
  <g transform={`translate(0 ${2 * groundY}) scale(1 -0.92)`}>{contenu}</g>  {/* -0.92 : sol ≠ miroir parfait */}
</g>
```

⚠️ **Calibrage (erreur commise puis corrigée)** : `opacity 0.30 / blur 4` → reflet invisible. La bonne
valeur est **`opacity ≈ 0.55-0.60 / blur ≈ 2`** : le reflet doit rester LISIBLE (on doit pouvoir lire le
texte à l'envers). Un reflet qu'on devine à peine ne sert à rien.

## 4. Grésillement d'allumage (`flicker`)

Un néon accroche, rate, puis tient. LCG seedé — **jamais `Math.random()`** (chaque frame du render headless
serait différente). Les ratés se raréfient à mesure qu'on approche de l'intensité stable.

---

## Bonus prouvé la même session : CAMÉRA en SVG (sans rien casser)

Aziz évitait les mouvements de caméra en SVG (« ça sort du cadre »). La cause n'est pas le SVG :

| | |
|---|---|
| ✅ transformer le **contenu** : `<g transform="translate(cx,cy) scale(k) translate(-cx,-cy)">` dans un `viewBox` **fixe** | le cadre rogne proprement, rien ne déborde |
| ❌ animer le **`viewBox`** lui-même | on déplace le cadre dans un monde fini → on trouve le vide |
| ✅ construire la scène **plus large que le cadre final** | il y a toujours de la matière à révéler |
| ⚠️ diviser les épaisseurs par le zoom (`width / camScale`) | sinon les traits grossissent/maigrissent |

Vaut pour TOUT mouvement (zoom, travelling latéral, Pull Back Reveal) — ce n'est pas le type de mouvement
qui contraint, c'est la quantité de monde construit autour du cadre.

## Pièges connus

- **Empiler des `blur` coûte** : au-delà de ~15 tubes glow simultanés, le render ralentit nettement. Mutualiser.
- **`filter` CSS vs `<filter>` SVG** : choisir l'un OU l'autre et tester en headless (cf `glow-pulse-sinusoidal.md`).
- **Le reflet double le coût de rendu** (le contenu est rendu 2×). Ne réfléchir que ce qui est lumineux.
- **Fond sombre obligatoire** : le glow additif n'existe pas sur fond clair.

## Liens

- Voir aussi : `strokeDashoffset-drawing.md` (le tracé de base, que la pointe complète)
- Voir aussi : `glow-pulse-sinusoidal.md` (faire respirer un glow déjà posé)
- Doctrine : `memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md` § « Le SVG porte la FORME, le canvas porte la MATIÈRE »
- Utilisé par : `_rnd/neon-test/NeonSignTest16x9.tsx`
