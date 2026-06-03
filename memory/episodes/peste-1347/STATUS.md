# STATUS — Peste 1347 (Atlas pur)
> Mis à jour : 2026-06-01

---

## ÉTAT

| Beat | Fichier | Render FINAL | Notes |
|------|---------|-------------|-------|
| Beat1 Hook | Beat1Hook.tsx (251L) | beat1-FINAL.mp4 ✅ | Validé |
| Beat2 Setup | Beat2Setup.tsx (478L) | beat2-FINAL.mp4 ✅ | Validé |
| Beat3 Densité | Beat3Densite.tsx (469L) | beat3-FINAL.mp4 ✅ | Validé |
| Beat4 Climax | Beat4Climax.tsx (776L) | beat4-FINAL.mp4 ✅ | Validé |
| Beat5 Mali Vivant | Beat5MaliVivant.tsx (515L) | **AUCUN** ⛔ | 7 WIP + 2 versions — jamais validé |

**Assemblage final** : non commencé. Beat5 est le dernier avant assemblage.

---

## BLOQUÉ SUR

Beat5 Mali Vivant a été tenté 7+ fois (beat5_v1 → v7 + phases a/b/c séparées). Probablement abandonné à cause d'une des trois raisons typiques :
- Caravane animée difficile à synchroniser avec l'audio
- Route d'or SVG path pas parfaitement alignée sur la carte
- Transition vers la conclusion (Europe vs Mali) pas assez percutante visuellement

**À vérifier en reprenant** : regarder `out/episodes/peste-1347/versions/beat5_V2.mp4` — c'est le dernier présenté à Aziz. Peut-être proche d'être bon ?

---

## PROCHAINE ACTION

1. **Regarder `beat5_V2.mp4`** — est-ce acceptable avec corrections mineures ou à refaire ?
2. Si corrections mineures → lire `Beat5MaliVivant.tsx` + appliquer
3. Si refaire → `python3 scripts/atlas-session.py --episode peste-1347 --beat 5`
4. Valider → promouvoir `beat5-FINAL.mp4`
5. Assembler les 5 beats → render épisode complet

**Commande démarrage** : `python3 scripts/atlas-session.py --episode peste-1347 --beat 5`

---

## ASSETS DISPONIBLES (Beat5)

- Souleymane walk east/west : `public/atlas/peste-1347/assets/characters/souleymane/animations/walk/`  ✅
- Storyboard complet : `public/atlas/peste-1347/storyboard/beat5-storyboard.md` ✅
- Route or SVG path (précalculée) : dans le storyboard, section COORDONNÉES SVG ✅
- POI SVG : Niani (210,737), Tombouctou (250,696), Maghreb (235,556), Florence (354,463), Venise (362,446) ✅
- Script audio : "Pendant ce temps, Mansa Souleymane gouverne le Mali..." ✅

---

## CORRECTIONS OUVERTES (avant publication)

Aucune correction documentée spécifiquement pour Peste 1347.
Vérifier cohérence visuelle Beat5 avec le reste de l'épisode (même palette, même spring pop).

---

## TECHNIQUES DÉVELOPPÉES DEPUIS QUI S'APPLIQUENT ICI

Depuis la pause sur ce beat, on a appris/validé :

| Technique | Source | Application Beat5 |
|---|---|---|
| **AnimatedCaravan.tsx** | `_reference-atlas-poc/composants-tsx/` | Caravane or Mali → Florence directement réutilisable |
| **AnimatedPath.tsx** | `_reference-atlas-poc/composants-tsx/` | Route SVG animée — alternative à l'animation path manuelle |
| **DOM Marker Mapbox géo-attaché** | `memory/feedback_mapbox-dom-marker-validated.md` | Labels Niani/Tombouctou qui suivent la carte |
| **Spring Pop sprites** | Atlas guard hook | Souleymane apparition — déjà dans le hook |
| **D3.js utility-only** | `memory/feedback_d3-pattern-utility-only.md` | Si données quantitatives à visualiser |

**Recommandation** : avant de recoder Beat5 from scratch, tester `AnimatedCaravan.tsx` depuis `_reference-atlas-poc/` — c'est exactement le cas d'usage (caravane qui suit une route SVG).
