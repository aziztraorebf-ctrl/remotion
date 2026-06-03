# BRIEF GEMINI — Arsenal templates carte Mapbox Souverain

> À coller dans un prompt Gemini avant de lui demander de composer une scène ou un beat.
> Source de vérité : `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md`. Ne pas inventer de templates hors de cette liste. Noms EXACTS obligatoires.

---

Voici l'arsenal complet de templates carte Mapbox de la chaîne Souverain. Quand tu composes une scène ou un beat, tu DOIS piocher dedans et tu PEUX les combiner.

## Charte (non-négociable)

- Couleurs : navy `#16213a` (océan/fond), gold `#c8a951` (accent/data/pays focus), ivory `#f2ebd9` (texte/voisins 10%).
- Carte vivante : vraie carte Mapbox, drift fluide permanent, altitude sur le pays focus, océan navy, pays voisins ivory 10%.
- Formats : Hybride V (1080×1920, vertical) ET H (1920×1080, horizontal). Toujours penser les deux.
- Render headless via `scripts/render-mapbox.sh <CompId> <out.mp4>`. Compositions Root nommées `<Nom>-<Lieu>-V` / `-H`.

## Templates par catégorie (noms EXACTS)

### HOOKS — ouverture (punch frame 0, 5-30s)
- **KineticMaskSlam** — chiffre/mot géant slamme, carte visible DANS le texte, zoom dans le "0" révèle la carte. Props : `bigText`, `subText`, `focusIso`, `center`, `baseZoom`. Quand : ouvrir sur un chiffre choc.
- **FiberOpticFlagInvade** — frontière tracée en laser puis le drapeau envahit le pays, séquentiel multi-pays. Props : `countries[]` ({iso,geoName,flagCode,at,label}), `center`. Quand : présenter un bloc régional.

### COMBOS — hooks par assemblage (progression narrative)
- **ComboMaskSweep** — chiffre choc → révèle carte → faisceau allume le pays. Props : `bigText`, `subText`, `geoName`, `boundaryIsos`, `label`. Quand : hook fort 3 temps (le plus abouti).
- **ComboSweepDominoFlag** — déclencheur → propagation par vagues → chaque pays reçoit son drapeau. Props : `waves[][]`, `flags{iso:{geoName,code}}`. Quand : dynamique régionale (AES, CEDEAO).
- **ComboFiberAuraPopup** — frontière (où) → onde du point (quoi) → encart donnée relié (combien). Props : `geoName`, `point`, `popupTitle`, `popupValue`. Quand : data storytelling premium.

### INSERTS — couper la carte puis revenir (pendant la narration)
- **MapCutaway** — carte → overlay plein écran → retour carte + target lock. Textes TYPEWRITER. 4 modes (image/stat/reveal/flag). Props : `mode`, `bigText`, `subText`, `image`/`flagCode`, `focusIso`, `inAt`, `outAt`. Quand : appuyer un point sans quitter le sujet (le + réutilisable).
- **RapidFireCountries** — rafale de pays (drapeau+nom, cut sec) puis freeze sur LE pays. Props : `flash[]`, `focus`, `cutFrames`. Quand : énergie d'intro d'un pays.
- **ClassifiedRedactReveal** — écran TOP SECRET + censure qui glisse → révèle carte + target lock. Props : `stampText`, `teaseText`, `focusIso`, `revealAt`. Quand : révélation, ton investigation.

### TERRITOIRE — couleur/drapeau/zone dans les pays (corps de vidéo)
- **MapboxFlagFill** — drapeau OU image clippé(e) dans la silhouette du pays + bichromie. Props : `geoName` (str|[]), `flagCode`/`flagImage`, `bichromie`, `boundaryIsos`. Quand : "le drapeau/la texture remplit le pays".
- **MapboxIsolateZone** — spotlight pays (reste assombri) + zone offshore hachurée + badge + stat. Props : `countryIso`, `zone`, `badge`, `badgeCoord`, `statValue`. Quand : "on isole ce pays et sa zone".
- **SequentialFlagReveal** — pays s'allument avec leur drapeau en séquence, restent allumés. Props : `countries[]`. Quand : "les pays X,Y,Z avec leur drapeau".
- **GlassmorphismGeoPopup** — encarts données (navy translucide + or) reliés au point geo par ligne fine. Props : `points[]` ({coord,at,title,value}), `highlightIso`. Quand : "afficher des chiffres ancrés sur la carte".

### DYNAMIQUES — mouvement de couleur sur les territoires (accroche l'œil)
- **SweepRevealTerritory** — faisceau lumineux traverse le pays et révèle sa couleur (scanner). Props : `geoName`, `boundaryIsos`, `label`, `sweepAt`, `sweepDur`. Quand : révéler un pays avec dynamisme.
- **DominoContagionFill** — couleur contamine les pays de proche en proche par vagues. Props : `waves[][]`, `epicenterIso`, `epicenterLabel`. Quand : propagation d'influence.
- **FiberOpticBorderDraw** — frontière se dessine en laser doré (dasharray + glow) puis fill. Props : `countryIso`, `geoName`, `label`, `drawAt`, `drawDur`. Quand : tracer une frontière/ZEE avec style.

### SÉQUENTIEL / ALLUMAGE
- **SequentialBorderPulse** — frontières s'allument en séquence (synchro syllabe), restent allumées. Props : `sequence[]` ({iso,at,label}), `center`. Quand : "les pays s'allument un par un".
- **LottieGeoAura** — Lottie premium (onde de choc / anneau HUD / flux) ancré à un point geo. Props : `auras[]` ({coord,asset,at,sizeVmin,label}). Quand : effet animé premium sur un site.

### Utilitaires réutilisables (pas des templates autonomes)
- `TypewriterText` — texte qui s'écrit lettre par lettre. À utiliser dans tout overlay/insert.
- `MapboxBase` — `applyGeoAfriqueV5`, `COUNTRY_CENTERS`, `ISO`, `addCountryHighlight`, `CamState`/`lerpCam`.

## Méthode de COMBINAISON

Un combo = une **progression narrative** (pas une superposition). 2-3 effets qui racontent une suite logique :
- **Choc → révélation → focus** : MaskSlam → Sweep = ComboMaskSweep
- **Déclencheur → propagation → identité** : Sweep → Domino → Flag = ComboSweepDominoFlag
- **Où → quoi → combien** : FiberOptic → Aura → Popup = ComboFiberAuraPopup
- Autres pistes : BorderPulse + GlassPopup (allumage + données), FlagFill + LottieAura (identité + effet site), MaskSlam + Domino (choc chiffre + ampleur régionale).

## Structure type d'une vidéo

1. **HOOK (0-10s)** : KineticMaskSlam, FiberOpticFlagInvade, ou un Combo.
2. **CORPS (carte vivante)** : MapboxFlagFill, SweepRevealTerritory, DominoContagionFill, FiberOpticBorderDraw, MapboxIsolateZone, SequentialFlagReveal.
3. **INSERTS (couper/revenir)** : MapCutaway (4 modes) pour appuyer un point ou montrer une donnée/portrait.
4. **DATA sur carte** : GlassmorphismGeoPopup, SequentialBorderPulse, LottieGeoAura.

## Consigne finale

Quand on te demande de composer un beat, réponds avec :
- **Quel template par moment** (timeline : 0-Xs → template, X-Ys → template, etc.).
- **Quels réglages** (pays/ISO, chiffres, textes — remplis les props clés de chaque template choisi).
- **Au moins 1 combo original** (une progression narrative inédite assemblée depuis l'arsenal, en respectant la règle choc→révélation→focus ou équivalent).
