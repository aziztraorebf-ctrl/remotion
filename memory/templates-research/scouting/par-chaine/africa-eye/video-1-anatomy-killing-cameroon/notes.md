# Africa Eye — Cameroon: Anatomy of a Killing

- Source : https://youtube.com/watch?v=XbnLkc6r3yc
- Durée : 11m06 (666s) — format 16:9 docu (pas vertical)
- Vues : 4.85M — exemplaire le plus connu d'Africa Eye, base de cas pour la méthode OSINT BBC
- Date : 2018

## PALETTE — verdict 🟢

- Footage source brut (mobile) : tons sable/ocre désaturés `#A39074` à `#C4A57B`, ciel poussiéreux gris-blanc
- Satellite Google/DigitalGlobe : noir et blanc poussé, contraste fort `#1C1C1C` → `#E8E8E8` (frame 004)
- Red BBC signature : `#D0021B` (cercles, arcs, barre date pleine largeur). Toujours rouge plein, jamais transparence
- Texte over satellite : blanc pur `#FFFFFF` sur barre rouge pleine `#D0021B`, sans-serif condensed (BBC Reith Sans-like)
- Attribution coin haut-droit : `Google, Digital Globe` ou `Digital Globe`, blanc 70% opacity, micro-rectangle rouge à droite de l'attribution
- Logo BBC coin haut-gauche : carré blanc avec lettres noires (frame 001 visible)
- Ratio dominant : 60% footage témoin couleur naturelle / 25% satellite N&B + rouge / 15% interview studio (frame 007)

## ASSETS — verdict 🟢

OSINT signature très reproductible :
- Cercle rouge `stroke 4-6px` pour pointer un détail (frame 004 — circle rouge sur cabane)
- Arc/courbe rouge `stroke 5-8px` pour tracer trajectoire/relier point au sol au point satellite (frame 003 split-screen)
- Barre date pleine `#D0021B` avec texte blanc CAPS — frame 004 "20TH MARCH - 5TH APRIL 2015"
- Path rouge sur terrain 3D Google Earth (montagnes texturées) — frame 005, ligne brisée qui suit la crête
- Path jaune secondaire fin (1-2px) pour itinéraire au sol — frame 005
- Split-screen vertical 50/50 : footage gauche / satellite droite, séparation par bande noire 4-6px — frames 003, 005
- Filigrane "Getty Images" / "Google, Digital Globe" : Helvetica/Arial blanc, taille ~14px, padding 12px coin haut-droit
- Pas d'iconographie cartographique stylisée (pas de drapeaux, pas de markers custom). Tout est pur Google Earth + tracé manuel rouge

## CAMÉRA — verdict 🟢

- Push-in lent sur satellite Google Earth (3D terrain) : tilt + dolly forward, ~3-5s par segment
- Pull-out depuis détail satellite vers vue large : signature didactique
- Ken burns sur footage source mobile (footage déjà shaky, on fige + push slow)
- Coupe sèche de footage couleur → satellite N&B (rupture éditoriale = "on entre dans l'analyse")
- Rotation 3D Google Earth pour montrer relief montagneux : confirme les chaînes de collines des témoignages
- Match-cut entre forme dans footage et même forme vue d'avion (frame 005 : ligne de crête rouge identique gauche/droite)
- Pas de drone propre BBC — uniquement satellite + footage trouvé. Limite assumée

## APPLICABILITÉ SOUVERAIN

- Pattern split-screen footage/satellite + arc rouge connecteur = directement portable Mali/Sahel (Wagner, sites mining illégaux)
- Barre date rouge pleine largeur = format identifiable, simple à coder en Remotion (Rect + text caps blanc)
- Satellite N&B + cercle rouge = recette à 1 layer Mapbox style monochrome + SVG overlay rouge
- ATTENTION : ratio horizontal 16:9. Pour Souverain Short 9:16, on récupère **le langage** (split, cercle, arc, barre date) pas le cadrage
- À tester : split-screen vertical (footage haut / satellite bas) en 1080x1920
