import re, asyncio, io, os
import numpy as np
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright

def groupes_top(svg):
    out=[];prof=0
    for m in re.finditer(r'<(/?)g\b([^>]*)>', svg):
        if m.group(1)=='/': prof-=1
        else:
            i=re.search(r'id="([^"]+)"', m.group(2))
            if prof==0 and i: out.append(i.group(1))
            if not m.group(2).rstrip().endswith('/'): prof+=1
    return out

async def rendre(fichier, sortie, cellule=300):
    svg=open(fichier,encoding='utf-8').read()
    vb=re.search(r'viewBox="([\d.\- ]+)"',svg).group(1).split()
    W,H=float(vb[2]),float(vb[3])
    ids=groupes_top(svg)
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); p=await b.new_page()
        vues=[]
        open('/tmp/v.html','w').write(f'<body style="margin:0;background:#fff">{svg}</body>')
        await p.set_viewport_size({"width":int(W),"height":int(H)})
        await p.goto('file:///tmp/v.html'); await p.wait_for_timeout(400)
        vues.append(('TOUT', Image.open(io.BytesIO(await p.screenshot())).convert('RGB')))
        for gid in ids:
            css=''.join(f'#{o}{{display:none}}' for o in ids if o!=gid)
            open('/tmp/v.html','w').write(f'<style>{css}</style><body style="margin:0;background:#fff">{svg}</body>')
            await p.goto('file:///tmp/v.html'); await p.wait_for_timeout(250)
            im=Image.open(io.BytesIO(await p.screenshot())).convert('RGB')
            a=np.array(im.convert('L')); m=a<250
            if m.any():
                ys,xs=np.where(m)
                im=im.crop((max(0,xs.min()-8),max(0,ys.min()-8),min(im.width,xs.max()+8),min(im.height,ys.max()+8)))
            vues.append((gid,im))
        await b.close()
    cols=min(5,len(vues)); rows=(len(vues)+cols-1)//cols
    board=Image.new('RGB',(cellule*cols,(cellule+22)*rows),'#eee'); d=ImageDraw.Draw(board)
    for i,(lab,im) in enumerate(vues):
        im=im.copy(); im.thumbnail((cellule-12,cellule-12))
        x=(i%cols)*cellule+6; y=(i//cols)*(cellule+22)+20
        board.paste(im,(x+(cellule-12-im.width)//2,y))
        d.text((x,y-13),lab[:34],fill='#000')
    board.save(sortie,quality=92)
    print(sortie, board.size, len(vues),'vues')

asyncio.run(rendre('planche-ui.svg','/tmp/planche_ui.jpg'))
asyncio.run(rendre('main-curseur.svg','/tmp/planche_main.jpg'))
