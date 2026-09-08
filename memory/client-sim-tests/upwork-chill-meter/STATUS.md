# Upwork — "Max Chill Factor Meter" (AbiGirl Reacts) — STATUS

> ⭐⭐⭐ **CONTRAT SIGNÉ LE 2026-08-30.** Parti d'un prototype sur un vrai brief Upwork le 2026-08-22,
> accepté par la cliente le 29/08, **offre v2 acceptée par Aziz le 30/08**. 350 $ → 297,50 $ net.
> ⛔ Les décisions de ce fichier engagent contractuellement.

## 🔑 ACCÈS RAPIDE — les infos qu'on recherche à CHAQUE session

> ⛔ Ajouté le 06/09 : l'URL de la chaîne était bien dans ce fichier (ligne ~1225) mais enterrée
> en bas d'un fichier de 1200+ lignes. Je l'ai cherchée avec un mauvais motif de grep et j'ai
> conclu à tort qu'elle n'existait nulle part. **Les infos d'accès vivent en TÊTE, pas au fond.**

| Quoi | Où |
|---|---|
| Chaîne YouTube cliente | `https://youtube.com/@abigirl_reacts` (107 K abonnés) |
| Room Upwork (messages) | `room_bc1dd916da7ec932f9e0d1ca6719dc96` · org_uid `2091222257557754811` |
| Contrat Upwork | id `44402562` · offre `112403774` |
| Sa VRAIE capture de plateau (06/09) | `out/_r-and-d/chill-meter-3d/REFERENCE-CLIENTE/vraie-capture-06-09.png` |
| Décor de travail 16:9 | `/tmp/vraie-capture-1920x1080.png` (regénérable depuis la capture) |
| Notre ancien plateau (yt-dlp, 22/08) | `public/_shared/rnd/abigirl-decor.png` |
| Le PNG du device (décor du meter) | `public/_client-sim/chill-meter/device-rustique.png` |
| Brief client original (PDF 10 p.) | `memory/client-sim-tests/upwork-chill-meter/BRIEF-CLIENT-ORIGINAL.pdf` |

## 📋 LES 3 JALONS — libellés officiels (tirés du contrat Upwork via MCP le 06/09)

| # | Libellé exact | Montant | Échéance |
|---|---|---|---|
| 1 | « Static meter design approval. Clean premium base meter, not heavily frosted. » | 105 $ | 03/09 |
| 2 | « Entrance/power-on, idle loop, 0–25%, and **50%** frost-on-meter states. » | 140 $ | 07/09 |
| 3 | « **75%** bottom-edge effect, 100% full chill effect, final exports + React/Remotion source folder. » | 105 $ | 11/09 |

⛔ Le **50 % est au jalon 2**, le **75 % au jalon 3** — ils ne sont pas ensemble. Une demande de
"différencier 50 et 75" chevauche donc 2 jalons. Le jalon 3 contient aussi les exports finaux et
le dossier source Remotion — c'est le jalon de LIVRAISON, pas seulement d'effets.

## 🔴 ÉTAT AU 2026-09-06 (NUIT) : SA RÉPONSE REÇUE — jury externe lancé sur le flottement

Abigail a répondu avec 5 demandes (taille inchangée, placement/grounding via SA VRAIE capture
jointe, icônes bleues dès l'idle, powered-on sur MAX CHILL DETECTION, glow isolé au texte
au 75 %) + une reconnaissance explicite qu'on avait raison sur le centrage et que sa
référence IA était décalée. Message de confirmation envoyé (24-48h), rien d'autre à faire
côté client tant que le travail n'est pas prêt.

### ⭐⭐⭐ SA VRAIE CAPTURE (jointe au message) — LA VRAIE CAUSE DU FLOTTEMENT

Mesurée : `out/_r-and-d/chill-meter-3d/REFERENCE-CLIENTE/vraie-capture-06-09.png` (2880×1608).
Sa fenêtre vidéo finit à 66,7 % de la hauteur (contre 67,0 % sur notre plateau yt-dlp actuel)
— **notre plateau EST déjà quasi identique en cadrage**. Ce n'est donc PAS un problème de
cadrage général : cette capture précise montre un **premier plan que notre plateau n'a pas**
(le piano blanc + une peluche, visibles en bas-gauche), qui recoupe exactement la zone où
pose le meter.

### ⭐⭐⭐ JURY EXTERNE 4 VOIX (06/09, `scripts/tools/jury-chill-meter-flottement.py`)

GPT-6 Astra + Grok 4.6 + Gemini 3.1 Pro + Kimi K3, appelés en parallèle SANS contexte du
repo (pour éviter tout biais), avec juste sa vraie capture + notre rendu actuel. **Verdict
UNANIME, jamais discuté entre eux** :
- ⛔ **L'ombre plus prononcée est REJETÉE par les 4** — mots quasi identiques : « une ombre
  sur du vide reste une ombre sur du vide » (Kimi), « une ombre plus grasse sous un sticker
  reste un sticker » (Grok).
- ⭐ **La vraie cause : notre décor de production n'a pas le premier plan** (piano/peluche)
  qui donne un repère de profondeur à cet endroit. Le meter n'a rien à quoi s'ancrer.
- ⭐⭐⭐ **La technique proposée par les 4 : l'OCCLUSION PARTIELLE** — faire passer un bout du
  premier plan (bord du piano, peluche) DEVANT le bas du meter. Un objet partiellement caché
  par le décor est immédiatement lu comme faisant partie de la scène.
- Bonus (Grok + Kimi) : les stalactites de givre qui pendent dans le vide sous l'objet
  « crient lévitation » indépendamment du reste — défaut jamais identifié avant ce jury.
Sorties complètes : `/tmp/da-refs/jury-flottement-{gpt6,grok,gemini,kimi}.md`.

### ⛔ OCCLUSION — 4 ESSAIS RATÉS, NON RÉSOLU (06/09 nuit) — REPRENDRE ICI

⛔ **3 essais ratés avant d'y arriver**, tous la même erreur de fond : poser un **rectangle**
là où l'arête du couvercle de piano est une **diagonale**. Les 2 premiers (Claude) plaquaient
un bandeau qui avalait 50 px de châssis et masquait les boutons. Le 3e (agent délégué) avait
le bon contour et la bonne méthode, mais une arête posée trop bas (y≈1012) : seulement 3,7 %
du châssis occlus → **mesurable mais invisible à l'œil**. ⭐ Rappel : un chiffre qui bouge ne
prouve pas qu'un problème visuel est résolu — il a fallu regarder plusieurs zooms pour le voir.

⛔ **PROTO4 (4e essai) EST RATÉ AUSSI — repéré par Aziz, pas par moi.** J'avais remonté
l'arête à y≈1005-1042 et validé sur une vue plein cadre réduite : 6,9 % du châssis occlus,
100 % des stalactites absorbées, les chiffres tombaient dans la fourchette du jury.
**Mais le résultat est une AMPUTATION ASYMÉTRIQUE, pas une occlusion** :
- **à GAUCHE** : le coin inférieur est tranché net en diagonale, les boutons STATUS et DATA
  sont coupés en pleine hauteur, le bord arrondi du châssis a disparu ;
- **à DROITE** : le châssis est intact (coin, vis, bord métallique, stalactites encore visibles).
Preuve visuelle : `out/_r-and-d/chill-meter-3d/DEFAUT-OCCLUSION-ASYMETRIE.png` (les 2 coins
côte à côte, même échelle).

⭐⭐⭐ **LA CAUSE — j'ai INVERSÉ LA PENTE de l'arête.** Sur la photo, le rebord du couvercle de
piano descend **vers la gauche** ; mon polygone le fait au contraire *remonter* à gauche
(y≈1005 alors que le châssis y descend jusqu'à 1049 → ~44 px mangés de ce côté), pendant qu'à
droite il passe sous l'objet sans rien toucher.

⛔⛔ **LA LEÇON DE MÉTHODE, la plus chère de la session** : j'ai validé sur une vue PLEIN CADRE
RÉDUITE où le défaut était invisible, et sur des chiffres qui tombaient juste. Aziz l'a vu
**sur son téléphone, sur une image plus petite encore** — parce qu'il a COMPARÉ LES DEUX CÔTÉS
au lieu de regarder l'ensemble. → Sur un objet symétrique, toujours comparer gauche/droite au
même zoom ; une mesure globale (« 6,9 % occlus ») ne dit RIEN sur la répartition.

**Polygone du 4e essai — ⛔ NE PAS LE REPRENDRE TEL QUEL** (pente inversée à gauche) :
```
140,1005  215,1002  300,1006  352,1012  430,1022  520,1030  620,1036  720,1042
820,1050  900,1058  1000,1066  1100,1074  1920,1080  140,1080
```
**Ordre de rendu strict** : plateau → meter → ombre clippée → couvercle clippé.
Détails : `feGaussianBlur stdDeviation≈2.5` sur le bord du clip (le décor est flou, une arête
nette trahirait le découpage) · ombre de contact `rgb(12,16,26)` opacité 0.70, floutée à ≈16,
elle-même clippée sur le même polygone, silhouette bornée à y 761-1050 pour exclure les
stalactites.

⏭️ **CE QU'IL RESTE À FAIRE SUR CE POINT** : relire l'arête réelle du couvercle sur grille
en vérifiant **le sens de la pente** (elle descend vers la gauche), puis re-tester en comparant
systématiquement les 2 coins bas au même zoom avant de conclure.
⚠️ Les coordonnées valent pour CETTE frame de plateau : si le décor change, tout est à relire.

### ⏭️ PLAN D'ACTION DÉCIDÉ (Aziz, 06/09)

1. Basculer le décor de production vers sa vraie capture (ou une frame équivalente au même
   premier plan) — PAS un ajustement d'ombre.
2. Découper le morceau de piano/peluche à faire passer devant le bas du meter.
3. ⭐⭐⭐ **Tester sur EXTRAIT VIDÉO réel (1-2 min, yt-dlp), pas seulement en statique** — et sur
   PLUSIEURS vidéos/cadrages de sa chaîne, pas une seule. Le fond ne bouge pas dans notre
   pipeline (frame fixe choisie), donc l'occlusion reste valable tant que le DÉCOR est le bon ;
   le risque n'est pas le mouvement de la vidéo hôte, c'est de changer de cadrage sans refaire
   le travail de calage.
4. Vérifier sur les 4 états ANIMÉS (idle, 50 %, 75 %, entrée) — le meter bouge pendant
   l'entrée, l'occlusion doit rester cohérente à toutes les frames.

⭐⭐ **Corollaire stratégique (Aziz)** : ce chantier constitue une PRÉ-PRODUCTION du jalon 2
(les états animés). Documenter la démarche (jury, décision, code) sert doublement.

## ✅ ÉTAT AU 2026-09-06 (SOIR) : JALON 1 ENVOYÉ, EN ATTENTE DE SA RÉPONSE

Message + 5 pièces envoyés par Aziz (via catbox/Litterbox, liens dans le message). Ses 6
demandes du 05/09 toutes traitées, mesurées, et vérifiées sur les rendus composés sur son
plateau — voir le double-check dans la page d'envoi. Rien à faire tant qu'elle ne répond pas.

**Ce qui reste ouvert, nommé dans le message envoyé** :
- Le placement (image 4) : sa référence AI n'est pas reproductible sur son vrai plateau (video
  41,6 % vs 43,9 % de largeur — quasi identique ; l'écart réel est que sa vidéo finit plus haut,
  38 % d'espace libre contre 33 %). On lui demande de trancher : taille actuelle ou plus petit
  avec plus d'air.
- Le nom de la chaîne qui s'allume au 75 % (au-delà de « la plaque bleuit », le NOM s'illumine)
  et le powered-on look : livrés en avance sur les jalons 2/3, nommés comme « not locked in yet ».

Branche `rnd/chill-meter-3d`, alignée sur `ef92f017` dans les 2 worktrees au soir du 06/09.
⚠️ `retro-gates-multi-session` (autre worktree) construit en parallèle les gates multi-session —
NE PAS y toucher.

**3 briques méthode extraites de ce seul jalon** (réutilisables sur tout futur contrat) :
`memory/doctrines/REVERSIBILITE-MATIERE-GENEREE.md` ·
`memory/feedbacks/feedback_annoter-l-image-plutot-qu-expliquer-au-client.md` ·
`memory/projects/CHANTIER-CADRAGE-REVISIONS-CLIENT.md`.

---

## 🔴🔴🔴 ETAT AU 2026-09-05 (SOIR) : SA REPONSE RECUE — 6 demandes, dont 3 HORS JALON 1

> ⛔⛔ **NE PAS CODER AVANT D'AVOIR ENVOYE LE MESSAGE DE CADRAGE.** Deux de ses demandes sont
> **inexecutables en l'etat** (deja faites et mesurees), et 3 relevent des jalons 2 et 3.
> Son message integral : voir la conversation Upwork du 05/09 (room `bc1dd916`).

### LE TRI DE SES 6 DEMANDES — verifie contre le brief contractuel et son message du 03/09

| # | Demande | Verdict | Preuve |
|---|---|---|---|
| 1 | Metal : **remettre de la rouille chaude** en accents (fissures, vis, vents, coins) sans revenir au beige | ✅ **LEGITIME jalon 1** | Son 03/09 disait DEJA « with rust and wear **as accents** instead of the casing feeling beige or brown ». Elle demande le curseur entre 2 bornes qu'elle avait posees ENSEMBLE. Pas un revirement. |
| 2 | Boutons : labels verts (OK) mais **icones en BLEU** | ⚠️ **REVIREMENT, mais petit** | Son 03/09 : « The icons/symbols before the words **can stay their current color** ». Le starter en avait fait un tableau de coordonnees pour ne PAS y toucher. C'est elle qui change d'avis. Executable vite. |
| 3 | **Powered-on look** : halo bleu ecran, edge lighting, « MAX CHILL DETECTION » qui s'illumine | ⛔ **JALON 2** | Contrat : jalon 1 = « Static meter design approval ». Jalon 2 = « Entrance/**power-on**, idle loop... ». |
| 4 | **50 % vs 75 %** : differencier, « AbiGirl Reacts » qui s'allume au 75 % | ⛔ **JALON 3** | Le 75 % est nommement dans le jalon 3 (`NotFunded`). Le 50 % est jalon 2. |
| 5 | **Placement** : deplacer vers la gauche pour centrer sous la video | ⚠️ **DEJA FAIT ET MESURE** | 3e fois qu'elle le demande. `POS_X` 198 -> 180, ecart ramene a **0 px**, mesure. Soit elle regarde une version anterieure, soit sa notion de « centre » differe de la mesure. |
| 6 | **Grounding** : que le meter ne flotte pas, « **especially once animated** » | ⚠️ **STATIQUE DEJA POSE** | `CALAGE.json` : SOL y=717, device s'arrete y=720. `CTRL-06b-sol.png` le montre a l'oeil : bord bas et ligne de sol colles. |

### ✅ GROUNDING (#6) — MESURE LE 06/09 : elle a RAISON, mais pas pour la raison supposee. CORRIGE.

⛔ **L'hypothese qui vivait ici etait FAUSSE** (« le rebond d'entree ne retombe pas a 0 »).
Mesuree deux fois, elle est infirmee :
- spring d'entree (damping 11) : **0,000 px de residuel des la frame 80**, sous-pixel des la 43 ;
- sur le clip REELLEMENT envoye le 03/09 : device **immobile au pixel pres de la frame 48 a la
  fin** (bas a y=1045 sur 72 frames consecutives).

⭐⭐⭐ **LA VRAIE CAUSE, vue en REGARDANT l'image** : le device ne flottait pas au sens d'une
oscillation — **il ne reposait sur RIEN**. Arrete a 20 px au-dessus de la bande noire, en plein
mur rose, sans ombre ni surface. `RUSTIC_SOL_SCREEN` etait **calcule mais cable a aucun element
dessine** : une ligne de sol vivant comme un nombre. (Meme schema que les cercles du globe D3.)

✅ **CORRIGE** (commit `59141039`, branche `fix/chill-meter-ancrage-sol`) : ombre de contact
ancree sur la ligne de sol, dimensionnee sur l'empreinte reelle mesuree dans le PNG (x 131..1039
a y=717 = 908 px), qui se resserre en s'assombrissant a l'atterrissage. Mesure : -45 points de
luminance sur la ligne de sol. Avant/apres : https://claude.ai/code/artifact/0b79d779-f285-47e4-a21f-401c9a3920bb
→ Lecons : `memory/feedbacks/feedback_ligne-de-sol-calculee-mais-cablee-a-rien.md`

### ⚠️ CENTRAGE (#5) — l'axe est exact, mais sa remarque reste FONDEE

Mesure 06/09 : ecart **0,0 px** (fenetre video centree 450,5 / device 450,5). MAIS le device
**deborde de 321 px SOUS la fenetre video** et empiete sur la peluche en bas a gauche.
⛔ Repondre « c'est mesure a 0 px » serait techniquement juste et **commercialement inutile** —
c'est la 3e fois qu'elle le demande. Quand elle dit « centrer », elle ne parle probablement pas
de l'axe (parfait) mais du bloc qui parait trop bas / trop grand pour la zone.
→ D'ou la capture annotee : la faire DESIGNER au lieu de decrire.

### 📤 CE QU'ON LUI ENVOIE — une capture ANNOTEE (idee d'Aziz, meilleure que lui en demander une)

⛔ **Ne PAS lui demander de produire une capture** : un client a qui on donne des devoirs repond
lentement ou pas. **Lui en FOURNIR une** : le device sur son plateau, avec la **ligne de sol** et
l'**axe de centrage** traces dessus, en UNE image. Elle repond en DESIGNANT, plus en decrivant.
Deplace #5 et #6 du subjectif (« ca flotte ») vers le mesurable. Matiere prete :
`out/_r-and-d/chill-meter-3d/calage/CTRL-06b-sol.png` (deja annotee, a recomposer sur le plateau).

### ⭐⭐⭐ LA FORME DE L'ENVOI — DES IMAGES FIXES, ZERO ANIMATION (idee d'Aziz, 05/09 soir)

⛔ **Ne PAS lui renvoyer un rendu anime pour ce tour.** Une image fixe se corrige en UN aller-retour ;
une animation se re-rend en entier. Aujourd'hui on lui envoie du fini et elle reagit dessus — le
cout du desaccord est maximal, et c'est ce qui a produit 4 rondes.

⭐ **Ses 3 demandes « hors jalon » sont des ETATS VISUELS, pas des mouvements** — toutes jugeables
sur image fixe, aucune ne demande d'animer quoi que ce soit :
| Sa demande | Ce que c'est vraiment |
|---|---|
| Powered-on look (halo, edge lighting, « MAX CHILL DETECTION » illumine) | **1 image** |
| Differenciation 50 % vs 75 % | **2 images COTE A COTE** |
| Rouille en accents | **1 image** |
⭐ Le 50/75 est un probleme de **CONTRASTE ENTRE DEUX ETATS** : ca se juge mieux sur 2 images
juxtaposees que dans une video ou elle ne peut pas comparer.

**L'envoi complet, en UNE fois, sans produire une seule frame d'animation** :
1. La planche des etats fixes (rouille + allume + 50 % + 75 %) — elle valide la DIRECTION.
2. La capture annotee (ligne de sol + axe de centrage) — elle DESIGNE au lieu de decrire (#5, #6).
→ L'animation ne part qu'APRES sa validation de la direction. On ne re-rend plus rien a l'aveugle.

⭐⭐ **C'est notre propre doctrine du STORYBOARD, jamais appliquee au travail client** : « le modele
PROPOSE, on valide, PUIS on code » — deplacer le jugement de gout d'apres-render (cher) vers
avant-code (gratuit). Sur ce contrat, 2 planches cote a cote au round 1 auraient probablement
economise 2 rondes.

### ⚖️ CE QU'ON DEMANDE EN RETOUR — la relation est a sens unique aujourd'hui

**Etat financier REEL, verifie via l'API Upwork le 08/09 (contrat 44402562)** — CORRIGE : les 350 $ des 3 jalons sont TOUS `fundedAmount` renseignes (105/140/105 $), deposes en bloc a l'ouverture du contrat (30/08). Jalon 1 = `Submitted` (soumis le 05/09, en attente de SA revue, PAS de paiement de sa part). Jalons 2/3 = `state: NotFunded` mais avec `fundedAmount` deja rempli — la description du jalon 2 dit "Due after Milestone 1 approval", donc `NotFunded` ici signifie vraisemblablement "pas encore active dans la sequence", pas "l'argent n'existe pas". ⚠️ Nuance non tranchee avec certitude (l'API ne le dit pas explicitement) mais le fait solide est : l'argent des 3 jalons semble deja depose, ce qui bloque est SON APPROBATION du jalon 1, pas un depot de sa part.
— l'argent n'est meme pas depose. Elle a eu **3 rondes** de revision la ou le contrat en prevoit 2.

Les 3 contreparties a poser dans le message (courtoises, aucune agressivite) :
1. **L'approbation du jalon 1** une fois ces retouches livrees. Un tour de plus contre la fermeture
   du jalon : un echange, pas une faveur.
2. **Le financement du jalon 2** avant d'attaquer les etats animes (mecanique normale d'Upwork).
3. **Sa validation en UNE fois** — elle ecrit elle-meme « we are very close », c'est le moment de
   lui faire dire que ces changements-la sont les derniers du jalon 1.
⭐ Accepter #3 et #4 (jalons 2 et 3) dans le jalon 1 est une **CONCESSION REELLE**. La NOMMER, sans
la refuser : une concession tue devient la norme, et le jalon 2 s'ouvrirait avec le meme desequilibre.

### ⛔⛔ LA LECON A GRAVER — ne jamais montrer un livrable d'un jalon FUTUR

**Envoyer le clip d'allumage 4 s pendant la validation du jalon 1 etait l'erreur** (constat d'Aziz,
que je partage). En mettant un etat ANIME sous ses yeux pendant un jalon STATIQUE, on a ouvert la
porte aux retours #3 et #4. Elle ne fait que commenter ce qu'on lui a montre.
→ **Le perimetre d'une revision suit ce qu'on MONTRE, pas ce que le contrat dit.** Vaut pour tout
contrat a jalons. (Le clip avait pourtant ete « explicitement cadre comme jalon 1 seulement » dans
le message du 03/09 — **le cadrage ecrit n'a pas suffi**. Seul ne pas montrer suffit.)

## 🔴🔴 ETAT AU 2026-09-04 : CHASSIS REJETE — CHANGEMENT DE BASE, chantier en cours

> ⭐⭐⭐ **REPRISE : `memory/starters/STARTER-chill-meter-device-rustique.md`** (tout le detail
> du nouveau chantier : la decision, le calage mesure, les pieges, les fichiers).

**Abigail a REJETE notre chassis** et exige comme base une image « rustique/lourde » qu'elle
croit avoir fournie. ⭐⭐⭐ **C'est NOTRE image** : correlation 1.000 avec
`degivrage/ref-degivree-B.png`, une generation Gemini du 02/09 qu'on lui avait JOINTE comme
justification de demarche. Elle n'a ni source, ni calques : c'est un PNG 1195x896.

**Decision prise** : utiliser son PNG **tel quel** comme decor (100 % de sa matiere) et poser
nos 4 couches animees par-dessus (22 segments, LED, 5 labels verts, halo). Ni vectorisation
(perd le grain, 2362 paths / 0 groupe), ni 3D (sa demande porte sur la MATIERE, pas la geometrie).

**Calage DEJA FAIT et verifie a l'oeil** : `out/_r-and-d/chill-meter-3d/calage/CALAGE.json`
(22 cases, LED (1113,451) r16,5, ecran, sol y=717, et les 5 labels avec icone/texte separes).

**Ses 6 demandes** : texture rustique gardee (acquis) · ton gunmetal (SANS OBJET, c'est son
image) · glow bleu · **labels verts sans les icones** · centrage sous la fenetre video ·
**ne pas flotter** (y=717).

### ✅ CE QUI TOURNE DEJA (session du 04/09 au soir, verifie au RENDU compose sur le plateau NU)
- **Parcours complet 630 frames / 21 s** (entree + idle + 4 paliers), alpha reel `yuva444p12le`,
  **0 frame defectueuse**. Video HQ + pages de suivi : `memory/INDEX-LIENS.md`.
- 5 etats de jauge justes (0/5/11/17/22 cases) · entree conforme au brief **6/6** (§ 2 verifie
  point par point) · ecran allume **lum 14,4 -> 45,9** (x3,2) · givre du device en 3 planches.

**Les 3 techniques qui ont debloque** (detail dans le starter) :
1. **Detourage par composante connexe**, pas par seuil — le PNG arrive en RGB opaque sur fond
   noir, et un seuil laisse passer son halo d'ombre en echarpe translucide (1,17 % du cadre).
2. ⛔⛔ **Extraction du givre en CALQUE** : ne garder que ce qui s'ECLAIRCIT. Gemini ne depose
   pas du givre, il REPEINT l'objet en bleu (metal R-B +7,9 -> -30,7 : la rouille qu'elle vient
   de valider disparait). Apres extraction : +2,0, sa cible etant +2,4. Ne JAMAIS poser l'image brute.
3. ⛔ **`delayRender` sur toute `<image>` SVG** — non attendue par le renderer : 1 frame sur 510
   sortait sans decor, pile sur une jonction d'etats (defaut vu a l'oeil par Aziz).

### ⏭️ EN COURS — les 2 effets d'ecran (delegue a un agent Opus)
Cibles validees par Aziz : `storyboard/RETENU-75-C3-blocs-bas.png` (banquise de blocs de glace
au bord bas) · `RETENU-100-F3-fleurs-bords.png` (fleurs de glace poussant des 4 bords).
Brief : `out/_r-and-d/chill-meter-3d/BRIEF-EFFETS-ECRAN.md` — exigence + arsenal + 6 interdits
CHIFFRES + liberte du moyen (doctrine GUIDER SANS BRIDER, redecouverte par Aziz).
⛔ **4 tentatives le prouvent : Gemini ne sait pas preserver une zone.** La fenetre video se
protege AU CODE (clipPath), jamais par le prompt. Sa regle, dans « Important Creative Rules » :
« Make sure it does not block the music video » — elle vaut pour les EFFETS, pas que le placement.

⚠️ **Le livrable contractuel n'a PAS ete touche** — tout le travail vit sur `rnd/chill-meter-3d`.
⚠️ **Calendrier a revoir** : le rejet rebat les jalons 2 (7 sept) et 3 (11 sept).
✅ **TRANCHE le 2026-09-05 (Aziz) : NON, sujet clos — ne plus le re-poser.** Le contrat definit
le livrable comme le **CapCut/MOV + le JSON d'animation** : « le fichier source » n'a JAMAIS
designe le PNG du decor. On le fournit dans le livrable de toute facon, donc la provenance de
l'image n'a aucune portee contractuelle. Ne pas rouvrir ce faux probleme.
⏭️ **LE SON : faisabilite LEVEE le 29/08** — 15 SFX generes, 15/15 exploitables au 1er essai,
3 familles nommees (organic/impact/retrotech), recette dans `scripts/tools/sfx-familles-chill-meter.py`,
fichiers dans `out/_r-and-d/chill-meter-upwork/sfx-test/` (voir § SON plus bas).
⚠️ Ce qui reste ouvert est **COMMERCIAL uniquement** : dans les 350 $ ou non, et integre au MOV
ou livre en piste separee (sur CapCut, integre = non coupable independamment).
⛔ **Ne PAS re-poser la question de la FAISABILITE** — vecu le 04/09, presentee 4-5 fois comme un
angle mort alors que `sfx-test/` etait sur le disque.

<details><summary>Historique — ETAT AU 2026-09-03 : revision 2 envoyee (teinte gunmetal)</summary>

## ETAT AU 2026-09-03 : REVISION 2 TRAITEE ET ENVOYEE — teinte gunmetal reglee

### 📤 ENVOYE A ABIGAIL (3 pieces jointes, noms neutres, verifiees par content-length)
- `chill-meter-dark-gunmetal.jpg` — planche design isole + sur son plateau, teinte SOMBRE
- `chill-meter-light-gunmetal.jpg` — meme planche, teinte CLAIRE (celle qu'on recommande)
- `entrance-4s-on-set.mp4` — clip d'allumage (arrivee + atterrissage + 2,5 s d'ecran allume),
  compose sur son plateau reel. **Explicitement cadre dans le message comme jalon 1 seulement**
  (pas le givre/remplissage, ca c'est le jalon 2) pour ne rien promettre de premature.
Liens : `memory/INDEX-LIENS.md`. Fichiers sources : `out/_r-and-d/chill-meter-upwork/envoi/`
(itérations intermediaires archivees dans `_archive-iterations/` du meme dossier).

Message : recommandation motivee vers la teinte claire (plus de marge de contraste pour le
givre du jalon 2, la rouille reste lisible sous la glace au lieu de tomber a 0,19 % d'opacite
comme sur la sombre) — SANS decider a sa place. Rappel explicite que c'est la **2e et derniere
revision prevue au contrat** sur ce jalon, avec une ouverture non ecrite (pas dans le message,
au cas par cas) a traiter une petite retouche si elle en signale une — decision d'Aziz, pas une
clause contractuelle.

### ✅ CE QUI A ETE REGLE CE TOUR (2026-09-03, apres son retour sur la revision 1)

**Elle a choisi la variante FORTE** (rouille marquee) et valide la direction. Sa seule critique :
la teinte « leans a little beige/brown throughout », elle demande du gunmetal gris froid.

**Diagnostic qui a debloque, en 2 temps** :
1. Mesure directe : sa reference est un gris QUASI NEUTRE (chroma 8,5-9,7), notre chassis etait
   bien plus sature localement (jusqu'a 33 sur l'ensemble de l'image — biais par l'ecran allume).
2. **3 modeles externes consultes en parallele (GPT-5.5 / Grok-4.6 / Gemini 3.1 Pro)**, avec LES
   DEUX IMAGES cote a cote (pas la reference seule) + nos 4 tentatives echouees + la question
   explicite « challengez notre hypothese ». Ils convergent : le probleme n'etait PAS la teinte
   moyenne (aveugle a l'axe kaki) mais la STRUCTURE — les calques de rouille (`rf_*`) couvraient
   67-83 % de chaque surface en lavis plein, pas en accent. Reduire leur opacite (l'hypothese que
   j'allais tenter) etait refutee par avance : "wrong color, wrong value, wrong spatial statistics,
   not masked by cavity/AO". Methode documentee : `memory/tools/consultation-llm-externe-probleme-visuel-bloque.md`.
3. Agent Opus 5 en effort max, brief avec le diagnostic complet, a reconstruit la pile de matiere
   (base froide -> grain monochrome -> occlusion -> rouille MASQUEE aux joints/vis -> speculaires
   sur aretes). Resultat mesure sur le metal pur : chroma 8,5 (vs 9,7 chez elle), lum p90 118,8
   (vs 126,1). Le camouflage a disparu.

**2 variantes finales gardees** (prop `rust`) :
- `gunmetal` (sombre) : lum p50 51,3, p90 118,8
- `gunmetal-pale` (claire, NOUVELLE ce tour) : lum p50 58,9, **p90 133,3 — au-dessus de sa ref**

⚠️⚠️ **3 faux departs techniques avant le bon resultat sur gunmetal-pale**, tous corriges AVANT
tout commit visible :
1. Rampes dupliquees en `pale_*` mais jamais referencees par le dessin -> rendu identique au
   pixel pres, silencieux. Meme piege que le bug `METAL_RAMPS` deja documente.
2. Edition EN PLACE de `FABLE_METAL_DEFS` (source COMMUNE avec `gunmetal` deja livree) -> a fait
   bouger `gunmetal` au bit pres sans le vouloir. Detecte par diff avant tout commit.
3. Bonne methode : dupliquer les 4 groupes du dessin (`G_PALE`) avec leurs `url(#machined_*)`
   rediriges vers des gradients `pale_machined_*` neufs. Verifie par diff pixel-exact contre HEAD
   a CHAQUE etape : les 4 autres variantes (`none`/`retenue`/`forte`/`gunmetal`) sont restees
   identiques au bit pres tout du long.

⚠️ 2 corrections supplementaires sur `gunmetal-pale`, la plaque titre et les boutons du bas
trainant derriere le reste (constat d'Aziz, confirme par mesure) :
- Voiles `aged_mottle`/`aged_grain` herites de la 1re passe Fable (jamais nettoyes, opacite
  0,38-0,55 d'origine) reduits dans `G_PALE` uniquement.
- Rouille des boutons (calque SEPARE, `rustLayer("boutons")`, distinct de `G_PALE`) allegee via
  une nouvelle constante `RUST_GUNMETAL_PALE_LAYERS`, sans toucher a `gunmetal` sombre.

### ✅ AUTRES CORRECTIONS DE CE TOUR
- **Centrage sous la video** : elle redemandait « use the black side strips as guides » (le
  cadre COMPLET, pas juste l'image). Remesure : `POS_X` 198 -> 180, ecart 18 px corrige a 0 px.
- **Labels des boutons en VERT** (`#6fff6f`, meme vert que le voyant power) — sa demande
  explicite, icones laissees en bleu comme precise. Confirme dans les mots exacts du brief.
- **Flocons STATUS et CALIBRATE decolles du texte** (constat d'Aziz a l'oeil, confirme par
  mesure : 62 px d'ecart pour STATUS contre 84 px pour ABOUT ; CALIBRATE mesurait 84 px mais
  restait visuellement colle a cause de la longueur du mot). Alignes sur ABOUT, dans les 2
  groupes de dessin (chassis normal + `G_PALE`) en un seul geste.
- **Clip d'allumage 4 s** : `entrance` (2 s) + `idle` (2 s) concatenes avec alpha preservee
  (`yuva444p12le`). Alpha initialement PERDU au rendu -> il faut `--pixel-format=yuva444p10le`
  ET `--image-format=png` ensemble, le profil ProRes seul ne suffit pas. Framerate initialement
  tombe a 25fps au lieu de 30 lors de la composition ffmpeg -> `-r 30` explicite. Saut theorique
  de 0,02 sur l'opacite ecran au point de jonction (le `breathe` repart de t=0) : verifie sur 8
  frames autour du raccord, invisible a l'oeil, accepte tel quel.

### 3D — evoquee, non testee, ecartee pour ce contrat
Aziz a demande si tester la 3D (R3F, Fable/Opus) pourrait reproduire sa reference a 100 %.
Reponse : oui probablement pour l'eclairage, mais coute l'export alpha (jamais teste sur ce
repo, un rendu 3D est opaque par defaut) et l'animation (props React simples en SVG vs
shaders/materiaux en 3D). Note comme R&D pure, session separee, jamais commencee :
`memory/NEXT-ACTION.md` § R&D 3D.

### ⛔ PISTE 3D (point 6, jalon 1) — TOUJOURS SANS OBJET, cf. raisonnement ci-dessous

<details><summary>Historique — ETAT AU 2026-09-02 (SOIR) : DEGIVRAGE REUSSI + BUG METAL-* CORRIGE</summary>

### ✅ LE DEGIVRAGE A MARCHE — la cible du point 6 existe enfin
`scripts/tools/gemini-i2i.py --ref` sur `ref-cliente.png`, 2 jets, tous deux exploitables :
- `out/_r-and-d/chill-meter-upwork/degivrage/ref-degivree-A.png` — gunmetal sombre, usure SOBRE
- `.../ref-degivree-B.png` — nettement plus clair, franchement ROUILLE et pique (cote Fallout)
Glace/neige/halo bleu retires, jauge vide, ecran eteint, geometrie et usure du chassis intactes.
⭐ Les 2 jets ne se contredisent pas : ils donnent la FOURCHETTE de ce que « rusted » veut dire
chez elle. A garder comme tels, pas a departager.

### ⭐⭐⭐ CE QUE LA COMPARAISON A ETAT EGAL A DONNE (le point 6 devient mesurable)
| | Son metal nu | Le notre (avant) |
|---|---|---|
| Luminosite moyenne | 41-64 | 48 ✅ dans sa fourchette |
| Micro-contraste | 25-33 | 24 ✅ quasi identique |
| **Ratio p95/p5** | **11.8-14.5** | **3.9** ❌ |

⛔⛔ **Le point 6 n'etait NI « trop clair » NI « pas assez de grain »** — les 2 premieres lignes le
prouvent. C'est exactement ce que j'aurais dose dans le vide sans cette mesure (et ce que la session
du matin a fait pendant des heures). Le seul ecart est la PLAGE TONALE.

**Cause trouvee dans le code** : les 3 rampes de surface (`machined_body`/`_frame`/`_plate`) vivaient
toutes entre L26 et L113 — bande etroite, jamais de vrai noir ni de vrai blanc. Les rampes a forte
amplitude existaient deja (`machined_edge` L13->225) mais ne servent que sur des lisereS fins.
⭐ Le grain `feTurbulence` de la passe Fable du 01/09 modulait A L'INTERIEUR de cette bande : d'ou
le « grain inegal » constate. Il ne manquait pas de grain, il manquait l'ecart tonal a moduler.

**Correctif applique (commit `610d2afd`)** : rampes elargies -> **ratio 3.9 -> 6.0 (+54 %)**.
Sa cible est 11.8-14.5, donc a mi-chemin. Le reste n'est PLUS de la colorimetrie (cf. ci-dessous).

### ⛔ BUG METAL-* CORRIGE — c'etaient DEUX bugs empiles, pas un
1. `METAL_RAMPS` visait 5 ids `gpt_*`/`kimi_*` a 0 reference (le bug deja documente).
2. ⭐ **Bug non documente, qui aurait fait echouer la correction du 1er** : les gradients
   `machined_*` vivent dans `FABLE_METAL_DEFS`, pas dans `DEFS`, alors que `metalDefs()` n'operait
   que sur `DEFS` et concatenait `FABLE_METAL_DEFS` APRES. `applyRamp` ne pouvait jamais les
   atteindre. -> `metalDefs` opere desormais sur `ALL_DEFS`. Verifie : 0 id duplique entre les 2
   blocs, donc l'ordre de concatenation est sans effet.
3. Le garde-fou « svg inchange » levait un FAUX POSITIF sur `brushed`, dont la rampe redonne
   volontairement les couleurs d'origine. Absence reelle et identite sont maintenant distinguees.
Les 4 compositions rendent (verifie sur disque + md5). `brushed` == `flat` au hash : normal, voulu.

### ⛔⛔ LECON DE METHODE — mesure biaisee par la facon de mesurer, 2 FOIS DE SUITE
1re mesure : zones calees sur `scale=2` alors que le device n'avait pas double -> je mesurais le
FOND NOIR (p5=1.0, ratio identique avant/apres).
2e mesure : zones de metal correctes mais qui ne recouvraient PAS les surfaces repeintes -> verdict
« 6.1 -> 6.1, aucun effet », j'ai failli conclure que le correctif ne marchait pas.
✅ La bonne methode : masquer par le DIFF avant/apres (`|A-B| > 3`) et ne mesurer que les pixels
reellement modifies -> 3.9 -> 6.0. **Le correctif marchait depuis le debut.**
⭐ A retenir : avant de conclure « le fix n'a rien change », verifier que la zone mesuree est bien
celle que le fix touche. Un diff d'images le dit en 3 lignes.

### ✅ PASSE FABLE LIVREE ET INTEGREE — 2 variantes proposees a la cliente

Fable 5 (mode MAX, liberte creative assumee) a produit 2 variantes, integrees sous prop
`rust: "none" | "retenue" | "forte"` (defaut "none"), cablee du device jusqu'a l'overlay.
- **retenue** : marbrures, coulures sous les vis, aretes usees. 0,02 % de surface rouillee.
- **forte** : eclats aux coins, plaques mangees, corrosion en arc sous les vis, grille du panneau
  power attaquee. 0,98 % (contre 1,19 % sur sa reference degivree la plus usee -> bon ordre).

⚠️ **Son rapport annoncait 5,3 % de pixels chauds sur la forte ; mesure reelle 0,98 %.** Verifier
les chiffres d'un agent, ne pas les relayer (cf. `feedback_chiffre-audit-relaye-sans-verification`).

**Verifie au RENDU, pas a la compilation** : 4 rendus aux hashs distincts, givre 7 % -> 75 % entre
idle et fill75, jauge et bouton animes, 0 id duplique, TS compile.

⭐⭐ **DECOUVERTE QUI ORIENTE LE CHOIX** : une fois le givre pose, la rouille de la forte tombe de
0,98 % a **0,19 %** — les 4/5 disparaissent sous la glace. Donc la **retenue risque d'etre presque
invisible aux etats givres du jalon 2**. Dit a la cliente dans le message (argument utile pour elle).

⛔ **Piste desaturation ECARTEE (et c'est Aziz qui a eu raison)** : notre metal reste bleu a 62 %
contre 21-42 % chez elle, donc j'ai propose de desaturer vers le neutre. Faux raisonnement : je
comparais notre objet NU a sa reference DEGIVREE, alors qu'elle ne verra JAMAIS l'objet nu — le
givre bleu se pose dessus au jalon 2 et refroidit tout. **C'est le piege "etat egal" par l'autre
bout.** A re-examiner apres avoir vu le givre, pas avant.

### ⛔ PLACEMENT — defaut trouve par Aziz a l'oeil, confirme a 2 px pres
Sa demande n°6 disait explicitement « No part of the meter should touch the music video ».
Mesure sur son plateau reel : le cadre bas de la fenetre video finit a **y=725**, le meter
commencait a **y=727**. **2 px** — ils se touchaient, pendant que **71 px** dormaient en bas.
-> `POS_Y` 670 **-> 706**. Desormais 38 px sous la video, 35 px en dessous (marge basse gardee
courte volontairement : les glacons debordent vers le bas). Verifie sur l'etat le plus charge
(fill75, glacons pousses) : elements opaques jusqu'a y=1060, **rien n'est coupe**.
✅ Centrage sous la video verifie aussi (sa consigne « centered under the video ») : fenetre
centree sur x=453, meter sur x=468 -> 15 px d'ecart sur 856 px de large, soit < 2 %.

### 📤 PRET A ENVOYER — Aziz envoie lui-meme (rien n'est parti)
Message redige puis **raccourci par Aziz** (il a coupe les justifications : "regression de mon
cote", "11 pixels", la reserve sur le fichier source — elles sonnaient comme une demonstration).
4 pieces jointes sur Blob, **noms neutres** (regle 3sexies : aucun modele IA, version ni jargon) :
`chill-meter-restrained-texture` · `chill-meter-heavy-texture` · `reference-metal-restrained` ·
`reference-metal-heavy`. Liens dans `memory/INDEX-LIENS.md`, verifies par content-length reel.
⭐ Les 2 reconstructions degivrees sont JOINTES au message comme justification de la demarche,
l'usage de l'IA assume franchement (sa propre reference en vient).

### ⏭️ RESTE POUR LE JALON 2 — evalue sur les rendus du 23/08 (Fill75 / Fill100)

⚠️⚠️ **CORRECTION D'UNE AFFIRMATION FAITE PLUS TOT LE MEME JOUR** : j'ai rapporte que
`BottomEdgeEffect` « sature l'image » a fill75 (16,8 % de cadre clair). **C'est FAUX en usage
reel.** Ce voile venait de mes rendus sur FOND BLANC. Compose sur son vrai plateau, la brume du
bas est discrete et son visage reste net. ⭐ Lecon : un overlay transparent ne se juge QUE
compose sur le decor final, jamais sur le fond du rendu.

**Ce qui MARCHE deja au 100 % (mesure, pas impression)** — la piste 3D n'a jamais ete necessaire :
- Givre anime sur les **4 bords** de l'ecran ✅ (son point 1)
- Particules/flocons sur tout le cadre ✅ (son point 6)
- ⭐ **Son visage reste lisible : 0,2 % d'opacite MOYENNE sur la zone visage**, avec quelques
  particules isolees a 53-60 % qui la traversent. C'est exactement son brief : « a small amount of
  snow may pass over my face » + « my face should never be heavily obscured » ✅✅
- Alpha reel verifie (`yuva444p12le`), 135 frames, 4,5 s.

**Les 4 vrais chantiers du jalon 2** :
1. ⛔ **SEPARER 75 % et 100 %.** Son brief est explicite au 75 % : « Cold mist rises from the
   **bottom only** » + « The rest of the screen should **remain clear** ». Or le rendu actuel
   disperse deja des flocons sur TOUT le cadre a 75 %, y compris pres d'elle a droite. Le 75 % en
   fait trop, donc le 100 % ne monte plus en contraste : **c'est la PROGRESSION qui est ecrasee**,
   pas un effet rate.
2. ⚠️ **L'onde de choc** (« a frozen shock wave bursts from the meter », vers le haut et la droite,
   qui s'estompe avant son visage) : **pas identifiee clairement** sur les frames extraites. A juger
   sur la video en MOUVEMENT, une frame ne prouve rien sur un mouvement.
3. Le givre « **frimas adherent** » plutot que « neige posee » — son exigence ecrite noir sur blanc
   (brief p.5 : « physically attached to the metal surface, not like a flat graphic placed on top »).
4. Repercuter les corrections du 02/09 : placement (POS_Y 706), trame d'ecran, rouille retenue.

⭐ **Pas de cible visuelle pour le 100 %** : sa reference ne montre QUE le meter, jamais l'effet
plein cadre. Meme situation qu'au jalon 1 avant le degivrage -> appliquer le meme geste EN SENS
INVERSE (demander a Gemini d'AMPLIFIER sa reference jusqu'a l'etat 100 %) pour avoir une cible
avant de coder. Cf. `feedback_comparer-a-etat-egal` § LE GESTE QUI DEBLOQUE.
⛔ **A faire APRES sa reponse sur la texture** : construire le givre sur un metal qui peut encore
changer serait a refaire.

<details><summary>Historique — la passe Fable pendant qu'elle tournait</summary>

### ⏭️ EN COURS — passe Fable MAX (rouille/usure), lancee en fond
La plage tonale etant ouverte, ce qui manque n'est PLUS de la colorimetrie : son metal est *mange*,
pique, accidente ; le notre est lisse et bien eclaire. **Un degrade est lisse par construction** —
aucune valeur de `stop-color` ne creera une ecaillure. C'est le lot de Fable.
Brief : liberte creative assumee (doctrine GUIDER SANS BRIDER — decision d'Aziz : trop contraindre
ferait perdre un 1er jet potentiellement exceptionnel), 2 variantes `rouille-forte` /
`rouille-retenue`, les 2 degivrages donnes comme FOURCHETTE et non comme cible.
Contraintes gardees = contractuelles seulement : geometrie intacte, ecran/textes/jauge intouches,
gamme sombre conservee (le givre bleu du jalon 2 vient se poser dessus), animations preservees.
Livrables attendus : `out/_r-and-d/chill-meter-upwork/passe-rouille/rouille-{forte,retenue}.svg`.

</details>

### ⛔ PISTE 3D — DEVENUE SANS OBJET (et c'est le degivrage qui l'a tranche)
Son seul usage viable etait « obtenir un rendu de reference eclaire comme cible visuelle ». Cette
cible, le degivrage la donne en 2 appels Gemini, sans mailler un panneau plat que ces modeles gerent
mal. ⚠️ Ceci est une DEDUCTION, pas un test de la 3D (jamais essayee). Si on veut la voir tourner un
jour par curiosite, elle reste possible — elle n'est simplement plus necessaire au point 6.

</details>

<details><summary>Historique — ETAT AU 2026-09-02 (matin) : revision 1 traitee</summary>

</details>

## ⭐⭐⭐ ETAT AU 2026-09-02 : REVISION 1 DU JALON 1 TRAITEE — RIEN RENVOYE ENCORE

Abigail a repondu au jalon 1. Elle **valide la structure** (« I do like the overall direction and
structure, solid starting point ») et demande **6 revisions** avant approbation. Ceci consomme la
1re des 2 revisions du jalon 1.

**Les 6 demandes et leur traitement (tout est code + rendu + verifie a l'oeil) :**
1. Plus de texture / caractere antique-rustique → passe Fable 5 mode MAX (palette bleu-acier →
   gunmetal, 3 calques `feTurbulence`, vis vieillies, aerations creusees, tubes a relief).
   ⚠️ Repartition du grain INEGALE (grandes surfaces riches, petits elements a peine) — a reprendre.
2. Labels des boutons du bas manquants → **RESTAURES**. Cause trouvee par `git log -p` : ils
   existaient dans `chill-meter-mix.svg` et ont ete **supprimes par erreur au commit `8ba98e96`**
   (integration du chassis Fable v2). Regression silencieuse, pas un oubli de conception.
3. Flocons du titre a harmoniser → **AJOUTES** autour de « AbiGirl Reacts » (il n'y en avait AUCUN),
   meme symbole `fable_sym_flocon` que ceux du sous-titre, comme elle le demandait.
4. Bouton power mal centre → **RECENTRE**. Ecart mesure : voyant a `cy=555`, sa cavite a `cy=544`
   = 11 px. Rayon 26 → 24 pour epouser la cavite.
5. Precision generale des details → couverte par la passe Fable.
6. Taille/placement trop grands → **SCALE 0.52 → 0.373595**, **POS 96,616 → 198,670**, mesures sur
   sa capture. Le meter ne touche plus la fenetre video (sa contrainte explicite).

⚠️ **HORS DEMANDE CLIENTE** (vient d'une remarque d'Aziz, pas d'elle) : le pattern `gpt_screenGrid`
dessinait des triangles diagonaux tres visibles sur la dalle → ramene a une trame imperceptible,
sa reference montrant une dalle noire unie. **A assumer comme tel si elle le remarque.**

### ⭐⭐ LE VRAI ECART RESTANT — c'est le GIVRE, pas le metal (jalon 2)

Revele par la comparaison **a etat egal** (notre `ChillMeter-Fill75` frame 104 contre sa reference
a ~75-85 %), apres une longue fausse piste sur la matiere du metal :
- **Notre givre = « neige posee »** (amas blancs opaques sur les aretes + glacons tres dessines).
  **Le sien = « frimas adherent »** (pellicule fine qui epouse la surface, coulures, halo diffus).
  ⭐ Elle l'avait ANTICIPE dans son brief original : « look physically attached to the metal
  surface, not like a flat graphic placed on top ». C'est le vrai sujet du jalon 2.
- **`BottomEdgeEffect`** (brume du bas) = aplat cyan trop opaque, monte sur ~1/3 du cadre, la ou sa
  reference montre un voile diffus transparent.

### ⛔ PISTE TEXTURE RASTER — testee, MESUREE, abandonnee (ne pas refaire le trajet)

Plaquer une texture photo en `<pattern>` + `<clipPath>` sur la coque : **techniquement ca marche**
(render Remotion OK, groupes d'animation intacts). Mais les **4 dosages** testes font tous BAISSER
le contraste local (micro 12,66 → 7,6..10,9) et/ou assombrissent (lum 33,6 → 21,8 au pire). Sur une
surface a lum ~33/255, `overlay` n'a plus d'amplitude et `multiply` ne sait qu'assombrir.
Texture conservee : `public/_client-sim/chill-meter/metal-grain.png`. Commentaire explicatif laisse
dans `ChillMeterDevice.tsx`.

### ⛔ BUG OUVERT (preexistant, verifie sur HEAD AVANT les modifs de cette session)

`ChillMeter-Metal-Flat` / `-Brushed` / `-Machined` **plantent au render** : le garde-fou
`DRAWN_GRADIENTS` leve « le gradient `gpt_metalOuter` n'est reference par aucun `url(#...)` ».
Mesure : les 5 gradients vises par `METAL_RAMPS` ont **0 reference** dans le fichier — le chassis
Fable v2 (`8ba98e96`) n'utilise plus aucun `gpt_*`. Seule `ChillMeter-Idle` rend.
⭐ Le garde-fou fait son travail ; c'est `METAL_RAMPS` qui est obsolete. A corriger avant livraison.

### ⏭️ DECISION AZIZ — ne PAS renvoyer tout de suite

### ⛔⛔ AVANT TOUTE PISTE TECHNIQUE — RELIRE CE QU'ELLE DEMANDE VRAIMENT (garde-fou, Aziz 02/09)

Ses mots exacts : « **I do like the overall direction and structure**, and I think this is a solid
starting point » · « **Overall, I like the direction and structure**, but I'd like these revisions
made before approving Milestone 1 ».

Ses 6 demandes : texture/caractere antique · labels des boutons · style des flocons · alignement du
bouton power · precision des details · taille/placement. **AUCUNE ne parle de realisme volumetrique,
de matiere photographique, ni de 3D.** Le mot le plus fort est « antique, rustique, weathered » —
du CARACTERE, pas du photorealisme. **5 des 6 points ont ete regles en ~1 h.**

⛔ Le reste de la session (texture raster, 4 dosages, piste 3D) est parti d'un diagnostic que
**J'AI** pose — « le SVG ne peut pas produire une vraie matiere » — pas d'une demande d'elle.
⭐ **Reflexe a prendre : quand une session derive vers un chantier technique lourd sur un livrable
client, RELIRE son message et verifier que le chantier repond a une phrase qu'ELLE a ecrite.**
Si aucune phrase ne le demande, c'est notre exigence, pas la sienne — et elle se decide
explicitement avec Aziz, pas en glissant dedans.

</details>

<details><summary>Historique — le plan de degivrage (execute, resultats ci-dessus)</summary>

### ⭐⭐ A FAIRE EN PREMIER LA PROCHAINE SESSION — DEGIVRER SA REFERENCE (idee d'Aziz, 02/09)

Son image est elle-meme generee par IA. **Lui demander (Gemini i2i, `gemini-i2i.py --ref` sur le
crop deja extrait) de retirer la glace, la neige et le halo bleu, et de rendre l'objet NU** — en
decrivant precisement l'etat initial voulu (chassis propre, ecran eteint ou noir, jauge vide).

Pourquoi c'est le bon premier geste : ca donne **sa reference dans NOTRE etat**, donc la comparaison
la plus directe possible — bien moins cher qu'un render, et ca aurait evite toute la fausse piste
de cette session (cf. `feedback_comparer-a-etat-egal-avant-d-attribuer-un-ecart`).
⚠️ Surveiller les hallucinations (il peut inventer des details sous la glace) : re-tenter si le
1er jet derive. Et **le faire AVANT la 3D** — si on a une cible propre, la 3D devient peut-etre
inutile.

⭐⭐ **C'EST SURTOUT LA CLE DU POINT 6** (« more texture and character », le seul de ses 6 points qui
soit SUBJECTIF — les 5 autres etaient factuels : un label absent, 11 px de decalage, une echelle).
« Aged, rusted, weathered » ne dit pas OU S'ARRETER : c'est exactement pour ca que j'ai dose dans le
vide cette session, **sans cible**. Degivrer sa reference donne cette cible — on voit SON METAL NU
et on le compare au notre **dans le meme etat**, sans que le givre pollue la lecture. Le point 6
cesse alors d'etre une appreciation et devient mesurable (son metal nu est-il plus sombre ? plus
contraste ? plus terne ?) — les mesures de cette session redeviennent valides parce qu'elles
porteraient enfin sur deux objets comparables.
⭐ **Issue probable a garder en tete** : que son metal nu soit PROCHE du notre, ou n'en differe que
par 1-2 reglages de degrade. Dans ce cas le point 6 se regle en quelques valeurs et **toute la piste
3D devient sans objet**. C'est la vraie raison de commencer par la : pas seulement moins cher —
ca peut rendre le reste inutile.
⚠️ Ce que Gemini rendra est une **hypothese plausible** du metal nu (il invente ce qu'il y a sous la
glace), pas une verite. Exploitable pour la DIRECTION (plus sombre / plus terne / plus contraste),
pas pour le detail au pixel. C'est suffisant pour le point 6.

⭐ **CADRAGE DE LA PISTE 3D (a lire avant de la tester — question d'Aziz, 02/09).** Les modeles
image-to-3D (Hunyuan3D, Rodin, Trellis, TripoSR — via fal.ai ou le MCP Comfy Cloud :
`api_hunyuan3d_text_to_model`, `api_rodin3d_gen2_5_text_to_3d`) sortent un maillage texture en
quelques minutes a partir d'une image. **Deux usages, un seul est viable :**
- ⛔ **EXTRAIRE LA TEXTURE pour la plaquer sur notre SVG — non recommande (non teste).** La texture
  qui en sort est UV-mappee sur LA GEOMETRIE QUE LE MODELE A INVENTEE, pas sur nos formes : la
  plaquer sur notre chassis poserait des morceaux au hasard par rapport a nos decoupes. Ce n'est pas
  un probleme de qualite mais de **correspondance geometrique**. 2e obstacle : **sa reference est
  givree** — le modele cuirait la glace dans le maillage et la texture, alors qu'il nous faut un
  chassis NU que `frost` fait evoluer de 0 a 1.
- ✅ **GENERER UN RENDU DE REFERENCE ECLAIRE — c'est CA l'usage.** Pas pour en extraire une matiere,
  mais pour obtenir notre objet avec un **eclairage 3D coherent** (ombres portees justes, occlusion
  dans les recoins, aretes qui accrochent la lumiere) et s'en servir de **cible visuelle** pour
  regler nos degrades SVG. ⭐ Coherent avec la mesure de cette session : le facteur determinant est
  l'ECLAIRAGE, pas la rugosite — et c'est ce que Gemini approximait mal.
- ⚠️ **Inconnu a verifier au 1er essai** : ces modeles sont entraines surtout sur de l'organique et
  des props volumetriques. Un panneau d'instrument PLAT, symetrique, avec du texte et de fines
  gravures est un cas difficile pour eux. Ne pas promettre le resultat avant de l'avoir vu.

</details>

Explorer d'abord la **piste 3D** (jamais testee — mon « ca ne marcherait pas » de la session etait
une extrapolation, pas un resultat) pour un envoi UNIQUE et solide plutot
que deux envois partiels. Il ne restera qu'1 revision sur le jalon 1 apres celle-ci.

<details><summary>Historique — ETAT AU 2026-09-01 : JALON 1 ENVOYE ET CONFIRME RECU</summary>

Envoye via MCP Upwork (`send_message`) : message + 2 pieces jointes (`01-meter-design-final.png`,
`02-meter-in-context-final.png`). Confirmation de reception verifiee dans le fil (`list_messages`) —
les 2 attachments apparaissent avec `scanStatus: CLEAN` et le bon nom de fichier, pas juste un
`SUCCESS` API (contrairement aux 2 bugs `attachments` deja documentes sur les PROPOSITIONS —
`memory/tools/upwork-mcp.md` — ici c'est un `send_message`, contexte different, ca a fonctionne).

Message final : sans jargon interne ("metal look" plutot que "machined finish"), sans re-expliquer
le "avant givre" deja confirme 3x par Abigail dans le fil (25/08, 27/08, 30/08), sans signature nom
en fin de message (consigne Aziz — "ce n'est pas comme ca que les gens parlent normalement").
Regles ecrites dans `memory/feedbacks/feedback_message-client-ne-pas-sonner-genere.md` § 3bis/3ter.

⏭️ **En attente de la reponse d'Abigail.** Prochaine echeance si elle valide : jalon 2 (7 sept,
entrance/idle/0-25%/50%, sons deja generes cf plus bas dans ce fichier).

<details><summary>Historique — ETAT AU 2026-08-31 : JALON 1 PRET A ENVOYER — chassis machined final</summary>
⛔⛔ **2 bugs corriges le 31/08, apres signalement d'Aziz** :
1. **Halo noir sur la planche "en contexte"** — Fable v2 avait ajoute
   `<rect x="0" y="0" width="1448" height="1086" fill="#0b1120"/>` en tete du groupe `shell`
   (invisible sur SON rendu, deja sur fond sombre — visible seulement compose sur un vrai decor).
   Retire (commit correctif). Verifie : 12,4 % du cadre opaque (le chassis reel) contre 100 % avant.
   ⭐ **Lecon** : verifier la transparence d'un asset genere en le composant sur un fond CLAIR ou
   sur le decor reel, jamais sur un fond deja sombre qui masque le defaut.
2. **Bouton d'enregistrement Artifact non fiable pour Aziz** — capacite `downloads` presente dans
   le code mais l'experience n'a pas marche cote utilisateur. **catbox ET litterbox HS ce soir**
   (catbox : HTTP 200 mais `content-length: 0`, faux succes deja documente ; litterbox : 500).
   → **Bascule sur Vercel Blob**, verifie par `content-length` reel (491 Ko / 2 Mo). Liens dans
   `memory/INDEX-LIENS.md`.



**Cadrage retenu (Aziz)** : Machined est une AMELIORATION pure de l'existant (rien perdu, plus de
matiere) — pas un choix a arbitrer a egalite avec Flat. On envoie donc **Machined comme LE design**,
et on mentionne en 1 ligne dans le message qu'une version plus sobre existe si elle prefere.
⛔ Flat n'est PAS envoye en option cote-a-cote — ca aurait fait hesiter sur un axe deja tranche.

**Fichiers finaux** : `out/_r-and-d/chill-meter-upwork/jalon1-final/`
- `01-meter-design-final.png` — chassis seul, agrandi
- `02-meter-in-context-final.png` — compose sur le plateau (yt-dlp abigirl-decor.png)

</details>

</details>

## ⭐⭐⭐ ETAT AU 2026-08-30 : CONTRAT ACTIF — jalon 1 prêt, envoi prévu le 31/08

📄 **Page de pilotage** : https://claude.ai/code/artifact/652c7c39-1529-45a7-8d0b-929098180b9b
Les 2 planches (**enregistrables depuis la page** — capacité `downloads`, PNG pleine résolution),
la vérification contre le brief, le calendrier des jalons, le message de livraison prêt à copier.
⭐ **1 page par CLIENT, enrichie à chaque jalon** — même URL redéployée, jamais une page par envoi.
Référencée dans `memory/INDEX-LIENS.md` § Clients & contrats : c'est là qu'on la retrouve.

### L'offre v2 : les 3 demandes de révision ont TOUTES été obtenues
Relue en entier (une réémission d'offre est un document neuf, pas un diff) :
1. ✅ **La ligne « After Effects project file » a disparu.** Remplacée par « the zipped
   React/Remotion source project folder with a README, as discussed ». C'était LE point délicat.
2. ✅ **Les 3 dates sont remplies** : 3 / 7 / 11 septembre, avec « Due after Milestone N approval »
   écrit noir sur blanc → les jalons 2-3 courent depuis SON approbation, pas depuis le contrat.
3. ✅ **« Includes 2 revision rounds »** figure sur les trois jalons.
Montants conformes : 105 / 140 / 105.

⚠️ **Admin bloquant pour le PAIEMENT (pas pour le travail)** : les retraits sont gelés tant que les
infos fiscales ne sont pas fournies sur le profil. À régler avant le 3 sept.

### ⛔⛔ JALON 1 = UN SEUL ÉTAT, PAS SIX (erreur évitée le 30/08)
Libellé contractuel : « **Static meter design approval.** Clean premium base meter, not heavily
frosted. » → on envoie **le châssis propre à 0 %**, statique. Envoyer les 6 états statiques =
livrer le jalon 2 gratuitement ET griller l'atout de négociation.
⛔ **Ne PAS lui dire que les 6 états sont déjà rendus.**

### ⭐⭐ DEUX FAUSSES ALERTES QUE J'AI LEVÉES — arbitrées par Aziz, il avait raison 2×
1. ⛔ **NE PAS remonter le compteur du bord bas.** J'ai proposé d'ajouter une marge basse (mesuré :
   0 px, l'objet est tangent à y=1080). **Faux problème** : le haut du compteur est à y=684 et la
   fenêtre du clip descend à ~700 — le remonter empiéterait sur le clip, que le brief interdit
   explicitement (« It should not block the music video »). Et le brief DEMANDE « sitting on the
   floor / bottom edge ». Le placement actuel est le seul qui satisfait les deux règles.
2. ⛔ **NE PAS ajouter d'afficheur numérique du score.** J'ai lu « The 0-100 number readout should be
   clear and readable » (p.8) comme un élément manquant. **Faux** : cette phrase est dans la section
   *Meter Fill Animation* et signifie que la GRADUATION reste lisible pendant le remplissage. Son
   image de référence n'a aucun afficheur numérique, et le brief impose de suivre cette image.
   Inventer un élément absent de sa référence = hors brief. Si elle en veut un, ce sera en révision.
⭐ **Leçon transposable** : sur un livrable calqué sur la référence FOURNIE par le client, un
« manque » supposé se vérifie d'abord CONTRE SA RÉFÉRENCE, jamais contre une lecture littérale
d'une phrase isolée du brief. → `feedbacks/feedback_ecart-brief-verifier-contre-la-reference-client.md`

### ⭐ SA REPONSE DU 30/08 (apres acceptation) — aucun changement requis
Elle restate sa direction et liste ce qu'elle veut approuver au jalon 1 : « overall meter design,
shape, branding, readability, **placement direction**, and clean "before frost" look ».
✅ **Tout est deja couvert** par les 2 planches. Rien de neuf, rien de contradictoire.
- ⭐ « placement direction » **valide apres coup la decision d'envoyer 2 images** (la planche en
  contexte, decidee avant qu'elle le demande) — sans elle, ce critere serait invalidable.
- ⭐ 3e fois qu'elle re-cadre le « pas encore givre » (25/08, 27/08, 30/08) = c'est SON risque percu.
  Garder le paragraphe du message qui explique POURQUOI le chassis est nu.
- ⛔ Elle ecrit « use the PDF/reference images as the guide » → la reference FAIT AUTORITE.
  Confirme qu'on a eu raison de ne rien inventer (cf. les 2 fausses alertes ci-dessous).
- ⛔ Message ajuste : « a frame from one of your videos » (transparence sur l'origine du fond) +
  « size and placement » (reprend son critere). **Retiree** la phrase « This matches what you said
  about your reference image » — elle vient de le redire, la lui repeter serait de la reformulation.

### ⭐⭐ PLANCHE COMPARATIVE reference vs notre compteur — MESUREE, usage INTERNE
`out/_r-and-d/chill-meter-upwork/jalon1/03-comparaison-reference.png` (extraite du PDF p.6).
- ✅ **Structure fidele a 100 %** : memes bandeaux, meme graduation 0-25-50-75-100, meme barre
  segmentee, meme ligne « 0 = NO CHILL | 100 = MAX CHILL », memes 5 boutons dans le meme ordre,
  meme bouton POWER vertical a droite. Rien n'a ete ajoute ni retire.
- ⭐ **Sa reference fait 1448 x 1086 px = exactement `DEVICE_W` / `DEVICE_H`** du code. Le device a
  ete construit a l'echelle de sa reference.
- **Ecart 1 (voulu)** : sa ref est givree a fond, la notre est le meme appareil degele. C'est LE
  livrable du jalon 1, pas un defaut.
- **Ecart 2 (parti pris)** : sa ref est photorealiste (metal use, texture, profondeur), la notre est
  graphique et nette — ce qui la garde lisible en petit sur une video YouTube. ⚠️ Si elle demande
  plus de matiere, c'est une **vraie revision d'artwork vectoriel**, pas un reglage de parametre.
- ⛔⛔ **NE PAS lui envoyer cette planche.** Mettre sa reference givree a cote de notre chassis
  propre **souligne un manque** au lieu d'expliquer une progression, et ouvre un debat sur la
  matiere qu'elle n'a pas ouvert. Elle connait sa propre reference.

### ⭐⭐ FINITION METAL — 3 dosages, la GRILLE FINIE plutot qu'une seule proposition
**Constat d'Aziz (30/08) en regardant la planche comparative** : notre chassis fait plus « graphique
plat » que metal, la ou sa reference est photorealiste. Verifie dans le code : les rampes metal
culminaient a **#1b212c** (quasi noir) — le brief demande « **silver / frosted metal** » et
« subtle metal casing ». Le probleme n'etait donc PAS le dessin mais le **dosage des valeurs**.

⛔⛔ **Enjeu qui depasse l'esthetique** : le brief exige que le givre « look **physically attached
to the metal surface**, not like a flat graphic placed on top » (p.5). Sur un chassis en aplats,
le givre des jalons 2-3 ressemblera toujours a un calque pose. **Regler la matiere au jalon 1 est
structurel pour la suite** — apres, ca devient une revision qui remet en cause du travail anime.

⛔⛔ **BUG PAYE — la 1re implementation visait des GRADIENTS MORTS** (30/08, 2 rendus perdus).
Symptome : les 3 finitions sortaient **identiques AU BIT PRES** (0 octet different sur 8,3 Mo),
sans erreur ni avertissement. Cause : le fichier definit **39 gradients dont 26 ne sont references
par AUCUN `url(#id)`** — vestiges du mix des 3 planches sources (le chassis retenu est celui de
GPT ; les gradients metal de Fable et Kimi n'ont jamais ete branches). `applyRamp` etait correcte,
elle s'appliquait a du code mort.
✅ **Fix** : rampes pointees sur les 5 gradients REELLEMENT dessines — `gpt_metalOuter` (7 stops),
`gpt_metalInset` (5), `gpt_titlePlate` (5), `gpt_screwFace` (4, les 8 vis), `kimi_btnGrad` (3, les
5 boutons du bas). Mesure apres fix : chassis **22,5 -> 25,3 (brushed) -> 26,7 (machined)** en
moyenne RGB, 1,8 % des octets modifies.
✅ **Garde-fou** : `DRAWN_GRADIENTS` est calcule depuis `G` (les groupes du dessin) et `metalDefs`
**LEVE une erreur** si un id vise n'y figure pas. Un gradient mort = echec **parfaitement
silencieux** : le piege se serait repete au prochain reglage.
⭐ **Verifier avant de viser un id** : `grep -o 'url(#<id>)' ChillMeterDevice.tsx | wc -l`
⭐ **Lecon de methode** : j'ai d'abord annonce « l'effet est trop faible » en REGARDANT l'image,
alors qu'il etait **NUL**. C'est la mesure (diff octet a octet) qui l'a etabli. Un rendu se MESURE
avant d'etre commente — cf. `animation-vs-image-fixe-mesurer-frames-uniques`.

**Ce qui a ete fait (methode retenue par Aziz : passe de matiere sur l'EXISTANT, pas de generation
neuve)** — la structure est fidele a 100 % a sa reference et aux bonnes dimensions, une generation
neuve l'aurait remise en jeu pour gagner de la matiere, et les 4 planches d'aout ont chacune leurs
defauts connus (GPT chevauche les textes, Kimi fade, Grok bonne typo).
- Prop `metal?: "flat" | "brushed" | "machined"` sur `ChillMeterDevice` + `ChillMeterOverlay`.
- ⭐ **Le dessin n'est PAS touche** : `applyRamp()` remplace uniquement les `stop-color` des degrades
  metal deja NOMMES dans le SVG (`fable_g_metal_body`, `_plaque`, `_pipe`, `kimi_metalMain`,
  `_metalBevel`, vis/rivets). Structure, neon, ecran, givre, textes : identiques dans les 3 cas.
- Compositions `ChillMeter-Metal-Brushed` / `-Machined` (1 frame) pour la planche de comparaison.

⭐⭐⭐ **DECISION DE METHODE (Aziz, contre ma reserve initiale — il avait raison)** : presenter
**2-3 directions NOMMEES** ne se lit PAS comme de l'indecision, c'est la **GRILLE FINIE** deja
prouvee sur le son de ce meme contrat (`familles-nommees-pour-faire-trancher-un-client`) :
« un choix propose ne consomme pas de revision ». La distinction qui compte :
- ⛔ **Indecision** = « voici 2 versions, laquelle tu preferes ? » → on lui refile notre arbitrage.
- ✅ **Grille finie** = 2 traitements nommes + definis + **MA RECOMMANDATION explicite**, sur UN
  seul axe encore ouvert. On a tranche, elle garde le dernier mot.
Ici l'axe matiere est le **dernier ouvert** : structure validee par sa propre reference, placement
mesure, « pas givre » acte 3 fois. Le fermer par un choix = zero tour de revision consomme.

### ✅ CHASSIS METAL FINALISE — Fable v2 machined integre au composant (31/08)
Chantier metal boucle en 3 passes, chacune corrigeant un defaut REVELE par Aziz sur la precedente :
1. Redosage manuel des gradients → ECHEC (gradients morts, 0 effet). Cf feedback dedie.
2. Concours 5 modeles → metal excellent, **icy blue PERDU** (sat 0,07-0,26 vs cible 0,32).
   Cf feedback deleguer-un-defaut-nommer-ce-qui-ne-doit-pas-changer.
3. Fable rebriefe avec cible couleur chiffree → couleur juste (0,320/0,325), MAIS **nouvelle
   silhouette** (rect generiques au lieu de nos 32 <path> de production). Cf feedback
   ameliorer-vs-remplacer-preciser-dans-le-brief.
4. Fable v2 : geometrie EXACTE fournie (32 paths extraits du code), interdiction de la modifier.
   **32/32 verifie independamment**, couleur intacte (0,318/0,324), contraste mesure
   (machined 153 vs brushed 122 → **machined retenu**).

✅ **INTEGRE dans `ChillMeterDevice.tsx`** (commit `8ba98e96`) : les groupes chassis/panneau_power/
boutons_bas/plaque_titre remplaces par Fable v2 machined, position d'empilement inchangee.
✅ **Verifie sur rendu Remotion complet** (pas prevue) : Idle (chassis nu) et Fill100 (givre +
glacons par-dessus) — les deux OK, aucune regression.

⭐⭐⭐ Chaine complete = preuve du protocole "montrer avant de juger" : chaque etape semblait
correcte isolement (rendu flatteur), et c'est Aziz qui a repere l'ecart a chaque fois en COMPARANT
au visuel precedent — jamais sur la base d'un rapport texte seul.

### ⛔⛔ AVANT CHAQUE LIVRAISON DE JALON — le reflexe des 2 fausses alertes
Ces 3 questions se posent AVANT d'envoyer, et avant toute "correction" de derniere minute :
1. **L'element que je crois manquant est-il dans SA reference ?** Si non, il n'est pas attendu.
2. **La phrase du brief que j'invoque, dans quelle SECTION est-elle ?** Une exigence rangee sous
   "animation" ne decrit pas un element de design statique.
3. **Existe-t-il une contrainte OPPOSEE dans le meme brief ?** (ex : "sitting on the bottom edge"
   contre "must not block the music video"). Mesurer les deux avant de bouger quoi que ce soit.
Un doute qui survit aux 3 = **une question posee a la cliente**, jamais une modif unilaterale du
design qu'elle s'apprete a approuver. → `feedbacks/feedback_ecart-brief-verifier-contre-la-reference-client.md`

### Ce qui est fait au 30/08
- ✅ **README écrit** (`src/projects/_rnd/chill-meter/README.md`, commit `1794f8bb`, branche
  `feat/chill-meter-jalon1`) — c'était le SEUL livrable contractuel entièrement manquant. Couvre :
  usage CapCut, install, commande de re-render avec les 3 flags obligatoires, carte des fichiers,
  tableau des ajustements courants.
- ✅ **2 planches du jalon 1** : `out/_r-and-d/chill-meter-upwork/jalon1/01-meter-design.png`
  (châssis isolé, agrandi ×1,6) et `02-meter-in-context.png` (composé sur son plateau).
- ✅ **Message de livraison rédigé** (dans la page de pilotage) — sobre, zéro tiret cadratin, zéro
  reformulation, ne présume pas sa décision.
- ⛔ **Envoi VOLONTAIREMENT différé au 31/08** : livrer le 30 au soir, quelques heures après
  signature, se lit comme « c'était en stock » et dévalue les 350 $.

### Vérifié sur le rendu réel (pas sur une note)
Frame 45 de `ChillMeter-Idle.mov`, composée sur `abigirl-decor.png` : châssis propre non givré,
tous les éléments imposés présents (0-100, barre, AbiGirl Reacts, MAX CHILL DETECTION, bouton vert
seul élément vert, palette bleu/blanc), bbox = (96, 684) → (846, 1080), **86,4 % de pixels
totalement transparents**.

### La suite
- **Jalon 2** (7 sept.) : entrance, idle, 0-25 %, givre 50 %. Les rendus existent déjà — restent le
  SON et les ajustements de dosage.
- **Jalon 3** (11 sept.) : 75 %, 100 %, exports finaux + dossier source zippé + README (fait).
- **Le SON** : 15 SFX générés le 29/08 (15/15 exploitables au 1er essai), 3 familles nommées
  (Organique · Impact · Retro-tech), recette versionnée dans
  `scripts/tools/sfx-familles-chill-meter.py`. ⛔ Le showcase v1 est un test jetable (compteur trop
  petit sur fond vide) — le recomposer sur `abigirl-decor.png` avant tout envoi.

---

<details><summary>Historique : l'offre v1 et la demande de révision (29/08)</summary>

### ⛔ La structure réelle : 3 jalons, PAS 6 approbations
Le jalon 2 groupe entrance + idle + 25 % + 50 % en **une seule** validation. Le jalon 3 groupe
75 % + 100 % + exports + source + README. Il n'y a pas d'approbation par état.

### ⭐⭐ SON — testé le 29/08, la faisabilité est levée
**15 SFX générés (ElevenLabs), 15/15 exploitables au 1er essai**, < 2 min, coût négligeable.
⛔ L'estimation « ~5 essais par son » était une prudence mal calibrée — il n'y a pas d'obstacle.
⭐ **La RECETTE est versionnee** : `scripts/tools/sfx-familles-chill-meter.py` (les 15 prompts + durees +
`prompt_influence`) — sans elle, une regeneration repart de zero et l'argument « on change le son sans
retoucher l'image » ne tient plus.
Fichiers : `out/_r-and-d/chill-meter-upwork/sfx-test/` (entrance, fill25, frost50, fill75, boom100
× A-organic / B-impact / C-retrotech). ⚠️ **Préliminaires** — si le design bouge au jalon 1, ils se
régénèrent.

⭐⭐ **Le dispositif retenu (idée d'Aziz)** : 3 FAMILLES NOMMÉES + définies, pas N fichiers.
**Organique** (matière réelle) · **Impact** (sound design, grave, onde) · **Retro-tech** (l'appareil).
⛔ « Cinématique » écarté : un compliment déguisé n'est pas une direction.
Showcase **groupé par état** (les 3 familles dos à dos sur le même moment) → elle choisit palier par
palier. Prototype fait : `showcase/SHOWCASE-sons-v1.mp4` (75 s, 16 segments, carton nommé →
animation → noir). ⛔ **Test jetable, pas envoyable** : compteur trop petit sur fond vide (c'est un
overlay plein cadre — le composer sur `abigirl-decor.png` pour un vrai envoi).
Méthode transposable → `memory/feedbacks/feedback_familles-nommees-pour-faire-trancher-un-client.md`

📄 **Page de pilotage (artifact)** : https://claude.ai/code/artifact/0a83eeba-6b05-4cef-b409-6efcaf482177

### SI LE CONTRAT DÉMARRE, dans cet ordre
1. Jalon 1 = l'image du compteur, **elle existe déjà** (rendu vérifié 27/08). ⛔ Ne PAS livrer en
   3 h : garder au moins une nuit, sinon ça se lit comme « c'était en stock » et ça dévalue le prix.
2. Le README (promis, n'existe toujours pas).
3. Test CapCut refait avec l'audio intégré.
⛔ **Ne PAS lui dire que les 6 états sont déjà rendus** — atout de négociation.

---


</details>

<details><summary>Historique : l'attente de sa décision (23-27/08)</summary>

## ETAT AU 2026-08-27 : ELLE A RÉPONDU 4 FOIS — PHASE FINALE DE DÉCISION

**Chronologie réelle** : 23/08 candidature envoyée · 24/08 elle demande le clip + les livrables ·
25/08 elle pose 4 confirmations + le look glacé · 26/08 « before I make my final decision » + elle
signale l'identité non vérifiée · 27/08 « **I'm reviewing everything carefully now** ».

**CE QU'ELLE A VALIDÉ** (toutes ses questions sont fermées) :
- Exports **ProRes 4444 plein cadre 1920×1080 pré-positionnés** · 6 fichiers séparés par état
- **Dossier source zippé + README** — cadré honnêtement : « ce n'est pas propriétaire, pas lié à moi,
  n'importe quel dev React peut l'ouvrir ; mais dans les deux cas c'est un professionnel qui modifie ».
  Sa réponse : *« that actually makes sense for this project »*.
- Disponibilité future à tarif convenu (porte du retainer) · **2 révisions PAR JALON** · délais 3/5/4 j
- ⭐ **Le malentendu du compteur givré est désamorcé** : elle a écrit *« You are right about the starting
  meter. The reference image I provided is probably closer to the 50 % or 75 % look »*. Le châssis DOIT
  rester propre au départ, sinon la progression du givre n'a nulle part où aller.
  Son exigence : base *« polished, cinematic, cold, high quality »* mais **pas encore fortement givrée**.
- ✅ **Identité vérifiée le 26/08** (badge bleu confirmé sur le profil).

⭐ **Rien en suspens de notre côté.** Relance légitime après **3-4 jours ouvrés** sans nouvelle.

**SI CONTRAT, dans cet ordre** : (1) **le SON** (seul point promis jamais démontré) · (2) **écrire le
README** (promis, n'existe pas) · (3) jalon 1 = l'image du compteur, elle existe déjà (rendu vérifié
le 27/08 : plein cadre, alpha réel 86 %, placement bas-gauche conforme au brief).
⛔ **Ne PAS lui dire que les 6 états sont déjà rendus** — atout de négociation.

⭐ **Leçon de communication tirée de ce dossier** → `feedback_message-client-ne-pas-sonner-genere.md` :
zéro tiret cadratin (5 messages en contenaient) · zéro reformulation · **ne jamais présumer sa
décision** (« if we end up working together », formulation trouvée par Aziz).

<details><summary>Historique : l'envoi du 2026-08-23</summary>

Branche : `feat/proto-chill-meter-upwork` (3 commits, mergeable ou à garder en R&D).

### Ce qui existe sur disque
| Quoi | Où |
|---|---|
| 6 MOV ProRes 4444 **alpha vérifié** (`yuva444p12le`) | `out/_r-and-d/chill-meter-upwork/` |
| Démo 18 s sur le plateau réel (v2 = flocons corrigés) | `out/_r-and-d/chill-meter-upwork/DEMO-FINALE-v2.mp4` |
| 4 planches SVG de l'appareil (kimi/gpt/fable/grok) | idem, `out-*.svg` |
| Code : device + overlay + showcase + planche givre | `src/projects/_rnd/chill-meter/` |
| Briefs réutilisables + script de mix | ce dossier |

✅ **Les 6 MOV sont A JOUR (regeneres le 2026-08-23 16h20, posterieurs au fix `d9737af7`).**
Alpha verifie deux fois — cf. § PROCHAINE SESSION point 2 pour la commande et les mesures.

</details>

</details>

## Historique — préparation de l'envoi (2026-08-23, RÉSOLU)

> Statut au 2026-08-23 17h03 : ① test CapCut **VALIDE** · ② 6 MOV **regeneres et a jour**.
> **Seul reste ③ l'envoi — bloque par les connects a 0** (10 gratuits le 1er du mois).

1. ~~**TEST CAPCUT**~~ ✅ **VALIDE le 2026-08-23 17h03** (Aziz sur CapCut desktop, enregistrement
   d'ecran verifie par Claude : 24 frames couvrant toute la duree + mesure pixel).
   **Ce qui est prouve** : CapCut desktop importe le ProRes 4444 sans broncher (c'etait le point
   d'echec de la version WEB) · l'alpha est correctement interprete a la composition · le cas
   **Fill100** passe (givre + flocons en semi-transparence par-dessus le fond, le cas le plus
   delicat) · 3 clips sur 3 pistes cohabitent.
   Mesure objective : bande horizontale a hauteur du compteur sur le composite Fill100 =
   **7 couleurs distinctes** (les barres de mire traversent le cadre). Un fond opaque aurait
   donne une bande unie.
   ⛔ **Piege a connaitre** : la ou aucun clip ne joue EN DESSOUS, l'overlay s'affiche sur le noir
   du projet. Ce noir est le vide de la timeline, PAS un fond du fichier — le chassis reste
   visible au travers. Ne pas le lire comme un defaut. Cf. [[feedback_transparence-lue-comme-bug]].
   ℹ️ **Materiel de test reutilisable** : `TEST-fond-mouvant.mp4` (mire animee 1920x1080, 15 s,
   generee par `ffmpeg -f lavfi -i testsrc2`) dans le meme dossier. Sa vraie video N'EST PAS sur
   disque et n'est PAS necessaire — on n'avait qu'une image fixe de son plateau
   (`public/_shared/rnd/abigirl-decor.png`). Une mire animee est meilleure pour ce test : le
   mouvement rend un fond opaque immediatement visible.
   ⚠️ Ce test validait SON outil a elle, pas notre rendu (l'alpha etait deja prouve cote ffmpeg).
   ⭐ **A DIRE DANS LA LIVRAISON** (constate 17h09 : le clip Idle avait disparu de l'apercu —
   cause = `Position Y = -1909` dans Transform, un glissement accidentel dans la fenetre
   d'apercu l'avait pousse hors cadre ; Fill100 etait reste a X=0/Y=0 et s'affichait bien).
   Un overlay plein cadre 1920x1080 se deplace d'un simple glissement, et l'editeur ne voit
   alors plus rien sans comprendre pourquoi — il peut conclure que le fichier est casse.
   Donc preciser 2 lignes a la cliente : (1) les MOV sont **en plein cadre 1920x1080, deja
   positionnes** -> deposer tels quels, ne pas les deplacer ; (2) si le compteur disparait,
   c'est **Transform -> reset** (ou X=0 / Y=0), pas le fichier.

2. ~~**REGENERER les 6 MOV**~~ ✅ **FAIT le 2026-08-23 16h20.** Les 6 sont sur disque, alpha
   verifie 2 fois : `pix_fmt = yuva444p12le` sur les 6, ET mesure pixel reelle sur la frame 100
   de Fill100 (**56,1 % de pixels totalement transparents**, coin haut-gauche a alpha 191 = le
   voile de givre, conforme au brief). Frames : Entrance 60 · Idle 90 · Fill25 75 · Fill50 105 ·
   Fill75 105 · Fill100 135.
   ⭐ **Constat au passage** : Entrance/Idle/Fill25/Fill50 sont sortis **octet pour octet identiques**
   aux anciens — normal, `d9737af7` ne touchait qu'aux paliers 75/100 (cristaux + `meterGuard`).
   Le rendu est donc bien deterministe, et seuls 2 fichiers avaient reellement change.

   Commande de reference (les 3 flags restent obligatoires) :
   ```
   npx remotion render ChillMeter-<Etat> out.mov \
     --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
   ```
   Les 3 flags sont obligatoires : sans `--pixel-format`, ProRes retombe SILENCIEUSEMENT en
   `yuv422p12le` SANS alpha, sans erreur. Sans `--image-format=png`, TypeError.
   Verifier apres coup : `ffprobe ... stream=pix_fmt` doit rendre `yuva444p12le` (le `a` = alpha).

3. **ENVOYER LA CANDIDATURE** — tout est redige et en place au 2026-08-23 (voir § CANDIDATURE).

## 📤 PROPOSITION ENVOYÉE — 2026-08-23 (en attente de réponse)

**Envoyée.** Première candidature d'Aziz sur Upwork, moins de 2 jours après la création du profil.
Coût : 7 connects, **pas de boost** (solde ≈143). Pièce jointe : `progressive meter.mp4` (3,2 Mo).

**⛔ DÉCISION (Aziz) : ne RIEN produire de plus avant d'avoir le contrat.** Pas de prototype son,
pas de livrable anticipé. Les 6 états et les animations existent déjà — si le contrat est gagné,
l'essentiel du visuel est fait ; restent le son et des ajustements de dosage (plus/moins de neige,
timing d'une animation).

**PROCHAINE SESSION = seulement si elle répond.** Alors :
1. Lire sa réponse ; si elle négocie ou demande des modifs, arbitrer avec Aziz (le prix de 350 $
   est CELUI DU BRIEF, pas une enchère — ne pas descendre sans contrepartie de périmètre).
2. Si contrat gagné : **prototyper le SON en premier**, c'est le seul point promis non démontré.
   Nos moyens : `scripts/generate-sfx-elevenlabs.py` + 160 SFX déjà produits dans `public/`.
   ⚠️ 2 différences avec nos SFX habituels : (a) matière (craquement de gel, condensation, métal
   qui givre) plutôt que ticks/whooshes d'interface — prévoir ~5 essais par son ; (b) calage sur
   des ÉVÉNEMENTS MÉCANIQUES (impact au sol, clic d'activation, départ de l'onde) et non sur des
   beats narratifs — l'animation étant en code, la frame exacte de chaque événement est connue,
   donc le calage est déterministe. C'est un argument de vente, pas une difficulté.
   Ce que le brief demande par état : entrée = thud + click + power-on · idle = RIEN · 25 % =
   montée légère · 50 % = crackle + pulse + chime + ice-building · 75 % = chime + crackle + vent ·
   100 % = whoosh + boom + chime + crackle + rafale + shimmer.
   ⚠️ Le brief ne précise PAS le format de livraison audio (la section « Final File Exports » ne
   parle que de vidéo). On a proposé des **stems séparés par état** — ça lui laisse le choix de
   mixer contre sa musique. Si elle préfère l'intégré au MOV, faire les deux.
3. Le jalon 1 dépend de SON approbation du design → la relancer plutôt qu'attendre, sinon la date
   du 28 août glisse sans que ce soit notre faute.

⭐ **Leçon confirmée sur un cas réel (Aziz)** : « plus de neige », « animation plus lente » sont des
CHANGEMENTS DE PARAMÈTRE en code. En vidéo générée (MiniMax H3 & co), la même demande impose de
relancer une génération dont le RESTE bougera aussi. Si la cliente avait exigé un livrable vidéo
généré, ces ajustements auraient été bien plus coûteux. C'est le moat « déterminisme » de
`memory/doctrines/PILIERS-B2B.md`, vérifié en conditions réelles.

## ⭐ LE BRIEF CLIENT EST MAINTENANT SUR DISQUE

`BRIEF-CLIENT-ORIGINAL.pdf` (10 pages) dans CE dossier. ⛔ **Gitignore** (7,4 Mo binaire, le repo
fait deja 1,1 Go) — il vit sur disque, pas dans l'historique. Le RELIRE avant toute action sur
cette annonce : cette session a montre qu'un resume ne remplace pas la source (2 erreurs, cf.
[[feedback_reconfronter-brief-original-pas-diff-relatif]] § extension 2026-08-23).

## CANDIDATURE — prete a envoyer (2026-08-23, brief PDF enfin lu)

⭐ **Le PDF de l'annonce a ete fourni par Aziz cette session** — il corrige 2 erreurs que j'avais
faites en travaillant de memoire :
- ⛔ **Il n'y a PAS de champ TITRE** dans le formulaire de proposition Upwork. J'avais redige un
  titre pour rien. Le brief dit « subject line OR title » -> **FROSTY en 1re ligne de la lettre**
  remplit la condition (et c'est mieux : premiere chose lue).
- ⛔ **Le SON est demande partout** (chaque section du brief liste ses SFX : thud, click, crackle,
  chime, whoosh, boom). Notre demo est MUETTE. Traite en promettant des **stems audio separes par
  etat** — defendable et meilleur pour elle (elle mixe contre sa musique), mais c'est une PROMESSE,
  pas une demonstration. Attendre une question la-dessus en entretien.
- ⛔ La reference visuelle est **SON image fournie** (p.5-6), pas un dessin libre. Dire « I built
  the meter » etait trop large -> reformule en « I animated a working version from your reference ».

**2e test d'attention, distinct du mot-code** : la derniere question (« the one small instruction
outside of the design requirements ») attend l'instruction FROSTY elle-meme (p.9, « Attention to
Detail Check »). Y repondre EXPLICITEMENT, ne pas compter sur le mot-code pour le prouver.

**Structure du formulaire** : 1 lettre + **5 questions dans des cases SEPAREES** + pieces jointes.
⛔ Ne pas tout mettre dans la lettre : une case vide se lit comme un trou. La repetition
lettre/cases est normale et attendue.

**Cadrage retenu (correction d'Aziz, juste)** : la lettre laissait croire que TOUT etait deja
construit, alors que le brief demande 8 livrables et qu'on n'a qu'un prototype visuel muet.
Risque double : elle se demande pourquoi elle paie 350 $, OU elle decouvre apres coup que le son
manque. Phrase-cle ajoutee : **« It's a proof of concept, not the finished piece »** — les 3 jalons
redeviennent logiques et l'absence de son est annoncee par nous, pas decouverte par elle.

**Jalons proposes** (dates volontairement avec marge — le jalon 1 depend de SON approbation) :
1 Meter design approved — 28 aout — 105 $ · 2 Entrance/idle/0-25%/50% — 4 sept — 140 $ ·
3 75% + 100% + fichiers finaux — 11 sept — 105 $. Total 350 $. Duree : « Less than 1 month ».

**Piece jointe** : `progressive meter.mp4` (3,2 Mo — la variante avec l'accroche MAX CHILL en tete).
⛔ Limite Upwork = **10 fichiers, 25 Mo chacun**. Joindre le fichier, ne PAS coller de lien.

**Boost : NON.** La proposition coute 7 connects, le bid de boost est a 0 — on peut envoyer sans.
Le boost ne change PAS la visibilite (toutes les propositions restent visibles), seulement l'ORDRE
d'affichage. Preuve terrain : un candidat a mis 15 connects la veille, la cliente s'est connectee
3 h avant et n'avait toujours pas decide. Garder les connects pour le VOLUME de candidatures.

⭐ **Connects : 0,15 $/unite (verifie page officielle), mais un job coute 4 a 16 connects**, pas 1.
100 connects ≈ 10-25 candidatures. Bonus de **50 connects offerts apres le 1er achat** (nouveau
freelance). Recredites souvent si un client interviewe ; jamais rembourses si elle choisit
quelqu'un d'autre ou si l'annonce expire.

ℹ️ **« Interview » a ce niveau de prix = echange ECRIT** dans le fil Upwork, pas une visio. Le mot
est un terme de plateforme designant le moment ou le client engage la conversation.

## ANCIEN BLOC (conserve pour reference)
3. ~~ENVOYER~~ Le profil Upwork est desormais PRET (voir § ci-dessous).
   Le questionnaire a 2 pieges : mot-code **"FROSTY"** dans le titre (PDF p.9) + question sur le
   format transparent (reponse : MOV ProRes 4444).
   ⛔ Connects a 0 au 2026-08-23 : 10 gratuits le 1er du mois, ou en acheter. Sans connects,
   aucune candidature possible.

## ETAT DU PROFIL UPWORK (2026-08-23) — le blocage n'est plus le portfolio

Le profil est rempli et le portfolio est publie : titre, resume, 20 competences, photo,
Working style (« Clear Communicator »), 4 showcases + 11 pieces isolees, toutes en anglais.
Livrables : `out/_r-and-d/portfolio-en/UPWORK/` (+ `showcases/`, `thumbnails/`).

**Ce qui reste ouvert cote profil** : badge d'identite (35 connects — arbitrage d'Aziz :
les candidatures d'abord), aucun temoignage (viendra avec le temps).
✅ **Employment history REMPLI** par Aziz (session du 2026-08-23) — entree « Kora & Cartes /
Founder & Video Director ».

## CE QU'ON A APPRIS (transposable, indépendant de cette annonce)

- **Coût réel mesuré** : 4 planches SVG de l'objet = **0,79 $** (Kimi 0,21 · GPT 0,19 ·
  Grok 0,25 · Fable 0) + 3 planches de givre = 0,48 $. Rendu ProRes 1080p : **53 s** pour 135 frames.
- **Le brief qui DICTE les noms de `<g id>`** rend les planches interchangeables → mix-and-match
  mécanique par script. Sans ça, il faut choisir une seule planche et vivre avec ses défauts.
- **Exiger le châssis PROPRE (sans givre)** alors que la référence client est givrée à 100 % :
  sans cette clause, les paliers 0/25/50 % auraient été impossibles → tout à refaire.
- **Profils des modèles sur objet texturé** (4 testés, même brief, même image) :
  Kimi = le plus propre · GPT = matière la plus riche mais **textes chevauchés** ·
  Fable = meilleur néon, gratuit · **Grok 4.6 = la meilleure typographie, seul sans chevauchement**.
  → Grok entre dans la rotation quand la LISIBILITÉ compte (HUD, habillage de marque).
- **Le marché ne demande pas "du SVG"** : il demande "de l'animation 2D" et un fichier au bon
  format. Le moyen ne l'intéresse pas. Ne jamais vendre la technique, vendre le livrable + la révision.

## GOTCHAS PAYÉS DANS CETTE SESSION

- ⛔ `dangerouslySetInnerHTML` parse en **HTML** → garder le SVG en kebab-case.
  Convertir en camelCase (réflexe JSX) éteint silencieusement les attributs.
- ⛔ Le contrat "prêt à animer" livre `frost_layer`/`icicles` en `opacity="0"`. Si l'enveloppe
  React pilote aussi l'opacité : `0 × frost = 0`, l'élément n'apparaît JAMAIS. Retirer l'attribut figé.
- ⛔ Un gros cercle avec `filter: blur` est rastérisé en **rectangle opaque** en headless.
- ⛔⛔ **La transparence s'AFFICHE comme un rectangle noir** dans les visualiseurs d'images.
  J'ai signalé un bug inexistant et "corrigé" pour rien. Mesurer l'alpha (`getpixel` → `(0,0,0,0)`)
  AVANT de conclure à un défaut de rendu. Cf. [[feedback_transparence-lue-comme-bug]].
- ⛔ `yt-dlp` : 3 installations concurrentes sur cette machine. La seule à jour est
  `/opt/homebrew/Caskroom/miniforge/base/bin/yt-dlp`. Les versions >90 j échouent en 403 sur YouTube.

## RÈGLES PLATEFORME

### ⭐⭐ Lien externe vs piece jointe — TRANCHE le 2026-08-23 (pages officielles Upwork lues)

**Conclusion : joindre le fichier, ne pas coller de lien.** Non pas parce que le lien serait
interdit, mais parce que la piece jointe supprime la question entierement.

Ce que disent les pages officielles (scrapees, pas des forums) :
- La **circonvention** vise les **coordonnees et moyens de contact/paiement hors plateforme** :
  email, telephone, WhatsApp, Telegram, liens de reunion. « Sharing forms of outside communication
  (or any other form of contact outside Upwork) before a contract starts is circumvention. »
  ⛔ Un lien de PORTFOLIO n'y figure pas — c'est ce qu'Aziz avait vu masque en « information
  removed », et ca ne visait pas les liens de travaux.
- **Les propositions acceptent les pieces jointes**, memes types de fichiers que partout ailleurs :
  « The supported file types are the same everywhere attachments are available (proposals, job
  posts, projects, messages, etc.) », **1 Go max par fichier**.
- ⚠️ Le seul risque reel sur un lien (source secondaire, forum) : il devient suspect s'il mene vers
  une page contenant **des coordonnees ou un formulaire de contact**. Un blob nu n'en a pas — mais
  la piece jointe rend le point sans objet.

Sources : `support.upwork.com/hc/en-us/articles/360052511133` (circonvention) ·
`.../360049608113` (partage de fichiers).

### ⭐ Positionnement — ne pas avoir l'air de faire du travail gratuit (Aziz, 2026-08-23)

Le risque n'est PAS qu'elle prenne le travail et parte (un MP4 de demo ne lui sert a rien sans le
projet source ni les 6 MOV). Le risque est de **positionnement** : livrer avant d'avoir parle prix
se lit comme « j'ai besoin du contrat », et devient un argument contre nous a la negociation.
→ Joindre un **extrait court presente comme un test de faisabilite technique**, pas le livrable
presente comme un cadeau. Et **ne pas annoncer qu'on a deja construit les 6 etats** — le garder
pour l'entretien, ou c'est un atout de negociation.

### Divulgation IA — verifie 2026-08-22, sources secondaires
- Upwork n'a **pas** de page de politique dédiée à la divulgation d'IA ; l'obligation générale
  est de « personnellement relire et personnaliser » ce qu'on envoie.
- Upwork **ne scanne pas** les livrables à la recherche d'IA au niveau plateforme. Ce qui compte
  est **ce que le client a spécifié dans SON brief**.
- Depuis le **5 janvier 2026**, Upwork entraîne ses modèles sur le contenu créé sur la plateforme
  (contrats, livrables, pièces jointes, code, messages). Une option de retrait existe.
- ⚠️ **Ce brief-ci n'interdit rien** sur l'IA (contrairement à l'annonce n°2 de la session, qui
  exigeait "ZERO AI GENERATION"). Mais notre pipeline est du **code déterministe**, pas de la
  génération d'image — c'est un argument, pas une zone grise. Le dire dans ces termes.

## LIENS
- Démo v2 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/chill-meter-v2/DEMO-FINALE-qXGU37QYKRIJ9vFvQc3FTqzFOw4cqt.mp4
- Comparatif 4 modèles (artifact) : https://claude.ai/code/artifact/099539be-2871-4bba-9a46-b4752b49bd48
- Chaîne cliente : https://www.youtube.com/@Abigirl_Reacts (107 K abonnés, **1 500 vues médianes**,
  ratio vues/abonnés 0,026 — chaîne à fort volume, faible engagement, monétisation faible).
