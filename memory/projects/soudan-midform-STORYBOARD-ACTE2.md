---
name: soudan-midform-STORYBOARD-ACTE2
description: Storyboard Acte 2 (Blocage) du mid-form Soudan — vision visuelle Aziz 2026-06-16 + corrections factuelles (coup 2021 ≠ bataille ; bataille = avril 2023). Jeton 2-visages = symbole neuf.
metadata:
  type: project
---

# STORYBOARD — SOUDAN ACTE 2 (BLOCAGE)

> Pour [[soudan-midform]] · données [[soudan-midform-DONNEES]] · suite de [[soudan-midform-STORYBOARD-ACTE1]] · format War-Map Long.
> Script jet 1 ci-dessous (à valider Aziz). Audio V3 pas encore généré.

## ⛔ CORRECTIONS FACTUELLES (vérifiées Tavily 2026-06-16 — ne pas storyboarder du faux)
1. **Coup oct. 2021 = PAS une bataille.** al-Burhan dissout le gouvernement de transition + arrête le PM **Abdalla Hamdok**. Coup « par le haut », pas un assaut de bâtiment. → scène SOBRE, pas de fumée/ruines pour 2021.
2. **La bataille = avril 2023** (là, le visuel guerrier est RÉEL et MEILLEUR) : 15 avr. 2023 ~9h, la RSF attaque SIMULTANÉMENT plusieurs sites de Khartoum : **aéroport international, palais présidentiel, télévision d'État** + bases (Merowe, Soba). = exactement l'idée « plusieurs points sur la carte », mais vraie.
3. Déclencheur 2023 = désaccord sur **l'intégration des 100 000 hommes RSF dans l'armée** (« qui commande ? »). Médiation (Framework Agreement) échoue dessus.
4. Contexte amont (ne PAS surcharger) : gouvernement civil né après la révolution de 2019 (chute d'Omar el-Béchir). Nommer Hamdok suffit ; ne pas raconter 2019 en détail.

## ⭐ SYMBOLE NEUF — LE JETON À DEUX VISAGES (invention Aziz 2026-06-16)
Un seul jeton, une LIGNE verticale au milieu, **deux demi-visages** (Hemeti | al-Burhan). PAS un visage chimère — deux moitiés nettes côte à côte.
- **Naît** quand ils s'allient (2021) : le jeton-mixte se forme/pulse.
- **Se fend** le long de la ligne quand la question « qui commande ? » se pose (tension).
- **Se sépare** en DEUX jetons distincts (avril 2023) = retour à l'état du début de l'Acte 1. Boucle visuelle.
→ Un objet raconte tout l'arc alliance→scission. Candidat SIGNATURE série War-Map. À ajouter au vocabulaire (voir [[soudan-midform-DONNEES]] parti pris visuel).

---

## BEAT PAR BEAT

| # | Script (voix) | Visuel |
|---|---|---|
| 1 | « Pour comprendre cette guerre, il faut revenir deux ans en arrière. Car ces deux hommes n'étaient pas ennemis. Ils étaient alliés. » | **Table rase sur la carte** (on efface l'état Acte 1). Khartoum au centre. Les 2 jetons généraux se rapprochent. |
| 2 | « En 2021, ensemble, ils renversent le gouvernement de transition du Premier ministre Abdalla Hamdok… L'armée et la milice, main dans la main. » | ⭐ **Les 2 jetons FUSIONNENT en JETON-MIXTE 2-visages** (pulse). Scène SOBRE (coup par le haut). Option : un symbole « gouvernement civil » (drapeau SVG ? icône Hamdok ?) s'efface/se ternit. PAS de bataille ici. |
| 3 | « Mais un pays ne peut pas avoir deux armées. La question : qui commande l'autre ? Aucun n'a voulu plier. » | ⭐ **Le jeton-mixte SE FEND le long de la ligne** (tension, vibration). Option : **une frontière se trace** entre est et ouest (suggérer la future scission). |
| 4 | « En avril 2023, la rivalité tourne à la guerre ouverte. Chaque camp accuse l'autre d'avoir tiré le premier. » ⛔ (corrigé fact-check : NE PAS dire « Hemeti frappe le premier » = récit disputé/propagande) | ⭐ **Le jeton-mixte se SÉPARE en 2 jetons distincts** (retour état Acte 1). |
| 5 | « Au matin du 15 avril 2023, la RSF attaque la capitale sur plusieurs fronts à la fois. » | **Table rase, on garde Hemeti + ses forces. PITCH 0 (vue à plat).** Flèches RSF (`SahelAttackArrow`) qui jaillissent vers **3-4 points NOMMÉS simultanément** : aéroport, palais présidentiel, TV d'État (images Gemini/PixelLab pour les bâtiments). ⚠️ **TEST À FAIRE : animation PixelLab d'objets (chars/avions) jamais testée — proto à valider.** Sinon : images statiques Gemini/PixelLab qui bougent (trajectoire connue). Avions = lignes tracées (`GeoFlowConnection`). **Séquentiel** : avion passe sur un bâtiment → explosion PixelLab (fx-explosion déjà dispo) au point d'impact. |
| 6 | « L'armée, elle, a les avions et les chars lourds. Sur le papier, l'armée devrait gagner. Dans les faits, elle n'y arrive pas. » | Introduire la force SAF (chars `tank-td-blue`, bases Gemini, avions). ⚠️ **DÉFI = ne pas surcharger** : Fade to Background systématique. **Overlay léger « territoire vs puissance de feu » → À ARBITRER** (voir reco ci-dessous). |
| 7 | « La raison tient à la géographie. Le Soudan est immense… l'armée doit ravitailler sur plus de mille kilomètres de pistes. » → **RESPIRATION** | **Dézoom** sur l'immensité (template forces à choisir/créer — checker MAPBOX-COMPOSANTS + map-animation R&D). Ligne de ravitaillement SAF qui s'étire de l'est vers l'ouest. |
| 8 | « Résultat : depuis plus de trois ans, le front bouge à peine… [grave] Une guerre que personne n'a pu gagner… mais que personne ne veut arrêter. » ⛔ (corrigé 2026-06-16 : « deux ans »→« plus de trois ans » pour cohérence temporelle avec Acte 1 ; guerre = avril 2023, on est mi-2026 = 3e année) | Front quasi-figé (micro-oscillation). Le mot « arrêter » suspend → **pulse léger sur l'or au Darfour** (pont Acte 3). |
| 9 | « Pour comprendre pourquoi, il faut maintenant sortir du Soudan. » | **Dézoom amorcé hors Soudan** → prépare Acte 3 (EAU/Turquie). |

---

## MES PROPOSITIONS sur les points ouverts d'Aziz

**Overlay « territoire vs puissance de feu » (beat 6)** — reco : **garder sur la carte, PAS d'overlay**. Montrer le déséquilibre PAR la carte : zone RSF large (territoire) MAIS icônes avions/chars concentrées côté SAF (puissance de feu). Plus parlant qu'un graphe à barres. Si vraiment besoin de chiffrer → cartouche géo-ancré minimal, pas plein écran. (Doctrine révisée : carte d'abord, plein écran seulement si ça coince — ici ça ne coince pas.)

**Ligne de ravitaillement qui se fragilise (beat 7)** — reco : **SVG animé maison** (registre sous-exploité à l'AES). Une ligne pointillée est→ouest (`stroke-dasharray`) qui s'AMINCIT et dont les pointillés s'espacent à mesure qu'elle s'éloigne de l'est. Optionnel : 1-2 points de rupture qui clignotent rouge (embuscades documentées : colonne de secours SAF défaite juil. 2023). Lisible, pas cher, vivant.

**« arrêter » qui suspend (beat 8)** — reco : combiner audio + visuel. Audio = ellipse `...` (pas de [pause], voix déjà lente). Visuel = TOUT se fige 1,5s sauf un seul élément qui vit : le pulse de l'or au Darfour qui s'allume doucement. Le contraste fixe/vivant fait la suspension.

**Drapeaux/SVG (rappel Aziz)** : sous-exploités à l'AES. Pistes Acte 2 : drapeau soudanais qui se déchire en deux au beat 4 (scission) ; marqueurs géométriques simples pour les bases (carré=base fixe ≠ jeton rond mobile, règle AES).

## CONTRAINTES (rappel)
- Pitch 0 OBLIGATOIRE pour le beat 5 (avions/drones top-down nets, antipattern A5).
- Plafond ~5-6 sprites simultanés + Fade to Background.
- Chaque lieu nommé (aéroport, palais, TV) = point qui s'allume au mot exact.
- ⚠️ Animation objets PixelLab = **À TESTER** (jamais fait) — proto avant de s'engager.

## STATUT
Script Acte 2 : jet 1 fact-checké + correction temporelle. Storyboard : 1er jet + corrections. Pas codé.

## ⚠️ AUDIO À RÉGÉNÉRER (Acte 2)
L'audio actuel https://files.catbox.moe/pco5ra.mp3 a été généré AVANT la correction temporelle (« depuis deux ans » → « depuis **plus de trois ans** » + « personne ne peut gagner » → « personne **n'a pu** gagner »). **DONC PÉRIMÉ** → à régénérer au lock audio final. Voir note centralisée [[soudan-midform-AUDIO-ETAT]].

Liens : [[soudan-midform-STORYBOARD-ACTE1]] · [[WARMAP-LONG-DOCTRINE]] · [[WARMAP-ANIMER-OBJETS]] · [[TTS-V3-TAGS-REGLES]].
