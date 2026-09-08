# Un effet généré peut être superbe ET inutilisable : la contrainte du brief prime

**Date** : 2026-09-07 · **Chantier** : chill-meter (contrat Upwork Abigail)

## Le fait

Tests internes de la chaîne Gemini → MiniMax H3 → Remotion (`mixBlendMode: screen`) sur 4
effets. Verdict d'Aziz, contre-intuitif mais juste :

| effet | qualité visuelle | utilisable pour CE brief ? |
|---|---|---|
| brume basse | bonne | ✅ oui — contenue en bas, zone autorisée |
| onde de choc | très bonne | ✅ probable — jaillit et s'éloigne |
| **flocons plein cadre** | **excellente** | ⛔ **NON — occupe tout le cadre** |
| frimas sur métal | très bonne | ⛔ non — ne peut pas se caler sur l'objet |

**Les flocons étaient l'effet le PLUS impressionnant des quatre** (vraie profondeur de champ,
cristaux nets, parallaxe — niveau pack After Effects). Aziz les a rejetés quand même :
« ça occupe tout le cadrage, ça viole tous les interdits, ça tombe en masse sur son visage,
sur le cadre vidéo, partout sur son plateau ».

## Pourquoi

⛔ **Nuance mesurée, à ne pas simplifier** : le plein cadre n'est PAS interdit en soi — son
brief autorise des particules sur tout le cadre au 100 % (son point 6, déjà validé : 0,2 %
d'opacité moyenne sur la zone visage). Le vrai problème est la **DENSITÉ** : notre neige H3
donne +3,8 à +9,7 d'écart sur son visage, contre **0,2 %** avec le rendu codé actuel.

→ Un effet **généré** se contrôle mal en densité (on subit ce que le modèle produit), là où un
effet **codé** se règle au flocon près. Sur un brief à contraintes fortes (« my face should
never be heavily obscured », « the rest of the screen should remain clear »), cette
contrôlabilité vaut plus que la beauté de la matière.

## Comment appliquer

- ⭐ **Juger un effet généré sur la CONTRAINTE avant la beauté.** Mesurer d'abord ce que le
  brief interdit (zone du visage, zones à garder claires), et seulement ensuite regarder si
  c'est joli. Un effet superbe qui viole une contrainte écrite est un effet mort.
- **Le bon domaine du génératif ici** = les effets **contenus dans une zone autorisée**
  (brume basse, onde de choc localisée). Le plein cadre à densité maîtrisée reste au CODE.
- Voisin de [[texture-figee-gemini-extraction-avant-segmentation]] : là c'était « ce qui vit
  SUR l'objet reste en calques » ; ici c'est « ce qui doit respecter une densité fine reste
  en code ». Même principe — le génératif gagne sur la MATIÈRE, le code gagne sur le CONTRÔLE.
- ⛔ Ne pas conclure « le plein cadre est interdit chez Abigail » — c'est faux et ça
  fermerait une porte que son brief laisse ouverte. Le critère est la densité mesurée sur
  les zones protégées, pas l'étendue.

## Le vrai enjeu du brief, nommé par Aziz

« Même si on est en train de résoudre l'animation avec des effets très bons, [la difficulté]
c'est de suivre toutes les contraintes qui viennent avec. » → Sur ce chantier, la prochaine
étape n'est pas de produire de plus beaux effets, c'est de **tester le respect des contraintes**
pour le 75 % (« mist from the bottom only », « rest of the screen remains clear ») et le 100 %
(givre animé sur les 4 bords, son point 1).
