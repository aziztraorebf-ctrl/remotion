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

## Projets en cours

- **repro-redeem** (2026-08-28) — reproduction d'un flux UI réellement vendu.
  Planche d'objets livrée ✅. Main : greffée depuis une banque, PAS dessinée (cf. `ECHECS.md`).

## Chiffres de référence du métier (mesurés sur du travail vendu)

- **~10 formes par objet** (227 chemins / 168 remplissages) — c'est de là que vient le relief.
- **86 %** de calques nommés chez le studio de référence. **Nous visons 100 %.**
- Durée médiane d'une pièce : **3,9 s** · format carré · 60 fps · **17 Ko**.
- **0** texte natif sur 848 calques : le métier livre du texte **vectorisé**.
