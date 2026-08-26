# STARTER — Lottie : le CONTRÔLE QUALITÉ, puis Khartoum au banc d'essai

> Réécrit le **2026-08-26** en clôture (remplace la version « texte + animation », dont les
> deux objectifs sont **FAITS**). Branche du chantier : `feat/lottie-texte`.
> ⚠️ Aziz sera **absent et sans accès à Creator** au début de la prochaine session.

## À copier-coller en début de session

```
Session Lottie, suite du 26 août. DEUX chantiers, dans cet ordre, et PAS PLUS
(décision d'Aziz : ne pas se disperser, ne pas tout faire d'un coup).

1. LE CONTRÔLE QUALITÉ AUTOMATIQUE — la priorité, et de loin.
   Comparer la VIDÉO Remotion d'origine à l'animation Lottie, IMAGE PAR IMAGE,
   et refuser quand l'écart dépasse un seuil.
   ⛔ Pourquoi c'est le manque le plus grave : le 26/08, TROIS fois, un fichier
   était valide, `check_animation.py` disait « ça bouge », et le rendu était
   FAUX (pointillés ignorés · animations perdues au regroupement · fondu en
   marches d'escalier). À chaque fois, seul l'OEIL l'a vu.
   La cause est structurelle : on compare une IMAGE FIXE à une IMAGE FIXE.
   C'est exactement ce qui a laissé passer une courbe FIGÉE pendant deux jours.

2. KHARTOUM AU BANC D'ESSAI, avec ce vérificateur.
   UNE seule scène, mais celle qui contient tout.

Lire d'abord : memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md
(table de décision + ce qui reste ouvert).
```

## ⛔ Ce qu'Aziz a corrigé le 26/08 — à ne pas refaire

**« 746 compositions » est un chiffre SANS VALEUR.** J'ai proposé un banc d'essai sur tout le
repo ; Aziz a repris : la bonne question n'est pas *combien* mais **lesquelles méritent le test**.

⛔⛔ **Une carte géographique complète n'est PAS un livrable Lottie.** J'ai passé une journée à
finir la carte de l'Afrique du Nord (Gazoduc Acte 4) en croyant produire une pièce vendable.
Personne ne commande ça en Lottie. Le format lui-même le disait : Creator ouvre en **512×512**,
notre carte 1920×1080 débordait de partout.
→ **Prouver une capacité technique ≠ produire un livrable.** J'ai confondu les deux.

⭐ **Ce qui vaut le test, dans les mots d'Aziz** : des scènes qui **racontent avec des objets qui
bougent** — jetons, chars, avions, bannières, une ligne qui se déforme, du texte en situation
(pas 100 % du texte). Registre : dashboards et UI, logos, icônes, schémas, objets isolés.

## Les 4 scènes retenues — une par MUR (⚠️ dans `src/projects/warmap/`, pas `souverain/`)

| Scène | Composition | Ce qu'elle teste | Mesuré |
|---|---|---|---|
| ⭐ **Khartoum État-Major** | `KhartoumEtatMajorSVG` | **jetons** + texte en situation + filtres | 908 lignes · 9 `<text>` · **10 filtres** · 12 dégradés · 18 anims |
| **Front Ouvert** | `FrontOuvertSVG` | **les masques** (dernier gros refus) | 318 lignes · **6 masques** · 5 dégradés |
| **Gazoduc Signature** | (voir `src/Root.tsx`) | le **mouvement pur** | 385 lignes · **41 anims** · 0 texte · 0 filtre |
| **Aéroport** (déjà converti) | — | la **densité** / regroupement | 498 calques `path-248`, illisibles |

⭐ **Commencer par Khartoum** : elle cumule presque tous nos points durs, donc elle dit le plus
en une fois. ✅ Vérifié : **zéro Mapbox** dans ces trois `.tsx` → SVG pur, donc convertibles.
⛔ Ne pas ouvrir les 4 chantiers : « si j'ouvre quatre chantiers, j'en finis zéro ».

## Ce qui est FAIT le 26/08 (ne pas re-prouver)

| Acquis | Preuve |
|---|---|
| **TEXTE — 2 voies** | vectorisé 1,95 % (fidèle partout) · natif `ty:5` 0,05 % **mais 5,74 % sans la police** — pire que ne rien porter. Nos scènes écrivent en Georgia (412×) : **aucune** des 17 familles de Creator → vectoriser par défaut |
| **POINTILLÉS** | 0,07 % (2 valeurs) · 0,10 % (4 valeurs) |
| **Scène dense animée** | Gazoduc A4 : 108 éléments → 5 groupes, 7/7 frames distinctes |
| **PIÈCE LIVRABLE** (`finir_piece.py`) | maison-gaz : 1346×805, 9,6 s, 6 blocs, **16 Ko** en `.lottie` — validée par Aziz dans Creator |
| **Courbe VIVANTE** | recalcul de forme porté : 28 keyframes, pointe finale exacte |
| **Flux dans le tuyau** | pointillés défilants, 5 périodes, mesuré (277→355→307 px ambrés) |
| **Fondu de bord** | masque à dégradé reproduit par empilement : marche 27 → **4** |

## ⛔⛔ LES PIÈGES DE LA SEMAINE — tous de la MÊME famille

**L'élément est correct, c'est son AIGUILLAGE qui l'annule.** Fichier valide + rapport content
+ rendu faux. **Aucun n'a été trouvé par un rapport — tous à l'OEIL.**

1. **`nm` n'est pas décoratif** — lottie-web en fait une **clé d'objet**
   (`Object.defineProperty(dashOb, shape.d[i].nm, …)`, `lottie.js` v5.13 l.15497). Deux `nm`
   identiques → exception **asynchrone** dans `initExpressions` : le player **fige**, `DOMLoaded`
   jamais émis, **ni erreur console ni pageerror**. Symptôme : `TimeoutError` Playwright.
2. **Le regroupement jetait les animations** — `group_layers` ne recopiait que les formes et
   ignorait `ks` : 23 opacités et 9 tracés **perdus**. `check_animation` disait quand même
   « ça bouge ». L'histoire était détruite pendant que la mesure disait OK. → corrigé + test.
3. **`stroke-dasharray` ignoré en silence** — un tracé « projet prévu » ressortait **plein**,
   donc « construit » : **le sens de la carte changeait**.
4. **Une heuristique juste devient fausse ailleurs** — `est_un_fond` ne jugeait que la TAILLE ;
   la courbe animée, devenue large, était prise pour un fond et exclue du cadrage, en silence.
5. **Constantes lues dans le FICHIER CONVERTI au lieu du CODE SOURCE** (X1=984 au lieu de 1560) :
   la courbe s'arrêtait à mi-parcours. **Toujours lire la source.**
6. **Un commentaire de code peut être PÉRIMÉ** — « le fil ne croise JAMAIS la courbe » est FAUX
   dans le rendu actuel. Aziz avait raison contre le commentaire. Vérifier le RENDU, pas le texte.
7. **Plus ≠ mieux** — 8 tranches de fondu donnaient un résultat **pire** que 4 (marche 7 vs 4)
   pour 40 % de poids en plus. **Mesurer, ne pas supposer.**

## Ce qui est POSSIBLE SANS AZIZ ET SANS CREATOR

✅ **Tout l'outillage** : `python3 test_texte.py` (20 tests), `test_rendu.py`, `test_svgpath.py`.
✅ **Vérifié** : **AUCUN script ne dépend de Creator** — toute la chaîne (conversion, mesure,
rendu, comparaison) tourne avec Chromium en local. Creator ne sert qu'à la validation d'Aziz.
✅ Extraire n'importe quelle composition (`extract-remotion-svg.mjs`), convertir, grouper,
animer, finir, mesurer, produire une planche de contrôle.

⛔ **CE QUI EXIGE AZIZ** : dire si c'est **beau**. Je mesure, je ne juge pas à sa place.
⛔ **Creator n'a AUCUN outil d'import ni d'export** — c'est manuel, toujours.

## Décisions en attente d'Aziz (ne pas trancher seul)

1. **L'ouverture de la maison** : elle démarre à moitié dessinée (`--amorce 40`). Options :
   écran noir franc (`--amorce 0`) ou silhouette lisible (actuel).
   ⚠️ **Mesuré : entre les deux, rien d'utilisable** — à 12 % on voit des fragments épars qui
   se lisent comme un bug. C'est 0 ou ~40, pas de milieu.
2. **Outiller encore, ou vendre ?** ⚠️ **La vraie réserve à reposer** : on outille beaucoup et
   **rien n'a encore été montré à un client**. Le risque n'est pas technique, il est là.

## Livrables sur disque et en ligne

- 📁 `out/_r-and-d/lottie-maison/maison-gaz-facture.json` + `.lottie` — **la pièce validée**
- 📁 `out/_r-and-d/lottie-texte/` — sondes texte, planches de comparaison
- 📁 `out/_r-and-d/lottie-a-tester/` — les 6 pièces des sessions précédentes
- 🔗 Maison finale (CORS OK, importable dans Creator) :
  `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/lottie/2026-08-26c/maison-gaz-facture-BjFjDYyQ1J2B4TZYE1rlvyxiUimOXy.json`

⚠️ **Import dans Creator = URL HTTPS publique AVEC CORS** → `scripts/tools/upload-to-blob.py`
(uguu.se n'a pas de CORS · localhost refusé). Toujours vérifier `content-length` après upload.

## Outils du chantier — `src/projects/_client-sim/lottie-ui/tools/`

`svg2lottie_scene.py` (conversion + rapport · `--texte vectorise|natif`) ·
`svgtext.py` (polices, glyphes) · `group_layers.py` (calques → blocs nommés) ·
`animate_scene.py` (partitions) · `finir_piece.py` (cadrage/ouverture/fin) ·
`transcribe_animation.py` (recalcul de forme) · `compare_render.py` (**la seule preuve**) ·
`check_animation.py` (⚠️ dit « ça bouge » même quand l'histoire est détruite — cf. piège 2) ·
`extract-remotion-svg.mjs` (Remotion → SVG résolu à une frame).
