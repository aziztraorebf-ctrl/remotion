# Gate contourné par outil alternatif

> Migré depuis auto-memory 2026-08-31 (créé 2026-08-21). Référencé en index dans `MEMORY.md` §
> Méthode/feedbacks-clés ("gate-contourne-par-outil-alternatif") mais le détail complet n'existait
> nulle part côté repo.

Un hook qui se déclenche sur `matcher: Write` ne protège **que** l'outil Write. La même action
(créer une scène `.tsx`) faite en Bash — `cat > Scene.tsx <<EOF`, `cp`, `tee` — passe sous le radar
sans que personne ne le remarque, parce que rien n'échoue : le fichier est créé, le code compile,
le rendu sort.

**Why** : payé le 2026-08-21 (gabarit client Zambie). Trois mécanismes étaient en place et corrects
— un gate qui exige de déclarer le registre visuel avant de coder une scène, et un système qui pose
les fiches CAMERA/SVG sous les yeux au moment d'écrire — et **aucun ne s'est déclenché**.
Cause unique : les fichiers ont été créés en Bash. Le gate ne surveillait que `Write` ; le système
d'injection excluait explicitement `cat *` (pour éviter un faux positif sur des commits qui
contiennent le mot "narration"). Mesure faite après coup sur le fichier réel : il aurait déclenché
les deux fiches via Write. Résultat concret : des helpers/composants réutilisables existaient déjà
mais n'ont jamais été montrés ; le code a été écrit à la main et le livrable a été jugé
« prototype », à refaire.

Aggravant : la consigne de session pousse à travailler en Bash plutôt qu'avec Read/Edit/Write.
La porte latérale n'était donc pas un cas rare — c'était le **chemin par défaut**.

## How to apply

- Quand un gate protège une ACTION, énumérer **tous les outils capables de cette action**, pas
  seulement celui auquel on pense. Pour un fichier : `Write`, `Edit`, mais aussi Bash (`>`, `>>`,
  `cp`, `mv`, `tee`, `sed -i`).
- Toute exclusion posée pour tuer un faux positif (`cat *`, `git *`) doit être **conditionnée**, pas
  globale : ici, `cat` devait rester exclu SAUF quand la commande écrit un `.tsx`.
- Symétriquement, exclure les interprètes (`python3`, `sed`, `node`) qui *parlent* du fichier sans le
  créer — faux positif rencontré immédiatement : un patch Python contenant `cp x Scene.tsx` en
  exemple s'est fait bloquer. L'exclusion doit rester **locale** à la détection concernée : la passer
  en `exit 0` global casse d'autres surveillances (ex: des briefs storyboard qui se lancent
  justement via `python3 ...py`).
- **Graver le scénario en test**, pas seulement vérifier à la main. Le même type de gate peut
  régresser faute de test sur son cas de référence.
- Piège de test : un système d'anti-répétition par (session, fiche) dans `TMPDIR` sans purge au
  démarrage peut passer au 1er run puis échouer à tous les suivants — faux échecs qui accusent le
  hook alors qu'il fait exactement son travail.

Lié à la règle "règle écrite insuffisante sans gate outillé" (cf `MEMORY.md` § Méthode) : ici la
règle ÉTAIT outillée, et l'outillage avait une porte latérale. Un gate non testé sur le chemin
réellement emprunté est un gate décoratif.
