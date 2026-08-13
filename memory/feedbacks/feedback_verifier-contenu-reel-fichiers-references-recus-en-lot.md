---
name: verifier-contenu-reel-fichiers-references-recus-en-lot
description: Quand plusieurs fichiers de référence (images/vidéos) sont reçus en lot dans un même message, vérifier le contenu réel de chacun (frame extraite) AVANT de leur assigner un nom de travail — ne jamais se fier à l'ordre d'envoi ou une impression rapide.
metadata:
  type: feedback
---

## Contexte

Session tests de style MiniMax H3 (canada-red-bay, 2026-08-13) : Aziz a envoyé 3 liens vidéo (tmpfiles.org) dans un même message, représentant 3 styles Higgsfield distincts (Hand Drawn, Poster Vector, Whiteboard Doodle). Les 3 fichiers ont été identifiés en début de session sur la base de l'ordre d'envoi + une impression visuelle rapide, sans extraction de frame de vérification. L'erreur (`ref1`↔Whiteboard Doodle réel, `ref3`↔2e variante Hand Drawn réelle, tous deux mal étiquetés) n'a été découverte qu'en fin de session, en construisant un dossier de référence consolidé — après ~5h de travail où les mauvais noms ont été utilisés en interne (prompts, chemins de fichiers, discussion).

## Why

Un nom de fichier de travail assigné à la volée ("ref1", "handdraw", etc.) devient une source de vérité de facto dès qu'il est réutilisé dans des chemins, des prompts, ou la conversation — l'erreur se propage silencieusement tant que personne ne revérifie le contenu réel contre le nom. Le risque grandit avec le nombre de fichiers reçus simultanément (confusion d'ordre) et avec le délai avant la première vérification objective (plus l'erreur vit longtemps, plus elle est coûteuse à détecter et corriger).

## How to apply

- Dès réception de 2+ fichiers de référence (images/vidéos) dans un même message : extraire une frame de CHACUN et la regarder AVANT de choisir un nom de travail — pas après.
- Ne jamais déduire l'identité d'un fichier de son ordre d'arrivée ou de son nom de fichier source (souvent générique, ex. `ref1.mov`, `screenrecording-xxx.mov`) — vérifier le contenu affiché à l'écran (texte, style visuel).
- Si un nom de travail a déjà été utilisé pendant un moment avant la vérification (comme dans ce cas), le signaler explicitement en le corrigeant — ne pas silencieusement continuer avec le nom faux dans les fichiers déjà écrits, documenter l'erreur dans un endroit visible (ex. README dédié) pour qu'une future lecture ne soit pas piégée par les noms de fichiers résiduels.
- Vaut spécifiquement pour tout lot de références envoyées ensemble (styles à comparer, versions à distinguer, personnages à ne pas confondre) — le risque de confusion croît avec le nombre de fichiers similaires en apparence (ex. plusieurs captures d'écran d'une même interface).
