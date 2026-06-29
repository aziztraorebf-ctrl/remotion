# Karaoké word-level pour SVG Short (pipeline prouvé)

> Sous-titres karaoké mot-par-mot synchronisés, style TikTok, prouvés sur SVG vertical 9:16.
> Réf : GgwHookEncreVivant.tsx (GGW) + B2Source.tsx / B1Hook.tsx (Cacao→Chocolat, 2026-06-29).

## Pipeline
1. `python3 scripts/tools/whisper-align.py <audio.mp3>` → JSON `[{word, start, end}, ...]` (timing word-level réel).
   Sauver le JSON adjacent à l'audio (ex: `out/episodes/<ep>/audio/<beat>-words.json`).
2. Grammaire du composant (copier de B2Source.tsx) : constante `WORDS` (mots + start/end en frames) +
   `PHRASE_BREAKS` (indices de regroupement en lignes/phrases) → phrase active détectée par frame.
3. Rendu : mot actif mis en avant (couleur d'accent + léger relèvement) ; reste de la phrase en couleur de base
   atténuée (opacity ~0.62). Fond semi-transparent sous le texte pour lisibilité. Position tiers inférieur.

## Personnalisation par projet
- Accent du mot actif = 1 couleur du registre du PROJET, pas hors-palette.
  GGW = vert discret · Cacao→Chocolat = brun chocolat `#6b4423` (sur encre `#2b2117` / parchemin `#e8dcc0`).

## Pièges
- Whisper fragmente les apostrophes ("d", "l", "une") → REGROUPER en mots affichables avec accents/apostrophes
  corrects (`d'une`, `L'Afrique`, `l'Ouest`, `d'Ivoire`). Vérifier les ACCENTS FR dans les strings affichées.
- Timing DÉRIVÉ de l'audio (whisper), JAMAIS hardcodé (doctrine audio-derived).
- Ne pas chevaucher les autres overlays bas (micro-source) : caler à des `bottom` distincts.

## Références code
- `src/projects/_rnd/svg-scenes/GgwHookEncreVivant.tsx` (réf hook GGW)
- `src/projects/souverain/cacao-chocolat-short/beats/B2Source.tsx` (réf Cacao B2, accent brun chocolat)
