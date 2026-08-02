---
name: pauses-viennent-sauts-de-ligne-pas-tags
description: Diagnostic voix monotone Gazoduc — les pauses excessives venaient du découpage phrase-par-phrase (sauts de ligne = pause V3), pas de tags demandés. Fusion paragraphes + CAPS ciblées = gain net validé à l'oreille.
metadata:
  type: feedback
---

Un texte TTS V3 découpé en une phrase par paragraphe (saut de ligne après chaque phrase) déclenche une pause
implicite à CHAQUE fin de phrase, même sans aucun tag `[pause]` demandé — le moteur V3 traite un saut de ligne
comme une pause longue naturelle (doctrine déjà connue, mais jamais reliée au symptôme "voix qui traîne").

**Why** : `SCRIPT-V3-VOIX.md` du Gazoduc contenait ZÉRO tag `[pause]`/émotion et ZÉRO majuscule d'emphase —
vérifié par grep avant toute supposition. Pourtant Aziz entendait une pause à chaque fin de phrase. Cause
racine trouvée : 41 paragraphes / 34 sauts de ligne sur un texte de ~7000 caractères = quasi une ligne par
phrase. Test A/B/C sur PARTIE 3 (TSGP, attaque Niamey) : A = tags émotion sur texte inchangé (découpé),
B = A + style STS 0.18, C = paragraphes FUSIONNÉS en 4 blocs narratifs (transitions de sujet réelles, pas
phrase par phrase) + CAPS sur 2 mots-clés porteurs d'argument ("DEUX FOIS MOINS CHER", "TRENTE-CINQ MORTS").
**Verdict Aziz (2026-08-01) : C nettement la meilleure — la plus naturelle, CAPS perceptibles et efficaces.**

**How to apply** : avant de générer une narration via [[pipeline-voix-vivante-valide]], écrire/reformater le
texte voix en paragraphes qui suivent les VRAIES transitions de sujet (3-5 blocs par partie), pas une ligne
par phrase. Ajouter des MAJUSCULES ciblées (1-2 par paragraphe max, sur le mot qui porte l'argument — chiffre
choc, verdict, contraste) plutôt que des tags d'émotion en premier réflexe. Les tags `[serious]`/`[tense]`
restent utiles mais sont un levier secondaire par rapport à la structure du texte + CAPS, qui ont un effet
plus net et gratuit. Gazoduc : appliquer cette méthode à `SCRIPT-V3-VOIX.md` en entier avant régénération
complète (actuellement narration.mp3 est en structure phrase-par-phrase, à refaire).
