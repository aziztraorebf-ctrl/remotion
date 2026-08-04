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

## STATUT — CODE NON DÉMARRÉ

Gate franchi, 3 arbitrages tranchés. Prochaine étape : découpage fin par acte (timing frame-précis sur
`narration.mp3`/`.alignment.json`, façon `BREAKDOWN-ACTE1.md`) — PAS encore fait, ce PLAN reste au niveau
storyboard/DA-brief. Ne pas coder tant que le breakdown frame-précis de l'Acte 2 (au moins) n'est pas
écrit, cohérence avec le pipeline qui a produit l'Acte 1 (storyboard → DA-brief → BREAKDOWN → code).
