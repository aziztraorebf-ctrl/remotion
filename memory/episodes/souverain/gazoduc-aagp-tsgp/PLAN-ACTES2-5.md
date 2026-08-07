# Gazoduc AAGP/TSGP — PLAN Actes 2-5 — Synthèse tracée DA-brief upstream

> Lancé 2026-08-03, `da-brief.py --upstream` (1 appel unique couvrant les 4 actes, décision Aziz).
> 3 voix : Gemini 3.1 Pro + Kimi K2.5 + DeepSeek V4. Sorties brutes :
> `/tmp/da-refs/da-gazoduc-actes2-5-{gemini,kimi,deepseek}.md` (à rapatrier avant purge /tmp).
> Brief envoyé : script complet des 4 parties (texte narré exact) + boîte à outils (carte D3 plate,
> jetons-portraits méthode Soudan, objets iso, inserts schématiques) + 4 questions ouvertes.
> Storyboard macro amont : `STORYBOARD-MACRO-ACTES2-5.md` (à conserver comme trace de la 1re passe,
> ce PLAN le remplace comme référence de code).

## ⚠️ CORRECTION FACTUELLE AVANT TOUTE APPLICATION — palette du prototype réel

Les 3 voix ont **halluciné/inventé une palette** différente de celle qui existe réellement dans
`ProtoGazoducAfriqueComplete.tsx` (vérifié dans le code, pas supposé) :
- Kimi propose `Or #C9A227` / `Orange #E67E22` pour AAGP/TSGP — **FAUX**, n'existe pas dans le proto.
- DeepSeek propose `#D4AF37` doré / `#FF8C00` orange — **FAUX** également.
- **RÉEL (proto)** : `AAGP_COLOR = "#4fd3c4"` (teal, pas doré — "évoque l'océan longé"),
  `TSGP_COLOR = "#e8834a"` (orange, celui-là est proche), fond `BG_TOP #22345c`/`BG_BOT #182746`,
  terre `LAND #2c4066`, encre `LAND_STROKE #f0e8d2`, Nigeria (point source) `#f0c94a` doré.
- **DÉCISION** : le bleu-marine (`#182746`) et l'opacité rouge conflit (`#d6552e`, cohérent avec
  Acte 1) sont corrects dans les 3 sorties. MAIS le code doit reprendre la palette RÉELLE du proto
  (teal AAGP, pas doré) — ne pas appliquer aveuglément "or vs orange" proposé par les 3 voix. Écarté
  comme famille de faux positif (b) "erreur de perception" (DA-BRIEF-GATE.md) : elles décrivent une
  palette plausible mais pas la nôtre, faute d'avoir vu le fichier réel (elles n'avaient que la
  description texte du brief, pas le code).
- ⚠️ Si le doré est préféré esthétiquement à l'usage (les 3 voix convergent dessus, signal à ne pas
  ignorer totalement), c'est un changement de palette À DÉCIDER explicitement avant le code, pas un
  fait acquis du DA-brief.

---

## CONVERGENCE FORTE (3/3, haute confiance) — RETENU

- **G+K+D** : Bascule carte D3 plate confirmée comme direction stratégiquement correcte (le globe
  "vend le mythe", la carte "vend la précision"). ✅ Déjà la décision Aziz, confirmée par les 3 voix.
- **G+K+D** : Objets 2D isométriques sur carte plate en projection classique = **NON, incohérence
  de registre** ("dissonance cognitive", "effet sticker", "l'objet semble flotter"). Unanimité totale
  sur ce point précis. ✅ **RETENU — répond à la question ouverte n°1.**
  → Alternative unanime : icônes Lucide plates / badges circulaires (cohérent avec jetons-portraits
  déjà validés) / silhouettes 2D simples avec petite ombre portée pour l'ancrage. PAS d'isométrie.
- **G+K+D** : Jetons-portraits pour Mohammed VI/Buhari (genèse 2016) et pour la signature Freetown —
  confirmé comme registre adapté, cohérent avec la méthode Soudan déjà validée. ✅ **RETENU.**
- **G+K+D** : Zone de conflit Sahel/TSGP — même GeoJSON, même couleur `#d6552e`, opacité 0.15-0.3,
  reprojetée sur la carte plate. ✅ **RETENU**, paramètres à trancher au code (voir divergence ci-dessous
  sur hachures vs marching-ants vs opacité pure).
- **G+K+D** : Règle "un seul élément lumineux/focal à la fois", le reste atténué (opacité réduite) —
  parade commune au risque n°1 identifié par les 3 voix (surcharge de la carte plate, "soupe visuelle",
  "diaporama Wikipédia"). ✅ **RETENU comme règle de composition transversale à tout l'acte.**
- **G+K+D** : Pas de split-screen (déjà notre règle Acte 1), remplacé par alternance temporelle
  (fondu/cut rythmé) pour les comparaisons Maroc/Algérie. ✅ **RETENU.**
- **G+K+D** : Easing jamais linéaire, `spring()` sur apparitions, courbes personnalisées sur les
  tracés et mouvements caméra. ✅ **RETENU** (déjà notre règle transversale projet).
- **G+K** : Le chiffre "6900 km" doit apparaître en DÉCALAGE avec l'énoncé oral, pas en simultané —
  soit ancré à la fin du tracé (Gemini : "quand la ligne dorée touche le Maroc"), soit sur la phrase
  "pour finalement atteindre le Maroc" (Kimi/DeepSeek, quasi identique). ✅ **RETENU** — convergence
  sur le PRINCIPE (décalage voix/visuel pour éviter la redite), léger écart sur le timing exact
  (à trancher au code selon le rendu, différence de <1s entre les 3 propositions).

## DIVERGENCES — tranchées

1. **Moment fort de l'ensemble Actes 2-5 : lequel ?**
   - Gemini : Acte 4, "70% de la production siphonnée" (rupture géographie→physique pure).
   - Kimi/DeepSeek : Acte 3, "35 morts à Niamey" (choc émotionnel, bascule logique→réalité humaine).
   - **DÉCISION : retenir Niamey (K+D, 2/3) comme moment fort ÉMOTIONNEL**, et garder le 70% (G) comme
     un second temps fort mais de nature différente (rupture de FORME, pas d'émotion — sortie de la
     carte vers un insert pur). Les deux ne s'excluent pas : Niamey = pic dramatique humain (mi-parcours,
     Acte 3), 70% = pic de RYTHME/FORME (Acte 4, juste après). Un épisode a rarement un seul climax ;
     les 2 propositions décrivent des pics de nature différente, cohérent de les garder tous les deux.
     Le "vrai" climax reste Niamey (2 voix sur 3, et le sujet éditorial — vie humaine — pèse plus qu'un
     ratio économique).

2. **Placement "Maroc levier / Algérie monopole" (question ouverte n°2) : carte ou insert détaché ?**
   - Gemini : CARTE D3 (flèches d'influence, "la géopolitique c'est la géographie").
   - Kimi : INSERT SCHÉMATIQUE DÉTACHÉ (carte déjà saturée, "spaghetti visuel").
   - DeepSeek : CARTE D3 avec flèches, en DEUX TEMPS séquentiels (zoom Gibraltar puis zoom Méditerranée
     centrale, jamais les deux ensemble).
   - **DÉCISION : retenir carte D3 (G+D, 2/3)**, MAIS avec la méthode séquentielle de DeepSeek (un seul
     zoom/un seul pays mis en avant à la fois, jamais les 2 jeux de flèches simultanés) — ça répond
     directement à l'objection de Kimi (surcharge) sans sacrifier l'ancrage géographique. Synthèse des
     3 voix plutôt qu'un choix binaire : le risque identifié par Kimi est réel, la parade de DeepSeek
     le résout sans quitter la carte.

3. **Zone de conflit : hachures (Gemini) vs marching-ants pointillés animés (Kimi+DeepSeek) vs opacité
   pure sans texture ajoutée (aucune des 3, mais c'est notre pattern Acte 1 actuel).**
   - **DÉCISION : marching-ants (K+D, 2/3)** — convergence sur un signifiant de "menace active/vivante"
     plus fort qu'une simple zone teintée. Écarter les hachures de Gemini (option seule, pas de 2e voix,
     et "pattern SVG hachuré" a un risque de surcharge visuelle sur une carte déjà chargée — cohérent
     avec le risque n°1 identifié par tous). Vérifier au rendu que les marching-ants ne créent pas eux-
     mêmes un défaut "clignotement bug" (règle bruit déterministe du registre stick-figure, brique n°5,
     transposable : jamais une texture qui vibre de façon non organique).

4. **Compteur pays (13 pays AAGP) : vitesse.**
   - Gemini : décrit l'effet sans chiffrer.
   - DeepSeek : identifie explicitement un piège ("13 pays en 8 secondes = 0.6s/pays, trop rapide")
     et propose une accélération variable (premiers pays lents, derniers rapides).
   - **DÉCISION : RETENU (D)** — c'est la seule voix à avoir fait le calcul de vitesse et alerté sur un
     risque concret de lisibilité. Appliquer l'accélération variable, pas un rythme constant.

5. **Idée "morphing globe→carte plate" à la transition Acte1→Acte2 (Kimi option D, DeepSeek idée bonus 3).**
   - ⛔ **ÉCARTÉ DÉFINITIVEMENT (Aziz, 2026-08-03, après test des 2 agents template-matcher/innovateur)** :
     l'agent innovateur avait proposé une variante sans risque technique (rester en projection
     orthographique, zoomer jusqu'à courbure imperceptible — technique déjà validée sur
     `GlobeToParchemin16x9.tsx`). Décision Aziz : **même sans risque technique, le principe reste
     écarté** — le globe (Acte 1) et la carte D3 plate bleutée (Acte 2) sont deux REGISTRES VISUELS
     différents, pas une même carte qui se déplie. `GlobeToParchemin16x9.tsx` fonctionnait parce que
     les deux bouts (globe bleu → carte parchemin) appartenaient au même univers visuel (AES) — pas le
     cas ici. Forcer une continuité géométrique entre deux registres différents serait artificiel.
   - ✅ **RETENU : fondu enchaîné classique** (déjà dans la boîte à outils, zéro risque technique ET
     cohérent avec la nature de la rupture de registre voulue).

6. **Idée bonus "micro-rotation/pitch 3D sur la carte plate pendant les moments d'action" (Gemini, expert
   constructeur, point 1).**
   - ❌ **ÉCARTÉ** : contredit notre interdiction `forbid` transversale (pas de "vraie 3D"/transform
     perspective simulée) réaffirmée explicitement dans le brief envoyé. Gemini propose lui-même
     `transform: perspective(1000px) rotateX(10deg)` — exactement le type d'effet CSS 3D qu'on interdit.
     Auto-contradiction de la voix qui liste par ailleurs les interdits (famille (c) DA-BRIEF-GATE).

7. **Robinet géant + mains stylisées qui le saisissent (Kimi, Acte 5, "qui aura la main sur le robinet").**
   - 🔶 **OPTION, séduisante et fidèle au texte** ("la main sur le robinet" est une métaphore filée du
     texte lui-même) mais pas de 2e voix convergente et complexité d'exécution non triviale (mains
     stylisées animées = plus proche du registre personnage qu'on vient d'écarter pour ce chantier,
     cf décision de la session sur stick-figure). À juger au moment du code selon le temps disponible,
     pas à promettre d'office.

## PIÈGES AI-SLOP IDENTIFIÉS (parades à appliquer par défaut)

- Surcharge de la carte plate (13 pays + 2 tracés + icônes + texte simultanés) = risque n°1 identifié
  PAR LES 3 VOIX indépendamment — signal de très haute confiance. Parade commune : règle "un seul
  élément focal", stagger des apparitions (délai entre pays), masquer plutôt qu'accumuler.
- 13 drapeaux qui poppent d'un coup (G) → stagger géographique (Nigeria→Maroc), un seul actif à 1.0
  opacité, les autres à 0.4.
- Rouge "tache de sang" mal projeté (K) → clipper le cercle d'impact aux frontières administratives
  réelles (GeoJSON), pas un cercle libre flottant sur l'océan.
- Easing robotique sur les tracés (G+K+D, unanime) → spring/bezier, jamais linéaire, vitesse variable
  ralentit aux frontières/pays traversés.
- Typo générique/ombre portée CSS (G+K) → typo de charte, zéro drop-shadow CSS, badges avec bordure
  crème plutôt qu'ombre.
- Jetons-portraits en "stickers"/photo brute mal détourée (K+D) → même méthode Soudan (trait d'encre
  net, détouré), max 3-4 jetons par acte pour ne pas surcharger.

## RÉPONSES AUX 4 QUESTIONS OUVERTES DU BRIEF (tranchées)

1. **Objets isométriques sur carte plate** → NON (unanimité 3/3). Remplacer par icônes Lucide plates /
   badges circulaires avec petite ombre portée légère pour l'ancrage.
2. **Maroc/Algérie : carte ou insert** → Carte D3, méthode séquentielle DeepSeek (un jeu de flèches à
   la fois, jamais les 2 ensemble).
3. **Placement 6900km** → Décalé de l'énoncé oral, ancré visuellement à l'arrivée du tracé (Maroc) ou
   sur la phrase de conclusion du segment — trancher l'exact timing au moment du code sur le rendu réel.
4. **Zone conflit sur carte plate** → Même GeoJSON/couleur/opacité qu'Acte 1, + bordure marching-ants
   (pointillés animés) pour compenser l'absence de la texture "globe" qui portait seule la menace.

---

## GATE — TRANCHÉ PAR AZIZ (2026-08-03)

1. **Palette AAGP/TSGP → PASSE AU DORÉ** (proposition des 3 voix retenue, contredit la correction
   factuelle ci-dessus). AAGP = doré (cohérence avec le flux/tracé doré déjà utilisé Acte 1 sur le
   globe), TSGP = orange (inchangé, déjà proche entre proto et proposition DA-brief). ⚠️ Ceci est un
   CHANGEMENT du prototype existant (`ProtoGazoducAfriqueComplete.tsx` a `AAGP_COLOR = "#4fd3c4"`
   teal) — au moment du code, mettre à jour cette constante, ne pas la laisser diverger silencieusement
   entre proto et fichier de production. Valeur exacte à trancher au code (aligner sur l'or déjà défini
   Acte 1, pas réinventer un nouveau hex).
2. **Moment fort → LES DEUX gardés**, nature différente : Niamey (Acte 3, climax humain/émotionnel)
   ET le ratio 70% (Acte 4, pic de rupture de forme carte→insert). Aucun des deux ne doit être dilué
   au profit de l'autre — chacun mérite le soin décrit dans sa fiche PARTIE B respective (cf sorties
   brutes Gemini pour le 70%, Kimi/DeepSeek pour Niamey).
3. **Transition Acte1→Acte2 → TENTER LE MORPHING de projection D3 en premier** (orthographique→Mercator/
   Albers). ⚠️ Risque technique non résolu par le DA-brief (les modèles n'ont pas vérifié la faisabilité
   D3 réelle) — prototyper en ISOLATION (petit fichier de test, pas dans le fichier de prod directement)
   AVANT de l'intégrer au montage, et prévoir explicitement le repli fondu-enchaîné si le test échoue ou
   rend mal. Ne pas répéter l'erreur "occlusion pivot" Acte 1 (promesse DA-brief jamais vérifiée avant
   d'être écrite dans le breakdown, puis découverte cassée seulement au rendu réel).

## STATUT (2026-08-04) — Acte 2 CODÉ ET VALIDÉ (voir STATUS.md). Acte 3 : DA-brief upstream fait,
GATE EN ATTENTE D'ARBITRAGE AZIZ — voir section ci-dessous. NE PAS CODER avant tranchage.

---

# ACTE 3 (TSGP) — Synthèse tracée DA-brief upstream dédié (2026-08-04)

> Appel séparé de celui des Actes 2-5 ci-dessus (script Acte 3 verrouillé + timing frame-précis
> produits par le storyboarder APRÈS le DA-brief initial du 2026-08-03, donc plus précis).
> 3 voix : Gemini 3.1 Pro + Kimi K2.5 + DeepSeek V4. Sorties brutes :
> `/tmp/da-refs/da-gazoduc-acte3-{gemini,kimi,deepseek}.md` (à rapatrier avant purge /tmp).
> Brief : script Partie 3 exact + timing frame-précis (`GazoducActe3Timing.ts`) + 3 questions ciblées
> (essoufflement carte 74s/3pays, force dramatique climax Niamey, risque redite médaillons).
> Timing frame-précis produit par l'agent storyboarder : `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe3Timing.ts`
> (3 segments, zéro gap, contrôle indépendant passé — voir commentaires du fichier).

## CONVERGENCE FORTE (3/3) SUR LES 3 QUESTIONS CIBLÉES — RETENU

### Q1 — Segment A (74s de carte D3 pour seulement 3 pays, vs 20.5s/13 pays à l'Acte 2)
**G+K+D** : risque d'essoufflement CONFIRMÉ par les 3 voix (caméra continue à vitesse constante sur une
durée 3.6x plus longue avec 4x moins de géographie = "train touristique lent"/monotone).
✅ **RETENU** : fragmenter le travelling en **4 "stations" narratives avec micro-haltes caméra**, pas un
plan-séquence continu : (1) Nigeria origine commune avec AAGP, (2) frontière Niger, (3) traversée Sahara
accélérée (le vide EST le message — respiration, pas remplissage), (4) Adrar climax chantier. Puis à
1651f (≈55s, "DEUX FOIS MOINS CHER"), rupture nette avec la géographie : comparateur financier chiffré
(jauges/barres proportionnelles au coût, PAS de texte long) qui prend le premier plan, carte assombrie
en second plan. Le temps narratif est rempli par de la DONNÉE, jamais par de la fausse géographie
inventée (aucune des 3 voix ne propose d'ajouter des pays/étapes qui n'existent pas dans le tracé réel).
🔶 **NUANCÉ** (source K, condition) : synchroniser le rythme du `strokeDashoffset` du tracé avec les
arrêts caméra (ralentir le tracé quand la caméra s'arrête) plutôt que déconnecter les deux — à vérifier
au code que ça ne complique pas inutilement le mécanisme déjà prouvé de l'Acte 2.
🔶 **NUANCÉ** (source G, condition à activer seulement si le rythme le permet) : "ghost" du tracé AAGP
en filigrane (opacité 0.08-0.2) visible en permanence sur le Segment A pour rappeler la rivalité sans
qu'il faille le dire — idée jugée forte par G+K (convergent), mais 2 opacités différentes proposées
(0.08 Kimi / 0.2-0.3 Gemini) → trancher au code par test visuel rapide, pas deviner.

### Q2 — Segment B (climax "TRENTE-CINQ MORTS" — le "point qui s'éteint en rouge" jugé trop faible)
**G+K+D** : les 3 voix REJETTENT unanimement le geste initial ("sous-dimensionné", "effet notification
smartphone"). Convergence sur la FAMILLE de solution (impact géométrique abstrait, pas de figuration),
divergence sur le détail d'exécution :
- Gemini : onde de choc (3 cercles concentriques, `r` qui explose + opacité qui tombe) + camera shake.
- Kimi : cascade de 35 losanges identiques qui tombent et s'empilent (comptage visuel de la masse).
- DeepSeek : réticule qui explose en 20-30 éclats polygonaux + chiffre "35" qui se fragmente légèrement.
✅ **RETENU (synthèse des 3, pas un choix unique)** : combiner onde de choc (G, geste le plus simple et
déjà dans notre boîte à outils prouvée — cf `shakeX`/`shakeY` déjà codés ailleurs dans le projet,
`Scene1Hook.tsx`/`Beat12.tsx` Sénégal, PAS une nouveauté hors-stack) + chiffre "35" massif en climax
central (K+D convergent sur l'importance du CHIFFRE affiché, pas seulement l'onde). Le camera shake est
VALIDÉ contre nos contraintes réelles (technique déjà éprouvée dans `senegal-petrole-gaz*`, pas une
hallucination hors-stack de Gemini) — condition : amorti rapide (~10f), jamais un tremblement mou.
❌ **ÉCARTÉ** : cascade de 35 formes littérales qui tombent une par une (Kimi) — séduisant en théorie
mais introduit un risque de lecture "gadget/gamifié" (compter des losanges qui tombent pendant un
climax sur une attaque meurtrière) que ni Gemini ni DeepSeek ne proposent ; le chiffre "35" affiché en
grand suffit à porter l'ampleur sans le geste de chute littérale.

### Q3 — Segment C (risque de redite avec le dispositif "médaillons/cadenas" déjà vu ailleurs)
**G+K+D** : risque de redite CONFIRMÉ par les 3 voix si on garde 2 médaillons symétriques hors-sol.
Convergence sur le PRINCIPE (rester ancré à la géographie/aux tracés réels plutôt que 2 blocs abstraits
identiques), divergence sur le dispositif exact :
- Gemini : split-screen `clipPath` sur LA MÊME carte (AAGP éclairé à gauche, TSGP à droite).
- Kimi : dispositif "balance" (axe horizontal, ligne stable Maroc vs ligne brisée/tremblante Algérie).
- DeepSeek : deux rubans/tracés contextuels différenciés par icône (`Lock` Maroc vs `Zap` Algérie),
  balance centrale discrète en clôture.
✅ **RETENU** : le PRINCIPE d'ancrage géographique (pas de médaillons hors-sol) est non négociable — les
3 voix convergent là-dessus contre la direction initialement proposée par le storyboarder. Entre les 3
variantes, DeepSeek et Kimi convergent partiellement (icônes différenciées + idée de balance/déséquilibre
structurel plutôt qu'un simple split symétrique) — **point de goût à trancher par Aziz, pas par Claude**
(voir gate ci-dessous), les 3 variantes sont techniquement faisables à égalité.

## AUTRES IDÉES RETENUES (hors des 3 questions ciblées)

- **G+K+D** : transition Acte 2→Acte 3 par **fondu de tracés** (le dernier tracé AAGP doré de l'Acte 2
  mute visuellement en tracé TSGP qui bifurque vers l'intérieur des terres, point de jonction Nigeria)
  plutôt qu'un cut sec — convergence forte, coût faible, renforce la continuité narrative. ✅ RETENU.
- **G** (isolé mais fort) : couleur TSGP = **cyan `#00C4FF`**. ✅ **RETENU avec vérification factuelle
  ajoutée** — Kimi (`#D4A373` terre de sienne) et DeepSeek (`#E88D2A` orange saharien) proposent tous
  les deux une teinte chaude proche du doré AAGP (`#FFC742`) : **⛔ ERREUR selon une leçon DÉJÀ ÉCRITE
  dans le code de ce projet** (`GazoducActe1Hook.tsx` L42-43 : "orange #e8834a trop proche de flowGold
  — confusion à l'échelle continentale", fix déjà appliqué à l'Acte 1). Les 2 propositions chaudes sont
  donc **ÉCARTÉES** (répètent une erreur déjà corrigée ailleurs dans le même projet, cas classique de
  modèle qui n'a pas vu tout le code). Cyan est la seule proposition franchement distincte du doré.
- **K+D convergent** : grille de menace/hachures animées par `strokeDashoffset` pour la zone JNIM/EI
  (Segment B), jamais un aplat rouge/tache — cohérent avec la charte analyste déjà appliquée (DECODE
  CASTILE, pions réalistes rejetés). ✅ RETENU, déjà dans la boîte à outils du projet.
- **G isolé** : règle "un seul point d'attention par phrase" (hiérarchie du regard stricte quand le
  tracé ET les jauges financières sont visibles en même temps) — 🔶 NUANCÉ, principe de bon sens à
  appliquer au code, pas un geste à designer séparément.
- ❌ **ÉCARTÉ (les 3)** : aucune proposition de figuration humaine/violence — cohérent avec l'interdit
  du brief, rien à trancher ici, juste confirmation qu'aucune voix n'a transgressé la charte.

## POINTS DE GOÛT À TRANCHER PAR AZIZ (gate, avant code)

1. **Dispositif Segment C** — entre split-screen clipPath (carte unique scindée), balance/déséquilibre
   structurel (Maroc stable/Algérie tremblante), ou tracés différenciés par icône (Lock/Zap) + balance
   discrète en clôture. Les 3 sont faisables à égalité technique.
2. **Couleur TSGP** — cyan `#00C4FF` (seule proposition distincte du doré, mais jamais utilisée ailleurs
   dans le projet — à valider que ça s'intègre bien au reste de la charte Souverain) vs rester dans une
   teinte plus chaude malgré le risque de confusion identifié (à réduire alors par un autre moyen que la
   couleur : trait plus fin, pointillé vs plein, etc.).
3. **Intensité du climax Niamey** — onde de choc + camera shake + chiffre "35" (synthèse retenue
   ci-dessus) est-il jugé à la bonne intensité dramatique, ou trop sobre / trop appuyé pour la charte
   analyste du projet (jamais donné dans le sens sensationnaliste) ?

## GATE — TRANCHÉ PAR AZIZ (2026-08-04)

1. **Segment C → split-screen `clipPath` sur la carte unique** (Gemini). Reste ancré à la géographie
   réelle déjà tracée (AAGP doré éclairé à gauche, TSGP cyan éclairé à droite) — écarte le risque de
   redite avec le dispositif "cadenas" déjà vu, sans introduire d'objet abstrait hors-carte.
2. **Couleur TSGP → cyan `#00C4FF`** (Gemini). Seule proposition franchement distincte du doré AAGP
   `#FFC742` — les 2 propositions chaudes (Kimi/DeepSeek) écartées, cohérentes avec la leçon déjà
   écrite dans `GazoducActe1Hook.tsx` (orange trop proche du doré à l'échelle continentale).
3. **Climax Niamey → dosage retenu tel quel, GO** : onde de choc géométrique (cercles concentriques,
   `r` qui explose + opacité qui tombe) + camera shake court (~10f, amorti, technique déjà éprouvée
   `Scene1Hook.tsx`/`Beat12.tsx` Sénégal) + chiffre "35" massif au centre. Aucun ajustement demandé.

## SEGMENT B — MISE À JOUR (2026-08-05/07) : scène-lieu incarnée, pas une carte

Aziz a tranché (2026-08-05) : le registre est MIXTE — Segment A reste carte/données, Segment C reste
diagrammatique (split-screen), mais **Segment B devient une vraie scène-lieu incarnée** ("aéroport de
Niamey"), dans l'esprit des inserts Freetown/Financement de l'Acte 2 — PAS la carte stylisée abstraite
proposée dans le 1er brief. 2e mini DA-brief ciblé lancé sur ce seul segment (Gemini + Kimi complets,
⚠️ DeepSeek TRONQUÉ par l'API en cours de réponse — signal non fiable au-delà du climax "35", à ignorer
pour la suite de son rapport). Sorties brutes : `/tmp/da-refs/da-gazoduc-acte3-segb-aeroport-{gemini,kimi,deepseek}.md`
(à rapatrier avant purge /tmp).

**Structure retenue (convergence G+K)** — décor architectural qui se dessine puis vit puis se fige :
- 0–5.7s : piste + tour de contrôle qui se dessinent (`strokeDashoffset`, géométrie pure).
- 5.7–13.7s : le lieu vit — radar qui tourne en boucle, feux de piste qui s'allument en cascade,
  fenêtres du terminal éclairées. Contraste nécessaire avant la rupture.
- 13.7–22.6s : tension qui monte (clignotement accéléré, radar qui saccade légèrement) + date
  "25.06.2026" en timestamp discret style enregistrement de tour de contrôle.
- 22.6s ("frappe") : **coupure nette en 1 frame** — radar stoppe, toutes les lumières s'éteignent d'un
  coup, pas de fondu. Début du shake caméra.
- 26.5–28s : climax "35" (dosage déjà tranché — onde de choc + shake amorti + chiffre massif),
  intégré à CE décor (pas une carte).
- 28–32s : silence visuel, décor figé et gris, transition vers Segment C.

**Vigilance retenue (G+K convergent)** : shake JAMAIS mou (amortissement exponentiel rapide, violent
puis net) · chiffre "35" jamais rouge/pop façon mème (typo institutionnelle, blanc cassé, révélé par
l'onde plutôt qu'un simple scale).

**GATE — TRANCHÉ PAR AZIZ (2026-08-07) : couleur des feux/alertes du décor aéroport → CYAN `#00C4FF`**
(cohérent avec Gemini). Kimi proposait le doré `#FFC742` — ÉCARTÉ, déjà réservé à l'AAGP ailleurs dans
la charte, risque de confusion (l'aéroport est un lieu TSGP/algérien, pas AAGP/marocain). DeepSeek
proposait un rouge dédié `#E05A5A` — ÉCARTÉ, introduit une couleur hors charte pour un seul segment et
son rapport était de toute façon tronqué sur ce point. Le cyan reste l'unique couleur d'identité du
TSGP sur tout l'Acte 3, aucune nouvelle couleur introduite.

## ⛔⛔ CORRECTIF MAJEUR SEGMENT B (2026-08-07) — V1 codée à la main VIOLAIT la Règle N°0 du projet

Le 1er jet du Segment B (`GazoducActe3InsertSecurite.tsx`) codait une géométrie SVG à la main
(rectangles/triangles minimalistes) au lieu de faire dessiner le décor par un modèle — violation
directe de la Règle N°0 de `memory/doctrines/SVG-SCENES-GENERATIVES.md` ("le modèle dessine le SVG
STATIQUE, nous animons — JAMAIS l'inverse"). Repéré par Aziz sur capture d'écran ("ce n'est pas bon
[...] tu as créé simplement un insert, pas [le modèle] toi-même").

**Corrigé par un pipeline 4 modèles sur le SCRIPT NARRATIF** (pas une description technique de formes) :
Fable 5 (mode MAX, agent) + GPT-5.6 Sol + Gemini 3.1 Pro + Kimi K3, même brief (scène "aéroport de
Niamey de nuit qui vit paisiblement avant l'attaque", zéro figure humaine, zéro avion). Les 4 sorties
comparées visuellement (comparatif 2×2) : Fable 5 retenu comme BASE (le plus riche, 9 groupes
animables : ciel_nuit, nuages_bas, sol_tarmac, piste_atterrissage, feux_piste, terminal, tour_controle,
pylone_eclairage, manche_a_air). Fichiers sources rapatriés (doctrine : jamais laisser en /tmp) :
`public/_rnd/fable-svg/gazoduc-acte3/aeroport-niamey-{fable,gpt,gemini,kimi}.json`.

**Enrichissements mix-and-match (décision Aziz)** : lune empruntée à GPT-5.6 Sol (absente chez Fable) ·
ligne de seuil dorée en pointillé au sol empruntée à Gemini 3.1 Pro ("meilleur contraste pour qu'on
voie les lumières") · manche à air qui oscille légèrement au vent (ajout code, les 4 SVG sont
statiques par construction).

**⛔ REVIREMENT NARRATIF MAJEUR** (question posée par Aziz : "qu'est-ce qu'on essaie de représenter au
juste ? [...] très abstrait") — décision : PAS de figuration de l'attaque (ni avion, ni intérieur
d'aéroport, ni personnage). La métaphore retenue = **la vie qui s'éteint**. Séquence :
1. Vie normale (0→13.7s) : feux qui scintillent, manche à air qui oscille, tout fonctionne.
2. **Extinction PROGRESSIVE en cascade** (13.7s→22.6s, PAS un cut brutal) : feux de piste s'éteignent
   par paire gauche/droite, ordonnés PROCHE→LOINTAIN (profondeur de champ), puis tour de contrôle,
   puis fenêtres du terminal une à une (le bâtiment résiste le plus longtemps). Teinte globale glisse
   du chaud vers le bleu-noir en même temps (voile qui monte progressivement, opacité 0→0.75).
3. Climax "35 MORTS" (26.5s→28s) sur écran presque noir — SEULEMENT APRÈS l'extinction complète,
   jamais simultané à une coupure brutale (décision explicite : "extinction PROGRESSIVE puis chiffre").
   Geste déjà tranché au 1er DA-brief conservé : onde de choc + secousse caméra courte (~10f, amortie).
4. Silence final (28s→32s) : décor figé, sombre, transition vers Segment C.

Implémentation technique : le SVG Fable retranscrit en JSX groupe par groupe (JAMAIS
`dangerouslySetInnerHTML` — signalé par le hook sécurité du projet ET nécessaire pour animer chaque
groupe indépendamment, cf doctrine "innerHTML n'anime pas"). Vérifié par mini-renders successifs
(f100/f500/f550/f640/f678/f815) — extinction en cascade confirmée visuellement, climax lisible sur
fond sombre.

## CORRECTIFS V3 SEGMENT B (2026-08-07, retour Aziz sur captures V2)

1. **Pylône d'éclairage jamais éteint** — bug réel : `tourOpacity`/`darkenOverlay` pilotaient tour et
   terminal mais PAS le faisceau lumineux du pylône avant-plan gauche (toujours 100%). Corrigé :
   faisceau + flaque au sol suivent `darkenOverlay`, les 4 spots suivent `tourOpacity`.
2. **Ligne de seuil dorée en pointillé retirée** — jugée non nécessaire par Aziz une fois les
   lumières latérales (empruntées Gemini) en place.
3. **Manche à air recolorée aux couleurs du Niger** (Niamey) — orange `#E05206` / blanc `#FFFFFF` +
   disque orange central / vert `#0DB02B` (couleurs officielles vérifiées WebSearch, pas de mémoire).
   Remplace l'orange/crème générique du SVG Fable source. "Ça ancre là où on est."

Point déjà en place AVANT ce retour (confirmé, pas un doublon) : les lumières latérales de piste
(`FEUX_AMBRE`, empruntées à Gemini) et l'extinction progressive avant le chiffre "35" — le "manque de
lumière éteinte" perçu par Aziz venait du pylône (point 1), pas d'une extinction absente.

## ⛔⛔ REFONTE MAJEURE APRÈS REVIEW COMPLÈTE (2026-08-07) — verdict Aziz sur le rendu v1

Après rendu complet + upload, Aziz juge le Segment A "catastrophique", le climax "un simple diaporama
qui s'éteint", le Segment C "faible, complètement à refaire". 3 DA-briefs critiques dédiés lancés
(Gemini+Kimi+DeepSeek chacun, `--expert --with-deepseek`, frames réelles jointes). Convergence forte
des 3 voix sur chaque chantier — synthèse tracée ci-dessous, PAS encore appliquée au code.

### SEGMENT A (carte 74s) — convergence 3/3

✅ **RETENU (convergent)** :
- **5 mouvements de caméra distincts**, jamais un plan fixe : zoom serré Nigeria (0-8s) → travel
  tracking sur le tracé (8-22s) → dézoom pour révéler le Sahara comme obstacle géographique (22-33s,
  le vide EST le message mais avec MOUVEMENT, pas un cadre figé) → zoom agressif (scale x5-8) sur
  Adrar en climax local (33-45s) → dézoom pour la comparaison financière (45-72s).
- **Hiérarchie d'état non exploitée** : le Niger doit passer en "approached" AVANT que la ligne ne
  l'atteigne (l'état existe dans le code, jamais utilisé sur ce segment).
- **Financement/banques = dispositif SUR la carte, jamais un widget coin d'écran** : jetons SVG
  ancrés aux coordonnées géographiques (Nigeria/Niger/Algérie), icônes Lucide `Landmark` pour l'État
  vs `Building`/`X` pour la banque internationale rejetée, countup "13 Mds$" intégré au tracé.
- **Easing jamais linéaire** : accélération dans le vide (Sahara), ralentissement sur les zones
  denses en info — spring/bezier partout, jamais un stroke-dashoffset à vitesse constante.
- ❌ **ÉCARTÉ (convergent, Partie D "N/A")** : les 3 voix déconseillent un changement de registre
  radical — la carte continue fonctionne SI le séquençage caméra est corrigé. Pas besoin d'abandonner
  la carte pour ce segment.
🔶 **NUANCÉ (G isolé)** : rupture "mode blueprint" (fond noir, grille technique) à t=33s pour Adrar —
  option forte mais pas indispensable si le zoom agressif seul porte déjà le climax local.

### CLIMAX SÉCURITÉ (35 morts) — convergence 3/3 sur le fond, divergence tactique notable

✅ **RETENU (convergent)** :
- **Extinction JAMAIS un fondu linéaire uniforme** : vacillement/flicker avant extinction finale sur
  chaque feu (asymétrie organique), la tour meurt différemment (staccato décroissant) du reste.
- **Chiffre "35" jamais un scale spring doux** : cut plus dur/rigide, countup rapide plutôt qu'un
  simple pop, onde de choc qui "tranche" plutôt que "décore" (strokeWidth qui varie pendant l'expansion).
- **Caméra qui respire en continu** (micro-zoom imperceptible sur toute la durée du segment, pas
  seulement au climax) — actuellement plan fixe = diaporama, cause racine partagée avec le Segment A.
- **Manche à air à revoir** : oscillation actuelle jugée "mécanique/pantin" par 2/3 voix — bruit
  composé (2 fréquences sinus superposées) plutôt qu'un sinus pur.
⛔ **DIVERGENCE TACTIQUE non résolue (À TRANCHER PAR AZIZ)** — que garder du décor pendant le climax :
  - Gemini + DeepSeek : GARDER le décor en filigrane (opacity résiduelle ~0.05-0.08 sur tour/terminal)
    pendant que le chiffre apparaît — jamais un fond noir total, le lien lieu↔drame doit rester visible.
  - Kimi : option "chiffre marqué au sol/dans la matière du lieu" (projection sur la piste, ou pixel
    art dans les fenêtres du terminal) — plus radical, remplace l'affichage flottant actuel.
  → Les 2 approches sont compatibles techniquement (le filigrane peut coexister avec un ancrage spatial
    du chiffre) — pas un choix binaire, à trancher sur l'intensité voulue.
🔶 **NUANCÉ (ajouts SVG, 2-3 voix convergent)** : radar rotatif sur la tour, véhicule de piste
  immobile (échelle, sans figure humaine), lignes électriques en caténaire qui se sectionnent
  visuellement pendant l'extinction — enrichissements du vocabulaire visuel, pas critiques.

### SEGMENT C (split-screen Maroc/Algérie) — convergence 3/3, verdict unanime

✅ **RETENU (convergent, unanime)** :
- **GARDER le split-screen** — les 3 voix rejettent l'idée de l'abandonner : c'est l'outil rhétorique
  correct pour une comparaison frontale, le problème n'est PAS le dispositif mais son contenu vide.
- **Diagnostic partagé** : le segment ne visualise QUE la géographie (où) et jamais le paradoxe à
  2 axes par camp (Maroc = stabilité sécuritaire MAIS dépendance financière ; Algérie = autonomie
  financière MAIS instabilité sécuritaire). Les cartouches de texte sont "la preuve que le visuel a
  échoué" (Gemini) — si le texte doit tout expliquer, le motion design ne sert à rien.
- **Dispositif retenu (convergence quasi totale)** : transformer chaque fenêtre en "tableau de bord
  de tension" — 2 indicateurs par camp (pas 1), qui montrent la force ET la faiblesse de chaque pays :
  - Maroc : tracé qui s'arrête à ~85% ou passe en pointillé sur "suspendu" (financement) + icône
    `Lock`/`ShieldCheck` + barre "Financement" brisée qui se fragmente sur le mot exact.
  - Algérie : tracé qui tremble (shake déjà prouvé ailleurs dans le projet) sur "conflit" + icône
    `Coins`/`AlertTriangle` fixe et lumineuse (contraste avec le tremblement) pour l'autonomie financière.
  - Timing calé sur les CLAUSES grammaticales exactes du texte (chaque "mais" = un beat visuel).
- ❌ **ÉCARTÉ (convergent)** : les cartouches de texte actuels ("AAGP — MAROC / Pacifié...") — à
  remplacer par des libellés courts intégrés aux indicateurs eux-mêmes, jamais un bandeau en bas.

## GATE TRANCHÉ PAR AZIZ (2026-08-07)

1. Segment A : séquençage caméra en 5 mouvements + dispositif jetons financement sur la carte — VALIDÉ.
2. Climax : **décor en filigrane derrière le chiffre** (approche Gemini+DeepSeek), PAS le marquage au
   sol de Kimi — le lien lieu/drame reste visible via une silhouette fantôme tour/terminal à opacité
   très faible pendant le climax.
3. Segment C : dispositif "tableau de bord de tension" à 2 indicateurs par camp — VALIDÉ.

## STATUT — RECODAGE EN COURS DES 3 CHANTIERS (2026-08-07)

## STATUT — LES 3 SEGMENTS + MONTAGE SONT CODÉS (2026-08-07), EN ATTENTE DE VALIDATION RENDU COMPLET

Fichiers produits : `GazoducActe3CarteTSGP.tsx` (Segment A, carte D3), `GazoducActe3InsertSecurite.tsx`
V2 (Segment B, scène-lieu aéroport Niamey — voir correctif ci-dessus), `GazoducActe3InsertParadoxe.tsx`
(Segment C, split-screen 2 fenêtres indépendantes — 1 bug de conception trouvé et corrigé en direct :
un rideau sur carte unique coupait le territoire algérien en 2 à cause d'un chevauchement géographique
avec le Maroc, remplacé par 2 `<svg>` séparés avec caméra propre par pays) + montage
(`GazoducActe3Montage.tsx`) + enregistrement Root.tsx (4 nouvelles compositions). Aucun rendu vidéo
complet avec audio n'a encore été fait — seulement des mini-renders de validation ciblés par segment.
