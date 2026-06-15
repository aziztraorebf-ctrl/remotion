# BIBLIOTHEQUE DE HOOKS REUTILISABLES — Plan & Synthese (cree 2026-06-15)

> Chantier strategique (Priorite 1, Aziz 2026-06-15). "On est a court de bons hooks" = manque
> structurel. Objectif : une FAMILLE de hooks reutilisables, parametrables, agnostiques au moteur,
> pour les 3 piliers (War-Map / Souverain / Atlas). Ce fichier = la source de verite du chantier.
> Voir aussi : memory/SESSION-DEDIEE-HOOKS.md (preparation).

---

## PHASE 0 — DECODAGE (FAIT 2026-06-15)

### Axe 1 — Mecaniques de hook qui retiennent (decodage interne, 14 mecaniques)
> Source : agent Explore sur HOOK-MAXBELLONA-GABARIT, DOCTRINE-SCRIPT-UNIFIEE (famille C),
> medieval-mindset, DA-briefs Sahel. Detail complet capture ci-dessous.

TOP 5 universelles (cross-pilier) :
1. **Transformation carte (A1)** — un seul objet-carte change de NATURE (geo -> guerre). War-Map++, adaptable Atlas/Souverain.
2. **Boucle ouverte (B1)** — promettre une revelation tot, la livrer plus tard. UNIVERSELLE, textuelle.
3. **Escalade emotionnelle (B3)** — diagnostic froid -> consequence humaine -> ouverture. Retention longue.
4. **Hierarchie du regard / dimmed overlay (A7)** — tout sombre sauf 1-2 trous lumineux qui guident l'oeil.
5. **Sync narration-visuel exacte (C1)** — chaque element apparait au frame ou la voix le nomme. Socle.

ANTI-PATTERNS gravs (interdits doctrine) : "tu" direct · CTA dans hook · phrase >22 mots ·
legende/timeline/dashboard dans hook · stock footage realiste · musique au hook · paradoxe resolu
trop vite · ton familier/digressions · chiffres sans traduction tangible · 3D/pitch.

### Axe 2 — Mecanique pure de nos 2 hooks prouves (dissection technique)
> Source : agent Explore sur KineticMaskSlam.tsx + ComboMaskSweep.tsx + MapboxBase + catalogues.

- Nos 2 hooks sont **70-85% AGNOSTIQUES au fond** deja. Verrou = carte Mapbox hardcodee dans une <div>,
  et reprojection geo reimplementee a chaque template.
- **9+ templates effet-hook deja codes** (cloisonnes) : FiberOpticBorderDraw, FiberOpticFlagInvade,
  SweepRevealTerritory, ClassifiedRedactReveal (100% SVG = le plus agnostique), RapidFireCountries,
  MapCutaway, WavingFlagFill, ContagionFlagSpread, PulsingRegionFill.
- **Registre "type AE" prouve** (pur SVG/Remotion) : mask texte-trou · clipPath pays · gradient anime +
  beam · scale exponentiel · spring rebond · back.out overshoot · stroke-dasharray draw-in + glow ·
  ondulation sinusoidale · reprojection frame-driven · apparition sequencee · TypewriterText · Lucide.
- **Ce qui MANQUE pour l'agnosticite** (3-4 refactors) : (1) prop `background`/`children` pour injecter
  le fond ; (2) hook reutilisable `useGeoReprojection(geoName, mapRef)` ; (3) `theme.ts` couleurs
  centralisees ; (4) exposer les configs d'animation (slamConfig, revealCurve, fadeInFrames).

### Axe 3 — DA-brief 3 modeles (Gemini + Kimi + DeepSeek)
> Brief : memory/episodes/warmap-sahel/da-briefs/brief-hooks-library.txt
> Sorties : /tmp/da-refs/da-hooks-library-{gemini,kimi,deepseek}.md
> [SYNTHESE EXTRACTIVE TRACEE A REMPLIR ci-dessous au retour des modeles]

---

## SYNTHESE EXTRACTIVE TRACEE — DA 3 modeles (Gemini=G, Kimi=K, DeepSeek=D)

> 21 hooks proposes au total -> dedupliques en ~10 mecaniques distinctes (forte convergence).
> Decisions tranchees ci-dessous. G/K/D = source. G+K+D = convergent (haute confiance).

### PARTIE A — FAMILLE DE HOOKS (dedupliquee + tranchee)

| Hook | Source | Mecanique resumee | Primitives | Statut | Pilier | Decision |
|------|--------|-------------------|------------|--------|--------|----------|
| **CrosshairLock / LaserGridLock** (viseur qui se verrouille puis devient le contour du pays) | G+K+D (3/3 !) | viseur nerveux glisse sur grille -> lock spring -> zoom expo -> grille morph en contour pays or | grille SVG, spring, scale expo, morph lignes->path, Lucide Lock | a coder (morph lignes->contour) mais faisable | War-Map++ / Souverain | ✅ **RETENU #1** (convergence 3/3 = signal max ; "renseignement/satellite", colle a notre ADN analyste) |
| **ArteryDrain** (pays s'allume -> faisceaux jaillissent vers Europe/Chine -> compteur slam) | G | hemorragie : 5-10 lasers partent du pays vers les bords + countup geant | SweepReveal + stroke-dasharray + countup + spring | combinaison inedite de nos briques | Souverain Eco++ | ✅ **RETENU #2** (parfait "fuite des ressources" = sujet recurrent Souverain, 100% nos briques) |
| **RedlineContagion / LaserGridIntrusion** (frontiere rouge se dessine -> bave sur voisin -> icones tombent) | G+K (RedlineContagion=G, Intrusion=K) | escalade : ligne rouge violente -> contagion couleur -> cascade icones Crosshair/Skull | FiberOpticBorderDraw(rouge) + ContagionFlagSpread + Lucide cascade | deja faisable | War-Map++ | ✅ **RETENU #3** (deja faisable, installe la menace, "carte qui se transforme") |
| **EchoPulse / TemporalRippleScan** (chiffre slam -> ondes concentriques traversent la carte masquee) | K+D | chiffre s'ecrase -> 4-6 ondes dorees se propagent a travers le masque -> zoom reveal | masque texte + ondes concentriques + scale expo + spring | deja faisable (ondes existent) | Souverain (croissance) / War (onde de choc) | ✅ **RETENU #4** (deja faisable, variation forte du KineticMaskSlam, propagation = energie) |
| **GaugeBuildUp** (jauge se remplit + countup -> devient cartouche -> carte surgit) | D | arc/jauge laser se remplit, compteur grimpe a la valeur choc, puis carte sous le cartouche | arc SVG maison + stroke-dashoffset + countup + halo pulse | deja faisable | Souverain Eco | 🔶 **OPTION** (solide mais "jauge qui monte" = risque AI-slop/template si surexploite — K et D le notent. A reserver a 1 categorie d'indicateur) |
| **ChromaticSplitMask** (chiffre en triple image RGB decalee -> converge en or -> zoom) | G(effet)+K(hook) | bug chromatique : 3 couches or/rouge/navy decalees fusionnent au spring -> reveal | masque texte x3 + spring + scale expo + blend ou opacite | combinaison inedite | War-Map / Atlas "archive" | 🔶 **OPTION** (effet "wow" mais mix-blend-mode a TESTER en render headless ; fallback opacite/superposition = plus sur). Bon comme VARIANTE d'entree des autres hooks, pas hook autonome |
| **EpochSplit / SplitScreenReveal** (mot-date se coupe en 2, glisse, revele la carte/comparaison) | G+D | texte se fend horizontalement (back.out) -> 2 panneaux rideaux -> avant/apres ou epoque | masque texte + clipPath coulissant + back.out + RapidFire/typewriter | a coder (decoupe masque) mais faisable | Atlas Histoire / Souverain compare | 🔶 **OPTION** (belle mecanique "rideau", mais le split-screen on l'a deja en non-hook (WarMapSplitScreen) ; a evaluer si on veut un hook compare) |
| **SovereignSealIris** (sceau officiel se dessine -> s'ouvre en iris sur la carte) | K | texte courbe "REPUBLIQUE X" + icone Landmark -> cercle devient masque -> morph iris->pays | textPath SVG + stroke-dashoffset circulaire + morph + Lucide | nouveau a coder | Souverain symbolique | ❌ **ECARTE** (trop "institutionnel/officiel" — eloigne de notre registre analyste froid ; textPath+morph = cout eleve pour un registre de niche) |
| **CartographicGlitch** (contours de pays clignotent erratiquement -> "correction" snap sur le bon) | K | pays aleatoires clignotent couleurs erratiques -> stabilisation spring -> laser reverse | randomisation frame + FiberOptic reverse + gradient radial | nouveau a coder | Atlas correction / War incertitude | ❌ **ECARTE** (couleurs "erratiques hors charte" meme 0.6s = contredit discipline chromatique ; "instabilite" lisible comme bug/AI-slop par le lambda) |
| **MaskedPanorama** (mot-masque + travelling lent de la carte dans les lettres -> zoom reveal) | D | mot statique sert de masque, la carte DEFILE lentement dans les lettres, puis zoom | masque texte + translation groupe SVG + scale expo + spring | combinaison inedite | Atlas geo | 🔶 **OPTION** (= KineticMaskSlam + drift interne ; le drift de carte est deja dans nos hooks. Apport marginal, mais gratuit a ajouter comme variante) |
| **TimeSlice / TypoCountdown** (curseur temporel balaie la carte avant/apres + morph frontieres) | D | curseur date glisse, clipPath separe avant(hachure)/apres(net), morph frontieres historiques | clipPath coulissant + pattern hachures + morph path + typewriter | a coder (morph path) | Atlas histoire | 🔶 **OPTION** (fort pour Atlas historique MAIS morph path = flubber non installe -> interpolation maison ou install. A garder pour quand on fait de l'histoire territoriale) |
| **ClassifiedPeel / DataAvalanche** (dossier declassifie / cartouches qui slamment puis aspires) | G | barres censure revelent un MapCutaway zoom / avalanche de cartouches aspires au centre | ClassifiedRedactReveal + MapCutaway / formes SVG + countup + ondes | deja faisable | Atlas-War / Souverain | 🔶 **OPTION** (ClassifiedRedactReveal existe deja — bon "ton investigation". DataAvalanche = joli mais risque surcharge. A piocher selon sujet) |

**SYNTHESE A** : 4 hooks RETENUS (CrosshairLock, ArteryDrain, RedlineContagion, EchoPulse) couvrent les 3 piliers
et reposent a 90% sur nos briques. 6 OPTIONS activables selon sujet. 2 ECARTES avec raison.

### PARTIE B — EFFETS "AE" A POUSSER (faisables SVG/Remotion, tous frame-driven)

| Effet | Source | Comment on le code | Decision |
|-------|--------|--------------------|----------|
| **feDisplacementMap (distorsion thermique / onde de choc)** | G+K+D (3/3 !) | feTurbulence -> feDisplacementMap, animer baseFrequency/seed frame-driven. Carte "bout" / tremble a l'impact | ✅ **RETENU** — DEJA utilise chez nous (WarMapEngine, GrainOverlay) donc PROUVE en render. Zero risque. Brille sur RedlineContagion (instabilite) + EchoPulse (deflagration) |
| **Halftone / dot-grid reveal (trame de points facon radar/journal)** | G+K+D (3/3 !) | <pattern> SVG de cercles, rayon anime 0->max en cascade, comme fill/overlay du pays | ✅ **RETENU** — pur SVG, net, look "renseignement satellite". Brille sur SweepReveal + CrosshairLock |
| **Chromatic split (aberration RGB d'impact)** | G+K+D (3/3 !) | 3 copies du texte decalees rouge/or/navy convergent au spring. Blend-mode OU superposition+opacite | 🔶 **RETENU avec TEST** — mix-blend-mode utilise ailleurs mais a VERIFIER en render headless avant de s'y fier ; fallback opacite. Effet "wow" d'ouverture |
| **Morphing de path SVG (frontieres qui evoluent)** | G+K+D (3/3 !) | interpolation de l'attribut `d` (meme nb de points) frame-driven. flubber OU maison | 🔶 **OPTION** — flubber PAS installe (verifie). Interpolation maison faisable mais delicate (normaliser les points). A faire quand un sujet HISTORIQUE le justifie (TimeSlice) |
| **Grain/noise texture animee (parchemin vivant)** | K+D | feTurbulence fractalNoise, seed anime, overlay multiply opacity 0.15 | ✅ **RETENU** — DEJA fait (GrainOverlay). Donne la texture "parchemin vivant" a tous les hooks Atlas |
| **Mask composite operations (add/subtract/intersect)** | K | mask-composite pour "texte MOINS silhouette pays" = profondeur 2.5D flat | 🔶 **OPTION** — puissant pour effet profondeur (chiffres qui passent derriere le pays). Support headless a verifier |
| **Gradient radial anime dans clip (spot organique)** | D | gradient radial dont on anime cx/cy = spot qui balaie le territoire | ✅ **RETENU** — variante plus organique de SweepRevealTerritory. Trivial dans notre registre |
| **Glitch par bandes / Dechirure de parchemin** | G(glitch)+D(dechirure) | clipPath rectangulaires fins decales (glitch) OU clipPath courbe qui s'elargit (dechirure-brulure) | 🔶 **OPTION** — la DECHIRURE (D) est plus "nous" (parchemin) que le glitch TV (G). A coder pour transition vers carte ancienne |

**SYNTHESE B** : 4 effets RETENUS dont 2 DEJA PROUVES en render (displacement + grain). Halftone + gradient
radial spot = nouveaux mais triviaux. Chromatic split = a tester. Morph path = differe (besoin historique + interpolation).

### PARTIE C — PRINCIPES DE RETENTION (convergence quasi totale 3/3)

| Principe | Source | Decision |
|----------|--------|----------|
| **1. Trou de serrure / promesse immediate** : jamais la carte pleine a t=0. Commencer par un detail qui obstrue (chiffre/mot/frontiere) puis OUVRIR. Frame 0 = energie cinetique max (spring, jamais fade) | G+K+D | ✅ **GRAVE** — c'est exactement nos 2 hooks prouves. Regle fondatrice de la famille |
| **2. Relais du regard (eye-tracking continu)** : l'animation A meurt la ou B nait. Le label apparait EXACTEMENT ou le faisceau s'arrete. Jamais de regard qui cherche a l'autre bout | G (le plus precis) | ✅ **GRAVE** — regle de placement spatial pour tous les hooks |
| **3. Densite progressive / systole-diastole** : jamais >2 nouveaux elements simultanes. Cascade ~0.5s/idee, PUIS 12-15 frames de calme (respiration) avant le beat suivant. Freeze 6 frames = ponctuation | G+K+D | ✅ **GRAVE** — rythme. Le "freeze respiration avant le reveal" (K+D) maximise l'impact |
| **4. Ancrage spatial constant** : garder un repere geo visible meme pendant les masques (>=20% de carte dans les "trous" des lettres) | K | ✅ **GRAVE** — evite la desorientation du lambda |
| **5. Visuel PRECEDE la voix de ~0.3s (5-8 frames)** : le pays s'allume une fraction AVANT que la voix le nomme. Le visuel annonce, ne sous-titre pas | G+K+D | ✅ **GRAVE** — corrige le "lag percu". S'ajoute a notre sync forced-alignment |
| **6. Fil conducteur memoriel** : apres reveal, le chiffre ne disparait pas net — il reste en watermark (opacite 5%) ou le contour du pays scintille 2s. "Liant haut de gamme" | D | 🔶 **OPTION** — joli, gratuit. A tester (peut surcharger) |

### ORDRE DE CONSTRUCTION RECOMMANDE (convergence G+K+D)
Les 3 modeles convergent : commencer par les hooks 100% briques existantes (valider la cadence),
puis ceux a code nouveau leger. Process pro (G) : socle geo -> choregraphie camera -> clipPath sujet
-> habillage lumineux -> EN DERNIER le texte/data (sinon texte et carte "se battent" pour l'oeil).

### CE QUI A ETE VERIFIE (contraintes reelles)
- `flubber` NON installe -> morph path = interpolation maison ou install (differe).
- `feTurbulence`/`feDisplacementMap` DEJA en render (WarMapEngine, GrainOverlay) = displacement + grain PROUVES.
- `mix-blend-mode` utilise dans 3 fichiers _shared -> chromatic split possible mais TESTER headless (fallback opacite).

---

## DECISIONS DE GOUT EN ATTENTE (a regrouper pour Aziz)
1. **Quels hooks coder en premier** parmi les 4 retenus (reco : CrosshairLock = convergence 3/3 + ADN analyste).
2. **Architecture** : refactorer nos 2 hooks pour les rendre agnostiques au fond (prop `background`) MAINTENANT,
   ou coder d'abord 1-2 nouveaux hooks sur Mapbox puis abstraire ? (reco : abstraire d'abord = la dette devient virale sinon)
3. **Portee de la 1ere salve** : combien de hooks dans cette session (reco : 2-3 hooks solides + previews, pas les 10).
4. **Chromatic split** : on teste le blend-mode headless (10 min) ou on part direct sur le fallback opacite ?

## DECISIONS AZIZ (2026-06-15)
- **1er hook a coder : ArteryDrain** (faisceaux fuite ressources + compteur).
- **Architecture : ABSTRAIRE D'ABORD** — prop `background` agnostique (Mapbox / parchemin / fond uni) AVANT de coder.
- **Portee session : 2-3 hooks solides + previews** (qualite > quantite, reste en session suivante).

## ⭐ CLARIFICATION IMPORTANTE (Aziz 2026-06-15, apres v1) — DISTINGUER HOOK vs INSERT
> Aziz a vu juste : ArteryDrain n'est PAS un hook d'ouverture, c'est un INSERT EXPLICATIF mid-video.
- **HOOK (5 premieres s)** = cree une TENSION non resolue / boucle ouverte. Pose une question, ne repond pas.
  Patterns-hook reels : CrosshairLock (suspense "quoi?"), trou de serrure (chiffre choc qui obstrue), boucle ouverte.
- **INSERT** = EXPLIQUE / repond visuellement. ArteryDrain "le Niger exporte 68t -> ca fuit" = une REPONSE.
  -> ArteryDrain reclasse **INSERT Souverain eco** (fuite ressources mid-video), PAS hook. Utile, juste bien etiquete.
- **Mapbox-only** : ArteryDrain repose sur HookMapBackground (Map dark-v11 + map.project). Ne marche PAS tel quel
  sur notre War-Map top-down PARCHEMIN (moteur custom, pas Mapbox) + faisceaux dores rayonnants lisent
  "influence positive" pas "guerre". NE PAS transposer sur War-Map (= la lecon du prototype Sahel supprime).
- **OBJECTIF agnostique vrai (decide)** : HookMapBackground doit accepter AUSSI un fond parchemin top-down,
  pour que les hooks tournent sur War-Map ET Souverain. C'etait le but initial de la bibliotheque.
- **Test de classement pour TOUT futur template** : "cree-t-il une tension non resolue (HOOK) ou explique-t-il (INSERT) ?"
  ET "depend-il de Mapbox, ou marche-t-il sur parchemin top-down aussi ?".

## PLAN D'IMPLEMENTATION

### Etape 1 — ARCHITECTURE AGNOSTIQUE (socle de toute la famille)
Creer `src/projects/_shared/hooks-lib/` :
- `theme.ts` — palette centralisee (GOLD #c8a951, NAVY #16213a, IVORY #f2ebd9, RED #e63946) + 3-4 profils de spring (impact/lourd/sec/respiration, cf. AI-slop K).
- `HookBackground.tsx` — composant fond INJECTABLE : mode "mapbox" (drift continu, focus pays) | "parchemin" (carte custom) | "solid" (navy uni). Les hooks recoivent `background` en prop au lieu de hardcoder la <div> Mapbox.
- `useGeoReprojection.ts` — hook reprojection frame-driven (pathData + bbox d'un pays) partage par tous les effets geo.
- `primitives/` — extraire : TextMaskReveal (masque texte + zoom expo), SweepReveal, StrokeLaserDraw, SpringSlam, ConcentricWaves, Countup.

### Etape 2 — ArteryDrain (1er hook)
Mecanique : 0-1s pays s'allume (SweepReveal) · 1-2s 5-10 faisceaux laser jaillissent vers les bords (stroke-dasharray
sequence) · 2-3s compteur geant slam au centre (countup + spring) · respiration freeze. Fond injectable.
Previews H + V via render-mapbox.sh. Sujet test : uranium Niger ou or (fuite ressources).

### Etape 3 — 1-2 hooks de plus (a choisir apres ArteryDrain valide)
Candidats : CrosshairLock (convergence 3/3) ou RedlineContagion (deja faisable). + tester 1 effet AE (halftone ou displacement).

### ⭐ STRATEGIE 2 NIVEAUX (Aziz 2026-06-15) — DISTINGUER hook mecanique vs sequence d'ouverture
- **Niveau 1 — HOOK MECANIQUE (~10s)** : effet d'ouverture *wow*, PAS trop complexe. La banque de briques.
  On garde chaque hook ~10s pour "ne pas pousser la pilule" et max d'impact. C'est ce qu'on code MAINTENANT.
- **Niveau 2 — SEQUENCE D'OUVERTURE (~30-45s)** : PLUS TARD. Empiler des templates PAR-DESSUS le hook
  mecanique (paradoxe -> transformation -> actu -> boucle ouverte) pour 30-45s "wow" a retention tres forte.
  Systeme `OpeningSequence` a concevoir une fois la banque de hooks mecaniques etoffee.
- ORDRE retenu : finir la FAMILLE de hooks mecaniques d'abord (CrosshairLock ✅, RedlineContagion, EchoPulse,
  ChromaticSplitMask), PUIS les sequences longues.

### ETAT 2026-06-15 (session 1) — FAIT
- `HookMapBackground` agnostique : `theme` dark/parchment + `countriesGeoJson` (raccord carte exacte du
  projet, ex sahel-countries.geojson = vraie carte P4 : contour national epais #3A2A18 + allumage via
  propriete `country`) + `punchZoom` (switch zoom rapide vers la zone).
- `ArteryDrain` = INSERT Souverain eco (reclasse), v2 raffine (faisceaux orientes + pointes + paquet lumineux).
- `CrosshairLock` = VRAI hook LONG ~7s : recherche lente -> lock+punch zoom -> tension rouge -> question
  (boucle ouverte). Agnostique theme + raccord carte. Cas AES horizontal sur vraie carte Sahel.
- LECON : la vraie carte AES = celle de la PARTIE 4 (frontieres nationales colorees + bordures simples
  via sahel-countries.geojson), PAS les 32 regions admin-1 data-driven. Ne pas confondre.

### CONVENTION DUREE (Aziz 2026-06-15)
- Tous les hooks mecaniques visent **~10s** (300 frames @30fps) pour la coherence de la famille + max d'impact.
- Etaler les beats existants pour remplir 10s SANS temps mort (jamais >2s sans nouvel evenement),
  PAS juste rallonger la fin. CrosshairLock ✅ 10s · RedlineContagion ✅ 10s (contagion etalee gap=30).

### ⭐ LECON CAMERA SERREE (Aziz 2026-06-15) — la plus importante de la session
Tous mes 1ers hooks etaient en VUE CONTINENT figee. ERREUR : nos vraies videos (AES Acte 1) utilisent une
CAMERA SERREE (zoom 4.5-4.8) qui PANE narrativement (ouest->est en suivant le propos). Un hook doit adopter
CETTE grammaire. -> `HookMapBackground.camKeys` (trajectoire {f,lon,lat,zoom} interpolee easeInOut).
Demo : CrosshairLock-AES-CamSerree-H (catbox 9q75sr). Avant de concevoir un hook : REGARDER la camera de la
vraie video cible (ACTE1_CAM_KEYS / SAHEL_CAM_KEYS dans SahelWarMapEngine), pas presumer une vue large.

### LECON CONSOLIDATION (Aziz 2026-06-15)
Ne PAS multiplier les variantes de DECO du meme squelette = AI-slop "template repetitif". echo/chromatic/plain
etaient le MEME hook (masque-texte+zoom-reveal) -> fusionnes en `MaskReveal` (prop effect). FractureReveal
ECARTE (Aziz ne le garde pas). Un hook = une ACTION distincte (traquer/propager/reveler-par-texte), pas une deco.

### ETAT FINAL SESSION 1 (2026-06-15) — FAMILLE = 3 hooks + 1 insert
- `CrosshairLock` (traquer) · `RedlineContagion` (propager) · `MaskReveal` (reveler par texte, 3 effets) = HOOKS.
- `ArteryDrain` = INSERT eco (pas hook). `HookMapBackground` = fond commun agnostique + camKeys + raccord carte.
- Catalogue : `src/projects/_shared/hooks-lib/HOOKS-LIBRARY-CATALOGUE.md`.
- NEXT possibles : passer RedlineContagion + MaskReveal en camKeys (camera serree) · griser-selectif · nouvelles meca.

### Etape 4 — Catalogue + doctrine
`HOOKS-LIBRARY-CATALOGUE.md` ("quand Aziz dit X -> tel hook") + indexer dans COMPOSANTS-INDEX + CLAUDE.md routage.
