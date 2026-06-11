# War-Map Sahel AES — STATUS

**Dernière mise à jour :** 2026-06-10 (refonte script V5 linéaire + pipeline voix vivante + audio découpé par parties)
**Branche :** `feat/da-brief-gate-warmap-sahel`
**Format :** War-Map Long 16:9, ~7min26. Voix GéoAfrique V2 (pipeline expressif V3→STS).

> ⭐ **REPRISE AU RETOUR : section "ÉTAT ACTUEL" ci-dessous.** Le chantier voix est BOUCLÉ.
> Prochaine étape = re-découpage en beats (avec alignment V5) puis coder Partie 1 (canari).

---

## ✅ ÉTAT ACTUEL (2026-06-10)

### Script — V5 LINÉAIRE LOCKED
`SCRIPT-V5-LINEAIRE-2026-06-10.md` = le script validé Aziz. Chronologie LINÉAIRE 2012→2026 (règle le bug
"timeline qui recule"), ton Tremblay, 4 parties + ouverture. Fact-check Sonar Pro appliqué
(`FACTCHECK-SONAR-V5-2026-06-10.md`). DA upstream 3 voix (`reviews-script-v5/`). Leçons Infographics Show
(`DECODE-INFOGRAPHICS-SHOW.md`). **NE PAS re-litiger le texte** (Aziz a tranché).

> Le plan "B1 sprites vivants" original est ABANDONNÉ : le problème B1 était STRUCTUREL (surcharge narrative
> de tout le script, pas juste B1). Tout a été refondu en V5 linéaire. Brouillons B1 supprimés au ménage 06-10.

### Voix — PIPELINE VIVANT VALIDÉ + AUDIO GÉNÉRÉ
- Pipeline : texte taggé V3 → Océane V3 (`CqTrL0ThT2GJVJEIiLcY`) → STS GéoAfrique (`z3gESu49naEZW8Af2Upm`,
  `eleven_multilingual_sts_v2`, **stability 0.45**). Doctrine : `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`.
- Script industrialisé : `scripts/generate-narration-expressive.py` (`--dry-run`, `--sample`, `--only-part`,
  `--sts-stability`). GÉNÉRATION PAR PARTIES (règle Aziz : jamais en bloc → réparation chirurgicale).
- Texte taggé : `SCRIPT-V5-TAGGED.txt` (5 parties marquées `### PARTIE`, tags sobres, 4 ellipses ciblées).
- **Audio FINAL généré + validé Aziz** : `public/_shared/audio/sahel-warmap/narration-v5-expressive.mp3`
  (7min26, GéoAfrique vivante). Micro-coupures non bloquantes (disparaissent sous SFX/musique).
- **Forced alignment** : `narration-v5-alignment.json` (loss 0.167, 1096 mots). Script : `sahel-align-and-split-v5.py`.
- **Découpé en 5 parties** (frontières narratives, timestamps alignment) :
  - `narration-v5-p0.mp3` (62,8s) — ouverture : hook + les 2 groupes (≈ recouvre l'Acte 1)
  - `narration-v5-p1.mp3` (35,2s) — origine 2012 / Libye / vide d'État
  - `narration-v5-p2.mp3` (104,1s) — blocage : Serval/Barkhane → échec 10 ans → Niger → CEDEAO
  - `narration-v5-p3.mp3` (111,8s) — rupture : AES naît → Kidal → reprise → Moura → 2026
  - `narration-v5-p4.mp3` (132,1s) — coût/levier/perspective : réfugiés → ressources → confédération → chute

### Coût voix (vérifié API)
TTS V3 = 1 crédit/char · STS = 1000 crédits/min. 1 narration ~8 700 crédits. Plan **Creator** ($22, 100k/mois).

---

## ▶ PROCHAINE ÉTAPE (session SAHEL — CODE) — ⭐ PLAN PRÊT
**Le découpage beats + le plan visuel Partie 1 sont FAITS et VALIDÉS. Reste = exécuter le refactor + coder.**

1. **Découpage beats** : `BEATS-V5.md` (5 parties, ~30 beats, frame-précis sur `narration-v5-alignment.json`). FAIT.
2. **Plan visuel Partie 1 (canari)** validé DA 3 voix + Aziz : direction SOUSTRACTION (flux d'encre Libye→Mali +
   taches d'impact + vide d'État par chute d'opacité + hachures tensions). PAS d'overlay, PAS d'objets (P1 abstraite).
   Détail : `BEATS-V5.md` section CANARI + `reviews-p1/da-sahel-p1-upstream-{gemini,kimi,deepseek}.md`. FAIT.
3. **⭐ PLAN DE REFACTOR : `docs/plans/2026-06-10-warmap-sahel-refactor-parties.md`** (Tasks 0-8).
   Décision Aziz : refactorer le moteur monolithique (3261 lignes) → moteur-fin + 1 fichier par Partie
   (résout le problème "tout casser à chaque édition"). Acte 1 INTACT. Démarrer par Task 0 (baseline non-régression).

### ⚠️ DÉCOUVERTE CRITIQUE (vérifiée) : triggers moteur DÉCALÉS vs audio V5 final
Le code V5 déjà câblé dans le moteur est calé sur un audio ANTÉRIEUR. Écarts mesurés vs `narration-v5-alignment.json` :
Kidal f7279→**f7084** (-195) · flotte f8683→**f8132** (-551) · Djibo f10294→**f9790** (-504) · uranium →**f10804**.
TOUT trigger récit doit être recalé sur l'alignment V5. (Source de vérité unique = `narration-v5-alignment.json`.)

> NB : le mode `acte2`/B1 actuel = LEGACY (avion/convoi, ancien plan abandonné). Sera supprimé en Task 8 après
> validation Partie 1. Du code V5 (F_KIDAL_*/F_REF_*/F_ICON_*) est déjà câblé dans le monolithe → le refactor le RÉORGANISE.

---

## ✅ ACTE 1 VALIDÉ COMME RÉFÉRENCE/BLUEPRINT
Aziz a validé l'Acte 1 (`SahelActe1-Final`) comme référence de style de la série.
**RENDER : `out/episodes/warmap-sahel/acte1-FINAL.mp4`** (1920×1080, 2300f, 77s, catbox `slchjv`).
Contient : allumage séquentiel Mali→Burkina→Niger, CEDEAO qui se rompt, flèches Liptako, jetons-combattants
(2 archétypes JNIM chèche clair / EIGS cagoule sombre), taches d'influence, friction. Timeline graduée
bas-écran (à RETIRER en V5 : le récit V5 redémarre la timeline à 2012 en Partie 1).

### Briques blueprint réutilisables (Parties 2-4)
Dispersion jetons en losange, pulse région-précise au nommage (`A1_REGION_PULSES`), grain papier
(`paper-grain.png`), vignette cinéma, respiration finale, ombres jetons. Triggers Acte 1 : Mali f150 ·
Burkina f231 · Niger f301 · CEDEAO f382 · Liptako f502 · JNIM f1198 · EIGS f1749 · friction f2167 · fin f2299.

---

## ASSETS (réutilisables)
**Jetons-combattants** : `fighter-jnim.png` (chèche clair) + `fighter-eigs.png` (cagoule sombre).
**France** : `fighter-france.png` (jeton soldats FR) + `fr-epervier/licorne/sabre.png` + `base-france.png`.
**Acte 2 (beats à venir)** : `jeton-fama.png`, `jeton-csp.png`, `base-africacorps.png`, `convoi-uranium.png`,
5 `refugie-*.png` (Djibo/Ménaka/Tillabéri Partie 4). Overlay : `GeoConvergenceOverlay.tsx` (présence FR).
**GeoJSON** : `public/_shared/geo-data/sahel/sahel-admin1.geojson` (32 régions) + `sahel-countries.geojson`.
**Faits** : `FACTS-PREPOSITIONNEMENT-2013.md` (bases FR pré-positionnées, ressert Partie 2).

---

## DOCTRINES LIÉES
- `memory/doctrines/WARMAP-LONG-DOCTRINE.md` — format long (carte permanente, overlays 3 niveaux, 5 actes).
- `memory/doctrines/WARMAP-VIVANTE-GRAMMAIRE.md` — dynamisme (R-V1..R-V4, board clearing, Ken Burns, 1 transfo/plan).
- `memory/doctrines/SCRIPT-ORAL-DOCTRINE.md` + doctrine Tremblay — niveau oral du script.
