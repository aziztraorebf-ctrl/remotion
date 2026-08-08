# NorthShield (test client simulé) — STATUS

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

**À faire en session de construction NoteShield** : évaluer si ce clip P1c remplace P1a+P1b (un seul
plan continu au lieu de deux), ou s'il faut le découper/recadrer pour s'insérer dans le timing verrouillé
P1 (4-280, 9.2s) — le clip généré fait 12.25s, légèrement plus long que la fenêtre P1 actuelle.

## Prochaine session — reste à faire

1. **Décider du sort de P1c** (ci-dessus) — remplace P1a+P1b ou s'insère différemment dans le timing.
2. Coder P2 (slider dilemme, nouveau, SVG maison).
3. Assembler P3/P4/P7 (déjà codés v2, réutilisés tels quels) avec les nouveaux timings frame-précis.
4. Intégrer les clips H3 dans la structure Remotion (`<Sequence>` + overlay annotations mono).
5. Ajouter le cadre UI léger sur P4 (ancrage produit, changement mineur sur composant existant).
6. Mini-render de validation avant review complète.
