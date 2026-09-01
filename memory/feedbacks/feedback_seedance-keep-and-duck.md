---
name: Seedance keep-and-duck audio strategy
description: Validated approach for multi-shot storyboard-to-video — mix Seedance audio under narration at 30% instead of stripping
type: feedback
---

Migré depuis auto-memory 2026-08-31 (validé 2026-04-13). Ce fichier est référencé PAR SON NOM
EXACT depuis `memory/tools/pipeline.md` (repo) — le pointeur existait mais pas le fichier cible,
d'où cette migration pour combler le lien.

**Règle** : pour storyboard-to-video multi-shot avec `generate_audio: True`, mixer l'audio Seedance à **30% sous la narration ElevenLabs à 100%** en Remotion. Ne PAS stripper comme on faisait avant.

**Why:** Validé sur Soundjata Acte V Segment A v2 (2026-04-13) que Seedance produit en storyboard-to-video un mix atmosphérique cohérent et frame-perfect synchronisé (SFX rire, musique d'ambiance, whoosh flèches). Stripper cet audio = perdre 3-5h de post-prod par Short à recréer manuellement. Mixer à 30% sous la narration = ambiance gratuite.

**How to apply:**
- Toujours `generate_audio: True` sur les appels storyboard-to-video Seedance 2.0
- En Remotion : `<Audio src={narration} volume={1.0} />` + `<Audio src={seedanceMp4Audio} volume={0.30} />`
- Ajuster le pourcentage par segment si besoin (bataille intense = peut monter à 40%, dialogue contemplatif = descendre à 15-20%)
- Si l'audio Seedance d'un segment jure avec la narration → mute cette piste et fallback sur Minimax/manual comme avant
- Cette règle s'applique uniquement à storyboard-to-video (multi-shot). Pour clips mono-shot action pure, la règle historique "strip audio Seedance" reste valide (mix rudimentaire)
