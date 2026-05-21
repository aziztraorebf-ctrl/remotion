# Starter Prompt — Mid-form #1 : Maroc Batteries

> À copier dans une nouvelle session dédiée. Premier test de format Mid-form 4-5 min Souverain.

---

## Prompt à copier-coller

```
Nouvelle session pré-production Souverain — premier test format Mid-form 4-5 min.

Sujet : "La gigafactory de batteries du Maroc — pourquoi votre prochaine voiture
électrique sera assemblée à Kénitra"

Angle : bascule industrielle. Le Maroc ne vend plus son phosphate brut, il
assemble la batterie complète. Triangle phosphate marocain (Khouribga) → cobalt
RDC (Katanga) → assemblage Kénitra → ports européens. Stellantis, Renault, BMW
engagés. Gotion High-Tech (chinois) construit, démarrage Q3 2026.

Format cible : Mid-form 4-5 min (Palier A — test rétention, pas Palier B
mid-rolls). Structure 4 actes selon MIDFORM-FORMAT-RULES.md.

AVANT toute écriture, lire dans l'ordre :
1. memory/CHARTE-EDITORIALE-SOUVERAIN.md (positionnement + 4 règles fermes)
2. memory/MIDFORM-FORMAT-RULES.md (structure 4 actes, respirations, ratios)
3. memory/MIDFORM-CHECKLIST-VULGARISATION.md (5 tests bloquants anti-jargon)
4. memory/rules-souverain-editorial.md (règles transversales, sources, couleurs)
5. memory/templates/fact-sheet-souverain-v1.md (template pré-production)

Workflow attendu (NE PAS sauter d'étape) :

Étape 1 — Fact-sheet pré-production
  Produire un fact-sheet selon le template, incluant :
  - 3 chiffres-choc vérifiables (Perplexity sonar-pro après)
  - 4 acteurs distincts (Maroc, Chine via Gotion, Europe via Stellantis/Renault, RDC)
  - 4 points géographiques précis avec coordonnées
  - Le hook universel (pourquoi Tokyo/Paris/Montréal est concerné)
  - Sources niveau 1 (faits vérifiables) — minimum 3 sources de camps différents

Étape 2 — Structure 4 actes (timestamps indicatifs)
  Acte 1 — Anomalie (0:00-0:45) : hook + question centrale
  Acte 2 — Démonstration (0:45-2:30) : mécanisme principal (triangle géo)
  Acte 3 — Conséquences (2:30-4:00) : qui paie, qui gagne, multi-perspective
  Acte 4 — Implication (4:00-4:45) : pourquoi le viewer est concerné + question ouverte

Étape 3 — Placement des 3-4 respirations obligatoires
  Identifier les moments où l'audio se tait + visuel statique 2-3s. Sans ça,
  saturation cognitive sur 5 min.

Étape 4 — Test des 3 filtres charte sur le titre et l'angle
  1. Identifie-t-il un méchant ? (NON requis)
  2. Un viewer occidental se sentirait accusé ? (NON requis)
  3. Bloomberg/FT/Le Monde pourraient citer sans inconfort ? (OUI requis)

Étape 5 — Script V1
  ~560-700 mots max (140 mots/min × 4-5 min). Densité 1 chiffre traduit toutes
  les ~40s. Multi-perspective explicite (Pékin / Bruxelles / Rabat / Berlin).
  Aucun pavé encyclopédique.

Étape 6 — Passage checklist vulgarisation (BLOQUANT)
  Appliquer les 5 tests anti-jargon ligne par ligne. Scanner liste noire.
  Tableau motivations visibles. Lecture à voix haute.

Étape 7 — Perplexity fact-check sonar-pro
  Avant tout TTS. Vérifier chaque chiffre, chaque date, chaque nom propre.

Étape 8 — Tableau acteurs/motivations (R-MOTIVATION-VISIBLE)
  Pour chaque acteur qui agit, motivation visible en 1 phrase analogique.

PAS de génération audio avant validation explicite Aziz du script V2 fact-checké.
PAS de génération visuelle avant validation script + plan storyboard par acte.

Contraintes techniques :
- Render cible : Vercel cloud (scripts/render-on-vercel.py), Mapbox supporté
- Stack : Mapbox 3D + data-viz Souverain templates + paper kraft + palette caspian
  (à valider en pré-prod, ne pas hardcoder)
- Voix : ElevenLabs GéoAfrique V2 (z3gESu49naEZW8Af2Upm) — règles TTS françaises
  obligatoires (zéro participe en e/ee, années en lettres, scan complet)

Livrable étape 1 : fact-sheet complet avant tout autre travail.
Commencer maintenant.
```

---

## Pourquoi ce prompt est structuré ainsi

- **Lecture des 5 fichiers AVANT toute écriture** : force le respect de la charte et des règles Mid-form lockées récemment
- **8 étapes séquentielles** : empêche la session de sauter directement au script V1 (erreur classique)
- **Validation Aziz aux 2 points critiques** : après script V2 fact-checké, et après plan storyboard. Pas de génération payante non-validée.
- **Contraintes techniques rappelées** : Vercel cloud par défaut, voix GéoAfrique V2, règles TTS françaises

## À garder à l'esprit en lançant la session

- Le premier livrable doit être un **fact-sheet**, pas un script. Si la session te propose un script d'emblée, c'est qu'elle a sauté l'étape de pré-prod.
- La densité cible est **140 mots/min**, pas plus. Niger Uranium était limite, Maroc Batteries doit respecter.
- Tu peux annuler à tout moment si la session glisse vers le format Short ou vers un sujet militant.
