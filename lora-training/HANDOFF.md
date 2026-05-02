# LoRA Training Handoff — Sonjata Papercraft

**Date de creation** : 2026-04-28
**Auteur** : session strategique workspace `test last 30 days` (Aziz + Claude)
**Pour** : instance Claude du workspace `remotion`
**Mission** : entrainer le premier LoRA Style "papercraft africain" pour LTX 2.3

---

## CONTEXTE STRATEGIQUE (a lire en premier)

Aziz a 3 videos Sonjata Papercraft terminees pretes a publier sur YouTube (~6 min total de materiel video coherent stylistiquement). Ces videos ont ete generees avec **Seedance 2.0 API** (ByteDance). La sortie produite a un style "papercraft" distinctif que Aziz veut capturer comme **asset proprietaire reproductible** via un LoRA custom sur LTX 2.3 (open-source, Apache 2.0, Lightricks).

**Pourquoi c'est important** :
- Le style papercraft est le **moat defensible** de la chaine YouTube prevue (niche francophone africaine vide)
- Seedance = API closed, dependance ByteDance, cout recurrent, style non-proprietaire
- LTX 2.3 + LoRA custom = asset transferable, possede, qui devient signature visuelle long terme
- C'est aussi le premier produit monetisable de la these "expert pipeline video AI francophone" d'Aziz (consulting, tutoriel FR, vente templates)

**Strategie hybride decidee (scenario C)** :
- **Continuer Seedance** pour les 3 videos deja pretes a publier
- **R&D LTX 2.3 + LoRA en parallele**, sans pression calendrier
- **Pas de migration production** avant validation LoRA reussie

**Investissement attendu** : ~$15-30 pour le test decisif (training + inference test). Si concluant, scaling vers RunPod H100 production (~$3-5 par video Sonjata generee).

---

## AVANT DE COMMENCER : QUESTIONS A POSER A AZIZ

Ne PAS demarrer la preparation du dataset avant d'avoir les reponses a ces questions :

1. **Inventaire clips** : ou sont stockes les clips finaux des 3 videos Sonjata Papercraft ? Le dossier `out/` est mentionne mais "parfois ailleurs aussi". Faire un inventaire complet (find tous les .mp4 du dossier remotion, lister par taille/duree/date), presenter a Aziz pour validation avant de copier dans `lora-training/source-clips/`.

2. **Resolution source** : quelle est la resolution exacte des clips Seedance ? (probablement 1280x720 ou 1920x1080, mais a confirmer avec ffprobe). Determine la resolution cible LoRA.

3. **Coherence stylistique** : les 3 videos ont-elles le meme style papercraft exactement, ou y a-t-il des variations (palette differente, papier different, eclairage different) entre v1, v2, v3 ? Si variations significatives, decider si dataset = un seul style choisi OU 3 LoRAs separes.

4. **Trigger word final** : confirmer le trigger word pour le LoRA. Default propose : `sonjata_paper_v1`. Alternative possible : `azpaper2026` ou autre. Doit etre UNIQUE (pas un mot du langage commun) pour eviter conflit avec le base model.

5. **Plateforme training** : confirmer que fal.ai LTX-2 Video Trainer est bien le choix (~$10/run, 30-40 min, zero setup). Alternative AI Toolkit local rejetee precedemment.

---

## STRUCTURE DU DOSSIER LORA-TRAINING

```
/Users/clawdbot/Workspace/remotion/lora-training/
├── HANDOFF.md (ce fichier)
├── source-clips/        # tous les clips video sources rassembles ici
├── dataset/             # clips processed (17 frames, 1024x576) + .txt captions
└── output/              # .safetensors recus de fal.ai apres training
```

---

## PLAN D'ACTION ETAPE PAR ETAPE

### ETAPE 1 — Inventaire et rassemblement des clips (1-2h)

**Objectif** : reunir tous les clips finaux dans `lora-training/source-clips/`.

```bash
# Inventaire complet des .mp4 dans le dossier remotion
find /Users/clawdbot/Workspace/remotion -name "*.mp4" -not -path "*/node_modules/*" -not -path "*/.git/*" -exec ls -lh {} \;
```

Ensuite avec ffprobe :
```bash
# Pour chaque clip candidat
ffprobe -v error -show_entries stream=width,height,duration,r_frame_rate -of json [clip.mp4]
```

**Livrable etape 1** : liste markdown des clips trouves avec metadonnees (chemin, duree, resolution, fps, taille). Soumettre a Aziz pour validation des clips a inclure.

---

### ETAPE 2 — Selection des 25-40 meilleurs clips (1h)

**Critere de selection** :
- Diversite **angles** (close-up, mid-shot, wide)
- Diversite **eclairage** (jour, dusk, interieur)
- Diversite **sujets** (personnage, environnement, action)
- **Coherence stylistique** : tous les clips doivent montrer le MEME style papercraft (papier, palette, texture)
- **Qualite individuelle** : pas de morphing visible, pas d'artefact, pas de scenes ratees

**Livrable etape 2** : liste finale des clips selectionnes (~25-40), copier dans `source-clips/` avec naming coherent : `clip_001.mp4`, `clip_002.mp4`, etc.

---

### ETAPE 3 — Preprocessing video (2-3h)

**Contraintes LTX 2.3 LoRA Trainer (fal.ai)** :
- Frames : divisible par 8+1 (recommande : 17 frames)
- Dimensions : divisibles par 32 (recommande : 1024x576)
- Format : .mp4
- Resolution coherente sur TOUS les clips (pas de mix)

**Workflow ffmpeg** :

```bash
# Pour chaque clip dans source-clips/
# 1. Extraire 17 frames depuis un point coherent du clip
# 2. Resize a 1024x576 (preserver aspect ratio si possible, sinon crop center)
# 3. Reencoder en .mp4 H.264

ffmpeg -i source-clips/clip_001.mp4 \
  -vf "select='not(mod(n\,N))',scale=1024:576:force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2,setpts=N/FRAME_RATE/TB" \
  -frames:v 17 \
  -c:v libx264 -pix_fmt yuv420p \
  dataset/clip_001.mp4
```

**Note importante** : pour les clips sources qui font 5-10 secondes, on peut extraire 1-2 sequences de 17 frames par clip source si interessant (ex: debut + milieu = 2 entrees dataset depuis 1 clip source). Cela permet d'obtenir 25-40 clips dataset depuis ~15-20 clips sources.

**Livrable etape 3** : 25-40 fichiers .mp4 dans `dataset/`, tous a 17 frames et 1024x576, valides par ffprobe.

---

### ETAPE 4 — Captions (1-2h)

Pour chaque `clip_NNN.mp4` dans `dataset/`, creer `clip_NNN.txt` avec :

**Format** :
```
[trigger_word], [description neutre du contenu], [details visuels factuels sans adjectifs de style]
```

**Exemple** :
```
sonjata_paper_v1, ancient baobab tree silhouetted against sunset, hand-cut paper texture visible, warm orange and red palette, wide shot
```

**Regles strictes** :
- Trigger word EN PREMIER (sinon LoRA s'active mal)
- Description du CONTENU, pas du style (le LoRA apprend le style tout seul si dataset coherent)
- Details factuels seulement (objets visibles, angle de camera, palette)
- Pas d'adjectifs subjectifs ("beautiful", "stunning", etc)
- 15-40 mots max par caption

**Process recommande** :
1. Visionner chaque clip (ouvrir dans QuickTime ou via `open clip.mp4`)
2. Caption manuelle pour les 5 premiers clips
3. Pour les suivants : utiliser un VLM (Claude vision, GPT-4o) pour generer une caption draft, puis ajuster manuellement
4. Verifier coherence trigger word sur TOUS les fichiers

**Livrable etape 4** : 25-40 fichiers .txt dans `dataset/`, un par clip, format respecte.

---

### ETAPE 5 — Validation pre-upload (30 min)

**Checks finaux avant zip** :

```bash
cd dataset/
# Verifier appariement clip/caption
ls *.mp4 | sed 's/.mp4//' | sort > clips.txt
ls *.txt | sed 's/.txt//' | sort > captions.txt
diff clips.txt captions.txt  # doit etre vide

# Verifier toutes captions commencent par le trigger word
for f in *.txt; do
  head -c 20 "$f" | grep -q "sonjata_paper_v1" || echo "MANQUE TRIGGER: $f"
done

# Verifier resolution coherente
for f in *.mp4; do
  ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0 "$f"
done | sort -u  # devrait afficher UNE seule ligne "1024,576"

# Verifier nombre de frames
for f in *.mp4; do
  echo -n "$f: "
  ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$f"
done  # devrait afficher 17 pour TOUS
```

**Livrable etape 5** : `dataset.zip` valide pret a uploader sur fal.ai.

---

### ETAPE 6 — Training fal.ai (30-40 min compute, $10)

1. Aziz uploade `dataset.zip` sur fal.ai LTX-2 Video Trainer
2. Configuration **default** (ne pas modifier au premier essai) :
   - Steps : 2000
   - Rank : 32
   - Learning rate : 1e-4
3. Lancer le training
4. **Pendant que ca tourne** : Aziz peut rentrer regarder les validation samples toutes les ~250 steps pour voir si le style emerge
5. Telecharger le `.safetensors` final dans `lora-training/output/sonjata_paper_v1.safetensors`

---

### ETAPE 7 — Validation du LoRA (1h, ~$2-5 sur fal.ai inference)

**Test decisif : 3 prompts, juger qualite** :

1. **Sujet present dataset** :
   `sonjata_paper_v1, baobab tree at dusk, wide shot, warm light`
   -> doit ressembler au style des clips d'entrainement

2. **Sujet absent dataset** :
   `sonjata_paper_v1, mountain temple at dawn, low angle`
   -> doit garder le style papercraft sur un nouveau sujet

3. **Sans trigger word** :
   `baobab tree at dusk, wide shot, warm light`
   -> ne doit PAS ressembler au style papercraft (sinon LoRA "fuit")

**Verdicts** :
- Tests 1+2+3 OK = LoRA valide, passer en production
- Test 1 OK + 2 KO = overfitting, dataset trop homogene, retrainer avec plus de diversite
- Test 3 KO = pas catastrophique, mais trigger word a retravailler

**Livrable etape 7** : verdict ecrit (markdown) avec les 3 videos test attachees, decision GO / NO-GO pour production.

---

## CRITERES DE SUCCES GLOBAL

Ce projet est un succes si :
- [ ] Dataset propre de 25-40 clips, 17 frames, 1024x576, bien captionnes
- [ ] LoRA trained sans erreur sur fal.ai
- [ ] Test prompts 1, 2, 3 reussis
- [ ] Couts totaux sous $50 (training + inference test)
- [ ] Fichier `.safetensors` recupere dans `output/`

Ce projet est un echec si :
- Style ne se transfere pas (LoRA invisible meme avec strength 1.0)
- Overfitting massif (LoRA reproduit clips dataset litteralement)
- Couts depassent $100 sans validation

En cas d'echec, NE PAS s'acharner. Documenter ce qui a foire dans `output/RESULTS.md` et revenir vers Aziz pour decider next step (refaire dataset, changer modele, abandonner).

---

## REFERENCES TECHNIQUES

### Stack confirmee
- **Modele base** : LTX-2.3-22b (Lightricks, Apache 2.0)
- **Trainer** : fal.ai LTX-2 Video Trainer (~$10/run, 30-40 min)
- **Inference test** : fal.ai LTX 2.3 (~$0.06/sec)
- **Production future** : RunPod H100 + ComfyUI (apres validation)

### Parametres training (DEFAULTS, ne pas modifier 1er essai)
- Rank : **32**
- Steps : **2000**
- Learning rate : **1e-4**
- Batch size : default fal.ai

### Contraintes dataset (NON-NEGOTIABLE)
- Frames par clip : **17** (regle 8+1 de LTX)
- Dimensions : **1024x576** (divisibles par 32)
- Format : **.mp4 H.264**
- Naming : `clip_NNN.mp4` + `clip_NNN.txt`
- Volume : **25-40 clips** (diversite > quantite)

### Trigger word
**`sonjata_paper_v1`** (a confirmer avec Aziz avant captioning)

### Captions
- Format : `[trigger], [description neutre], [details factuels]`
- 15-40 mots
- PAS d'adjectifs de style
- Trigger EN PREMIER

---

## RESSOURCES OFFICIELLES

- fal.ai LTX-2 Video Trainer User Guide : https://fal.ai/learn/devs/ltx-2-video-trainer-user-guide
- HuggingFace Lightricks/LTX-2.3 : https://huggingface.co/Lightricks/LTX-2.3
- GitHub Lightricks/LTX-2 : https://github.com/Lightricks/LTX-2
- WaveSpeed LTX-2.3 LoRA Training Guide : https://wavespeed.ai/blog/posts/ltx-2-3-lora-training-guide-2026/
- @ostrisai tuto YouTube : https://www.youtube.com/watch?v=JQIl8DFTL1M

---

## CHECKLIST FINALE (a remplir au fil de l'execution)

- [ ] Etape 1 : Inventaire clips fait, valide par Aziz
- [ ] Etape 2 : 25-40 clips selectionnes, copies dans source-clips/
- [ ] Etape 3 : Preprocessing fait, dataset/ rempli
- [ ] Etape 4 : Captions ecrites, trigger word present partout
- [ ] Etape 5 : Validation pre-upload OK, dataset.zip cree
- [ ] Etape 6 : Training fal.ai termine, .safetensors recupere
- [ ] Etape 7 : 3 tests valides, verdict GO/NO-GO documente
- [ ] Resultats reportes dans `output/RESULTS.md`

---

**Une fois la mission terminee** : Aziz reviendra dans le workspace `test last 30 days` pour decider de la suite (publication LoRA sur HF, scaling production RunPod, tutoriel FR, etc).
