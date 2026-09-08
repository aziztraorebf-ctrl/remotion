---
name: Seedance 2.0 Dreamina
description: Reference technique Seedance 2.0 — capacites, workflow valide, 13 tests documentes, comparaison Kling, gotchas audio/ref/style
type: reference
originSessionId: 56e53807-2918-4502-ab0c-5c52a10fcd3b
---
# Seedance 2.0 — Reference Technique & Workflow

> Derniere MAJ : 2026-04-07

---

## 1. Architecture Quad-Modal

Premier modele video AI acceptant 4 types d'input simultanement :

| Type | Max | Role |
|------|-----|------|
| Images | 9 | Personnage, style, decor |
| Videos | 3 | Mouvement, camera, rythme |
| Audio | 3 | Voix lip sync, musique |
| Texte | 1 | Prompt + instructions @ |

---

## 2. Acces et Contraintes

- **Plateforme** : Dreamina web uniquement (API suspendue overseas — copyright dispute mars 2026)
- **Credits** : 80 (sans ref ou 1 ref), 120 (2+ refs ou I2V)
- **Resolution** : 720p gratuit, 1080p payant
- **Duree** : 5-15s | **FPS** : 24fps | **Format** : H.264 MP4 + audio AAC stereo

---

## 3. Workflow Valide GeoAfrique

```
1. Gemini styleref (1 image 9:16 dans le style flat BD par clip)
2. Claude dynamisation (Format 3 SECONDS, verbes explosifs, multi-camera)
3. Seedance generation (Dreamina web, ref Gemini + prompt Claude)
4. ffmpeg strip audio (-an -c:v copy)
5. Remotion : OffthreadVideo muted + Audio ElevenLabs
```

**Pourquoi cette separation Kimi/Claude (valide 2026-04-05)** :
- Prompts Kimi directs dans Seedance = 3-5/10 (statiques, orbite camera unique, photorealisme)
- Prompts Claude dynamises = 9-9.5/10 (dynamiques, multi-camera, style BD maintenu)

---

## 4. Forces & Limites (valides par 13+ tests)

### Forces
- Coherence personnage 15/15 tests
- Multi-ref (4+ images simultanees)
- POV -> 3e personne en continu
- Foule 30+ coherente
- Lip sync francais natif
- Duel combat 2 personnages distincts
- Plan-sequence 7 lieux en 15s
- Transitions d'epoques (Format 6)

### Limites
- Max 15s par generation
- 720p gratuit (1080p payant)
- Pas d'API (web uniquement)
- Audio re-synthetise (TOUJOURS remplacer)
- Censure agressive (pas de vrais visages)
- "2D flat" en texte seul = ignore (ref image OBLIGATOIRE pour style)

---

## 5. Comparaison Seedance vs Kling

| Situation | Seedance | Kling |
|-----------|----------|-------|
| Close-up, expressions | **OUI** | Morphe |
| POV, foule, lip sync | **OUI** | Non |
| Style 2D flat >8s | **OUI** | Drift realiste |
| VFX conceptuels (freeze, shockwave) | A tester | **NON** |
| 4K, >15s | Non | **OUI** |
| API automatisable | Non | **OUI** (fal.ai) |
| Start+End frame | Non | **OUI** (O3) |

---

## 6. Gotchas Critiques

- **Audio = POST-PROD OBLIGATOIRE** — Seedance re-synthetise, mots deformes
- **Ref image style OBLIGATOIRE** — sans ref, Seedance default vers photorealisme
- **Ref image = position de DEPART** — personnage debout dans ref = pop-in si doit etre assis
- **Ref couleurs > prompt couleurs** — ref grise = video grise malgre "full color" dans prompt
- **Ref gros plan visage = BLOQUE** — filtre deepfake
- **"POINTS at X" = pointe vers camera** — specifier direction physique
- **"color bleeds/spreads" = halo magique** — changer de plan plutot que propager
- **Motifs muraux proches = tattoos parasites** — murs lisses
- **"slight push in" = zoom avorte** — soit steady soit engage
- **Zero metaphore lumineuse en 2D flat** — "beacon/glow/catches light" = emission de lumiere

---

## 7. Tests Valides (13 tests, 2026-03-28 a 2026-04-07)

| Test | Score | Key Learning |
|------|-------|-------------|
| Trone lip sync | 8/10 | Audio degrade = strip + ElevenLabs overlay |
| SECONDS X TO Y | 8.5/10 | "gradually" corrige apparitions soudaines |
| Micro-expressions | 9.5/10 | Grattage barbe, clignement, zero defaut |
| POV + flotte | 10/10 | 30+ navires, transition POV continu |
| Amanirenas bataille | 9/10 | Flat graphic, 30+ guerriers, 1 essai |
| 2 souverains | 9.5/10 | 2 personnages distincts zero fusion 10s |
| Duel combat | 10/10 | 2 persos actifs, zero fusion, 1 essai |
| Plan-sequence Tombouctou | 10/10 | 7 lieux en 15s, 80cr, zero ref |
| Dialogue lip sync | 10/10 | Francais lip sync parfait, 2 persos |
| Format 6 3 epoques | 9.5/10 | 3 tenues, 3 palettes, 1 perso coherent |
| Contraste chromatique | 10/10 | 1 or vs 50+ gris, hook parfait |
| Thiaroye Clip 1 V4 (Format 3) | 9/10 | Dynamique, multi-camera, style BD |
| Thiaroye Clip 2 | 9.5/10 | 2 actes en 15s, zero morphing |
| Soundjata barre de fer | 9.5/10 | Verbes explosifs = actions physiquement credibles |
| Beat sync 10 shots | 9.5/10 | Format SHOT valide, 10 coupes en 15s |

---

## 8. Reference-to-Video (Omni) — Insights 2026-04-18

Fonction la plus sous-utilisee de Seedance 2.0. Upload video comme ref de mouvement (camera, choregraphie) — pas pour copier le contenu.

### Regles cles (recherche communaute)
- **1 video ref suffit** — plusieurs videos refs = mouvement incoherent
- **Sweet spot multi-ref** : 3-5 images + 1 video + 1 audio (pas les 12 slots)
- **Video ref > texte** pour tout mouvement complexe — les mots "fast", "cinematic" sont vagues
- **Ne PAS mixer les modes** : Image-to-Video (First Frame), I2V (First/Last), et Omni sont mutuellement exclusifs
- **Clips Seedance comme refs** = meilleurs que clips de films (meme "langage visuel" que le modele)

### Video Extend (a explorer session suivante)
- Duree choisie = duree de l'EXTENSION, pas du total
- Re-uploader la ref image lors de l'extension
- Prompter le FUTUR, pas le passe
- Pas de limite de chaining (4-15s par extension)

### CSV Reference Library
Voir `seedance-csv-ref-library.md` pour le workflow complet (script de recherche, 1830 clips prouves).

## 9. Reference complete prompts

Voir `memory/tools/seedance-prompts.md` (7 formats, techniques camera, VFX, dialogue)
et `memory/tools/seedance-rules.md` (41 regles + anti-patterns)
