# Prochaine session — Nettoyage complet codebase

## Intention d'Aziz
Pause production. Session dédiée nettoyage. Il est insatisfait de la complexité accumulée.
Sentiment : trop de techniques, trop de mémoires, trop de règles — ça crée de la friction pour lui ET pour Claude.
Référence : les Shorts Sonjata/Thiaroye ont été créés simplement. Revenir à ça.

## Starter prompt pour la prochaine session

---

Bonjour. Cette session est dédiée au nettoyage complet du projet Remotion — code, mémoires, règles, pipeline.
Avant de toucher quoi que ce soit, pose-moi des questions pour comprendre où aller.

Questions à poser à Aziz (dans cet ordre) :

1. Sur l'objectif : "Qu'est-ce qui te dérange le plus en ce moment — le code lui-même, les mémoires/règles, ou les deux ?"
2. Sur le périmètre : "Est-ce qu'on nettoie tout le projet (Atlas + Souverain + shared) ou seulement Souverain/Sénégal ?"
3. Sur les projets actifs : "Quels épisodes sont encore actifs et ne doivent pas être touchés ?"
4. Sur les outils : "Est-ce que tu veux qu'on installe ultrareview avant de commencer ? (npx skills add ultrareview)"
5. Sur le niveau de radicalité : "Archiver les vieux projets terminés, ou tout supprimer ?"

## Ce qu'il faut installer avant de commencer

```bash
npx skills add ultrareview   # review complète multi-agents
```

Vérifier aussi que `/review` et `code-simplifier` sont disponibles :
- `/review` : skill déjà installé dans ~/.claude/skills/review
- `code-simplifier` : plugin déjà actif dans settings.json

## Plan de nettoyage (à valider avec Aziz avant d'exécuter)

### 1. Code
- `/ultrareview` sur tout le projet — identifier dette technique, dead code, composants dupliqués
- `code-simplifier` sur les fichiers identifiés comme problématiques
- Supprimer les versions obsolètes (Beat1AnomalieV1 à V4 si V5 est validé)

### 2. Mémoires
- Archiver tout ce qui concerne des projets FINAUX (Sonjata, Thiaroye, Mansa Moussa, Shaka Zulu)
- Garder actif uniquement : projets en cours + règles transversales
- MEMORY.md est à 209 lignes (limite 200) — à réduire impérativement

### 3. CLAUDE.md
- Identifier les règles redondantes ou contradictoires
- Supprimer les règles jamais appliquées
- Cible : fichier 30-40% plus court

### 4. out/
- Purger wip/ et versions/ de tous les épisodes terminés
- Ne garder que les FINAL.mp4

### 5. Branches git
- Merger ou supprimer les branches stales
- Vérifier que master est propre

## Diagnostic probable (à confirmer)
La régression de qualité sur Sénégal Pétrole Gaz vient probablement de :
- Assets générés inline au lieu d'être préparés en amont (pipeline inversé)
- Trop de règles contradictoires dans CLAUDE.md qui paralysent la prise de décision
- Contexte de session trop chargé → Claude navigue les instructions au lieu de produire
