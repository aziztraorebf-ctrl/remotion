# War-Map Sahel AES — STATUS

**Dernière mise à jour :** 2026-06-11 (PROTO 2.4 PREMIUM VALIDÉ + doctrine Gemini/PixelLab actée)
**Branche :** `feat/da-brief-gate-warmap-sahel`
**Format :** War-Map Long 16:9, ~7min26. Voix GéoAfrique V2 (pipeline expressif V3→STS).

> ⭐ **REPRISE AU RETOUR : section "REPRISE PROCHAINE SESSION" ci-dessous.**

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
