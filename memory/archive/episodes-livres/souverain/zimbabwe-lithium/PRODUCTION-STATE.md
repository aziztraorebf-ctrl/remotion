---
name: Zimbabwe Lithium — État production
description: État session 2026-05-12. Script V5 lockée, TTS générée, timing.ts complet.
type: project
---

## Statut : timing.ts LOCKÉE — prêt pour code Remotion

**Date session :** 2026-05-12
**Pipeline :** Niger Uranium répliqué

---

## Fichiers produits

| Fichier | Path | Statut |
|---------|------|--------|
| Script V5 FINAL | (dans cette session) | LOCKÉE |
| TTS narration | `public/souverain/zimbabwe-lithium/audio/narration-zimbabwe-v1.mp3` | 86.080s / 2582f |
| Alignment JSON | `public/souverain/zimbabwe-lithium/audio/narration-zimbabwe-v1-alignment.json` | OK |
| timing.ts | `src/projects/souverain/zimbabwe-lithium/timing.ts` | LOCKÉE |
| Script TTS | `scripts/tools/generate-zimbabwe-tts.py` | OK |

---

## Décisions lockées

- **Durée audio :** 86.080s — accepté (format Souverain tolère jusqu'à 90s)
- **Aucun silence >3s** — 23 silences détectés, max 1.88s (afterHook)
- **Angle :** hybride différentiel — affirme victoire zimbabwéenne + ironie structurelle chinoise
- **Punchline :** "Qui a vraiment gagné ?" — universel, sans métaphore cryptique
- **Règle silences :** chaque silence = visuel dédié qui bouge (R-SILENCE leçon Niger)

---

## 6 Beats + Templates

| Beat | Timing | Template | Overlays clés |
|------|--------|----------|---------------|
| 1 Hook | 0→8.98s | MapboxGeoAfriqueV5 | Badge Zimbabwe, pulse marker |
| 2 Tension | 8.98→19.88s | MapboxGeoAfriqueV5 | DataCard 4e producteur, flèche export, BigStat ×15 |
| 3 Catalyseur | 19.88→33.58s | CartoCaspianNoir | KraftCard classifié, BigStat +10% rouge, barrière SVG |
| 4 Transition | 33.58→38.82s | FondNoir | Texte seul "Mais à quel prix ?" |
| 5 Démonstration | 38.82→54.44s | CartoCaspianSepia | BrutalHeadline usine, KraftCard Huayou, DataCard $400M |
| 6 Question | 54.44→86.08s | FondNoir | Split Zimbabwe/Chine, "Qui a vraiment gagné ?" plein écran |

---

## Nouvelles règles créées cette session (dans rules-souverain-editorial.md)

1. **R-MOTIVATION-VISIBLE** — tableau acteurs/motivations obligatoire après V1
2. **Test universel 3 niveaux** — Nairobi / Tokyo / 14 ans après chaque V1
3. **Règle du lien universel explicite** — implication globale nommée avant la seconde 20

---

## Prochaine session

Coder les 6 beats Remotion. Ordre recommandé :
1. Beat 1 (Hook Mapbox) — copier S1HookNiger.tsx comme base
2. Beat 3 (Catalyseur CartoCaspianNoir) — le plus complexe visuellement
3. Beats 2, 4, 5, 6 dans l'ordre
4. Assemblage ZimbabweLithiumShort.tsx
5. Render + review Kimi
