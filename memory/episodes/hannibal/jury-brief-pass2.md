# Brief Jury Pass 2 — Hannibal / Traversée des Alpes — Validation lockdown

> Vous êtes membre d'un jury opérationnel. Pass 1 (vision créative) a déjà eu lieu. Aziz a trié les idées. Cette Pass 2 est une **validation go/no-go avec recettes techniques précises** AVANT qu'on code.
>
> SCRIPT + PALETTE VERROUILLÉS — ne reproposez pas de modifications.
> DÉCISIONS TOP 7 VERROUILLÉES — pas de remise en question.
> Votre rôle : **valider chaque recette** + **identifier pièges techniques** + **détecter gaps**.

---

## 1. Script V2 LOCKED (~1m35, 5 beats)

### Hook (5s)
> Quarante-six mille soldats entrent dans les Alpes. Vingt mille en ressortent. Quinze jours.

### Beat 1 — Contexte (12s)
> Nous sommes en deux cent dix-huit avant notre ère. Hannibal Barca, trente ans, commande l'armée carthaginoise en Espagne. Rome le cherche au sud. Il choisit le nord. Par les Alpes. En automne.

### Beat 2 — Le Rhône (18s)
> Avant même les montagnes, il y a le Rhône. Un fleuve large. Un courant violent. Trente-sept éléphants de guerre à faire traverser. Hannibal construit des radeaux de bois recouverts de terre. Les éléphants croient marcher sur une rive. Ils flottent sans le savoir. Mais sur l'autre rive, les Volques les attendent. Hannibal envoie sa cavalerie numide en amont, les prend à revers. Première victoire. Avant même les Alpes.

### Beat 3 — La montagne (25s)
> Puis vient la montagne. Les Allobroges contrôlent les cols. Ils attendent en hauteur, au-dessus des défilés étroits. Hannibal passe la nuit sur un rocher escarpé avec la moitié de son armée pour protéger la colonne. Au matin, les Allobroges reculent. Le col est libre. Mais la roche ne recule pas. Les chemins s'effondrent. Les bêtes glissent dans les précipices. Le froid tue ce que les tribus n'ont pas tué. Selon les chroniqueurs de l'époque, Hannibal fit chauffer des rochers et y versa du vinaigre pour ouvrir un passage. Après neuf jours de montée, le col est atteint. Hannibal arrête l'armée. Il leur montre l'Italie en contrebas. "Vous traversez les murs de Rome."

### Beat 4 — La descente (18s)
> La descente est pire. La neige fraîche recouvre la glace ancienne. Les éléphants basculent. Les chevaux refusent d'avancer. Six jours de descente. À l'arrivée dans la plaine du Pô : vingt mille fantassins. Six mille cavaliers. Trente-sept éléphants sont partis. Un seul est là.

### Beat 5 — Conséquence + CTA (15s)
> La moitié d'une armée a disparu dans la montagne. Et avec ce qui reste, Hannibal va remporter les trois plus grandes défaites de l'histoire de Rome. La Trébie. Le lac Trasimène. Cannes. En une seule journée à Cannes, cinquante mille soldats romains tombent. Pose-toi la question : avec une armée complète, qu'est-ce qu'il aurait pu faire ?

---

## 2. TOP 7 idées VERROUILLÉES (issues Pass 1 + triage Aziz)

| # | Idée | Priorité | Beat |
|---|------|----------|------|
| 1 | **Sprite-decay 37 éléphants** : grille de 37 icônes PixelLab (map_object 32px silhouette éléphant statique) qui s'éteignent opacity 100%→15% de droite à gauche, dernier pulse doré spring() | MUST HAVE | Beat 4→5 |
| 2 | **FocusBubble nuit sur le rocher** : zoom 1.45x + blur 3.5px sur Hannibal au sommet escarpé, allobroges en silhouette blur arrière-plan. Pattern `_shared/FocusBubble.tsx` existant. | MUST HAVE | Beat 3 |
| 3 | **Compteur numérique gros plan** : 46 000 → 20 000 en typographie large (JetBrains Mono), interpolate() sur la valeur, couleur or→rouge pendant la descente | MUST HAVE | Beat 4 |
| 4 | **Beat 3 en 4 sous-séquences** de ~6s : (1) col + Allobroges en hauteur ; (2) nuit rocher + FocusBubble ; (3) vinaigre + rocher + dutch tilt ; (4) dolly-out révèle Italie | MUST HAVE | Beat 3 |
| 5 | **Barre d'altitude HUD — apparition ponctuelle** : StatGauge vertical qui apparaît uniquement au moment du col ("Après neuf jours de montée") — grande, visible, pulse, puis disparaît. PAS permanente. | CONDITIONNEL | Beat 3 peak |
| 6 | **Dutch tilt + vibration vinaigre** : transform rotate(3-5deg) + spring() shake pendant 2-3s au moment "versa du vinaigre". Jamais utilisé en prod. | NICE TO HAVE | Beat 3 sub-3 |
| 7 | **Dolly-out révèle ITALIA** : interpolate() scale qui recule, label "ITALIA" + plaine du Pô apparaît en doré. Clôture Beat 4 | NICE TO HAVE | Beat 4 fin |

---

## 3. Décisions architecturales déjà arrêtées (NE PAS remettre en question)

### Projection carte Méditerranée
- **Option A + C combinées** : Hook = vue large contexte (5s), puis pan progressif sud→nord (Espagne→Alpes→Italie du Nord) via interpolate() sur translation d3-geo
- Projection Mercator standard, Natural Earth 50m
- Jamais de projection rotée (R&D non validée)

### Hook visuel
- **Deux versions à coder** : (A) fond noir + typographie cinématographique Remotion pur ; (B) carte dès le départ. Aziz choisit au visionnage.
- Version A : chaque ligne = flash + spring() opacity. SFX percussion sur chaque ligne.

### Silhouettes éléphants (idée #1)
- **DÉCISION FINALE** : PixelLab `create_map_object` 32×32px silhouette éléphant profil, fond transparent, style pixel art cohérent avec sprite principal
- Remotion gère grille + opacity par index + dernier pulse
- PAS de SVG éléphant complexe (capacité Claude insuffisante pour formes organiques)

---

## 4. Stack disponible

### Assets PixelLab déjà générés (lab)
- Hannibal infanterie 8 directions 64px
- Éléphant carthaginois 160×120px (statique + spritesheet dying 13 frames)
- Sprites lab (non production-ready — à refaire en qualité production)

### Composants Atlas réutilisables (`src/projects/atlas/_shared/`)
- `FocusBubble.tsx` (zoom 1.45 + blur 3.5 — validé Phase 1)
- `StatGauge.tsx` (jauges animées fromValue→toValue + hideRanges)
- `AtlasMercator` (d3-geo Mercator + Natural Earth)
- `AtlasPulseMarker`, `AtlasLabel`, `AtlasCaravane`

### Remotion patterns validés
- `interpolate()` continu pour pans/zooms (jamais segmenter)
- `spring()` pour mouvements naturels (damping 200 smooth, 20 snappy, 8 bouncy)
- `TransitionSeries` pour transitions entre beats
- Audio-derived timing (forced alignment ElevenLabs)

### PixelLab — règle critique
- `animate_object` (4-8 frames, description action) = fluide. Validé ville Koumbi + chameaux.
- `vary_object` = variations stylistiques, PAS animation fluide. NE PAS utiliser pour animer.
- Pipeline : animate_object → GIF → ffmpeg spritesheet PNG → Remotion clipPath

### Ce qu'on NE peut PAS faire
- SVG formes organiques complexes (silhouettes humaines/animales) — Claude = résultat bancal
- Animations fluides multi-états réalistes (Seedance serait nécessaire, pas disponible ici)
- Lottie > 10 vertices bezier / > 5 instances simultanées
- Projection d3-geo rotée non testée

---

## 5. Palette officielle VERROUILLÉE

```
MER              #1B3A52   océan, Méditerranée
TERRE            #C8B89A   terre continentale
CARTHAGE         #A8623A   territoire carthaginois, Hannibal
ROME             #5B4A6E   territoire romain (Beat 5)
ALPES            #D9E4ED   zone montagne
OR               #E6C76E   highlights, dernier éléphant pulse, labels victoire
BLANC_NEIGE      #F0F4F8   texte sur fond sombre, neige
ROUGE_PERTE      #8B2020   compteur de pertes, éléphants éteints
```

Typo : Cinzel (titres/labels carte), JetBrains Mono (compteurs), Inter (karaoke sous-titres)

---

## 6. 4 Questions Pass 2

### Q1. Validation idée par idée (OUI / NON / AMENDEMENT)
Pour chacune des 7 idées du Top 7, réponds :
- **OUI** (à coder telle quelle)
- **NON** (justifier — limite technique ou risque)
- **AMENDEMENT** (proposer modification précise)

Ne reproposez pas d'idées écartées. Validez ou amendez celles présentées.

### Q2. Implémentation concrète par outil
Pour chaque idée validée OUI/AMENDEMENT, propose une **recette technique** :
- Outils utilisés (PixelLab / d3-geo / SVG / StatGauge / FocusBubble / SFX)
- Timing beat (frames approximatifs si possible)
- Structure composant ou pseudocode si pertinent
- Effort estimé : grand / moyen / petit

### Q3. Beat 3 — 25s même zone géographique
Beat 3 est le plus long (25s) et se passe entièrement dans les Alpes — même zone. Les 4 sous-séquences sont validées. **Question concrète** : comment maintenir l'impression de progression géographique alors que la caméra reste sur la même zone ? Qu'est-ce qu'on peut animer sur la carte elle-même (pas juste les sprites) pour que ça ne paraisse pas figé ?

### Q4. Gaps et pièges

#### Q4a. Une 8e idée manquante ?
Y a-t-il **une seule idée** absente du Top 7 qui devrait absolument entrer en VAGUE 1 ? Max 1, justification courte. Si non, dire "rien à ajouter".

#### Q4b. 3 pièges techniques anticipés
Liste 3 pièges techniques précis qui pourraient bloquer cette production. Pour chacun : description + solution préventive.

---

## 7. Format de réponse attendu

```markdown
# Réponse [NOM LLM] — Hannibal Pass 2

## Note globale : X/10

## Q1. Validation Top 7
1. [OUI/NON/AMENDEMENT] — Sprite-decay 37 éléphants : [recette ou justif]
2. [OUI/NON/AMENDEMENT] — FocusBubble nuit rocher : [...]
3. [OUI/NON/AMENDEMENT] — Compteur 46k→20k : [...]
4. [OUI/NON/AMENDEMENT] — Beat 3 4 sous-séquences : [...]
5. [OUI/NON/AMENDEMENT] — Barre altitude ponctuelle : [...]
6. [OUI/NON/AMENDEMENT] — Dutch tilt vinaigre : [...]
7. [OUI/NON/AMENDEMENT] — Dolly-out ITALIA : [...]

## Q2. Implémentation concrète
[Pour chaque idée validée, recette technique]

## Q3. Beat 3 — progression géographique sans mouvement
[Réponse concrète]

## Q4a. 8e idée
[Réponse ou "rien à ajouter"]

## Q4b. 3 pièges techniques
1. [piège + solution]
2. [piège + solution]
3. [piège + solution]
```

Réponds en français. Opérationnel, concis. Pas de répétition du brief. Pas d'éloges. ~600-900 mots.
