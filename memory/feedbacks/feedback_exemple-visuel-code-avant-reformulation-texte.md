Quand une demande visuelle abstraite (ex : "split-screen") est mal comprise **2 fois de suite**
par un agent malgre des clarifications textuelles successives, la reponse la plus efficace n'est
PAS une 3e reformulation en mots — c'est de retrouver un **exemple deja code dans le projet** qui
illustre la forme voulue, le **RENDRE** (mini-render de la Composition existante) et le
**REGARDER** (Read sur la frame), puis rebriefer l'agent sur cette base concrete.

**Why** : sur le Short CFA (2026-07-31), le terme "split-screen" pour le Beat Levier a ete
implemente par un agent comme un crossfade/morph entre un layout plein-cadre et des bandes
empilees (double-exposition confuse) — a l'oppose de ce que voulait Aziz. Deux tentatives de
clarification textuelle ont echoue a corriger le malentendu. La 3e tentative, en allant chercher
`src/projects/souverain/cacao-chocolat-short/beats/B2Source.tsx` (comparaison Cote
d'Ivoire/Ghana, deja publie), en rendant une frame et en la regardant AVANT de rebriefer, a
suffi a caler un brief sans ambiguite des le premier essai. Un exemple visuel deja produit dans
le projet vaut mieux que N reformulations textuelles — le vocabulaire visuel (comme
"split-screen") est trop polysémique pour etre desambiguise par du texte seul.

**Corollaire** : meme apres avoir trouve le bon **pattern structurel** (ex: colonnes fixes), il
faut separement verifier que la **semantique physique** de chaque element anime a l'interieur est
preservee — une structure spatiale correcte n'implique pas que le contenu anime soit correct. Sur
le meme Beat Levier, apres avoir corrige la structure (colonnes), 2 defauts distincts restaient :
l'onde de choc etait devenue verticale au lieu d'horizontale (orientation physique perdue dans la
recomposition), et aucune difference d'amplitude n'existait entre les 2 colonnes alors que c'est
le coeur de la demonstration narrative. Verifier structure ET semantique animee sont deux passes
distinctes, pas une seule.

**How to apply** : des le 2e echec de comprehension d'une consigne visuelle (pas le 3e — agir
tot), chercher `grep`/`find` un composant deja produit et publie qui illustre la forme demandee,
le rendre (`npx remotion still <id> --frame=N <out>.png`), le regarder, puis rebriefer en pointant
vers ce fichier + cette image plutot que de re-decrire en mots. Une fois la structure validee,
faire une passe separee de verification semantique sur chaque element anime cle (orientation,
amplitude, direction, timing relatif) avant de considerer la scene terminee.
