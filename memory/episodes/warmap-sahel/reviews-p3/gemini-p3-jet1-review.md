Voici mon retour de directeur artistique sur ce premier jet de la Partie 3. J'ai analysé la vidéo, le son, et les notes d'Aziz. 

### 1. IMPRESSION GÉNÉRALE
Aziz a tout à fait raison sur un point fondamental : **ce jet est beaucoup trop statique et illustratif.** Actuellement, la carte subit le commentaire au lieu de le vivre. Nous avons une grammaire causale forte (l'action transforme le territoire), mais ici, on se contente de faire "popper" des éléments sur des plans larges dénués de tension. Le rythme narratif de cette partie 3 est excellent (l'union, la victoire, la part d'ombre, la résistance), mais la réalisation visuelle est restée bloquée en mode "atlas géographique". Il faut ramener de la chair, du mouvement et de la tactique.

### 2. RETOUR SUR LES 9 POINTS D'AZIZ

*   **Point 1 (Caméra trop large/statique) : D'ACCORD.** La caméra doit être un acteur. Au lieu d'un plan large figé, utilisons un *drift continu* avec des *zoom/pan frame-driven*. On commence serré sur les frontières Mali/Burkina/Niger, puis on *track* l'action vers Kidal, on glisse vers Moura pour le flashback, et on dézoome légèrement (mais pas trop) pour les attaques de 2026.
*   **Point 2 (Ph1 AES ne raconte rien) : D'ACCORD.** La flèche actuelle est hors sujet. Il faut incarner cette alliance. (Voir ma recommandation détaillée au point 3).
*   **Point 3 (Casser la carte pour Ph1) : PARTIELLEMENT D'ACCORD.** Casser la carte est un bon outil, mais ici, l'AES est une alliance *territoriale* (Liptako-Gourma). Si on quitte la carte, on perd l'enjeu géographique. Je propose une solution hybride (voir point 3).
*   **Point 4 (Jetons mal placés/chevauchés) : D'ACCORD.** C'est une erreur de *staging* basique. Les jetons doivent utiliser une disposition radiale autour de Kidal pour respirer, avec leurs ombres portées pour bien se détacher du fond parchemin.
*   **Point 5 (Kidal trop "point") : D'ACCORD.** Remplaçons le simple point par un `SPRITES-LIEUX` (un fortin top-down ou une architecture urbaine sahélienne) ancré sur la carte. Cela donnera de la gravité à la ville : ce n'est pas un point GPS, c'est une forteresse à prendre.
*   **Point 6 (Statu quo et départ ONU) : D'ACCORD.** Les casques bleus ne doivent pas juste "disparaître". Utilisons `interpWaypoints` pour les faire physiquement reculer vers le sud (Gao/Bamako) tout en baissant leur opacité. C'est visuellement beaucoup plus fort de voir une force *quitter* le terrain.
*   **Point 7 (L'offensive FAMa + Africa Corps) : D'ACCORD À 100%.** C'est le cœur de notre grammaire. Il nous faut deux jetons distincts (portrait soldat malien + portrait mercenaire russe) qui remontent ensemble du sud vers Kidal (`interpWaypoints`). À leur approche, les jetons touaregs doivent se disperser vers le nord/l'est (frontière algérienne). 
*   **Point 8 (Drapeau Kidal en losange) : D'ACCORD.** Le remplissage du polygone de la région est illisible et ressemble à un bug. On revient à nos fondamentaux : un vrai drapeau rectangulaire (image PNG) avec un *clip-path* ondulant, planté directement sur le sprite de Kidal une fois les jetons ennemis chassés.
*   **Point 9 (Cercle Liptako-Gourma qui reste) : D'ACCORD.** Ce halo devient du bruit visuel. Il doit *fade out* dès que la voix off dit "Mais ce nouveau bloc va très vite être mis à l'épreuve". La carte doit se nettoyer pour préparer le focus sur Kidal.

### 3. LA QUESTION CLÉ : OVERLAY PLEIN ÉCRAN VS SEMI-TRANSPARENT (Ph1)
**Ma décision de DA : Un overlay semi-transparent par-dessus la carte (pas de plein écran total).**

*Pourquoi ?* Le pacte de l'AES (Liptako-Gourma) est la fusion de trois géographies immenses. Si on coupe sur un fond noir ou parchemin uni pour montrer des portraits ou du texte, on perd l'échelle du continent. 
*Comment on le fait :* 
1. La caméra cadre les 3 pays. On applique un assombrissement sélectif sur le reste de l'Afrique.
2. Les frontières des 3 pays se dessinent (`countryOutline` en OR #C9A24B) et se remplissent d'une légère teinte dorée.
3. Par-dessus, au centre de l'écran, on fait apparaître un composant `WarMapPlaque` (parchemin élégant) avec les portraits clippés des trois dirigeants et le texte "Alliance des États du Sahel". 
4. Dès qu'on passe à Kidal, la plaque disparaît en *fade out*, le remplissage doré s'estompe, et la caméra plonge vers le nord du Mali. On garde ainsi le rythme sans jamais rompre le lien charnel avec le territoire.

### 4. CE QUE JE CHANGERAIS EN PRIORITÉ (Top 3 hors notes d'Aziz)

1. **Le flashback de Moura (01:13) manque cruellement de dramaturgie.** Actuellement, c'est juste un point rouge. On doit utiliser notre boîte à outils temporelle : quand la voix annonce 2022, le curseur de la timeline glisse physiquement en arrière, l'image subit une *désaturation/sépia globale* (pour marquer le passé), et sur Moura, on déclenche une onde de choc concentrique bordeaux (#6B1A1A) pour symboliser la gravité des 500 morts civils.
2. **L'offensive sur Kidal n'imprime pas le territoire.** Quand les jetons FAMa et Africa Corps montent vers Kidal, ils doivent révéler un sillage bleu désaturé (#2B4F7C) derrière eux via le masque SVG flouté (*wet ink*). Cela montre que l'État *reprend* le contrôle physique de la route et du terrain, respectant notre inversion chromatique (le bleu reprend la place du rouge).
3. **Les attaques jihadistes de 2026 (01:34) sont molles.** Les jetons qui popent ne traduisent pas le texte "les attaques s'intensifient mais l'armée les repousse". Il faut utiliser l'outil `SahelAttackArrow` : de grosses flèches rouges brique qui poussent depuis les frontières vers le centre, mais qui viennent s'écraser et se briser (fade out + recul) contre un `countryOutline` bleu malien qui flashe pour montrer que le territoire tient bon.

### 5. CE QU'IL NE FAUT SURTOUT PAS CASSER

*   **La Timeline en bas :** Elle est parfaitement intégrée et justifie brillamment le saut temporel vers Moura puis vers 2026. Ne la touchez pas, assurez-vous juste que le curseur bouge de manière fluide (*spring* ou *ease-in-out*).
*   **Le code couleur :** L'idée de l'inversion chromatique (le bleu de l'État qui gagne du terrain sur cette partie 3) est excellente. C'est subtil mais le cerveau du spectateur comprend immédiatement qui a l'avantage.
*   **Le sound design :** Les SFX actuels (le bruit sourd pour la charte, les bruits de bottes/moteurs légers pour l'offensive) sont très bons. Il faudra juste les recaler précisément sur les nouveaux mouvements *frame-driven* des jetons.