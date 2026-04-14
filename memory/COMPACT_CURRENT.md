# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-04-10 soir (6 tests API fal.ai, 69 regles Seedance, chaining resolu, pipeline API clarifie) | A LIRE EN DEBUT DE SESSION
> Sessions precedentes : tests bataille Lat Dior, exploration styles vivid shapes, workflow Yaroflasher, decision style principal

---

## CONTEXTE — Ce qui s'est passe ces 3 dernieres sessions

**Session 2026-04-07** : Tests de combat intensifs. Clip A Lat Dior Dekheule (9.5/10). Format 8 "Battle Ink" decouvert. 9 nouvelles regles Seedance (42-50). Workflow multi-ref Yaroflasher identifie.

**Session 2026-04-08** : Decision style principal : flat BD illustre. Vivid shapes = secondaire (thumbnails). 4 templates de prompts crees. Pipeline V2 Recraft+Gemini = semi-officiel pour usages statiques.

**Session 2026-04-09/10** : Session majeure de tests API Seedance 2.0. Objectif : automatiser la generation de clips via API au lieu de Dreamina web manuel. 7 tests realises sur 3 plateformes (Dreamina, fal.ai, Atlas Cloud). Conclusions :

1. **API Seedance 2.0 disponible sur fal.ai** — endpoint officiel, fonctionne, prouve par 3 generations reussies. Prix : $0.30/s (images), $0.18/s (video ref). Reference-to-video avec 3 images + prompt dialogue = meilleur resultat (8.5-9/10).

2. **Video Extend/Chaining** : biais "reverse" systematique sur objets tombes (baobab se releve 3/3 tests). First/Last frame = transitions visuelles, PAS storytelling. Chaining sequentiel fonctionne mieux avec prompt directif, mais les 0-3s initiales ont souvent des artefacts.

3. **Lip sync francais via API** : valide — "Je suis Soundjata! Fils de Sogolon!" parfaitement synchronise.

4. **Atlas Cloud** : teste, prix attractif ($0.10/s) mais l'API reference-to-video **ignore les images de reference** — genere du text-to-video deguise. Le playground Atlas ($0.216/s) fonctionne correctement mais prix = fal.ai. Pas d'avantage reel.

5. **Comparatif prix** : Volcengine officiel = $0.14/s (inaccessible, KYC chinois). fal.ai = $0.30/s (accessible, prouve). Dreamina web = ~$0.23/s (accessible, manuel). Atlas Cloud API = $0.10/s (refs ignorees, inutilisable pour nous).

6. **6 nouvelles regles Seedance** (58-63) documentees dans `memory/tools/seedance-rules.md`.

---

## DECISION STYLE PRINCIPAL (2026-04-08)

**Style principal GeoAfrique : Flat BD illustre semi-detaille**

Pourquoi : c'est le seul style qui combine (1) dynamisme suffisant pour Seedance, (2) esthetique unique non-generique, (3) adaptabilite tous formats (Shorts, long, news). Les styles ink-wash et vivid shapes sont des outils secondaires.

| Style | Role | Quand l'utiliser |
|---|---|---|
| **Flat BD illustre** (Gemini refs) | **PRINCIPAL** | Toutes les scenes narratives, combat, dialogue, voyage |
| **Ink-wash Battle** (Format 8) | Secondaire | Scenes de combat haute intensite specifiquement |
| **Vivid shapes** (Recraft) | Secondaire | Thumbnails, branding, illustrations statiques |

References du style principal : videos `Downloads/bataille.mp4` (Amanirenas vs Abou Bakari) et `Downloads/test keita.mp4` (Soundjata barre de fer).

---

## Serie "Heros Oublies" — 5 SCRIPTS PRETS

| # | Personnage | Script | Test Seedance | Audio |
|---|-----------|--------|---------------|-------|
| 1 | Nzinga (Angola) | Valide | Pas encore | En attente |
| 2 | Lat Dior (Senegal) | Valide | **Bataille 9.5/10** (ink-wash) + vivid 7.5/10 | En attente |
| 3 | Soundjata (Mali) | Valide | **9.5/10** (barre de fer) | En attente |
| 4 | Yaa Asantewaa (Ghana) | Valide | 8/10 (V2 best) | En attente |
| 5 | Hannibal (Carthage) | Valide | Pas encore | En attente |

**Blocker** : Credits ElevenLabs a recharger pour batch audio.

### Clips bataille Lat Dior (Dekheule) — UTILISABLES

| Clip | Score | Style | Statut |
|------|-------|-------|--------|
| Test 2 (POC) | 8/10 | Ink-wash | Archive — over the top |
| Test 3 (POC) | 8.5/10 | Ink-wash | Archive — meilleure vue aerienne |
| **Test 4 (Clip A PROD)** | **9.5/10** | Ink-wash | **UTILISABLE** — charge + combat + finale |
| Test 5 (Clip B PROD) | 8/10 | Ink-wash | Partiellement utilisable (shots 1-3 + 8-9) |
| Test vivid shapes | 7.5/10 | Vivid | Archive — trop statique |
| Test Pipeline V2 (Amanirenas) | 7/10 | Vivid | Archive — beau mais bobbleheads |

### Personnages historiquement corriges

Pourquoi : nos personnages avaient des vetements/accessoires modernes ou culturellement incorrects (couronne europeenne sur un roi wolof, couronne egyptienne sur une reine kushite). Recherche historique faite pour 3 personnages.

| Personnage | Correction | Refs generees |
|---|---|---|
| **Lat Dior** | Turban wolof (pas couronne), gris-gris, grand boubou brode 3 pieces, boucles d'oreilles tiedo | `tmp/yaroflasher-test/ref1-latdior-historical-sheet.png` |
| **Abou Bakari II** | Calotte royale malienne, boubou brode islamique volumineux, sceptre or | `tmp/historical-refs/abou-bakari-historical-sheet.png` |
| **Amanirenas** | Perruque kushite arrondie (pas couronne egyptienne), armure cuir, chale cramoisi, lance+bouclier | `tmp/historical-refs/amanirenas-historical-sheet.png` + `tmp/gemini-from-recraft/amanirenas-4views-gemini.png` |

---

## Regles Seedance — Total 69

Regles 1-41 : sessions precedentes (voir `memory/tools/seedance-rules.md`)
Regles 42-57 : sessions 2026-04-07/08
Regles 58-63 : session 2026-04-09 (API fal.ai, extend/chaining)
Regles 64-69 : session 2026-04-10 (tests production API, tagging, scenes calmes)

| Regle | Resume |
|-------|--------|
| 42 | Ethnicity/peau = specifier explicitement |
| 43 | Blessures = progression ou rien |
| 44 | Format hybride timecode+SHOT+VFX+SFX = valide combat |
| 45 | Ref plan large > close-up pour style ink-wash |
| 46 | Vue aerienne concentrique = signature batailles |
| 47 | Over the top = POC, pas production |
| 48 | "FALLS forward" + slow-mo = flottement aerien |
| 49 | Canons/objets lourds = arriere-plan seulement |
| 50 | Apres blessure mortelle = personnage SEUL |
| 51 | Vue aerienne leader = specifier position dans le V |
| 52 | Refs separees par element (methode Yaroflasher) |
| 53 | Collage close-up + full body / character sheet |
| 54 | "no words, no music" en fin de prompt |
| 55 | Limite prompt 1500 chars = Flashboard, probablement plus haute Dreamina |
| 56 | Duree generation = duree besoin, pas plus |
| 57 | Clip precedent comme ref video (Omni) |

---

## Pipeline principal (V1 — OFFICIEL)

```
1. Script valide Aziz
2. Audio ElevenLabs V3
3. ffprobe timings -> timing.ts
4b. Kimi DA brief
4c. Claude dynamisation (Format 3 SECONDS ou Format 8 pour combat)
4d. Gemini refs : character sheet + decor + secondaires (3-6 refs, methode Yaroflasher)
5. Seedance generation (Dreamina web, multi-ref) + "no words, no music"
6. Integration Remotion + mini-render
```

**Changement par rapport au pipeline precedent** : etape 4d passe de 1 ref (style anchor) a 3-6 refs (personnage + lieu + secondaires + armes + mood). Ajouter "no words, no music" en fin de prompt.

## Pipeline V2 "Recraft + Gemini" (SEMI-OFFICIEL)

Pour style vivid shapes uniquement (thumbnails, branding, illustrations statiques).

```
Recraft Style ID (1 fois) -> 1 image DNA visuel
Gemini + ref Recraft -> character sheets, decors, secondaires
```

Style IDs : Hannibal `22d1274f`, Amanirenas `d28c53cc`
Credits Recraft restants : 920

---

## Templates de prompts (NOUVEAU 2026-04-08)

Pourquoi : Claude oubliait les regles en milieu de session (diversite visages, ethnicity, etc.). Les templates integrent les regles critiques + techniques DA + checklist obligatoire dans un seul fichier par type de scene.

| Template | Fichier | Usage |
|---|---|---|
| Combat (Format 8) | `memory/templates/combat.md` | Batailles, charges, duels |
| Narratif (Format 3) | `memory/templates/narratif.md` | Discours, voyage, negociation |
| Montage (Format 7) | `memory/templates/montage.md` | Beat sync, sequences rapides |
| Exploration (Format 4) | `memory/templates/exploration.md` | Lieux, plan-sequence |

**Regle CLAUDE.md** : AVANT tout prompt Seedance/Gemini, LIRE le template -> UTILISER la structure -> COCHER la checklist -> PRESENTER. Zero exception.

---

## API Seedance 2.0 — Etat des lieux (2026-04-10)

### Providers testes

| Provider | Prix/s | Refs respectees | Automatisable | Verdict |
|----------|--------|----------------|---------------|---------|
| **fal.ai** | $0.30 | **OUI** | **OUI** | **Meilleur choix API** |
| Atlas Cloud API | $0.10 | NON (ignorees) | OUI | Inutilisable pour nous |
| Atlas Cloud playground | $0.216 | OUI | NON (manuel) | Meme prix que fal.ai |
| Dreamina web | ~$0.23 | OUI | NON (manuel) | Meilleur choix manuel |
| Volcengine officiel | $0.14 | OUI (presume) | OUI | Inaccessible (KYC chinois) |
| Replicate | $0.29 | Non teste | OUI | Alternative fal.ai |

### Cle API fal.ai : `FAL_KEY` dans `.env`
### Cle API Atlas Cloud : `apikey-926b207a14f44ded974d22e6398bb7e7` (dans dashboard atlascloud.ai, pas dans .env — ne pas utiliser l'API pour les refs, seulement le playground)

### Tests realises

| # | Mode | Plateforme | Cout | Score | Fichier |
|---|------|-----------|------|-------|---------|
| 1 | First/Last frame 15s | Dreamina | Credits | 3/10 | YouTube shorts |
| 2 | First/Last frame 10s | Dreamina | Credits | 5/10 | YouTube shorts |
| 3 | Reference-to-Video 10s (video ref) | fal.ai | ~$3.10 | 7.5/10 | Vercel Blob |
| 4 | **Multi-ref dialogue 10s (3 images)** | **fal.ai** | **~$3.02** | **8.5-9/10** | **Vercel Blob** |
| 5 | Text-to-video 5s | Atlas Cloud API | ~$0.50 | 4/10 | Vercel Blob |
| 6-7 | Multi-ref 10s (3 images) | Atlas Cloud API | ~$2.16 x2 | 5/10 | Downloads/ |
| 8 | **Multi-ref dialogue 10s (3 images)** | **Atlas Cloud playground** | **$2.16** | **8.5/10** | **Downloads/atlas test 3.mp4** |
| 9 | Chaining video ref (4s tail) | fal.ai | $0 (echec) | N/A | Content policy violation — video flag "real people" |
| 10 | **Multi-ref Lat Dior bataille (3 images)** | **fal.ai** | **~$3.02** | **8.5-9/10** | **Vercel Blob** |
| 11 | **Lip sync griot narration 10s** | **fal.ai** | **~$3.02** | **8.5/10** | **Vercel Blob** |
| 12 | Chaining image (last frame baobab) | fal.ai | ~$3.02 | 4/10 | Vercel Blob — Seedance rembobine au lieu de continuer |
| 13 | Chaining 2 refs (Gemini exil + styleref) | fal.ai | ~$3.02 | 5/10 | Vercel Blob — styleref animee en plein milieu |
| 14 | **1 ref Gemini seule (exil v2)** | **fal.ai** | **~$3.02** | **6/10** | **Vercel Blob — scene correcte mais statique** |

### Learnings tests 10-14 (10 avril soir)
- Multi-ref 3 images (character + decor + secondaires) via API = qualite comparable a Dreamina web
- Lip sync francais tient sur 10s de narration, mais Seedance re-synthetise l'audio (mot deforme). Workflow : strip audio + ElevenLabs overlay = parfait
- Foules : visages clones sans diversite explicite dans le prompt (regle 64)
- COLOR GRADE : changements de palette entre segments = transition abrupte (regle 65)
- Chaining via video ref bloque par filtre content policy fal.ai (regle 66)
- **1 ref Gemini par clip = la bonne approche pour l'API** (regle 67). Zero styleref separee.
- **Tagging d'images = ne fonctionne PAS**, ni via API ni sur Dreamina web (regle 69)
- **Scenes calmes = Seedance produit du quasi-statique** (regle 68). Action = bien, contemplation = faible.
- **Le biais reverse (regle 60) persiste** : tout objet au sol = Seedance le remet debout. Ne pas utiliser d'images avec objets tombes comme ref.

---

## Prochaines actions

**Quoi** : Produire le premier Short Heros Oublies complet (probablement Lat Dior ou Soundjata).
**Pourquoi** : On a les scripts, les tests visuels valides (9.5/10 bataille, 9.5/10 barre de fer), le style principal decide, et l'API Seedance 2.0 validee (fal.ai multi-ref + dialogue lip sync = 8.5-9/10).
**Comment** : Recharger credits ElevenLabs -> scan TTS -> generation audio -> Kimi DA -> Claude dynamisation -> Gemini refs multi-ref -> Seedance (fal.ai API ou Dreamina web) -> Remotion assemblage.
**Decision en attente** : fal.ai ($0.30/s, automatisable) vs Dreamina web (~$0.23/s, manuel). Pour un Short de 60s (6 clips x 10s) : fal.ai = ~$18, Dreamina = ~$14. La difference est ~$4 par Short.
**Chaining resolu** : pas de chaining inter-clips dans Seedance. Chaque clip = 1 ref Gemini independante. Assemblage dans Remotion. Le chaining par derniere frame ou video ref ne fonctionne pas (biais reverse + content policy + statique).

**Secondaire** : Regenerer les character sheets des 5 heros avec les corrections historiques dans le style flat BD illustre.

---

## Autres projets (status inchange)

**Abou Bakari** : Beats 01-09 completes. Reste musique Suno + render final.
**Thiaroye** : Clips 1-2 valides, clip 3 a refaire, clips 4-7 a ecrire.
**Peste 1347** : HookMaster v2 TERMINE. Corps S1-S6 a faire.

---

## Workspace

```
scripts/heros-oublies/     # 5 scripts serie + README
scripts/tools/             # 6 scripts Python reutilisables
tmp/lat-dior-battle/       # 4 refs Gemini ink-wash + 5 clips battle
tmp/yaroflasher-test/      # Refs character sheets historiques (Lat Dior)
tmp/historical-refs/       # Character sheets Abou Bakari + Amanirenas
tmp/gemini-from-recraft/   # Refs Pipeline V2
tmp/vivid-test-v2/         # Tests vivid shapes avec Style IDs
tmp/soundjata-frames/      # Frames extraites clip Soundjata (refs pour tests API)
out/                       # 2 renders finaux (abou-bakari, thiaroye)
public/assets/library/     # REFs canoniques + clips valides
memory/tools/              # Regles Seedance (63), Recraft, Gemini, ElevenLabs, Kling, Remotion
memory/templates/          # 4 templates prompts (combat, narratif, montage, exploration)
```
