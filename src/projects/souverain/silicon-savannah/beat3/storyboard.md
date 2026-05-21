# Beat 3 — Storyboard v2
> Généré par Gemini — Phase 1 v2 (assets visuels forts)
> Date : 2026-05-14
> Appel 1 : gemini-3.1-flash-image-preview (images storyboard avec refs Beat 2)
> Appel 2 : gemini-3.1-pro-preview (JSON structuré)
> Images : /tmp/beat3_storyboard_v2/

## Tableau R1 final

| Segment | Frames | Durée | R1 OK | Asset visuel | Changement |
|---------|--------|-------|-------|--------------|------------|
| intro | 0→37 | 1.2s | OK | Pages calendrier déchirées + "2025" | Apparition tear animation + titre |
| kenyans | 37→247 | 7.0s | OK | 10 silhouettes humaines (9 or / 1 gris) | BigStat "9/10" + silhouettes staggered |
| points | 247→440 | 6.4s | OK | Vue isométrique quartier M-Pesa | Pan sur illustration + texte "300 000" |
| familles | 440→638 | 6.6s | OK | Deux mains + carte Afrique réseau | Mains slide in + nodes pulse |
| fin | 638→705 | 2.2s | OK | Flamme bougie isolée | Fade in flamme + texte solennel |

## JSON de production

```json
{
  "beat": "beat3",
  "duration_s": 24.5,
  "duration_frames": 735,
  "r1_segments": [
    {
      "id": "intro",
      "start_frame": 0,
      "end_frame": 37,
      "duration_s": 1.23,
      "r1_ok": true,
      "change": "Apparition pages calendrier déchirées révélant 2025 + sous-titre.",
      "layout": "Centré vertical. '2025' en haut, 'DIX-HUIT ANS PLUS TARD.' en dessous, encadré par bords de papier déchiré.",
      "elements": [
        "Illustration papier déchiré (calendar_tearing.png)",
        "Texte: 2025 — Cinzel gold #FFB800",
        "Texte: DIX-HUIT ANS PLUS TARD. — Cinzel gold"
      ],
      "assets": ["calendar_tearing.png — pages calendrier déchirées"],
      "animation": "spring scale 0.8→1, fadeIn texte, mask expansion papier déchiré"
    },
    {
      "id": "kenyans",
      "start_frame": 37,
      "end_frame": 247,
      "duration_s": 7.0,
      "r1_ok": true,
      "change": "Cut vers 10 silhouettes humaines sous stat '9/10'.",
      "layout": "Stack vertical: '9/10' en haut, rangée 10 silhouettes au centre (9 or, 1 gris), sous-titre en bas. Carte monde faint en background.",
      "elements": [
        "Texte: 9/10 — IBM Plex Mono bold gold #FFB800",
        "silhouettes_row.png — 10 figures humaines",
        "Texte: KENYANS UTILISENT M-PESA — Cinzel ivory"
      ],
      "assets": [
        "bg_map.png — carte monde sombre très subtile en background",
        "silhouettes_row.png — rangée 10 silhouettes (9 or / 1 gris)"
      ],
      "animation": "Staggered fadeIn silhouettes gauche→droite, spring scale sur '9/10'"
    },
    {
      "id": "points",
      "start_frame": 247,
      "end_frame": 440,
      "duration_s": 6.43,
      "r1_ok": true,
      "change": "Transition vers vue isométrique quartier M-Pesa + overlay texte.",
      "layout": "Moitié haute: texte '300 000 POINTS DE DÉPÔT'. Moitié basse: illustration isométrique lignes or sur navy.",
      "elements": [
        "Texte: 300 000 — Cinzel bold gold",
        "Texte: POINTS DE DÉPÔT — Cinzel gold",
        "Texte: kiosques · épiceries · pharmacies — mono ivory",
        "isometric_city.png — illustration isométrique kiosques M-Pesa"
      ],
      "assets": ["isometric_city.png — vue isométrique lignes or: rues, kiosques, bâtiments sur navy"],
      "animation": "Pan lent vers le haut sur illustration isométrique, texte fadeIn avec translation légère"
    },
    {
      "id": "familles",
      "start_frame": 440,
      "end_frame": 638,
      "duration_s": 6.6,
      "r1_ok": true,
      "change": "Transition vers deux mains qui se rejoignent sur carte Afrique réseau.",
      "layout": "Haut: '50 000 000' et '54 PAYS'. Centre: deux mains touchant les index. Background: contour Afrique avec noeuds lumineux.",
      "elements": [
        "Texte: 50 000 000 — IBM Plex Mono gold",
        "Texte: 54 PAYS — Cinzel ivory",
        "hands_network.png — deux mains + carte Afrique noeuds"
      ],
      "assets": ["hands_network.png — deux mains se rejoignant sur carte Afrique avec noeuds dorés"],
      "animation": "Mains slide in gauche et droite, noeuds réseau pulse opacity"
    },
    {
      "id": "fin",
      "start_frame": 638,
      "end_frame": 705,
      "duration_s": 2.23,
      "r1_ok": true,
      "change": "Fade vers scène minimaliste — flamme bougie + texte solennel.",
      "layout": "Centré. Petite flamme en haut avec halo radial. Texte en dessous.",
      "elements": [
        "candle_flame.png — flamme bougie isolée avec halo or",
        "Texte: C'ÉTAIT UNE RÉVOLUTION RÉELLE. — Cinzel italic gold"
      ],
      "assets": ["candle_flame.png — flamme bougie isolée, halo chaud"],
      "animation": "fadeIn, flickering effect flamme (opacity + scale oscillation subtile)"
    }
  ],
  "assets_to_generate": [
    {
      "type": "background",
      "filename": "bg.png",
      "decision": "REGENERER — texture papier vieilli discret, aucune forme",
      "prompt": "Close-up photograph of aged dark navy paper with very subtle grain texture, 1080x1920 pixels, dark background #0d1420, minimal light vignette at center, no text, no graphics, no shapes, photographic texture only. Barely visible — exists only to add depth."
    },
    {
      "type": "illustration",
      "filename": "calendar_tearing.png",
      "decision": "Gemini-image OBLIGATOIRE — illustration reconnaissable",
      "prompt": "Illustration of a thick paper calendar with top pages violently torn open revealing the center, realistic paper textures, dark navy and gold color palette, dramatic lighting, isolated on dark background, portrait 9:16"
    },
    {
      "type": "illustration",
      "filename": "silhouettes_row.png",
      "decision": "Gemini-image OBLIGATOIRE — figures humaines",
      "prompt": "Horizontal row of exactly 10 simple flat vector human silhouettes. First 9 in golden yellow #FFB800, last 1 in dark grey. Dark navy background #0d1420, clean infographic style, no text, centered, transparent background preferred"
    },
    {
      "type": "illustration",
      "filename": "isometric_city.png",
      "decision": "Gemini-image OBLIGATOIRE — bâtiments reconnaissables",
      "prompt": "Isometric line-art illustration of a small African market district — kiosks, small shops, streets, pedestrians. Line art in gold #FFB800 on very dark navy #0d1420. M-Pesa signage on some kiosks. Clean, minimal, portrait orientation 9:16"
    },
    {
      "type": "illustration",
      "filename": "hands_network.png",
      "decision": "Gemini-image OBLIGATOIRE — mains humaines",
      "prompt": "Two hands reaching toward each other, touching index fingers, over a dark Africa map outline with glowing gold network nodes connected by thin lines. One hand gold/warm skin, one hand darker skin. Symbolic like Sistine Chapel. Dark navy background #0d1420, gold accents #FFB800, portrait 9:16"
    },
    {
      "type": "illustration",
      "filename": "candle_flame.png",
      "decision": "Gemini-image OBLIGATOIRE — flamme reconnaissable",
      "prompt": "Single small candle flame glowing gold on a very dark navy background #0d1420. Soft radial warm glow around the flame. Minimal, isolated, centered. No candle body needed — just the flame and its light. Portrait 9:16"
    }
  ],
  "components_suggested": [
    "AbsoluteFill centré pour chaque segment",
    "spring scale/opacity pour entrées",
    "interpolate countUp 0→50000000 pour familles",
    "staggered fadeIn pour silhouettes (delay par index)"
  ],
  "tailwind_tokens": [
    "text-gold",
    "text-ivory",
    "bg-navy-deep",
    "font-cinzel",
    "font-mono"
  ],
  "animation_notes": "springs damping=80 stiffness=60 par défaut. Segment kenyans: silhouettes staggered delay=index*3 frames. Segment familles: mains translate depuis -200px/+200px. Segment fin: flamme scale 0.95↔1.05 oscillation sinusoïdale."
}
```

## Images de référence storyboard v2
- seg30_v2.png — Pages calendrier déchirées "2025" + "DIX-HUIT ANS PLUS TARD."
- seg31_v2.png — 10 silhouettes (9 or / 1 gris) + "9/10 KENYANS UTILISENT M-PESA"
- seg33_v2.png — Vue isométrique quartier M-Pesa + "300 000 POINTS DE DÉPÔT"
- seg32_v2.png — Deux mains + carte Afrique + "50 000 000 / 54 PAYS"
- seg34_v2.png — Flamme bougie + "C'ÉTAIT UNE RÉVOLUTION RÉELLE."
