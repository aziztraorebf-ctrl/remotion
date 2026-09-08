# Une ligne de sol qui vit comme un NOMBRE ne pose rien a l'ecran

**Vecu 2026-09-06, contrat chill-meter (Abigail/Upwork).** La cliente redemandait pour la
3e fois que le device « ne flotte pas », en precisant « **especially once animated** ».

## Le faux diagnostic (ecrit dans le STATUS, jamais mesure)

« Ses mots sont *once animated*, le statique est prouve pose, donc c'est le rebond d'entree
qui ne retombe pas exactement a 0. » Hypothese plausible, elegante — et **fausse** :
- spring (damping 11) : **0,000 px de residuel des la frame 80**, sous-pixel des la 43 ;
- sur le clip REELLEMENT envoye : device **immobile au pixel pres de la frame 48 a la fin**
  (bas a y=1045 sur 72 frames consecutives).

## La vraie cause, visible en REGARDANT l'image

Le device ne flottait pas au sens d'une oscillation : **il ne reposait sur rien**. Arrete a
20 px au-dessus de la bande noire, en plein mur rose, **sans ombre, sans surface, sans contact**.

⭐ `RUSTIC_SOL_SCREEN` etait **calcule dans le code mais cable a AUCUN element dessine** :
```
const RUSTIC_SOL_SCREEN = RUSTIC_POS_Y + RUSTIC_SOL_Y * RUSTIC_SCALE;  // 0 usage
```
Une ligne de sol qui existe comme une constante, que rien ne materialise. Le commentaire
au-dessus disait « cale sur le SOL du device, sa demande n6 est qu'il ne FLOTTE pas » — la
regle etait ECRITE, le calcul JUSTE, et le resultat visuel inexistant.

⛔ **Meme schema que le bug du globe D3** (4 cercles SVG figes sur une constante au lieu de
suivre le zoom reel) : le nombre est bon, le cablage manque. Un commentaire qui affirme une
intention n'est pas une preuve que l'intention est rendue.

## Ce qui pose reellement un objet

Pas le recalage vertical (deja juste) : **l'ombre de contact**. Dimensionnee sur l'empreinte
REELLE au sol (mesuree dans le PNG : x 131..1039 a y=717 = 908 px, et non la largeur totale
du chassis, 1099 px aux epaulements). Elle se resserre en s'assombrissant a l'atterrissage —
c'est ce COUPLE etalement/densite qui fait lire l'appui ; une ombre d'opacite constante suit
l'objet sans jamais le poser.

## Les 2 lecons

1. ⛔ **Une constante geometrique non referencee est un defaut, pas un reliquat.** Grep les
   usages d'une constante de calage avant de conclure que le calage est fait.
2. ⛔ **Le client decrit un SYMPTOME avec les mots qu'il a** (« flotte », « once animated ») ;
   ces mots orientent vers une cause plausible qui peut etre la mauvaise. Mesurer la grandeur
   qu'il nomme (le mouvement) ET **regarder l'image** — c'est l'image qui a donne la cause,
   la mesure n'a fait qu'eliminer la fausse piste.

Voir [[feedback_mesurer-la-bonne-grandeur-pas-la-plus-facile]] ·
[[feedback_globe-d3-scaleMul-doit-piloter-tous-les-cercles-dessines]] ·
[[feedback_rapport-vert-ne-prouve-rien-regarder-l-image]]
