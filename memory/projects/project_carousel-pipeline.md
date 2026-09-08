---
name: carousel-pipeline
description: Pipeline validé pour générer les carousels Instagram Kora & Cartes via Gemini Flash Image
metadata: 
  node_type: memory
  type: project
  originSessionId: 0534844a-967f-4178-b547-eccd5c13c151
---

# Pipeline Carousel Kora & Cartes — Validé 2026-05-31

**Fait :** Pipeline complet validé sur carousel Or Africain (8 slides). Gemini Flash Image > Remotion/Tailwind pour les carousels Instagram statiques.

**Why :** Gemini génère des compositions visuelles premium (typographie, visuels contextuels, layout) que Remotion ne peut pas égaler pour des images statiques. Remotion reste supérieur pour la vidéo animée.

**How to apply :** Utiliser ce pipeline pour tous les carousels Kora & Cartes. Ne pas retenter Remotion pour les slides statiques Instagram.

---

## Pipeline en 5 étapes

```
1. Extraire frames clés de la vidéo source
   ffmpeg -ss <t> -i out/PRET-PUBLICATION/<video>.mp4 -vframes 1 -q:v 2 /tmp/refs/frame-<t>s.jpg
   → 5-6 frames à des moments narratifs clés

2. Préparer brief par slide (8 slides par carousel)
   → Type : hook / stat / fact / conclusion / engagement
   → Texte exact + visuel suggéré + frame de référence si géo

3. Appel Gemini Flash Image par slide
   → Modèle : **IMAGE_MODEL_HQ** (`gemini-3.1-flash-image`) — un carousel est PUBLIE TEL QUEL et le Lite plafonne a 1K.
     ⛔ importer depuis `scripts/tools/gemini_models.py`, jamais en dur
   → Frame géo = image de référence injectée (jamais générée librement)
   → ~0,067 $ par slide, **~0,54 $ par carousel** (8 slides)

4. Contact sheet (PIL) pour validation Aziz
   → 4×2 grid, 270×480px par thumb, fond #16213a, GAP 12px

5. Upload Postiz après validation
   → Instagram + Facebook uniquement (pas YouTube, pas TikTok pour les carousels)
```

## Structure HEADER fixe (toutes slides)
- Logo "K&C" centré en gold (#c8a951)
- 8 barres de progression gold (active = pleine, autres = 25% opacité)
- PAS de texte "SLIDE X/8"
- Footer : "@koraetcartes" centré en gold

## Palette obligatoire
- Fond : `#16213a`
- Gold : `#c8a951`
- Ivoire : `#F5E6C8`
- Typographie titres : serif bold
- Typographie corps : sans-serif

## Règle géographie (NON-NEGOTIABLE)
- Jamais demander à Gemini de dessiner une carte — il hallucine les frontières
- Toujours injecter une frame Mapbox extraite de nos vidéos comme référence
- Gemini intègre la carte sans la modifier

## Slide 8 — CTA sans lien externe
- Instagram pénalise le reach des posts qui pointent vers des liens externes
- Remplacer "Voir sur YouTube" par une incitation à la sauvegarde
- Formule validée : "Sauvegarde ce carousel / Pour y revenir quand on te parle de [sujet]"

## Statut par carousel

| Carousel | Statut | Contact sheet |
|---|---|---|
| Or Africain | ✅ VALIDÉ | https://files.catbox.moe/8c7r5r.png |
| Vraie Taille Afrique | pending | — |
| Thiaroye | pending | — |
| Niger Uranium | pending | — |
| Mansa Moussa | pending | — |
| Empire Ghana | pending | — |
| Soundjata | pending | — |
| Silicon Savannah | pending | — |
| Sénégal Pétrole | pending | — |

## Règles supplémentaires validées (Mansa Moussa — 2026-05-31)

**Langue :** Ajouter systématiquement "Tout le texte en français uniquement. Zéro mot anglais autorisé." dans chaque brief — Gemini peut générer de l'anglais sans cette instruction.

**Slides comparatives (type Rockefeller/Mansa Moussa) :** Toujours structurer la comparaison de façon explicite :
1. Référence connue + chiffre
2. Label qui explique ("La fortune la plus connue de l'histoire")
3. Ligne séparatrice
4. La révélation ("Mansa Moussa la dépassait. De loin.")
Sans cette structure, la slide est ambiguë — le lecteur ne sait pas ce que représente le chiffre.

**Graphiques avec textes structurels (type barres comparatives) :** Option B (génération libre) > Option A (overlay). L'overlay ne masque pas suffisamment les textes intégrés dans la structure du graphique.

**CTA universelle (slide 8 de tous les carousels) :**
"La vidéo complète est sur notre compte. / Cherche @koraetcartes"
— Pas de lien externe (pénalité algorithmique Instagram). Pointer vers le compte, pas vers YouTube.

## Statut mis à jour (2026-05-31)

| Carousel | Format | Statut | Contact sheet |
|---|---|---|---|
| Or Africain | Hybride Seedance | ✅ VALIDÉ PRET-PUBLICATION | https://files.catbox.moe/8c7r5r.png |
| Thiaroye | Hybride Seedance | ✅ VALIDÉ PRET-PUBLICATION | https://files.catbox.moe/7lyreb.jpg (9 slides) |
| Mansa Moussa | Atlas Carte de Jeu | 🔄 FORMAT VALIDÉ, carrousel complet à refaire | bar chart: https://files.catbox.moe/g1yyec.mp4 |
| Niger Uranium | — | ❌ ABANDONNÉ | — |
| Vraie Taille Afrique | pending | ⏳ À faire | — |
| Empire Ghana | pending | ⏳ À faire | — |
| Soundjata | pending | ⏳ À faire | — |
| Silicon Savannah | pending | ⏳ À faire | — |
| Sénégal Pétrole | pending | ⏳ À faire | — |

## Deux formats selon le type de vidéo

| Type vidéo | Format carrousel | Composant |
|---|---|---|
| Seedance (BD cinématographique, fonds neutres) | Hybride : clip fond + overlay texte | `CarouselSlideHybrid` |
| Atlas (Remotion/D3, cartes pixel art + data-viz) | Carte de Jeu : clip encadré + texte bas navy | `AtlasFormat2CarteDeJeu` |

Détails format Atlas : `feedback_carousel-atlas-format.md`
