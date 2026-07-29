# Production Pipeline — Shared Workspace (5 agents)

> Fichier partagé. Chaque agent écrit sa section lors de son invocation.
> Claude principal orchestre les handoffs.
>
> **Refondu 2026-05-20 (Grand Ménage)** — l'historique complet des handoffs
> des sessions Sonjata/Thiaroye/Abou Bakari/Or Africain/Silicon Savannah/etc.
> est archivé dans `.claude/agent-memory/archive/PIPELINE-snapshot-2026-05-20.md`
> (491 lignes). Ce fichier reflète l'état actuel et les workflows actifs.

---

## Scènes à PERSONNAGES — DOCTRINE ÉCRITE + partage à 3 étages prouvé (2026-07-28 soir)

**État** : session de R&D pure (aucun épisode de production touché). Commits `66ad70f8` →
`e1e49815` — ✅ **mergés dans `master`** le 2026-07-29 (branche supprimée après merge).

**⭐⭐ Le livrable principal est une DOCTRINE** : `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md`
— distingue 2 régimes (**AMBIANT** : figurants qui habitent un lieu · **DÉMONSTRATIF** : 1 perso
qui EST l'argument, plus fort et moins cher, à privilégier), 7 principes du funambule CFA, et une
table des **4 scènes de référence à conserver comme bancs d'essai** (décision Aziz).

**Acquis techniques prouvés** :
- **Partage à 3 étages** : le modèle dessine le DÉCOR · nous animons l'AMBIANCE · nos briques
  prennent les PERSONNAGES. Mesuré : un agent qui dessine ET anime produit 939 lignes d'animation
  pour 459 de matière et livre un décor pauvre (preuve archivée dans
  `src/projects/_rnd/svg-scenes/_archive/test-agent-dessine-et-anime/`).
- **Fable 5 gagne un 2e test aveugle** contre Opus max, cette fois sur un décor riche.
- **Hiérarchie figurant/héros** validée par Aziz sur rendu.
- **Briques d'habillage remontées au socle** (`habillage.ts` + pointeur dans `StickFigure.tsx`),
  **synchronisées dans les 2 copies** du socle (repo principal + worktree `remotion-cfa`, commit
  `ae7f5c2d` là-bas) — une divergence avait été introduite et corrigée en clôture.
- ⚠️ **Bug du socle découvert** : `BRAS_LAG` exporté mais jamais appliqué par `Figure` (~9 % de
  chaque cycle en pose dégénérée). Touche potentiellement toutes les scènes stick figure. Parade
  côté appelant ; corriger le socle obligerait à revalider les 6 planches → décision d'Aziz.

**NEXT possibles (aucun tranché)** : le personnage qui AGIT · le décor riche atténué (hypothèse
ouverte de la doctrine) · les timings dérivés du forced-align · varier les boucles des figurants.

---

## Scènes à PERSONNAGES — SOCLE COMPLET, 7 tests tranchés (2026-07-29)

**État** : le socle des scènes démonstratives à personnage est **complet et validé sur rendu**.
7 tests à variable unique en une journée, tous tranchés par Aziz. ⛔ **Décision de fin de session :
on arrête la R&D et on passe à la production** — « continuer éternellement pourrait être un piège
pour faire ce qui est le plus important : créer des vidéos et les publier ».

**Livrables** : `src/projects/_rnd/svg-scenes/` — `FunambuleDecorTest16x9` · `PorteurCharge16x9` ·
`PorteurNarre16x9` + `porteurNarreTiming.ts` · `PorteurRiche16x9` · `PorteurPousse16x9` ·
`PorteurGrille16x9` · `skylineDecorGroups.tsx` (Fable 5). Rendus dans
`out/_r-and-d/funambule-decor-test/` et `out/_r-and-d/porteur-charge/`.
✅ **MERGÉ DANS `master`** le 2026-07-29 (fast-forward, 57 commits — la branche
`rnd/port-decor-scene-vivante` a été supprimée après merge). Le socle stick figure et ses 2
corrections sont donc disponibles directement sur master, sans branche à retrouver.

**Acquis** : 3 registres (contemplatif / schématique / démonstratif) · le personnage qui AGIT ·
la scène NARRÉE (gestes dérivés du forced-align) · le personnage RICHE (exige 2-3 archétypes
désignés AU SCRIPT) · ce qui élève une scène (zoom, sol qui fléchit, graphique hors caméra) ·
ce qui ne sert à rien (décor même réactif, grille même déformée, compteur collé à l'objet, sueur).
**Le fond reste UNI.**

**2 corrections de socle** (les 2 copies synchronisées) : le verrou pas/distance mal énoncé
(→ « x dérive des pas AU MOMENT OÙ ILS SONT FAITS ») et le vêtement qui dérivait du corps dans
`Roles.tsx` (non-régression vérifiée sur rendu, les 4 rôles préservés).

**NEXT** : la prochaine VIDÉO — gazoduc Nigeria-Maroc-Europe en SVG. C'est elle qui dira ce qui
manque vraiment. Détail complet : `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md`.

---

## Registre STICK FIGURE — PASSE EN PRODUCTION (2026-07-28)

**État** : le registre est **validé pour la production**. 6 scènes narratives produites et jugées
sur rendu par Aziz (« le socle en tant que tel est validé, ça fonctionne, le placement, les
distances »). Le programme R&D 4 vagues est derrière nous.

**Livrables** : `src/projects/_rnd/stick-figures/` (12 fichiers, 16 compositions `Stick-*`),
rendus dans `out/_r-and-d/stick-figures/`. Commits `25cab1c9` (scènes) + `5aeafd85` (doctrine)
sur `rnd/stick-figures-gestes` du worktree `/Users/clawdbot/Workspace/remotion-cfa`.
⚠️ **NON mergée dans master.** ⚠️ `node_modules` non ignoré dans ce worktree : jamais `git add -A`.

**2 verdicts tranchés par test** (gravés dans `STICK-FIGURE-INDEX.md`) : le modèle dessine le
DÉCOR / nous animons les PERSONNAGES · Fable 5 confirmé modèle SVG par défaut (test aveugle vs
Opus élevé), l'écart venant de la MÉTHODE — Fable rend et regarde son travail.

**NEXT** : la scène avec NARRATION (timings dérivés du forced-align au lieu d'être codés à la
main) → `remotion-cfa/memory/starters/STARTER-PROMPT-stick-figure-scene-narree.md`

---

## Franc CFA mid-form — 8/8 beats + assemblage v2 promu jalon — EN COURS (2026-07-26)

**État** : Beat 4 "Qui tient la clé" REFAIT de zéro (la carte redondante avec le beat 2 remplacée par la
métaphore du filet de sécurité sous un funambule, de profil — `CfaActe4Filet16x9.tsx`). Scène 1994
extraite dans `CfaActe4Signature1994.tsx`. Les 8 beats assemblés (4min38), validés par Aziz, promus en
jalon v2 dans `out/episodes/franc-cfa-midform/` (PAS dans `out/PRET-PUBLICATION/` — musique jugée
inadaptée par Aziz, à refaire).

**RESTE** : musique à changer (après inventaire des 71 pistes existantes) + 3 fixes relevés au
visionnage (ping par devise beat 3 · retirer rappel sac de riz beat 5b · rendre la Guinée visible beat
6a) → `memory/starters/STARTER-PROMPT-cfa-fixes-post-visionnage.md`.

⚠️ Tout le code/script/STATUS à jour vivent dans le **worktree** `/Users/clawdbot/Workspace/remotion-cfa`
(branche `feat/cfa-nuit1994-svg-mix`, 6 commits ff11bf21→84e0ad0c, NON mergés dans master). Source de
vérité : `STATUS.md` § 0-DECIES (worktree). Détail : `memory/NEXT-ACTION.md` § FRANC CFA.

---

## [STAGE-5] remotion-composer — Soudan mid-form, plaques SOURCE Actes 1-4 — COMPLETE (2026-07-22)

> Point de POLISH post-v3 (le "PLUS DE VALEUR" selon Aziz) : ajout de plaques SOURCE bas-droite
> (recette `SourcePlaque` EXACTE de `SoudanActe3GlobeInsert.tsx`, recopiée à l'identique dans les
> 4 fichiers d'actes réellement montés) sur les faits chiffrés/allégations fortes des Actes 1 à 4
> qui n'en avaient pas encore. 8 plaques ajoutées, 2 par acte MAX, 1 source par plaque, format
> "Nom source, date" sans le mot "Source:". Overlays purement additifs — AUCUNE frame ajoutée à
> la durée totale des 4 compositions, timing narratif intact.

**Fichiers réellement actifs identifiés AVANT édition** (le mid-form a plusieurs fichiers R&D
périmés — vérifié via Root.tsx quel composant produit vraiment `a{1,2,3,4}.mp4`) :
- `src/projects/warmap/soudan-acte1/SoudanActe1.tsx` (Composition `SoudanActe1`)
- `src/projects/warmap/soudan-acte2/SoudanActe2.tsx` (Composition `SoudanActe2`)
- `src/projects/warmap/soudan-acte3/SoudanActe3.tsx` (Composition `SoudanActe3` — PAS
  `_rnd/d3-16x9/SoudanActe3GlobeInsert.tsx`/`SoudanActe3Section1Globe.tsx`, qui sont des protos R&D
  non montés dans le montage final malgré des noms proches)
- `src/projects/warmap/soudan-acte4/SoudanActe4.tsx` (Composition `SoudanActe4` — PAS les fichiers
  `_rnd/d3-16x9/SoudanActe4B1toB4Globe.tsx`/`SoudanActe4B6Globe.tsx`, préfixe `D3-` = protos isolés
  non montés). `KostiInsertSVG.tsx` (même dossier) EST actif, monté en interne par `SoudanActe4.tsx`.

**Plaques ajoutées (fait · source · frame absolue)** :
| Acte | Fait | Source | Frame absolue |
|---|---|---|---|
| 1 | ~50M habitants / 3e plus grand pays d'Afrique | UN DESA, projections janv. 2026 | 1006 |
| 1 | 25M en besoin d'aide | UN News, 10 janv. 2026 | 1498 |
| 2 | 1000km de pistes de ravitaillement | ACLED, 2026 | 2414 |
| 2 | Impasse ("personne ne gagne/n'arrête") | Al Jazeera, 16 avr. 2026 | 2772 |
| 3 | Jebel Amer/Al Junaid ~1 Md USD (Hemedti) | US Treasury / The Sentry, 2023-2025 | 1129 |
| 3 | EAU 1er importateur d'or africain | DW, nov. 2025 · AFP/L'Express | 1394 |
| 4 | Base navale Port-Soudan (25 ans/300 soldats/4 navires/nucléaire) | Asharq Al-Awsat, 2026 | 1310 |
| 4 | Frappe drone Kosti (21 juin 2026) | Sudan Doctors Network, juin 2026 | 2773 |

**Note factuelle importante** : le brief initial supposait un contenu UA/ONU/veto russe/Quad dans
l'Acte 4 — VÉRIFIÉ FAUX. Le vrai Acte 4 actif traite Russie/Port-Soudan/Égypte-Nil/Kosti/4-puissances ;
le contenu UA/ONU (veto 18 nov. 2024, suspension UA) est dans l'Acte 5/6 (`soudan-midform-DONNEES.md`
note explicitement ce décalage de numérotation historique). Non traité ici (hors périmètre demandé).

**Bug trouvé + corrigé en mini-render** : dans `KostiInsertSVG` (Acte 4, Kosti), le cadre décoratif
`MapBackdrop` (double-liseré SVG) va jusqu'à x=1892 (28px de marge seulement) — le `right:40` par
défaut de `SourcePlaque` faisait chevaucher le texte long avec ce liseré. Fix : prop optionnel
`rightOffset` ajouté au composant local de `SoudanActe4.tsx` (`rightOffset={68}` pour ce cas), plus
texte raccourci ("21 juin 2026" → "juin 2026"). Pattern à réutiliser si un futur insert plein-écran
avec cadre décoratif proche du bord a besoin d'une SourcePlaque.

**Mini-render vérifié** : 8 renders ciblés (`scripts/render-mapbox.sh`, WebGL headless obligatoire
pour Mapbox — `npx remotion still` échoue avec "Failed to initialize WebGL"), 1 frame full HD
extraite par plaque, inspection visuelle systématique. Toutes propres après le fix Kosti — aucun
chevauchement avec portraits/jetons/bandeaux existants (PortSoudanFactPlaques et KmCounter sont
bas-CENTRE, la SourcePlaque reste bas-DROITE, jamais de collision).

**tsc --noEmit** : 0 erreur sur les 4 fichiers édités (quelques erreurs préexistantes non liées dans
`GlobalPulse.tsx`/`GoldVein.tsx`/`LoomWeaver.tsx`, hors périmètre).

→ Prêt pour quality-reviewer / render final. Fichiers modifiés : `SoudanActe1.tsx`, `SoudanActe2.tsx`,
`SoudanActe3.tsx` (warmap/soudan-acte3/), `SoudanActe4.tsx` (warmap/soudan-acte4/).

---

## Short Sénégal Pétrole & Gaz D3 — ✅✅ TERMINÉ + PROMU (2026-07-17)
> Short vertical 9:16 (112,96s), D3.js/SVG pur (pas Mapbox), pilier Souverain. 5 beats + assemblage +
> audio complet (narration + musique AES + SFX). COMPLET et validé Aziz, promu PRET-PUBLICATION.
> Livrable : `out/PRET-PUBLICATION/senegal-petrole-gaz-short-d3-FINAL.mp4`. NEXT = publication TryPost.
> Source de vérité : `memory/episodes/souverain/senegal-petrole-gaz/STATUS-SHORT-D3.md`.

---

## Cacao → Chocolat Short — ✅✅ TERMINÉ, PUBLIÉ (2026-07-01)
> Short SVG vertical 9:16 (98,5s), pilier Souverain, registre encre GGW. COMPLET et validé Aziz.
> Livrable : `out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4`. Publication YT 2026-07-01 14h UTC.
> Source de vérité : `memory/episodes/souverain/cacao-chocolat-short/STATUS.md`.

---

## [STAGE-1] audio-director — GGW Muraille Verte B4+B5 (correction FMNR) — COMPLETE (2026-06-25)

Regeneration FACTUELLE de B4+B5 SEULS (retrait melange demi-lune/FMNR -> FMNR pure). B1/B2/B3/B6 inchanges.
- narration-beat4.mp3 = **24.985s / 750 frames@30** (Tony Rinaudo / souches dormantes) — beat4.alignment.json
- narration-beat5.mp3 = **14.118s / 424 frames@30** (preuve raccourcie) — beat5.alignment.json
- beat-bounds.json v4 (B5/B6 decales en start/end ; total 114.521s)
- Pipeline V3->STS reproduit EXACT (voix coherente avec les 4 autres beats). 0 clipping, RMS sains.
- catbox B4 https://files.catbox.moe/9geiq6.mp3 | B5 https://files.catbox.moe/5jgb0o.mp3
- VALIDATION PENDING Aziz (ecoute). Detail : `.claude/agent-memory/audio-director/MEMORY.md` (session 2026-06-25).
- → Agent d'animation B4/B5 : durationInFrames = 750 (B4) / 424 (B5). Decoupage mot->frame dans beat{4,5}.alignment.json.

---

## War-Map Sahel — 2026-07-05 [VIDÉO FINALE VALIDÉE, PROMUE PRET-PUBLICATION] — PRIME sur les entrées ci-dessous (périmées)

**[STAGE-FINAL] warmap-sahel — TERMINÉ.** Session C conclue : fix audio "déjà" (splice backup TTS), 1er
render complet bout-en-bout Acte1+P1+P2+P3+P4 jamais fait avant, puis une passe complète de retours
post-visionnage Aziz appliqués et validés : CEDEAO 3e itération de direction (zoom élargi + vrais
contours pays côtiers + pulse+flèches), portraits dirigeants P4 refaits à partir de vraies photos
officielles (1re tentative sur illustration stylisée REJETÉE), SFX corrigés (bug root `startFrom` sur
`<Audio>`), hook "3" recentré (mesure pixel), doublon audio "tensions..." corrigé (cause confirmée par
force-alignment Whisper). **Validé Aziz SANS RÉSERVE** sur le render final. Promu
`out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4` (386MB, 7min30, 13501 frames). `wip/` purgé (3.4GB).
**▶ RESTE avant publication** : thumbnail + titre uniquement (tâche courte, starter
`memory/starters/STARTER-PROMPT-warmap-sahel-thumbnail-titre.md`).
Point ouvert non bloquant (ne pas ré-investiguer sans piste nouvelle) : liseré blanc résiduel sur
frontières CEDEAO (Mapbox natif, 3 tentatives de fix éliminées, cause exacte non isolée).
Détail complet : `memory/episodes/warmap-sahel/STATUS.md` § "SESSION C — ÉTAT".

---

## War-Map Sahel — 2026-07-04 [SESSION B QUASI TERMINÉE · SESSION C EN ATTENTE] — PÉRIMÉ, voir entrée 2026-07-05 ci-dessus

**[STAGE-CODE] warmap-sahel — Session B (branchement + fixes) QUASI TERMINÉE.** Les 2 nouveaux composants
SVG (`LiptakoRevealSVG.tsx`, `ResourcesRevealSVG.tsx`) sont branchés dans le moteur réel
(`Partie3Rupture.tsx`, `Partie4Cout.tsx`, remplacent les anciens composants legacy) et validés Aziz en
mini-renders contexte réel. 9 fixes techniques appliqués (HUD résiduel retiré, points villes continus
retirés P1, SFX doublons retirés, sources mal placées corrigées, portraits flous P4 corrigés — cause
réelle = style gravure fine qui ne survit pas au downscale, pas un bug d'opacité —, caméra CEDEAO
repensée hors du cadre Sahel) + un fondu de transition P3→P4 ajouté, tout validé Aziz.

---

## War-Map Sahel — 2026-06-27 [ACTE1 REFAIT+VALIDÉ · P1/P2 AUDITÉS · P4 EN MORCEAUX] — PÉRIMÉ, voir entrée 2026-07-05 ci-dessus

**[STAGE-CODE] warmap-sahel — Acte1 refondu (hook+corps+SFX) VALIDÉ Aziz.** Compo `SahelActe1-Refonte` (71s),
`out/episodes/warmap-sahel/acte1-FINAL.mp4` (catbox `6azb9e`, v2 SANS tension-drone — le SFX drone d'assise
dérangeait Aziz, RETIRÉ + proscrit partout). SVG-insert franc CFA alternatif produit (système agentique,
mix-and-match, `WarmapCfaInsertSVG`, catbox `228hiw`) — coexiste avec `p4-cfa-FINAL.mp4` (Remotion) pour
comparatif futur, aucun remplacement.
**Audits P1 + P2 FAITS** (lecture seule) : `AUDIT-AMELIORATIONS-P1.md` / `-P2.md` — backlog priorisé EN ATTENTE
de validation Aziz (pas encore traité). **P4 reste EN MORCEAUX** (exode/ressources/confed/CFA), PAS complète
(contredit l'entrée 06-15 ci-dessous).
**NEXT** : (1) passe audit complète (agents scène P3+P4-confirmer + agent TRANSVERSAL, méthode
`memory/doctrines/PASSE-AMELIORATION-SCENE-PAR-SCENE.md`) ; (2) Aziz valide backlog P1/P2 → agents correction ;
(3) assembler P4 morceaux → p4-FINAL ; (4) assemblage final (concat Acte1+P1+P2+P3+P4 + musique D + mix).
Détail : `memory/episodes/warmap-sahel/STATUS.md`.

---

## War-Map Sahel — TOUTES SCÈNES FINAL · NEXT = ASSEMBLAGE — 2026-06-15 [PÉRIMÉ — voir entrée 2026-06-27 ci-dessus]

Acte1 ✅ · P1 ✅ · P2 ✅ · P3 ✅ · **P4 ✅ (les 6 scènes : exode, coût, ressources, confédération, CFA, fin
habitée)**. Toutes FINAL + full HD dans `out/episodes/warmap-sahel/`. **NEXT = ASSEMBLAGE UNIQUEMENT** (aucune
scène à créer/corriger) : rendre P4 complète (compo `SahelPartie4`, f9416→13440, `--gl=angle`) → concat
Acte1+P1+P2+P3+P4 + narration `narration-v5-expressive.mp3` + mix → PUIS Gemini sur la vidéo complète → dérivés.
⭐ DOC REPRISE : `memory/NEXT-ACTION.md` (en-tête) + `memory/episodes/warmap-sahel/STATUS.md` (à jour) +
`INVENTAIRE-TEMPLATES-SESSION-06-15.md`. ⛔ OBSOLÈTES : `PLAN-REFONTE-P4.md`, `BRIEF-PASSATION-P4*.md` (refonte
TERMINÉE). Templates créés 06-14/15 : `WarMapDimmedOverlay` + `WarMapSplitScreen` (2/3 volets + accordéon).
Commits récents : 20626c2+8ccae8f (ressources), 660bf05+06cc12c (CFA), 05c229b+e6a6146 (confed).

## War-Map Sahel — SCRIPT V5 refondu + AUDIO + PIPELINE VOIX validé — 2026-06-10 [SCRIPT LOCKED, voix résolue]

Session longue et décisive. B1 confus = symptôme d'une SURCHARGE NARRATIVE de tout le script.
**Refonte complète :** DA upstream 3 voix (show-don't-tell) → script V5 LINÉAIRE → fact-check Sonar Pro
(1 erreur + 5 imprécisions + ajout confédération 2024) → SCRIPT V5 LOCKED → audio V5 généré (7min28).
Décodage Infographics Show (8 leçons grammaire d'explication) intégré.
**Pipeline VOIX résolu** (problème monotonie GéoAfrique) : ElevenLabs V3 + tags → Speech-to-Speech vers
GéoAfrique. Benchmark complet (Hume/Google/clonage écartés). Doctrine : `PIPELINE-VOIX-VIVANTE-VALIDE.md`.
**NEXT :** Session voix (recherche expressivité V3 + pricing EL + industrialiser pipeline → régénérer audio
Sahel vivant) PUIS session Sahel (alignment → re-découpage beats → coder Partie 1 canari).
⭐ BRIEF DE PASSATION : `memory/episodes/warmap-sahel/BRIEF-PASSATION-2026-06-10.md`. STATUS + NEXT-ACTION à jour.
3 leçons durables gravées (key-learnings : chrono linéaire, fact-check systématique, persister réponses modèles).

## Peste 1347 — Beat5 débloqué + Beat6 finale créée — 2026-06-08 [COMPLETE — 6 beats FINAL]

Session marquante. **Les 6 beats de Peste 1347 sont FINAL.**
- **Beat5 Mali Vivant** débloqué via DA-BRIEF-GATE (après ~15 essais à l'aveugle) : da-compare vs
  Mansa Moussa + da-brief Kimi → diagnostic = CHORÉGRAPHIE (pas les assets) → plan validé --upstream
  → reconstruction par couches (serpentin path courbe, track continu, easing, rouge depuis port,
  frontières Mali, ralenti, musique, zoom). `beat5-FINAL.mp4` (v17).
- **Beat6 Conclusion** ("la géographie n'est pas neutre") = FINALE, 1er beat conçu 100% en amont
  (plan Gemini+Kimi validé AVANT code). Faille Sahara + phrase écriture-plume + désaturation. `beat6-FINAL.mp4` (v5).
- **2 bugs corrigés (key-learnings.md)** : audio `trimAfter` absolu (voix absente non vue 3 renders) +
  territoires d'outre-mer rouges (clipPath Europe).
- Diagnostics/plans : `memory/episodes/peste-1347/{beat5-diagnostic,beat6-construction}/`.
- **NEXT (plan Aziz)** : gros render 6 beats → review Gemini up+downstream + AUDIT GÉO colorations
  Europe rouge sur TOUS les beats (vérifier bug territoires lointains pas reproduit) → PUIS assemblage.

## Veille mapanimation.io + Doctrine "inspiration externe" — 2026-06-03 [COMPLETE — R&D]

Session R&D (pas de production). Decode complet du concurrent mapanimation.io (89 templates, 13 premium analyses) = AI text-to-map-video sur NOTRE stack (Mapbox+renderer serveur), pas d'After Effects, sprites = images posees. Reproductible.
**Cree** : `GeoFlowConnection.tsx` + `AnimatedRouteOverlay.tsx` (routes animees, sprite avion/cargo/dot, headless-safe). Comble le gap "Flux inter-pays".
**Doctrine "inspiration externe"** gravee dans `SOUVERAIN-VISUAL-PLAYBOOK.md` section 2bis PUIS corrigee apres 2 tests : complementarite (pas densite), suit-la-voix, lisibilite, plafond simultaneite 9:16 (max 2 couches), 2D-flat-eux vs 3D-pitch-nous, sequentiel pas metronome.
**2 tests valides la methode** : (1) test reel beat A5 Maroc (V4 surcharge → rejete → revenu V3) a corrige la doctrine ; (2) agent vierge a trouve 4 dettes → toutes corrigees (self-review scriptee cablee dans mapbox-session.py, seuil Gemini neutralise = signal pas juge, warnings sprite/pitch, plafond chiffre).
Memoires : `_r-and-d-mapanimation-{catalog.json,ANALYSE.md,PREMIUM-DECODE.md}` + `feedback_mapanimation-veille-et-geoflow.md`.
**NEXT (voir NEXT-ACTION)** : (A) double audit doctrine en session propre ; (B) 2e voie Atlas Pur (friction projection nulle car Atlas deja 2D flat).

## Short "Petrole de la patience" — 2026-06-03 [COMPLETE — PUBLIE]
Showcase `_demos` refondu en livrable `src/projects/souverain/petrole-patience-short/`.
FINAL `out/PRET-PUBLICATION/petrole-patience-short-FINAL.mp4` (91s). Programme Postiz 9 juin 15h UTC (4 plateformes) = teaser du mid-form. Niger uranium retire du 9 juin (standby).
⚠️ Mid-form Senegal programme le 20 juin pointe vers fichier 25 mai (pre-FC-2/FC-4) — a corriger avant le 20.

## Système Beat Remotion HERO DATA — 2026-06-03 [COMPLETE]

Parité avec le système Mapbox. Doctrine `SOUVERAIN-REMOTION-PLAYBOOK.md` (8 principes + SFX),
catalogue HERO DATA (`COMPOSANTS-INDEX.md`), pipeline `beat-session.py` durci (phase 0 SCAN
complet + gate storyboard Gemini multi-panels obligatoire). Briques : CountUp(bounce),
HeroMirrorBars, HeroVerticalBars, FloatingHeroObject(clipCircle/spin), Badge(satellite),
SubtitleBarSouverain, TextChoc. Assemblage : `SOUVERAIN-REMOTION-SKELETON.md`.
**1er beat produit (preuve bout-en-bout)** : A3 Cailloux Maroc → `out/episodes/maroc-batteries/a3-cailloux-FINAL.mp4`.
Branche : `feat/systeme-remotion-hero-data` (6 commits, à merger dans master quand Aziz valide).

---

## Workflows actuellement actifs (depuis ~mi-mai 2026)

Le système agentique 5-stages reste **la référence** pour la production vidéo
complète et est conservé pour usage futur. Mais depuis ~5 semaines, deux
workflows allégés sont utilisés en pratique :

### Workflow A — Beat Souverain (`scripts/beat-session.py`)

Pipeline 6 phases automatisées par script, Claude main code en direct :
```
1. breakdown    → Gemini 3.1-pro analyse le storyboard (JSON tailwind_layout)
2. code         → Claude écrit Beat*.tsx avec Tailwind (tokens text-gold, etc.)
3. self-review  → 23 critères de qualité, seuil 19/23 bloquant
4. review       → Gemini 3.1-pro vérifie le render (1 seul appel)
5. corrections  → Itérations autonomes
6. upload       → Catbox + ntfy mobile Aziz pour validation finale
```

Documentation complète : `memory/rules/rules-beat-production.md` + section
"Pipeline Beat Souverain" du CLAUDE.md projet.

### Workflow B — Atlas direct

Claude main + PixelLab MCP + Mapbox + scripts `scripts/atlas-session.py`.
Pas d'agents intermédiaires. Storyboard markdown → code → render.
Beats Atlas (Peste 1347 actif) suivent le pattern documenté dans
`src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`.

### Quand utiliser les 5 agents Stage 1→6 ?

Pour les productions narratives complètes nécessitant le full pipeline :
- Shorts ambitieux avec narration + storyboard + assets visuels multiples
- Épisodes Atlas riches (PixelLab characters + tilesets + animations)
- Quand tu veux la rigueur du multi-agents avec handoffs traçables

Pour les beats simples ou itératifs : Workflow A ou B suffisent.

---

## Agent Team (5 agents — préservés, prêts à l'emploi)

1. **audio-director** — Narration TTS (ElevenLabs V3) + musique (Minimax v2.6) + mix
2. **storyboarder** — Script + audio mesuré → `timing.ts` frame-précis
3. **visual-producer** — Assets multi-outils (Gemini, Seedance, Kling, Recraft, fal.ai, PixelLab)
4. **remotion-composer** — Composition Remotion + mini-render validation
5. **quality-reviewer** — Review multi-dimensions + verdict APPROVE/MINOR FIX/RE-EVALUATE

**Anciens agents archivés** : creative-director, pixel-art-director, pixellab-expert, kimi-reviewer, visual-qa (remplacés par visual-producer + quality-reviewer en avril 2026).

Définitions dans `.claude/agents/` (les `.md` qui décrivent rôle/outils/règles de chaque agent).

---

## Pipeline Stages 5-agents (workflow complet)

```
Stage 0  Claude + Aziz       → Script locked
Stage 1  audio-director      → Narration + musique + mix (scan TTS bloquant)
Stage 2  storyboarder        → timing.ts frame-précis (audio mesuré)
Stage 3  visual-producer     → Visual Plan proposal → Aziz approuve
Stage 4  visual-producer     → Assets générés (preview-before-pay)
Stage 5  remotion-composer   → Composition + mini-render 3-4s bloquant
Stage 6  quality-reviewer    → Review multi-dim + Kimi + verdict
Stage 7  Aziz                → Validation finale (oreille + œil + décision créative)
Stage 8  Claude (main)       → Render final OU fix iteration
```

**Règles du pipeline (quand on l'invoque)** :
- Stage 1 prerequis : script LOCKED par Aziz
- Stage 2 prerequis : audio existe ET mesuré (ffprobe ou forced alignment)
- Stage 3 prerequis : Aziz approuve Visual Plan AVANT toute génération
- Stage 4 règle : preview-before-pay pour CHAQUE appel API payant
- Stage 5 prerequis : mini-render validation AVANT de coder d'autres scènes
- Stage 6 règle : self-review AVANT Kimi, jamais l'inverse

Format de handoff entre agents : voir `.claude/agent-memory/shared/TODOWRITE-PATTERN.md`.

---

## État actuel des projets (MAJ 2026-07-05)

### ✅ Livré (retiré de Actif — contredisait l'entrée 2026-06-08 "6 beats FINAL")

- **Peste 1347 (Atlas)** — VALIDÉ AZIZ (2026-07-01), `out/PRET-PUBLICATION/peste-1347-FINAL.mp4`. NEXT =
  programmer publication (pas une tâche technique). Voir `memory/NEXT-ACTION.md` § Peste 1347 pour le détail.

### ⚡ Actif

- **Soudan Mid-form** — ✅✅✅ HOOK + SOCLE `SoudanWarMapEngine` + **ACTE 1 v5-FINAL** (57.3s, catbox `qc5dgq`) +
  **ACTE 2 « Blocage » COMPLET & POLI** (93.6s, 9 beats, 2026-07-09 s4, branche `feat/aes-short-90s-carte-vivante`,
  `out/episodes/soudan-midform/wip/acte2-FINAL.mp4`, catbox `jgvhr2`, code `src/projects/warmap/soudan-acte2/SoudanActe2.tsx`).
  Acte 2 = 3 sections registres alternés : jeton 2-visages `TwoFaceToken` / insert `KhartoumEtatMajorSVG` beat 5 /
  bloc `BlocImpasseB6` beat 6 / carte dézoom+`KmCounter`+supply+forces figées beats 7-9. Audio LOCK. **✅ FINAL APPROUVÉ AZIZ
  (SFX validés), PROMU** `out/PRET-PUBLICATION/soudan-midform/soudan-acte2-blocage-FINAL.mp4`. **✅✅✅ ACTE 3 « Suivre l'or »
  FINAL PROMU** (2026-07-11 s7 : v7→v12, 3 problèmes v7 résolus — zoom recalibré 9.3, mine repositionnée
  vraie géo, drapeaux motif complet resynchronisés — Beat 1 refondu 2× (concept A "puits sans fond"
  adopté), 9 SFX posés), `out/PRET-PUBLICATION/soudan-midform/soudan-acte3-suivre-lor-FINAL.mp4` (+`_compressed`),
  catbox `y2swv7`, code `src/projects/warmap/soudan-acte3/SoudanActe3.tsx`.
  ⚠️ **CE BLOC EST EN RETARD — source de vérité = `memory/episodes/soudan-midform/STATUS.md`.** État réel
  (2026-07-21) : **Acte 4 REFAIT en GLOBE D3 3 registres** (bloc continu B1-B4 + Kosti insert + B6 globe 2.0),
  v12 = base validée Aziz, branche `feat/soudan-acte4-globe-3registres`, PAS promu FINAL — reste Phase 2
  (densif/dynam, starter dédié). ⛔ L'ancien état « v7 Mapbox / kosti-k3 non mergée » est PÉRIMÉ (kosti-k3
  mergée depuis longtemps, Acte 4 refait). · **Acte 5 script
  verrouillé + audio + timing + CODE + RENDER v2 FAITS, diagnostic downstream Gemini+Kimi (densification
  territoriale) fait mais NON appliqué — à trier prochaine session avant nouvelle passe de code.**
- **Maroc Batteries Short 90s** — PRÉ-PROD COMPLÈTE (2026-05-30).
  Script v3 LOCKED (jury 8/10). Audio retenu : `public/souverain/maroc-batteries/audio/narration-maroc-v3.mp3` (109s).
  URL catbox : https://files.catbox.moe/jyrlj1.mp3. Format visuel : Template B Hybride.
  État complet + checklist production : `memory/episodes/souverain/maroc-batteries-kenitra/PREPRODUCTION-SHORT.md`.
  NEXT : storyboard visuel → forced alignment → beats Remotion.
- **Maroc Batteries Mid-form 4-5 min** — BACKLOG, après Short.
  Pré-prod : `memory/STARTER-PROMPT-maroc-batteries-midform.md`.

### 💤 En pause / dormants

- **Hannibal (Atlas)** — Beat 1 livré, Beat 2 Phase C non codée. Dossier mémoire
  préservé : `memory/episodes/hannibal/`. Code dans `src/_archive/episodes-livres/atlas/hannibal/`.
- **Vraie Taille Afrique (Souverain Short)** — FINAL livré, conservé en archive pour réf.
- **Xenophobie SA (Souverain)** — gelé, à reprendre 2-3 mois (memory/episodes/souverain/xenophobie-sa-EXPLORATION/).
- **Mali blocus carburant (Souverain)** — en pause, reprendre juin 2026+.
- **Congo Taille (Souverain)** — fact-sheet seul, inactif.

### ✅ Livrés (PRET-PUBLICATION)

9 vidéos dans `out/PRET-PUBLICATION/` :
niger-uranium, silicon-savannah, or-africain, sonjata-v7, thiaroye-v5,
mansa-moussa-atlas-v2, empire-ghana-v2, vraie-taille-afrique,
senegal-petrole-gaz (V3, terminé 2026-07-05, commits `207d223`+`606aff4` sur `fix/senegal-v3-passe-finition`).

Mémoires épisodes archivées dans `memory/archive/episodes-livres/`.
Code épisodes archivé dans `src/_archive/episodes-livres/`.

---

## Patterns validés cross-projet (références durables)

- **Hook Short (pattern teaser 5s)** — voir `memory/templates/` et BrutalHookSplit dans `src/projects/_shared/components/layouts/`.
- **Musique Minimax 2.6** — `memory/tools/minimax.md`. Coût ~$0.30/track 3min.
- **Narration ElevenLabs V3** — voix GéoAfrique V2 `z3gESu49naEZW8Af2Upm`. Règles TTS françaises NON-NÉGOCIABLES (voir `memory/tools/voices-v3.md` + CLAUDE.md projet).
- **Integration Remotion audio** — `<Audio src={staticFile(...)} />` + `AUDIO_SEGMENTS` audio-derived timing.
- **Atlas Blueprints Library (8 patterns)** — `src/projects/atlas/_blueprints/` (walk-to-destination, confrontation, orbital-city, zoom-revelation, shake-impact, alliance, empire-expansion, flashback).
- **Beat Souverain workflow** — voir `scripts/beat-session.py` + `memory/rules/rules-beat-production.md`.

---

## HANDOFF LOG (sessions actives)

> Format : `## Stage N — Agent — Projet — Date [COMPLETE / IN PROGRESS / BLOCKED]`
>
> Quand un agent termine son stage, il ajoute son entrée ici.
> Claude main propose le stage suivant à Aziz quand un handoff `COMPLETE` apparaît.
>
> Les handoffs des sessions terminées (Sonjata, Thiaroye, Abou Bakari, Or Africain,
> Silicon Savannah, Niger Uranium, Zimbabwe Lithium, RDC No Sense, etc.) sont
> dans le snapshot archivé : `.claude/agent-memory/archive/PIPELINE-snapshot-2026-05-20.md`.

## Maroc Batteries — BLOC CARTE (Mapbox) TERMINÉ — 2026-06-03 [COMPLETE]

**Session : fill-pattern lib + Beat 3 from scratch + corrections Beat 0/1. Bloc carte bouclé.**

3 beats Mapbox FINAL (les corrections SFX + vrais drapeaux appliquées) :
- Beat 0 Hook ✅ https://files.catbox.moe/otcfyz.mp4 — SweepRevealTerritory (SFX recalibrés, swoosh-zoom retiré car carte fixe)
- Beat 1 Phosphate ✅ https://files.catbox.moe/r30wee.mp4 — vrais drapeaux clip SVG (useClipFlags), SFX Sequence
- Beat 3 Acteurs ✅ https://files.catbox.moe/ivv7d8.mp4 — pull back planétaire vue monde + 3 drapeaux statiques synchro voix + lignes connexion + GeoCountryPlaque

**Créé cette session (tout référencé dans les 3 catalogues Mapbox) :**
- 11 templates fill-pattern N1-N4 + `flagCanvas.ts` (45 drapeaux + `countryFilter`) + `resourceTextures.ts` (6 textures).
- **`useClipFlags.tsx`** ⭐⭐ — vrais drapeaux HD clippés SVG, net à toute échelle (`mainlandBox` pour outre-mer). LA technique drapeau.
- **`GeoCountryPlaque.tsx`** (+ counter + climax) — plaque nom+stat+SOURCE (pattern Or Africain généralisé).
- `camCountryApproach` (pitch 32 relief) dans MapboxBase. Drapeaux HD Wikimedia dans `public/_shared/flags/`.

**3 leçons critiques sauvegardées** (`memory/feedback_sfx-sequence-et-drapeaux-reels.md`) :
1. SFX : `<Sequence from durationInFrames>` OBLIGATOIRE, jamais `{frame===X}` (ne joue pas en render). ⚠️ Beat0/1 avaient le bug → corrigé.
2. Drapeaux : vraies images Wikimedia, JAMAIS `drawFlagCanvas` (dessins approximatifs) pour drapeau visible.
3. Bbox outre-mer (France=Guyane+Réunion) casse le clip → `mainlandBox`.

**NEXT : BLOC REMOTION** (Beat 2 Cailloux assets Gemini à valider, Beat 4, Beat 5) puis assemblage. Philo 2-blocs : `feedback_philosophie-mapbox-puis-remotion.md`.

## Maroc Batteries — Chaîne production Mapbox premium — 2026-06-01 [SYSTÈME CRÉÉ, BEAT 1 À REFAIRE — OBSOLÈTE, voir entrée 06-03]

**Session structurante — on a bâti toute la chaîne de production Mapbox premium, pas juste un beat.**

Créé cette session :
- `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md` — doctrine cartographique premium (Gemini 3.1 Pro, 6 réfs + 4 nos vidéos). 5 principes + anti-clonage + template storyboard 7 champs.
- `scripts/mapbox-session.py` — système beat Mapbox scoré (miroir de beat-session.py pour Remotion).
- `scripts/tools/gemini-mapbox-review.py` — review vidéo Mapbox → JSON scoré (seuil 8/10).
- `scripts/tools/gemini-visual-playbook.py` — génère le Playbook (2 appels Gemini).
- Routage CLAUDE.md : 2 lignes distinctes beat Mapbox vs Remotion + 2 blocs Pipeline.

Beat 1 Maroc (A2 Phosphate) : codé en v4, Gemini 4→6.5/10. CAS-TEST. **À REFAIRE** proprement avec storyboard Playbook validé en amont (drift continu + anti-gris + séquentiel dès la conception).

Brouillons `beats/*.tsx` supprimés (sauf Beat0Hook référence). Beat0 Hook reste FINAL.

**FAIT cette session (suite) :**
- Chantier A ✅ : pré-prod réordonnée — `souverain-preproduction` SKILL : nouvelle Étape 3.5 "Pensée visuelle Mapbox (Playbook)" entre jury et audio (pour informer cues audio + ajuster script). Règle EFFET VIVANT + règle INVOCATION UNIVERSELLE gravées dans CLAUDE.md.
- Règle ALTITUDE PAR DÉFAUT ajoutée au Playbook (P2bis) : rester en hauteur, frontières lisibles ; gros zoom sol = exception. Erreur Beat 1 = avoir commencé au sol.
- Chantier B ✅ : gap analysis templates (`scripts/tools/gemini-template-gap.py` → /tmp/template-gap.json). Axe = EFFET VIVANT (couleur/frontières/projection/Lottie), pas 3D.
  - SOUS-UTILISÉS à réactiver : CountryFlagFill, CountryIsolateWithHatch (déjà dans Root 16:9), Lottie off-screen, FlowArrowsMap.
  - À CRÉER (priorité HAUTE) : BichromyPolygonProjector (projection image bichromie), SequentialBorderPulse (frontières synchro syllabe). MOYENNE : LottieGeoAura, GlassmorphismGeoPopup. Tous hybrides V+H.

**NEXT — Chantier C (prochaine session, lot de 2 testés à fond V+H) :**
1. Réactiver/tester CountryFlagFill (192 l, PAS dans Root) + CountryIsolateWithHatch (433 l, dans Root 16:9). Les rendre hybrides V+H, render preview vertical + horizontal, valider Aziz.
2. SEULEMENT si gap reste après réactivation : créer BichromyPolygonProjector + SequentialBorderPulse.
3. PUIS refaire Beat 1 Maroc A2 avec système complet (storyboard Playbook + altitude par défaut + 1 template effet vivant obligatoire). Puis A3-A6.
Décision Aziz : commencer par RÉACTIVER l'existant (moins cher) avant de créer. Lot de 2 max, qualité > quantité.

## Beat 0 — Hook — Maroc Batteries — 2026-06-02 [COMPLETE]

- Fichier : src/projects/souverain/maroc-batteries/beats/Beat0Hook.tsx
- Render FINAL : out/episodes/maroc-batteries/beat0-FINAL.mp4
- Catbox : https://files.catbox.moe/jx3e4s.mp4
- Templates utilisés : SweepRevealTerritory (showHatching=true)
- Forced alignment : MAROC_WORDS (maroc-words.ts) — tous les mots
- Validé par Aziz : oui

## Beat 1 — Phosphate — Maroc Batteries — 2026-06-02 [COMPLETE]

- Fichier : src/projects/souverain/maroc-batteries/beats/Beat1Phosphate.tsx
- Render FINAL : out/episodes/maroc-batteries/beat1-FINAL.mp4
- Catbox : https://files.catbox.moe/n9jxx7.mp4
- Templates utilisés : FlagFill Multi-Pays (drapeaux MAR/ESP/FRA/DEU projetés) + slam SVG 70% + arcs export + dots CSS
- Review Gemini : 8 vidéos (6 refs + 2 nos beats) analysées → corrections appliquées
- Validé par Aziz : oui (template B "tous drapeaux")

## ⭐ DÉCOUVERTE FlagFill — 2026-06-02 [TEMPLATES PHASE 1 CARTE VIVANTE]

2 templates FlagFill créés — la solution N°1 pour colorer une carte Mapbox (règle pour TOUTE scène future) :
- Template A (Focus-Un-Pays) : `out/templates-souverain/FINAL-FlagFill-FocusUn-V.mp4` — 1 drapeau principal + couleurs unies secondaires
- Template B (Multi-Pays) : `out/templates-souverain/FINAL-FlagFill-MultiPays-V.mp4` — tous les pays avec drapeau projeté
- Doc : `memory/feedback_flagfill-templates-decouverte.md`
- Drapeaux locaux : `public/_shared/flags/` (es/fr/de.png + Maroc canvas pur)

## NEXT — Maroc Batteries

1. ⚠️ SESSION FILL-PATTERN d'abord (bibliothèque drapeaux/textures + helpers réutilisables)
2. Beat 2 Cailloux (f932→f1300, pur Remotion) — assets Gemini à valider avant

## RÈGLE FORMALISÉE — Recherche templates avant code

Ajoutée à CLAUDE.md + `memory/feedback_recherche-templates-obligatoire.md` : Claude DOIT scanner les catalogues AVANT de coder. Évite les itérations (leçon : 18 versions Beat 1 car FlagFill pas cherché au départ).

## Chantier C — Templates Mapbox hybrides V+H — 2026-06-02 [LOT COMPLET, EN ATTENTE VALIDATION AZIZ]

Lot de templates Mapbox premium (vraie carte vivante, hybrides V+H, render headless via render-mapbox.sh).
Tous dans `src/projects/_shared/mapbox/`. Compositions enregistrées dans Root.tsx.

**Créés cette session :**
1. `MapboxFlagFill.tsx` ✅ VALIDÉ — drapeau (ou toute image) clippé en SVG dans la silhouette d'un pays, sur carte vivante (drift, altitude, voisins ivory). Technique = clip SVG + reprojection map.project() frame-driven (PAS fill-pattern qui carrelle). Prop `geoName` accepte tableau → fusionne géométries (ex: ["Morocco","W. Sahara"] remplit le Maroc entier). `bichromie` 0→1.
2. `MapboxIsolateZone.tsx` ✅ VALIDÉ — isolation pays (spotlight) + zone offshore hachurée (fill-pattern cyan) + badge pin geo + bloc stat. Zone Sangomar agrandie/contrastée.
3. `SequentialBorderPulse.tsx` ✅ — frontières qui s'allument en séquence (synchro syllabe via prop `at`), flash+glow, reste allumé, drift adaptatif V/H.
4. `GlassmorphismGeoPopup.tsx` ✅ VALIDÉ Aziz ("excellent") — encarts navy translucide + bordure or reliés par ligne fine au point geo (SVG projeté). NOTE: backdrop-filter blur NE rend PAS en headless → fond translucide solide (acceptable).
5. `SequentialFlagReveal.tsx` ✅ (V2 demandée Aziz) — pays s'allument EN SÉQUENCE avec LEUR DRAPEAU clippé dans la silhouette, reste allumé (technique chaînes). Combine FlagFill + BorderPulse. Prop `countries[]` réutilisable (CEDEAO, Sahel...).
6. `LottieGeoAura.tsx` + `src/projects/_shared/lottie/premiumLottieAssets.ts` — 3 assets Lottie premium navy/gold générés par code (shockwaveDiscovery, networkFlow, orbitalDataCrown) ancrés à un point geo. Lottie off-screen → goToAndStop frame-driven → overlay. À JUGER EN VIDÉO (Lottie temporel). Verdict perso : shockwave excellent, orbital crown bon, networkFlow correct après fix phase.

**Plan Gemini (4 templates manquants) — état :** BichromyPolygonProjector = couvert par MapboxFlagFill (projette toute image). SequentialBorderPulse ✅. GlassmorphismGeoPopup ✅. LottieGeoAura ✅ (+ vrai gap = assets premium, générés).

**Previews catbox (dernière version) :**
- FlagFill Maroc : V https://files.catbox.moe/80ti00.mp4 · H https://files.catbox.moe/xay797.mp4
- IsolateZone Sénégal : V https://files.catbox.moe/nv5azm.mp4 · H https://files.catbox.moe/npq08b.mp4
- BorderPulse Maghreb : V https://files.catbox.moe/3lcys8.mp4 · H https://files.catbox.moe/flk7c8.mp4
- GlassPopup Sénégal : V https://files.catbox.moe/p6f31u.mp4 · H https://files.catbox.moe/04tkmg.mp4
- FlagReveal Maghreb : V https://files.catbox.moe/i7bq1e.mp4 · H https://files.catbox.moe/tyat4h.mp4
- LottieGeoAura : V https://files.catbox.moe/kqybi6.mp4 · H https://files.catbox.moe/jxkicc.mp4

**Chantier C v2 — 3 templates DYNAMIQUES (idees Gemini, axe Aziz : dynamisme+couleur) — 2026-06-02 :**
Consultation Gemini 3.1 Pro (6 frames validees jointes) → 6 idees (sauvegardees `memory/tools/gemini-template-ideas-v2-2026-06-02.json`). Aziz a retenu les 3 "haute" :
7. `SweepRevealTerritory.tsx` ✅ — faisceau lumineux gold qui TRAVERSE un pays et revele sa couleur au passage (scanner/lever de soleil). Gradient SVG anime clippe dans la silhouette reprojetee. Direction adaptative V(vertical)/H(horizontal). V https://files.catbox.moe/g1bvis.mp4 · H https://files.catbox.moe/m96rpq.mp4
8. `DominoContagionFill.tsx` ✅ — la couleur CONTAMINE les pays de proche en proche par VAGUES (prop waves[][]) depuis un epicentre, onde concentrique. Raconte une expansion d'influence sans fleches. V https://files.catbox.moe/3f2shf.mp4 · H https://files.catbox.moe/spjlqt.mp4
9. `FiberOpticBorderDraw.tsx` ✅ — la frontiere se DESSINE comme un laser dore (stroke-dasharray anime + glow feGaussianBlur), puis fill interieur monte. Salle de controle. V https://files.catbox.moe/be2pd0.mp4 · H https://files.catbox.moe/7k3zf6.mp4

**Idees Gemini NON encore codees (backlog, si besoin) :** TensionHeatZone (heatmap chauffe), HexGridAnalysis (grille hexa egaliseur), GeoRippleExpansion (ondes epousant le littoral). + tes 3 fondamentaux : Choropleth, Texture ressource, Flux inter-pays.

**Chantier HOOK — templates d'ouverture (2026-06-02) :** Aziz souvent insatisfait des débuts de vidéo → templates spécialisés 5-30s, rapides, punch frame 0 (assumé "TikTok" dans le rythme, charte navy/gold). Contrainte Mapbox : caméra fluide (drift OK), PAS de mouvement épileptique ; énergie en overlay.
Consultation Gemini hooks (10 frames + GeoLayers 3) → 5 idées (`memory/tools/gemini-hook-ideas-2026-06-02.json`). Codés :
- `FiberOpticFlagInvade.tsx` ⭐ — frontière se trace PUIS drapeau envahit, séquentiel (= V2 demandée Aziz). V https://files.catbox.moe/6jtjc7.mp4 H https://files.catbox.moe/v0ot0h.mp4
- `KineticMaskSlam.tsx` ⭐ — chiffre géant, carte DANS le texte, zoom dans le "0". V https://files.catbox.moe/9hu9oe.mp4 H https://files.catbox.moe/6zivbg.mp4
- `RapidFireCountries.tsx` — rafale de pays (cut sec) puis freeze. V https://files.catbox.moe/a09vsm.mp4 H https://files.catbox.moe/yamy5v.mp4
- `ClassifiedRedactReveal.tsx` ⭐ — TOP SECRET + censure qui glisse + target lock. V https://files.catbox.moe/z95wbs.mp4 H https://files.catbox.moe/noljgi.mp4
Hooks backlog : TacticalRadarScan, EpicenterShockwave, SatelliteTargetLock, GlitchMapIntro.

**Chantier INSERTS + COMBOS (2026-06-02, suite) :** Aziz a reclassé RapidFire+ClassifiedRedact en INSERTS (pas hooks) et identifié 2 patterns puissants : (a) le CUTAWAY générique, (b) la COMBINAISON de primitives.
- `MapCutaway.tsx` ⭐⭐ — INSERT réutilisable : carte → overlay plein écran → retour carte + target lock. 4 modes : image/stat/reveal/flag. Textes en TYPEWRITER. LE template le plus réutilisable (chaque vidéo). Previews : Stat https://files.catbox.moe/pbjdzd.mp4 Image https://files.catbox.moe/88s176.mp4 Flag https://files.catbox.moe/rg4j0i.mp4 Reveal https://files.catbox.moe/5ech8j.mp4
- `components/TypewriterText.tsx` — texte lettre-par-lettre réutilisable (curseur gold), extrait de TypeWriter.tsx.
- 3 COMBOS (hooks par assemblage) : `ComboMaskSweep` (choc→révélation→focus) https://files.catbox.moe/h75bhk.mp4 · `ComboSweepDominoFlag` (déclencheur→propagation→drapeaux) https://files.catbox.moe/httrq8.mp4 · `ComboFiberAuraPopup` (où→quoi→combien) https://files.catbox.moe/4byelm.mp4

**INVENTAIRE TOTAL templates Mapbox (17 créés cette session)** : 6 statiques/séquentiels (FlagFill, IsolateZone, BorderPulse, GlassPopup, FlagReveal, LottieGeoAura) + 3 dynamiques (Sweep, Domino, FiberOptic) + 2 hooks (FiberOpticFlagInvade, KineticMaskSlam) + 2 inserts (RapidFire, ClassifiedRedact) + 1 cutaway générique (MapCutaway) + 3 combos (MaskSweep, SweepDominoFlag, FiberAuraPopup). + TypewriterText réutilisable. Tous référencés COMPOSANTS-INDEX + MAPBOX-COMPOSANTS + ASSETS-INDEX. Lottie assets : `lottie/premiumLottieAssets.ts`. Idées Gemini backlog : `memory/tools/gemini-template-ideas-v2-2026-06-02.json` + `gemini-hook-ideas-2026-06-02.json`.

**NEXT après validation Aziz :** refaire Beat 1 Maroc A2 avec cet arsenal (gap P4 + hooks couverts) + storyboard Playbook. Renders dev dans `out/templates-souverain/_dev/`.

## Carrousel "Good News" #1 — 2026-06-02 [PUBLIÉ]

Nouveau 3e type de carrousel (bonnes nouvelles macro Afrique, indépendant d'une vidéo).
Charte LUMINEUSE (ivoire/or/navy), 100% Remotion animé. Briques réutilisables : `gauge`, `flow` (icônes Lucide), `bars`, `map` (Mapbox Caspian beige).
Carrousel #1 (Maroc/Kenya/Algérie) programmé 3 juin sur IG+FB (carrousel) + TikTok (vidéo unique).
Pipeline + briques consolidés : `src/projects/souverain/carousels/good-news/README.md`. Décisions : `memory/starters/STARTER-PROMPT-carrousel-good-news.md`.
NEXT possible : script d'automatisation hebdo (last30days → briques → Postiz), semi-auto avec validation humaine.
Fix collatéral : `scripts/render-mapbox.sh` (chemin chrome-headless-shell) + stubs beats Maroc Batteries manquants (dette repo).

## Sénégal Pétrole & Gaz — Acte 3 S2 (Beat11) — 2026-05-23 [COMPLETE]

**Beat11 VALIDÉ** (`out/episodes/senegal-petrole-gaz/beat11-FINAL.mp4`, 44.9s, 5.4MB)
- Architecture : fond kraft + D3 StackedBars SVG, 4 phases (doc classifié → barre gold → Cost Recovery → 3 segments → révélation)
- Tailwind migré : tokens `font-mono`, `flex`, `tracking-widest`, etc. Labels sur fonds colorés opaques (rouge/brun/or) pour lisibilité kraft
- Audio : `narration-v1-clean.mp3` `startFrom={5755}` (skip "mécanisme 1,", démarre sur "le contrat.")
- Chiffres vivants + sweep lumineux + ghost trailing 60%
- Imgur final : https://i.imgur.com/6RGSGND.mp4
- **NEXT** : Beat12 (S3 — Mécanisme 2 : FONSIS + dette) ou Beat13 (S4 — Mécanisme 3 : Yakaar/géopolitique)

## Sénégal Pétrole & Gaz — Acte 3 S1 (Beat10) — 2026-05-23 [COMPLETE]

**Beat10 VALIDÉ** (`out/episodes/senegal-petrole-gaz/beat10-FINAL.mp4`, 61s, 67MB)
- Architecture : 1 seule Map Mapbox continue, 6 phases (Norvège → Congo → Botswana → Crane Up)
- Coloration pays : NOR=gold, COG=orange, BWA=vert — persistent sur vue finale
- Audio : `narration-v1-congo-brazzaville.mp3` (splice "Le Congo" → "Le Congo-Brazzaville"), `endAt={5718}` pour couper avant "Mécanisme 1"
- Catbox final : https://files.catbox.moe/yx177g.mp4
- **Leçons R11 ajoutées** dans `memory/rules/rules-beat-production.md` (splice audio, endAt, public-dir minimal, renders parallèles)
- **NEXT** : Beat11 (Mécanisme 1) + suite Acte 3

## Sénégal Pétrole & Gaz — ÉPISODE COMPLET — 2026-05-25 [TOUS BEATS VALIDÉS — ASSEMBLAGE RESTANT]

**Tous les beats produits et validés :**
- Beat0  → `out/episodes/senegal-petrole-gaz/beat0-FINAL.mp4` (36.5s) ← VALIDÉ 2026-05-25
- Acte 1 → `out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4` (42.3s)
- Acte 2 → `out/episodes/senegal-petrole-gaz/acte2-FINAL.mp4` (88.3s)
- Beat10 → `out/episodes/senegal-petrole-gaz/beat10-FINAL.mp4` (61s)
- Beat11 → `out/episodes/senegal-petrole-gaz/beat11-FINAL.mp4` (44.9s)
- Beat12 → `out/episodes/senegal-petrole-gaz/beat12-FINAL.mp4`
- Beat13 → `out/episodes/senegal-petrole-gaz/beat13-FINAL.mp4`

**Prochaine session — 2 tâches restantes (dans cet ordre) :**
1. **SFX** — effets sonores frame-précis sur mouvements caméra Mapbox, pop plates, slashes, reveals. Backlog existant dans `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md`
2. **Assemblage final** — concaténation ffmpeg de tous les beats dans l'ordre (Beat0 → Acte1 → Acte2 → Beat10 → Beat11 → Beat12 → Beat13) → `out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4`

## Sénégal Pétrole & Gaz — Acte 2 — 2026-05-23 [COMPLETE]

**Acte 1 VALIDÉ** (Beat1+2+3+5, 42.3s, `out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4`)

**Acte 2 VALIDÉ 2026-05-23** (`out/episodes/senegal-petrole-gaz/acte2-FINAL.mp4`, 88.3s, 48.9 MB)
- `SenegalActe2Continu.tsx` (2134f) — une seule Map Mapbox, 5 phases : Sangomar / Trans Pull Back / GTA / Trans Whip / Yakaar
- `Beat9.tsx v5` (516f) — donut SVG animé 9s, fond bleu nuit clair, split gauche/droite
- Composition assemblée : `SenegalActe2Full.tsx` (id `Senegal-Acte2-Full`)
- Audio : voix-off offset 43.30s + musique A 18% fade-out 4s
- Catbox final : https://files.catbox.moe/ck11k7.mp4
- **Backlog SFX** consigné dans `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md` — à intégrer avant assemblage 4 actes final
- **NEXT** : Acte 3 (à produire)

---

## CIRCUIT BREAKER RE-OPEN: AtlasCannesScene — rendu 2-echelles, direction confirmee (2026-06-03)

Pas une boucle aveugle. Phases A (carte regionale Italie + marqueur Cannae) et B (terrain
tactique + encerclement) deja rendues et lisibles. 2 ajustements ciblES restants, valeurs
calculees numeriquement (d3-geo), pas tatonnees :
1. scale tactique 190000→150000 + wingMid lat 41.45/41.19→41.41/41.23 (arcs debordaient).
2. titleOpacity s'efface au zoom f95-120 (titre se superposait a l'aile haute).
Apres : render video complet + upload + presentation Aziz.

## War-Map Sahel P3 "La Rupture" — v8 FINALE — 2026-06-13 [COMPLETE — attend validation Aziz]
P3 codée de bout en bout (8 itérations + DA upstream 3 voix + review premium Gemini/Kimi + passe premium).
Compo SahelPartie3 (f6118→9410). Render : out/episodes/warmap-sahel/wip/p3-FULL_v8.mp4 (catbox 93yw8p, scale 0.5).
Brique créée : src/projects/warmap/_shared/WarMapOverlayDynamic.tsx (overlay dynamique réutilisable).
Doctrine : memory/doctrines/REVIEW-PREMIUM-TEMPLATE.md (standard review premium) + WARMAP-LONG (règle overlay).
Assets Gemini : ville-kidal, jeton-africacorps. Flags canvas : ml/bf/ne.
NEXT : (1) full HD si validé ; (2) session dédiée "fond qui respire" (transversal) ; (3) P4.
Détail état : memory/episodes/warmap-sahel/STATUS.md.

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source — POINT DE CONTROLE (style encre a valider Aziz)
Passe 1 d3-geo encre rendue full HD. Geo EXACTE (countries-50m, CIV+GHA + region Afrique Ouest).
Choregraphie OK : region se dessine -> brun cacao -> focus CI -> focus Ghana -> paire (labels deportes).
Mp4: https://files.catbox.moe/bqer2s.mp4 · Frame paire: https://files.catbox.moe/peu7il.png
EN ATTENTE arbitrage style encre AVANT finition timing audio-derived + colorisation. NE PAS chainer.

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source V2 — COMPLETE (refonte structure post-validation style)
Split-screen 2 volets : CI (gauche) + Ghana (droite), geo d3-geo EXACTE (countries-50m). CI se trace puis Ghana.
Couleurs DRAPEAU en remplissage clippe sur silhouette (bandes verticales CI ; horizontales+etoile Ghana), bbox-equilibrees.
Trace SYNCHRO au nom (Whisper : "Cote d'Ivoire" f241-262 -> trace finit f245 ; "Ghana" f274-283 -> finit f276).
Audio integre (cacao-beat2-FINAL.mp3 -> public/souverain/cacao-chocolat-short/audio/). tsc clean. Render full HD + audio.
Mp4: https://files.catbox.moe/el492c.mp4 · Frame finale: https://files.catbox.moe/afwp7k.png

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source VERSION A peaufinee — COMPLETE (Phase 3)
2 ajustements appliques : (1) colorisation DECOUPLEE du nom -> couleurs montent des la fin de trace de chaque
pays (CI coloree ~f110, Ghana ~f190), vivent plusieurs secondes ; labels noms restent cales audio (f241/f274).
(2) etoile Ghana ECLOT comme une graine (spring scale + rotation douce qui se resorbe), plus de pop sec.
tsc clean. Render full HD + audio. Mp4: https://files.catbox.moe/i8a4ea.mp4 · Frame: https://files.catbox.moe/q07sjl.png

[STAGE-5] remotion-composer cacao-chocolat-short/B1HookVB+B2SourceVB VERSION B — COMPLETE (variante experimentale A/B)
Variante B (convergence Gemini+Kimi) : TRANSFUSION brune B1->B2 (fil conducteur vertical 9:16) + compromis couleur B2 (brun PUIS drapeau).
B1HookVB : tablette pleine brune (luxe) -> a "Sauf qu'en Suisse" (f90) le brun se vide/coule -> wireframe encre sterile + germination avortee decalee + flaque brune en attente bas (Y1720).
B2SourceVB : reprend flaque Y1720 -> monte remplir CI/Ghana de brun -> drapeaux eclosent par-dessus en fin (CI vertical, Ghana horizontal + etoile).
Acquis communs presents : croix suisse embossee+rouge, tablette ~50% largeur, trait epais, titre qui disparait, etoile Ghana qui eclot.
tsc clean sur les 2 fichiers. Renders full HD : B1 https://files.catbox.moe/kxx95a.mp4 · B2 https://files.catbox.moe/cdapaf.mp4
NEXT (Aziz) : comparer VERSION A vs VERSION B, trancher la DA. Risque note : amorce B2 (~0.8s) un peu vide avant trace pays.

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source CANONIQUE — COMPROMIS COULEUR + AGRANDI (COMPLETE)
Porte le compromis VB dans le canonique (B2SourceVB laisse intact, reference) : chaque pays se trace ->
se remplit de BRUN CACAO #6b4423 (matiere, vit longtemps) -> DRAPEAU eclot par-dessus en fin de beat
(brun s'estompe sous le drapeau). PAS de transfusion/flaque (B2 demarre proprement). Etoile Ghana eclot.
Pays AGRANDIS ~45% (fitExtent HALF*0.05->0.95, H*0.16->0.6), bas garde pour labels+source ICCO.
Couleur anticipee (acquis) : ne depend pas du nom. tsc clean. Render full HD + audio.
Mp4: https://files.catbox.moe/7txsqd.mp4 · Final: https://files.catbox.moe/smj321.png · Brun: https://files.catbox.moe/76yyaz.png

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source — KARAOKE word-level AJOUTE (B2 COMPLET)
Sous-titres karaoke TikTok (grammaire GGW) : mot actif s'allume en BRUN CHOCOLAT #6b4423 (pas vert GGW),
autres mots encre attenuee, fond parchemin semi-transparent, position tiers inferieur AU-DESSUS de la
micro-source ICCO (bottom 230 vs 130, pas de collision). Timing REEL via whisper-align.py (32 mots).
JSON livre : out/episodes/cacao-chocolat-short/audio/cacao-beat2-words.json (+ .ts genere). Accents FR OK.
Tout B2 garde (split, compromis brun->drapeau, agrandi, etoile, geo, ICCO). tsc clean. Render full HD + audio.
Mp4: https://files.catbox.moe/0jbt2y.mp4 · Frame: https://files.catbox.moe/7l210h.png

[STAGE-5] remotion-composer cacao-chocolat-short/B1HookCuisine VARIANTE "CUISINE SUISSE" — COMPLETE (test parallele version A)
Idee Aziz : un LIEU pas un objet flottant. Cuisine/atelier suisse SUGGERE en TRAIT FIN encre #2b2117 (3-4 elements,
vide domine). Decor : plan de travail (2 lignes) + fenetre a droite avec silhouette CERVIN/neige en trait (le seul
"paysage suisse", confirme Suisse sans drapeau plaque) + moule a tablette. Couleur=evenement tenue : SEULE la tablette
se colorise brun cacao, tout le reste = trait. La tablette SE FABRIQUE (pas juste se-dessine) : chocolat COULE (matiere)
dans le moule -> niveau monte -> tablette prend forme (sillons se revelent) -> croix suisse embossee arrive (spring) ->
colorisation pleine vers "savoir-faire de luxe". Le MANQUE : cacaoyer rate dans un pot sous la fenetre, trace qui GELE
+ tige qui s'affaisse, sur fond de montagne suisse (= paradoxe "pas un seul cacaoyer"). Titre apparait puis disparait.
Calage whisper reel : f56 "vient de Suisse" (coulee) / f100 "en Suisse" / f137 "pas un seul cacaoyer" (echec) /
f256-277 "savoir-faire de luxe" (colorisation pleine). NE TOUCHE QUE B1HookCuisine.tsx (B1Hook=version A intacte).
tsc clean sur le fichier. Render full HD + audio OK (365f, 1080x1920, 872 kB) -> /scratchpad/B1HookCuisine-fullHD.mp4
VERDICT HONNETE : (1) le decor suggere TIENT le vide premium (epure, pas dessin d'enfant) — le moule disparait apres
prise (sinon contour residuel sale, corrige). (2) la tablette qui SE FABRIQUE lit MIEUX qu'une tablette qui se dessine
(geste = fil narratif "on fabrique le chocolat ICI"). (3) le paradoxe (cuisine/montagne suisse + cacaoyer qui rate)
FRAPPE une fois le cacaoyer agrandi+pot+affaissement (v1 illisible, corrige). Reserve : le moule a plat ressemble un
peu a un plateau/ecran avant remplissage ; la tige fletrie chevauche legerement le coin bas-droit de la fenetre (mineur).
NEXT (Aziz) : comparer au render version A (focus tablette) et trancher la DA.

[STAGE-5] remotion-composer cacao-chocolat-short/B2Source — micro-source FADE OUT (ajustement final)
Micro-source ICCO ne reste plus 9s : fade in f10-25 -> plein f25-90 -> fade out f90-110 -> 0.
Independante du karaoke (2 div distincts, opacites separees) — verifie f50 (source visible), f135/f255 (source
absente, karaoke OK). Reste de B2 inchange. tsc clean. Render full HD + audio.
Mp4: https://files.catbox.moe/txxako.mp4 · Frame source visible: https://files.catbox.moe/afhttv.png

[STAGE-4] visual-producer pecheur-seedance-test — BLOCKED : compte fal.ai verrouille "Exhausted balance" (403 sur storage/auth/token). 2026-07-04. Les 2 appels Seedance (cast2, cast3, prompts+plan valides Aziz) n'ont pas pu etre soumis — echec a l'etape upload CDN, AVANT toute soumission generation. Cout facture = $0.00 pour les deux. Attend Aziz : recharger fal.ai/dashboard/billing puis relancer `python -u scripts/tools/seedance-pecheur-cast2.py` et `seedance-pecheur-cast3.py` (deja ecrits, prets, sortie /tmp/pecheur-seedance-cast{2,3}.mp4).

[STAGE-4] visual-producer pecheur-seedance-test — RESOLU + CLOS. 2026-07-04 (suite). Compte fal.ai recharge par
Aziz, les 2 appels cast2/cast3 relances avec succes (aucune erreur cette fois). 3 clips complets assembles dans
PecheurSurpecheSeedance16x9.tsx (RND-PecheurSurpecheSeedance16x9), clips dans public/_rnd/pecheur-seedance/
cast{1,2,3}.mp4. Render final valide visuellement par Aziz : https://files.catbox.moe/24fbuy.mp4.
DECISION AZIZ APRES COUP : technique fonctionne tres bien (style preserve, gestes precis, poisson qui atterrit
dans le panier, pieds ancres) MAIS coup trop eleve (~6.85$/clip 10s, ~20$/scene) pour l'usage actuel (phase de
test/iteration) — NE PAS adopter Seedance comme methode par defaut pour les personnages pour l'instant. Retour
a la piste SVG organique (registre GGW/cacao/cargo, deja maitrise, cout zero). Detail complet + methode
reutilisable si besoin futur : memory/NEXT-ACTION.md § SEEDANCE PERSONNAGE — TECHNIQUE PROUVEE MAIS ECARTEE.

## [STAGE-FINAL] Short AES 90s — VIDEO COMPLETE PRODUITE + VALIDEE VISUELLEMENT (2026-07-08)
Carte vivante d3-geo PUR (zero Mapbox), reprise REUSSIE apres 4 echecs. Livrable
`out/episodes/warmap-sahel/aes-short-90s-FINAL.mp4` (92s, catbox 8ms702). Code
`src/projects/warmap/shorts/aes-short-90s/` (compo `AES-Short-Full`), branche
`feat/aes-short-90s-carte-vivante` (commit 83f5260). RESTE : musique + SFX.
Detail : `memory/episodes/warmap-sahel/SHORT-90S-PRODUCTION-2026-07-08.md`.
⛔ Les 3 "Stage 1: Direction Brief" du 2026-07-07 ci-dessous (concept "parchemin" + storyboards Agent A/B
"a valider AVANT code") sont PERIMES — la production est faite, ils ne sont plus des handoffs actifs.

---

### Stage 1: Direction Brief (creative-director)
**Date**: 2026-07-07
**Sujet**: War-Map Sahel — Short 90s "L'AES en 90 secondes" (reprise V4, apres 4 rejets)
**Verdict**: NEEDS ANSWERS (concept propose, pas encore valide par Aziz) + APPROCHE CHANGE NEEDED vs les 4 tentatives precedentes

**Script (verbatim)**: `memory/episodes/warmap-sahel/SCRIPT-SHORT-90S-V1.txt` (91.86s, audio deja genere
`public/_shared/audio/sahel-warmap/short-90s-v1.mp3`, alignement Whisper deja fait
`src/projects/warmap/_shared/whisper-words-short-90s.ts`). Ne pas regenerer script/audio.

**Historique des 4 rejets (a ne PAS repeter)** — detail complet dans
`memory/episodes/warmap-sahel/PLAN-SHORT-90S-V3-REPRISE.md` :
1. Montage extraits video Mapbox coupes -> "slideshow", trop de plans juxtaposes.
2. Carte Mapbox neuve + icones PNG bricolees -> pas fidele au style maitrise, bricolage visible.
3. Mix carte Mapbox + inserts SVG existants -> la moitie carte restait un probleme.
4. Ecu/blason unique qui se fissure/refond (propose par Kimi) -> trop abstrait pour porter la densite
   factuelle (Libye 2012, France/ONU, coup d'Etat, CEDEAO, ressources) : UN symbole ne peut pas incarner
   9 faits distincts sans devenir illisible.

**Principe valide (analyse video reference NotebookLM)** : UNE SEULE scene/objet visuel persiste a l'ecran
en continu du debut a la fin et se TRANSFORME (jamais de cut vers un nouveau decor complet). Sous-titres
mot-par-mot. Une seule rupture de registre visuel autorisee, au moment le plus dramatique (menace CEDEAO /
effet inverse).

**Concept propose ("L'Acte qui s'ecrit")** : un unique parchemin gravure/parchemin (registre deja maitrise
`#EBE0C8`/`#2C1E16`, cf `LiptakoRevealSVG.tsx`/`CfaRevealSVG.tsx`/`ResourcesRevealSVG.tsx`), cadre fixe,
avec 3 emblemes Mali/Niger/Burkina poses des le debut (meme ancrage visuel du 1er au dernier plan). Chaque
fait du script recoit SA PROPRE forme concrete qui s'ajoute/se transforme sur CE MEME cadre (jamais un
nouveau decor) : bases kaki qui implosent (reprend geometrie `ProtoVide.tsx`) -> alliances qui se
sectionnent (technique maillon CFA) -> cercle CEDEAO qui se fissure (ProtoVide) -> medaillon Libye qui
craque + contagion vers le sud (technique flow Resources) -> 2 points France/ONU cernes d'un halo rouge
qui grandit (jauge "40%" de la grammaire WarMap) -> bascule militaire sur les 3 emblemes (spring dur,
motif civil->kaki) -> RUPTURE DE REGISTRE UNIQUE : sceau CEDEAO menacant + WarMapDimmedOverlay (voile fort
deja autorise dans WARMAP-GRAMMAIRE.md), qui recule sur "l'inverse de l'effet recherche" -> climax : reprise
QUASI-LITTERALE de `LiptakoRevealSVG` (sceau AES qui se scelle, deja valide Aziz dans la video longue) au
centre du meme triangle d'embleme -> reprise de `ResourcesRevealSVG` (3 veines or/uranium/petrole vers le
meme bouclier) -> "60 ANS" count-up + respiration finale -> CTA (reutilise `CtaCard.tsx` deja code, aucune
modif necessaire).

**Pourquoi ce concept differe des 4 echecs** : (1) chaque fait a sa forme distincte -> resout le probleme
"trop abstrait" du blason ; (2) un seul cadre continu du debut a la fin -> resout le probleme "slideshow"/
"bricolage" des tentatives 1-3 ; (3) reutilise integralement 2 assets deja approuves par Aziz (Liptako,
Resources, variantes 9:16 deja pretes dans `src/projects/warmap/shorts/aes-short-90s/`) -> reduit le risque
creatif aux seuls 5 gestes neufs (panels 2-6) plutot que 10 segments inconnus.

**Panels neufs a storyboarder/valider AVANT code** (les autres = reemploi direct) :
- P2 bases kaki qui implosent + alliances sectionnees + CEDEAO qui se fissure
- P3 medaillon Libye qui craque + contagion vers Mali
- P4 halo rouge qui grandit autour des 2 points France/ONU
- P5 bascule militaire (motif civil -> kaki, spring dur)
- P6 (RUPTURE) sceau CEDEAO menacant qui recule + WarMapDimmedOverlay

**Next action**: Presenter ce concept a Aziz (question de gout, PAS a trancher seul) : (a) le concept
"parchemin qui s'ecrit" est-il assez different du blason deja rejete a ses yeux ? (b) valider degre de
reprise litterale Liptako/Resources vs adaptation ; (c) storyboarder les 5 gestes neufs (P2-P6) via Gemini/
GPT AVANT tout code, comme prescrit par `PLAN-SHORT-90S-V3-REPRISE.md` etape 1. Consulter pixellab-expert
SEULEMENT si un asset visuel (flag PNG, texture) manque — ce concept est 100% SVG generatif, pas de sprite
externe requis au-dela des drapeaux deja utilises par Liptako (`_shared/flags/{code}.png`, deja presents).

### Stage 1: Direction Brief / Storyboard execute (creative-director)
**Date**: 2026-07-07
**Sujet**: War-Map Sahel — Short 90s, reprise V4, direction "carte vivante d3-geo pure" DEJA TRANCHEE par Aziz
**Verdict**: STORYBOARD COMPLET ECRIT — NEEDS ANSWERS (1 point) + 4 gestes a prototyper avant code

**Fichier**: `memory/episodes/warmap-sahel/STORYBOARD-AGENT-A.md` — 12 panels calés sur Whisper reel
(`whisper-words-short-90s.ts`), timing frame-exact, choix drapeau tranche (aplat couleur, pas image clippee,
justifie par la concavite des polygones Mali/Niger), choregraphie Libye drapeau->gris->rouge, generalisation
de `ProtoEffect_Fracture.tsx` au bloc 3 pays+sceau CEDEAO, mapping recolorage Liptako/Resources (6 valeurs
hex), tableau faisabilite geste par geste, analyse rythme (risque identifie panels 5-6 24.5-35.8s, ~11s de
geste statique — a traiter avec soin anti-statique).

**Verifications disque faites** (pas d'affirmation non verifiee) :
- `sahel-countries.geojson` = Mali/Niger/Burkina Faso exacts. `libya-outline.geojson` EXISTE deja.
- Drapeau Libye `ly.png` ABSENT de `public/_shared/flags/` — non bloquant ici (aplat couleur choisi).
- `SahelAttackArrow.tsx` est **Mapbox-only** (`map.project()`) — NON reutilisable pour une carte d3-geo pure.
  Alternative retenue : points+halos pulsants sans fleche (le brief autorisait "eventuellement des fleches").
- `CtaCard.tsx` (a ne pas toucher) introduit une 2e rupture de registre (fond image+navy, pas parchemin) —
  signale a Aziz, PAS tranche seul (question de gout : assumer 2 ruptures vs redemander un CTA parchemin).

**Next action**: Consulter pixellab-expert SEULEMENT si besoin de generer `ly.png` (pas necessaire pour ce
storyboard). Presenter a Aziz : (1) validation du storyboard panel-par-panel, (2) trancher le point CTA/
rupture de registre, (3) go pour prototyper les 4 gestes a risque (Libye cadre-elargi, fracture generalisee,
kaki->drapeau, bases qui s'eteignent) AVANT code final — pas de code direct sans ces protos isoles.

### Stage 1: Direction Brief / Storyboard execute (creative-director, 2e agent en parallele "Agent B")
**Date**: 2026-07-07
**Sujet**: War-Map Sahel — Short 90s, meme brief que Stage 1 Agent A, execute EN AVEUGLE (angle : audace des
gestes d'animation, pas de convergence forcee avec l'autre agent).
**Verdict**: STORYBOARD COMPLET ECRIT — NEEDS ANSWERS (2 points factuels) + 4 points de composition a trancher

**Fichier**: `memory/episodes/warmap-sahel/STORYBOARD-AGENT-B.md` — 12 panels sur Whisper reel, signature
propre "la carte qui s'ecrit" (accumulation de couches d'encre, jamais d'effacement avant rupture de sens).
Choix drapeau identique a Agent A (aplat couleur, meme justification concavite). Difference notable : la
fracture CEDEAO (panel 8b, generalisee de `ProtoEffect_Fracture.tsx`) NE SE REFERME PAS entierement dans son
propre panel — elle reste ouverte a 70% et se termine SEULEMENT au panel 9 au moment ou le sceau AES apparait
au point de jonction exact (1 seul mouvement continu sur 2 panels, pas 2 effets juxtaposes).

**Verifications disque faites** :
- `sahel-countries.geojson` = Mali/Niger/Burkina exact (confirme, meme lecture qu'Agent A probablement).
- `libya-outline.geojson` EXISTE (`public/_shared/geo-data/sahel/libya-outline.geojson`) — je ne l'avais
  pas trouve au premier passage et j'avais propose de filtrer le TopoJSON mondial `countries-50m.json` a la
  place ; le fichier dedie est plus direct, a preferer par l'agent codeur.
- `ly.png` (drapeau Libye) ABSENT — non bloquant, aplat couleur tranche (pas d'image requise sur le polygone
  carte). Utile seulement si un medaillon Libye style Liptako est ajoute plus tard.
- `SahelAttackArrow.tsx` confirme Mapbox-only (`map.project()`) — inutilisable pour la fleche-menace CEDEAO
  panel 8a ; propose un `<path>+<polygon>` maison a la place (trivial, zero dependance Mapbox).
- Alerte factuelle NOUVELLE (absente du Stage 1 Agent A) : le geste "drapeau Libye vire gris puis rouge"
  suppose de partir du TRICOLORE POST-2011 (rouge-noir-vert, croissant/etoile), PAS du vert uni Kadhafi
  pre-2011 — ambiguite non tranchee, a verifier avant render (le script dit "en 2012 la Libye s'effondre",
  donc le drapeau "qui s'effondre" est celui d'AVANT la chute narrativement, mais visuellement le geste de
  bascule a plus de sens depuis le tricolore post-Kadhafi instable).
- Chiffre "+territoire" (panel 6, "PLUS de territoire qu'en 2012") : PAS de %/chiffre invente, recommande
  affichage symbolique ("+territoire") sauf source chiffree confirmee dans `FACTS-RESSOURCES-2026.md` ou
  equivalent.

**Points de composition a trancher (differents des points Agent A)** :
1. Cadrage vertical : carte ancree tiers-bas de l'ecran (1080x1920) pour liberer la moitie haute aux
   sous-titres/cartouches — a valider en preview AVANT d'investir le reste du code dessus.
2. `fitExtent` Sahel+Libye calcule UNE SEULE FOIS des le depart (pas de re-fit dynamique en cours de plan,
   pour eviter un flottement des pays deja traces) — risque assume : pays Sahel plus petits a l'ecran en
   fitExtent combine. Plan de repli documente si echec visuel (medaillon Libye separe + trait de liaison).

**Next action**: Les 2 storyboards (Agent A et Agent B) sont maintenant disponibles pour comparaison. Aziz
devrait arbitrer : (1) les 2 points factuels ci-dessus (drapeau Libye pre/post-Kadhafi, chiffre territoire),
(2) le cadrage vertical propose par B (non aborde par A a verifier), (3) choisir/fusionner entre les 2
storyboards ou en garder un comme base + emprunter des idees a l'autre, AVANT tout code. Consulter
pixellab-expert seulement si besoin d'assets nouveaux (aucun identifie comme bloquant par B).

---

## [STAGE-META] Grand menage workspace multi-piliers — orchestrateur principal (2026-07-11)

**Pas un stage de production video** — session dediee a l'audit/nettoyage du workspace lui-meme (memory/,
scripts/, skills/), a la demande d'Aziz apres plusieurs sessions ou des contradictions doctrine-vs-code
avaient cause des hesitations. Note ici pour que le prochain STAGE de production sache que ce menage a eu
lieu et puisse s'appuyer dessus.

**Fait cette session** :
- 4 audits paralleles (Warmap/Souverain/Atlas-SVG/Methode) : jury LLM perime (GPT-4o+Grok) archive, agent
  creative-director fantome rapatrie, WarMapOverlayExplicatif.tsx corrige (violait WARMAP-GRAMMAIRE §9),
  dette Mapbox vs d3-geo TRANCHEE (Mapbox = moteur de production definitif, plus jamais "a basculer").
- Reorganisation `memory/` : 37 fichiers en vrac a la racine -> 6 (nouveaux dossiers `rules/`, `backlogs/`,
  `starters/`, `projects/`). `MEMORY.md` (auto-memory) recompacte 20.6KB->16.2KB.
- 5 scripts crees et testes contre du code reel : `check-script-density.py` (Souverain), `atlas-selfreview.py`
  (Atlas), `warmap-session.py` (War-Map, detecte retroactivement le bug zoom x10 Soudan Acte 3),
  `trace-livrable.py` (traçabilite script->rendu, croise code+audio Whisper), `check-doctrine-violations.py`
  (grep patterns interdits CLAUDE.md contre code deja merge).
- Nettoyage `scripts/` : 128->110 scripts actifs (17 one-shot d'episodes livres archives).
- 3 skills construits dans `~/.claude/skills/` : `da-brief-gate`, `passe-amelioration-scene`,
  `creative-director-dual` — tous les 3 deja references dans ROUTAGE.md et SYSTEME-AGENTIQUE.md.
- Skill `/wrap` etendu : nouvelle Phase 1.5 "Retrospective de friction" (orchestrateur seul, audite le
  VECU de la session, pas les fichiers).
- Regles CLAUDE.md ajoutees : communication mobile (texte long en chat, upload catbox/Imgur/uguu.se/
  Litterbox avant presentation render), regle elargie "verifier CODE + VISUEL avant d'agir sur un livrable
  passe".
- 2 contradictions residuelles trouvees et corrigees en fin de session (agent COHERENCE du wrap) :
  `WARMAP-INDEX.md` et `WARMAP-COMPOSANTS-INDEX.md` affirmaient encore "voie production = d3-geo pur"
  alors que la decision "Mapbox definitif" avait ete tranchee plus tot dans la meme session — corrige.

**Next action** : Acte 4 Soudan "Meme les voisins sont aspires" — script v5 verrouille, reste audio (pipeline
Oceane V3 -> STS GeoAfrique) puis storyboard/breakdown/code. NEXT-ACTION.md note `passe-amelioration-scene`
et `creative-director-dual` comme options disponibles (pas obligatoires) si ce chantier bloque. Audit des
88 skills du workspace reporte a une session dediee (note dans NEXT-ACTION.md, cadrage suggere).

---

## [STAGE-1] creative-director (instance A, indépendante) — Soudan Acte 4 régie + Beat 4 — 2026-07-11

**Verdict** : Acte 4 = 100% carte Mapbox continue (aucun beat ne relève du périmètre insert SVG
état-major, réservé prise de territoire/assaut — cf `WARMAP-INSERT-SVG-ETATMAJOR.md`). Beat 4 (Nil/Égypte)
confirmé point à risque : code actuel (`SoudanActe4.tsx`) a déjà un `NileFactPlaque` texte en béquille
à côté du Nil qui pulse — signe que le geste seul ne racontait rien (même piège que concept B rejeté Acte3B1).

**Proposition** : Nil pointe Soudan→Égypte (sens du courant réel, pas le pouls remontant actuel qui est
narrativement inversé) + halo bleu du jeton SAF (établi Beat 3 juste avant) VACILLE au moment de "elle
redoute de voir le Soudan basculer" — reprise inversée du geste Beat 3 (où ce halo se renforçait), cause→effet
sans nouveau signe abstrait. Retirer `NileFactPlaque` (béquille texte = aveu que le geste seul ne suffisait pas).

**Next action** : comparer avec la proposition de l'autre instance creative-director en parallèle (brief
identique, indépendant) avant tranchage Aziz. Détail complet : `.claude/agent-memory/creative-director/soudan-acte4-beat4-nil-brief.md`.

---

## [STAGE-1] creative-director — Soudan Acte 5 (5 beats) — régie mise en scène amont — 2026-07-17

**Contexte** : script Acte 5 v6 verrouillé (5 beats), AUCUN storyboard/breakdown codé. Exercice demandé
= appliquer CONTINUITE-SCENE-INTENTION-DABORD avec angle "recherche active de rupture hors-carte" pour
chaque beat, en comparant explicitement au précédent Port-Soudan Acte 4 (sorti en insert SVG).

**Verdict** : 0 sortie de carte sur 5 beats. Tous restent Mapbox continue. Différence structurelle avec
Port-Soudan (insert SVG, Acte 4) : Port-Soudan = fait 100% incarné SANS ancrage géo porteur au moment où
il survient. Acte 5 = chaque beat, même documentaire (enquête EAU, rapport ONU), arrive AVEC un point géo
concret et nouveau à révéler (Abou Dabi, Kufra, Benghazi, El-Fasher) — nature "enquête cartographique".

**Détail par beat** :
- Beat 1 (pont Acte 4→5) : intention SITUER. Zoom-out El-Fasher→Libye, aucune étiquette encore (garder
  mystère jusqu'à Beat 2 qui nomme). Carte, évident.
- Beat 2 (EAU, enquête Lighthouse/Der Spiegel) : intention RÉVÉLER. Candidat sérieux à rupture (fait
  documentaire type Port-Soudan) mais REJETÉ car le zoom Beat 1 vient d'arriver sur ce territoire —
  payoff géo frais non consommé. Carte + médaillon presse discret en surimpression (PAS plein écran),
  jamais un insert qui remplace la carte.
- Beat 3 (Haftar/corridor, rapport ONU avril 2026) : intention RELIER. Zone teintée est-libyen (Benghazi)
  + trait corridor Kufra→sud qui s'amorce + tampon ONU discret (même registre que Beat 2).
  Carte.
- Beat 4 (El-Fasher, chaîne se boucle) : intention FAIRE CONVERGER. Carte — ⚠️ POINT D'ATTENTION CODE :
  le trait du corridor doit être LE MÊME trait qui se prolonge depuis Beat 3 (amorce Kufra→sud), PAS un
  second trait indépendant retracé de zéro. Sinon perte du sens "chaîne qui se boucle" explicite au script
  ("on la retrouve", "Résumons"). Résumé verbal de la voix = zéro texte à l'écran, le bouclage du trait
  EST le résumé visuel.
- Beat 5 (clôture "documenté... et pourtant") : intention PESER. Candidat sérieux n°2 à rupture (script dit
  lui-même "CARTE stabilisée"). REJETÉ : le poids vient de VOIR la carte à 3 points bâtie sur 4 beats,
  immobile. Rupture ici disperserait l'attention juste avant le vrai moment de rupture qui doit être
  RÉSERVÉ au cut vers Acte 6 (sujet institutions, hors-carte par nature). Léger assombrissement/grain sur
  "il continue de fonctionner" = signal de bascule tonale SANS changer de monde.

**Anti-redondance transversale** : Beats 2/3/5 utilisent un registre de "preuve documentaire" (tampon
presse/ONU) cohérent et discret — à traiter comme UN système récurrent sur les 3 occurrences, pas 3 idées
différentes.

**Next action** : Aziz arbitre ce brief (accepte tel quel / ajuste) → si validé, breakdown technique
(coordonnées précises Kufra/Benghazi/Abou Dabi sur la Map continue déjà existante des Actes 1-4, continuité
du corridor Beat3→Beat4 à modéliser comme UNE variable de trajectoire, pas deux tracés) avant tout code.
Consulter pixellab-expert si besoin d'assets neufs pour les médaillons presse/ONU (aucun identifié comme
bloquant à ce stade — probablement SVG maison, pas de génération payante requise).

---

## [STAGE-1] creative-director — Soudan Acte 5 (5 beats) — densité/variété visuelle (retour Aziz Kings & Generals) — 2026-07-17

**Contexte** : suite directe du brief mise-en-scène ci-dessus (0 sortie de carte, déjà tranché, non
remis en cause). Nouveau retour Aziz post-Acte 4 : "je préfère une carte remplie qu'une carte vide tout
le temps... être conservateur ne donne rien non plus" — référence explicite Kings and Generals. Exercice
= chercher où AUGMENTER la densité d'objets figuratifs (pas de points/halos abstraits) sous contrainte
d'ancrage strict à la voix, sans violer R-V5 (contour permanent + intérieur vide = toile) ni répéter
l'échec Acte 2 (objet figuratif non nommé par la voix = rejeté).

**Arbitrage de tension retenu** : R-V5 protège contre le remplissage GRATUIT et PERMANENT, pas contre un
objet ancré à un mot précis qui apparaît sur la fenêtre du segment vocal puis s'efface/se fige. Filtre :
chaque ajout doit avoir (a) un mot/segment vocal exact qui le déclenche, (b) une fenêtre d'apparition
liée au rythme de la phrase (pas posé en permanence dès l'entrée du beat).

**Verdict par beat** :
- **Beat 1** (pont, aucun lieu nommé) : rester épuré. Ajouter un objet ici anticiperait le reveal du
  Beat 2. Seul geste = le grain/texture déjà acté.
- **Beat 2** (EAU financent) : +1 enrichissement. Sur "camps d'entraînement" — remplacer 1 des 3-4
  jetons diffus génériques par `base-saf-td.png` reskinné neutre (silhouette camp iso déjà en stock,
  correspondance directe au mot). Ne pas remplacer les 3-4 jetons pour garder Beat 2 moins chargé que
  Beat 3 (rythme croissant).
- **Beat 3** (Haftar/corridor) — MEILLEUR CANDIDAT DE L'ACTE : la voix énumère 3 objets concrets
  ("armes, carburant, combattants"). Remplacer les 3 pulses abstraits par 3 micro-jetons synchronisés
  1-mot=1-objet, apparition puis effacement (pas de rémanence) : armes→`tech-td-red.png`,
  carburant→`wagon-cargo-or.png` (ou jerrican SVG low-cost), combattants→`portrait-rsf.png` ou
  `technical-jnim.png`. Le trait corridor reste seul élément persistant.
- **Beat 4** (El-Fasher bouclage) : rester épuré, AUCUN objet neuf — le point non-négociable des 2 agents
  précédents (même trait prolongé, pas retracé) prime, et la voix est elle-même un résumé (risque de
  paraphrase déjà identifié). Option secondaire seulement (à trancher Aziz) : réutiliser le MÊME sprite
  combattant du Beat 3 à El-Fasher sur "y ont été repérés, sur le terrain" — écho reconnaissable, pas un
  nouvel objet.
- **Beat 5** (clôture) : rester épuré, aucun objet neuf. La voix ne nomme plus d'objet concret ; le
  contraste figé/vivant déjà acté (1 seul point qui pulse) est le geste juste, une carte qui décélère
  visuellement sert le sens de clôture.

**Résultat** : 2 beats gagnent réellement en incarnation (Beat 2 = 1 objet, Beat 3 = 3 objets
synchronisés — le vrai gain), 1 gain optionnel à trancher (Beat 4), 2 restent volontairement épurés
(Beat 1, Beat 5). Courbe de densité = respiration (vide→1→3→écho optionnel→vide), pas un remplissage
uniforme — c'est le geste Kings & Generals réel (concentration sur l'énumération concrète, pas partout).
Aucun élément sans mot déclencheur : zéro risque de répéter le rejet Acte 2.

**Next action** : Aziz tranche (1) accepte/ajuste Beat 2+3, (2) décide Beat 4 sprite-écho oui/non, PUIS
breakdown technique (coordonnées + timing frame-exact des jetons synchronisés sur les 3 mots Beat 3) avant
tout code. Détail complet : `.claude/agent-memory/creative-director/soudan-acte5-densite-brief.md`.

**Complément (repasse indépendante même jour, 2e agent)** : verdicts Beat 1/3/4/5 confirmés à l'identique
(bon signal croisé). Nuance ajoutée sur Beat 2 : garder STRICTEMENT "1 jeton camp" générique (pas 3-4) —
plusieurs icônes identiques côte à côte, même sans chiffre à l'oral, se lisent comme un compte implicite
et contredisent la contrainte factuelle du script ("pas de nombre exact de camps, sources divergent").
Vérifié aussi : `CountryParchmentMask` (cité comme "réutilisable" dans le doc script Acte 5) introuvable
dans le repo à ce jour, et aucun composant "tampon presse/ONU" n'existe encore — les deux sont donc à
CODER neuf, pas à réutiliser tel quel, à budgéter en conséquence au breakdown. Détail : même fichier
`soudan-acte5-densite-brief.md` § "Complément — re-passe indépendante".

---

[STAGE-5] remotion-composer soudan-midform/Acte5-continuite-A4A5 — COMPLETE : mini-render validé
`src/projects/_rnd/d3-16x9/SoudanActe5Globe.tsx` corrigé (jetons Hemedti/al-Burhan + territoires
RSF/SAF persistent au début de l'Acte 5 au lieu d'un Soudan vide). 0 frame ajoutée. Détail complet dans
`.claude/agent-memory/remotion-composer/MEMORY.md` § "Soudan Mid-form — Polish continuité A4→A5".
Reste : re-render complet de l'Acte 5 (ou au moins ses 3 premières secondes en contexte) + réintégration
dans l'assemblage v3 si Aziz valide visuellement le fix.

---

[STAGE-5] remotion-composer soudan-midform/SourcePlaques-CORRECTION-fichiers-actifs — COMPLETE :
correction d'une erreur de la session précédente (2 des 4 plaques SOURCE avaient été posées sur les
registres Mapbox PÉRIMÉS `soudan-acte3/SoudanActe3.tsx` + `soudan-acte4/SoudanActe4.tsx`, confirmé mort
par extraction frames a3.mp4/a4.mp4 = globe D3, pas Mapbox plat). Revert propre (`git checkout --`, diff
vide après, 0 résidu `SourcePlaque`/import). Plaques réappliquées sur les 4 VRAIS fichiers actifs :
- `src/projects/_rnd/d3-16x9/SoudanActe3Section1Globe.tsx` — "US Treasury / The Sentry, 2023-2025"
  (Jebel Amer/Al Junaid ~1Md USD), ancrage local `F.milliard+15` (frame 610).
- `src/projects/_rnd/d3-16x9/SoudanActe3GlobeInsert.tsx` — "DW, nov. 2025 · AFP/L'Express" (EAU 1er
  importateur d'or), 4e plaque ajoutée à côté des 3 existantes, ancrage `T.b3PremierImportateur+15`
  (déjà défini dans soudanActe3GlobeInsertTiming.ts, pas inventé).
- `src/projects/_rnd/d3-16x9/SoudanActe4B1toB4Globe.tsx` — "Asharq Al-Awsat, 2026" (base navale
  Port-Soudan), ancrage `T.soudanPasSigne+15` (frame 1310).
- `src/projects/warmap/soudan-acte4/KostiInsertSVG.tsx` — "Sudan Doctors Network, juin 2026" (frappe
  drone Kosti), ancrage local `impactAt+20` (frame 325), `rightOffset=68` (cadre décoratif MapBackdrop
  va jusqu'à x=1892/1920). Ce fichier N'ÉTAIT PAS périmé — confirmé réutilisé tel quel dans
  `Kosti-Beat5-Standalone` (Root.tsx).
Mini-renders `npx remotion still` sur les 4 emplacements = tous OK visuellement (frames lues), aucun
chevauchement avec jetons/portraits/cadre décoratif. 0 erreur `tsc --noEmit` sur les 4 fichiers touchés.
Reste : re-render complet des 3 actes concernés (ou au moins les segments touchés) + réintégration dans
l'assemblage v3 si Aziz valide visuellement.


---

## [STAGE-5] franc-cfa-midform / Beat 5a + 5b — COMPLETE (2026-07-25)

- **Livrables** : `CfaActe5aMarche16x9.tsx` (720f) + `CfaActe5bLevier16x9.tsx` (710f), VO GeoAfrique,
  SFX, raccord joue entre les deux beats. Renders `out/_r-and-d/cfa-nuit1994/beat5*-FINAL.mp4`.
- ⚠️ **TOUT est sur le WORKTREE** `/Users/clawdbot/Workspace/remotion-cfa` (branche
  `feat/cfa-nuit1994-svg-mix`). Les renders et les VO sont en zone **gitignoree** : fermer le worktree
  sans rapatrier = perdre les livrables. STATUS a jour : § 0-QUINQUIES du STATUS du worktree.
- **Etat de l'episode** : beats 1, 2, 3 FINAL · **5a, 5b FINAL** · Acte 4 EN PAUSE (direction non
  stabilisee, code non commite volontairement) · **6a et 6b restants** · puis assemblage.
- **NEXT = Beat 6a** (carte D3 AES) : reutiliser les briques du Short AES 90s, combinees a la grammaire
  carte 16:9 `CfaActe2Carte16x9`. Puis 6b = banc d'essai du pipeline SVG narratif.
- **Regle d'episode** : fond unifie `#182746` sur tous les beats.
