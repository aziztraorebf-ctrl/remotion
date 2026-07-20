# Souverain — Règles script & titre (consolidé)
> Extrait de `rules-souverain-editorial.md` (sections 5, 7, 9) le 2026-06-25.
> Contient : règles script Type B · Script-Format Fit (Short vs Long) · titre hybride · vulgarisation universelle.
> **Règles éditoriales pures (sources, palette, éthique, angle) → `rules-souverain-editorial.md`.**

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

### Règle de densité mots (tranchée 2026-07-11 — aligné sur DOCTRINE-SCRIPT-UNIFIEE §Densité cible, source unique)

**Cible :** 150-180 mots total pour un Short 75-90s (100-120 mots/min).
**Interdit :** dépasser 200 mots — la voix court après les visuels, l'image ne peut plus exister.
> Ancienne baseline "140 mots" (2026-06-25) périmée — 3 fichiers donnaient 3 chiffres différents (140-170 ici,
> 180-216 dans le skill `souverain-preproduction`, 150-180 dans `DOCTRINE-SCRIPT-UNIFIEE.md`). Ce dernier fait
> foi : le plus récent, se déclare explicitement source unique, et sa math est cohérente en interne (mots/min × durée).

**Pourquoi :** À 250+ mots sur 90s, le rythme force la voix à accélérer et prive chaque visuel de son temps d'existence. Le script doit laisser des "silences visuels" — moments où l'image parle seule.

**Structure par segment (indicatif) :**
- Hook (0-4s) : 10-15 mots maximum — paradoxe chiffré, zéro contexte
- Tension (4-12s) : 20-25 mots — qui vs qui, sur quoi
- Démonstration (12-55s) : 70-80 mots — données, cartes, chiffres
- Implication globale (55-70s) : 20-25 mots — pourquoi ça compte ailleurs
- Question ouverte (70-80s) : 10-15 mots — force le commentaire
