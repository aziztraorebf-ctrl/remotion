# RULES-ACTIVE — Regles VIVANTES visual-producer

> Regles utilisees chaque session.
> Si une regle n'a pas ete invoquee depuis 2 projets → deplacer dans `RULES-ARCHIVE.md`.
> Derniere maj : 2026-04-26 (6 regles ajoutees depuis session Abou Bakari II : R-STYLE-ANCHOR-PALETTE-ONLY, R-EDIT-CHIRURGICAL-PRESERVE-FIRST, R-DIRECTION-PERSONNAGE, R-SKIN-EXPLICITE, R-RICHESSE-ARCHITECTURALE, R-ANIMATION-AVANT-VALIDATION)

---

## R-VIVANT v3 (FUSION R-DYNAMIC v2 + R-VIVANT-PARTOUT)

**Regle** : L'image source ET le prompt doivent etre vivants. Deux couches complementaires.

### Couche 1 — Image source
- Avant tout prompt Seedance, repondre : "Qu'est-ce qui bouge intrinsequement dans le cadre pendant 5-13s ?"
- Si seule reponse = "la camera" → regen l'image source pour ajouter un element dynamique (navire, fumee, eau, vent, oiseaux, poussiere, drapeaux).
- Personnages en vie organique AUSSI dans l'image (postures variees, activites secondaires : fumer, discuter, observer, s'appuyer). NEUTRE != SANS VIE.

### Couche 2 — Prompt
- Zero "frozen", "still", "motionless", "remains still" (voir `MOTS-ROUGES-VERTS.md`).
- Verbes actifs MAJUSCULES pour chaque perso principal (SHIFTS, LEANS, SCANS, CLENCHES...).
- Closing systematique : `All characters stay engaged, bodies continuously micro-shifting.`

### Exceptions (immobilite autorisee)
- Recueillement / memorial / post-massacre
- Silhouettes tombees (R-PC19)
- Portrait politique pose
- Plan-tableau <3s encadre par scenes dynamiques

### Contradiction-check (obligatoire avant envoi)
- Scanner sections pour detecter contradictions "dynamique attendue" vs "immobilite imposee"
- Si "will move" ET "STILL" coexistent sur meme perso = REGEN PROMPT

**Valide sur** : Thiaroye V5 Scene 1 (2026-04-23), Sonjata scenes 1-10 (2026-04-22).

---

## R-SONJATA-CHOREGRAPHIQUE (structure prompt i2v qui FONCTIONNE)

1. Style clause courte (STRICT STYLE FIDELITY paper-craft, palette, dot-eyes, flat fills)
2. Camera movement 1 ligne sobre (dolly-in lent, orbite, static + zoom leger)
3. Timeline explicite par segments 2-3s : "SECONDS 0 TO 2: / SECONDS 2 TO 4:"
4. 2-3 actions MACRO par segment (verbes MAJUSCULES)
5. Anti-morph clauses ciblees (dot-eyes, objets rigides)
6. Continuous throughout (eau, ciel, oiseaux, fumees)
7. Closing : MAINTAIN dot-eyes, no text, Ambient sounds

**Longueur sweet spot** : ~1500 chars (~220 words). **Duree** : 5-7s. **Max 10s.**

**A bannir** :
- Strict character count ("exactly 7 X") → Seedance invente persos
- Micro-tics trop granulaires (BLINKS, TAPS, RUBS)
- Tracking lateral long (>4s) en paper-craft
- Arcs composes camera (dolly+arc+pan)

---

## R-REVIEW-BEFORE-SPEND

Visual-producer ne lance JAMAIS Seedance directement. Prepare tout + upload gallery Vercel pour review + attend le GO.

Workflow : storyboard (avec refs canon) → refs → prompt → gates → STOP → gallery Vercel → Claude review → Aziz GO → Seedance.

Pour Gemini : preview-before-pay aussi. Montrer prompt + refs + cout AVANT.

---

## R-PRE-API-GATES

Avant TOUT appel Seedance ou Gemini : run `pipeline_gates.py` (voir MEMORY.md pour snippets).

10 gates : prompt structure, canonical ref, duration match, reverse bias, seedance inputs, character context, chain continuity, fal.ai balance, TTS scan, face diversity.

Si BLOCKED : fix avant l'API call. Jamais contourner.

---

## R-DURATION-MATCH

Seedance `duration` = string "4" a "15" par pas de 1s.

Regle : `clip_seconds >= ceil(narration_seconds) - 0.5` AVANT tout appel API.

Narration 13.22s → clip 14s. Narration 14.32s → clip 15s. Si narration >15s → splitter en 2 clips, JAMAIS boucle muette.

Section obligatoire dans Visual Plan :
```
Narration measured: X.XXs (source: timing-*.ts)
Clip Seedance demande: Y.0s
Cross-check: Y >= X ? OK / NOT OK
```

---

## R-CANONICAL-REF (Doc-First perso)

AVANT de generer un ref personnage, lancer :
```bash
find public/assets/library -name "{personnage}*" -type f
```

Si ref canonique existe → le passer en input Gemini (edition chirurgicale). JAMAIS regen from scratch le meme personnage.

Si plusieurs refs contradictoires → STOP, signaler a Aziz pour arbitrage.

---

## R-PROMPT-DETAILLE-MULTI-CONTEXTE

**Scenes multi-contexte** (plusieurs lieux/personnages/transitions) : prompt detaille shot-by-shot, <4000 chars. Paragraphe par shot : action, camera, eclairage, position, expression.

**Scenes simples mono-beat** : prompt minimaliste ~200 mots + refs canons + storyboard.

Style explicite renforce pour TOUS : "2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors".

Storyboard = COMPOSITION GUIDE ONLY. Ecrire : "Do NOT copy the sketch style - use character ref style".

---

## R-SELF-REVIEW-SEVERE

Pour chaque clip genere, verifier :
1. VISAGE matche ref canon (side-by-side obligatoire)
2. STYLE matche clips deja valides du meme Short
3. DETAILS canon (nombre d'armes, accessoires, coiffure)

Preferer etre trop severe (5 faux-positifs) plutot que laisser passer 1 vrai probleme. Aziz corrige les faux-positifs.

Format par panel :
```
Panel N check:
- REF: [description exacte]
- CLIP: [description clip]
- VERDICT: OK / DRIFT
```

---

## R-CHECKLIST-OBLIGATOIRE (NEW 2026-04-24)

AVANT tout prompt Seedance i2v Short paper-craft :
1. Lire `CHECKLIST-PROMPT-SHORT.md` (15 items)
2. Scanner `MOTS-ROUGES-VERTS.md` (12 mots rouges)
3. Coller le header-checklist coche en tete de livraison

Zero exception. Meme pour un "test rapide". Les erreurs les plus couteuses sont arrivees sur prompts "simples" sans scan.

---

## R-STORYBOARD-DENSITE (promue depuis ARCHIVE 2026-04-25)

Densite optimale panels storyboard pour Shorts GeoAfrique :

| Type scene | Panels | Ratio s/plan |
|---|---|---|
| Narratif contemplatif multi-beats | 4-5 | 2.4-3.0 |
| Narratif equilibre multi-beats | 5-6 | 2.0-2.5 |
| Action dense / combat | 7-9 | 1.3-1.7 |
| Contemplatif mono-beat continu | 8-9 | 1.3-1.5 |

Par defaut : **tester 5 panels en premier, pas 9**. L'ancienne regle "9 panels par defaut" est OBSOLETE.

---

## R-I2V-VS-STARTEND (promue depuis ARCHIVE 2026-04-25)

- **i2v classique** (1 seule image source) + verbes explosifs -> action dynamique (fleche qui part, corps qui recule).
- **Start/end frame** -> UNIQUEMENT transitions de perspective camera. Action dynamique = quasi-statique avec start/end.

Valide scene 7C Sonjata (arc bande -> relache) : start/end = fleche ne part pas. i2v classique = tir dynamique.

---

## R-STORYBOARD-REGEN-COMPLET (promue depuis ARCHIVE 2026-04-25)

Pour corriger un storyboard multi-panels, TOUJOURS regenerer le storyboard COMPLET avec prompt corrige. Edition chirurgicale Gemini ne sait pas cibler UN seul panel dans un storyboard multi-panels.

Storyboard : sauvegarder avec `.refs.txt` listant les refs canoniques utilisees en input.

---

## R-VETEMENTS-EPOQUE (promue depuis ARCHIVE 2026-04-25)

Gemini genere vetements modernes par defaut si pas specifie. Toujours specifier l'epoque dans les prompts image.

- Soundjata XIIIe : "13th century West African Mande warriors, cotton tunics, leather armor, cowrie shells, turbans, war caps, gris-gris, wooden spears with iron tips"
- Thiaroye 1944 : uniformes militaires francais coloniaux (tirailleurs senegalais)
- News contemporaine : vetements modernes

Attention aux defaults Vikings que Gemini genere sur "medieval West African warrior".

---

## R-NO-PARTICLES (valide 2026-04-25 — permanente)

**Interdire dans TOUS les prompts Gemini ET Seedance :**

| Terme interdit | Note |
|---|---|
| `dust motes` | artefacts grains clignotants |
| `dust particles` | idem |
| `dust clouds` | SAUF explosion action intentionnelle (voir exception) |
| `gold dust` | texture parasite |
| `pollen` | grain flottant non controlable |
| `sparkles` | scintillement artefact |
| `floating particles` | formulation generique a bannir |
| `mist particles` | flou non intentionnel |
| `fog particles` | idem |
| `debris floating` | artefact mouvement aleatoire |

**Exception autorisee** : poussiere de combat dans une scene d'action (explosion, charge de cavalerie, impact) = acceptable UNIQUEMENT si c'est l'action principale du plan, pas un element d'ambiance.

**Raison** : ces elements generent des artefacts visuels parasites — grains qui clignotent, flous non intentionnels, texture "vieux film" qui casse le style paper-craft propre.

---

## R-REVIEW-NARRATIF (valide 2026-04-26 — Abou Bakari fleet-b)

**Lors de la review visuelle post-generation, juger si le resultat SERT LA NARRATION — pas seulement si les regles techniques sont respectees.**

Exemples concrets :
- Yeux expressifs en gros plan d'action/terreur = ACCEPTABLE meme si regle dot-eyes strict. Le gros plan d'action n'est pas le contexte de la regle dot-eyes (qui vise les personnages a distance/contemplatifs).
- Drift de palette = verifier si coherent avec l'ambiance narrative AVANT de signaler comme defaut. Ex: ciel orange dans une tempete peut etre une lumiere dramatique, pas un artefact.
- Vague qui "disparait" = verifier si c'est une progression logique (s'ecrase → nouvelle arrive) avant de qualifier de morphing.

**Anti-pattern a eviter** : appliquer mecaniquement les regles paper-craft sans juger si le resultat sert la scene. La regle est un outil, pas une fin en soi. Aziz juge toujours en dernier.

---

## R-STYLE-ANCHOR-PALETTE-ONLY (valide 2026-04-26 — CRITIQUE)

**Erreur source** : image style-anchor Sonjata (femme + bébé + devin) passée en ref Gemini pour scène Moussa → Gemini a copié la COMPOSITION entière, pas juste le style.

**Règle** : Dans TOUS les prompts Gemini avec une image style-anchor en référence, écrire explicitement :
```
STYLE ANCHOR (first image): use for COLOR PALETTE and PAPER-CRAFT TEXTURE ONLY — do NOT copy its composition, narrative, or characters.
```

Positionner cette clause IMMÉDIATEMENT après la liste des refs, avant toute description de scène.

**Valide sur** : Abou Bakari II scène Moussa (2026-04-26). C'est la règle qui a causé le plus d'itérations perdues cette session.

---

## R-EDIT-CHIRURGICAL-PRESERVE-FIRST (valide 2026-04-26)

**Erreur source** : edits chirurgicaux (supprimer médaillon, ajouter sandales) avec brief insuffisant sur ce qui doit rester intact → drift.

**Formule validée** :
```
Edit this image with ONE correction only — [description précise].
PRESERVE EXACTLY: [liste exhaustive de tout ce qui ne doit pas changer — composition, couleurs, personnages, arrière-plan, style, angle de vue...]
CHANGE ONLY: [la seule modification ciblée]
```

Paramètre : `temperature=0.5` pour les edits chirurgicaux (moins de créativité = moins de drift).

**Limite connue** : si l'élément à corriger est physiquement caché par un vêtement (ex: pieds sous un boubou long vu de dos), l'edit échouera silencieusement. Dans ce cas → signaler à Aziz "correction impossible sans changer la composition" + proposer de laisser tel quel.

---

## R-DIRECTION-PERSONNAGE (valide 2026-04-26 — CRITIQUE)

**Erreur source** : scène départ Abou Bakari II validée plusieurs fois → le personnage faisait FACE caméra alors qu'il était censé marcher VERS le navire. Claude a validé la "structure" sans vérifier le vecteur de déplacement.

**Règle** : Pour toute scène avec un personnage en mouvement, vérifier TROIS points AVANT de valider la composition et AVANT de présenter à Aziz :
1. Dans quelle direction REGARDE le personnage ?
2. Dans quelle direction pointent ses PIEDS ?
3. Est-ce cohérent avec la DESTINATION NARRATIVE ?

Si face caméra alors que le personnage devrait avancer vers quelque chose → regen immédiate, sans présenter à Aziz.

**Extension — pensée animation** : se demander aussi "Comment Seedance va-t-il animer ce personnage ?" Si la composition implique un pivot à 90° (ex: face caméra → puis il marche vers le navire en biais) → difficile à animer. Corriger AVANT envoi à Aziz.

---

## R-SKIN-EXPLICITE (valide 2026-04-26)

**Erreur source** : scène fleet Abou Bakari II — charref injecté mais capitaine rendu avec peau européenne (trop claire).

**Règle** : Même avec un charref en référence, TOUJOURS écrire dans chaque prompt Gemini ET Seedance :
```
SKIN: [character name] has DARK BROWN skin — clearly visible, same as the character ref. NOT pale, NOT tan, NOT light-skinned.
```

Pour tous les personnages ouest-africains. Formulation "clearly visible" = contrebalance la tendance Gemini à éclaircir la peau sur les plans larges ou par mauvaise lumière.

---

## R-RICHESSE-ARCHITECTURALE (valide 2026-04-26)

**Erreur source** : brief Abou Bakari II mentionnait "l'homme le plus riche de l'histoire" → Gemini a empilé lingots d'or partout. La richesse littérale génère des compositions surchargées.

**Règle** : La richesse se montre par l'ARCHITECTURE et les MATÉRIAUX, pas par les objets de richesse littéraux.

| INTERDIT (richesse littérale) | AUTORISE (richesse architecturale) |
|---|---|
| `gold bars everywhere` | `gold-leaf geometric patterns on adobe walls` |
| `piles of gold` | `rich indigo tapestries` |
| `coins scattered` | `carved wooden columns with brass inlay` |
| `treasure chests` | `wealth conveyed through craftsmanship, not objects` |
| `jewels on the floor` | `hand-woven rugs, clay vessels with geometric patterns` |

Formulation cible : "wealth conveyed through architecture, craftsmanship, and fabric quality — not through piled objects".

---

## R-ANIMATION-AVANT-VALIDATION (valide 2026-04-26)

**Erreur source** : composition Abou Bakari II validée plusieurs fois avant de réaliser que l'animation Seedance serait impossible (personnage face caméra → marche vers navire = pivot à 90° non animable).

**Règle** : Avant de valider TOUTE composition avec un personnage en mouvement, se poser EXPLICITEMENT la question :
"Comment Seedance va-t-il animer ce personnage sur 5-10s ? Y a-t-il un pivot ou un changement de direction qui serait difficile à animer ?"

Situations à risque élevé :
- Personnage face caméra censé avancer vers un point hors-cadre
- Personnage de dos censé se retourner face caméra
- Deux personnages en face-à-face censés se déplacer dans la même direction

Pour ces cas : la composition source DOIT déjà montrer le personnage dans la direction de son déplacement narratif.

---

## GUIDE DE PROMOTION/RELEGATION

**Promotion vers ACTIVE** : une regle de ARCHIVE est invoquee >=3 fois en 2 projets consecutifs → remonter ici.

**Relegation vers ARCHIVE** : une regle ACTIVE n'a pas ete citee dans 2 projets consecutifs → deplacer dans ARCHIVE pour garder ACTIVE sous 10 items.

**Fusion** : si 2 regles se recouvrent >60% → fusionner en une regle "vN" avec l'origine commentee.
