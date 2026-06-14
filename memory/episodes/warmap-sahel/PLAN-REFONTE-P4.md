# PLAN REFONTE P4 — "remplir la carte, plus de timidité" (2026-06-14)

> Origine : Aziz a jugé la P4 v1 TROP PRUDENTE (peu de jetons, overlays statiques, vides). DA-brief DOWNSTREAM
> (Gemini+Kimi sur la vidéo ratée + 5 frames-problèmes + nouvelles décisions) → `/tmp/da-refs/da-warmap-sahel-p4-downstream-{gemini,kimi}.md`.
> Convergence FORTE des 2 voix. Vérifié contre doctrine. Ce plan = la refonte cadrée par chantier.

## ⛔ RÈGLE GRAVÉE (universelle, ce projet et tous) — voir WARMAP-GRAMMAIRE-CAUSALE.md
Overlay semi-transparent avec carte/contours au travers = INTERDIT (bouillie). Soit PLEIN ÉCRAN OPAQUE animé,
soit SUR LA CARTE (pas d'overlay). Jamais l'entre-deux. + un overlay Remotion DOIT être animé (notre force).

## HIÉRARCHIE D'IMPACT (convergence 2/2 — ordre de priorité)
1. **CHANTIER 4 — LA FIN HABITÉE** (priorité absolue : dernière impression, le pic qui retient jusqu'au noir).
2. **CHANTIER 1 — L'EXODE DENSE** (1er moment émotionnel, transforme le "cheap" en spectacle).
3. **CHANTIER 3 — CONFÉDÉRATION SUR LA CARTE** (supprimer l'overlay interdit = dignité pro).
4. **CHANTIER 2 — OVERLAYS DATA-VIZ** (important mais moins critique que l'humain).

---

## CHANTIER 1 — M1 EXODE (caméra serrée + villes séquentielles + ~12 jetons multi-directions)
- **Caméra** : zoom SERRÉ sur le triangle Liptako-Gourma (Gao/Djibo/Ménaka), pas le continent. Pitch ~30° (relief des flux).
- **Séquence villes (AVANT les jetons)** : Djibo/Ménaka/Tillabéri (+ éventuellement Gao) se posent une par une
  (stagger 12f) = sprite Gemini bâtiment top-down (effet "encre qui sèche", op 0→1 + scale 0.9→1) + `WarMapPlaque`
  nom + `countryOutline` pulse du pays à chaque pose. (Cause : le lieu existe avant l'exode.)
- **Exode dense** : ~12 jetons `chip()` (5 sprites réfugiés existants + variété par miroir/rotation), départs
  STAGGERED (flux continu, pas foule statique), directions en ÉTOILE (sud Bénin/CI · ouest Mali stable · est Niger),
  trajets LONGS (4-5 waypoints Bézier, 3-4s), vitesses variées (0.8-1.2x), offset latéral ±0.2° (anti-chevauchement).
- **Sillage wet-ink** derrière chaque jeton (mask flouté, sable #C4A77D) = la cicatrice du trajet. + `RefugeeFlow`
  en fond très basse opacité (0.3) = le volume collectif. Micro-`smokePingPong` poussière au départ.
- **Pièges** : ballet mécanique (varier vitesse/délai) · chevauchement (offset) · easing Bézier pas linéaire.

## CHANTIER 2 — OVERLAYS PLEIN ÉCRAN DATA-VIZ (2 de suite, opaques, animés à fond)
- **Overlay 1 COÛT** : `WarMapOverlayDynamic` fullscreen. `StatCountUp` 3M → icônes-personnes en cascade (3 pour
  3M, stagger 6f) PUIS bascule 15M = marée de ~15 icônes qui "tombent" et s'empilent (l'écran déborde = métaphore).
  Grain parchemin sur la data-viz (anti-corporate).
- **Overlay 2 RESSOURCES** : fullscreen. Triptyque Uranium | Or | Pétrole. Barres horizontales (d3-scale) part
  mondiale + sprites Gemini (icon-uranium/or/petrole) au bout, léger bob sinusoïdal. ⚠️ DÉTOURER le carré blanc du
  lingot (masque SVG ou regen alpha). ⚠️ CHIFFRES À SOURCER (pas de % inventés — voir ANGLE MORT).
- **Transition entre les 2** : le 1er "casse" vers le bas (translate Y +, op 0) pendant que le 2e monte. Pas de cut sec.
- **Possible** : objets PixelLab animés DANS l'overlay (comme Atlas), lignes de fuite ressource→pays consommateurs.

## CHANTIER 3 — CONFÉDÉRATION SUR LA CARTE (zéro overlay, pitch 45°)
- **Caméra** : PITCH 45° (relief, étendue AES), drift lent.
- **Séquence** : 3 `countryOutline` se dessinent → `COUNTRY_PULSES` depuis Niamey (le QG, la cause) → frontières
  INTERNES s'effacent (op→0) + contours EXTERNES fusionnent en 1 ligne OR épaisse englobant les 3 → sceau
  `icon-sceau-confederation` TOMBE sur Niamey (scale 1.2→1, "tampon") + `smokePingPong` poussière à l'impact + ombre
  portée (ancrage). Optionnel : sprite QG bâtiment + plaque "QG · ex-base Barkhane".
- **CFA** : SUPPRIMER l'overlay plein écran mort. Option légère (Gemini) : un petit marqueur "CFA · Paris" qui pop
  brièvement près du sceau OU rester sur la carte avec un fil ténu Sahel→Paris. À TRANCHER (ne pas casser le rythme).
- **Pièges** : bouillie dorée si 3 contours se superposent (décaler 2px ou TerritorialExpansion op 0.3) · sceau ancré (ombre).

## CHANTIER 4 — LA FIN HABITÉE (priorité n°1 — meubler jusqu'à l'extinction)
> L'idée forte d'Aziz : la carte VIVANTE et habitée. "Ils tiennent mais le danger demeure."
- **Phase 1 — DIRIGEANTS (séquentiel, ~3s chacun)** : portrait stylisé Gemini de chaque dirigeant AES dans un
  `chip()` posé sur SA capitale (Bamako/Ouaga/Niamey) + `WarMapPlaque` ville. Caméra serrée sur chaque (cut ou travel).
  ⚠️ DÉCISION ÉDITORIALE : stylisés (pas photo) · nommer ou pas = risque politique → ARBITRAGE Aziz (voir ANGLE MORT).
- **Phase 2 — SOLDATS** : jetons `chip()` bordure verte AES qui se POSENT (scale 0→1 easeOutBack) sur ~6 points
  (2/pays : Gao/Ménaka/Djibo/Dori/Tillabéri/Tahoua). Cause : les dirigeants commandent → les soldats tiennent.
  Optionnel : lignes de commandement fines dirigeant→soldats qui s'allument.
- **Phase 3 — MENACE RÉSIDUELLE** : `TerritorialExpansion` taches organiques rouge sang #8B0000 qui PULSENT
  (op 0→0.4→0.2) sur les ZONES CONNUES (centre Mali Mopti/Ségou · trois-frontières · nord Burkina Sahel) + 2-3
  petits jetons menace JNIM/EIGS qui pulsent SANS bouger (présence). "Tenu mais pas fini." ⚠️ zones connues, PAS
  positions OSINT exactes (honnêteté — on n'a pas la donnée temps réel).
- **Phase 4 — EXTINCTION (validée Aziz)** : tout reste → fill→0, grain noir monte, contours filigrane, le territoire
  AES brille (glow doré, blur AUTORISÉ sur le glow seul) → noir. "Sécuriser · Stabiliser · Durer ?" en TitleReveal
  SUR LE NOIR (pas avant, pas en coin sur la carte). Zooms larges UNIQUEMENT à la toute fin.
- **Pièges** : ordre strict Dirigeants→Soldats→Menace (sinon "qui est qui ?") · menace assez visible (pulse régulier).

---

## ⭐⭐ DA-BRIEF DOWNSTREAM CHANTIER 4 — fix équilibre+lisibilité (Gemini+Kimi, 2026-06-14, frames réelles)
> Output : `/tmp/da-refs/da-warmap-p4c4-downstream-{gemini,kimi}.md`. 2/2 CONVERGENT fortement. Synthèse tracée.
> Déclencheur Aziz : "les problèmes ne sont toujours pas fixés, demandons aux modèles externes". Vérifié vs stack.

**DIAGNOSTIC (la vraie cause, G+K) :** on cadre une réalité ASYMÉTRIQUE (action sud-ouest, désert Niger est) avec
une caméra ZÉNITHALE (pitch 0°) + STATIQUE + tous les éléments au MÊME plan/échelle/opacité = "data-dump" plat
("timbre-poste", "tapis de badges"). Aucun niveau de zoom flat ne marche (serré coupe l'est, large = confettis).

**FIX A — ÉQUILIBRE GÉO (✅ à coder) :**
- ❌ **PITCH 40°** (G+K recommandaient) → **RE-TESTÉ + RE-REJETÉ 2026-06-14 (preuve : wip/p4-pitch-test-{0,40})** :
  frames pitch 0 vs 40 QUASI IDENTIQUES. Notre carte = APLAT DE COULEUR sans relief Mapbox → incliner ne crée AUCUNE
  profondeur (confirme leçon 13 juin). Les modèles le recommandaient sans connaître cette contrainte. ÉCARTÉ. Top-down pur.
- ⭐ **Caméra qui PANE (pas statique)** (G+K) : commencer SERRÉ sur l'axe vital Bamako-Ouaga (zoom ~4.8, est hors-champ
  volontairement) → PAN lent vers le nord-est + léger dézoom (→4.2) = "dévoiler le Niger comme un rideau qui se
  lève" (le vide devient révélation de la taille de l'alliance). Drift continu, jamais à l'arrêt.
- **Règle des tiers** (G+K) : cluster d'action sur le tiers GAUCHE/bas, désert respire en haut/droite. JAMAIS centrer
  sur le centre géométrique si l'action n'y est pas.
- 🔶 Option Kimi "label NIGER—Ténéré op 0.3 dans le vide" = signale territoire désertique contrôlé. RETENU léger.

**FIX B — LISIBILITÉ / HIÉRARCHIE (✅ à coder) :**
- ⭐ **ÉCHELLE marquée** (G+K) : dirigeants MASSIFS (~10vmin, figures tutélaires) · soldats/menaces PETITS (~3.5vmin,
  pions tactiques). La taille = la sémantique (macro pouvoir vs micro terrain). [Actuellement trop proches.]
- ⭐ **OPACITÉ étagée FORTE** (G+K) : dirigeants → **0.3-0.4 (fantômes)** quand soldats arrivent (PAS 0.7 actuel, trop
  doux) → "parapluie politique en filigrane qui encadre sans boucher". Soldats → 0.4 quand menaces pulsent.
- ⭐ **MENACE = forme DIFFÉRENTE, pas un chip rond identique** (Kimi, clé du "qui est qui") : taches organiques SVG
  (cercles irréguliers, pulse sin, opacité ~0.6-0.7, multiply #8B0000) + petit jeton menace À L'INTÉRIEUR de la tache
  (scale 0.5), PAS à côté. Évite la confusion soldat(vert)/menace(rouge) = 2 ronds qui se ressemblent.
- **Z-index** (G) : petites pastilles (soldats/menaces) AU-DESSUS des gros portraits ; taches rouges SOUS les chips.
- **Étagement temporel STRICT** (G+K) : soldats puis menaces séparés ≥1.5s, JAMAIS simultané. Cascade stagger 5f.
- 🔶 "désaturer le fond beige AES sous la zone de conflit (radial gradient multiply léger)" (G) = fait ressortir les
  pions de combat. RETENU si besoin.
- ⛔ JAMAIS 3 bordures (or/vert/rouge) à 100% dans un rayon de 100px = "bruit chromatique" (Kimi).

**MISE EN SCÈNE (synthèse G+K, adaptée à NOTRE fenêtre f12640-13290 ~21s) :**
1. Assise : pitch 40-45°, serré Bamako/Ouaga, 3 portraits spring (gros) + plaques. 2. Déploiement : plaques→0,
   portraits→0.35, PAN nord-est lent + léger dézoom, soldats verts petits en cascade. 3. Menace : drift continu vers
   l'est (dévoile le Niger), taches rouges pulsent + jetons menace dedans, soldats→0.4. 4. Extinction : pitch repasse
   vers 0° (la carte s'aplatit, on voit tout le bloc une dernière fois = le Niger est justifié par ce plan global), noir.

**ÉCARTÉ/nuancé :** Kimi "pan capitale-par-capitale sur 270f" = trop long pour notre fenêtre audio (~21s, Ph10-11) →
garder le PRINCIPE (pan+pitch+dézoom) compressé. Coords soldats : on garde nos points existants, juste plus petits.

---

## RÈGLES TRANSVERSES (AI-slop, 2/2)
- Easing JAMAIS linéaire (easeInOutCubic caméra, easeOutBack pose soldats, Bézier waypoints).
- Figure-ground : AES saturé + stroke épais (4px) / reste du monde DÉSATURÉ 60% + stroke fin (1px).
- Palette parchemin stricte (rouge sang #8B0000 jamais #FF0000, or antique). Grain sur toute data-viz.
- Détourer le carré blanc du lingot or (masque SVG / regen alpha) — "crime AI absolu".
- Texte = WarMapPlaque ou plein écran, JAMAIS texte libre flottant sur la carte.
- Pitch 30-45° EXPLOITÉ (confédération + fin) — pas utilisé en v1.

## ⚠️ ANGLES MORTS / ARBITRAGES À TRANCHER (Aziz)
1. **Dirigeants AES nommés ou pas ?** Stylisés oui, mais afficher les noms (Goïta/Traoré/Tchiani) = à FACT-CHECKER
   + risque éditorial/politique. Option : portraits stylisés SANS nom, juste la ville/le rôle ("Chef de la junte").
2. **Data-viz ressources factuelle** : si camemberts/barres part mondiale → CHIFFRES À SOURCER (Niger ~5% uranium
   mondial à vérifier). Sinon, data-viz qualitative (sans %) ou barres comparatives sourcées. Pas de % inventé.
3. **CFA** : supprimer l'overlay mort → marqueur léger sur carte, fil Sahel→Paris, ou rien ? (décision rythme).
4. **Ampleur** : 12 jetons exode confirmé ? portraits dirigeants = 3 assets Gemini à générer + soldats + sprites villes.

## ASSETS À GÉNÉRER (Gemini, après arbitrages)
- 3-4 sprites VILLES top-down (bâtiment stylisé parchemin) pour Djibo/Ménaka/Tillabéri/Gao.
- 3 portraits DIRIGEANTS stylisés (chip, parchemin).
- 1-2 sprites SOLDAT AES top-down (jeton vert) si pas réutilisables des actes précédents (jeton-fama existe).
- icônes-personnes pour overlay coût (SVG pictogramme, pas Gemini).
- corriger le détourage de icon-or (carré blanc).

## ⭐⭐ SYNTHÈSE TRACÉE DES 2 DOWNSTREAM (Gemini + Kimi) — RIEN NE SE PERD (Aziz 2026-06-14)
> "Il ne faut pas laisser partir ce que les modèles nous disent, ils nous montrent la voie." Chaque idée = source
> (G=Gemini, K=Kimi, G+K=les 2) + décision (✅RETENU / 🔶NUANCÉ / ❌ÉCARTÉ+raison). Vérifié contre doctrine/faits.

### CHANTIER 1 — EXODE (à coder)
✅ Caméra serrée triangle Liptako-Gourma, pitch ~30° (G+K) · villes posées AVANT jetons : sprite Gemini bâtiment +
   WarMapPlaque + countryOutline pulse à chaque pose, "encre qui sèche" op0→1 scale0.9→1 (K) · ~12 jetons chip()
   (5 sprites réfugiés + miroir/rotation pour variété, K) · directions en ÉTOILE : ~4 sud (Bénin/CI) / 4 ouest (Mali
   stable) / 4 est (Niger) (K) · trajets LONGS 4-5 waypoints Bézier, 3-4s (G+K) · départs STAGGERED = flux continu (K) ·
   vitesses variées 0.8-1.2x + offset latéral ±0.2° anti-chevauchement (K) · SILLAGE wet-ink sable #C4A77D derrière
   chaque jeton (G+K) · RefugeeFlow op 0.3 en fond = volume collectif (G+K) · micro-smokePingPong poussière au départ (K).
✅ ENRICHISSEMENT : "ping radar inversé" — onde SVG qui grandit+fade quand la menace frappe, "pousse" les jetons (G).
🔶 "countryOutline du pays d'accueil pulse quand un jeton arrive" (K) — joli mais risque surcharge ; GARDER EN OPTION
   si la scène n'est pas déjà chargée.
❌ Rien d'écarté ici (les 2 convergent et sont bons).

### CHANTIER 2 — OVERLAYS DATA-VIZ (à coder, fullscreen opaque, 2 de suite)
✅ Overlay COÛT : TitleReveal "3 MILLIONS / DÉPLACÉS" mot-à-mot (K) · TokenRow icônes-personnes SVG pictogramme
   parchemin : 3 pour 3M (stagger 6f) PUIS cascade ~15 qui "tombent" et s'empilent en bas = "l'écran déborde" (G+K) ·
   StatCountUp cinétique easeInOutCubic (G+K) · GRAIN parchemin sur la data-viz (anti-corporate, K) · fond qui pulse
   très subtil pendant le compteur (K).
✅ Overlay RESSOURCES : layout triptyque Uranium|Or|Pétrole (K) · BARRES horizontales d3-scale (G+K) · sprites Gemini
   au bout de chaque barre, léger bob sinusoïdal (G+K) · ⛔ DÉTOURER le carré blanc du lingot (masque SVG/regen, G+K).
✅ Transition entre les 2 overlays : le 1er "casse" vers le bas (translate Y+, op0) pendant que le 2e monte = "tambour
   de présentation" (G+K). Pas de fondu mou.
🔶 DATA-VIZ : ❌ les CAMEMBERTS "% production mondiale" (K : Niger 5% uranium, Mali 4% or) = ÉCARTÉS — fact-check
   Sonar : la PRODUCTION uranium s'est effondrée (1,6% 2024), un % de prod serait TROMPEUR. → REMPLACÉ par les
   chiffres VERROUILLÉS (FACTS-P4) : Uranium "6% des RÉSERVES mondiales" · Or "Burkina 2e d'Afrique, 94,4t / Mali
   ~10% des exports" · Pétrole "oléoduc 110 000 b/j, ~80% des exports". Réserves+rang+infrastructure, PAS % prod.
✅ ENRICHISSEMENT "ligne de fuite vers pays consommateurs" (K) — fil doré ressource→silhouette Chine/France en haut
   = "le monde en dépend" SANS cartographie. RETENU (sobre, sert l'angle dépendance).
🔶 "rotation 2.5D des lingots scale X oscillant" (K) — OK léger bob, mais pas de pseudo-3D appuyée (charte plate).

### CHANTIER 3 — CONFÉDÉRATION SUR LA CARTE (à coder, pitch 45°, ZÉRO overlay)
✅ 3 countryOutline se dessinent → passent à l'OR via flash (G+K) · frontières INTERNES s'effacent op→0 + contours
   EXTERNES fusionnent en 1 ligne or épaisse (G) · sceau icon-sceau-confederation TOMBE (scale 1.2→1 "tampon", +rotation
   légère 5° "cire", K) au centre OU sur Niamey + ombre portée (ancrage, G+K) + smokePingPong poussière impact (G) ·
   COUNTRY_PULSES depuis Niamey = la cause/le QG (G) · pitch 45° + drift lent montre l'AES comme un bloc (G+K).
✅ CFA (décision Aziz) : marqueur léger "CFA · lié à Paris" sur carte + fil ténu Sahel→Paris (pas d'overlay mort).
   Aligne avec l'idée Gemini "jeton CFA barré près du sceau, ne pas casser le rythme avec un écran texte".
✅ ENRICHISSEMENT "signal radio : ondes stroke du QG → 3 capitales" (K) — la force commune qui rayonne. RETENU (sobre).
🔶 "remparts : SahelAttackArrow inversés aux frontières externes = défense commune" (K) — FORT mais risque charge ;
   OPTION si la scène respire. ❌ "flash écran blanc 3 frames pour annoncer" (K) = ÉCARTÉ (anti-charte parchemin).

### CHANTIER 4 — FIN HABITÉE (priorité 1, à coder en premier)
✅ Phase 1 DIRIGEANTS (séquentiel ~3s chacun) : portrait stylisé Gemini dans chip() sur SA capitale + WarMapPlaque
   ville (G+K). Caméra serrée sur chaque (cut ou travel léger). NOMS VÉRIFIÉS : Goïta(Mali)/Traoré(Burkina)/Tiani(Niger).
✅ Phase 2 SOLDATS : chip() bordure verte AES qui SE POSENT (scale0→1 easeOutBack) sur ~6 points 2/pays (Gao/Ménaka/
   Djibo/Dori/Tillabéri/Tahoua) APRÈS les dirigeants (causalité : commandent→tiennent) (G+K).
✅ Phase 3 MENACE RÉSIDUELLE : TerritorialExpansion taches organiques rouge sang #8B0000 qui PULSENT (op0→0.4→0.2)
   sur zones CONNUES (centre Mali Mopti/Ségou · trois-frontières · nord Burkina) + 2-3 jetons menace JNIM/EIGS qui
   pulsent SANS bouger (présence) (G+K). ⚠️ zones connues PAS positions OSINT exactes (honnêteté).
✅ Phase 4 EXTINCTION (validée Aziz) : tout reste → fill→0, grain noir monte, contours filigrane op0.1, territoire AES
   brille glow doré (blur AUTORISÉ sur le glow seul) → noir. "Sécuriser·Stabiliser·Durer?" en TitleReveal SUR LE NOIR (G+K).
✅ ENRICHISSEMENT "lignes de commandement dirigeant→soldats qui s'allument" (K) + "useClipFlags 3 capitales op0.3 fond" (K).
   Les 2 RETENUS (renforcent la lecture pouvoir→force + identité). Gemini : "burkinaFill teinte le territoire AES uni
   quand les soldats sont en place = ils tiennent la zone" → RETENU (causalité du contrôle).
⚠️ PIÈGE CLÉ (G+K) : ordre STRICT Dirigeants→Soldats→Menace (sinon "qui est qui ?"). Menace assez visible (pulse régulier).

### RÈGLES TRANSVERSES (AI-slop, G+K — appliquer PARTOUT)
✅ Easing JAMAIS linéaire (easeInOutCubic caméra, easeOutBack pose, Bézier waypoints) · FIGURE-GROUND : AES saturé
   stroke 4px / reste du monde DÉSATURÉ 60% stroke 1px (K, fort — résout le "vide" du dézoom) · palette parchemin
   (rouge sang #8B0000 jamais #FF0000) · grain sur data-viz · détourer lingot · texte = plaque ou plein écran jamais
   flottant sur carte · pitch 30-45° EXPLOITÉ (pas en v1) · drift caméra continu (carte jamais morte).
✅ ENRICHISSEMENT "étiquettes de contexte temporaires" (K) : petite WarMapPlaque "JNIM actif" 2s sur zone menace puis
   disparaît = label informatif causal. RETENU pour la menace résiduelle.

### ⭐ EXTRACTION DEEPSEEK UPSTREAM (D) — récupérée 2026-06-14 (avait filé de la 1re synthèse, Aziz : "ne rien laisser partir")
> La 3e voix (DeepSeek V4 upstream) contenait des pépites non extraites. Ajoutées ici, tracées.
✅ **Pivot coût→levier "aube"** (D) : pendant la carte nue, remonter TRÈS doucement la luminosité globale (overlay
   blanc cassé très faible) + RALENTIR le drift = "inspiration" avant les ressources. Renforce l'anti-cynisme. → Chantier 2/transition.
✅ **Vignette circulaire au pivot** (D) : radial gradient (centre→bords) qui se DISSIPE quand l'or apparaît =
   "on sort du brouillard humain". Déjà faisable (SVG radial opacity). → transition coût→ressources.
✅ **Compteur non-robotique** (D) : overshoot amorti (spring) + freinage en fin (easeOutExpo) + décalage 5f entre
   les 2 chiffres + serif parchemin sur cartouche sombre. → Chantier 2 overlay coût.
✅ **Extinction : grain qui s'ACCENTUE** (D) : superposer un calque parchemin qui MONTE en opacité+contraste =
   "vieil écran qui s'éteint", pas juste assombrir. → Chantier 4 phase 4.
✅ **Onde d'union / ripple focalisé** Ph7 (D, rejoint "signal radio" K) : cercle doré expansif depuis Niamey →
   bordure puis fond ~0.7s = l'union qui RAYONNE. → Chantier 3 (déjà dans code v1, confirmé).
✅ **Traînées de fuite** (D) : pointillés sable désaturé 2px MAX, opacité décroissante, JAMAIS de flèche. → Chantier 1.
✅ **Icône JAMAIS sans ancrage spatial** (D, expert) : chaque lingot/sceau posé sur un point géo précis, jamais flottant.
🔶 **Micro-tempo sonore ressources** (D) : "clic de pièce / frottement sourd" à chaque apparition ressource = renforce
   "levier". OPTION SFX (à valider au mix — cohérent doctrine "SFX si support visuel fort", ici l'apparition l'est).
🔶 **Picto pièce/flèche brisée pour CFA** (D) : ancrer le concept monétaire. → cohérent avec décision Aziz "marqueur
   léger + fil Paris" (le fil = la "flèche" du lien). RETENU sous la forme du fil, picto pièce écarté (cliché).
✅ **Drapeaux finaux** (D) : si gardés, TRÈS petits, fondu 20f, "éviter le sentimentalisme". → Chantier 4 (option au render).

### POINT EXPERT À RETENIR (G+K)
- Operations Room : nombres/labels POSÉS sur les zones (pas overlay flottant central) → vaut pour menace + soldats.
- "Le spectateur lambda décroche au dézoom vide à 1:50" (G) → la fin habitée EST la réponse (dernier pic dopamine).
- K : utiliser GeoConvergenceOverlay (dizaines de fines flèches convergentes) pour la confédération = militarisation
  visible, pas juste un changement admin. 🔶 OPTION forte pour Chantier 3 si on veut pousser.

## ⭐⭐ SYNTHÈSE TRACÉE — DA UPSTREAM CHANTIER 1 EXODE (Gemini + Kimi + DeepSeek, 2026-06-14)
> 3 voix, convergence TRÈS forte. Sorties : `/tmp/da-refs/da-warmap-sahel-p4-c1-exode-{gemini,kimi,deepseek}.md`.
> Source : G=Gemini, K=Kimi, D=DeepSeek, +=convergent. Décision : ✅RETENU / 🔶OPTION+condition / ❌ÉCARTÉ+raison.

### A. SÉQUENCE (le découpage des ~10s, f9736→f10047) — convergence des 3
✅ **Villes posées AVANT/au nommage** (G+K+D) : town-td + WarMapPlaque + countryOutline qui se trace (couleur pays)
   + flash discret. La ville EXISTE avant l'exode (cause). Synchro frame exacte : Djibo f9790, Ménaka f9809, Tillabéri f9835.
✅ **Micro-pulse rouge grave #6B1A1A sur la ville = "assiégée" (la cause)** (G+K+D) : UNIQUEMENT en STROKE d'un
   cercle qui grandit+fade (onde de choc), JAMAIS en fill ni en nappe (sinon confusion avec sillage menace P2). 0.5s, op≤0.6.
✅ **Jeton s'EXTRAIT de la ville** (G+K+D) : décalage ~4-8f entre apparition ville et départ jeton (grammaire causale).
   Micro scale-up 1.0→1.05 "prend son élan" (D) + desertDust soulevée AU départ (D+K).
✅ **Directions ÉTOILE asymétrique** : ❌ PAS 4/4/4 parfait (G+K+D : "flocon de neige" = AI-slop). ✅ répartition
   organique pondérée par routes réelles : ~5 sud (Bénin/CI, route majeure) / ~4 ouest (Bamako) / ~3 est (Niamey) (G).
✅ **RefugeeFlow fond op 0.2-0.3** (G+K+D) : corridors pointillés stroke-dasharray, suivent axes réels (fleuve Niger),
   PAS lignes droites. Opacité différentielle par corridor (G : Djibo 0.3, Ménaka 0.15 = hiérarchie de crise).
✅ **f10047 "le coût" = le flux CONTINUE en fond (op 0.3-0.4) sous le chiffre** (G+K+D) : le chiffre ne FIGE pas la
   carte (anti-PowerPoint). La vie continue derrière. Chiffre révélé par le MÊME sable wet-ink (connexion causale).
   ⚠️ NB Chantier 2 refera l'overlay coût en plein écran — ici on garde l'overlay ancré actuel, juste flux derrière.

### B. DENSITÉ VIVANTE (anti-ballet mécanique des 12 jetons) — le cœur du réacteur (G+K+D)
✅ **Cohortes/"unités familiales" PAS boucle for unique** (G+K+D) : 3-4 unités logiques (homme seul rapide / femme+enfant
   lent / groupe de 3), chacune startFrame+waypoints+vitesse PROPRES. "L'œil perçoit des initiatives individuelles."
✅ **Easing hétérogène par cohorte** (G+K+D) : JAMAIS linear. Bézier(.4,0,.2,1) / micro-pause mi-trajet / spring damping
   variable (famille=damping fort lourd, homme=damping faible rapide). + waypoints non-uniformes (lent à l'extraction,
   croisière au milieu) = variation de vitesse purement mathématique (D).
✅ **Variation d'échelle SÉMANTIQUE** (K) : famille scale 1.15 + sillage large 6px ; enfant scale 0.75 + sillage fin 3px
   + vitesse 1.3x (fuite précipitée) ; femme scale 1.0 + possibilité de pause 12f (épuisement). RETENU (raconte sans un mot).
✅ **Profondeur 2.5D par position Y (SANS pitch réel)** (D, levier B.3) : scale 0.9 haut/lointain → 1.1 bas/proche +
   opacité 0.8→1.0, calculé sur y projeté. ⭐ C'EST LA PARADE AU CONFLIT PITCH (voir ANGLE MORT ci-dessous).
✅ **Z-index dynamique par latitude** (K+D) : zIndex = floor(y), les jetons sud (bas) passent devant nord (haut) =
   profondeur naturelle + anti-chevauchement. RETENU.
✅ **Variété sprites : miroir + micro-rotation** (K) : flip horizontal aléatoire (scaleX:-1) + rotation ±3° sur le sprite
   clippé (PAS sur le cercle parchemin qui reste droit) + filter brightness 0.9-1.1. Évite les 5 assets clonés visibles.
✅ **Jitter waypoints ±5px + mid-point noise** (K+D) : trajets jamais exactement superposés ni Bézier "parfait"
   géométrique. Bifurcations visibles (D : carrefour commun après la ville puis les chemins se séparent).
🔶 **Pool/recyclage de jetons (villes "crachent" un jeton toutes ~20f, recyclé quand sort du cadre)** (K+D) — flux
   jamais le même nombre, très organique. OPTION : élégant mais + complexe (state machine). CONDITION : si 12 jetons
   statiques-en-nombre paraissent répétitifs au 1er render, activer le pool. Sinon 12 jetons à trajets variés suffisent.

### C. SILLAGE wet-ink sable — la signature (G+K+D)
✅ **Sable #C4A77D (frais) → #A8895C (mi-vie) → #8B7355 (fantôme)** (K) : 3 "âges" simultanés op 0.8/0.4/0.1, flou
   croissant 2/3/4px = nappe qui s'épaissit où le passage est intense. RETENU (la cicatrice collective).
✅ **Largeur variable selon le jeton** (G+K+D) : adulte 4-6px, enfant 2-3px = groupes de tailles différentes.
✅ **feGaussianBlur fin (stdDev ~0.8-2) sur le mask + mix-blend-mode multiply** (G+K+D) : intersections = zone plus
   dense MAIS lisible, pas un blob opaque. Regrouper les sillages par direction (<g id="sillages-sud">) op groupe 0.85 (D).
✅ **Limite de longueur ~60f (2s) d'historique + fade exponentiel op=1-(age/60)²** (K) : la queue s'efface vite, pas
   de traînée infinie. RETENU (perf + lisibilité).
🔶 **Sillage = ellipses orientées selon la direction (pas cercles purs)** (K) : "empreintes de pas" directionnelles.
   OPTION : joli mais + de calcul. CONDITION : si le sillage en cercles paraît trop "coup de pinceau digital".

### D. ENRICHISSEMENTS RÉUTILISABLES (Partie C des 3 modèles)
🔶 **Onde de choc d'arrivée** (G) : cercle sable fin qui s'étend+fade quand un jeton atteint sa destination = "le
   fardeau de l'accueil" (insécurité alim.). OPTION (à coder, faisable). CONDITION : si on veut lier au "15 millions".
🔶 **Plaque-nom qui "sèche/craquelle" au départ** (D) : op baisse + feTurbulence fin multiply = "ville vidée, coquille".
   OPTION forte narrative (à coder). CONDITION : si la scène respire après les villes posées.
🔶 **Vignette qui se resserre** (K+D) : radial gradient mask 150%→90% sur la séquence = "coince" le regard dans le
   triangle. OPTION (déjà faisable). 🔶 car risque d'assombrir — tester léger.
🔶 **Étiquette population minuscule sous la ville (~30k, op 0.5)** (D) : "info figée = lieu / info en mouvement =
   personne" → renforce la distinction ville/jeton. OPTION (faisable). CONDITION : si confusion ville/jeton persiste.
❌ **AssaultPulse comme module réutilisable séparé à coder** (D) — ÉCARTÉ comme refactor : on code le pulse rouge
   inline (déjà présent dans le code actuel refTokens.cityPulse), pas besoin d'un nouveau composant pour ce chantier.
❌ **Caméra zoom-out pendant l'exode** (D, "zoom 11→9.5") — ❌ ÉCARTÉ : CONTREDIT Gemini ("ne JAMAIS animer la caméra
   pendant l'exode, charge cognitive 12 jetons + sillages = trop") ET notre besoin de caméra SERRÉE. On garde un drift
   TRÈS léger (carte vivante) mais PAS de dézoom — le dézoom est réservé à Ph9 plus tard. Tranché en faveur de G.
❌ **refugeeParticle() (taches sable 4px sans portrait pour 8 jetons de fond)** (K) — ❌ ÉCARTÉ : nos jetons-visage
   SONT la signature émotionnelle (P2 validée). Des taches anonymes = retour au cheap. On garde 12 vrais chip().

### E. PIÈGES → PARADES (à coder dès le départ, G+K+D convergent)
✅ Z-INDEX STRICT (G+K+D) : fond carte → RefugeeFlow → sillage wet-ink → jetons → town-td → poussière → plaques texte.
   Le texte prime TOUJOURS (jamais un jeton par-dessus "Tillabéri").
✅ Rouge cause ≠ sillage : rouge #6B1A1A en STROKE pulse only, sillage STRICTEMENT sable (anti-confusion menace P2).
✅ Sortie de cadre = fade mask bord (op 1→0 sur 15f) "brume de sable", PAS de pop-out brutal (K+D).
✅ Ville ≠ jeton : town-td ancré + ombre DURE + ne bouge jamais ; jeton = ombre flottante + sillage continu (D).
✅ Distinction morpho town-td (bâtiment/anneau épais 3px) vs jeton (cercle bordure fine 1.5px + portrait) (K).
✅ Drift caméra TRÈS léger + vignette qui respire (D) = éviter "image gelée" sur plan fixe.

### ⚠️ ANGLE MORT TRANCHÉ — LE PITCH (conflit code-existant vs décision du jour)
- Décision Aziz 2026-06-13 GRAVÉE dans le moteur (commentaire l.1555) : "PITCH 3D P3 RETIRÉ — sans couche de relief
  Mapbox (hillshade/terrain), incliner ne révèle aucune montagne (carte plate) → effet cosmétique qui casse le top-down
  cohérent P1/P2/Acte1." → un pitch nu = juste une carte inclinée, sans le relief qui le justifierait.
- Décision Aziz 2026-06-14 (cette session) : pitch ~30° sur l'exode "pour le relief des flux".
- DA : G+K supposent un vrai pitch (proposent du billboarding = contre-rotation des chips). D propose une ALTERNATIVE
  qui donne le relief des flux SANS incliner la carte : profondeur 2.5D par échelle+opacité+z-index selon position Y.
- ⭐ RECOMMANDATION CLAUDE : adopter la profondeur 2.5D (D) en TOP-DOWN — on obtient le "relief des flux" voulu (jetons
  qui rapetissent/pâlissent vers l'horizon haut, se chevauchent par latitude) SANS le risque "carte inclinée plate" ni
  le surcoût billboarding. Cohérent P1/P2/Acte1. → À TRANCHER PAR AZIZ avant code (option : tester un vrai hillshade =
  chantier séparé si Aziz veut vraiment l'inclinaison).
- ✅ **TRANCHÉ AZIZ 2026-06-14** : profondeur 2.5D TOP-DOWN sans pitch (option D). On garde top-down (cohérent P1/P2/
  Acte1, respecte la décision du 13 juin), relief des flux par échelle+opacité+z-index selon Y. PAS de pitch, PAS de
  hillshade, PAS de billboarding. La caméra exode reste top-down serrée (pas de modif PARTIE4_CAM_KEYS pour le pitch).

## ✅ CHANTIER 1 EXODE — CODÉ + rendu (2026-06-14, EN ATTENTE verdict Aziz)
- DA upstream 3 voix fait (synthèse tracée ci-dessus). Pitch ❌ (décision Aziz top-down) → profondeur 2.5D.
- Code : `Partie4Cout.tsx` section "CHANTIER 1 EXODE DENSE" (FLEE_CITIES 4 villes + FLEE_UNITS 15 jetons cohortes +
  cityStates + unitStates + sillage wet-ink mask + RefugeeFlow corridors). Caméra resserrée `PARTIE4_CAM_KEYS`
  f9700-10047 (zoom ~5.75, top-down, pas de pitch).
- Asset : `town-td-cut.png` créé (détourage flood-fill du fond gris du town-td original → village top-down propre).
- Rendu review v5 : catbox `lyxj55`. → 3 corrections Aziz (2026-06-14) appliquées en v7 :
  1. ✅ **5 jetons MAX** (= nb sprites distincts, un par sprite, chacun unique). 15 jetons = clones + brouillon
     (rejeté). Volume porté par RefugeeFlow + sillages, pas par une foule de pastilles.
  2. ✅ **Villes = marqueur SVG sobre dessiné** (disque parchemin + anneau couleur pays + silhouette 2 maisons encre).
     Abandon du sprite town-td (répété sur 4 villes + détourage cheap, carré visible). Zéro problème de détourage.
  3. ✅ **Coût = plaque OPAQUE ancrée** (fond parchemin solide, haut-gauche, countup animé, flux continue AUTOUR).
     Remplace le semi-transp. → RÈGLE GRAVÉE : `WarMapOverlayDynamic mode="semitransp"` BANNI partout (voir
     WARMAP-GRAMMAIRE-CAUSALE.md, renforcement 2026-06-14). À refaire pour confed+CFA (Chantiers 2/3).
- v7 catbox `9m8ise`. → 2e passe corrections Aziz (2026-06-14) en v9 :
  4. ✅ **Villes = Lucide MapPin** (test pin/building/tent fait → MapPin tranché). lucide-react, compatible render.
  5. ✅ **Coût = CARTOUCHE CENTRAL OPAQUE** (PAS plein écran — la carte reste visible AUTOUR du cartouche, jamais
     à travers). Aziz : l'action de fuite a déjà joué → exode FADE quand le cartouche arrive (EXODE_OUT=F_COUT+24).
     Countup 3M (3 icônes-personnes TOUTES allumées) → bascule 15M+ (15 icônes 2 rangées empilées TOUTES allumées),
     cadre autour des icônes. = Chantier 2 "coût" BOUCLÉ. Reste juste l'overlay RESSOURCES au Chantier 2.
- Rendu v9 : `out/episodes/warmap-sahel/wip/p4-c1-exode-v9.mp4` → catbox `tf8hrn`. EN ATTENTE verdict Aziz.
- ⚠️ DETTE : overlays confed (F_FORCE) + CFA encore en mode="semitransp" → passer opaque aux Chantiers 2/3.
  Imports lucide MapPin/User dans Partie4Cout. v8 catbox `5gx9md` (plein écran rejeté → cartouche central).

## AVANCEMENT (2026-06-14)
✅ **ASSETS GÉNÉRÉS** (`public/_shared/sprites/warmap/p4-assets/`) : 3 portraits dirigeants i2i depuis photos
   Wikimedia (leader-mali/burkina/niger.png — RESSEMBLANTS, sans texte parasite ; 1er essai i2i avait halluciné
   "Alpha Diallo 1918" → corrigé consigne anti-texte) · town-td (ville top-down) · soldier-aes · threat-fighter ·
   icon-or/uranium/petrole/sceau (déjà là). NOMS dans plaques Remotion contrôlées, PAS dans l'image.
✅ **CHANTIER 4 (FIN HABITÉE) CODÉ + rendu** : dirigeants dans capitales (chip or + plaque nom/rôle décalée haut/bas)
   → soldats verts qui se posent (6 points) → menace résiduelle (taches rouge sang pulsent + jeton-combattant +
   étiquette "JNIM/EIGS actif" 2s) → extinction. FOCUS SÉQUENTIEL : dirigeants→42% quand soldats arrivent, soldats→55%
   quand menace pulse (hiérarchie du regard). Caméra : dézoom Ph9 bref puis RETOUR serré (zoom 4.55) sur le bloc pour
   voir les visages, dézoom doux à l'extinction. Gates moteur : intro/outro/CTA globaux gatés !isPartie (parasitaient).
   Render : `out/episodes/warmap-sahel/wip/p4-c4-v3.mp4`.
   ✅ **v3 (Aziz)** : plaques noms disparaissent AVANT les soldats (présentent puis partent) · soldats SANS texte ·
   menace SANS étiquette "JNIM actif" (l'image parle). TAILLES inchangées (contraste portraits/soldats = qualité
   voulue, hiérarchie pouvoir/force/menace lisible sans un mot). Atténuation dirigeants adoucie (0.7 à la menace).
   Beaucoup plus épuré. RESTE : Ouaga/Niamey proches mais lisible sans les plaques. EN ATTENTE verdict Aziz v3.

## PROCHAINE ÉTAPE
1. [Aziz juge Chantier 4 v2 — accepter le tassement géo-honnête OU aérer soldats/menace.]
2. CODER les chantiers restants : 1 (Exode dense ~12 jetons) → 3 (Conféd sur carte, fusion+sceau) → 2 (Data-viz
   plein écran : coût icônes cascade + ressources réserves/rang, chiffres VERROUILLÉS FACTS-P4).
3. Chaque chantier : render scale 0.5 → juger → ajuster. Puis full HD → assemblage final (concat 5 + mix).
