# Pattern récurrent — un registre « canonique » peut vivre sur une branche R&D jamais mergée

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo, alors que ce fichier
> est cité nommément par [[worktree-git-isolation-gotchas]] et d'autres feedbacks du repo).

⛔⛔⛔ **PATTERN RÉCURRENT, 4e occurrence confirmée le 2026-08-12.** Un registre ou une méthode marqué
CANONIQUE/VALIDÉ dans sa propre documentation peut en réalité vivre sur une branche R&D jamais mergée
dans master ni dans la branche de travail courante — invisible à toute recherche de fichier normale
(grep, find, Read) qui opère implicitement sur la branche courante seulement.

**Les 4 occurrences** :
1. **2026-07-26** — `memory/doctrines/AUDIO-PAUSES-DETERMINISTES.md` + `scripts/tools/soudan-audio/`
   absents du worktree `remotion-cfa`. Voir [[feedback_worktree-git-isolation-gotchas]].
2. **2026-07-31** — `memory/tools/notebooklm-boucle-short.md` absent, vivait sur `chore/menage-memoire-poids`
   + `rnd/slide-nlm-vers-svg`. Voir [[feedback_fichier-methode-doit-exister-toute-branche]].
3. **2026-08-03** — `CfaActe2Carte16x9.tsx` référencé comme pattern réutilisable mais vivait sur un
   worktree séparé non mergé. Voir [[feedback_deux-agents-template-matcher-innovateur-breakdown]].
4. **2026-08-12** — `stick-figure-svg/identite/Roles.tsx` (le registre de personnages le PLUS UTILISÉ
   en production, 4 rôles habillés) recherché à l'aveugle pendant ~5 allers-retours dans le mauvais
   dossier (`personnage-vivant-svg/`, registre `StickRig` plus simple) avant qu'Aziz ne fournisse
   2 vidéos de référence pour identifier le bon fichier — qui vivait en fait déjà sur `HEAD` pour son
   cœur (`Roles.tsx`, `StickFigure.tsx`), mais dont la scène de démo complète (`RolesDemo16x9.tsx`)
   restait, elle, isolée sur `rnd/stick-figures-gestes` jamais mergée. Voir
   `src/projects/_shared/personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md` § "LA VRAIE RÉFÉRENCE
   CANONIQUE" pour le détail corrigé (une 1re version de cette note avait elle-même sur-généralisé le
   problème à tout le registre, corrigée après audit de cohérence le même jour — même le correctif
   peut se tromper si on ne vérifie pas contre l'état réel du repo).

**Pourquoi 4 fois** : chaque occurrence a été traitée comme un incident isolé (un pointeur ajouté au
fichier concerné), jamais comme la manifestation d'un problème structurel répété. Le rustinage au coup
par coup n'empêche pas la récidive — chaque nouveau cas est un nouveau fichier/registre différent, donc
le pointeur précédent ne le couvre pas.

**Règle actionnable, à appliquer avant de conclure qu'un fichier/registre "n'existe pas" ou "est mal
fichu"** :
```
git log --all --oneline -- <chemin approximatif ou nom de fichier>
git branch --all
```
Si le fichier apparaît sur une branche autre que la courante → NE PAS conclure à une lacune, vérifier
d'abord si le contenu utile est déjà sur `HEAD` (souvent seulement une PARTIE d'un registre reste sur
la branche R&D — le socle réutilisable peut déjà être mergé, seule une démo/un test reste isolé,
comme le cas n°4 l'a montré). `git worktree add <path> <branche>` ou `git show <branche>:<chemin>`
seulement si le contenu recherché est confirmé absent de `HEAD`.

**Question ouverte, non tranchée** (à soumettre à Aziz si un 5e cas survient) : arrêter le rustinage au
coup par coup — soit merger systématiquement les branches R&D contenant un registre validé dans les
48h suivant sa validation par Aziz, soit créer un script de garde qui liste au démarrage de session
tous les registres "canonique"/"validé" cités dans `MEMORY.md` et vérifie leur présence réelle sur la
branche courante avant que la session ne s'appuie dessus.

---

## ⭐⭐ Cas SYMETRIQUE (ajout 2026-08-15) : le catalogue AFFIRME une absence — et il a tort

Ce fichier couvre « je cherche un fichier, je ne le trouve pas → il est peut-etre sur une branche ».
Il ne couvrait pas le cas inverse, plus insidieux : **un catalogue affirme par ecrit qu'un fichier
n'existe pas, alors qu'il existe.**

Vecu : `INTENTION-FORME-INDEX.md` portait `⛔ AnimatedCaravan.tsx = fichier FANTOME (cite en memoire,
n'existe pas)`. **Faux** — le fichier existe (`_reference-atlas-poc/composants-tsx/`, tracke par git),
prouve en 10 s par `ls` + `git ls-files`. La note voulait dire « non porte / inutilisable depuis
`src/` » (vrai : imports locaux au POC non resolus) et l'a durci a tort en « n'existe pas ».

**Pourquoi c'est pire qu'un fichier introuvable** : une affirmation d'absence **CLOT la recherche**.
Personne ne re-verifie une ligne qui dit deja « verifie, n'existe pas », et elle se recopie de session
en session. Un fichier introuvable, lui, invite au moins a chercher.

**How to apply** :
- ⛔ Ne jamais ECRIRE « n'existe pas / fantome / supprime » sans l'avoir prouve, et **dater la
  verification** + citer la commande (`git log --all -- <nom>`). Sans date ni preuve → traiter la
  mention comme NON verifiee.
- Formuler la vraie nature du probleme (« non porte », « imports non resolus depuis src/ », « archive »)
  plutot qu'une absence — c'est presque toujours l'exageration d'un « inutilisable en l'etat ».
- Quand on requalifie « existe mais non porte », ecrire **POURQUOI** — sinon un futur agent le
  redecouvre et perd du temps a vouloir le porter.
- ⭐ **Deux composants homonymes = piege d'import garanti.** Meme session : DEUX fichiers nommes
  `GeoFlowConnection.tsx` avec des contrats OPPOSES (`_shared/mapbox/` = sprite oriente, dormant ·
  `warmap/_shared/` = marqueur nu, publie Soudan). Avant d'importer un composant trouve par NOM dans
  un catalogue : `find src -name '<Nom>*'` pour verifier qu'un seul fichier le porte.
