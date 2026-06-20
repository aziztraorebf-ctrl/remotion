# PALETTE DE BACKGROUNDS — identité visuelle (palette FERMÉE)

> Posée 2026-06-19 (test storyboard beat 90% RDC cobalt). But : une identité visuelle reconnaissable, et
> empêcher la dérive « chaque génération improvise son fond ». L'agent CHOISIT dans cette palette selon le
> registre — il n'invente pas un fond. Adaptable au fil du temps, mais on part TOUJOURS d'ici.

## Les 5 backgrounds validés (Aziz, 2026-06-19)

| Ref (image) | Registre / quand l'utiliser |
|---|---|
| `bg-parchemin-clair.png` ⭐ | **Éditorial/documentaire premium** (le « safe efficace » type Vox/Johnny Harris). Le DÉFAUT pour la data-viz sérieuse. Crème + quadrillage ocre fin. Le plus robuste à générer (zéro parasite). |
| `bg-parchemin-kraft.png` | Variante chaude/sombre du parchemin (kraft, ambiance candle-lit). Pour un ton plus grave. ⚠️ plus sujet au texte parasite (fond chargé). |
| `bg-dots-navy.png` ⭐ | **Data-lab moderne** : navy + pointillés subtils + halo. Pour chiffres-chocs tech/marché. Très propre. |
| `bg-uni-navy.png` | Navy uni `#16213a`, sobre, sans grille. Neutre, polyvalent. = le fond carte Mapbox standard. |
| `bg-senegal-navy-grille-or-REEL.jpg` ⭐ | Le VRAI fond du hook Sénégal (extrait de la vidéo finale). Navy profond + quadrillage DORÉ. Notre identité prouvée. ⚠️ NB : ce qu'on appelait « parchemin Sénégal » est en fait CE navy+grille-or, pas un parchemin crème. |

## Comment s'en servir dans un storyboard dual-gen

On passe le background voulu comme **référence + description** au générateur. Deux modèles, deux biais
(GARDER LES DEUX — deux directions à comparer valent mieux qu'une, même imparfaite) :

- **Gemini 3.1 Flash Image** : RESPECTE le fond imposé même décrit en milieu de prompt. → l'outil de choix
  quand on veut CONTRÔLER le background (notre identité). Tend un peu plat sur le sujet.
- **GPT-image-1 (fal)** : retombe sur SON fond sombre par défaut SAUF si le background est mis **en PREMIÈRE
  phrase** et formulé **négativement** (« A LIGHT CREAM PARCHMENT … NOT dark, NOT navy, NOT black »). Ainsi
  forcé, il fait le parchemin (prouvé 2026-06-19). Meilleur relief/modelé sur le sujet (le chiffre).

## Règles apprises (du test)
1. **Fonds CLAIRS et ÉPURÉS = génération fiable** (parchemin clair, dots navy = zéro parasite). Fonds
   SOMBRES/chargés = le modèle hallucine du texte parasite dans le vide (kraft, fonds très denses). Préférer
   clair quand on peut ; sur fond sombre, prompt court et « no other text » insistant.
2. **Prompt PROPRE obligatoire** : ne jamais laisser fuiter des fragments d'un autre brief (codes couleur,
   « cost/bad », labels d'un autre épisode) → le modèle les dessine. Décrire SEULEMENT ce qu'on veut à l'écran.
3. **Toujours les 2 modèles**, jamais se limiter à un selon le registre : on compare deux intentions de direction.

## Dette / à améliorer
- Ces refs ont le sujet « 90% » dessus (ce sont des storyboards). Pour des refs de FOND pures, regénérer les
  fonds SANS sujet. Tels quels, ils servent déjà bien de ref de registre.
- Élargir avec d'autres teintes/variantes validées au fil des prods (rester une palette FERMÉE, pas un fourre-tout).
