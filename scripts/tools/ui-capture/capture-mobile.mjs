import puppeteer from 'puppeteer';
import fs from 'fs';

const OUT = '/Users/clawdbot/Workspace/remotion/public/_client-sim/noteshield/live-mobile';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch();
const page = await browser.newPage();
// Viewport telephone reel (iPhone 14/15 logique), x3 pour la nettete en texture 3D
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
await page.goto('http://localhost:8899/index.html', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 800));

// Plaque pleine hauteur du viewport (pas fullPage : on veut l'ecran, pas le document)
await page.screenshot({ path: `${OUT}/dashboard-mobile.png` });

// Mesure de ce qui est reellement visible a cette largeur
const info = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('[data-capture="row"]')];
  const flagged = document.querySelector('.row.is-flagged');
  return {
    docW: document.documentElement.scrollWidth,
    docH: document.documentElement.scrollHeight,
    rows: rows.length,
    flaggedTop: flagged ? Math.round(flagged.getBoundingClientRect().top) : null,
    overflowsX: document.documentElement.scrollWidth > 390,
  };
});
fs.writeFileSync(`${OUT}/mobile-layout.json`, JSON.stringify(info, null, 2));
console.log(JSON.stringify(info));
await browser.close();
