---
name: cadrer-brief-client
description: "Interroger un brief client jusqu'a l'accord ecrit, AVANT de coder. Use des qu'un contrat est gagne, qu'une revision client arrive, ou qu'une demande client est floue/ambigue/potentiellement impossible."
---

# Cadrer un brief client

Le brief est gagne, le code n'est pas ecrit. Ce skill couvre ce moment-la : transformer
des mots de client en contraintes mesurees et en engagements bornes.

Le TRI (candidater ou non, prix, profil du client) est un autre moment, deja outille :
`memory/fiches/FICHE-BRIEF-CLIENT.md`. Ne pas le refaire ici.

## Le principe

Un client decrit fiablement un SYMPTOME, jamais une CAUSE. Traduire est notre travail.

Preuve, contrat chill-meter : la cliente avait « l'impression » que l'objet n'etait pas
centre. Mesure : 66,7 % contre 67,0 % sur notre plateau — son ressenti etait juste, sa cause
etait fausse. Elle l'a reconnu. Puis elle a demande d'« ancrer » un objet a un endroit ou la
mesure a montre qu'il n'y avait rien pour l'ancrer : 4 essais rates avant de mesurer le decor.

Donc : **mesurer la source AVANT de doser quoi que ce soit.**

## Phase 1 — Extraire, jamais de memoire

Recopier les MOTS EXACTS du client dans un fichier de suivi, demande par demande, numerotees.
Coder de memoire sur un brief client est un defaut deja paye (commit `931c9853`).

Puis remplir la table des contraintes dures. Toute case vide est une question a poser, pas
une valeur a supposer :

| Contrainte | Valeur | D'ou elle vient |
|---|---|---|
| Format de sortie | | mots du client / a demander |
| Resolution | | |
| Ratio (16:9 / 9:16 / carre) | | |
| FPS | | |
| Fond transparent (alpha) ? | | ⭐ decide le codec, cf. `livrer-client` |
| Logiciel de montage du client | | decide le conteneur (CapCut → ProRes 4444) |
| Duree | | |
| Nombre d'etats/variantes | | |
| Revisions incluses | | ⛔ si vide → Phase 4 |

Ce qu'on peut trouver soi-meme, on le trouve soi-meme : mesurer sa capture, lire ses fichiers,
sonder ses references. On ne demande au client que ce que lui seul sait.

## Phase 2 — Mesurer la source avant de promettre

Des que la demande porte sur un rapport a une image, un decor, une capture ou une reference
du client : **mesurer d'abord.** Cette phase produit un chiffre ou elle n'est pas faite.

- Position, taille, alignement → mesurer en pixels et en %, pas a l'oeil.
- « Ca doit se poser sur / passer devant / s'aligner avec » → mesurer si la surface invoquee
  EXISTE, et sur quelle etendue exactement.
- Sur un objet symetrique, comparer les deux cotes au meme zoom. Une mesure GLOBALE ne dit
  rien sur la REPARTITION — defaut vu par Aziz sur son telephone apres validation d'un rendu.

Sortie : un chiffre par demande mesurable. Ce chiffre tranche la Phase 3.

## Phase 3 — Poser les questions en vagues

Interroger par vagues. Une vague = toutes les questions dont les prerequis sont deja regles.
Une question qui depend d'une autre question encore ouverte appartient a la vague SUIVANTE.

Numeroter, donner sa recommandation, puis attendre. Format :

```
❓ Q1 — <titre> : <question, avec les choix possibles>
➡️ Ma reco : <la reponse recommandee, et pourquoi>
```

Regrouper les questions de gout en UN point de controle, puis executer longtemps sans
interrompre. Trancher seul ce qui est objectif (un fps documente, un import evident).

### Classer chaque demande dans l'un des trois seaux

**FAISABLE** — chiffrer le cout, l'annoncer.

**FAISABLE AUTREMENT** — la demande nomme un MOYEN, pas un but. Remonter au but et proposer
le moyen qui marche. Le jury externe demandait « qu'il ne flotte pas » ; l'occlusion n'etait
que son moyen — l'ancrage par ombre de contact et reflet a servi le meme but.

**IMPOSSIBLE** — et c'est le seau qui sauve le contrat. Une demande est impossible quand la
MESURE le dit, pas quand c'est difficile. Le dire tot, avec le chiffre, en proposant l'echange
le plus proche. Ne jamais s'engager sur une impossibilite mesuree en esperant s'en sortir au
dosage : c'est exactement ce qui a coute 4 tentatives.

⭐ Chercher un PRECEDENT dans le materiel du client pour appuyer un refus : son enseigne neon
vivait deja sur sa vitre, ce qui legitimait un element graphique non ancre.

## Phase 4 — Borner avant de s'engager

« Tout est modifiable » fait percevoir au client un cout marginal nul, et il n'arbitre alors
jamais. Ecrire, en une ligne chacun :

- Combien de revisions sont incluses, et ce qu'est une revision.
- Ce qui est HORS perimetre (nommer les demandes classees IMPOSSIBLE).
- Les jalons, et ce que chacun livre.

⛔ Un accord dans le fil de discussion n'existe pas dans le contrat. Ce qui n'est pas dans
l'offre acceptee n'est pas engage.

Detail : `memory/projects/CHANTIER-CADRAGE-REVISIONS-CLIENT.md`

## Fin de cadrage

Le cadrage est fini quand chaque demande numerotee de la Phase 1 porte : un seau, un chiffre
si elle etait mesurable, et une reponse du client sur les questions posees. Tant qu'une
demande n'a pas ces trois choses, le cadrage continue — on ne code pas.

Ensuite : le code (`/beat` ou direct selon la nature), puis `livrer-client`.
