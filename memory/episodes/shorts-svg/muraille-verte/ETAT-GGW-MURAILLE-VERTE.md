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
| 3 LE MALENTENDU | le desert n'avance pas comme un mur | ▶ NEXT | (a creer) | — |
| 4 DEMI-LUNE | la cuvette qui capte la pluie ⭐ coeur | ⚠️ proto prouve | `DemiLuneEncreColorisee.tsx` (a finaliser) | — |
| 5 LA PREUVE | 200M arbres Niger, nappe +17m | a creer | (a creer) | — |
| 6 OUTRO + CTA | la lecon + CTA commentaire | a creer | (a creer) | — |

**Reste a produire : Beat 3 (next), Beat 5, Beat 6, + finaliser Beat 4.** B1 et B2 sont FINAUX.

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

## METHODE PROUVEE (pipeline d'un beat, A->Z) — applique au Beat 2
1. INTENTION du beat (le ressenti, 1 verbe) deduite du script + decoupage audio reel (whisper alignment,
   filtrer `narration.alignment.json` sur les bornes du beat via `beat-bounds.json`).
2. IDEATION Kimi (refs calibrage + audio) -> 2-3 idees de scene -> Claude filtre -> Aziz tranche / on genere les cibles.
3. IMAGE-CIBLE SVG natif (svg-scene-narrative, gemini+gpt) -> convertir PNG -> juger -> choisir/regenerer.
4. ANIMATION : agent(s) en parallele, chacun anime une cible (worktree isole si plusieurs). SOCLE commun
   impose (calage audio, grammaire spring/stroke/cross-fade, palette) pour comparatif equitable + mix-and-match.
5. Render homogene (chef), comparatif catbox, Aziz tranche / mix-and-match (les `<g id>` se recomposent entre cibles).
6. Polish : sous-titres KARAOKE + micro-sources + SFX (voir ACQUIS ci-dessous). Render FINAL.

## ⭐ ACQUIS GRAVES (Beat 1 hook + Beat 2 echec) — NON-NEGOCIABLES
1. **SCENE NARRATIVE > schema annote** : un MOMENT + 4-6 objets-heros qui RACONTENT. ZERO grille/cartouche/
   tableau de chiffres. Les chiffres se DISENT a la voix + se MONTRENT par le geste (un arbre qui tombe = la
   mort, PAS un compteur "75%"). Si infographie indispensable -> CODEE PAR NOUS (overlay), jamais par le LLM SVG.
2. **Image-cible = SVG NATIF** (pas raster) -> ecart faisabilite nul (voir outils).
3. **ENCRE = canevas couleur** : le monde reste en encre ; chaque touche de couleur a un TIMING et un SENS.
   Ne pas tout colorer d'emblee. Beat 2 : monde encre -> soleil or (1ere couleur, retarde ~6s) -> mort grise
   -> survivant vert vif (climax). Garder de la "munition couleur" pour le climax.
4. **Etat VIVANT au depart, degradation = EVENEMENT** : les elements naissent dans leur etat plein/vivant
   (4 arbres verts feuillus identiques) et se degradent EN SE RACONTANT (grisent -> feuilles tombent -> tronc nu).
   JAMAIS naitre deja-mort (ca spoile + ce n'est pas un recit).
5. **PAS de mouvement camera qui fait valser une scene SVG frontale** : un translateY global du "monde" cree
   un glissement parasite. Les scenes SVG frontales restent FIXES ; le raccord se fait par FADE, pas par
   deplacement de toute la scene. (Prouve sur Beat 2 : la descente camera a ete retiree.)
6. **Mort/transformation en CASCADE** (sequentielle) > en bloc : les 3 arbres meurent l'un apres l'autre
   (~0.4s d'intervalle), la propagation se VOIT avancer = rythme + tension. (Repris de l'idee "meche eteinte".)
7. **SOUS-TITRES KARAOKE mot-a-mot** : pattern `AtlasV2Subtitles.tsx` (Heros oublies/Atlas) adapte identite
   encre : mot pas dit = encre pale (0.45), mot dit = encre pleine, mot en cours = touche verte discrete.
   Bas (zone safe), ~37px, fond parchemin semi-transparent, cale sur l'alignment mot-par-mot. Chiffres en LETTRES.
8. **SOURCES en short = micro-source + description, JAMAIS de carton de fin** : micro-ligne discrete (~27px,
   encre opacity 0.7) CENTREE sous le sous-titre, timee sur le claim concerne. + sources completes en
   description video. Pas de carton recap (casse le rythme du short). Rigueur sans casser le visuel.
9. **DELEGUER a des agents frais** : un agent vierge (contexte propre) anime une cible aussi bien (souvent
   mieux) que l'instance saturee. Chef = decoupe + socle commun + verifie + rend. Handoff = fichier disque.
   Cible = lancer 2-3 scenes en parallele par session (worktrees isoles), Aziz + Claude donnent les finitions.

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
