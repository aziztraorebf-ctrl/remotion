# OpenRouter pour la generation SVG — GLM-5.2 (3e modele low-cost)

> R&D 2026-06-24 (branche `rnd/svg-qwen3.6-test`). Test de modeles OpenRouter pour generer du SVG
> (jetons, assets, scenes) a cote de nos modeles principaux GPT-5.5 + Gemini 3.1 Pro.
> Verdict : **GLM-5.2 adopte comme 3e modele complementaire low-cost. Qwen3.6 et MiniMax M3 ecartes.**
>
> ⛔ **MISE A JOUR 2026-07-05** : pour les BATIMENTS/infrastructures complexes statiques (pas les jetons/
> vehicules mobiles), le SVG (GLM ou agent Claude) est BATTU par Gemini image-gen + traitement integration
> (desaturation+cadre) — voir `memory/STARTER-PROMPT-inserts-tactiques-soudan.md` § "VERDICT CONFIRME".
> Le SVG reste la bonne reponse pour les elements mobiles/nombreux (jetons, vehicules, effets).

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
portees en JSX Remotion, testees en INTERPOLATION continue (`src/projects/_rnd/svg-scenes/ProtoFuguPoseBankWalk.tsx`,
compo `RND-ProtoFuguPoseBankWalk`).

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
brutes, SVG extraits, render `fugu-pose-bank-walk.mp4`), `src/projects/_rnd/svg-scenes/ProtoFuguPoseBankWalk.tsx`.

Voir aussi : [[SVG-SCENES-GENERATIVES]] (doctrine SVG generatif). Modeles principaux : `memory/tools/gemini.md`, CLAUDE.md (bloc modeles verrouilles).

## Comparatif texte-only vs vision-from-storyboard — insert tactique Soudan (2026-07-05)

> R&D pour `memory/STARTER-PROMPT-inserts-tactiques-soudan.md`. Meme brief (5 elements : 2 jetons infanterie
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
