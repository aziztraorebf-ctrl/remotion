# Un livrable « uploadé » n'est pas archivé — garder le MP4 local avant tout upload

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Un livrable dont la note de clôture dit « uploadé » peut n'exister **nulle part en local**. Vécu
2026-08-16 : MochIt (test client-sim clos le 2026-08-09) était noté « livrable final uploadé (Vercel
Blob) » — aucun MP4 sur disque, aucun dans git, aucune trace de suppression. Aziz avait la vidéo
finale sur son téléphone ; le repo, lui, n'avait plus rien. Il a fallu re-rendre pour analyser.

**Why:** un upload est un lien de PARTAGE, pas une archive — l'hôte peut expirer (Litterbox 72h),
le lien se perdre, et le fichier n'est plus rattaché au code qui l'a produit. La règle de
communication mobile (« uploader AVANT de présenter, jamais un chemin local ») porte sur ce qu'on
MONTRE à Aziz ; elle ne dit rien sur ce qu'on CONSERVE, et se lisait à tort comme « uploader
dispense de garder ».

**How to apply:** rendre → **garder dans `out/<projet>/FINAL/`** → PUIS uploader pour présenter. À
la clôture d'un chantier, vérifier `ls` sur le FINAL annoncé avant d'écrire « livrable final » dans
une note — le même réflexe que [[feedback_rapport-agent-texte-pas-preuve-verifier-disque]], appliqué
à sa propre note de wrap. Si une note dit « uploadé » sans chemin local, traiter le livrable comme
**perdu jusqu'à preuve du contraire** et re-rendre depuis la composition.

Corollaire de lecture : pour juger un render, un échantillonnage trop lâche fabrique de faux
défauts — 2 « trous » de MochIt étaient des transitions attrapées au mauvais instant, révélées en
densifiant à 4 img/s. Cf [[feedback_frame-espacee-sous-estime-mouvement]].
