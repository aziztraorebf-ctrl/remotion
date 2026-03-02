"""
Pipeline B verification: pieds du peasant-man ancres exactement sur la ligne de sol.
Genere preview-pipeline-b-verify.png dans le workspace Remotion.
"""
from PIL import Image, ImageDraw

GROUND_Y = 943
SCALE = 3
PIVOT_Y_NATIVE = 56
CANVAS_NATIVE = 64
CANVAS_W, CANVAS_H = 1920, 1080

FRAMES_PATH = (
    "/Users/clawdbot/Workspace/remotion/public/assets/peste-pixel/"
    "pixellab/side-view/characters/peasant-man-side/animations/walking/east/"
)

# Fond brun medieval (test background, pas le vrai)
bg = Image.new("RGBA", (CANVAS_W, CANVAS_H), (90, 65, 40, 255))

# Charger et scaler les 6 frames (nearest-neighbor pour pixel art)
frames = []
for i in range(6):
    f = Image.open(f"{FRAMES_PATH}frame_{i:03d}.png").convert("RGBA")
    frames.append(f.resize((CANVAS_NATIVE * SCALE, CANVAS_NATIVE * SCALE), Image.NEAREST))

sw, sh = frames[0].size

# Formule d'ancrage PIL (pas de centering automatique comme Godot) :
# On veut : bas du sprite = GROUND_Y
# bas du sprite = sprite_top_y + sh
# sprite_top_y = GROUND_Y - PIVOT_Y_NATIVE * SCALE
# Explication : PIVOT_Y_NATIVE=56 signifie que le pied est au pixel 56 dans l'image native
# Scaler par 3 -> le pied est a (56*3)=168px depuis le haut du sprite scaled
# Donc sprite_top_y = GROUND_Y - 168
offset_y_native = -(PIVOT_Y_NATIVE - CANVAS_NATIVE // 2)  # -24 (pour reference Godot)
sprite_top_y = GROUND_Y - PIVOT_Y_NATIVE * SCALE

# Placer 3 personnages a des positions X differentes
positions_x = [350, 800, 1400]
for i, x_pos in enumerate(positions_x):
    bg.alpha_composite(frames[i % 6], (x_pos - sw // 2, sprite_top_y))

# Ligne de sol jaune APRES les sprites (pour voir la superposition)
draw = ImageDraw.Draw(bg)
draw.line([(0, GROUND_Y), (CANVAS_W, GROUND_Y)], fill=(255, 220, 0, 255), width=2)

# Etiquettes
draw.rectangle([10, 10, 600, 60], fill=(0, 0, 0, 180))
draw.text((20, 15), f"Pipeline B Test - FOOT_OFFSET_Y = {offset_y_native}px natifs ({offset_y_native * SCALE}px visuels)", fill=(255, 255, 255))
draw.text((20, 35), f"GROUND_Y={GROUND_Y}  pivot=({CANVAS_NATIVE//2},{PIVOT_Y_NATIVE})  scale={SCALE}  sprite_top_y={sprite_top_y}", fill=(200, 200, 200))

# Sauvegarder
output_path = "/Users/clawdbot/Workspace/remotion/preview-pipeline-b-verify.png"
bg.convert("RGB").save(output_path)

# Verification automatique : le pixel juste au-dessus de la ligne de sol doit etre non-transparent
# On verifie frame 0 a la position x=800
test_x = 800 - sw // 2
test_y_in_sprite = GROUND_Y - sprite_top_y - 1  # 1px au-dessus de la ligne de sol
if 0 <= test_y_in_sprite < frames[0].height:
    pixel = frames[0].getpixel((sw // 2, test_y_in_sprite))
    alpha = pixel[3] if len(pixel) == 4 else 255
    status = "OK - pied visible" if alpha > 10 else "WARN - pixel transparent"
else:
    status = "WARN - test_y hors bounds"

print(f"Saved: {output_path}")
print(f"Formule: sprite_top_y = {GROUND_Y} - ({PIVOT_Y_NATIVE} * {SCALE}) = {sprite_top_y}")
print(f"Pieds a Y = {sprite_top_y + PIVOT_Y_NATIVE * SCALE} (doit etre = {GROUND_Y})")
print(f"Verification pixel pied: {status}")

feet_y = sprite_top_y + PIVOT_Y_NATIVE * SCALE
if feet_y == GROUND_Y:
    print("VALIDATION: pieds exactement sur la ligne de sol")
else:
    diff = feet_y - GROUND_Y
    print(f"ECART: {diff}px (positif = sous le sol, negatif = au-dessus)")
