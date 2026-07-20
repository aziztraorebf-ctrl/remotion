# STORYBOARD CONSOLIDÉ — "L'AES en 90 secondes" (Short 9:16, reprise V4→V5)

> **Document de référence unique pour le code.** Fusion Agent B (socle "la carte qui s'écrit") +
> greffes Agent A, mis à jour avec les décisions validées SUR IMAGE par Aziz (2026-07-08),
> PUIS enrichi par 3 voix externes (Gemini 3.1 Pro, GPT-5.5, Kimi K2.5) qui ont vu notre frame réelle.
> Les 2 storyboards sources : `STORYBOARD-AGENT-A.md` / `STORYBOARD-AGENT-B.md`.
> Sorties externes : `storyboard-gemini.md`, `storyboard-gpt.md`, `storyboard-kimi2.md` (scratchpad session).

## 3 VOIX EXTERNES — convergence + apports retenus (2026-07-08)

Les 3 modèles ont vu notre frame navy réelle + le script + les contraintes dures. CONVERGENCE FORTE entre
les 3 ET avec notre V4 (signal de robustesse) : contour lumineux→fill, Libye qui s'effondre par la COULEUR
(pas de fracture), points villes tenues bleus, coups d'État ordre chrono réel, ocre→drapeau à l'AES,
ressources→sceau. 3 DÉCISIONS AZIZ intégrées ci-dessous :

1. ⭐ **GHOST BORDERS (Gemini)** — RETENU. Un élément "détruit" (lien CEDEAO rompu, frontières internes AES,
   fracture) ne disparaît JAMAIS (opacity 0) : il passe en pointillé fantôme `strokeDasharray="2 4"`,
   opacity 0.15, et RESTE sur la carte. À la fin, on devine tous les événements passés en filigrane.
   Renforce la signature "la carte qui s'écrit / accumule la mémoire". Gratuit techniquement.
2. ⭐ **CTA SUR LA CARTE (GPT/Gemini)** — RETENU. Le CTA final reste dans le registre carte navy : on rallume
   Libye + Kidal comme points/callouts + lignes fines + texte "VIDÉO LONGUE / LIEN EN DESCRIPTION" (au-dessus
   de la zone sous-titres). ZÉRO rupture de registre. On ABANDONNE `CtaCard.tsx` (image vidéo) — la carte
   accumulée est un meilleur fond. (Remplace la décision "assumer CtaCard" du V4.)
3. ⭐ **FRACTURE TRIO/CEDEAO (Gemini+GPT)** — RETENU, remplace la fracture-du-trio de l'agent B. La carte se
   casse ENTRE le trio (Mali/Burkina/Niger) et les pays côtiers CEDEAO : le bloc AES se DÉTACHE de l'Afrique
   de l'Ouest côtière (= "ils quittent la CEDEAO", séparation, pas auto-destruction). 2 groupes clipés par
   polygones, translate opposés (CEDEAO x-24/y+18, trio x+10/y-8), grille incluse dans les groupes. Ligne de
   fracture blanc `#FFF2D0` + glow rouge. La fracture reste en cicatrice fine (ghost border) après le choc.
   NOTE : ceci change le raccord 8b→9 — le sceau AES ne "ressoude" plus le trio ; il naît sur le trio détaché.

## SOCLE VISUEL — verrouillé et validé sur render (proto `ProtoCadrageLibye.tsx`)

- **Registre unique** : carte géographique vivante, **d3-geo PUR** (zéro Mapbox), 1 seul cadre continu
  du début à la fin, jamais de cut de décor. Sous-titres mot-par-mot. UNE seule rupture (fracture CEDEAO).
- **Fond** : NAVY quadrillé — dégradé radial `#1c2b4a` (haut) → `#16213a` → `#101a30` (bas, profondeur) +
  halo froid `#2a3c60` derrière la carte + grille `#33456b` (opacity 0.5). Remplace le parchemin
  (décision Aziz : le navy fait mieux ressortir les couleurs et porte la tension du récit sombre).
- **Cadrage** : bbox FIXE englobant trio + Libye (`fitExtent` [[W*0.04,H*0.12],[W*0.96,H*0.74]]),
  carte agrandie + remontée, zone sous-titres préservée (y>1600). **Push-in continu lent** (scale 1→1.05
  sur toute la durée, doctrine caméra Souverain). Libye invisible jusqu'au bloc 3, s'allume EN PLACE —
  ZÉRO recadrage/mouvement de projection.
- **Tracé pays** (validé sur image) : **contour OCRE LUMINEUX `#f0cf8f` qui se dessine** (strokeDashoffset,
  lisible sur navy = effet "carte d'état-major qui s'écrit") → PUIS **fill ocre neutre** monte (délai 30f,
  `url(#pcl-ocre)` `#e7bd78→#d2ad66→#bf9442`) → liseré sombre `#0b1220` de définition. Le contour lumineux
  s'atténue quand le fill monte.
- **Couleur pays** : ocre neutre = "territoire pas encore politiquement défini". La couleur du DRAPEAU
  (aplat) ne monte qu'à la naissance de l'AES (bloc 9). Décision Aziz : "contour d'abord, puis fill ocre
  neutre → drapeau à l'AES".
- **Style drapeau** : APLAT couleur dominante (pas image clippée) sur les polygones pays — les 2 agents
  ont tranché pareil (polygones Mali/Niger allongés/concaves → drapeau clippé illisible). Image réelle
  réservée aux gros médaillons Liptako (bloc 9).

## FAITS VÉRIFIÉS (closes)

- **Drapeau Libye 2012** = tricolore rouge-noir-vert + croissant/étoile (post-Kadhafi, rétabli 3 août 2011).
  PAS le vert Kadhafi. Vérifié Britannica/WorldAtlas. Le geste "vire gris→rouge" part de ce tricolore.
- **"+territoire qu'en 2012"** = vrai et sourcé (FACTCHECK-SONAR-V5 l.66-74) MAIS aucun % global fiable →
  rester SYMBOLIQUE (flèche/"+territoire", pas de %). Consigne interne "pas de % sans date". Chiffre
  honnête dispo si besoin : "40% du Burkina hors contrôle en 2022" (source officielle burkinabè).

## BRIQUES CODE RÉELLES (vérifiées sur disque)

- `warmap/parties/sahelCountries.ts` : rings décimés lon/lat EN DUR — `MALI_RING`, `NIGER_RING`,
  `BURKINA_RING`, `LIBYE_RING` (+ `BENIN/NIGERIA/GHANA/COTE_IVOIRE_RING` pour la menace CEDEAO). Zéro fetch.
- `_proto-16-9/ProtoCarto_ContinentDraw.tsx` : pattern trace multi-pays d3-geo (base du socle).
- `_proto-16-9/ProtoEffect_Fracture.tsx` : fracture zigzag SVG pur (`fracturePath()` + 2 clipPath halfA/halfB
  + shake + debris + `mix()` couleur + recompose). Base de la rupture CEDEAO, à généraliser 1→3 pays.
- `warmap/shorts/aes-short-90s/ProtoCadrageLibye.tsx` : le socle cadrage validé (à généraliser en scène complète).
- Inserts à réutiliser + RECOLORER navy : `LiptakoRevealSVG9x16.tsx` (naissance AES), `ResourcesRevealSVG9x16.tsx`
  (ressources). `CtaCard.tsx` : NE PAS toucher.
- `SahelAttackArrow.tsx` : **Mapbox-only, INUTILISABLE** en d3-geo pur → flèches maison SVG (`<path>`+`<polygon>`).
- Drapeaux : `ml.png`/`bf.png`/`ne.png` présents ; `ly.png` absent mais NON bloquant (aplat couleur choisi).
- Audio : `public/_shared/audio/sahel-warmap/short-90s-v1.mp3` (91.86s, 2756f @30fps).
- Whisper : `warmap/_shared/whisper-words-short-90s.ts` (timing mot-par-mot).

---

## MAPPING PANEL-PAR-PANEL (bornes Whisper réelles, frames @30fps)

### Panel 1 — 0.0–4.1s / f0–f123 — "En moins de trois ans, trois nations ont tout changé en même temps."
- Fond navy fade-in. Trio se trace ouest→est (Mali f0, Burkina f18, Niger f36) : contour ocre lumineux
  → fill ocre neutre (délai 30f). Push-in lent actif dès f0.
- "tout changé en même temps" (f97+) : les 3 pays, une fois remplis, pulsent EN PHASE (synchro) — signifie
  "en même temps" par le mouvement, pas un texte.
- Cartouche titre discret haut ("DOSSIER / L'AES EN 90 SECONDES"), opacity 18-42f.
- **Faisabilité** : PROUVÉ (socle `ProtoCadrageLibye` validé).

### Panel 2 — 5.5–12.7s / f165–f381 — "Ils chassent leurs partenaires militaires, rompent leurs alliances historiques, et quittent la CEDEAO..."
- Trio plein, stable. Un lien pointillé doré (partenaires/CEDEAO) part du bloc vers un point hors-cadre haut,
  puis SE ROMPT (se scinde en 2 segments qui reculent + fade) sur "chassent"(f174)/"rompent"(f244).
  SFX `cedeao-snap.mp3` faible volume (0.35 — le fort est réservé à la fracture 8b).
- "quittent la CEDEAO" (f301-330) : cartouche CEDEAO discret apparaît haut-droite, gris `#8a8272`, opacity→0.5
  (annonce, pas encore actif).
- "bâtir quelque chose de nouveau" (f339+) : trio pulse 2e fois plus fort + légère montée saturation ocre.
- **Faisabilité** : lien+cassure = adaptation `ProtoEffect_Fracture` (À PROTOTYPER, principe prouvé).

### Panel 3 — 14.3–17.6s / f429–f528 — "Tout bascule en 2012, quand la Libye s'effondre :"
- La Libye s'allume EN PLACE (bbox déjà calée, cf socle) : contour ocre lumineux → fill ocre neutre.
- "bascule" (f431) : shake 6px amorti sur le groupe carte (le mot EST un geste physique).
- "2012" (f460+) : cartouche daté sobre (`Bebas Neue`, NAVY sur pastille claire), posé rigide.
- **Faisabilité** : PROUVÉ (Libye = même mécanique que trio, `LIBYE_RING` prêt, cadrage validé).

### Panel 4 — 18.9–22.9s / f569–f687 — "armes et combattants descendent vers le sud, et le nord du Mali s'enflamme."
- Le drapeau libyen (aplat tricolore rouge-noir-vert) monte dans le polygone Libye (f475-520 amont), PUIS
  vire GRIS `mix(drapeau,"#8a8878",griseK)` (f569-650) PUIS ROUGE crise `mix(gris,"#b23a2e",rougeK)` (f650-720).
- Flux Libye→nord-Mali : `FlowDots` (brique prouvée) le long d'un path centroïde Libye→nord-Mali (coords géo
  réelles projetées), couleur CRISIS, f569-620.
- "s'enflamme" (f641-687) : masque dégradé radial CRISIS clippé sur le path Mali (clipPath=path Mali, le rouge
  ne déborde jamais du pays), centré ~Kidal [1.4,18.4], rayon 0→380px. Seule la moitié nord rougit.
- **Faisabilité** : FlowDots PROUVÉ ; masque radial clippé À PROTOTYPER (simple).

### Panel 5 — 24.5–29.3s / f735–f879 — "La France, puis l'ONU interviennent — mais tiennent les villes, pas les campagnes."
- Points pulsants sur vraies coords villes tenues (Bamako, Gao, Tombouctou) : anneau `#3a5a8c` (France/ONU
  sobre, PAS bleu-blanc-rouge plaqué), pulse `0.5+0.5*sin(frame*0.16+i)`, apparition décalée f735/755/775.
- "ONU" (f778) : 2e anneau concentrique `#4a7ab8` autour des mêmes points (2 acteurs, mêmes villes).
- "villes pas les campagnes" (f826+) : le rouge du nord-Mali (acquis panel 4) PULSE plus fort (0.55→0.75)
  pendant que les points restent stables = contraste tenu/instable qui EST la phrase.
- **Faisabilité** : PROUVÉ (pattern RESOURCE_POINTS de ProtoCarto, recoloré). PAS de flèche (SahelAttackArrow KO).

### Panel 6 — 30.3–35.8s / f909–f1074 — "Dix ans plus tard, les groupes armés contrôlent PLUS de territoire qu'en 2012."
- 3 masques radiaux rouges (1/pays, clippés chacun sur son path, centrés sur zones d'insécurité réelles :
  nord-Mali, est-Burkina Liptako, ouest-Niger Liptako), rayon interpolé × ~2.4 sur f909-1050. Débordent sur
  Burkina/Niger, jamais hors frontières.
- Points bleus villes restent FIGÉS (ne grandissent pas) = contraste "plus de territoire".
- Cartouche marge SYMBOLIQUE "+ TERRITOIRE ▲" (PAS de % — cf faits). Vignette légère (plafond 0.25).
- Courbe d'easing marquée (ease-in cubique) pour que l'œil perçoive une ACCÉLÉRATION du danger (cf rythme §7).
- **Faisabilité** : extension masque radial À PROTOTYPER (linéaire).

### Panel 7 — 37.4–41.2s / f1122–f1236 — "Face à cet échec, les militaires prennent le pouvoir dans les trois pays."
- Sur chaque pays, un ANNEAU qui se ferme (cercle strokeDashoffset ~20f, épais, navy/ocre) au-dessus de la
  capitale, séquencé dans l'ORDRE CHRONOLOGIQUE RÉEL des coups : Mali (f1122) → Burkina (f1146) → Niger (f1170).
  PAS l'ordre graphique ouest→est — choix factuel (greffe agent B).
- Le rouge de fond FIGE sa valeur (l'échec est acté). Contour des 3 pays gagne en épaisseur (2.6→3.6).
- PAS de blason/écu (registre rejeté) — forme géométrique sobre.
- **Faisabilité** : PROUVÉ (cercle strokeDashoffset).

### Panel 8a — 42.5–45.4s / f1275–f1362 — "La CEDEAO menace d'une intervention armée."
- Le cartouche CEDEAO (posé panel 2, jamais retiré) se RÉVEILLE : gris `#8a8272` → rouge alerte `#b23a2e`
  (`mix()`, f1275-1310), pulse fort. Une flèche fine MAISON (`<path>`+`<polygon>` triangle, PAS SahelAttackArrow)
  part du cartouche vers le bloc, s'arrête à 55% (menace suspendue).
- "armée" (f1350+) : micro-shake 4px sur le bloc (avant-goût fracture).
- **Faisabilité** : PROUVÉ (mix + strokeDashoffset + flèche SVG triviale).

### Panel 8b — 46.8–50.8s / f1404–f1524 — "Cette menace... va produire l'inverse de l'effet recherché." → RUPTURE UNIQUE
- "menace..." (f1405-1430) : tension pure, rien ne bouge (la voix hésite).
- "va produire l'inverse" (f1430-1466) : FRACTURE zigzag traverse le BLOC ENTIER (3 pays). Généralisation
  `ProtoEffect_Fracture` : `fracturePath()` recalculé sur bbox 3 pays ; 3 paires clipPath (1/pays) avec le
  MÊME `FRACTURE_D` (une seule fracture frappe les 3) ; 3 splits différentiels (Mali ×1.3 épicentre >
  Burkina ×0.9 ≈ Niger ×0.85). SFX `cedeao-snap.mp3` PLEIN volume (0.9). Shake fort 18px amorti. La flèche
  CEDEAO recule et se BRISE (debris).
- `crisisK` : fill (déjà rouge) → CRISIS_DARK (ça empire).
- "effet recherché" (f1490+) : la fracture NE se referme PAS — reste OUVERTE à 70%, sera ressoudée au panel 9.
- **Faisabilité** : PROUVÉ (mécanisme), orchestration 3 instances + relais À PROTOTYPER.

### Panel 9 — 52.6–60.5s / f1578–f1815 — "Le 16 septembre 2023... naît l'Alliance des États du Sahel." → LIPTAKO recoloré
- La fracture (8b) se REFERME (recompose 0.7→1, ease-out) et AU POINT DE JONCTION (~f1650) le sceau AES
  `LiptakoRevealSVG9x16` NAÎT (le sceau apparaît exactement là où les 3 pays se retouchent = l'AES répare
  la fracture CEDEAO). Greffe B (raccord continu 8b→9, 1 seul mouvement sur 2 panels).
- Cordages Liptako RECALÉS sur les centroïdes carte RÉELS (pas positions fixes du composant) = continuité géo.
- Fond Liptako `#EBE0C8` → navy (recolorage, voir palette). Emblèmes : drapeaux réels (image clippée OK ici,
  gros médaillon). "16 septembre 2023" cartouche daté.
- **Faisabilité** : chorégraphie PROUVÉE (code existant), recolorage + recalage cordages À PROTOTYPER.

### Panel 10 — 62.1–70.9s / f1863–f2127 — "l'or du Mali et du Burkina Faso, l'uranium et le pétrole du Niger." → RESOURCES recoloré
- Le sceau AES devient point d'ancrage du bouclier `ResourcesRevealSVG9x16` (fondu direct, même position).
- 3 veines (or/uranium/pétrole) recalées sur centroïdes pays réels. Or Mali/Burkina (f1902), uranium+pétrole
  Niger (f2066). Fond noir héraldique `#080808/#111111` → navy (recolorage lourd, voir palette).
- **Faisabilité** : chorégraphie PROUVÉE, recolorage + recalage veines À PROTOTYPER.

### Panel 11 — 72.3–83.0s / f2169–f2490 — "...un statu quo vieux de SOIXANTE ANS. Reste à savoir si cette nouvelle alliance va tenir..."
- Bouclier AES reste posé, stable. COUNT-UP "60" (`Bebas Neue` ~120px, sobre, pas le donut lourd) monte 0→60
  en spring, cale sur "soixante ans" (f2288-2328).
- "statu quo" (f2242) : trait barré sur le cartouche CEDEAO résiduel (l'ancien ordre tombe).
- "va tenir dans le temps" (f2360+) : pulse final plus LENT (période doublée) = ton suspensif.
- **Faisabilité** : PROUVÉ (spring count-up).

### Panel 12 — 84.0–91.86s / f2520–f2756 — "L'histoire complète... dans la vidéo longue." → CTA
- `CtaCard.tsx` réutilisé SANS modification (rupture de registre ASSUMÉE : le CTA est hors-diégèse, l'audience
  accepte qu'il rompe le registre — reco des 2 agents, à confirmer Aziz). Fondu d'entrée chevauchant 10f la
  fin du panel 11 (seul vrai raccord adouci de la vidéo).
- **Faisabilité** : PROUVÉ, ne pas toucher.

---

## PALETTE RECOLORAGE Liptako/Resources → navy (fusion A+B, greffe A = plus fine)

### Liptako (`LiptakoRevealSVG9x16`)
| Élément | Actuel | Cible navy |
|---|---|---|
| Fond global `#EBE0C8` | crème | navy `#16213a` (transition douce depuis la carte) |
| Grille/hachures fines `#A38D64`/`#2C1E16` | brun | `#33456b` (grille) / `#0b1220` (traits) |
| Traits cadre `#1A1008` | brun-noir | `#0b1220` |
| Or cordages/écussons `#8F6D35→#F1D58A` | or | GARDER (l'or ressort sur navy, aucune couture) |
| Sceau cire `#C82A1D/#8A170E/#4A0A05` | rouge | `#b23a2e/#7d2118` (CRISIS — cohérent : le sceau naît de la teinte de la rupture) |

### Resources (`ResourcesRevealSVG9x16`)
| Élément | Actuel | Cible navy |
|---|---|---|
| Fond bouclier `#080808/#111111/#1f1a16` | noir héraldique | `#16213a→#1a2947→#223258` (bouclier "carte de nuit") |
| Contours durs `#15120e/#25211d` | noir | `#0b1220` (NAVY_DEEP) |
| Or (veine Mali/Burkina) | or | GARDER famille or ; veine → `#e7bd78` (OCRE carte) |
| Vert uranium `#2B4C33/#87C177` | vert néon | désaturer → `#7a9b6e` (parchemin, pas néon) |
| Brun pétrole `#8B6914` | brun | `#5a4a3a` (cohérent gamme nocturne) |
| Cartouches noms pays (3 teintes) | variées | uniformiser (fond sombre + texte clair) |

**Principe** : garder l'or (déjà cohérent), recolorer FONDS SOMBRES (héraldique→navy) et ROUGES (cire→CRISIS).
Recolorage CIBLÉ, pas refonte — préserve les chorégraphies validées.

---

## RYTHME (fusion A+B) — point de vigilance

- **Segment à risque = panels 5-6 (24.5–35.8s, ~11s)** : les 2 agents le pointent indépendamment (points qui
  pulsent + tache rouge qui grandit = le plus statique). Anti-lassitude : ease-in cubique marqué sur l'extension
  du rouge (perception d'accélération), grain/halo/push-in continus, pulse cardiaque des points jamais coupé.
- **Fracture (8b, ~47-50s)** = pivot de rythme pile au milieu (creux d'attention). Bien placé.
- **Variation d'échelle du SUJET** (pas de la caméra) : territoire→région→capitales→symbole. Respiration
  large→étroit→large portée par la composition, pas par un zoom.
- **Densité croissante** : la carte "se remplit" du panel 1 (nu) au 11 (carte+bouclier+count-up) = sensation
  de progression même sans bouger le cadre.

---

## RESTE À FAIRE (ordre de code)
1. Généraliser le socle `ProtoCadrageLibye` en scène complète (12 panels, timing Whisper).
2. Coder les gestes "à prototyper" (lien cassé, masque radial, fracture 3 pays, recalage cordages/veines).
3. Recolorer Liptako/Resources (palette ci-dessus).
4. Intégrer audio + sous-titres mot-par-mot (Whisper prêt).
5. Aplat drapeau Libye (tricolore) — pas de PNG nécessaire.
6. Render full HD + review + upload.
