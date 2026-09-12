# Production Pipeline — Shared Workspace (5 agents)

> Fichier partagé. Chaque agent écrit sa section lors de son invocation.
> Claude principal orchestre les handoffs.
>
> **Refondu 2026-05-20** (Grand Ménage) → historique dans
> `.claude/agent-memory/archive/PIPELINE-snapshot-2026-05-20.md`.
> **Re-nettoyé 2026-07-30** : 88 Ko → ce fichier. ~25 sections closes ([COMPLETE], [PÉRIMÉ],
> épisodes publiés) supprimées. Git conserve tout.
>
> ⛔ **RÈGLE** : un handoff `[COMPLETE]` se **SUPPRIME** une fois le stage suivant démarré.
> L'état durable d'un épisode vit dans `memory/episodes/<ep>/STATUS.md`, PAS ici. Ce fichier ne
> garde que ce qui est **en cours**.

---

## 🔧 SYSTÈME — chantier mémoire/gates du 2026-09-11 (CLOS)

Chaîne de démarrage **154 950 → 132 482 o (-14 %)**. PIPELINE -31 % (7 sections closes, migrées
avant suppression). ROUTAGE 39 683 → 36 639 o (14 lignes rendues à leur rôle de pointeur, marge
317 → 3 361 o). NEXT-ACTION 19 773 → 18 594 o.

⛔ **4 angles morts de gates corrigés** — tous du même type : condition juste, périmètre trop
étroit. `sections_closes()` ne voyait que les titres `##` (7 sections closes en `###` ratées
4-6 semaines) · `check-links` ne voyait pas les chemins sans dossier (16 cas) ni les branches ·
l'alerte poids ne disait pas QUEL `CLAUDE.md`. Outil né de là : `scripts/tools/test-gate.py`.

⭐ 3 skills client (`cadrer-brief-client`, `livrer-client`, `client`) **enfin routés** dans
ROUTAGE §2 — ils étaient écrits, mergés et cités nulle part.

## 💰 CONTRAT UPWORK chill-meter (AbiGirl Reacts) — jalon 2 rev2 codée (11/09), prêt à envoyer

**Premier contrat freelance signé (30/08), actif.** 350 $ → 297,50 $ net, 3 jalons. Jalon 1
APPROUVÉ. Jalon 2 (140 $) : **2 tours de révision faits les 10 et 11/09**, branche
`fix/chill-meter-entrance-impact` (non mergée).
- rev1 (10/09) — bug racine corrigé : un `spring()` portait la position pendant qu'une CONSTANTE
  portait l'impact → 0,67 s d'objet posé-immobile avant son propre « impact ». Retour cliente très
  positif (« huge improvement »).
- rev2 (11/09) — ses 4 demandes : rebond (HANG TIME, pas la hauteur), lueur bleue resserrée,
  pause de 0,75 s mesurée depuis la FIN DU MOUVEMENT, poussière latérale découplée de l'allumage.
- Livraison : **l'entrance SEULE** (`RecapEntranceRev2.tsx`, 6,5 s) — le 0-25 % déjà accepté en
  silence n'est pas remontré. Message rédigé, reste l'envoi manuel (bug `attachments` du MCP).
⚠️ Jalon 3 (75 %/100 % + exports + dossier source) : échéance contractuelle 11/09 DÉPASSÉE. Ses
SFX pour 75/100 % n'ont jamais été fournis — à demander.
→ Source de vérité : `memory/client-sim-tests/upwork-chill-meter/STATUS.md`.
→ Briques méthode nées de ce contrat : `memory/doctrines/REVERSIBILITE-MATIERE-GENEREE.md` ·
`memory/feedbacks/feedback_annoter-l-image-plutot-qu-expliquer-au-client.md` ·
`memory/projects/CHANTIER-CADRAGE-REVISIONS-CLIENT.md` ·
`memory/feedbacks/feedback_livraison-jalon-demo-groupee-vs-fichiers-individuels-jalon-final.md`.

---

## 🧍 PERSONNAGE VECTORIEL ARTICULÉ — session 2026-08-29 ⏸️ EN PAUSE

> ⭐ **Starter de reprise : `memory/starters/STARTER-PERSO-VECTORIEL-V4.md`.**
> ⏸️ Décision d'Aziz en fin de session : le personnage HUMAIN n'est PLUS l'effort principal.
> **La prochaine session porte sur les SCÈNES du corpus** (flux d'interface), pas un personnage.

**Acquis, mesurés** :
- Un rig Lottie tiers **se pilote** (placer / effacer son geste / lui en imposer un autre) →
  `src/projects/_client-sim/perso-corps-entier/tools/piloter.py`
- ⛔ **Mais on QUITTE cette voie** : sur 23 pièces du corpus, **2 seulement sont pilotables** ;
  nulls de 0 à 3, formes animées de 0 à 11 → **aucun standard entre personnages pro**, donc
  aucune compétence cumulable de ce côté.
- **Notre personnage V3** (Fable 5) : 15 calques, pivots x,y anatomiques, états de visage,
  **tient jusqu'à 120°** — le geste qui avait échoué 4× sur une pièce pro.
  → `src/projects/_client-sim/perso-corps-entier/assets/perso-neutre-v3.svg`
  ⛔ V3 n'est PAS strictement meilleure que V2 (3 régressions : bras fondus dans le torse au
  repos, cou disparu, souliers en sabots).
- ⭐ **Le geste devient une TABLE DE NOMBRES** → `src/projects/_shared/stick-figure-svg/partitions/`
  (~70 lignes de code → 5-7 clés ; un geste se **règle** en changeant un nombre).

**Cause racine nommée** : aucune référence humaine **DE FACE** dans les 23 pièces (vérifié en
les RENDANT). → V4 : Aziz apporte des SVG libres de droits vus de face.

---

## 📤 PUBLICATION — état de diffusion

> ⭐ La chaîne a commencé à publier après 25 jours de blocage. **État de DIFFUSION** (distinct de
> l'état de production : une vidéo « livrée » n'est pas forcément publiée).

| Vidéo | Production | Diffusion |
|---|---|---|
| Sénégal Pétrole & Gaz (long) | ✅ livré | ✅ **PUBLIÉ 2026-07-30** |
| War-Map Sahel AES (long) | ⛔ **ABANDONNÉ VOLONTAIREMENT** (Aziz 2026-08-17) — PAS une dette | ⛔ **PUBLIÉ 2026-08-04, ÉCHEC** (5 vues/24h) |
| Franc CFA (mid-form) | ✅ livré | ✅ **PUBLIÉ 2026-08-11** (re-titré 08-17, cf. PACKAGING) |
| Soudan mid-form (long) | ✅ livré | ✅ **PUBLIÉ 2026-08-20** (titre/miniature/description faits 2026-07-31) |
| Short Sénégal D3 · Short AES 90s · Short CFA | ✅ TOUS PROGRAMMÉS via TryPost (2026-08-01/04/11) | CTA corrigé "EN BIO" — reste Short Soudan à construire |
| Short Soudan | ⏳ timing.ts LOCKED, assets/composition à faire | à CONSTRUIRE (Stage 3+) |

**Source de vérité unique** : `/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/calendrier-publication-2026-08.md`
⛔ Vidéo LONGUE = upload MANUEL YouTube Studio (jamais TryPost). Shorts = TryPost.

---

## ÉTAT DES PROJETS VIVANTS


⭐⭐ **GAZODUC** — Actes 1+2+4+5 FINAUX. **Acte 3 en cours** (2026-08-18) :
  · Segment C (105,8→123,1 s) ✅ **FINAL** — `acte3-segmentC-verrou-FINAL.mp4` (le verrou croisé)
  · Segment A / Beats 1-2 (0→55 s) — rendu V3, **à faire valider par Aziz**
  · Segment A / Beat 3 (55→72,3 s) ⏭️ **PROCHAINE ACTION** (spec V5 complète, codée à moitié)
  · Segment B (73,9→105,8 s) — porter l'animation sur le décor Fable 5
  Puis : assemblage Acte 4 · CTA de fin · passe finale palette sombre.
Acte 1 (hook, 84.68s, globe D3) validé par Aziz (render v6, 2026-08-03). Acte 2 **produit et validé en
finale (2026-08-04)** : `out/episodes/gazoduc-aagp-tsgp/acte2-FINAL.mp4` (127.4s).

**⏭️ Acte 3 — GEL LEVÉ le 2026-08-18, c'est la PRIORITÉ 1.**
⚠️ Ce paragraphe disait « GELÉ EN WIP, NE PAS LE REPRENDRE » jusqu'au 2026-08-26 : **c'était périmé**.
Le gel du 14/08 avait UNE condition (produire les Actes 4 et 5 d'abord), remplie depuis. Autorité :
`memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md` § en tête. Le texte ci-dessous décrit l'état
mesuré de l'acte au moment du gel — il reste utile comme point de départ.
(État conservé pour référence :) Il n'est pas validé et il
reste du travail, mais on s'acharnait dessus depuis trop de sessions (même pattern que le Soudan Acte 4 :
un acte du MILIEU se juge par rapport à ses voisins, or ses voisins 4/5 n'existaient pas). **On produit
les Actes 4 et 5 d'abord.** Acquis à ne pas refaire : Beat 1 validé · Beat 2 = vrai insert composé (clip
H3 + jauge + connecteur) · Segment B (aéroport) fait. État complet + ce qui reste cassé (mesuré) :
`memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md` § "ACTE 3 — GELÉ EN WIP" (en tête).
⚠️ `memory/starters/STARTER-PROMPT-gazoduc-acte3-suite.md` : à RELIRE avant usage — il fait reprendre
l'Acte 3 (ce qui est désormais la bonne action), mais son contenu date d'AVANT les Actes 4 et 5.

**⭐ Acte 4 — état au 2026-08-15 soir** :
- Audio `narration-p4.mp3` mesuré (124.04s), copié dans `public/`, timing des **3 mouvements** dérivé du
  forced-align réel : `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe4Timing.ts`.
- **Mouvement A « une ressource, deux tuyaux » (0→41.1s) : CODÉ, RENDU EN PALETTE SOMBRE, VALIDÉ Aziz.**
  Palette `PAL_GPT` (fond dégradé radial sombre) portée dans `GazoducActe4RessourceUnique.tsx`
  (constantes `BG_TOP/BG_BOT/LAND/LAND_STROKE`, compo `D3-Gazoduc-Acte4-RessourceUnique`).
  Livrable FINAL : `out/episodes/gazoduc-aagp-tsgp/acte4-mouvementA-FINAL.mp4`.
- **Mouvement B « objectifs opposés » (41.1→74.5s) : CODÉ ET VALIDÉ (v3, arcs schématiques).**
  `GazoducActe4Objectifs.tsx`, compo `D3-Gazoduc-Acte4-Objectifs`. v3 préférée à v4 (géométrie réelle
  Medgaz) — décision Aziz explicite. Storyboard→insert SVG (`LevierPouvoirFable.tsx`)→code, méthode
  complète rejouée de bout en bout. Livrable FINAL : `out/episodes/gazoduc-aagp-tsgp/acte4-mouvementB-FINAL.mp4`.
- **Mouvement C « le calendrier se retourne » (74.5→124s) : CODÉ, RENDU, VALIDÉ AZIZ (2026-08-16).**
  `GazoducActe4Calendrier.tsx`, compo `D3-Gazoduc-Acte4-Calendrier`. Livrable FINAL :
  `out/episodes/gazoduc-aagp-tsgp/acte4-mouvementC-FINAL.mp4`.
  ⭐ **1er beat de l'épisode hors carte** — moteur GÉOMÉTRIE D3 (axe temporel + courbe + 2 conduites) :
  le beat parle du temps et de la quantité, et la carte avait déjà porté 4A et 4B. 2 rounds de
  storyboard LLM écartés au profit du plus SIMPLE (décision Aziz).
  ⚠️ 2 règles posées sur ce beat, à rejouer sur l'Acte 5 : **le texte ne répète jamais la narration**
  (4 plaques supprimées, dont "AIE") · **zéro tremblement/flash** (8 effets retirés, agitation mesurée
  0.538→0.236). Détail : `memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md` § ACTE 4.
- ⭐ Palette carte SOMBRE `PAL_GPT` confirmée adoptée pour l'Acte 4 et la suite. Actes 1/2/3 : re-render
  à la passe finale, pas acte par acte.
- **Méthode à rejouer pour C** (elle a produit A et B) : storyboard libre créative 2 modèles → validation
  Aziz → breakdown JSON → code → **3e appel comparatif rendu-vs-storyboard** → corrections. Gabarits de
  prompts prêts : `memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/`. Doctrine :
  `memory/doctrines/STORYBOARD-MAPBOX.md` § LA BOUCLE FERMÉE.
- **Acte 5 — FINAL (2026-08-17)** : `out/episodes/gazoduc-aagp-tsgp/acte5-FINAL.mp4` (46,17 s, 1385
  frames, 4 segments). La MAIN a été retirée du segment 2 (elle répétait la narration ; et DEUX
  robinets contredisaient « LE prochain grand robinet » au singulier) → refondu en UNE vanne +
  bifurcation en Y. ⭐ Règle élargie : rien à l'écran, texte OU geste, ne redit ce que la voix dit.
- ⚠️ **Acte 4 NON ASSEMBLÉ** : 3 mp4 séparés (124,68 s cumulées pour 124,04 s d'audio, marges à rogner).
- 🆕 **CTA de fin OUVERT** : l'épisode s'arrête net sur « CREUSER ». ⛔ jamais d'interpellation directe
  ni de « abonnez-vous » frontal — « de manière classe ». Nouvelle voix vs carton visuel à trancher.
- ⛔ **PRIORITÉ 1 = ACTE 3** : gel levé, sa condition (produire 4 et 5) est remplie.
- ⭐ **Gate outillé "moteur visuel"** créé cette session : `.claude/hooks/moteur-visuel-gate.sh` +
  test de non-régression `tests/hooks/test-moteur-visuel-gate.sh`. Doctrine associée enrichie :
  `memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md` (5 moteurs + amplitude prouvée + 8 trous).

Source de vérité : `memory/NEXT-ACTION.md` § "GAZODUC ACTE 4" (à rafraîchir en Phase 3 — le bloc actuel
décrit encore l'état PRÉ-session, 4A "à re-rendre").

### Kora & Cartes — piste mythologie africaine (R&D exploratoire, 2026-08-13)
2 registres visuels testés sur le même beat (pacte/négociation Anansi/Nyame, Akan/Ghana), même
méthode H3 R2V (`submit_workflow` graphe API en dur).

**Registre "Poster Vector"** (flat vector explainer style Kurzgesagt) : V1 MITIGÉ (décor OK, geste
Anansi trop peu animé) → V2 **RÉUSSI sur les 3 axes corrigés** (dialogue FR `<d>[French]...</d>`
vérifié Whisper mot pour mot, étoiles scintillantes confirmées, geste Anansi nettement renforcé via
poses contrastées par tranche). Livrable V2 :
`memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/anansi-nyame-pacte-negociation-v2-dialogue-8s.mp4`.

**Registre "Whiteboard Doodle"** (trait marqueur noir + couleur sélective jaune/bleu, RSA-Animate/
TED-Ed) : V1 **MITIGÉ** — couleur sélective strictement respectée (aucune couleur parasite),
orbite dorée + pulse final OK, dialogue confirmé par forced-alignment (loss 0.055) — MAIS geste
Anansi quasi invariant (mains déjà hautes dès t=0 dans l'image source, la clause de contraste
n'a pas d'amplitude à exploiter contrairement au Poster Vector où l'image source partait mains
basses). Idle motion Nyame non concluante (trop subtile pour l'échantillonnage). Livrable :
`memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/anansi-nyame-whiteboard-doodle-v1-dialogue-8s.mp4`.

Détail technique complet des 3 runs : `.claude/agent-memory/visual-producer/GOTCHAS-TOOLS.md`.
**[STAGE-4] visual-producer kora-cartes-mythologie — BLOCKED : Whiteboard Doodle V1 mitigé (même
défaut geste Anansi que le Poster Vector V1) → attend verdict Aziz : (a) régénérer l'image source
Whiteboard Doodle avec Anansi en pose basse/repliée comme le Poster Vector avant de retenter le
même correctif V2, (b) accepter le geste tel quel et trancher entre les 2 registres visuels sur la
base de la couleur sélective/decor, ou (c) explorer une autre piste.**

### 💤 Dormants
Hannibal (Beat 2 Phase C non codée) · Xénophobie SA (gelé, gate audience)
mid-form (backlog, après le Short).

---

## Workflows actifs

- **A — Beat Souverain Remotion/Tailwind** : `scripts/beat-session.py` (`/beat`) — 6 phases
  (breakdown → code → self-review 19/23 → review Gemini → corrections → upload).
  `memory/rules/rules-beat-production.md`.
- **B — Atlas direct** : `scripts/atlas-session.py`, pas d'agents intermédiaires.
- **C — Beat Mapbox carte** : `scripts/mapbox-session.py` + `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md`.
  Self-review scriptée d'abord : `python3 scripts/tools/mapbox-selfreview.py <Beat*.tsx>`.
- **D — SVG génératif / registre personnages** : `memory/doctrines/SVG-SCENES-GENERATIVES.md`.
  Voie par défaut des Shorts et du mid-form SVG.

⛔ **Render Mapbox/WebGL → `scripts/render-mapbox.sh` OBLIGATOIRE** (Vercel ne supporte pas WebGL
headless ; `npx remotion still`/`render` brut échouent avec "Failed to initialize WebGL").

**Le système agentique 5-stages (ci-dessous) reste la référence** pour une production complète
nécessitant narration + storyboard + assets multiples, mais les workflows A-D ci-dessus sont ceux
utilisés en pratique depuis mi-mai pour les beats simples/itératifs.

---

## Agent Team (5 agents Stage 1→6)

1. **audio-director** — Narration TTS (ElevenLabs V3) + musique (Minimax v2.6) + mix
2. **storyboarder** — Script + audio mesuré → `timing.ts` frame-précis
3. **visual-producer** — Assets multi-outils (Gemini, Seedance, Kling, Recraft, fal.ai, PixelLab)
4. **remotion-composer** — Composition Remotion + mini-render validation
5. **quality-reviewer** — Review multi-dimensions + verdict APPROVE/MINOR FIX/RE-EVALUATE

`creative-director` est **actif** (challenge de direction avant code) — l'ancienne note « archivé »
était fausse. Définitions dans `.claude/agents/`.

**Pipeline complet** :
```
Stage 0  Claude + Aziz       → Script locked
Stage 1  audio-director      → Narration + musique + mix (scan TTS bloquant)
Stage 2  storyboarder        → timing.ts frame-précis (audio mesuré)
Stage 3  visual-producer     → Visual Plan proposal → Aziz approuve
Stage 4  visual-producer     → Assets générés (preview-before-pay)
Stage 5  remotion-composer   → Composition + mini-render 3-4s bloquant
Stage 6  quality-reviewer    → Review multi-dim + Kimi + verdict
Stage 7  Aziz                → Validation finale
Stage 8  Claude (main)       → Render final OU fix iteration
```
Format de handoff entre agents : `.claude/agent-memory/shared/TODOWRITE-PATTERN.md`.
Chaînage **jamais automatique** hors session `/goal`. Handoff = fichier sur disque, jamais
TodoWrite cross-agent.

---

## Patterns validés cross-projet (références durables)

- **Hook Short (teaser 5 s)** — `memory/templates/` + `BrutalHookSplit` dans
  `src/projects/_shared/components/layouts/`.
- **Musique Minimax 2.6** — `memory/tools/minimax.md` (~0.30 $/track 3 min).
- **Narration ElevenLabs V3** — voix GéoAfrique V2 `z3gESu49naEZW8Af2Upm`. Règles TTS françaises
  NON-NÉGOCIABLES : `memory/tools/elevenlabs.md` + CLAUDE.md projet.
- **Audio Remotion** — `<Audio src={staticFile(...)} />` + `AUDIO_SEGMENTS` audio-derived timing.
- **Atlas Blueprints (8 patterns)** — `src/projects/atlas/_blueprints/`.
- **Drapeaux sur carte** — `useClipFlags` (pitch 0) / `MapboxCountryFlagDecal` (avec pitch).
  ⛔ JAMAIS `drawFlagCanvas`. SFX : `<Sequence from durationInFrames>`, jamais `{frame===X}`
  (ne joue pas en render). Détail : `memory/feedbacks/feedback_sfx-sequence-et-drapeaux-reels.md`.
- **17 templates Mapbox premium créés 2026-06-02** (FlagFill, IsolateZone, BorderPulse,
  GlassPopup, FlagReveal, LottieGeoAura, Sweep/Domino/FiberOptic, hooks+inserts+combos) — tous
  référencés dans `src/projects/_shared/mapbox/MAPBOX-COMPOSANTS.md`.

---

## HANDOFF LOG (sessions actives)

> Format : `## Stage N — Agent — Projet — Date [COMPLETE / IN PROGRESS / BLOCKED]`
> Un agent ajoute son entrée en terminant son stage. **Elle se supprime** une fois le stage suivant
> engagé — l'état durable va dans `memory/episodes/<ep>/STATUS.md`.

## Repro Foster
✅ 11 plans + montage livrés et validés le 2026-08-27. ⛔ **Ne pas relancer d'itération** sans
demande explicite. → `memory/projects/REPRO-FOSTER.md` (récit + dette SFX) · `memory/INDEX-LIENS.md`
