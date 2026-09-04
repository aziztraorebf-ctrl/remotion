# STARTER — Chill Meter : assemblage du device RUSTIQUE (reprise 2026-09-04)

> ⛔ **CONTRAT CLIENT ACTIF** (Abigail / AbiGirl Reacts, Upwork, 350 $ → 297,50 $ net).
> Etat complet : `memory/client-sim-tests/upwork-chill-meter/STATUS.md`.
> Ce starter ne couvre QUE le chantier en cours : reconstruire le device sur SA reference.

---

## 🔴 LE FAIT QUI CHANGE TOUT (a lire en premier)

**Abigail a REJETE notre chassis SVG dessine a la main.** Elle exige comme base une image
« rustique/lourde » qu'elle dit avoir fournie.

⭐⭐⭐ **CETTE IMAGE EST LA NOTRE.** Correlation **1.000** avec
`out/_r-and-d/chill-meter-upwork/degivrage/ref-degivree-B.png` — une generation **Gemini i2i du
2026-09-02**, produite pour « degivrer » sa reference originale, puis JOINTE a notre message
comme justification de demarche. Elle l'a prise pour un design qu'elle avait fourni.

⚠️ Consequence : ce n'est **pas** une piece de design. Pas de fichier source, pas de calques,
pas de geometrie. C'est un PNG 1195x896 unique. « La refaire a 100 % » n'a donc pas de sens
comme objectif de reproduction.
⚠️ **Decision commerciale EN ATTENTE** (Aziz, non tranchee) : faut-il lui dire que l'image
vient de nous ? La confusion ressortira si elle demande un jour « le fichier source de son
design ».

---

## 📁 LES FICHIERS — rapatries hors du scratchpad le 2026-09-04

`out/_r-and-d/chill-meter-3d/REFERENCE-CLIENTE/`
| Fichier | Ce que c'est |
|---|---|
| `DEVICE-RUSTIQUE-BASE.png` | ⭐ **LA base du nouveau device** (1195x896). C'est l'image qu'elle exige. |
| `PLATEAU-AVEC-BRUME-75.png` | Sa reference de RENDU FINAL sur son plateau (montre le 75 % tel qu'elle l'imagine) |
| `rustic-vectorise.svg` | Vectorisation Recraft du device (2362 paths, 0 groupe) — **ECARTEE**, voir plus bas |

Autres references utiles :
- `out/_r-and-d/chill-meter-3d/refs/aziz-smoke.mp4` + `fumee-ref-{gemini,gpt,grok}.md` —
  breakdown 3 voix d'une vraie fumee (⚠️ mauvaise cible, cf. § PIEGES)
- `out/_r-and-d/chill-meter-3d/cibles/` — cibles Gemini du 75/100 % (⚠️ 4 sur 6 violent le brief)

---

## ✅ LA DECISION PRISE — le PNG comme decor, nos couches par-dessus

**Ne PAS vectoriser, ne PAS modeliser en 3D, ne PAS redessiner.**
On utilise `DEVICE-RUSTIQUE-BASE.png` **tel quel** comme decor (100 % de sa matiere, sa rouille,
son grain), et on pose UNIQUEMENT nos couches animees par-dessus.

**Pourquoi pas la vectorisation** (mesure du 04/09) : 80,8 % de pixels quasi identiques et bords
nets a toute resolution, MAIS le **grain photographique est perdu** (la corrosion devient des
aplats) et le SVG sort en **2362 paths / 0 groupe** — rien n'est isolable pour l'animation.

**Pourquoi pas la 3D** : ce qu'elle aime est de la MATIERE, pas de la geometrie. En 3D cette
matiere viendrait de textures qu'il faudrait generer de toute facon — on ajouterait une etape
de modelisation pour retomber sur le meme probleme, en cassant l'export alpha et le rig.

**Ce qu'on garde de l'existant** : la jauge et ses segments, le givre (`GivrePlanche.tsx`), les
particules, le rig d'entree, toute la chaine d'export alpha.
**Ce qu'on jette** : le chassis dessine dans `ChillMeterDevice.tsx` (341 Ko de SVG inline), et
avec lui les variantes `metal` (flat/brushed/machined) et `rust` (retenue/forte) — devenues sans
objet puisqu'elle a choisi son metal.

---

## 📐 LE CALAGE — deja fait, mesure et verifie a l'oeil

**`out/_r-and-d/chill-meter-3d/calage/CALAGE.json`** + 12 images de controle `CTRL-*.png`.
Repere : pixels de `DEVICE-RUSTIQUE-BASE.png` (1195x896).

| Element | Valeur | Sert a |
|---|---|---|
| **Cases jauge** | **22** (pas 23) · cx 205,6 → 963,0 · y 457,5..518 (h 60,5) | les segments qui se remplissent |
| **Lentille POWER** | centre **(1113, 451)**, r **16,5** (bezel r=21, ne pas recouvrir) | ou tombe la LED verte |
| **Ecran** | x 117..1018, y 285..586, arrondi ~52 | le halo bleu |
| **Device** | x 19..1182, y 128..720 | cadrage |
| **SOL** | **y = 717** | l'atterrissage (sa demande n°6) |

**Les 5 labels — icone vs texte** (sa demande n°4 : texte vert, PAS les icones) :
| Bouton | Icone (ne pas toucher) | **Texte (a passer en vert)** |
|---|---|---|
| STATUS | 160..184 | **192..262** |
| DATA | 334..361 | **372..419** |
| HUD | 503..532 | **541..580** |
| CALIBRATE | 665..690 | **698..802** |
| ABOUT | 879..904 | **912..977** |
Les lettres tiennent toutes en **y 644..665** ; les icones debordent verticalement.

⭐ **Son image n'a AUCUNE grille** : le pas entre cases varie de 39,5 a 33,6 px. C'est une
generation d'IA. ⛔ Ne jamais recalculer les cases par formule — utiliser la liste des 22
positions du JSON.

Incertitudes assumees : rayon d'arrondi des cases (~4 px, lu au zoom) ; rayon 52 de l'ecran
(ajustement visuel, ecart possible 2-3 px en milieu d'arc — sans effet sur un halo diffus).

---

## 📄 SES MOTS EXACTS — copies du PDF, ne plus travailler de memoire (04/09)

> ⛔⛔ **Le 04/09 j'ai ecrit la sequence d'entree sans rouvrir le brief**, puis propose de la
> "corriger" en faisant monter la jauge pendant l'entree — ce qui aurait VIOLE sa section 4
> (le remplissage part de 0 %). Aziz a exige la verification : la sequence etait deja conforme
> point par point. ⭐ Source : `BRIEF-CLIENT-ORIGINAL.pdf` (10 p.), extraire avec
> `pdftotext -layout`. **Citer, ne jamais paraphraser de memoire.**

### § 2 — Entrance + Power-On (VERIFIE CONFORME au code actuel, 6/6)
- « enter from the **left side** near the music video » -> `entX` -720 -> 0 ✅
- « move **diagonally downward** into its final position » -> `entY` -300 -> 0 ✅
- « land with a **small impact** » -> IMPACT = frame 26 ✅
- « a **tiny bounce** when it locks into place » -> -17 / +5 / 0 sur 17 frames ✅
- « **After landing**, the meter should power on » -> `powerOn` demarre a IMPACT+8 ✅
- « The green power button should **light up** » ✅
⛔ **Rien n'est demande APRES l'allumage dans cette section.** La suite est § 3 Idle, pas un
remplissage. Un clip d'entree qui "ne fait plus rien" a la fin est CONFORME, pas casse.

### § 3 — Idle : « soft blue glow · subtle screen shimmer · light icy movement inside the meter ·
green power button **softly glows in and out** · feel **alive, but not distracting** »

### § 4/5/6/7 — la progression (l'ordre est contractuel)
- **0->25 %** : « No frost should be on the meter yet », a 25 % « still look normal »
- **50 %** : le givre se forme SUR L'APPAREIL (aretes, coins, vis, joints) —
  « **No screen-wide visual effect should happen yet. Only the meter itself changes.** »
- **75 %** : 1er effet d'ecran, « **bottom edge only** » · « Cold mist rises from the **bottom
  only** » · « **The rest of the screen should remain clear** »
- **100 %** : « Frost animates around **all 4 screen edges** » · onde de choc depuis le meter,
  « expands **upward and toward the right side** » MAIS « **fades before fully reaching my face** »
  (dit 2 fois, l. 118-120 et 337-338). La direction vers elle est VOULUE ; ce qui est interdit
  c'est de l'atteindre. -> l'onde doit s'eteindre AVANT son visage ET ne pas couvrir la fenetre video. · « Wind gusts, snow, icy particles [...] **across the
  frame** » · « A small amount of snow may pass over my face » MAIS « My face should **never be
  heavily obscured** »
  ⛔⛔ **CORRECTION DU 04/09 (soir) — j'avais tort DEUX FOIS sur ce point.**
  1er temps : j'ai invente un "couloir protege" autour de son visage (jamais demande).
  2e temps : en me corrigeant, j'ai ecrit que la contrainte « does not block the music video »
  ne valait QUE pour le placement de l'objet — parce que je ne l'avais vue que dans la section
  *Meter Placement*. **FAUX.** Elle apparait DEUX FOIS, et la seconde (ligne 377) est dans
  « **Important Creative Rules** », les regles generales du projet :
  > « Make sure it does not block the music video. »
  -> **La fenetre video ne doit JAMAIS etre couverte, ni par l'objet ni par les EFFETS**, a
  aucun palier. Defaut repere par Aziz a l'oeil sur les cibles (givre accroche au cadre video).
  -> Ce qui reste vrai : au 100 % l'effet couvre bien LE RESTE du cadre (« across the frame »).
  ⭐ Lecon : une contrainte peut etre repetee dans PLUSIEURS sections avec des portees
  differentes. Grep le brief ENTIER sur les mots-cles, ne pas conclure sur la 1re occurrence.

### § 8 — Exports (contractuel)
« ready to import into **CapCut** » · « **Transparent background versions only** » · « **Separate
files for each meter state** » · « exported as **full-screen transparent overlays, not cropped
tightly** around the meter »

### ⏭️ LE SON — ecart reel, jamais discute
Elle liste des SFX **par palier** : entree = « small **thud** » + « small mechanical **click** » +
« subtle **power-on** sound » · 50 % = freeze crackle, frosty pulse · 75 % = icy chime, wind ·
100 % = strong cold whoosh, low-impact cold boom, icy chime, freeze crackle, wind gust, snow
shimmer. **Perimetre contractuel inconnu** — a trancher avant le jalon 3.

---

## 🎯 CE QU'ELLE DEMANDE (message du 2026-09-04, 6 points)

1. Garder la texture rustique/patinee → ✅ acquis par construction (on garde son PNG)
2. Ton plus gris/gunmetal → ⭐ **SANS OBJET** (decision Aziz) : le ton est deja le sien
3. Garder le glow bleu de l'etat allume → nos couches
4. **Labels des boutons en VERT, pas les icones** → coordonnees ci-dessus
5. **Centrer sous la fenetre video**, en se servant des bandes noires laterales comme guides
6. **Ne pas flotter** a l'atterrissage → caler sur y=717

⛔ Elle precise : « I'm not asking for a new redesign or a cleaner reinterpretation. »

---

## 🔧 PROCHAINE ETAPE — l'assemblage

Poser 4 couches sur `DEVICE-RUSTIQUE-BASE.png` :
1. **22 segments** de jauge (positions du JSON), pilotes par `chill`
2. **LED verte** sur (1113, 451) r 16,5, pilotee par `powerOn`
3. **5 labels verts** superposes (⛔ PAS par inpaint, cf. pieges)
4. **Halo bleu** de l'ecran (x 117..1018, y 285..586)
Puis : centrage sous la fenetre video + atterrissage sur y=717.

Branche : `rnd/chill-meter-3d` (deja active). ⚠️ Le livrable contractuel
(`ChillMeterOverlay.tsx`) n'a PAS ete touche de la session — ne merger qu'apres validation Aziz.

---

## ⛔⛔ PIEGES PAYES DANS LA SESSION DU 2026-09-04 — ne pas les repeter

1. **⛔ Le « couloir » etait une INVENTION.** J'avais transpose « the **meter** should not block
   the music video » (une contrainte de PLACEMENT DE L'OBJET, section *Meter Placement*) aux
   EFFETS. Faux : au 100 % elle demande « wind gusts, snow, icy particles appear **across the
   frame** ». → Toujours relire le PDF source (`BRIEF-CLIENT-ORIGINAL.pdf`), jamais un resume.
2. **⛔ J'ai calibre la vapeur sur une fumee de stock que J'AVAIS choisie** (saturation 0,000),
   alors que SA reference est a **0,572** — franchement bleue. La rigueur appliquee a la
   mauvaise reference produit un resultat rigoureusement faux.
3. **⛔ `inpaint` ne sait pas re-ecrire du TEXTE** (teste : les mots deviennent des taches
   lumineuses). → Les labels verts se font par SUPERPOSITION, pas par retouche de son image.
4. **⛔ « 15 hashes distincts » ne prouve pas qu'une animation bouge** — un hash change pour
   1 pixel. Mesurer l'AMPLITUDE (% de pixels changeant de ±25 entre frames).
5. **⛔ 3 echecs a re-doser des constantes a la main** (couleur/hauteur/trous de la vapeur) :
   chaque correction en cassait une autre. Densite et lisibilite du mouvement tirent sur la
   meme corde. → Deleguer des le 2e echec, comme le protocole l'exige.
6. **⛔⛔ Ecrire une sequence sans rouvrir le brief** (04/09). J'ai decrit l'entree de memoire,
   puis propose de "corriger" un temps mort en faisant monter la jauge pendant l'entree — ce qui
   aurait viole sa § 4 (« The meter should **start at 0 %** »). Verification exigee par Aziz : la
   sequence etait conforme 6/6. ⭐ Le PDF est SUR DISQUE (`BRIEF-CLIENT-ORIGINAL.pdf`), extraire
   par `pdftotext -layout` et CITER. Un livrable client ne se code jamais sur un souvenir.
   -> Ses mots exacts sont maintenant recopies dans ce starter, § SES MOTS EXACTS.
7. **⛔ Le fond de controle contenait l'ANCIEN livrable** (04/09). J'ai compose mes rendus sur
   `envoi/entrance-4s-on-set.mp4`, qui n'est pas le plateau nu mais un rendu deja composite avec
   l'ancien chassis SVG : les deux s'empilaient. Aziz l'a vu a l'oeil et nomme exactement ; je
   l'ai contredit en mesurant l'alpha de MON overlay (mesure juste, mauvaise couche) au lieu de
   rendre le FOND SEUL. -> Plateau nu = `public/_shared/rnd/abigirl-decor.png`.
   Detail : `memory/feedbacks/feedback_fond-de-controle-contient-le-livrable-precedent.md`
8. **⛔ Ne pas juger un overlay sur fond neutre** — toujours compose sur son plateau reel
   (`out/_r-and-d/chill-meter-upwork/envoi/entrance-4s-on-set.mp4`, frame 10), avec PIL
   `alpha_composite` (l'alpha est DROIT, non premultiplie ; ffmpeg overlay le perd sur `select`).

---

## 🧊 LA 3D — testee, acquise, MISE EN PAUSE (ne pas jeter)

Prouve et commite (`f648151e`) sur `rnd/chill-meter-3d` :
- **Rendu 3D + alpha reel en headless FONCTIONNE** (et marchait deja depuis le 23/08).
  Flags OBLIGATOIRES, sans eux ca crashe : `--gl=angle` +
  `--browser-executable=node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell`
  + `--concurrency=1`. 4 autres backends WebGL echouent.
- **`screenToWorld()`** dans `ShockWave3D.tsx` : conversion pixels ecran → monde Three.js,
  **validee a dx=0,0 / dy=0,5 px**. Reutilisable pour tout effet ancre a un element ecran.
- Fichiers R&D : `ShockWave3D.tsx`, `ShockWave3D_v2.tsx`, `ColdVapor3D.tsx`,
  `ColdVaporLayers.tsx` (non commites, non contractuels).

⚠️ **Verdict sur la vapeur 3D du 75 %** : ecartee pour l'instant. Sa reference montre un **glow
diffus bleu** (saturation 0,572), pas des volutes de fumee. Le SVG/CSS y suffit — notre
`BottomEdgeEffect` en `linear-gradient` etait plus proche de sa cible que toute la 3D produite.
⭐ La 3D reste pertinente pour le **100 %** (onde de choc : matiere + profondeur).

---

## 🔗 Liens de la session (artifacts)

- Calage : https://claude.ai/code/artifact/939f45dd-98eb-4ec6-8e4c-db5f414eebcd
- Cibles 75/100 % : https://claude.ai/code/artifact/33ac07b5-93cd-4c63-82c3-24f8cbd435ae
- Vapeur 3D (3 versions) : https://claude.ai/code/artifact/7dc2e733-bf7c-40f9-9d53-b723905efcea
- Idéation 4 LLM : https://claude.ai/code/artifact/42473d83-81b5-4a0f-acd0-56959b5cb4ca

---

## ⏭️ NON TRAITE — a trancher

- **LE SON.** Son brief liste des SFX precis par palier (« strong cold whoosh », « low-impact
  cold boom », « freeze crackle », « wind gust »). **Jamais discute, perimetre contractuel
  inconnu.** A verifier avant le jalon 3.
- **Le givre des 4 bords du 100 %** : existe en SVG, non retravaille.
- **Recraft** : `recraftv4_1` marche en generation et coute MOINS cher que v3 (35 vs 40 credits),
  mais le MCP ne l'expose pas → API REST directe. 8 endpoints sur 14 absents du MCP.
  Detail : `memory/tools/recraft.md`.
- **Calendrier** : jalon 2 etait du le 7 sept, jalon 3 le 11. Le rejet du chassis rebat les
  cartes — verifier l'echeancier reel dans le STATUS.
