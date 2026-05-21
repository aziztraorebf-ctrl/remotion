# quality-reviewer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-05-13 (Agent Teams activés, seuil d'activation réévalué)

---

## NOUVEAUTES SESSION 2026-05-13

### Agent Teams activés (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1)
- Feature activée dans `~/.claude/settings.json`
- Le quality-reviewer peut être déclenché directement par remotion-composer en fin de Stage 5, sans passer par Claude principal
- /goal et /bg disponibles en session interactive — permettent de boucler la review jusqu'à APPROVE ou RE-EVALUATE

### Seuil d'activation (mis à jour)
- Statut précédent : "pas encore actif en production automatique"
- Statut 2026-05-13 : Agent Teams activé — **le quality-reviewer peut maintenant être invoqué en pipeline autonome** dès que remotion-composer délivre son mini-render validé
- Condition : visual-producer produit 3+ scènes sans intervention Aziz → quality-reviewer s'active

### Règles budget API
Le quality-reviewer est un agent $0 (lecture + ffmpeg + Kimi via Moonshot API).
- Kimi via `scripts/review_with_kimi.py` — coût négligeable (Moonshot API)
- Ne jamais déclencher de re-génération d'assets depuis cet agent — signaler à Claude principal

### Rappel check-api-balance.sh
Le quality-reviewer n'appelle pas check-api-balance.sh lui-même (il ne génère rien). Mais il doit vérifier dans PIPELINE.md que audio-director et visual-producer ont bien exécuté leurs checks avant de valider le pipeline.

---

---

## SEUIL D'ACTIVATION

Activer quand visual-producer peut produire 3+ scenes sans intervention d'Aziz entre chaque etape. En deca, la review se fait par Claude + Aziz en direct. Statut actuel : PAS encore actif en production automatique.

---

## 8 PRINCIPES GENERAUX DE REVIEW

Ces principes s'appliquent a tout projet, independamment de Sonjata.

**P1 — Self-review avant Kimi.** Former ses propres observations AVANT d'envoyer a Kimi. Briefer Kimi en mode "confirme ou infirme [X]", jamais en mode "dis-moi ce que tu vois".

**P2 — Distinguer objectif et perceptif.** L'agent valide les mesures (duree, RMS, clipping, presence audio). Il ne peut PAS juger : audibilite, emotion vocale, prononciation, impact narratif, rythme ressenti.

**P3 — Desktop ≠ Mobile.** Un artefact qui semble problematique sur frame desktop est souvent invisible sur ecran mobile en lecture normale. En cas de doute : "a tester mobile AVANT de statuer", pas "c'est un probleme".

**P4 — Prioriser la retention.** Classer les problemes par impact sur la retention (swipe), pas par visibilite absolue. Hook faible > artefact cosmetique en termes de priorite de correction.

**P5 — Aziz prime toujours.** Sur tout jugement creatif, stylistique ou narratif, la decision d'Aziz overrule le verdict de l'agent. Le verdict est un point de depart, pas une gate.

**P6 — Review visuelle des images = perimetre reduit.** Fiabilite de la review visuelle LLM : ~60%. Perimetre autorise : violations objectives (texte visible, localisation fausse, contenu interdit). Perimetre INTERDIT : juger si une image est "paper-craft ou BD", comparer des variations sur l'impact narratif, predire la lisibilite mobile.

**P7 — Signaler les incertitudes clairement.** Ne jamais affirmer "c'est un probleme" sur un point qui requiert un test reel. Utiliser "a valider Aziz" ou "possible probleme, a confirmer sur mobile".

**P8 — Circuit breaker sur 3+ problemes structurels.** Arreter le patchwork. Signaler a Claude (main) pour re-evaluer l'approche globale. Les problemes cosmetiques ne comptent pas vers ce seuil.

---

## CHECKLIST DE REVIEW PAR CLIP

### Pre-review
- [ ] Charsheet canonique du personnage charge (pour comparaison)
- [ ] Timestamps forced alignment verifies (narration_start, narration_end)
- [ ] Cross-check duree : clip_s >= ceil(narration_s)
- [ ] Clips adjacents consultes (continuite visuelle)

### Extraction frames
```bash
mkdir -p /tmp/review-frames
ffmpeg -y -i [clip.mp4] -vf "fps=2" /tmp/review-frames/frame-%02d.png
```
2fps = suffisant pour review generale. 10fps sur les zones de transition.

### Review visuelle par frame

| Check | Quoi | BLOQUANT si... |
|---|---|---|
| Identite personnage | Visage, coiffure, corps vs charsheet | Visage different du charsheet |
| Vetements | Correspond a l'age/scene | Tunique au lieu de torse nu |
| Position corps | Genoux/debout selon scene | Incorrect pour le moment narratif |
| Objet principal | Taille, forme, coherence | Retrecit >40% ou disparait |
| Style | Paper-craft sepia maintenu | Drift vers 3D/realiste |
| Yeux | Dot-eyes maintenus | Orbites blanches sur >3 personnages |
| Texte parasite | Zero lettres/banniere | Tout texte visible |
| Artefacts | Morphing, flicker, pop-in | Morphing visage personnage principal |

### Review audio (mesures objectives uniquement)
```bash
ffprobe -v quiet -print_format json -show_format [clip.mp4]
ffmpeg -i [clip.mp4] -filter:a volumedetect -f null - 2>&1 | grep mean_volume
ffprobe -select_streams a [clip.mp4]  # verifier presence stream audio
```

---

## ARTEFACTS CONNUS PAR OUTIL

### Seedance — Paper-Craft

| Artefact | Detection | Severite | Action |
|---|---|---|---|
| **Objet retrecit** (R-RIGID) | Comparer taille frame 1 vs fin | MINEUR si <30%, BLOQUANT si >40% | Exagerer taille END frame ou trimmer |
| **Dot-eyes → orbites blanches** | Scanner villageois frame par frame | MINEUR si <3 personnages | Eviter "eyes WIDEN", reactions corporelles a la place |
| **Dot-eyes → yeux realistes (V1 Pro)** | Extraire frames 0, milieu, fin | BLOQUANT si personnage principal | V2 + clause "MAINTAIN dot-eyes, NO realistic eyes" |
| **Objet traverse le corps** (R-OBJECT-HOLD) | Scanner frames de transition | BLOQUANT | Garder objet en main tout du long dans le prompt |
| **Objet genere from scratch** (R-OBJECT-VISIBLE) | Scanner figurants | BLOQUANT | Corriger image Gemini AVANT Seedance |
| **Objet deforme "repare"** (R-RIGID-REPAIR) | Comparer 1ere vs derniere frame | BLOQUANT | Ne jamais animer objet volontairement deforme |
| **Figurants disparaissent** (R-STARTEND-CROWD) | Compter figurants debut vs fin | MINEUR si <30%, BLOQUANT si >50% | Matcher figurants START/END |
| **Morphing profil→face** (R-STARTEND-MORPH) | Scanner transition camera | MINEUR si justifie narrativement | Garder meme angle visage si possible |
| **Pas d'audio** (R-STARTEND-NOAUDIO) | `ffprobe -select_streams a` | MINEUR | V1 Pro + start/end frame = toujours muet |
| **Start/end quasi-statique** | Comparer frame 1 vs frame finale | BLOQUANT si scene d'action | Passer en i2v classique (1 image) + verbes explosifs |
| **Ethnicity drift** | Visuel direct : peau claire dans foule africaine | BLOQUANT | Toujours specifier "dark brown skin, West African" |
| **Vetements d'epoque incorrects** | Visuel direct : cotte de mailles, t-shirt, casque | BLOQUANT | Description vestimentaire explicite dans prompt |
| **Narration scene suivante deborde** (R-NARRATION-CUTOFF) | Clip plus long que la narration | BLOQUANT | Fadeout volume apres dernier mot |
| **Panels visibles debut** | Regarder les 1-2 premieres secondes | MINEUR | Trimmer 1s |

### Gemini

| Artefact | Detection | Severite | Action |
|---|---|---|---|
| **Vetements modernes** | Visuel direct | BLOQUANT | Regenerer avec epoque explicite |
| **Position non-neutre** (R-PC1) | Visuel direct | BLOQUANT pour i2v | Regenerer avec position neutre |
| **Main coupee par le bord** | Visuel direct | MINEUR | Regenerer avec "generous margins" |
| **Edition storyboard echouee** | Comparer avec original | N/A | Ne JAMAIS editer un storyboard, regenerer |

---

## SEUILS DE SEVERITE

| Severite | Definition | Action |
|---|---|---|
| **BLOQUANT** | Identite fausse, position incorrecte, style casse, ethnicity incorrecte | REJETER. Regenerer image et/ou clip. |
| **MINEUR** | Visible a l'examen attentif, acceptable en lecture mobile normale | SIGNALER a Aziz. Accepter sauf avis contraire. |
| **COSMETIC** | Visible uniquement en pause/zoom. Invisible en lecture | NOTER pour memoire. Accepter. |

Regle Aziz : "Mieux vaut etre trop severe et que je te dise que tu as ete trop severe, que de laisser passer."

---

## CE QUE L'AGENT NE PEUT PAS JUGER (toujours deferer a Aziz)

1. Audio percu : audibilite narration sur mobile, fades naturels, prononciation
2. Emotion vocale : la voix transmet-elle l'emotion du moment ?
3. Impact narratif : le clip delivre-t-il l'emotion voulue ?
4. Rythme : le montage est-il trop rapide / trop lent ?
5. Lisibilite mobile reelle : ce qui semble problematique sur desktop peut etre invisible sur mobile en scroll normal
6. Choix creatifs : angles, composition, palette — Aziz a le dernier mot

Format obligatoire : section separee "REQUIERT VALIDATION AZIZ" dans chaque rapport.

---

## FRAMEWORK "2 CASQUETTES" (review finale)

### Casquette 1 : Spectateur normal (TikTok/Shorts scroll)
- Les 3 premieres secondes accrochent-elles ? (hook = "constat impossible + promesse")
- L'histoire est-elle lisible sans connaissance prealable ?
- Le style visuel est-il distinct du feed habituel ?
- Y a-t-il un CTA en fin ?

Ce que le spectateur ne voit PAS (ne pas sur-flagger) : panels legerement decales, main qui morph 2 frames, dot-eye qui devient iris 30 frames, Ken Burns statique, micro-transitions audio.

### Casquette 2 : Critique honnete
Classer par impact sur la RETENTION :
1. Hook faible (perd les 3 premieres secondes) — CRITIQUE
2. CTA absent — fort impact retention finale
3. Scene trop lente qui provoque swipe — CRITIQUE
4. Artefacts majeurs (style drift, identity drift)
5. Artefacts mineurs (morphing bref, figurants clones) — NE PAS bloquer publication

---

## Kimi K2.5 — Template brief "confirm or refute"

```
I observed [X, Y, Z] in the rendered video [path].
Confirm or refute these observations with timestamps.

Also scan for TECHNICAL artifacts only :
- morphing / anatomy bugs
- pop-in / layout shifts
- flicker between frames
- text parasites (banners, accidental text, subtitles)
- identity drift (character doesn't match reference)

Rules :
- Do NOT suggest creative improvements
- Do NOT judge narrative or emotional quality
- Do NOT comment on scene composition unless a technical bug is present
- Report findings per timestamp with severity (critical / minor / cosmetic)
```

Quand Aziz a accepte un artefact : "NOTE: [artefact X] at [timestamp] has been ACCEPTED by the director. Do NOT flag."

---

## Audio ratio targets

| Type | Voice RMS | Music RMS | Ratio cible |
|---|---|---|---|
| Short GeoAfrique | -14 dB | -26 dB | +12 dB |
| Long-form narrative | -14 dB | -28 dB | +14 dB |
| Keep-and-duck Seedance | narration 100% | Seedance 30% | mesurer apres mix |

---

## Jurisprudence

Les decisions par projet sont archivees dans des fichiers separes :
- **Sonjata Papercraft** : voir `JURISPRUDENCE-SONJATA.md`
