# Convention Handoff Inter-Agents — Format PIPELINE.md

> Adopté 2026-05-13. Révisé 2026-05-13 : ce fichier définit une **convention de nommage**
> pour les entrées de handoff dans PIPELINE.md — pas un mécanisme TodoWrite cross-agents natif.
>
> Pourquoi la révision : TodoWrite est une liste de tâches par session Claude.
> Il n'est pas garanti qu'une todo créée par un sub-agent soit visible dans la liste
> de Claude principal. PIPELINE.md reste le seul mécanisme de handoff fiable et éprouvé.

---

## Principe

Quand un agent termine son stage, il écrit une ligne de handoff dans PIPELINE.md
avec le format standard ci-dessous. Claude principal lit PIPELINE.md en début de session
et **propose à Aziz** de lancer le stage suivant.

Le chaining devient autonome uniquement dans une session `/goal` active.

---

## Format standard (NON-NEGOTIABLE)

```
[STAGE-N] [NOM-AGENT] [PROJET] — [statut]
```

Exemples :
```
[STAGE-1] audio-director niger-uranium — COMPLETE : narration-v5.mp3 + alignment.json
[STAGE-2] storyboarder niger-uranium — COMPLETE : timing.ts 7 beats, 2881 frames
[STAGE-3] visual-producer niger-uranium — APPROVED : Visual Plan validé Aziz
[STAGE-4] visual-producer niger-uranium — COMPLETE : 7 assets livrés public/assets/
[STAGE-5] remotion-composer niger-uranium — COMPLETE : mini-render validé out/mini-preview.mp4
[STAGE-6] quality-reviewer niger-uranium — APPROVE : 0 issue structurelle, prêt Aziz
[STAGE-6] quality-reviewer niger-uranium — MINOR FIX : Beat 3 palette drift → visual-producer
[STAGE-6] quality-reviewer niger-uranium — RE-EVALUATE : 3+ issues structurelles, circuit breaker
```

---

## Règle pour chaque agent (Session End)

**Avant de rendre la main, l'agent DOIT :**

1. Mettre à jour `.claude/agent-memory/shared/PIPELINE.md` (section détaillée — inchangé)
2. **Créer une todo COMPLETED** avec le format standard ci-dessus via TodoWrite
3. Si bloqué : créer une todo `in_progress` avec le blocage explicite

```
[STAGE-N] [AGENT] [PROJET] — BLOCKED : [raison] → attend [qui]
```

Exemple :
```
[STAGE-4] visual-producer niger-uranium — BLOCKED : Beat 3 image rejetée Kimi → attente Aziz
```

---

## Règle pour Claude principal (Session Start + monitoring)

Au début de chaque session OU après invocation d'un agent :

1. Lire les todos actives — repérer les `COMPLETE` non encore chainés
2. Si `[STAGE-N] [AGENT] [PROJET] — COMPLETE` → spawn agent Stage N+1 automatiquement
3. Si `BLOCKED` → présenter le blocage à Aziz avant toute action

**Séquence de chaining automatique :**

```
STAGE-1 COMPLETE  →  spawn storyboarder
STAGE-2 COMPLETE  →  spawn visual-producer (Visual Plan)
STAGE-3 APPROVED  →  spawn visual-producer (génération assets)
STAGE-4 COMPLETE  →  spawn remotion-composer
STAGE-5 COMPLETE  →  spawn quality-reviewer
STAGE-6 APPROVE   →  informer Aziz → render final si accord
STAGE-6 MINOR FIX →  spawn agent responsable du fix
STAGE-6 RE-EVALUATE → STOP → circuit breaker → Aziz
```

---

## Coexistence avec PIPELINE.md

| Fichier | Rôle | Granularité |
|---------|------|-------------|
| `PIPELINE.md` | Source de vérité détaillée — tous les paramètres, assets, décisions | Complète |
| TodoWrite | Signal de completion rapide — Claude principal peut agir sans lire PIPELINE.md | Minimal |

Les deux sont maintenus. TodoWrite ne remplace pas PIPELINE.md — il accélère le chaining.

---

## Exemple de session complète

```
Session start :
  Claude principal lit todos → voit [STAGE-2] storyboarder niger-uranium — COMPLETE
  → spawn visual-producer automatiquement pour Stage 3

Visual-producer termine Stage 3 :
  → écrit [STAGE-3] visual-producer niger-uranium — APPROVED dans TodoWrite
  → met à jour PIPELINE.md section détaillée
  → Claude principal voit APPROVED → spawn visual-producer Stage 4

Visual-producer termine Stage 4 :
  → écrit [STAGE-4] visual-producer niger-uranium — COMPLETE
  → Claude principal spawn remotion-composer

... et ainsi de suite jusqu'à STAGE-6 APPROVE
```

---

## Anti-patterns (BLOCK)

- Créer une todo COMPLETED avant que le stage soit vraiment terminé → faux signal
- Oublier de créer la todo après PIPELINE.md → Claude principal ne peut pas chaîner
- Utiliser un format non-standard → Claude principal ne reconnaît pas le signal
- Créer plusieurs todos pour le même stage → ambiguïté
