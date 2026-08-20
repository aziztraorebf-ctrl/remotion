# Thumbnails YouTube — Bibliothèque pérenne par univers

> Références visuelles pour futures productions Souverain / Atlas / Sonjata.
> Validés 2026-05-28.

## 4 standards de référence — 3 univers, 2 pipelines

### Univers Souverain (géopolitique économique contemporaine)

#### `senegal-petrole.png`
- Métaphore : baril métal photoréaliste, jauge 18% drapeau Sénégal en bas
- Pipeline : **A** (edit chirurgical, 2 passes — 1 pour matière, 1 pour repositionner texte)
- Référence éditoriale visée : Bloomberg / FT cover
- Coût : $0.08
- ⚠️ Ancienne tentative (2026-05-28) — voir `senegal-petrole-gaz/senegal-piege-baril.png` ci-dessous
  pour la version retenue et validée (2026-07-11, Pipeline C), sur la MÊME vidéo. Les deux fichiers
  coexistent volontairement (comparaison de pipelines) ; ne pas confondre au moment de publier.

#### `senegal-petrole-gaz/senegal-piege-baril.png` ✅ validé Aziz — RETENU
- Métaphore : baril de pétrole enchaîné, affichage LED rouge "132%" (dette publique/PIB citée au
  script), carte du Sénégal avec Dakar marqué
- Pipeline : **C** (voir section dédiée ci-dessous)
- Vidéo : Sénégal Pétrole/Gaz (longue, ~8min), déjà promue `out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4`
- Titre overlay : "PÉTROLE : LE PIÈGE SÉNÉGALAIS ?"

#### `niger-uranium.png`
- Métaphore : ampoule Edison classique avec filament tungstène aux couleurs Niger
- Pipeline : **A** (edit chirurgical, 1 passe)
- Référence éditoriale visée : Bloomberg / FT cover
- Coût : $0.04

### Univers Atlas (cartographie historique)

#### `atlas-mansa-moussa.png`
- Métaphore : carte portolan ancienne + Mali en or massif + route caravane vers Caire
- Pipeline : **A** (edit chirurgical, 2 passes — 1 pour carte stylisée, 1 pour retirer le bandeau source)
- Référence éditoriale visée : National Geographic carte historique
- Coût : $0.08

### Univers Sonjata (illustration storybook africain)

#### `sonjata-mande.png`
- Métaphore : scène cartoon (héro Mandé + baobab + village mandingue)
- Pipeline : **B** (création guidée par références — 1 croquis + 3 frames V7 + 1 brief)
- Référence éditoriale visée : "same artist as Sonjata V7 reference frames"
- Coût : $0.04

### Univers Souverain — War-Map (géopolitique conflit/carte)

#### `warmap-sahel-aes/aes-la-rupture.png` ✅ validé Aziz
- Métaphore : carte Sahel fissurée (fracture lumineuse rouge), vrai sceau AES (Wikipedia) au centre de
  la fracture avec halo doré dosé, icônes ressources (or/uranium/pétrole) qui giclent hors de la carte
- Pipeline : **C** (voir section dédiée ci-dessous)
- Référence éditoriale visée : outliers réels du sujet (TubeLab), style "texte-choc + carte alerte"
- Vidéo : War-Map Sahel AES (longue, ~5min), publication à venir

#### `warmap-sahel-aes/aes-le-nouveau-bloc.png` ✅ validé Aziz — variante A/B
- Métaphore : carte Sahel contours colorés + drapeaux semi-transparents, vrai sceau AES au centre
- Pipeline : **C**
- Usage : test A/B contre `aes-la-rupture.png` sur la même vidéo

---

## Quand consulter ces fichiers

- **Avant de coder un nouveau thumbnail** dans un de ces 3 univers → vérifier les standards visuels établis
- **Pour briefer Gemini** → utiliser ces images comme référence "to match this style"
- **Pour décisions design** (palette, layout, drapeau, métaphore, choix Pipeline A vs B)
- **Comme exemples concrets** des résultats finaux acquis avec le pipeline

## Méthodologie complète

- **Pipeline technique détaillé** : `memory/tools/gemini.md` (sections Pipeline A et Pipeline B)
- **Pipeline produit + règles design** : `out/SHOWCASES/templates-souverain/README.md` section "Thumbnails YouTube"
- **Code des wrappers et icons** : `src/projects/_shared/thumbnails/`
- **Scripts Python** : `scripts/tools/gemini-thumbnail-edit.py` (Pipeline A) et `scripts/tools/gemini-thumbnail-create-from-refs.py` (Pipeline B)

## Pipeline C — script complet + web LLM + retouche API (validé 2026-07-10, cas AES)

**Contexte de découverte** : sur le projet War-Map Sahel AES, les tentatives habituelles (Pipeline A/B,
recadrage manuel de frames existantes, brief texte envoyé à 3 modèles via `da-brief.py`) ont produit des
résultats corrects mais jamais aussi forts que ce Pipeline C — parce qu'aucune des approches précédentes
ne donnait au modèle le VRAI script complet + une vraie liberté de composition (pas de contrainte "pars
d'une frame existante").

**Étapes** :
1. **Extraire le script complet réel** de la vidéo (le transcript aligné sur l'audio final, PAS le
   fichier `SCRIPT-*.md` de travail qui peut contenir des notes de production) :
   ```python
   import json
   data = json.load(open("public/_shared/audio/<episode>/narration-*-alignment.json"))
   text = "".join(w.get("text", w.get("word","")) for w in data["words"])
   ```
2. **Rédiger un brief court** (pas le script Python `da-brief.py` — un texte simple à copier-coller) qui
   décrit : le sujet, le registre visuel du studio (pas de photos/visages réels, style motion
   graphics/infographie, palette actuelle), et demande explicitement PLUSIEURS concepts différents (pas
   une seule direction) avec pour chacun composition + texte overlay + palette + principe CTR.
3. **Aziz colle lui-même** brief + script dans une interface web gratuite (Gemini web, ChatGPT, Kimi) —
   PAS d'appel API à ce stade. Plus rapide, gratuit, et l'interface web semble produire une meilleure
   créativité de composition que l'API pilotée par prompt seul (hypothèse non confirmée mais observée 2x).
4. **Aziz choisit** 1-2 concepts parmi les propositions.
5. **Itération de correction via API** (**`IMAGE_MODEL_HQ`**, `gemini-3.1-flash-image` — une miniature est PUBLIEE TELLE QUELLE et depasse 1K, donc HQ et pas le Lite ; ⛔ importer depuis `scripts/tools/gemini_models.py`, jamais en dur — **REST direct** — le SDK
   `google-genai` peut hang silencieusement sur les appels i2i, cf gotcha `memory/tools/gemini.md`) :
   fournir l'image choisie comme référence + un prompt de correction PRÉCIS et ciblé (un seul type de
   changement par itération si possible — mélanger plusieurs demandes dans un même prompt peut faire que
   Gemini n'applique pas toutes les corrections, ex: la demande "réduire la luminosité" a été ignorée
   quand combinée avec 2 autres changements, a nécessité un 2e appel dédié).
6. **Points de vigilance récurrents** :
   - Gemini invente souvent un faux logo/sceau — si l'organisation a un vrai logo officiel (Wikipedia),
     le fournir en 2e image de référence et demander le remplacement explicite.
   - Un petit filigrane "sparkle" (étoile 4 branches grise, coin bas-droit) apparaît fréquemment sur les
     générations Gemini — le signaler explicitement et par sa position pour le faire retirer (pas
     "retire les filigranes" en général, ça ne suffit pas toujours).
   - Résolution native de sortie ≈ 1376×768, PAS du vrai 1920×1080. Upscale Lanczos avant publication :
     `ffmpeg -i in.png -vf "scale=1920:1080:flags=lanczos" out.png` (sans perte visible sur ce type de
     visuel vectoriel/texte, mais ce n'est pas du Full HD généré nativement — le signaler si demandé).
     ⚠️ Le web app Gemini, lui, peut sortir en pleine résolution (2752×1536 observé, cas Soudan
     2026-07-31) — supérieur à l'API, pas besoin d'upscale si le fichier vient du web.
   - **Vérifier le CONTENU RÉEL d'un fichier téléchargé avant de l'utiliser**, jamais se fier au nom
     de fichier seul (cas Soudan 2026-07-31) : 2 images partagées par Aziz via des liens tmpfiles.org
     étaient DÉJÀ inversées au moment du transfert (le lien nommé "machine à guerre" pointait vers
     l'image du "serpent" et vice-versa). Un 1er appel API de correction a donc été lancé sur la
     mauvaise image, et Gemini a improvisé un résultat halluciné (texte jamais demandé) au lieu de
     rien faire, faute de correspondre au prompt. Toujours ouvrir/afficher l'image avant un appel API
     de référence, surtout si plusieurs fichiers similaires sont transférés en même temps.
     Gotcha lié : tmpfiles.org retourne une page HTML de download sur son URL "normale" (curl -sL
     télécharge du HTML déguisé en .png, détectable via `file` : "HTML document text") — le vrai lien
     direct suit le pattern `https://tmpfiles.org/dl/{id}/{filename}`.

**Coût** : gratuit pour l'étape web (1-4), quelques centimes pour les itérations API de correction (5).

**Quand l'utiliser** : sujet géopolitique/actualité avec un script narratif déjà écrit, où on veut
plusieurs directions créatives vraiment différentes plutôt qu'une seule idée affinée.

## Pipeline SVG — composé maison, ZÉRO génération d'image (validé 2026-07-30, cas Franc CFA)

> ⭐⭐ **Le défaut pour toute vidéo au registre SVG/vectoriel.** Une miniature n'est rien d'autre qu'une
> **scène SVG statique** — exactement ce que le studio produit déjà. On la COMPOSE, on ne la génère pas.

**Pourquoi il bat les pipelines A/B/C sur ces sujets :**
- **Texte exact, accents compris.** Un modèle d'image ne sait pas écrire du français fiable — observé le
  2026-07-30 sur 4 images Gemini web : « BANQUE CENTRALE DES **ÉETATS** », « **FRAC** CFA », « WEST AFRIC ».
- **Zéro rupture d'attente.** Une miniature 3D photoréaliste sur une vidéo 100 % SVG fait cliquer sur du
  3D pour tomber sur de l'illustration animée → abîme la rétention des premières secondes.
- **Coût nul**, itération en secondes (`rsvg-convert -w 1920 -h 1080 x.svg -o x.png`).
- **Signature de chaîne** : des miniatures dans le même langage visuel que les vidéos rendent la chaîne
  reconnaissable dans un feed. Actif qui se capitalise.

**Les 4 étapes :**
1. `python3 scripts/tools/jury-thumbnail-llm.py <script.md> --contexte "..."` → 5 concepts SVG classés
   (4 modèles). Le brief exige ≥2 vraies SCÈNES NARRATIVES : un schéma/graphique est un sujet méta, il
   explique au lieu de raconter et lit comme un slide de rapport en vignette.
2. Composer le SVG (agent Fable ou soi-même).
3. ⭐ **L'orchestrateur reprend le SVG à la main** — un agent auto-évalue mal son propre rendu visuel.
4. **Vérifier à 320 px et REGARDER** (`rsvg-convert -w 320 -h 180`). Non négociable.

**Référence produite** : `franc-cfa/minuit.png` (+ `.svg` source) — horloge arrêtée à minuit, billet
déchiré dont la moitié droite tombe ET s'assombrit en sortant du halo. Texte gravé : « FRANC CFA ·
Divisé par deux en une nuit ». Variante écartée conservée : `franc-cfa/levier.png`.
Doctrine complète : `.claude/…/memory/feedback_thumbnail-svg-compose-maison.md`.

## Choix Pipeline SVG, A, B ou C selon le sujet

| Type de sujet | Pipeline recommandé | Pourquoi |
|---------------|---------------------|----------|
| **Vidéo au registre SVG/vectoriel (encre, blueprint, D3, schéma animé)** | **SVG** ⭐⭐ | Cohérence de registre + texte français exact. Ne PAS générer une image 3D pour une vidéo vectorielle. |
| **Texte français accentué à graver dans l'image** | **SVG** ⭐⭐ | Les modèles d'image fautent sur les accents et les chiffres précis (« ÉETATS », « FRAC »). |
| **Sujet éditorialement sensible (neutralité stricte à tenir)** | **SVG** ⭐ | On contrôle chaque forme — un modèle d'image glisse vers l'allégorie accusatrice (2 concepts sur 4 montraient le CFA enchaîné par l'euro). |
| Sujet à ratio mesurable, objet symbolique (baril, ampoule, coffre, balance) | A | Le SVG permet de fixer le ratio précisément, Gemini ajoute la matière |
| Sujet géographique stylisé (carte ancienne, territoire highlight) | A | SVG pose la géométrie reconnaissable, Gemini ajoute texture/détails époque |
| Sujet à esthétique cartoon storybook | **B** | Impossible à coder en SVG primitif, Gemini imite l'esthétique des frames de référence |
| Sujet à esthétique illustration spécifique (papercraft, peinture, encre) | **B** | Idem — utiliser les frames de la vidéo source comme référence |
| Sujet où l'on veut **cohérence parfaite avec la vidéo existante** | **B** | Le viewer reconnaît immédiatement l'univers visuel = signal subliminal de qualité |
| Sujet géopolitique/actualité avec script narratif complet, besoin de **plusieurs directions créatives distinctes** | **C** | Web LLM + script complet = meilleure variété de composition que prompt API seul ; retouche API ensuite pour la précision (vrai logo, corrections ciblées) |

## À ajouter ici au fil des productions

Au fur et à mesure des Shorts/Mid-form publiés, ajouter :
- Le PNG final
- Le sujet + univers
- La métaphore utilisée
- Le pipeline utilisé (A ou B) + coût
- Le brief Gemini exact

Ça devient progressivement la galerie de référence multi-univers du studio.
