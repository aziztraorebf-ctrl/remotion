# Gazoduc Acte 2 — Révision V2 après rejet du 1er rendu complet (2026-08-03)

> Le 1er rendu complet (`GazoducActe2AAGP.tsx`, "v1") a été rejeté par Aziz — retour détaillé point
> par point (carte trop sombre, ouverture statique 10s, caméra qui ne suit pas le tracé, overlay
> flashback illisible, vide autour du continent, légende AAGP superflue). Retour croisé avec un
> agent Map Animation (rapport : aucune technique radicalement neuve dans le catalogue 89 templates,
> mais diagnostic confirmé : caméra en points fixes discrets, pas de suivi continu) ET deux reviews
> externes (GPT + Gemini, envoyées par Aziz, lues intégralement). **Convergence à 3 sources
> indépendantes** (Aziz, agent, Gemini/GPT) sur le même diagnostic mécanique — traité comme acquis.

## ⛔ CE DOCUMENT REMPLACE L'APPROCHE "corriger point par point" DU BREAKDOWN V1

Conseil de Gemini retenu explicitement par Aziz (2026-08-03) : ne pas transformer le retour en
correction locale par élément (bleu plus clair + retirer AAGP + nouvelle icône + refaire overlay...)
— risque de "produire exactement ce qui est demandé localement tout en conservant le défaut global :
une carte statique sur laquelle on a ajouté davantage de choses." À la place : 4 RÈGLES STRUCTURANTES
qui gouvernent TOUT redécoupage des beats, avant de retoucher un seul élément visuel isolé.

## LES 4 RÈGLES STRUCTURANTES (cadre, Gemini, adopté par Aziz)

1. **La caméra raconte.** Elle suit le tracé en continu, change d'échelle, conduit le regard —
   jamais un plan figé entre deux jalons discrets. (Confirmé indépendamment par l'agent Map
   Animation : "caméra recalculée à chaque frame le long du tracé, pas seulement 3-4 points fixes.")
2. **Les pays réagissent à la narration, pas en permanence.** Contour/highlight/drapeau/marqueur
   UNIQUEMENT quand ils deviennent pertinents pour ce que dit la voix à cet instant — pas une
   coloration permanente de tout ce qui a été traversé (nuance explicite de Gemini vs la tentation
   "colorer plus de pays pour compenser le manque de vie").
3. **La composition doit évoluer régulièrement.** Aucune fenêtre de ~30s ne doit ressembler
   visuellement à une autre fenêtre de 30s ailleurs dans l'acte — changement d'échelle, déplacement
   caméra, transformation de la carte, ou rupture vers une autre représentation, à intervalle
   régulier (Gemini : "compare deux frames à 30s d'intervalle — elles ne doivent jamais se
   ressembler". C'était le cas dans la v1, symptôme nommé "absence de profondeur temporelle").
4. **La carte n'est pas obligée de tout raconter.** Quand une idée politique/économique/humaine est
   mieux représentée autrement (ex. accord diplomatique, financement manquant), sortir
   TEMPORAIREMENT de la carte — mais la représentation doit matérialiser PRÉCISÉMENT ce que dit la
   narration à ce moment, jamais une métaphore abstraite que le spectateur doit déchiffrer (le
   défaut exact de l'overlay flashback v1, jugé illisible unanimement par Aziz + GPT + Gemini).

## DÉCISIONS TRANCHÉES (arbitrage Aziz, après désaccord Gemini vs Aziz)

- **Vide autour du continent → Mix retenu** (caméra resserrée + géo élargie voisins visibles,
  `gazoducGeoElargie.json`, déjà généré). Gemini proposait une alternative (variation d'échelle
  constante SANS géo étendue, "le vide peut être élégant s'il est intentionnel") — Aziz tranche en
  faveur du Mix sur jugement visuel direct du rendu ("les continents qui apparaissent
  périodiquement font un gros changement et comblent le vide de manière nette"). Le principe
  Gemini n'est pas rejeté pour autant : la Règle 3 (composition qui évolue, variation d'échelle
  régulière) reste appliquée EN PLUS du Mix, pas à la place.
- **Caméra continue** (Piste 2/3 de l'agent Map Animation, convergente avec Gemini) : à implémenter
  au lieu du système `camFor` en 3-4 points discrets actuel. Calcul à CHAQUE frame d'une position le
  long du path complet du tracé (pas seulement aux jalons), avec anticipation légère + cadre qui
  inclut le sillage déjà parcouru (pas un point isolé recentré à chaque jalon).

## RÉÉCRITURE DU DÉCOUPAGE EN BEATS — appliquant les 4 règles

Le découpage narratif de fond (5 beats, timing frame-précis sur `narration.mp3`) reste celui de
`BREAKDOWN-ACTE2.md` — les frames-clés extraites de l'alignement forcé ne changent pas. Ce qui
change : COMMENT chaque beat est exécuté visuellement, pour respecter les 4 règles.

### Beat 2.1 — Ouverture [0 → 843, fusion des anciens 2.1+2.2]
**Ancien défaut** : 10s de carte statique avec un point Nigeria immobile (Règle 1 violée : caméra
figée ; Règle 3 violée : aucune évolution de composition avant la 10e seconde).
**V2** : Révélation Nigeria (Gemini) — rapprochement caméra CONTINU dès la frame 0 (jamais figé),
contour Nigeria qui se dessine + remplissage progressif, éventuellement bref flash drapeau. Dès que
le tracé démarre (~frame 280, Freetown), la caméra bascule en mode SUIVI CONTINU (position calculée
chaque frame le long du path, anticipation légère devant la tête du trait) — pas de saut vers un
2e point fixe "Freetown". Le jeton Freetown apparaît quand la caméra y arrive naturellement, pas
avant.

### Beat 2.3 — Tracé 13 pays, arrivée Maroc [843 → 1481]
**Ancien défaut** : caméra en vue de dessus fixe pendant tout le tracé (Règle 1) ; pays traversés =
petits points ronds identiques, pas de hiérarchie d'état (Règle 2 — Gemini : "animation sélective
plutôt que coloration permanente").
**V2** : Caméra continue qui accompagne la tête du trait sur toute la durée (Règle 1). Hiérarchie
d'état par pays (Gemini, reprise telle quelle) : non concerné = discret · approché = contour
légèrement renforcé · actif = contour lumineux/remplissage subtil · destination (Maroc) = drapeau +
marqueur. Ralentissement bref à chaque arrivée de pays (Gemini : "caméra descend, tracé démarre,
caméra accompagne, arrivée, léger ralentissement, pays identifié, reprise") — pas un simple point qui
s'allume instantanément. Chiffres (6900km, 15Mds m³) traités comme des "signes de ponctuation
visuels" (Gemini) : la composition change RADICALEMENT à cet instant (tracé complet visible, caméra
qui recule, chiffre énorme), pas un badge discret superposé sans rupture — répond directement à la
Règle 3.

### Beat 2.4 — Flashback 2016 [1700 → 2323]
**Ancien défaut** : overlay abstrait illisible (voile sombre + 2 cercles) — viole la Règle 4
explicitement ("la métaphore doit être comprise presque immédiatement", pas un rébus).
**V2 (test progressif, décision Aziz avant cette session)** : d'abord mini-render SIMPLE — jetons sur
fond neutre, SANS voile sombre, portraits réels (pas de placeholder) — avant d'investir dans une
scène narrative/illustrative complète. Si le simple ne suffit pas visuellement, passer à une scène
narrative qui MATÉRIALISE précisément l'accord (ex. document/traité stylisé reliant 2 États — idée
Gemini), jamais une métaphore abstraite. C'est aussi le moment identifié par Gemini pour une
RUPTURE VISUELLE nécessaire après ~50-60s de carte continue (Règle 4).

### Beat 2.5 — Financement manquant, Mauritanie, "VIRTUELS" [2900 → 4165]
**Ancien défaut** : retour à la carte au même endroit exactement qu'avant (Règle 3 violée — aucune
évolution de composition par rapport au beat précédent), contour Mauritanie confus visuellement.
**V2** : le chiffre "25 Mds $" suit le même traitement "ponctuation visuelle" que 6900km (rupture de
composition, pas juste un badge ajouté). Retour carte pour Mauritanie doit s'accompagner d'un
changement d'échelle/angle réel (pas la même vue qu'au beat précédent) pour respecter la Règle 3.

## CE QUI RESTE À FAIRE AVANT DE RECODER LE FICHIER DE PRODUCTION

1. Implémenter le mécanisme de caméra continue (remplace `camFor` à 3-4 points fixes) — prototype
   isolé à tester avant intégration, cohérent avec la méthode déjà appliquée pour A/B/Mix.
2. Tester ce mécanisme SUR LE MIX (géo élargie + caméra continue combinés) — pas un nouveau
   4e prototype séparé, mais l'évolution directe du Mix déjà validé par Aziz.
3. Une fois la caméra continue validée en isolation, réécrire `GazoducActe2AAGP.tsx` en appliquant
   les 4 règles à CHAQUE beat, pas seulement en corrigeant les éléments cités par Aziz un par un.
