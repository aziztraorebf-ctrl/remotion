# ⛔⛔ Le fond de contrôle peut contenir le livrable PRÉCÉDENT — rendre le fond SEUL

> Vécu le 2026-09-04, chill-meter (contrat Upwork). Aziz a vu le défaut à l'œil et l'a nommé
> exactement ; je l'ai contredit sur la base d'une mesure juste mais portant sur la mauvaise couche.

## Ce qui s'est passé

Assemblage du nouveau device rustique. Pour juger sur le vrai décor (règle : « un overlay ne se
juge QUE composé sur le décor final »), j'ai composé mes rendus sur
`out/_r-and-d/chill-meter-upwork/envoi/entrance-4s-on-set.mp4`.

⛔ Ce fichier n'est PAS le plateau nu : c'est un rendu **déjà composé avec l'ancien châssis SVG**.
Les deux châssis s'empilaient — l'ancien dépassait en bas et à droite, sous forme d'une plaque
grise translucide aux arêtes nettes.

Aziz : « c'est juste que l'ancien overlay est encore là, c'est comme si l'ancienne version n'avait
jamais été supprimée. » **Exact.**

## L'erreur de méthode (la vraie leçon)

J'ai répondu en mesurant l'alpha de MON overlay : bbox stricte, 0 pixel opaque hors device,
détourage propre sur damier. **Toutes ces mesures étaient justes** — et sans rapport avec le
problème, parce que l'intrus n'était pas dans ma couche. Je n'ai jamais rendu le fond seul.

⭐ Une mesure juste sur la mauvaise couche produit une réfutation fausse avec l'apparence de la
rigueur. C'est plus dangereux qu'une absence de mesure : ça donne confiance dans l'erreur.

J'ai en plus fabriqué deux explications successives avant celle-là (« artefact de détourage »,
puis « c'est le gradient de BottomEdgeEffect ») — dont la première m'a fait corriger un vrai
problème annexe (le halo d'ombre passait en translucide), ce qui a **masqué** que le symptôme
principal persistait.

## Le réflexe à prendre

**Avant d'attribuer un défaut visuel à la couche qu'on vient d'écrire : RENDRE LE FOND SEUL.**
Trois lignes de PIL, et la question est tranchée sans discussion.

Corollaire : un fond de contrôle **hérité** (extrait d'un `on-set.mp4`, d'un composite archivé,
d'un rendu de session précédente) est suspect par défaut — il contient souvent le livrable
d'avant. Le vrai fond nu se nomme et se vérifie une fois pour toutes.
- ✅ chill-meter, plateau nu : `public/_shared/rnd/abigirl-decor.png`
- ⛔ PAS `out/_r-and-d/chill-meter-upwork/envoi/entrance-4s-on-set.mp4` (contient l'ancien châssis)

**Et quand Aziz décrit un symptôme visuel, sa description est une donnée d'observation, pas une
hypothèse à réfuter.** Ici « l'ancienne version est encore là » était littéralement vrai. Le
chercher d'abord dans SA lecture coûte 2 minutes ; le réfuter à côté en coûte 20.

Lié : [[feedback_rapport-vert-ne-prouve-rien-regarder-l-image]] ·
[[feedback_comparer-a-etat-egal-avant-d-attribuer-un-ecart]] ·
[[feedback_harnais-de-mesure-accuse-un-code-juste]]
