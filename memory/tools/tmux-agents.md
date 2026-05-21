# tmux — Surveillance agents GeoAfrique en live

> Installe : 2026-05-13 (tmux 3.6a via Homebrew)
> Config : `~/.tmux.conf` (theme GeoAfrique, prefix Ctrl+a, mouse on)

## Lancer le layout agents

```bash
./scripts/tmux-agents.sh               # session "geoafrique-agents"
./scripts/tmux-agents.sh mon-episode   # session nommee
```

## Layout des 4 panneaux

```
┌──────────────────────────┬─────────────────────────────┐
│  PANNEAU 0               │  PANNEAU 1                  │
│  PIPELINE.md (tail -f)   │  Terminal agent             │
│  Voir handoffs en live   │  Lancer : claude            │
│                          │  Puis : /goal ou /bg        │
├──────────────────────────┼─────────────────────────────┤
│  PANNEAU 2               │  PANNEAU 3                  │
│  API Balance check       │  out/ watcher               │
│  check-api-balance.sh    │  Nouveaux renders detectes  │
└──────────────────────────┴─────────────────────────────┘
```

## Raccourcis clavier (prefix = Ctrl+a)

| Action | Raccourci |
|--------|-----------|
| Naviguer entre panneaux | Ctrl+h/j/k/l (sans prefix) |
| Split vertical | prefix + \| |
| Split horizontal | prefix + - |
| Recharger config | prefix + r |
| Scroller dans un panneau | Souris (scroll wheel) |
| Detacher session | prefix + d |
| Lister sessions | `tmux ls` |
| Rattacher session | `tmux attach -t geoafrique-agents` |

## Flux de travail typique

1. `./scripts/tmux-agents.sh` — ouvre le layout
2. Panneau 1 : `claude` — ouvre Claude Code interactif
3. Dans Claude Code : `/goal "Produire timing.ts pour Niger Uranium"` — lance en boucle autonome
4. Panneau 0 : PIPELINE.md se met a jour quand l'agent termine son stage
5. Panneau 2 : relancer `./scripts/check-api-balance.sh all` avant chaque generation
6. Panneau 3 : les nouveaux MP4 apparaissent quand remotion-composer livre

## Alertes visuelles

Quand un agent finit et qu'un autre panneau devient actif, la bordure du panneau
clignote en or (`#d4af37`). Permet de detecter une completion sans regarder en permanence.

## Commandes tmux utiles

```bash
tmux ls                          # lister les sessions actives
tmux attach -t geoafrique-agents # rattacher apres deconnexion
tmux kill-session -t nom         # tuer une session
tmux new-window -t geoafrique-agents  # ajouter une fenetre (ex: logs npm)
```

## Panneau supplementaire : logs Remotion Studio

Si tu veux voir les logs du dev server en meme temps :
```bash
# Dans tmux, prefix + c = nouvelle fenetre
# Puis dans cette fenetre :
npm start
```
