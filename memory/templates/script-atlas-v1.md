# Template Script — Atlas V1 (méthode validée 2026-04-27)

> Méthode reproductible pour ecrire la V1 d'un script Short axé géographie / richesse-record / comparaisons d'échelle.
> Distincte de `script-ebauche-v1.md` (qui couvre les sujets narratifs Heros Oubliés).
> Validée sur brouillon Mali (Mansa Moussa) + Tombouctou.
> Inspirée du style "Jacques a dit" + "César Culture G" mais avec signature propre Géoafrique.

---

## Pourquoi Atlas existe (vs ebauche-v1)

`script-ebauche-v1` excelle sur les sujets **narratifs incarnés** (Sonjata épopée, Thiaroye tragédie, Abou Bakari voyage). Le ton est conte oral, l'émotion vient de l'incarnation.

Mais quand le sujet est **richesse-record / géographie / comparaison d'échelle** (Mali XIVe, taille Afrique, Lac Tchad, Tombouctou bibliothèques), le registre conte écrase la matière première : les chiffres mis en perspective. Il faut un autre rythme.

**Atlas est ce rythme.** Densité Cesar pure, pivots géo, registre didactique chaleureux, signature visuelle Mapbox custom + Paper-Craft inserts.

---

## Quand utiliser Atlas vs ebauche-v1

| Type de sujet | Template à utiliser |
|---------------|---------------------|
| Empires africains avec chiffres records (or Mali, savoir Tombouctou) | **Atlas** |
| Vraie taille / projection cartographique / comparaison continent | **Atlas** |
| Géographie physique (Lac Tchad, Sahara, fleuves) | **Atlas** |
| **Mécanisme géo historique (épidémie, route commerciale, barrière naturelle)** | **Atlas — sous-type "géo mécaniste"** |
| Inventions précoloniales avec dates et faits chiffrés | **Atlas** |
| Démographie / économie historique | **Atlas** |
| Épopée mythique fondatrice (Sonjata, Chaka) | ebauche-v1 |
| Actualité grave / tragédie / scandale (Thiaroye) | ebauche-v1 |
| Portrait intime (femme oubliée, savant) | ebauche-v1 |
| Voyage / exploration (Abou Bakari II, Ibn Battuta) | ebauche-v1 |

**Règle** : si le sujet **vit dans les chiffres**, c'est Atlas. Si le sujet **vit dans une histoire incarnée**, c'est ebauche-v1.

---

## Les 9 étapes Atlas

### Étape 0 : Contraintes de départ

Avant toute écriture :
- **Durée cible** (60-90s pour Short, 4-6 min pour long format)
- **Sujet + angle précis** (pas "Mali" mais "L'or du Mali qui a fait s'effondrer l'économie égyptienne")
- **Style visuel** Mapbox custom (sépia paper-craft / parchemin Mande / monochrome éditorial)
- **Voix** Narrateur GeoAfrique v2 (didactique chaleureux, pas blagueur)
- **CTA cible** (newsletter, abonnement chaîne, série)

### Étape 0.5 : Phase fact-check PRÉ-ÉCRITURE (NOUVEAU vs ebauche-v1)

**A. Validation chaleur du sujet** (Last30Days quick) :
- Y a-t-il une demande actuelle ?
- Quels angles sont saturés ? (à éviter)
- Quels angles manquent ? (notre opportunité)
- Y a-t-il un événement actu chaud lié ? (ex: Togo ONU 15 avril 2026)

**B. Vérification concurrence directe** (yt-dlp) :
```bash
yt-dlp --flat-playlist --print "%(duration)s %(view_count)s %(upload_date)s %(title)s" \
  "ytsearch5:<sujet exact en français>"
```
Si quelqu'un a publié dans les 30 derniers jours avec angle quasi-identique → repenser angle.

**Décision documentée** dans le manifest :
```json
{
  "fact_check_pre_ecriture": {
    "last30days_run": "2026-04-27",
    "thermal_signal": "high|medium|low",
    "saturated_angles": ["..."],
    "open_angles": ["..."],
    "actu_hook": "Togo ONU avril 2026",
    "competition_check": "no direct overlap last 30d"
  }
}
```

### Étape 0.6 : Formule de titrage (ajoutée 2026-05-30, learning MDVL_mindset)

Le titre est une mécanique de distribution algorithmique. Pour les sujets Atlas (données, géo, économie), les 4 patterns classés par efficacité Souverain économique :

| Pattern | Principe | Exemple Atlas/Souverain |
|---------|----------|-------------------------|
| **Pont anachronique** | [sujet africain] + [tension contemporaine universelle] | "Comment le Niger a financé l'énergie française pendant 53 ans" / "Ce que le Sénégal sait que Wall Street ignore" |
| **Titre-contradiction** | Renverser une croyance sur les ressources africaines | "L'uranium africain n'enrichit pas l'Afrique" / "Tu te trompes sur qui profite du pétrole sénégalais" |
| **Défi 2e personne** | Mise en jeu directe du viewer | "Tu ne réalises pas à quel point l'Afrique finance l'Occident" / "Ce que tu crois savoir sur les contrats pétroliers est faux" |
| **Mot-clé émotionnel CAPS** | Emphase vocale sur le twist central | "Le Sénégal a signé. Et a TOUT perdu." / "Mali était PLUS riche que l'Europe" |

**Règle prioritaire** pour les sujets géopolitiques/économiques (Niger uranium, Sénégal pétrole, Maroc batteries) : le pont anachronique est le pattern le plus fort — il ancre la problématique africaine dans une question que le viewer se pose déjà sur son propre monde.

**Différence avec ebauche-v1** : les sujets Atlas supportent des titres plus directs sur les inégalités économiques car la base factuelle est vérifiable et chiffrée — pas de risque de romantisation.

### Règles empiriques titres (données 2025-2026 — NON-NEGOTIABLE)

Issues d'études sur 60 000 à 800 000 vidéos YouTube. Pas des opinions — des mesures.

1. **Zéro date dans le titre** — Les titres avec une année (ex: "en 2007", "depuis 1944") reçoivent 53% moins de vues médianes. La date vieillit le titre, l'algorithme le distribue moins au fil du temps. Les dates vont dans la description ou les captions visuelles.

2. **Cible 50 caractères, maximum 55** — La longueur de titre suit une courbe monotone : plus court = mieux distribué + mieux affiché mobile. La plage 60-70 caractères = déjà -59% de performance vs un titre sous 20 caractères. Chaque mot inutile coûte de la distribution.

3. **Chiffre précis en unités quotidiennes** — Les titres avec un chiffre précis surperforment de 23% dans les niches éducatives (VidIQ 2025). Mais le chiffre doit être en unités compréhensibles physiquement : "9 centimes sur l'euro" pas "9,2%". "16 millions d'habitants" pas "petit pays africain".

4. **Tension binaire courte en priorité** — Deux faits opposés dans le même titre battent la formulation descriptive. Format : "[Fait A]. [Fait B contradictoire]." ou "[Entité A] a [action]. [Entité B] a [action contraire]." Zéro terme à décoder pour le viewer.

5. **Formules mortes à proscrire** — Ces patterns ont chuté de 34% en CTR entre 2023 et 2025 et signalent du contenu conspirationniste qui tue la crédibilité éducative :
   - "Nobody talks about this"
   - "What they're hiding" / "Ce qu'ils cachent"
   - "The real reason X" / "La vraie raison de X"
   - "What nobody tells you" / "Ce qu'on ne te dit pas"
   - "They don't want you to know" / "Ils ne veulent pas que tu saches"
   - Titres en ALL-CAPS intégral

**Test rapide avant de valider un titre :** (1) contient une date ? → retirer. (2) dépasse 55 caractères ? → compresser. (3) contient une des formules mortes ? → réécrire. (4) les deux faits en tension sont-ils dans les 48 premiers caractères ? → sinon réordonner.

**Anti-pattern absolu** : "Le pétrole du Sénégal", "L'uranium nigérien" — titre descriptif = invisibilité algorithmique + double audience ratée.

**OBLIGATOIRE — Appliquer AUSSI la règle du titre hybride (Section 9 de `memory/rules-souverain-editorial.md`) :**
Les règles techniques ci-dessus valident le FORMAT. La règle hybride valide le PRINCIPE. Les deux sont obligatoires simultanément.
Résumé règle hybride : tout titre doit passer le **Test Tokyo** — "quelqu'un à Tokyo/Paris/Montréal qui ne s'intéresse pas à l'Afrique a une raison de cliquer ?" Si non → reformuler avec ancrage mondial.
Exemples fusionnant les deux couches : "Le Niger recevait 9 centimes sur l'euro depuis 53 ans" ✅ — "Le pays qui a inventé le paiement mobile avant Apple" ✅ — "Le Maroc détient 70% des batteries de demain" ✅

**Documenter dans le manifest** :
```json
{
  "titre_choisi": "...",
  "pattern_applique": "pont-anachronique | titre-contradiction | defi-2e-personne | caps-emotionnel",
  "double_audience_ciblée": "passionné géopolitique | grand public question contemporaine"
}
```

### Étape 1 : Découpage en 6 segments (structure Atlas fixe)

Pour un Short 80-90s :

| # | Beat | Durée | Mots cible | Rôle |
|---|------|-------|------------|------|
| 0 | Hook | 4-6s | 10-14 | Affirmation choc + chiffre/durée précise |
| 1 | Setup géographique | 12-15s | 26-32 | Contexte spatio-temporel + ouverture |
| 2 | Densité Cesar (pic) | 16-20s | 38-46 | 3-4 stats en cascade |
| 3 | Climax événementiel | 14-18s | 32-40 | LE moment marquant + chiffres dramatiques |
| 4 | Conséquence | 10-14s | 22-30 | Effet domino, "et donc..." |
| 5 | CTA antithèse | 6-10s | 14-20 | Tu direct + invitation savoir |

**Règle climax** : entre 35% et 50% du Short.
**Règle équilibre** : pré-climax ≥ post-climax (sinon le spectateur swipe).

**Note sur l'ordre émotionnel (learning MDVL_mindset 2026-05-30)** : ne pas ouvrir par la donnée brute ou le contexte historique. Pour les sujets géopolitiques/économiques, la structure émotionnellement efficace est :
1. **Situation absurde ou conséquence humaine** (hook) — "Il y a 1 300 tonnes d'uranium bloquées dans le désert. Elles valent 250 millions. Personne ne peut y toucher."
2. **Contexte minimal** (setup) — qui, où, quand en 2-3 phrases
3. **Mécanisme** (densité Cesar) — comment c'est arrivé, les chiffres
4. **Conséquence** — l'effet domino
→ Ne jamais ouvrir par "En 1968, le Niger signait un accord..." — l'ordre chronologique anesthésie. Réserver la chronologie au segment Setup (segment 1), jamais au Hook (segment 0).

### Étape 2 : Écriture première passe segment par segment

- **Densité cible** : 2.0-2.4 mots/s (plus lent qu'ebauche-v1 car la densité Cesar demande respiration)
- **Phrases courtes** (3-7 mots majoritaires)
- **Pivots Atlas** à utiliser (voir étape 6)
- **Sources implicites** : tous les chiffres doivent être vérifiables (pas d'approximation)
- **Une stat centrale, en unités de vie quotidienne (learning MDVL_mindset 2026-05-30)** : identifier LA stat qui résume tout le sujet. La convertir en unité physique ou quotidienne compréhensible immédiatement. Ex: "neuf centimes sur l'euro reviennent au Niger" plutôt que "le taux de redevance est de 9,2%". Ex: "la valeur d'un immeuble de sept étages pour chaque kilomètre de pipeline" plutôt que "280 000 dollars par kilomètre". Les autres chiffres passent en captions visuelles, pas en narration. Règle : **1 stat centrale parlée + stats secondaires visuelles**.
- **Termes techniques : jamais seuls (jury LLM 2026-05-30)** : les acronymes et termes spécialisés (LFP, OCP, cathodes, fer-phosphate, redevance ad valorem, etc.) ne s'utilisent en voix-off que de deux façons — soit remplacés par leur description fonctionnelle ("le géant public marocain des phosphates", "batteries nouvelle génération"), soit introduits avec leur définition inline la première fois ("L'OCP — le géant public marocain des phosphates —"). Jamais balancés seuls sans contexte. Les sujets économiques/géopolitiques chiffrés sont particulièrement exposés à ce risque.
- **Conditionnel en hook : ancre temporelle obligatoire (jury LLM 2026-05-30)** : "sortira peut-être d'ici" en première phrase = le viewer perçoit le sujet comme hypothétique, il ne s'investit pas. Si un conditionnel est nécessaire dans le hook, le précéder d'une ancre temporelle précise qui crée la certitude de calendrier. ❌ "sortira peut-être d'ici" → ✅ "Dans deux ans, sortira peut-être d'ici" ou ✅ "est en construction" / "sort de terre" (présent réel).

### Étape 3 : Critique proactive Claude

Avant validation Aziz, Claude signale :
- Densité anormale (>2.6 mots/s = trop tight)
- Plus de 12 stats pour un Short = saturation cognitive
- Climax mal placé
- Pivots Atlas absents (script trop "ebauche-v1")
- Tu direct >3 fois = trop intrusif
- Phrases avec ambiguïté chiffrée ("environ", "à peu près")

### Étape 4 : Fact-check POST-BROUILLON (chiffres précis)

Pour chaque chiffre cité :
- Source primaire identifiée (Britannica, UNESCO, peer-reviewed, archives)
- **Perplexity Pro 1 appel ponctuel** si doute (pas systématique, coût maîtrisé)
- Stockage JSON `<projet>-fact-check.json` à côté du manifest

Format :
```json
{
  "claims": [
    {
      "id": "claim-001",
      "text": "Mali produisait 50% de l'or mondial au XIVe siècle",
      "scene": 2,
      "source": "UNESCO World Heritage / Britannica Mali Empire",
      "source_url_or_doc": "...",
      "verified": true,
      "verification_method": "manual|perplexity_pro|both",
      "verification_date": "2026-04-27"
    }
  ]
}
```

**Règle** : si Claude ne trouve pas de source primaire, chiffre supprimé ou reformulé en "estimé".

### Étape 5 : Pas de ponts narratifs (différence avec ebauche-v1)

Atlas ne dépend PAS de ponts d'objet entre scènes (puisque la matière est chiffrée, pas incarnée).
**Continuité visuelle** = palette Mapbox custom + style Paper-Craft inserts cohérent + chapter badges.

### Étape 6 : Pivots Atlas (à injecter)

Phrases-pivot validées à utiliser :

1. **"Et il a un secret"** / **"Et voici ce qu'on ne te dit pas"** — fin du setup, ouverture vers chiffres
2. **"Mais le moment qui marque l'histoire, c'est ça"** — entrée dans climax
3. **"Pendant ce temps..."** — comparaison synchrone (efficace pour comparaisons d'échelle)
4. **"Un seul X. Un Y entier..."** — antithèse dans la conséquence
5. **"Maintenant, tu sais"** — close CTA

**Règle** : utiliser 3 pivots minimum, 5 maximum dans un Short. Ils créent la signature rythmique Atlas.

### Étape 7 : Injection Cesar (formule complète, pas 3 injections)

Atlas est le territoire **natif** de Cesar — la formule complète s'applique :

1. **Chiffre-choc dans le hook** (obligatoire)
2. **Tu direct** : 3 occurrences max (hook + milieu + close)
3. **Antithèse close + invitation explicite** (obligatoire)
4. **Comparaison contre-intuitive** (obligatoire — "plus que la France et l'Allemagne réunies")
5. **Pivot dramatique** ("Mais", "Et pour couronner le tout")
6. **Densité chiffrée** (1 stat / 7-9s)
7. **Pont universel** (au moins 1 référence connue de l'audience occidentale)

→ **7 beats Cesar pleinement applicables**, pas 3 injections allégées.

### Étape 8 : Scan TTS français (bloquant)

Identique à ebauche-v1 (voir `memory/tools/elevenlabs.md`) :
1. Pas de participe "e/ee" en fin de groupe
2. Pas de "ont + voyelle"
3. Nombres en lettres ("mille trois cent vingt-quatre" pas "1324")
4. Mots-tests à noter (noms propres étrangers)

### Étape 9 : Validation + sauvegarde

- Claude présente script complet + scan TTS + fact-check JSON
- Aziz valide ou demande ajustements
- Sauvegarde :
  - Manifest : `src/projects/<serie>/manifests/<projet>-atlas-v<N>-manifest.json`
  - Fact-check : `src/projects/<serie>/manifests/<projet>-atlas-v<N>-factcheck.json`
  - Brief prochaine session : `memory/brief-<projet>-atlas-v<N>-next-session.md`

---

## Règle "Tu" — invitatif vs présomptif (NON-NEGOTIABLE, ajoutée 2026-04-27)

L'usage du "tu" pour briser le 4e mur est central dans Atlas. Mais TOUS les "tu" ne sont pas équivalents.

### "Tu" INVITATIF autorisé (place le viewer dans la scène sans présumer son état)
- "Tu regardes" / "Tu vois" / "Tu observes"
- "Imagine" / "Pose-toi la question" / "Garde ce chiffre"
- "Cherche" / "Demande" / "Vérifie"
- "Compare"

→ Engage le viewer dans l'expérience SANS présumer ce qu'il sait ou ne sait pas.

### "Tu" PRÉSOMPTIF INTERDIT (assume l'état de connaissance du viewer)
- ❌ "Tu n'avais jamais entendu"
- ❌ "Tu ne savais pas"
- ❌ "On t'a caché"
- ❌ "Personne ne t'a dit"
- ❌ "Maintenant tu sais" (si précédé d'une présomption d'ignorance)

→ Exclut les viewers qui CONNAISSENT déjà le sujet (diaspora, universitaires, curieux). Place les autres en posture passive d'ignorant. Sous-texte condescendant.

### Pourquoi cette règle existe
C'est exactement le piège des chaînes "histoire cachée" / "qu'on t'a caché" qui plafonnent à 200-700 vues sur Last30Days. Le ton conspirationniste-condescendant tue l'engagement. Atlas s'en démarque par cette règle.

### Différence avec accusatoire
- ✅ "L'histoire qu'on enseigne a oublié X" (factuel — l'enseignement scolaire occidental n'inclut pas X, vérifiable)
- ❌ "Tu ne savais pas" (présomptif — personne ne sait ce que le viewer sait)
- ✅ "Demande autour de toi qui était X. On te répondra Y, Z. Pas lui." (invitation à comparer, factuel)
- ❌ "Personne ne t'a dit" (présomptif + conspirationniste)

### Exemples corrects validés sur Mali + Tombouctou
- Mali CTA : "Cet homme s'appelait Mansa Moussa. Demande qui est l'homme le plus riche de l'histoire. On te répondra Rockefeller, Bezos, Musk. Pas lui."
- Tombouctou CTA : "Tombouctou avait des bibliothèques quand Harvard n'existait pas encore. Une histoire qui n'est dans aucun manuel occidental. Pose-toi la question : pourquoi ?"

---

## Tonalité Atlas (l'ADN à garder)

### CE QUI EST Atlas
- **Didactique chaleureux** — invitation au savoir, complicité
- **Factuel sans neutralité froide** — "je te montre quelque chose qui change ta vision"
- **Densité chiffrée mise en perspective** — chaque stat est CONTEXTUALISÉE (pas balancée)
- **CTA invitation factuelle** — "demande autour de toi", "pose-toi la question" (pas accusateur, pas présomptif)
- **Pas d'humour gratuit** — l'émotion vient du chiffre, pas de la blague
- **Mélange de registres autorisé (learning MDVL_mindset 2026-05-30)** — l'émotion vient du contraste entre rigueur factuelle et proximité directe. Une suite de chiffres peut être suivie d'une phrase courte et directe sans jargon. Ex: "Quarante-trois ans de contrat. Renouvelé deux fois. Sans appel d'offres." — le registre familier-direct après les faits n'affaiblit pas la crédibilité, il humanise. Ce qui est interdit : l'argot ou l'humour auto-dérision. Ce qui est autorisé : des formulations directes et vives qui tranchent avec la densité chiffrée.

### CE QUI N'EST PAS Atlas
- ❌ **Humour blagueur Jacques** ("la Croatie est égoïste") — risqué en LLM, ratio rate/réussite mauvais
- ❌ **Prise de position politique** — l'antithèse close est éducative, pas accusatrice
- ❌ **Ton conte oral Sonjata** — la densité Cesar écrase ce registre
- ❌ **Approximations** — "environ", "à peu près" interdit (perte de crédibilité)

### Différence avec Jacques a dit (à garder consciemment)
- Jacques juge ses sujets via humour → Atlas reste éducatif
- Jacques utilise emojis Apple → Atlas utilise icônes custom (Adinkra, géométriques)
- Jacques cite zéro source → **Atlas cite source en footer permanent** (différenciation crédibilité)
- Jacques est généraliste mondial → Atlas est ancré culture africaine

### Différence avec César Culture G (à garder consciemment)
- César fait long format (8-20 min) sur sujets globaux → Atlas est Short ou court (60-300s) sur sujets Afrique
- César utilise stock animations standard → Atlas utilise Mapbox custom + Paper-Craft inserts
- César ouvre tout sujet → Atlas est spécialisé richesse-record / géo / comparaison

---

## Composants Remotion associés (14 composants identifiés)

D'après l'analyse cross-video Jacques a dit, voici les composants à utiliser dans une production Atlas :

### Carte (Mapbox custom)
1. `SatelliteMapScene` — Mapbox Satellite custom avec camera animation
2. `CountryFlagCutout` — silhouette pays remplie drapeau
3. `NeonGlowBorder` — tracé frontière animé spring + glow
4. `MagnifierZoom` — effet loupe sur micro-détail
5. `OverlaidComparison` — superposition silhouettes pays pour comparaison taille

### Labels et UI
6. `ChapterBadge` — numéro rouge top-left (long format seulement)
7. `LabelBadge` — badges noirs/jaunes/blancs
8. `MapMarker` — cercles rouges + pins
9. `CitationFooter` — sources discrètes bas de frame ← signature Atlas

### Inserts et transitions
10. `EllipseRevealPhoto` — transition ellipse pour B-roll
11. `BRollInsert` — vidéo drone/archive avec fondus
12. `PaperCraftInsert` — scène Paper-Craft 3D ← reuse direct du style Sonjata/Abou Bakari

### Audio
13. `SoundSyncEmitter` — helper sync SFX + apparitions (audio-derived timing)
14. `AmbientLayer` — sound design d'ambiance (kora, marché, vent)

---

## Anti-patterns Atlas (ce qu'on a appris à éviter)

1. **Humour blagueur écrit par LLM** — risque de tomber à plat ou être déplacé. Si humour souhaité, l'écrire à la main, scène par scène.
2. **Densité saturante** — >12 stats pour un Short 80s = surcharge cognitive. Forced alignment ne sauve pas tout.
3. **Approximations chiffrées** — "environ 50%" / "à peu près 700 000 livres" = perte de crédibilité. Soit chiffre précis vérifié, soit reformuler.
4. **Pas de fact-check pré-écriture** — risque de doublon avec un créateur récent. Toujours yt-dlp 30 derniers jours sur le sujet.
5. **Sources absentes du visuel** — `CitationFooter` doit apparaître sur les scènes chiffrées clé. C'est ton avantage Jacques/César/Afrique Révélée n'utilisent pas.
6. **Tu direct >3 fois** — devient intrusif, casse le ton didactique.
7. **Tu présomptif** ("tu n'avais jamais entendu", "tu ne savais pas") — exclut les viewers informés, condescendant, registre conspirationniste qui plafonne à 200-700 vues. Voir règle "Tu invitatif vs présomptif".
8. **CTA accusateur** ("on t'a menti", "on te cache") — registre conspirationniste. Atlas reste sur invitations factuelles ("demande autour de toi", "pose-toi la question").
9. **Ping-pong de contestation (learning MDVL_mindset 2026-05-30)** — neutralité éditoriale ne signifie pas interrompre chaque information par sa contestation immédiate. "Niamey dit X / Orano dit non / Niamey répond Y / Orano conteste" = rythme haché qui brouille la compréhension et semble ne pas prendre position. Technique correcte : construire deux blocs séparés et cohérents — d'abord les faits documentés, ensuite les positions des parties. Ex Sénégal pétrole : segment 2 (données contrat), segment 3 (position gouvernement), segment 4 (position compagnies) — pas d'alternance ligne à ligne.
10. **Ouverture par donnée brute** (learning MDVL_mindset 2026-05-30) — "Selon le FMI, le taux de redevance est de 9,2%" en première phrase ne crée pas d'engagement. La donnée brute informe sans impliquer. Voir l'Étape 1 note sur l'ordre émotionnel — la situation absurde ou conséquence humaine TOUJOURS avant les données.
11. **Termes techniques balancés seuls (jury LLM 2026-05-30)** — acronymes et jargon sans contexte immédiat (LFP, OCP, fer-phosphate, cathodes) sont opaques pour 90% des viewers. Deux options : description fonctionnelle à la place ("batteries nouvelle génération", "le géant public marocain des phosphates") ou définition inline à la première occurrence ("L'OCP — le géant public marocain des phosphates —"). ❌ "Gotion, LFP, cathodes lithiées." → ✅ "Des batteries à base de fer et de phosphate — plus stables, moins chères — produites par Gotion."
12. **Style télégraphique sur données factuelles sèches (jury LLM 2026-05-30)** — les fragments courts séparés par des points fonctionnent pour les images physiques et les contrastes émotionnels, pas pour les listes de faits neutres. ✅ "Des cailloux. À bas prix." (image + contraste) / ✅ "Payer ses soldats. Nourrir sa population." (conséquences humaines en cascade). ❌ "Gotion High-Tech, chinois. Volkswagen, quarante pour cent actionnaire. Démarrage 2026." (liste de faits sans lien émotionnel = bulletin d'information). Règle : style télégraphique réservé aux moments d'impact émotionnel. Les données factuelles s'écrivent en phrases complètes.
13. **Stats de réserves/ressources sans projection (jury LLM 2026-05-30)** — "soixante-dix pour cent des réserves mondiales" seul reste abstrait même en l'absence de jargon. Toujours ajouter une projection en unités compréhensibles qui calibre l'échelle. ❌ "soixante-dix pour cent des réserves mondiales de phosphates" → ✅ "soixante-dix pour cent des réserves mondiales — assez pour équiper toutes les voitures électriques prévues d'ici deux mille quarante". Extension de la règle "1 stat centrale en unités quotidiennes" : quand la stat est une part de réserve/ressource, la projection temporelle ou d'usage est l'unité compréhensible.
14. **Tension binaire avec registres déséquilibrés (jury LLM 2026-05-30)** — quand deux perspectives s'affrontent en blocs séparés (Maroc / Europe, Niger / Orano, Sénégal / Total), les deux blocs doivent avoir le même registre émotionnel. Si le premier a un verbe actif et une conséquence tangible, le second aussi. ❌ "Pour le Maroc : sortir du piège de l'exportation brute. Pour l'Europe : une assurance." ("assurance" = plat, sans conséquence). ✅ "Pour le Maroc : sortir enfin du rôle de fournisseur de matière première. Pour l'Europe : réduire sa dépendance à la Chine sans délocaliser à l'autre bout du monde."

---

## Sources footer visuel (CitationFooter) — règle Peste 1347

Les sources s'affichent **discrètement en bas de frame** sur les passages chiffrés clés.
Elles ne narrent pas — elles crédibilisent silencieusement. C'est la signature différenciante Atlas.

**Format** : texte 16-18px, opacité 0.6-0.7, police neutre (non-decorative). Maximum 2 sources simultanées.

**Règle de placement** : chaque stat importante a sa source associée. Si le chiffre est contesté ou issu d'un débat actif → toujours ajouter source + disclaimer visuel discret.

**Exemple Peste 1347** :
- Segment Densité Cesar → *Nature* 606 (2022) · al-Maqrizi (source primaire)
- Segment Climax Bouclier → *Parasites & Vectors* PMC3195756 · *Science* 363:1022 (2019)
- Segment Mali Vivant → Ibn Battuta *Rihla* (1355) · World History Encyclopedia

**Antipattern** : éviter les URLs longues dans le footer — format court citation académique seulement.

---

## Validé sur

- **Mali (Mansa Moussa)** brouillon 2026-04-27 : 80s, 6 segments, 9 stats, 3 pivots Atlas, 7 beats Cesar pleinement applicables, ton didactique chaleureux validé par Aziz.
- **Tombouctou** brouillon 2026-04-27 (en cours) : à valider qu'Atlas généralise au-delà du Mali.
- **La Peste et le Sahara 1347** — script V3 LOCKED 2026-05-15. **Premier script Atlas historique géographique pur** (sujet : mécanisme protection Sahara vs épidémie). Particularités documentées ci-dessous.

---

## Leçons Peste 1347 — Script historique géographique pur (NOUVEAU type 2026-05-15)

Ce script a révélé un sous-type Atlas non documenté : **Atlas géographique mécaniste** (le mécanisme physique est le héros, pas un personnage humain).

### Ce qui distingue ce sous-type

| Critère | Atlas standard (Mansa Moussa) | Atlas géo mécaniste (Peste 1347) |
|---------|-------------------------------|----------------------------------|
| Héros | Personnage historique | Mécanisme géographique (le Sahara) |
| Stats | Records économiques | Données biologiques + démographiques |
| Ton | Chaleureux, admiration | Factuel froid + contraste binaire |
| Climax | Révélation de grandeur | Révélation de protection (l'absence comme fait) |
| Tu direct | Invitatif recommandé | Zéro "tu" — le sujet se tient seul |
| Sources | UNESCO, Britannica | Nature, Science, PMC (peer-reviewed) |

### Technique climax "contraste binaire" (validée V3)

Au lieu de décrire le mécanisme en prose, la technique la plus efficace est le **contraste sec** :

```
En Europe : des milliers de fosses communes.
Au sud du Sahara : aucune.
La même époque. Le même pathogène. Un désert entre les deux.
```

→ Trois phrases. Aucun adjectif. Aucune explication. Le lecteur/auditeur fait lui-même la déduction.
→ Plus fort que "le Sahara a protégé l'Afrique car..." (explicatif = moins mémorable).

### Objections adversariales — traitement honnête (O1 validé)

Sur les sujets historiques avec débat académique actif :
- Ne jamais affirmer "la science valide" ou "les archives confirment" si le débat est ouvert
- Technique : énoncer le fait observable ("aucun charnier documenté") sans en affirmer la causalité définitive
- Footer source = marker de rigueur visuel, sans sur-affirmer dans la narration

### Zéro "tu" — valide pour ce sous-type

Le sujet géographique pur se tient sans invitation directe au viewer. Le mécanisme est si contre-intuitif que la phrase factuelle seule accroche. Ne pas forcer le "tu" pour cocher la case formule Cesar.

---

## Ressources référencées

- `memory/tools/elevenlabs.md` — règles TTS français
- `memory/tools/camera-movements.md` — 30 mouvements caméra
- `memory/templates/hook-short.md` — bloc d'ouverture 5s (commun aux deux templates)
- `memory/templates/script-ebauche-v1.md` — template alternatif pour sujets narratifs incarnés
- `quebec-jacques-poc/research/JACQUES-CROSS-VIDEO-TEMPLATE.md` — analyse Jacques a dit (référence)
- `quebec-jacques-poc/research/REMOGEN-CROATIA-BRIEF.md` — analyse Gemini Croatie
- `research/cesar-formula.md` — formule Cesar complète (7 beats, 10 règles)
