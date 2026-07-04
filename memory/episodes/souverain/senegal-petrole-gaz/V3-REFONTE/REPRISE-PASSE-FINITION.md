# REPRISE — Passe de finition Sénégal V3 (montage complet)

> Créé 2026-07-04. Retours d'Aziz sur le MONTAGE COMPLET assemblé (8min23s).
> Montage jugé : https://files.catbox.moe/bq8qtq.mp4 (60 MB compressé) — source : `out/episodes/senegal-petrole-gaz/senegal-petrole-gaz-V3-COMPLET.mp4`.
> ⛔ NE PAS re-livrer avant d'avoir traité cette liste. Session dédiée = créer un PLAN DÉTAILLÉ puis corriger (agents possibles).
> Verdict global Aziz : "la vidéo est très bien, assez dynamique". Sujet lourd/analytique — dynamisme OK, dilemme ouvert (voir §DYNAMISME).

## ⛔ BUGS AUDIO (les plus critiques — raccords d'assemblage)

Plusieurs coupures + DÉDOUBLEMENTS d'audio aux jonctions. Cause probable RACINE : les mp4 finaux de scènes
se CHEVAUCHENT sur le texte (une scène inclut l'amorce de la suivante), donc au concat la phrase est dite 2×.
À DIAGNOSTIQUER scène par scène (extraire l'audio aux jonctions, comparer au forced-align).

1. **~22-31s → 32s (sc.0 hook → sc.1a intro-coin)** : DÉDUPLICATION AUDIO. On parle des 2 faces de la malédiction
   (22→31s), puis la scène suivante (pièce 2 faces) REPETE LA MÊME PHRASE. + coupure de son juste après
   "la vérité est plus froide. Et plus précise." avant l'apparition de la pièce. Raccord sc.0→sc.1a cassé.
2. **~1min00-1min02 (sc.1b gisements → sc.2 comparaison)** : coupure TRÈS BRUSQUE + la phrase suivante commence
   par un MORCEAU MANQUANT (commence à "...pas un gisement, j'en ai trouvé 3" → il manque le début). Bout de
   script/audio perdu au raccord.
3. **~2min11-2min13 (sc.2 → sc.3 contrat)** : après les barils 60%, coupure DURE + phrase incomplète au reprise
   + DÉDOUBLEMENT audio 2min11→2min13.
4. **~5min51-5min53 (dans sc.5 coulisses)** : sur "qui prend leur place et à quel prix", coupure étrange pendant
   la phrase. Problème audio à vérifier.

→ MÉTHODE FIX : re-vérifier les bornes de coupe (startFrom/endAt) de CHAQUE scène vs le forced-align V3 global.
   Le raccord doit couper PILE entre 2 phrases, sans chevauchement ni trou. C'est la cause n°1 des dédoublements.

## ⛔ COUPURES VIDÉO BRUSQUES / ÉCRAN DE CHARGEMENT

5. **~4min58-5min00 (sc.4 dette → sc.5 coulisses Mapbox)** : coupure abrupte + ÉCRAN GRIS DE CHARGEMENT visible
   avant que la carte Mapbox arrive. Transition à fluidifier (premount Mapbox ? fade ?).

## ⛔ RUPTURE DE CHARTE — CARTE (harmoniser sur TOUTE la vidéo)

6. **~1min04 (sc.2) : ANCIENNE carte Mapbox** (sombre) alors qu'on a ADOPTÉ ENSUITE une carte GRIS CLAIR plus
   lumineuse (visible plus tard dans la vidéo, ex sc.5). Aziz a fourni un SCREENSHOT de réf = la carte gris clair
   + la TYPOGRAPHIE finale à utiliser PARTOUT. → harmoniser sc.2 (et toute scène carto) sur ce style.
   Réf visuelle : screenshot Aziz "ILS ONT CHOISI LA RUPTURE" + carte Norvège rouge/bleu (à re-demander si perdu).

## ⛔ SFX PARASITES À RETIRER

7. **~4min15-4min16 (sc.4 dette, 3 mécanismes)** : un SFX (liquide ?) DISTRAYANT. → RETIRER.
8. **~5min26 (sc.5)** : un SFX (whoosh/zoom Dakar ?) qui n'apporte rien. → retirer ou remplacer.

## ⛔ ANIMATION — POINT DAKAR INSTABLE

9. **sc.5 (dernier terrain, Yakaar)** : le POINT qui représente DAKAR TREMBLE quand la caméra se rapproche
   (instable au zoom). → stabiliser le point (probablement un souci d'ancrage frame-driven au zoom Mapbox).

## ⛔ ÉPURE TEXTE (règle Aziz déjà gravée)

10. **Fin sc.7 (drapeaux AES)** : RETIRER "ILS ONT CHOISI LA RUPTURE." — la voix le dit déjà, les 3 drapeaux
    suffisent. (Cohérent règle épure-texte SYSTEME-AGENTIQUE.) La toute fin (CTA prochaine vidéo) = "très bien".

## 💬 DYNAMISME (dilemme ouvert — Aziz veut mon avis)

Aziz : "assez dynamique, sujet lourd/analytique. Pas un PowerPoint, mais pas la vidéo la plus dynamique au monde."
Il n'est pas convaincu que plus de dynamisme soit nécessaire (peut-être sur-optimisation). Question posée à Claude :
identifier des parties où on pourrait ajouter du dynamisme SANS TOUT CASSER / TOUT REFAIRE (agents possibles).
→ À TRANCHER en session dédiée : donner un avis honneste (analyste, pas cheerleader) + cibler 2-3 moments précis
   si pertinent, sinon dire que c'est déjà au bon niveau pour le registre.

## ✅ THUMBNAIL (vérifié 2026-07-04)

Existe : `out/SHOWCASES/thumbnails-senegal/FINAL-senegal-gemini.png` (baril métal + drapeau SEN + "SÉNÉGAL — Le
pétrole de la patience"). Uploadée : https://files.catbox.moe/z2u6nv.png. À discuter en session dédiée.

## ÉTAT DU CODE (rappel)

- sc.6 (SceneBilanV3) + sc.7 (SceneBonusV3) = code final PREMIUM avec sources, sur la branche de travail
  (working tree principal). Vrais fichiers rapatriés des worktrees. mp3 dédiés copiés (narration-v3-scene6, sc7-audio).
- Script d'assemblage : `<scratchpad>/assemble-senegal-v3.sh` (overlay sources PNG + concat). Cartouches PNG :
  `<scratchpad>/srctags/`. ⚠️ scratchpad = éphémère, re-générer si besoin (gen-source-tags.py sauvegardé où ?).
- Plan de sources (8 scènes) : voir tableau dans la conversation / _ASSEMBLAGE-V3. 132% = FMI nov 2025 (Tavily vérifié).
- ⚠️ Working tree PARTAGÉ avec instance war-map (branche feat/warmap-aes-hook-integration). `git add` CHIRURGICAL
  sur les seuls fichiers senegal au commit.

## PROCHAINE SESSION — ORDRE SUGGÉRÉ
1. Créer le PLAN DÉTAILLÉ (chantier par bug, avec la cause racine audio en priorité).
2. Fixer les raccords audio (cause racine = bornes de coupe/chevauchement) — le plus impactant.
3. Harmoniser la carte (style gris clair + typo) sur les scènes carto.
4. Retirer SFX parasites + texte "ILS ONT CHOISI LA RUPTURE" + stabiliser point Dakar + fluidifier transition Mapbox.
5. Re-assembler + re-vérifier les jonctions. Trancher le dynamisme.
