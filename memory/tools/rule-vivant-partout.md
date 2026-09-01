# R-VIVANT-PARTOUT — chaque personnage bouge en continu

> Migré depuis auto-memory 2026-08-31 (validée 2026-04-23, Thiaroye 1944 désormais publié).
> Cette règle est RÉFÉRENCÉE PAR NOM dans `memory/tools/seedance-rules.md` (règle 92) et
> `memory/checklists/SEEDANCE.md` mais sa DÉFINITION complète n'était nulle part côté repo — les
> deux fichiers l'utilisent en la supposant déjà connue. Migrée ici pour combler ce trou.

## Regle

Dans tout prompt Seedance i2v, bannir les mots **"frozen", "still", "motionless", "completely stops", "remains still"**. Chaque personnage doit avoir des micro-actions reparties sur toute la duree du clip, pas juste en debut ou fin.

**Contemplatif = observationnel** (vie organique continue), **PAS immobile**.

## Why (leçon de Scene 1 Thiaroye)

Pattern d'erreur observe sur 4 iterations V1-V4 :
- V1 : tirailleurs "STILL, DIGNIFIED" → scene completement statique, seule la camera bougeait → rejet
- V2 : "All deck figures STILL, neutral expressions" → meme probleme + Seedance a invente des personnages
- V3 : prompt libéral → cartoon drift
- V4 : "subtle breathing, slight head turns, occasional small gestures" → lent, tirailleur premier plan prend 8s avant de reagir

Pattern qui a marche (scene Sonjata) :
- Verbes actifs en MAJUSCULES partout (STEP BACK, HOLDS, TREMBLING, SHIFTS, LOWERS)
- **Zero** instruction "frozen/still/motionless"
- Chaque personnage a une action a un moment precis
- Chœur reagit (villagers STEP BACK, hands RISE)

**Difference psychologique** : "contemplatif" a ete sur-traduit en "meditation immobile" (culturel francais) alors que la vraie intention Short = "observationnel avec vie organique" (pattern youtube Short qui retient).

## How to apply

**Banni dans les prompts** :
- "completely still"
- "frozen in observation"
- "motionless"
- "completely stops"
- "remains still"
- "remains frozen"

**Prefere** (verbes actifs subtils mais continus) :
- SHIFTS (weight, posture, feet)
- TURNS (head, gaze)
- LEANS (forward, back, against)
- ADJUSTS (posture, stance)
- STRAIGHTENS
- SCANS (shore, horizon)
- OBSERVES (actively, not passively)
- GESTURES
- POINTS
- LIFTS / LOWERS
- BLINKS (subtil mais actif)
- TAPS (fingers on rail)
- NODS

**Rule de fin de prompt systematique** :
```
All characters stay engaged, bodies continuously micro-shifting.
```

(PAS "no one freezes" qui est une injonction negative — affirmer positif)

## Exemple concret validation

Scene 1 V5 Thiaroye prompt valide (7s, $2.10) :
- SECONDS 0 TO 2: 2-3 actions macro (SHIFTS, LEANS, GESTURE, POINTING)
- SECONDS 2 TO 4: 2-3 actions macro (TURNS head, LIFTS beret, ADJUSTS posture)
- SECONDS 4 TO 7: 2-3 actions macro (STRAIGHTENS up, TURNS head, LEANS)
- Fin : "All tirailleurs stay engaged, bodies continuously micro-shifting"

Result : chaque personnage anime visiblement, Seedance a meme ajoute des anchors bonus (oiseau, fumees d'usine qui evoluent).

## Applicable a

Toute scene "contemplative" ou "narrative" en génération vidéo image-to-video (Seedance), pas juste action.

## Exception

Scenes de recueillement pur (silhouettes tombees, memorial) peuvent avoir 1-2 personnages statiques MAIS l'environnement doit bouger (poussiere, vent, vagues). Jamais une scene 100% immobile.
