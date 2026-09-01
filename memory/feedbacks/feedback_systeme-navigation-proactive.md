# Système de navigation proactive — origine et rationale

> Migré depuis auto-memory 2026-08-31 (créé 2026-06-01). Documente le POURQUOI du système
> NEXT-ACTION.md + STATUS.md + COMPOSANTS-INDEX.md — ces 3 fichiers sont désormais des piliers
> actifs du workflow (référencés dans CLAUDE.md § Démarrage & fin de session), mais leur rationale
> d'origine n'était nulle part côté repo.

## Problème résolu

Avant 2026-06-01 : à chaque reprise d'une vidéo en pause (2 semaines ou plus), Claude n'avait pas de moyen structuré de savoir où on s'était arrêté, quelles corrections étaient ouvertes, ni quelles techniques avaient été développées depuis la pause. Aziz devait réexpliquer à chaque fois.

Autre problème : Claude ne pouvait pas suggérer proactivement "voilà ce qu'on devrait faire" — il attendait qu'Aziz oriente.

## Solution : 3 fichiers complémentaires

### 1. `memory/NEXT-ACTION.md` — proactivité au démarrage

**Rôle** : Réponse directe à "Que fait-on maintenant ?"
**Format** : 3 lignes max par projet — état, décision en attente, recommandation + comment démarrer.
**Mis à jour** : en fin de session, dès qu'un projet change d'état ou qu'une décision est prise.
**Lu** : étape du Session Start (cf CLAUDE.md § Démarrage session).

**Why :** `PIPELINE.md` dit l'état des stages. `NEXT-ACTION.md` dit la recommandation — ce sont deux niveaux différents. `PIPELINE.md` = "où on en est", `NEXT-ACTION.md` = "que faire maintenant et pourquoi".

### 2. `memory/episodes/*/STATUS.md` — reprise d'épisode sans friction

**Rôle** : Fiche de reprise par épisode. Lire avant de toucher quoi que ce soit sur cet épisode.
**Contenu** : état de chaque beat (FINAL ou pas), corrections ouvertes numérotées, prochaine action + commande exacte, assets disponibles, techniques développées depuis la pause.
**Mis à jour** : en fin de chaque session de production sur l'épisode.

**Convention** : créer un STATUS.md à la première reprise de tout épisode en pause.

### 3. `src/projects/_shared/COMPOSANTS-INDEX.md` — trouver le bon composant

**Rôle** : composants classés par cas d'usage narratif ("quand Aziz dit..."), pas par type technique.
**Format** : table par catégorie (Chiffre/Stat, Comparaison, Timeline, Carte/Géo, Révélation, Citation, Portrait, Preuve, Réseau, Hook, Data-viz, Utilitaires).
**Lire** : AVANT de coder tout beat/scène.

**Why :** Sans cet index, chercher un composant = grep dans des dizaines de fichiers sans savoir ce qu'ils font. Avec l'index, "je veux montrer que le Maroc contrôle 70% des phosphates" → composants pertinents trouvés en 10 secondes.

## How to apply

**Début de session** :
1. Lire `memory/NEXT-ACTION.md` → recommandation active
2. Si reprise épisode → lire `memory/episodes/*/STATUS.md`
3. Avant de coder → lire `COMPOSANTS-INDEX.md`

**Fin de session** :
1. Mettre à jour `memory/NEXT-ACTION.md` (priorités + décisions)
2. Mettre à jour `memory/episodes/*/STATUS.md` si épisode touché
3. Mettre à jour `PIPELINE.md` si stage changé
