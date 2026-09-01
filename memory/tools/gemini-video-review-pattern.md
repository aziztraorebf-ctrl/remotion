# Gemini 3.1 Pro — analyse vidéo MP4 complète via Files API (pattern validé 2026-05-31)

Gemini 3.1 Pro analyse une vidéo MP4 complète et retourne des fix_code_values actionnables.

**Pattern Python (nouveau SDK google.genai) :**
```python
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# 1. Upload
video_file = client.files.upload(file=VIDEO_PATH, config=types.UploadFileConfig(mime_type="video/mp4"))

# 2. Attendre ACTIVE
while video_file.state.name == "PROCESSING":
    time.sleep(3)
    video_file = client.files.get(name=video_file.name)

# 3. Analyser
response = client.models.generate_content(
    model="gemini-3.1-pro-preview",
    contents=[
        types.Part.from_uri(file_uri=video_file.uri, mime_type="video/mp4"),
        types.Part(text=PROMPT),  # Part.from_text() ne fonctionne pas — utiliser Part(text=...)
    ],
    config=types.GenerateContentConfig(max_output_tokens=4000, temperature=0.2)
)

# 4. Cleanup
client.files.delete(name=video_file.name)
```

**Prompt format :** demander JSON structuré avec `fix_code_values` : `{element, propriete, valeur_avant, valeur_apres}` → directement applicables au code.

**Coût :** ~$0.05-0.10 par review vidéo 109s.
**Erreur connue :** `Part.from_text(text)` → TypeError (2 args). Utiliser `Part(text=PROMPT)`.
**Usage :** envoyer vidéo complète après render, pas frame par frame.

Complète `tools/review-video-llm-scripts.md` (gotchas IPv6/force_ipv4, Kimi vidéo native, bug 16:9) et
`tools/gemini.md` (migration SDK google.genai générique) sans les dupliquer — ce fichier-ci est le
pattern minimal complet spécifique à l'upload+analyse VIDÉO (pas image) via Files API.

---
Migré depuis auto-memory (`feedback_gemini-video-review-pattern.md`) le 2026-08-31, contenu original inchangé.
