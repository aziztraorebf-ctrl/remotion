# Upwork — "SVG Motion Designer Needed to Animate a Custom Spark Icon"

## Job
Client Calgary (Canada), 2 contrats fermés sur Upwork (5/5 les deux fois, $85 dépensé total,
dernier contrat 2020 — historique mince mais propre). Job HOURLY, EXPERT, budget non affiché.
URL : https://www.upwork.com/jobs/~022094280908049507428
Posté 2026-08-31, moins de 24h au moment du premier scan, 6 invitations envoyées par le client,
0 hire/interview à ce moment-là.

Brief : animer un icône Spark existant (bottom nav d'une app d'écriture mobile) en indicateur
"thinking/processing" — rayons individuels qui s'étendent/rétractent de façon organique et
asymétrique, rotation irrégulière du groupe, PAS un spinner générique, PAS de glow/particules/
core central. Livrable : fichier source éditable + export web-compatible (React app) + contrôle
start/stop/loop/settle programmatique. Ouvert à Rive, SVG+GSAP, ou autre (demande une
recommandation argumentée).

**Doc client fourni** : planche "DRAFT GARDEN — SPARK ANIMATION (BIRTH)", séquence en 8 étapes
(~0.80s total) : rien de visible → quelques rayons courts → expansion asymétrique + rotation →
build (extend/retract mixte) → burst complet → léger rééquilibrage → stabilisé mais vivant →
respiration finale continue.

## ⛔ Contrat HOURLY = incompatible avec notre méthode (à traiter AVANT d'envoyer l'offre)
Upwork exige le "Time Tracker" sur les contrats hourly : capture d'écran aléatoire toutes les
10 min + niveau d'activité clavier/souris, le tout consulté par le client chaque semaine avant
paiement (Work Diary). Notre pipeline repose sur des agents qui tournent en fond — incompatible
avec l'attente implicite d'un effort humain continu visible à l'écran.
**Décision** : proposer dans la candidature de passer en FIXED-PRICE avec milestones (comme
Abigail/chill-meter). Si le client refuse, ne pas insister — ce type de contrat ne correspond
pas à notre façon de travailler.

## Ce qui a été FAIT et VALIDÉ ce soir (2026-08-31)

1. **Vectorisation SVG mesurée au pixel** — `out/_r-and-d/spark-upwork/spark-source.svg` (v5/v2
   "géométrie mesurée"). Un premier essai Opus SANS le vrai PNG (v1) était à côté (trop groupé,
   halo inventé). Le vrai `Spark.png` client analysé au pixel (alpha→composantes connexes→
   mesure angle/longueur/largeur/profil par rayon) → 15 rayons + 11 gouttes, écarts mesurés
   ≤1u/400 sur toutes les dimensions. **Validé à l'œil par Aziz** ("littéralement son logo").
   Rig : `spark-root` (pivot centré 200,200) > `ray-N` (transform statique) > `ray-N-scale`
   (handle scaleY à animer) > `ray-N-body`/`ray-N-grain`. Détail complet dans
   `out/_r-and-d/spark-upwork/NOTES.md`.
2. **Contrôle SVG+GSAP réel prouvé** — testé en HTML/GSAP direct dans un navigateur (pas
   Remotion) : `start()`/`stop()`/`loop()`/`settle()` fonctionnent réellement (vérifié via
   Playwright + capture d'écran, PAS juste "ça compile"). Bug trouvé et corrigé en cours de
   route : un `repeat:-1` imbriqué DANS des tweens à l'intérieur d'une timeline elle-même en
   `repeat(-1)` fait exploser le `totalDuration` calculé par GSAP (observé : 1e10s), gelant
   visuellement toute progression. Fix : les boucles infinies (respiration, wobble) vivent
   HORS de la timeline principale, comme tweens "ambiants" séparés, jamais imbriqués.
3. **Artifact publié et fonctionnel** (après un premier essai raté à cause de balises html/head/
   body en double dans le contenu — l'artifact fournit déjà son propre skeleton) :
   https://claude.ai/code/artifact/1babce8b-724d-4881-9a0e-068854d9b192

## ✅ Bug Remotion RÉSOLU (2026-08-31/09-01)

Cause racine trouvée par un agent Opus dédié (protocole diagnostic-2-échecs) : `scale(1 ${s})`
(espace, sans virgule) est la syntaxe **XML SVG**, pas CSS — invalide en `style.transform`, donc
rejetée **silencieusement** par le CSSOM (aucune exception, `style` reste `null`). Fix : un mot,
`scaleY(${s})` au lieu de `scale(1 ${s})` dans `SparkAnimationPrototype.tsx`. Détail générique
réutilisable (gotcha à re-vérifier sur toute future mutation DOM manuelle de SVG) :
`memory/tools/remotion.md` § "syntaxe CSS ≠ syntaxe XML SVG".

Effet collatéral découvert en vérifiant : l'ancien rendu (avant fix) montrait déjà une animation
qui semblait "vivante" (rotation + gouttes visibles) — mais c'était le SYMPTÔME du bug, pas une
preuve que ça marchait : sans transform valide sur les rayons, ils restaient figés à leur taille
native du path dès la frame 0, au lieu de partir de zéro. Rendu corrigé vérifié par extraction de
frames (0/20/40/60/74) : vraie naissance progressive, fidèle au doc client "BIRTH".

## ✅ Candidature ENVOYÉE (2026-09-01)

Lettre finale (voir contenu dans l'historique de session ou le draft Upwork) : recommandation
SVG+GSAP vs Rive argumentée, clip attaché comme proof of concept (pas de lien — pièce jointe
directe, jamais de lien dans une lettre Upwork), 3 observations sur le brief (tension rotation
vs "pas un spinner", lisibilité à petite taille nav bar, ambiguïté birth vs loop continue),
structure 3 milestones nommée explicitement (direction+clarification / animation complète /
intégration), refus hourly assumé sans porte de sortie fictive (pas de "if hourly is required
that's fine too" — on ne ferait pas hourly de toute façon, l'avoir écrit aurait été malhonnête).
Boost à 4 connects (dépassait le 2e à 3) — le "suggested bid: 33" affiché par Upwork ignoré,
incohérent avec le tableau des enchères réelles affichées juste au-dessus (probable pression
commerciale de la plateforme, pas un signal fiable).

PS ajouté après coup (dans la fenêtre d'édition manuelle 6h) : précaution vidéo non visible côté
client, déjà vécue avec Abigail/chill-meter.

⛔ **Upload de pièce jointe via MCP `confirm_attachment_upload` a échoué 2x (erreur upstream)**
malgré `start_attachment_upload`/`get_upload_status` réussis — Aziz a dû attacher le fichier
manuellement depuis l'interface Upwork. Cohérent avec le bug déjà documenté dans
`memory/tools/upwork-mcp.md` (pièces jointes silencieusement non fiables malgré signaux de
succès) — toujours vérifier/attacher manuellement en secours, ne pas faire confiance au MCP seul
pour cette étape.

## Prochaine étape (si le client répond)

Pas encore de retour client au moment de la clôture de cette session. Si réponse : reprendre sur
les 3 points ouverts posés dans la lettre (taille réelle d'affichage px, birth=loop ou séparés,
dosage rotation) avant de coder la version finale — ne pas re-deviner, les questions ont été
posées explicitement au client.

## Fichiers clés
- `out/_r-and-d/spark-upwork/spark-source.svg` — SVG final validé (v5/v2 mesuré)
- `out/_r-and-d/spark-upwork/NOTES.md` — détail technique du rig + mesures + écarts assumés
- `out/_r-and-d/spark-upwork/reference/Spark.png` — PNG client réel
- `public/spark-upwork/spark-source.svg` — copie statique pour Remotion (staticFile)
- `src/projects/_rnd/spark-upwork/SparkAnimationPrototype.tsx` — composant Remotion FONCTIONNEL (fix scaleY appliqué)
- `out/_r-and-d/spark-upwork/spark-birth-prototype-svg-gsap.mp4` — clip final envoyé en pièce jointe candidature
- Artifact web fonctionnel (SVG+GSAP réel, contrôle start/stop/loop/settle) : https://claude.ai/code/artifact/1babce8b-724d-4881-9a0e-068854d9b192
