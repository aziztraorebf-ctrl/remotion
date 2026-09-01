# SVG DESSINATEUR — mémoire persistante

> Index de ce qui est acquis. Mis à jour en FIN de chaque mission (obligatoire).
> Détail des méthodes : `TECHNIQUES.md` · ⛔ ce qui ne marche pas : `ECHECS.md`.

## Ce que je sais faire (prouvé au rendu)

| Registre | Preuve | Fichier |
|---|---|---|
| **Objets d'interface** (médaille festonnée, bouton, carte cadeau, liasse de billets, coche) | 6 éléments, 23 groupes nommés, 11 dégradés — validés à l'œil contre une référence pro | `src/projects/_client-sim/repro-redeem/assets/planche-ui.svg` |
| **Main-curseur AVEC référence** (3 poses : repos, appui, pointe) | Contour continu unique par pose, pouce intégré, 0 id dupliqué — validée au rendu contre la référence (3 itérations) | `out/_r-and-d/concours-svg-ui/main-avec-ref/fable.svg` |

## Corpus de référence disponibles (⭐ les OUVRIR avant de dessiner dans ces registres)

- **Interface / app mobile** : 22 animations d'un studio qui en vit, démontées et mesurées.
  → `out/_r-and-d/corpus-kamotion/` · analyse : `memory/client-sim-tests/corpus-kamotion/CORPUS-REFERENCE-UI.md`
- **Mains / gestes de tap** : 17 pièces de banque téléchargées et mesurées.
  → `out/_r-and-d/banque-mains/` · ⛔ lire `ECHECS.md` § anatomie AVANT d'en dessiner une.

## ⭐⭐ PERSONNAGE VECTORIEL ARTICULE — 3 versions (2026-08-29) · REPRENDRE EN V4

> ⛔ **Ecrit par le coordinateur** : ma session a atteint sa limite avant que j'ecrive ma
> memoire. Contenu issu de mes 3 rapports + des mesures faites sur les rendus.
> ⭐ **Starter de reprise : `memory/starters/STARTER-PERSO-VECTORIEL-V4.md`** — l'ouvrir EN PREMIER.

**J'ai gagne un concours a 4 modeles** (meme brief, meme image-ref) contre Grok 4.6,
Gemini 3.1 Pro et GPT-5.6 Sol : le seul VRAI personnage. ⭐ Ce qui a fait la difference :
le **brief STRUCTUREL chiffre** + mes **iterations rendu -> REGARD** (3 contre 0 pour eux).

| Fichier (`src/projects/_client-sim/perso-corps-entier/assets/`) | Etat |
|---|---|
| `perso-neutre-v1.svg` | 11 calques, ~40 formes |
| `perso-neutre-v2.svg` | 15 calques (marche possible), 100 formes, **le plus beau corps** mais silhouette en **Y** (jambes 2x trop fines) |
| `perso-neutre-v3.svg` | 15 calques + **etats de visage**, 50 formes visibles, proportions **colonne** corrigees |
| `../tools/test-rotation.py` | ⭐ **GATE** — rejoue le rig en FK. A passer AVANT de valider |

⛔ **V3 n'est PAS strictement meilleure que V2** (verdict d'Aziz) : elle gagne proportions +
economie, elle PERD 3 choses. « Trouver un COMPROMIS entre simplicite et beaute du dessin —
le corps de la V2 etait peut-etre meilleur. » Le « 50 formes » est un curseur, pas une cible.

### ⛔ LES 3 REGRESSIONS = LE POINT DE DEPART DE LA V4
1. ⭐ **Au REPOS les bras se fondent dans le torse** (meme couleur, colles au corps) — ils se
   lisent des qu'ils bougent, mais le repos est la pose la plus vue. Piste : liseré ou teinte
   de manche distincte, **sans toucher au rig**.
2. **Le cou a quasiment disparu** (tete posee sur le pull).
3. **Les souliers sont devenus des SABOTS** (forme hiker videe de son detail).

### ⭐⭐ MA CAUSE RACINE, ENFIN NOMMEE
**Je n'ai JAMAIS eu de reference humaine DE FACE.** Verifie en RENDANT les 23 pieces du
corpus : aucune n'est un humain entier de face (mascottes, objets, 3/4, profils). Mes 3
versions ont transpose des largeurs depuis des vues non frontales.
→ **V4 : Aziz apporte des personnages SVG libres de droits VUS DE FACE.** ⛔ Verifier la
licence AVANT de mesurer. La vue 3/4 viendra APRES la face.

### CE QUI EST DECIDE, NE PAS RE-DISCUTER
Les **6 contraintes structurelles** restent (15 calques nommes · recouvrement >= 15 % ·
pivot au sommet · vetement solidaire · zero forme redessinee · pas de `<g>` dans `clipPath`).
⛔ **Pas de degrades** (mon propre appel : casserait l'aplat franc).
⭐⭐ **L'INTERDIT DE COPIE EST LEVE** : reproduire la **CONSTRUCTION** des pros (ratios,
decoupage, plis, ombres, forme de soulier) est **DEMANDE**. Seules les **coordonnees** du
Lottie restent interdites. Enjeu : un **STANDARD REPRODUCTIBLE** (refaire une femme, un
enfant, d'autres vetements). Souliers = forme hiker + teinte accent. Etats de visage acquis
(`tete-bouche-a/b/c`, `tete-paupiere-g/d`, `display:none`).

## 2026-08-31 — Chassis metal "Max Chill Factor Meter" (contrat Upwork reel)
- Livre : `out/_r-and-d/chill-meter-upwork/concours-metal/metal-fable.svg` — 2 variantes
  (brushed/machined), geometrie identique, 7 sous-groupes exiges chacun, 43 degrades prefixes.
- **A REUSSI la ou 5 modeles externes ont echoue** : matiere metal SANS perdre l'icy blue.
  Sat mesuree 0,320/0,325 (cible 0,32) en 2 iterations. Methode complete : TECHNIQUES.md
  § "METAL EN SVG". Generateur rapatrie : `.../concours-metal/fable/gen-metal-fable.py`.
- Prochain jalon probable : givre "physically attached" a poser sur ce chassis.

## 2026-08-31 — Spark starburst (2e contrat Upwork, app d'ecriture mobile)
- Livre : `out/_r-and-d/spark-upwork/spark-source.svg` (+ `gen-spark.py`, `NOTES.md`).
  18 rayons + 9 gouttes, 206 ids uniques, viewBox 400, zero `<filter>`.
- ⛔ **Dessine SANS le PNG du client** (jamais recu, verifie sur disque) — interpretation
  depuis une description textuelle. Signale en tete de NOTES.md.
- ⭐ **Rig de longueur = `scaleY` sur un `<g>` enfant**, le `rotate` de placement vivant sur
  le `<g>` PARENT. 1 seule valeur numerique par rayon, timings independants, marche pareil
  en GSAP et Remotion. Bat dasharray (impose une epaisseur constante — incompatible avec
  "rayons fins ET larges") et le morphing de `d` (recalcul par frame).
- ⭐ **Halo "non generique" sans filtre** : copie ELARGIE de la forme en jaune SATURE posee
  dessous. ⛔ Un halo large en jaune PALE a faible opacite composite en KAKI sur fond sombre
  (lit comme un contour sale) — serrer (x1,15-1,30) et saturer.
- ⭐⭐ **PROUVER LE RIG, pas seulement le dessin** : rendre le SVG avec des scaleY varies
  (l'etape "certains retractent pendant que d'autres grandissent"). C'est ce rendu-la qui a
  revele qu'un rayon retracte garde sa largeur pleine et lit comme un moignon — invisible
  sur le statique. Technique generalisable a tout livrable "structure pour animation".
- Detail des 4 iterations et de la regle "rayon fin" : TECHNIQUES.md § STARBURST.

## Projets en cours

- **repro-redeem** (2026-08-28) — reproduction d'un flux UI réellement vendu.
  Planche d'objets livrée ✅. Main : greffée depuis une banque, PAS dessinée (cf. `ECHECS.md`).

## Chiffres de référence du métier (mesurés sur du travail vendu)

- **~10 formes par objet** (227 chemins / 168 remplissages) — c'est de là que vient le relief.
- **86 %** de calques nommés chez le studio de référence. **Nous visons 100 %.**
- Durée médiane d'une pièce : **3,9 s** · format carré · 60 fps · **17 Ko**.
- **0** texte natif sur 848 calques : le métier livre du texte **vectorisé**.

## 2026-08-30 — Planche onboarding "Loop" (repro-onboarding, UI SaaS sombre)
- Livrable : `src/projects/_client-sim/repro-onboarding/assets/planche-onboarding.svg`
  (viewBox 1320x1180, 11 groupes de 1er niveau, 207 ids uniques, 175 formes, ZERO degrade,
  zero element interdit, zero balise <text>).
- Pieces (bbox MESUREES par rendu isole, toutes conformes au brief) :
  ecran-invite 500x1080 · ecran-reglages 500x1080 · e1-membre-1..6 420x55 (identiques) ·
  e2-toggle-off 58x32 · e2-toggle-on 58x32 (meme boite) · bouton-flottant 72x72.
- Le dossier contenait DEJA `assets/extraire-groupes.py` qui genere `planche.ts` depuis le SVG :
  il extrait l'INTERIEUR de chaque <g id> de 1er niveau. Consequence de DESSIN : le `transform`
  de placement sur la planche doit vivre SUR la balise <g> racine (il disparait a l'extraction),
  jamais a l'interieur. Verifie : le script retrouve bien les 11 groupes.
- 5 iterations rendu->regard. Aucun des defauts corriges n'etait visible sans le rendu.
