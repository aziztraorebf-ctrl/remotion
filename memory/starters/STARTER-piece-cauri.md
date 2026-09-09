# STARTER — Pièce portfolio « Le cauri » — ⛔ R&D CONCLUANTE, CHANTIER CLOS (2026-09-08)

> ⭐⭐ Voir le VERDICT FINAL en bas de fichier avant toute reprise. Retiré de toute liste
> "à publier" — pas au niveau portfolio (verdict Aziz), mais techniques réutilisables
> prouvées (flux continu, R6, morph piloté). Le reste du fichier documente l'historique
> complet du chantier, gardé pour une reprise future si un besoin explicite se présente.

## Où on en est exactement

✅ **Fait** : recherche + brief verrouillés · animatic rendu et validé (rythme) · analyse du
continuous flow TED-Ed (10 règles) · **LA COQUILLE EST DESSINÉE (2026-09-04)**.
⬜ **Pas commencé** : le montage de la pièce définitive, le son.

## ⭐ Le montage (2026-09-06) — piece rendue, 1 defaut ouvert

**Page de suivi (mobile)** : https://claude.ai/code/artifact/cb64511e-047e-4012-aaf2-045646470903
→ la mettre a jour (meme URL, republier le meme chemin de fichier) plutot que d'en creer une autre.

Compo `Cauri-Piece` (`src/projects/_portfolio/cauri/PieceCauri.tsx`), 618 f / 20,6 s.
Rendus : `out/_r-and-d/cauri/piece/piece_v{1..4}.mp4` — **v3 = la reference actuelle**
(v4 est une regression sur le raccord, gardee comme preuve).
Le SVG est consomme via `coquille-geometrie.ts`, regenere par `assets/extraire-paths.py`
(a rejouer apres tout `gen-coquille.py` ; garde-fou sur le ratio h/w).

**Mesure** : 52/52 echantillons uniques (zero-coupe tient) · ecart long/court **5,0x**
(89,7 % vs 18,1 % de la largeur) — meilleur que l'animatic (x5,1 avec des disques).

**3 corrections apres regard** (chacune une CAUSE, pas un dosage) :
- N 260 -> 90 (dans `animatic-timing.ts`). 260 venait de l'animatic ou les particules etaient
  des disques de 4-7 px. Gain reel : a 90 le grain passe au-dessus du seuil 18 px, donc la
  fente reste visible dans les flux — R6 redevient lisible dans les 5 roles.
- Effondrement : x tire uniformement sur 76 % de la largeur => bande reguliere (« deplacement
  lateral »). Refait en vrai tas autour du pied de la colonne.
- Le semis naissait agglutine au centre : il partait de la forme de la coquille (vestige de
  l'animatic ou les particules la COMPOSAIENT). Part desormais de ses propres positions.

✅ **RESOLU le 2026-09-06 — le raccord 1->2 lit comme un recul** (rendu `piece_v5.mp4`,
la reference actuelle ; v1-v4 gardes comme preuves des symptomes).
Diagnostic delegue (protocole 2+ echecs) puis VERIFIE dans le code avant application.

⭐⭐ **Mon hypothese etait FAUSSE** : je croyais qu'il manquait de la matiere a l'etat 1 et
qu'il faudrait changer `LARGEUR_ROLE.coquille`. En realite **le dispositif de recul existait
DEJA** (l'IRIS d'`animatic-timing.ts`) — je ne l'avais pas vu et j'en avais construit un
second par-dessus. Le doublon = le mur du v4. ⛔ Aucune valeur creative n'a bouge (ni la
taille de la coquille, ni la duree de l'etat 1).

3 causes, toutes de CABLAGE, aucune de dosage :
- `nomPrecedent` (PieceCauri.tsx) : j'avais corrige `cibleDepart` (les POSITIONS) sans
  etendre a `largeurDepart`/`angleDepart` → le semis demarrait a 240 px au lieu de 34.
  Mon propre correctif applique a moitie. Mesure : occupation ecran 85,9 % → 22,4 % max.
  → `feedback_correction-appliquee-a-moitie-etendre-a-tous-les-derives` ⭐⭐⭐
- `zoomCamera` : `return 1` hors fenetre IRIS, y compris AVANT le 1er passage → le zoom
  sautait de 1,00 a 2,40 en UNE frame (240→576 px entre t=1,9 et 2,0 s). Le recul
  commencait par une COUPE, sur une piece dont la contrainte est le zero-coupe.
- 3e cause trouvee en verifiant les 2 autres : ma 1re version du fix mettait le `return`
  DANS la boucle → sortie au 1er passage, le 2e IRIS (6->7) ne se declenchait plus (zoom
  plat a 1,0, la boucle de fin se serait refermee par une coupe). Attrapee en SIMULANT la
  fonction sur les 618 frames AVANT de rendre — invisible sur une planche de vignettes.

⛔ `semisEchelle` reste a 1 : le 2e mouvement d'echelle du dispositif est ici porte par la
camera IRIS (qui n'existe pas dans `IntroSignalOrbit`). L'ajouter = appliquer le recul deux
fois, c'est exactement l'erreur du v4.

⭐ **Le morph pilote a donc son 2e cas d'usage, et il CONFIRME la forme** — avec une
condition apprise a y ajouter : verifier qu'un dispositif de recul n'existe pas DEJA dans le
timing avant d'en coder un. Toujours PAS de composant generique (2 cas, formes differentes :
ici la camera porte la moitie du dispositif, la-bas non).

## ⭐ Le son (2026-09-06) — 3 familles generees, a l'ecoute

Proposition d'Aziz suivie : produire 3 registres plutot qu'un seul, choisir a l'oreille
(generation ElevenLabs fiable au 1er tir, cout du test faible). **Page mise a jour, meme
lien** : https://claude.ai/code/artifact/cb64511e-047e-4012-aaf2-045646470903

- `scripts/tools/cauri-sfx-3-familles.py` — genere les 24 sons (8 gestes x 3 familles :
  matiere/monnaie/abstrait), prompts versionnes dans le script. Chaque geste cale sur un
  instant MESURE par `sfx-cues.py` sur `piece_v5.mp4` — 2 verdicts de l'outil corriges a
  la main (geste le plus intense place a tort dans l'etat 7 "calme" = la remontee du zoom
  de la boucle ; effondrement quasi invisible pour l'outil alors que c'est le pic).
- `scripts/tools/cauri-monter-son.py` — monte chaque famille sur la video, regle du
  CREUX du brief §7 appliquee (lit coupe 0,5s avant l'impact, revient 0,7s apres).
- Sorties : `out/_r-and-d/cauri/son/{matiere,monnaie,abstrait}-monte.mp4` (full HD) et
  `-web.mp4` (720p, pour la page).

⛔ 2 bugs de mix trouves en MESURANT (silencedetect), pas a l'oreille : les 3 prompts
"lit" ne sortent pas au meme niveau (matiere/monnaie ~-35 dB, abstrait -3,3 dB) → gain
par famille ; `matiere/lit` a un vrai swell dont l'enveloppe MONTE (-84→-25 dB) → un
gain fixe ne corrige pas une enveloppe qui varie, `dynaudnorm` avant le gain a regle ca.

✅ **Verdict Aziz (2026-09-08) : Abstrait retenu**, mais le lit texture ("bruit de fond")
est agacant, a retirer. Decision : remplacer le lit par une MUSIQUE du catalogue existant
(pas de nouvelle generation), et ajouter une NARRATION complete via le pipeline GeoAfrique
plutot que les 2 reperes texte a l'ecran seuls.

⭐ **Narration generee** (`scripts/generate-narration-expressive.py`, Harmonie V3 -> STS
GeoAfrique). Texte : `out/_r-and-d/cauri/son/narration-texte-v2.txt` (hors repo, gitignore).
27,4s au 1er jet (trop de `[pause]` explicites cumules aux pauses V3 implicites) → 23,1s
apres retrait des pauses redondantes, SANS toucher au sens (pas de 3e regeneration sur
texte deja correct — regle fiche audio).

⭐⭐ **La piece est etiree a 23,1s** (facteur x1,1204, commit `ffed8889` sur
`cauri-son-2026-09-06`) pour caler sur la voix plutot que l'inverse — rythme RELATIF entre
les 7 etats intact (memes proportions que le decoupage valide sur l'animatic gris a 20,6s).
Rendu `piece_v6.mp4` verifie : 692 frames, 58/58 echantillons uniques, zero coupe.

✅ **Musique choisie (2026-09-08) : `data-viz-explainer/bg-music.mp3`** (catalogue existant,
bouclee x2 pour 23,1s, volume 0.16 en soutien sous la voix — remplace le lit texture retire).

✅ **MIX FINAL MONTE** : `scripts/tools/cauri-mix-final.py` (commit `b896ecf3`). Sortie :
`out/_r-and-d/cauri/son/cauri-mix-final.mp4` (23,07s). Musique + narration + les 8 gestes
du registre Abstrait tres attenues (0,28-0,35), sauf l'impact qui reste net (0,55) —
seul son au premier plan, conforme au brief §7.

⛔ **2 bugs trouves et corriges en mesurant, pas a l'oreille** :
1. Le CREUX chevauchait le son de l'impact lui-meme au lieu de le PRECEDER puis le laisser
   seul — la fenetre remontait a IMPACT_T+0.7s alors que `impact.mp3` dure 1,2s : musique et
   voix remontaient PENDANT que l'impact sonnait encore. Fenetre corrigee (remonte apres la
   fin reelle du son). Verifie : -29 dB avant -> **-39 dB juste avant l'impact** (le vrai
   silence relatif) -> impact seul -> retour a -27 dB.
2. Piege ffmpeg trouve EN CHEMIN (pas le vrai bug, mais a fausse le diagnostic) : `-ss`/`-t`
   places APRES `-i` bornent le MUXER, pas le graphe de filtres — `volumedetect` voit alors
   tout le flux restant et affiche une moyenne plate sur ~18s au lieu de la fenetre de mesure
   voulue. Toujours placer `-ss`/`-t` AVANT `-i` pour mesurer un extrait, ou utiliser `atrim`
   dans le filter_complex (insensible a l'ordre des flags). Delegue a un agent dedie
   (protocole 2+ echecs, cf. `feedback_correction-appliquee-a-moitie...`) qui a isole ce
   piege — mais la cause du symptome rapporte etait le bug §1, pas celui-ci : les deux se
   sont superposes, le rapport de l'agent n'a resolu qu'un des deux problemes.

## ✅✅ VERDICT FINAL (2026-09-08) — R&D CONCLUANTE, CHANTIER CLOS

Apres 4 variantes de fond testees (3 SVG procedurales dans `fond-vivant.tsx` + 1 decor
dessine par le svg-dessinateur) et 1 test MiniMax H3 (Comfy Cloud, gratuit), tous montes
avec le mix son complet (musique + narration GeoAfrique + gestes) sur la page de suivi :

**Verdict d'Aziz, mot pour mot** : « ça fonctionne assez bien [...] on a peut-etre montre
qu'on pouvait faire des choses en continu si ceci etait le but [...] je ne l'utiliserai pas
comme piece de portfolio [...] ce n'est pas assez travaille, clairement pas du niveau de
TED-Ed. Mais on a atteint notre objectif. »

⭐⭐ **Ce que le chantier a REELLEMENT prouve** (ce qui reste exploitable au-dela de cette
piece precise) :
- La contrainte UNE SEULE PRISE / ZERO COUPE tient sur 23s avec un sujet reel, via une
  chaine de dispositifs MESURES sur une reference externe (ancre · iris · morph pilote ·
  mise en file) plutot qu'inventes a l'aveugle — cf. R1-R10 de l'analyse continuous-flow.
- R6 (une primitive, plusieurs roles par echelle/groupement/orientation) fonctionne en
  pratique, pas seulement en theorie : la meme coquille tient 5 roles distincts.
- Le morph pilote (nuance a R5) a son 2e cas d'usage confirme — la forme tient.
- La regle du CREUX sonore (silence relatif avant l'impact, pas un pic) fonctionne avec
  une narration par-dessus, moyennant un ducking de la voix elle-meme sur la fenetre.
- 3 familles sonores generees et comparees en une passe (ElevenLabs, fiable au 1er tir) —
  methode reutilisable pour tout futur choix de registre sonore.

⛔ **Ce qui n'a jamais eu de vraie passe de finition** (pourquoi ce n'est pas portfolio) :
le fond (4 tests, 0 choisi/peaufine), le mix (bon mais pas mixe en studio), aucun repere
texte a l'ecran pose. Ce n'est pas un echec — TED-Ed itere sur des mois, ce chantier a
tourne sur quelques sessions. La piece a rempli sa fonction de test de faisabilite.

**Statut** : retire de toute liste "a publier"/"portfolio actif". Le code, les rendus et
la branche `cauri-son-2026-09-06` restent sur disque pour une reprise future si un besoin
explicite se presente — rien n'a ete supprime, seulement classe.



## ⭐⭐ Nuance à R5 — LE MORPH PILOTÉ (apport hors chantier, 2026-09-06)

Une session parallèle (candidature Upwork) a validé sans le chercher un 3e dispositif, utile
au raccord 1→2 du cauri. Ajouté au § 4 du brief ET avant R6 dans l'ANALYSE-CONTINUOUS-FLOW.

**Le piège documenté** (§ 4) disait : jamais position ET zoom sur la même fenêtre, « les deux
mouvements se contrarient » — solution en 2 temps. **C'est vrai seulement si on INTERPOLE des
coordonnées.** Si on SUBSTITUE, les deux peuvent bouger ensemble : échelle continue + fondu
croisé entre deux dessins qui n'ont pas la même projection. Le contenu ne se déplace pas
pendant le dézoom, il se remplace — l'œil lit un seul recul, ce sont deux images distinctes.

Preuve regardée et vérifiée à l'époque : `src/projects/_rnd/upwork-earthtosuzy/IntroSignalOrbit.tsx`
(rapatrié sur master le 2026-09-08 depuis `feat/upwork-earthtosuzy-intro`, jamais mergée —
⛔ le rendu `orbit-hook.mp4` cité alors, lui, reste UNIQUEMENT sur disque local sous `out/`
qui est gitignoré : 135/135 frames uniques mesurées sur le moment, non re-vérifiable depuis
ce repo). Dans le code : `arcScale` 2,6→0,92 et `arcOpacity`→0 pendant que
`globeIn`/`globeScale` monte. À t=1,2 s les deux coexistent visiblement — c'est ça, la preuve.

**Pourquoi ça s'applique ici** : nos états 1 (coquille dessinée, détaillée) et 2 (semis de
petites coquilles) ne partagent pas de projection non plus. Donc applicable aux raccords 1→2
et 6→7, et ça évite d'étaler le raccord en 2 temps.

⚠️ **Un seul cas d'usage à ce jour — le cauri sera le 2e**, celui qui confirme ou infirme la
forme. ⛔ Ne PAS extraire de composant générique avant (documenter le principe avant de
généraliser en code). Noter au montage ce qui tient et ce qui casse.

⚠️ **Ne pas confondre avec R6** : R6 = une primitive change de SENS (notre coquille, 5 rôles).
Le morph piloté = on change ce qu'on REGARDE en changeant d'échelle. Les deux se cumulent.
Cas pur de R6 dans le même dossier : `src/projects/_rnd/upwork-earthtosuzy/IntroRouteRelay.tsx`
(une trajectoire devient tir, point GPS, orbite, puis route) — code rapatrié sur master,
son rendu `relay-hook.mp4` reste lui aussi hors dépôt (gitignoré).

✅ *(obsolète, réalisé depuis — gardé comme trace historique)* **Prochaine étape concrète** :
monter la pièce définitive — remplacer les particules grises de `AnimaticCauri.tsx` par la
vraie coquille, en reprenant `animatic-timing.ts` tel quel (il est conçu pour survivre). C'est
là que se règle le piège de séquencement IRIS (§ 4 du brief), qui n'a volontairement pas été
corrigé sur l'animatic gris. → Fait : voir `PieceCauri.tsx` et le VERDICT FINAL en tête/fin
de ce fichier pour l'état réel du chantier (clos).

## ⭐ La coquille (2026-09-04)

`out/_r-and-d/cauri/coquille/` — `coquille.svg` + `gen-coquille.py` rejouable +
`planche-echelles.png` (preuve aux 5 tailles) + `NOTES.md`.
Structure : `<g id="cauri">` (porte le translate, dessin autour de (0,0)) contenant
`silhouette` + `fente`. Zéro dégradé/filtre/stroke/`<text>`, aplats purs.

**Les 2 choix tranchés avant de lancer** : palette dès le départ (pas de neutre) · silhouette
forte + un seul détail signature, en calque détachable.

**Les 3 acquis mesurés** (détail au § 4 du brief, qui fait autorité) :
1. ⛔ **Seuil 18 px** : sous 18 px de large, masquer `fente`. Vient du REGARD — les 2 contrôles
   automatiques répondaient « lisible jusqu'à 10 px » et pointaient à l'envers.
2. ⛔ **Le brief se trompait sur la morpho** : le cauri est plus HAUT que large (h/w 1,36
   mesuré sur photos). L'agent a corrigé au lieu de dessiner ce qu'on lui disait.
3. ⭐ **Orientation par rôle (décision Aziz)** : dressée aux états 1-2, couchée dans les flux
   et la colonne (3-4-5), dispersée pour les débris (6). Nuance à R6 : la primitive change
   d'échelle, de groupement ET d'orientation. Se fait par `rotate()`, zéro redessin.

## ⭐ Comparaison faite avec GGW et cacao (2026-09-03) — DÉCISION : on garde le flux continu

Aziz s'est rappelé de 2 pièces narratives SVG pur déjà publiées, registre parchemin
noir&blanc : `out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.mp4` (2min21, 7 beats, validé
25/06) et `out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4` (98,5s, 5 beats, validé 29/06).

Revu les deux à l'image. Elles ont déjà, sans qu'on l'ait théorisé, plusieurs dispositifs de
l'analyse continuous-flow : réassignation d'une primitive (cabosse, arbre), une ANCRE (portrait
médaillon qui traverse GGW), une coupe verticale sol/racines proche du rig `ReseauPropagation`.
GGW a un vrai rythme de silences audio (33 pauses/141s) ; cacao presque aucun (1/98s) — à
vérifier si voulu, ou à corriger si on reprend cette référence plus tard.

**Ce qu'elles n'ont PAS** : ce sont des BEATS (des écrans qui se suivent), pas un flux continu
où une forme devient la suivante sans repasser par un cadre neutre. ⭐ **Décision d'Aziz : on
continue sur le flux continu.** GGW/cacao restent une référence de registre visuel.

## ⭐ Comparaison faite avec GGW et cacao (2026-09-03) — DÉCISION : on garde le flux continu

Aziz s'est rappelé de 2 pièces narratives SVG pur déjà publiées, registre parchemin
noir&blanc : `out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.mp4` (2min21, 7 beats, validé
25/06) et `out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4` (98,5s, 5 beats, validé 29/06).
Question posée : est-ce qu'on a déjà la solution, sans avoir besoin du chantier cauri ?

**Revu les deux à l'image (frames échantillonnées + mesure des silences audio).** Elles ont
déjà, sans qu'on l'ait théorisé, plusieurs des dispositifs de l'analyse continuous-flow :
réassignation d'une primitive (cabosse, arbre), une ANCRE (portrait médaillon qui traverse
GGW), une coupe verticale sol/racines proche du rig `ReseauPropagation`. GGW a un vrai
rythme de silences audio (33 pauses/141s) ; cacao presque aucun (1/98s) — a verifier si
voulu ou a corriger si on reprend cette reference plus tard.

**Ce qu'elles n'ont PAS** : ce sont des BEATS (des écrans qui se suivent), pas un flux
continu où une forme devient la suivante sans repasser par un cadre neutre — exactement
la distinction qu'Aziz a formulée lui-même. Donc le morphing continu qu'on vise avec le
cauri est une vraie première pour la production, pas une redite de GGW/cacao.

⭐ **Décision d'Aziz : on continue sur le flux continu**, tel que construit dans ce
chantier. GGW/cacao restent une référence de registre visuel (parchemin, réassignation,
ancre) à consulter si utile, mais ne remplacent pas le chantier cauri.

## ⭐ Ce qui a CHANGÉ le 2026-09-03 (3e session, courte)

- **Test du dispositif IRIS fait sur l'animatic gris** (question d'Aziz : « est-ce que la
  caméra bouge dans la référence ? »). Réponse mesurée : oui, 45 % du temps notable / 25 %
  franchement, mais SEULEMENT pendant les transitions — jamais en continu (règle R10).
- ⛔ **Piège trouvé et documenté au § 4 du brief** : l'IRIS ne se fait PAS en bougeant le zoom
  et le contenu sur la même fenêtre temporelle — les deux mouvements se contrarient (le semis
  qui apparaît en périphérie pendant que le cadre recule). L'ordre correct est en 2 temps :
  contenu déjà en place sous cadre serré, PUIS SEULEMENT le dézoom qui le révèle.
- **Décision : pas de v3 de correction sur l'animatic gris.** Le défaut est un problème de
  TIMING, pas de dessin — il se réglera directement sur la vraie coquille, où ce genre de
  séquencement se juge mieux que sur des cercles gris. `animatic_v2_iris.mp4` reste comme
  preuve du piège, `animatic_v1.mp4` reste la référence de rythme validée.
- **Rien d'autre n'a bougé** : le rythme (20,6 s), l'écart long/court, les 4 dispositifs et
  les 3 règles sonores du § 4-7 restent ce qui a été verrouillé le 2026-09-02 ci-dessous.

## ⭐ Ce qui a CHANGÉ le 2026-09-02 (2e session)

- **La contrainte de morphing est ASSOUPLIE** (décision Aziz, sur mesure). Le § 4 exigeait
  « topologies compatibles, nombre de points constant » : abandonné. La référence TED-Ed ne
  fait **aucun morph de path** sur 5 min (zéro cas), pour **une seule coupe franche**.
  → Le zéro-coupe repose désormais sur **4 dispositifs nommés** (ancre · iris · réassignation ·
  mise en file) — cf. § 4 du brief, tableau. Toute transition doit en employer au moins un.
- **Le son a 3 règles mesurées** (§ 7 du brief), dont une contre-intuitive : ⛔ **l'effondrement
  se marque par un CREUX sonore, pas par un pic** — couper le lit 0,5 s avant l'impact.
- **L'animatic existe** : `out/_r-and-d/cauri/animatic/animatic_v1.mp4` (20,6 s, gris neutre,
  jetable). Composition Remotion `Cauri-Animatic`, code dans `src/projects/_portfolio/cauri/`.
  Le fichier `animatic-timing.ts` est conçu pour SURVIVRE : le timing s'y règle, le dessin
  définitif le reprend tel quel. Page de suivi : voir `memory/INDEX-LIENS.md`.
- **Mesuré sur l'animatic** : 42 frames uniques sur 42 échantillons (aucun gel) · flux long
  88 % de la largeur vs flux court 17 % (densité ×5,1) · 20,6 s, dans la cible.

## Les 2 fichiers à lire (dans cet ordre)

1. **`out/_r-and-d/cauri/BRIEF-PIECE.md`** ⭐ — le brief complet : propos, chaîne de formes,
   palette, son, et surtout les **5 interdits factuels**. Tout est décidé, rien à re-trancher.
   ⚠️ § 4 et § 7 ont été RÉÉCRITS le 2026-09-02 — lire les blocs marqués « ASSOUPLI » / « règles
   mesurées », ils remplacent ce qu'un souvenir de la 1re session pourrait contenir.
1bis. **`out/_r-and-d/fable-vs-opus-ted-ed-style/source-ted-ed/ANALYSE-CONTINUOUS-FLOW.md`** ⭐⭐
   — les 10 règles R1-R10 (durées de transition, ancre, iris, son). Le § 6 est la partie utile.
   ⭐ **AJOUT 2026-09-06 : la NUANCE À R5 (« le morph piloté »)** — une 3e voie au piège de
   l'IRIS documenté au § 4 du brief. Zoom ET contenu peuvent bouger EN MÊME TEMPS si on
   substitue deux dessins (échelle + fondu croisé) au lieu d'interpoler des coordonnées.
   Preuve mesurée hors chantier cauri : `src/projects/_rnd/upwork-earthtosuzy/IntroSignalOrbit.tsx`.
   ⚠️ 1 seul cas d'usage — le cauri sera le 2e, celui qui confirme ou infirme la forme.
2. `out/_r-and-d/cauri/RECHERCHE.md` — le dossier sourcé (576 lignes) si un fait doit être
   vérifié ou approfondi. Distingue explicitement [ÉTABLI] / [DÉBATTU] / [APPROXIMATIF].

## Les décisions déjà prises (ne pas re-discuter)

| Sujet | Décision |
|---|---|
| Nature de la pièce | Portfolio **autonome**, PAS le pilote d'une série (« ce n'est pas non plus le début d'une vidéo complète, ce n'est pas mon but ») |
| Format | 15-25 s, **une seule prise, zéro coupe** |
| Mécanisme | « La valeur tenait à la distance » — inflation par choc d'offre |
| Palette | Tirée du sujet (bleu océan, nacre, ocre, rouge-brun), ⛔ PAS les aplats acides TED-Ed |
| Géographie | Abstraite, distance suggérée — pas de carte |
| Texte à l'écran | 2 repères seulement : « 1845 » et « près de 40 000 tonnes » |
| Traite négrière | ⛔ **NON abordée** — cf. § 3 du brief, raison documentée |
| Son | Dans le brief dès le départ, colonne par colonne |

## ⛔ Le piège principal, à ne pas répéter

**J'avais proposé « 8 000 km » comme repère à l'écran. C'était inventé** — absent du dossier
de recherche. Attrapé en relisant les sources avant d'écrire le brief.
→ Tout chiffre affiché doit venir de `RECHERCHE.md`, jamais d'une estimation de mémoire.

Autres corrections que la recherche a apportées (détail § 3 du brief) : la route principale
du cauri était le **Bengale**, pas l'Afrique ; le cauri ne vit pas en Afrique de l'Ouest.

## Contexte utile

- **Les 3 repros TED-Ed** (réseau, chasseurs, balançoire) sont de la **R&D interne, jamais
  montrées** : `out/_r-and-d/fable-vs-opus-ted-ed-style/STATUT.md`. Ce qu'on en garde, ce
  sont les **rigs** (propagation par graphe, trajectoire+impact, bascule) — réutilisables ici.
- **La vidéo source est conservée** : `out/_r-and-d/fable-vs-opus-ted-ed-style/source-ted-ed/`
  ⭐ Son README liste ce qu'il RESTE à en apprendre — surtout l'analyse du **continuous flow**,
  jamais faite sérieusement, et le relevé du **design sonore**.
- Feedbacks écrits cette session : `morphing-continu-se-prepare-au-dessin` ·
  `son-dans-le-brief-des-le-depart` · `reproduction-fidele-nest-pas-une-piece-portfolio`.

## Ce qu'on cherche à mesurer avec cette pièce

1. ✅ **TRANCHÉ sur l'animatic** : le zéro-coupe tient (42/42 frames uniques). Reste à le
   re-vérifier une fois le vrai dessin en place, avec les 4 dispositifs et non plus la
   structure à particules de l'animatic.
2. Un spectateur non briefé comprend-il « c'était rare, puis ça ne l'était plus » ?
3. **Le coût réel de production d'une scène** — chiffre attendu avant d'envisager quoi que
   ce soit de plus long.
