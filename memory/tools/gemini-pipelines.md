# Gemini — Pipelines spécialisés (édition chirurgicale, thumbnails, carousel, portraits)
> Détail pipelines spécifiques. Couche critique (modèles verrouillés, SDK, gotchas universels) : `memory/tools/gemini.md`.
> Mise à jour : 2026-06-25

---

## Edition chirurgicale en PREMIER, regen complete en DERNIER (2026-04-25)

**Regle validee sur Thiaroye V5 (8 clips produits par Aziz manuellement avec Claude Desktop) :**

Quand une image est validee a 80%+ et qu'il manque une correction precise :
1. **Tenter d'abord** un edit chirurgical Gemini (image-to-image) avec formule stricte :
   ```
   Edit this image with ONE correction only -- change nothing else.
   PRESERVE EXACTLY: [liste explicite de tout ce qui doit rester intact]
   CHANGE ONLY: [la modification ciblee]
   ```
2. **Si Aziz confirme que ca ne marche pas du tout** apres 1-2 tentatives chirurgicales, alors regen complete autorisee.
3. **Limite recommandee** : 2-4 iterations chirurgicales max par image. Au-dela, Aziz refuse generalement ("le ratio qualite/effort ne justifie pas").

**Pourquoi cette regle** : Aziz a prouve sur Thiaroye que cette discipline produit des resultats meilleurs que regen aveugle. La regen perd la coherence visuelle deja acquise, l'edit la preserve.

### EXCEPTION : layouts multi-panels structures (storyboards 3x3, 4x4, character sheets multi-poses) — 2026-05-01

**L'edition chirurgicale ciblee NE FONCTIONNE PAS pour modifier 1 ou 2 panels d'un layout en grille.**

Test A/B Sonjata Scene 5 storyboard 3x3 (2026-05-01, 3 essais) :
- Fix v1 (1 panel cible) : panel partiellement corrige (yeux fixes mais action manquee), reste de la grille intact
- Fix v2 (2 panels cibles) : narration corrigee mais Gemini a casse le layout 3x3 et change le format 9:16 en carre 1:1
- Full regen v3 (prompt corrige) : tout fonctionne du premier coup

**Lecon** : Gemini ne sait pas modifier des cellules individuelles dans une grille structuree. Il regenere implicitement toute l'image et perd le layout d'origine. Pour les multi-panels :
1. **Identifier TOUS les problemes du storyboard d'abord** avant de toucher quoi que ce soit
2. **Reformuler le prompt complet** avec les corrections inline (ex: "Panel 5: boy GRIPPING trunk, ground CRACKING")
3. **Full regen direct** — economise 2-3 essais infructueux ($0.08-0.12 evites)

**Cout des 3 essais sur Sonjata Scene 5** : $0.12 brules avant le full regen qui a marche a $0.04.

**Triple formulation pour contraintes ambigues** : si un element doit etre absent, le formuler 3 fois sous angles differents.
Exemple : `"NO mask. NO object covering the face. The face area is simply absent."`

---

## Methode Nano Banana — Modification chirurgicale d'asset

### Workflow (2 etapes)
1. **Extraction JSON** (`gemini-2.0-flash`, gratuit) : analyser image -> JSON decrivant style, elements, atmosphere
2. **Modification + Regeneration** (`gemini-3-pro-image-preview` OBLIGATOIRE) : modifier 1 champ JSON + renvoyer image originale + JSON modifie

### Regles
- Passer l'image originale EN PLUS du JSON modifie — sans elle, la composition change
- Modifier 1 seul champ a la fois — plus de changements = plus de derive
- Usage : variantes d'assets existants — PAS pour generer from scratch

---

## Cartes geographiques

**Gemini = meilleur pour cartes.** Recraft ne comprend pas la geographie reelle.

**Prompt cle :** `"Bold flat vector graphic map, NO TEXT, NO LABELS, NO ANNOTATIONS"` + style Kurzgesagt.

---

## Character sheets multi-angle (VALIDE 2026-04-01)

- **Workflow** : fournir 1-2 character sheets existants comme ref de style + prompt nouveau personnage
- **Modele** : `gemini-3.1-flash-image-preview` — genere en ~30-60s
- **Layout** : "4 head views (front, 3/4, profile, back) + 1 full body standing on the right"
- **Resultat** : style coherent avec les refs, personnage distinct. Teste sur Colomb avec refs Abou Bakari + Moussa.

---

## Expressions en pourcentage (VALIDE 2026-04-01)

Specifier un blend d'emotions avec pourcentages — Gemini blend reellement.

**Prompts exemples :**
- "70% determination, 30% hidden anxiety" (depart en expedition)
- "90% ecstatic joy, 10% madness" (decouverte de terre)
- "50% terror, 50% awestruck wonder" (tempete en mer)

**Application** : generer start frames avec l'emotion exacte du beat narratif avant d'envoyer a Seedance.

---

## Style papercraft = ICONIQUE, PAS RESSEMBLANT (NON-NEGOTIABLE — 2026-04-29)

**Erreur structurelle a ne plus jamais reproduire :** donner des photos historiques realistes a Gemini pour creer un personnage papercraft.

**Le style papercraft GeoAfrique n'est PAS un style ressemblant. C'est un style iconique :**
- Yeux = **DOT EYES** (points noirs simples), pas des yeux dessines avec iris/pupille/blanc
- Visages quasi-interchangeables entre personnages — c'est delibere
- Differenciation par : coiffure, foulard, costume, accessoires, posture, contexte
- Personne n'attend qu'un personnage "ressemble" a la vraie personne historique (qui souvent n'a meme pas de portrait connu de toute facon)

**Quand on donne a Gemini des refs photo realistes** (drawing N&B detaille, vraies photos d'epoque), il essaie de respecter ces refs et **derive vers le style BD/illustration peinte** avec yeux realistes.

**Regle pour creer un nouveau personnage papercraft :**
1. **NE PAS** donner de photos historiques en input.
2. **NE DONNER QUE** des refs papercraft canoniques de la chaine (charsheets Abou Bakari/Moussa, scenes Sonjata, etc.)
3. **Decrire la personne dans le prompt texte** uniquement par ses attributs distinctifs : coiffure, foulard, costume, age approximatif, posture canonique.
4. **Accepter** que le visage ressemblera plus aux autres personnages papercraft de la chaine — c'est le BUT.

**Cas d'echec valide 2026-04-29 :** charsheet Mariama Ba v1 (refs incluant drawing N&B + photos 1958/1970s) a produit du BD avec yeux realistes. v2 (memes refs ajout charsheets papercraft) a ameliore le style mais pas elimine le drift realiste.

---

## Review d'image — pieges d'analyse a eviter (2026-04-29)

**Erreurs frequentes en review automatique d'images papercraft GeoAfrique :**

1. **Sur-analyser les "yeux non-dots"** : un dot eye stylise garde une petite forme legere. Sur-zoomer pixel par pixel fait inventer des defauts qui n'existent pas.
2. **Confondre "texte stylise suggerant l'ecriture" avec "texte lisible"** : des lignes dessinees qui suggerent une ecriture sans etre lisibles = bonne solution narrative.
3. **Confondre "ombrage leger d'eclairage" avec "drift BD"** : un peu d'ombre directionnelle indique d'ou vient la lumiere. Utile pour coherence si la scene est animee.
4. **Surnommer "papercraft" trop strictement** : le style GeoAfrique est un hybride papercraft/illustration legere, pas du papercraft minimaliste strict.

**Methode robuste de review :** poser la scene/image cote a cote avec une scene/charsheet existante de la chaine. Si elles passent ensemble dans une video sans dissonance, c'est valide.

---

## PNG transparency — Gemini retourne RGB sans alpha (2026-04-30)

**Bug confirme** : meme avec prompt explicite "TRANSPARENT BACKGROUND, no solid color, no white", Gemini 3.1 Flash Image preview retourne le PNG en **mode RGB** (pas RGBA) avec un fond gris uniforme `~RGB(212,212,212)`.

**Verification obligatoire avant integration Remotion :**
```python
from PIL import Image
im = Image.open(file)
print(im.mode)               # 'RGB' (bug) au lieu de 'RGBA'
print(im.getpixel((0,0)))    # (212, 212, 212) au lieu de (0,0,0,0)
```

**Fix automatique** : chroma-key le gris -> alpha 0 puis crop bbox + sauvegarde RGBA :
```python
for y in range(H):
    for x in range(W):
        r, g, b, a = px[x, y]
        if abs(r - g) < 12 and abs(g - b) < 12 and r > 195:
            px[x, y] = (0, 0, 0, 0)
bbox = im.getbbox()
if bbox: im.crop(bbox).save(out_path, optimize=True)
```

Script reutilisable : `quebec-jacques-poc/scripts-atlas/fix-chibi-transparency.py`

**Ne JAMAIS faire confiance** au damier dans Read tool comme indicateur de transparence.

---

## Walk cycle multi-frame — bug character drift (2026-04-30)

**Bug observe** : meme avec prompt explicite "EXACT same character + costume + colors, only walking pose changes", Gemini 3.1 Flash Image genere des frames avec bbox differente et character drift subtle.

**Verdict** : pour Remotion vectoriel, **ne pas tenter walk cycle multi-frame Gemini**. Une seule frame + animation de transformation (hopping `Math.abs(sin(frame*0.4)) * 5`) suffit pour V1.

**Si vraiment besoin walk cycle :** considerer PixelLab (specialise sprite animation) OU generation manuelle.

---

## Gemini 3 Flash Preview — review video input ($0.005-0.01 par 16s) (2026-04-30)

**Capacite confirmee** : `gemini-3-flash-preview` accepte input video natif via File API (jusqu'a 1h@default, 3h@low res).

**Pattern valide pour review post-mini-render :**
```python
client = genai.Client(api_key=...)
uploaded = client.files.upload(file=str(video_path))
while uploaded.state.name == "PROCESSING":
    time.sleep(3)
    uploaded = client.files.get(name=uploaded.name)
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=[uploaded, BRIEF_PROMPT],
)
```

**ROI** : Gemini reperer 2 bugs additionnels que creator + Claude n'avaient pas vu en 18s analyse pour $0.005. Script reutilisable : `quebec-jacques-poc/scripts-atlas/review-s3-iter1-with-gemini.py`

---

## Workflow Thumbnails YouTube — Pipeline hybride Remotion + Gemini (validé 2026-05-28)

### Principe général

Remotion = structure géométrique + ratios + composition + texte typographique préservé
Gemini 3.1 Flash Image = matière photoréaliste / illustration cartoon / esthétique spécifique

Combiner les deux donne un thumbnail YouTube de niveau éditorial international pour $0.04-0.12 par image.

### Deux pipelines complémentaires selon le type de sujet

| Pipeline | Quand l'utiliser | Input | Référence éditoriale |
|----------|------------------|-------|---------------------|
| **A — Edit chirurgical** | Sujet à métaphore **géométrique** (objet symbolique mesurable, carte stylisée) | 1 image SVG détaillée Remotion | Bloomberg / Nat Geo / éditorial pro |
| **B — Création guidée par références** | Sujet à esthétique **très singulière** impossible à coder en SVG (cartoon, illustration, papercraft) | 1 croquis SVG ultra-épuré + N frames de référence | Imite l'esthétique d'une vidéo existante |

**Règle de choix** :
- L'objet narratif est **mesurable** (ratio 18%, jauge, comparaison) → Pipeline A
- L'esthétique de la vidéo est **plus importante que la mesure** → Pipeline B

### Architecture code

```
src/projects/_shared/thumbnails/
  ├── ThumbnailSouverain.tsx       ← générique (fond bleu nuit + texte + variants A/B/C + palette flags)
  └── icons/
      ├── BarilJaugeIcon.tsx       ← Sénégal pétrole (validé)
      ├── AmpouleIcon.tsx          ← Niger uranium (validé)
      └── [futurs : CoffreFort, Sablier, MainTenant, Balance, Pylone...]
```

Wrapper par sujet : `src/projects/_demos/<sujet>/Thumbnail<Sujet>.tsx` (~10 lignes)
Register : 3 compositions A/B/C dans Root.tsx avec defaultProps

### Pipeline 6 étapes

| # | Étape | Outil | Coût | Temps |
|---|-------|-------|------|-------|
| 1 | Choisir métaphore + ratio narratif | Humain | $0 | 10 min |
| 2 | Coder icône SVG dans icons/ | Claude | $0 | 15 min |
| 3 | Wrapper Composition + register Root.tsx | Claude | $0 | 5 min |
| 4 | Render PNG base 1280×720 | `npx remotion still` | $0 | 1 min |
| 5 | Brief Gemini chirurgical structuré | Claude | $0 | 5 min |
| 6 | Run `scripts/tools/gemini-thumbnail-edit.py` | Gemini 3.1 Flash Image | $0.04 | 30 sec |
| (7) | 2e passe Gemini si ajustement micro | Gemini | $0.04 | 30 sec |

**Total : 30-40 min + $0.04-0.12 par thumbnail premium signature.**

### Script Python validé

`scripts/tools/gemini-thumbnail-edit.py` :
- Input : PNG base Remotion + clé brief
- Output : PNG édité Gemini
- Briefs définis dans le dict `BRIEFS` (ajouter une clé par nouveau sujet)
- Modèle : `gemini-3.1-flash-image-preview`

### Formule brief chirurgical thumbnails

```
Edit this image with surgical improvements only -- preserve the overall composition.

PRESERVE EXACTLY:
- [liste précise de tout ce qui doit rester intact : fond, texte, position, couleurs identifiantes]

IMPROVE:
- [liste précise de ce qu'on veut transformer : matière, lumière, réalisme, détails 3D]

The result should look like [référence éditoriale visée].
```

### Règles design Souverain pour briefs Gemini

1. **Toujours préciser le fond** comme "PRESERVE EXACTLY" : `dark navy blue background with subtle dot grid texture`
2. **Toujours préserver le texte typographique** ("PRESERVE EXACTLY: text in gold/cream serif on the right side")
3. **Toujours préserver les couleurs de drapeau** (signal identité culturelle subliminale)
4. **Pour IMPROVE matière** : utiliser vocabulaire photographique pro (brushed steel, specular highlights, etc.)
5. **Référence finale toujours éditoriale** ("editorial photograph" / "magazine cover" / "Bloomberg-style") — jamais "3D render"

### Validation 2026-05-28

- Sénégal pétrole baril photoréaliste : https://files.catbox.moe/z2u6nv.png (2 passes Gemini)
- Niger uranium ampoule tungstène : https://files.catbox.moe/tf3tu0.png (1 passe Gemini)
- Coût total : $0.12 pour 2 thumbnails niveau éditorial international

### Anti-patterns identifiés

- **Ne PAS** demander à Gemini de gérer le texte typographique — la qualité Remotion est supérieure
- **Ne PAS** demander à Gemini de gérer la composition globale — laisser Remotion poser la grille
- **Ne PAS** demander à Gemini de générer "from scratch" sans base Remotion
- **Ne PAS** itérer plus de 2 passes Gemini sur la même image

---

## Pipeline B — Création guidée par références (validé 2026-05-28 Sonjata)

### Quand l'utiliser

Pipeline B se déclenche quand le sujet a une **esthétique très singulière impossible à coder en SVG primitif** :
- Cartoon storybook (Sonjata, Disney-like, dessin animé chaud)
- Illustration papercraft (style Thiaroye, Cut-paper)
- Style pictural très spécifique (peinture, aquarelle, encre)

### Architecture script

`scripts/tools/gemini-thumbnail-create-from-refs.py` :
- Input #1 : croquis SVG ultra-épuré rendu Remotion (1 PNG)
- Input #2-N : frames de la vidéo cible (PNG)
- Input N+1 : brief textuel
- Output : 1 PNG final via Gemini 3.1 Flash Image multi-images

### Formule brief Pipeline B

```
You are creating a YouTube thumbnail by combining a layout draft with a target art style.

INPUT IMAGE 1 (CROQUIS — layout draft):
- [Décrire les zones du croquis : fond, couleurs, zone vide pour le contenu]
- The TEXT on [position] MUST BE PRESERVED EXACTLY
- The [zone] is INTENTIONALLY EMPTY — this is where you must add the illustrated scene

INPUT IMAGES 2-N (STYLE REFERENCES — [source vidéo] frames):
- These show the EXACT visual style to reproduce

YOUR TASK:
Create a scene in the EMPTY area depicting:
- [Élément central]
- All elements drawn in [style EXACT des refs]

ABSOLUTE RULES:
- PRESERVE the text on [position] exactly as in image 1
- DO NOT make it [anti-pattern : photoréaliste, etc.]
```

### Règles design Pipeline B

1. **3 frames de référence variées** > 1 seule frame
2. **Frames récupérées via ffmpeg** à différents moments de la vidéo source
3. **Toujours inclure dans le brief** : "DO NOT make it photorealistic"

### Validation 2026-05-28 Sonjata

- Tentative Pipeline A → ❌ Hors esthétique V7
- Tentative Pipeline B (croquis épuré + 3 frames V7 + brief "flat cartoon storybook") → ✅ Parfait au 1er coup
- Lien final : https://files.catbox.moe/uthppp.png
- Coût : $0.04 (1 seule passe multi-images)

### Coûts comparatifs Pipeline A vs B

| Pipeline | Coût typique | Itérations moyennes | Réussite 1er coup |
|----------|--------------|---------------------|-------------------|
| A (edit chirurgical) | $0.04-0.08 | 1-2 | 80% |
| B (création guidée multi-refs) | $0.04 | 1 | 95% (quand bien briefé) |

---

## Pipeline Carousel Instagram — Validé 2026-05-31

**Contexte :** Générer des carousels Instagram 8 slides (1080×1920px) pour Kora & Cartes à partir des frames des vidéos publiées.

**Modèle :** `gemini-3.1-flash-image-preview` — 1 appel par slide (~$0.04), ~$0.32 par carousel.

### Règles obligatoires (toutes les slides)

**Header fixe :**
- Logo "K&C" centré en gold (#c8a951)
- UNE SEULE rangée de 8 barres fines gold (barre active = pleine, autres = 25% opacité)
- PAS de texte "SLIDE X/8". PAS de chiffres sous les barres.
- Footer : "@koraetcartes" centré en gold

**Palette :** fond `#16213a` | accent `#c8a951` | texte `#F5E6C8`

**Langue :** Ajouter SYSTÉMATIQUEMENT dans chaque brief : "Tout le texte en français uniquement. Zéro mot anglais autorisé."

### Règle géographie (NON-NEGOTIABLE)

Jamais demander à Gemini de **dessiner** une carte — il hallucine les frontières. Toujours injecter une frame Mapbox extraite de nos vidéos comme référence image.

### Préparation des frames de référence

Rogner les 18% inférieurs pour éliminer les sous-titres brûlés :
```python
cropped = img.crop((0, 0, w, int(h * 0.82)))
```

### Artefacts à surveiller

- **Bérets/uniformes modifiés** : Gemini peut changer des détails visuels meme avec instruction de fidélité.
- **Double rangée de barres** : préciser "UNE SEULE rangée de barres".
- **Chiffres sous les barres** : préciser "PAS de chiffres sous les barres".

### Contact sheet (validation Aziz)

```python
from PIL import Image
# 4×2 grid, 270×480px par thumb, fond #16213a, GAP 12px
sheet = Image.new("RGB", (4*270+5*12, 2*480+3*12), (22, 33, 58))
```

### Carousels Kora & Cartes — Statut

| Carousel | Date pub | Statut |
|---|---|---|
| Or Africain | 2 juin | ✅ VALIDÉ |
| Thiaroye | 6 juin | ✅ VALIDÉ |
| Niger Uranium | 9 juin | ❌ ABANDONNÉ (contenu trop complexe) |
| Mansa Moussa | 11 juin | ✅ VALIDÉ |
| Empire Ghana | 13 juin | pending |
| Soundjata | 16 juin | pending |
| Silicon Savannah | 18 juin | pending |
| Vraie Taille Afrique | 4 juin | pending |
| Sénégal Pétrole | 20 juin | pending |

---

## ⭐ Portraits de PERSONNES RÉELLES (i2i depuis photo) — recette validée (2026-06-14, War-Map P4)

Pour des portraits stylisés RESSEMBLANTS de figures réelles (dirigeants, personnalités) :
1. **Source = Wikimedia Commons / Wikipédia** (licence libre). Récupérer l'URL directe `upload.wikimedia.org/.../FICHIER.jpg`
   (retirer `/thumb/` et `/250px-...` pour la full-res) via WebFetch sur la page infobox. PAS Getty (droits/hotlink).
2. **`gemini-i2i.py --ref photo.jpg`** + prompt qui dit explicitement "KEEP the exact same face and likeness, clearly
   recognizable" + le style cible (gravure/encre parchemin, sépia, etc.).
3. ⛔ **PIÈGE MAJEUR (vérifié) : Gemini HALLUCINE du texte sur les portraits** (cartouche "médaillon" avec un NOM
   INVENTÉ). → Prompt anti-texte STRICT obligatoire : "ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO NAME, NO BANNER, NO FRAME,
   NO CIRCLE BORDER, NO MEDALLION, NO DECORATION. Just the bust on plain transparent background."
4. **Vérifier la ressemblance** (Read l'image) avant validation.
5. ⛔ **PIÈGE FOND OPAQUE (vérifié P4 2026-06-14)** : un i2i Gemini "fond transparent" rend souvent un FOND OPAQUE
   (gris/blanc/parchemin). → VÉRIFIER l'alpha : `Image.open(p).convert('RGBA')` + lire les coins.
   → DÉTOURER avec **Recraft `remove_background`** (MCP) → vrai alpha 0 propre. Le faire SYSTÉMATIQUEMENT pour tout portrait i2i destiné à un chip/cercle.

---

## ⭐ REF = GARDE-FOU DE STYLE — Gemini-avec-ref >> GPT-sans-ref (prouvé model sheet planteur 2026-06-29)
Pour tout asset où le STYLE est critique (personnage, model sheet, scène narrative dans un registre maison) :
- **Gemini AVEC ref** (`scripts/tools/gemini-gen-image-ref.py --refs <png>`) RESTE dans le style fourni. La ref agit
  comme ancre ET garde-fou anti-dérive (ex : empêche de tomber dans l'organique réaliste sur un personnage d'encre).
  Prouvé : planteur cacao → Gemini a poussé 5 poses dans NOTRE style encre épuré, plus expressif que la version manuelle.
- **GPT image** (`openai/gpt-5.4-image-2` via `openrouter-gen-image.py`) ne prend PAS de ref (prompt seul) → part dans
  SON propre style illustratif/cartoon (vêtements, bottes, corps rempli). Compétent mais HORS-registre. = alternative
  exploratoire seulement, pas pour un asset de série. ⚠️ GPT-image est LENT (>2min) → lancer en background (nohup).
Règle : asset de style critique → TOUJOURS Gemini avec une ref de garde-fou. Planches sauvées :
`public/_shared/refs/personnages/planteur-cacao-charsheet-{GEMINI,GPT}.png`.
