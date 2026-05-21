---
name: Souverain — sources en overlay, pas dans la voix
description: Les attributions de sources (Oxfam, FMI, Bloomberg) s'affichent en cartouche, jamais énoncées par la narration
type: feedback
---

Les attributions de sources doivent apparaître en overlay visuel discret sur les frames de données — jamais verbalisées dans la narration.

**Why:** Cas Niger uranium Beat 2 — la phrase "Ces chiffres sont ceux avancés par Niamey, cohérents avec un rapport Oxfam de deux mille treize" cassait le rythme narratif et sonnait défensive, comme si la voix s'excusait de citer les chiffres. L'autorité factuelle est plus forte quand elle s'affiche silencieusement (cartouche source en bas de frame) que quand elle est énoncée — la voix doit raconter, pas se justifier. Pattern déjà validé sur Or Africain (sources Bloomberg/FMI affichées, jamais dites).

**How to apply:** Dans tout script Souverain, scanner les phrases du type "selon X", "d'après Y", "ces chiffres viennent de Z" — couper de la voix, déplacer en overlay manifest. Format cartouche standard : `Source : <institution> <année>` en bas de frame, opacity 0.7, font small. La voix énonce le chiffre brut ; le cartouche établit la provenance.

Validé Niger uranium V2 2026-05-07.
