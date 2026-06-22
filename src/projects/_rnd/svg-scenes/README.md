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

## Ce qu'il y a ici (compos `RND-*` dans Root.tsx)

| Fichier | Registre | Scène | Note |
|---|---|---|---|
| `SvgSceneCoin.tsx` | médaille | (harnais disque doré) | enveloppe statique |
| `SvgScenePlanche.tsx` | blueprint | (harnais planche bleue) | enveloppe statique |
| `SvgSceneParchemin.tsx` | encre | (harnais parchemin) | enveloppe statique |
| `VilleCompare` / `VilleGeminiAnimee` | médaille | ville/port | « scène qui RESPIRE » |
| `EtatMajorCompare` / `EtatMajorGptAnimee` | médaille | carte d'état-major | « SE CONSTRUIT » (flèches tracées) |
| `OffshoreCompare` / `OffshoreGeminiAnimee` / `…SFX` | blueprint | plateforme offshore | SE CONSTRUIT + flux + ⭐ SFX timé |
| `OrganiqueCompare` (Profil/Duo/Animal) | encre | organique | ⛔ a prouvé que le SVG N'EST PAS pour l'organique |
| `DefenseCompare` / `DefenseGptAnimee` | tactique | défense mutuelle AES | ⭐ encart conceptuel, issu du vrai script Sahel |
| `CfaCompare` / `CfaFrancAnimee` / `…SFX` | tactique | mécanisme Franc CFA | produit par l'AGENT VIERGE (test reproductibilité) |

Les `*Bodies.ts` contiennent les SVG bruts générés par les LLM (auto-générés, jetables/régénérables).

## Règle d'or rappelée
- Animation = fonction de `frame` UNIQUEMENT (jamais CSS transition / @keyframes / setTimeout).
- innerHTML = rendu STATIQUE (juger la matière) ; pour ANIMER → réécrire en JSX (voir doctrine, gotcha).
- SFX : `<Sequence from>` obligatoire, plancher 0.50, vérifier durée au ffprobe.
- Choix du modèle : Gemini = organique/profondeur · GPT-5.5 = schéma/géométrie → générer les 2, choisir.
