---
name: Style Paper-Craft Sepia — Valide pour production
description: Style flat 2D paper-craft teste 9x i2v (8 succes) + 0/3 ref-to-video (echec confirme). Pipeline Gemini+Seedance i2v UNIQUEMENT. Scenes multi-shots = 3 clips i2v 5s + Remotion assemblage. Combat = start/end frame. Thiaroye = paper-craft palette froide.
type: project
originSessionId: e7194ce4-f000-450b-bd09-9f9210b5473c
---
# Style Paper-Craft Sepia — Valide (2026-04-18)

## Verdict : VALIDE — style de production rapide

**Why** : Seedance maintient parfaitement le style paper-craft en image-to-video (8/8 succes, 0 morphing, 0 drift). Permet un pipeline ~1h15/Short vs jours/semaines en BD flat.

**How to apply** : utiliser pour contenu frequent (news geopolitique, sujets d'actualite, Thiaroye). Coexiste avec le BD flat Seedance (Shorts premium Soundjata/Abou Bakari).

## Pipeline valide

```
1. Gemini 3.1 Flash (avec ref style) -> image paper-craft coherente
   OU GPT Image 1.5 -> image initiale (puis Gemini pour variantes avec style-ref)
2. Seedance image-to-video + clause STRICT STYLE FIDELITY -> clip anime
3. Remotion assemblage
```

## Clauses prompt obligatoires (STRICT STYLE FIDELITY)

```
Animate this exact illustration. STRICT STYLE FIDELITY: maintain the 
exact visual style — flat 2D paper-craft, warm sepia palette, simple 
character shapes with dot-eyes, clean dark outlines, flat color fills, 
paper texture. Do NOT add detail or realism.
```

## Tests realises ($0 images + $6 Seedance session 1 + ~$8 session 2)

| Test | Duree | Mode | Resultat |
|------|-------|------|----------|
| Soumaoro village (calme) | 5s | image-to-video | Style parfait, mouvements OK |
| Abou Bakari plage (marche) | 5s | image-to-video | Style parfait, mouvements naturels |
| Kirina combat (action) | 10s | image-to-video | Style maintenu 10s, arc narratif complet |
| Soumaoro village (calme) | 5s | reference-to-video | ECHEC — style ignore, cartoon par defaut |
| Thiaroye camp sombre (palette froide) | 5s | image-to-video | Style parfait, palette froide tenue, micro-details (gouttes eau) |
| Marketplace enrichi (diversite) | 5s | image-to-video | Style tenu, zero morphing malgre visages plus detailles |
| Combat choregraphie (ref-to-video) | 8s | reference-to-video | ECHEC — style drift, choregraphie ignoree (0/2 confirme) |
| Combat start/end frame dirigiste | 8s | image-to-video start+end | Style 100%, choregraphie respectee, combat dynamique |

## Lecons cles

1. **Image-to-video OBLIGATOIRE** — reference-to-video ignore le style paper-craft
2. **Gemini meilleur que GPT pour la coherence de style** — GPT drift vers plus de detail a chaque edition
3. **Palette adaptable** — sepia = legende, sombre = conflit, vif = prosperite, bleu/or = exploration
4. **Verbes explosifs fonctionnent** — meme sur personnages simples, les mouvements sont lisibles
5. **GPT Image 1.5 edition chirurgicale fonctionne** — comparable a Gemini pour corrections

## Comparaison avec BD flat

| Critere | Paper-craft | BD flat Seedance |
|---------|------------|-----------------|
| Fidelite Seedance | 9-10/10 | 7-8/10 |
| Temps par clip | 1 passe | 2-4 iterations |
| Cout par clip | $1.50-3 | $5-15 |
| Refs necessaires | 1 image | 3-5 (storyboard + char sheets) |
| Beaute visuelle | Correcte | Superieure |
| Risque morphing | Quasi-nul | Frequent |

## Images generees (dans /tmp/flat-sepia-test/)

- `soundjata-village-tyrannie.png` — REF DE STYLE CANONIQUE (GPT Image 1.5)
- `soundjata-barre-de-fer.png` — GPT
- `abou-bakari-ocean.png` — GPT (trop detaille)
- `abou-bakari-ocean-gemini.png` — Gemini avec style-ref (BON, coherent)
- `amanirenas-charge-v3.png` — GPT (style drift vers BD flat)
- `amanirenas-charge-gemini.png` — Gemini (meilleur mais Amanirenas pas feminine)
- `amanirenas-throne-v2.png` — GPT (corrigee, tete unique)
- `hannibal-elephants-alps.png` — GPT
- `hannibal-cannae-aerial.png` — GPT (vue tactique)
- `combat-kirina-papercraft.png` — Gemini (combat Soundjata vs Soumaoro)
- `dialogue-matrone-sogolon.png` — Gemini (confrontation matrone/Sogolon, style coherent)
- `barre-de-fer-papercraft.png` — Gemini 9:16 (Soundjata + barre de fer, femmes bras neutres R-PC1)
- `mature-thiaroye-tirailleurs.png` — Gemini variante mature (TROP DETAILLE, drift BD flat)
- `mature-mansa-musa-gold.png` — Gemini variante mature (TROP DETAILLE, drift BD flat)
- `mature-queen-nzinga-negotiation.png` — Gemini variante mature (TROP DETAILLE, drift BD flat)

## Videos Seedance (Vercel Blob)

- Soumaoro village 5s (ref-to-video ECHEC) : `.../tests/flat-sepia-tyrannie-5s-*.mp4`
- Soumaoro village 5s (i2v OK) : `.../tests/seedance-i2v-tyrannie-5s-*.mp4`
- Abou Bakari plage 5s : `.../tests/seedance-abou-bakari-5s-*.mp4`
- Kirina combat 10s : `.../tests/seedance-combat-kirina-10s-*.mp4`
- Dialogue matrone 7s : `.../tests/seedance-dialogue-matrone-7s-*.mp4`
- Barre de fer dolly-in 5s : `.../tests/seedance-barre-dolly-in-*.mp4`
- Barre de fer orbite 180 5s : `.../tests/seedance-barre-orbit-180-*.mp4`
- Barre de fer crane-up 5s (ECHEC) : `.../tests/seedance-barre-crane-up-*.mp4`

## Regles specifiques paper-craft (apprises 2026-04-18)

### R-PC1 : Image source = position NEUTRE (confirme R39)
Les personnages dans l'image source doivent etre dans leur position de DEPART, pas leur reaction finale.
Erreur : femmes avec mains sur bouche des le depart = figees toute la video.
Fix : generer l'image avec bras le long du corps, le prompt demande la reaction.

### R-PC2 : Personnage recurrent = intention CONSTANTE dans CHAQUE scene
Soundjata = TOUJOURS defiant, jamais defait ou pleurant. Definir l'intention du personnage dans le prompt meme si la scene est centree sur un autre personnage.
Pattern : "The small boy on the ground CLENCHES his fists, jaw SET, staring DEFIANTLY — he does NOT cry, does NOT look away."

### R-PC3 : Larmes = NE PAS demander sur personnages paper-craft
"Tears WELL" produit des grosses gouttes cartoon comiques sur des visages dot-eyes. L'emotion passe par la POSTURE (tete baissee, epaules tombantes), pas par les larmes. Reserver les larmes au style BD flat qui a des visages detailles.

### R-PC4 : Audio Seedance dialogue = exploitable mais remplacer
Le lip sync visuel fonctionne en paper-craft. L'audio Seedance transmet l'emotion (colere, arrogance) mais la prononciation francaise est approximative ("cueillir" → "cuir", "baobab" deforme). Workflow : garder le lip sync visuel, strip audio, overlay ElevenLabs.

### R-PC5 : Avantage anti-detection AI
Le style paper-craft ne declenche pas le reflexe "AI generated" chez les spectateurs car :
- Il imite un medium pre-AI (illustration traditionnelle/livres)
- La texture papier masque les artefacts
- Les imperfections passent pour des choix artistiques
- Il ne ressemble pas aux patterns Midjourney/DALL-E reconnaissables

### R-PC6 : START frame = sol propre, zero effets dessines
Les elements graphiques dessines dans l'image source (nuages de poussiere, trainee de mouvement, lignes de vitesse) sont interpretes par Seedance comme des OBJETS PERMANENTS du decor — ils restent statiques pendant toute la video. Fix : generer le START frame avec un sol propre et des personnages en position neutre. Laisser Seedance creer ses propres effets via le prompt. Valide 2026-04-18.

### R-PC7 : END frame = pose finale SANS trainee de mouvement
Les trainee de slash, lignes courbes de mouvement, ou debris dessines dans l'END frame sont aussi interpretes comme des objets permanents (cercles/arcs autour du sabre). Fix : generer l'END frame avec UNIQUEMENT la pose finale du personnage, sans aucun effet graphique de mouvement. Le sabre etendu suffit. Valide 2026-04-18.

### R-PC8 : Combat paper-craft = start/end frame + prompt dirigiste (PAS reference-to-video)
Reference-to-video echoue 0/2 en paper-craft (style ignore, choregraphie non transferee). Le workflow valide pour le combat : generer START + END frames coherents (END derive du START via Gemini chirurgical), puis Seedance image-to-video avec prompt shot-by-shot SECONDS X TO Y. Resultat : combat dynamique, style 100% maintenu, choregraphie suivie. Valide 2026-04-18.

### R-PC9 : Paper-craft "enrichi" (visages detailles) tient aussi en Seedance
Style avec plus de details (nez, levres, motifs vetements fins) = mix entre paper-craft pur et BD flat. Seedance maintient ce style sans morphing supplementaire (teste 1/1 marketplace 5s). Utile pour scenes de foule ou la lisibilite individuelle compte. Mais risque theorique plus eleve que paper-craft pur sur des clips plus longs — a confirmer.

### R-PC10 : Palette froide = fonctionne sans changer anatomie
Changer PALETTE (sepia → gris-bleu/kaki/olive) sans changer ANATOMIE = style paper-craft parfaitement maintenu en Seedance. Les micro-details (gouttes d'eau, flaques, reflets) sont meme mieux animes en palette froide. Le mot "mature" dans le prompt Gemini = piege (drift vers BD flat). Valide 2026-04-18 (Thiaroye camp).

### R-PC11 : Storyboard-to-video = INTERDIT en paper-craft (0/4 DEFINITIF — NE PLUS RETESTER)
Le mode reference-to-video (utilise pour storyboard-to-video) ignore SYSTEMATIQUEMENT le style paper-craft. Teste 4x : (1) village sepia, (2) combat anime choregraphie, (3) Thiaroye scene narrative 15s, (4) Scene 3 Sonjata avec char sheets + env plate + storyboard 6 panels + clause STRICT STYLE FIDELITY + prompt detaille 3600 chars — TOUS produit un style different (low-poly/3D/semi-realiste). Meme avec les meilleures refs et les meilleurs prompts, le mode reference-to-video applique son propre style par defaut. Raison architecturale : en ref-to-video les images sont des "suggestions de contenu", pas des ancres de style. En image-to-video l'image EST le style. NE PLUS RETESTER.

### R-PC12 : Scenes narratives multi-shots = 3 clips i2v 5s + Remotion
Alternative au storyboard-to-video pour scenes narratives (15s) en paper-craft : decouper en 3 clips image-to-video de 5s chacun. (1) Generer 3 images paper-craft (wide, medium, close-up ou autre progression). (2) Seedance i2v 5s chacun. (3) Assembler en Remotion avec transitions. Cout identique (~$4.50), style garanti (i2v = 8/8 succes). Pas encore teste mais logiquement valide (chaque clip i2v individuel fonctionne). A valider 2026-04-19.

### R-PC13 : POV premiere personne = demi-succes (ne pas suivre un projectile)
POV paper-craft fonctionne pour la partie statique (viser, tenir un objet). Quand le prompt demande de SUIVRE un projectile en vol ("camera FOLLOWS the arrow"), Seedance fait une rotation 180 au lieu de suivre la trajectoire. Fix : ne pas demander de suivi de projectile dans un POV. Splitter en 2 clips : (1) POV viser+tirer, fleche quitte le cadre, (2) troisieme personne impact. Valide 2026-04-18.

### R-PC14 : Continuite inter-scenes = derniere frame editee comme START suivant
Pour assurer la continuite visuelle entre deux scenes consecutives (meme lieu, meme personnages), utiliser la derniere frame du clip precedent comme base pour l'image START de la scene suivante. Edition chirurgicale Gemini pour changer la posture/expression du personnage principal sans changer le decor ni les figurants. Valide conceptuellement 2026-04-19 (Scene 2 → Scene 3 Sonjata : insulte → rage → decision). A tester en production session suivante.

### R-PC15 : Deplacements figurants = OK mais prompt TRES litterale
Les deplacements de figurants rajoutent de la vie et sont encourages. MAIS le prompt doit specifier : (1) identite distincte du figurant par vetement+taille ("the smaller child in brown cloth"), (2) direction exacte ("toward the BACKGROUND"), (3) destination finale ("EXIT behind the hut on the RIGHT"). Sans ces precisions, Seedance duplique le figurant (copie fantome a la position initiale). Valide 2026-04-19 (Scene 2 enfant multiplie).

### R-PC16 : Storyboard COLORE paper-craft + image-to-video = SOLUTION multi-shot (1/1 VALIDE)
Contournement du probleme R-PC11 (ref-to-video echoue 0/4 en paper-craft). Au lieu de passer un storyboard N&B en reference-to-video avec des refs separees, on genere un storyboard COLORE dans le style paper-craft exact (via Gemini avec style-ref) puis on le passe en IMAGE-TO-VIDEO. Le style est verrouille par l'image elle-meme.

**Workflow valide :**
1. Generer un storyboard N panels en paper-craft colore (Gemini + style-ref d'une image validee)
2. Separer les panels par un GAP NOIR EPAIS (~30px) + bordures noires (pas une simple ligne fine)
3. Passer en image-to-video avec prompt : "This image is a N-PANEL STORYBOARD reading LEFT to RIGHT. Each panel is a different scene on its own. Animate it as N SEPARATE SCENES with clean CUTs between them. Do NOT animate the panels simultaneously."
4. Decrire chaque panel avec SECONDS X TO Y

**Teste** : 2 panels (forgeron arrive → barre plantee), 5s, Dreamina web. Style 100% maintenu, cut propre, composition fidele au storyboard, Seedance a compris la sequence. Valide 2026-04-20.

**Avantages vs 3 clips i2v separes** :
- 1 seul clip au lieu de 3 = meilleure continuite visuelle intra-scene
- Seedance gere les transitions entre panels = plus naturel que cut franc Remotion
- Meme cout ($1.50/5s)

**A tester encore** : 6 panels en 15s (scene complete), 3+ panels en 10s. Le gap noir aide Seedance a distinguer les panels.

**Gotcha 1 (test 3 panels)** : Seedance peut SAUTER ou FUSIONNER deux panels adjacents si la difference visuelle entre eux est trop subtile (ex: meme cadrage, meme personnages, seule difference = mains sur la barre vs pas sur la barre). Pour eviter ca, chaque panel doit etre visuellement TRES DISTINCT du suivant — changement de cadrage (wide->medium->close-up), de composition, ou d'action majeure. Les micro-differences de posture ne suffisent pas a declencher un cut.

**Gotcha 2 (test 3 panels)** : le prompt doit explicitement LIER chaque numero de panel a sa POSITION dans l'image. Ne pas se contenter de "LEFT to RIGHT". Ecrire : "PANEL 1 is the LEFTMOST image. PANEL 2 is the CENTER image. PANEL 3 is the RIGHTMOST image. Animate them IN ORDER: PANEL 1 first, then CUT to PANEL 2, then CUT to PANEL 3." Cela aide Seedance a ne pas confondre les panels.

### R-PC17 : Dot-eyes stricts quand emotion importante (valide 2026-04-23)
Quand un personnage doit transmettre une emotion forte, Gemini tend a dessiner une structure oculaire complete (iris + blanc + pupille) au lieu des dot-eyes. Pour eviter : ajouter clause courte `"strict dot-eyes: single black dot, no iris, no white"` et NE JAMAIS combiner avec "moist eyes / tearful / watery eyes" — ces mots forcent la structure. L'emotion passe par posture, cadrage, direction du regard, tension du corps. Observe sur moodboard Thiaroye image mere-village v1 (iris blancs apparus malgre "dot-eyes" dans prompt initial).

### R-PC18 : Atmosphere riche sans drift BD (valide 2026-04-23)
Les mots atmospheriques (sunlight, highlights, warm glow, golden light, streams through leaves, petals) sont AUTORISES — ils creent la beaute des scenes vives/poetiques, ne pas les bannir. Si drift BD observe apres generation (joues rosees avec degrades, meches cheveux detaillees, veinures bois, ombrage uniforme), ajouter clause de rappel courte en fin de prompt : `"render in flat color fills only — warmth comes from palette choice, not from shading gradients"`. Observe sur moodboard Thiaroye image provence-baiser v1 (drift vers BD flat Disney-esque). La v2 avec clause anti-shading a corrige le drift a ~80% sans sacrifier la poesie atmospherique.

### R-DYNAMIC : Mouvement intrinseque obligatoire (valide 2026-04-23, Thiaroye V5 scene 1 v1)

**Tout Short 9:16 doit avoir au moins UN mouvement intrinseque par scene — le mouvement camera VIENT EN PLUS, pas a la place.**

**Probleme identifie** : scene 1 Thiaroye V5 v1 (tirailleurs immobiles + dolly in + orbit 45deg) = seule la camera bouge. Perte retention garantie sur un Short, meme avec style paper-craft valide. La fidelite manifest ("tirailleurs dignes immobiles") a ete suivie sans penser dynamique Short.

**Regle** :
- Chaque scene doit inclure AU MOINS un mouvement intrinseque dans le cadre :
  - Element qui bouge (navire qui glisse, fumee, eau qui ondule, tiroir qui se ferme, vent dans les vetements, vagues, oiseaux)
  - Action qui se deroule (main gantée qui range un dossier, main qui tombe, personnage qui tourne la tete)
  - Changement d'etat visible (portrait qui s'illumine, poussiere rouge qui s'etend, ciel qui evolue)
- Le mouvement camera (dolly/orbit/pan/tilt) s'AJOUTE au mouvement intrinseque, il ne le remplace pas.
- Scenes "contemplatives" = NE PAS confondre avec "statiques". Contemplatif = rythme lent + mouvement subtil (vent, lumiere, micro-gestuelle), pas absence totale de mouvement.
- Exception rare : scene "plan-tableau" (post-massacre, silhouettes figees) peut etre statique SI elle dure <3s et est encadree par des scenes dynamiques.

**Check a faire AVANT de lancer un prompt Seedance i2v** :
1. Regarder l'image source : qu'est-ce qui va bouger intrinsequement pendant 5-13s ?
2. Si seule la camera bouge = DANGER, regen avec element dynamique
3. Lister explicitement les mouvements intrinseques dans le prompt Seedance

**Applications immediates** :
- Thiaroye V5 scene 1 : regen avec navire colonial qui glisse/accoste + fumee + eau + silhouettes sur pont
- Thiaroye V5 scene 4A "Archives" : ajouter tiroir qui se ferme / main gantee qui range / feuilles qui bougent
- Thiaroye V5 scene 6 "CTA" : vagues + vent dans vetements + ciel qui evolue + eventuellement oiseaux
- Futurs projets (Abou Bakari II et suivants) : passer systematiquement chaque scene au filtre R-DYNAMIC

**Cout apprentissage** : $3.90 (clip Scene 1 v1 gardable comme reference "what not to do", mais pas publiable).

### R-DYNAMIC v2 : Vie organique, pas statues (enrichissement 2026-04-23, Aziz feedback contradiction prompt Scene 1 regen)

**Evolution de R-DYNAMIC** : ne suffit pas d'avoir des elements dynamiques externes (navire, fumee, eau) — les PERSONNAGES eux-memes doivent avoir de la vie organique.

**Principe** : les personnages dans une scene doivent avoir des postures naturelles variees + activites secondaires (fumer, discuter, regarder, s'appuyer, bouger un peu). Eviter la sur-protection R-PC1 qui transforme les personnages en statues. **Neutre != sans vie.**

**Sauf si** la scene narrative exige explicitement l'immobilite :
- Moment de recueillement (ex: devant tombe, memorial)
- Dignite funeraire
- Silhouettes tombees R-PC19 (post-massacre, plan-tableau)
- Dignite politique face a camera posee (portrait pose style)

**Comment equilibrer avec R-PC1** :
- R-PC1 dit "pas d'action MAJEURE gelee dans l'image source" = pas de salut militaire fige, pas de bras leve en triomphe, pas de combat en plein swing
- Activites SECONDAIRES naturelles = ENCOURAGEES :
  - Fumer une cigarette (smoke curls = matiere Seedance pour animer)
  - Discuter en petits groupes (tetes tournees les unes vers les autres)
  - S'appuyer sur une rambarde (weight shift naturel)
  - Observer au loin (regard dirige, corps en transition)
  - S'asseoir sur un sac de voyage
  - Tenir son beret a la main
  - Mains dans les poches
  - Allumer un briquet

**Probleme identifie 2026-04-23** : sur-protection reflexe R-PC1 + R77 Seedance a produit dans le prompt Scene 1 regen une contradiction interne (INTRINSIC MOTION ANCHORS demandait "subtle micro-movements" pendant que CHARACTER POSITION CRITICAL demandait "All deck figures STILL, no raised arms, no waving"). Gemini aurait interprete la partie restrictive et produit des statues — exactement le probleme de v1.

**Check de revue de prompt obligatoire** : scanner les sections du prompt pour detecter contradictions entre "dynamique attendue" et "immobilite imposee". Si contradiction = une des deux sections est a reecrire.

**R-DYNAMIC prime** pour scenes d'arrivee, de voyage, de retour, d'observation, de quotidien. R-PC1 (neutre) NE VEUT PAS DIRE "statue" — ca veut dire "pas d'action majeure gelee".

---

### R-PC19 : Graphique stylise autorise en paper-craft (valide 2026-04-23)
Le style paper-craft (aplats + dot-eyes + outlines) PERMET de representer des scenes violentes ou graphiques (sang, corps, mort, douleur) parce que l'abstraction formelle cree la distance emotionnelle. Ne pas sur-censurer par defaut : notre style est plus proche de Persepolis / Waltz with Bashir / Grave of the Fireflies que de la photo-horror.

**Why** : Constate sur Sonjata (combat Kirina evite l'impact, seulement start/end) et Thiaroye V5 (fusillade narree mais pas montree visuellement) qu'on evitait le graphique par reflexe alors que notre style l'autorise. References externes qui valident : Black Market Surgeon (POV YouTube, stickman + sang aplat, 4M vues), animations chretiennes AI (Passion du Christ flagellation stylisee, 917k vues) — stylisation + graphique = combinaison narrativement puissante, pas voyeurisme. Plus le style est abstrait, plus on peut aller loin sans basculer exploitation.

**How to apply** :
- Sang : aplat rouge simple, pas gradient photorealiste
- Corps tombe : silhouette paper-craft, posture statique digne, pas contorsion exageree
- Mort : preferer SYNECDOQUE (photo au sol, main qui lache un objet, flaque qui s'etend, mouchoir blanc qui tombe dans flaque) a plan frontal du corps quand possible
- Emotion intense : larmes stylisees OK (petites gouttes paper-craft) — nuance R-PC3 qui etait trop restrictive. Tester au prompt avant regression. Si Gemini produit des larmes comiques cartoon, revenir a posture seulement.
- Violence d'action : montrer l'impact (pas juste start/end). Le coup qui touche, la tete qui bascule, le choc visuel avec sang aplat.
- Scenes de guerre/massacre historique : plan-tableau post-evenement acceptable (silhouettes a terre, ciel plombe, nuage de poussiere) — plus fort narrativement que cut noir + narration
- LIMITE : eviter l'exploitation gratuite (mutilation detaillee, detresse prolongee d'enfant, torture montree). La mesure : "est-ce que ca sert le recit historique/narratif ou juste le choc ?"
- LIMITE modele : Seedance/Gemini peuvent moderer certains prompts explicites. Strategie : neutraliser le vocabulaire du prompt (ne pas ecrire "blood", ecrire "red pool spreading"), laisser le rendu visuel faire le travail.

**Applications concretes a reconsiderer** :
- Thiaroye V5 Short 95s : la scene fusillade pourrait avoir un plan-tableau post-tirs (silhouettes au sol, ciel plombe), pas juste narration + cut noir
- Sonjata combat Kirina (deja rendu, on ne touche plus) : retenir pour prochains combats — montrer l'impact, pas juste pre/post
- Brouillon "Le dernier train" acte 5 : plan-tableau fusillade Thiaroye + synecdoque (photo de la fille dans la boue) = beaucoup plus fort que cut noir
- Abou Bakari future : tempete en mer peut montrer navires qui chavirent + silhouettes qui tombent, pas juste bateaux a l'horizon

## Tests realises (8/8 succes i2v, 0/2 ref-to-video)

| Test | Duree | Resultat |
|------|-------|----------|
| Soumaoro village (calme) | 5s | Style parfait |
| Abou Bakari plage (marche) | 5s | Style parfait, mouvements naturels |
| Kirina combat (action) | 10s | Style maintenu, arc narratif complet |
| Matrone dialogue (confrontation) | 7s | Lip sync present, emotions transmises, style maintenu |

## Mouvements de camera valides (tests 2026-04-18 — barre de fer 9:16)

| Mouvement | Score | Notes |
|-----------|-------|-------|
| Camera STEADY | 10/10 | Prouve 5x, zero risque |
| Dolly in / Push in | 9/10 | Zoom continu propre, style stable |
| Orbite 180 | 9.5/10 | MEILLEUR resultat — effet pseudo-3D bonus, personnage coherent |
| Crane up | 5/10 | ECHEC — Seedance fait monter le personnage au lieu de la camera (R77) |

## Observations strategiques (Aziz 2026-04-18)

### Le paper-craft ne "sent" pas l'AI (R-PC5)
Aziz confirme : meme lui, tres critique, ne detecte pas l'AI. Raisons :
- Style imite un medium pre-AI (illustration livres/affiches)
- Texture papier masque les artefacts
- Imperfections = choix artistiques
- Ne correspond pas aux patterns Midjourney/DALL-E reconnaissables

### Coexistence deux styles
- Paper-craft = contenu frequent, volume, news geopolitique, Thiaroye
- BD flat Seedance = Shorts premium, pieces de prestige (Soundjata, Abou Bakari)
- Les deux styles ont leur place dans GeoAfrique

### Variante "mature" = a eviter (drift vers BD flat)
Tente avec palette sombre + proportions adultes → Gemini a produit du BD flat semi-realiste, pas du paper-craft. Le mot "mature/adult" dans le prompt pousse vers plus de detail. Pour un ton serieux, changer la PALETTE et la TEXTURE, pas l'anatomie des personnages.

### GPT Image 1.5 edition chirurgicale = fonctionne
- Correction orientation personnage : OK
- Suppression element en double : OK
- MAIS drift de style a chaque passe d'edition successive (v1→v2→v3 = de plus en plus detaille)
- Gemini avec style-ref = plus fiable pour maintenir le style paper-craft

## Tests restants

- [ ] POV camera (non teste — premiere personne, personnage regarde ses mains/environnement)
- [ ] Paper-craft enrichi sur clip 10s+ (confirmer que zero morphing tient en duree plus longue)
- [ ] Diversite de personnages dans palette froide (combine R-PC9 + R-PC10 — foule Thiaroye)

## Images generees session 2 (dans /tmp/flat-sepia-test/)

- `diversity-marketplace-v1.png` — Gemini, marche 12 personnages varies, style enrichi
- `thiaroye-camp-sombre-v1.png` — Gemini, palette froide gris-bleu/kaki, paper-craft pur
- `combat-start-frame.png` — Gemini, Soundjata vs Soumaoro pose neutre combat
- `combat-end-frame-v2.png` — Gemini chirurgical (derive du START), follow-through slash
- `combat-end-frame.png` — v1 REJETEE (Soundjata inconsistant, debris au sol)

## Videos Seedance session 2 (dans /tmp/flat-sepia-test/)

- `seedance-thiaroye-5s.mp4` — palette froide, style tenu, micro-details eau
- `seedance-diversity-marketplace-5s.mp4` — style enrichi, zero morphing
- `seedance-combat-ref2video-8s.mp4` — ECHEC ref-to-video (style drift + choregraphie ignoree)
- `seedance-combat-startend-8s.mp4` — SUCCES start/end frame, combat dynamique, style 100%
