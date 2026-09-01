# Mapbox Studio Desktop = pas necessaire pour Atlas

**Regle :** ne pas pousser Aziz vers Mapbox Studio Desktop pour editer les styles. Le workflow par code (style.json local + edits Python/JSON) est plus precis et reproductible.

**Why :** session 2026-04-29, Aziz a demande "donc on n'aura pas besoin de faire le style.json dans Mapbox Studio Desktop ?". Reponse : non. Le style `atlas-parchemin-mande-relief.json` est un fichier local importe directement dans Remotion via `import parcheminReliefStyle from "..."`. Mapbox GL JS lit le fichier local sans passer par Mapbox Studio. L'idee initiale d'utiliser Mapbox Studio etait pour edition visuelle drag-and-drop, mais comme on edite tout par code, c'est inutile pour ce workflow.

**How to apply :**
- Ne pas suggerer Mapbox Studio Desktop dans les briefs Atlas
- Toutes modifications de style = edition directe du JSON (Edit tool ou script Python)
- Si Aziz reparle de Mapbox Studio Desktop : confirmer que c'est pour ce projet inutile
- Exception : si on veut tester visuellement un nouveau style avant de coder, l'editeur web Mapbox Studio (gratuit) suffit — pas besoin de Desktop

Note (2026-08-31) : le style `atlas-parchemin-mande-relief.json` référencé n'a pas été retrouvé dans le
repo actuel (projet Atlas en pause, cf `memory/MEMORY.md` § R&D en pause) — le PRINCIPE (édition par code
> Mapbox Studio Desktop) reste valable pour toute future reprise Atlas ou tout autre projet Mapbox à style
custom.

---
Migré depuis auto-memory (`feedback_mapbox-studio-desktop-pas-necessaire.md`) le 2026-08-31, contenu
original inchangé.
