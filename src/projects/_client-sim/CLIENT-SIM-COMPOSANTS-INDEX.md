# CLIENT-SIM — COMPOSANTS-INDEX ("quand un futur test client-sim a besoin de X → utilise Y")

> Catalogue distinct du thème principal Souverain/Atlas/War-Map (décision Aziz 2026-08-07 : les démos
> SaaS/dashboard sont un registre différent, pas à mélanger). Créé au rattrapage 2026-08-07 sur Flowdesk
> (`_client-sim/flowdesk/`, chantier CLOS le 2026-08-06). Miroir de `_shared/COMPOSANTS-INDEX.md` mais
> pour le vocabulaire produit/dashboard, pas cartographique/narratif documentaire.
>
> ⚠️ Tous les candidats ci-dessous sont en statut **proto** (jamais réutilisés hors Flowdesk, jamais
> formellement extraits) — aucune validation explicite comme "brique transversale" dans STATUS.md, juste
> validés comme partie du livrable final. Ne PAS déplacer vers `_shared/` avant un 2e usage confirmé.

| Composant | Import (chemin réel) | Quand tu veux... |
|---|---|---|
| `TransitionLayer` (whip-pan blur+opacity) | `_client-sim/flowdesk/FlowdeskAbstraitV4.tsx` (L1129-1166) | Une transition cut-mais-fluide entre panneaux d'une séquence produit — flou+fondu croisé sur fenêtre courte (35f). Repris identique sur 3 versions (V2→V3→V4) sans jamais changer = signal de robustesse. Le plus proche d'être déjà générique (zéro variable Flowdesk-spécifique dans le composant). |
| `PathTravelIcon` (déplacement le long d'un path SVG, 3 phases) | `_client-sim/flowdesk/FlowdeskAbstraitV4.tsx` (L571-696, `MEC_INFLOW_PATHS`/`MEC_ROUTE_PATHS`/`MecTravelIconEl`) | Faire comprendre un mécanisme de routage/dispatching — icône qui arrive, traverse un hub central, repart vers une destination nommée où elle se pose durablement. Mesure géométrique fiable (`getPointAtLength`/`getLength`, PAS d'heuristique de comptage de commandes — cf `svg-path-length-heuristique-commandes-jamais-fiable` dans MEMORY.md). Généralisable via props `paths/center/durations/scale`. |
| `OrbitalDrawVortex` (spirale à N bras draw-on) | `_client-sim/flowdesk/FlowdeskAbstraitV4.tsx` (L395-475, `BasculeVortex`) | Rendre visible un mécanisme d'aspiration/absorption — cyclone à N bras en 2 couches déphasées, tracé en draw-on à vitesse LINÉAIRE (pas ease-in-out — gotcha explicitement documenté en commentaire de code après un bug de lisibilité corrigé en 4e passe). Généralisable via props `armCount/armLen/color/focus{x,y}`. |

**Rejeté (pas isolable, spécifique Flowdesk)** : `PanneauChaosV4` (arc calibré sur UN personnage MiniMax H3 précis) · `BasculeLogo` (identité de marque, refaire par client de toute façon).

**Rejeté (doublon transversal, appartient à un catalogue Remotion général, pas client-sim)** :
`LoopedVideo`/`LoopedImageSequence` (`_client-sim/flowdesk/videoLoop.tsx`) — résout un problème Remotion
générique (boucler un clip, `OffthreadVideo` n'a pas de prop `loop`) sans rien de spécifique SaaS. À
indexer plutôt dans un futur `utils/` partagé studio entier si le besoin se répète ailleurs.
