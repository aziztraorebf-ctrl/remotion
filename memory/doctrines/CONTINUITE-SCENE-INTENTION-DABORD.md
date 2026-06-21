# DOCTRINE — Continuité de scène & Intention d'abord (anti-cercle-vicieux des templates)

> ⭐ **NON-NEGOTIABLE. À lire avant de construire OU prolonger toute scène (hook, beat, transition).**
> Née d'un cas réel prouvé DEUX FOIS du premier coup le 2026-06-18 (hook Sénégal Pétrole + sa suite).
> Elle répond à un problème récurrent nommé par Aziz : *« à chaque nouvelle scène ou prolongement, ça
> redevient problématique, on tâtonne, on hésite, on refait tout. »* La cause n'était PAS « trop de
> templates » — c'était **l'ORDRE dans lequel on les invoque.**

---

## LE PIÈGE (ce qu'on faisait avant, qui paralyse)

**Réflexe template-first** : *« voici nos 71 composants — lequel colle ? »*
La doctrine du projet le pousse même (« scan templates AVANT de coder »). Résultat observé :
- On déroule un catalogue, **rien ne colle tout à fait**, on hésite.
- On finit par plaquer un composant « qui ressemble » → l'instinct d'Aziz sent le décalage (« ça ne fait pas 100% »).
- Ou on bricole / on refait à zéro. **10 essais** avant que ça tombe juste par hasard.
- Le catalogue, censé accélérer, **PARALYSE** : il demande de *reconnaître* la bonne réponse au lieu de la *déduire*.

**Exemple vécu (à ne PAS refaire)** : pour la suite du hook Sénégal (le limogeage), première tentative =
prendre 2 templates existants (`NewsClippingV2` coupure de presse + `FaceAFace` bascule) et les *remplir*
de texte. Verdict Aziz : *« les deux sont intéressants mais ça ne le fait pas à 100%. »* → exactement le
symptôme. On était parti **du template, pas du sens**.

---

## LA RÈGLE (ce qui a marché, prouvé)

### 1. INTENTION → FORME → TEMPLATE (dans CET ordre, jamais l'inverse)
Avant tout composant, répondre : **« que doit FAIRE ressentir ce moment ? »** (4-5 verbes max :
poser une tension / révéler un chiffre / annoncer un fait / **faire basculer** / faire respirer).
- L'intention dicte la **forme** (le geste visuel qui porte cette émotion).
- Le template vient **en dernier**, et seulement comme question binaire : *« a-t-on déjà cette forme ? »*
  Si oui → on l'adapte. Si non → on code, mais on sait EXACTEMENT quoi, parce que l'intention est claire.

**Preuve** : le mot de la voix était *« bascule »*. Une bascule n'est ni une annonce (coupure de presse,
statique) ni une comparaison (face-à-face, équilibré) : c'est un **renversement**. D'où la forme codée
(la carte se FEND, les moitiés se décalent) — qui n'existait dans aucun template. Tombé juste **du 1er coup**.

### 2. CONTINUITÉ > NOUVEAUTÉ (le vrai capital réutilisable)
Une scène = **UN MONDE qui se transforme**, pas une succession d'écrans. Le premium vient de RESTER
dans le même monde et de le faire évoluer. Mot exact d'Aziz : *« on n'a pas changé de template, on a
continué la scène en rajoutant des éléments. »*
- Phase 1 (hook) : carte parchemin + count-up `8 000 000 $`.
- Phase 2 (suite) : **la MÊME carte** se fracture, le **MÊME 8M$** est repris figé, le **MÊME fond** se
  contamine. Puis la carte recule/s'estompe et **la question monte par-dessus le même monde**.
- ⚠️ Chaque fois qu'on CHANGE de monde (nouveau template = nouvel écran), il faut tout re-justifier →
  c'est là qu'on tâtonnait. **Le vrai template réutilisable, c'est le MONDE (fond + carte + chiffre), pas un composant.**

### 3. ÉPURE = ANTI-REDONDANCE (l'écran ne répète pas la voix) — ⭐ LE FIL ROUGE D'AZIZ
**Règle gravée (répétée par Aziz depuis le début du sujet) : à l'écran, GARDER L'ESSENTIEL, alléger
tout le reste. Jamais 2-3 lignes de texte qui redisent la même chose, ni une paraphrase de la voix.**
Quand la voix porte déjà l'info, l'écran montre soit ce que la voix NE dit pas, soit le NOYAU en 2-3 mots.
- Hook : retiré le sous-titre qui doublait « 8 millions de dollars » mot pour mot.
- Fracture : gardé **« 22 MAI » seul + pulse**, retiré « tout bascule » et « le gouvernement saute ».
- Question : la voix dit *« Comment un pays qui s'enrichit bascule dans la tourmente ? »* (phrase complète)
  → l'écran ne la paraphrase PAS, il montre le paradoxe NU en 2 mots opposés : **« S'enrichir. / S'effondrer. »**
  C'est ça « garder l'essentiel » : le contraste, pas la phrase.
Test : si le texte à l'écran pourrait être lu À VOIX HAUTE en même temps que la narration sans gêne → il
double la voix → le réduire au noyau ou le supprimer.

### 4. CALAGE AUDIO = l'image PRÉCÈDE l'oreille
Mesurer la voix par **FORCED ALIGNMENT ElevenLabs** (`/v1/forced-alignment`, word-level, loss < 0.3) —
PAS Whisper (Whisper derive de ~0.4s+, prouve sur le hook : il situait "saute" a 11.46s, le forced
alignment a 11.84s = le vrai). Script de ref : `scripts/senegal-hook-alignment.py`. Caler l'animation
pour **culminer ~1s AVANT** le mot-cle. Animation en retard sur la voix = sensation de lenteur ;
l'image qui precede = vivacite. (Hook : compteur a 8M ~5s, voix dit "dollars" ~6s.)

---

## LE SIGNAL « OUI » D'AZIZ (ce qu'on cherchait à comprendre)
Aziz demandait : *« il y a quelque chose derrière qui fait que je dis oui — il faut le reverse-engineer. »*
**Réponse : son instinct dit OUI quand la FORME ÉPOUSE L'INTENTION.** Quand c'est aligné, le oui est
immédiat (du 1er coup). Quand on plaque un template, l'instinct sent le décalage. La mesure objective =
**le nombre d'essais** : méthode template-first = ~10 essais ; méthode intention-first = 1 essai.

---

## CHECKLIST (30 secondes, avant de coder/prolonger une scène)
1. **Intention** : ce moment doit faire ressentir QUOI ? (1 verbe dominant)
2. **Continuité** : quel monde est déjà à l'écran ? Je le PROLONGE (je ne le remplace pas).
3. **Forme** : quel geste porte l'intention ? (ne pas penser « composant » encore)
4. **Template** : a-t-on déjà cette forme ? oui→adapter / non→coder (mais je sais quoi).
5. **Épure** : qu'est-ce que la voix dit déjà ? → je le retire de l'écran.
6. **Calage** : l'animation culmine ~1s avant le mot-clé (forced alignment ElevenLabs).

---

## APPLICATION PAR PILIER (ce qui est PROUVÉ vs HYPOTHÈSE à tester)

> Les 4 principes ci-dessus sont nés d'un cas **Remotion**. Voici lesquels sont universels, lesquels
> sont à confirmer sur les autres médiums. **Ne pas traiter une hypothèse comme une vérité prouvée.**

| Principe | Remotion (PROUVÉ) | War-Map | Mapbox |
|---|---|---|---|
| **1. Intention→forme→template** | ✅ prouvé 2× du 1er coup | ✅ universel (s'applique tel quel) | ✅ universel |
| **2. Continuité du monde** | ✅ prouvé (scène 0) | 🔶 hypothèse forte : War-Map a déjà un ÉTAT CONTINU (1 moteur conteneur) → principe NATIF, probablement renforcé | 🔶 hypothèse forte : Mapbox = "1 seule Map continue" (doctrine Souverain) → la continuité y est DÉJÀ la règle. À confirmer que "prolonger > nouvel écran" tient pour les overlays |
| **3. Épure anti-redondance** | ✅ prouvé | ✅ universel (l'écran ne double jamais la voix, tous médiums) | ✅ universel |
| **4. Image précède l'oreille (forced align)** | ✅ prouvé | ✅ déjà la pratique (War-Map utilise forced alignment, ex. `narration-v5-alignment.json`) | ✅ universel (caler getCam/overlays sur la voix) |

**Synthèse** : les principes 1, 3, 4 sont **universels** (tous piliers). Le principe 2 (continuité) est
**prouvé en Remotion** et **probablement natif/renforcé** en Mapbox/War-Map (qui ont déjà un monde continu),
mais cette transposition reste une **hypothèse à valider en pratique** sur le prochain beat carto.
⚠️ La grammaire VISUELLE diffère par médium (fracture SVG ≠ FlagFill Mapbox ≠ jetons War-Map) — c'est la
FORME qui change, pas la doctrine de décision.

## APPLICATION AUX INDEX / CATALOGUES (la doctrine appliquée au rangement)

> Étend la doctrine au PROBLÈME D'AZIZ sur les index (2026-06-18) : un catalogue rangé par
> techno/lieu = piège template-first. Un index doit servir la déduction, pas la remplacer.

**Règle** : un index n'est pas une vitrine où l'on vient voir « ce qu'on a ». C'est une
**table INTENTION → FORME → réponse**, consultée APRÈS avoir déduit l'intention (étape 4 de la
checklist), jamais comme point de départ.

- **Le bon patron existe déjà** : la colonne « **Quand Aziz dit…** » du COMPOSANTS-INDEX Souverain.
  Elle indexe par ce qu'on veut DIRE/FAIRE RESSENTIR, pas par le nom technique du composant. À généraliser.
- **Porte d'entrée unique** : `src/projects/_shared/INTENTION-FORME-INDEX.md` mappe chaque intention
  (faire basculer, révéler un chiffre, mettre l'emphase, situer…) vers la/les forme(s) existante(s)
  + le catalogue détaillé. Les catalogues par pilier (warmap/atlas/mapbox/gemini) restent comme
  FICHES TECHNIQUES, consultées en second.
- **Hiérarchie de réponse** : à intention égale, préférer (1) prolonger le monde déjà à l'écran
  (continuité §2) ; (2) une forme motion-design validée (templates Hera ⭐) ; (3) coder si rien ne colle
  — mais alors l'intention est claire, donc on sait quoi.
- **Anti-piège** : si l'index te fait dérouler une liste en te demandant « lequel ressemble ? », tu es
  reparti template-first. Reviens à l'intention (1 verbe) avant de rouvrir l'index.

### Une dataviz EST un monde à continuer (précision Aziz 2026-06-18)
Le mauvais pattern n'est PAS « rester longtemps sur une dataviz » — c'est **CHANGER de dataviz** (nouvel
écran, nouveau monde) sans justification. Une dataviz se fait VIVRE comme tout autre monde :
- ✅ **Faire évoluer la MÊME dataviz** : axe → courbe qui se trace → bande qui apparaît → point qui s'allume
  → annotation → chiffre qui pulse. Un seul monde, qui s'enrichit. **Plus fort** que changer d'écran : le
  spectateur garde son ancrage, chaque nouvel élément RÉCOMPENSE l'attention au lieu de la réinitialiser.
- ❌ **Zapper d'une dataviz à une autre** (donut → bars → line sans rapport) = 3 mondes = anti-pattern §2.
- ⏱️ **Ce n'est PAS une question de durée** (ni minimum 20s, ni maximum). C'est l'INTENTION qui décide :
  si elle justifie 5s, c'est 5s ; si elle porte sur 20s+ en faisant vivre, on continue. Changer de monde
  est permis SI justifié par l'intention — jamais par défaut.
- ⚠️ **Seul garde-fou temporel : ne jamais rester statique.** Un événement visuel ~toutes les 5s (règle
  rétention) — mais appliqué **DANS le monde** (le faire vivre), pas en changeant de plan. Lien : doctrine
  rétention/hook 1ère minute. C'est la règle des 5s souvent MAL appliquée (on changeait de plan au lieu d'enrichir).

  **⭐ COMMENT bien appliquer la règle des 5s (raffinement prouvé 2026-06-21, Sénégal Scène 1 SVG animé) —**
  vaut surtout quand on ANIME un monde par parties (SVG, Hero-d'état, carte vivante) où on a le CONTRÔLE :
  1. **ÉTALER les événements, ne JAMAIS les empiler à la fin.** Le piège réel : tous les effets tombaient au
     dernier mot → les 16 premières secondes mortes. Répartir : un déclencheur ~toutes les 4-5s sur toute la durée.
  2. **VIE DE FOND CONTINUE en plus des événements ponctuels** : un mouvement permanent de bas niveau (nuages qui
     dérivent, océan qui respire, halo qui pulse) → "jamais zéro mouvement" même entre deux événements. C'est la
     couche qui empêche le statique, distincte des temps forts.
  3. **CALER chaque effet sur un MOT précis** (forced alignment) : l'effet tombe sur le mot qui le justifie
     (ex: l'océan noircit sur "ces deux récits", le navire part sur "pompent"). L'image épouse la voix.
  4. **FINIR sur une RESPIRATION** : laisser le monde dans son état final ~0.5-1s AVANT la transition (pièce
     vide, carte posée) → le message infuse avant le changement. Ne pas enchaîner la transition à la milliseconde.
  Le SVG/animation maison rend ces 4 points TRIVIAUX (chaque élément = une variable frame-driven). Prouvé :
  `out/_r-and-d/svg-anime-coin/` + `SenegalCoinFaceA_SVG.tsx`. Détail technique SVG : [[key-learnings]] §SVG GÉNÉRATIF ANIMÉ.
- `ProtoHera_ChartOnMap` / `HeraFidele_V12_LineChart` = exemplaires (1 monde qui se construit).
  `ProtoHera_ChartsParchemin` (3 charts enchaînés) = à n'utiliser QUE si l'intention justifie 3 mondes distincts.

---

## VARIANTE DE REVIEW : DA-brief VIDÉO (aval, mouvement+son)
Pour juger une scène FINIE (mouvement/rythme/transitions/son), utiliser `scripts/tools/gemini-video-da-brief.py`
(upload vidéo complète à Gemini 3.1 Pro + analyse d'écart vers des refs de niveau). Distinct de `da-brief.py`
(review AMONT sur frames/storyboard figés). Gemini = SIGNAL, jamais juge : on FILTRE (garder ce qui élève
sans casser l'épure ; jeter le bruit). Détail : `scripts/tools/REVIEW-TOOLS-INDEX.md`.

---

## RAPPORT AVEC LES AUTRES DOCTRINES
- Ne REMPLACE pas le scan templates — le **réordonne** : intention d'abord, template en vérification finale.
- Complète [[feedback_premium-d-abord-anti-paresse]] (le premium = direction, pas un composant plaqué).
- Porte d'entrée des templates : `src/projects/_shared/INTENTION-FORME-INDEX.md` (table intention→forme).
  Le COMPOSANTS-INDEX et les catalogues par pilier = FICHES TECHNIQUES consultées APRÈS, pas points de départ.
- Lié au chantier [[decode-hera-templates]] : les 3 fonds + 6 familles servent comme *réponses* à une
  intention, jamais comme catalogue où l'on « cherche quoi mettre ».
- Cas incarné : hook Sénégal `ProtoEffect_MapDrawParchemin` + suite `ProtoEffect_Fracture`.
