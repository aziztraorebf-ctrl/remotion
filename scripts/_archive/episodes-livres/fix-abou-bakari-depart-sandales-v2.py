"""Surgical edit v2 — force visible sandals on Abou Bakari in scene-name-v6."""

import asyncio
import io
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

SOURCE = ROOT / "public" / "assets" / "abou-bakari" / "scenes" / "scene-name-v6.png"
OUT = ROOT / "public" / "assets" / "abou-bakari" / "scenes" / "scene-name-v7.png"

PROMPT = """Edit this image with ONE correction only. Change nothing else.

PRESERVE EXACTLY everything in this image — the composition, the ship, the guards, the palace, the character's tunic, head wrap, body position. Change only the feet.

CHANGE ONLY: At the very bottom of the central character (the one seen from behind in the indigo tunic), his feet are currently bare. Replace the bare feet with brown leather sandals — flat sandal straps across the top of each foot, visible at the hem of his tunic. The sandals should peek out from under the hem. Brown leather color, flat cartoon style, thick black outline consistent with the rest of the image.

The sandals MUST be visible. If the tunic hem is too low, slightly raise the hem just enough to reveal the sandals — but change nothing else.

BARE FEET: replace with sandals.
SANDALS: must be visible at the bottom of the character.
EVERYTHING ELSE: identical, unchanged."""


async def main() -> None:
    print(f"Surgical edit v2: force sandals on {SOURCE.name}")
    print(f"Cost: ~$0.04")

    contents = [
        types.Part.from_bytes(data=SOURCE.read_bytes(), mime_type="image/png"),
        PROMPT,
    ]

    response = await asyncio.to_thread(
        client.models.generate_content,
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
            temperature=0.5,
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data and "image" in part.inline_data.mime_type:
            img = Image.open(io.BytesIO(part.inline_data.data))
            img.save(OUT)
            print(f"SAVED: {OUT.name} ({img.size[0]}x{img.size[1]})")
            return

    print("ERROR: no image in response")


if __name__ == "__main__":
    asyncio.run(main())
