# Seedance 2.0 — Community Examples Reference

> Fichier vivant : chaque exemple documente avec prompt, specs, analyse, et adaptations pour nos projets.
> Objectif : comprendre les patterns de prompts qui produisent les meilleurs resultats,
> et les traduire en prompts concrets pour GeoAfrique, Peste 1347, et futurs projets.

---

## Example 1 — Chase Scene (multi-shot action)

**Fichier :** `example-1.mp4`
**Specs :** 2560x1440, H.264, 60fps, 10s, audio AAC stereo
**Type :** Text-to-video pur (aucune image reference)

**Prompt original :**
```
Camera follows a man in black sprinting through a crowded street, a group chasing close behind. The shot cuts to a side tracking angle as he panics and crashes into a roadside fruit stall, scrambles to his feet, and keeps running. Sounds of a frantic crowd
```

**Analyse :**
- Multi-shot en une seule generation : 3+ angles (face tracking, side view crash, behind with police)
- Physique des objets : fruits qui tombent/volent/rebondissent = extremement realiste
- Coherence personnage : meme homme en noir reconnaissable a travers tous les angles
- Coupes camera naturelles et cinematiques entre les plans
- Foule coherente en arriere-plan sans morphing evident
- Style hyper-realiste (photoreal)

**Patterns de prompt identifies :**
- "Camera follows" = instruction de tracking shot
- "The shot cuts to" = indique explicitement un changement de plan/angle
- Actions physiques detaillees en sequence : "sprinting" -> "crashes into" -> "scrambles to his feet" -> "keeps running"
- "Sounds of a frantic crowd" = instruction audio en fin de prompt
- Prompt relativement court (~40 mots) mais narratif et cinematique

### Comment j'adapterais ce prompt pour nos projets

**GeoAfrique — Abou Bakari (fuite du palais / scene dramatique) :**
```
@Image1 is the primary character identity.

Camera follows the African king in golden robes running through the palace corridors,
servants scattering. The shot cuts to a wide angle as he bursts through ornate wooden
doors into the courtyard, his cape flowing behind him. Sounds of urgent drums and footsteps.
```
- Pattern utilise : "Camera follows" + "The shot cuts to" + actions en sequence
- @Image1 ancre l'identite du personnage (contrairement au text-to-video pur)
- Audio contextuel : "Sounds of urgent drums" au lieu de foule

**Peste 1347 — Scene de fuite (panique en ville medievale) :**
```
Camera follows a hooded figure fleeing through narrow medieval streets, panicked
townspeople pushing past. The shot cuts to a low angle as the figure stumbles over
a market cart, knocking over clay pots that shatter on the cobblestones. The figure
scrambles up and disappears into a dark alley. Sounds of chaos and distant church bells.
```
- Pattern identique : tracking + coupe explicite + physique d'objets (poteries qui se brisent)
- Atmosphere medievale via details contextuels (cobblestones, market cart, church bells)
- Compatible avec style SVG enluminure si utilise avec @Image refs en style flat

**YouTube Shorts (scene d'action generique / hook visuel) :**
```
Camera follows a lone explorer sprinting across a crumbling ancient bridge.
The shot cuts to a dramatic overhead angle as stones fall into the abyss below.
The explorer leaps across the gap and barely grabs the ledge. Sounds of crumbling
rocks and wind.
```
- Format vertical 9:16 possible avec meme pattern
- Hook visuel fort pour les 3 premieres secondes (sprint + crumbling)
- Pattern "Camera follows" + "The shot cuts to" + "Sounds of" = formule reproductible

### Formule universelle extraite

```
Camera [mouvement] [sujet] [action 1 dans lieu].
The shot cuts to [nouvel angle] as [sujet] [action 2 avec interaction physique].
[Sujet] [action 3 / resolution].
Sounds of [ambiance sonore contextuelle].
```

---

## Example 2 — Wuxia Forest Duel (combat + slow-motion + particles)

**Fichier :** `example-2.mp4`
**Specs :** 1280x720, H.264, 24fps, 13s, audio AAC stereo
**Type :** Text-to-video pur (aucune image reference)

**Prompt original :**
```
A spear-wielding warrior clashes with a dual-blade fighter in a maple leaf forest.
Autumn leaves scatter on each impact. Wide shot pulls into tight close-ups of
parrying blades, then cuts to a slow-motion overhead as both leap into the air
```

**Analyse :**
- Style 3D stylise / anime cinematique — PAS photoreal, plus proche du rendu Unreal/jeu video
- Physique des particules : feuilles d'erable qui volent a chaque impact = exactement demande
- Multi-plan reussi : plan large -> plan moyen profil -> close-up bas -> plan moyen armes -> close-up final clash
- Slow-motion : visible sur le saut aerien avec les feuilles en suspension
- Coherence visuelle : foret d'automne, brume, palette orange/or constante a travers tous les plans
- 2 personnages restent distincts (lance vs lames) malgre les changements d'angle
- Eclairage volumetrique (brume + contre-jour) genere automatiquement

**Patterns de prompt identifies :**
- "[Sujet A] clashes with [Sujet B]" = interaction entre 2 personnages
- "on each impact" = lie un effet visuel (feuilles) a une action (impact des armes)
- "Wide shot pulls into tight close-ups" = instruction zoom/transition camera
- "then cuts to a slow-motion overhead" = slow-mo explicite + angle camera
- "as both leap into the air" = action climax synchronisee entre 2 personnages
- Prompt court (~45 mots) — narratif pur, zero instruction technique

### Comment j'adapterais ce prompt pour nos projets

**GeoAfrique — Amanirenas vs soldat romain :**
```
@Image1 is the primary character identity (Amanirenas).

A one-eyed warrior queen clashes with a Roman centurion in a Nile river valley.
Sand and dust scatter on each impact. Wide shot pulls into tight close-ups of
her spear parrying the gladius, then cuts to a slow-motion low angle as she
strikes the final blow. Sounds of clashing metal and war drums.
```
- Meme formule : 2 personnages distincts + particules a l'impact + zoom + slow-mo
- Particules adaptees : sable/poussiere au lieu de feuilles

**Peste 1347 — Confrontation symbolique (Mort vs Medecin) :**
```
A plague doctor in a beaked mask faces a dark hooded figure in a fog-filled
medieval cemetery. Wind scatters dead leaves on each step forward. Wide shot
pulls into tight close-ups of trembling hands gripping a staff, then cuts to
a slow-motion overhead as the dark figure engulfs the doctor in shadow.
Sounds of howling wind and distant church bells.
```
- Combat symbolique plutot que physique — meme structure de prompt
- Particules : feuilles mortes + brouillard
- Slow-mo sur le moment dramatique (engulfing shadow)

**YouTube Shorts — Duel epique generique (hook 9:16) :**
```
Two samurai face off in a bamboo forest at dawn. Cherry blossoms scatter on
each sword strike. The shot pulls from wide to a tight close-up of sparking
blades, then cuts to slow-motion overhead as both warriors leap and cross
paths mid-air. Sounds of ringing steel and wind through bamboo.
```
- Format vertical — les duels en close-up fonctionnent bien en 9:16
- Hook des 3 premieres secondes : face-off + premier impact

### Formule universelle extraite

```
[Sujet A] clashes with / faces [Sujet B] in [lieu atmospherique].
[Particules] scatter on each [action d'impact].
Wide shot pulls into tight close-ups of [detail dramatique],
then cuts to a slow-motion [angle] as [action climax synchronisee].
Sounds of [ambiance sonore].
```

### Comparaison des patterns (Example 1 vs 2)

| Pattern | Example 1 (Chase) | Example 2 (Duel) |
|---------|-----------|-----------|
| Personnages | 1 + foule | 2 distincts |
| Mouvement | Lineaire (course) | Interactif (combat) |
| Particules | Fruits (physique) | Feuilles (atmospherique) |
| Camera | Tracking + coupe | Zoom pull + coupe + slow-mo |
| Climax | Action continue | Saut aerien synchronise |
| Mot-cle camera | "Camera follows" / "The shot cuts to" | "Wide shot pulls into" / "then cuts to" |

---

## Example 3 — Spy Thriller (plan-sequence continu + foule + 2 personnages)

**Fichier :** `example-3.mp4`
**Specs :** 2560x1440, H.264, 60fps, 13s, audio AAC stereo
**Type :** Text-to-video pur (aucune image reference)

**Prompt original :**
```
Spy thriller style. Front-tracking shot of a female agent in a red trench coat
walking forward through a busy street, pedestrians constantly crossing in front
of her. She rounds a corner and disappears. A masked girl lurks at the corner,
glaring after her. Camera pans forward as the agent walks into a mansion and
vanishes. Single continuous take, no cuts
```

**Analyse :**
- Plan-sequence de 13s sans aucune coupe — "Single continuous take" respecte
- Foule dense avec occlusions naturelles (pietons croisent devant la camera)
- 2 personnages narratifs distincts : agente rouge + fille masquee
- Architecture coherente : rue parisienne → coin de rue → grilles de manoir → facade
- Profondeur de champ cinematique (flou d'avant-plan sur les pietons proches)
- Palette muted/desaturee style thriller espionnage
- La fin (entree dans le manoir) est visuellement parfaite — grilles ornees, symetrie

**Problemes detectes :**
- **Morphing visage** frames 1-3 (~0-1.5s) : le visage de l'agente se modifie legerement (yeux, structure). Se stabilise apres ~2s quand elle recule dans la foule.
- **Fusion de personnages** : quand un pieton croise tres pres de l'agente, il y a un bref artefact de fusion/blending entre les deux. Probleme connu de Seedance avec les occlusions proches.
- Ces defauts confirment que ce clip N'EST PAS cherry-picke a l'extreme — c'est un bon resultat avec des imperfections reelles.

**Patterns de prompt identifies :**
- "Spy thriller style." = instruction de genre/atmosphere EN PREMIERE POSITION (nouveau pattern)
- "Front-tracking shot" = type de camera precis des le debut
- "pedestrians constantly crossing in front" = instruction d'occlusion deliberee
- "She rounds a corner and disappears" → "A masked girl lurks" = transition narrative entre 2 personnages
- "Single continuous take, no cuts" = instruction negative explicite (dire ce qu'on NE veut PAS)
- Prompt plus long (~65 mots) mais structurellement lineaire (A puis B puis C)

**Nouveaux patterns vs Examples 1-2 :**
- **Genre en ouverture** ("Spy thriller style.") = ancre le ton et la palette visuelle
- **Plan-sequence** ("Single continuous take, no cuts") = empêche les coupes que Seedance ajouterait naturellement
- **Instructions negatives** = dire a Seedance ce qu'il ne doit PAS faire

### Comment j'adapterais ce prompt pour nos projets

**GeoAfrique — Abou Bakari traverse le marche de Tombouctou :**
```
@Image1 is the primary character identity.

Historical epic style. Front-tracking shot of an African king in golden robes
walking forward through a bustling market in Timbuktu, merchants and traders
constantly crossing in front of him. He passes through an ornate archway into
the royal palace courtyard. Guards bow as he passes. Single continuous take,
no cuts. Warm golden hour lighting. Sounds of market chatter and distant drums.
```
- Genre en ouverture : "Historical epic style"
- Plan-sequence = immersion dans l'univers de Tombouctou
- Foule du marche = equivalent des pietons parisiens
- Transition exterieur (marche) → interieur (palais) comme rue → manoir

**Peste 1347 — Le medecin traverse la ville infectee :**
```
Dark medieval horror style. Front-tracking shot of a plague doctor in a beaked
mask walking forward through a narrow medieval street, sick townspeople stumbling
past him. He passes a cart of covered bodies, rounds a corner past a burning
pyre, and enters a candlelit infirmary. Single continuous take, no cuts.
Sounds of coughing, distant wailing, and crackling fire.
```
- Genre : "Dark medieval horror style" ancre l'atmosphere immediatement
- Plan-sequence = tension montante continue sans coupure
- Progression : rue → chariot → bucher → infirmerie = escalade narrative

**YouTube Shorts — Thriller vertical (hook immersif) :**
```
Spy thriller style. Front-tracking shot of a hooded figure walking through
a rain-soaked neon-lit alley at night, strangers brushing past. The figure
stops, turns around slowly. A shadowy silhouette stands at the far end of
the alley. Single continuous take, no cuts. Sounds of rain and distant sirens.
```
- 9:16 ideal : ruelle etroite = format vertical naturel
- Hook : "turns around slowly" + silhouette = tension immediate

### Formule universelle extraite

```
[Genre] style. Front-tracking shot of [sujet] [action de deplacement]
through [lieu anime], [figurants] constantly [interaction autour].
[Sujet] [action narrative 2 / transition spatiale].
[Element narratif secondaire].
Single continuous take, no cuts. [Ambiance sonore].
```

### Tableau comparatif mis a jour (Examples 1-2-3)

| Pattern | Ex. 1 (Chase) | Ex. 2 (Duel) | Ex. 3 (Spy) |
|---------|---------------|---------------|-------------|
| Style | Photoreal | 3D anime/stylise | Photoreal thriller |
| Camera | Multi-cut tracking | Multi-cut zoom+slowmo | Plan-sequence continu |
| Personnages | 1 + foule | 2 combattants | 2 narratifs + foule |
| Mouvement | Lineaire rapide | Combat interactif | Marche lente + tension |
| Defauts visibles | Aucun evident | Aucun evident | Morphing visage 0-1.5s |
| Mot-cle cle | "Camera follows" | "Wide shot pulls" | "Single continuous take" |
| Longueur prompt | ~40 mots | ~45 mots | ~65 mots |
| Pattern unique | Coupe explicite | Slow-motion + particules | Genre en ouverture + instruction negative |

---

## Example 4 — Donkey Motorcycle Commercial (multi-shot structure + texte + absurde)

**Fichier :** `example-4.mp4`
**Specs :** 1280x720, H.264, 60fps, 15s, audio AAC stereo
**Type :** Text-to-video pur (aucune image reference)

**Prompt original :**
```
15s commercial. Shot 1: side angle, a donkey rides a motorcycle bursting through
a barn fence, chickens scatter. Shot 2: close-up of spinning tires on sand, then
aerial shot of the donkey doing donuts, dust clouds rising. Shot 3: snow mountain
backdrop, the donkey launches off a hillside, text 'Inspire Creativity, Enrich Life'
revealed behind it as dust settles
```

**Analyse :**
- **Structure "Shot 1 / Shot 2 / Shot 3"** = format de storyboard numerote, et Seedance suit parfaitement
- Coherence du personnage absurde : le meme ane est reconnaissable dans les 3 shots malgre des environnements totalement differents (grange, desert, montagne neige)
- Physique excellente : poussiere, neige, poulets qui s'enfuient, pneus qui creusent le sable
- **Texte genere dans la video** : "Inspire Creativity, Enrich Life" apparait proprement sur la frame 12, lisible et bien place — Seedance sait generer du texte overlay
- Transition d'environnement : grange bois → desert sable → montagne neige = 3 decors en 15s
- Le saut final avec la moto en l'air = physique du vol + ane decolle de la moto = absurde maitrise
- Le format "15s commercial" est respecte — exactement 15s

**Patterns de prompt identifies :**
- **"15s commercial."** = instruction de format/duree/genre en premiere position (comme "Spy thriller style.")
- **"Shot 1: ... Shot 2: ... Shot 3: ..."** = structure de storyboard numerotee = NOUVEAU PATTERN MAJEUR
- **"text '...'"** = Seedance peut generer du texte lisible dans la video quand on le met entre quotes
- **Chaque shot contient** : angle camera + sujet + action + detail visuel
- Prompt ~75 mots — le plus long des 4 exemples, mais tres structure

**Decouvertes majeures :**

1. **Storyboard numerote = le meilleur format pour multi-shot.** "Shot 1 / Shot 2 / Shot 3" est plus precis et fiable que "The shot cuts to" (Ex. 1) ou "then cuts to" (Ex. 2). Seedance comprend la numerotation comme un script de production.

2. **Le texte fonctionne.** On peut generer du texte lisible directement dans la video. Pour nos projets, ca veut dire que les overlays type "1311" / "1492" / nom du personnage pourraient etre generes directement par Seedance au lieu d'etre ajoutes en post-prod Remotion.

3. **Les environnements peuvent changer entre shots.** Pas besoin de rester dans le meme lieu — chaque shot est independant visuellement tant que le sujet reste coherent.

### Comment j'adapterais ce prompt pour nos projets

**GeoAfrique — Abou Bakari "pub epique" multi-lieux :**
```
@Image1 is the primary character identity.

15s historical epic. Shot 1: wide angle, the African king stands at the bow
of a massive fleet of ships, ocean waves crashing, camera dollies in.
Shot 2: close-up of the king's face, determination in his eyes, wind blowing
his golden robes. Shot 3: aerial shot of the fleet sailing toward a distant
coastline, text 'Abou Bakari II - L'Explorateur' revealed as clouds part.
```
- Structure Shot 1/2/3 pour controler chaque plan
- Texte genere dans la video = titre du personnage
- 3 echelles differentes : wide → close-up → aerial

**Peste 1347 — "Bande-annonce" 15s :**
```
15s dark cinematic trailer. Shot 1: wide angle, a medieval city at dawn,
smoke rising from chimneys, peaceful. Shot 2: close-up of a rat scurrying
across cobblestones, then a wide shot of bodies in the street, a plague
doctor walks past. Shot 3: aerial shot of the city engulfed in smoke,
text '1347 - La Grande Peste' fades in over the darkness.
```
- Format trailer = hook parfait pour YouTube
- Progression narrative : paix → signe avant-coureur → devastation
- Texte genere directement dans le clip

**YouTube Shorts — Hook commercial viral :**
```
15s viral commercial. Shot 1: side angle, a cat wearing sunglasses drives
a tiny car through a living room, knocking over a lamp. Shot 2: close-up
of spinning wheels on carpet, then aerial shot of the cat drifting around
furniture. Shot 3: the cat parks perfectly, crosses its paws,
text 'Deal With It' appears.
```
- L'absurde fonctionne = potentiel viral enorme
- Meme structure Shot 1/2/3 applicable a n'importe quel sujet

### Formule universelle extraite

```
[duree] [genre]. Shot 1: [angle], [sujet] [action dramatique], [detail visuel/particules].
Shot 2: [close-up detail], then [angle different] of [sujet] [action 2], [effet physique].
Shot 3: [angle large/aerien], [sujet] [action climax],
text '[message]' revealed [transition].
```

### Tableau comparatif final (Examples 1-4)

| Pattern | Ex. 1 (Chase) | Ex. 2 (Duel) | Ex. 3 (Spy) | Ex. 4 (Commercial) |
|---------|---------------|---------------|-------------|---------------------|
| Style | Photoreal | 3D anime | Photoreal thriller | Photoreal absurde |
| Camera | Multi-cut | Zoom+slowmo | Plan-sequence | 3 shots structures |
| Structure | Narrative lineaire | Narrative lineaire | Continue | **Storyboard numerote** |
| Texte overlay | Non | Non | Non | **OUI — lisible** |
| Environnement | 1 lieu | 1 lieu | 1 lieu progressif | **3 lieux differents** |
| Defauts | Aucun evident | Aucun evident | Morphing 0-1.5s | Aucun evident |
| Longueur prompt | ~40 mots | ~45 mots | ~65 mots | ~75 mots |
| Pattern cle | "Camera follows" | "Wide shot pulls" | "Single continuous take" | **"Shot 1: / Shot 2: / Shot 3:"** |

---

## Feature 1 — Advanced Cinematography (orbite + tracking + plan-sequence)

**Fichier :** `feature-1.mp4`
**Specs :** 1280x720, H.264, 60fps, 14s, audio AAC stereo
**Type :** Demo feature — prompt original non fourni
**Source :** Showcase "Advanced Cinematography — Director-Level Camera Control"

**Description officielle :**
> The model handles complex camera work that other models struggle with. Dolly zooms,
> rack focuses, tracking shots, POV switches, and smooth handheld movement all work
> as expected. You describe the shot, and the camera executes it.

**Reverse engineering — Ce qu'on voit :**

| Timecode | Technique camera | Description |
|----------|-----------------|-------------|
| 0-3s | Dolly in (close-up) | Visage de face, inquietude, camera s'approche lentement |
| 3-5s | Rack focus + rotation | Mise au point change, camera commence a tourner |
| 5-7s | Orbite 180 degres | Camera fait le tour : face → profil → dos. Sujet statique. |
| 7-8s | Reverse shot (de dos) | Nuque visible, portes ascenseur s'ouvrent, LED rouge |
| 8-10s | Tracking arriere | Personnage sort et court, camera recule devant lui |
| 10-12s | Tracking continu | Course dans couloir futuriste dore, distance maintenue |
| 12-14s | Arret + re-cadrage | Il s'arrete, se retourne, close-up 3/4 |

**7 techniques camera en un seul clip continu** : dolly in, rack focus, orbit, POV switch, tracking, handheld, re-cadrage.

**Prompt probable (reverse engineered) :**
```
Thriller style. A man in a yellow athletic shirt stands nervously in an elevator,
close-up on his face. Camera slowly orbits around him from front to back.
The elevator doors open and he bursts out running down a futuristic golden corridor.
Camera tracks behind him as he runs. He stops and turns back to look.
Single continuous take, handheld camera movement. Tense atmosphere.
```

### Strategie de references : MINIMALISTE

**Ce type de clip ne beneficie PAS du multi-shot ni du multi-references.**

| Aspect | Recommandation | Raison |
|--------|---------------|--------|
| Refs personnage | 1 seule @Image (visage/vetement) | Ancrer l'identite suffit |
| Refs decor | ZERO | L'espace doit etre libre pour l'orbite et la transition (ascenseur → couloir). Des refs decor figeraient l'espace. |
| Audio | ZERO | La tension repose sur le silence / ambiance generee |
| Multi-shot (Shot 1/2/3) | NON | Casserait la continuite du plan-sequence |

**Regle : plan-sequence continu = moins de refs = plus de liberte pour Seedance.**

### Guide de references par type de clip

| Type de clip | @Image perso | @Image decor | @Audio | Multi-shot |
|---|---|---|---|---|
| Plan-sequence (orbite, tracking) | 1 max | 0 | 0 | NON |
| Multi-shot structure (Shot 1/2/3) | 1-3 | 1-2 | 0-1 | OUI |
| Lip sync dialogue | 1 character sheet | 1 | 1 obligatoire | NON |
| Trailer (refs video longue) | 2-3 frames extraites | 0 | 0-1 | OUI |

### Comment j'adapterais pour nos projets

**GeoAfrique — Abou Bakari revelation du royaume :**
```
@Image1 is the primary character identity.

Historical epic. Close-up of the African king's face on his throne, camera
slowly orbits around him revealing the grand palace hall behind. He rises
and walks toward the balcony. Camera tracks behind him. He stops at the
edge overlooking a vast fleet of ships on the ocean below.
Single continuous take. Warm golden light, epic atmosphere.
```
- 1 seule ref personnage, zero ref decor
- Orbite = revele progressivement le palais puis le paysage
- Climax : revelation du royaume depuis le balcon

**Peste 1347 — Le medecin decouvre l'epidemie :**
```
Dark medieval. Close-up of a plague doctor's beaked mask in candlelight,
camera slowly orbits around revealing a room full of sick patients behind.
He turns and walks through the infirmary door into the street. Camera
tracks behind him. He stops, looking at a cart of covered bodies.
Single continuous take, handheld. Sounds of coughing and distant bells.
```
- L'orbite revele l'horreur DERRIERE le personnage = tension progressive
- La transition interieur → exterieur en plan-sequence

---

## Feature 2 — Real-World Physics (combat + surfaces + poids)

**Fichier :** `feature-2.mp4`
**Specs :** 1920x1080, H.264, 30fps, 8s, audio AAC stereo
**Type :** Demo feature — prompt original non fourni
**Source :** Showcase "Real-World Physics — Action That Feels Real"

**Description officielle :**
> Fight scenes, vehicle chases, explosions, falling debris. Seedance 2.0 understands
> how objects interact under force. Collisions have weight, fabric tears realistically,
> and characters move with physical believability even in high-action sequences.

**Reverse engineering — Ce qu'on voit :**

| Timecode | Action | Physique demontree |
|----------|--------|-------------------|
| 0-2s | Combattante glisse sur la glace | Friction surface glissante, perte d'equilibre realiste |
| 2-3s | Elle se releve en position de combat | Poids du corps, inertie du mouvement |
| 3-5s | Ennemi en armure entre, ils s'affrontent | Contact physique, coups avec poids reel |
| 5-7s | Echange de coups, esquive | Transfert de poids, pivot des hanches |
| 7-8s | Neige eclate a l'impact | Particules environnementales reactives |

**Style :** 3D stylise (type jeu video/Unreal) — meme esthetique que Example 2

**Points remarquables :**
- **Differenciation de morphologie** : elle (agile, rapide) vs lui (lourd, puissant) — mouvements adaptes
- **Surface reactive** : la glace est glissante, le personnage s'adapte
- **2 personnages distincts** : masque + camouflage vs armure + casque — zero confusion
- **Particules reactives** : la neige repond aux impacts physiques

**Prompt probable :**
```
3D action game style. A masked female fighter slides on ice in a snowy
mountain setting, regains her footing. An armored soldier approaches.
They exchange close combat blows. Snow explodes from impacts.
Dynamic camera follows the action.
```

### Elements exploitables pour nos projets

**La physique de combat n'est PAS notre cas d'usage.** Mais deux patterns sont reutilisables :

**1. Particules reactives a l'action :**
- Sable sous les pas d'Amanirenas marchant dans le desert
- Poussiere dans les rues de la Peste quand une charrette passe
- Eclaboussures d'ocean contre la flotte d'Abou Bakari
- Pattern prompt : "[particule] [reaction] from [action]" (ex: "sand kicks up from each heavy step")

**2. Description du poids/type de mouvement :**
- Seedance adapte le mouvement a la morphologie et a la description
- "walks with heavy regal authority" ≠ "moves swiftly and silently"
- Pour Abou Bakari : "The king walks slowly with commanding weight, golden robes dragging"
- Pour Amanirenas : "The warrior queen moves with fierce agility, spear ready"

---

## Feature 3 — Audio-Video Joint Generation (trailer complet + audio genere)

**Fichier :** `feature-3.mp4`
**Specs :** 1280x720, H.264, 60fps, 15s, audio AAC stereo
**Type :** Demo feature — prompt original non fourni
**Source :** Showcase "Audio-Video Joint Generation — Cinema-Grade Sound, Built In"

**Description officielle :**
> Seedance 2.0 generates audio natively alongside video. Music carries deep bass and
> cinematic warmth. Dialogue is clear with precise lip-sync. Sound effects land exactly
> on cue. No post-production audio layering needed.

**Reverse engineering — Ce qu'on voit :**

Un trailer de film complet : "MEAWPELPS — This summer, curiosity kills everyone."
Chat geant qui envahit Manhattan. 6 plans en 15s.

| Timecode | Visuel | Audio (genere) |
|----------|--------|----------------|
| 0-3s | Vue aerienne Manhattan, coucher de soleil | Musique calme, bruits de ville |
| 3-5s | Vaisseau/chat descend entre les immeubles | Vrombissement, tension montante |
| 5-8s | Chat blanc geant dans la rue, voitures ecrasees | Pas lourds, craquements, panic |
| 8-10s | Scientifique en labo, expression choquee | Dialogue genere + lip sync |
| 10-13s | Oeil geant du chat dans la fenetre, homme terrifie | Tension maximale, grondement |
| 13-15s | "MEAWPELPS" + tagline + faux credits | Boom, silence, tagline |

**Ce que ca prouve :**
- Musique cinematique progressive (calme → tension → climax → silence)
- SFX synchronises aux bonnes frames (pas du chat = frame exacte)
- Dialogue genere avec lip sync (scientifique)
- Texte overlay complet : titre + tagline + faux generique
- 6 plans structures = storyboard Shot 1-6 clairement utilise

**Prompt probable :**
```
15s sci-fi movie trailer. Shot 1: aerial view of Manhattan at sunset, peaceful.
Shot 2: low angle, a massive UFO descends between skyscrapers carrying a giant
white cat. Shot 3: the giant cat walks through city streets, crushing cars, dust
rising. Shot 4: a scientist in a lab reacts in shock, saying "What is that thing?".
Shot 5: extreme close-up of the cat's eye filling an apartment window, a man
stares in terror. Shot 6: black screen, title 'MEAWPELPS', tagline 'This summer,
curiosity kills everyone.' Cinematic orchestral score building to climax.
```

### Lecon cle : audio GENERE vs audio UPLOADE

| Scenario | Qualite audio Seedance | Recommandation pour nous |
|----------|----------------------|--------------------------|
| Musique + SFX (generes) | EXCELLENT — synchronise, cinematique | Utilisable tel quel pour trailers/hooks SANS narration |
| Dialogue genere par Seedance | BON — lip sync, mais voix generique | Pas utilisable — nos voix ElevenLabs sont superieures |
| Audio ElevenLabs uploade | DEFORME — re-synthetise les mots | TOUJOURS remplacer en post-prod Remotion |

**Strategie inchangee pour GeoAfrique/Peste :** Seedance visuel + lip sync timing → strip audio → overlay ElevenLabs dans Remotion.

**Nouvelle option pour trailers/hooks sans narration :** laisser Seedance generer musique + SFX = gain de temps, zero post-prod audio.

---
