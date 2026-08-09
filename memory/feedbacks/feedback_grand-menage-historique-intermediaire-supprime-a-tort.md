---
name: grand-menage-historique-intermediaire-supprime-a-tort
description: Le commit "Grand Menage v2" (50a79a62, juin 2026) a supprimé les versions intermédiaires (v1/v2/v3), refs historiques et scènes de travail d'au moins un personnage (Mariama Bâ) en ne gardant que le fichier final renommé CANONICAL — perte de matière utile récupérable seulement via git history. Pattern à vérifier sur d'autres personnages/assets nettoyés au même moment.
metadata:
  type: feedback
---

## Contexte

Découvert le 2026-08-09 : le charsheet de Mariama Bâ (personnage GéoAfrique, écrivaine sénégalaise)
n'existait plus sur disque que sous forme d'un fichier `mariama-ba-charsheet-CANONICAL.png` —
ses versions intermédiaires (v1/v2/v3), refs historiques et une scène "table d'écriture" avaient
disparu. Root cause tracée : commit `50a79a62` ("chore(menage): Grand Menage v2 + acquis Mapbox/audio
Souverain", juin 2026) — le ménage a gardé le fichier final renommé CANONICAL mais supprimé tout
l'historique intermédiaire utile (`-3 GB` de suppression mentionnés dans le message de commit, portée
large : POC quebec-jacques, archives atlas-*-OLD, templates-research).

Restauré cette session via `git show <commit>:<path>` pour chaque version manquante.

## Why

Un "grand ménage" orienté volume disque (`-3 GB`) traite souvent "version intermédiaire d'un asset
validé" comme du contenu jetable équivalent à un vrai POC abandonné — alors que les itérations v1/v2/v3
d'un personnage peuvent redevenir utiles (comparaison de style, régénération d'une variante, base pour
un edit chirurgical) longtemps après que la version finale a été figée. Le renommage en `CANONICAL`
signale "ceci est la référence" mais ne signale pas "l'historique a été détruit" — l'absence est
silencieuse tant que personne ne cherche activement une v1/v2.

## How to apply

- **Avant de considérer un "grand ménage" passé comme sans conséquence**, si un chantier tombe sur un
  seul fichier `*-CANONICAL.*` ou `*-FINAL.*` sans trace de ses versions intermédiaires, vérifier
  d'abord si elles existent encore via `git log --all --full-history -- <pattern>` / `git show
  <commit>:<path>` avant de conclure qu'elles n'ont jamais existé — le fichier disque seul ne prouve
  rien sur l'historique produit.
- **Pattern à surveiller, pas confirmé étendu** : ce commit (`50a79a62`) a touché un périmètre large
  (POC, archives, templates-research, 148 fichiers modifiés) — d'autres personnages/assets nettoyés au
  même moment ont potentiellement subi la même perte d'historique intermédiaire sans qu'on l'ait encore
  remarqué. Si un futur chantier tombe sur un autre asset "orphelin de son historique", vérifier ce
  même commit en premier réflexe avant de creuser ailleurs.
- Cohérent avec la règle déjà documentée `feedback_worktree-git-isolation-gotchas.md` ("fichier absent
  → `find` disque entier AVANT git log") — ici l'ordre est inversé mais le principe est le même :
  l'absence sur disque n'est pas la fin de l'enquête, `git log`/`git show` peut retrouver ce qu'un
  ménage trop large a supprimé.
