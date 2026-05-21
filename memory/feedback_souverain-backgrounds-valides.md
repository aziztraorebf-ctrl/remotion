---
name: Backgrounds Souverain — règle fond + lisibilité mobile
description: PIVOT 2026-05-13 — abandon du style 100% dark. Les fonds sombres (#060a10) sont interdits pour les templates data-viz. Nouveau standard : dark navy lisible (#0d1420) ou fond clair selon le template.
type: feedback
---

# Backgrounds Souverain — règle definitive

**PIVOT MAJEUR 2026-05-13** : Le style 100% dark (#060a10) est ABANDONNÉ pour les templates data-viz et layouts Souverain.

**Raison Aziz** : "Il faut abandonner le style 100% dark, ça ne marche pas. Ce n'est pas très bon pour un téléphone mobile pour la visibilité. Et ça nous limite beaucoup."

## Nouvelle règle backgrounds

| Type | Fond | Dots/Texture | Usage |
|------|------|-------------|-------|
| **Dark navy lisible** | `#0d1420` min | Dots gold 35-45% opacité, dense (32px) | Default data-viz |
| **Label clair sur fond dark** | `#0d1420` fond + bloc `#f5efe0` pour labels | Labels pays/entités en bloc crème arrondi | BarRace, comparatifs |
| **Paper/kraft texture** | PNG kraft clair | — | Dossiers, documents |
| **Geometric ornament** | `#0d1420` + SVG | Motifs dans coins | Climax, statements |

## Interdits STRICTS

- ❌ `#060a10` ou plus sombre — trop proche du noir pur, illisible mobile
- ❌ Backgrounds sans structure visible (monochrome pur)
- ❌ Photos de fumée, feu, brouillard, nuages
- ❌ Textures organiques photographiques
- ❌ Vignette trop agressive (assombrit les bords au point de couper le contenu)

## Code dots NOUVEAU standard (plus lumineux)

**Lisibilité mobile obligatoire :**
- Fond minimum `#0d1420` — jamais `#060a10` (trop noir)
- Dots à minimum **35-45% d'opacité** — les dots doivent être **clairement visibles**
- Sur mobile en plein soleil : le fond doit être reconnaissable comme "navy structuré", pas "noir"

```tsx
{/* Fond de base — #141c2e minimum, jamais noir pur */}
<AbsoluteFill style={{ background: "#141c2e" }}>

  {/* Dots grid — 30% opacité minimum pour lisibilité mobile */}
  <div style={{
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(circle at 1px 1px, rgba(96,128,192,0.30) 1.5px, transparent 2px)",
    backgroundSize: "32px 32px",
    transform: `translate(${grainShiftX}px, ${grainShiftY}px)`,
  }} />

  {/* Spotlight central optionnel — profondeur sans assombrir */}
  <div style={{
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(30,50,90,0.5) 0%, transparent 100%)",
    pointerEvents: "none",
  }} />
```

`grainShiftX = Math.sin(frame * 0.025) * 4` — drift subtil permanent.

## Règle lisibilité mobile

**Problème :** sur téléphone en plein soleil, tout ce qui est sous `#1a2540` tend vers le noir. Les viewers de Shorts regardent principalement sur mobile.

**Règle :** tester mentalement "est-ce que ce fond sera lisible en plein soleil ?" — si le fond de base est plus sombre que `#141c2e`, l'éclaircir. Si les dots/patterns sont à moins de 25% d'opacité, les monter à 30%.

## INTERDIT comme background

- ❌ Photos de fumée, feu, brouillard, vapeur, nuages
- ❌ Textures organiques (bois, pierre, béton) sauf kraft/papier
- ❌ Tout fond "cinématique" photographique généré par Gemini avec "smoky", "atmospheric", "cinematic"
- ❌ Dégradés CSS purs sans structure (trop plat)

## Pourquoi

Les fonds photo organiques :
1. Semblent des "stock photos" — pas premium
2. Ne matchent pas la signature des 4 épisodes validés (Or Africain, Niger, Ghana, Sonjata)
3. Bougent bizarrement si on tente de les animer
4. Distraient de l'information (trop de texture visuelle concurrente)

Les dots/grille/géométrique :
1. Structurent l'écran sans dominer
2. Permettent le permanent motion (shift XY discret)
3. Cohérents avec l'esthétique documentaire technique
4. Identiques à ce qu'utilisent PolyMatter, Vox, Le Monde Cartographique

## Dans le prompt d'amélioration (improve_storyboard.py)

Ajouter à la section CONSTRAINTS du prompt :
```
BACKGROUND RULE: only these 3 types are valid:
1. CSS dots grid on dark navy (#080d14) — preferred for data-viz beats
2. Aged paper/kraft texture PNG — for document/dossier beats  
3. SVG geometric ornament code — for climax/statement beats
NEVER generate: smoky, atmospheric, photographic, organic texture backgrounds.
```

**Why:** Beat 4 Zimbabwe avait un fond fumée photo généré par Gemini suite au prompt "cinematic, smoky atmosphere". Le résultat ressemblait à une stock photo, pas à Souverain. Correction immédiate → dots navy CSS.

**How to apply:** Avant tout `improve_storyboard.py` ou génération de background, vérifier que le prompt ne contient pas "smoky", "cinematic texture", "atmospheric", "clouds", "fire", "fog". Si oui → remplacer par une des 3 options valides.
