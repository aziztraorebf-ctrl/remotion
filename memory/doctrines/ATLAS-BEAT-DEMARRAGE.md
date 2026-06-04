# ATLAS-BEAT-DEMARRAGE — Amorce du système de démarrage de beat (checklist scan)

> Créé 2026-06-03. AMORCE écrite (à outiller en script `atlas-beat-session.py` plus tard, miroir
> de `scripts/beat-session.py` Souverain). Le réflexe : au début de TOUT beat/scène Atlas, SCANNER
> avant de coder — savoir quel mouvement est validé, quel overlay, quel sprite, qu'est-ce qui
> apparaît où. Comme pour un beat Souverain, JAMAIS improviser un effet custom sans avoir vérifié
> l'existant.
> Doctrine : [[ATLAS-PLAYBOOK]] + [[ATLAS-PIXELLAB-PLAYBOOK]]. Sources décodées : [[DECODE-empire-ghana]] + [[DECODE-mansa-moussa]].

---

## PHASE 0 — SCAN (gate bloquant, avant tout code)

Cocher AVANT d'écrire une ligne. Présenter le scan + ≥2 combinaisons à Aziz (parité Souverain).

### 0.1 — Lire la doctrine
- [ ] `ATLAS-PLAYBOOK.md` (7 principes + grammaire mouvement + routage par besoin)
- [ ] `ATLAS-PIXELLAB-PLAYBOOK.md` SI un acteur est présent dans le beat
- [ ] La fiche STATUS de l'épisode si elle existe (`memory/episodes/<ep>/STATUS.md`)

### 0.2 — Scanner les catalogues (qu'est-ce qui existe déjà ?)
- [ ] Catalogue composants §5 de `ATLAS-PLAYBOOK.md` + `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`
- [ ] Inventaire sprites §1 de `ATLAS-PIXELLAB-PLAYBOOK.md` (réutiliser un perso existant ?)
- [ ] Code de référence : `_reference/mansa-moussa-v2/` + `_archive/.../empire-ghana/` (piocher un pattern réel)

### 0.3 — Router le besoin narratif → pattern (table §3 du PLAYBOOK)
Pour CHAQUE moment du beat, répondre :
- [ ] Que doit-on MONTRER ? (donnée chiffrée / acteur-voyage / lieu / territoire / effondrement…)
- [ ] → Quel pattern validé ? (Spotlight Insert ? AtlasPixelChar+cortège ? Label ? Grisaille ?)
- [ ] → Réf source (Ghana ou Mansa, fichier:ligne)
- [ ] Niveau d'incarnation N0/N1/N2 si acteur (échelle §4 PixelLab)

### 0.4 — Présenter à Aziz
- [ ] Tableau scan rempli + ≥2 COMBINAISONS proposées (ex : "hook globe→carte (Ghana) → corps cortège sprites (Mansa) → climax Spotlight Insert chiffre (Ghana)")
- [ ] GATE : pas de storyboard tant que le scan n'est pas validé.

---

## PHASE 0bis — STORYBOARD

- [ ] Storyboard visuel de la progression (PNG multi-panels OU description par sous-moment).
- [ ] Pour chaque sous-moment : caméra (mouvement de la grammaire §2) + overlay/sprite + ce qui apparaît où + SFX.
- [ ] Validé par Aziz AVANT le code. C'est de lui qu'on tire la structure.

---

## PHASE 1 — AUDIO & ALIGNEMENT (le socle du rythme — principe #3)

- [ ] Audio narration mesuré (ffprobe) + forced-alignment Whisper (`timing.ts` + `findWord()`).
- [ ] AUCUN timing visuel ne sera hardcodé indépendamment de la voix. Tous les `appearAt`/snaps se calent sur des timestamps de mots réels.

---

## PHASE 2 — CODE

- [ ] Carte d3-geo précalculée (`<episode>-data.json`), viewBox 720×1280, rendu 1080×1920.
- [ ] UNE caméra frame-driven (transform composé §2) : drift permanent + tilt croissant + snaps/track calés sur les mots.
- [ ] Overlays = triade (spring + plaque cream/encre + sync mot). Cartouches en haut (y≤320).
- [ ] Carte vivante (hachures + états), jamais polygone plat.
- [ ] Sprites : convention dossier + `AtlasPixelChar` + recette de chorégraphie (cortège / track / drop).
- [ ] R1 : jamais >8s sans changement visuel.
- [ ] SFX en `<Sequence from=… durationInFrames=…>`, JAMAIS `frame===X`.
- [ ] Continuité d'état : fadeIn/Out + reprise de la caméra du beat précédent.

---

## PHASE 3 — SELF-REVIEW (avant présentation)

Cocher les principes (§1 PLAYBOOK) + lisibilité :
- [ ] Carte jamais statique (drift visible) · tilt présent · annulé en gros plan sprite
- [ ] Overlays lisibles (plaque cream/encre, pas de texte nu) · cartouches en haut · bas libre pour sous-titres
- [ ] Sprites : ancrage-pied OK (pas de flottement) · pixelated · pas de frame manquante (trou)
- [ ] **Lisibilité d'échelle** : si zoom tactique, la carte reste LISIBLE (reprojeter local, NE PAS zoomer ×N une carte figée — cf. bug Cannes Hannibal). Repères géo présents.
- [ ] Timing calé sur la voix (pas de désync)
- [ ] Anti-clonage : c'est une scène neuve, pas un copier-coller de Ghana/Mansa

---

## PHASE 4 — REVIEW (optionnel, consultatif)

- [ ] Render animatic scale réduit (0.35) pour itérer vite.
- [ ] Gemini = CONSULTATIF jamais juge (il hallucine sur le mouvement sans son). MAX 1-2 appels.
- [ ] Décisions de goût (couleurs, glow, rythme) = jugement Aziz prime.

---

## PHASE 5 — UPLOAD & PRÉSENTATION

- [ ] catbox + présenter à Aziz. Review frames soi-même AVANT présentation.

---

## À OUTILLER PLUS TARD (backlog)

Transformer cette checklist en `scripts/atlas-beat-session.py` (miroir `beat-session.py`) :
phases scan / storyboard / code / self-review / review, avec gates bloquants et scoring.
Plus un `atlas-selfreview.py` (assertions automatiques : SFX dans Sequence, sprites pixelated,
ancrage-pied, timing forced-alignment, lisibilité d'échelle).
