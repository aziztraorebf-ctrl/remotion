# Un leaderboard PRÉSÉLECTIONNE, un test à l'aveugle TRANCHE

**Date** : 2026-08-20 · **Contexte** : arbitrage entre 3 modèles d'édition d'image (Gemini, MAI-Image-2.5, Krea 2).

## La règle

⛔ **Un écart de quelques points d'Elo sur un leaderboard ne prédit RIEN sur notre matière.**
C'est un bruit statistique agrégé sur des milliers de prompts génériques.

- Le leaderboard sert à **présélectionner** un candidat, et à **écarter les gouffres**
  (−83 Elo = ~61 % de préférence adverse : ça, ça se voit).
- Il ne sert **JAMAIS** à trancher entre deux candidats proches.

## La preuve — deux fois le même jour

| Comparaison | Écart annoncé | Verdict d'Aziz à l'aveugle |
|---|---|---|
| MAI-Image-2.5 vs notre Gemini | **+7 Elo** en édition, « seul gain net évident » | **aucune différence visible** |
| Gemini **Lite** vs Standard | −50 % de prix | **aucune différence visible** → bascule adoptée |

Le second test a **divisé notre coût d'image par deux**. Il n'aurait jamais eu lieu si on avait
suivi le classement, qui plaçait le Lite loin derrière.

## Le protocole qui a marché (à réutiliser tel quel)

1. **3 cas RÉELS et DIFFICILES** tirés de la production en cours — pas des prompts de démo.
   Chez nous : préservation d'identité (avec 2 personnages *similaires* dans l'image), retrait
   d'objet (le pire cas de tous les modèles), texte dans l'image.
2. **Générer avec les 2 modèles**, monter les planches **côte à côte, ANONYMISÉES** (VERSION A /
   VERSION B) — ne pas dire lequel est lequel, ni lequel est le moins cher.
3. **Former son propre jugement AVANT** de montrer, mais ne pas le communiquer : il biaiserait l'œil.
4. Si Aziz ne distingue pas → **prendre le moins cher**, systématiquement.
   Un gain invisible est un gain nul ; une économie de 50 % est réelle.

## ⭐ Le corollaire économique qui a réellement tranché (raisonnement d'Aziz)

La bonne question n'est pas « quel modèle est le meilleur » mais **« à quoi sert le livrable ? »**.

> Nos images ne sont **JAMAIS** le livrable. Elles sont matière pour H3, référence pour un SVG, ou
> moodboard pour un LLM. Le rendu publié dépend de la vidéo upscalée ou du SVG produit — jamais de la
> résolution de l'image intermédiaire, qu'on ne publie pas.

→ **Avant tout arbitrage qualité/prix sur un asset : déterminer s'il est PUBLIÉ tel quel ou CONSOMMÉ
par une étape suivante.** Payer le premium pour une qualité détruite ou jamais vue en aval n'a aucun sens.
(C'est ce qui a fondé la règle `IMAGE_MODEL` par défaut vs `IMAGE_MODEL_HQ` pour les miniatures.)

## ⛔⛔ Erreur commise LE MÊME JOUR — à ne pas répéter

En écrivant la doctrine issue de ces tests, j'ai gravé dans **4 fichiers** (dont `CLAUDE.md` et une
docstring) une affirmation venue d'un **rapport d'agent que je n'avais pas testée** : « sans le flag
`response_modalities`, le modèle renvoie zéro image sans erreur ».

**C'était faux.** Vérifié le jour même par appel réel : sans flag, avec `["IMAGE"]`, avec
`["image","text"]` — les 3 variantes renvoient 1 image, `finish=STOP`. C'est l'agent CHRONIQUEUR du
wrap qui l'a détecté, en testant ce que j'avais affirmé.

**La leçon** : j'ai commis la faute au moment même où j'écrivais la leçon qui l'interdit.
Un rapport d'agent est un **signal**, jamais un fait — même quand il est bien sourcé, même quand il
confirme ce qu'on croit. ⛔ **Une règle non testée ne se grave pas**, et surtout pas dans un fichier
injecté automatiquement : une fiche qui ment est pire que pas de fiche, elle clôture la recherche.

Voir aussi : [[feedback_chiffre-audit-relaye-sans-verification]] (même faute, terrain différent) ·
[[feedback_verifier-souvenir-comme-verdict-llm]].
