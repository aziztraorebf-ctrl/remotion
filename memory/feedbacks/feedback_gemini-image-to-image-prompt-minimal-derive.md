## ⭐ LA CAUSE REELLE (trouvee 2026-08-16, Gazoduc Acte 5) : L'ORDRE DES PARTS

`gen_gemini` envoyait toujours `[{text}, {image}]`. Dans cet ordre, le modele traite la demande comme
une **GENERATION** : le texte commande, l'image n'est qu'une inspiration faible.
En envoyant `[{image}, {text}]` → **EDITION chirurgicale** : composition d'origine preservee au detail
pres (robinets exacts, cadrage exact, objets exacts), seules les modifications demandees s'appliquent.

✅ Fix outille : `scripts/tools/storyboard-dual-gen.py` → `gen_gemini(..., edit=True)`.

## ⛔ MES DEUX MAUVAIS DIAGNOSTICS AVANT DE TROUVER (le vrai enseignement)

1. **« J'ai trop decrit, le texte a pris le pas sur l'image »** → j'ai relance avec un prompt MINIMAL.
   Resultat : hors-sujet TOTAL (le panneau "main entre 2 robinets" est sorti en **coupe anatomique de
   tete humaine**, le panneau "tuyau plante" en **schema de rein annote**, une 3e tentative en **photo
   de circuit imprime**). J'en ai conclu — a tort — que Gemini "ne sait pas faire d'edition fidele".
2. **Aziz a insiste** : « je ne suis pas sur de comprendre pourquoi Gemini rate, on devrait pouvoir
   faire une edition chirurgicale d'habitude ». Il avait raison. C'etait l'ordre des parts, pas le
   modele, pas la longueur du prompt.

⚠️ **Verification qui aurait du venir en premier** : demander au modele de DECRIRE l'image envoyee.
Il la decrivait parfaitement (« deux robinets, des tuyaux, une main au centre ») → la vision et la
transmission marchaient, donc le probleme etait forcement ailleurs. Faire ce test AVANT de conclure
qu'un modele "n'y arrive pas" — il isole vision vs generation en un appel.

## ⚠️ MEME EN MODE EDITION, GEMINI RE-SYNTHETISE (il n'efface pas des pixels)

Observe par Aziz sur l'avant/apres, malgre un prompt « ne change rien d'autre » :
- un **quadrillage de plan technique** est apparu sur tout le fond (absent de l'original) ;
- le **sol est devenu granuleux/texture** ;
- les **traits sont plus fins et plus nets**, resolution superieure.
Aucun de ces ajouts n'etait demande. Le modele complete ce qu'il interprete comme l'intention du
dessin. **Benin quand ca sert le registre** (ici ca renforce le « plan d'ingenieur »), **PIEGE des que
l'exactitude compte** (carte, geometrie reelle, contour de pays, donnee) → comparer avant/apres avant
d'accepter, ou coder la scene en SVG.

⚠️ Il applique aussi la demande AU PIED DE LA LETTRE : « remove the text labels » a efface les MOTS
mais **garde les PLAQUES** qui les contenaient → 2e passe necessaire pour retirer les cadres vides.

## ⛔⛔ COROLLAIRE MESURÉ (2026-08-17) — NE JAMAIS RETOUCHER UNE IMAGE **DÉJÀ VALIDÉE** PAR GÉNÉRATION

Cas : retirer un texte gravé de la miniature Soudan (« LE SERPENT DE L'OR ») via `gemini-i2i.py`.
⚠️ **Le câblage était bon** — vérifié dans le code : `gemini-i2i.py` envoie déjà `[image, texte]`,
donc en mode édition. Ce n'est PAS le bug d'ordre des parts ci-dessus. C'est la re-synthèse elle-même.

Le texte a bien été retiré, **et deux choses non demandées ont bougé** :
- **composition rétrécie** : le sujet passe de ~70 % à ~55 % de la hauteur, décalé vers le haut ;
- **résolution dégradée** : 1920×1080 → **1376×768** (sous le seuil confortable YouTube).

→ **Règle** : une image **validée** (miniature retenue, asset approuvé) ne repasse JAMAIS par un
modèle génératif pour une correction locale. La re-synthèse touche toute l'image, y compris ce qu'on
voulait figer. Le mode `edit=True` réduit la dérive, il ne l'annule pas.

✅ **Remède prouvé : masquage local en Python/PIL**, zéro IA — reconstruire le fond ligne par ligne
depuis les pixels situés de part et d'autre de la zone (médiane gauche/droite + interpolation pour
suivre un dégradé), puis recentrer le sujet. Résultat mesuré : **0 pixel résiduel, 0 altération hors
zone (octet pour octet), résolution intacte**.
Vérifier par des MESURES, pas à l'œil : compter les pixels de la couleur retirée, et
`abs(après − avant).max()` sur la région à préserver — doit valoir **0**.

⚠️ **Un seuil de contrôle se périme dès qu'on transforme l'image.** Le test « aucun pixel doré sous
y=850 » est devenu FAUX après le recentrage (le sujet, descendu de 81 px, franchit désormais cette
ligne) → 16 067 pixels signalés, fausse alerte, j'ai failli conclure à un échec sur une image
correcte. **Re-dériver le seuil après chaque transformation géométrique**, ou vérifier la FORME du
signal (ici : arc centré à largeur décroissante = le serpent ; bande large de 858 px = le texte).

## How to apply

- Retoucher une image existante → `edit=True` (image d'abord), instruction courte et litterale.
- Creer une planche/un storyboard → mode normal (texte d'abord), decrire la scene en detail.
- Fidelite EXACTE de composition non negociable → SVG code (Fable 5), pas de generation d'image.
- Un modele qui "rate" 3 fois de suite sur une tache standard : suspecter d'abord NOTRE cablage
  (ordre, format, parametres) avant de conclure a une limite du modele.

Voir aussi [[reference-image-mimetisme-composition]] (le mimetisme par image reste vrai ailleurs —
ne pas generaliser ce constat a tout le parc de modeles).
