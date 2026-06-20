# CHANTIER — Peaufiner les graphismes (session dédiée)

> Né de la session système 2026-06-20 (registre → orchestration → cobayes A→Z). Le système agentique TOURNE de
> bout en bout (storyboard image → checkpoint → breakdown → code → render → boucle review). Mais les cobayes
> Maroc ont montré que le RÉSULTAT VISUEL est « correct mais pas assez punchy/premium ». But de cette session :
> rendre les graphismes premium, en partant des cobayes existants comme base de travail.

## POINT DE DÉPART = les cobayes déjà créés (NE PAS PURGER)
- `src/projects/_rnd/cobaye-maroc-phosphate/` (2 beats : carte phosphate + data-viz 70%). Renders :
  carte https://files.catbox.moe/demuzz.mp4 · data-viz https://files.catbox.moe/plhrgr.mp4
- Storyboards de réf : carte https://files.catbox.moe/jq1eav.png · data-viz https://files.catbox.moe/z43ow2.png
- (Si encore présents : autres protos `_rnd/` et `_proto-16-9/` = matière à peaufiner aussi.)
- Aziz : « gardons les démos, ne les supprimons pas — base de travail temporaire pour cette session. »

## ✅ 2 DETTES SYSTÈME COMBLÉES (2026-06-20, branche `feat/dettes-systeme-preambule-gate`)
> Décision Aziz « combler les 2 dettes maintenant ». Fait + testé (sans appel API) :
> - **TROU 3 (préambule premium DATA-VIZ)** ✅ : doctrine `memory/doctrines/STORYBOARD-DATAVIZ.md` créée (pendant de
>   STORYBOARD-MAPBOX) + branchée dans `gemini-storyboard-panels.py` (`STYLE_BLOCK` → préambule riche : chaînes
>   Bloomberg/Vox/Kurzgesagt/Polymatter/FT citées + ce qu'on leur vole + matière Hera + directive « va plus loin »).
> - **TROU 1 (ratio vertical→horizontal)** ✅ : `gemini-storyboard-panels.py --ratio` (défaut **16:9 horizontal**, le
>   storyboard se génère au ratio du render → plus de carrés vides). Corrige AUSSI la cause-2 du gate.
> - **GATE REVIEW bruité** ✅ : `visual_review.py` fiabilisé — découpe planche en panneaux + appariement
>   panneau_i↔frame_i (`--state-boundaries`) + scale non-déformant + ratio dit au prompt. Mode d'emploi :
>   `REVIEW-TOOLS-INDEX.md` § DIAGNOSTIC.
> - **TROU 2 (breakdown asset imprécis)** ⏳ AMORCÉ : doctrine `STORYBOARD-DATAVIZ.md` § « champ asset précis » pose
>   la règle (icône Lucide / composant / asset Gemini EXACT, pas « satellite icon »). RESTE = l'inscrire dans le
>   format breakdown de `beat-session.py` + l'éprouver.
> ⏳ **À ÉPROUVER** : régénérer le storyboard data-viz cobaye Maroc 70% avec `--ratio 16:9` + nouveau préambule →
>   comparer au render plat. C'est la validation terrain des 2 dettes.

## LES 3 TROUS À CORRIGER (cause racine du « pas assez premium ») — diagnostiqués par Aziz sur le rendu réel

### TROU 1 — Storyboard généré en RATIO VERTICAL, render en HORIZONTAL 16:9
Le storyboard multi-panneaux sort des panneaux PORTRAIT (verticaux). Le modèle compose chaque panneau pour un
cadre vertical. En 16:9, ça laisse **des grands espaces vides à gauche/droite** → composition plate, « beaucoup
de carrés vides » (observation Aziz sur le 70% horizontal). Personne ne fait la conversion vertical→horizontal.
→ **À corriger** : générer le storyboard au RATIO CIBLE (16:9 si la vidéo est horizontale) OU instruire le code à
RECOMPOSER pour occuper l'espace horizontal (ne pas copier la disposition verticale du panneau). La référence
« remplir l'espace » = chaînes premium (voir trou 3).

### TROU 2 — Le BREAKDOWN n'est pas assez précis sur les ASSETS visuels
Le breakdown dit « satellite icon » de façon générique → l'agent met une icône satellite LITTÉRALE (engins
spatiaux), différente du storyboard. Le set d'icônes / la fonte divergent du storyboard alors que le breakdown
est censé dire « exactement quoi utiliser » (observation Aziz : « l'icône phosphate n'est pas pareille »).
→ **À corriger** : le breakdown doit spécifier l'asset PRÉCIS (quelle icône Lucide / quel composant / quelle
fonte exacte), pas une description vague. Champ asset explicite dans le format breakdown.

### TROU 3 ⭐ — Pas de PRÉAMBULE « chaînes premium » pour le storyboard DATA-VIZ (le plus important)
`STORYBOARD-MAPBOX.md` a un préambule riche (joindre notre carte + citer King&Generals/Vox/Bloomberg par nom +
ARSENAL + directive carte vivante). **Le data-viz Remotion N'A PAS l'équivalent** : `SOUVERAIN-REMOTION-PLAYBOOK`
mentionne Bloomberg/Vox comme « principes » mais ne les passe PAS au modèle au moment de générer le storyboard.
→ Le modèle n'a AUCUNE cible de qualité premium à viser → storyboard « correct mais plat » (cause directe du
manque de punch). On a déjà la matière : `memory/projects/decode-hera-templates.md` (réf data-viz premium décodée,
= ce qu'Aziz appelle « Finari/Hera ») + protos `ProtoHera_*` / `HeraFidele_*` dans `_proto-16-9/`.
→ **À corriger** : créer un préambule storyboard DATA-VIZ (pendant de STORYBOARD-MAPBOX) : citer les chaînes
data-viz premium par nom + joindre les réfs Hera décodées + « vise CE niveau, remplis l'espace, ose le punch ».

## AUSSI À FAIRE (issu de la même session)
- **Gate review** : `phase_match_avg` est faux-bas sur un bon render. Diagnostic + fix précis dans
  `scripts/tools/REVIEW-TOOLS-INDEX.md` (section 🔬 DIAGNOSTIC). À implémenter : découper la planche storyboard +
  comparer panneau_i↔frame état_i + extraire frames aux frontières d'états + dire le ratio cible. Tant que non fait,
  le juge = self-review, Gemini = signal.

## CE QUI EST DÉJÀ ACQUIS (ne pas refaire — le système TOURNE)
Registre intention→forme enrichi · format breakdown Mapbox+Remotion · storyboard image obligatoire + checkpoint
chef→Aziz · boucle review (self-review + Gemini ≤2 appels) · 3 vérifs amont (chiffre sourcé, durée audio,
cohérence intention↔audio) · palette fonds (parchemin défaut) · forme_verifiee anti-fantôme. Voir `SYSTEME-AGENTIQUE.md`.
