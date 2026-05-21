# Mockups Gemini — Blueprints de design des templates

> Source de vérité design pour chaque layout Souverain.
> Ces images sont les **références originales** générées par `gemini-3.1-flash-image-preview` avant le codage.

## Pourquoi ce dossier existe

- Référence visuelle immédiate : savoir à quoi ressemblait l'intent design original
- Re-diffuser vers `gemini-3.1-pro-preview` pour demander des améliorations futures
- Workflow diff : mockup vs render actuel pour corriger un template
- Ne jamais recoder from scratch sans consulter le mockup source

## Workflow de génération (pour référence future)

1. Générer le mockup : `gemini-3.1-flash-image-preview` + `responseModalities: ["image", "text"]`
2. Sauvegarder ici sous `Layout-<NomTemplate>-mockup-gemini.png`
3. Faire le breakdown JSON : `gemini-3.1-pro-preview` (analyse vision du mockup)
4. Coder le composant React/Remotion
5. Diff render vs mockup : `gemini-3.1-pro-preview` (image 1 = mockup, image 2 = render)

## Catalogue

| Template | Fichier local | URL catbox (permanente) | Notes |
|---|---|---|---|
| **BarRace** | `Layout-BarRace-mockup-gemini.png` | https://files.catbox.moe/6hq9zo.png | Version finale validée — fond dark + labels crème |
| **PulseNumber** | `Layout-PulseNumber-mockup-gemini.png` | https://files.catbox.moe/qloo3o.png | Chiffre géant heartbeat |
| **StackedBars** | `Layout-StackedBars-mockup-gemini.png` | https://files.catbox.moe/bciqg8.png | 4 colonnes verticales gold |
| **TypeReveal v1** | `Layout-TypeReveal-v1-mockup-gemini.png` | https://files.catbox.moe/sofpfu.png | Premier concept (rejeté — layout multi-zones) |
| **TypeReveal v2** | `Layout-TypeReveal-v2-mockup-gemini.png` | https://files.catbox.moe/rkjgrh.png | Concept validé — phrase inline centrée |
| **ScaleShock** | `Layout-ScaleShock-mockup-gemini.png` | https://files.catbox.moe/koode6.png | Deux cercles proportionnels — choc d'échelle |
| **Timeline** | `Layout-Timeline-mockup-gemini.png` | https://files.catbox.moe/1s0hhz.png | Chronologie animée noeuds séquentiels |
| **NetworkGraph** | `Layout-NetworkGraph-mockup-gemini.png` | https://files.catbox.moe/v2luef.png | Réseau connexions — noeuds + arcs + icônes |
| **IconGrid** | `Layout-IconGrid-mockup-gemini.png` | https://files.catbox.moe/1kisbo.png | Grille 2×3 icônes + stats + 1 mot |
| **IconStat** | `Layout-IconStat-mockup-gemini.png` | https://files.catbox.moe/ammoun.png | Icône géante + chiffre central |
| **ProcessFlow** | `Layout-ProcessFlow-mockup-gemini.png` | https://files.catbox.moe/r05h5v.png | Flux vertical étapes + flèches |

## Templates sans mockup (sessions antérieures — non récupérables)

- `Layout-FillScreen` — mockup perdu (généré session précédente)
- `Layout-OdometerFlip` — mockup perdu (redesign slot machine en session)
- `Layout-RadarPing` — mockup perdu (généré session précédente)

> **Règle pour les prochaines sessions** : toujours copier le mockup dans ce dossier IMMÉDIATEMENT après génération, avant de commencer le breakdown.

## Utilisation pour re-diffuser vers Gemini

```python
# Charger le mockup source pour demander des améliorations
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

with open("public/_shared/previews/mockups-gemini/Layout-BarRace-mockup-gemini.png", "rb") as f:
    mockup = types.Part.from_bytes(data=f.read(), mime_type="image/png")

with open("/tmp/review_frames/BarRace-current.png", "rb") as f:
    current = types.Part.from_bytes(data=f.read(), mime_type="image/png")

response = client.models.generate_content(
    model="gemini-3.1-pro-preview",
    contents=["Compare ces deux versions et dis-moi comment améliorer [aspect spécifique]", mockup, current]
)
```
