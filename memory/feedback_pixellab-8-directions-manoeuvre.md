# Feedback — PixelLab 8 directions = decision de creation, pas un ajout (2026-06-04)

> Pointe par Aziz pendant le POC "Order of Battle" (manoeuvres facon BazBattles avec nos sprites lateraux).
> Voir [[DECODE-bazbattles-manoeuvres]], [[feedback_atlas-bataille-multisprites-technique]], [[ATLAS-PIXELLAB-PLAYBOOK]].

## Le fait (verifie doc MCP + asset reel, pas suppose)

- `animate_character` accepte **8 directions** : south, north, east, west, south-east, south-west,
  north-east, north-west. On peut animer direction par direction (param `directions: [...]`).
- MAIS le nombre de directions est **fixe a la CREATION** du personnage (`create_character n_directions: 4|8`).
  Un perso cree en 4 dir n'a PAS les rotations diagonales → on ne peut pas lui animer de diagonales.
- Modes `pro` et `v3` de `create_character` sont **toujours 8 directions** (et meilleure qualite).
- Verifie sur soldat-mali (ID d378d0f2-2704-4f4e-bf60-3a8475b2fb16) : `directions: 4`, `view: side`.
  → reste bon pour scenes simples est/ouest, mais PAS extensible aux diagonales sans recreation.

## Pourquoi ca change la donne (Aziz a raison)

Les manoeuvres militaires (enveloppement, echelon, charge oblique, contournement) sont **DIAGONALES
par nature**. Avec 4 directions, un flanc "contourne" a plat (profil seulement) → on ne sent pas qu'il
tourne dans l'espace. Avec les diagonales (NE/SE/NO/SO), une aile qui s'enroule SE VOIT tourner.
C'est le deblocage qui fait passer notre moteur de "2 lignes plates" a "manoeuvre 3/4 credible".
Constate a l'ecran sur le POC v2 (flanc plat, faute de diagonales).

## REGLE DE PRODUCTION (durable)

- **Tout nouveau perso destine a une scene de MANOEUVRE/BATAILLE → creer en 8 directions** (n_directions: 8,
  ou mode v3/pro qui le sont d'office). Le surcout de creation est justifie : sans diagonales, pas de manoeuvre.
- Perso destine a un deplacement simple lineaire (marche A→B, drop, confrontation frontale) → 4 dir suffit.
- Decider 4 vs 8 AU MOMENT de la creation, jamais apres. On ne peut pas "ajouter" des directions ensuite.
- `AtlasPixelChar.direction` est type 4 dir actuellement → a etendre aux 8 (south-east, etc.) quand on
  produit le 1er perso 8-dir. Convention dossiers : `animations/<anim>/<dir>/frame_NNN.png` (dir incluant les diagonales).

## Etat POC Order of Battle au moment de cette note

- v1 bloc top-down : concept echelle OK, esthetique rejetee (copier-coller BazBattles). catbox 4i2zfy.
- v2 sprites lateraux + flanquement : incarnation validee (differentiel vs BazBattles), MAIS flanc plat
  faute de diagonales → confirme le besoin 8 dir. catbox iiu9kn.
- v2 peaufine (camps teintes SVG or/crimson, melee qui mord, choc localise, sol enrichi) : catbox jybbr1.
- PERSOS 8-DIR CREES (v3, generic antique teintable, size 92→canvas 172) :
  - `side` ID **d5d1677d-20d4-4c59-be30-32325043eafe** → 8 rotations DL `public/atlas-order-of-battle/characters/soldat-generic-side/`. Qualite excellente (casque plumet, bouclier rond, lance, tons neutres). Rotations nettes, diagonales coherentes.
  - `low top-down` ID **7a3dafbf-ff98-4cec-9d70-6188d3bc890b** → en test comparatif (vue 3/4 RPG vs side).
  - DECISION Aziz : tester les DEUX vues cote a cote sur la meme manoeuvre pour trancher.

## RETOURS AZIZ sur v2 (a corriger dans la prochaine version)

1. **Lignes qui se confondent au contact** : bite trop fort + pas de distance de garde. → reduire bite,
   garder un GAP DE CONTACT (~1 lance d'ecart, l'espace ou l'action a lieu). BazBattles ne chevauche JAMAIS.
2. **Contournement / 2e ligne = "assez bon"** (coeur du differentiel valide). Parasit e par le chevauchement → gap reglera.
3. **Soldat qui tombe au bon moment = aime** (technique death play-once + animStartAt, acquis bataille 2 armees).
4. **Anim "course" en pleine melee = bizarre** : l'aile de flanquement passe `charge` au hit → doit passer
   `spear_attack` comme le reste a l'IMPACT. La course = pour le TRAJET de contournement seulement.

## ETAT GENERATIONS (2026-06-04, session en cours)

3 soldats generic antique teintables crees (memes prompt) :
- **side v3** : d5d1677d-20d4-4c59-be30-32325043eafe (172px). walk E/W/SE DL. Artefact lance visible (profil).
- **low top-down v3** : 7a3dafbf-ff98-4cec-9d70-6188d3bc890b (184px). walk E/W/S/SE DL, N/NE/NW/SW en cours.
- **low top-down standard** : 090ebcc0-0fb3-4cbe-82b9-c30e85115e6e (132px, 1 gen, rapide). walk E/W/S en finalisation, attack(v3 spear) en cours, death a lancer.
- **high top-down standard** : 9818acf0-acb9-47f7-a283-eaecfbd089fc — EN CREATION (test 3e vue, demande Aziz).
Dossiers DL : `public/atlas-order-of-battle/characters/soldat-generic-{side,topdown}/`. Standard a DL sous `soldat-generic-standard-td` (a faire). High td : `soldat-generic-high-td` (a faire).
Scenes test : SquareWalk (carre octogonal 8-dir) + Showcase (walk->attack->death) dans `_rnd/order-of-battle/SquareWalk.tsx`. Compos Root : SquareWalkV3/Std, ShowcaseV3/Std.
⚠️ PixelLab "heavy load" frappe : jobs lents/echecs aleatoires. Standard mode = 1 gen, plus fiable que v3 (2-9 gen).

## DECISION VUE (en cours)

- Aziz penche TOP-DOWN (masque l'artefact lance). Teste low vs high vs side.
- INSIGHT CLE (a gtransmettre) : la "hauteur" = 2 choses distinctes. (1) Hauteur CAMERA dans la scene Remotion =
  libre, gratuit, code (zoom/tilt). (2) Angle de DESSIN du sprite (view side/low/high top-down) = GRAVE a la
  generation PixelLab. Monter la camera sur un sprite `side` ne donne PAS une vue de dessus — il faut GENERER
  en high top-down. Donc l'effet "vu de dessus facon BazBattles" = view=high top-down, pas un reglage camera.
- Compromis high top-down : masque le mieux les artefacts MAIS risque de perdre l'incarnation (tache compacte,
  retour vers le "presque rectangle"). low top-down : garde l'humain. Piste : garder les 2 selon l'echelle
  (high = vue d'ensemble large lecture-carte ; low = plan rapproche incarne). A TESTER pour trancher.
- Mode : standard 8-dir (1 gen, style classique, lisible en masse) probablement retenu vs v3 (detaille, lent).

## VUE PixelLab — question Aziz (importante)

`side` expose les imperfections (pas jamais pixel-perfect). Hypothese forte : `low top-down` (3/4 RPG ~20°)
montre mieux l'ESPACE (manoeuvre/flanquement credible) ET masque les imperfections de pas (angle plongeant)
tout en gardant l'incarnation. 4 vues PixelLab : side / low top-down / high top-down / oblique (BETA 4-dir
seulement → ecarte car on veut 8 dir). high top-down = risque de retomber dans le "presque rectangle".
→ Test comparatif side vs low top-down en cours pour trancher LA vue du catalogue Order of Battle.
