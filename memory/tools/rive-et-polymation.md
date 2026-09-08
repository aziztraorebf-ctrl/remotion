# RIVE + POLYMATION — piste EXPLOREE, classee « peut-etre plus tard »

> Statut au 2026-09-05 : **testee a fond, ecartee pour l'instant**. Ne PAS refaire
> l'analyse de securite ni la decouverte des outils : tout est ci-dessous.

## ✅ CE QUI EST ACQUIS : on sait LIRE un `.riv` — pas en FABRIQUER un

`@remotion/rive@4.0.456` **installe et VERIFIE** : rend parfaitement en headless
(90 frames, 10 echantillons tous distincts, image nette). La doc officielle ne
documentait PAS le headless — c'etait le verrou. Il est leve.
→ **Si on obtient un `.riv` par n'importe quel moyen, on sait le jouer dans Remotion.**
Compo de test : `src/index-rive-test.tsx` · assets : `public/rive-test/`

⛔⛔ **NE PAS LIRE CET ACQUIS COMME « on sait produire du Rive ».** C'est la moitié de la
phrase ci-dessus (« si on OBTIENT un .riv ») qui porte tout le poids, et la condition n'est
PAS remplie aujourd'hui : **aucun chemin ne mène de NOS pièces (SVG à calques nommés) vers
un `.riv`** — cf. « LE MUR » juste en dessous. CONSOMMER ≠ FABRIQUER.
→ Conséquence commerciale : **le `.riv` n'est PAS un livrable qu'on peut proposer à un
client** (contrairement au Lottie et au SVG animé, qui eux sortent de notre chaîne).
Un concurrent qui livre du Rive (ex. `artikapro` sur Fiverr) l'anime dans l'ÉDITEUR Rive —
métier et logiciel qu'on n'a pas. Y aller = un vrai chantier d'apprentissage, pas une case
à cocher. Vecu 2026-09-05 : j'ai dit à Aziz « notre verrou Rive est levé » en analysant un
concurrent — vrai sur le rendu, **hors sujet** sur ce qu'il vend ; c'est lui qui a corrigé.

## ⛔ LE MUR : POLYMATION NE LIT PAS LE SVG

C'est LA raison de l'ecarter, et elle est structurelle — pas un reglage.

`convert_format` (`listArrows:true`, mesure du 05/09) : **aucune fleche ne part de SVG**.
Les conversions sont Rive ↔ Spline ↔ Lottie, dans tous les sens. C'est tout.
- `auto_rig_path` **ne prend pas un fichier vectoriel** : il prend une LISTE DE POINTS
  (`points: [{x,y}...]`), un contour polygonal ferme.
- Seule mention de SVG : le groupe `chat2svg (full)` — **texte → SVG → Rive**, part d'un
  TEXTE, et « requires separate setup » (sidecar GPU).
→ Nos pieces GPT-6 (des centaines de calques nommes) **ne peuvent pas entrer**. Il faudrait
les reduire a un contour de points, c'est-a-dire jeter ce qui fait leur valeur.

⭐ Ils le disent eux-memes en FAQ : « **an animation engineer, not an illustrator** » et
« prefer real source art » — en entendant des IMAGES, pas des SVG. C'est un GENERATEUR
d'animations, pas un importeur de dessins.

## ✅ SECURITE : analyse complete faite, RIEN de suspect

Binaire `rivemcp-macos-arm64` v1.13.5, 143 Mo, Mach-O arm64.
SHA-256 `4409216175d9928ec05c7b6170127eecbe98b7e74543964b3b31f93deb993721`

Methode : telecharge SANS executer → analyse statique → execute en **bac a sable macOS**
(`sandbox-exec`), reseau coupe puis reseau ouvert avec `.ssh`/`.aws`/`.env`/`.claude` bloques.

| | |
|---|---|
| domaines embarques | uniquement specs techniques (W3C, Unicode, Node) |
| acces .ssh/.aws/keychain/cookies | **aucun** |
| entitlements macOS | **aucun** demande |
| bibliotheques liees | 4, toutes systeme de base |
| serveur de licence / telemetrie | **aucun trouve** en clair |
| hors ligne | **REFUSE de demarrer** au lieu de faire semblant ⭐ |

⚠️ Reserves qui subsistent : signature **adhoc** (auteur anonyme) · code **obfusque** (on
observe un comportement, jamais des intentions) · depot GitHub `paradoxsyn/rivemcp-releases`
a **0 etoile / 0 fork / 2 abonnes** — anomalie inexpliquee pour un produit a 10 $/mois ·
**exige le reseau** pour valider la licence, donc intestable en isolation totale.

## CE QUI MARCHE VRAIMENT (teste, 1 export gratuit consomme sur 3)

Chaine complete verifiee : `create_project` → `create_artboard` → `auto_rig_path`
(4 os, skinning LBS, animation demo) → `export_riv` → **rendu par Remotion**. Ca fonctionne.
116 outils exposes par defaut sur 168 ; groupes `bones`/`mesh`/`constraints` **desactives**
(`enable_tools` les allume).
⚠️ `export_riv` avec un chemin RELATIF ecrit dans `~/` (pas dans le cwd) — passer un
chemin ABSOLU.

Outils qui nous interesseraient si le mur SVG tombait : `auto_weight_mesh` (skinning auto),
`verify_rig` (« where did the solver ACTUALLY put the bones »), **`lint_animations`**
(« catch the *animation present but nothing moves* bug » — notre pire bug, outille).

## SI ON Y REVIENT UN JOUR
1. Le mur SVG a-t-il bouge ? (`convert_format listArrows:true`, 1 appel, gratuit)
2. Sinon : passer par l'**editeur Rive** (lui importe le SVG) — gratuit a l'usage, mais
   l'export `.riv` est payant (9 $/mois) et se fait A LA MAIN.
3. Binaire conserve : `scratchpad/polym/` (session du 05/09) — verifier le SHA avant reusage.

Prix Polymation : 10 $/mois · 3 exports gratuits sans compte.
