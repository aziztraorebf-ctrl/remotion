# Une image de référence pousse un LLM génératif au mimétisme de composition, pas seulement de style

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Quand on veut une composition VISUELLE ORIGINALE d'un LLM multimodal (Gemini, GPT), NE PAS lui fournir une
image de référence à imiter — même une scène du même projet, dans le même registre, déjà validée. Le modèle
tend à reproduire une composition quasi-identique (mimétisme de la MISE EN PAGE, pas seulement du style/
palette). Préférer décrire le registre en MOTS (palette, style de trait, niveau de richesse attendu) + poser
l'exigence narrative (le sens à porter, pas une liste d'éléments à placer) + les interdits, et laisser le
modèle choisir sa propre composition.

**Contre-cas légitime** : quand on veut au contraire AMÉLIORER un prototype déjà codé/existant (pas composer
du neuf), donner une frame réelle de l'existant en référence est la bonne méthode — le modèle n'a plus à
deviner l'intention/la composition, juste à l'améliorer. Voir [[PRODUCTION-AGENTIQUE-SVG]] § VARIANTE UPGRADE
PROTOTYPE (prouvé CargoVoyage16x9, 2026-07-03) vs § VARIANTE SANS IMAGE DE RÉFÉRENCE (prouvé Liptako-Gourma
et Ressources, warmap-sahel, 2026-07-04).

**Why:** Aziz a explicitement anticipé ce risque avant de lancer 2 générations SVG sans référence ("je ne
voudrais pas plutôt dire ce que l'on veut et lui laisser une certaine liberté créative") — confirmé par le
résultat : sans référence, Gemini 3.1 Pro a produit 2 métaphores différentes et plus riches (sceau de cire +
anneaux entrelacés ; bouclier-levier + soleil-diamant) que ce qu'un brief avec référence aurait probablement
rapproché d'une scène existante du même projet (le CFA).

**How to apply:** Composition neuve/originale demandée → décrire en mots, pas d'image de référence. Amélioration
d'un existant déjà codé → fournir une frame réelle en référence. Principe transférable au-delà de Remotion :
une référence visuelle ancre la composition, pas seulement le style — à garder en tête pour tout prompt
engineering multimodal.
