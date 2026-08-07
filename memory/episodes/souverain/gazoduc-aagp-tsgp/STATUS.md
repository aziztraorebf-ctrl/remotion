# Gazoduc AAGP vs TSGP — STATUS

**Mis à jour** : 2026-08-07

## État — ACTE 3 (TSGP) CODÉ v1→v2, EN ATTENTE REVUE AZIZ (2026-08-07)

3 segments (A carte D3 tracé Nigeria→Niger→Algérie, B insert sécurité aéroport Niamey, C insert
paradoxe Maroc/Algérie) + montage codés et rendus deux fois : v1 jugé "catastrophique" par Aziz
(diaporama, à refaire), puis refonte complète après 3 DA-briefs critiques ciblés (Gemini+Kimi+
DeepSeek) — v2 rendu et uploadé, en attente de revue Aziz. Détail complet (synthèse DA-brief,
décisions tranchées, correctifs appliqués) : `PLAN-ACTES2-5.md`. Lien rendu v2 + priorités :
`memory/NEXT-ACTION.md` (section "DEUX CHANTIERS SÉPARÉS OUVERTS LE 2026-08-07"). Analyse
comparative Soudan/AES faite en fin de session : registre visuel (jetons/décors) reste sous le
niveau déjà prouvé ailleurs dans le projet — probable 3e passage à venir, pas encore fait.

---

## État — ACTE 2 TERMINÉ ET VALIDÉ (finale produite le 2026-08-04)

**Livrable** : `out/episodes/gazoduc-aagp-tsgp/acte2-FINAL.mp4` (127.4s, validé explicitement par
Aziz). Structure = **4 segments montés bout à bout** (pas un fichier monolithique) :
1. **Insert SVG signature Freetown** (22s) — `GazoducActe2Signature.tsx`
   (`GazoducActe2SignatureFreetown` + `GazoducActe2SignatureFlashback`).
2. **Carte D3 tracé AAGP** (20.8s) — `GazoducActe2AAGP.tsx` refondu en v4, segment court comme
   tranché par Aziz (25-30s visé, PAS 2min18 comme la version précédente).
3. **Insert SVG flashback genèse 2016** (33.4s) — dans le même fichier `GazoducActe2Signature.tsx`.
4. **Insert SVG financement manquant** (51.3s) — `GazoducActe2Financement.tsx`.

Montage assemblé dans `GazoducActe2Montage.tsx`, tous les segments importés/composés dans
`src/Root.tsx` (compositions `D3-Gazoduc-Acte2-Signature-Freetown`, `-Signature-Flashback`,
`-AAGP`, `-Financement`, `-Montage`). Audio `narration-p2.mp3` synchronisé par segment.

**Pipeline SVG "liberté créative" étendu à 4 modèles externes** (Gemini 3.1 Pro / GPT-5.6 Sol /
GLM-5.2 / Kimi K3) en plus de Fable 5 — 20 candidats comparés au total. Mix retenus :
- **Signature** : base GPT-5.6 Sol (arche + colonnes) + bannières de Fable (12 drapeaux ECOWAS
  réels, remplace les 15 bannières anonymes du candidat Fable seul décrit précédemment).
- **Financement** : document/plume/goutte de Gemini + tuyau/gouffre de GPT-5.6 Sol.

Technique de dessin progressif (`strokeDasharray`/`strokeDashoffset`) généralisée à tous les
éléments structurants des inserts SVG. 3 bugs de synchro audio corrigés (marge +300ms, chéquier
resynchronisé). Contresens narratif corrigé : signature manuscrite retirée du segment financement
(incohérente avec le texte — l'accord manque, on ne montre pas une signature).

**Géoplaque Mauritanie retirée** de la carte (le pays sans accord n'a pas de géoplaque d'arrivée,
cohérent avec le narratif "financement manquant").

Les 20 SVG candidats "liberté créative" (12 sauvegardés initialement + 8 des modèles externes
ajoutés) sont dans `memory/episodes/souverain/gazoduc-aagp-tsgp/svg-inserts-acte2-candidats/`
(copie persistante). Script réutilisable : `scripts/tools/gazoduc-svg-inserts-gen-libre.py`.

## Acte 3 (TSGP) — voir État en tête de fichier

Section déplacée en tête (2026-08-07) — ne plus se fier à la mention "aucun visuel encore produit"
ci-dessous, périmée depuis le codage v1→v2.

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
