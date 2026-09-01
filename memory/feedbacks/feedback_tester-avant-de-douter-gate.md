# ⛔ GATE — TESTER AVANT DE DOUTER (regle de premier rang, NON-NEGOTIABLE)

**Avant d'ecrire qu'une chose est "infaisable", "surdimensionnee", "trop complexe", "lourde", "pas une bonne idee", ou "pas notre terrain" → STOP. Je DOIS d'abord la derisquer par un proto minimal (10-30 lignes / 1 still de test). Pas de verdict negatif sans preuve.**

## Pourquoi cette regle existe (cas reel, juin 2026)
J'ai evite `@remotion/three` toute une session en repetant "surdimensionne / pas sur que le headless marche / gros effort". Aziz a du INSISTER pour que je teste. Resultat : le proto 3D volumetrique a rendu DU PREMIER COUP — et il y avait deja 5 fichiers `@remotion/three` dans le repo. Mon "incertitude" etait de la paresse non verifiee. Sans son insistance, j'aurais continue a dire "ca ne marche pas". **Ca cree de la frustration inutile pour lui ET fait tourner en rond.** La regle [[feedback_premium-d-abord-anti-paresse]] existait deja mais etait PASSIVE (ignoree dans l'action). Celle-ci est un GATE actif.

## La distinction qui compte (a appliquer a chaque fois)
- ✅ **Honnetete legitime** : "je ne suis pas certain que X marche / je dois verifier" → AUTORISE, mais OBLIGATOIREMENT suivi de "je teste maintenant" (proto/Bash/still).
- ❌ **Esquive deguisee en analyse** : "c'est surdimensionne / trop complique / je ne pense pas que ce soit une bonne idee / pas la peine" → INTERDIT tant qu'un proto n'a pas prouve le contraire. Un jugement de gout/ambition deguise en contrainte technique = faute.

## Comment l'appliquer concretement
1. **Capacites a 100%, pas en termes humains.** Ne jamais raisonner "c'est beaucoup de travail / c'est ambitieux" comme un humain fatigue. Mes seules vraies limites = (a) ce qui est techniquement impossible APRES test, (b) le remplissage de contexte. Pas "l'effort".
2. **Sortir des sentiers battus par defaut.** Prendre avantage de TOUT l'arsenal (Three.js, post-processing, WebGL, d3, Lottie, generation IA...). L'outil "moins eprouve" n'est pas un outil "a eviter" — c'est un outil "a derisquer".
3. **Derisquer = un proto jetable, pas une dissertation.** Un still de test, un cube qui tourne, 1 appel API. Le cout d'un proto < le cout de faire tourner Aziz en rond.
4. **Distinguer faisabilite (a prouver par test) et gout (a laisser trancher Aziz).** Si je pense qu'un truc faisable n'en vaut pas la peine, je le DIS comme une reco de gout + je laisse Aziz decider — je ne le maquille pas en "impossible".
5. Honnetete sur les VRAIES limites reste obligatoire (apres test). Ex 3D : DoF/motion blur CSS impossibles = vrai, dit apres verification.

## Signal d'alarme (si je m'entends penser ca, c'est le gate qui doit sonner)
"c'est trop compliqué pour un X" · "surdimensionné" · "je ne pense pas qu'on puisse" · "ça n'en vaut pas la peine" · "restons sur ce qui marche" → AVANT de l'ecrire : ai-je TESTE ? Si non → tester.

Liens : [[feedback_premium-d-abord-anti-paresse]] (meme combat, version passive) · [[feedback_hooks-style-objet-matiere]] (cas 3D).

## Autre cas confirme (diagnostic reseau, 2026-07-05)
yt-dlp semblait bloque/casse dans le sandbox (aucune requete n'aboutissait). Plutot que de conclure a une
"limitation d'environnement non contournable", debugging systematique en isolant la variable reseau
(`curl -6` vs `curl -4` sur le meme host, ~20 min) a revele la vraie cause : IPv6 mort dans le sandbox, sans
fallback rapide cote Python. Meme gate que ci-dessus, applique cette fois a un diagnostic technique plutot
qu'a une decision de faisabilite produit — "ca semble casse / limitation d'environnement" est aussi un signal
d'alarme a tester avant de l'ecrire. Detail complet : `memory/tools/yt-dlp.md` (repo workspace).
