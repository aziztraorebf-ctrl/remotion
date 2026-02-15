import os
import sys
import base64
from openai import OpenAI

# Load API key
from dotenv import load_dotenv
load_dotenv("/Users/clawdbot/Workspace/remotion/.env")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

prompt = sys.argv[1] if len(sys.argv) > 1 else """Dark terminal screen with green monochrome CRT aesthetic. A tactical military-style map of medieval Europe rendered as glowing green vector lines on black background. Cities marked with pulsing red dots: Messina, Florence, Paris, London. Dashed infection route lines connecting the cities. Terminal HUD overlay with text "OCTOBRE 1347" and scrolling ticker bar at bottom. Scanline effect. Pixel art retro gaming aesthetic mixed with military radar display. No photorealism, pure data visualization terminal look."""

output_path = sys.argv[2] if len(sys.argv) > 2 else "/Users/clawdbot/Workspace/remotion/storyboard/bloc-1/openai-terminal-map.png"

print(f"Generating image with gpt-image-1.5...")
print(f"Prompt: {prompt[:100]}...")

result = client.images.generate(
    model="gpt-image-1.5",
    prompt=prompt,
    size="1536x1024",
    quality="high",
    n=1,
)

# Save the image
image_bytes = base64.b64decode(result.data[0].b64_json)
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "wb") as f:
    f.write(image_bytes)

print(f"Image saved to: {output_path}")
print(f"Size: {len(image_bytes) / 1024:.1f} KB")
print(f"Revised prompt: {result.data[0].revised_prompt if hasattr(result.data[0], 'revised_prompt') else 'N/A'}")
