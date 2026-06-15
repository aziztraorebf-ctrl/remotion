 **BRIEF DA — REFONTE HOOK WAR-MAP SAHEL AES**
*Analyse & Mise en scène frame-driven (React/SVG/Lucide)*
*Date : 2026-06-15 | Stack : WarMapDimmedOverlay, countryOutline, jetons-factions, SahelAttackArrow, WarMapOverlayDynamic, stroke-dashoffset SVG, grain papier*

---

## 1. DIAGNOSTIC AI-SLOP DU HOOK ACTUEL

**Ce qui crie "généré sans DA" dans la version existante :**

| Problème technique | Pourquoi ça trahit l'amateurisme | Piste de correction (notre stack) |
|---|---|---|
| **Carte beige statique 0-3s** | Aucun choc d'entrée. Ressemble à un template PowerPoint "présentation régionale". | **Cold-open flash** : 1 frame blanc + grain maximum + les 3 pays qui apparaissent en scale 0→1.2→1 (spring) dès la frame 2. |
| **Légende dashboard en haut à gauche** | Registre "rapport d'activité" froid, pas "rupture géopolitique". L'œil lit avant de regarder la carte. | **ÉCARTÉ** — Pas de légende dans le hook. Les couleurs doivent être auto-explicites (ocre/brique/sarcelle) ou révélées par l'action. |
| **Timeline linéaire en bas** | Crée une attente passive ("on va avancer doucement") alors que le texte parle d'explosion. | **ÉCARTÉ** — La timeline n'apparaît qu'à 22s (pivot "retour en arrière"). Avant : temps présent uniquement. |
| **Remplissage territorial progressif** | Lent, sans tension. On colore comme un cahier de coloriage. | **Remplacé par** : apparition brutale des zones de conflit (rouge) synchronisée avec le verbe "chassent". |
| **Typographie sans hiérarchie** | Si texte il y a, il flotte sans ancrage spatial. | **WarMapOverlayDynamic** (mode fullscreen) avec texte ancré à des coordonnées géo fictives (ex : "Comment ?" positionné sur l'Atlantique, hors carte). |

---

## 2. MISE EN SCÈNE SECONDE PAR SECONDE (0-28s)

**Principe directeur :** Un **beat visuel** par proposition audio. Pas de plan fixe > 1.5s. Escalade : Choc → Ancrage → Coup 1 → Coup 2 → Coup 3 → Métamorphose → Questionnement.

| Temps | Audio (verbatim) | Visuel | Template/Brique utilisé(e) | Justification éditoriale |
|---|---|---|---|---|
| **0.0-1.2s** | *[Silence/respiration]* | **COLD OPEN** : Écran noir → Flash blanc (1 frame) → Grain papier intense (80%). Les 3 pays (Mali ocre, Burkina brique, Niger sarcelle) apparaissent en SVG **scale 0→1.15→1** (easing: spring, tension 180). Le reste de l'Afrique est gris foncé quasi noir. | `countryOutline` (flash initial) + `grain papier` + `pulse régions` | Choc immédiat. On ne présente pas, on frappe. Le spectateur lambda comprend instantanément : "3 pays, 3 couleurs, c'est leur histoire". |
| **1.2-4.5s** | "En moins de trois ans, trois pays ont tout changé en même temps." | Zoom out rapide (frame-driven, 12 frames) pour révéler le Sahel. Les 3 pays **pulsent** (opacity 0.8→1) en rythme avec "trois". Chiffre "3" géant (SVG text, fill blanc) apparaît au centre puis se rétracte vers le bas. | `WarMapDimmedOverlay` (trous lumineux sur les 3 pays) | Ancrage spatial. On passe du choc à la géographie. Le "3" visuel synchronise l'oreille et l'œil. |
| **4.5-7.1s** | "Ils chassent leurs partenaires militaires." | **COUP 1 (EXPULSION)** : Jetons "militaires" (icônes Lucide : `Shield` ou `Flag`, couleur bleue UE) présents sur Bamako, Ouagadougou, Niamey. Animation : les jetons sont **expulsés vers le haut de l'écran** (translateY -200px + rotation 45° + fade out). Trajectoires rouges (lignes SVG) matérialisent la fuite. | `jetons-factions` + `SahelAttackArrow` (inversé, direction sortante) + `RefugeeFlow` (adapté pour un mouvement unidirectionnel vers le Nord) | Incarnation du verbe "chasser". C'est physique, pas métaphorique. Le spectateur voit la séparation. |
| **7.1-9.3s** | "Rompent leurs alliances historiques." | **COUP 2 (CASSURE)** : Lignes blanches (stroke-dasharray) relient les 3 pays à des icônes d'alliance (étoiles UE, drapeaux US/France simplifiés en SVG géométrique). **Animation stroke-dashoffset** : les lignes se "dessinent" en sens inverse (disparaissent) avec un effet de **snap** (casse brutale) à la frame 9s. Les icônes d'alliance deviennent grises puis s'effacent. | SVG path natif (stroke-dashoffset animation) + `WarMapDimmedOverlay` (pour griser les anciens alliés) | Le verbe "rompre" devient une rupture visuelle de lignes. Cause (pays) → Effet (liens qui claquent). |
| **9.3-12.6s** | "Et quittent la principale organisation régionale du continent." | **COUP 3 (EXTRACTION)** : Un cercle géant (CEDEAO) englobe les 3 pays. Les pays **sortent du cercle** (clipPath qui rétrécit sur eux, ou scale down du cercle pendant que les pays montent en Z-index). Le cercle reste en arrière-plan, **assombri** (opacity 0.3). Les 3 pays se regroupent légèrement (convergence géométrique). | `WarMapDimmedOverlay` (assombrissement CEDEAO) + `GeoConvergenceOverlay` (début de rapprochement) | Visualisation de la sécession. On sort d'un ensemble pour former un bloc. |
| **12.6-16.2s** | "Et bâtissent, à la place, quelque chose de nouveau." | **TRANSFORMATION** : La carte "politique" (couleurs unies) se **fissure** (effet grain + lignes de fracture SVG) pour révéler la carte "guerre" (zonage contrôle territorial : rouge jihadiste, bleu État, orange contesté). Un **sceau AES** (triangle liant les 3 pays) apparaît au centre avec un flash. | `P3 transformation carte géo→guerre` (proto à porter) + `WarMapDimmedOverlay` (trou lumineux sur le sceau) | La métaphore tenue : le même objet (la carte) change de nature (paix→guerre/construction). |
| **16.2-21.0s** | "Comment est-ce possible ? Et surtout... pourquoi maintenant ?" | **BOUCLE OUVERTE** : Écran quasi noir (dimmed 90%). Les mots "**COMMENT ?**" puis "**POURQUOI MAINTENANT ?**" apparaissent en typographie massive (SVG text, font bold, blanc cassé) avec un **effet pulse** (scale 0.9→1.1→1) et un léger **glitch horizontal** (translateX ±2px, 3 frames). | `WarMapOverlayDynamic` (mode fullscreen) + animation CSS texte | Les questions deviennent des objets visuels qui hantent l'écran. Pas de réponse = tension retenue. |
| **21.0-28.5s** | "Pour répondre, il faut d'abord regarder ce qui existait avant. Et ce qui ne fonctionnait plus." | **PIVOT** : Fondu enchaîné vers la carte "avant" (beige des années 2020). La **timeline** apparaît enfin (barre horizontale basse), curseur à 2020. La caméra **zoome** vers une zone spécifique (ex : nord Mali 2012) pour commencer le récit rétrospectif. | `WarMapDimmedOverlay` (fondu) + timeline simple (HTML overlay) | On tient la promesse : on retourne dans le passé. La timeline justifie son existence seulement ici. |

---

## 3. RÉPONSES AUX ANGLES OBLIGATOIRES

### 3.1 Spectateur Lambda (Hiérarchie du regard)
- **0-1s** : L'œil est capté par le flash puis les 3 taches colorées (ocre/brique/sarcelle). Compréhension immédiate : "Trois pays."
- **4-12s** : L'œil suit les mouvements (jetons qui sortent, lignes qui cassent, cercle qui s'ouvre). C'est du **cause→effet** pur, pas besoin de connaître la CEDEAO pour comprendre "sortie d'un club".
- **17-21s** : L'œil est forcé de lire (texte fullscreen). La question est posée directement au spectateur.
- **Risque de décrochage** : Si on garde la légende dashboard, le spectateur lit la légende au lieu de regarder l'action. **Solution** : suppression totale de la légende dans le hook.

### 3.2 Narration/Synchro (Beat visuel)
Chaque phrase audio a son **équivalent visuel moteur** :
- "Chassent" = Translation physique (mouvement)
- "Rompent" = Cassure de ligne (rupture)
- "Quittent" = Extraction géométrique (séparation)
- "Bâtissent" = Transformation de la matière carte (métamorphose)

Pas de redondance : la voix dit "chassent", on voit l'expulsion. La voix ne décrit pas ce qu'on voit (pas de "on voit les drapeaux partir"), elle commente l'action.

### 3.3 Transitions vs États
- **Pas d'état figé > 1.5s**. Même la carte de départ pulse.
- **Transitions animées** : Tous les changements sont des **morphings** (scale, translate, stroke-dashoffset) jamais des cuts secs.
- **Enchaînement** : La fin du "quittent" (pays regroupés) enchaîne naturellement sur le "bâtissent" (sceau qui apparaît au centre du regroupement).

### 3.4 Test AI-SLOP (Spécifique technique)
**Ce qui éviterait le look "procédural" :**

| Élément AI-Slop à éviter | Solution dans notre stack |
|---|---|
| **Particules flottantes** (trop générique, After Effects-like) | **ÉCARTÉ**. Remplacer par des **lignes SVG tracées** (stroke-dashoffset) entre points d'ancrage concrets (ex : capitales). |
| **Blur CSS** sur les overlays | **ÉCARTÉ** (interdit par la contrainte). Utiliser `WarMapDimmedOverlay` avec opacité variable et **trous lumineux** nets (masque SVG). |
| **Typographie système sans personnalité** (Arial/Helvetica) | Utiliser une **font condensée bold** (ex : Oswald ou Anton) en SVG text, avec **tracking serré** pour les chocs ("CHASSENT", "COMMENT ?"). |
| **Couleurs saturées type "dataviz Google"** | Respecter la charte **ocre #D98A3D / brique #C0553C / sarcelle #4E8C7D** avec un **grain papier** par-dessus (texture organique qui casse la netteté digitale). |
| **Icônes flottantes sans contexte** | Ancrer chaque icône Lucide (`Shield`, `Flag`, `X`, `Skull`) à une **coordonnée géo précise** (Bamako, etc.) avec un **jeton** qui porte l'icône, pas l'icône seule. |

### 3.5 Expert du métier (Ce qu'un pro ajouterait)
- **La grammaire causale** : Un pro ne montre pas "la France" puis "le départ". Il montre **la France qui est poussée** (flèche rouge venant des pays). Cause = les pays (actifs), Effet = l'expulsion (réaction).
- **L'espace négatif** : Entre 12s et 16s, la carte devient presque entièrement rouge/orange (conflit) sauf les 3 pays qui forment une **île de couleur vive** au centre. C'est le "quelque chose de nouveau" qui émerge du chaos.
- **Le son visuel** : Même sans audio, les **flashs blancs** (1 frame) aux moments clés (début, "chassent", "bâtissent") créent un rythme interne.

---

## 4. SYNTHÈSE EXTRACTIVE TRACÉE (G = Gemini / K = Kimi)

| Idée | Attribution | Verdict | Raison |
|---|---|---|---|
| **Cold-open flash + grain 0-1s** | G | **RETENU** | Seul moyen de casser le "mou" instantanément. Codable : 1 frame blanc + spring scale sur countryOutline. |
| **Suppression légende dashboard** | K | **RETENU** | Libère l'œil. La légende revient plus tard si nécessaire. |
| **Jetons militaires expulsés (translateY)** | G | **RETENU** | Incarnation physique de "chasser". Utilise `jetons-factions` + `RefugeeFlow` (inversé). |
| **Lignes alliances qui cassent (stroke-dashoffset)** | K | **RETENU** | Métaphore visuelle forte de "rompre". Codable en SVG natif, pas besoin de lib externe. |
| **Cercle CEDEAO qui s'ouvre (clipPath)** | G | **RETENU** | Visualise "quitter" comme une extraction. Utilise `WarMapDimmedOverlay` pour l'assombrissement du cercle restant. |
| **Transformation P3 carte→guerre** | K | **RETENU** | Le cœur du gabarit A. Le proto existe, il faut juste l'intégrer au bon timing (12-16s). |
| **Questions en fullscreen pulse** | G | **RETENU** | `WarMapOverlayDynamic` mode fullscreen + CSS animation scale. Crée la boucle ouverte visuelle. |
| **Paradoxe richesses/drame (or vs skull)** | K | **OPTION** | Risque de surcharge en 2s. À tester : si trop dense, déplacer à 22s (début explicatif). |
| **Timeline dès le début** | G | **ÉCARTÉ** | Trop passif pour un hook. Introduite seulement à 22s. |
| **Split-screen 3 volets pour les 3 pays** | K | **ÉCARTÉ** | Divise l'attention. Le hook doit montrer l'**unité** de l'action (les 3 pays font la même chose en même temps), pas leur séparation. |
| **Typographie "glitch" aggressive** | G | **OPTION** | Si le "glitch" fait trop "effet spécial cheap", remplacer par un simple **pulse** (scale) plus élégant. |
| **Son visuel (flash frames)** | K | **RETENU** | 1 frame blanc aux cuts principaux. Crée un rythme "montage" même en frame-driven. |

---

## 5. CHECKLIST CODABLE (Stack React/SVG)

- [ ] `countryOutline` avec animation spring (scale) au montage
- [ ] `WarMapDimmedOverlay` avec `dimmedOverlayHole()` sur les 3 pays (trous lumineux)
- [ ] `jetons-factions` : créer variante "militaire" (icône Lucide `Shield` ou `Flag`)
- [ ] `SahelAttackArrow` : modifier pour direction **sortante** (vers le Nord)
- [ ] SVG paths pour les alliances (stroke-dasharray animation inverse)
- [ ] `GeoConvergenceOverlay` : rapprochement des 3 centres géométriques
- [ ] `WarMapOverlayDynamic` : mode fullscreen pour les questions typographiques
- [ ] Grain papier : overlay CSS `pointer-events: none` sur toute la durée du hook
- [ ] Timeline : composant simple, masqué jusqu'à 22s

**Résultat attendu** : Un hook qui pourrait être coupé et posté seul comme un Short/TikTok (vertical ou 16:9), compris sans son, et qui donne envie de voir la suite pour avoir les réponses aux questions posées visuellement.