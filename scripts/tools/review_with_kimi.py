#!/usr/bin/env python3
"""
Review a rendered video or image with Kimi K2.5.

Supports two backends:
  - Moonshot native API (preferred): sends video/image directly as base64
  - OpenRouter fallback: extracts frames for video, sends as multi-image

Usage:
  python -u scripts/review_with_kimi.py <file.mp4|file.png|file.jpg> [--prompt "custom prompt"]
  python -u scripts/review_with_kimi.py <file.mp4> --backend openrouter

Requires MOONSHOT_API_KEY (preferred) or OPENROUTER_API_KEY in .env at project root.
"""

import sys
import os
import base64
import json
import argparse
from pathlib import Path

# Load .env from project root
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

# Backend configuration
MOONSHOT_KEY = os.environ.get("MOONSHOT_API_KEY", "")
OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")

BACKENDS = {
    "moonshot": {
        "url": "https://api.moonshot.ai/v1/chat/completions",
        "model": "kimi-k2.5",
        "key": MOONSHOT_KEY,
        "supports_video": True,
    },
    "openrouter": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "model": "moonshotai/kimi-k2.5",
        "key": OPENROUTER_KEY,
        "supports_video": False,
    },
}

# Default structured review prompt for pixel art video production
DEFAULT_PROMPT = """Tu es Kimi, directeur technique video pour une production pixel art medievale (Remotion, 1920x1080, 30fps).

Analyse cette video/image et donne un diagnostic structure :

## 1. PERSONNAGES
- Sont-ils bien ancres au sol (pieds sur la ligne de sol) ?
- Y a-t-il du flottement ou des personnages qui traversent le sol ?
- Les animations sont-elles fluides (pas de saccade, pas de frames manquantes) ?
- Les personnages marchent-ils de facon credible (mouvement lateral + animation de jambes synchronises) ?
- Y a-t-il des personnages dupliques (meme sprite utilise deux fois) ?

## 2. BACKGROUND
- La composition est-elle coherente (pas d'artefacts, pas de tuiles cassees) ?
- L'eclairage est-il coherent (direction de la lumiere, ombres) ?
- Y a-t-il des elements visuels parasites (couleurs incorrectes, blocs visibles) ?

## 3. TEXTE & OVERLAYS
- Le texte est-il lisible sur le fond ?
- Les animations de texte (stamp, typewriter, strikethrough) sont-elles claires ?
- Le CRT overlay est-il trop fort / trop faible ?

## 4. TRANSITIONS
- Les transitions entre scenes sont-elles fluides ?
- Y a-t-il des jump cuts non intentionnels ?

## 5. VERDICT
- NOTE : /10
- TOP 3 problemes a corriger (par ordre de priorite)
- TOP 3 points forts

Sois precis et critique. Indique les timecodes si possible."""


def encode_file(filepath: str) -> tuple[str, str]:
    """Encode a file to base64 and return (base64_data, mime_type)."""
    ext = Path(filepath).suffix.lower()
    mime_map = {
        ".mp4": "video/mp4",
        ".mov": "video/quicktime",
        ".avi": "video/x-msvideo",
        ".webm": "video/webm",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }
    mime_type = mime_map.get(ext, "application/octet-stream")

    with open(filepath, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")

    size_mb = len(data) * 3 / 4 / 1024 / 1024
    print(f"File: {filepath}")
    print(f"Size: {size_mb:.1f} MB | Type: {mime_type}")

    return data, mime_type


def extract_frames(video_path: str, count: int = 6) -> list[str]:
    """Extract evenly-spaced frames from a video, return list of temp JPEG paths."""
    import subprocess
    import tempfile

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", video_path],
        capture_output=True, text=True
    )
    duration = float(probe.stdout.strip())
    interval = duration / (count + 1)

    frames = []
    tmpdir = tempfile.mkdtemp(prefix="kimi-review-")
    for i in range(count):
        t = interval * (i + 1)
        out_path = os.path.join(tmpdir, f"frame_{i:02d}.jpg")
        subprocess.run(
            ["ffmpeg", "-ss", str(t), "-i", video_path,
             "-frames:v", "1", "-q:v", "2", "-update", "1", out_path],
            capture_output=True
        )
        if os.path.exists(out_path):
            frames.append(out_path)
            print(f"  Extracted frame {i+1}/{count} at {t:.1f}s")

    return frames


def build_content_moonshot(filepath: str, prompt: str, mime_type: str, b64_data: str) -> list:
    """Build content array for Moonshot native API (supports video directly)."""
    is_video = mime_type.startswith("video/")

    if is_video:
        return [
            {
                "type": "video_url",
                "video_url": {
                    "url": f"data:{mime_type};base64,{b64_data}"
                }
            },
            {
                "type": "text",
                "text": prompt
            }
        ]
    else:
        return [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:{mime_type};base64,{b64_data}"
                }
            },
            {
                "type": "text",
                "text": prompt
            }
        ]


def build_content_openrouter(filepath: str, prompt: str, mime_type: str, b64_data: str) -> list:
    """Build content array for OpenRouter (extract frames for video)."""
    is_video = mime_type.startswith("video/")

    if is_video:
        print("\nOpenRouter backend -- extracting frames for multi-image review...")
        frame_paths = extract_frames(filepath, count=6)
        if not frame_paths:
            print("ERROR: Could not extract frames from video")
            sys.exit(1)

        content = [{
            "type": "text",
            "text": f"[VIDEO REVIEW - {len(frame_paths)} frames extraites a intervalles reguliers]\n\n{prompt}"
        }]
        for fp in frame_paths:
            frame_b64, frame_mime = encode_file(fp)
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:{frame_mime};base64,{frame_b64}"
                }
            })
        return content
    else:
        return [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:{mime_type};base64,{b64_data}"
                }
            },
            {
                "type": "text",
                "text": prompt
            }
        ]


def review(filepath: str, prompt: str, backend_name: str) -> str:
    """Send file to Kimi K2.5 and return the review."""
    import urllib.request
    import urllib.error

    backend = BACKENDS[backend_name]
    api_key = backend["key"]

    if not api_key or api_key.startswith("your-"):
        print(f"ERROR: {backend_name.upper()} API key not set in .env")
        sys.exit(1)

    b64_data, mime_type = encode_file(filepath)

    # Build content based on backend capabilities
    if backend["supports_video"]:
        content = build_content_moonshot(filepath, prompt, mime_type, b64_data)
    else:
        content = build_content_openrouter(filepath, prompt, mime_type, b64_data)

    payload = {
        "model": backend["model"],
        "messages": [
            {"role": "system", "content": "Tu es un directeur technique video expert en pixel art et animation 2D."},
            {"role": "user", "content": content}
        ],
        "max_tokens": 4096,
    }

    # Moonshot K2.5 has fixed temperature; disable thinking for faster response
    if backend_name == "moonshot":
        payload["thinking"] = {"type": "disabled"}
    else:
        payload["temperature"] = 0.3

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    if backend_name == "openrouter":
        headers["HTTP-Referer"] = "https://github.com/remotion-video"
        headers["X-Title"] = "Peste 1347 Video Review"

    model_label = backend["model"]
    print(f"\nSending to {model_label} via {backend_name}...")
    print(f"Video support: {'native (direct MP4)' if backend['supports_video'] else 'via frame extraction'}")
    print(f"Prompt: {prompt[:100]}...")

    req = urllib.request.Request(
        backend["url"],
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            result = json.loads(resp.read().decode("utf-8"))

            if "choices" not in result:
                print(f"Unexpected response: {json.dumps(result, indent=2)[:1000]}")
                sys.exit(1)

            reply = result["choices"][0]["message"]["content"]

            # Print usage info
            usage = result.get("usage", {})
            if usage:
                inp = usage.get("prompt_tokens", 0)
                out = usage.get("completion_tokens", 0)
                # Moonshot pricing: $0.60/M input, $3.00/M output
                if backend_name == "moonshot":
                    cost_in = inp * 0.60 / 1_000_000
                    cost_out = out * 3.00 / 1_000_000
                else:
                    cost_in = inp * 0.50 / 1_000_000
                    cost_out = out * 2.80 / 1_000_000
                print(f"\nTokens: {inp} in + {out} out = ${cost_in + cost_out:.4f}")

            return reply

    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else ""
        print(f"HTTP Error {e.code}: {body[:500]}")
        sys.exit(1)


def select_backend(preferred: str | None) -> str:
    """Select best available backend."""
    if preferred:
        if preferred in BACKENDS and BACKENDS[preferred]["key"] and not BACKENDS[preferred]["key"].startswith("your-"):
            return preferred
        print(f"WARNING: {preferred} backend requested but key not available")

    # Prefer moonshot (native video support)
    if MOONSHOT_KEY and not MOONSHOT_KEY.startswith("your-"):
        return "moonshot"
    if OPENROUTER_KEY and not OPENROUTER_KEY.startswith("your-"):
        return "openrouter"

    print("ERROR: No API key found. Set MOONSHOT_API_KEY or OPENROUTER_API_KEY in .env")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Review video/image with Kimi K2.5")
    parser.add_argument("file", help="Path to MP4, PNG, or JPG file")
    parser.add_argument("--prompt", "-p", default=DEFAULT_PROMPT,
                        help="Custom review prompt (default: structured pixel art review)")
    parser.add_argument("--output", "-o", help="Save review to file instead of stdout")
    parser.add_argument("--backend", "-b", choices=["moonshot", "openrouter"],
                        help="Force specific backend (default: auto-select best available)")
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"ERROR: File not found: {args.file}")
        sys.exit(1)

    backend = select_backend(args.backend)
    print(f"Backend: {backend} ({'native video' if BACKENDS[backend]['supports_video'] else 'frame extraction'})")

    result = review(args.file, args.prompt, backend)

    print("\n" + "=" * 60)
    print("KIMI K2.5 REVIEW")
    print("=" * 60)
    print(result)

    if args.output:
        Path(args.output).write_text(result, encoding="utf-8")
        print(f"\nSaved to {args.output}")


if __name__ == "__main__":
    main()
