# ⭐ ETAT GGW MURAILLE VERTE — SOURCE DE VERITE UNIQUE (Short SVG pilote #1)

> Cree 2026-06-24. CE FICHIER est la SEULE source de verite du statut/registre/outils du short.
> En cas de contradiction avec un autre fichier (STORYBOARD, STARTER, REPRISE...), CE FICHIER prime.
> Tout agent qui produit un beat de ce short PART D'ICI. Doctrine SVG generale : [[SVG-SCENES-GENERATIVES]].

## SUJET / ANGLE (fige)
Short vertical 9:16, ~80s, 6 beats. Grande Muraille Verte (mur d'arbres 8000km cense arreter le desert).
Etoile polaire : "On a cru qu'on arreterait le desert avec un mur d'arbres. On avait tort — la vraie
solution etait deja sous nos pieds." Ton = analyste qui revele un retournement (pas militant). Script
parle fige : [[SCRIPT-PILOTE-v1]]. Storyboard 6 beats (le WHAT par beat) : [[STORYBOARD-PILOTE]].

## ⛔ REGISTRE TRANCHE (definitif, PAS un A/B)
**ENCRE NARRATIVE pour TOUT le short** (trait brun-noir sur parchemin creme #e8dcc0, encre #2b2117).
Raison : meilleur CANEVAS pour la colorisation semantique timee (monde inerte en encre -> la vie/le sens
apparait en couleur a un instant precis). Le braise-or et le d3-geo/carte top-down sont ABANDONNES pour
ce short (le d3-geo reste un acquis reutilisable AILLEURS, pas ici). Ne PAS relancer un A/B de registre.

## STATUT DES 6 BEATS (le QUOI EST FAIT)
| Beat | Sujet | Statut | Composant | Render FINAL |
|---|---|---|---|---|
| 1 HOOK | le plus grand mur vivant + open loop | ✅ FAIT | `GgwHookEncreVivant.tsx` | (catbox uwp4gq, polish v5) |
| 2 L'ECHEC | 3/4 morts Nigeria, 1/36 Senegal | ✅ FAIT (2026-06-24) | `B2LigneBrisee.tsx` | `out/episodes/ggw-muraille-verte/beat2-FINAL.mp4` · catbox cht0n0 |
| 3 LE MALENTENDU | le desert n'avance pas comme un mur | ✅ FAIT (2026-06-24) | `B3Malentendu.tsx` | `out/episodes/ggw-muraille-verte/beat3-FINAL.mp4` · catbox s2qqrm |
| 4 DEMI-LUNE | la cuvette qui capte la pluie ⭐ coeur | ⚠️ proto prouve | `DemiLuneEncreColorisee.tsx` (a finaliser) | — |
| 5 LA PREUVE | 200M arbres Niger, nappe +17m | a creer | (a creer) | — |
| 6 OUTRO + CTA | la lecon + CTA commentaire | a creer | (a creer) | — |

**Reste a produire : Beat 5, Beat 6, + finaliser Beat 4.** B1, B2, B3 sont FINAUX.
**▶ PROCHAINE SESSION = TEST 2 SCENES EN PARALLELE** (ex B5 + B6) via 2 agents lances depuis
[[PRODUCTION-AGENTIQUE-SVG]] (source de verite agentique : ce qu'un agent fait A->Z + checklist de lancement).
Beat 3 = preuve qu'un agent fait ~90% seul. Specificites B3 gravees : le mur RESTE tout du long (pas de
dissolution = "le mur ne sert a rien") · couleur-diagnostic ocre #b5651d sur le sol mort · karaoke decoupe
par PHRASE_BREAKS (index de mots, PAS silence auto — sinon bloc illisible).
⛔ MUSIQUE : toujours reportee a l'assemblage des 6 beats (nappe atmospherique discrete ~0.08-0.12).

## ⛔ MUSIQUE — DECISION REPORTEE
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

## METHODE PROUVEE (pipeline d'un beat, A->Z) — applique au Beat 2
1. INTENTION du beat (le ressenti, 1 verbe) deduite du script + decoupage audio reel (whisper alignment,
   filtrer `narration.alignment.json` sur les bornes du beat via `beat-bounds.json`).
2. IDEATION Kimi (refs calibrage + audio) -> 2-3 idees de scene -> Claude filtre -> Aziz tranche / on genere les cibles.
3. IMAGE-CIBLE SVG natif (svg-scene-narrative, gemini+gpt) -> convertir PNG -> juger -> choisir/regenerer.
4. ANIMATION : agent(s) en parallele, chacun anime une cible (worktree isole si plusieurs). SOCLE commun
   impose (calage audio, grammaire spring/stroke/cross-fade, palette) pour comparatif equitable + mix-and-match.
5. Render homogene (chef), comparatif catbox, Aziz tranche / mix-and-match (les `<g id>` se recomposent entre cibles).
6. Polish : sous-titres KARAOKE + micro-sources + SFX (voir ACQUIS ci-dessous). Render FINAL.

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
