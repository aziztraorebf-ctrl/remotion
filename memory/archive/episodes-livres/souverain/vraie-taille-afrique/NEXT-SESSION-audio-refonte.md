---
name: Vraie Taille Afrique — Refonte audio prochaine session
description: Script et audio a jeter, refaire depuis zero. Graphismes locks.
type: project
---

## Etat actuel
- Graphismes : LOCKS (Beat1 Mapbox, Beat2 Equal Earth silhouettes, Beat3 compteur, Beat4 Groenland, Beat5 revelation+CTA)
- Audio : A REFAIRE INTEGRALEMENT — script + TTS
- Episode complet rendu : `out/episodes/vraie-taille-afrique/wip/episode-complet_v1.mp4` (67s, reference visuelle)

## Problemes identifies (feedback Aziz)
1. Script trop descriptif — raconte ce qu on voit au lieu de provoquer une emotion
2. Voix manque de punch — trop plate, pas assez expressive
3. Transition Mercator -> Equal Earth jamais expliquee vocalement — spectateur perdu
4. Silences mal places — hold visuel contours pays (Beat2 fin) se passe dans silence total
5. "30,3M km²" arrive sans setup vocal suffisant
6. Decalage voix / graphismes signale

## Plan session suivante

### 1. Nouveau script
- Registre : interpeller, pas decrire
- Beat 1 (5s) : accroche choc — "Cette carte, tu la connais. Mais elle te ment."
- Beat 2 (20s) : revelation progressive — expliquer Equal Earth + chaque pays qui rentre
- Beat 3 (8s) : punch chiffre — "Trente virgule trois millions de kilometres carres."
- Beat 4 (25s) : Groenland demo — voix guide la comprehension visuelle
  PHRASE LOCKEE : "Et pourtant, depuis 1569, cette carte concue pour les marins est dans tous les manuels scolaires du monde."
- Beat 5 (9s) : emotionnel — "Maintenant tu sais." + CTA
- Regle : la voix parle SUR chaque moment visuel fort, pas a cote

### 2. Parametres ElevenLabs a tester
- stability : 0.30 (au lieu de 0.50) — plus de variation emotionnelle
- similarity_boost : 0.85
- Voix : z3gESu49naEZW8Af2Upm (Narratrice GeoAfrique, garder)

### 3. Workflow
- Ecrire script -> valider avec Aziz -> TTS -> ffprobe durees -> ajuster timings beats -> render assembly
- Audio-first obligatoire
- Beat5 a son propre audio integre (narration-beat5-complet.mp3 + music-A-revelation.mp3) — garder ou remplacer selon nouveau script

### 4. Fichiers audio existants (a remplacer)
- `public/souverain/vraie-taille-afrique/audio/narration-beat1.mp3`
- `public/souverain/vraie-taille-afrique/audio/narration-beat2.mp3`
- `public/souverain/vraie-taille-afrique/audio/narration-beat3.mp3`
- `public/souverain/vraie-taille-afrique/audio/narration-beat4.mp3` / `narration-beat4-v2.mp3`
- `public/souverain/vraie-taille-afrique/audio/narration-beat5-complet.mp3`
- `public/audio/vraie-taille-afrique/cta-v1.mp3`

**Why:** Script actuel trop lent, silences mal places, transition Mercator/Equal Earth inexpliquee.
**How to apply:** En debut de session, lire ce fichier + regarder episode-complet_v1.mp4 comme reference visuelle avant d ecrire le nouveau script.
