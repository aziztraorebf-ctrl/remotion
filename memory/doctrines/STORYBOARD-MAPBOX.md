# DOCTRINE — Storyboard Mapbox (carte) : le modèle propose, on décode après

> Posée 2026-06-20 (toi + Claude). Le storyboard Remotion (data-viz) marche : le modèle propose une direction
> créative qu'on n'avait pas, on valide, on code. On veut le MÊME levier pour la CARTE — mais le principe diffère,
> parce qu'une carte est du RÉEL CONTRAINT (la géo est fixe, un modèle d'image ne connaît pas notre vraie carte).

## LE PRINCIPE (ce qui change vs Remotion)

- **Remotion** : le modèle génère une image-cible abstraite (un héros inventé) → on s'en inspire pour coder.
- **Mapbox** : le modèle propose la **CHORÉGRAPHIE** — multi-panneaux d'ÉVOLUTION (caméra + couches + artifices
  dans le temps), comme un storyboard de film. La géo qu'il dessine est APPROXIMATIVE et c'est OK : à ce stade
  c'est une **proposition de direction**, pas le livrable. **La vraie géo arrive au CODE (vraie Mapbox), jamais
  copiée du storyboard pixel par pixel** (ça évite le « faux drapeau / fausse Afrique »).
- Mêmes règles que Remotion : **multi-états (DÉBUT→FIN) + ÉPURE** (chaque état = incrément minimal, zéro texte
  redondant — voir `_PALETTE-BACKGROUNDS.md` § storyboard, et [[CONTINUITE-SCENE-INTENTION-DABORD]]).

## LE PRÉAMBULE (2 couches + nos contraintes — à JOINDRE/DIRE à chaque storyboard carte)

Pour que le modèle propose une direction CRÉATIVE (pas plate), on le cadre AVANT de générer :

**[1] NOTRE CARTE (réf jointe, image)** — selon le type de beat, joindre une frame de NOTRE vraie carte pour
qu'il sache à quoi elle ressemble (style, palette, mécaniques) :
- Beat Souverain Mapbox → `public/_shared/refs/cartes/carte-souverain-geoafrique-v5.jpg`
- Beat **WarMap / AES** → `public/_shared/refs/cartes/carte-warmap-sudan-epic.jpg` (territoires par faction, jetons, plaques villes, sceaux)
- Beat **Atlas** → `public/_shared/refs/cartes/carte-atlas-mansa-moussa.jpg`
(On joint la réf au générateur : `storyboard-dual-gen.py --ref <cette frame>`.)

**[2] INSPIRATION EXTERNE (citée par NOM, pas une banque d'images)** — le modèle connaît ces chaînes, il sait
leur style. On lui dit « vise ce niveau de dynamisme ». Chaînes par registre :
> ⚠️ À REMPLIR PAR AZIZ (il fournit les chaînes exactes par registre). Emplacement réservé :
> - **Mapbox dynamique / géopolitique** : _(à compléter)_
> - **WarMap / cartes de conflit** : _(à compléter)_
> - **Atlas / historique illustré** : _(à compléter)_

**[3] NOS CONTRAINTES (dites en TEXTE, pas jointes)** — ce qu'on SAIT faire, pour qu'il propose du codable :
- Toujours : palette navy/gold, fond `#16213a`, frame-driven (caméra pilotée par le temps), vraie géo.
- WarMap : on a jetons, drapeaux ondulés (`WavingFlagFill` 3 bandes / `useClipFlags`), fronts qui avancent, sceaux d'événement.
- Atlas : persos PixelLab, décors illustrés, registre épique (même si les persos finaux différeront du storyboard).
- Souverain : `GeoCountryPlaque`, `FlagFill`, flux/arcs, camCountryApproach pitch ~32.

**[4] L'INTENTION du beat** (1 verbe) + la narration.

→ Le modèle propose un **STORYBOARD multi-états** (dual-gen Gemini + GPT, `storyboard-dual-gen.py`).

## LE FLUX (storyboard d'abord, breakdown APRÈS validation)

1. **Préambule** (les 4 couches ci-dessus) → générer le storyboard carte (Gemini + GPT, on compare).
2. **Aziz valide la DIRECTION** (le ressenti, le mouvement, les artifices). On NE décode pas une direction non validée.
3. **SEULEMENT APRÈS** : on demande le **BREAKDOWN technique** au modèle — « décode comment atteindre ça sur
   notre Mapbox » : mouvements caméra (lon/lat/zoom/pitch par état), couches qui s'allument, artifices (jetons,
   drapeaux, arcs), SFX, timing. C'est le pont vers le code (comme le breakdown Remotion).
4. Code sur la VRAIE carte Mapbox (jamais copier la géo du storyboard).

## LE CRAN DE RE-STORYBOARD (le vrai gain — moteur d'évolution du style)

Si une scène codée est **trop statique / ne marche pas** : ne PAS repartir de zéro. Redemander un storyboard
**« même intention, mais inspire-toi de chaînes plus dynamiques — change les mouvements de caméra, la façon
dont les choses apparaissent »** → nouveau breakdown → re-test. Permet de faire ÉVOLUER notre patte (du sobre
au très dynamique) beaucoup plus vite qu'en re-codant à l'aveugle.

## CAPACITÉ RÉELLE (honnête, vérifié 2026-06-20)
- Le storyboard carte = **généré par le modèle image** (Gemini/GPT), comme Remotion. Faisable, automatisable
  (un agent décrit le préambule, `storyboard-dual-gen.py --prompt-file … --ref notre-carte.png` fait le rendu).
- Alternative envisagée puis ÉCARTÉE pour le storyboard : « vraie vignette Mapbox Static + annotations SVG ».
  Faisable (outil `static_map_image_tool` + SVG composé), MAIS ça illustre une direction QUE NOUS imposons —
  or le but est que le MODÈLE propose la créativité. On garde donc le modèle-propose. (La vraie carte = au code.)

## STATUT
⏳ Doctrine posée, NON encore testée sur un cas réel (le test prévu : un beat AES Sahel, toi + Claude).
⏳ Manque : les chaînes de référence par registre (Aziz). Une fois remplies → tester.
Branché dans : `src/projects/_shared/INTENTION-FORME-INDEX.md` + `WARMAP-INDEX` / pipelines mapbox.
