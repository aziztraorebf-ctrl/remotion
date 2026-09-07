# Texture/matiere figee sur un asset fixe : tenter Gemini+extraction AVANT la segmentation manuelle

**Date** : 2026-09-07 · **Chantier** : chill-meter (contrat Upwork Abigail)

## Le fait

2 cas sur le MEME chassis metal (device-rustique.png), confirmes independamment :
1. **Rouille/teinte gunmetal** — deja resolu par cette technique avant ce chantier-ci.
2. **Bandeau "AbiGirl Reacts" allume en neon** — 2 methodes de segmentation manuelle
   (pochoir topologique par relief, filtres feComponentTransfer) ont echoue ou produit un
   resultat mediocre AVANT qu'on essaie Gemini i2i + extraction, qui a reussi du premier
   coup (avec 1 correctif d'intensite mineur).

Dans les 2 cas, le pattern gagnant est le meme : demander a Gemini de generer l'IMAGE
ENTIERE dans l'etat cible (texture rouillee / texte allume), puis EXTRAIRE le calque
(ce qui a change par rapport a l'original — `gen - orig`, restreint aux pixels deja
opaques dans l'original pour eviter le fond de studio parasite de Gemini), plutot que de
construire manuellement (masques SVG, filtres de couleur, segmentation par pixel) l'effet
recherche sur une texture organique complexe (metal grunge, relief, rouille).

## Pourquoi

Une texture organique complexe encode des regles implicites (comment la rouille se
propage, comment un relief embosse capte la lumiere) qu'il est couteux d'expliciter en
code — segmentation par seuil, top-hat morphologique, etc. Gemini connait deja ces regles
visuellement ; lui demander l'etat final et EXTRAIRE le delta transfere ce travail a un
modele qui le fait bien, au lieu de le re-derive nous-memes par tatonnement.

## Comment appliquer

- ⭐ Sur un brief impliquant une TEXTURE/MATIERE complexe sur un ASSET FIXE (pas anime en
  continu par un parametre code), tenter Gemini i2i + extraction de calque **AVANT** toute
  segmentation manuelle — pas apres 2 echecs. C'est l'inverse de ce qui s'est passe sur le
  bandeau (2 tentatives couteuses avant d'y venir, alors que le pattern etait deja
  valide sur le givre dans le MEME fichier).
- ⛔ **Limite structurelle, ne pas sur-generaliser** : ca marche parce que l'asset est
  STATIQUE (une image generee, un delta extrait, un fichier PNG fige reutilise partout —
  cf `GIVRE` dans ChillMeterRustic.tsx). Pour un effet qui doit varier en CONTINU selon un
  parametre pilote par le code (jauge qui monte progressivement, animation frame par frame),
  cette technique ne s'applique pas directement — rester en genratif/code, ou generer
  plusieurs paliers figes (comme les 3 planches givre-50/75/100) si l'effet le permet.
- Piege deja mesure a re-verifier a chaque fois : (1) Gemini ne preserve PAS la
  transparence de la reference — restreindre l'extraction aux pixels deja opaques dans
  l'original, sinon son fond de studio blanc se fait passer pour de la lumiere. (2) Une
  recoloration vers une palette cible peut ECRASER l'intensite du glow genere si mal
  ponderee (mesure : couleur au pic tombee de [115,244,255] a [86,150,180]) — preferer
  garder la couleur NATIVE de Gemini en majorite (ex: 85%) et ne deplacer la teinte que
  legerement, plutot que de forcer une valeur cible qui eteint l'effet.
- Verifier l'ALIGNEMENT PIXEL avant d'extraire (diff sur une zone stable, hors de l'effet)
  — Gemini peut deriver geometriquement sur d'autres taches (ex: police de substitution
  testee et abandonnee sur ce meme bandeau, derive d'une largeur de lettre mesuree).
