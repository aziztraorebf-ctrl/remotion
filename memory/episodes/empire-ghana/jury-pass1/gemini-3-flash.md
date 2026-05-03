# Réponse Jury Technique — Empire du Ghana : "Le sel qui valait son poids en or"

## Note globale du brief : 8.5/10
Le brief est techniquement solide et les contraintes sont bien définies. Le risque de "syndrome encyclopédique" est réel, mais la stack Remotion/d3-geo est parfaitement calibrée pour résoudre cela par le mouvement.

---

## Q1. Approche méthodologique : La colonne vertébrale
Si je dois coder ça demain, je commence par le **système de coordonnées d3-geo et le rigging de la caméra**. 

**La scène d'ancrage : Le Beat 2 (L'axe Nord-Sud).**
Pourquoi ? Parce que c'est là que se définit la topographie du récit. Si le mouvement de caméra entre Taghaza (Nord) et Bambouk (Sud) n'est pas parfait, le spectateur ne comprendra jamais l'enjeu spatial du "Silent Barter".
1.  **Setup d3-geo** : Projection Mercator centrée sur l'Afrique de l'Ouest.
2.  **Interpolation de caméra** : Créer une fonction `getCameraState(frame)` qui gère le zoom et le pan entre les trois points clés (Taghaza, Koumbi Saleh, Bambouk).
3.  **Le "Master Path"** : Tracer le chemin des caravanes en SVG `stroke-dasharray` pour valider le timing avant même d'intégrer les sprites PixelLab.

---

## Q2. Scène la plus risquée : Le Beat 4 (L'effondrement)
Le Beat 4 est un enfer narratif : 3 dates clés (1076, sécheresse, 1240) en 15 secondes. Le risque est de perdre l'attention par surcharge d'informations.

**Comment la sécuriser ?**
Il ne faut pas essayer de "tout montrer" sur la carte. Il faut passer d'une vue géographique à une vue **"Diagramme de survie"**.
- **Technique** : Utiliser un `InsertBouclierSchema` qui se fissure. 
- **Visuel** : Quand on mentionne les Almoravides, on ne montre pas une bataille (trop complexe en Lottie), on montre une **ligne de front rouge bordeaux** qui descend du nord et "coupe" littéralement le tracé SVG de la route du sel.
- **Le pivot Sundiata** : Ne pas faire une nouvelle carte. Faire un "Fade to Black" partiel avec un `LightLeak` et faire apparaître le logo/sceau de l'Empire du Mali en surimpression sur les ruines de Koumbi Saleh.

---

## Q3. Pattern visuel récurrent : "Le Grain de la Richesse"
Pour signer cet épisode, je propose d'utiliser la dualité de texture **Or vs Sel** via un overlay permanent ou semi-permanent.

**Signature : La Jauge d'Équilibre (The Scale).**
- **Composant** : Un `InsertSVG` discret en haut à droite (ou en bas sous le sous-titre) représentant une balance minimaliste.
- **Dynamisme** : Elle oscille légèrement tout au long de la vidéo. Quand on parle de 90kg de sel, le plateau "Sel" descend. Quand on parle d'or, l'autre s'équilibre.
- **Stack** : Simple `path` SVG animé via `spring` dans Remotion. Cela renforce visuellement le hook "au gramme près" sans saturer l'image centrale.

---

## Q4. Idée créative concrète : Le "Drop" du Silent Barter (Beat 3)
C'est le moment "ASMR visuel" de la vidéo. Pour marquer le coup :

**L'effet "Écho Fantôme" :**
Au moment où la narratrice dit "Puis ils s'éloignaient... sans un mot", on réalise un **dézoom brutal (zoom 2.5x -> 1.2x)** pour montrer l'immensité du désert autour de deux petits sprites PixelLab.
- **Action** : On utilise deux instances de `AtlasCaravane`. L'une arrive, dépose un bloc de sel (Lottie simple), et repart en sens inverse. 
- **Traitement sonore/visuel** : On réduit l'opacité des sprites à 40% (effet fantomatique/rituel) et on active un `LightLeak` doré très lent. 
- **Résultat** : On crée un vide visuel qui souligne le "silence" du troc. C'est le contraste avec l'agitation du Beat 2 qui créera l'émotion.

---

## Q5. Sensibilité historique : L'urbanité contre le cliché
L'écueil majeur est de représenter le Ghana médiéval comme un campement de tentes dans le sable (orientalisme).

- **Représentation de Koumbi Saleh** : Il faut utiliser Gemini pour générer une signature visuelle de **ville en pierre sèche et banco**, pas des huttes. 
- **La Mosquée** : Le script mentionne "Une mosquée". C'est un marqueur de civilisation et de lien avec le monde arabe/méditerranéen. Elle doit être un point d'intérêt (POI) majeur sur la carte d3-geo, avec une icône Lottie spécifique (un minaret stylisé).
- **Le Roi** : Éviter le cliché du "roi sauvage". Le script dit qu'il "taxait". C'est une administration. L'iconographie doit évoquer la **bureaucratie et la puissance fiscale** (registres, poids de mesure officiels en or).

---

## Alertes critiques
1.  **Densité du Beat 2** : "Vingt mille habitants. Une mosquée. Un roi." C'est très rapide. Je suggère d'utiliser des **"Pop-up Labels"** (AtlasLabel) qui apparaissent en rythme avec les mots (sync ElevenLabs), comme des notifications UI modernes, pour que l'œil sache où regarder.
2.  **Lisibilité d3-geo** : Le mode "Sépia/Or" risque de manquer de contraste pour les frontières. Je préconise d'utiliser un **bordeaux profond (#4A0E0E)** pour les tracés de routes et les frontières de l'empire afin de trancher sur le fond sable.

## Convergences attendues
Je pense que mes collègues insisteront aussi sur la gestion du vide. Dans un format vertical, la carte d3-geo peut vite paraître "étroite". L'utilisation intelligente des `spring` pour les zooms de caméra sera notre seul moyen de donner une sensation d'espace.