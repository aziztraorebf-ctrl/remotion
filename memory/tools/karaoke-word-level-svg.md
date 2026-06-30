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

## Variante .ts constant par beat (prouvé Cacao B3/B4/B5, 2026-06-29)
Pour les Shorts SVG multi-beats : générer UN fichier `<beat>-words.ts` par beat (`whisper-align.py ... --out X.ts`)
qui exporte `WHISPER_WORDS: {word,start,end}[]`. Importer la constante directement dans le composant beat (typage TS,
zéro parsing runtime, vs JSON brut). Pipeline : `whisper-align.py <beat>-FINAL.mp3 --out <beat>-words.ts` → `import { WHISPER_WORDS }`.
⚠️ L'audio FINAL fait foi, PAS le script (cf key-learnings § "script périmé après audio lock"). Fichiers cacao : beat3/4/5-words.ts.

## Helper buildDisplayWords — recoller les ÉLISIONS (prouvé Cacao B1-B5, 2026-06-29)
Whisper FRAGMENTE les apostrophes : "l'or" → ["l","or"], "n'est" → ["n","est"], "qu'une" → ["qu","une"], "d'entrée"...
→ affiché brut, le karaoké montre "l or", "n est" (faux). Solution mutualisée : `audio/karaokeWords.ts` exporte
`buildDisplayWords(WHISPER_WORDS)` qui recolle l/d/qu/n/t/j/c/s/m + mot suivant en un token "l'or", en conservant
les timings (start du 1er fragment → end du dernier) + un index `covers[]` pour mapper le mot actif. Importer ce helper
dans TOUT beat karaoké word-level (ne PAS ré-implémenter par beat). Les PHRASE_BREAKS (index bruts) se reconvertissent
en index DISP via `covers`. Réf : `src/projects/souverain/cacao-chocolat-short/audio/karaokeWords.ts` + B1-B5.
