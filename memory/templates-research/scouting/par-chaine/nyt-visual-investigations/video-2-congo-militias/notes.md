# NYT Visual Investigations — Militias Burning Villages in Congo

URL : https://youtube.com/watch?v=sjNPwP_iiVw
Durée analysée : ~12 frames échantillonnées (1/8s)

## Axe 1 — Palette  🟢

| Bloc | HEX inférés | Mood | Ratio |
|------|-------------|------|-------|
| Satellite vert profond | `#2f4a32` `#3d5d3f` | Forêt humide tropicale | ~55% sur cartes |
| Eau lac/océan | `#1a3a4a` `#22455c` | Profondeur, frontière | ~25% sur cartes carto |
| Annotations blanches | `#ffffff` + `#dcdcdc` | Lecture immédiate | typo, traits |
| Accent ambre | `#f4b840` `#e89c2a` (icônes feu) | Alerte événement | ponctuel |
| Footage doc désaturé | `#4a3d30` `#a8946c` `#cfc0a4` | Tristesse, témoignage | ~40% scènes hors carte |

**Palette dominante "satellite + traits blancs"** — quasi-identique à Template C envisagé. Très proche du satellite Atlas Caspian.

## Axe 2 — Assets / Figures d'animation  🟢

- **Carte satellite haute-résolution** : NASA/Maxar style, vraies textures forêt-rivière (pas de stylisation Mapbox)
- **Labels pays/lieu typo italique serif** (Cheltenham/Georgia style NYT) : `DEMOCRATIC REPUBLIC OF CONGO`, `LAKE ALBERT`, `UGANDA` — opacity 70%, blanc, en majuscules large-tracked
- **Flèches dashed blanches** : 4-5 lignes pointillées convergent vers point Sebagoro (migration patterns), `stroke-dasharray` ~6 6
- **Point lumineux blanc** + label town avec ombre noire
- **Échelle carto** : `10 miles` segment blanc avec ticks (top-right) — composant signature OSINT
- **Date stamp** : `JAN. 1 – FEB. 23, 2018` typo serif italique top-right, format date majuscule
- **Icônes feu emoji-like** orange/jaune semi-stylisées posées sur satellite (incidents incendies, pas pastilles abstraites)
- **Filigrane "T" NYT** bottom-right permanent
- **Footage témoin** non recadré, plein écran avec filigrane intégré

## Axe 3 — Mouvements caméra  🟢

- **Pop-in séquentiel des éléments carto** : labels d'abord, traits ensuite, point cible en dernier
- **Apparition feu icônes échelonnée par date** : timelapse mois par mois, ~30 incendies sur 50 jours = grammaire claire
- **Tilt-shift focus** sur footage témoin : flou bord, net centre
- **Coupes sèches** entre carto et footage, jamais de wipe/dissolve
- **Pan latéral très lent** sur satellite figée (drift Ken Burns 0.5%/sec)
- **Zoom progressif sur footage** rugueux (push-in lent ~1s puis hold)

## Reproductible Souverain ?

✅ Échelle `X miles` + date stamp italique : composants texte purs Remotion
✅ Flèches dashed convergentes : SVG overlay sur Mapbox satellite (validé Or Africain)
✅ Labels pays italique serif tracking large : font-family Georgia/EB Garamond + letter-spacing
🟡 Vraies tuiles satellite haute-rés : Mapbox `mapbox://styles/mapbox/satellite-v9` proche, mais moins photoréaliste qu'NASA. Acceptable.
🟡 Icônes feu : Gemini génère facilement, ou on importe emoji 🔥 stylisé
🔴 Timelapse vrai NASA datée : impossible à reproduire fidèlement. Imiter via apparition séquentielle sur satellite Mapbox figé.

## Top observations backlog

1. **Date stamp italique serif top-right** + **échelle miles** = signatures OSINT crédibilité, à reproduire systématiquement
2. **Pattern "icônes événement par date"** = idéal pour timelapse Souverain (ex: "depuis 2020, 7 contrats miniers signés")
3. **Labels pays italique serif tracking large opacity 70%** = pattern typographique distinctif vs nos labels actuels (sans-serif). À tester en Template C.
