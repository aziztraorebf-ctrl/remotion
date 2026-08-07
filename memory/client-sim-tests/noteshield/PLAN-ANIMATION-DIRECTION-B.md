# Plan d'animation — Direction B (System/Conceptual), point de reprise

> Écrit le 2026-08-07, avant la prochaine session de codage. Design figé (Mix & Match terminé),
> ce fichier est le pont entre "on sait quoi faire" et "coder l'animation Remotion".

## Prérequis avant de coder (vérifier en début de session)

1. ✅ **P1 v3 — RÉSOLU (2026-08-07)** : Fable MAX a produit une image-cible qui capture le geste
   "barre + embouteillage" (Semantic Test validé, contraste net avec la v1 neutre). Fichier :
   `public/_rnd/fable-svg/northshield-direction-b/p1-flux-fable-v3-blocage.json` — c'est LA
   version à utiliser pour le codage, pas `p1-flux-fable.json` (v1, obsolète mais gardée en
   archive de densité).
2. Charger les 6 SVG finaux dans `public/_rnd/fable-svg/northshield-direction-b/` (P1 v3 à P6,
   fusions Mix & Match déjà appliquées pour P2/P3/P5).
3. Charger `DashboardScreen.tsx`, `LaptopMockup.tsx`, `VirtualCursor.tsx` (prototype validé) déjà
   présents dans `src/projects/_client-sim/noteshield/ui/`.
4. Alignement audio mot-par-mot déjà disponible :
   `src/projects/_client-sim/noteshield/audio/narration.alignment.json`.

## Architecture de composition recommandée

Un seul composant top-niveau `NorthShieldDirectionB.tsx` avec des `<Sequence>` Remotion par
panneau, calées sur les timings EXACTS du storyboard (déjà extraits de l'alignment audio, pas à
recalculer) :

| Panneau | Frames (30fps) | Durée | Contenu |
|---|---|---|---|
| P1 | 0 → 327 | 10.9s | SVG Fable (barre + embouteillage) |
| P2 | 327 → 456 | 4.3s | SVG Fable (seuil naît) |
| P3 | 456 → 861 | 13.5s | SVG Fable (4 signaux → 18) |
| P4 | 861 → 1227 | 12.2s | `DashboardScreen` + `LaptopMockup` (cas bas risque) |
| P5 | 1227 → 1695 | 15.6s | Dashboard (bascule Berlin) + retour SVG bosse rouge |
| P6 | 1695 → 1900 | 6.8s | SVG Fable (signature, échos décroissants) |

(Frames arrondies depuis les timings en secondes × 30fps — recalculer précisément depuis
`STORYBOARD-DIRECTION-B.md` § Récapitulatif de timing au moment du codage, ces valeurs sont
indicatives.)

## Par panneau — technique d'animation concrète

### P1 — Flux + blocage (le plus complexe techniquement)
- Import du SVG Fable **v3** (`p1-flux-fable-v3-blocage.json`) comme JSX (pas `<img>` — il faut
  manipuler les groupes individuellement).
- Groupes RÉELS livrés par Fable v3 (confirmés) : `bg`, `structure_grid`, `horizon_dormant`,
  `speed_hairlines`, `flux_arrivant` (sous-groupes `arrivant_far/mid/near` — traits libres avec
  motion-blur, plan gauche), `barriere` (le mur + bord de contact + glow), `flux_bloque`
  (sous-groupes `bloque_far/mid/near` + `pression_mur` — traits compressés), `traits_rouges` (2,
  noyés dans l'embouteillage), `zone_vide_droite` (voile sombre), `dust_particles`, `vignette`.
- **Animation prévue par le storyboard** : à 3.76s (mot "ralentit"), la barre apparaît
  (`opacity`/`scaleY` via `spring()`) ET les traits `flux_arrivant` transitionnent visuellement
  vers l'état `flux_bloque` (déjà fourni tel quel par Fable — probablement un simple `opacity`
  crossfade entre les deux groupes, ou interpolation de position si on veut un vrai mouvement de
  "tassement"). À 8.08s (mot "doigts"), la barre disparaît (`opacity` → 0 rapide) et les traits
  `flux_bloque` repartent en vitesse (translateX accéléré, `Easing.in` pour l'effet "tout part
  d'un coup") — possible en réactivant `flux_arrivant` avec un `translateX` de sortie rapide.
- Piège résolu : le SVG v3 fournit déjà les DEUX états (`flux_arrivant` libre ET `flux_bloque`
  compressé) dans les mêmes coordonnées de cadre — pas besoin d'interpoler entre deux fichiers
  SVG séparés, juste de jouer sur l'opacité/visibilité relative des deux groupes existants selon
  la frame.

### P2 — Seuil naît
- SVG simple (1 path). Animation : `stroke-dasharray`/`stroke-dashoffset` pour le draw-on
  gauche→droite (1.2s, easing calme — `Easing.out(Easing.cubic)` probable), puis oscillation
  d'amplitude légère en boucle (2-3px, très lente) via `interpolate` sur un `sin(frame)`.

### P3 — 4 signaux → 18 (panneau le plus fort, soigner l'animation à la hauteur du visuel)
- 4 groupes de lignes (`signal_appareil/lieu/historique/comportement`) + `score_final`.
- Animation en 2 temps : (1) chaque ligne apparaît indépendamment avec un léger décalage temporel
  (stagger ~0.3-0.4s entre chacune, cohérent avec la doctrine "cascade séquentielle" du projet) ;
  (2) sur "décision instantanée", `translateY` de chaque ligne vers le point de convergence
  (spring avec `damping` élevé pour un mouvement net, pas rebondissant) + apparition du cartouche
  `score_final` en dernier (scale-in léger).

### P4/P5 — Dashboard vivant (le vrai défi technique de toute la direction)
- **P4** : `LaptopMockup` avec `DashboardScreen riskCase="low"` à l'intérieur. Caméra : le
  storyboard demande un pull-back depuis le score "18" du panneau 3 vers le dashboard complet —
  techniquement, animer la `width` du `LaptopMockup` de très grand (zoom sur le score) vers 1400
  (taille normale), en `<g transform>` ou en style CSS `transform: scale()` sur tout le bloc.
- Ajouter ici le **prototype souris validé** (`VirtualCursor` + `CursorTestComp` comme référence
  de code) — décision Aziz : implémentation complète repoussée à plus tard, mais le point d'entrée
  dans le code est ICI (P4 et P5).
- **P5** : c'est le "vrai travail technique" signalé dans le storyboard — PAS de crossfade entre
  les 2 PNG (low-risk/high-risk), il faut recomposer les 4 champs qui changent
  (heure/appareil/ville/score) en overlays DOM/SVG animés PAR-DESSUS le `DashboardScreen` React
  existant (qui est déjà data-driven — `riskCase` prop — donc le "morph" peut potentiellement être
  un simple crossfade de PROPS React avec `interpolate` sur un état intermédiaire, à évaluer :
  peut-être plus simple que prévu vu que le composant est déjà paramétré, pas un PNG figé).
- Puis retour bref SVG sur la bosse rouge (Fable P5) en plan serré — `<Sequence>` imbriquée ou
  simple cut avec fade.

### P6 — Signature
- SVG des échos décroissants (déjà statique, riche). Animation : révéler chaque écho
  successivement du plus grand/rouge au plus petit/cyan (stagger), PUIS la ligne s'atténue
  (`opacity` interpolée vers ~0.15, jamais 0) pendant que le wordmark apparaît (fade-in simple,
  pas de flourish — cohérent avec "atténuation, pas apparition").

## Ordre de codage recommandé pour la prochaine session

1. P1 (une fois v3 validée) — le plus complexe, mieux vaut l'affronter frais.
2. P3 — le plus gratifiant/le plus solide, bon pour valider le pattern d'import SVG→JSX tôt.
3. P2, P6 — rapides, réutilisent le même pattern que P3.
4. P4/P5 — nécessite de brancher `DashboardScreen`/`LaptopMockup`, le vrai morceau produit.
5. Assemblage final (`<Sequence>` avec les timings exacts) + première passe de vérification
   (render complet, vérifier absence de gel/saut entre panneaux).
6. SFX (chantier séparé, explicitement repoussé — cf `PROTOTYPE-SOURIS-VIRTUELLE.md`).

## Fichiers de référence à ouvrir en premier la prochaine session

- Ce fichier (plan d'animation)
- `MIX-AND-MATCH-DIRECTION-B.md` (design final + réserve méthodologique)
- `STORYBOARD-DIRECTION-B.md` (texte/timing source de vérité)
- `PROTOTYPE-SOURIS-VIRTUELLE.md` (curseur, à intégrer P4/P5 quand décidé)
