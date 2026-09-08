# PERSONNAGE VECTORIEL ARTICULE — dossier complet

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


---

## ⭐⭐⭐ 2026-09-05 — GPT-6 ASTRA SAIT RIGGER (2e appel sur son propre dessin)

**Le contexte** : test en 2 temps. (1) GPT-6 dessine une main statique — c'est la piece qui
a debloque le registre anatomie (cf. `TECHNIQUES.md`). (2) On lui redonne SON dessin et on lui
demande de le RIGGER.

**Le brief qui a marche** — nommer le probleme, pas la solution :
> « Un dessin se decoupe par ce qu'on VOIT (ombre, lumiere, reflet) ; un rig se decoupe par ce
> qui BOUGE (les articulations). Reorganise la matiere. »
Plus une exigence decisive : **livrer ses PROPRES poses de controle** dans le fichier, pour
qu'on teste sans deviner les angles. Test non biaisable.

**Livre** (328 s, 1,56 $) : 16 segments, hierarchie imbriquee reelle poignet > paume >
4 doigts x 3 phalanges + pouce x 2 (profondeurs 1 a 5), chacun avec
`transform="rotate(0 Cx Cy)"` ou Cx,Cy est le **centre articulaire**. Plus un bloc JSON :
pivots + parents, 3 poses de controle, limites articulaires, auto-verification.

**Mesures (SES angles appliques)** : poing 30 % plus court que main ouverte · poing vs
pouce leve = 1,88 % de pixels, isoles cote pouce · pivots justes (les doigts tournent autour
des articulations, pas autour du vide).

⛔⛔ **MAIS CE N'EST PAS UTILISABLE EN PRODUCTION** (verdict d'Aziz, 05/09) : en pleine
fermeture **les doigts se confondent, ca devient une bouillie illisible**. Blocs de phalanges
geometriques, raccords visibles aux commissures. **C'est une preuve de capacite, pas une
brique.** Ne pas le presenter comme « utilisable pour un geste ample » — c'est ce que j'avais
ecrit, Aziz l'a corrige.
⭐ Il avait annonce LUI-MEME ces defauts avant qu'on rende : « je n'ai pas observe les trois
poses rendues […] les fortes rotations peuvent exposer des calottes peu detaillees, des
ruptures de valeur, des chevauchements aux commissures ». **Exact.**

**Fichiers** : `src/projects/_shared/svg-library/gpt6-astra-2026-09/main-riggee/`
(SVG + `rig-data.json` + README) · animation : `src/projects/_rnd/main-riggee/`

### ⚠️ DEUX CONVENTIONS DE RIG COEXISTENT — ne pas les confondre
| | notre V2/V3 | GPT-6 |
|---|---|---|
| structure | groupes PLATS + `data-parent` / `data-pivot` | groupes **IMBRIQUES** + `rotate(A Cx Cy)` |
| gate | `_client-sim/perso-corps-entier/tools/test-rotation.py` (rejoue en FK) | ⛔ **incompatible** — le gate parse `data-parent` |
→ Si on reprend la voie GPT-6, **adapter le gate** ou demander la convention `data-parent`
dans le brief. Ne pas croire qu'un rig valide passera l'autre gate.

### La piste a explorer la PROCHAINE fois
Ne pas rigger APRES coup. **Demander le decoupage articulaire DES le dessin** — le probleme
vient de ce qu'on reorganise une matiere pensee pour l'oeil. Un dessin concu pour bouger
n'aurait pas ces raccords.
