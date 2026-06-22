# STARTER — Suite R&D « SVG génératif de scènes » (prochaine session)

> Reprise du chantier SVG génératif. **LIRE EN PREMIER : `memory/doctrines/SVG-SCENES-GENERATIVES.md`**
> (source de vérité unique, tout l'acquis y est). Ce starter = le pont vers la suite, pas un doublon.
> Créé le 2026-06-21 en fin de session R&D. Branche de la session précédente MERGÉE dans master (commit `4e759c3`).

---

## CE QUI EST DÉJÀ ACQUIS (ne pas refaire — c'est prouvé et commité dans master)

Le système « un LLM dessine une scène SVG en groupes nommés → on réécrit en JSX → on anime par la frame » est
**prouvé A→Z et reproductible** (validé par agent vierge). Détail complet dans la doctrine. En résumé :

- **Générateur** : `scripts/tools/rnd-svg-scene-gen.py` — REGISTRE découplé de la SCÈNE (params `REGISTRES` + `SCENE_REGISTRE`).
  Usage : `python3 scripts/tools/rnd-svg-scene-gen.py --scene <nom> --provider gemini|gpt --out /tmp/x.json`.
- **Harnais de rendu** : `src/projects/_rnd/svg-scenes/` (Svg Scene Coin/Planche/Parchemin + compos). ⚠️ **C'est une
  BIBLIOTHÈQUE DE RÉFÉRENCE R&D, pas de la production** — voir le `README.md` du dossier. Consulter pour voir ce qui
  existe ; ré-adapter (jamais brancher brut) avant tout usage en vidéo, et seulement si Aziz le demande.
- **4 registres prouvés** : `medaille` (doré), `blueprint` (bleu tech), `encre` (parchemin), `tactique` (état-major).
- **2 grammaires d'animation** : « RESPIRE » (vie continue) / « SE CONSTRUIT » (apparition séquencée, tracé stroke-dasharray).
- **Règle modèle (5× confirmée)** : Gemini = organique/profondeur · GPT-5.5 = schéma/géométrie → générer les 2, choisir.
- **SFX timé frame-perfect** : la vraie valeur vs vidéo IA (on connaît la frame de chaque geste). Banque `_shared/sfx/`.
- **Usage phare = ENCART CONCEPTUEL en rupture de carte** : le SVG explique un PRINCIPE/MÉCANISME (pas un lieu).
  Prouvé sur le vrai script War-Map Sahel (clause de défense mutuelle P3 → `DefenseGptAnimee`).
- **⛔ Doctrine d'orientation** : le SVG N'EST PAS pour l'organique humain/animal (gens → forme symbolique, pas réaliste).
- **Gotchas connus** (dans la doctrine) : innerHTML=statique / JSX=animation · convertir camelCase→kebab · nettoyer
  les glyphes unicode (↑↓) du texte LLM · animation = fonction de `frame` uniquement.

Scènes déjà produites (toutes en VERTICAL 1080×1080) : ville/port, carte état-major, plateforme offshore (+SFX),
profil/duo/animal (organique = rejeté), défense mutuelle AES, mécanisme Franc CFA (par agent vierge).

---

## ✅ SESSION 2026-06-22 — 16:9 + CHAUD + INTÉGRATION SOUDAN : TOUT PROUVÉ (détail dans la doctrine)

Les 3 pistes ci-dessous ont été TRAITÉES cette session sur le vrai script Soudan (« suivre l'or »). Acquis majeurs
(gravés dans `SVG-SCENES-GENERATIVES.md`, sections « DOCTRINE D'ANIMATION & D'ÉPURE » + « 2 CAPACITÉS WORKFLOW ») :
- **16:9 prouvé** (viewBox 1920×1080, compo étalée en largeur). Scène-référence = `HeroGptAnimee`.
- **2 registres chauds prouvés** : `braise-or` (sombre, fournaise) + `or-jour` (lumineux, matin doré). Plus de « froid ».
- **L'avantage du SVG = l'ÉPURE PILOTÉE** (3-4 objets héros qui racontent + pilotage couleur), PAS le détail (sinon Seedance gagne).
- **Doctrine 2 couches** (fond permanent + événements échelonnés / règle des 5s) : tient 14–28s.
- **Objet inerte ne glisse jamais** (fade/couleur) · **tomber-sec** avec spring · **terre vire au rouge sang** = signature couleur.
- **REMAP COULEUR côté code** (décliner une palette sans rappeler le LLM) + **CLAUDE = ÉDITEUR SVG** (corriger un élément raté
  à la main, ex fumée réécrite, zéro appel API). → le LLM = matière première, pas contrainte.
- Modèle : sur une scène CONCRÈTE/ÉPURÉE à objets nets, **GPT-5.5 redevient compétitif/meilleur** (Gemini = atmosphérique).
- **AGENT VIERGE prouvé une 2e fois** (registre `papier-decoupe` NEUF, scène graine→arbre, A→Z sans solution soufflée) →
  le système est reproductible PAR UN TIERS, pas juste par moi.
- ⭐ **FINITION ORCHESTRÉE prouvée** (vision Aziz pour scaler) : agent = gros œuvre, Claude+Aziz = la VIE ajoutée en code
  (balancement vent · soleil actif · fruit qui tombe · feuilles qui flottent) + **SFX NATURE générés ElevenLabs** (`public/_shared/sfx/nature/`).
- 📼 **Rendus de référence gardés** : `out/_r-and-d/svg-scenes-refs/` (README + .mp4, marqués RÉFS R&D pas livrables).
- **5 registres chauds/doux prouvés au total** : braise-or, or-jour, papier-decoupe (+ medaille/blueprint/encre/tactique des sessions avant).

## ⭐ CE QUI RESTE À EXPLORER (prochaine session)

### 1. La scène « suivre l'or » dans la VRAIE vidéo Soudan (intégration épisode)
La scène-héros `HeroGptAnimee` est un PROTO R&D autonome (14s). Pour la vraie vidéo : la brancher sur l'audio réel de
l'Acte 1 (« il ne faut pas suivre les armes... il faut suivre l'or », storyboard #8-9), caler les gestes sur la VO
(forced-alignment), étirer le timing à la durée de la phrase. C'est l'étape « intégration épisode » (le proto SFX +
anim est prouvé, reste à le marier au script réel). ⚠️ Le SVG ne remplace PAS la carte War-Map du Soudan — il sert
le MOMENT conceptuel « suivre l'or » en rupture de carte.

### 2. Autres moments conceptuels du script Soudan (candidats encart SVG, repérés mais non prototypés)
- Jeton 2-visages alliance→scission Hemeti/Al-Burhan (Acte 2 — mais Aziz l'a déjà pensé comme sprite War-Map, pas SVG).
- « un pays ne peut pas avoir 2 armées » (principe structurel, Acte 2 #3).
- « territoire vs puissance de feu » (paradoxe, Acte 2 #6).

### 3. 2e scène chaude pour varier registres/teintes (proposé, non fait)
Reco : le **CREUSET** (or fondu → armes, forge nocturne, teinte braise différente du jour) — raconte la transmutation
« or → armes ». Alternative : la **caravane** (désert diurne). 100% objets manufacturés. (Aziz voulait varier les teintes.)

### 4. Registres encore non sondés (backlog doctrine) : néon/data-terminal, papier découpé.

---

## COMMENT DÉMARRER LA PROCHAINE SESSION (checklist)
1. Lire `memory/doctrines/SVG-SCENES-GENERATIVES.md` (acquis complet) + ce starter.
2. Demander à Aziz par quelle piste commencer (horizontal / esthétiques chaudes / Soudan) — ou enchaîner si déjà dit.
3. Pour le Soudan : lire d'abord le script réel (point d'entrée `memory/projects/soudan-midform.md`) AVANT de proposer
   des encarts — repérer les moments conceptuels, ne pas deviner.
4. Méthode inchangée : INTENTION → FORME → registre → générer Gemini+GPT → juger statique → animer le meilleur →
   SFX timé → render → upload catbox → présenter plein format. Protos = `_rnd/svg-scenes/` (marqués référence).
5. Enrichir la doctrine au fil des nouveaux acquis (nouveau registre chaud, format 16:9 prouvé, intégration Soudan).

## RÉFÉRENCES RAPIDES (vidéos de preuve, session précédente)
ville https://files.catbox.moe/nv6iy6.mp4 · état-major https://files.catbox.moe/pt5od0.mp4 · offshore+SFX
https://files.catbox.moe/s1jloa.mp4 · défense mutuelle AES https://files.catbox.moe/05xbm1.mp4 · Franc CFA (agent)
https://files.catbox.moe/i241v3.mp4
