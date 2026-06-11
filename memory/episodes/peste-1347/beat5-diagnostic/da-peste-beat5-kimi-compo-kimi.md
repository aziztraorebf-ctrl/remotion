 ```json
{
  "score_compo": 4,
  "hierarchie": "Conflit visuel permanent entre le glow doré (zone) et les sprites (acteurs). L'œil n'a pas de point d'ancrage : le halo uniforme écrase la caravane, tandis que le rouge européen (frame 4-5) arrive comme une couche de données sans relation claire avec l'or africain. Absence de profondeur de champ : tout est à plat, tout compete.",
  "glow_mali": "trop fort + uniforme + artificiel. Il ressemble à un filter: blur(20px) CSS ou un shadowBlur canvas avec rayon constant, créant une auréole plastique sans texture. Il n'évoque ni la poussière d'or ni la chaleur, mais un sélecteur de zone mal calibré. Il masque la géographie du Mali au lieu de la révéler.",
  "lisibilite_sprites": "Faible à moyenne. Trop petits (6px de haut environ), alignement robotique (grille verticale parfaite), sans ombre portée ni ancrage au sol (effet 'collage'). Le contraste avec le fond terre cuite est insuffisant. L'âne au centre se perd entre les deux colonnes de porteurs.",
  "ai_slop_visuel": [
    "Glow radial parfaitement symétrique sans variation de texture ni de falloff",
    "Alignement mathématique des sprites (coordonnées x/y fixes, sans jitter organique)",
    "Couleurs plates type 'HSL pur' (terre cuite=#CD853F, bleu=#4682B4) sans grain papier ni imperfection",
    "Remplissage rouge des pays européens par masque binaire (plein/créneau) sans bords irréguliers",
    "Absence de motion blur ou de traînées suggérant le mouvement (sprites statiques sur fond statique)",
    "Transitions type 'cut' abruptes entre la caravane (frame 2) et le bateau (frame 3) sans pont visuel"
  ],
  "fix_par_frame": [
    {
      "frame": "Mali s'illumine",
      "fix": "Réduire opacité du glow à 40%, ajouter un bruit de texture (SVG turbulence filter) pour effet 'sable doré', décaler le centre lumineux vers le nord-est pour éviter la symétrie parfaite. Ajouter des particules d'or (petits carrés jaunes animés en Remotion) qui s'élèvent lentement."
    },
    {
      "frame": "caravane north",
      "fix": "Tracer une piste sinueuse (ligne brisée beige clair) sous les sprites. Désaligner les porteurs (formation en V irrégulière, x aléatoire ±5px). Ajouter des ombres elliptiques noires à 20% d'opacité sous chaque pied. Réduire le glow de fond pour faire ressortir les silhouettes."
    },
    {
      "frame": "bateau de l'or",
      "fix": "Agrandir le sprite de 50%. Ajouter une traînée dorée derrière (ligne pointillée animée avec Remotion interpolate). Relier visuellement au Mali par un arc de navigation (courbe de Bézier dorée qui pulse). Ajouter un léger flou de direction (skewX) suggérant la vitesse."
    },
    {
      "frame": "propagation du rouge",
      "fix": "Remplacer le fill rouge solide par une tache d'encre avec bords irréguliers (utiliser d3.geoPath avec une distortion noise ou un mask SVG organique). Faire apparaître le rouge par villes d'abord (points qui s'étalent) avant de remplir les campagnes. Ajouter des fumées grises au-dessus des zones infectées."
    },
    {
      "frame": "climax Europe rouge vs Mali or",
      "fix": "Créer une diagonale forte : Sahara comme mur visuel (ajouter des dunes en silhouette sombre au premier plan). Faire pulser le glow doré au rythme du narrateur (heartbeat). Ajouter un vignettage (assombrir les bords) pour focaliser sur la ligne de confrontation. Séparer les deux mondes par une ligne de partage des eaux dorée verticale."
    }
  ],
  "priorite_1": "Ancrer les sprites au sol avec ombres et trajectoire tracée (ligne de route), et casser l'uniformité du glow par un bruit de texture procédurale (SVG filter) pour sortir de l'aspect 'généré par défaut'."
}
```

=== ANGLES OBLIGATOIRES ===

**1. SPECTATEUR LAMBDA**
*Frame 1* : "Il y a un trait jaune en Afrique" — ne comprend pas que c'est une zone de prospérité, ressemble à une erreur d'affichage ou à un désert sans signification particulière.  
*Frame 2* : "Des petits bonhommes marchent en ligne" — ne saisit pas la direction (nord-sud ?), ni le lien avec l'or. L'absence de chemin fait qu'ils semblent flotter.  
*Frame 3* : "Un bateau au milieu de nulle part" — décrochage total. Le spectateur ne fait pas le lien entre la caravane (désert) et le bateau (mer).  
*Frame 4* : "L'Europe devient rouge comme une carte électorale" — associe à un vote ou une guerre, pas à la peste. Le rouge est trop uniforme pour évoquer une maladie.  
*Frame 5* : "Deux blocs de couleur qui se regardent" — ne comprend pas la contradiction géographique (Sahara = barrière) car rien ne matérialise ce mur.  
**Décrochage critique** : Entre frame 2 et 3 (saut spatial sans transition) et manque de hiérarchie sur où poser le regard en premier (le glow attire l'œil plus que l'action).

**2. NARRATION / SYNCHRO**
Le visuel est en **redondance passive** avec la voix : quand le narrateur dit "monte", les sprites sont statiques ; quand il dit "or", on voit un bateau générique.  
Manque de **beats visuels** : il faudrait un éclat doré au mot "prospère", une traînée au mot "caravane", une tache qui s'étale au mot "peste".  
Actuellement, c'est du "radio illustré" : les images montrent ce qui est dit, mais ne le **dramatisent** pas. La synchro est descriptive, pas émotionnelle.

**3. TRANSITIONS vs ÉTATS**
Ce sont des **états figés** (diapositives). Aucune suggestion de mouvement entre les frames :  
- Frame 2 → 3 : cut sec, comme si on changeait de chaîne.  
- Frame 4 → 5 : simple ajout de calques rouges, pas de propagation fluide.  
Pas de **caméra** (zoom, pan, travelling) pour accompagner le récit. La carte reste statique alors que l'histoire est dynamique (mouvement de l'or, propagation de la maladie).

**4. AI-SLOP (technique)**
- **Glow procédural** : Utilisation de `ctx.shadowBlur` ou `filter: blur()` avec rayon fixe, créant une auréole de néon parfaitement lisse, sans la variation de densité d'une lumière réelle.  
- **Alignement algorithmique** : Les sprites sont placés par `projection([lon, lat])` sans `Math.random()` de décalage, créant une rigidité de grille typique du code non supervisé.  
- **Palette par défaut** : Couleurs HSL saturées directement sorties du générateur, sans passage par une lookup table (LUT) ou texture de papier ancien.  
- **Masques binaires** : Le rouge utilise `path.fill = red` sur les frontières GeoJSON pures, sans distorsion organique (effet "tache d'encre" ou "rouille" impossible à obtenir par simple `fillStyle`).  
- **Absence d'espace négatif** : Tout l'écran est rempli (terre + mer + glow + sprites), créant une surcharge cognitive caractéristique des générations procédurales sans direction artistique.

**5. EXPERT DU MÉTIER**
Un pro (type studio *Kurzgesagt* ou *Datawrapper*) jugerait que l'histoire manque de **flux visuel** (flow). À la place des sprites alignés, il mettrait :  
- Des **lignes de Sankey** ou de flux animées montrant la quantité d'or qui monte.  
- Une **profondeur de champ** : flouter l'Europe quand on parle du Mali, et vice-versa.  
- Des **particules** : poussière d'or en suspension (simulation simple en Remotion avec 50 divs animées) pour donner du volume au glow.  
- Une **progression narrative** : la caméra devrait zoomer depuis le Mali (frame 1) jusqu'à la Méditerranée (frame 3) en un seul mouvement continu, pas en cuts.  
- **Symbolisme** : le rouge devrait être une **tache d'huile** qui se propage depuis les ports (Venise, Gênes) avec une vitesse variable (plus rapide sur les routes commerciales), pas un remplissage de pays.  
Ce qui manque : la **chorégraphie spatiale** — chaque élément doit entrer et sortir de scène avec une intention, pas apparaître par magie.