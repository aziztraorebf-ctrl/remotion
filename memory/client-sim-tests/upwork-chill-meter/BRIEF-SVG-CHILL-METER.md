# BRIEF SVG — "Max Chill Factor Meter" (appareil retro-futuriste givre)

## CE QU'ON DEMANDE
Reproduire **le plus fidelement possible** l'appareil de l'image de reference fournie, en **UN SEUL
fichier SVG statique**, decoupe en groupes nommes, **PRET A ANIMER**.

⛔ **TU NE CODES AUCUNE ANIMATION.** Zero `<animate>`, zero `<animateTransform>`, zero `<style>`
global, zero classe CSS, zero JS, zero `style=""` inline sur un attribut destine a etre anime.
Tout en ATTRIBUTS XML. C'est NOUS qui animons depuis React/Remotion.
Un SVG "magnifique mais d'un seul tenant" = echec complet, pas un demi-succes.

## L'OBJET
Un detecteur de frissons ("chill meter") facon appareil de mesure retro-futuriste, en metal sombre
patine, entierement givre, avec un ecran retroeclaire bleu glace. C'est un habillage de marque pour
une chaine YouTube de reactions musicales.

Viewbox impose : `0 0 1448 1086`. Fond TRANSPARENT (aucun rect de fond opaque).

## LES GROUPES ATTENDUS — noms EXACTS, non negociables

| `<g id="...">` | Contenu | Comment NOUS l'animerons |
|---|---|---|
| `chassis` | corps metallique principal, rivets, vis d'angle, tuyaux/details lateraux, plaques | statique (base) |
| `plaque_titre` | la plaque en surplomb portant "AbiGirl Reacts" + 2 flocons | opacite/lueur |
| `titre_texte` | le texte "AbiGirl Reacts" seul (neon bleu) | opacite (allumage) |
| `ecran` | la dalle sombre retroeclairee + son cadre interne | opacite/teinte |
| `sous_titre` | "MAX CHILL DETECTION" + 2 flocons lateraux | opacite |
| `graduation` | 0 / 25 / 50 / 75 / 100 + tirets + ligne de regle | opacite |
| `gauge_track` | le rail/cadre vide du bargraph (contour seul, SANS les segments) | statique |
| `seg_00` … `seg_25` | **26 segments individuels** du bargraph, chacun son `<g>` | on les allume 1 par 1 (opacite) |
| `legende` | "0 = NO CHILL \| 100 = MAX CHILL" | opacite |
| `panneau_power` | le boitier lateral droit + label POWER + grille de ventilation | statique |
| `bouton_power` | UNIQUEMENT la pastille verte + son halo | opacite/pulsation |
| `boutons_bas` | les 5 boutons STATUS / DATA / HUD / CALIBRATE / ABOUT | opacite |
| `frost_layer` | **TOUT le givre** : crustage blanc-bleute sur arêtes, coins, vis, joints | `opacity="0"` — on le revele progressivement |
| `icicles` | **TOUS les glacons pendants**, chacun dans un sous-`<g id="icicle_00">`… | `opacity="0"` — croissance individuelle |

## LES 6 REGLES DU CONTRAT "PRET A ANIMER"

1. **Un `<g id="...">` par element qui devra bouger separement.** Respecter EXACTEMENT les noms ci-dessus.
2. **Tout element destine a TOURNER ou GRANDIR a son origine locale (0,0) SUR son axe** — via
   `transform="translate(cx cy)"` sur le groupe, enfants dessines autour de l'origine.
   → **s'applique aux glacons** : chaque `icicle_NN` doit avoir son origine a son POINT D'ATTACHE
   (en haut), enfants dessines vers le bas en y positif. Ainsi un `scale(1, k)` les fait POUSSER.
3. **Chaque etat alternatif est un groupe SEPARE superpose**, jamais un dessin "moyen".
   → le `chassis` est dessine **PROPRE, SANS givre**. Le givre vit uniquement dans `frost_layer`.
4. **Les elements a reveler sont livres `opacity="0"`** → `frost_layer` et `icicles`.
5. **Ce qui progresse est dessine PLEIN sur toute sa longueur utile** — nous en revelons une portion.
   → les 26 segments sont tous dessines ALLUMES ; nous eteindrons ceux du dessus par opacite.
   ⛔ Ne PAS livrer un bargraph "a moitie rempli".
6. **Zero `<animate>` / `<style>` / classe / JS / `style=""` inline.** Tout en attributs XML.

**+ un commentaire XML en tete** listant chaque groupe : ce qu'il est, et comment on est cense l'animer.

## FIDELITE VISUELLE — ce qui compte le plus
L'image de reference a une **matiere** que le trait plat rate. Priorites :
- **metal sombre patine avec du RELIEF** : degrades, aretes biseautees, rivets et vis en volume,
  reflets speculaires. Pas d'aplat gris uniforme.
- **le neon bleu doit IRRADIER** : empiler plusieurs passes (halo diffus large + halo proche +
  corps colore + **coeur blanc fin** — c'est le coeur blanc qui fait "allume" et non "peint").
- **le givre doit sembler ACCROCHE au metal**, pas pose a plat : cristaux irreguliers qui epousent
  les aretes, coins et vis, avec des epaisseurs variables.
- palette : bleu glace / cyan / blanc / metal argente-sombre. **Le vert est reserve au SEUL bouton power.**

## TEXTES EXACTS (accents et casse a respecter)
- Plaque du haut : `AbiGirl Reacts`
- Sous-titre : `MAX CHILL DETECTION`
- Graduation : `0` `25` `50` `75` `100`
- Legende : `0 = NO CHILL | 100 = MAX CHILL`
- Panneau lateral : `POWER`
- Boutons du bas : `STATUS` `DATA` `HUD` `CALIBRATE` `ABOUT`

## LIVRABLE
UN fichier `.svg` valide (`xmllint --noout` doit passer), autonome, sans dependance externe,
sans police exotique (utiliser des familles generiques type `Impact, 'Arial Black', sans-serif`).
