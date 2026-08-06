# Flowdesk (test client simulé) — STATUS

> Test client simulé "Flowdesk" (SaaS fictif de centralisation de demandes internes), pub ~45-48s.
> 2 registres en exploration parallèle : **2A abstrait géométrique** (ce fichier) vs **2B
> personnage vectoriel** (chantier d'une session parallèle, voir en bas). But : comparer et
> choisir/hybrider avec Aziz. PAS Souverain — positionnement freelance dataviz.
> ⚠️ Pas de branche dédiée : tout est sur `feat/gazoduc-acte1-hook-globe` (héritée d'un autre
> chantier). Anomalie à trancher avec Aziz, ne pas créer de branche sans validation.

## État actuel (2A abstrait)

- **V1** (`FlowdeskAbstrait2A.tsx`) : 4 panneaux SVG quasi statiques — REJETÉ ("slideshow").
- **V2** (même fichier réécrit) : hyperdynamisme (caméra vivante, shards, whip-pan) — validé
  techniquement, REJETÉ sur le fond (vocabulaire abstrait illisible sans le son, critique GPT-5.5).
- **V3** (`FlowdeskAbstraitV3.tsx`, nouveau fichier, V2 gardée intacte) : refonte sémantique, 4 SVG
  1920x1080 plein cadre avec vocabulaire NOMMÉ (icônes email/chat/tableur/téléphone, mot
  "FLOWDESK", 5 destinations IT/RH/FINANCE/SUPPORT/DIRECTION, checkmark+"TRAITÉ"). 2 bugs trouvés
  et corrigés (transform hérité écrasé décentrant badge+icône ; anneau qui ne se refermait jamais).
  Validé techniquement (pas de gel, transitions fluides), uploadé. **Jugement sémantique d'Aziz PAS
  encore reçu** avant qu'il ne parte sur V4 — probable version de repli si V4 n'aboutit pas à temps.
- **V4** (`FlowdeskAbstraitV4.tsx`) : hybride 2A+2B, **CLOSE — livrable final validé
  (2026-08-06, 4 passes)** — 4 panneaux complets, composition assemblée avec transitions
  whip-pan (identiques V3), SFX intégrés, render complet validé (49.1s, 1474 frames, aucun gel
  détecté par hash dense).
  **⭐ LIVRABLE FINAL — celui à regarder en premier (marqué sans ambiguïté FINAL, ne pas
  confondre avec les rendus intermédiaires v1/v2/v3 ci-dessous) :**
  https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abstrait-v4-chT0OJSJAcfDDErUCEnRNYhQOEfnej.mp4
  (fallback disque `out/_client-sim/flowdesk/abstrait-v4-FINAL.mp4`).
  Historique (rendus intermédiaires PAS supprimés, gardés pour comparaison — pas de fichier
  local correspondant à v1-v3 de cette liste, seulement le v1/v2 nommés `abstrait-v4-v*.mp4`
  ont été écrasés en cours de route, cf conversation) : 1ère passe complète → 4 corrections de
  dosage Aziz (icônes P1 2x/plus nombreuses, vortex P2 5-bras visible, 2 icônes/destination P3,
  anneau+cadenas P4) → da-brief downstream 3 modèles + retouches (P3 refonte, vortex qui dérive,
  ordre TRAITÉ) → **fix final stroke-dasharray imperceptible (ease-in-out→linéaire, root cause
  détaillée ci-dessous)**.

## V4 — détail des 4 panneaux (terminé 2026-08-06)

1. **Panneau 1** (chaos) : bug caméra CSS corrigé (mélange focusTx/Ty SVG appliqué à tort sur
   AbsoluteFill HTML). Géométrie d'orbite entièrement recalculée après 2 échecs de calibration —
   **une orbite fermée était géométriquement IMPOSSIBLE** (personnage collé au bord bas du cadre,
   confirmé par agent dédié, balayage exhaustif = 0 solution avec ≥60px de dégagement). Solution :
   arc elliptique OUVERT (170°→370°, jamais sous le personnage) avec 6 anneaux concentriques à
   rayons strictement distincts (deux icônes sur le même anneau se croisent forcément). Résultat
   validé : aucune icône ne touche le personnage, aucune collision inter-icônes, aucun débordement
   de cadre sur 6 échantillons temporels.
2. **Panneau 2** (bascule) : logo simple (cercle marine + cerclage orange + "F") ajouté à côté du
   mot FLOWDESK (lockup). Vortex d'aspiration agrandi (rayons 200-750, la 1ère version à 40-180
   était invisible à l'échelle réelle du panneau) + anneau pointillé. Icônes en cycle perpétuel
   spirale→capture→éjection vers la droite ; bug de fade prématuré corrigé (le fade démarrait à
   70% du trajet, l'icône n'avait pas encore quitté le cadre — corrigé pour ne fader qu'une fois
   x > 1920).
3. **Panneau 3** (mécanisme) : mouvement réel le long des paths SVG Bézier existants via
   `getPointAtLength`/`getLength` (`@remotion/paths`, mesure géométrique fiable — pas l'heuristique
   de comptage de commandes bannie ailleurs dans le projet). 3 phases par icône : glisse
   inflow→module, traverse le module (translation continue, jamais de saut), glisse
   module→destination puis RESTE (pulsation légère, pas de disparition). Vérifié : les 5
   destinations (IT/RH/FINANCE/SUPPORT/DIRECTION) sont toutes peuplées et visibles à la frame finale.
4. **Panneau 4** (résolution) : bug de contraste découvert — le clip clavier a le personnage tracé
   en MARINE (#0B1F3A) sur fond blanc chroma-keyé transparent (inverse du panel1), donc invisible
   sur le fond marine du panneau sans un disque clair derrière. Corrigé (disque `#F4F7FB` circulaire
   + léger glow). 6 icônes du chaos P1 réutilisées, rangées en cercle organisé et quasi-immobiles
   (contraste délibéré avec l'orbite jamais figée du P1 — boucle narrative). Angles décalés pour
   qu'aucune icône ne chevauche le mot TRAITÉ.

**Review Gemini** : score 4.5/10 (NEEDS_WORK) — **faux positif structurel tracé**, override écrit
dans `abstrait-v4-FINAL.review-override.md`. `scripts/visual_review.py --palette navy` est calibré pour
la palette Souverain (Gold/Bebas Neue) ; Flowdesk a sa PROPRE identité de marque (orange #FF6B1A,
Helvetica) héritée de V1/V2/V3, pas Souverain. Vérification manuelle détaillée faite à la place
(frame par frame, chaque consigne croisée avec le rendu réel).

## V4 v3 — retouches issues du da-brief downstream (2026-08-06)

Après validation de la v2 par Aziz, un **da-brief downstream** a été lancé sur le rendu complet
(Gemini + Kimi K2.5 en vidéo native, GPT-5.6 Sol sur 8 frames extraites) via
`scripts/tools/da-brief-video-3voix.py`, avec un brief dédié (contexte Flowdesk, script timé
par panneau, contraintes dures : ne pas toucher clips vidéo/script/palette). Sorties brutes :
`/tmp/da-refs/da-flowdesk-v4-downstream-{gemini,kimi,gpt56sol}.md` (non versionnées, ephemeral).

**Convergence forte (3 modèles indépendamment)** : Panneau 3 trop chargé (labels coupés, 5
destinations simultanées illisibles) ; transitions "cut" plutôt que causales ; idée créative
identique proposée 3x sans concertation — les trajectoires P3 devraient se courber en l'anneau
P4 (jugée hors de portée sûre pour cette session, cf ci-dessous).

Retouches appliquées et vérifiées :
- **P2** : vortex qui SE DESSINE (stroke-dasharray/dashoffset, exploite la "signature SVG" du
  registre au lieu d'un simple fade) + centre du cyclone qui DÉRIVE vers la gauche sur toute
  la durée du panneau (idée Aziz, tranchée en "déplacement physique" plutôt que rotation seule).
- **P3** : refonte — routes reculées (marge bord droit 166-186px vs 36-56px), labels EXTERNES
  aux cercles (plus jamais recouverts), staging séquentiel STRICT (1 route active orange à la
  fois, les autres attenuées), routes+inflow qui se dessinent, cercles concentriques décoratifs
  retirés (jugés "bruit visuel" par les 3 modèles).
- **P4** : ordre de révélation corrigé (TRAITÉ apparaissait AVANT la fermeture de l'anneau —
  contredisait sa fonction de confirmation finale ; décalé après le cadenas). Easing de l'anneau
  passé en ease-out cubique pur (décélération longue, vend mieux "le calme qui s'installe").
- **P1** : irrégularité ajoutée à la vitesse angulaire (modulation ±20% par icône) — corrige le
  défaut "orbite mécanique / screensaver" relevé par Kimi.
- **Transitions causales** : évaluées, NON implémentées en fusion géométrique de paths (aurait
  demandé de faire cohabiter deux panneaux dans une fenêtre de rendu partagée — risque jugé trop
  élevé de casser le système `TransitionLayer` déjà validé sur 3 versions). Cohérence
  directionnelle déjà présente nativement (vortex P2 dérive vers x=1150, proche du module P3 à
  x=960 ; le point de départ natif du tracé d'ellipse P4 tombe côté droit, cohérent avec la
  sortie du P3 à droite) — retenue comme suffisante pour cette session.

**Review Gemini** : score 4.5/10 (NEEDS_WORK) — **faux positif structurel tracé**, override écrit
dans `abstrait-v4-FINAL.review-override.md`. `scripts/visual_review.py --palette navy` est calibré pour
la palette Souverain (Gold/Bebas Neue) ; Flowdesk a sa PROPRE identité de marque (orange #FF6B1A,
Helvetica) héritée de V1/V2/V3, pas Souverain. Vérification manuelle détaillée faite à la place
(frame par frame, chaque consigne croisée avec le rendu réel).

SFX intégrés : 6 SFX ponctuels sur l'apparition des icônes P1 (email/slack/tableur/generic),
5 SFX d'arrivée sur le P3 (generic-soft), SFX clavier en boucle sur le P4 — tous depuis
`audio/sfx/` déjà disponible, rien généré.

## Découverte technique à retenir — webm+alpha peu fiable

Le pipeline webm+VP9 alpha (`-pix_fmt yuva420p -c:v libvpx-vp9`) a produit 2 fichiers où
`ffprobe`+PIL confirmaient la perte du canal alpha (`mode: RGB` au lieu de `RGBA`, ou extrema
`(255,255)` = opaque) malgré des logs ffmpeg annonçant correctement `yuva420p`
(`panel2-clavier-alpha.webm`, `alpha2.webm` — non utilisés dans le code, gardés comme preuve).
**Solution qui fonctionne, vérifiée par PIL (`alpha extrema: (0, 255)`)** : séquence de PNG
individuels avec alpha via
`ffmpeg -vf "colorkey=...,format=yuva420p" -pix_fmt rgba frame%04d.png`.
Utilisée dans `videoLoop.tsx` (`LoopedImageSequence`) pour le clip panel2
(`public/_client-sim/flowdesk/video/panel2-frames/`, 124 PNG, 22 Mo).
Le clip panel1 n'a pas ce problème (fond déjà `#0B1F3A`, joué en MP4 direct via `LoopedVideo`).

**Piège inverse découvert sur le clip panel2 (2026-08-06)** : le personnage de CE clip est tracé
en MARINE sur fond BLANC chroma-keyé (l'inverse du panel1, personnage blanc sur fond marine déjà
en dur) — invisible une fois composé sur le fond marine du panneau sans un disque de fond clair
derrière lui. Toujours vérifier visuellement le contraste réel d'un clip alpha une fois composé
sur SON fond de destination, pas seulement sur fond neutre/blanc du visualiseur.

## Fichiers clés (actifs, ne pas supprimer)

- `FlowdeskAbstrait2A.tsx` (V1, référence historique) · `FlowdeskAbstraitV3.tsx` (V3, dernière
  version complète validée techniquement) · `FlowdeskAbstraitV4.tsx` (V4, TERMINÉE)
- `camera.ts` (helpers caméra SVG : `focusTx`/`focusTy`/`cameraShake`/`elementDrift`)
- `videoLoop.tsx` (helpers vidéo : `LoopedVideo`, `LoopedImageSequence`)
- `v3-chaos.svg`, `v3-bascule.svg`, `v3-mecanisme.svg`, `v3-resolution.svg` (sources V3)
- `groups/` (extraction V1/V2), `groups-v3/` (extraction V3) — générés par `scripts/`, importés
  par les composants, ne pas supprimer
- `SCRIPT-VOIX.md` (verrouillé, audio déjà généré dessus — ne pas retoucher sans besoin)
- `audio/`, `public/_client-sim/flowdesk/` (assets copiés pour Remotion)
- `da-brief-2a-mouvement.txt` + `da-brief-2a-mouvement-out/` (brief 3-modèles ayant produit V2,
  trace de décision)
- `out/_client-sim/flowdesk/*.mp4` + `.review-override.md` (4 rendus comparatifs V1/V2/V3/V4,
  overrides légitimes et tracés — ne pas supprimer)
- `BRIEF-PASSATION-ANIMATION.md` : brief de passation de la session PRÉCÉDENTE (avant celle-ci),
  couvre seulement V1-V3 — **ce STATUS.md le remplace comme guide d'action**, garder l'ancien
  seulement comme trace historique.

## Registre 2B (AUTRE session parallèle, ne pas toucher ni interpréter comme "à moi")

⭐ **MISE À JOUR 2026-08-06 (fin de session 2B)** : panneaux 1 (Chaos) + 2 (Bascule) TERMINÉS ET
VALIDÉS par Aziz. Livrable v9 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/flowdesk-personne-2b-v9-final-UKKPrAI1m7eK91F1hC5aGZfH7OuzHU.mp4
(fallback disque `out/_r-and-d/flowdesk-personne-2b-v9-final.mp4`). Personnage animé via **MiniMax
H3** (nouveau modèle image-to-video, fal.ai, ~$1.30/5s — voir `memory/tools/minimax.md` § H3),
icônes SVG en vol chaotique continu (squash&stretch/anticipation/trails — voir
`memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md` § techniques motion design), logo animé, 6 SFX
ElevenLabs intégrés. DA-brief upstream 3-modèles fait (`PLAN-DA-BRIEF-PERSONNE2B.md`) — même
diagnostic initial "wallpaper animé" que 2A, corrigé depuis côté 2B (whip-pan, vol chaotique,
zoom-in continu). **Reste côté 2B : panneaux 3+4** (5s chacun à générer via H3, puis coder
l'animation — fond CRÈME validé pour panneau 3, structure tripartite suggérée par le DA-brief pas
encore débattue en détail avec Aziz).

Fichiers : `FlowdeskPersonne2B.tsx` · `PLAN-DA-BRIEF-PERSONNE2B.md` · `test-minimax-h3/` (clips
source + v9-check/, utilisés en LECTURE par V4 mais produits par cette session) · `icons/`
(iconsInline.ts v1 + iconsInlineV2.ts, TOUJOURS les deux actifs, pas un remplacement complet) ·
`videoPingPong.ts` · `scripts/generate-sfx-flowdesk.py`.

## Prochaine priorité précise

1. **Décision d'Aziz en attente** : comparer 2A V4 (terminée, livrable ci-dessus) et 2B v9
   (panneaux 1+2 seulement, 3+4 restent à faire côté 2B) pour choisir le registre final ou un
   hybride — pas encore tranché.
2. Si V4 est retenue : possibilité d'itérer sur les 2 points mineurs relevés en review manuelle
   (léger frôlement email/phone au P2, chevauchement optique bell/email au P4 dû à l'ellipse
   aplatie) — non bloquants, à discuter avec Aziz plutôt qu'à corriger d'office.
3. Si 2B est retenue ou hybride : reste à produire les panneaux 3+4 côté 2B (voir section 2B).
