import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CONFIG = {
  BASE: 'http://localhost:8899',
  OUT_DIR: './out-light',
  LAYOUT_JSON: './out-light/live-layout.json',
  VIEWPORT: { width: 1920, height: 1080, deviceScaleFactor: 2 },
  SETTLE_MS: 700,
  PAGES: [
    {
      name: 'dashboard',
      path: '/index.html',
      boxes: [
        { key: 'rows', selector: '[data-capture="row"]', all: true },
        { key: 'thead', selector: '[data-capture="thead"]' },
        { key: 'nav', selector: '[data-capture="nav"]' },
        { key: 'search', selector: '[data-capture="search"]' },
      ],
      cutouts: [
        { name: 'row', selector: '[data-capture="row"]', all: true, max: 8 },
        { name: 'flagged', selector: '.row.is-flagged', omitBackground: true },
        { name: 'nav', selector: '[data-capture="nav"]' },
      ],
      hideForEmptyPlate: '[data-capture="row"]',
    },
    {
      name: 'filtered',
      path: '/index.html',
      boxes: [
        { key: 'rows', selector: '[data-capture="row"]', all: true },
      ],
      cutouts: [],
      interact: () => {
        const rows = [...document.querySelectorAll('[data-capture="row"]')];
        const flagged = rows.find((r) => r.classList.contains('is-flagged'));
        rows.forEach((r) => { if (r !== flagged) r.remove(); });
        const ph = document.querySelector('.searchbar .ph');
        if (ph) { ph.textContent = 'Berlin'; ph.style.color = '#F4F1EA'; }
        return true;
      },
      interactWaitMs: 400,
    },
  ],
};
// ======================================================================
// 以下为通用采集逻辑，一般无需修改
// ======================================================================

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, CONFIG.OUT_DIR);
const layoutPath = path.resolve(here, CONFIG.LAYOUT_JSON);
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(layoutPath), { recursive: true });

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport(CONFIG.VIEWPORT);

// 等字体加载完再静置片刻——避免截到 FOUT/骨架屏
const settle = async () => {
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, CONFIG.SETTLE_MS));
};

// 元素 bbox 换算到整页坐标系（fullPage 截图的坐标系）
const pageBox = (el) =>
  el.evaluate((e) => {
    const r = e.getBoundingClientRect();
    return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height };
  });

const layout = { pageW: CONFIG.VIEWPORT.width };

for (const pg of CONFIG.PAGES) {
  await page.goto(`${CONFIG.BASE}${pg.path}`, { waitUntil: 'networkidle0' });
  await settle();
  if (pg.waitMs) await new Promise((r) => setTimeout(r, pg.waitMs));

  const entry = { pageH: await page.evaluate(() => document.documentElement.scrollHeight) };
  layout[pg.name] = entry;

  // ---- 1. 全页 2x 截图 ----
  await page.screenshot({ path: `${outDir}/${pg.name}-full.png`, fullPage: true });
  console.log(`captured ${pg.name}-full`, entry.pageH);

  // ---- 2. boxes：只记坐标 ----
  entry.boxes = {};
  for (const b of pg.boxes ?? []) {
    const els = await page.$$(b.selector);
    const picked = b.all ? els.slice(0, b.max ?? els.length) : els.slice(0, 1);
    const boxes = [];
    for (const el of picked) boxes.push(await pageBox(el));
    entry.boxes[b.key] = b.all ? boxes : boxes[0] ?? null;
    console.log(`  boxes.${b.key}:`, boxes.length);
  }

  // ---- 3. cutouts：元素 PNG + bbox ----
  entry.cutouts = [];
  for (const c of pg.cutouts ?? []) {
    let els = await page.$$(c.selector);
    if (c.parent) {
      // 取匹配元素的父容器（如 input 的圆角外壳）
      const parents = [];
      for (const el of els) {
        const h = await el.evaluateHandle((e) => e.parentElement);
        const p = h.asElement();
        if (p) parents.push(p);
      }
      els = parents;
    }
    const picked = c.all ? els.slice(0, c.max ?? els.length) : els.slice(0, 1);
    for (let i = 0; i < picked.length; i++) {
      const file = c.all ? `${c.name}${i + 1}.png` : `${c.name}.png`;
      const bb = await pageBox(picked[i]);
      try {
        await picked[i].screenshot({
          path: `${outDir}/${file}`,
          omitBackground: !!c.omitBackground,
        });
      } catch (e) {
        console.log(`  cutout miss ${file}:`, e.message);
        continue;
      }
      entry.cutouts.push({ file, ...bb });
      console.log(`  captured ${file}`, bb);
    }
    if (picked.length === 0) console.log(`  cutout miss ${c.name} (no match: ${c.selector})`);
  }

  // ---- 4. 页内交互后的补充全页图（可选） ----
  if (pg.interact) {
    const did = await page.evaluate(pg.interact);
    if (did) {
      await new Promise((r) => setTimeout(r, pg.interactWaitMs ?? 800));
      await page.screenshot({ path: `${outDir}/${pg.name}-after.png`, fullPage: true });
      entry.afterPageH = await page.evaluate(() => document.documentElement.scrollHeight);
      console.log(`captured ${pg.name}-after`);
    }
  }

  // ---- 5. 空底板（可选）：隐藏元素后再截一张，供飞入镜头 ----
  if (pg.hideForEmptyPlate) {
    await page.evaluate((sel) => {
      document.querySelectorAll(sel).forEach((el) => { el.style.visibility = 'hidden'; });
    }, pg.hideForEmptyPlate);
    await page.screenshot({ path: `${outDir}/${pg.name}-empty.png`, fullPage: true });
    console.log(`captured ${pg.name}-empty`);
    // 复原，避免影响同页后续步骤（当前实现里本步骤已是该页最后一步）
    await page.evaluate((sel) => {
      document.querySelectorAll(sel).forEach((el) => { el.style.visibility = ''; });
    }, pg.hideForEmptyPlate);
  }
}

fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 1));
console.log('wrote', layoutPath);
await browser.close();
