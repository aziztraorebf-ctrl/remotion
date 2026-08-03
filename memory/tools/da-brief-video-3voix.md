# da-brief-video-3voix.py — Review upstream à 3 voix avec vidéo native (Gemini+Kimi) + frames (GPT-5.6 Sol)

Créé 2026-08-03 (session Gazoduc Acte 1 v8). Étend le protocole DA-BRIEF-GATE (`da-brief.py`) au cas
où on veut envoyer une VRAIE VIDÉO (pas juste des frames extraites) à plusieurs modèles en parallèle.

## Script

`scripts/tools/da-brief-video-3voix.py` :
```bash
python3 scripts/tools/da-brief-video-3voix.py \
  --brief path/to/brief.txt --label mon-label --video path/to/proto.mp4 \
  --frame f1.jpg --frame f2.jpg ...   # frames pour GPT-5.6 Sol
```
Sorties : `/tmp/da-refs/da-<label>-{gemini,kimi,gpt56sol}.md`.

## ⛔ Contrainte technique confirmée par test (2026-08-03) — PAS à re-tester

**GPT-5.6 Sol (`openai/gpt-5.6-sol` via OpenRouter) REFUSE la vidéo native** : `404 No endpoints
found that support input video` — même limite déjà connue pour Kimi via OpenRouter. Aucune trace
antérieure dans le projet de GPT-5.6 Sol recevant une vidéo malgré une intuition initiale d'Aziz
("je pense que oui on l'a déjà fait") — vérifié par grep mémoire + test API direct AVANT de bâtir
le brief dessus. Contournement : lui envoyer des frames denses (10-15, downscalées 1280px) au lieu
de la vidéo — accepte très bien les images.

## Qui reçoit quoi et comment

- **Gemini 3.1 Pro** : vidéo native via Files API (`client.files.upload`, attendre état `ACTIVE`) —
  mécanisme déjà prouvé dans `gemini-video-da-brief.py`, repris tel quel.
- **Kimi K2.5** : vidéo native, mais UNIQUEMENT via l'**API Moonshot directe**
  (`https://api.moonshot.ai/v1/chat/completions`, clé `MOONSHOT_API_KEY`) — **PAS OpenRouter**
  (rejette la vidéo, `404` identique à GPT-5.6 Sol). Vidéo encodée en base64 pur
  (`data:video/mp4;base64,...`), `temperature` FORCÉE à `1` (Kimi rejette toute autre valeur).
  Détail complet : [[kimi-video-native-base64]].
- **GPT-5.6 Sol** : frames JPEG downscalées en base64, via OpenRouter (accepte les images sans
  problème, contrairement à la vidéo).

## Brief — mêmes principes que da-brief.py --upstream

Réutilise (copie textuelle volontaire, pas d'import croisé) le bloc `ANGLES_BLOCK` (5 angles :
spectateur lambda, narration/synchro, transitions vs états, AI-slop, expert du métier) + un bloc
`EXPERT_BLOCK_UPSTREAM` adapté au cas "prototype partiel" (le rendu montré ne couvre qu'une partie
de la durée finale visée — le brief doit le dire explicitement sinon le modèle juge un extrait comme
si c'était la scène complète).

**Contrainte de brief à toujours inclure** : demander explicitement de décrire l'INTENTION visuelle,
jamais de code — sans ce garde-fou, les modèles proposent du code hors-stack (`d3.geoPath`,
manipulation DOM directe) qui ne s'applique pas à notre React/Remotion/SVG frame-driven (déjà
observé sur un round précédent avec Kimi+Gemini seuls, cf `feedback_...` si applicable).

**Références de chaînes** : à adapter au registre du sujet traité, pas toujours les mêmes que le
registre Souverain classique (ex. pour un sujet mégaprojet/infrastructure : Giga Builds/Perduchan
pour identifier le vide qu'on comble, Infographics Show pour le staging caméra, Johnny
Harris/Vox Borders/RealLifeLore pour le globe-narrateur).

## Cas d'usage validé

Review de `ProtoGazoducGlobeFusion.tsx` v8 (16s) avec le script complet de l'Acte 1 en contexte
(84.68s visés) — 3 réponses substantielles obtenues, convergence forte 3/3 sur plusieurs points
(cf `memory/episodes/souverain/gazoduc-aagp-tsgp/da-brief-acte1-v8-review/SYNTHESE.md`). Coût/temps
raisonnable (~2-3 min pour les 3 appels en parallèle sur une vidéo de 16s/12Mo).

## ⭐ Bonne pratique confirmée — lister "ce qui est DÉJÀ fait" dans un brief DOWNSTREAM (2026-08-03)

Sur une review downstream (rendu proche du final, pas un prototype partiel), TOUJOURS inclure dans
le brief la liste explicite des points déjà tranchés/implémentés lors de passes précédentes — sinon
les 3 modèles re-proposent des points déjà réglés (perte de temps + dilution des vrais points neufs
dans le rapport). Cas validé : brief downstream Gazoduc Acte 1 v5 listant 10 points déjà actés
(caméra refondue, drapeaux retardés, fond uniforme, etc.) — aucun des 3 rapports n'a redécouvert un
point déjà tranché, les 3 modèles se sont concentrés sur ce qui restait réellement à corriger.
