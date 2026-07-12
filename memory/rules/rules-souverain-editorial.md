# Souverain — Règles éditoriales (consolidé)
> Fusion de : feedback_souverain-* (7 fichiers), feedback_grille-sources-3-niveaux, feedback_typeB-script-rules, feedback_storyboard-souverain-refs-or-africain
> Mis à jour : 2026-05-13 · Découpage 2026-06-25.
>
> **Contenu : sources · palette · éthique · angle · visuel · storyboard · sélection sujets.**
> **Règles SCRIPT & TITRE (sections 5, 7, 9) → `memory/rules/rules-souverain-script.md`** (acteurs, TTS, format Short vs Long, titre hybride, vulgarisation, 140 mots).
>
> **Extensions 2026-05-27 :**
> - **Angle Macro** (audit obligatoire à l'étape validation sujet) → [`ANGLE-MACRO-SOUVERAIN.md`](ANGLE-MACRO-SOUVERAIN.md)
> - **3 Templates Shorts validés** (planning visuel — A Géographe / B Hybride Or Africain / C Analyste) → [`out/SHOWCASES/templates-souverain/README.md`](../out/SHOWCASES/templates-souverain/README.md)

---

## SECTION 0 — Règle Visuelle Absolue (templates) — NON-NEGOTIABLE

> Origine : instruction Aziz 2026-05-13

**"La voix porte. Ce qui s'affiche à l'écran est visuel."**

### Application stricte à TOUS les templates Souverain

- **Texte à l'écran = erreur par défaut.** Chaque mot visible doit être justifié explicitement.
- **Maximum 1-2 mots par élément** : labels sous icônes, années sur timeline, edge labels sur arcs.
- **Jamais de phrase complète** dans un template. Les phrases appartiennent à la narration audio.
- **Icônes > texte** : si un concept peut être représenté par une icône Lucide, c'est l'icône qui parle, pas un mot.
- **Chiffres bruts plutôt que phrases** : "$4.2B" oui — "4,2 milliards de dollars" non.
- **Titres de template** : 1-2 mots max en haut (ex : "CHRONOLOGIE", "SUPERFICIE COMPARÉE"). Pas de sous-titres explicatifs.

### Ce qui est autorisé à l'écran
| Élément | Règle |
|---|---|
| Icône Lucide | Toujours préféré au texte |
| Chiffre/valeur | Max 6 caractères (ex: "17.4B", "80%", "1324") |
| Label noeud/barre | Max 2 mots, majuscules, monospace |
| Titre template | 1-2 mots Cinzel gold |
| Edge label sur arc | Chiffre + unité uniquement |
| Footer subtitle | 2-3 mots max, slate, tracking |

### Ce qui est interdit à l'écran
- Phrases descriptives (appartiennent à l'audio)
- Sous-titres explicatifs
- Sources/crédits (footer vidéo YouTube, pas à l'écran)
- Parenthèses, virgules, ponctuation narrative

---

## SECTION 0B — Règle Background Souverain (NON-NEGOTIABLE)

> Origine : instruction Aziz 2026-05-14

**Le background ne doit jamais concurrencer les composants posés dessus.**

### Règle fondamentale
Le background est une scène, pas une décoration. Son rôle : créer de la profondeur et du contexte. Il doit disparaître visuellement dès qu'un composant graphique, du texte ou une icône apparaît.

### Ce qui est autorisé
- **Dégradé uni** dans la palette navy/graphite : `#0d1420` → `#1a2035` (légèrement plus lumineux que noir pur) — NOTE : le fond navy standard (`bg-uni-navy`) = `#16213a` (source : _PALETTE-BACKGROUNDS.md)
- **Texture très subtile** (grain papier, métal brossé, bruit numérique) — visible uniquement si on cherche
- **Forme géographique très sous-exposée** (contour pays, carte topographique) à opacité <20%
- Couleurs : sombres et désaturées de préférence — mais toute teinte est acceptable si elle reste discrète et ne rivalise pas avec les éléments posés dessus

### Ce qui est interdit
- Éléments de la même couleur que les composants posés dessus (ex: background doré + texte doré = fusion)
- Pins, icônes, marqueurs lumineux, étoiles, particules visibles
- Couleurs saturées (bleu vif, cyan, vert, rouge)
- Tout élément qui attirerait le regard seul sans le texte

### Test de validation
> "Si je superpose du texte blanc/or sur ce background, est-ce que le background disparaît ?"
> Si non → trop fort → régénérer plus sombre/plus neutre.

### Instruction directe à Gemini (copier dans tout prompt storyboard)
```
BACKGROUNDS : dégradés sombres discrets uniquement. Palette #0d1420 à #1a2035. (fond navy standard = #16213a — source : _PALETTE-BACKGROUNDS.md)
Textures très subtiles autorisées (grain, brossé). INTERDIT : couleurs saturées,
pins/marqueurs lumineux, éléments graphiques visibles à distance. Le background
doit être illisible seul — il n'existe que pour donner de la profondeur.
```

---

## SECTION 1 — Grille sources 3 niveaux (ADN Souverain)

> Origine : pushback Aziz 2026-05-07. La grille "sources fiables vs biaisées" = grille colonialiste implicite. Toutes les sources sont biaisées. Distinguer biais (légitime) de mode opératoire douteux.

### Niveau 1 — Faits vérifiables
Croiser au moins 2 sources de camps différents :
- Mainstream international : AFP, Reuters, BBC, France 24, Al Jazeera, Le Monde, NPR
- Panafricain : Jeune Afrique, RFI Afrique, Africa Is a Country
- OSINT/technique : ACLED, Bellingcat, Africa Center for Strategic Studies, Chatham House
- Officiel : communiqués gouvernementaux, ONU

3 catégories convergent → fait solide, on l'affirme. 2/3 divergent → signaler la divergence. Aucune traçable → ne pas dire.

**Biais à connaître (pas à l'écran) :**
- AFP/France 24 : grille française, conflit ouvert avec junte malienne depuis 2022
- Al Jazeera : ligne Qatar variable
- ACLED/Bellingcat : biais de sélection de ce qu'ils trackent
- Tous médias d'État : alignés par construction

### Niveau 2 — Voix et narratifs
INCLURE largement, ÉTIQUETER systématiquement. Jamais relayer comme vérité. Format : "Le récit officiel malien parle de X. Le narratif panafricain met l'accent sur Y. Bellingcat n'a pas vérifié."

Légitimes ici : Maliactu, Mondafrique, Bamada.net, comptes panafricains, diaspora, communiqués des belligérants (cités comme tels).

### Niveau 3 — Sources à étiqueter avec précaution
Réseau `*.news-pravda.com` : clones automatisés, zéro journaliste identifiable. Utilisable comme OBJET D'ÉTUDE seulement. Comptes anonymes X/Telegram : citables seulement si convergence multiple ET étiquetage explicite "non vérifié, mais largement relayé".

---

## SECTION 2 — Couleurs narratives (règle nuancée)

**Règle :** Aucune couleur ne peut coder un jugement moral subliminal.
Les couleurs servent à identifier, différencier, évoquer narrativement. Jamais à dire "voici les méchants" sans le nommer.

**Usages autorisés :**
- Or pour Ghana (le sujet EST l'or — direct, pas subliminal)
- Drapeaux distincts par pays
- Couleurs vivantes évocatrices : or sourd `#b8893f` (héritage), terre cuite `#a05a3a` (racines), indigo `#3a4a6a` (mémoire), vert mande `#3d5a3a` (identité régionale)

**Usages interdits :**
- Rouge "agresseur" / doré "victime" sans nomination explicite
- Désaturer un acteur pour le coder "battu"
- Saturation/luminosité comme hiérarchie morale implicite

**Test "couper l'audio"** : couper l'audio et regarder uniquement les couleurs/compositions. Si on peut identifier les méchants/victimes sans un mot → grammaire visuelle défaillante. Refaire.

**Palette signature Souverain :**
| Usage | Hex |
|-------|-----|
| Océan Mapbox | `#03224c` |
| Terre neutre Mapbox | `#2a1e0e` |
| Frontières Mapbox | `#5a3e1e` |
| Glow positif / or sourd | `#b8893f` |
| Ivoire | `#d4c5a0` |
| Terre cuite | `#a05a3a` |
| Indigo | `#3a4a6a` |
| Vert mande | `#3d5a3a` |
| Texte principal | `#f0e8d8` |
| Texte secondaire | `#9a8e7a` |

---

## SECTION 3 — Grammaire audio/visuel Souverain

### Voix pour attribuer, visuel pour sourcer
- **Voix-off** : attribue les claims contestés — "Selon X", "X affirme que"
- **Overlay visuel discret** : sources institutionnelles (Oxfam, FMI, Bloomberg) — JAMAIS verbalisées
- Tout chiffre qui vient d'une seule partie d'un litige → attribué dans la VOIX (pas seulement en caption)

### Grammaire texte à l'écran — 3 rôles distincts
Tout texte à l'écran = l'un de ces 3 rôles (ne pas mélanger) :
1. **Localisateur** : pays, ville, date — positionnement contexte
2. **Headline** : texte narratif principal — impact visuel
3. **Caption** : sourcing discret — qui a dit ça

### Headline vs caption — règle clé
- Headline = chiffre/claim fort → style impactant, centré, gros
- Caption = source/attribution → style discret, coin écran, petit

### Overlays texte ne doublent JAMAIS les sous-titres karaoke
Si le texte est dans les karaoke → pas d'overlay texte redondant.
Si le texte est le visuel principal (plein écran) → pas de karaoke, le texte EST le message.
Un seul plein écran couleur par vidéo maximum — au-delà, l'effet perd sa force.

---

## SECTION 4 — Règles éditoriales Souverain (ADN)

### Citable n'est pas neutre
Tout chiffre venant d'une seule partie d'un litige doit être attribué EXPLICITEMENT dans la voix-off, même s'il est sourcé et vérifiable. La caption visuelle ne suffit pas pour les claims contestés.

### Symétrie d'humanisation
Sur tout dossier contentieux (État vs multinationale, pays vs pays) : si un camp a N détails concrets, l'autre camp doit en avoir N. Sinon couper. Aucune exception.

### Lien émotionnel vs exactitude intellectuelle
Si le lien émotionnel n'est pas intellectuellement solide, ne pas forcer. Reformuler avec précision ou couper. La résonnance émotionnelle qui repose sur une inexactitude = danger pour la crédibilité.

### Cohérence éthique > exhaustivité voice-over
Nommer dans la voix-off tout pays africain qui s'oppose à un autre pays africain. Marqueur rhétorique "et même" renforce le propos. Anti-piège partisan binaire Afrique vs Occident.

---

## SECTION 5 — Règles script Type B (Or Africain / data-journalism)

> Déplacé vers `memory/rules/rules-souverain-script.md` (acteurs explicites, TTS français, vulgarisation). Consulter ce fichier pour les règles script.

---

## SECTION 6 — Storyboard Souverain : Gemini i2i avec refs Or Africain (NON-NEGOTIABLE)

> NE JAMAIS générer un storyboard Souverain Mapbox sans refs Or Africain.

**Le problème sans refs** : Gemini produit du concept art 3D cinematic Netflix impossible à reproduire en Remotion + Mapbox. Coût perdu : ~$0.24 pour frames non-utilisables.

**Le pattern qui marche :**
1. Extraire 3 frames-refs depuis `out/or-africain/or-africain-FINAL.mp4` :
   - Frame zoom pays unique (ref pour highlight pays isolé)
   - Frame carte monde multi-pays (ref pour flux + globe pins)
   - Frame climax labels fade (ref pour traitement labels signature)
2. Mode Gemini `image-to-image` avec ref + prompt explicite : "Use reference as EXACT base style", "NO TEXT rendered", "Flat compositional graphics reproducible with Mapbox + Remotion"
3. Refs réutilisables dans `public/souverain/niger-uranium/assets/refs/`

**Résultat Niger V2 avec refs** : 6/6 frames livrables, style Or Africain reproduit.

---

## SECTION 7 — Règle Script-Format Fit (Short vs Long)

> Déplacé vers `memory/rules/rules-souverain-script.md` (test "image dans la tête", gate Short, mode de traitement, amputation). Consulter ce fichier.

---

## SECTION 11 — Architecture des 3 formats chaîne (rapatrié de rules-workflow-processus.md, archivé 2026-07-11)

| Format | Cadence | Audience | Rôle chaîne |
|--------|---------|----------|-------------|
| **Souverain Short (75-90s)** | 2/semaine | Casual + internationale | Carburant algorithme, test sujets |
| **Souverain Mid-form (3-5 min)** | 1/semaine | Sérieuse YouTube/Facebook | Approfondissement, CPM élevé (anciennement "Souverain Long" — renommé, voir `MIDFORM-FORMAT-RULES.md`) |
| **Atlas (8-15 min)** | 1/mois | Long-form, fidèles | Format pilier, authority builder |
| **Seedance Shorts (narratif)** | Selon dispo | Diaspora + grands récits | Série "Héros Oubliés" exclusivement — n'est PAS un concurrent de Souverain/Atlas, peut s'intégrer en insert dans Atlas mais ne remplace pas PixelLab |

Rôles distincts, ne pas intervertir.

---

## SECTION 10 — Profil Aziz & collaboration (rapatrié de rules-workflow-processus.md, archivé 2026-07-11)

**Aziz = orchestrateur et marketeur**, pas créateur de contenu activiste. Objectif premier : monétisation YouTube, croissance audience, revenus.
- Ne jamais sacrifier monétisation au militantisme dans les recommandations.
- Cadrer en termes d'audience, vues, croissance — pas seulement valeur éditoriale.
- Portée visée : au-delà de la diaspora africaine → francophone général + curieux d'histoire mondiale.
- Sujet éditorialement intéressant mais commercialement risqué → le dire explicitement.

**Règle collaboration (2026-05-03)** : après 1-2 tentatives ratées sur un même point → demander capture d'écran annotée ou clarification verbale, pas pivoter vers une 3e solution à l'aveugle.
- Capture d'écran : position visuelle, comportement temporel, mouvement caméra, différence subtile ("à quoi ça doit ressembler ?").
- Clarification verbale : choix entre options claires, validation décision risquée.
- Ne pas demander pour : décisions techniques évidentes, bugs résolvables, erreurs reproductibles.
- Format : "Je tente Y mais je ne suis pas certain de [aspect]. Peux-tu : screenshot avec flèche sur [endroit] OU confirmer [interprétation A] vs [B] ?"

**YouTube Shorts — durée max 3 minutes (180s), pas 60s.** La limite 60s est obsolète depuis octobre 2024. Cible recommandée Souverain : 75-130s (ne pas dépasser 150s sans raison narrative). Ne plus faire figurer "60s max" dans les briefs/manifests.

---

## SECTION 8 — Sélection sujets Souverain (critères go/no-go)

Critères de décision sur un sujet selon la mission de la chaîne :

**Go si :**
- Sujet dans le top 10% des volumes de recherche YouTube sur le créneau africain
- Audience potentielle vérifiable (trend Google Trends, vidéos concurrentes > 500K vues)
- Sujet avec gap francophone confirmé (anglophone well-covered, francophone sous-servi)
- Monetisable dans 6 mois (pas de sujet trop niche, pas de sujet trop chaud politiquement pour AdSense)

**No-go si :**
- Sujet exclusivement activiste (risque démonétisation, audience trop segmentée)
- Sujet pour lequel l'enjeu narratif ne peut pas être expliqué en 75s

**Perplexity fact-check OBLIGATOIRE après script lock** : avant TTS audio, lancer perplexity/sonar-pro via OpenRouter pour vérifier chaque fait + obtenir sources institutionnelles primaires. Coût ~$0.027 pour fact-check 8 affirmations.

---

## SECTION 9 — Règles script & titre (validées 2026-05-11)

> Déplacé vers `memory/rules/rules-souverain-script.md` (titre hybride, vulgarisation universelle, 140 mots, tests Tokyo/Nairobi/14ans, R-MOTIVATION-VISIBLE). Consulter ce fichier.
