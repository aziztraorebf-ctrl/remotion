---
name: elevenlabs-nouveautes-2026-08
description: Veille ElevenLabs août 2026 (WebSearch) — pas de nouveau modèle vs juin, mais 2 leviers inexploités trouvés — seed sur Speech-to-Speech (reproductibilité re-tirages) et bouton Enhance (tags auto-générés par LLM EL).
metadata:
  type: reference
---

Veille rapide (WebSearch, 2026-08-01) sur les nouveautés ElevenLabs depuis le dernier benchmark de juin
([[TTS-VOIX-VIVANTE-BENCHMARK-2026-06]], [[TTS-EXPRESSIVITE-RECHERCHE-2026-06]]). Aucun changement de
stratégie nécessaire — le pipeline Océane→STS→GéoAfrique reste l'architecture correcte selon la doc à jour
(texte-à-voix pour l'émotion, voice changer pour préserver le timbre de marque). Pas de v4 EL, pas de modèle
FR plus expressif apparu ailleurs (Hume Octave toujours en réserve, pas de changement de verdict).

**2 leviers trouvés, jamais exploités dans notre pipeline :**

1. **`seed` sur l'endpoint Speech-to-Speech** (`/v1/speech-to-speech/{voice_id}`) — paramètre entier
   0-4294967295. Avec le même seed + mêmes params, la sortie est reproductible (best-effort, pas garanti
   à 100%). Usage direct pour nous : le STS bave sur certains "é" toniques (doctrine
   [[pipeline-voix-vivante-valide]] § MÉTHODE AUDIT AUDIO) et on re-tire actuellement au hasard jusqu'à un
   bon résultat. Avec seed : re-tirer plusieurs seeds SYSTÉMATIQUEMENT sur le segment fragile et garder
   celui qui marche, au lieu de tirages non reproductibles. `generate-narration-expressive.py` n'a pas ce
   paramètre — à ajouter si un mot continue de baver après reformulation.

2. **Bouton "Enhance" (UI ElevenLabs)** — un LLM côté EL génère automatiquement des tags pertinents sur un
   texte brut. Pas un remplacement du jugement éditorial (registre documentaire = tags sobres, éviter
   rires/soupirs hors ton), mais utilisable comme second avis / check avant de finaliser un texte taggé.

**Confirmation (pas de changement)** : voix choisie > réglages pour l'expressivité (documenté officiellement,
cohérent avec notre pipeline STS qui exploite justement une voix source à large gamme émotionnelle, Océane,
avant conversion vers le timbre de marque).
