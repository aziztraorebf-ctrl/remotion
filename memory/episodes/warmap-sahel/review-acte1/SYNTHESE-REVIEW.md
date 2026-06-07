# Synthèse review externe Acte 1 (AI-slop + lisibilité) — Gemini + Kimi

> Review session 3 (2026-06-07). Brief : "qu'est-ce qui crie AI-slop / amateur + qu'est-ce
> qui est illisible". Frames : memory/episodes/warmap-sahel/review-acte1/*.jpg.
> Bruts : da-acte1-aislop-{gemini,kimi}.md. À RELIRE en session dédiée Acte 1.

## CONVERGENCE FORTE (les deux modèles le disent = priorité absolue)

1. **PALETTE = "couleurs GIS par défaut" / "carte Wikipédia 2008"** ⭐ LE PIRE
   - Bleu/rouge/or bruts à pleine opacité sur basemap claire = "peinture à l'eau sale",
     "moutarde", aucune atmosphère de conflit, faible contraste.
   - Piste : DÉSATURER les zones de contrôle + `mix-blend-mode: multiply/overlay` pour que
     le terrain ressorte + assombrir océan/pays non concernés pour faire popper le Sahel +
     grain de film (PNG overlay 8-15%). Palette plus profonde (bleu nuit, rouge sang oxydé,
     or antique métallique).

2. **VÉHICULES = "clipart Windows XP" / "jeu Flash 2000"** ⭐ (confirme Aziz)
   - PNG top-down trop gros, mal intégrés, se chevauchent, échelle absurde, flottent sans poids,
     pas différenciés (rouge sur rouge, orange sur moutarde = camouflage).
   - Piste : icônes SVG minimalistes vue de dessus, taille FIXE en px (indépendante du zoom),
     drop-shadow dynamique + traînée de poussière. Différencier par FORME (carré vs cercle) ET
     contour blanc épais, pas juste teinte (confirme l'ajout Claude "forme pas couleur").

3. **CARTON JNIM masque la zone dont il parle** (confirme Aziz "redondant")
   - Le cartouche central CACHE la zone. Piste : décaler (offset) + fine ligne pointillée
     vers la zone, au lieu de couvrir. (Et ne pas répéter ce que la voix dit.)

4. **SURCHARGE zone centrale Liptako** (confirme Aziz)
   - Frontières nationales + régionales + couleurs + halos + flèches + labels + carton + voitures
     = bouillie. Piste : HIÉRARCHISER — baisser opacité des frontières régionales quand l'action
     est au centre. Un foyer à la fois.

5. **TYPO "div HTML par défaut" / serif générique + fond beige + ombre floue cheap**
   - Mélange serif (date) / sans-serif (légende) = pas de DA. Halo de texte qui "saigne".
   - Piste : UNE seule fonte condensée (Inter/Roboto Condensed/DIN), fonds nets, retirer ombres cheap.

6. **HALOS/CERCLES autour capitales = bruit inexpliqué** (confirme Aziz)
   - Pas dans la légende, fonction inconnue. Piste : SUPPRIMER, ou point SVG + anneau fin pulsant.

7. **FLÈCHES convergence invisibles** (confirme Aziz)
   - Minuscules, pointillés fins sur fond coloré. Piste : SVG pleines, épaisses, contraste max
     (blanc/noir + contour), tracé animé stroke-dashoffset pour SENTIR le mouvement, PUIS disparaître.

## APPORTS UNIQUES utiles

- **Gemini** : surlignage Mali trace AUSSI les frontières INTÉRIEURES (bug : stroke sur regions
  au lieu du pays dissous → on a sahel-countries.geojson, à utiliser pour le pulse, pas les régions).
  Z-index : véhicules roulent sur le label "OUAGADOUGOU" (gérer z-index + collision labels).
  Anneau CEDEAO = `<circle>` net + stroke pointillé + `<textPath>` "CEDEAO" courbé.
- **Kimi** : fond beige plat = "template Mapbox non customisé / papier toilette". Ajouter texture
  papier vieilli + variation de teinte désert (rosé) vs sud (vert) même désaturé. Glow pulsant
  doré = "sélection Photoshop/Windows 95" → préférer tracé SVG stroke-dashoffset ou paths
  concentriques opacité décroissante (15/8/3%), pas un glow digital.

## RECOUPEMENT avec les 6 commentaires Aziz + 3 ajouts Claude
TOUT converge. Aziz avait raison sur les 6 points. Les modèles ajoutent surtout :
palette/grading (le plus grave), typo, texture de fond, technique de glow, z-index labels.
L'ajout Claude "différencier par forme pas couleur" est CONFIRMÉ par les deux.

## ⭐⭐ VERDICT COMPARATIF SOUDAN vs SAHEL (test décisif — Gemini + Kimi CONVERGENT)

> Test : "même palette + même moteur, Soudan marche / Sahel non — qu'est-ce qui DIFFÈRE ?"
> Bruts : da-compare-sudan-sahel-{gemini,kimi}.md. Intuition Aziz (cadrage) CONFIRMÉE.

**LA PALETTE EST UN FAUX COUPABLE.** Les couleurs sont excellentes (marchent au Soudan).
Le vrai problème n°1, dans l'ordre (consensus total) :

1. **FRAGMENTATION GÉOGRAPHIQUE = LA cause** ⭐ "Soudan = carte de BLOCS / Sahel = carte de
   PIXELS". Le Sahel a 30+ micro-régions admin-1 inégales qui se touchent → "haute fréquence
   spatiale" = bouillie / effet carte électorale. Le Soudan a de grandes macro-zones nettes.
   → On a appliqué une DA pensée pour macro-zones sur une mosaïque de confettis.
2. **FORMAT 16:9 (intuition Aziz confirmée)** : pour faire rentrer 3 pays étalés sur 28° lon,
   le horizontal a forcé à DÉZOOMER → déclenche tout le reste (éléments géants vs micro-régions,
   perte d'espace négatif). Le 9:16 Soudan cadrait serré un pays compact.
3. **RATIO ESPACE NÉGATIF** : Soudan ~40-60% de parchemin neutre autour / Sahel sature 75-85%
   l'écran de couleur → pas de repos visuel.
4. **ÉCHELLE éléments** : véhicules/labels géants vs micro-régions (zoom lointain).

**LES 3 CORRECTIONS LES PLUS RENTABLES (consensus, à faire en session dédiée) :**
- **A. FUSIONNER les micro-régions** en 8-10 grandes aires de contrôle (= "80% du problème
  réglé", Gemini). Soit dissoudre dans le GeoJSON (regrouper régions de même contrôle), soit
  styling (supprimer/atténuer bordures internes entre régions de MÊME couleur faction).
- **B. FRONTIÈRES INTERNES à opacité ~0.2** (ou supprimées) : zones colorées "flottent sans cage",
  ne garder que frontières nationales + lignes de front.
- **C. PLUS D'ESPACE NÉGATIF** : fill-opacity -10/15%, retirer halos parasites, réduire échelle
  véhicules -20/30%, dézoomer légèrement pour marge parchemin. (+ assombrir/tamiser pays voisins.)

**RÈGLE D'OR (Gemini, à graver dans la doctrine war-map) :** "Plus le découpage territorial est
complexe et petit, plus la couleur doit être UNIE (fusion des bordures) et l'UI MINIMALISTE."
→ Ceci recoupe l'ajout Claude "contraste par le calme" : la fusion crée les grandes zones de calme.

## DIRECTION pour la session dédiée (ne plus deviner — valider en recherche)
- **Palette + grading** = chantier #1 (désaturation + blend + assombrir hors-focus + grain).
- **"Contraste par le calme"** (ajout Claude) recoupe "hiérarchiser / baisser opacité hors-focus".
- **Véhicules** : repenser (SVG symbole ? ou garder PNG mais taille fixe + diff forme + ombre +
  traînée + ne pas laisser statique). À trancher en recherche (voir ce que font les vraies chaînes).
- **Chaque effet (cercle, flèches, glow, halos)** : refondre pour qu'il soit COMPRIS, ou retirer.
