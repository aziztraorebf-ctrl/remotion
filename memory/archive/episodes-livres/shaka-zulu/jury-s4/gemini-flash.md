# Gemini 2.0 Flash (Google) — Jury S4 Nandi

> Modele : gemini-2.0-flash
> Date : 2026-05-02
> Tokens : estimation non disponible via SDK sync

OK, voici mes propositions pour la scène S4, structurées comme demandé, en essayant d'être aussi concret que possible.

## Q1 — Les 4 registres

### Registre 1 — Nandi était là (0→398)
- **Animation carte :** Légère pulsation de la couleur or. On garde une carte stable, chaleureuse, avec une couleur or pleine. Subtile animation de glow autour du palais de Shaka (uMgungundlovu), comme un foyer protecteur.
- **Personnage Nandi :** Nandi face caméra (south), animation `breathing-idle`. Placement centré en bas de l'écran, légèrement en avant de la carte (z-index). Opacité douce (80%), comme un souvenir. Sa présence est constante mais discrète.
- **Texte :** Apparition progressive des phrases en parchemin, Cormorant Garamond, positionné au centre haut de l'écran. L'arrivée du texte est lente et douce, comme une pensée qui émerge. Utilisation d'un léger flou gaussien qui s'estompe avec l'apparition complète du texte.

### Registre 2 — Nandi meurt (398→468)
- **Animation carte :** Transition rapide de l'or au bordeaux (60 frames, comme prévu). MourningWarp s'active, mais avec un scaling initial plus faible (ex: scale 0->10px au lieu de 0->18px, pour plus de subtilité).
- **Personnage Nandi :** Instant T : animation `falling-back-death` déclenchée. Elle tombe lentement hors du cadre, en se floutant progressivement.
- **Texte :** La phrase "Octobre mil huit cent vingt-sept. Nandi meurt." apparaît en bordeaux, plus petite que le texte précédent, et disparaît rapidement (fade-out rapide en 30 frames). C'est un constat bref et brutal.

### Registre 3 — 4000 périssent (468→777)
- **Animation carte :** MourningWarp s'intensifie (scale 10px -> 18px), cercles concentriques bordeaux plus vifs et rapides. Le pays ZAF commence à clignoter en bordeaux, de façon erratique et angoissante (pas un simple highlight, un vrai stroboscope de deuil).
- **Personnage Nandi (post-mortem) :** Absent. Totalement. Le vide laissé par sa disparition doit être palpable.
- **Texte :** Les phrases "Toute naissance est proscrite pendant un an. Tout champ reste sans culture." apparaissent en bordeaux, avec un effet de glitch (SVG filter `feTurbulence` appliqué au texte lui-même, avec une faible intensité). La typographie devient instable, reflétant le chaos.

### Registre 4 — ils l'assassinent (1149→1361)
- **Animation carte :** MourningWarp atteint son maximum. Les cercles concentriques ralentissent progressivement, comme une agonie. La carte entière devient plus sombre, saturée de bordeaux.
- **Personnage absent (Nandi morte, Shaka seul) :** Absence totale. Seule la carte déformée et assombrie persiste.
- **Texte :** Les phrases "Ses demi-frères Dingane et Mhlangana comprennent. L'homme qui a tout bâti est en train de tout détruire." apparaissent en parchemin, avec une police plus petite et un interligne plus grand, comme un murmure de désespoir. Le texte est positionné en haut à droite, comme une note marginale.

## Q2 — Nandi meurt (2.8s)

Technique : **Triple Flash + Goutte de Sang Abstraite**.

1.  **Flash blanc (1 frame) :** À la frame exacte où l'animation `falling-back-death` commence, insérer un flash blanc éphémère (opacité 1 pour 1 frame, puis 0). Ça crée un moment de choc visuel.
2.  **Flash bordeaux (3 frames) :** Immédiatement après le flash blanc, insérer un court flash bordeaux (opacité 0.8 pour 3 frames, puis fade-out rapide).
3.  **Goutte de Sang SVG :** Simultanément aux flashs, faire apparaître une unique et petite forme SVG abstraite (un cercle irrégulier bordeaux) en haut du cadre, qui tombe lentement (spring) jusqu'à disparaître en bas, en se floutant (flou gaussien progressif).  L'abstraction est clé. On ne veut pas une goutte réaliste, mais une forme stylisée et discrète.  Utiliser `feGaussianBlur` sur la goutte elle-même.

## Q3 — DramaLine "Pour n'avoir pas pleuré assez fort"

Design : **Typographie fracturée**.

1.  **Police :** Basculer sur une police sans-serif, grasse et brutale (ex: Montserrat Black). Le contraste avec le reste du texte renforce l'impact. Couleur bordeaux foncé (#4B0000).
2.  **Fracture :** Utiliser un SVG filter `feTurbulence` beaucoup plus intense que pour les autres textes. La phrase doit apparaître déjà "cassée", fragmentée.
3.  **Animation :** Pas de fade-in. La phrase apparaît instantanément (opacité 1). Puis, pendant sa durée d'affichage, l'intensité du `feTurbulence` augmente légèrement, comme si la phrase se désintégrait sous nos yeux.
4.  **Position :** Centrée verticalement et horizontalement, au milieu de la carte. La phrase *doit* bloquer la vue.
5.  **Taille :** Plus grande que les autres textes, mais pas excessivement. L'important est l'effet de fracture, pas la taille brute.
6.  **Durée :** Rester affichée plus longtemps que les autres phrases, pour que l'impact ait le temps de se faire sentir.

## Q4 — Cartouche "22 SEPTEMBRE 1828"

Design + animation : **Épitaphe Gravée**.

1.  **Style :** Rester cohérent avec les cartouches sources existants (parchemin, police Cormorant Garamond). Cependant, le cartouche de la date de l'assassinat doit avoir un aspect "gravé" dans la pierre. Utiliser un léger effet d'ombre portée (CSS `text-shadow`) pour simuler la gravure.
2.  **Couleur :** Gris sombre (#333333), comme de la pierre gravée.
3.  **Animation :** L'animation d'entrée est une apparition progressive de la gravure. Utiliser un masque SVG animé (clip-path animé) pour révéler le texte de bas en haut, comme si la date était sculptée dans la pierre en temps réel. Vitesse lente et solennelle.
4.  **Position :** Centré en bas de l'écran, sous la carte.
5.  **Lien visuel avec la carte :** Au moment où le cartouche apparaît, la carte (déformée par MourningWarp) effectue un lent zoom arrière, révélant progressivement un contour doré autour du territoire zoulou (comme si le territoire survivait, mais meurtri). Le doré est très subtil et se fond avec le bordeaux.

---

**VERDICT**

*   **Priorité haute :**
    1.  **Q2 - Triple Flash + Goutte de Sang Abstraite :** Essentiel pour marquer la mort de Nandi de manière subtile et percutante.
    2.  **Q3 - Typographie fracturée :** La phrase "Pour n'avoir pas pleuré assez fort" doit être un coup de poing visuel.
    3.  **Q4 - Épitaphe Gravée :** Conclure sur une note sobre et mémorable.

*   **À ÉVITER absolument :** Toute forme de pathos ou d'illustration littérale de la violence. L'abstraction est la clé pour respecter le ton de la vidéo.  Éviter les effets spéciaux trop tape-à-l'oeil. Le minimalisme et la subtilité seront plus efficaces.
