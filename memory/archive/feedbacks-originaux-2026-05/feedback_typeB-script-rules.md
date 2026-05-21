---
name: Type B — Règles script (acteurs explicites + années TTS + clarté auditeur)
description: Règles éditoriales non-négociables pour scripts Type B — factuelles, TTS, clarté pour auditeur non-informé
type: feedback
---

## Règle 1 — Nommer les acteurs explicitement (jamais assumer)

Ne jamais écrire "six gouvernements écrivent une lettre" sans préciser qui.

**Correct :** "Les États-Unis, le Royaume-Uni et le Canada écrivent une lettre officielle au Ghana."
**Interdit :** "Six gouvernements écrivent une lettre au gouvernement ghanéen."

**Why:** Ambiguïté = perte de crédibilité + lecteur confus. Type B = vidéo factuelle, tout doit être explicite.
**How to apply:** Avant de verrouiller tout script Type B, vérifier que chaque acteur est nommé explicitement.

---

## Règle 2 — Années en TTS français : lettres orales naturelles

ElevenLabs lit les années selon comment on les écrit en lettres.

**Règle générale :**
- 2026 → "deux mille vingt-six"
- 2024 → "deux mille vingt-quatre"
- 1324 → "treize cent vingt-quatre"
- 1800 → "dix-huit cents" ou "mille huit cents"

**Why:** Validé POC typeB-vertical 2026-05-06.
**How to apply:** Scanner TOUTES les années dans le script avant génération TTS.

---

## Règle 3 — Vérifier les chiffres factuels avant de les écrire

Compter explicitement les éléments listés et vérifier que le chiffre annoncé correspond.

**Erreur type :** "Cinq pays. Même mouvement." alors que le script liste Ghana + Mali + Burkina Faso + Niger = 4 pays.

**How to apply:** Avant tout script, lister les éléments et compter. Ne jamais deviner.

---

## Règle 4 — Assumer que l'auditeur ne connaît pas le sujet

Chaque transition narrative doit expliquer POURQUOI, pas seulement QUOI.

- "Le message : arrêtez." = insuffisant. L'auditeur ne sait pas quoi arrêter.
- Correct : "Le message : n'allez pas plus loin. Cette loi menace nos investissements."

- "Le Ghana n'est pas seul." = insuffisant. Seul dans quoi ?
- Correct : "Et le Ghana n'est pas un cas isolé. Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol."

Si une phrase commence par un nom propre ou un pronom sans contexte après un saut de beat, ajouter une demi-phrase de lien.

**Why:** Corrections Aziz sur script Or Africain 2026-05-06. L'auditeur qui décroche sur une transition perdue ne revient pas.
**How to apply:** Relire chaque transition entre beats en imaginant quelqu'un qui ne connaît pas le dossier.

---

## Règle 6 — Overlays texte ne doublent jamais les sous-titres karaoke

Un élément visuel texte à l'écran et les sous-titres karaoke ne peuvent pas dire la même chose simultanément.

- Si le texte est dans les karaoke → carte/visuel visible, pas d'overlay texte redondant
- Si le texte est le visuel principal (plein écran) → pas de karaoke, le texte IS le message

**Cas d'origine** : Beat 3 Or Africain — B3e (vignette rouge + texte "n'allez pas plus loin") supprimé car redondant avec karaoke. B3f (plein écran rouge) conservé seul — fort justement parce qu'unique.

**Règle dérivée** : un seul plein écran couleur par vidéo maximum. Au-delà, l'effet perd sa force.

**How to apply:** Au moment du manifest, vérifier chaque beat — si un overlay texte dit la même chose que le karaoke de ce moment, supprimer l'overlay.

---

## Règle 5 — Pas de sur-pauses avec la voix V2

La Narratrice GéoAfrique v2 (z3gESu49naEZW8Af2Upm) a un débit naturellement lent. Garder uniquement les pauses dramatiques clés (max 2-3 par script de 75s). Les pauses supplémentaires alourdissent sans valeur.

**Why:** Validé Or Africain 2026-05-06 — script court + voix lente + trop de pauses = rythme mort.
