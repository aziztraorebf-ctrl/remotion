# Hiérarchie figurant/héros — deux registres de personnages dans une même scène

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Idee d'Aziz (2026-07-28), validee sur rendu.** Dans une scene-lieu vivante, tous les
personnages n'ont pas besoin d'etre au meme niveau de detail. On melange DEUX registres :

- **Les FIGURANTS** : stick figures anonymes, silhouettes sombres, **boucles repetees**
  (marcher, porter sur la tete, decharger). Ils existent EN NOMBRE, pas individuellement.
- **Le ou les HEROS** (1-2 max) : meme squelette, mais **habilles** (tenue, coiffe, couleur,
  encre plus dense) et surtout dotes d'un **geste SINGULIER qui ne boucle pas** — il s'arrete,
  il regarde, il charge quelque chose. C'est le geste non-repete qui designe le personnage.

**Why:** c'est un procede narratif etabli (figuration au theatre, *hierarchie de traitement* en
animation : le niveau de detail signale l'importance narrative, l'oeil suit ce qui est le plus
defini). Chez nous il resout une contradiction reelle : [[stick-figure-profil-marche]] etablit
que le stick figure de profil marche bien, pendant que le personnage RICHE anime avait ete
ecarte en production (« pantin bien anime »). La hierarchie **evite de trancher** — le stick
figure devient le figurant, role ou son anonymat est un ATOUT et non une limite, et
l'investissement de detail se concentre la ou il est rentable. Elle regle aussi l'amelioration
n.3 relevee par Aziz (« personnages d'arriere-plan trop statiques ») : un figurant n'a pas
besoin d'etre vivant individuellement.

**How to apply:**
- Poser les figurants avec le socle nu (`<Figure>`), desynchronises par rapports irrationnels.
- Habiller le heros avec [[brique-habillage-stick-figure]] — JAMAIS un habillage improvise.
- ⚠️ **Garde-fou** : le heros doit etre plus defini que les figurants **mais pas plus que le
  decor**, sinon il se decolle et lit comme un sticker pose dessus. Rester dans la famille
  chromatique du decor.
- Le heros se distingue d'abord par son **geste**, ensuite par sa tenue. Une tenue sur un
  personnage qui fait la meme boucle que les autres ne cree pas de hierarchie.

Preuve : `src/projects/_rnd/svg-scenes/PortVivant16x9.tsx` (branche `rnd/port-decor-scene-vivante`).
Verdict Aziz : « techniquement au-dessus de ce que nous avions fait auparavant, beaucoup mieux ».

⏭️ Suite non faite : **varier les boucles des figurants** (porter sur la tete, brouette,
decharger) — aujourd'hui c'est 8x le meme geste de marche.
