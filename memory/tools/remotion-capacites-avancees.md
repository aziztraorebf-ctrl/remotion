# Remotion — Capacités avancées & récits émotifs

> Fichier de référence permanent. Mis à jour : 2026-05-02.
> Sources : recherche Last30Days + audit skills remotion-best-practices (37 rules).
> À enrichir à chaque nouvelle découverte ou projet.

---

## 1. Capacités qu'on N'utilise pas encore

### @remotion/lottie — animations gratuites LottieFiles
- Importer n'importe quelle animation LottieFiles (milliers d'icônes gratuites) comme composant React
- Utile pour : icônes de légende cartographique animées, symboles bataille, flèches, indicateurs
- Synchronisable avec `useCurrentFrame()` via `playbackRate`
- Installation : `npx remotion add @remotion/lottie`
- Pattern :
```tsx
import { Lottie } from "@remotion/lottie";
// fetch JSON + delayRender/continueRender + <Lottie animationData={data} />
```
- **Quand l'utiliser** : icônes de légende sur carte Atlas, symboles récurrents entre épisodes

### @remotion/light-leaks — transitions organiques WebGL
- Effet de fuite de lumière WebGL entre deux scènes
- Via `<TransitionSeries.Overlay>` ou standalone
- Props : `seed` (pattern), `hueShift` (0=orange, 120=vert, 240=bleu)
- **Quand l'utiliser** : transition entre registres émotionnels (ex: S3 expansion → S4 Nandi deuil)
- Fonctionne depuis Remotion 4.0.415 (on est en 4.0.452 ✅)

### @remotion/skia — shaders GPU sur SVG
- Shaders GLSL appliqués sur zones SVG : heat map animée, brume territoire, glow avancé
- `--gl=angle` obligatoire pour headless (sinon CPU-only = très lent)
- **Quand l'utiliser** : effets atmosphériques sur carte (brume sahélienne, chaleur désert)
- Pas encore testé sur notre pipeline — à valider avant usage production

### visualizeAudio() — réactivité à la narration
- `useWindowedAudioData()` + `visualizeAudio()` → fréquences en temps réel
- Permet d'animer des éléments en réaction directe à la voix off (pas juste aux timestamps)
- `bassIntensity` pour effets bass-réactifs (halo qui pulse sur les mots forts)
- **Potentiel Atlas** : contour carte qui pulse en intensité avec la narration

### TransitionSeries.Overlay — sans couper la timeline
- Différent de TransitionSeries.Transition : n'affecte pas la durée totale
- Parfait pour des effets au cut point sans recalculer les frames
- Light leak, flash, flash blanc/noir au moment exact de la mort de Nandi

### text-animations — typewriter natif
- Slicing de string `text.slice(0, Math.floor(frame / speed))` pour typewriter
- JAMAIS per-character opacity (anti-pattern officiel)
- Word highlight animé (effet surligneur) disponible dans les assets du skill

---

## 2. Remotion v5.0 — Ce qui change (sorti décembre 2025)

> On est en v4.0.452. Migration non-urgente pour Shaka. Obligatoire avant série suivante.

### Breaking changes qui nous concernent
| Changement | Impact sur nous |
|-----------|----------------|
| `renderMediaOnLambda()` overwrite = `true` par défaut | Notre pipeline Vercel — vérifier avant migration |
| Node minimum 18.0.0 | Probablement OK (on est en Node 24) |
| `optimizeFor: "speed"` devient le défaut audio | Plus besoin de le spécifier |
| Lambda disk par défaut 10240 MB (était 2048) | Renders plus fiables sur longues compositions |
| Plusieurs fonctions Lambda supprimées | Vérifier liste complète avant migration |

### Nouveautés utiles v5
- `@remotion/media-parser` déprécié → migration vers Mediabunny recommandée
- Template "Prompt to Motion Graphics SaaS" officiel (génération vidéo AI bout-en-bout)

---

## 3. Skills disponibles — Audit complet

### Skills installés dans le projet (`/Workspace/remotion/.claude/skills/`)
| Skill | Usage |
|-------|-------|
| `remotion-best-practices` | 37 rules (voir ci-dessous) |
| `checkpoint` | Vérification avant "c'est fait" |

(`batch-short-production`, `video-production`, `youtube-scriptwriting` supprimés 2026-08-01 — morts
depuis mars, remplacés par `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md` + `DOCTRINE-SCRIPT-UNIFIEE.md`)

### Skills globaux (`~/.claude/skills/remotion-best-practices/rules/`) — 37 fichiers
Fichiers clés **qu'on n'exploite pas encore** :
- `lottie.md` — LottieFiles integration
- `light-leaks.md` — transitions WebGL organiques
- `audio-visualization.md` — réactivité audio temps réel
- `text-animations.md` — typewriter, word highlight
- `3d.md` — 3D dans Remotion
- `gifs.md` — GIFs animés comme assets
- `transparent-videos.md` — vidéos avec canal alpha (webm)
- `silence-detection.md` — détecter les silences audio programmatiquement
- `sfx.md` — sound effects intégrés

Fichiers qu'on utilise déjà correctement :
- `maps.md` (d3-geo, Mapbox) ✅
- `animations.md` (spring, interpolate) ✅
- `transitions.md` (TransitionSeries) — partiellement
- `audio.md` (Audio, Sequence sync) ✅
- `fonts.md` (Google Fonts) ✅
- `sequencing.md` (Sequence, premountFor) — partiellement

### Réponse à la question "les utilisez-vous automatiquement ?"
**Oui pour les skills globaux** : le CLAUDE.md du projet référence `remotion-best-practices/rules/maps.md` et `remotion-video-toolkit/rules/rendering.md` dans le tableau de routage — ils sont chargés quand Aziz parle de Remotion/carte/render.
**Mais** : les 37 rules ne sont pas toutes consultées systématiquement. Seulement celles référencées dans le tableau de routage. Les autres (lottie, light-leaks, audio-viz, text-animations) ne sont pas chargées automatiquement — il faut les consulter explicitement.

---

## 4. Philosophie émotion dans documentaires animés

> Synthèse de la recherche mai 2026. Applicable à tous les épisodes Atlas.

### Règle centrale : soustraction, pas addition
Les moments émotionnels forts fonctionnent par **retrait**, pas par accumulation d'effets.
- Johnny Harris : coupe la musique 1-2s avant la frappe émotionnelle
- Undertale : fond noir + sprite statique + texte seul = plus fort que l'action
- Kurzgesagt : désaturation progressive de la palette (chaud → froid = deuil universel)
- Wendover : les animations de carte **s'arrêtent** aux moments clés. L'arrêt = rupture.

**Conséquence** : après chaque pic émotionnel, prévoir 3-4s de silence visuel.

### Techniques typographie émotionnelle (applicables Remotion)
| Technique | Effet | Implémentation |
|-----------|-------|----------------|
| Scale + hold | Mot clé monte à 150-200%, puis reste immobile | `interpolate()` + spring `{damping:200}` |
| Cut to black sur mot | Violence de la coupure = impact | `opacity: frame === deathFrame ? 0 : 1` |
| Lettre par lettre dispersée | Dissolution, impossibilité de saisir | `Array.from(word).map((c, i) => ...)` avec delay par index |
| Typographie multi-couches | Oppression, surcharge | Z-index différents, lisibilité réduite intentionnelle |
| Couleur qui envahit | Propagation émotionnelle | `interpolate()` sur backgroundColor |

### Techniques abstraites géométriques
| Technique | Application Atlas |
|-----------|-----------------|
| Grille de points qui s'éteignent | 4000 morts → 100 points, chacun = 40 personnes |
| Cercle spring `{damping:8}` | "Respire" = vivant. S'effondre sans rebond = mort |
| Formes qui rétrécissent vers 0 | Disparition non-littérale |
| Désaturation progressive | Sprite existant → deuil via CSS filter |

### Pixel art et émotion
- Réduire le framerate de l'animation : 8fps → 2fps = personnage "brisé"
- Supprimer la boucle : rester sur la dernière frame = figé dans la douleur
- `filter: grayscale(X%) brightness(Y%)` interpolé = désaturation sans nouveau sprite
- FlipX statique sur frame figée = personnage effondré (réutilise walk cycle existant)

---

## 5. Idées directement applicables à Atlas (priorisées)

### Priorité haute — S4 Nandi et futures scènes émotives
1. **Grille de points extinction** pour chiffres de masse (morts, personnes) — plus viscéral que le chiffre seul
2. **Sprite désaturation** — réutiliser un sprite existant avec filtre CSS pour signifier le deuil
3. **Silence visuel 3-4s** après pic émotionnel — fond quasi-vide + un seul élément
4. **Light leak** au moment de rupture émotionnelle (mort, défaite) via `@remotion/light-leaks`
5. **visualizeAudio()** pour faire pulser des éléments en réaction directe à la narration

### Priorité moyenne — Prochains épisodes Atlas
6. **LottieFiles** pour icônes de légende cartographique animées (zéro coût)
7. **word highlight** animé sur termes clés (surligneur en temps réel sur la narration)
8. **TransitionSeries.Overlay** systématique entre segments (sans recalculer les durées)

### Histoires Atlas idéales après Shaka (territoire + mouvement)
| Figure | Difficulté | Raison |
|--------|-----------|--------|
| Hannibal Barca | ★ Facile | Trajet pur : Carthage → Alpes → Rome. La carte IS le propos |
| Empire du Ghana (routes or) | ★ Facile | Corridors commerciaux trans-sahariens = flux animés |
| Sundiata Keïta | ★★ Moyen | Exil + retour + reconquête = mouvement géographique clair |
| Menelik II / Adoua 1896 | ★★ Moyen | Afrique colonisée vs territoire résistant = contraste visuel fort |
