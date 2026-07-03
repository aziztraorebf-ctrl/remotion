---
name: PixelLab — Sprites & Walk Cycles sur Carte Atlas
description: Regles canoniques PixelLab SDK Python v1 + integration Remotion SVG. Walk cycle valide 2026-05-01.
type: reference
---

# PixelLab — Pipeline Valide (2026-05-01)

## Acces API

- **SDK Python v1** : `pip install pixellab`
- **Auth** : `PixelLabClient(secret='...')` — champ `secret`, PAS `api_key`
- **MCP PixelLab** : abonnement mensuel SEPARÉ des crédits USD. MCP = walk cycles automatiques. SDK = génération image frame par frame.
- **Clé** : dans `.env` sous `PIXELLAB_SECRET` (aussi lisible via `PIXELLAB_API_KEY`)

## ⚠️ BUG LIB REST LOCALE vs MCP (2026-06-11, vérifié)
- **`pixellab` (pip, lib Python locale) PLANTE au parsing de réponse sur un abonnement** : l'API renvoie
  `usage={'type':'generations','generations':1.0}` mais la lib attend `usage.type='usd'` → `ValidationError`.
  **L'image EST générée côté serveur** (générations décomptées) mais la lib ne la retourne pas. Ne PAS s'y fier.
- **→ Utiliser le MCP PixelLab** (`create_map_object`/`animate_object`/`get_map_object`) qui gère le bon format.
- **Enums divergents lib vs MCP** : `detail` = `"highly detailed"` côté lib REST MAIS `"high detail"` côté MCP.
- **Rate-limit 429** : ne pas enchaîner les appels rapprochés (relances) → attendre ~45s entre lots.
- **Lenteur** : MCP chargé peut donner ETA ~450s+ par objet. Lancer en async, programmer un réveil, ne pas bloquer.

## Génération sprites statiques (SDK)

```python
from pixellab.generate_image_pixflux import generate_image_pixflux
from pixellab import PixelLabClient
from PIL import Image

client = PixelLabClient(secret='...')
result = generate_image_pixflux(
    client=client,
    description="...",
    image_size={"width": 128, "height": 128},
    # transparency=True si fond transparent nécessaire
)
result.image.pil_image().save("output.png")
# Upscale x4 sans blur : Image.resize((512,512), Image.NEAREST)
```

## Prompts sprites — règles critiques

- Toujours spécifier **"adult male"**, **"masculine build"**, **"broad shoulders"** → sinon sprite féminin
- Éviter **"Mandinka"** seul → interprété musicien/griot → ajouter "holding long spear, no instrument, combat stance"
- Toujours spécifier **"pixel art, side view, transparent background"**
- Taille générée : **128x128** (max SDK v1)

## Walk cycle — Structure fichiers PixelLab

```
animations/<nom-animation>-<hash>/<direction>/frame_000.png ... frame_005.png
```

- **6 frames** par direction, RGBA 64x64 ou 128x128
- Directions : `east`, `west`, `north`, `south` (selon le personnage)
- Merchant-side : east + south seulement (pas 4 directions complètes)

## Intégration Remotion — Formule walk cycle

```tsx
const WALK_FRAMES = 6;
const WALK_FPS = 8; // optimal pour marche naturelle

const animFrame = Math.floor((frame / fps) * WALK_FPS) % WALK_FRAMES;
const frameStr = String(animFrame).padStart(3, "0");
const href = staticFile(`${ANIM_PATH}/${direction}/frame_${frameStr}.png`);
```

## Placement sur carte SVG

> ⛔ **RÈGLE FLIP OBSOLÈTE POUR ATLAS** — voir `ATLAS-PIXELLAB-PLAYBOOK.md §0` (le flip causait le bug moonwalk, 2026-06-03). N'utiliser `flipX` que hors contexte Atlas si vraiment nécessaire.

```tsx
// Ancrage au sol : x centré, y = bas du sprite
<image
  href={spriteHref}
  x={charX - SPRITE_SIZE / 2}
  y={charY - SPRITE_SIZE}
  width={SPRITE_SIZE}
  height={SPRITE_SIZE}
  style={{ imageRendering: "pixelated" }}  // OBLIGATOIRE
/>

// Flip direction ouest
// ⛔ RÈGLE FLIP OBSOLÈTE POUR ATLAS — voir ATLAS-PIXELLAB-PLAYBOOK.md §0 (le flip causait le bug moonwalk,
// 2026-06-03). N'utiliser flipX que hors contexte Atlas si vraiment nécessaire.
<g transform="scale(-1, 1)">
  <image ... />
</g>
```

## Règles canoniques validées par Aziz (2026-05-01)

- **Taille affichée** : **64px** — NE PAS grandir. Lisible au zoom, laisse la carte respirer.
- **Pas d'ombre** sous les pieds — coupe l'effet ancré sur la carte
- **Pas de hop** si personnage statique — inutile, distrait
- **Carte plate (0° tilt)** pour scènes personnages → ancrage naturel sans technique
- **Carte tilted** réservée aux vues géographiques pures sans personnages

## Changement d'animation (marche → action)

```tsx
const WALK_END = fps * 4; // 4s de marche
const isWalking = frame < WALK_END;

const walkFrame = Math.floor((frame / fps) * WALK_FPS) % WALK_FRAMES;
const actionFrame = Math.floor(((frame - WALK_END) / fps) * ANIM_FPS) % ACTION_FRAMES;

const href = isWalking
  ? staticFile(`${WALK_PATH}/${walkStr}.png`)
  : staticFile(`${ACTION_PATH}/${actionStr}.png`);
```

## Deux personnages simultanés

- Variables indépendantes charX/charY pour chaque
- Point de rencontre : interpolate des deux vers même coord
- Flip sur celui qui vient de l'est (marche vers l'ouest) pendant la marche uniquement

## Assets de test disponibles

Dossier : `quebec-jacques-poc/public/pixellab-walk-test/`

| Dossier | Walk directions | Animations secondaires |
|---------|----------------|----------------------|
| `monk/` | N/S/E/W | `monk_kneeling_in_prayer` (4 frames, south+east) |
| `merchant-dark/` | N/S/E/W | `yelling_piedestrian_to_sell` (16 frames) |
| `merchant-side/` | E+S seulement | `being_accused`, `Drinking`, `tied_to_pole` |
| `peasant/` | N/S/E/W | `holding_fire_torche` |

## Assets production Atlas Mansa Moussa

- `quebec-jacques-poc/public/atlas-mansa-moussa/assets/mansa-pixel-128.png`
- `quebec-jacques-poc/public/atlas-mansa-moussa/assets/guerrier-pixel-128.png`
- `quebec-jacques-poc/public/atlas-mansa-moussa/assets/chameau-pixel-128.png`

## Prochaine étape : walk cycles Mansa Moussa

Nécessite abonnement MCP PixelLab (walk cycles automatiques) ou génération frame-par-frame SDK.
Prompts de base documentés dans memory/atlas-mansa-moussa/PIXELLAB-WALK-PIPELINE.md.

## Erreurs à ne pas reproduire

| Erreur | Correction |
|--------|-----------|
| `PixelLabClient(api_key=...)` | `PixelLabClient(secret='...')` |
| `pixellab.generate_image_pixflux(...)` | `from pixellab.generate_image_pixflux import generate_image_pixflux` |
| `result.image.to_image()` | `result.image.pil_image()` |
| MCP sans abonnement mensuel | Utiliser SDK Python v1 avec crédits USD |

## ⭐⭐ PixelLab vs registre SVG stick-figure/encre — TESTÉ 2026-07-02

**Question testée** : peut-on combiner PixelLab (personnages pré-animés 8-directions, contrôle total taille/position en post — comme fait pour Atlas) avec notre univers SVG vectoriel Souverain, pour avoir le meilleur des deux (contrôle + réutilisabilité de PixelLab, sans coder chaque geste à la main) ?

**3 tests réalisés, résultat NUANCÉ selon le niveau de détail du personnage source** :

1. **MCP `create_character` mode texte-seul** (pas d'image en input) sur description "stick-figure minimaliste" → ÉCHEC total. Le modèle ignore la contrainte de minimalisme et produit un humain pixel art complet (visage, membres séparés, peau) même quand le prompt dit explicitement "no face, no hands, pictogram-like". Le MCP standard `create_character` n'accepte QUE du texte — ce n'est PAS un outil image-to-character malgré son nom.

2. **Composite Hannibal (asset PixelLab existant, style détaillé/saturé) posé dans une scène SVG Souverain** → choc de texture IMMÉDIAT et violent, visible même à petite échelle : couleurs saturées vs notre palette désaturée, contours crénelés (pixel) vs traits vectoriels lisses, forte densité de détail (visage, barbe, armure) vs nos 3-4 formes géométriques. **Conclusion : un asset PixelLab classique (RPG/jeu vidéo) ne peut PAS cohabiter avec notre registre encre minimaliste dans le même plan.**

3. **API REST directe `POST /v2/create-character-v3` en mode `reference_image`** (⚠️ existe UNIQUEMENT en API REST, absent du MCP — voir note ci-dessous) testée sur 2 registres source différents :
   - **Stick-figure pur** (docker StickRig, silhouette à 3-4 formes) : NON TESTÉ jusqu'au bout (annulé par Aziz après visualisation de l'image source repadée — jugé à l'œil trop dégénéré anatomiquement pour qu'un rotateur pixel art entraîné sur skeleton humain puisse le comprendre).
   - **Registre flat-cartoon développé** (Mariama Ba, charsheet `_shared/refs/characters/mariama-ba/mariama-ba-charsheet-CANONICAL.png` — contour net, aplats, volume suggéré mais pas stick-figure) : ✅✅ **SUCCÈS QUASI PARFAIT**. Le style a survécu à la rotation 8-directions (visage cohérent, drapé de vêtement respecté, contour préservé), résultat bien plus proche d'une illustration rastérisée que d'un pixel art dithered classique. **Composite dans une scène SVG Souverain : choc de texture MINEUR mais réel** (dégradés de peau/ombrage restent visibles vs nos aplats purs, densité de détail visage/bijoux/plis reste supérieure à notre registre) — passerait probablement en arrière-plan flou, accrocherait l'œil en premier plan net.

**Conclusion opérationnelle** :
- ⛔ **Stick-figure minimaliste (registre StickRig actuel) : PixelLab n'apporte rien** — la forme est trop sous-déterminée pour qu'un rotateur pixel art la traite correctement, et même si ça marchait, le style pixel art détonnerait de toute façon avec le vectoriel.
- ⭐ **Registre flat-cartoon plus développé (type Mariama Ba) : piste RÉELLE mais pas encore "zéro choc"** — à creuser SEULEMENT si un projet a besoin de personnages premium détaillés en 8-directions ET accepte un léger décalage de texture (ex: personnage en gros plan isolé sur fond neutre, pas mélangé dans le même plan qu'un décor vectoriel pur).
- Le vrai gain de PixelLab (contrôle total post-génération, réutilisable, scalable, pas de coût par essai d'animation une fois le personnage créé) reste réel — mais le blocage n'est PAS le contrôle, c'est le LANGAGE GRAPHIQUE (pixel rastérisé vs vecteur lisse). Pour notre registre stick-figure, `StickRigMultiDir` (SVG, 8 directions, coûts zéro par itération) reste supérieur car il n'a pas ce problème par construction.

**Note technique — MCP vs API REST** : le MCP `mcp__pixellab__create_character` (mode standard/pro/v3) ne prend jamais d'image en paramètre direct malgré ses noms trompeurs ("pro" = reference-based mais depuis un PROMPT enrichi, pas une image uploadée). Le vrai endpoint image-to-character est **`POST https://api.pixellab.ai/v2/create-character-v3`** avec `reference_image` (base64, max 256×256, doit être south-facing/de face pour de meilleurs résultats) — accessible SEULEMENT en appel API REST direct (clé `PIXELLAB_API_KEY` dans `.env`), pas exposé via MCP. Coût : `ceil(w*h*8/65536)` générations (~$0.04 pour 64×64, ~$0.095-0.185 pour 85-168px en mode pro équivalent). Script de test : voir pattern dans la session 2026-07-02 (upload base64 → POST → `GET /v2/characters/{id}` pour poll, PAS de champ "status" une fois terminé — juste la présence de `rotation_urls` dans la réponse).

Assets test : `mariama-v3-south.png` / `mariama-v3-east.png` (résultat rotation 8-dir), scripts dans le scratchpad de session (non conservés dans le repo).

## ⭐ Alternative découverte — Gamelabs Studio (2026-07-02, PAS ENCORE ADOPTÉ)

**Contexte** : Aziz a testé gamelabstudio.co avec le MÊME prompt texte stick-figure minimaliste que PixelLab avait
raté (§ ci-dessus) — résultat visuellement bien plus proche de notre intention (silhouette simple reconnaissable
comme stick-figure, pas un humain pixel-art détaillé). Recherche confirmant le positionnement officiel du produit
(gamelabstudio.co/blog/gamelabs-studio-vs-pixellab, leur propre comparatif) :

| | Gamelabs Studio | PixelLab |
|---|---|---|
| Style | N'importe quel style 2D (photoréaliste, hand-drawn, anime, retro, **pas juste pixel art**) | Pixel art uniquement |
| Résolution | Jusqu'à 1024×1024 / 1920×1080 | Max 400×400 (souvent 128-200px) |
| Animation | Prompt libre sur n'importe quelle image, export MP4 | Skeleton-based + text-to-animate, plafonné 128×128 |
| MCP/API | Oui (SSE + REST documentée) | Oui (HTTP) |
| Crédits | 20 gratuits (1 crédit = 1 artwork/spritesheet, 5 = 1 animation) | Abonnement + pay-per-use |

**⛔ POINT DE BLOCAGE STRUCTUREL IDENTIQUE À PIXELLAB (persiste malgré la bonne qualité — voir test réel ci-dessous)** :
Gamelabs exporte exclusivement en **PNG** (artwork, spritesheet grid) et **MP4** (animation) — confirmé par leur
propre blog et FAQ, aucune mention SVG/vecteur nulle part. **C'est un moteur raster de bout en bout, comme PixelLab.**
Le "Any Art Style" résout le problème de FIDÉLITÉ DE STYLE (silhouette simple reconnaissable, pas d'anatomie
RPG imposée), mais PAS le problème de LANGAGE GRAPHIQUE (pixel/bitmap vs notre SVG vectoriel natif) — le même
choc de texture (raster composé sur vecteur) s'appliquerait dans une scène SVG mixte.

### ✅ TEST RÉEL RÉALISÉ 2026-07-02 (API REST directe, MCP contourné) — résultat BEAUCOUP MEILLEUR que le 1er essai

**Bug MCP découvert et contourné** : le serveur MCP Gamelabs (`.mcp.json` → `gamelabs`, SSE) a un bug d'infra —
il route ses appels vers `http://127.0.0.1:8000` (localhost) au lieu de `api.gamelabstudio.co`, provoquant un
`401 Unauthorized` systématique même avec une clé valide (vérifié : la même clé fonctionne en HTTP 200 sur
l'API REST directe). **Contournement** : appeler directement `https://api.gamelabstudio.co/v1/...` en
multipart form (PAS JSON, PAS `/platform/...` comme le MCP le suggérait implicitement). Endpoints réels :
`POST /v1/generate/image`, `POST /v1/generate/video`, `POST /v1/generate/spritesheet`, `GET /v1/jobs/{job_id}`
(poll), `GET /v1/assets/{asset_id}/download`. Voir doc complète gamelabstudio.co/docs/api (rendu JS, non
accessible par WebFetch/Tavily — Aziz a collé le contenu HTML directement).

**Cause racine du premier échec (spritesheet flou/illisible)** : PAS un problème de modèle Gamelabs, mais un
**mauvais dimensionnement** — le premier prompt (texte seul, sans consigne de cadrage) a produit un personnage
minuscule (111×197px) noyé dans une cellule 512×512, donc la résolution EFFECTIVE du personnage était trop
faible pour rester nette après compression/despill. Confirmé par un exemple de spritesheet "char" fourni par
Aziz (asset généré sur un SUJET qui remplit bien le cadre) : résultat net, contours propres, aucun flou —
prouvant que le moteur EST capable de qualité, le problème était en amont (cadrage).

**Fix appliqué et validé** : ajouter explicitement au prompt "close-up full body shot... character fills at
least 80 percent of the image height" + `centered=true`. Résultat image seule : stick-figure très propre,
contour net, gilet orange en aplat, casquette olive nette — visuellement très proche de notre registre StickRig.

**Pipeline complet testé (image → video → spritesheet)** :
1. `generate/image` (1 crédit) : stick-figure debout, cadrage correct → succès net.
2. `generate/video` (4 crédits, PAS 5 comme annoncé dans le blog générique) avec `source_image_job_id` de
   l'étape 1 + prompt "walking in place, simple walk cycle, legs alternating, arms swinging opposite to legs" +
   `loopable=true` → généré en ~75s, 640×640, 24fps, 4s. **Cycle de marche cohérent** : jambes qui alternent
   logiquement (appui/levée), bras en balancier opposé, silhouette stable sur toute la durée, aucune dérive de
   proportions ni de style.
3. `generate/spritesheet` (1 crédit) avec `source_video_job_id` de l'étape 2, `chroma_key_auto=true` +
   `edge_despill_enabled=true` (despill 60, radius 3px) → grille 6×4 (640×640/cellule). **5 frames sur 6
   inspectées : nettes et propres.** 1 frame sur 6 avec un artefact résiduel de chroma-key (petit triangle
   rose mal détouré près de la jambe arrière en pose jambes-croisées) — défaut de despill, pas de dessin.

**Verdict révisé** : Gamelabs EST capable de produire un résultat net et fidèle à notre registre stick-figure,
à condition de (a) cadrer explicitement le personnage pour qu'il remplisse le cadre (pas de sujet minuscule
dans un grand canevas), et (b) accepter un taux d'artefact de despill résiduel (~15-20% des frames sur ce test,
à vérifier sur un échantillon plus large avant de généraliser). **Le blocage raster/vecteur reste entier** —
même avec ce résultat propre, l'intégration dans une scène SVG mixte (notre registre Souverain actuel) créerait
toujours un choc de texture bitmap-vs-vecteur. Reste pertinent pour un personnage isolé composé sur fond
vidéo/raster (pas notre cas d'usage principal), ou comme référence visuelle/storyboard.

**Assets test** (scratchpad, non conservés dans le repo) : `stickfigure-v2-transparent.png` (image source),
`walk-video.mp4` (walk cycle 4s), `spritesheet-v2.png` (grille 6×4, 3840×2560), `spritesheet-v2-row0.png`
(comparatif 6 frames zoomées).

**Statut** : testé en pratique, ~6 crédits dépensés sur 20 (14 restants). Pipeline API REST fonctionnel et
documenté ci-dessus — réutilisable si un cas d'usage raster-compatible se présente.
