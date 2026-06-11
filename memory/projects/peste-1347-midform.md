---
name: peste-1347-midform-concept
description: Concept validé — Peste 1347 en format mi-forme horizontal, angle Afrique sub-saharienne, doctrine Tremblay. Backlog prioritaire post-AES + Maroc.
metadata:
  type: project
---

# Peste 1347 — Mi-forme horizontal (concept validé 2026-06-07)

**Statut** : CONCEPT VALIDÉ — backlog prioritaire. Ne pas commencer avant fin AES + Maroc Batteries.
**Format cible** : Mi-forme 8-12 min | 16:9 horizontal | Moteur War-Map adapté | Narration Tremblay

**Why** : Angle "pourquoi la Peste n'a pas touché l'Afrique sub-saharienne" est absent sur YouTube dans toutes les langues (TubeLab confirmé). Sujet à forte demande (5M vues pour le meilleur documentaire EN). Pattern outlier validé : "angle inédit qui remet en question le récit standard" = 2,1M vues en 2026 (Paul Whitewick).

**How to apply** : Utiliser comme pilote du format Atlas-horizontal. Si ça marche, ouvre tout le catalogue historique (empires, migrations, renversements) avec le même cadre visuel.

---

## Angle éditorial validé

**Stratégie cheval de Troie** : titre parle à l'audience large Peste 1347 (saturé mais forte demande), l'angle africain arrive dans les 30 premières secondes comme révélation. Deux audiences fusionnent : passionnés histoire médiévale + audience Kora & Cartes.

**Titre candidat (style Tremblay)** :
> "La Peste noire a tué la moitié de l'Europe. Voici ce qu'elle n'a pas touché."

**Ton** : factuel, non-militant, non-souverain. Analytique pur. Neutralité totale = crédibilité maximale sur les deux audiences.

---

## Structure narrative (doctrine Tremblay)

1. **Hook — le paradoxe** (30s) : catastrophe démographique européenne + "et pourtant, au sud du Sahara, la vie continue"
2. **Acte 1 — Ce qu'on sait de la Peste** : détails humains concrets, pas encyclopédique
3. **Acte 2 — Le paradoxe géographique** : carte de propagation qui s'arrête au Sahara. Qu'est-ce que l'absence révèle sur l'organisation de l'Afrique sub-saharienne en 1347 ?
4. **Acte 3 — Le renversement de perspective** : Empire du Mali à son apogée pendant que l'Europe s'effondre. Tombouctou, universités, routes commerciales.
5. **Acte 4 — La question ouverte** : la protection démographique de l'AFS = une des raisons pour lesquelles les empires sahéliens du XVe siècle ont pu atteindre leur taille ?

---

## Stack technique

**Réutilisable depuis War-Map Sahel (~80%)** :
- Moteur `SahelWarMapEngine` en 16:9 natif
- Palette parchemin + couleurs zones validées
- Sprites caravanes (adapté depuis Sudan epic)
- Caméra frame-driven `useCurrentFrame`
- Cartouche date haut-droite + légende haut-gauche

**À créer** :
- Sprites bateaux génois (propagation maritime)
- Sprites ville médiévale européenne vs ville sahélienne
- Zones de propagation animées (rouge sombre sur Europe, or sur Sahara/AFS)
- Routes commerciales transsahariennes (pointillés animés)

---

## Données TubeLab (2026-06-07)

- Angle "Afrique + Peste" : **zéro concurrent dans toutes les langues**
- Vues outliers EN sur Peste : 800K–5M
- Vues outliers FR sur Peste : 500K–1,2M
- Signal fort 2026 : Paul Whitewick 2,16M vues sur "angle inédit Peste" (mars 2026, 252K subs)
- Concurrent direct FR : aucun dans le registre analytique géopolitique

---

## Visuels mockups générés (2026-06-07)

Trois frames générées par Gemini — validées visuellement par Aziz :
1. Carte propagation Europe rouge / Sahara or / Empire Mali bleu + caravanes + bateaux
2. Split 1350 : village européen désert vs Tombouctou vivante
3. Zoom Europe + Méditerranée : propagation s'arrête au Sahara

**Verdict Aziz** : "stop scroller", "donne vraiment envie de le voir", esthétique proche de notre rendu réel.
