---
name: hashes-distincts-ne-prouvent-pas-une-animation
description: "Des frames aux hashes differents prouvent la presence de mouvement, jamais son amplitude — mesurer le %% de pixels qui changent"
metadata:
  type: feedback
---

**« N frames, N hashes distincts » ne prouve PAS qu'une animation bouge.** Un hash md5 change
pour **un seul pixel** modifie. C'est une preuve d'absence de gel, rien de plus.

**Le cas (2026-09-04, chill-meter)** : un agent a rapporte « 15 frames echantillonnees, 15 hashes
distincts, aucun gel » sur une vapeur volumetrique. J'ai relaye ce chiffre comme preuve
d'animation. Aziz, en REGARDANT, a vu « de grosses taches statiques ».
Mesure de l'AMPLITUDE : entre 2 frames espacees de 20, **0,5 %** des pixels changeaient de ±25,
et l'ecart cumule plafonnait a 5 % sans jamais augmenter — la forme etait **figee et scintillait
sur place**. Cause : une constante d'advection **17x trop faible** dans le shader.
Apres correction : 6,0 a 6,9 % entre frames, cumul qui double. Onze fois plus de mouvement.

**Why**: un hash est booleen (identique / different), une animation est une grandeur continue.
Confondre les deux fait accepter une animation morte avec un rapport « tout vert ».

**How to apply**: pour prouver qu'une animation bouge, mesurer sur des frames espacees :
- **% de pixels qui changent de ±25** entre frames consecutives (viser >= 5 % pour un effet
  atmospherique ; une reference pro de fumee mesure ~37 %)
- **le CUMUL** par rapport a la premiere frame : s'il plafonne, la forme scintille au lieu de se
  transformer. S'il croit, elle evolue reellement.
- pour un deplacement : l'amplitude du **centre de masse** en px.

Lie a [[animation-vs-image-fixe-mesurer-frames-uniques]] et
[[rapport-vert-ne-prouve-rien-regarder-l-image]].
