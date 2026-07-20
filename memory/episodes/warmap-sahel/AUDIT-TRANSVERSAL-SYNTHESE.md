# AUDIT TRANSVERSAL — Synthèse War-Map Sahel AES (Acte1 + P1 + P2 + P3 + P4)

> Audit LECTURE SEULE 2026-07-01, agent transversal final de la méthode `PASSE-AMELIORATION-SCENE-PAR-SCENE.md`.
> Ne relit pas les renders : synthétise les 4 audits scène déjà écrits (`AUDIT-AMELIORATIONS-P1/P2/P3/P4.md`),
> confronté à `WARMAP-GRAMMAIRE.md` et à `STATUS.md`. Zéro fichier de production modifié.

## RÉSUMÉ (5 lignes)
La vidéo est visuellement solide sur les 4 scènes (grammaire causale globalement exemplaire, P3 en tête).
Le défaut dominant est **transversal et unique** : l'absence quasi-totale de SFX câblés (P1 et P4 à 100% muets,
P2 et P3 avec des trous mesurés) — ce n'est pas 4 problèmes isolés mais UN seul chantier de câblage audio à
traiter d'un coup sur toute la vidéo. Deux écarts de conformité à la doctrine (`WARMAP-GRAMMAIRE.md` §9) sont
identifiés en P3 (overlay `semitransp` banni) et un bug de fondu en P4 (cartouche qui expose les contours) —
tous deux localisés, pas systémiques. Le défi structurel carte-fixe-3-pays est bien résolu et en PROGRESSION
cohérente d'une scène à l'autre (soustraction → jetons/sillage → tenaille/reconquête → institutionnel), sans
redite. Le vrai point de fragilité inter-scènes est le raccord P2→P3 (CEDEAO jamais montrée → payoff P3 à plat).

---

## 1. SYSTÈMES TRANSVERSAUX (à traiter comme UN SEUL chantier chacun)

### T1 · SFX quasi-inexistants sur toute la vidéo — LE chantier prioritaire
- **Scènes touchées** : P1 (0 SFX, aucun bloc `<Audio>` moteur), P4 (0 SFX, aucun bloc `<Audio>` moteur), P2
  (drone ponctuel mal étendu → 3 trous de silence mesurés + CEDEAO/A2 muet), P3 (5 trous de silence mesurés,
  dont 2 dans les 22 premières secondes pendant l'overlay AES). Seuls `acte1Refonte`, `acte2` (legacy) ont un
  bloc SFX complet dans `SahelWarMapEngine.tsx` — **grep exhaustif confirmé par 2 audits indépendants (P1 et
  P4) : `partie1` et `partie4` n'ont AUCUN bloc `<Audio>`**. C'est un pattern net : 3 scènes sur 4 (P1/P2/P4)
  ont un déficit majeur, la 4e (P3) a un déficit modéré. Ce n'est PAS 4 oublis isolés, c'est UNE étape du
  pipeline production (câblage SFX) qui n'a jamais été appliquée de façon systématique après le refactor
  moteur-fin par Partie — chaque scène a été codée/validée visuellement puis « laissée » sonore.
- **Traitement unifié proposé** : UN seul agent/session qui câble les 4 blocs `{partieN && !acte1CameraOnly && (...)}`
  d'un coup, scène par scène mais dans LA MÊME passe (pas 4 sessions séparées), en réutilisant explicitement
  les triggers déjà identifiés par les 4 audits scène (listés item par item dans la section 5). Justification
  de l'unification : (a) cohérence de dosage (même gamme de volumes 0.30-0.55 déjà validée P2/P3, à répliquer
  P1/P4 plutôt que réinventer), (b) le mix ne se juge correctement qu'après assemblage complet — traiter les 4
  scènes ensemble évite de remonter 4 fois, (c) le vocabulaire SFX doit rester identique partout (ping carto =
  pose, ink-spread = zone, impact = chute/choc) pour que l'oreille reconnaisse le même langage sur toute la
  vidéo — le construire scène par scène dans le désordre risquerait 4 variantes légèrement différentes.
- **Contrainte non-négociable héritée (les 4 audits + STATUS le confirment unanimement)** : ⛔ **AUCUN
  `tension-drone`** nulle part (décision Aziz 2026-06-27, dérange). Le lit sonore = musique de fond
  (`score-epic.mp3`, vol ~0.10) + SFX PONCTUELS uniquement. Les 4 audits scène ont déjà correctement appliqué
  cette correction en tête de fichier — **confirmé qu'aucun des 4 fichiers ne recommande encore un drone
  d'assise** dans ses items actifs (P1/P2 portent un bandeau de correction explicite en préambule, P3/P4 l'ont
  intégré nativement dans leur texte).
- **Impact** : FORT — c'est le manque le plus répété et le plus objectivement mesuré (mesures dB/silencedetect
  cohérentes sur les 4 scènes) de toute la vidéo.
- **Effort** : MOYEN à l'échelle du chantier complet (4 blocs à écrire, triggers déjà connus par les audits),
  mais QUICK WIN scène par scène pris isolément (chaque item individuel est petit).

### T2 · Pictogrammes de faction GLM-5.2 — décision à trancher, PAS un manque généralisé
- **État réel constaté** : P3 a déjà les pictogrammes de faction (chevrons=militaire/losange=mercenaire/étoile=
  armé) CONFIRMÉS VISIBLES au render (badge parchemin en coin bas-droit des jetons). P1 n'a AUCUN jeton/objet
  (scène « soustraction » 100% cartographiable, décision de goût explicitement actée — introduire des objets
  la casserait). P2 utilise des jetons (JNIM bordure or / EIGS bordure sombre) mais l'audit P2 ne signale PAS
  l'absence de pictogrammes comme un manque — la distinction de faction s'y fait déjà par la bordure de
  couleur du jeton. P4 a ses propres jetons (junte, réfugiés) mais l'audit P4 classe explicitement ce sujet
  comme « décision transversale, hors de portée d'un audit scène isolée ».
- **Diagnostic transversal** : ce n'est PAS une incohérence à corriger d'urgence — P1 n'a pas de jetons par
  choix de registre (légitime, ne pas y greffer de pictogrammes), P2 distingue déjà les factions par couleur
  de bordure (fonctionnellement équivalent), seul P3 a poussé la technique plus loin. La vraie question pour
  Aziz : généraliser les pictogrammes P3 à P2 et P4 (cohérence visuelle accrue, mais retouche de jetons déjà
  validés) OU accepter que P3 soit simplement la scène la plus aboutie sur ce point précis (elle a été codée
  APRÈS et a hérité des acquis) sans revenir en arrière sur P2/P4 déjà validés Aziz.
- **Impact** : FAIBLE-MOYEN (gain de cohérence, pas un défaut qui casse la lisibilité actuelle).
- **Effort** : si généralisation décidée — MOYEN (retouche du `chip()`/jeton dans P2 et P4, risque de re-render).
- **Recommandation** : NE PAS traiter comme un défaut à corriger d'office — le signaler à Aziz comme question
  de goût (section 6), pas comme un item de backlog technique obligatoire.

### T3 · Bug de transparence de conteneur (fondu qui expose les contours) — localisé à P4, pas généralisé
- **Constaté** : l'audit P4 (§2) documente précisément le mécanisme — le cartouche « Coût humain » a un fond
  solide, MAIS c'est l'`<AbsoluteFill>` PARENTE entière qui est faite fader en opacité (`opacity: op`), ce qui
  fait que le fond « opaque » redevient transparent progressivement et les contours nationaux colorés
  (rendus par le moteur, couche séparée) transparaissent au travers — exactement le cas banni par
  `WARMAP-GRAMMAIRE.md` §9.
- **Recherche de généralisation** : l'audit P4 lui-même signale ne PAS avoir vérifié si ce même mécanisme
  (opacité de conteneur sur un cartouche à fond « opaque ») existe ailleurs dans P4 ou les autres parties —
  c'est un TROU EXPLICITE de son propre audit. Aucun des 3 autres audits (P1/P2/P3) ne signale ce même
  symptôme (P3 signale un problème DIFFÉRENT et plus structurel, cf T4 ci-dessous, sur son overlay Ph1
  `mode="semitransp"` — un choix de MODE non conforme, pas un bug de fondu de conteneur). Rien dans P1/P2 ne
  suggère un cartouche à fond solide qui fade en `opacity` globale.
- **Diagnostic transversal** : signal INSUFFISANT pour parler de « système transversal » au sens strict —
  c'est un bug localisé (1 cartouche, 1 fichier) mais dont la CAUSE RACINE (fader l'opacité du conteneur au
  lieu du contenu) est un anti-pattern générique qui pourrait resurgir ailleurs. Recommandation : traiter
  comme un fix ciblé P4 MAIS ajouter un grep ciblé (`opacity:.*op` sur les `<AbsoluteFill>` contenant un fond
  solide) sur les 4 fichiers de parties avant de clore, pour confirmer/infirmer qu'il ne se reproduit pas
  ailleurs — un quick-win de vérification à ajouter au chantier de correction.
- **Impact** : MOYEN-FORT là où il est confirmé (P4). **Effort** : QUICK WIN (séparer opacité fond/contenu,
  ou cut net, ou transition slide/scale au lieu de fondu d'opacité).

### T4 · Écart de conformité doctrine `semitransp` — confirmé UNIQUEMENT en P3, pas généralisé
- **Constaté** : `Partie3Rupture.tsx` ligne 850 utilise `mode="semitransp"` sur l'overlay AES Ph1 (0-22s),
  explicitement banni par `WARMAP-GRAMMAIRE.md` §9 depuis le 14 juin (règle gravée après un cas P4 jugé
  « vraiment très moche »). P3 a été validée le 13 juin, donc AVANT cette règle — cas typique « scène qui
  date d'avant l'acquis », prévu par la méthode d'audit.
- **Vérification sur les 3 autres scènes** : P4 utilise `WarMapDimmedOverlay` (voile fort ~0.62 + trou
  masque, AUTORISÉ par la doctrine, section 6) pour son overlay confédération — CONFORME. P1 n'a aucun
  overlay (scène 100% carte). P2 n'a pas d'overlay conceptuel identifié dans son audit. **Donc l'écart de
  conformité est réellement ISOLÉ à P3** — ce n'est pas un pattern répété, c'est un résidu d'antériorité sur
  une seule scène, comme la méthode d'audit le prévoyait explicitement.
- **Nuance de l'audit P3 lui-même** : le résultat visuel réel (frames extraites) n'est PAS la « bouillie »
  qui a fait bannir la règle — le cartouche reste lisible, le fond de carte est assombri sans être
  catastrophique. L'audit P3 note explicitement que le jugement esthétique final revient à Aziz : est-ce un
  écart de CONFORMITÉ (à corriger par principe, cohérence de règle) ou un cas où le résultat est déjà bon
  malgré le mode techniquement non recommandé ?
- **Impact** : FORT si on applique la règle strictement (c'est une règle non-négociable actée par Aziz après
  un rejet explicite, et c'est la toute première image de P3 — le hook d'entrée de la scène). **Effort** :
  MOYEN (le composant supporte déjà `mode="fullscreen"` ou le pattern `WarMapDimmedOverlay`, la bascule est
  un changement de mode + retiming potentiel du stagger).

---

## 2. COHÉRENCE INTER-SCÈNES / RACCORDS

| Jonction | État constaté | Risque |
|---|---|---|
| **Acte1 → P1** | Board clearing visuel correct (jetons Acte1 s'effacent avant « 2012 »), MAIS le drone d'assise de l'Acte1 refait s'arrête net et P1 n'a aucun SFX (T1) → rupture sonore probable au point de jointure. Jugé sur frames isolées seulement (audit P1 le signale explicitement), à reconfirmer sur la concat réelle. | MOYEN — dépend entièrement de la résolution de T1 (câbler P1 en le faisant DÉBORDER dès le board clearing pour couvrir la jointure). |
| **P1 → P2** | Aucun audit ne signale de problème de raccord ici. Palette/registre cohérents (les deux héritent `isFinalLook`). | FAIBLE. |
| **P2 → P3** | ⛔ **LE RACCORD LE PLUS FRAGILE DE TOUTE LA VIDÉO.** P3 s'ouvre sur « les flèches CEDEAO (héritées P2) se BRISENT » — mais l'audit P2 (A2/A3) constate que P2 ne pose JAMAIS de flèches CEDEAO visuellement fortes (cercles minuscules, flèches à peine perceptibles, SFX `cedeao-snap` retiré faute de support visuel). Le payoff P3 (briser la menace) tombe à plat car son setup P2 est quasi invisible. C'est une dépendance directe et documentée par l'audit P2 lui-même (A3 explicite ce lien). | FORT — narrativement, c'est la seule vraie rupture de continuité causale identifiée entre deux scènes (pas juste un raccord visuel, un raccord de SENS : « on brise quoi si on n'a jamais rien vu se dresser ? »). |
| **P3 → P4** | Non auditée dans le détail (l'audit P3 le signale explicitement comme hors périmètre, à valider par cet agent transversal). Aucun signal négatif trouvé dans P4 ou STATUS concernant ce point précis. Fin P3 serrée à f9410 « sans débordement dans P4 » = décision Aziz déjà respectée. | FAIBLE, sous réserve de vérification visuelle au montage (aucun audit scène n'a listé de problème ici). |
| **3 jonctions internes à P4** (exode→ressources, ressources→confed, confed→cfa) | L'audit P4 (§3) documente 3 points de coupe entre les 4 fichiers séparés : (a) exode→ressources = cut de zoom serré→large, cohérent mais aggravé par le bug T3 s'ils tombent au même instant ; (b) ressources→confed = cut dur triple-screen→carte pleine, un fondu court (0.3-0.5s) éviterait un raccord sec ; (c) confed→cfa = fenêtre de seulement ~18 frames (0.6s) entre un voile SOMBRE (confed) et un fond CLAIR (cfa split) — jugée TROP COURTE, risque de flash perceptible. | MOYEN — mais l'audit P4 souligne lui-même : ses observations comparent des BORNES DE FICHIERS SÉPARÉS, pas les vraies frames de coupe de l'assemblage final. Ne rien corriger avant l'assemblage réel. |

**Constat transversal sur les raccords** : sur 6 points de jonction (5 inter-scènes + les 3 internes à P4 comptent
comme sous-total), un seul est un vrai problème NARRATIF (P2→P3, CEDEAO), les autres sont des questions de
MONTAGE (fondu/cut à ajuster à l'assemblage réel, pas avant). Aucun problème de PALETTE/REGISTRE n'est remonté
par les 4 audits — la cohérence visuelle (parchemin, multiply, top-down) est un point fort constant, jamais
signalé en défaut.

---

## 3. LE DÉFI STRUCTUREL CARTE-FIXE (bilan)

**Résolu de façon cohérente et EN PROGRESSION, pas redite.** Chaque scène invente une variation du même
principe (carte permanente sur 3 pays fixes → dynamiser SANS bouger le territoire), et les 4 solutions
s'enchaînent en montée de complexité plutôt qu'en répétition :

- **P1 (origine)** = soustraction pure : board clearing + trait d'encre (flux réel Libye→Mali) + taches
  d'impact + vide d'État par chute d'opacité. Aucun objet/jeton — le territoire lui-même respire.
- **P2 (blocage)** = introduction des jetons-acteurs + sillage causal (le territoire change de main PARCE QUE
  des acteurs avancent) + chute de base en 3 temps. Premier niveau d'incarnation.
- **P3 (rupture)** = le registre le plus riche : jetons + pictogrammes de faction + contours nationaux qui
  virent de couleur + drapeau planté ondulant + flashback sépia (rupture de registre ASSUMÉE, pas une carte
  qui reste figée) + clash de jetons physiques. C'est la synthèse qui pousse le plus loin l'arsenal complet.
- **P4 (coût/perspective)** = seule scène qui sort massivement de la carte (triple-screen, overlay
  confédération plein écran, split-screen CFA) — légitimé par la doctrine section 2 (le conceptuel/
  institutionnel n'a pas d'ancrage géo) et cohérent avec la fin de l'arc (on quitte le tactique pour le
  systémique/perspective).

Il n'y a **pas de redite de solution** (P2 ne recopie pas P1, P3 ne recopie pas P2) et **pas de rupture de
cohérence de méthode** (chaque scène suit le test section 2 de la grammaire : ancrage géo → carte, sinon →
overlay). Le seul vrai bémol de conformité au sein de cette progression est T4 (P3 Ph1 encore en mode
`semitransp`, antérieur à la règle qui aurait dû s'appliquer) — un résidu d'antériorité documentaire, pas un
échec de la progression elle-même.

---

## 4. BACKLOG GLOBAL PRIORISÉ (fusion des 4 audits + trouvailles transversales)

> Trié IMPACT décroissant puis EFFORT croissant. Prêt à présenter à Aziz pour validation avant tout agent
> de correction. `[T#]` = rattaché à un système transversal ci-dessus.

| # | Scène | Item | Impact | Effort |
|---|---|---|---|---|
| 1 | **P2→P3 (transversal)** | `[Raccord]` Rendre les flèches/menace CEDEAO enfin visibles en fin de P2 (flèches courbes convergentes depuis pays CEDEAO + pulse) ET remettre le SFX `cedeao-snap` une fois le support visuel rétabli — pour que le payoff P3 « briser les flèches » ait un vrai setup. Couplé à A2+A3 de l'audit P2. | FORT | MOYEN |
| 2 | **P1 [T1]** | Câbler le bloc SFX `partie1` complet (bloc `{partie1 && ...}` : ping pose Libye, impact aux 3 chutes de villes, ink-spread hachures) — scène actuellement 100% muette sur ses événements visuels forts. | FORT | MOYEN |
| 3 | **P4 [T1]** | Câbler le bloc SFX `partie4` complet (4 fichiers : exode, ressources, confed, cfa) — même trou que P1, triggers déjà identifiés dans le code (F_DJIBO/F_MENAKA/F_TILLABERI, F_OR/F_URANIUM/F_PETROLE, F_NIAMEY_QG, climax fil CFA). | FORT | MOYEN |
| 4 | **P2 [T1]** | A1 — Étendre le drone... **NON** : remplacer par lit MUSIQUE continue (`score-epic.mp3`) sur toute la durée P2 pour combler les 3 trous de silence mesurés (t≈25s/48s/59.5s) — jamais de `tension-drone`. | FORT | QUICK WIN |
| 5 | **P3 [T1]** | A2 — Combler les 5 trous de silence (dont 2 sous l'overlay AES, le moment le plus « premium » de la scène qui devrait le mieux porter un son) : musique de fond continue + pings ponctuels (starburst convergence Liptako t≈12-15s, ink-spread sillage bleu, impact clash Ph9). | FORT | QUICK WIN (pings) / MOYEN (vérif musique continue) |
| 6 | **P3 [T4]** | A1 — Basculer l'overlay AES Ph1 (ligne 850, `mode="semitransp"`) vers `mode="fullscreen"` ou `WarMapDimmedOverlay`, non-conformité à la règle §9 de `WARMAP-GRAMMAIRE.md` sur la toute première image de la scène. **Nuance à trancher par Aziz** : le rendu réel n'est pas la « bouillie » qui a motivé le bannissement — vérifier au visionnage si le changement est vraiment nécessaire ou si le résultat déjà bon justifie une exception. | FORT (si strict) | MOYEN |
| 7 | **P4 [T3]** | Bug cartouche « coût humain » semi-transparent pendant son fade-out (~t=19-20s dans exode) : séparer l'opacité du fond (doit rester à 1 puis cut net, ou slide/scale-out) de l'opacité du contenu texte. + grep ciblé sur les 3 autres fichiers de parties pour confirmer qu'aucun autre cartouche ne partage ce même anti-pattern (opacité de conteneur entier plutôt que de contenu). | MOYEN-FORT | QUICK WIN |
| 8 | **P2** | A4 — Onde de choc géométrique froide (kaki/gris-fer, one-shot, sans sillage) au coup d'État Niger — actuellement sous-jouée, ne « casse pas la grammaire » comme prévu par le DA-brief validé (distinction politique vs jihadiste). | MOYEN-FORT | MOYEN |
| 9 | **Acte1→P1 [raccord]** | Faire déborder le SFX de P1 (une fois câblé, item #2) dès le board clearing pour couvrir la jointure sonore avec la fin de l'Acte1 refait (le drone d'Acte1 s'arrête net). À vérifier seulement APRÈS assemblage réel (Acte1+P1 concaténés), pas avant. | MOYEN | QUICK WIN (une fois #2 fait) |
| 10 | **P4 [raccord interne]** | 3 jonctions internes (exode→ressources, ressources→confed, confed→cfa) : ajouter fondus courts (0.3-0.5s) aux 2 premières, envisager un crossfade plus long (8-12f) à la 3e (fenêtre actuelle ~18f/0.6s jugée courte entre voile sombre et fond clair). ⛔ Ne vérifier/corriger qu'à l'assemblage réel des 4 fichiers, pas sur les bornes de fichiers séparés. | MOYEN | FAIBLE (vérif) à MOYEN (correction) |
| 11 | **P2** | A5 — Ping cartographique discret aux poses du setup (bases FR, MINUSMA, ~0-22s) actuellement silencieux. | MOYEN | QUICK WIN |
| 12 | **P2** | A6 — Renforcer légèrement le sillage rouge « wet ink » (opacity/saturation) qui lit un peu faible/muddy sur le parchemin — c'est le cœur narratif du beat (l'échec), il doit frapper plus. | MOYEN | QUICK WIN |
| 13 | **Transversal [T2]** | Décision Aziz : généraliser les pictogrammes de faction (chevrons/losange/étoile, déjà en P3) à P2 et P4, OU accepter que ce soit une amélioration propre à P3 sans y revenir sur des scènes déjà validées. PAS un défaut objectif — pure question de goût/cohérence. | FAIBLE-MOYEN | MOYEN (si généralisation) |
| 14 | **P3** | A3 — Ajouter `WarMapBanner` (drapeaux plantés réels) sur les 3 capitales AES en Ph1, pour le fil rouge visuel avec le hook Acte1 qui utilise déjà cette technique sur les mêmes 3 pays. Risque de surcharge (Ph1 déjà dense : overlay + contours + convergence + sceau) — à arbitrer avec Aziz, pas à ajouter par défaut. | MOYEN | MOYEN |
| 15 | **P2** | A7 — Sprites fumée (chutes de bases) lisent un peu abstraits (silhouette cône/calice plutôt que colonne) — à valider visuellement avant de toucher, pas un vrai bug. | FAIBLE-MOYEN | MOYEN |
| 16 | **P3** | A4 — SVG-insert mix-and-match sur la convergence AES (Ph1-2) : piste optionnelle seulement si Aziz veut pousser plus loin que l'overlay actuel — refonte, pas un ajout chirurgical, à NE PAS entreprendre sans validation explicite. | FAIBLE-MOYEN | ÉLEVÉ |

**Ordre d'exécution recommandé pour l'agent de correction (une fois le backlog validé Aziz)** :
1. Résoudre le chantier SFX unifié (#2, #3, #4, #5, #11) en UNE seule passe cohérente (T1) — le plus gros
   gain perçu, la même contrainte (pas de drone) partout.
2. Résoudre le raccord P2→P3 CEDEAO (#1) — c'est le seul vrai trou narratif inter-scènes.
3. Trancher et appliquer T4 (#6, overlay P3) et T3 (#7, bug cartouche P4) — deux corrections techniques
   propres et bornées.
4. Les items de renfort narratif (#8 onde de choc Niger, #12 sillage P2) en polish.
5. Les vérifications de raccord interne P4 (#10) et Acte1→P1 (#9) UNIQUEMENT à l'assemblage réel, jamais
   avant, sur des frames de la vraie concat.
6. Décisions de goût (#13 pictogrammes, #14 WarMapBanner P3, #15 fumée, #16 SVG-insert AES) — dernier,
   optionnel, à la discrétion d'Aziz.

---

## 5. CE QUI RESTE AU JUGEMENT / GOÛT D'AZIZ

- **Perception audio fine** : les 4 audits scène ne font que MESURER (dB, durées de silence) — aucun n'a
  écouté le mix au casque. Le dosage exact des SFX à ajouter (chantier T1), l'équilibre voix/musique, et si
  les trous mesurés sont réellement gênants à l'oreille = jugement d'Aziz après le premier passage de
  correction, pas avant.
- **P3 overlay `semitransp` (#6/T4)** : écart de CONFORMITÉ à la règle confirmé sur le papier, mais le rendu
  réel n'est pas la « bouillie » qui a motivé le bannissement. Est-ce une exception tolérable (scène déjà
  validée, résultat déjà bon) ou une correction de principe non négociable ? Pure décision d'Aziz après
  visionnage plein format.
- **Pictogrammes de faction généralisés ou non (#13/T2)** : cohérence transversale vs risque de retoucher
  des scènes déjà validées — décision de goût pure, pas un manque objectif.
- **WarMapBanner sur P3 Ph1 (#14)** : gain de fil rouge visuel vs risque de surcharge d'une scène d'ouverture
  déjà dense — à arbitrer, pas à ajouter par défaut.
- **Sprites fumée P2 (#15)** et **SVG-insert AES P3 (#16)** : jugements esthétiques, pas des bugs.
- **Rupture Burkina/France du 26 juin 2026 (mentionnée dans STATUS.md, décision Aziz en attente depuis le
  2026-06-28)** : ce n'est PAS un item d'audit technique, mais un point de calendrier à ne pas perdre de vue —
  la vidéo AES ne doit pas être ASSEMBLÉE/FINALISÉE tant que la décision (scène bonus sur l'actu chaude,
  ou publication AES avant Sénégal) n'est pas tranchée. Ce backlog technique peut être exécuté indépendamment
  (aucun item ci-dessus ne dépend de cette décision), mais l'assemblage final, lui, doit attendre.
- **Comparatif CFA Remotion vs SVG-insert alternatif** (mentionné dans l'audit P4 et STATUS.md) : décision
  esthétique en attente, hors du périmètre technique de ce backlog.
