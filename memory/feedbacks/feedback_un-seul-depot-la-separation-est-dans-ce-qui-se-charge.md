---
name: un-seul-depot-la-separation-est-dans-ce-qui-se-charge
description: "Decision 2026-09-05 : PAS de fork du workspace client/YouTube. La separation utile n'est pas sur le disque, elle est dans CE QUI SE CHARGE en session"
metadata:
  type: project
---

**DECISION (Aziz + Claude, 2026-09-05) : un seul depot.** La question du fork
(un workspace YouTube / un workspace client, divergeant a partir de maintenant) a ete
posee et tranchee NON. ⭐ Ecrit pour ne pas la re-poser dans trois semaines : le
diagnostic qui la motive est JUSTE, c'est la solution qui rate la cause.

**Le diagnostic d'Aziz, valide** : le workspace est « spaghetti » — travaux clients qui
n'ont rien a voir avec YouTube, travaux YouTube qui n'ont rien a voir avec les clients,
methodes qui se confondent. Bascule reelle et recente : premier client (~fin aout 2026),
premiere fois qu'on cree pour quelqu'un d'autre, contre exigences et argent.

## Pourquoi NON au fork

1. ⛔ **Ce qui est melange n'est pas separable en deux.** Ce qui vaut de l'argent chez la
   cliente vient INTEGRALEMENT de YouTube : pipeline SVG, `gemini-i2i.py`, detourage par
   composante connexe, `delayRender`, mesure de luminance, agents, gates. **La piece
   chill-meter existait AVANT le contact avec la cliente** — c'est ce qui a emporte le
   contrat (cf. `fiches/FICHE-BRIEF-CLIENT.md` § Q1). Un fork ne separe pas deux choses
   distinctes : il coupe une racine de sa branche. A 6 mois : deux copies divergentes de
   `gemini-i2i.py`, et le correctif trouve cote client ne remonte jamais cote YouTube.
2. **La separation sur disque existe DEJA et fonctionne** : `src/projects/_client-sim/` ·
   `public/_client-sim/` · `memory/client-sim-tests/` · `out/PORTFOLIO-UPWORK/` ·
   `FICHE-BRIEF-CLIENT.md` injectee · `client-source-gate.sh`. Ce qui manque n'est pas une
   frontiere, c'est que **les methodes transversales n'ont pas de foyer** (axe 5 de
   `starters/STARTER-retro-chill-meter-branchement.md`). Un fork ne le resout pas : il
   DUPLIQUE le probleme dans deux depots.
3. **Cout reel** : deux CLAUDE.md, deux MEMORY.md, deux jeux de hooks, 2,3 Go d'assets a
   trancher ou dupliquer, memoire episodique (13000+ conversations) indexee sur un seul.
   ⛔ Surtout : [[registre-canonique-branche-rnd-jamais-mergee-pattern-recurrent]] en est a
   sa **5e occurrence** — on perd deja du code entre deux BRANCHES du meme depot. Entre
   deux depots ce serait la norme, pas l'accident.

## ⭐ LA VRAIE CAUSE, ET CE QU'ON FAIT A LA PLACE

Le probleme n'est pas que les deux mondes cohabitent sur le disque. C'est que **YouTube se
CHARGE quand Aziz travaille pour un client** : chaine de demarrage a ~46000 tokens, pleine
de Souverain / Mapbox / moteurs narratifs / formes narratives — pendant qu'on code un
compteur pour une cliente americaine.

⭐⭐ **La separation utile n'est pas dans le disque, elle est dans CE QUI SE CHARGE.**
Un mode client qui n'injecte que le brief, les references et les methodes de PRODUCTION,
et laisse la doctrine YouTube au repos.

C'est l'axe 5 de la retro vu par l'autre bout : ranger les methodes par **GESTE**
(« je genere une matiere », « je detoure », « je mesure un rendu ») plutot que par OBJET
PRODUIT rend le fork inutile — le commun devient explicitement commun, le specifique
explicitement specifique.

**How to apply** :
- Si la question du fork revient : relire ceci AVANT de re-argumenter. Elle est tranchee,
  sauf element nouveau (ex. un client exigeant un depot isole pour raison contractuelle).
- ⛔ **L'asymetrie qui justifie d'attendre** : un fork ne se defait pas, un depot unique se
  forke encore. Rester unique preserve les deux options ; forker n'en preserve qu'une.
- Le chantier a mener a la place : **le budget de contexte par TYPE DE SESSION**
  (client vs YouTube), pas la separation des fichiers.

Lie a [[chantier-client-la-source-avant-le-gout]] ·
[[budget-contexte-mesurer-la-chaine-entiere]] ·
[[registre-canonique-branche-rnd-jamais-mergee-pattern-recurrent]] ·
`memory/starters/STARTER-retro-chill-meter-branchement.md` § axe 5
