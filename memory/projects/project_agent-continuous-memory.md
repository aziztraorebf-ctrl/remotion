---
name: Systeme memoire continue pour agents
description: Projet futur — chaque agent ecrit un mini-log apres chaque invocation et lit ses logs recents au demarrage. Transforme les agents de freelances en collaborateurs avec memoire.
type: project
originSessionId: 207d2154-9afd-4628-bd74-ef14f80d53de
---
# Systeme memoire continue pour agents

**Quand** : apres publication des 3 Shorts (Sonjata, Abou Bakari, Thiaroye). Pas avant.

**Why** : chaque agent repart de zero a chaque appel. Il connait les regles (fichiers memoire statiques) mais ne se souvient pas de ce qu'il a fait la session d'avant. Aziz veut que les agents s'ameliorent avec l'usage, pas juste appliquent des regles figees.

**How to apply** : construire en session separee. Design propose :

1. **Apres chaque appel agent** : l'agent ecrit un mini-log structure dans son dossier memoire
   - Fichier : `.claude/agent-memory/{agent}/SESSION_LOG.md` (append-only)
   - Format : date + ce qui a ete fait + decisions + resultats + lecons
2. **Au debut de chaque appel** : l'agent lit ses 3-5 derniers logs pour reprendre le contexte
3. **Pruning** : garder les 10 derniers logs + un fichier `LESSONS_LEARNED.md` consolide

Resultat attendu : agent qui passe de "freelance qui connait les regles" a "collaborateur qui se souvient de ce qu'il a fait".
