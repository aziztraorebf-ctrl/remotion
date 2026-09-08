---
name: jury-externe-aveugle-signal-fort-si-independant
description: "4 modeles consultes SANS contexte du repo, qui ne se voient pas entre eux, qui convergent = signal bien plus fort qu'un accord entre 2 voix qui partagent le meme contexte biaise"
metadata:
  type: feedback
---

⭐⭐⭐ **Quand on est bloque a 2 (Aziz + Claude) sur un probleme de PERCEPTION visuelle** (pas
un bug mesurable au pixel), lancer un jury de modeles EXTERNES **isoles les uns des autres
ET du contexte du repo** est un signal bien plus fiable qu'un aller-retour de plus entre nous.

**Preuve (chill-meter, 2026-09-06)** : la cliente dit qu'un objet "flotte" alors que le
calage est mesure correct au pixel. Aziz et Claude tournaient depuis plusieurs sessions
autour de l'hypothese "ombre pas assez marquee". 4 voix (GPT-6 Astra, Grok, Gemini 3.1 Pro,
Kimi K3), appelees en PARALLELE avec un prompt minimal (2 images + 4 questions, zero mention
de nos tentatives passees), ont **toutes rejete** cette hypothese independamment, avec des
formulations quasi identiques (« une ombre sur du vide reste une ombre »), et converge sur
une cause commune jamais envisagee (absence de premier plan dans le decor de fond).

## POURQUOI CE SIGNAL EST PLUS FORT QU'UN ACCORD ORDINAIRE

⛔ Deux voix qui partagent le MEME contexte (ex: 2 agents Claude dans le meme repo, ou un
2e appel apres avoir montre le 1er avis) peuvent converger parce qu'elles recyclent le meme
biais — cf. [[convergence-modeles-sur-brief-biaise-nest-pas-une-preuve]]. Ici, les 4 voix :
- n'avaient PAS acces au repo (pas de risque d'absorber une doctrine locale biaisee) ;
- ne se voyaient PAS entre elles (appel en parallele, pas sequentiel) ;
- venaient de 4 architectures/labos differents (OpenAI, xAI, Google, Moonshot).
Un accord dans ces conditions n'est pas une coincidence de 4 essais — c'est un signal
structurel : le probleme est probablement visible depuis n'importe quel angle exterieur,
et notre proximite au dossier (des semaines dessus) est ce qui nous en avait empeche.

## COMMENT LE DECLENCHER — le script est A USAGE UNIQUE, pas un outil generique

`scripts/tools/jury-chill-meter-flottement.py` a ete ecrit specifiquement pour ce cas
(brief + 2 images + 4 questions dediees), en copiant la structure de `da-brief.py` mais
SANS ses blocs generiques (ai-slop, mouvement, angles narratifs — hors sujet ici).
⛔ Ne pas generaliser la liste de 4 modeles a d'autres briefs sans decision explicite —
c'etait un choix pour CE probleme (Aziz, 06/09), pas un nouveau standard de jury.
Point de vigilance technique : max_tokens releve a 24000 (vs 16000 par defaut) et
`finish_reason` verifie sur les 4 reponses — consigne explicite « aucune reponse coupee ».

## LA LIMITE — le jury propose, il ne remplace pas la verification

Le jury a donne une PISTE (occlusion partielle par le premier plan), pas un fix cle en main.
Elle reste a coder et a VERIFIER sur le rendu reel, comme toute recommandation externe —
cf. [[feedback_rapport-vert-ne-prouve-rien-regarder-l-image]]. Un jury qui converge dit
« regarde par la », pas « c'est regle ».

## 🔗 LA FAMILLE « CONVERGENCE DE MODELES » — 4 fiches, 4 angles DIFFERENTS

Le sujet essaime : verifier laquelle s'applique AVANT d'en ecrire une 5e.
| Fiche | Ce qu'elle traite |
|---|---|
| [[convergence-modeles-sur-brief-biaise-nest-pas-une-preuve]] | le BRIEF oriente : elles renvoient mon cadrage |
| [[feedback_convergence-modeles-vaut-le-critere-donne]] | le CRITERE : une convergence mesure ce qu'on lui a demande |
| [[feedback_convergence-llm-tester-en-retirant-le-contexte]] | le TEST : relancer sans le contexte suspect |
| [[feedback_convergence-spontanee-2-modeles-signal-fort]] | 2 voix spontanees = signal |
| **celle-ci** | **l'ISOLATION MUTUELLE : N voix en parallele, sans contexte partage, qui ne se voient pas** |

Voir `memory/client-sim-tests/upwork-chill-meter/STATUS.md` § JURY EXTERNE 4 VOIX (06/09)
