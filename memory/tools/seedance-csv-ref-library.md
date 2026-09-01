# Seedance CSV Reference Library

> Migré depuis auto-memory 2026-08-31 (créé 2026-04-18). Workflow pour chercher, telecharger et
> utiliser des clips Seedance prouves comme video refs — CSV 1936 prompts avec URLs directes.
> Complète `memory/tools/motion-reference-transfer.md` (technique reference-to-video) avec la
> SOURCE des clips de référence.

## Source

Fichier CSV : `~/Downloads/seedance-2-0-prompts-20260418.csv`
- **1 936 entrees** (multilignes), **1 830 avec videos**
- **47 avec images ref** (workflow Omni documente)
- ~60% chinois, ~40% anglais
- Colonnes : id, title, description, content, sourceLink, sourcePublishedAt, author, sourceMedia, sourceReferenceImages, sourceVideos

## Script de recherche

`scripts/tools/search-seedance-refs.py` — recherche par mots-cles dans le CSV (⚠️ vérifier existence avant réutilisation, script daté 2026-04-18)

```bash
# Recherche simple
python3 scripts/tools/search-seedance-refs.py "FPV flyover ancient kingdom" --top 5

# Privilegier les entrees recentes (avril 2026+)
python3 scripts/tools/search-seedance-refs.py "battle charge" --recent

# Exclure des styles non pertinents
python3 scripts/tools/search-seedance-refs.py "warrior sword" --exclude "fantasy,dragon,robot"

# Telecharger les meilleurs resultats
python3 scripts/tools/search-seedance-refs.py "cavalry battle" --download
```

## Workflow valide (2026-04-18)

```
1. Aziz decrit la scene (langage naturel, mouvement camera)
2. Claude cherche dans le CSV (par MOUVEMENT CAMERA, pas par sujet)
3. Claude telecharge les 2-3 meilleurs candidats via yt-dlp (pas curl direct — URLs Twitter expirent)
4. Claude extrait 4 frames + les regarde lui-meme (Read tool)
5. Claude donne son verdict : GARDER / PASSER + justification
6. Aziz regarde le lien X seulement pour les candidats valides
7. Si bon : copier dans motion-library/, generer preview PNG
8. Si mauvais : supprimer immediatement (zero accumulation)
```

## Lecons cles (tests 2026-04-18)

### Chercher par mouvement camera, pas par sujet
- "FPV flyover ancient kingdom" >> "african village historical"
- Le sujet de la ref n'importe pas (Anga, Rome, Tokyo) — Seedance prend le MOUVEMENT, pas le contenu
- Les clips Seedance comme refs sont meilleurs que des clips de films (meme "langage visuel")

### Filtres qui marchent
- `--recent` : privilegier avril 2026+ (prompts plus matures vs experimentation mars)
- `--exclude` : eliminer les styles parasites (fantasy, dragon, robot, sci-fi)
- Style penalties integrees : gun, pistol, stickman, car, alien penalises automatiquement
- Prompt length signal : >4000 chars = souvent sur-ingenierie, 500-2000 = sweet spot

### Limites identifiees
- Le titre/description ne reflete pas toujours le contenu reel de la video
- Certains comptes X sont suspendus (URLs mortes)
- curl direct sur URLs Twitter ne marche plus — utiliser yt-dlp
- Le mot "fantasy" en exclude filtre aussi "historical-fantasy" (faux positif)
- Peu de clips de "deux armees qui chargent" — la majorite c'est hero shot solo ou fantasy

### Patterns de prompt identifies dans le CSV
1. Header format en capitales : `FORMAT: 15s / 6 CUTS / Epic Historical`
2. Storyboard temporel : `[00:00-00:04] Shot 1:` — technique multi-cut confirmee
3. Verbes actifs, jamais "slowly" — confirme la regle anti-mots-lents (cf `memory/tools/seedance-rules.md`)
4. Precision materiaux : "burnished iron spear tips" >> "warriors with weapons"
5. Camera impossible (locked behind arrow) = technique anti-glitch

## Bibliotheque de refs construite

Emplacement : `public/assets/library/references/motion-library/` (⚠️ vérifier existence — dossier daté avril 2026)

| Categorie | Clips |
|-----------|-------|
| combat/ | anime-duel-8s |
| discours-proclamation/ | push-in-oppenheimer-6s, hero-shot-gladiator-arena-15s (CSV) |
| foule-armee/ | pullback-drone-beach-6s |
| marche-voyage/ | tracking-walk-boulevard-6s |
| moment-dramatique/ | dolly-in-intense-6s, crane-pullback-samurai-sunset-15s (CSV) |
| panorama-lieu/ | aerial-drone-paris-6s, arc-orbit-basterds-6s, fpv-ancient-kingdom-anga-15s (CSV), plan-sequence-night-market-15s (CSV) |

4 clips issus du CSV (marques "CSV"), les autres de StudioBinder/YouTube.

## Top auteurs CSV — a suivre

| Auteur | Handle | Clips | Specialite | Pertinence |
|--------|--------|-------|-----------|------------|
| **Changning Liu** | @ChangningL29508 | 83 | Plan-sequences impossibles (Format 4+5), timelapses civilisation, steadicam chase | HAUTE — inventeur des Formats 4 et 5. Night Market garde comme ref. |
| **Dheepan Ratnam** | @Dheepanratnam | 65 | Batailles epiques, action cinematique, prompts courts (~250 chars) | HAUTE — mais beaucoup de ses clips mars sont morts (tweets supprimes) |
| **Shushant Lakhyani** | @shushant_l | 6 | FPV royaumes antiques (Format 9). Template identique, 100% succes | HAUTE — Anga Kingdom garde comme ref. Template sauvegarde. |
| **李岳 (liyue)** | @liyue_ai | 48 | Transitions epoques (Format 6), CG, ambiance | HAUTE — inventeur du Format 6 (slow-mo orbital) |
| **Aimi Koda** | @aimikoda | 30 | Beat sync routines (Format 7), POV, prompts ultra-courts ~300 chars | MOYENNE — inventrice du Format 7 |
| **Adam/吉米** | @Adam38363368936 | 56 | Wuxia, parkour, POV travel vlog, prompts ~440 chars | MOYENNE — techniques wuxia adaptables combat |

### Insight cle sur les auteurs
- Les auteurs proliques qui postent depuis fevrier ont souvent des **tweets mars supprimes** — les URLs video sont mortes
- Les clips **avril 2026** sont beaucoup plus fiables (URLs vivantes)
- La qualite ne depend PAS de la longueur du prompt : Dheepan fait 250 chars, Changning fait 2000+ chars, les deux produisent du 10/10
- Suivre ces auteurs sur X pour voir leurs nouveaux clips = source continue de refs et templates

## Regle de gestion des refs
- Garder SEULEMENT les clips pertinents dans la bibliotheque
- Supprimer immediatement les rejets (zero accumulation sur disque)
- Chaque clip garde = preview PNG generee a cote
- Si un clip sert a une generation Seedance, on peut le supprimer apres si plus utile
