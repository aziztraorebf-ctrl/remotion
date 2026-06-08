 Voici la review constructive, structurée pour exécution immédiate dans votre stack Remotion/SVG.

---

### 1. DIAGNOSTIC : Pourquoi cette zone "sonne vide"

**Le problème n'est pas le nombre d'éléments, mais la densité narrative par pixel.**

La 1re moitié fonctionnait par **géométrie macro** (pays entiers, anneau CEDEAO) : des formes lourdes qui remplissent l'écran par leur seule présence. La 2e moitié passe au **tactique micro** (pickups) sans changer d'échelle visuelle ni de densité d'information. Résultat : 50s où 3 sprites de 40px doivent porter seuls l'intérêt, sur un fond de carte statique.

Le "mouvement fantôme" vient de trois tares procédurales :
- **Trajectoires sans mémoire** : les véhicules glissent sans laisser de trace (pas de "data ink" de passage).
- **Vitesse constante** (easing linéaire) : signature du générique/template.
- **Absence de réaction du terrain** : la carte est un fond mort, pas un substrat qui réagit à l'occupation (pas de taches de contrôle qui s'étendent, pas d'interaction avec les localités).

---

### 2. PLAN BEAT PAR BEAT (f750 → f2299)

**Grammaire réutilisée** : zones colorées (avec opacité variable), fronts beige (pulsation), tampons (avec texture parchemin), caméra frame-driven (courbes de Bézier), SVG paths (traînées).

| Frame | Voix (beat) | Événement visuel (stack exécutable) | Technique précise |
|-------|-------------|-------------------------------------|-------------------|
| **f750-900** | *"Il faut d'abord regarder ce qui existait avant..."* | **Nettoyage cognitif** : les zones bleues/orange des pays passent à 15% d'opacité (filter: opacity via Remotion). La carte "respire", retour au parchemin brut. | `opacity` animée sur les layers SVG des zones politiques. Pas de cut, fade sur 30 frames. |
| **f900-1198** | *"Deux groupes armés..."* | **Scission de l'écran** (conceptuel) : la caméra amorce un drift lent vers l'ouest (centre Mali). Tampon "JNIM" apparaît en haut-gauche (pas centre, pour ne pas masquer le sujet), avec effet "encre qui sèche" (opacité 0→100% + léger scale 0.95→1). | Tampon en SVG avec `transform-origin: center` et easing `cubic-bezier(0.22, 1, 0.36, 1)`. |
| **f1198-1400** | *"JNIM... zones rurales... centre du Mali"* | **Tache d'huile** : une zone rouge (#B14B3C) à 30% d'opacité s'étend organiquement depuis le centre Mali vers le nord Burkina (SVG path avec `stroke-dashoffset` animé, fill qui suit). Les 2 pickups rouges **apparaissent à la lisière** de cette tache et patrouillent en la suivant. | Path SVG complexe (forme irrégulière) pour le "contrôle rural diffus". Les véhicules suivent un `motionPath` SVG avec easing non-linéaire (accélération/décélération aux villages). |
| **f1400-1600** | *"tensions éleveurs/agriculteurs"* | **Icontexte** : 3-4 paires d'icônes minimalistes (bœuf vs épis de blé, sprites 16x16px) apparaissent brièvement (12 frames) dans la zone rouge, pulse (scale 1.2), puis s'estompent. Explication visuelle du "terreau". | Groupes SVG avec `opacity` et `transform` ponctuels. Pas de texte, purement iconographique. |
| **f1600-1749** | *"Le second... EIGS... lié à Daesh"* | **Pan caméra** (durée 60 frames, courbe ease-in-out) vers l'est. Tampon "EIGS" apparaît (même traitement que JNIM). | `cameraX`/`cameraY` animés dans Remotion, pas de cut. |
| **f1749-1900** | *"Il préfère l'est... trois frontières"* | **Tache géométrique** : zone rose/saumon (#EIGS) s'étend depuis le nord-est Niger (forme plus anguleuse, militaire). Un blindé sombre entre de droite, **laisse une traînée beige foncée** (SVG path avec `opacity` dégressif de 0.6 à 0 sur 40 frames). | La traînée reste visible 2s puis fade, créant une "mémoire" du mouvement. |
| **f1900-2100** | *"zone des trois frontières"* | **Highlight du triangle** : le périmètre Liptako-Gourma (Mali-Burkina-Niger) se souligne par un stroke beige pulsant (2px, dash-array animé). | `stroke-dashoffset` sur polyline SVG. |
| **f2100-2167** | *"Les deux groupes ne coopèrent pas"* | **Front de contact** : les deux taches territoriales (rouge et rose) cessent leur croissance là où elles se touchent. Une ligne beige (front) apparaît entre elles, pulsant lentement (visualisation de la séparation). | Les véhicules convergent vers ce front. |
| **f2167-2299** | *"Parfois, ils se combattent"* | **Friction** : ondes de choc existantes (beige) + **recul des taches** : les zones de contrôle se rétractent légèrement (5-10%) au point de contact, comme si elles se repoussaient. Les véhicules rebroussent chemin en laissant des traînées brisées (lignes pointillées). | Animation `d` (morphing) des paths SVG des zones. Les véhicules utilisent `reverse()` sur leur motionPath. |

---

### 3. TRAITEMENT SPÉCIFIQUE DES 2 GROUPES (Premium & Lisible)

**JNIM (Al-Qaïda) : L'organique diffus**
- **Forme territoriale** : Tache rouge aux bords irréguliers, "floues" (SVG filter `feTurbulence` léger ou simplement path avec beaucoup de points de contrôle).
- **Mouvement** : Pickups qui suivent des courbes de Bézier complexes (simulant des pistes rurales), vitesse variable (lent sur les zones de tension, rapide sur les pistes).
- **Signature** : Présence de "cellules" (petits points rouges pulsants dans la tache territoriale) représentant des implantations locales.

**EIGS (Daesh) : Le géométrique frontal**
- **Forme territoriale** : Tache rose aux bords plus droits, anguleux, militarisée.
- **Mouvement** : Blindé qui avance en ligne droite avec des arrêts nets (keyframes avec `hold` easing), traînée continue et épaisse.
- **Signature** : Symbole de la "zone des trois frontières" clairement délimitée (triangle stroke).

**Opposition visuelle** : Quand la voix dit "ils n'ont pas grand-chose en commun", la caméra fait un **split-screen virtuel** (zoom out rapide) montrant les deux taches côte à côte : l'une rouge/irrégulière (ouest), l'autre rose/géométrique (est). Le spectateur lit immédiatement la dichotomie sans texte.

---

### 4. LES 3-4 AJOUTS LES PLUS RENTABLES

1. **Les traînées de mouvement (Motion Trails)**  
   *Coût : Faible (SVG paths réutilisés).*  
   Chaque véhicule laisse une traînée beige qui s'estompe sur 2 secondes. Cela transforme le "glissement fantôme" en **occupation territoriale historique**. On voit où ils sont passés, donc leur mouvement a du sens.

2. **La tache d'huile territoriale (Territorial Staining)**  
   *Coût : Moyen (morphing SVG paths).*  
   Au lieu de véhicules seuls, les pickups "étalent" une couleur (rouge/rose) derrière eux. Cela remplit l'espace visuel et matérialise "l'opération dans les zones rurales" mentionnée à la voix.

3. **Les icônes de contexte (Herders/Farmers)**  
   *Coût : Nul (sprites existants).*  
   Quand la voix mentionne les tensions, faire clignoter brièvement des icônes bœuf/blé. Cela **ancre le récit géopolitique dans le social**, expliquant le "pourquoi" de la présence de JNIM.

4. **Le breathing de caméra**  
   *Coût : Nul (courbes d'animation).*  
   Micro-mouvements : zoom lent (0.98x → 1.02x) sur la zone active pendant la narration, pause (freeze 0.5s) sur les beats importants (ex: "se combattent"). Crée le rythme "documentaire premium" type Arte.

---

### 5. VERDICT

**La structure est bonne** (chronologie logique : JNIM → EIGS → Confrontation).  
**Elle doit être enrichie, pas repensée.**  
Le problème est de **densité informationnelle**, pas de narrative design. Ajoutez des couches de "data ink" (traînées, taches, icônes contextuelles) et la zone deviendra premium.

---

### ANGLES OBLIGATOIRES

**1. SPECTATEUR LAMBDA**
- *Problème* : Il ne sait pas où regarder entre le tampon texte (haut) et les véhicules (bas). Risque de décrochage à f1500 ("zones rurales") car rien ne distingue visuellement le "rural" du "urbain".
- *Piste* : **Vignettage dynamique** (masque radial SVG) qui assombrit légèrement (opacity 0.3 noir) tout sauf la zone active (centre Mali pour JNIM, puis est pour EIGS). Guide le regard sans texte supplémentaire.

**2. NARRATION / SYNCHRO**
- *Problème* : Les véhicules bougent pendant que la voix explique le contexte historique ("tensions anciennes"), créant un décalage cognitif (l'œil suit l'action, l'oreille l'histoire).
- *Piste* : **Freeze des véhicules** (pause 1s) quand la voix dit "tensions éleveurs/agriculteurs", pendant que les icônes apparaissent. Reprise du mouvement sur "terreau". Un beat visuel = un beat audio.

**3. TRANSITIONS vs ÉTATS**
- *Problème* : Risque de cut sec entre JNIM (f1500) et EIGS (f1749).
- *Piste* : **Transition continue** : la caméra panne de l'ouest vers l'est (60 frames) sans coupure. Pendant ce pan, la tache JNIM s'estompe légèrement (40% → 20%) tandis que EIGS apparaît (0% → 40%). Le spectateur comprend qu'on change de foyer géographique.

**4. AI-SLOP (Test technique)**
- *Problème* : **Mouvement linéaire** (`transition: all 2s linear`) sur les véhicules = signature de l'amateur/IA.
- *Correction* : Easing obligatoire : `cubic-bezier(0.4, 0, 0.2, 1)` pour les entrées, `cubic-bezier(0.22, 1, 0.36, 1)` pour les déplacements. Variation de vitesse : les véhicules ralentissent près des croisements (simulation de prudence tactique).
- *Problème* : **Tampons trop nets** (drop-shadow CSS standard).
- *Correction* : Intégrer les tampons dans le monde parchemin : légère opacité (90%), blend mode `multiply` sur le fond de carte (via SVG `feBlend` si possible, ou simplement couleur légèrement transparente #F3E9C8 à 85%).

**5. EXPERT DU MÉTIER**
- *Ce qu'il regarderait* : La **cohérence de l'échelle**. Un pro verrait immédiatement que les véhicules sont trop gros par rapport aux pays (ou les pays trop petits).
- *Correction* : Réduire la taille des sprites véhicules de 30% et compenser par l'ajout de **convois** (3-4 véhicules pour JNIM, 1 blindé lourd pour EIGS) pour garder la lisibilité sans casser l'échelle.
- *Ce qu'il ajouterait* : Une **légende temporelle** discrète (timeline en bas) montrant qu'on est en 2020-2022, ancrant le récit dans la chronologie. Simple ligne beige avec point mobile.

---

### SECTION AI-SLOP (Détaillé)

*En tant que spectateur averti hostile :*

**Ce qui crie "procédural mal maîtrisé" :**
1. **La chromie plate** : Si le rouge JNIM (#B14B3C) est appliqué en couleur pleine (fill solid) sur la carte, ça fait "PowerPoint". 
   - *Fix* : Opacité 30-40% + `mix-blend-mode: multiply` (ou simulation SVG avec overlay de texture parchemin). Le rouge doit "tacher" le papier, pas le recouvrir.

2. **La typographie flottante** : Les tampons "JNIM" et "EIGS" si ils sont juste du texte sans ancrage géographique (ligne pointillée vers la zone).
   - *Fix* : Ligne leader SVG (beige, 1px) qui relie le tampon à la zone concernée, s'effaçant après 1s.

3. **L'absence d'espace négatif** : Si les véhicules tournent en rond au centre de l'écran sans "respiration".
   - *Fix* : **Règle des 1/3** : la caméra recentre la zone active sur les intersections des tiers, jamais au milieu exact. Crée du dynamisme compositionnel.

4. **Les ondes de choc "génériques"** : Si les ondes à f2167 sont des cercles parfaits expandant.
   - *Fix* : Cercles légèrement déformés (ellipse SVG avec `rx` et `ry` différents), ou ondes multiples décalées (3 cercles concentriques avec délai 0.1s).

---

### SECTION EXPERT (Point de vue pro)

**1. L'EXPERT qui connaît le métier**
- *Premier regard* : Il vérifie la **hiérarchie des échelles**. Il verrait que la transition du macro (pays) au micro (véhicules) manque d'échelles intermédiaires (régions/administrations).
- *Raté* : L'absence de **grille de lecture** (légende dynamique). Un pro mettrait une mini-barre latérale qui se remplit : "Présence JNIM" → barre rouge qui monte pendant f1198-f1500.
- *Animation manquante* : Le **morphing des frontières**. Quand on passe de la carte politique à la carte tactique, les lignes de front (beige) devraient se déplacer lentement (SVG path morphing) pour montrer l'érosion de l'état, pas juste apparaître.

**2. LE SPECTATEUR LAMBDA**
- *Ce qu'il cherche* : Une raison de s'intéresser à ces groupes. Il décroche à "tensions éleveurs/agriculteurs" s'il n'y a pas d'image concrète.
- *Où il décroche* : Entre f1800 et f2100 (longueur du segment EIGS). 
- *Fix* : Introduire un **élément de surprise** à f1900 : le blindé EIGS s'arrête, une "porte" s'ouvre (sprite swap), déployant un drapeau noir (simple rectangle SVG noir) pour symboliser la prise de contrôle. Action concrète, pas juste du mouvement.

---

### SPÉCIFICATIONS TECHNIQUES PAR FRAME

**[f750 transition nettoyage cognitif]** :  
Layer "PoliticalOverlay" (zones bleues/orange) : `opacity` 100% → 15% sur 30 frames (ease-out). Layer "Parchment" : brightness 100% → 110% (léger flash chaud) pour signifier le "retour au passé/historique".

**[f1198 J