# Globe D3 — vérifier la distance angulaire AVANT de promettre une occlusion réelle

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Le probleme** (2026-08-02, Gazoduc Acte 1, pivot AAGP/TSGP) : un DA-brief upstream (Gemini+Kimi+DeepSeek,
3/3 convergents) a promis l'occlusion reelle du globe D3 comme "moment fort" — un trace qui disparait
derriere l'horizon pendant que l'autre apparait, pour dramatiser la divergence Nigeria->Maroc (AAGP) vs
Nigeria->Algerie (TSGP). Code ecrit et rendu teste : l'effet ne se declenche JAMAIS, quel que soit le
cadrage camera essaye.

**Cause racine (verifiee par calcul, pas par intuition)** : Maroc et Algerie ne sont qu'a **10deg d'ecart
angulaire** l'un de l'autre vus depuis le centre de la Terre (formule loi des cosinus spherique). L'horizon
d'un globe orthographique coupe a 90deg du centre visible. Recherche exhaustive sur TOUTE la sphere (pas
d'intuition, boucle de calcul reelle, cf session) : le meilleur compromis possible pousse l'un des deux
points a 59deg max du centre — jamais les 90deg necessaires pour disparaitre derriere l'horizon — tant que
le 3e point (Nigeria, l'ancrage source commun) doit rester visible en meme temps. Impossible de choisir un
angle de camera qui satisfasse les 3 contraintes a la fois (source visible + destination A visible +
destination B cachee) sur ce trio de points precis.

**Distinction avec le cas OU l'occlusion marche vraiment** : sur Soudan Acte 5
([[feedback_globe-d3-moteur-cartographique-reutilisable]]), l'effet fonctionnait parce qu'une des sources
(Nouvelle-Zelande) etait a **174deg** de la cible (Khartoum) — un ecart enorme, largement au-dela de 90deg.
Le "sujet-cobaye" du proto R&D `Globe2Proto16x9.tsx` (routes Khartoum<-Emirats/Ankara/Nouvelle-Zelande)
avait ce meme grand ecart delibere — c'est CE cas qui a fait "la preuve" de l'occlusion et qui a ete cite
en reference dans le DA-brief, sans que personne ne verifie que le nouveau trio de points (Nigeria/
Maroc/Algerie, tous proches en Afrique du Nord-Ouest) partageait la meme geometrie favorable.

**Regle a appliquer desormais** : avant d'ecrire un brief upstream (ou de valider une proposition de
DA-brief) qui repose sur l'occlusion reelle comme mecanisme narratif entre 2+ points geographiques
precis, CALCULER la distance angulaire (loi des cosinus spherique, quelques lignes de code) entre CHAQUE
paire de points impliques (source<->cibleA, source<->cibleB, cibleA<->cibleB). Si un des ecarts pertinents
est sous ~60-70deg (marge de securite avant la limite dure de 90deg, sachant qu'on veut aussi garder une
marge de cadrage), l'occlusion ne pourra PAS etre le mecanisme porteur — le signaler AVANT de coder, pas
apres un rendu de test. Alternative de repli qui marche toujours : contraste de STYLE (plein vs pointille,
vitesse de flux differente) + mouvement camera marque, sans compter sur la disparition/reapparition
physique du trace.

**Cout de la lecon** : ~30 min de calcul + code + rendu de test avant de detecter le probleme — le DA-brief
lui-meme (3 modeles convergents) n'a pas su le voir, parce qu'aucun des 3 ne fait de calcul geometrique
reel, ils extrapolent depuis un exemple different (Soudan) sans verifier que la geometrie du nouveau cas
est comparable. Confirme [[feedback_verifier-son-propre-souvenir-comme-un-verdict-llm]] etendu aux
promesses geometriques d'un DA-brief : verifier par calcul, pas par analogie visuelle.
