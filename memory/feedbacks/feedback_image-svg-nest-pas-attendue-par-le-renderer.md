# ⛔ Une `<image>` SVG n'est PAS attendue par le renderer Remotion — `delayRender` obligatoire

> Vécu le 2026-09-04, chill-meter. Défaut repéré à l'œil par Aziz (« l'image de l'objet saute
> entre 25 et 50 %, par la suite ça revient stable »), confirmé à 1 frame près par la mesure.

## Le symptôme

Sur 510 frames rendues, **une seule** sortait sans son décor : il ne restait que les couches
vectorielles (labels, jauge) flottant sur le vide. La bbox opaque perdait 24 px de hauteur.

⭐ Et elle tombait sur la **1re frame d'un état** — donc pile à la jonction entre deux clips,
là où l'œil la voit le mieux. Une frame sur 510 = 0,2 %, invisible dans une moyenne, évidente
au visionnage.

## La cause

Le décor était chargé par une balise `<image href={staticFile(...)}>` **à l'intérieur d'un SVG**.
Le `<Img>` de Remotion, lui, déclare son propre `delayRender` : le renderer attend son décodage.
Une `<image>` SVG brute ne le fait pas — la capture peut partir avant que le PNG soit décodé.

## Le fix

```tsx
const [handle] = React.useState(() => delayRender("chargement du decor"));
React.useEffect(() => {
  const img = new Image();
  img.onload = () => continueRender(handle);
  img.onerror = () => continueRender(handle);   // ne jamais laisser le handle ouvert
  img.src = staticFile("...");
}, [handle]);
```

Vérifié après : **0 frame fautive sur 630**.

## La règle

**Tout asset chargé hors des composants Remotion (`<Img>`, `<Video>`, `<Audio>`) doit être
protégé par `delayRender`.** Cela vaut pour : `<image>` dans un SVG, une police chargée à la
main, un `fetch` de données, un canvas alimenté par une image.

## Méthode de détection

Un défaut à 0,2 % ne se voit dans aucune moyenne. Le compter directement :
```python
# une frame sans son decor a beaucoup moins de pixels opaques
if (alpha > 200).sum() < SEUIL: frames_fautives += 1
```
⭐ Compter les frames ANORMALES, ne pas moyenner sur la séquence. Lié :
[[feedback_hashes-distincts-ne-prouvent-pas-une-animation]] — même famille : la mesure
globale masque l'accident ponctuel.
