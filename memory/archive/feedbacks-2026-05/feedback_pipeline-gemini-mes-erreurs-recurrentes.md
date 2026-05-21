---
name: Pipeline Gemini-pro — mes erreurs récurrentes à éviter
description: Pendant Niger uranium Jour 7, Aziz m'a corrigé 4-5 fois sur des erreurs systématiques quand j'exécute le pipeline Gemini-pro. Ces patterns reviennent. Liste à scanner AVANT chaque nouveau beat.
type: feedback
---

# Mes erreurs récurrentes avec le pipeline Gemini — checklist anti-récidive

**Validée Aziz Jour 7 (2026-05-10) sur Niger uranium Beats 2, 5, 7.**

Aziz : *"as-tu sauvegardé les leçons que tu as apprises pour ne plus les refaire dans toutes les fois que j'ai dû te reprendre, tes déviations du storyboard, etc ?"*

Cette mémoire est ma **checklist personnelle anti-récidive**. À scanner AVANT de coder chaque beat Souverain.

## Erreur #1 — Ajouter du bruit éditorial Atlas dans Souverain

**Ce que je fais mal** : par réflexe Atlas, j'ajoute des bandeaux header décoratifs ("LE NIGER DOIT TENIR"), des sub-labels explicatifs ("SOLDATS · INSURRECTION NORD"), des captions bottom qui paraphrasent la voix-off ("ORANO — APPROVISIONNEMENTS DIVERSIFIÉS").

**Ce qui se passe** : Aziz me les fait retirer un par un. Trois retraits successifs sur Niger uranium = pattern systématique.

**Pourquoi c'est mal** : Souverain a déjà voix-off + sous-titres karaoke. Tout overlay texte redondant = bruit, pas signal.

**Anti-récidive** : appliquer le test 3 questions de `feedback_souverain-inserts-utilite.md` AVANT d'ajouter tout overlay texte. Default = ne pas ajouter.

## Erreur #2 — Garder du code legacy au lieu de copier le pattern qui marche

**Ce que je fais mal** : quand un beat existe déjà en v1 et que je dois le refondre, je garde la base technique de v1 (style Mapbox `light-v11` brut, zoom approximatif, pas de projection explicite) au lieu de **copier le pattern d'un beat qui marche déjà** (Or Africain Beat 3a/3b/4 avec Mercator + Caspian + hide symbols).

**Ce qui se passe** : Beat 5 v2 = globe Mapbox au lieu de Mercator parce que j'ai oublié `projection: { name: "mercator" }`. Aziz a dû me reprendre.

**Anti-récidive** : quand je code un beat Mapbox, **commencer par lire le code d'un beat Mapbox déjà validé** (Or Africain Beat 3a/3b/4 ou Niger Beats 1, 4, 6). Copier-coller le bloc setup `mapboxgl.Map({...})` et la séquence `style.load`. Adapter les coords et layers, pas l'archi technique.

## Erreur #3 — Générer les assets comme des composants isolés au lieu de scènes complètes

**Ce que je fais mal** : quand le storyboard Gemini montre une composition (sujet + fond + objets), je découpe en plusieurs PNG transparents (soldat seul, sacs seuls, fond dunes séparé) que je recompose en CSS layers.

**Ce qui se passe** : la composition flotte, ne semble pas ancrée, on dirait des stickers collés sur un fond. Aziz a dit *"l'image du haut, tel que Gemini l'a dessiné, est beaucoup plus premium à ce que toi tu as fait peut-être avec le background"*.

**Anti-récidive** : quand le storyboard montre une scène complète, **générer un seul PNG par scène** (sujet + fond intégré). Le fond doit être dans la même image que le sujet, pas séparé. Le panneau ressemble à une affiche éditoriale finie, pas à un collage.

## Erreur #4 — Timing serré sur le mot final au lieu de préparer le mot-pivot

**Ce que je fais mal** : pour les animations qui culminent sur un mot-pivot ("Canada", "Kazakhstan"), je déclenche tout l'événement visuel exactement sur ce mot. Résultat : l'animation arrive en même temps que le mot et finit après que le mot est passé.

**Ce qui se passe** : *"les flèches apparaissent vers les deux dernières secondes, à peine le temps de voir l'animation se déclencher"*. Aziz veut voir l'animation **respirer** avant et pendant le mot.

**Anti-récidive** : déclencher la **préparation visuelle** (arc qui se trace, halo qui grandit) ~8 secondes AVANT le mot-pivot principal, sur un mot-pivot antérieur. Quand le mot-pivot principal arrive, ne plus faire un "déclenchement" mais un **highlight pulse** (halo élargi, opacité boost) sur l'élément déjà présent.

## Erreur #5 — Labels gold sur fond crème (illisibles)

**Ce que je fais mal** : pour styler les labels NIGER/CANADA/KAZAKHSTAN sur la carte Caspian Sepia, j'utilise du texte gold `#c29b26` directement sur le fond terre crème `#ede5d3` ou sur le pays highlighted lui-même en gold. Contraste insuffisant.

**Ce qui se passe** : *"le nom du pays est là, mais peut-être parce que le nom du pays est dans la map aussi, et la typographie qui est utilisée, fait en sorte que c'est très très dur à voir"*.

**Anti-récidive** : pour TOUT label sur carte Caspian Sepia, utiliser le **template plate dark navy** :
- Rectangle `fill="#0d1525"` opacity 0.92
- Barre verticale gold (3px) sur le côté gauche (ou droite si plate décalée à gauche)
- Texte blanc IBM Plex Mono pour le nom principal
- Sous-titre gold IBM Plex Mono pour les précisions (mine, ville)
- Positionné AU-DESSUS du dot (translate Y négatif)
- Décalé à gauche du dot quand le pays est près du bord droit du viewport

Voir `feedback_split-screen-souverain-template.md` pour le code SVG canonique.

## Erreur #6 — Ne pas vérifier le rendu visuel avant d'annoncer le succès

**Ce que je fais mal** : je rends une vidéo, je vois que le rendering n'a pas crashé, j'annonce "Beat 5 livré" et j'envoie à Aziz. Sans avoir extrait des frames pour vérifier que ça matche le storyboard.

**Ce qui se passe** : Aziz découvre que la carte est un globe au lieu d'un Mercator, que les flèches sont invisibles, que le caption bottom rentre en conflit avec les sous-titres. Aurais pu détecter ça avec un coup d'œil aux frames extraites.

**Anti-récidive** : APRÈS chaque render, AVANT d'envoyer à Aziz :
1. Extraire 5-6 frames clés via ffmpeg (`select='eq(n\,X)+eq(n\,Y)+...'`)
2. Lire chaque frame avec le Read tool pour analyse visuelle
3. Comparer mentalement avec le storyboard cible
4. Identifier les écarts AVANT qu'Aziz ait à le faire
5. Soit corriger immédiatement, soit signaler honnêtement les écarts dans le message à Aziz

C'est la règle CLAUDE.md "Review visuelle AVANT Kimi (NON-NEGOTIABLE)" — je dois l'appliquer aussi avant validation Aziz, pas juste avant Kimi.

## Récap workflow corrigé

Pour chaque nouveau beat Souverain pipeline Gemini :

1. **Lire les memoires** : `MEMORY.md`, `feedback_souverain-inserts-utilite.md`, `feedback_split-screen-souverain-template.md`, ce fichier
2. **Storyboard Gemini i2i** avec refs Or Africain V5
3. **Breakdown Gemini 3.1-pro** multimodal → JSON
4. **Asset generation** : PNG full-scene si scène complète, PNG isolé seulement si vraiment isolé (icone discrète)
5. **Code Mapbox** : copier le pattern d'un beat validé (projection mercator + Caspian + hide symbols)
6. **Coords** : MCP Mapbox geocoding, jamais hardcodé
7. **Plates labels** : template dark navy + barre gold + blanc IBM Plex Mono
8. **Timing arcs** : ~8 secondes pour respirer, pulse halo sur mot-pivot principal
9. **Test 3 questions inserts** : pour chaque overlay texte, vérifier non-redondance avec voix-off
10. **Render + extraction frames + review visuelle PERSONNELLE avant envoi Aziz**

**Why:** quatre versions Beat 5 et trois corrections Beat 2 / Beat 7 ont produit cette liste. Si je scanne ces 6 erreurs avant chaque beat, je peux économiser 2-3 itérations.

**How to apply:** Cette mémoire est à charger AVANT tout nouveau beat Souverain pipeline Gemini. Aziz a explicitement demandé que les leçons soient sauvegardées pour ne plus les refaire.
