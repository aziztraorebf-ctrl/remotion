# DECODE MOTION — Silicon Savannah / M-Pesa (grammaire Data-Hero réutilisable)

> Décodage FRAME PAR FRAME du MOTION (pas la narration) de notre propre vidéo `silicon-savannah-FINAL.mp4`
> (PRÊTE-PUBLICATION, a très bien marché). Fait 2026-06-19 (agent Explore + lecture code source
> `src/projects/_demos/afrique-numerique/AfriqueNumeriqueShort.tsx`). Format 9:16 mais grammaire transposable 16:9.
>
> ⭐ POURQUOI CE DÉCODAGE COMPTE : Aziz a rappelé que cette vidéo + le hook Sénégal utilisent LE MÊME principe
> (objet-héros central qui RESTE, on enrichit autour) = notre doctrine de continuité. C'est la FORME JUSTE de
> beaucoup de moments "data/abstrait". La règle n'est PAS "pas de templates" mais "intention → Data-Hero est
> souvent la forme juste". Lié à [[CONTINUITE-SCENE-INTENTION-DABORD]] + `memory/rules/rules-data-driven-motion-design.md` (T1-T8).
> ⚠️ NE PAS en faire un template-first aveugle : abstrait→Data-Hero Remotion OK, mais SPATIAL/jugements→CARTE (Aziz).

## 1. LE PIVOT CENTRAL (la technique-clé)
Un OBJET-HÉROS au centre qui NE BOUGE JAMAIS, les données se greffent AUTOUR (jamais sur lui).
- Pivots observés : Nokia 3310 · pièce M-Pesa · tour/antenne · trapèze (rails). Chacun ~20-50% hauteur, centre.
- Les "plaques de données" apparaissent par CÔTÉ (LEFT/RIGHT symétrique), JAMAIS empilées au-dessus/dessous.
- Le pivot peut se TRANSFORMER morphologiquement pour la transition (tour → trapèze) = continuité, pas cut.

## 2. GRILLE DE PLACEMENT (9 zones, centre réservé au pivot)
```
[TOP-LEFT]   [TOP-CENTER]   [TOP-RIGHT]
[MID-LEFT]   [  PIVOT   ]   [MID-RIGHT]
[BOT-LEFT]   [BOT-CENTER]   [BOT-RIGHT]
```
Données = SEULEMENT les 8 zones périph. Max 2 zones occupées à la fois (souvent LEFT+RIGHT symétrique).

## 3. TIMING / RYTHME (la règle des ~5s, prouvée)
- **Chaque "état data-hero" tient 5-6 s** avant d'évoluer. (= notre règle des 5s du hook, confirmée.)
- Séquence type d'un plateau : pivot seul (2-3 beats) → 1er label (1 beat) → label opposé (1-2 beats) →
  tenue stable (3-5 beats) → overlay narratif/verdict (2-4 beats). ~5-6s total.
- Transitions entre actes : CUT sec (1-2 frames) OU fondu court (2-3 frames). PAS de motion entre actes
  SAUF morph narratif-critique (tour→trapèze). 6 actes ~18-24s chacun.

## 4. EMPILEMENT SANS SURCHARGE (le cœur)
- **UNE donnée à la fois, UNE PAR CÔTÉ.** Jamais 2 labels du même côté en même temps.
- **Max 5-6 éléments simultanés** : pivot + 4 labels max + fond. Jamais plus de 3-4 data autour.
- Apparition DÉCALÉE ~1-2 frames (1.2-2.4s) = "vague progressive", pas "explosion/bombardement".
- **HALO/glow radial autour du pivot** = crée du VIDE, le pivot RESPIRE, les data ne le touchent pas.

## 5. FOND = SENS (progression chromatique)
- Chaud/doré (optimisme) → bleu marine froid (sérieux/données) → très sombre (monopole/éthique) → noir (question).
- **Vignette qui MONTE** progressivement (bords de + en + noircis = focus resserré, presque claustro à la fin).
- **Grain qui s'INTENSIFIE** sur les scènes critiques (rugosité = problématique). Grille fine <10% (thème "data").
- Couleurs SÉMANTIQUES (jamais neutres) : ROUGE=coût/alarme · VERT=épargne/bonne nouvelle · OR=prestige/tech.

## 6. CE QUI REND PREMIUM (vs vectoriel plat) — la checklist
- **Ombre portée** légère (2-3px) sous le pivot = semi-3D, pas flat.
- **Glow/luminescence** sur les data importantes (elles "brillent").
- **Easing** : tout slide+fade ease-out, JAMAIS de pop binaire (opacity 0→1 sec). Micro-pulse du glow (vie).
- **Variation d'épaisseur de trait** = hiérarchie (Nokia épais=iconique, antenne fine=fragile).
- **Entrées organiques** : labels slide ease-out, rayons en stagger (1 par frame), barres "gravity" (du bas).
- **Color grading** : navy tire vers teal, or quasi-néon, vert/rouge spécifiques (pas génériques).
- **Typo = motion** : tailles RADICALEMENT différentes pour l'impact (5% >> 0.22%), serif or = autorité.
- **Fond multi-couches** (grain + couleur + vignette + lignes diag subtiles) = profondeur.

## TEMPLATE RÉUTILISABLE (pseudo)
1. PIVOT central verrouillé (objet iconique, 1 couleur dominante + accent). Ne bouge jamais.
2. ≤4 labels, LEFT/RIGHT symétrique, 1 nouveau par ~1.2-2.4s (décalé, pas simultané).
3. HALO radial autour du pivot (respiration).
4. Timing : 5-6s/plateau. Entrée ease-out, jamais de pop.
5. Couleurs sémantiques (rouge coût / vert bénéfice / or prestige).
6. Fond évolue avec le sens (chaud→froid→sombre), vignette+grain montent.
7. Transition : cut/fondu court, OU morph du pivot si narratif.

## MAPPING vers notre doctrine T1-T8 (memory/rules/rules-data-driven-motion-design.md)
T5 Permanent Motion Anchor = LE PIVOT. T1 Narration-Synced Reveal = data qui apparaît sur le mot.
T3 Counter = compteur. T2 Asymmetric Bar = comparaison LEFT/RIGHT. T7 Verdict Impact = le verdict rouge.
T6 Progressive Background = fond=sens. T8 Separator = la ligne diviseur État/Privé. → On AVAIT déjà tout.

## CODE RÉEL (preuve, réutilisable) : `src/projects/_demos/afrique-numerique/AfriqueNumeriqueShort.tsx`
6 Sequences (A1-A6), spring partout (damping 14-18), labels en spring décalés (frame - delay).
Pattern barres : widthP = spring(frame - delay - 10). C'est notre code, à reprendre pour la scène 1.
