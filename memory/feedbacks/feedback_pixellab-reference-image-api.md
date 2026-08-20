# Feedback — Pont Gemini->PixelLab via API REST (reference image) (2026-06-04)

> Idee Aziz : generer un character-sheet precis avec Gemini/Recraft (fond blanc, peau/tenue exactes),
> le donner en REFERENCE a PixelLab → on controle ce qu'on obtient (fini "prier que PixelLab comprenne"),
> ideal pour BATCH. Voir [[feedback_pixellab-standardisation-taille-style]], [[ATLAS-PIXELLAB-PLAYBOOK]].

## Fait verifie (API REST PixelLab v1, openapi.json)

Le **MCP `create_character` n'expose PAS** la creation depuis reference (texte seulement). MAIS l'**API REST v1**
(https://api.pixellab.ai/v1, openapi à /v1/openapi.json) l'expose. Endpoints cles :

- **POST /generate-image-bitforge** — accepte `init_image`, `style_image`, `inpainting_image`. = style transfer
  guide : donner le character-sheet Gemini comme style_image/init_image → PixelLab genere dans ce style.
- **POST /rotate** (`from_image`) — prend UN sprite (ex: perso Gemini de face) → genere les autres directions.
  ⭐ C'EST LE PONT : Gemini fait le perso de face fond blanc → /rotate produit les 8 directions coherentes.
- **POST /animate-with-text** + **/animate-with-skeleton** — acceptent `reference_image`/`init_images` → animer
  un perso fourni en reference (walk/charge/...).
- Autres : /generate-image-pixflux (init_image), /inpaint (mask), /estimate-skeleton, GET /balance.

## WORKFLOW BATCH valide (a coder quand on industrialise les persos)

1. **Gemini** (`IMAGE_MODEL`, defaut Lite — le sheet est une ref de travail pour PixelLab) ou Recraft → character-sheet fond blanc, perso EXACT
   (peau foncee, tenue mande/berbere/romaine, etc.). Controle total de l'apparence.
2. **PixelLab REST /rotate** (`from_image` = le sheet) → 8 directions coherentes.
3. **PixelLab REST /animate-with-text** (`reference_image`) → walk/charge/spear/death.
→ On sait a chaque fois quel perso on obtient. Parfait pour lancer une troupe coherente en lot.

Cle API PixelLab : dans .env (MCP l'utilise deja). Pour REST : header `Authorization: Bearer <PIXELLAB_API_KEY>`.
A CODER : script scripts/tools/gemini-to-pixellab.py (sheet Gemini → /rotate → /animate). Pas encore fait.

## OBJETS : pont reference DEJA dispo via MCP (bonus)

`create_map_object` (MCP) accepte deja `background_image` (base64 ou path) + `inpainting` (oval/rect/mask) →
genere un objet pixel dans le style d'une image de fond fournie. Donc pour les OBJETS sur la carte (villes,
tentes, butin, etc.), le pont reference est utilisable IMMEDIATEMENT sans sortir du MCP. Codifier au moment
ou on produit des map-objects (cf. famille de templates "objets sur la map" prevue apres le combat).

## Statut — PONT VALIDE EN PROD (2026-06-04) ✅ catbox sdkrne (8dir) / v3ssj9 (compare)

TEST REUSSI bout-en-bout sur dignitaire mande. Workflow prouve :
1. Gemini (`scripts/tools/gemini-gen-image.py`) → character-sheet (peau foncee, boubou indigo+or, baton).
   Apparence EXACTE controlee (fini "prier que PixelLab comprenne").
2. ⚠️ PIEGE Gemini : il rend le damier "transparent" en pixels gris OPAQUES (203,205,204). → detourer
   via Recraft `remove_background` (MCP) → vrai alpha. Puis crop sur alpha>40 + resize.
3. ⚠️ /rotate exige canvas EXACT 128/64/32/16 (pas 92). Resize a 128x128, perso ancre bas.
4. PixelLab REST `/rotate` (`scripts/tools/pixellab-rotate.py`, code cette session) : from_image=sprite,
   from_dir=east (selon orientation du sheet) → to_dir=W/S/SE/... 1 appel/direction, ~qq sec, synchrone.
   RESULTAT : 8 directions = MEME dignitaire retourne coherent (boubou/calotte/baton/peau preserves). ✅

→ GAME CHANGER confirme : persos custom apparence-exacte en 8 dir, sans artefacts texte. Auth REST OK
   (Bearer PIXELLAB_API_KEY, /balance test). Sprite test : `out/_r-and-d/order-of-battle/gemini-bridge/`.
RESTE (industrialisation) : animer via `/animate-with-text` (reference_image) ; 1 script tout-en-un
   `gemini-to-pixellab.py` (sheet → Recraft detour → resize 128 → rotate x7 → animate). Pont OBJET = MCP
   `create_map_object` background_image (deja dispo).
