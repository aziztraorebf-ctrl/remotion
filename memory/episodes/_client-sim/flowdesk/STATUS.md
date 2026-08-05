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
- **V4** (`FlowdeskAbstraitV4.tsx`, nouveau fichier, EN COURS, PAS TERMINÉ) : hybride 2A+2B —
  intègre 2 clips vidéo vectoriels du registre 2B (produits par l'autre session) dans les
  panneaux 1 et 4 du registre abstrait.

## Où V4 s'est arrêté précisément (PRIORITÉ 1 prochaine session)

Seul le **Panneau 1** est codé (`PanneauChaosV4` dans `FlowdeskAbstraitV4.tsx`), avec un helper
vidéo réutilisable `videoLoop.tsx` (`LoopedVideo`, `LoopedImageSequence`). Un bug de caméra CSS a
été trouvé et corrigé en fin de session (mélange d'un système `focusTx/focusTy` pensé pour du SVG
avec un `AbsoluteFill` HTML — le personnage n'occupait qu'un quart du cadre). Le type-check passait
juste avant l'arrêt, **MAIS le rendu de vérification n'a PAS été relancé après ce dernier fix** —
à VÉRIFIER EN PREMIER à la reprise :
```
npx remotion still src/index.ts Flowdesk-V4-Panel1-Preview out/_client-sim/flowdesk/v4-panel1-check.png --frame=60
```
Composition temporaire `Flowdesk-V4-Panel1-Preview` dans `Root.tsx` — à retirer une fois V4
complète, ou garder si utile pour tester panneau par panneau (juger sur place).

**Panneaux 2, 3, 4 entièrement à écrire**, consignes précises d'Aziz :
1. **Panneau 1** (chaos) : personnage découragé au centre, icônes plus grosses/espacées qui
   orbitent en CONTINU autour de lui sans jamais le toucher ni se figer (défaut de V3 : icônes qui
   arrivent puis restent statiques).
2. **Panneau 2** (bascule) : icône Flowdesk à côté du mot, vortex d'aspiration VISIBLE (pas un
   fade), icônes qui sortent par la DROITE du cadre.
3. **Panneau 3** (mécanisme) : icônes qui GLISSENT le long des lignes, traversent le logo central,
   arrivent à leur destination nommée et Y RESTENT (pas de disparition).
4. **Panneau 4** (résolution) : clip personnage calme+clavier en boucle au centre, "TRAITÉ"
   au-dessus, icônes rangées en CERCLE ORGANISÉ autour de lui (boucle narrative avec le chaos du
   panneau 1 — mêmes icônes, dispersées puis rangées).

SFX déjà disponibles dans `audio/sfx/` (email/generic-sharp/generic-soft/slack/tableur/tension-bed)
+ `audio/panel2-keyboard-sfx.mp3` déjà calé sur le clip clavier — **rien à générer**.

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

## Fichiers clés (actifs, ne pas supprimer)

- `FlowdeskAbstrait2A.tsx` (V1, référence historique) · `FlowdeskAbstraitV3.tsx` (V3, dernière
  version complète validée techniquement) · `FlowdeskAbstraitV4.tsx` (V4, en cours)
- `camera.ts` (helpers caméra SVG : `focusTx`/`focusTy`/`cameraShake`/`elementDrift`)
- `videoLoop.tsx` (helpers vidéo : `LoopedVideo`, `LoopedImageSequence`)
- `v3-chaos.svg`, `v3-bascule.svg`, `v3-mecanisme.svg`, `v3-resolution.svg` (sources V3)
- `groups/` (extraction V1/V2), `groups-v3/` (extraction V3) — générés par `scripts/`, importés
  par les composants, ne pas supprimer
- `SCRIPT-VOIX.md` (verrouillé, audio déjà généré dessus — ne pas retoucher sans besoin)
- `audio/`, `public/_client-sim/flowdesk/` (assets copiés pour Remotion)
- `da-brief-2a-mouvement.txt` + `da-brief-2a-mouvement-out/` (brief 3-modèles ayant produit V2,
  trace de décision)
- `out/_client-sim/flowdesk/*.mp4` + `.review-override.md` (3 rendus comparatifs V1/V2/V3, overrides
  légitimes et tracés — ne pas supprimer)
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

⚠️ **Décision d'Aziz en attente** : comparer 2A (V3 ou V4 selon avancement) et 2B (v9) une fois les
deux complets, pour choisir le registre final ou un hybride — pas encore tranché à la clôture de
cette session (2026-08-06).

## Prochaine priorité précise

1. Vérifier visuellement le Panneau 1 V4 corrigé (render `Flowdesk-V4-Panel1-Preview`, actuellement
   non confirmé visuellement après le dernier fix caméra).
2. Écrire les Panneaux 2/3/4 selon les 4 consignes ci-dessus.
3. Intégrer les SFX déjà disponibles.
4. Render complet + vérification + comparer avec V3 et avec le registre 2B pour la décision finale
   d'Aziz (lequel devient le livrable, ou hybride).
