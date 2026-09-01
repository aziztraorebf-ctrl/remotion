Documenter une leçon après un bug ne suffit pas à éviter sa répétition — il faut la RELIRE activement avant de coder tout geste de la même famille, pas seulement compter sur le fait qu'elle soit écrite quelque part.

**Why:** Dans la session du 2026-07-02 (transposition de gestes du rig capsule vers le personnage-vivant-svg Gemini, voir [[PERSONNAGE-VIVANT-INDEX]]), le bug "un bras qui tient un objet ne peut pas suivre le grand balancier de la marche libre (±45°), il doit être figé à un angle réduit" a été détecté et documenté sur le geste `marche-porte-charge`. Le MÊME bug s'est reproduit à l'identique, dans la même session, sur le geste suivant `cueillette-arbre` — malgré que la leçon venait d'être écrite. La cause : le code du nouveau geste a été écrit sans repasser explicitement par la check-list des leçons déjà accumulées dans cette session pour la même famille de problème (ici : "tout geste où un membre porte quelque chose pendant un déplacement").

**How to apply:** Avant de coder une nouvelle transposition/variation dans un domaine où des leçons viennent d'être gravées durant la session en cours (rig/animation paramétrique, mais généralisable à toute famille de bugs répétables — ex. une classe d'erreurs de parsing, un pattern de race condition, une convention d'API), grep/relire activement les leçons déjà écrites sur des mots-clés proches AVANT d'écrire le code — pas seulement chercher dans la mémoire persistante inter-session, mais aussi dans les notes prises plus tôt dans la session courante. Si le nouveau geste partage une caractéristique avec un geste déjà buggé (ex: "objet porté" + "cycle de marche"), vérifier explicitement que la correction précédente est bien appliquée avant de passer au rendu.

**Autre cas (2026-07-24, Acte 4 CFA)** : deux variantes de la même famille de dérive.
1. **« Continuité apparente » prise à tort pour une exemption de règle** : Claude a codé l'Acte 4 CFA directement
   (carte + scène de signature) en réutilisant la géométrie de l'Acte 2, sous prétexte que c'était une
   « continuité » d'un beat déjà validé — sans repasser par le comparatif multi-modèles amont (règle N°0,
   [[SVG-SCENES-GENERATIVES]] : « le modèle dessine le SVG statique, nous animons »). Or la scène de signature
   1994 était une scène VRAIMENT nouvelle, jamais comparée. La leçon existait, elle a juste été jugée « pas
   applicable ici » à tort. Corrigé par Aziz en direct. À généraliser : une scène qui *ressemble* à du déjà-fait
   n'est PAS automatiquement exemptée du comparatif amont — seule une scène RÉELLEMENT identique (même géométrie,
   même mécanisme) peut réutiliser une direction déjà validée sans nouveau comparatif.
2. **Grep trop étroit qui rate un fichier existant** : recherche de "SCRIPT-V*" (sans le mot "MIDFORM") a fait
   manquer `SCRIPT-MIDFORM-V2.md` (le vrai script complet du projet), alors qu'un fichier au nom proche
   (`SCRIPT-V6.md`, une version différente) était bien trouvé et a été pris à tort pour LE script de référence.
   Aziz a dû pousser fermement ("je ne comprends pas pourquoi il n'est pas référencé") avant qu'une recherche
   exhaustive (agent Explore, `ls` du dossier complet + grep large) retrouve le bon fichier. Leçon : dans un
   dossier avec plusieurs fichiers `SCRIPT-*`/noms proches, toujours LISTER le dossier complet (`ls`, pas
   seulement un grep par pattern deviné) avant de conclure qu'un document de référence n'existe pas — et se
   méfier d'un grep qui retourne UN résultat plausible : ce n'est pas une preuve qu'il n'y en a pas un meilleur.
