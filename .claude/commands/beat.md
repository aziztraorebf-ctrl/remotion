# /beat — Lancer une session de production Beat

Lance le pipeline officiel selon le PROTOCOLE-SESSIONS-AUTONOMES-v2.

## Comportement selon le mode de déclenchement

### Mode commande `/beat` (sans argument)

Claude pose 3 questions AVANT de rien exécuter :

1. Sur quel épisode ? (slug exact : silicon-savannah, niger-uranium, vraie-taille-afrique, zimbabwe-lithium...)
2. Sur quel beat ? (numéro)
3. Vérifier si `/tmp/[episode]-beat[N]-breakdown.json` existe déjà :
   - Si OUI → "Breakdown déjà présent. Tu veux passer directement à `review` ?"
   - Si NON → phase `breakdown` (avant le code)

Ne jamais supposer l'épisode ou le beat. Toujours demander.

### Mode commande `/beat [numero]` (avec argument)

Le numéro est connu. Claude demande l'épisode, vérifie le breakdown existant, puis lance.

### Mode texte explicite (ex: "lance le protocole pour Beat6 Silicon Savannah")

Contexte déjà donné → exécution directe :
```bash
python3 scripts/beat-session.py --episode silicon-savannah --beat 6 --phase breakdown
```

### Mode texte explicite (ex: "lance le protocole pour Beat6 Silicon Savannah")

Contexte déjà donné → exécution directe sans question.

---

## Pipeline d'exécution

### Phase breakdown (avant le code)

**PREMIÈRE ACTION — aucune exception :**
```bash
python3 scripts/beat-session.py --episode [episode] --beat [N] --phase breakdown
```

1. Le script affiche les CONTRAINTES DE SECURITE automatiquement
2. Il vérifie tous les prérequis (manifest, storyboard, audio, bg, Tailwind, no-black)
3. Il appelle Gemini et produit `/tmp/[episode]-beat[N]-breakdown.json`
4. Il s'arrête avec le next step exact à copier-coller
5. Claude lit le JSON — code à partir du JSON uniquement

### Phase review (après le render)

```bash
python3 scripts/beat-session.py --episode [episode] --beat [N] --phase review \
  --video out/episodes/[episode]/wip/beat[N]_v1.mp4
```

1. Si score >= 8.0 : appliquer corrections `code_values` → re-render → s'arrêter
2. Si score < 8.0 : ntfy BLOCKED + s'arrêter

## Règle absolue

Ne jamais lire PIPELINE.md et improviser.
Ne jamais appeler `beat-breakdown.py` ou `visual_review.py` directement.
**Toujours** commencer par `beat-session.py --phase breakdown` — sans exception.
