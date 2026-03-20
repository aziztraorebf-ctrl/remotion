# PROTOCOLE_EXPLORATION — "Un Pixel d'Histoire"
> Version 1.1 — mise à jour 2026-03-15 (O3 ajouté, beats validés mis à jour)
> But : encourager l'exploration créative DANS les limites connues
> À lire en complément de PROTOCOLE_KLING_V2 et PROTOCOLE_REMOTION_V1

---

## Principe fondamental

Les règles des deux autres protocoles sont des **garde-fous, pas des plafonds**.
Elles documentent ce qui a échoué ou ce qui est risqué — pas ce qui est impossible.

Il existe 38 mouvements de caméra Kling documentés. Plus O3 start+end frame (pipeline propre au projet).
Plusieurs validés en production — voir tableau de statuts ci-dessous.

**Règle méta pour le Gem :**
Quand Aziz demande un mouvement de caméra pour un beat, toujours proposer 3 options :
- **Option Sûre** : validée en production, risque zéro
- **Option Prometteuse** : logiquement compatible avec notre format, non testée
- **Option Créative** : ambitieuse, risque à évaluer, potentiel élevé

Ne jamais proposer une seule option. La variété est le but.

---

## Budget d'exploration par beat

Chaque beat a droit à **2 clips de test** avant de valider.
- Clip 1 : option sûre (référence de comparaison)
- Clip 2 : option prometteuse ou créative

Coût estimé : 2 clips x $0.84 = ~$1.70 par beat de test.
C'est le prix de l'exploration intentionnelle. Ne pas le voir comme du gaspillage.

Si le clip créatif est supérieur -> il devient la version de production.
Si le clip créatif échoue -> on documente pourquoi et on garde l'option sûre.
Les deux cas font avancer la connaissance du pipeline.

---

## Les 38 mouvements Kling — catalogue par cas d'usage narratif

### Statut légende
- ✅ Validé en production sur notre projet
- 🔵 Compatible théoriquement, non testé
- 🟡 Risqué, tester avec cfg_scale bas (0.3-0.4)
- ❌ Incompatible avec notre format 9:16 flat design

### O3 start+end frame — PIPELINE PRINCIPAL (ajouté 2026-03-15)

**Non dans le catalogue des 38 mouvements — c'est un pipeline différent.**
Au lieu d'animer UNE image, on donne à Kling une image de départ ET une image d'arrivée.
Kling invente la transition entre les deux.

| Mouvement obtenu | Usage | cfg_scale | Durée min |
|-----------------|-------|-----------|-----------|
| Dolly in (plan large → gros plan) | Personnages, portraits | 0.4 | 10s |
| Orbit 180-360° | Sujets historiques épiques (vivid_shapes) | 0.35 | 8s |
| Pan panoramique | Cartes, territoires | 0.4 | 10s |

**Règle : end frame = sujet seul dans sa pose finale. Pas d'armée, pas de foule — Kling les invente mieux.**

---

### Groupe A — Zoom / Mise au point

| Mouvement | Statut | Cas d'usage narratif | Notes |
|-----------|--------|---------------------|-------|
| Optical Zoom In | ✅ | Focalisation sur un point précis, tension | Fond statique — meilleur pour flat design |
| Optical Zoom Out | 🔵 | Révélation d'échelle, contexte géographique | Tester sur Beat02 empire |
| Push In / Dolly In | ✅ | Immersion progressive, début de vidéo | Validé Beat01 V2.1 cfg 0.6 |
| Pull Out / Dolly Out | 🔵 | Fin de scène, recul émotionnel | À tester sur Beat08 close |
| Rack Focus | 🔵 | Passage d'un sujet à un autre | Intéressant pour Beat04 nom -> carte |

---

### Groupe B — Translations horizontales/verticales

| Mouvement | Statut | Cas d'usage narratif | Notes |
|-----------|--------|---------------------|-------|
| Pan Left | 🔵 | Découverte de territoire, regard vers le passé | Léger uniquement (max 10-15%) |
| Pan Right | 🔵 | Avancée narrative, regard vers l'avenir | Léger uniquement |
| Truck Left | ❌ | — | Continent sort du cadre en 9:16 |
| Truck Right | ❌ | — | Continent sort du cadre en 9:16 |
| Tilt Up | 🔵 | Révélation du ciel, dimension cosmique | Compatible portrait, doux |
| Tilt Down | 🔵 | Descente vers la terre, ancrage | Compatible portrait |
| Pedestal Up | 🔵 | Élévation, montée en puissance | À tester |
| Pedestal Down | 🔵 | Descente, gravité dramatique | À tester |

---

### Groupe C — Rotations / Orbites

| Mouvement | Statut | Cas d'usage narratif | Notes |
|-----------|--------|---------------------|-------|
| Arc Shot Left | ✅ | Orbite autour du personnage historique | **VALIDÉ O3 vivid_shapes** (Hannibal 8.5/10, Amanirenas 8.7/10) — sur flat design seulement |
| Arc Shot Right | ✅ | Idem sens inverse | Idem — OK sur vivid_shapes, INTERDIT sur portrait semi-réaliste |
| Dutch Angle | 🔵 | Tension, déséquilibre narratif | Subtil uniquement sur flat design |
| Roll | ❌ | — | Casse le repère spatial du documentaire |

---

### Groupe D — Mouvements combinés (avancés)

| Mouvement | Statut | Cas d'usage narratif | Notes |
|-----------|--------|---------------------|-------|
| Dolly Zoom (Vertigo) | 🟡 | Choc, révélation dramatique | Zoom + recul simultanés — effet puissant |
| Crane Up | 🔵 | Élévation épique, fin de séquence | Compatible si sujet reste centré |
| Crane Down | 🔵 | Descente vers la scène, entrée en matière | À tester |
| Boom Up | 🔵 | Similaire Crane Up, plus vertical | À tester |
| Boom Down | 🔵 | Similaire Crane Down | À tester |
| God's Eye View | 🔵 | Vue aérienne directe, cartes tactiques | Pertinent Beat02 empire du Mali |
| Whip Pan | ❌ | — | Trop violent pour documentaire éducatif |
| Snap Zoom | ❌ | — | Trop viral/TikTok, casse le ton historique |

---

### Groupe E — Mouvements de suivi

| Mouvement | Statut | Cas d'usage narratif | Notes |
|-----------|--------|---------------------|-------|
| Tracking Shot | 🔵 | Suivre un mouvement (flotte, route) | Pertinent Beat03 flotte |
| Follow Shot | 🔵 | Accompagner un déplacement | Pertinent Beat05 abdication |
| Reveal Shot | 🔵 | Dévoilement progressif | Intéressant pour révéler un personnage |
| Fly Through | 🟡 | Traversée d'un espace | Risque de morphing si hors-champ généré |

---

### Groupe F — Atmosphériques / Statiques

| Mouvement | Statut | Cas d'usage narratif | Notes |
|-----------|--------|---------------------|-------|
| Static / Locked | 🔵 | Stabilité, contemplation, texte long | Bon pour beats abstraits (Beat06 timeline) |
| Subtle Drift | ❌ | — | V2.1 : image entière glisse = cheap. V3 cfg 0.35 = meilleure alternative |
| Breathing Camera | ✅ | Présence physique d'un personnage, contemplation | Validé Beat02 V3 cfg 0.35 — yeux mi-clos, respiration, vagues organiques |
| Handheld | ❌ | — | Casse l'esthétique documentaire |
| Shaky Cam | ❌ | — | Idem |

---

## Beats Abou Bakari II — Statut production

| Beat | Statut | Technique | Notes |
|------|--------|-----------|-------|
| Beat01 ocean | ✅ VALIDÉ | O3 start+end frame, pan vers l'ouest | `beat01-o3-pan-B-14s.mp4` |
| Beat02 empire | ✅ VALIDÉ | O3 start+end frame, dolly in + tête pivote | `beat02-o3-westlook-v1.mp4` |
| Beat03 fleet | ✅ VALIDÉ | O3 start+end frame, flotte → pirogue solitaire | `beat03-o3-fleet-v3.mp4` |
| Beat04 name | ✅ VALIDÉ | O3 multi-shot, capitaine proue + dolly out | `beat04-kling-v2.mp4` |
| Beat05 abdication | À faire | Pull Out / Dolly Out recommandé | Recul émotionnel |
| Beat06 timeline | À faire | SVG Remotion pur ou Static/Locked Kling | Data viz temporelle |
| Beat07 colomb | À faire | Dolly Zoom (Vertigo) à tester | Choc révélation |
| Beat08 close | À faire | Static/Locked | Question suspendue |

---

## Règle des 3 options — format de réponse attendu du Gem

Quand on demande un prompt Kling pour un beat, la réponse doit toujours inclure :

```
OPTION SURE (validée) :
Mouvement : [nom]
Prompt : "..."
Modèle : V2.1 standard / cfg_scale 0.6
Risque : Zéro — validé en production

OPTION PROMETTEUSE (à tester) :
Mouvement : [nom]
Prompt : "..."
Modèle : [recommandé]
Risque : Faible — compatible théoriquement avec 9:16 flat design

OPTION CREATIVE (ambitieuse) :
Mouvement : [nom]
Prompt : "..."
Modèle : [recommandé]
Risque : À évaluer — potentiel narratif élevé, résultat incertain
Note : si ça échoue, documenter pourquoi dans le protocole
```

---
