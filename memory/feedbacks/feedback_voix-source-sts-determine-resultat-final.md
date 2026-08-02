---
name: voix-source-sts-determine-resultat-final
description: Découverte majeure 2026-08-01 — la voix SOURCE choisie pour le TTS V3 AVANT conversion Speech-to-Speech a un impact énorme sur le résultat final, y compris après conversion vers GéoAfrique. Contredit l'hypothèse de juin ("le STS gomme les différences").
metadata:
  type: feedback
---

Test A/B/C/D sur 9 voix (Océane référence + 8 candidates FR "energetic/dynamic" de la Voice Library :
Claudia, Harmonie, Marie Line, Sarah, Solene, Yariq, Simon, Nic), chacune générée en V3 brut PUIS convertie
via Speech-to-Speech vers GéoAfrique, même extrait (~30s, début PARTIE 3 Gazoduc TSGP), mêmes réglages
doctrine (V3 stability 0.30/style 0.0, STS stability 0.45/style 0.0).

**Verdict Aziz (2026-08-01)** : différence ÉNORME et clairement audible entre les voix APRÈS conversion STS
vers GéoAfrique — pas juste sur l'original. Exemple cité : Harmonie reste nettement plus énergique/rapide
avec des respirations perceptibles même après passage en GéoAfrique, contrairement à Océane qui reste plate.
Effet secondaire observé : certaines voix sources transmettent une coloration d'accent (ex. teinte
québécoise) au résultat GéoAfrique — le STS ne fait PAS que transposer un timbre neutre, il semble
transmettre une partie du débit/rythme/couleur d'accent de la source.

**Why** : ceci CONTREDIT l'hypothèse implicite de juin (doctrine [[pipeline-voix-vivante-valide]]) qui ne
questionnait que le CHOIX D'OCÉANE COMME UNIQUE SOURCE possible, sans jamais comparer à d'autres voix V3 —
Océane a été retenue par défaut car "seule voix FR déjà sur le compte compatible v3", jamais par comparaison
(cf [[pauses-viennent-sauts-de-ligne-pas-tags]] qui documente le même type d'angle mort méthodologique sur
la structure du texte). On supposait que le STS "lissait" vers le timbre cible ; en réalité il semble
transmettre une part significative du RYTHME/ÉNERGIE/COULEUR de la source, pas seulement l'intonation/pauses
documentées précédemment.

**How to apply** : ⛔ NE PLUS traiter Océane comme la voix source par défaut sans comparaison. Avant de
verrouiller une narration definitive, TOUJOURS tester plusieurs voix sources V3 candidates converties vers
GéoAfrique sur un extrait représentatif (méthode : page de comparaison here.now, voir
[[here-now-hosting]]) — pas seulement écouter l'original brut, car l'original seul ne prédit pas le résultat
post-conversion. Vérifier explicitement l'absence de coloration d'accent parasite (ex. québécois) introduite
par la voix source AVANT de choisir. Prochaine étape Gazoduc : Aziz compare les 9 candidates sur
https://witty-pulsar-ww22.here.now/ (voir [[voix-comparaison-url]] dans l'épisode) et tranche la voix source
définitive avant régénération complète du script (qui utilisera aussi la méthode C : paragraphes fusionnés +
CAPS, cf [[pauses-viennent-sauts-de-ligne-pas-tags]]).
