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

## Corollaire UPLOAD — vérifier le lien que AZIZ reçoit, pas seulement mon fichier local (2026-07-17, R&D Vox)

**Erreur commise** : j'ai qualifié un asset (carte USA) de "superbe" en me fiant à ma lecture LOCALE du fichier, alors que le lien uploadé était corrompu chez Aziz (bandes vertes). Il a dû me reprendre 2 fois. Cause racine double : (1) le fichier était un JPEG déguisé en .png (voir `tools/gemini.md` gotcha magic bytes) ; (2) je livrais un lien sans vérifier son RENDU côté destinataire.

**Règle** : je livre un ASSET → je suis responsable du lien que Aziz reçoit, pas de mon fichier local.
1. Après génération image Gemini : vérifier magic bytes = extension (FF D8 FF=jpeg, 89 50 4E 47=png) AVANT d'uploader — un JPEG en .png = glitch au décodage.
2. Après upload : **télécharger le lien par GET réel et vérifier la taille** (`curl -s "$url" -o /tmp/check; stat -f%z /tmp/check`). NE PAS se fier au HEAD (catbox renvoie content-length:0 en HEAD même quand OK) NI à `Image.verify()` de Pillow (tolère les fichiers tronqués/mal typés). 
3. **catbox échoue SILENCIEUSEMENT** (rend une URL mais stocke un fichier vide) — observé 2× cette session. Ordre de fallback + gotchas (Vercel Blob durable priorité 1, uguu expire ~3h pas 72h, etc.) : voir `.claude/.../memory/feedback_upload-hosts-fallback.md` (source de vérité upload). uguu a bien marché cette session (`curl -F "files[]=@f" https://uguu.se/upload` → `.files[0].url`), toujours vérifier par GET réel.
4. En dernier recours si un lien bugge de façon inexplicable : ouvrir le fichier local dans Preview (`open f.png`) OU l'intégrer dans un mini-render pour qu'Aziz le voie autrement.

Ne jamais affirmer "cet asset est bon" sans avoir vu ce que le lien affiche réellement.
