Root.tsx peut enregistrer plusieurs compositions quasi-identiques visuellement pour un même acte/beat
(ex. `SahelActe1-Final` vs `SahelActe1-Refonte`, guerre AES). Un nom plausible ("Final") ne garantit pas
que c'est la bonne version. Observé 2 fois sur des projets différents : Soudan Actes 3/4 (Mapbox périmé
vs Globe D3 actif, les deux importés dans Root.tsx) et Sahel Acte1 (2026-08-06, session retiming AES V6).

**Cas Sahel (2026-08-06)** : `SahelActe1-Final` a été utilisée pour tous les tests visuels d'une session
de retiming, alors que `SahelActe1-Refonte` est la vraie composition qui a produit
`out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4` (vérifié pixel par pixel, MD5 du fichier confirmé). La
différence visuelle entre les deux était quasi invisible — un seul indice : un vieux carton titre orphelin
("Sahel / Tout a changé en trois ans / 2020—2026", code présent depuis le tout premier commit du moteur,
7 juin, jamais retiré) qui ne s'affiche qu'en mode `acte1Final`, masqué en mode `acte1Refonte`
(`{!isPartie && !acte1Refonte && (...)}`). Tout le reste (jetons, palette, contours) est identique dans
les deux modes.

**Conséquence concrète** : la mauvaise composition a masqué une vraie régression pendant toute une
session — un `interpolate()` cassé par le retiming (`inputRange non monotone`) était sur une branche de
code que seule la bonne composition (`acte1Refonte`) emprunte. Elle n'a été découverte qu'après qu'Aziz a
interrompu la session en signalant que les frames présentées ne correspondaient pas à son souvenir de la
vidéo publiée.

**Règle dérivée** : avant de juger visuellement un rendu de test sur un acte/beat qui a déjà une version
publiée, identifier explicitement QUELLE composition Root.tsx correspond au livrable réel — grep les props
qui changent le comportement (pas juste le nom de la composition), ou comparer pixel par pixel contre le
fichier `out/PRET-PUBLICATION/` réel (MD5 vérifié) avant de faire confiance à son propre render.

**Corollaire agents parallèles** : quand plusieurs agents retiment des fichiers frères sur la base d'un
paramètre numérique fourni par l'orchestrateur (ex. un offset audio), un agent qui reverifie
arithmétiquement cette valeur plutôt que de l'appliquer aveuglément peut détecter une erreur de
l'orchestrateur. Cas concret : offset audio +3196 donné par erreur par l'orchestrateur à 3 agents
(Partie2/3/4) — un agent a vérifié la durée exacte du fichier audio par calcul (96.502132s×30fps=2895.06f)
et détecté l'écart (+2895 correct), permettant la correction propagée aux 2 autres fichiers. À encourager
explicitement dans les briefs d'agents parallèles sur des tâches paramétriques.

**Preuve de valeur de la règle "vérifier CODE + VISUEL avant d'agir sur un livrable passé"** (déjà dans
CLAUDE.md) : Aziz a interrompu explicitement la session ("je pense qu'il va falloir qu'on s'arrête") en
signalant l'incohérence plutôt que d'accepter une explication verbale — a permis de découvrir à la fois la
confusion de composition ET la régression cachée en une seule vérification factuelle (page HTML avec
frames du vrai fichier, hébergée via here.now car Aziz était sur mobile).
