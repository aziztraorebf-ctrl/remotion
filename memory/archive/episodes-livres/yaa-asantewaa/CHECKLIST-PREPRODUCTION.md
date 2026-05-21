---
name: yaa-asantewaa-preproduction-checklist
description: Checklist de pré-production Yaa Asantewaa — Atlas pur. Source de vérité unique pour cette session et les suivantes. Mettre à jour en temps réel.
metadata:
  type: project
---

# Checklist Pré-production — Yaa Asantewaa (Atlas pur)

> **RÈGLE D'OR** : cette checklist est la source de vérité de la production.
> Claude la relit au début de chaque session. Aziz peut demander "où en sommes-nous ?" à tout moment.
> Chaque case cochée = décision irréversible, documentée ici.
> Dernière mise à jour : 2026-05-15

---

## PHASE 0 — Cadrage sujet

- [x] Format confirmé : **Atlas pur** (carte 2D Mercator + personnages PixelLab, pas Souverain)
- [x] Sujet précis verrouillé (angle, période, arc narratif)
- [x] Durée cible définie : **60-90s Short Atlas** (format "short long" — visuel first, carte oblige)
- [x] Concurrence vérifiée (yt-dlp) — zéro vidéo française récente sur l'angle "Golden Stool jamais remis". Anglais : Drunk History 54K, docs 100K+. Créneau français vide.
- [x] Signal chaleur éditorial vérifié (Last30Days) — MEDIUM-LOW global. Book deal HarperCollins annoncé 2026-05-14 = pic de visibilité à venir. Timing favorable.
- [x] Décision documentée : angle retenu + pourquoi

---

## PHASE 1 — Script

- [ ] Fact-sheet produite (personnages, dates, lieux, chiffres vérifiables)
- [ ] Fact-check pré-écriture JSON (`yaa-asantewaa-factcheck.json`)
- [ ] Script V1 écrit selon `script-atlas-v1.md` :
  - [ ] 6 segments : Hook / Setup géo / Fait 1 / Fait 2 / Comparaison / Punchline
  - [ ] Règle "Tu" invitatif — zéro "tu ne savais pas / on t'a caché"
  - [ ] 3-5 pivots Atlas injectés
  - [ ] 7 beats Cesar appliqués
  - [ ] Densité 2.0-2.4 mots/s vérifiée
  - [ ] Max 12 stats pour la durée cible
- [ ] Critique proactive Claude faite (gaps, sur-densité, climax placement)
- [ ] Fact-check post-brouillon (sources primaires pour chaque chiffre)
- [ ] Scan TTS français (zéro "é/ée" fin de groupe, zéro "ont+voyelle", nombres en lettres)
- [ ] **Script LOCKED par Aziz**

---

## PHASE 2 — Audio

- [ ] TTS ElevenLabs généré (voix `z3gESu49naEZW8Af2Upm`, `eleven_multilingual_v2`)
- [ ] Settings : stability 0.5, similarity 0.75, style 0.3
- [ ] Durée mesurée via ffprobe → frames @30fps calculés
- [ ] Forced Alignment généré (ElevenLabs word-level — PAS Whisper seul)
- [ ] SFX 3 standards générés :
  - [ ] B — impact ville (marker pin) : vol 0.6, 3 frames AVANT le mot
  - [ ] C — ink-draw (caravane/route) : vol 0.85, sync début animation
  - [ ] D — cartouche stat thud : vol 1.5, 3 frames AVANT le mot
- [ ] Musique Minimax générée (3 variantes — style Ashanti/Akan recommandé)
- [ ] Volume musique : 0.04, fade 2s in/out
- [ ] **Aziz choisit la variante musique**

---

## PHASE 3 — Carte & Géographie

- [ ] Carte historique Ghana/territoire Ashanti 1900 identifiée
  - Source candidates : aourednik GitHub (world_1900.geojson) ou Natural Earth 50m
- [ ] Coordonnées lon/lat vérifiées :
  - [ ] Kumasi (capitale Ashanti)
  - [ ] Accra (capitale coloniale britannique)
  - [ ] Autres POI selon script
- [ ] Style Mapbox adapté (palette Atlas Parchemin Mande ou variante Ashanti)
- [ ] Polygones GeoJSON extraits si fill pays animé (d3-geo, jamais SVG approximatif)
- [ ] Blueprints Atlas identifiés beat par beat (parmi les 8 disponibles dans `src/projects/atlas/_blueprints/`)

---

## PHASE 4 — PixelLab Assets (étape dédiée Atlas pur)

> Cette phase est **bloquante** — le Visual Plan (Phase 5) dépend de ce qu'on a.

### Characters
- [ ] Character brief écrit (Yaa + chefs Ashanti + soldats britanniques)
- [ ] Yaa Asantewaa générée (face + side views, palette Akan)
- [ ] Chefs Ashanti générés (au moins 1 archétype)
- [ ] Soldat britannique généré si bataille dans le script
- [ ] Vérification PIXELLAB-MASTER-INDEX.md — réutiliser si déjà disponible

### Objects / Props
- [ ] Golden Stool (Trône d'Or Ashanti) — objet PixelLab
- [ ] Autres props selon script (lance, bouclier, etc.)

### Animations
- [ ] Walk cycle Yaa (directions : right, left)
- [ ] Walk cycle chefs si nécessaire
- [ ] Autres animations selon storyboard (idle, combat, discours)

### Validation
- [ ] Review visuelle Claude AVANT présentation Aziz
- [ ] **Aziz valide les characters**

---

## PHASE 5 — Storyboard & Visual Plan

- [ ] Storyboard beat-par-beat écrit (en s'appuyant sur les assets PixelLab disponibles)
- [ ] Pour chaque beat : 5 questions Atlas pur répondues DANS CET ORDRE :
  1. Comment ça se passe sur la carte ?
  2. Quels personnages PixelLab portent l'action ?
  3. Quel mouvement caméra met en scène ?
  4. Quel objet PixelLab est l'enjeu ?
  5. Quelle voix-off accompagne ?
  — *et seulement après* : quel insert est strictement nécessaire ?
- [ ] Ratio carte/inserts vérifié : carte 80-90% temps écran
- [ ] Max 1-2 inserts plein écran par beat
- [ ] Blueprints Atlas assignés par beat
- [ ] **Aziz approuve le Visual Plan**

---

## PHASE 6 — Timing

- [ ] `timing.ts` créé avec segments ElevenLabs word-level
- [ ] TOTAL_FRAMES calculé (durée × 30)
- [ ] Mots-pivots identifiés pour chaque beat
- [ ] Validations PASS : R1 (cohérence totale), R2 (zéro gap), R3 (VO dans fenêtre), R4 (beats >= 30f)
- [ ] **timing.ts LOCKED**

---

## PHASE 7 — Code Remotion (beat par beat)

- [ ] `ATLAS-COMPOSANTS.md` lu AVANT d'écrire une ligne
- [ ] ASSETS-INDEX.md consulté (composants existants)
- [ ] Entry point `src/index.ts` mis à jour
- [ ] Carte = SCÈNE, pas fond (rule Atlas pur)
- [ ] Zéro inline styles couleurs/typo — Tailwind tokens
- [ ] Anti-patterns INTERDITS : `CSS transition:`, `setTimeout`, `@keyframes`, `requestAnimationFrame`
- [ ] Beat 1 codé + mini-render validé Aziz
- [ ] Beat 2 codé + mini-render validé
- [ ] Beat 3 codé + mini-render validé
- [ ] Beat 4 codé + mini-render validé
- [ ] Beat 5+ selon script
- [ ] Composition complète assemblée

---

## PHASE 8 — Quality Review

- [ ] Downscale frames (`./scripts/downscale-for-review.sh`)
- [ ] Claude review AVANT Kimi
- [ ] Kimi review (`scripts/review_with_kimi.py`)
- [ ] Verdict : APPROVE / MINOR FIX / RE-EVALUATE
- [ ] Close série Héros Oubliés codé (split vertical : gauche = Yaa, droite = à définir en Phase 1)

---

## PHASE 9 — Render & Publication

- [ ] Render final via `./scripts/render-mapbox.sh` (WebGL obligatoire)
- [ ] Promu → `out/PRET-PUBLICATION/yaa-asantewaa-FINAL.mp4`
- [ ] Wip/versions purgés
- [ ] Publication Postiz

---

## État actuel

```
Phase 0  [x] COMPLETE — 2026-05-15
Phase 1  [ ] EN PAUSE — reprise après Peste 1347
Phase 2  [ ] Non démarré
Phase 3  [ ] Non démarré
Phase 4  [ ] Non démarré
Phase 5  [ ] Non démarré
Phase 6  [ ] Non démarré
Phase 7  [ ] Non démarré
Phase 8  [ ] Non démarré
Phase 9  [ ] Non démarré
```

---

## Décisions lockées (mise à jour au fil des sessions)

| Date | Décision | Raison |
|------|----------|--------|
| 2026-05-15 | Format : Atlas pur | Héros mobile + carte historique + objet sacré + voyage géographique — 4/4 critères |
| 2026-05-15 | Pas de Seedance | Atlas pur = PixelLab + carte 2D Mercator uniquement |
| 2026-05-15 | PixelLab = Phase 4 dédiée | Characters Yaa/chefs/soldats + Golden Stool non existants — bloquant pour Visual Plan |
| 2026-05-15 | Durée : 60-90s Short Atlas | Format "short long" — visuel first, carte oblige. Long format écarté (validation solide requise, trop de travail pour l'instant) |
| 2026-05-15 | Angle : objet + renversement | Hook = le Golden Stool jamais remis. Fil conducteur = l'objet que l'empire n'a jamais eu. Yaa = celle qui le défend. Angle universel (Tokyo/Paris/Montréal) — même ressort que Jeanne d'Arc, Boudicca |

---

## Références rapides

- Workflow Atlas complet : `memory/templates/atlas-template-v1.md`
- Script Atlas : `memory/templates/script-atlas-v1.md`
- Checklist générique Atlas : `memory/checklists/ATLAS.md`
- Composants Atlas : `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`
- Blueprints disponibles : `src/projects/atlas/_blueprints/` (8 blueprints)
- PixelLab master index : `PIXELLAB-MASTER-INDEX.md`
- Philosophie Atlas pur (Section 9) : `memory/rules-atlas-production.md`
- Exemple canon beat discours Yaa : `memory/rules-atlas-production.md` Section 9
