---
name: Sprites top-down — Gemini bat Recraft (diagnostic + recette)
description: Pour un sprite vu STRICTEMENT du dessus (vehicule, token de carte), Recraft echoue (corpus lateral + "map" declenche un fond decoratif). Gemini reussit du 1er coup. Recette validee.
type: feedback
---

# Sprites top-down : Gemini, pas Recraft (validé 2026-06-05, prototype Sudan war map)

**Why** : pour la couche vehicules top-down d'une carte de guerre (char/technical posés à plat sur la carte, orientés selon la marche), il faut un VRAI vu-du-dessus. Recraft a échoué 3 fois, Gemini a réussi du 1er coup.

## Diagnostic Recraft (pourquoi ça rate)
1. **`style: digital_illustration`** = rendu illustration riche/3D -> sort en ISO 3/4 (char "hero render"), jamais à plat.
2. **Corpus vehicule = lateral.** Même en `vector_illustration` + `roundish_flat`, "tank/truck" sort en vue de COTÉ. Quand on force "from above", soit il ignore (côté), soit il donne le DESSOUS/châssis littéral.
3. **Le mot "map" / "war map symbol" déclenche un FOND décoratif** (routes, épingles, grille, rose des vents) autour du sujet = le "bazar" récurrent.
- Recraft EXCELLE par contre en **vue de côté flat premium** (substyles `2d_art_poster`, `long_shadow`) = à réserver aux inserts/cartons/portraits latéraux, PAS aux tokens top-down.

## Recette Gemini qui MARCHE (recette réutilisable)
- Modèle : `IMAGE_MODEL` (defaut Lite — le sprite est detoure via Recraft puis anime par nous, jamais publie tel quel ; ⛔ importer depuis `scripts/tools/gemini_models.py`, jamais en dur).
- SDK : `from google import genai` ; `client.models.generate_content(model=..., config=GenerateContentConfig(response_modalities=["image","text"], temperature=0.25))`.
- **Prompt** : décrire ce qu'on VOIT d'en haut, pièce par pièce ("you see the rectangular hull, the round central turret, the gun barrel extending toward the TOP edge, tracks on left/right"). Marteler "STRICTLY from directly straight above, bird's eye orthographic, looking straight down", "no perspective, no side view, no 3/4 view". Faire pointer le sujet vers le HAUT (-> rotation écran = cap).
- **Fond** : Gemini ne fait pas de transparent natif. Solution A (`feedback_gemini-assets-fond-transparent`) : imposer fond cream solide `#d4c29d` ("UNIFORM solid CREAM ... edge to edge, WITHOUT transparency/checkered/gradient, WITHOUT any map/roads/grid/compass/pins"), vérifier pixel(4,4) ~ (212,194,157), puis **Recraft removeBackground** (`/v1/images/removeBackground`) pour le PNG transparent final.
- Script : `/tmp/mapdecode/gen_gemini_sprites.py` (modèle réutilisable).

## How to apply
Tout asset "token de carte vu du dessus" (véhicule, unité, icône posée sur une carte top-down) -> Gemini avec cette recette. Recraft pour le latéral stylisé. Voir [[feedback_gemini-assets-fond-transparent]] et le DECODE [[DECODE-daybyday-warmap]].

## ⚠️ PIÈGE EMBLÈME (Sahel P3, 2026-06-12) — quand le sujet a un LOGO connu
Demander un asset nommé d'après une entité à forte identité visuelle (Wagner/Africa Corps, un État, une
marque) → l'IA génère le LOGO/emblème héraldique (étoile-crâne pour Wagner), PAS un objet-au-sol. Sur une
carte = logo incongru qui flotte.
**Parade (verrou principal)** : interdits explicites dans le prompt — `NO flag, NO emblem, NO logo, NO skull,
NO star symbol, NO text`. Décrire l'OBJET physique vu du dessus (campement HESCO, tentes, véhicules, tour),
jamais l'organisation. Script : `scripts/gen-africacorps-base.py` (réutilisable).
**Cohérence de perspective** : matcher l'asset de référence DÉJÀ sur la carte. Gotcha : `base-minusma-td.png`
est en réalité ISO 3/4 (pas top-down strict) → un nouveau top-down strict à côté crée une légère dissonance
de famille. Vérifier la perspective de la réf AVANT de prompter, pas seulement l'échelle.

## Assets produits
`public/_shared/sprites/warmap/tank-td-blue.png` + `tech-td-red.png` (top-down transparent, prototype Sudan).
`base-africacorps.png` (Sahel P3 — fortin paramilitaire top-down, remplace l'emblème étoile-crâne sauvegardé
en `base-africacorps-emblem.png`). Drapeau Mali canvas pur : `public/_shared/flags/ml.png` (3 bandes).
