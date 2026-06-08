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

## DEUX MOMENTS D'USAGE (idée Aziz 2026-06-07)

Les 3 piliers (AI-slop, expert, comparatif) servent à DEUX moments — la vraie puissance
est de les utiliser AUSSI en préventif, pas seulement en correctif :

1. **AMONT / PRÉVENTIF (`--upstream`)** — sur le PLAN, AVANT d'écrire une ligne de code.
   Une fois le script verrouillé + templates choisis + assets décidés. On envoie le PLAN
   (pas un rendu) à Gemini+Kimi :
   - AI-slop prospectif : "qu'est-ce qui RISQUE de faire amateur une fois codé → la parade".
   - Expert-CONSTRUCTEUR : "2e avis sur nos templates + (si tu connais Map Animation) lesquels
     autrement · si tu construisais ça de zéro, dans quel ordre · comment enchaîner pour qu'un
     spectateur comprenne tout sans surcharge". `--upstream` active `--expert` par défaut.
   - But : PRÉVENIR l'AI-slop dès la conception, premium dès le 1er jet, zéro aller-retour.

2. **AVAL / CORRECTIF (mode normal)** — sur un RENDU (frames downscalées ou vidéo).
   AI-slop + expert jugent ce qui EST rendu ; comparatif (`da-compare.py`) isole la vraie cause
   vs une référence validée. But : diagnostiquer ce qui ne marche pas.

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

## ⭐ SOCLE D'ANGLES OBLIGATOIRES (garantit "le même résultat partout" — créé 2026-06-07)

Notre succès repose sur 5 ANGLES posés à CHAQUE review. Ils sont maintenant FIGÉS dans un socle
unique (`ANGLES_BLOCK` dans da-brief.py), injecté par défaut dans TOUT mode (brief ET compare) et
TOUT pilier. Le pilier ne change QUE le contexte technique (stack, axes), JAMAIS ces angles :
1. **SPECTATEUR LAMBDA** — que comprend qqn qui ne connaît pas le sujet ? Où décroche-t-il ?
2. **NARRATION / SYNCHRO** — ce qui apparaît à l'écran suit-il la voix ? (1 beat visuel/idée, pas redondant)
3. **TRANSITIONS vs ÉTATS** — vraies transitions animées ou "diapos" figées ? cuts secs / temps morts ?
4. **AI-SLOP** — qu'est-ce qui crie généré par IA / amateur ?
5. **EXPERT DU MÉTIER** — qu'est-ce qu'un pro jugerait raté / ferait autrement ?

> Pourquoi : avant, les angles étaient éparpillés selon le flag/mode (la narration n'était garantie
> NULLE PART, da-compare était hardcodé Mapbox). Une instance hors-Sahel devait improviser → résultats
> variables. Le socle figé corrige ça. `--no-angles` existe mais DÉCONSEILLÉ.

## LES OUTILS

**1. `scripts/tools/da-brief.py`** — review créative AMONT (Gemini + Kimi, frames). Générique.
   - Socle ANGLES_BLOCK injecté par défaut (les 5 angles ci-dessus). `--no-angles` pour désactiver.
   - `--aislop` (ON PAR DÉFAUT) : injecte le bloc AI-SLOP — "qu'est-ce qui crie généré par IA /
     amateur ?". Test le plus révélateur sans concession (idée Aziz 2026-06-07). `--no-aislop` pour désactiver.
   - `--expert` : injecte le bloc POINT DE VUE EXPERT — fait jouer aux modèles un expert du métier
     (que regarderait-il ? que jugerait-il raté ? + le point de vue spectateur). CONTRAINT à notre
     stack (pas de "il faudrait de la 3D"). Idée Aziz 2026-06-07. À activer pour les reviews approfondies.
   - `--upstream` : mode PRÉVENTIF — bascule AI-slop + expert en PROSPECTIF (juge le PLAN, pas un
     rendu). À utiliser AVANT de coder (script verrouillé + templates + assets décidés) : "comment
     éviter l'AI-slop dès la conception" + "expert-constructeur : 2e avis templates · si tu
     construisais de zéro · comment enchaîner pour la compréhension". Active `--expert` par défaut.
     Le brief passé contient alors le PLAN (script + templates choisis + assets), pas des frames.
   - Sorties : `/tmp/da-refs/da-<label>-{gemini,kimi}.md`.

**2. `scripts/tools/da-compare.py`** — test COMPARATIF (vs référence validée). Gemini SEUL
   (Files API → ingère les VIDÉOS complètes, capte mouvement+rythme, pas juste des frames).
   - `--ref <pilier|chemin.mp4>` : la référence qui MARCHE (étalon). Piliers : `warmap`=Soudan,
     `atlas`=Mansa Moussa (à compléter : `souverain`=beat validé). Table dans le script.
   - **GABARIT FIGÉ + contexte par pilier (fix 2026-06-07)** : la STRUCTURE de question est figée
     universelle (rôle, "même stack donc pas le coupable", classement, corrections, verdict+faux
     coupable). Seul le CONTEXTE technique change selon le pilier (`CONTEXT_BY_PILLAR` :
     warmap=Mapbox/granularité · atlas=d3-geo/sprites-mouvement · souverain=data-viz). Déduit de
     `--ref` (ou forcé par `--pillar`). Plus de question hardcodée Mapbox → mêmes résultats sur tous
     les piliers SANS improviser. `--question` reste l'échappatoire pour un cas 100% spécial.
   - Socle ANGLES_BLOCK injecté par défaut (spectateur/narration/transitions/aislop/expert).
   - Hérite `--aislop`/`--expert` (approfondissements, source unique da-brief.py).
   - ⚠️ Gemini SEUL (Kimi ne lit pas la vidéo). Double œil Kimi-sur-frames en comparatif = backlog
     (à tester avant intégration). Pour le double œil complet, utiliser da-brief (frames) en complément.
   - À lancer aux MOMENTS-CLÉS (doute niveau, validation acte/template), PAS à chaque fix.
   - **Preuve de valeur (2026-06-07)** : a tranché "palette vs cadrage" sur le Sahel → palette =
     FAUX coupable, vrai pb = fragmentation géographique. A évité de refaire la palette pour rien.

Prototypes d'origine : `scripts/warmap/da-brief-acte1.py` + briefs `review-acte1-aislop.txt` /
`compare-sudan-sahel.txt` (War-Map Sahel).

---

## Preuve de valeur (1er usage 2026-06-07, War-Map Sahel Acte 1)

Convergence forte des deux modèles sur : atmosphère continue (grain+vignette qui respire),
allumage "trace→infuse→label" (pas de pop), glow sans blur (stroke épais opacité basse),
CEDEAO "néon qui grille", convergence Liptako comète + ripple, freeze VIVANT (heartbeat),
ink-bleed pour zones de groupes armés. Idées uniques retenues : ombre portée faux-3D (Gemini),
cartouches tiroirs latéraux 16:9 (Kimi). Zéro hallucination AE/3D des deux côtés (brief bien cadré).
