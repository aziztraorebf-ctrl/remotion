# DA-BRIEF-GATE — Review créative AMONT (Gemini + Kimi + DeepSeek 3e voix) avant de coder un acte/beat

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
   ⭐ **TOUJOURS inclure (Aziz 2026-06-14, tous projets) la 3e voie — dessiner ET animer NOUS-MÊMES** : (a) **icônes
   Lucide** (`lucide-react` installé, ~1500 icônes vectorielles nettes, posables/animables size/color/spring/cascade —
   ex. MapPin, User), (b) **formes géométriques simples SVG dessinées maison** (cercle/rect/path/polygone composés :
   marqueur-lieu, cartouche, jauge, pastille), (c) **animations maison frame-driven** (countup, cascade, ondulation,
   ondes, tracé stroke-dashoffset, pulsation). Souvent SUPÉRIEUR à un asset généré (net full HD, gratuit, charte exacte,
   zéro détourage). Détail : `WARMAP-ANIMER-OBJETS.md`. Cette voie DOIT figurer dans la boîte à outils envoyée aux
   modèles (déjà injectée dans `da-brief.py`) ET être dans MON champ d'options quand je construis un plan/une scène.
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
3. **Claude fait une SYNTHÈSE EXTRACTIVE TRACÉE** (voir section dédiée ci-dessous) — JAMAIS une synthèse molle
   type "3/3 valident, voici les points". OBLIGATOIRE à chaque appel. Gemini/Kimi = SIGNAL, JAMAIS JUGE. Vérifier, ne pas gober.
4. **Aziz tranche le GOÛT** (regrouper les questions de goût en 1 point de contrôle, le reste = technique tranché par Claude).
5. **MAX 1 appel par modèle par acte.** Pas de boucle brief→fix→brief. On synthétise, on code.
6. **Si un modèle échoue** (quota, API) : ne pas bloquer. 1 modèle solide suffit pour avancer ;
   on croisera le 2e plus tard si pertinent.

---

## ⭐⭐ SYNTHÈSE EXTRACTIVE TRACÉE — OBLIGATOIRE à CHAQUE appel modèle (Aziz 2026-06-14, NON-NEGOTIABLE)

> "Parfois on n'utilise pas à fond ce que disent les modèles. Ce type de synthèse devrait être fait
> AUTOMATIQUEMENT à chaque fois. Extrais le maximum, intègre-le au plan, AVANT de coder." — Aziz.
> Vaut pour TOUT appel : upstream, downstream, OU idées indépendantes. On paie ces modèles → on extrait tout.

**LE PROBLÈME à éviter** : la synthèse molle ("convergence forte, voici 3 points retenus") laisse filer 70% de
la matière. Les modèles nous MONTRENT LA VOIE — chaque idée exploitable doit être capturée, pas survolée.

**LA MÉTHODE (à appliquer systématiquement) :**
1. **RELIRE INTÉGRALEMENT** chaque sortie (pas juste le résumé/la conclusion du modèle). Les pépites sont souvent
   dans les sections "enrichissements", "expert", "pièges" — pas dans le TL;DR.
2. **EXTRAIRE TOUTE idée exploitable**, organisée PAR CHANTIER / PAR PHRASE / PAR CHapitre (la maille du travail).
3. **ATTRIBUER LA SOURCE** de chaque idée : `G` (Gemini), `K` (Kimi), `D` (DeepSeek), `G+K` (convergent).
   La convergence = signal de haute confiance ; une idée unique forte = à ne pas perdre.
4. **TRANCHER chaque idée** avec un marqueur explicite :
   - ✅ **RETENU** (on code ça)
   - 🔶 **NUANCÉ / OPTION** (bon mais conditionnel — surcharge possible, à activer si la scène respire) + la condition
   - ❌ **ÉCARTÉ** + LA RAISON (hallucination · infaisable · anti-charte · FACTUELLEMENT FAUX · contredit une décision Aziz)
5. **VÉRIFIER les FAITS** avant de retenir un chiffre/nom (un % "production mondiale" cité par un modèle peut être
   daté/faux → fact-check WebSearch/Sonar AVANT de l'afficher. Cf. P4 : camemberts % uranium écartés car trompeurs).
6. **INTÉGRER la synthèse tracée DANS LE PLAN** (`PLAN-*.md` du projet), comme section de référence pour le code.
   PAS dans un coin de conversation jeté — dans le fichier durable, structuré, relisable au moment de coder.
7. **PRÉSENTER la synthèse à Aziz** quand il y a des arbitrages (goût/coût/factuel), AVANT de coder.

**Le format de référence** = la synthèse P4 downstream dans `memory/episodes/warmap-sahel/PLAN-REFONTE-P4.md`
(section "SYNTHÈSE TRACÉE DES 2 DOWNSTREAM") : par chantier, chaque idée avec source + décision + raison. À copier.

**Règle d'or** : après cette synthèse, RIEN d'exploitable d'un modèle ne doit avoir disparu sans une décision
explicite (retenu / option / écarté+raison). Si une idée n'est ni dans le code ni écartée avec raison = trou à combler.

### ⭐⭐ VÉRIFIER CHAQUE SOLUTION CONTRE NOS CONTRAINTES RÉELLES (Aziz 2026-06-14, NON-NEGOTIABLE)

> Les modèles diagnostiquent bien le PROBLÈME mais proposent parfois une SOLUTION qui ne marche pas dans NOTRE
> contexte précis (qu'ils ne connaissent pas). Distinguer le diagnostic (souvent juste) de la solution (à valider).

**La règle** : avant d'appliquer une solution recommandée par un modèle, la confronter à :
1. **Nos contraintes techniques réelles** (ce que notre stack fait/ne fait pas).
2. **Nos décisions/leçons DÉJÀ documentées** (chercher dans le code + la mémoire si on a déjà tranché ce point).
3. **Un TEST empirique court** quand c'est testable (1-2 frames, A/B) AVANT une grosse refonte — instrumenter, pas présumer.

**Cas d'école (P4 Chantier 4, 2026-06-14)** : Gemini+Kimi recommandaient à l'unanimité un PITCH 40° pour donner de la
profondeur et faire "fuir le désert vers l'horizon". MAIS : (a) le code documentait déjà une leçon du 13 juin = pitch
rejeté car notre carte est un APLAT DE COULEUR sans relief Mapbox ; (b) test A/B (pitch 0 vs 40, 1 frame) → frames
QUASI IDENTIQUES (preuve `wip/p4-pitch-test-{0,40}`). Les modèles le recommandaient sans connaître cette contrainte.
→ Pitch ÉCARTÉ avec preuve. Les 2 AUTRES fixes du même brief (caméra qui pane + hiérarchie échelle/opacité) = valides
et retenus. **Le diagnostic était juste (carte plate+statique+pas de hiérarchie), une des 3 solutions ne l'était pas.**

**Ce que ça évite** : appliquer une fausse piste recommandée par 2 modèles convergents (la convergence n'est PAS une
preuve — ils partagent les mêmes angles morts sur notre contexte). Le test de 30 secondes tranche ce que la prose ne
peut pas. JAMAIS gober une solution parce qu'elle "fait consensus" — vérifier contre le réel, tester si testable.

---

### ⭐⭐ COMMENT POSER LA QUESTION : RÉFÉRENCES DE CHAÎNES + CONTRAINTE TECHNIQUE (Aziz 2026-06-21, NON-NEGOTIABLE)

> REMPLACE l'ancienne question généraliste ("qu'est-ce que tu changerais / améliorerais ?") qui donnait du vague
> et causait des renders d'essai à répétition. Prouvé sur Sénégal Scène 1 (animer une image fixe premium) : ~50%
> de tâtonnements en moins, on a codé du 1er coup grâce à une convergence 3 modèles claire.

Quand on cherche COMMENT animer/résoudre un plan (pas un diagnostic d'écart sur un rendu fini), la question DOIT contenir :
1. **CONTEXTE** précis du plan (format, médium, ce que dit la voix off à ce moment).
2. **CONTRAINTE TECHNIQUE EXPLICITE** — ce que notre stack PEUT et NE PEUT PAS faire ("c'est une image plate dans
   Remotion, je ne peux pas animer l'intérieur / pas d'After Effects / un SVG plaqué fait sticker, déjà rejeté").
   Sans ça, les modèles proposent des solutions infaisables chez nous.
3. **RÉFÉRENCES DE CHAÎNES/STUDIOS CONCRETS à imiter** — "comme le ferait Finary / Polymatter / Wendover / Ordinary
   Folk". Ancre la réponse dans des solutions ÉPROUVÉES au lieu d'inventer du générique.
4. **DEMANDE ACTIONNABLE** : liste PRIORISÉE de techniques concrètes + "ce que ça fait ressentir" + valeurs chiffrées
   (ex: scale 1.0→1.04 sur 16s, ease-out). Pas de prose, pas de score.

**3 modèles, pas 1** (Gemini + DeepSeek + Kimi, même prompt EXACT) : la convergence VALIDE le filon (techniques citées
par 3/3 = on code sans douter), la divergence signale le risqué (cité par 1/3 = à écarter ou tester). Coût quasi nul.
Puis appliquer la section ci-dessus (vérifier chaque solution contre nos contraintes + test court si testable).

**Exemple prouvé** : "comment Finary/Polymatter animeraient cette pièce gravée FIXE (image plate, pas d'AE) pendant 16s
sur la voix 'multinationales qui pompent et repartent' ?" → 3/3 ont répondu : specular sweep + parallaxe fond + slow
scale + UN seul label (pas 3). Codé du 1er coup, validé Aziz. (Bitmap : sweep+parallaxe ; voie SVG : anim par parties.)

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
   - **`--with-deepseek` / `--no-deepseek` : 3e voix CONCEPTUELLE (DeepSeek V4, `deepseek/deepseek-v4-pro`
     via OpenRouter, ~10-20x moins cher).** AUTO-ON en `--upstream`, OFF en downstream (voir doctrine
     ci-dessous). DeepSeek est **TEXTE ONLY** (pas de vision) → les frames lui sont passées en CAPTIONS
     textuelles (pas l'image). Donc valeur sur le CONCEPTUEL, pas le jugement visuel.
   - Sorties : `/tmp/da-refs/da-<label>-{gemini,kimi,deepseek}.md`.

   ### ⭐ DOCTRINE 3e VOIX DeepSeek V4 (validée 2026-06-09, voir key-learnings)
   **QUAND l'utiliser** : par défaut sur tout brief **UPSTREAM/conception** (narratif, séquencier,
   structure, logique) — la vision compte peu, le coût est quasi nul, il apporte un 3e angle. **OFF par
   défaut en DOWNSTREAM/visuel** (juger un rendu : couleurs, compo, AI-slop) car il est AVEUGLE.
   **SA VRAIE VALEUR** : conceptuel = 80-90% de Gemini/Kimi pour une fraction du prix. A déjà apporté
   des idées neuves (ex: chaîne logistique complète qu'aucun des deux n'avait vue).
   **FORCES** : séquenciers détaillés, logique narrative, structure, incohérences (temporelles, échelles).
   **FAIBLESSES** : (1) aucune vision → ne juge pas le visuel ; (2) sans description fidèle des frames,
   il DÉRIVE/confabule (a inventé une narration différente une fois) → TOUJOURS soigner les captions ;
   (3) détails géo/factuels à vérifier. **Règle** : DeepSeek = 3e angle conceptuel, jamais juge du visuel ;
   Gemini/Kimi restent indispensables pour l'œil (jusqu'au multimodal DeepSeek).

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

**3. `scripts/tools/kimi-video-compare.py`** — équivalent Kimi K2.5 de `da-compare.py`. API Moonshot
   NATIVE directe (pas OpenRouter — testé 2026-07-18, OpenRouter renvoie `404 no endpoints support
   video` sur Kimi K2.5 et K3). Vidéo envoyée en BASE64 (`data:video/mp4;base64,...`) — un lien HTTP
   public (catbox/uguu) est REFUSÉ par l'API (`400 unsupported video url`), seul le base64 ou un
   fichier pré-uploadé `ms://file_id` marche. Downscaler les 2 vidéos AVANT appel (720p CRF~28) — le
   base64 gonfle la taille de ~33%. ⚠️ `temperature` DOIT être `1` (seule valeur acceptée par ce
   modèle, erreur 400 sinon). Détail : `memory/tools/kimi-video-native-base64.md`.

Prototypes d'origine : `scripts/warmap/da-brief-acte1.py` + briefs `review-acte1-aislop.txt` /
`compare-sudan-sahel.txt` (War-Map Sahel).

---

## ⭐⭐ PATTERN 2 APPELS SÉQUENTIELS — comparatif PUIS génératif (validé 2026-07-18, Soudan Acte 5)

Le downstream n'est pas UN appel — c'est potentiellement DEUX temps distincts, complémentaires :

1. **Appel comparatif** (`da-compare.py` + `kimi-video-compare.py`, même paire ref/nouveau, en
   PARALLÈLE) : "qu'est-ce qui cloche vs notre référence-or ?" → diagnostic.
2. **Appel génératif/prospectif** (brief dédié, PAS un jugement qualité) : "comment on corrige,
   concrètement, avec notre arsenal ?" → brainstorm actionnable, brief-type dans
   `scripts/warmap/templates/warmap-densification-brief.txt` (généraliste, pas lié à un acte précis —
   dupliquer/adapter si un autre axe que la densité doit être creusé).

**Après le 1er appel (comparatif), TOUJOURS proposer le 2e à Aziz** plutôt que de s'arrêter au
diagnostic seul — c'est le 2e temps qui a produit la vraie valeur actionnable (15+ techniques
concrètes classées par couche, cf `WARMAP-DENSIFICATION-CARTE.md`). Les deux appels utilisent
Gemini ET Kimi en parallèle à chaque fois (2 signaux indépendants par temps, 4 réponses au total) —
la convergence entre les deux modèles, à chaque temps, est ce qui distingue un vrai signal d'un
artefact de prompt.

**Preuve de valeur (2026-07-18)** : le 1er appel (comparatif) a révélé que le vrai problème n°1 de
l'Acte 5 n'était PAS ce qu'on pensait avoir corrigé (cadrage caméra) mais l'absence de conséquence
territoriale du mouvement. Le 2e appel (génératif) a produit une doctrine réutilisable
(`WARMAP-DENSIFICATION-CARTE.md`) qui remet en question un réflexe du projet (épurer par défaut) —
un axe qu'aucun agent Claude interne n'avait soulevé en amont dans la même session, malgré 4 agents
dédiés à la mise en scène de ce même acte.

---

## Preuve de valeur (1er usage 2026-06-07, War-Map Sahel Acte 1)

Convergence forte des deux modèles sur : atmosphère continue (grain+vignette qui respire),
allumage "trace→infuse→label" (pas de pop), glow sans blur (stroke épais opacité basse),
CEDEAO "néon qui grille", convergence Liptako comète + ripple, freeze VIVANT (heartbeat),
ink-bleed pour zones de groupes armés. Idées uniques retenues : ombre portée faux-3D (Gemini),
cartouches tiroirs latéraux 16:9 (Kimi). Zéro hallucination AE/3D des deux côtés (brief bien cadré).

---

## Nouveau cas d'usage validé (2026-06-10) — DA upstream sur le SCRIPT ENTIER

**Leçon War-Map Sahel** : un symptôme LOCAL (un segment "B1" confus au montage) peut révéler un problème
GLOBAL de structure. AVANT de patcher le segment, lancer un DA upstream sur le SCRIPT COMPLET
(`--upstream --expert`, 3 voix) avec pour critère central le **show-don't-tell** : "pour chaque idée,
peut-on la MONTRER avant de la dire ? sinon elle est mal placée / du tell pur / de trop".
- Les 3 modèles ont convergé : surcharge non isolée à B1, Acte 2 ET Acte 4 saturés, chronologie à linéariser.
- Cadrage clé (évite le piège) : déclarer FIGÉ = esthétique + assets déjà payés ; OUVERT = script, découpage,
  ordre, coupes. "Ne ménage pas le texte : si un passage passe mal en visuel, dis-le et réécris."
- Résultat : refonte structurelle (chronologie linéaire) qui a AUSSI réglé un bug technique (timeline qui
  reculait) — preuve qu'un bon découpage narratif résout des problèmes de prod en amont.
