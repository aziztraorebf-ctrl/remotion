# RealLifeLore — Résumé scout

URL chaîne : youtube.com/@RealLifeLore
Vidéos analysées : 3
Date scout : 2026-05-08

| # | Titre | URL | Durée | Verdict |
|---|-------|-----|-------|---------|
| 1 | The $8 Billion Wall to Stop a Sahara Desert | https://www.youtube.com/watch?v=yc-AW0t4UL0 | 15:18 | 🟡 |
| 2 | Why Russia Isn't Actually Collapsing | https://www.youtube.com/watch?v=0T7Itt9mqtA | 52:28 | 🟢 |
| 3 | How Maps LIE To You | https://www.youtube.com/watch?v=pySHMxf_Qvk | 16:39 | 🟢 |

## Verdict global chaîne : 🟢

## Signature visuelle (cross-vidéos)
RealLifeLore = **maps satellite désaturées + country fills flat + cartouches noirs labels + animated arrows + push-in lent**, le tout cousu avec beaucoup de stock B-roll et coupes sèches au rythme voix-off. La signature pure n'est pas dans CHAQUE plan mais émerge sur ~30% du runtime (les "money shots" cartographiques). Le reste est du remplissage stock — pas leur spécificité, mais leur économie de production.

Sous-catégorie distincte (vidéo 3) : exploration de paradigmes cartographiques alternatifs (antique maps Ken Burns, satellite + glowing data points, choropleth pastel). Mine d'or pour différencier les épisodes Souverain.

## Différenciation vs Or Africain V5
Or Africain = **noir + or + ledger financier + sérigraphie**, tonalité "comptable du capital".
RealLifeLore = **satellite désaturé + cartouches noirs + flat country fills colorés**, tonalité "expert géopolitique news-style".

Différencié ⬛ fortement — ce sont deux visual languages qui ne se chevauchent quasiment pas. Or Africain est plus stylisé/éditorial, RealLifeLore est plus analytique/news. Co-existence claire dans une rotation de templates.

## Synthèse 3 axes (collecté pour tests post-scout)

### Axe 1 — Palette
- Verdict consolidé : 🟢
- Top idée à mettre en backlog : **palette "satellite désaturé + cartouche noir + accents narratifs (rouge/jaune/vert/cyan)"** → directement applicable à un template "Souverain Géopolitique" pour épisodes type Sahel/blocus/conflits. Différent du ledger Or Africain (palette finance) → on aurait 2 templates clairement séparés.

### Axe 2 — Assets / figures
- Verdict consolidé : 🟢
- Top idée à mettre en backlog : **module "Portrait Pin + Nameplate + Stat Grid"** (frame-030 vidéo 2) — portrait circulaire avec drapeau + cartouche nom + grille pictogrammes humains + footer stat. Module dataviz character-driven extrêmement fort, parfait pour un épisode "Profil de dirigeant africain controversé" ou "Acteur économique clé". À designer comme composant Remotion réutilisable.

### Axe 3 — Mouvements caméra
- Verdict consolidé : 🟢
- Top idée à mettre en backlog : **apparition séquentielle de cartouches labels en cascade** (0.4s décalés, fade + scale spring) sur push-in lent satellite map. Donne sensation "didactique premium" + permet de respecter les lectures à 1080×1920. Existe déjà partiellement chez nous (Or Africain Beat 3b labels fade-out séquentiel) — ici ce serait l'inverse en fade-IN cascade.

## Top 3 observations à mettre en backlog (priorité décroissante)

1. **🟢 Module "Portrait Pin + Stat Grid"** (vidéo 2 frame-030) — Composant Remotion dataviz character-driven : portrait + drapeau + nameplate + grille pictogrammes humains + stat footer. Très différenciant vs Or Africain. Reproduction estimée 2-3h dev.

2. **🟢 Style "Satellite Désaturé + Cartouches Noirs + Country Fill Coloré"** (vidéo 2) — Template Mapbox custom : raster satellite-v9 avec saturation/brightness baissées + fill layer GeoJSON + labels HTML/Remotion par-dessus (pas symbol layer Mapbox). Pattern signature RealLifeLore reproductible. Idéal pour épisode Souverain "carte géopolitique" type Mali/Sahel/Niger.

3. **🟡 Ken Burns sur antique maps historiques** (vidéo 3 frame-034) — Pour épisodes "patrimoine pré-colonial" (Songhaï, Tombouctou, Bénin). Sources publiques disponibles (David Rumsey, BNF Gallica). Très atmosphérique, contraste fort vs templates modernes. Reproduction triviale (Img + Ken Burns).

## Observations bonus (non prioritaires mais notées)
- **Animated red arrow + "no entry" icon** (vidéo 2 frame-010) : pattern "blocage symbolique" puissant pour blocus économiques. SVG path stroke-dashoffset.
- **Satellite + glowing data points** (vidéo 3 frame-010) : pattern "événement répandu géographiquement" (feux, conflits, mines). Mapbox circle layer + blur.
- **Newspaper clipping intercalé brut** (vidéo 2 frame-018) : "preuve documentaire" sans frame design. Gain en authenticité, perte en cohérence visuelle — à manier prudemment.
- **Line chart fond noir + event tags colorés** (vidéo 2 frame-040) : pattern dataviz temporelle. Souverain a besoin d'un équivalent pour épisodes "évolution prix matière première / dette / réserves".

## Recommandation
Pour la dissection (Jour 2) : ⬛ retenir
Pourquoi : RealLifeLore offre 2 templates clairement utilisables (Géopolitique satellite-désaturé + Patrimoine antique) + 1 module dataviz character (Portrait Pin Stat Grid) directement intégrables. La signature visuelle est techniquement modeste (pas de wow-effects), donc reproductible sans R&D lourde. Excellent rapport coût/différenciation pour la rotation de templates Souverain.
