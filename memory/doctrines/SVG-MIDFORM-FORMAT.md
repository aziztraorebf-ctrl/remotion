# Doctrine — FORMAT SVG mid-form (& SVG-insert) ⭐⭐

> 🧭 ORDRE DE LECTURE : (0) SVG-FAISABILITE-AMONT (valider la vue AVANT) → (1) SVG-SCENES-GENERATIVES (generer+animer, manuel principal) → si multi-agents : PRODUCTION-AGENTIQUE-SVG → **(si format video long) VOUS ETES ICI — SVG-MIDFORM-FORMAT**.

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

---

## ASSEMBLAGE D'UN SHORT SVG (N beats -> video finale)

> Documente le REEL de GGW Muraille Verte (7 beats, 141s, branche `feat/shorts-svg-muraille-verte` + master).
> B7MosaiqueFinal.tsx : presente dans la svg-library + dans le rendu final, mais PAS enregistre dans Root.tsx
> (le render final a ete produit via renderMedia CLI directement depuis la branche). Signaler + committer B7 dans
> Root.tsx a l'assemblage du prochain short (pour pouvoir previsualiser dans Remotion Studio).

### 1. Principe : une composition d'assemblage par short (Series + Sequence)

Chaque beat = un composant TSX autonome avec ses `durationInFrames` et `fps` en export.
L'assemblage = 1 fichier `<Nom>Short.tsx` + 1 composition dans Root.tsx :

```tsx
// GgwMurailleVerteShort.tsx (a creer si manquant)
import { Series } from "remotion";
import { GgwHookEncreVivant } from "./_rnd/svg-scenes/GgwHookEncreVivant";
import { B2LigneBrisee } from "./_rnd/svg-scenes/B2LigneBrisee";
// ... importer chaque beat

const BEATS = [
  { component: GgwHookEncreVivant, durationInFrames: 640 },
  { component: B2LigneBrisee,       durationInFrames: 606 },
  { component: B3Malentendu,        durationInFrames: 468 },
  { component: B4Demilune,          durationInFrames: 750 },
  { component: B5LaPreuve,          durationInFrames: 424 },
  { component: B6Outro,             durationInFrames: 690 },
  { component: B7MosaiqueFinal,     durationInFrames: 642 },
];

export const GgwShort: React.FC = () => (
  <Series>
    {BEATS.map(({ component: Comp, durationInFrames }, i) => (
      <Series.Sequence key={i} durationInFrames={durationInFrames}>
        <Comp />
      </Series.Sequence>
    ))}
  </Series>
);

export const GGW_SHORT_TOTAL_FRAMES = BEATS.reduce((s, b) => s + b.durationInFrames, 0);
// -> 4220 frames a 30fps = 140.67s (correspondance validee ETAT-GGW 140.99s)
```

Dans Root.tsx :
```tsx
import { GgwShort, GGW_SHORT_TOTAL_FRAMES } from "./projects/_rnd/svg-scenes/GgwShort";
// ...
<Composition id="GGW-MurailleVerte-Short" component={GgwShort}
  durationInFrames={GGW_SHORT_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
```

### 2. Cross-fade entre beats (si voulu)

`Series` enchaine sans transition. Pour un cross-fade :
- Utiliser `<Sequence>` + `premountFor` (charge le beat suivant N frames avant sa position)
- Opacite du beat sortant : `interpolate(frame, [end-15, end], [1, 0])` + `extrapolateRight:'clamp'`
- Opacite du beat entrant : `interpolate(frame, [start, start+15], [0, 1])`
- GGW N'A PAS utilise de cross-fade (coupes nettes + SFX pont = suffisant pour l'encre). Cross-fade = a
  utiliser seulement si les registres changent de facon abrupte (ex: encre -> blueprint).

### 3. Nappe musicale globale (technique GGW)

La nappe se pose EN UNE COUCHE sur l'assemblage, PAS sur chaque beat :
```tsx
// Dans GgwShort.tsx, au niveau de la composition entiere
import { Audio } from "remotion";
// ...
<Audio src={staticFile("audio/ggw-muraille-verte/music/ambiance-raw.mp3")}
  volume={0.10} />
{/* Series avec les beats ci-dessus */}
```
- Volume nappe : ~0.10 (sous la narration). Les narrations de chaque beat ont leurs propres `<Audio>`.
- Si la nappe est plus courte que le short : ajouter `loop` sur l'element `<Audio>` (fonctionne en headless, prouve GGW).
- `loop` sur un `<Audio>` = ok en render headless (non documente Remotion, valide 2026-06-22).

### 4. CTA final (beat dedie vs overlay)

Deux strategies :
- **Beat dedie** (GGW B7) : composant `B7MosaiqueFinal.tsx` est a la fois le climax esthetique ET le CTA.
  `typewriter` du CTA demarre quand la foret est en place (~frame 520 sur 642).
- **Overlay independant** : un composant `<CTAOverlay>` en `<Sequence from={totalFrames-120}>` sur la composition
  d'assemblage. Avantage : CTA unifie pour tous les shorts (pas a recoder par beat).
Recommandation : beat dedie si le CTA s'integre narrativement (climax = transition naturelle) ; overlay si le CTA
est generique et la derniere scene ne le porte pas.

### 5. Render final (CLI ou Vercel)

```bash
# Render direct depuis Root.tsx (beats individuels)
npx remotion render src/index.ts RND-GgwHookEncreVivant out/episodes/ggw-muraille-verte/beat1.mp4

# Render assemblage (composition GGW-MurailleVerte-Short)
npx remotion render src/index.ts GGW-MurailleVerte-Short out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.mp4

# Pour >30s -> preferer render Vercel (evite saturation machine locale)
python3 scripts/tools/render-on-vercel.py --comp GGW-MurailleVerte-Short --out ggw-FINAL.mp4
```

### 6. Pre-cable Root.tsx AVANT de lancer les agents

Lecon GGW (2026-06-25, 2 agents en parallele) : le chef d'orchestre pre-cable TOUS les imports et
`<Composition>` dans Root.tsx AVANT de lancer les agents (meme si les fichiers TSX n'existent pas encore).
Les agents creent leurs fichiers, ils compilent immediatement sans toucher Root.tsx -> zero collision.
Si Root.tsx n'est pas pre-cable : les agents creent des fichiers "flottants" (pas de comp Remotion, pas
de previsualisation) -> risque de double touche sur Root.tsx.

### 7. Signaux d'alerte assemblage

- Un beat dont le `durationInFrames` differe de l'audio mesure au ffprobe = glissement de timing
  (recalibrer via `scripts/tools/ggw-b2-alignment.py` ou `ggw-b4b5-alignment.py`).
- La `<Series>` enchaıne en frames absolus : un beat trop long = decalage de TOUS les suivants.
  Verifier : `sum(BEATS.map(b => b.durationInFrames))` == duree totale attendue.
- B7MosaiqueFinal.tsx absent de Root.tsx sur master -> a enregistrer lors du prochain merge de `feat/shorts-svg-muraille-verte`.

**Reference GGW complete** : `memory/episodes/shorts-svg/muraille-verte/ETAT-GGW-MURAILLE-VERTE.md` (durees exactes de chaque beat, commits, liens catbox).
