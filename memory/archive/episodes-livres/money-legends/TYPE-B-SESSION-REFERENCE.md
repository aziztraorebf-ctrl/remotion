# Type B — Fichier de Référence Session Complet
> Créé 2026-05-05. Source de vérité pour la prochaine session de production.
> Lire CE FICHIER en premier avant de toucher quoi que ce soit.

---

## C'est quoi le Type B

Format vidéo court (60-90s) basé sur un fait d'actualité africain récent (<30 jours) traité de façon analytique et neutre. Différent d'Atlas (géographie intemporelle) et de Money Legends long (essay 10 min). Le Type B nourrit l'algorithme rapidement tout en restant dans la niche GéoAfrique.

**Positionnement :** Pas d'actualité militaire/diplomatique partisan. Sujets économie + ressources + chiffres surprenants + records. Zéro lexique "néocolonialisme", "pillage", "exploitation" — angle factuel pur.

---

## Scripts verrouillés dans le tiroir

### Script 1 — Mansa Musa Short (75s)
Fichier : `memory/episodes/money-legends/SCRIPT-V2-LOCKED.md`
Score jury : 7.4/10
Hook : "En 1324, un seul homme a crashé l'économie du Caire. Pas par guerre. Par générosité."
Trend actif : or $5,589/once mai 2026
Assets disponibles : photo Gemini caravane, musique kora, carte Mali SVG, sprites chameaux

### Script 2 — Or africain Ghana royalties (75s)
Fichier : `memory/episodes/money-legends/OR-AFRICAIN-SCRIPT-V2-LOCKED.md`
Score jury : 7.2/10 (gate 9.5/10)
Hook : "Le prix de l'or vient de battre tous les records. Six gouvernements ont tenté d'empêcher le Ghana de toucher sa part. Le Ghana a signé quand même."
Trend actif : Ghana royalties signées mars 2026, Mali/Barrick $430M nov 2025
Assets disponibles : carte Afrique SVG (_shared/), composants Remotion (POC Money Legends)

---

## Architecture visuelle Type B — 3 couches validées

### Couche 1 — Mapbox (géographie, ancrage spatial)
- Vue satellite ou stylisée
- Highlight pays (couleur or ou rouge selon ton)
- Drapeaux, points lumineux, labels
- Durée typique : 3-5s par beat géographique
- Usage : "où ça se passe" — immédiat, crédible
- Proportion dans la vidéo : ~15-20% du temps total (pas dominant)

### Couche 2 — Remotion pur (données, preuves, chiffres)
- Text cards, courbes animées, compteurs, listes cascade
- Sources citées visuellement (badge source en bas)
- Rythme : 1 nouvel élément toutes les 4-5s
- Proportion : ~60-70% du temps total (dominant)

### Couche 3 — Gemini/PixelLab (émotion, différenciation)
- Images stylisées NON-RÉALISTES (décision de différenciation vs concurrents)
- Style à définir : entre infographie illustrée et estampe africaine (Option B)
- Icônes PixelLab : lingot d'or, drapeau pixelart, mine, etc.
- Proportion : ~15-20% du temps total (inserts ponctuels)

**Règle des 4-5s :** quelque chose de nouveau doit apparaître à l'écran minimum toutes les 5 secondes. Jamais d'écran statique plus de 5s.

---

## Plan visuels validé — Script Or africain

| Beat | Durée | Couche | Visuel détaillé |
|------|-------|--------|-----------------|
| Beat 1 — Hook | 0-8s | Remotion | Text card full screen + compteur prix or 1000→5000 (spring animation) |
| Beat 2 — Contexte | 8-22s | Remotion | Graphique courbe prix or 2010→2026 + ligne royalties plate à 5% (dissonance visuelle) |
| Beat 3 — Le Fait | 22-42s | Mapbox + Remotion | Mapbox Ghana zoom depuis espace (4s) → Remotion "5%→12%" + cascade 5 drapeaux pays + "Le message : arrêtez." en rouge |
| Beat 4 — Le Twist | 42-62s | Mapbox + Remotion | Mapbox Afrique highlights successifs Mali/Burkina/Niger (8s) + compteur 430M$ → "Cinq pays. Même mouvement." |
| Beat 5 — Verdict | 62-75s | Remotion | Text card minimaliste fond noir uni (sans grille CSS) + silence SFX |

---

## POC validés ce soir (2026-05-05)

### POC 1 — Mapbox Ghana zoom depuis espace
- Composition : `MapboxGhanaHighlight`
- Fichier : `src/projects/poc-money-legends/MapboxGhanaHighlight.tsx`
- Ce qu'il fait : zoom depuis vue spatiale (~altitude 8000km) jusqu'au Ghana, highlight couleur or, label "GHANA" avec point lumineux
- Statut : [ ] À valider visuellement

### POC 2 — Courbe prix or Remotion
- Composition : `GoldPriceCurve`
- Fichier : `src/projects/poc-money-legends/GoldPriceCurve.tsx`
- Ce qu'il fait : courbe SVG animée prix or 2010→2026, ligne rouge plate royalties 5%, chiffre final $5000+ qui pulse
- Statut : [ ] À valider visuellement

---

## Prochaine session — Plan en 2 étapes

### Option B d'abord — Définir le style visuel Gemini signé
**Objectif :** générer 2-3 images test Gemini avec des styles différents, Aziz valide 1 style qui devient le style-ref permanent GéoAfrique Type B.
**Styles à tester :**
1. Infographie illustrée (flat design, couleurs vives, géométrique)
2. Estampe africaine moderne (texture grain, couleurs terracotta/or/vert)
3. Gravure documentaire (style journal illustré XIXe, noir/blanc + couleur accent)

**Règle :** une fois le style validé par Aziz, il devient le style-ref pour TOUS les inserts Gemini Type B suivants. On ne re-décide pas à chaque vidéo.

### Option A ensuite — Template Remotion Type B
**Objectif :** coder le template réutilisable avec composants préfabriqués.
**Composants à créer :**
- `TextCardTypeB` — text card avec grille CSS, spring animation, variantes (blanc/rouge/or)
- `CounterCard` — compteur animé isolé, configurable (devise, unité, couleur)
- `GoldCurveCard` — courbe prix or réutilisable (données configurables)
- `MapboxInsert` — wrapper Mapbox pour inserts 3-5s (highlight pays configurable)
- `CountryCascade` — liste pays qui s'ajoutent un par un avec SFX
- `SourceBadge` — badge source en bas d'écran (crédibilité éditoriale)
- `VerdictCard` — card finale fond noir uni sans grille (silence visuel)

**Fichier template :** `src/projects/type-b/TypeBTemplate.tsx`
**Une fois fait :** chaque nouvelle vidéo Type B = remplir les données dans le manifest, pas recoder.

---

## Manifest Type B — format cible

Pour chaque nouvel épisode Type B, remplir avant de coder :

```typescript
const MANIFEST = {
  title: "Or africain — Ghana royalties",
  duration: 75, // secondes
  voice: "z3gESu49naEZW8Af2Upm", // Narratrice GéoAfrique v2
  beats: [
    {
      id: "hook",
      start: 0, end: 8,
      layer: "remotion",
      component: "TextCardTypeB",
      data: { lines: ["...", "..."], color: "white" }
    },
    {
      id: "contexte",
      start: 8, end: 22,
      layer: "remotion",
      component: "GoldCurveCard",
      data: { from: 2010, to: 2026, royaltiesLine: 5 }
    },
    // etc.
  ]
}
```

---

## Workflow Type B complet — temps estimés

| Étape | Outil | Temps |
|-------|-------|-------|
| Gate validation (5 critères) | WebSearch + moi | 20 min |
| Last 30 Days (6 angles) | last30days skill | 30 min |
| Script V1 | moi | 10 min |
| Jury 4 LLM → script V2 locked | agents parallèles | 30 min |
| Manifest (remplir template) | moi + Aziz 5 min | 15 min |
| Style Gemini (1-2 inserts) | Gemini | 20 min |
| Mapbox config (highlight pays) | moi | 15 min |
| TTS ElevenLabs + timing | moi | 20 min |
| Composition Remotion (template) | moi | 45 min |
| Review Kimi + corrections | moi | 15 min |
| **Total session production** | | **~3h** |
| **Présence active Aziz** | | **~20 min** |

---

## Règles Type B non-négociables

1. **Gate validation ≥ 8/10 avant script** — si <8, ajuster l'angle ou changer de sujet
2. **Last 30 Days avant script** — trouver les mots exacts de l'audience avant d'écrire
3. **Jury 4 LLM systématique** — note + visuels + point faible critique
4. **Manifest avant code** — même règle qu'Atlas
5. **Nommer les acteurs explicitement** — jamais "six gouvernements", toujours "Les États-Unis, le Royaume-Uni et le Canada". Le lecteur ne connaît pas le contexte. Validé POC 2026-05-06.
6. **Années TTS en lettres orales** — "deux mille vingt-six" pas "vingt-vingt-six". Scanner toutes les années avant génération ElevenLabs. Validé POC 2026-05-06.
5. **Source à l'écran** pour tout fait chiffré (ex: $430M Barrick/Mali → "Bloomberg, nov. 2025")
6. **Zéro lexique partisan** — "néocolonialisme", "pillage", "exploitation" interdits dans le script
7. **Mapbox = insert max 20% du temps** — pas de scène principale, ancrage géographique seulement
8. **Style Gemini cohérent** — utiliser le style-ref validé, jamais de style ad hoc par vidéo

---

## Assets communs Type B (disponibles maintenant)

- Carte Afrique SVG — `src/projects/atlas/_shared/atlas-components.tsx` (svgToComp)
- Composants text cards — `src/projects/poc-money-legends/PocMoneyLegends.tsx` (GridBackground, TextCard, HighlightSource)
- Musique kora griot — `public/poc-money-legends/audio/music-v1.mp3` (163s)
- Voix ElevenLabs — Narratrice GéoAfrique v2 `z3gESu49naEZW8Af2Upm`

---

## Backlog sujets Type B zone verte (liste 10)

| # | Sujet | Score gate | Status |
|---|-------|------------|--------|
| 1 | CFA vers Eco | 9/10 | Disponible |
| 2 | Port Tanger Med | 8/10 | Disponible |
| 3 | Dette africaine Chine | 8/10 | Disponible |
| 4 | Barrage GERD Éthiopie | 9/10 | Disponible |
| **5** | **Lithium Congo** | **9/10** | **Priorité #2 après Or** |
| 6 | Lagos mégalopole | 8/10 | Disponible |
| 7 | Mpox vaccins | 9/10 | Disponible |
| **8** | **Or africain Ghana** | **9.5/10** | **SCRIPT LOCKED** |
| 9 | Forêt Congo carbone | 8/10 | Disponible |
| 10 | Diaspora africaine | 8/10 | Disponible |
