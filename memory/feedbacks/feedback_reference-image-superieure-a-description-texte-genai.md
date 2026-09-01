Pour tout prompt destiné à un modèle génératif d'image (storyboard Gemini, prompt Recraft/Seedance...),
une VRAIE image de référence (frame d'un rendu Remotion déjà validé) est bien plus fiable qu'une
description textuelle du style, même très détaillée avec contraintes explicites répétées.

**Pourquoi** : constaté 2× dans la même session (2026-07-07, Short War-Map Sahel, storyboard
"écu/blason héraldique") — 1re génération a dérivé vers du 3D/reflets spéculaires malgré la contrainte
"flat, pas de 3D" écrite noir sur blanc dans le prompt. 2e génération (contraintes renforcées + ancrage
géographique Sahel) était bien plate/2D cette fois, mais a dérivé vers des motifs héraldiques européens
génériques au lieu de motifs sahéliens — la description textuelle du "registre visuel du projet" ne
suffit pas à transmettre le langage visuel réel déjà établi dans les rendus validés. Les modèles
génératifs interprètent une description en la rapprochant de leurs patterns d'entraînement les plus
proches (héraldique européenne pour "blason médiéval", reflets 3D pour "objet en relief"), qui peuvent
diverger significativement de l'intention réelle même quand les mots semblent précis.

**Comment appliquer** : pour tout futur storyboard/prompt génératif d'image dans ce projet, joindre au
moins 1 frame de rendu Remotion déjà validé comme référence visuelle CONCRÈTE, en plus du prompt
textuel — pas seulement décrire le style en mots. Décidé pour la reprise du Short AES :
`memory/episodes/warmap-sahel/PLAN-SHORT-90S-V3-REPRISE.md` prévoit d'utiliser des frames Sénégal V3.

Complète (ne remplace pas) [[feedback_methode-storyboard-orchestration-guider]] et
`memory/doctrines/STORYBOARD-MAPBOX.md` (le modèle PROPOSE une direction créative qu'on valide avant
breakdown) — ce feedback précise QUEL matériau donner en entrée pour que la proposition soit fiable dès
le départ, réduisant le nombre d'itérations de dérive.

**3e confirmation (2026-07-15, Short Sénégal Pétrole & Gaz D3, Beat 2)** : un premier appel storyboard
Gemini, avec un prompt texte détaillé incluant l'interdiction explicite du style 3D/isométrique, a quand
même produit des panneaux en relief avec faces latérales visibles et ombres d'extrusion. Un second appel,
identique sur le fond mais avec une vraie frame de rendu déjà validé jointe en référence visuelle, a
produit un résultat fidèle au registre plat attendu, avec en plus une continuité de mise en scène (une
même carte qui évolue à travers les panneaux) que la première tentative n'avait pas non plus respectée
malgré une consigne texte équivalente. Confirme une 3e fois que la contrainte de style doit être montrée,
pas seulement décrite — y compris pour des consignes qui semblent sans ambiguïté à la lecture.
