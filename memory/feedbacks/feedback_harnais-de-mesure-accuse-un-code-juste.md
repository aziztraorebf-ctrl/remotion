⛔⛔ **Un harnais de mesure peut accuser un code JUSTE — et absoudre un code FAUX.** Vécu 25-26/08/2026 (parseur de chemins SVG) : **4 mesures successives ont accusé un code correct**, et une 5e a déclaré « exact » un code faux. Coût : plusieurs heures à corriger ce qui marchait déjà.

**Why** — 3 pièges, tous génériques :
1. **Distance de Hausdorff entre deux nuages de densités différentes** → mesure l'espacement des échantillons, pas l'écart des courbes. Elle annonçait 0,57 px sur une conversion exacte à 1e-15.
2. **Appariement de segments** (« mon segment k vs leur segment k ») → un `Z` de fermeture ou un arc découpé en 1-4 cubiques suffit à décaler l'ordre. Un rectangle **exact** a été annoncé à 40 px d'erreur, puis 7,7.
3. ⛔ **Mesurer là où l'erreur s'annule par construction** — j'ai évalué l'erreur d'un arc à son seul point milieu, précisément l'endroit où l'approximation kappa est exacte. Verdict « exact » sur un code qui dérivait de 0,11 px à R=400.

**How to apply** :
- ⭐ **Préférer un INVARIANT INTRINSÈQUE à une comparaison échantillonnée.** « Tout point d'un arc circulaire est à R du centre » est exact, sans référence externe, sans appariement. C'est lui qui a révélé la dérive que 3 mesures avaient manquée.
- **Valider le harnais sur un cas dont on connaît la réponse** avant de conclure quoi que ce soit sur le code testé.
- **Un signal qui trie trop bien est suspect** : ici les cas à 2 segments étaient « parfaits » et ceux à 1 segment « faux ». Un vrai bug de géométrie ne trie pas comme ça — c'est ce qui a mis sur la piste.
- **Ne jamais mesurer au seul point où la théorie prédit zéro.** Balayer le paramètre entier.

⭐ **Corollaire, même famille** : quand le format cible ne peut pas représenter la source, **la spec ne dit rien de la meilleure approximation**. J'ai « corrigé » un rayon de dégradé radial d'après la spec SVG sans mesurer → régression (11,58 % → 11,91 %). Les 4 formules candidates ont dû être mesurées une par une. Voir [[element-correct-aiguillage-qui-l-annule]] pour le cas où c'est le CÂBLAGE, pas la mesure, qui trompe.

📄 Les 3 pièges sont gravés en tête du harnais qui les a payés : `src/projects/_client-sim/lottie-ui/tools/test_svgpath.py`.

---

⭐⭐ **4e piège, même famille — MESURER À CÔTÉ DE CE QUE LE FIX TOUCHE.** Vécu 02/09/2026
(chill-meter Upwork, élargissement de la plage tonale d'un SVG) : **2 mesures successives ont
déclaré « aucun effet » sur un correctif qui marchait.**
1. Zones de mesure calées sur un `--scale=2` que le rendu n'avait pas appliqué → je mesurais le
   **fond noir** (p5=1.0, ratio rigoureusement identique avant/après — un signal « trop propre »,
   cf. le point « un signal qui trie trop bien est suspect »).
2. Zones de métal correctes cette fois, mais qui ne **recouvraient pas les surfaces repeintes** →
   verdict « 6.1 → 6.1 ». J'ai failli conclure que la cause était ailleurs et repartir chercher.

✅ **Le remède est en 3 lignes et il est générique** : quand on mesure l'effet d'un changement
visuel, **construire le masque à partir du DIFF avant/après** (`|A - B| > seuil`) et ne mesurer que
les pixels réellement modifiés. Verdict réel une fois masqué : **ratio 3.9 → 6.0 (+54 %)**, le
correctif était bon depuis le début.

⭐ **Règle à appliquer avant de conclure « mon fix n'a rien changé »** : vérifier d'abord que la zone
mesurée est bien celle que le fix touche. Un `ImageChops.difference` le dit immédiatement — et il
donne aussi le **pourcentage de cadre modifié**, qui distingue « le fix n'agit pas » (0 %) de
« le fix agit mais je regarde ailleurs » (ici 15,4 %).
Cousin direct de [[comparer-a-etat-egal-avant-d-attribuer-un-ecart]] : là c'était l'ÉTAT des deux
objets qui rendait la comparaison invalide, ici c'est la ZONE.
