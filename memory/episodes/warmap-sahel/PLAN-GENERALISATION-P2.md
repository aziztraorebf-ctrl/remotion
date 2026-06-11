# Plan de généralisation Partie 2 — voie premium validée (2026-06-11)

> Modèle de référence VALIDÉ Aziz : `Proto24Extinction.tsx` (= beat 2.4). Render `proto24-v7-staticzone-FULLHD.mp4` (catbox 6dnz3z).
> Objectif : refaire les 5 AUTRES beats P2 sur ce modèle (la version `Partie2Blocage.tsx` est REJETÉE — plate, SVG niveau-1).

## Les invariants du modèle 2.4 (à appliquer partout)

1. **Marqueurs = sprites Gemini** (encre fine, ~0.22 vmin, ancrés au pied), PAS d'étoiles/cercles SVG nus.
2. **Effets organiques = PixelLab** (fumée/poussière, ping-pong ambiant ou one-shot ponctuel selon doctrine).
3. **Zones d'emprise = STATIQUES** (croissance unique ~30f à l'installation puis figé ; contour déchiqueté déterministe `jag()` IMMOBILE). PAS de blob qui ondule. Le mouvement vient des marqueurs/effets, pas du contour.
4. **Caméra serrée qui suit l'action** (getProto24Cam-like dans le moteur), pitch flat (indifférent vs 32 ici → flat par défaut).
5. **Discipline anti-saturation** : 1 foyer d'attention à la fois. Effets espacés. Pas de chiffres flottants superflus.
6. **Disparition = effacement total** (opacity→0), pas désaturation partielle, pour "territoire perdu / plus rien".

## Triggers V5 (alignment ×30fps) — source de vérité `narration-v5-alignment.json`

| Beat | Trigger | Frame | Contenu |
|---|---|---|---|
| 2.1 Serval/Barkhane | F_SERVAL / F_BARKHANE | 3196 / 3268 | bases FR apparaissent (Gao/Ménaka/Tessalit) + "2013" |
| 2.2 présence FR | F_PRESENTE / F_AUTOUR | 3419 / 3443 | overlay GeoConvergence (présence pré-positionnée) SOBRE |
| 2.3 MINUSMA | F_MINUSMA | 3660 | points ONU (Kidal/Tombouctou/Mopti), teinte bleu-ONU |
| **2.4 échec 10 ans** | **F_ECHEC** | **3887** | ✅ FAIT (Proto24Extinction) — zone rouge + bases tombent + fumée |
| 2.5 villes/campagnes | F_VILLES / F_CAMPAGNES | 4384 / 4421 | villes tenues (points) ; rouge progresse dans le rural |
| 2.6 Burkina déborde | F_DEBORDENT / F_BURKINA | 4955 / 4976 | rouge franchit Mali→Burkina, "2015" |
| (fin) Niger/CEDEAO | F_NIGER / F_CEDEAO | 5380 / 5639 | Niamey bascule (flash SVG net) + anneau CEDEAO (pont P3) |

## Refonte beat par beat

### 2.1 Serval/Barkhane — apparition des bases FR
- AVANT (rejeté) : étoiles bleu-acier SVG rigides qui "frappent".
- PREMIUM : sprites `base-fr-td.png` (les MÊMES que 2.4, cohérence) apparaissent en spring staggered. Repère "2013" en cartouche encre.
- Effet PixelLab : poussière de déploiement `fx-dust/` (ambiant court ping-pong) au pop de chaque base — À JUGER (asset en cours de génération). Si "sobre = mieux", retirer.
- Lien narratif fort avec 2.4 : ces mêmes fortins TOMBERONT au 2.4. Installer = poser ce qui sera détruit.

### 2.2 présence FR pré-positionnée — overlay convergence
- AVANT : lignes pointillées SVG fines convergentes (sobre mais plat).
- PREMIUM : garder l'idée convergence MAIS via `GeoConvergenceOverlay.tsx` (déjà validé, asset existant) OU sprites forces FR (epervier/licorne/sabre.png présents) géo-ancrés autour du Mali qui pulsent. Correction Sonar #5 : PAS de total chiffré faux ("~1650 hommes").
- Beat court, voix minimale, l'overlay PORTE. Rester sobre = OK ici (c'est de l'abstrait stratégique).

### 2.3 MINUSMA — points ONU
- AVANT : double anneau béret bleu-ONU SVG.
- PREMIUM : sprite Gemini casque/béret ONU OU point institutionnel propre + halo. Distinct des bases FR (couleur + forme). À générer si on veut un marqueur Gemini ; sinon point soigné + halo suffit (marqueur secondaire).

### 2.5 villes/campagnes — l'analyse
- AVANT : villes = points tenus, rouge progresse dans le rural.
- PREMIUM : villes tenues = points/sprites nets (bleu) ; le rural = ZONE rouge statique (modèle 2.4) qui occupe l'entre-deux. Optionnel : feu/fumée de brousse `fx-smoke` diffuse le long du bord (le rural qui brûle). Beat ANALYTIQUE → calme, lisible, pitch flat.

### 2.6 Burkina déborde
- AVANT : foyers rouges franchissent la frontière + "40%".
- PREMIUM : zone rouge statique (modèle 2.4) qui s'étend au nord Burkina (Djibo/est), repère "2015". Fumée sur les nouveaux foyers (cohérence 2.4). "40%" : data-viz ancrée discrète OU supprimé (la voix le dit).

### fin — Niger bascule + CEDEAO (pont P3)
- Niamey s'allume : FLASH SVG ponctuel net (rupture = coup d'État ; marqueur net = pas PixelLab, doctrine).
- Anneau CEDEAO : pays orange autour + flèches menace vers Niamey (pont vers Partie 3). Garder sobre.

## Intégration technique
1. Refondre `Partie2Blocage.tsx` sur le modèle `Proto24Extinction.tsx` (couche pure `({ ctx })`).
2. Intégrer le contenu 2.4 (Proto24Extinction) DANS le flux P2 au bon trigger (F_ECHEC=3887) — actuellement compo séparée.
3. Caméra : `getPartie2Cam` qui suit chaque foyer d'action (serrée, raccord exact depuis fin P1).
4. Re-render P2 complète full HD (f3000-5690), juger, finir.
5. Triggers TOUJOURS recalés sur `narration-v5-alignment.json`.

## État effets PixelLab P2
- ✅ `fx-smoke/` (9f ambiant) — fumée de chute, réutilisable 2.5/2.6.
- ✅ `fx-explosion/` (9f ponctuel) — acquis catalogue, désactivé 2.4, pour futur beat détonation.
- 🔄 `fx-dust/` poussière déploiement 2.1 — pont Gemini→PixelLab en cours (object 6fce47a4). À JUGER.
