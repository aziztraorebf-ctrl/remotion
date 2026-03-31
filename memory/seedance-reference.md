# Seedance 2.0 — Reference Complete
> Fichier unique de reference. Tout ce qu'on sait, tout ce qu'on a teste, tout ce qui marche.
> Mise a jour : 2026-03-30

---

## Acces et Contraintes

- **Plateforme** : Dreamina web uniquement (API suspendue overseas — copyright dispute mars 2026)
- **Credits** : achats de credits + credits gratuits journaliers
- **Resolution** : 720p (gratuit), 1080p (payant)
- **Duree max** : 15s par generation
- **FPS** : 24fps
- **Format sortie** : H.264 MP4 + audio AAC stereo

### Couts credits
| Mode | Credits |
|------|---------|
| Text-to-video (sans ref) | 80 |
| Text-to-video + 1 ref image | 80 |
| Text-to-video + 2+ ref images | 120 |
| Image-to-video | 120 |

---

## Formats de Prompts (du moins au plus precis)

### Format 1 — Narratif lineaire (~40 mots)
```
Camera follows [sujet] [action 1]. The shot cuts to [angle] as [action 2].
[Action 3]. Sounds of [ambiance].
```
- Usage : scenes simples, un seul personnage, action lineaire
- Controle camera : faible (Seedance interprete librement)

### Format 2 — Storyboard numerote (~75 mots)
```
[duree] [genre]. Shot 1: [angle], [sujet] [action], [detail].
Shot 2: [close-up], then [angle] of [action], [effet].
Shot 3: [angle large], [climax], text '[message]' revealed.
```
- Usage : multi-shot structure, changements de lieu/angle
- Controle camera : moyen (chaque shot = un plan)

### Format 3 — Timecodes SECONDS X TO Y (~150-200 mots) -- VALIDE LE MEILLEUR
```
@Image1 is the primary character identity. [style].

SECONDS 0 TO 3: [description plan 1, camera, action].
SECONDS 3 TO 6: [description plan 2, transition, detail].
SECONDS 6 TO 8: [description plan 3, climax].
SECONDS 8 TO 10: [description plan 4, resolution].

COLOR GRADE: [palette complete].
```
- Usage : controle maximal, scenes complexes, transitions de perspective
- Controle camera : eleve (chaque segment = instructions precises)
- **RECOMMANDE pour tous nos clips GeoAfrique**

---

## Sections de Prompt Speciales

### COLOR GRADE (en fin de prompt)
Ancre la palette sans uploader de ref image supplementaire. Reste a 80 credits.
```
COLOR GRADE: [couleur fond], [couleur accents], [couleur secondaire],
[couleur highlights], [type eclairage], [atmosphere].
```
**Exemple GeoAfrique :**
```
COLOR GRADE: Deep black ocean background, warm golden accents on robes and skin,
terracotta earth tones on wood, cream highlights on wave crests.
Rich contrast, cinematic warmth.
```

### Style anchor (en debut de prompt)
```
@Image1 is the primary character identity. 2D vivid flat illustration style.
```
- Toujours specifier le style pour eviter le drift semi-realiste
- "2D vivid flat illustration" = notre ancre standard GeoAfrique

### Instructions negatives
- "Single continuous take, no cuts" = empeche les coupes
- "no text, no writing, no watermark" = zero texte parasite
- "gradually" = empeche l'apparition soudaine d'elements (VALIDE Test 3 vs Test 1)

---

## Techniques Camera Validees

| Technique | Mot-cle prompt | Teste ? | Resultat |
|-----------|---------------|---------|----------|
| Dolly in | "Camera slowly dollies in" | Oui (Test 1) | Excellent |
| Pull back reveal | "Camera pulls back, gradually showing" | Oui (Test 3) | Excellent |
| Close-up | "Close-up on his face" | Oui (Test 1, 2) | Excellent |
| Orbite 180 | "Camera begins a slow orbit clockwise around" | Oui (Test Orbite) | **9.5/10** — fluide, coherent multi-angle |
| Plan-sequence | "Single continuous take, no cuts" | Non (documente Ex. 3) | A tester |
| POV | "First-person POV from the king's eyes" | Oui (Test 3) | **PARFAIT** |
| POV → 3e personne | "POV slowly pulls backward and upward, revealing the back" | Oui (Test 3) | **PARFAIT** — game changer |
| Aerien | "Full wide aerial shot looking down" | Oui (Test 3) | Excellent |
| Tracking | "Camera follows" | Non (documente Ex. 1) | A tester |
| Slow-motion | "then cuts to a slow-motion overhead" | Non (documente Ex. 2) | A tester |

---

## Capacites Validees par Nos Tests

### Test 1 — SECONDS X TO Y + camera (Score 8.5/10)
- **Date** : 2026-03-30
- **Sujet** : Abou Bakari proue navire, 10s
- **Ref** : character sheet 5 vues (@Image1)
- **Valide** : format SECONDS, dolly in, rotation tete, close-up, pointage doigt, COLOR GRADE
- **Coherence personnage** : parfaite tout le long (kufi, robe, barbe, teint)
- **Style 2D flat** : maintenu sans drift
- **Defaut** : bateaux flotte apparaissent soudainement ("reveal" → utiliser "gradually")
- **Video** : `~/Downloads/abu bakari seedance test 1.mp4`

### Test 2 — Micro-expressions + gestes (Score 9.5/10)
- **Date** : 2026-03-30
- **Sujet** : Abou Bakari trone interieur palais, 10s
- **Ref** : character sheet 5 vues (@Image1)
- **Valide** : grattage barbe, clignement lent, plissement yeux, machoire serree, geste autorite main, rotation tete profil, se lever du trone
- **Physique vetements** : robe tombe differemment assis vs debout
- **Decor genere SANS ref** : trone sculpte, rideaux pourpres, bougies vacillantes, chandeliers or
- **COLOR GRADE chaud** : parfaitement respecte
- **Zero defaut significatif**
- **Video** : `~/Downloads/abu bakari seedance test 2.mp4`

### Test 3 — POV → 3e personne + flotte (Score 10/10)
- **Date** : 2026-03-30
- **Sujet** : POV Abou Bakari proue → reveal flotte, 10s
- **Ref** : character sheet 5 vues (@Image1)
- **Valide** : transition POV→3e personne en continu (zero cut), pull-back aerien, flotte 30+ navires coherents, "gradually" fonctionne, SFX/musique generes utilisables
- **Kling comparaison** : Kling INCAPABLE de faire la transition POV, galere pour 3-4 bateaux coherents, drift apres 6-8s
- **Frame finale** : money shot cinema (30+ navires, soleil couchant, formation fleche)
- **Audio genere** : SFX (mains sur bois, vagues) + musique cinematique = utilisable en production avec overlay voix ElevenLabs
- **Video** : `~/Downloads/abu bakari seedance test 3.mp4`

### Test original (mars 28-29) — Trone + lip sync
- **Sujet** : Abou Bakari trone royal, 15s
- **Valide** : visuel excellent (zero morphing), audio uploade DEFORME (Seedance re-synthetise)
- **Workflow prouve** : Seedance → ffmpeg strip audio → Remotion OffthreadVideo + ElevenLabs
- **Video** : `public/assets/library/geoafrique/test seedance 2.0/abou bakari/abou-bakari-trone-seedance-v2-silent.mp4`

---

## Seedance vs Kling — Quand utiliser quoi

| Situation | Seedance | Kling | Pourquoi |
|-----------|----------|-------|----------|
| Close-up expressions/gestes | **OUI** | Non | Seedance anime micro-expressions, Kling morphe les visages |
| Transition POV → 3e personne | **OUI** | Non | Kling ne gere pas les transitions de perspective |
| Flotte/foule massive (10+ elements) | **OUI** | Non | Seedance maintient coherence 30+ elements, Kling drift apres 3-4 |
| Style 2D flat maintenu >8s | **OUI** | Difficile | Kling drift semi-realiste apres 6-8s, Seedance stable 10s+ |
| Style flat graphic (blocs purs) | **OUI** | Non teste | Seedance maintient le flat graphic navy/cramoisi sans deriver |
| Armee/bataille coherente | **OUI** (30+ guerriers) | 8 versions, 2 semaines | Seedance en 1 essai, Kling morphe/collisionne/drift |
| Detail distinctif (eye patch) | **OUI** tout le clip | Echoue souvent | Kling omet systematiquement sauf martele dans prompt |
| Narrativisation cinematique | **OUI** (effet poster non demande) | Non | Seedance invente des effets epiques non demandes |
| 2 personnages distincts (multi-ref) | **OUI** (zero fusion 10s) | Non teste | Seedance maintient 2 identites separees avec 2 refs |
| Close-up alterne (cut entre visages) | **OUI** | Non | Seedance gere les cuts entre personnages |
| Duel/combat 2 personnages avec armes | **OUI** (10/10, 1 essai) | Semaines + dizaines essais | Charge, clash, close-ups, zero fusion meme en mouvement rapide |
| COLOR GRADE dual (warm/cold split) | **OUI** | Non | 2 temperatures de couleur dans le meme plan |
| Lip sync natif (timing) | **OUI** | Non | Seedance sync les levres au timing, Kling n'a pas cette capacite |
| Plan 4K / haute resolution | Non | **OUI** | Seedance max 720p gratuit, Kling fait du 1080p/4K |
| Start+End frame controle | Non | **OUI** (O3) | O3 start+end = transitions controlees |
| Duree >15s | Non | **OUI** (V3 jusqu'a 15s) | Seedance max 15s |
| API automatisable | Non | **OUI** (fal.ai) | Seedance = web uniquement, Kling = API scriptable |

### Strategie hybride recommandee
- **Seedance** : close-ups, dialogues, scenes emotionnelles, POV, foules, scenes <15s
- **Kling** : plans larges 4K, scenes avec start+end frame precis, clips generes par script
- **Les deux** : toujours strip audio Seedance, overlay ElevenLabs dans Remotion

---

## Pipeline Integration Remotion

### Workflow standard (clip Seedance → Remotion)
```
1. Generer clip Seedance (Dreamina web, format SECONDS X TO Y)
2. Telecharger MP4
3. Strip audio : ffmpeg -i input.mp4 -an -c:v copy output-silent.mp4
4. Placer dans public/assets/library/geoafrique/[projet]/
5. Remotion : <OffthreadVideo src={clip} muted /> dans <Sequence from={BEATS.xxx.start}>
6. Audio narration : <Audio src={elevenlabsAudio} /> avec offset ~9 frames (0.3s) pour sync lip
7. Audio SFX/musique Seedance (optionnel) : garder piste audio Seedance a -12dB sous la voix
```

### Workflow hybride SFX (NOUVEAU — valide Test 3)
```
1. Generer clip Seedance (avec audio SFX/musique genere)
2. Extraire piste audio Seedance : ffmpeg -i input.mp4 -vn -c:a copy seedance-audio.aac
3. Strip video : ffmpeg -i input.mp4 -an -c:v copy silent-video.mp4
4. Remotion :
   - <OffthreadVideo src={silentVideo} muted />
   - <Audio src={seedanceAudio} volume={0.3} />  (SFX/musique a -12dB)
   - <Audio src={elevenlabsNarration} volume={1.0} />  (voix principale)
```

---

## Regles de Prompt (NON-NEGOTIABLE)

1. **Toujours specifier le style** : "2D vivid flat illustration style" en debut de prompt
2. **Toujours COLOR GRADE** : section en fin de prompt pour ancrer la palette
3. **"gradually"** : utiliser dans tout segment reveal (flotte, armee, decor)
4. **"Single continuous take, no cuts"** : pour plan-sequence (pas de coupes)
5. **Zero texte dans le prompt** : pas de "text '...'" — texte = Remotion post-prod
6. **Audio narration = toujours remplacer** : Seedance re-synthetise les mots uploades
7. **Eye patch Amanirenas** : toujours mentionner "black eye patch over left eye"
8. **Ref images** : character sheet multi-vues = meilleure ref. 1 ref suffit pour plan-sequence/POV.
9. **Duree segments** : 2-3s par segment pour 10s, 3-4s pour 15s. Ne pas surcharger.
10. **Verbes d'action** : "PRESSES", "RISES", "STRIKES" — jamais "subtle", "gentle", "slow" sauf intention explicite
11. **Seedance = litteral** : "uphill" = pente verticale, "raises sword" sans "lowers" = epee levee tout le clip. Specifier chaque changement d'etat explicitement.
12. **1 ref max quand les personnages se ressemblent** : si le soldat-type et le leader ont le meme style, ne pas uploader les deux — Seedance fusionne. Decrire les soldats par le texte ("silhouettes WITHOUT cape")
13. **Differencier leader vs soldats dans le prompt** : "leader with [detail distinctif]" + "soldiers WITHOUT [detail]" — sinon clones garantis
14. **Objets parent-enfant (sabre+fourreau, epee+ceinture)** : Seedance ne comprend PAS que degainer = fourreau vide. Si un personnage degaine, ecrire explicitement "empty scabbard" ou mieux : ne pas mentionner le fourreau du tout ("curved sword in hand, no scabbard visible"). Les objets simples (lance, bouclier) n'ont pas ce probleme.

---

### Test Amanirenas — Bataille flat graphic (Score 9/10)
- **Date** : 2026-03-30
- **Sujet** : Amanirenas scene de bataille, 10s
- **Refs** : portrait REF v4 eye patch (@Image1) + warrior-type REF (@Image2)
- **Valide** : style flat graphic pur maintenu (blocs couleurs, navy/cramoisi/or, zero degrade), eye patch visible du debut a la fin meme en mouvement, armee 30+ guerriers coherents (boucliers terracotta, lances, silhouettes navy), animation course naturelle, charge finale epique
- **Decouverte** : Seedance "narrativise" — a genere un effet poster (image fantome geante de la reine dans le ciel) sans qu'on le demande. Confirme que Seedance invente la mise en scene cinematique.
- **Defauts** : guerriers apparaissent un peu soudainement (transition face→dos trop rapide), fantome non demande (cool mais potentiellement genant en montage)
- **Correction** : allonger segment ou ecrire "tiny warrior silhouettes already visible in far distance from beginning"
- **Audio genere** : cri de guerre, bruits de marche, cris d'armee = tres bon
- **Impact** : prouve que Seedance est universel pour GeoAfrique — pas juste Abou Bakari. Toute la galerie (Amanirenas, Hannibal, futurs) peut utiliser Seedance.
- **Comparaison Kling** : cette scene a coute 8 versions sur 2 semaines avec Kling (morphing, sol riviere, collision, drift style). Seedance l'a fait en 1 essai.
- **Video** : `~/Downloads/Amanirenas — Scene de bataille.mp4`
- **Frames** : `/tmp/seedance-amanirenas-frames/frame-01.jpg` a `frame-30.jpg`

---

### Test Hannibal — Traversee Alpes flat geometric (Score 7/10)
- **Date** : 2026-03-30
- **Sujet** : Hannibal traversee Alpes, 10s
- **Refs** : portrait REF v2 (@Image1) + soldier-type REF (@Image2) — ERREUR : 2 refs trop similaires
- **Valide** : palette 3 couleurs (menthe/navy/violet) maintenue, neige animee, boucliers bien tenus, formation file indienne, style flat geometric preserve
- **Problemes (tous corrigeables par prompt)** :
  1. Soldats = clones Hannibal (cause : 2e ref trop similaire → ne pas uploader ref soldat)
  2. "Uphill" pris au pied de la lettre (pente 45 degres) → dire "through a valley" pas "uphill"
  3. Epee maintenue levee tout le clip → specifier quand baisser
  4. Vue aerienne : colonne bifurque, Hannibal pas clairement au front → etre plus explicite
- **Lecons prompt** : Seedance prend TOUT au pied de la lettre. Plus le style est abstrait/minimal, plus le prompt doit etre precis. "Uphill" = litteralement vertical. "Raises sword" sans "lowers it" = epee levee indefiniment.
- **Video v1** : `~/Downloads/hannibal.mp4`
- **V2 (Score 8/10)** : corrections appliquees (1 seule ref, valley pas uphill, soldiers WITHOUT cape). Nette amelioration. Soldats differencies, sol plat, formation en file, tracking lateral cinematique. Defauts restants : epee pointee "forward" = horizontale au lieu de vers le bas (dire "down to his side"), vue aerienne finale = soldats regardent la camera (dire "tiny dark dots" pour forcer l'abstraction a haute altitude).
- **Video v2** : `~/Downloads/hannibal 2.mp4`
- **Lecon supplementaire** : pour les directions d'objets, toujours specifier l'axe ("down", "to his side", "toward the ground") — "forward" est ambigu. Pour les vues aeriennes de style abstrait, forcer "from very high altitude, soldiers as tiny dots" pour eviter les visages detailles.

### Test Rencontre Souverains — 2 personnages (Score 9.5/10)
- **Date** : 2026-03-31
- **Sujet** : Abou Bakari + Amanirenas rencontre dans un hall, 10s
- **Refs** : character sheet Abou Bakari (@Image1) + portrait Amanirenas REF v4 (@Image2)
- **Valide** : **2 PERSONNAGES DISTINCTS dans 1 clip** — zero fusion, zero morphing, identites maintenues 10s. Close-up alterne (cut propre entre 2 visages). Interaction physique (main tendue + lance tenue). Micro-expressions sur les 2 (clignement roi ET reine). COLOR GRADE dual (ambre gauche / gris-bleu droite). Decor genere sans ref (hall colonnes + desert).
- **Eye patch** : visible en close-up, parfait (frames 23-27)
- **Frame finale** : poster-quality — 2 souverains cote a cote, face camera, utilisable comme thumbnail/banner
- **Impact** : prouve que Seedance gere le multi-personnage. Ouvre la porte aux scenes de dialogue, confrontation, interaction pour TOUTE la serie GeoAfrique.
- **Video** : `~/Downloads/rencontre souverains .mp4`
- **Frames** : `/tmp/seedance-rencontre-frames/frame-01.jpg` a `frame-30.jpg`

---

### Test Orbite 180 — Trone palace (Score 9.5/10)
- **Date** : 2026-03-31
- **Sujet** : Abou Bakari assis sur trone, orbite clockwise face → profil → dos, 10s
- **Ref** : character sheet 5 vues (@Image1)
- **Valide** : orbite 180 continue sans cut, coherence personnage sous TOUS les angles (face, profil, 3/4 dos, dos), reveal progressif du decor (bougies → tapisseries → statues guerriers → torches → fenetre sunset), rayons de soleil cinematiques, composition finale silhouette contre sunset = money shot
- **Micro-details animes** : doigts tapotant l'accoudoir (mentionne dans prompt, execute), bougies vacillantes, poussieres dans les rayons
- **Decor genere SANS ref** : trone sculpte motifs geometriques, colonnes pierre, rideaux pourpres, statues guerriers, fenetre ogive, torches — Seedance invente un palais coherent
- **Defaut** : couleur robe/trone passe de or a blanc vers la fin du clip — mineur, justifiable narrativement
- **Impact** : orbite camera 180 = technique de production VALIDEE. Nouveau type de plan disponible pour GeoAfrique (intro palais, reveal decor, presentation personnage)
- **Video** : `~/Downloads/orbit 180.mp4`
- **Frames** : `/tmp/seedance-orbit-frames/frame-01.jpg` a `frame-11.jpg`

---

## Techniques Camera Validees — Mise a jour

L'orbite 180 rejoint la liste des techniques prouvees. Voir tableau § "Techniques Camera Validees" ci-dessus.

---

### Test Bataille — Abou Bakari vs Amanirenas duel (Score 10/10)
- **Date** : 2026-03-31
- **Sujet** : Duel roi vs reine dans hall egyptien, 10s
- **Refs** : character sheet Abou Bakari (@Image1) + portrait Amanirenas REF v4 eye patch (@Image2)
- **Valide** : 2 personnages en COMBAT ACTIF sans fusion, charge + clash d'armes (lance croise sabre), close-ups alternant entre 2 visages (eye patch maintenu), expressions fierce sur les deux, physique robes + poussiere au sol, composition cinematique avec standoff final
- **Choreographie** : Seedance a interprete la grammaire cinematique d'un duel — tension statique → charge → clash → close-ups emotionnels → recul en standoff. Narrativement coherent sans instructions explicites sur le rythme.
- **Eye patch** : visible et stable meme en close-up de combat (frames 6-7) — test le plus exigeant reussi
- **Armes** : lance ET sabre tenus correctement par les bonnes mains pendant toute la scene, y compris pendant le clash physique. Zero morphing sur les armes.
- **Decor genere SANS ref** : hall egyptien avec hieroglyphes sur colonnes, soleil couchant, poussiere de combat
- **Defauts** : aucun significatif
- **Impact** : prouve que Seedance gere les scenes d'ACTION multi-personnage. C'est le test le plus exigeant reussi (mouvement rapide, 2 personnages proches, armes croisees, close-ups alternants). Toute scene de confrontation/bataille GeoAfrique est maintenant possible.
- **Comparaison Kling** : cette scene aurait pris des semaines et dizaines de versions avec Kling (morphing garanti au clash, fusion des personnages en mouvement rapide, eye patch perdu). Seedance : 1 essai.
- **Video** : `~/Downloads/bataille.mp4`
- **Frames** : `/tmp/seedance-bataille-frames/frame-01.jpg` a `frame-12.jpg`

---

## Backlog Tests (a faire quand credits disponibles)

| Priorite | Test | Objectif |
|----------|------|----------|
| 1 | Plan-sequence continu 15s | Tester la duree max avec "Single continuous take" |
| 3 | Video-to-video | Uploader un clip existant + demander modifications |
| 4 | Lip sync dialogue 15s | Tester narration longue avec lip sync natif (audio ElevenLabs uploade) |
