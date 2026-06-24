# SÉNÉGAL PÉTROLE & GAZ — REFONTE V3 (source de vérité unique)

> ⛔⛔ **NE PAS MÉLANGER V1 ET V3.** Lire ceci AVANT de toucher à quoi que ce soit sur ce projet.
> Ce dossier est LA source de vérité de la refonte V3. Tout ce qui est V3 est indexé ici.

## LES DEUX VERSIONS (pourquoi elles coexistent)

| | V1 (ancienne) | V3 (refonte EN COURS) |
|---|---|---|
| **Voix** | `narration-v1-clean.mp3` (plate) | `narration-v3-VALIDEE.mp3` (expressive, vivante) |
| **Structure** | Beat0 + Acte1 + Acte2 + Beat10→14 | 8 SCÈNES (script restructuré) |
| **Contenu** | — | + scène 7 BONUS "le pouvoir se fissure" (NOUVEAU, absent de V1) |
| **État** | tous beats FINAL, **déjà publiable** | scène 0 FAITE, scènes 1-7 à faire |
| **Rôle** | **FILET / COMPARATIF** — on la garde tant que V3 incomplète | la vraie cible |

**RÈGLE (décision Aziz 2026-06-18) :**
1. On refait les scènes **une par une en V3**, en validant chacune (méthode War-Map).
2. Pour CHAQUE scène : d'abord **comparer ce qu'avait V1** (extraire frames/audio du beat V1 correspondant),
   PUIS la refaire avec audio V3 + doctrine `CONTINUITE-SCENE-INTENTION-DABORD`.
3. **V1 et V3 restent SÉPARÉS** — ne jamais mélanger leurs composants/audios dans un même assemblage.
4. **Quand V3 est complète (8 scènes) → on SUPPRIME V1.** Pas avant.

## ÉTAT DES 8 SCÈNES V3

| Scène | Sujet | V1 correspondant | État V3 | Composant V3 |
|---|---|---|---|---|
| **0 — HOOK** | Avril 2026, 8M$/jour → fracture (limoge) → recomposition (la vérité) | Beat0Accroche | ✅ **FAIT** (catbox yg9k78) | `src/projects/_proto-16-9/SenegalScene0.tsx` (+ MapDrawParchemin + Fracture) |
| 1 — ACTE 1 | les 3 gisements + le paradoxe | Beat1→9 (senegal-acte1-FINAL) | 🟡 INTRO ✅ (coin-flip) · **GISEMENTS ✅✅ SCÈNE FINALE VALIDÉE AZIZ 2026-06-22** — `SceneGisementsV3.tsx` SEUL composant (V5/V5Effets/protos SUPPRIMÉS). 3 actes calés voix (Sangomar/GTA/Yakaar) + drapeau SEN projeté + jetons SVG GPT-5.5 + SFX + **pivot 60% en DATA-HERO (baril-héros qui se remplit, plein écran, grille navy)**. Livrable : `out/episodes/senegal-petrole-gaz/scene-gisements-FINAL.mp4` (catbox e74r6n avec musique). Détail → `REPRISE-SCENE-1.md` | `SenegalScene1IntroCoin.tsx` (intro) + `SceneGisementsV3.tsx` (gisements, FINAL) |
| 2 | leçon Norvège/Congo/Botswana | Beat10 | ✅ **FAIT** (validé Aziz 2026-06-24, catbox mv56cl) — carte Mapbox 1-continue (reprise Beat10, premiumisée) : voyage 3 pays, drapeaux drapés + plaques factuelles 1 chiffre/pays + jeton pétrole offshore relié + **triple screen final** (silhouettes territoire d3-geo + drapeau, NU) + SFX millimètre + musique + carte éclaircie. Render : `out/episodes/senegal-petrole-gaz/scene2-comparaison-FINAL.mp4` | `beats/SceneComparaisonV3.tsx` |
| 3 | le contrat (terrain 1) | Beat11 | ✅ **FAIT** (validé Aziz 2026-06-24, catbox 4gzkq1) — data-viz Remotion (jury LLM G+K+D). Baril 60% (continuité pivot gisements) rongé par lame COST RECOVERY Woodside → « 60% ANNONCÉ » devient « ??% PART RÉELLE ». Document-contrat + cadenas (pas public, sans texte). Marqueurs Woodside/État rattachés au baril. Baril centré. Render : `out/episodes/senegal-petrole-gaz/scene3-contrat-FINAL.mp4`. Plan : `PLAN-SCENE-3-CONTRAT.md` | `beats/SceneContratV3.tsx` |
| 4 | le piège de la dette (terrain 2) | Beat12 (calebasse 132%) | ⬜ | — |
| 5 | qui regarde dans les coulisses (terrain 3) | Beat13 | ⬜ | — |
| 6 | bilan : de zéro à exportateur | Beat14 | ⬜ | — |
| 7 — BONUS | la machine tourne, le pouvoir se fissure + pont AES | **AUCUN (nouveau)** | ⬜ | — |

## SCÈNE 0 — détail (FAITE, référence pour les suivantes)
- **Composant** : `src/projects/_proto-16-9/SenegalScene0.tsx` (composition `SenegalScene0`, 970f / 32s).
  Assemble 2 parties : `ProtoEffect_MapDrawParchemin` (count-up) + `ProtoEffect_Fracture` (fracture→recompo).
  ⚠️ **TODO RANGEMENT** : ces fichiers sont temporairement dans `_proto-16-9/` (dossier R&D). À déplacer vers
  `src/projects/souverain/senegal-petrole-gaz/v3/` quand l'autre instance aura libéré Root.tsx (working tree partagé).
- **Audio** : narration v3 continue + musique A. SFX : odomètre (count-up), cedeao-snap (fracture/limoge),
  stat-tick (clic au contact de la recomposition).
- **Calage** : forced alignment ElevenLabs `public/.../audio/hook-alignment.json` (loss 0.27).
  Mots-clés : "saute" 11.84s · "limoge" 13.48s · "Comment" 15.90s · "malédiction" 25.1s · "miracle" 27.2s · "précise" 31.7s.
- **DA premium appliqué** (Gemini filtré) : grain + ombres diffuses, faille chaude (pas néon), easing expo, micro-tremblement.

## MÉTHODE POUR CHAQUE NOUVELLE SCÈNE (rappel doctrine)
1. **Comparer V1** : extraire frames + audio du beat V1 correspondant (voir tableau).
2. **Intention** : que doit faire ressentir cette scène ? (doctrine `CONTINUITE-SCENE-INTENTION-DABORD`).
3. **Forced alignment** de la portion narration V3 concernée (réutiliser `scripts/senegal-hook-alignment.py` adapté).
4. **Forme → template** (en dernier), continuité du monde, épure (l'écran ne double pas la voix).
5. Render → DA-brief vidéo (`scripts/tools/gemini-video-da-brief.py`, filtrer = signal pas juge).
6. Mettre à jour ce tableau (scène ✅).

## POINTEURS
- ⭐ **RENDERS FINAUX + reste à faire + plan assemblage** : `out/episodes/senegal-petrole-gaz/_ASSEMBLAGE-V3.md`
  (source de vérité des parties rendues, anti-fouillis). 3 parties faites (hook + intro coin-flip + gisements,
  audio 0→122s = 25%) ; restent 6 scènes (122→492s, ~75%). PROCHAINE = scène 2 Norvège/Congo-Brazzaville/Botswana
  (CARTE Mapbox, réf V1 = `Beat10.tsx`). Terrains 1-2-3 = Remotion (décidé).
- Doctrine : `memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md`.
- Script V3 (8 scènes, texte exact) : `out/episodes/senegal-petrole-gaz/_audio-v3/SCRIPT-V3-senegal.md`.
- Audio V3 : `public/souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3`.
- STATUS global (V1) : `../STATUS.md` (⚠️ décrit la V1, pas la refonte V3).
