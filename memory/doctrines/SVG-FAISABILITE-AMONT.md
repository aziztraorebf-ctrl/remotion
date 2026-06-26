# ⭐ DOCTRINE — ETAPE "FAISABILITE SVG" AMONT (le LLM dit SA capacite + image-cible AVANT le code)

> 🧭 ORDRE DE LECTURE : **(0) VOUS ETES ICI — SVG-FAISABILITE-AMONT** (valider la vue AVANT de generer) → (1) SVG-SCENES-GENERATIVES (generer+animer, manuel principal) → si multi-agents : PRODUCTION-AGENTIQUE-SVG → si format video long : SVG-MIDFORM-FORMAT.

> Gravee 2026-06-22 (Aziz). Comble un trou prouve : "avoir une idee de scene ne veut PAS dire qu'elle se transcrit
> bien une fois le SVG genere". Cas declencheur = le mur d'arbres top-down -> les arbres = "gros points verts informes",
> illisibles. Decouvert seulement APRES le render (cher en allers-retours). Cette etape deplace la decouverte AVANT le code.
> Complete [[SVG-SCENES-GENERATIVES]] (le COMMENT generer/animer) par le QUOI generer (la bonne vue/approche).

## LE PRINCIPE (vision Aziz)
C'est le LLM (Gemini/GPT) qui DESSINE la matiere SVG -> c'est donc LUI qui connait SES capacites de dessin, pas nous.
Donc avant de coder une scene, on lui demande, DEPUIS SA FORCE NATIVE (pas "est-ce que ca rentre dans notre systeme") :
1. **D'apres TES capacites, la meilleure facon de dessiner cette scene en SVG pour qu'elle soit 100% LISIBLE** (quelle VUE ?
   top-down / 3-4 isometrique / profil / coupe — pourquoi — comment tu rends l'element-cle reconnaissable).
2. **Ce que tu CHANGERAIS** par rapport a l'intention naive pour que ca lise (alleger, changer d'angle, re-decouper).
3. **Un MINI-STORYBOARD pre-SVG** (3-4 etats de l'evolution envisagee, en mots).
4. **Le PROMPT exact d'une IMAGE-CIBLE** -> qu'on GENERE pour VOIR le resultat vise AVANT de coder le SVG.

Repartition des roles (Aziz) : on FAIT 100% confiance au LLM sur SA capacite de DESSIN ; lui fait confiance a NOUS sur
l'ANIMATION + le PILOTAGE COULEUR + le montage. Donc on ne lui impose PAS notre boite ; on mentionne juste, LEGER, la
seule contrainte non-negociable : **decoupe en `<g id>` nommes** (sinon inanimable) + "on animera/colorisera nous-memes".

## LE PIPELINE PAR SCENE (nouvel ordre)
1. **Storyboard** : intention + geste voulu (ce qu'on a deja).
2. **Brief FAISABILITE SVG** (`scripts/tools/svg-faisabilite-brief.py`), a Gemini ET GPT (generer les 2, comparer leur
   approche native) : joindre des FRAMES DE REFERENCE (ce qu'on sait rendre) + la TENTATIVE RATEE s'il y en a une.
   -> sortie JSON {faisable_note, approche, changements, mini_storyboard, image_cible_prompt}.
3. **IMAGE-CIBLE** : generer l'image avec le prompt rendu (`gemini-gen-image.py`, modele `gemini-3.1-flash-image-preview`).
   On VOIT la cible. Si l'element lit (l'arbre ressemble a un arbre) -> go. Sinon -> on re-brief / change d'angle. GRATUIT vs render.
4. **Claude FILTRE** (double filtre [[feedback_ia-externe-idees-filtre-projet]]) : le LLM ne connait pas nos decisions ;
   garder ce qui sert le projet, ecarter le hors-sol. Presenter la synthese a Aziz.
5. **PUIS** generer le vrai SVG (scene ajoutee au generateur), en sachant : la bonne VUE, que ca LIRA, que c'est animable,
   et quel modele le dessine le mieux.

## PREUVE (cas top-down, 2026-06-22) — la methode a debloque en 1 cycle
- Probleme : top-down pur -> arbres = points verts informes (render `td2-150.png`).
- Brief Gemini -> verdict 10/10 + diagnostic : "abandonne le top-down strict -> VUE 3/4 ISOMETRIQUE en plongee, axe
  ouest->est en DIAGONALE bas-gauche->haut-droit (remplit le 9:16 vertical), arbres avec TRONC + cime etagee (ils lisent)".
  La diagonale iso resout LISIBILITE + cadrage vertical d'un coup — meilleur que ce qu'on aurait code seul.
- Image-cible generee -> carte Sahel iso, vrais arbres tronc+canopee, tracé en S Senegal->Djibouti, 9:16 premium braise-or.
  = jour et nuit vs les blobs. On l'a SU avant de coder. Image : `/tmp/cible-topdown-apogee.png`.
- ⚠️ GPT indispo ce jour (OpenRouter 402) -> continue avec Gemini (bon modele pour l'organique/atmosphere de toute facon).
  Recharger OpenRouter si on veut comparer l'approche GPT (souvent meilleure sur le schema/net).

## OUTILS
- `scripts/tools/svg-faisabilite-brief.py --provider gemini|gpt --intention "..." --refs a.png,b.png --out x.json`
- `scripts/tools/gemini-gen-image.py --prompt "..." --output cible.png` (modele verrouille flash image)
- Generateur SVG final : `scripts/tools/rnd-svg-scene-gen.py` (+ flag `--registre` pour override).

## ⭐⭐ TEST DE L'ECART image-cible -> SVG (reserve Aziz prouvee, 2026-06-22) — ETAPE OBLIGATOIRE si geo/detail realiste
L'image-cible (raster) peut SURVENDRE ce que le LLM sait reproduire en SVG vectoriel. Test : RENVOYER l'image-cible au
LLM "reproduis CECI en SVG, groupes nommes" -> rendre -> COMPARER cote a cote (compo `Img2SvgCompare.tsx`). Verdict cobaye
top-down (image `mlfrsf.png`) :
- ✅ SE TRANSCRIT BIEN : les ARBRES (tronc+cime etagee, ils LISENT), l'axe diagonal S, le registre braise-or, le decoupage animable (27 arbres).
- ⚠️ S'EFFONDRE : la GEO REELLE. L'image "trichait" une carte du Sahel que le SVG rend faux/vague (frontieres molles, pays = labels flottants).
- 🎯 LEÇON : pour une scene a connotation geo -> NE PAS viser une vraie carte en SVG (= notre regle Mapbox-pour-la-geo). Viser une
  BANDE DE TERRE STYLISEE + tracé + objets + 2 labels extremites. Le SVG "debarrasse de sa pretention cartographique" est tres exploitable.
- ⚠️ Gemini s'auto-note 9/10 sur la fidelite -> NE PAS le croire (signal pas juge), JUGER SOI-MEME au render. L'auto-note a survalue la geo.
-> Donc le pipeline gagne une etape pour les scenes a detail realiste : image-cible -> TEST image2svg -> comparer -> ajuster l'ambition AVANT le pilote.

## ⭐ ITERATION CIBLEE : Gemini itere TRES bien sur sa propre matiere (prouve 2026-06-22)
Apres le test d'ecart, on RENVOIE le SVG + des CORRECTIONS PRECISES (memes consignes a GPT et Gemini pour isoler la
variable modele). Cobaye top-down (image `jn6xds.png`, 3 panneaux : gemini-v1 / gpt-ameliore / gemini-itere) :
- ✅ GEMINI ITERE = LE MEILLEUR : a applique TOUTES les corrections sur SON SVG (carte supprimee -> bande de terre stylisee
  iso, arbres qui lisent, tracé diagonal, 2 labels, marge texte). = notre capacite "LLM=point de depart, on ajuste" confirmee.
- ❌ GPT-5.5 a RATE ici : a sur-interprete (fusionne les arbres en un sapin geant). Sur une scene ORGANIQUE/atmospherique
  (terre, semis d'arbres), Gemini reste le bon dessinateur MEME en iteration. La regle Gemini=organique / GPT=schema TIENT.
-> Pour corriger un SVG : preferer l'ITERATION du modele qui l'a fait (surtout si organique=Gemini), avec corrections precises.
Le panneau "gemini-itere" = la BASE DE HOOK validee du pilote Grande Muraille Verte (SVG reel, sans fausse carte).

## ⚠️ TROU CONFIRME (2026-06-22, test agent vierge sur le hook encre) — DONNER L'IMAGE-CIBLE PRECISE
Un agent vierge a refait le hook en ENCRE du 1er coup (doctrine reproductible ✅) MAIS a produit du vectoriel PLAT
(aplats propres) au lieu de la GRAVURE-naturaliste voulue (hachures, trait vivant, lignes de construction) — PARCE QU'IL
N'AVAIT PAS l'image-cible de reference precise sous les yeux. Le mot "registre encre" ne suffit pas : il faut joindre
L'IMAGE qui montre le NIVEAU de gravure attendu. LEÇON : dans tout brief d'agent SVG, joindre l'IMAGE-CIBLE exacte du
rendu vise (pas juste le nom du registre). Sinon le modele/agent fait du "propre-plat" par defaut. (Cas : ref `wuar68.png`.)
Bonus gotcha : `loop` sur un `<Audio>` (drone/ambiance plus court que la compo) FONCTIONNE en render headless (non documente avant).

## ⭐⭐ CALIBRER L'IMAGE-CIBLE AU NIVEAU SVG FAISABLE (prouve par render 2026-06-22) — LA correction majeure
CAUSE RACINE d'une perte de temps : on generait des image-cibles = ILLUSTRATIONS DENSES (gravure de musee type
`wuar68` : milliers de hachures de plume) -> magnifiques en raster MAIS INFAISABLES en SVG -> ecart image->SVG "intensif".
CORRECTION (Aziz) : "l'image-cible doit se retrouver comme ton SVG final". Elle doit RESSEMBLER DEJA A UN SVG FAISABLE.
METHODE : pour calibrer le prompt-cible, PARTIR D'UNE FRAME D'UN PROTO QUI MARCHE (la joindre comme ref de NIVEAU),
pas d'une idee abstraite. PREUVE bouclee : 1er test (cible=wuar68) -> ecart intensif (carte effondree, blob noir) ;
test calibre (cible=niveau du proto arbre-hachure) -> ecart QUASI-NUL (cible/Gemini/GPT identiques, render `m1kwcw.png`).
-> BIBLIOTHEQUE de prompts-cibles PAR REGISTRE (pas un prompt unique) : `templates/PROMPTS-CIBLES-SVG-PAR-REGISTRE.md`.
   Chaque registre = PROMPT + IMAGE-REF (`public/_shared/refs/svg-registres/`) a joindre ensemble ("ref de STYLE/NIVEAU
   seulement, la scene voulue est differente"). 2 FAMILLES faisables : aplats+degrades / trait-grave-epure. Le premium =
   EPURE + MOUVEMENT, jamais la densite de trait. Carte GEO-REALISTE s'effondre en SVG (=> d3-geo) ; carte SCHEMATIQUE OK.

## ⭐⭐ IDEATION "VUES" PAR LE LLM QUI CONNAIT SA CAPACITE (methode neuve 2026-06-22)
Une fois l'image-cible 100%% prouvee, le LLM SAIT ce qu'il peut faire. Donc on lui demande des IDEES de DIRECTION :
"voici le SCRIPT du beat + l'image-cible que TU as generee a 100%% (tu connais donc tes capacites reelles) -> propose
plusieurs VUES / facons de representer cette scene, et VA PLUS LOIN". Puis on EXAMINE les idees -> on choisit quoi generer.
= storyboard [[STORYBOARD-MAPBOX]] applique au SVG : le modele propose la direction (en restant dans le faisable, ancre
par l'image-cible), Aziz tranche, PUIS on genere. Evite les idees hors-sol (le modele ne propose que ce qu'il sait rendre).

## REGLE GRAVEE
"Une idee de scene n'est pas une scene. Avant de coder un SVG, faire dire au LLM-dessinateur SA meilleure approche +
generer l'image-cible. Voir avant de coder. La diagonale isometrique > le top-down pur pour des objets qui doivent LIRE
(arbres, batiments)." -> deplace la decouverte des problemes AVANT le code, gratuitement.
