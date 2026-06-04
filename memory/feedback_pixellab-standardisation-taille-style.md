# Feedback — Standardisation taille + style PixelLab (REGLE, 2026-06-04)

> Pointe par Aziz : nos assets oscillent entre 2 mondes (tailles + styles incoherents). Porteur Mali 56px /
> marchand berbere 68px (cartoon, peu detailles) vs soldats generiques 132-172px (tres detailles v3). Mis dans
> la meme scene = pas le meme univers. Voir [[feedback_pixellab-8-directions-manoeuvre]], [[ATLAS-PIXELLAB-PLAYBOOK]].

## Le fait technique (verifie doc MCP)

- `create_character size` = taille du PERSONNAGE, **plafonnee a 128px**. Le CANVAS est ~40% plus grand
  (pour loger l'animation). Donc canvas = size x ~1.4.
  - size 40 → canvas ~56 (= porteur Mali)
  - size 48 → canvas ~68 (= marchand berbere)
  - size 64 → canvas ~90 (NOTRE NORME, decidee 2026-06-04)
  - size 92 → canvas ~132 (trop gros — erreur faite sur les 1ers soldats generiques)
- Erreur passee : avoir demande size 92 → soldats 2x trop gros vs le reste du casting.

## REGLE DE PRODUCTION (durable, Aziz 2026-06-04)

1. **Taille canonique de TROUPE / personnages secondaires = `size: 64`** (~canvas 90px). Tous les persos
   "de masse" (soldats, foule, cortege, marchands) se generent a cette taille → coherence garantie entre scenes.
2. **Style de TROUPE = cartoon moins detaille** (comme porteur Mali / marchand berbere) : `mode standard`,
   `detail medium`, `shading basic`. Rapide, fiable (1 gen), sert notre esthetique. C'est LA norme.
3. **V3 / Pro tres detaille = RESERVE aux personnages PRINCIPAUX** (Mansa, Hannibal, un general nomme) — ceux
   sur qui on met l'emphase. PAS pour la troupe.
4. **La difference de detail = OUTIL NARRATIF** : au zoom, le heros detaille se distingue de la masse cartoon.
   C'est voulu, pas un defaut. (Idee Aziz — excellent.)
5. Consequence : le soldat generique v3 172px (d5d1677d / 7a3dafbf) = cas "perso principal", PAS norme de troupe.
   Pour Order of Battle (masse), regenerer un soldat standard size 64 si besoin de coherence stricte.

## A FAIRE quand on industrialise

- Champ taille a documenter dans ATLAS-ASSETS-INDEX (chaque asset : size demande + canvas reel).
- Au prochain batch de troupe : size 64, standard, et verifier la coherence visuelle cote a cote AVANT d'animer.
