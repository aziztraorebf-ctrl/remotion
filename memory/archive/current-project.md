---
name: Projets actifs — etat de production
description: Etat d'avancement des 4 projets video actifs (Heros Oublies, Abou Bakari V2, Thiaroye, Peste 1347) avec pipelines et blockers
type: project
---

# Projets Actifs — Etat de Production

> Fusion des versions repo (2026-02-23) et auto-memory (2026-04-07). Structure = etat du 2026-04-07
> (plus recent), detail Peste 1347 = enrichi avec les acquis du 2026-02-23 non repris ailleurs.
> Mise a jour : 2026-04-07

---

## 1. Serie "Heros Oublies" (NOUVEAU — priorite haute)

**Concept** : 5 YouTube Shorts (75s) sur des heros africains oublies. Hero's Journey + Formule Cesar.

| # | Personnage | Script | Test Seedance | Audio |
|---|-----------|--------|---------------|-------|
| 1 | Nzinga (Angola) | Valide | Pas encore | En attente |
| 2 | Lat Dior (Senegal) | Valide | Pas encore | En attente |
| 3 | Soundjata (Mali) | Valide | **9.5/10** | En attente |
| 4 | Yaa Asantewaa (Ghana) | Valide | 8/10 (V2 best) | En attente |
| 5 | Hannibal (Carthage) | Valide | Pas encore | En attente |

**Pipeline** : Script -> Audio ElevenLabs -> Kimi DA -> Claude dynamisation -> Gemini styleref -> Seedance -> Remotion
**Blocker** : Credits ElevenLabs a recharger pour batch audio
**Scripts** : `scripts/heros-oublies/` (5 fichiers .md + README)
**Clips testes** : `public/assets/library/geoafrique/heros-oublies/`
**Signature** : close identique "Et pourtant, l'histoire a presque oublie son nom." / Pas de comparaison europeenne.

---

## 2. Short V2 Abou Bakari II (en pause)

**Concept** : YouTube Short ~54s sur Abou Bakari II, Mansa du Mali (~1311), traversee Atlantique.

**Etat** : Beats 01-09 TOUS COMPLETES via pipeline Seedance V2.
**Reste** : Musique Suno + render final assemblage Remotion.
**Blocker** : Decision Format 6 + credits Dreamina.
**Audio** : `public/audio/abou-bakari/stephyra-v2-noms-fixes.mp3` (54s, voix Stephyra)
**Timings** : `src/projects/geoafrique-shorts/timing.ts`
**Storyboard** : `tmp/storyboard-abou-bakari/` — 8 beats PNG valides
**Script** : `tmp/storyboard-abou-bakari/script-abou-bakari.md`

**Detail voix (etat du 2026-02-23)** : Audio VALIDE, voice finale Stephyra v2 —
`QMNPncWXVcTVhJ9rDEQO`. Fichier `tmp/audio-abou-bakari/stephyra-v2-noms-fixes.mp3` (54.0s).
Parametres : `stability: 0.60, similarity_boost: 0.80, style: 0.10`. Noms africains avec
`<break time="0.3s">` avant, "Abou Bakari le Deuxieme" (pas "II"). Prochaine etape a cette
date : mesure ffprobe beat par beat -> production Remotion `AbouBakariShort.tsx`.

---

## 3. Thiaroye V4 (prompts prets, en attente generation)

**Concept** : YouTube Short sur le massacre de Thiaroye 1944 (tirailleurs senegalais).

**Etat** : Clips 1-2 valides (9-9.5/10 Kimi). Clip 3 a refaire. Clips 4-7 a ecrire.
**Prompts finaux** : `scripts/thiaroye-v4-final-prompts.md` (7 clips, 800 credits, Kimi DA valide)
**Blocker** : Credits Dreamina.
**Audio** : existant (110s).
**Style** : flat design 2D, Seedance Format 3 SECONDS + identite visuelle GeoAfrique.

---

## 4. Peste 1347 (long-format, en pause)

**Concept** : Video longue 10-12 min sur les reactions humaines pendant la Peste Noire —
titre de travail "Les Humains Deviennent Fous".

**Etat** : HookMaster v2 TERMINE (score Kimi 9/10, "publication-ready") — 2428f / ~80.9s / 13.2MB,
rendu `out/hook-master-v2.mp4`. Corps S1-S6 (~8m30s) a faire.
**Pipeline** : SVG pur Remotion (enluminure couleur + gravure monochrome). Zero assets externes.
**Script** : V3.1 LOCKED dans `src/projects/peste-1347-pixel/scripts/script-lecture-v3.md`
**Composants** : `src/projects/peste-1347-pixel/scenes/` (HookBlocA/B/C/D/E, HookMaster)

### Style visuel — Dual-Style SVG (FIXE)

**Regle : une scene = un style. Pas de melange dans la meme sequence.**

| Style | Quand | Caracteristiques |
|-------|-------|-----------------|
| **Enluminure** (couleur) | Scenes de vie, personnages, village, emotions | Or, lapis, vermillon, parchemin |
| **Gravure** (monochrome) | Donnees, faits historiques durs, statistiques, violence froide | Hachures, noir encre, gris |

Palette officielle : voir `EnlumCharacters.tsx` — GOLD, LAPIS, VERMILLON, VERT, OCRE, CHAIR, INK, PARCHMENT.

### Personnages — Village Saint-Pierre, Ete 1347

Fichier source : `src/projects/peste-1347-pixel/components/EnlumCharacters.tsx`

| Nom | Role | Accessoire etat | Destin | Segment mort/sortie |
|-----|------|----------------|--------|-------------------|
| **Pierre** | Laboureur | Fourche → Beche → Rien | Survit | Arc complet : S1→S5 (incarne la renaissance du S5) |
| **Martin** | Pretre | Croix droite → inclinee → cierge couche | Meurt tot | S1 Flagellants (reste aupres des malades) |
| **Isaac** | Preteur juif (JUDENHUT jaune) | Bourse gonfl. → aplatie → disparue | Disparait du village | S2 Boucs emissaires (bourse coupee, absent apres) |
| **Guillaume** | Seigneur | Epee au fourreau → inclinee → absente | Survit | Fuit S3, revient intact S6 — accusation silencieuse |
| **Agnes** | Guerisseuse | Herbes fraiches → fanees → rien | Meurt | S4 Remedes (ironie : bon sens ne suffit pas) |
| **Renaud** | Medecin (masque bec d'oiseau) | Canne droite → baissee → epuise | Survit (transforme) | Canne baissee au S6 Miroir |

**Props communes** : `etat: "sain"|"malade"|"mort"`, `facing: "right"|"left"`, `anim: "idle"|"walk"|"pray"|"talk"`, `frame`, `scale` (Guillaume = 1.1).

**Note** : Le masque bec de Renaud est un anachronisme conscient (1619, pas 1347) — conserve pour lisibilite visuelle.

**Personnages historiques (traitement different)** : les figures historiques reelles (Guy de
Chauliac, Boccaccio, Wat Tyler, etc.) ne sont PAS des personnages SVG complets. Traitement :
portrait rapide en style enluminure — silhouette + nom qui apparait, comme une citation animee.
Presence breve, pas de role recurrent.

### Arc narratif — comment les personnages vivent le script

Les personnages du village *prolongent* la voix-off, ils ne l'illustrent pas mot pour mot.
- Voix-off = faits historiques
- Personnages = vecu emotionnel de ces faits a Saint-Pierre

Exemples :
- S1 Flagellants : Martin en procession, bras en croix
- S2 Boucs emissaires : Isaac menace, bourse qui disparait
- S3 Fuite : Guillaume quitte le village (vu partir, pas abstrait)
- S4 Remedes : Renaud prescrit l'absurde, Agnes meurt
- S5 Survivants : Pierre incarne le S5 directement — laboureur pauvre → salaire double, "le plus bas de l'echelle → celui qui en beneficie le plus"
- S6 Miroir : Guillaume revenu intact + Renaud epuise = deux rescapes qui incarnent le bilan

### Decoupage production — segments restants

| Bloc | Duree cible | Complexite | Style dominant | Personnage cle |
|------|------------|-----------|---------------|---------------|
| **S1 Flagellants** | ~2:00 | Moyen | Enluminure + Gravure (carte) | Martin |
| **S2 Boucs emissaires** | ~2:30 | Complexe | Enluminure + Gravure (tableau) | Isaac |
| **S3 Fuite des elites** | ~1:40 | Moyen | Enluminure + Gravure (graphique) | Guillaume |
| **S4 Remedes** | ~1:40 | Moyen | Enluminure + Gravure (liste) | Renaud + Agnes |
| **S5 Survivants** | ~1:20 | Complexe | Enluminure + Gravure (graphique salaires) | Pierre |
| **S6 Miroir** | ~0:50 | Simple | Enluminure crepuscule | Guillaume + Renaud |

**Ordre de production recommande** : S6 → S3 → S4 → S1 → S5 → S2

**Technique "Foule" en Enluminure SVG** : pour les scenes de foule (S1 procession, S2 agitation) :
silhouettes repetees stylisees (3-4 silhouettes identiques, multipliees en decalage). Fidelement
au style enluminure medievale. Pas de foule realiste.

### Audio — etat du Hook

| Fichier | Segment | Duree | Notes |
|---------|---------|-------|-------|
| `hook_00_saint_pierre_slow.mp3` | BlocA | ~23.5s | Coupe a 23.52s — derniere phrase supprimee |
| `hook_01_*` a `hook_06_*` | BlocB-E | varies | Voir scripts audio |
| `hook_03_galeres.mp3` | BlocB | - | Regenere : "firent escale" (pas "ont accoste") |
| `hookbloca-luth.mp3` | Tous blocs | loop | Volume 0.05 (harmonise) |

**Audio corps de la video** : PAS encore genere (etat au 2026-02-23). A faire en batch avant de
storyboarder S1-S6.

### Regles de production actives (Peste 1347)

- Hook = FREEZE. Aucune modification sans decision explicite d'Aziz.
- Audio batch d'abord → ecoute validation → storyboard → code
- Mini-render 3-4s apres premier code de chaque segment (Stage 5.2 bloquant)
- Dual-style : une scene = un style
- Foule = silhouettes repetees (pas pixel art, pas realiste)
- Personnages historiques = portraits rapides enluminure (pas personnages recurrents)

### Fichiers cles (Peste 1347)

| Fichier | Role |
|---------|------|
| `src/projects/peste-1347-pixel/components/EnlumCharacters.tsx` | Source de verite personnages SVG |
| `src/projects/peste-1347-pixel/scenes/HookMaster.tsx` | Assemblage hook complet |
| `src/projects/peste-1347-pixel/scripts/script-lecture-v3.md` | Script V3.1 (source de verite texte) |
| `memory/svg-enluminure-style-guide.md` | Guide style enluminure/gravure |
| `memory/key-learnings.md` | Lecons accumulees |
| `public/audio/peste-pixel/hook/` | Fichiers audio hook |

---

## Pipeline commun GeoAfrique (Shorts)

```
1. Script valide Aziz
2. Audio ElevenLabs V3
3. ffprobe timings -> timing.ts
4b. Kimi DA brief (vision narrative)
4c. Claude dynamisation (Format 3 SECONDS)
4d. Gemini styleref (1 image/clip)
5. Seedance generation (Dreamina web)
6. Integration Remotion + mini-render
```

**Identite visuelle** : contraste chromatique (1 perso couleur vs monde gris) + palettes geographiques.
**Skill complet** : `.claude/skills/batch-short-production/SKILL.md`
