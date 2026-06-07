# DA-BRIEF-GATE — Review créative AMONT (Kimi + Gemini) avant de coder un acte/beat

> Créé 2026-06-07 (session War-Map Sahel). Validé Aziz.
> **NON-NEGOTIABLE pour tout acte/beat substantiel — TOUS projets (Souverain, Atlas, War-Map).**

---

## Le principe (pourquoi ça existe)

On utilisait Kimi K2.5 + Gemini 3.1 Pro **en aval** (réparer un rendu raté). Erreur.
Leur vraie valeur est **en amont** : directeurs artistiques contraints qui bonifient une
vision DÉJÀ décidée, AVANT d'écrire une ligne de code. Résultat : premium dès le 1er jet,
zéro aller-retour coûteux.

**La règle d'or :** Notre vision est le SOCLE, pas le point de départ effacé. Les modèles
**bonifient**, ils ne réinventent pas. Claude **synthétise et vérifie**, Aziz **tranche le goût**.

---

## QUAND le déclencher

Juste **APRÈS** "vision validée + assets décidés" et **AVANT** "code".
- ✅ Tout acte d'un Short/Mid-form/War-Map (chaque acte = 1 gate)
- ✅ Tout beat Souverain (Mapbox ou Remotion) ou Atlas substantiel
- ❌ PAS pour : fix 1 ligne, 1 slide triviale, ajustement mineur (anti-friction)

Le gate s'insère dans les pipelines existants :
- **Beat Souverain Remotion** (`/beat`) : entre phase 1 (breakdown) et phase 2 (code)
- **Beat Mapbox** (`mapbox-session.py`) : entre phase 1 (storyboard validé) et phase 2 (code)
- **War-Map / Atlas** : entre "script+timing validés pour l'acte" et "code de l'acte"

---

## STRUCTURE du brief (ce qui fait 80% du résultat)

Le brief envoyé aux DEUX modèles contient, dans cet ordre :

1. **RÔLE** : "Tu es directeur artistique de [projet]. Bonifie une direction DÉJÀ validée, ne la réinvente pas."
2. **SUJET** + format (16:9 / 9:16) + cible.
3. **IDENTITÉ VISUELLE — socle non-négociable** : palette exacte (hex), ton, direction déjà choisie. "NE PAS proposer autre chose."
4. **BOÎTE À OUTILS EXACTE** : la liste de ce qu'on SAIT coder (frame-driven Remotion/Mapbox, SVG, opacité, map.project, drift, flèches qui poussent, vignette, grain, FlagFill, etc.).
5. **INTERDIT** : `filter:blur` CSS, particules 3D, depth-of-field, vraie 3D, volumetric, lens flare, tout AE non reproductible. "NE RIEN proposer de tel."
6. **LIBERTÉ CRÉATIVE CADRÉE** (clé) : "Tu PEUX suggérer des effets non encore codés ET piocher dans le CATALOGUE joint, À CONDITION que ce soit faisable dans la boîte à outils. Indique le STATUT : 'déjà faisable' ou 'à coder mais faisable'."
7. **MATÉRIAU RÉEL** : script de l'acte (phrase par phrase) + timing exact (frames).
8. **CATALOGUE d'inspiration** (compact, texte) : si dispo (ex. Map Animation 89 templates → `/tmp/mapanim_compact.txt`). Pour piocher des effets nouveaux faisables.
9. **2 FRAMES** (downscalées ! voir règle perf) : point de départ actuel + notre plafond premium réel (une de nos meilleures vidéos). "Cale ton 'premium' sur du concret." Préciser si ratio différent (ex. ref 9:16, cible 16:9).
10. **SORTIE STRUCTURÉE imposée** (pas de prose) :
    - PARTIE A : tableau `moment → template (existant ou #id catalogue) → enrichissement → SFX → statut → priorité`
    - PARTIE B : section "[MOMENT FORT] : mettez le paquet" (ex. hook 0-30s)
    - PARTIE C : 3 idées bonus faisables qui élèvent toute la série

---

## RÈGLES D'EXÉCUTION (NON-NEGOTIABLE)

1. **Downscale les frames AVANT envoi** : `ffmpeg -vf scale=1280:-1 -q:v 4` → JPEG ~0.3 Mo.
   Un PNG full-res (1.4 Mo → 1.9 Mo base64) ralentit ENORMÉMENT l'appel (vu 2026-06-07).
   Vaut pour TOUT appel modèle+image, pas que la review vidéo.
2. **Les deux modèles en PARALLÈLE, séparément** (threads). Modèles verrouillés :
   `gemini-3.1-pro-preview` + `moonshotai/kimi-k2.5` (via OpenRouter).
3. **Claude SYNTHÉTISE et VÉRIFIE** chaque proposition contre le code réel AVANT de présenter.
   Distinguer "ce qui CONVERGE" (haute confiance) / "idées uniques bonnes" / "écarté (hallucination/infaisable)".
   Gemini/Kimi = SIGNAL, JAMAIS JUGE (cf. règle Gemini CLAUDE.md). Vérifier, ne pas gober.
4. **Aziz tranche le GOÛT** (regrouper les questions de goût en 1 point de contrôle, le reste = technique tranché par Claude).
5. **MAX 1 appel par modèle par acte.** Pas de boucle brief→fix→brief. On synthétise, on code.
6. **Si un modèle échoue** (quota, API) : ne pas bloquer. 1 modèle solide suffit pour avancer ;
   on croisera le 2e plus tard si pertinent.

---

## L'OUTIL

`scripts/tools/da-brief.py` (générique, paramétrable par projet/acte).
Prototype d'origine : `scripts/warmap/da-brief-acte1.py` (War-Map Sahel Acte 1).
Sorties : `/tmp/da-refs/da-<label>-gemini.md` + `da-<label>-kimi.md`.

---

## Preuve de valeur (1er usage 2026-06-07, War-Map Sahel Acte 1)

Convergence forte des deux modèles sur : atmosphère continue (grain+vignette qui respire),
allumage "trace→infuse→label" (pas de pop), glow sans blur (stroke épais opacité basse),
CEDEAO "néon qui grille", convergence Liptako comète + ripple, freeze VIVANT (heartbeat),
ink-bleed pour zones de groupes armés. Idées uniques retenues : ombre portée faux-3D (Gemini),
cartouches tiroirs latéraux 16:9 (Kimi). Zéro hallucination AE/3D des deux côtés (brief bien cadré).
