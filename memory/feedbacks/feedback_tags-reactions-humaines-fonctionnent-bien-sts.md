---
name: tags-reactions-humaines-fonctionnent-bien-sts
description: Test 2026-08-01 sur Harmonie→STS→GéoAfrique — tags de réaction humaine (souffle, choc, inhalation) confirmés fonctionner admirablement, seul [laughs] sonne artificiel. Lève l'évitement par défaut de ces tags en registre documentaire.
metadata:
  type: feedback
---

Test 3 extraits courts (~20-30s) sur voix Harmonie (source) → STS → GéoAfrique, texte Gazoduc PARTIE 3 :
A = tags sobres + `[takes a deep breath]` (souffle avant un virage de phrase), B = `[inhales sharply]` +
`[shocked]` juste avant la révélation de l'attaque de Niamey (35 morts), C = `[laughs]` + `[excited]`,
volontairement hors registre documentaire pour tester la limite.

**Verdict Aziz (2026-08-01)** : « tout a très bien marché ». Le souffle (A) parfaitement imité par
GéoAfrique après conversion. Le choc (B) : « l'émotion est très présente dans la voix originale, très
présente dans notre voix à nous aussi ». Seul `[laughs]` (C) sonne "un peu bizarre" — mais Aziz note que
c'est une limite connue et généralisée des moteurs TTS (rire = cas difficile pour la synthèse vocale en
général), pas un défaut spécifique à notre pipeline.

**Why** : la doctrine [[pipeline-voix-vivante-valide]] excluait par précaution TOUS les tags de "réaction
humaine" (`[laughs]`, `[sighs]`, SFX) du registre documentaire, sans les avoir vraiment testés un par un —
un évitement générique appliqué par analogie plutôt que vérifié. Le test ciblé montre que seul le rire pose
problème ; les autres (souffle, inhalation, choc) sont au contraire un vrai outil narratif directement
exploitable sur les moments-pivots d'un script (révélation chiffrée, virage de tension).

**How to apply** : ne plus exclure `[sighs]`, `[inhales sharply]`, `[gasps]`, `[shocked]`, `[clears
throat]`, `[takes a deep breath]` par défaut en écriture de script voix — les utiliser délibérément aux
moments choc/pivot du récit, PAS en saupoudrage systématique (garder l'esprit "1 tag ciblé par moment fort",
cf structure déjà validée dans [[pipeline-voix-vivante-valide]]). Continuer d'éviter `[laughs]`/`[giggles]`.
Implication plus large signalée par Aziz : le texte voix devient un vrai script de PERFORMANCE (emphase +
réactions placées intentionnellement), pas seulement un texte narré avec de la couleur ponctuelle — à
intégrer dans la méthode d'écriture des scripts voix Souverain/Atlas dès la prochaine session.
