# ⭐ ETAT GGW MURAILLE VERTE — SOURCE DE VERITE UNIQUE (Short SVG pilote #1)

> Cree 2026-06-24. CE FICHIER est la SEULE source de verite du statut/registre/outils du short.
> En cas de contradiction avec un autre fichier (STORYBOARD, STARTER, REPRISE...), CE FICHIER prime.
> Tout agent qui produit un beat de ce short PART D'ICI. Doctrine SVG generale : [[SVG-SCENES-GENERATIVES]].

## ✅✅ STATUT FINAL — PRET A PUBLIER (2026-06-25)
Fichier : `out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.mp4` (17 Mo, 140.99s, 7 beats)
Blob permanent : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/ggw-FINAL-v3-GxFL2poUa84eU3ZcHAIEy17CUFfvgT.mp4
Note publication : `out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.PUBLICATION-NOTE.md`
▶ Publier via TryPost (Instagram Reels) dès crédits rechargés.

## SUJET / ANGLE (fige)
Short vertical 9:16, ~141s, 7 beats. Grande Muraille Verte (mur d'arbres 8000km cense arreter le desert).
Etoile polaire : "On a cru qu'on arreterait le desert avec un mur d'arbres. On avait tort — la vraie
solution etait deja sous nos pieds." Ton = analyste qui revele un retournement (pas militant). Script
parle fige : [[SCRIPT-PILOTE-v1]]. Storyboard 6 beats (le WHAT par beat) : [[STORYBOARD-PILOTE]].

## ⛔ REGISTRE TRANCHE (definitif, PAS un A/B)
**ENCRE NARRATIVE pour TOUT le short** (trait brun-noir sur parchemin creme #e8dcc0, encre #2b2117).
Raison : meilleur CANEVAS pour la colorisation semantique timee (monde inerte en encre -> la vie/le sens
apparait en couleur a un instant precis). Le braise-or et le d3-geo/carte top-down sont ABANDONNES pour
ce short (le d3-geo reste un acquis reutilisable AILLEURS, pas ici). Ne PAS relancer un A/B de registre.

## ⛔⛔ CORRECTION FACTUELLE MAJEURE (2026-06-25) — TOUT recentre sur la FMNR
L'ancien script melangeait 2 techniques DISTINCTES comme si c'en etait une seule : les DEMI-LUNES/zai (creuser,
capter l'eau, nappe +17m, Yacouba Sawadogo/Burkina, qui PLANTE) ET la FMNR (proteger les souches vivantes, SANS
planter, 200M arbres, Tony Rinaudo/Niger). « Sans planter un seul arbre » = Rinaudo/FMNR, PAS Sawadogo. Aziz a
rattrape l'erreur. -> B4 et B5 REFAITS en FMNR pur ; B2 corrige (Nigeria/2 mois invente -> Sahel/8 sur 10, sourcé).
2 gates gravees dans [[key-learnings]] : fact-check d'ATTRIBUTION (qui a fait quoi, antériorité) + COHERENCE INTER-BEATS.
⛔ Le portrait HUMAIN = vraie photo -> Gemini stylise en gravure encre (gemini-gen-image-ref.py) — JAMAIS un portrait SVG (uncanny).

## ✅ STATUT DES 7 BEATS — TOUS FINAUX + ASSEMBLES

| Beat | Sujet | Statut | Composant | Render FINAL |
|---|---|---|---|---|
| 1 HOOK | le plus grand mur vivant + open loop | ✅ FAIT + KARAOKE AJOUTE | `GgwHookEncreVivant.tsx` | catbox uwp4gq |
| 2 L'ECHEC | Sahel ~8/10 meurent, 1/36 Senegal | ✅ FAIT (corrige Nigeria->Sahel) | `B2LigneBrisee.tsx` (606f) | beat2-FINAL.mp4 · catbox x0jp5l |
| 3 LE MALENTENDU | le desert n'avance pas comme un mur | ✅ FAIT | `B3Malentendu.tsx` | beat3-FINAL.mp4 · catbox s2qqrm |
| 4 RETOURNEMENT (FMNR) | Rinaudo + souches qui repoussent | ✅ FAIT (FMNR) | `B4Demilune.tsx` (750f) | beat4-FINAL.mp4 · catbox du27wm |
| 5 LA PREUVE | 200M arbres FMNR + ombre/sols/recoltes | ✅ FAIT (FMNR) | `B5LaPreuve.tsx` (424f) | beat5-FINAL.mp4 · catbox 7n30x2 |
| 6 OUTRO | la lecon + boucle verte | ✅ FAIT (FMNR-coherent) | `B6Outro.tsx` (690f) | beat6-FINAL.mp4 · catbox kpdw3x |
| 7 MOSAIQUE VIVANTE + CTA | foret qui revient + abonnement | ✅ FAIT (2026-06-25) | `B7MosaiqueFinal.tsx` (642f) | dans assemblage final |

**✅ SHORT GGW TERMINÉ — PRÊT À PUBLIER (2026-06-25).** 7 beats + assemblage + musique Minimax intégrée.
Durees @30 : B1=640 · B2=606 · B3=468 · B4=750 · B5=424 · B6=690 · B7=642 (total 140.99s).
CTA B7 : "Abonne-toi pour d'autres sujets fascinants sur l'Afrique d'aujourd'hui." (positionne chaine geopolitique africaine)
Commits : B5+B6 `1140091` · B4+B5 FMNR `1c16f79` · B2 corrige `1b8b768` · B7+karaoke B1+assemblage `en cours`.
⭐ Portraits graves dispo : `public/assets/ggw-muraille-verte/{rinaudo,sawadogo}-portrait-encre.png` (Sawadogo non utilise, garde).
⛔ COMMIT B5+B6 = `1140091` sur branche `feat/shorts-svg-muraille-verte`.

**✅ TEST 2 SCENES EN PARALLELE = REUSSI (2026-06-25)** : B5 + B6 produits par 4 agents en parallele (Phase 1
ideation/cibles ×2, Phase 2 animation ×2), puis finitions codees en direct par Claude. Le parallelisme tient
(fichiers TSX distincts, Root.tsx PRE-CABLE par le chef avant de lancer les agents = zero collision). Suite de la
preuve "1 agent fait ~90% seul" (Beat 3). Specificites B3 gravees : le mur RESTE tout du long (pas de dissolution =
"le mur ne sert a rien") · couleur-diagnostic ocre #b5651d sur le sol mort · karaoke decoupe par PHRASE_BREAKS
(index de mots, PAS silence auto — sinon bloc illisible).

**⭐ ACQUIS B5+B6 (graves cette session)** :
- **Reutiliser un composant entre beats = cohérence** : B5 a repris TreeTrunk+LeafyCrown+Roots de B3 (meme dessin
  d'arbre, positions conservees) au lieu d'un modele neuf qui detonnait. La force du SVG : meme composant, on change
  juste la position/couleur. Aziz l'a explicitement demande.
- **BOUCLER LA BOUCLE en fin de short** (B6) : la derniere image fait ECHO au probleme initial mais RESOLU (le mur
  d'arbres MORTS du hook/B2 REVERDIT a la fin grace a la graine paysanne qui remonte). Climax emotionnel qui paie
  l'etoile polaire. Geste : une racine couleur terre qui MONTE du sol vers les arbres (connexion visible) -> verdissement en cascade.
- **EXPLOITER un silence audio par de l'animation** (B6, silence ~4s) : un reseau racinaire qui s'illumine (graines
  qui s'eveillent + filaments traces entre elles) = la vie souterraine qui se reveille. Un silence n'est PAS un vide, c'est un temps narratif a meubler.
- **Objet vivant qui RESTE > qui meurt** (B6) : une graine verte qui se decroche et tombe donne l'impression qu'elle
  MEURT (contresens). Les graines vivantes RESTENT en place. (Corollaire inverse du "mur qui ment et reste" de B3.)
- **Fin NON statique** : prolonger une fin de scene de 2-3s = OK, mais l'image finale doit VIVRE (feuilles au vent,
  vie souterraine qui pulse), jamais figee.
- **CTA en fin de short** : "Dis-le en commentaire" pose juste apres le climax CASSE le rythme. Mieux = finir sur la
  derniere image forte ; le CTA (ecran dedie/typewriter) se decide a l'ASSEMBLAGE, pas dans le beat.
⛔ MUSIQUE : toujours reportee a l'assemblage des 6 beats (nappe atmospherique discrete ~0.08-0.12).

## ✅ MUSIQUE VALIDEE (2026-06-25)
Nappe d'ambiance v1 generee (Minimax `fal-ai/minimax-music/v2.6`, `is_instrumental: true`) : cordes douces +
kora/ngoni discrets + perc main tres douce, Sahel, contemplatif, CONSTANT (homogene = se cale par fenetre+fade
sur n'importe quelle duree). Brut 163s -> `public/audio/ggw-muraille-verte/music/ambiance-raw.mp3` (catbox pyo5lg).
A poser EN UNE COUCHE GLOBALE a l'assemblage, volume ~0.10 (sous la narration), fade in/out. Prompt garde dans
`/tmp/ggw-music-gen.py` (3 variantes generees, v1 retenue). Doctrine appel : [[minimax]] (pas le mot "instrumental"
dans le prompt, style africain precis sinon sortie electronique).

## ⛔ MUSIQUE — HISTORIQUE (decision initialement reportee, tranchee 2026-06-25 ci-dessus)
Pas de musique par beat. Une nappe atmospherique DISCRETE (~0.08-0.12) sera ajoutee EN UNE COUCHE
GLOBALE a l'assemblage des 6 beats (evite les raccords musicaux, unifie le short). A trancher quand
les 6 beats sont faits. Les beats restent SANS musique d'ici la (SFX oui, musique non).

## OUTILS — flux clair (faisabilite AMONT -> production)
- **Idéation narrative + chorégraphie** : `scripts/tools/kimi-svg-ideation.py` (Kimi K2.5 MULTIMODAL).
  Lui joindre 2-3 frames SVG de calibrage ("reference de FAISABILITE du medium, PAS un modele a copier")
  + le decoupage audio reel. Kimi propose des SCENES et des CHOREGRAPHIES qu'on ne trouve pas seul
  (prouve Beat 2 : la "meche eteinte"). Claude FILTRE ensuite par connaissance du projet.
- **Image-cible = SVG NATIF** : `scripts/tools/svg-scene-narrative.py` (--provider gemini|gpt, --narrative-ref,
  --style-ref). Genere un SVG natif decoupe en `<g id>` nommes (animable). PAS de raster intermediaire
  (voir [[SVG-FAISABILITE-AMONT]] etape 3 corrigee). Generer gemini ET gpt, choisir.
- **Generateur de scene (variante)** : `rnd-svg-scene-gen.py` (registre decouple) — meme famille.
- ⛔ DEPRECIE : `svg-scene-libre.py` (forcait les cotes/schema). NE PAS utiliser.
- **Modeles image** : `gemini-3.1-pro-preview` (SVG natif/vision) · `gpt-5.5` (via openrouter, decoupe plus fine,
  ~17 groupes vs 8 Gemini = mieux pour animer element par element) · `gemini-3.1-flash-image` (raster, hors-cible).
- ⚙️ Kimi `--max-tokens 8000` par defaut (4000 coupe les reponses a 2-3 idees FR ; surveiller `finish_reason: length`).

## ⛔ POINT DE CONTROLE APRES CIBLES (obligatoire, prouve Beat 3) — production deleguee a un agent
Quand un agent produit un beat, il S'ARRETE apres la PHASE 1 (ideation + images-cibles) et livre EN UN SEUL
message a Aziz : (1) les idees Kimi resumees + laquelle il retient et POURQUOI, (2) les images-cibles SVG
CONVERTIES EN PNG ET UPLOADEES SUR CATBOX (lien par cible — Aziz juge en visuel, pas en code), (3) son
auto-evaluation + les trous de doctrine rencontres. Aziz tranche la cible AVANT la Phase 2 (animation).
NE PAS animer avant l'arbitrage. (= le point de controle "montrer les SVG" est un livrable catbox, pas une description.)

## ⛔ MAPPER UNE SCENE CONCEPTUELLE SUR L'AUDIO (trou comble Beat 3)
Pour un beat CONCEPTUEL (un retournement d'idee, pas une suite d'evenements), 2 facons de caler la scene sur
le decoupage audio en N segments — CHOISIR explicitement :
- **Scene UNIQUE qui SE RELIT** (preferee si l'image tient le retournement) : une seule composition dont le SENS
  bascule par un GESTE timé (un element qui tombe/se dissipe/se colore) sur le mot-cle. Ex Beat 3 "l'ombre qui
  ment" : l'ombre-muraille se desagrege a "un mur pourrait stopper" -> revele le sol mort a "meurt sur place".
  La choregraphie = QUAND chaque geste tombe sur la voix (pas N scenes successives).
- **Scene a 2 TEMPS explicites** (si le retournement a besoin d'etre litteral) : etat A (la fausse idee) montre,
  puis BARRE/remplace par etat B (la vraie). Plus lisible, mais risque de "schema" si le barrage devient un trait
  rouge/croix facon PowerPoint -> rester narratif (un trait d'encre qui raye, pas une icone d'erreur).
Defaut = scene unique qui se relit (plus premium, plus dans l'identite encre). Le decoupage audio sert a TIMER
les gestes, pas a imposer N plans.

## METHODE PROUVEE (pipeline d'un beat, A->Z)
> Pipeline complet (2 phases + point de controle, checklist de lancement, trous combles) :
> **[[PRODUCTION-AGENTIQUE-SVG]]** — source de verite agentique. Ce fichier ne repete pas le flux general.

Spec GGW UNIQUEMENT : les 2 temps de mapping d'une scene CONCEPTUELLE sur l'audio sont dans la section
ci-dessous (⛔ MAPPER UNE SCENE CONCEPTUELLE SUR L'AUDIO). Les acquis visuels/narratifs specifiques
au short sont dans § ACQUIS GRAVES.

## ⭐ ACQUIS GRAVES — NON-NEGOCIABLES

Acquis transverses : voir [[SVG-SCENES-GENERATIVES]] §ACQUIS TRANSVERSES (9 regles : Kimi-idéation, SVG-natif,
colorisation timée, état-vivant, pas de translateY global, cascade séquentielle, karaoké, micro-sources, agents frais).
Specificites GGW seulement ci-dessous :

- **REGISTRE ENCRE = canevas couleur pour CE SHORT** : Beat 2 illustre l'usage : monde encre -> soleil or (~6s,
  1ere couleur retardee) -> mort grise -> survivant vert vif (climax). Garder de la "munition couleur" pour le climax.
  La regie "ne pas tout colorer d'emblee" est PARTICULIEREMENT CRITIQUE ici car l'encre est l'identite visuelle du short.
- **SCENE NARRATIVE > schema annote** (specifique au registre encre) : les chiffres se DISENT a la voix + se MONTRENT
  par le geste (un arbre qui tombe = la mort, PAS un compteur "75%"). Si infographie indispensable -> CODEE PAR NOUS
  (overlay), jamais par le LLM SVG.
- **KARAOKE : couleur d'accent = vert discret** (pas la couleur d'accent generique du pattern AtlasV2Subtitles) —
  adapte a l'identite parchemin creme #e8dcc0 / encre #2b2117. ~37px, fond parchemin semi-transparent.
- **MICRO-SOURCES** : ~27px, encre opacity 0.7, CENTREE sous le sous-titre, timee sur le claim concerne.

## SFX (Beat 2, reutilisables / pattern)
Dossier : `public/audio/ggw-muraille-verte/sfx/`. Generes via ElevenLabs sound-generation (prompts EN, sound
design, pas TTS) : `ggw-sfx-soleil-embrase.mp3`, `ggw-sfx-arbre-meurt.mp3`, `ggw-sfx-vent.mp3`. + partages
`_shared/sfx/nature/{wind-leaves,growth-pop}.mp3`, `_shared/sfx/impact/tension-pulse.mp3`. Cales par
`<Sequence from={frame}>`, volumes sous la narration (1.0), vent de fond ~0.15.

## FICHIERS LIES (et leur role — eviter les contradictions)
- [[SCRIPT-PILOTE-v1]] = le texte parle (WHAT dit). [[STORYBOARD-PILOTE]] = le WHAT visuel par beat (specs).
- CE FICHIER = le STATUT + REGISTRE + OUTILS + ACQUIS (HOW + ou on en est). PRIME en cas de conflit.
- [[SVG-SCENES-GENERATIVES]] = doctrine SVG generale (registres, grammaires). [[SVG-FAISABILITE-AMONT]] = methode amont.
- [[PROMPTS-CIBLES-SVG-PAR-REGISTRE]] = bibliotheque de prompts-cibles par registre.
- ARCHIVE (ne plus utiliser pour agir) : `_ARCHIVE-REPRISE-AJUSTEMENTS-HOOK.md` (hook fini), section d3-geo du STARTER.
