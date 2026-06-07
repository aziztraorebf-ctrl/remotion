# BRIEF DE PASSATION — Peste 1347, débloquer le Beat 5 avec le système DA-BRIEF-GATE

> Créé 2026-06-07. Pour une instance Claude qui reprend Peste 1347 (Atlas pur).
> OBJECTIF : utiliser le système de review externe (créé session 2026-06-07) pour CASSER
> le blocage du Beat 5 "Mali Vivant" (~12 tentatives, jamais validé FINAL) — au lieu de
> deviner et re-coder une 13e fois à l'aveugle.

---

## LE PROBLÈME (pourquoi tu lis ce brief)

Beat 5 "Mali Vivant" = le dernier beat de Peste 1347 (les beats 1-4 sont FINAL ✅).
Il a été tenté **~12 fois** (beat5_v1 → v12 + phases a/b/c). La plus récente : `beat5_v12.mp4`
(5 juin). JAMAIS validé FINAL. C'est LE cas désespéré classique : on devine → on code → on rate →
on recommence. Symptômes typiques notés : caravane dure à synchroniser à l'audio · route d'or SVG
mal alignée sur la carte · transition finale (Europe vs Mali) pas assez percutante.

C'est EXACTEMENT le cercle vicieux que le nouveau système est fait pour briser.

---

## LE SYSTÈME À UTILISER (DA-BRIEF-GATE) — ce que ça permet

Review externe Gemini 3.1 Pro + Kimi K2.5, avec 3 angles et 2 moments. **Doctrine complète à
LIRE : `memory/doctrines/DA-BRIEF-GATE.md`.** Outils dans `scripts/tools/`.

**Ce que ça permet pour le Beat 5 :** arrêter de deviner. Comprendre POURQUOI ça bloque AVANT de
re-coder. Possiblement révéler un "faux coupable" (comme la palette s'est avérée fausse pour le
Sahel — vrai pb = fragmentation géo). Obtenir un plan de construction validé par 2 experts.

⚠️ Le système ne GARANTIT pas le premium — il garantit qu'on saura POURQUOI ça bloque et qu'on
construira sur un plan validé, pas à l'aveugle. Le diagnostic peut révéler un pb de concept/asset,
pas juste d'exécution. Le distinguer est déjà une énorme avancée après 12 échecs.

---

## PLAN D'ATTAQUE RECOMMANDÉ (dans cet ordre)

### Étape 1 — COMPARATIF : "un Atlas marche, le Beat 5 non, pourquoi ?" (le plus puissant)
Le test le plus révélateur. On a des Atlas VALIDÉS comme référence.
```
python3 scripts/tools/da-compare.py \
  --ref out/PRET-PUBLICATION/mansa-moussa-atlas-v2-FINAL.mp4 \
  --new out/episodes/peste-1347/wip/beat5_v12.mp4 \
  --label peste-beat5-vs-mansa --expert
```
(Mansa Moussa est l'Atlas le plus proche : même univers caravane/route/or. Alternative ref :
`out/PRET-PUBLICATION/empire-ghana-FINAL-v2.mp4`.)
Gemini ingère les 2 vidéos COMPLÈTES → isole ce qui DIFFÈRE vraiment. Cherche le faux coupable.
⚠️ AJOUTER au pilier `REFERENCES` de da-compare.py une entrée `atlas` si tu veux `--ref atlas`.

### Étape 2 — AI-SLOP + EXPERT sur la dernière version ratée (v12)
Œil externe brutal sur ce qui ne décolle pas. Extraire 4-5 frames de beat5_v12.mp4 (downscale !)
+ brief décrivant le beat, puis :
```
python3 scripts/tools/da-brief.py --brief <brief-beat5.txt> --label peste-beat5-diagnostic \
  --expert --frame "frame1.jpg:..." --frame "frame2.jpg:..."
```
(--aislop est ON par défaut. --expert ajoute le point de vue pro + spectateur.)

### Étape 3 — UPSTREAM : faire valider le PLAN de reconstruction AVANT de re-coder
Une fois le diagnostic compris (étapes 1-2), au lieu de coder direct, envoyer le PLAN du Beat 5
(script + assets dispo + ce qu'on veut) en mode préventif :
```
python3 scripts/tools/da-brief.py --brief <plan-beat5.txt> --label peste-beat5-construction \
  --upstream --frame "ref-mansa.jpg:..."
```
→ tu obtiens un plan de montage beat par beat + ordre de construction + parades anti-slop,
validé par 2 experts, AVANT d'écrire une ligne. (C'est ce qui a parfaitement marché pour l'Acte 1 Sahel.)

### Étape 4 — Synthèse + Aziz tranche, PUIS recoder
Claude SYNTHÉTISE les retours (CONVERGE / unique / écarté), VÉRIFIE chaque point contre le code
réel (les modèles hallucinent — règle CLAUDE.md L254, ne PAS gober). Aziz tranche le goût. PUIS code.

---

## RÈGLES D'EXÉCUTION DU SYSTÈME (NON-NEGOTIABLE)
- **Downscale les frames** avant tout envoi : `ffmpeg -vf scale=1280:-1 -q:v 4` (sinon appel très lent).
- **Gemini + Kimi = SIGNAL, jamais juge.** Vérifier chaque point, appliquer le VRAI, ignorer le reste.
- **MAX 1 appel/modèle par phase.** Pas de boucle brief→fix→brief.
- **Aziz tranche le goût** ; Claude tranche le technique.
- Si un modèle échoue (quota OpenRouter pour Kimi) : ne pas bloquer, 1 modèle suffit pour avancer.
- Contraindre à la stack ATLAS (d3-geo + PixelLab + SVG Remotion), PAS Mapbox. Pas de 3D/AE.
  Note : Peste = Atlas (d3-geo, pas Mapbox). Les briefs doivent décrire NOTRE boîte à outils Atlas.

---

## CONTEXTE TECHNIQUE BEAT 5
- Code : `src/projects/atlas/.../Beat5MaliVivant.tsx` (515L) — chercher le chemin exact au démarrage.
- Storyboard : `public/atlas/peste-1347/storyboard/beat5-storyboard.md` (route or SVG + POI précalculés).
- Assets : Souleymane walk east/west `public/atlas/peste-1347/assets/characters/souleymane/animations/walk/`.
- POI SVG : Niani (210,737), Tombouctou (250,696), Maghreb (235,556), Florence (354,463), Venise (362,446).
- Script audio : "Pendant ce temps, Mansa Souleymane gouverne le Mali..."
- Dernier WIP : `out/episodes/peste-1347/wip/beat5_v12.mp4` (5 juin). Dernier présenté Aziz : `versions/beat5_V2.mp4`.
- Démarrage beat Atlas classique : `python3 scripts/atlas-session.py --episode peste-1347 --beat 5`.
- État détaillé : `memory/episodes/peste-1347/STATUS.md`. Doctrine Atlas : `memory/doctrines/ATLAS-PLAYBOOK.md`.

---

## SI LE BEAT 5 SE DÉBLOQUE
Ne PAS tout relancer d'un coup. Prouver le concept sur le Beat 5 (cas le plus dur) d'abord.
Si premium atteint → passer les beats 1-4 au comparatif aussi (vs Mansa/Ghana) pour vérifier
la cohérence, PUIS assembler les 5 beats + narration + SFX → render épisode complet.

## EXEMPLE QUI PROUVE QUE ÇA MARCHE
Le système a été créé + prouvé sur le War-Map Sahel le 2026-06-07. Voir les bruts (lecture
recommandée pour comprendre la PUISSANCE des retours) : `memory/episodes/warmap-sahel/etat-actuel-acte1/
da-acte1-construction-{gemini,kimi}.md` et le comparatif décisif `review-acte1/da-compare-sudan-sahel-*.md`.
