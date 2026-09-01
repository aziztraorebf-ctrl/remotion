# Production Dashboard HTML — Pattern Réutilisable

> Migré depuis auto-memory le 2026-08-31, contenu original inchangé. Créé 2026-04-24 pour Thiaroye
> V5. Les URLs Vercel Blob citées ci-dessous sont probablement expirées/obsolètes — le PRINCIPE
> reste valide, à re-vérifier avant de réutiliser un lien.

## Pourquoi

Observation fin session Thiaroye V5 Scene 1 (2026-04-23) : la boucle chat séquentielle "prompt -> validation -> génération -> review -> validation" crée 1h+ de latence en série pure. Plus le projet est long, plus le ratio "temps effectif vs temps attente" se dégrade.

**Solution Aziz** : dashboard HTML avec tous les prompts + statuts + coûts + historique visibles d'un coup, consultable sur mobile en asynchrone.

## Structure type

```
{project}-dashboard/
├── index.html              — Entree principale (multi-fichiers pour dev local)
├── dashboard-bundled.html  — Version mobile (tout inline) — pour Vercel Blob
├── dashboard.css           — Theme sombre + orange signature (#f5a623)
├── dashboard.js            — Rendu dynamique depuis scenes.json
├── data/
│   └── scenes.json         — SOURCE DE VERITE (prompts, statuts, couts, history)
├── scripts/
│   ├── sync-dashboard.py   — Sync etat disque -> scenes.json
│   └── build-bundled.py    — Genere dashboard-bundled.html (tout inline)
└── README.md
```

## Format scenes.json

```json
{
  "project": "...",
  "version": "1.0",
  "last_updated": "YYYY-MM-DD",
  "total_duration_s": <duree>,
  "format": "9:16",
  "style": "...",
  "narration_audio": "public/audio/.../narration.mp3",
  "forced_alignment": "public/audio/.../alignment.json",
  "charrefs": { "name1": "path", ... },
  "budget": { "initial": 30.0, "spent_so_far": 0, "remaining": 30.0 },
  "priority_test_next_session": { "title": "...", "description": "...", ... },
  "scenes": [
    {
      "id": "scene_id",
      "title": "...",
      "start_s": 5.26,
      "end_s": 18.14,
      "duration_s": 12.88,
      "narration": "texte narration",
      "status": "pending | todo | partial_done | done | failed",
      "type": "contemplative-observational | narrative | action | ...",
      "charref": "...",
      "image_source": "path | null",
      "clip_final": "path | null",
      "prompt_gemini": "...",
      "prompt_seedance": "...",
      "camera_movement_choice": "SAFE | MEDIUM | RISKY",
      "camera_movement_options": {
        "SAFE": "description",
        "MEDIUM": "description",
        "RISKY": "description"
      },
      "intrinsic_motions": ["motion1", "motion2", ...],
      "cost_estimated": 3.94,
      "cost_actual": 2.10,
      "notes": "...",
      "history": [
        { "version": "V1", "cost": 3.9, "result": "rejected" },
        ...
      ]
    }
  ],
  "rules_applied": [...]
}
```

## Workflow type pour un nouveau projet Short

### Phase 1 — Creation du dashboard (30 min upfront)
1. Copier le dossier template `thiaroye-v5-dashboard/` sous un nouveau nom
2. Editer `data/scenes.json` avec les scenes du nouveau projet (narration, durees, types)
3. **Laisser l'agent visual-producer rediger les prompts Gemini + Seedance + options camera** (PAS Claude orchestrateur — lecon 2026-04-23)
4. Regenerer `dashboard-bundled.html` via `scripts/build-bundled.py`
5. Upload Vercel Blob pour acces mobile

### Phase 2 — Consultation asynchrone (Aziz, avant session)
- Lit le dashboard sur mobile
- Note modifications desirees directement dans `scenes.json` (ou en debut de session)

### Phase 3 — Production (session active)
- Les prompts sont pre-valides → moins de debat en live
- Generation scene par scene OU batch parallele (images Gemini, clips Seedance sequentiel pour cout)
- Apres chaque generation : `python3 scripts/sync-dashboard.py` met a jour le dashboard
- Re-upload bundled si modifications importantes

## Avantages observes

- **Asynchrone** : Aziz consulte/modifie a son rythme
- **Source de verite unique** : pas de desalignement doc/code/chat
- **Mobile-friendly** : theme sombre, typographie adaptee
- **Reutilisable** : template adaptable par copie + edit JSON
- **Historique preserve** : versions successives tracees dans `history[]`

## Scripts utilitaires

**sync-dashboard.py** : scanne `public/assets/{project}/` et `public/audio/{project}/` pour detecter nouveaux fichiers + update `scenes.json` automatiquement

**build-bundled.py** : genere version HTML tout-en-un (CSS + JS + JSON inlined) pour upload Vercel Blob sans dependances

## Deploiement

```bash
python3 scripts/tools/upload-to-blob.py {project}-dashboard/dashboard-bundled.html --folder {project}-dashboard
```

URL unique mobile-accessible retournee. ⚠️ Cette recommandation Vercel Blob date d'avant la doctrine
Artifact-par-défaut actuelle (cf. CLAUDE.md § Communication mobile) — pour une page HTML aujourd'hui,
préférer l'Artifact Claude en premier réflexe.

## Principe fondamental

**Le dashboard reduit la charge cognitive d'Aziz (Aziz decide sur mobile asynchrone) et permet la delegation a l'agent visual-producer sans chaque decision passer par le chat.**

---

## Insight cle Thiaroye V5 (2026-04-25) — Le dashboard = brief operationnel executable

**Apres 4 sessions d'echecs avec orchestration agents automatique, Aziz a produit les 8 clips Thiaroye V5 manuellement avec Claude Desktop en moins de 24h. Constat post-mortem :**

- **80-90% du travail creatif etait deja fige dans le dashboard** (prompts Gemini + Seedance pre-rediges, options camera SAFE/MEDIUM/RISKY, palettes, timing, mouvements intrinseques, charrefs)
- **Claude Desktop n'a fait que valider, raffiner, executer** — il n'a quasi rien invente from scratch
- Le succes ne vient PAS du format conversationnel ni de Claude Desktop specifiquement — il vient du fait que le **dashboard agissait comme brief operationnel pre-valide**

### Regle deduite

**Toute production de Short doit demarrer par construire le dashboard AVANT tout appel API.**

- Si dashboard incomplet -> bloquer la production payante (Seedance, Gemini, ElevenLabs)
- Workflow par defaut : **edition d'un prompt deja present dans le dashboard** (le dashboard est la source de verite)
- Reecriture from scratch autorisee quand : (a) creation d'une image vraiment nouvelle non prevue, ou (b) changement majeur ou le prompt existant est obsolete (un prompt obsolete est pire qu'un nouveau)
- 100% du dashboard = irrealiste. Cible : 80-90% fige. Le reste se decide en session sur des cas precis.

### Implications pratiques

- Investir le temps de prep dashboard = retour sur investissement immediat
- Le dashboard est le livrable structurant du projet, pas un outil de visualisation accessoire
- Tout futur agent visual-producer doit s'appuyer sur le dashboard comme source unique — jamais sur scenes.json brut ni sur du contexte ad-hoc

Valide 2026-04-25 par Aziz post-production manuelle Thiaroye V5.

---

## Evolution v1.3 — Abou Bakari II (2026-04-26) — Schema enrichi

Le dashboard Abou Bakari II a fait evoluer le schema scenes.json par rapport a la version Thiaroye. Champs supplementaires valides :

### Champs supplementaires par scene (Abou Bakari II v1.2)

```json
{
  "clip_needs_complement": true,
  "clip_strategy": "clip principal 10s + Video Extend 4s post-narration",
  "complement_strategy": "video_extend_seedance",
  "complement_duration_s": 4,
  "complement_note": "raison narrative du complement",
  "duration_check": "narration Xs > 10s max Seedance — split obligatoire. Clip 10s + complement Ys.",
  "epoch_check": {
    "vetements": "detail verification epoque",
    "armes": "detail ou N/A",
    "architecture": "detail ou N/A",
    "pirogues": "detail ou N/A"
  },
  "image_url_vercel": "URL Vercel publique de l'image validee",
  "corrections": ["v1: issue detectee — fix applique", ...],
  "history": [
    { "version": "v1", "result": "description du resultat" },
    { "version": "v2", "result": "VALIDE — description" }
  ]
}
```

### Champs top-level supplementaires (Abou Bakari II)

```json
{
  "epoch": "Mali XIVe siecle (1311)",
  "epoch_spec": {
    "vetements_royaux": "...",
    "vetements_communs": "...",
    "armes": "...",
    "pirogues": "...",
    "architecture": "...",
    "palette": "..."
  },
  "rules_applied": ["R-VIVANT v3", "R-NO-PARTICLES", ...],
  "charrefs": {
    "nom_clef": {
      "file": "path/local",
      "url_vercel": "URL Vercel",
      "status": "validated"
    }
  }
}
```

### Section musique (dashboard HTML)

Section dedicee `<section class="music-section">` avec :
- 2 players audio `<audio controls preload="none" src="URL_Vercel">` (jamais base64)
- Label variante + badge "SELECTIONNE"
- Description style (artiste reference, emotion, scenes d'usage)

### Charrefs section (dashboard HTML)

Grille scrollable horizontale avec :
- Toutes les images charrefs depuis URLs Vercel (jamais chemins locaux)
- Style anchor(s) dans la meme grille
- `<img>` avec lightbox au clic
- Format : `CHARREFS_META = { nom: 'Label lisible' }` + `STYLE_ANCHORS = [{ url, label }]`

### Responsabilites mises a jour

| Section | Responsable |
|---|---|
| Header (titre, version, date, style) | Claude (orchestrateur) au moment du build |
| Summary (duree, compteur, budget, barre progression) | Calcule dynamiquement depuis scenes.json |
| Regles actives | Visual-producer (depuis RULES-ACTIVE.md) |
| References style (charrefs + style anchor) | Visual-producer + upload Vercel des refs |
| Musique (players + descriptions) | Claude (orchestrateur) — choix valide par Aziz |
| Cartes de scene (tout) | Visual-producer |
| epoch_spec | Visual-producer (avant generation des images) |
| corrections + history | Visual-producer (mis a jour en temps reel pendant iterations) |
| Upload Vercel final | Claude (orchestrateur) via upload-to-blob.py |
