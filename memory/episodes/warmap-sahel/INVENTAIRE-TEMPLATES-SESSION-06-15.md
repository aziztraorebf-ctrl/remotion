# INVENTAIRE TEMPLATES — Session Polish War-Map (2026-06-14/15)

> Tous répertoriés dans `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` (catalogue maître).
> Code : `src/projects/warmap/_shared/`. Ce fichier = vue "utilisés vs en réserve" pour la passe Polish future.

## ⭐ TEMPLATES CRÉÉS CETTE SESSION (à partir de la veille Max Bellona/Jacques/TIH) — TOUS RÉPERTORIÉS
| Template | Fichier | UTILISÉ dans | Réutilisable pour |
|---|---|---|---|
| **WarMapDimmedOverlay** (carte assombrie + éléments superposés) | `_shared/WarMapDimmedOverlay.tsx` | ✅ CONFÉDÉRATION (sceau AES sur carte assombrie) | tout CONCEPT/accord/data sans quitter la carte |
| **WarMapSplitScreen** (2 OU 3 volets + ratios animés/accordéon + connecteur) | `_shared/WarMapSplitScreen.tsx` | ✅ CFA (2 volets carte\|data) · ✅ RESSOURCES (3 volets pays) | divergence, comparaison, juxtaposition, dépendance |
| helper `dimmedOverlayHole()` | dans WarMapDimmedOverlay | ✅ (trou sceau confed) | percer un trou local sous un élément superposé |
| `MAP_HIDE_WINDOWS` + `mapHideFactor` (moteur) | `engine/SahelWarMapEngine.tsx` | ✅ RESSOURCES (masque canvas Mapbox plein écran) | toute scène plein écran |
| `CONTOUR_HIDE_WINDOWS` étendu (masque contours React) | `engine/SahelWarMapEngine.tsx` | ✅ coût/CFA/ressources | idem |

## 🧰 MÉCANIQUES PROTOTYPÉES EN R&D (bac à sable `_rnd/maxbellona/`) — PAS encore portées en prod
> Décodées de Max Bellona, codées en protos full HD, NON utilisées dans la vidéo finale. Disponibles si une
> passe Polish future en a besoin. Voir `DECODE-maxbellona.md` + `PLAN-MATCH-POLISH-MECANIQUES.md`.
| Proto | Ce qu'il fait | Statut | Usage Polish possible |
|---|---|---|---|
| **P1 liens orthogonaux "circuit"** | acteurs ancrés à des lieux reliés par tracé qui se dessine | proto only | soutiens étrangers (Russie→Mali, Émirats→X) reliés à de vrais pays |
| **P2 badge-faction octogone** | jeton faction en octogone/losange (vs cercle) | proto only | upgrade lisibilité des jetons JNIM/EIGS (test A/B) |
| **P3 transformation carte géo→guerre** | la carte se métamorphose (le hook Bellona) | proto only | ⭐ HOOK 30s AES (si on en fait un avant publication) |
| **P4 flux pointillé** | jetons qui circulent le long d'un trajet | ~généralisé via RefugeeFlow | flux d'armes, d'or, axes d'appro |
| **P5/P6 split** | (PROMUS en WarMapSplitScreen prod — voir ci-dessus) | ✅ promu | — |

## 🧱 BRIQUES War-Map EXISTANTES (avant cette session) — toujours dispo
RefugeeFlow (exode, utilisé P4) · TerritorialExpansion · SahelAttackArrow · GeoConvergenceOverlay ·
WarMapOverlayDynamic (mode card/fullscreen) · WarMapOverlayData/Explicatif · countryOutline · jetons faction.

## 3 GABARITS DE HOOK formalisés (non encore appliqués — pour une prod future)
`HOOK-MAXBELLONA-GABARIT.md` : A (carte se transforme) · B (argumentatif) · C (questions-pièges). + section
"construire le hook 30s AES". Si on décide d'ajouter un vrai hook avant publication → c'est prêt.

## RÉFÉRENCES ÉDITORIALES décodées (durable)
`DECODE-maxbellona.md` (carto FR) · `DECODE-sahel-chronicles.md` (angle neutre + preuve marché) ·
`WARMAP-CARTE-VS-OVERLAY.md` (doctrine : carte = causal/spatial, conceptuel = overlay/split).

## CE QU'IL RESTE POUR FINALISER LA VIDÉO
1. **Rendre la P4 COMPLÈTE** (compo `SahelPartie4`, plage f9416→13440, full HD, + audio `narration-v5-p4.mp3`).
2. **Assemblage final** : concat Acte1+P1+P2+P3+P4 + narration globale `narration-v5-expressive.mp3` + mix
   (musique continue 1 morceau au concat, fade in/out, SFX) + vérif anti-figé (1 frame/2s, md5).
3. **PUIS Gemini/Twelve Labs sur la vidéo COMPLÈTE** (review finale rythme/rétention/ton) = la "dernière touche".
4. (optionnel avant publi) HOOK 30s via gabarit + protos P1/P3 si on veut renforcer l'ouverture.
