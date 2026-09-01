Le contrôle anti-gel habituel (hasher des frames échantillonnées, vérifier qu'aucune n'est identique)
**ne détecte pas** le défaut qui fait rejeter une scène : une image qui change techniquement mais reste
perceptivement immobile. Un pixel qui bouge suffit à rendre le hash unique.

Vécu 2026-08-14, Gazoduc Acte 3 : zéro duplicat au hash, et pourtant **11,5 s puis 14 s puis 12 s
consécutives quasi figées** selon les versions (0,04 % à 0,35 % de pixels modifiés entre frames
espacées de 0,5 s). C'est exactement le défaut qui avait fait qualifier une version antérieure de
« catastrophique », et il violait la règle « rien de statique > 5 s » sans qu'aucun check ne le signale.

Cause typique dans le code : un `interpolate`/`spring` qui atteint sa cible puis SATURE, laissant la
caméra strictement immobile pendant le reste du beat (`Math.min(1, p)` avec p qui converge en 2-3 s
alors que le beat dure 15 s).

**Why:** un défaut invisible aux checks automatiques est un défaut qu'on livre — et c'est le
réalisateur qui le découvre, ce qui coûte un aller-retour complet et de la confiance.

**How to apply:**
```bash
ffmpeg -y -i <video>.mp4 -vf fps=2 <dir>/h%03d.png
# puis, en Python (PIL+numpy) : pour chaque paire consécutive,
#   pct = (diff.max(axis=2) > 10).mean() * 100
# Rapporter min / médiane / max ET la PLUS LONGUE SÉRIE consécutive sous 0,5 %.
```
Seuils constatés comme sains après correction : min > 1 %, médiane ≈ 5 %, plus longue série figée = 0 s.
Rapporter la série la plus longue est le chiffre qui compte — une somme de fenêtres isolées ne dit rien.

Correctif côté code : étaler la transition sur toute la durée du beat, et ajouter une dérive continue
(push-in lent + glissement) qui ne sature jamais, plutôt qu'un drift sinusoïdal de ±6 px (trop faible
pour se lire comme du mouvement).

Voir aussi [[camera-a-coups-easeinout-par-segment-pas-un-dosage]] et
[[verifier-mouvement-video-pas-juste-frames-isolees]].

---

## 3e cas — un clip qui BOUGE mais dans le mauvais sens (asset généré, 2026-08-15)

Même famille, symptôme inverse : là c'étaient des frames qui changeaient sans bouger, ici c'est un clip
qui bouge **sans qu'on voie QUOI ni DANS QUEL SENS**. Le check binaire habituel (« ça n'est pas gelé »)
laisse passer le défaut rédhibitoire dans les deux cas.

**4 défauts sur les inserts H3, tous invisibles à l'œil, tous trouvés par mesure** :
1. une conduite dont le gaz **se vidait** progressivement — révélé par la zone censée rester vide,
   mesurée **17× plus mobile** que la zone matière ;
2. un FPSO censé être à quai qui **dérivait de 15 px** sur 5 s ;
3. **32 % de chaque clip rogné** par un cadre au mauvais ratio (2.64:1 pour un clip 16:9) — un tiers
   d'un asset payé jamais affiché ;
4. inversement, **ma lecture visuelle était FAUSSE** là où la mesure était juste (j'allais « corriger »
   un point d'ancrage géographique qui était correct).

**Pourquoi l'œil échoue ici** : sur une vignette de 5 s en boucle, le regard s'habitue au mouvement et
normalise la dérive — il voit « ça bouge, c'est bon » sans voir ce qui ne DEVRAIT PAS bouger.

⭐ **Outil dédié** : `scripts/tools/measure-insert-clip.py` (mouvement médian global ET par zone,
dérive horizontale, ratio de boucle, écran noir de fin, luminosité début/fin).
**Règle** : tout clip d'insert passe par la mesure avant d'être intégré OU présenté à Aziz. Les bandes
noires se vérifient en comptant les lignes/colonnes quasi-noires, jamais à l'œil.


---

## ⚠️ LE REVERS (2026-08-17, Gazoduc Acte 5) — UNE MESURE TROP GROSSIERE MENT AUSSI

Ce fichier dit « mesurer plutot que juger a l'oeil ». Vrai — mais **la mesure doit avoir la bonne
resolution**, sinon elle produit des faux positifs qu'on suit en boucle.

**Le detecteur d'immobilite maison** (diff de vignettes **320px**, seuil global sur l'histogramme)
est **AVEUGLE aux mouvements LENTS et LOCALISES**. Vecu 2 sessions consecutives :
- Acte 4 mouvement C : il annonce **10s figees** entre 21s et 31s → mesure fine (5 fps, 640px, seuil
  par pixel) : **400 a 1000 pixels changent a CHAQUE frame**. Le lisere se fermait, le sol se dessinait.
- Acte 5 segment 1 : il annonce **9s figees** → **7180 pixels changent** entre 3s et 5s.

Dans les deux cas j'ai **itere plusieurs fois** pour "corriger" un probleme inexistant avant de verifier.

**La regle** : ce detecteur sert a TROUVER un vrai trou (il a eu raison sur les 7.5s reelles de la v1
du 4C). Des qu'il signale une plage, **avant d'iterer** :
1. mesure fine sur 2 frames rapprochees de la plage : `pixels dont |delta| > 6` — si > 0, ce n'est pas fige ;
2. **REGARDER** un crop zoome de la zone concernee.
Ne jamais enchainer 2 corrections sur son seul verdict.

⭐ **Generalisable** : quand un outil de mesure et l'oeil se contredisent, verifier la RESOLUTION de
l'outil avant de croire l'un ou l'autre. Un outil calibre pour un defaut (le gel franc) ne detecte pas
son voisin (le mouvement trop lent).
