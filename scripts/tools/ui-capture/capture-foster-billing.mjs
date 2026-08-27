import puppeteer from 'puppeteer';
import fs from 'fs';

/**
 * PLAQUE DU PLAN 8B — le dashboard Billing sur lequel la camera panote.
 *
 * ⛔ Regle n°1 du pilier UI PRODUIT : on CAPTURE une vraie page, on ne redessine
 * pas l'UI en React (le rendu de police trahit un redessin).
 *
 * VIEWPORT 3400x1200 : la camera panote sur ~550 px/s pendant ~2 s (mesure par
 * correlation croisee sur la reference). Une plaque a la largeur du cadre se
 * serait videe a mi-parcours.
 *
 * deviceScaleFactor 2 : la camera ZOOME (x1,3 mesure) — sans la plaque en 2x, le
 * texte devient mou des qu'on se resserre.
 */
const OUT = '/Users/clawdbot/Workspace/remotion/public/_client-sim/foster/screens';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

/**
 * Les bbox REELLES de chaque carte — les keyframes de `PageCam` se posent
 * dessus. ⛔ Ne JAMAIS deduire ces valeurs du CSS : le piege n°1 de la fiche est
 * precisement d'avoir calcule une position au lieu de la mesurer.
 */
const layout = {};
for (const st of ['overview', 'billing']) {
  await page.goto(`http://localhost:8899/billing.html?state=${st}`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `${OUT}/dash-${st}.png` });
  layout[st] = await page.evaluate(() => {
    const grab = (sel) => [...document.querySelectorAll(sel)].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
        cx: Math.round(r.x + r.width / 2), cy: Math.round(r.y + r.height / 2),
        txt: el.querySelector('.big')?.textContent?.trim() ?? null,
      };
    });
    return { cards: grab('[data-capture="card"]'), amounts: grab('[data-capture="amount"]') };
  });
}

fs.writeFileSync(`${OUT}/dash-layout.json`, JSON.stringify(layout, null, 2));
console.log(JSON.stringify(layout, null, 2));
await browser.close();
