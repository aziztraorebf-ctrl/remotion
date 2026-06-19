# STORYBOARD PREMIUM — SCÈNE 1 V3 (refonte post DA-BRIEF-GATE 3 modèles)

> Synthèse extractive TRACÉE de la DA-BRIEF-GATE (Gemini + Kimi + DeepSeek, sources `/tmp/da-refs/da-senegal-scene1-premium-*.md`)
> + 4 critiques Aziz + doctrine. Remplace `STORYBOARD-SCENE-1.md` (1er jet trop sage). Parti-pris Aziz : intro 32s = Remotion PUR.
> Convergence FORTE des 3 modèles → diagnostic solide. Format : [G]=Gemini [K]=Kimi [D]=DeepSeek [moi]=Claude.

## VERDICT TRANSVERSAL (les 3 convergent)
Premier jet = "PowerPoint animé / prototype" [G][D]. Script bon, image en retard. 6 péchés nommés par les 3 :
1. **Intro 32s = Remotion PUR** (pas la carte). Les 3 le confirment : abstrait → motion plein écran, continuité du hook scène 0.
2. **Géo-ancrage `map.project()` chaque frame** — fix du drift (les 3 insistent, [G] "erreur n°1 des cartes web").
3. **Combattre le gris** : remplir le Sénégal (WavingFlagFill / bichromie Navy-Or), voisins en spotlight sombre (opacity 0.3).
4. **Différencier les 3 gisements** (3 histoires ≠ 3× la même anim) — chacun sa chorégraphie + icône Lucide.
5. **60% = cinétique/spatial** (blocs ou flux qui se partagent), PAS un chiffre nu.
6. **Anti AI-slop** : easing `spring()` (pas opacity linéaire), icônes Lucide (pas dots), charte Navy/Or/Ivoire, hiérarchie typo.

---

## STORYBOARD PAR MOMENT (intention → geste → source)

### A — INTRO "LE DUEL DES RÉCITS" (0–32s) · REMOTION PUR plein écran
- **INTENTION** : *déconstruire* 2 mythes opposés pour créer le vide où la "vérité" s'installera. Le spectateur doit
  SENTIR le conflit avant de comprendre [K]. PAS "expliquer" mais "déconstruire" [D].
- **GESTE** [G+K+D convergent] : continuité STRICTE du hook scène 0 (fond parchemin, trait qui se dessine). 2 masses
  typographiques géantes : **« MALÉDICTION »** (sombre, texture pétrole craquelée, à gauche) vs **« MIRACLE »** (doré
  lumineux, à droite). Elles se construisent/se heurtent. Sur "la réalité se joue AILLEURS" → elles **se déchirent/
  explosent** [D] (rappel geste fracture du hook), et la caméra **zoome dans l'espace négatif ENTRE les 2 mots** [G] →
  déchirure/fondu vers la mer Mapbox → on atterrit au large de Dakar. **AUCUN cut sec** (transition tenue = le "pont").
- **[moi]** : on a `KineticMaskSlam`/`ComboMaskSweep` pour le slam typo. Le "zoom dans l'espace négatif → carte" EST
  notre pont carte↔Remotion. Réutilise la matière parchemin + filtres grain de la scène 0 (continuité réelle).

### B — SANGOMAR (32–48s) · CARTE · "le pétrole NATIONAL, fierté"
- **INTENTION** : 1er vrai LIEU, l'ancrage national, la souveraineté partielle (Petrosen 18%).
- **GESTE** [G+K+D] : à l'arrivée, le Sénégal **se remplit de son drapeau** (`WavingFlagFill`, ondulant = poids massif
  vs gris) [G][K][D]. Zone offshore **hachurée** (`MapboxIsolateZone`) [G]. Gisement = PAS un dot : **plateforme
  pétrolière** (SVG stylisé [D] ou icône Lucide `Droplet`/`Factory` avec spring) [G][K][D]. Trait laser ancré
  gisement→Dakar (court-circuit national) [K][D]. Cartouche **`GlassmorphismGeoPopup` ANCRÉ** : Woodside (drapeau AU) +
  Petrosen **18% qui compte up** (spring) [G][K][D]. Source en mono (Woodside Report 2024) [K].
- **[moi]** : le donut/18% montre le rapport de force au lieu de l'écrire (épure). Voisins (Mauritanie/Gambie/GB) en
  opacity 0.3 = spotlight [G][D].

### C — GTA (48–65s) · CARTE · "le gaz PARTAGÉ, export mondial"
- **INTENTION** : interdépendance géopolitique, projection mondiale (remplacer le gaz russe).
- **GESTE** [G+K+D] : caméra translate vers le NORD. Frontière maritime SN/MR **tracée au laser doré**
  (`FiberOpticBorderDraw`) = la ressource est À CHEVAL [G][K][D]. Gisement GTA (icône Lucide `Flame`, couleur gaz
  bleu/cyan) [G][D]. Export = **`GeoFlowConnection V2`** : flux dorés ÉPAIS animés (dashoffset+glow+spring), sprite
  navire/avion orienté sur la tangente — PAS les arcs pointillés tristes actuels [G][K][D]. DÉZOOM : les flux sortent
  vers Europe + Asie, **et ces destinations s'allument** (UE bleu nuit, Asie rouge sombre) [K][D].
- **[moi]** : ⚠️ `GeoFlowConnection V2` n'existe pas encore (backlog NEXT-ACTION). À CODER (lignes/arcs entre points
  geo, headless-safe, map.project). C'est le composant manquant n°1.

### D — YAKAAR-TERANGA (65–80s) · CARTE · "le MYSTÈRE en attente" (OPEN LOOP)
- **INTENTION** : tension, convoitise, open loop puissant ("la plus grosse surprise"). Le spectateur doit se demander
  "MAIS QUOI ?!" et rester [D].
- **GESTE** [G+K+D] : contraste TOTAL avec B et C. Caméra replonge sur la côte. Gisement = **halo qui RESPIRE**
  (pulse radar lent, `PulsingRegionFill` offshore / `LottieGeoAura`) [G][K][D]. **AUCUN cartouche-acteur** (personne
  ne l'opère) [D]. "plusieurs capitales le regardent" → icônes Lucide **`Eye`** aux bords (Paris/Londres/Pékin) +
  fines lignes de ciblage qui CONVERGENT vers le point [G][K][D]. Tension pure, pas de texte [D].
- **[moi]** : ferme l'open loop ouvert ici → rappelé scène 5 (Kosmos/Pékin) et scène 7. Les "yeux" = idée forte des 3.

### E — LE 60% (80–100s) · REMOTION (overlay ancré, carte assombrie) · "le partage"
- **INTENTION** : relativiser (ni scandale ni jackpot), frustrer la conclusion simple, préparer "ce qui décide vraiment".
- **GESTE** [G+K+D] : `MapCutaway` mode reveal (carte s'assombrit, focus centre, PAS cut sec) [G][K][D]. Le 60% n'est
  PAS un chiffre nu : **partage cinétique** — 2 options convergentes :
  - [G] 10 blocs SVG (100% richesse) tombent → 6 blocs (60%) glissent gauche sous "SÉNÉGAL"+drapeau, 4 blocs (40%)
    droite sous "MULTINATIONALES". Montre littéralement la part.
  - [K][D] flux monétaire qui se DIVISE (60% Sénégal / 30% opérateurs / 10% coûts), puis camembert → **zoom dans le
    centre révèle la scène suivante** (MapCutaway).
  Sous-texte "moyenne des émergents" dégonfle le chiffre immédiatement [K][D]. Sur "ne dit rien" → englouti par
  l'ombre / se fragmente [G][D] = pont scène 2.
- **[moi]** : préférer les BLOCS [G] (plus lisible/sobre que le Sankey, risque de surcharge). Charte or métallique
  (gradient), pas jaune CSS [K].

---

## COMPOSANTS À UTILISER / À CODER
**Existants (catalogue carte-vivante)** : WavingFlagFill, MapboxFlagFill, FlagFillStatic (voisins), MapboxIsolateZone
(zone hachurée), FiberOpticBorderDraw (frontière laser), GlassmorphismGeoPopup (cartouche ANCRÉ map.project),
MapCutaway (transition reveal), PulsingRegionFill (Yakaar), KineticMaskSlam/ComboMaskSweep (intro).
**À CODER** : ⚠️ `GeoFlowConnection V2` (flux export épais animés — composant manquant, backlog confirmé). Icônes Lucide
animées (Droplet/Flame/Eye) en marqueurs. Blocs SVG partage 60%.
**Fix technique transverse** : géo-ancrage `map.project([lon,lat])` CHAQUE FRAME pour dots+cartouches (tue le drift).

## ORDRE DE CODE PROPOSÉ (par blocs, valider à chaque étape — éviter de se noyer)
1. **Intro 32s Remotion pur** (le duel) — gain immédiat, indépendant de la carte. Réutilise matière hook scène 0.
2. **Fix géo-ancrage** + Sangomar premium (drapeau + cartouche ancré + icône) — pose le langage des gisements.
3. **GeoFlowConnection V2** + GTA (frontière laser + flux + destinations).
4. **Yakaar** (halo + yeux) + **60% blocs**.
Chaque bloc rendu+validé Aziz avant le suivant.

## SOURCES (traçabilité DA-BRIEF-GATE)
- Gemini : `/tmp/da-refs/da-senegal-scene1-premium-gemini.md` → DA-SCENE-1-gemini.md (1er passage) + ce 2e.
- Kimi : `/tmp/da-refs/da-senegal-scene1-premium-kimi.md`
- DeepSeek : `/tmp/da-refs/da-senegal-scene1-premium-deepseek.md`
