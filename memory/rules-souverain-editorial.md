# Souverain — Règles éditoriales (consolidé)
> Fusion de : feedback_souverain-* (7 fichiers), feedback_grille-sources-3-niveaux, feedback_typeB-script-rules, feedback_storyboard-souverain-refs-or-africain
> Mis à jour : 2026-05-13
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
- **Dégradé uni** dans la palette navy/graphite : `#0d1420` → `#1a2035` (légèrement plus lumineux que noir pur)
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
BACKGROUNDS : dégradés sombres discrets uniquement. Palette #0d1420 à #1a2035.
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

### Acteurs explicites — jamais assumer
INTERDIT : "six gouvernements écrivent une lettre". CORRECT : "Les États-Unis, le Royaume-Uni et le Canada écrivent une lettre officielle au Ghana."

### Années en TTS français — toujours en lettres
- 2026 → "deux mille vingt-six"
- 1324 → "treize cent vingt-quatre"
Scanner TOUTES les années avant génération TTS.

### Compter les chiffres avant de les écrire
"Cinq pays" mais le script en liste 4 = erreur fatale. Lister les éléments et compter avant d'écrire le chiffre.

### Assumer que l'auditeur ne connaît pas le sujet
Chaque transition narrative doit expliquer POURQUOI, pas seulement QUOI.
- "Le message : arrêtez." → insuffisant
- Correct : "Le message : n'allez pas plus loin. Cette loi menace nos investissements."

Si une phrase commence par un nom propre sans contexte après un saut de beat, ajouter une demi-phrase de lien.

### Pauses TTS : max 2-3 par script de 75s
La Narratrice GéoAfrique v2 a un débit naturellement lent. Les pauses supplémentaires alourdissent sans valeur.

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

> Origine : post-mortem Niger uranium 2026-05-10. Script dense compressé en 90s = surcharge production + spectateur.

### Le test "image dans la tête"

**Avant de valider chaque phrase d'un script Short :**

> "Est-ce que cette phrase génère naturellement une image dans la tête, sans avoir besoin de lire un visuel ?"

- **Oui → Short** : la phrase évoque spontanément une image forte (désert, mineur, billet, mine, contraste visuel)
- **Non → Format Long** : la phrase demande un tableau, un organigramme, une liste ou un effort de décodage pour être comprise

### Gate de validation script Short (3 critères)

| Critère | Seuil Short | Si dépassé |
|---------|-------------|------------|
| Tensions narratives simultanées | max 2 | Couper ou passer en Long |
| Entités nommées (pays, orgs, personnes) | max 5 | Couper les entités périphériques |
| Thèse tient en 1 phrase ? | Oui obligatoire | Reformuler ou passer en Long |

### Mode de traitement — Short vs Long

| Marqueur documentaire (Long uniquement) | Marqueur Short Souverain |
|-----------------------------------------|--------------------------|
| Chiffres précis empilés (12%, $800M, 5%...) | 1 chiffre-choc max par beat |
| Enchaînements causaux explicites ("donc", "parce que") | Image + contraste (montrer, pas expliquer) |
| Noms d'entités qui demandent décodage (SOPAMIN, CEDEAO) | Nommer 1x, jamais répéter |
| Logique archiviste / chronologie exhaustive | Ironie, retournement, tension |

### Règle d'amputation pour scripts denses existants

Choisir **1 angle dominant** — couper le reste sans regret.

Les angles coupés ne sont pas perdus : ils deviennent des épisodes séparés ou du matériel Long.

**Exemple Niger uranium :**
- Angle retenu : ironie économique (pays parmi les plus pauvres / ressource mondiale critique)
- Coupé en Short : géopolitique France/Russie, chronologie des coups, CEDEAO, détails SOPAMIN

### Le Short Souverain idéal

3 coups de poing visuels + 1 retournement + 1 question qui reste.
Pas 7 beats de données. L'émotion d'abord, les chiffres au service de l'émotion — jamais l'inverse.

**Frames sans refs** (acceptables) : data-viz pure (timeline), métaphores abstraites (échiquier) → restent en t2i flat 2D.

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

### Règle du titre hybride (NON-NEGOTIABLE)

Reformuler tout sujet africain comme enjeu mondial — jamais comme affaire interne.

**Formule :** `[Objet mondial connu] + [Verbe d'action] + [Lieu africain précis]`

| Sujet brut | Titre diaspora (à éviter) | Titre hybride (cible) |
|-----------|--------------------------|----------------------|
| Nationalisation mine Niger | "Le Niger reprend sa mine" | "Pourquoi l'uranium du Niger menace l'énergie française" |
| Or Ghana royalties | "Le Ghana récupère son or" | "Comment le Ghana a forcé les mines à payer le double" |
| RDC cobalt | "Le cobalt africain exploité" | "Cette batterie Tesla vient d'ici — et ça change tout" |
| Abu Bakari II | "L'explorateur malien oublié" | "L'Atlantique avait déjà été traversé — preuve par les courants" |

**Pourquoi :** Le titre hybride attire audience internationale (CPM 3-5x plus élevé), évite l'étiquette militante, reste 100% factuel.

**Test de validation avant lock du titre :** "Est-ce que quelqu'un à Tokyo, Paris ou Montréal qui ne s'intéresse pas *a priori* à l'Afrique clique dessus ?" Si non → reformuler.

**OBLIGATOIRE — Appliquer AUSSI les règles techniques de format (2026-05-30) :**
Le Test Tokyo valide le PRINCIPE du titre. Les règles ci-dessous valident le FORMAT. Les deux couches sont obligatoires simultanément.

| Règle technique | Contrainte | Pourquoi |
|---|---|---|
| Longueur | Cible 50 car., max 55 | Troncature mobile à ~50 car. — au-delà invisible |
| Date dans le titre | INTERDITE | Pénalité -53% vues mesurée sur 60k vidéos |
| Chiffre | En unités quotidiennes | "9 centimes sur l'euro" > "9,2%" — +23% CTR niches éducatives |
| Tension | Binaire dans les 48 premiers car. | Friction cognitive = décision de clic |
| Formules mortes | INTERDITES | -34% CTR : "Ce qu'ils cachent", "La vraie raison de X", "Nobody talks about this" |

**Test de fusion (les deux couches) — avant tout lock :**
1. Test Tokyo : quelqu'un hors Afrique a une raison de cliquer ? → si non, reformuler
2. Longueur ≤55 car. ? → si non, compresser
3. Date calendaire présente ? → retirer
4. Tension binaire ou chiffre quotidien dans les 48 premiers car. ? → si non, réordonner

**Référence complète règles techniques :** `memory/templates/script-atlas-v1.md` Étape 0.6 + `memory/templates/script-ebauche-v1.md` Étape 0.6

**Titres validés session 2026-05-30 (exemples fusionnant les deux couches) :**
- "Ils ont libéré la France. Elle les a massacrés." (Thiaroye, 49 car.) ✅
- "Le Niger recevait 9 centimes sur l'euro depuis 53 ans" (Niger, 52 car.) ✅
- "Le pays qui a inventé le paiement mobile avant Apple" (Silicon Savannah, 52 car.) ✅
- "Les USA, la Chine et l'Europe tiennent dans l'Afrique" (Vraie Taille, 50 car.) ✅
- "16 millions d'habitants ont fait trembler Tesla" (Zimbabwe, 48 car.) ✅
- "Le Maroc détient 70% des batteries de demain" (Maroc Batteries, 43 car.) ✅

---

### Règle de vulgarisation universelle (NON-NEGOTIABLE — validée 2026-05-12)

> Origine : post-mortem script Zimbabwe lithium V1. Script lisible diaspora à 60%, audience hybride à 40%. Objectif inversé.

#### Test universel obligatoire après chaque V1 — avant présentation à Aziz

| Test | Question | Seuil |
|------|----------|-------|
| **Test Nairobi** | Un Kenyan qui ne connaît pas le Zimbabwe comprend l'enjeu ? | 100% |
| **Test Tokyo** | Un Japonais qui ne connaît pas l'Afrique a une raison de continuer à regarder ? | 100% |
| **Test 14 ans** | Chaque décision d'acteur expliquée sans jargon en moins de 10 mots ? | 100% |

Si un test échoue → reformuler ce passage avant de présenter.

#### Règle des motivations d'acteurs

Pour chaque acteur qui prend une décision dans le script, écrire mentalement : **"ils font ça parce que..."** en une phrase simple avec une analogie concrète.

- INTERDIT : "Le Zimbabwe a banni les exportations" sans motivation
- CORRECT : expliquer la logique en une phrase analogique — "comme vendre du blé et acheter du pain dix fois plus cher"

Si on ne peut pas formuler la motivation en une analogie simple → le passage ne peut pas rester dans un Short. Soit on le vulgarise, soit on le coupe.

#### R-MOTIVATION-VISIBLE (NON-NEGOTIABLE — validée 2026-05-12)

Pour chaque acteur qui agit dans le script, la réponse à "pourquoi il fait ça ?" doit être dans le script ou rendue inutile par le contexte. Si Claude ne peut pas la formuler en une phrase simple avant d'écrire la ligne — la ligne ne peut pas rester.

**Tableau obligatoire après chaque V1 — avant présentation à Aziz :**

| Acteur | Action dans le script | Motivation visible ? |
|--------|----------------------|---------------------|
| [Acteur 1] | [Ce qu'il fait] | Oui / Non / Implicite |
| [Acteur 2] | [Ce qu'il fait] | Oui / Non / Implicite |

Si une case est vide ou "Implicite" → soit ajouter la motivation en une phrase, soit retirer l'action du script. Ce tableau prend deux minutes et évite la majorité des itérations de clarification post-V1.

**Pourquoi :** Toutes les questions de clarification script reviennent au même point : "pourquoi cet acteur fait-il ça ?" Les règles existantes couvrent la structure, le langage, l'éthique — mais pas la visibilité des motivations. Un spectateur qui se pose "pourquoi ?" décroche. Un spectateur qui comprend instinctivement reste.

---

#### Règle du lien universel explicite

L'implication globale (segment 55-70s) doit nommer explicitement pourquoi quelqu'un à Paris, Tokyo ou Montréal est concerné — pas l'assumer. Le lien "cette batterie dans ta poche / ta voiture" doit apparaître avant la seconde 20, pas en fin de script.

---

### Règle des 140 mots (baseline, flexible)

**Baseline :** 140 mots maximum pour un Short 75-90s.
**Tolérance :** jusqu'à 170 mots si le sujet justifie la densité narrative (sujets juridiques/économiques complexes comme Niger uranium).
**Interdit :** dépasser 200 mots — la voix court après les visuels, l'image ne peut plus exister.

**Pourquoi :** À 250+ mots sur 90s, le rythme force la voix à accélérer et prive chaque visuel de son temps d'existence. Le script doit laisser des "silences visuels" — moments où l'image parle seule.

**Structure par segment (indicatif) :**
- Hook (0-4s) : 10-15 mots maximum — paradoxe chiffré, zéro contexte
- Tension (4-12s) : 20-25 mots — qui vs qui, sur quoi
- Démonstration (12-55s) : 70-80 mots — données, cartes, chiffres
- Implication globale (55-70s) : 20-25 mots — pourquoi ça compte ailleurs
- Question ouverte (70-80s) : 10-15 mots — force le commentaire
