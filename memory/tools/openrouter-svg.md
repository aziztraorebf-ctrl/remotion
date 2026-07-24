# OpenRouter pour la generation SVG — GLM-5.2 (3e modele low-cost)

> ⭐⭐ **MISE A JOUR 2026-07-20 — FABLE 5 teste en SVG (via AGENT workspace, PAS OpenRouter) + comparatif
> 4 modeles sur meme brief (insert "table de negociation" + "hemicycle vote"). Verdict :**
> - **Fable 5 (`model: "fable"` dans l'outil Agent) = EXCELLENT en SVG scene composee**, jamais teste avant.
>   Le plus DETAILLE techniquement des 4 : gradients multiples, cone de lumiere flouté, grain feTurbulence,
>   vignette, silhouettes en perspective (echelle decroissante), groupes `<g id>` PARFAITEMENT nommes +
>   documente lui-meme la numerotation pour l'animation. Ambiance/atmosphere = son point fort. **GRATUIT via
>   plan Claude Max** (ne PAS passer par OpenRouter pour Fable — c'est un modele du workspace, appelable
>   comme n'importe quel Agent). Sortie = bloc ```jsx directement, attributs camelCase (pas de conversion).
> - **Comparatif 4 modeles (GPT-5.6 Sol / Gemini 3.1 Pro / Kimi K3 / Fable 5), meme brief** : tous reussissent
>   le concept. GPT = le plus propre/equilibre (matiere chaude, pret a l'emploi) ; Gemini = geste lumiere le
>   plus dramatique mais centre vide ; Kimi = epure + imbattable cout/vitesse (50s/0,03-0,05$, cf § Kimi K3) ;
>   Fable = le plus atmospherique + code le plus animable. **MIX-AND-MATCH = la vraie force** : Aziz a pris
>   base Fable + plateau-table GPT pour le B4, et decor GPT pour le B3. Preuve : `SoudanActe6TableInsert.tsx`
>   + `SoudanActe6VoteInsert.tsx` (Acte 6 Soudan). Methode validee = 4 modeles meme brief → comparer rendus
>   rasterises (rsvg-convert) → Aziz choisit/mixe les groupes `<g id>` par element.
> - **Pipeline agent Fable SVG** : Agent `subagent_type: general-purpose`, `model: "fable"`, brief = scene +
>   contraintes (viewBox 16:9, `<g id>` nommes animables, camelCase JSX, anti-slop, zero texte). Recuperer le
>   bloc jsx du resultat, reconstruire en composant Remotion (les defs/gradients se collent tels quels).


> R&D 2026-06-24 (branche `rnd/svg-qwen3.6-test`). Test de modeles OpenRouter pour generer du SVG
> (jetons, assets, scenes) a cote de nos modeles principaux GPT-5.5 + Gemini 3.1 Pro.
> Verdict : **GLM-5.2 adopte comme 3e modele complementaire low-cost. Qwen3.6 et MiniMax M3 ecartes.**
>
> ⛔ **MISE A JOUR 2026-07-05** : pour les BATIMENTS/infrastructures complexes statiques (pas les jetons/
> vehicules mobiles), le SVG (GLM ou agent Claude) est BATTU par Gemini image-gen + traitement integration
> (desaturation+cadre) — voir `memory/archive/starters-perimes-2026-07-11/STARTER-PROMPT-inserts-tactiques-soudan.md` § "VERDICT CONFIRME".
> Le SVG reste la bonne reponse pour les elements mobiles/nombreux (jetons, vehicules, effets).
>
> ⭐⭐⭐ **MISE A JOUR 2026-07-10 — GPT-5.6 Sol teste en profondeur (`openai/gpt-5.6-sol` via OpenRouter),
> voir section dediee § "GPT-5.6 Sol" tout en bas du fichier pour le detail complet.** Verdict resume :
> 1. **Portrait/visage rigge** (clignement, parole, expressions) : ✅✅ succes net, premier modele a produire
>    un vrai rig facial anime robuste (teste avec transforms REELS, pas juste lecture JSON).
> 2. **Decor/scene riche statique + elements en translation** (carte, paysage, usine, bateau/soleil/oiseaux) :
>    ✅✅ excellent, bat GPT-5.5 sur ce registre — **remplace GPT-5.5 dans le pipeline** pour ce role.
> 3. **Personnage COMPLET articule** (corps+bras+jambes visibles) : ⛔ mecaniquement solide (rotation sans
>    decrochage) MAIS esthetiquement grotesque a l'oeil ("cutout" visible, segments non fondus) — **NE
>    remplace PAS Gemini** pour un perso destine a bouger en gros plan.
> 4. **Imitation de style depuis une image de reference** : ✅ CAPABLE, mais seulement si on donne l'image
>    ET des contraintes verbales explicites sur le trait/couleur — sans ca, Sol impose son propre style
>    (plus riche/texture) meme quand on lui demande d'imiter. Sans image-ref (texte seul), Sol produit
>    TOUJOURS son registre par defaut, jamais le style plat/lineaire d'un episode existant.

## Role de GLM-5.2 (ce qu'on a decide)

- **GPT-5.5 + Gemini 3.1 Pro restent les modeles PRINCIPAUX** des scenes (Gemini = organique/illustration, GPT = geometrie/schema). On ne change rien a ce pipeline.
- **GLM-5.2 = 3e modele, COMPLEMENTAIRE**, appele pour :
  1. **Jetons / pictogrammes / petits assets SVG en lot** (une planche de N jetons en 1 appel). Usage prouve : `scripts/tools/llm-gen-svg.py --provider glm`.
  2. **Generer plusieurs elements SVG varies pour une scene quand on veut de la qualite** (ex. assets pour une video AES). Il sort des planches d'assets de bon niveau.
  3. **Option de test / 3e voix** quand on veut comparer ou explorer.
- ⛔ **PAS les drapeaux de carte Mapbox** : la regle E2 (`useClipFlags` = vraies images de drapeaux, check bloquant dans `mapbox-selfreview.py`) reste inchangee. GLM genere des assets/pictos, pas les drapeaux geo-ancres.
- ⛔ **PAS le pipeline scenes narratives principal** : ca reste GPT/Gemini.

## Modele exact + prix (OpenRouter)

| Modele | ID OpenRouter | Prix /M tok (in/out) | Vision |
|---|---|---|---|
| **GLM-5.2** (adopte) | `z-ai/glm-5.2` | $1.40 / $4.40 | ❌ TEXT-ONLY |
| GPT-5.5 (principal) | `openai/gpt-5.5` | $5 / $30 | oui |
| Gemini 3.1 Pro (principal) | (API Google directe) | frontier | oui |

GLM = ~5-7x moins cher que GPT-5.5 sur ce qu'il sait faire. Cout d'une planche de 5 jetons ≈ 0,04 cent.

## Gotchas GLM-5.2 (NON-NEGOTIABLE avant appel)

1. **TEXT-ONLY** : pas de vision → on NE PEUT PAS joindre d'image-ref. Le registre doit etre **decrit verbalement** dans le brief, **sans contradiction interne** (cause prouvee du ratage : un brief "paper-cut colore" qui ecrasait un override "encre" → GLM a suivi le corps du brief, pas l'en-tete).
2. **Ne PAS limiter `max_tokens`** : GLM a un mode raisonnement ; un `max_tokens` bas fait que le raisonnement consomme tout et la sortie est vide (`content: None`).
3. **Peut wrapper le SVG dans un HTML + animations CSS** (gotcha Simon Willison) → a l'extraction, **strip le `<style>`/CSS et ne garder que le `<svg>` statique** (notre doctrine interdit le CSS ; l'animation se fait par frame en Remotion).
4. **Vitesse** : ~45-60s pour une planche de jetons (rapide), 3-5 min pour une scene complexe (acceptable).

## Verdict comparatif (4 modeles testes, sur NOS registres reels)

| Modele | Geometrie / technique / schema / jetons | Organique / encre | Vitesse | Validite SVG | Statut |
|---|---|---|---|---|---|
| **GLM-5.2** | ⭐ excellent (≈ GPT-5.5), gagne les jetons 4/5 vs Qwen | faible sur l'ORGANIQUE VIVANT (arbre naif) ; mais l'encre NARRATIVE/schematique passe tres bien (marche CFA prouve) | ok | propre | **ADOPTE (3e modele)** |
| Qwen3.6-35B-A3B (`qwen/qwen3.6-35b-a3b`, $0.14/$1, vision) | tres bon | maigre | ⭐ rapide | parfois invalide (pas de `<svg>` racine, attr dupliques) | ECARTE (un cran sous GLM, ecart prix derisoire) |
| MiniMax M3 (`minimax/minimax-m3`, $0.30/$1.20, vision) | ⭐ excellent (le + fini sur offshore) | (non teste) | ❌ ~7 min/scene | ❌ camelCase JSX a convertir | ECARTE (lenteur impraticable) |
| GPT-5.5 / Gemini 3.1 Pro | references | Gemini = roi organique | ok | propre | PRINCIPAUX (inchanges) |

## Qwen3.6 avec vision vs GLM-5.2 text-only — comparatif retexturing (2026-07-03)

> NUANCE le verdict "Qwen3.6 ECARTE" ci-dessus, sans le contredire frontalement : le test 2026-06-24 jugeait
> Qwen sur la GENERATION generaliste de jetons/scenes. Cette session a teste un usage DIFFERENT et plus etroit :
> retexturer une forme organique SIMPLE deja bien nee (registre gravure/hachures), en LUI MONTRANT une image
> de reference a imiter/depasser. Pas certain qu'il s'agisse d'une vraie contradiction methodologique (le
> tableau ci-dessus mentionne deja "vision" pour Qwen) — plutot un usage plus specifique, non teste en 2026-06-24.

Test comparatif sur 5 elements reels (scene cargo 16:9, brief "registre gravure/hachures, PAS mignon/cartoon") :

| Element | GLM-5.2 (text-only, pas d'image-ref) | Qwen3.6 (avec image-ref a imiter) |
|---|---|---|
| Nuage | ❌ facettes geometriques abstraites, ILLISIBLE comme nuage (echec net malgre bon prompt texte) | ✅ silhouette nuageuse gardee intacte + hachures fines, reconnaissable a 100% |
| Personnage (cueilleur) | non teste | ❌ quasi identique a l'original + objet parasite deconnecte — confirme l'intuition qu'un modele ne "raisonne" pas une pose/structure articulee |
| Arbre | non teste | ⚠️ mitige : tronc reussi (hachures ecorce credibles), houppier ecrase par une trame trop dense (illisible comme feuillage) |
| Vagues/ecume | non teste | ✅✅ franc succes, vraie vague deferlante style estampe japonaise (Kanagawa), reutilisable en banque |
| Cargo (coque+conteneurs) | non teste | ❌ geometrie de coque cassee, ne repose pas sur l'eau — moins bon que le mix-and-match deja fait a la main |

**Verdict pratique** : Qwen3.6 (avec vision + image de reference) est fiable pour RETEXTURER une forme
organique SIMPLE deja bien nee (nuage, vague) — la reference visuelle est la cle : SANS vision, GLM (text-only)
derive trop loin du brief texte vers l'abstraction. Qwen reste PEU FIABLE sur toute structure ARTICULEE/
MECANIQUE (personnage pose, cargo a geometrie precise) — il copie sans reconstruire la logique de construction.
Root cause probable de l'echec GLM nuage : sans reference visuelle, un brief texte meme precis ("reste
reconnaissable comme nuage") peut deriver si le modele n'a rien a comparer.

## Pipeline prouve bout-en-bout (2026-06-24)

GLM genere → JSON `{tokens:{...}}` ou `{scene_svg, groups}` → on transforme en composants React `{f}` (jetons) ou groupes nommes (scene) → **animation par frame en Remotion** (zero CSS) → render.
- Jetons animes : `src/projects/_rnd/svg-scenes/GisementTokensGlm.tsx` + `JetonsGlmDemo.tsx`.
- Scene conceptuelle animee : `FluxPetroleAnimee.tsx` (+ `fluxPetroleGroups.ts`) — diagramme "hemorragie petroliere" niveau Bloomberg/Vox, directement utile aux encarts Souverain.
- Le JSX `f`-driven produit par GLM **compile et tourne dans Remotion sans retouche**.

### Observation 2026-06-27 (scene CFA "bureau 1994", a RECROISER — PAS un verdict)
Brief verbal detaille (8 objets nommes, registre encre analytique, 16:9) → GLM a livre les 8 `<g id>` demandes,
registre respecte, ~174 hachures (suivi la consigne de detail), 0 CSS, propre. Cout 0,03$. Render : files.catbox.moe/arhoxr.png.
- ✅ FORT sur l'OBJET detaille isole (balance ciselee, tampon, fenetre gravee) + respect du registre decrit en mots.
  (Coherent avec ses reussites passees : carte etat-major, jetons, flux petrole — GLM sait BEAUCOUP de scenes, ne pas le sous-estimer.)
- ⚠️ Sur CETTE compo : profondeur/echelles/ancrage manques (fenetre qui flotte). MAIS cause probable = mon brief decrivait
  les objets SANS imposer la perspective/les plans. **A recroiser** avec un brief qui specifie profondeur + echelles relatives.
  ⛔ NE PAS graver "GLM faible en composition" : un seul essai, et il a tres bien compose ailleurs.
- Piste si confirme : **GLM dessine les objets premium → mise en scene/composition cote nous**. A tester, pas acquis.

## Nettoyage SVG (a faire a la lecture, tous modeles)

Fonction commune : extraire le `<svg>`/JSON, **strip `<style>`/CSS**, fix camelCase→kebab (ou l'inverse selon cible JSX), **dedup attributs** dupliques, **wrap dans `<svg viewBox=...>`** si le modele renvoie un fragment de `<g>` sans racine, **fixer les `""` parasites** (GLM/Gemini glissent parfois un guillemet en trop : `470"" />`). (Fait a la main pendant la R&D — a outiller si on industrialise.)

## ⭐⭐ COLORISATION TIMEE de l'encre (lecon 2026-06-25, NE PAS REPERDRE)

**Pour animer la colorisation d'une scene encre/gravure (le trait noir qui se REMPLIT de couleur — doctrine "encre = canevas pour couleur semantique timee"), il FAUT que le brief exige des SURFACES FERMEES colorisables.** Par defaut, GLM (et Gemini) dessinent des CONTOURS (trait, fill="none") — incolorisables : il n'y a aucune surface a remplir. Resultat v1 = marche reste plat, colorisation impossible (echec prouve).

**Le pattern qui marche** (prouve, marche CFA) :
1. Brief : exiger un groupe `<g id="couleurs">` contenant UNIQUEMENT des **formes fermees pleines** (`<path>/<ellipse>/<circle>` avec `fill="<couleur>"`), placees DESSOUS le trait dans le code. Donner les teintes exactes (douces, aquarelle). Les contours+hachures d'encre vont par-dessus, dans les groupes d'objets normaux (fill="none").
2. ⚠️ **GOTCHA CRITIQUE** : le modele met souvent un groupe WRAPPER racine (`id="scene"`) qui ENGLOBE tout, **couleurs comprises** → la couleur apparait en double ET non animee. A l'extraction, **neutraliser les fills couleur dans le groupe wrapper** (`fill="<couleur>"` → `fill="none"`) pour que SEUL le groupe `couleurs` (anime) porte la couleur.
3. Animation : `<Grp body={COULEURS} opacity={clampI(f, debut, fin)} />` → la couleur monte en opacite = l'encre se remplit. Le reste (trait, produits) reste a 1.

Preuve : marche se dessine au trait noir (colorise=0) PUIS se remplit (tomates rouges, riz beige, balance or). Frames : https://files.catbox.moe/fe3u3g.mp4 (beat 2).

## Liens R&D (catbox, rendus de reference)

- Jetons GLM animes : https://files.catbox.moe/jmeup8.mp4 · planche : https://files.catbox.moe/bwmfsn.png
- Jetons Qwen (compare) : https://files.catbox.moe/mc9dpe.mp4 · planche : https://files.catbox.moe/sllx1s.png
- Flux conceptuel anime (GLM) : https://files.catbox.moe/hhftb1.mp4
- Scenes GLM : offshore https://files.catbox.moe/v9ifmb.png · excavatrice https://files.catbox.moe/xhmttd.png · flux https://files.catbox.moe/zzgy2v.png

## Fugu Ultra (Sakana AI) — TESTE et ECARTE pour le SVG (2026-07-02)

> Modele multi-agents orchestre de Sakana AI (`sakana/fugu-ultra` via OpenRouter), sorti 2026-06-15/24.
> TEXT-ONLY (pas de vision). Contexte 1M. Prix nominal $5/$30 par M tok, mais cout REEL observe bien plus
> eleve (raisonnement interne massif). Benchmarks vendeur le positionnent pres de Fable 5 sur SWE-Bench Pro
> — mais ce chiffre ne s'est PAS traduit en avantage sur notre registre SVG personnage.

**Test realise** : meme protocole que le test Gemini vs GPT (§ PERSONNAGE-VIVANT-INDEX) — prompt "pose bank"
texte-pur, personnage figE (couleurs hex explicites), demande de rig hierarchique nomme
(`torso > arm-upper > arm-lower > hand`, translate-au-joint + rotate). 2 poses generees (idle, walk-a),
portees en JSX Remotion, testees en INTERPOLATION continue (`src/projects/_rnd/svg-scenes/_archive/ProtoFuguPoseBankWalk.tsx`
⚠️ archive, exclu du build, compo Root `RND-ProtoFuguPoseBankWalk` desimportee).

**Resultat technique** : ✅ positif — Fugu Ultra produit un vrai rig FK natif (comme Gemini, PAS comme
GPT-5.5) qui tient sous rotation/interpolation sans decrochage aux joints. Qualite visuelle 1er jet bonne
(silhouette digne, couleurs conformes, chapeau/proportions coherents entre les 2 poses).

**MAIS ecarte pour la production** (verdict Aziz 2026-07-02), 3 raisons :
1. **Fiabilite API** : le prompt 5-poses complet (celui qui marche en 1 seul appel avec Gemini) a echoue
   3x de suite (erreur 500 serveur) — a du etre reduit a 1 pose par appel pour obtenir une reponse.
2. **Cout** : $0.38 puis $1.05 pour UNE SEULE pose isolee (vs Gemini : 5 poses coherentes en 1 appel pour
   une fraction du prix — 2-3x moins cher pour LE SET COMPLET, pas juste une pose). Cause probable :
   raisonnement interne de l'orchestration multi-agents (jusqu'a 32625 tokens de sortie pour un SVG de
   3.8K caracteres utiles).
3. **Coherence de style inter-appels** : a change de technique de rendu entre les 2 poses (paths fermes
   sur idle -> lignes stroke-width epais sur walk-a) malgre le meme prompt de personnage — Gemini garde
   une technique de rendu stable sur tout un set genere en un seul appel.

**Verdict Aziz** : "pas overkill en capacite, mais pas rentable" — Gemini 3.1 Pro reste la reference pour
le SVG personnage (moins cher, plus fiable, style stable). Fugu Ultra gardE EN RESERVE pour un futur cas
extremement complexe hors SVG (le texte-only + raisonnement lourd peut avoir un usage ailleurs), pas
reconsidere pour ce registre sauf signal fort contraire. Ne pas re-tester sans raison nouvelle.

Fichiers du test (garde comme preuve R&D, PAS a etendre) : `out/_rnd/fugu-ultra-test/` (prompts, reponses
brutes, SVG extraits, render `fugu-pose-bank-walk.mp4`), `src/projects/_rnd/svg-scenes/_archive/ProtoFuguPoseBankWalk.tsx`
(⚠️ archive, exclu du build).

Voir aussi : [[SVG-SCENES-GENERATIVES]] (doctrine SVG generatif). Modeles principaux : `memory/tools/gemini.md`, CLAUDE.md (bloc modeles verrouilles).

## Comparatif texte-only vs vision-from-storyboard — insert tactique Soudan (2026-07-05)

> R&D pour `memory/archive/starters-perimes-2026-07-11/STARTER-PROMPT-inserts-tactiques-soudan.md`. Meme brief (5 elements : 2 jetons infanterie
> par camp, vehicule technical, impact/explosion, medaillon commandant) envoye a 5 configurations :
> GLM-5.2 texte-only, Qwen3.6 texte-only (sans image), puis un storyboard genere par Gemini 3.1 Flash Image
> envoye en VISION a Gemini 3.1 Pro, GPT-5.5, et Qwen3.6 (vision). But : voir si donner une image de reference
> ameliore la qualite par rapport a un brief texte seul, et comparer les 5 rendus entre eux.

**Gotcha confirme (nouveau)** : `gemini-vision-breakdown.py` a `max_output_tokens=8000` — TROP BAS pour un
brief de 5 formes SVG detaillees en vision. Gemini 3.1 Pro a rendu une reponse tronquee (715 caracteres, coupee
en plein raisonnement interne) au premier essai. Fix : relancer avec `max_output_tokens=32000` (script ad hoc,
pas encore remonte dans le script partage — a faire si on industrialise ce type d'appel vision multi-elements).
Meme famille de gotcha que GLM (le raisonnement interne peut etouffer un budget de sortie trop serre).

**Gotcha camelCase confirme sur GPT-5.5 aussi (pas seulement GLM)** : GPT-5.5 a produit du JSX React
(`strokeWidth`, `strokeLinecap` en camelCase) au lieu de SVG HTML valide (`stroke-width`, `stroke-linecap`).
A la difference de GLM ou c'est un CSS/style a stripper, ici c'est juste une question de convention d'attribut
a convertir avant un rendu HTML brut (le JSX camelCase, lui, fonctionne tel quel dans un composant React/Remotion).

**Verdict Aziz (2026-07-05, tranche)** : **GLM-5.2 texte-only adopte comme candidat principal** pour les
jetons/vehicules/effets de l'insert tactique Soudan. Meme SANS image, le vehicule GLM se rapproche plus du
registre voulu que les 3 versions vision. Qwen (texte ET vision) juge le PLUS FAIBLE des 5 — capacites SVG
clairement en retrait, l'explosion Qwen vision jugee "vraiment etrange". Confirme et durcit le verdict deja
pose dans ce fichier (Qwen "ECARTE" pour generation generaliste) : meme avec vision + image de reference,
Qwen ne rattrape pas GLM sur ce registre. Gemini et GPT vision restent corrects mais plus "semi-realistes"
(volume/hachures) que le registre plat/schematique recherche — pas retenus comme candidats principaux.
**Consequence pratique** : privilegier GLM-5.2 + prompts texte tres precis pour produire les jetons/SVG de
cette video, SANS avoir besoin d'un aller-retour image (storyboard Gemini + vision) a chaque fois — plus
rapide et moins cher (GLM ≈5-7x moins cher que GPT-5.5, cf. tableau prix en tete de fichier).

Fichiers de session (scratchpad, non persistants) : `llm-gen-svg-tactique.py` (variante texte-only du script
`llm-gen-svg.py` adaptee au registre tactique), `gemini-vision-highbudget.py` (wrapper Gemini vision avec
`max_output_tokens=32000`), `prompt-vision-to-svg.txt` (brief vision-to-SVG commun aux 3 modeles).

## GLM-5.2 texte-only — test approfondi mono-element vs storyboard elargi (2026-07-05, suite au verdict ci-dessus)

> Aziz ayant tranche pour GLM-5.2, 2 tests complementaires pour cadrer comment l'exploiter au mieux :
> (1) UN SEUL element (vehicule technical) avec un prompt tres detaille sur la geometrie exacte, pour
> mesurer le gain de "concentration" vs devoir dessiner 5 elements dans le meme appel — (2) un storyboard
> ELARGI a 12 elements/variantes (infanterie isolee/groupe par camp, blinde leger, convoi, frappe aerienne,
> zone assiegee, ligne de front, fleche, medaillon ville, icone deplaces) pour couvrir plus largement les
> besoins reels de la video Soudan. Resultat : https://files.catbox.moe/d0q9pv.png (image, lisible mobile).

**Observation (Claude, a confirmer par Aziz)** :
- **Mono-element** : GLM a ete tres rigoureux — ses notes texte incluent une VERIFICATION GEOMETRIQUE explicite
  (calcul des points extremes vs le rayon de 45 unites demande), et le resultat visuel est plus detaille/soigne
  que sa version du meme vehicule dans le comparatif a 5 elements precedent. Semble confirmer l'hypothese
  d'Aziz : se concentrer sur 1 seul element produit un meilleur rendu qu'un batch de 5.
- **Storyboard elargi (12 elements)** : coherent avec le style deja valide (cercle SAF / losange RSF conserves),
  mais plusieurs elements restent TRES simples (ex: infanterie isolee = juste un cercle + croix, sans le detail
  qu'on voit sur le vehicule mono-element) — possible signe que diviser l'attention sur 12 elements redonne
  le meme compromis "moins de soin par element" que sur 5, meme si aucun n'est un echec (tous lisibles, JSON
  valide, palette respectee).
- **Piste a tester si confirme par Aziz** : privilegier des appels GLM mono-element ou en petits lots (2-3 max)
  pour les elements les plus complexes/critiques (vehicules, effets), et accepter un batch plus large seulement
  pour les elements deja simples par nature (jetons, medaillons, icones basiques).

Scripts de session (scratchpad, non persistants) : `glm-mono-vehicule.py`, `glm-storyboard-elargi.py`.

## GLM-5.2 mono-focus cible sur une vraie sequence — Khartoum 15 avril 2023 (2026-07-05)

> Suite logique du test mono-element/batch ci-dessus : au lieu de tester au hasard, on part du beat #5 DEJA
> ECRIT dans `memory/projects/soudan-midform-STORYBOARD-ACTE2.md` (attaque RSF simultanee sur Khartoum,
> aeroport + palais presidentiel + tour TV, matin du 15 avril 2023) et on complete le storyboard elargi avec
> les 3 elements qui manquaient pour monter une vraie sequence de 25-30s. 3 appels GLM-5.2 mono-focus/petit-lot :
> (A) 3 icones de batiments-cibles nommes en 1 appel coherent, (B) une colonne RSF EN MOUVEMENT (lignes de
> vitesse graphiques, pas d'unite statique), (C) un marqueur "impact sur batiment" distinct de l'explosion en
> terrain ouvert deja produite (doit rester semi-transparent pour laisser voir le batiment dessous).
> Resultat : https://files.catbox.moe/dwf58o.png (image, lisible mobile).

**Resultat (Claude, observation directe, PAS encore le jugement Aziz)** :
- **Appel A (batiments-cibles)** : REUSSI, le meilleur des 3. Aeroport (piste + marquage pointille + terminal),
  palais (cour interieure carree au centre = symbole clair de residence officielle), tour TV (croix rayonnante
  = antenne vue en plongee) — tous immediatement identifiables, style coherent entre eux (meme epaisseur de
  trait, meme palette neutre #8a7d63, comme demande).
- **Appel B (colonne en mouvement)** : correct mais discret. Les 3 vehicules alignes en diagonale + lignes de
  vitesse fonctionnent, mais le detail "canon qui depasse" (mis en avant dans le test mono-vehicule precedent)
  est moins visible ici, une fois les vehicules miniaturises pour la formation.
- **Appel C (impact sur batiment) — ECHEC PARTIEL A CORRIGER** : GLM annonce dans ses notes texte un
  `fill-opacity=0.4` pour garder le batiment visible dessous, MAIS le halo produit est plus GRAND que l'icone
  du batiment et la COUVRE presque entierement une fois superpose (teste avec aeroport+impact) — l'objectif
  de "batiment qui reste lisible sous l'impact" n'est PAS atteint visuellement, malgre une opacite techniquement
  correcte. **Cause probable** : le rayon du halo (~30 unites) est du meme ordre que le rayon des batiments
  (~30-35 unites) — a un ratio d'echelle egal, meme semi-transparent, un aplat de couleur recouvre la quasi
  totalite du dessin en dessous. **Prochaine iteration a tester** : soit contraindre le rayon du halo a etre
  NETTEMENT plus petit que le batiment (ex: max 15-18 unites au lieu de 30), soit demander explicitement a GLM
  de ne PAS remplir le centre (juste un contour + quelques eclats ponctuels, sans aplat de fond du tout).

**Lecon methodologique confirmee** : ancrer les prompts de test sur un VRAI beat de script deja ecrit (au lieu
d'elements generiques inventes) a permis de reperer un vrai probleme de composition (superposition halo/batiment)
qu'un test isole n'aurait pas revele — l'appel C paraissait bien en isolation (voir sa case dans l'image), le
probleme n'apparait qu'en CONTEXTE D'USAGE REEL (superpose a la cible). A refaire systematiquement : tester les
elements graphiques dans leur contexte de composition final, pas seulement isoles sur fond neutre.

Scripts de session (scratchpad, non persistants) : `glm-seq-khartoum-appel-a.py`, `glm-seq-khartoum-appel-b.py`,
`glm-seq-khartoum-appel-c.py`.

## ⭐⭐ Pipeline GLM-5.2 (premier jet) → agent Sonnet 5 (raffinement) — CONFIRME (2026-07-05)

> Suite du test mono-focus ci-dessus. Aziz juge les 3 batiments-cibles GLM "pas vraiment reconnaissables" (trop
> simples geometriquement) et propose un pipeline en 2 temps au lieu de re-prompter GLM en boucle : GLM produit
> un premier jet rapide/bon marche, PUIS un agent Claude (Sonnet 5, contexte vierge, 1 agent par element, en
> parallele) reprend le SVG BRUT existant et l'enrichit vers un rendu premium — sans repartir de zero, en
> gardant les memes contraintes (rayon, palette, top-down strict).

**Resultat CONFIRME et net sur les 3 elements** (aeroport, palais presidentiel, tour TV — sequence Khartoum
15 avril 2023) : https://files.catbox.moe/o1o76m.png (avant/apres, image lisible mobile).
- **Aeroport** : GLM = piste + 1 rectangle "terminal" plat. Agent = piste + taxiway parallele + bretelles
  obliques + tarmac avec avions stylises en epi + terminal en forme de "doigt"/pier + tour de controle. Se lit
  immediatement comme aeroport.
- **Palais presidentiel** : GLM = carre plein avec petit carre vide au centre. Agent = architecture en U/fer a
  cheval autour d'une cour d'honneur, mur d'enceinte peripherique pointille, jardins symetriques aux 4 coins,
  allee d'acces axiale menant a une grille d'entree — la signature visuelle reconnaissable d'un complexe
  gouvernemental vu du ciel (symetrie + axe + cour).
- **Tour TV** (deja jugee correcte par Aziz avant ce test) : GLM = croix+X rayonnant depuis un carre central.
  Agent = meme motif central PRESERVE (pour ne pas perdre l'acquis) + haubans asymetriques vers des ancrages
  excentres + batiment technique/studio distinct + base en treillis losange — enrichissement reussi meme sur
  un element deja juge bon, sans le degrader.

**Verdict methodologique** : le pipeline **GLM (rapide/pas cher) → agent Sonnet 5 en parallele (raffinement,
contexte vierge par element)** fonctionne et est net a l'oeil sur les 3 cas testes. Confirme la piste deja
notee dans ce fichier (§ observation CFA 2026-06-27 : "GLM dessine les objets premium → mise en scene/
composition cote nous"). **A retenir comme methode standard pour les prochains elements SVG de cette video** :
ne pas chercher a obtenir le rendu final en 1 seul appel GLM — accepter un premier jet GLM correct-mais-simple,
puis systematiquement lancer un agent Sonnet 5 par element (en parallele si plusieurs elements) pour l'enrichir,
en lui donnant le SVG brut existant + les memes contraintes geometriques/palette que l'appel GLM original.

Prompts d'agent utilises : demander explicitement (1) ce qui manque pour que l'element soit "vraiment
reconnaissable" comme le vrai objet (pas une forme geometrique abstraite), (2) s'inspirer de vraies photos
aeriennes/vues zenithale du type d'objet reel, (3) garder les contraintes numeriques exactes (rayon, palette,
top-down strict, SVG statique sans CSS/JS) deja validees par le premier jet GLM.

## ⭐ SVG source litteral (pas l'image PNG) comme patron pour toute generation de pose/asset via LLM vision

Lecon gravee dans `src/projects/_shared/personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md` § "Deux
systemes distincts" (session 2026-07-02) : pour garder la continuite d'un personnage/registre entre
plusieurs appels a un modele vision (Gemini, GLM avec image, etc.), donner le **code SVG source litteral**
en patron dans le prompt est nettement superieur a donner seulement l'image PNG rendue en reference —
l'image seule fait deriver la geometrie (proportions, structure de groupes) meme quand les couleurs sont
explicites. Applicable a toute generation de pose/variante SVG via LLM, pas seulement ce personnage precis.

## ⭐⭐ GPT-5.6 Sol (`openai/gpt-5.6-sol` via OpenRouter) — teste 2026-07-10, jour +2 apres sortie (9 juillet)

> Sortie publique du 9 juillet 2026 (limited preview 26 juin). Famille GPT-5.6 = 3 tiers durables (Sol
> flagship $5/$30 par M tok, Terra equilibre $2.50/$15, Luna rapide $1/$6 — le NUMERO marque la generation,
> le NOM marque un palier de capacite qui peut evoluer independamment). Recherche Tavily prealable (voir
> session) : retours communaute MITIGES sur le frontend/SVG anime specifiquement (un benchmarker YouTube
> note Sol 6-7/10 vs Fable 5 9-10/10 sur SVG panda/animations JS ; double le score GPT-5.5 mais reste
> derriere Fable/Opus) — nos tests confirment un tableau plus NUANCE que "bond generalise".

**3 registres testes, verdicts opposes selon le registre — PAS un simple "meilleur partout" :**

### 1. Carte/schema compose (registre Souverain, prompt vision reutilise du test Khartoum "3 cibles")
✅ **Net progres vs GPT-5.5 et Gemini sur CE prompt precis**. Sol a invente une grammaire cartographique
complete que ni GPT-5.5 ni Gemini n'avaient produite spontanement : cadre coins biseautes type dossier
militaire, rosace nord + grille de coordonnees, cartouche legende separee, sous-titres par cible
("OBJECTIF 01 - TRANSMISSIONS"), quartiers nommes, numero de dossier. Batiments plus lisibles en top-down
(aeroport = vrai fuselage d'avion stylise, original). Gemini reste superieur en texture/matiere (hachures
plus fines) mais composition plus minimale. Cout : 0,295$/appel (comparable GPT-5.5).
Fichiers scratch (non conserves dans repo) : render `khartoum-svg-sol-render.png`.

> ⭐ **CORRECTION 2026-07-17 (Aziz) — le SVG ANIMABLE se DEMANDE, il n'est pas hors de portee.** Un ancien
> rail nous faisait croire que Sol/GPT ne rendaient "que des images/PNG statiques". FAUX : ils ne donnaient
> pas de SVG animable parce qu'on ne le DEMANDAIT pas explicitement. Pour une carte/schema compose (registre
> #1, dont Kosti etat-major), demander DES LE PROMPT : (1) sortie **SVG vectoriel** (pas raster), (2) chaque
> element mobile/modifiable dans un **`<g id="...">` nomme** (drone, chaque jeton-civil, station, fumee,
> impact), (3) **coordonnees absolues** de chaque groupe + un **JSON de positions/plages de translation
> suggerees** en fin de reponse, (4) zero CSS/HTML wrapper (on anime en Remotion frame-driven — striper tout
> `<style>` a l'extraction). ⚠️ Budget tokens : viser MODERE (~8-12k), PAS enorme. Nuance (clarifiee
> 2026-07-17, cf `gemini.md` gotcha lenteur SVG) : un `max_tokens` trop BAS => sortie vide/tronquee (le
> reasoning cache de Sol/GLM consomme tout) ; mais trop HAUT (32-40k) => le modele sur-reflechit et met
> 8min+. Le bon reglage est entre les deux (ou absent/defaut si le provider s'arrete proprement), + un
> `timeout` dur (240s). Distinct du registre #2 (perso articule complet) ou Sol echoue : un JETON
> (position + fade) n'est PAS un squelette a articuler, donc Sol convient.

### 2. Personnage articule/animable (prompt EXACT du test decisif documente ci-dessus, § "LE VRAI TEST DECISIF")
❌ **MEME ECHEC STRUCTUREL que GPT-5.5, pas le comportement Gemini.** Genere les 4 poses (idle/walk-a/
walk-b/bend-reach) avec la MEME topologie de groupes demandee, silhouette et anatomie VISUELLEMENT
meilleures que le premier jet GPT-5.5 d'origine (bend-reach bien pese, bassin qui recule correctement).
MAIS verification XML brute sans appel : **0 `rotate()`, 3 `translate()` seulement (non-imbriques,
juste tete/chapeau/torse positionnes)** — chaque membre est un `<path>` en COORDONNEES ABSOLUES, pas une
hierarchie `translate(joint) rotate(angle)` imbriquee. Sol "pense illustration figee", pas "squelette
articule" — n'a pas herite du comportement spontane de Gemini sur ce type de prompt. Consequence probable
non testee ici (mais deductible du pattern GPT-5.5 deja documente) : interpolation entre poses = cut sec,
pas de balancement fluide. **Gemini 3.1 Pro reste donc le SEUL choix pour un personnage destine a etre
anime en continu.** Cout : 0,191$/appel (6262 tokens dont 1837 de reasoning interne).

### 3. Organique statique (portrait visage + animal) — ⭐⭐ le vrai signal nouveau de cette session
✅✅ **Franc succes sur les 2 tests, nettement au-dessus de GPT-5.5/GLM sur ce registre.**
- Portrait pecheur senegalais (buste, chapeau de brousse) : visage EXPRESSIF avec vraie texture (hachures
  de peau sur front/joues/machoire, regard habite/sourcils fronces qui donnent du caractere), tressage du
  chapeau detaille avec ombrage — tres au-dessus du "2 points pour les yeux" habituel GLM/GPT-5.5.
- Aigle en vol (ailes deployees) : plumage credible en groupes de plumes stylisees (PAS geometrique plat,
  PAS 200 plumes individuelles), vraie sensation de mouvement (lignes de vitesse, posture dynamique),
  anatomie d'aile coherente, serres repliees correctement en vol.
- Se rapproche ou egale ce qu'on attendait seulement de Gemini sur l'organique jusqu'ici — **candidat
  serieux pour tout portrait/personnage FIGE/animal/texture organique**, a confirmer par un comparatif
  cote-a-cote direct avant adoption definitive (pas encore fait). Cout : 0,172$ (portrait) / 0,151$ (aigle).

**Gotcha operationnel observe (latence variable, pas un bug reseau)** : les appels d'EXECUTION concrete
(dessiner un SVG contraint) repondent en 1-4min. Un appel de PURE REFLEXION META (demander a Sol d'analyser
ses propres limites SVG vs GPT-5.5/Gemini/Claude) a timeout 2x de suite (>3min sans reponse, essaye a la
fois avec `reasoning: medium` explicite et sans override) — abandonne sans reponse obtenue. Hypothese : les
questions ouvertes/auto-reflexives/comparatives-nommees declenchent plus de reasoning interne cache
(facture mais invisible) que les taches convergentes d'execution, peut-etre amplifie par les garde-fous
"positionnement produit" du system card Sol. Ne pas re-tenter ce type de question sans raison forte.

**Verdict operationnel resume** : Sol n'est PAS un remplacement generalise de Gemini/GPT-5.5, mais un
AJOUT cible pertinent pour 2 registres precis (carte/schema compose riche ; portrait/animal organique
statique). Ne pas l'utiliser pour un personnage anime en continu (Gemini garde ce role). A re-tester
si adoption confirmee : comparatif direct cote-a-cote Sol vs Gemini sur un MEME brief organique pour
trancher lequel devient le candidat principal de ce registre.

### ⭐⭐⭐ Portrait VISAGE rig-first — SUCCES, contrairement au corps entier (2026-07-10, meme session)

> Question d'Aziz apres le §3 ci-dessus : "un bon SVG devrait permettre de manipuler la bouche/cligner
> des yeux, sinon c'est inutile". Reflexe correct confirme par ce test : **regenerer de zero avec la
> contrainte de rig des la conception, PAS demander a rigger une image deja generee** (le probleme que le
> § "reproduire une pose" vs "concevoir pour l'animation" avait deja identifie plus haut dans ce fichier —
> reproduire une image existante est un probleme DIFFERENT et plus dur que concevoir nativement pour
> l'animation).

**Protocole** : meme structure que le test "rig-first" GPT-5.5 deja documente dans
`PERSONNAGE-VIVANT-INDEX.md` (qui avait ECHOUE — JSON de pivots cheerful mais rotation reelle decrochait
les membres), applique cette fois au VISAGE plutot qu'au corps. Prompt texte-pur (pas d'image-ref)
demandant explicitement des groupes nommes exacts (`eyebrow-left/right`, `eye-left/right-open`,
`eyelid-left/right`, `mouth-neutral`, `mouth-open`, `head`, `hat`) + JSON de pivots {pivot_x, pivot_y,
purpose} pour chacun.

**Resultat structurel** : ✅ tous les groupes demandes presents avec les BONS id. Sol a meme livre le
mecanisme lui-meme : `eyelid-left/right` ont un `transform="translate(0 y_pivot) scale(1 0.08)
translate(0 -y_pivot)"` DEJA code en dur (paupiere quasi fermee par defaut, prete a etre pilotee), et
`mouth-open` a `opacity="0"` par defaut (pret pour cross-fade). Pas juste des groupes nommes a posteriori —
un vrai design pense pour le pilotage code des la genese.

**LE VRAI TEST (transforms reels appliques, pas juste lecture du JSON)** : proto Remotion
`src/projects/_rnd/svg-scenes/ProtoSolPortraitRigTest.tsx` (`RND-ProtoSolPortraitRigTest`) — clignement
(scale Y anime depuis le pivot rapporte, en PLUS du scale de base du SVG source), parole (cross-fade
opacity mouth-neutral/mouth-open), hochement de tete (rotate autour du pivot head 300,282). **SUCCES NET
sur les 4 etats verifies visuellement** (repos/clignement/parole/tilt, contact sheet
`rigtest-final-sheet.png`) : paupieres qui ferment proprement SANS deformer les joues/sourcils voisins,
bouche qui s'ouvre avec interieur coherent sur le MEME point d'ancrage (pas de saut), tete qui incline
legerement sans decrochage visible avec le cou (non rigge). **Contraste net avec l'echec GPT-5.5** (rotation
meme moderee au coude/epaule = decrochage visible) — ici, meme epreuve de "transform reel applique", zero
decrochage observe.

**Conclusion operationnelle** : Sol reussit le rig-first sur le VISAGE la ou GPT-5.5 avait echoue sur le
CORPS — pas necessairement une capacite generale "Sol rig mieux que GPT-5.5" (a nuancer, un seul test), mais
un signal fort et actionnable : **le visage rigge (clignement/parole/tete) est un nouveau registre
exploitable pour notre pipeline**, complementaire au rig corporel Gemini (marche/gestes complets, role
inchange). Cout cumule ces 2 essais (1er jet illustration + rig-first) : ~0,35$.

**A tester si cette piste est reprise en production** : (1) plusieurs variantes d'expression (sourire,
serieux, surprise — comme le catalogue GeminiRig existant) generees separement puis cross-fadees ; (2) un
2e personnage pour verifier la reproductibilite du pattern (n'est-ce pas un coup de chance sur ce prompt
precis ?) ; (3) integrer un vrai clignement PERIODIQUE naturel (pas juste 3 clignements scriptes) comme
fait pour d'autres rigs de production.

Fichiers de session (scratchpad, non persistants) : `test-gpt56-sol-khartoum.py`, `gen-pose-bank-sol.py`,
`gen-organic-sol.py`, `gen-portrait-rigfirst.py`, prompts et SVG bruts associes. Fichier CONSERVE dans le
repo (proto reutilisable) : `src/projects/_rnd/svg-scenes/ProtoSolPortraitRigTest.tsx`.

### ⭐⭐⭐⭐ REVIREMENT MAJEUR — personnage COMPLET rig-first (corps entier) : SUCCES (2026-07-10, meme session)

> Suite directe du point precedent. Aziz a pousse plus loin avec 2 questions : (1) peut-on avoir des
> expressions variees (sourcils faches) sur CE visage ? (2) peut-on avoir un personnage COMPLET (bras+jambes
> visibles qui bougent), pas juste un buste ? Ma reco initiale etait prudente : le test precedent du MEME
> jour sur la banque de poses (walk-a/walk-b, prompt SANS contrainte de rig explicite) avait echoue
> exactement comme GPT-5.5 (0 rotate, paths absolus) — donc hypothese de depart = le succes du visage ne
> se generalise probablement pas au corps entier. **Cette hypothese s'est revelee FAUSSE.**

**1. Expressions faciales** (`prompt-sol-expressions.txt`, memes contraintes rig-first que le portrait,
mais demandant 3 variantes eyebrow-left/right + mouth : neutral/angry/surprised, MEME pivot partage entre
variantes) : ✅ succes net. Les 3 expressions lisibles instantanement (neutral calme, angry = sourcils
tombants en V + bouche pressee dure, surprised = sourcils hauts arques + bouche en "o") sur EXACTEMENT
la meme geometrie de base (yeux/nez/oreilles/chapeau identiques) — Sol a gere seul l'opacity par defaut
(`opacity="1"` sur -neutral, `"0"` sur -angry/-surprised) ET des pivots identiques entre les 3 variantes
d'une meme partie (verifie : `data-pivot-x="230" data-pivot-y="270"` pour les 3 versions de eyebrow-left).
Contact sheet : `expr-contact-sheet.png`. Cout 0,151$.

**2. Personnage COMPLET (buste+bras+jambes, profil, prompt EXPLICITEMENT rig-first avec hierarchie
IMBRIQUEE demandee)** : ✅✅ **succes total, LE resultat le plus significatif de la session.**

Protocole strict (prompt `prompt-sol-fullbody-rigfirst.txt`) : demande explicite d'une hierarchie
`torso > leg-upper > leg-lower > foot` et `torso > arm-upper > arm-lower > hand` avec CHAQUE enfant
positionne EN COORDONNEES LOCALES RELATIVES AU PARENT (comme un vrai squelette 2D cutout-puppet), + JSON
de pivots avec `parent_joint` explicite. **Verification structurelle du XML brut** (pas juste le JSON,
la vraie balise) : les `<g>` sont REELLEMENT imbriques (`leg-lower-front` est un enfant XML DE
`leg-upper-front`, pas un sibling au meme niveau) — **23 `translate()` ET 23 `rotate()`**, ratio 1:1
coherent avec un squelette complet (contraste total avec le test walk-bank du meme jour : 0 rotate).

**LE VRAI TEST (rotations reelles appliquees, proto Remotion, pas juste lecture du XML)** :
`src/projects/_rnd/svg-scenes/ProtoSolFullbodyRigTest.tsx` (`RND-ProtoSolFullbodyRigTest`) — rotation
simultanee epaule (-70deg) + coude (+45deg) + hanche (-60deg) + genou (+65deg), amplitude LARGEMENT
superieure aux ~20-25deg qui avaient fait decrocher le bras dans le test GPT-5.5 documente plus haut dans
ce fichier (§ PERSONNAGE-VIVANT-INDEX). **Resultat : AUCUN decrochage visible sur toute l'amplitude testee**
— bras et jambe restent des chaines visuellement connectees et credibles (contact sheet
`fbtest-contact-sheet.png`, video rendue et confirmee par Aziz). Cout 0,231$.

**Conclusion operationnelle — la nuance qui compte** : ce n'est PAS "Sol rig mieux que GPT-5.5 en general"
(le test walk-bank du meme jour, SANS la contrainte de hierarchie imbriquee explicitement demandee, a
echoue pareil que GPT-5.5) — c'est plutot **"Sol EST CAPABLE de produire une vraie hierarchie squelette
imbriquee QUAND on la lui demande frontalement et en detail (parent/enfant, coordonnees locales, test
mental de rotation demande dans le prompt lui-meme)"**, la ou GPT-5.5 avait echoue MEME quand on le lui
demandait explicitement (le fameux test "rig-first" de GPT-5.5 avait produit un JSON de pivots plausible
mais AUCUNE hierarchie XML reelle — juste des paths absolus annotes a posteriori). C'est un vrai saut de
capacite generative, pas juste un meilleur prompt de notre part (le meme type de prompt avait deja ete
tente sur GPT-5.5 sans succes).

**Portee** : Sol devient un candidat serieux pour un personnage COMPLET (visage expressif + corps articule)
dans un seul modele — combinaison qu'on n'avait jusqu'ici qu'en cumulant 2 pistes distinctes (Gemini pour
le corps, rien de fiable pour un visage rigge). Reste a valider avant adoption production : (1)
reproductibilite sur un 2e personnage/sujet (un seul test reussi pour l'instant) ; (2) integration a un
vrai cycle de marche complet (ce test = pose figee + rotation isolee, pas un pas coordonne) ; (3)
coherence de style si on genere plusieurs poses du MEME personnage en plusieurs appels (risque deja
documente ailleurs dans ce fichier : la coherence inter-appels n'est pas garantie).

Fichiers de session (scratchpad, non persistants) : `prompt-sol-expressions.txt`,
`prompt-sol-fullbody-rigfirst.txt`, `gen-sol-generic.py`, SVG et JSON de pivots associes. Fichier CONSERVE
dans le repo (proto reutilisable) : `src/projects/_rnd/svg-scenes/ProtoSolFullbodyRigTest.tsx`. Videos de
preuve (catbox) : portrait rig `https://files.catbox.moe/lzh7rx.mp4`, corps complet rig
`https://files.catbox.moe/i4yc5z.mp4`.

### ⛔ CORRECTIF JUGEMENT AZIZ — personnage complet : mecaniquement solide MAIS esthetiquement grotesque

> Apres avoir VU la video (pas juste le diagnostic XML), Aziz corrige le verdict "succes total" ci-dessus :
> le portrait reste excellent, MAIS le corps complet est jugé **desarticule/grotesque** a l'oeil — "on voit
> litteralement du cutout", les bras ne semblent pas continus. Verdict Aziz : **ne remplace PAS Gemini pour
> un personnage complet anime**, meme si le rig ne decroche pas mecaniquement.

**Root cause (analyse a froid de l'image de repos, pas juste le mouvement)** : Sol dessine chaque segment de
membre comme une CAPSULE quasi-cylindrique ISOLEE avec son propre contour ferme complet — a CHAQUE jointure
(epaule/coude/hanche/genou) le contour d'un segment se termine et un autre recommence, sans fusion de
silhouette. Resultat : "pantin en papier decoupe" meme a l'ARRET (visible sur `sol-fullbody-rest.png` : le
coude a un changement de diametre en marche d'escalier). **Sol a resolu le probleme MECANIQUE (rotation sans
decrochage, § ci-dessus, verifie et confirme) mais PAS le probleme ESTHETIQUE (silhouette organique
continue)** — ce sont 2 problemes distincts. Cette distinction n'etait pas capturee par la seule verification
XML/rotation — la lecon methodologique : **verifier aussi le jugement visuel a l'oeil sur l'image de repos**,
pas seulement la robustesse mecanique sous transform.

**Comparaison a Gemini** : Gemini reste superieur sur ce registre precis car il "pense silhouette organique
globale" avant de decouper en groupes (comportement deja documente dans ce fichier), alors que Sol semble
avoir approche le probleme dans l'autre sens : assembler des pieces qui pivotent proprement, en sacrifiant
la fusion visuelle aux jointures.

**VERDICT REVISE, definitif pour ce chantier** : ⛔ Sol N'EST PAS un remplacement de Gemini pour un
personnage COMPLET anime (corps+bras+jambes visibles). Le succes du visage seul (buste, § ci-dessus) reste
valide et confirme. Piste future si reprise : tester le rig CAPSULE existant (`capsuleSegment.ts`, deja en
prod) comme reference de style a MONTRER a Sol (pas a rigger apres coup, mais comme exemple de "comment
fondre les segments" dans un futur prompt) — non teste, hypothese seulement.

### ⭐⭐ Sol = decor/scene RICHE anime en TRANSLATION (pas de rig articule) — succes confirme (meme session)

> 3e test de la meme session, suite a la question Aziz "et une vraie scene narrative complete (extrait
> CargoVoyage) ?". Angle choisi : tester Sol comme illustrateur de DECOR (son point fort deja prouve 2x :
> carte Khartoum, portrait/aigle) + verifier si bateau/soleil/oiseaux peuvent etre animes en TRANSLATION
> simple (pas de rotation/rig articule — le probleme different qui vient d'echouer ci-dessus).

Prompt texte-pur (`prompt-sol-cargoscene.txt`) : scene 16:9 depart Afrique de l'Ouest (cacaoyers avec cabosses,
collines, ocean avec profondeur, soleil bas au lever avec halo en couches, cargo simple, 1-2 oiseaux), avec
contrainte explicite : `sun`/`ship`/`bird-1`/`bird-2` = groupes SEPARES a origine locale stable (translate
seulement, pas de rotation), `smoke-wisp` = enfant de `ship` mais anime independamment (pulsation). JSON de
coordonnees de depart + plages de translation suggerees demande en sortie.

**Resultat visuel** : ✅✅ tres au-dessus de la reference PROTO en production (silhouettes plates, soleil
disque uni) — halo de soleil 3 couches realiste, ocean avec bandes de profondeur + reflet lumineux, 12
cacaoyers avec cabosses varies (Sol a utilise `<use href="#cacao-tree">`/`<use href="#cacao-pod">` sur 2
`<defs>` reutilisees — optimisation spontanee, pas demandee). Bateau unifie coque anthracite + ligne de
flottaison rouge + conteneurs varies (rust/ochre/green) + fumee texturee.

**Structure verifiee** : groupes `sun`, `ship`, `bird-1`, `bird-2` bien SEPARES avec origine locale stable,
JSON de coordonnees plausible (`ship: x=400 suggeré translate -1050..1550`). Proto Remotion
`ProtoSolCargoSceneTest.tsx` (`RND-ProtoSolCargoSceneTest`) : bateau qui navigue (translate x), soleil qui
monte+derive (translate x/y), fumee qui pulse (scale+opacity independant du deplacement du bateau), oiseaux
qui glissent en diagonale — **tout fonctionne proprement**, aucun probleme (previsible : translation/scale
sur groupes stables, pas le probleme d'articulation qui a fait echouer le personnage complet). Cout 0,226$.

**Conclusion operationnelle, cette session au complet** : Sol vaut le remplacement de GPT-5.5 dans le
pipeline pour TOUT ce qui est portrait/decor/carte/schema/element en translation simple (meilleur rapport
capacite/prix confirme sur 5 registres distincts) — MAIS reste ECARTE pour tout personnage COMPLET articule
destine a un mouvement crédible en gros plan (Gemini garde ce role, seul candidat qui "pense corps organique"
nativement). Portrait/visage riggé (clignement/parole/expressions) = nouveau registre EXPLOITABLE pour Sol,
independant du corps.

Video de preuve (catbox) : scene decor animee `https://files.catbox.moe/yx6ur5.mp4`. Fichier CONSERVE dans
le repo : `src/projects/_rnd/svg-scenes/ProtoSolCargoSceneTest.tsx`.

### ⭐ Test imitation de STYLE depuis une image de reference (2026-07-10, dernier test de la session)

> Suite a un 4e test (usine cacao texte-pur, SANS image-ref) que Aziz a juge a raison NON CONCLUANT — Sol a
> produit sa propre esthetique riche/texturee (traits epais variables, degrades partout, hachures obliques,
> ombre floue) au lieu du registre PLAT/LINEAIRE de l'episode cacao-chocolat reel (trait fin constant, aplats
> purs, ombre simple). J'avais d'abord affirme a tort une "polyvalence de style confirmee" en ne comparant
> que le SUJET/composition, pas le vrai traitement graphique — **erreur de jugement corrigee sur demande
> d'Aziz**, comparaison cote-a-cote refaite honnetement. Ce test n'a PAS ete conserve/documente en detail
> (verdict : style par defaut de Sol ≠ style plat de cet episode, sans image-ref).

**Test de rattrapage reussi** : meme usine, cette fois avec l'image reelle (`usine70.png`, frame extraite de
`out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4` ~1:10) envoyee en REFERENCE DE STYLE + instructions verbales
explicites sur les caracteristiques a matcher (trait fin constant, aplats purs sans degrade/hachure, fond
creme neutre, ombre simple), avec LIBERTE CREATIVE totale sur le sujet/composition (pas de copie).

**Resultat : ✅ succes net, contraste total avec le test sans image-ref.** Sol a reproduit fidelement le
registre plat/lineaire (verifie point par point : trait fin regulier, aplats sans degrade, ombre ellipse
simple, fond neutre) tout en inventant librement son propre contenu — un planteur en stick-figure (meme
registre pictogramme que le reste de notre pipeline !), un panneau "CACAO COOP", des sacs "BEANS/CACAO/
COOP", un cacaoyer, un logo cabosse, un texte d'accroche cohérent ("De la cabosse a la valeur locale").

**Conclusion operationnelle (la plus actionnable de toute la session)** : Sol ne devine PAS un style depuis
une simple mention texte de registre existant — il faut TOUJOURS lui donner (a) une image de reference du
style visé ET (b) des contraintes verbales explicites sur le traitement graphique (epaisseur de trait, aplat
vs degrade, traitement d'ombre). Avec ces 2 ingredients, il imite fidelement tout en gardant sa capacite
d'invention de contenu. **Implication pratique pour la production** : pour generer une NOUVELLE scene devant
rester visuellement coherente avec un episode DEJA EN COURS/EXISTANT, toujours joindre une frame de
reference + une description explicite du traitement (pas juste "meme style que d'habitude").

Fichiers CONSERVES (rapatries hors scratchpad ephemere, `out/_rnd/gpt-5.6-sol-svg-test/`) :
`sol-styleimit.svg` (SVG source), `sol-styleimit.png` (rendu), `style-comparison-v2.png` (comparaison
cote-a-cote qui a permis le verdict correct), `sol-styleimit-pivots.json`.

## ⭐⭐⭐ SYNTHESE FINALE SESSION 2026-07-10 — GPT-5.6 Sol, verdict complet et fichiers de preuve

**Decision operationnelle** : adopter GPT-5.6 Sol (`openai/gpt-5.6-sol` via OpenRouter, prix ≈ GPT-5.5) en
remplacement de GPT-5.5 pour : cartes/schemas composes, decors de scene riches, portraits/personnages
organiques STATIQUES ou avec rig facial (visage seul). NE PAS l'utiliser pour un personnage COMPLET
articule destine a bouger en gros plan (bras/jambes visibles) — Gemini 3.1 Pro garde ce role exclusif.

**Tableau recapitulatif des 6 tests** :

| # | Test | Registre | Verdict | Fichier preuve permanent |
|---|---|---|---|---|
| 1 | Carte tactique Khartoum (vision, prompt reutilise) | Carte/schema compose | ✅✅ bat GPT-5.5 et Gemini | `khartoum-svg-sol-render.png` (scratchpad, non rapatrie) |
| 2 | Banque de poses corps (texte, SANS rig-first explicite) | Personnage anime | ❌ meme echec que GPT-5.5 (0 rotate) | non conserve |
| 3 | Portrait + aigle (texte, organique statique) | Illustration organique | ✅✅ excellent, rivalise Gemini | `sol-portrait-pecheur.svg`, `sol-aigle.svg` |
| 4 | Portrait RIG-FIRST (texte, visage anime) | Visage rigge | ✅✅ succes total, teste avec vrais transforms | `sol-portrait-rigfirst.svg` + `rigtest-final-sheet.png` |
| 5 | Expressions faciales (neutral/angry/surprised) | Visage rigge | ✅ succes net | `sol-expressions.svg` + `expr-contact-sheet.png` |
| 6 | Personnage COMPLET rig-first (texte, corps entier) | Personnage anime | ⚠️ mecanique OK, esthetique grotesque | `sol-fullbody-rigfirst.svg` + `fbtest-contact-sheet.png` |
| 7 | Scene cargo (texte, decor+translation) | Decor riche anime | ✅✅ excellent, bat la reference proto | `sol-cargoscene.svg` + video `https://files.catbox.moe/yx6ur5.mp4` |
| 8 | Scene usine SANS image-ref (texte seul) | Decor riche (imitation style) | ❌ style par defaut Sol, PAS le style de l'episode | non conserve (verdict initial errone corrige) |
| 9 | Scene usine AVEC image-ref + contraintes verbales | Imitation de style | ✅ succes net, style fidelement reproduit | `sol-styleimit.svg` + `style-comparison-v2.png` |

**Protos Remotion CONSERVES dans le repo** (composition + animation reelle testee, pas juste le SVG brut) :
- `src/projects/_rnd/svg-scenes/ProtoSolPortraitRigTest.tsx` (`RND-ProtoSolPortraitRigTest`) — clignement/
  parole/hochement de tete. Video : `https://files.catbox.moe/lzh7rx.mp4`.
- `src/projects/_rnd/svg-scenes/ProtoSolFullbodyRigTest.tsx` (`RND-ProtoSolFullbodyRigTest`) — rotations
  epaule/coude/hanche/genou (test qui a REVELE le probleme esthetique cutout). Video :
  `https://files.catbox.moe/i4yc5z.mp4`.
- `src/projects/_rnd/svg-scenes/ProtoSolCargoSceneTest.tsx` (`RND-ProtoSolCargoSceneTest`) — decor maritime
  anime (bateau/soleil/fumee/oiseaux en translation). Video : `https://files.catbox.moe/yx6ur5.mp4`.
  ⭐ Piste d'enrichissement identifiee par Aziz, PAS ENCORE FAITE : oscillation des arbres (rotate leger
  dephase par arbre), ocean qui bouge en boucle (translate horizontal des bandes de vagues), fumee avec
  vraie derive+dispersion (pas juste pulsation sur place), desaturation progressive, oiseaux qui battent
  des ailes (demanderait de regenerer l'oiseau en 2 groupes d'ailes avec pivot epaule, meme pattern que
  le visage — pas encore teste).
- `src/projects/_rnd/svg-scenes/ProtoSolUsineSceneTest.tsx` (`RND-ProtoSolUsineSceneTest`) — decor usine
  anime (fumee 4-puffs/oiseaux/wagons). Video : `https://files.catbox.moe/kv3ikd.mp4`. ⚠️ Ce fichier
  reprend le test SANS image-ref (§8, style par defaut Sol) — le test AVEC image-ref reussi (§9) n'a PAS
  encore ete converti en proto Remotion anime (reste a faire si cette piste "imitation de style" est reprise).

**Tous les SVG bruts sources + JSON de pivots + images de comparaison** : rapatries hors scratchpad
ephemere dans `out/_rnd/gpt-5.6-sol-svg-test/` (session 2026-07-10, survivra a la cloture de session).

**Cout total de la session de tests** : ~13 appels GPT-5.6 Sol via OpenRouter, ≈ 2,50$ cumules (0,15-0,25$/
appel selon complexite). Rapport cout/decouverte tres favorable vu l'impact operationnel (nouveau modele
principal pour 2 registres + nouveau registre visage-rigge jusqu'ici absent du pipeline).

**Lecon methodologique a retenir** (Aziz a du corriger 2x un verdict trop optimiste de ma part cette
session — cf. § personnage complet "grotesque" et § usine sans image-ref) : verifier TOUJOURS le jugement
VISUEL a l'oeil (comparaison cote-a-cote rigoureuse, pas juste "meme sujet present") avant d'affirmer une
equivalence de style ou de qualite — la verification structurelle/technique (XML, JSON de pivots, rotation
sans decrochage) ne suffit PAS a elle seule, elle peut passer a cote d'un probleme esthetique evident a
l'oeil nu.

---

## Kimi K3 (moonshotai/kimi-k3) — R&D 2026-07-17 : SVG + VISION creative

Modele Moonshot sorti le 16 juillet 2026 (MoE 2.8T, contexte 1M, multimodal texte+image en ENTREE ;
sortie texte only). n1 sur Arena Frontend Code (devant Fable 5). Via OpenRouter : `moonshotai/kimi-k3`,
$3/$15 par M tokens, endpoint chat/completions standard (meme pattern que GLM/GPT dans `llm-gen-svg.py`).

### ✅ MUR LEVE (2026-07-20) : `reasoning_effort` MARCHE MAINTENANT — K3 devient exploitable
RE-TEST fait le 2026-07-20 (le "bientot" annonce est arrive). L'API OpenRouter accepte desormais
`reasoning_effort` sur `moonshotai/kimi-k3` (verifie dans `supported_parameters`). Appel DIRECT
(payload chat/completions, `reasoning_effort: "medium"`, `response_format: {type: json_object}`,
timeout 1200s, PAS de max_tokens) sur un insert composé "table de negociation vue de dessus" :
- **50 secondes, 0,03$, 25 reasoning_tokens seulement** (vs ~2-4 min et 0,50-0,70$ en mode max).
- Sortie propre : JSON `{svg, plan}`, 4119 chars, groupes `<g id>` nommes, rasterise sans souci.
=> **K3 est maintenant un concurrent SERIEUX pour du SVG one-shot** : rapide, pas cher, bon.
Reco : `reasoning_effort: "medium"` par defaut (bon compromis) ; "low" si 1er jet ultra-rapide.
Script d'appel direct de reference : `scratchpad .../kimi-b4-direct.py` (a rapatrier si reutilise).
⚠️ Pas de script a brief libre dans le repo (kimi-vision-fill-scene.py a des scenes hardcodees) →
appel OpenRouter direct pour tout brief nouveau. Conversion JSX : kebab→camelCase attributs SEULEMENT
(jamais `.replace("'",'"')` global, casse les apostrophes FR du texte).

### ⚠️ PIÈGE DISTINCT (2026-07-24) : `reasoning.max_tokens` sur un GROS prompt (multi-image, brief long)
Root cause confirmée (diagnostic agent dédié) : sur un prompt volumineux (~9k+ chars + images), K3 peut
partir en raisonnement non borné et bloquer l'appel OpenRouter 6-8min voire indéfiniment (pas d'erreur,
juste un hang) SI le paramètre `reasoning` n'est PAS explicitement borné dans le payload — même avec
`reasoning_effort: "medium"` fixé par ailleurs. Fix qui marche : passer `"reasoning": {"max_tokens": 2000}`
dans le payload JSON (distinct de `reasoning_effort`). Détail : `scripts/tools/da-brief.py` (commentaire
inline ligne ~39-42) — ce script est repassé sur `kimi-k2.5` par défaut suite à ce constat (plus fiable/
rapide pour ses cas d'usage), K3 reste utilisable pour sa puissance supérieure via ce fix.

### (HISTORIQUE) LE MUR : reasoning "max" FORCE — leve le 2026-07-20 (voir ci-dessus)
K3 n'avait qu'un mode de raisonnement au 17 juillet : `max`. Pas desactivable. Consequence mesuree :
- Jetons SVG (lot de 5) : 0,20$ / ~14k tokens (10,6k reasoning = 82%) / ~90s.
- Blueprint derrick annote : 0,45$ / ~30k tokens (24k reasoning) / ~2min.
- Vision Kosti (remplir coquille) : 0,435$ / 28k tokens (19,6k reasoning).
- Vision Khartoum (3 cibles a orchestrer) : 0,676$ / 44k tokens (34k reasoning).
La COMPLEXITE de la demande pilote le volume de reasoning (Khartoum >> Kosti). Chaque appel "pense"
5x plus qu'il ne produit. => INEXPLOITABLE pour du SVG EN LOT / repete (GLM-5.2 ou GPT-5.6 Sol restent
le defaut : qualite equivalente, effort reglable, 10-200x moins cher/rapide). "Bientot" des niveaux
d'effort inferieurs cote Moonshot — RE-TESTER a ce moment (a effort reglable, concurrent serieux, moins
cher que Fable pour frontend/SVG).

### Methode de test "reverse coquille" (evaluer la vision creative d'un modele, reutilisable)
Pour mesurer si un modele SAIT METTRE EN SCENE (pas juste remplir), lui donner une COQUILLE VRAIMENT VIDE :
retirer du PNG de reference les elements narratifs (station, batiments, jetons) et ne garder que le decor nu
(carte, grille, routes, terrain) + la partie du script. Une coquille encore peuplee teste le remplissage/
mimetisme ; une coquille vide teste l'INVENTION de geometrie + la direction artistique (choix non dictes).
C'est le protocole qui a revele le point fort de K3. Distinct de REVERSE-STYLE-VIDEO-VERS-ASSETS (qui reverse
un STYLE tiers) : ici on teste la capacite d'invention d'un modele sur NOTRE decor. Outil : retrait de groupes
SVG par compteur de profondeur <g>/</g> (le regex non-greedy `.*?</g>` casse sur les groupes imbriques).

### L'ATOUT REEL : VISION -> mise en scene SVG one-shot (a GARDER)
Test cle : on montre a K3 une COQUILLE NUE (carte d'etat-major sans elements narratifs, PNG) + la partie
du SCRIPT, et on lui demande d'INVENTER et coder la couche SVG qui raconte la scene. Resultat = le plus
concluant des 3 tests :
- VISION excellente : lit palette/grille/routes/terrain de la coquille et s'y aligne. A Kosti, a compris
  que "la route se termine" pour y poser la station. A Khartoum, a lu la jonction routiere comme le
  CONFLUENT DES DEUX NILS (geo juste) et place le palais dessus.
- INVENTE de la GEOMETRIE credible : station-service top-down (auvent, 3 pompes, cuve, camion-citerne) ;
  3 batiments-cible graves (tour TV + crosshair, palais, aeroport avec pistes en croix). Le DRONE qu'il
  cree ressemble a un VRAI drone (quadrirotor) — la ou GLM/GPT/notre existant font une simple fleche.
  Jugement Aziz : sa station-service est MEILLEURE que celle qu'on avait avant.
- DIRECTION ARTISTIQUE reelle (choix non dictes par le script) : sceaux de capture HORODATES
  (TENU PAR LA RSF 05H55/06H20/07H05), axes d'attaque convergents, legende RSF/SAF, triangle de
  coordination reliant les 3 cibles, titre date.
=> Usage retenu : "remplis creativement cette coquille depuis le script" en ONE-SHOT (pas un lot repete).
Un plan d'etat-major complet + mis en scene a ~0,50$ / <=~4min qui aurait pris a un agent Sonnet
plusieurs allers-retours. La profondeur de reasoning PAIE sur ce cas precis.

### Scripts R&D (reutilisables)
- `scripts/tools/llm-gen-svg.py --provider kimi` : jetons SVG lot (brief fige, meme que GLM).
- `scripts/tools/llm-gen-blueprint.py --subject {derrick|tanker}` : schema blueprint technique annote.
- `scripts/tools/kimi-vision-fill-scene.py --scene {kosti|khartoum} --image <coquille.png>` : VISION,
  image (data URL base64 en `image_url`) + script -> couche SVG inventee. NE PAS passer max_tokens.
- Gotcha JSX : le SVG genere par K3 utilise kebab-case (stroke-width, text-anchor...) + font-family a
  quotes multiples -> convertir en camelCase + neutraliser font-family avant injection JSX Remotion
  (voir la fonction to_jsx du parsing). Ne PAS faire un `.replace("'",'"')` global : casse les apostrophes
  FR du texte ("AXE D'ATTAQUE"). Parser depuis le JSON (apostrophes intactes), convertir SEULEMENT les
  attributs. Composants demo : `src/projects/_rnd/svg-scenes/Vision{Kosti,Khartoum}K3.tsx`,
  `BlueprintDerrickK3.tsx`, `DuelKimiGlm.tsx`.

Cout total session tests K3 : ~1,9$ (jetons + 2 blueprints partiels + 2 vision). Rapport cout/decouverte
favorable : a identifie un usage NOUVEAU (vision->SVG one-shot) absent du pipeline, non couvert par GLM/GPT.

## ⚠️ GOTCHA `scripts/tools/svg-scene-narrative.py` — prompt systeme EMOTIONNEL cable (2026-07-19)

Ce script (qui appelle GPT-5.6 Sol ou Gemini) a un PROMPT SYSTEME cable "genere une SCENE QUI RACONTE UN
MOMENT charge d'emotion" (lignes 43-59 du script) qui ECRASE le brief passe en `--brief`. Sur un brief de
**schema CARTOGRAPHIQUE** (corridor/flux/tracé geo-ancre, Soudan Acte 5), il a HALLUCINE un contenu
emotionnel hors-sujet ("un enfant abandonne son ours et court vers un parent agenouille dans la lumiere").
**REGLE** : `svg-scene-narrative.py` convient aux scenes d'EMOTION/personnage, PAS aux schemas composes /
cartographiques. Pour un schema (carte d'etat-major, corridor, diagramme) → appel OpenRouter **DIRECT** avec
le brief pur (bypass du prompt systeme cable). Prouve : le meme brief en appel direct a produit la bonne
proposition (`corridor-gpt-direct.txt`). ⚠️ Rappel : une proposition SVG de Sol reste un SIGNAL d'intention
graphique — un SVG PLAT n'est PAS collable sur un globe D3 anime (qui se reprojette frame par frame), on
RE-DESSINE le trace en coords lon/lat (cf [[globe-d3-moteur-cartographique-reutilisable]] § windingCircle).
