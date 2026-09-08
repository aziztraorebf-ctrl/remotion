---
name: Rules Seedance & Paper-Craft — Consolidated
description: All production rules for Seedance clips and paper-craft style. Feedbacks fusionnes en un seul fichier par domaine.
type: feedback
originSessionId: 70cf5f72-466b-4335-978d-427170a957ee
---
# Rules Seedance & Paper-Craft

> Consolide 2026-04-20. Source : 12 feedbacks fusionnes.
> R-PROMPT-LIBERAL ajoutee 2026-04-23 apres echec Scene 1 v2 Thiaroye (sur-prompt contre-productif).
> **R-PROMPT-LIBERAL v2** : affinee 2026-04-23 apres test V3 (liberal composition + strict technique).

## Prompt minimaliste vs sur-contrainte (R-PROMPT-LIBERAL v2)

En image-to-video paper-craft, **privilegier prompts Seedance courts et ouverts sur la composition** (5-10 lignes max) **ET garder les 2-3 contrats techniques critiques non-negociables**. Combine avec **images source vivantes** (personnages deja en mouvement amorce).

### Formule affinee v2 (apres test V3 Scene 1 Thiaroye)

Le V3 minimaliste a prouve le principe liberal pour la **diversite compositionnelle** (succes) MAIS a relache les regles techniques critiques cote image source Gemini (dot-eyes viole, hatching apparu). Applique a Seedance, meme logique :

**Eviter** (cote Seedance) :
- Micro-instructions par personnage ("X fait Y a la seconde Z")
- Strict character counts ("exactement 3 tirailleurs") — force Seedance a "compenser" et inventer des personnages quand quelqu'un sort du cadre pendant un tracking
- Listes de 10+ NO/NOT/NEVER **sur des elements compositionnels**
- Positions fixes neutres dans l'image source (contredit R-DYNAMIC)

**Preferer** (cote Seedance) :
- Description d'ambiance globale
- Mouvements amorces dans l'image source (personnages deja en train de marcher, tourner la tete, fumer, s'accouder)
- 2-3 regles critiques **techniques** non negociables (style paper-craft, dot-eyes, pas de texte, pas de drift BD)
- Laisser Seedance creer ses transitions naturelles

**Nuance importante** : les NO/NOT sur les **contrats techniques** (anti-hatching, anti-BD-drift, anti-text) sont legitimes meme dans un prompt court. Ce qui est contre-productif, c'est les NO sur la **composition** (ou placer qui, quelle posture exacte).

**Raison** : les modeles video sur-compensent quand ils sont ecrases par contraintes compositionnelles strictes. Moins de micro-instructions = mieux. Donner un vecteur creatif sur la scene + un contrat strict sur le style. Valide par echec Scene 1 v2 Thiaroye (2026-04-23) : 50+ lignes de micro-instructions + strict character count = 4e tirailleur invente + drift BD.

**S'applique AVEC** R-STRUCTURE (ordre des elements reste le meme) mais limite le niveau de detail a l'interieur de chaque bloc **sauf pour la section STYLE/TECHNIQUE** qui reste explicite.

## Structure de prompt Seedance (R-STRUCTURE)

Ordre OBLIGATOIRE des elements dans tout prompt Seedance. Cet ordre optimise la comprehension du modele.

```
1. STYLE ANCHOR (1-2 lignes)
   "Animate this exact illustration. STRICT STYLE FIDELITY: [style description]"

2. CINEMATOGRAPHIE — camera d'abord (1-2 lignes)
   Shot type + mouvement camera pour tout le clip
   "Camera SLOWLY ORBITS 180 degrees..." / "Camera HOLDS STEADY..." / "Tracking shot following..."

3. SUJET — specificite physique (par shot, SECONDS X TO Y)
   Pas "il bouge" mais "his arms TREMBLE violently, knuckles TIGHTEN, jaw CLENCHES"
   Verbes d'action FORTS en MAJUSCULES

4. CONTEXTE — environnement + personnages secondaires
   Reactions des figurants, decor, atmosphere

5. STYLE + COLOR GRADE (si pas deja dans le style anchor)
   Palette, eclairage, texture

6. ANTI-ARTEFACTS + AUDIO (fin de prompt)
   "No text, no banners..." / "No music, no words, no dialogue"
   Contraintes rigides : "RIGID, NON-DEFORMING", "NEVER stands", etc.
```

**Why:** Formalise apres analyse du workflow AI Samson (2026-04-20). La camera en premier dit a Seedance COMMENT filmer avant de dire QUOI filmer. Les anti-artefacts en fin = derniere instruction = la plus respectee.

---

## Prompts

### R-DYNAMIC : Mouvement intrinseque OBLIGATOIRE sur Shorts (2026-04-23)

**Tout Short 9:16 doit avoir au moins UN mouvement intrinseque par scene — le mouvement camera VIENT EN PLUS, pas a la place.**

**Contexte d'apprentissage** : Thiaroye V5 scene 1 v1 (tirailleurs immobiles + dolly in + orbit 45deg camera) = seule la camera bouge. Perte retention garantie sur Short. Cout $3.90 en Seedance gaspille. La fidelite au manifest ("dignes immobiles") a ete suivie sans penser dynamique Short.

**Ne pas confondre avec R-PC1** : R-PC1 dit "image source = position neutre, laisser Seedance animer". R-DYNAMIC dit "l'image source doit contenir AU MOINS UN element qui peut etre anime intrinsequement". Les deux se combinent : position neutre + element dynamique potentiel (navire, fumee, eau, vent, feuille).

**Regle** :
- Avant de lancer un prompt Seedance i2v, repondre a : "Qu'est-ce qui bouge intrinsequement dans le cadre pendant 5-13s ?"
- Si la seule reponse est "la camera" = STOP, regen l'image source avec element dynamique ajoute.
- Lister EXPLICITEMENT dans le prompt Seedance les mouvements intrinseques attendus :
  - Elements : navire qui glisse, fumee qui monte, eau qui ondule, tiroir qui se ferme, vent dans vetements, vagues, oiseaux en vol
  - Actions : main gantee qui range, main qui tombe, personnage qui tourne la tete
  - Changements d'etat : portrait qui s'illumine, poussiere qui s'etend, ciel qui evolue, flamme de bougie
- Scenes "contemplatives" = rythme lent + mouvement subtil, PAS absence totale de mouvement.
- Exception rare : plan-tableau post-action <3s, encadre par scenes dynamiques.

**Check pre-prompt obligatoire (1 ligne a ajouter dans tous les preview-before-pay)** :
```
Mouvement intrinseque : [lister ce qui bouge dans l'image] + mouvement camera en plus
```

### R-DYNAMIC v2 : Vie organique des personnages (2026-04-23, enrichissement)

**Pas seulement des elements externes (navire, eau, fumee) qui bougent — les personnages eux-memes doivent avoir de la vie organique.**

**Principe** : postures naturelles variees + activites secondaires (fumer, discuter, observer, s'appuyer). **Neutre != sans vie.** R-PC1 parle de "pas d'ACTION MAJEURE gelee" — il n'interdit pas les activites secondaires.

**Equilibrage R-PC1 vs R-DYNAMIC v2** :
- Interdit (R-PC1 neutre) : salut militaire fige, bras leve en triomphe, combat swing fige, pointage dramatique fige
- **Encourage** (R-DYNAMIC v2) : fumer (cigarette smoke = matiere anim), discuter en petits groupes, s'appuyer sur rambarde (weight shift), regarder au loin, tenir son beret en main, mains dans poches, sacs poses au sol avec personnage assis dessus

**Exceptions immobilite legitimes** : recueillement (tombe, memorial), dignite funeraire, silhouettes tombees R-PC19, portrait politique pose.

**Contradiction trap** : si prompt Gemini contient a la fois une section "INTRINSIC MOTION ANCHORS" (mouvement attendu) ET une section "CHARACTER POSITION CRITICAL" (immobilite imposee) = contradiction interne. Gemini suivra la contrainte restrictive et produira des statues. **Check pre-envoi obligatoire** : scanner les sections pour detecter contradictions dynamique/immobilite.

**Applique des scenes** : arrivee de navire, retour de voyage, observation, quotidien, conversation = vie organique. Recueillement, memorial, post-massacre = immobilite.

### Pas de mots "lents" (R-SLOW)
Bannir "slowly", "slow", "gentle", "subtle", "soft", "delicate" dans les prompts Seedance — ils produisent du quasi-statique.
- **Why:** Regle 68 Seedance = scenes calmes -> quasi-statique. Ces mots renforcent le biais.
- **Remplacements:** "pushes in slowly" -> "TIGHTENS on" | "slow zoom" -> "PULLS BACK to reveal" | "gently moves" -> "SHIFTS toward" | "subtle push" -> "camera ADJUSTS framing"
- Exception : si Aziz demande explicitement une scene contemplative lente.

### Decrire l'IMAGE, pas le sujet (R-DESCRIBE)
Avant tout prompt i2v, LISTER ce qu'on VOIT dans l'image source. Chaque element du prompt doit correspondre a un element visible.
- **Why:** Claude a substitue sa connaissance du script a ce que l'image montrait -> prompt incoherent, $1.50 gaspilles evites de justesse.
- **How:** (1) Regarder l'image (Read tool), (2) Lister personnages/positions/objets/decor, (3) Verifier que CHAQUE element du prompt existe dans l'image, (4) Si invente -> retirer ou signaler.

### Prompts detailles shot-by-shot <4000 chars (R-DETAIL)
Scenes multi-contexte = prompt detaille 3500-4000 chars avec un paragraphe par shot. Scenes simples mono-beat = prompt minimaliste OK (~200 mots).
- **Why:** Prompts courts (<1800 chars) sur scenes multi-contexte -> style 3D-ish, identity drift, morphing, objets hallucines. Prompt detaille = clip valide du premier coup. Au-dela de 4000 chars, Seedance ignore la fin.
- **Checklist par prompt:**
  - Style obligatoire : "2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors"
  - Storyboard = "COMPOSITION GUIDE ONLY. Do NOT copy the sketch style."
  - Chaque ref avec elements d'identite + "MATCH THIS FACE EXACTLY"
  - Anti-artefacts en fin de prompt : no morphing, no crown, no scepter, RIGID/NON-DEFORMING, clean hard CUTS only

## Storyboards

### Contraintes dans CHAQUE panel (R-BOARD-EXEC)
Les erreurs de clip viennent du CONTENU du storyboard, pas de la technique. Seedance comprend la structure multi-panels.
- **Why:** Storyboard montrait Soundjata debout -> Seedance l'a anime debout. Le clip reflete le storyboard, pas le prompt.
- **How:** (1) Contraintes narratives dans CHAQUE panel (si "jamais debout" = dessiner a genoux dans TOUS les panels), (2) Identifier positions : "PANEL 1 is LEFTMOST, PANEL 2 is CENTER, PANEL 3 is RIGHTMOST", (3) Rappeler contraintes dans le prompt : "The boy NEVER stands -- KNEELING in ALL shots", (4) Verifier le storyboard genere AVANT de lancer Seedance.

### Regenerer le storyboard complet, jamais editer (R-BOARD-REGEN)
Quand un storyboard multi-panels a des erreurs, TOUJOURS regenerer le storyboard COMPLET avec prompt corrige. Ne JAMAIS tenter l'edition chirurgicale Gemini panel par panel.
- **Why:** Gemini ne cible pas un seul panel sans affecter les autres. Edition chirurgicale testee -> 0 correction sur 2 problemes. Regeneration complete avec prompt renforce -> correct du premier coup. Cout : ~$0.08 par regen (negligeable).
- **How:** (1) Identifier erreurs precises, (2) Renforcer le prompt avec instructions TRES explicites (ex: "BOTH knees touch the ground"), (3) Regenerer complet avec prompt corrige + memes refs, (4) Ne PAS utiliser l'image existante comme input.

## Start/End Frame (R-PC8) — Lecons Scene 5 (2026-04-20)

### Pas d'audio Seedance en mode start/end frame (R-STARTEND-NOAUDIO)
`generate_audio: True` ne produit PAS d'audio quand `end_image_url` est utilise. Le clip est muet.
- **Why:** Confirme empiriquement sur Scene 5B Sonjata Papercraft. ffprobe montre zero piste audio. A verifier dans la doc fal.ai si c'est un bug ou une limitation.
- **How:** Pour les scenes start/end frame, prevoir narration-only dans Remotion (pas de keep-and-duck). Si ambiance necessaire, ajouter SFX en post-prod.

### Start/end frame = transitions camera, PAS action (R-STARTEND-CAMERA)
Le start/end frame est ideal pour les changements de perspective dramatiques (side-view → top-down, ground-level → aerial). Mais il est MAUVAIS pour l'action dynamique — Seedance interpole trop doucement entre les deux poses = quasi-statique.
- **Why:** Scene 5B Sonjata — transition side-view → top-down = spectaculaire (bon usage). Scene 7C Sonjata — arc bande → relache = quasi-statique (mauvais usage). La v2 en i2v classique sans end frame = tir dynamique, fleche qui part, recul du corps.
- **How:** (1) Start/end frame = UNIQUEMENT pour changements de perspective camera (side→top, ground→aerial). (2) Pour l'action dynamique (tir, combat, course) = i2v classique avec UNE seule image + verbes explosifs dans le prompt. (3) Le prompt doit DECRIRE le mouvement, pas montrer le resultat final.

### Foule START/END doit matcher (R-STARTEND-CROWD)
Si le START frame a N figurants, le END frame doit en avoir N aussi, dans des positions coherentes. Sinon Seedance en perd en route.
- **Why:** Scene 5B — START avait ~10 villageois en cercle, END en top-down en avait ~7. Dans le clip final, les villageois "disparaissent" pendant la transition.
- **How:** (1) Compter les figurants dans START, (2) Placer le MEME nombre dans END avec positions adaptees au nouvel angle, (3) Si l'angle change (side → top), repositionner les figurants dans la composition END pour qu'ils soient tous visibles d'en haut.

### Morphing personnage principal en start/end = inevitable si la pose change (R-STARTEND-MORPH)
Si le personnage change de pose ET d'angle de vue entre START et END, Seedance fait un micro-morphing (rotation brusque du visage).
- **Why:** Scene 5B — Sunjata de profil dans START, vu du dessus dans END = flip rapide profil→face.
- **How:** (1) Garder le MEME angle de vue du visage dans START et END quand possible, (2) Changer seulement la pose des bras/corps, pas la direction du regard, (3) Si changement d'angle inevitable (comme side→top-down), le morphing est attenuable mais pas evitable — le justifier narrativement.

### Objets manipules par un personnage = garder en main tout du long (R-OBJECT-HOLD)
Quand un personnage tient un objet (sabre, lance, baton), le prompt doit specifier que l'objet RESTE dans sa main tout du long. Ne jamais demander de degainer/rengainer, poser/reprendre, ou transferer d'une main a l'autre.
- **Why:** Scene 6B Sonjata — V1 demandait tirer/rengainer le sabre. Resultat : sabre traverse le bras, change de dimension, objet bizarre apparait dans la main du soldat. V2 avec "sword stays in his RIGHT HAND throughout -- he NEVER sheathes or releases it" = parfait du premier coup. Lecon generalisable a tout modele de generation video.
- **How:** (1) L'objet est DEJA en main dans l'image source, (2) Le prompt dit explicitement "HOLDS [object] throughout, NEVER releases/sheathes/puts down", (3) Les mouvements autorises : lever/baisser, examiner, pointer — mais JAMAIS changer de main ou de position relative au corps, (4) Pour les personnages secondaires aussi : "Soldiers HOLD their spears upright at all times".

### Objets absents dans l'image = ne pas les mentionner dans le prompt (R-OBJECT-VISIBLE)
Si un objet n'est pas visible dans l'image source, ne PAS le mentionner dans le prompt. Seedance tentera de le generer a partir de rien = artefacts.
- **Why:** Scene 6B V1 — prompt disait "adjusting their spears" mais les soldats n'avaient pas de lances dans l'image. Seedance a genere un objet bizarre dans la main d'un soldat. Fix : correction chirurgicale Gemini pour AJOUTER les lances dans l'image AVANT le clip.
- **How:** (1) Lister ce qui est VISIBLE dans l'image (R-DESCRIBE), (2) Si un objet est necessaire mais absent : corriger l'image Gemini d'abord, (3) Seulement apres correction : le mentionner dans le prompt Seedance.

### Objets deformes = Seedance les "repare" (R-RIGID-REPAIR)
Seedance traite tout objet deforme comme un bug et tente de le remettre dans son etat "normal". Un objet volontairement plie/casse sera redresse.
- **Why:** Scene 5A — barre de fer pliee par Sunjata. Seedance l'a progressivement redressee en fin de clip. Aussi confirme par R80 (elongation objets rigides).
- **How:** Ne JAMAIS animer une frame contenant un objet volontairement deforme (barre pliee, epee brisee, arbre penche). Utiliser Ken Burns Remotion a la place ($0), ou couper avant que Seedance "repare" l'objet.

## Objects & Style

### Objets rigides = retrecissement inevitable (R-RIGID)
Seedance ne maintient PAS la taille constante des objets rigides quand ils changent de forme entre START et END frame.
- **Why:** Pattern recurrent confirme (R80 elongation + Scene 4 Sonjata retrecissement barre). Seedance ne traite pas les objets comme rigides.
- **How:** (1) Accepter ~30-40% de retrecissement comme inevitable, (2) Exagerer la taille de l'objet dans le END frame pour compenser, (3) Ajouter dans le prompt : "The object MAINTAINS ITS FULL LENGTH -- it bends but does NOT shrink", (4) Les dernieres 1-2s sont les plus affectees -> prevoir trim, (5) Mouvement rapide (orbite) masque partiellement le probleme.

### Dot-eyes : maintenir le style paper-craft (R-EYES + R-DOT-EYES-SAFE-VERBS)
Seedance transforme les dot-eyes paper-craft en yeux realistes (iris, pupilles, blancs visibles), surtout quand la camera se rapproche ou que le prompt mentionne des expressions faciales.
- **Why:** "eyes WIDEN" interprete litteralement -> agrandit les points en cercles blancs. Les close-ups progressifs aussi causent un drift dot-eyes -> realiste. Confirme V1 Pro scene 7B Sonjata (drift complet en 5s). V2 maintient mieux les dot-eyes que V1 Pro.
- **R-DOT-EYES-SAFE-VERBS (NEW 2026-04-26)** : INTERDIT dans tous les prompts dot-eyes : `eyes WIDE`, `wide-eyed`, `eyes widened`, `eyes dilated`, `eyes wide open`. Seedance agrandit litteralement les yeux et quitte le style dot. Detecte sur obsession-v1 Abou Bakari II.
- **How:**
  - TOUJOURS ajouter dans le prompt paper-craft : "MAINTAIN dot-eyes throughout, small black dot pupils, NO realistic eyes, NO visible iris"
  - Remplacer expressions faciales ET intensite emotionnelle par reactions CORPORELLES : RECOILS, STAGGERS, BRACES, SHOUTS — mouth OPEN, STIFFENS, CLUTCHES, "hands FLY to mouths"
  - JAMAIS "eyes WIDE / wide-eyed / eyes dilated" — meme pour terreur ou surprise
  - Exception documentee : gros plan action/terreur intense (ex: fleet-b capitaine) — yeux expressifs acceptables si contexte narratif fort. Juger au cas par cas (R-REVIEW-NARRATIF).
  - Preferer V2 a V1 Pro pour le style paper-craft (V2 respecte mieux les dot-eyes)
  - Eviter les close-ups extremes sur le visage (le zoom amplifie le drift)

### generate_audio vs "No music" dans le prompt (R-AUDIO-CONFLICT)
`generate_audio: true` dans les params API + "No music, no words, no dialogue" dans le prompt = conflit. Seedance respecte parfois l'un, parfois l'autre (scene 8A = pas d'audio, scene 8B = audio genere, memes params).
- **Why:** Teste 2026-04-21 sur scene 8. Le modele interprete le conflit de maniere non-deterministe.
- **How:** Si on VEUT de l'audio ambiance : retirer la clause anti-audio du prompt. Si on n'en veut PAS : mettre `generate_audio: false` dans les params.

### Keep-and-duck audio Seedance (R-AUDIO)
Pour storyboard-to-video multi-shot avec `generate_audio: True`, mixer l'audio Seedance a 30% sous la narration ElevenLabs a 100%. Ne PAS stripper.
- **Why:** Seedance produit un mix atmospherique frame-perfect synchronise (SFX, musique d'ambiance, whoosh). Stripper = perdre 3-5h de post-prod. Mixer a 30% = ambiance gratuite.
- **How:** `<Audio src={narration} volume={1.0} />` + `<Audio src={seedanceMp4Audio} volume={0.30} />`. Ajuster par segment (bataille intense = 40%, dialogue contemplatif = 15-20%). Si ca jure -> mute et fallback.
- **Scope:** Uniquement storyboard-to-video multi-shot. Clips mono-shot action pure = strip audio (mix rudimentaire).

## Production Process

### Verifier continuite avec clips adjacents (R-ADJACENT)
AVANT de generer un clip ou une image pour un trou dans la timeline, verifier les clips adjacents.
- **Why:** Start frame genere avec 4 villageoises, mais clip suivant n'en avait aucune -> rupture de continuite detectee par Aziz, regeneration necessaire.
- **How:** (1) Extraire derniere frame du clip precedent + premiere frame du suivant, (2) Verifier : memes personnages ? meme decor ? presence/absence figurants ? meme palette ?, (3) Presenter analyse de continuite dans le Visual Plan AVANT generation.

### Duree clip >= Duree narration (R-DURATION)
Cross-check BLOQUANT avant tout appel API Seedance : `clip_s >= ceil(narration_s)`.
- **Why:** Clip 12s demande pour narration 13.22s -> gap 1.17s, loop muette en Remotion, 30 min perdues.
- **How:** (1) Mesurer narration via `timing-{projet}.ts` ou ffprobe, (2) Arrondir a la seconde superieure (paliers 1s Seedance), (3) Section obligatoire dans Visual Plan : "Narration measured: X.XXs / Clip demande: Y.0s / Cross-check: OK", (4) Si narration > 15s : splitter en 2 clips, JAMAIS combler par boucle muette.

### Un seul job Seedance a la fois (R-SINGLE-JOB)
Ne JAMAIS lancer 2 agents successifs qui soumettent chacun un job Seedance pour la meme scene.
- **Why:** Double generation = cout double ($7.80 au lieu de $3.90). Agent 1 n'a pas retourne le request_id -> Agent 2 a soumis un nouveau job.
- **How:** (1) Un seul agent a la fois, (2) L'agent DOIT retourner le request_id, (3) Si pas de request_id -> verifier dashboard fal.ai AVANT de relancer, (4) Verifier `ls clips-production/scene*` avant de lancer.

### Self-review severe (R-REVIEW)
Claude doit etre SEVERE dans ses self-reviews. Preferer faux-positifs a laisser passer.
- **Why:** Claude a valide un clip avec visage non-canon + style different + double sabre. Aziz perd du temps a decouvrir des problemes que Claude aurait du detecter.
- **How:** (1) Pour chaque panel : comparer ref canon + frame extraite sur VISAGE, COIFFURE, STYLE (pas juste vetements), (2) Comparer style global avec un clip DEJA VALIDE du meme Short, (3) Tout artefact non-canon = ERREUR (pas "visuellement dynamique"), (4) Signaler 5 faux-positifs > laisser passer 1 vrai probleme, (5) Ne jamais utiliser "acceptable" ou "non bloquant" pour un drift d'identite visage.
