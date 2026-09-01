---
name: Distinction /checkpoint (gstack) vs /memo (memory files)
description: Aziz utilise 2 commandes complementaires — /checkpoint pour snapshot session gstack, /memo pour mettre a jour les vrais fichiers memoire auto-charges
type: feedback
---

Migré depuis auto-memory 2026-08-31.

## Regle

Les deux commandes ont des roles distincts et ne se remplacent pas :

| Commande | Ou elle ecrit | Auto-chargee ? | Role |
|----------|--------------|----------------|------|
| `/checkpoint` (gstack) | `~/.gstack/projects/*/checkpoints/*.md` | **NON** (il faut `/checkpoint resume`) | Snapshot session court-terme, cross-branch Conductor, handoff |
| `/memo` (skill globale) | `memory/*.md` repo + `~/.claude/projects/*/memory/*.md` | **OUI** (fichiers repo auto-charges, auto-memory auto-charge) | Mise a jour memoire long-terme, session-a-session |

## Why

Avant que /memo existe, Aziz utilisait /checkpoint en pensant que ca mettait a jour les fichiers memoire projet. En realite, /checkpoint gstack est un systeme SEPARE qui vit dans son propre coin. Les fichiers `memory/` et `~/.claude/projects/*/memory/` etaient obsoletes entre sessions → causait des desalignements importants (ex: Soundjata Short — pensait 75s/5 clips alors que c'etait 129s/8 Actes).

## How to apply

- **Quand Aziz dit "sauvegarde"** ou "update memoire" en milieu/fin de session → **/memo** (c'est ce qu'il attend vraiment)
- **Quand Aziz dit "checkpoint"** → **/checkpoint** (snapshot gstack, cross-branch handoff)
- **Quand Aziz dit "les deux"** → executer /memo d'abord (met a jour les fichiers auto-charges), puis /checkpoint (snapshot session)

Les deux peuvent coexister dans la meme session sans conflit.

## Note (2026-08-31)
Le repo a depuis évolué vers les skills `session-close` / `wrap` / `context-save` / `context-restore`
pour la clôture de session — vérifier si cette distinction /checkpoint vs /memo est encore d'actualité
ou si elle a été remplacée par ce nouveau jeu de skills avant de s'y fier aveuglément.
