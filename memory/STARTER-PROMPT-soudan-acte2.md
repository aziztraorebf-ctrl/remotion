---
name: STARTER-PROMPT-soudan-acte2
description: Prompt de démarrage — produire l'Acte 2 (Blocage) du mid-form Soudan sur le socle carte validé. Acte 1 fait, plan registres gravé.
metadata:
  type: project
---

# STARTER — SOUDAN ACTE 2 (BLOCAGE)

> Colle ce prompt en début de session pour reprendre la production Soudan à l'Acte 2.
> Acte 1 = FAIT (v5-FINAL, candidat validé). Branche : `feat/warmap-insert-2factions`.

---

## LE PROMPT (à donner à Claude)

Reprise Soudan mid-form — on produit l'**ACTE 2 (« Blocage »)** sur le socle carte validé. L'Acte 1 est fait et validé.

**Avant toute réponse technique, lis dans cet ordre :**
1. `memory/episodes/soudan-midform/STATUS.md` — état complet (Acte 1 v5-FINAL fait, ce qui reste).
2. `memory/projects/soudan-midform-STORYBOARD-ACTE2.md` — ⭐ LE storyboard Acte 2 : 9 beats + corrections factuelles + **plan de mise en scène gravé (répartition registres)** + définition insert/bloc + jeton 2-visages (symbole signature).
3. `memory/projects/soudan-midform-AUDIO-ETAT.md` — l'audio Acte 2 est **PÉRIMÉ à régénérer** (voir §AUDIO ci-dessous).
4. `memory/projects/soudan-midform-DONNEES.md` — données/faits fact-checkés du sujet.
5. `src/projects/warmap/soudan-acte1/SoudanActe1.tsx` — ⭐ le CODE de l'Acte 1 (référence : moteur, jetons, insert, ligne de front, caméra — réutiliser les patterns tels quels).
6. `memory/doctrines/WARMAP-GRAMMAIRE.md` (2 ⭐⭐ en tête) + `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md`.

**Le socle technique (déjà là, réutiliser) :**
- Moteur carte : `src/projects/warmap/engine/SoudanWarMapEngine.tsx` (1 Map continue, grammaire AES : contour permanent + intérieur vide, halos locaux, "on nomme → ça se trace").
- Insert état-major **beat 5 (assaut RSF sur Khartoum : aéroport/palais/TV)** = `src/projects/warmap/KhartoumEtatMajorSVG.tsx` — ⭐ DÉJÀ PROTOTYPÉ + VALIDÉ Aziz (registre médaillon gravé). ⛔ NE PAS re-tester PixelLab (le storyboard le disait, c'est périmé) : l'insert est prêt, NEXT = l'assembler sur la narration beat 5.
- Blocs (concept abstrait) **beat 6 (territoire vs puissance de feu)** = `src/projects/warmap/_shared/warmapChoc.tsx` + `KhartoumChocSVG.tsx` / `FrontOuvertSVG.tsx`.
- Assets sprites déjà générés (Acte 1) dans `public/_shared/sprites/warmap/` : `portrait-hemeti.png`, `portrait-burhan.png` (encre nette), `mine-or-td.png`, `base-saf-td.png`, `tank-td-blue.png`, `tech-td-red.png`.

**⭐⭐ PLAN DE MISE EN SCÈNE (gravé + validé Aziz, dans STORYBOARD-ACTE2) — répartition des registres :**
- Beats 1-4 (alliance→scission) = CARTE Mapbox + **jeton 2-visages** (naît quand ils s'allient 2021 → se fend "qui commande ?" → se sépare en 2 avril 2023).
- Beat 5 (assaut Khartoum) = **INSERT état-major** (`KhartoumEtatMajorSVG`, déjà validé).
- Beat 6 (territoire vs puissance de feu) = **BLOC** (concept abstrait, `FrontOuvertSVG`/`warmapChoc`).
- Beats 7-8 (immensité/ravitaillement + front figé) = **CARTE** (spatial : dézoom immensité, ligne de ravitaillement est→ouest qui s'amincit ; front quasi-figé + pulse or Darfour = pont Acte 3).
- Beat 9 = dézoom hors Soudan (pont Acte 3).
- ⛔ Distinction INSERT (lieu réel figuratif gravé) vs BLOC (concept/rapport de force abstrait géométrique) : gravée dans STORYBOARD-ACTE2, ne pas les confondre.

**⛔ AUDIO ACTE 2 = À RÉGÉNÉRER (première étape) :**
- L'audio actuel (`catbox pco5ra`) est PÉRIMÉ (généré avant la correction temporelle). Il n'est PAS sur disque.
- Corrections de texte à appliquer : « depuis deux ans » → « depuis **plus de trois ans** » · « personne ne peut gagner » → « personne **n'a pu** gagner ».
- ⚠️ Point date à trancher : le fact-check article the-conversation dit « ~2,5 ans » (avril 2023→maintenant). Le script dit « 3 ans ». Trancher selon la date de publication visée AVANT de générer.
- Pipeline : `scripts/generate-narration-expressive.py` (Océane V3 → STS GéoAfrique). Scanner `[[TTS-V3-TAGS-REGLES]]` + règles FR (participes é/ée, ont+voyelle, nombres en lettres) AVANT génération. Sortir sous `public/_shared/audio/soudan/acte2-*.mp3`.
- Puis whisper-align (`scripts/tools/whisper-align.py`) pour câbler les frames au mot.

**Non-négociables (mêmes que l'Acte 1) :**
- Grammaire AES (contour permanent, halos qui rayonnent, jamais d'aplat), zoom serré + drift, jetons taille écran fixe.
- ⛔ Nom propre affiché à l'écran → vérifier orthographe Wikipédia AVANT render (`Hemedti` avec le D, `al-Burhan`). Cf `[[feedback_nom-propre-ecran-verifier-wikipedia]]`.
- Sprite bitmap : PAS de scale oscillant continu (= flou). Cf `[[key-learnings]]` (2026-07-07).
- Render plein format (scale=1). Review = signal jamais juge (recette Gemini vidéo + Kimi frames : `memory/episodes/soudan-midform/reviews-acte1/SYNTHESE-ET-RECETTE.md` + `scripts/tools/gemini-video-review-custom.py` / `kimi-frames-review.py`).
- Corrections factuelles storyboard (coup 2021 ≠ bataille, vraie bataille = 15 avril 2023) déjà intégrées — les respecter.

**Ordre de session proposé :** (1) régénérer audio Acte 2 (date tranchée) + whisper → (2) coder les beats sur le socle selon la répartition registres → (3) assembler le beat 5 insert (prêt) → (4) render plein format → (5) présenter à Aziz. Proposer le plan de session AVANT de coder.

**Acte 3 (pour info, après Acte 2)** : « suivre l'or → EAU/Turquie », fact-check confirme (or RSF → Émirats). Note acteurs externes : `memory/projects/soudan-midform-ACTE3-NOTE-ACTEURS-EXTERNES.md`. Actes 3-4 non écrits.
