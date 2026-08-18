**RAPPORT DE GAP ANALYSIS — STORYBOARD vs RENDER**  
**Directeur Technique — Analyse sévère et chiffrée**

---

### **GAP-01 — CADRAGE ET ÉCHELLE DE CAMÉRA**  
**Sévérité: HIGH**

**Ce que montre le storyboard :**  
4 cadrages serrés et successifs qui font du tracé le sujet principal (il occupe 45 à 65 % de la hauteur du frame). Le continent n’est jamais entièrement visible. Focus progressif : Nigeria → Niger → Algérie/Adrar → vue d’ensemble contrôlée du scar.

**Ce que fait notre render :**  
Vue continentale ultra-large quasi-constante (Afrique + Amérique du Sud visibles). Le tracé et la tranchée sont minuscules, l’impact dramatique est totalement perdu.

**Fix :**
- 0–13 s : `center: [7.8, 13.2]`, `zoom: 5.35`, bounds `[-6.2, 3.8, 15.4, 21.8]`
- 13–22.2 s : transition douce (2.8 s) vers `center: [5.1, 19.4]`, `zoom: 5.9`
- 22.2–38 s : à 22.2 s exact, cut + zoom-in vers `center: [0.8, 27.1]`, `zoom: 6.45` (Adrar dominant)
- 38–55 s : pull-back contrôlé vers `center: [6.2, 21.5]`, `zoom: 4.45` (le scar doit remplir ~70 % de la hauteur de frame, l’Algérie doit rester bien visible, pas de Congo ni d’Europe)

---

### **GAP-02 — LA TRANCHÉE (SCAR)**  
**Sévérité: HIGH**

**Ce que montre le storyboard :**  
Cicatrice massive, texturée, irrégulière, avec couches de sol visibles. Clairement beaucoup plus large que le tuyau. Aspect "terre éventrée".

**Ce que fait notre render :**  
Fine bordure ocre lisse suivant une ligne cyan. Zéro texture, zéro dramaturgie. Inacceptable.

**Fix (valeurs exactes à coder) :**
- Largeur tuyau : `5.5 px` (`#00eaff`, glow `14 px` à 75 % opacity)
- Ratio tranchée/tuyau : **16.5x** au Nigeria → **11.8x** à Adrar (interpolation linéaire)
- Largeur totale tranchée : 91 px → 65 px
- 4 bandes de sol (extérieur → intérieur) :
  - `#241b14` (28 % de la largeur, noise ±14 px)
  - `#6b3f24` (37 %)
  - `#b88a5c` (24 %)
  - `#e6c99f` (11 % — bord immédiat du tuyau)
- `edgeNoiseAmplitude: 13.5 px`, `noiseFrequency: 0.042` (km⁻¹)
- `edgeDetailFrequency: 4.8` (petites variations irrégulières)
- Ajouter 6–7 mini-pelleteuses animées le long du tronçon algérien à partir de 22.2 s.

---

### **GAP-03 — RÉSEAU ALGÉRIEN EXISTANT**  
**Sévérité: HIGH**

**Ce que montre le storyboard :**  
Réseau dense, riche, qui "respire" l’infrastructure déjà mature. Multiples branches, nœuds brillants, impression de connexion immédiate à l’Europe.

**Ce que fait notre render :**  
3-4 branches faméliques. Aucun poids, aucune gravité.

**Fix :**
- 12 segments de pipelines (`thickness: 4.2 px`, couleur `#88eeff`, glow secondaire `24 px` à 42 % opacity)
- 19 nœuds (`radius: 7 px`, halo animé `radius: 26 px`, période 1.65 s, couleur `#ffffff` avec bloom)
- Apparition : à **22.2 s** exactement, draw animation sur 3.4 secondes (`strokeDashoffset` de 1.0 → 0.0)
- Intensité du glow des nœuds : `3.2x` pendant les 4 secondes suivant leur apparition, puis stabilisation à `1.8x`.

---

### **GAP-04 — INSET ADRAR**  
**Sévérité: HIGH**

**Ce que montre le storyboard :**  
Inset présent dès 22 s, de taille conséquente, avec pelleteuse claire et connexion visuelle forte au réseau.

**Ce que fait notre render :**  
Apparaît trop tard, trop petit, mal connecté. Rate complètement le moment narratif clé ("les pelleteuses sont déjà sur le terrain").

**Fix :**
- Taille : **328 × 204 px**
- Position : `top: 92 px`, `right: 88 px`
- Apparition : **22.2 s** (scale 0.2 → 1.0 + fade en 0.85 s)
- Contenu : carte détaillée Adrar avec **minimum 4 pelleteuses** en animation (bras + godet), tranchée en cours de creusement, texte "4 JUIN 2026 — DÉBUT DES TRAVAUX" en overlay.
- Connexion : bracket épais `6 px` (#ffffff, 65 % opacity) reliant le coin inférieur gauche de l’inset au point exact sur la carte principale.

---

### **GAP-05 — CONTRASTE AVEC LE PROJET CÔTIER (ligne pointillée jaune)**  
**Sévérité: MEDIUM**

**Ce que montre le storyboard :**  
Ligne pointillée jaune visible dès 0 s, matérialisant le "grand tour par la côte" en opposition au tracé direct.

**Ce que fait notre render :**  
Quasiment absente ou trop discrète.

**Fix :**
- `stroke: #ffcc22`, `width: 3.8 px`, `dashArray: [9, 14]`, `dashOffset` animé à 0.8 px/s
- Opacity : 0.9
- Animation : les points doivent "avancer" depuis le Nigeria vers le sud puis vers le nord le long de la côte à partir de 0 s.

---

### **priority_order** (ce qui améliorera le plus le résultat)

1. **GAP-01 (Cadrage/Échelle)** — Le problème le plus grave. Tout le reste est illisible à cette échelle.
2. **GAP-02 (Tranchée)** — C’est littéralement le sujet principal ("les pelleteuses sont déjà sur le terrain"). La version actuelle est catastrophique.
3. **GAP-03 (Réseau algérien)** — Critique pour la démonstration du concurrent "qui n’attend plus" et qui se branche sur de l’existant.
4. **GAP-04 (Inset Adrar)** — Timing et taille doivent absolument correspondre au beat narratif 22.2 s.
5. **GAP-05 (Ligne jaune)** — Important pour la clarté du récit concurrentiel.

Le rendu actuel est trop éloigné du storyboard validé. Les corrections ci-dessus sont chiffrées et directement implémentables. Elles doivent être appliquées avant la prochaine revue.