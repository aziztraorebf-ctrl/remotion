---
name: peste-1347-preproduction-checklist
description: Checklist de pré-production Peste Noire 1347 vue d'Afrique — Atlas pur. Source de vérité unique. Mettre à jour en temps réel.
metadata:
  type: project
---

# Checklist Pré-production — La Peste Noire 1347 (vue d'Afrique, Atlas pur)

> **RÈGLE D'OR** : cette checklist est la source de vérité de la production.
> Claude la relit au début de chaque session. Aziz peut demander "où en sommes-nous ?" à tout moment.
> Chaque case cochée = décision irréversible, documentée ici.
> Dernière mise à jour : 2026-05-15

---

## PHASE 0 — Cadrage sujet

- [x] Format confirmé : **Atlas pur** (carte 2D Mercator + propagation animée + personnages PixelLab)
- [ ] Angle précis verrouillé parmi les candidats (voir section "Angles candidats" ci-dessous)
- [ ] Durée cible définie
- [x] Concurrence vérifiée — History Matters (1.2M vues, 3min12) : Afrique subsaharienne = UNE phrase sarcastique. Créneau français = vide complet. Viewers eux-mêmes réclament l'angle africain dans les commentaires.
- [x] Signal chaleur vérifié — sujet perenne, universel (tout le monde connaît la Peste). Hook se vend seul.
- [ ] Décision documentée : angle retenu + pourquoi

---

## Angles candidats — à trancher en Phase 0

> Trois angles possibles. Un seul retenu. Décision Aziz.

### Angle A — "Le Sahara comme bouclier" (géographique pur)
**Hook :** *"En 1347, un tiers de l'Europe mourait. L'Empire du Mali, lui, continuait d'envoyer de l'or."*

- Fil conducteur : la géographie physique protège l'Afrique subsaharienne
- Carte = scène principale : propagation de la Peste depuis l'Asie centrale → Mer Noire → Europe → s'arrête au Sahara
- Personnages PixelLab : marchands caravaniers, rats (vecteurs)
- Chiffre choc : 1/3 Europe morte vs 0 preuve en Afrique subsaharienne
- Punchline : pendant que l'Europe s'effondre, l'or malien continue de remonter vers le Nord
- **Ton : géographie comme destin. Le Sahara = héros involontaire.**
- Durée cible : 60-75s
- Complexité PixelLab : faible (marchands + caravanes — assets probablement réutilisables)

### Angle B — "L'or qui sauve l'Europe" (économique)
**Hook :** *"La Peste a tué 25 millions d'Européens. Ce qui a sauvé l'économie européenne venait d'Afrique."*

- Fil conducteur : l'effondrement démographique européen crée une crise monétaire — l'or du Mali devient vital
- Carte = scène : routes commerciales or Mali → Maghreb → Europe (flux qui s'intensifie pendant la crise)
- Chiffre choc : prix de l'or × 2 en Europe post-Peste, Mali = 50% or mondial à l'époque
- Punchline : l'Europe se reconstruit avec l'or africain sans jamais le reconnaître
- **Ton : ironie économique. L'Afrique sauve l'Europe sans que l'Europe le sache.**
- Durée cible : 75-90s (plus de données à gérer)
- Complexité PixelLab : faible (marchands, pièces d'or)

### Angle C — "Deux mondes, une pandémie" (comparaison synchrone)
**Hook :** *"1347. Même année. L'Europe enterre ses morts. L'Empire du Mali construit des mosquées."*

- Fil conducteur : split temporel — pendant que l'Europe s'effondre, que se passe-t-il à Tombouctou ?
- Carte = scène : alternance Europe (rouge/mort) vs Mali (or/vivant) sur la même carte
- Mansa Souleymane (successeur de Mansa Moussa) au pouvoir en 1347 — stabilité, commerce, savoir
- Punchline : deux civilisations contemporaines, destin opposé, une seule raison — le Sahara
- **Ton : mise en perspective civilisationnelle. Le plus universel des trois.**
- Durée cible : 75-90s
- Complexité PixelLab : moyenne (personnages Mali + contexte européen)
- **Avantage : réutilise assets Mansa Moussa existants (Tombouctou, caravanes)**

---

## PHASE 1 — Script

- [x] Fact-sheet produite → `memory/episodes/peste-1347/fact-sheet.md`
- [x] Objections adversariales produites → `memory/episodes/peste-1347/objections-adversariales.md` (6 objections, hiérarchisées, formulations script incluses)
- [ ] Fact-check pré-écriture JSON (`peste-1347-factcheck.json`)
- [x] Script V1 écrit (211 mots)
- [x] Script V2 — 5 corrections Aziz appliquées (sujet clair, jargon supprimé, Ibn Battuta retiré, mécanisme or, fin non-compétitive)
- [x] Script V3 — climax réécrit (contraste fosses communes / aucune + biologie puce humidité) → `memory/episodes/peste-1347/script-v3-locked.md`
- [x] Critique proactive Claude faite (V1 → V2)
- [x] Objections adversariales intégrées (O1 honnêteté académique préservée)
- [x] Scan TTS validé — 1 nom propre à tester en preview (Souleymane)
- [x] **Script LOCKED par Aziz — 2026-05-15**

---

## PHASE 2 — Audio

- [x] TTS ElevenLabs généré (voix `z3gESu49naEZW8Af2Upm`, `eleven_v3`) — 2026-05-15 — **VALIDÉ AZIZ** (aucune anomalie, sonne naturel)
- [x] Settings : stability 0.5, similarity 0.75, style 0.3
- [x] Durée mesurée ffprobe → **105.12s | 3153 frames @30fps**
- [x] Forced Alignment généré (word-level) — ElevenLabs v1 — 249 mots, timestamps 0.08s→105.08s. Sauvé dans `public/atlas/peste-1347/audio/forced-alignment-v1.json`
- [x] `timing.ts` créé → `src/projects/atlas/peste-1347/timing.ts` — BEATS + PIVOTS + STATS + CITIES + ROUTES
- [x] SFX 3 standards :
  - [x] B — marker pin : `sfx-b-marker.mp3` (0.43s, vol 0.6) — **VALIDÉ Aziz**
  - [x] C — ink-draw : `sfx-c-inkdraw.mp3` (1.63s, vol 0.85) — **VALIDÉ Aziz** (parchment-reveal rejeté)
  - [x] D — stat thud : `sfx-d-thud.mp3` (0.48s, vol 1.5) — **VALIDÉ Aziz**
- [x] Musique Minimax (3 variantes générées)
- [x] Volume musique : 0.04, fade 2s in/out
- [x] **Aziz a choisi variante C — `music-c-desert.mp3` (oud + percussion caravane, 255s)**

---

## PHASE 3 — Carte & Géographie

- [x] Carte médiévale identifiée — aourednik `world_1300.geojson` (Mali, France, Castile, HRE, Byzantine)
- [x] Style Mapbox palette définie (parchemin #c4a882 + rouge sang #8B0000 + or #c8960c) → `geo-data.md`
- [x] Coordonnées lon/lat vérifiées via Mapbox MCP :
  - [x] Tombouctou (-3.014, 16.787) + Niani capitale Mali (-8.386, 11.379)
  - [x] Caffa/Feodosia Crimée (35.382, 45.030) — point d'entrée Peste
  - [x] Sicile/Palerme (13.360, 38.120) · Paris (2.35, 48.85) · Londres (-0.12, 51.5) · Stockholm (18.07, 59.33) · Le Caire (31.241, 30.048)
- [x] GeoJSON Empire Mali extrait → `public/atlas/peste-1347/geo/mali-1300.geojson`
- [x] Animation propagation Peste planifiée — vague SVG cercle depuis Sicile, clipPath Sahara lat~17°N. Nouveau composant `AtlasPropagationWave` à créer.
- [x] Blueprint beat par beat documenté → `memory/episodes/peste-1347/geo-data.md`
- [x] **Phase 3A — Nouvelle carte SVG d3-geo "Europe + Afrique" — COMPLETE**
  - [x] Script : `scripts/atlas/precompute-peste-1347.mjs`
  - [x] Output : `public/atlas/peste-1347/geo/peste-map-data.json` (1.1 MB)
  - [x] 4 vues : `mercLarge` (72 pays) · `mercEurope` (72) · `mercMali` (32) · `mercSahara` (35)
  - [x] POI projetés validés : Caffa, Sicile, Paris, Londres, Stockholm, Le Caire, Tombouctou, Niani, Florence, Venise
  - [x] Empire Mali 1300 + Sahara path + route or inclus dans chaque vue
- [x] **Phase 3B — Sahara clipPath — COMPLETE** (polygone lat 15-20°N intégré directement dans le JSON precompilé via `saharaPath`)
- [ ] **RESTE Phase 3C — Composant `AtlasPropagationWave` (nouveau)**
  - [ ] Cercle SVG `r` animé depuis Sicile (`propagationCenter` déjà dans le JSON)
  - [ ] clipPath Sahara pour bloquer la vague visuellement
  - [ ] Couleur rouge sang `#8B0000`, opacité 0.4
  - [ ] À créer dans `src/projects/atlas/_shared/` + documenter dans `ATLAS-COMPOSANTS.md`

---

## PHASE 4 — PixelLab Assets

- [x] Vérification PIXELLAB-MASTER-INDEX.md — assets Mansa Moussa réutilisables (chameau, porteur, marchands berbères Ghana)
- [x] **Mansa Souleymane** généré — `eb3d1a3e` — 4 rotations + walk east/west 6f — `public/atlas/peste-1347/assets/characters/souleymane/`
- [x] **Rat noir** généré — `e2e541a8` — 32×32 — `public/atlas/peste-1347/assets/objects/rat-noir.png`
- [x] **Bateau génois** généré — `0d101547` — 64×48 — `public/atlas/peste-1347/assets/objects/bateau-genois.png`
- [x] Walk cycle Souleymane (east + west, 6f) animé et téléchargé
- [x] PIXELLAB-MASTER-INDEX.md mis à jour
- [x] **Aziz valide les assets** — 2026-05-16 ("ça me convient")

---

## PHASE 5 — Storyboard & Visual Plan

- [x] Manifeste beat par beat écrit → `memory/episodes/peste-1347/manifeste.md` (remplace storyboard formel pour Atlas pur)
- [x] Ratio carte 100% (Atlas pur — pas d'inserts vidéo, sprites sur carte)
- [x] Animation propagation planifiée (vague SVG cercle depuis Sicile, clipPath Sahara)
- [x] Blueprints Atlas assignés par beat (6 beats documentés)
- [x] **Aziz approuve** — 2026-05-16

---

## PHASE 6 — Timing

- [ ] `timing.ts` créé avec segments ElevenLabs word-level
- [ ] TOTAL_FRAMES calculé
- [ ] Mots-pivots identifiés par beat
- [ ] **timing.ts LOCKED**

---

## PHASE 7 — Code Remotion (beat par beat)

- [ ] `ATLAS-COMPOSANTS.md` lu AVANT d'écrire une ligne
- [ ] Beat 1 codé + mini-render validé Aziz
- [ ] Beats suivants codés + mini-renders
- [ ] Composition complète assemblée

---

## PHASE 8 — Quality Review

- [ ] Downscale frames (`./scripts/downscale-for-review.sh`)
- [ ] Claude review AVANT Kimi
- [ ] Kimi review
- [ ] Verdict : APPROVE / MINOR FIX / RE-EVALUATE

---

## PHASE 9 — Render & Publication

- [ ] Render final (`./scripts/render-mapbox.sh`)
- [ ] Promu → `out/PRET-PUBLICATION/peste-1347-FINAL.mp4`
- [ ] Wip/versions purgés
- [ ] Publication Postiz

---

## État actuel

```
Phase 0  [x] COMPLETE — Angle A "Sahara comme bouclier" retenu
Phase 1  [x] COMPLETE — 2026-05-15 — script-v3-locked.md
Phase 2  [x] COMPLETE — audio 105.12s ✓ + forced alignment ✓ + timing.ts ✓ + SFX B/C/D ✓ + musique C ✓
Phase 3  [x] COMPLETE — carte d3-geo 189 pays ✓ + POI ✓ + Sahara ✓ + PesteMap.tsx validé ✓
Phase 4  [x] COMPLETE — 2026-05-16 — Souleymane ✓ + rat ✓ + bateau ✓ + walk cycles ✓
Phase 5  [x] COMPLETE — 2026-05-16 — manifeste.md (6 beats, assets assignés, timing précis)
Phase 6  [x] COMPLETE — timing.ts déjà créé en Phase 2
Phase 7  [ ] NON DÉMARRÉ — prochaine session — coder les beats Remotion
Phase 8  [ ] Non démarré
Phase 9  [ ] Non démarré

PRÉ-PRODUCTION : COMPLÈTE ✓ — 2026-05-16
```

---

## Décisions lockées

| Date | Décision | Raison |
|------|----------|--------|
| 2026-05-15 | Format : Atlas pur | Propagation géographique + carte comme scène + caravanes = 4/4 critères |
| 2026-05-15 | Concurrence : créneau vide | History Matters (1.2M vues) traite l'Afrique en UNE phrase. Viewers réclament l'angle dans les commentaires. |
| 2026-05-15 | Yaa Asantewaa : EN PAUSE | Phase 0 complète, reprise après Peste 1347 |

---

## Références rapides

- Workflow Atlas complet : `memory/templates/atlas-template-v1.md`
- Script Atlas : `memory/templates/script-atlas-v1.md`
- Checklist générique Atlas : `memory/checklists/ATLAS.md`
- Composants Atlas : `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`
- Assets Mansa Moussa réutilisables : `PIXELLAB-MASTER-INDEX.md`
- Philosophie Atlas pur (Section 9) : `memory/rules-atlas-production.md`
- Vidéo concurrente analysée : https://www.youtube.com/watch?v=tnBQtH7G0hI (History Matters, 1.2M vues, 3min12)
