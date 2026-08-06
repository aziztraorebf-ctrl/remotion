# Script voix — Flowdesk (test client, ~45s)

> Statut : BROUILLON — a valider par Aziz avant generation.
> Pipeline : Harmonie V3 (`obmcfXCePmPgsNsLIWIj`) -> STS GeoAfrique (`z3gESu49naEZW8Af2Upm`), stability STS 0.45.
> Calage narratif sur les 4 panneaux communs aux deux registres :
> 1. Chaos / Surcharge mentale -> 2. Bascule / Reorganisation -> 3. Mecanisme / Systeme ordonne -> 4. Resolution / Controle calme.

## Texte taggé (à générer tel quel — accents complets, version API)

```
[tense] Emails, Slack, tableurs, demandes urgentes. [pause] Chaque canal crie plus fort que le précédent, et rien ne se PARLE entre eux.

[pause]

[deliberate] Et si un seul flux absorbait tout ça — sans que vous ayez à courir après chaque message ?

[pause]

[curious] Flowdesk prend le chaos [pause] et le fait BASCULER. Chaque demande trouve sa place, chaque canal se range dans un seul système.

[pause]

[serious] En dessous, un mécanisme simple fait le tri. Email, chat, document — chacun trouve son chemin, automatiquement.

[pause]

[calm] Le résultat ? [pause] Une boucle qui se referme. Plus de bruit — un CONTRÔLE calme s'installe.

[pause]

[proud] Flowdesk. L'ordre, enfin visible.
```

## Version plain-text (pour forced alignment / sous-titres)

```
Emails, Slack, tableurs, demandes urgentes. Chaque canal crie plus fort que le précédent, et rien ne se parle entre eux.

Et si un seul flux absorbait tout ça, sans que vous ayez à courir après chaque message ?

Flowdesk prend le chaos et le fait basculer. Chaque demande trouve sa place, chaque canal se range dans un seul système.

En dessous, un mécanisme simple fait le tri. Email, chat, document, chacun trouve son chemin, automatiquement.

Le résultat ? Une boucle qui se referme. Plus de bruit, un contrôle calme s'installe.

Flowdesk. L'ordre, enfin visible.
```

## Scan anti-pièges TTS FR (vérifié avant génération)

- **Participes en "é/ée" fin de groupe** — repérés et corrigés : "aiguillé" (fin de segment "chacun est
  aiguillé au bon endroit") et "retrouvé" (fin de segment "un CONTRÔLE calme, retrouvé") sont bien des
  participes en finale de groupe rythmique — RISQUE confirmé par la doctrine ElevenLabs. Reformulés :
  "chacun est aiguillé au bon endroit" -> **"chacun trouve son chemin, automatiquement"** (participe supprimé) ;
  "un CONTRÔLE calme, retrouvé" -> **"un CONTRÔLE calme s'installe"** (verbe conjugué, pas de participe).
  Le texte ci-dessus a été mis à jour avec ces deux corrections — relire avant génération.
- **"ont + voyelle"** : aucune occurrence (pas de passé composé avec "ont" dans le texte).
- **Chiffres** : aucun chiffre arabe dans le script (zéro à transcrire).
- **Accents** : version taggée ci-dessus déjà en accents complets (é/è/à/ç/ê) — prête pour l'API telle quelle.
- Durée estimée : ~130 mots -> ~42-48s à un débit narratif normal (dans la cible ~45s, marge de dépassement
  légère acceptée par Aziz).

## Notes de generation

- Decouper en 1 seul bloc (script court, sous la limite 5000 caracteres, pas besoin de multi-parties).
- Tags de ton en tete de paragraphe seulement (pas de sur-tagging).
- Pas de `[laughs]` / `[clears throat]` (bannis).
- Musique Minimax a generer separement, brief genre SaaS/tech/corporate-premium (PAS kora/africain) —
  voir prompt propose dans la session.
