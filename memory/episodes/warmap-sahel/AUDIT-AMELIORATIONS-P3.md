# AUDIT AMÉLIORATIONS P3 — War-Map Sahel AES (La Rupture)

> Audit LECTURE SEULE (2026-07-01, passe consolidée). Render jugé : `out/episodes/warmap-sahel/p3-FINAL.mp4`
> (109.78s exactes, confirmées par `ffprobe` ET par le calcul (F_END 9410 − F_BAMAKO 6118)/30fps = 109.7s —
> le fichier correspond bien 1:1 au code, pas un subclip approximatif comme P1). 1920×1080, mean -19.9 dB /
> max -1.0 dB. 14 frames extraites aux VRAIS timecodes locaux des triggers narratifs (recalculés depuis
> `(frame_absolue − F_BAMAKO)/30`, cf. méthode ci-dessous) + `silencedetect -50dB`/`volumedetect`.
> Code : `src/projects/warmap/parties/Partie3Rupture.tsx` (868 lignes) + câblage `engine/SahelWarMapEngine.tsx`
> (mode `partie3`, SFX L1646-1671). Modèle DA-brief : `PLAN-NARRATIF-P3.md`. ⛔ AUCUNE correction faite ici.
> P3 a été validée le 2026-06-13, **AVANT** les acquis Acte1 du 2026-06-27 (sceau AES, mix-and-match SVG,
> drapeaux plantés réels `WarMapBanner`, retrait `tension-drone`) — cet audit confronte P3 à ces acquis récents.

## RÉSUMÉ (3 lignes)
- **P3 est la scène LA PLUS ABOUTIE des 3 auditées (P1/P2/P3)** : grammaire causale quasi irréprochable
  (convergence AES → sceau → jetons en tenaille → sillage bleu qui se révèle → drapeau qui se hisse →
  flashback sépia Moura sobre → clash jihadiste/FAMa par jetons physiques). Contours nationaux colorés et
  pictogrammes de faction, dont le STATUS doutait de la lisibilité réelle, sont CONFIRMÉS visibles et nets
  au rendu — le doute est levé.
- **2 problèmes de CONFORMITÉ DOCTRINE + 1 problème de QUALITÉ PERÇUE, COUPLÉS** : (1) un résidu
  `tension-drone` (7s, banni depuis le 27/06) encore câblé sur le beat Moura — un oubli de nettoyage, à
  retirer ; (2) l'overlay d'ouverture AES tourne par défaut en mode `"semitransp"`, explicitement BANNI par
  `WARMAP-GRAMMAIRE.md` §9 depuis le 14/06 — mais le rendu réel n'est PAS la "bouillie" que la règle visait
  à éviter (fond quasi opaque, texte net), donc l'écart est réel sur le papier sans se voir clairement à
  l'image ; (3) **le plateau Moura (~18s) est quasi figé visuellement (violation D-0, cf. A3bis)** — un
  défaut RÉEL de qualité perçue que le drone (1) masquait probablement à l'oreille. Retirer le drone SANS
  meubler le plateau visuellement risque de RÉVÉLER ce vide plutôt que de l'assainir : traiter A1 et A3bis
  ensemble, dans cet ordre.
- **Le reste = enrichissements ciblés optionnels** (rappel du sceau AES Acte1, `WarMapBanner` sur les
  capitales, quelques silences de respiration à couvrir) — **aucun ne justifie de rouvrir une scène validée
  Aziz**. Le vrai défaut narratif (flèches CEDEAO jamais montrées) vient d'AMONT, de P2, pas de P3.

---

## MÉTHODE — recalcul des timecodes réels du clip

Le fichier `p3-FINAL.mp4` correspond exactement à la fenêtre `F_BAMAKO` (frame 6118) → `F_END` (frame 9410)
du code, soit `t_local = (frame_absolue − 6118) / 30`. Triggers clés convertis :

| Trigger | frame | t_local |
|---|---|---|
| F_BAMAKO (début, union AES) | 6118 | 0.0s |
| F_LIPTAKO (sceau AES) | 6616 | 16.6s |
| F_EPREUVE (transition Kidal) | 6800 | 22.7s |
| F_KIDAL ("Kidal.") | 7083 | 32.2s |
| F_TOUAREGS (statu quo) | 7319 | 40.0s |
| F_RETIRE (ONU se retire) | 7673 | 51.8s |
| F_AFRICA (offensive FAMa) | 7794 | 55.9s |
| F_FLOTTE (reprise Kidal) | 8132 | 67.1s |
| F_MOURA (flashback) | 8580 | 82.1s |
| F_REPOUSSE (attaques 2026) | 9121 | 100.1s |
| F_END | 9410 | 109.7s |

---

## (A) VRAIS MANQUES — triés par IMPACT décroissant

### A1 · IMPACT MOYEN-FORT · EFFORT QUICK WIN — Résidu `tension-drone` sur Moura : BUG à nettoyer, pas à garder
- **Timecode** : engine `SahelWarMapEngine.tsx` L1667-1669 : `<Sequence from={8580} durationInFrames={Math.ceil(7.0*SAHEL_FPS)}><Audio .../tension-drone.mp3" volume={0.14}/></Sequence>` → couvre t≈82-89s (Moura).
- **Constaté (code)** : c'est EXACTEMENT le SFX que Aziz a fait retirer du corps entier de l'Acte 1 le
  2026-06-27 ("le grondement continu dérange"). Le commentaire du code dit encore "drone de tension sous
  tout le beat (gravité 500 morts)" — décision de goût antérieure à la correction du 27/06, jamais mise à
  jour ici, CONTRAIREMENT au bloc `!acte1CameraOnly` (L1530-1534) qui documente bien le retrait avec un
  commentaire explicite "tension-drone d'assise RETIRE (decision Aziz 2026-06-27)". P3 a été oublié dans ce
  ménage.
- **Technique arsenal** : RETIRER la `<Sequence>` tension-drone. NE PAS la remplacer par un autre drone — la
  règle est "pas de grondement continu d'assise", point (musique de fond + SFX ponctuels suffisent). Le
  boom-coup sourd déjà câblé (L1664-1666, 1.4s) + `score-epic.mp3` devraient porter la gravité de Moura.
- **Effort** : quick win (suppression de 2 lignes). **Impact** : moyen-fort (c'est un résidu d'un SFX
  explicitement banni par Aziz, actif dans le rendu final actuel — non-conformité factuelle, pas d'opinion).
- **Risque** : faible (retrait, pas ajout) — juste réécouter que Moura ne devient pas totalement nu sur ses 7s.

### A2 · IMPACT MOYEN · EFFORT MOYEN — Overlay AES d'ouverture en mode `"semitransp"` (banni), sans arbitrage explicite
- **Timecode** : t=0-22.7s (F_BAMAKO→F_EPREUVE), bloc `WarMapOverlayDynamic` (Partie3Rupture.tsx L849-862).
- **Constaté (code + render)** : `mode={ph1Fullscreen ? "fullscreen" : "semitransp"}` ; `Root.tsx` (compo
  `SahelPartie3`) ne passe jamais `ph1Fullscreen` → défaut `false` → le rendu RÉEL utilise `"semitransp"`.
  `WARMAP-GRAMMAIRE.md` §9 bannit explicitement ce mode dans TOUTES les vidéos depuis une capture P4 jugée
  "vraiment très moche" (14/06). **Nuance vérifiée sur les frames réelles (t=3s/12s/20s)** : le fond du
  cartouche est quasi opaque, le texte reste net, les contours de carte derrière sont à peine perceptibles —
  ce n'EST PAS la bouillie illisible que la règle visait à éviter. L'écart est donc réel sur la conformité
  au nom du mode utilisé, mais ne se traduit pas clairement par le défaut visuel documenté.
- **Technique arsenal** : deux options à trancher par Aziz, pas à choisir seul : (1) passer
  `ph1Fullscreen={true}` dans `Root.tsx` pour se conformer strictement (mode fullscreen opaque, la carte AES
  disparaît complètement 22.7s) — le composant supporte déjà cette prop, non branchée ; (2) si le rendu
  actuel est jugé suffisamment bon (ce qu'il semble être), documenter une EXCEPTION explicite dans la
  grammaire pour ce cas précis plutôt que de laisser un mode banni actif sans décision. Alternative : migrer
  vers `WarMapDimmedOverlay` (section 6, AUTORISÉ, voile fort + trou dans les contours) qui est le template
  validé pour ce cas d'usage exact ("institution AES = acte non-ancré géographiquement").
- **Effort** : moyen (changer le mode + valider le stagger des blocs qui pourrait devoir s'adapter).
- **Impact** : moyen (règle non-négociable actée après un rejet explicite, mais ici le symptôme concret ne
  se matérialise pas à l'écran — impact de conformité, pas de qualité perçue).
- **Risque** : moyen si bascule fullscreen — un fullscreen de 22.7s "tue" la carte plus longtemps ; à
  comparer aux deux rendus avant de trancher, pas à changer aveuglément.

### A3 · IMPACT MOYEN · EFFORT FAIBLE — Quelques silences de respiration non couverts (dont 2 pendant l'overlay AES)
- **Timecode** : silences `<-50dB` mesurés à t≈9.98-10.67s (0.69s), t≈21.47-22.28s (0.81s), t≈52.68-53.27s
  (0.59s), t≈72.88-73.66s (0.78s), t≈75.77-76.59s (0.82s).
- **Constaté (audio)** : mean -19.9dB (sain, cohérent avec P1/P2), mais 5 fenêtres de silence total >0.5s.
  Les 2 premières tombent PENDANT l'overlay AES (t≈10-22s, cascade des drapeaux + citation du pacte) — le
  moment le plus "institutionnel" de la scène, qui n'a pourtant aucun son de ponctuation (le starburst/flash
  d'union visuel au climax convergence reste muet). Les 3 dernières tombent sur des respirations de
  narration entre phases (retrait ONU→offensive FAMa, reprise Kidal→Moura) déjà entourées de SFX ponctuels
  proches (whoosh f8132, impact f8140) mais pas continus sur la fenêtre exacte du silence.
- **Technique arsenal** : ⛔ PAS de `tension-drone` (banni). Combler avec : la musique de fond
  (`score-epic.mp3`) vérifiée en lit continu sur toute la durée P3 (si elle chute sous un seuil pendant ces
  fenêtres, remonter légèrement son volume plutôt qu'ajouter un nouveau son) + un `sfx-map-ping`/starburst
  discret au climax convergence Liptako (t≈16-17s, l'`unionFlash` du code claque visuellement mais reste
  muet) + éventuellement un ink-spread doux sur le sillage bleu qui se révèle (Ph6-7).
- **Effort** : quick win pour les pings ponctuels ; moyen pour vérifier/étendre la musique en continu.
- **Impact** : moyen (symptôme récurrent déjà documenté sur P1/P2 — candidat à un traitement TRANSVERSAL
  plutôt que scène par scène, cf. agent transversal).
- **Risque** : faible si le plancher bas (≤0.12-0.15) déjà établi ailleurs est respecté.

### A3bis · IMPACT MOYEN · EFFORT MOYEN — Plateau Moura quasi figé ~15-18s : violation D-0 masquée par le drone (A1)
- **Timecode** : F_MOURA (8580, t=82.1s) → F_REPOUSSE (9121, t=100.1s), soit 541 frames ≈ 18s.
- **Constaté (code + frames)** : `mouraDesat` (le voile sépia) monte à 1 en ~20 frames après F_MOURA puis
  RESTE À 1 jusqu'à `F_REPOUSSE-60` (soit encore ~16s de plateau) avant de redescendre dans les 2 dernières
  secondes. Le `shock` (onde de choc grave sur la tache) ne dure que 55 frames (1.8s) après F_MOURA, puis plus
  aucune transformation visuelle nouvelle ne se produit jusqu'à Ph9 — confirmé par 4 frames extraites à
  t=90/94/96/97/100s : la tache de sang, le halo et le cadrage caméra sont VISUELLEMENT IDENTIQUES sur toute
  la fenêtre (seul le drift sinusoïdal ±0.05°/±0.035° de `getPartie3Cam` bouge, quasi imperceptible). C'est
  une violation directe de `WARMAP-GRAMMAIRE.md` D-0 (*« JAMAIS 5 secondes sans mouvement visible… règle n°1,
  un beat qui la viole est à refaire »*) : ici c'est ~16s, soit plus de 3x le seuil. **Ce plateau a
  probablement toujours "fonctionné" à l'oreille grâce au `tension-drone` (A1)** qui occupe l'espace sonore et
  masque le vide visuel — une fois le drone retiré (correction A1 recommandée), le manque de mouvement va
  devenir plus perceptible, pas moins. Les deux points sont donc COUPLÉS : ne pas corriger A1 seul sans
  traiter ce point, sous peine d'aggraver la perception du plateau mort.
- **Technique arsenal** : le sujet (Moura, 500+ morts documentés ONU) reste volontairement sobre (Q2 du
  DA-brief : « pas de pulse d'alarme répété ») — ne PAS ajouter de pulse. Meubler SANS sur-dramatiser :
  (a) un très léger travelling caméra continu (Ken Burns D-2, quelques px/s au lieu du drift quasi nul actuel) ;
  (b) une respiration lente de l'opacité du halo sépia au lieu d'un plateau fixe à 1 ; (c) la plaque
  "MOURA · MARS 2022 · RAPPORT ONU" qui s'écrit en typewriter étalé sur toute la durée du plateau plutôt que
  d'apparaître d'un coup puis rester statique. Choisir UNE seule option pour ne pas réintroduire du bruit sur
  un beat volontairement recueilli.
- **Effort** : moyen (ajustement d'interpolations existantes, pas de nouvel asset).
- **Impact** : moyen (règle D-0 non-négociable, violée sur la durée la plus longue de toute la scène).
- **Risque** : moyen — Aziz a validé Q2 ("pas de pulse d'alarme") ; toute correction doit rester SOBRE,
  registre "gravité clinique", pas du spectacle.

### A4 · IMPACT FAIBLE-MOYEN · EFFORT MOYEN — Le sceau AES / mix-and-match SVG (acquis Acte1 du 27/06) n'a pas d'écho dans P3
- **Timecode** : Ph1-Ph2 (t=0-22s, naissance de l'AES) — le moment thématiquement le plus proche du sceau
  AES de l'Acte 1 refait.
- **Constaté (comparaison Acte1 vs P3)** : l'Acte 1 refait (2026-06-27) introduit un sceau AES central +
  flash or (SVG génératif, `Acte1IntroSlam`) comme signature visuelle forte de l'union des 3 pays. P3
  raconte le MÊME événement fondateur ("16 septembre 2023 · Charte du Liptako-Gourma") avec un dispositif
  différent et antérieur (convergence de 3 lignes or + starburst + zone qui pulse, cf. frames t=3s/12s/16s)
  — un dispositif qui FONCTIONNE bien en soi, mais crée une incohérence de SIGNATURE VISUELLE entre les deux
  scènes qui racontent le même événement : l'Acte 1 a un sceau identifiable, P3 n'en a pas d'écho direct.
- **Technique arsenal** : envisager un BREF rappel du sceau AES (même asset SVG que l'Acte 1) au moment du
  starburst Ph2 existant (F_LIPTAKO, climax causal déjà là) — pas un remplacement du dispositif carte actuel
  (la convergence des 3 lignes reste la bonne technique causale/spatiale), un simple callback visuel de
  cohérence. Alternative plus prudente : ne rien changer, le dispositif actuel étant déjà solide et cet
  ajout relevant du raffinement de marque, pas de la correction de défaut.
- **Effort** : moyen (intégrer + tester en isolation avant d'incruster). **Impact** : faible-moyen.
- **Risque** : moyen — Ph1-2 est déjà dense (overlay + contours + convergence + starburst) ; tester en
  mini-render isolé avant d'intégrer, uniquement si Aziz juge la cohérence de signature importante.

### A5 · IMPACT FAIBLE — `WarMapBanner` (drapeaux plantés réels, acquis Acte1) absent des 3 capitales AES
- **Timecode** : Ph1 (0-22s) — les 3 capitales BAMAKO/OUAGA/NIAMEY s'allument (contour or) mais aucun
  drapeau physique planté n'apparaît sur elles, contrairement à l'Acte 1 refait qui utilise `WarMapBanner`
  sur les mêmes 3 capitales pour son hook.
- **Constaté (code)** : P3 utilise `countryOutline()` (contours qui virent or) + les icônes rondes plates du
  bloc `tokens` de l'overlay (`flagFile: ml.png`, etc.) — cohérent avec le fait que P3 a été codée avant que
  `WarMapBanner` existe. Ce n'est PAS un manque de lisibilité (le contour-or + l'overlay disent déjà
  clairement "les 3 pays s'unissent"), plutôt un gain POSSIBLE de cohérence visuelle transversale (même
  geste "drapeau planté" au hook Acte1 et ici).
- **Technique arsenal** : `WarMapBanner` avec `hideAt` pourrait compléter le contour-or sur les 3 capitales
  au moment de l'union.
- **Effort** : moyen (3 instances + gestion du hideAt avant transition Kidal). **Impact** : faible (cosmétique).
- **Risque** : moyen — Ph1 a déjà une densité élevée (overlay + contours + convergence + sceau) ; ne pas
  ajouter par défaut, arbitrer avec Aziz d'abord. **Impact jugé plus faible que A1-A4** : contrairement au
  résidu tension-drone (bug factuel) ou au mode overlay banni (non-conformité doctrine), c'est un pur
  raffinement de cohérence de marque sur une scène déjà validée.

---

## (B) DÉJÀ BON — NE PAS CASSER

- **Grammaire causale de bout en bout** (le point le plus fort de P3) : convergence des 3 capitales → sceau
  Liptako (cause→effet visible, pas de pop) ; retrait ONU (fade + drift Y, pas un cut sec) → PUIS avancée
  FAMa/Africa Corps (raccord causal exact, démarre PENDANT le retrait) ; sillage bleu révélé DERRIÈRE les
  jetons (inversion chromatique rouge P2→bleu P3 = idée narrative forte, "l'État reprend pour une fois") ;
  drapeau malien qui se hisse bas→haut (causal) ; attaques 2026 = jihadiste charge → FAMa bloque
  physiquement → repoussé (démonstration par la vision, sans flèche ni plaque). Modèle d'application de
  `WARMAP-GRAMMAIRE.md` §1 et §3 — **à conserver et réutiliser comme référence pour d'éventuelles refontes P1/P2.**
- **Contours nationaux colorés (Mali ocre / Burkina brique / Niger sarcelle)** : CONFIRMÉS présents et
  visibles au rendu réel (frames t=3s/12s/16s/33s/40s), pas seulement dans le code — le doute du STATUS
  ("à confirmer via render full HD") est LEVÉ, résolu. Le contour Kidal qui vire sable→bleu à la reprise
  (`countryOutline` + `lerpHex`) est une belle idée causale. **Garder.**
- **Pictogrammes de faction (chevrons/losange/étoile)** : lisibles au zoom réel de la scène (frames
  t=44s/51s/58s/65s/69s/102s), contrairement à la crainte initiale qu'ils soient trop petits. Le vocabulaire
  (mil/merc/armed) fonctionne pour distinguer FAMa/Africa Corps/touaregs/jihadistes d'un coup d'œil. **Garder.**
- **Board clearing sur le drapeau touareg → drapeau Mali** : à la reprise de Kidal (t=69s), les 2 anciens
  jetons touaregs restent visibles en FANTÔME (opacity réduite) au lieu de disparaître brutalement —
  exactement la discipline R-V1 de `WARMAP-GRAMMAIRE.md`. **Garder.**
- **Drapeau touareg (Azawad) ondulant planté sur Kidal (Ph5)** : SVG ondulant, ambiant, sort à l'approche
  FAMa — P3 a en fait PRÉFIGURÉ le geste "drapeau planté" avant que la technique soit généralisée en
  `WarMapBanner` pour l'Acte 1. **Garder tel quel** (le refaire en `WarMapBanner` DOM serait une régression
  de contrôle fin sur le clip-path ondulant spécifique à ce cas).
- **Moura (Ph8) — sobriété du dispositif visuel** : fondu sépia global + tache de sang abstraite (bords
  irréguliers, halo statique + 1 ripple grave, aucun visage, aucun chiffre géant) + plaque sourcée
  "MOURA · MARS 2022 · RAPPORT ONU" = gravité clinique, fidèle à la doctrine "abstraction pure" validée 3
  voix. **Garder** (seul le SFX drone associé est à retirer, A1).
- **Attaques 2026 (Ph9)** : cadrage large montrant clairement le jeton FAMa qui bloque le jihadiste au nord +
  second engagement plus loin, sceau Mali visible en arrière-plan — lisible, sans flèche ni texte parasite.
  Fidèle à "démonstration par la vision". **Garder.**
- **Fin de scène (f9410)** : plan épuré, sceau/losange Mali flottant seul, aucun débordement vers P4 —
  raccord P3→P4 vérifié propre au niveau frames (F_START P4 = 9416, juste après F_END P3 = 9410). **Garder.**
- **Ville-forteresse Kidal (sprite Gemini)** : ancrage fort, reste toute la durée de la scène après son
  apparition, sert de repère visuel stable. **Garder.**
- **Plaques élaguées** : chaque plaque de nom vit pour SON moment puis disparaît (KIDAL, KIDAL REPRISE,
  MOURA) — pas de surcharge de labels permanents. **Garder.**
- **Niveau audio global** : mean -19.9dB / max -1.0dB, pas de saturation, cohérent avec le mix P1/P2. Le
  problème n'est pas le niveau global, ce sont les quelques trous ponctuels (A3). **Garder le mix de base.**

---

## TECHNIQUES DE L'ARSENAL VOLONTAIREMENT ÉCARTÉES (et pourquoi)

- **Pitch 3D Mapbox** : déjà tranché ÉCARTÉ ("cosmétique sans relief") — cohérent, ne pas ré-ouvrir.
- **PixelLab organique (fumée/explosion)** : déjà tranché ÉCARTÉ ("jure avec jetons réalistes") — confirmé
  cohérent au visionnage (le registre jetons dessinés + SVG encre est homogène ; un effet PixelLab dénoterait).
- **Plein écran généralisé** : déjà tranché ÉCARTÉ ("réservé P4") — P3 reste à raison 100% carte, sauf le cas
  A2 (overlay Ph1) qui est justement le SEUL endroit où un passage fullscreen serait légitimé par la
  doctrine (institution non-ancrée géographiquement).
- **`tension-drone` comme solution aux silences (A3)** — RAPPEL EXPLICITE (contrainte non-négociable actée
  par Aziz) : ce SFX est banni de tout le projet depuis le 2026-06-27, quel que soit le manque de lit sonore
  constaté. Pour A1 (résidu Moura) la solution est le RETRAIT ; pour A3 (silences), la solution est des SFX
  ponctuels ou un réglage de la musique de fond — jamais un drone continu, même court.

---

## CE QUE JE N'AI PAS PU JUGER (→ validation Aziz)

- **Perception audio fine** : je mesure des niveaux (RMS/dB/silencedetect), je n'entends pas le mix réel au
  casque. Le dosage exact des micro-silences (A3) et la gêne réelle du `tension-drone` sur Moura avant son
  retrait (A1) sont des jugements d'oreille, pas de mesure.
- **Le choix fullscreen vs semitransp pour l'overlay AES (A2)** : j'ai constaté que le rendu réel actuel
  n'est PAS une bouillie illisible malgré le mode banni, mais je ne peux pas trancher si Aziz préfère malgré
  tout la conformité stricte (passer fullscreen, "tuer" la carte 22.7s) ou accepter une exception documentée
  du statu quo. Arbitrage de goût/doctrine, pas un fait technique.
- **Valeur ajoutée réelle d'un rappel du sceau AES Acte1 dans P3 (A4)** et **de `WarMapBanner` sur les
  capitales (A5)** : je note les incohérences de signature/geste entre les scènes, mais je ne peux pas juger
  si Aziz les perçoit comme gênantes en visionnage CONTINU (Acte1→P1→P2→P3) — à confirmer sur la concat
  complète, pas sur P3 isolée (règle du projet : "juger le livrable réel" ; ici P3 seule n'est qu'un sous-clip).
- **Triggers exacts vs render** : la correspondance frame-code est fiable ici (durée exacte 109.78s = calcul
  théorique (9410-6118)/30fps, contrairement à P1 dont le render était un subclip approximatif) — mais je
  n'ai pas revérifié CHAQUE trigger individuellement contre `narration-v5-alignment.json`, seulement les
  timecodes structurants cités dans le code.
- **Raccord P2→P3 (flèches CEDEAO)** : confirmé par lecture du code P3 (Ph1, commentaire "les flèches CEDEAO
  héritées P2 se BRISENT") que ce raccord DÉPEND directement de la correction A2/A3 de
  `AUDIT-AMELIORATIONS-P2.md` (flèches CEDEAO jamais bien montrées en P2). Je n'ai pas re-vérifié ce point en
  le rejouant sur un render concaténé — c'est un rappel de dépendance inter-scènes, pas une nouvelle mesure
  indépendante.
- **Clash précis Ph9 (F_REPOUSSE→F_REPOUSSE+158, t≈100.1-105.4s)** : mes frames à t=102s/108s montrent le
  résultat du clash (FAMa qui tient, jihadiste repoussé) mais pas forcément l'instant exact de contact
  (`clashAt`) — la qualité du "choc" au frame précis n'a pas été vérifiée image par image.
