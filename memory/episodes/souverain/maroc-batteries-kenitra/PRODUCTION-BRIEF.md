---
name: Maroc Batteries — Production Brief complet
description: Camera + Overlays + SFX validés par Aziz. Source de vérité avant tout code getCam().
type: project
---

# Production Brief — Maroc Batteries Short (validé 2026-06-01)

> Validé par Aziz. Ne pas modifier sans nouvelle validation explicite.
> Remplace le Camera Brief seul. Lire AVANT d'écrire getCam() ou ShortOverlays.

---

## Beat 1 — Phosphate (f248→f931, ~20s, MAPBOX)

### Caméra
| Phase | Mouvement | Centre | Zoom | Pitch | Durée | Blur |
|---|---|---|---|---|---|---|
| A f0→f239 | Orbit + Dolly lent | Khouribga [-6.91, 32.88] | 9.5→9.8 | 0°→20° | ~8s | non |
| B f240→f359 | Pull Back Reveal | Khouribga → [-5.0, 38.0] | 9.8→3.5 | 20°→0° | ~4s | non — intra-région |
| C f360→f609 | Drift respiratoire | [-5.0, 38.0] | 3.5→3.7 | 0° | ~8s | non |

### Overlays Mapbox
- Dot pulse gold sur Khouribga (plus large que halo Kénitra — mine = territoire)
- Label `KHOURIBGA` DOM Marker, IBM Plex Mono, style identique KÉNITRA
- Stat `70%` SVG plein écran ivory 180px — fade-in f120 (après settle orbit)
- Ligne dasharray gold animée Khouribga→Kénitra (phosphate brut qui voyage)
- À f360 : ligne dasharray Kénitra→Détroit de Gibraltar (contexte stratégique Europe)

### SFX
| Frame local | Fichier | Volume |
|---|---|---|
| f0 | `sfx-swoosh-zoomin.mp3` | 0.35 |
| f120 | `stat-tick.mp3` | 0.30 |
| f240 | `sfx-swoosh-pullback.mp3` | 0.45 |
| f360 | `sfx-map-ping.mp3` | 0.40 |

---

## Beat 2 — Cailloux (f932→f1299, ~12s, PUR REMOTION)

> Assets Gemini non générés — ARRÊT OBLIGATOIRE avant code. Valider prompts avec Aziz.

### Overlays
- Image split : phosphate brut (haut) / cathode LFP (bas)
- Balance animée spring
- Stat `5,6 Md$` gold en surimpression

### SFX
| Frame local | Fichier | Volume |
|---|---|---|
| f0 | `impact.mp3` | 0.50 |
| f90 | `tension-pulse.mp3` | 0.35 |

---

## Beat 3 — Acteurs Gotion/VW (f1300→f1816, ~16s, MAPBOX)

### Caméra
| Phase | Mouvement | Centre | Zoom | Pitch | Durée | Blur |
|---|---|---|---|---|---|---|
| Stop1 f0→f239 | Zoom Sol 3D | Kénitra [-6.58, 34.26] | 13 | 0°→45° sur 60f | ~8s | non |
| Transition f240→f299 | Whip Pan 60f | — | — | — | 2s | oui 12px max à f270 |
| Stop2 f300→f477 | Drift lent | Wolfsburg [10.78, 52.42] | 8 | 0° | ~6s | non |

> Réserve validée Aziz : pitch progressif 0°→45° sur 60f. Si clipping tuiles au render → fallback pitch 25°, zoom 11. Valider sur animatic avant overlays.

### Overlays Mapbox
- Stop1 Kénitra : label `GIGAFACTORY` + `156 ha` DOM Marker, pop spring f30
- Stop1 : plaque `GOTION` rouge `#de2910` (f60) + plaque `VOLKSWAGEN` bleu `#001e50` (f90), décalé
- Stop2 Wolfsburg : label `WOLFSBURG` + sous-label `2h de bateau` ivory 0.6 opacity
- Arc dasharray rouge Kénitra→Wolfsburg — dessine pendant drift final

### SFX
| Frame local | Fichier | Volume |
|---|---|---|
| f0 | `sfx-swoosh-zoomin.mp3` | 0.40 |
| f60 | `plate-pop.mp3` | 0.55 |
| f90 | `plate-pop.mp3` | 0.55 |
| f240 | `whoosh.mp3` | 0.50 |
| f360 | `node-appear.mp3` | 0.30 |

---

## Beat 4 — Géographie (f1817→f2976, ~37s, PUR REMOTION)

SFX : porter depuis fichier de référence. Volumes doctrine : UI 0.25-0.35, cinématique 0.40-0.55.

---

## Beat 5 — Question finale (f2977→f3284, ~10s, PUR REMOTION)

SFX : `stamp-dossier.mp3` + `slash-red.mp3`. Volumes doctrine.

---

## Ordre de production

1. Beat 1 (Mapbox portage getCam + overlays) — autonome
2. Beat 3 (Mapbox portage getCam + overlays) — autonome
3. Beat 4 (Remotion portage) — autonome
4. Beat 5 (Remotion portage) — autonome
5. **Beat 2 — ARRÊT : valider prompts Gemini avec Aziz**
6. Beat 2 code après assets validés — autonome
7. Render complet Vercel — autonome nuit

## Volumes mix référence (RÉVISÉ 2026-06-03)
- Narration : 1.0 (fade in/out 10f)
- Musique fond : 0.12-0.15 (baisser si elle masque les SFX)
- **SFX : PLANCHER 0.50, JAMAIS en dessous** (ping, tick, snap, plate-pop, impact, whoosh, swoosh). Peut monter à 0.60 sur gros moments (swoosh caméra descend/monte, impact). L'ancienne fourchette 0.25-0.35 était trop basse — Aziz devait monter le son. Voir DOCTRINE-SOUVERAIN.md section 6.
