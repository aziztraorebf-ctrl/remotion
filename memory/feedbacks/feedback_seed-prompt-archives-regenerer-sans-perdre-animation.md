⭐⭐⭐ **REGLE DE PRODUCTION : archiver le SEED et le PROMPT a cote de CHAQUE clip genere.** Sans ca,
un plan ne peut plus etre corrige sans repartir de zero.

**Ce qu'est le seed** (explication validee avec Aziz 2026-08-18) : le modele part d'un nuage de bruit
aleatoire qu'il debruite progressivement. Le seed est le NUMERO de ce nuage de depart. Meme seed =
meme nuage = meme chemin de debruitage = generation reproductible. Ce n'est pas un reglage de qualite,
c'est un identifiant de trajectoire.

**La regle exacte, a ne pas deformer** :
- ✅ **seed identique + prompt identique + image modifiee → MEME animation** (mesure : correlation des
  courbes de mouvement **0,823**, mouvement moyen 0,110 vs 0,118 sur le test robe indigo→emeraude).
- ⛔ **seed identique + prompt CHANGE → animation DIFFERENTE.** Le seed ne fige que le chemin ; c'est le
  PROMPT qui decrit le geste. Aziz avait infere l'inverse ("on peut changer le mouvement et l'animation
  reste pareille") — corrige en session.

**Pourquoi c'est LA valeur du dispositif** : avant, regenerer un plan = perdre le mouvement valide et
recommencer les iterations. Avec seed+prompt archives, on retrouve la meme animation sur une image
corrigee. Le vrai cas d'usage n'est PAS le caprice esthetique (changer une couleur de vetement — cf
[[edition-video-ciblee-omni-seedance]] : casse la continuite des plans voisins, legitime de refuser en
contexte client) mais la **CORRECTION D'ERREUR apres montage** : date fausse a l'ecran, objet
anachronique, detail historiquement faux. La, on ne peut pas refuser, et la ca sauve la journee.

**Format d'archivage** : a cote de chaque `clipN.mp4`, garder `clipN.prompt.txt` + `clipN.meta.json`
(seed, duree, node ids, nom de l'image source uploadee). Deja documente dans
`memory/tools/edition-video-ciblee-omni-seedance.md` § CHEMIN GAGNANT — cette fiche en fait une regle
generale, pas une note de test.

**Pourquoi nos resultats H3 sont si bons (4 clips reussis du 1er coup, zero morphing)** — 4 causes
identifiees, toutes reproductibles :
1. **On demande tres peu** : les prompts sont massivement des LOCKS (decor statique, camera bloquee,
   style verrouille). Sur 5 s, H3 n'anime qu'une main ou des paupieres.
2. **Le style simplifie aide** : un aplat cerne d'un trait n'a ni texture de peau ni reflets a
   recalculer — peu de surface a rater.
3. **Graphe API a la main** (pas `run_template`) : contourne le bug `input_overrides` documente.
4. **L'image de depart est deja validee** : le modele n'invente pas la scene, il l'anime. Toute la DA
   est faite en amont, gratuitement.
