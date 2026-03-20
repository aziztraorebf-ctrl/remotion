# Skill : /checkpoint

Synchronise la memoire de session dans COMPACT_CURRENT (et COMPACT_MASTER si necessaire).

## Etapes

### 1. Detecter les changements de la session

Executer ces deux commandes pour avoir une image complete :

```bash
git status                          # fichiers non-commites
git diff HEAD                       # diff des changements non-stagges
git log --oneline -10               # commits recents (si des commits ont eu lieu)
git diff HEAD~3 --name-only 2>/dev/null  # fichiers modifies dans les 3 derniers commits
```

Identifier :
- Fichiers **crees** (untracked ou nouveaux dans diff)
- Fichiers **modifies** (changed)
- **Commits** realises pendant la session (via git log)

### 2. Lire l'etat precedent

Lire `memory/COMPACT_CURRENT.md` pour comprendre ce qui etait "en cours" avant cette session.

### 3. Comparer et identifier les avancees

Croiser les changements git avec COMPACT_CURRENT :
- Quels beats/scenes ont ete codes ou valides ?
- Quelles decisions ont ete prises pendant la session (dans les messages) ?
- Quels fichiers nouveaux sont apparus (nouveaux composants, assets, scripts) ?
- Y a-t-il des renders valides (fichiers dans `out/`) ?

### 4. Reedire COMPACT_CURRENT

Mettre a jour `memory/COMPACT_CURRENT.md` :
- Marquer comme TERMINE ce qui est fini
- Mettre a jour "Prochain beat/scene a coder"
- Ajouter les nouvelles decisions dans le tableau "Decisions Architecturales Recentes"
- Mettre a jour "En Attente de Validation Aziz" (retirer ce qui est resolu, ajouter ce qui est nouveau)
- Mettre a jour la date en haut du fichier

### 5. Evaluer COMPACT_MASTER

Verifier si un de ces changements structurels s'est produit :
- Nouveau pipeline valide (ex: Recraft, nouveau tool)
- Nouvelle palette adoptee
- Nouvelle regle d'or Remotion decouverte
- Nouveau gotcha TTS ou API documente
- Nouvelle technique geo validee

Si oui : proposer la mise a jour specifique a Aziz ("Je suggere d'ajouter X dans COMPACT_MASTER — OK ?")
Si non : indiquer "COMPACT_MASTER : aucune mise a jour necessaire"

### 6. Supprimer .claudestatus si present

```bash
rm -f /Users/clawdbot/Workspace/remotion/.claudestatus
```

### 7. Afficher le resume de synchronisation

Format de sortie obligatoire :

```
Memoire synchronisee.

COMPACT_CURRENT mis a jour :
- [point 1]
- [point 2]
- [point 3]

COMPACT_MASTER : [aucune mise a jour / suggestion : ...]

Prochaine action recommandee : [une phrase]
```

## Regles

- Ne pas inventer des changements qui ne sont pas dans git diff ou dans la conversation
- Si git diff est vide et aucun commit recent : signaler "Aucun changement de code detecte — seules les decisions de conversation sont synchronisees"
- Toujours dater la mise a jour (ligne 1 de COMPACT_CURRENT)
- La mise a jour doit etre factuelle et breve — pas de prose
