---
name: soudan-midform-AUDIO-ETAT
description: Suivi de l'état audio acte par acte (Soudan mid-form). Quel audio est à jour vs périmé après corrections de script. Procédure de lock audio final = check + régénération sélective.
metadata:
  type: project
---

# ÉTAT AUDIO — SOUDAN MID-FORM (suivi acte par acte)

> Pour [[soudan-midform]]. ⭐ **À LIRE avant tout lock audio / assemblage.**
> Règle : un audio n'est valide que s'il a été généré APRÈS la dernière modif de son texte. Toute correction de script PÉRIME l'audio de cet acte.
> Pipeline génération : `scripts/generate-narration-expressive.py` (Océane V3 → STS GéoAfrique). Règles tags : [[TTS-V3-TAGS-REGLES]].

## ⛔ PROCÉDURE LOCK AUDIO FINAL (quand les scripts finaux seront figés)
1. **Check acte par acte** : comparer le texte figé de chaque acte vs le texte qui a servi au dernier audio.
2. **Régénérer SÉLECTIVEMENT** : seulement les actes dont le texte a changé. Un acte inchangé garde son audio (ne pas régénérer pour rien = économie crédits + cohérence).
3. **Re-scanner les règles TTS** ([[TTS-V3-TAGS-REGLES]] + règles FR : participes é/ée, ont+voyelle, nombres en lettres) avant chaque régénération.
4. **Vérifier durée** (ffprobe) après génération.

## ÉTAT ACTUEL (2026-06-16)
| Acte | Dernier audio | Texte changé depuis ? | Statut |
|---|---|---|---|
| **Acte 1** | https://files.catbox.moe/or6tj3.mp3 (jet 3 fact-checké) | NON (aucune modif depuis fact-check) | ✅ **à priori OK** — re-vérifier au lock final, mais probablement à garder tel quel |
| **Acte 2** | https://files.catbox.moe/pco5ra.mp3 | OUI ⚠️ — « deux ans » → « plus de trois ans » + « personne ne peut » → « personne n'a pu » (correction temporelle 2026-06-16) | ⛔ **PÉRIMÉ — à régénérer** |
| Acte 3 | — | (pas écrit) | à venir |
| Acte 4 | — | (pas écrit) | à venir |
| Acte 5 | — | (pas écrit) | à venir |

## TEXTES FIGÉS DE RÉFÉRENCE (pour le check)
- Acte 1 : [[soudan-midform-STORYBOARD-ACTE1]] (verbatim dans le chat + storyboard).
- Acte 2 : [[soudan-midform-STORYBOARD-ACTE2]] (beats, avec correction temporelle au beat 8).
- Fichiers texte V3 (tags) : `/tmp/soudan-acte1-v3.txt` (éphémère — recréer au besoin depuis le storyboard).

Liens : [[soudan-midform]] · [[soudan-midform-STORYBOARD-ACTE1]] · [[soudan-midform-STORYBOARD-ACTE2]] · [[TTS-V3-TAGS-REGLES]].
