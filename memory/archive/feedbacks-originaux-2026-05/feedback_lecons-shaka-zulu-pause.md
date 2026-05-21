---
name: "Leçons Shaka Zulu — pourquoi mismatch format Atlas + critères Atlas-natifs"
description: "Diagnostic post-pause Shaka Zulu (2026-05-03) + critères pour identifier un sujet Atlas-natif vs un sujet à faire en Seedance Shorts."
type: feedback
---

# Leçons Shaka Zulu (pause stratégique 2026-05-03)

## Le mismatch fondamental

Shaka Zulu raconte 3 choses, aucune n'est cartographiable :
1. **Innovation militaire** (lance courte, bouclier, formation cornes) → abstraction tactique, pas de territoire
2. **Psychologie** (paria, mort de Nandi, descente dans la folie) → intériorité, pas de mouvement
3. **Rituels culturels** (deuil zulu, décrets) → social/culturel, pas géographique

L'Atlas-carte est conçu pour **territoire + mouvement**. Quand tu forces Atlas sur du contenu non-territorial, tu finis par :
- Inventer des "schémas SVG dataviz" pour remplacer la carte (S2A1 Iklwa, S2A2 Bouclier)
- Coder des scènes "intérieures" (S4 Nandi) qui se cartographient mal
- Avoir un ton qui dérive vers l'encyclopédie/cours d'histoire (perd le rythme viral)

## Critères pour qu'un sujet soit Atlas-natif

Un sujet est Atlas-natif si **AU MOINS 3 sur 5** sont vrais :

| # | Critère | Test |
|---|---------|------|
| 1 | **Mouvement géographique central** | Le sujet implique un trajet, une expansion, une migration |
| 2 | **Frontières qui changent** | Empire qui grandit/rétrécit, conquêtes, traités |
| 3 | **Réseaux/flux visualisables** | Routes commerciales, alliances, échanges, courants |
| 4 | **Chiffres-records géolocalisés** | Production minière, taille armée, richesse, population concentrée |
| 5 | **Comparaisons d'échelles spatiales** | Empire X vs continent Y, ville antique vs moderne, etc. |

**Shaka Zulu** : 1 critère sur 5 (l'expansion S3). Insuffisant.
**Mansa Moussa** : 5/5 (Hajj + Mali + or + commerce + comparaisons richesse).
**Empire du Ghana** : ~5/5 attendu (routes trans-sahariennes + or + commerce + frontières + chiffres).
**Hannibal** : 5/5 (Alpes + victoires + Rome + éléphants + comparaisons).
**Sundiata** : 4/5 (exil/retour + empire Mande + commerce + frontières).

## Critères pour qu'un sujet soit Seedance-natif

Un sujet est mieux en Seedance Shorts si :

| Critère | Test |
|---------|------|
| **Personnage héroïque central** | On veut voir le visage, l'émotion, le geste |
| **Scènes-clés iconiques** | Combat singulier, discours, mort tragique, naissance miraculeuse |
| **Intériorité/psychologie** | Doute, folie, deuil, transformation intime |
| **Rituels visuels** | Cérémonie, costume, danse, sacrifice |
| **Action chorégraphiée** | Combat, charge, fuite, traque |

**Shaka Zulu** : 5/5. C'est un sujet 100% Seedance.
**Sonjata Papercraft V7** : confirme que ça marche (héros marginalisé → roi, rituels Mande, combats).

## Règle de décision (à appliquer AVANT de scripter)

Avant tout nouveau script, faire ce test :

1. Lister les "moments-clés" attendus du script
2. Pour chacun, demander : "ce moment se passe-t-il dans un lieu identifiable sur une carte, ou dans la tête/le corps d'un personnage ?"
3. Si **>60% lieu géographique** → Atlas
4. Si **>60% intérieur/personnage** → Seedance
5. Si mixte → re-discuter, ou Seedance par défaut (plus mature)

## Symptômes de mismatch en cours de production

Pendant la production, **arrêter et reconsidérer** si :
- Plusieurs scènes finissent par être des "schémas SVG dataviz" plutôt que des cartes (S2A1/A2 Shaka)
- On hésite sur "quoi mettre dans la carte" pour une scène (encyclopédie qui menace)
- Le texte parlé est dense en informations psychologiques/intimes (S4 Nandi)
- Les renders mini montrent des scènes qui ne se ressemblent pas entre elles (cohérence visuelle perdue)
- On invente des "inserts dataviz" pour combler le manque de propos cartographique

## Ce qui reste valide de Shaka pour réutilisation

### Composants techniques (réutilisables Atlas)
- `_shared/AtlasMercator.tsx` — projection d3-geo
- `_shared/AtlasGlobe.tsx` — projection orthographic
- `_shared/AtlasLabel.tsx` — labels typographiques
- `_shared/AtlasCaravane.tsx` — chemins bezier animés

### Composants Shaka spécifiques (réutilisables si retour)
- `inserts/InsertIklwaSchema.tsx` — schéma comparatif lance
- `inserts/InsertBouclierSchema.tsx` — schéma 3-step bouclier
- `inserts/InsertCornesSchema.tsx` — formation tactique
- `inserts/InsertNombre1500.tsx`, `InsertNombre4000.tsx` — compteurs animés
- `scenes/CornesFrameNarrative.tsx` — frame narratif animé

### Assets PixelLab
- Shaka Warrior : `33e221bd` (walk cycle 4 directions, breathing-idle)
- Nandi : `12715dae-591c-4387-ba0b-419fcf44dd4f` (breathing-idle + falling-back-death)

### Audio
- `narration-v5.mp3` — voix canonique GeoAfrique
- `shaka-alignment.ts` — forced alignment ElevenLabs (reutilisable Seedance)
- `timing.ts` — segments temporels

### Données
- `data/geo/shaka-zulu-data.json` — frontières Royaume Zulu

## Comment revenir sur Shaka

**Option recommandée** : conversion en Seedance Short façon Sonjata Papercraft V7
1. Reprendre script V5 LOCKED (déjà solide)
2. Découper en 6-8 scènes-clés visuelles (héros marginalisé → roi)
3. Pour chaque scène : prompt Seedance papercraft sépia
4. Utiliser audio narration-v5.mp3 + forced alignment existant
5. Sous-titres karaoke (template `subtitles-shorts.md`)
6. CTA + render final

**Option non-recommandée** : continuer Atlas
- À ne tenter que dans 2-3 episodes Atlas (Ghana, Hannibal, Sundiata) APRES maturation pipeline
- Et même là, probablement encore mismatch
