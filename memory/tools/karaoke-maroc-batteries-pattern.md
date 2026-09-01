# Pattern sous-titres karaoké — validé Maroc Batteries (2026-05-31)

Pattern validé Beat 0 Hook (2026-05-31). Réutiliser pour tous les beats Maroc Batteries et futurs épisodes Souverain.

**Source des mots :** `MAROC_WORDS` dans `maroc-words.ts` — 228 mots, forced alignment ElevenLabs v1 complet (pas les WORD_ANCHORS partiels de timing.ts).

**Filtrage par beat :** `MAROC_WORDS.filter(w => w[1] >= SEG.startS - 0.1 && w[2] <= SEG.endS + 0.3)`

**Paramètres validés Aziz :**
- Police : Anton (loadFont @remotion/google-fonts/Anton)
- Taille : 52px
- Couleur mot prononcé : gold `#c8a951` avec glow
- Couleur mot en attente : blanc avec hard shadow 4 directions
- Background phrase : `rgba(0,0,0,0.4→0.65)` gradient + borderRadius 12 + backdropFilter blur(2)
- Position : `bottom: 120px`
- Padding horizontal : 48px gauche/droite
- Groupement : coupure sur silence > 0.4s OU max 6 mots par phrase

**Why:** WORD_ANCHORS dans timing.ts ne contient que les mots-pivots (8 mots par beat), insuffisant pour karaoké. Le fichier `maroc-words.ts` contient TOUS les 228 mots alignés.

**How to apply:** Pour chaque nouveau beat, importer `MAROC_WORDS` et filtrer par `SEG.startS`/`SEG.endS`. Le composant `KaraokeSubtitles` est défini dans `Beat0Hook.tsx` — le copier dans les autres beats ou l'extraire dans un composant partagé `_shared/components/KaraokeSubtitles.tsx` lors du refactor final.

Le pattern est cité comme "à copier tel quel" dans `doctrines/SOUVERAIN-SHORT-DEMARRAGE.md` (étape 3) et
`feedbacks/feedback_workflow-beat-template.md` ("toujours utiliser MAROC_WORDS... jamais WORD_ANCHORS
seuls") sans que les paramètres exacts (police, couleurs, positionnement) soient détaillés — ce fichier
comble ce trou.

---
Migré depuis auto-memory (`feedback_karaoke-maroc-batteries-pattern.md`) le 2026-08-31, contenu original
inchangé.
