# Comparatif storyboard ↔ rendu — mesurer, pas demander

> Migré depuis auto-memory 2026-08-31 (créé 2026-08-22, session Zambie). Référencé en index dans
> `MEMORY.md` § Méthode/feedbacks-clés ("comparatif-storyboard-mesurer-pas-demander") mais le
> détail complet n'existait nulle part côté repo.

Quand un rendu « ne ressemble pas » au storyboard, **mesurer avant de demander**. Extraire la case
cible, échantillonner ses couleurs, comparer à la frame. L'appel modèle ne sert qu'à ce qu'aucun pixel
ne dit : *« est-ce que ça raconte la même chose que ma planche ? »*.

**Why** : session Zambie 2026-08-21/22, premier workflow démo client complet. Trois défauts ont
traversé plusieurs rendus sans que personne ne les voie, et **aucun n'était un jugement de goût** :
- fond `RGB(9,9,9)` au lieu de `RGB(21,53,82)` — le style Mapbox `dark-v11` brut était laissé sans
  appeler la fonction d'application de palette maison. Le modèle n'avait rien inventé : il avait
  dessiné la palette Mapbox par défaut.
- un globe fantôme : **Mapbox v3 bascule seul en projection globe sous zoom ~5**. Rien ne plante.
- terres du globe `RGB(61,82,115)` vs `RGB(194,203,209)` attendu — 3× trop sombre.

Sur 2 appels comparatifs, **un a été entièrement gâché** : la planche empilait 4 vignettes de rendu
sous la rangée du storyboard, et Gemini ET Grok ont alors affirmé « le pays occupe 15-20 % du cadre »
alors que la mesure donnait 61 % et 54 %. Ils jugeaient la vignette, pas la frame — et Gemini en
faisait son « fix n°1 ». Sur planche pleine taille, le même modèle a produit un diagnostic juste.

Bilan des 3 modèles sur 7 points remontés : **3 justes, 2 neutres, 2 nuisibles**. Les nuisibles
auraient (a) rempli les provinces que le client INTERDIT de montrer, (b) supprimé des arcs
qu'Aziz avait arbitrés. Un modèle a par ailleurs demandé d'afficher une donnée qu'il avait
**lui-même interdit** dans son breakdown deux appels plus tôt ("do not treat X as data").

## How to apply

- Ce qui se mesure ne se demande jamais : couleur, cadrage, projection, présence, timing.
  → `scripts/tools/carto-selfreview.py` (O/X, bloque en exit 1), gratuit donc illimité.
- Comparatif : **une case ↔ une frame PLEINE TAILLE**, jamais une bande de vignettes.
  → `scripts/tools/make-comparatif-panel.py` (⚠️ vérifier existence).
- Injecter les mesures déjà faites dans le prompt, et **ne pas demander de note** : le score fait
  juger sur des faits que le modèle estime à l'œil. Demander « quels écarts restent, valeur cible ».
- **Vérifier chaque point dans le code/les sources avant de l'appliquer.** Un modèle peut contredire
  sa propre consigne à deux appels d'intervalle.
- ⚠️ La mesure ne remplace pas le coup d'œil : un score de contraste de frontières peut donner « ok »
  alors que les pays voisins sont invisibles — le chiffre portait sur les traits du pays cible
  uniquement. Un chiffre rassurant peut porter sur le mauvais objet. Regarder la frame **aussi**.

Modèles (vérifié sur l'API, 2026-08) : `gpt-5.5` = `[file, image, text]`, **pas de vidéo** — mais le
meilleur relecteur de frame, même sans avoir dessiné la planche (seul à voir un manque narratif, seul
à donner des valeurs en px). `gemini-3.1-pro` est le seul à accepter `video` : pour juger du
MOUVEMENT, c'est lui.
