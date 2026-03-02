"""
PixelLab animate-with-text via WebSocket direct
Usage: python3 pixellab_animate_ws.py <image_path> <action> [direction] [view]
Output: ./output/<action>_frame_NNN.png (16 frames for 64x64 sprites)
"""
import asyncio, json, base64, io, sys
import websockets
from pathlib import Path
from PIL import Image

SECRET = "e9c8fab7-77c6-493c-a5e8-a47a885b2a0c"
TIER = 1
VERSION = "0.4.88"
WS_URL = "ws://api.pixellab.ai/generate-animate-with-text"

async def animate(image_path: str, action: str, direction: str = "east", view: str = "side", out_dir: str = None):
    img = Image.open(image_path).convert("RGBA")
    w, h = img.size
    raw_rgba = img.tobytes()
    img_b64 = base64.b64encode(raw_rgba).decode()

    payload = {
        "secret": SECRET,
        "tier": TIER,
        "version": VERSION,
        "action": action,
        "view": view,
        "direction": direction,
        "no_background": True,
        "seed": "0",
        "reference_image": {"base64": img_b64},
        "reference_image_size": {"width": w, "height": h},
        "image_size": {"width": w, "height": h},
        "model_name": "generate_animate_with_text"
    }

    out = Path(out_dir) if out_dir else Path(image_path).parent / "animations" / action.replace(" ", "_")[:30]
    out.mkdir(parents=True, exist_ok=True)

    print(f"Connecting to PixelLab WS...")
    async with websockets.connect(WS_URL, open_timeout=15) as ws:
        await ws.send(json.dumps(payload))
        print("Sent. Waiting...", flush=True)

        while True:
            msg = await asyncio.wait_for(ws.recv(), timeout=120)
            data = json.loads(msg)

            if "progress" in data:
                print(f"  {int(float(data['progress'])*100)}%", end=" ", flush=True)
            if "queue_position" in data and data["queue_position"] > 0:
                print(f"\n  Queue: {data['queue_position']}", flush=True)
            if "detail" in data:
                print(f"\nERROR: {data['detail']}")
                return None
            if data.get("type") == "message_done":
                imgs = data.get("images", [])
                print(f"\nDone! {len(imgs)} frames")
                saved = []
                for i, frame in enumerate(imgs):
                    fb = base64.b64decode(frame["base64"])
                    if len(fb) == w * h * 4:
                        out_img = Image.frombytes("RGBA", (w, h), fb)
                    else:
                        out_img = Image.open(io.BytesIO(fb)).convert("RGBA")
                    p = out / f"frame_{i:03d}.png"
                    out_img.save(p)
                    saved.append(str(p))
                return saved

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 pixellab_animate_ws.py <image> <action> [direction=east] [view=side]")
        sys.exit(1)
    img = sys.argv[1]
    action = sys.argv[2]
    direction = sys.argv[3] if len(sys.argv) > 3 else "east"
    view = sys.argv[4] if len(sys.argv) > 4 else "side"
    result = asyncio.run(animate(img, action, direction, view))
    if result:
        print(f"Saved {len(result)} frames to {Path(result[0]).parent}")
