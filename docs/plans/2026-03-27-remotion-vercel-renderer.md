# Remotion Vercel Renderer — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy a Vercel-hosted rendering backend so Aziz can trigger video renders from Claude Code Mobile and receive MP4 links viewable on his phone.

**Architecture:** Separate Next.js project (`remotion-renderer`) based on the official `template-vercel`. It connects to the existing Vercel Blob store (`store_T6oLmi2NlOe9nhkg`) on the `remotion-assets` Vercel project. A test composition is included to validate the pipeline. Later, real GeoAfrique/Peste compositions can be added.

**Tech Stack:** Next.js 16, React 19, Remotion 4.0, @remotion/vercel, @vercel/sandbox, @vercel/blob, TypeScript, Turbo

---

## Task 1: Scaffold project from official template

**Files:**
- Create: `/Users/clawdbot/Workspace/remotion-renderer/` (entire project)

**Step 1: Create the project from template**

```bash
cd /Users/clawdbot/Workspace
npx create-video@latest --template vercel remotion-renderer
```

If the interactive CLI asks questions, accept all defaults.

**Step 2: Verify scaffolding**

```bash
cd /Users/clawdbot/Workspace/remotion-renderer
ls -la
cat package.json | head -20
```

Expected: Next.js project with `@remotion/vercel`, `@vercel/sandbox`, `@vercel/blob` in dependencies.

**Step 3: Install dependencies**

```bash
cd /Users/clawdbot/Workspace/remotion-renderer
npm install
```

Expected: Clean install with no errors.

**Step 4: Commit**

```bash
cd /Users/clawdbot/Workspace/remotion-renderer
git init
git add -A
git commit -m "feat: scaffold remotion-renderer from template-vercel"
```

---

## Task 2: Create GitHub repo and connect to Vercel

**Files:**
- Modify: Vercel project `remotion-assets` (connect git repo)

**Step 1: Create GitHub repo**

```bash
cd /Users/clawdbot/Workspace/remotion-renderer
gh repo create aziztraorebf-ctrl/remotion-renderer --public --source=. --remote=origin --push
```

**Step 2: Connect the existing Vercel project `remotion-assets` to this repo**

Use the Vercel MCP tool `mcp__vercel__vercel_connect_git_repository` to connect `remotion-assets` (prj_rrLqyQtJVr3T4npZNH0o2U0JEcxq) to the GitHub repo `aziztraorebf-ctrl/remotion-renderer`.

Alternatively, if the MCP tool doesn't support this cleanly:
- Delete the empty `remotion-assets` project on Vercel
- Import the new GitHub repo `remotion-renderer` as a new Vercel project
- Re-create the Blob store (public) and update `BLOB_READ_WRITE_TOKEN`

**Step 3: Set environment variables on Vercel**

The `BLOB_READ_WRITE_TOKEN` should already exist on the `remotion-assets` project from our earlier setup. Verify with:

```
mcp__vercel__vercel_list_env_vars(projectId="remotion-assets")
```

If the project was recreated, copy the token from the new Blob store.

**Step 4: Verify Vercel deployment**

After push + Vercel auto-deploy:

```bash
# Check deployment status
gh api repos/aziztraorebf-ctrl/remotion-renderer/deployments --jq '.[0].state'
```

Or use `mcp__vercel__vercel_list_deployments`.

Expected: Deployment status `READY` after a few minutes.

**Step 5: Commit any config changes**

```bash
cd /Users/clawdbot/Workspace/remotion-renderer
git add -A
git commit -m "feat: connect to Vercel with Blob store"
```

---

## Task 3: Test render with default template composition

**Step 1: Find the deployed URL**

Use `mcp__vercel__vercel_list_deployments` or check the Vercel dashboard for the production URL (e.g., `remotion-renderer-xxx.vercel.app`).

**Step 2: Trigger a test render via the API**

```bash
curl -X POST https://<DEPLOYED_URL>/api/render \
  -H "Content-Type: application/json" \
  -d '{"inputProps": {"text": "Hello from mobile test"}}' \
  --no-buffer
```

This returns Server-Sent Events. Watch for:
- `{"type":"phase","phase":"Creating sandbox...","progress":0}`
- `{"type":"phase","phase":"Rendering video...","progress":0.5}`
- `{"type":"done","url":"https://...blob.vercel-storage.com/...mp4","size":12345}`

**Step 3: Verify the rendered video URL**

Open the URL from the `done` event in a browser. It should be a playable MP4.

**Step 4: Test from mobile**

Open the same URL on a phone to confirm it plays inline in the browser.

---

## Task 4: Add a simple GeoAfrique test composition

**Files:**
- Create: `remotion-renderer/src/remotion/GeoTestComposition.tsx`
- Modify: `remotion-renderer/src/remotion/Root.tsx` (register new comp)
- Modify: `remotion-renderer/types/constants.ts` (if needed)

**Step 1: Create a minimal test composition**

Create `src/remotion/GeoTestComposition.tsx`:

```tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
} from "remotion";

export const GeoTestComposition: React.FC<{
  title: string;
  imageUrl?: string;
}> = ({ title, imageUrl }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleY = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #0d1b2a 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {imageUrl && (
        <Img
          src={imageUrl}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: opacity * 0.4,
          }}
        />
      )}
      <div
        style={{
          color: "#d4a574",
          fontSize: 64,
          fontWeight: "bold",
          fontFamily: "serif",
          textAlign: "center",
          opacity,
          transform: `translateY(${interpolate(titleY, [0, 1], [100, 0])}px)`,
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          padding: "0 60px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          color: "#888",
          fontSize: 24,
          fontFamily: "sans-serif",
          opacity: interpolate(frame, [30, 60], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
        }}
      >
        GeoAfrique - Rendered on Vercel
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Register in Root.tsx**

Add to the composition list in the Root file:

```tsx
import { GeoTestComposition } from "./GeoTestComposition";

// Inside the <Composition> list:
<Composition
  id="GeoTest"
  component={GeoTestComposition}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: "Abou Bakari II",
  }}
/>
```

**Step 3: Test locally**

```bash
cd /Users/clawdbot/Workspace/remotion-renderer
npx remotion studio
```

Open `http://localhost:3000` and select the `GeoTest` composition. Verify it renders.

**Step 4: Commit and push**

```bash
cd /Users/clawdbot/Workspace/remotion-renderer
git add -A
git commit -m "feat: add GeoTest composition for remote rendering"
git push
```

---

## Task 5: Create a Python trigger script

**Files:**
- Create: `/Users/clawdbot/Workspace/remotion/scripts/render-on-vercel.py`

This script lives in the MAIN Remotion project (not the renderer) so Claude can trigger renders from the existing workspace.

**Step 1: Write the script**

```python
"""
Trigger a video render on Vercel Sandbox and return the MP4 URL.

Usage:
    python scripts/render-on-vercel.py --comp GeoTest --props '{"title": "Test"}'
    python scripts/render-on-vercel.py --comp GeoTest --props '{"title": "Abou Bakari II"}' --open

Returns a public Vercel Blob URL to the rendered MP4.
"""

import sys
import os
import json
import argparse
import time
from pathlib import Path

try:
    import requests
except ImportError:
    os.system(f"{sys.executable} -m pip install requests -q")
    import requests

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

# This will be set after Task 2 deployment
RENDER_API_URL = os.getenv(
    "VERCEL_RENDER_URL",
    "https://remotion-renderer.vercel.app"
)


def trigger_render(composition_id: str, input_props: dict) -> str:
    url = f"{RENDER_API_URL}/api/render"

    print(f"Triggering render: {composition_id}")
    print(f"Props: {json.dumps(input_props, indent=2)}")
    print(f"Endpoint: {url}")
    print()

    response = requests.post(
        url,
        json={"compositionId": composition_id, "inputProps": input_props},
        headers={"Content-Type": "application/json"},
        stream=True,
    )

    if response.status_code != 200:
        print(f"ERROR ({response.status_code}): {response.text}")
        sys.exit(1)

    video_url = None
    for line in response.iter_lines():
        if not line:
            continue
        line = line.decode("utf-8")
        if line.startswith("data: "):
            data = json.loads(line[6:])

            if data.get("type") == "phase":
                progress = data.get("progress", 0)
                phase = data.get("phase", "")
                bar = "#" * int(progress * 30) + "-" * (30 - int(progress * 30))
                print(f"\r  [{bar}] {progress*100:.0f}% {phase}", end="", flush=True)

            elif data.get("type") == "done":
                video_url = data.get("url", "")
                size_mb = data.get("size", 0) / (1024 * 1024)
                print(f"\n\nRender complete!")
                print(f"Size: {size_mb:.1f} MB")
                print(f"URL: {video_url}")

            elif data.get("type") == "error":
                print(f"\n\nERROR: {data.get('message', 'Unknown error')}")
                sys.exit(1)

    return video_url


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Render video on Vercel")
    parser.add_argument("--comp", required=True, help="Composition ID (e.g. GeoTest)")
    parser.add_argument("--props", default="{}", help="JSON input props")
    parser.add_argument("--open", action="store_true", help="Open URL after render")

    args = parser.parse_args()

    try:
        props = json.loads(args.props)
    except json.JSONDecodeError:
        print(f"ERROR: Invalid JSON props: {args.props}")
        sys.exit(1)

    video_url = trigger_render(args.comp, props)

    if args.open and video_url:
        import subprocess
        subprocess.run(["open", video_url])
```

**Step 2: Add VERCEL_RENDER_URL to .env**

Add to `/Users/clawdbot/Workspace/remotion/.env`:

```
VERCEL_RENDER_URL=https://<DEPLOYED_URL>
```

(Replace with actual URL from Task 3.)

**Step 3: Test the script**

```bash
cd /Users/clawdbot/Workspace/remotion
python -u scripts/render-on-vercel.py --comp GeoTest --props '{"title": "Test from script"}' --open
```

Expected: Progress bar in terminal, then URL to rendered MP4.

**Step 4: Commit in the main Remotion repo**

```bash
cd /Users/clawdbot/Workspace/remotion
git add scripts/render-on-vercel.py
git commit -m "feat: add Vercel render trigger script"
```

---

## Task 6: End-to-end mobile test

**No code changes. Validation only.**

**Step 1: From the local machine, trigger a render**

```bash
python -u scripts/render-on-vercel.py \
  --comp GeoTest \
  --props '{"title": "Abou Bakari II - Roi du Mali"}'
```

**Step 2: Copy the output URL**

**Step 3: Open on phone**

Verify the MP4 plays directly in the mobile browser.

**Step 4: Create a gallery with the render + source assets**

```bash
# Download the video first
curl -o /tmp/rendered-video.mp4 "<VIDEO_URL>"

# Create a gallery with the video + original reference image
python -u scripts/upload-to-blob.py \
  --gallery "GeoTest - First Remote Render" \
  /tmp/rendered-video.mp4 \
  public/assets/library/geoafrique/characters/abou-bakari/abou-bakari-roi-plan-large-REF.png \
  --folder review/first-render
```

**Step 5: Open gallery on phone**

Verify images + video all display correctly on the same gallery page.

---

## Task 7: Update memory and docs

**Files:**
- Modify: `memory/reference_vercel-blob-gallery.md`
- Modify: `MEMORY.md` (index)
- Modify: `CLAUDE.md` (add render capability)

**Step 1: Update memory with renderer info**

Add to `reference_vercel-blob-gallery.md`:
- Renderer project URL
- How to trigger renders
- Composition IDs available

**Step 2: Add VERCEL_RENDER_URL to CLAUDE.md env vars section**

**Step 3: Commit**

```bash
git add -A
git commit -m "docs: add Vercel renderer to memory and CLAUDE.md"
```

---

## Summary of deliverables

| Deliverable | Location |
|-------------|----------|
| Renderer project | `/Users/clawdbot/Workspace/remotion-renderer/` |
| GitHub repo | `aziztraorebf-ctrl/remotion-renderer` |
| Vercel deployment | `remotion-renderer.vercel.app` (or similar) |
| Trigger script | `scripts/render-on-vercel.py` in main Remotion repo |
| Test composition | `GeoTest` (1920x1080, 3s, title + background) |
| Blob output | Same store as asset gallery (`store_T6oLmi2NlOe9nhkg`) |

## Risk mitigations

- `@remotion/vercel` is **experimental** — pin exact versions in package.json
- Vercel Hobby has **5h CPU/month** free — sufficient for dev/test (~30 renders)
- Template has **no rate limiting** — add before sharing publicly
- Snapshot creation at build time may fail if Vercel Sandbox quota is exhausted — monitor via dashboard
