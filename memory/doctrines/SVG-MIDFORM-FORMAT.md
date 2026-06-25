# Doctrine — FORMAT SVG mid-form (& SVG-insert) ⭐⭐

> Prouve 2026-06-25 (test franc CFA, ~45s, 3 registres). Le SVG genere (GLM-5.2 / Gemini / GPT) + anime par frame
> en Remotion n'est pas qu'un effet ponctuel : c'est un FORMAT de video a part entiere ET un OUTIL narratif a integrer
> dans TOUS les scripts. Source de verite du format. Voir aussi : [[SVG-SCENES-GENERATIVES]] (technique de generation),
> [[openrouter-svg]] (modeles + colorisation timee), `memory/episodes/_rnd/PLAN-ANIMATION-CFA-MIDFORM.md` (plan exemple).

## Ce que le SVG fait MIEUX que tout (le critere d'usage)

Le SVG excelle quand **le sens se construit par le TRAIT et la TRANSFORMATION** — qu'il soit :
- **conceptuel/abstrait** : un mecanisme, un flux, un montage financier, une parite (ex. franc CFA : zone -> parite verrouillee -> depot -> flux sortant) ;
- **narratif/metaphorique** : un recit incarne porte par des formes qui se dessinent/colorisent/transforment (ex. PROUVES : Grande Muraille Verte = graine qui devient arbre, mur qui se construit ; Soudan = "l'or sort de la terre et finance la guerre" = pelle, lingot, creuset).

Le point commun : **ca se RACONTE par des formes qui evoluent** (tracage, colorisation timee, assemblage, transformation, flux). Pas une image figee — un geste visuel.

## ⛔ Ce pour quoi le SVG n'est PAS le bon outil (garde-fou anti-dilution)

- **Geo reelle** (territoire, frontieres, bataille situee, trajet) → reste **Mapbox** (frame-driven).
- **Organique humain/animal realiste, emotion d'un visage, scene "filmee"** → reste image generee / Seedance / vraie matiere.
- **Recit chronologique pur "que s'est-il passe"** sans transformation visuelle a montrer → narration classique.

Ce garde-fou preserve la signature de chaque format (une War-Map reste geo, etc.) SANS amputer le SVG de sa force narrative. Le critere n'est donc PAS "abstrait vs narratif" (erreur), c'est "**transformation visuelle de formes OUI ; geo reelle / organique realiste / recit sans transfo NON**".

## Le FORMAT mid-form 100% SVG (viable, prouve)

- **Viable en format long** (5-7 min) : 6-8 scenes SVG enchainees, CHACUNE ~30s-1min, avec changements de registre rythmes pour briser la monotonie. Contre-intuitif mais vrai : decomprimer (30-45s/scene au lieu de 5s) AMELIORE le rythme (chaque element/concept a le temps d'etre pose un par un), ca ne fatigue pas — A CONDITION que le script porte un raisonnement coherent.
- **Parfois PLUS SIMPLE qu'un beat Mapbox** : un appel GLM (~centimes) + animation par frame en controle total. Pas de carte qui derive, pas de headless capricieux. Le controle total est un avantage de PRODUCTION, pas que d'esthetique.
- **Regle anti-monotonie** : changer de registre toutes les 1-2 scenes (blueprint froid / encre chaude / flux / medaille / papier-decoupe). 3-4 registres dominants par video. Le CONTRASTE de registre = le moteur de retention.
- **Densite par scene** : une scene de 45s doit avoir ~4-6 micro-evenements echelonnes (sinon temps mort).

## ⭐ Le SVG-INSERT (dans TOUS les formats — la vraie bascule strategique)

Le SVG-insert (un bloc SVG de 30s-1min insere dans une video Mapbox/Atlas/Souverain/War-Map) doit etre pense **DES L'ECRITURE DU SCRIPT**, pas plaque apres coup. C'est integre a [[DOCTRINE-SCRIPT-UNIFIEE]] : a l'ecriture de tout script, reperer les moments "mecanisme/concept/transformation a expliquer" = candidats insert SVG. Chaque playbook format (ATLAS / SOUVERAIN / WARMAP) pointe vers cette doctrine.

Resultat : le script NAIT avec le bon outil pour chaque moment (SVG pour la transformation, Mapbox pour la geo, image pour l'organique), au lieu de "se casser la tete plus tard".

## Le PIPELINE prouve (script-first)

1. **Script-first** : ecrire le script en sachant ou le SVG sert (transformation/mecanisme/metaphore). C'est le denominateur commun long ET insert.
2. **Voix** : narration TTS reelle (Souverain : V3 Oceane -> STS GeoAfrique `z3gESu49naEZW8Af2Upm`). Mesurer la duree (ffprobe) + transcrire (Whisper `--word_timestamps`) pour caler les animations frame-perfect sur les mots-cles.
3. **Generer les SVG** par scene (GLM-5.2 defaut low-cost ; Gemini pour l'organique riche ; voir [[openrouter-svg]]). Decoupe en groupes nommes. Pour coloriser : groupe `couleurs` ferme (voir [[openrouter-svg]] colorisation timee).
4. **Animer par frame** (zero CSS) : tracage stroke-dashoffset, colorisation timee (opacite du groupe couleurs), flux (particules), gestes, transitions cross-fade + changement de fond entre registres.
5. **SFX** : reutiliser l'existant (`public/_shared/sfx/` — ink-spread, cedeao-snap, arrow-whoosh, cost-recovery-drain, liptako-gong, birds-ambient...). Nappe continue sous la voix.
6. **Render full HD** + verifier (frames + ecoute) + presenter.

## Acquis techniques (R&D 2026-06-24/25)
- Tracage : `strokeDasharray`/`strokeDashoffset` interpole 1->0 = le trait se dessine.
- Colorisation timee : groupe `couleurs` ferme dessous le trait, opacite animee (gotcha wrapper : [[openrouter-svg]]).
- Flux qui coule : particules (`<circle>`) qui defilent le long des fleches (phase % periode).
- Transitions : cross-fade (opacite) + changement de couleur de fond = marque le beat.
- Continuite : reutiliser un meme symbole entre scenes (ex. hexagone "zone CFA" beat 1 ET beat 3) = meme monde qui evolue.

## Reference vivante (test CFA)
- Composant : `src/projects/_rnd/svg-scenes/CfaMidformTest.tsx` (+ cfaMecaGroups / cfaMarcheGroups / cfaFluxGroups).
- Final : https://files.catbox.moe/fe3u3g.mp4 (colorisation timee OK). v1 PoC : https://files.catbox.moe/skaxho.mp4
