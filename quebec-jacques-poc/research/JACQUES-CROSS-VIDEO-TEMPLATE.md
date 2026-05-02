# Jacques a dit — Template définitif (cross-video analysis)
> 2026-04-27 | 2 vidéos analysées via Gemini 3 Flash : Croatie (210s mono-pays) + Maroc/Algérie (356s comparatif)

## Constantes (pattern Jacques universel)

Ces éléments sont identiques sur les 2 vidéos. **À reproduire systématiquement.**

### Structure
- **Hook 10-13s** avec affirmation choc + technique rhétorique forte
- **4-5 chapitres numérotés** avec badge rouge
- **Chapitres durent 30-100s** (variable selon densité)
- **Pivots narratifs récurrents** : "Mais", "À titre de comparaison", "Et surtout"
- **CTA fin** = appel commentaire/abonnement + redirection

### Visuel
- **Carte satellite 3D oblique** (~95% du temps en mouvement, statique seulement 5%)
- **Mouvements caméra constants** : flyTo, zoom, rotation, pan
- **Typographie sans-serif bold blanche** + ombre portée / contour
- **Emojis Apple** comme accent (cheap mais reproduit pareil)
- **Drapeaux nationaux + pictogrammes thématiques** (militaire, ressources, etc.)
- **Transitions** : cut sec + zoom-in + effets ponctuels

### Rythme
- **Plan moyen 2.8-3.2s** — montage très serré
- **1 stat toutes les 7.5s** — densité constante
- **Overlay texte quasi-permanent** (22-32 sur les 2 vidéos)

### Production
- **Stack Jacques** : Mapbox/Google Earth + After Effects (Geolayers 3) + Premiere Pro
- **Production estimée** : 25-30h par vidéo (lourde)

## Variables (selon format)

### Mono-pays (Croatie 210s)
- 5 chapitres
- 18 stats (densité moyenne)
- 8 B-roll inserts (45s = 21% du runtime — TRÈS B-roll)
- Hook = métaphore visuelle ("boomerang", "mâchoire de dragon")
- **Position prise oui** (Jacques juge la Croatie "égoïste")
- Closing = question audience + suggestion prochain pays

### Comparatif VS (Maroc/Algérie 356s)
- 4 chapitres + **système de score gamifié** (0-1, 1-1, etc.)
- 45 stats (densité 2.5x supérieure)
- 12 B-roll inserts (25s = 7% — moins de B-roll, plus de carte)
- Hook = "promesse de gain" ("désigner un gagnant")
- **Position neutre obligatoire** (sinon tu perds une moitié de l'audience)
- Closing = appel à voter en commentaire

→ **Implication** : pour notre territoire africain, le format VS est risqué (Sénégal vs Mali = touchy diaspora). **Le mono-pays est plus sûr.** Mais le VS génère plus de stats donc plus de matière éditoriale.

## Faiblesses identifiées par Gemini sur les 2 vidéos

Les 4 mêmes faiblesses ressortent → ce sont nos **4 axes de différenciation universels** :

| Faiblesse Jacques (constante) | Notre alternative (signature) |
|-------------------------------|-------------------------------|
| Emojis Apple cheap | **Icônes custom Adinkra/géométriques** vectorielles |
| Sources jamais citées | **Footer "Source: World Bank / SIPRI"** discret en bas de frame ← levier crédibilité |
| Carte satellite Google Earth standard | **Mapbox custom sépia/parchemin Mande** ← signature visuelle |
| SFX répétitifs / musique stock | **Sound design africain (kora, balafon, ambiance marché)** + variation tension |

## Points forts à reproduire (consolidés)

Les 5-6 patterns gagnants confirmés sur les 2 vidéos :

1. **Hook avec technique rhétorique forte** (métaphore OU promesse de gain)
2. **Comparaison de tailles par superposition** (silhouette pays vs autres) — VALIDÉ 2/2
3. **Système de gamification** (score, podium, ranking) — pour formats comparatifs
4. **Mouvement caméra incessant** (statique = mort)
5. **Sync SFX + apparition icônes** — sound design serré
6. **Pivots narratifs récurrents** (réutiliser les mêmes phrases de pivot, ça crée une signature)

## Opportunités de différenciation (consolidées Gemini sur les 2 vidéos)

10 leviers identifiés cross-video que Jacques n'exploite PAS :

1. **Sources bibliographiques discrètes** ← crédibilité
2. **Animations Paper-Craft 3D** pour bâtiments/scènes historiques ← TON STYLE EXISTANT
3. **Sound design d'ambiance** (mer, vent, marché, kora)
4. **Dataviz complexes 3D** (graphiques barres animés sur la carte) au lieu de chiffres textuels
5. **Split-screen satellite + drone temps réel**
6. **Curseur temporel** pour voir évolution frontières/budgets
7. **Style "Blueprint" ou "Vintage Atlas"** au lieu de Google Earth
8. **Mini-jeux/questions interactives** (Remotion Player)
9. **Profondeur historique** : calques de cartes anciennes lors des pivots
10. **Sound design spatialisé** lié aux mouvements de carte

## Template numérique cible Remotion

### Pour un long format (5-6 min, 300-400s)
```
- Hook : 10-13s (affirmation choc + métaphore/promesse)
- Chapitre 1 : 60-90s (introduction du sujet)
- Chapitre 2 : 60-100s (cœur de l'info)
- Chapitre 3 : 60-100s (data dense)
- Chapitre 4 : 30-60s (synthèse/perspective)
- Chapitre 5 (optionnel) : 40-60s (esthétique/conclusion)
- CTA : 5-10s

Total : 300-400s = 5-7 min
Stats cibles : 25-45 (1 toutes les 7-10s)
B-roll inserts : 8-12 (15-25% du runtime)
Plan moyen : 2.8-3.2s
Caméra statique : <10%
```

### Pour un Short (60-90s)
```
- Hook : 3-5s (très condensé)
- Section principale : 50-70s (1 chapitre seulement)
- CTA : 5-10s

Stats cibles : 6-10
B-roll inserts : 1-2
Plan moyen : 2-3s
```

## Composants Remotion à créer (consolidés)

D'après les 2 analyses, voici les 14 composants nécessaires :

### Carte (Mapbox custom)
1. **SatelliteMapScene** — Mapbox Satellite custom avec camera animation
2. **CountryFlagCutout** — silhouette pays remplie drapeau
3. **NeonGlowBorder** — tracé frontière animé spring + glow
4. **MagnifierZoom** — effet loupe sur micro-détail
5. **OverlaidComparison** — superposition silhouettes pays pour comparaison taille

### Labels et UI
6. **ChapterBadge** — numéro rouge top-left
7. **LabelBadge** — badges noirs/jaunes/blancs
8. **ScoreOverlay** — pour formats VS (0-1, 1-1)
9. **MapMarker** — cercles rouges + pins
10. **CitationFooter** — sources discrètes bas de frame ← notre différenciation

### Inserts et transitions
11. **EllipseRevealPhoto** — transition ellipse pour B-roll
12. **BRollInsert** — vidéo drone/archive avec fondus
13. **PaperCraftInsert** — scène Paper-Craft 3D ← reuse direct de notre style existant

### Audio
14. **SoundSyncEmitter** — helper sync SFX + apparitions (audio-derived timing, déjà documenté dans nos memory rules)

## Décisions à prendre maintenant

### Décision 1 : Style Mapbox custom (3 options)
- A) **Sépia paper-craft** — cohérent avec Sonjata/Abou Bakari, signature continue
- B) **Parchemin Mande** — ancrage culturel fort, audience africaine premium
- C) **Monochrome éditorial moderne** — tone Le Monde/Bloomberg, audience internationale

### Décision 2 : Format pilote
- A) **Mono-pays** (plus sûr, moins risqué, format Sonjata-like)
- B) **VS comparatif** (plus dense en stats, plus viral, mais positionnement neutre obligatoire)

### Décision 3 : Sujet pilote
Reco Last30Days : **"La vraie taille du Mali à l'échelle (et son or qui finançait l'Europe médiévale)"**
- Combine Angle 6 (taille/échelle viral) + Angle 5 (héros oubliés)
- Format mono-pays naturel
- 60-90s Short ou 4-5 min long ?

## Notre stack proposée vs Jacques

| Aspect | Jacques | Notre version |
|--------|---------|---------------|
| Map engine | After Effects + Geolayers 3 | Remotion + Mapbox GL JS rendu offscreen |
| Editing | Premiere Pro | 100% Remotion code-based |
| B-roll | Stock + drone | Recraft SVG cartes anciennes + Gemini scènes + Paper-Craft inserts |
| Sound design | Stock + emojis SFX | ElevenLabs SFX + Minimax kora |
| Citations | Aucune | Footer source visible |
| Production temps | 25-30h | 5-10h après pipeline rodé |
| Reproductibilité | Manuelle (lourd) | Code (deterministic, scriptable, scalable) |

**Avantage clé** : notre pipeline code-based permet de **scripter une variation** (ex: changer le pays, l'angle, la palette) avec quelques propriétés — Jacques doit refaire tout à la main.
