# Migration Tailwind CSS — Remotion Souverain
> Créé fin de session 2026-05-13. À charger en début de prochaine session.

---

## Contexte — Pourquoi migrer

### Le problème documenté (Beat 5 Zimbabwe)

L'approche actuelle mélange deux systèmes incompatibles :
- `position: absolute` avec coordonnées calculées manuellement (`MAP_TOP = SAFE_TOP + MAP_H + 30`)
- `display: flex` pour la colonne droite

Résultat : chevauchements critiques sur mobile 9:16 (textes superposés, assets trop petits, marges non respectées). On a passé ~2h à corriger manuellement des positions pixel par pixel sans jamais atteindre un résultat stable.

**Cause racine :** sans système de grille, chaque positionnement est une estimation aveugle. Les constantes s'accumulent, deviennent interdépendantes, et la moindre modification en casse d'autres.

---

## État actuel Beat 5 Zimbabwe

**Fichier code :** src/projects/souverain/zimbabwe-lithium/Beat5Demonstration.tsx
**Render dernière version :** `out/episodes/zimbabwe-lithium/versions/beat5_V9.mp4`
**Catbox :** https://litter.catbox.moe/f7fzb2.mp4(24h)

**Ce qui fonctionne en v9 :**
- Colonne droite : HUAYOU COBALT, drapeau Chine, 50 000 T/AN, 40 HECTARES — hiérarchie correcte
- Fond dots navy #141c2e — lisible mobile ✅
- d3-geo Zimbabwe Natural Earth ISO 716 ✅
- Drapeau Chine PNG fond noir + mixBlendMode screen ✅
- Animations spring OK, timing calé sur audio ✅

**Ce qui reste à corriger (Tailwind résoudra) :**
- Carte Zimbabwe trop petite dans col gauche
- "A BÂTI L'USINE SUR SON SOL" wrap sur 2 lignes
- $400M position instable selon les autres éléments
- Marge gauche insuffisante sur certains éléments

**Assets disponibles :**
- `public/souverain/zimbabwe-lithium/assets/beat5/chinese_flag_minimal.png` (fond noir, screen mode)
- `public/souverain/zimbabwe-lithium/assets/breakdown/beat5_breakdown.json` (breakdown 3.1-pro)
- `public/souverain/zimbabwe-lithium/assets/storyboard-v6/beat5-improved.png` (storyboard amélioré)
- Zimbabwe d3-geo path dans le code (Natural Earth 50m, ISO 716)

---

## Plan de migration Tailwind

### Étape 1 — Installation

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Vérifier compatibilité avec Remotion 4.x — Tailwind 4 utilise `@import "tailwindcss"` dans le CSS.

Remotion inject les styles via `<style>` dans le bundle — s'assurer que Tailwind est configuré pour scanner les `.tsx` du projet.

### Étape 2 — Design Tokens Souverain

Créer `tailwind.config.ts` avec :

```ts
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette Souverain
        gold:    { DEFAULT: "#c8a951", light: "#f0e8d8", dark: "#9a7830" },
        navy:    { DEFAULT: "#141c2e", deep: "#080d14",  light: "#1e2d4a" },
        slate:   { DEFAULT: "#9a8a6a", light: "#c8c0a8" },
        ivory:   "#f0e8d8",
      },
      fontSize: {
        // Tailles mobiles Souverain (base 1080px)
        "stat-xl":  ["180px", { lineHeight: "1",   fontWeight: "700" }], // $400M, chiffres clés
        "stat-lg":  ["120px", { lineHeight: "1",   fontWeight: "700" }], // 50 000 T/AN
        "stat-md":  ["80px",  { lineHeight: "1.1", fontWeight: "700" }], // 40 HECTARES
        "entity":   ["110px", { lineHeight: "1",   fontWeight: "700" }], // HUAYOU COBALT
        "label":    ["38px",  { lineHeight: "1.3", fontWeight: "400" }], // sous-titres
        "mono-sm":  ["28px",  { lineHeight: "1.4", fontWeight: "400" }], // annotations
      },
      spacing: {
        // Safe zones 9:16
        "safe-top":    "288px",  // 15% de 1920
        "safe-bottom": "192px",  // 10% de 1920
        "col-pad":     "54px",   // 5% de 1080 — padding interne séparateur
        "side-pad":    "30px",   // marge latérale minimale
      },
    },
  },
}
```

### Étape 3 — Structure Flexbox Beat 5

Remplacer tous les `position: absolute` du layout par :

```tsx
// Structure cible (pseudo-code)
<AbsoluteFill className="bg-navy flex">

  {/* Colonne gauche — flex vertical, centré */}
  <div className="flex-1 flex flex-col items-center justify-center gap-8 pt-safe-top pb-safe-bottom pl-side-pad pr-col-pad">
    <ZimbabweMap />                    {/* 50% largeur col = ~240px */}
    <span className="text-stat-xl text-gold">$400M</span>
    <span className="text-label text-slate">HARARE · ZIMBABWE</span>
    <Arrow />
    <span className="text-mono-sm text-slate/80">A BÂTI L'USINE SUR SON SOL</span>
  </div>

  {/* Séparateur */}
  <div className="w-px bg-gold/40 self-stretch my-safe-top" />

  {/* Colonne droite — flex vertical, aligné haut */}
  <div className="flex-1 flex flex-col gap-6 pt-safe-top pb-safe-bottom pl-col-pad pr-side-pad">
    <ChineseFlag />                    {/* 50% largeur col = ~240px */}
    <span className="text-entity text-ivory font-bold">HUAYOU COBALT</span>
    <span className="text-label text-slate">ZHEJIANG, CHINE</span>
    <Divider />
    <span className="text-stat-lg text-ivory">50 000 T/AN</span>
    <span className="text-label text-slate">capacité de transformation</span>
    <Divider />
    <span className="text-stat-md text-ivory">40 HECTARES</span>
  </div>

</AbsoluteFill>
```

### Étape 4 — Animations (inchangées)

Les springs Remotion restent identiques — Tailwind gère uniquement le layout statique. Les animations CSS (`transform`, `opacity`) via Remotion `interpolate()` ne changent pas.

Seul ajustement : remplacer les `style={{ opacity: X, transform: Y }}` inline par des variables CSS ou garder le style inline uniquement pour les valeurs animées.

---

## Règles à appliquer immédiatement (sans Tailwind)

Ces règles s'appliquent dès maintenant à tout nouveau beat Souverain :

1. **Jamais de `position: absolute` pour du texte layout** — réserver à la carte SVG, aux assets PNG, aux SVG flèches
2. **Colonne = un seul conteneur flex vertical** avec `gap` pour l'espacement
3. **Safe zone top 15%, bottom 10%** — respectées via padding, pas via margin absolue
4. **Carte pays : viewBox ajusté pour que la carte occupe 80%+ du conteneur**
5. **Font sizes mobiles** : stat ≥120px, label ≥38px, mono ≥28px — jamais moins

---

## Beats Zimbabwe restants

| Beat | Breakdown | Assets | Code | Validé |
|------|-----------|--------|------|--------|
| Beat 2 — Tension ×15 | ✅ | ✅ (`raw_lithium_screen.png`, `battery_screen.png`) | ✅ v5 | ✅ Aziz |
| Beat 4 — Transition | ✅ | ✅ (`dark_smoky_navy_bg.png`) | ✅ v4 | Pending |
| Beat 5 — Démonstration | ✅ | ✅ (`chinese_flag_minimal.png`) | ✅ v9 | Pending — layout à finaliser avec Tailwind |
| Beat 3 — Catalyseur | ✅ | ⏳ à générer | ❌ | — |
| Beat 6 — Question | ✅ | ⏳ | ❌ | — |
| Beat 1 — Hook | ✅ | ⏳ | ❌ | — |

---

## Scripts pipeline disponibles

```bash
# Étape 1.5 — amélioration storyboard
python3 scripts/improve_storyboard.py zimbabwe-lithium <beat_id>
python3 scripts/improve_storyboard.py zimbabwe-lithium <beat_id> --apply

# Étape 3 — génération assets (avec vérification pixel fond)
python3 scripts/prepare_beat.py zimbabwe-lithium <beat_id>

# Étape 4 — gate bloquant avant code
./scripts/validate_beat.sh zimbabwe-lithium <beat_id>
```

## Règles mémoire clés (lire avant de coder)

- `memory/tools/workflow-gemini-breakdown-schema.md` — workflow officiel 4 étapes (fusionné)
- `memory/feedbacks/feedback_gemini-assets-fond-transparent.md` — fond noir+screen vs fond crème
- `memory/feedbacks/feedback_souverain-backgrounds-valides.md` — 3 types valides, code CSS dots
- `memory/feedbacks/feedback_geo-zero-approximation.md` — d3-geo obligatoire, ISO codes
- `memory/feedbacks/feedback_review-mp4-avant-presentation.md` — extraire frames AVANT upload
