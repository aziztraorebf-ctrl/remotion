# STARTER PROMPT — Sénégal Pétrole & Gaz — Assemblage final + corrections

> Coller ce fichier en début de session.

---

## État au 2026-05-25

**Tous les beats VALIDÉS et promus en FINAL :**

| Fichier | Durée | Contenu |
|---------|-------|---------|
| `beat0-FINAL.mp4` | 36.5s | Accroche — AVRIL 2026 + Yakaar + GOUVERNEMENT DISSOUS |
| `senegal-acte1-FINAL.mp4` | 42.4s | Acte 1 — Sangomar, première extraction |
| `acte2-FINAL.mp4` | 88.4s | Acte 2 — Mapbox continu + donut 60% |
| `beat10-FINAL.mp4` | 61.2s | Acte 3 — Comparaison Norvège/Congo/Botswana |
| `beat11-FINAL.mp4` | 45.0s | Acte 3 — Mécanisme 1 : le contrat |
| `beat12-FINAL.mp4` | 54.0s | Acte 3 — Mécanisme 2 : piège Norvège |
| `beat13-FINAL.mp4` | 49.0s | Acte 3 — Mécanisme 3 : Yakaar/coulisses |
| `beat14-FINAL.mp4` | 77.0s | Acte 4 — L'implication finale |
| **TOTAL** | **453.5s = 7min 34s** | |

Tous dans `out/episodes/senegal-petrole-gaz/`.

---

## Tâches de cette session (dans l'ordre)

### 1. CORRECTION PRIORITAIRE — Dette 70% → 132% (Beat11) ⚠️

**C'est la seule correction qui nécessite un re-render avant assemblage.**

- Le script audio dit "soixante-dix pour cent" — chiffre officiel actuel : **132%**
- Plan :
  1. Whisper force-alignment sur `narration-v1-clean.mp3` pour localiser exactement le segment "soixante-dix pour cent"
  2. Re-générer uniquement cette phrase avec ElevenLabs (voix `z3gESu49naEZW8Af2Upm`) : *"cent trente-deux pour cent"*
  3. Splicer dans l'audio via ffmpeg
  4. Modifier Beat11 visuellement : calebasse niveau 132% (débordement) + animation gouttes qui tombent + chiffre "132%" affiché
  5. Re-render Beat11 uniquement → promouvoir en FINAL

**Référence complète** : `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md` section FC-2.

### 2. SFX — Effets sonores

Backlog complet dans `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md` sections "Beat0" et "Acte 2".

- Chercher d'abord dans `public/_shared/sfx/`
- Sinon générer via ElevenLabs Sound Effects ou freesound.org CC0
- Priorité Beat0 : son flip mécanique (f30) + impact tampon SÉNÉGAL (f750) + vibration GOUVERNEMENT DISSOUS (f870)
- Priorité Acte 2 : ping Sangomar, whoosh Pull Back Reveal, whoosh Whip Pan, ticks donut Beat9

### 3. Assemblage final

Ordre de concaténation ffmpeg :
```
beat0 → acte1 → acte2 → beat10 → beat11 → beat12 → beat13 → beat14
```

Commande base :
```bash
# Créer /tmp/senegal-concat.txt avec les 8 fichiers
# Mix : voix 1.0 + musique 0.18 + fade-out 6s fin
# Output : out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4
```

**Vérifier avant assemblage** : continuité audio entre beats (pas de cut brutal), fade musique cohérent en début/fin de chaque beat.

### 4. Corrections mineures non-bloquantes (overlay labels)

- FC-1 : label "100 000 b/j officiel Woodside" sous BigStat Acte 1 (priorité basse)
- FC-3 : label "2 000 milliards $ en 2026" Beat10 Norvège (priorité basse)
- FC-4 : Beat0 distingue déjà les deux dates (déjà corrigé dans la version finale)

---

## Backlog post-assemblage

**Short YouTube 90s** — structure complète documentée dans `CORRECTIONS-MINEURES.md` section "Backlog Short YouTube 90s". 80% du travail déjà fait. À attaquer après publication de la version longue.

---

## Références techniques

- Voix ElevenLabs : `z3gESu49naEZW8Af2Upm` (GéoAfrique V2)
- Audio narration : `public/souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3`
- Audio musique : `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3`
- Render Mapbox : `./scripts/render-mapbox.sh`
- Beat11 source : `src/projects/souverain/senegal-petrole-gaz/beats/Beat11.tsx`
- Composant LaCalebasse : `src/projects/_shared/components/layouts/LaCalebasse.tsx`
- DOCTRINE SOUVERAIN : `memory/DOCTRINE-SOUVERAIN.md`
