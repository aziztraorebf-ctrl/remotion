# Mapbox headless : la carte ne se peint PAS sans delayRender par-frame

> Migré depuis auto-memory 2026-08-31.

**Symptôme** (vécu 2026-06-20 sur `SenegalActe2Continu`) : en render/still headless, le fond Mapbox reste VIDE (couleur de fond uniquement), seuls les dots/labels React s'affichent. La carte ne se peint pas → on croit à tort que "Mapbox ne rend pas headless".

**Vraie cause** : 2 niveaux.
1. **WebGL** : le renderer Remotion par défaut échoue (`Failed to initialize WebGL`). FIX = `--gl=angle` via `scripts/render-mapbox.sh` (chrome-headless-shell + slim public-dir + env-file). NE PAS rendre Mapbox avec `npx remotion render/still` nu.
2. **Tuiles pas attendues** : même avec WebGL OK, le snapshot capture AVANT que les tuiles de la vue courante soient peintes. La map s'init dans un `useEffect` sans bloquer le render → carte vide.

## Pattern obligatoire (prouvé : SahelWarMapEngine full HD, appliqué à SenegalActe2Continu 2026-06-20)
Deux `delayRender` :

**(1) init** — bloque le 1er render jusqu'au style+tuiles initiales :
```ts
const [initHandle] = useState(() => delayRender("init", { timeoutInMilliseconds: 60000 }));
const [ready, setReady] = useState(false);
// dans map.on("style.load", ...), À LA FIN :
map.once("idle", () => { setReady(true); try { continueRender(initHandle); } catch {} });
setTimeout(() => { setReady(true); try { continueRender(initHandle); } catch {} }, 4000); // garde-fou
```

**(2) PAR FRAME** — bloque chaque snapshot jusqu'à ce que les tuiles de CETTE vue (après `map.jumpTo`) soient peintes. DANS le useEffect caméra (deps incluant frame), APRÈS jumpTo+project :
```ts
if (ready) {
  const h = delayRender(`frame-${frame}`, { timeoutInMilliseconds: 40000 });
  let done = false;
  const finish = () => { if (!done) { done = true; try { continueRender(h); } catch {} } };
  map.once("idle", finish);
  setTimeout(finish, map.areTilesLoaded() ? 300 : 1200); // fallback si idle ne fire pas
}
```

## Commande de render (still ou mp4)
```bash
# via le harness (gère WebGL + slim public + env) :
./scripts/render-mapbox.sh <CompositionId> <out.mp4> [args]
# pour une still, mêmes flags à la main :
npx remotion still src/index.ts <Comp> out.png \
  --browser-executable="$HEADLESS_SHELL" --gl=angle --public-dir=/tmp/slim --env-file=.env --frame=N --scale=1
# (HEADLESS_SHELL = node_modules/.remotion/chrome-headless-shell/mac-arm64/.../chrome-headless-shell)
```
⚠️ zsh : `for f in public/*.json` throw si aucun match → `setopt NULL_GLOB` ou guard `ls ... >/dev/null 2>&1 &&`.

Lié : pourquoi on est passé à Mapbox réel pour le spatial (registre parchemin vs carte réelle). MapboxBase.tsx historique disait "ne peut pas rendre headless" — PÉRIMÉ, ce pattern le permet.
