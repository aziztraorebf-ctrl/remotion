# Une occlusion impossible se mesure dans le DECOR, pas dans le dosage du polygone

**Date** : 2026-09-06 · **Chantier** : chill-meter (contrat Upwork Abigail)

## Le fait

Un jury de 4 LLM a conclu qu'un objet incruste « flottait » et qu'il fallait une
OCCLUSION PARTIELLE (un bout de decor passant devant le bas de l'objet). **4 tentatives
successives ont echoue**, chacune produisant une amputation asymetrique (coin bas-gauche
tranche, bouton coupe, cote droit intact). Chaque echec a ete traite comme une erreur de
DOSAGE du polygone : arete trop basse, puis trop haute, puis « la pente est inversee ».

La 5e passe a mesure le DECOR lui-meme (segmentation couleur + RANSAC, 3 methodes,
5 seuils, RMS 0,4 px). Verdict : **la surface n'existe pas**. Le panneau du piano couvre
x=109..356 ; l'objet va de x=188 a x=716. Les 2/3 droits n'ont AUCUN element de premier
plan. Toute occlusion fidele au decor est donc NECESSAIREMENT asymetrique — et une
asymetrie sur un objet symetrique se lit comme une amputation.

Bonus : la note « la pente descend vers la gauche », qui avait guide 2 essais, etait
FAUSSE. L'arete est plate (+1,2 px sur 130, soit 0,54 deg). Ce qu'on prenait pour une
diagonale etait le FLANC ombre du meuble — un autre objet.

## Pourquoi

Quand un effet echoue en produisant a chaque fois le MEME symptome geometrique
(ici : asymetrie), le reflexe est de corriger les valeurs. Mais un symptome geometrique
constant est la signature d'une CONTRAINTE du decor, pas d'un mauvais reglage. Aucune
valeur ne peut faire apparaitre une surface absente de la plaque.

## Comment appliquer

- ⛔ Avant de doser un effet qui depend d'un element du DECOR (occlusion, reflet, contact,
  ancrage), **MESURER que cet element existe et sur quelle etendue** — en pixels, sur la
  plaque reelle. Avant le 1er essai, pas apres le 4e.
- Un symptome qui se REPETE a l'identique malgre des valeurs differentes = contrainte
  structurelle. Arreter de doser, aller mesurer la source. (Voisin de
  [[correction-appliquee-a-moitie-etendre-a-tous-les-derives]], ou le symptome CHANGE :
  la, c'est un fix partiel ; ici il ne change pas, c'est une impossibilite.)
- Une lecture a l'oeil sur une bande zoomee peut confondre 2 objets (arete du panneau vs
  flanc du meuble). Une mesure par colonne les separe. Ne pas graver une geometrie lue a
  l'oeil dans un starter : elle sera reprise comme un acquis. C'est ce qui s'est passe.
- **Le moyen propose par un jury n'est pas l'exigence.** Le jury demandait « ne pas
  flotter » ; l'occlusion n'etait que sa solution. Quand le moyen est impossible, revenir
  a l'exigence et chercher les autres indices (ombre de contact, reflet, coherence de
  lumiere) — pas abandonner l'exigence.

## Corollaire trouve dans la foulee

Les 2 ombres de contact etaient centrees sur la ligne de sol, alors que le chassis est
opaque jusqu'a cette ligne : leur moitie haute etait **cachee derriere l'objet**. Presentes
dans l'alpha (donc « codees »), invisibles a l'ecran. → Verifier qu'un effet est VU, pas
seulement qu'il est rendu : mesurer l'assombrissement reel du decor dans le composite.
Voir [[rapport-vert-ne-prouve-rien-regarder-l-image]].
