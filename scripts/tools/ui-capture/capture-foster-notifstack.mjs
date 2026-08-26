import puppeteer from 'puppeteer';
import fs from 'fs';

const OUT = '/Users/clawdbot/Workspace/remotion/public/_client-sim/foster/screens';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1179, height: 2556, deviceScaleFactor: 1 });

// 9 etats mesures sur la reference : frappe de la reponse puis empilement.
const STATES = ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 's1', 's2', 's3'];
const layout = {};
for (const st of STATES) {
  await page.goto(`http://localhost:8899/notifstack.html?state=${st}`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot({ path: `${OUT}/stack-${st}.png` });
  layout[st] = await page.evaluate(() => {
    const bb = (sel) => {
      const el = document.querySelector(sel);
      if (!el || el.classList.contains('hidden')) return null;
      const r = el.getBoundingClientRect();
      return { y: Math.round(r.y), h: Math.round(r.height) };
    };
    return { ofsted: bb('#ofsted'), n1: bb('#n1'), n2: bb('#n2'), n3: bb('#n3') };
  });
}
fs.writeFileSync(`${OUT}/stack-layout.json`, JSON.stringify(layout, null, 2));
console.log(JSON.stringify(layout, null, 2));
await browser.close();
