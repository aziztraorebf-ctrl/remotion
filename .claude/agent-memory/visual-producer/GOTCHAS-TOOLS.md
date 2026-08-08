# GOTCHAS-TOOLS — visual-producer

> Detail des gotchas outils, extrait de MEMORY.md pour respecter le plafond 200 lignes/25000 octets.
> MEMORY.md garde une ligne de pointeur, le detail complet vit ici.

---

## GOTCHA — text-to-image (sans ref) dérive du style même avec palette décrite en toutes lettres (2026-08-07)

Génération d'un 2e personnage "utilisateur inconnu" (NoteShield P6) en text-to-image pur (prompt
décrivant palette navy `#16213a`, cyan en accent, "flat illustration") sans image de référence
jointe → résultat visuellement proche en couleur MAIS style divergent : contours noirs nets visibles
partout (au lieu de formes qui se touchent sans outline), ombrage/modelé sur le visage (au lieu
d'aplats purs), traits plus "illustratif premium" que le style plat épuré établi. Décrire le style
en mots ne suffit PAS à répliquer une texture de rendu précise — même avec une description détaillée
(épaisseur de trait, absence d'ombrage explicitement demandée).

**Fix qui a marché** : régénérer en image-to-image (`gemini-gen-image-ref.py --refs <chemin>`) avec
l'image canonique existante (ici `sarah-candidat-B-v3-final.jpg`) jointe comme STYLE ANCHOR explicite,
en précisant "use for style/line-weight/palette ONLY, not identity/composition" (cf R-STYLE-ANCHOR-
PALETTE-ONLY dans RULES-ACTIVE.md — s'applique aussi aux personnages secondaires, pas seulement aux
scènes). Résultat v2 : formes plates sans ombrage, traits minimalistes identiques (yeux = 2 points,
nez = triangle cyan), contours quasi absents — match confirmé par Aziz.

**Règle généralisée** : pour tout NOUVEAU personnage dans un projet ayant déjà un style établi,
TOUJOURS partir en image-to-image avec le perso canonique en ref (jamais text-to-image pur, même
avec une description de palette/style détaillée) — le texte décrit l'intention, l'image ancre la
texture de rendu réelle.

---

## ⭐⭐ GOTCHA CONFIRMÉ — MiniMax H3 sur objet mécanique sans articulation visible (2026-08-07 + confirmé 2026-08-08)

**Reformulation confirmée (2e cas validé)** — la règle n'est PAS "H3 ne gère pas les verbes
d'impact", c'est : **H3 a besoin d'une comparaison/référence concrète à un objet mécanique réel
pour improviser une trajectoire physique cohérente, quand le design de l'image de référence ne
montre aucune articulation mécanique visible** (pas de charnière, pas de pivot dessiné).

**1er cas (2026-08-07)** : un prompt d'action nette ("barrier DROPS DOWN sharply, everyone STOPS
ABRUPTLY") a produit un clip quasi-statique, zéro delta sur 21 frames/5.2s. Le clip miroir avec un
verbe de trajectoire orientée ("LIFTS UP", "RUSHES THROUGH") a bien fonctionné.

**2e cas confirmant (2026-08-08, NoteShield P1c)** : même objet (barrière = tube lumineux cyan
continu, sans charnière dessinée). Un prompt "the barrier closes abruptly" a été interprété par H3
comme "la lumière s'éteint" (pas de mouvement mécanique — le modèle reste fidèle au design source,
qui ne montre aucune articulation). En reformulant avec une **comparaison explicite à un objet
mécanique réel** — "the physical cyan bar mechanically and abruptly SLAMS DOWN, swinging down fast
like a real parking-lot barrier arm" — le mouvement mécanique voulu a été obtenu, verdict Aziz
"excellente vidéo". Clip retenu : `public/_client-sim/noteshield/video/p1c-badge-selectif-barre-
mecanique-h3.mp4`.

**Règle actionnable** : pour tout plan impliquant un mouvement mécanique précis (impact, arrêt
brutal, bascule) sur un objet dont le DESIGN ne montre pas d'articulation visible (pas de charnière/
pivot dessiné dans l'image de référence) → **toujours ajouter une comparaison explicite à un objet
mécanique réel et familier** ("like a real parking-lot barrier arm", "like a mechanical lever",
etc.) plutôt qu'un simple verbe d'action ("closes", "drops", "stops"). Le verbe seul laisse H3
libre d'interpréter selon la logique visuelle du design (ex: couper une lumière plutôt qu'inventer
une articulation absente) — la comparaison à un objet réel force la bonne trajectoire physique.

---

## CAS RÉSOLU — NoteShield P6 Berlin, personnage "utilisateur inconnu" (2026-08-07)

Plan H3 initial montrait Sarah elle-même à Berlin → contradiction narrative (script dit "même
compte, appareil inconnu", pas "Sarah se reconnecte ailleurs"). Corrigé : nouveau personnage
généré en image-to-image avec Sarah comme style anchor (voir gotcha ci-dessus) —
`src/projects/_client-sim/noteshield/refs/p6-utilisateur-inconnu-v2.jpg`. Clip H3 validé :
`out/_r-and-d/noteshield-h3-tests/p6-v2-inconnu.mp4` (5.17s, 2544x1456, $1.30 réel), 0 drift
détecté sur 9 frames échantillonnées pleine durée (aucun grossissement de halo cyan, gotcha
déjà rencontré une fois sur ce chantier — pas de récidive ici).
