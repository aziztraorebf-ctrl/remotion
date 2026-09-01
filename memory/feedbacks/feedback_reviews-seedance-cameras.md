# 3 regles pivot pour production videos paper-craft (reviews + Seedance + options camera)

> Migré depuis auto-memory 2026-08-31. Validées 2026-04-23 après session Thiaroye V5 Scene 1
> (4 tentatives, forte frustration). Corrige un pattern observé sur Sonjata publié avec succès.
> Complète `memory/tools/seedance-rules.md` avec 3 règles de MÉTHODE (pas de technique pure) sur
> comment reviewer et proposer des options caméra.

## 1. R-REVIEW-MINIMAL (validee 2026-04-23)

**Reviews visuelles d'agents et de Kimi = trop critiques vs perception humaine reelle.**

**Why** : Les LLM vision sur-detectent les defauts au pixel pres alors qu'un spectateur humain voit l'ensemble a 1-2m d'ecran sur mobile. Pattern observe sur 4 tentatives Scene 1 Thiaroye V5 ou l'agent a juge "dot-eyes ECHEC" et "hatching ECHEC" sur une image qu'Aziz a validee immediatement comme excellente a l'oeil.

**How to apply** :
- Reviews limitees a 3 bullets courts binaires (OK / PROBLEME VISIBLE / REJECT)
- Pas de tableaux 8 criteres avec nuances PARTIEL/ECHEC
- Kimi reviews = reference technique, pas verdict final
- Aziz decide visuellement sur mobile. Les agents ne doivent pas tenter de "valider a sa place".
- Si l'agent voit un probleme = le signaler en 1 phrase, puis laisser Aziz trancher

**Cout evitable de la sur-critique** : review excessive a fait regenerer inutilement char-refs V2 ($0.08) + V3 ($0.16) + Scene 1 image V3 ($0.04) + V4 ($0.04) alors que plusieurs etaient deja bonnes.

## 2. R-SEEDANCE-SOBRE (validee 2026-04-23)

**Seedance i2v par defaut pour CHAQUE scene, avec mouvements camera SOBRES.**

**Why** : Sonjata publie avec succes = toutes les scenes animees par Seedance (pas de Pan Remotion freeze Ken Burns). La difference vs les echecs Thiaroye V5 = les mouvements camera etaient SOBRES (dolly-in lent, static + zoom leger, orbite courte), pas ambitieux (tracking lateral 13s, arcs 45 complexes).

**Piege identifie** : vouloir "dynamiser" une scene avec des mouvements complexes a cause du format Short casse Seedance. La vraie dynamique vient de la SCENE ELLE-MEME (personnages deja en mouvement, elements intrinseques animables) + mouvement camera SIMPLE.

**How to apply** :
- Seedance i2v est le standard pour chaque scene
- Pan Remotion = slideshow animee, pas une video animee. NE PAS l'utiliser comme default.
- Preferer mouvements camera prouves : dolly-in lent, static + zoom leger, orbite courte validee
- Eviter : tracking lateral long, arcs 45+ sur 13s, mouvements composes
- Duree clip : rester dans les zones de fidelite (5-10s ideal, 13s maximum avec mouvement tres simple)
- Prompts Seedance courts (R-PROMPT-LIBERAL v2, cf `memory/tools/gemini-rules-diversite-vivid.md`) laissant la scene respirer

## 3. R-CAMERA-OPTIONS (validee 2026-04-23)

**Pour chaque scene, agent propose 3 options de mouvement camera : SAFE / MEDIUM / RISQUEE.**

**Why** : Pattern Sonjata = la rotation 145 sur la barre de fer (mouvement risque) a parfaitement fonctionne parce que la scene s'y pretait. Ne jamais etre bloque dans un pattern unique. Le catalogue de mouvements camera valides doit etre exploite scene par scene.

**How to apply** :

Pour chaque scene, proposer :

**Option SAFE (verte)** :
- Mouvement prouve 9+/10 sur paper-craft
- Exemples : dolly-in lent, static + zoom leger, tilt vertical court
- Risque zero, qualite garantie
- Justification narrative courte

**Option MEDIUM (jaune)** :
- Mouvement valide mais moins teste sur ce type de scene
- Exemples : orbite 45, pedestal, push-in complexe
- Risque faible, valeur narrative plus elevee
- Justification narrative

**Option RISQUEE (rouge, si pertinent)** :
- Mouvement ambitieux qui PEUT bien marcher si la scene s'y prete
- Exemples : rotation 145 (comme barre de fer Sonjata), tracking complexe, arcs longs
- Risque reel mais gain narratif majeur
- Justification narrative forte
- Plan B explicite si echec

**Debat rapide** entre Aziz et Claude (ou Aziz tranche directement si l'option est evidente).

**Ne pas forcer les 3 options** : si SAFE est clairement la bonne, proposer juste SAFE avec 1-2 alternatives courtes. Adapter la longueur de proposition a la complexite de la scene.

## Application immediate Thiaroye V5 Scene 1 (2026-04-23, exemple concret)

Mouvement camera choisi par Aziz : **dolly-in lent (SAFE)**.

Illustration de R-DYNAMIC (cf `memory/tools/seedance-rules.md`) : 7 tirailleurs scattered naturally, chacun dans une activite differente — focus sur mouvements intrinseques + eau + ciel plutot que sur un mouvement camera ambitieux.
