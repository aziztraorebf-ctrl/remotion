# Gemini — Couche critique (modèles, SDK, gotchas universels)
> Lire EN PREMIER. Pipelines spécialisés (thumbnails, carousel, portraits, Nano Banana, walk cycle) : `memory/tools/gemini-pipelines.md`.
> Mise à jour : 2026-06-25

---

## ⚠️ MODELES OBLIGATOIRES — REGLES DEFINITIVES (NON-NEGOTIABLE)

**DEUX modeles seulement. Zero autre modele. Zero exception.**

| Usage | Modele EXACT |
|-------|-------------|
| Toute generation d'image (mockup, storyboard, character sheet, carte, asset) | `gemini-3.1-flash-image-preview` |
| Analyse vision uniquement — breakdown JSON, diff visuel, hex codes (JAMAIS d'image en output) | `gemini-3.1-pro-preview` |

**Nouveau modèle disponible (2026-05-19) :**
`gemini-3.5-flash` — texte/agentic/coding, lancé à Google I/O. Capacités vision à confirmer. Candidat potentiel pour remplacer `gemini-3.1-pro-preview` sur les breakdowns JSON, mais NON validé encore pour ce projet.

**INTERDIT ABSOLU (entrainerait 404 ou mauvais resultat) :**
Toute version Gemini antérieure à 3.1 pour image/vision ; les variantes `pro-image`, `imagen`, `nano-banana` ; les vieux modèles listés dans CLAUDE.md.

**Pourquoi :** 3.1-flash-image-preview = seul modele qui genere ET edite des images. 3.1-pro-preview = meilleure vision pour analyse JSON (hex codes exacts, coordonnees SVG precises, 85-90% fidelite). Imagen = ne comprend pas les layouts UI complexes — NE PAS UTILISER pour mockups Remotion.

**Cette regle a ete violee 4+ fois. Elle est definitive.**

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

**Config generation d'image (ANCIENNE syntaxe — NE PAS UTILISER) :**
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
- OBLIGATOIRE : descriptions photographiques concrètes : "close-up aged paper texture", "dark brushed concrete surface"
- COULEURS : jamais #000000 ni "noir pur" — utiliser #0d1420, #12192a, #1a1f2e (désaturés sombres)

---

## GOTCHA — visual_review.py / pre-presentation-review.sh = faux positifs sur registre non-War-Map (2026-06-29)
Le hook gate `pre-presentation-review.sh` + `visual_review.py` (Gemini) juge implicitement contre la charte
War-Map (navy/gold) et produit des FAUX POSITIFS récurrents sur d'autres registres — prouvé sur le registre
encre/parchemin (Cacao→Chocolat) où Gemini pénalisait l'épure encre comme « manque de contraste/couleur » et
réclamait des éléments retirés volontairement (soleil/dunes/storyboard pré-nettoyage). Scores 3,5–5,5/REBUILD à répétition.
- Rappel : Gemini = SIGNAL, jamais JUGE. Sur un registre hors War-Map, attendre des scores bas STRUCTURELS.
- Procédure : override le verdict quand il vise le registre lui-même (pas un défaut réel), TRACER l'override
  (fichier `<render>.review-override.md` adjacent + 1 ligne STATUS projet). Le jugement d'Aziz prime.

---

## Gotcha drapeaux nationaux en contexte "Afrique / souveraineté" (2026-05-06)

Quand on demande des drapeaux de pays occidentaux dans un contexte narratif lié à l'Afrique, Gemini substitue des drapeaux africains ou régionaux même si les pays sont explicitement nommés.

**Solution validée** : décrire les drapeaux visuellement EN PLUS de nommer les pays.
- USA : "drapeau à bandes rouges/blanches horizontales avec carré bleu étoilé en haut à gauche"
- UK : "drapeau Union Jack — croix rouge et diagonales rouges/blanches sur fond bleu"
- Chine : "drapeau rouge uni avec étoile jaune grande et 4 petites étoiles jaunes"
- Canada : "drapeau blanc avec feuille d'érable rouge centrée, bandes rouges aux extrémités"

---

## Piege "enfant drift" en contexte transmission/apprentissage (2026-04-14)

**Observe sur Soundjata Acte VII** : prompt "young griot adulte 25-32" a genere un enfant ~12 ans. Le contexte narratif "transmission/apprentissage" biaise vers "enfant auditeur emerveille".

**Remedy validee** : forcer l'age adulte **3x** dans le prompt + marqueurs anatomiques adultes explicites :
- Debut : "ADULT MAN aged 25-32 years old. NOT a child. NOT a teenager. NOT a boy."
- Corps : "Facial features of an adult male (25-32 years): visible adult jawline, defined cheekbones, adult brow"
- Fin : "CRITICAL: subject is a YOUNG ADULT MAN, not a child. Adult proportions."

**Contextes a risque** : toute scene narrative de transmission, apprentissage, conte, famille, ecole.

---

## Composite — drift de contexte (2026-05-05)

**Observe** : background Rhone automnal + Hannibal + elephant de guerre → Gemini genere une scene NEIGEUSE (les Alpes). L'association culturelle "Hannibal + elephant = Alpes" est plus forte que le contexte fourni.

**Fix** : (a) décrire TRES explicitement la saison et le lieu + contre-carrer l'association ("this is NOT the Alps, this is the Rhone Valley in late autumn, NO snow") ; (b) generer le composite sans l'element porteur de l'association culturelle et le superposer en CSS dans Remotion.

---

## Images de Reference — Gestion

### Nommage
```
public/assets/geoafrique/characters/[personnage]-[description]-REF.png
```
- Image REF = JAMAIS supprimer. Equivalent fonctionnel du seed.
- Pour nouvelle scene : passer la REF comme `Part.from_bytes()` dans Gemini + decrire la nouvelle pose.

---

## Regles modele (rappel)

- **Toute generation / edition d'image** : `gemini-3.1-flash-image-preview`
- **Analyse / breakdown JSON seulement** : `gemini-3.1-pro-preview` — jamais en output image
- Config : `response_modalities: ['IMAGE', 'TEXT']` via `types.GenerateContentConfig`
- Instruction efficace : decrire EXACTEMENT ce qu'on change + lister ce qu'il ne faut PAS toucher

---

## Limites

- Pas de seed expose dans l'API publique, pas de style ID
- L'image source elle-meme EST le seed — la conserver = pouvoir regenerer des variantes coherentes
- Postures de personnages minuscules : resultat subtil. Laisser Kling animer via prompt.
- **Storyboard multi-panel : panel blanc aleatoire** — Gemini peut laisser un panel vide. Correction : regenerer le storyboard complet (l'edition chirurgicale du panel seul echoue).
