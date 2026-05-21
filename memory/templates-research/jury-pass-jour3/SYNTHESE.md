# Synthèse Jury LLM Jour 3 — 3 modèles

> Kimi K2.5 + GPT-4o + Gemini 2.5 Pro (via OpenRouter pour Gemini, base64 inline pour les 3)
> Coût total estimé : ~$0.04 (3 jurys × 8 images PNG ~150KB chacune)
> Durée totale : 91 secondes en parallèle

## Tableau de convergence — Verdicts

| Template | Kimi | GPT-4o | Gemini | **Consensus** |
|---|---|---|---|---|
| SmallMultiplesGrid | TWEAK | TWEAK | TWEAK | ✅ **TWEAK** (3/3) |
| KraftCard Option 1 (Cadre collection) | KEEP | TWEAK | TWEAK | ⚖️ **TWEAK** (2/3) |
| KraftCard Option 2 (Magazine cover) | REWORK | REWORK | REWORK | 🔴 **REWORK** (3/3) |
| KraftCard Option 3 (Fond narratif) | non noté | KEEP | KEEP | ✅ **KEEP** (2/2) |
| AtlasRealiste3D | non noté précisément | TWEAK | REWORK | 🔴 **REWORK Phase A+B, KEEP Phase C** |
| Direction prioritaire (Q transversale) | non répondu | C — Document classifié | C — Document classifié | ✅ **Direction C** (2/2) |

---

## Plan d'action consolidé

### CHANTIER 1 — SmallMultiplesGrid (TWEAK, 3 corrections convergentes)

| Source | Correction |
|---|---|
| **Kimi + Gemini** | Augmenter contraste/épaisseur des courbes (Kimi : stroke 1.5px → +1pt) |
| **Kimi** | Ajouter une micro-ligne source en bas de chaque cellule ("Banque Mondiale 2023") — active la promesse "sources visibles" Souverain |
| **Gemini** | Aligner verticalement le centre des portraits avec le centre du nom du pays |
| **Gemini** | Standardiser position des annotations (toujours top-right du point concerné, pas mid-right) |
| **Kimi** | Ajouter un point doré sur l'annotation clé du chart (anchor visuel mobile) |

**Décision** : variante Cream OU Kraft ? 
- Kimi : "abandonner Cream (trop The Economist), garder Kraft"
- Gemini : "Cream est premium, à préserver"
- → **Garder les 2 variantes** (cas d'usage différents : Cream = pédagogique calme, Kraft = sujets ressources/extraction)

### CHANTIER 2 — KraftCard

**Option 1 (Cadre collection)** — TWEAK
- Augmenter la taille de la citation et de sa source (2 pt min)
- Intégrer le bloc citation dans le fond kraft (pas de boîte blanche détachée)
- Rendre "✦ SOUVERAIN ✦" plus subtil OU le supprimer
- Verdict Aziz à confirmer : garder le format cadre ou pivot vers "fiche données" comme proposé en réflexion design ?

**Option 2 (Magazine cover)** — REWORK (consensus 3/3)
- Le fond drapeau flou ne fonctionne pas (Gemini : "template Canva générique", Kimi : "blur 50% trop fort", GPT : "distrait de l'info")
- Recette consolidée : remplacer fond flou par **photo contextuelle haute granularité** (mine, foule, paysage) ou **texture éditoriale** (Direction C : papier kraft tampons)
- C'est précisément la recommandation Aziz "brutalisme éditorial photo plein cadre"

**Option 3 (Fond narratif)** — KEEP (Gemini + GPT)
- C'est l'option la plus solide
- Tweaks mineurs : sublabel en or, tester citation sans fond (juste liseré)
- À promouvoir comme template signature pour citations incarnées

### CHANTIER 3 — AtlasRealiste3D (REWORK consensus)

**Décision unanime** : abandonner Phase A et Phase B (overlay monde gris empilé sur Sahara naturellement sombre = inutilisable)

**Action** :
1. Supprimer `addCountryMask` avec overlay monde du template
2. Garder uniquement le pattern Phase C : satellite-v9 + hillshade natif + pays focus en or
3. Ajouter vignetage subtil sur les bords (Gemini)
4. C'est le **vrai look Wendover/RealLifeLore** que tu cherchais

### CHANTIER 4 — Direction prioritaire (Q transversale)

**Consensus 2/2 (GPT + Gemini) : Direction C — Document classifié / archive de terrain**

Raison Gemini : "incarne le mieux les sujets du canal (mémoires, archives, sources), potentiel pour identité unique signifiante au-delà de la seule esthétique."

**Risque flagged** : "tomber dans le cliché dossier d'espionnage / complotisme si exécution manque de sobriété."

**Recette GPT** :
- Intégrer éléments visuels d'archives pour crédibilité
- Palette kraft pour cohérence
- Surlignages + tampons pour attirer l'attention sans surcharger

---

## Décisions opérationnelles proposées pour Aziz

1. **SmallMultiplesGrid V4** — appliquer les 5 tweaks convergents (~30 min coding, sans nouveau jury)
2. **KraftCard cleanup** — supprimer Option 2 du showcase (REWORK consensus), garder Option 1 + 3 améliorées
3. **AtlasRealiste3D V3** — refactor du composant pour exposer uniquement le pattern Phase C ; supprimer overlay monde de la lib
4. **Prochain template** — coder `BrutalHeadline` (déjà discuté) en intégrant la Direction C : photo plein cadre + tampon "VÉRIFIÉ" + papier kraft de fond ; jury de validation après POC

## Méta — Qualité du jury

- **Kimi** : verdicts les plus précis et actionnables (recettes chiffrées : "stroke +1.5px", "boîte +15%"). MAIS coupé à 1776 chars (max_tokens 4000 atteint sur seulement 3 templates → il manque verdicts Option 3 et Atlas3D et Q transversale). À relancer avec `max_tokens: 8000` la prochaine fois.
- **GPT-4o** : couverture complète (tous les templates + Q transversale) mais corrections génériques ("améliorer contraste", "uniformiser"). Utile pour confirmer consensus, peu pour recettes.
- **Gemini 2.5 Pro** : meilleur équilibre couverture + précision. Verdicts argumentés ("REWORK car overlay empilé sur Sahara naturellement noir"). À privilégier comme jury principal sur les futurs passes.

**Reco méthodologique pour Jour 4** : pour les futurs jurys, doubler le `max_tokens` de Kimi à 8000 et garder le trio en parallèle. Coût marginal (~$0.04 par run) largement justifié.
