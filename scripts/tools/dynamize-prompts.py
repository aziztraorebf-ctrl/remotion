"""
Dynamize Prompts — Kimi DA brief -> Seedance Format 3 SECONDS
Takes a Kimi artistic direction brief and rewrites each clip prompt
into dynamic, cinematic Format 3 SECONDS prompts ready for Dreamina.

Usage:
    python -u scripts/dynamize-prompts.py kimi-brief.md
    python -u scripts/dynamize-prompts.py kimi-brief.md --clips 1,3,5
    python -u scripts/dynamize-prompts.py kimi-brief.md --output prompts-out.md
    python -u scripts/dynamize-prompts.py kimi-brief.md --model claude  (default)
    python -u scripts/dynamize-prompts.py kimi-brief.md --model gemini

Input: Markdown file with Kimi DA brief (narrative arcs, visual objects, tone per clip)
Output: Markdown file with one Format 3 SECONDS prompt per clip, ready to paste in Dreamina
"""

import argparse
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

# ============================================================
# SEEDANCE RULES SYSTEM PROMPT
# All 32 rules encoded so the LLM applies them automatically
# ============================================================

SYSTEM_PROMPT = """You are a Seedance 2.0 prompt engineer specialized in converting narrative artistic direction into dynamic, cinematic video prompts.

Your output format is ALWAYS Format 3 — SECONDS X TO Y.

## FORMAT TEMPLATE

```
@Image1 is the primary character identity. 2D vivid flat illustration style.

No text, no banners, no signs, no writing visible anywhere.
No unnecessary 360-degree turns. Without motion distortion. Without abrupt changes. The human body structure is normal.

SECONDS 0 TO 4: [description with EXPLOSIVE verbs, camera movement, micro-actions]
SECONDS 4 TO 8: [next beat, different camera angle, continuous action]
SECONDS 8 TO 12: [escalation or shift, another camera technique]
SECONDS 12 TO 15: [resolution — camera pulls back or steady, 2s quasi-static ending for frame chaining]

COLOR GRADE: [full palette description — warm/cold split if applicable]
```

## MANDATORY RULES (apply ALL of these, no exceptions)

### Structure
1. Start with "2D vivid flat illustration style" — NEVER omit
2. End with COLOR GRADE section — anchor the palette
3. Anti-text: "No text, no banners, no signs, no writing visible anywhere"
4. Anti-instructions header: "No unnecessary 360-degree turns. Without motion distortion. Without abrupt changes. The human body structure is normal."
5. Segment duration: 3-4s per segment for 15s clips. Maximum 4-5 segments.

### Dynamism (CRITICAL — this is why Kimi prompts fail when used directly)
6. EXPLOSIVE verbs in EVERY segment: SLAMS, SURGES, DROPS, SNAPS, SWEEPS, CRASHES, LAUNCHES, BURSTS, PRESSES, RISES, STRIKES
7. NEVER use: "stands", "holds", "slowly", "gently", "subtle", "quiet", "contemplative"
8. UPPERCASE for intensity peaks: "SNAP ZOOMS", "SLAMS fist", "SURGES forward"
9. Micro-actions in EVERY segment: wind in fabric, dust rising, fingers tightening, head turning, chest heaving
10. Sound cues guide tempo: "Sound: boots on gravel", "BOOM of cannon", "silence"

### Camera (vary across segments — NEVER same camera twice)
11. Use 3-4 DIFFERENT camera moves per clip. Pick from: aerial, snap zoom, dolly in, sweep, pull back, tracking, crane, low-angle, bird's-eye, orbital
12. NEVER orbit-only — that creates static contemplative videos
13. Last 2-3 seconds: camera STEADY or slow pull back (quasi-static for frame chaining)

### Style & Lighting
14. ZERO luminous metaphors: NEVER "beacon", "glow", "catches light", "gold light", "radiant" — Seedance makes objects EMIT light (magical halo). Use "contrasts sharply", "the only [color] object", "stands out against"
15. Color contrast = color saturation difference, NOT light emission
16. Chromatic contrast (if applicable): subject in dominant warm color, world desaturated around them

### Characters
17. Differentiate leader vs soldiers: "leader with [detail]" + "soldiers WITHOUT [detail]"
18. Specify directions: "down to his side", "toward the ground" — never just "forward"
19. No abrupt scale changes: medium shot to close-up hands = morphing. Keep consistent scale or change GRADUALLY with "dolly in"

### Violence & Sensitive Content
20. Implicit violence: describe DISAPPEARANCE, not absence. "COLLAPSE to knees, disappearing into thick smoke" — NOT "no bodies shown"
21. "Cut to" is censored — use "Camera shifts to frame"

### Endings (for frame chaining)
22. Last 2-3 seconds MUST be quasi-static: character standing, wind in fabric, dust settling
23. Final frame should be visually stable for extraction as next clip's reference

## YOUR TASK

You receive a Kimi artistic direction brief containing:
- Narrative arcs per clip
- Visual bridge objects (kepi, letter, dust, etc.)
- Tone and moral nuance per clip
- Chromatic placement suggestions

For EACH clip, you must:
1. Take Kimi's narrative vision (WHAT happens, WHY it matters)
2. Rewrite it as a Format 3 SECONDS prompt (HOW it looks in motion)
3. Apply ALL rules above — especially dynamism, camera variety, and anti-luminous-metaphors
4. Include bridge objects FROM Kimi's brief in the relevant segments
5. End with 2-3s quasi-static for frame chaining

Output each clip as a separate markdown section with the clip number as header.
Include a brief note after each prompt explaining which Kimi elements you preserved."""


def dynamize_with_claude(brief: str, clip_filter: list[int] | None = None) -> str:
    import anthropic

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not found in .env")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    user_msg = f"""Here is the Kimi artistic direction brief to dynamize:

---
{brief}
---

"""
    if clip_filter:
        user_msg += f"Only generate prompts for clips: {clip_filter}. Skip the others.\n\n"

    user_msg += """Generate one Format 3 SECONDS prompt per clip. Each prompt must be directly paste-able into Dreamina.

Remember:
- EXPLOSIVE verbs, not contemplative descriptions
- 3-4 different camera moves per clip
- Last 2-3s quasi-static for frame chaining
- Zero luminous metaphors
- Anti-instructions header
- COLOR GRADE section at the end of each prompt"""

    print("Calling Claude API (claude-sonnet-4-6)...")

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )

    return response.content[0].text


def dynamize_with_gemini(brief: str, clip_filter: list[int] | None = None) -> str:
    from google import genai
    from google.genai import types

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in .env")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    user_msg = f"""Here is the Kimi artistic direction brief to dynamize:

---
{brief}
---

"""
    if clip_filter:
        user_msg += f"Only generate prompts for clips: {clip_filter}. Skip the others.\n\n"

    user_msg += """Generate one Format 3 SECONDS prompt per clip. Each prompt must be directly paste-able into Dreamina.

Remember:
- EXPLOSIVE verbs, not contemplative descriptions
- 3-4 different camera moves per clip
- Last 2-3s quasi-static for frame chaining
- Zero luminous metaphors
- Anti-instructions header
- COLOR GRADE section at the end of each prompt"""

    print("Calling Gemini API (gemini-3.1-pro-preview)...")

    response = client.models.generate_content(
        model="models/gemini-3.1-pro-preview",
        contents=[user_msg],
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=8192,
        ),
    )

    return response.text


def main():
    parser = argparse.ArgumentParser(
        description="Dynamize Kimi DA brief into Seedance Format 3 SECONDS prompts"
    )
    parser.add_argument("brief", help="Path to Kimi DA brief markdown file")
    parser.add_argument(
        "--clips",
        help="Comma-separated clip numbers to generate (e.g. 1,3,5)",
        default=None,
    )
    parser.add_argument(
        "--output",
        help="Output file path (default: <brief>-dynamized.md)",
        default=None,
    )
    parser.add_argument(
        "--model",
        choices=["claude", "gemini"],
        default="claude",
        help="LLM to use for dynamization (default: claude)",
    )

    args = parser.parse_args()

    brief_path = Path(args.brief)
    if not brief_path.exists():
        print(f"ERROR: Brief file not found: {brief_path}")
        sys.exit(1)

    brief = brief_path.read_text()

    clip_filter = None
    if args.clips:
        clip_filter = [int(c.strip()) for c in args.clips.split(",")]

    output_path = Path(args.output) if args.output else brief_path.with_name(
        brief_path.stem + "-dynamized.md"
    )

    print(f"=== Dynamize Prompts ===")
    print(f"Brief: {brief_path}")
    print(f"Model: {args.model}")
    print(f"Clips: {clip_filter or 'all'}")
    print(f"Output: {output_path}")
    print()

    if args.model == "claude":
        result = dynamize_with_claude(brief, clip_filter)
    else:
        result = dynamize_with_gemini(brief, clip_filter)

    output_path.write_text(result)
    print(f"\nOK: {output_path}")
    print(f"Review the prompts, then paste each one into Dreamina with its ref image.")


if __name__ == "__main__":
    main()
