# NorthShield (test client simulé) — STATUS

> ⭐⭐⭐ **CLOS 2026-08-08 (décision Aziz)** — test terminé, objectif atteint. Livrable final :
> `out/_client-sim/noteshield/FINAL/northshield-v3-FINAL.mp4` (5 panneaux, 63.34s). Des
> améliorations mineures restent identifiées (voir tout en bas) mais ne seront PAS traitées — le
> test a prouvé ce qu'il devait prouver (pivot HUMAN→SYSTEM→PRODUCT réussi, pipeline H3+SVG+
> Remotion validé de bout en bout). Conclusions stratégiques transversales à écrire dans
> `memory/projects/` (à la manière de `flowdesk-client-sim-conclusions.md`) lors d'une prochaine
> session de consolidation.
>
> Test client-sim #2 (SaaS cybersécurité), après Flowdesk. Teste HUMAN + SYSTEM + PRODUCT.
> Brief complet : `memory/client-sim-tests/noteshield/BRIEF-CLIENT.md`. Script voix verrouillé
> (V3) : `src/projects/_client-sim/noteshield/SCRIPT-VOIX.md`. Audio généré, 63.34s.

## État actuel (2026-08-07, fin de session)

- **Direction B pure (100% abstraite) — CLOSE, REJETÉE sur le fond**, pas seulement sur
  l'exécution. v1 codée → rejet unanime (Aziz + jury 4 modèles Gemini/Kimi/GPT/Grok) sur le
  motion ("diaporama statique"). v2 codée (motion corrigé, tous les panneaux vivants en continu,
  vérifiée frame par frame) → **mais Aziz a ensuite identifié un problème plus profond que le
  motion** : le P1 (flux de traits) reformule le cliché "pluie de données" explicitement
  interdit par le brief, et l'absence totale d'incarnation humaine viole la chaîne
  HUMAN→SYSTEM→PRODUCT demandée. Le Semantic Test croisé du même jour portait déjà ce signal
  (A-P1 "compris immédiatement" vs B-P1 "partiellement compris") sans qu'on en tire la
  conséquence sur le moment.
- **Storyboard V3 (mix incarné) — DÉCIDÉ, PAS ENCORE CODÉ** :
  `memory/client-sim-tests/noteshield/STORYBOARD-V3-MIX-INCARNE.md`. 7 panneaux, mix explicite
  Direction A (incarnation, structure pull-back) + Direction B (mécanisme 4 signaux, cascade
  Berlin, signature) + storyboard GPT externe (slider dilemme P2). Personnage Sarah = **MiniMax
  H3** (image-to-video, PAS Seedance — déjà prouvé sur Flowdesk), pas de SVG/silhouette pour
  l'incarnation.

## Code v2 conservé — RÉUTILISABLE tel quel en V3

`src/projects/_client-sim/noteshield/direction-b/` :
- `P2SeuilNait.tsx`, `P3QuatreSignaux.tsx` (P4 en V3), `P6Signature.tsx` (P7 en V3) — gardés
  intacts, jamais remis en cause par aucun retour.
- `../ui/DashboardScreen.tsx` (data-driven, prop `overrideRow` ajoutée en v2), `LaptopMockup.tsx`,
  `VirtualCursor.tsx` — réutilisés pour P5/P6 en V3 (raccord après les plans MiniMax H3).
- P1FluxBlocage.tsx, P4DashboardReveal.tsx (v2), P5DashboardMorphBosse.tsx : la MÉCANIQUE de
  cascade de données + bosse de vigilance de l'ex-P5 v2 est bonne et sera reprise dans le
  nouveau P6 — mais ces 3 fichiers seront largement remplacés par les plans MiniMax H3.
- Render v2 complet de référence (avant pivot) :
  `out/_client-sim/noteshield/wip/direction-b_v2.mp4` (+ override review, palette Souverain du
  script `visual_review.py` non applicable à ce projet — voir les `.review-override.md` à côté).

## Jury LLM sur la v2 motion (conservé, verdicts encore valables sur le MOTION, pas sur le fond)

`out/_client-sim/noteshield/jury/{gemini,kimi,gpt,grok}-verdict.md` — diagnostic motion design
("apparition ≠ animation", rien ne doit rester statique >1s) reste valide pour les futurs
panneaux SVG (P2, P3, P4, P7 en V3). Synthèse : `SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md`.

## Session 2026-08-07 — 4 points tranchés, assets H3 générés

1. **Image référence Sarah** : Candidat B (2D flat color) retenu par Aziz, puis corrigé en 2
   passes chirurgicales (halo cyan qui envahissait le cadre en animé → fond replat ; écran
   laptop devenu turquoise massif lors du 1er fix → ramené à un aplat sombre discret). Version
   finale : `src/projects/_client-sim/noteshield/refs/sarah-candidat-B-v3-final.jpg`.
2. **Faisabilité H3** : validée, MAIS décision différente du plan initial — **pas de pull-back
   caméra** (risque d'halluciner un écran de laptop lisible/générique). Le plan H3 reste centré
   sur Sarah seule (statique, écran flou/hors-focus), le dashboard reste 100% overlay React
   (`DashboardScreen`/`LaptopMockup`) après un cut. Storyboard mis à jour en conséquence.
3. **Coût réel dépensé** : ~$6.50 (5 générations H3 dont 1 ratée sur P1a + 3 éditions image
   Gemini négligeables). Gotcha découvert : H3 gère mal un verbe d'impact/arrêt brutal
   ("drops down sharply, stops abruptly" → clip figé, aucun mouvement) mais bien un verbe de
   trajectoire continue ("slowly lowers down" → mouvement net) — documenté dans la mémoire
   visual-producer.
4. **Timings verrouillés** (frame-précis depuis `narration.alignment.json`, 30fps) :
   P1 4-280 (9.2s) · P2 280-358 (2.6s, étendu en mordant sur P3) · P3 358-457 (3.3s) ·
   P4 457-861 (13.47s) · P5 861-1229 (12.27s) · P6 1229-1696 (15.57s) · P7 1696-1900 (6.8s).

## 4 plans H3 livrés (uploadés Vercel Blob, content-length vérifié)

- **P1a** (barrière descend) — `out/_r-and-d/noteshield-h3-tests/p1a-v2-barriere-trajectoire.mp4`
- **P1b** (barrière remonte + foule) — `out/_r-and-d/noteshield-h3-tests/p1b-barriere-remonte.mp4`
- **P5** (Sarah Toronto) — `out/_r-and-d/noteshield-h3-tests/p5-sarah-test2-v3.mp4`
- **P6** (Sarah, contexte différent) — `out/_r-and-d/noteshield-h3-tests/p6-sarah-contexte-different.mp4`

Image référence couloir P1 : `src/projects/_client-sim/noteshield/refs/p1-couloir-file.jpg`.

## ⭐⭐ P1c — NOUVEAU CLIP VALIDÉ (2026-08-08, session exploration Comfy Cloud) — CANDIDAT FORT POUR P1

**Fichier** : `public/_client-sim/noteshield/video/p1c-badge-selectif-barre-mecanique-h3.mp4` (12.25s,
généré via MiniMax H3 open-weight sur Comfy Cloud MCP, gratuit/inclus abonnement — voir
`memory/tools/minimax.md` § Comfy Cloud pour le setup).

**Scénario complet en un seul clip** (remplace potentiellement P1a+P1b séparés) : barrière (tube
lumineux cyan) levée → les 2 premiers personnages **avec badge visible** passent calmement → les 2
derniers **sans badge** avancent → la barrière **tombe brutalement comme une vraie barrière
mécanique** (SFX inclus) → réaction de surprise crédible des 2 bloqués. Image de référence identique
à P1a/P1b : `refs/p1-couloir-file.jpg`.

**Verdict Aziz : "Excellente vidéo... je pense qu'on pourrait l'utiliser pour le panneau 1."** Tout
fonctionne : distinction badge/non-badge correcte, mouvement mécanique de la barre exact, timing
lisible, style maintenu.

⭐ **Confirmation croisée du gotcha déjà noté ligne 56-58 de ce fichier** (session du 07/08) : le
premier essai ce soir décrivait juste "barrier closes abruptly" → H3 a interprété par une lumière qui
s'éteint (pas de mouvement mécanique). En reformulant explicitement avec un verbe de trajectoire
physique comparé à un objet réel ("the physical cyan bar mechanically and abruptly SLAMS DOWN, swinging
down fast like a real parking-lot barrier arm") → mouvement mécanique obtenu comme voulu. **Le gotcha
n'est donc pas "H3 ne gère pas les verbes d'impact"** (comme formulé la 1ère fois) **mais plutôt "H3 a
besoin d'une comparaison/référence concrète à un objet mécanique réel pour improviser une trajectoire
physique cohérente avec un design qui ne montre pas d'articulation visible"** — nuance à garder pour
tout futur prompt sur cet objet (ou un objet similaire type levier/interrupteur/porte).

**Décidé et intégré (2026-08-08)** : P1c remplace P1a+P1b dans `v3/P1VideoDilemme.tsx` — un seul
plan continu, mécanisme badge/pas-badge plus riche que le split descente/remontée. 2 arbitrages
techniques tranchés par Aziz :
- **Résolution SD (864×480) gardée telle quelle**, pas de régénération 2K ni upscale — accepté
  malgré le contraste avec P5/P6 (2K).
- **Durée 12.25s → 9.2s (fenêtre verrouillée) via `playbackRate` accéléré (~1.33x)**, plutôt que
  couper (aurait perdu la réaction finale des bloqués, beat important) ou étendre la fenêtre
  (aurait cassé le timing verrouillé sur l'alignment audio réel).
- Compilation TS clean, frame de test rendue et vérifiée visuellement (intégration OK à 1920×1080).

## Session 2026-08-08 (soir) — REFONTE 7→5 panneaux après retour Aziz, composition réassemblée

Premier montage 7 panneaux (P1-P7) visionné par Aziz — retour détaillé, refonte majeure (pas des
ajustements mineurs). 6 correctifs demandés, tous appliqués par remotion-composer :

1. **P2 (slider) + P3 (ligne calme) SUPPRIMÉS de la composition** — redondants, P1 raconte déjà
   tout le dilemme via la vidéo H3. Fichiers `v3/P2SliderDilemme.tsx` et
   `direction-b/P2SeuilNait.tsx` **conservés sur disque** (P2SeuilNait potentiellement réutilisé
   ailleurs) mais retirés des imports/Root de `NorthShieldV3.tsx`.
2. **Nouveaux timings (5 panneaux)** : P1 4-457 (453f) · P4 457-861 (404f) · P5 861-1229 (368f) ·
   P6 1229-1696 (467f) · P7 1696-1900 (204f). Les 177f libérées vont TOUTES à P1 (décision Aziz).
   Durée totale composition INCHANGÉE (1900f/63.34s).
3. **P1** : compteur "+N vérifications" agrandi (police 16→30px, container avec fond
   semi-transparent + bordure cyan). `playbackRate` recalculé (clip 367f désormais PLUS COURT
   que la fenêtre élargie 453f → ralenti ~0.81x au lieu d'accéléré ~1.33x, pas de coupure ni
   d'accélération agressive).
4. **P4** : deltas numériques par signal (+4 APPAREIL, +5 LIEU, +5 HISTORIQUE, +4 COMPORTEMENT)
   qui voyagent du point d'extraction de chaque ligne vers le compteur central, synchronisés sur
   le même timing que le score par paliers de `P3QuatreSignaux` (dupliqué en lecture seule, pas
   divergent). Rend le calcul VISIBLE, pas juste suggéré par la convergence géométrique.
5. **P5** : Sarah encadrée en disque + anneau qui se referme (pattern `FlowdeskAbstraitV4.tsx` §
   Panneau Résolution, extrait dans nouveau composant partagé `ui/DiscFrame.tsx`). Annotations
   TORONTO/MACBOOK PRO/09:14 agrandies (18→28px) + sous-labels + tenues jusqu'à la fin du plan
   filmé (au lieu de ~0.5s puis disparition). Bug `LaptopMockup width={width*1.3}` CORRIGÉ →
   `width*0.8` (le chassis complet est maintenant visible, plus de crop/zoom cassé).
6. **P6** : même bug `width*1.3`→`width*0.8` corrigé dans `P5DashboardMorphBosse.tsx`. Plan
   d'ouverture (personnage distinct de Sarah) encadré en disque/anneau comme P5. `VirtualCursor`
   intégré ACTIVEMENT dans le dashboard dès le début du plan (survole une ligne de contexte puis
   descend sur la ligne Sarah et clique, 0-5.2s local, coordonnées reprises de
   `CursorTestComp.tsx` déjà validées) — pas seulement à la toute fin (confirmation téléphone,
   déjà présente en v2). Pic d'anomalie rendu plus dramatique : punch-in caméra (scale 1→1.06→1)
   + onde de choc radiale rouge + pulse de tenue amplifié (0.06→0.11) — timing interne
   (T_VIGILANCE_CUT_IN/HOLD/OUT) INCHANGÉ, la bosse reste le beat principal.
7. **P7** : non touché (bonus non fait — pas de spec précise donnée, signalé pour arbitrage futur
   si Aziz veut un résumé visuel du parcours score avant le wordmark final).

**Nouveau fichier** : `src/projects/_client-sim/noteshield/ui/DiscFrame.tsx` (composant
`DiscContent`/`DiscRing` réutilisable, extrait du pattern Flowdesk, palette NS navy/cyan).

**Validation faite** : `npx tsc --noEmit` clean sur tous les fichiers touchés. 1 bug d'accent
trouvé et corrigé pendant le scan (`"Horaire coherent"` → `"Horaire cohérent"` dans
`P5VideoSarah.tsx`) — aucun autre trouvé après grep systématique des strings affichées. 29 stills
ciblés rendus via `.scratch-composer/render-stills.mjs` (bundle unique + N renderStill, évite la
recopie de `public/` 2.6 Go à chaque appel CLI) couvrant début/milieu/transition/pic de chaque
panneau modifié — tous inspectés visuellement par remotion-composer avant handoff. Résultats :
compteur P1 net et lisible, deltas P4 lisibles pendant leur trajet vers le score, disque/anneau
P5+P6 fonctionnent (chassis laptop entier visible, plus de crop), cascade+curseur P6 visibles
tout du long, pic d'anomalie désormais impossible à manquer (spike rouge net + shockwave au
frame ~1560, contre le défaut initial "je n'ai même pas vu le pic").

**Vérification indépendante post-refonte (2026-08-08, avant clôture)** : render re-vérifié
(anti-gel + inspection frame par frame par l'orchestrateur, pas seulement le rapport de l'agent).
Confirmé bons : compteur P1 lisible, deltas P4 visibles et lisibles pendant leur trajet, bug
laptop corrigé (chassis entier visible), disque/anneau P5 fonctionne. **1 défaut trouvé non
signalé par l'agent** : dans P6, le `VirtualCursor` est actif en intro (0-~5s local) et à la toute
fin (confirmation téléphone), mais ABSENT pendant ~4s au milieu du plan dashboard (entre
`introToSarahProgress` et `T_CURSOR_CONFIRM_START = T_PHONE_IN + 0.9`) — le dashboard reste figé
sans mouvement visible sur cette fenêtre. Pas corrigé (décision Aziz : clôturer tel quel).

## Livrable final

`out/_client-sim/noteshield/FINAL/northshield-v3-FINAL.mp4` — copie de
`out/_r-and-d/noteshield-v3/northshield-v3_v3.mp4` (5 panneaux post-refonte, validé par Aziz
"la v3 est bonne"). Composition source : `src/projects/_client-sim/noteshield/NorthShieldV3.tsx`.

## Améliorations identifiées mais NON traitées (test clos avant)

1. Trou de `VirtualCursor` de ~4s dans P6 (ci-dessus) — dashboard figé sans interaction visible.
2. Bonus P7 (résumé visuel du parcours score 18→82→résolu avant le wordmark) — jamais fait,
   aucune spec précise donnée.
3. Résolution SD (864×480) du clip P1c jamais régénérée en 2K — contraste de netteté accepté.
4. Pic d'anomalie P6 dramatisé en code (punch-in + shockwave) mais jamais confirmé convaincant
   en mouvement par Aziz (seulement jugé sur stills) — si le test était repris, à revoir en vrai
   visionnage.
