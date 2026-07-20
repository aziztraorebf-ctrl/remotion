# SOUVERAIN VISUAL PLAYBOOK — Doctrine cartographique premium

> **Construit 2026-06-01** via 2 appels Gemini 3.1 Pro : 6 réfs premium (Jacque a dit & sim.) analysées par Aziz + 4 de nos vidéos (Or Africain, Sénégal, Maroc Hook, Maroc Beat1).
> **À LIRE avant tout beat Mapbox.** Référencé depuis CLAUDE.md (Pipeline Beat Mapbox) et SKELETON.
> **Principe fondateur (règle Aziz) :** Claude est maître du CODE. Pour la VISION ARTISTIQUE, s'appuyer sur l'œil externe (Gemini scoré). Voir [[feedback_systeme-beat-mapbox-vs-remotion]].
> ⭐ **OUTIL SVG-INSERT dispo** : un mécanisme/concept/transformation à expliquer (ex. franc CFA, flux financier, métaphore) peut être un insert SVG animé (30s-1min) plutôt qu'un beat Mapbox — souvent moins coûteux + contrôle total. À penser DÈS le script. Doctrine : [[SVG-MIDFORM-FORMAT]] · couche script : [[DOCTRINE-SCRIPT-UNIFIEE]] règle 17. (⛔ la géo reste Mapbox.)

---

## 0. LA RÈGLE ANTI-CLONAGE (la plus importante)

Les chaînes cartographiques populaires (Jacque a dit, etc.) **se ressemblent toutes** : satellite réaliste / Google Earth / terre-plate / emojis géants / pop-ups disproportionnés. C'est le standard générique du genre.

**Notre force = notre différence.** On adopte leurs PRINCIPES (mécanique d'engagement), JAMAIS leur ESTHÉTIQUE.

| À ADOPTER (principes) | À ÉVITER (esthétique clone) |
|---|---|
| Apparition séquentielle synchro syllabe | Satellite / Google Earth / terre-plate |
| Caméra jamais immobile (drift) | Emojis géants, pop-ups disproportionnés |
| Carte jamais vide (remplissage actif) | Abstraction extrême (carte qui n'est plus une carte) |
| Projection d'images dans polygones | Rythme frénétique / zooms ultra-prononcés |
| Habillage narratif (flux, flèches, pop-ups) | |

**Notre signature à préserver :** Mapbox dark navy `#16213a` + gold `#c8a951` + ivory `#f2ebd9`. Alternative beige (style carousel Good News). Premium et CLASSIQUE.

---

## 1. LES 5 PRINCIPES PREMIUM (la mécanique vivante)

**Synthèse Gemini :** *« Une carte vivante ne s'arrête jamais de respirer (caméra continue) et se construit sous les yeux du spectateur (apparitions séquentielles rythmées). On remplace la frénésie cheap des emojis par une chorégraphie de données vectorielles navy/gold — la carte devient un tableau de bord stratégique de haute volée. »*

### P1 — Apparition séquentielle (synchro syllabe)
Déclencher opacité/couleur de chaque élément EXACTEMENT sur le beat de la voix-off. Léger flash (opacité 1.0 → 0.8) sur la frame d'apparition pour marquer l'impact sans effet cartoon.
État actuel : **partiel** (Or Africain s'allume mais pas synchro fine).

### P2 — Caméra jamais immobile (drift mathématique)
flyTo interdit headless → drift programmé : à chaque frame jumpTo, incrémenter légèrement bearing (~+0.05°/frame) ou center (pano très lent). Effet « drone haute altitude ». **JAMAIS de plan statique.**
État actuel : **NON — faiblesse #1**.

### P2bis — ALTITUDE PAR DÉFAUT (règle Aziz 2026-06-01, NON-NEGOTIABLE)
**Rester EN HAUTEUR par défaut** — vue qui montre le pays entier, ses frontières, son contexte géographique. Les bonnes chaînes descendent au niveau du sol RAREMENT, comme un accent ponctuel et bref.
**Pourquoi :** (1) en hauteur on lit les frontières et on SITUE immédiatement (« le Maroc, face à l'Europe ») ; (2) l'effet vivant (couleur, frontières, projection) A BESOIN de hauteur pour se voir — au ras du sol, patterns et couleurs deviennent une bouillie confuse ; (3) un gros zoom sol comme point de départ = look confus (cf. erreur Beat 1 Maroc A2 : commençait zoom 9.5 sur la mine, tout orange, point qui pulse sans contexte — on ne sait pas où on est).
**Règle :** zoom de travail par défaut = vue pays/région (frontières lisibles). Gros zoom sol = EXCEPTION ponctuelle et brève pour un accent, jamais l'état par défaut ni le point d'ouverture d'un acte.

### P3 — Remplissage actif (zéro carte vide)
L'espace vide doit devenir un espace négatif **texturé**. Fill-pattern hachures dorées fines, grilles topographiques discrètes, frontières voisines en ivory 10%.
État actuel : **NON — la carte grise**.

### P4 — Projection d'images dans les polygones (bichromie)
Plaquer images (drapeaux, portraits, textures minerais) DANS les frontières via fill-pattern, avec traitement colorimétrique strict : bichromie navy/gold ou sépia désaturé. Garde le côté « atlas premium », évite le collage cheap.
État actuel : **NON — on n'exploite pas**. **PRIORITÉ : technique différenciante préférée (vs vidéo d'archives, voir §4).**
> ⚠️ **Réconciliation avec §2bis (audit 06-03) :** "priorité" ici ne veut PAS dire "ajoute une projection partout". P4 dit : *quand le récit réclame une image dans un polygone, la projection bichromie est NOTRE technique de choix* (vs collage cheap ou archive). Le §2bis garde le dernier mot sur le *si* (test de retrait, suit-la-voix, plafond). Donc : P4 = COMMENT projeter quand c'est justifié ; §2bis = FAUT-IL ajouter. Pas de conflit : §2bis décide, P4 exécute.

### P5 — Habillage narratif (flux animés, pop-ups premium)
Lignes de flux animées via line-dasharray frame par frame (routes, exports). Pop-ups = encarts minimalistes (fines bordures dorées, fond navy translucide glassmorphism léger) reliés au point géo par une ligne fine, apparition séquentielle.
État actuel : **partiel** (labels statiques, pas de flux).

---

## 2. SOLUTIONS ANTI-GRIS (dans NOTRE style)

| Problème | Solution navy/gold | Technique Mapbox |
|---|---|---|
| Océan/terres mortes (80% écran) | Profondeur subtile navy | `hillshade` couleurs `#16213a`/`#2a3b5c`, ou isobathes/isohypses line-color transparent |
| Petit pays focus, reste vide | Effet radar / zone d'influence | Buffers concentriques Turf.js, opacité décroissante en cascade sur voisins |
| Temps mort pendant longue phrase VO | Data ambiante non distrayante | circle-layer animé le long de routes GeoJSON (effet flux/réseau actif) |

---

## 2bis. INSPIRATION EXTERNE — checklist de COMPLÉMENTARITÉ (révisée 2026-06-03, post-test A5)

> ⚠️ **CE N'EST PAS une étape de production qui pousse à AJOUTER des éléments.** C'est une **checklist de finition, APRÈS que la scène est déjà bonne**, pour voir si une variation de couleur/frontière/caméra l'enrichirait — lisiblement, en suivant la voix. Notre playbook + nos templates ressemblent DÉJÀ beaucoup aux leurs : on a l'essentiel. C'est de la **complémentarité, pas de la concurrence.**
>
> **Leçon du test A5 (V4 rejeté) : on a confondu "carte vivante" avec "carte chargée" — ce sont des OPPOSÉS.** "Jamais 1,2s sans mouvement" est LEUR philosophie d'outil de masse, PAS la nôtre. Notre principe : **mieux vaut voir peu que voir énormément.** On a empilé 6 éléments (drapeau + popup + arc + flux + texture + sprite) → illisible. Erreurs précises : labels Mines/Chimie ajoutés alors que la voix ne les dit pas ; cargo trop petit pour être identifiable = bruit.
>
> Source (À LA DEMANDE, jamais en mémoire de session) : `memory/archive/_r-and-d-mapanimation-PREMIUM-DECODE-2026-06-03.md` + `_r-and-d-mapanimation-catalog.json` + clips `out/_r-and-d/mapanimation/`.

### ⚠️ DIFFÉRENCE STRUCTURELLE : leur 2D-plat-satellite ≠ notre 3D-pitch-vectoriel (NON-NEGOTIABLE)

**Eux : carte 2D flat vue de dessus, souvent SATELLITE, beaucoup en 16:9.** **Nous : carte 3D avec pitch 28-38°, relief, drift caméra, fond navy vectoriel, souvent 9:16.** Conséquences directes :
- **JAMAIS copier un effet directement.** Tout se TRADUIT dans notre grammaire (navy/gold/vectoriel, pas leur satellite/rouge tactique).
- **Un sprite top-view (avion/bateau vu de dessus) est FAUX sur notre carte inclinée** — il ne colle pas à la perspective du pitch. C'est une raison technique de plus du rejet du cargo A5.
- **Notre relief + pitch + drift EST déjà notre anti-gris** — eux n'ont pas ça (carte plate morte), ils compensent par des objets. **Donc on a MOINS besoin d'ajouter qu'eux.** Notre carte est déjà vivante par sa 3D.
- Leurs fills satellite se re-colorisent toujours dans notre charte avant tout usage.

### Ce qu'on regarde VRAIMENT chez eux (l'œil d'Aziz)

Leur vraie force n'est PAS "faire apparaître des objets". C'est : **le SÉQUENTIEL maîtrisé** (plan stable, puis UNE chose se révèle au bon moment cadencée par le récit — jamais frénétique) + **le traitement de la COULEUR et des FRONTIÈRES** (c'est ça qui donne vie à la carte).

### Ordre de décision (le GATE qui évite le piège A5)

1. La complémentarité externe vient **EN TOUT DERNIER**, après que le beat passe déjà la self-review. Ne JAMAIS ouvrir le décode avant d'avoir une scène solide (sinon on code "vers" leur template → piège A5).
2. **Coût lisibilité 9:16** : en vertical, le seuil "trop chargé" arrive plus vite qu'en 16:9. Un élément de plus pèse double.
3. **TEST DE RETRAIT (filtre final)** : avant d'ajouter quoi que ce soit, se demander *« si je retire cet élément, la scène perd-elle en clarté narrative ? »* Si NON → ne pas l'ajouter. Ce filtre aurait tué le cargo et les labels Mines/Chimie d'emblée.

### Checklist (4 axes, en FIN de conception, scène déjà validée)

Une fois ma scène faite et mon playbook complet, je me demande — pour chaque axe : *« y a-t-il une variation qui enrichirait, lisiblement, en suivant la voix ? Sinon je ne touche à rien. »*
1. **COULEUR** — comment colorient-ils ? (frontières or, fills différenciés, plusieurs couleurs par pays — pas que de l'or uniforme). → ai-je une variation chromatique qui clarifierait le propos ?
2. **FRONTIÈRES** — comment les font-ils apparaître ? (dessin séquentiel, glow, radial — cf. leur *sequential glow + radial*). → un traitement de frontière servirait-il mieux que mon fill actuel ?
3. **CAMÉRA** — quel geste ? (on a 7 mouvements ; les leurs sont bons aussi). → y a-t-il un mouvement qui sert mieux CETTE voix ? **NB : caméra = drift continu lent, PAS un cut toutes les 1,5s.**
4. **OBJET / PROJECTION ORIGINALE** — un élément original justifié ? (ex. leur photo Trump réelle clippée dans la silhouette US ≈ notre `ImageProjectionFill`). → **SI oui : quelle taille pour être LISIBLE ? Et est-ce que ça suit la voix ?**

### Les 4 garde-fous ABSOLUS (les 3 premiers ont été violés en V4)

- ⛔ **PLAFOND DE SIMULTANÉITÉ (règle de JUGEMENT anti-A5, NON outillée).** En 9:16 : **MAX 2 couches narratives ACTIVES en même temps** (une "couche" = fill/texture, OU une plaque/popup, OU un flux/route, OU un drapeau, OU un objet mobile — le fond carte+drift ne compte pas). Le V4 A5 en avait 6 → illisible. Si on veut en introduire une 3e, une autre doit d'abord SORTIR. En 16:9 on peut monter à 3, mais le vertical sature plus vite.
  > ⚠️ **Honnêteté (audit 06-03) :** ce plafond N'EST PAS vérifié automatiquement — `mapbox-selfreview.py` ne sait pas compter les couches actives par frame. C'est une discipline de jugement humain, à recompter À LA MAIN dans le storyboard (champ 6 "Habillage" + champ 8 "Complémentarité") AVANT de coder. Ne pas se fier au script pour l'attraper. Les seules choses VRAIMENT outillées et bloquantes sont : E1 SFX-dans-Sequence, E2 vrais drapeaux, E3 frame-driven, E4 blur-SVG, E5 pas de CDN (voir `scripts/tools/mapbox-selfreview.py`).
- ⛔ **SUIT-IL LA VOIX ?** Un élément n'apparaît QUE si la narration le réclame. Jamais illustrer un concept que personne ne demande (erreur V4 : labels Mines/Chimie hors-script).
- ⛔ **EST-CE LISIBLE ?** Si on ne comprend pas immédiatement ce que c'est (objet trop petit, sprite top-view sur carte pitchée, tracé caché par un popup), c'est du BRUIT → on retire. **TEST DE RETRAIT : si enlever l'élément ne fait PAS perdre en clarté narrative, ne pas l'ajouter.**
- ⛔ **SÉQUENTIEL, PAS MÉTRONOME.** Plan stable + révélations cadencées sur la voix. Le mouvement sert le récit, il ne le remplace pas. Complémentarité, pas densité.

---

## 3. TEMPLATE STORYBOARD BEAT MAPBOX (le master)

> Phase 1 de `mapbox-session.py`. Remplir AVANT le code. **Règle d'or : aucune colonne ne doit rester vide.** Force à concevoir riche dès le départ (pas réparer après).

Par acte / beat :
1. **BEAT / TIMECODE** — ex: 00:12-00:16
2. **VOIX OFF** — texte exact (pour caler la synchro syllabe)
3. **MOUVEMENT CAMÉRA (DRIFT)** — ex: pano lent Est, bearing +0.1/frame. *Jamais statique.*
4. **ACTION SÉQUENTIELLE (FOCUS)** — ex: Mali s'allume gold sur le mot « Mali », puis Niger sur « Niger »
5. **SOLUTION ANTI-GRIS (FOND)** — ex: océan isobathes, voisins navy clair 10%
6. **HABILLAGE NARRATIF (MEUBLAGE)** — ex: ligne flux pointillés animés Dakar→Europe
7. **SFX / SOUND DESIGN** — ex: swoosh sourd sur mouvement caméra, tic élégant à chaque apparition
8. **COMPLÉMENTARITÉ EXTERNE (CQC, optionnel)** — APRÈS validation de la scène : une variation couleur/frontière/caméra/objet qui enrichirait, lisiblement, EN SUIVANT LA VOIX ? « aucune » est la réponse par DÉFAUT et la plus fréquente. On ne remplit ce champ que si l'ajout est justifié par la voix ET lisible (voir section 2bis + ses 3 garde-fous).

---

## 4. TECHNIQUES À TESTER (arbitrées Aziz 2026-06-01)

- **Extrusion 3D des polygones** — ✅ ADOPTÉE À TESTER. Effet « War Room / hologramme » navy+gold, abstrait premium (PAS Google Earth). Esprit du zoom sol 3D Beat 3 Maroc. `fill-extrusion` sur polygones plats.
- **Vidéo d'archives dans polygone** — ⏸️ BACKLOG R&D. Réserve Aziz : le problème n'est pas technique mais workflow — chercher/vérifier/couper des archives casse l'autonomie et force validation constante (droits, qualité). **Préférer les images statiques bichromie (P4)** qui donnent l'essentiel de l'effet sans le fardeau. Revisiter tôt ou tard, ou trouver une variante différenciante.

---

## 5. CE QU'ON FAIT BIEN DÉJÀ (à garder)

- Signature navy/gold reconnaissable (vs clones satellite)
- 1 seule Map continue (multi-lieux liés)
- Mouvements caméra cinématiques validés (Camera Lab v2)
- Whip pan 60f + blur sur distances intercontinentales
- Karaoké synchro forced-alignment

---

## Sources

- 6 réfs : Jacque a dit & similaires (Shorts, analysés 2026-06-01)
- Nos 4 : Or Africain, Sénégal Pétrole&Gaz, Maroc Beat0 Hook, Maroc Beat1 animatic A2
- Scripts : `scripts/tools/gemini-visual-playbook.py` (génération), `scripts/tools/gemini-mapbox-review.py` (review scorée)
- JSON bruts : `/tmp/playbook-appel1.json`, `/tmp/playbook-appel2.json` (temporaires)
