# ui-capture — capture d'une page web en matiere animable

Adapte de `assets/scripts/capture-template.mjs` de video-shotcraft (Apache-2.0).
**Doctrine et pieges : `memory/fiches/FICHE-UI-PRODUIT.md`** (injectee automatiquement par hook).

## Usage
```bash
# 1. servir la page (⛔ --directory : un `cd` ne persiste pas -> 404)
python3 -m http.server 8899 --directory src/projects/_client-sim/<client>/live-page

# 2. capturer (npm i puppeteer dans un dossier de travail)
node capture-northshield.mjs
```

## Ce que ca produit
- `<page>-full.png` — plaque pleine page en **2x** (texture nette pour les plans serres)
- `<page>-empty.png` — la meme SANS les lignes (`hideForEmptyPlate`), fond pour les entrees
- `rowN.png` / `nav.png` — decoupes par element
- `<page>-after.png` — 2e etat, apres l'`interact` (ex. liste filtree)
- **`live-layout.json`** — les bbox REELLES de chaque element. C'est la piece maitresse :
  l'animation se positionne dessus, jamais sur des coordonnees inventees.

⛔ **`live-layout.json` decrit l'etat AVANT `interact`.** Pour l'etat apres, MESURER sur le PNG.
