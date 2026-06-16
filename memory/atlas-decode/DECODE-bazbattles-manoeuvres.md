# DECODE — Vocabulaire de manoeuvre BazBattles (ref pour notre moteur "Order of Battle")

> Decode de 5 batailles BazBattles (Mons Alma, Volcaean Marshes, Teutoburg, Mons Graupius, Drava)
> le 2026-06-04. But : voler leur GRAMMAIRE TACTIQUE (chorégraphie), PAS leur esthetique (rectangles
> top-down = copier-coller sans identite, rejete par Aziz). On applique ce vocabulaire a NOS sprites
> lateraux + notre matiere parchemin. Voir [[feedback_atlas-bataille-multisprites-technique]].

## Decision de cap (Aziz, 2026-06-04)

- **Le bloc top-down = copier-coller BazBattles, sans identite.** Un rectangle reste un rectangle, on ne
  peut pas le rendre "Atlas". REJETE comme rendu final.
- **Le differentiel = NOTRE moteur de manoeuvre (pivot/flanc/charge/embuscade) applique a NOS sprites
  LATERAUX** (vue de cote, deja validee : bataille 2 armees, confrontation, drop). Le top-down avec sprites
  pixel = risque (perso vu du dessus = tache illisible ; c'est pour ca qu'eux utilisent des rectangles).
- **Ordre de travail** : (1) extraire refs [FAIT] → (2) POC v2 sprites lateraux + 1 manoeuvre →
  (3) si OK, bloc hybride zoom (large lisible → melee incarnee, le vrai differentiel qu'eux n'ont pas) →
  (4) en filigrane : inventer "le bloc a nous" (pas un rectangle — piste : plaque-etendard / banniere +
  silhouette de formation dans notre matiere).

## Vocabulaire de manoeuvre (la cible du moteur)

**Formations (etat statique d'une unite/ligne) :**
1. Colonne de marche — file serpentine sur route/riviere (Teutoburg, Drava). Narrative "en mouvement", vulnerable.
2. Ligne de bataille — unites alignees front a front, deploiement large (Mons Graupius).
3. Ligne courbe / arc — la ligne se cintre = enveloppement naissant (Mons Graupius, leur plus beau move).
4. Echelon — unites decalees en diagonale, attaque oblique d'un flanc (Teutoburg).

**Manoeuvres (mouvement) :**
5. Avance frontale — la ligne glisse vers l'ennemi en gardant le front.
6. Flanquement / enveloppement — etendre la ligne au-dela du flanc adverse et le replier.
7. Embuscade — unites surgissent perpendiculairement depuis les lisieres (bois sombres) des 2 cotes (Teutoburg).
8. Franchissement de riviere — colonne etiree qui traverse une ligne d'eau, fragile (Drava).
9. Repli / deroute — dispersion, perte d'alignement, fuite.

**Camera & echelle (a reprendre) :** alternance carte-strategique (territoire colore, villes labels dores,
plaque-portrait pentagonale du general) ↔ terrain tactique (sol par biome). Derive douce, jamais epileptique.

**Leur limite = notre ouverture :** zero incarnation (jamais un homme), camera rigide, toujours les memes
4-5 manoeuvres figees. On peut : incarner (sprites), changer d'echelle en fluide (large→melee), dynamiser
la camera, varier les tactiques. La ligne courbe d'enveloppement est leur sommet, et il est STATIQUE.

## Techniques moteur (derivees de notre bataille 2 armees, a generaliser)

- Etat d'unite = fonction pure de `frame` quand c'est derivable (file indienne, file→ligne en vague).
- Orientation DEDUITE du deplacement (dx/dy entre f et f-1) = anti-moonwalk universel. Vaut pour bloc ET sprite.
- BACKLOG multi-lignes sequentielles (rangs qui avancent pour combler les morts) = vrai moteur d'etat par
  soldat (vivant/mort/cible dynamique), pas derivable d'une fonction de frame. C'est LE palier difficile.

## Assets refs locaux

Videos 720p + frames + planches contact : `/tmp/bazbattle/{v1..v5}/` (ephemere). Re-extraire via yt-dlp si besoin :
IDs = Mons Alma vqFzTzlYUe8 · Volcaean -UsMhJizr_w · Teutoburg T5KEyOnk7Y4 · Mons Graupius ujIY99dwi5Y · Drava x2hZxIvX59M.

## POC en cours

- src/projects/atlas/_rnd/order-of-battle/UnitBlock.tsx + `OrderOfBattlePOC.tsx` — POC v1 (bloc top-down).
  Render `out/_r-and-d/order-of-battle/poc_v1.mp4`, catbox 4i2zfy. Verdict : concept echelle validE,
  esthetique rejetee (copier-coller). v2 = switch vers sprites lateraux + manoeuvre.
