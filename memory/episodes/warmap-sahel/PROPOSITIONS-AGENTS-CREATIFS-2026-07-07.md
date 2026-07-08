# Propositions agents créatifs indépendants — Short AES 90s (2026-07-07)

2 agents lancés en parallèle, brief identique (script + historique des 4 rejets + contrainte "un seul
cadre continu"), SANS suggestion d'angle, chacun ignorant la proposition de l'autre.

## Agent A — "La Table des Trois Frontières"
Carte-parchemin gravée du Sahel (contours réels Mali/Niger/Burkina/Libye en polygones lon/lat, déjà
dans `sahelCountries.ts` — PAS Mapbox, dessin SVG statique), cadre fixe qui ne bouge jamais. 3 jetons de
cire vierges posés sur les capitales dès le panel 1. Tout le récit s'accumule dessus : tache d'encre qui
part de la Libye et coule vers le nord du Mali, halos rouges qui grandissent (contraste villes tenues vs
campagnes perdues), cordages dorés qui convergent vers un sceau central (reprise Liptako), veines de
ressources qui s'allument (reprise Resources).

**Force** : chaque fait a un lieu géographique précis et vérifiable — résout directement le problème
"trop abstrait" du blason (qui n'avait qu'un seul point focal pour 9 faits).

**9 panels détaillés** (voir sortie complète agent, résumé) :
1 (0-8s) carte + 3 jetons vierges | 2 (8-16s) jetons se colorent + fils alliance qui rompent |
3 (16-27s) tache d'encre Libye | 4 (27-34s) tache coule vers nord Mali | 5 (34-45s) 2 sceaux FR/ONU sur
villes, tache reste sur campagnes | 6 (45-52s) tache s'étend (comparaison 2012 vs 10 ans après) |
7 (52-62s) RUPTURE : fumée rouge envahit le cadre, dissipation | 8 (62-72s) cordages dorés → sceau AES
(reprise Liptako) | 9 (72-84s) veines ressources (reprise Resources) | 10 (84-92s) CTA.

## Agent B — "L'Acte qui s'écrit"
Même parchemin fixe, 3 emblèmes Mali/Niger/Burkina posés dès le début (pas de vraie géographie interne),
mais chaque fait reçoit SA PROPRE forme distincte qui s'ajoute sur le même cadre : bases kaki qui
implosent (reprend `ProtoVide.tsx`), alliances qui se sectionnent (technique maillon CFA), cercle CEDEAO
qui se fissure (`ProtoVide`), médaillon Libye qui craque + contagion (technique flow Resources), halo
rouge qui grandit autour de 2 points FR/ONU, bascule militaire (spring dur, motif civil→kaki), rupture
(sceau CEDEAO menaçant + `WarMapDimmedOverlay` déjà existant), puis reprise QUASI-LITTÉRALE de
`LiptakoRevealSVG`/`ResourcesRevealSVG` (déjà validés Aziz dans la vidéo longue).

**Force** : réduit le risque créatif au minimum — seuls 5 gestes sont vraiment neufs (panels 2-6), le
reste réutilise du matériau déjà approuvé tel quel. Écrit comme Direction Brief Stage 1 dans
`.claude/agent-memory/shared/PIPELINE.md` (lignes ~577-634).

## Points communs (validés par les 2 agents indépendamment)
- Un seul cadre continu, jamais de cut vers un nouveau décor.
- Rupture de registre unique au moment CEDEAO/effet inverse.
- Réutilisation de `LiptakoRevealSVG9x16`/`ResourcesRevealSVG9x16` pour la fin (déjà codés, déjà validés).
- CTA final = `CtaCard.tsx` existant, aucune modification nécessaire.

## Avis Claude (2026-07-07)
Les deux approches sont complémentaires plutôt que concurrentes : l'agent A résout mieux "où se passe le
fait" (vraie géographie interne à la carte), l'agent B résout mieux "combien reste-t-il à concevoir"
(réutilisation maximale, 5 gestes neufs seulement). Un mix probable pour la prochaine session : la
géographie réelle de l'agent A comme fond + les gestes précis déjà nommés par l'agent B pour chaque
panel. Reste à trancher par Aziz (question de goût) : le concept "parchemin qui s'écrit"/"table des
frontières" est-il assez différent du blason déjà rejeté à ses yeux ?

## Prochaine étape (cf `PLAN-SHORT-90S-V3-REPRISE.md`)
Soumettre ces 2 concepts (ou un mix) au storyboard multi-modèles (Gemini 3.1 Pro, GPT-5.5, DeepSeek texte
seul) avec des frames de rendus Remotion déjà validés (ex. Sénégal V3) comme référence visuelle, AVANT
tout code.

## ⭐ DÉCOUVERTE TECHNIQUE (2026-07-07, après coup) — brique prête pour "La Table des Trois Frontières"

Aziz s'est souvenu d'un pattern déjà prouvé dans le projet Sénégal (contour de pays qui se trace au
début d'une vidéo livrée) — vérifié par agent Explore, confirmé et MEILLEUR que prévu :

- **`src/projects/_proto-16-9/ProtoCarto_ContinentDraw.tsx`** trace déjà PLUSIEURS pays simultanément
  sur le même cadre (toute l'Afrique, décalés temporellement par pays) en **d3-geo pur, ZÉRO Mapbox** —
  `geoMercator().fitExtent()` + `geoPath()` + `strokeDasharray`/`strokeDashoffset` piloté par
  `interpolate()`. Pattern généralisable à Mali/Burkina/Niger : changer le filtre `inAfrica` (L70-73)
  par `['Mali','Burkina Faso','Niger'].includes(f.properties.name)` + ajuster `fitExtent`.
- **GeoJSON des 3 pays déjà prêt** : `public/_shared/geo-data/sahel/sahel-countries.geojson` (contient
  exactement MLI/NER/BFA). Alternative : `countries-50m.json` (TopoJSON mondial) à filtrer par nom.
- **Pattern jauge/count-up réutilisable** : `SceneBilanV3.tsx` (L65-66, L285, L688) implémente un donut
  qui se remplit en `strokeDasharray` piloté par `interpolate()` pendant un count-up — réutilisable pour
  toute jauge/chiffre du Short (ex. "60 ans", "8M$/jour" équivalent Sahel).

**Implication** : la "Table des Trois Frontières" (agent A) n'a PAS besoin de contours SVG statiques
pré-dessinés (`sahelCountries.ts` figé) — elle peut utiliser une VRAIE projection géographique calculée
en code (`ProtoCarto_ContinentDraw.tsx` adapté), avec un contrôle total frame-par-frame : fade in/out
sélectif par pays, labels dynamiques, tout en restant 100% SVG/Remotion (zéro Mapbox, zéro risque de
bricolage visuel). C'est le meilleur point de départ technique identifié à ce jour pour la reprise.
