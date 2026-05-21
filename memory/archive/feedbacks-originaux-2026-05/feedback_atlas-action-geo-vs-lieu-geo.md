---
name: Atlas — Action geo vs Lieu geo (deux patterns distincts)
description: Quand utiliser carte SVG vs insert plein ecran — lecon Hannibal Beat 2
type: feedback
---

# Atlas — Action geo vs Lieu geo

> Lecon extraite de Hannibal Beat 2 (traversee du Rhone). Erreur : pattern "lieu geo" applique a une scene "action geo".

## Les deux types de scenes

### Type 1 — "Lieu geo"
**Sujet** : montrer UN endroit (ville, marche, cour royale, empire)
**La carte est le SUJET**
**Sprites** : illustrent le lieu, pas l'action
**Pattern** : zoom fort sur 1 POI via svgToComp() + camera-track + spotlight insert
**Exemples valides** : Empire Ghana (Koumbi Saleh), Mansa Moussa (Tombouctou), Hannibal Beat 1 (Carthage)
**Sprite visible** : oui, position fixe ou deplacement lent sur le POI

### Type 2 — "Action geo"
**Sujet** : montrer UN MOUVEMENT, un franchissement, une bataille
**La carte est le CONTEXTE**
**Sprites** : doivent RACONTER l'action (combat, traversee, ascension)
**Pattern** : insert plein ecran avec background Gemini/PixelLab, sprites en CSS pur, carte SVG absente
**Exemples valides** : Hannibal Beat 2 (traversee Rhone avec elephants), bataille (formation, charge)
**Sprite visible** : oui, en grand, lisible, avec action animee

## L'erreur a ne pas reproduire

Hannibal Beat 2 — on a applique le pattern "lieu geo" a une traversee :
- Carte SVG zoom 2.5x + svgToComp() positionnement
- Resultat : elephants de 3mm sur l'Atlantique, traversee illisible
- L'action se perdait dans le contexte macro

**Cause racine** : la carte macro (pays entiers visibles) rend tout sprite microscopique. La puissance narrative disparait.

## Arbre de decision

```
La scene montre :
  |- UN ENDROIT (ville, empire, marche, palais)
  |    -> TYPE 1 "lieu geo"
  |    -> Carte SVG + svgToComp() + camera-track + spotlight insert
  |
  |- UN MOUVEMENT / FRANCHISSEMENT / COMBAT
       -> TYPE 2 "action geo"
       -> Insert plein ecran + background Gemini/PixelLab + sprites CSS
       -> Carte SVG UNIQUEMENT pour contexte geo (~5s, puis coupe)
```

## Pattern Type 2 — "Action geo"

1. **Beat ou sous-beat de contexte** (5s max) : carte SVG zoom modere, fleche/route animee, label POI. Etablit le "ou".
2. **Insert plein ecran** : background genere (Gemini terrain, PixelLab scene), sprites CSS en grand (min 120px). Raconte le "quoi".
3. **Retour carte** possible si besoin de re-contextualiser apres l'action.

Sprites CSS insert plein ecran :
```tsx
<Img src={staticFile("elephant.png")}
  style={{ width: 160, position: "absolute", left: `${x}%`, bottom: 200,
    imageRendering: "pixelated" }} />
```

## Criteres de detection rapide

| Critere | Lieu geo | Action geo |
|---------|----------|------------|
| Peut-on voir l'action a zoom 2.5x sur la carte ? | Oui | Non |
| Les sprites sont-ils passifs ou en mouvement narratif fort ? | Passifs | Narratif fort |
| L'action dure plus de 3s et change d'etat ? | Non | Oui |
| L'echelle des sprites compte-t-elle pour la comprehension ? | Peu | Critique |

## Why

Sur une carte macro (plusieurs pays visibles), un sprite de 64px occupe ~2-3mm visuellement. Impossible de lire un combat ou une traversee. L'insert plein ecran remet le sprite a l'echelle narrative : le spectateur voit ce qui se passe.

## How to apply

Avant de coder une scene Atlas :
1. Poser la question : "Est-ce un lieu ou une action ?"
2. Si action + sprites doivent etre lisibles + mouvement est le sujet → insert plein ecran
3. Garder la carte SVG uniquement pour le contexte geo en amont (5s max)
4. Generer background via Gemini (terrain, riviere, montagne) + sprites PixelLab CSS
