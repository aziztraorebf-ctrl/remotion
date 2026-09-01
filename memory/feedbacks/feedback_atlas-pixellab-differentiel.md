Atlas voie B — PixelLab est le différentiel par défaut, pas un plan B. Primitives = géographie du
mouvement, sprites = acteurs du récit.

Correction de doctrine demandée par Aziz (2026-06-03, session décodage mapanimation voie B Atlas).

Ma version initiale "escalade N0 primitives → N1 marqueur → N2 sprite, monter SEULEMENT si nécessaire" était TROP TIMIDE : elle traitait PixelLab comme un coût à éviter, un dernier recours. Aziz a corrigé.

**La règle correcte :**
- **Primitives (flèches/fills/labels) = racontent la GÉOGRAPHIE du mouvement** (où va l'armée, quel territoire se remplit).
- **PixelLab (sprites figuratifs) = racontent les ACTEURS du récit** (l'armée elle-même, l'explorateur, les éléphants d'Hannibal, la flotte).
- Les primitives n'remplacent PAS les personnages, elles les ACCOMPAGNENT : la flèche montre la trajectoire, le sprite EST l'acteur qui la parcourt.

**PixelLab par DÉFAUT dès qu'un acteur du récit est présent — c'est la règle, pas l'exception.**

**Why :** PixelLab est le DIFFÉRENTIEL de la chaîne. Sans lui, on est "juste une autre carte 2D flat" = un clone de mapanimation.io (qui ne PEUT PAS faire de figuratif, son plafond prouvé = marqueur-objet anonyme, cf. test cargo). Les personnages pixel-art sont ce qui rend les vidéos uniques et reconnaissables. Reléguer PixelLab au second plan = perdre la signature.

**How to apply :**
- Quand on conçoit un beat Atlas tactique : se demander d'abord "qui est l'acteur ?" → l'incarner en PixelLab. PUIS ajouter les primitives (flèches/fills) pour la géographie autour.
- Cas types où PixelLab s'impose : mouvements de troupes (Hannibal Alpes), formations de bataille (Cannes, encerclement), explorateur sur une route, flotte. C'est PRÉCISÉMENT l'intérêt de la démarche voie B (montrer les formations/manœuvres sur la carte).
- mapanimation = banc de référence pour la MÉCANIQUE (flèches, camera-follow, séquençage). On reproduit la mécanique + on AJOUTE le sprite par-dessus = ce qu'ils ne peuvent pas faire.
- Quota Route Pack = 40 animations / 90j (pas 10). Donc généreux pour tester, notamment les FORMATIONS de bataille (pas encore testées au 2026-06-03).

Lié : `feedback_atlas-inspiration-externe-faisabilite.md` (faisabilité technique d3-geo). On a ~50 assets PixelLab existants (PIXELLAB-MASTER-INDEX).

---
Migré depuis auto-memory (`atlas-pixellab-differentiel.md`) le 2026-08-31, contenu original inchangé.
