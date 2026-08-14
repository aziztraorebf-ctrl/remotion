# GOTCHAS-TOOLS — visual-producer

> Detail des gotchas outils, extrait de MEMORY.md pour respecter le plafond 200 lignes/25000 octets.
> MEMORY.md garde une ligne de pointeur, le detail complet vit ici.

---

## GOTCHA — text-to-image (sans ref) dérive du style même avec palette décrite en toutes lettres (2026-08-07)

Génération d'un 2e personnage "utilisateur inconnu" (NoteShield P6) en text-to-image pur (prompt
décrivant palette navy `#16213a`, cyan en accent, "flat illustration") sans image de référence
jointe → résultat visuellement proche en couleur MAIS style divergent : contours noirs nets visibles
partout (au lieu de formes qui se touchent sans outline), ombrage/modelé sur le visage (au lieu
d'aplats purs), traits plus "illustratif premium" que le style plat épuré établi. Décrire le style
en mots ne suffit PAS à répliquer une texture de rendu précise — même avec une description détaillée
(épaisseur de trait, absence d'ombrage explicitement demandée).

**Fix qui a marché** : régénérer en image-to-image (`gemini-gen-image-ref.py --refs <chemin>`) avec
l'image canonique existante (ici `sarah-candidat-B-v3-final.jpg`) jointe comme STYLE ANCHOR explicite,
en précisant "use for style/line-weight/palette ONLY, not identity/composition" (cf R-STYLE-ANCHOR-
PALETTE-ONLY dans RULES-ACTIVE.md — s'applique aussi aux personnages secondaires, pas seulement aux
scènes). Résultat v2 : formes plates sans ombrage, traits minimalistes identiques (yeux = 2 points,
nez = triangle cyan), contours quasi absents — match confirmé par Aziz.

**Règle généralisée** : pour tout NOUVEAU personnage dans un projet ayant déjà un style établi,
TOUJOURS partir en image-to-image avec le perso canonique en ref (jamais text-to-image pur, même
avec une description de palette/style détaillée) — le texte décrit l'intention, l'image ancre la
texture de rendu réelle.

---

## ⭐⭐ GOTCHA CONFIRMÉ — MiniMax H3 sur objet mécanique sans articulation visible (2026-08-07 + confirmé 2026-08-08)

**Reformulation confirmée (2e cas validé)** — la règle n'est PAS "H3 ne gère pas les verbes
d'impact", c'est : **H3 a besoin d'une comparaison/référence concrète à un objet mécanique réel
pour improviser une trajectoire physique cohérente, quand le design de l'image de référence ne
montre aucune articulation mécanique visible** (pas de charnière, pas de pivot dessiné).

**1er cas (2026-08-07)** : un prompt d'action nette ("barrier DROPS DOWN sharply, everyone STOPS
ABRUPTLY") a produit un clip quasi-statique, zéro delta sur 21 frames/5.2s. Le clip miroir avec un
verbe de trajectoire orientée ("LIFTS UP", "RUSHES THROUGH") a bien fonctionné.

**2e cas confirmant (2026-08-08, NoteShield P1c)** : même objet (barrière = tube lumineux cyan
continu, sans charnière dessinée). Un prompt "the barrier closes abruptly" a été interprété par H3
comme "la lumière s'éteint" (pas de mouvement mécanique — le modèle reste fidèle au design source,
qui ne montre aucune articulation). En reformulant avec une **comparaison explicite à un objet
mécanique réel** — "the physical cyan bar mechanically and abruptly SLAMS DOWN, swinging down fast
like a real parking-lot barrier arm" — le mouvement mécanique voulu a été obtenu, verdict Aziz
"excellente vidéo". Clip retenu : `public/_client-sim/noteshield/video/p1c-badge-selectif-barre-
mecanique-h3.mp4`.

**Règle actionnable** : pour tout plan impliquant un mouvement mécanique précis (impact, arrêt
brutal, bascule) sur un objet dont le DESIGN ne montre pas d'articulation visible (pas de charnière/
pivot dessiné dans l'image de référence) → **toujours ajouter une comparaison explicite à un objet
mécanique réel et familier** ("like a real parking-lot barrier arm", "like a mechanical lever",
etc.) plutôt qu'un simple verbe d'action ("closes", "drops", "stops"). Le verbe seul laisse H3
libre d'interpréter selon la logique visuelle du design (ex: couper une lumière plutôt qu'inventer
une articulation absente) — la comparaison à un objet réel force la bonne trajectoire physique.

---

## CAS RÉSOLU — NoteShield P6 Berlin, personnage "utilisateur inconnu" (2026-08-07)

Plan H3 initial montrait Sarah elle-même à Berlin → contradiction narrative (script dit "même
compte, appareil inconnu", pas "Sarah se reconnecte ailleurs"). Corrigé : nouveau personnage
généré en image-to-image avec Sarah comme style anchor (voir gotcha ci-dessus) —
`src/projects/_client-sim/noteshield/refs/p6-utilisateur-inconnu-v2.jpg`. Clip H3 validé :
`out/_r-and-d/noteshield-h3-tests/p6-v2-inconnu.mp4` (5.17s, 2544x1456, $1.30 réel), 0 drift
détecté sur 9 frames échantillonnées pleine durée (aucun grossissement de halo cyan, gotcha
déjà rencontré une fois sur ce chantier — pas de récidive ici).

---

## CAS MITIGÉ — Kora & Cartes, Anansi/Nyame V1 registre Whiteboard Doodle (2026-08-13)

Même beat narratif (pacte/négociation) que les tests Poster Vector ci-dessous, même méthode technique
(`submit_workflow` graphe API en dur, node IDs identiques, seed nouveau), mais NOUVEAU registre visuel
testé pour la 1re fois : Whiteboard Doodle (trait marqueur noir + couleur sélective jaune/bleu, style
RSA-Animate/TED-Ed). Image source `anansi-nyame-whiteboard-doodle-v2.png` (déjà validée par Aziz,
non régénérée). Livrable :
`memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/anansi-nyame-whiteboard-doodle-v1-dialogue-8s.mp4`
(prompt_id `f6792a4d-169c-4534-855d-db4d3f595f65`, seed `552037941826`, 864x480, 8.000s pile/192
frames, 0 crédit, job ~5min pending→completed).

Prompt repris quasi à l'identique de la structure V2 Poster Vector réussie (SUBJECT DEFINITIONS /
SUMMARY / RETENTION ANALYSIS / ATTRIBUTE TRANSFER / SEQUENCE 4 tranches de 2s / STRICT NEGATIVE),
avec 2 ajouts spécifiques au registre : clause **COLOR LOCK** stricte (noir/blanc partout SAUF
jaune/doré Nyame et bleu Anansi, répétée dans STRICT NEGATIVE) + idle motion Nyame (léger hochement
de tête + sway du trait de robe, en plus de l'orbite déjà validée).

**Vérification faite (20 frames à 0.4s d'intervalle + forced-alignment ElevenLabs)** :
- ✅ **Couleur sélective STRICTEMENT respectée** sur les 20 frames : aucune couleur parasite,
  aucun élément coloré (orbes/rubans jaunes, col bleu) n'a perdu sa couleur. La clause COLOR LOCK
  fonctionne bien, transférable à d'autres registres "couleur sélective sur fond N&B".
- ✅ **Orbite dorée continue** nette, positions différentes à chaque frame vérifiée.
- ✅ **Pulse d'orbe final** lisible ~7.2-7.6s (orbe près de la main droite de Nyame s'illumine
  nettement, effet localisé, pas de burst).
- ✅ **Dialogue confirmé mot pour mot** par `forced-align.py` (loss global 0.055, fenêtre
  1.16-6.30s, aucun mot parasite après — cohérent avec le V2 Poster Vector, la syntaxe
  `<d>[French]...</d>` + `(S1)` continue de fonctionner sur ce registre aussi).
- ❌ **Geste Anansi quasi invariant sur les 20 frames** — mains DÉJÀ hautes et écartées dès la
  frame 1 (t≈0s), aucun contraste bas→haut visible malgré la même clause "CLEARLY different
  position at each stage" qui avait fonctionné sur le V2 Poster Vector. **Cause probable
  identifiée** : l'image source Whiteboard Doodle montre Anansi DÉJÀ en posture ouverte mains
  levées (contrairement à l'image source Poster Vector qui le montrait mains basses/repliées) —
  la clause de poses contrastées n'a pas d'amplitude de départ à exploiter si l'image source ne
  fournit pas un point de départ bas. **Leçon généralisable** : la technique "poses contrastées
  par tranche" dépend de la pose de DÉPART visible dans l'image de référence, pas seulement du
  texte du prompt — vérifier que l'image source elle-même a une marge de progression avant de
  répéter cette clause telle quelle sur un nouveau registre/image.
- ⚠️ **Idle motion Nyame (hochement/sway robe) non clairement visible** sur l'échantillonnage
  0.4s — possible que le mouvement demandé était trop subtil pour cette granularité
  d'observation, aucune dérive ni morphing détecté en tout cas (pas un échec, non concluant).

**Piste à tester si repris** : régénérer l'image source Whiteboard Doodle avec Anansi en posture
basse/repliée au départ (comme l'image Poster Vector), ou reformuler la clause de contraste pour
partir de la pose réelle de l'image actuelle (ex. mains hautes → mains ENCORE PLUS hautes/en avant,
ou un changement d'expression/inclinaison plutôt qu'un déplacement de bras qui n'a nulle part où
aller depuis une pose déjà ouverte).

---

## CAS RÉSOLU — Kora & Cartes, Anansi/Nyame V2 (dialogue FR + étoiles scintillantes + geste renforcé) (2026-08-13)

Itération V2 sur le cas mitigé ci-dessous, mêmes réglages sinon (même image source
`anansi-nyame-pacte-v2-hybride.png`, même durée 8s/192 frames/864x480, méthode `submit_workflow`
identique). Livrable :
`memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/anansi-nyame-pacte-negociation-v2-dialogue-8s.mp4`
(prompt_id `22520b8e-9575-40a0-8ca4-dee52deb0899`, seed `731905248617`, 0 crédit, job resté ~5min en
statut `pending` avant `executing` — nettement plus rapide que le V1 ~21min, cohérent avec l'hypothèse
"ralentissement si plusieurs sessions actives en parallèle").

**3 corrections ciblées, toutes RÉUSSIES** :
1. **Dialogue français réel** : `<d>[French] Laisse-moi tenter ce que nul autre n'ose — et donne-moi
   toutes tes histoires.</d>` porté par Anansi identifié `(S1)`, avec clause explicite côté Nyame
   ("Silent throughout — Nyame never speaks, his lips stay closed... S1/Anansi is the only speaking
   character") pour éviter qu'il improvise sa propre réplique. **Vérifié par transcription Whisper
   réelle** (`scripts/tools/transcribe-openai.py` adapté, extraction audio ffmpeg d'abord) : texte
   retranscrit **mot pour mot identique**, segment unique 0.92s-5.56s, aucun mot après (Nyame bien
   resté muet, aucun charabia résiduel du V1). Confirme que la syntaxe `<d>[Language]...</d>` + `(Sx)`
   fonctionne aussi sur le node R2V multi-référence (pas seulement FLF2V, cf test Sonjata).
2. **Étoiles scintillantes** : clause décrivant précisément le comportement voulu ("each individual
   star and sparkle softly pulses in brightness — a gentle glimmer, not blinking on/off, not moving
   position, no new stars appearing... never a flashy sparkle burst or firework effect") répétée à
   chaque tranche de temps + dans STRICT NEGATIVE. **Confirmé visuellement** sur frames denses
   (échantillonnage 1/0.4s) : nombre et intensité des sparkles visibles varient nettement d'une frame
   à l'autre, effet cohérent avec l'orbite dorée déjà en mouvement, pas de scintillement agressif.
3. **Geste Anansi renforcé** (défaut connu du V1, secondaire mais traité) : clause `retention_analysis`
   insistant sur "a CLEARLY different position at each stage (not a subtle shift)" + poses contrastées
   explicites par tranche (mains basses repliées à 0s → mains hautes écartées et maintenues dès ~2s).
   **Nettement amélioré vs V1** : comparaison frame début (mains basses) vs frame milieu/fin (mains
   hautes ouvertes, position soutenue) montre un vrai changement de pose lisible, contrairement au V1
   quasi figé sur 8s malgré le même séquençage par tranches.

**Reste identique au V1 (non régressé)** : décor (trône, nuages, Adinkra), orbite dorée continue,
palette, cadrage, style flat-vector — tous stables sur les 20 frames vérifiées. Pulse d'orbe final
(clause 6-8s) visible et lisible ~6.8-7.2s. Aucun texte parasite, aucun morphing anatomique.

**Leçon actionnable généralisable** : pour un geste qui doit "s'animer avec insistance" (pas juste un
motif continu type orbite), la clause qui a fonctionné = décrire des **poses contrastées explicites
par tranche de temps** ("CLEARLY different position... not a subtle shift") plutôt que des verbes de
mouvement seuls ("pushes forward", "leans in") — confirme l'hypothèse déjà notée au V1.

---

## CAS MITIGÉ — Kora & Cartes, Anansi/Nyame pacte négociation V1 (2026-08-13)

Test mécanisme animé H3 R2V sur image Anansi/Nyame (Akan/Ghana, mythologie). Livrable :
`memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/anansi-nyame-pacte-negociation-8s.mp4`
(864x480, 8.00s pile/192 frames, prompt_id `ff578261-fb78-4d41-bbcb-c2726943bad4`, 0 crédit,
~21min job wall-time). Prompt sidecar + meta.json dans le même dossier.

Méthode `submit_workflow` graphe JSON à la main (gabarit
`scripts/tools/comfy-graphs/minimax-h3-r2v-graph-template.json`) — PAS `run_template`+
`input_overrides` (déjà documenté non fiable pour R2V).

**Verdict MITIGÉ** : décor (trône, nuages, Adinkra) parfaitement stable sur 8s + orbes/rubans
dorés de Nyame en orbite continue nette (idle motion `partially_preserved` réussie — 2e
confirmation de la technique après les tests split-screen Zeus/Hadès/Poséidon). MAIS geste de
négociation d'Anansi quasi invariant du début à la fin malgré séquençage explicite par tranches
de 2s (pas d'insistance/lean-in lisible comparaison frame début vs fin) — hypothèse : la clause
`partially_preserved` + attribute_transfer a bien ancré l'identité mais le verbe d'action seul
("pushes forward", "leans in") n'a pas suffi à produire un changement de pose net, contrairement
à Nyame où le mouvement demandé était un motif continu (orbite) plutôt qu'une progression de
pose. Léger drift caméra malgré clause "completely static" (écart mineur, pas un vrai pan/zoom).
Pulse d'orbe final (6-8s) peu lisible comme événement distinct. Audio généré par défaut par le
template malgré clause "no music/no sound" (comportement déjà connu, à couper en post).

**Gotcha nouveau — durée job H3 480p imprévisible** : job resté en statut `pending` (pas encore
`executing`) pendant ~21min avant complétion, très au-delà des ~141s solo documentés pour du
480p. `get_queue` (compteur global du compte) a confirmé 1 job `running` pendant l'attente —
utile pour distinguer une vraie file d'attente serveur d'un blocage anormal. Ne pas s'alarmer
avant le plafond documenté (~30min/1h Pro) ; pas de protocole de diagnostic déclenché ici car
le job a fini par aboutir proprement (pas un échec répété).

**Piste à tester si ce mécanisme est repris** : pour un geste de personnage qui doit "s'animer
avec insistance" (pas un motif continu comme une orbite), envisager une clause de séquençage
encore plus contrastée entre pose de départ et pose d'arrivée (ex. décrire explicitement une
position de main/tête différente à chaque tranche, pas seulement un verbe de mouvement) — cohérent
avec la leçon déjà documentée "H3 est littéral, anime précisément ce qui est décrit".
