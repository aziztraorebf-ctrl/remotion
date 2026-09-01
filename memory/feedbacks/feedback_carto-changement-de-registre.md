# Carto — changement de REGISTRE Mapbox en cours de carte (capacité prouvée)

**Quoi** : une meme carte Mapbox peut CHANGER DE REGISTRE pendant la scene pour servir un effet narratif —
pas seulement bouger la camera. Deja prototype et fonctionnel dans `src/projects/_shared/mapbox/MapboxCameraLab.tsx` :
- **S10 "Fade style switch"** (Lagos) : `dark-v11 (GeoAfrique V5) -> satellite`, transition par fade.
- **S9 "Zoom sol 3D"** : passage en `satellite-streets-v12`, pitch 70, zoom 15 (vue au sol).
Le helper `setStyle` + `MAPBOX_STYLES` (dark/satellite/relief/light) dans `MapboxBase.tsx` le permet.

**Why** : c'est un levier narratif fort des meilleures chaines carto, qu'on n'a JAMAIS exploite
intentionnellement (seulement teste). Idee d'Aziz (2026-06-21) : passer de Mapbox 3D pitche -> flat 2D
quand on passe de "survoler le terrain" a "analyser la donnee", OU changer de registre quand un concept
devient trop complexe a montrer dans le registre courant (faire apparaitre des choses autrement impossibles).

**How to apply** :
- C'est un OUTIL, pas un reflexe : changer de registre SEULEMENT quand la narration le justifie (transition
  d'intention : terrain->analyse, reel->schematique). Jamais gratuitement (un switch sans raison = gadget).
- Reste a EPROUVER en usage narratif (pas juste technique) : proto R&D dedie a faire, AVEC le pari PixelLab/
  organique-sur-carte (meme famille "exploration carto"). Voir CartoSouverainV5 (la cible 2D prouvee = le socle).
- Techniquement headless-safe a verifier sur le `setStyle` (re-appliquer applyGeoAfriqueV5 apres le switch).

**Garde-fou** (corrige une erreur 2026-06-21) : sur la cible V5 qui est DEJA navy, NE PAS faire de "bascule
vers navy" (ca venait du registre PARCHEMIN ou le monde se refermait visuellement). Sur V5, un etat "suspens/
attente" (ex Yakaar-Teranga) se traite par ISOLEMENT (assombrir le reste sauf le point, marqueur pointille qui
pulse, popup "Operateur : _"), pas par changement de fond. Le fond V5 ne change pas sans raison narrative forte.

---
Migré depuis auto-memory (`carto-changement-de-registre.md`) le 2026-08-31, contenu original inchangé.
