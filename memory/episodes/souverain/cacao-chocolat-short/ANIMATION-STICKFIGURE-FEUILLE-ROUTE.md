# Feuille de route — animer un STICK FIGURE d'encre (Gemini + recherche web concordent, 2026-06-30)

> Validée par 2 sources externes indépendantes (Gemini 3.1 Pro sur nos vidéos + Tavily web technique).
> Décision Aziz : garder le stick figure SIMPLE (segments droits). Le problème n'est JAMAIS le corps, c'est l'ANIMATION.
> ⛔ Le "noodle rig" (membres en courbes/galbe) DÉTRUIT le charme du pictogramme. Pureté des lignes droites + physique.

## 1. MARCHE — éliminer le "glissé / moonwalk" (foot-sliding)
- **FOOT-PLANT (critique)** : le pied au sol reste STRICTEMENT FIXE pendant sa phase d'appui (t=0→0.5 du cycle).
  Si le bassin avance à vitesse V, le pied en appui recule de -V par rapport au bassin (position absolue fixe au sol).
  Seul le pied EN L'AIR bouge (lerp). C'est LA cause du glissé : aujourd'hui le pied bouge en continu via sin().
- Cadence : 1 cycle complet (2 pas) ≈ 0.8-1.0s. Ouverture jambes max ±30° : `angle = sin(t*2π/T)*30`.
- **BOB du bassin** (poids) : `Y_bassin = Y_base + abs(sin(t*4π/T)) * A`, A = 5-8% de la longueur de jambe.
- Bras opposés aux jambes, balancent un peu moins : `angle_bras = -angle_jambe * 0.6`.
- 4 poses-clés walk cycle (réf web) : contact / passing(down) / up / contact.

## 2. SE PENCHER — gérer le centre de masse (anti-bascule-arrière)
- **COMPENSATION DU BASSIN (la cause du bug)** : torse bascule en avant → bassin RECULE pour garder le CoM au-dessus
  des pieds. `X_bassin = X_init - (angle_torse/90) * facteur_recul`. SANS ça → il "tombe en arrière" (notre bug).
- Torse pivote de 90° (vertical) à ~20° (presque horizontal). Genoux plient légèrement (même en segments droits).
- Easing OBLIGATOIRE : `easeInOutCubic`, jamais linéaire (commence doux, accélère, ralentit près du sol).

## 3. RAMASSER — casser la lévitation magique de la fève
- **Machine à états + HOLD** : la fève ne bouge JAMAIS avant que la main soit dessus.
  1. Descente (~0.4s) : la main cible (X_fève, Y_fève). IK 2 segments basique (bras+avant-bras) pour atteindre le point.
  2. **HOLD (~0.15s, 3-4 frames, CRITIQUE)** : tout s'arrête → signale la saisie au spectateur.
  3. Transfert de parent : `feve.parent` world → hand (coords deviennent 0,0 relatif main).
  4. Remontée (~0.5s) : torse se redresse (easeInOutQuad), fève suit la main.
- Follow-through : le bras finit de se plier 0.1s APRÈS le torse (pas d'arrêt robotique simultané).

## 4. NETTETÉ / rendu encre (choix assumé, pas brouillon)
- Hiérarchie d'épaisseurs : torse 6-8px, membres 4px (structure corporelle lisible).
- `stroke-linecap="round"` + `stroke-linejoin="round"` OBLIGATOIRE (bouts carrés = tue l'encre).
- Couleur : brun-noir foncé `#2A1B12` à opacity ~0.9 (PAS de noir pur #000 = "informatique"). Note : notre charte = #2b2117, proche.
- Chapeau OVERLAP : micro-délai procédural `angle_chapeau = lerp(angle_chapeau, angle_tete, 0.3)` → bascule après l'arrêt = vie.

## Méta
- last30days NON lancé volontairement : outil "buzz 30 jours" (Reddit/X/TikTok), inadapté à une technique intemporelle.
  Tavily (savoir-faire web) + Gemini (analyse vidéo) suffisent et concordent. Voir aussi [[IDEE-PERSO-8-DIRECTIONS]].
- Fichiers : `_rnd-perso/PlanteurEncre*.tsx` + scènes test `SceneNarrative16x9.tsx` / `SceneVertical.tsx`.
