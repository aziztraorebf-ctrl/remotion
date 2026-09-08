# Démontrer un overlay : CADRE PLEIN, jamais de zoom recadré

**Date** : 2026-09-07 · **Chantier** : chill-meter (contrat Upwork Abigail)

## Le fait

Pour récapituler 5 corrections client, j'ai monté une vidéo de 6 plans : zooms recadrés sur
chaque détail (le bandeau, les boutons, la base) + comparaisons avant/après en split.
Techniquement propre — annotations lisibles, aucun gel après correction, contenu vérifié.

**Rejetée par Aziz** : « c'est plus du statique, différents écrans qui défilent. C'est un peu
bizarre d'avoir aussi la vidéo réelle qu'on voit du coin de l'œil, mais qu'on ne voit jamais
vraiment. »

## Pourquoi

Un overlay se juge **à sa place et à sa taille réelles**. Le zoomer pour « mieux montrer le
détail » détruit précisément ce qu'on veut démontrer : comment ça s'intègre dans SON cadre,
à l'échelle où SON public le verra. Un zoom prouve que le pixel est correct ; il ne prouve
pas que l'objet fonctionne dans la scène.

⛔ Corollaire : une comparaison avant/après en split est du **matériel de diagnostic**, utile
en interne pour trancher un dosage — ce n'est pas une forme de démonstration.

## Comment appliquer

- ⭐ **La forme qui marche** (déjà validée sur les tests d'effets de cette même session) : le
  plan réel qui JOUE en cadre plein, l'objet à sa place, et les **annotations qui apparaissent
  en haut de l'écran** par-dessus. Rien d'autre ne bouge.
- ⛔ **Bannis dans une démo d'overlay** : zoom recadré, split avant/après, frame statique tenue
  plusieurs secondes. Si un détail est trop petit pour se voir en cadre plein, c'est une
  information sur le DÉFAUT (il est trop discret), pas une raison de zoomer.
- Le zoom reste légitime pour **une seule chose** : prouver une mesure dans un rapport interne
  (ex. « le texte est net »), jamais pour présenter un rendu.
- Voisin de [[petit-objet-ne-se-juge-pas-sur-frames-redimensionnees]] : là c'était « ne pas
  juger sur une frame réduite » ; ici c'est le symétrique — **ne pas démontrer sur une frame
  agrandie**. Dans les deux cas, la vérité est à l'échelle réelle.

## Piège technique rencontré au passage

`ffmpeg -f concat -c copy` a **figé l'image sur 12 s** (les 3 derniers plans ne jouaient pas)
tout en gardant une durée et un nombre de frames normaux — invisible sans contrôle.
→ Assembler avec le **filtre `concat` en réencodant**, et vérifier par échantillonnage dense
(1 frame/1,2 s, hashs tous distincts). Cf. la règle CLAUDE.md sur les assemblages.
