# Session Shaka Zulu Vague 2 — Lessons & Lecons

> Session : 2026-05-02 apres-midi (apres nuit autonome)
> Branche : `feat/atlas-shaka-zulu-vague1`
> Resultat : 3 inserts ameliores (note moyenne 6.8 → 8.5/10), workflow Jury 2 PASSES valide

---

## Ce qui a fonctionne — patterns a reutiliser

### 1. Workflow Jury Hybride a 2 PASSES (NOUVEAU pattern valide)

**Pass 1 — Vision diversifiee** (deja existant) :
- 5 questions methodologiques ouvertes a 3 LLMs en parallele
- But : explorer espace creatif + identifier angles morts
- Output : `JURY-SYNTHESE.md`
- Cout : ~$0.03

**Pass 2 — Validation lockdown** (NOUVEAU sur cette session) :
- 4 questions operationnelles ciblees apres tri Aziz
- Q1 : validation idee par idee (oui/non/amendement)
- Q2 : implementation par outil (decoupage SVG/d3-geo/PixelLab/Gemini)
- Q3 : question stylistique critique propre au projet
- Q4 : gap detection (8e idee + pieges techniques)
- Cout : ~$0.02-0.05

**Resultat concret** : passage de "creativite generale" a "recettes techniques precises avec amendements". 3 amendements convergents identifies, 1 idee nouvelle ajoutee, 3 pieges techniques anticipes.

→ A appliquer sur tous les futurs Atlas (Tombouctou episode 2, etc.)

### 2. Pattern d'iteration Kimi sur quick wins

Apres avoir produit des composants en local (cartouches, cornes, paper-grain), envoyer chaque MP4 a Kimi avec brief structure :
- Q1 lisibilite mobile exterieur
- Q2 fond / contraste palette
- Q3 hierarchie visuelle
- Q4 narratif vs technique
- Q5 3 ameliorations concretes <20 min applicables maintenant

Resultat : 6.8 → 8.5/10 en ~25 min de fixes. ROI eleve.

→ A reutiliser sur **chaque insert critique** avant de figer la production.

### 3. Convergence Kimi 3/3 = signal fort a appliquer immediatement

Quand 3 reviews convergent sur le meme probleme, c'est verifie. Ici :
- "Fond NOIR_PROFOND #0D0D0D = trop agressif mobile" → 3/3 d'accord → fix immediat (CARTE_FOND #1A1208 gradient)
- "Texte sources trop petit" → 3/3 d'accord → fix immediat (22px bold + stroke)
- "Halo bordeaux trop discret" → 3/3 d'accord → fix immediat (#B91C1C sature + glow externe)

→ Quand 3 LLMs convergent, ne pas debattre, appliquer.

### 4. Cleanup Vercel Blob via API

693 MB liberes en 30s via boucle `POST /delete` sur les URLs. Script reutilisable dans `/tmp/blob_cleanup.py`.

→ A executer chaque fois qu'un ancien projet est termine et que ses WIPs encombrent Vercel.

### 5. Decouverte importante sur sprites PixelLab archive

**Les dossiers `archive/<perso>-<animation>-east/frame_XXX.png` ne sont PAS des walk cycles.** Ce sont 6 designs alternatifs d'un personnage. Les boucler = effet "palpitation" desastreux.

**Les vrais walk cycles** sont dans `characters/<perso>/animations/<animation-id>/<direction>/frame_XXX.png` (PixelLab MCP officiel).

→ Documente dans `feedback_remotion-pixellab-gotchas.md` regle 12.

---

## Ce qui n'a pas fonctionne — anti-patterns a eviter

### 1. Supposer qu'un dossier `frame_XXX.png` est un walk cycle

J'ai utilise les 6 frames `archive/warrior-walk-east/frame_000-005.png` en boucle a 12fps en supposant que c'etait une animation. Resultat : personnages qui changent de design a chaque frame. Aziz a immediatement repere.

**Lecon** : avant d'utiliser un dossier PixelLab en boucle, lire 2-3 frames espacees avec le tool Read et verifier visuellement la continuite. Si ce sont 6 personnages differents → utiliser UN seul frame statique.

### 2. Path relatif apres `cd` cause re-write au mauvais endroit

J'ai utilise `cd dossier && npx remotion render ... output.mp4`. Le shell etait dans `dossier/` quand `--output` est interprete relatif. Resultat : fichier ecrit dans `dossier/dossier/output.mp4` au lieu de `dossier/output.mp4`.

**Lecon** : pour les renders, **toujours utiliser des chemins absolus** ou rester a la racine du projet. Eviter `cd` qui decale le working directory.

### 3. Annoncer "j'ai lance PixelLab" sans verifier les assets existants

Au debut de la session, j'allais lancer 5 generations PixelLab pour la caravane impi avant de verifier ce qu'on avait deja. Decouverte tardive : tous les sprites necessaires existaient dans `public/atlas-shaka-zulu/{characters,archive,assets,inserts}/`.

**Lecon** : scan systematique avant generation (regle 11 du `feedback_remotion-pixellab-gotchas.md`).

### 4. Vercel Blob "store_suspended" persistant apres cleanup

Apres avoir libere 693 MB via API delete, le flag `store_suspended` est reste actif. L'API Vercel ne le lift pas automatiquement.

**Lecon** : pour les briefs Kimi avec assets visuels, utiliser **base64 directement dans le prompt** (option B) plutot que upload Vercel Blob → URL publique. Plus rapide, pas de dependance a un store qui peut etre flague.

→ Documente dans `feedback_vercel-blob-suspended-after-cleanup.md`.

### 5. Affirmation chiffree d'un LLM stale (alerte format 150s Gemini)

Gemini Pass 1 a affirme avec confiance "YouTube Shorts max 60s, ton 150s sort du Shorts Feed". WebSearch a revele que YouTube a etendu Shorts a 3 minutes en oct 2024. Si on n'avait pas verifie, on aurait decoupe le script en 3 Shorts inutilement (1 journee perdue).

**Lecon** : verifier via WebSearch toute affirmation chiffree d'un LLM sur regles de plateformes/durees/quotas avant d'agir.

→ Documente dans `feedback_jury-verification-rules.md`.

---

## Decisions actees pour Shaka Zulu

| Decision | Rationale |
|----------|-----------|
| Format 150s long-form vertical | YouTube Shorts max 3 min depuis oct 2024, ne pas decouper |
| Hook = clip Seedance papercraft + typo gravure + transition Depliage Parchemin | Pattern prouve sur Sonjata/Thiaroye/Mansa Moussa, evite SVG silhouette manuel |
| Cornes = 2 arcs Bezier SVG pur (pas Recraft, pas Gemini) | Approche tactique, pas illustration biologique. Convergence 3/3 LLMs Pass 2 |
| Carte d3-geo reutilisee de Mansa Moussa V2, palette Shaka | Pattern infrastructure cross-episodes, comme Johnny Harris/Vox |
| Fond CARTE_FOND #1A1208 (gradient radial) au lieu de NOIR_PROFOND #0D0D0D | Convergence 3/3 Kimi : noir pur "trou visuel" + risque mobile exterieur |
| Filtre PaperGrain transversal (intensity 0.18) sur composition entiere | Unifie textures Seedance + d3-geo + PixelLab + SVG (Gemini Pass 2 Q1) |
| Animation typo 4 actes S2 ajoutee priorite haute | Idee nouvelle Grok Pass 2, structure visuellement S2 |

---

## Composants livres cette session

### Nouveaux composants Remotion
- `src/projects/shaka-zulu/components/SourceCartouche.tsx` — cartouche source academique reutilisable (bordure or, leader lines, typo CORPS)
- `src/projects/shaka-zulu/components/CornesFrame.tsx` — signature visuelle 2 arcs Bezier, 3 variantes (open/close/pulse)
- `src/projects/shaka-zulu/components/PaperGrain.tsx` — filtre transversal grain papier (`feTurbulence` overlay mix-blend-mode)

### Nouvelles scenes (demos pour validation)
- `src/projects/shaka-zulu/scenes/CornesFrameDemo.tsx` — version technique pure (geometric)
- `src/projects/shaka-zulu/scenes/CornesFrameNarrative.tsx` — version narrative (sprites zoulous + cornes + halo + typewriter)
- `src/projects/shaka-zulu/scenes/PaperGrainDemo.tsx` — demo filtre transversal sur palette

### Inserts modifies
- `src/projects/shaka-zulu/inserts/InsertIklwaSchema.tsx` — fond gradient + glow lame + croix bordeaux qui se trace + pulsation lame + cartouche source
- `src/projects/shaka-zulu/inserts/InsertBouclierSchema.tsx` — fond gradient + halo danger pulsant double (or + bordeaux sature) + cartouche source

### Renders finaux locaux
- `public/atlas-shaka-zulu/renders/vague2-quickwins/iklwa-v2.mp4` (513 KB, 5.0s)
- `public/atlas-shaka-zulu/renders/vague2-quickwins/bouclier-v2.mp4` (944 KB, 9.3s)
- `public/atlas-shaka-zulu/renders/vague2-quickwins/cornes-narrative-v4.mp4` (1.0 MB, 5.0s) — version finale avec warriors qui convergent vers le centre

---

## Memoires globales mises a jour

| Fichier | Type | Contenu |
|---------|------|---------|
| `workflow_jury-creative-vision.md` | workflow | Pattern 2 PASSES (creatif + lockdown) |
| `feedback_jury-verification-rules.md` | feedback | Verifier affirmations chiffrees jury via WebSearch |
| `feedback_remotion-pixellab-gotchas.md` regle 11 | feedback | Scanner assets existants AVANT generation PixelLab |
| `feedback_remotion-pixellab-gotchas.md` regle 12 | feedback | Verifier visuellement les "frames" PixelLab avant boucle |
| `feedback_vercel-blob-suspended-after-cleanup.md` | feedback | Flag suspended persistant apres delete |

---

## Cout total session

- Jury Pass 1 : $0.029
- Jury Pass 2 : $0.0233
- Kimi reviews x3 : ~$0.10 (3 inserts)
- **Total : ~$0.15** pour passer 6.8 → 8.5/10 sur 3 inserts + verrouiller toute la vague 2

---

## Prochaine session — points d'entree

1. **Hook** (idee 1 priorite haute) : Gemini image source "Shaka adulte de dos contemplant KwaZulu-Natal" → Seedance clip 5s → typo gravure Cormorant → transition "Depliage de Parchemin"
2. **Carte d3-geo Shaka** (idee 3 priorite haute) : adapter moteur Mansa Moussa V2, projection geoAzimuthalEqualArea, palette parchemin/bordeaux/or
3. **Caravane impi sur S3** (idee 5 priorite haute) : sprites existants positionnes sur paths d'expansion
4. **Deformation S4** (idee 6 priorite haute) : filtres SVG + ondes concentriques (Echo Maternel)
5. **Animation typo 4 actes S2** (idee 8 nouvelle Grok Pass 2)

Ordre suggere par `VAGUE-2-LOCKED.md` (source de verite).

**Cap budget Phase 3** : ~$2-3 (Gemini image + Seedance clip principal)
