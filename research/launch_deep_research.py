"""
Deep Research Launcher - Triangulation Multi-LLM
Launches parallel deep research on OpenAI, Gemini, and Grok APIs.
Results are saved as .md files in the research/ directory.
"""

import os
import json
import time
import threading
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

RESEARCH_DIR = Path(__file__).parent
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
XAI_KEY = os.getenv("XAI_API_KEY")

CONTEXT = """CONTEXTE: Je produis des videos educatives animees (style Kurzgesagt/Brightside)
avec Remotion (React). Mes sujets couvrent tech, science, IA, productivite.
Duree cible: 8-15 minutes. Audience: francophones curieux (25-45 ans),
puis adaptation multilingue. Je cherche les MEILLEURES pratiques actuelles
de scriptwriting YouTube pour contenu educatif. Pas des conseils generiques
de 2020 - je veux ce qui FONCTIONNE en 2025-2026, valide par des donnees."""

PROMPT_OPENAI = CONTEXT + """

Conduis une deep research sur les meilleures pratiques de scriptwriting
YouTube pour contenu educatif en 2025-2026.

FOCUS: Frameworks structures et methodologies prouvees

1. STRUCTURES NARRATIVES - Quels frameworks ont le meilleur retention rate?
   Comparatif: Probleme-Solution vs Curiosity Gap vs Story-driven
   Comment les top creators (Kurzgesagt, Veritasium, Ali Abdaal,
   Mark Rober) structurent leurs scripts?
   Y a-t-il des etudes/analyses sur la structure optimale par duree?

2. HOOKS (30 premieres secondes) - Quelles formulas de hook ont le meilleur CTR mesure?
   Statistical shock vs Question provocante vs Story opening:
   lequel performe le mieux pour contenu educatif?
   Exemples concrets de hooks qui ont genere >10% CTR

3. PACING & RETENTION - Frequence optimale des pattern interrupts (donnees?)
   Comment maintenir AVD >50% sur 10+ minutes?
   Techniques de "open loops" et foreshadowing documentees
   Quand et comment utiliser les transitions

4. CTA & CONCLUSION - Placement optimal du CTA (donnees?)
   Techniques de conclusion qui maximisent engagement post-video

5. SPECIFIQUE CONTENU EDUCATIF - Comment vulgariser sans simplifier excessivement?
   Balance entertainment vs education (donnees sur ce que l'audience prefere)
   Techniques pour rendre les donnees/stats visuellement interessantes dans un script

OUTPUT: Rapport 2500+ mots avec citations inline [Source, Annee].
Inclure une bibliographie complete. Prioriser sources peer-reviewed,
analyses data-driven, et case studies documentes. Eviter opinions sans donnees."""

PROMPT_GEMINI = CONTEXT + """

Conduis une deep research academique et statistique sur l'efficacite
du scriptwriting video educatif.

FOCUS: Donnees quantitatives, etudes academiques, meta-analyses

1. ETUDES ACADEMIQUES SUR LA RETENTION VIDEO
   - Quelles recherches (2023-2026) mesurent l'impact de la structure
     narrative sur la retention?
   - Donnees sur l'attention span par segment (intro, corps, conclusion)
   - Etudes sur le "cognitive load" en contenu educatif video
   - Research sur l'apprentissage via video vs texte vs interactif

2. DONNEES YOUTUBE ANALYTICS PUBLIQUES
   - Meta-analyses sur CTR par type de hook (si disponibles)
   - Correlation structure script vs AVD (Average View Duration)
   - Donnees sur la duree optimale par niche educative
   - Impact mesure des pattern interrupts sur retention curves

3. PSYCHOLOGIE COGNITIVE APPLIQUEE AU SCRIPT
   - Storytelling et memoire: quelles techniques scientifiquement prouvees?
   - Effet de curiosite (curiosity gap): recherches de Loewenstein appliquees
   - Dual coding theory: comment le script doit-il s'adapter aux visuels?
   - Spaced repetition dans un format video (callback techniques)

4. COMPARAISON INTERNATIONALE
   - Differences culturelles dans les preferences de contenu educatif
   - Francophone vs Anglophone: donnees sur les preferences de format?
   - Etudes sur l'efficacite du doublage vs sous-titres vs re-creation

5. TENDANCES 2025-2026
   - Impact de l'IA sur les attentes des viewers
   - Evolution des metriques YouTube (nouveau algorithme?)
   - Shift dans les preferences audience (long-form vs short-form, donnees)

OUTPUT: Rapport 2500+ mots. Prioriser: meta-analyses, etudes N>500,
sources peer-reviewed, donnees gouvernementales/institutionnelles.
Inclure intervalles de confiance quand disponibles.
Citations inline avec methodologie notee."""

PROMPT_GROK = CONTEXT + """

Research les tendances ACTUELLES et non-conventionnelles du scriptwriting
YouTube pour contenu educatif. Je ne veux PAS les conseils classiques
qu'on trouve partout. Je veux ce qui est NOUVEAU, CONTROVERSE,
ou CONTRE-INTUITIF.

FOCUS: Ce qui marche MAINTENANT sur le terrain, pas dans les manuels

1. TENDANCES EMERGENTES (dernier 6 mois)
   - Quels nouveaux formats de script emergent sur YouTube educatif?
   - Y a-t-il un backlash contre certaines techniques classiques
     (ex: "Hey guys" intros, engagement bait)?
   - Qu'est-ce que les top creators testent en ce moment?
   - Discussions Twitter/X et Reddit sur ce qui fonctionne vs ce qui est mort

2. CONTRE-INTUITIONS DOCUMENTEES
   - Techniques classiques qui ne marchent PLUS (avec preuves)
   - Creators qui cassent les regles et reussissent: quels patterns?
   - Le "anti-polish" trend: authenticite > production value?
     Donnees recentes?
   - Scripts longs vs courts: le debat actuel chez les pros

3. L'ANGLE IA
   - Comment les creators utilisent l'IA pour scriptwriting AUJOURD'HUI?
   - Sentiment communaute sur AI-generated scripts (acceptance vs rejet?)
   - Outils specifiques utilises par les top creators
     (pas les outils grand public, les vrais workflows pro)
   - YouTube detecte-t-il les scripts IA? Consequences?

4. CE QUE L'AUDIENCE DIT VRAIMENT
   - Complaints les plus frequentes sur le contenu educatif YouTube
   - Ce que les viewers VEULENT vs ce que les creators PENSENT qu'ils veulent
   - Subreddits r/youtube, r/NewTubers, r/videography: consensus actuel?
   - Fatigue de format: quels styles les gens en ont marre?

5. INSIDER PERSPECTIVES
   - Interviews recentes de top creators sur leur process
   - Behind-the-scenes de channels comme Kurzgesagt, Wendover,
     Real Engineering
   - Earnings calls ou reports de YouTube/Google sur le contenu educatif
   - Conference talks (VidCon, etc.) sur scriptwriting 2025-2026

OUTPUT: Rapport 2500+ mots. Prioriser: discussions communautaires recentes,
tweets/threads de creators, posts Reddit, interviews, etudes de cas.
Citer les sources avec liens quand possible.
Etre provocant et honnete, pas diplomatique."""


results = {}
errors = {}


def log(provider, msg):
    timestamp = time.strftime("%H:%M:%S")
    print(f"[{timestamp}] [{provider}] {msg}")


# --- OpenAI: gpt-5 + web_search_preview via Responses API ---
def run_openai_research():
    provider = "OpenAI"
    log(provider, "Starting research with gpt-5 + web_search_preview...")

    try:
        resp = requests.post(
            "https://api.openai.com/v1/responses",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENAI_KEY}"
            },
            json={
                "model": "gpt-5",
                "input": PROMPT_OPENAI,
                "tools": [{"type": "web_search_preview"}],
                "reasoning": {"effort": "high"}
            },
            timeout=600
        )

        if resp.status_code != 200:
            log(provider, f"gpt-5 error: {resp.status_code}")
            log(provider, f"Response: {resp.text[:500]}")

            # Fallback: gpt-4o + web search
            log(provider, "Trying fallback with gpt-4o + web_search_preview...")
            resp = requests.post(
                "https://api.openai.com/v1/responses",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {OPENAI_KEY}"
                },
                json={
                    "model": "gpt-4o",
                    "input": PROMPT_OPENAI,
                    "tools": [{"type": "web_search_preview"}]
                },
                timeout=300
            )

            if resp.status_code != 200:
                errors["openai"] = f"Status {resp.status_code}: {resp.text[:500]}"
                log(provider, f"Fallback also failed: {resp.status_code}")
                return

        data = resp.json()
        text = extract_openai_text(data)
        if text:
            results["openai"] = text
            log(provider, f"Completed! Length: {len(text)} chars")
        else:
            errors["openai"] = f"No text in response: {json.dumps(data)[:500]}"
            log(provider, "No text found in response")

    except Exception as e:
        errors["openai"] = str(e)
        log(provider, f"Exception: {e}")


def extract_openai_text(data):
    """Extract text from OpenAI Responses API output."""
    text = ""
    for item in data.get("output", []):
        if item.get("type") == "message":
            for content in item.get("content", []):
                if content.get("type") == "output_text":
                    text += content.get("text", "")
    return text


# --- Gemini: Deep Research via Interactions API ---
def run_gemini_research():
    provider = "Gemini"
    log(provider, "Starting deep research via Interactions API...")

    try:
        # Create background deep research task
        resp = requests.post(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            headers={
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_KEY
            },
            json={
                "input": PROMPT_GEMINI,
                "agent": "deep-research-pro-preview-12-2025",
                "background": True
            },
            timeout=60
        )

        if resp.status_code != 200:
            log(provider, f"Interactions API error: {resp.status_code}")
            log(provider, f"Response: {resp.text[:500]}")

            # Fallback: gemini-2.0-flash with Google Search grounding
            log(provider, "Trying fallback with gemini-2.0-flash + Google Search...")
            resp = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{"parts": [{"text": PROMPT_GEMINI}]}],
                    "tools": [{"google_search": {}}]
                },
                timeout=300
            )

            if resp.status_code != 200:
                errors["gemini"] = f"Status {resp.status_code}: {resp.text[:500]}"
                log(provider, f"Fallback also failed: {resp.status_code}")
                return

            data = resp.json()
            text = ""
            for candidate in data.get("candidates", []):
                for part in candidate.get("content", {}).get("parts", []):
                    text += part.get("text", "")

            results["gemini"] = text
            log(provider, f"Fallback completed. Length: {len(text)} chars")
            return

        data = resp.json()
        # Extract interaction ID - could be "id", "interactionId", or "name"
        interaction_id = data.get("id") or data.get("interactionId") or data.get("name")
        log(provider, f"Interaction created: {interaction_id}")
        log(provider, f"Full response keys: {list(data.keys())}")

        if not interaction_id:
            log(provider, f"No interaction ID found. Full response: {json.dumps(data)[:1000]}")
            errors["gemini"] = "No interaction ID in response"
            return

        # Poll for completion
        max_polls = 120  # 30 min max
        for i in range(max_polls):
            time.sleep(15)
            poll = requests.get(
                f"https://generativelanguage.googleapis.com/v1beta/interactions/{interaction_id}",
                headers={"x-goog-api-key": GEMINI_KEY},
                timeout=30
            )

            if poll.status_code != 200:
                log(provider, f"Poll error: {poll.status_code} - {poll.text[:200]}")
                continue

            poll_data = poll.json()
            status = poll_data.get("status", "unknown")
            log(provider, f"Poll {i+1}: status={status}")

            if status in ("COMPLETED", "completed"):
                text = extract_gemini_text(poll_data)
                if text:
                    results["gemini"] = text
                    log(provider, f"Completed! Length: {len(text)} chars")
                else:
                    log(provider, f"Completed but no text. Keys: {list(poll_data.keys())}")
                    log(provider, f"Data preview: {json.dumps(poll_data)[:1000]}")
                    errors["gemini"] = "Completed but no text extracted"
                return
            elif status in ("FAILED", "failed"):
                errors["gemini"] = f"Failed: {json.dumps(poll_data)[:500]}"
                log(provider, "Interaction failed")
                return

        errors["gemini"] = "Timeout after 30 minutes"
        log(provider, "Timeout")

    except Exception as e:
        errors["gemini"] = str(e)
        log(provider, f"Exception: {e}")


def extract_gemini_text(data):
    """Extract text from Gemini Interactions API response."""
    # Try outputs array (Python SDK style)
    outputs = data.get("outputs", [])
    if outputs:
        for output in outputs:
            if isinstance(output, dict) and "text" in output:
                return output["text"]

    # Try result.parts (REST style)
    result = data.get("result", {})
    if result:
        parts = result.get("parts", [])
        text = ""
        for part in parts:
            if isinstance(part, dict):
                text += part.get("text", "")
        if text:
            return text

    # Try output array
    output_arr = data.get("output", [])
    if output_arr:
        text = ""
        for item in output_arr:
            if isinstance(item, dict):
                text += item.get("text", "")
        if text:
            return text

    # Try direct text field
    if "text" in data:
        return data["text"]

    return ""


# --- Grok: grok-4-1-fast-reasoning + web_search + x_search ---
def run_grok_research():
    provider = "Grok"
    log(provider, "Starting research with grok-4-1-fast-reasoning + web_search + x_search...")

    try:
        resp = requests.post(
            "https://api.x.ai/v1/responses",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {XAI_KEY}"
            },
            json={
                "model": "grok-4-1-fast-reasoning",
                "input": PROMPT_GROK,
                "tools": [
                    {"type": "web_search"},
                    {"type": "x_search"}
                ]
            },
            timeout=600
        )

        if resp.status_code != 200:
            log(provider, f"Responses API error: {resp.status_code}")
            log(provider, f"Response: {resp.text[:500]}")

            # Fallback: try grok-4-1-fast without reasoning
            log(provider, "Trying fallback with grok-4-1-fast...")
            resp = requests.post(
                "https://api.x.ai/v1/responses",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {XAI_KEY}"
                },
                json={
                    "model": "grok-4-1-fast",
                    "input": PROMPT_GROK,
                    "tools": [
                        {"type": "web_search"},
                        {"type": "x_search"}
                    ]
                },
                timeout=600
            )

            if resp.status_code != 200:
                log(provider, f"Fallback 1 also failed: {resp.status_code}")
                log(provider, f"Response: {resp.text[:500]}")

                # Fallback 2: chat completions
                log(provider, "Trying fallback with chat completions...")
                resp = requests.post(
                    "https://api.x.ai/v1/chat/completions",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {XAI_KEY}"
                    },
                    json={
                        "model": "grok-3-fast",
                        "messages": [
                            {"role": "system", "content": "You are a research analyst specializing in YouTube content creation and scriptwriting trends. Provide detailed, data-backed analysis with sources."},
                            {"role": "user", "content": PROMPT_GROK}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 16000
                    },
                    timeout=300
                )

                if resp.status_code != 200:
                    errors["grok"] = f"Status {resp.status_code}: {resp.text[:500]}"
                    log(provider, f"All fallbacks failed: {resp.status_code}")
                    return

                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                results["grok"] = text
                log(provider, f"Chat completions fallback completed. Length: {len(text)} chars")
                return

        data = resp.json()
        text = extract_openai_text(data)  # xAI uses same format as OpenAI Responses API
        if text:
            results["grok"] = text
            log(provider, f"Completed! Length: {len(text)} chars")
        else:
            errors["grok"] = f"No text in response: {json.dumps(data)[:500]}"
            log(provider, "No text found in response")

    except Exception as e:
        errors["grok"] = str(e)
        log(provider, f"Exception: {e}")


def save_results():
    """Save all results to .md files"""

    if "openai" in results:
        path = RESEARCH_DIR / "01_chatgpt_scriptwriting_frameworks.md"
        with open(path, "w") as f:
            f.write("# Deep Research: YouTube Scriptwriting Frameworks\n")
            f.write("## Source: OpenAI GPT-5 + Web Search\n")
            f.write(f"## Date: {time.strftime('%Y-%m-%d %H:%M')}\n\n")
            f.write("---\n\n")
            f.write(results["openai"])
        print(f"\nSaved: {path}")

    if "gemini" in results:
        path = RESEARCH_DIR / "02_gemini_scriptwriting_academic.md"
        with open(path, "w") as f:
            f.write("# Deep Research: Academic Analysis of Video Scriptwriting\n")
            f.write("## Source: Google Gemini Deep Research (Interactions API)\n")
            f.write(f"## Date: {time.strftime('%Y-%m-%d %H:%M')}\n\n")
            f.write("---\n\n")
            f.write(results["gemini"])
        print(f"\nSaved: {path}")

    if "grok" in results:
        path = RESEARCH_DIR / "03_grok_scriptwriting_trends.md"
        with open(path, "w") as f:
            f.write("# Deep Research: Current Trends & Non-Conventional Scriptwriting\n")
            f.write("## Source: xAI Grok 4.1 Fast (Web Search + X Search)\n")
            f.write(f"## Date: {time.strftime('%Y-%m-%d %H:%M')}\n\n")
            f.write("---\n\n")
            f.write(results["grok"])
        print(f"\nSaved: {path}")

    # Save errors if any
    if errors:
        path = RESEARCH_DIR / "errors.json"
        with open(path, "w") as f:
            json.dump(errors, f, indent=2)
        print(f"\nErrors saved: {path}")


if __name__ == "__main__":
    print("=" * 60)
    print("DEEP RESEARCH LAUNCHER - Triangulation Multi-LLM")
    print("=" * 60)
    print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Output: {RESEARCH_DIR}")
    print()

    # Check keys
    for name, key in [("OpenAI", OPENAI_KEY), ("Gemini", GEMINI_KEY), ("xAI", XAI_KEY)]:
        status = "OK" if key else "MISSING"
        print(f"  {name} API Key: {status}")
    print()

    print("Models:")
    print("  OpenAI: gpt-5 + web_search_preview")
    print("  Gemini: deep-research-pro-preview-12-2025 (Interactions API)")
    print("  Grok:   grok-4-1-fast-reasoning + web_search + x_search")
    print()

    # Launch all 3 in parallel
    threads = [
        threading.Thread(target=run_openai_research, name="OpenAI"),
        threading.Thread(target=run_gemini_research, name="Gemini"),
        threading.Thread(target=run_grok_research, name="Grok"),
    ]

    print("Launching 3 research tasks in parallel...")
    print("This may take 5-30 minutes. Please wait.\n")

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    print("\n" + "=" * 60)
    print("ALL RESEARCH COMPLETE")
    print("=" * 60)

    print(f"\nResults: {len(results)}/3 succeeded")
    if errors:
        print(f"Errors: {len(errors)}/3 failed")
        for k, v in errors.items():
            print(f"  {k}: {v[:200]}")

    save_results()

    print("\nDone!")
