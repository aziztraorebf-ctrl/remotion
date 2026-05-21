---
name: Vraie Taille Afrique — leçons production 2026-05-12
description: Post-mortem épisode VTA — causes de friction + 3 règles nouvelles à appliquer sur tous les futurs épisodes
type: feedback
---

## Ce qui a bloqué (analyse honnête)

### 1. Silence prolongé comme faux-ami
Script original : beats de 20-25s avec 8-10s de silence post-VO. Sur papier = "respiration". En pratique = friction, le spectateur décroche.
**Règle** : tout silence >3s dans un script est un signal d'alarme. Soit on remplit avec VO, soit on justifie explicitement (hold narratif fort). Max 2-3s de silence intentionnel.

**Why:** Aziz a demandé de recommencer les scènes précisément à cause des silences — c'est la cause racine principale de la durée de session.

**How to apply:** Avant de locker un script, scanner chaque beat : `durationInFrames - durationFrames VO = X`. Si X > 90f (3s), soit on écrit du contenu VO supplémentaire, soit on réduit la fenêtre beat.

---

### 2. Timing visuel locké AVANT audio finalisé
Visuels étaient lockés avant que le script audio final soit arrêté. Beat2b (combler 9s de silence) a été ajouté après coup en urgence.

**Règle** : audio-first sans exception. Script VO complet + mesuré (ffprobe) AVANT de toucher au timing visuel.

**Why:** Ajouter de l'audio après coup crée des décalages en cascade (beat2b/beat3 chevauchement) difficiles à diagnostiquer.

**How to apply:** Workflow obligatoire : script → TTS → ffprobe toutes durées → timing.ts → visuels. Jamais l'inverse.

---

### 3. Chevauchement audio non vérifié avant render
Beat2b (f622→f778) chevauchait Beat3 VO (démarrait f750). Bug détectable par calcul simple avant render.

**Règle** : après tout ajout ou modification d'audio, vérifier explicitement :
```
pour chaque segment audio trié par startFrame :
  assert segment[i].startFrame >= segment[i-1].startFrame + segment[i-1].durationFrames
```

**How to apply:** Calculer et afficher le tableau de non-chevauchement dans timing.ts avant tout render. Prendre 2 minutes, économiser 30 minutes de debug.

---

### 4. Beat duration mal calculée (Beat5 redimensionné 2x)
Beat5 : 270f → 360f (VO débordait) → 420f (CTA coupé). Deux agrandissements sur le même beat.

**Règle** : `durationInFrames = durationFrames_VO + 30f_silence + 30f_fondu` — jamais estimer.

**How to apply:** Formule systématique dès que ffprobe donne la durée VO.

---

### 5. Audio musique en double instance (Beat5Final + composition principale)
Beat5Final avait son propre `<Audio music startFrom={0}>` qui redémarrait la musique.

**Règle** : la musique de fond se gère UNIQUEMENT au niveau de la composition principale (VraieTailleAfrique.tsx). Les composants Beat* ne montent jamais d'audio musique — seulement la VO qui leur est propre.

**How to apply:** Avant tout render, grep `music` dans tous les composants Beat*. Si trouvé = bug.

---

## Ce qui a bien fonctionné

- Forced alignment ElevenLabs V3 → sync VO/visuel précis au frame près (USA f163, Chine f257, etc.)
- d3-geo Equal Earth + clipPath Africa → visuellement impeccable, zéro approximation géo
- Beat4Mercator SVG pur → fluide, lisible, narrativement fort
- Karaoke SubtitlesVraieTaille → Anton + highlight or + backdrop blur = lisible sur toutes les scènes
- Pattern Beat2b (combler silence avec VO factuelles courtes) → réutilisable sur tout épisode avec gap
