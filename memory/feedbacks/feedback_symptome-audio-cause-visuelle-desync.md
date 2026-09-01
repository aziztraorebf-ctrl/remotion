Sur le Soudan mid-form (raccord ~9:48, dernier retour avant promotion), Aziz demandait « 1,5 s de
respiration, la coupure est trop seche ». Symptome formule en termes AUDIO.

**Mesure (`silencedetect -38dB`) : la respiration de 1,5 s EXISTAIT DEJA** — la phrase finit a 98,051 s
et la suivante reprend a 99,557 s. L'audio etait intact.

Le defaut etait **VISUEL** : les keyframes de bascule de scene (`b4End`/`b5Start`) tombaient **27 frames
APRES** la reprise de la voix. La scene suivante demarrait donc en pleine phrase — ce qui s'entend comme
une coupure seche alors que rien n'est coupe. Fix : recaler la bascule DANS le silence existant
(3014 → 2964), sans toucher un octet d'audio.

**Why** : l'oreille ne separe pas ce qu'elle entend de ce qu'elle voit. Une image qui change au mauvais
moment produit exactement la sensation d'un son mal coupe. Partir corriger l'audio (regenerer, inserer
un silence) aurait ete plus cher ET n'aurait rien resolu — le silence etait deja la.

**How to apply** :
1. Symptome audio signale (« ca coupe », « pas assez de respiration », « transition brutale ») →
   **MESURER d'abord** : `ffmpeg -hide_banner -nostats -i <audio> -af "silencedetect=noise=-38dB:d=0.5" -f null /dev/null 2>&1 | grep silence`
   (⚠️ sans `-v error`, sinon la sortie du filtre est masquee).
2. **Si le silence existe deja** → chercher une DESYNCHRONISATION visuelle : quelle keyframe/bascule/cut
   tombe par rapport a ce silence ? Comparer en frames, pas a l'oreille.
3. **Si le silence n'existe pas** → alors seulement traiter l'audio (cf `AUDIO-PAUSES-DETERMINISTES.md`).

Corollaire : un changement de timing audio en amont (recuperer un mot mange, allonger une fin) DECALE
tout ce qui suit et peut CREER cette desynchronisation ailleurs. Ici, avoir recupere le mot « Dans »
(+4 frames) a accentue un decalage preexistant sur le raccord suivant. Apres toute correction de timing
audio, re-verifier les bascules de scene en aval.

Distinct de [[feedback_biais-chercher-la-cause-dans-le-fond]] (FORME vs FOND, deux causes visuelles) :
ici c'est AUDIO percu vs VISUEL reel. Methode de mesure : [[AUDIO-PAUSES-DETERMINISTES]].
