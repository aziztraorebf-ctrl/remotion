# Thiaroye V5 — Production Dashboard

Source de vérité unique pour la production Thiaroye V5 Short 9:16.

## Comment utiliser

### En local (recommandé — accès aux dernières données)

```bash
cd thiaroye-v5-dashboard
python3 -m http.server 8080
# Ouvrir http://localhost:8080 dans un navigateur
```

### Sur mobile

Upload sur Vercel Blob :
```bash
cd thiaroye-v5-dashboard
# TODO: script d'upload du dossier complet
```

## Structure

```
thiaroye-v5-dashboard/
├── index.html          — Entrée principale
├── dashboard.css       — Styles (mobile-first, dark theme orange)
├── dashboard.js        — Rendu dynamique depuis scenes.json
├── data/
│   └── scenes.json     — Source de vérité (prompts, statuts, coûts, historique)
└── scripts/
    └── sync-dashboard.py — Sync état disque → scenes.json
```

## Workflow typique prochaine session

1. **Consulter le dashboard** (mobile ou desktop) pour voir l'état global
2. **Lire les prompts pré-remplis** pour chaque scène (Gemini + Seedance)
3. **Valider ou modifier** les prompts directement dans `scenes.json` si besoin
4. **Lancer la génération** scène par scène via scripts dédiés
5. **Re-sync le dashboard** après chaque génération : `python3 scripts/sync-dashboard.py`
6. **Revoir les résultats** sur le dashboard

## Avantages vs approche chat pur

- **Asynchrone** : tu consultes/modifies à ton rythme, pas de pression latence
- **Contexte unique** : tout est visible d'un coup (statuts, prompts, coûts, historique)
- **Mobile-friendly** : thème sombre, typographie adaptée, lecture confortable sur téléphone
- **Source de vérité** : `scenes.json` est la vérité unique. Pas de désalignement entre doc et code.
- **Réutilisable** : template adaptable pour Abou Bakari II et tous projets Shorts futurs.

## Règles appliquées (visibles dans dashboard)

- R-VIVANT-PARTOUT
- R-PROMPT-SONJATA-CHOREGRAPHIQUE
- R-REVIEW-MINIMAL
- R-SEEDANCE-SOBRE
- R-CAMERA-OPTIONS
- R-PROMPT-LIBERAL v2
- R-PC17 (dot-eyes stricts)
- R-PC19 (graphique stylisé Scene 3)

## État initial (2026-04-23)

- Scene 1 : **partial_done** (clip V5 validé 7s, reste complément 6s)
- Scenes 2-6 : **todo** (prompts pré-remplis selon formule V5)
- Hook : **pending** (réutilisation frame Scene 2)
- Budget : ~$18.70 restants sur $30 initial
