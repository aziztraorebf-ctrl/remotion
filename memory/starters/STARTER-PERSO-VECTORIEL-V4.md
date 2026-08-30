# STARTER — PERSONNAGE VECTORIEL ARTICULE (V4)

> Ouvert le 2026-08-29 en fin de session. **Reprendre ICI**, pas dans
> `STARTER-RIG-PERSONNAGE-EXISTANT.md` (qui raconte le detour par les rigs tiers, clos).

## OU ON EN EST — 3 versions, chacune meilleure ET moins bonne que la precedente

| Fichier (`src/projects/_client-sim/perso-corps-entier/assets/`) | Etat |
|---|---|
| `perso-neutre-v1.svg` | 11 calques, ~40 formes. Preuve que le brief structurel marche. |
| `perso-neutre-v2.svg` | 15 calques (marche possible), 100 formes. **Le plus beau corps**, mais silhouette en **Y** (jambes 2x trop fines). |
| ⭐ `perso-neutre-v3.svg` | 15 calques + **etats de visage**, 50 formes visibles. Proportions **colonne** corrigees, visage nettement meilleur — mais **3 regressions** (ci-dessous). |
| `tools/test-rotation.py` | ⭐ **GATE** : rejoue le rig en FK et rend les poses. A passer AVANT de valider tout personnage. |

⛔ **V3 n'est PAS strictement meilleure que V2.** Verdict d'Aziz : « il va falloir trouver
un COMPROMIS entre simplicite et beaute du dessin — le corps de la V2 etait peut-etre
meilleur ». Le « 50 formes » n'est pas un objectif absolu, c'est un curseur a re-arbitrer.

## ⛔ LES 3 REGRESSIONS = LE POINT DE DEPART DE LA V4

1. ⭐ **Au REPOS, les bras se fondent dans le torse** (meme couleur, colles au corps). Ils
   se lisent des qu'ils bougent — mais le repos est la pose la plus vue.
   Piste : liseré ou teinte de manche legerement distincte, **sans toucher au rig**.
2. **Le cou a quasiment disparu** (tete posee directement sur le pull).
3. **Les souliers sont devenus des SABOTS** (la forme hiker a perdu tout detail).

## ⭐⭐ LA CAUSE RACINE, ET LA DECISION D'AZIZ POUR LA V4

**Fable n'a JAMAIS eu de reference humaine DE FACE.** Verifie en RENDANT les 23 pieces du
corpus : aucune n'est un humain entier de face (mascottes, objets, vues 3/4 et profil). Les
3 versions ont transpose des largeurs depuis des vues non frontales — c'est la source
d'erreur residuelle sur le corps, reconnue par Fable lui-meme.

→ **DECISION D'AZIZ** : pour la V4, aller chercher des **personnages SVG libres de droits,
VUS DE FACE** (freepik/undraw/openpeeps/humaaans… a explorer). ⛔ Verifier la licence AVANT
de mesurer quoi que ce soit — et distinguer usage TEST (workspace) et usage LIVRABLE.

⭐ **La vue 3/4 / profil est voulue par Aziz** (« beaucoup de Lottie sont de profil : marche,
bras leves ») mais **APRES** la face — sinon on corrige deux personnages a la fois.

## CE QUI EST ACQUIS ET NE SE RE-DISCUTE PAS

- **Les 6 contraintes structurelles** (15 calques nommes, recouvrement >= 15 %, pivot au
  sommet, vetement solidaire, zero forme redessinee, pas de `<g>` dans `clipPath`).
  ⭐ C'est le **brief chiffre** qui a fait gagner Fable au concours a 4 modeles.
- ⛔ **Pas de degrades** — appel de Fable lui-meme (casserait l'aplat franc).
- ⭐⭐ **L'INTERDIT DE COPIE EST LEVE** (decision d'Aziz) : reproduire la **CONSTRUCTION**
  des pros (ratios, decoupage, plis, ombres, forme de soulier) est **demande**. Seules les
  **coordonnees** du Lottie restent interdites. Raison : on veut un **STANDARD
  REPRODUCTIBLE** (refaire ensuite une femme, un enfant, d'autres vetements).
- **Souliers** : forme hiker + teinte accent (pas la copie stricte, qui eteindrait le bas).
- **Etats de visage** : acquis (`tete-bouche-a/b/c`, `tete-paupiere-g/d`, `display:none`).

## LES CHIFFRES A NE PAS RE-CHERCHER

- Ratio qui compte : **deux-jambes-reunies / epaules** = **0,97** (douanier) · 0,45 (V2) · 0,85 (V3).
- ⛔ Le ratio **H/Wmax global est une MAUVAISE metrique** (depend de la pose : le douanier
  lui-meme est a 4,2 au repos). Trouve par Fable, garde.
- Economie : marcheuse **41 formes** · exercise 44 · douanier 106 (l'exception riche) · V2 100 · V3 50.
- Pieges de mesure : les **BORDS d'une manchette courbe** remontent plus haut que son centre ·
  **1 seul pixel d'anticrenelage** fait chuter une reserve mesuree a 3,5 %.

## LE PROTOCOLE QUI A FAIT LA DIFFERENCE (a re-imposer)

1. Fable **DESSINE**, il n'anime pas. 2. Iterations **rendu -> REGARD** (3 en V2, 7 en V3).
3. **test-rotation.py AVANT** de rendre la main. 4. Il a **refute deux de ses propres idees**
quand le rendu les contredisait — garder cette liberte.

## L'ANIMATION EXISTE DEJA (pour ne pas la re-coder)

Cycle de marche (48 frames) et salut (60 frames) rendus depuis le rig V3 par FK, en
**partitions** (tables de nombres) : `src/projects/_shared/stick-figure-svg/partitions/`
(`poses.ts` + `gestes.ts`). ⭐ Un geste = 5 a 7 cles, se REGLE en changeant un nombre.
Asymetrie montee vive / retombee molle deja integree.
