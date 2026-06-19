# ARCHIVE NEXT-ACTION — historique purgé le 2026-06-18
> Sections terminées/acquises retirées de NEXT-ACTION.md pour l'alléger. Conservées ici pour référence.
> Restauration : ces blocs étaient dans memory/NEXT-ACTION.md avant l'élagage du 2026-06-18.

## 🟢 (archive) WAR-MAP SAHEL : Acte1 ✅ · P1 ✅ · P2 ✅ · P3 ✅✅ VALIDÉE DÉFINITIVEMENT (2026-06-13)

> ⭐ **ÉTAT (2026-06-13)** : P3 "La Rupture" VALIDÉE par Aziz. Full HD `out/episodes/warmap-sahel/p3-FINAL.mp4`
> (1920x1080, 1min50, audio embarqué, catbox ck26kl). wip P3 purgés. Détail : `STATUS.md` section "P3 VALIDÉE".
>
> **▶ PROCHAINE SESSION = P4 "Coût / Levier / Perspective" — LA DERNIÈRE PARTIE.**
> ⭐ **LIRE EN PREMIER : `memory/episodes/warmap-sahel/BRIEF-PASSATION-P4.md`** (brief autonome complet :
> état vidéo, ordre de démarrage strict, découpage beats f9410→f12996 déjà fait dans BEATS-V5, assets/briques,
> réutilisation contours nationaux, doctrine, méthode). Après P4 → il ne reste que l'ASSEMBLAGE FINAL.
>
> Ordre P4 (strict) : 1. PLAN-NARRATIF-P4 (phrase par phrase) → 2. DA-brief upstream → 3. coder (copier
> Partie3Rupture, mode moteur `partie4` à créer). Audio prêt : `narration-v5-p4.mp3` (132s).
> ✅ Les 4 parties sont en FINAL (acte1/p1/p2/p3-FINAL.mp4) — P1 promu/re-rendu full HD le 2026-06-14.
>
> **✅ FAIT 2026-06-14 — "fond qui respire" RÉSOLU** via CONTOURS NATIONAUX colorés (Mali ocre / Burkina brique
> / Niger sarcelle) + draw-in + pulse + effacement sous overlay, UNIQUEMENT sur parties épurées (P3 ; Acte1/
> Acte2/P1 intouchés). p3-FINAL.mp4 régénéré full HD avec contours. Commits 1b82633 + 11eacf8. Code nettoyé.
>
> NOUVEAUTÉS RÉUTILISABLES : brique `WarMapOverlayDynamic` (overlay dynamique, 6 blocs composables) + doctrine
> `REVIEW-PREMIUM-TEMPLATE.md`. ⚠️ Bug noté : Gemini Files API vidéo ne "voit" pas la vidéo → review vidéo = FRAMES.

**ÉTAT (2026-06-12) — P2 NARRATIVE VALIDÉE Aziz ("très bon point d'équilibre, on garde").**
La P2 refondue 4 fois : SVG plat (rejeté) → premium "états" (confus) → grammaire CAUSALE (validé).
Render final : `out/episodes/warmap-sahel/p2-FINAL.mp4` (audio embarqué, catbox gfsa3h).
Reste sur la vidéo : **P3 + P4 + assemblage**. ~moitié derrière. SYSTÈME rodé (briques + méthode + doctrine causale).

**▶ PROCHAINE ACTION = P3 "La Rupture" — SESSION PARALLÈLE (pas la session courante, contexte chargé).**
Ordre STRICT (brief P3) : 1. REPRÉVOIR LE VISUEL (PLAN-NARRATIF-P3, phrase par phrase, comment ça s'expose sur
la carte) → 2. DA-brief upstream → 3. coder (copier `Partie2Blocage.tsx`, PAS Proto24 = legacy).
P3 = AES naît (Liptako or) · Kidal repris (FAMa+Africa Corps) · Moura (flashback) · 2026 attaques repoussées.
Triggers vérifiés + assets + briques : tous dans BRIEF-PASSATION-P3.md.

**LEÇONS gravées (`key-learnings.md` 06-12)** : grammaire CAUSALE (jetons avancent→sillage→effet) · audio-first ·
combiner l'arsenal · jeton=cercle (pas portrait nu) · donnée se MONTRE (contour qui se remplit) · SFX si support visuel.

---

## ✅ PESTE 1347 — ASSEMBLAGE COMPLET (2026-06-08, 3 sessions) — EN ATTENTE RETOURS

**Mid-form Atlas COMPLET et assemblé.** Livrable : `out/PRET-PUBLICATION/peste-1347-FINAL.mp4` (1min43s).
**Lien render final (Aziz l'a gardé) : https://litter.catbox.moe/xl5tmz.mp4 (litterbox 72h → expire ~11 juin).**

**Tout ce qui a été fait (3 sessions 06-08) :**
- Bugs corrigés : écrans noirs (localF standalone), queues mortes (durationInFrames absolu),
  caravane brisée (assets empire-ghana), outre-mer rouges (clipPath Europe Beat2/3/4).
- Améliorations Gemini downstream (da-compare ×2 vs Mansa Moussa, TOUTES validées) : zoom caméra suit
  la caravane · trace dorée (remplace triangle) · frontières Mali ocre · bateau Beat5 agrandi+ralenti ·
  easing caravane Beat4 · zoom continu Beat5 · musique CONTINUE (1 morceau au concat, fini les coupures).
- 3 sources affichées (Beat3 al-Maqrizi+Britannica, Beat4 Parasites&Vectors+JHU, Beat5 Ibn Battuta+WHE).
- Sous-titres sobres analyste (forced-alignment EL + couche Remotion ProRes overlay, ffmpeg local sans libass).

**⏳ PROCHAINE SESSION = COURTE.** Aziz visionne en parallèle, donnera ses observations s'il reste des
retouches. Il pense que c'est complet. Reprise : `memory/episodes/peste-1347/STATUS.md` (3 sessions détaillées)
+ `key-learnings.md` (4 learnings durables 06-08). Beats finaux dans wip/ : beat1/2/6-v5, beat3/4/5-v6.
Assemblage = `/tmp/peste-concat-v8.txt` + musique music-c-desert + overlay /tmp/peste-subs.mov
(NB : /tmp purgé au reboot → re-générer la couche subs via compo `PesteSubtitles` si besoin).

**NON BLOQUANT (avis Gemini, si Aziz veut une passe) :** propagation peste = aplat rouge (vs tracé SVG
organique), encarts texte (signature Atlas — désaccord goût), océan sans texture.

---

## ✅ LANCEMENT KORA & CARTES — TERMINE DEFINITIF (2026-06-07)

Architecture finale validée : **TryPost (MCP) = YT+IG+FB** | **Postiz (REST) = TikTok ONLY**
7/7 vidéos programmées sur les 2 outils, coverB (frame 0 forte) partout.

| Date | Video | TryPost (YT+IG+FB) | TikTok (Postiz) |
|------|-------|---------------------|------------------|
| 9 juin | or-africain | ✅ | ✅ |
| 9 juin | vraie-taille | ✅ IG+FB seulement | ✅ |
| 11 juin | senegal-short | ✅ | ✅ |
| 11 juin | mansa-moussa | ✅ | ✅ |
| 13 juin | empire-ghana | ✅ | ✅ |
| 13 juin | sonjata | ✅ | ✅ |
| 16 juin | silicon-savannah | ✅ | ✅ |

Logs : `scripts/tiktok-schedule-log.json` (Postiz TikTok) + IDs TryPost dans ORDRE-POSTS-POSTIZ-SAUVEGARDE.md.
**SESSION SEPAREE en attente** : passe editoriale angle militant (`TODO-PASSE-EDITORIALE-ANGLE-MILITANT.md`).

---

## 🔥 WAR-MAP SAHEL — script V5 + voix BOUCLÉS, place au CODE (2026-06-10)

> ⭐ **LIRE `memory/episodes/warmap-sahel/STATUS.md` EN PREMIER** — état complet à jour.

**Le chantier VOIX est terminé.** Acquis cette session :
- **Script V5 LINÉAIRE LOCKED** (`SCRIPT-V5-LINEAIRE-2026-06-10.md`) — refonte structurelle (le problème B1
  était une surcharge narrative de TOUT le script, pas juste B1). Fact-check Sonar appliqué. Plan B1 sprites ABANDONNÉ.
- **Pipeline voix vivante** validé + industrialisé : `scripts/generate-narration-expressive.py` (texte taggé
  V3 Océane → STS GéoAfrique stability 0.45). Doctrine : `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`.
  Règle gravée : générer PAR PARTIES, jamais en bloc (réparation chirurgicale `--only-part`).
- **Audio FINAL généré + validé Aziz** : `narration-v5-expressive.mp3` (7min26) + découpé en 5 parties
  (`narration-v5-p0→p4.mp3`) + forced alignment (`narration-v5-alignment.json`, loss 0.167).
- Plan EL : passé à **Creator** ($22). 1 narration ~8700 crédits.

**← PROCHAINE ÉTAPE (session SAHEL, code) : EXÉCUTER LE PLAN DE REFACTOR.**
- ⭐ **PLAN : `docs/plans/2026-06-10-warmap-sahel-refactor-parties.md`** (Tasks 0-8). DÉMARRER PAR Task 0
  (render baseline Acte 1 = filet non-régression) puis Task 1.
- Décision Aziz : refactorer le moteur monolithique (3261 lignes) → moteur-fin + 1 fichier par Partie.
  La War-Map a un ÉTAT CONTINU (≠ Atlas/Souverain beats indépendants) → 1 moteur conteneur + `<PartieX ctx={...}/>`.
- **Découpage beats FAIT** : `BEATS-V5.md` (5 parties, frame-précis). **Plan visuel Partie 1 FAIT** (DA 3 voix + Aziz) :
  SOUSTRACTION (flux d'encre + taches d'impact + vide par opacité + hachures). PAS d'overlay/objets en P1.
- ⚠️ **Triggers moteur DÉCALÉS** vs audio V5 (Kidal -195, flotte -551, Djibo -504). Recaler sur `narration-v5-alignment.json`.
- Acte 1 visuel INTACT (le refactor ne le touche pas ; retirer timeline curseur + recaler ses triggers plus tard).
- **Registre à enrichir (Aziz)** : objets Gemini encre top-down sur la carte (drapeau P3 "flotte", or/uranium P4) — à générer le moment venu.

**DÉCISION STRUCTURANTE conservée — JETONS, PAS VÉHICULES (format LONG) :** jetons circulaires (abstraction
lisible à toute échelle). 2 archétypes (chèche clair JNIM / cagoule sombre EIGS). Voir `DECISION-jetons-vs-vehicules.md`.

**Acte 1 = référence/blueprint validée** (`acte1-FINAL.mp4`, catbox `slchjv`). Briques réutilisables : pulse
région au nommage, grain papier, vignette, dispersion jetons losange, ombres. Détail : `STATUS.md`.

---

## 🆕 3e PILIER VALIDE (2026-06-05) — War-Map / Carte temporelle vivante

Prototype Soudan COMPLET validE. C'est le **3e pilier** (apres Souverain + Atlas), a structurer aux
MEMES procedures rigoureuses. Toutes les briques + regles sont sauvegardees :
- **Doctrine** : [[doctrines/WARMAP-PLAYBOOK]] (differentiel + 4 briques + R1-R6 regles design + recette sprites + ouvertures).
- **Etat/compositions** : [[episodes/warmap-daybyday/STATUS.md]]. **Decode genre** : [[DECODE-daybyday-warmap]].
- ⭐ POINT D'ENTREE : `src/projects/warmap/WARMAP-INDEX.md`. Base code : `src/projects/warmap/engine/WarMapEngine.tsx`. LA reference = compo `SudanWarMapEpic60` (60s, catbox 4dwqit).

**⭐ PROCHAINE SESSION = consacree a ce pilier, en 2 axes :**
1. **PHASE RECHERCHE (massif, le coeur)** : garantir les BONNES infos AVANT de construire. Sources OSINT
   (ISW/ACLED/LiveUAmap/DeepStateMap), jalons par date, verif factuelle, schema de donnees (1 fichier
   jalons -> tout en derive). C'est ce qui rend le pipeline recurrent realiste (code fait 1x, donnees repetees).
2. **STRUCTURER le pilier sans reinventer la roue** : skill `warmap-preproduction` (miroir
   souverain/atlas-preproduction), pipeline beat scorE si pertinent, basculer moteur sur d3-geo pur.

Les briques/templates sont DEJA fournis (ne pas reconstruire) — la prochaine session = recherche + structure.

**🎨 DECISION POLISH OUVERTE (Aziz, a trancher) — l'horloge sous la date.**
Le 2e chiffre sous la date (ex. `18:46:58`) est une FAUSSE horloge cosmetique (formule `frame*137+8h % 24h`,
ne mesure RIEN) — emprunt au genre mapsinanutshell pour la sensation "temps reel". Probleme : c'est un
mensonge visuel, or notre differentiel = honnetete/comprehension. **Remplacer par (reco Claude #1) :
`JOUR 543`** = nb de jours depuis le debut du conflit (vrai, se calcule date courante - date debut,
defile comme l'horloge mais avec du SENS : "543 jours que ca dure"). Alternatives : `RSF 58% · SAF 42%`
(% controle territorial, plus analyste mais charge avec le compteur morts) · label phase (redondant avec
bandeau bas) · rien (epurer). Changement = ~2 lignes dans `src/projects/warmap/engine/WarMapEngine.tsx` (bloc `totalSecondsFake`).
A inscrire dans WARMAP-PLAYBOOK une fois tranche.

---

## 🆕 IDEE A ESSAYER (Aziz 2026-06-05) — Vue top-down "manoeuvre tactique" pour Hannibal/Cannes

Ne sortira PAS pendant la session courante (prototype Sudan war-map). A reprendre plus tard.

**L'idee** : le moteur top-down qu'on vient de batir pour la war-map (unites posees a plat sur
carte parchemin, deplacees en coordonnees, orientees selon la marche) comble le REGISTRE MANQUANT
de Hannibal : la **manoeuvre tactique de masses** (Cannes = double-enveloppement, ligne courbe). Ni
voyage (carte strategique d3-geo), ni melee (PixelLab lateral) — l'echelle intermediaire qui ne se
lit QUE du dessus. Retirer les overlays "morts estimes" etc. -> registre Atlas pur.

**Forme des unites** (garde-fou) : PAS un sprite-soldat top-down (= tache illisible, raison du rejet
BazBattles d'hier). Utiliser des **cercles/jetons avec un still dedans** OU une **plaque-etendard de
manipule** (le "bloc a nous" cherche dans [[DECODE-bazbattles-manoeuvres]], pas un rectangle).
**Recette Gemini validee** ([[feedback_sprites-topdown-gemini-vs-recraft]]) + idee Aziz : donner en
REFERENCE nos persos PixelLab existants a Gemini -> jetons coherents avec nos acteurs.

**Vocabulaire de manoeuvre** : deja decode ([[DECODE-bazbattles-manoeuvres]] — ligne courbe = Cannes,
flanquement, echelon). **Differentiel** : alterner top-down (manoeuvre lisible) <-> PixelLab lateral
(melee incarnee) = l'echelle que BazBattles ne fait pas. Les 3 registres coexistent dans une scene.

Base technique reutilisable : `src/projects/warmap/engine/` (WarMapEngine + warmapVehicles +
sprites Gemini top-down). Voir [[DECODE-daybyday-warmap]].

---

## ✅ FAIT 2026-06-03 — A (double audit) + B (faisabilite Atlas) — voir suite pour NEXT

### A. DOUBLE AUDIT doctrine "inspiration externe" — ✅ TERMINE (commit b110ac9)
Croise Claude principal + agent vierge. 7 trous corriges + testes : E1 SFX (3 faux negatifs),
self-review `--file` requis + gate marqueur, E4 blur->ERROR, E2 non auto-desarme, seuil 10/12
reel, prompt Gemini parametre, plafond simultaneite requalifie (non outille = honnete).
Branche `fix/audit-gates-mapbox-inspiration-externe`. A MERGER dans master quand Aziz valide.

### B. FAISABILITE Atlas — ✅ GO PROUVE (commit 90c0fe0)
Aziz a pris le Route Pack mapanimation (19,99$, 40 generations). Decode 7 refs. **Verdict :
d3-geo headless = bon moteur (clipPath deja eprouve en render, mieux que Mapbox).** Brique
`AtlasAttackArrow.tsx` codee + polishee + validee render (fleche tactique sequentielle, mode
carte light). 3 decouvertes durables dans `feedback_atlas-inspiration-externe-faisabilite.md`
+ `atlas-pixellab-differentiel.md`.

## ⏳ PROCHAINE SESSION — ATLAS : retour aux sources FAIT, place au playbook vivant

> **VIRAGE MAJEUR 2026-06-03 (Aziz)** : le playbook Atlas se derive de Ghana + Mansa Moussa
> (nos 2 Atlas validees), PAS de mapanimation (externe) ni de sujets hypothetiques (Cannes/Hannibal).
> Doctrine : `feedback_atlas-retour-aux-sources-ghana-mansa.md`. Playbooks : `memory/doctrines/ATLAS-*.md`.

**FAIT cette session :**
1. ✅ Fleches tactiques (`AtlasAttackArrow` + `AtlasEncirclement` + projections geoUtils) — GARDE
   comme template "enrichissement" (idee mapanimation, codee par nous). Demos Cannes en R&D.
2. ✅ **DECODAGE Ghana + Mansa Moussa** (code integral + frames) → `memory/atlas-decode/DECODE-*.md`.
3. ✅ **RESTAURE Mansa Moussa** (purge au Menage) : code `_reference/mansa-moussa-v2/` + 79 assets
   PixelLab `public/atlas-mansa-moussa/` (4 sprites : mansa couronne, porteur, soldat, chameau).
4. ✅ **PLAYBOOK ATLAS ecrit** (3 fichiers, `memory/doctrines/ATLAS-*.md`) : doctrine visuelle +
   couche PixelLab + checklist demarrage. Indexes (MEMORY.md + CLAUDE.md routage).
5. ✅ **AUDIT bibliotheque** (3 agents) → `memory/atlas-decode/audit/`. Atlas a la matiere
   (13 blueprints, 568 sprites/19 persos, 8 composants) mais pas l'organisation.
6. ✅ **NETTOYAGE verifie** : clarif AtlasCaravane(chibi)/AtlasPixelChar(acteur) ; les "doublons"
   atlas-components vs atlas-v2-components sont 2 VERSIONS vivantes (Peste vs Mansa) — NE PAS merger.
7. ✅ **BIBLIOTHEQUE ORGANISEE (parite Souverain)** : 3 catalogues dans `src/projects/atlas/_shared/` :
   `ATLAS-INDEX-DES-INDEX.md` (carte maitre) + `COMPOSANTS-INDEX.md` ("quand Aziz dit") +
   `ATLAS-ASSETS-INDEX.md` (568 sprites/11 JSON geo). Branches dans INDEX Souverain + CLAUDE.md.
8. ✅ **MANSA MOUSSA AUTONOME + VALIDE EN RENDER** : orchestrateur+timing dans `_reference/`,
   enregistre Root.tsx (`AtlasMansaMoussaV2`). Render preuve : caravane PixelLab (Mansa couronne +
   suiveurs sur route doree) + overlays + 2 inserts dataviz + FlagFill + medaillon = TOUT REND.
   Restauration code+assets PROUVEE. Frames : `out/_r-and-d/atlas-decode/mansa-rerender/PREUVE/`.

9. ✅ **TEST SYSTEME REUSSI (1er beat via agent vierge)** : un agent SANS contexte a produit le beat
   "porteur depose un sac d'or au Sahara, repart, l'or persiste" (Silent Barter sur carte Mansa) en
   suivant UNIQUEMENT la doc. Le routage l'a guide de bout en bout. Beat valide en render + APPROUVE
   Aziz (zoom, marche point-fixe sans fleche, or+pulse, SFX pas excellents). `AtlasV2SaharanDropScene`
   + `AtlasV2SaharanDropDemo`. catbox znmqfr. PREUVE que le systeme guide un nouveau venu.
10. ✅ **FIX moonwalk** : flip-ouest d'`AtlasPixelChar` corrige (miroir autour de x, pas offset
    decale) → corrige TOUS les futurs beats. Zero regression Mansa (va vers l'est). Insights raccordes :
    COMPOSANTS-INDEX (nouveau template drop-objet), ATLAS-PIXELLAB-PLAYBOOK (lecon flip + friction
    projection geoUtils!=paths json), SFX-INDEX (backlog sfx-gold-coins-drop).

**Branche : `feat/atlas-playbook-retour-aux-sources` (11 commits) — A MERGER quand Aziz valide.**
**Fiche reprise : `memory/episodes/atlas-systeme/STATUS.md`.**

**FAIT 2026-06-04 — 2 nouveaux beats systeme + couche combat (session marquante) :**
- **Confrontation 1v1** (`AtlasV2ConfrontationScene`, catbox 736mwf) + **Spotlight Insert chiffre** reutilisable.
- **BATAILLE 2 ARMEES** (`AtlasV2ArmyDeployScene`, catbox 2fycin) ⭐⭐ — Aziz "ne pas perdre ca". File->ligne->
  charge->estoc play-once (seq/simul)->pertes (morts+fade). 4 anims PixelLab generees (walk/charge/spear_attack/
  death) + 2 SFX ElevenLabs. Technique complete : `feedback_atlas-bataille-multisprites-technique.md`.
- `AtlasPixelChar` enrichi : props `loop` (play-once) + `animStartAt`. A PROMOUVOIR vers `_shared`.

**FAIT 2026-06-04 (soir) — ORDER OF BATTLE (R&D bataille grande echelle) + PONT GEMINI->PIXELLAB :**
> Inspiration BazBattles (5 batailles decodees). Branche `rnd/atlas-order-of-battle` + POC `src/projects/atlas/_rnd/order-of-battle/`.
> Memoires : `DECODE-bazbattles-manoeuvres.md` + 3 `feedback_pixellab-*.md`.
- **Bloc top-down REJETE** (copier-coller BazBattles, sans identite) → SWITCH valide : moteur de manoeuvre + **sprites incarnes**.
- **8 directions = deblocage** (carre parfait catbox diyf4o). Vue **low top-down** retenue (masque artefact lance). Mode **standard** pour la troupe.
- **3 REGLES gravees** : 8 dir = decision de CREATION · troupe `size 64` (V3 reserve heros, detail = outil narratif) · pont ref via API REST.
- ⭐⭐ **PONT GEMINI->PIXELLAB PROUVE** (catbox sdkrne) : Gemini sheet → Recraft detoure → PixelLab REST `/rotate` → 8 dir coherentes du MEME perso custom. Script `scripts/tools/pixellab-rotate.py`. = persos custom exacts sans artefacts texte.
- **Casting 8-dir existant retrouve** (recuperable) : Hannibal v4a/v4c/v3, War Elephant Carthage, businessman.
- **NEXT Order of Battle** : (a) tester le VRAI systeme de manoeuvre complete (flanquement multi-unites avec les 8 dir) ; (b) industrialiser le pont en 1 script `gemini-to-pixellab.py` (sheet→detour→resize128→rotate x7→animate) + `/animate-with-text` ; (c) promouvoir OobPixelChar/UnitBlock si reutilises.

**TEMPLATES ATLAS A CREER (proposes par Aziz 2026-06-04, ordre a decider) :**
1. **Objets sur la map** — villes / objets / map-objects : differentes manieres d'APPARAITRE et de REVELER
   (pop, build-up, halo, etc.). Famille de templates "habiller la carte d'objets vivants".
2. **Template dedie PESTE 1347** — pour valider/ameliorer les beats existants (Beat 5 Mali Vivant en attente).
3. **Template dedie HANNIBAL** ⭐ — se DEBLOQUE fort avec la bataille (Aziz). Sprites numide/volque/hannibal-v4a
   (a completer en 4 dirs) + AtlasAttackArrow/Encirclement + le moteur bataille. Reprendre Beat 2 Phase C.

**BACKLOG avance** : multi-lignes sequentielles (rangs qui avancent pour combler les morts) = moteur d'etat,
pas trivial. Voir `feedback_atlas-bataille-multisprites-technique.md` section BACKLOG.

**⭐ DECODE CHAINES DE REFERENCE — BazBattles + Kings & Generals (session recherche 2026-06-04) :**
> Analyse de 5 batailles BazBattles + 5 videos K&G (frames vues de mes propres yeux). MATIERE PRESERVEE
> (durable, pas besoin de re-telecharger) : `out/_r-and-d/decode-channels/` (README + contact sheets baz + kg).
> DECODE tactique : `memory/atlas-decode/DECODE-bazbattles-manoeuvres.md`.

**Conclusion validee Aziz : on a DEJA presque tout en composants (ne pas recreer). 3 SEULS vrais apports
(orchestration, pas code) a integrer au playbook — et ils alimentent DIRECTEMENT le point 1 "Objets sur la map" ci-dessus :**
1. **Grammaire d'apparition des objets** (★ ce qui interesse Aziz) : forced-alignment sur les pop + <=6 objets/ecran
   + 1 pop/3-5s jamais simultane + pop pres du dernier point nomme + atterrissage spring. → option hook `useObjectChoreography`.
2. **EvidenceBoard** — ✅ CODE + VALIDE Aziz 2026-06-04. src/projects/atlas/_shared/AtlasEvidenceBoard.tsx +
   `AtlasEvidenceBoardDemo` (Root: `AtlasEvidenceBoardDemo`). Tableau d'enquete persistant data-driven `{nodes,links,notes}`,
   placement declaratif, fils animes colores (relation/flow), fiches surlignees, fonds retenus flat-parch (beige)+slate (navy),
   drift seul (PAS de camera-focus, distrait). Assets Gemini gravis : `public/atlas/_shared/evidence-board/`.
   Demo finale : files.catbox.moe/fk4hlm.mp4. Indexe COMPOSANTS-INDEX + ATLAS-PLAYBOOK §3. APPRENTISSAGE : sur fond sombre
   eviter tone "ink" (invisible) ; or ressort mal sur beige.
3. **Doctrine "tenir 20min sans devenir TikTok"** : rotation de ~6 registres (carte/incarnation/insert/spotlight/bataille/
   respiration), jamais 2x consecutif, change tous les ~30-45s. Doctrinal.

**Modeles opposes (durable) : BazBattles = artisan SOLO (rarete=evenement) ; K&G = STUDIO/equipe (variete=anti-fatigue).
Notre double avantage : incarnation PixelLab (qu'AUCUN n'a) + assemblage PROGRAMMABLE Remotion (eux=manuel AE).**
**Decision Aziz : pas de fichier-cimetiere ; tout est ici + dans le README preserve. Quand on reprendra le point "Objets
sur la map", relire `out/_r-and-d/decode-channels/README.md` (5 regles + frames). Aziz se reserve de re-explorer des templates.**

**ANCIEN chantier (toujours valide) :**
1. **CONTINUER A TESTER LE SYSTEME** sur d'autres beats — empire qui s'etend pas encore teste.
2. **OUTILLER le demarrage** : scripts/atlas-beat-session.py (miroir beat-session.py) + selfreview,
   depuis `ATLAS-BEAT-DEMARRAGE.md`. Rend la discipline executable (le scan force, comme /beat Souverain).
3. **EXTRAIRE en composants partages** (grep-usage AVANT) : SpotlightInsert (GHANA sel/or), AtlasPixelChar
   (→ _shared), inserts charts Mansa, composants Shaka. Backlog dans COMPOSANTS-INDEX.

**Backlog mineur :** SFX `atlas/sfx-gold-coins-drop.mp3` a generer (drop d'or). Anim crouch pour
porteur-mali NON necessaire (Aziz : le perso qui s'arrete suffit). Ancres `.europe`/`.grece` projections
fleches (si Napoleon). Bug lisibilite Cannes Hannibal (zoom x80 carte figee). Render background peut
se bloquer au bundling grosse compo → stills directs pour valider vite. Workflow tool : un agent peut
oublier StructuredOutput en fin → recuperer le travail des transcripts si ca plante.

---

## ⏳ ACTION OUVERTE — Activer les routines /schedule (NON FAIT, rappeler à Aziz)

> **Statut : EN ATTENTE.** Aziz a demandé un rappel persistant jusqu'à confirmation.
> Tant qu'Aziz n'a pas dit "c'est activé / fait", **re-signaler en début de session** et proposer de fournir les instructions.

**Quoi** : créer 2 routines cloud `/schedule` pour le monitoring Postiz (Aziz les crée lui-même — clé API en env cloud = sa décision sécurité).
**Comment (instructions que Claude peut redonner sur demande)** :
1. Commandes à taper :
   - `/schedule jeudi 9h exécute scripts/postiz-weekly-check.py et préviens-moi si un post a échoué`
   - `/schedule samedi 10h exécute scripts/postiz-weekly-report.py et donne-moi le bilan`
2. Lors de la création, ajouter Environment variable : `POSTIZ_API_KEY=<la clé du .env>` (les routines tournent en CLOUD, pas d'accès au .env local).
3. Notification : connecteur Slack/email OU consulter https://claude.ai/code/routines
**Doc détaillée** : `src/projects/souverain/carousels/good-news/README.md` section "Monitoring publications (anti-scroll)".
**Prérequis** : ✅ scripts commités (commit abba0ed) — donc le repo cloud cloné y aura accès.
**Quand Aziz confirme l'activation** → supprimer cette section et noter la date d'activation.

---

## ⭐ SYSTEME BEAT REMOTION HERO DATA — EN PLACE (2026-06-03)

Parite avec le systeme Mapbox atteinte. Avant tout beat Souverain Remotion/data-viz :
1. **LIRE** `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` (8 principes + section SFX + template storyboard 10 champs).
2. **Pipeline** `/beat` (`scripts/beat-session.py`) : phase 0 SCAN (complet, >=2 combinaisons) → storyboard Gemini multi-panels (`scripts/tools/gemini-storyboard-panels.py`) → breakdown → code → self-review → review Gemini.
3. **Briques** : section HERO DATA de `COMPOSANTS-INDEX.md` (CountUp bounce, HeroMirrorBars, **HeroVerticalBars**, FloatingHeroObject clipCircle/spin, Badge satellite, SubtitleBarSouverain, TextChoc) + helpers `animations.ts`.
4. **Assemblage** : `memory/doctrines/SOUVERAIN-REMOTION-SKELETON.md`.
5. **1er beat produit (preuve)** : A3 Cailloux Maroc — `out/episodes/maroc-batteries/a3-cailloux-FINAL.mp4`.

**Lecon SFX** : toujours vérifier la DURÉE d'un SFX (`ffprobe`) avant usage — `ui/reveal.mp3` était corrompu (voix fantôme 18s), neutralisé. Section ⛔ de `SFX-INDEX.md`.

---
