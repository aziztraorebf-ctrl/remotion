#!/usr/bin/env python3
"""Generate a storyboard image using Nano Banana Pro API."""
import sys
import os

from google import genai
from google.genai import types


def generate(prompt: str, output_path: str) -> None:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="nano-banana-pro-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"]
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            raw = part.inline_data.data
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(raw)
            print(f"OK: {output_path} ({len(raw):,} bytes)")
            return
        elif part.text:
            print(f"TEXT: {part.text[:200]}")

    print("ERROR: No image in response")
    sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_image.py <output_path> <prompt>")
        sys.exit(1)
    generate(prompt=sys.argv[2], output_path=sys.argv[1])
