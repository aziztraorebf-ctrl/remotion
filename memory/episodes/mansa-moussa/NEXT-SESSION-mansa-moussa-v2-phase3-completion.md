---
name: NEXT SESSION - Mansa Moussa V2 Phase 3 Completion (5 scenes + 3 inserts dataviz + audio + render final)
description: Brief self-contained pour reprendre Phase 3 apres validation language visuel complet (Hook + S1 + S2 + S3 + 2 inserts dataviz). Reste S4 + Insert 3 Line + CTA + audio inserts ElevenLabs + sous-titres karaoke + render final ~110s.
type: project
---

# NEXT SESSION — Mansa Moussa V2 Phase 3 Completion

> Cree : 2026-05-01 fin session validation langage visuel
> Statut : Phase 3 partielle — Hook + S1 + S2 + S3 + 2 inserts (Pie + Bar) codes et valides visuellement
> Reste : S4 + Insert Line + CTA + audio inserts ElevenLabs + sous-titres karaoke + render final 110s
> Cout cumule total V2 : ~$0.40 ($0.355 session pivot + $0.045 renders mini-tests Phase 3)

---

## ETAT ACTUEL — CE QUI EST FAIT ET VALIDE

### Pipeline V2 valide (NE PAS REOUVRIR)
- Stack : `d3-geo` + Natural Earth 50m + Historical Basemaps + Remotion vectoriel SVG (zero Mapbox)
- Composants reutilisables : `src/atlas-v2-components.tsx` (8 composants + hook + helper)
- Drapeaux : `src/atlas-v2-flags.tsx` (18 pays africains, mode official/diagonal)
- Defs partages : `src/atlas-v2-shared-defs.tsx` (gradients/filters/patterns)
- Data precompute : `src/atlas-v2-data.json` (1.2 MB, 4 projections + 22 villes + caravane waypoints)
- Timing : `src/timing-mansa-moussa-v2.ts` (visual frames avec offsets inserts)

### Scenes deja codees et VALIDEES VISUELLEMENT
- `src/scenes/AtlasV2HookScene.tsx` (Hook 0-4s : globe ortho + particules or + cartouche titre) — VALIDE Aziz
- `src/scenes/AtlasV2S1Scene.tsx` (S1 4-19s : crossfade globe->mercator + Mali drapeau halo + Empire 1300 + legende empire) — VALIDE v2
- `src/scenes/AtlasV2S2Scene.tsx` (S2 19-36s : Mali filigrane + zoom Tombouctou + cartouches) — VALIDE STRUCTURE, **A FIXER : 4 bugs visuels**
- `src/scenes/AtlasV2S3Scene.tsx` (S3 36-50s : port Iter2 validee + caravane chibi + cartouches stats + SFX) — A VALIDER en contexte
- `src/scenes/AtlasV2InsertPieChart.tsx` (Insert 1 - 10s) — VALIDE
- `src/scenes/AtlasV2InsertBarChart.tsx` (Insert 2 - 10s) — VALIDE

### Compositions tests deja rendues + uploadees
- **Hook + S1 v2** (19s, 12.4 MB) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/hook-s1-test-v2-KeAD3HuUyRbGN8kV0EOF4t14cTPo3w.mp4
- **Hook+S1+S2+Insert1** (45s, 24.9 MB) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/hook-s1-s2-test-hYlww2aPR4TIga7Sy0fjkUEnbs7z0g.mp4
- **Hook->S3 + 2 inserts** (75s, 37 MB) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/hook-to-s3-test-WsNqknyaemh2sBq2V1KvODObyPdDTW.mp4

### Demos rythme + esthetique (session 2026-05-01 — A COMPARER en debut de prochaine session)

Contexte : Aziz a pose la question du rythme visuel (trop lent vs chaines anglophones). Deux demos produits pour tester :

- **Rhythm Demo** (25s, rythme rapide spring stiffness:400, pas d'audio) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rhythm-demo-GGCQB2v6pQkg6QqD1XIhT1g3qdY5y6.mp4
- **Best Version Demo V3** (25s, rythme rapide + tilt skewX S1-S4 + drop shadow Empire + degre doré relief Mali, pas d'audio) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/best-version-demo-v3-OmL6qwEIN0NtVCWrFjeMdYZckMxKpK.mp4

**Observation Aziz** : le tilt donne un effet relief interessant, les contours des pays semblent mieux avec cette esthetique. Tout ce qui avait ete fait precedemment (cartouches, caravane, Empire, etc.) s'applique bien dans cette nouvelle esthetique.

**Decision a prendre en debut de prochaine session** (AVANT de continuer BLOC A) : comparer les 3 references cote-a-cote et choisir :
- Option A : continuer esthetique originale validee (Hook->S3 : URL ci-dessus dans "Compositions tests")
- Option B : adopter la nouvelle esthetique Best Version (tilt + drop shadow + degre relief) pour toutes les scenes

**Correction connue si Option B choisie** : couleur ocean du Best Version Demo ne correspond pas a la version originale validee. A recaler sur `#3A5A7E` (ocean des compositions originales) avant d'appliquer a toutes les scenes.

**Fichier source Best Version** : `src/AtlasV2BestVersionDemo.tsx` (composant autonome, reutilisable comme reference technique pour le refactor des scenes si Option B).

---

### Mini-tests dataviz valides (a referencer pour S4 Insert Line)
- Bar Chart v2 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/insert-barchart-demo-v2-KLdItlg3M9UdhVfu1qTojaKHYdWchy.mp4
- Pie Chart : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/insert-piechart-demo-BwMFrfHwjcl9yb9a7tV0I3AThNdbxH.mp4
- Line Chart : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/insert-linechart-demo-Tn0AkZAnyTUV4bevBVJ1GlQa36V8PO.mp4
- Vocab Demo (langage visuel complet) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/vocab-demo-SXHW4w4EnTvxPracXgonKoyBt5MNAb.mp4
- Rotation Demo : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/rotation-demo-114mf6TJmtjZNiuzGyuiq2WvyU71pY.mp4
- National Colors Demo : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/national-colors-demo-gmrYnKgaEVICcLLrpsqA8nbsDT5DAI.mp4

### Decisions strategiques validees Aziz
1. **Pipeline d3-geo + Remotion vectoriel** = stack final
2. **3 inserts dataviz hors-carte** = Insert 1 Pie, Insert 2 Bar, Insert 3 Line (tous 10s)
3. **Mali drapeau plein S1** + halo dore + Empire 1300 outline noir mat
4. **Mali filigrane subtle 40% S2** + zoom Tombouctou + cartouches Cesar
5. **Tilt 15deg subtil S4** une seule fois sur effondrement
6. **Drapeaux pays traversés S3** filigrane optionnel (NON utilise pour pilote V2)
7. **Mini-flags capitales** = reserve pour episodes "comparaison pays" (pas Mansa Moussa)
8. **Cascade region West Africa** = reserve pour scenes geographiques collectives
9. **Rotation 30-45deg** = reserve pour episodes "vue dramatique" (pas Mansa Moussa)
10. **Drapeaux officiels intenses tout l'Afrique** = jamais (sature visuellement)

---

## CE QUI RESTE A FAIRE — TODO LIST

### Bloc A : FIX VISUELS S2 (4 corrections valides Aziz)
Fichier : `src/scenes/AtlasV2S2Scene.tsx`

| Element | Bug | Fix |
|---|---|---|
| Cartouche `+ DE BIBLIOTHEQUES` | Le `+` mal place / texte deborde | fontSize 36 → **28** |
| Cartouche `UNIVERSITE DE SANKORE` | Texte coupe dans rectangle | fontSize 32 → **26**, elargir rectangle width 360 → 440 (ajuster x="-220" et width="440") |
| Label `TOMBOUCTOU` sur la carte | Coupe a gauche viewport | fontSize via `AtlasLabel` 26 → **22** OR ajouter safe-zone X check (clamp position si proche bord viewBox) |
| Zoom Tombouctou | Trop intense, polygone Mali sort a gauche | `mercScale` interpolate 1.5 → max **1.5** (au lieu de 1.85) dans S2 segment B |

**Note importante** : dans S2 il y a aussi `tomboOffsetX * 0.6` et `tomboOffsetY * 0.6` qui calculent le centerOffset. Verifier que reduction du zoom ne casse pas la centrage final sur Tombouctou.

### Bloc B : SCRIPTS ELEVENLABS POUR LES 3 INSERTS (CRITIQUE)

**Probleme identifie par Aziz** : les inserts dataviz tombent en SILENCE pendant 10s = perception bug audio. La narration originale (`narration-v3.mp3`) est splittee en segments autour des inserts → silence pendant l'insert.

**Solution actee** : generer **scripts ElevenLabs dedies** qui jouent **par-dessus** la dataviz, complementant (PAS reformulant) la narration originale.

**REGLE D'OR** : les inserts arrivent **APRES** que la narration originale ait deja enonce le chiffre/fait clé. Donc le script insert doit **approfondir / contextualiser** — apporter une INFO NOUVELLE.

**Texte narration originale complet** (pour reference, eviter redondances) :
```
Cet homme a fait s'effondrer le cours de l'or pendant douze ans.

Mali, mille trois cent vingt-quatre. Tu regardes une carte d'Afrique de l'Ouest.
Cette zone-la, c'est l'empire du Mali. Plus grand que l'Europe occidentale.
Et il a un secret.

A cette epoque, le Mali produit la moitie de l'or qui circule dans le monde.
La moitie. Tombouctou compte plus de bibliotheques que Paris.
L'universite de Sankore accueille vingt-cinq mille etudiants.
Pendant ce temps, la Sorbonne en a deux mille.

Mais le moment qui marque l'histoire, c'est ca.
Douze ans apres son couronnement, l'empereur du Mali part a La Mecque.
Avec lui : soixante mille hommes. Douze mille esclaves.
Et quatre-vingts chameaux qui portent chacun cent cinquante kilos d'or pur.

Sur la route, il distribue tellement d'or au Caire que l'economie egyptienne
s'effondre. Pendant douze ans, le prix de l'or chute dans toute la Mediterranee.
Un seul homme. Un continent qui s'effondre.

Cet homme s'appelait Mansa Moussa. Demande qui est l'homme le plus riche
de l'histoire. On te repondra Rockefeller, Bezos, Musk.
Et pourtant, la vraie reponse, c'est Mansa Moussa.
```

**Insert 1 "Pie Chart La moitie de l'or"** (declenche apres "La moitie. [serious]" 22.5s) :
- Narration deja dit : "le Mali produit la moitie de l'or qui circule dans le monde. La moitie."
- Donc PAS reformuler. Approfondir avec :
  - Comparaison historique (autres sources d'or contemporaines)
  - Origine geographique (Bambouk, Boure)
  - Contexte commercial (routes transsahariennes)
  - Idee : **"L'or vient des fleuves du Bambouk et du Boure. Trois cents tonnes par an traversent le Sahara vers l'Europe et l'Orient."**
  - Chiffres en lettres : "trois cents" OK
  - Verifier TTS : "fleuves du Bambouk", "Boure" → tester (mots rares)
  - Cartouche bottom modifier : "L'OR DU BAMBOUK ET DU BOURE" au lieu de "LA MOITIE DE L'OR / QUI CIRCULE DANS LE MONDE"

**Insert 2 "Bar Chart Expeditions"** (declenche apres "chameaux" 48.52s) :
- Narration deja dit : "soixante mille hommes. Douze mille esclaves. Et quatre-vingts chameaux qui portent chacun cent cinquante kilos d'or pur."
- Donc PAS reformuler. Approfondir avec :
  - Comparaison historique (Marco Polo, Vasco de Gama, Colomb)
  - Idee : **"Marco Polo, Vasco de Gama, Christophe Colomb. Aucune autre expedition de l'Histoire n'a transporte une telle fortune."**
  - C'EST DEJA CE QUE LE BAR CHART MONTRE VISUELLEMENT — donc le script renforce visuellement
  - Verifier "transporte" pas en fin de groupe (suivi de "une") → OK
  - "n'a" + "aucune" pas "ont + voyelle"

**Insert 3 "Line Chart Chute prix or"** (declenche apres "douzeAnsChute" 59.68s) :
- Narration deja dit : "Pendant douze ans, le prix de l'or chute dans toute la Mediterranee."
- Donc PAS reformuler. Approfondir avec :
  - Effet macroeconomique mondial (Europe, Orient)
  - Idee : **"Toute la Mediterranee. De Genes a Bagdad, les marches se figent. Une crise economique globale provoquee par un seul voyage."**
  - Verifier TTS : "Genes" — "n" muet ? Tester
  - "se figent" — verbe conjugue OK pas participe
  - "globale provoquee" — "provoquee" est PARTICIPE PASSE EN FIN DE GROUPE → ATTENTION drop accent ElevenLabs
  - Reformuler : **"Une crise economique mondiale, declenchee par un seul voyage."** → meme probleme avec "declenchee"
  - Reformuler safe : **"Une crise economique mondiale. Causee par un seul voyage."** → "causee" pareil
  - SAFE FINAL : **"Une crise economique qui frappe le monde entier. Provoquee par un seul voyage."** → "frappe" verbe conjugue OK, "Provoquee" en fin de groupe... toujours probleme
  - SOLUTION : changer la formulation pour eviter participes en fin :
    - **"De Genes a Bagdad, les marches se figent. Tout cela parce qu'un seul homme a traverse le Sahara."**
    - "traverse" verbe conjugue (passe compose "a traverse") = OK pas en fin de groupe (suivi de "le")
    - "Sahara" terminaison consonne = OK

### Bloc B-1 : VALIDATION SCRIPTS PAR AZIZ
Avant de generer ElevenLabs, faire valider les 3 scripts proposes par Aziz. **Couts ElevenLabs = ~110 credits = $0.20 max**, mais il faut eviter les regenerations.

### Bloc B-2 : GENERATION + MESURE FFPROBE + INTEGRATION REMOTION
1. Generer les 3 audios via ElevenLabs (voix `z3gESu49naEZW8Af2Upm` Narratrice GeoAfrique v2)
2. Mesurer durees exactes avec `ffprobe`
3. Si une narration insert > 9s : etendre l'insert correspondant a 11-12s dans `timing-mansa-moussa-v2.ts` (`INSERT_DURATION_FRAMES`)
4. Sauver les fichiers : `public/atlas-mansa-moussa/insert-1-bambouk.mp3`, `insert-2-expeditions.mp3`, `insert-3-mediterranee.mp3`
5. Integrer `<Audio>` dans chaque `Insert*` component avec start/end synchros
6. Volume insert audio : 1.0 (full), pas de duck (la narration originale est en silence pendant l'insert de toute facon)
7. La musique de fond `C-mande-contemplatif.mp3` continue PENDANT les inserts (deja le cas)

### Bloc C : S4 CONSEQUENCE SCENE
Fichier deja commence : `src/scenes/AtlasV2S4Scene.tsx` (DEJA CODE en partie pendant la session)
- Mercator Caire close-up + Egypte drapeau plein rouge dominant
- Tilt 15deg subtil sur "s'effondre" (caireEffondre)
- Bump scale sur caireArrival
- Medaillon Gizeh paper-craft (top right) - asset reutilise V1 `public/atlas-mansa-moussa/assets/gizeh-medallion.png`
- Mali fade sur "Un seul homme." [serious]
- Cartouches "L'OR DISTRIBUE", "L'ECONOMIE EGYPTIENNE / S'EFFONDRE", "UN SEUL HOMME. / UN CONTINENT QUI S'EFFONDRE."
- Pulse marker + label LE CAIRE
- **A FAIRE** : verifier que le code S4 deja ecrit fonctionne, lancer mini-render avec composition test Hook->S4

### Bloc D : INSERT 3 LINE CHART INLINE
Component a creer : `src/scenes/AtlasV2InsertLineChart.tsx`
- Port le `AtlasV2InsertLineChartDemo.tsx` valide vers component reutilisable inline (sans wipe interne, gere par parent)
- Meme pattern que `AtlasV2InsertPieChart.tsx` et `AtlasV2InsertBarChart.tsx`

### Bloc E : SCENE CTA
Fichier a creer : `src/scenes/AtlasV2CtaScene.tsx`
- Sortir de la map → fond globe ortho rotation lente (palette V1 hook reutilise)
- Portrait Mansa Moussa A v2 (gros plan) → portrait B v2 (trone) crossfade sur "Mansa Moussa"
- 4 noms cascade Cormorant : ROCKEFELLER / BEZOS / MUSK + MANSA MOUSSA en plus gros + halo dore
- Sur "Et pourtant" : Rockefeller/Bezos/Musk grisent (-50%) + Mansa Moussa pulse dore
- Sur "la vraie reponse" : or du fond globe pulse + portrait B v2 punchline finale
- Mini-flag Mali bottom right (signature continue)
- Assets pretrs : `mansa-portrait-A-v2-canonique.png`, `mansa-portrait-B-v2-canonique-trone.png`

### Bloc F : SOUS-TITRES KARAOKE
Component a creer : `src/scenes/AtlasV2SubtitlesKaraoke.tsx`
- Source : `narration-v3-alignment.json` (mots + timestamps deja existants)
- Couleur or `#D4A574` (palette V1)
- Mot actif highlight (scale 1.1 + couleur saturee)
- Position : bottom center y=950 (au-dessus des cartouches y=1080)
- DESACTIVER pendant les inserts (les inserts ont leurs propres cartouches/audio)
- DESACTIVER pendant CTA (portraits portent l'emotion, pas besoin de mots)
- Pattern reference : `memory/templates/subtitles-shorts.md` (Sonjata)
- IMPORTANT : les sous-titres lisent la narration ORIGINALE, mais les inserts ajoutent une narration SUPPLEMENTAIRE qui n'est PAS dans le fichier alignment. Pour les inserts, on peut soit :
  - Option A : pas de sous-titres pendant inserts (la dataviz est lisible visuellement)
  - Option B : generer un alignment Whisper pour les 3 audios inserts et afficher
  - **Recommandation : Option A** (simplicite + dataviz lisible)

### Bloc G : COMPOSITION FINALE COMPLETE
Fichier a creer : `src/AtlasMansaMoussaV2Final.tsx` ou `AtlasMansaMoussaShowcaseV2Vector.tsx`
- Assemblage : Hook + S1 + S2 + Insert1 + S3 + Insert2 + S4 + Insert3 + CTA + Karaoke
- Audio segments narration originale (4 segments AUDIO_SEGMENTS dans timing v2)
- Audio inserts ElevenLabs (3 sequences)
- Musique fond Mande Contemplatif continu
- Vignette globale
- Total duree : ~110-115s (81s narration + 30s inserts)

### Bloc H : RENDER FINAL + UPLOAD VERCEL
- Render full composition `--gl=angle --concurrency=1`
- Estime : 110s @ 30fps = 3300 frames, render time ~25-35 min sur M1
- Upload Vercel Blob `atlas-mansa-moussa/v2/showcase-v2-final.mp4`
- Comparaison cote-a-cote V1 Mapbox vs V2 Vector (V1 archive deja sur Vercel)
- Commit final + tag

---

## RISQUES IDENTIFIES (a anticiper)

1. **Render time long** : 110s avec multiples layers (cartes + inserts + karaoke + portraits + audio multiples) peut prendre 30-45 min. Si > 1h, considerer simplifier (filtrer pays Africa+Europe+Arabie seulement dans data.json).
2. **Inserts ElevenLabs > 9s** : si TTS depasse, il faut etendre les inserts a 11-12s → ripple effect sur tous les beats apres l'insert. **Mesurer ffprobe AVANT d'etendre**.
3. **Sync sous-titres karaoke** : Whisper word-level peut avoir derive jusqu'a 0.5s. Si visible, regenerer alignment ou ajuster offset global.
4. **TTS regles francaises** : 3 scripts proposes ont des participes a risque ("provoquee", "declenchee", "causee"). Reformulations safe documentees ci-dessus.
5. **Render vignette + clipPath conflict** : verifier que le clipPath des wipes ne fait pas de bug avec la vignette globale (deja teste sur Hook->S3, OK).

---

## DECISIONS VALIDEES SESSION COURANTE (NE PAS REOUVRIR)

1. **Pipeline final** : d3-geo + Natural Earth + Historical Basemaps + Remotion vectoriel
2. **Drapeaux hachures officiels** : pour Mali plein S1, filigrane S2, drapeau plein Egypte S4
3. **Mini-flags capitales** : reserve pour episodes futurs comparaison pays
4. **Cascade region** : reserve pour scenes geographiques collectives
5. **Rotation 30-45deg** : reserve pour episodes futurs vue dramatique
6. **3 inserts dataviz hors-carte** : Pie + Bar + Line, 10s chacun
7. **Inserts duct la narration** : ElevenLabs scripts dedies par-dessus dataviz, pas silence
8. **Sous-titres karaoke** : actives pendant carte, DESACTIVES pendant inserts et CTA
9. **Tilt 15deg S4** : une seule fois, sur effondrement Egypte
10. **Empire 1300 outline noir mat** : valide visuellement (legende empire stylee avec trait pointille)
11. **Egypte/Arabie crème** : SEULEMENT pendant S3 (Hadj) et S4 (Caire), pas avant
12. **Sortir de la map pour CTA** : portraits Mansa Moussa A/B v2 sur globe ortho

---

## METRIQUES SESSION 2026-04-30 / 2026-05-01

- Duree session : ~12h continues
- Cout total ajout : ~$0.045 (8 mini-tests Vercel renders)
  - Hook+S1, Hook+S1 v2, Hook+S1+S2+Insert1, Hook->S3+2inserts (4 main renders)
  - Bar Chart, Bar Chart v2, Pie Chart, Line Chart (4 demos)
  - Vocab Demo, Rotation Demo, National Colors Demo, Insert 60000 abandonne (4 explorations)
- Decouvertes techniques : 4 (clipPath dynamic for wipes, AtlasFlagDefs pattern by ISO, Cormorant readability fontSize ranges, audio segment splits via Sequence)
- Decisions strategiques : 12 (voir liste ci-dessus)
- Memoires creees : ce brief

---

## STARTER PROMPT NEXT SESSION

```
Charge la memoire de session :
1. MEMORY.md (auto-charge)
2. memory/atlas-mansa-moussa/NEXT-SESSION-mansa-moussa-v2-phase3-completion.md (ce brief)
3. memory/atlas-mansa-moussa/LEARNINGS-V2-VECTOR-PIPELINE.md (apprentissages V2 vectoriel)
4. memory/d3-geo-vector-pipeline.md (pipeline final)
5. memory/atlas-mansa-moussa/NEXT-SESSION-mansa-moussa-v2-vector-iter2.md (brief Iter2 reference)

Session Atlas Mansa Moussa V2 Phase 3 Completion.

Etat : Hook + S1 + S2 + S3 + 2 inserts (Pie + Bar) codes et valides visuellement.
Reste : 4 fixes visuels S2 + 3 scripts ElevenLabs inserts + S4 + Insert Line + CTA + sous-titres karaoke + render final.

URLs Vercel renders deja valides :
- Hook + S1 v2 : [URL ci-dessus]
- Hook+S1+S2+Insert1 : [URL ci-dessus]
- Hook->S3 + 2 inserts : [URL ci-dessus]

Action prioritaire (dans cet ordre) :

BLOC A — Fix visuels S2 (4 corrections, 30 min) :
1. fontSize "+ DE BIBLIOTHEQUES" 36 → 28
2. fontSize + width "UNIVERSITE DE SANKORE" 32 → 26, rect 360 → 440
3. fontSize label TOMBOUCTOU 26 → 22 (ou safe-zone X)
4. mercScale max 1.85 → 1.5 (zoom Tombouctou moins intense)

BLOC B — Scripts ElevenLabs inserts (1h, $0.20) :
5. Valider avec Aziz les 3 scripts proposes (texte + scan TTS) :
   - Insert 1 : "L'or vient des fleuves du Bambouk et du Boure. Trois cents tonnes par an traversent le Sahara vers l'Europe et l'Orient."
   - Insert 2 : "Marco Polo, Vasco de Gama, Christophe Colomb. Aucune autre expedition de l'Histoire n'a transporte une telle fortune."
   - Insert 3 : "De Genes a Bagdad, les marches se figent. Tout cela parce qu'un seul homme a traverse le Sahara."
6. Generer ElevenLabs voix z3gESu49naEZW8Af2Upm
7. Mesurer ffprobe → si > 9s, etendre INSERT_DURATION_FRAMES
8. Integrer <Audio> dans Insert* components

BLOC C-D-E — S4 + Insert Line + CTA (3-4h, $0) :
9. Finir AtlasV2S4Scene.tsx (deja commence) + AtlasV2InsertLineChart.tsx + AtlasV2CtaScene.tsx
10. Mini-renders incrementaux : Hook->S4, Hook->CTA

BLOC F — Sous-titres karaoke (1h, $0) :
11. AtlasV2SubtitlesKaraoke.tsx (Whisper word-level, couleur or, off pendant inserts/CTA)

BLOC G — Composition finale + render final + upload (1h, $0) :
12. AtlasMansaMoussaV2Final.tsx assemblage complet
13. Render full ~110s + upload Vercel Blob

Cout estime restant : ~$0.20 (ElevenLabs inserts).
Temps estime : 6-8h.

Tous assets reutilisables (audio narration, portraits, medaillon, GeoJSON, timing) deja en place.
```

---

## FICHIERS CRITIQUES A LIRE EN PREMIER

1. `quebec-jacques-poc/src/timing-mansa-moussa-v2.ts` (timing avec inserts)
2. `quebec-jacques-poc/src/atlas-v2-components.tsx` (composants reutilisables)
3. `quebec-jacques-poc/src/atlas-v2-flags.tsx` (drapeaux 18 pays)
4. `quebec-jacques-poc/src/atlas-v2-shared-defs.tsx` (defs SVG partages)
5. `quebec-jacques-poc/src/scenes/AtlasV2S2Scene.tsx` (scene a fixer en priorite)
6. `quebec-jacques-poc/src/scenes/AtlasV2S4Scene.tsx` (scene partiellement codee, a finir)
7. `quebec-jacques-poc/src/AtlasV2HookToS3Test.tsx` (composition assembly reference)
8. `quebec-jacques-poc/out/atlas-mansa-moussa/narration-v3-alignment.json` (texte original + word-level timing)
