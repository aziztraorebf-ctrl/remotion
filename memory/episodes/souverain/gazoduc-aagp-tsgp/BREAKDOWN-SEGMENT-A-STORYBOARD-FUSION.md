# Segment A (carte TSGP) — breakdown fusion storyboard (2026-08-13)

> Fusion faite par Claude (pas un 3e appel image) à partir de 2 sources visuelles + 1 source caméra,
> toutes générées le même jour lors d'un exercice storyboard dédié. Sources :
> - **Visuel géré/financement** : Gemini Concept 2 (`gazoduc-carte-storyboard-ref/v3-separes/concept2-zoom-terrain.png`)
> - **Visuel paradoxe final** : Gemini Concept 3 (`gazoduc-carte-storyboard-ref/v3-separes/concept3-double-destin.png`)
> - **Annotations caméra** : GPT Image 2 Concept 2 (`gazoduc-carte-storyboard-ref/storyboard-concepts-gpt-v1.png`, panneau "CONCEPT 2")
>
> Repartir de `GazoducActe3CarteTSGP.tsx` existant (mécanisme caméra `camFor(center, scale)` +
> interpolation `Cam` déjà en place, 5 mouvements déjà validés côté rythme par les 4 agents du
> 2026-08-07 — cf `PLAN-ACTES2-5.md` § TEST STUDIO RÉUTILISABLE, NE PAS refondre le squelette caméra,
> seulement les ÉLÉMENTS VISUELS posés dessus).

## Ce qui change vs le rendu actuel (v2)

| Élément | Actuel (v2) | Nouveau (fusion storyboard) |
|---|---|---|
| Comparateur "13 Mds$" | rectangle plat HUD | conservé (déjà bon), mais accompagné du geste financement ci-dessous plutôt qu'isolé |
| Chantier Adrar | pas d'insert visuel dédié (juste le tracé qui passe) | insert flat-vector simple (pas 3D) + geste "argent qui coule" |
| Paradoxe final (Maroc vs Algérie) | split-screen séparé, 2 `<svg>`, jauges rectangulaires plates | **supprimé en tant que scène séparée** — fondu DANS la carte déjà tracée (voir Beat 4) |

## Séquence complète (4 beats, reprend la numérotation Mouvement 1-5 existante)

### Beat 1 — Trajet Nigeria→Niger→Algérie (Mouvements 1-3 existants, INCHANGÉS)
Rien à changer ici — déjà validé par les 4 agents (rythme caméra pas le problème). Le tracé
`strokeDashoffset` continue de se dessiner sous la caméra qui suit ("traveling le long du tracé, la
ligne se dessine sous la caméra" — annotation GPT C2 panneau 1-2), zoom serré Nigeria → dézoom Sahara.

### Beat 2 — Chantier Adrar avec geste financement (fusion Gemini C2 + annotation GPT "pause courte sur Adrar")
Reprend le **Mouvement 4** existant (`camAdrarAggressive`, zoom x6.5 sur l'Algérie) mais AJOUTE :
- **Micro-pause caméra explicite** sur Adrar (GPT : "pause courte sur Adrar, vignette, le reste
  s'assombrit") — utiliser le `darkenOverlay`/vignette déjà utilisé sur le Segment B (aéroport) pour
  assombrir le reste de la carte pendant ce beat, focaliser l'œil sur Adrar seul.
- **Insert chantier flat-vector** (PAS 3D comme le rendu Gemini C2 — aplatir en pur SVG géométrique,
  cohérent avec le reste de la carte) : petite pelleteuse + tranchée schématique, ancrée au point Adrar.
- **Geste "financement qui coule"** (l'idée la plus forte de Gemini C2, à garder telle quelle dans le
  principe) : 2-3 icônes `$`/pièce qui descendent VISUELLEMENT le long du tracé, depuis les pins
  Algérie ET Nigeria (pas juste un seul), convergeant vers Adrar — remplace le besoin d'un texte
  "financement étatique" explicite, le mouvement visuel porte le message "les États eux-mêmes payent".
  Utiliser `interpolate` sur une position le long du path du tracé (déjà fait ailleurs dans le projet
  pour des éléments qui suivent un `strokeDasharray`).
- Le comparateur "13 Mds$" (déjà bon en HUD) apparaît APRÈS ce geste, pas avant — la preuve visuelle
  (l'argent qui vient des 2 capitales) précède le chiffre, pas l'inverse.

### Beat 3 — Dézoom comparateur (Mouvement 5 existant, INCHANGÉ)
Le dézoom qui laisse respirer le dispositif jetons/comparateur reste tel quel.

### Beat 4 — Paradoxe intégré SUR LA CARTE (remplace `GazoducActe3InsertParadoxe.tsx` split-screen)
**Changement structurel le plus important** : au lieu de couper vers un fichier séparé
(`GazoducActe3InsertParadoxe.tsx`, 2 `<svg>` indépendants), le paradoxe se joue sur LA MÊME carte déjà
tracée, dans le prolongement direct de Beat 3 — pas de cut, pas de nouveau plan.
- Reprend fidèlement Gemini Concept 3 : le tracé TSGP (Nigeria→Niger→Algérie) déjà visible passe d'un
  glow doré stable à un glow **orange-rouge qui vacille** (utiliser la fonction `deathFlicker` déjà
  écrite dans `GazoducActe3InsertSecurite.tsx` — réutilisable telle quelle, même principe de
  vacillement organique) + petits triangles d'alerte qui apparaissent en stagger le long du tracé
  (zones de conflit).
- Le tracé rival Maroc (actuellement absent de cette carte — à vérifier s'il existe déjà en "ghost"
  ailleurs dans le fichier, cf la piste "ghost AAGP en filigrane" déjà notée comme option non tranchée
  dans `PLAN-ACTES2-5.md` § Q1) apparaît EN PARALLÈLE en glow doré stable et continu — le contraste de
  texture entre les 2 tracés (stable vs vacillant) EST le paradoxe, sans texte explicatif long.
- Annotation caméra GPT à reprendre : **whip-pan léger ou glissement ouest-est** entre le début du
  tracé Maroc (si visible) et la zone Adrar/conflit, pour guider l'œil d'un destin à l'autre sans cut.
- 2 labels courts MAXIMUM sur cet écran (cohérent avec la règle "minimal on-map text" du dernier
  brief) : un mot-clé par tracé si nécessaire ("PACIFIÉ" / "ZONE ACTIVE"), pas de paragraphe de bilan.

## Points tranchés (2026-08-13, après vérification code + décision Aziz)

1. **Tracé Maroc/AAGP** : CONFIRMÉ déjà dessiné — `GazoducActe3CarteTSGP.tsx` ligne 366, filigrane doré
   `strokeOpacity={0.16 * continentReveal}` sur tout le tracé AAGP. Pas besoin de l'ajouter pour Beat 4 —
   vérifier seulement si 0.16 est assez visible pour le contraste stable/vacillant voulu à ce moment
   précis (augmenter localement au Beat 4 si besoin, pas globalement).
2. **Comparateur financier "13 Mds$"** : DÉCISION AZIZ — passer au cadran circulaire (convergence
   Gemini + GPT, indépendants). Remplace le rectangle HUD plat actuel.

## ⛔⛔ VERDICT AZIZ SUR LE V3 CODÉ (2026-08-14) — REJETÉ, retour en arrière sur une règle déjà actée

Rendu complet visionné à vitesse réelle (pas juste frames figées) : **rejeté, jugé pire que l'existant**.
Défauts précis identifiés :
1. **Comparateur "13 Mds$" et icônes banques en coin d'écran/bordure** = exactement le travers que la
   règle DA-brief du 2026-08-04/07 interdisait déjà ("Financement/banques = dispositif SUR la carte,
   jamais un widget coin d'écran" — ligne 393 plus haut dans ce fichier). Le code v3 a régressé sur ce
   point malgré la règle déjà écrite.
2. **Labels "PACIFIÉ"/"ZONE ACTIVE" flottent dans l'océan**, sans aucun support visuel (pas de carte/chip
   derrière) — illisible, amateur.
3. **Insert pelleteuse réduit à une icône posée sur la carte**, pas un vrai insert composé (carte
   assombrie + vignette dans un cadre) comme le breakdown le demandait pourtant.
4. **~15-22s de quasi-immobilité en tout début de segment** (Mouvement 1, zoom Nigeria) — CONFIRMÉ
   préexistant au fichier de base (commentaire code "≈22.2s réel"), pas introduit par cette session,
   mais jamais repéré/signalé avant ce visionnage complet. Le texte narré à ce moment ("part du Nigeria")
   ne couvre que quelques mots pour 22s d'écran — trou de contenu visuel réel.

**Cause racine identifiée par Aziz** : le breakdown texte (même détaillé) ne suffit pas à garantir une
BONNE composition d'écran — le storyboard GPT Concept 1 lui-même montrait déjà ce travers en germe
(icônes dispersées aux 4 coins de l'écran sur son panneau "PARADOXE FINAL") et le breakdown ne l'a pas
corrigé avant de coder. **Décision : repartir d'un nouveau storyboard GPT, découpé en 4 appels séparés
(un par beat narratif : trajet/chantier/financement/paradoxe, cf timing exact `GazoducActe3Timing.ts`
`traceNigerStart`/`pelleteusesStart`/`coutEmphaseStart`/`financementEtatsEnd`), chacun en pleine
résolution, avec un brief de composition renforcé (6 règles non-négociables : jamais d'élément flottant
sans support visuel, tout centré/ancré-carte jamais dispersé aux bords, overlays composés véritables,
rien de statique >5s) AVANT de recoder quoi que ce soit.** Nouveaux briefs : `/tmp/appel{1-4}-*.txt`
(session 2026-08-14), résultats attendus dans `gazoduc-carte-storyboard-ref/v4-gpt-4beats/`.

**Ne PAS repartir du code v3 actuel** (`GazoducActe3CarteTSGP.tsx` déjà modifié) sans revoir le
storyboard d'abord — le code sera très probablement réécrit une 2e fois après le nouveau storyboard.

## ⭐⭐⭐ V4/V5 — 2e passage storyboard GPT (2026-08-14), VERDICT : libre créative >> prescriptif

Suite directe du rejet v3 codé ci-dessus. 2 nouveaux essais storyboard GPT Image 2, 4 appels séparés
chacun (1 par beat narratif : trajet/chantier/financement/paradoxe, découpage sur les timestamps réels
`GazoducActe3Timing.ts`), tous avec les 6 règles de composition + règle anti-surcharge texte
(labeliser SEULEMENT les pays narrativement pertinents, jamais toute la liste des pays traversés) :

- **V4 (prescriptif, mise en scène dictée panel par panel)** : bon, corrige les défauts du v3 codé,
  mais reste conventionnel. Images : `gazoduc-carte-storyboard-ref/v4-gpt-4beats/beat{1-4}-*.png`.
- **V5 (libre créative — SUPÉRIEUR, retenu comme base)** : structure légère 3-états seulement
  (état de départ → point de bascule → état final) + narration, GPT invente sa propre mise en scène.
  Résultat nettement plus riche et original que le prescriptif : jauge % de chantier avec date exacte
  (Beat 2), robinet central comme symbole du flux financier + comparateur "13 Mds$/x2 moins cher/
  autofinancé" en un seul bloc compact (Beat 3), et surtout Beat 4 qui matérialise le paradoxe par
  divergence visuelle pure du même tracé (Maroc doré stable vs Algérie qui devient rouge avec icônes
  bouclier le long du trajet, "contraste lisible sans explication" — exactement l'objectif recherché).
  Images (à regarder EN PREMIER la prochaine session) :
  `gazoduc-carte-storyboard-ref/v5-gpt-libre/beat{1-4}-*-libre.png`.
  **Prompt squelette réutilisable** (celui qui a produit ces 4 résultats, à adapter pour un futur beat/
  segment carte) : `episodes/souverain/gazoduc-aagp-tsgp/PROMPT-SQUELETTE-STORYBOARD-LIBRE-CREATIVE.txt`.
  ⚠️ Gotcha technique rencontré : le 1er essai de ce prompt (formulation "TASK: Show 2-3 panels...")
  a fait dériver GPT vers une RÉPONSE TEXTE (description narrative très riche, mais zéro image générée)
  au lieu d'un rendu — corrigé en forçant explicitement "GENERATE AN IMAGE (not a text description)"
  dans la tâche. Vérifier TOUJOURS que `openrouter-img2img.py` a bien produit un `.png` et pas seulement
  un `.response.json` avant de considérer un appel storyboard réussi.

**Leçon méthode confirmée** : sur ce type de tâche (storyboard visuel), donner à GPT une structure
LÉGÈRE (3 états) plutôt qu'un script panel-par-panel produit un résultat plus riche et surprend avec
des idées qu'on n'avait pas — cohérent avec la doctrine `STORYBOARD-MAPBOX.md` § "GUIDER SANS BRIDER"
déjà écrite pour Mapbox, maintenant confirmée aussi sur D3/GPT Image 2.

### Points ouverts pour la PROCHAINE SESSION (à traiter avant de recoder)

1. **Positionnement des inserts en format horizontal 16:9** : Aziz observe que plusieurs inserts (V5
   Beat 2/3/4) sortent LATÉRALEMENT du cadre carte plutôt que de rester centrés/superposés — bon dans
   l'esprit (overlay composé) mais la caméra semble devoir "se balader" à droite/gauche pour les
   atteindre.
   **⭐ AVIS CLAUDE (2026-08-14, tranché) :** vrai problème de composition, pas un non-sujet du 16:9.
   Le pattern "panneau latéral qui pousse la carte sur le côté" vient probablement d'un biais
   d'entraînement du modèle (habitué aux infographies où panneau latéral = pattern par défaut), mais
   ça va CONTRE la règle 1 ("cartographie d'abord") — dès qu'un insert pousse la géographie plutôt que
   de se superposer dessus, la carte perd sa place de protagoniste visuel. **Recommandation pour le
   prochain prompt de storyboard : ajouter explicitement "insert overlays the map, never pushes it
   aside" dans les règles non-négociables.** Le 16:9 donne de la largeur, mais ce n'est pas une raison
   d'étaler du contenu sur les bords — mieux vaut un insert centré/superposé avec carte assombrie
   derrière (comme le Segment B aéroport le fait déjà bien) qu'un insert qui gagne de la place en
   repoussant la carte.
2. **Densité de texte par insert** (ex: Beat 3 financement — plusieurs infos empilées dans un seul
   bloc) : risque de surcharge cognitive ("overwhelming" — mot d'Aziz) même si tout est bien composé/
   centré.
   **⭐ AVIS CLAUDE (2026-08-14, tranché) :** pas de règle générale à écrire — à juger insert par
   insert lors du prochain breakdown (point 4 ci-dessous). Le Beat 3 financement (montant + ratio +
   flux + banque barrée dans un seul bloc) est probablement le cas limite le plus chargé parce que
   c'est LE moment du script qui porte le plus d'info factuelle d'un coup — sur-simplifier risquerait
   de perdre le point plutôt que de l'alléger utilement. Le bon réflexe : demander au breakdown (fait
   par le modèle qui a généré l'image, point 4) de juger LUI-MÊME si un insert dense doit être scindé
   en 2 temps successifs (ex: montant+ratio d'abord, puis flux+banque après) plutôt que de trancher ça
   à l'aveugle avant d'avoir vu le détail exact de ce que le breakdown révèle.
3. **Piste NON TESTÉE — inserts en clip H3 stylisé (pas hyper-réaliste) pour le contenu à fort volume
   de détail/mouvement** (ex: chantier à protéger/zone de conflit), réservant le SVG codé pur aux
   inserts simples/iconographiques (ex: financement, comparateurs à base d'icônes nettes). Hypothèse
   à valider : un petit clip H3 (style animé, pas réaliste) qui apparaît DANS le cadre de l'insert
   composé sur la carte — reste à déterminer comment le faire apparaître proprement (poser un clip vidéo
   dans un cadre SVG animé, gérer la boucle/durée vs le temps que l'insert reste visible à l'écran).
   **⭐ AVIS CLAUDE (2026-08-14, tranché) :** idée solide, cohérente avec ce qui a déjà été validé
   cette même session (styles H3 Poster Vector/Whiteboard Doodle sur Anansi/Nyame — on sait déjà
   générer ce type de clip animé stylisé). Le vrai défi n'est PAS la génération (déjà maîtrisée) mais
   l'INTÉGRATION : poser un clip vidéo dans un cadre SVG déjà animé sur la carte, et gérer sa
   boucle/durée par rapport au temps où l'insert reste visible à l'écran (ex: si l'insert reste 4s
   mais le clip H3 dure 8s, faut-il boucler, couper, ou générer exactement à la bonne durée dès le
   départ ?). C'est un chantier technique distinct à tester isolément (pas dans le même passage que le
   recodage du Segment A) — bon que ce soit resté une piste et pas une décision, il ne faut pas
   bloquer le recodage du Segment A dessus.
4. **Prochaine étape actée** : lancer un breakdown JSON COMPLET via GPT Image 2 sur CHAQUE image V5
   retenue (celle qui a généré l'image = celle qui breakdown, elle connaît exactement ce qu'elle a
   voulu dessiner — ne PAS faire deviner Claude). Objectif du breakdown : zéro ambiguïté sur ce qu'il
   faut générer (quel élément = image/SVG/H3, quelles couleurs exactes, quel texte exact) — le
   breakdown doit être exploitable directement, pas à interpréter.

## Reste à trancher plus tard (pas bloquant pour coder Beat 1-4)

3. **Suppression du fichier `GazoducActe3InsertParadoxe.tsx`** : si Beat 4 ci-dessus est codé et
   validé avec succès, ce fichier devient obsolète (le paradoxe vit désormais dans
   `GazoducActe3CarteTSGP.tsx`) — à confirmer avec Aziz APRÈS avoir vu le nouveau rendu, ne pas
   supprimer avant.

## Assets de référence (tous dans `memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/gazoduc-carte-storyboard-ref/`)
`v3-separes/concept2-zoom-terrain.png` · `v3-separes/concept3-double-destin.png` ·
`storyboard-concepts-gpt-v1.png` (annotations caméra, panneau CONCEPT 2 principalement) ·
`carte-frame2100.png` (référence du rendu actuel, pour comparaison avant/après).
