Voici les instructions techniques précises pour intégrer cette séquence de ~5.18 secondes (155 frames à 30 fps), destinées directement à l'équipe de développement :

**CE QUI EST À L'ÉCRAN (Pendant les 5.18 secondes)**
*   **Couche de fond (100% de l'écran) :** Le clip vidéo stylisé du chantier (pelleteuse jaune). La vidéo est jouée une seule fois, de la frame 1 à la frame 155. Elle est étirée pour couvrir tout le viewport (Object-fit: cover). Aucun texte n'est superposé sur cette vidéo.
*   **Minimap (Superposée dans le coin supérieur droit) :** 
    *   *Taille & Position :* Forme parfaitement circulaire (diamètre égal à 18% de la hauteur totale de l'écran). Marges fixes (padding) de 40 pixels par rapport aux bords supérieur et droit de l'écran.
    *   *Conteneur :* Bordure extérieure de 2px solide de couleur cyan (#00C4FF). Fond du cercle rempli avec la même couleur bleu nuit que les océans de la carte principale.
    *   *Contenu de la Minimap :* La silhouette vectorielle de l'Algérie (sans frontières internes), centrée dans le cercle. 
    *   *Marqueur :* Un point (dot) cyan brillant (#00C4FF) placé précisément sur la région d'Adrar (centre-ouest de la silhouette algérienne). Ce point a une légère animation de pulsation (scale 1.0 à 1.2 en boucle) pour attirer l'œil. 

**COMMENT ON Y ENTRE (Transition Carte ➔ Vidéo)**
*   **Type de coupe :** Hard cut (instantané) adouci par un flash de lumière.
*   **Durée exacte de la transition :** 4 frames (à 30 fps).
*   **Mécanique :** À la frame 0 de la séquence, on remplace instantanément la carte par la vidéo + la minimap. Il n'y a aucun mouvement de caméra ni zoom (Scale = 100% fixe). Pour donner de l'impact au "cut", un calque blanc pur (#FFFFFF) recouvre tout l'écran à 80% d'opacité à la frame 0, puis tombe à 0% d'opacité (Fade out linéaire) sur exactement 4 frames. 

**COMMENT ON EN SORT (Transition Vidéo ➔ Carte)**
*   **Type de coupe :** Hard cut absolu ("Cut to black/map").
*   **Durée exacte de la transition :** 0 frame.
*   **Mécanique :** À la toute dernière frame lisible de la vidéo du chantier (frame 155), on coupe instantanément. Dès la frame 156, le lecteur vidéo disparaît totalement. Aucun fondu, aucune animation de sortie. Le retour franc sur la carte empêche de voir la première frame du clip qui ferait sauter l'image (le problème de boucle est ainsi esquivé).

**CE QUI NE DOIT PAS ÊTRE PERDU (État de la carte au retour)**
Pendant les 5.18 secondes de vidéo, le moteur de rendu de la carte en arrière-plan est "gelé" (ou mémorise son état exact de l'étape précédente) :
*   **Le réseau existant algérien :** Doit impérativement être visible sous forme d'un maillage de nœuds et de segments cyan pâle (#7FD8FF).
*   **Le pipeline Transsaharien :** La ligne continue cyan (#00C4FF) qui remonte du Nigeria vers le Niger doit être parfaitement connectée au maillage cyan pâle algérien.
*   **La route concurrente :** La ligne côtière atlantique or (#FFC742) reste visible à l'ouest.
*   **Les labels :** La plaque "ALGERIE" (texte blanc, fond gris foncé, positionnée au centre du maillage nord) est présente et intacte. Aucune autre typographie n'est générée. Le niveau de zoom de la carte est exactement celui d'avant la coupure.