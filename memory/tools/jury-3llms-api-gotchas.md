# Jury 3 LLMs — Pattern validé + gotchas API

> Migré depuis auto-memory 2026-08-31 (créé 2026-05-09). ⚠️ Kimi K2.5 est aujourd'hui PÉRIMÉ côté
> doctrine projet (seul Kimi K3 est autorisé, cf CLAUDE.md) — les gotchas de nom de modèle et
> temperature sont probablement spécifiques à K2.5, à re-tester avec K3 avant réutilisation. Les
> gotchas structurels (base64 vs URL, org verification GPT-5) restent probablement valides.

## Contexte

Pattern validé 2026-05-09 pour évaluation visuelle parallèle de templates par 3 LLMs avec vision : Kimi K2.5 + GPT-4o + Gemini 2.5 Pro.

**Coût total** : ~$0.04 par run (8 frames PNG ~150KB chacune)
**Durée** : 91 secondes en parallèle (vs 4-5 min séquentiel)
**Script de référence** : `scripts/jury_3llms_jour3.py` (⚠️ vérifier existence)

## Choix des modèles (à l'époque — modèles depuis évolués, cf CLAUDE.md pour la liste verrouillée actuelle)

| Modèle | API endpoint | Force | Limite |
|---|---|---|---|
| Kimi K2.5 (⛔ périmé, utiliser K3) | Moonshot direct (`api.moonshot.ai/v1/chat/completions`) | Recettes les plus actionnables (chiffres précis) | max_tokens 4000 souvent insuffisant — passer à 8000 |
| GPT-4o | OpenAI direct (`api.openai.com/v1/chat/completions`) | Couverture complète, confirmation consensus | Recettes génériques |
| Gemini 2.5 Pro (⚠️ modèle daté, cf `gemini_models.py` pour version actuelle) | OpenRouter (`google/gemini-2.5-pro`) | Meilleur équilibre couverture + précision argumentée | — |

## Gotchas critiques (validés 2026-05-09, structurels probablement toujours valides)

### 1. Kimi : nom de modèle exact
- ❌ `kimi-latest` → 404 "Not found the model or Permission denied"
- Toujours vérifier le nom de modèle exact courant (K3) avant appel, ne jamais utiliser d'alias.

### 2. Kimi : temperature non supportée (à re-vérifier sur K3)
- ❌ `temperature: 0.3` → 400 "invalid temperature: only 1 is allowed for this model" (constaté sur K2.5)
- ✅ Omettre entièrement le champ `temperature` si l'erreur se reproduit

### 3. Kimi : URLs externes refusées
- ❌ Image URL catbox → 400 "unsupported image url"
- ✅ Base64 inline obligatoire : `data:image/png;base64,<...>`

### 4. GPT-4o : timeout sur catbox
- ❌ Image URL catbox → 400 "Timeout while downloading"
- ✅ Base64 inline obligatoire

### 5. GPT-5 (à l'époque) : org verification requise
- ❌ `gpt-5` sans org verification → 404 "must be verified to use the model"
- ✅ Fallback modèle vision alternatif si la vérification n'est pas faite

### 6. Gemini Pro direct : connection drop sur payload lourd
- ❌ Gemini API direct + 8 images base64 inline → "Remote end closed connection"
- ✅ OpenRouter accepte URLs catbox SANS timeout (route via leur infra)
- → Pour Gemini : passer par OpenRouter avec URLs catbox (plus stable que base64 inline)

## Pattern de payload (exemples, structure générale toujours valable)

### Kimi (base64 obligatoire)
```python
content = [{'type': 'text', 'text': BRIEF}]
for name, _ in FRAMES:
    with open(f"out/{name}.png", 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
    content.append({'type': 'text', 'text': f'\n--- Frame {name} ---'})
    content.append({'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}})
payload = {'model': 'kimi-k3', 'messages': [{'role': 'user', 'content': content}], 'max_tokens': 8000}
# PAS de temperature (a verifier sur K3)
```

### Gemini (URLs catbox via OpenRouter)
```python
content = [{'type': 'text', 'text': BRIEF}]
for name, url in FRAMES:
    content.append({'type': 'image_url', 'image_url': {'url': url}})
payload = {'model': 'google/gemini-2.5-pro', 'messages': [{'role': 'user', 'content': content}], 'temperature': 0.3, 'max_tokens': 4000}
# Endpoint: openrouter.ai/api/v1/chat/completions
# Mettre a jour le nom de modele Gemini selon la version verrouillee actuelle (gemini_models.py)
```

## Format brief recommandé

- Contexte projet (5-10 lignes max)
- Frames hostées + nom de référence
- 4 questions par template (bug factuel, hiérarchie info, identité distinctive, verdict KEEP/TWEAK/REWORK)
- Question transversale optionnelle (orientation design)
- "Pas de blabla. Verdict + corrections + forces, point."

Verdicts attendus : KEEP / TWEAK (avec quoi) / REWORK (vers quoi)

## Convergence et désaccord

- **Consensus 3/3** = action immédiate sans hésiter
- **Consensus 2/3** = action recommandée, doc le minoritaire pour archive
- **Pas de consensus** = trancher humainement (ne pas laisser au coin majorité)
