# STARTER PROMPT — Sénégal Pétrole & Gaz — Beat 2 à Beat 5

> Session précédente (2026-05-22) : Beat 1 terminé et validé. Musique générée (3 variantes).
> Cette session : coder Beats 2→5 de l'Acte 1.

---

## COLLER EN DÉBUT DE SESSION

---

Bonjour, on continue la production de **Sénégal Pétrole & Gaz** (mid-form 7 beats, 420s).

### Ce qui est FAIT et VALIDÉ (ne pas re-questionner)

**Beat 1** — COMPLET
- Fichier : `src/projects/souverain/senegal-petrole-gaz/beats/Beat1.tsx`
- Composition Root.tsx : `Senegal-Beat1` (450 frames, 30fps, 1920×1080)
- Pattern : carte GéoAfrique V5 plein écran, Mercator forcée (`setProjection("mercator")`), Sénégal highlight gold (#c8a951), flyover CAM_START `{lon:-10, lat:12, zoom:3.5}` → CAM_END `{lon:-15.5, lat:14.5, zoom:6.5}`, ease cubic in-out sur 85% de 12s, label "SÉNÉGAL / PÉTROLE & GAZ — DEPUIS 2024" spring pop à 10s
- Blueprint validé : Or Africain (plein écran = carte, pas de split)

**Storyboard Acte 1** — VALIDÉ par Gemini 3.1-pro-preview (révision R1 + Mapbox 60%)
- Image storyboard : `/tmp/storyboard-senegal-acte1-v2.png`
- JSON Gemini révisé : `/tmp/gemini-revision-acte1.txt` (5 beats, R1 conforme, 3/5 Mapbox)

**Musique** — 3 variantes générées (Minimax v2.6, non encore choisie)
- `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3` (321s)
- `public/souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3` (184s)
- `public/souverain/senegal-petrole-gaz/audio/music-C-sabar-cinematique.mp3` (258s)
- Liens écoute Litterbox (72h depuis 2026-05-22 ~12h) : A=pnz6l9 / B=8mvaax / C=gcnw75

**Audio narration** : `public/souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3`

**Composants nouveaux créés cette session** :
- `src/projects/_shared/components/layouts/BrutalHookSplit.tsx` — modifié : accepte `mapboxChildren` + `brutalLines[]` (BrutalStrike spring stiffness 200, damping 12)
- `src/projects/_shared/components/layouts/PulseNumber.tsx` — modifié : accepte `mapboxChildren` (transparent bg, vignette navy)
- `src/projects/_shared/components/layouts/MapboxPulse.tsx` — NOUVEAU : 3 anneaux expandants, dot heartbeat, crosshair spring, label droit du point

---

### JSON Acte 1 — SOURCE DE VÉRITÉ (ne pas re-demander à Gemini)

```json
[
  {
    "beat": 1, "STATUS": "COMPLETE — voir Beat1.tsx",
    "template": "GéoAfrique V5 plein écran (hors BrutalHookSplit — split rejeté en 16:9)"
  },
  {
    "beat": 2,
    "segment": "B (0:15-0:32)",
    "template": "PulseNumber",
    "mapbox": true,
    "mapbox_config": { "coordinates": [-17.15, 13.45], "location": "Sangomar", "zoom": 9, "style": "dark-dots-navy" },
    "duration": "12s",
    "props": { "number": "8 000 000", "unit": "$/JOUR", "label": "JUIN 2024 — DAKAR", "pulse_color": "gold" },
    "r1_events": ["0s: Mapbox Sangomar", "4s: point pulsant gold + halo", "7s: chiffre spring overshoot", "9s: bandeau + unité"]
  },
  {
    "beat": 3,
    "segment": "C (0:32-0:42)",
    "template": "ChiffreChoc",
    "mapbox": false,
    "duration": "10s",
    "props": { "shock_number": "<50%", "label": "DES REVENUS BRUTS", "subtitle": "L'État n'est pas certain d'en garder la moitié." },
    "r1_events": ["0s: fond sombre + label", "4s: chiffre <50% explose à l'écran", "7s: sous-titre claque en rouge"],
    "NOTE": "ScaleShock rejeté en R0 (composant = comparaison Belgique/Afrique, fidelité ~30%). Remplacé par ChiffreChoc."
  },
  {
    "beat": 4,
    "segment": "D (0:42-0:55)",
    "template": "TextChoc",
    "mapbox": false,
    "duration": "13s",
    "props": {
      "text_1": "LA VRAIE QUESTION",
      "text_2": "N'EST PAS COMBIEN IL VA PRODUIRE",
      "text_3": "C'EST COMBIEN",
      "text_4_gold": "IL VA GARDER"
    },
    "r1_events": ["0s: text_1", "4s: text_2", "8s: text_3", "11s: text_4 gold massif + soulignement"]
  },
  {
    "beat": 5,
    "segment": "E (0:55-1:00)",
    "template": "MapboxPulse",
    "mapbox": true,
    "mapbox_config": { "coordinates": [-17.50, 14.80], "location": "Yakaar-Teranga", "zoom": 8 },
    "duration": "5s",
    "props": { "label": "Gisement Yakaar-Teranga", "pulse_color": "blue-cyan" },
    "r1_events": ["0s: carte Yakaar-Teranga", "3s: label gazier + marqueur"]
  }
]
```

---

### Règles session (NON-NEGOTIABLE — acquises cette session)

**R0 — Faisabilité avant tout code (BLOQUANT)**
- Seuil : 95% minimum par beat
- Si sous seuil : option A (coder le delta) / B (remplacer template) / C (accepter dégradation documentée)
- Exemple appliqué : Beat 3 ScaleShock → 30% → décision B → ChiffreChoc

**R1 — Max 8s sans événement visuel fort**
- Ken Burns / glow / float NE COMPTENT PAS
- Chaque beat doit avoir des timestamps d'événements explicites avant de coder

**Mapbox — Blueprint Or Africain (OBLIGATOIRE)**
- Plein écran toujours — la carte EST le visuel, pas un split 50/50
- `setProjection("mercator")` dans `style.load` TOUJOURS (dark-v11 démarre en globe sinon)
- GéoAfrique V5 via `applyGeoAfriqueV5(map)`
- Highlight pays en gold dès frame 0

**Tailwind — OBLIGATOIRE sur tout nouveau composant Souverain**
- Zéro style inline pour couleurs/typo/spacing si token existe
- Tokens : `text-gold` / `text-ivory` / `bg-navy` / `text-stat-lg` / `text-entity`

**SFX — À prévoir pour la prochaine session Gemini (pas cette session)**
- Champ `sfx[]` à ajouter dans le JSON Gemini pour les épisodes suivants
- Types : `map-zoom-in`, `highlight-pop`, `label-snap`, `number-impact`

**Gemini — 2 appels MAX par beat**
- 1 breakdown + 1 review — jamais plus
- Beat 1 breakdown déjà fait — ne pas re-appeler

---

### Ordre de travail cette session

1. **Beat 2** — `PulseNumber` sur Mapbox Sangomar → créer `beats/Beat2.tsx`
2. **Beat 3** — `ChiffreChoc` `<50%` → créer `beats/Beat3.tsx`
3. **Beat 4** — `TextChoc` → créer `beats/Beat4.tsx`
4. **Beat 5** — `MapboxPulse` Yakaar-Teranga → créer `beats/Beat5.tsx`
5. **Assemblage** — enregistrer les 4 compositions dans Root.tsx
6. **Choix musique** — Aziz écoute A/B/C et valide la variante

Pour chaque beat : R0 audit → code Tailwind → render wip → self-review → présenter.
