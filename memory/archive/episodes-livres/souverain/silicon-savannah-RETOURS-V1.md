---
name: silicon-savannah-retours-v1
description: Retours Aziz sur SiliconSavannahFull V1 — corrections à faire avant validation finale
metadata:
  type: project
---

# Silicon Savannah Full — Retours V1 (session 2026-05-15)

**Why:** V1 assemblée et rendue (62.9 MB, 2:12). Aziz a visionné et identifié 3 problèmes bloquants.
**How to apply:** Ne pas promouvoir en FINAL avant corrections ci-dessous.

## Problèmes identifiés

### Beat 2 — Carte Mapbox (RETRAVAILLER)
- Beat jamais validé proprement par Aziz — produit en session autonome sans review
- Plusieurs incorrections visuelles et de contenu (non détaillées — Aziz les a vues sur mobile)
- Les sous-titres / labels ne sont pas alignés sur le bon timing audio
- Cause probable : force-alignment Whisper non utilisé pour ce beat (les timestamps labels sont approximatifs)
- **Action requise :** reprendre Beat2Carte.tsx avec timestamps calés sur alignment réel, revalider visuellement

### Beat 3 — Le Miracle (DYNAMISER)
- Manque de mouvement et de dynamique — trop plat dans l'état actuel
- "RÉVOLUTION RÉELLE." apparaît trop tard (ou ne devrait peut-être pas y être du tout)
- Score Aziz : ~4/10 dans l'état
- **Action requise :** reprendre Beat3Miracle.tsx — plus d'animation, revoir la phase typewriter, décision sur "RÉVOLUTION RÉELLE."

### Audio / sous-titres (désalignés)
- Les sous-titres ne sont pas calés sur la parole réelle
- Force-alignment ElevenLabs ou Whisper word-level non appliqué correctement dans l'assemblage
- **Action requise :** vérifier et recaler tous les SUBTITLES[] de chaque beat sur les timestamps du fichier beat3/alignment.json (et équivalents)

## Statut

- `out/episodes/silicon-savannah/versions/silicon-savannah-V1.mp4` — **NON VALIDÉ**
- Ne PAS promouvoir vers PRET-PUBLICATION sans corrections
- Session dédiée requise avant re-render V2
