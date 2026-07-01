# PASSE AMÉLIORATION SCÈNE PAR SCÈNE — méthode agentique (actée Aziz 2026-06-27)

> Une vidéo déjà "finalisée" accumule des techniques nouvelles APRÈS coup (SVG génératif, mix-and-match,
> jetons/pictogrammes GLM-5.2, PixelLab organique, maillon-rupture/sceau...). Plutôt qu'Aziz repasse scène
> par scène lui-même, on délègue l'AUDIT à des agents — un par scène + un transversal — puis Aziz valide
> le backlog priorisé AVANT que d'autres agents appliquent les corrections. 3 passes distinctes, jamais fusionnées :
> **AUDIT (lecture seule) → VALIDATION Aziz (goût) → CORRECTION (agents dédiés)**.

## POURQUOI CETTE MÉTHODE (contexte War-Map Sahel AES, prouvée 2026-06-27)
Après avoir refait l'Acte 1 (sceau AES, SFX, mix-and-match SVG) et produit le SVG-insert CFA, on a réalisé
que P1/P2/P3/P4 datent d'AVANT ces acquis. Un audit scène par scène généralise la question à toute la vidéo :
**"qu'avons-nous appris depuis que cette scène a été rendue, et qu'est-ce qu'on peut greffer SANS tout casser ?"**

## STRUCTURE : 1 AGENT PAR SCÈNE + 1 AGENT TRANSVERSAL (jamais l'inverse)
- **N agents parallèles**, un par scène/acte de la vidéo, MÊME checklist (ci-dessous). Chacun produit
  `AUDIT-AMELIORATIONS-<Scene>.md` (fichier disque, lecture seule, aucune correction).
- **PUIS 1 agent TRANSVERSAL** : lit les N fichiers d'audit + regarde la vidéo assemblée dans son ensemble.
  Attrape ce qu'un audit isolé rate structurellement :
  - Un système qui devrait courir sur TOUTES les scènes (ex: pictogrammes de faction au-dessus des jetons —
    si on l'ajoute sur 1 scène, il doit être prévu partout ou nulle part, jamais à moitié).
  - Cohérence registre/palette/grammaire entre scènes consécutives (raccords, pas de rupture de style).
  - Répétition d'un même défaut sur plusieurs scènes (ex: SFX câblé inégalement partout).
  - Vue d'ensemble du DÉFI STRUCTUREL du format (cf. section dédiée plus bas) — est-il résolu scène par
    scène de façon cohérente, ou chaque scène invente sa propre solution ?

## LA CHECKLIST D'AUDIT (donner à CHAQUE agent scène, identique)
1. **Juger le RENDER RÉEL** (frames extraites + audio ffprobe/volumedetect), PAS que le code. Lire le code après.
2. **Le DÉFI STRUCTUREL du format** (War-Map = carte PERMANENTE sur 3 pays fixes, contrairement à une carte qui
   voyage) : comment CETTE scène dynamise-t-elle une zone géographique qui ne bouge pas ? Est-ce la caméra
   (drift, punch-in), les objets qui bougent DANS la zone fixe (jetons, sillages, contours qui flashent), les
   ruptures de registre (SVG-insert, plein écran ponctuel) ? Identifier ce qui manque SPÉCIFIQUEMENT à ce défi.
3. **Arsenal actuel à confronter** (liste vivante, mettre à jour à chaque nouvel acquis) :
   - SVG génératif animé par code (paths, spring, stroke-dashoffset) — `SVG-SCENES-GENERATIVES.md`,
     `WARMAP-ANIMER-OBJETS.md`. Preuve récente : maillon de rupture, sceau émergent, chaîne à maillons.
   - Mix-and-match SVG + version Claude maison (gratuit, groupes animables) — `PRODUCTION-AGENTIQUE-SVG.md`.
   - Jetons/pictogrammes low-cost via GLM-5.2 (`memory/tools/openrouter-svg.md`) — ex Aziz : petits pictogrammes
     de faction au-dessus de chaque combattant, qui PERSISTENT sur toute la vidéo (système transversal, pas 1-scène).
   - PixelLab pour effets organiques denses (fumée, explosion, ping-pong loop) — doctrine
     `WARMAP-OBJETS-GEMINI-VS-PIXELLAB.md` (Gemini = objets/marqueurs animés par nous, PixelLab = effets animés
     par prompt).
   - SFX enrichis : ping cartographique (pose de marqueur), ink-spread (zones), impact (chutes/friction).
     ⛔ PAS de `tension-drone` d'assise (dérange Aziz, retiré partout — la musique de fond suffit).
   - Drapeaux/bannières avec `hideAt` (cèdent la place à la couche tactique) — `WarMapBanner.tsx`.
   - Contours nationaux colorés draw-in + pulse (repérage géo pendant l'action tactique).
4. **Grammaire causale** (`WARMAP-GRAMMAIRE.md`) : cause avant effet, pas d'état qui "poppe" sans cause montrée.
5. **SFX manquants** : événements visuels forts qui restent muets.
6. **Raccords** avec la scène précédente et suivante (registre, palette, continuité narrative).
7. **Distinguer (A) vrai manque vs (B) déjà bon** — ne PAS proposer de tout refaire si la scène est déjà validée
   Aziz. Chirurgical : des AJOUTS ciblés, pas une refonte, sauf si l'agent démontre un vrai problème structurel.

## FORMAT DE SORTIE (chaque agent scène)
`memory/episodes/<episode>/AUDIT-AMELIORATIONS-<Scene>.md` : résumé 3 lignes en tête, puis liste triée par
IMPACT décroissant, chaque item = {timecode, problème constaté, technique arsenal, effort, impact, risque}.
Section finale : ce qui reste à la perception/goût d'Aziz (audio fin, dosage, décisions de style).

## RÈGLES NON-NÉGOCIABLES
- **Audit = LECTURE SEULE.** Aucun agent d'audit ne modifie de fichier de prod. Zéro render lourd (extraire
  quelques frames suffit).
- **Aziz TRANCHE le backlog avant toute correction.** Les agents de correction ne se lancent qu'après validation
  explicite (éventuellement scène par scène, ou en bloc si le backlog est clair).
- **Ne pas fusionner audit et correction dans le même agent** — sinon on perd le point de contrôle de goût.
- Cette checklist devient PÉRIMÉE à mesure que l'arsenal évolue — la mettre à jour à chaque nouvelle technique
  prouvée (comme on vient de le faire avec le mix-and-match SVG).

## APPLIQUÉ (War-Map Sahel AES)
- ✅ **P1, P2 DÉJÀ AUDITÉS (2026-06-27)** : `episodes/warmap-sahel/AUDIT-AMELIORATIONS-P1.md` / `-P2.md`.
  Ce sont des SOURCES DE VÉRITÉ déjà écrites — NE PAS relancer d'agent d'audit dessus. La prochaine session
  lance seulement les agents MANQUANTS (Acte1 formel + P3 + P4 à confirmer), puis l'agent TRANSVERSAL lit
  les 5 fichiers d'audit (2 déjà là + 3 nouveaux) pour sa synthèse d'ensemble.
- **Restent à auditer** : Acte1 (fait manuellement cette session, jamais audité formellement par un agent dédié —
  vérifier si ça vaut le coup vu qu'il vient d'être refait), P3, P4 (probablement déjà au niveau, à confirmer
  avant de lancer l'agent — si P4 est déjà jugée bonne, ne pas auditer pour rien).
- Prochaine session : lancer les agents scène manquants (Acte1 optionnel + P3 + P4 si pertinent) PUIS
  l'agent TRANSVERSAL final qui lit TOUS les audits (les 2 existants + les nouveaux) et produit la synthèse
  transversale (systèmes qui doivent courir partout, cohérence inter-scènes, défi carte-fixe résolu ou non).
