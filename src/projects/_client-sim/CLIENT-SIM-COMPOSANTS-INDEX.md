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

| `RowEmbed` / `FlyingRow` (lignes d'UI qui s'encastrent) | `_client-sim/noteshield/live-page/NorthShieldRowEmbed.tsx` (L49-116) · repris `NorthShieldPromo.tsx` (L122) et `NorthShieldPromoV4.tsx` (L174) | Faire ATTERRIR une liste d'éléments d'interface réels : chaque ligne descend, `rotateX` se remet à plat, une « couture » d'accent s'ouvre 5f sous la ligne au moment de la pose. ⛔ La ligne qui vole est un **découpage de la capture** (`backgroundPosition` négatif sur la plaque pleine page), JAMAIS un redessin — un redessin a un rendu de police visiblement différent de la plaque au sol. Recette shotcraft `ui-entrance/row-embed`. |
| `Cursor` + table de keyframes partagée (curseur solidaire de la caméra) | `_client-sim/noteshield/live-page/NorthShieldCursorFlyover.tsx` (`acc()` L64-77, `CursorArrow` L79) · repris `NorthShieldPromoV4.tsx` (L120) | Simuler une navigation réelle dans une interface. ⭐ Principe non négociable : **la caméra et le curseur sont UN SEUL SYSTÈME** — mêmes keyframes, même interpolation, donc ils arrivent toujours ensemble (un curseur qui « rattrape » casse l'illusion). `scale(1/zoom)` obligatoire sinon la flèche devient énorme en gros plan. Clic = 2 anneaux concentriques décalés de 3f (un seul est trop discret). Recette shotcraft `camera/cursor-flyover`. |
| `BrandOpen` / `Open` (ouverture de marque encrée) | `_client-sim/noteshield/live-page/NorthShieldPromo.tsx` (L61-102) · repris `NorthShieldPromoV4.tsx` (L55) | Ouvrir un film produit : réticule qui se trace (2 lignes en `strokeDashoffset`), mot-titre en letterpress lettre par lettre (`scale` 1.6→1 + `blur` 6→0), kicker tapé caractère par caractère, **hold plein ≥ 1 s** (règle dure shotcraft : « sous 1 s = à refaire »), puis sortie rapide. Recette `opening/brand-ink-open`. |

⚠️ **Les 3 entrées ci-dessus sont en `proto`** — vérifié au wrap 2026-08-20 : **aucun import partagé** entre les
fichiers (`grep import` = vide), ce sont des copies locales répétées, pas des briques réutilisées. Un agent les
avait proposées en « prouvé » sur le critère « code identique dans 3 fichiers » — c'est le critère de la
DUPLICATION, pas de la réutilisation. Extraire en composant partagé au 2e usage réel (autre client).

⛔ **Socle EXTERNE importé, à ne jamais indexer comme brique maison** : `_client-sim/noteshield/live-page/shotcraft-lib/`
(`PageCam`, `FlashCut`, `DigitRoll`, `PaperTitleCard`) vient de **video-shotcraft**, Apache-2.0
(https://github.com/Vincentwei1021/video-shotcraft), copié tel quel — attribution dans son `README.md`.
⭐ `PageCam` porte le gotcha qui change tout : en 3D il agrandit via la propriété CSS **`zoom`** et NON
`transform: scale` (scale fait rastériser à la taille de layout puis agrandir en GPU → texte flouté).
Doctrine du pilier : `memory/fiches/FICHE-UI-PRODUIT.md` (auto-injectée par hook).

**Rejeté (pas isolable, spécifique Flowdesk)** : `PanneauChaosV4` (arc calibré sur UN personnage MiniMax H3 précis) · `BasculeLogo` (identité de marque, refaire par client de toute façon).

**Rejeté (doublon transversal, appartient à un catalogue Remotion général, pas client-sim)** :
`LoopedVideo`/`LoopedImageSequence` (`_client-sim/flowdesk/videoLoop.tsx`) — résout un problème Remotion
générique (boucler un clip, `OffthreadVideo` n'a pas de prop `loop`) sans rien de spécifique SaaS. À
indexer plutôt dans un futur `utils/` partagé studio entier si le besoin se répète ailleurs.
