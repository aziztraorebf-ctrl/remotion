# Un objet illisible sous certains angles = défaut de GESTE, jamais un dosage

**Date** : 2026-08-25 · **Cas** : clé 3D de `PremiumCard3D` · **Coût** : 3 rendus complets

## Le symptôme
Sur un objet 3D en rotation continue, la clé **se lisait comme un TOURNEVIS sur 3 frames sur 4**.

## Le réflexe évité (de justesse)
Re-doser : monter la lumière, épaissir l'anneau, changer le matériau. C'est-à-dire **chercher un réglage pour
un problème qui n'en a pas**. C'est exactement la boucle des 4 itérations du globe D3 (2026-08-02).

## La cause réelle, structurelle
**Une clé n'est PAS lisible sous tous les angles.** De face, l'anneau se confond avec la tige : la silhouette
devient un bâton. Ce n'est pas un défaut du modèle, du matériau ou de l'éclairage — c'est de l'**occlusion
géométrique**. Et **un tour complet traverse forcément ces 2 angles morts** : aucun réglage ne les supprime.

## Le fix
**Changer le GESTE, pas le réglage** : au lieu d'un tour complet, faire **osciller** l'objet autour de son
angle 3/4 lisible (`READABLE = 0.85` rad). L'angle mort n'est jamais traversé.

## La règle généralisable
> ⛔ Avant de re-doser l'apparence d'un objet en mouvement, **mesurer sa silhouette sous les angles réellement
> traversés par le geste**. Si un angle produit une silhouette ambiguë, c'est le GESTE qu'il faut redéfinir
> (amplitude, plage angulaire, point de repos) — pas la lumière ni la matière.

**Test opérationnel** : rendre l'objet aux 4 angles cardinaux du geste (banc type `keys/KeyBench.tsx`) et se
demander à chacun « qu'est-ce que je reconnais ? ». Si la réponse change d'objet, le geste est faux.

⭐ **Corollaire de production** : ce défaut est **incorrigible dans un pipeline vidéo** (asset mp4 figé),
corrigible en une ligne chez nous. La clé de la vidéo de référence a le MÊME défaut, sans recours.
C'est un argument de vente, pas seulement un bug.

## Famille
`feedback_camera-a-coups-easeinout-par-segment` · `feedback_re-mesurer-l-entree-avant-de-re-doser-un-placement`
· `feedback_geste-sans-but-est-une-boucle-decorative`.
