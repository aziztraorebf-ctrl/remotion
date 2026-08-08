# SYSTÈME AGENTIQUE — carte d'orientation (le point d'entrée unique)

> ⭐ **Active ce système à n'importe quel moment** (début, milieu, ou quand ça devient complexe). Déclencheur :
> Aziz dit « consulte notre système agentique » / « active le système » — ou une instance le lit au démarrage
> (référencé dans MEMORY.md + ROUTAGE.md). Une fois lu, tu sais comment produire/refaire une scène avec tout
> ce qu'on a construit (2026-06-19→20).
>
> ⛔ **Ce fichier ORIENTE, il ne duplique pas.** Il dit OÙ aller pour chaque besoin. Le détail vit dans les
> doctrines pointées — toujours les ouvrir avant d'agir.

---

## TU REPRENDS UNE VIDÉO / TU REFAIS UNE SCÈNE ? → LE FLUX (le cas le plus fréquent)

Ex : refonte Sénégal V3 (voix V3), refonte AES, ou toute scène à refaire. Suis CES étapes, dans l'ordre :

1. **ÉTAT RÉEL d'abord** (ne pas croire les notes) : ouvre le `STATUS.md` de l'épisode + vérifie l'état RÉEL
   dans le livrable (extraire frames/audio de la vidéo, lire le code du beat). Les notes périment — le livrable
   est la vérité. (Règle CLAUDE.md « fichiers de navigation périment ».)
   ⚠️ **3 vérifs en amont (sinon on code sur du faux — leçons cobayes 2026-06-20)** : (a) si le beat porte un CHIFFRE,
   vérifier qu'il est SOURCÉ avant de le mettre à l'écran (ne jamais halluciner une donnée — gate [[SUJET-PRIME-SUR-PRODUCTION]]) ;
   (b) `ffprobe` la durée RÉELLE de l'audio de calage + word-timing (alignment/Whisper) avant de figer `durationInFrames`
   (frame0 = 1er mot du SEGMENT de CE beat, pas de l'audio entier) ;
   (c) ⛔ **COHÉRENCE INTENTION ↔ AUDIO** : l'audio prononce-t-il VRAIMENT ce que le beat montre ? Si l'intention dit
   « solaire » mais que les mots du segment parlent de phosphate → STOP, remonter au chef. Ne JAMAIS concevoir un beau
   beat hors-sujet ni fabriquer un faux `sync_voix` (les 2 agents cobayes ont attrapé un brief incohérent ici — le
   système doit le gater, pas dépendre de leur vigilance). Si AUCUN segment ne correspond → le beat est mal briefé.
2. **INTENTION → FORME** : pour la scène, déduis l'intention (1 verbe : ce qu'elle doit faire RESSENTIR), puis
   la forme. JAMAIS partir du template. Porte d'entrée : `src/projects/_shared/INTENTION-FORME-INDEX.md`.
   Doctrine : `memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md` ⭐⭐.
   ✅ **Registre OPÉRATIONNEL (2026-06-20)** : enrichi des ~60 acquis tranchés de TOUS les piliers (2 règles
   maîtresses Data-Hero + carte/overlay, catégories incarnation Atlas & conceptuel War-Map, tags pilier).
   ⛔ **Lire la section REJETS** du registre : 15 formes déjà essayées ET abandonnées (drawFlagCanvas, flyTo,
   pitch 3D, semitransp…) — ne pas les re-tenter. Vérifie aussi que le composant cité existe RÉELLEMENT (les index périment).
3. **STORYBOARD — ÉTAPE NON-SAUTABLE, IMAGE TOUJOURS OBLIGATOIRE (tranché Aziz 2026-06-20).** ⛔ Chaque beat a
   une IMAGE de storyboard générée — PAS d'exception « formes connues = texte suffit » (règle supprimée : elle a
   fait sauter le checkpoint visuel 2×). Pourquoi : c'est AZIZ qui valide la direction, et il doit la VOIR, pas
   l'imaginer depuis un tableau d'états. Sa valeur : (a) ne pas coder dans le vide, (b) permettre le breakdown,
   (c) PROUVER le fond validé + intention/continuité/épure AVANT toute dépense.
   - **Storyboard structuré (le contenu)** : états DÉBUT→FIN (incrément minimal, épure), FOND choisi dans la palette
     (`public/_shared/refs/backgrounds/_PALETTE-BACKGROUNDS.md` — PARCHEMIN par défaut), intention par état.
   - **Image générée (TOUJOURS)** : `storyboard-dual-gen.py` (Gemini + GPT, le modèle PROPOSE). Carte/Mapbox →
     préambule 4 couches de `STORYBOARD-MAPBOX.md` (joindre NOTRE carte + chaînes de réf + ARSENAL + directive carte
     vivante ; géo approximative OK, vraie géo au CODE).
   - ⛔ **EXCEPTION — globe D3 avec socle déjà prouvé (tranché Aziz 2026-08-02, Gazoduc Acte 1)** : PAS d'image
     storyboard générée quand la scène est un globe D3 (`globeGeo.ts`/`globeCamera.ts`/occlusion réelle) et que le
     registre visuel (globe, arcs, drapeaux, caméra continue) est déjà un moteur prouvé — cf
     `feedback_globe-d3-moteur-cartographique-reutilisable.md`. Raison : un modèle image ne connaît ni notre GeoJSON
     réel ni notre moteur d'occlusion — il produirait soit du 3D photoréaliste hors-charte, soit des tracés géo
     inexacts qu'on ne peut/veut pas reproduire fidèlement au code ; ce référentiel visuel biaise plus qu'il n'aide
     (même logique que "géo approximative OK, vraie géo au CODE" en Mapbox, poussée à son terme : ici même
     l'approximation n'apporte rien). Dans ce cas : sauter direct à l'étape 5.5 (DA-BRIEF-GATE upstream) — le
     mécanisme (placement des flux/arcs, cadrage caméra par pivot) est le vrai inconnu, pas la direction visuelle.
     Ne s'applique qu'au globe D3 à socle prouvé — reste NON-SAUTABLE pour toute scène-lieu/décor/personnage/mécanique
     qui invente une direction visuelle neuve.
   - ⛔⛔ **ÉPURE DU TEXTE À L'ÉCRAN — le texte n'apparaît QUE pour l'essentiel (gravé 2026-06-26, Aziz, sc.7 Sénégal V3).**
     La VOIX porte le récit ; l'écran porte le GRAPHISME. Un texte n'est justifié à l'écran QUE s'il est une
     information-clé que le spectateur doit RETENIR ou qui n'est PAS dite par la voix (un chiffre qui frappe, une
     question pivot, un CTA). ⛔ INTERDITS car la voix les dit déjà = pur bruit visuel : les labels de section
     (« ÉPILOGUE », « ACTE 2 »), les redites de la narration (« UN PAYS QUI S'ENRICHIT » quand la voix le dit),
     les légendes redondantes avec un visuel évident (le nom « FAYE » sous un jeton marqué F). Règle pratique : pour
     CHAQUE texte du storyboard, se demander « la voix le dit-elle déjà ? le visuel le montre-t-il déjà ? » → si oui,
     RETIRER. Laisser le graphisme respirer pendant que la voix parle. (Sur sc.7 : retirés ÉPILOGUE + 2 redites +
     noms des jetons ; gardés LIMOGÉ/ÉLU, la question pivot « AU NOM DE QUI », le CTA.)
   - ⛔⛔ **FORMAT = PANEL D'ÉVOLUTION 4-CASES, JAMAIS UNE FRAME-AFFICHE (gravé 2026-06-26, erreur orchestrateur sc.6+7 Sénégal V3).**
     Le storyboard montre la PROGRESSION temporelle de la scène (case 1 début → case 4 fin) — c'est un outil de
     CHORÉGRAPHIE, pas un poster figé. **OUTIL data-viz/Remotion = `gemini-storyboard-panels.py --ratio 16:9 --background navy`**
     (PAS `gemini-gen-image.py`, qui sort une frame isolée → c'est le piège qui a produit l'erreur). ⛔ **ZÉRO photoréalisme** :
     pas de photos, pas de visages photo, pas de drapeaux raster — tout en motion design VECTORIEL navy/or. Si une scène
     appelle des gens (ex Faye/Sonko) → silhouettes-icônes géométriques, jamais des visages (cf. doctrine SVG « objet vs
     organique vivant »). C'est la RESPONSABILITÉ DU CHEF de briefer ce format aux agents — pas à l'agent de deviner.
   - L'agent-beat écrit le storyboard structuré + le PROMPT image, puis **STOP** — il ne génère pas l'asset payant
     lui-même (c'est le chef qui génère, pour grouper et valider le coût). Voir Phase 0/checkpoint plus bas dans ce fichier.
4. **LE CHEF GÉNÈRE (si image) → UPLOAD → DONNE LES LIENS À AZIZ → AZIZ VALIDE la direction.** ⭐⭐ Le chef remonte
   les storyboards à Aziz **groupés**, AVANT tout code/breakdown. C'est LE checkpoint goût. On ne code/breakdown
   JAMAIS une direction non validée. ⛔ **VAUT AUSSI POUR LE STORYBOARD TEXTE** : si les agents jugent l'image inutile
   (formes connues) et produisent un storyboard TEXTE, le chef DOIT quand même remonter ce texte à Aziz et ATTENDRE
   sa validation — ne PAS enchaîner sur le breakdown/code sous l'élan. (Erreur du chef RÉPÉTÉE 2× les 2026-06-20 :
   storyboard texte produit puis checkpoint sauté. Graver la règle ne suffit pas — le chef doit s'ARRÊTER ici, point
   d'arrêt dur, comme un fan-out qui attend les complétions avant le checkpoint.)
   ⚠️ **Si ce checkpoint est REJETÉ 2 FOIS OU PLUS sur le même chantier** (même scène/concept qui ne convainc
   toujours pas après un 2e essai) → proposer le skill `creative-director-dual` : 2 agents `creative-director`
   en parallèle, brief identique, zéro suggestion d'angle, indépendance mutuelle — Aziz tranche ensuite entre
   les 2 propositions. Pas au 1er rejet (itérer normalement suffit). Preuve : Short War-Map Sahel 90s débloqué
   après 4 rejets (2026-07-07), détail `memory/episodes/warmap-sahel/DETAIL-creative-director-reprise-2026-07-07.md`.
5. **BREAKDOWN** : on décode le storyboard validé en plan technique. ⛔ Il TRANSCRIT, il ne CRÉE pas (la
   direction est déjà tranchée au storyboard) → ne peut pas brider, il PROTÈGE. **FORMAT défini pour les DEUX
   branches** (même esprit : JSON par état, `intention_etat` libre, `forme_connue`/`si_nouveau` anti-rabotage,
   `cout_estime`, `fallback_si_echec`, `sync_voix`, `forbid`) :
   - **Carte/Mapbox** → `memory/doctrines/STORYBOARD-MAPBOX.md` § FORMAT (caméra frame-driven lon/lat/zoom).
   - **Data-viz/Remotion** → `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` § FORMAT BREAKDOWN (anim spring/interpolate,
     états calés sur les PIVOTS de la voix — jamais frames réparties arbitrairement).
5.5. **DA-BRIEF-GATE — ⛔ ARRÊT DUR, AVANT le code, APRÈS le breakdown.** Vision validée + templates/assets
   décidés → LANCER le skill `da-brief-gate` (pas juste lire la doctrine). Il orchestre l'appel
   `da-brief.py --upstream` (Gemini+Kimi+DeepSeek, MAX 1 appel/modèle/acte), écrit la synthèse tracée dans
   le PLAN de l'épisode, puis BLOQUE le passage au code tant qu'Aziz n'a pas explicitement tranché — même
   logique d'arrêt dur que le checkpoint storyboard (étape 4 ci-dessus). Détail : `memory/doctrines/DA-BRIEF-GATE.md`.
   Ne PAS sauter cette étape sous prétexte que le storyboard a déjà été validé — ce sont deux gates distincts
   (storyboard = direction visuelle validée par Aziz ; DA-brief = review externe de CETTE direction avant code).
   ⭐ **Pattern enchaîné (prouvé Soudan Acte 4, 2026-07-11)** : quand un beat est bloqué à la fois sur
   l'ORIENTATION (quel registre visuel ? insert SVG ou carte continue ?) ET sur le MÉCANISME technique
   (quel composant pour le geste ?) — lancer `creative-director-dual` D'ABORD (tranche l'orientation) PUIS
   `da-brief-gate` (tranche le mécanisme, sur l'orientation déjà actée). Ne pas inverser : un DA-brief lancé
   sur une orientation encore instable produit un brief bancal (les 3 modèles répondent sur des prémisses
   différentes de ce qui sera réellement codé).
6. **CODE** dans le bon emplacement (règle 3 zones, voir INTENTION-FORME-INDEX § « OÙ RANGER ») : livrable →
   `<pilier>/<episode>/`. Passe par la **session** (`/beat` → `beat-session.py` ou `mapbox-session.py`).
7. **REVIEW + PRÉSENTATION** : la session écrit `<mp4>.review.json` adjacent (Gemini, seuil 8/10). Le **hook**
   `pre-presentation-review.sh` BLOQUE la présentation tant que la review n'est pas faite. Donc : toujours
   `--phase review` avant de montrer.

---

## LES BRIQUES DU SYSTÈME (où est quoi)

| Besoin | Où aller |
|---|---|
| Produire/refaire une scène (porte unique) | `/beat` (`.claude/commands/beat.md`) → route Mapbox vs Remotion vs proto |
| Storyboard (le modèle propose) | `_PALETTE-BACKGROUNDS.md` (§ storyboard) · `STORYBOARD-MAPBOX.md` · outil `storyboard-dual-gen.py` |
| Review créative AMONT avant code (gate bloquant) | skill `da-brief-gate` (orchestre `da-brief.py --upstream`) — voir étape 5.5 ci-dessus · doctrine `memory/doctrines/DA-BRIEF-GATE.md` |
| **Audit qualité AVAL d'un épisode multi-scènes déjà avancé/produit** (le pendant de DA-BRIEF-GATE côté sortie : pas avant le code, mais après plusieurs scènes déjà là) | skill `passe-amelioration-scene` — N agents (1/scène) + 1 agent transversal de synthèse. Doctrine `memory/doctrines/PASSE-AMELIORATION-SCENE-PAR-SCENE.md`. À proposer quand un épisode multi-actes semble avoir des scènes datées (techniques apprises après leur render) ou avant promotion finale d'un épisode long suspecté incohérent. |
| Palette de fonds + arsenal de capacités | `public/_shared/refs/backgrounds/` · `public/_shared/refs/cartes/_ARSENAL.md` |
| ORCHESTRATION (chef + agents frais) | ce fichier (SYSTEME-AGENTIQUE) — découper, fan-out N beats, 2-3 checkpoints, isolation worktree. Méthode prouvée 3 vagues (consolidation 2026-06-25) |
| Intention → forme → template | `src/projects/_shared/INTENTION-FORME-INDEX.md` + `CONTINUITE-SCENE-INTENTION-DABORD.md` |
| Où ranger un fichier (3 zones) | INTENTION-FORME-INDEX § « OÙ RANGER » (livrable / `_rnd` proto / `_shared` brique) |
| Hooks actifs (garde-fous) | `.claude/hooks/` — auto-vérif présentation, model-guard, preflight carte, **rappel registre intention→forme avant toute scène `.tsx`** (`beat-preflight.sh`, non bloquant), lint |
| État anti-fouillis (pourquoi le système) | `memory/PLAN-SYSTEME-ANTI-FOUILLIS.md` |
| Scripts par cas d'usage | `scripts/SCRIPTS-INDEX.md` |

---

## LES 3 PRINCIPES QUI GOUVERNENT (rappel — détail dans CLAUDE.md § règles de travail)

1. **Le modèle PROPOSE, on valide, PUIS breakdown → code.** Goût jugé avant-code (gratuit), pas après-render (cher).
2. **Guider sans brider** : exigence + arsenal d'inspiration (« va plus loin ») + interdits, JAMAIS dicter la
   technique ni cocher une checklist.
3. **Déléguer à un agent frais** : un contexte vierge bat un contexte saturé pour produire/vérifier. Claude =
   chef d'orchestre, pas exécutant de chaque pixel.
   ⚠️ **Prompt multi-agents parallèles = préciser explicitement l'indépendance** ("toi seul, mission
   autonome, ne pas attendre/mentionner d'autres agents") — vécu 2026-08-07 (session studio réutilisable) :
   2 agents sur 4 lancés en parallèle se sont mis en "attente des autres agents" au lieu de produire leur
   rapport solo, faute de cette précision dans le prompt. Coût : relance nécessaire, tokens perdus.

---

## ⚠️ CE QUI N'EST PAS ENCORE BRANCHÉ (au 2026-06-20 — voir NEXT-ACTION pour le détail)
- ✅ **RÉSOLU 2026-06-20** : l'étape 2 (INTENTION→FORME) est désormais OPÉRATIONNELLE — registre rempli des
  ~60 acquis + section REJETS + rappel par hook (avant, le flux pointait vers un registre à moitié vide).
  Validé par agents vierges (2/3 trouvent la forme du 1er coup sans connaître l'historique).
- ✅ **CLARIFIÉ 2026-06-20** : le storyboard est NON-SAUTABLE (image ou texte, voir étape 3). Le chef remonte les
  liens/textes à Aziz avant tout code. Câblé dans les sessions Mapbox (phase storyboard+breakdown) et Remotion (gate PNG).
- ✅ **RÉSOLU 2026-06-20** : pont storyboard→timing défini pour les DEUX branches (Mapbox : `STORYBOARD-MAPBOX.md` ;
  Remotion : `SOUVERAIN-REMOTION-PLAYBOOK.md` § FORMAT BREAKDOWN). Plus d'invention de frames par l'agent.
- ✅ **RÉSOLU 2026-06-20** : gate de la boucle review fiabilisé. `visual_review.py` extrait désormais le vrai score
  (bug tableau JSON corrigé) + calcule `phase_match_avg` (signal STABLE). Gate sur `phase_match_avg` ≥80%, PAS sur
  le score global (bruité). Doctrine : `scripts/tools/REVIEW-TOOLS-INDEX.md`.
- ✅ **RÉSOLU 2026-06-20** : le format du breakdown Mapbox (pont storyboard→code carte) est DÉFINI et ÉPROUVÉ
  (agent réel, piège créatif → idée préservée). → `STORYBOARD-MAPBOX.md` § FORMAT.
- L'orchestration complète bout-en-bout reste à éprouver sur une vraie mini-vidéo propre (le révélateur des
  lacunes restantes de l'étape 3 storyboard).
→ En attendant : on peut suivre le flux ci-dessus À LA MAIN (générer le storyboard, valider, coder via session).
