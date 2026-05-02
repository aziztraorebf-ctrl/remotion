# CHECKLIST-PROMPT-SHORT

> **A executer AVANT chaque prompt Seedance i2v ET Gemini sur Short paper-craft 9:16.**
> Temps de scan : <90 secondes. Si un item echoue, corriger AVANT generation.
> Header de livraison obligatoire : table de scan cochee.
>
> **Template copier-coller** : remplacer les placeholders [PROJET], [SUJET], [EPOQUE], [STYLE] avant usage.

---

## CHECKLIST (15 items)

| # | Item | Critere PASS | Critere FAIL |
|---|------|--------------|--------------|
| 1 | **Scan mots rouges** | Aucun mot de `MOTS-ROUGES-VERTS.md` dans le prompt | Au moins 1 mot rouge present |
| 2 | **Image source vivante** | La source contient AU MOINS un element anime-able (navire, eau, vent, fumee, poussiere, oiseaux) | Source statique : seule la camera pourra bouger |
| 3 | **Personnages en vie organique** | Chaque perso principal a une micro-action listee (SHIFTS, LEANS, ADJUSTS, SCANS, CLENCHES...) | Persos "still", "motionless", "dignified" sans activite |
| 4 | **Timeline segments 2-3s** | Structure "SECONDS 0 TO 2: / SECONDS 2 TO 4:" presente | Pas de timeline = Seedance devine |
| 5 | **2-3 actions MACRO par segment** | 2-3 verbes MAJUSCULES par segment, pas 5+ | Trop dense = Seedance s'y perd |
| 6 | **Camera SOBRE, 1 ligne** | 1 seul type de mouvement (dolly-in, static + zoom, orbite <90) | Camera composee (dolly+arc+pan) |
| 7 | **Style clause courte** | "STRICT STYLE FIDELITY paper-craft, palette, dot-eyes, flat fills" | Description style delayee sur 4+ lignes |
| 8 | **Anti-morph clauses ciblees** | Elements critiques non-deformables explicites (dot-eyes, couteau, beret, arme) | Aucune clause anti-morph sur elements rigides |
| 9 | **Environnement continu** | Au moins 1 element continu (water RIPPLES, gulls GLIDE, smoke RISES) | Pas d'ancre de vie environnementale |
| 10 | **Closing rule fin de prompt** | `All characters stay engaged, bodies continuously micro-shifting. MAINTAIN dot-eyes, no text. Ambient sounds only.` | Fin de prompt incomplete |
| 11 | **Longueur sweet spot** | 1200-1800 chars (idealement ~1500) | <800 (sans structure) ou >2500 (trop dense) |
| 12 | **Duree coherente** | 5-7s sweet spot, max 10s, jamais 13+ | Split en 2 clips si narration >8s |
| 13 | **Pas de contradictions internes** | Scan : aucune paire "will move" + "STILL" sur meme perso | Contradiction = regen reflexive |
| 14 | **Pas de pensees internes residuelles** | Aucun "Wait...", "Actually...", "Revise:" dans le prompt | Nettoyer AVANT livraison |
| 15 | **Regles projet-specifiques** | Regles liees au projet (ex: regle 88 Thiaroye berets, R-PC15 dot-eyes) listees | Oubli de regles historiques cles |
| 22 | **R-DOT-EYES-SAFE-VERBS** | Sur projets dot-eyes : aucun `eyes WIDE / wide-eyed / eyes dilated / eyes widened` dans le prompt. Reactions d'intensite = verbes corporels (RECOILS, STAGGERS, SHOUTS — mouth OPEN, STIFFENS, BRACES) | "eyes WIDE" ou synonyme present = drift dot-eyes garanti |
| 16 | **R-NO-PARTICLES** | Aucun "dust motes/dust particles/gold dust/pollen/sparkles/floating particles/mist particles/fog particles/debris floating" dans le prompt (sauf dust cloud = explosion action principale) | Au moins 1 terme interdit present |
| 17 | **R-STYLE-ANCHOR-PALETTE-ONLY** | Si un style-anchor est en ref : clause "use for COLOR PALETTE and PAPER-CRAFT TEXTURE ONLY — do NOT copy its composition, narrative, or characters." presente | Style-anchor en ref sans clause explicite |
| 18 | **R-DIRECTION-PERSONNAGE** | Pour tout perso en mouvement : direction regard + direction pieds + coherence destination narrative verifiees | Perso face camera alors qu'il devrait avancer vers un point |
| 19 | **R-SKIN-EXPLICITE** | Clause "SKIN: [name] has DARK BROWN skin — clearly visible. NOT pale, NOT tan, NOT light-skinned." presente pour chaque perso ouest-africain | Absence de clause skin meme avec charref |
| 20 | **R-RICHESSE-ARCHITECTURALE** | Si la scene evoque richesse/pouvoir : richesse par materiau+architecture (gold-leaf, tapisseries, colonnes sculptees), PAS par objets (lingots, pierreries, tas d'or) | "gold bars everywhere", "piles of gold", "jewels scattered" |
| 21 | **R-ANIMATION-AVANT-VALIDATION** | Pour tout perso en mouvement : question explicite "Comment Seedance va animer ce perso ? Pivot 90 requis ?" posee AVANT validation | Composition qui implique un pivot non-animable presentee a Aziz |

---

## HEADER DE LIVRAISON OBLIGATOIRE

Avant tout prompt, coller cette table cochee :

```
| # | Item | Statut |
|---|------|--------|
| 1 | Scan mots rouges | OK / 12 mots verifies |
| 2 | Image source vivante | OK : [element vivant identifie] |
| 3 | Personnages en vie | OK : [X] persos avec micro-actions listees |
| 4 | Timeline segments | OK : [N] segments |
| 5 | Actions MACRO par segment | OK : 2-3 verbes/segment |
| 6 | Camera SOBRE | OK : [type] |
| 7 | Style clause courte | OK |
| 8 | Anti-morph clauses | OK : [elements cibles] |
| 9 | Environnement continu | OK : [elements] |
| 10 | Closing rule | OK |
| 11 | Longueur | [N] chars |
| 12 | Duree | [N]s |
| 13 | Contradictions | OK : scan effectue |
| 14 | Pensees internes | OK : nettoye |
| 15 | Regles projet | OK : [liste] |
| 16 | R-NO-PARTICLES | OK : scan effectue |
| 17 | Style-anchor clause PALETTE ONLY | OK / N/A (pas de style-anchor) |
| 18 | Direction personnage | OK : regard [dir] + pieds [dir] + destination [dir] / N/A |
| 19 | Skin explicite | OK : clause presente / N/A (perso non ouest-africain) |
| 20 | Richesse architecturale | OK / N/A (pas de contexte richesse) |
| 21 | Animation-avant-validation | OK : pas de pivot 90 implicite / N/A |
```

---

## DECLENCHEURS AUTOMATIQUES

**Si l'un de ces triggers est present dans le script/contexte, regle supplementaire a appliquer :**

- **Transmission orale / enfant / conte** → force age adulte 3x (debut/milieu/fin) + marqueurs anatomiques
- **Etat qui disparait (aura, flamme, lumiere)** → Visual State Transition clause F1 (etat final prioritaire)
- **Objet rigide porte (lance, arc, sabre)** → clause "RIGID, SOLID, NON-DEFORMING, length CONSTANT"
- **Animaux en mouvement (chevaux, fauves)** → profil lateral strict + pan camera (JAMAIS frontal vers camera)
- **Groupe de figurants / foule** → clause diversite explicite "ALL different ages, body types, poses"
- **Start/end frame clip** → generer END en premier, l'utiliser comme ref pour START (jamais paralleliser)

---

## REGLES PROJET-SPECIFIQUES (item 15 de la checklist)

### R-STORYBOARD-DENSITE (table de densite optimale)

| Type scene | Panels | Ratio s/plan |
|---|---|---|
| Narratif contemplatif multi-beats | 4-5 | 2.4-3.0 |
| Narratif equilibre multi-beats | 5-6 | 2.0-2.5 |
| Action dense / combat | 7-9 | 1.3-1.7 |
| Contemplatif mono-beat continu | 8-9 | 1.3-1.5 |

Par defaut Shorts GeoAfrique (Heros Oublies) : **tester 5 panels en premier, pas 9**. Question avant de fixer : "Cette scene demande d'absorber chaque beat (moins panels) ou de ressentir un flow continu (plus panels) ?"

L'ancienne regle "9 panels par defaut" est OBSOLETE.

### R-I2V-VS-STARTEND (paper-craft action dynamique)

- **i2v classique** (1 seule image source) + verbes explosifs -> action dynamique (fleche qui part, corps qui recule).
- **Start/end frame** -> UNIQUEMENT transitions de perspective camera. Action dynamique = quasi-statique.

Exemple valide : scene 7C Sonjata (arc bande -> relache). Start/end = fleche ne part pas. i2v classique = tir dynamique.

**Regle** : pour toute action physique dynamique dans un Short GeoAfrique, utiliser i2v classique par defaut. Start/end seulement si l'objectif est un changement de cadrage camera.

### R-STORYBOARD-REGEN-COMPLET

Pour corriger un storyboard multi-panels, TOUJOURS regenerer le storyboard COMPLET avec prompt corrige.

Edition chirurgicale Gemini ne sait pas cibler UN seul panel dans un storyboard multi-panels.

Storyboard : sauvegarder avec `.refs.txt` listant les refs canoniques utilisees en input (Gate 13 le verifie).

### R-VETEMENTS-EPOQUE

Gemini genere vetements modernes par defaut si pas specifie. TOUJOURS verifier coherence epoque avant tout prompt image.

| Projet | Periode | Vetements requis |
|---|---|---|
| Soundjata | XIIIe siecle Mande | "13th century West African Mande warriors, cotton tunics, leather armor with geometric patterns, cowrie shell decorations, turbans, leather war caps, gris-gris amulets, wooden spears with iron tips" |
| Thiaroye 1944 | 1944 colonial | "French colonial military uniform (tirailleurs senegalais), dark blue-grey tunic, khaki trousers, colonial beret or fez, leather boots, rifle" |
| News contemporaine | Actuel | vetements modernes selon contexte |

Attention aux defaults Vikings que Gemini genere sur "medieval West African warrior".

**Checklist item 15 — Validation epoque** :
- [ ] Style anchor Gemini passee en input (image de reference du projet)
- [ ] Projet historique -> verification coherence epoque [EPOQUE] : vetements + armes + architecture
- [ ] Aucun anachronisme dans la description des personnages

---

## ANTI-PATTERNS BLOQUANTS (STOP si detectes)

1. Image source = seul la camera peut bouger -> regen l'image source AVANT de prompter
2. Storyboard multi-panels sans refs canoniques en input -> regen storyboard avec refs
3. Narration hallucinee (pas du brief textuellement) -> recopier depuis le brief
4. Endpoint API non verifie -> grep dans scripts/tools/ pour endpoint valide
5. Caracteristique perso inventee -> ouvrir le ref canon avec Read AVANT de decrire
6. Action dynamique avec start/end frame -> utiliser i2v classique (R-I2V-VS-STARTEND)
7. Correction panel unique storyboard -> regenerer storyboard COMPLET (R-STORYBOARD-REGEN-COMPLET)
8. Projet historique sans spec vetements -> specifier epoque explicitement (R-VETEMENTS-EPOQUE)
9. Style-anchor en ref sans clause "PALETTE ONLY" -> copie de composition garantie (R-STYLE-ANCHOR-PALETTE-ONLY)
10. Edit chirurgical sans "PRESERVE EXACTLY" + liste exhaustive -> drift garanti (R-EDIT-CHIRURGICAL-PRESERVE-FIRST)
11. Perso face camera alors qu'il doit marcher vers destination -> regen immediatement (R-DIRECTION-PERSONNAGE)
12. Composition avec pivot 90 implicite en animation -> corriger AVANT presentation Aziz (R-ANIMATION-AVANT-VALIDATION)
13. Richesse du personnage = "gold bars/piles" dans le prompt -> utiliser richesse architecturale (R-RICHESSE-ARCHITECTURALE)
14. Perso ouest-africain sans clause skin explicite meme avec charref -> peau trop claire possible (R-SKIN-EXPLICITE)
15. `eyes WIDE / wide-eyed / eyes dilated` sur projet dot-eyes -> Seedance quitte le style, agrandit les yeux en realiste (R-DOT-EYES-SAFE-VERBS)

---

## TEMPLATE COPIER-COLLER — PROMPT SHORT GeoAfrique

```
[PROJET] — Scene [N] — [SUJET]
Epoque : [EPOQUE]
Style : [STYLE] (ex: paper-craft sepia / 2D flat BD)

CHECKLIST PRE-ENVOI :
[ ] Style anchor Gemini passee en input
[ ] Epoque [EPOQUE] : vetements + armes + architecture coherents
[ ] Scan 12 mots rouges effectue
[ ] Timeline segments 2-3s presente
[ ] Camera : 1 seul mouvement sobre
[ ] Contradictions internes : aucune

---

STRICT STYLE FIDELITY [STYLE] — no photorealism, no realistic textures.
[Description image source : elements vivants identifies]

Camera: [single movement type, 1 line]

SECONDS 0 TO 2: [2-3 macro actions, UPPERCASE verbs]
SECONDS 2 TO 4: [2-3 macro actions]
SECONDS 4 TO [N]: [final state + closing]

[Anti-morph clauses for critical elements]

Throughout: [continuous environment element — water RIPPLES, smoke RISES, etc.]

MAINTAIN [style-specific closing]: dot-eyes throughout, no text, no banners, no signs.
All characters stay engaged, bodies continuously micro-shifting.
Ambient sounds only — no music, no dialogue.
```

---

## REVISION LOG

- 2026-04-26 : items 17-21 ajoutes (R-STYLE-ANCHOR-PALETTE-ONLY, R-DIRECTION-PERSONNAGE, R-SKIN-EXPLICITE, R-RICHESSE-ARCHITECTURALE, R-ANIMATION-AVANT-VALIDATION) ; 6 anti-patterns supplementaires (9-14) ; header livraison etendu a 21 items ; session Abou Bakari II
- 2026-04-25 : item 16 R-NO-PARTICLES ajoute (dust motes/gold dust/pollen/sparkles/floating particles/mist+fog particles/debris floating) ; scope checklist etendu a Gemini
- 2026-04-25 : ajout template copier-coller + 4 regles projet (R-STORYBOARD-DENSITE, R-I2V-VS-STARTEND, R-STORYBOARD-REGEN-COMPLET, R-VETEMENTS-EPOQUE) + checklist item 15 etendue
- 2026-04-24 : creation initiale (synthese R-VIVANT-PARTOUT + R-DYNAMIC v2 + R-PROMPT-SONJATA-CHOREGRAPHIQUE + lecons Thiaroye V5)
