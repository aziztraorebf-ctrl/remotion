# Jury LLM — Pass Jour 3 — Bibliothèque Templates Souverain

## Contexte projet

**Souverain** = chaîne YouTube francophone Afrique, format short 9:16 (1080×1920).
Sujets : géopolitique, ressources naturelles, mémoires postcoloniales.
Audience : 25-45 ans, francophones, recherchent rigueur éditoriale + identité visuelle distinctive.
**ADN visuel** : pas de dramatisation, sources visibles, palette panafricaine (or, rouge brique, indigo, kraft).
**Anti-modèles** : Time Magazine (trop générique), BBC (rouge trop signature), TikTok rapide (incompatible avec rigueur).

## Templates en évaluation (3)

### Template Insert — SmallMultiplesGrid
**But** : insert data-viz comparatif multi-pays (3 pays, 3 courbes simultanées, dates X, annotations).
**Inspiration** : The Pudding "loneliness epidemic" (grille SCRT).

- Variante Cream : https://files.catbox.moe/m64nbj.png
- Variante Kraft : https://files.catbox.moe/kqrqd1.png

### Template D — KraftCard (3 options)
**But** : carte d'identité d'un acteur politique/pays. Format "fiche + citation".
**Inspiration** : WonderWhy beige + magazine cover éditorial.

- Option 1 (Cadre collection premium) : https://files.catbox.moe/8w5m2p.png
- Option 2 (Magazine cover, fond drapeau flou) : https://files.catbox.moe/5dzkt4.png
- Option 3 (Fond narratif, drapeau Niger plein écran assombri) : https://files.catbox.moe/t9pcuh.png

### Template C — AtlasRealiste3D (3 phases)
**But** : carte satellite 3D pour situer un pays dans son contexte géographique. Pays focus en or, monde en gris.
**Inspiration** : RealLifeLore + Wendover + Vox.

- Phase A (Luminosité corrigée + overlay monde gris) : https://files.catbox.moe/q5289i.png
- Phase B (satellite-streets-v12 + overlay) : https://files.catbox.moe/mawimd.png
- Phase C (Hillshade SEUL, sans overlay monde) : https://files.catbox.moe/7dmds0.png

---

## Questions par template

### Pour SmallMultiplesGrid (frames 01 + 02)
1. **Bug visuel factuel** : alignement, overflow, lisibilité — problème objectif ?
2. **Hiérarchie de l'info** : sur 3s de visionnage, on regarde quoi en premier ? Est-ce le bon ordre (entité → tendance → annotation) ?
3. **Identité distinctive** : on dirait un insert de quelle chaîne (référence) ? Reconnaissable comme Souverain ou générique ?
4. **Verdict** : KEEP / TWEAK (avec quoi) / REWORK (vers quoi)

### Pour KraftCard (frames 03 + 04 + 05)
1. **Bug visuel factuel** par option : taille, lisibilité, hiérarchie
2. **Hiérarchie de l'info** : sur 3s, ordre de lecture pour chaque option
3. **Quelle option fonctionne le mieux** comme carte d'identité d'un dirigeant africain ?
4. **Verdict** : pour chaque option, KEEP / TWEAK / REWORK + recette

### Pour AtlasRealiste3D (frames 06 + 07 + 08)
1. **Lisibilité** : Phase A et B sont très sombres (Sahara naturellement noir + overlay 0.62 = empilement). Bug ou parti pris ?
2. **Phase C (hillshade seul)** : qualité du rendu, lisibilité du Niger en or, contexte Afrique
3. **Recommandation** : abandonner Phase A et B + garder seulement C ? OU les retravailler ?
4. **Verdict global Template C** : 1 phase suffit-elle ou faut-il 2 styles de carte 3D distincts dans la lib ?

---

## Question transversale (pour tous)

Aziz a proposé 4 directions design alternatives à explorer pour Souverain :
- **A. Risographe** (impression imparfaite, palette limitée 2-3 couleurs surimprimées, grain)
- **B. Brutalisme éditorial** (sans-serif massive type Druk, grilles cassées, zéro ornement)
- **C. Document classifié / archive de terrain** (tampons, surlignages, papier kraft, polaroid taped)
- **D. Cinématique sobre** (étalonnage couleur teal/orange ou monochrome + 1 accent, typo générique de film)

**Sur ces 4 directions, laquelle prioriser pour les prochains templates Souverain ?**
Réponse attendue : 1 direction recommandée + raison principale + risque principal.

---

## Format de réponse demandé

Pour chaque template (3) + question transversale :
- **Verdict** (1 mot : KEEP / TWEAK / REWORK / direction A-D)
- **Top 3 corrections concrètes** (1 ligne chacune, actionnable)
- **Top 3 forces à préserver**

**Pas de blabla.** Pas d'introduction. Pas de "c'est intéressant". Verdict + corrections + forces, point.
