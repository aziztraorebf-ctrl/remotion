# AUDIT AMÉLIORATIONS — Partie 1 (Origine 2012 / Libye / vide d'État)

> ⛔⭐ **CORRECTION AZIZ 2026-06-27 — NE PAS UTILISER LE `tension-drone`.** L'audit ci-dessous recommande un
> drone d'assise continu (points #1, #3, #4). DÉCISION AZIZ : le grondement `tension-drone` DÉRANGE → il a été
> RETIRÉ du corps de l'Acte 1, et NE DOIT PAS être câblé sur P1 (ni les autres scènes). La MUSIQUE de fond
> (`score-epic.mp3`, vol 0.10) suffit comme lit sonore. → Pour P1 : garder les SFX PONCTUELS (ping carto à la
> pose, ink-spread sur les zones, impact sur les chutes de villes) MAIS ignorer toute mention de "drone d'assise".

> Audit LECTURE SEULE 2026-06-27. Jugé sur le LIVRABLE RÉEL (`out/episodes/warmap-sahel/p1-FINAL.mp4`,
> 35.2s, 9 frames extraites + analyse audio RMS/volumedetect) PUIS sur le code
> (`src/projects/warmap/parties/Partie1Origine.tsx` + câblage `engine/SahelWarMapEngine.tsx` mode `partie1`).
> AUCUN fichier corrigé. Un autre agent appliquera. Trié par IMPACT décroissant.

## RÉSUMÉ (3 lignes)
- **État général** : la chorégraphie VISUELLE de P1 est solide et déjà au standard "carte vivante" (board-clearing → pulse Libye → trait d'encre route réelle → 3 taches villes avec pulse+teinte persistante → propagation interne → vide d'État + hachures). Direction "soustraction" cohérente, palette parchemin tenue, grammaire causale globalement respectée.
- **Le trou MAJEUR est SONORE** : P1 (mode `partie1`) n'a AUCUN bloc SFX dédié dans l'engine. Tous les événements visuels forts sont MUETS (pulse Libye, tracé du trait, 3 impacts villes, hachures). Pas de drone d'assise. Seuls jouent la narration + un voile musical fin (~-30 dB) → temps morts sonores aux respirations de la voix.
- **3 prioritaires** : (1) câbler un bloc SFX `partie1` (drone + ping/ink-spread/impacts) ; (2) sonoriser les 3 chutes de villes (impact sourd) ; (3) vérifier le raccord audio/visuel avec l'Acte 1 refait (le drone d'assise existe en `acte1Refonte` mais s'arrête, P1 enchaîne sec).

---

## (A) VRAIS MANQUES — à corriger

### 1. [GLOBAL / SON] P1 n'a AUCUN SFX — tous les événements visuels sont muets · IMPACT FORT · EFFORT MOYEN
- **Constaté (render + code)** : dans `SahelWarMapEngine.tsx`, les blocs SFX existent pour `acte1Refonte`, `acte2`, `partie2`, `partie3` — **rien pour `partie1`**. Seuls jouent la narration globale (`narration-v5-expressive.mp3`) + la musique `score-epic.mp3` à `volume={0.10}`. Vérifié à l'oreille des chiffres : zones de respiration de la voix à -30/-32 dB mean (musique seule, très fine), vs -18 dB en parole. Le pulse Libye, le tracé du trait, les 3 stamps de villes, la montée des hachures = **0 son**.
- **Technique arsenal** : ajouter un bloc `{partie1 && !acte1CameraOnly && (...)}` sur le modèle de celui d'`acte1Refonte` : `tension-drone.mp3` (vol ~0.14-0.18) en assise continue du début à la fin ; `sfx-map-ping.mp3` discret à la pose du repère LIBYE et du tracé ; `ink-spread.mp3` doux sur l'apparition des hachures (vide d'État) ; `impact.mp3`/`boom-coup.mp3` sourd sur chaque chute de ville (voir #2).
- **Risque** : sur-mixer. Garder plancher bas (sous voix). Tout en `<Sequence>`, jamais `frame===X`. Caler les `from=` sur les triggers RÉELS du code (F_PULSE=2210, F_TRAIT=2305, F_IMPACT≈2369, F_TENSIONS=2844) — PAS sur le timeline local du render (le render est un subclip).

### 2. [~16-20s · chute des villes] 3 taches d'impact (Kidal/Gao/Tombouctou) poppent sans aucun son · IMPACT FORT · EFFORT QUICK WIN
- **Constaté** : frames f_16→f_24 montrent les taches rouges + ondes radar + teinte persistante des 3 villes (très bien visuellement). À l'oreille : muet. Or l'arrivée du trait sur Kidal puis la propagation interne vers Gao/Tombouctou sont les beats les plus "événementiels" de P1.
- **Technique arsenal** : `impact.mp3` (ou `boom-coup.mp3` atténué) sur chacun des 3 `F_IMPACT + delay` (Kidal delay 0, Gao 42, Tombouctou 50 — déjà dans le code, IMPACTS[]). Cascade de 3 impacts = sensation de contagion. Sous-mixer le 1er (Kidal, entrée) plus net, les 2 autres en écho.
- **Risque** : faible. Sous-cas du #1 ; listé à part car c'est le quick win le plus rentable.

### 3. [~9-11s · pulse Libye] L'effondrement (onde-radar 3 cercles) est l'événement déclencheur et il est muet · IMPACT FORT · EFFORT QUICK WIN
- **Constaté** : f_8→f_12 montrent le repère LIBYE + (selon le code F_PULSE=2210) l'onde-radar d'effondrement. C'est LA cause de toute la chaîne (le flot d'armes part de là). Muet → la cause ne "frappe" pas.
- **Technique arsenal** : un `boom-coup.mp3` grave/sourd unique au pic du pulse (effondrement = gravité), + amorce du `tension-drone` qui démarre ICI et tient jusqu'à la fin (l'assise naît de l'effondrement).
- **Risque** : faible. Choisir un son d'effondrement (sourd) et pas un "whoosh" — cohérent avec le registre encre/soustraction.

### 4. [GLOBAL · raccord Acte 1 → P1] Continuité sonore et visuelle du board-clearing à vérifier · IMPACT MOYEN · EFFORT MOYEN
- **Constaté** : le début du render (f_0.5→f_5.5) montre les jetons métalliques de l'Acte 1 (labels EIGS, etc.) en cours d'effacement (board-clearing, jetons→0.05) AVANT que "2012" s'inscrive (F_2012=2102). C'est le raccord voulu. MAIS : l'Acte 1 refait (`acte1-FINAL.mp4`, 2026-06-27, le drone d'assise s'arrête à `A1.END`) enchaîne sec sur un P1 sans drone → rupture sonore au point de jointure. Visuellement le board-clearing est correct, mais à confirmer une fois les deux concaténés (registre/palette OK sur frames isolées).
- **Technique arsenal** : faire DÉBORDER le `tension-drone` de P1 dès le board-clearing (couvrir la jointure), et vérifier que la palette/grain du board-clearing P1 == fin Acte1 refait (les deux héritent `isFinalLook`, donc a priori OK — à valider sur la concat réelle, pas sur frames isolées : règle "fichiers de navigation périment / juger le livrable").
- **Risque** : ne se juge VRAIMENT qu'après concat Acte1+P1. Ne pas sur-corriger à l'aveugle.

---

## (B) DÉJÀ BON — NE PAS CASSER

- **Trait d'encre = route réelle** (Sebha→Ghat→Passe de Salvador→NE Mali→Kidal, `ARMS_ROUTE`), pas une ligne droite. Tracé animé via `stroke-dashoffset`, double trace (large atténuée + nette). Excellent, conforme doctrine géo-zéro-approximation. **Garder.**
- **Grammaire causale respectée** : Libye s'effondre (CAUSE) → trait descend (FLUX) → Kidal tombe à l'arrivée du trait → propagation interne Kidal→Gao/Tombouctou (CONTAGION) → taches. Aucun état qui "poppe" sans cause amont. La teinte persistante des villes + veine résiduelle préparent le "vide d'État". **Garder.**
- **Vide d'État** : chute d'opacité du `sahel-fill` au mot "absent" (F_ABSENT=2743, géré engine) + hachures rouge-sombre bornées au polygone `VOID_ZONE` + teinte diffuse sous les hachures. Lecture "le territoire respire la tension". **Garder.**
- **Pulse villes** : onde radar 2 cercles + teinte persistante à chaque chute = effet vivant par beat, pas de carte nue. **Garder.**
- **Labels villes** : encre serif + halo de réserve parchemin (paintOrder stroke) au lieu d'une boîte blanche. Lisible sur taches/hachures. **Garder.**
- **Direction "soustraction"** validée DA 3 voix + Aziz : PAS d'overlay, PAS d'objets/jetons en P1 (origine 2012 = 100% cartographiable). Ne PAS ajouter de sprites/objets — l'arsenal "jetons/maillon/sceau" est pour P2+, l'introduire ici casserait la direction validée.

---

## TECHNIQUES DE L'ARSENAL VOLONTAIREMENT NON RETENUES POUR P1 (et pourquoi)
- **SVG-insert** : le doc `SVG-INSERTS-CANDIDATS.md` conclut explicitement que TOUT le flot d'armes / origine reste Mapbox (flux géo situé). Ne PAS SVG-iser P1. (Seul candidat SVG = franc CFA en P4, déjà produit.)
- **MAILLON DE RUPTURE / sceau AES / contours nationaux colorés / drapeaux WarMapBanner** : briques de rupture/souveraineté (P3/P4). Hors-sujet pour l'origine 2012. Les introduire casserait la "soustraction".
- **Effets particules / 3D pitch** : déjà tranché RETIRÉ (carte plate sans relief Mapbox). Ne pas re-proposer.

---

## CE QUE JE N'AI PAS PU JUGER (→ validation Aziz)
- **Perception audio fine** : je mesure des niveaux (RMS/dB), je n'entends pas le mix. "Drone trop présent / ping qui fatigue / impact trop sec" = jugement d'Aziz. Mon constat factuel : événements visuels MUETS, c'est objectif ; le DOSAGE des SFX à ajouter est du goût.
- **Émotion / rythme ressenti** : la cadence des 3 chutes de villes, la durée du temps mort à l'effondrement Libye "tiennent-elles" émotionnellement → à valider en visionnage.
- **Raccord réel Acte1→P1** : jugé sur frames isolées (palette OK), PAS sur la concat montée. Le saut de drone à la jointure ne se confirme qu'après assemblage (cf. PLAN-ASSEMBLAGE-FINAL.md). Ne corriger #4 qu'à ce moment.
- **Triggers exacts vs render** : le render `p1-FINAL.mp4` est un subclip ; je n'ai pas vérifié frame-à-frame que F_PULSE/F_TRAIT/F_IMPACT du code tombent au bon mot dans CE render (le code dit qu'ils sont calés sur `narration-v5-alignment.json`). À reconfirmer avant de poser les `from=` SFX.
