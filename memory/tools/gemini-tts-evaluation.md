# Gemini 3.1 Flash TTS — Evaluation (2026-04-18)

## Verdict : NE PAS UTILISER pour GeoAfrique (pour l'instant)

**Pourquoi** : pas de voice cloning, les accents africains (senegalais, mandinka, sahelien) ne fonctionnent pas via prompt seul. Le modele suit bien les instructions de rythme et d'emotion mais ne peut pas reproduire un accent specifique de maniere convaincante.

**How to apply** : rester sur ElevenLabs pour toute narration GeoAfrique. Revisiter Gemini TTS uniquement quand le voice cloning sera disponible en GA (actuellement en test interne "Create Your Voice" dans AI Studio, pas encore en API).

## Points forts confirmes par test
- Expressivite : tags `[solemn]`, `[whispers]`, `[slow]` parfaitement interpretes
- Controle du rythme : le modele ralentit/accelere reellement selon les instructions
- Prix : ~20x moins cher qu'ElevenLabs ($0.015/min vs ~$0.30/min)
- Free tier genereux
- 200+ audio tags combinables
- Prompt structure (Audio Profile + Scene + Director's Notes) = sculpting voix efficace
- Classement : #2 mondial (Elo 1211, devant ElevenLabs Elo 1179)

## Limites bloquantes pour nous
- Pas de voice cloning (30 voix prebuilt seulement)
- Accents africains non convaincants via description seule
- Drift de voix entre appels successifs (probleme multi-segments)
- Status "preview" sans SLA

## Tests realises ($0 — free tier)
- 6 fichiers V1 : 3 voix masculines (Charon, Orus, Enceladus) x simple/expressif
- 5 fichiers V2 : voix sculptees (2 narrateurs, 3 narratrices)
- 4 fichiers V3 : Leda + 4 variantes d'accent africain
- Total : 15 fichiers WAV dans `/tmp/gemini-tts-test/`

## A revisiter quand
- Voice cloning disponible en API Gemini (Chirp 3 Instant Custom Voice existe sur Cloud TTS mais pipeline separe)
- "Create Your Voice" sort de beta dans AI Studio

Distinct du test H3/StyleVOX plus récent (`projects/STYLEVOX-MINIMAX-TESTS.md`), qui évalue d'autres
outils (Gemini Omni/Omni Flash exclus, ElevenLabs Flows/Studio) sans reprendre ce verdict initial sur
Gemini 3.1 Flash TTS spécifiquement.

---
Migré depuis auto-memory (`gemini-tts-evaluation.md`) le 2026-08-31, contenu original inchangé.
