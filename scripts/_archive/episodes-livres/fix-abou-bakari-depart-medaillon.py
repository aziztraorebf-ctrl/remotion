"""Surgical edit — remove medallion from scene-name-v5, change nothing else."""

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

SOURCE = ROOT / "public" / "assets" / "abou-bakari" / "scenes" / "scene-name-v5.png"
OUT = ROOT / "public" / "assets" / "abou-bakari" / "scenes" / "scene-name-v6.png"

PROMPT = """Edit this image with ONE correction only — remove the gold medallion/pendant hanging from the character's neck. Change nothing else whatsoever.

PRESERVE EXACTLY:
- The entire composition, layout, framing
- The character seen from behind (his back toward camera)
- His indigo tunic, cloth head wrap, body position
- The royal ship with indigo sail and gold emblem ahead of him
- The guards flanking the steps on both sides
- The palace architecture in the background
- The fleet of pirogues on the water
- All colors, style, outlines, proportions
- Every other detail in the image

CHANGE ONLY: remove the gold medallion/pendant that hangs from the character's neck. Where the medallion was, show only the back of his neck and the collar of his tunic — clean, no pendant, no chain, no necklace of any kind.

NO medallion. NO pendant. NO necklace. NO chain. Just his tunic collar and bare neck where the medallion was."""


async def main() -> None:
    print(f"Surgical edit: remove medallion from {SOURCE.name}")
    print(f"Cost: ~$0.04")

    img_bytes = SOURCE.read_bytes()
    contents = [
        types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
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
