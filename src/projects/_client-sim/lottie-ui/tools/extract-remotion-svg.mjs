/**
 * Extrait le SVG REEL et RESOLU d'une composition Remotion, a une frame donnee.
 *
 * POURQUOI CET OUTIL
 * ------------------
 * Nos scenes ne sont pas des fichiers .svg : ce sont des composants React qui
 * CALCULENT leur SVG a chaque frame (useCurrentFrame, interpolate, spring).
 * Le convertisseur svg2lottie_scene.py lit des fichiers ; il ne peut donc pas
 * les prendre telles quelles.
 *
 * Mais Remotion rend dans un navigateur : a une frame donnee, le SVG existe
 * dans le DOM, entierement resolu (tous les interpolate deja calcules). On le
 * recupere tel quel -- c'est exactement ce que voit le spectateur.
 *
 * POURQUOI PAS LE STUDIO (cause racine de l'echec precedent)
 * ---------------------------------------------------------
 * Ouvrir http://localhost:PORT/<CompositionId> avec Playwright ne marche PAS.
 * Dans node_modules/@remotion/studio/dist/renderEntry.js, le bundle demarre en
 * mode 'index' :
 *   - en navigateur normal -> il monte le STUDIO COMPLET (sidebar, timeline).
 *     Le chemin d'URL est purement decoratif : c'est le state client qui
 *     choisit la composition. D'ou les 82 <svg> d'icones d'interface 16x16.
 *   - en navigateur headless -> `if (isInHeadlessBrowser()) return;`
 *     il ne rend RIEN DU TOUT.
 * La composition ne se monte que si l'on appelle explicitement
 * `window.remotion_setBundleMode({type:'composition', ...})` avec les metadonnees
 * resolues, puis `window.remotion_setFrame(...)`. C'est precisement ce que fait
 * renderStill() en interne.
 *
 * LA SOLUTION RETENUE
 * -------------------
 * Ne pas reimplementer cette sequence fragile a la main : on passe NOTRE PROPRE
 * navigateur a renderStill() via `puppeteerInstance`. Remotion fait tout le
 * setup correct (bundle mode, props resolues, seek de frame, attente des
 * delayRender, document.fonts.ready), et quand il a fini on lit le DOM de la
 * page qu'il a utilisee. Zero duplication de la machinerie interne : si Remotion
 * change, on suit.
 *
 * CE QUE CA DONNE ET CE QUE CA NE DONNE PAS
 * -----------------------------------------
 *   - donne  : la scene FIGEE a la frame demandee, convertible en Lottie
 *   - ne donne PAS : l'animation. Les interpolate sont "cuits" dans les
 *     coordonnees. Animer ensuite est notre travail, en Lottie.
 *   Extraire 2-3 frames cles (debut / milieu / fin) documente le mouvement
 *   voulu sans le porter automatiquement.
 *
 * USAGE
 *   node src/projects/_client-sim/lottie-ui/tools/extract-remotion-svg.mjs \
 *        <CompositionId> [--frame 200] [-o sortie.svg] [--frames 0,150,300]
 *
 * Options :
 *   --frame N        frame unique (defaut 0)
 *   --frames a,b,c   plusieurs frames (ecrit <CompositionId>-fN.svg)
 *   -o / --out       chemin de sortie (frame unique seulement)
 *   --entry          point d'entree (defaut src/index.ts)
 *   --all-svg        concatene TOUS les <svg> de la scene au lieu du plus grand
 *   --keep-bundle    ne pas resupprimer le bundle (accelere les appels suivants)
 */

import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, "../../../../..");

// ---------------------------------------------------------------- arguments

function lireArguments(argv) {
  const a = {
    composition: null,
    frames: null,
    frame: 0,
    out: null,
    entry: "src/index.ts",
    allSvg: false,
    keepBundle: false,
  };
  const reste = [];
  for (let i = 0; i < argv.length; i++) {
    const jeton = argv[i];
    if (jeton === "--frame") a.frame = parseInt(argv[++i], 10);
    else if (jeton === "--frames") a.frames = argv[++i].split(",").map((x) => parseInt(x.trim(), 10));
    else if (jeton === "-o" || jeton === "--out") a.out = argv[++i];
    else if (jeton === "--entry") a.entry = argv[++i];
    else if (jeton === "--all-svg") a.allSvg = true;
    else if (jeton === "--keep-bundle") a.keepBundle = true;
    else reste.push(jeton);
  }
  a.composition = reste[0] ?? null;
  return a;
}

// ------------------------------------------------------------------ bundle

/**
 * Reutilise un bundle deja construit si l'entree n'a pas change, sinon le
 * reconstruit. Le bundle coute ~30-60s : on le cache dans un dossier stable
 * plutot que dans un tmpdir aleatoire.
 */
async function obtenirBundle(entree) {
  const cache = path.join(os.tmpdir(), "remotion-svg-extract-bundle");
  const marqueur = path.join(cache, ".entry");
  const chemin = path.resolve(RACINE, entree);

  if (fs.existsSync(path.join(cache, "index.html")) && fs.existsSync(marqueur)) {
    if (fs.readFileSync(marqueur, "utf8") === chemin) {
      process.stderr.write("bundle reutilise (cache)\n");
      return cache;
    }
  }

  process.stderr.write("bundle en cours (30-60s la premiere fois)...\n");
  const url = await bundle({
    entryPoint: chemin,
    outDir: cache,
    // Tailwind est active dans remotion.config.ts ; le bundler programmatique
    // ne lit PAS ce fichier, on rebranche donc la config a la main.
    webpackOverride: (config) => enableTailwind(config),
    // ⛔⛔ MEME CAUSE, DEUXIEME VICTIME : `publicDir` non plus n'est pas lu
    // depuis remotion.config.ts. Sans cette ligne, tout asset servi par
    // staticFile() renvoie un 404 et DISPARAIT du SVG extrait -- en silence,
    // le rendu se contente d'omettre l'element. Mesure (2026-08-30,
    // KhartoumEtatMajorSVG) : le mode actif est `portrait-formation`, donc
    // 4 medaillons PHOTO par colonne ; les SVG extraits en contenaient ZERO
    // et personne ne l'a vu pendant deux sessions. Le 404 etait pourtant
    // affiche dans la sortie de l'extracteur -- signale, jamais interprete.
    publicDir: path.join(RACINE, "public"),
    onProgress: (p) => {
      if (p % 25 === 0) process.stderr.write(`  bundle ${p}%\n`);
    },
  });
  fs.writeFileSync(marqueur, chemin);
  return url;
}

// ------------------------------------------------------------- extraction

/**
 * Lit le SVG dans la page que renderStill vient d'utiliser.
 *
 * Subtilite : le navigateur de Remotion est un fork de Puppeteer dont l'API
 * `page` n'est pas standard. On passe donc par `page.mainFrame()` et
 * l'evaluation brute, comme le fait puppeteer-evaluate.js en interne.
 */
async function lireSvgDansPage(page, toutLesSvg) {
  const fonction = `(() => {
    // #remotion-canvas est le portail dans lequel renderEntry.js monte la
    // composition. On s'y limite : cela exclut par construction les icones
    // d'interface qui avaient pollue la tentative precedente.
    const racine = document.getElementById('remotion-canvas') || document.body;
    const FORMES = 'path,circle,ellipse,rect,line,polygon,polyline,text';
    const svgs = [...racine.querySelectorAll('svg')].filter((s) => !s.closest('svg') || s.closest('svg') === s);
    if (!svgs.length) return null;

    const compter = (s) => s.querySelectorAll(FORMES).length;

    if (${toutLesSvg ? "true" : "false"} && svgs.length > 1) {
      const morceaux = svgs.map((s) => {
        const r = s.getBoundingClientRect();
        return { html: s.outerHTML, x: r.x, y: r.y, w: r.width, h: r.height };
      });
      return { multi: morceaux, n: svgs.reduce((t, s) => t + compter(s), 0),
               w: window.innerWidth, h: window.innerHeight };
    }

    let meilleur = svgs[0];
    let score = -1;
    for (const s of svgs) {
      const r = s.getBoundingClientRect();
      const aire = r.width * r.height;
      if (aire > score) { score = aire; meilleur = s; }
    }
    const r = meilleur.getBoundingClientRect();
    return { html: meilleur.outerHTML, w: r.width, h: r.height, n: compter(meilleur),
             total: svgs.length, totalFormes: svgs.reduce((t, s) => t + compter(s), 0) };
  })()`;

  const contexte = await page.mainFrame().executionContext();
  const client = page._client();
  // Le fork Puppeteer de Remotion enveloppe la reponse CDP dans {value: {...}, size}
  // et passe par Runtime.callFunctionOn (cf. puppeteer-evaluate.js) : on s'aligne
  // exactement dessus, Runtime.evaluate ne renvoie pas la meme forme ici.
  const reponse = await client.send("Runtime.callFunctionOn", {
    functionDeclaration: `function () { return ${fonction}; }\n//# sourceURL=__extract_svg__\n`,
    executionContextId: contexte._contextId,
    arguments: [],
    returnByValue: true,
    awaitPromise: true,
  });
  const enveloppe = reponse?.value ?? reponse;
  if (enveloppe?.exceptionDetails) {
    const d = enveloppe.exceptionDetails;
    throw new Error("evaluation echouee : " + (d.exception?.description ?? JSON.stringify(d)));
  }
  return enveloppe?.result?.value ?? null;
}

/**
 * Rend le SVG autonome : le DOM omet xmlns (le navigateur le sait deja) mais
 * un fichier .svg sur disque en a besoin, sinon aucun parseur ne le lit.
 */
function rendreAutonome(svg, largeur, hauteur) {
  let sortie = svg;
  if (!/\sxmlns=/.test(sortie)) {
    sortie = sortie.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1);
  }
  if (/xlink:/.test(sortie) && !/xmlns:xlink=/.test(sortie)) {
    sortie = sortie.replace("<svg", '<svg xmlns:xlink="http://www.w3.org/1999/xlink"', 1);
  }
  const balise = sortie.slice(0, sortie.indexOf(">") + 1);
  if (!/viewBox=/.test(balise) && !/width=/.test(balise)) {
    sortie = sortie.replace("<svg", `<svg width="${Math.round(largeur)}" height="${Math.round(hauteur)}"`, 1);
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + sortie + "\n";
}

/** Enveloppe plusieurs <svg> frere dans un seul, positionnes a leur place ecran. */
function fusionnerSvg(morceaux, largeur, hauteur) {
  const corps = morceaux
    .map((m) => {
      const interne = m.html.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
      const entete = m.html.slice(0, m.html.indexOf(">") + 1);
      const vb = /viewBox="([^"]*)"/.exec(entete);
      const attrVb = vb ? ` viewBox="${vb[1]}"` : "";
      return `<svg x="${Math.round(m.x)}" y="${Math.round(m.y)}" width="${Math.round(m.w)}" height="${Math.round(m.h)}"${attrVb}>${interne}</svg>`;
    })
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${largeur}" height="${hauteur}" viewBox="0 0 ${largeur} ${hauteur}">\n${corps}\n</svg>\n`;
}

// ------------------------------------------------------------------- main

async function main() {
  const a = lireArguments(process.argv.slice(2));
  if (!a.composition) {
    process.stderr.write("usage: extract-remotion-svg.mjs <CompositionId> [--frame N] [-o out.svg]\n");
    process.exit(1);
  }

  const serveUrl = await obtenirBundle(a.entry);

  const composition = await selectComposition({
    serveUrl,
    id: a.composition,
    inputProps: {},
  });
  process.stderr.write(
    `composition "${composition.id}" : ${composition.width}x${composition.height}, ` +
      `${composition.durationInFrames} frames @ ${composition.fps}fps\n`
  );

  // On ouvre NOTRE navigateur pour pouvoir en recuperer la page apres coup.
  // chromeMode 'headless-shell' = le defaut de Remotion (open-browser.js:202).
  // Forcer 'chrome-for-testing' declenche un telechargement de 170 Mo ET fait
  // expirer le delayRender du composant racine : rester sur le defaut.
  const navigateur = await openBrowser("chrome", { chromeMode: "headless-shell" });

  const frames = a.frames ?? [a.frame];
  let codeSortie = 0;

  try {
    for (const f of frames) {
      if (f < 0 || f >= composition.durationInFrames) {
        process.stderr.write(`ECHEC frame ${f} : hors bornes (0..${composition.durationInFrames - 1})\n`);
        codeSortie = 2;
        continue;
      }

      const erreurs = [];

      // renderStill cree SA page puis la FERME en sortie (render-still.js : quand
      // un puppeteerInstance est fourni, il fait `await page.close()`). Lire le DOM
      // apres coup est donc impossible, et courir apres la page pendant le rendu
      // serait une course. On intercepte donc newPage pour garder une reference sur
      // la page exacte, et on neutralise SON close() : c'est nous qui fermerons.
      let pageRendu = null;
      const newPageOriginal = navigateur.newPage.bind(navigateur);
      navigateur.newPage = async (...args) => {
        const page = await newPageOriginal(...args);
        pageRendu = page;
        page.close = async () => {};
        return page;
      };

      // renderStill fait tout le travail correct : bundle mode 'composition',
      // props resolues, seek de frame, attente des delayRender et des polices.
      // Le PNG produit est un sous-produit dont on se moque -- ce qui nous
      // interesse, c'est l'etat du DOM une fois qu'il a fini.
      const pngJetable = path.join(os.tmpdir(), `remotion-svg-extract-${process.pid}-${f}.png`);
      await renderStill({
        composition,
        serveUrl,
        output: pngJetable,
        frame: f,
        overwrite: true,
        puppeteerInstance: navigateur,
        // Notre Root.tsx monte plusieurs centaines de compositions : le chargement
        // du composant racine depasse largement le defaut de 30s.
        timeoutInMilliseconds: 120000,
        onBrowserLog: (log) => {
          if (log.type === "error") erreurs.push(log.text);
        },
      });

      navigateur.newPage = newPageOriginal;
      if (!pageRendu) throw new Error("page introuvable : newPage n'a pas ete interceptee");

      let infos;
      try {
        infos = await lireSvgDansPage(pageRendu, a.allSvg);
      } finally {
        delete pageRendu.close;
        await pageRendu.close().catch(() => {});
      }
      if (!infos) {
        process.stderr.write(`ECHEC frame ${f} : aucun <svg> dans #remotion-canvas\n`);
        codeSortie = 2;
        continue;
      }

      let svg;
      let nbFormes;
      if (infos.multi) {
        svg = fusionnerSvg(infos.multi, composition.width, composition.height);
        nbFormes = infos.n;
      } else {
        svg = rendreAutonome(infos.html, infos.w, infos.h);
        nbFormes = infos.n;
      }

      const sortie =
        a.out && frames.length === 1 ? a.out : `${a.composition}-f${f}.svg`;
      fs.mkdirSync(path.dirname(path.resolve(sortie)), { recursive: true });
      fs.writeFileSync(sortie, svg, "utf8");

      const ko = (fs.statSync(sortie).size / 1024).toFixed(1);
      const extra = infos.multi
        ? `${infos.multi.length} svg fusionnes`
        : `${infos.total} svg dans la scene, ${infos.totalFormes} formes au total`;
      process.stdout.write(
        `frame ${String(f).padStart(4)} -> ${sortie}  (${ko} Ko, ${nbFormes} formes retenues, ${extra})\n`
      );
      for (const e of erreurs.slice(0, 3)) process.stderr.write(`    [console] ${e}\n`);

      fs.rmSync(pngJetable, { force: true });
    }
  } finally {
    await navigateur.close({ silent: true }).catch(() => {});
  }

  process.exit(codeSortie);
}

main().catch((err) => {
  process.stderr.write("ECHEC : " + (err?.stack ?? String(err)) + "\n");
  process.exit(2);
});
