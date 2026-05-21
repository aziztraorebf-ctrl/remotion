# Workflow & Processus — Règles transversales (consolidé)
> Fusion de : feedback_jury-apis-commands, feedback_jury-composition-et-svg, feedback_collaboration-ask-when-stuck, feedback_aziz-role-orchestrateur-marketeur, feedback_skills-preproduction-created, feedback_selection-sujets-monetisation-first
> Mis à jour : 2026-05-08

---

## SECTION 1 — Jury LLM hybride créatif

### Composition jury (NON-NEGOTIABLE)

**Jury script/storyboard créatif (NOUVEAU standard 2026-05-14) :** GPT-4o + Gemini + Grok
**Jury templates visuels (Souverain) :** GPT-4o + Gemini + Grok

Kimi retiré du jury standard — remplacé par Gemini (meilleure disponibilité, coût inférieur).
INTERDIT : remplacer Grok ou Gemini par Claude Sonnet — biais évident sur son propre projet.
Exclure Gemini GÉNÉRATION quand il est déjà utilisé comme outil de génération d'assets dans le même épisode (Gemini ANALYSE/jury OK).

### Modèles courants (MAJ 2026-05-09)

| Modèle | Usage | Notes |
|--------|-------|-------|
| `kimi-k2.6` | Jury vision, analyse créative | **Thinking model** — réponse dans `reasoning_content` si `content` vide. `max_tokens: 16000` obligatoire, timeout 300s. Base64 images obligatoire. |
| `models/gemini-3.1-flash-lite` | Jury vision, analyse rapide | Via Google genai SDK (`google.genai`), pas OpenRouter. |
| `gpt-4o` | Jury vision, écriture | Via OpenAI API directe (pas OpenRouter). |
| `grok-4-fast-non-reasoning` | Jury créatif | Via xAI API. |

### APIs exactes (ne pas improviser les endpoints)

**GPT-4o — OpenAI directe :**
```python
client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": [
        {"type": "text", "text": PROMPT},
        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}}
    ]}],
    max_tokens=1500
)
```

**Grok — xAI API :**
```python
client = openai.OpenAI(api_key=os.environ["XAI_API_KEY"], base_url="https://api.x.ai/v1")
# model: "grok-4-fast-non-reasoning"  (MAJ 2026-05-08 : grok-2-vision-1212 retiré)
```

**Kimi K2.6 — Moonshot API (thinking model) :**
```python
r = requests.post(
    "https://api.moonshot.ai/v1/chat/completions",  # .ai (international), pas .cn
    headers={"Authorization": f"Bearer {os.environ['MOONSHOT_API_KEY']}"},
    json={"model": "kimi-k2.6", "messages": [...], "max_tokens": 16000},
    timeout=300,
)
msg = r.json()["choices"][0]["message"]
verdict = msg.get("content") or msg.get("reasoning_content") or ""
# IMPORTANT : content peut être vide, réponse principale dans reasoning_content
```

**Gemini 3.1 Flash Lite — Google genai SDK :**
```python
import google.genai as genai
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
response = client.models.generate_content(
    model="models/gemini-3.1-flash-lite",
    contents=parts,  # liste de strings + Part.from_bytes()
    config=genai.types.GenerateContentConfig(max_output_tokens=4000),
)
verdict = response.text
```

### Workflow jury standard
1. Charger toutes les images storyboard en base64
2. Appeler GPT-4o, Grok, Kimi sur toutes les images + même prompt
3. Compiler les 3 réponses par question
4. Présenter à Aziz pour tri

**Durée cible : 5-8 min max pour 3 jurés + 14 images.** Si ça prend plus longtemps, le brief est mal formulé.

### SVG pur : interdit pour textures/matières

SVG pur acceptable uniquement pour : lignes/arcs, formes géométriques simples, grilles de données, points.
SVG pur INTERDIT pour : textures (papier/métal/grain), effets atmosphériques (brume/fumée), topographie organique.
→ Pour ces cas : Gemini génère un asset PNG, Remotion l'intègre via `staticFile()`.

---

## SECTION 2 — Collaboration : demander quand bloqué

**Règle Aziz (2026-05-03)** : "Si après une ou deux tentatives ça ne marche pas, me le rappeler."

Après 1-2 tentatives ratées → demander capture d'écran annotée, pas pivoter vers une 3e solution à l'aveugle.

**Quand demander capture d'écran :**
- Position visuelle "où exactement ?" → flèche sur image
- Comportement temporel "à quel moment ?" → screenshot problème
- Mouvement caméra "vers quoi zoomer ?" → flèche depuis position actuelle
- Différence subtile "à quoi ça doit ressembler ?" → référence visuelle

**Quand demander clarification verbale :**
- Choix entre 2-3 options claires
- Validation décision risquée "je vais faire X, ça t'va ?"

**Format :** "Je tente Y mais je ne suis pas certain de [aspect]. Peux-tu : screenshot avec flèche sur [endroit] OU confirmer [interprétation A] vs [B] ? C'est plus efficace que 3 versions à l'aveugle."

**Ne pas demander pour :** décisions techniques évidentes, bugs TypeScript résolvables, erreurs reproductibles.

**Cas de validation :** Beat 1 Ghana v1-v5 — 4 itérations perdues sur un zoom. Une capture d'écran Aziz a résolu en 5 min.

---

## SECTION 3 — Profil Aziz (comment calibrer les recommandations)

**Aziz = orchestrateur et marketeur**, pas créateur de contenu activiste.
Objectif premier : monétisation YouTube, croissance audience, revenus. Formulé explicitement 2026-05-08.

**Implications :**
- Ne jamais sacrifier monétisation au militantisme dans les recommandations
- Cadrer en termes d'audience, vues, croissance — pas seulement valeur éditoriale
- Objectif de portée : au-delà de la diaspora africaine → francophone général + curieux d'histoire mondiale
- Sujet éditorialement intéressant mais commercialement risqué → le dire explicitement

---

## SECTION 4 — Sélection sujets (critères go/no-go)

**Monétisation et audience d'abord.** Critères de go pour un sujet :
- Top 10% volumes de recherche YouTube sur le créneau africain/francophone
- Audience vérifiable (Google Trends, vidéos concurrentes > 500K vues)
- Gap francophone confirmé (anglophone bien couvert, francophone sous-servi)
- Monetisable dans 6 mois (pas trop niche, pas trop chaud pour AdSense)

**No-go :**
- Sujet exclusivement activiste (démonétisation + audience trop segmentée)
- Sujet qui ne peut pas s'expliquer en 75s avec tension narrative

---

## SECTION 5 — Skills pré-production disponibles

| Situation | Skill |
|-----------|-------|
| Démarrage nouvel épisode Atlas (carte, géo, territoire) | `atlas-video-preproduction` (12 étapes, basé Empire Ghana) |
| Démarrage Seedance Short narratif (héros, tragédie, portrait) | `video-narrative-preproduction` (skeleton, à enrichir) |
| Sujet ambigu | Run Atlas-native check (≥4/5 critères Atlas → Atlas, sinon Seedance) |

**Critères Atlas-natif (score /5) :**
1. Territoire avec frontières changeantes visuellement riches
2. Routes commerciales/militaires avec déplacement
3. Données cartographiables (empire, ville, ressource)
4. Données économiques/historiques chiffrées
5. Mouvement géographique comme arc narratif

Mansa Moussa = 5/5. Hannibal = 4/5. Shaka Zulu = 1/5 (→ Seedance Shorts).

---

## SECTION 6b — Architecture des 3 formats (validée 2026-05-11)

### Rôles distincts — ne pas intervertir

| Format | Cadence | Audience | Rôle chaîne |
|--------|---------|----------|-------------|
| **Souverain Short (75-90s)** | 2/semaine | Casual + internationale | Carburant algorithme, test sujets |
| **Souverain Long (3-5 min)** | 1/semaine | Sérieuse YouTube/Facebook | Approfondissement, CPM élevé |
| **Atlas (8-15 min)** | 1/mois | Long-form, fidèles | Format pilier, authority builder |
| **Seedance Shorts (narratif)** | Selon dispo | Diaspora + grands récits | Série "Héros Oubliés" exclusivement |

### Seedance — réservé série Héros Oubliés
Seedance 2.0 n'est PAS un concurrent de Souverain ou Atlas. Format réservé aux épisodes narratifs courts (Abou Bakari II, etc.) de la série "Héros Oubliés" (ou équivalent). Peut être intégré comme insert dans Atlas mais ne remplace pas la logique PixelLab pour les épisodes Atlas-natifs.

**Cadence atteignable estimée (pipeline rôdé) :** 2 Souverain/semaine si pré-production faite en amont. Atlas <48h si manifest + assets prêts. Seedance Short : rapide quand dashboards en place.

### Goulot d'étranglement identifié
- Souverain : vitesse de production ↑ à chaque épisode (pipeline se rôde)
- Atlas : lent uniquement en phase d'apprentissage PixelLab/nouveaux personnages — s'accélère avec la bibliothèque PixelLab qui grandit
- Seedance : déjà rapide, pas de problème structurel

---

## SECTION 7 — Gate Hook (non-négociable depuis Niger Uranium 2026-05-12)

**Le Hook est la partie la plus importante de tout Short. Il ne peut pas être sous-estimé.**

### Séquencement obligatoire

1. **Écrire 2-3 variations de hook** (angles différents : paradoxe / question / chiffre-pivot)
2. **Soumettre à Aziz** — choisir la variation avant toute production
3. **Générer l'audio** de la variation choisie + mesurer avec ffprobe
4. **Intégrer dans timing.ts** (HOOK_DURATION_S, HOOK_FRAMES, BEATS.hook.startFrame)
5. **Approbation finale Aziz** sur le hook audio rendu
6. **Seulement après** → production Beat 1, Beat 2, ...

**Pourquoi** : Niger Uranium a eu son hook refait en cours de production. Résultat : bug audio chevauchement narration + 2 sessions de correction. Coût évitable.

### Critère TikTok (non-négociable)

Avant de soumettre une variation à Aziz, répondre : **"Est-ce que quelqu'un qui ne connaît pas GéoAfrique arrête de scroller dans les 3 premières secondes ?"** Si non → reformuler.

---

## SECTION 8 — YouTube Shorts : durée max 3 minutes (MAJ 2026-05-14)

**Ancienne règle "60s max" = obsolète depuis octobre 2024.**

YouTube Shorts accepte désormais les vidéos jusqu'à **3 minutes** (180 secondes). Validé via WebSearch 2026-05-14.

- Un Short de 122s est valide et éligible Shorts
- Cible recommandée pour Souverain : 75-130s (ne pas dépasser 150s sans raison narrative)
- La contrainte "60s max" ne doit PLUS apparaître dans les briefs ou les manifests

---

## SECTION 9 — Pré-production : to-do list contraignante (2026-05-14)

**Aziz demande explicitement** : afficher une checklist complète au début de chaque workflow pré-production (Souverain, Atlas, Seedance). Pas d'étape sautée.

### Checklist pré-production Souverain (ordre obligatoire)

- [ ] Sujet sélectionné (critères go/no-go Section 4)
- [ ] Perplexity sonar-pro fact-check (chiffres, dates, sources)
- [ ] Fact-Sheet complétée (`memory/templates/fact-sheet-souverain-v1.md`)
- [ ] Jury LLM script/storyboard (GPT-4o + Gemini + Grok) — score + retours
- [ ] Corrections intégrées selon jury
- [ ] 2-3 variations hook écrites + soumises à Aziz
- [ ] Variation hook choisie → audio TTS généré + ffprobe
- [ ] Hook approuvé Aziz → locked
- [ ] Script complet TTS généré + ffprobe toutes durées
- [ ] Forced Alignment v2 généré (API ElevenLabs, crossvalidation Whisper API OpenAI)
- [ ] 3 variantes musique générées via fal.ai Minimax (lire `memory/tools/minimax.md` AVANT)
- [ ] Manifest créé (`src/projects/souverain/<episode>/manifest.ts`)
- [ ] Assets visuels beat par beat (Gemini illustration/photo selon style épisode)
- [ ] Production beat par beat (code Remotion)
- [ ] Quality review (Kimi)
- [ ] Render final

**Étapes les plus souvent oubliées** :
1. Perplexity sonar-pro AVANT script
2. Musique fal.ai Minimax (oubliée en production Silicon Savannah 2026-05-14)
3. Test adversarial AVANT script final

---

## SECTION 10 — Pré-production : humain+Claude, PAS agents autonomes (2026-05-14)

**Décision Aziz (validée 2026-05-14) :**

La pré-production (script, fact-check, jury LLM, hook) ne doit PAS être déléguée à des agents autonomes. Trop d'allers-retours, trop de validation requise à chaque étape, trop de décisions éditoriales qui appartiennent à Aziz.

**Pré-production = collaboration directe Aziz + Claude principal.**

**Les agents restent pertinents pour :**
- Stage 4 : visual-producer (génération assets Gemini/Recraft/PixelLab)
- Stage 5 : remotion-composer (code Remotion beat par beat)
- Stage 6 : quality-reviewer (review technique + jury Kimi)

**Ne PAS spawner d'agent pour :**
- Fact-check Perplexity
- Écriture / itération script
- Jury LLM créatif
- Choix hook
- Décisions éditoriales (ton, angle, structure)

---

## SECTION 6 — Règles session : une scène par session Atlas

Issues de session Beat 1 Ghana trop lourde (R&D + audit + prod mélangés) :

1. **1 session = 1 beat** : ne pas mélanger R&D + production
2. **ATLAS-COMPOSANTS.md en premier** : lire avant d'écrire une ligne
3. **Screenshot dès v1 ratée** : Read l'image avant de proposer la v2
4. **Mini-plan 5 lignes pour beats complexes** : arbre de décision + composants + ordre d'assemblage

Manifest obligatoire AVANT de coder : si projet actif sans manifest → proposer de le faire avant de toucher au code. Beat 2 Hannibal sans manifest = 3+ itérations perdues.

---

## SECTION 7 — Règles audio production (post-mortem Vraie Taille Afrique 2026-05-12)

### R-SILENCE-MAX-3S
Tout silence >3s dans un beat = signal d'alarme obligatoire.
- Calculer : `durationInFrames - durationFrames_VO = silence`. Si > 90f → soit ajouter VO, soit réduire la fenêtre.
- Un hold narratif intentionnel = max 2-3s. Au-delà le spectateur décroche.
- Pattern validé : "beat 2b" = VO factuelle courte (5s) pour combler un gap silencieux.

### R-AUDIO-FIRST-STRICT
Script VO complet + TTS généré + ffprobe toutes durées → AVANT de toucher au timing visuel.
- Jamais locker les visuels avant avoir les durées audio réelles.
- Ajouter de l'audio après coup crée des décalages en cascade difficiles à diagnostiquer.

### R-NO-AUDIO-OVERLAP
Après tout ajout ou modification d'audio, vérifier que aucun segment ne chevauche le suivant :
```
segment[i].startFrame >= segment[i-1].startFrame + segment[i-1].durationFrames
```
Prendre 2 minutes pour ce calcul = économiser 30 minutes de debug.

### R-BEAT-DURATION-FORMULA
`durationInFrames = durationFrames_VO + 30f_silence + 30f_fondu` — jamais estimer.
Appliquer dès que ffprobe donne la durée VO, avant d'écrire le timing.

### R-MUSIC-COMPOSITION-ONLY
La musique de fond se gère UNIQUEMENT au niveau de la composition principale.
Les composants Beat* ne montent jamais d'Audio musique — seulement leur VO propre.
Avant tout render : `grep -n "music\|music-A\|music-B" src/projects/*/Beat*.tsx` → si trouvé = bug.
