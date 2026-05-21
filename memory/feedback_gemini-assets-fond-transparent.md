---
name: Gemini assets sans fond transparent — 2 solutions selon contexte
description: Gemini ne peut pas générer de vrai transparent. Solution A (fond crème solide) pour cercles clairs. Solution B (fond noir + mix-blend-mode screen) pour fond sombre. Ne jamais tenter alpha_composite ou chroma key manuel.
type: feedback
---

# Gemini assets — gestion du fond transparent

**Validé** :
- Solution A : Niger Uranium Beat 3 v4, 2026-05-10 (icônes sur cercles crème)
- Solution B : Zimbabwe Lithium Beat 2 v5, 2026-05-10 (roches + batterie sur fond navy)

## Le problème fondamental

Gemini ne peut pas générer de PNG avec canal alpha transparent natif. Quelle que soit la formulation du prompt ("transparent background", "isolated on transparent"), Gemini produit soit :
- Un fond gris clair (#cecece) — damier visible
- Un fond noir (#000000) — fond plein

Les solutions tentées qui NE MARCHENT PAS :
- ❌ `PIL alpha_composite` : si l'image source n'a pas d'alpha, rien à composer
- ❌ Chroma key / seuil de luminosité : coupe dans le sujet (bords frangés, artefacts)
- ❌ CSS `mask-image` : les chemins `staticFile()` Remotion ne fonctionnent pas comme masks

---

## Solution A — Fond crème solide imposé

**Quand utiliser** : l'asset sera placé sur un cercle ou fond crème (#d4c29d ou similaire).

**Prompt** :
```
[SUJET] as a flat editorial silhouette pictogram on a UNIFORM solid CREAM #d4c29d color background filling the ENTIRE square frame edge to edge. The cream background must be flat solid #d4c29d color WITHOUT any transparency, WITHOUT any checkered pattern, WITHOUT any gradients.
```

**Vérification** : `Image.open(path).getpixel((0,0))` doit retourner ~(216, 193, 149). Si (206,206,206) = damier gris → régénérer.

**Exemple** : `icon-etat-niger-cream.png` (capitole or sur cercle crème dossier Niger).

---

## Solution B — Fond noir + mix-blend-mode screen

**Quand utiliser** : l'asset sera placé sur un fond sombre (navy, noir, charcoal).

**Comment** : générer l'asset sur fond noir pur `#000000`. En CSS/Remotion, appliquer `mixBlendMode: "screen"` sur le div wrapper. Sur fond noir = transparent. Sur fond sombre = l'asset brille naturellement.

**Prompt** :
```
[SUJET], PURE BLACK BACKGROUND #000000 — the background must be completely black with zero gray. High contrast render.
```

**Vérification** : `pixel(0,0)` doit retourner `(0,0,0)` ou `(1,1,1)`.

**Code React/Remotion** :
```tsx
<div style={{
  mixBlendMode: "screen",
  filter: "drop-shadow(0 0 20px rgba(192,136,32,0.4))", // optionnel pour glow
}}>
  <Img src={staticFile("path/to/asset_screen.png")} style={{ width, height, objectFit: "contain" }} />
</div>
```

**Exemple** : `raw_lithium_screen.png` + `battery_screen.png` sur fond navy Zimbabwe.

**Avantages** :
- Zéro découpage, zéro artefact sur les bords
- Le glow CSS `drop-shadow` complète parfaitement la luminosité naturelle de l'asset
- Fonctionne avec des assets photo-réalistes complexes (roches, batterie) que le chroma key raterait

**Limitation** : ne fonctionne pas sur fond clair (screen sur blanc = blanc, asset invisible).

---

## Règle de choix

| Fond de destination | Solution |
|---------------------|----------|
| Fond crème / clair (#d4c29d, #ede5d3) | **A — fond crème solide** |
| Fond sombre / navy / noir (#0d1525, #080d14) | **B — fond noir + screen** |
| Fond mixte | Tester B d'abord (plus polyvalent) |

**Why:** Plusieurs heures perdues sur Niger + Zimbabwe à tenter chroma key et alpha composite. Les deux solutions documentées ici fonctionnent à 100% en 1 essai chacune.

**How to apply:** Avant de générer un asset Gemini, décider d'abord du fond de destination → choisir la solution → inclure la contrainte dans le prompt dès le premier appel.
