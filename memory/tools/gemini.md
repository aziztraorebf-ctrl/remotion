# Gemini — Generation & Correction d'Images
> Edition chirurgicale, character sheets, expressions, Nano Banana, cartes geo.
> Mise a jour : 2026-04-25

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

## MODELE UNIQUE — ZERO EXCEPTION (NON-NEGOTIABLE)

**Le SEUL modele Gemini a utiliser dans tout le projet est : `gemini-3.1-flash-image-preview`**

- Generation d'images : `gemini-3.1-flash-image-preview`
- Edition chirurgicale : `gemini-3.1-flash-image-preview`
- Character sheets : `gemini-3.1-flash-image-preview`
- Storyboards : `gemini-3.1-flash-image-preview`
- Toute operation image : `gemini-3.1-flash-image-preview`

**INTERDIT** : `gemini-2.0-flash-exp`, `gemini-2.0-flash`, `gemini-3-pro-image-preview`, `nano-banana-pro-preview`, ou tout autre modele.

**Pourquoi** : les autres modeles sont soit deprecies (2.0-flash-exp = 404), soit trop conservateurs (3-pro refuse de modifier), soit redondants. 3.1-flash-image-preview fait TOUT ce dont on a besoin. Erreur repetee 3+ fois en production — cette regle met fin au probleme.

---

## Principe : correction chirurgicale AVANT regeneration

Ne pas regenerer depuis zero pour un defaut mineur.

---

## Modeles disponibles (avril 2026)

| Modele | Usage |
|--------|-------|
| `gemini-3.1-flash-image-preview` | Generation d'images, character sheets, expressions. Rapide. = "Nano Banana 2" |
| `gemini-3-pro-image-preview` | **Edition chirurgicale OBLIGATOIRE**. Respecte la composition source. |
| `nano-banana-pro-preview` | Plus cher, qualite similaire a 3.1 Flash |
| `imagen-4.0-generate-001` | Generation haute qualite (non teste) |

---

## Capacites prouvees

- Supprimer bande parasite, restaurer couleur, ajouter trait facial, retourner personnage face/dos
- Densifier armee, corriger zone noire, etalonnage couleur, ajout handlers
- Edit pixel-perfect : `Part.from_bytes()` + "keep IDENTICAL except ONE change"
- Changements de perspective (vue sol -> vue aerienne)

---

## Regles modele (corrige 2026-04-13)

- **Edition chirurgicale / modifier un detail** : `gemini-3.1-flash-image-preview` — c'est Flash qu'on utilise pour garder la composition et modifier un detail. Accepte une image source en input + prompt decrivant la modification.
- **Generation pure / haute qualite sans source** : `gemini-3-pro-image-preview` - plus cher, sans source d'origine. Tendance a etre tres conservateur quand une source est fournie (refuse parfois de modifier). Ne pas utiliser pour edition chirurgicale.
- Config : `responseModalities: ["image", "text"]` — NE PAS mettre `responseMimeType`
- Instruction efficace : decrire EXACTEMENT ce qu'on change + lister ce qu'il ne faut PAS toucher
- Validation 2026-04-13 : tentative d'editer panels 4-5 d'un storyboard avec `gemini-3-pro-image-preview` a produit une image quasi-identique a la source (refus de modifier). Passage a `gemini-3.1-flash-image-preview` resout.

---

## Limites

- Pas de seed expose dans l'API publique, pas de style ID
- L'image source elle-meme EST le seed — la conserver = pouvoir regenerer des variantes coherentes
- Postures de personnages minuscules : resultat subtil. Laisser Kling animer via prompt.
- **Storyboard multi-panel : panel blanc aleatoire** — Gemini peut laisser un panel vide (carre blanc) au lieu de generer son contenu, meme si les autres panels sont corrects. Observe 2026-04-18 sur Sonjata scene 3. Correction : regenerer le storyboard complet (l'edition chirurgicale du panel seul echoue — applique R-STORYBOARD-CORR).

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
