# Manifeste Visuel : Un Pixel d'Histoire (v2.0 — Final)

> Source : co-produit par Aziz + Gemini + Kimi + Claude (2026-02-23) — v2.1 enrichi transcript Kimi
> Statut : REFERENCE ABSOLUE — s'applique a TOUTES les scenes et TOUTES les videos

---

## 0. PRINCIPE FONDAMENTAL (a lire avant chaque decision)

> **Chaque pixel doit justifier sa presence par la narration.**

Avant d'ajouter quoi que ce soit : "Que raconte cet element ?"
Avant de garder quoi que ce soit : "Est-ce que l'histoire fonctionne sans ?"

---

## 1. LA PROFONDEUR (Parallaxe Obligatoire)

| Couche | Vitesse | Contenu | Flou | Exemple concret |
|--------|---------|---------|------|-----------------|
| Arriere-plan | 0.2x | Ciel texture, montagnes lointaines, silhouettes | Non | Ciel beige avec nuages peints, montagnes violettes |
| Plan d'action | 1.0x | Maisons, personnages, sol | Non | Guillaume marche sur une rue pavee, maisons variees |
| Premier plan | 1.5x | Elements flous qui passent devant | Oui (leger) | Branche d'arbre, coin de mur, fumee qui defile |

Regles absolues :
- Aucune scene sans les 3 couches. Si une couche manque, la scene est invalide.
- Le premier plan doit masquer partiellement l'action 2-3 fois par minute.

---

## 2. DIRECTION ARTISTIQUE (Manuscrit Medieval Vivant)

### 2.1 Textures obligatoires

| Element | Texture | Rendu visuel attendu |
|---------|---------|---------------------|
| Fond beige | Grain de parchemin | Papier vieilli, irregulier, pas d'aplat numerique |
| Toits rouges | Variation de teinte legere | Certains oranges, certains bruns, uses par le temps |
| Pierres des murs | Texture de craie ou fusain | Traits irreguliers, pas de lignes parfaites |
| Ciel | Aquarelle diluee | Degrades doux, pas de couleurs plates |

### 2.2 Ancrage au sol (Anti-flottement)

Tout personnage et batiment doit projeter une ombre portee sur le sol :
- Opacite : 20-30% (jamais 100%)
- Flou : leger (pas de bord net)
- Direction : identique dans toute la scene (soleil fixe)

### 2.3 Architecture (Anti-repetition)

- Interdiction de dupliquer plus de 2 fois le meme asset sans variation majeure (echelle, couleur, etat)
- Jamais deux maisons identiques cote a cote
- Maisons "propres" interdites dans une ville touchee par la peste (signes de degradation obligatoires)

---

## 3. PERSONNAGES (Coherence Absolue)

### 3.1 Personnages nommes = composant dedie

Les 6 personnages nommes ont chacun un composant dedie dans EnlumCharacters.tsx :
Guillaume, Martin, Agnes, Pierre, Isaac, Renaud

- Utilisation de `EnlumCharacter type="noble"` ou autre generique = INTERDIT pour ces 6 personnages
- Tout cycle d'animation (marche, fuite) doit etre cree pour le design valide, pas un substitut generique

### 3.2 Cycles d'animation autorises

| Action | Intention narrative | Exemple |
|--------|---------------------|---------|
| Marche normale | Deplacement calme | Guillaume arrive a Florence |
| Marche rapide | Urgence, peur | Fuite des refugies |
| Tremblement | Maladie, fievre | Victime de la peste |
| Recul | Horreur, repulsion | Guillaume voit un cadavre |
| Immobile (respiration) | Attente, contemplation | Guillaume ecoute le narrateur |

Regle : Aucune animation en boucle de plus de 4 secondes sans variation ou coupure.

---

## 4. HIERARCHIE VISUELLE & UI (Discretion Totale)

### 4.1 Portrait narrateur

| Situation | Traitement | Duree max |
|-----------|------------|-----------|
| Introduction | Fondu, 20% opacite | 3 secondes |
| Pendant l'action | Cache ou 10% opacite | N/A |
| Retour narration | Reapparition fondu | 2 secondes |
| Transition | Disparition fondu | 1 seconde |

### 4.2 Gestion des textes

Structure de transition : Texte A visible -> [Fade out 0.5s] -> [Pause 0.3s] -> [Fade in Texte B 0.5s]

Interdictions :
- Deux textes visibles simultanement
- Texte qui chevauche un graphique
- Texte qui apparait avant que la voix ne le dise

### 4.3 Elimination du bruit visuel

Un element qui ne sert pas la narration pendant plus de 3 secondes doit etre supprime ou transforme.
Exemple : un personnage decoratif devient indicateur de progression ou disparait.

---

## 5. DONNEES & GRAPHIQUES (Dynamisme Constant)

### 5.1 Contrat visuel obligatoire (toutes scenes > 10 secondes)

AVANT de coder toute scene, produire ce tableau :

| Frames | Duree | Visuel affiche | Ce qui change |
|--------|-------|----------------|---------------|
| 0-90 | 3s | Village, parallaxe | Batiments apparaissent en fade |
| 91-180 | 3s | Village + Guillaume | Guillaume entre a droite |
| ... | ... | ... | ... |

**Si "Ce qui change" = "rien" pour une ligne -> BLOCAGE. Le code ne commence pas avant correction.**

### 5.2 Regles graphiques

- Jamais plus de 5 secondes sans nouveau mouvement visible
- Chaque chiffre mentionne par la voix = animation visuelle associee (barre qui monte, chiffre qui grossit)
- Si la voix parle de "fuite", la camera bouge (meme lentement)

### 5.3 Effet Ken Burns (moments statiques obligatoires)

Structure : zoom lent + deplacement lateral
Vitesse : 5% d'agrandissement sur 10 secondes
Direction : selon la narration (zoom in = importance, zoom out = recul)

---

## 6. TRANSITIONS (Anti-Popping)

| Nom | Description | Duree | Usage |
|-----|-------------|-------|-------|
| Fade | Fondu enchaine | 0.5-1s | Changement de scene standard |
| Slide | Glissement lateral avec easing | 0.8s | Deplacement geographique |
| Draw | Dessin progressif du trait | 1-2s | Apparition de carte, texte |
| Reveal | Devoilement par masque | 0.6s | Decouverte, revelation |

Interdiction du popping : tout element entrant doit utiliser l'une de ces transitions.
Easing obligatoire : ease-out pour l'entree, ease-in pour la sortie. Duree minimum : 0.3s.

---

## 7. RYTHME EMOTIONNEL (Montee et Descente)

Structure de sequence recommandee :
```
[INTRO CALME : donnees, carte, explication]
      -> [trigger : evenement dramatique]
[TENSION : fuite, action, rythme rapide]
      -> [trigger : consequence]
[RESOLUTION : donnees, constat, reflexion]
      -> [transition]
[Nouveau cycle]
```

| Type de sequence | Duree max | Elements visuels |
|------------------|-----------|------------------|
| Statique (data, carte) | 15 secondes | Zoom, apparitions progressives |
| Dynamique (action) | 20 secondes | Parallaxe rapide, mouvements multiples |
| Contemplative (emotion) | 10 secondes | Lent, espace vide, un seul element |

Interdiction : jamais deux sequences statiques consecutives. Jamais plus de 25 secondes sans changement de rythme.

---

## 8. INTENTIONNALITE DU MOUVEMENT

Chaque animation de personnage doit repondre a : "Que ressent-il ou que fait-il narrativement ?"

Interdiction des animations de remplissage sans cause narrative.
- Valides : tremblement de peur, recul de degout, acceleration de la fuite
- Invalides : oscillation repetitive sans cause, marche sur place sans progression

---

## 9. CHECKLIST DE VALIDATION (avant export)

### 5 questions d'auto-evaluation (repondre AVANT de declarer une phase terminee)

1. Profondeur : Les couches sont-elles visuellement distinctes ?
2. Hierarchie : Chaque element a-t-il une fonction narrative claire ?
3. Coherence : Les personnages correspondent-ils au design valide ?
4. Camera : Le mouvement sert-il l'emotion ou est-il decoratif ?
5. Ambiance : La palette evolue-t-elle avec le recit ?

Si une reponse est "non" ou "partiellement" -> corriger avant de passer a la suite.

### Par scene :
- [ ] Les 3 couches de parallaxe sont presentes et distinctes
- [ ] Aucun element ne flotte (ombres presentes)
- [ ] Aucune maison dupliquee sans variation majeure
- [ ] Les personnages correspondent au referentiel valide (composant dedie)
- [ ] Chaque animation a une intention narrative claire
- [ ] Le portrait/UI ne masque pas l'action principale
- [ ] Les transitions utilisent l'easing (pas de popping)
- [ ] Les donnees restent visuellement dynamiques (max 5s statique)
- [ ] Le rythme varie (pas deux sequences calmes d'afilee)
- [ ] Le Contrat Visuel a ete produit avant le code (tableau frames/visuel/changement)

### Video complete :
- [ ] La palette reste coherente (manuscrit medieval)
- [ ] Les personnages sont reconnaissables d'une scene a l'autre
- [ ] Aucun element visuel n'est present "parce que c'etait la"

---

## 10. CRITERES DE REJET AUTOMATIQUE (pour le Reviewer — BLOCANTS)

Une scene obtient automatiquement un score <= 3/10 si elle contient au moins un des elements suivants.
Ces criteres ne sont pas des malus — ils invalident la scene.

| Critere bloquant | Detection |
|-----------------|-----------|
| Meme visuel sans changement pendant > 10 secondes | Comparer frames t et t+10s |
| Deux textes visibles simultanement | Observable directement |
| Personnage nomme ne correspond pas a son composant dedie | Comparer avec Section 3 |
| Element present sans reponse a "que raconte-t-il ?" | Jugement narratif |
| Apparition en popping (0 -> 100% opacite en 1 frame) | Observable directement |

Score force <= 3 = retour a Claude pour correction AVANT tout autre feedback.

---

## 11. EXEMPLES DE VALIDATION / INVALIDATION

### INVALIDE (a rejeter)

> Scene : Une rue avec 4 maisons identiques. Guillaume marche sur place. Le portrait GB en haut a gauche a 100% opacite. Un graphique apparait et reste 40 secondes. Les maisons n'ont pas d'ombres.

Pourquoi : Repetition, pas de parallaxe, popping du graphique, statisme excessif, flottement.

### VALIDE (a accepter)

> Scene : Rue avec 3 couches (ciel nuageux, maisons variees avec ombres, branche d'arbre au premier plan). Guillaume (composant dedie) marche avec intention (fuite). Le portrait est absent ou a 10% opacite. Transition vers une carte avec zoom lent et villes qui apparaissent progressivement.

Pourquoi : Profondeur, coherence, dynamisme, discretion UI, pacing respecte.

---

## 12. REGLE DU 70% (Sweet Spot Complexite/Impact)

### Principe

Chaque proposition technique doit maximiser : [Impact visuel] / [Complexite technique]

Ne jamais viser 100% (film d'animation = trop complexe). Viser 70-80% (sweet spot livrable et maintenable).

### Echelle de decision

| Zone | Description | Decision |
|------|-------------|----------|
| 90-100% | Film d'animation | Refuser, simplifier |
| 70-80% | Sweet spot | Accepter, c'est la cible |
| 50-60% | Fonctionnel | Accepter si delai court |
| < 50% | Brouillon | Refuser, ameliorer |

### Table de traduction 70%

| Demande "100%" | Proposition "70%" |
|---------------|-------------------|
| Vagues ondulantes | Lignes horizontales qui defilent |
| Reflet synchronise | Pas de reflet, ou reflet statique |
| Texte qui compte | Texte qui fade-in |
| Stroke animation | Fade-in ou slide simple |
| 5 couches parallaxe | 3 couches parallaxe |
| 10 particules | 3-4 particules |
| Suivi camera intelligent | Panning constant |
| Morphing de path | Translation/rotation/scale uniquement |
| Expressions faciales | Posture du corps pour l'emotion |

### Criteres de validation 70%

Une proposition est dans la zone 70% si :
- Implementable en moins de 2 heures par phase
- Maintenable sans documentation externe
- Si ca casse, peut etre supprime sans casser la scene
- Pas de synchronisation entre plus de 2 elements
- Pas d'animation de path (morphing)

---

## 13. REGLE EFFECTSLAB (Prototype avant production)

### Principe

Avant d'implementer une technique visuelle dans une scene de production, verifier si elle a ete prototypee dans EffectsLab.tsx.

- **Technique connue (dans EffectsLab)** : utiliser le code existant directement. Pas de reimplementation.
- **Technique inconnue** : tester dans EffectsLab d'abord, valider, puis integrer en production.

C'est la mise en pratique de la Regle du 70% : les effets d'EffectsLab sont pre-valides dans la zone 70%.

### Effets disponibles (10 segments, 3000 frames)

| Segment | Frames | Effet |
|---------|--------|-------|
| Seg 1 | 0-299 | Baseline SVG pur (reference) |
| Seg 2 | 300-599 | Grain anime + Fumee SVG |
| Seg 3 | 600-899 | spring() physique sur personnages |
| Seg 4 | 900-1199 | Stroke-dasharray (dessin progressif) |
| Seg 5 | 1200-1499 | Vignette + source lumineuse directionnelle |
| Seg 6 | 1500-1799 | Split-screen enluminure / gravure |
| Seg 7 | 1800-2099 | Lottie smoke vs SVG smoke |
| Seg 8 | 2100-2399 | Animation marche Math.sin() |
| Seg 9 | 2400-2699 | Carte propagation + cercles |
| Seg 10 | 2700-2999 | Micro-expressions |

Fichier : `src/projects/style-tests/EffectsLab.tsx`

### Contrat Visuel + SCENE_TIMING

Le Contrat Visuel (tableau frames/visuel/changement) doit utiliser les memes frames que SCENE_TIMING comme reference. Si SCENE_TIMING existe pour la scene, les colonnes "Frames" du Contrat Visuel doivent s'aligner sur ses segments.

---

## 14. REGLE DES CONTRATS COURTS (Process obligatoire)

### Le probleme qu'elle resout

Sans cette regle, Claude genere les 4 phases d'un coup "pour aller plus vite". La validation entre phases devient impossible.

### Format du contrat

Chaque phase = un contrat court avec :
1. Une tache unique et precise
2. Un livrable testable
3. Une phrase de blocage explicite

Exemple :
> "Genere UNIQUEMENT la Phase 1 : les 3 couches de parallaxe avec panning. Ecris 'PHASE 1 TERMINEE — ATTENTE VALIDATION' a la fin. Ne propose pas la Phase 2."

### Quand utiliser les Contrats Courts

| Situation | Approche |
|-----------|----------|
| Nouvelle scene complexe | Contrats courts obligatoires (4 phases) |
| Scene similaire a une existante | Framework general + 3-4 ajustements |
| Fix ponctuel | Correction directe, pas de phases |
| Data viz simple | Checklist rapide, pas de phases |

### Sequence standard des phases

1. ENVIRONNEMENT : ciel, maisons, sol, camera, parallaxe — validation capture ecran
2. PERSONNAGES : Guillaume + figurants + ombres — validation lisibilite des poses
3. ATMOSPHERE : lumiere evolutive, particules (max 4), flou premier plan — validation emotion
4. FINITION : zoom narratif, objets narratifs, transition finale — validation flux global

---

## 15. LEXIQUE

| Terme | Definition dans ce projet |
|-------|---------------------------|
| Popping | Apparition/disparition instantanee sans transition. Interdit. |
| Easing | Acceleration/deceleration naturelle d'un mouvement. Obligatoire. |
| Parallaxe | Deplacement a vitesses differentes selon la profondeur. 3 couches minimum. |
| Manuscrit vivant | Style global : textures de papier, traits irreguliers, pas de vectoriel parfait. |
| Intention narrative | Raison storytelling d'un mouvement ou element. Chaque chose doit en avoir une. |
| Contrat Visuel | Tableau frames/visuel/changement a produire AVANT de coder toute scene >10s. |
| Bloquant | Critere dont la presence force le score reviewer <= 3/10, scene invalide. |
| Regle du 70% | Sweet spot impact/complexite. Viser 70-80%, jamais 100% (trop complexe). |
| Contrat court | Tache unique par phase avec phrase de blocage. Empeche Claude de tout generer d'un coup. |
| MVD | Minimum Viable Direction : 4 regles minimales pour un projet connu. Equivalent du Pilier framework leger. |
