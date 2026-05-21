---
name: "Collaboration — demander quand bloqué après 1-2 tentatives"
description: "Règle Aziz (2026-05-03 fin session Beat 1 Ghana). Plutôt que m'acharner, demander une capture d'écran ou clarification. Aziz est collaborateur, pas client passif. Les images avec annotations valent 10x plus que les explications textuelles."
type: feedback
---

# Demander quand bloqué — règle de collaboration

> Aziz (2026-05-03) : "Si après une ou deux tentatives ça ne marche pas, me le rappeler, c'est excellent selon moi, ça aide autant toi que moi."

## La règle

**Si je n'arrive pas à comprendre/résoudre quelque chose après 1-2 tentatives, je dois demander.**

Pas continuer à essayer 5 versions. Pas faire semblant d'avoir compris. Pas pivoter vers une solution différente sans confirmer.

**Demander spécifiquement :**
- "Peux-tu me faire une capture d'écran de ce que tu vois et m'indiquer avec une flèche ce que tu veux changer ?"
- "Peux-tu me décrire avec un exemple précis (timing, position, asset) ?"
- "Je vois deux interprétations possibles : A ou B. Laquelle ?"

## Pourquoi cette règle a émergé

**Cas concret Beat 1 Empire Ghana (v1 → v5)** :
- v1 : zoom raté (j'ai supposé)
- v2 : zoom toujours raté + Lottie inadaptés (j'ai pivoté sans demander)
- v3 : zoom toujours raté (j'ai redemandé tard)
- v4 : zoom toujours raté (j'avais "compris" mais pas assez)
- **v5** : Aziz envoie une capture d'écran avec flèches "zoom ici" vs "zoom 1" → diagnostic immédiat → fix en 5 min

**Conclusion** : 4 itérations perdues sur ce zoom. Une seule capture d'écran a tout débloqué. Les images avec annotations valent **10x plus** que les explications textuelles, car elles éliminent l'ambiguïté.

## Quand demander une capture d'écran

- **Position visuelle** : "où exactement ?" → flèche sur l'image
- **Comportement temporel** : "à quel moment ?" → screenshot du moment problématique
- **Différence subtile** : "à quoi ça doit ressembler ?" → référence visuelle (autre vidéo, dessin, croquis)
- **Mouvement caméra** : "vers quoi zoomer ?" → flèche depuis position actuelle vers cible
- **Asset** : "à quoi ressemble cet objet ?" → image de référence

## Quand demander une clarification verbale

- **Choix entre options** : "A ou B ?" (2-3 options claires)
- **Contraintes/préférences** : "tu préfères X ou Y comme style ?"
- **Ordre de priorité** : "qu'est-ce qui prime : vitesse ou qualité ?"
- **Validation décision risquée** : "je vais faire X, ça t'va ?"

## Format pour demander

Court et précis :
```
"Je tente Y, mais je ne suis pas certain de [aspect spécifique]. 
Peux-tu :
- soit m'envoyer une capture d'écran avec une flèche sur [endroit] ?
- soit confirmer que tu veux [interprétation A] vs [interprétation B] ?

C'est plus efficace que je tente 3 versions à l'aveugle."
```

## Ce qui n'est PAS cette règle

**Pas demander pour des décisions évidentes** :
- "Je peux nommer le fichier `xxx.tsx` ?" → décide soi-même
- "Quelle couleur de bordure pour ce détail technique invisible ?" → décide soi-même selon palette projet

**Pas demander à chaque problème** :
- Bug TypeScript résolvable → résoudre soi-même
- Choix d'implémentation purement technique → décider soi-même
- Erreur reproductible → débugger soi-même

**Demander UNIQUEMENT quand** :
1. La compréhension de l'intention créative/visuelle d'Aziz est incertaine
2. Plusieurs interprétations sont possibles avec impacts visuels significatifs
3. Une ou deux tentatives ont déjà échoué sur le même point
4. Le coût de retravail (>30 min) dépasse largement le coût de demander

## Why cette règle est cruciale pour Atlas

Le format Atlas demande un alignement précis vision créative ↔ exécution technique. Les vidéos finales sont publiées sur des plateformes (TikTok, YouTube Shorts) avec un public visuellement exigeant. Une approximation visuelle "correcte techniquement" peut quand même rater l'intention créative.

Aziz est **collaborateur**, pas client passif. Il accepte de prendre des captures d'écran, d'annoter avec des flèches, de clarifier verbalement. Il l'a explicitement encouragé. Donc je dois saisir cette opportunité.

## How to apply

À chaque session Atlas :
1. Quand un point visuel/créatif n'est pas 100% clair → demander avant la première tentative
2. Si une première tentative rate → demander capture d'écran avant la 2e
3. Si je suis sur le point de pivoter vers une solution différente → demander confirmation
4. Documenter les patterns visuels validés via capture d'écran (ex: "zoom espace pivot Koumbi" est devenu une règle réutilisable grâce à la capture d'Aziz)

## Référence

Cette règle complète celle de "code existant vs décision documentée" : si le code existant est faux par rapport à la vision Aziz, demander confirmation avant de réécrire OU de garder.
