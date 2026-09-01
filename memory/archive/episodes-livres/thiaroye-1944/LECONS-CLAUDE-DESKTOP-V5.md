# Leçons Claude Desktop — Production Thiaroye V5 (2026-04-25)

> Migré depuis auto-memory le 2026-08-31, contenu original inchangé. Episode Thiaroye archivé —
> conservé pour les patterns réutilisables (workflow Claude Desktop, pivots créatifs, anti-patterns
> Gemini/Seedance en paper-craft).

## Contexte
Apres 4 sessions d'echec avec orchestration agents (~$10 brules sur clips hors controle), Aziz a produit les 8 clips Seedance MANUELLEMENT via Claude Desktop en moins de 24h. Resultat superieur a tout ce que les agents avaient produit. Cette memoire capture les patterns du succes pour reproduction future.

---

## 1. Workflow exact d'Aziz (la boucle qui marche)

Sequence repetee 8 fois (1 par scene) :

1. **Image candidate Gemini** (prompt initial du dashboard, parfois genere via Gemini chat)
2. **Aziz partage l'image + prompt Seedance prevu** a Claude pour avis
3. **Claude diagnostique l'image** (style, composition, coherence narrative)
4. **Iterations Gemini chirurgicales** ("Edit this image with one correction only — change nothing else") — JAMAIS de regeneration complete
5. **Validation visuelle d'Aziz** ("Excellent, voici la nouvelle image")
6. **Adaptation prompt Seedance** par Claude basee sur l'image FINALE (pas le prompt original)
7. **Generation clip Seedance 7-10s** (Aziz lance lui-meme via fal.ai)
8. **Review frames par Aziz + arbitrage garder/regenerer**

**Iterations Gemini par scene : 2 a 4 max.** Aziz refuse souvent une 5e ("le ratio qualite/effort ne justifie pas").

---

## 2. Patterns stylistiques recurrents (presents dans 80%+ des prompts)

- **Style anchor en tete** : `"Paper-craft illustration, 9:16 vertical. Style reference: maintain exact same paper-craft aesthetic as this conversation — thick black outlines, flat color fills, cold grey-blue palette, paper kraft texture."`
- **Anti-drift negatif systematique** : `"NO photorealism, NO gradients, NO depth-of-field blur, NO BD comic drift"`
- **Dot-eyes contrainte** : `"MAINTAIN strict dot-eyes throughout, pure black dot pupils, no realistic eyes, no iris"`
- **Anti-particles bannis apres scene 3** : `"NO dust motes. NO floating particles. NO white dots drifting"` (mais voir regle 90 Seedance : pointer le risque, pas banner systematiquement)
- **Anti-text** : `"NO text readable, NO banners, NO readable letters"`
- **Palette froide + UN seul accent chaud** : lanterne/brasier mourant, photo sepia, route ocre — "the single warm accent in the frame"
- **Edits chirurgicaux Gemini** : `"Edit this image with ONE correction only — change nothing else. PRESERVE EXACTLY: [liste]"`
- **Triple formulation pour contraintes ambigues** : `"NO mask. NO object covering the face. The face area is simply absent."`
- **Camera explicite + duree** : `"Slow continuous push-in throughout. Smooth, no cuts, no shake."` toujours en debut de bloc CAMERA
- **Audio block en fin de prompt** : silence dominant + 1-2 sons specifiques diegetiques

---

## 3. Pivots creatifs vs brief original (3 cas) — POURQUOI ils ont marche

### Scene 4B "L'Effacement" — Photo dechiree au lieu de tribunal contemporain

**Brief original** : tribunal contemporain (mains avocat sur bureau + drapeau republicain)
**Choix final** : vieille photo dechiree avec visages effaces, tenue par mains noires
**Pourquoi ca marche** : Claude Desktop a propose 3 concepts (mur de noms / photo dechiree / 3 generations). Choix B "le plus immediatement lisible sur mobile, le plus emotionnellement direct, et il cree une continuite avec tes scenes de mains precedentes — la main qui cherche, la main qui ferme, la main qui recolle."

**Lecon transposable** : quand le brief original casse un fil narratif (mains comme leitmotiv ici), proposer 2-3 alternatives au prompt qui preservent le fil.

### Scene 6 "Le Souvenir" — Barbeles Dakar au lieu de plage doree

**Brief original** : jeune Senegalais sur cote Dakar coucher de soleil, palette warm restoration
**Choix final** : barbeles foreground + Dakar (mosquee + palmiers) en background, palette grise froide
**Pourquoi ca marche** : Claude Desktop a corrige Aziz historiquement (massacre eu lieu A Dakar, pas en Europe). La plage doree contemplative racontait une autre histoire. Aziz : *"ca ferait un peu bizarre de faire toute cette video autour de franc-tireur pour ensuite a la derniere seconde, c'est focus sur soi-meme."*

**Lecon transposable** : Claude DOIT verifier les faits historiques meme quand le brief est en place. Un brief peut contenir une erreur narrative. Verifier avant generation.

### Scene 3A "Le Massacre" — 3 personnages aux poses A/B/C differenciees

**Brief original** : 1 tirailleur stoique face aux soldats francais
**Choix final** : 3 tirailleurs en panique avec poses differentes (recul / accroupi / cri)
**Pourquoi ca marche** : individualise la tragedie. 3 reactions distinctes = 3 humains, pas un chœur. Plus emotionnellement juste.

**Lecon transposable** : pour scenes traumatiques collectives, multiplier les reactions individuelles plutot que centraliser sur un seul personnage.

---

## 4. Anti-patterns que Claude Desktop a corriges (a NE PAS reproduire)

- **Decrire 1 personnage tres precisement → suppression des autres** par Gemini. Correction : lettrer A/B/C avec poses explicites
- **Presupposer la memoire de Gemini sur scenes precedentes** → exiger prompts AUTOSUFFISANTS (decor decrit de zero a chaque scene)
- **Couleurs pan-africaines (vert/jaune/rouge) sur portraits/pierre** — ressorti 2 fois dans prompts originaux malgre bannissement editorial. Claude les retire systematiquement
- **Dust motes / particules blanches** — reintroduits 3+ fois dans prompts originaux malgre bannissement
- **Faces europeens par defaut sur "vieille photo militaire francaise"** — Gemini drift training data ; correction explicite "West African face, dark brown skin, broader features"
- **Femmes generees sur mur de portraits de tirailleurs** (tous hommes historiquement) — non fixable Seedance, doit retourner a Gemini
- **Sur-animer les scenes statiques** ("le malaise du silence" → tentation d'ajouter mouvement). Aziz refuse : *"le monde continue de bouger legerement, mais lui ne bouge plus"*
- **Effets ajoutes (gouttes condensation, larmes de pierre)** — Aziz bannit comme "trop manipulateur"
- **Reference d'image incorrecte** (donner la scene exterieure aux soldats comme ref pour scene d'archives interieure) — exiger la bonne ref
- **Drapeau neerlandais au lieu de francais** sur tirailleur — detecte par Claude visuellement, a corriger ulterieurement

---

## 5. Outils utilises (workflow technique)

- **Image** : Gemini chat web (image-to-image avec image jointe en reference). Pas d'API directe. Pas de script Python.
- **Video** : Seedance 2.0 via fal.ai (Aziz lance lui-meme, partage frames apres)
- **Pas de Python script-based, pas d'interface web Seedance documentee** — workflow purement conversationnel image-to-image + clipboard

**Implication strategique** : le workflow conversationnel n'est pas la cle du succes. C'est le **dashboard pre-charge avec 80-90% du brief** qui est la cle (cf. `memory/doctrines/PRODUCTION-DASHBOARD-PATTERN.md`). Ce workflow est reproductible avec n'importe quelle interface (Claude Code, agents, Claude Desktop).

---

## 6. Insight central — Le dashboard est la base, pas l'orchestration

**Conclusion d'Aziz post-production** :
> "80 a 90% du travail selon moi doit etre fige dans le dashboard, donc le rendre le plus operationnel possible."

> "Je n'aurais pas pu le faire avec Claude Desktop si nous n'avions pas fait tout le travail auparavant dans VS Code (dashboard + scenes.json + prompts pre-rediges)."

**Implication operationnelle** : tout futur projet doit demarrer par construire le dashboard AVANT tout appel API. Quel que soit l'outil utilise apres (agents, Claude Desktop, generation manuelle), le dashboard est la base. Voir `memory/doctrines/PRODUCTION-DASHBOARD-PATTERN.md` pour le pattern complet.

---

## 7. Ce qui a ete confirme sur Video Extend (regles 91-92 Seedance)

- **OTS Reveal via Video Extend** = mouvement camera valide et puissant. Seedance interprete par travelling-cut implicite (les autres personnages sortent du cadre). Editorialement superieur car cree subjectivite narrative implicite (le spectateur adopte le regard des personnages restants).
- **Video Extend > regen first-frame/last-frame** pour etendre une scene de N a N+5 secondes. Coherence stylistique 100% preservee, pas de regen Gemini, cout 0.6x discount vs i2v classique.

Voir `memory/tools/seedance-rules.md` regles 91 et 92 pour details complets.

---

## 8. Application future (templates a derive de cette session)

- **Pour un Short narratif paper-craft** : reutiliser les 9 patterns stylistiques recurrents (section 2)
- **Pour les anti-patterns Gemini/Seedance** : ajouter la liste de la section 4 dans la review pre-prompt
- **Pour les pivots creatifs** : si le brief casse un fil narratif (motif, palette, perspective), proposer 2-3 alternatives au prompt avant generation
- **Pour les scenes traumatiques collectives** : multiplier les reactions individuelles (poses A/B/C differenciees)
- **Pour les CTA** : suivre le pattern Sonjata — narration histoire + clip narratif jusqu'a la fin → CTA Remotion pur fond uni + 3 lignes texte cascadees + narration CTA separee
