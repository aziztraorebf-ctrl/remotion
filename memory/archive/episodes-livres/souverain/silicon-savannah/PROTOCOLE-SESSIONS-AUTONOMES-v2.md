# Protocole Sessions Autonomes — Silicon Savannah v2.0
> Validé par Aziz — 2026-05-15
> Remplace : PROTOCOLE-SESSIONS-AUTONOMES.md (v1 archivé, reste lisible)
> IMMUABLE : ne pas modifier sans accord explicite d'Aziz

---

## CE QUI A CHANGÉ vs v1

| v1 | v2 |
|----|-----|
| `review_with_kimi.py` — script Kimi-only | `visual_review.py` — routeur Gemini/Kimi/Qwen |
| Gemini appelé via scripts Python jetables ad hoc | Gemini intégré avec `responseMimeType: application/json` et prompt hardcodé |
| Frames extraites sans règle de timing précise | Règle `--offset 0.3` (+30% dans chaque segment) encodée dans le script |
| Prompt Gemini sans `code_values` ni `r1_violations` | Prompt hardcodé dans `visual_review.py` retourne valeurs de code concrètes |
| Gate auto-score implicite | Gate auto-score explicite avec grille tableau avant tout appel |
| Font-Gate : mention sans vérification | Font-Gate : vérification `grep loadFont` bloquante dans le gate pré-vol |
| Breakdown Gemini absent — Claude code à l'intuition | `beat-breakdown.py` — Appel Gemini 1 AVANT le code, JSON "quoi coder" |
| Pipeline manuel, steps oubliables | `beat-session.py` — orchestrateur complet avec stops bloquants |
| Lancement manuel par Claude | Commande `/beat` — déclencheur humain ou autonome |

**Leçons Beat5 intégrées ici :**
- 4 appels Gemini gaspillés = `maxOutputTokens` + mauvais model ID + pas de `responseMimeType`
- Ping ring désaligné = ne jamais poser un `<div>` "autour d'un SVG" — intégrer dans le même SVG
- Tour visible Phase A = forcer `opacity: 0` avant le frame de déclenchement, le spring seul ne suffit pas
- Code sans breakdown Gemini = Claude interprète le storyboard au lieu de l'exécuter

---

## CONTRAINTES DE SÉCURITÉ — AFFICHER EN DÉBUT DE SESSION

**OBLIGATION NON-NÉGOCIABLE : afficher ce bloc AVANT d'écrire une ligne de code.**

```
=== CONTRAINTES DE SÉCURITÉ SILICON SAVANNAH ===
R1        : max 8s sans changement visuel (glow/float ne comptent PAS)
+30%      : frames review à segment_start + 30% durée — JAMAIS à t=0
No-Black  : jamais #000000 — minimum #0d1420 partout
SVG-Gate  : illustration/icône reconnaissable → Gemini image OBLIGATOIRE
Font-Gate : loadFont() @remotion/google-fonts — vérifier avec grep avant de coder
SVG-Align : ping ring / cercle superposé → intégrer dans le MÊME SVG, jamais <div> externe
Opacity   : masquer explicitement (opacity: 0) avant frame déclenchement — ne pas compter sur le spring seul
Tailwind  : OBLIGATOIRE — lire tailwind.config.ts AVANT d'écrire une ligne
            Tokens : text-gold / text-ivory / bg-navy / text-stat-lg / font-bebas
            ZÉRO styles inline pour couleurs, typo, spacing
            Exception : valeurs SVG natives (fill, stroke, cx, cy) restent inline
Lucide    : lucide-react INSTALLÉ — utiliser AVANT de générer via Gemini
            Landmark=état, Radio/Tower=télécom, Building=entreprise, Globe=monde
================================================
```

---

## PRINCIPE FONDAMENTAL

**Isolation Atomique par Beat.** Une session = un beat = un dossier `beat[X]/`.
Jamais de session multi-beat. Jamais de modification de fichiers hors du dossier `beat[X]/` et `Beat[X].tsx`.

---

## PIPELINE PAR BEAT — SCRIPTS OFFICIELS

### DÉCLENCHEMENT

```bash
# Manuel (Aziz lance) ou autonome (Claude lance dans /goal) :
/beat [X]
# équivalent à :
python3 scripts/beat-session.py --beat [X] --phase breakdown
```

---

### PHASE 1 — Storyboard PNG (prérequis avant breakdown)

Si le storyboard PNG n'existe pas encore :
1. Générer via Gemini image (`gemini-2.0-flash-preview-image-generation`) — panels par segment
2. Sauvegarder dans `public/souverain/silicon-savannah/beat[X]/storyboard-gemini.png`
3. ntfy → STOP → attendre validation Aziz
4. Aziz valide → lancer `/beat [X]`

---

### PHASE 2 — Gate + Breakdown (`beat-session.py --phase breakdown`)

Le script vérifie dans l'ordre — **stop bloquant à chaque manque** :

1. `manifest.ts` présent et valide (SEG + DURATION_FRAMES)
2. `storyboard-gemini.png` présent
3. `narration.mp3` présent
4. `bg.png` présent (ou `bg-beat[X].png` à la racine)
5. Font-Gate : `loadFont()` présent si `fontFamily` utilisé
6. No-Black : aucun `#000000`

Si tout passe → **Appel Gemini 1** via `beat-breakdown.py` :
- Input : storyboard PNG + narration
- Output : `/tmp/beat[X]-breakdown.json` (segments, components, code_values, assets_needed)
- ntfy + **STOP** → Claude lit le JSON → code

**Tableau de Décision Assets (intégré dans le breakdown JSON) :**

| Asset | Catégorie | Décision |
|-------|-----------|----------|
| bg.png | texture/dégradé | SVG CSS ou Gemini-image |
| seg_X.png — téléphone, bâtiment | Illustration reconnaissable | **Gemini-image OBLIGATOIRE** |
| seg_X.png — cercle, barre, ligne | Forme géométrique pure | SVG React OK |

---

### PHASE 3 — Code

Claude code à partir de `/tmp/beat[X]-breakdown.json` uniquement.
**Le JSON Gemini est le contrat. Claude l'exécute, ne l'interprète pas.**

**Règles code :**
- Timings depuis `beat[X]/manifest.ts` uniquement
- `loadFont()` via `@remotion/google-fonts` — fontFamily inline interdit
- Jamais `#000000` — minimum `#0d1420`
- Éléments superposés (ping ring, cercle animé) → intégrer dans le MÊME SVG
- Masquer explicitement avec `opacity: 0` avant le frame de déclenchement
- Render → `out/episodes/silicon-savannah/wip/beat[X]_v1.mp4`

---

### PHASE 4 — Review (`beat-session.py --phase review --video ...`)

```bash
python3 scripts/beat-session.py --beat [X] --phase review \
  --video out/episodes/silicon-savannah/wip/beat[X]_v1.mp4
```

Le script lance `visual_review.py` (**Appel Gemini 2**) puis :

- `score >= 8.0` → affiche corrections JSON (`code_values`) → Claude applique → re-render → ntfy + **STOP** "valide avant promotion"
- `score < 8.0` → ntfy BLOCKED + **STOP** — Aziz intervient

**Max 2 appels Gemini total par beat (breakdown + review). Jamais plus.**

---

### PHASE 5 — Promotion FINAL (après validation Aziz)

```bash
# Promouvoir
cp out/episodes/silicon-savannah/wip/beat[X]_vN.mp4 \
   out/episodes/silicon-savannah/beat[X]-FINAL.mp4

# Upload litterbox 72h
URL=$(curl -s -F "reqtype=fileupload" -F "time=72h" \
  -F "fileToUpload=@out/episodes/silicon-savannah/beat[X]-FINAL.mp4" \
  "https://litterbox.catbox.moe/resources/internals/api.php")

# Notif Aziz
./scripts/ntfy-notify.sh beat_done beat[X] "${URL}" "Score X/10 APPROVED"

# Purger wip
rm out/episodes/silicon-savannah/wip/beat[X]_*.mp4
```

---

## RÈGLES NON-NEGOTIABLES

1. **Scope unique** : toucher uniquement `beat[X]/` et `Beat[X].tsx`
2. **Storyboard = loi** : le JSON breakdown est le contrat. Claude l'exécute, ne l'interprète pas.
3. **Scripts officiels uniquement** : `beat-session.py` → `beat-breakdown.py` → `visual_review.py`. Jamais de script ad hoc.
4. **2 appels Gemini max par beat** : breakdown (avant code) + review (après render). Jamais plus.
5. **+30% rule** : frames review à `segment_start + 30% durée` — `--offset 0.3` hardcodé dans `visual_review.py`
6. **Score gate** : score < 8.0 → Claude ne corrige pas seul → ntfy BLOCKED + STOP
7. **Borne 3 renders** : si score < 8.0 après 3 versions → STOP + ntfy blocked
8. **Zéro noir pur** : minimum `#0d1420` partout
9. **SVG-Gate** : illustration reconnaissable → Gemini image dès le premier essai
10. **Commande `/beat`** : seul point d'entrée — ne jamais lancer les scripts individuellement sans passer par beat-session.py

---

## ERREURS FRÉQUENTES (observées Beat5 — 2026-05-15)

| Erreur | Cause | Fix |
|--------|-------|-----|
| 4 appels Gemini pour 1 review | `maxOutputTokens` trop bas + mauvais model ID | Utiliser `visual_review.py --model gemini` — tout est hardcodé |
| Ping ring décalé vs cercle | `<div>` externe non aligné sur le SVG | Intégrer dans le MÊME SVG — même `cx/cy` garanti |
| Tour visible en Phase A | Spring démarre à 0 mais pas exactement 0 | Forcer `opacity: 0` avant le frame de déclenchement explicitement |
| Font fallback système (pas Bebas Neue) | `fontFamily` inline sans `loadFont()` | `import { loadFont } from '@remotion/google-fonts/BebasNeue'` |
| Frames à t=0 envoyées à Gemini | Springs à 0 → opacity ~0 → Gemini ne voit rien | `--offset 0.3` dans `visual_review.py` |

---

## ÉTAT DES BEATS (mis à jour 2026-05-15)

| Beat | Status | Fichier FINAL |
|------|--------|---------------|
| Beat 1 | FINAL ✅ | beat1-FINAL.mp4 |
| Beat 2 | FINAL ✅ | beat2-FINAL.mp4 |
| Beat 3 | FINAL ✅ | beat3-FINAL.mp4 |
| Beat 4 | FINAL ✅ | beat4-FINAL.mp4 |
| Beat 5 | FINAL ✅ | beat5-FINAL.mp4 |
| Beat 6 | À faire | — |
| Beat 7 | À faire | — |
