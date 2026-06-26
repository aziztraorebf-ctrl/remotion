# Camera Movements — Guide complet pour prompts Seedance/Kling/Veo

> **DOMAINE : Génération vidéo AI (Seedance, Kling, Veo) — prompts textuels payants.**
> Pour les mouvements caméra Remotion (code frame-driven, zéro coût par essai), voir `memory/tools/atlas-camera-movements.md`.


> Source : "ALL Camera Movement Prompts in AI Filmmaking (30 Cinematic Moves)" — Yannis Ashay, 2026-04-22 (https://youtu.be/4-ctOYBfmDs)
> Adapte par Aziz/Claude 2026-04-22 avec les validations Seedance V2 de Sonjata Papercraft.
> **A consulter AVANT d'ecrire un prompt video.**

---

## Framework de decision (3 etapes)

**1. Quelle EMOTION creer ?** → choisit la categorie
- Intimite / tension → **Push/Pull**
- Introduction personnage / revelation → **Orbital**
- Power / defeat → **Vertical**
- Voyage / accompagnement → **Lateral**
- Attention sans bouger → **Lens/Focus**
- Epique / war moment → **Creative**

**2. Quel STORY BEAT ?**
- Opening scene / big reveal → Drone flyover, Crane up
- Character introduction → Orbit 180, Cinematic arc
- Dialogue / confrontation → Over-the-shoulder
- Action / combat → Handheld, Whip pan, Snap zoom
- Contemplation / emotion → Slow dolly in, Cinematic arc
- Isolation / final → Slow dolly out, Pedestal down

**3. Sujet STATIQUE ou MOBILE ?**
- Statique → Orbital / Push-pull / Vertical
- Mobile → Lateral tracking / Following shot

---

## Filtre Seedance V2 (base sur tests Sonjata Papercraft)

| Mouvement | Seedance V2 | Notes |
|---|---|---|
| Orbit 90 / 180 | **EXCELLENT** | Effet pseudo-3D isometrique confirme 4x. Scenes 2, 4, 8 Sonjata. |
| Cinematic arc | **EXCELLENT** | Plus doux qu'orbit, parfait pour contemplation |
| Slow dolly in | **BIEN** | Ajouter "SMOOTH, stable motion" |
| Slow dolly out | **BIEN** | Parfait pour isolation emotionnelle |
| Tilt up | **BIEN** | Confirme scene 5B baobab (side→top-down) |
| Lateral track | **BIEN** | Scene 6A Sonjata |
| Over-the-shoulder (OTS) | **BIEN** | Pas encore teste paper-craft mais documente |
| **OTS Reveal** (via Video Extend) | **EXCELLENT** | Valide Thiaroye S2 extend 2026-04-25. Voir section dediee bas du fichier. |
| Handheld dynamic | **BIEN** | Scene 7C arc Sonjata, ajouter "natural shake" |
| Slow optical zoom | **OK** | Moins intime qu'un dolly — prefer dolly si possible |
| Reveal from blur | **A TESTER** | Pas encore teste sur paper-craft |
| Rack focus | **A TESTER** | Yannis dit "AI handles it pretty well" mais pas valide Seedance V2 paper-craft |
| Drone flyover | **A TESTER** | Risque de 3D drift sur paper-craft |
| Fast 360 orbit | **RISQUE** | Peut deformer le personnage si trop rapide |
| Vertigo / dolly zoom (Hitchcock) | **RISQUE** | Complexe pour Seedance, rarement propre |
| Whip pan | **RISQUE** | Bien pour transitions entre clips (dans Remotion), pas en milieu de clip |
| Snap zoom / crash zoom | **RISQUE** | Tendance a perdre la qualite de l'image |
| Bullet time (Matrix) | **DIFFICILE** | Yannis dit "Sense 2 handles it well" — Seedance moins |
| Dutch orbit / barrel | **OVERUSED** | A utiliser RAREMENT, pour tension psychologique reelle |
| Extreme macro zoom | **A TESTER** | Prometteur pour details (nom, symbole) |
| POV (first person) | **A TESTER** | Pas encore teste paper-craft |
| Pedestal up/down | **A TESTER** | Plus subtil que crane — a valider |

---

## 30 MOUVEMENTS — Prompts ready-to-use

### Categorie 1 : Push/Pull
*Principe : moving in = intimite/intensite, moving out = distance/contexte.*

**1. Slow Dolly In**
- Emotion : realisation, moment important "pay attention"
- Prompt : `Camera slowly dollies in toward the subject's face. Smooth, stable forward motion.`
- Usage Sonjata (hypothetique) : Scene 1 matrone tenant bebe (beauty shot)

**2. Fast Dolly In (Rush)**
- Emotion : urgence, choc, action beat, jump scare
- Prompt : `Camera rushes quickly toward the subject. Fast forward push, dramatic intensity.`

**3. Slow Dolly Out**
- Emotion : isolation, distance emotionnelle, "character alone in big space"
- Prompt : `Camera slowly pulls back from the subject, revealing the surrounding context. Smooth backward motion.`
- Usage Thiaroye recommande : Scene 4 "L'Effacement" sur corps d'un tirailleur

**4. Dolly Zoom / Vertigo Effect (Hitchcock)**
- Emotion : realisation dramatique, tension physique
- Prompt : `Dolly zoom effect: camera moves backward while lens zooms in simultaneously. Background warps around the subject.`
- **Attention** : Seedance risque, overused

**5. Extreme Macro Zoom**
- Emotion : hyperfocus, intimite, obsession
- Prompt : `Extreme macro zoom into the subject's face, revealing skin texture and pores at microscopic level.`
- Usage Thiaroye recommande : Scene 6 sur noms des tirailleurs

---

### Categorie 2 : Orbital
*Principe : circle autour du sujet pour reveler tous les angles.*

**6. Orbit 180**
- Emotion : character introduction, costume/location showcase
- Prompt : `Camera orbits 180 degrees around the subject. Smooth half-circle rotation.`
- **VALIDE Sonjata** : Scene 4 IL SE LEVE

**7. Fast 360 Orbit**
- Emotion : power-up, transformation, hero reveal
- Prompt : `Camera spins a full 360 circle around the subject. Fast orbital rotation, cinematic showcase.`

**8. Slower Cinematic Arc**
- Emotion : beauty shot, thoughtful moment, contemplation
- Prompt : `Gentle wide curve around the subject, slowly revealing their profile. Cinematic arc, smooth motion.`
- Usage Sonjata (hypothetique) : Scene 1 matrone avec bebe
- Usage Thiaroye recommande : Scene 1 tirailleur central avec lettre

**9. Dutch Orbit (angle incline)**
- Emotion : something feels wrong, psychological tension, violence
- Prompt : `Camera orbits around the subject while tilted on its axis. Dutch angle rotation, unsettling mood.`
- **Attention** : ne pas overuse

**10. Barrel Shot**
- Emotion : similaire Dutch, roll camera
- Prompt : `Camera tilted on X-axis, slight barrel roll motion. Disorienting feeling.`

---

### Categorie 3 : Vertical
*Principe : up = power/scale, down = intimacy/defeat.*

**11. Crane Up (High Angle Reveal)**
- Emotion : establishing shot, opening scene, "something big begins"
- Prompt : `Camera rises vertically, revealing the landscape. High angle reveal, establishing shot.`
- Usage Thiaroye recommande : Scene 4 "L'Effacement" final

**12. Crane Down (Descent)**
- Emotion : epic entrance, character landing into their world
- Prompt : `Camera descends vertically toward the subject. Epic top-down arrival.`

**13. Pedestal Up**
- Emotion : character standing up, revelation, power shift
- Prompt : `Camera body rises from waist level to eye level. Pedestal up, smooth vertical lift.`

**14. Pedestal Down**
- Emotion : character sitting down, feeling defeat
- Prompt : `Camera lowers from eye level to ground. Pedestal down, settling motion.`
- Usage Thiaroye recommande : Scene 5 "Le Jugement" quand sentence tombe

**15. Tilt Up**
- Emotion : reveals character, makes subject feel massive/powerful
- Prompt : `Camera tilts upward from the subject's feet to their face. Slow reveal, building presence.`
- **VALIDE Sonjata** : Scene 5B side→top-down baobab (variante)

---

### Categorie 4 : Lateral
*Principe : move WITH the character, composante du personnage.*

**16. Lateral Track (Left/Right)**
- Emotion : elegant, smooth, establishing space
- Prompt : `Camera slides laterally to the right, revealing the environment. Smooth horizontal track.`

**17. Sidetracking (Parallel)**
- Emotion : "walking WITH the character", intime
- Prompt : `Camera follows the subject sideway at the same walking speed, showing their profile. Parallel tracking shot.`
- **Sous-utilise en AI filmmaking selon Yannis** — excellent point d'entree

**18. Leading Shot (Backward Tracking)**
- Emotion : emotional moments, "read their face as they approach"
- Prompt : `Subject walks toward the camera; camera moves backward at the subject's speed. Facing the subject as they advance.`
- Usage Sonjata (hypothetique) : Scene 6A tirailleurs/exil vers camera

**19. Following Shot (Tracking from Behind)**
- Emotion : immersion, "you see what they see, go where they go"
- Prompt : `Subject walks away from camera; camera follows from behind. Immersive tracking, over-the-shoulder view.`
- Usage Sonjata (hypothetique) : Scene 6A exil dos tourne

---

### Categorie 5 : Lens & Focus
*Principe : what's in focus is what matters. Reveal sans bouger la camera.*

**20. Smooth Optical Zoom In**
- Emotion : slow building tension, moins intime qu'un dolly
- Prompt : `Lens slowly zooms toward the subject while camera body stays still. Optical zoom in, building tension.`

**21. Smooth Optical Zoom Out**
- Emotion : disconnecting viewer, revealing surroundings
- Prompt : `Lens pulls back while camera body stays still. Optical zoom out, revealing context.`

**22. Snap Zoom / Crash Zoom (Tarantino)**
- Emotion : dramatic tension, comedic beat
- Prompt : `Rapid snap zoom into the subject. Crash zoom, dramatic impact.`
- Usage Thiaroye recommande : Scene 3 premier coup de feu

**23. Reveal from Blur**
- Emotion : "character opening eyes, coming back to consciousness"
- Prompt : `Shot starts completely out of focus, slowly sharpens into clarity. Reveal from blur, awakening mood.`
- Usage Thiaroye recommande : Scene 6 archives/documents

**24. Rack Focus**
- Emotion : "show what the character looks at without cutting"
- Prompt : `Focus shifts from foreground subject to background element (or vice versa). Rack focus pull, cinematic shift.`
- Usage Thiaroye recommande : Scene 2 lettre → main ouverte → visage

---

### Categorie 6 : Creative & Dynamic
*Principe : epic shots, WAR moments, high energy. Utiliser RAREMENT.*

**25. Drone Flyover**
- Emotion : establishing big environment, cinematic war opening
- Prompt : `High altitude drone flight over the landscape. Epic aerial establishing shot.`
- Usage Sonjata (hypothetique) : Scene 7A Soumaoro + armee opening

**26. Over-the-Shoulder (OTS)**
- Emotion : conversation, confrontation, connection between 2 characters
- Prompt : `Camera positioned just behind and slightly to the side of one character, looking over their shoulder at the other. OTS dialogue shot.`
- Usage Sonjata (hypothetique) : Scene 2 Sassouma vs matrone
- Usage Thiaroye recommande : Scene 2 officier absent + tirailleurs, Scene 5 juges + accuses

**27. Handheld Dynamic**
- Emotion : natural, raw, action or emotional rawness
- Prompt : `Camera has natural handheld shake and movement, as if held by a person. Handheld dynamic, organic motion.`
- **VALIDE Sonjata** : Scene 7C tir d'arc
- Usage Thiaroye recommande : Scene 3 tirailleurs qui tombent

**28. Whip Pan**
- Emotion : quick energy transition between 2 shots/locations
- Prompt : `Camera whips rapidly to the side with extreme motion blur. Whip pan transition.`
- **Attention** : mieux utilise entre clips dans Remotion que pendant un clip Seedance

**29. POV (First Person)**
- Emotion : maximum connection, "we are the character"
- Prompt : `First person perspective, camera is the character's eyes. POV shot, immersive view.`

**30. Bullet Time (Matrix Effect)**
- Emotion : action scenes, physical moment, frozen drama
- Prompt : `Time slows dramatically while camera orbits around the subject. Bullet time effect, Matrix-style frozen motion.`
- Usage Sonjata (hypothetique) : Scene 7C tir d'arc magique
- **Attention** : Yannis dit "Sense 2 handles it well". Seedance moins. A tester.

---

## Meta-regle Sonjata (lecon 2026-04-22)

Nos instincts cinematographiques etaient bons mais on n'avait pas le **vocabulaire officiel**. Exemples :
- "Orbite 180 scene 4" = `Orbit 180` officiel → prompts Seedance plus precis des la prochaine fois
- "Ken Burns scene 5A" = on a fait un `optical zoom` alors qu'un `slow dolly out` aurait ete plus emotionnel (moins "cheap")
- "Tracking scene 6A" = `Sidetracking` ou `Leading shot` = choix explicite desormais

**Regle** : dans tout prompt Seedance/Kling/Veo, **nommer explicitement le mouvement** avec le terme officiel (`orbit`, `dolly in/out`, `crane up`, `lateral track`, etc.) plutot que decrire vaguement.

---

## Recommandations Thiaroye 1944 (pret a utiliser)

| Scene | Titre | Type | Mouvement propose | Prompt fragment |
|---|---|---|---|---|
| 1 | Le Retour | contemplatif | Slow dolly in + Cinematic arc | `Slow dolly in toward the tirailleur holding the letter, then 45-degree cinematic arc around his profile. Smooth motion.` |
| 2 | La Revendication | narratif | OTS + Rack focus | `Over-the-shoulder from the absent officer's perspective. Rack focus shifts from the open letter to the upturned palm to the tirailleur's determined face.` |
| 3 | Le Massacre | action | Snap zoom + Handheld | `Snap zoom on first gunshot, then handheld dynamic motion with natural shake as tirailleurs fall. Raw, urgent.` |
| 4 | L'Effacement | contemplatif | Slow dolly out + Crane up | `Slow dolly out from the fallen tirailleur, then crane up revealing the empty quay. Isolation, emotional distance.` |
| 5 | Le Jugement | narratif | OTS + Pedestal down | `OTS from behind the French judges looking at the accused tirailleurs. Pedestal down when the sentence falls, camera lowers with the defeat.` |
| 6 | La Verite Prisonniere | narratif | Reveal from blur + Extreme macro zoom | `Shot starts out of focus, slowly sharpens to reveal archive documents. Then extreme macro zoom on the names of the tirailleurs.` |
| 7 | Le Souvenir / CTA | contemplatif | Slow dolly out + Tilt up | `Slow dolly out from the memorial plaque, then tilt up toward the sky. Commemorative, reverent.` |

**Regle d'integration** : ajouter au prompt de style Thiaroye les clauses "SMOOTH, stable motion, paper-craft palette froide" pour eviter le drift Seedance sur mouvements complexes.

---

## Anti-patterns (documentes par Yannis + notre experience)

1. **"Cinematic camera movement"** tout seul dans le prompt = resultats aleatoires. Yannis : "hundreds of credits wasted on random results".
2. **Overuse du Dutch angle / Bullet time / Vertigo** = perte d'impact. A utiliser 1-2x max par Short.
3. **Mouvement complexe sur Seedance V2 sans clause "smooth stable"** = drift 3D, deformation.
4. **Ken Burns / optical zoom** au lieu d'un **dolly** = "less intimate" selon Yannis. Le physique de la camera importe.
5. **Frontal camera sur animaux** (chevaux, etc.) = slow-mo gelatineux Seedance (regle confirmee 2026-04-16 Acte IV Soundjata). Profil lateral + pan = solution.

---

## Ressources

- Video source : https://youtu.be/4-ctOYBfmDs ("ALL Camera Movement Prompts in AI Filmmaking (30 Cinematic Moves)", Yannis Ashay, 9:49)
- Transcript complet : `/tmp/camera-video/transcript-clean.txt` (localement)
- Notion library de Yannis (paid) : https://yannisashay.gumroad.com/l/cqxop
- Application Sonjata validee : `memory/tools/minimax.md` (Option B musique + hook pattern)
- Application Thiaroye a venir : manifest src/projects/geoafrique-shorts/manifests/thiaroye-manifest.json

---

## OTS Reveal via Video Extend (Seedance reference-to-video)

**Validee 2026-04-25 sur Thiaroye V5 Scene 2 extend. Cout $0.91 pour 5s.**

### Principe

Le clip source contient un personnage en silhouette OTS (Over-The-Shoulder) avec d'autres personnages au plan moyen. Via Video Extend (`bytedance/seedance-2.0/reference-to-video`), on demande a la camera de glisser lateralement / pivoter vers le contre-champ pour reveler le visage du personnage initialement cache.

Seedance peut interpreter cette consigne de deux facons :
1. **Orbite litterale 45°** : la camera glisse autour, tous les personnages restent dans le cadre.
2. **Travelling-cut implicite** : la camera passe d'un plan moyen (table + tirailleurs + officier silhouette) a un close-up du personnage revele, les autres personnages sortent du cadre. C'est ce que Seedance a livre sur Thiaroye S2.

### Pourquoi le travelling-cut est superieur (lecon Aziz 2026-04-25)

La sortie des autres personnages du cadre n'est PAS une perte. Elle cree une **subjectivite narrative implicite** : le spectateur etait avec eux (cote tirailleurs), et quand la camera glisse vers le personnage revele sans eux, on adopte LEUR regard. C'est une premiere personne narrative invisible, beaucoup plus forte qu'une orbite neutre.

### Conditions de succes

- **Source video** : doit contenir le personnage cible en silhouette OTS (epaules, kepi, profil suggere). Sans cette ancre, Seedance ne sait pas qui reveler.
- **Difference morphologique entre personnages** (ex: officier blanc / tirailleurs noirs) : formuler la contrainte 3 fois dans le prompt sous angles differents — `"WHITE FRENCH OFFICER, pale Caucasian skin"` + `"NO drift to dark skin tone"` + `"skin contrasts visibly with the tirailleurs' skin"`.
- **Accepter une legere derive BD sur le visage revele** : Seedance complexifie les visages au close-up (plus de traits que les tirailleurs paper-craft). Editorialement positif — cree une asymetrie morale visible entre les deux camps.
- **Duree ideale** : 5s. Assez long pour que la revelation respire, court assez pour que la grammaire cinematographique tienne.

### Quand l'utiliser

- **Confrontation entre deux poles** : un demandeur et un decideur, un accusateur et un accuse. Le silence partage devient la dramaturgie.
- **Revelation d'autorite invisible** : l'officier dans Thiaroye, le juge muet, le bureaucrate qui refuse.
- **Moment ou l'on veut montrer le visage de l'oppresseur** sans changer de scene.

### Quand ne PAS l'utiliser

- Si tu veux garder TOUS les personnages dans le cadre tout au long → preferer Orbit 45° classique en i2v sans video extend (controle plus strict)
- Si la source ne contient pas la silhouette OTS du personnage cible → Seedance va inventer un nouveau personnage de toutes pieces (drift garanti)

### Insight strategique : Video Extend > regen frames (2026-04-25)

**Aziz lecon** : pour etendre une scene de N secondes a N+5 secondes, **prefere Video Extend a la generation d'une nouvelle image first-frame/last-frame**. Pourquoi :
- Coherence stylistique 100% preservee (pas de drift entre deux clips i2v independants)
- Pas besoin de regenerer une image Gemini de continuation
- Cout : $0.1814/s (0.6x discount vs i2v classique)
- Seedance suit les prompts de continuation avec fidelite

**Implication pour les futurs dashboards** : pour chaque scene depassant 10s, considerer en option : "clip principal X secondes + Video Extend Ys" plutot que de scinder en 2 clips i2v independants.
