# ⭐ SVG-SCENES-GENERATIVES — doctrine R&D : générer des SCÈNES SVG complètes via LLM

> 🧭 ORDRE DE LECTURE : (0) SVG-FAISABILITE-AMONT (valider la vue AVANT) → **(1) VOUS ETES ICI — SVG-SCENES-GENERATIVES** (generer+animer, manuel principal) → si multi-agents : PRODUCTION-AGENTIQUE-SVG → si format video long : SVG-MIDFORM-FORMAT.

> Prouvée par render (session R&D 2026-06-21). Étend la technique du coin-flip Sénégal
> (`SenegalCoinFaceA_SVG`) d'un OBJET-symbole à une SCÈNE COMPLÈTE (paysage, ville, carte d'état-major…).
> Source de vérité pour tout ce qui est "SVG vectoriel généré par LLM puis animé par code".
> Le verdict jetons (jetons hexa) reste dans [[key-learnings]] + [[CARTO-OVERLAYS-PRINCIPES]] — NE PAS dupliquer.
> Pour un short SVG concret (statut/registre/outils) : voir l'ETAT du projet (ex [[ETAT-GGW-MURAILLE-VERTE]]).

## ⛔⛔ RÈGLE N°0 — LE MODÈLE DESSINE (SVG STATIQUE), NOUS ANIMONS. JAMAIS l'inverse. (gravé 2026-07-21)
Demander au modèle (Fable/Kimi K3/GLM/GPT) de coder **l'ANIMATION Remotion complète** d'un beat = anti-pattern.
Le workflow correct, TOUJOURS : le modèle produit **UN SVG STATIQUE découpé en `<g id>` nommés** (image-cible),
et **c'est NOUS qui codons l'animation frame-driven** (strokeDashoffset, interpolate, spring, colorisation timée).
**Pourquoi 3 raisons (prouvé Beat 3 CFA)** : (1) TOKENS — Kimi K3 image-cible = ~2k tokens / 0,035$ / 50s,
vs faire animer un agent Fable = ~105k tokens + fichier même pas écrit du 1er coup ; (2) VITESSE — 50s vs ~6min ;
(3) CONTRÔLE — le montage temporel est CE QUI SÉPARE le PowerPoint du niveau GGW (leçon récurrente de ce projet) ;
le laisser au modèle nous fait perdre la main sur le rythme. **Exception unique** : si Aziz demande explicitement
un composant animé "base à retoucher" pour gagner du temps sur un cas précis — sinon, statique + animation maison.
Lié : [[llm-generation-multi-variantes-figer-description]] · [[MOTEURS-VISUELS-ET-SOCLE]].

## ⭐⭐ ACQUIS TRANSVERSES (prouvés Beat 1 hook + Beat 2 échec GGW, 2026-06-24)
Ces règles valent pour TOUTE scène SVG animée, pas seulement la Muraille Verte :
1. **Idéation via Kimi K2.5 MULTIMODAL** (`scripts/tools/kimi-svg-ideation.py`) : joindre 2-3 frames SVG comme
   CALIBRAGE DU MÉDIUM ("référence de faisabilité, PAS un modèle à copier") + le découpage audio réel.
   Kimi propose des SCÈNES et des CHORÉGRAPHIES d'animation qu'on ne trouve pas seul (prouvé : "la mèche
   éteinte"). Claude FILTRE ensuite par connaissance du projet. Le bug provider OpenRouter (réponse parasite
   JSON) se contourne en RELANÇANT l'appel (retry jusqu'à réponse valide).
2. **Image-cible = SVG NATIF** (gemini-3.1-pro / gpt-5.5), jamais raster → écart faisabilité nul. Voir [[SVG-FAISABILITE-AMONT]].
   ⚠️ **Exception 2026-07-05** (inserts tactiques Soudan) : cette règle vaut pour le raster comme ÉTAPE
   INTERMÉDIAIRE (image-cible qu'on reproduit ensuite en SVG). Elle NE s'applique PAS quand le raster est
   l'ASSET FINAL affiché directement (pas de SVG à coder derrière) — cas des bâtiments/objets complexes
   uniques sans vocabulaire géométrique universel (palais, tour TV), où Gemini image-gen + traitement
   d'intégration bat le SVG codé à l'aveugle. Détail : `memory/tools/openrouter-svg.md`.
3. **Colorisation TIMÉE maîtrisée** : ne pas tout colorer d'emblée. Le monde reste en encre ; chaque touche de
   couleur a un TIMING + un SENS, espacée. Garder de la "munition couleur" pour le climax.
4. **État VIVANT au départ, dégradation = ÉVÉNEMENT** : les éléments naissent pleins/vivants et se dégradent
   en se racontant (vert → gris → nu). Jamais naître déjà-mort (spoile + ce n'est pas un récit).
5. **PAS de mouvement caméra qui fait valser une scène frontale** : un translateY global du "monde" = glissement
   parasite. Scènes SVG frontales = FIXES ; raccord par FADE, pas par déplacement de toute la scène.
6. **Transformation en CASCADE séquentielle** (~0.4s d'intervalle) > en bloc : la propagation se VOIT avancer = rythme.
7. **Sous-titres KARAOKE mot-à-mot** (pattern `AtlasV2Subtitles.tsx`) adapté au registre : mot pas dit = pâle,
   mot dit = plein, mot en cours = touche d'accent. Calé sur l'alignment mot-par-mot.
8. **Sources en short = micro-source (centrée sous le sous-titre) + description, JAMAIS de carton de fin**
   (casse le rythme). Rigueur sans casser le visuel.
9. **Production déléguée à des agents frais en parallèle** (worktrees isolés), SOCLE commun imposé (calage audio,
   grammaire, palette) → comparatif équitable + mix-and-match (les `<g id>` se recomposent entre cibles).

---

## ✅ ACQUIS PROUVÉ : une SCÈNE entière gravée marche (pas que des objets)

La technique : **un LLM dessine une scène détaillée, DÉCOUPÉE EN GROUPES NOMMÉS** (`<g id="...">`), **statique**
(zéro animation côté LLM) → **nous animons chaque groupe côté code Remotion** par une variable de frame `f`
(translate, rotate, opacity, mix de couleur, `stroke-dasharray`). Le LLM fournit la MATIÈRE ; nous la VIE.

Pourquoi ça marche : les LLM **ne savent pas animer** mais savent **composer une scène riche et la découper en
parties manipulables**. Registre "gravure dorée / médaille ciselée" (or patiné #e7bd78/#dca95e/#bf9442, traits
rouges #8a2a20, rehauts ivoire #f2ebd9) = facile à rendre PREMIUM (vs photo-réalisme impossible en SVG).

Script de génération : `scripts/tools/rnd-svg-scene-gen.py` — **REGISTRE découplé de la SCÈNE** (params `REGISTRES`
+ `SCENE_REGISTRE`). **6 registres prouvés** (`medaille`, `blueprint`, `encre`, `tactique`, `braise-or`, `or-jour` —
tableau complet § REGISTRES) et ~12 scènes. Ajouter registres/scènes au fil de l'eau. Usage :
`python3 scripts/tools/rnd-svg-scene-gen.py --scene <nom> --provider gemini|gpt --out /tmp/x.json`.
Harnais de rendu : `src/projects/_rnd/svg-scenes/` (voir son `README.md`). ⚠️ BIBLIOTHÈQUE DE RÉFÉRENCE R&D, pas de
la prod — réadapter avant tout usage vidéo.

> **⭐ ORDRE DE LECTURE pour reproduire (agent vierge / nouvelle scène)** : (1) ce bloc + § WORKFLOW A→Z ci-dessous
> (la checklist ordonnée) · (2) § DOCTRINE D'ANIMATION & D'ÉPURE (épure + 2 couches + objet inerte + couleur) ·
> (3) § REGISTRES (choisir/créer la palette) · (4) § GOTCHAS TECHNIQUES (extraction groupes, innerHTML vs JSX) ·
> (5) § DEUX CAPACITÉS WORKFLOW (remap couleur + éditeur SVG). Le reste = contexte/preuves.

---

## ⛔⛔ GATE AMONT — GÉNÉRER LE SVG PAR LLM vs LE CODER À LA MAIN (trancher AVANT de coder, gravé 2026-07-04, Aziz)

> LE trou comblé : la doctrine décrivait UN seul flux (LLM génère → on anime) sans dire QUAND ne PAS appeler le LLM.
> Deux usages distincts du LLM, à ne jamais confondre :

**1. L'IMAGE-CIBLE (storyboard visuel)** — un PNG généré par LLM juste pour VOIR et faire valider la direction par
Aziz AVANT de coder. ✅ Toujours légitime (brouillon jetable). N'entre JAMAIS telle quelle dans la vidéo.

**2. LE MATÉRIAU FINAL (ce qui finit dans le render)** — tranché par **LE CRITÈRE-AXE** :
> ⭐⭐ **Le SVG est-il le HÉROS QUI SE DESSINE, ou un OUTIL au service d'une démo ?**
> - **Le SVG EST le HÉROS** : on a décidé DÈS LE DÉPART que la scène SERAIT un dessin qui prend vie — le trait se
>   trace, la couleur apparaît, les formes poussent/se transforment, ET CE DESSIN PORTE TOUTE LA SCÈNE du début à
>   la fin (vidéo narrative type GGW Muraille Verte : graine→arbre, mur qui se construit). → 🤖 **APPEL LLM dès le
>   départ** : il compose la masse riche (organique, paysage gravé dense), découpée en groupes nommés qu'on
>   mix-and-match et anime. C'est le cœur du livrable (pipeline complet du WORKFLOW ci-dessous).
> - **Le SVG est un OUTIL** : la scène est data-viz / conceptuelle, et le SVG n'est qu'un support graphique parmi
>   d'autres — silhouette, fissure, icônes cercle/trapèze, drapeaux plats, jauge. Le dessin n'est PAS le spectacle ;
>   il sert le propos, un effet à la fois. → 🖐️ **CODE-MAIN** : on écrit le SVG inline à la main
>   (`<path>`/`<circle>`/`<rect>`), en s'inspirant du PNG-cible comme simple référence. ⛔ **Un appel LLM pour le
>   matériau final ici = gaspillage de tokens + risque que le LLM redessine une compo différente (déformation).**
>   Ex prouvé : sc.7 Sénégal « Cicatrice » (fracture + jetons-monogramme + drapeaux = tout code-main).

**TEST DE CONFIRMATION (secondaire)** : « pourrais-je (ou Claude) coder ça à la main sans peine ? » OUI → code-main ;
NON (masse organique riche) → LLM. En cas de doute, pencher code-main (réversible, zéro coût, zéro déformation).

**⛔ RÈGLE GÉO (non-négociable)** — le continent/pays ne se génère JAMAIS par LLM (les modèles DÉFORMENT la géo :
Gambie fausse, côtes approximatives). Pour toute vraie carte/pays : **réutiliser un PATH d3-geo / Natural Earth
EXISTANT** (ex `SENEGAL_PATH` de `src/projects/_proto-16-9/senegalPath.ts`, qui se dessine au trait par
`stroke-dashoffset`). Ne jamais laisser un LLM dessiner la géo, ni la redessiner soi-même à l'œil. (Cohérent Mapbox :
« le modèle approxime la géo, vraie géo au CODE ».)

---

## ⭐⭐⭐ WORKFLOW A→Z (la checklist ordonnée — suivre dans CET ordre pour TOUTE nouvelle scène)

1. **INTENTION** (1 verbe : ce qu'on veut faire RESSENTIR) → **FORME** (le geste visuel) → **REGISTRE** (palette).
   Jamais l'inverse. (Doctrine [[CONTINUITE-SCENE-INTENTION-DABORD]].)
2. **ÉPURE D'ABORD** : 3-4 éléments HÉROS max, chacun lisible en <1s et porteur d'UN sens (§ DOCTRINE D'ÉPURE). Pas
   d'illustration chargée (sinon Seedance ferait mieux). Zéro organique vivant (objets manufacturés OK).
3. **AJOUTER scène + registre** au générateur (`SCENES` + `SCENE_REGISTRE` ; créer le registre dans `REGISTRES` si neuf).
   viewBox `1920x1080` pour 16:9, `1024x1024` pour carré. Préciser la taille DANS le prompt scène.
4. **GÉNÉRER LES 2** (Gemini + GPT) : `--provider gemini` ET `--provider gpt`. Toujours les deux (§ RÈGLE MAÎTRESSE).
5. **JUGER STATIQUE** : injecter les 2 en innerHTML dans un comparatif (modèle `MineCompare.tsx`), render still full HD,
   regarder SOI-MÊME, choisir. (Atmosphérique → Gemini · objets nets épurés → GPT.) Crop + upload catbox pour Aziz.
6. **CORRIGER EN CODE si besoin (sans rappeler le LLM)** : palette pas bonne → REMAP COULEUR (§ capacité A) ; un élément
   raté/illisible → le RÉÉCRIRE à la main (§ capacité B). Ne jamais régénérer juste pour changer une couleur/un détail.
7. **ANIMER en JSX** (innerHTML n'anime pas — réécrire en wrapper JSX, § GOTCHAS) : doctrine 2 COUCHES (fond permanent +
   événements échelonnés, règle des 5s). Objet inerte = fade/couleur (jamais glisser). Tomber-sec = `spring()`.
8. **SFX TIMÉ** frame-perfect (banque `_shared/sfx/`, `<Sequence from>` obligatoire, plancher 0.50, drone 0.40).
9. **RENDER full HD** + vérifier piste audio (`volumedetect`, mean dB ≠ silence) + **upload catbox** avant de présenter.
   ⚠️ Une validation sur IMAGE STATIQUE ne suffit pas : des défauts n'apparaissent qu'en MOUVEMENT/superposition
   de calques (ex : un texte caché par une veine animée une fois superposés, un résidu d'une génération
   précédente invisible sur un aperçu figé). Toujours REVALIDER après le 1er rendu animé réel, pas seulement
   sur l'image comparative statique (prouvé warmap-sahel 2026-07-04, Liptako/Ressources).
10. **ENRICHIR la doctrine** si nouvel acquis (registre, gotcha, pattern).

---

## ⭐⭐⭐ PIPELINE 3 MODÈLES + FUSION + ENRICHISSEMENT (raffinement des points 4-6, prouvé 2026-07-24 CFA 5a/5b)

> **DÉCLENCHEUR — quand le proposer spontanément** : scène NEUVE qu'aucun composant du
> `COMPOSANTS-INDEX` ne couvre, et dont la direction visuelle n'est pas encore arrêtée.
> ⛔ PAS pour : un ajustement, un fix, une variante d'une scène existante (là on édite le code).
> Le proposer, ne JAMAIS le déclencher seul : chaque appel est un risque de dérive, et Aziz doit
> valider la direction avant qu'on dépense des appels.

**Le principe de tri, qui commande tout le reste : OUTILLER LA MÉCANIQUE, JAMAIS LE JUGEMENT.**
Ce qui a de la valeur ici, ce sont les points d'ARRÊT (quelle direction, quel élément de quel
modèle, est-ce que l'enrichissement dénature). Un pipeline qui déciderait à notre place
produirait la moyenne des trois modèles — c'est-à-dire le résultat le plus fade possible.

| # | Étape | Qui | Gate |
|---|---|---|---|
| 1 | Brainstorm amont **TEXTE** (pas d'image) : GPT-5.6 Sol + Kimi K3 + Fable, question OUVERTE sur la mise en scène | 3 modèles en parallèle | — |
| 2 | Synthèse extractive tracée → **direction** | Claude | ⛔ **Aziz valide la direction** |
| 3 | **Image-cible SVG STATIQUE** chez les 3, même brief (palette + compo tranchées dedans) | 3 modèles | — |
| 4 | **FUSION mix-and-match** : composer le SVG final élément par élément | ⛔ **CLAUDE, jamais un modèle** | ⛔ **Aziz voit le mix** |
| 5 | **Appel 2 — enrichissement** : on envoie le CODE + l'IMAGE RENDUE, critères stricts + liberté encadrée, **justification obligatoire de chaque ajout** | Fable (agent) | — |
| 6 | Vérif conjointe (rendu + code : superpositions, orthographe, cohérence de registre) | Claude + Aziz | ⛔ |
| 7 | **Animation maison** (règle N°0), puis VO → forced-align → passe downstream | Claude | — |

**2 APPELS MODÈLE MAXIMUM** (génération + enrichissement). La fusion N'EST PAS un appel : Claude
a les codes sources sous la main, c'est de l'ÉDITION. Détail et le pourquoi (verbatim Aziz) :
[[feedback_svg-generatif-2-appels-fusion-par-claude]]. Avant tout appel sur un SVG qui existe
déjà, se demander : **création (→ appel justifié) ou édition/assemblage (→ je le fais moi-même)** ?
Fusion, repositionnement, collision, changement de couleur, renommage de groupes = TOUJOURS Claude.

**OUTILS** (la mécanique, pour ne pas la réécrire à chaque scène) :
- `scripts/tools/svg-image-cible-compare.py` — brief → N modèles en parallèle → SVG → PNG →
  planche comparative labellisée → upload, en un geste. `--assemble-only` re-assemble sans
  rappeler les API (pour intégrer le JSON de Fable, déposé sous `<label>-fable.json`).
  ⚠️ Fable n'y est pas : c'est un agent Claude Code (`model: "fable"`), pas une API — le lancer
  en parallèle avec le MÊME brief.
- `scripts/tools/forced-align.py` — audio + texte → timestamps mot-par-mot et **frames des
  repères narratifs**, pour caler le bloc `T` sur la voix réelle. Moteur ElevenLabs (fiable même
  quand le quota Whisper/OpenAI saute). Une durée estimée "au nombre de mots" se trompe de ~20%.

**⚠️⚠️ 1er PASSAGE EN PROD REELLE (CFA Beat 6b, 2026-07-26) — LES 3 MODELES API ONT DERIVE, FABLE A TENU.**
Sur l'etape 3 (image-cible), avec un brief qui interdisait EXPLICITEMENT tout personnage humain :
GPT-5.6 Sol a produit un marche nocturne avec 2 personnages · Gemini 3.1 Pro un chantier de pipeline avec
silhouettes · Kimi K3 un apprenti sur une mobylette. **2e tentative en leur donnant l'image de Fable en
reference a REPRODUIRE fidelement** : GPT a garde la structure demandee mais a quand meme invente une
"chercheuse en blouse blanche" ; Kimi a enfin lache le personnage mais a ajoute lune + balise hors-brief.
**Seul FABLE (agent Claude Code, pas une API) a respecte le brief des le 1er jet.**
→ Hypothese : sur un sujet a forte charge emotionnelle/documentaire, les modeles API veulent RACONTER UNE
HISTOIRE HUMAINE, et l'interdit explicite ne suffit pas a les retenir — meme avec une image-reference.
→ Consequence operatoire : pour une scene d'OBJETS avec interdit de personnage, **lancer Fable en premier**
et ne solliciter les API que pour de l'enrichissement (etape 5), pas pour l'image-cible. Ca economise 2
appels payants sur 3. Confirme concretement la doctrine "Fable 5 = modele SVG par defaut".

**⚠️ GOTCHA FUSION — en SVG, l'ORDRE DU DOCUMENT EST L'ORDRE DE RENDU.** Un élément inséré plus haut
dans le document est peint EN PREMIER, donc RECOUVERT par tout ce qui suit — sans erreur ni warning, il
"n'apparaît simplement pas". Ça concerne directement l'étape 4 (fusion) : quand on prend le sac de X et
l'étiquette de Y, **l'ordre d'insertion décide de l'occlusion autant que les coordonnées**.
→ **Réflexe** : un élément ajouté qui n'apparaît pas alors que ses coordonnées sont bonnes → vérifier sa
POSITION DANS LE DOCUMENT avant de toucher aux coordonnées ou à l'opacité. (Vécu 2026-07-25 : un bandeau
de label injecté après `<svg>` passait derrière le rect de fond plein cadre.)

**⚠️ PIÈGE VÉRIFIÉ — un raccord peut casser la scène qu'il raccorde.** En câblant la transition
5a→5b, l'onde est devenue une forme unique sur toute la largeur : les deux moitiés s'animaient
donc simultanément et la démonstration séquentielle ("le levier gauche agit → ENSUITE on découvre
que le droit ne peut pas") s'est effondrée en un état simultané. La jonction avait été vérifiée
image par image ; la lecture INTERNE de la scène suivante, non. **Après tout changement de
structure, revérifier la séquence narrative, pas seulement le point de couture.**

---

## ⭐⭐ RÈGLE MAÎTRESSE — le choix du modèle DÉPEND de la scène (générer les 2, choisir)

Test ville + carte d'état-major, Gemini 3.1 Pro vs GPT-5.5, même prompt :

| Type de scène | Gagnant | Pourquoi |
|---|---|---|
| **Organique / profondeur / paysage** (ville, port, plans étagés, nature) | **GEMINI 3.1 Pro** | illustrateur : densité, profondeur réelle (plans), détails gravés (soleil rayonnant, cuves, treillis), meilleur découpage de groupes |
| **Géométrie / schéma / symbole** (carte d'état-major, diagramme, hachures réglées, flèches) | **GPT-5.5** | ingénieur : relief hachuré net, zones de contrôle lisibles, flèches tactiques à poids, rose des vents + cartouche propres |

**Conséquence opératoire** : pour une scène SVG, **TOUJOURS générer les 2 (Gemini + GPT-5.5) et choisir selon la
nature**. Cohérent avec le verdict transversal : Gemini gagne la GÉNÉRATION d'image, GPT gagne le BREAKDOWN/schéma.

### ⭐ GLM-5.2 — 3e modèle low-cost pour JETONS et ASSETS SVG (R&D 2026-06-24)

**GPT-5.5 + Gemini restent les modèles PRINCIPAUX des scènes** (règle ci-dessus inchangée). On ajoute **GLM-5.2** (`z-ai/glm-5.2` via OpenRouter, $1.40/$4.40, **5-7× moins cher**) comme **3e modèle COMPLÉMENTAIRE**, appelé pour :
- **jetons / pictogrammes / petits assets SVG en lot** (planche de N en 1 appel) → `scripts/tools/llm-gen-svg.py --provider glm` ;
- **plusieurs éléments SVG variés d'une scène quand on veut de la qualité** (ex. assets AES) ;
- **option de test / 3e voix** pour comparer.

⛔ **PAS** les drapeaux de carte Mapbox (règle E2 `useClipFlags` = vraies images, inchangée). ⛔ **PAS** le pipeline scènes narratives principal (GPT/Gemini). GLM est **excellent en géométrie/technique/schéma/diagramme/jetons** (≈ GPT-5.5), **faible sur l'encre/gravure** (arbre naïf) → ne pas l'y envoyer.

**Gotchas GLM (avant appel)** : TEXT-ONLY (brief verbal, pas d'image-réf ; brief sans contradiction de registre) · ne PAS limiter `max_tokens` (raisonnement) · peut wrapper en HTML+CSS → strip le CSS, garder le `<svg>` statique. Détail + verdict comparatif 4 modèles + IDs/prix + gotchas : **[[openrouter-svg]]** (`memory/tools/openrouter-svg.md`).

**Pipeline prouvé bout-en-bout** : GLM → JSON → composants React `{f}` / groupes nommés → animation par frame Remotion (zéro CSS) → render. Réfs : `src/projects/_rnd/svg-scenes/GisementTokensGlm.tsx` + `JetonsGlmDemo.tsx` (jetons), `FluxPetroleAnimee.tsx` (scène conceptuelle). Le JSX `f`-driven de GLM compile sans retouche. Jetons animés : https://files.catbox.moe/jmeup8.mp4 · flux conceptuel : https://files.catbox.moe/hhftb1.mp4

**Qwen3.6 et MiniMax M3** : testés puis **écartés** (Qwen un cran sous GLM sur les jetons, écart prix dérisoire ; MiniMax ~7 min/scène = impraticable). Détail dans [[openrouter-svg]].

⚠️ NUANCE (prouvée offshore blueprint) : la règle vaut surtout quand les 2 scènes opposent organique vs schéma.
Quand les DEUX sont dans le même registre "schéma technique" (ex blueprint), c'est plus serré : sur la plateforme
offshore, **Gemini gagne la justesse technique** (vraie coupe d'ingénieur, jacket en treillis, étiquetage dense)
mais **GPT a la meilleure lisibilité du flux** (flèches de pétrole déjà figurées). Générer les 2 reste la règle.

Renders de preuve : ville https://files.catbox.moe/jzwofu.png · état-major https://files.catbox.moe/af65no.png · offshore-blueprint https://files.catbox.moe/lhgojl.png

---

## 🎨 REGISTRES VISUELS PROUVÉS (style découplé de la technique)

La technique (LLM → groupes → anim par frame) est INDÉPENDANTE du registre visuel. 2 registres prouvés par render :

| Registre | Palette / cadre | Brille pour | Harnais |
|---|---|---|---|
| **`medaille`** (gravure dorée) | or patiné #e7bd78/#dca95e/#bf9442, traits rouges #8a2a20, ivoire #f2ebd9 ; disque r≈480 + rim | objet-symbole, scène narrative chaude (la pièce Sénégal, ville/port) | `SvgSceneCoin.tsx` |
| **`blueprint`** (technique bleu) | fond bleu nuit #0d1b3a, traits cyan #7fd4ff + blanc #eaf6ff, accents or #c8a951 pour le flux ; cotes + grille + cartouche ; planche rectangulaire | infrastructure / mécanisme / schéma technique (plateforme, gazoduc, barrage, réseau). Le bleu nuit = continuité de notre fond Souverain | `SvgScenePlanche.tsx` |
| **`encre`** (gravure parchemin) | fond parchemin crème #e8dcc0/#e3d5b5, traits brun-noir #2b2117, ombres par hachures (jamais d'aplat noir) ; médaillon ovale/écusson | figures historiques, emblèmes, sceaux, estampes — **idéal Atlas historique** | `SvgSceneParchemin.tsx` |
| **`tactique`** (état-major) | fond bleu nuit très sombre #0b1526, traits blanc cassé #e8eef5 + bleu acier #5a8fc0, ROUGE-ORANGE #d6552e = menace, OR #c8a951 = solidarité/bouclier ; nœuds + liens + vecteurs | ⭐ **encart CONCEPTUEL** : un PRINCIPE/doctrine (pacte, mécanisme, rapport de force) — PAS une carte. War-Map/AES | (compo dédiée) |
| **`braise-or`** (gravure chaude sombre) | terre sombre chaude #1c1108/#2a1a0d, ocres #7a4a22/#9c5f2c/#b8763a, OR lumineux #e8b44a/#f2cf72/#ffe39a, braise/guerre #d6552e/#c23a1e ; AUCUN bleu/gris | scène CHAUDE matérée (mine d'or, ressource, terre africaine, désert ardent). Coucher de soleil/fournaise | (compos dédiées) |
| **`or-jour`** (illustration chaude LUMINEUSE) | ciel ambre clair #f2cf72/#ffd98a/#ffe8b8, nuages ivoire #f7eccf, terre ocre CLAIRE #c98a4a/#b8763a/#e0b878, or #f2cf72/#ffe39a, guerre rouge #d6552e discrète ; AUCUN bleu/gris/noir plat | scène chaude LUMINEUSE et premium (matin doré sur désert). Sort du « technique froid » et du « sombre dépressif » sans tomber dans le parchemin | (compo `HeroGptAnimee`, ⚠️ archivée `_archive/`, rendu réf https://files.catbox.moe/1ws3kh.mp4) |

| **`papier-decoupe`** (paper-cut pédagogique) | couches pleines EMPILÉES + ombre portée douce sous chaque couche ; palette CLAIRE chaude : ciel pastel #bfe3ef/#a8d8e8, crème #fdf3df/#f7ecd2, terre ocre #caa46a/#b3823f/#8a5a2c, verts étagés #3e7c34/#569b43/#7cba5a/#a8d678, bois #8a5a2c/#a06b35, or doux #f2cf72/#ffd98a, corail #e0795b ; AUCUNE hachure, AUCUN noir plat, profondeur par empilement de couches | ⭐ scène PÉDAGOGIQUE / explainer (croissance, cycle, processus illustré façon Kurzgesagt-papier) — joyeux, clair, premium | `GraineGeminiAnimee` ⚠️ archivée `_archive/`, rendu réf https://files.catbox.moe/ft5l5g.mp4 |

À TESTER (registres non encore sondés) : ~~néon/data-terminal~~. (encre ✅ · braise-or ✅ · or-jour ✅ · papier-decoupe ✅ · **néon/data-terminal ✅** · **feu/fumée organique non-figuratif ✅** prouvés.)

> ⭐ **NÉON/DATA-TERMINAL + FEU ORGANIQUE PROUVÉS (2026-07-20, générés par FABLE 5)** : deux registres jamais faits, validés par render animé.
> - **Néon/data-terminal** (fond noir/bleu, cyan #38e0ff + magenta #ff3ea5 + vert terminal #5affa0 + ambre alerte #ffb020, grille, glow) = "war room renseignement financier" : nœuds qui pulsent, flux $ qui circulent (dash défilé), anneaux sonar d'alerte, scanline, REC clignotant. **Niveau production tel quel.** Rendu : https://d.uguu.se/dpxKmcpy.mp4 · code `src/projects/_rnd/fable-svg/NeonTerminalAnime16x9.tsx` + `neonGroups.ts`. Idéal beat surveillance/finance/cyber.
> - **Feu/fumée organique non-figuratif** (registre braise) : langues de flamme qui ondulent (sway déphasé ancré à la base = pointe danse, base fixe), fumée qui monte+dissipe, braises qui s'élèvent en zigzag, lueur qui respire. **CONFIRME la doctrine : le non-figuratif s'anime bien, ZÉRO uncanny** (vs organique humain proscrit). ⚠️ reste vectoriel-propre (léger cartoon au repos ; un feu photoréaliste est hors portée SVG, cf DOCTRINE D'ORIENTATION). Mécanique ondulation+montée réutilisable pour NAPPE DE PÉTROLE / EAU QUI MONTE. Rendu : https://d.uguu.se/UQlgjQcc.mp4 · code `FlammeAnime16x9.tsx` + `flammeGroups.ts`.
> - **FABLE 5 = excellent générateur de matière SVG** (dense, groupes nommés propres, dégradés/glow soignés), appelé comme AGENT Claude Code (effort élevé, ZÉRO appel API — dans le plan Max, ~50% données/semaine). Fidèle à la doctrine : Fable fournit la MATIÈRE statique, le code donne la VIE. SVG bruts sauvés `public/_rnd/fable-svg/`.

> ⭐⭐ **FABLE 5 en RAISONNEMENT MAX = générateur SVG de TRÈS HAUT NIVEAU (test ultime 3 scènes, 2026-07-20, SANS référence image)** :
> - ⭐ **VISAGE ORGANIQUE HUMAIN** (pêcheur sénégalais 3/4 face + chapeau) : vrai visage crédible, modelé par dégradés radiaux (pommettes/front), yeux iris+reflet, rides fines, ZÉRO uncanny. **AU MOINS À PARITÉ AVEC KIMI K3** (le champion visage jusqu'ici, cf [[feedback_geminirig-trio-visage-validation]]), voire au-dessus sur le modelé. + ANIM_COORDS fournis. → change le classement : Fable-max rejoint Kimi K3 sur le visage. Still https://h.uguu.se/hXtjvaaC.png · `public/_rnd/fable-svg/pecheur-visage.svg`.
> - ⭐ **SCÈNE NARRATIVE PARALLAXE** (village pêcheurs coucher soleil) : LE PLUS ABOUTI. 7 plans nets et séparés (ciel/océan/lointain/village/sable/pirogues/avant), débordant du cadre pour défiler, reflet ondulé sur l'eau, pirogues colorées. Niveau illustration éditoriale, prêt parallaxe. Still https://h.uguu.se/DnebWAoh.png · `village-parallaxe.svg`.
> - ⭐ **PERSONNAGE RIGGABLE PLEIN PIED** : 13 segments anatomiques avec CHEVAUCHEMENTS aux jointures (pas de pantin désarticulé), z-order correct, bloc RIG_PIVOTS (épaules/coudes/hanches/genoux/cou) fourni. Riggable tel quel. ⚠️ BÉMOL : au repos on devine un peu les segments de bras — invisible en mouvement, léger en gros plan statique (compromis intrinsèque au riggable). Still https://d.uguu.se/uteRmzKs.png · `pecheur-perso.svg`.
> - **COÛT** : ~58K tokens/scène MAIS **6-9 min de raisonnement/scène** (vs ~80s effort normal) — le max pense bien plus longtemps, la richesse s'en ressent. Session Fable totale ~289K tokens. ⚠️ Le % du quota Max/semaine N'EST PAS exposé à Claude Code (compteur claude.ai) — compter les tokens, pas le quota.
> - ⚠️ **GOTCHA** : Fable peut glisser une couleur INVALIDE dans un gradient (`#cdb astro` observé) — SCANNER/corriger à la main avant rendu (réflexe Claude=éditeur-SVG). rsvg-convert rend le glow/dégradés plus faiblement que Chromium → juger le rendu final en Remotion.

> ⭐⭐ **DOCTRINE PORTRAIT ANIMÉ (retour Aziz 2026-07-20, après test visage pêcheur animé)** — comment animer/utiliser un portrait SVG SANS uncanny :
> - ⛔ **NE JAMAIS bouger le BUSTE/torse d'un portrait** = « carnaval » (uncanny). L'œil attend un corps entier ou rien. Le buste reste RIGOUREUSEMENT FIXE, ancré.
> - ✅ **Ce qui vit = UNIQUEMENT dans le visage, subtil** : clignements (validé « pas pire » = OK, désynchronisés G/D), micro-inclinaison de tête TRÈS légère (respiration de quelques °, PAS un balancement), regard qui dérive. Rien de plus.
> - ⛔ **PAS de parole/bouche animée** tant qu'on n'a pas un usage précis + meilleure technique : le lip-sync SVG approximatif tombe dans l'uncanny (tranché Aziz).
> - ⚠️ **RÉVÉLATION DESSINÉE — corriger la colorisation** : le tracé au trait (stroke-dashoffset) est RÉUSSI et beau, MAIS la transition tracé→couleur était BRUTALE (« les couleurs arrivent d'un coup, le visage apparaît tout d'un coup »). FIX : la couleur doit MONTER PROGRESSIVEMENT, zone par zone EN SUIVANT le tracé (peau→modelé→traits→chapeau échelonné), jamais un fade global.
> - **USAGE JUSTE en vidéo** = le portrait est un **MÉDAILLON VIVANT, PAS un acteur** : on le RÉVÈLE (il se dessine pour présenter une figure — dirigeant, pêcheur emblématique, personnage historique), il VIT discrètement pendant qu'une voix off parle DE lui, puis on transitionne. Cohérent avec DOCTRINE D'ORIENTATION (profil/emblème OK, pas de scène multi-perso qui « jouent »).
> - **PERSONNAGE RIGGABLE plein pied (salut/marche)** : le rig TIENT techniquement (jointures connectées via imbrication wrappers épaule→coude, hanche→genou→pied) — PROUVE qu'on PEUT faire une animation de perso SANS Seedance/Kling. ⛔ **MAIS PROUVÉ ≠ MAÎTRISÉ — NON PRIVILÉGIÉ EN PROD (tranché Aziz 2026-07-20)** : même bien animé, ça reste « un pantin bien animé », pas un perso vivant — décrochement visible aux articulations (épaule/avant-bras), et la MARCHE DE FACE est le pire cas (aucun raccourci de profil, on voit tout). On sait que c'est possible (ne JAMAIS dire « infaisable ») mais on ne l'utilise PAS comme brique de prod tant qu'on n'a pas nettement mieux. Cohérent avec DOCTRINE D'ORIENTATION (pas d'organique humain qui « joue »). Rendus réf : visage https://n.uguu.se/VGarthyC.mp4 · village parallaxe 26s https://n.uguu.se/AoSJsGFm.mp4 · perso marche (preuve, pas prod) https://h.uguu.se/kDgRBWLX.mp4.
> - ⭐ **PREUVE STRATÉGIQUE** : village parallaxe 26s (jour→nuit + parallaxe + vie ambiante) = vraie SÉQUENCE NARRATIVE animée en SVG déterministe pur, ZÉRO générateur vidéo. Valide le format « vidéo majorité-SVG, mélange 3 moteurs » (comme Soudan mais ratio inversé) — signature que personne ne fait (ni chaînes Seedance génériques, ni data-viz froides).
> - ✅ **PORTRAIT-MÉDAILLON v2 = MAÎTRISÉ / prod-ready** (2026-07-20) : buste 100% FIXE (hors du wrapper qui tourne la tête) + COLORISATION PROGRESSIVE zone par zone (peau→modelé→traits→chapeau→col, rampes échelonnées ~19f décalées ~16f — plus de « pouf tout d'un coup ») + vivant subtil (clignements désync + tête ±1°, sans parole). Rendu réf https://n.uguu.se/oWjbBchm.mp4 · `PecheurVisageAnimeV2.tsx`. C'est LA façon d'utiliser un portrait : le RÉVÉLER puis le laisser vivre discrètement pendant une voix off.

> ⭐⭐⭐ **NOTRE VRAIE FORCE SVG ANIMÉ = LA SCÈNE-LIEU VIVANTE + LES OBJETS NON-ORGANIQUES QUI LA TRAVERSENT (recentrage Aziz 2026-07-20)** — distinction cardinale :
> - ⛔ **Organique humain qui « joue »** (perso qui marche, buste qui bouge, visage qui parle) = écarté, uncanny, NON maîtrisé.
> - ✅ **Le MONDE qui vit + les OBJETS MANUFACTURÉS qui le parcourent** = EXCELLEMMENT maîtrisé, prouvé N fois. C'est là qu'on a « plus de possibilités qu'on ne pense », et qu'AUCUN générateur vidéo n'a notre contrôle.
> - PREUVES accumulées : **cargo qui voyage** (scène-mètre 16:9, navire qui défile côtes Afrique→Suez, scène qui change — véhicule qui GLISSE = crédible, cf règle « objet inerte ne glisse jamais SAUF véhicules ») · **port Soudan** (scène complète d'objets) · **Grande Muraille Verte short** (graine→arbre, mur qui se construit, zéro organique) · **village parallaxe** (pirogues, cases, jour→nuit).
> - RÈGLE : pour une vidéo majorité-SVG, bâtir sur SCÈNES-LIEUX qui évoluent (parallaxe, jour→nuit, construction, colorisation qui se répand) + OBJETS-VOYAGEURS (véhicules, structures) + inserts data + portraits-médaillons. JAMAIS le personnage-acteur.

> ⭐ NOUVEAU REGISTRE `papier-decoupe` PROUVÉ (2026-06-22, scène « graine→arbre » 16:9, Gemini) : https://files.catbox.moe/wv4xlm.mp4
> Gemini GAGNE nettement ce registre (couches organiques empilées + ombres douces = sa force atmosphérique). GPT non
> testé (OpenRouter 402 crédits épuisés ce jour-là → générer-les-2 forcément contourné ; Gemini était de toute façon le
> choix doctrinal pour une scène organique/profondeur). Gotcha registre : Gemini met les ombres en `<style>`/`class="shadow"`
> dans `<defs>` → les INLINER (class→fill+opacity) avant injection innerHTML. Grammaire = SE CONSTRUIT bas→haut (graine→
> racines tracées→tronc scaleY ancré sol→branches scale depuis sommet→feuillage 5 couches épanouies en VAGUES→fruits pop).

---

## ⛔⛔ DOCTRINE D'ORIENTATION — le SVG génératif est fait pour l'ABSTRAIT/SYMBOLIQUE, PAS pour l'ORGANIQUE

> Tranché par Aziz (2026-06-21) après le test organique étagé profil/duo/animal en encre. **NE PAS tenter d'animer
> de l'organique humain/animal — ce n'est pas ce qu'on veut, et le test l'a confirmé.**

**Ce que le test a prouvé** (statique, Gemini vs GPT, registre encre) :
- ✅ **Profil humain** isolé : tient (Gemini gagne, vrai profil expressif). [profil](https://files.catbox.moe/4v26et.png)
- ⚠️ **Duo en interaction** : le MUR. Gemini embellit (scène mystique) au détriment de la lisibilité du geste ;
  GPT reste littéral mais clair. Le geste/relation devient confus. [duo](https://files.catbox.moe/g7su52.png)
- ✅ **Animal héraldique** (aigle) : le meilleur terrain organique (Gemini superbe, pas d'uncanny sur un emblème). [animal](https://files.catbox.moe/k3q8fp.png)
- 🧱 Le vrai mur = **portrait humain de FACE réaliste** (évité exprès — produirait de l'uncanny).

**LA RÈGLE qui en découle (orientation de production)** :
1. **La force du SVG génératif = l'ABSTRAIT, le SYMBOLIQUE, le TECHNIQUE** (objets, cartes, schémas, infrastructures,
   emblèmes, flux). C'est là qu'on investit.
2. **Quand une scène appelle des GENS / des êtres vivants → NE PAS les rendre en organique vectoriel.** Trouver une
   forme ABSTRAITE qui les évoque : silhouette-icône, **jeton/figure emblématique**, schéma de flux entre acteurs,
   symbole de fonction (couronne = roi, casque = soldat), portrait de PROFIL stylisé si vraiment nécessaire (jamais de face).
   **L'originalité de représentation prime sur le réalisme organique.**
3. Exception tolérée si jamais besoin : **profil isolé** ou **emblème animal/héraldique** (terrains sûrs), en statique
   ou animation très subtile — jamais une scène multi-personnages en interaction réaliste.

### ⭐ PRÉCISION 2026-06-22 (Aziz) — la frontière n'est PAS « figuratif vs abstrait », c'est « OBJET vs ORGANIQUE VIVANT »
Test mine d'or : les **objets manufacturés à silhouette nette** se dessinent TRÈS BIEN (pelle, lingot, coffre, wagonnet,
camion, navire, avion, machine, treuil) — le LLM les rend proprement, même figuratifs. Ce qui casse (cartoon/déformé) =
les **tissus organiques VIVANTS** : visages, corps humains, mains, peau, animaux, drapés. Donc : une pelle posée = OK ;
un homme qui tient la pelle = le problème. Évoquer l'humain par son OUTIL ABANDONNÉ (pelle plantée immobile) = puissant,
zéro organique. **La densité n'est PAS l'ennemi** : la pièce Sénégal (navire ~20 paths, derrick ~15 lignes) est dense ET
belle. Une scène peut être riche EN OBJETS MANUFACTURÉS sans casser ; seul l'organique vivant casse, même en petit nombre.

---

---

## ⭐⭐⭐ DOCTRINE D'ANIMATION & D'ÉPURE — l'AVANTAGE RÉEL DU SVG vs vidéo IA (session 2026-06-22, prouvée par render)

> Cause racine de la question d'Aziz : « si on fait une image dense qu'on anime un peu, Seedance/Kling ferait mieux —
> alors quel est notre avantage ? » Réponse prouvée : **l'avantage du SVG n'est PAS le détail, c'est le CONTRÔLE TOTAL
> d'un PETIT nombre d'éléments LISIBLES qui RACONTENT + le pilotage COULEUR sémantique.** Anti-piège : une scène-illustration
> riche qu'on anime mollement = une moins bonne vidéo IA. Référence = la pièce Sénégal Face A (4 objets, 4 gestes, 4 mots).

### 1. ⛔ SCÈNE-HÉROS ÉPURÉE, pas illustration chargée (LE point central)
3-4 éléments MAXIMUM, chacun GROS, lisible en <1s, et porteur d'UN SENS précis dans la phrase narrative. La force vient
de la cohérence sens↔image, PAS du nombre de traits. Si on hésite entre ajouter un détail ou épurer → ÉPURER. C'est le
point commun entre le blueprint (chaque flèche = un sens) ET la pièce Sénégal (chaque objet = un mot) : « épuré + chaque
élément pilotable », pas « abstrait vs illustratif ». Prouvé : la mine chargée (8 éléments, wagonnet/poussière illisibles)
< la version héros épurée (pelle + lingot + terre, 4 gestes limpides). Cobaye `HeroGptAnimee` « suivre l'or » Soudan (⚠️ fichier archivé, rendu réf https://files.catbox.moe/1ws3kh.mp4).

### 2. ⭐ DOCTRINE DES 2 COUCHES (tient une scène 14–28s + règle des 5s) — À APPLIQUER À TOUTE SCÈNE
- **Couche de FOND permanente** (démarre f0, ne s'arrête JAMAIS) : drift Ken Burns lent + un élément qui respire (soleil
  qui pulse, nuages qui défilent, ondulation). La scène n'est jamais figée.
- **Couche d'ÉVÉNEMENTS échelonnés** (règle des 5s) : par-dessus, des gestes qui DÉMARRENT à des frames précises (un
  toutes les ~4-5s) et, une fois lancés, CONTINUENT. « On ne l'arrête plus » = vrai par geste ; mais ils ne démarrent
  PAS tous en même temps (sinon tout est dit à la 1re s, le reste est plat). L'entrée échelonnée = ce qui crée la règle
  des 5s et tient la durée. La scène SE CONSTRUIT jusqu'à un apogée. Prouvé sur 28s (mine) ET 14s (héros).

**⭐ 2 techniques prouvées (retour Aziz explicite 2026-07-04, warmap-sahel Ressources) pour éviter le figé** :
- **stroke-dasharray > fade-in pour l'apparition d'un objet-héros** : dessiner le CONTOUR au trait (comme un
  crayon qui trace) plutôt qu'un simple fondu d'opacité — jugé "beau" et "qui fonctionne très bien", technique
  PAR DÉFAUT pour l'apparition de l'élément central d'une scène (bouclier, sceau, objet-héros).
- **FlowDots (gouttes qui glissent en continu le long d'un path)** : pour tout flux/veine/circulation qui ne
  doit PAS retomber figé après son apparition initiale — `strokeDasharray` "segment court / gap long" +
  `strokeDashoffset` qui défile en continu (valeur croissante, PAS de modulo nécessaire, l'offset négatif
  boucle nativement le long du path). Composant helper prouvé dans `ResourcesRevealSVG.tsx`
  (`src/projects/warmap/parties/`), réutilisable pour tout élément "qui doit se sentir vivant" une fois tracé.

### 3. ⛔ RÈGLE OBJET INERTE — un objet qui ne se déplace pas dans la vraie vie NE GLISSE JAMAIS
Lingot, coffre, pierre, bâtiment, pelle = pas de jambes → une translation latérale fait FAUX (« glissement bizarre »).
Il disparaît par **FADE pur**, ou change de COULEUR, ou s'illumine — sur place. SEULS les objets conçus pour bouger
(navire, avion, voiture, char) peuvent glisser de façon crédible. (Cohérent avec « mouvement = intention narrative ».)
Idem la TERRE : un sol ne « vague » pas comme de l'eau (solide) → il CHANGE DE COULEUR, il n'ondule pas. Le mouvement va
à ce qui bouge dans la nature (air, fumée, nuages) ; la transfo va à la couleur. Prouvé : lingot qui part = fade (pas slide).

### 4. ⭐ « TOMBER SEC » avec spring() — les objets se PLANTENT, ils n'apparaissent pas mollement
Un objet qui s'installe = il TOMBE du haut + REBOND net à l'arrivée (`spring({config:{mass:1, damping:12, stiffness:90},
durationInFrames:34})`) + poussière d'impact brève + SFX sec (`impact/impact.mp3`) + léger squash vertical à l'atterrissage.
Bien plus tangible qu'un fade. Chute VISIBLE (~16f, pas 6f : baisser stiffness). Cascade lisible (pelle → gros lingot →
petit lingot, décalés). `spring > interpolate` (doctrine Remotion). Prouvé `HeroGptAnimee` (⚠️ fichier archivé, rendu réf https://files.catbox.moe/1ws3kh.mp4).

### 5. ⭐⭐ GRAMMAIRE DE COLORISATION = notre signature (analyse GGW complète 7 beats, 2026-06-27)
> Vérifiée frame par frame sur les 7 beats GGW + code. ⛔ CORRIGE un contresens : le monde NE se colorise PAS
> entièrement à la fin (« voile chaud global » = FAUX). La couleur reste localisée au SENS ; le décor reste en encre.

**3 MÉCANISMES de couleur, choisis par la NATURE de l'objet (pas un seul) :**
- **A — ENTRE DÉJÀ COLORÉ** : ce qui *apparaît* comme acte neuf/vivant naît AVEC sa couleur native (la pelle, les
  arbres plantés, les pousses, les récoltes). La couleur naît avec l'objet — on n'« active » pas sa couleur après.
  C'est la SÉQUENCE D'APPARITION (timée sur le mot) qui porte le récit, pas une colorisation différée.
- **B — PRÉSENT EN ENCRE PUIS SE COLORISE** : ce qui *existe déjà en contour* et se RÉVÈLE au mot-clé (le soleil
  contour→or, le sol mort encre→ocre, les souches encre→cœur vert, le champ final B7 encre→forêt). **Le PAYOFF d'un
  beat est presque toujours un mécanisme B** (la révélation). Overlay/fill monté par interpolate, timé sur la voix.
- **C — DÉ-COLORISATION = MORT** : la couleur se RETIRE (vert→gris en vague/cascade quand les arbres meurent). Par
  cross-fade d'opacité entre calques encre/couleur/mort du même objet — JAMAIS par glissement (objet inerte ne glisse pas).

**Invariants (non négociables) :**
- Couleur TOUJOURS sémantique, **frame-calée sur le mot** du script (cues de l'alignement audio). Jamais décorative.
- **Le décor permanent reste en ENCRE pour toujours** (dunes, horizon, fond crème). Le fond ne se colorise jamais —
  SEULE exception inversée : un virage GLOBAL au GRIS (`multiply`) pour marquer la mort/l'échec (= mécanisme C à l'échelle de la scène).
- **Palette à code FIXE** (anti-décor) : vert=vie · or/jaune=soleil (ambivalent : ambition puis menace/sécheresse) ·
  **ocre=couleur-DIAGNOSTIC** (le sol mort qui s'allume quand on NOMME la cause) · gris=mort · sépia=archive/humain. Rien hors lexique.
- **Parcimonie** : « garder la munition » (le vert vif réservé au climax) — sauf au beat d'ABONDANCE prouvée où il se déverse.
- **Sous-titres** : mot dit = encre pleine · mot en cours = couleur d'accent · mot à venir = encre 0.45. (Convention constante.)
- **Porté à l'HORIZONTAL** : même lexique, simplement plus d'objets (la scène-lieu dense = la frise GGW en paysage). Cf. [[SVG-MIDFORM-FORMAT]] § scène-lieu.

## ⭐⭐⭐ DEUX CAPACITÉS DE WORKFLOW NOUVELLES (le LLM = matière première, pas contrainte) — 2026-06-22

> Saut de workflow identifié par Aziz : une fois la matière générée, **TOUT s'ajuste en CODE, sans rappeler l'API.**
> Le LLM devient un POINT DE DÉPART, pas une contrainte. Gros avantage : zéro coût, instantané, et **zéro risque que le
> LLM redessine une compo différente** (le danger de régénérer).

### A. REMAP COULEUR CÔTÉ CODE — décliner une palette sans nouvel appel LLM (prouvé)
Les couleurs d'un SVG généré sont en dur dans chaque `fill="#..."`, MAIS on peut les changer entièrement en code :
extraire toutes les couleurs hex (`re.findall`), construire une table « hex sombre → hex clair » par rôle (fond/terre/or/
guerre), l'appliquer au SVG. Compo IDENTIQUE au pixel près, seules les teintes changent. **Une scène générée 1× = autant
d'ambiances qu'on veut (jour, braise, sang) gratuitement.** Prouvé : `braise-or` sombre → `or-jour` lumineux sur la même
compo GPT, zéro appel. (⚠️ Erreur évitée : NE PAS régénérer pour changer la palette — Aziz l'a corrigé, j'avais rappelé
l'API par réflexe.)

### B. CLAUDE = ÉDITEUR SVG — corriger/réécrire un élément raté à la main, sans appel API (prouvé)
Le SVG est du code lisible. Quand le rendu montre un élément raté (la « fumée » de GPT = un blob en S illisible), je peux
le LOCALISER dans le code, le LIRE, et le RÉÉCRIRE moi-même. Prouvé : fumée réécrite à la main = bouffées rondes empilées
qui montent/grossissent/s'estompent + base ardente → vraie colonne de fumée crédible, zéro appel API. **Frontière** : les
formes géométriques/techniques/volutes (fumée, poussière, reflet, lingot, flèche, jauge, trait qui se trace) → je les écris
très bien ; une composition illustrative riche complète → le LLM génère la masse, MOI je retouche/corrige/ajoute dessus.
Tout ce que j'ai ajouté dans cette session (wagonnet, poussière d'impact, reflet, rebond, fumée) = SVG écrit à la main.
**Ne plus jeter une image à 90% bonne pour un détail raté → la RÉPARER.** Combiné au remap couleur (A) : le LLM génère une
fois, je décline et corrige tout en code.

---

## ⭐⭐ USAGE PHARE — l'ENCART CONCEPTUEL EN RUPTURE DE CARTE (prouvé sur le vrai script AES)

> Le SVG ne REMPLACE pas la carte Mapbox/War-Map. Il sert les moments où le script bascule du SPATIAL au
> CONCEPTUEL — là où, aujourd'hui, on force la carte à expliquer une IDÉE abstraite (un principe, un paradoxe,
> un rapport de force). Grammaire : carte (spatial) → **encart SVG plein écran** (le concept) → retour carte.
> C'est exactement la doctrine War-Map "carte = causal/spatial ; conceptuel = overlay/plein écran puis retour".

**Comment repérer un moment SVG dans un script** : si la phrase explique un **PRINCIPE / MÉCANISME / RAPPORT** (pas
un lieu ni un mouvement territorial) → candidat encart SVG. Si elle montre QUI bouge OÙ → reste en carte.

**Les 3 moments identifiés dans le script War-Map Sahel V5** (analyse 2026-06-21, à évaluer en session vidéo dédiée) :
1. ⭐ **Clause de défense mutuelle (P3)** — "agression contre l'un = agression contre les trois" + Charte Liptako.
   PROTOTYPÉ ET PROUVÉ → registre `tactique`, GPT-5.5 gagne. Anim "se construit puis se déclenche" + SFX = ceux du
   hook AES réel (boom-coup + liptako-gong). Vidéo : https://files.catbox.moe/05xbm1.mp4 · statique https://files.catbox.moe/mpbiww.png
2. **Paradoxe villes/campagnes (P2)** — "plus d'armées, plus de territoire perdu ; ils tenaient les villes pas les
   campagnes". Schéma villes-tenues vs surface-perdue + jauges qui divergent. NON prototypé.
3. **Levier ressources vs sanctions (P4)** — "ce levier permet de tenir face aux sanctions". Diagramme balance. NON prototypé.

**Verdict modèle sur l'encart conceptuel** : GPT-5.5 GAGNE (schéma géométrique sec, lisible en 5s, doctrine à l'écran).
4e confirmation de la règle Gemini=organique / GPT=schéma.

**⚠️ Remplacement legacy → SVG : vérifier les doublons SFX moteur.** Quand un encart SVG remplace un
composant legacy (ex: `ResourcesReveal` → `ResourcesRevealSVG`, `CfaReveal` → `CfaRevealSVG`), TOUJOURS
vérifier si le moteur (`SahelWarMapEngine.tsx` ou équivalent) a des `<Sequence><Audio/></Sequence>` câblés
en dur sur les anciennes frames absolues de l'ANCIEN composant — ces SFX deviennent des DOUBLONS
inaudibles/parasites si le nouveau composant gère déjà son propre SFX interne aux mêmes frames. 2
occurrences trouvées et corrigées sur War-Map Sahel (2026-07-04) : SFX impact CFA résiduel + SFX
ink-spread Ressources résiduel.

## 🎛️ LEVIERS DE RAFFINAGE (tous faciles, prouvés ou triviaux — réglages, pas refontes)
- **Épurer les écritures** : chaque texte est dans un groupe (`titre`, labels) → masquer/réduire par un flag. (« jamais de texte nu » reste, mais on peut alléger fortement.)
- **Plus lumineux** : variant de palette du registre (changer 2-3 couleurs de fond/traits dans le bloc `REGISTRES`).
- **Plus lent** : étaler les bornes de frames (180 → 300). Cycles d'animation = fonctions de frame, donc juste des constantes.
- **Pulses autour des cercles** : sonar (cercle dont `r` grandit + `opacity` décroît en boucle) — déjà prouvé (cibles état-major).
- **Glow sur le bouclier / éléments clés** : `filter: drop-shadow(...)` ou `feGaussianBlur` — déjà prouvé (FaceA derrickGlow, rim).

---

## 🔬 VALIDÉ PAR AGENT VIERGE (test reproductibilité 2026-06-21)

Un agent FRAIS en worktree isolé, sujet NEUF (mécanisme du Franc CFA), sans copier aucune solution, a reproduit
le workflow A→Z du 1er coup : intention(DRAINAGE)→forme→registre(`tactique`)→génération→jugement(GPT gagne, 5e
confirmation)→animation JSX→SFX timé→render→upload. **Le système est reproductible.** Proto gardé en référence
(`_rnd/svg-scenes/Cfa*`). Vidéo : https://files.catbox.moe/i241v3.mp4

### ⛔ Trous révélés par le test (gotchas à connaître pour la prochaine fois)
1. **Worktree + système non commité = blocage.** Le générateur, le harnais `_rnd/svg-scenes/` et plusieurs SFX
   `_shared/sfx/` étaient untracked → ABSENTS du worktree. RÉSOLU 2026-06-21 : tout committé sur branche dédiée.
   (Si on refait un test worktree avant un commit : bootstrap = copier script + harnais + `.env` + SFX utilisés.)
2. **Glyphes unicode dans le SVG du LLM** : GPT/Gemini mettent parfois des flèches `↑ ↓` (ou autres glyphes) dans
   les `<text>`. Risque de rendu en police headless → les REMPLACER (ex "(HAUT)/(BAS)") en plus de la conversion
   camelCase→kebab. (Rappel : si du texte FR affiché, accents obligatoires — mais registre technique = souvent sans.)
3. **Pas de helper "marqueur qui suit un path"** : le flux le long d'un lien/conduit est ré-improvisé à chaque fois
   (translation périodique le long du vecteur + opacité en vague sin). BACKLOG : créer `flowAlongAxis(from,to,frame)`.
4. **Conventions mineures non spécifiées** (triviales) : `durationInFrames` du comparatif statique (60f) ; insertion
   Root.tsx des compos R&D = imports + `<Composition>` juste après `<>`, SANS `<Folder>` (ça marche).
5. **GPT-5.5 met des APOSTROPHES SIMPLES** dans les attributs SVG (`id='...'`, `fill='...'`) là où Gemini met des
   guillemets doubles. Le parseur de groupes DOIT gérer les deux (`[\"\x27]` en regex) ; pour innerHTML, remplacer
   `'` → `"` en plus du camelCase→kebab. (Découvert 2026-06-22, scène héros GPT.)
6. **Gemini enveloppe souvent tout dans un `<g id="scene-root">`** unique → descendre d'un niveau pour extraire les
   groupes internes. (2026-06-22.)
7. **Fences markdown autour du SVG (non déterministe)** : un modèle (observé sur Gemini, mais pas systématique —
   le même modèle peut le faire sur un appel et pas un autre) peut enrober sa réponse en ` ```xml ... ``` ` malgré
   la consigne "réponds en SVG brut". Ça casse `rsvg-convert` (erreur XML parse, "Start tag expected"). TOUJOURS
   nettoyer les fences (regex `^```[a-zA-Z]*\n?` / `\n?```$`) avant toute conversion PNG d'un SVG généré par LLM,
   quel que soit le modèle. (2026-07-24, comparatif image-cible Tour Eiffel CFA.)

### ⭐ SNIPPET extraction de groupes (réutilisable — gère apostrophes GPT, guillemets Gemini, imbrication scene-root)
```python
# parse les <g id="..."> de 1er niveau en comptant la profondeur (gere l'imbrication)
def extract_groups(s):
    res={}; i=0
    while True:
        m=re.search(r'<g id=["\']([^"\']+)["\']', s[i:])
        if not m: break
        gid=m.group(1); a=i+m.start(); j=a; d=0
        while j<len(s):
            if s[j:j+2]=='<g': d+=1; j+=2; continue
            if s[j:j+4]=='</g>':
                d-=1; j+=4
                if d==0: break
                continue
            j+=1
        res[gid]=s[a:j]; i=j
    return res
# si Gemini a enveloppe dans scene-root, descendre d'un niveau d'abord :
m=re.match(r'\s*<g id=["\']scene-root["\'][^>]*>(.*)</g>\s*$', svg, re.S)
inner = m.group(1) if m else svg
# pour innerHTML : remplacer apostrophes -> guillemets + camelCase->kebab + nettoyer glyphes ↑↓→
```
Pour ANIMER un groupe injecté : wrapper JSX `<g transform={...} opacity={...} dangerouslySetInnerHTML={{__html: body}} />`
— le wrapper (créé en JSX) EST animable même si son contenu est injecté. C'est LA technique pour contourner « innerHTML
n'anime pas les `<g>` internes ». (Modèle complet : `HeroGptAnimee.tsx`, `CreusetAnimee.tsx`, `GraineGeminiAnimee.tsx` — ⚠️ les 3 fichiers sont archivés dans `_rnd/svg-scenes/_archive/`, exclus du build ; rendus catbox toujours valides : 1ws3kh, yonpoq, ft5l5g.)

7. **Gemini met parfois les styles en `<style>`/`class="..."` dans `<defs>`** (ex ombres portées paper-cut `class="shadow"`).
   En injection innerHTML ces classes perdent leur scope → l'élément devient invisible. Les INLINER avant injection :
   remplacer `class="shadow"` par les attributs réels (`fill="..." opacity="..."`). (Découvert par l'agent vierge, 2026-06-22.)
8. **Fallback PROVIDER indisponible** : si un provider échoue (ex OpenRouter `402 Payment Required` = crédits GPT épuisés),
   NE PAS bloquer — continuer avec l'autre, en choisissant selon la nature (organique/atmosphérique → Gemini ; schéma/
   objets nets → GPT). Signaler à Aziz « GPT indispo, je continue avec Gemini » + lui dire de recharger s'il veut comparer.
9. **Sous-découper un `<g>` unique en sous-couches animables** : quand le LLM met plusieurs couches dans UN seul `<g id>`
   (ex feuillage = 5 paires ombre+couleur dans `<g id="feuillage">`), les séparer côté JSX par regex pour les animer en
   vagues : `const parts = G_FEUILLAGE.match(/<g[\s\S]*?<\/g>/g); // puis regrouper par paires`. (Backlog : helper
   `growFrom(anchor, scale)` pour les ancres de croissance, analogue au `flowAlongAxis` déjà noté.)
10. **NE JAMAIS faire un `.replace("'", '"')` GLOBAL sur la réponse brute** pour convertir les apostrophes
    d'attributs : ça casse aussi les apostrophes FR du CONTENU texte affiché (`<text>AXE D'ATTAQUE</text>` →
    `AXE D"ATTAQUE`). Quand le modèle renvoie un JSON `{scene_svg}` : parser depuis le JSON (apostrophes du
    texte intactes), PUIS convertir SEULEMENT les attributs (camelCase/kebab + quotes) via le regex d'attributs
    — pas un replace aveugle sur toute la string. (Confirmé Kimi K3 2026-07-17 ; vaut pour tout modèle qui
    mêle attributs à apostrophes et texte FR affiché.)

## ⭐⭐⭐ FINITION ORCHESTRÉE — l'agent fait le gros œuvre, Claude+Aziz ajoutent la VIE (prouvé 2026-06-22)
> Vision d'Aziz pour scaler : un AGENT produit la scène A→Z (gros œuvre), PUIS on regarde le rendu réel et on ajoute une
> COUCHE DE FINITION ciblée — sans tout refaire. C'est du travail d'orchestration, pas de pixel. Prouvé : l'arbre de l'agent
> vierge (figé une fois poussé) → on a ajouté en code, sur SON fichier, ce qui le rend VIVANT.
**Les gestes de finition « organique » réutilisables (tous prouvés sur l'arbre)** :
- **Balancement au vent** : oscillation `sin` DÉPHASÉE par étage (tronc bouge peu, branches moyen, feuillage/extrémités le
  plus), `rotate(sway)` autour du point d'attache. Démarre une fois l'élément en place. → transforme un élément figé en vivant.
- **Soleil/source actif** : rayons qui tournent (`rotate(f*0.25)`) + halo glow (`<circle>` flou opacité respirante) + pulse.
- **Élément qui se détache et TOMBE** : chute + rebond (`spring` sur Y) + squash à l'impact + SFX thud. (Cycle qui se referme.)
- **Particules qui flottent** (feuilles/pétales/étincelles) : chute lente + zigzag `sin` + rotation, fade avant le bord.
- **Fruits/bourgeons qui POP** : `spring` élastique décalé (cascade).
⭐ **SFX NATURE GÉNÉRÉS** (pas la banque War-Map, trop sombre pour une scène douce) : générer des SFX adaptés via ElevenLabs
(`scripts/generate-sfx-elevenlabs.py` modèle ; sortie `public/_shared/sfx/nature/`). Faits : `birds-ambient` (loop, ambiance),
`wind-leaves` (loop, bruissement), `growth-pop` (la pousse), `fruit-drop` (le fruit qui tombe). ⚠️ Sources ElevenLabs nature
= DOUCES (mean ~-24 dB) → remonter le volume (oiseaux ~0.85, vent ~0.5) pour un mix audible ; revérifier `volumedetect`.

---

## ✅ LES SCÈNES PROUVÉES

| Scène | Registre | Modèle retenu | Grammaire anim | Vidéo |
|---|---|---|---|---|
| Ville / port | médaille | Gemini | RESPIRE | https://files.catbox.moe/nv6iy6.mp4 |
| Carte d'état-major | médaille | GPT-5.5 | SE CONSTRUIT (flèches tracées) | https://files.catbox.moe/pt5od0.mp4 |
| Plateforme offshore | blueprint | Gemini | SE CONSTRUIT + flux qui monte | https://files.catbox.moe/o6vxpc.mp4 |
| ⭐ Offshore + SFX timé | blueprint | Gemini | idem + son frame-perfect | https://files.catbox.moe/s1jloa.mp4 |
| ⭐⭐ Défense mutuelle AES | tactique | GPT-5.5 | SE CONSTRUIT + DÉCLENCHE + SFX | https://files.catbox.moe/05xbm1.mp4 |
| Mine d'or Darfour (16:9, chargée) | braise-or | Gemini | RESPIRE 28s, 2 couches | https://files.catbox.moe/lkf0ia.mp4 |
| ⭐⭐⭐ « Suivre l'or » Soudan HÉROS (16:9) | or-jour | GPT-5.5 | tomber-sec + bascule couleur + fade + fumée→ciel noir | https://files.catbox.moe/1ws3kh.mp4 |
| Creuset « l'or devient la guerre » (16:9) | braise-or éclairci | GPT-5.5 | TRANSFORMATION (creuset bascule → balles émergent) | https://files.catbox.moe/yonpoq.mp4 |
| ⭐ Graine → arbre (16:9) | papier-decoupe | Gemini | SE CONSTRUIT + FINITION orchestrée (vent · soleil actif · fruit tombe · feuilles flottent · SFX nature) | https://files.catbox.moe/ft5l5g.mp4 |
| ⭐ « D'une graine naît un arbre » PÉDAGOGIQUE (16:9) | papier-decoupe | Gemini | SE CONSTRUIT bas→haut (graine→tronc scaleY→feuillage en vagues) + 2 couches | https://files.catbox.moe/wv4xlm.mp4 |

Code : `src/projects/_rnd/svg-scenes/_archive/{VilleGeminiAnimee, EtatMajorGptAnimee, OffshoreGeminiAnimee, OffshoreGeminiAnimeeSFX, DefenseGptAnimee, MineGeminiAnimee, HeroGptAnimee, CreusetAnimee, GraineGeminiAnimee}.tsx` — ⚠️ tous ces fichiers sont archivés (`_archive/`, exclus du `tsconfig.json`), les rendus catbox listés ci-dessus restent la référence visuelle valide.

📼 **RENDUS DE RÉFÉRENCE (fichiers .mp4 gardés) → `out/_r-and-d/svg-scenes-refs/`** (voir son README). ⚠️ Réfs R&D
« ce qu'on sait faire », PAS des livrables — réadapter au script/audio réels avant tout usage épisode.

⭐ **« Suivre l'or » = la scène-référence de la doctrine ÉPURE + 16:9 + remap couleur + Claude-éditeur-SVG** (session
2026-06-22, sur le vrai script Soudan mid-form Acte 1 « il ne faut pas suivre les armes, il faut suivre l'or »). C'est
le meilleur exemple de « scène-héros qui raconte » (pelle plantée = l'humain par son outil · lingot qui luit puis fade ·
terre qui vire au rouge sang sur « la guerre »). Note modèle : sur une scène CONCRÈTE/ÉPURÉE à objets nets, **GPT-5.5
redevient compétitif voire meilleur** que Gemini (sa rigueur sert l'épure) — Gemini garde l'avantage sur l'atmosphérique/
riche. → générer les 2 reste la règle, le choix dépend de l'intention (atmosphère = Gemini · objets nets épurés = GPT).

---

## TECHNIQUE — le prompt (ce qui fait la richesse d'animation)

Le LLM DOIT recevoir (voir `rnd-svg-scene-gen.py`, bloc `COMMON`) :
1. **Registre + palette stricts** (gravure dorée, traits rouges) + viewBox 1024×1024 dans un disque r≈480.
2. **Découpe OBLIGATOIRE en `<g id="...">` nommés**, 6–12 groupes, un par élément animable séparément.
   ⭐ C'est LE point le plus déterminant : la richesse d'animation = la finesse du découpage.
3. **Composer EN PENSANT AU GESTE** : laisser l'espace pour le mouvement (eau autour d'un navire pour tanguer,
   fumée au-dessus d'une cheminée pour monter, bras de grue dans un sous-groupe `id` distinct pour pivoter).
4. **Plans nommés** (`bg-*`, `mid-*`, `fg-*`) pour la parallaxe.
5. **Zéro animation côté LLM** (statique pur) + attributs SVG natifs. Réponse JSON `{scene_svg, groups, anim_suggestions}`.

⚠️ Gotcha injection : les LLM rendent du JSX (camelCase `strokeWidth`). Pour injecter en `innerHTML` (SVG standard),
convertir camelCase→kebab (`stroke-width`, `stroke-dasharray`, `stroke-linejoin`, `text-anchor`, `font-size`…).

⛔ Gotcha ANIMATION (prouvé 3×) : un SVG injecté en `innerHTML` ne permet PAS d'animer les `<g>` internes (on ne
peut pas leur poser `transform`/`strokeDashoffset` en JSX). Pour la version animée → **RÉÉCRIRE la scène en VRAI
JSX** : copier le `scene_svg`, transformer en JSX (camelCase), poser les attributs animés directement sur les
`<g id=...>`/`<path>` ciblés. L'injection innerHTML sert au RENDU STATIQUE (juger la matière) ; le JSX sert à
l'ANIMATION. Modèle de référence pour le tracé : `EtatMajorGptAnimee.tsx` + `OffshoreGeminiAnimee.tsx`.

---

## DEUX GRAMMAIRES D'ANIMATION (selon la scène)

- **Scène qui RESPIRE** (ville/paysage organique) : vie continue en boucle. Fumée monte+ondule (translateY+skew sin),
  grue pivote (rotate pendulaire autour d'un pivot), eau ondule (sin, prouvé FaceA), navires tanguent (rotate léger),
  soleil pulse (opacity), oiseaux dérivent, **parallaxe** (bg lent / fg rapide). + bonus narratif pilotable
  (eau qui noircit `oilSpread`, cheminées qui rougissent) — exactement le modèle `SenegalCoinFaceA_SVG`.
- **Scène qui SE CONSTRUIT** (carte d'état-major / schéma) : apparition SÉQUENCÉE narrative. Fond fade-in → positions
  pop + cibles pulsent (anneaux sonar) → zones de contrôle se remplissent (balayage) → ⭐ **flèches se TRACENT une
  par une** (`stroke-dasharray`=longueur, `stroke-dashoffset` animé L→0 = la main qui dessine ; pointe à la fin) →
  boussole+légende fade-in. Piloté par des `progress` 0→1 séquencés (callables sur une voix off plus tard).

---

---

## ⭐⭐ SFX TIMÉ FRAME-PERFECT — la vraie valeur ajoutée (prouvé proto offshore)

L'atout DÉCISIF de ces scènes vs une vidéo IA (Seedance/Kling) : **on connaît la frame EXACTE de chaque
événement** (tel trait se trace à f88, le pétrole part à f110…) → on pose un SFX *frame-perfect* sur chaque geste.
Impossible avec une vidéo générée où l'action arrive "quelque part". Marche dans les 2 sens : SFX calé sur
l'image, OU image synchronisée sur une nappe/voix posée d'abord (= notre doctrine audio-derived devenue instrument).

**Mapping geste → son (proto `OffshoreGeminiAnimeeSFX.tsx`, 100% banque `_shared/sfx/`, zéro génération)** :
- trait de structure qui se trace → `warmap/arrow-whoosh.mp3` (whoosh bas et sec) sur CHAQUE frame de tracé
- apparition (torchère/réservoir) → `ui/node-appear.mp3` · structure complète → `impact/impact.mp3`
- flux continu (pétrole qui monte) → ⛔ PAS `tension-drone` (proscrit, décision Aziz 2026-06-27 : le grondement
  d'assise continu dérange à l'écoute — retiré de War-Map Sahel partout). Préférer un SFX PONCTUEL répété en
  boucle discrète (ex `ink-spread.mp3` espacé) ou laisser la musique de fond porter la continuité.
- annotation (cote/étiquette) → `data/tick-counter.mp3` (tick sec) échelonné
- ouverture de planche → `ui/whoosh.mp3`

**Règles SFX (rappel [[SFX-INDEX]]/[[feedback_sfx-sequence-et-drapeaux-reels]])** : `<Sequence from={F} durationInFrames={20+}>`
OBLIGATOIRE autour de chaque `<Audio>` (JAMAIS `frame===X` → inaudible en render) · volume plancher 0.50 (0.40 pour un
drone de fond continu) · vérifier la durée au `ffprobe` avant usage (anti-corruption) · vérifier la piste audio du
render au `ffprobe`/`volumedetect` (mean dB ≠ silence) avant de présenter.

---

## RÉUTILISATION PAR PILIER
- **Souverain** : objet-symbole économique gravé (la pièce) · ville/port/raffinerie (médaille) · **infrastructure en blueprint** (plateforme, gazoduc, barrage) — registre neuf très porteur.
- **War-Map / AES** : ⭐ carte d'état-major "qui se construit" (flèches tracées) = très réutilisable. Campement, colonne, sceau.
- **Atlas (historique)** : caravane, cité, empire — registre encre/parchemin chaud (à tester).

## RESTE À TESTER (axes non encore sondés — une scène à la fois)
- ~~Formes ORGANIQUES~~ : ✅ TRANCHÉ (voir DOCTRINE D'ORIENTATION ci-dessus) — le SVG n'est PAS pour l'organique humain/animal.
- Formes organiques NON-figuratives (flamme, fumée, eau, fluides) : pas encore testées, potentiellement OK (pas d'uncanny).
- Registres visuels NEUFS restants : **néon/data-terminal**, **papier découpé** (pédagogique). (médaille ✅ · blueprint ✅ · encre ✅.)
- Brancher une scène SVG dans une VRAIE vidéo (plein écran + voix off + SFX timé) — le proto SFX est prouvé, reste l'intégration épisode.

## ⭐⭐ DEUX RÈGLES D'IMPLÉMENTATION (prouvées Cacao B3/B4, 2026-06-29)

### 1. COUCHE DE VIE PERMANENTE (sin) — obligatoire pour toute scène > 5s
Une scène SVG a DEUX couches d'animation, pas une :
1. **Gestes narratifs forts** : `interpolate()` timés (un arbre pousse, une barre se forme, l'usine se construit). One-shot, ils FINISSENT.
2. **Couche ambiante permanente** : `Math.sin(frame/...)` qui ne s'arrête JAMAIS — sway feuillage (TOUS les arbres, même morts), glow soleil qui respire, rayons qui tournent, nuages qui dérivent (fade aux bords, jamais hors cadre), fumée en bouffées désync, oiseaux qui battent.
**Si on n'a que (1)**, la scène se fige entre les gestes → Gemini diagnostiquera « trop statique » (c'est arrivé sur le verger B3 v4, corrigé en v5). Implémentation : passer `windPhase={frame}` au composant, calculer les oscillations à l'intérieur. La couche ambiante tourne tant que la scène dure.

### 2. COMPOSANT À ÉTATS PILOTÉ PAR PROPS = fil de transformation multi-beats
Coder un composant SVG à N états dont TOUTE la logique de transformation est en **props** — ZÉRO `useCurrentFrame` interne. Le beat parent calcule les progressions (audio-derived) et les passe en props. Prouvé : `VergerCacao` (états mort/reverdit/fissure) réutilisé tel quel en B3 ET B4 — même monde qui évolue (le verger de B3 reverdit puis se fissure en B4), sans dupliquer le code. Avantages : continuité du monde (fil de transformation, cf [[INTENTION-FORME-SVG]]), état de chaque beat testable isolément (compo preview), un seul endroit à corriger. Pattern complémentaire : un composant "construction" piloté par `build`/`colorize` (trace ordonné structure→détails) — cf `UsineConstruction`.
