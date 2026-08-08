---
name: verifier-tous-usages-composant-partage-bug-duplique
description: Un bug trouvé dans un composant partagé (ex. prop de dimensionnement erronée) peut exister dans plusieurs fichiers qui l'utilisent séparément — corriger uniquement le fichier signalé dans le rapport de l'agent laisse le doublon actif ailleurs.
metadata:
  type: feedback
---

Quand un bug visuel est localisé dans un composant partagé (`LaptopMockup`, `VirtualCursor`,
etc.), grep TOUS les usages du composant dans le repo avant de considérer le fix terminé — pas
seulement le fichier où le symptôme a été observé.

Cas concret (NorthShield, 2026-08-08) : `<LaptopMockup width={width * 1.3} ...>` faisait déborder
le chassis hors cadre (2496px sur un canvas 1920px), donc seul l'écran zoomé restait visible. Le
bug existait à l'identique dans 2 fichiers différents (`P5VideoSarah.tsx` ET
`P5DashboardMorphBosse.tsx`, ce dernier partagé par le panneau P6) — trouvé seulement parce que la
vérification indépendante de l'orchestrateur a comparé le rendu réel des DEUX panneaux, pas parce
qu'un grep systématique avait été fait en amont. Corrigé en `width * 0.8` dans les deux.

**Why** : un pattern buggé copié-collé entre scènes (composition héritée d'un panneau à l'autre) se
propage silencieusement. Un rapport d'agent qui dit "corrigé" porte sur le fichier qu'il a ouvert
pour traiter le symptôme signalé, pas nécessairement sur tous les appelants du même composant.

**How to apply** : après avoir identifié un bug dans un composant réutilisable, lancer
`grep -rn "<NomComposant"` (ou le nom du prop fautif) sur tout `src/` avant de clore le fix, même
si le rapport de l'agent semble complet. Voir [[verification-independante-trou-temporel-curseur-preuve]]
pour un autre cas de la même session où la vérification indépendante (pas le seul rapport d'agent)
a trouvé un défaut non signalé.
