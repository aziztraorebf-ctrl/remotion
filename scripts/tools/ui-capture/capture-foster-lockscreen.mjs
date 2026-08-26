import puppeteer from 'puppeteer';
import fs from 'fs';

const OUT = '/Users/clawdbot/Workspace/remotion/public/_client-sim/foster/screens';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch();
const page = await browser.newPage();
// La page est authored a la resolution native iPhone 15 Pro (1179x2556).
// deviceScaleFactor 1 : le HTML porte deja les pixels reels.
await page.setViewport({ width: 1179, height: 2556, deviceScaleFactor: 1 });
await page.goto('http://localhost:8899/lockscreen.html', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 500));

await page.screenshot({ path: `${OUT}/lockscreen.png` });

const info = await page.evaluate(() => {
  const bb = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  };
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    notif: bb('.notif'),
    time: bb('.time'),
    widgets: bb('.widgets'),
    overflowsX: document.documentElement.scrollWidth > window.innerWidth,
  };
});
fs.writeFileSync(`${OUT}/lockscreen-layout.json`, JSON.stringify(info, null, 2));
console.log(JSON.stringify(info, null, 2));
await browser.close();
