# public/seedance/ — Index assets Seedance

> Créé : 2026-05-02. Centralisé depuis tmp/, tests/, research/, sonjata-papercraft/
> Utilité principale : références visuelles pour prompts Seedance + LoRA training futur

---

## Structure

```
public/seedance/
├── style-refs/           ← images référence style (pour prompts Gemini + Seedance)
│   ├── gemini/           ← tests styles Gemini (woodcut, noir, graphic-novel)
│   ├── gpt/              ← tests styles GPT Image 2 (comparaison)
│   ├── thiaroye/         ← style-refs Thiaroye V5
│   ├── sonjata-papercraft/ ← images frame1 Sonjata Papercraft (style source)
│   ├── reference-shorts/ ← analyse chaînes pro (GeoGlobeTales, Johnny Harris)
│   ├── references/       ← refs techniques cartographiques
│   └── *.jpg             ← refs Soundjata iron-bar (style-ref canonique)
│
├── test-clips/           ← clips vidéo générés (tests + production)
│   ├── *.mp4             ← tests fal.ai Seedance (chaining, ref2v, lipsync)
│   ├── seedance-examples/ ← clips Seedance officiels (feature-1 à 4, example-1 à 4)
│   ├── sonjata-papercraft/ ← clips bruts Sonjata (papercraft1/2/3, valeur LoRA)
│   └── yaroflasher-test/ ← test Seedance yaroflasher
│
├── heros-oublies-refs/   ← style-refs personnages Heros Oublies
│   ├── soundjata-iron-bar-styleref*.png
│   ├── yaa-asantewaa-*.png
│   └── soundjata-insult-starting-pose-styleref.png
│
├── historical-refs/      ← character sheets historiques (LoRA training)
│   ├── abou-bakari-historical-sheet.png
│   ├── abou-bakari-vivid-sheet.png
│   ├── amanirenas-historical-sheet.png
│   └── amanirenas-vivid-sheet.png
│
└── moodboards/           ← moodboards par projet + analyses visuelles
    ├── soundjata-charte/     ← assets Charte du Mande (scroll, quill, codex)
    ├── soundjata-empire-maps/ ← cartes empire Soundjata
    ├── soundjata-insult/     ← clips + frames scène insulte
    ├── lat-dior-bataille/    ← refs battle Lat Dior (clash, inkwash, flash)
    ├── vivid-test/           ← tests palette vivid
    ├── vivid-test-v2/
    ├── thiaroye-moodboard-backlog/ ← backlog moodboard Thiaroye V5 (2026-04-23)
    ├── gpt-vs-gemini-scene5/ ← comparaison GPT Image 2 vs Gemini (2026-05-01)
    ├── audio-abou-bakari-v2/ ← audio refs Abou Bakari
    └── whisper-v5/           ← tests Whisper
```

---

## Fichiers clés pour prompts Seedance

| Fichier | Usage |
|---------|-------|
| `style-refs/soundjata-iron-bar-ref-03s.jpg` | Ref style canonique papercraft (frame 3s) |
| `style-refs/sonjata-papercraft/papercraft1-cercle-barre-fer-frame1.png` | Frame 1 scène emblématique |
| `heros-oublies-refs/soundjata-iron-bar-styleref-v2.png` | Meilleure ref style Soundjata V2 |
| `historical-refs/abou-bakari-historical-sheet.png` | Character sheet Abou Bakari |

---

## Priorité LoRA training (future)

1. `test-clips/sonjata-papercraft/*.mp4` — 3 clips validés style papercraft
2. `heros-oublies-refs/*.png` — 6 character sheets multi-poses
3. `historical-refs/*.png` — 4 sheets historiques haute qualité
