# Brief créatif Kimi — Atlas Shaka Zulu

> Pre-production. Audio finalisé, timing aligné, manifest visuel construit.
> On veut TON regard créatif AVANT de coder les composants Remotion.

---

## 1. CONTEXTE PRODUIT

**Format** : Atlas YouTube Short — 1920x1080, 30fps, 150.32s (2min30)
**Pilier chaine** : Atlas (figures historiques africaines + cartographie animée)
**Episode précédent référence** : Mansa Moussa V2 (style validé : d3-geo + Natural Earth + inserts dataviz)
**Voix** : Narratrice GeoAfrique v2 ElevenLabs (féminine, expressive, rythme ouest-africain)
**Style visuel** : carte d3-geo vectorielle (palette parchemin + or + bordeaux Zulu)

---

## 2. SCRIPT EXACT (avec timestamps Forced Alignment ElevenLabs, loss 0.244)

```
[HOOK 0.12s → 4.86s]
"Il est né paria. Il est mort roi d'un empire de deux cent cinquante mille âmes."

[S1 SETUP GEO 5.56s → 21.76s]
"KwaZulu-Natal. Un clan. Les Zulus. Mille cinq cents personnes.
Un fils que son père refuse de reconnaître.
Banni à six ans. Banni à quinze ans.
Deux fois chassé. Deux fois debout.
Son nom : Shaka."

[S2 INNOVATIONS MILITAIRES 22.75s → 72.36s]
"Quand Dingiswayo lui donne un régiment, Shaka réinvente la guerre.
Première innovation : il supprime la lance longue.
Il forge l'iklwa, courte, mortelle au corps à corps. L'ennemi doit se battre.
Deuxième : le bouclier devient une arme.
Accrocher le bouclier adverse, tourner le poignet, l'ennemi expose son flanc.
Un seul mouvement. Fatal.
Troisième : la formation des cornes de buffle.
Un centre qui fixe et épuise. Deux flancs qui encerclent par derrière.
L'ennemi est cerné avant de comprendre ce qui arrive.
À Gqokli Hill, en mil huit cent dix-huit, quatre-vingt-dix pour cent de pertes chez l'ennemi.
Pas une victoire. Une destruction totale."

[S3 EXPANSION 73.16s → 93.46s]
"Chaque tribu conquise fournit ses guerriers, loyaux à Shaka seul.
Mille cinq cents guerriers en mil huit cent seize.
Cinquante mille en mil huit cent vingt-huit.
Vingt pour cent de sa population porte les armes. En Europe, cinq pour cent.
Un seul homme. Trente mille kilomètres carrés."

[S4 SPIRALE NANDI 94.24s → 139.64s]
"Mais rien de tout cela ne peut se comprendre sans Nandi.
Sa mère. La seule qui l'avait défendu.
Quand tous le rejetaient, Nandi était là.
Octobre mil huit cent vingt-sept. Nandi meurt.
Shaka décrète un deuil national.
Toute naissance est proscrite pendant un an.
Tout champ reste sans culture.
Selon les chroniques, James Stuart Archive, quatre mille Zulus périssent.
Pour n'avoir pas pleuré assez fort.
Ses demi-frères Dingane et Mhlangana comprennent.
L'homme qui a tout bâti est en train de tout détruire.
Le vingt-deux septembre mil huit cent vingt-huit, ils l'assassinent."

[S5 CTA 140.49s → 150.23s]
"L'empire Zulu survit cinquante ans après sa mort.
Quand on parle de génie militaire, on cite Napoléon. On cite Alexandre.
Qui cite Shaka ? Abonne-toi. Il y en a d'autres comme lui."
```

---

## 3. STRUCTURE PRÉ-VALIDÉE (par scène)

| # | Segment | Durée | Plan visuel actuel |
|---|---------|-------|---------------------|
| Hook | 0-5s | Shaka plein écran (PixelLab breathing-idle OU Seedance papercraft) |
| S1 | 6-22s | Globe ortho → zoom KwaZulu-Natal + insert "1 500" géant 3s |
| S2 | 23-72s | **Triple-screen** : carte centre, guerrier PixelLab gauche, panel inserts droite (iklwa/bouclier/cornes) |
| S3 | 73-93s | Carte territoire qui grandit + flèches Mfecane bezier + bar chart 1500→50000 |
| S4 | 94-139s | Bascule palette or→bordeaux (à la mort de Nandi, frame 3225) + insert "4 000" + texte JSA |
| S5 | 140-150s | Cascade Napoléon / Alexandre / Shaka? + carte Afrique silhouette |

**Inserts (pattern interrupts)** : chaque segment a au moins un insert overlay qui interrompt la carte sans interrompre la narration. Durée 4-8s.

---

## 4. ASSETS DÉJÀ DISPONIBLES

**PixelLab MCP characters (générés, validés)** :
- **Shaka** (e8c38444) : 4 rotations + walking 6frames x4dir + fight-stance-idle 8frames + breathing-idle
- **Warrior Zulu** (33e221bd) : 4 rotations + walking 6frames x4dir
- Voir `public/atlas-shaka-zulu/characters/`

**Audio narration** : `public/atlas-shaka-zulu/audio/narration-v5.mp3` (150.32s, validé)

**À générer** :
- Inserts S2 : iklwa + bouclier (option PixelLab create_map_object OU option Gemini parchemin)
- Schéma cornes de buffle (probablement SVG Remotion pur)
- Hook : Shaka plein écran (option PixelLab scale 3x OU Seedance papercraft 5s)
- Musique de fond (Minimax fal.ai — isicathamiya ou ingoma à décider)

---

## 5. CONTRAINTES STACK (récap rapide)

**Maitrisé** : Remotion + React + d3-geo + PixelLab MCP + ElevenLabs + Whisper + Gemini + Seedance + Minimax
**Hors stack** : After Effects, Three.js, Live2D, rigging avancé, génération vidéo AI >15s

**Préférences Aziz validées** :
- PixelLab sprites : 64px canonique, pas d'ombre statique, pas de hop, carte plate quand persos dessus
- Particules flottantes (dust motes / sparkles) INTERDITES (sauf poussière combat)
- "Vivant partout" : chaque personnage bouge en continu, pas de freeze
- Cartes : style "design 2D moderne" (pas vieille carte au papier obligatoire)
- Inserts : accompagnent la narration, ne l'interrompent pas, pas de durée ajoutée

---

## 6. NOS 5 QUESTIONS — réponse précise attendue sur CHACUNE

### Q1 — DYNAMISME DE LA CARTE
La carte d3-geo vectorielle est notre toile principale (segments S1, S2, S3, S5).
**Comment la rendre vraiment vivante** — pas juste un fond statique avec overlays par-dessus ?

Pense en termes de :
- Mouvements continus de caméra (drift, parallaxe, micro-zoom)
- Éléments qui pulsent / respirent / clignotent en synchro narration
- Particules acceptables (vent, fumée localisée, pas dust motes)
- Transformations visuelles de la carte elle-même (texture qui change, palette qui dérive)
- Référence Seedance : on rendait les personnages "vivants" avec micro-mouvements continus — équivalent pour la carte ?

Cible : un viewer ne doit JAMAIS sentir que la carte est figée plus de 1.5s.

### Q2 — PIXELLAB CRÉATIF DANS NOS CONTRAINTES
On a Shaka et Warrior générés. **Comment TOI tu utiliserais PixelLab plus créativement** sur cet épisode ?

PixelLab peut faire (vérifié récemment) :
- `create_character` : sprites avec rotations 4-dir, animations walking/idle/breathing/custom-text
- `create_map_object` : objets isometric/side/front/top (idéal pour iklwa, bouclier)
- `animate_character` : nouvelles animations sur perso existant
- `vary_object` : variantes d'un même objet
- Tilesets topdown / sidescroller / isometric

Pense en termes de :
- Quels SPRITES additionnels créer pour booster le storytelling (pas juste Shaka + Warrior) ?
- Comment combiner sprites + carte d3-geo de façon non triviale (sprite qui marche sur la carte, sprite groupe qui se forme/disperse, etc.) ?
- Inserts S2 (iklwa/bouclier/cornes) : as-tu une vision PixelLab plus forte que "objet seul sur fond noir" ?
- Le hook : quelle composition PixelLab maximiserait l'impact en 5s ?

### Q3 — S2 TRIPLE-SCREEN (composant signature, le plus risqué)
Le segment S2 dure 49.6s — c'est le PLUS LONG de l'épisode et il porte 3 innovations militaires distinctes.
Notre plan actuel : split en 3 colonnes (carte | guerrier | inserts rotatifs).

**Est-ce la bonne structure ?** Risques que je vois :
- 49s sur le même layout = lassitude possible
- 3 inserts qui se succèdent dans le panel droit = peut sembler répétitif
- Le guerrier statique à gauche risque d'être "décoratif" (pas narratif)

Propose soit (a) une amélioration de cette structure, soit (b) une structure alternative qui démontre les 3 innovations différemment. Sois concret sur les transitions entre les 3 sous-segments (iklwa / bouclier / cornes).

### Q4 — S4 SPIRALE NANDI (bascule émotionnelle)
S4 dure 45.4s — c'est l'arc émotionnel de la vidéo.
Plan actuel : palette dérive or→bordeaux à partir de la mort de Nandi (frame 3225), fond s'assombrit, insert "4 000" + source JSA.

**Comment rendre ce basculement vraiment viscéral** — pas juste un changement de couleur ?
La narration passe de "tactique militaire" à "tragédie intime puis collective" en ~3 secondes.

Pense :
- Élément carte qui se défait / se craquelle / se vide
- Sound design suggestion (rappel : on a Minimax + sound-generation ElevenLabs)
- Texte qui apparait différemment qu'avant
- Le moment "4 000 Zulus périrent pour n'avoir pas pleuré assez fort" (120s) — comment frapper fort sans verser dans le pathos ?

### Q5 — PATTERN INTERRUPTS (vue meta sur les 6 segments)
Règle Aziz : 1 événement visuel minimum toutes les 1.5s, et chaque segment a ≥1 pattern interrupt visuel.

**En regardant le script + structure ci-dessus, où vois-tu :**
- Un trou de 3s+ sans changement visuel ?
- Un moment narratif fort qu'on n'exploite PAS visuellement ?
- Un insert qu'on a placé qui devrait être ailleurs ?
- Un insert manquant qu'on devrait ajouter ?

---

## 7. FORMAT DE RÉPONSE ATTENDU

Pour chaque question Q1-Q5, structure ta réponse en :

```
## Q[N] — [titre]

### Idée principale
[1 phrase qui résume]

### Comment dans notre stack
[Technique précise — composants Remotion, fonctions d3-geo, paramètres PixelLab, frames, etc.]

### Impact dynamisme/lisibilité
[Court — pourquoi ça marche]

### Coût production
[Estimation : asset count, heures de code, appels API]

### Variantes (optionnel, max 2)
[Si tu vois 2-3 chemins, liste-les brièvement]
```

À la fin, un **VERDICT** :
- 3 idées qu'on doit absolument intégrer (priorité haute)
- 2 idées intéressantes mais optionnelles (priorité moyenne)
- 1 chose qu'on devrait SUPPRIMER de notre plan actuel (si tu vois quelque chose de faible)

Sois critique. On préfère "voici ce qui ne va pas" à "tout est parfait".
