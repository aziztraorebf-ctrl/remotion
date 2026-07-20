# _rnd/svg-scenes — BIBLIOTHÈQUE DE RÉFÉRENCE R&D « SVG génératif de scènes »

> ⚠️⚠️ **CES FICHIERS SONT DES PROTOTYPES DE RÉFÉRENCE — PAS DES COMPOSANTS DE PRODUCTION.**
> NE PAS les brancher tels quels dans une vidéo livrable. Ils existent pour **regarder ce qui a déjà
> été créé** et pour **continuer à travailler sur le système SVG** dans de futures sessions.
> Si une vidéo doit utiliser une de ces scènes → la RÉ-ADAPTER au contexte réel (script, audio, timing,
> géo) et seulement après validation d'Aziz. Ne jamais déposer un proto brut dans un livrable sans qu'il
> le demande explicitement.

## À quoi ça sert
Session R&D 2026-06-21 : prouver qu'un LLM (Gemini 3.1 Pro / GPT-5.5) peut dessiner une SCÈNE SVG complète
en groupes nommés, qu'on anime ensuite par la frame (Remotion). Doctrine complète + verdicts + règles :
**`memory/doctrines/SVG-SCENES-GENERATIVES.md`** (LIRE EN PREMIER). Générateur : `scripts/tools/rnd-svg-scene-gen.py`.

## Scènes de RÉFÉRENCE actives (compos `RND-*` dans Root.tsx)

| Fichier | Registre | Scène | Note |
|---|---|---|---|
| `SvgSceneCoin.tsx` | médaille | (harnais disque doré) | enveloppe statique |
| `SvgScenePlanche.tsx` | blueprint | (harnais planche bleue) | enveloppe statique |
| `SvgSceneParchemin.tsx` | encre | (harnais parchemin) | enveloppe statique |
| `VilleCompare` / `VilleGeminiAnimee` | médaille | ville/port | « scène qui RESPIRE » |
| `EtatMajorCompare` / `EtatMajorGptAnimee` | médaille | carte d'état-major | « SE CONSTRUIT » (flèches tracées) |
| `OffshoreCompare` / `OffshoreGeminiAnimee` / `…SFX` | blueprint | plateforme offshore | SE CONSTRUIT + flux + ⭐ SFX timé |
| `DefenseCompare` / `DefenseGptAnimee` ⚠️ archivé (`_archive/DefenseGptAnimee.tsx`, exclu du build) | tactique | défense mutuelle AES | ⭐ encart conceptuel, issu du vrai script Sahel — rendu réf : https://files.catbox.moe/05xbm1.mp4 |
| `CfaCompare` / `CfaFrancAnimee` / `…SFX` | tactique | mécanisme Franc CFA | produit par l'AGENT VIERGE (test reproductibilité) |
| `MineCompare` / `MineGeminiAnimee` ⚠️ archivé (`_archive/MineGeminiAnimee.tsx`, exclu du build) | braise-or | mine d'or Darfour (16:9) | 1er test 16:9 + chaud + 28s (chargée — leçon : trop d'éléments) — rendu réf : https://files.catbox.moe/lkf0ia.mp4 |
| ⭐ `HeroGptAnimee` ⚠️ archivé (`_archive/HeroGptAnimee.tsx`, exclu du build) | or-jour | « suivre l'or » Soudan HÉROS (16:9) | scène-référence ÉPURE : tomber-sec + bascule couleur + remap palette + fumée réécrite à la main — rendu réf : https://files.catbox.moe/1ws3kh.mp4 |
| `GraineStatic` / `GraineGeminiAnimee` ⚠️ archivé (`_archive/GraineGeminiAnimee.tsx`, exclu du build) | encre | graine / germination GGW | proto botanique — rendu réf : https://files.catbox.moe/ft5l5g.mp4 |
| `CfaMidformTest` | tactique | test mid-form CFA 3 scenes | ⭐ preuve format long SVG (catbox fe3u3g) |
| `JetonsGlmDemo` / `JetonsQwenDemo` | tactique | jetons carte GLM/Qwen | comparaison modeles |
| `GisementTokensGlm` / `GisementTokensQwen` | tactique | gisements Sénégal tokens | comparaison modeles |
| **Beats GGW (encre narrative)** | | | |
| `GgwHookEncreVivant` | encre | Hook GGW (BEAT 1) | ⭐⭐ REF encre narrative + colorisation timee |
| `B2LigneBrisee` | encre | Echec plantations (BEAT 2) | ⭐⭐ REF ligne brisee + soleil ardent + micro-sources |
| `B3Malentendu` | encre | Le malentendu desert (BEAT 3) | ⭐⭐ REF muraille qui reste + couleur-diagnostic |

Les `*Bodies.ts` contiennent les SVG bruts générés par les LLM (auto-générés, jetables/régénérables).

## ⛔ Variantes écartées — BLOQUÉES dans Root.tsx (non déplaçables sans casser le build)

Les fichiers ci-dessous sont des variantes de R&D écartées mais **IMPORTÉES dans Root.tsx** (lignes ~197-224).
Un `git mv` casserait le build. Statut : à désimporter lors d'un chantier dédié de nettoyage Root.tsx.
Dossier `_archive/` créé mais vide en attente de ce chantier.

| Fichier | Raison d'écart |
|---|---|
| `OrganiqueCompare.tsx` | ⛔ prouvé que SVG N'EST PAS pour l'organique (blob informe) |
| `GgwD3GeoMap*.tsx` (x4) | piste geo d3 abandonnée (geo réelle = Mapbox) |
| `GgwHookNarr3.tsx` / `GgwHookNarr4.tsx` | variantes hook narratif écartées |
| `GgwHookPair.tsx` | grille comparative écartée |
| `GgwHookSvg6Up.tsx` | grille 6 variantes écartée |
| `GgwSvgTestCompare.tsx` | comparaison coupes de test écartée |
| `GgwTreesCompare.tsx` | comparaison arbres écartée |
| `Img2SvgCompare.tsx` | outil test écart image→SVG (reproductible par svg-faisabilite-brief.py) |
| `MurTopDownBraise.tsx` | mur top-down écartée (piste abandonnée) |
| `TopDown3Compare.tsx` | comparaison top-down écartée |
| `DemiLuneCompare.tsx` / `DemiLuneBraiseAnimee.tsx` / `DemiLuneEncreColorisee.tsx` | variantes demi-lune écartées |
| `B2MecheEteinte.tsx` / `B2Sablier.tsx` | variantes Beat 2 non retenues |

**Chantier nettoyage Root.tsx** : désimporter ces 16+ composants + `<Composition>` correspondants + `git mv` vers `_archive/`. Faire dans une session dédiée (risque de TypeScript errors à gérer). Jamais en pleine prod.

## Règle d'or rappelée
- Animation = fonction de `frame` UNIQUEMENT (jamais CSS transition / @keyframes / setTimeout).
- innerHTML = rendu STATIQUE (juger la matière) ; pour ANIMER → réécrire en JSX (voir doctrine, gotcha).
- SFX : `<Sequence from>` obligatoire, plancher 0.50, vérifier durée au ffprobe.
- Choix du modèle : Gemini = organique/profondeur · GPT-5.5 = schéma/géométrie → générer les 2, choisir.
