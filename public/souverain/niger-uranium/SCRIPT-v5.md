# Niger uranium — Script v5 (locked)

**Audio source** : `public/souverain/niger-uranium/audio/narration-niger-uranium-v5.mp3`
**Alignement** : `public/souverain/niger-uranium/audio/narration-niger-uranium-v5-alignment.json` (word-by-word ElevenLabs)
**Voix** : `z3gESu49naEZW8Af2Upm` (GeoAfrique v2, fr, markers TTS V3)
**Durée** : 96.04s
**Mots** : 477 (~298 WPM)

---

## Beat 1 — Hook (0–14s)

> Au Niger, sur le site minier d'Arlit, quatre cents fûts radioactifs dorment dans un hangar. Selon Niamey, vingt fois au-dessus de la norme. Orano conteste sa responsabilité sur ce site précis.

**Visuel proposé** : `GlobeLocationReveal` Style 1 souverain — globe → réticule sur Niger → panel "NIGER · SAHEL · 26.2M HAB." + dot Niamey

---

## Beat 2 — Contexte historique 50 ans (14–32s)

> Le Niger extrait de l'uranium depuis cinquante-trois ans. Niamey affirme aujourd'hui que quatre-vingt-six pour cent des bénéfices sont revenus à Orano sur un demi-siècle. Neuf virgule deux pour cent au Niger. Orano conteste ces chiffres.

**Visuel proposé** : `ComparisonTable` background dossier — colonnes "ORANO 86%" vs "NIGER 9.2%" sur 53 ans

---

## Beat 3 — Nationalisation juin 2025 (32–46s)

> En juin deux mille vingt-cinq, le pouvoir militaire nationalise la Somaïr, principal site uranifère du pays. Niamey parle de souveraineté retrouvée. Orano parle d'expropriation.

**Visuel proposé** : `EntityDiagram` — État Niger / Somaïr / Orano avec edge "NATIONALISATION" + tampon DOSSIER

---

## Beat 4 — Bras de fer juridique + acteurs (46–66s)

> Orano saisit le tribunal arbitral de la Banque mondiale et lance plusieurs procédures. Mille trois cents tonnes d'uranium concentré restent sur le site. Deux cent cinquante millions d'euros immobilisés. En juillet, Moscou exprime son intérêt pour reprendre l'exploitation. En septembre, le tribunal interdit au Niger de vendre le stock tant que le litige n'est pas résolu.

**Visuel proposé** : `CartoCaspian` Sepia — carte Niger + Moscou pin + chronologie superposée (`DateBar` overlay : juin → juillet → septembre)

---

## Beat 5 — Asymétrie quotidienne (66–82s)

> Et pendant ce temps, le Niger doit continuer à fonctionner. Payer ses soldats. Contenir une insurrection jihadiste au nord. Nourrir une population sous pression. Orano, lui, voit son actif majeur lui échapper et des centaines de millions gelés. Mais le groupe a déjà sécurisé ses approvisionnements ailleurs — au Canada, au Kazakhstan.

**Visuel proposé** : `SplitScreen` stacked — haut Niger (terrain, urgences quotidiennes) / bas Orano (carte mondiale Canada+Kazakhstan diversifiés)

---

## Beat 6 — Climax (82–93s)

> Une guerre d'usure devant les tribunaux. Chaque mois de procédure est un mois de recettes qui n'entrent pas à Niamey.

**Visuel proposé** : `CartoCaspian` **Noir** (variante climax color script) — carte Niger pulse + `BigStat` overlay "0€" ou "−250M€"

---

## Beat 7 — Verdict / CTA (93–96s)

> Orano a un portefeuille mondial. Le Niger a une mine. Une partie d'échecs asymétrique. Sans vainqueur. Pour l'instant.

**Visuel proposé** : `KraftCardDocClassifie` tampon CONTESTÉ — citation finale + signature Souverain

---

## Stats clés script

| Élément | Valeur |
|---|---|
| Durée totale | 96.04s |
| Mots | 477 |
| WPM | 298 |
| Beats narratifs | 7 |
| Format | Short long (90-100s) |

## Fact-check à faire (règle d'or Souverain)

⚠️ **Avant lock final pour rendu** : lancer Perplexity sonar-deep-research sur :
- "400 fûts radioactifs Arlit hangar Niger 2025"
- "86% bénéfices Orano Niger 53 ans"
- "9.2% bénéfices Niger uranium"
- "1300 tonnes uranium concentré Somaïr"
- "250 millions euros gelés Orano Niger"
- "septembre 2025 tribunal Banque mondiale interdiction vente Somaïr"
- "Moscou intérêt uranium Niger juillet 2025"
- "approvisionnements Orano Canada Kazakhstan"

Source institutionnelle requise pour chaque chiffre. Coût estimé Perplexity : $0.10-0.30.
