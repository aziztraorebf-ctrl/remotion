Demander les SFX à Gemini dans le même JSON que le storyboard — obligatoire pour le rendu premium.

Inclure les effets sonores dans le JSON Gemini dès la phase storyboard — ne pas les ajouter après.

**Why:** Ce qui rendait Or Africain premium c'était les SFX de carte : son de zoom quand la caméra se rapproche, impact quand un highlight apparaît, whoosh entre les beats, etc. Le JSON Gemini actuel ne les inclut pas — ça crée un gap entre la vision storyboard et le résultat final. Aziz l'a identifié comme l'élément manquant pour atteindre le niveau premium.

**How to apply:**
Dans le prompt Gemini storyboard, ajouter un champ `sfx` au JSON de chaque beat :

```json
"sfx": [
  { "trigger": "0s", "sound": "map-whoosh-in", "description": "zoom caméra qui s'approche" },
  { "trigger": "8s", "sound": "highlight-pop", "description": "impact doux quand le highlight pays apparaît" },
  { "trigger": "10s", "sound": "label-snap", "description": "click net quand le label spring pop" }
]
```

Types de SFX à demander selon le contexte :
- Beats Mapbox : `map-zoom-in`, `map-zoom-out`, `map-flyover`, `highlight-pop`, `label-snap`
- Beats data/graphisme : `number-impact`, `bar-grow`, `scale-crash`, `pulse-ping`
- Transitions : `cut-whoosh`, `loom-weave`, `fade-breath`

Règle : demander à Gemini de justifier chaque SFX narrativement (pourquoi ce son à ce moment).

---
Migré depuis auto-memory (`feedback_sfx-dans-json-gemini.md`) le 2026-08-31, contenu original inchangé.
