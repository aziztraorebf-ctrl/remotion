---
name: methode-test-reproductibilite-agent-vierge
description: Comment PROUVER qu'un systeme/pipeline est reproductible — agent vierge isole en worktree, solution cachee, divergences = trous de doctrine.
metadata:
  type: feedback
---

# Methode — Prouver la reproductibilite d'un systeme par un AGENT VIERGE ISOLE

**Why** : un systeme « marche » dans ma tete (contexte sature) ne prouve RIEN sur sa reproductibilite. La seule
preuve qu'un pipeline est grave et complet : un executant SANS contexte le rejoue du 1er coup et arrive au meme
livrable. Chaque endroit ou il a du DEVINER = un trou de doctrine a combler. Prouve 2x le 2026-06-20 sur le
workflow data-viz ([[WORKFLOW-DATAVIZ]]) : repro ~86% du 1er coup, a revele un script fantome non versionne.

**How to apply** :

## Le protocole (test ultime)
1. **Isoler** : lancer l'agent dans un `git worktree` propre (`superpowers:using-git-worktrees`), contexte frais,
   effort eleve. L'agent ne partage PAS mon contexte de session.
2. **CACHER la solution** : deplacer/renommer physiquement le livrable de reference (render final, code cible)
   hors de portee de l'agent. S'il peut le lire, il copie au lieu de reproduire — le test ne prouve rien.
   ⚠️ GOTCHA : un worktree supprime = le code produit par l'agent est PERDU. Recuperer le diff/les fichiers
   AVANT de nettoyer le worktree (cp vers /tmp ou commit dans le worktree).
3. **Donner SEULEMENT les entrees** : la doctrine + les scripts + le point de depart (storyboard/brief), comme
   un nouvel arrivant. Pas la reponse, pas mes notes de session.
4. **Lui faire rejouer le pipeline BOUT EN BOUT** du 1er coup (pour le data-viz : breakdown -> regen assets ->
   detourage -> assemblage Remotion -> diff). Pas de coup de pouce en cours de route.
5. **Mesurer la fidelite** au livrable de reference (revele a la fin seulement) : % de reproduction + LISTE des
   points ou l'agent a du deviner/inventer.

## Lire le resultat
- **Chaque divergence = un trou de doctrine**, PAS une faute de l'agent. Si l'agent a devine, c'est que la
  doctrine ne tranchait pas. Combler le trou (graver la decision dans le template/la doctrine/un gate scripte).
- Les **divergences recurrentes** (apparaissent chez moi ET chez l'agent) sont les plus precieuses : ce sont des
  faiblesses STRUCTURELLES du systeme, pas du bruit. Ex data-viz : picto+label « reserves mondiales » sous-
  dimensionne 2x -> cable en dur dans le breakdown + `dataviz-selfreview.py` (E1/E2).
- Un trou peut etre un **artefact d'environnement** : le test data-viz a revele que `openrouter-vision-breakdown.py`
  n'etait pas versionne (script fantome) — l'agent isole ne l'avait pas. Sans agent vierge, jamais vu.

## Quand l'utiliser
- Apres avoir declare un systeme « prouve / grave » : c'est le test qui transforme « ca marche » en « c'est
  reproductible ». A relancer apres avoir comble des trous, pour mesurer le gain (ex viser ~86% -> ~95%).
- Pas pour un one-shot : reserve aux SYSTEMES qu'on veut deleguer (pipelines, doctrines, beats repetables).

## Lien avec l'orchestration
C'est la version « preuve » de la regle DELEGUER A UN AGENT FRAIS (CLAUDE.md) : un agent vierge bat souvent
l'instance principale saturee pour PRODUIRE ou VERIFIER. Ici on s'en sert pour VERIFIER le systeme lui-meme.
Handoff = fichier disque, jamais TodoWrite cross-agent. Voir [[REPRISE-WORKFLOW-DATAVIZ]].

<!-- RAPATRIÉ le 2026-08-18 depuis .claude/.../memory/methode-test-reproductibilite-agent-vierge.md
     (racine, 2026-06-25). Ces 2 blocs n'existaient QUE dans cette copie. -->

## ⚠️⚠️ GOTCHA — SYSTÈME NON COMMITÉ = ABSENT DU WORKTREE (re-confirmé 2026-06-21)
Un worktree ne contient QUE le HEAD committé. Tout fichier `?? untracked` du working tree partagé
(script, harnais, assets, SFX, doctrine pas encore commitée) est ABSENT chez l'agent → il bloque
d'entrée et doit bootstrapper à la main.
**LEÇON** : si le système à tester n'est PAS encore commité, soit le COMMITER d'abord (recommandé),
soit prévoir l'étape de bootstrap dans le prompt (script + harnais + `.env` + assets).
⛔ Ce blocage est **logistique, PAS doctrinal** — ne pas le confondre avec un vrai trou de reproductibilité.

## Variante légère — AUDIT DE NAVIGABILITÉ (sans worktree, sans render)
Prouvée le 2026-06-25 sur la bibliothèque SVG GGW :
- Donner à l'agent 5 questions concrètes sur des sujets couverts par le système.
- Lui faire noter CHAQUE fichier lu + la difficulté (FACILE / MOYEN / DIFFICILE).
- Lui demander le VERDICT GLOBAL + les 1-3 lacunes prioritaires.
- Résultat : 4/5 FACILE, 1 MOYEN. 3 lacunes corrigées dans la foulée (lien mort, 4 registres en TODO,
  décision éditoriale non tranchée = lacune de DÉCISION, pas de système).

**Quelle variante quand ?**
- **Worktree isolé** → prouver qu'un workflow PRODUIT quelque chose (render, code, asset).
- **Audit navigabilité** → prouver qu'un SYSTÈME DE RÉFÉRENCE (doctrine, index) est lisible par un agent vierge.
Les deux sont complémentaires : le worktree prouve la PRODUCTION, l'audit prouve la NAVIGATION.

