# quality-reviewer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-22 (sessions 7-8 Sonjata + VALIDATION FINALE Short + vision Aziz)

---

## SEUIL D'ACTIVATION (decide 2026-04-20 par Aziz)

**Activer le quality-reviewer quand** : le visual-producer peut produire 3+ scenes sans intervention d'Aziz entre chaque etape. L'agent filtre AVANT de presenter a Aziz.

**En attendant** : la review se fait par Claude (orchestrateur) + Aziz en direct. Cette memoire s'enrichit a chaque session pour preparer l'agent.

**Statut 2026-04-22** : PAS encore actif en production. Sonjata complete sans invocation. Seuil pas atteint car visual-producer n'a pas ete teste sur une production autonome 3+ scenes (chaque scene a necessite iteration avec Aziz).

---

## CHECKLIST DE REVIEW PAR CLIP (ce que Claude fait aujourd'hui, l'agent fera demain)

### Pre-review (avant de regarder le clip)
- [ ] Charsheet canonique du personnage charge (pour comparaison)
- [ ] Timestamps forced alignment verifies (narration_start, narration_end)
- [ ] Cross-check duree : clip_s >= ceil(narration_s)
- [ ] Clips adjacents consultes (continuite visuelle)

### Extraction frames
```bash
mkdir -p /tmp/review-frames
ffmpeg -y -i [clip.mp4] -vf "fps=2" /tmp/review-frames/frame-%02d.png
```
- 2fps = suffisant pour review generale
- 10fps sur les zones de transition/jonction (pour micro-jumps)

### Review visuelle — frame par frame
Pour CHAQUE frame extraite, verifier :

| Check | Quoi | BLOQUANT si... |
|---|---|---|
| Identite personnage | Visage, coiffure, corps vs charsheet | Visage different du charsheet |
| Vetements | Correspond a l'age/scene | Tunique au lieu de torse nu (enfant) |
| Position corps | Genoux/debout selon scene | Sunjata debout quand il devrait etre a genoux |
| Objet principal | Taille, forme, coherence | Barre retrecit >40% (accepte si <30%) |
| Style | Paper-craft sepia maintenu | Drift vers 3D/realiste |
| Yeux | Dot-eyes maintenus | Orbites blanches sur >3 personnages |
| Figurants | Nombre, diversite, pas de clones | Personnage duplique (fantome) |
| Texte parasite | Zero lettres/banniere | Tout texte visible |
| Artefacts | Morphing, flicker, pop-in | Morphing visage personnage principal |

### Review audio (mesures objectives SEULEMENT)
```bash
ffprobe -v quiet -print_format json -show_format [clip.mp4]
ffmpeg -i [clip.mp4] -filter:a volumedetect -f null - 2>&1 | grep mean_volume
```
- Duree clip vs duree narration
- RMS voice vs music ratio (cible +12dB pour Shorts)
- Clipping detection
- L'agent NE PEUT PAS juger : audibilite, emotion vocale, prononciation

### Continuite inter-scenes
- Derniere frame scene N-1 vs premiere frame scene N
- Memes personnages ? Meme decor ? Meme palette ?
- Barre droite fin scene 3 → mains sur barre debut scene 4 ? (coherence objet)

---

## ARTEFACTS CONNUS PAR OUTIL (enrichi sessions 1-4)

### Seedance 2.0 — Paper-Craft

| Artefact | Cause | Detection | Severite | Action |
|---|---|---|---|---|
| **Barre/objet retrecit** | R80 : objets rigides ne gardent pas leur taille en start/end frame | Comparer taille objet frame 1 vs dernieres frames | MINEUR si <30%, BLOQUANT si >40% | Exagerer taille END frame ou trimmer |
| **Dot-eyes → orbites blanches** | Prompt "eyes WIDEN" ou reaction choc | Scanner villageois frame par frame | MINEUR si <3 personnages | Ne pas utiliser "eyes WIDEN", reactions corporelles |
| **Forgeron/personnage modifie** | Seedance reinvente un personnage secondaire | Comparer avec image source | MINEUR si apparition breve | Accepter si <2s a l'ecran |
| **Panels visibles au debut** | Storyboard colore R-PC16 : Seedance montre la grille | Regarder les 1-2 premieres secondes | MINEUR | Trimmer 1s |
| **Sunjata debout au lieu de a genoux** | Storyboard montrait debout / prompt pas assez explicite | Scanner toutes les frames | BLOQUANT | Rejeter, corriger storyboard |
| **Sueur disparait** | Seedance ne maintient pas les micro-details | Comparer debut vs milieu | COSMETIC | Accepter |
| **Enfant multiplie (fantome)** | Prompt figurant trop vague ("children run") | Scanner arriere-plan | MINEUR | Reecrire prompt avec identite+direction+destination |
| **Arme fantome** | Conflit prompt vs ref video | Scanner tous les frames | MINEUR si 1 frame, BLOQUANT si recurrent | Clarifier prompt |
| **Objet traverse le corps** | Degainer/rengainer sabre, objet change de main | Scanner frames de transition | BLOQUANT | R-OBJECT-HOLD : garder objet en main tout du long |
| **Objet genere from scratch** | Prompt mentionne un objet absent de l'image source | Scanner figurants pour objets incongrus | BLOQUANT | R-OBJECT-VISIBLE : corriger image Gemini AVANT Seedance |
| **Objet deforme "repare"** | Barre pliee → redressee par Seedance | Comparer 1ere vs derniere frame | BLOQUANT | R-RIGID-REPAIR : ne jamais animer objet volontairement deforme |
| **Figurants disparaissent** | Camera change de perspective (side→top-down) | Compter figurants debut vs fin | MINEUR si <30%, BLOQUANT si >50% | R-STARTEND-CROWD : matcher figurants START/END |
| **Morphing profil→face** | Personnage change d'angle entre START et END | Scanner transition camera | MINEUR si justifie narrativement | R-STARTEND-MORPH : garder meme angle visage si possible |
| **PAS d'audio malgre generate_audio:true** | Endpoint V1 Pro ou mode start/end frame | ffprobe -select_streams a | MINEUR (prevoir narration-only) | R-STARTEND-NOAUDIO : V1 Pro et start/end = muet |
| **Soldats/foule ethniquement incorrects** | Gemini default vers peau claire sans instruction explicite | Visuel direct | BLOQUANT | Toujours specifier "dark brown skin, West African" |
| **Style drift vers 3D** | Prompt trop realiste / refs conflictuelles | Comparer avec clip valide precedent | BLOQUANT | Rejeter, renforcer style anchor |
| **Dot-eyes → yeux realistes (V1 Pro)** | V1 Pro drift les dot-eyes en iris/pupilles realistes apres 3s+ de camera rapprochee | Extraire frames 0, milieu, fin — comparer yeux | BLOQUANT si personnage principal | Utiliser V2 + clause "MAINTAIN dot-eyes, NO realistic eyes, NO visible iris" |
| **Start/end frame quasi-statique** | Interpolation trop douce entre 2 poses = pas de mouvement visible | Comparer frame 1 vs frame finale | BLOQUANT si scene d'action | Passer en i2v classique (1 image, pas de end_image_url) + verbes explosifs |
| **Vetements Vikings sur guerriers africains** | Gemini default sans epoque specifiee | Visuel direct — cottes de mailles, casques, boucliers ronds | BLOQUANT | Regenerer avec description vestimentaire XIII siecle Mande |
| **Audio Seedance mumble** | generate_audio: true + personnage qui parle | Ecouter (Aziz) | COSMETIC | Keep-and-duck 30% masque le mumble |
| **Narration scene suivante deborde** | Clip plus long que la narration | Ecouter fin du clip | BLOQUANT | R-NARRATION-CUTOFF : fadeout volume apres dernier mot |

### Gemini 3.1 Flash

| Artefact | Cause | Detection | Severite | Action |
|---|---|---|---|---|
| **Vetements modernes** | Pas d'epoque specifiee dans le prompt | Visuel direct | BLOQUANT | Regenerer avec epoque explicite |
| **Position non-neutre** (R-PC1) | Personnage en action dans START frame | Visuel direct | BLOQUANT pour i2v | Regenerer avec position neutre |
| **Un genou leve** | Sunjata avec un genou up au lieu de deux | Visuel direct | BLOQUANT | Regenerer avec "BOTH knees on ground" |
| **Layout storyboard 2x3 au lieu de 3x2** | Gemini interprete mal le layout | Visuel direct | MINEUR | Adapter prompt Seedance ou regenerer |
| **Main coupee par le bord** | Composition trop serree | Visuel direct | MINEUR | Regenerer avec "generous margins" |
| **Edition chirurgicale echouee** | Gemini modifie les mauvais panels | Comparer avec original | N/A | Ne JAMAIS editer un storyboard, TOUJOURS regenerer |

---

## SEUILS DE SEVERITE

| Severite | Definition | Action |
|---|---|---|
| **BLOQUANT** | Le clip est inutilisable en l'etat. Identite fausse, position incorrecte, style casse. | REJETER. Regenerer image et/ou clip. |
| **MINEUR** | Visible a l'examen attentif mais acceptable en lecture normale sur mobile. | SIGNALER a Aziz. Accepter sauf avis contraire. |
| **COSMETIC** | Visible uniquement en pause/zoom. Invisible en lecture. | NOTER pour memoire. Accepter. |

**Regle Aziz** : "Mieux vaut etre trop severe et que je te dise que tu as ete trop severe, que de laisser passer."

---

## DECISIONS ACCEPTEES PAR AZIZ (jurisprudence)

Ces decisions creent un precedent — ne pas re-signaler comme probleme dans les futures sessions :

| Date | Scene | Decision | Raison |
|---|---|---|---|
| 2026-04-20 | Scene 3 | Forgeron-montagne accepte | Apparition breve, effet visuel interessant |
| 2026-04-20 | Scene 4 | Barre retrecit ~30% | Orbite 180 masque le probleme, impact emotionnel intact |
| 2026-04-20 | Scene 4 | Yeux blancs villageois | Mineur, <3 personnages, mobile = invisible |
| 2026-04-20 | Scene 4 | Sueur disparait | Cosmetic, pas d'impact narratif |
| 2026-04-20 | Scene 3 | Trim 1s debut (panels visibles) | Standard pour storyboard colore R-PC16 |
| 2026-04-19 | Scene 2 | "rampe" sonne "rame" dans lip-sync | Mineur, accepte car narration ElevenLabs couvre |
| 2026-04-19 | Scene 1 | Zoom trop fort sur bebe dernieres frames | A traiter en assemblage (crop/freeze) |
| 2026-04-20 | Scene 5A | Ken Burns au lieu de Seedance (barre pliee) | R-RIGID-REPAIR : Seedance redresse la barre. Ken Burns = $0, pas d'artefact |
| 2026-04-20 | Scene 5B | Figurants reduits (~7 au lieu de ~10 en top-down) | R-STARTEND-CROWD : mineur, couvert par narration, scene courte |
| 2026-04-20 | Scene 5B | Micro-morphing Sunjata (profil→top-down) | R-STARTEND-MORPH : justifie narrativement (il arrache l'arbre) |
| 2026-04-20 | Scene 6A | Pas d'audio Seedance | V1 Pro endpoint, narration-only accepte pour scene contemplative |
| 2026-04-20 | Scene 6B v1 | REJETE : lance fantome + sabre traverse bras | R-OBJECT-VISIBLE + R-OBJECT-HOLD violes |
| 2026-04-20 | Scene 6C | Bouche messager trop rapide | Mineur, couvert par narration |
| 2026-04-20 | Scene 5B | Pas d'audio malgre generate_audio:true | R-STARTEND-NOAUDIO confirme + V1 Pro = muet |
| 2026-04-21 | Scene 7A | Style Soumaoro plus "comic book" que paper-craft | Personnage nouveau = pas de precedent, rupture acceptable |
| 2026-04-21 | Scene 7B v1 | REJETE : dot-eyes → yeux realistes (V1 Pro) | V1 Pro drift les yeux. Regen avec V2 = dot-eyes maintenus |
| 2026-04-21 | Scene 7C v1 | REJETE : quasi-statique en start/end frame | i2v classique = tir dynamique visible |
| 2026-04-21 | Scene 7D | Lance au sol apparue de nulle part | Artefact mineur, accepte — detail cinematographique |
| 2026-04-21 PM | Scene 8 | Orbite 90 camera + dot-eyes + objets en main | "Parmi les meilleurs clips qu'on a genere" — pipeline rode |
| 2026-04-21 PM | Scene 8B | Tablette avec inscriptions N'Ko ajoutees via edit chirurgicale | "Ca fait beaucoup plus mieux qu'une tablette vide" |
| 2026-04-21 PM | Scene 9 | PIL post-process transparence (seuil 160 alpha 0) | Valide pour symboles Gemini fond blanc → transparent |
| 2026-04-22 | Scene 10A/10C | Fond brun quasi-noir | **Claude avait flag comme probleme → Aziz : "sur mobile ca ne se voit pas"**. Le reviewer etait trop severe. Lecon : noter les doutes mais deferer aux tests reels mobile. |
| 2026-04-22 | Scene 10B | Split vertical video (scene 2 \| scene 8) sur 9:16 etroit | "L'une des plus spectaculaires, signature a garder" — la double action lisible sur mobile malgre le split etroit |
| 2026-04-22 | Hook cut | Mot "se lever" legerement tronque au cut hook → scene 1 | **Accepte** : "si cela demande de tout refaire, c'est correct". Micro-detail mineur. |
| 2026-04-22 | Musique | Volume 0.15 fade-in 2s + fade-out 2s | Couvre les trous sonores (scenes 5A, 9, 10A, 10C) sans dominer narration |

---

## CE QUE L'AGENT NE PEUT PAS JUGER (TOUJOURS deferer a Aziz)

1. **Audio percu** : audibilite narration sur mobile, fades naturels, prononciation correcte
2. **Emotion vocale** : la voix transmet-elle l'emotion du moment ?
3. **Impact narratif** : le clip delivre-t-il l'emotion voulue ?
4. **Rythme** : le montage est-il trop rapide / trop lent ?
5. **Choix creatifs** : angles de camera, composition, palette — Aziz a le dernier mot
6. **Lisibilite mobile reelle** (ajoute 2026-04-22) : ce qui semble problematique sur frame desktop est souvent invisible sur ecran mobile en scroll normal. Exemple : scene 10 fond quasi-noir ou split video 9:16 etroit = Claude avait flag, Aziz a vu sur mobile et a valide.

**Format obligatoire dans le rapport** : section separee "REQUIERT VALIDATION AZIZ" listant explicitement ces points.

**Meta-regle 2026-04-22** : en cas de doute sur un point qui requiert un test mobile reel, NE PAS affirmer "c'est un probleme" mais dire "possible probleme sur desktop, a tester sur mobile AVANT de conclure".

---

## VISION AZIZ (framework de review post-Sonjata)

**Deux casquettes obligatoires lors d'une review finale** :

### Casquette 1 : Spectateur normal (TikTok/Shorts scroll)
Questions :
- Les 3 premieres secondes accrochent-elles ? (hook = pattern "constat impossible + promesse")
- L'histoire est-elle lisible sans connaissance prealable ?
- Le style visuel est-il **distinct** du feed habituel ?
- La musique installe-t-elle l'ambiance immediatement ?
- Y a-t-il un CTA en fin pour convertir l'attention en action ?

Ce que le spectateur ne voit PAS (et qu'il ne faut pas sur-flagger) :
- Panels legerement decales
- Main qui morph 2 frames
- Dot-eye qui devient iris 30 frames
- Ken Burns statique (norme sur Shorts)
- Micro-transitions audio entre scenes (si musique continue couvre)

### Casquette 2 : Critique honnete
Classer les problemes par ordre d'IMPACT SUR LA RETENTION, pas par visibilite absolue :
- Scene trop longue/lente qui provoque swipe
- Hook faible qui perd les 3 premieres secondes
- CTA absent = -30% retention finale
- Artefacts majeurs (style drift, identity drift)

Artefacts mineurs (morphing bref, figurants clones, couleur hors palette) : noter mais **NE PAS bloquer la publication** si ca ne casse pas la retention.

---

## LECONS SESSION 8 (2026-04-22) — META-LECONS SUR LA REVIEW

### L1 : Ne pas confondre frame desktop et experience mobile
Claude a flag scene 10A/10C comme "fond quasi-noir = risque swipe dans les 3 dernieres secondes". Aziz sur mobile : invisible comme probleme.
**Regle** : en cas de doute visuel sur un fond/contraste, dire "a tester mobile AVANT de statuer", pas "c'est un probleme".

### L2 : Hook pattern = retention >> artefacts mineurs
L'ajout du hook 5s a plus d'impact sur la retention qu'une correction de micro-artefact. Prioriser le hook AVANT les corrections cosmetiques.

### L3 : Micro-gaps audio = acceptables si narration continue
Le mot "se lever" legerement tronque au cut hook → scene 1 : Aziz accepte "si ca demande de tout refaire, c'est correct". Principe : ne pas refaire un render complet pour un micro-detail audio. Ajouter le signalement pour liste de corrections mineures post-publication.

### L4 : Coherence narration/image = force cachee du Short
Ce qui semble "normal" (un beat narratif = une action visuelle synchrone) est en realite RARE dans le genre educational Short. La plupart des createurs ont des images generiques qui passent pendant que la narration dit autre chose. Le forced alignment + ancrage mot-par-mot est le **vrai avantage competitif invisible**. A mentionner dans les verdicts positifs comme force du pipeline.

### L5 : "Cas d'ecole" + "Premier Short legitime" = ET, pas OU
Un projet qui a valide le pipeline est AUSSI un projet publiable. Ne pas dire "c'est juste pour tester" — publier proprement pour mesurer les vraies donnees spectateur.

### L6 : Diagnostic pipeline = rode a 60-70%, pas 100%
Sonjata = 7 sessions, ~$52, ~25h pour 2min26 avec 6+ regenerations couteuses (V1 Vikings, V1 Mema sabre, prompt Minimax electronique, etc.). Les gates `pipeline_gates.py` existent mais ne sont pas integres comme wrapper obligatoire. Prochaine phase critique : integration gates AVANT Short #2 Abou Bakari.

---

## Kimi K2.5 — Templates de brief

### Template standard "confirm or refute"
```
I observed [X, Y, Z] in the rendered video [path].
Confirm or refute these observations with timestamps.

Also scan for these TECHNICAL artifacts only :
- morphing / anatomy bugs
- pop-in / layout shifts
- flicker between frames (objects appearing/disappearing)
- text parasites (banners, accidental text, subtitles)
- identity drift (character doesn't match reference)

Rules :
- Do NOT suggest creative improvements
- Do NOT judge narrative or emotional quality
- Do NOT comment on scene composition unless a technical bug is present
- Report findings per timestamp with severity (critical / minor / cosmetic)
```

### Template scene specifique
```
At [timestamp X.Xs], I see [describe observation].
Confirm or refute : is this a bug or intentional ?
If bug : severity and cause ?
```

### Quand Aziz a accepte un artefact
Ajouter dans le brief : "NOTE: [artefact X] at [timestamp] has been ACCEPTED by the director. Do NOT flag this as an issue."

---

## Audio ratio targets

| Type | Voice RMS | Music RMS | Ratio cible |
|---|---|---|---|
| Short GeoAfrique | -14 dB | -26 dB | +12 dB |
| Long-form narrative | -14 dB | -28 dB | +14 dB |
| Keep-and-duck Seedance | narration 100% | Seedance 30% | mesurer apres mix |

---

## Session log

### 2026-04-13 (initial)
Agent cree. Remplace kimi-reviewer + visual-qa.

### 2026-04-14 — Soundjata Acte VII (APPROVE one-shot)
Premiere utilisation en production. Self-review + Kimi. Verdict APPROVE.
Cout Kimi : $0.02. Zero artefact critical.

### 2026-04-20 — Memoire enrichie (PAS invoque en production)
Enrichissement massif de la memoire avec les lecons des sessions 1-4 Sonjata Papercraft.
Claude orchestrateur a documente tout ce qu'il fait lors des reviews pour transferer au quality-reviewer.
Checklist de review, artefacts connus, seuils de severite, jurisprudence decisions Aziz.
Seuil d'activation defini : quand visual-producer produit 3+ scenes sans intervention.

### 2026-04-20 SOIR — Session 5 lecons (PAS invoque en production)
7 nouveaux artefacts Seedance documentes (objet traverse corps, objet genere from scratch, objet "repare",
figurants disparaissent, morphing profil→face, audio manquant V1/start-end, narration deborde).
8 nouvelles decisions Aziz en jurisprudence. Agent quality-reviewer.md enrichi avec :
- Paper-craft specific checks (dot-eyes, R-RIGID, R-OBJECT-VISIBLE, R-STARTEND-CROWD, R-STARTEND-MORPH)
- Narration overflow check (R-NARRATION-CUTOFF)
- Audio stream presence check (V1 Pro vs V2 endpoint)
- Ethnicity check pour foules
- Nouveaux exemples structurels et cosmetiques dans circuit breaker

### 2026-04-21 — Session 6 lecons (PAS invoque en production)
3 nouveaux artefacts documentes : dot-eyes V1 Pro drift, start/end quasi-statique, vetements Vikings.
5 nouvelles decisions Aziz en jurisprudence (scene 7). Lecons cles :
- V2 > V1 Pro pour maintenir les dot-eyes paper-craft
- Clause dot-eyes explicite obligatoire dans tout prompt paper-craft
- i2v classique > start/end frame pour action (tir arc, combat)
- ElevenLabs SFX API comme alternative audio quand pas d'audio Seedance
- Extraction frames pour comparer V1 Pro vs V2 = methode de diagnostic validee

### 2026-04-21 PM — Session 7 lecons (PAS invoque en production)
Scenes 8, 9, 10 assemblees. 4 nouvelles decisions jurisprudence :
- Orbite 90 = pseudo-3D isometrique (4eme confirmation cross-scenes)
- Edition chirurgicale Gemini pour ajouter inscriptions N'Ko = valide
- PIL post-process (seuil brightness > 160 → alpha 0) pour transparence symboles Gemini
- Split vertical video 9:16 fonctionne sur mobile malgre l'etroitesse

### 2026-04-22 — Session 8 lecons META (PAS invoque en production)
Sonjata Short VALIDE par Aziz en integral. Ajouts memoire critiques :
- **6 meta-lecons sur la review** (L1-L6) : ne pas confondre desktop/mobile, hook > artefacts mineurs, micro-gaps audio acceptables, coherence narration/image = force cachee, "cas d'ecole" ET "publiable", pipeline rode 60-70%
- **Framework "2 casquettes"** (spectateur normal + critique honnete) pour structurer toute review finale
- **Vision Aziz** documentee : prioriser retention (hook, CTA, rythme) sur artefacts cosmetiques
- **4 nouvelles decisions jurisprudence** hook/musique/fond sombre/split video
- **Diagnostic honnete** : pipeline pas totalement rode, gates `pipeline_gates.py` non integres comme wrapper bloquant = prochain chantier critique

Status de l'agent apres session 8 : memoire tres riche, checklist + jurisprudence + framework + meta-lecons. **Prochaine etape** : premiere invocation reelle sur Short #2 Abou Bakari (quand visual-producer sera teste autonome 3+ scenes).
