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

  // 1. la plaque PLEINE
  await page.screenshot({ path: `${OUT}/dash-${st}.png` });

  layout[st] = await page.evaluate(() => {
    const grab = (sel) => [...document.querySelectorAll(sel)].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
        cx: Math.round(r.x + r.width / 2), cy: Math.round(r.y + r.height / 2),
        txt: el.querySelector('.big')?.textContent?.trim()
          ?? el.querySelector('.nm')?.textContent?.trim() ?? null,
      };
    });
    return {
      cards: grab('[data-capture="card"]'),
      amounts: grab('[data-capture="amount"]'),
      rows: grab('[data-capture="row"]'),
    };
  });

  /**
   * 2. LES DECOUPES — une PNG par carte et par ligne.
   * ⭐ C'est ce qui permet l'APPARITION GRADUELLE sans redessiner : on pose les
   * morceaux de la PHOTO un par un sur une plaque vide. Fiche `row-embed` :
   * « une ligne qui s'anime est un decoupage de la plaque, JAMAIS un redessin —
   * le rendu de police d'un redessin differe visiblement de celui de la plaque ».
   * ⛔ Manque de la 1re version : je n'avais capture que la plaque entiere, donc
   * tout etait deja la des la 1re frame. Defaut vu par Aziz.
   */
  const sel = st === 'billing' ? '[data-capture="amount"]' : '[data-capture="card"]';
  const els = await page.$$(sel);
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: `${OUT}/dash-${st}-card${i + 1}.png` });
  }
  if (st === 'overview') {
    const rows = await page.$$('[data-capture="row"]');
    for (let i = 0; i < rows.length; i++) {
      await rows[i].screenshot({ path: `${OUT}/dash-overview-row${i + 1}.png` });
    }
  }

  /**
   * 3. LA PLAQUE VIDE — la meme page sans les cartes ni les lignes. C'est le
   * fond sur lequel les decoupes viennent se poser. `visibility:hidden` et non
   * `display:none` : la mise en page ne doit PAS bouger, sinon les bbox
   * mesurees a l'etape 1 ne correspondent plus a rien.
   */
  await page.evaluate((s) => {
    document.querySelectorAll(s + ', [data-capture="row"]').forEach((el) => {
      el.style.visibility = 'hidden';
    });
  }, sel);
  await new Promise((r) => setTimeout(r, 150));
  await page.screenshot({ path: `${OUT}/dash-${st}-empty.png` });
}

fs.writeFileSync(`${OUT}/dash-layout.json`, JSON.stringify(layout, null, 2));
console.log(JSON.stringify(layout, null, 2));
await browser.close();
