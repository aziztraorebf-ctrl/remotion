# Faire tourner une piece SVG sur son axe : le `rotate` va DANS le groupe qui porte le `translate`

Quand une piece porte deja `transform="translate(axe)"` (contrat « pret a animer »), la
faire tourner sur SON axe s'ecrit :

    <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>   ✅

**Why:** le 2026-09-05 (rouage du reveil), j'ai essaye TROIS formes avant la bonne, et
les deux premieres etaient fausses de facons differentes — donc invisibles au raisonnement :

| forme | ce qui se passe |
|---|---|
| `<g transform="rotate(a)">` en PARENT du groupe | la piece part **en ORBITE** autour de (0,0) du viewBox |
| `translate(axe) rotate(a) translate(-axe)` autour de la piece | le decalage est applique **DEUX FOIS** (la piece porte deja son translate) : les roues sortaient de la platine |
| `<g transform="translate(axe) rotate(a)">` | ✅ tourne sur son axe |

⛔ **Ce qui m'a fait perdre 2 rendus** : j'ai raisonne au lieu de mesurer. La 3e fois j'ai
ecrit un SVG de test isole (2 rectangles, 2 formes de transform, 1 rsvg-convert) — la
reponse etait evidente en 30 secondes. **Un doute sur un transform se tranche par un cas
de test, pas par la logique** : l'ordre des transformations SVG est contre-intuitif.

**How to apply:**
- La piece expose une prop : `React.FC<{angle?: number}>`, et le composant fait
  `transform={\`translate(cx cy) rotate(${angle})\`}` — c'est ce que
  `scripts/tools/svg-vers-calques.py` produit, il suffit d'ajouter la prop.
- ⛔ Ne JAMAIS encadrer par `translate/translate(-)` une piece qui porte deja son translate.
  Cet encadrement ne vaut que pour une piece dessinee en coordonnees ABSOLUES (ex. les vis
  du thermostat, cf. [[couche-complementaire-plutot-que-redessiner]]).
- ⭐ Doute sur un empilement de transforms ? 6 lignes de SVG + `rsvg-convert`, et on sait.

Lie a [[couche-complementaire-plutot-que-redessiner]], [[retournement-svg-sans-3d-passer-par-largeur-nulle]].
