# Carrousels Atlas = Format Carte de Jeu (AtlasFormat2CarteDeJeu)

> Migré depuis auto-memory 2026-08-31 (validé Aziz 2026-05-31). Projet Atlas GeoAfrique archivé
> depuis — conservé pour le principe réutilisable (labels natifs incrustés dans la frame ne
> supportent aucun overlay texte superposé) si un système de carrousel est relancé.

**Règle :** Les vidéos Atlas (100% Remotion/D3 : cartes pixel art + data-viz) nécessitent un format carrousel différent des vidéos avec clips vidéo générés. Utiliser `AtlasFormat2CarteDeJeu` — jamais un composant de carrousel type overlay-sur-clip.

**Why :** Les vidéos Atlas ont des titres et labels incrustés dans chaque frame ("L'OR EN CIRCULATION", "LE CAIRE", "EXPÉDITIONS LES PLUS COÛTEUSES"). Tout overlay texte crée une collision illisible. Un voile navy (même à opacity 0.55) n'efface pas les formes des lettres — l'œil perçoit deux couches de texte en compétition. Validé après 3 itérations d'échecs + consultation Gemini DA.

## How to apply

### Composant (référence historique, ⚠️ vérifier existence) : `AtlasFormat2CarteDeJeu`

```
src/projects/souverain/carousels/hybrid/AtlasFormat2CarteDeJeu.tsx
```

Layout :
```
+---------------------------+
| [branding + barres progression]|
| Fond navy global          |
|   +-------------------+   |
|   | clip/image encadré|   |
|   | (bordure or 3px)  |   |
|   +-------------------+   |
|  HIGHLIGHT (gold 88px)    |
|  Texte (ivory 46px)       |
|  [FOOTER]                 |
+---------------------------+
```

Props clés :
- `bgImage` : chemin vers le clip ou l'image
- `isVideo: true` pour un clip animé (OffthreadVideo), `false` pour image statique (Img)
- `highlight` : chiffre/mot clé gold (ex: "12 tonnes d'or")
- `body` : texte adapté pour carrousel (PAS verbatim narration)

## Règle clips : data-viz pure uniquement

✅ OK : bar chart, pie chart, line chart, courbe — zéro label cartographique dans le cadre
❌ INTERDIT : clips de carte avec labels géo ("LE CAIRE", "LA MECQUE", etc.) — impossibles à masquer

**Timestamp optimal exemple** : t=62.5s (animation en cours, compteur 3.6t→12t, 4s de clip propre) — spécifique à un cas d'usage passé, à recalculer par sujet.

## Règle texte : adapter, ne pas copier

Le transcript = source de vérité pour les **faits**, pas pour le **wording**.
- INTERDIT : copier verbatim la narration (conçue pour l'oreille, pas les yeux)
- OBLIGATOIRE : lire le transcript, extraire les faits, réécrire pour le format slide
- Exemple : "Le Mali produit la moitié de l'or qui circule dans le monde. La moitié." → "Le Mali produisait 50% de l'or mondial."

## Formats testés et rejetés (ne pas retenter sans raison)

| Format | Problème |
|---|---|
| Overlay texte sur clip vidéo | Collision avec titres natifs Atlas |
| Frame statique + voile navy 0.3-0.55 + overlay | Labels cartographiques lisibles sous le voile |
| Smart Crop (zoom 2.4x) | Perd le personnage, labels peuvent rester |
| Panneau latéral opaque | Asymétrie variable selon le clip |
