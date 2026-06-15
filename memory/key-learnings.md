# Key Learnings — Remotion / Souverain

Lecons transversales, patterns et anti-patterns valides au fil des sessions.

---

### 2026-06-15 — ⭐ HOOK : partir de NOS templates prouves, NE PAS transposer une grammaire externe sur notre carte 2D

Symptome : j'ai code un hook War-Map (acte 1) en suivant un DA-brief abstrait (gabarit "carte qui se transforme"
type Max Bellona) SANS d'abord verifier nos templates de hook DEJA PROUVES. Resultat rejete par Aziz : tremblement
de bord inexplique, drapeaux=requins, pins parasites, cold-start rate. Le prototype `SahelHookActe1` a ete supprime.

**Cause racine** : transposer une recette pensee pour une AUTRE grammaire (style 3D / autre chaine) sur notre
carte 2D flat top-down, au lieu de partir de CE QUI MARCHE CHEZ NOUS.

**LA REGLE** :
1. La regle "RECHERCHE TEMPLATES obligatoire AVANT de coder" s'applique AUSSI aux hooks (je l'avais sautee).
2. NOS hooks prouves = `KineticMaskSlam` + `ComboMaskSweep` ("carte a travers un chiffre", masque SVG + zoom-reveal).
   `src/projects/_shared/mapbox/`. Penses pour notre carte 2D, drift Mapbox continu, cinetique en overlay SVG.
3. Un DA-brief peut pousser une direction INADAPTEE a notre stack — le verifier contre nos templates AVANT de coder.
4. Chantier ouvert : SESSION DEDIEE HOOKS (`memory/SESSION-DEDIEE-HOOKS.md`) = bibliotheque de hooks reutilisables
   pour TOUTES nos videos (on est "a court de bons hooks", manque structurel — Aziz 2026-06-15).

---

### 2026-06-15 — ⭐ REGLE TRANSVERSALE (tous projets/episodes) : sur un bug VISUEL, EXTRAIRE les frames de la VRAIE video + INSTRUMENTER avant d'affirmer une cause

Symptome (Sahel P4 ressources, mais vaut PARTOUT) : Aziz voyait "la carte a travers le plein ecran". J'ai
affirme 2x "c'est regle / c'est la carte Mapbox masquee" SANS verifier la video reelle -> 4 tours perdus,
frustration. La vraie cause n'etait PAS le canvas Mapbox (bien masque) mais les CONTOURS NATIONAUX du moteur
(une couche React) rendus PAR-DESSUS l'overlay.

**LA REGLE (systematic-debugging applique au visuel) :**
1. **Ne JAMAIS affirmer "c'est regle" sans avoir extrait les frames de la VRAIE video rendue** (`ffmpeg -i
   video.mp4 -vf "select='eq(n\,N)'" frame.png`) et les avoir REGARDEES. Un still re-rendu peut differer ; c'est
   la video que l'utilisateur voit qui compte.
2. **INSTRUMENTER pour prouver la cause** (ex : fond rouge/vert/bleu vif opaque par zone -> revele ce qui est
   clippe vs ce qui deborde ; un div debug ; isoler une couche). Prouver AVANT de fixer.
3. **Test de controle** : reproduire le bug sur une frame AVANT la zone suspecte (ex : une frame deja validee
   casse aussi ? -> c'est l'environnement/une couche commune, pas mon nouveau code).
4. Des le 2e fix qui echoue sur le MEME symptome : STOP, lancer `superpowers:systematic-debugging`, instrumenter.
   Ne JAMAIS dire "c'est le cache/l'environnement/la map" sans preuve.

Corollaire moteur War-Map (mais le principe est general) : une couche rendue APRES un overlay dans l'arbre passe
AU-DESSUS. "On voit X a travers" = X est rendu apres/au-dessus, pas une transparence. Chercher l'ordre de montage.

---

### 2026-06-08 — Beats codes pour compo GLOBALE vs rendus STANDALONE : 3 pieges qui donnent ecran noir + queue morte + musique coupee

Symptome (Peste 1347, assemblage) : 8-24s d'ecran noir au debut de Beat2/Beat3, puis queue figee de meme duree en fin, et musique qui "coupe et reprend" entre beats. Cause = les beats ecrits pour vivre dans UNE compo globale (ou `frame` = position dans l'audio complet) mais rendus en compositions STANDALONE (frame part de 0). Trois bugs distincts a corriger ENSEMBLE :

1. **`localF = frame - beatStart`** -> standalone, `localF` negatif pendant `beatStart` frames = tout invisible. **Fix : `localF = frame`** (les pivots sont deja relatifs `PIVOT - beatStart`, ils s'alignent). Audio idem : `startFrom={beatStart} trimAfter={beatStart+beatDur}`, virer les `<Sequence from={beatStart}>` qui retardent la voix.
2. **`durationInFrames` = valeur ABSOLUE de fin** (ex 691 = SETUP_END absolu) au lieu de la DUREE (449 = END-START) -> queue morte = `dureeAbsolue - dureeReelle` frames figees. **Fix : durationInFrames = beatEnd - beatStart.**
3. **Musique par beat** (1 balise `<Audio music>` dans chaque beat, redemarre a 0 + Beat4 utilisait un AUTRE morceau) -> coupure audible a chaque jonction. **Fix : retirer la musique des beats, la poser en 1 SEULE piste continue au concat ffmpeg final** (`amix` voix+SFX avec 1 morceau, fade in 1.5s + fade out 4s, vol ~0.06). Verifier le niveau a chaque jonction (`ffmpeg -ss T -t 0.5 -af volumedetect`) = doit rester constant ~-15dB.

Verif anti-figé apres assemblage : echantillonner 1 frame/2s, comparer le md5 (frame identique a t-2 = figee) + taille <15KB = noir.

### 2026-06-08 — Sous-titres : ffmpeg local SANS libass -> overlay couche Remotion ProRes alpha

Le ffmpeg brew local (8.0.1) est compile SANS libass : les filtres `subtitles` et `ass` n'existent pas
(`ffmpeg -filters | grep -i subtitle` = vide), impossible de burn un SRT directement. **Contournement valide :**
1. Forced-alignment ElevenLabs (`POST /v1/forced-alignment`, file+text, header `xi-api-key`) -> JSON mots.
   ATTENTION : passer le texte DE-ACCENTUE (comme le TTS d'origine) sinon mismatch ; ré-accentuer ensuite pour l'affichage.
2. Generer un SRT (grouper mots par ponctuation forte + max ~42 char = sous-titres lisibles, pas karaoke).
3. Composant Remotion `<Subtitles>` (fond transparent, lit les cues, style maison) -> rendre en ProRes 4444 alpha :
   `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png` (PNG OBLIGATOIRE pour alpha).
   `--public-dir=/tmp/empty-public` si la couche n'a pas d'assets (evite la copie 1.3GB qui bloque le render).
4. Overlay sur la video : `ffmpeg -i video.mp4 -i subs.mov -filter_complex "[0:v][1:v]overlay=0:0:shortest=1[v]" -map "[v]" -map 0:a`.
Le filtre `overlay` LUI est dispo sans libass. Bonus : style sous-titres 100% controle Remotion (coherent charte).

### 2026-06-08 — Stroke = couleur du fill -> frontieres invisibles (zones colorees pleines)

Colorer un pays `fill={MALI_GOLD} stroke={MALI_GOLD}` (meme couleur) = les frontieres disparaissent dans l'aplat. Aziz : "on voit juste de l'or, pas les frontieres". **Fix : stroke contraste** (ocre sombre `#7a4e10` sur or) + baisser le fillOpacity (~0.8) + monter strokeWidth (0.9) et strokeOpacity (0.9). Vaut pour toute zone coloree pleine ou la geo doit rester lisible.

### 2026-06-08 — Remotion `<Audio>` : `trimAfter` est ABSOLU (depuis le debut du media), pas relatif a `startFrom`

**Bug couteux (Beat5 Peste, v13/14/15)** : la voix etait ABSENTE de 3 renders sans qu'on le remarque (la musique masquait). Cause :
```tsx
<Audio src=... startFrom={2323} trimAfter={651} />  // BUG : joue de 2323 a 651 = intervalle VIDE = silence
```
`startFrom` (alias `trimBefore`) ET `trimAfter` sont TOUS DEUX en frames depuis le DEBUT du fichier (doc Remotion confirmee via Context7). `trimAfter={651}` < `startFrom={2323}` -> rien.
**Fix** : `trimAfter = startFrom + dureeVoulue`, ex `trimAfter={2323 + BEAT_DUR}`.
**Regle de verif audio (NON-NEGOTIABLE avant "audio OK")** : mesurer le niveau REEL dans le render, jamais se fier au code.
`ffmpeg -i render.mp4 -vn out.wav` puis `ffmpeg -ss T -t D -i out.wav -af volumedetect -f null -` -> mean_volume.
Voix presente ~ -15 a -20 dB ; quasi-silence <= -32 dB. Si Aziz dit "je n'entends pas la voix", LE CROIRE et instrumenter.

### 2026-06-08 — Pays a territoires d'outre-mer : colorier l'ISO entier rougit des taches "en pleine mer"

Colorier `ISO_PLAGUE` (FRA, NOR, NLD, PRT, SWE...) remplit AUSSI leurs territoires lointains : FRA->Guyane (Amerique du Sud),
NOR->Svalbard (Arctique), NLD->Caraibes, PRT->Acores. Au pull-back / vue large -> taches de couleur isolees en plein ocean.
**Fix** : `<clipPath>` rectangulaire sur la zone continentale visee, applique au `<g>` qui rend les pays.
Pour l'Europe (carte peste mercLarge 720x1280) : `<rect x={118} y={236} width={470} height={328} />`. Le rect est en coords
SVG carte ; sur un `<g transform=camera>`, le clip s'applique dans l'espace local (apres transform) = coords carte = correct,
clip stable a tout zoom. Meme nature que le bug `mainlandBox` des drapeaux (`useClipFlags`).

---

### 2026-06-05 — Musique 1 morceau -> plusieurs durees video (fenetre + fade)

Une video evolue en duree pendant l'iteration. Pour une musique qui colle a chaque duree SANS coupure : generer 1 SEUL morceau Minimax (brut ~146s, le garder), puis decouper une fenetre par duree + fondu de sortie (`ffmpeg -t N -af afade=out`). MEME morceau partout = zero raccord, le fade masque la coupure (l'oreille entend une conclusion). JAMAIS assembler plusieurs morceaux ni regenerer. Recette complete : `memory/tools/minimax.md` section "musique 1 morceau -> plusieurs durees".

---

### 2026-05-13 — Règle 6 — GEMINI DIFF VISUEL OBLIGATOIRE APRÈS PREMIER RENDER (NON-NEGOTIABLE)

**Règle :** Après chaque premier render d'un nouveau composant, TOUJOURS envoyer le render + le mockup original à Gemini 3.1 Pro (`gemini-3.1-pro-preview`) pour analyse diff avant toute itération manuelle.

**Pourquoi :** Itérer à l'aveugle sur 3 composants = 9+ passes. Gemini diff en une passe = corrections exactes en une passe. Fidélité mockup passée de ~60% à ~90% en un seul pass.

**Protocole exact :**
1. Render first v1 (50% chance d'écart notable)
2. Envoyer au LLM : render PNG + mockup PNG + prompt `"Liste les 5 différences visuelles majeures entre le mockup et le render. Pour chaque différence, donne la correction CSS/React exacte (valeur en px, couleur hex, propriété Tailwind)."`
3. Appliquer TOUTES les corrections en une passe
4. Render v2 = version finale (ne pas rendre une v3 sauf retour Aziz)
5. NE JAMAIS présenter un v1 à Aziz sans avoir fait le diff LLM d'abord

**Modèle à utiliser :** `gemini-3.1-pro-preview` (analyse vision/diff précis — modèle VERROUILLÉ par CLAUDE.md, voir tableau modèles API). Les anciens modèles Gemini 2.x sont INTERDITS. Flash uniquement pour brainstorm, jamais pour diff visuel précis.

**S'applique à :** tout nouveau composant Remotion, tout nouveau template, tout beat avec layout custom.

---

### 2026-05-13 — Brief agents : 3 règles supplémentaires (background, proportions, dimensions)

**Problème observé :** FillScreen, OdometerFlip, RadarPing codés par agents — 3 écarts systématiques vs mockups Gemini malgré la règle visualWeight déjà en place.

**Règle 3 — BACKGROUND (NON-NEGOTIABLE) :**
- Famille reveal-mécanique : fond par défaut = `#080d14` ou plus sombre (`#060a10`)
- JAMAIS `bg-navy` (#141c2e) sans instruction explicite — les agents defaultent dessus
- Si le mockup Gemini montre quasi-noir = utiliser `backgroundColor: "#060a10"` inline
- Astuce brief : écrire explicitement `"background": "#060a10 — PAS bg-navy"` dans le JSON

**Règle 4 — PROPORTIONS LABELS (NON-NEGOTIABLE) :**
- Labels textuels (titre haut, sous-titre bas) dans les composants reveal-mécanique = fontSize MAX 32px, opacity 0.6-0.7, tracking large
- Ils sont DÉCORATIFS — l'élément central prend toute la place
- Si un label occupe >15% de l'espace écran = trop grand
- Astuce brief : écrire `"labels": "DÉCORATIFS — fontSize 28-32px max, opacity 0.65"` dans le JSON

**Règle 5 — DIMENSIONS EXPLICITES EN PX (NON-NEGOTIABLE) :**
- Tout élément central doit avoir ses dimensions écrites en px dans le brief, non-réductibles
- Exemples validés : OdometerFlip CASE_WIDTH=240, CASE_HEIGHT=300, fontSize=220, nbCases=4

---

### 2026-06-02 — Workflow Beat Mapbox avec templates catalogue

**Leçon :** Partir d'un template catalogue existant (SweepRevealTerritory) au lieu de coder custom donne un résultat satisfaisant dès le premier render — au lieu de 5-8 itérations habituelles.

**Ce qui a changé :**
- Page blanche + choix template AVANT de coder (storyboard 7 champs Playbook)
- MAROC_WORDS (tous les mots) au lieu de WORD_ANCHORS (anchors seulement) pour le karaoké
- showHatching prop ajoutée à SweepRevealTerritory — hachures ivory visibles sur gold
- SFX volumes : cinématique 0.50-0.55 (pas 0.35), musique 0.12 (pas 0.07)

**Workflow amélioré identifié par Aziz :**
1. Render → auto-review Claude → appliquer premiums évidents AVANT Gemini
2. Envoyer à Gemini avec les premiums déjà intégrés → score de départ plus haut → feedback plus incisif
3. Objectif : atteindre 8/10 avant validation au lieu de 7/10

**Anti-pattern confirmé :** Ne jamais continuer sur du code existant non-template — archiver et repartir à zéro avec la bonne architecture.
- FillScreen centralValue fontSize=280px minimum
- Écrire dans le brief : `"dimensionsNonReductibles": { "caseWidth": 240, "caseHeight": 300, "fontSize": 220, "nbCases": 4 }` — l'agent ne peut pas descendre en dessous

### 2026-05-13 — Brief agents : visualWeight obligatoire + placeholders realistes

**Probleme observe :** Les agents de codage respectent les valeurs numeriques du breakdown JSON (ex: fontSize:130) mais pas l'intention visuelle du mockup. Resultat : CountdownReveal avec chiffre trop petit (320px au lieu de 380px+), PortraitGeometry avec typo 2x trop petite.

**Regle 1 — visualWeight dans le brief :**
Tout brief d'agent doit inclure une section `"visualWeight"` pour les elements dominants :
- Ex: `"visualWeight": "le chiffre doit remplir 60-70% du diametre du cercle"`
- Ex: `"visualWeight": "countryName doit etre aussi large que le cercle au-dessus"`

**Regle 2 — Placeholder realiste obligatoire :**
Quand un composant accepte une image externe (portrait, photo archive, carte), toujours generer un placeholder realiste Gemini Flash AVANT le render de validation — jamais un PNG 1px.
- PNG 1px = rendu injugeable (fond vert ou gris uni)
- Placeholder Gemini = peut juger le rendu final immediatement
- Exception acceptable : composants purement CSS/SVG sans image externe

## 2026-06-09 — War-Map : sprite invisible = problème de CONTRASTE, pas de rendu (Sahel Acte 2)
**Symptôme** : insigne base militaire (sprite Gemini) invisible sur la carte, alors qu'un `<div>` opaque aux mêmes coords s'affichait. 4 "fixes" de rendu tentés en vain (Img/img/SVG, viewBox, delayRender).
**Vraie cause** : le sprite détouré n'occupait que 3.6% de surface opaque, couleur moyenne sépia clair [139,116,81] sur fond parchemin clair [245,239,214] → quasi invisible. PAS un bug technique.
**Leçon** : appliquer la règle "matière finale d'abord" AUSSI au debug visuel — composer le sprite sur le FOND RÉEL (`PIL alpha_composite` sur la couleur de la carte) AVANT de chercher un bug de rendu. Un insigne fin/clair sur fond clair a besoin d'un support (pastille/cartouche foncée) ou d'un détourage dense (encre noire franche).
**Acquis collatéraux réels (gardés)** : (1) `ConvergingFlows` viewBox était hardcodé 1080×1920 → props width/height ajoutées. (2) Pattern `delayRender` PAR FRAME + `map.once("idle")` requis pour charger sprites en headless (extrait dans `SahelMapBase`). (3) Extraction plomberie Mapbox → `SahelMapBase.tsx` (hook `useSahelMap`) réutilisable Actes 2-5 + Peste.

## 2026-06-09 — DeepSeek V4 testé comme 3e voix DA (vs Gemini/Kimi) — bon conceptuel, aveugle visuel
**Contexte** : test curiosité Aziz. DeepSeek V4 Pro (sorti 24 avril 2026, après cutoff). OpenRouter
`deepseek/deepseek-v4-pro` (~$0.44/M in, $0.87/M out = ~10-20x moins cher qu'Opus). 1.6T MoE, contexte 1M.
**Frein confirmé** : PAS de vision/multimodal au lancement (en dev). Nos briefs DA reposent sur des frames.
**Walkaround validé** : remplacer les images par une DESCRIPTION TEXTUELLE fidèle (Claude a vu les frames).
Script : `scripts/tools/deepseek-b1-test.py`.
**Verdict** (2 briefs B1 War-Map, comparés à gemini+kimi qui avaient les images) :
- CONCEPTUEL (séquencier, logique narrative, structure) = 80-90% de la valeur Gemini/Kimi. A même apporté
  une idée neuve (chaîne uranium Arlit→port Cotonou→cargo, que ni Gemini ni Kimi n'avaient).
- Review downstream : confirme + ajoute des points justes (incohérence temporelle timeline vs années 60,
  confusion d'échelles).
- LIMITE : sans vision, il DÉRIVE parfois du réel (a inventé une narration légèrement différente). Aucun
  jugement visuel pixel-précis (AI-slop, couleurs, compo) possible.
**Usage recommandé** : 3e voix CONCEPTUELLE pas chère (idées séquencier/structure/logique narrative).
PAS en remplacement de Gemini/Kimi pour le JUGEMENT VISUEL (là ils restent indispensables jusqu'au
multimodal DeepSeek). Toujours lui fournir une description fidèle des frames sinon il confabule.
Réponses test : `memory/episodes/warmap-sahel/reviews-acte2/deepseek-b1-{downstream,sprites}.md`.

## 2026-06-09 — Le vrai coupable de B1 raté : du CODE LEGACY qui tournait en parallèle (Sahel)
Pendant la refonte de B1 V2, j'ai d'abord blâmé mon nouveau code (sprites invisibles, carte dense)
et j'ai bricolé 3 fois (board clearing 0.55→0.25→0.12, agrandir sprites) sans résultat. **La cause
racine était ailleurs** : le mode `acte2` ré-utilisait des blocs Acte 2-5 LEGACY (`TerritorialExpansion`
JNIM rouge f2630→4800, `SahelAttackArrow` armes Libye, FAMa/AfricaCorps/contre-offensive) qui tournaient
EN MÊME TEMPS que mon B1 V2 et noyaient tout. Gatés par `showChrome && frame>=...` SANS exclure `acte2`.
**Fix** : gater tout le legacy par `!acte2`. La carte est devenue propre instantanément.
**Leçon (systematic-debugging) :** quand un symptôme visuel résiste à 2 ajustements, ARRÊTER de régler
les valeurs et INSTRUMENTER : `grep` TOUT ce qui peut dessiner le bruit (ici : que dessine du rouge JNIM
à cette frame ?) AVANT de re-toucher mes valeurs. Le bruit ne venait pas de ce que je réglais. Vaut pour
tout moteur RICHE réutilisé sur plusieurs modes : un nouveau mode hérite de TOUT l'ancien rendu sauf si
explicitement gaté. Toujours auditer les `frame>=X` non bornés par le mode courant.
**Aussi appris** : fill-opacity Mapbox via expression `coalesce(get igniteOp)` → un `setPaintProperty`
numérique est IGNORÉ (conflit). Atténuer la PROPRIÉTÉ source (`igniteOp` par feature), pas la couche.
Render B1 V2 (board clearing + avion whip + convoi uranium + emprises dessinées) : litter.catbox.moe/wwf5di.mp4

## 2026-06-10 — War-Map Sahel : structure linéaire + fact-check systématique avant audio lock

**1. Chronologie LINÉAIRE > flashback pour la lisibilité (show-don't-tell).**
Un récit qui montre l'aboutissement (Acte 1 : factions installées ~2022) PUIS revient en arrière (Acte 2 :
"tout commence en 2012") désoriente — et fait littéralement RECULER une timeline à l'écran (bug repéré par
Aziz). Parade : poser le contexte AVANT la rupture, chrono qui n'inverse jamais. Le bon découpage narratif a
réglé un bug technique de prod. Vaut pour tout War-Map/doc analytique. Doctrine : WARMAP-LONG + DA-BRIEF-GATE.

**2. Fact-check Sonar Pro SYSTÉMATIQUE avant audio lock — dès qu'on trouve 1 erreur, présumer qu'il y en a d'autres.**
Sur le script Sahel : 1 erreur (attaque "coordonnée sur Bamako 25 avril 2026" non confirmée par RFI/Le Monde/ONU,
alors que Wikipédia FR l'affirmait → conflit de sources, suivre les sources presse/ONU), 5 imprécisions (chiffres
en fourchettes, Kidal/MINUSMA formulation neutre, "1650 hommes" non documenté, CEDEAO effectif 2025), et 1 MANQUE
majeur (confédération AES + force conjointe 2024). Outil : `perplexity/sonar-pro` via OpenRouter (web temps réel
+ citations). Grouper TOUS les faits du script en 1 appel. Persister la sortie hors /tmp.

**3. Réponses de modèles (DA, fact-check) = PERSISTER hors /tmp immédiatement** (purge au reboot). Copier dans
`memory/episodes/<ep>/reviews-*/`. Vu : 6 réponses DA failli rester dans /tmp volatile.

---

## SCANNER LE CATALOGUE CARTE-VIVANTE AVANT DE CODER UN BEAT WAR-MAP (2026-06-11)

**Erreur commise** : codé toute la Partie 2 Sahel en SVG plat (cercles/étoiles/X) → Aziz : "mort, plat, niveau 1,
pédagogique, pas premium". Gemini (analyse vidéo) confirme 4/10. CAUSE : j'ai sauté la RÈGLE RECHERCHE TEMPLATES
(scanner `CATALOGUE-CARTE-VIVANTE.md` + `MAPBOX-COMPOSANTS.md` AVANT d'écrire une ligne). On avait 30+ composants
premium NON utilisés (LottieGeoAura, ContagionFlagSpread, PulsingRegionFill, sprites base-france, pitch 3D...).

**Règle (déjà dans CLAUDE.md, à RESPECTER)** : AVANT de coder TOUT beat carto, scanner les catalogues + présenter
à Aziz les templates pertinents. Une carte War-Map ne doit JAMAIS être : cercles SVG plats, marqueurs statiques
sans pulse, caméra plan large avec du vide autour. Premium = sprites à ombre (pas cercles), Lottie géo-ancrés,
front mouvant (path morphé / track-matte, pas scale de cercle), caméra serrée qui suit l'action + drift permanent,
pitch 3D optionnel, séquentiel synchro voix. Réf complète : `episodes/warmap-sahel/REFONTE-PREMIUM-P2-techniques.md`.

**Méta-leçon** : "sobre/analytique" n'est PAS une excuse pour "plat/pauvre". Premium d'abord (doctrine Aziz).
Quand Aziz dit "rends vivant", ce n'est pas optionnel — c'est le standard minimal.

---

## GRAMMAIRE CAUSALE + AUDIO-FIRST : LE STANDARD WAR-MAP (2026-06-12, leçon MAJEURE transversale)

**Suite directe de la leçon précédente.** Après avoir rendu la P2 Sahel "premium" (jolie), Aziz l'a quand même
trouvée CONFUSE : "c'est beau mais je ne comprends pas pourquoi une tache rouge apparaît, pourquoi les bases
brûlent sans attaquant". Le polish ne suffit pas — il manquait le SENS.

**LA CAUSE RACINE** : j'avais codé des ÉTATS qui apparaissent (zone rouge qui pop, base qui s'efface) au lieu
d'ACTIONS CAUSALES (A fait X → donc Y). Et j'avais pris les triggers (frames) de l'alignment SANS écouter
l'audio pour me demander "que doit montrer cette phrase ?". Synchronisé techniquement, vide narrativement.

**CE QUI A DÉBLOQUÉ (4 itérations + DA-brief)** :
1. **PARTIR DE L'AUDIO, phrase par phrase** → pour chaque phrase, "que doit COMPRENDRE un œil neuf ?".
   C'est l'audio-lock de la doctrine, mais appliqué au SENS visuel, pas juste au timing. Outil : un PLAN
   NARRATIF texte (PLAN-NARRATIF-P2.md) validé Aziz AVANT de coder.
2. **CAUSE AVANT EFFET** : les jetons jihadistes AVANCENT (waypoints) → leur SILLAGE colore le territoire →
   les bases tombent là où ils arrivent. La zone rouge NAÎT de l'action, elle ne pop jamais.
3. **COMBINER L'ARSENAL** (jamais 1 seul asset) : jetons (acteurs) + zones (conséquence) + sprites Gemini
   (lieux) + PixelLab (effets) + timeline (temps) + contours flash + plaques. L'ensemble crée le sens.
   Test d'Aziz : "on n'utilise pas à 100% ce qu'on a — c'est l'ensemble qui rend puissant."
4. **DA-brief upstream sur le PLAN** (pas juste sur le render) : Gemini+Kimi ont validé la grammaire causale
   et ajouté 3 gestes clés (sillage progressif par mask, Niger=junte institutionnelle ≠ rouge jihadiste,
   chute en 3 temps). Signal jamais juge : j'ai filtré leurs hallucinations (ils voulaient retirer nos sprites
   validés en croyant à du Freepik 3D sur frames floues).

**TEST DE LISIBILITÉ FINAL (Kimi, à réutiliser)** : "coupe le son. Si tu comprends 'des gens avancent,
assiègent des forts, le territoire devient rouge' → gagné. Si tu vois juste des taches apparaître → AI-slop narratif."

**ERREURS SPÉCIFIQUES À NE PAS REFAIRE** :
- Afficher un sprite-PORTRAIT nu (fighter-jnim = buste de face) sur une carte top-down = incohérent.
  Le JETON = cercle parchemin + bordure faction + portrait CLIPPÉ dedans (modèle Acte 1, helper chip()).
- Pont Gemini→PixelLab RATE sur effets DIFFUS (poussière = boule pleine). Marche sur denses (explosion/fumée).
- Données qui se MONTRENT, jamais qui s'écrivent : le "40% du Burkina" = le CONTOUR DU PAYS QUI SE REMPLIT
  de rouge, PAS un overlay chiffré hors-centre qui répète la voix.
- Forme abstraite (losange/étoile) = cheap sur une carte riche. Tout marqueur = jeton/sprite à notre identité.
- SFX seulement si SUPPORT VISUEL (retiré cedeao-snap : on ne voit pas la CEDEAO se fracturer).
- Un élément graphique enfermé dans un fragment JSX gaté peut disparaître même si sa propre condition est vraie
  (bug timeline P2 : enfermée dans le HUD gaté !partie2 → systematic-debugging + rect debug magenta pour prouver).

**MÉTA** : cette méthode (audio→plan narratif→DA-brief→arsenal causal→corrections itératives) est le STANDARD
War-Map désormais. Elle s'applique à P3/P4 et à toute war-map future. Elle rend non seulement premium mais
COMPRÉHENSIBLE — les deux sont indissociables. Réf : `episodes/warmap-sahel/PLAN-NARRATIF-P2.md`.

---

## 2026-06-14 — VALIDATION VISUELLE : mini-renders comparatifs + instrumenter avant deviner (War-Map)

> Session contours nationaux colorés Sahel P3. 2 leçons de PROCESS gravées par Aziz.

**1. Mini-renders VIDÉO comparatifs OBLIGATOIRES (pas des stills) pour juger un effet en mouvement.**
Quand on évalue un effet visuel dynamique (respiration d'opacité, draw-in, pulse, couleur qui apparaît),
Aziz a EXIGÉ 2x dans la session de voir le tout EN MOUVEMENT côte-à-côte (hstack ffmpeg gauche/droite),
jamais des images fixes. Les stills servent à MOI (analyse rapide pré-présentation) ; la décision d'Aziz
se prend sur la vidéo. Pattern : 2 fenêtres courtes (lecture→action + action→lecture) en scale 0.5 pour
itérer vite, montées côte-à-côte, uploadées catbox. La netteté finale se juge séparément en full HD (scale 1).
**Pourquoi** : un effet d'opacité/mouvement est INVISIBLE sur un still — présenter des stills fait tourner
en rond et fait douter du design à tort.

**2. INSTRUMENTER pour PROUVER, ne jamais deviner quand un effet n'apparaît pas.**
Quand Aziz dit "je ne vois absolument pas [l'effet]", le CROIRE et instrumenter AVANT de re-coder à l'aveugle.
Technique validée (déjà notée pour le bug timeline P2) : forcer la couche suspecte à une valeur ULTRA-VISIBLE
(magenta `#FF00FF`, largeur 8, opacité 1) et rendre 1 still. Si le magenta apparaît → la couche est peinte,
le problème est la subtilité (couleur/largeur/grain qui lave). Si rien → bug de données ou de z-order.
Cette session : a révélé DEUX bugs cachés — (a) `(src as any)._data` n'existe plus sur GeoJSONSource récent
→ le contrôle par région n'était JAMAIS mis à jour (restait ctrl=1) ; (b) le grain papier plein écran
(mixBlendMode overlay) LAVE les traits SVG fins → il faut rendre les contours AU-DESSUS du grain.
**Règle** : un effet "invisible" = bug à prouver (couche peinte ? données à jour ? z-order ?), pas un réglage
à tâtonner. Le debug magenta tranche en 1 render.

**Règle de design bonus (cas spécifique mais réutilisable)** : repère permanent (contours pays) + overlay
semi-transparent = JAMAIS cohabiter (bouillie illisible). Les repères s'EFFACENT pendant tout overlay
(fenêtres CONTOUR_HIDE_WINDOWS), reviennent après. Et : couleur via fond mosaïque OU via contours selon
le look de la partie, jamais les deux (sinon surcharge).

---

## DA-BRIEF : la causalité phrase-par-phrase + chaînes de réf + catalogue templates sont OBLIGATOIRES (2026-06-14, Aziz, War-Map P4)

**Erreur évitée** : mon 1er DA-brief P4 a VALIDÉ mon plan sans le confronter à ce qui nous fait vraiment
trébucher. Aziz a arrêté la session : "vous ne leur avez pas demandé comment rendre TOUTES les actions causales
— c'est ce qui nous a ralentis sur P2/P3. Et vous n'avez pas envoyé nos chaînes de réf (Kings & Generals, etc.)
ni la liste de nos templates pour qu'ils proposent des combinaisons."

**Les 3 manques d'un DA-brief faible (à NE JAMAIS reproduire) :**
1. **Causalité phrase-par-phrase JAMAIS mise à l'épreuve** : mentionner "cause avant effet" dans le socle ≠
   demander, POUR CHAQUE phrase : "risque d'état qui pop ? comment rendre la cause visible AVANT l'effet ?".
   C'est LA question structurante (celle qui a fait refaire P2 4×). La poser explicitement + joindre le test
   "coupe le son" + lister les phrases À RISQUE (en P4 : or/uranium qui poppent, fusion=morph PowerPoint,
   chiffre=donnée qui s'écrit, dézoom=mouvement sans acteur).
2. **Chaînes de référence absentes** : joindre le décodage du genre (Operations Room/mapsinanutshell/K&G/
   BazBattles) + notre différentiel → les LLM comparent au MODÈLE et proposent mieux ("ce qu'ils feraient
   mieux qu'on peut prendre sans trahir notre identité"). Sinon le brief est auto-référentiel.
3. **Catalogue de nos templates non envoyé** (`da-brief.py --catalog`) : sans la liste RÉELLE de nos briques
   (WarMapOverlayDynamic, SahelAttackArrow, TerritorialExpansion, GeoConvergenceOverlay, countryOutline, chip,
   sillage mask...) ils travaillent à l'aveugle et ne peuvent pas proposer de COMBINAISONS.

**Le 2e brief enrichi a payé** : il a remonté 3 risques causaux ÉLEVÉS/CRITIQUES que le 1er avait laissés
passer — Ph7 fusion (→ fils convergents+sceau tampon, pas morph), Ph3 chiffre (→ overlay ANCRÉ sur cluster),
Ph5-6 ressources (→ contour pulse→remplissage→icône émerge). + règle chromatique rouge≠or (anti-cynisme).

**RÈGLE GRAVÉE** : tout DA-brief upstream War-Map DOIT inclure (a) la question causale phrase-par-phrase avec
le test "coupe le son", (b) le décodage du genre/chaînes de réf, (c) `--catalog` avec nos templates réels.
Le brief P4 v2 (`/tmp/da-refs/brief-p4.txt` + `catalog-p4.txt`) = le MODÈLE à réutiliser. Vaut pour tout pilier.

---

## FACT-CHECK chiffres récents : Sonar Deep Research via OpenRouter + le piège "chiffre daté/trompeur" (2026-06-14, War-Map P4)

**Capacité (réutilisable)** : pour vérifier des chiffres À JOUR (2025-2026) avant de les afficher dans une vidéo,
appeler **Perplexity Sonar Deep Research via OpenRouter** : `OPENROUTER_API_KEY` (déjà dans .env) + endpoint
`https://openrouter.ai/api/v1/chat/completions` + modèle `perplexity/sonar-deep-research` (30-120s, ~$0.10-0.20,
sources incluses). Pattern de script : `/tmp/sonar-p4-ressources.py` (réf : anciens scripts archivés
`scripts/_archive/episodes-livres/perplexity-fact-check-*.py`). Workflow : WebSearch d'abord (rapide, gratuit) →
Sonar pour verrouiller/corriger les chiffres incertains. Aziz : "lance une recherche Perplexity Sonar Pro pour les
chiffres dont on est incertain, comme ça on n'a pas à refaire".

**LE PIÈGE (vérifié, important)** : un chiffre que CITE un modèle (Gemini/Kimi dans un DA-brief) peut être DATÉ ou
TROMPEUR. Ex P4 : Kimi proposait des camemberts "Niger ~5% production uranium mondiale" → fact-check : c'était 4,7%
en 2021 mais **1,6% en 2024** (Orano retiré, ~0 export après le coup). Afficher un % de PRODUCTION aurait CONTREDIT
le message "levier qui permet de tenir". → Solution : afficher les **RÉSERVES** (Niger = 6% des réserves mondiales =
le levier DURABLE), pas la production volatile. **RÈGLE : ne JAMAIS afficher un chiffre cité par un modèle sans
fact-check ; distinguer production (conjoncturel, volatil) vs réserves/rang/infrastructure (structurel, solide).**
