---
name: feedback_nom-chaine-kora-et-cartes-pas-geoafrique
description: La chaîne s'appelle "Kora et Cartes", PLUS "GéoAfrique". Nom de chaîne périmé partout en mémoire/code — ne plus jamais écrire GéoAfrique comme nom de chaîne.
metadata:
  type: feedback
---

# Le nom de la chaîne est "Kora et Cartes", pas "GéoAfrique"

**Fait (Aziz, 2026-07-19)** : la chaîne YouTube a changé de nom depuis longtemps. Elle s'appelle
désormais **Kora et Cartes**. Le nom "GéoAfrique" / "GeoAfrique" est PÉRIMÉ comme nom de chaîne.

**Why** : de nombreuses instances mémoire ET code utilisent encore "GéoAfrique" (mesuré 2026-07-19 :
~140 fichiers memory/ + ~243 occurrences code src/+scripts/). Tout texte AFFICHÉ à l'écran (bandeau CTA,
générique, thumbnail) ou toute mention orale du nom de chaîne doit dire "Kora et Cartes". Une vidéo qui
afficherait "GéoAfrique" serait datée/fausse.

**How to apply** :
- ⛔ Ne PLUS JAMAIS écrire "GéoAfrique" comme NOM DE CHAÎNE (texte écran, CTA, script oral, docs présentés).
- ⚠️ NUANCE CRITIQUE — tout "GeoAfrique" n'est PAS le nom de chaîne. 3 catégories à DISTINGUER avant tout
  renommage global (un sed aveugle casserait des choses) :
  1. **Nom de chaîne** (« GéoAfrique YouTube series », mentions narratives) → renommer "Kora et Cartes". ✅
  2. **Nom de VOIX ElevenLabs** (« GéoAfrique V2 », voice id `z3gESu49naEZW8Af2Upm`) = étiquette technique
     interne de la voix remixée, PAS le nom de chaîne. NE PAS renommer aveuglément (référence croisée code).
  3. **Chemins de dossiers** (`geoafrique/heros-oublies/`, `geoafrique-shorts/…`) → renommer un dossier
     casse tous les chemins en dur .py/.tsx + liens .md. Traiter à part, avec `check-links.py` après.
- **Chantier de nettoyage propre à lancer quand Aziz le demande** (agent dédié qui trie les 3 catégories,
  pas un remplacement global). Pas urgent, mais à faire avant toute nouvelle vidéo qui afficherait le nom.

Lié : [[feedback_nom-propre-ecran-verifier-wikipedia]] (même famille : nom affiché à l'écran = vérifier).
