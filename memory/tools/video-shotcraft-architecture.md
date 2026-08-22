---
name: video-shotcraft-architecture
description: L'ARCHITECTURE du systeme de fiches de video-shotcraft (3 couches, index genere, medias hors git) — la methode, distincte des composants deja importes dans FICHE-UI-PRODUIT.
metadata:
  type: reference
---

# video-shotcraft — l'architecture de leur base de connaissance

> Repo `Vincentwei1021/video-shotcraft` (5933 stars, 507 forks, cree le 2026-07-19, Apache-2.0).
> ⚠️ Distinct de `memory/fiches/FICHE-UI-PRODUIT.md`, qui documente leurs **composants** importes
> (PageCam, FlashCut…). Ici : leur **methode**, verifiee le 2026-08-21 et deja copiee par `gallery/`.

## Les 3 couches — et la fiche ne contient AUCUN code

`grep` verifie sur les 152 fiches : **zero bloc de code**. La fiche decrit, et se termine sur un
**chemin** vers le `.tsx` qui s'execute.

| Couche | Contenu | Statut |
|---|---|---|
| Fiche `.md` | semantique, intention, plage des parametres | **modifiable** |
| Demo `.tsx` | les valeurs reellement calibrees | **la verite deterministe** |
| Pieges connus | sous-ensemble **nomme** de parametres | **verrouille** |

Modele **« ouvert sauf liste noire nommee »**, pas « ferme sauf parametres exposes ». Leur contrat :
« Reecrire a partir du seul nom de fiche = abandonner tout l'acquis de calibrage. »

⭐ **Le point transposable** : le determinisme ne vient pas d'un template fige, il vient de ce que le
point de depart est **toujours du code deja eprouve**, jamais une reconstruction depuis la description.

## Ce qu'on leur prend concretement

- ⭐⭐ **La 3e colonne « ressenti au reglage »** : elle donne le SENS DE LA DERIVE, pas la valeur —
  « s=1.72 ; au-dela de 2.2 la texture devient floue », « sous 0.05 ca devient un survol ». C'est ce qui
  rend un parametre reglable par quelqu'un qui n'a pas ecrit le code. **A copier dans nos registres.**
- **Index GENERE depuis le frontmatter** (`sync-from-cards.py`), jamais ecrit a la main ; la CI echoue si
  l'index regenere differe du commit. Rend structurellement impossible notre bug des 2 arborescences.
- **Scan a 2 etages** : le frontmatter seul = **12,5 % du volume** (69 Ko vs 553 Ko). Un agent balaie tout
  le catalogue pour ~10 % du cout, puis ne lit en entier que la fiche retenue.
- **Le « bloc a copier »** de leur galerie est un **pointeur de 20 caracteres** (le nom de la fiche), pas
  du code. L'humain choisit en regardant les previews ; l'agent resout le reste.
- ⭐ **Les 209 previews mp4 vivent HORS git**, sur une release GitHub, telechargees au deploiement.
  **Methode reprise telle quelle par `gallery/`** (release `gallery-media` + `fetch-media.sh`).

## Les forks — 362 verifies un par un (API compare)

85 clones identiques · 269 sans commit en avance · **6 reellement divergents**.
⛔ **Aucun des 6 n'a plus d'1 star** — invisibles au tri par popularite ; la verification exhaustive
etait la seule methode. Les 2 notables :
- `karekin` : 50 chart-cards + **timing derive de la duree audio reelle** (= notre propre regle).
- `sanjoxtech` : 13 shot-cards dans le formalisme exact — **preuve que leur systeme est extensible par
  un tiers**, donc que le formalisme tient.

## Ce qu'on ne leur prend PAS

Leurs **fiches** elles-memes : leur domaine (mockups SaaS) est standardise, le notre non — chaque scene
a une intention propre. On prend le contenant, pas le contenu.
