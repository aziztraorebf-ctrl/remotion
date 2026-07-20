# Doctrine — Grammaire de mise en scène (Infographics Show + SimpleHistory, 2026-07-02)

> 5 épisodes réels analysés (yt-dlp + vision, 5 agents). Couvre la grammaire CAMÉRA/ORIENTATION/CADRAGE.
> Distincte de [[STRUCTURE-NARRATIVE-HYPOTHETICALLY]] (architecture narrative macro) et de
> [[SCRIPTWRITING-MASTER-STORYTELLING-HYPOTHETICALLY]] (écriture phrase par phrase).
> Frames sources : `out/_rnd/{infographics-show,simplehistory}-analysis/*/frames_sample/`.

## Règle centrale — marche en plan large : évitée SAUF si elle EST le sujet

Par défaut, la marche complète en plan large est évitée (même en 3/4) — remplacée par : personnage statique +
décor qui vit, véhicule qui glisse (notre patron `CargoVoyage16x9`, validé a posteriori), vignettes+flèche pour
une progression, foule = 1 pose dupliquée en registre, carte/flèches pour un déplacement géographique macro.

**Mais** : quand le déplacement LUI-MÊME est le message narratif (une colonne qui avance, un exode, une
invasion), les studios animent la marche pleinement, en registre, plan large tenu — parce que la progression
EST le point. Critère de décision : *le déplacement est-il ce que la scène raconte ?* Oui → marche assumée
(notre `StickRigMultiDir` 8-directions est l'outil pour ce cas, pas un travail gâché — ex. War-Map Sahel :
colonne AES en mouvement). Non → statique/véhicule/vignettes.

## Orientation — choisie par le SUJET du plan, pas par défaut

- **3/4** = défaut en dialogue/action humaine (personnage qui interagit avec qqch/qqn).
- **Profil** = défaut quand le sujet est une machine+opérateur à montrer ensemble en un seul plan (coupe de
  char, usine, navire) — le profil aligne humain et objet sans occlusion. Aussi : dialogue à 2 en
  champ-contrechamp, ou foule en registre répété.
- **Face pure** = réservée aux pics émotionnels/répliques-choc, jamais un personnage "normal" en action.
- **Dos** = outil ACTIF, pas une orientation à éviter : (a) point de vue empathique face à un danger/paysage
  (soldats de dos face à un convoi qui brûle — direct pour War-Map Sahel), (b) encadrement du sujet central
  dans un moment solennel (2 silhouettes de dos en amorce de chaque côté du cadre).

(Cette doctrine s'ajoute à — ne remplace pas — la règle pro dos/face de `PERSONNAGE-VIVANT-INDEX.md`, qui
reste vraie pour son cas d'origine : lisibilité des jambes à petite échelle, contrainte géométrique distincte.)

## Cadrage et rythme

- Buste/mi-cuisses = défaut pour tout dialogue (évite le problème jambes/marche à la racine).
- Cartons texte plein écran = respiration rythmique régulière, jamais 2 plans du même type consécutifs.
- Grading de palette (`lerpHex`, déjà notre outil) pour signaler un changement de registre à coût quasi nul —
  pas seulement jour/nuit : aussi un saut temporel entier (sépia=passé lointain vs palette actuelle).

## Techniques économes (SimpleHistory)

- Un élément de décor peut "avaler" un personnage pour éviter d'animer un impact/chute/mort (ne laisser
  dépasser que 1-2 extrémités).
- Cadrage POV (viseur, véhicule qui approche) pour suggérer un danger sans animer de combat.
- Combat/tension : personnage quasi statique, l'énergie visuelle vient des particules autour (fumée,
  étincelles, poussière) — pas du corps qui bouge.
- Symétrie de composition pour toute scène de groupe tendue (2 camps face à face) — la tension vient de la
  géométrie du cadre, pas du détail des poses.
- Master shot réemployé : construire 1 scène-clé avec soin, la redéployer avec seulement fond/éclairage/petit
  effet modifiés plutôt que refaire une nouvelle scène à chaque fois.

## Limite

~160 frames échantillonnées sur 5 vidéos (~57min cumulées), pas exhaustif — signal jugé solide car la vague 2
a explicitement cherché et trouvé des contre-exemples à la vague 1 (pas une simple confirmation en boucle).
