#!/usr/bin/env python3
"""SFX du contrat chill-meter (Abigail, Upwork) — 3 FAMILLES x 5 etats.

La RECETTE des 15 sons. Les .mp3 seuls ne suffisent pas : sans les prompts, une regeneration
repart de zero et l'argument client "on change le son sans retoucher l'image" ne tient plus.

Familles : A = organic (matiere reelle) | B = impact (sound design, grave, onde) | C = retrotech (l'appareil)
⛔ "cinematique" a ete ecarte comme nom : un compliment deguise n'est pas une direction.

Idle = MUET, exclu par le brief client. Ne pas en generer.
Sortie : out/_r-and-d/chill-meter-upwork/sfx-test/
Doc : memory/client-sim-tests/upwork-chill-meter/STATUS.md
"""
import os, sys, requests
from pathlib import Path
ROOT = Path("/Users/clawdbot/Workspace/remotion")
for line in (ROOT/".env").read_text().splitlines():
    if line.startswith("ELEVENLABS_API_KEY="):
        os.environ["ELEVENLABS_API_KEY"] = line.split("=",1)[1].strip()
KEY = os.getenv("ELEVENLABS_API_KEY")
URL = "https://api.elevenlabs.io/v1/sound-generation"
OUT = ROOT/"out/_r-and-d/chill-meter-upwork/sfx-test"
OUT.mkdir(parents=True, exist_ok=True)

# Entrance 60f=2.0s | Fill25 75f=2.5s | Fill75 105f=3.5s
SFX = [
 ("entrance-A-organic.mp3","Heavy metal device dropping onto a hard floor, solid thud impact, "
  "then a mechanical latch click and a low power hum starting up, dry close-up, no music",2.0,0.6),
 ("entrance-B-impact.mp3","Cinematic heavy drop impact with deep sub bass, followed by a sharp "
  "mechanical click and a rising power-on swell, trailer sound design, no music",2.0,0.45),
 ("entrance-C-retrotech.mp3","Vintage electronic machine landing and switching on, thud then relay "
  "click and retro synth power-up tone, old sci-fi console, no music",2.0,0.45),

 ("fill25-A-organic.mp3","Soft icy air rising, gentle frost breath with light crystalline "
  "granules, subtle and restrained, close-up organic texture, no music",2.5,0.6),
 ("fill25-B-impact.mp3","Subtle rising cold swell, low filtered whoosh climbing gently, "
  "restrained cinematic build, no music",2.5,0.45),
 ("fill25-C-retrotech.mp3","Vintage gauge needle rising, soft electronic ascending tone with "
  "faint mechanical ticks, retro instrument panel, no music",2.5,0.45),

 ("fill75-A-organic.mp3","Ice crackling and spreading with a cold wind gust blowing across, "
  "crystalline chime of freezing water, raw organic winter texture, no music",3.5,0.6),
 ("fill75-B-impact.mp3","Building cinematic cold pressure, icy chime hit with low wind swell "
  "and frost crackle layered, tension rising, no music",3.5,0.45),
 ("fill75-C-retrotech.mp3","Retro machine cooling down hard, electronic warning chime with icy "
  "crackle and ventilation hiss, vintage console under strain, no music",3.5,0.45),
 # --- 50% : le givre qui pousse sur le metal (la signature) ---
 ("frost50-A-organic.mp3","Ice crackling and freezing over a metal surface, delicate crystalline crackle, "
  "frost spreading, close-up organic texture, dry, no music",2.5,0.6),
 ("frost50-B-impact.mp3","Cinematic freeze effect, deep icy pulse with crystalline shimmer layered on top, "
  "frost forming, polished sound design, no music",2.5,0.4),
 ("frost50-C-retrotech.mp3","Vintage electronic device freezing up, soft mechanical hum with icy crackle and "
  "a small cold chime, retro-futuristic gauge, no music",2.5,0.4),

 # --- 100% : le payoff, onde de choc glacee ---
 ("boom100-A-organic.mp3","Powerful ice shatter burst, thick frozen impact followed by scattering ice shards, "
  "raw organic texture, no music",3.0,0.6),
 ("boom100-B-impact.mp3","Cinematic frozen shockwave, low cold boom with icy whoosh expanding outward, "
  "trailer impact, deep sub, no music",3.0,0.4),
 ("boom100-C-retrotech.mp3","Retro sci-fi freeze blast from a vintage device, cold whoosh with bright icy chime "
  "hit and electronic shimmer tail, no music",3.0,0.4),
]

def gen(fn, prompt, dur, inf):
    r = requests.post(URL, json={"text":prompt,"duration_seconds":dur,"prompt_influence":inf},
                      headers={"xi-api-key":KEY,"Content-Type":"application/json"}, timeout=180)
    if r.status_code != 200:
        print(f"  ERR {fn}: {r.status_code} {r.text[:150]}"); return False
    (OUT/fn).write_bytes(r.content); print(f"  ok {fn} ({len(r.content)}o)"); return True

res = [gen(*s) for s in SFX]
print(f"{sum(res)}/{len(res)}")
sys.exit(0 if all(res) else 1)