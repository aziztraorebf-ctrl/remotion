"""
Multi-Step Agent Research Pipeline
Decomposes a topic into sub-questions, researches each with web search,
expands for depth, then synthesizes into a comprehensive report with citations.

Pipeline: Decompose -> Research (parallel) -> Expand -> Synthesize
Uses: Grok (xAI) with web_search + x_search for all steps
"""

import os
import sys
import json
import time
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

RESEARCH_DIR = Path(__file__).parent
XAI_KEY = os.getenv("XAI_API_KEY")
API_URL = "https://api.x.ai/v1/responses"
MODEL = "grok-4-1-fast-reasoning"
FALLBACK_MODEL = "grok-4-1-fast"

CONTEXT = """CONTEXTE: Je produis des videos educatives animees (style Kurzgesagt/Brightside)
avec Remotion (React). Mes sujets couvrent tech, science, IA, productivite.
Duree cible: 8-15 minutes. Audience: francophones curieux (25-45 ans),
puis adaptation multilingue. Je cherche les MEILLEURES pratiques actuelles
de scriptwriting YouTube pour contenu educatif. Pas des conseils generiques
de 2020 - je veux ce qui FONCTIONNE en 2025-2026, valide par des donnees."""


def log(step, msg):
    timestamp = time.strftime("%H:%M:%S")
    print(f"[{timestamp}] [{step}] {msg}")


def call_grok(prompt, model=MODEL, tools=None):
    """Call xAI Responses API. Returns full response JSON."""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {XAI_KEY}"
    }
    payload = {
        "model": model,
        "input": prompt,
    }
    if tools:
        payload["tools"] = tools

    resp = requests.post(API_URL, headers=headers, json=payload, timeout=600)

    if resp.status_code != 200 and model == MODEL:
        log("API", f"{model} failed ({resp.status_code}), trying {FALLBACK_MODEL}...")
        payload["model"] = FALLBACK_MODEL
        resp = requests.post(API_URL, headers=headers, json=payload, timeout=600)

    if resp.status_code != 200:
        raise Exception(f"API error {resp.status_code}: {resp.text[:500]}")

    return resp.json()


def extract_text_and_urls(data):
    """Extract text and citation URLs from xAI Responses API output."""
    text = ""
    urls = []

    for item in data.get("output", []):
        if item.get("type") == "message":
            for content in item.get("content", []):
                if content.get("type") == "output_text":
                    text += content.get("text", "")
                    for annotation in content.get("annotations", []):
                        if annotation.get("type") == "url_citation":
                            url_entry = {
                                "url": annotation.get("url", ""),
                                "title": annotation.get("title", ""),
                            }
                            if url_entry["url"] and url_entry not in urls:
                                urls.append(url_entry)

    return text, urls


# --- Step 1: Decompose topic into sub-questions ---

def decompose_topic(topic_prompt):
    """Break down the research topic into 6-8 specific sub-questions."""
    log("DECOMPOSE", "Breaking topic into sub-questions...")

    prompt = f"""Tu es un chercheur expert. Decompose le sujet de recherche suivant
en 6 a 8 sous-questions SPECIFIQUES et RECHERCHABLES.

Chaque sous-question doit :
- Etre suffisamment precise pour une recherche web ciblee
- Couvrir un angle different du sujet
- Etre formulee pour obtenir des donnees factuelles, pas des opinions

SUJET:
{topic_prompt}

Reponds UNIQUEMENT avec une liste numerotee (1. 2. 3. etc.), une question par ligne.
Pas d'introduction ni de conclusion."""

    data = call_grok(prompt)
    text, _ = extract_text_and_urls(data)

    questions = []
    for line in text.strip().split("\n"):
        line = line.strip()
        match = re.match(r"^\d+[\.\)]\s*(.+)", line)
        if match:
            questions.append(match.group(1).strip())

    log("DECOMPOSE", f"Generated {len(questions)} sub-questions")
    for i, q in enumerate(questions, 1):
        log("DECOMPOSE", f"  Q{i}: {q}")

    return questions


# --- Step 2: Research each sub-question with web search ---

def research_question(index, question):
    """Research a single sub-question using Grok + web_search + x_search."""
    log(f"RESEARCH-Q{index}", f"Searching: {question[:80]}...")
    start = time.time()

    prompt = f"""{CONTEXT}

Recherche approfondie sur la question suivante. Utilise le web et X/Twitter
pour trouver des donnees RECENTES (2024-2026), des etudes, des exemples concrets,
et des sources fiables.

QUESTION: {question}

Instructions:
- Cite tes sources avec URLs
- Priorise les donnees quantitatives et les etudes
- Inclus des exemples concrets de creators/channels
- Minimum 500 mots de contenu substantiel"""

    data = call_grok(
        prompt,
        tools=[{"type": "web_search"}, {"type": "x_search"}]
    )
    text, urls = extract_text_and_urls(data)
    elapsed = time.time() - start

    log(f"RESEARCH-Q{index}", f"Done in {elapsed:.0f}s - {len(text)} chars, {len(urls)} URLs")
    return {"question": question, "text": text, "urls": urls, "index": index}


# --- Step 3: Expand each research result for depth ---

def expand_research(index, question, initial_text, initial_urls):
    """Expand a research result with more depth, examples, and data."""
    log(f"EXPAND-Q{index}", f"Expanding: {question[:60]}...")
    start = time.time()

    url_list = "\n".join([f"- {u['title']}: {u['url']}" for u in initial_urls])

    prompt = f"""{CONTEXT}

Tu as deja effectue une recherche initiale sur cette question.
Maintenant, APPROFONDIS avec des details supplementaires.

QUESTION: {question}

RECHERCHE INITIALE:
{initial_text[:4000]}

SOURCES DEJA TROUVEES:
{url_list}

Instructions pour l'expansion:
- Ajoute des EXEMPLES CONCRETS supplementaires (channels, videos specifiques)
- Ajoute des DONNEES CHIFFREES (statistiques, pourcentages, etudes)
- Ajoute du CONTEXTE qui aide a comprendre le "pourquoi" derriere les tendances
- Cherche des sources COMPLEMENTAIRES (pas les memes)
- NE REPETE PAS ce qui est deja dans la recherche initiale
- Minimum 400 mots de NOUVEAU contenu"""

    data = call_grok(
        prompt,
        tools=[{"type": "web_search"}, {"type": "x_search"}]
    )
    text, urls = extract_text_and_urls(data)
    elapsed = time.time() - start

    log(f"EXPAND-Q{index}", f"Done in {elapsed:.0f}s - {len(text)} chars, {len(urls)} new URLs")
    return {"text": text, "urls": urls}


# --- Step 4: Synthesize all research into final report ---

def synthesize(topic_prompt, research_results):
    """Combine all research into a unified report with citations."""
    log("SYNTHESIZE", "Building final report from all research...")
    start = time.time()

    all_urls = []
    research_blocks = []

    for r in research_results:
        block = f"### Sous-question: {r['question']}\n\n"
        block += f"**Recherche initiale:**\n{r['text']}\n\n"
        if r.get("expanded_text"):
            block += f"**Approfondissement:**\n{r['expanded_text']}\n\n"

        for u in r["urls"] + r.get("expanded_urls", []):
            if u not in all_urls:
                all_urls.append(u)

        research_blocks.append(block)

    combined = "\n---\n\n".join(research_blocks)

    url_ref = "\n".join([f"[{i+1}] {u['title']} - {u['url']}" for i, u in enumerate(all_urls)])

    prompt = f"""Tu es un expert en scriptwriting video YouTube et en creation de contenu educatif.

MISSION: Synthetiser les recherches ci-dessous en un RAPPORT UNIQUE, STRUCTURE et COMPLET.

CONTEXTE ORIGINAL:
{topic_prompt}

TOUTES LES RECHERCHES:
{combined[:25000]}

TOUTES LES SOURCES COLLECTEES:
{url_ref[:5000]}

INSTRUCTIONS DE SYNTHESE:
1. Organise le rapport en sections thematiques coherentes (pas par sous-question)
2. Chaque affirmation importante doit etre soutenue par une source [Numero]
3. Priorise les insights ACTIONABLES pour un createur de videos educatives animees
4. Identifie les CONVERGENCES entre les differentes recherches
5. Signale les CONTRADICTIONS quand il y en a
6. Inclus une section "Recommandations pratiques" a la fin
7. Rapport MINIMUM 3000 mots
8. Termine avec la BIBLIOGRAPHIE COMPLETE (toutes les URLs numerotees)

FORMAT: Markdown avec titres ##, sous-titres ###, listes, et citations [N] inline."""

    data = call_grok(prompt)
    text, _ = extract_text_and_urls(data)
    elapsed = time.time() - start

    log("SYNTHESIZE", f"Done in {elapsed:.0f}s - {len(text)} chars")
    return text, all_urls


# --- Main orchestration ---

def make_slug(topic):
    """Convert topic text to a filesystem-safe slug for filenames."""
    slug = re.sub(r"[^a-z0-9]+", "_", topic.lower().strip())
    slug = slug.strip("_")[:60]
    return slug


def main():
    if len(sys.argv) < 2:
        print("Usage: python -u multi_step_research.py \"Your research topic here\"")
        print()
        print("Example:")
        print('  python -u multi_step_research.py "Comment fonctionne la memoire humaine"')
        print('  python -u multi_step_research.py "Les meilleures strategies SEO YouTube 2026"')
        sys.exit(1)

    topic = " ".join(sys.argv[1:])
    slug = make_slug(topic)
    timestamp = time.strftime("%Y%m%d_%H%M")

    print("=" * 60)
    print("MULTI-STEP AGENT RESEARCH PIPELINE")
    print("=" * 60)
    print(f"Topic: {topic}")
    print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Model: {MODEL} (fallback: {FALLBACK_MODEL})")
    print(f"Output: {RESEARCH_DIR}")
    print(f"API Key: {'OK' if XAI_KEY else 'MISSING'}")
    print()

    if not XAI_KEY:
        print("ERROR: XAI_API_KEY not found in .env")
        sys.exit(1)

    topic_prompt = f"""{CONTEXT}

Conduis une recherche approfondie sur le sujet suivant:
{topic}

Couvre tous les angles pertinents: donnees factuelles, tendances actuelles (2024-2026),
etudes et statistiques, exemples concrets, perspectives d'experts, et recommandations pratiques."""

    total_start = time.time()

    # Step 1: Decompose
    print("\n" + "=" * 40)
    print("STEP 1/4: DECOMPOSITION")
    print("=" * 40)
    questions = decompose_topic(topic_prompt)
    if len(questions) < 3:
        log("ERROR", f"Only {len(questions)} questions generated. Aborting.")
        sys.exit(1)

    # Step 2: Research in parallel
    print("\n" + "=" * 40)
    print(f"STEP 2/4: PARALLEL RESEARCH ({len(questions)} questions)")
    print("=" * 40)

    research_results = [None] * len(questions)
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures = {
            pool.submit(research_question, i + 1, q): i
            for i, q in enumerate(questions)
        }
        for future in as_completed(futures):
            idx = futures[future]
            try:
                research_results[idx] = future.result()
            except Exception as e:
                log(f"RESEARCH-Q{idx+1}", f"FAILED: {e}")
                research_results[idx] = {
                    "question": questions[idx],
                    "text": f"[Research failed: {e}]",
                    "urls": [],
                    "index": idx + 1
                }

    # Step 3: Expand each result
    print("\n" + "=" * 40)
    print(f"STEP 3/4: EXPANSION ({len(questions)} questions)")
    print("=" * 40)

    for r in research_results:
        if not r or "[Research failed" in r.get("text", ""):
            continue
        try:
            expansion = expand_research(
                r["index"], r["question"], r["text"], r["urls"]
            )
            r["expanded_text"] = expansion["text"]
            r["expanded_urls"] = expansion["urls"]
        except Exception as e:
            log(f"EXPAND-Q{r['index']}", f"FAILED: {e}")
            r["expanded_text"] = ""
            r["expanded_urls"] = []

    # Step 4: Synthesize
    print("\n" + "=" * 40)
    print("STEP 4/4: SYNTHESIS")
    print("=" * 40)

    report, all_urls = synthesize(topic_prompt, research_results)

    total_elapsed = time.time() - total_start

    # Save report
    report_name = f"multistep_{slug}_{timestamp}.md"
    report_path = RESEARCH_DIR / report_name
    with open(report_path, "w") as f:
        f.write(f"# Multi-Step Deep Research: {topic}\n")
        f.write(f"## Pipeline: Decompose -> Research -> Expand -> Synthesize\n")
        f.write(f"## Model: {MODEL} + web_search + x_search\n")
        f.write(f"## Date: {time.strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"## Sub-questions researched: {len(questions)}\n")
        f.write(f"## Sources collected: {len(all_urls)}\n")
        f.write(f"## Total time: {total_elapsed:.0f}s\n\n")
        f.write("---\n\n")
        f.write(report)
    log("SAVE", f"Report saved: {report_path}")

    # Save sources
    sources_name = f"multistep_{slug}_{timestamp}_sources.json"
    sources_path = RESEARCH_DIR / sources_name
    with open(sources_path, "w") as f:
        json.dump({
            "topic": topic,
            "total_sources": len(all_urls),
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "model": MODEL,
            "sub_questions": len(questions),
            "sources": all_urls
        }, f, indent=2, ensure_ascii=False)
    log("SAVE", f"Sources saved: {sources_path}")

    # Summary
    print("\n" + "=" * 60)
    print("PIPELINE COMPLETE")
    print("=" * 60)
    print(f"Topic: {topic}")
    print(f"Total time: {total_elapsed:.0f}s ({total_elapsed/60:.1f} min)")
    print(f"Sub-questions: {len(questions)}")
    print(f"Sources collected: {len(all_urls)}")
    print(f"Report length: {len(report)} chars")
    print(f"Report: {report_path}")
    print(f"Sources: {sources_path}")


if __name__ == "__main__":
    main()
