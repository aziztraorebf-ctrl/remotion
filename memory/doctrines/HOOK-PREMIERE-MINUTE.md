# DOCTRINE HOOK & RÉTENTION — La première minute

> **Construit 2026-06-17** par croisement TERRAIN (Last30Days : 52 items frais Reddit/X/TikTok/IG + analyse TubeAI sur 14M vidéos) + JURY 3 MODÈLES (Gemini 3.1 Pro / Kimi K2.5 / DeepSeek V4). Détail tracé : [[feedback_hook-retention-premiere-minute]].
> **À LIRE avant d'écrire/coder l'ouverture de toute vidéo** (War-Map ET Souverain Mapbox). Cocher la checklist § 5.
> **Pourquoi cette doctrine existe :** on tend vers le STATIQUE (zoom lent + texte sur carte fixe) et on repart de zéro à chaque ouverture. Ce document est le système qui supprime les deux problèmes.

---

## 0. LE PRINCIPE FONDATEUR (le plus important)

**Un hook n'est PAS une accroche de 8 secondes. C'est une TENSION NARRATIVE tenue ~1 minute.**

Donnée terrain (TubeAI, 14M vidéos) : les hooks de **45-59s surperforment de 29,4%** ; le mythe du « hook en 10s » plafonne la rétention. Notre vrai problème n'est donc PAS l'accroche initiale — c'est qu'on ne **tient pas la tension** sur la première minute.

Mécanique : on pose une **boucle ouverte** (open loop) dans les 3 premières secondes, on la garde non résolue, et on la résout vers 1:30+. Tout le reste de la première minute sert à entretenir cette tension.

---

## 1. LES 4 RÈGLES NON-NÉGOCIABLES (terrain + modèles convergent → fiable)

1. **Open loop posé tôt, résolu tard.** Une question/promesse non résolue dans les 3 premières secondes, maintenue par un élément visuel persistant non résolu (ex : tracé en pointillés qui n'arrive pas à destination ; zone non identifiée qui pulse). Ne jamais tout dire d'emblée.
2. **Re-hook toutes les 8-12 secondes.** Un NOUVEL élément visuel net à CHAQUE phrase narrative. Jamais plus de 3 éléments simultanés. Ex : la voix dit « trois acteurs » → 3 jetons/icônes pop en cascade (stagger ~3 frames).
3. **Tuer le plan d'ouverture mou.** Bannir la carte qui dérive sans intention (= notre statisme). L'ouverture frappe frame 0. « Most hooks fail in the first 2 seconds — not the topic, the boring opening shot. »
4. **Vendre le POURQUOI CA COMPTE avant le COMMENT.** ⛔ Piège n°1 des petites chaînes : expliquer chronologiquement (« pour comprendre, remontons à 1884… ») = drop immédiat. On montre l'enjeu ACTUEL (sanglant/financier) d'abord ; l'histoire vient vers 1:30.

---

## 2. LES 6 ARCHÉTYPES DE HOOK (choisir UN, transposables à notre stack)

| Archétype | Mécanique (0-5s) | Réalisation Remotion/Mapbox |
|---|---|---|
| **Paradoxe data** | « 80% des ressources, 90% sans électricité » — contraste massif | Jauges SVG spring opposées, cut brutal |
| **Anomalie géo** | « pourquoi cette ligne droite coupe le désert ? » | Zoom Mapbox extrême sur un détail absurde |
| **Télescope temporel** | zoom continu satellite→continent→région→point, sans cut | Caméra frame-driven (jumpTo + interpolate zoom/center) |
| **In medias res** | commencer par l'action (« 14 juillet 2012, un convoi… ») | Tracé `stroke-dashoffset` + icône Lucide qui suit le path |
| **Croyance brisée** | « vous pensez que l'Afrique est pauvre ? Regardez. » | Carte qui contredit l'idée reçue (révélation) |
| **Chiffre impossible** | compteur 0→12M en 4s, typo condensée massive + SFX clack | CountUp SVG + Lucide en cascade |

---

## 3. CE QUI SE TRANSPOSE / CE QUI NE SE TRANSPOSE PAS (faceless carto)

**✅ Transposable :** la caméra EST le personnage (sans visage, le mouvement Mapbox porte l'émotion) · paradoxe data (jauges) · anomalie/zoom · in medias res (path animé) · superpositions temporelles (2 couches opacité croisée 1850 vs 2024) · compteurs.

**❌ NON transposable :** empathie par le regard / photos de victimes (froid en carto) · jump cuts physiques façon vlog · tout hook qui dépend d'un visage/acteur · cut sec géographique carte A→carte B (désoriente — utiliser un mouvement caméra continu + élément SVG de liaison).

---

## 4. MÉTHODE DE PRODUCTION (ordre anti-chaos — validé modèles)

1. **Beat-sheet audio D'ABORD.** Poser la voix, marquer les frames des mots-clés (`const F_HOOK=…`). TOUT déclenche sur ces marqueurs. (On fait souvent l'inverse — c'est la cause racine du décalage voix/image.)
2. **Caméra seule.** Scripter le mouvement Mapbox (macro→micro) et le valider AVANT tout overlay.
3. **Data SVG + Lucide.** Icônes aux coordonnées géo projetées, apparition `spring` (overshoot léger).
4. **Atmosphère en dernier** (textures, vignette, focus/spotlight).

**Règle des 3 temps d'apparition :** Théâtre (le OÙ) → Acteurs (le QUI/QUOI) → Action (le COMMENT). + respiration ~2s (drift lent, zéro nouvelle info) entre 2 idées complexes.

**2 leviers techniques transverses :**
- **Anticipation** : l'animation démarre 3-5 frames AVANT le mot-clé (le visuel attire, la voix confirme).
- **Spotlight** : assombrir toute la carte sauf la zone active (voile + trou de lumière) → force le regard, tue le « trop dense/statique ». Un seul élément actif par seconde.

⛔ **Rappels stack :** `spring()` partout, JAMAIS d'easing linéaire (= mou). JAMAIS `flyTo`/`easeTo` (incompatibles headless — doctrine Souverain) : snap = `jumpTo` + spring sur zoom/center. Lucide-react déjà installé.

---

## 5. CHECKLIST AVANT DE CODER UNE OUVERTURE (cocher chaque point)

- [ ] **Open loop** identifié : quelle question/tension je pose à 0-3s et résous vers 1:30 ?
- [ ] **Archétype de hook** choisi (1 parmi les 6, § 2).
- [ ] **Beat-sheet audio** fait : frames des mots-clés marquées avant tout code.
- [ ] **Re-hook 8-12s** : un élément visuel net prévu à chaque phrase (≤3 simultanés).
- [ ] **Pas d'ouverture molle** : frame 0 frappe, pas de drift sans intention.
- [ ] **Pourquoi avant comment** : l'enjeu actuel d'abord, l'histoire/chronologie après ~1:30.
- [ ] **Spotlight / hiérarchie du regard** : un seul élément actif par seconde, reste assombri.
- [ ] **Anticipation** : animations câlées 3-5 frames avant le mot-clé.
- [ ] **Aucun easing linéaire**, aucun `flyTo`, aucun cut sec géographique.

---

## 6. LES 3 PISTES À TESTER (expérimentations ouvertes, pas encore validées)

1. **Hook long** : structurer la 1ère minute comme une boucle ouverte tenue (vs accroche+exposé).
2. **Voix de hook séparée** : voix plus punchy sur les 30 premières s (ElevenLabs), puis narrateur posé. (« switch to narrator, your audience won't notice but your analytics will. »)
3. **Re-hook visuel systématique 8-12s** : industrialiser un élément qui pop à chaque phrase.

À valider en production réelle, puis graver le verdict ici.

---

> Liens : [[feedback_hook-retention-premiere-minute]] (sources tracées) · [[feedback_jetons-symboles-sous-exploites-warmap]] (famille jetons Gemini) · [[remotion-effects-rack-natif]] (3D = niche) · [[DOCTRINE-SOUVERAIN]] (frame-driven, pas flyTo) · WARMAP-GRAMMAIRE / SOUVERAIN-VISUAL-PLAYBOOK (habillage carte) ·
[[STRUCTURE-OBJET-MECANISME]] (squelette narratif du corps, après cette 1ère minute).
