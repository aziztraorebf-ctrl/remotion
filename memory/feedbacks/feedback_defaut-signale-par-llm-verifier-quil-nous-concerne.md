# Un defaut mesure n'est pas un defaut A CORRIGER

**2026-07-30, episode Franc CFA.** Gemini et Kimi convergent sur le manque de texture
(4/10 et 2/10, mesures independantes, tous deux en top-3 impact/effort). J'ai traite la
convergence comme un mandat et je suis parti coder un `GrainOverlay`.

Aziz, apres avoir regarde le comparatif : **« Je ne vois vraiment pas de difference. Et la
vraie question est : as-tu vraiment besoin d'un grain apres tout dans ce cas-ci ? »**

La question que je n'avais pas posee. J'avais saute de « le defaut est reel » a « il faut
le corriger » sans l'etape du milieu : *est-ce que ca concerne CETTE video ?*

## Ce que le test a revele

| Opacite | Bruit ajoute |
|---|---|
| 0.035 (le reglage preconise par les LLM) | +3,2 % — invisible |
| 0.11 | +13,5 % |
| 0.22 (6x le reglage preconise) | +18,2 % — toujours invisible pour Aziz |

L'effet plafonne : `mixBlendMode: overlay` a besoin de matiere claire pour mordre, et sur
un fond `#182746` il n'a presque rien sur quoi agir.

## Les 3 signaux que j'aurais du lire AVANT de coder

1. **Leur premisse etait fausse.** Gemini ecrivait « le fond uni est trop plat » — le fond
   est un `radial-gradient` avec des etoiles. Ils decrivaient un aplat inexistant. Verifier
   la PREMISSE d'une recommandation, pas seulement sa conclusion.
2. **3 de leurs 6 recommandations avaient DEJA ete demasquees comme fausses la veille**
   (funambule « lineaire » = Bezier quadratique · signatures « en fondu » = elles se tracent
   deja · 2 « temps morts » = les passages les PLUS animes). Un rapport dont la moitie est
   fausse ne merite pas que la moitie restante soit prise pour argent comptant.
3. **Le remede contredisait leur propre diagnostic.** Les deux ouvraient par « palette
   restreinte et epure : ne pas toucher ». Ajouter de la matiere au fond erode exactement ce
   qu'ils designaient comme la force du travail.

## Le critere qui tranche (deja etabli, pas applique)

C'est le verdict du decor du funambule, transpose : **un element doit porter une information
que les elements principaux ne portent pas deja.** Un grain ne porte aucune information — il
ne rend ni la garantie plus lisible, ni la chute plus tendue. C'est de la texture pour de la
texture, la meme redondance qui avait fait preferer l'ABSENCE de decor.

**Why** : les LLM notent contre une reference generique (« ressemble-t-il a Vox / The
Economist ? »). Ils ne savent pas ce que CETTE video cherche a faire, ni ce qui a deja ete
tranche. Une convergence mesure la conformite a leur reference, jamais la pertinence pour
nous. Voir [[convergence-modeles-vaut-le-critere-donne]].

**How to apply** : avant d'implementer une reco LLM, meme convergente, poser les 3 questions
dans cet ordre — (1) sa premisse est-elle vraie dans le code reel ? (2) le defaut concerne-t-il
l'intention de CETTE scene, ou une reference generique ? (3) le remede contredit-il quelque
chose que le rapport lui-meme designe comme une force ? Un « non » a (1) ou un « generique »
a (2) suffit a classer sans coder.

⭐ **Cout evite** : le chantier a ete abandonne avant tout commit, aucun beat de production
touche. Le test a variable unique (composant separe + copie du beat) a rendu le retrait
gratuit — c'est ce qui a permis de conclure « non » sans rien casser. La methode etait bonne,
c'est la question de depart qui manquait.
