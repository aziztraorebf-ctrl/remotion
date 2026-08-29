# STARTER — REPRO-UI : refaire 3 pièces d'animation d'interface RÉELLES

> Créé le **2026-08-27** en clôture de la session « marché animation ».
> ⭐ **Copier-coller le bloc PROMPT ci-dessous en début de session.**
> Décision d'Aziz : *vérifier AVANT de vendre* — « il ne sert à rien de se lancer si on n'est pas sûr
> d'être fort dès le premier livrable ».

---

## ⭐ ÉTAT AU 2026-08-29 — la session 1 a eu lieu, reprendre ICI

**FAIT** (branche `feat/repro-lottie-ui-redeem`, 5 commits) :
- ✅ **Corpus acquis** : 22 animations d'un studio qui vend, mesurées ET rendues
  → `out/_r-and-d/corpus-kamotion/` · analyse : `memory/client-sim-tests/corpus-kamotion/CORPUS-REFERENCE-UI.md`
- ✅ **Pièce 1 sur 3 reproduite** : flux « Redeem All » (hauteur 1,00 · encre 1,02 vs la référence)
  → `out/_r-and-d/repro-redeem/repro-redeem-FINAL.mp4` · code `src/projects/_client-sim/repro-redeem/`
- ✅ **Doctrine PRENDRE vs GÉNÉRER** (`memory/tools/banques-lottie-et-greffe.md`) + agent
  `svg-dessinateur` avec mémoire persistante.

**⏭️ REPRENDRE PAR** (dans cet ordre) :
1. ✅ **Le MATTE : RÉSOLU le 2026-08-29** — porté (`td`/`tt`), plus la précomposition et le rig.
   Chaîne complète prouvée de bout en bout sur un personnage animé.
   → **la suite de ce chantier vit désormais dans `memory/starters/STARTER-RIG-PERSONNAGE-EXISTANT.md`**
   (priorité : personnage CORPS ENTIER, cible `15_Customs_Officer`).
2. **Pièce 2 : l'onboarding** (`12_BVaKTgmqgb.lottie`, 2000×4369). ⚠️ **Mesuré le 29/08 : elle
   contient 0 matte, 0 trim path, 0 repeater** — elle ne teste donc PAS le travail du 29/08.
   Ce qu'elle teste vraiment : **45 précomps imbriqués sur 3 niveaux** (notre convertisseur produit
   une liste plate). ⭐ Décision d'Aziz : viser les écrans **à TEXTE**, notre chaîne les vectorise.
3. Réglage fin de la pièce 1 (la main couvre encore un peu les vignettes).
4. Décision en attente d'Aziz : **abonnement Creattie** (48 $/an — seul catalogue vérifié dont la
   licence autorise le transfert au client).

⛔ **L'agent `svg-dessinateur` reste EN OBSERVATION** (décision d'Aziz) : hors du flux de production
tant qu'il n'a pas fait ses preuves sur d'autres pièces.

---

## ▶️ PROMPT DE DÉMARRAGE (copier tel quel)

```
Session : REPRO-UI — refaire 3 pièces d'animation d'INTERFACE réellement vendues,
pour mesurer ce qui BLOQUE chez nous avant d'écrire une offre.

Méthode = celle de REPRO-FOSTER, appliquée cette fois à l'animation d'UI produit.
⛔ On ne choisit NI le sujet NI le niveau d'ambition : c'est le seul test qui peut dire NON.

1. Lire d'abord, dans cet ordre :
   - memory/projects/RECHERCHE-MARCHE-INDEX.md  (porte d'entrée, 8 verdicts + ce qu'on NE sait pas)
   - memory/projects/REPRO-FOSTER.md            (la méthode + les 4 façons de rater une mesure)
   - memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md  (ce que la chaîne sait convertir)

2. Choisir 3 pièces RÉELLES (pas des exercices confortables), couvrant le HAUT du U :
   a. une animation d'INTERFACE produit (dashboard / écran d'app qui se compose)
   b. une séquence de DONNÉES (chiffres qui montent, graphique qui se remplit)
   c. un plan de TYPOGRAPHIE CINÉTIQUE (c'est ce qui porte le récit dans la vidéo vendue)
   Sources possibles : la vidéo Foster déjà sur disque · gigs Fiverr `ui-animation` ·
   portfolios de studios (Vidico, Ordinary Folk). ⚠️ 15-90 s par pièce, pas 5 minutes.

3. Pour CHAQUE pièce, produire et NOTER :
   - ⛔ **PAS le temps** (décision d'Aziz, 2026-08-28). Une session dure 8-14 h dont l'essentiel
     hors travail (mobile, sommeil) : le temps écoulé mesure le CANAL DE COMMUNICATION, pas la
     production. Un chiffre d'heures est ininterprétable et invite à de fausses comparaisons.
   - **le nombre d'aller-retours** avant que ce soit juste
   - ce qui a coincé (geste manquant, brique absente, réglage inexistant)
   - ce qu'il a fallu contourner et à quel coût
   - ⭐ **départ de zéro, ou d'une brique existante ?** ← le plus révélateur : si tout part de
     zéro à chaque fois, la stack n'est pas prête.
   ⭐ LE LIVRABLE DE LA SESSION EST CETTE LISTE, pas les 3 vidéos.
   Un plan raté proprement documenté vaut plus que 3 plans réussis.

4. ⛔ Question à poser sur chaque plan : « est-ce que quelqu'un COMMANDERAIT ça ? »
   PAS « est-ce que c'est joli ? » (cf. feedback_prouver-une-capacite-nest-pas-produire-un-livrable)

⛔ Rappels non négociables :
 - Déclarer `// MOTEUR: <registre>` dans tout nouveau .tsx (gate actif).
 - Netteté : juger UNIQUEMENT sur un render scale=1. Un scale=0.4 est flou et fait douter à tort.
 - Mesurer un mouvement composante par composante ; un commentaire qui JUSTIFIE une valeur
   jamais mesurée est un signal d'alarme.
 - Calques NOMMÉS systématiquement : c'est la clause contractuelle « source or equivalent ».
```

---

## POURQUOI cette session, et pas une autre

Le marché a été mesuré les 26-27 août (~10 agents). **Ce qui manque n'est plus de la connaissance
marché, c'est de savoir ce qui BLOQUE chez nous.** Écrire l'offre avant, c'est promettre à l'aveugle.

**Ce que la recherche a déjà tranché** (détail : `RECHERCHE-MARCHE-INDEX.md`) :
- Le marché est un **U** : le haut se vend SANS personnages ni voix off — UI, typo, données.
- La stack couvre **~85 % du marché SaaS**. Nos faiblesses = ce que ce marché n'achète pas.
- Ce qui manque : **le SCRIPT** (qu'on a en doctrine mais qu'on offre au lieu de le facturer)
  et **le SOUND DESIGN** (pas une capacité de code).
- ⛔ « Remotion » n'a **aucune demande** : le code est un avantage de coût, jamais un argument de vente.

## LA SESSION D'APRÈS (ne pas la faire avant)

Écrire l'offre **sur du réel** : titre (`UI animation` / `motion design` / `B2B` — ⛔ jamais
`explainer video`), **prix calés sur la COMPLEXITÉ, jamais sur la durée ni sur un temps mesuré**
(le vendeur Fiverr étudié le 08-28 ne facture PAS à la seconde : 3 paliers distingués par des cases
à cocher — icône / logo / UI complexe, 35,85 · 81,97 · 158,84 CAD), vignette = l'animation DANS une
interface. ⭐ Les 3 pièces SONT le portfolio — et sur Upwork la sélection se fait sur portfolio,
pas sur compteur d'avis.

## ⛔ CE QU'ON NE FAIT PAS MAINTENANT

- **Sound design** : vrai trou, mais pas une capacité de code → session dédiée, voire partenaire.
- **After Effects** : pas installé, aucun client ne l'a exigé, et ce n'est PAS un mur (mesuré).
  À rouvrir le jour où un client précis le demande.
- **Rive** : une case de format à 9 $/mois, pas un pilier. Rien ne presse.

## 🎣 À GLISSER SANS EN FAIRE UNE SESSION

L'hypothèse CENTRALE non validée : **un acheteur paie-t-il pour le déterminisme ?**
Ça ne se teste pas par la recherche, ça se pose à des acheteurs réels. Chaque candidature Upwork est
une occasion gratuite : *« si vous avez besoin d'ajuster ou de décliner plus tard, c'est un paramètre
chez moi »*. S'ils réagissent, on le saura. S'ils n'en parlent jamais, on le saura aussi.

## FILS PARALLÈLES (n'entrent pas en concurrence)

- **AbiGirl / chill-meter** : elle décide (« reviewing everything carefully »). Rien en suspens de
  notre côté. Si contrat → **le SON en premier**, seul point promis jamais démontré.
  Relance légitime après 3-4 jours ouvrés sans nouvelle. → `memory/client-sim-tests/upwork-chill-meter/STATUS.md`
- **GAZODUC Acte 3** : priorité 1 de PRODUCTION, gel levé. Beats 1-2 V3 attendent la validation d'Aziz.
  N'avance pas tout seul. → `memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md`

## 🧹 DETTE À SOLDER (pas en fin de session)

1. ✅ **MEMORY.md : SOLDÉ le 2026-08-29** — compacté à **19,7 Ko** (sous l'alerte de 20 Ko, plafond
   dur 25 Ko). Un orphelin y a été trouvé et réparé au passage : la ligne « budget de contexte »
   pointait vers une fiche **qui n'a jamais existé** (ni sur disque, ni dans git). ⭐ La leçon :
   avant de compacter une ligne d'index, vérifier que le fichier pointé EXISTE — sinon on supprime
   la seule copie. ⚠️ Le poids se déplace : c'est **NEXT-ACTION.md (29 Ko)** qui porte désormais
   l'essentiel de la chaîne de démarrage (~48 k tokens).
2. ✅ **Collision worktree : DÉJÀ RÉSOLUE** le 2026-08-27 (stub propre, 2 fragments rapatriés,
   `check-memoire-doublons.py` → 0 collision sur 15). ⛔ Ne PAS refaire ce travail.
   ⭐ Leçon à garder : **un stub de redirection peut MASQUER du contenu non rapatrié** — il se
   présentait comme résolu, 2 fragments sont restés invisibles 4 jours. Vérifier par **grep du
   contenu**, jamais par l'apparence du stub.
3. ✅ `freelance-dataviz-fiverr-pro.md` : bandeau « FICHIER HISTORIQUE » posé le 08-27 (ce qui reste
   valide / ce qui est périmé). ✅ Les 2 chemins morts de `PILIERS-B2B.md` sont corrigés, et le gate
   `check-links.py` couvre désormais PILIERS-B2B + RECHERCHE-MARCHE-INDEX (570 chemins / 11 fichiers).
4bis. 🧹 **265 Mo de purge PROPOSÉE mais NON exécutée** (wrap 08-27 — une autre session tournait sur
   le repo, purger aurait été risqué) :
   - `out/_rnd/` (**253 Mo**) — ⛔⛔ **LA NOTE « aucun référencé » ÉTAIT FAUSSE** (corrigé au wrap
     du 2026-08-29, vérifié par grep). **9 des 21 entrées SONT citées** dans la mémoire vivante —
     dont `warmap-choc/` (**189 Mo à lui seul**, 3 références : `soudan-midform/STATUS.md:718,722`
     et `soudan-midform-STORYBOARD-ACTE1.md:15`). Une purge en bloc aurait créé des liens morts.
     → **Gain réel d'une purge SÛRE : ~39 Mo, pas 252.** Candidats sans aucune référence :
     `geo-flow-connection/` (10 Mo) · `kosti-proto/` (3,8) · `frames-headlesstest/` (2,9) ·
     `frames-geoflow/` (2,1) · les 6 mp4 à la racine (21 Mo).
     ⚠️ **Doublon de rôle réel** : la doctrine ne nomme que `out/_r-and-d/`. Ne pas fusionner —
     mais ne pas purger `_rnd/` en bloc non plus.
     ⭐ **La leçon** : une note de purge qui affirme une ABSENCE de référence se VÉRIFIE par grep
     avant d'agir. Un catalogue qui affirme un vide est faillible (4 occurrences dans ce projet).
   - `out/_wip/` (13 Mo) — **hors nomenclature** (le wip appartient à `out/episodes/<ep>/wip/`).
     ⚠️ Contient 4 mp4 de test **Acte 3 Gazoduc** → confirmer avec Aziz avant de purger (Acte 3 = priorité 1).
   - ⛔ **À CONSERVER** : `out/episodes/gazoduc-aagp-tsgp/wip/acte3-v3.review-override.md` (4 Ko) —
     c'est un override de review, pas un render.
   ℹ️ `out/` pèse **10 Go** (episodes 5,5 · PRET-PUBLICATION 2,1 intouchable · _r-and-d 1,2).
4ter. ⚠️ **6 erreurs TypeScript PRÉEXISTANTES** (commitées en mai, aucun lien avec ces sessions) :
   `GlobalPulse.tsx` (4× types mapbox-gl périmés `ProjectionSpecification`/`FogSpecification`),
   `GoldVein.tsx` (1× idem), `LoomWeaver.tsx` (1× `spring` utilisé comme type). Non bloquantes.
5. ⛔ **3 dettes documentées jamais exécutées** (trouvées au wrap du 08-27) :
   - ⚠️ **SÉCURITÉ — note CORRIGÉE le 2026-08-29** : le fichier qui parse en **regex** est `src/projects/_client-sim/lottie-ui/tools/animate_start.py` (`re.finditer` l.73, `re.findall` l.97), **pas** `svg2lottie.py` — celui-ci est DÉJÀ durci (defusedxml + `_SafeParser` qui refuse toute déclaration d'entité, l.22-43). ⛔⛔ L'ancienne note désignait le fichier **déjà sûr** et laissait le vrai trou non signalé : une note de sécurité qui RASSURE À TORT est pire qu'une dette ouverte. → ne pas exposer `animate_start.py` (statut **proto**, 1 usage) à un SVG client non fiable. ⭐ L'outil courant de la chaîne, `svg2lottie_scene.py`, n'est pas concerné.
     `memory/tools/lottie-claude-inventaire.md:123` dit de **ne PAS l'exposer à un SVG client non
     fiable** sans durcissement XXE. **Deviendra bloquant le jour où un client envoie ses SVG.**
   - `memory/tools/openrouter-svg.md:207` : `max_output_tokens=32000` jamais remonté dans
     `scripts/tools/gemini-vision-breakdown.py:56` (un brief vision multi-formes se fait tronquer).
   - `memory/tools/lottie-claude-inventaire.md:116` : « source .aep À TESTER » — **bloqué sur un
     prérequis matériel** (AE non installé), à déclarer comme tel plutôt que comme action en attente.
6. **`FICHE-MOCKUP-3D`** (202 lignes) a hérité en silence du statut d'exception lors de sa scission
   d'UI-PRODUIT le 08-26 → **arbitrage d'Aziz** : l'inscrire au README des fiches, ou tailler son
   doublon de fin (le § « une affirmation de capacité se vérifie » répète le § SVG/3D d'ouverture).
