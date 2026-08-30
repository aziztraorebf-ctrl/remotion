import re, subprocess, sys
from PIL import Image

SRC = 'perso-neutre-v2.svg'
SP = '/private/tmp/claude-502/-Users-clawdbot-Workspace-remotion/9e46a9a9-51bf-4755-ac45-53d65dc99c13/scratchpad'
svg = open(SRC).read()

# parse rig
groups = {}
for m in re.finditer(r'<g id="([a-z-]+)"(?: data-parent="([a-z-]+)")?(?: data-pivot="([0-9]+),([0-9]+)")?>', svg):
    gid, parent, px, py = m.groups()
    groups[gid] = {'parent': parent, 'pivot': (px, py)}

def chain(gid):
    c = []
    g = gid
    while g and g != 'controle':
        c.append(g)
        g = groups[g]['parent']
    return list(reversed(c))  # root -> leaf

def pose(angles, out_svg):
    doc = svg
    for gid in groups:
        if gid == 'controle': continue
        parts = []
        for anc in chain(gid):
            a = angles.get(anc, 0)
            if a:
                px, py = groups[anc]['pivot']
                parts.append(f'rotate({a} {px} {py})')
        if parts:
            doc = doc.replace(f'<g id="{gid}" ', f'<g id="{gid}" transform="{" ".join(parts)}" ', 1)
    open(out_svg, 'w').write(doc)

poses = {
  'pose-bras-30': {'bras-g-haut': 30, 'bras-d-haut': -30},
  'pose-bras-60': {'bras-g-haut': 60, 'bras-d-haut': -60, 'bras-g-bas': 15, 'bras-d-bas': -15},
  'pose-genou-40': {'jambe-g-haut': 20, 'jambe-g-bas': 40, 'tete': 8},
}
for name, ang in poses.items():
    p = f'{SP}/{name}.svg'
    pose(ang, p)
    subprocess.run(['rsvg-convert','-w','400','-h','900','--background-color','#F2EFE9',p,'-o',f'{SP}/{name}.png'], check=True)

# planche
imgs = [Image.open(f'{SP}/{n}.png') for n in poses]
board = Image.new('RGB', (1200, 900), '#F2EFE9')
for i, im in enumerate(imgs):
    board.paste(im, (i*400, 0))
board.save(f'{SP}/planche-rotations.png')
print('poses rendues:', ', '.join(poses))
