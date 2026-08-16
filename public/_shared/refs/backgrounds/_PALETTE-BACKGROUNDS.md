# PALETTE DE BACKGROUNDS — identité visuelle (palette FERMÉE)

> Posée 2026-06-19 (test storyboard beat 90% RDC cobalt). But : une identité visuelle reconnaissable, et
> empêcher la dérive « chaque génération improvise son fond ». L'agent CHOISIT dans cette palette selon le
> registre — il n'invente pas un fond. Adaptable au fil du temps, mais on part TOUJOURS d'ici.
>
> ⭐⭐ **SOURCE UNIQUE DU FOND — cette palette PRIME (tranché Aziz 2026-06-20).** En cas de doute ou de
> contradiction avec une autre doctrine (ex : l'ancienne signature « navy/gold » du `SOUVERAIN-REMOTION-PLAYBOOK`),
> **c'est CETTE liste qui décide, pas le playbook.** Ne PAS « choisir un registre » dans l'abstrait : se fier
> UNIQUEMENT aux fonds validés ci-dessous. **PARCHEMIN d'abord** (style V3 Sénégal, préféré d'Aziz) ; navy/gold
> seulement si le parchemin ne colle vraiment pas. Si aucun fond validé ne convient → le signaler, ne pas inventer.

## Les 4 backgrounds validés (Aziz, 2026-06-19) — fonds PURS (sans sujet ni texte)

| Ref (image) | Registre / quand l'utiliser |
|---|---|
| `bg-parchemin-clair.png` ⭐ | **Éditorial/documentaire premium** (le « safe efficace » type Vox/Johnny Harris). Le DÉFAUT pour la data-viz sérieuse. Crème + quadrillage ocre fin. Le plus robuste à générer. |
| `bg-parchemin-kraft.png` | Variante chaude/sombre du parchemin (kraft, ambiance candle-lit). Pour un ton plus grave. |
| `bg-dots-navy.png` ⭐ | **Data-lab moderne** : navy + pointillés subtils + halo. Pour chiffres-chocs tech/marché. |
| `bg-uni-navy.png` | Navy uni `#16213a`, sobre, sans grille. Neutre, polyvalent. = le fond carte Mapbox standard. |

> Ce sont des fonds PURS (régénérés 2026-06-19, aucun chiffre/texte) — prêts à servir de ref de background.
> Clé pour en regénérer un propre : prompt « EMPTY background texture only … NO text, NO numbers, NO subject ».

## ⭐ CE QU'UN BON STORYBOARD DOIT MONTRER (règle posée Aziz 2026-06-19)

Un storyboard n'est PAS une vignette figée — c'est la **TRAJECTOIRE de la scène dans le temps**. Deux faces
d'un même principe, indissociables :

1. **Montrer l'ÉVOLUTION en états** (DÉBUT → MILIEU → FIN, ou N panneaux). Chaque panneau = la scène à un
   instant, pour qu'on lise l'arc dramatique d'un coup d'œil. (Le storyboard Gemini 3-panneaux du beat 90% = la réf.)
2. **Chaque état n'AJOUTE que l'élément nouveau, épuré au strict nécessaire.** On ne répète pas ce qui est déjà
   à l'écran, on n'empile pas d'écritures décoratives. **Texte SEULEMENT en cas de vraie nécessité** — la voix
   off dit déjà beaucoup (épure : [[CONTINUITE-SCENE-INTENTION-DABORD]], étape « retirer ce que la voix dit »).
   Redondance et texte inutile = l'ennemi du premium.

Concrètement, le storyboard montre : état 1 (le 90% entre) → état 2 (le label se greffe) → état 3 (le climax
rouge), chaque incrément minimal. Ça donne au code la chorégraphie exacte, pas juste une image cible.

⚠️ Biais à connaître (test 2026-06-19) : Gemini produit bien le multi-panneaux ; GPT-image tend à ne rendre
QU'UN panneau quand il doit aussi combattre son biais de fond → pour un storyboard d'ÉVOLUTION, Gemini est l'outil.

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

---

## ⭐⭐ FOND DÉGRADÉ VIVANT — ajout 2026-08-15 (le fond n'est plus forcément un aplat)

> ⛔ **Divergence corrigée** : cette palette ne proposait que des fonds PLATS ou texturés statiques, alors
> que la production est déjà passée au dégradé (Gazoduc Acte 4, palette `PAL_GPT` adoptée le 2026-08-14).
> Sans cette entrée, les futurs storyboards/agents continuaient de produire des aplats.

**Règle générale** : un fond de scène premium est un **dégradé qui vit lentement**, pas un aplat.
L'aplat reste acceptable sous une carte Mapbox pleine page (le fond n'y est presque pas visible) et
pour un registre volontairement graphique/plat. Partout ailleurs, préférer le dégradé.

**Entrée n°5 — `navy-degrade-radial`** (valeurs mesurées, `PAL_GPT` Gazoduc Acte 4) :
- haut `#0d1f38` → bas `#050c1a`, en **dégradé RADIAL** (pas linéaire — le radial crée un centre de
  lumière, donc un point de focalisation)
- option **halos dérivants** : 1-2 taches de lumière très diffuses qui se déplacent LENTEMENT
  (frame-driven, `interpolate` sur toute la durée du beat, jamais une boucle rapide)

**Pourquoi** (benchmark 3 références Fiverr, 2026-08-15) : les 3 vidéos analysées utilisent toutes un
fond TRAITÉ. Tugger (teaser SaaS) construit sa scène entière sur un dégradé sombre + halos, quasi sans
objet — **la lumière EST le décor**. C'est le détail le moins coûteux de toute l'analyse (aucune brique
à coder, un `radialGradient` + un mouvement lent) et c'est ce qui sépare « propre » de « premium ».
Détail : `memory/projects/SHOWCASE-CAPACITES.md` § Benchmark ÉLARGI.

⚠️ Gazoduc : les Actes 1/2/3 restent en palette CLAIRE. Le passage au sombre se juge à la passe finale
d'assemblage, jamais acte par acte.

## Évolution
- Élargir avec d'autres teintes/variantes validées au fil des prods (rester une palette FERMÉE, pas un fourre-tout).
