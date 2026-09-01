**Pour tout vetement, coiffe, accessoire ou objet tenu sur un stick figure, la brique EXISTE.**
Ne recalculez jamais hanche/epaule/tete a la main.

⚠️ **Ces fichiers existent dans les DEUX copies du socle** (synchronisees le 2026-07-28, `diff` vide) :
worktree `remotion-cfa` branche `rnd/stick-figures-gestes` (source de verite declaree du registre)
ET repo principal branche `rnd/port-decor-scene-vivante`. Chemin identique dans les deux.

- `src/projects/_shared/stick-figure-svg/habillage.ts` — `bodyPoints(phase, walkParams, torso)`
  rend les ancrages du corps avec les MEMES formules que `<Figure>` (bob compris). Son en-tete
  donne les 3 niveaux d'usage + les 4 regles d'occlusion + `LARGEUR_REF` + `ORDRE_HABILLAGE`.
- `src/projects/_shared/stick-figure-svg/identite/Roles.tsx` — 4 roles **deja faits** (mineur,
  commercante, fonctionnaire, agriculteur), 7 objets tenus (pioche, panier, registre, houe, sac,
  caisse, jerrican), `RoleTenue`, `RoleObjet`, `PersonnageRole` cle en main, `CARNATIONS`.

**⛔ L'ORDRE DE RENDU EST OBLIGATOIRE** (arriere -> avant) :
1. `<Figure ... hideArm1 />` — corps nu, **bras avant OMIS**
2. la tenue — recouvre buste/jambes/tete
3. l'objet tenu — sous la main
4. le bras avant **REDESSINE par-dessus** tenue+objet

**Why:** le 2026-07-28 (scene du port) j'ai improvise un habillage sans ouvrir `Roles.tsx`,
alors que [[STICK-FIGURE-INDEX]] le mentionnait explicitement. Resultat : une tunique de 22-29px
de large sur un buste de 6,6px et des bras de 5,9px = **occlusion totale du torse et des deux
bras** (mesure : zero pixel de corps entre y=904 et y=972), lue comme « deux personnages
superposes ». 3 tentatives ratees + 1 agent dedie, pour un bug que `Roles.tsx` documentait deja
et resolvait (« on voit le corps du stick figure A TRAVERS le vetement », corrige le 2026-07-27).
Cause racine : violation de la regle projet « ameliorer/reutiliser l'existant avant de creer » —
je n'ai pas CHERCHE avant de coder. Aziz l'a releve : « ca devrait etre une brique reutilisable,
pas se casser la tete a chaque fois ».

**How to apply:**
- Avant tout habillage : ouvrir `habillage.ts` (son en-tete donne 3 niveaux d'usage) puis
  `identite/Roles.tsx` pour voir si le role existe deja.
- Largeurs MAX mesurees, exportees dans `LARGEUR_REF` : demi-largeur vetement 5,2 a l'epaule /
  7,2 a la hanche. **Un vetement large est une occlusion, pas un style.**
- La tunique ne descend pas sous ~hanche+6 : plus bas elle masque le ciseau des jambes, et le
  mouvement des jambes EST la lecture de la marche.
- Le socle `StickFigure.tsx` porte desormais un pointeur en tete de fichier vers ces deux
  fichiers — on ne peut plus les rater en lisant le socle.

Lie : [[hierarchie-figurant-heros]] · [[bug-bras-lag-non-applique-socle]].
