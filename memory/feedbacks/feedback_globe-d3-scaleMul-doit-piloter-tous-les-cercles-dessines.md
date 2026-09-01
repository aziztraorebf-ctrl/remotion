# Globe D3 — si UN SEUL cercle dessiné ignore `scaleMul`, le globe semble ne jamais bouger

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Le probleme** (2026-08-02, Gazoduc Acte 1, 4 iterations rejetees par Aziz avant diagnostic) : Aziz a
rejete 4 versions successives d'un beat globe D3 en disant "seul l'interieur du globe bouge, le globe
lui-meme ne bouge jamais". Les 4 iterations ont retravaille les KEYFRAMES caméra (amplitude scaleMul,
lissage de zigzag, amplitude lon/lat) sans jamais resoudre le symptome, parce que le vrai probleme
n'etait dans AUCUNE de ces valeurs.

**Cause racine (trouvee par un agent d'audit dedie apres 4 echecs)** : le composant calculait bien
`const globeR = GLOBE_R * cam.scaleMul` et l'utilisait CORRECTEMENT pour la projection D3
(`orthoAt(...).scale(globeR)`) — mais 4-5 elements SVG qui DESSINENT la silhouette du globe
(`clipPath` du cercle de clip, cercle atmosphere, cercle ocean, liseré/contour final, disque du
terminateur nuit) utilisaient encore la CONSTANTE `GLOBE_R` non multipliee. Mesure objective : le
diametre du globe a l'ecran restait a 868px ±1px sur 85 secondes completes, alors que `scaleMul`
variait de 1.2 a 4.0 dans le code (devrait donner un diametre de ~505px a ~1684px). Le contenu
GEOGRAPHIQUE a l'interieur (pays, arcs, drapeaux) est bien projete a l'echelle voulue par
`cam.scaleMul` — mais tout est CLIPPE et pose sur un disque fixe qui ne suit pas.

**Symptome trompeur** : sur le papier (keyframes lues dans le code), le mouvement semblait bien
dimensionne, parfois MEME plus ample que des beats Soudan juges dynamiques et valides par Aziz
(Gazoduc : scaleMul 1.2→4.0 = ratio 3.33x, lon/lat amplitude 25°/25° ; Soudan Acte 6 valide :
scaleMul 1.22→2.62 = ratio 2.15x, lon/lat amplitude 6°/8.7° seulement). Ca a fait perdre du temps a
retravailler le DOSAGE narratif (amplitude, lissage de zigzag, timing) alors que le vrai bug etait un
simple oubli de branchement, sans lien avec le dosage.

**Regle a appliquer desormais pour tout nouveau beat globe D3** :
1. Une fois `globeR` calcule, GREP TOUS les `GLOBE_R` restants dans le fichier — aucune occurrence
   de dessin (cercle, clipPath, terminateur) ne doit utiliser la constante brute une fois qu'on a un
   scaleMul variable. Seul l'IMPORT et le CALCUL de `globeR` lui-meme legitiment `GLOBE_R`.
2. AVANT de juger/presenter un rendu globe D3, MESURER objectivement le diametre reel du globe a
   l'ecran sur plusieurs frames espacees (methode simple : detecter les pixels non-fond sur la ligne
   mediane de l'image, cf script Python utilise dans cette session). Si le diametre ne varie presque
   pas (<5% d'amplitude) alors que `scaleMul` varie fortement dans le code, c'est CE bug — ne pas
   chercher ailleurs (dosage caméra, palette, contraste) avant d'avoir verifie ca en premier.
3. Comparer ce diametre mesure a une reference validee (ex Soudan Acte 6) : un beat globe reussi voit
   son diametre DEBORDER du cadre au pic de zoom (Soudan A6 : jusqu'a 1792px sur une image 1920px de
   large). Si le globe rejete tient toujours confortablement dans le cadre avec des marges constantes,
   c'est le signal du meme bug.

**Cout de la lecon** : 4 iterations completes (code + render + review) avant qu'un agent d'audit dedie
(pas une nouvelle tentative de fix a l'aveugle) trouve la cause en comparant frame par frame + grep
cible. Confirme la valeur du protocole CLAUDE.md "2 echecs -> agent de diagnostic dedie, NON-NEGOCIABLE"
— ici il aurait fallu le declencher des la 2e iteration rejetee, pas la 4e.

Lien : [[feedback_globe-d3-reutiliser-briques-exactes-pas-variante-maison]] (meme session, defaut
distinct mais complementaire — reutiliser les bonnes briques n'empeche pas un bug de branchement
local).

---

## ⭐ GENERALISATION (2026-08-15, Gazoduc Acte 4B) — la regle depasse le cas du globe

Le titre de cette fiche parle de cercles de globe, mais le principe vaut pour **TOUT element dessine
DANS un groupe `<g transform>` pilote par le zoom camera** :

> Un element dessine a l'interieur du groupe camera herite du `scale`. Ses proprietes d'EPAISSEUR
> (`strokeWidth`, taille de plaque/label, rayon de point) doivent donc etre **contre-echelonnees
> `/ cam.scale`**, sinon elles grossissent au resserrement au lieu de garder une epaisseur ECRAN
> constante.

**Cas concret nouveau** (Gazoduc 4B, carte D3 a scale 1.82) : frontieres, traces, nameplates et
impulsions — aucun cercle de globe. Sans contre-echelle, les frontieres epaississaient visiblement
pendant le zoom et les plaques devenaient enormes.

**Reflexe** : apres tout ajout d'un element dans un groupe camera zoome, se demander explicitement
« son epaisseur doit-elle rester constante a l'ecran ? » — si oui, `/ cam.scale`. Ne pas supposer que
seul le globe est concerne.
**Corollaire de cadrage** (meme session) : un cadrage camera decide **a l'oeil** laisse facilement une
moitie de l'image vide. Calculer la **bbox reelle des elements affiches** puis en deriver le cadrage —
meme pour un ajustement qui semble mineur.
