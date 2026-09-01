# Seuils de taille mémoire — signal pour se poser la question, jamais une limite technique

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo). ⚠️ Ce fichier documente
> l'HISTORIQUE de la découverte du plafond dur (25000o/200 lignes) — voir aussi
> [[feedback_budget-contexte-mesurer-la-chaine-entiere]] pour l'état actuel des seuils en vigueur.

> ⛔⛔ **CORRECTION 2026-08-01 — LA PRÉMISSE DE CE FICHIER ÉTAIT FAUSSE POUR MEMORY.md.** Le
> raisonnement ci-dessous (§ "Le fait mesuré") calcule un coût en TOKENS DE TRAITEMENT et conclut
> à raison qu'il est négligeable — mais ce n'est PAS la contrainte qui s'applique à `MEMORY.md`.
> Reverse engineering confirmé du binaire Claude Code (2.1.220, extension VS Code) : ce fichier a
> un **plafond de LECTURE dur et câblé en dur**, indépendant de la fenêtre de contexte — **25000
> octets ET 200 lignes**, le premier atteint tronque SILENCIEUSEMENT tout le contenu au-delà à
> CHAQUE chargement de session (pas une fois, à chaque fois). Aucun override n'existe
> (`promptIndexMaxBytes`/`CLAUDE_MEMORY_STORES` vérifiés et écartés — système différent). Le
> "seuil souple 40 Ko" de la règle 2 ci-dessous est donc **irréaliste : au-delà de 25 Ko, on perd
> du contenu sans même s'en rendre compte.** La règle 1 (NEXT-ACTION/PIPELINE, mécanisme de sortie
> par ligne) reste valide — elle ne parlait pas de MEMORY.md. Seule la règle 2 est corrigée :
> **viser sous 20 Ko ET sous 200 lignes en continu** (l'alerte hook se déclenche à 20000 octets =
> 80% du cap réel), pas 40 Ko. Le § "Pattern reproductible" reste une bonne méthode générale, mais
> son point 1 (« si <5% de la fenêtre, la limite n'est pas motivée par la charge ») ne s'applique
> qu'aux fichiers SANS plafond de lecture dédié — à vérifier au cas par cas avant de l'appliquer,
> ne plus le supposer par défaut pour tout fichier mémoire.

**Décidé le 2026-07-31**, après le grand ménage mémoire du 30/07 (NEXT-ACTION 116→14 Ko, PIPELINE
88→9 Ko, MEMORY.md dégraissé sans repasser sous son ancien seuil de 17 Ko).

## Le fait mesuré, pas supposé
MEMORY.md à 19-20 Ko représente ~4 500-5 000 tokens. La fenêtre de contexte fait 1M tokens — soit
**0,5% de la capacité**, dans la marge d'erreur. Même les 293 Ko lus au démarrage de session AVANT
le ménage (NEXT-ACTION + PIPELINE + MEMORY + 2 CLAUDE.md) ne représentaient que ~70-75k tokens :
aucune de ces tailles ne "ralentit" Claude au sens traitement. Ne jamais affirmer qu'un fichier est
"trop gros pour moi" sans avoir fait ce calcul — c'est une affirmation vérifiable, pas un ressenti.

**Le vrai coût d'un fichier trop gros n'est PAS le traitement, c'est la FIABILITÉ.** Un fichier de
116 Ko avec 85% de contenu mort n'est illisible pour personne — humain ou IA — donc personne ne le
relit pour corriger ses erreurs. C'est ainsi que NEXT-ACTION a affirmé pendant des semaines qu'un
beat Maroc Batteries était un "stub" alors qu'il faisait 417 lignes complètes, et que PIPELINE.md a
contenu 2 affirmations contradictoires sur les fichiers actifs du Soudan Acte 3/4 sans jamais être
corrigé — parce que 1400 lignes, personne ne les relit en entier avant d'écrire dedans.

## Les seuils retenus (2 règles séparées, pas la même logique)

1. **NEXT-ACTION.md / PIPELINE.md — règle DURE, pas un seuil de taille** : « 3 lignes max par
   projet, un projet TERMINÉ se SUPPRIME du fichier ». Ce n'est pas une limite de Ko, c'est un
   mécanisme de sortie — l'absence de ce mécanisme est la cause racine du gonflement à 85% de
   contenu mort. Cette règle reste NON-NÉGOCIABLE, indépendamment de la taille atteinte.

2. **MEMORY.md — seuil souple à 40 Ko** (relevé depuis 17 Ko, jugé trop bas : il déclenchait des
   questions de ménage sur un fichier qui n'a jamais été le problème — 19 Ko ne pèse que ~6% du
   poids de démarrage total). 40 Ko ≈ 9-10k tokens, toujours négligeable — le seuil n'est PAS motivé
   par une charge réelle, il sert à donner un déclencheur objectif pour se poser la question du
   ménage, pas à imposer une coupe automatique.

## Comment appliquer le seuil de 40 Ko (décision explicite d'Aziz, pas une audit systématique)

- **Au wrap de fin de session** : réflexe LÉGER, pas un audit complet à chaque fois. Si LA session
  qui se clôt vient de rendre une section obsolète (un chantier refermé, une R&D qui passe "CLOSE"),
  retirer cette section précise pendant qu'on est dessus — coût quasi nul, gain immédiat.
- **Relire tout MEMORY.md à chaque wrap = surcorrection à éviter.** Ça ralentirait chaque clôture
  de session pour un gain marginal la plupart du temps (rien n'est mort d'une session à l'autre).
- **Le seuil de 40 Ko déclenche la QUESTION** (« ça mérite un ménage ? »), pas une suppression
  automatique — se reposer la question type AskUserQuestion comme fait le 30/07, pas trancher seul.
- **Le vrai critère de déclenchement est double, pas la taille seule** : taille qui approche 40 Ko
  **ET** doute réel sur la fiabilité (contradictions, chemins morts, affirmations jamais revérifiées).
  Un fichier à 25 Ko avec une contradiction non résolue est pire qu'un fichier à 39 Ko entièrement
  vrai — ne jamais optimiser le chiffre au détriment de la justesse (vécu : `feedback_defaut-signale-par-llm-verifier-quil-nous-concerne.md`
  a failli être coupé pour gagner 400 octets sans vérifier si le starter cité servait encore).

## Pattern reproductible pour toute future limite de taille dans ce workspace
Avant de fixer/durcir n'importe quelle limite de Ko (CLAUDE.md, ROUTAGE.md, un STATUS d'épisode) :
1. Calculer le vrai coût en tokens et le comparer à la fenêtre de contexte — si < 5%, la limite
   n'est pas motivée par la charge, elle doit avoir une autre raison (lisibilité, discipline).
2. Si la vraie raison est la discipline anti-accumulation (cas NEXT-ACTION/PIPELINE), la règle doit
   porter sur le MÉCANISME DE SORTIE (ce qui est clos disparaît), pas sur un chiffre — le chiffre
   seul se contourne (on écrit plus dense) sans résoudre le problème de fond.
3. Si la vraie raison est de donner un signal pour se reposer la question périodiquement (cas
   MEMORY.md), fixer le seuil large (ordre de grandeur : 2× le poids observé au moment du dernier
   ménage propre) plutôt que serré — un seuil trop bas force des coupes au jugé sur du contenu non
   vérifié, exactement ce qu'on veut éviter.

Voir aussi [[methode-consolidation-par-vagues]] pour le COMMENT (workflow multi-agents) une fois la
décision de ménage prise.
