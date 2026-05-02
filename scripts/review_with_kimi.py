#!/usr/bin/env python3
"""
Kimi K2.5 Video/Image Reviewer via Moonshot AI API
Sends rendered video frames or images to Kimi K2.5 for expert pixel art review.
Includes OpenRouter fallback if Moonshot unavailable.
"""

import os
import sys
import base64
import json
import argparse
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv()

MOONSHOT_API_KEY = os.getenv('MOONSHOT_API_KEY')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
MOONSHOT_URL = 'https://api.moonshot.ai/v1/chat/completions'
OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

def encode_file_to_base64(filepath):
    """Encode image or video file to base64."""
    with open(filepath, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

def get_media_type(filepath):
    """Determine media type from file extension."""
    ext = Path(filepath).suffix.lower()
    if ext in ['.mp4', '.mov', '.avi', '.webm']:
        return 'video/mp4'
    elif ext in ['.jpg', '.jpeg']:
        return 'image/jpeg'
    elif ext in ['.png']:
        return 'image/png'
    elif ext in ['.webp']:
        return 'image/webp'
    else:
        return 'image/jpeg'

def send_to_kimi(filepath, custom_prompt=None):
    """Send file to Kimi K2.5 for review."""

    if not os.path.exists(filepath):
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    # Encode file
    print(f"Encoding {filepath}...")
    file_data = encode_file_to_base64(filepath)
    media_type = get_media_type(filepath)

    # Build prompt
    if custom_prompt:
        review_prompt = custom_prompt
    else:
        review_prompt = """Evaluate this video/image for pixel art quality and visual coherence. Assess:

1. **PERSONNAGES**: Character visibility, animation smoothness, movement logic
2. **BACKGROUND**: Composition, color harmony, lighting consistency, visual artifacts
3. **TEXTE & OVERLAYS**: Text readability, animation fluidity, CRT effects if present
4. **TRANSITIONS**: Fluidity between scenes, jarring cuts, compositing issues
5. **COHERENCE AUDIO/VISUEL**: Do visual elements match any implied audio context?
6. **DEBORDEMENTS ET COUPURES**: Elements outside frame, clipping, partial masking
7. **REDONDANCES**: Duplicate information in text/visual/narration

Provide:
- CRITIQUE: Specific visual observations (frame-by-frame if needed)
- VERDICT: Score /10 with reasoning
- TOP 3 PROBLEMS: Priority-ordered fixes
- TOP 3 STRENGTHS: What works well
- NEXT STEPS: Recommendations for improvement"""

    # Prepare message
    message = {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:{media_type};base64,{file_data}"
                }
            },
            {
                "type": "text",
                "text": review_prompt
            }
        ]
    }

    # Try Moonshot first
    if MOONSHOT_API_KEY:
        print("Sending to Kimi K2.5 (Moonshot API)...")
        try:
            response = requests.post(
                MOONSHOT_URL,
                headers={
                    'Authorization': f'Bearer {MOONSHOT_API_KEY}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'kimi-k2.5',
                    'messages': [message],
                    'max_tokens': 4096,
                    'temperature': 1
                },
                timeout=120
            )

            if response.status_code == 200:
                result = response.json()
                tokens_in = result['usage']['prompt_tokens']
                tokens_out = result['usage']['completion_tokens']
                cost = (tokens_in * 0.60 + tokens_out * 3.00) / 1_000_000

                review_text = result['choices'][0]['message']['content']

                print(f"\n{'='*80}")
                print(f"KIMI K2.5 REVIEW")
                print(f"Tokens: {tokens_in} in + {tokens_out} out = ${cost:.4f}")
                print(f"{'='*80}\n")
                print(review_text)
                print(f"\n{'='*80}\n")

                return review_text, tokens_in, tokens_out, cost, 'moonshot'
            else:
                print(f"Moonshot error {response.status_code}: {response.text}")
                print("Falling back to OpenRouter...")
        except Exception as e:
            print(f"Moonshot request failed: {e}")
            print("Falling back to OpenRouter...")

    # Fallback to OpenRouter
    if OPENROUTER_API_KEY:
        print("Sending to Kimi K2.5 (OpenRouter fallback)...")
        try:
            response = requests.post(
                OPENROUTER_URL,
                headers={
                    'Authorization': f'Bearer {OPENROUTER_API_KEY}',
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://claude.ai'
                },
                json={
                    'model': 'kimi-k2.5',
                    'messages': [message],
                    'max_tokens': 4096,
                    'temperature': 1
                },
                timeout=120
            )

            if response.status_code == 200:
                result = response.json()
                tokens_in = result.get('usage', {}).get('prompt_tokens', 0)
                tokens_out = result.get('usage', {}).get('completion_tokens', 0)
                cost = (tokens_in * 0.60 + tokens_out * 3.00) / 1_000_000

                review_text = result['choices'][0]['message']['content']

                print(f"\n{'='*80}")
                print(f"KIMI K2.5 REVIEW (OpenRouter Fallback)")
                print(f"Tokens: {tokens_in} in + {tokens_out} out = ${cost:.4f}")
                print(f"{'='*80}\n")
                print(review_text)
                print(f"\n{'='*80}\n")

                return review_text, tokens_in, tokens_out, cost, 'openrouter'
            else:
                print(f"OpenRouter error {response.status_code}: {response.text}")
                sys.exit(1)
        except Exception as e:
            print(f"OpenRouter request failed: {e}")
            sys.exit(1)
    else:
        print("Error: No API keys configured. Set MOONSHOT_API_KEY or OPENROUTER_API_KEY in .env")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Send video/image to Kimi K2.5 for review')
    parser.add_argument('file', help='Path to video or image file')
    parser.add_argument('--prompt', help='Custom review prompt')
    parser.add_argument('--output', help='Optional output file for review')

    args = parser.parse_args()

    review_text, tokens_in, tokens_out, cost, provider = send_to_kimi(args.file, args.prompt)

    # Save to output file if specified
    if args.output:
        with open(args.output, 'w') as f:
            f.write(f"File: {args.file}\n")
            f.write(f"Provider: {provider}\n")
            f.write(f"Tokens: {tokens_in} in + {tokens_out} out = ${cost:.4f}\n\n")
            f.write(review_text)
        print(f"Review saved to {args.output}")

if __name__ == '__main__':
    main()
