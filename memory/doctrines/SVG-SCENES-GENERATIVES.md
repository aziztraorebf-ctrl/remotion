# ⭐ SVG-SCENES-GENERATIVES — doctrine R&D : générer des SCÈNES SVG complètes via LLM

> Prouvée par render (session R&D 2026-06-21). Étend la technique du coin-flip Sénégal
> (`SenegalCoinFaceA_SVG`) d'un OBJET-symbole à une SCÈNE COMPLÈTE (paysage, ville, carte d'état-major…).
> Source de vérité pour tout ce qui est "SVG vectoriel généré par LLM puis animé par code".
> Le verdict jetons (jetons hexa) reste dans [[key-learnings]] + [[CARTO-OVERLAYS-PRINCIPES]] — NE PAS dupliquer.

---

## ✅ ACQUIS PROUVÉ : une SCÈNE entière gravée marche (pas que des objets)

La technique : **un LLM dessine une scène détaillée, DÉCOUPÉE EN GROUPES NOMMÉS** (`<g id="...">`), **statique**
(zéro animation côté LLM) → **nous animons chaque groupe côté code Remotion** par une variable de frame `f`
(translate, rotate, opacity, mix de couleur, `stroke-dasharray`). Le LLM fournit la MATIÈRE ; nous la VIE.

Pourquoi ça marche : les LLM **ne savent pas animer** mais savent **composer une scène riche et la découper en
parties manipulables**. Registre "gravure dorée / médaille ciselée" (or patiné #e7bd78/#dca95e/#bf9442, traits
rouges #8a2a20, rehauts ivoire #f2ebd9) = facile à rendre PREMIUM (vs photo-réalisme impossible en SVG).

Script de génération : `scripts/tools/rnd-svg-scene-gen.py` — **REGISTRE découplé de la SCÈNE** (param interne
`SCENE_REGISTRE`). Registres : `medaille` (gravure dorée), `blueprint` (technique bleu). Scènes : `ville`,
`etatmajor`, `plateforme-offshore`. Ajouter registres/scènes au fil de l'eau.
Harnais de rendu : `src/projects/_rnd/svg-scenes/` → `SvgSceneCoin.tsx` (enveloppe disque-pièce, registre médaille)
· `SvgScenePlanche.tsx` (planche rectangulaire fond bleu nuit, registre blueprint). Injection innerHTML.

---

## ⭐⭐ RÈGLE MAÎTRESSE — le choix du modèle DÉPEND de la scène (générer les 2, choisir)

Test ville + carte d'état-major, Gemini 3.1 Pro vs GPT-5.5, même prompt :

| Type de scène | Gagnant | Pourquoi |
|---|---|---|
| **Organique / profondeur / paysage** (ville, port, plans étagés, nature) | **GEMINI 3.1 Pro** | illustrateur : densité, profondeur réelle (plans), détails gravés (soleil rayonnant, cuves, treillis), meilleur découpage de groupes |
| **Géométrie / schéma / symbole** (carte d'état-major, diagramme, hachures réglées, flèches) | **GPT-5.5** | ingénieur : relief hachuré net, zones de contrôle lisibles, flèches tactiques à poids, rose des vents + cartouche propres |

**Conséquence opératoire** : pour une scène SVG, **TOUJOURS générer les 2 (Gemini + GPT-5.5) et choisir selon la
nature**. Cohérent avec le verdict transversal : Gemini gagne la GÉNÉRATION d'image, GPT gagne le BREAKDOWN/schéma.

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
| **`or-jour`** (illustration chaude LUMINEUSE) | ciel ambre clair #f2cf72/#ffd98a/#ffe8b8, nuages ivoire #f7eccf, terre ocre CLAIRE #c98a4a/#b8763a/#e0b878, or #f2cf72/#ffe39a, guerre rouge #d6552e discrète ; AUCUN bleu/gris/noir plat | scène chaude LUMINEUSE et premium (matin doré sur désert). Sort du « technique froid » et du « sombre dépressif » sans tomber dans le parchemin | (compo `HeroGptAnimee`) |

À TESTER (registres non encore sondés) : néon/data-terminal (data-viz moderne), papier découpé (pédagogique). (encre ✅ · braise-or ✅ · or-jour ✅ prouvés.)

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
< la version héros épurée (pelle + lingot + terre, 4 gestes limpides). Cobaye `HeroGptAnimee` « suivre l'or » Soudan.

### 2. ⭐ DOCTRINE DES 2 COUCHES (tient une scène 14–28s + règle des 5s) — À APPLIQUER À TOUTE SCÈNE
- **Couche de FOND permanente** (démarre f0, ne s'arrête JAMAIS) : drift Ken Burns lent + un élément qui respire (soleil
  qui pulse, nuages qui défilent, ondulation). La scène n'est jamais figée.
- **Couche d'ÉVÉNEMENTS échelonnés** (règle des 5s) : par-dessus, des gestes qui DÉMARRENT à des frames précises (un
  toutes les ~4-5s) et, une fois lancés, CONTINUENT. « On ne l'arrête plus » = vrai par geste ; mais ils ne démarrent
  PAS tous en même temps (sinon tout est dit à la 1re s, le reste est plat). L'entrée échelonnée = ce qui crée la règle
  des 5s et tient la durée. La scène SE CONSTRUIT jusqu'à un apogée. Prouvé sur 28s (mine) ET 14s (héros).

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
petit lingot, décalés). `spring > interpolate` (doctrine Remotion). Prouvé `HeroGptAnimee`.

### 5. ⭐ PILOTAGE COULEUR SÉMANTIQUE = notre signature (ce que Seedance ne fait pas sur commande)
La terre/le ciel qui VIRENT au ROUGE SANG sur le mot « la guerre » (overlay `<rect>` en `mixBlendMode:"multiply"`, opacité
montée par interpolate) = exactement l'océan qui noircissait dans la pièce Sénégal (`oilSpread`). La couleur dit le SENS,
timée sur la voix. Choisir la couleur PAR le sens : rouge sang = guerre/violence (PAS noir, qui dirait pétrole/pollution).

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
| ⭐⭐⭐ « Suivre l'or » Soudan HÉROS (16:9) | or-jour | GPT-5.5 | tomber-sec + bascule couleur + fade | https://files.catbox.moe/w7xndo.mp4 |

Code : `src/projects/_rnd/svg-scenes/{VilleGeminiAnimee, EtatMajorGptAnimee, OffshoreGeminiAnimee, OffshoreGeminiAnimeeSFX, DefenseGptAnimee, MineGeminiAnimee, HeroGptAnimee}.tsx`.

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
- flux continu (pétrole qui monte) → `warmap/tension-drone.mp3` (drone grave, volume bas 0.4, sous le reste)
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
