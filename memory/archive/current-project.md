# Projet Actif : Peste 1347 — Les Humains Deviennent Fous

---

## Projet Parallele : GeoAfrique Shorts — Abou Bakari II

- **Statut** : Audio VALIDE — pret pour production Remotion
- **Voice FINALE** : Stephyra v2 — `QMNPncWXVcTVhJ9rDEQO`
  - Fichier audio : `tmp/audio-abou-bakari/stephyra-v2-noms-fixes.mp3` (54.0s)
  - Parametres : `stability: 0.60, similarity_boost: 0.80, style: 0.10`
  - Noms africains avec `<break time="0.3s">` avant, "Abou Bakari le Deuxieme" (pas "II")
- **Storyboard** : `tmp/storyboard-abou-bakari/` — 8 beats PNG valides
- **Script** : `tmp/storyboard-abou-bakari/script-abou-bakari.md`
- **Prochaine etape** : mesure ffprobe beat par beat -> production Remotion AbouBakariShort.tsx

> Source de verite pour l'etat du projet. A lire en debut de chaque session.
> Derniere mise a jour : 2026-02-23

---

## Etat de Production

- **Phase actuelle** : Corps de la video (segments S1-S6)
- **Hook termine** : HookMaster v2 — 2428f / ~80.9s / 13.2MB
- **Rendu final** : `out/hook-master-v2.mp4`
- **Reste a produire** : ~8m30s (S1 Flagellants → S6 Miroir)

---

## Style Visuel — Dual-Style SVG (FIXE)

**Regle : une scene = un style. Pas de melange dans la meme sequence.**

| Style | Quand | Caracteristiques |
|-------|-------|-----------------|
| **Enluminure** (couleur) | Scenes de vie, personnages, village, emotions | Or, lapis, vermillon, parchemin |
| **Gravure** (monochrome) | Donnees, faits historiques durs, statistiques, violence froide | Hachures, noir encre, gris |

**Palette officielle** : voir `EnlumCharacters.tsx` — GOLD, LAPIS, VERMILLON, VERT, OCRE, CHAIR, INK, PARCHMENT.

---

## Personnages — Village Saint-Pierre, Ete 1347

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

---

## Personnages Historiques (traitement different)

Les figures historiques reelles (Guy de Chauliac, Boccaccio, Wat Tyler, etc.) ne sont PAS des personnages SVG complets. Traitement : **portrait rapide en style enluminure** — silhouette + nom qui apparait, comme une citation animee. Presence breve, pas de role recurrent.

---

## Arc Narratif — Comment les personnages vivent le script

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

---

## Decoupage Production — Segments Restants

| Bloc | Duree cible | Complexite | Style dominant | Personnage cle |
|------|------------|-----------|---------------|---------------|
| **S1 Flagellants** | ~2:00 | Moyen | Enluminure + Gravure (carte) | Martin |
| **S2 Boucs emissaires** | ~2:30 | Complexe | Enluminure + Gravure (tableau) | Isaac |
| **S3 Fuite des elites** | ~1:40 | Moyen | Enluminure + Gravure (graphique) | Guillaume |
| **S4 Remedes** | ~1:40 | Moyen | Enluminure + Gravure (liste) | Renaud + Agnes |
| **S5 Survivants** | ~1:20 | Complexe | Enluminure + Gravure (graphique salaires) | Pierre |
| **S6 Miroir** | ~0:50 | Simple | Enluminure crepuscule | Guillaume + Renaud |

**Ordre de production recommande** : S6 → S3 → S4 → S1 → S5 → S2

---

## Technique "Foule" en Enluminure SVG

Pour les scenes de foule (S1 procession, S2 agitation) : silhouettes repetees stylisees (3-4 silhouettes identiques, multipliees en decalage). Fidelement au style enluminure medievale. Pas de foule realiste.

---

## Audio — Etat du Hook

| Fichier | Segment | Duree | Notes |
|---------|---------|-------|-------|
| `hook_00_saint_pierre_slow.mp3` | BlocA | ~23.5s | Coupe a 23.52s — derniere phrase supprimee |
| `hook_01_*` a `hook_06_*` | BlocB-E | varies | Voir scripts audio |
| `hook_03_galeres.mp3` | BlocB | - | Regenere : "firent escale" (pas "ont accoste") |
| `hookbloca-luth.mp3` | Tous blocs | loop | Volume 0.05 (harmonise) |

**Audio corps de la video** : PAS encore genere. A faire en batch avant de storyboarder S1-S6.

---

## Regles de Production Actives

- Hook = FREEZE. Aucune modification sans decision explicite d'Aziz.
- Audio batch d'abord → ecoute validation → storyboard → code
- Mini-render 3-4s apres premier code de chaque segment (Stage 5.2 bloquant)
- Dual-style : une scene = un style
- Foule = silhouettes repetees (pas pixel art, pas realiste)
- Personnages historiques = portraits rapides enluminure (pas personnages recurrents)

---

## Fichiers Cles

| Fichier | Role |
|---------|------|
| `src/projects/peste-1347-pixel/components/EnlumCharacters.tsx` | Source de verite personnages SVG |
| `src/projects/peste-1347-pixel/scenes/HookMaster.tsx` | Assemblage hook complet |
| `src/projects/peste-1347-pixel/scripts/script-lecture-v3.md` | Script V3.1 (source de verite texte) |
| `memory/svg-enluminure-style-guide.md` | Guide style enluminure/gravure |
| `memory/key-learnings.md` | Lecons accumulees |
| `public/audio/peste-pixel/hook/` | Fichiers audio hook |
