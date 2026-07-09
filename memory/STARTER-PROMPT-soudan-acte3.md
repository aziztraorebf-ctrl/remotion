---
name: STARTER-PROMPT-soudan-acte3
description: Prompt de démarrage — produire l'Acte 3 (« Suivre l'or → Émirats/Turquie ») du mid-form Soudan. Actes 1-2 faits, Acte 3 NON ÉCRIT (script à rédiger d'abord).
metadata:
  type: project
---

# STARTER — SOUDAN ACTE 3 (« SUIVRE L'OR »)

> Actes 1 (v5-FINAL) et 2 (« Blocage », complet & poli) sont FAITS. L'Acte 3 est NON ÉCRIT :
> la première étape est la PRÉ-PROD SCRIPT, pas le code.

## Avant toute réponse technique, lis dans cet ordre :
1. `memory/episodes/soudan-midform/STATUS.md` — état complet (Actes 1-2 faits, ce qui reste).
2. `memory/projects/soudan-midform-ACTE3-NOTE-ACTEURS-EXTERNES.md` — trous recherche à combler
   (Russie/Wagner-or-sanctions + Égypte) AVANT d'écrire l'acte (si le fichier existe).
3. `memory/projects/soudan-midform-DONNEES.md` — données/faits fact-checkés (or RSF → Émirats/Turquie).
4. `memory/projects/soudan-midform.md` — point d'entrée pré-prod du sujet.
5. `memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md` + `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md`.

## Étapes de la session (ordre) :
1. **Combler les trous recherche** (Russie/Wagner, Égypte) → fact-check.
2. **Écrire le script Acte 3** (« suivre l'or → Émirats/Turquie », acteurs externes) → jury LLM 3 modèles → lock.
3. **Générer l'audio** (`scripts/generate-narration-expressive.py`, Océane V3 → STS GéoAfrique) → whisper-align.
   ⛔ **Scanner `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`** (méthode gravée Acte 2) : é toniques finaux
   à reformuler, 2-3 gros blocs, silences 0.7s, stability 0.45, audit à l'oreille (whisper ne juge PAS la
   prononciation). + `[[TTS-V3-TAGS-REGLES]]`.
4. **Storyboard registres** (proposer, valider Aziz) PUIS breakdown PUIS code sur le socle carte.

## Socle technique déjà là (réutiliser tel quel, NE PAS re-coder) :
- Moteur carte : `src/projects/warmap/engine/SoudanWarMapEngine.tsx` (1 Map continue, grammaire AES).
- Références code : `src/projects/warmap/soudan-acte1/SoudanActe1.tsx` + `soudan-acte2/SoudanActe2.tsx`.
- Briques signature (cf `WARMAP-GRAMMAIRE.md` §8) : `TwoFaceToken`, `YearCounter`/`KmCounter`,
  `BlocImpasseB6`, `KhartoumEtatMajorSVG`, supply vivante, forces figées — adapter, pas dupliquer.
- Assets : `public/_shared/sprites/warmap/` (portraits nets, mine-or-td, base-saf-td, tank/tech).

## Non-négociables :
- Grammaire AES (contour permanent, halos locaux jamais d'aplat), zoom serré + drift, jetons taille écran fixe
  (rétrécir au dézoom, cf fix Acte 2 beat 9).
- ⛔ **R-V5 objet orphelin** : un objet figuratif sur la carte doit être NOMMÉ par la voix, sinon confus
  (rejets palais + mine Acte 2). Cf `WARMAP-GRAMMAIRE.md` §8.
- ⛔ Nom propre à l'écran → orthographe Wikipédia AVANT render (`Hemedti`, `al-Burhan`, + nouveaux acteurs).
- Sprite bitmap : PAS de scale oscillant continu (flou). Render plein format (scale=1). Review = signal jamais juge.
- ⚠️ AVANT ACTE 3 : promouvoir l'Acte 2 en FINAL une fois verdict Aziz + SFX validés
  (`out/episodes/soudan-midform/wip/acte2-FINAL.mp4`).
