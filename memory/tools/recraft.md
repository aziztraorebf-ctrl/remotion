# Recraft — Assets SVG & Personnages
> Pipeline SVG, styles, limites, vivid_shapes.
> Mise a jour : 2026-09-04 (verification API/MCP) · contenu style : 2026-04-13

---

## ⛔⛔ ECART MCP vs API — VERIFIE LE 2026-09-04 (ne pas se fier au MCP pour juger Recraft)

**Notre MCP `recraft` n'expose que `recraftv3` et `recraftv2`.** L'API REST officielle, elle,
sert **`recraftv4_1`** (defaut) et 4 lignes de modeles. Le MCP est donc **2 generations en
retard**. Toute conclusion « Recraft ne sait pas faire X » tiree du MCP est a re-tester en API
directe avant d'etre gravee.

**Modeles API reels (doc officielle, 2026-09-04)** :
`recraftv4_1` · `recraftv4_1_vector` · `recraftv4_1_pro` · `recraftv4_1_pro_vector` ·
`recraftv4_1_utility[_vector|_pro|_pro_vector]` · `recraftv4[_vector|_pro|_pro_vector]` ·
`recraftv4_styles[...]` · `recraftv3[_vector]` · `recraftv2[_vector]`

⚠️ La regle « V3 = Style ID supporte / V4 = non supporte » plus bas date d'avril : il existe
desormais une ligne **`recraftv4_styles`** dediee aux styles. A RE-TESTER avant de s'y fier.

**14 endpoints API** (le MCP n'en expose que 6) — les 8 absents du MCP :
| Endpoint | Ce qu'il fait | Pourquoi ca compte |
|---|---|---|
| `/v1/images/inpaint` | regenere une ZONE via masque | modifier une partie d'un asset sans le refaire |
| `/v1/images/outpaint` | etend le cadre | elargir un decor existant |
| `/v1/images/eraseRegion` | efface une zone | retirer un element parasite |
| `/v1/images/generateBackground` | fond par prompt + masque | recomposer un arriere-plan |
| `/v1/images/removeBackground` | detourage — **accepte le SVG en entree et ressort du SVG** | detourer un vecteur sans le rasteriser |
| `/v1/images/generations/vector` | generation vectorielle directe | SVG sans passer par la vectorisation |
| `/v1/images/generations/raster` | generation raster directe | — |
| `/v1/styles` | style depuis **jusqu'a 10 images** (le MCP dit 5) | style de projet plus riche |

### ⛔ TESTE LE 2026-09-04 — CE QUI MARCHE ET CE QUI NE MARCHE PAS (mesure, pas doc)

Sur NOTRE cle API (contrat chill-meter) :
| Test | Resultat |
|---|---|
| `generations` avec `recraftv4_1` | ✅ **MARCHE**, et **35 credits** contre **40** pour v3/v4 — moins cher ET plus recent |
| `generations` avec `recraftv4` | ✅ marche, 40 credits |
| `inpaint` avec `recraftv4_1` | ⛔ **`Model 'Recraft V4.1' is not available`** — l'endpoint inpaint ne sert que **V3** |
| `inpaint` pour REECRIRE DU TEXTE | ⛔⛔ **ECHEC TOTAL** : les mots ont ete remplaces par des **taches lumineuses bleues**. Les icones voisines etaient bien preservees (le masque etait juste, verifie a l'oeil), mais le modele ne sait pas re-ecrire du texte fin. |

⭐⭐ **REGLE QUI EN DECOULE** : ne JAMAIS utiliser `inpaint` pour modifier/recolorer du **TEXTE**
dans une image. Un modele de generation ne sait pas ecrire des lettres fines de facon fiable —
il produit des formes qui ressemblent a du texte de loin. Pour changer la couleur d'un texte
dans une image : **superposer notre propre texte** (SVG/HTML) par-dessus, ou masquer la zone.
`inpaint` reste valable pour de la MATIERE (metal, fond, texture), jamais pour de la typographie.

⭐ Corollaire de cout : `recraftv4_1` etant moins cher que v3 en generation, il n'y a aucune
raison de rester sur v3 pour de la generation pure. Le MCP, lui, ne propose que v3/v2 -> passer
par l'API REST directe (`https://external.api.recraft.ai/v1/...`, cle `RECRAFT_API_KEY` du .env)
des qu'on veut v4.1.

**Vectorize — limites reelles** : entree PNG/JPG/WEBP, **max 10 Mo**, **< 16 megapixels**,
dimension max **4096 px**, min **256 px**. Sortie SVG. Seul parametre : `response_format`.
⭐ Il n'y a **qu'un seul** vectoriseur (pas de version "v4" de la vectorisation) — donc la
qualite obtenue via MCP est celle de l'API. Ce point-la n'est PAS un manque du MCP.

⭐ **Mesure du 2026-09-04 (contrat chill-meter)** : vectorisation d'une image IA de metal rouille
(1195x896) -> 2362 paths, **0 groupe**, 80,8 % de pixels quasi identiques a la source. La
GEOMETRIE et les BORDS sont fideles et sans resolution (sortie 4K nette). Ce qui se PERD est le
**grain photographique** : la corrosion continue devient des aplats de couleur. ⛔ Conclusion
transposable : **vectoriser une photo/image IA texturee = perdre la matiere**. Pour garder la
matiere, utiliser le PNG tel quel et ne vectoriser que ce qui doit etre anime.

---

---

## Regle V3 vs V4 (NON-NEGOTIABLE, ajoute 2026-04-13)

**V3 = Style ID supporte** — utiliser V3 quand un Style ID est etabli pour le projet. Plus fidele, ajoute moins de details parasites, respecte mieux le prompt.

**V4 = Style ID NON supporte encore** — utiliser V4 uniquement quand on n'a PAS de Style ID etabli (nouveau style generatif).

**Regle d'or** : si projet a un Style ID -> V3. Sinon -> V4 ou Gemini.

Cette regle remplace la hierarchie generique "V4 superieur a V3" qui vient par defaut — dans notre workflow, la fidelite au style etabli est prioritaire sur la qualite brute.

---

## Recraft vs Gemini — quel moteur pour quel style (prouve 2026-07-17)

- **Style a MATIERE / relief / texture (papier 3D papercraft, photo, 3D, halftone)** -> **GEMINI 3.1 Flash image**, pas Recraft. Test cote-a-cote (siege avion papercraft, meme prompt + meme frame-ref) : Recraft `digital_illustration/handmade_3d` derive vers la **pate a modeler (clay)**, Gemini rend du **vrai papier decoupe texture**. Ce n'est pas que Recraft est mauvais — c'est que son STYLE INTERNE colle moins bien a ce look.
- **Style VECTORIEL PLAT pur (icones, logos, cartes SVG a plat, pictos)** -> **Recraft** reste superieur (c'est sa force).
- Pipeline complet reverse-engineering video tierce -> assets : `doctrines/REVERSE-STYLE-VIDEO-VERS-ASSETS.md`.

---

## Modeles utiles

| Modele | Acces | Format | Usage |
|--------|-------|--------|-------|
| `recraftv3` via MCP | MCP | 1024x1024, 1024x1707 | Raster + styles |
| `recraftv3_vector` via MCP | MCP | 1024x1707 (9:16) | **Seul vecteur 9:16** |
| `recraftv4_vector` via API directe | API REST | 1024x1024 seulement | Carre uniquement |
| `recraftv4_pro_vector` | API REST | 4MP premium | SVG premium, carre |

---

## Traits distinctifs (oeil ferme, cicatrice)

- `image_to_image` corrige les anomalies faciales (rouvre les yeux). Utiliser `generate_image` + Style ID + prompt renforce
- Generer 3 variantes (`numberOfImages: 3`) — au moins 1/3 respecte le trait
- Preferer les traits graphiques simples aux traits complexes — Kling deforme moins les formes simples

---

## SVG vers PNG (NON-NEGOTIABLE)

- Recraft MCP genere des SVG — Kling n'accepte PAS les SVG
- Convertir via `rsvg-convert` : `/opt/homebrew/bin/rsvg-convert -w 1024 -h 1365 input.svg -o output.png`
- Tailles standard : portrait 1024x1365, paysage 1820x1024, carre 1024x1024

---

## Pipeline Recraft pour personnages historiques

1. `create_style()` avec image reference -> Style ID permanent
2. `generate_image()` + Style ID + prompt renforce -> 3 variantes
3. Selectionner la variante correcte -> convertir SVG/PNG
4. Plans larges -> `image_to_image` depuis la reference. Plans portrait -> `generate_image` + Style ID (jamais i2i)

---

## Recraft V4 SVG — Limites

- SVG monolithiques sans IDs semantiques (`path1`, `path2`). Impossible d'animer independamment.
- **Utile pour** : assets autonomes (pirogue, icone), elements decoratifs statiques
- **Inadapte pour** : scenes multi-elements animables

---

## Substyle vivid_shapes

- Meilleur substyle pour Kling : blocs tres contrastes = separation des plans = orbite possible
- Commande MCP : `style: "vector_illustration"`, `substyle: "vivid_shapes"`
- SVG sorti = image bloc (pas animable par elements) — zoom/pan global uniquement
- Images vivid_shapes semblent ordinaires isolement. Kling les eleve en clips exceptionnels.
- L'image source est une intention — Kling cree la scene entre les deux frames.

---

## Style custom (create_style)

- `mcp__recraft__create_style` depuis start frame -> `style_id`
- Garantit coherence FORMELLE (shapes, style) — PAS la coherence chromatique exacte

### Style IDs sauvegardes (recreees 2026-04-07)

| Style | ID | Source images | Usage |
|-------|-----|--------------|-------|
| **Hannibal** (Flat Vector Silhouette) | `22d1274f-08d0-4c17-844b-4e574b0b478b` | 3 images hannibal library | Scenes epiques, armees, silhouettes |
| **Amanirenas** (Bold Graphic Narrative) | `d28c53cc-7d3d-46af-a697-c0a134e7482d` | 2 images amanirenas library | Polyvalent — portraits, foules, action, news |

### Vivid Shapes + Seedance (VALIDE 2026-04-07)
- Le style vivid_shapes s'anime parfaitement dans Seedance — formes plates, zero morphing
- Principe : ref Recraft avec Style ID -> Seedance ajoute mouvement, lumiere, profondeur
- L'image Recraft est une DIRECTION ARTISTIQUE, pas un produit fini
- Hybrid optimal : visage semi-detaille (style Amanirenas) + armee en silhouettes (composition Hannibal)

---

## Regle d'or SVG Recraft

Ne jamais reordonner les calques, changer preserveAspectRatio, supprimer backgroundColor.
Si la composition ne convient pas -> regenerer avec nouveau prompt, pas modifier le SVG.

---

## Pipeline Recraft vivid_shapes -> Kling O3 (VALIDE production)

```
1. Start frame : Recraft MCP recraftv3, vivid_shapes, 1024x1707
2. Style ID    : mcp__recraft__create_style depuis start frame
3. End frame   : Recraft avec meme style_id, position finale
4. Kling O3    : fal-ai/kling-video/o3/standard/image-to-video
                 tail_image_url=end_frame, cfg_scale=0.35, duration="8" min
```

**End frame = sujet seul + pose finale. Pas d'armee — Kling les invente mieux.**

---

## `generate_image` vs `vectorize_image` — silhouettes/illustration (test 2026-08-04)

MCP `mcp__recraft__*` confirme connecte/fonctionnel (7380 credits au 2026-08-04, test client-sim
Flowdesk — premier usage concret documente hors pipeline video ci-dessus).

- **`vectorize_image`** (raster->SVG) produit des MILLIERS de `<path>` separes (8835 sur un test
  silhouette), **zero groupe `<g id>` nomme** — inutilisable pour animer par partie (pas de
  squelette/articulation), seulement animable comme BLOC RIGIDE ENTIER (fade/scale d'ensemble).
- **`generate_image`** avec `style: vector_illustration` (substyle `line_art` teste) produit un SVG
  propre (14-16 `<path>` seulement) et a donne le MEILLEUR rendu de silhouette humaine obtenu toutes
  sources confondues sur ce test (mains/visage credibles, meilleur que Fable 5/Gemini/GPT sur ce cas
  precis).
- ⚠️ **Le substyle peut ECRASER la consigne de couleur du prompt texte** : le test est sorti en
  noir/blanc pur malgre une consigne explicite de palette (bleu marine/orange) dans le prompt.
  Toujours prevoir un **recolor manuel** (Python/Pillow, remplacement RGB direct) apres generation
  si une palette de marque stricte est requise — ne pas compter sur le prompt seul face au style.

## ⛔ VECTORISER N'EST PAS GÉNÉRER (recadrage d'Aziz, 2026-08-28)

| | Modèle GÉNÉRATIF (Fable, Kimi, GLM) | VECTORISEUR (`vectorize_image`) |
|---|---|---|
| Ce qu'il fait | **Crée** depuis son entraînement | **Calcule** des contours depuis les pixels |
| Sur un logo existant | une INTERPRÉTATION | une COPIE |
| Quand l'utiliser | le client veut qu'on CRÉE | le client a DÉJÀ son identité |

**Mesure sur 2 logos de vrais clients** (récupérés dans des avis Fiverr) :

| logo | Fable 5 | Recraft | groupes nommés |
|---|---|---|---|
| LoadUp (logotype) | bon mais interprété | **0,1 %** d'écart | Fable oui / Recraft **aucun** |
| Yoga (lettrage manuscrit) | **11,3 %** d'écart | **0,6 %** | idem |

⛔ Un logo est l'identité d'une entreprise, payée à un designer. Le client ne veut pas qu'on
l'« améliore » : il veut qu'on le **transporte fidèlement**. Un modèle génératif qui interprète
au passage est un DÉFAUT, pas une qualité.
⭐ Le vectoriseur est fidèle **parce qu'il ne comprend rien** — il ne peut pas inventer.

⚠️ **CONTREPARTIE, et elle nuance la note plus haut sur les « milliers de paths »** : les deux
constats sont vrais sur des axes différents. `vectorize_image` est **disqualifié pour produire une
scène animable** (formes anonymes, rien de nommé — 59 sur le logo Yoga) et **référence pour
reproduire une identité existante** (0,1 % d'écart). L'axe n'est pas la qualité, c'est
**fidélité contre manipulabilité**.
⭐ Voie hybride prouvée : géométrie Recraft → `planche_calques.py` (rend chaque calque seul pour
l'identifier) → `group_layers.py` (applique la carte de noms).

⚠️ **Piège de mesure** : un SVG sans fond donne 98,9 % d'écart contre une image à fond blanc.
Rendre avec `-b white` avant de conclure.

⭐ Apport de Fable à garder comme TECHNIQUE (pas comme voie de reproduction) : il structure
**pour l'animation** (groupes nommés, lettres séparées) et choisit des TRAITS plutôt que des
contours pleins, ce qui ouvre l'animation d'écriture progressive.
