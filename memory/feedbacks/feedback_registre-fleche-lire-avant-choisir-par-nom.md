# Lire l'usage fléché dans le registre AVANT de choisir un asset par ressemblance de nom

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Cas vécu (2026-08-15, Gazoduc Acte 4)** : pour illustrer « le Nigeria ne peut PAS remplir les deux
gazoducs », j'ai pris le clip `conduite-gaz-r2v-v1.mp4` — une conduite **pleine** de gaz bouillonnant.
Contresens narratif direct : montrer l'abondance pour dire la pénurie. L'asset correct existait déjà,
`conduite-vide-r2v-v1.mp4`, et le registre `INTENTION-FORME-INDEX.md` le fléchait explicitement :
« ⭐ Acte 4 Gazoduc — les 70% siphonnés ». J'avais choisi sur le nom de fichier (« conduite » + contexte
gazoduc = ça sonne juste) sans relire la ligne qui désignait déjà l'usage exact.

**Why** : quand deux assets partagent délibérément la même image source — bonne pratique de continuité
visuelle, même objet, seule l'animation change — leurs noms se ressemblent **par construction**
(`conduite-gaz` / `conduite-vide`). Plus les variantes sont cohérentes entre elles, plus la tentation de
trancher au nom plutôt qu'à la lecture est forte, et plus l'erreur est indétectable : les deux noms sont
plausibles pour le même beat. La qualité du pipeline d'assets *augmente* donc ce risque au lieu de le
réduire.

⚠️ Signal d'alerte spécifique : les familles d'assets en **états opposés d'un même mécanisme**
(plein/vide, avant/après, ouvert/fermé, allumé/éteint). C'est exactement là que le nom ne suffit pas à
trancher, et exactement là que se joue le sens.

**How to apply** : avant de choisir un asset dans un registre qui porte des notes d'usage (⭐, « sert
à », « validé pour »), lire la **ligne complète du registre pour cet asset** — pas seulement le nom de
fichier ni la vignette. Un usage fléché prime toujours sur une déduction par ressemblance de nom. Et
vérifier que l'état montré par l'asset correspond à ce que le texte narré affirme, pas seulement à son
sujet : ici le sujet (une conduite de gaz) était bon, c'est l'état qui disait l'inverse du script.

Voisins : [[feedback_reutiliser-assets-approuves]] (reprendre du matériau validé) ·
[[feedback_registre-visuel-briques-existantes-non-consultees-avant-code]] (consulter le registre AVANT
de coder — ici le registre était consulté, mais mal lu).
