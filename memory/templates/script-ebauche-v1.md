# Template Script — Ebauche V1 (methode validee 2026-04-22)

> Methode reproductible pour ecrire la V1 d'un script Short Heros Oubliés.
> Validee sur Thiaroye V5 (2026-04-22) apres avoir echoue plusieurs fois avec V2/V3/V4.
> Chaque etape a un but precis. Ne pas sauter.

---

## Pourquoi cette methode existe

Sonjata V1 → publication = 7 sessions, $52, 10+ iterations de scene (certaines refaites 3-4x).
La plupart des retours couteuses venaient d'un **script initial pas assez travaille** :
- Densite trop elevee (beats empiles)
- Ponts narratifs faibles ou genants (cf. la lettre scene 1 Thiaroye V4)
- Pas d'injection de retention (hook, tu direct, antithese)
- Fact-check pas fait (dates approximatives)
- TTS non scanne = echec prononciation decouvert tard

Cette methode fait **en amont** tout le travail qu'on faisait **apres** la production.

---

## Les 8 etapes

### Etape 0 : Contraintes de depart (Claude pose les questions, Aziz repond)

Avant toute ecriture :
- **Duree cible** (60-90s pour un Short)
- **Sujet + angle** (pas juste "Thiaroye" — mais "Thiaroye vu par le proces 2026")
- **Style visuel** (paper-craft, SVG, pixel-art, 2D BD) — determine le registre narratif
- **Voix** (Narrateur/Narratrice GeoAfrique v2)
- **Newsletter/CTA cible** (serie ? newsletter generique ? abonnement chaine ?)

### Etape 0.5 : DIAGNOSTIC DU TYPE DE SUJET (ajoute 2026-04-22 apres exercice Sonjata-Cesar)

Tous les sujets ne sont pas egaux face a la formule Cesar. Cette etape determine **l'intensite d'injection Cesar** a l'etape 6.

**Typologie validee** :

| Type de sujet | Registre ideal | Intensite Cesar |
|---|---|---|
| **Epopee mythique / fondation** (Soundjata, Chaka, Amanirenas) | Conte oral — "il etait une fois" | **3 injections ciblees** (hook chiffre + 1 tu + CTA antithese) |
| **Fait d'actualite / scandale / massacre** (Thiaroye 2026, Haitian debt) | Journalisme grave | **3 injections ciblees** |
| **Richesse / records chiffres** (Mansa Moussa, Tombouctou, Ibn Battuta) | Cesar pur | **Formule complete 7 beats + 10 regles** (comme l'original) |
| **Voyage / exploration / decouverte** (Abou Bakari II, Ibn Battuta) | Mixte | **5-6 injections** (hook, indignation, bascule, pont, tu, close) |
| **Portrait intime / humain** (reine Nzinga, femme scientist) | Biographie incarnee | **4 injections** (hook, bascule, antithese, close) |

**Exemples concrets appris** :
- Sonjata (epopee mythique) : Cesar complet aurait detruit le ton conte. **3 injections = optimal**.
- Thiaroye V5 (actualite grave) : Cesar complet aurait sonne opportuniste. **3 injections = optimal**.
- Mansa Moussa (richesse record) : Cesar complet = format natif. **7 beats + 10 regles** applicables directement.

**Questions pour determiner le type** :
- Le sujet est-il **chiffrable** (or, taille empire, nombre morts, dates) ? → penche vers Cesar complet
- Le sujet est-il **mythique/sacré** (legende, epopee, tradition orale) ? → penche vers 3 injections
- Le sujet est-il **tragique/polemique** ? → penche vers 3 injections (eviter le ton viral)
- Le sujet est-il **didactique/documentaire** ? → penche vers formule complete

**Decision notee** dans le manifest comme :
```json
{
  "subject_type": "epopee-mythique | actualite-grave | richesse-record | voyage | portrait-intime",
  "cesar_intensity": "3-injections | formule-complete | 5-6-injections"
}
```

### Etape 0.6 : Formule de titrage (ajoutee 2026-05-30, learning MDVL_mindset)

Le titre est une mecanique de distribution algorithmique, pas une description du contenu. Choisir parmi 4 patterns valides :

| Pattern | Principe | Exemple MDVL | Exemple Souverain |
|---------|----------|--------------|-------------------|
| **Pont anachronique** | [sujet historique] + [concept contemporain reconnaissable] | "Did Medieval Knights Get PTSD?" | "Comment Thiaroye a vu venir ce que la France nie encore" |
| **Titre-contradiction** | Renverser une croyance supposee du viewer | "Medieval Life Wasn't So Bad" | "Tu te trompes sur la fidelite de Sonjata" |
| **Defi 2e personne** | Provocation directe — ego du viewer en jeu | "You Couldn't Handle Anglo-Saxon Women" | "Tu ne realises pas ce que Yaa Asantewaa a reussi" |
| **Mot-cle emotionnel CAPS** | Emphase vocale transcrite visuellement | "Medieval Kings Were DEVOUT" | "Amanirenas a GAGNE contre Rome" |

**Regle de selection** : choisir LE pattern qui correspond au type de sujet (Etape 0.5). Les sujets epopee-mythique tolerent mieux le defi 2e personne. Les sujets actualite-grave tolerent mieux la contradiction ou le pont anachronique.

→ Règles de titrage partagées : voir `memory/templates/regles-titres.md`

**Anti-pattern absolu Héros Oubliés** : le titre descriptif ("L'epopee de Sonjata Keita", "La bataille de Thiaroye 1944") — invisibilite algorithmique garantie.

**Exemples Héros Oubliés fusionnant les deux couches** : "Ils ont libéré la France. Elle les a massacrés." (Thiaroye, 49 car.) ✅ — "Il a crashé l'économie du Caire par générosité" (Mansa Musa, 47 car.) ✅

**Documenter le titre finalise dans le manifest** :
```json
{
  "titre_choisi": "...",
  "pattern_applique": "pont-anachronique | titre-contradiction | defi-2e-personne | caps-emotionnel"
}
```

### Etape 1 : Decoupage en scenes + structure narrative

- Objectif : 5-7 scenes pour un Short 90s (15s moyenne par scene)
- Structure cible :
  - **Setup** : 2 scenes (~25-30%)
  - **Climax** : 1 scene (~18-20%)
  - **Resolution** : 3 scenes (~50%)
- Regle absolue : **climax entre 30% et 50% du Short**
- Regle absolue : **post-climax plus court ou egal au pre-climax** (sinon densite perd le spectateur)

**Note sur l'ordre emotionnel (learning MDVL_mindset 2026-05-30)** : ne pas suivre l'ordre chronologique sauf si la chronologie EST le twist. Privilegier l'ordre emotionnel : image concrete ou consequence humaine → contexte → mecanisme → resolution. Pour les sujets Heros Oublies : commencer par la scene la plus forte emotionnellement, pas par "né en X dans la region Y". Exemple pour Amanirenas : commencer par "les legions romaines qui reculent" avant d'expliquer pourquoi.

### Etape 2 : Ecriture premiere passe scene par scene

- **Une scene a la fois**, pas tout d'un coup
- Narration texte + visuel decrit + mouvement camera envisage
- **Densite cible** : 2.5-2.8 mots/s (soit ~40 mots pour 14s)
- Forme : phrases courtes (2-5 mots), pauses naturelles, pas de sous-phrases compliquees
- Zero metaphore alambiquee — clarete > poesie
- **Hook : personnage nomme + ancre contemporaine (learning MDVL_mindset 2026-05-30)** : si le sujet le permet, nommer le personnage central des les 2 premieres phrases avec une comparaison moderne en 1 phrase. Le cerveau s'attache aux individus. Ex: "Il s'appelait Musa Keita. Pour une journee, il a fait s'effondrer les prix de l'or sur trois continents." — pas : "Au XIVe siecle, le Mali etait un empire puissant...". Application Heros Oublies : valable pour Amanirenas, Yaa Asantewaa, Nehanda Charwe — pas pour les sujets collectifs (Thiaroye) ou mythiques distants (Sonjata).
- **Termes techniques en voix-off (jury LLM 2026-05-30)** : pour les sujets Heros Oublies croisant des realites institutionnelles ou militaires, les acronymes et noms d'organisations (tirailleurs senegalais, GIC, corps expeditionnaire) doivent etre introduits avec leur contexte immédiat la premiere fois. Ne jamais presupposer que le viewer connait le referent. Ex : "les tirailleurs senegalais — ces soldats africains recrutes de force dans les rangs de l'armee coloniale —" a la premiere mention, puis "les tirailleurs" ensuite.

### Etape 3 : Critique proactive par Claude (avant validation Aziz)

Claude signale **avant** que Aziz doive demander :
- Densite anormale (>3.0 mots/s = trop tight)
- Phrases ambigues (ex: "la France reconnait" = reconnait quoi ?)
- Beats empiles (>8 beats majeurs pour un 90s = trop)
- Objets-pont faibles (ex: un objet cite une fois sans payoff narratif)
- Climax mal place
- Post-climax disproportionne
- Fact-check necessaire (dates, chiffres, personnes nommees)

### Etape 4 : Fact-check (WebSearch si necessaire)

Pour tout :
- Date precise evenement (proces, traite, bataille)
- Chiffre historique (nombre de victimes, dates)
- Nom propre (personne, ville, institution)
- Citation attribuee

**Regle** : si Claude n'est pas 100% sur, il DOIT faire WebSearch avant d'affirmer. Pas d'approximation dans un script de production.

### Etape 5 : Ponts narratifs (pas techniques)

Distinguer deux types de pont :
- **Narratif** : objet/image qui **se transforme** entre scenes (ex: main ouverte → main qui tombe). Porte du sens.
- **Technique** : objet identifiable pour forcer la continuite visuelle Seedance (ex: meme lettre dans 2 scenes). Pas de sens narratif.

**Regle V5** : on garde UNIQUEMENT les ponts narratifs. La continuite technique passe par **character sheets + palette clause + style clause** dans chaque prompt.

Verifier pour chaque transition : est-ce que cet objet **porte du sens** entre les 2 scenes ? Si non, le supprimer.

### Etape 6 : Injection Cesar (dynamisation)

Prendre **3 regles Cesar** a haute valeur de retention et les injecter **sans refaire le script** :

1. **Chiffre-choc dans le hook (0-5s)**
   - Template : "[Fait universel] + [chiffre contre-intuitif]"
   - Ex Thiaroye : "Ils ont libere la France. Elle en a tue trois cents au retour."

2. **Tu direct (1 seule fois, au milieu du Short ~50-60s)**
   - Cree la connexion sans etre intrusif
   - Ex Thiaroye : "Tu n'as jamais appris leurs noms."

3. **Antithese close + invitation explicite**
   - Template : "[Ils/sujet] a [fait 1]. [Toi, tu] sais maintenant. [Action CTA]."
   - Ex Thiaroye : "Ils ont libere un continent qui les oublie. Maintenant, toi, tu sais. [CTA]"

**Regle** : pas d'injection > 3. On garde la sobriete du sujet.

### Etape 6.5 : Stress-test adversarial (OBLIGATOIRE avant scan TTS)

Lire le script en se mettant dans la posture de l'adversaire le plus solide sur ce sujet historique.

**Persona adversarial Héros Oubliés** : un historien sceptique qui accepte les faits documentés mais conteste le traitement — il dira "vous romantisez sans mentionner les violences internes du personnage", "vous anachronisez les valeurs modernes sur une figure médiévale", "vous omettez les contradictions documentées qui nuancent le portrait".

**Protocole** :
1. Identifier les **3 attaques les plus solides** (pas les plus faciles, les plus solides)
2. Pour chaque attaque : est-ce qu'elle a une **réponse défendable dans le script lui-même** ?
3. Si oui → OK, continuer. Si non → **correction minimale d'une phrase maximum**
4. Si une attaque nécessite plus d'une phrase → remonter à Aziz, c'est un problème structurel

**Différence clé vs Souverain** : pour les Héros Oubliés, le risque n'est pas le biais politique mais la **romantisation historique** — présenter une figure comme pure sans reconnaître sa complexité. Une phrase de nuance suffit souvent à neutraliser cette attaque sans alourdir le récit.

**Durée cible** : 5-10 minutes. Ce n'est pas une réécriture.

### Etape 7 : Scan TTS francais (bloquant)

Pour **chaque phrase**, verifier 4 regles (voir `memory/tools/elevenlabs.md`) :

1. **Pas de participe passe en "e/ee" en fin de groupe rythmique**
   - INTERDIT : "...ils sont tues." / "...je suis prete."
   - CORRECTION : reformuler avec complement ou verbe conjugue

2. **Pas de "ont + voyelle"**
   - INTERDIT : "Ils ont accoste" (liaison bizarre)
   - CORRECTION : "Ils accosterent" (passe simple)

3. **Nombres en lettres**
   - INTERDIT : "1944", "80 morts"
   - CORRECTION : "mille neuf cent quarante-quatre", "quatre-vingts morts"

4. **Mots-tests a noter** (prononciation a verifier a la generation)
   - Noms propres etrangers (ex: Biram, Thiaroye)
   - Mots composes (ex: tirailleurs)

### Etape 8 : Validation + sauvegarde

- Claude presente le script complet avec scan TTS done
- Aziz valide ou demande ajustements
- Sauvegarde :
  - Manifest technique : `src/projects/<serie>/manifests/<projet>-v<N>-manifest.json`
  - Brief prochaine session : `memory/brief-<projet>-v<N>-next-session.md`
  - Archivage version precedente si refonte : `manifests/archive/<projet>-v<N-1>-manifest.json`

---

## Structure du manifest (champs obligatoires)

```json
{
  "project": "<Nom projet>",
  "version": "v<N>",
  "total_duration_s": <total avec hook>,
  "style": "<paper-craft-sepia / paper-craft-cold / svg-enluminure / etc>",
  "narrative_bridges": [
    { "from_scene": N, "to_scene": N+1, "bridge": "...", "type": "narrative-transformation" }
  ],
  "cesar_injections": [
    { "location": "hook", "rule": "chiffre-choc", "text": "..." },
    { "location": "scene N", "rule": "tu direct", "text": "..." },
    { "location": "CTA", "rule": "antithese close", "text": "..." }
  ],
  "hook": {
    "duration_s": 5.0,
    "visual_source": "<scene existante ou nouvelle>",
    "narration": "...",
    "words": N,
    "music": "silence (Option B)"
  },
  "scenes": [
    {
      "id": 1,
      "title": "...",
      "start_s": 5.0,
      "end_s": ...,
      "narration": "...",
      "word_count": ...,
      "debit_m_per_s": ...,
      "camera_movement": "<nom officiel du mouvement>",
      "camera_prompt_fragment": "<prompt ready-to-use>"
    }
  ],
  "tts_scan_results": {
    "participes_e_ee": "CLEAN / PROBLEMS_DETECTED",
    "ont_voyelle": "CLEAN",
    "nombres_lettres": "CLEAN",
    "words_to_test_audio": [...]
  },
  "next_session_todo": [...]
}
```

---

## Anti-patterns (ce qu'on a appris a eviter)

1. **Narration trop longue imposee par un outil externe** — Kimi/GPT peuvent ecrire des scripts trop denses. Toujours compter les mots et valider le debit en mots/s.
2. **Ponts techniques en objets recurrents** — la lettre Thiaroye V4 qui n'apportait rien narrativement. Si un objet n'est pas transforme ou developpe, supprime-le.
3. **Dates approximatives** — "en 2024" ou "dans les annees 1940" = perte de credibilite. Fact-check obligatoire pour dates/chiffres/noms.
4. **Injection Cesar complete (10 regles)** — trop commercial pour des sujets graves. 3 injections ciblees = meilleur compromis.
5. **CTA generique serie alors qu'il s'agit de newsletter** — ajuster le CTA au vrai produit (serie vs newsletter vs abonnement chaine).
6. **Climax trop tot** (avant 25%) = le reste tombe a plat. Climax trop tard (apres 50%) = le spectateur a swipe.
7. **Post-climax plus long que pre-climax** = densite mal equilibree, Sonjata et Thiaroye V4 avaient ce probleme.
8. **Hook avec donnee brute en premiere phrase** (learning MDVL_mindset 2026-05-30) — "Selon l'INSEE, 300 soldats sont morts" ne cree pas d'ancrage emotionnel. La donnee brute n'engage pas, elle informe. Commencer par la consequence humaine ou la situation concrète : "Ils avaient libere Paris. Trois semaines plus tard, la France les executait."
9. **Titre descriptif** — "L'histoire de [Nom]" ou "La bataille de [Lieu]" = zero differentiation algorithmique. Appliquer obligatoirement l'Etape 0.6 avant de figer le titre.
10. **Registre uniforme du debut a la fin** — alterner deliberement rigueur factuelle et proximite directe. Un chiffre factuel peut etre suivi d'une phrase directe courte. L'emotion vient du contraste, pas d'une seule note maintenue.
11. **Style telegraphique sur donnees factuelles seches (jury LLM 2026-05-30)** — les fragments courts fonctionnent quand ils portent une image physique ou un contraste emotionnel. ✅ "Des cailloux. A bas prix." / ✅ "Payer ses soldats. Nourrir sa population." Mais une liste de faits neutres en style telegraphique sonne comme un bulletin d'information. ❌ "Gotion High-Tech, chinois. Volkswagen, quarante pour cent actionnaire. Demarrage 2026." Regle : style telegraphique = moments d'impact emotionnel uniquement. Faits informatifs = phrases completes.
12. **Conditionnel en hook sans ancre temporelle (jury LLM 2026-05-30)** — un conditionnel en premiere phrase ("sortira peut-etre", "pourrait devenir") signale un sujet hypothetique, le viewer ne s'investit pas. Si le conditionnel est necessaire, le preceder d'une ancre temporelle precise qui cree une certitude de calendrier. ❌ "sortira peut-etre d'ici" → ✅ "Dans deux ans, sortira peut-etre d'ici" ou ✅ "est en construction" / "sort de terre" (present reel). Pour les sujets Heros Oublies : le hook doit etre ancre dans un fait certain — une date, un lieu, une action documentee.

---

## Valide sur

- **Thiaroye V5** (2026-04-22) : 95s, 6 scenes + hook, 3 injections Cesar, 3 ponts narratifs. Script LOCKED par Aziz sans iteration majeure apres application de cette methode. Type de sujet : **actualite-grave** → 3 injections.
- **Sonjata (retrofit 2026-04-22)** : 151s + CTA 10s = 161s, 10 scenes. Type de sujet : **epopee-mythique** → 2 injections appliquees en retrofit (hook + CTA), 3e injection (pont universel scene 8 Charte) non appliquee car audio narration deja produit et valide. Apprentissage : appliquer les injections Cesar EN AMONT evite les retrofits. Si Hook + CTA n'etaient pas encore en audio au moment de la decouverte Cesar, OK — sinon cout eleve.
- **Script a venir** : Abou Bakari II (a tester cette methode desormais, type **voyage** = 5-6 injections)

## Ressources referencees

- `memory/tools/elevenlabs.md` - regles TTS francais
- `memory/tools/camera-movements.md` - 30 mouvements + framework decision
- `memory/templates/hook-short.md` - pattern hook 5s
- `memory/tools/minimax.md` - formule prompt musique
- `research/cesar-formula.md` - formule Cesar complete (7 beats, 10 regles)
