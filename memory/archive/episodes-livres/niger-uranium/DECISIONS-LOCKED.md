# DECISIONS-LOCKED — Niger uranium vs Orano (Souverain Ép. 2)

**Locked** : 2026-05-07 — post-jury GPT-4o + Grok + Kimi (21 appels).
**Stack** : Remotion + Mapbox GL JS, 1080×1920 9:16, 30fps.
**Règle non-négociable** : symétrie d'humanisation sur toutes les scènes.

---

## PALETTE 3 TONS (décision jury Q7)

Mappage sémantique — 2 sections par ton, logique narrative :

| Fond | Sections | Signification |
|------|----------|---------------|
| `#0a0a0a` (noir profond) | S1 Hook, S5 Étranglement | Urgence, tension, drame |
| `#0f141a` (bleu nuit) | S2 Partage, S4 Procédures | Data, sobriété financière |
| `#1a1410` (brun chaud) | S3 Nationalisation, S6 Conclusion | Gravité institutionnelle |

**Rejeté** : 6 fonds différents (surcharge cognitive). 3 tons = suffisant.

---

## S1 — HOOK / ARLIT (0.08s → 12.62s)

**DÉCISION** : Supprimer les 4 fûts radioactifs (redondants avec "400 fûts" dans le texte).

**Composition finale** :
- Carte Mapbox zoom Niger highlight vert (fond `#0a0a0a`)
- `flyTo` animé : world view → Niger → Arlit (pan narratif)
- Pulse radar radioactif vert `#9eff00` sur Arlit — 3 cercles concentriques, fréquence 1.5 Hz
- Headline "400 FÛTS RADIOACTIFS" bottom
- Caption rouge "Annonce Min. Justice Niger, 4 fév. 2026 — Orano conteste"
- **Pas de fûts SVG**

---

## S2 — LE PARTAGE (12.62s → 27.92s)

**DÉCISION** : 2 variantes à rendre pour A/B test Aziz.

### Variante A — Barres animées (default)
- Barres qui se construisent en ~1.5s avec compteur défilant 0→86% / 0→9.2%
- Timeline glissante 1971→2024 avec 4 ticks clés : 1971, 2007, 2014, 2025
- Fond `#0f141a` (bleu nuit)
- Légère grille ledger (opacité 4%)

### Variante B — Waffle chart
- 100 cubes (86 bleus Orano + 9 verts Niger + 5 gris "autres")
- Chaque cube 8×8px, gap 2px, grille 10×10
- Comparaison incarnée / visuellement frappante

**Manifeste** : paramètre `s2Variant: "bars" | "waffle"` dans le composant.

---

## S3 — NATIONALISATION (27.92s → 39.16s)

**DÉCISION** : Option C jury (unanime 3/3) — deux halos colorés sur MÊME carte Niger.

**Composition finale** :
- Fond `#1a1410`
- Carte Mapbox Niger full-frame
- Au mot "souveraineté" : halo vert `#00833D` apparaît côté gauche du territoire Niger
- Au mot "expropriation" : halo bleu `#003D7A` apparaît côté droit du territoire Niger
- Même territoire, deux lectures — symétrie graphique pure
- Ligne verticale dorée fine au centre (séparateur symbolique)
- Micro-animation : les halos pulsent légèrement (scale 1.0→1.03, 1.5s cycle)

**Rejeté** : split-screen carte/silhouette tour (trop partisan subliminalement).
**Rejeté** : deux documents factuels (trop statique).

---

## S4 — PROCÉDURES + BLOCAGE (39.16s → 62.12s)

**DÉCISION** : Séquence narrative timecodée — 5 infos en 23s.

| Timing | Élément visuel | Mapbox |
|--------|---------------|--------|
| 39.16s | Data viz "1 300 T" + fond `#0f141a` | — |
| ~44s | Data viz "250 M€" | — |
| ~47s (juillet 2025) | Arc Bézier animé Niger→Moscou | Apparaît ici (pas au début) |
| ~50s | Locator "MOSCOU · JUILLET 2025" | Niger + Russie highlights |
| ~54s (sept. 2025) | Sceau CIRDI s'estampille (animation stamp) | Reste visible jusqu'à fin |

**Micro-animations validées** :
- Arc Niger→Moscou : tirets animés (`stroke-dashoffset` décroissant, 1.5s)
- Marqueur Arlit : pulse `#d9b410` 2s après l'arc
- Sceau CIRDI : scale 0→1 avec rotation légère (effet "tampon officiel"), `spring({damping: 15})`

**Rejeté** : sceau CIRDI présent dès le début (confus si Orano saisit le tribunal EN COURS de scène).

---

## S5 — DOUBLE ÉTRANGLEMENT (62.12s → 82.70s)

**DÉCISION** : Globe rotatif Mapbox + asymétrie visuelle Niger/Orano.

**Composition finale** :
- Fond `#0a0a0a`
- Split 50/50 vertical : ligne dorée fine
- **GAUCHE** : Niger isolé highlight vert (zoom pays)
  - Scale narrative : Niger `scale: 1.0 → 0.7` (rétrécit symboliquement)
- **DROITE** : Globe Mapbox `projection: 'globe'`, rotation lente (0.2 deg/s)
  - 3 flèches SVG Remotion sortantes depuis Arlit/Paris vers Canada, Kazakhstan, France
  - Scale narrative : globe `scale: 1.0 → 1.3` (Orano s'étend)
  - Pins `#003D7A` : Canada, Kazakhstan, France

**Bonus Grok retenu** : effet échelle asymétrique Niger rétrécit / Orano s'étend = narration visuelle sans texte.

---

## S6 — CONCLUSION / ÉCHIQUIER (82.70s → 96.08s)

**DÉCISION** : Échiquier 2D top-down pur + fond brun chaud (option A jury).

**Composition finale** :
- **Fond `#1a1410`** (brun chaud — courthouse, gravité finale)
- Halo doré subtil derrière l'échiquier (lumière de lampe de bureau juridique)
- Échiquier 2D top-down : 8×8 grille, alternance `#1e1612` / `#2a1e14`
- Pièces flat 2D silhouettes :
  - 4 pièces Orano bleu `#003D7A` (roi + cavalier + évêque + tour)
  - 1 pion Niger vert `#00833D` (seul, zone inférieure)
- Papiers légaux flottants à 25% opacité (suggestion documents)
- Micro-animations sobres :
  - 1 pièce bleue Orano se déplace lentement (translate sur 4s, spring damping=80)
  - Ombres des pièces s'allongent très légèrement (filter shadow-y +2px)

**Rejeté** : fond vert feutre (trop référence tribunal comique). Fond bleu nuit (déjà utilisé S2/S4).

---

## STORYBOARD V2 (référence visuelle)

Frames canoniques dans `public/souverain/niger-uranium/assets/storyboard/` :
- `s1-hook-arlit.png` — carte Niger + pulse Arlit (sans fûts)
- `s2-partage-timeline.png` — barres comparatives (ref pour V_bars)
- `s3-nationalisation-split.png` — split (à adapter → halos Option C)
- `s4-procedures-flux-moscou.png` — carte monde + arc + CIRDI
- `s5-etranglement-symetrique.png` — globe + Niger isolé
- `s6-echiquier-flat.png` — échiquier 2D

**Note** : storyboard = référence de composition, pas de pixel-perfect. Les halos S3 et l'effet échelle S5 sont post-jury, non reflétés dans les images V2.

---

## RÈGLES TRANSVERSES (non-négociables)

1. **Symétrie d'humanisation** : toute scène passe le test "couper l'audio" — aucun camp ne doit sembler favorisé visuellement.
2. **Caption ≠ Headline** : les captions contiennent la source + la date + l'attribution. Les headlines sont narratifs sans source.
3. **S6 pas de caption** : c'est l'analyse, pas du sourcing. La voix assumée s'exprime seule.
4. **Palette 3 tons** : S1,S5=`#0a0a0a`, S2,S4=`#0f141a`, S3,S6=`#1a1410`. Pas de fond uniforme sur 96s.
5. **Audio-derived timing** : toutes les animations dérivent de `AUDIO_SEGMENTS` dans `timing.ts`. Zéro hardcode numérique.
