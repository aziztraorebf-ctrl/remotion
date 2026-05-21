# Scout Souverain — R&D bibliothèque templates

Branche : `feat/souverain-templates-library`
Démarré : 2026-05-08
Plan parent : `/Users/clawdbot/.claude/plans/ok-claude-avant-de-foamy-kernighan.md`

## Objectif

Cataloguer 13-17 chaînes YouTube référence pour identifier 3-5 templates Souverain en rotation. Output exploitable en Jour 2 (dissection).

## Méthode

Scout automatisé par sous-agents Claude :
- 1 agent par chaîne, traite 3-5 vidéos
- Extraction frames via yt-dlp + ffmpeg (1 frame / 5s)
- Analyse multimodale frame par frame
- Sauvegarde 5-10 frames sélectionnées + notes par vidéo
- Synthèse `_summary.md` par chaîne avec verdict 🟢/🟡/🔴

Aziz intervient sur 2 moments :
1. Validation format après agent test (Caspian Report)
2. Tri final synthèse → 10-15 candidats à passer en dissection

## Structure

```
par-chaine/
├── caspian-report/
│   ├── _summary.md          ← verdict agent + top idées à voler
│   ├── video-1-{slug}/
│   │   ├── notes.md         ← analyse 4 axes (palette/typo/mouvement/transition)
│   │   ├── frame-001.jpg    ← 5-10 frames sélectionnées
│   │   └── ...
│   └── video-2-{slug}/
└── [...autres chaînes]
```

## Critères d'analyse (4 axes)

Chaque agent évalue selon :
1. **Palette** : couleurs dominantes, contrastes, mood
2. **Typographie** : familles, hiérarchie headline/caption, animations texte
3. **Mouvement caméra** : zoom-pan, cuts, durée des plans
4. **Transitions** : entre scènes, entre échelles, entre data/carte

Verdict global par chaîne :
- 🟢 Garder pour dissection (différenciant, replicable Mapbox/Remotion)
- 🟡 Inspiration partielle (1-2 éléments à voler)
- 🔴 Skip (trop éloigné ou irreproductible)

## Liste des 17 chaînes

### Cartographie 2D flat
- [ ] RealLifeLore
- [ ] Map Men
- [ ] WonderWhy
- [ ] General Knowledge

### Satellite / géopolitique
- [ ] Caspian Report ← agent test
- [ ] Wendover Productions
- [ ] Geopolitics Explained
- [ ] PolyMatter

### Motion design éditorial presse
- [ ] Vox
- [ ] Le Monde
- [ ] Bloomberg Originals
- [ ] NYT Visual Investigations

### Wildcards
- [ ] Kurzgesagt
- [ ] Johnny Harris
- [ ] The Pudding
- [ ] Africa Eye (BBC)
- [ ] TLDR News Global

## Output final

`memory/templates-research/scouting/scout-souverain.md` — synthèse Claude :
- Tableau comparatif 17 chaînes
- Top 10-15 candidats pour dissection (Jour 2)
- 3-5 templates émergents pré-identifiés
- Recommandation Aziz pour Niger Uranium pilote
