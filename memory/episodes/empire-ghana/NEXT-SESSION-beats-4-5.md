# NEXT SESSION — Empire Ghana Beat 4 + Beat 5 (assemblage final)

> Brief de démarrage pour la prochaine session de production.
> Branche : `feat/atlas-empire-ghana`. Beat 0-3 validés, ne pas y retoucher.

---

## Starter prompt (à copier-coller pour Aziz)

```
On reprend Empire du Ghana. Beats 0-1-2-3 sont validés et commitées sur la
branche feat/atlas-empire-ghana. Reste Beat 4 (Effondrement, frames 2152→2788,
~21s) + Beat 5 (CTA, frames 2788→3145, ~12s) + assemblage final + sous-titres
karaoke + render complet.

Avant de toucher au code, lis ces fichiers dans cet ordre :
1. memory/COMPACT_CURRENT.md (état exact session précédente)
2. memory/episodes/empire-ghana/BEAT-3-COMPLETE.md (dernière scène validée)
3. memory/tools/atlas-camera-movements.md (catalogue 16 mouvements caméra)
4. memory/feedback_remotion-permet-doser.md (philosophie expérimentation)
5. memory/feedback_polish-final-inserts-plein-ecran.md (règle inserts)
6. memory/feedback_review-mp4-avant-presentation.md (règle review MP4)
7. memory/feedback_atlas-camera-track-css-sprites.md (pattern marchands réutilisable)
8. memory/episodes/empire-ghana/script-v3-locked.md (script narration)
9. src/projects/atlas/empire-ghana/timing.ts (segments + KEY_WORDS)
10. src/projects/atlas/empire-ghana/ghana-alignment.ts (timestamps exacts)

Avant de coder Beat 4, propose un brief scene-by-scene avec :
- Découpage narratif (5 sous-événements en 21s : 5 siècles → Almoravides 1076 →
  sécheresse → effondrement → naissance Mali/Sundiata)
- Pour chaque sous-événement : quel mouvement caméra parmi le catalogue
  (1-2 safe + 1 à essayer parmi les 9 jamais utilisés)
- Quels assets PixelLab/d3-geo (déjà préparés en Beat 1 : guerrier-almoravide,
  ruines-banco — vérifier dans public/empire-ghana/assets/pixellab/)
- Pas d'insert plein écran prévu (reportés au polish final si nécessaire)

Pose-moi des questions avant de coder. On valide le brief, ensuite tu codes.
```

---

## État technique actuel (vérifié 2026-05-03 fin session)

### Branche git
`feat/atlas-empire-ghana` — derniers commits :
- `2db5a85` docs(atlas): leçons fin session Beat 3
- `421eb03` feat(empire-ghana): Beat 3 Silent Barter v4 validé

### Compositions Remotion enregistrées dans Root.tsx
- `EmpireGhanaBeat0Hook` ✅
- `EmpireGhanaBeat1Setup` ✅
- `EmpireGhanaBeat2Density` ✅
- `EmpireGhanaBeat3Barter` ✅
- `EmpireGhanaBeat4Consequence` — **À CRÉER**
- `EmpireGhanaBeat5CTA` — **À CRÉER**
- Composition assemblage final — **À CRÉER**

### Renders validés disponibles
- `out/empire-ghana/beat0-v8.mp4`
- `out/empire-ghana/beat1-v6-final.mp4`
- `out/empire-ghana/beat2-v4.mp4`
- `out/empire-ghana/beat3-v4.mp4`

### Audio + alignment prêts (ne pas re-générer)
- `public/audio/atlas-empire-ghana/narration-v1.mp3` (104.92s)
- `src/projects/atlas/empire-ghana/ghana-alignment.ts` (loss 0.094)
- `src/projects/atlas/empire-ghana/timing.ts` (6 segments calculés)
- `public/audio/atlas-empire-ghana/music/v1-B-marche-or.mp3`

---

## Beat 4 — Effondrement (frames 2152→2788, ~21s)

### Texte narration (depuis script)
"Ce système a tenu cinq cents ans. Mais en 1076, les Almoravides arrivent.
Sécheresse. Effondrement. Et de ses cendres naît un nouvel empire :
celui de Sundiata. Cendres de Wagadou."

### KEY_WORDS (timing.ts ligne 99-105)
- CINQ_CENTS_ANS : 73.5s / f2205
- ALMORAVIDES : 76.0s / f2280
- MILLE_SOIXANTE_SEIZE : 79.5s / f2385
- SECHERESSE : 82.5s / f2475
- EFFONDREMENT : 84.0s / f2520
- SUNDIATA : 88.5s / f2655
- EMPIRE_MALI_NAITRE : 90.5s / f2715

⚠️ KEY_WORDS sont des estimations — récupérer timestamps exacts via
`findWord()` depuis `ghana-alignment.ts` au début de la prod Beat 4.

### Assets PixelLab disponibles (générés Beat 1)
- `guerrier-almoravide.png` (à vérifier dans `public/empire-ghana/assets/pixellab/`)
- `ruines-banco.png` (à vérifier)
- `bloc-sel-mine.png`, `pieces-or-dinars.png` (réutilisables)

### Pistes créatives (à valider en début de session)
- 5 siècles : continuité Beat 3, empire qui glow continu
- Almoravides 1076 : entrée guerrier sprite (camera-track ?), date pulse
  sur la carte
- Sécheresse : artefact d3-geo (territoire qui désature en gris) ou Lottie
  (terre craquelée ?)
- Effondrement : empire hatch qui s'efface progressivement, palette gris
- Sundiata + Mali : nouveau territoire qui apparaît ou seal qui transitionne

### Mouvements caméra à ESSAYER (parmi les 9 jamais utilisés Atlas)
Au moins 1 obligatoire selon règle "Remotion permet d'oser" :
- **Whip-pan** entre Wagadou → zone Almoravides (nord)
- **Freeze-frame** sur "1076" qui pulse plein écran
- **Match-cut** : sac d'or fin Beat 3 → ruines début Beat 4 (transition magique)
- **Dutch tilt** sur "effondrement" (rotation 5-8°)
- **Speed ramping** sur la chute Wagadou (ralenti)
- **Fade-to-color** : carte vire au gris/cendre pendant l'effondrement

---

## Beat 5 — CTA (frames 2788→3145, ~12s)

### Texte narration
"Wagadou. Cinq siècles de commerce mondial. Avant Florence, avant Venise.
Si on ne te l'a pas raconté, c'est qu'on l'a oublié. Mais nous, jamais.
Jamais Wagadou."

### KEY_WORDS
- CINQ_SIECLES : 94.5s / f2835
- FLORENCE_VENISE : 101.5s / f3045
- JAMAIS_WAGADOU : 104.0s / f3120

### Inspiration
Voir CTA Mansa Moussa V2 (carte Afrique avec chaîne, 9.75s) pour le pattern.
Ne PAS copier-coller — adapter au contexte Ghana.

### Pistes créatives
- Map zoom-out vers Afrique entière → comparaison Florence/Venise via
  POI européens qui apparaissent
- Cartouche "JAMAIS WAGADOU" final pleine puissance
- Empire Wagadou qui re-glow une dernière fois en signature

---

## Assemblage final + sous-titres karaoke

### Pattern (déjà validé Sonjata V7)
- Composition `EmpireGhanaFull` qui chaîne les 6 beats via `<Sequence>`
- Sous-titres karaoke mot-par-mot via Whisper API + composant `Subtitles.tsx`
  (pattern `memory/templates/subtitles-shorts.md`)
- Render final → `out/PRET-PUBLICATION/empire-ghana-FINAL.mp4`

### Whisper words
- Fichier existe : `src/projects/atlas/empire-ghana/whisper-words.ts` (211 mots)
- Source de vérité pour sous-titres karaoke

### À VÉRIFIER avant assemblage
- Cohérence audio entre beats (pas de coupure abrupte)
- Volumes musique cohérents (0.07 dans tous les beats)
- Transitions visuelles fluides (fade out beat N ↔ fade in beat N+1)

---

## Règles à respecter pendant la prod

1. **Review MP4 SOI-MÊME** avant de présenter à Aziz
   (`feedback_review-mp4-avant-presentation.md`)
2. **1 mouvement "à essayer"** par scène minimum
   (`feedback_remotion-permet-doser.md`)
3. **Cartouches TOP HALF** (y < 640) — bottom réservé sous-titres karaoke
4. **Max 3 sprites simultanés** sur carte
5. **Forced alignment, pas estimations** pour timing exact
6. **Inserts plein écran = polish final**, pas pendant beat-par-beat

---

## Décision session précédente — silent barter SANS insert plein écran

Aziz a évalué l'option d'ajouter un insert plein écran pour le silent barter
(diagramme protocole 4 étapes / citation Al-Bakri / match-cut balance).
Verdict après visionnage Beat 3 v4 final : **PAS d'insert nécessaire**.

Raison : le pattern "marchands animés qui déposent + sacs persistent +
balance arrive + camera-track + dolly-out + empire pulse" raconte déjà
l'histoire de manière complète et lisible. L'insert aurait été redondant.

**Pattern à RÉUTILISER** : marchands sprite qui viennent déposer/agir +
camera-track + sacs/objets qui persistent. Validé comme technique
réutilisable cross-épisodes Atlas.

---

## Coût estimé prochaine session

- Beat 4 production : ~2-3h (5 sous-événements à chorégraphier)
- Beat 5 production : ~1h (plus simple, CTA pattern Mansa Moussa)
- Assemblage + sous-titres : ~1h
- Render final + compression : ~30 min
- **Total estimé : 4-5h**

Coût API : $0 (PixelLab assets déjà générés, narration déjà faite,
musique déjà choisie).
