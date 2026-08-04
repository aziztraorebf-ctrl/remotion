# Gazoduc AAGP vs TSGP — STATUS

**Mis à jour** : 2026-08-04

## État — ACTE 2 EN COURS — SESSION 2026-08-03 INTERROMPUE, REPRISE À FAIRE (session fraîche)

**Pivot doctrinal tranché par Aziz (2026-08-03)** : l'Acte 2 n'est PAS une seule scène carte. C'est
**3 segments distincts** qui s'enchaînent au montage :
1. **INSERT SVG narratif "signature"** (~genèse 2016 + signature du traité, PAS un beat carte —
   aucun ancrage géo fort requis pour ce sens).
2. **SEGMENT CARTE COURT (~25-30s, PAS 2min18)** — D3 plate, montre SEULEMENT le tracé physique
   AAGP (Nigeria→Maroc→traversée Europe), à jouer APRÈS l'insert signature. ⛔ Erreur commise en
   session précédente : j'ai rendu et présenté le FICHIER COMPLET (4165 frames = 2min18, avec 2
   placeholders bleus pour les inserts intégrés dedans) au lieu d'un segment court isolé. Citation
   Aziz : *"tu as créé une carte de 2 minutes 18 alors que ce que je t'ai dit c'est que nous allions
   créer la carte de la scène, spécialement qu'elle arrivait après le SVG [...] Le modèle de la
   carte [...] ne devrait pas faire plus de 25 secondes. Je pense 30 secondes avec la carte qui
   montre le tracé."* → **à refaire en session suivante, plus simple, plus court, isolé.**
3. **INSERT SVG narratif "financement"** (accord manquant, tuyaux virtuels, Mauritanie — même
   logique, pas d'ancrage géo fort).

**Nouvelle idée visuelle à intégrer sur le segment carte (pas encore codée)** : pendant le tracé,
remplacer les `CountryLabel` (noms de pays fixes qui restent à l'écran) par des **géoplaques qui
apparaissent et fade** aux points d'arrêt du tracé — réutiliser la technique géoplaque déjà connue
du projet plutôt que des labels statiques. Citation Aziz : *"durant le tracé on devrait mettre des
petits points qui représentent les points d'arrêt. Peut-être [...] réutiliser les géoplaques qui
apparaissent et fade, au lieu de juste avoir les noms des villes qui restent sur place."*

**Pipeline SVG génératif comparatif lancé (2026-08-03)** — 2 scènes (signature + financement) × 2
techniques de brief testées :
- **Brief "dirigé"** (5 groupes `<g id>` imposés) sur 5 modèles : Fable 5, Gemini 3.1 Pro, GPT-5.6
  Sol, GLM-5.2, Kimi K3.
- **Brief "liberté créative"** (registre + exigence narrative + interdits, SANS dicter les éléments)
  testé sur **Fable 5 seulement** pour l'instant — résultat jugé visuellement plus riche que le
  dirigé (confirmé sur les 2 scènes).
- **12 SVG + 8 JSON sauvegardés** dans
  `memory/episodes/souverain/gazoduc-aagp-tsgp/svg-inserts-acte2-candidats/` (copie persistante,
  l'original `out/_rnd/gazoduc-svg-inserts/` sera purgé en fin de session).
- **Résumé des 2 versions Fable "liberté créative"** (les plus prometteuses à ce stade) :
  - `signature-fable-libre.svg` : moment JUSTE APRÈS la signature (pas le geste de signer) — sceau
    doré déjà posé et rayonnant sur le traité, plume reposée à côté, 15 bannières anonymes en arc
    (15 chefs d'État signataires, sans visages/drapeaux identifiables). Élément clé : le tracé du
    pipeline est dessiné EN POINTILLÉS DORÉS DIRECTEMENT SUR LE DOCUMENT (pas sur une carte), départ
    plein / arrivée creuse = objectif pas encore atteint. Pierre fantôme quasi effacée en bas à
    gauche = rappel discret de la genèse 2016.
  - `financement-fable-libre.svg` : métaphore "matérialisation qui s'interrompt en plein vol" — le
    même tuyau vu sur la carte apparaît PLEIN/réel à gauche (riveté, pylônes ancrés), puis après une
    jonction rompue (boulons en apesanteur, halo = point de bascule), redevient un PLAN D'INGÉNIEUR
    (tirets de plus en plus lâches, cotations techniques, pylônes fantômes ne touchant jamais le
    sol, ligne de terre qui s'efface). 2 touches dorées séparées = les 2 absences : coffre-fort
    ouvert/vide avec pièces en pointillés qui s'évaporent (chéquier jamais sorti) + ligne de
    signature pointillée vers laquelle un stylo hésite sans se poser (accord manquant, probablement
    Mauritanie).

**À FAIRE en session suivante (reprise, dans cet ordre)** :
1. Examiner les 12 SVG candidats (dirigés + Fable libre) → choisir/mix-and-match par scène.
2. **Nouveau test à lancer** : relancer la technique "liberté créative" sur les modèles EXTERNES
   (Gemini 3.1 Pro / GPT-5.6 Sol / GLM-5.2 / Kimi K3), pas seulement Fable 5, pour comparer.
3. Reconstruire `GazoducActe2AAGP.tsx` comme SEGMENT COURT (~25-30s), tracé seul, à jouer après
   l'insert SVG signature — pas le fichier complet actuel (4165 frames). Le fichier actuel garde son
   mécanisme de caméra continue validé (`buildFullPathSamples`/`windowBBox`/`camFor`, palette
   éclaircie `#3a5488`/`#2a3f66`/`#4a608e`/`#e8ecf5`) — c'est la DURÉE et le CONTENU (retirer les
   placeholders inserts) qui doivent changer, pas le mécanisme caméra.
4. Ajouter les géoplaques fade sur les points d'arrêt (remplace `CountryLabel`).
5. Monter les 3 segments (insert signature → carte courte → insert financement) plutôt qu'un fichier
   monolithique.

Décision explicite Aziz de tout reporter : *"je pense que on devrait refaire tout ceci de la
prochaine session. Cette session devient assez chargée, assez longue [...] avec une session plus
fraîche."*

---

## État — ACTE 1 (GLOBE, 84.68s) VALIDÉ COMME BASE DE PRODUCTION ✅

Après le prototypage (8 rounds, review upstream 3 voix) puis PLUSIEURS passes de production complètes
sur `GazoducActe1Hook.tsx` (10 beats, caméra continue refondue sur le modèle `camAt()`/`CamKey`, tracé
AAGP côtier réel via jalons géographiques Nigeria→Maroc, correction factuelle Maroc/Espagne, drapeaux
retardés jusqu'à l'arrivée, overlay échelle km, review downstream 3 voix appliquée), Aziz a validé le
render **v6** comme base de production le 2026-08-03 :
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/acte1-v6-m5QFFUpozes11al9Vs2NxEXfaZkPdU.mp4

**3 points de polish restants, VOLONTAIREMENT reportés à la passe finale** (tous actes assemblés,
pas acte par acte) — détail complet + citations Aziz : `POLISH-TODO-FINAL-RENDER.md`.

Fichier de production : `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe1Hook.tsx` (composition
Root `D3-Gazoduc-Acte1-Hook`). Le prototype `ProtoGazoducGlobeFusion.tsx` (16s) reste la trace du
mécanisme d'origine mais n'est plus le fichier de référence.

**Prochaine étape** : passer à l'Acte 2 (scène-lieu narrative, genèse 2016) — cf `NEXT-ACTION.md`.

---

## Historique (rounds de prototypage, archivé pour trace)

**⛔ POINT NON TRANCHÉ, À DÉCIDER EN PRIORITÉ À LA REPRISE (décision Aziz explicite : ne pas trancher
en fin de session, regard neuf requis)** : les 3 modèles convergent (3/3) pour dire que le
remplissage PLEIN par drapeau réel (Espagne/Algérie, ajouté en Round 8 à la demande d'Aziz) lit
comme amateur ("carte de Risk", "défilé d'emblèmes surdimensionnés"). Solutions proposées
différentes (suppression complète / pastille+halo / flash bref puis désaturation) — voir
`da-brief-acte1-v8-review/SYNTHESE.md` pour le détail. NE PAS appliquer un fix par réflexe sans
qu'Aziz tranche — c'est un changement direct par rapport à sa propre demande.

**Reste de la review upstream (séquençage 85s, dynamisme caméra, hiérarchie du regard) à
appliquer à l'extension du prototype de 16s → 84.68s complètes** — chantier distinct de la question
des drapeaux, détaillé dans `da-brief-acte1-v8-review/SYNTHESE.md`.

**Ce qui fonctionne et est validé visuellement (Aziz)** :
- Zoom caméra ample (scaleMul 1.3→4.1+), jamais figé, sphère+contenu toujours solidaires
  (discipline `globeR` unique — ne jamais réintroduire `GLOBE_R` brut, cf
  [[feedback_globe-d3-scaleMul-doit-piloter-tous-les-cercles-dessines]]).
- **2 tracés distincts** : AAGP (Nigeria→Espagne, arc en S via `windingPathD`, doré) et TSGP
  (Nigeria→Algérie, ligne directe via `arcPathD`, orange pointillé) — démarrent ensemble, TSGP finit
  ~2s avant (trajet plus court, écho au texte "l'un mise sur la vitesse").
- Geste "contour se trace PUIS se remplit" (`PaysTrace`, repris de `GlobeRecitProto.tsx`) sur
  Nigeria, Espagne, Algérie — fill toujours progressif, jamais figé à 1 (bug corrigé, cf
  round 4-5).
- Fond neutre kaki (`t.land`) peint dès la frame 0 sous tout pays pas encore actif à opacité 0.88
  (PAS 0.16-0.42, trop faible pour contraster avec l'océan sombre — bug de contraste diagnostiqué
  à tort comme "mauvais thème" avant d'être correctement isolé comme un problème d'opacité,
  cf retour croisé Kimi+Gemini round 6).
- Vague continentale organique (décalage par distance réelle au Nigeria via `geoDistance`, jamais
  tous les pays au même rythme) — caméra tenue en hold pendant ce geste.
- Champ d'étoiles (140 points, PRNG seed=42 déterministe, repris tel quel de `GlobeRecitProto.tsx`).

**Piste carte plate alternative** (`ProtoGazoducAfriqueComplete.tsx`, compo `RND-ProtoGazoducAfriqueComplete`)
également fonctionnelle et testée en parallèle — palette CFA (bleu-marine/crème, copiée de
`CfaActe2Carte16x9.tsx`), continent africain entier visible, mêmes 2 tracés. Décision Aziz
2026-08-03 : **garder le globe pour l'ouverture** (l'Acte 1 dure ~85s sur tout le texte, un globe
qui ne s'arrête jamais de bouger porte mieux cette durée qu'une carte plate statique) — la carte
plate reste une option pour un acte plus tardif nécessitant plus de précision géographique
(13 pays du tracé détaillé).

**Prochaine étape (reprise)** *(FAIT — voir État en tête de fichier, la transposition a été faite le
2026-08-03, GazoducActe1Hook.tsx est maintenant le fichier de production validé v6)* : transposer/
fusionner `ProtoGazoducGlobeFusion.tsx` en vrai fichier de production pour l'Acte 1, en respectant
le découpage en 12 états du breakdown DA (`da-brief-acte1/BREAKDOWN-ACTE1.md`) et le timing exact
aligné sur `narration.mp3`. Ne PAS repartir du fichier `GazoducActe1Hook.tsx` existant (buggé,
plusieurs itérations ratées avant diagnostic) — repartir du prototype validé.

## État — AUDIO COMPLET ✅
5 parties audio individuellement validées par Aziz (voix Harmonie→GéoAfrique, méthode texte
paragraphes fusionnés + CAPS + tags ciblés, corrections via `scripts/tools/splice-segment.py`),
**concaténées et uploadées** : `out/episodes/gazoduc-aagp-tsgp/narration.mp3` (8min37, mono 44100Hz
uniforme, garde-fou forced-align 1053/1053 mots sur le fichier complet).
Upload : `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/gazoduc-aagp-tsgp/narration-SC6MI24buZKc8Z2HirtddmBDy9WLyu.mp3`
`SCRIPT-V3-VOIX.md` mis à jour avec le texte définitif (tags/CAPS/corrections).
**Prochaine étape = storyboard/timing puis code de la 1ère scène** (plus rien à faire côté audio).

## Fichiers finaux validés (à concaténer)
1. **P1** — `out/_voix-test/p1-harmonie-final-full.mp3` (validé Round 4, aucune correction ultérieure)
2. **P2** — `out/_voix-test/splice-p2/p2-final-v2.mp3` (splice "de longer"→"de suivre" + 2 pauses,
   marges corrigées — Round 11)
3. **P3** — `out/_voix-test/p3-harmonie-final-full.mp3` (validé Round 3, aucune correction ultérieure)
4. **P4** — `out/_voix-test/p4-v3-pause-native-full.mp3` (régénération complète avec `[pause]` native
   + corrections indispensable/demande/rétrécit déjà dans le texte — Round 13, **version finale
   confirmée par Aziz**)
5. **P5** — `out/_voix-test/p5-harmonie-final-full.mp3` (validé Round 5, aucune correction)

## Prochaine étape (session suivante)
Storyboard/timing (forced-align complet déjà fait sur `narration.mp3`, `.alignment.json` disponible)
PUIS code de la 1ère scène (voir NEXT-ACTION.md § Gazoduc). Note : léger doublon lexical dans P4
("la demande de gaz de leur client" / "la demande européenne" 2 phrases après) laissé tel quel car
c'est le texte qui a produit l'audio validé — signalé pour info, pas bloquant.

## Découvertes méthodologiques de cette session (détail complet : `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`)
- Voix source Harmonie remplace Océane (défaut du pipeline).
- Paragraphes fusionnés + CAPS ciblées > tags seuls pour l'expressivité.
- Tags de réaction humaine (souffle, choc) fonctionnent bien ; `[laughs]`/`[clears throat]` à éviter.
- Nouvel outil `scripts/tools/splice-segment.py` : remplace un segment fautif sans re-tirer tout le
  bloc, fonctionne n'importe où dans la timeline (y compris tout début de clip).
- ⛔ Bug trouvé et corrigé : les coupes ffmpeg (splice ET pauses `pauses-sur-original.py`) doivent
  avoir une marge de sécurité (~40ms) autour des timestamps forced-align — coller à 0ms tranche
  l'attaque des mots voisins.
- Pause **NATIVE dans le texte** (`[pause]` envoyé au TTS) donne une transition bien plus naturelle
  qu'un silence splicé après-coup (`sil_s` mécanique, collage sec) — Aziz préfère nettement cette
  méthode. Pour les futures pauses : privilégier `[pause]` dans le texte dès la génération plutôt que
  `pauses-sur-original.py`, sauf réparation chirurgicale sur un audio déjà validé par ailleurs.
