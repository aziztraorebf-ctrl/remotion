# Consulter une IA externe pour des idees → Claude FILTRE par le projet reel

**Quoi** : Aziz consulte parfois une IA externe (Gemini, GPT…) pour obtenir des IDEES de visualisation/direction,
puis les montre a Claude. Pattern de travail valide le 2026-06-21 (session SVG : Gemini a propose 3 idees de viz pour
la War-Map Sahel AES).

**Why** : l'IA externe ne connait NI notre stack (Mapbox frame-driven, overlays War-Map, briques existantes), NI ce
qui est DEJA FAIT/tranche dans le projet. Elle propose donc souvent des choses justes en apparence mais : (a) deja
realisees autrement (ex : Gemini a propose un "tableau de bord CFA" alors que le chantier CFA est deja FINAL en
War-Map), (b) avec le mauvais OUTIL (ex : refaire de la carto en SVG alors que c'est du Mapbox chez nous = regression),
(c) sans savoir OU ca s'insere dans le recit. C'est le classique "l'agent/IA hallucine un probleme deja resolu" —
relie a la regle CLAUDE.md "verdict d'un agent/Gemini = VERIFIER dans le code reel avant de le presenter comme un fait".

**How to apply** :
1. Accueillir les idees externes comme MATIERE A TRANCHER, jamais comme verite a executer.
2. Passer chaque idee au DOUBLE FILTRE : (1) est-ce JUSTE pour le projet reel (pas deja fait, bon angle) ? (2) est-ce
   le BON OUTIL (vs Mapbox/War-Map/data-viz qu'on maitrise deja mieux pour ce besoin) ?
3. Trancher honnetement devant Aziz : garder ce qui apporte de l'unique, ecarter le reste EN EXPLIQUANT pourquoi
   (l'externe ne sait pas X). Ne jamais executer une idee externe juste parce qu'elle "sonne bien".
4. Souvent l'idee est BONNE mais MAL PLACEE : Claude (qui connait le script) sait OU elle va. Ex prouve : l'idee
   "Liptako-Gourma en blueprint tactique" de Gemini etait juste, mais c'est en lisant le VRAI script qu'on a su que
   son bon moment = la clause de defense mutuelle P3 (naissance de l'AES), pas un detail.

Relie a [[methode-test-reproductibilite-agent-vierge]] (meme principe : verifier le travail d'un agent dans le reel)
et a la doctrine [[SVG-SCENES-GENERATIVES]] (l'analyse des 3 moments concept-vs-carte du script AES).
