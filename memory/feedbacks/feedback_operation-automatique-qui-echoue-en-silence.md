# ⛔ Toute opération automatique doit prouver qu'elle a réussi — 3 cas payés le même jour

> Vécu le **2026-08-30** (session « scènes du corpus »). Trois incidents distincts, une seule
> cause : **une opération qui échoue sans erreur**, et dont on ne voit le dégât que bien plus tard.

## Les 3 cas, tous du même jour

### 1. Un `re.sub` a VIDÉ un fichier de 20 Ko (→ 14 octets)
Une réécriture par expression régulière sur `gen-planche.py`, avec une fonction de remplacement mal
formée. **Aucune exception, aucun avertissement.** Le fichier est passé de 20 181 à 14 octets, et je
ne l'ai vu qu'à la commande suivante (`sed` sans sortie).
⭐ Récupéré par `git checkout HEAD -- <fichier>` **grâce au commit fait 20 minutes plus tôt**.
→ **La vraie leçon n'est pas « attention aux regex » mais : commiter avant toute réécriture
automatique d'un fichier qu'on ne peut pas reconstruire.**
→ **La règle : après tout `re.sub` / `sed -i` / réécriture programmée, VÉRIFIER LA TAILLE.**
`print(f"{avant} -> {len(s)} octets")` en fin de script coûte une ligne et attrape le cas.

### 2. Un extracteur a rendu « 0 groupe » sans erreur
`extraire-groupes.py` comptait `<g>` pour suivre la profondeur d'imbrication. Un **commentaire** du
SVG contenait le texte `<g>` (une légende : « repère local de chaque `<g>` ») : le compteur ne
revenait jamais à zéro. Résultat : **0 groupe extrait, module `.ts` écrit VIDE, aucune erreur.**
Le vrai symptôme est apparu 6 messages plus loin : `has no exported member 'DOC'`.
→ Fix : retirer les commentaires AVANT analyse, **et un garde-fou qui refuse d'écrire un module
vide** en comparant à ce que le fichier contient réellement.
→ ⚠️ **Le garde-fou ne couvrait que le cas « 0 »** : plus tard dans la même session, une balise
fermante orpheline a fait passer 15 groupes à 12 — **silencieusement**, car 12 ≠ 0. Un garde-fou qui
teste le cas extrême ne teste pas le cas partiel. **Comparer au COMPTE ATTENDU, pas à zéro.**

### 3. Un rendu vidéo entièrement VIDE, sans erreur de compilation
Les chaînes de markup SVG passées en enfant JSX (`{DOC}`) s'affichent en **texte brut** — donc
invisibles sur fond blanc. TypeScript compile, Remotion rend 151 frames, le `.mp4` fait 128 Ko.
Mesure : **0 pixel non-blanc sur toutes les frames**. Il fallait `dangerouslySetInnerHTML`.
→ La règle générale : **un livrable qui se produit sans erreur n'est pas un livrable vérifié.**
Mesurer le contenu (ici : compter les pixels non-blancs) coûte 3 lignes.

## La règle

⭐⭐ **Une opération automatique (regex, parsing, génération, rendu) doit produire une PREUVE
CHIFFRÉE de son succès, pas une absence d'erreur.**
- réécriture de fichier → la taille avant/après
- extraction/parsing → le compte obtenu **vs le compte attendu** (pas « > 0 »)
- rendu → une mesure du contenu (pixels, durée, poids), pas seulement « le fichier existe »

⛔ **Le silence n'est pas un succès.** Les 3 cas ci-dessus n'ont produit AUCUNE erreur, et les 3
ont coûté du temps parce que le dégât s'est révélé plusieurs étapes plus loin — là où la cause
n'est plus évidente.

## Lien avec le reste
- Prolonge `feedback_rapport-vert-ne-prouve-rien-regarder-l-image.md` (un rapport vert mesure sa
  propre couverture, pas la fidélité) — même famille, appliquée aux opérations de fichiers.
- Le cas 3 rejoint la règle « vérifier CODE + VISUEL » de `CLAUDE.md` : ici le code était juste,
  seul le visuel l'a dit.
