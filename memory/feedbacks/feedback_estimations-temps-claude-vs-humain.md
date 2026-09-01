# Regle : estimer le temps en "temps Claude", pas en "temps humain"

## La regle

Quand Claude propose des durees pour des taches de code (composant, refactor, animation), il **DOIT**
evaluer le temps en **temps reel d'execution Claude** sur la session courante, pas en heures-developpeur-junior.

**Why:** 2026-05-02 sur Shaka Zulu Vague 2, Claude a annonce "8-12h pour la carte d3-geo, 5-6h pour la caravane impi, 6-8h pour la deformation S4". Aziz a corrige : "Tu evalues en temps humain, mais tu n'evalues pas en temps que toi tu peux faire rapidement sur une ou deux sessions. Pour toi, parfois c'est meme pas 10 minutes de creer quelque chose comme ca." Realite : ces taches prennent 15-45 min chacune en mode session active, pas plusieurs heures.

## Exemples concrets observes

| Tache | Estimation initiale Claude | Temps reel | Ratio |
|-------|---------------------------|------------|-------|
| Cartouche source academique | 30 min | 5 min | 6x |
| Composant Cornes de buffle minimaliste | 3-5h | 15-30 min | 6-10x |
| Carte d3-geo Shaka adaptee | 8-12h | 45-60 min | 8-12x |
| Hook A+B (gravure + silhouette) | 3-5h | 30-45 min | 4-6x |
| Blueprint 5 inserts | 2-3h | 20-30 min | 4-6x |
| Deformation S4 (filtres SVG) | 6-8h | 30-45 min | 8-10x |
| PixelLab caravane integration | 5-6h | 20 min code + 30 min attente | 5-10x |

**Multiplicateur typique : 4-12x plus rapide qu'estime**.

## How to apply

- Ne **jamais** estimer en jour-homme ou en heures sprint
- Decomposer la tache en blocs de 5-30 min de code Claude
- Si goulot reel = generation API externe (PixelLab, Seedance, ElevenLabs) : signaler le delai d'attente API separement de l'effort code
- Pour les decisions de scope ("on inclut ceci ou pas") : se baser sur le temps reel court, pas sur le temps humain long. Le calcul de scope change radicalement.
- Pour les sessions : un "gros bloc" Claude sur une session = 1-3h de travail efficace humain en general.

## Consequence sur la prise de decision

Quand Aziz dit "ce serait trop pour cette session", challenger l'estimation avant de cuter du scope. Souvent ce qui semble "trop" est en realite faisable en 30-60 min de code reel.

Inversement, ne pas etre cocky : prevoir une marge pour les imprevus (compositions a re-render, fixes, validation visuelle).

---
Migré depuis auto-memory (`feedback_estimations-temps-claude-vs-humain.md`) le 2026-08-31, contenu original inchangé.
