---
name: Review MP4 soi-même AVANT de présenter à Aziz — frames à chaque seconde
description: Toujours extraire et lire les frames du render avant de l'uploader ou présenter. Jamais présenter un résultat sans l'avoir regardé. Erreur commise sur Beat 5 Zimbabwe v1.
type: feedback
---

# Review obligatoire avant présentation

**Erreur commise** : Beat 5 Zimbabwe v1 présenté à Aziz sans review des frames. Layout désaligné, carte trop petite, tiers inférieur vide. Découvert par Aziz, pas par Claude.

## Règle

**Avant tout upload catbox ou présentation à Aziz, Claude DOIT :**

1. Extraire minimum 4-5 frames espacées uniformément :
```bash
for t in 02 05 08 11 14; do
  ffmpeg -i out/beat.mp4 -ss 00:00:$t -vframes 1 /tmp/frame_${t}s.png -y 2>/dev/null
done
```

2. Lire chaque frame avec le Read tool

3. Répondre honnêtement à ces questions avant de continuer :
   - La zone utile de l'écran est-elle bien remplie ? (pas de tiers entier vide)
   - Chaque élément est-il à la bonne position relative aux autres ?
   - La carte / silhouette est-elle assez grande pour être lisible sur mobile ?
   - Les textes sont-ils alignés de façon cohérente (pas dispersés aléatoirement) ?
   - Les deux colonnes sont-elles équilibrées visuellement ?

4. Si une réponse est NON → corriger AVANT de présenter

## Piège des coordonnées JSON de 3.1-pro

Les positions XY dans le breakdown JSON de 3.1-pro sont **conceptuelles**, pas testées sur 1080x1920. 3.1-pro peut donner `top: 730` pour un élément qui devrait être à `top: 400` sur l'écran réel. **Toujours ajuster après le premier render en regardant les frames.**

## Grille de référence 9:16 (1080x1920)

```
Zone utile : y=200 → y=1720 (ne pas mettre d'éléments hors zone)
Centre vertical : y=960
Split vertical : x=540
Colonne gauche : x=20→510 (largeur effective 490px)
Colonne droite : x=570→1060 (largeur effective 490px)
Marges latérales min : 20px chaque côté
```

Carte pays minimale pour être reconnaissable sur mobile : **400px × 400px minimum**.

**Why:** Aziz a dit "je pense que tu n'as pas pris des frames de la vidéo en tant que telle". C'est exact — j'avais pris 2 frames mais pas regardé les 5 premières secondes. L'erreur de positionnement est évidente dès la frame 2s.

**How to apply:** Systématique après chaque render. Pas optionnel. Même pour une "correction rapide".
