---
name: NEXT SESSION - Atlas Tombouctou perf test + style.json
description: Brief pour la prochaine session Atlas. Demarrage direct sur test perf Mapbox+Remotion (bloque par version mismatch a resoudre). Le menage CLAUDE.md a ete fait. Ce brief est self-contained.
type: project
---

# NEXT SESSION - Atlas Tombouctou : Test perf + Style.json Parchemin Mande

> Cree : 2026-04-28 fin de session apres menage CLAUDE.md
> Statut : Test perf Mapbox+Remotion bloque sur version mismatch Remotion. A resoudre AVANT toute generation de style.json.

---

## Etat actuel (2026-04-28)

### Decisions strategiques figees (NE PAS rediscuter)
- Style choisi : **B Parchemin Mande**
- Pilote : **Tombouctou** (mini-serie Mali en episode 2)
- Audience : francophonie mondiale + diaspora bilingue (RPM mixte ~$3-5/1000)
- Stack : Remotion 4 + mapbox-gl 3.22 + react-map-gl 8.1 + Gemini 3.1 Flash Image Preview
- Cout mensuel ~$33-48/mois
- Bootstrap 6 mois accepte

Reference visuelle cible : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/style-comparison/B-parchemin-mande.png

### Ce qui a ete fait dans la session precedente
1. Lecture des 5 fichiers de contexte (MEMORY.md, NEXT-SESSION-atlas-mali-tombouctou.md, script-atlas-v1.md, script-tombouctou-v1.md, FACT-CHECK-CONVERSATION.md)
2. Tentative de test perf Etape A (`MapOutdoorsClean` frame 120) → ECHEC : "Error  Failed to initialize WebGL"
3. **Identification du root cause** : version mismatch Remotion entre `quebec-jacques-poc/node_modules` (v4.0.452) et le `node_modules` racine workspace (v4.0.415 / v4.0.427)
4. **Menage CLAUDE.md** complete : 26 099 → 18 174 caracteres (-30%, -42% lignes)
   - Supprime : 9 Phases Andy Lo, Style Visuel obsolete, detail 5 agents, Principes fonctionnement, liste Cles API
   - Consolide : 2 regles verification → 1 regle "Verification avant affirmation"
   - Ajoute : colonne "Skills `.claude/skills/`" dans tableau routage avec Remotion + Mapbox

---

## Stack technique - etat reel verifie

### Versions installees (verifiees en session precedente)
- `quebec-jacques-poc/package.json` : remotion@4.0.452, mapbox-gl@3.22.0, react-map-gl@8.1.1, react@19.2.5
- `quebec-jacques-poc/.env` : `REMOTION_MAPBOX_TOKEN` present
- `.env` racine : `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `MOONSHOT_API_KEY`, `OPENAI_API_KEY`, `XAI_API_KEY`, `PIXELLAB_API_KEY`, `RECRAFT_API_KEY`, `FAL_KEY`, `VERCEL_RENDER_URL`, `AUPHONIC_API_KEY`, `OPENROUTER_API_KEY`, `TEXTBELT_KEY`, `TEXTBELT_PHONE` (verifie via grep)

### Composant existant utilise pour le test perf
`quebec-jacques-poc/src/MapOutdoorsClean.tsx` (composition `MapOutdoorsClean`, declaree dans `Root.tsx`)
- Pattern correct : `delayRender` + `continueRender` + `map.on("idle")`
- KEYFRAMES animation : Quebec zoom (frame 0 → 240, lon -71/-68, lat 53/49, zoom 3/5.5)
- Container : 1280x720 actuellement (a tester aussi 1080x1920 pour mobile Atlas)
- Anti-pattern detecte : `mapRef.current.jumpTo()` dans useEffect au lieu d'interpolation Remotion - acceptable pour le test perf, a refactorer si on garde le pattern pour Atlas

---

## Plan de session : etape par etape

### Etape 0 - Verifier les regles fraichement consolidees
1. Charger `MEMORY.md` (auto-charge)
2. Lire CLAUDE.md projet recemment menage (nouveau tableau routage + skills)
3. Lire ce brief

### Etape 1 - Resoudre le version mismatch Remotion (PRIORITE)

**Probleme** : test perf Etape A a echoue avec "Failed to initialize WebGL". Mais l'erreur n'est probablement PAS un probleme GPU - c'est plutot que la resolution React/Remotion charge plusieurs versions et plante avant meme d'arriver au render Mapbox.

**Diagnostic a refaire en debut de session** :
```bash
cd /Users/clawdbot/Workspace/remotion/quebec-jacques-poc
npx remotion versions --log=verbose 2>&1 | head -40
```

**Options de resolution** :
- A. Aligner toutes les versions Remotion sur 4.0.452 (modifier package.json racine si besoin, ou pinner `^` strict)
- B. Si le mismatch est dans les `node_modules` racine workspace mais que `quebec-jacques-poc/node_modules` est isole, verifier que le bundling utilise bien le node_modules local (pas remontee parent)
- C. Si echec persistant : creer un dossier projet propre `/atlas-tombouctou-poc/` avec `npm install` frais

**IMPORTANT** : avant de toucher a quoi que ce soit, lire le skill `remotion-best-practices/rules/maps.md` (route vers ce skill par le tableau de routage CLAUDE.md). C'est la qu'est probablement le pattern Mapbox+Remotion correct, qui pourrait revealer un probleme de config qu'on a manque.

### Etape 2 - Test perf une fois mismatch resolu

**Etape A** : 1 frame headless, config par defaut
```bash
cd quebec-jacques-poc && /usr/bin/time -p npx remotion still MapOutdoorsClean out/perf-test/A-frame120.jpg --frame=120
```

**Etape B** : ajouter `Config.setChromiumOpenGlRenderer("angle-egl")` dans `remotion.config.ts` et re-tester
- Note : `angle-egl` est documente Linux principalement. Sur Mac, alternative : `angle` ou pas de config (laisser Metal natif)
- Le skill `remotion-video-toolkit/rules/rendering.md` doit confirmer la bonne valeur

**Etape C** : 5 frames consecutives (cohorence + memory)
```bash
npx remotion still MapOutdoorsClean out/perf-test/C-{120,150,180,210,240}.jpg
```

**Critères décisionnels** (rappel du fact-check) :
- < 5s/frame : GO style.json maintenant
- 5-10s/frame : GO mais accepter 4-6 min de render pour 80s
- 10-30s/frame : GO mais splitter en chunks 30s
- \> 30s/frame : PIVOT pre-render Mapbox en images statiques (Puppeteer headless), Remotion compose les overlays

### Etape 3 - GO/PIVOT decision documentee

Si GO : passer Etape 4 (style.json)
Si PIVOT : ecrire un nouveau brief pre-render strategy + reprendre la decision avec Aziz

### Etape 4 - Coder mapbox-styles/atlas-parchemin-mande.json (4-8h estime)

**AVANT de coder** : charger les skills Mapbox via le tableau de routage CLAUDE.md
- `mapbox-cartography` (couleurs, typo, hierarchie)
- `mapbox-style-quality` (validation production)
- `mapbox-web-integration-patterns` (si refactor du composant)

**Cible style** : 5 couches principales + bordures decoratives mudcloth/Adinkra
- Background parchemin cream `#E8D9B8`
- Pays terracotta ocre `#A0522D`
- Frontieres indigo profond `#2C3E5C`
- Eau / fleuves indigo plus clair
- Labels typo hybride (geo + sans-serif)

### Etape 5 - Aziz upload sur Mapbox Studio + mini-render 5s

(Voir `memory/NEXT-SESSION-atlas-mali-tombouctou.md` etapes 2-3 pour le detail).

---

## Fichiers de reference

- `memory/NEXT-SESSION-atlas-mali-tombouctou.md` : brief original detaille (etapes 1-9)
- `memory/templates/script-atlas-v1.md` : template script methode complete
- `quebec-jacques-poc/scripts-atlas/script-tombouctou-v1.md` : script V1 valide
- `quebec-jacques-poc/research/FACT-CHECK-CONVERSATION.md` : verifications + risques techniques
- `quebec-jacques-poc/src/MapOutdoorsClean.tsx` : composant Remotion+Mapbox existant pour le test
- `quebec-jacques-poc/remotion.config.ts` : config Remotion (a enrichir avec GPU/chromiumOptions)

---

## Starter prompt copier-coller

```
Charge la memoire de session :
1. MEMORY.md (auto-charge - section "NOUVEAU TERRITOIRE - CHAINE GEOAFRIQUE")
2. memory/NEXT-SESSION-atlas-tombouctou-perf-test.md (ce brief)
3. CLAUDE.md projet (recemment menage, nouveau tableau routage skills)

Session Atlas Tombouctou - reprise apres menage CLAUDE.md.

Etat : test perf Mapbox+Remotion bloque sur version mismatch Remotion (4.0.452 dans le poc, 4.0.415/427 dans le workspace racine). Avant de generer le style.json, on doit valider que Remotion+Mapbox tient la perf en headless.

Premiere action : diagnostiquer le mismatch via `npx remotion versions --log=verbose` dans quebec-jacques-poc/, puis lire le skill remotion-best-practices/rules/maps.md (route via tableau CLAUDE.md), puis relancer le test perf Etape A.

Decisions figees : Parchemin Mande / Tombouctou / stack Remotion 4 + mapbox-gl 3.22 + react-map-gl 8.1.

Reference visuelle cible : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/style-comparison/B-parchemin-mande.png

Demarre par le diagnostic du version mismatch.
```

---

## Decisions deja figees (NE PAS rediscuter)

- Style Parchemin Mande choisi
- Pilote Tombouctou choisi (Mali en episode 2)
- Audience francophonie mondiale + diaspora
- Stack technique disponible
- Bootstrap 6 mois accepte
- Mapbox = essentiellement gratuit
- Menage CLAUDE.md fait, structure stabilisee

**Si Aziz veut rediscuter, OK, mais default = ON EXECUTE.**
