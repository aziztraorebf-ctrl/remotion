# DOCTRINE — Storyboard Data-viz (Remotion) : le préambule premium qui manquait

> Posée 2026-06-20 (toi + Claude), comble le **TROU 3** du `CHANTIER-PEAUFINAGE-GRAPHISMES.md`.
> Pendant symétrique de [[STORYBOARD-MAPBOX]] : la carte avait un préambule riche (notre carte + chaînes citées +
> ARSENAL + directive « carte vivante »), le data-viz Remotion N'AVAIT QUE des « principes » jamais passés au modèle
> au moment de générer le storyboard. Résultat : storyboard « correct mais plat », sans cible de qualité à viser.
> Cette doctrine donne au générateur (`gemini-storyboard-panels.py`) le MÊME levier que la carte.

## LE PROBLÈME EXACT (diagnostic Aziz sur le rendu réel des cobayes Maroc)
Le `STYLE_BLOCK` de `gemini-storyboard-panels.py` citait « Bloomberg, Vox, Le Monde » en passant, comme simple
*tone*, sans dire **ce qu'on leur vole** ni **« vise CE niveau »**. Le modèle n'avait donc AUCUNE cible premium
concrète → il produisait le minimum : des cellules propres mais sans direction forte, « beaucoup de carrés vides ».
La grammaire premium EXISTE déjà ([[SOUVERAIN-REMOTION-PLAYBOOK]] : secondary motion, anticipation/overshoot,
2.5D, transitions seamless) mais elle restait dans la doctrine, jamais injectée à la génération.

## LE PRINCIPE (identique à la carte, adapté au data-viz abstrait)
- **Le modèle PROPOSE une direction créative** qu'on n'avait pas (chorégraphie multi-états de la donnée), on valide,
  PUIS on décode le breakdown → code. Déplace le jugement de goût d'après-render (cher) vers avant-code (gratuit).
- Différence avec la carte : ici l'image-cible est ABSTRAITE (un « héros donnée » inventé, un chart mis en scène),
  pas du réel contraint. Le modèle a donc plus de liberté de composition — raison de plus pour lui DONNER une cible
  premium, sinon il dérive vers le PowerPoint.
- Mêmes règles transverses : **multi-états (DÉBUT→FIN) + ÉPURE** (chaque panneau = incrément minimal, zéro texte
  redondant), annotations de storyboard ≠ rendu final (voir [[STORYBOARD-MAPBOX]] § annotations, [[CONTINUITE-SCENE-INTENTION-DABORD]]).

## LE PRÉAMBULE PREMIUM (à JOINDRE/DIRE à chaque storyboard data-viz)

### [1] LE RATIO CIBLE (⛔ corrige aussi la dette du gate review)
**Générer le storyboard au RATIO DU RENDER, pas en vertical par défaut.** Avant, le `STYLE_BLOCK` forçait
`1080x1920 (9:16)` même quand la vidéo sortait en 16:9 → panneaux portrait, espaces vides à gauche/droite en 16:9,
ET faux-bas du gate review (Gemini pénalisait une différence de format inévitable). Désormais le ratio est
PARAMÉTRABLE (`--ratio 16:9` ou `9:16`) et passé explicitement au modèle. Par défaut **16:9** (format Souverain
mid-form / long). Le modèle compose chaque panneau POUR ce cadre — il remplit l'espace horizontal, ne laisse pas de vide.

### [2] CHAÎNES PREMIUM DATA-VIZ (citées par NOM — ce qu'on leur VOLE)
Le modèle connaît ces chaînes et leur grammaire. On lui dit « vise CE niveau, prends-leur CECI » :
- **Bloomberg Originals** → data-visualisation premium, profondeur 2.5D (drop-shadow dynamique, parallaxe fond/avant-plan),
  chiffre incrusté avec autorité. NOTRE point faible #2 (flat pur) — on lui VOLE la profondeur.
- **Vox** + **Johnny Harris** → rigueur éditoriale, annotations propres, **transitions seamless** (match cut, zoom
  intra-élément) au lieu de cuts francs. NOTRE faiblesse #1 (effet slideshow) — on lui VOLE la continuité.
- **Kurzgesagt** → secondary motion (tout respire légèrement), springs avec anticipation+overshoot, discipline du vide,
  métaphore visuelle qui porte le chiffre. On lui VOLE le « rien n'est figé » + la métaphore.
- **Polymatter** + **Wendover** → registre éco/géopolitique très proche du nôtre, chart au service du propos,
  montée en tension narrative. On lui VOLE le tempo narratif.
- **Financial Times / The Economist (graphics desk)** → autorité du chiffre, sobriété chromatique, hiérarchie
  typographique impeccable, labels directs (jamais de légende). On lui VOLE la hiérarchie + la sobriété.

### [3] NOTRE MATIÈRE HERA DÉCODÉE (réfs à joindre — ce qu'on SAIT déjà faire à ce niveau)
On a décodé 15 templates data-viz premium (« Finari/Hera ») et codé nos protos qui les ÉGALENT/écrasent. Le modèle
doit savoir l'étendue de notre boîte à outils (sinon il colorie des barres) — réfs : `out/_r-and-d/decode-hera/frames/`
+ protos `src/projects/_proto-16-9/ProtoHera_*.tsx` (renders catbox dans [[decode-hera-templates]]).
- **Grammaire narrative Hera (5 beats)** : (1) pose la question · (2) baseline/comparaison · (3) anime le chiffre clé
  (le geste) · (4) traduit en langage simple (le takeaway) · (5) source + CTA. Polish : labels directs PAS de légendes ·
  **pause après le chiffre le plus important** (count-up land + breathe).
- **Nos registres de fond canon** (réponse au « quel background ? ») : parchemin/quadrillé clair (`#e4ddca` + grille
  or-sable, défaut premium) · carte estompée (chart-sur-carte) · terminal néon noir (réservé marché/tech) · sketch
  whiteboard (registre léger). Détail : [[decode-hera-templates]].
- **Ce qu'on sait faire** : count-up odomètre land+breathe · HeroVerticalBars / mirror bars · chart-sur-vraie-carte
  d3-geo (ProtoHera_ChartOnMap = le meilleur, prêt prod) · donut · timeline médaillons · texte cinétique d'emphase ·
  line chart bande highlight · effet crayon (feDisplacementMap) · glow néon headless. **Va plus loin que ça.**

### [4] LA DIRECTIVE « DATA-VIZ VIVANTE » (le cœur — exigence, pas checklist)
⭐ « Le data-viz doit être VIVANT et PREMIUM — jamais un PowerPoint, jamais un plan fixe figé, jamais des carrés
vides. À chaque état du storyboard, quelque chose ÉVOLUE pour porter l'intention (le chiffre se construit, une
métaphore visuelle apparaît, la donnée se met en scène). REMPLIS l'espace du cadre. **À TOI de proposer COMMENT** —
inspire-toi des chaînes ci-dessus et de notre matière Hera, adapte à nos moyens. Ne te contente pas du minimum :
ose des partis pris visuels forts. » — ⚠️ on NE liste PAS les techniques une par une : ça briderait. Le modèle a les
références, il sait adapter (gain prouvé sur la carte : les agents ont inventé seuls le passage clair→noir au climax).

### [5] NOS INTERDITS + CONTRAINTES (pour rester dans nos moyens)
- Flat editorial illustration : NOT 3D, NOT photorealistic, NOT cartoon.
- Palette STRICTE selon le registre (défaut Souverain : navy `#141c2e` fond / gold `#c8a951` donnée clé / ivory
  `#f0e8d8` texte / rouge `#cc2200` ou vert `#4caf7d` UNIQUEMENT pour un verdict). Parchemin si registre clair.
- Multi-panneaux numérotés, bordure fine, progression temporelle gauche→droite, timestamp par panneau.
- NO subtitles / NO voiceover text dans les panneaux (sauf labels data/géo explicitement demandés).

### [6] L'INTENTION du beat (1 verbe) + la narration.

## LE FLUX (storyboard d'abord, breakdown APRÈS validation) — identique à la carte
1. **Préambule** (les 6 couches ci-dessus, injectées par le `STYLE_BLOCK` du générateur) → générer le storyboard.
2. **Aziz valide la DIRECTION** (ressenti, mise en scène, métaphore). On NE décode pas une direction non validée.
3. **SEULEMENT APRÈS** : breakdown technique (format Remotion — voir [[SOUVERAIN-REMOTION-PLAYBOOK]] template 10 champs +
   le champ ASSET PRÉCIS, voir ci-dessous).
4. Code Remotion sur la vraie charte.

## ⛔ LE CHAMP « ASSET PRÉCIS » DANS LE BREAKDOWN (comble le TROU 2 du chantier)
Le breakdown ne dit JAMAIS « satellite icon » de façon vague (→ l'agent met une icône littérale qui diverge du
storyboard). Il spécifie l'asset EXACT : **quelle icône Lucide** (`<Factory/>`, `<Gem/>`…) OU **quel composant**
(`HeroVerticalBars`, `CountUp`…) OU **quel asset Gemini** (chemin) + **la fonte exacte**. Règle : si le storyboard
montre un caillou de phosphate, le breakdown dit « asset Gemini `phosphate-rock.png` » ou « icône Lucide `<Mountain/>` »,
pas « mineral icon ». Champ `asset` explicite, vérifié (grep'd) comme `forme_verifiee` sur la carte.

## STATUT
✅ Préambule premium DATA-VIZ défini (cette doctrine) + branché dans `gemini-storyboard-panels.py` (`STYLE_BLOCK`
   enrichi + ratio paramétrable `--ratio`, défaut 16:9).
✅ Comble TROU 3 (préambule) + TROU 1 cause-2 (ratio) + amorce TROU 2 (champ asset précis).
⏳ À éprouver sur un cobaye réel (régénérer le storyboard data-viz Maroc 70% avec le nouveau préambule + ratio 16:9 →
   comparer au render plat précédent). C'est la validation de cette doctrine.
Branché dans : `MEMORY.md`, `CHANTIER-PEAUFINAGE-GRAPHISMES.md`, `SOUVERAIN-REMOTION-PLAYBOOK.md` (renvoi storyboard).
