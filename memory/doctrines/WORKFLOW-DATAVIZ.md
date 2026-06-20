# ⭐⭐ WORKFLOW DATA-VIZ — pipeline complet storyboard → render (NON-NEGOTIABLE)

> LE point d'entree unique pour produire une scene DATA-VIZ Remotion premium (chiffres hero, charts,
> mise en scene de la donnee — PAS carte Mapbox). Prouve A→Z le 2026-06-20 sur un cobaye reel
> (Maroc phosphate "70%"). Cette doctrine RACONTE le pipeline et POINTE vers les briques ; le detail
> technique vit dans les scripts/doctrines cites (pas de duplication).
>
> Reprise/etat du dernier cas : [[REPRISE-WORKFLOW-DATAVIZ]]. Etape storyboard detaillee : [[STORYBOARD-DATAVIZ]].
> Grammaire premium data-viz : [[SOUVERAIN-REMOTION-PLAYBOOK]]. Carte = pipeline different ([[STORYBOARD-MAPBOX]]).

## LE PRINCIPE FONDATEUR (la cle de tout)
**Le storyboard est la CIBLE a reproduire a ~100%, PAS un brouillon a reinterpreter.** On GENERE les
assets qu'il montre (matiere figee : chiffres en relief, fonds, pictos illustres), et Remotion les
ASSEMBLE/ANIME. On ne re-dessine JAMAIS a la main en SVG/CSS ce qui peut etre genere (anti-pattern
prouve : un proto SVG "70%" code main = plat, amateur ; l'asset genere = premium, ~identique a la cible).
Division du travail : **GENERATION = le beau et le fige · REMOTION = placer, animer, compter, transitionner.**

## LE PIPELINE (6 etapes)

### 1. FORMAT D'ABORD (gate amont)
Decider le RATIO du render AVANT de generer le storyboard : horizontal 16:9 (mid-form/long) ou vertical
9:16 (Short) ou 1:1 (carrousel). Le storyboard se genere a CE ratio (cf. etape 2). ⛔ Ne jamais generer
un storyboard vertical pour un render horizontal (= bords vides). [A cabler : gate bloquant phase 0 de beat-session.]

### 2. STORYBOARD (le modele PROPOSE la direction, on valide)
Outil : `scripts/tools/gemini-storyboard-panels.py` (preambule premium injecte automatiquement).
- `--ratio {16:9|9:16|1:1}` : CHAQUE panneau est un mini-ecran a ce ratio (pas une vignette carree).
- `--background {parchemin|navy|neon|libre}` : **2 versions a generer** -> notre reference (parchemin, clair
  ou sombre) ET une version `libre` (Gemini choisit le fond). Le `libre` propose souvent MIEUX (prouve : fond
  teal+or decouvert ainsi). Garder les deux, Aziz tranche.
- **4 cases** = standard (etat1 · etat2 · transition/le geste · etat final). Montre le mouvement, pas que les poses.
- **Illustration plate obligatoire** (jamais realiste : un realiste n'est pas reproductible fidelement).
- Preambule premium (chaines Bloomberg/Vox/Kurzgesagt/FT + matiere Hera + "va plus loin") : detail [[STORYBOARD-DATAVIZ]].
- -> Aziz valide la DIRECTION avant de decoder. Annotations de panneau (titre d'etat, timer) = echafaudage,
  PAS a reproduire dans le render.

### 3. BREAKDOWN (GPT-5.5 tranche TOUT — le coeur du systeme)
Outil : `scripts/tools/openrouter-vision-breakdown.py --model openai/gpt-5.5`.
Prompt de reference : `memory/doctrines/templates/PROMPT-BREAKDOWN-DATAVIZ.txt`.
GPT-5.5 ECRASE Gemini au breakdown JSON (prouve). Pour CHAQUE element visible du panneau, le breakdown TRANCHE
(rien laisse a deviner pour celui qui codera) :
- **verdict** : `GENERE` (asset fige) · `REMOTION` (tout code) · `HYBRIDE` (asset genere + couche Remotion).
- si GENERE/HYBRIDE : **prompt d'asset PRET** (fond transparent, hex exacts, style flat editorial, +
  ⛔ INTENSITE CALIBREE "juste assez" : ex "extrusion SUBTILE ~8% de la hauteur du glyphe, pas de gros biseau
  cartoon". Le premium vient de la RETENUE).
- si REMOTION/HYBRIDE : **placement en classes TAILWIND** (`absolute left-[48%] top-[45%] -translate-x-1/2
  w-[40%]`) + animation (count-up, crossfade, spring damping/stiffness). JAMAIS en pixels d'une vignette.
- **tailles MESUREES** en % du cadre (largeur ET hauteur), pas estimees a l'oeil (cf. piege etape 6).
- **intention** en prose (ce que l'element doit faire RESSENTIR) — pas juste des codes.
- champ global `ce_qui_reste_a_remotion` = perimetre de code explicite pour un agent frais.
Critere de qualite du breakdown : **un agent frais l'execute sans avoir a decider quoi que ce soit de creatif/structurel.**

### 4. GENERATION DES ASSETS (puis DETOURAGE obligatoire)
- Generer chaque asset GENERE/HYBRIDE : `scripts/tools/gemini-gen-image.py --prompt "<du breakdown>" --output ...`.
- ⛔ **DETOURAGE RECRAFT OBLIGATOIRE** : Gemini ne sort JAMAIS un vrai alpha — il dessine un faux damier
  OPAQUE. Detourer via `mcp__recraft__remove_background` (passer l'URL catbox). Verifier alpha = (0,255) ET
  le trou des lettres (le "0", le "8"...) bien transparent. Detail : [[feedback_gemini-assets-fond-transparent]].
  ⚠️ **Recraft renvoie du .webp** → reconvertir en .png (PIL `Image.open(x).save(y,'PNG')`) pour Remotion.
  ⚠️ Si Recraft laisse du blanc OPAQUE dans un contre-poincon (trou du "0"/"8"), nettoyer par FLOOD-FILL alpha
  local depuis l'interieur du trou (le diff GPT ne voit PAS ce defaut, cf etape 6).
- Copier les PNG transparents dans `public/<zone>/` pour Remotion.

### 5. ASSEMBLAGE REMOTION
Coder la scene en suivant le breakdown A LA LETTRE : `<Img>` des assets generes places aux classes Tailwind
du breakdown, count-up Remotion -> `crossfade` vers l'asset genere (pattern HYBRIDE), barres/traits/fleches
en SVG (geometrie precise), timing audio-derive. NE PAS deroger au breakdown (chaque deviation = un ecart).
Stack : Remotion + Tailwind (`enableTailwind` actif). Render plein HD scale=1 pour juger la nettete.
⛔ **POLICES** : les polices nommees dans le breakdown (Bebas Neue, Oswald, Anton...) doivent etre CHARGEES,
sinon fallback systeme = faux rendu. Utiliser `@remotion/google-fonts/<Police>` (ex
`import {loadFont} from "@remotion/google-fonts/Oswald"; const {fontFamily} = loadFont();`). Installer le paquet
s'il manque (`@remotion/google-fonts`, version alignee sur remotion). Defaut chiffres/titres condensses = Bebas Neue.

### 6. DIFF cible-vs-render (corriger MESURE, pas devine — puis STOP)
Composer une planche `IMAGE A = cible | IMAGE B = notre render` (cote a cote, MEME hauteur, fond uni, ~24px de
gouttiere) et la donner a GPT-5.5. Recette de planche prouvee (PIL) : croper la case CIBLE de la cible, normaliser
les deux a une meme hauteur, coller cote a cote. ⛔ **Croper la case cible SANS le bandeau d'annotation** (titre
d'etat + timer en haut) : sinon les % verticaux ET le ratio des elements (picto, 70) sont biaises par la bande
(cause prouvee d'un picto rendu trop petit en suivant la mesure GPT). Si pas de coordonnees de crop connues : grille
2x2 reguliere = case bas-droite ~ (50%,50%)->(100%,100%), puis rogner le haut jusqu'a la 1ere ligne de contenu.

Commande COMPLETE (copier-collable, 4 args obligatoires) :
`python3 scripts/tools/openrouter-vision-breakdown.py --model openai/gpt-5.5 --image /tmp/diff-plate.png --prompt-file memory/doctrines/templates/PROMPT-DIFF-CIBLE-RENDER.txt --output /tmp/diff-result.json`
Prompt de reference : `memory/doctrines/templates/PROMPT-DIFF-CIBLE-RENDER.txt`.
GPT MESURE les ecarts (taille/position en %) et donne les corrections Tailwind exactes. Appliquer.
- ⛔ **1 PASSE, SIGNAL pas juge** : NE PAS boucler diff->fix->diff (doctrine "modele=signal jamais juge",
  [[feedback_systeme-beat-mapbox-vs-remotion]]). Appliquer ce qui est vrai, STOP.
- ⛔ EXCLURE les annotations de storyboard du diff (titre d'etat, timer) = on ne les reproduit pas ; sinon
  GPT penalise a tort et fausse le score. (Instruction gravee dans le template depuis 2026-06-20.)
- ⛔ **VERIFIER CHAQUE CORRECTION COTE-A-COTE APRES APPLICATION** (regle d'or) : le diff GPT peut sur/sous-mesurer
  (vu : picto "12%" alors que l'oeil correct = ~16%). Le verdict d'Aziz/l'oeil prime sur la mesure si la planche
  post-fix le contredit. Re-render scale=1 + re-composer la planche apres les fix.
- ⛔ **LE DIFF GPT NE VOIT PAS L'ALPHA** : un trou de lettre mal detoure (le "0", le "8" : damier/blanc residuel)
  N'apparait PAS dans le diff cote-a-cote. Garder l'inspection alpha de l'etape 4 comme controle SEPARE
  (verifier alpha=0 dans le contre-poincon ; flood-fill local si Recraft a laisse du blanc opaque).

## ⭐ REGLE D'OR TRANSVERSE (la lecon la plus chere de la session)
**Ne JAMAIS juger un asset/render de MEMOIRE.** Toujours composer cote-a-cote avec la cible et, pour les
tailles, faire MESURER par le modele qui voit la cible. Prouve : mon oeil notait "80%", GPT mesurait "55%".
Vaut pour Claude ET pour tout agent. Detail : [[feedback_juger-asset-cote-a-cote-storyboard]].

## ⭐⭐ REGLE DE PRESENTATION A AZIZ (lecon 2026-06-20, source de frustration MAJEURE evitee)
**Aziz juge le design sur le PLEIN FORMAT, jamais sur une vignette.** Un comparatif cote-a-cote rapetisse les
deux images (ex 540px) : la vraie ECHELLE et la vraie PRESENCE ne transparaissent PAS → Aziz a cru a un "70 trop
petit / espace vide" qui, en plein ecran, N'EXISTAIT PAS. Le bug etait dans la PRESENTATION, pas le render.
Procedure OBLIGATOIRE pour montrer un render data-viz :
1. **Render SEUL en pleine taille** (full HD scale=1, NON rapetisse) — uploade. C'est CA qu'Aziz juge en premier.
2. **Cible SEULE a sa vraie taille** (le storyboard tel que pris, non compresse) — uploade.
3. Le comparatif cote-a-cote = COMPLEMENT seulement, et en HAUTE RESOLUTION (chaque image ~1080px de haut, jamais
   540px). Il sert a MON analyse + au diff GPT (mesure d'ecarts), PAS de preuve de jugement pour Aziz.
4. Si Aziz insatisfait sur la frame figee → rendre le MP4 anime (le mouvement rend mieux justice que la pose finale).
⛔ Ne JAMAIS presenter un cobaye/render via le SEUL cote-a-cote rapetisse. Toujours le plein format d'abord.

## CE QUI RESTE (session fraiche)
Voir [[REPRISE-WORKFLOW-DATAVIZ]] : 3 corrections pixel du cobaye + gate format phase 0 a cabler +
agent vierge de validation a lancer au demarrage + test sur une vraie scene de prod.

## STATUT
✅ Pipeline prouve A→Z (cobaye Maroc "70%", 2026-06-20) : storyboard teal -> breakdown GPT-5.5 (verdict+prompts
   +Tailwind+tailles) -> generation Gemini -> detourage Recraft -> assemblage Remotion -> diff GPT -> render v5
   ~fidele. Les 3 ameliorations du breakdown (Tailwind, intensite calibree, tailles mesurees) decouvertes et gravees.
⏳ A eprouver sur une VRAIE scene de prod + valider par un agent vierge (contexte frais).
