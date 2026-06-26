# Atlas — Règles de production (consolidé)
> Fusion de : feedback_atlas-non-negotiable-rules, feedback_atlas-technique-vs-visuel, feedback_atlas-action-geo-vs-lieu-geo, feedback_inserts-rule-hannibal, feedback_atlas-spotlight-insert-pattern, feedback_atlas-cartouches-top-only, feedback_atlas-walk-cycle-pattern, feedback_lecons-shaka-zulu-pause
> Mis à jour : 2026-05-08

---

## SECTION 1 — 13 Règles non-négociables (STOP si violation)

> Issues directement de fiascos : Shaka Zulu (pause forcée), Beat 1 Ghana v1/v2 (zoom raté, données géo approximées, Lottie trop pauvre, scène statique 10s).

**RÈGLE 1 — Fork avant reconstruire** : INTERDIT d'écrire un nouveau composant Atlas si un équivalent existe dans Mansa Moussa. Workflow : lire `ATLAS-COMPOSANTS.md` → lire `atlas-components.tsx` → forker si équivalent existe.

**RÈGLE 2 — SVG racine unique 720×1280** : une scène = UN SEUL `<svg viewBox="0 0 720 1280" preserveAspectRatio="xMidYMid slice">`. Toutes les couches en `<g>`. INTERDIT : multiples `<svg>` imbriqués, mélange d'unités.

**RÈGLE 3 — Caméra via props AtlasMercator UNIQUEMENT** : INTERDIT d'écrire le transform de la carte à la main. Toujours passer par `scale/driftX/driftY/centerOffsetX/Y/rotation`. Formule focus POI : `camOffX = (targetX - 360) * 0.65`.

**RÈGLE 4 — Vérification géographique systématique avant de coder** : POI → Wikipedia exact. Polygone empire → croisé avec Britannica/Euratlas. Routes → plausibilité historique. Écart > 50 km → corriger avant de coder.

**RÈGLE 5 — Lottie pour primitives géométriques UNIQUEMENT** : ring pulse, halo, glow, compteur abstrait. INTERDIT pour lingot/sceau/balance/personnage/drapeau → utiliser PixelLab.

**RÈGLE 6 — Sous-titres karaoke OBLIGATOIRES** : toute scène avec narration DOIT inclure `<AtlasV2Subtitles />` ou équivalent forké. Checklist pre-render.

**RÈGLE 7 — Inserts plein écran pour data viz** : chiffre choc / comparaison / objet symbolique → insert plein écran (fond noir + dataviz centré). INTERDIT : mini-objet posé à droite de la carte.

**RÈGLE 8 — Mouvement permanent** : INTERDIT scène statique > 2s. Sources obligatoires (au moins 2 simultanées) : drift Ken Burns, tilt respiratoire, pulse marker, apparition/disparition labels, pan caméra, zoom continu.

**RÈGLE 9 — Validation visuelle Claude AVANT Aziz** : Read l'image/vidéo → identifier défauts → corriger AVANT de présenter. Ne jamais dire "voici le render" sans avoir regardé.

**RÈGLE 10 — TECHNIQUE forker / VISUEL adapter** : voir Section 2.

**RÈGLE 11 — Mini-render après chaque modif majeure** : `npx remotion render <Composition> out/<projet>/<scene>-<n>.mp4 --concurrency=2` puis Read.

**RÈGLE 12 — Cleanup renders après validation** : dès qu'Aziz valide, supprimer toutes les versions de test. Une seule vérité dans `out/`.

**RÈGLE 13 — Zéro approximation géographique** : INTERDIT polygone "ça ressemble", coordonnées inventées, routes "qui semblent plausibles". Si approximation inévitable → déclarer à Aziz AVANT de coder.

---

## SECTION 2 — TECHNIQUE (forker) vs VISUEL (adapter par épisode)

### TECHNIQUE = forker tel quel depuis Mansa Moussa V2
- Architecture SVG racine 720×1280 preserveAspectRatio
- Composants `_shared/` (AtlasMercator, AtlasGlobe, AtlasCartouche, AtlasLabel, AtlasPulseMarker, AtlasCaravane, AtlasEmpire, AtlasDefs, useSpringCamera)
- Spring configs : SNAP_CONFIG (damping 80 stiffness 400), POP_CONFIG, spring entrance (damping 14, stiffness 200)
- Transform order caméra : translate→rotate→scale→skew→translate-back (INTERDIT de modifier)
- Ken Burns drift (sin*0.014, cos*0.011), tilt respiratoire (sin*0.04*2)
- Pattern sous-titres karaoke (position, buildPhrases, fade formule)
- Inserts plein écran (structure AtlasV2InsertPieChart, BarChart, LineChart)

### VISUEL = adapter par épisode
- Palette couleurs (GHANA_PALETTE, SHAKA_PALETTE, etc.)
- Couleur hachures empire (Mali tricolore pour Mansa, or/bordeaux pour Ghana, etc.)
- Couleur fond/bordure cartouches
- Couleur highlight karaoke (couleur signature épisode)
- Assets PixelLab propres au sujet
- Couleur background (peut s'éloigner du dégradé Mansa)

---

## SECTION 3 — Action geo vs Lieu geo (deux patterns distincts)

> Leçon Hannibal Beat 2 : éléphants de 3mm sur carte macro = illisible.

### Type 1 — Lieu geo
Sujet = UN ENDROIT (ville, empire, marché, cour royale). La carte EST le sujet.
Pattern : zoom fort sur 1 POI via svgToComp() + camera-track + spotlight insert.
Sprites : illustrent le lieu, position fixe ou déplacement lent.

### Type 2 — Action geo
Sujet = UN MOUVEMENT / franchissement / bataille. La carte est le CONTEXTE.
Pattern : insert plein écran + background Gemini/PixelLab + sprites CSS en grand (min 120px).
Carte SVG uniquement pour contexte geo (~5s), puis coupe.

**Arbre de décision :**
- Montrer un endroit → Type 1 Lieu geo → carte SVG + svgToComp()
- Montrer un mouvement/action → Type 2 Action geo → insert plein écran

**Critères rapides :**
- Peut-on voir l'action à zoom 2.5x ? Non → action geo
- Les sprites sont-ils narratifs (combat, traversée) ? Oui → action geo
- L'échelle des sprites est-elle critique à la compréhension ? Oui → action geo

---

## SECTION 4 — Quand utiliser un insert (règle arbitrage)

Insert plein écran ou overlay = UNIQUEMENT si :
1. Scène impossible en 2D SVG (intérieur, action complexe, vinaigre sur rocher)
2. Briser monotonie sur beat long — max 1-2 inserts par beat, jamais consécutifs

Si une scène peut être animée sur la carte de manière convaincante → PAS d'insert.
PixelLab > Gemini pour les inserts : asset animé > illustration statique.

---

## SECTION 5 — Pattern Spotlight Insert (3e mode)

Mode intermédiaire entre overlay simple et insert plein écran. Inventé et validé Empire Ghana Beat 1 v4.

**Concept :** carte reste visible mais dim 0.55 + cartouche centré ornementé + asset PixelLab + texte court. Continuité narrative préservée + focus visuel fort.

**Quand utiliser :** symbolisation échange (sel ⇌ or), objet symbolique (couronne/sceau), comparaison visuelle 2 éléments.
**Ne pas utiliser pour :** data viz complexe (→ fullscreen), citation longue, bascule narrative majeure.

**Paramètres techniques :**
- Dim background : opacité 0.55 plateau
- Entrance : 8 frames | Plateau : 60-80 frames | Exit : 12 frames | Total : ~80-100 frames
- Spring entrance : `{damping: 16, stiffness: 100}`
- Halo radial doré derrière le cartouche
- Boîte parchemin double bordure

---

## SECTION 6 — Règle cartouches TOP HALF (y ≤ 320, selon ATLAS-PLAYBOOK §1 qui prime)

> Règle absolue. Bottom half réservé aux sous-titres karaoke TikTok.
> ⚠️ Mise à jour : la limite est y ≤ 320 (ATLAS-PLAYBOOK §1 prime sur l'ancienne valeur y < 640). 470 = limite basse exceptionnelle tolérée uniquement pour cartouche tertiaire.

**Sur viewBox 720×1280 :**
- Top zone (y 0→320) : overlays textuels principaux (cartouches, labels, encadrés, dates, stats)
- Zone intermédiaire (y 320→640) : réservée — pas de cartouche sauf exception tertiaire justifiée (470 max)
- Bottom half (y 640→1280) : sous-titres karaoke TikTok uniquement

**Positions canoniques :**
- Cartouche principal : y = 170
- Cartouche secondaire (dates/sous-info) : y = 320
- Cartouche tertiaire (stat) : y = 470 (limite basse exceptionnelle tolérée)
- Spotlight insert centré : y = 640 (exception acceptée car temporaire ~3s + dim background)
- Sous-titres karaoke : y = 1130-1180

Exception spotlight insert : acceptable car temporaire et dim background masque la collision.

---

## SECTION 7 — Walk cycle PixelLab sur carte Atlas

> Construit sur ~4 sessions Shaka Zulu + Mansa Moussa. Chaque règle = bug réel.

**Paramètres canoniques sprites :**
- Taille : 64px (canon, ne pas changer)
- Pas d'ombre, pas de hop statique
- Zoom caméra pendant walk : 2.5x
- Pull-back automatique à l'arrivée (isArrived flag)
- flipX: true quand déplacement vers la gauche
- lerpColor territoire pendant le walk : OR_VIF → BORDEAUX

**Timing walk cycle latéral :**
- Ne PAS déclencher au frame 0 — déclencher quand la corne descend vers le guerrier central
- Timing recommandé : ~frame 240-300
- Anti-pattern : walk cycle à frame 0 = guerriers marchent dans le vide

**Pièges PixelLab critiques :**
- `archive/<perso>-east/frame_XXX.png` = 6 designs alternatifs, PAS un walk cycle. Boucler = effet "palpitation" désastreux.
- Vrais walk cycles = `characters/<perso>/animations/<animation-id>/<direction>/frame_XXX.png`
- Avant boucle : Read 3 frames espacées et vérifier continuité visuellement.

---

## SECTION 8 — Critères sujet Atlas-natif vs Seedance

5 critères. Un sujet Atlas-natif en a ≥ 4/5 :
1. Territoire avec frontières changeantes visuellement riches
2. Routes commerciales/militaires avec déplacement
3. Données cartographiables (empire, ville, ressource)
4. Données économiques/historiques chiffrées
5. Mouvement géographique comme arc narratif

Mansa Moussa : 5/5. Hannibal : 4/5. Shaka Zulu : 1/5 (sujet Seedance, pas Atlas).

---

## SECTION 9 — Philosophie Atlas pur : la carte est la scène (CANON LOCKÉ 2026-05-13)

> Validé par Aziz lors de l'exploration Yaa Asantewaa. Cette philosophie prime sur toutes les autres règles d'insert.
> S'applique à Atlas pur. Pour Atlas-hybride contemporain → préférer format Souverain (voir EXPLORATION-2026-05-13 dans episodes/souverain-silicon-savannah/).

### Principe fondamental

**Atlas = ciné-théâtre cartographique.** La carte n'est PAS un fond. C'est la scène de théâtre où les personnages jouent.

Les personnages PixelLab **entrent**, **traversent**, **s'arrêtent**, **interagissent** sur la carte. La voix-off **commente** ce qui se passe. La caméra **zoome**, **suit**, **recule**. Les inserts arrivent **uniquement** pour les concepts abstraits impossibles à mettre en scène.

**Pas de carte visible = pas Atlas. Inserts qui volent la carte = pas Atlas non plus.**

### Hiérarchie du temps écran (règle 80/20+)

| Élément | Rôle | % temps écran cible |
|---|---|---|
| **Carte** (Mercator, Globe, Mapbox historique) | Scène de théâtre — toujours visible ou en arrière-plan | **80-90%** |
| **Personnages PixelLab** (walk + interactions) | Acteurs — portent l'action | 70-80% |
| **Objets PixelLab** (Trône, sac, lance, sceau) | Props — enjeu tangible | 30-50% (selon scène) |
| **Caméra** (zoom, pan, follow, dolly) | Mise en scène — guide le regard | continu |
| **Voix-off** | Narrateur — commente, ne décrit pas | continu |
| **Inserts plein écran** | Exception — chiffre choc, date abstraite, citation impossible à dramatiser | **<10-15%** maximum |
| **Inserts overlay discrets** (label, cartouche, sous-titre stylisé, StatGauge HUD) | Annotation subordonnée — sans voler la scène | continu mais petit |

**Tolérance** : on peut dépasser 10% d'inserts plein écran si ça sert le récit. Mais c'est l'exception, pas la règle. Les inserts ne portent jamais le récit en premier.

### Ordre de conception d'un beat Atlas (à appliquer dans l'ordre)

Quand on conçoit un nouveau beat, on répond aux 5 questions DANS CET ORDRE avant de proposer un insert :

1. **Comment ça se passe sur la carte ?** — qu'est-ce que le viewer voit géographiquement
2. **Quels personnages PixelLab portent l'action ?** — qui marche, qui s'arrête, qui parle
3. **Quel mouvement caméra met en scène ?** — zoom, pan, follow, pull-back
4. **Quel objet PixelLab est l'enjeu ?** — Trône, lance, sac d'or, sceau
5. **Quelle voix-off accompagne ?** — narrateur commente, ne décrit jamais ce qu'on voit

**Puis seulement** :

6. **Quel insert est strictement nécessaire ?** — uniquement pour ce qui ne peut PAS être mis en scène

Si un insert est proposé sans avoir d'abord répondu aux questions 1-5, **rejet automatique**.

### Anti-pattern à reconnaître (réflexe Souverain à bloquer)

Le réflexe Souverain consiste à **empiler des inserts pour "dynamiser"** un beat. C'est anti-canon Atlas. Symptômes :
- Plus de 2 inserts plein écran par beat
- KraftCard plein écran pour une citation qui pourrait être un sous-titre stylisé
- FocusBubble + AtlasCartouche + sous-titre + label simultanés
- Inserts qui se succèdent au lieu que les personnages portent l'action

Quand un agent (ou Claude principal) tombe dans ce pattern, **STOP** et revenir aux questions 1-5.

### Exemple canon — Beat "discours" Yaa Asantewaa (validé)

**Mauvaise version (Souverain-réflexe)** :
- KraftCard plein écran avec citation
- FocusBubble zoom Yaa
- AtlasCartouche source
- → 3 inserts qui interrompent la carte. La carte disparaît. Anti-Atlas.

**Bonne version (Atlas pur)** :
- Vue carte Kumasi, salle du conseil au centre
- 6-7 chefs Ashanti masculins PixelLab autour d'un tabouret (Trône d'Or au centre, objet PixelLab)
- Yaa Asantewaa entre par la gauche (walk cycle)
- Elle s'avance, s'arrête à côté du tabouret
- Caméra zoome légèrement
- Animation : elle se tourne vers les hommes, pointe le doigt
- Voix-off raconte le discours pendant le mouvement
- À la fin : la citation apparaît brièvement en sous-titre stylisé bas écran + petit cartouche source bas-droit
- → La carte reste maîtresse. Les personnages portent l'action. Insert subordonné.

### Inserts autorisés pour un Atlas pur 90s (budget total)

Sur un Short Atlas pur 90s :
- **Inserts plein écran** : 0-2 maximum, total ~5-10 secondes max (~10%)
- **Inserts overlay discrets** : illimités tant qu'ils restent petits et subordonnés (labels, cartouches, StatGauge HUD, sous-titres stylisés)
- **AtlasGlobeHook** d'ouverture : autorisé (canon Atlas, pas un insert au sens strict)
- **BigStat / BrutalHeadline final** : 1 acceptable comme chute (1-2 secondes)

### Quand Atlas pur n'est PAS le bon format

Si un sujet demande naturellement beaucoup d'inserts data, comparaisons multi-pays, ou ne peut pas être raconté sur une carte avec des personnages mobiles → **ce n'est pas Atlas pur, c'est Souverain hybride**.

Cas testés :
- Silicon Savannah (M-Pesa Kenya) → Souverain hybride, pas Atlas
- Berlin Conference 1884-85 → ni Atlas (14 personnages statiques) ni Souverain pur → reconsidérer
- Yaa Asantewaa → Atlas pur ✅ (héros mobile + voyage + objet sacré + carte historique)
- Mansa Moussa → Atlas pur ✅
- Empire Ghana → Atlas pur ✅
- Hannibal → Atlas pur ✅

### Pour les agents (visual-producer, remotion-composer)

Quand un agent est invoqué sur un projet Atlas pur, il doit :
1. Lire cette section 9 EN PREMIER
2. Vérifier le ratio carte/inserts du beat proposé
3. Si >15% inserts plein écran → flag à Claude principal AVANT de coder
4. Si une scène pourrait être animée sur la carte mais qu'un insert est proposé → flag à Claude principal AVANT de coder

---

## Checklist pre-coding scène Atlas

```
[ ] Lu ATLAS-COMPOSANTS.md
[ ] Coordonnées POI vérifiées vs Wikipedia
[ ] Composants _shared identifiés (pas de réécriture)
[ ] SVG racine unique 720×1280 preserveAspectRatio
[ ] Caméra via props AtlasMercator
[ ] Sous-titres karaoke prévus
[ ] Au moins 2 sources de mouvement simultanées
[ ] Aucune scène statique > 2s
[ ] Data viz/objet symbolique → insert plein écran (pas overlay)
[ ] Lingot/sceau/objet réel → PixelLab (pas Lottie)
[ ] Mini-render après chaque modif majeure
[ ] Tous les overlays textuels en y ≤ 320 (limite basse exceptionnelle : 470)
[ ] Type 1 Lieu geo ou Type 2 Action geo → bon pattern sélectionné
```
