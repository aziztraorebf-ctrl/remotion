Pour tout jugement sensoriel fin qu'un agent ne peut pas vérifier directement (audio inaudible/artefact,
nuance visuelle subtile), solliciter Aziz tôt pour écouter/voir plutôt que de continuer à creuser
techniquement à l'aveugle via des heuristiques indirectes (hash de fichier, spectrogramme, forme d'onde,
analyse de volume). Ces heuristiques ne remplacent jamais une vraie écoute/vision humaine.

**Why:** Session 2026-07-04 (War-Map Sahel) — un SFX ajouté restait inaudible au render. J'ai multiplié
les vérifications indirectes (comparaison de hash MD5, test à volume 2.0 vs 0.32, spectrogramme) sans
jamais pouvoir trancher, alors qu'Aziz pouvait écouter le résultat en quelques secondes. Citation : "au
lieu de tourner en rond et de gâter des tokens... c'est à moi de le valider." Ceci élargit la doctrine
déjà connue [[feedback_neutralite-analyste-pas-cheerleader]] ("Gemini = signal jamais juge") : le principe
s'applique aussi au jugement sensoriel de l'agent lui-même, pas seulement à celui d'un LLM tiers — un
agent ne peut littéralement pas entendre, donc s'auto-persuader via des proxys techniques est une perte
de temps et de tokens.

**How to apply:** Dès qu'un doute porte sur du sensoriel (audio, image fine) et pas sur du mesurable/du
code : après 1-2 vérifications rapides (le fichier existe, le code semble correct), proposer un mini-render
ou extrait à Aziz plutôt que de multiplier les analyses indirectes. Ne pas attendre d'avoir "la certitude"
via des heuristiques avant de solliciter — la sollicitation EST la méthode la plus rapide et la plus fiable.

**Confirmé à nouveau** (Sénégal V3 ROUND 2, 2026-07-05) : après 2 tentatives de diagnostic technique
(silencedetect, spectrogrammes, comparaison RMS) qui ne trouvaient AUCUNE anomalie mesurable sur une
coupure audio pourtant perçue par Aziz, l'envoi d'un extrait ciblé à ré-écouter a tranché immédiatement
là où les heuristiques tournaient en rond — seuil pratique confirmé : 2 tentatives techniques infructueuses
= signal pour arrêter de deviner et solliciter.

**Élargi à la phase R&D exploratoire** (Soudan inserts tactiques, même journée 2026-07-05) : la préférence de
juger un rendu réel plutôt qu'une explication théorique s'applique AUSSI à un prototype de recherche, pas
seulement à un livrable en cours de finition. Aziz a demandé plusieurs fois "montre-moi le résultat en
premier" avant de commenter une approche technique, et explicitement "je préférais juger sur le mouvement,
donc la vraie vidéo en tant que telle" à propos d'un simple prototype d'exploration (pas un beat final). Ne
pas réserver le réflexe "rendre et montrer avant de conclure" aux seules étapes de validation finale — l'
appliquer dès qu'une décision de direction (SVG vs image, mono vs multi-agent, style A vs style B) doit être
prise, même en R&D précoce.
