# Méthode "verrouille puis construit" — pas de re-pass exploration après validation

> Migré depuis auto-memory 2026-08-31 (créé 2026-05-02, épisode Shaka Zulu archivé). Méthode de
> workflow réutilisable pour tout pass de validation créative multi-idées (Kimi/Jury/LLM).

## La règle

Workflow en 3 phases distinctes pour éviter les boucles d'exploration :

1. **Exploration** : reviews ouvertes (brief créatif, jury pass 1), tri des idées, discussions
2. **Verrouillage** : choix définitif des idées (Top 5-7), liste lockée dans un fichier `VAGUE-X-LOCKED.md`
3. **Construction** : code scène par scène, avec UN SEUL pass de validation final

**Why:** "On verrouille. On choisit les meilleurs. Par la suite, s'il le faut, on refait un dernier pass pour valider avec les LLM. Mais cette fois-ci, on passe pas 'voici ce qu'on a choisi, approuves-tu ou non?' — pas un pass où on refait tout."

## Application concrète

### Pour le pass de validation final (Jury Pass 2)
- Brief = liste verrouillée + stack précis + 4 questions ciblées
- **Q1 : validation idée par idée** (oui/non/amendement) — pas réouverture créative
- **Q2 : implémentation par outil** (découpage par technologie disponible)
- **Q3 : question stylistique critique** (spécifique au projet)
- **Q4 : gap detection** (une idée oubliée + pièges techniques, borné à 1 idée bonus max)
- Output : synthèse avec amendements + recettes

### Anti-patterns à éviter
- ❌ Relancer une exploration créative après verrouillage
- ❌ Demander "pour ces 7 idées, quelles autres alternatives existent ?"
- ❌ Insérer de nouvelles idées non-listées pendant le pass de validation (sauf via Q4 gap detection encadrée)
- ❌ Donner aux LLMs un brief ouvert après verrouillage

### Patterns à adopter
- ✅ "Voici les 7 idées verrouillées. Pour chacune : approuves-tu ? Comment l'implémenter dans notre stack précis ?"
- ✅ Donner le stack précis dans le brief
- ✅ Limiter les ouvertures à Q4 gap detection (1 idée bonus max)
- ✅ Après synthèse, documenter dans un fichier LOCKED.md = source de vérité définitive
- ✅ En phase construction, si conflit code vs LOCKED.md → LOCKED.md prime

## Résultat concret (Shaka Zulu, historique)

Pass 1 (exploration) → discussion Aziz → tri → Pass 2 (validation lockdown) → 7/7 idées approuvées + 3 amendements convergents + 1 idée nouvelle (Q4 gap). Aucune réouverture créative. Coût total $0.05.

## How to apply

Quand Aziz dit "verrouille" ou "lockdown", c'est un signal :
- Ne plus rouvrir le scope créatif
- Le prochain pass = décision binaire (oui/non/amendement)
- Si une idée surgit en cours de construction, la noter pour vague suivante, pas l'insérer immédiatement
