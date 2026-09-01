Avant de juger le rythme/la cohérence d'un rendu visuel narratif (clip vidéo, storyboard, scène),
confronter EXPLICITEMENT qui-est-qui dans l'image au script/à l'intention narrative d'origine —
pas seulement décrire ce qui bouge à l'écran.

**Why:** Session 2026-08-08, test MiniMax H3 (clip 15s multi-strates, arc Sonjata). L'agent chargé
de l'auto-review a confondu la matrone/marâtre (qui insulte Sundiata) avec la mère réelle du
personnage (qui se trouve en fait à droite, avec deux jeunes enfants) — une erreur d'identification
factuelle, pas un défaut de lecture technique. Conséquence directe : il a lu "compression puis gel"
sur un mouvement qui était en réalité une chorégraphie enchaînée cohérente (la matrone baisse le
doigt avec un sourire mauvais, la mère réagit en fin de séquence, les ombres portées suivent le
mouvement des personnages en temps réel) — un vrai point fort du rendu, retourné en verdict
"progrès partiel" à tort. Aziz a corrigé le diagnostic après coup ; le clip était en fait concluant.
Distinct de 3 cas voisins déjà documentés : ce n'est pas de l'auto-critique sur son propre travail
([[autocritique-agent-signal-pas-verdict]]), pas un souvenir dégradé par saturation de contexte
([[verifier-son-propre-souvenir-comme-un-verdict-llm]]), et pas un rapport de travail incomplet
([[rapport-agent-texte-pas-preuve-verifier-disque]]) — le travail était fait et le fichier bien
inspecté ; le problème est une mauvaise identification factuelle en amont du jugement esthétique,
sur un contenu narratif neuf jamais vu par l'agent.

**How to apply:** Avant qu'un agent produise un verdict sur un rendu narratif (clip, storyboard,
scène) : (1) établir qui-est-qui dans l'image en confrontant explicitement au script/à la légende
narrative d'origine, pas en devinant depuis la seule composition visuelle ; (2) seulement ensuite
juger le rythme, la cohérence ou la qualité. Vaut en particulier pour un contenu où plusieurs
personnages secondaires ont des rôles proches visuellement (âge, posture, position dans le cadre)
mais des fonctions narratives opposées (ex: figure hostile vs figure protectrice). Un échantillonnage
de frames trop espacé aggrave le risque (mouvement réel manqué entre deux frames lues).
