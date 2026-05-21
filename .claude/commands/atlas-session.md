# /atlas-session — Bilan de session Atlas

Lance l'orchestrateur de session Atlas : bilan épisode, audit assets, checks techniques, next actions priorisées avec commandes exactes.

Fonctionne pour tout épisode Atlas (peste-1347, hannibal, empire-ghana, etc.).

## Comportement selon le mode de déclenchement

### `/atlas-session` (sans argument)

Claude demande :
1. Sur quel épisode ? (slug exact : peste-1347, hannibal, empire-ghana...)
2. Beats ciblés ? (laisser vide = tous les beats sans FINAL)

Puis exécute :
```bash
python3 scripts/atlas-session.py --episode [episode]
```

### `/atlas-session [episode]`

Épisode connu, beats non-FINAL détectés automatiquement :
```bash
python3 scripts/atlas-session.py --episode [episode]
```

### `/atlas-session [episode] [N]`

Épisode + beat ciblé :
```bash
python3 scripts/atlas-session.py --episode [episode] --beat [N]
```

### `/atlas-session [episode] [N] [M] [...]`

Plusieurs beats ciblés :
```bash
python3 scripts/atlas-session.py --episode [episode] --beats [N] [M] [...]
```

---

## Ce que le rapport produit

1. **BILAN ÉPISODE** — tableau Beat1→BeatN : FINAL / WIP / TSX / TODO
2. **ASSETS AUDIT** — pour chaque asset : static.png, frames anim, RGB check, ref i2i
3. **SPRITES DANS TSX** — détection croisée sprites utilisés vs assets disponibles
4. **CHECKS TECHNIQUES** — spec table, Atlas patterns A1/A2/A3, registration Root.tsx
5. **NEXT ACTIONS** — liste priorisée CRITIQUE > MANQUANT > MINEUR > PRÊT avec commandes copier-coller

Rapport sauvegardé dans `/tmp/[episode]-session-report.md` et `memory/COMPACT_CURRENT.md` mis à jour.

---

## Règle absolue

Toujours lancer `/atlas-session` en **début de session** avant de coder quoi que ce soit.
Ne jamais improviser l'état des assets ou des beats depuis la mémoire — ce script est la source de vérité.
