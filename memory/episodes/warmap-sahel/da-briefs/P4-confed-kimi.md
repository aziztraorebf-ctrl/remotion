**REVIEW — REFONTE SCÈNE AES**  
*Stack: Mapbox 2D top-down, frame-driven (interpolate/spring), Parchemin (#F5F3EF, #2A1C0E, #C9A24B), Lucide/SVG maison prioritaire.*

---

### 1. LE FOND OR NOBLE (Fix du jaune pisseux)

**Problème :** Le multiply à 40% sur un land clair crée une soustraction de couleur qui vire à l'ocre-urine. C'est une erreur de mode de fusion héritée des slides PowerPoint.

**Solution « 3e voie » (dans la stack) :**
- **PAS de remplissage de surface** (ou à 5% d'opacité max). Le sens « bloc soudé » ne vient pas d'un pâté de couleur, mais de la **ligne de contour**.
- **Contour épais englobant** : Un seul `<path>` fusionné des 3 pays (union géométrique simplifiée ou rendu visuel par alignement parfait) en stroke `#C9A24B`, `stroke-width: 4px` (interpolé de 1px à 4px pendant la fusion), `stroke-linecap: round`, `stroke-linejoin: round`.
- **Halo subtil** : Un `<filter>` SVG maison `drop-shadow(0 0 6px rgba(201,162,75,0.3))` derrière le contour — pas de blur CSS, du SVG filter rendu par le navigateur, net et contrôlé.
- **Fill test** : Si vous voulez vraiment une teinte, `fill: rgba(201,162,75,0.08)` — juste un soupçon pour区别 le bloc du reste du Sahel, sans jamais saturer.

*Résultat :* L'or est mat, noble, gravé, comme de l'encre dorée sur parchemin. Pas de jaune plastique.

---

### 2. LE SCEAU (Remplacement de l'image ratée)

**Verdict :** L'image carrée/blanche est disqualifiée. **Redessinez en SVG/Lucide.**

**Composition technique « Sceau de Confédération » :**
- **Base** : `<Shield>` Lucide (stroke `#C9A24B`, fill `rgba(245,243,239,0.9)` pour simuler la cire crème sur parchemin).
- **Emblème central** : `<Star>` (pour l'union) OU mieux : un `<path>` dessiné maison simple (deux épées croisées en V, 3 points) — 10 lignes de path max.
- **Anneau gravé** : Un `<circle>` concentrique, `stroke-width: 2`, `stroke-dasharray: 4 2` (effet perlé).
- **Texte** : Pas de police système. Utiliser une `<text>` SVG en `font-family: serif` (Times ou équivalent système suffisant pour du gravé), `letter-spacing: 0.2em`, texte « AES » ou « 2024 » en arc (path text si maitrisé, sinon horizontal sobre sous l'étoile).
- **Ombre portée** : `filter="drop-shadow(2px 4px 0px rgba(42,28,14,0.15))"` — ancrage au sol obligatoire, pas de flottement.

**Animation « effet tampon » (frame-driven) :**
```javascript
// Spring pour l'impact
const scale = interpolate(frame, [start, start+8, start+20], [1.4, 1.1, 1], {easing: Easing.elastic(1.2)});
const rotate = interpolate(frame, [start, start+10], [8, 0]); // Rotation "cire molle"
const opacity = interpolate(frame, [start, start+5], [0, 1]);
```
L'ombre se décale légèrement pendant la chute (du haut-gauche vers bas-droite), puis se stabilise.

---

### 3. L'OVERLAY (Show not tell)

**Verdict :** Supprimez le cartouche flottant. C'est du **tell** pur.

**Remplacement :**
- **Date « 2024 »** : Gravée directement sur la carte, en bas à droite du sceau (position Niamey), en petit caractères serif `#2A1C0E`, opacité 0.8.
- **Légende spatiale** : Si la voix dit « force armée commune », montrez des **lignes de communication** (ondes) partant du sceau vers les 3 capitales (Bamako, Ouagadougou, Niamey). Pas besoin de texte : la géométrie raconte.

---

### 4. LE RÉCIT — « Moment fondateur » (Storyboard 14s)

**Grammaire causale stricte** (Cause → Effet) :

| Temps | Action visuelle | Technique | Sens |
|-------|----------------|-----------|------|
| 0-2s | Les 3 contours existent (hérités ou qui se dessinent) | `stroke-dashoffset` | Les acteurs sont là |
| 2-4s | **Flash** or sur les 3 contours (courte surbrillance) | `brightness` filter ou stroke blanc temporaire | Le déclencheur politique |
| 4-7s | **Disparition des frontières internes** (opacité 1→0) + **Fusion des externes** (épaississement 1→4px) | `interpolate` opacité et width | Les 3 ne font plus qu'un |
| 7-9s | **Chute du sceau** sur Niamey | Spring scale/rotate + ombre | Acte fondateur (QG) |
| 9-12s | **Ondes radio** (3 cercles concentriques) partent du sceau vers les 3 capitales | `scale` + `stroke-dashoffset` animé | La force commune rayonne |
| 12-14s | **Pulsation** douce du sceau (breathing) | `Math.sin(frame/10)*0.02` sur scale | Statu quo vivant |

**Hiérarchie du regard :** Toujours centré sur le triangle des 3 pays → le sceau attire l'œil (or sur parchemin) → les ondes guident vers les capitales périphériques.

---

### 5. AI-SLOP (Diagnostic des frames fournies)

**Ce qui crie « généré sans direction artistique » :**
- **Couleur bancale :** Le jaune #D4AF37 saturé avec multiply sur gris = teinte de bile. C'est l'astuce de l'IA qui ne maîtrise pas les modes de fusion.
- **Typo flottante :** Le cartouche blanc avec ombre diffuse (probablement `box-shadow` CSS standard) flotte au-dessus de la carte comme une infobulle Windows 95, pas comme un élément cartographique.
- **Sceau sans ancrage :** Le carré blanc visible est le signe d'un `img` posé avec `background: white` ou un PNG non détouré. C'est l'amateurisme du « j'ai trouvé une image sur Google ».
- **Aplat géométrique :** Les frontières internes restent visibles (manque de fusion) → la carte dit « 3 pays voisins » pas « 1 confédération ».

**Correction dans la stack :** Tout doit être du SVG vectoriel, des couleurs hex exactes de la charte, des ombres portées directionnelles cohérentes (même source de lumière top-left pour tous les éléments), et des animations avec easing `cubic-bezier` ou spring, jamais de linear.

---

### 6. LE PIÈGE DU TROP (Garde-fous)

**Risques :**
- **Surcharge symbolique :** Ajouter drapeaux, armes, étoiles, et le sceau = Noël.
- **Ondes trop nombreuses :** Plus de 3 cercles d'onde = effet radar cheap.
- **Texte partout :** La tentation de mettre « Mali », « Niger », « Burkina » en plus du sceau.

**Règle des 3 éléments :** À tout moment, max 3 couches d'information :
1. La carte (fond)
2. Le contour or fusionné (l'information principale)
3. Le sceau + une onde (le détail narratif)

**Espace négatif :** Laisser le parchemin respirer. L'or fonctionne par contraste avec le vide, pas par accumulation.

---

## ANGLES OBLIGATOIRES (Réponses détaillées)

### 1. SPECTATEUR LAMBDA
- **0-4s :** Il voit 3 pays se « souder ». Il comprend que c'est une union car les lignes disparaissent (pas besoin de texte).
- **4-7s :** Un sceau apparaît sur Niamey. Il comprend que c'est le QG (point central).
- **7-14s :** Des lignes partent vers les capitales. Il comprend « commandement centralisé, rayonnement ».

**Décrochage potentiel :** Si l'overlay texte reste, il lit le texte au lieu de regarder la carte → il rate l'animation de fusion. **Solution :** Retirer l'overlay.

### 2. NARRATION / SYNCHRO
**Beat matching :**
- « Confédération » (t 2s) → Flash or sur contours.
- « Force armée commune » (t 6s) → Apparition du sceau + début des ondes.
- « Niamey » (t 7s) → Le sceau touche le sol (impact).
- « Ex-base Barkhane » (t 10s) → Les ondes atteignent les anciennes positions françaises (si visibles) ou simplement les frontières.

**Pas de redondance :** La voix dit « 2024 » ? La date est gravée discrètement. La voix dit « commune » ? Les ondes montrent la connexion. Pas de répétition textuelle.

### 3. TRANSITIONS VS ÉTATS
**Problème actuel :** La frame 11640 et 11680 montrent le même état (sceau posé, overlay présent). C'est un état figé, pas une transition.

**Correction :** Tout doit être en mouvement :
- Même quand le sceau est posé (12-14s), il pulse doucement (breathing).
- Les ondes sont des animations continues (création + destruction de cercles).
- **Pas de cut sec :** La caméra (dans `useCurrentFrame`) doit avoir un léger drift (move 5-10px) pour éviter l'effet photo.

### 4. AI-SLOP (Spécifique technique)
**Signes détectés sur vos frames :**
- **Teinte de peau malade :** Le multiply or/gris crée une couleur chair/moutarde (hue ~45°) qui n'existe pas dans la charte parchemin.
- **Typo générique :** Le cartouche utilise probablement une police sans-serif système (Arial/Roboto) centrée, sans lien avec l'encre brune du reste.
- **Ombre diffuse non directionnelle :** L'overlay a une ombre « drop shadow standard » (0px 4px 10px rgba(0,0,0,0.2)) qui flotte, contrairement aux ombres portées nettes du style parchemin (directionnelles, 45°).
- **Manque d'anti-aliasing contrôlé :** Le sceau image est pixellisé (carré blanc visible), cassant la netteté vectorielle du reste.

**Fix :** Tout passer en SVG avec `shape-rendering="geometricPrecision"` et les couleurs exactes hex.

### 5. EXPERT DU MÉTIER (Pro/amateur)
**Ce qu'un pro (type Tom Haugomat ou studio Norfik) ferait différemment :**
- **L'économie du trait :** Un seul trait or épais vaut mieux que 3 traits fins + un fill jaune. La ligne est reine en cartographie.
- **La cohérence de lumière :** Toutes les ombres (sceau, contours, texte) ont le même angle (ex: 135° / haut-gauche). L'amateur laisse l'ombre par défaut centrée.
- **Le timing :** L'animation du sceau utilise un `elastic` easing (ressort) pour l'impact, pas un simple `ease-out`. Ça donne du poids physique.
- **L'absence de UI :** Pas de bulle texte. La carte *est* l'interface. La date est « gravée » sur le terrain comme sur une carte ancienne.

---

## SECTION AI-SLOP — TEST DÉTAILLÉ

**En se mettant dans la peau d'un spectateur averti :**

*« C'est du Remotion/Canvas généré à la va-vite. Le gars a mis un fill jaune avec opacité 0.4 et un multiply parce qu'il ne sait pas gérer la superposition de couleurs en RGB. Le sceau est un PNG trouvé sur Wikipédia, pas retouché, avec son fond blanc immonde. Le cartouche "2024 · Confédération" est un composant React copié d'un dashboard Admin, centré avec `margin: 0 auto`, complètement déconnecté de la géographie. Les frontières internes sont encore là, donc le mec ne sait pas ce qu'est une confédération (fusion), ou il a eu la flemme de masquer les lignes. C'est du dataviz amateur, pas du design documentaire. »*

**Corrections techniques dans notre stack :**

1. **Couleurs :** Créer une constante `OR_NOBLE = '#C9A24B'` et `OR_TRES_FADE = 'rgba(201,162,75,0.08)'`. Interdiction stricte de `mix-blend-mode: multiply` sur la carte.
2. **Sceau :** Composant React `<SceauAES />` retournant un `<svg viewBox="0 0 100 100">` avec :
   - `<Shield size={40} strokeWidth={2} />`
   - `<Star size={16} fill={OR_NOBLE} style={{transform: 'translate(42px, 42px)'}} />`
   - Animation par `useCurrentFrame` avec spring.
3. **Typo :** Utiliser une police serif système (`Times New Roman` ou `Georgia`) pour l'ancien, jamais de sans-serif. Positionnement absolu sur la carte (x/y calculés en fonction du centroid de Niamey), pas de `position: fixed`.
4. **Frontières :** Deux layers : `borders-internal` (opacité interpolée 1→0) et `border-external` (stroke-width interpolé 1→4).
5. **Timing :** Utiliser `spring({fps, frame, config: {damping: 10, stiffness: 50}})` pour tous les mouvements d'impact (sceau, flash).

**La « 3e voie » supérieure :** Pour les ondes radio, ne pas utiliser de sprite. Créer un composant `<Onde>` qui génère un `<circle>` SVG dont le `r` (rayon) augmente avec `frame`, et l'opacité diminue. C'est net, c'est vectoriel, c'est gratuit, et c'est à la charte exacte.

---

**CONCLUSION OPÉRATIONNELLE**

Votre plan de refonte est bon, mais **radicalisez-le** :
- **Zéro fill jaune.** Contour or épais uniquement.
- **Zéro image.** Sceau 100% SVG Lucide+Path.
- **Zéro overlay texte.** Date gravée sur la carte.
- **Animation causale stricte :** Les lignes disparaissent (cause) → le bloc naît (effet) → le sceau tombe (cause) → les ondes rayonnent (effet).

Ces 14 secondes doivent ressembler à une **gravure qui s'anime**, pas à une diapositive qui défile.