# Niger Uranium — Décisions visuelles (post-storyboard v2)
> Validées Aziz 2026-05-09

---

## Règle transversale — Dynamisme obligatoire

**Règle : changement visuel toutes les 2-3s maximum.**
Aucune scène statique. Si du texte/data occupe l'écran, il se construit progressivement.
Même règle que Atlas — mouvements de caméra fréquents, faits qui apparaissent en cascade.

---

## Beat 1 — Hook Globe (0–14s)
- Style globe : **CartoCaspian Sepia** (pas dark-v11 navy)
- Cohérence visuelle avec Beat 4 et Beat 5
- GlobeLocationReveal : passer `style="caspian"` + `applyCartoCaspian(map, CASPIAN_SEPIA)`

## Beat 2 — Contexte 53 ans (14–32s)
- **Option A validée** : chiffres comptent up progressivement (0%→86%, 0%→9.2%)
- SFX tick à chaque palier
- ComparisonTable V2 cascade native — caler `appearFrame` sur forced alignment
- Un changement visuel toutes les 2-3s minimum

## Beat 3 — Nationalisation juin 2025 (32–46s)
- EntityDiagram se **construit sous les yeux** : nodes apparaissent un par un, arêtes se dessinent
- Séquence : tampon DOSSIER → ÉTAT NIGER pop → flèche NATIONALISATION draw → SOMAÏR pop → annotation "JUIN 2025" → ORANO pop + ligne rouge dashed
- SFX différenciés par entité : gong sourd (État), métal (Somaïr), swoosh tendu (Orano)
- `appearFrame` calés sur forced alignment audio

## Beat 4 — Bras de fer juridique (46–66s)
- **Approuvé tel quel** — CartoCaspian Sepia + DateBar JUIN/JUILLET/SEPTEMBRE
- Pin Moscou à corriger légèrement en code (coordonnées exactes : 37.6°E, 55.75°N)
- Assets marqueurs existants peuvent s'ajouter

## Beat 5 — Asymétrie (66–82s)
- Carte du bas : **CartoCaspian Sepia** (pas dark navy)
- Retirer le "VS" — trop manichéen, contredit règle symétrie Souverain
- Garder les arcs Niger→Canada et Niger→Kazakhstan sans opposition dramatique
- L'asymétrie est portée par le texte voix-off, pas par le visuel

## Beat 6 — Climax (82–93s)
- **Approuvé** — CartoCaspian Noir exception voulue (color script switch climax)
- Niger glow or + anneaux pulsation + BigStat overlay

## Beat 7 — Verdict CTA (93–96s)
- **Approuvé** — KraftCardDocClassifie tampon CONTESTÉ
