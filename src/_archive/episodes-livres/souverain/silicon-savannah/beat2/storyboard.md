# Beat 2 — Storyboard
> Généré par Gemini — Phase 1 validée
> Date : 2026-05-14
> Appel 1 : gemini-3.1-flash-image-preview (images + R1)
> Appel 2 : gemini-3.1-pro-preview (JSON structuré)
> Images : /tmp/beat2_storyboard/segment_1..4.png

## JSON de production

```json
{
  "beat": "beat2",
  "duration_s": 14.66,
  "duration_frames": 440,
  "r1_segments": [
    {
      "id": "2.1",
      "start_s": 0,
      "end_s": 1.67,
      "start_frame": 0,
      "end_frame": 50,
      "duration_s": 1.67,
      "r1_ok": true,
      "change": "Apparition du point de départ chronologique — chiffre 2007",
      "layout": "Centré vertical + horizontal",
      "elements": [
        "Texte géant '2007' centré, police serif élégante, couleur or (#FFB800)"
      ],
      "bg_texture": "Navy très sombre (#0d1420) avec grain léger type papier mat"
    },
    {
      "id": "2.2a",
      "start_s": 1.67,
      "end_s": 6.0,
      "start_frame": 50,
      "end_frame": 180,
      "duration_s": 4.33,
      "r1_ok": true,
      "change": "Introduction du service M-PESA et ses fonctions SMS",
      "layout": "Centré haut — logo + icônes",
      "elements": [
        "Texte 'M-PESA' majuscule or (#FFB800) en grand",
        "Enveloppe SMS + pièces monétaires €/$ au-dessus, contour or"
      ],
      "bg_texture": "Moitié haute navy lisse, moitié basse navy avec texture tissu/denim très subtile"
    },
    {
      "id": "2.2b",
      "start_s": 6.0,
      "end_s": 10.43,
      "start_frame": 180,
      "end_frame": 313,
      "duration_s": 4.43,
      "r1_ok": true,
      "change": "Deux lignes de négation — absence app + smartphone barré",
      "layout": "Centré vertical — 2 lignes de texte",
      "elements": [
        "Ligne 1 : 'PAS D'APP' or (#FFB800) majuscule",
        "Ligne 2 : 'PAS DE SMARTPHONE' ivoire (#f5efe0) avec ligne de rature or horizontale"
      ],
      "bg_texture": "Navy avec texture tissu/denim subtile (continuité depuis 2.2a)"
    },
    {
      "id": "2.3",
      "start_s": 10.43,
      "end_s": 14.66,
      "start_frame": 313,
      "end_frame": 440,
      "duration_s": 4.23,
      "r1_ok": true,
      "change": "Split vertical antenne + Nokia — conclusion visuelle forte",
      "layout": "Split vertical 50/50",
      "elements": [
        "Gauche : antenne relais ivoire (#f5efe0) avec ondes concentriques or",
        "Droite : silhouette Nokia 3310 stylisée remplie or (#FFB800)"
      ],
      "bg_texture": "Navy sombre (#0d1420) — léger contraste gauche/droite pour marquer le split"
    }
  ],
  "assets_to_generate": [
    {
      "type": "background",
      "filename": "bg.png",
      "prompt": "Close-up photograph of aged dark navy paper with very subtle grain texture, 1080x1920 pixels, dark background #0d1420, minimal light vignette at center, no text, no graphics, no shapes, photographic texture only. The texture should be barely visible — it exists only to add depth."
    }
  ],
  "components_suggested": [
    "TypeReveal",
    "PopIn",
    "SplitScreen ou AbsoluteFill split manuel"
  ],
  "tailwind_tokens": [
    "text-gold",
    "text-ivory",
    "bg-navy-deep",
    "font-cinzel",
    "font-mono"
  ],
  "animation_notes": "2.1→2.2a : fade out '2007', fade in M-PESA (spring). 2.2a→2.2b : M-PESA disparaît, 2 lignes text pop-in séquentiel + rature se dessine. 2.2b→2.3 : wipe ou cut vers split antenne/Nokia. Chaque entrée : spring damping=80 stiffness=60."
}
```

## Tableau R1 final

| Segment | Frames   | Durée | R1 OK | Changement visuel |
|---------|----------|-------|-------|-------------------|
| 2.1     | 0→50     | 1.67s | OK    | "2007" centré, navy+grain |
| 2.2a    | 50→180   | 4.33s | OK    | M-PESA + icônes SMS/pièces |
| 2.2b    | 180→313  | 4.43s | OK    | "PAS D'APP / PAS DE SMARTPHONE" barré |
| 2.3     | 313→440  | 4.23s | OK    | Split antenne ivoire / Nokia or |

## Images de référence
- segment_1.png — 2007 centré
- segment_2.png — M-PESA split
- segment_3.png — négations barrées
- segment_4.png — antenne + Nokia split
