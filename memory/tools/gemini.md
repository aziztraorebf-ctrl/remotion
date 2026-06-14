# Gemini — Generation & Correction d'Images
> Edition chirurgicale, character sheets, expressions, Nano Banana, cartes geo.
> Mise a jour : 2026-05-06

## ⚠️ MODELES OBLIGATOIRES — REGLES DEFINITIVES (NON-NEGOTIABLE)

**DEUX modeles seulement. Zero autre modele. Zero exception.**

| Usage | Modele EXACT |
|-------|-------------|
| Toute generation d'image (mockup, storyboard, character sheet, carte, asset) | `gemini-3.1-flash-image-preview` |
| Analyse vision uniquement — breakdown JSON, diff visuel, hex codes (JAMAIS d'image en output) | `gemini-3.1-pro-preview` |

**Nouveau modèle disponible (2026-05-19) :**
`gemini-3.5-flash` — texte/agentic/coding, lancé à Google I/O. Capacités vision à confirmer. Candidat potentiel pour remplacer `gemini-3.1-pro-preview` sur les breakdowns JSON, mais NON validé encore pour ce projet.

**INTERDIT ABSOLU (entrainerait 404 ou mauvais resultat) :**
`gemini-2.5-pro-preview-05-06`, `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-2.0-flash-exp`, `gemini-3-pro-image-preview`, `nano-banana-pro-preview`, `imagen-*`, tout autre modele.

---

## SDK Python — MIGRATION OBLIGATOIRE (2026-05-14)

`google.generativeai` est **deprecated**. Utiliser le nouveau SDK :

```python
# INTERDIT (deprecated)
import google.generativeai as genai

# OBLIGATOIRE
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
```

**Config generation d'image avec nouveau SDK :**
```python
response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=parts,
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE', 'TEXT']
    ),
)
```

**Extraction image :**
```python
for part in response.candidates[0].content.parts:
    if part.inline_data:
        image_bytes = part.inline_data.data  # bytes directs — PAS base64 a decoder manuellement
        with open("output.png", "wb") as f:
            f.write(image_bytes)
```

**Points critiques :**
- `responseModalities` passe dans `types.GenerateContentConfig(response_modalities=[...])` — pas dans un dict brut
- `inline_data.data` = bytes directs (pas base64 encodee). Ne pas faire `base64.b64decode()`.
- Jury vision (analyse seule) : `genai.types.GenerateContentConfig(max_output_tokens=4000)` — pas `response_modalities`

---

**Config obligatoire pour generation d'image (ancienne syntaxe — NE PAS UTILISER) :**
```python
# DEPRECATED — remplacé par types.GenerateContentConfig ci-dessus
config={"responseModalities": ["image", "text"]}
```

**GOTCHA — parts=None (prompt refusé) :**
Si `response.candidates[0].content.parts` retourne `None`, Gemini a refusé de générer l'image.
Causes fréquentes : prompt trop abstrait ("pure dark", "no shapes", "black background") → reformuler avec description concrète de texture photographique.
```python
parts = list(response.candidates[0].content.parts) if response.candidates[0].content.parts else []
if not parts:
    print("Génération refusée — reformuler le prompt")
```

**RÈGLE PROMPTS BACKGROUNDS :**
- INTERDIT : "pure dark", "noir pur", "no shapes", "no forms", "completely abstract" → Gemini refuse
- OBLIGATOIRE : descriptions photographiques concrètes : "close-up aged paper texture", "dark brushed concrete surface", "dark stone texture"
- COULEURS : jamais #000000 ni "noir pur" — utiliser #0d1420, #12192a, #1a1f2e (désaturés sombres)
- OBJECTIF : texture visible à l'écran mais qui disparaît visuellement quand du texte/graphisme est posé dessus

**Pourquoi :** 3.1-flash-image-preview = seul modele qui genere ET edite des images. 3.1-pro-preview = meilleure vision pour analyse JSON (hex codes exacts, coordonnees SVG precises, 85-90% fidelite vs 40-50% avec 2.5-pro). Imagen = ne comprend pas les layouts UI complexes, genere des screenshots de telephone au lieu de composants vidéo — NE PAS UTILISER pour mockups Remotion.

**Cette regle a ete violee 4+ fois. Elle est definitive.**

---

## Gotcha drapeaux nationaux en contexte "Afrique / souveraineté" (2026-05-06)

Quand on demande des drapeaux de pays occidentaux (USA, UK, Chine, Canada, Australie) dans un contexte narratif lié à l'Afrique ou à la souveraineté, Gemini substitue des drapeaux africains ou régionaux (CEDEAO, Nigeria, Mali, etc.) même si les pays sont explicitement nommés.

**Solution validée** : décrire les drapeaux visuellement EN PLUS de nommer les pays.
- USA : "drapeau à bandes rouges/blanches horizontales avec carré bleu étoilé en haut à gauche"
- UK : "drapeau Union Jack — croix rouge et diagonales rouges/blanches sur fond bleu"
- Chine : "drapeau rouge uni avec étoile jaune grande et 4 petites étoiles jaunes"
- Canada : "drapeau blanc avec feuille d'érable rouge centrée, bandes rouges aux extrémités"
- Australie : "drapeau bleu avec Union Jack en haut à gauche et étoiles blanches Southern Cross"

**Cas d'origine** : Storyboard Beat 3 Or Africain, État E — v1 avait substitué des drapeaux africains. Regen avec description visuelle = correct au premier essai.

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
- Full regen v3 (prompt corrige) : ✅ tout fonctionne du premier coup

**Lecon** : Gemini ne sait pas modifier des cellules individuelles dans une grille structuree. Il regenere implicitement toute l'image et perd le layout d'origine. Pour les multi-panels :
1. **Identifier TOUS les problemes du storyboard d'abord** avant de toucher quoi que ce soit
2. **Reformuler le prompt complet** avec les corrections inline (ex: "Panel 5: boy GRIPPING trunk, ground CRACKING")
3. **Full regen direct** — economise 2-3 essais infructueux ($0.08-0.12 evites)

**Cout des 3 essais sur Sonjata Scene 5** : $0.12 brules avant le full regen qui a marche a $0.04.

**Triple formulation pour contraintes ambigues** : si un element doit etre absent, le formuler 3 fois sous angles differents.
Exemple : `"NO mask. NO object covering the face. The face area is simply absent."`

---

## Piege "enfant drift" en contexte transmission/apprentissage (2026-04-14)

**Observe sur Soundjata Acte VII** : prompt char ref "young griot adulte 25-32" a genere un enfant ~12 ans. Contexte narratif "griots qui transmettent l'epopee" a biaise Gemini vers le tropisme "enfant auditeur emerveille".

**Remedy validee** : forcer l'age adulte **3x** dans le prompt (debut/milieu/fin) + marqueurs anatomiques adultes explicites :
- Debut : "ADULT MAN aged 25-32 years old. NOT a child. NOT a teenager. NOT a boy."
- Corps : "Facial features of an adult male (25-32 years): visible adult jawline, defined cheekbones, adult brow, NOT rounded child cheeks"
- Fin : "CRITICAL: subject is a YOUNG ADULT MAN, not a child. Adult proportions, adult facial structure, adult body."

**Contextes a risque** : toute scene narrative de transmission, apprentissage, conte, famille, ecole. Ecrire juste "adult" ou un age ne suffit PAS — il faut expliciter l'ABSENCE d'enfance ET les marqueurs morphologiques adultes.

---

---

## Principe : correction chirurgicale AVANT regeneration

Ne pas regenerer depuis zero pour un defaut mineur.

---

## Capacites prouvees

- Supprimer bande parasite, restaurer couleur, ajouter trait facial, retourner personnage face/dos
- Densifier armee, corriger zone noire, etalonnage couleur, ajout handlers
- Edit pixel-perfect : `Part.from_bytes()` + "keep IDENTICAL except ONE change"
- Changements de perspective (vue sol -> vue aerienne)

---

## Regles modele

- **Toute generation / edition d'image** : `gemini-3.1-flash-image-preview` — generation ET edition chirurgicale dans le meme modele.
- **Analyse / breakdown JSON seulement** : `gemini-3.1-pro-preview` — jamais en output image.
- Config : `responseModalities: ["image", "text"]` — NE PAS mettre `responseMimeType`
- Instruction efficace : decrire EXACTEMENT ce qu'on change + lister ce qu'il ne faut PAS toucher

---

## Limites

- Pas de seed expose dans l'API publique, pas de style ID
- L'image source elle-meme EST le seed — la conserver = pouvoir regenerer des variantes coherentes
- Postures de personnages minuscules : resultat subtil. Laisser Kling animer via prompt.
- **Storyboard multi-panel : panel blanc aleatoire** — Gemini peut laisser un panel vide (carre blanc) au lieu de generer son contenu, meme si les autres panels sont corrects. Observe 2026-04-18 sur Sonjata scene 3. Correction : regenerer le storyboard complet (l'edition chirurgicale du panel seul echoue — applique R-STORYBOARD-CORR).
- **Composite (background + personnages associes culturellement) = drift de contexte** — Quand on fournit a Gemini un background Rhone automnal + Hannibal + elephant de guerre, Gemini genere une scene NEIGEUSE/GLACEE (les Alpes). L'association Hannibal + elephant = Alpes est plus forte que le contexte "background riviere" fourni. Observe 2026-05-05 : background vierge automnal + 4 PNG personnages → scene neige/glace totale. Fix : (a) decrire TRES explicitement la saison et le lieu dans le prompt, contre-carrer l'association culturelle ("this is NOT the Alps, this is the Rhone Valley in late autumn, NO snow, NO ice"), (b) alternatively, generer le composite en omettant Hannibal ou l'elephant et les superposer en CSS dans Remotion.

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

## Images de Reference — Gestion

### Nommage
```
public/assets/geoafrique/characters/[personnage]-[description]-REF.png
```
- Image REF = JAMAIS supprimer. Equivalent fonctionnel du seed.
- Pour nouvelle scene : passer la REF comme `Part.from_bytes()` dans Gemini + decrire la nouvelle pose.

---

## Style papercraft = ICONIQUE, PAS RESSEMBLANT (NON-NEGOTIABLE — 2026-04-29)

**Erreur structurelle a ne plus jamais reproduire :** donner des photos historiques realistes a Gemini pour creer un personnage papercraft.

**Le style papercraft GeoAfrique n'est PAS un style ressemblant. C'est un style iconique :**
- Yeux = **DOT EYES** (points noirs simples), pas des yeux dessines avec iris/pupille/blanc
- Visages quasi-interchangeables entre personnages — c'est delibere
- Differenciation par : coiffure, foulard, costume, accessoires, posture, contexte
- Personne n'attend qu'un personnage "ressemble" a la vraie personne historique (qui souvent n'a meme pas de portrait connu de toute facon)

**Quand on donne a Gemini des refs photo realistes** (drawing N&B detaille, vraies photos d'epoque), il essaie de respecter ces refs et **derive vers le style BD/illustration peinte** avec yeux realistes. C'est exactement le piege Sonjata-BD vs Sonjata-papercraft.

**Regle pour creer un nouveau personnage papercraft :**
1. **NE PAS** donner de photos historiques en input.
2. **NE DONNER QUE** des refs papercraft canoniques de la chaine (charsheets Abou Bakari/Moussa, scenes Sonjata avec personnages secondaires papercraft, etc.)
3. **Decrire la personne dans le prompt texte** uniquement par ses attributs distinctifs : coiffure, foulard, costume, age approximatif, posture canonique. PAS par "ressemblance au vrai visage".
4. **Accepter** que le visage ressemblera plus aux autres personnages papercraft de la chaine qu'a la vraie personne — c'est le BUT, c'est la coherence visuelle de la chaine.

**Validation :** Abou Bakari et Mansa Moussa ont ete crees ainsi sans refs photo et fonctionnent parfaitement comme personnages canoniques de la chaine.

**Cas d'echec valide 2026-04-29 :** charsheet Mariama Ba v1 (refs incluant drawing N&B + photos 1958/1970s) a produit du BD avec yeux realistes. v2 (memes refs ajout charsheets papercraft) a ameliore le style mais pas elimine le drift realiste a cause des photos historiques toujours dans les inputs.

---

## Review d'image — pieges d'analyse a eviter (2026-04-29)

**Erreurs frequentes en review automatique d'images papercraft GeoAfrique :**

1. **Sur-analyser les "yeux non-dots"** : un dot eye stylise garde une petite forme legere (pas un pixel mathematique). Sur-zoomer pixel par pixel fait inventer des defauts qui n'existent pas. Si l'oeil est domine par du noir avec contour fin, c'est un dot eye valide.
2. **Confondre "texte stylise suggerant l'ecriture" avec "texte lisible"** : des lignes dessinees qui suggerent une ecriture sans etre lisibles = bonne solution narrative. Ne pas le marquer comme defaut tant que le texte n'est pas lisible.
3. **Confondre "ombrage leger d'eclairage" avec "drift BD"** : un peu d'ombre directionnelle indique d'ou vient la lumiere. Utile pour coherence si la scene est animee (Seedance orbite 180° par exemple). Ce n'est pas un defaut, c'est une force.
4. **Surnommer "papercraft" trop strictement** : le style GeoAfrique est un hybride papercraft/illustration legere, pas du papercraft minimaliste strict. Le nom de convention ne doit pas pousser a refuser des images qui sont visuellement coherentes avec le reste de la chaine. Comparer a Abou Bakari/Moussa charsheets (qui ont aussi un peu d'ombrage) avant de marquer un defaut.

**Methode robuste de review :** poser la scene/image cote a cote avec une scene/charsheet existante de la chaine. Si elles passent ensemble dans une video sans dissonance, c'est valide. Le critere est la coherence inter-scenes, pas la conformite a un standard theorique.

---

## PNG transparency — Gemini retourne RGB sans alpha (2026-04-30)

**Bug confirme** : meme avec prompt explicite "TRANSPARENT BACKGROUND, no solid color, no white", Gemini 3.1 Flash Image preview retourne le PNG en **mode RGB** (pas RGBA) avec un fond gris uniforme `~RGB(212,212,212)` qui **ressemble a du transparent dans Read tool / viewers** (damier visible) mais n'a PAS de canal alpha.

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

**Ne JAMAIS faire confiance** au damier dans Read tool comme indicateur de transparence. Le viewer affiche le damier comme placeholder "image avec alpha potentielle" meme sur RGB pur.

---

## Walk cycle multi-frame — bug character drift (2026-04-30)

**Bug observe** : meme avec prompt explicite "EXACT same character + costume + colors, only walking pose changes", Gemini 3.1 Flash Image genere des frames qui :
1. **Bbox different** (ex: 755x855 vs 857x966 vs 1024x1024) -> redimensionnement = effet "pop carre" en boucle Remotion
2. **Character drift subtle** (proportions camel, position rider) -> "teleporting" plutot que walking

**Verdict** : pour Remotion vectoriel, **ne pas tenter walk cycle multi-frame Gemini**. Une seule frame + animation de transformation (hopping `Math.abs(sin(frame*0.4)) * 5`) suffit pour V1.

**Si vraiment besoin walk cycle :** considerer PixelLab (specialise sprite animation, frames coherent par design) OU generation manuelle Photoshop/Krita (4 frames customs alignees pixel-perfect) OU skip et garder frame statique + hopping.

**Cout perdu sur la lecon** : $0.14 (2 frames B+C generees Gemini, abandonnees).

---

## Gemini 3 Flash Preview — review video input ($0.005-0.01 par 16s) (2026-04-30)

**Capacite confirmee** : `gemini-3-flash-preview` accepte input video natif via File API (jusqu'a 1h@default, 3h@low res).

**Pricing** : $0.50/1M input tokens (~300 tokens/s video default) + $3/1M output. Pour 16s mini-render = ~$0.005.

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

**Brief structure qui marche** (validee Atlas Mansa Moussa V2 S3) : contexte projet + style target + tech stack + observations creator deja vues + mission exhaustive 10 sections (bugs critiques, sync audio, camera, palette, narrative clarity, what works, missing, priority fix list, production decision).

**ROI** : Gemini reperer 2 bugs additionnels que creator + Claude n'avaient pas vu en 18s analyse pour $0.005. Pattern a appliquer apres chaque mini-render avant production complete. Script reutilisable : `quebec-jacques-poc/scripts-atlas/review-s3-iter1-with-gemini.py`


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

**Anti-piège (validé 2026-05-28)** : ne pas forcer Pipeline A sur un sujet qui appelle Pipeline B. Symptôme = Gemini produit du photoréaliste alors que la vidéo source est cartoon, et le thumbnail "sort" de l'univers visuel du contenu.

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

The result should look like [référence éditoriale visée — ex: "high-quality editorial photograph for a YouTube documentary thumbnail"].
```

### Règles design Souverain pour briefs Gemini

1. **Toujours préciser le fond** comme "PRESERVE EXACTLY" : `dark navy blue background with subtle dot grid texture`
2. **Toujours préserver le texte typographique** ("PRESERVE EXACTLY: text in gold/cream serif on the right side")
3. **Toujours préserver les couleurs de drapeau** (signal identité culturelle subliminale)
4. **Pour IMPROVE matière** : utiliser vocabulaire photographique pro (brushed steel, specular highlights, tungsten filament, warm golden glow, brass screw base, etc.)
5. **Référence finale toujours éditoriale** ("editorial photograph" / "magazine cover" / "Bloomberg-style") — jamais "3D render" qui pousse vers le cartoon

### Validation 2026-05-28

- Sénégal pétrole baril photoréaliste : https://files.catbox.moe/z2u6nv.png (2 passes Gemini)
- Niger uranium ampoule tungstène : https://files.catbox.moe/tf3tu0.png (1 passe Gemini)
- Coût total : $0.12 pour 2 thumbnails niveau éditorial international

### Anti-patterns identifiés

- **Ne PAS** demander à Gemini de gérer le texte typographique — la qualité Remotion (Georgia serif rendu pixel-perfect) est supérieure et stable
- **Ne PAS** demander à Gemini de gérer la composition globale — laisser Remotion poser la grille de base
- **Ne PAS** demander à Gemini de générer "from scratch" sans base Remotion — perte de contrôle sur ratios narratifs et identité de marque
- **Ne PAS** itérer plus de 2 passes Gemini sur la même image — au-delà, perte de fidélité cumulative (Charte 2-4 max validée Thiaroye V5, mais pour thumbnails 1-2 suffit)

---

## Pipeline B — Création guidée par références (validé 2026-05-28 Sonjata)

### Quand l'utiliser

Pipeline B se déclenche quand le sujet a une **esthétique très singulière impossible à coder en SVG primitif** :
- Cartoon storybook (Sonjata, Disney-like, dessin animé chaud)
- Illustration papercraft (style Thiaroye, Cut-paper)
- Style pictural très spécifique (peinture, aquarelle, encre)
- Tout univers visuel défini par une vidéo existante qu'on veut imiter

**Symptôme d'erreur Pipeline A → B nécessaire** : Gemini produit du photoréaliste/cinématique alors que la vidéo source est cartoon, et le thumbnail "sort" de l'univers visuel du contenu (cas Sonjata avant correction).

### Architecture script

`scripts/tools/gemini-thumbnail-create-from-refs.py` :
- Input #1 : croquis SVG ultra-épuré rendu Remotion (1 PNG) — cadrage + texte préservé
- Input #2-N : frames de la vidéo cible (PNG) — esthétique de référence
- Input N+1 : brief textuel
- Output : 1 PNG final via Gemini 3.1 Flash Image multi-images

### Croquis SVG attendu (Pipeline B)

```tsx
// SonjataCroquisIcon.tsx — ultra-épuré
// - Zones de fond (rectangles colorés palette cible)
// - Zone vide centrale (Gemini la remplira)
// - Texte typographique déjà posé (préservé)
// - PAS de personnages SVG, PAS d'objets complexes
```

Le croquis sert juste à **fixer le cadrage** et **préserver le texte**. Le contenu visuel est entièrement créé par Gemini en imitant les références.

### Formule brief Pipeline B

```
You are creating a YouTube thumbnail by combining a layout draft with a target art style.

INPUT IMAGE 1 (CROQUIS — layout draft):
- [Décrire les zones du croquis : fond, couleurs, zone vide pour le contenu]
- The TEXT on [position] MUST BE PRESERVED EXACTLY — same position, font, color, size
- The [zone] is INTENTIONALLY EMPTY — this is where you must add the illustrated scene

INPUT IMAGES 2-N (STYLE REFERENCES — [source vidéo] frames):
- These show the EXACT visual style to reproduce
- Notice the characters: [détails clés du style : proportions, traits, couleurs, expressions]
- Notice the setting: [détails décor : objets, ambiance]
- Notice the color palette: [palette exacte des refs]
- Notice the art style: [style spécifique : flat 2D cartoon, papercraft, watercolor, etc.]

YOUR TASK:
Create a scene in the EMPTY area depicting:
- [Élément central : décrire personnage/objet principal]
- [Éléments secondaires : décor, contexte]
- All elements drawn in [style EXACT des refs]

ABSOLUTE RULES:
- PRESERVE the text on [position] exactly as in image 1
- PRESERVE the background colors [colors]
- DO NOT make it [anti-pattern : photoréaliste, dramatique, etc.]
- DO match the [style cible] of the reference frames EXACTLY

The result should look like a still frame from the same animated video as the references — same artist, same style.
```

### Règles design Pipeline B

1. **3 frames de référence variées** > 1 seule frame (gros plan + plan large + scène d'action)
2. **Frames récupérées via ffmpeg** à différents moments de la vidéo source (~5, ~25, ~120s typique)
3. **Toujours inclure dans le brief** : "DO NOT make it photorealistic" et "DO NOT make it dramatic cinematic"
4. **Référence éditoriale visée** = "still frame from the same animated video as the references"
5. **Le croquis SVG doit être propre** : pas d'annotations visibles dans le render final (showAnnotations={false})

### Validation 2026-05-28 Sonjata

- Tentative Pipeline A (silhouette dramatique SVG complexe + Gemini "Kirikou poster") → ❌ Hors esthétique V7
- Tentative Pipeline B (croquis épuré + 3 frames V7 + brief "flat cartoon storybook") → ✅ Parfait au 1er coup
- Lien final : https://files.catbox.moe/uthppp.png
- Coût : $0.04 (1 seule passe multi-images)

### Anti-patterns Pipeline B identifiés

- **Ne PAS** mettre un dessin SVG complexe dans le croquis — Gemini va essayer de "respecter" le SVG approximatif au lieu d'imiter les références
- **Ne PAS** oublier les anti-règles dans le brief ("DO NOT make it photorealistic") — sans ça, Gemini glisse vers son défaut (illustration éditoriale dramatique)
- **Ne PAS** mélanger styles dans les frames de référence — choisir 3 frames du même univers visuel cohérent
- **Ne PAS** demander à Gemini de "créer un nouveau personnage" — préciser "in the EXACT style of the characters in references 2-N"

### Coûts comparatifs Pipeline A vs B

| Pipeline | Coût typique | Itérations moyennes | Réussite 1er coup |
|----------|--------------|---------------------|-------------------|
| A (edit chirurgical) | $0.04-0.08 | 1-2 | 80% |
| B (création guidée multi-refs) | $0.04 | 1 | 95% (quand bien briefé) |

Pipeline B est **plus fiable** que A quand on dispose d'images de référence de la vidéo source.

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

**Langue :** Ajouter SYSTÉMATIQUEMENT dans chaque brief : "Tout le texte en français uniquement. Zéro mot anglais autorisé." — Gemini génère parfois de l'anglais sans cette instruction.

### Règle géographie (NON-NEGOTIABLE)

Jamais demander à Gemini de **dessiner** une carte — il hallucine les frontières. Toujours injecter une frame Mapbox extraite de nos vidéos comme référence image.

### Préparation des frames de référence

Rogner les 18% inférieurs pour éliminer les sous-titres brûlés :
```python
cropped = img.crop((0, 0, w, int(h * 0.82)))
```

### Slides avec graphiques (type barres comparatives)

**Option A (overlay fort 60-65%)** : les textes structurels restent visibles en filigrane — NON satisfaisant.
**Option B (génération libre)** : Gemini génère un visuel original (balance, lingots, icône) — RECOMMANDÉ.

Règle : si le graphique a des textes intégrés dans sa structure (labels de barres, titres), utiliser Option B.

### Structure slides comparatives (type Rockefeller vs Mansa Moussa)

Toujours structurer ainsi pour éviter l'ambiguïté :
1. Référence connue + chiffre ("ROCKEFELLER EN 1913 / $400 Mds")
2. Label explicatif ("La fortune la plus connue de l'histoire.")
3. Ligne séparatrice gold
4. La révélation ("Mansa Moussa la dépassait. De loin.")

### CTA universelle (slide 8 de tous les carousels)

"La vidéo complète est sur notre compte. / Cherche @koraetcartes"

**Pourquoi pas YouTube :** Instagram pénalise algorithmiquement les posts pointant vers des liens externes. Pointer vers le compte Instagram lui-même = zéro pénalité.

### Artefacts à surveiller

- **Bérets/uniformes modifiés** : Gemini peut changer des détails visuels (couleur béret, insignes) même avec instruction de fidélité. Inspecter systématiquement les slides avec personnages historiques.
- **Correction chirurgicale i2i** : envoyer la slide + frame originale + instruction précise de correction.
- **Double rangée de barres** : préciser "UNE SEULE rangée de barres" — Gemini peut générer 2 rangées.
- **Chiffres sous les barres** : préciser "PAS de chiffres sous les barres".

### ⭐ Portraits de PERSONNES RÉELLES (i2i depuis photo) — recette validée (2026-06-14, War-Map P4)

Pour des portraits stylisés RESSEMBLANTS de figures réelles (dirigeants, personnalités) :
1. **Source = Wikimedia Commons / Wikipédia** (licence libre). Récupérer l'URL directe `upload.wikimedia.org/.../FICHIER.jpg`
   (retirer `/thumb/` et `/250px-...` pour la full-res) via WebFetch sur la page infobox. PAS Getty (droits/hotlink).
2. **`gemini-i2i.py --ref photo.jpg`** + prompt qui dit explicitement "KEEP the exact same face and likeness, clearly
   recognizable" + le style cible (gravure/encre parchemin, sépia, etc.). L'i2i garde le visage, change le rendu.
3. ⛔ **PIÈGE MAJEUR (vérifié) : Gemini HALLUCINE du texte sur les portraits** (cartouche "médaillon" avec un NOM
   INVENTÉ — ex P4 : a écrit "CAPTAIN ALPHA DIALLO · WESTERN FRONT 1918" sur un portrait, nom faux + date absurde).
   → Prompt anti-texte STRICT obligatoire : "ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO NAME, NO BANNER, NO FRAME,
   NO CIRCLE BORDER, NO MEDALLION, NO DECORATION. Just the bust on plain transparent background." Le nom se met
   ENSUITE dans une plaque qu'on CONTRÔLE (Remotion), jamais dans l'image générée.
4. **Vérifier la ressemblance** (Read l'image) avant validation. Le i2i depuis photo > génération de zéro (qui donne
   un visage générique "crédible mais ressemble à personne"). Décision éditoriale : stylisé OK (pas deepfake photo-réaliste).
5. ⛔ **PIÈGE FOND OPAQUE (vérifié P4 2026-06-14)** : un i2i Gemini "fond transparent" rend souvent un FOND OPAQUE
   (gris/blanc/parchemin), PAS un vrai alpha. Vu dans un chip() cercle, ce fond opaque crée un "carré/clipping"
   visible (le fond du portrait ≠ couleur du chip). Symptôme : "ça a l'air bruité/pas net, je vois un carré derrière".
   → VÉRIFIER l'alpha : `Image.open(p).convert('RGBA')` + lire les coins (si alpha=255 = opaque = à détourer).
   → DÉTOURER avec **Recraft `remove_background`** (MCP) → vrai alpha 0 propre, comme les sprites réfugiés. Le faire
   SYSTÉMATIQUEMENT pour tout portrait i2i destiné à un chip/cercle. (Le grain de gravure i2i reste, assumé comme style.)

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
