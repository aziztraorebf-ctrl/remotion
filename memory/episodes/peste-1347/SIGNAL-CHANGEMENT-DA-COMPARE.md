# ⚠️ SIGNAL POUR L'AUTRE INSTANCE — da-compare.py / da-brief.py ont changé (2026-06-07)

> À LIRE si tu travailles sur Peste Beat 5 (ou tout comparatif) AVEC une question custom écrite
> à la main. Le système a été corrigé pour ne PLUS avoir besoin d'improviser la question.

## CE QUI A CHANGÉ ET POURQUOI

Tu avais écrit une excellente question custom pour comparer Beat5 vs Mansa Moussa — mais tu as DÛ
l'improviser parce que `da-compare.py` avait un `DEFAULT_QUESTION` **hardcodé pour le Sahel/Mapbox**
(parlait de "Mapbox", "granularité géographique" — faux pour Atlas). Aziz a identifié le risque :
chaque instance hors-Sahel improvise → résultats variables → on perd la rigueur qui a fait le succès.

**Corrigé maintenant :**
1. **Gabarit FIGÉ + contexte par pilier** dans da-compare.py. La structure de question (rôle,
   "même stack donc pas le coupable", classement, corrections rentables, verdict+faux coupable) est
   figée et universelle. Le contexte technique est auto-sélectionné via `--ref` :
   `atlas` → d3-geo/PixelLab/sprites-mouvement (PLUS de Mapbox). `--pillar atlas` pour forcer.
2. **Socle d'angles obligatoires** (`ANGLES_BLOCK`) injecté par défaut dans da-brief ET da-compare :
   SPECTATEUR + NARRATION (ce qui apparaît suit-il la voix) + TRANSITIONS/états + AI-SLOP + EXPERT.
   Ces 5 angles (ce qui a fait notre succès) sont maintenant garantis partout, plus besoin de les
   réécrire à la main.

## CE QUE TU DOIS FAIRE

**Tu n'as PLUS besoin d'écrire la question custom à la main.** Lance simplement :
```
python3 scripts/tools/da-compare.py \
  --ref atlas \
  --new out/episodes/peste-1347/wip/beat5_v12.mp4 \
  --label peste-beat5-vs-mansa --expert
```
(`--ref atlas` = Mansa Moussa auto + contexte Atlas + socle d'angles + expert. Mêmes résultats
rigoureux que le Sahel, sans improviser.)

Si tu veux VRAIMENT une question sur-mesure (cas spécial), `--question "..."` reste dispo — mais
le socle d'angles s'ajoute quand même (sauf `--no-angles`, déconseillé).

## SI TU AS DÉJÀ LANCÉ avec ta question custom
Pas de problème — ta custom était bonne et contenait déjà ces angles. Garde le résultat. Pour les
PROCHAINS comparatifs (autres beats, autres projets), utilise le nouveau défaut `--ref <pilier>`.

## DOCTRINE À JOUR
`memory/doctrines/DA-BRIEF-GATE.md` — sections "SOCLE D'ANGLES OBLIGATOIRES" + outil da-compare.
Note : da-compare = Gemini seul (vidéo). Pour le double œil Kimi, complète avec da-brief sur frames.
