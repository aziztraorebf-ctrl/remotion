# SFX Index — Bibliothèque partagée

> Source de vérité unique. Lire AVANT de chercher ou créer un SFX.
> Tous les fichiers sont dans `public/_shared/sfx/`.
> Usage Remotion : `staticFile("_shared/sfx/<categorie>/<fichier>.mp3")`

---

## ⛔ FICHIERS CORROMPUS — NE PAS UTILISER

> Réflexe : vérifier la DURÉE avant usage (`ffprobe`). Un SFX UI/impact propre fait < 2s.
> Durée anormale (>5s) = fichier contaminé, souvent une VOIX au lieu d'un son pur.

| Fichier | Problème | Remplacer par |
|---------|----------|---------------|
| `ui/reveal.mp3` (neutralisé → `.CORROMPU-voix-fantome`) | **18.4s — VOIX masculine fantôme** ("et voici la vérité qu'on ne te dira jamais"), jouait par-dessus la narration. Détecté 2026-06-03 (A3 Maroc) + signalé session antérieure. | `ui/node-appear.mp3` (0.48s) ou `camera/sfx-map-ping.mp3` |

---

## camera/ — Mouvements de caméra Mapbox

| Fichier | Description | Durée | Utilisé dans |
|---------|-------------|-------|--------------|
| `sfx-swoosh-pullback.mp3` | Whoosh Pull Back Reveal (dezoom) | ~1s | Or Africain, Sénégal Beat10 |
| `sfx-swoosh-zoomin.mp3` | Whoosh Zoom In / Dolly In | ~1s | Or Africain |
| `sfx-map-ping.mp3` | Ping / pop apparition d'un point sur carte | ~0.5s | Or Africain |
| `sfx-whip-pan-1.mp3` | Whip pan / SWITCH de pays (swipe air punchy) — SEUL valide (ElevenLabs) | 0.68s | Petrole Patience (2026-06-03) |

**Règle** : `sfx-swoosh-pullback` = fin du dezoom. `sfx-swoosh-zoomin` = début d'un VRAI zoom. `sfx-whip-pan-1` = CHANGEMENT de pays/lieu (whip pan latéral). Ne PAS confondre zoom et switch. (Variations 2 et 3 supprimées 2026-06-03 : ElevenLabs avait rendu des sons de laser/ping au lieu de whoosh.)

---

## ui/ — Interfaces, textes, reveals

| Fichier | Description | Durée | Utilisé dans |
|---------|-------------|-------|--------------|
| `whoosh.mp3` | Whoosh court, transition texte/slide | ~0.4s | Data-viz explainer |
| `reveal.mp3` | ⛔ NE PAS UTILISER — fichier de 18.4s (contient une voix/nappe longue, PAS un reveal court). Utiliser `plate-pop.mp3` ou `node-appear.mp3`. | 18.4s | (banni 2026-06-03, voix fantôme Petrole Patience) |
| `stamp-dossier.mp3` | Tampon / claquement sec sur document | ~0.3s | Niger Uranium |
| `node-appear.mp3` | Apparition noeud réseau / bubble | ~0.4s | Niger Uranium |
| `blip-bubble.mp3` | Blip léger, apparition donnée | ~0.3s | Hannibal |

---

## impact/ — Impacts, tensions, drama

| Fichier | Description | Durée | Utilisé dans |
|---------|-------------|-------|--------------|
| `impact.mp3` | Impact sourd, choc visuel | ~0.5s | Data-viz explainer, Brutalist Finance |
| `tension-pulse.mp3` | Pulsation tension, beat lourd | ~1s | Niger Uranium |
| `../sfx-clash-impact.mp3` | Choc de 2 armées, armes/boucliers qui s'entrechoquent (ElevenLabs 2026-06-04) | 1.36s | Atlas confrontation/armées (face-à-face, choc des lignes) |
| `../sfx-army-charge.mp3` | Cri de guerre + ruée de soldats à la charge (ElevenLabs 2026-06-04) | 2.0s | Atlas armées (déclenchement de la charge) |

---

## warmap/ — War-Map (Sahel + réutilisables, ElevenLabs 2026-06-07)

| Fichier | Description | Durée | Utilisé dans |
|---------|-------------|-------|--------------|
| `warmap/boom-coup.mp3` | Impact sub-bass sourd, grave, sec — coup d'état / événement lourd | 1.2s | ⭐ Sahel Acte 1 hook (×3 allumage pays) |
| `warmap/cedeao-snap.mp3` | Snap électrique + silence, néon qui grille — rupture institutionnelle | 1.0s | ⭐ Sahel Acte 1 hook (mort anneau CEDEAO) |
| `warmap/liptako-gong.mp3` | Gong grave + résonance longue — convergence de forces | 2.5s | ⭐ Sahel Acte 1 hook (impact convergence Liptako) |
| `warmap/arrow-whoosh.mp3` | Whoosh bas et sec, mouvement sur carte | 0.6s | Banque — flèches tactiques (Act 2-3) |
| `warmap/tension-drone.mp3` | Drone grave continu, ambiance archives, seamless | 8s | Banque — fond de tension (à tester vs musique) |
| `warmap/ink-spread.mp3` | Encre qui s'étale sur le papier, texture organique | 1.5s | Banque — apparition zones (ink-bleed JNIM/EIGS) |

**Note mix war-map** : avec musique de fond (Soudan) + voix, garder MAX 3 SFX ponctuels par acte pour éviter la concurrence sonore. Le drone est à tester (peut être redondant avec la musique).

---

## data/ — Compteurs, statistiques, graphiques

| Fichier | Description | Durée | Utilisé dans |
|---------|-------------|-------|--------------|
| `counter-tick.mp3` | Tick compteur numérique | ~0.1s | Data-viz explainer |
| `tick-counter.mp3` | Tick compteur alternatif (plus sec) | ~0.1s | Niger Uranium |
| `stat-tick.mp3` | Tick stat, plus doux | ~0.1s | Hannibal |

---

## SFX épisode-spécifiques (non partagés)

Ces SFX sont narratifs/thématiques — ils restent dans leur dossier épisode.

| Dossier | Contenu |
|---------|---------|
| `public/audio/sonjata-papercraft/sfx/` | Drums de guerre, feu, arc |
| `public/audio/peste-pixel/sfx/` | Galère, cloche, catapulte |
| `public/audio/atlas-empire-ghana/sfx/` | Whoosh secret, impact 1076, cri de guerre |
| `public/atlas/peste-1347/audio/sfx-*.mp3` | Marker, inkdraw, thud |
| `public/audio/silhouette-questions/sfx-*.mp3` | Contamination, éveil, foule |

---

## Convention de nommage pour nouveaux SFX

```
camera/   sfx-[mouvement]-[qualificatif].mp3   ex: sfx-swoosh-crane-up.mp3
ui/       [action]-[element].mp3                ex: slash-appear.mp3
impact/   [type]-[intensite].mp3                ex: thud-heavy.mp3
data/     [element]-[action].mp3                ex: bar-grow.mp3
ambiance/ [lieu]-[etat].mp3                     ex: ocean-calm.mp3
```

## SFX manquants identifiés (backlog)

- `camera/sfx-whip-pan.mp3` — transition rapide gauche/droite (Beat13 Yakaar)
- `camera/sfx-crane-up.mp3` — montée lente de caméra (fin Beat10)
- `atlas/sfx-gold-coins-drop.mp3` — chute/dépôt d'un sac de pièces d'or (Atlas Silent Barter / drop d'objet, beat AtlasV2SaharanDrop). Demandé 2026-06-03 : pas de SFX coins dans la sonothèque. `sfx-footsteps.mp3` couvre déjà la marche.

---

## Guide assemblage — Sénégal Pétrole & Gaz (LIRE avant la session d'assemblage)

### SFX recommandés par beat

| Beat | Moment | SFX recommandé | Chemin |
|------|--------|----------------|--------|
| Beat14 Phase A | Apparition plaque FONSIS (f240) | `plate-pop.mp3` | `_shared/sfx/ui/plate-pop.mp3` |
| Beat14 Phase A | Apparition plaque ITIE (f330) | `plate-pop.mp3` | idem |
| Beat14 Phase A | Apparition plaque LOI (f420) | `plate-pop.mp3` | idem |
| Beat14 Phase B | Slash rouge sur FONSIS | `slash-red.mp3` | `_shared/sfx/ui/slash-red.mp3` |
| Beat14 Phase B | Slash rouge sur ITIE | `slash-red.mp3` | idem |
| Beat14 Phase B | Slash rouge sur LOI | `slash-red.mp3` | idem |
| Beat10 | Pull Back Reveal fin dezoom | `sfx-swoosh-pullback.mp3` | `_shared/sfx/camera/` |
| Beat10 | Ping apparition point pays | `sfx-map-ping.mp3` | `_shared/sfx/camera/` |
| Beat13 | Zoom Yakaar / Sangomar | `sfx-swoosh-zoomin.mp3` | `_shared/sfx/camera/` |

### Usage Remotion — PATTERN `<Sequence>` OBLIGATOIRE (NON-NEGOTIABLE)
```tsx
<Sequence from={F_PING} durationInFrames={20}>
  <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.50} />
</Sequence>
```
⛔ **NE JAMAIS utiliser `{frame === X && <Audio/>}` ni `{frame >= X && frame < X+15 && <Audio/>}`** — un `<Audio>` monté une seule frame (ou conditionnellement) NE DÉMARRE PAS en render (son inaudible). Bug confirmé 2026-06-03 sur Beat3 Maroc (Aziz n'entendait aucun SFX). Toujours `<Sequence from={F} durationInFrames={20-30}>` autour du `<Audio>` (pattern Or Africain Beat4). Voir `memory/feedbacks/feedback_sfx-sequence-et-drapeaux-reels.md`.

### ⛔ VOLUME SFX — PLANCHER 0.50 (RÉVISÉ 2026-06-03, NON-NEGOTIABLE)
**Tous les SFX (ping, tick, snap, plate-pop, impact, whoosh, swoosh, drone) : 0.50 minimum, JAMAIS en dessous.** Peut monter à 0.60 sur les gros moments cinématiques (swoosh caméra descend/monte, impact). Musique fond 0.12-0.15 (baisser si elle masque). L'ancienne valeur 0.35 / fourchette 0.25-0.35 était trop basse → SFX inaudibles, Aziz devait monter le son. Source de vérité : `memory/doctrines/DOCTRINE-SOUVERAIN.md` section 6.

### 🎯 QUEL SFX selon le mouvement caméra (règle 2026-06-03)
**Un SFX doit correspondre à un ÉVÉNEMENT VISUEL RÉEL. Pas de SFX "par habitude".**
- `sfx-swoosh-zoomin` → SEULEMENT si vrai zoom-in caméra. PAS sur carte fixe (ex: SweepReveal) ni beat démarrant à altitude fixe.
- `sfx-swoosh-pullback` → SEULEMENT si pull back RAPIDE et marqué. PAS sur dézoom lent/continu (imperceptible → SFX retiré).
- `sfx-map-ping` → apparition d'un point/pays/dot (événement ponctuel net). Toujours OK.
- `plate-pop` → apparition d'une plaque/label. `stat-tick` → slam d'un chiffre. `impact` → choc visuel fort.
- Principe : si le spectateur ne "voit" pas l'événement, pas de SFX. Cas Maroc Beat0/1 : swoosh retirés car carte fixe / dézoom lent.

### Ordre d'assemblage ffmpeg (session suivante)
```bash
ffmpeg -i senegal-acte1-FINAL.mp4 \
       -i acte2-FINAL.mp4 \
       -i beat10-FINAL.mp4 \
       -i beat11-FINAL.mp4 \
       -i beat12-FINAL.mp4 \
       -i beat13-FINAL.mp4 \
       -i beat14-FINAL.mp4 \
       -filter_complex "[0][1][2][3][4][5][6]concat=n=7:v=1:a=1" \
       out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4
```
Tous les fichiers source : `out/episodes/senegal-petrole-gaz/`

---

## Générer un SFX sur mesure (quand la banque n'a pas le son)

Si aucun fichier ci-dessus ne couvre le son voulu, NE PAS improviser un son approximatif ni bricoler à
partir d'un fichier proche : générer un SFX dédié via ElevenLabs Sound Effects.
- Outil : `scripts/generate-sfx-elevenlabs.py` (endpoint `sound-generation`, prompt en anglais,
  `duration_seconds` 0.5-30). API + prompts qui marchent : `memory/tools/elevenlabs.md` (§ Sound Effects API).
- Prouvé (Short Sénégal D3, 2026-07-17) : `ui/vault-lock.mp3` (verrou de coffre) et `ui/typewriter.mp3`
  (machine à écrire) générés sur mesure, absents de la banque.
- Après génération : vérifier la DURÉE (`ffprobe`) — un SFX UI/impact propre fait < 2s — puis ranger dans
  `_shared/sfx/<catégorie>/`, l'ajouter au tableau ci-dessus, et respecter le plancher volume 0.50 (règle projet).
