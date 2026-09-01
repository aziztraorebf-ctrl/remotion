# Layout : flex/grid qui RÉPARTIT, jamais des positions absolues posées à l'œil

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Symptôme récurrent (constaté par Aziz sur plusieurs sessions)** : « recentre la calebasse »,
« ce graphisme est mal placé », « c'est trop haut/bas » — Aziz doit régulièrement demander de
replacer des éléments qui n'étaient pas bien positionnés dès le départ.

**Cas déclencheur (2026-07-16, Beat 4 Sénégal Short D3, calebasse-dette)** : la calebasse
« flottait » trop haut dans le cadre 9:16. J'avais codé les 3 blocs (titre / calebasse / valeur
132%) en `position:absolute` avec des `top: 280` / `bottom: 340` posés au jugé. Aziz a demandé
si Tailwind aiderait à centrer. Réponse : **non, Tailwind ne change rien** — il donne juste des
noms courts aux mêmes propriétés CSS. Le vrai fix = remplacer les positions absolues par UN
conteneur `flex-direction:column` + `justify-content:center` + `gap` + `padding` (safe zones) qui
répartit et centre les blocs AUTOMATIQUEMENT. Résultat immédiat : tout centré, équilibré, sans une
seule valeur magique.

**Why** : une position absolue en pixels est un nombre DEVINÉ — elle « marche » à peu près sur un
layout donné puis casse au moindre changement (autre texte, autre taille d'élément, autre format).
Le CSS a un système fait exactement pour ça (flex/grid) qui calcule la répartition à ma place :
je décris l'INTENTION (« ces 3 blocs, centrés verticalement, espacés régulièrement, marges hautes/
basses = safe zones ») et le moteur place. Deviner les pixels = refaire à la main ce que le layout
engine fait mieux, et générer le symptôme « mal placé » qu'Aziz doit corriger. Ce n'est PAS un
débat Tailwind vs inline : les deux expriment le même flexbox ; pour du SVG frame-driven, l'inline
reste souvent plus lisible. L'outil n'est jamais la question — la MÉCANIQUE de placement l'est.

**How to apply** — pour TOUT placement de blocs dans un cadre (16:9 ou 9:16, tout beat/scène) :

1. **Réflexe par défaut = flex/grid, pas absolute.** Pour disposer plusieurs éléments (titre,
   visuel hero, chiffre, label, sous-titre), les mettre dans UN conteneur
   `{position:absolute, inset:0, display:flex, flexDirection:column|row, alignItems:center,
   justifyContent:center, gap:N, padding:safe-zones}`. Le moteur centre et répartit.
2. **`position:absolute` réservé à 3 cas légitimes** : (a) le FOND pleine page (grille, texture,
   `inset:0`), (b) un élément géo-ancré à des coordonnées SVG précises (marqueur sur carte, pièce
   d'un mécanisme dont la position EST calculée, pas devinée), (c) un overlay volontairement
   superposé (sous-titre karaoké en bas, badge coin). JAMAIS pour « poser » un bloc dans la
   composition générale.
3. **Zéro valeur magique en pixels pour du placement structurel.** Si je m'apprête à écrire
   `top: 280` ou `bottom: 340` sur un bloc de contenu → STOP, c'est le signal que je devine.
   Remplacer par un flex parent + `gap`/`justify-content`. Les seuls pixels admis = tailles de
   police, gaps, paddings de safe-zone (marges 9:16 : haut/bas ~120px ; 16:9 : cf. règles projet).
4. **Vaut horizontal ET vertical.** Le template `LaCalebasse` était en `flex-direction:row` (16:9,
   calebasse | valeur). Pour le 9:16 on passe en `flex-direction:column` (calebasse / valeur) — MÊME
   principe, juste l'axe qui change. Ne jamais reconstruire un layout vertical à coups de `top:`
   absolus parce que le template d'origine était horizontal.
5. **Vérifier au render que rien ne touche les bords** (safe zones respectées) — mais le centrage
   lui-même doit être GARANTI par le flex, pas ajusté après coup au pixel.

**Le geste qui change tout** : décrire l'intention de placement au layout engine (flex/grid), ne
jamais la traduire soi-même en coordonnées absolues devinées. Si je centre « à l'œil », je
prépare le prochain « recentre ça » d'Aziz.

Lié à [[SOUVERAIN-REMOTION-PLAYBOOK]] (composition : hero 40-60%, hiérarchie — ce feedback ajoute
la MÉCANIQUE de placement sous cette composition), [[feedback_animer-objet-mecanique-svg-verifier-par-calcul]]
(même esprit : laisser le système calculer plutôt que deviner — là c'était le pivot, ici c'est la
position) et aux safe zones 1920×1080 / 1080×1920 des règles techniques du projet.
