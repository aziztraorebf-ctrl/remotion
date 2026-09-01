# Previews templates animés — pattern start/mid/end (pas 1 still seul)

> Migré depuis auto-memory 2026-08-31 (feedback Aziz 2026-05-09, Jour 3 templates Souverain).
> Règle de production de previews réutilisable pour toute bibliothèque de templates.

## Règle

Pour un template **animé** (avec apparitions progressives, transitions, pop-in séquentiel) :
- ❌ **PAS 1 seul still** : rate le moment où le template est complet
- ✅ **3 stills calés sur les phases d'animation** :
  - `start.png` — frame 5-10 (premier élément apparu, donne le ton)
  - `mid.png` — milieu (animation finie, contenu complet visible)
  - `end.png` — fin (état final, hold avant transition)

Pour un asset **statique** (drapeau SVG, portrait, texture) :
- ✅ **1 PNG suffit** (aucune animation à capturer)

## Cas spéciaux

### Template avec animation start vide
Ex: un cadre = page vide en frame 5
→ **Skipper le start**, garder mid + end seulement

### Template avec dynamique critique (tampon qui claque, transition complexe)
→ Ajouter **1 GIF court (3-4s) en complément** des stills
→ Règle : ne pas générer GIF systématiquement (poids 200-500 KB) — décision au cas par cas

### Template multi-phases (showcase)
Ex: showcase 3 phases × 120 frames
→ **Mid + end pour chaque phase** (6 stills total au minimum)

## Application Jour 3 templates Souverain (exemple historique)

| Template | Stills générés |
|---|---|
| AtlasRealiste3D | Niger-end + Mali-end (2 phases × 1 still = animation simple) |
| CartoCaspian | end seulement (animation très linéaire) |
| KraftCard Cadre | mid + end |
| KraftCard Fond Narratif | mid + end |
| KraftCard Doc Classifié | mid + end (+ GIF tampon serait pertinent — non fait) |
| SmallMultiples Cream | start + mid + end (anim séquentielle ligne par ligne marquée) |
| SmallMultiples Kraft | mid + end (start identique au Cream) |

## Outils

- Script `scripts/generate_template_previews.py` (⚠️ vérifier existence) : config par template avec `frame: <N>` et `webgl: bool`
- Pour Mapbox WebGL : passer par `npx remotion render --frames=N-M` puis ffmpeg dernière frame (still mode ne charge pas les tuiles à temps)

## Pourquoi cette règle

Le but des previews est **double** :
1. **Pour Aziz** : voir à quoi ressemble le template SANS le re-render
2. **Pour un modèle image-to-image (Gemini)** : avoir une image-de-référence quand on veut générer un storyboard cohérent

Un seul still = mauvaise référence (le modèle reçoit un état incomplet au lieu du template complet).
