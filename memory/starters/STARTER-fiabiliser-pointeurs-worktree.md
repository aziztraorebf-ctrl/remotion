# STARTER — Fiabiliser les pointeurs vers des dossiers de travail (worktrees)

> Créé le **2026-09-11**, fin de session chantier mémoire/gates.
> ⛔⛔⭐⭐⭐ **PRIORITAIRE** — à traiter avant tout autre chantier de confort. Ce n'est pas un
> nice-to-have : c'est un problème qui s'est reproduit **5 fois confirmées** et qui envoie
> l'IA sur des chemins morts à chaque fois qu'il se reproduit une 6e fois.

---

## Le problème, en clair

Certains fichiers de mémoire pointent vers des « dossiers de travail parallèles » (des
worktrees — l'équivalent d'une copie de travail temporaire du projet, utilisée pour un
chantier isolé). Le problème : **quand ce dossier de travail est supprimé une fois le
chantier terminé, personne ne pense à corriger les pointeurs qui y menaient encore.**

Résultat concret vécu cette session : `ROUTAGE.md` (le fichier qui dit « pour tel besoin,
va lire tel fichier ») pointait vers un dossier `remotion-cfa` qui **n'existait plus depuis
12 jours**. Un autre fichier (`PIPELINE.md`) avait bien noté la correction — mais seulement
là, jamais recopiée ailleurs. Deux fichiers lus à *chaque démarrage de session* envoyaient
donc sur une piste fantôme.

## Pourquoi c'est arrivé 5 fois et pas une fois pour toutes

Chaque fois qu'un cas comme ça a été trouvé, il a été corrigé **au cas par cas** — on a
réparé LE pointeur cassé, pas la CAUSE qui permet aux pointeurs de casser sans qu'on le
sache. C'est le même problème qui revient sous un déguisement différent à chaque fois,
donc le correctif précédent ne le voit jamais venir.

**Détail complet des 5 occurrences, dates et fichiers exacts** :
`memory/feedbacks/feedback_registre-canonique-branche-rnd-jamais-mergee-pattern-recurrent.md`

La 5e occurrence (11/09) a une variante importante : les 4 premières fois, le fichier
cherché existait ailleurs sur une autre branche non fusionnée (donc retrouvable). La 5e est
l'inverse — **le dossier de travail lui-même a été supprimé**, et le pointeur lui a
survécu. Ce n'est donc plus seulement « chercher où ça a été déplacé », c'est aussi
« vérifier que l'endroit visé existe encore ».

## Ce qui a déjà été tranché (11/09), ce qui reste ouvert

- ✅ Le pointeur mort du 11/09 est corrigé (`ROUTAGE.md`, `NEXT-ACTION.md`).
- ✅ La 5e occurrence est enregistrée dans le feedback ci-dessus.
- ⛔ **La clause du feedback dit : « à soumettre à Aziz si un 5e cas survient ».
  Le 5e cas est arrivé. La décision de fond n'est PAS encore prise.**

## Les deux options sur la table (à trancher, pas à improviser)

**Option A — Fusionner plus vite.** Dès qu'un chantier fait sur un dossier de travail
séparé est validé, le fusionner dans les 48h dans le dossier principal, au lieu de le
laisser vivre en parallèle. Réduit le risque à la racine, mais demande de la discipline à
chaque session.

**Option B — Un script de garde.** Un outil qui tourne au démarrage de chaque session,
qui liste tous les dossiers de travail « canoniques »/« validés » cités dans la mémoire, et
vérifie qu'ils existent vraiment avant que la session ne s'appuie dessus. Plus robuste
(automatique), mais demande de l'écrire et de le maintenir.

⭐ Une version outillée déjà esquissée pour la variante du 11/09 : faire refuser par
`scripts/tools/check-links.py` tout chemin de navigation qui contient un segment de dossier
de travail absent de la liste réelle des dossiers actifs (`git worktree list`).

## Par où reprendre

1. Relire le feedback complet (lien ci-dessus) — il contient les 5 cas avec dates, fichiers,
   et la méthode de vérification déjà écrite (comment chercher correctement avant de
   conclure qu'un fichier « n'existe pas »).
2. Trancher entre option A, option B, ou les deux.
3. Si option B : le point de départ technique le plus concret est d'étendre
   `scripts/tools/check-links.py`, qui vérifie déjà les liens morts dans les fichiers de
   navigation — il lui manque la vérification spécifique aux dossiers de travail.
4. Une fois tranché, fermer la clause ouverte dans le feedback et dans
   `memory/NEXT-ACTION.md` (section « DÉCISION EN ATTENTE »).
