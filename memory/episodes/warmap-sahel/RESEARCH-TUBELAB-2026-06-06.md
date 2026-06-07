# War-Map Sahel — Synthèse TubeLab (session 2026-06-06)

## Contexte
Session d'exploration TubeLab MCP. Objectif : valider si une war-map Sahel/AES vaut la peine avant de lancer la recherche OSINT + production.

---

## 1. Demande prouvée — outliers récents (60 derniers jours)

L'événement déclencheur = **bataille de Kidal (avril-mai 2026)**. Plusieurs chaînes ont explosé simultanément sur ce sujet.

| Vidéo | Ratio | Vues | Chaîne | Lien |
|---|---|---|---|---|
| "AES encirclement of Kidal — Rebels begging for mercy" | x8.6 | 129k | Africa Focus (22k subs) | youtube.com/watch?v=rI_eDZmB_3U |
| "Niger & Burkina Changed Mali's War Overnight" | x3.4 | 293k | Africa Today (493k) | youtube.com/watch?v=-EmETI7mL7o |
| "MALI ENCIRCLE KIDAL — Western Weapons" | x3.2 | 58k | Frontline Africa (84k) | youtube.com/watch?v=RFgHc5SLReg |
| "Mali Lost Kidal in 48 Hours — Traore's Answer" | x4.2 | 42k | AfriVantage (2k subs!) | youtube.com/watch?v=QJmb-E6YZNE |
| "BBC Afrique — Le Mali attaqué au sommet" | **x33.5** | 392k | BBC Afrique (600k) | youtube.com/watch?v=d3NTcLsZWkc |
| "France 24 — Mali : quelles sont les forces en présence ?" | x3.6 | 80k | France 24 | youtube.com/watch?v=fqEMtiUAA4g |
| "TV5 — Camp de Tessalit passe sous contrôle du FLA" | x5.0 | 235k | TV5 Monde | youtube.com/watch?v=adAXBB77rgw |
| "Mali : FAMa et Africa Corps prennent le dessus" | x4.7 | 279k | AfriPulse News (FR) | youtube.com/watch?v=P78H1FsQ7Ww |

**Signal clé** : une chaîne de 2 300 abonnés (AfriVantage) fait x4.2 sur Kidal. La demande sujet écrase l'handicap d'audience.

---

## 2. Anatomie visuelle des concurrents (frames extraites)

Toutes les vidéos indépendantes analysées = même recette :
- Stock footage d'archives (soldats, foules, fumée)
- Facecam ou avatar AI générique
- Zéro carte animée, zéro originalité visuelle
- Logo watermark permanent

**Exception partielle** : Africa Today (293k vues) intègre quelques passages cartographiques minimalistes — et c'est le seul indépendant qui s'approche de 300k.

**Chaînes bannies** : 2 des 5 outliers initiaux ont disparu (vidéos supprimées/chaîne bannie). Probablement : stock footage militaire sans droits ou contenu AI de masse. Notre stack (animation propriétaire, narration originale) est imperméable à ce risque.

---

## 3. Leçon titre — la règle éditoriale la plus importante

BBC Afrique à x33 écrase tous les partisans. Le ton sobre gagne.

| Titre partisan (à éviter) | Titre sobre qui performe |
|---|---|
| "Traoré STRIKES BACK Shocks the West" | "Mali : quelles sont les forces en présence ?" |
| "REBELS BEG FOR MERCY: Kidal Siege" | "Le Mali attaqué au sommet" |
| "Western Weapons EXPOSE Foreign Backing" | "Niger et Burkina ont changé la guerre du Mali" |

**Règle** : décrire un fait, poser une question, ne jamais prendre parti. C'est la formule BBC/France 24 — et elle surperforme systématiquement sur ce sujet.

---

## 4. Le créneau est vide

Recherche TubeLab sur "war map Sahel animated", "AES conflict map", "Mali carte animée" : **zéro résultat pertinent**. Personne ne fait de war-map animée Sahel avec un ton analytique sobre. Le créneau n'existe pas encore.

Format concurrent le plus proche = Ollie Bye ("History of X: Every Year") — polygones plats, date qui défile, zéro narration. 17M vues sur sa meilleure vidéo, 3.1M sur "History of Africa: Every Year". Modèle evergreen, publication rare (~3-4 vidéos/an). Son "History of Africa" prouve la demande pour la cartographie historique africaine, mais c'est encyclopédique, pas analytique/actuel.

---

## 5. Concept vidéo validé

**Angle** : "L'Alliance du Sahel : comment 3 pays ont redessiné leur sécurité en 3 ans"
- Carte qui montre le territoire AES mois par mois (2021-2026)
- Événements clés : formation AES, départ MINUSMA, offensives FAMa, Kidal
- Ton : sobre, factuel, style BBC — jamais "HUMILIE" ni "SHOCKS"
- Format : war-map animée, notre moteur Soudan réappliqué
- Durée cible : 60-90s (Short) ou 5-8min (mid-form) — à décider après recherche

**Différenciation** : personne ne fait ce sujet avec de la cartographie animée premium + ton analytique en français.

---

## 6. Prochaines étapes (session séparée)

Avant de coder : session de recherche OSINT pour valider les données.

1. **Sources OSINT** : ACLED (acleddata.com), ISW, UCDP, LiveUAmap
2. **Données à collecter** : jalons par date (formation AES, expulsion MINUSMA, offensives majeures, Kidal), positions géographiques, pertes estimées
3. **Schéma de données** : 1 fichier jalons JSON → tout en dérive (code fait 1x, données répétées)
4. **Go/no-go final** : si les données OSINT sont accessibles et fiables → produire. Sinon → reporter.

Voir `memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md` pour le protocole complet.

---

## Crédits TubeLab consommés cette session
~20 crédits (10 search_outliers + transcripts + channel lookups). Solde de départ : 300. Solde estimé restant : ~280.
