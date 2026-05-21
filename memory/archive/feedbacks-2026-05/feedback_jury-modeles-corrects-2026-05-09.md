---
name: Modèles jury LLM corrects (MAJ 2026-05-09)
description: Kimi K2.6 (pas K2.5), Gemini 3.1 Flash Lite (pas 2.5 Pro), GPT-4o direct — et gotcha K2.6 thinking model
type: feedback
---

Ne jamais utiliser les anciens modèles jury. Aziz a corrigé explicitement.

**Modèles corrects :**
- Kimi → `kimi-k2.6` (Moonshot API)
- Gemini → `models/gemini-3.1-flash-lite` (Google genai SDK direct, PAS OpenRouter)
- GPT → `gpt-4o` (OpenAI API directe, PAS OpenRouter)

**Gotcha Kimi K2.6 — thinking model :**
- La réponse va dans `reasoning_content`, `content` peut être vide (0 chars).
- `max_tokens: 4000` = 0 chars retournés. Minimum requis : `max_tokens: 16000`.
- Lire : `msg.get("content") or msg.get("reasoning_content") or ""`
- Timeout 300s. Images en base64 local (pas URL réseau).

**Why:** Aziz a remarqué que j'utilisais systématiquement Gemini 2.5 Pro au lieu de 3.1 Flash. Correction session Jour 4.

**How to apply:** Avant tout script jury, vérifier les 3 model IDs. Scripts de référence : `scripts/jury_3llms_jour4.py`.
