# War-Map Sahel AES — STATUS

**Dernière mise à jour :** 2026-06-15 (nuit) — TOUTES LES SCÈNES FINAL, reste l'ASSEMBLAGE.
**Branche :** `feat/p3-ambient-vie`. **Format :** War-Map Long 16:9, ~7min26. Voix GéoAfrique V2 (V3→STS).

> ⛔⭐ **REPRISE AU RETOUR — LIRE CECI, IGNORER TOUT L'HISTORIQUE CI-DESSOUS (périmé, conservé pour archive) :**
>
> **TOUTES LES SCÈNES SONT FINAL + full HD** (`out/episodes/warmap-sahel/`) : acte1 · p1 · p2 · p3 ·
> p4-c1-exode · p4-cfa · p4-chantier3-confed · p4-ressources (+ chantier 4 "fin habitée" dans P4).
> La refonte P4 est **TERMINÉE** (les 6 scènes validées Aziz). **AUCUNE scène à créer/corriger.**
>
> **▶ NEXT = ASSEMBLAGE UNIQUEMENT** :
> 1. Rendre P4 complète : compo `SahelPartie4` (`partie4:true`), f9416→13440, full HD, `--gl=angle` (Mapbox).
>    Audio : `public/_shared/audio/sahel-warmap/narration-v5-p4.mp3`.
> 2. Concat ffmpeg Acte1+P1+P2+P3+P4 + narration globale `narration-v5-expressive.mp3` + 1 musique continue +
>    SFX + mix. Vérif anti-figé (1 frame/2s + md5, key-learnings 06-08).
> 3. PUIS Gemini/Twelve Labs sur la vidéo COMPLÈTE (polish final). PUIS dérivés (`STRATEGIE-DERIVES-SHORT-CARROUSEL.md`).
>
> 📂 DOCS À JOUR : `memory/NEXT-ACTION.md` (en-tête) · `INVENTAIRE-TEMPLATES-SESSION-06-15.md` (templates
> utilisés/réserve) · `STRATEGIE-DERIVES-SHORT-CARROUSEL.md`.
> ⛔ DOCS OBSOLÈTES (NE PAS suivre) : `PLAN-REFONTE-P4.md`, `BRIEF-PASSATION-P4*.md` (refonte finie).
> 🧰 TEMPLATES CRÉÉS (06-14/15) : `WarMapDimmedOverlay` (carte assombrie+overlay), `WarMapSplitScreen` (2/3
> volets + accordéon). Doctrine : `WARMAP-CARTE-VS-OVERLAY.md`. Règle debug : key-learnings 06-15.

---

# ═══════════ HISTORIQUE (archive — état pré-finalisation, NE PAS coder depuis ici) ═══════════

## 🎬 PASSE "RENDRE VIVANT" P3 (2026-06-14) — densifier les zones mortes SANS casser le validé

> Objectif Aziz : on a été "trop prudent", le format permet plus de vie du début à la fin. On MEUBLE les
> zones mortes de P3 (narrativement validée) sans toucher au récit. Audit + DA-brief (Gemini+Kimi) faits.

**⭐⭐ DÉCOUVERTE STRATÉGIQUE = 3e VOIE D'ANIMATION : le SVG animé par code.** Doctrine créée :
`memory/doctrines/WARMAP-SVG-ANIME-3E-VOIE.md`. Pour drapeaux/tissus/ondes/tracés/jauges/flux → SVG
animé frame-driven (déformation de paths via Math.sin) = SUPÉRIEUR à PixelLab (net full HD, nos couleurs,
0 coût, 0 risque). À proposer EN PREMIER. Gemini = sprites à trait fin ; PixelLab = effets denses chaotiques ;
DIFFUS (poussière sol) = personne (leçon ratée poussière, confirmée 2x).

**DA-brief P3 archivé :** `memory/episodes/warmap-sahel/da-briefs/P3-vivacite-{gemini,kimi,BRIEF}.{md,txt}`.
Synthèse : NE PAS animer les jetons en image-à-image (piège, "jeu vidéo cheap") ; diversifier l'impact
(cercle d'encre = chocs politiques seulement ; matière dense = chocs militaires) ; ne PAS toucher Ph4/Ph7.
Vérif code : Gemini a halluciné 2 critiques AI-slop déjà résolues (drapeau Ph7 déjà 0.82+multiply ; grain
papier déjà appliqué). Gemini = signal jamais juge → confirmé.

**ÉTAT DES CHANTIERS P3 :**
- ✅ **Ph5 STATU QUO — VALIDÉ Aziz** : drapeau touareg (Azawad vert-rouge-noir désaturé) qui ONDULE sur
  Kidal (SVG animé, ambiant, sort à l'approche FAMa) + ondes "observation passive" ONU (cercles bleus fins
  qui s'éteignent avant Kidal = inaction) + jetons touaregs réduits ~12% (JETON_DEG ×0.88). Code dans
  `Partie3Rupture.tsx`. Recette drapeau ondulant réutilisable (bloc "DRAPEAU TOUAREG ondulant").
- ⏳ **Ph2 convergence frontières** (frontières 3 pays se tracent depuis capitales → sceau central) — SVG, 0 risque.
- ⏳ **Ph9 matière d'impact** (étincelle SVG + fx-explosion désat. + micro coup-de-reins jeton qui charge).
- ⏳ **Ph6 traînée fumée** (fx-smoke courte derrière FAMa — à valider visuellement, risque surcharge).
- ❌ **ÉCARTÉ** : poussière diffuse / dust devil (doctrine : ni SVG ni PixelLab ne rendent le diffus top-down).
- PROCHAINE ACTION : Aziz choisit le prochain chantier (Ph2 recommandé). Méthode = mini-render comparatif full HD.

---

## 🔄 SYNCHRO DEUX SESSIONS P3 (2026-06-12 après-midi) — LIRE SI TU CODES P3

> **Deux sessions ont tourné en parallèle sur P3 sur la MÊME branche `feat/da-brief-gate-warmap-sahel` :**
> - Session A (coding) : a commencé `Partie3Rupture.tsx` + branché `partie3` dans `SahelWarMapEngine.tsx` + `Root.tsx`.
> - Session B (plan + DA-brief) : a finalisé `PLAN-NARRATIF-P3.md` + tranché 2 décisions de goût + 4 angles morts. **COMMITÉ (3073214).**
>
> **➡️ LA SESSION DE CODING DOIT `git pull` PUIS CONFRONTER son code au plan à jour.** Le plan PRIME sur le code.
> Points à vérifier dans le code déjà écrit (détail complet dans `PLAN-NARRATIF-P3.md` sections Ph6/Ph7/Ph8/Ph9 + "DÉCISIONS DA-BRIEF P3") :
> 1. **Drapeau Kidal (Ph7)** : fill clippé `useClipFlags` + MICRO-ONDULATION du clip-path SVG (PAS de sprite généré). Drapeau ondule seul pendant le figé 2s.
> 2. **Moura (Ph8)** : abstraction pure, point rouge `#6B1A1A` + halo bordeaux STATIQUE 20%, AUCUN visage.
> 3. **Anachronisme Moura** : carte "état altéré" (fondu sépia + Kidal-bleu opacité 20% + timeline anthracite recule 2022).
> 4. **Raccord ONU→FAMa (Ph6)** : chevauchement (1er waypoint FAMa quand dernier point ONU à ~50% opacité).
> 5. **Anti AI-slop chromatique** : bleu Mali DÉSATURÉ `#2B4F7C` fill 40-60% (jamais 100%), or AES mat, rouge `#6B1A1A`.
> 6. **Easing Ph9** : sprites jihadistes (technical-jnim/fighter-jnim/fighter-eigs) avance vite → arrêt net → recul lent effiloché. PAS de halos rouges qui poppent (ancien plan abandonné).
> Aucun nouvel asset à générer (tout sur disque). Réutilisation jetons/bases/contours/sillage = justifiée (confirmée par les 3 voix).

---

## ⛔ REPRISE PROCHAINE SESSION (2026-06-12) — P2 NARRATIVE VALIDÉE, place à P3 (session parallèle)

> 🟢 **POUR DÉMARRER LA P3 : LIRE `memory/episodes/warmap-sahel/BRIEF-PASSATION-P3.md` EN PREMIER** — brief
> autonome (quel fichier copier = Partie2Blocage.tsx, PAS Proto24 ; triggers P3 vérifiés ; assets ; pattern
> moteur ; ordre strict : REPRÉVOIR LE VISUEL → DA-brief → code). Tout y est, sans ambiguïté.

**ÉTAT : Acte1 ✅ + P1 ✅ + P2 NARRATIVE ✅ VALIDÉE Aziz ("très bon point d'équilibre").**
Reste sur la vidéo : **P3 "La Rupture" + P4 "Coût/Perspective" + assemblage final.** ~la moitié est derrière.
Render P2 final : `out/episodes/warmap-sahel/p2-FINAL.mp4` (audio embarqué, catbox gfsa3h).

> ⭐⭐ **LIRE EN PREMIER AVANT DE CODER P3 : `memory/doctrines/WARMAP-GRAMMAIRE-CAUSALE.md`** — LA doctrine
> qui évite le "bordel confus du départ" (Aziz). Règle CAUSE avant EFFET + catalogue des 5 techniques causales
> validées (avancée jetons+sillage · chute base 3 temps · donnée qui se MONTRE par remplissage du pays ·
> contour flash · casser la grammaire pour acteur différent). C'est le standard non-négociable.

### ⭐⭐ LA MÉTHODE QUI A MARCHÉ (à appliquer SYSTÉMATIQUEMENT P3/P4) — leçon majeure de la session
La P2 a été refaite 4 fois avant de marcher. Ce qui a débloqué = **partir de l'AUDIO, raconter une action
CAUSALE, combiner l'arsenal complet**. Séquence obligatoire avant de coder une Partie :
1. **ÉCOUTER l'audio phrase par phrase** → pour chaque phrase : "que doit COMPRENDRE un œil neuf ?"
   (PLAN-NARRATIF-P2.md = le modèle). Le timing technique (triggers) ne suffit pas — il faut le SENS.
2. **CAUSE avant EFFET** : ne jamais faire apparaître un RÉSULTAT (zone rouge, base qui tombe) sans montrer
   sa CAUSE (les jetons qui avancent/encerclent). "État qui pop" = incompréhensible = rejeté.
3. **COMBINER l'arsenal** (jamais 1 seul asset) : jetons (acteurs) + zones (conséquence) + sprites Gemini
   (lieux) + PixelLab (effets) + frise/timeline (temps) + contours flash + plaques. C'est l'ensemble qui crée le sens.
4. **DA-brief upstream** sur le plan narratif AVANT de coder (Gemini+Kimi, signal jamais juge).

### Briques P2 RÉUTILISABLES P3/P4 (toutes dans `parties/`)
- `warmapPremiumKit.ts` : buildStaticZone, smoothClosedPath, smokePingPong, **interpWaypoints** (jetons qui
  avancent), **countryOutline** (contour territoire qui se dessine + flash), spriteMapWidth (ancrage carte), PAL.
- `WarMapPlaque.tsx` : plaque de nom parchemin élégante (adaptation GeoCountryPlaque), pos projetée.
- `sahelCountries.ts` : vrais contours Mali/Niger/Burkina (décimés).
- **chip()** (dans Partie2Blocage) : jeton circulaire (cercle parchemin + bordure faction + portrait clippé).
- **Sillage causal** : mask de cercles flouté aux positions PASSÉES des jetons → territoire rouge révélé.
- **Chute base 3 temps** : alerte (pulse) → chute → fumée. **Junte = jeton institutionnel** (jeton-junte).
- **Timeline graduée** : réactivée pour partie2 dans le moteur (pleine largeur, curseur date dès le début).
- **SFX banque warmap/** : ink-spread (sillage), impact (chute), boom-coup (coup d'État), arrow-whoosh, drone.

### 3 RÈGLES STRUCTURELLES gravées (doctrine WARMAP-OBJETS-GEMINI-VS-PIXELLAB.md)
R-OBJ-1 taille ANCRÉE CARTE (jamais vmin) · R-OBJ-2 objet = IMAGE Gemini jamais dot · R-OBJ-3 zones TRANSITOIRES.
+ technique systématique : **contour du territoire nommé qui se dessine + flash** (couleur porteuse de sens).

### Décisions de goût Aziz verrouillées (P2)
Jetons circulaires (pas portraits nus) · bases tombent en fumée APRÈS attaque visible · villes = points NOMMÉS
(pas sprite-bâtiment) · 40% Burkina se MONTRE (remplissage contour, pas overlay chiffré) · plaques SANS stat
superflu · SFX seulement si support visuel (cedeao-snap retiré faute de visuel CEDEAO) · silencieux sur poses/avancées.

---

## (archive — historique P2, NE PAS coder depuis ici) — voir REPRISE en tête

> ⚠️ ANTI-CONFUSION (trou détecté test agent vierge 2026-06-12) : cette zone décrit des ÉTATS PÉRIMÉS
> de la P2 (1ère passe SVG rejetée, proto 2.4, "généraliser depuis Proto24"). **TOUT CELA EST DÉPASSÉ.**
> La VÉRITÉ ACTUELLE = section REPRISE en tête : **`Partie2Blocage.tsx` EST la P2 narrative VALIDÉE**.
> `Proto24Extinction.tsx` = compo de test historique (proto du beat 2.4), NE PAS la prendre comme modèle —
> le modèle est `Partie2Blocage.tsx`. Le mode moteur `proto24` est LEGACY (à ignorer pour P3/P4).
> Historique condensé : P2 refondue 4× → SVG plat (rejeté 4/10) → premium "états" (confus) → grammaire causale (validé).

---


## ⭐ PARTIE 1 VALIDÉE + PATTERN `<PartieX>` (2026-06-11) — LIRE AVANT DE CODER P2-P4

**Partie 1 (canari) VALIDÉE par Aziz.** Render final : `out/episodes/warmap-sahel/wip/partie1-fullhd-v3.mp4`
(catbox `m12kke`). Direction soustraction + propagation Kidal→Gao/Tombouctou + pulse villes + hachures rouges.

### 🔑 LE PATTERN POUR CODER UNE PARTIE (réutiliser tel quel pour P2, P3, P4)
La War-Map a un ÉTAT CONTINU → on ne concatène PAS des fichiers. Architecture = **moteur conteneur +
1 fichier React par Partie, en COUCHE isolée**. Pour ajouter une Partie :
1. **Créer** `src/projects/warmap/parties/PartieN<Nom>.tsx` — composant pur `({ ctx }: { ctx: SahelRenderContext | null })`.
   Reçoit `ctx.frame`, `ctx.project(lon,lat)→{x,y}` (closure map courante), `ctx.width/height`, `ctx.controlAt`, `ctx.breathe`.
   Dessine SA couche SVG par-dessus la carte. Ne possède PAS la map. Modèle complet : `Partie1Origine.tsx`.
2. **Moteur** `SahelWarMapEngine.tsx` : ajouter prop `partieN?: boolean` → l'inclure dans `isFinalLook`
   (hérite du look Acte 1) → ajouter `getPartieNCam` (raccord exact depuis fin Partie précédente, JAMAIS de coupe)
   dans la sélection caméra (`camFn = partieN ? getPartieNCam : ...`) → injecter `{partieN && <PartieN ctx={sahelCtx} />}`
   avant le bloc grain/vignette → gater les blocs legacy sur `!partieN` si besoin.
3. **Root.tsx** : enregistrer compo `SahelPartieN` avec `defaultProps={{ partieN: true }}`.
4. **Hooks moteur pour effets carte** (fill-opacity, board clearing) : multiplier l'expression existante par un
   facteur gaté `partieN` dans la boucle frame (ex: vide d'État P1 = `setPaintProperty("sahel-fill","fill-opacity", ["*", baseOp, voidFactor])`).
5. **Triggers** : TOUJOURS recalés sur `narration-v5-alignment.json` (mot × 30 fps = frame). Lire le JSON (`D["words"]`).

### Briques réutilisables P2-P4 (dans `Partie1Origine.tsx`)
- `buildSmoothPath(pts)` → {d, len} : path SVG lisse + longueur (traits stroke-dashoffset).
- Trait d'encre route réelle (brun = source externe) vs trait rouge (propagation/violence interne).
- Pulse ville = onde radar à la chute + teinte rouge persistante. Pulse région = onde concentrique.
- Labels géo-ancrés avec halo réserve parchemin (`paintOrder=stroke`, PAS de boîte blanche).
- Hachures tension = pattern rouge-sombre + teinte diffuse sous-jacente (l'encre seule ne se lit pas).

### Règles de goût VERROUILLÉES (Aziz 2026-06-11)
- **War-Map = 100% carte, ZÉRO plein écran** (voir `WARMAP-LONG-DOCTRINE.md`). Moments forts = PAR la carte
  (caméra, pulses, vide d'opacité, assombrissement). Plein écran = Souverain Mid-form uniquement.
- 3 registres d'enrichissement autorisés sans quitter la carte : portraits/visages projetés · objets Gemini
  encre top-down (P3-P4) · données animées dans overlay ancré (jamais plein écran).
- Board clearing P1 = 0.05 (table rase, retour 2012). Trait route réelle (pas ligne droite/flèche TikTok).

### DETTE différée (NE PAS faire maintenant — quand P2-P4 couvriront l'Acte 2)
- Legacy `acte2` (avion/convoi/bases) GARDÉ comme filet + référence visuelle pour coder P2-P4. À supprimer plus tard.
- Cartouches blancs sous labels de ville (BAMAKO/NIAMEY) = anti-parchemin hérité Acte 1 → corriger avec le recalage Acte 1.
- Recaler triggers Acte 1 sur audio V5 + retirer sa timeline graduée (déjà masquée en mode partie1).
- Bug corrigé : `<Audio narration-v2.mp3>` (supprimé) → repointé `narration-v5-expressive.mp3` (synchro Acte1 à recaler).

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

## ▶ ÉTAT REFACTOR (2026-06-11) — Tasks 0-6 FAITES, Task 7 en cours

**Le refactor moteur-fin + Partie 1 (4 beats) est CODÉ.** Branche `feat/da-brief-gate-warmap-sahel`.
- **Task 0-2** : baseline non-régression Acte 1 (`out/episodes/warmap-sahel/_refactor-baseline/`) +
  `SahelContext.ts` (type + closure `project`) + coquille `<Partie1Origine>` + mode `partie1` + compo `SahelPartie1`.
- **Task 3-6 (4 beats Partie 1)** dans `src/projects/warmap/parties/Partie1Origine.tsx` + hooks moteur :
  - 1.0 board clearing jetons→0.05 (décision Aziz) + cartouche encre "2012" + repère "LIBYE" + `getPartie1Cam`
    (raccord exact fin Acte 1 f2102 → PULL BACK corridor Libye→Mali → push-in Mali central).
  - 1.1 pulse Libye (onde-radar encre + foyer chaud) au mot "s'effondre" (f2210).
  - 1.2 trait d'encre route réelle Sebha→Ghat→Salvador→Kidal (stroke-dashoffset) + 3 taches impact #8B3A3A.
  - 1.3 vide d'État (fill `sahel-fill` →0.16 au mot "absent" f2743) + veine persistante + hachures (f2844).
  - Timeline Acte 1 masquée en `partie1` (gate `!partie1`).
- **Triggers V5 Partie 1** (alignment) : bascule f2102 · Libye f2178 · s'effondre f2210 · flot f2305 · absent f2743 · tensions f2844.
- **Task 7** : render full HD `SahelPartie1` f2055-2940 muet → présentation Aziz (jugement goût).
- **Task 8** (après validation) : supprimer legacy `acte2` + recaler triggers Acte 1 sur audio V5 + documenter pattern.

### ⚠️ BUG LATENT CORRIGÉ : `<Audio narration-v2.mp3>` (supprimé au ménage) → l'Acte 1 ne rendait plus.
Repointé vers `narration-v5-expressive.mp3` (ligne ~1722). Mais Acte 1 encore calé triggers V1/V2 → synchro V5 à recaler (Task 8).

### Astuce render : `--frames=AAAA-BBBB` rend une plage en secondes (check non-régression instantané vs re-render 2300f).

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

## ⏳ CHANTIER TRANSVERSAL EN ATTENTE — "Fond de contrôle qui respire" (session dédiée, Aziz 2026-06-13)
Constat (Aziz P3) : depuis l'Acte 2, la carte colorée de contrôle territorial (sahel-fill rouge/contesté/bleu)
est forcée à ~12% ("carte calme" pour que les beats ressortent) → on a PERDU la lecture de fond "qui tient quoi".
La légende de contrôle (haut-gauche) est aussi masquée en P2/P3.
DÉCISION : réintroduire un FOND QUI RESPIRE — calme (~15%) pendant l'action (jetons/combat/sillage), remonte
(~35%) sur les temps de lecture (transitions, plans larges, morale). + légende code-couleur BRÈVE aux moments
clés (pas permanente). Cohérent avec l'inversion chromatique (rouge=jihadiste, bleu=État).
PORTÉE : transversal — à appliquer à Acte1/P1/P2/P3 ENSEMBLE (sinon incohérence), donc SESSION DÉDIÉE, en une
passe : (1) mécanique controlBaseOpacity pilotée par phase dans SahelWarMapEngine, (2) composant légende brève,
(3) brancher chaque partie, (4) re-render court de chaque partie + jugement d'ensemble. NE PAS faire au coup par coup.

## ✅ P3 "LA RUPTURE" — v8 FINALE proposée (2026-06-13) — EN ATTENTE VALIDATION AZIZ
Render final : `out/episodes/warmap-sahel/wip/p3-FULL_v8.mp4` (catbox 93yw8p, scale 0.5, audio embarqué).
Compo `SahelPartie3` (f6118→9410, durationInFrames 9410). Code : `parties/Partie3Rupture.tsx`.
8 itérations + 2 reviews DA (upstream + premium Gemini/Kimi) + passe premium.
CONTENU : overlay AES dynamique (brique WarMapOverlayDynamic réutilisable) · ville-forteresse Kidal (Gemini) ·
jetons en tenaille + pictogrammes faction (chevrons=mil/losange=merc/étoile=armed) · jeton mercenaire Africa
Corps (Gemini, distinct des FAMa) · MINUSMA campements top-down + badge no-fire (fade au retrait) · drapeau
Kidal = losange 3 bandes Mali tracé · Moura sépia+tache de sang+SFX grave · attaques 2026 combat jetons
physiques (jihadiste charge→FAMa bloque→repoussé) · drift caméra continu · flash or climax · tracé frontières
zone Kidal (sable→bleu) · fin serrée f9410 (pas de débordement P4).
ÉCARTÉ : pitch 3D (cosmétique sans relief) · PixelLab (jure avec jetons réalistes) · plein écran (réservé P4).
NEXT : (1) si Aziz valide → render FULL HD ; (2) SESSION DÉDIÉE 'fond de contrôle qui respire' (transversal
Acte1→P3) ; (3) P4 (coût/réfugiés/franc CFA — plein écran OK pour les concepts).
Assets générés : public/_shared/sprites/warmap/{ville-kidal,jeton-africacorps}.png · flags/{ml,bf,ne}.png.
Briques nouvelles : _shared/WarMapOverlayDynamic.tsx (overlay dynamique réutilisable, 6 blocs composables).
Doctrines : REVIEW-PREMIUM-TEMPLATE.md (standard review) · WARMAP-LONG-DOCTRINE (règle overlay vs plein écran).

## 🔄 P4 "LE COÛT, LE LEVIER, LA PERSPECTIVE" — EN COURS (2026-06-14) — DERNIÈRE PARTIE

**État : codée + branchée + render full v2 en cours (corrections appliquées).** Fichier : `parties/Partie4Cout.tsx`.
Compo `SahelPartie4` (f9416→13439, durationInFrames 13440). Mode moteur `partie4` branché (miroir partie3).

**PIPELINE SUIVI (ordre strict brief) :**
- ✅ `PLAN-NARRATIF-P4.md` (11 phrases, triggers VÉRIFIÉS vs alignment — BEATS-V5 était décalé +373f sur confédération).
- ✅ **DA-brief en 2 passes** : v1 validé mais INCOMPLET → Aziz signale 3 manques (causalité phrase-par-phrase jamais
  demandée · chaînes de réf absentes · catalogue templates non envoyé). v2 ENRICHI (`--catalog` + question causale +
  comparaison genre Operations Room/K&G/BazBattles). Output : `/tmp/da-refs/da-warmap-sahel-p4-causal-{gemini,kimi}.md`.
  → LEÇON : le DA-brief DOIT inclure la causalité phrase-par-phrase + les chaînes de réf + le catalogue templates.
- ✅ 4 assets Gemini (`public/_shared/sprites/warmap/p4-assets/`) : icon-or/uranium/petrole/sceau-confederation.
- ✅ CODE + branchement moteur + Root.

**ARC 3 MOUVEMENTS** : Coût (réfugiés Ph2 + chiffre ancré Ph3) → Levier (or/uranium/pétrole, accumulation) →
Perspective (confédération fusion Ph7 + CFA plein écran Ph8 + dézoom continental Ph9-10 + extinction au noir Ph11).

**CAUSALITÉ (du DA-brief v2, gravée) :** Ph2 ville pulse rouge→visage s'extrait→traînée · Ph3 overlay ANCRÉ sur
cluster réfugiés (pas diapo) · Ph5-6 contour pulse→remplissage→icône émerge (pas pop) · Ph7 fils convergent→fusion
or→sceau tampon (pas morph PowerPoint) · RÈGLE CHROMATIQUE rouge≠or simultané (anti-cynisme).

**CORRECTIONS POST-RENDER (3 itérations) :** légende masquée (`!partie4`) · icônes or visibles (retrait mixBlend
multiply qui les noyait + taille bornée) · fond ÉPURÉ (sahel-fill neutralisé parchemin uniforme + front-glow off,
décision Aziz : la conclusion ne parle plus de qui-tient-quoi) · ⭐ CTA/outro/intro globaux gatés `!isPartie`
(parasitaient l'extinction P4 avec "@koraetcartes") · fusion or Ph7 renforcée (0.40 + contour or net).

**NEXT** : juger render full v2 → présenter Aziz (audio embarqué) → itérations → FULL HD → **ASSEMBLAGE FINAL**
(concat Acte1+P1+P2+P3+P4 + narration globale + mix = TOUTE DERNIÈRE étape de la vidéo).

## ✅✅ P3 VALIDÉE DÉFINITIVEMENT par Aziz (2026-06-13)
Full HD `out/episodes/warmap-sahel/p3-FINAL.mp4` (1920x1080, 1min50, audio, catbox ck26kl) — VALIDÉ.
wip P3 purgés (v1-v8, core, pitch-test, ph1 variants = ~325 MB). raw assets purgés (emblem gardé).
RESTE sur la vidéo : P4 + assemblage final (Acte1+P1+P2+P3+P4). + chantier transversal "fond qui respire".

## ✅ CONTOURS NATIONAUX COLORÉS — RÉSOLUTION du chantier "fond qui respire" (2026-06-14)

Le chantier "fond qui respire" a abouti à une solution DIFFÉRENTE de l'idée initiale (opacité du fill),
après exploration guidée par Aziz. Parcours : mosaïque par région (ÉCARTÉ, noyait l'action) → bordures
de contrôle par faction (ÉCARTÉ, bouillie) → **CONTOURS NATIONAUX colorés, 1 ton/pays (RETENU)**.

**SOLUTION VALIDÉE (Aziz 2026-06-14)** :
- **Contour national coloré, 1 ton par pays** : Mali `#D98A3D` (ocre), Burkina `#C0553C` (brique),
  Niger `#4E8C7D` (sarcelle). Constante `SAHEL_COUNTRY_COLORS` dans `SahelControlData.ts`.
- **Carte épurée conservée** (pas de mosaïque pleine, pas de quadrillage interne).
- **Présence permanente + respiration douce** (atténués pendant l'action des jetons, jamais disparus).
- **Effets** : draw-in (le contour se dessine) + pulse (s'allume) aux moments clés / mentions du pays
  (table `COUNTRY_PULSES`, frames extraites de narration-v5-alignment.json).
- **EFFACEMENT sous overlay** (`CONTOUR_HIDE_WINDOWS`) : les contours fade-out quand un overlay/panneau
  couvre la carte (P3 : overlay AES f6118-6800 + flashback Moura f8560-8920). Sinon = bouillie illisible
  sous l'overlay semi-transparent. RÈGLE : contours et overlay ne cohabitent JAMAIS.

**PÉRIMÈTRE (décision Aziz)** : contours UNIQUEMENT sur parties ÉPURÉES (P3, P4 à venir). Acte 1, Acte 2,
P1 gardent leur look validé (fond mosaïque/allumage séquentiel qui porte déjà la couleur) — on ne les
touche PAS. Gate moteur : `partie3 || countryBordersTest` (ajouter `partie4` au moment de coder P4).

**CODE** : tout dans `engine/SahelWarMapEngine.tsx` (countryBorderPaths reprojetés/frame depuis
`sahel-countries`, rendu SVG au-dessus du grain). Démo de référence : compo `SahelCountryBordersTest`
(catbox 4m4bpv). Plan : `docs/plans/2026-06-13-contours-nationaux-colores.md`.
NETTOYAGE FAIT : modes exploratoires region/borders (`controlMode`) entièrement retirés (code mort).

**RESTE** : render P3 full HD avec contours → remplacer p3-FINAL.mp4 après validation netteté Aziz.
P4 reprendra le même mécanisme (`partie4` à ajouter au gate).

## 🔬 DIAGNOSTIC "FOND QUI RESPIRE" (2026-06-13) — le vrai chantier identifié [ARCHIVÉ — résolu ci-dessus]
Tenté en fin de session : faire respirer l'opacité du fill de contrôle (sahel-fill) en P3 (calme action / haut
lecture) + légende code-couleur. RÉSULTAT : l'opacité respire MAIS le fond reste beige/bleu quasi-uniforme.
CAUSE RACINE (ligne ~1101 moteur) : toutes les régions sont initialisées à `ctrl=1` (état/bleu) par défaut ;
la coloration rouge/contesté vient des JALONS (sahelJalon/ctrlByName) qui NE SONT PAS pilotés en mode partie3
(ni partie1/partie2). Donc un simple curseur d'opacité ne montre rien — il n'y a pas de donnée de contrôle à révéler.
→ LE VRAI CHANTIER (session dédiée) : définir les DONNÉES de contrôle territorial par phase (qui tient quoi :
nord rouge jihadiste, Kidal rouge→bleu à la reprise, etc.) cohérentes sur Acte1→P3, PUIS faire respirer l'opacité.
C'est un travail DATA (control map temporelle), pas un réglage visuel. Expérimentation revertée (P3 = p3-FINAL intact).
Code de réf pour la session : `engine/SahelControlData.ts` (snapFaction/ctrlByName) + blocs calmFactor par mode.
