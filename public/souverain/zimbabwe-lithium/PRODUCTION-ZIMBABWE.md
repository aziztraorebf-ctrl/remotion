# Production Zimbabwe Lithium — État des beats
> Mis à jour : 2026-05-13. Lire AVANT de toucher quoi que ce soit.

## Pipeline officiel

**Lire d'abord** : `memory/tools/workflow-souverain-gemini-pipeline.md` — inclut la **CHECKLIST BLOQUANTE** à cocher avant de coder chaque beat.

## Backgrounds de l'épisode

| Fichier | Statut | Usage |
|---------|--------|-------|
| `assets/beat2/bg_premium_dots.png` | ✅ Validé Aziz | Beats data-viz tech (navy dots spotlight) |
| `bg-kraft-aged.png` | ❌ À générer | Beats narratifs document |
| `bg-sepia-texture.png` | ❌ À générer si besoin | Beats géo/carte |
| `bg-noir-cinematic.png` | ❌ À générer si besoin | Beats climax |

**Règle** : générer les backgrounds manquants AVANT de coder les beats qui en ont besoin.

---

## État beat par beat

### Beat 1 — Hook
- Breakdown : `assets/breakdown/` — vérifier
- Assets : à évaluer
- Code : ❌ À faire
- Validé : ❌

### Beat 2 — Tension ×15 (minerai → batterie)
- Breakdown JSON : ✅ `assets/breakdown/beat2_breakdown.json`
- Assets générés :
  - `bg_premium_dots.png` ✅
  - `raw_lithium_screen.png` ✅ (fond noir pour mix-blend-mode screen)
  - `battery_screen.png` ✅ (fond noir pour mix-blend-mode screen)
- Code : ✅ `Beat2Tension.tsx` — PNG assets avec `mixBlendMode: "screen"`
- Render : ✅ `out/episodes/zimbabwe-lithium/wip/beat2_v5.mp4`
- Catbox : https://files.catbox.moe/i6u24i.mp4
- Validé Aziz : ✅ "encore mieux que le storyboard"

**Décision technique validée** :
- Assets sur fond noir → `mixBlendMode: "screen"` — pas de chroma key, pas d'alpha
- Background atmosphérique PNG > CSS pur pour le fond

### Beat 3 — Catalyseur
- Breakdown JSON : ✅ `assets/breakdown/beat3_breakdown.json`
- Assets : ❌ À générer selon breakdown
- Code : ❌ À faire
- **Avant de coder** : lire le JSON, cocher la checklist bloquante

### Beat 4 — Transition "Mais à quel prix ?"
- Breakdown JSON : ✅ `assets/breakdown/beat4_breakdown.json`
- Assets : ✅ `assets/beat4/dark_smoky_navy_bg.png` (fond noir, screen)
- Code : ✅ `Beat4Transition.tsx` v4 — fond dots navy #141c2e + d3-geo Zimbabwe ISO 716
- Render : `out/episodes/zimbabwe-lithium/wip/beat4_v4.mp4`
- Catbox : https://files.catbox.moe/5afpc8.mp4
- Validé : ⏳ Pending validation Aziz

### Beat 5 — Démonstration (Zimbabwe $400M → Huayou Cobalt)
- Breakdown JSON : ✅ `assets/breakdown/beat5_breakdown.json` (v2, 3.1-pro + storyboard amélioré)
- Assets : ✅ `assets/beat5/chinese_flag_minimal.png` (fond noir, mixBlendMode screen)
- Storyboard amélioré : ✅ `assets/storyboard-v6/beat5-improved.png`
- Code : ✅ `Beat5Demonstration.tsx` v9 — layout partiel, à finaliser avec Tailwind
- Render : `out/episodes/zimbabwe-lithium/versions/beat5_V9.mp4`
- Catbox : https://litter.catbox.moe/f7fzb2.mp4 (24h — expire)
- Validé : ⏳ Pending — **layout à reconstruire avec Tailwind** (voir MIGRATION_PLAN.md)
- Problèmes connus : carte trop petite, "A BÂTI L'USINE SUR SON SOL" wrap 2 lignes
- Solution : migration Tailwind flex vertical + design tokens Souverain

### Beat 6 — Question/CTA
- Breakdown JSON : ✅ `assets/breakdown/beat6_breakdown.json`
- Assets : ❌ À générer
- Code : ❌ À faire

---

## Règles spécifiques Zimbabwe

1. **Background beats 3-6** : utiliser `bg_premium_dots.png` (existant, validé) sauf si le beat demande explicitement un registre différent
2. **Tous les assets PNG sur fond sombre** : fond noir + `mixBlendMode: "screen"`
3. **Prompts assets** : copier INTÉGRALEMENT depuis le breakdown JSON, zéro réécriture
4. **SVG custom interdit** si le JSON demande un PNG — utiliser `<Img>` vers le PNG généré

---

## Brief pour l'autre instance Claude

**Ce qui a mal fonctionné dans la session précédente :**

1. Les PNG assets du JSON (`raw_lithium_hexagons.png`, `battery_component_gold.png`) existaient mais n'ont pas été utilisés — le code a dessiné des polygones SVG à la main à la place. **Règle : si le JSON dit `asset_source: "to_generate"` → générer le PNG et l'utiliser avec `<Img>`, jamais de SVG custom.**

2. Les PNG générés avaient un fond non-transparent (gris ou noir) — le code les utilisait comme si c'était transparent → damier visible. **Règle : sur fond sombre → fond noir + `mixBlendMode: "screen"`. Jamais de chroma key PIL.**

3. Les prompts assets ont été réécrits au lieu d'être copiés. **Règle : copier le champ `prompt` du JSON mot pour mot, sans modification.**

**Ce qui est correct et à ne pas toucher :**
- Timeline frames (F_LABEL_LEFT, F_MINERAI, etc.) — correctes, calées sur l'audio
- ×15 stamp spring (stiffness 120, damping 12) — conforme JSON
- Background `bg_premium_dots.png` — validé Aziz
- Flux animé gold sur la ligne — validé
- Labels MINERAI BRUT / COMPOSANT CHINE — conformes
