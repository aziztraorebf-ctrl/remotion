# HOOKS LIBRARY — Catalogue ("quand Aziz dit X -> tel hook")

> Bibliotheque de hooks d'ouverture REUTILISABLES. Cree 2026-06-15 (chantier strategique "on est a court de hooks").
> Code : `src/projects/_shared/hooks-lib/`. Plan/decisions : `memory/HOOKS-LIBRARY-PLAN.md`.
> Render : `scripts/render-mapbox.sh <CompoId> <out.mp4>` (WebGL headless). Compos enregistrees dans Root.tsx.

---

## PRINCIPE — 4 mecaniques DISTINCTES (l'ACTION differe, pas la deco)

Un hook = une ACTION visuelle distincte. NE PAS multiplier les variantes de deco du meme squelette
(lecon Aziz 2026-06-15 : echo/chromatic/plain etaient le MEME hook -> fusionnes dans MaskReveal).

| Quand Aziz veut... | Hook | Action | Registre |
|---|---|---|---|
| **traquer/cibler une zone, suspense "ou ?"** | `CrosshairLock` | un viseur cherche -> se verrouille -> zoom | universel (conflit/eco/histoire) |
| **montrer une menace/phenomene qui S'ETEND** | `RedlineContagion` | un foyer eclate -> contagion de pays en pays + icones menace | conflit / insecurite |
| **un CHIFFRE ou MOT choc qui revele la carte** | `MaskReveal` | chiffre-masque -> zoom-reveal. prop `effect`: plain/echo/chromatic | eco/data / impact |
| ~~la carte se fracture/rupture~~ | ~~FractureReveal~~ | (ECARTE par Aziz 2026-06-15, supprime) | — |
| **montrer une FUITE de ressources (PAS un hook, un INSERT mid-video)** | `ArteryDrain` | faisceaux jaillissent du pays vers l'exterieur + compteur | insert eco |

---

## ⭐ REGLE CAMERA (NON-NEGOTIABLE — Aziz 2026-06-15)

Nos vraies videos (ex AES Acte 1) utilisent une CAMERA SERREE (zoom ~4.5-4.8) qui PANE narrativement
(ouest->est en suivant le propos), PAS une vue continent figee. Tout hook doit pouvoir adopter ca.

- `HookMapBackground` accepte `camKeys={[{f,lon,lat,zoom}...]}` -> trajectoire interpolee (easeInOut),
  serree + pan, comme `SAHEL_CAM_KEYS`/`ACTE1_CAM_KEYS` du moteur Sahel. Remplace center/drift/punchZoom.
- Reference de cadrage AES : zoom 4.5-4.8, center autour de [-0.5, 15.2]. Pan ouest (Mali ~lon -3)
  -> est (Niger ~lon +1). Zoom-OUT leger au climax pour cadrer les 3 pays.
- CrosshairLock-AES-CamSerree-H = la demo de reference (catbox 9q75sr).

---

## ARCHITECTURE — ce qui rend tout reutilisable

`HookMapBackground.tsx` = le FOND injectable commun (tout hook se code par-dessus en qqs dizaines de lignes) :
- `theme`: "dark" (Souverain) | "parchment" (War-Map top-down). AGNOSTIQUE.
- `countriesGeoJson`: charge la VRAIE couche pays du projet (raccord exact, ex sahel-countries.geojson =
  carte Partie 4 : contour national epais + allumage via propriete `country`). Sinon country-boundaries Mapbox.
- `camKeys`: trajectoire camera serree+pan (voir REGLE CAMERA). OU center+baseZoom+driftAmount+punchZoom.
- `focusIsos` + `litFrom` + `litStagger` (cascade/contagion) + `litFillOpacity`: allumage des pays.
- `onMapReady(ctx)`: remonte `project(lonLat)->{x,y}` pour ancrer overlays sur la geo.
- `theme.ts`: palette (gold/navy/ivory/red) + 4 profils de spring (impact/lourd/sec/respir, anti-AI-slop).

---

## EFFETS "AE" REUTILISABLES (HookEffects.tsx) — Partie B du DA, prouves en render headless
- `HookGrain` : grain/noise SVG subtil (feTurbulence, deterministe). Pose en dernier, texture premium. Partout.
- `HookDisplacementBurst at={f} scale={px}` : onde de choc DEFORMANTE (feDisplacementMap) a un frame -> la
  carte TREMBLE a l'impact ("seisme/deflagration"). Wrappe le fond : `<HookDisplacementBurst><HookMapBackground/></...>`.
  ⭐ VERIFIE : feDisplacementMap s'applique bien au-dessus du canvas Mapbox en headless (RedlineContagion, catbox uwbr8o).
- A POUSSER (non encore codes, faisables) : halftone dot-grid (pattern SVG cercles, look radar) · gradient
  radial spot anime (cx/cy = balayage organique) · dechirure parchemin (clipPath courbe qui s'elargit).

## PRINCIPES DE RETENTION (graves du DA 3 modeles, appliques)
1. Trou de serrure : jamais la carte pleine a t=0, commencer par un detail qui obstrue puis OUVRIR.
2. Relais du regard : l'animation A meurt la ou B nait (label la ou le mouvement s'arrete).
3. Densite progressive : jamais >2s sans nouvel evenement, freeze-respiration avant le reveal.
4. Visuel PRECEDE la voix de ~0.3s.
5. Boucle ouverte : finir sur une QUESTION dominante (bandeau centre) = ce qui fait RESTER.

---

## CONVENTION
- Duree cible ~10s (300f @30fps). Etaler les beats SANS temps mort, pas juste rallonger la fin.
- Format : H (1920x1080) prioritaire pour nos videos longues ; V (1080x1920) pour Shorts.
- HOOK (cree une tension non resolue) vs INSERT (explique/repond). ArteryDrain = insert, pas hook.

## DEMOS (catbox)
- CrosshairLock vue large : b5ptt1 · CAMERA SERREE : 9q75sr ⭐
- RedlineContagion 10s : ce89pd · MaskReveal echo : md79i4 · MaskReveal chromatic : yg01lc
- ArteryDrain (insert) : k6uquo
