Un agent de recherche (WebSearch/WebFetch) peut affirmer un fait technique précis avec des sources
citées qui semblent solides, alors que le fait est en réalité faux ou confond deux choses proches
(deux modèles IA différents, deux versions d'un même outil). Le simple fait qu'un rapport cite des
URLs ne garantit pas l'exactitude de la synthèse qu'il en tire.

**Pourquoi** : sur la session 2026-08-14 (canada-red-bay, MiniMax H3), un premier rapport d'agent de
recherche a affirmé que "MiniMax H3 permet l'édition ciblée d'un clip vidéo déjà généré, sans tout
regénérer" — répété tel quel à Aziz sans vérification. Aziz a demandé "es-tu sûr ? ne faut-il pas
regénérer le clip au complet ?" — bonne question qui a forcé une vérification directe (lecture du
catalogue Comfy Cloud, `get_node`/`search_templates`). Résultat : la capacité existe bien, mais sur
un **autre modèle** (Seedance 2.5), pas MiniMax H3 — le premier rapport avait confondu les deux dans
sa synthèse. Sans la question d'Aziz, cette fausse affirmation serait restée en mémoire du projet.

**Comment appliquer** : avant de répéter à l'utilisateur un fait technique précis (capacité d'un
outil, existence d'une fonctionnalité, comportement documenté d'une API) qui vient d'un rapport de
sous-agent de recherche — surtout si ce fait va influencer une décision (choix d'outil, action
suivante) — soit (a) vérifier directement dans une source primaire (doc officielle, catalogue
d'outils réel, test direct), soit (b) le signaler explicitement comme "à vérifier" plutôt que comme
acquis. Ne pas se contenter de la présence d'URLs citées dans le rapport comme preuve de justesse —
un agent de recherche peut halluciner une synthèse correcte en apparence à partir de sources réelles
mal recoupées. Rejoint la doctrine CLAUDE.md déjà écrite (§ "verdict d'un agent/Gemini → VÉRIFIER
dans le code réel avant de le présenter comme un fait"), étendue ici explicitement aux agents de
recherche web, pas seulement aux agents de review de code/visuel.
