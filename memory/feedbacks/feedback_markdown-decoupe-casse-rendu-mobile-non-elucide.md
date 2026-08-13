# Découper un gros .md pour "faciliter" l'affichage mobile — gotcha non élucidé

**Symptôme vécu (2026-08-13)** : un fichier markdown volumineux (~70Ko, jury créatif 4 modèles LLM)
ne se rendait PAS en markdown sur mobile une fois découpé en 4 fichiers séparés (reconstruits par
script Python, un par modèle) — mais se rendait correctement quand renvoyé tel quel, en un seul
fichier combiné original.

**Cause** : NON élucidée avec certitude. Hypothèse la plus probable — pas la taille (comme supposé
initialement), mais un artefact de formatage introduit par le découpage/réassemblage Python (headers
manquants, encodage, structure markdown cassée en reconstruisant depuis un split de fichier).

**Règle prudente** : ne pas découper un gros `.md` pour "faciliter" l'affichage mobile sans avoir
d'abord vérifié que le fichier original tel quel ne fonctionne pas — dans ce cas précis, l'original
fonctionnait très bien, le découpage a empiré la situation pour rien.

**Si le problème se reproduit** : comparer octet par octet le fichier découpé vs un extrait identique
du fichier original (même section) pour isoler ce qui diffère structurellement, plutôt que de
re-suprposer la taille comme cause.
