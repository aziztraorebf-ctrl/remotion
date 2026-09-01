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
