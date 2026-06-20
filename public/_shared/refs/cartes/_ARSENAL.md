# ARSENAL — ce qu'on SAIT faire sur nos cartes (source d'inspiration, PAS une checklist)

> À passer au modèle dans le préambule du storyboard carte (couche [3]), avec les chaînes de référence.
> ⛔ **Ce n'est PAS un menu où l'on commande, PAS un mix-and-match.** C'est pour que le modèle SAISISSE
> l'étendue de notre boîte à outils — et propose au moins ce niveau, ou MIEUX. Formule à donner :
> « Voici ce qu'on sait faire. On n'est pas limité à ça — sers-t'en comme inspiration et VA PLUS LOIN. »
>
> 🌱 **Fichier VIVANT** : à enrichir quand on crée un nouvel asset/composant marquant. Check-up de temps en temps.
> (Distillé d'un inventaire exhaustif 2026-06-20 — on garde l'ESPRIT, pas les 200 composants.)

---

## SOUVERAIN MAPBOX (carte GeoAfrique, navy `#16213a` + gold)
On sait faire vivre un territoire de plein de façons : **remplir un pays** (vrai drapeau HD clippé, texture de
ressource pétrole/or/lithium, photo réelle bichromée, choropleth qui monte en intensité) ; **le révéler** (faisceau
scanner qui traverse, frontière qui se trace au laser doré puis se remplit, drapeaux qui s'allument pays par pays
synchro voix) ; **propager une influence** (contagion par vagues depuis un épicentre, alliance qui s'étend) ;
**relier des lieux** (arc/route qui se dessine + marqueurs qui pop + sprite mobile type avion) ; **ancrer une donnée**
(plaque nom+stat serif gold reliée au point, encart glassmorphism, compteur cumulatif, onde Lottie) ; **basculer en
overlay** (carte assombrie + bloc, puis retour). Caméra : zoom d'approche relief (pitch ~32), drift continu, masque
cinétique (un chiffre géant dont le « 0 » s'ouvre sur la carte). **Va plus loin que ça.**

## WARMAP (parchemin sépia, territoires par faction, incarné)
Notre force = la carte de guerre INCARNÉE et causale. On sait faire : **colorer le contrôle** (polygones admin-1 qui
changent de camp frame par frame, un pays qui devient X% rouge en clipPath quand on dit « X% du Burkina ») ;
**l'avancée** (jetons/unités qui se déplacent en laissant un sillage qui colore le territoire, flèches de manœuvre
qui poussent, tenaille/encerclement) ; **les jetons réels** (cercles parchemin bordure-faction avec portrait clippé,
formes possibles ronds/losanges) ; **les sprites PixelLab/Gemini** (combattants, véhicules top-down orientés,
convois, bases fortifiées, réfugiés en portraits circulaires) ; **la chute d'une base en 3 temps** (approche →
alerte → effacement + FX fumée/explosion PixelLab animés) ; **les sceaux d'événement** + **bannière flottante** (nom
d'alliance, titre) + plaques de villes + HUD date/pertes ; **contours nationaux qui se tracent + pulse** quand on
nomme un pays. Overlay carte-assombrie ou split-screen pour la donnée. **Va plus loin que ça.**

## ATLAS (carte historique illustrée + persos PixelLab)
Le cœur Atlas = des **acteurs incarnés** sur la carte. On sait faire : **persos PixelLab animés** (walk cycle
multi-directions, cortège en file indienne, 2 persos qui convergent/s'affrontent, caravane chibi sur un chemin) ;
**carte Mercator ou globe** qui drift ; **territoire d'empire** (hachures/fill qui s'étend) ; **spotlight** d'un perso
(focus + flou de l'arrière-plan) ; **marqueur pulsant** sur un lieu ; **chiffre-choc** wobble en insert ; **caméra qui
suit un perso** puis pull-back à l'arrivée ; effondrement (dutch tilt + shake). Registre épique, parchemin, Cormorant
Garamond. **Va plus loin que ça.**

---

## Refs visuelles à JOINDRE (en plus du texte, pour qu'il VOIE notre style)
- Carte du registre : `public/_shared/refs/cartes/carte-{souverain-geoafrique-v5|warmap-sudan-epic|atlas-mansa-moussa}.jpg`
- WarMap, montrer nos jetons/sprites réels : `public/_shared/sprites/warmap/` (jeton-*.png, fighter-*.png, base-*.png)
- Atlas, montrer nos persos : `public/atlas-mansa-moussa/characters/` (mansa-moussa, soldat-mali…)
- Souverain, drapeaux HD : `public/_shared/flags/`
