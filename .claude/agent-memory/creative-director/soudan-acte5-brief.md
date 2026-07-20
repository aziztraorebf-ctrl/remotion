---
name: soudan-acte5-brief
description: Direction Brief Acte 5 Soudan (réseau EAU-Libye-Darfour, 5 beats) — verdict 0 sortie de carte, piège trait-corridor Beat3→4 à prolonger pas retracer
metadata:
  type: project
---

Acte 5 du mid-form Soudan (script v6, 5 beats verrouillé côté texte, 2026-07-17) : chaîne "financement
EAU → relais Libye/Haftar → guerre Darfour/El-Fasher". Exercice de mise en scène amont demandé par Aziz
avec angle explicite "chercher activement la rupture hors-carte pour chaque beat" (contre le réflexe
carte-par-défaut), en miroir du précédent Port-Soudan (Acte 4, sorti en insert SVG plein écran).

**Verdict rendu** : 0 sortie de carte sur 5 beats — tous restent Mapbox continue. Voir détail complet dans
`.claude/agent-memory/shared/PIPELINE.md` § [STAGE-1] Acte 5 (2026-07-17).

**Why (ce qui distingue ce cas de Port-Soudan)** : Port-Soudan Acte 4 était un fait 100% incarné (huis clos
négociation) SANS ancrage géo porteur au moment où il survenait — rien à montrer sur la carte, d'où insert
SVG. L'Acte 5 est une "enquête cartographique" : même les beats documentaires (enquête presse EAU, rapport
ONU) arrivent CHAQUE FOIS avec un point géo concret et neuf à révéler (Abou Dabi, Kufra, Benghazi,
El-Fasher). La rupture n'est justifiée que quand le fait n'a RIEN à montrer sur la carte — ce n'est jamais
le cas ici.

**How to apply** : pour tout futur acte de ce projet (ou tout autre mid-form War-Map) à mise en scène
amont, tester chaque beat contre cette question précise : "au moment où ce fait survient, y a-t-il un point
géo NEUF et non encore consommé à révéler ?" Si oui → carte, même si le fait est documentaire/institutionnel.
Si non (fait huis clos, portrait, négociation sans lieu nouveau) → candidat sérieux à insert SVG.

**Point technique à ne pas perdre au breakdown/code** : le corridor Kufra→sud (Beat 3) et sa continuation
jusqu'à El-Fasher (Beat 4) doivent être modélisés comme UNE seule variable de trajectoire qui s'allonge en
deux temps — pas deux tracés indépendants. Retracer un second trait au Beat 4 casserait le sens "chaîne qui
se boucle" que le script porte explicitement ("on la retrouve à El-Fasher", "Résumons"). Lié au principe de
continuité de [[CONTINUITE-SCENE-INTENTION-DABORD]] (le monde se prolonge, ne se remplace pas) — nouvelle
instance concrète de ce principe en registre Mapbox (jusqu'ici surtout prouvé en Remotion/SVG).

**Registre documentaire transversal** : Beats 2 (presse Lighthouse/Der Spiegel), 3 (ONU avril 2026) et 5
(rappel ONU) doivent utiliser le MÊME traitement visuel discret (médaillon/tampon en surimpression légère,
jamais plein écran) — à coder comme un seul composant réutilisé 3x, pas 3 idées séparées.

Voir aussi [[soudan-acte4-beat4-nil-brief]] (précédent brief du même projet, même méthode, cas Nil/Égypte).
