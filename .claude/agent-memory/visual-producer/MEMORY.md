# visual-producer — Agent Memory

> Persistent memory across sessions. Index compact + pointeurs vers fichiers dedies.
> Last updated: 2026-04-24 (reorganisation memoire : MOTS-ROUGES-VERTS + CHECKLIST-PROMPT-SHORT + RULES-ACTIVE/ARCHIVE crees, MEMORY purge 791→~200 lignes)

---

## FICHIERS DE REFERENCE (charger selon besoin)

| Fichier | Contenu | Quand consulter |
|---|---|---|
| **`SEEDANCE-LAUNCH.md`** | **Template Python complet + méthode d'exécution Seedance** | **TOUJOURS avant de lancer un clip Seedance — NE PAS écrire de script from scratch** |
| `CHECKLIST-PROMPT-SHORT.md` | 21 items + template copier-coller + 14 anti-patterns bloquants | TOUJOURS avant un prompt Short ou Gemini |
| `MOTS-ROUGES-VERTS.md` | 12 mots immobilite + 9 particules + 6 richesse litterale + verbes verts + cas particuliers | TOUJOURS avant un prompt Short |
| `RULES-ACTIVE.md` | Regles vivantes (6 ajoutees 2026-04-26 session Abou Bakari II) | Consulter si doute sur une regle courante |
| `RULES-ARCHIVE.md` | Regles zombies / historiques / contextuelles | Consulter pour regles tres specifiques (animaux, objet porte, drift enfant...) |
| `archive/session-logs-pre-2026-04-20.md` | Historique sessions pre-Sonjata | Rarement. Reference incident similaire uniquement. |

**Fichiers memoire transverse projet** (lire aussi) :
- `memory/tools/seedance-rules.md` + `seedance-prompts.md` + `seedance-storyboard-technique.md`
- `memory/tools/gemini.md` / `kling.md` / `recraft.md`
- `memory/templates/hook-short.md` (reutilisable)

---

## ETAT PROJETS

### Sonjata Papercraft
- v3 FINAL valide 2026-04-23. Publication Postiz en attente.
- 10 scenes + hook + CTA validees.
- Pipeline formule : Gemini storyboard → refs canon → Seedance V2 i2v 5-7s.
- Refs canoniques : voir `sonjata-papercraft/refs/` (sunjata-child / adult / king charsheets).

### Thiaroye V5
- Scene 1 V5 VALIDEE 2026-04-23 (formule Sonjata-chorégraphique 7s confirmee).
- **IMAGES SCENES 2-6 GENEREES 2026-04-24 (2 variations A/B par scene)**.
- Style anchor valide : `public/assets/thiaroye-1944/scene1/scene1-source-v4.png`
- Charrefs : `public/assets/thiaroye-1944/refs/{tirailleur-principal,officier-francais,biram-senghor,jeune-temoin}-charsheet.png`
- Budget post-images : depense $13.15 / $30.00, restant $16.85
- Dashboard images : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/thiaroye-v5-dashboard/dashboard-bundled-tvBAGU73c18yglrIydagBZy7r3glpd.html

**IMAGES LIVREES (chemin local) :**
- scene2 : `scene2/scene2-source-v1a.png` (3 tirailleurs table + OTS normal), `scene2-source-v1b.png` (OTS dominant, main ouverte — PREFERE)
- scene3a : `scene3a/scene3a-source-v1a.png` (tirailleur seul face a la ligne — FORT), `scene3a-source-v1b.png` (wide establishing)
- scene3b : `scene3b/scene3b-source-v1a.png` (plan-tableau pont — localisation erronee mais stylise), `scene3b-source-v1b.png` (main + lettre + flaque — SYNECDOQUE FORTE)
- scene4a : `scene4a/scene4a-source-v1a.png` (main gantee + tiroir), `scene4a-source-v1b.png` (perspective infinie archives — FORT)
- scene4b : `scene4b/scene4b-source-v1a.png` (close-up mains document), `scene4b-source-v1b.png` (wide tribunal — PREFERE)
- scene5a : `scene5a/scene5a-source-v1a.png` (Biram + mur portraits — FORT), `scene5a-source-v1b-fixed.png` (close-up Biram fixed, texte supprime)
- scene5b : `scene5b/scene5b-source-v1a-v2.png` (pierre pure + feuille), `scene5b-source-v1b-v2.png` (pierre + fleurs + lettre)
- scene6 : `scene6/scene6-source-v1a.png` (dos camera coucher soleil — MAGNIFIQUE), `scene6-source-v1b.png` (profil + pirogues)

**GOTCHA SCENE5B (nouveau)** : Gemini genere systematiquement du texte sur les gravures memorielles meme avec "NO readable text". Fix : demander pierre SANS gravures du tout + feuille/fleurs comme seuls elements. Regen reussie en v2.

**CLIPS GENERES 2026-04-24 (ordre 4B→5A→6→3B) :**
- scene4b : `clips/s4b-tribunal-v1.mp4` (10s, seed 1295902921) — tribunal sobre, main avocat bouge, flag flutter
- scene5a : `clips/s5a-biram-memorial-v1.mp4` (10s, seed 1352359353) — Biram se tourne vers portraits, 1 portrait illumine en or, fort
- scene6  : `clips/s6-dakar-cote-v1.mp4` (7s, seed 1537110455) — dolly-out sunset, vagues/oiseaux animes, EXCELLENT
- scene3b : `clips/s3b-aftermath-v1.mp4` (7s, seed 1741250381) — dolly-in main + lanterne s'allume, sobre et fort
- Script : `scripts/tools/seedance-thiaroye-scenes-2to6.py`
- Budget clips : $10.20 / Cumule : ~$23.35 / Restant : ~$6.65

**NOUVEAU GOTCHA scene5a** : Seedance a fait TOURNER Biram de face vers dos face aux portraits (pas demande). Narrativement fort, mais attention : si on veut Biram face camera sur toute la duree, specifier "NEVER turns his back to camera, ALWAYS faces forward".

**NEXT : Aziz valide les 4 clips → scenes 2 et 3A à générer → assembly Remotion**

### Abou Bakari II
- **8 images validees + 4 charrefs valides session 2026-04-26.**
- Dashboard mis a jour v1.2 (2026-04-26) — source de verite.
- **Dashboard URL Vercel v1.3 FINAL** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-v4UfsGc5wztLsTfbPgnt2HkfgPLcIt.html
- Scenes.json : `abou-bakari-dashboard/data/scenes.json` v1.2 (embedded dans le dashboard)
- Budget depense : $0.84 (16 images × ~$0.04 + 4 charrefs × $0.05)

**Metadata globale (scenes.json top-level) :**
- total_duration_s: 88.52s | format: 9:16 | style: paper-craft sepia warm palette
- narration_audio: `public/audio/abou-bakari/abou-bakari-narratrice-v1.mp3`
- forced_alignment: `public/audio/abou-bakari/abou-bakari-alignment.json`
- voice_id: z3gESu49naEZW8Af2Upm
- budget: initial $30.00, spent $0.84, remaining $29.16
- epoch_spec: boubou indigo/ocre, pirogues bois 10-20m, lances bois+fer forge, architecture adobe Djinguereber, palette ocre #D4943F / sienna #8B4513 / creme #F5E6C8 / or #D4AF37 / indigo #1A1A4E / atlantique #0A3D6B

**Musique selectionnee (2 variantes Minimax v2.6) :**
- Variante A : `variante-A-royal-kora-balafon.mp3` — Toumani Diabate style, regal adventurous hopeful — scenes royales + depart
- Variante E : `variante-E-royal-contemplatif-ngoni.mp3` — Bassekou Kouyate style, sombre contemplatif bittersweet — scenes ocean + obsession
- URLs Vercel audio dans la section musique du dashboard (players HTML natifs)

**Charrefs valides (URLs Vercel) :**
- abou_bakari_royal: https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/abou-bakari-royal-charref-v1-5xPrxyyPAd6pQNGft00fGVx6YOnDTS.png
- abou_bakari_marin: https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/abou-bakari-marin-charref-v1-XY7veYZWHNdw4Jm4JXiNCWwWhs6JYd.png
- mansa_moussa: https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/mansa-moussa-charref-v2-vHUPiYqCHGI9b4qKxI79FSZUnXeFlx.png
- capitaine_pirogue: https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/capitaine-pirogue-charref-v3-UDPEaYJMOjkLNMWXJZUNaU3EoYQJV5.png
- style_anchor: https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/style-anchor-scene1-village-jbVNIPNFmcECd7VTMPJ6cqWCgd7MLo.png

**Images locales validees :**
- ocean : `public/assets/abou-bakari/scenes/scene-ocean-v1.png`
- empire : `public/assets/abou-bakari/scenes/scene-empire-v2.png`
- fleet-a : `public/assets/abou-bakari/scenes/scene-fleet-a-v1.png`
- fleet-b : `public/assets/abou-bakari/scenes/scene-fleet-b-v4.png`
- name (depart) : `public/assets/abou-bakari/scenes/scene-name-v6.png`
- abdication (Moussa) : `public/assets/abou-bakari/scenes/scene-abdication-v3.png`
- obsession : `public/assets/abou-bakari/scenes/scene-obsession-v3.png`
- colomb : `public/assets/abou-bakari/scenes/scene-colomb-v1.png`

**Charrefs valides :**
- abou-bakari-royal : `public/assets/abou-bakari/refs/abou-bakari-royal-charref-v1.png`
- abou-bakari-marin : `public/assets/abou-bakari/refs/abou-bakari-marin-charref-v1.png`
- mansa-moussa : `public/assets/abou-bakari/refs/mansa-moussa-charref-v2.png`
- capitaine-pirogue : `public/assets/abou-bakari/refs/capitaine-pirogue-charref-v3.png`

**Prompts Seedance valides par scene :** voir scenes.json (tous les prompts sont a jour v2026-04-26).

**Scenes : strategie clips + Video Extend :**
| Scene | Duree | Strategie | Complement | Cout est |
|---|---|---|---|---|
| ocean | 13.4s | Seedance i2v 10s + Video Extend 4s | video_extend_seedance | $3.70 |
| empire | 8.9s | Seedance i2v 8s | non | $2.20 |
| fleet-a | 10.0s | Seedance i2v 10s | non | $2.50 |
| fleet-b | 6.0s | Seedance i2v 6s | non | $1.80 |
| name | 12.9s | Seedance i2v 10s + Video Extend 3s | video_extend_seedance | $5.20 |
| abdication | 13.3s | Seedance i2v 10s + Video Extend 4s | video_extend_seedance | $3.50 |
| obsession | 5.9s | Seedance i2v 6s | non | $1.60 |
| colomb | 6.4s | Seedance i2v 6s | non | $1.80 |
| close_cta | 9.1s | Remotion pur (split-screen fleet-a + colomb en loop) | non | $0.00 |
| **TOTAL** | | | | **~$22.30** |

**Toutes les camera_movement_choice = SAFE.** Options MEDIUM/RISKY documentees dans scenes.json pour chaque scene.

**Scenes avec corrections documentees (itérations >1) :**
- empire (4 corrections, 2 versions) : style anchor palette only + sandales + proportions throne
- fleet-b (4 corrections, 4 versions) : plage→mer + peau dark brown (R-SKIN-EXPLICITE) + expression terreur
- name (5 corrections, 4 versions) : direction personnage (R-DIRECTION-PERSONNAGE) + medaillon chirurgical
- abdication (3 corrections, 3 versions) : taille throne surdimensionne
- obsession (3 corrections, 3 versions) : style drift BD → paper-craft strict

**Scenes valides au 1er essai :** ocean, fleet-a, colomb (0 itération inutile)

**NEXT : generation clips Seedance (8 scenes) → assembly Remotion → render final.**

**WORKFLOW DASHBOARD — a suivre pour tous les projets :**
- Dashboard = source de verite visuelle d'Aziz.
- Mettre a jour apres validation images : status `image_validated` + `image_url_vercel` + `prompt_seedance` valide.
- Mettre a jour apres generation clips : status `clip_validated` + `clip_final`.
- Uploader `dashboard-bundled.html` sur Vercel apres chaque mise a jour majeure.
- Format upload : `python3 scripts/tools/upload-to-blob.py abou-bakari-dashboard/dashboard-bundled.html --folder abou-bakari/dashboard`

**REGLE DASHBOARD — IMAGES OBLIGATOIRES (validee 2026-04-26) :**
Le dashboard final DOIT toujours inclure :
1. L'image validee visible dans chaque carte de scene (balise `<img>` depuis `image_url_vercel`, pas juste le texte du chemin)
2. Une section "References de style" en haut avec charrefs + style anchor visibles (grille scrollable horizontale)
3. Les images chargent depuis URLs Vercel publiques (pas base64, pas chemins locaux relatifs)
4. Lightbox au clic sur toute image (fullscreen sur mobile)
5. Uploader les refs locales manquantes sur Vercel AVANT de construire la section References (utiliser `upload-to-blob.py`)
Cette regle s'applique a TOUS les projets futurs (Thiaroye, Sonjata, Abou Bakari, etc.)

### Autres projets backlog
- Chaine News geopolitique : systeme valide, execution post-3 Shorts.

---

## TECHNIQUE PRIMAIRE : Storyboard-to-Video (Seedance reference-to-video)

Reference : `memory/tools/seedance-storyboard-technique.md` (12 regles).
Workflow : Gemini sketch N panels + char refs + env plate → Seedance reference-to-video 9:16 avec audio.
Applicable : sequences narrative multi-shots <15s.
Projets valides : Soundjata Acte V, Sonjata Papercraft.

**6 faiblesses connues** (voir RULES-ARCHIVE + seedance-storyboard-technique.md) :
- F1 State transitions → Visual State Transition clause explicite
- F2 Char ref neutral-bg → context-refs avec fond scene suggere
- F3 Layout ~~9 panels~~ → table densite contextuelle (4-5 narratif, 7-9 action)
- F4 Gemini Pro conservative → Flash Image pour edits chirurgicaux
- F5 Objets rigides stretch → tight framing + RIGID/CONSTANT clause
- F6 Format → aspect_ratio final dans API, pas de crop post
- F7 Gemini drift enfant → forcer age adulte 3x + marqueurs anatomiques

---

## REF CHARACTERS PAR PROJET

| Projet | Perso | Path | Notes |
|---|---|---|---|
| Thiaroye 1944 | Style anchor | `public/assets/library/geoafrique/thiaroye-1944/frames/frame-03.jpg` | 2D flat BD |
| Thiaroye V5 Scene 1 | Last frame V5 | `public/assets/thiaroye-1944/scene1/scene1-v5-lastframe.png` | Source pour complement 6s |
| Soundjata combat | Soundjata | `public/assets/library/geoafrique/soundjata/combat-refs/soundjata-combat-ref.png` | Full body combat stance |
| Soundjata combat | Soumaoro | `public/assets/library/geoafrique/soundjata/combat-refs/soumaoro-combat-ref.png` | Full body casting stance |
| Soundjata Acte V | Savanna plate | `public/assets/library/geoafrique/soundjata/combat-refs/savanna-environment-plate.png` | Environment plate |
| Soundjata Acte V | Storyboard A | `public/assets/library/geoafrique/soundjata/combat-refs/storyboard-segment-A.png` | 4-panel |
| Soundjata Acte V | Storyboard B v3d | `public/assets/library/geoafrique/soundjata/combat-refs/storyboard-segment-B-v3d.png` | 5-panel POV |
| Sonjata Papercraft | Enfant | `sonjata-papercraft/refs/sunjata-child-charsheet-v1.png` | Scenes 1-5 |
| Sonjata Papercraft | Adulte guerrier | `sonjata-papercraft/refs/sunjata-adult-charsheet-v1.png` | Scenes 6-7 |
| Sonjata Papercraft | Roi empereur | `sonjata-papercraft/refs/sunjata-king-charsheet-v1.png` | Scenes 8-10 |

---

## STYLE IDs ETABLIS

| Projet | Style ID | Tool | Status |
|---|---|---|---|
| _(aucun etabli)_ | | | |

(Ajouter ici quand un Style ID Recraft V3 est cree pour un projet.)

---

## COUT MOYEN PAR SCENE

| Type scene | Tool | Cout |
|---|---|---|
| Image Gemini (char, background, icone) | Gemini 3.1 Flash | ~$0.04-0.08 |
| Parchment map | Gemini | ~$0.04 |
| Seedance Short clip 5-10s | Seedance V2 T2V/I2V | $1.50-3.00 |
| Seedance reference-to-video 10s | Seedance 2.0 | ~$3.02 |
| Kling V3 Pro 4K | Kling | ~$0.50-2.00 |
| Recraft V3 SVG (Style ID) | Recraft | ~$0.04 |

---

## GATES PRE-API (pipeline_gates.py)

AVANT tout appel Seedance/Gemini :

```bash
python3 -c "
import json, sys; sys.path.insert(0, 'scripts')
from pipeline_gates import pre_seedance_check
config = {
    'prompt': '''<PROMPT>''',
    'image_refs': [<REFS>],
    'clip_duration': <DUR>,
    'narration_duration': <NARR_DUR>,
    'character_name': '<NAME>',
    'has_environment': True,
    'estimated_cost': <COST>,
}
ok, results = pre_seedance_check(config)
for r in results: print(r)
print('VERDICT:', 'PASS' if ok else 'BLOCKED')
"
```

Gates : prompt structure, canonical ref, duration match, reverse bias, seedance inputs, character context, chain continuity, fal.ai balance, TTS scan, face diversity.

Si BLOCKED → fix AVANT l'API call.

---

## SEED VALUES (reproducibilite)

| Asset | Tool | Seed | Use case |
|---|---|---|---|
| Soundjata combat V2 | Seedance 2.0 ref-to-video | (varie) | Choregraphie transfer |

---

## REVISION LOG MEMORY.md

- 2026-04-26 (session 2) : dashboard Abou Bakari II mis a jour v1.2. 8 images + 4 charrefs integres dans scenes.json + dashboard bundlé. Prompts Seedance valides integres pour les 8 scenes. Note workflow dashboard creee (source de verite visuelle). URL dashboard Vercel : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-rQfZwh5CP3rNqJenT4MVS1qu2emKy1.html
- 2026-04-26 (session 1) : session Abou Bakari II. 6 nouvelles regles ajoutees dans RULES-ACTIVE (R-STYLE-ANCHOR-PALETTE-ONLY + R-EDIT-CHIRURGICAL-PRESERVE-FIRST + R-DIRECTION-PERSONNAGE + R-SKIN-EXPLICITE + R-RICHESSE-ARCHITECTURALE + R-ANIMATION-AVANT-VALIDATION). CHECKLIST-PROMPT-SHORT enrichie : items 17-21 + 6 anti-patterns. MOTS-ROUGES-VERTS : section "Richesse litterale" (6 termes). Les 2 regles les plus critiques : R-STYLE-ANCHOR-PALETTE-ONLY + R-DIRECTION-PERSONNAGE (ont cause le plus d'iterations perdues).
- 2026-04-25 : nettoyage memoire. Suppression doublon §WORKFLOW LIVRAISON STANDARD (couvert par RULES-ACTIVE). 4 regles promues ARCHIVE→ACTIVE : R-STORYBOARD-DENSITE + R-I2V-VS-STARTEND + R-STORYBOARD-REGEN-COMPLET + R-VETEMENTS-EPOQUE. CHECKLIST-PROMPT-SHORT.md enrichi : template copier-coller + section regles projet-specifiques + checklist item 15 etendue + 3 anti-patterns supplementaires.
- 2026-04-24 : purge massive. 791 lignes → ~200 lignes. Session logs pre-2026-04-20 archives. R-DYNAMIC v2 + R-VIVANT-PARTOUT fusionnes en R-VIVANT v3 (dans RULES-ACTIVE). 6 meta-rules 2026-04-16 integrees en discipline de livraison (non listees). Regles contextuelles (animaux lateral, objet porte, drift enfant) deplacees dans RULES-ARCHIVE. Nouveaux fichiers crees : CHECKLIST-PROMPT-SHORT.md + MOTS-ROUGES-VERTS.md + RULES-ACTIVE.md + RULES-ARCHIVE.md.
- 2026-04-23 : Thiaroye V5 Scene 1 V5 validee (formule Sonjata-chorégraphique 7s).
- 2026-04-22 : Sonjata v3 FINAL valide (10 scenes + hook + CTA).
