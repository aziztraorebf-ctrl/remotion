# STARTER — Soudan mid-form : ASSEMBLAGE FINAL + MIX AUDIO (passe finale terminée côté visuel+audio-assets)

> Session dédiée : re-render des 6 actes (visuels passe finale déjà codés+commités), concat dans l'ordre
> validé, puis mix audio (musique + 7 SFX déjà générés+validés). PUIS promotion FINAL. TOUT le travail
> créatif est fait — cette session est de l'ASSEMBLAGE MÉCANIQUE + rendu. Ne PAS re-coder d'effets.

---

## ⛔ ÉTAT GIT EXACT À LA REPRISE (lire en premier)

- **Branche de travail = `feat/soudan-passe-finale-6lots`** (contient TOUTE la passe finale, 7 commits).
  Dernier commit visuel : `09daf028`. La branche est reachable depuis le repo principal.
- **Un WORKTREE dédié existe : `/Users/clawdbot/Workspace/remotion-soudan`** sur cette branche. Créé pour
  s'isoler d'une session CFA concurrente qui rebascule le repo principal sur `feat/cfa-nuit1994-svg-mix`.
  - ⚠️ Le repo principal `/Users/clawdbot/Workspace/remotion` est souvent sur la branche CFA (autre session).
  - **Décision reprise** : soit travailler dans le worktree `remotion-soudan` (déjà à jour), soit — si la
    session CFA est terminée — `git worktree remove` le worktree et `git checkout feat/soudan-passe-finale-6lots`
    dans le repo principal (plus simple pour les renders, voir gotchas ci-dessous).
- **Commits passe finale (tous sur la branche)** :
  - `a2081bf1` LOT1 souffle frontière + anneaux siège El-Fasher + géoplaque Acte5
  - `702a42f3` unification labels 6 actes → GeoPlaqueSVG partagé
  - `e7cd1673` LOT2 dérive lente caméra B6
  - `5b2d2214` LOT4 contour blanc jetons + pont croisements + LOT5 bilan 135 pts
  - `ed0ef2ff` fix retrait "Source :" bilan
  - `09daf028` LOT3 accroche mines/zoom + fracture snap
  - (+ commit AUDIO-MIX-DECISION.md à venir)

## ✅ CE QUI EST FAIT (passe finale — NE PAS RE-CODER, vérifié CODE+VISUEL)

| Lot | Effet | Où |
|---|---|---|
| LOT1 | Souffle de frontière (pays nommé) + anneaux de siège radar El-Fasher | helpers `BorderPulse`/`SiegeRings` dans `SoudanActe3GlobeProto16x9.tsx` ; branchés Acte5, Acte3 Insert, Acte4 B6 |
| Retour Aziz | Géoplaques unifiées 6 actes (labels posés sur carte, plus de texte flottant) | `GeoPlaqueSVG` partagé dans le proto ; Acte3/4/5/6 migrés |
| LOT2 | Dérive lente caméra pendant synthèse 4 puissances | `SoudanActe4B6Globe.tsx` (driftLon) |
| LOT4.1 | Contour blanc + ombre renforcée sur jetons-portraits | Acte1 TokenBase, engine soudanActors, Acte2 TwoFaceToken, Acte5 PortraitToken |
| LOT4.2 | Pont visuel aux croisements d'arcs | `SoudanActe3GlobeInsert.tsx` (gaine sombre 9px) |
| LOT5.3 | Bilan humain grille 135 pictos (~37 rouges = déplacés/pop), sans "Source :" | `soudanActe6Overlays.tsx` DisplacementCounter |
| LOT3.1 | Mines dorées pulsent + zoom cinématique d'entrée (Hemeti reste 1er) | `SoudanActe1.tsx` (MineOr goldPulse + CAM) |
| LOT3.2 | Ligne de faille craquelée SNAP NET au split RSF/SAF | `SoudanActe2.tsx` (FaultLine @ F.avril23) |
| LOT5 ONU/veto + empire de l'or | DÉJÀ FAITS avant la passe (vérifiés) — non touchés | — |

## 🎵 AUDIO — ASSETS GÉNÉRÉS + DÉCISION FIGÉE (voir `episodes/soudan-midform/AUDIO-MIX-DECISION.md`)

- **Musique choisie = `soudan-music-B-kora-dundun.mp3`** (`public/_shared/audio/soudan/music/`).
  Réglage figé Aziz : **volume 0.08 + basses domptées `bass=g=-7:f=200:w=0.6`** (zone doc, voix reine).
  ⚠️ **NOTE AZIZ** : si à l'assemblage complet l'audio reste trop fort → **descendre à 0.06** (re-mix simple).
  Boucle organique : crossfade triangulaire 3s (déjà prouvé, script dans scratchpad session précédente).
  Autres variantes en banque (A/C/D/E/F kora) si besoin ; 2 variantes "thriller" REJETÉES (`_rejete-thriller/`).
- **7 SFX générés+validés** (`public/_shared/sfx/soudan/`), timecodes globaux : mines=6s · fracture=86s ·
  connexion=189s · russie=284s · drone=363s · veto=535s · bilan=600s. SFX volume 0.5. Ajustements = round 2.

## 🎬 RECETTE D'ASSEMBLAGE EXACTE (validée, = assemblage v1 à 625.8s)

Concat ffmpeg de 6 mp4 DANS CET ORDRE (durées de référence) :
1. **Acte 1** = 57.3s — `acte1_v5-FINAL.mp4` (wip) — compo `SoudanActe1` (Mapbox)
2. **Acte 2** = 93.6s — `soudan-acte2-blocage-FINAL.mp4` (PRET-PUBLICATION/soudan-midform/) — compo `SoudanActe2` (Mapbox)
3. **Acte 3** = 125.9s — `soudan-acte3-suivre-lor-globe-FINAL.mp4` — compo `D3-SoudanActe3-GlobeInsert` (D3)
4. **Acte 4** = 130.8s — `acte4-v14-phase2-full.mp4` (wip) — CONCAT bloc `D3-SoudanActe4-B1B4-Globe` + insert Kosti + `D3-SoudanActe4-B6-Globe` (voir recette Acte4 ci-dessous)
5. **Acte 5** = 80.1s — `soudan-acte5-reseau-ombre-FINAL.mp4` — compo `D3-SoudanActe5-Globe` (D3)
6. **Acte 6** = 138.0s — `soudan-acte6-verrou-institutionnel-FINAL.mp4` — compo `D3-SoudanActe6-Globe-Nu` (D3)

Total = 625.7s ≈ 625.8s ✅. **Ces mp4 sont les ANCIENS (sans passe finale) — TOUS à re-rendre.**

⚠️ **Acte 4 fragmenté** : l'Acte 4 (130.8s) = concat "bloc B1toB4 + Kosti + B6". Retrouver la recette exacte
dans `STATUS.md` (ligne ~42 : "CONCATÉNATION (bloc + Kosti + B6)") avant de re-rendre. Compos Acte4 dans Root :
`D3-SoudanActe4-B1B4-Globe`, `D3-SoudanActe4-B6-Globe` (+ Kosti insert `KostiInsertSVG`). VÉRIFIER l'ordre/durées
des fragments contre `acte4-v14-phase2-full.mp4` (130.8s) avant concat.

## 🛠 GOTCHAS RENDU (critiques — sinon perte de temps)

- **Actes 1-2 = Mapbox** → `./scripts/render-mapbox.sh <CompoId> <out.mp4> --frames=... --scale=1` OBLIGATOIRE
  (WebGL headless). `remotion still`/`render` classique ne rend PAS le fond Mapbox (fond crème vide).
- **Actes 3-6 = D3** → `npx remotion render <CompoId> <out.mp4> --scale=1` classique OK.
- **Netteté = juger sur scale=1 uniquement** (renders 0.4-0.5 flous, doctrine).
- **⛔ WORKTREE gotchas (si on travaille dans `remotion-soudan`)** : `node_modules`, `.env`, et les mp3
  `public/_shared/audio` + `public/_shared/sfx` sont GITIGNORÉS → ABSENTS du worktree. Il faut les LIER depuis
  le repo principal : `ln -s /Users/clawdbot/Workspace/remotion/{node_modules,.env}` + remplacer
  `public/_shared/{audio,sfx}` par des symlinks vers le repo principal, puis `git update-index --skip-worktree`
  sur les fichiers trackés que les symlinks masquent (sinon "12 deleted" fantômes). **NE JAMAIS `git add -A`
  dans le worktree** (risque de committer des suppressions). Toujours `git add <fichier précis>`.
  → **PLUS SIMPLE** : si la session CFA est finie, fermer le worktree et bosser dans le repo principal.
- **Render vidéo dans le worktree HANG à l'encoding** (ffmpeg via symlink) — `remotion still` (PNG) marche mais
  pas `render` (mp4). Donc : renders vidéo = repo principal de préférence.
- **Public dir 2.2 GB recopié à chaque render** → lent. `render-mapbox.sh` fait déjà un slim ; pour D3 classique
  passer `--public-dir` vers un slim (symlinks _shared/sfx/sprites/audio/geo-data/flags + _rnd/vox-repro), ~98 MB.

## 📋 ORDRE DES TÂCHES (session assemblage)

1. **Décider worktree vs repo principal** (voir gotchas). Reco : repo principal si CFA fini.
2. **Re-render les 6 actes** avec les visuels passe finale (Mapbox via render-mapbox.sh, D3 classique).
   Acte 4 = re-render des fragments + re-concat selon recette. Vérifier chaque acte (frames scale=1) avant concat.
3. **Concat** les 6 mp4 dans l'ordre ci-dessus → `wip/soudan-midform-ASSEMBLAGE-v2-6actes.mp4`. Vérifier durée ~625.8s + raccords.
4. **Construire la boucle musique** B en crossfade 3s à 626s (fade-in 2s / out 3s).
5. **Mix** : musique (vol 0.08, `bass=-7:f=200`) + 7 SFX (adelay aux timecodes, vol 0.5) via ffmpeg amix
   normalize=0. Vérifier max_volume < 0 dB. Présenter un extrait à Aziz → si trop fort, vol → 0.06.
6. **Promotion FINAL** : Acte 1/3/4 promus FINAL (jamais faits), assemblage complet → `PRET-PUBLICATION/`.

## 📌 VÉRIFS AVANT DE CONCLURE
- CODE+VISUEL sur chaque acte re-rendu (frames début/milieu/fin scale=1).
- Timecodes SFX restent valides SI durées d'actes inchangées (la passe finale n'a pas touché aux timings, que
  des effets visuels) — RE-VÉRIFIER après concat que fracture tombe bien ~86s, etc.
- Voix reine confirmée à l'oreille par Aziz avant promotion.

## RÉFÉRENCES
- Décision audio : `memory/episodes/soudan-midform/AUDIO-MIX-DECISION.md`
- Rapports LLM passe finale : `memory/episodes/soudan-midform/da-briefs-passe-llm-2026-07-21/`
- STATUS projet : `memory/episodes/soudan-midform/STATUS.md`
- Scripts audio (scratchpad session, à recréer si purgé) : minimax-soudan-music.py, sfx-soudan.py, mix-soudan.sh
