# Seedance 2.0 — Regles de Prompt
> 94 regles + anti-patterns. Consulter AVANT d'ecrire un prompt Seedance.
> Mise a jour : 2026-04-26

---

## Regles de style et structure

1. **Style obligatoire** : "2D vivid flat illustration style" en debut de prompt
1b. **Image de reference style** : fournir une image dans le style voulu (generee via Gemini depuis nos frames). Sans ref, Seedance default vers photoralisme cinematique meme avec "2D flat" dans le prompt. Valide 2026-04-05.
2. **COLOR GRADE obligatoire** : section en fin de prompt pour ancrer la palette
2b. **ZERO metaphore lumineuse en 2D flat** : "beacon", "glow", "catches light", "gold light", "radiant" = Seedance fait EMETTRE de la lumiere (halo magique). Utiliser "contrasts sharply", "the only [color] object", "stands out against". Le contraste de couleur suffit — pas besoin de glow. Valide 2026-04-05.
3. **"gradually"** : utiliser dans tout segment reveal (flotte, armee, decor)
4. **"Single continuous take, no cuts"** : pour plan-sequence
5. **Anti-texte OBLIGATOIRE** : "No text, no banners, no signs, no writing visible anywhere" — Seedance invente des bannieres spontanement (ex: "WELCOME TO JANJANBURO")

---

## Regles audio et narration

6. **Audio narration = toujours remplacer** : Seedance re-synthetise les mots uploades. Strip audio + ElevenLabs overlay.
19. **Lip sync = 3 pistes Audio Remotion** : Seedance re-synthetise -> timings decales. Toujours pistes separees calees sur moments visuels (silencedetect)
20. **"Cut to" = mot censure** : remplacer par "Camera shifts to frame". Eviter "cut"
25. **Audio-Guided Dialogue (VALIDE 2026-04-03)** : dialogues dans prompt -> lip sync natif. Teste en francais avec 2 personnages, zero ref. Lip sync parfait + mise en scene exacte. 2 formats (section separee ou inline timecode). Voir `tools/seedance-prompts.md` pour details et workflow ElevenLabs overlay.

---

## Regles de reference images

7. **Eye patch Amanirenas** : toujours mentionner "black eye patch over left eye"
8. **Ref images** : character sheet multi-vues = meilleure ref. 1 ref suffit pour plan-sequence/POV
12. **1 ref RECOMMANDE si personnages similaires** : 2 refs trop proches = fusion. Decrire soldats par texte ("silhouettes WITHOUT cape"). Note : Seedance accepte jusqu'a 9 images par requete — notre limite a 1-2 est un choix pratique, pas technique.
15. **Refs SCENE = slideshow** : refs doivent ancrer l'IDENTITE (personnage, style), pas la COMPOSITION. 1 ref scene max
16. **1 ref + 1 ambiance par clip** : changement de lieu = splitter en clips separes

---

## Regles de mouvement et dynamisme

9. **Duree segments** : 2-3s par segment pour 10s, 3-4s pour 15s. Ne pas surcharger
10. **Verbes d'action** : "PRESSES", "RISES", "STRIKES" — jamais "subtle", "gentle", "slow" sauf intention explicite
11. **Seedance = ultra-litteral** : "uphill" = pente 45deg, "raises sword" sans "lowers" = epee levee tout le clip
18. **Verbes dynamiques dans TOUS les formats** : "slowly/gently" = animation au ralenti. Utiliser "crashes", "surges", "pushes"
22. **Specifier chaque axe/direction** : "forward" = ambigu. Dire "down to his side", "toward the ground"

---

## Regles de personnages

13. **Differencier leader vs soldats** : "leader with [detail]" + "soldiers WITHOUT [detail]" — sinon clones
14. **Objets parent-enfant** : "degainer" != "fourreau vide" pour Seedance. Ecrire "curved sword in hand, no scabbard visible"
23. **Props main gauche/droite (A TESTER)** : "Right hand ALWAYS holds [objet], NEVER released, NEVER disappears. Left hand EXCLUSIVELY for [action]." Source : JSFILMZ tutorial.

---

## Regles de format

17. **Narratif > SECONDS pour paysages** : SECONDS surdecoupe les scenes sans personnage. Utiliser Format 1 ou 4.
24. **Direction du mouvement dans images source (A TESTER)** : designer la composition de l'image source pour indiquer le sens du mouvement. Source : Mira AI / Higgsfield.

---

## Regles de format et dynamisme

28. **Format 3 SECONDS > Format 6 pour scenes d'action** : Format 6 (Scene 1 + Transition + Scene 2) force des orbites slow-mo comme vehicule de transition = videos statiques. Format 3 (SECONDS X TO Y) permet 4+ mouvements camera varies (aerial, snap zoom, dolly, pull back) + verbes explosifs dans chaque segment. Valide 2026-04-05 sur Thiaroye clip 1 (test 1-2 = statiques avec Format 6 style, test 3-4 = dynamiques avec Format 3).
29. **Pas de changement d'echelle brutal** : passer de plan moyen a close-up mains = morphing. Garder une echelle coherente ou changer graduellement. "dolly in toward face" avec objet a hauteur poitrine = objet passe devant visage = morphing garanti. Valide 2026-04-05.
30. **Violence implicite = decrire la DISPARITION, pas l'absence** : "no bodies shown" = personnages invulnerables (restent debout sous les tirs). Ecrire plutot "COLLAPSE to knees, disappearing into thick smoke" — le mouvement de chute est la, la fumee couvre. Le spectateur comprend sans voir. Valide 2026-04-05 sur Thiaroye clip 3.
31. **Ref image gros plan visage = BLOQUE** : "@Image1 is the primary character identity" + image de visage gros plan = filtre "inappropriate content" (deepfake detection). Solutions : (a) pas de ref image, (b) ref = image de style/scene sans visage, (c) ref = character sheet multi-vues, (d) ref = plan large corps entier. Valide 2026-04-05 sur Abou Bakari beat sync.
32. **Format SHOT numerote = VALIDE** : "SHOT 1: [type], [focale] / [description] / SFX: [son]" fonctionne. Seedance genere des coupes distinctes entre chaque SHOT. Teste avec 10 shots en 15s (~1.5s/shot). Ajouter BPM et MUSIC dans l'en-tete pour guider le rythme. Valide 2026-04-05.
33. **"POINTS at" = pointe vers la camera** : quand le personnage fait face a la camera et qu'on dit "POINTS at the chiefs", Seedance interprete comme pointer vers l'avant = vers la camera. Fix : specifier la DIRECTION physique du geste ("TURNS to face the chiefs on her LEFT, POINTS directly at them"). Toujours indiquer vers qui/quoi le personnage pointe par rapport a la composition spatiale, pas par rapport au nom du personnage. Valide 2026-04-06 sur Yaa Asantewaa.
34. **Propagation couleur = effet VFX artificiel** : "color bleeds outward / spreads across" = Seedance genere un halo lumineux qui s'etend depuis la source, comme un effet magique. Resultat artificiel. Fix : NE PAS demander de propagation progressive dans un meme plan. Plutot : (a) couper a un plan large ou tout est deja en couleur (la transition se fait par le changement de plan), ou (b) utiliser un pull back progressif qui revele la couleur deja presente. Le changement chromatique fonctionne ENTRE plans, pas DANS un plan. Valide 2026-04-06 sur Yaa Asantewaa.
35. **Personnages secondaires statiques = decrire des micro-actions** : "chiefs RISE from their stools" = mouvement minimal, robotique. Fix : ajouter des reactions physiques specifiques et variees ("one SLAMS his stool, another CLENCHES his fist, a third STRIKES his own chest"). Chaque personnage secondaire a besoin d'au moins 1 verbe d'action propre pour paraitre vivant. Sans ca, ils sont des mannequins. Valide 2026-04-06 sur Yaa Asantewaa.
36. **Camera "push in" + retrait = zoom avorte** : "slight push in" peut causer un mouvement de camera qui commence un zoom puis revient en arriere (zoom avorte). Fix : soit camera STEADY (pas de mouvement), soit un push in ENGAGE sur toute la duree du segment (pas de "slight"). Valide 2026-04-06 sur Yaa Asantewaa.
37. **Contraste chromatique = 1 vs foule SEULEMENT** : le contraste (1 personnage en couleur, reste desature) fonctionne parfaitement pour 1 sujet isole au milieu d'une foule grise (valide 10/10 sur Abou Bakari). MAIS demander que la couleur "se propage" a un groupe entier = resultat inconsistant (certains en couleur, certains gris, vetements colores mais peau grise). Utiliser le contraste chromatique avec parcimonie : (a) scenes ou 1 personnage reste en couleur TOUTE la video, (b) PAS de transition chromatique de groupe dans un meme plan, (c) si on veut tout le monde en couleur a la fin, couper a un nouveau plan ou tout est deja colore. Valide 2026-04-06-07 sur Yaa Asantewaa V1+V2.
38. **Motifs muraux/decor = saignent sur les personnages** : des motifs detailles sur les murs (Adinkra, fresques, gravures) proches des personnages risquent d'etre interpretes par Seedance comme des tattoos ou decorations sur la peau/vetements. Fix : soit murs lisses avec motifs eloignes, soit specifier "clean skin, no markings on bodies, no tattoos". Valide 2026-04-07 sur Yaa Asantewaa V2.
39. **Ref image = position de DEPART du personnage** : si le personnage doit etre assis puis se lever, la ref DOIT le montrer ASSIS. Si la ref le montre debout, Seedance le fait apparaitre debout des le debut (pop-in) ou ne sait pas le placer dans la scene initiale. La ref image definit l'ETAT INITIAL de la video, pas l'etat final ni le climax. Valide 2026-04-07 sur Yaa Asantewaa V3.
40. **Ref image couleurs = contrainte Seedance** : si la ref a des personnages desatures/gris, Seedance tentera de les garder desatures meme si le prompt demande "full vivid color". La ref est plus forte que le prompt pour les couleurs. Fix : generer une ref ou TOUS les personnages sont dans les couleurs voulues des le depart. Valide 2026-04-07 sur Yaa Asantewaa V3.
41. **Format camera = dependre du TYPE de scene** : ne pas choisir le format par defaut. Guide de choix :
    - **Exploration de lieu** (pas de personnage principal) → Format 4 plan-sequence. La camera EST le personnage.
    - **Action physique intense** (1 personnage, combat, force) → Format 3 SECONDS. Les coupes servent l'action.
    - **Discours / emotion / dialogue** (1 personnage parle) → Format 1 narratif ou Format 5 steadicam. Camera STABLE, lente, reste sur le sujet. PAS de plan-sequence (camera forcee a bouger = moments morts).
    - **Multi-epoques / transformations** → Format 6 scenes + slow-mo. Transitions internes.
    - **Montage rapide** → Format 7 beat sync. Coupes deliberees.
    Erreur a eviter : utiliser Format 4 (plan-sequence) pour une scene de discours — la camera doit traverser un lieu mais il n'y a pas de lieu a traverser, juste un personnage qui parle. Resultat = mouvements parasites + coupes bizarres. Valide 2026-04-07 sur Yaa Asantewaa V3.

---

## Regles de combat / bataille (extraites de tests Lat Dior Dekheule 2026-04-07)

42. **Ethnicity/peau = specifier explicitement** : Seedance ne distingue pas "French soldiers" comme blancs automatiquement. "gray-blue uniforms with kepis" produit des soldats a peau sombre. Fix : specifier "pale-skinned European officers" ou "light-complexion French soldiers" pour creer le contraste visuel voulu. Valide 2026-04-07 sur 2 tests Dekheule.
43. **Blessures = progression ou rien** : une blessure qui apparait dans un shot et disparait au suivant est plus distrayante que pas de blessure du tout. Soit tracker dans chaque shot ("blood stain on LEFT shoulder grows", "cape SHREDS further"), soit ne pas en mettre. Valide 2026-04-07 sur test Dekheule 2.
44. **Format hybride timecode+SHOT+VFX+SFX = valide pour combat** : structure `0-1.5s (Shot 1): [camera] / [action] / VFX: [effets] / SFX: [sons]` plus efficace que SHOT pur ou SECONDS pur pour scenes d'action. Les tags VFX/SFX sont traites comme instructions separees par Seedance. 10 shots x 1.5s = coupes nettes et rythmees. Valide 2026-04-07 sur 2 tests Dekheule.
45. **Ref plan large > ref close-up pour scenes d'action** : une ref en plan large (cavalerie, champ de bataille) produit un style ink-wash plus consistant et laisse Seedance libre pour les close-ups. Une ref en close-up (clash corps a corps) pousse vers le comic book/anime et contraint les angles. Valide 2026-04-07 (test 3 = ref V1 plan large = meilleur style que test 2 = ref V4 close-up).
46. **Vue aerienne concentrique = signature visuelle batailles** : demander "bird's-eye aerial" + "concentric circles" + "dust SWIRLS" produit des plans spectaculaires avec le heros au centre identifie par la couleur (cape indigo vs gris). C'est le plan le plus fort visuellement dans les 2 tests. A utiliser comme signature des scenes de bataille.
47. **Over the top = proof of concept, pas production** : "LEAPS onto cannon", "shockwave ERUPTS" = Seedance execute mais ca donne du super-hero anime, pas de l'historique credible. Pour la production, l'intensite vient de la VITESSE et des IMPACTS physiques credibles (galop, sabre sur fusil, chute), pas des superpouvoirs. Retirer les sauts impossibles et les explosions magiques.

52. **Refs separees par element = coherence entre takes (Yaroflasher)** : ne PAS donner juste 1 ref style. Generer des refs separees pour CHAQUE element cle : personnage (collage close-up + full body), lieu (vide, sans personnages), personnages secondaires (isoles), objets cles. Uploader 3-5 refs dans Seedance. Resultat : si toutes les generations ont les memes elements pre-definis, elles sont splicables entre elles. On sous-utilise les 9 slots — passer de 1 ref a 3-5. Source : Yaroflasher workflow video 2026-04-07.
53. **Collage close-up + full body en 1 image** : generer le personnage principal avec portrait epaules + corps entier cote a cote sur fond neutre. Seedance comprend le personnage a toutes les echelles et l'adapte a n'importe quel plan. Source : Yaroflasher + frame 100 de sa video.
54. **"no music" en fin de prompt** : ajouter "no words, no music" a la fin du prompt pour empecher Seedance de generer audio parasite (dialogues inventes, musique de fond). Facilite le montage — pas besoin de strip l'audio si il n'y en a pas. Source : Yaroflasher.
55. **Limite prompt = 1500 caracteres sur Flashboard, probablement plus haute sur Dreamina** : Yaroflasher mentionne une limite de 1500 chars, mais il utilise Flashboard (interface tierce API). Nos prompts Dreamina web font 1800-3600 chars et fonctionnent (Clip A = 3612 chars, score 9.5/10). Les prompts communaute (plan-sequence @ChangningL29508, etc.) depassent aussi largement 1500. La limite Dreamina est probablement plus haute. **A TESTER** : generer un prompt <1500 chars pour comparer la qualite, surtout sur les derniers shots. Si les derniers shots sont meilleurs = Dreamina tronquait silencieusement. Source : Yaroflasher (Flashboard).
56. **Duree generation = duree besoin, pas plus** : si la scene a besoin de 10s, generer 10s, PAS 15s "au cas ou". Les secondes supplementaires = risque d'erreurs et d'artefacts. Seedance produit ses meilleurs resultats quand la duree correspond au contenu demande. Source : Yaroflasher.
57. **Clip precedent comme ref video (Omni)** : dans Seedance Omni, uploader un clip d'une generation precedente comme ref video + les refs images du personnage = Seedance genere une variante dans le meme lieu/style. Technique utile pour les behind-the-scenes, variantes de plan, ou extensions de scene sans frame chaining. Source : Yaroflasher.

51. **Vue aerienne + leader = specifier la POSITION dans le V** : "king at the front" + "camera pulling up" = Seedance depasse le roi en montant, l'armee finit devant lui. Fix : "bird-eye aerial shot looking directly DOWN, the king LEADS at the FRONT TIP of the V-formation, clearly AHEAD of all other riders". Forcer la position spatiale explicitement. Ne pas utiliser "pulling up" qui inverse la perspective. Valide 2026-04-07 sur test vivid shapes Lat Dior.

48. **"FALLS forward" + slow-mo = flottement aerien** : Seedance interprete "falls forward" en slow motion comme un saut plongeant qui flotte dans les airs (2-3s aerien, comique au lieu de tragique). Fix : decrire la chute en 2 etapes physiques ("DROPS to knees, then COLLAPSES face-first into dust"). Ne JAMAIS combiner "fall" + metaphore aerienne ("spread like wings", "cape like a shroud in the air"). Les metaphores poetiques = prises au premier degre par Seedance (regle 11). Valide 2026-04-07 sur Clip B Dekheule.
49. **Canons/objets lourds = arriere-plan seulement** : Seedance ne comprend pas la geometrie spatiale des objets au premier plan. Un personnage qui "passe devant un canon" = interaction bizarre (pousse le canon, canon pointe dans la mauvaise direction). Fix : canons = arriere-plan "firing from behind the line", pas obstacle au premier plan. Si interaction directe necessaire, decrire "DUCKS under cannon blast firing TOWARD him". Valide 2026-04-07 sur Clip B Dekheule.
50. **Apres la blessure mortelle = personnage SEUL** : si des allies sont en arriere-plan apres que le heros est touche mais n'agissent pas, ca cree une dissonance (pourquoi ils ne l'aident pas?). Fix : dans les shots post-blessure, retirer les allies du frame. Le heros meurt seul face a l'ennemi. Les allies = avant la blessure uniquement. Valide 2026-04-07 sur Clip B Dekheule.

---

## Regles de workflow

21. **Sensibilite contenu variable** : refus aleatoire — relancer tel quel avant de modifier

70. **Vue laterale + deplacement horizontal en 9:16 = sortie de cadre** : un personnage en profil qui avance lateralement traverse les 720px du cadre vertical en 1-2s. Avec "camera TRACKS", Seedance suit le personnage mais regenere/despawn les elements d'arriere-plan = artefact de loop visible. **Fix** : (a) "Camera HOLDS STEADY, fixed position, no movement", (b) "The character STAYS CENTERED in the frame at all times", (c) le personnage fait le mouvement sur place sans traverser le cadre. Valide 2026-04-18 sur Soundjata Acte II crawl (3 tentatives).

71. **"slowly" et synonymes = quasi-statique** : confirme a nouveau 2026-04-18. "He moves slowly" = micro-mouvements a peine visibles sur 5s. Utiliser "steadily" pour un rythme neutre. Jamais "slowly", "gently", "softly" sauf intention explicite de scene figee.

---

## Regles de transition (Format 6)

26. **Rotation personnage = decrire le mouvement physique** : "slowly turns his back to the camera" — sans precision, Seedance fait un morphing snap au lieu d'une rotation naturelle. TOUJOURS decrire comment le personnage change d'orientation. Confirme sur test Abou Bakari 3 epoques (2026-04-04).
27. **Extensions video (V2V) = verbes dynamiques obligatoires** : "SURGES forward", "CRASHES against", "STRAIN under wind" — sans ca, les extensions sont statiques. Aussi : 15s > 10s, et 1 seul changement majeur (camera OU atmosphere, pas les deux). Mieux pour continuer une ambiance que pour raconter une nouvelle scene — utiliser Format 6 pour ca.

---

## Anti-instructions (dire ce qu'on ne veut PAS)

- **"no unnecessary 360-degree turns"** : empeche Seedance d'ajouter des rotations parasites
- **"without motion distortion"** : force des mouvements physiquement corrects
- **"without abrupt changes"** : transitions douces obligatoires
- **"no unnecessary spins"** : idem rotations
- **"the human body structure is normal"** : empeche les distorsions anatomiques
- Source : @liyue_ai — les anti-instructions ont contribue a la proprete exceptionnelle des 4 transitions de saison

---

## Regles API fal.ai & Video Extend/Chaining (tests 2026-04-09)

58. **Seedance 2.0 API dispo sur fal.ai** : 3 endpoints — `bytedance/seedance-2.0/text-to-video`, `bytedance/seedance-2.0/image-to-video` (first/last frame via `end_image_url`), `bytedance/seedance-2.0/reference-to-video` (Omni : 9 images + 3 videos + 3 audios). Prix documente $0.30/s — **OBSOLETE**. Prix reel observe 2026-04-26 sur fal.ai dashboard : **~$0.683/s (V2 i2v)**. Grille reelle : 10s=$6.83, 9s=$6.15, 7s=$4.78, 6s=$4.10, 5s=$3.42. Video Extend (reference-to-video) : ~$0.18/s (0.6x discount confirme). Content policy violation audio = $0.00 facture (confirme 2026-04-26). Atlas Cloud API ($0.10/s) existe mais **ignore les refs images** — inutilisable pour notre pipeline. Volcengine officiel ($0.14/s) inaccessible (KYC chinois). **fal.ai = seul provider API fiable pour multi-ref.** Valide 2026-04-09/10, pricing corrige 2026-04-26.

59. **Reference-to-Video (Seedance 2.0 Omni) : limites officielles (corrige 2026-04-13)** :
    - Output : 4 a 15s au choix (parametre `duration`, string "4" a "15", par pas de 1 seconde — on peut choisir 14s, pas besoin de "palier" fixe)
    - Input videos : TOTAL CUMULE des videos refs <= 15s (pas input+output)
    - Poids max : 50 MB cumules
    - Jusqu'a 3 videos (@video1/2/3) + 9 images (@image1-9) + 3 audios (@audio1-3), total 12 fichiers
    - Syntaxe role-based dans le prompt : "@video1 for camera path", "@image1 for character face"
    - La doc officielle N'EXPLIQUE PAS comment Seedance fond plusieurs videos ensemble — a tester
    - Recommandation officielle Vicsee : commencer avec 1 seule video ref, "complex choreography almost always produces incoherent motion"
    - Ancienne regle "input+output max 15s" erronee (basee sur erreur fal.ai specifique a v1, pas 2.0 Omni)
    - Sources : glbgpt.com/hub/seedance-2-0-omni-reference, vicsee.com/blog/seedance-2-0-omni-reference

60. **Biais "reverse" sur objets tombes/couches** : Seedance interprete systematiquement un objet au sol (arbre, structure) comme quelque chose a remettre debout. Teste 3 fois (2x Dreamina, 1x API) avec le baobab Soundjata = 3x l'arbre se releve avant de retomber. Ce n'est ni le mode ni la plateforme — c'est un biais du modele. Fix potentiel : (a) ne pas commencer a partir d'un etat "objet au sol", (b) commencer plus tot dans l'action (avant la chute), (c) tester avec un sujet sans objet inversable.

61. **First/Last frame = transitions visuelles, PAS storytelling** : le mode first/last frame interpole visuellement entre 2 images sans comprendre la causalite narrative. Fonctionne pour : transitions de style, transformations purement visuelles, A->B esthetiques. Ne fonctionne PAS pour : histoires ou l'action doit avoir un sens logique. Teste 2x sur Dreamina. Le chemin A->B peut etre absurde si les deux images sont visuellement proches.

62. **Reference-to-Video avec prompt directif > First/Last frame** : quand on fournit une video ref + un prompt SECONDS detaille, Seedance suit le prompt beaucoup mieux que le mode first/last frame. Les secondes 3-10s sont generalement bonnes, mais les 0-3s initiales peuvent encore avoir des artefacts de transition. Cout reel du test : ~$3.10 pour 10s (720p). Valide 2026-04-09.

63. **Contraste visuel maximal entre images = meilleur interpolation** : dans les tests first/last frame, le test 2 (vue aerienne -> close-up low angle) a produit un meilleur resultat que le test 1 (vue aerienne -> vue wide similaire). Plus les images A et B sont visuellement differentes, plus Seedance a un chemin clair entre les deux. Valide 2026-04-09.

64. **Foules/groupes = specifier diversite explicitement** : Seedance clone les visages par defaut quand le prompt dit juste "children" ou "crowd". Toujours specifier "VARIED ages, genders, body types, and facial features — no two faces alike". Sans cette precision, les visages sont identiques et cassent l'immersion. Confirme par Aziz sur test griot (10 avril 2026).

65. **COLOR GRADE uniforme sur tout le clip** : ne pas decrire des palettes differentes par segment SECONDS. Seedance interprete les changements de palette comme des transitions abruptes de couleur. Si le ciel doit changer (ex: gris orageux -> indigo), decrire la progression DANS le segment SECONDS ("sky gradually deepens from storm grey to indigo") plutot que dans le COLOR GRADE final. Confirme sur test Lat Dior (10 avril 2026).

66. **fal.ai content policy : videos uploadees = filtre strict** : le filtre de moderation fal.ai flag les videos uploadees comme "likenesses of real people" meme si le contenu est en style BD/illustration. Les images de reference passent sans probleme. Pour le chaining via API, utiliser la derniere FRAME (image) plutot que les dernieres secondes (video) comme ref. Confirme sur test chaining Soundjata (10 avril 2026). NOTE 2026-04-24 : l'endpoint `bytedance/seedance-2.0/reference-to-video` EXISTE bien sur fal.ai (doc confirmee). Le 404 precedent venait d'un mauvais format d'endpoint dans le script agent. Format correct : `fal-ai/bytedance/seedance-2.0/reference-to-video` (avec prefix `fal-ai/`). Supporte jusqu'a 9 images + 3 video clips + 3 audio. Cout : $0.1814/s (0.6x discount quand video en input). A retester.

67. **API fal.ai : 1 ref Gemini par clip = la bonne approche** : ne pas envoyer de "styleref" separee montrant une autre scene. Seedance traite TOUTE image comme un element a animer, meme taguee "@Image2 is the style reference" dans le prompt. Le style doit etre porte par la ref de scene elle-meme (generee via Gemini dans le bon style). Confirme : 2 images = scene parasite inseree (test 1c). 1 image = scene correcte (test 1d). Valide 2026-04-10.

68. **Scenes calmes/contemplatives = peu de mouvement** : Seedance excelle dans l'action (charges, combats, collisions) mais produit des clips quasi-statiques pour les scenes calmes (marche, exil, contemplation). Les mouvements de camera (DOLLIES, aerial) et les micro-actions (tourne la tete, main sur l'epaule) sont ignores quand la scene est inheremment calme. Options : (a) dynamiser la scene dans le prompt (tempete, obstacles), (b) accepter le clip statique et l'utiliser comme plan pose dans Remotion (zoom lent + voix-off), (c) utiliser Kling pour ces scenes. Valide 2026-04-10 sur test exil Soundjata.

69. **Le tagging d'images ne fonctionne PAS — ni API ni Dreamina** : Seedance ne fait pas la distinction entre "reference de style" et "scene a animer", peu importe comment on tague l'image (texte dans le prompt ou boutons Dreamina web). Teste sur Dreamina (palais Abou Bakari anime au lieu de reference) et sur API fal.ai (styleref animee). Seule solution : chaque image doit montrer un element CONCRET de la scene a generer. Valide 2026-04-10.

70. **Dreamina web = meme modele Seedance 2.0 que API fal.ai** : la difference de qualite entre Dreamina web et API fal.ai vient du PROMPT, pas de la plateforme. Les deux utilisent le meme generateur video. Prouve par Soundjata Acte IV Clip 1 : meme storyboard + refs, prompt minimaliste via API = rejete 2x, prompt detaille via Dreamina web = valide 1er coup. La plateforme n'est pas le facteur. Valide 2026-04-16.

71. **Dreamina web : filigrane "AI" en haut a gauche** : Dreamina ajoute un petit logo "AI" semi-transparent dans le coin superieur gauche des clips generes via l'interface web. L'API fal.ai ne l'ajoute PAS. Remedy : crop 50px du haut avec ffmpeg (`-vf "crop=w:h-50:0:50"`). Perte de contenu negligeable (un peu de ciel). Valide 2026-04-16.

72. **Dreamina web : limite 4000 caracteres prompt** : impose par l'interface. Recommande aussi pour API fal.ai (meme modele, probablement meme traitement interne). Les prompts >4000 chars semblent etre tronques ou ignores en fin. Sweet spot valide : 3500-3900 chars pour un prompt detaille shot-by-shot de 4 shots. Valide 2026-04-16.

73. **Eviter "slowly/slow/gentle" dans les prompts** : ces mots invitent Seedance au quasi-statique (renforce le biais regle 68). Remplacer par des verbes actifs : "Camera PUSHES IN slowly" → "Camera TIGHTENS on". "slow zoom" → "PULLS BACK to reveal". "gently moves" → "SHIFTS toward". Valide 2026-04-16 nuit (Soundjata Trou A, feedback Aziz).

74. **Technique freeze derniere frame** pour combler gap narration > duree clip : quand la narration depasse la duree du clip de <1.5s, prolonger la video avec un freeze de la derniere frame via ffmpeg (`tpad=stop=-1:stop_mode=clone:stop_duration=X`). Fonctionne bien narrativement quand la derniere image est un beat dramatique (supplication, regard, pose). Au-dela de 1.5s de freeze, ca devient visible — preferer regenerer avec duree plus longue. Valide 2026-04-16.

---

## Regles image-to-video et style fidelity (tests paper-craft 2026-04-18)

75. **Image-to-video >> reference-to-video pour fidelite de style** : reference-to-video traite l'image comme une "inspiration" et recree la scene dans le style par defaut de Seedance (cartoon). Image-to-video utilise l'image comme FRAME 0 et l'anime — style, palette, proportions preserves. Pour tout style non-standard (paper-craft, enluminure, etc.), TOUJOURS utiliser image-to-video. Valide 2026-04-18 (reference-to-video = echec 0/1, image-to-video = succes 5/5).

76. **Clause STRICT STYLE FIDELITY obligatoire pour styles non-standard** : ajouter en tete de prompt : "Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style [...]. Do NOT add detail or realism." Sans cette clause, meme image-to-video peut deriver. Avec la clause, 5/5 succes. Valide 2026-04-18.

77. **Crane up = Seedance confond mouvement camera et mouvement personnage** : "Camera CRANES UP following his rise" = Seedance fait MONTER le personnage dans les airs au lieu de changer l'ANGLE de la camera. Le personnage flotte. Fix : separer explicitement : "Camera TILTS UP from ground level to eye level. The boy STAYS on the ground — only the camera ANGLE changes, NOT the boy's position." Valide 2026-04-18.

78. **Orbite 180 = meilleur mouvement camera en paper-craft** : "Camera ORBITS around the boy in a 180-degree arc" produit un effet pseudo-3D remarquable — le flat 2D gagne en volume pendant la rotation, comme un diorama. Personnage reste 100% coherent. Valide 2026-04-18 (score 9.5/10).

79. **Dolly in = fonctionne proprement en paper-craft** : "Camera PUSHES IN steadily toward" execute un zoom continu sans artefact. Le style flat reste stable pendant le rapprochement. Valide 2026-04-18 (score 9/10).

80. **Deformation d'objets rigides = Seedance ne sait pas faire** : "the iron bar BENDS under his grip" = la barre reste droite. Confirme la faiblesse F5 (objets rigides). Teste 3x sur paper-craft, 0/3 deformation. Fix : (a) 2 images start/end frame avec l'objet dans les 2 etats, (b) post-prod Remotion overlay SVG anime. Valide 2026-04-18.

81. **Prompt doit decrire l'IMAGE, pas le sujet** : quand on utilise image-to-video, le prompt doit decrire les mouvements des elements VISIBLES dans l'image source, pas une scene inventee basee sur la connaissance du sujet. Erreur couteuse : avoir l'image du village et ecrire un prompt sur la barre de fer (absente de l'image). Regle : lister ce qu'on VOIT dans l'image avant d'ecrire le prompt. Valide 2026-04-18 (erreur attrapee par Aziz avant generation).

82. **Identifier les personnages par vetements+position, pas par attributs vagues** : "the tall woman" = ambigu. "The woman in the elaborate patterned headwrap on the LEFT foreground" = sans ambiguite. Valide 2026-04-18.

83. **Reference-to-video = ECHEC en paper-craft (0/2)** : meme avec image style + video choregraphie + clause "@video1 for choreography ONLY, @image1 for style", Seedance ignore les deux — produit un style different et une action inventee. Ne PAS utiliser reference-to-video pour paper-craft. Alternative validee : start/end frame + prompt dirigiste (regle 85). Valide 2026-04-18.

84. **Start/end frame = parametre `end_image_url` fonctionne sur fal.ai** : l'endpoint `bytedance/seedance-2.0/image-to-video` accepte `end_image_url` en plus de `image_url`. Seedance interpole entre les deux poses tout en suivant le prompt. Les deux frames DOIVENT etre visuellement coherentes (memes personnages, memes vetements — generer END via edition chirurgicale du START). Valide 2026-04-18.

85. **Combat paper-craft = start/end frame + prompt Format 3 SECONDS** : workflow valide pour scenes de combat dynamiques en paper-craft. (1) Generer START frame pose neutre (sol propre, zero effets), (2) generer END frame via Gemini chirurgical du START (pose finale, zero trainee de mouvement), (3) Seedance i2v avec les deux + prompt shot-by-shot SECONDS X TO Y decrivant la choregraphie. Resultat : combat dynamique 8s, style 100% maintenu, choregraphie respectee. Cout ~$2.40/8s. Valide 2026-04-18.

86. **Storyboard-to-video (reference-to-video) = ECHEC en paper-craft (0/3)** : confirme 2026-04-19. Meme avec storyboard EN style paper-craft + char refs paper-craft + env plate paper-craft, le mode reference-to-video produit un style low-poly/flat-3D par defaut. Il ignore TOUTES les refs stylistiques. Ce mode fonctionne en BD flat mais PAS en paper-craft. Alternative validee pour scenes narratives multi-shots : decouper en 3 clips image-to-video de 5s + assembler en Remotion. Valide 2026-04-19 (Thiaroye Scene 1). : "the tall woman" = ambigu, pourrait etre n'importe quelle femme. "The woman in the elaborate patterned headwrap on the LEFT foreground" = sans ambiguite. Toujours identifier par : vetement distinctif + position dans le cadre. Valide 2026-04-18 (feedback Aziz sur scene dialogue).

87. **Tracking lateral camera longue duree (13s) paper-craft = ECHEC (regeneration d'arriere-plan + recomposition scene)** : valide 2026-04-23 sur Thiaroye S1 v2. Demander a Seedance i2v un glide lateral continu sur 13s avec parallax produit : (a) direction camera inversee ou instable, (b) background regenere silhouette par silhouette — phare de Dakar change de position dans le cadre, nouveaux batiments industriels apparaissent, cheminees d'usine se multiplient, la skyline "invente" ce qui sort du cadre source, (c) les personnages principaux disparaissent et sont remplaces par d'autres (nouveau tirailleur bras croises apparait, le fumeur perd sa cigarette, le central perd son beret), (d) perte de compte : 3 tirailleurs au frame 0 -> 2 + fragments a 10s. **La regle 70 (vue laterale = sortie de cadre) s'applique AUSSI quand c'est la CAMERA qui glide**, pas seulement quand c'est le personnage qui marche. Seedance ne sait pas maintenir un backdrop coherent sur un pan lateral long de plus de ~3-4s — il "invente" le hors-champ au lieu de traduire geometriquement le pan. **Alternatives validees pour mouvement camera en paper-craft** : (a) plans courts 3-5s avec mouvement local (subtle drift, micro-dolly), (b) mouvement camera vertical (tilt down/up) moins couteux en regeneration que lateral, (c) orbite ou dolly-in (regles 78/79 = scores 9/10 et 9.5/10), (d) pan/zoom Remotion sur image Gemini fixe (zero risque de regeneration, parallax controle a la main via couches), (e) assemblage en post-prod de 2-3 plans serres distincts plutot que 1 plan long avec tracking. Cout du test : $3.90. Echec franc.

88. **INTERDIT : retirer beret/chechia/casque/couvre-chef** : valide 2026-04-24 sur Thiaroye S1 V5. Quand le prompt contient "takes off beret", "lifts his cap", "removes hat", ou toute variante ou un personnage ENLEVE son couvre-chef — Seedance ne sait pas quoi dessiner a la place et produit un artefact noir-tache sur la tete (simulant cheveux rases mal rendus ou halo d'ombre aberrant). **Regle** : le couvre-chef RESTE EN PLACE pendant tout le clip. Autorise : "adjusts beret" (micro-pression), "touches brim" (doigts pres du bord), "tilts head under beret" (mouvement de tete, pas de beret). Interdit : "lifts", "removes", "takes off", "pulls off", "sets aside", "holds in hand" (si retire). Alternative narrative pour exprimer "retour au pays" : faire parler les regards, les epaules, les mains — pas la tete. Valide 2026-04-24.

---

## Regles de dynamisme (extraites de @drjoetw)

- **Verbes explosifs = animation rapide** : "BURSTS", "LAUNCHES", "SLICING", "SNAP" — densifier les verbes d'action pour scenes rapides
- **MAJUSCULES = intensite** : "SNAP ZOOMS", "BOOM", "EXTREME" — Seedance interprete comme pics d'energie
- **Sound cues = rythme visuel** : "Sound: knock... knock...", "silence", "BOOM" — indications sonores dans le prompt influencent le tempo
- **Descriptions d'impact** : "fabric compressing inward", "shockwave ripple" — descriptions physiques detaillees = meilleurs VFX

89. **Video Extend (reference-to-video) = VALIDE pour continuation de scene paper-craft** : confirme 2026-04-24 sur Thiaroye V5 Scene 1 complement. Endpoint : `bytedance/seedance-2.0/reference-to-video` (sans prefix fal-ai/). Regles critiques : (1) citer la video dans le prompt avec [Video1], (2) `generate_audio: False` obligatoire — l'audio genere depuis video externe declenche `partner_validation_failed` systematiquement, (3) le prompt doit decrire la CONTINUATION (pas re-decrire ce qui est deja dans la video source). Resultat : style paper-craft 100% preserve, personnages identiques, decor coherent, continuité narrative reelle. Cout : $0.1814/s (0.6x discount vs i2v). Use case ideal : clips complement, transitions entre deux moments de la meme scene, eviter regeneration Gemini. Ne pas utiliser pour scene entierement nouvelle (utiliser i2v classique). Valide par Aziz 2026-04-24.

90. **Particules parasites (dust motes, floating particles, white dots drifting) — RISQUE A POINTER, pas a banner systematiquement** : Seedance reintroduit des particules par defaut dans les scenes contemplatives ou statiques, meme si le prompt ne les demande pas. Elles peuvent etre voulues (ex: dust motes dans light beam = atmosphere) ou parasites (ex: white dots aleatoires sur scene paper-craft = drift photoreal). **Regle** : Claude (ou l'agent) DOIT pointer la presence/absence de "NO dust motes / NO floating particles / NO white dots drifting" lors de la review d'un prompt Seedance, AVANT generation. Decision banner ou autoriser revient a Aziz scene par scene. Bannir explicitement quand : palette froide/sobre, scene statique recueillement, pas de light beam ou source de poussiere narrative. Autoriser quand : light beam atmospherique, scene d'archives/cave, ambiance contemplative valorisant la matiere atmospherique. Valide 2026-04-25 (Thiaroye V5 production manuelle Aziz).

91. **OTS Reveal via Video Extend = mouvement camera VALIDE et puissant** : confirme 2026-04-25 sur Thiaroye V5 Scene 2 extend. Quand le clip source contient un personnage en silhouette OTS (Over-The-Shoulder), Seedance reference-to-video peut faire glisser la camera vers le contre-champ pour reveler le visage cache. **Comportement observe** : Seedance interprete cette consigne par un travelling-cut (camera passe d'un plan moyen a un close-up du personnage revele, les autres sortent du cadre) plutot qu'une orbite litterale. **Editorialement c'est superieur** : la sortie des autres personnages du cadre cree une subjectivite narrative implicite (le spectateur adopte leur regard sur le personnage revele). **Conditions de succes** : (1) source video doit contenir la silhouette OTS comme ancre, (2) si difference morphologique entre personnages (officier blanc / tirailleurs noirs), formuler la contrainte 3 fois dans le prompt, (3) accepter legere derive BD au close-up (cree asymetrie morale visible), (4) duree ideale 5s. **Cout** : $0.91 pour 5s (Video Extend = 0.6x discount vs i2v). Documente complet dans `camera-movements.md` section "OTS Reveal via Video Extend". Valide par Aziz 2026-04-25.

92. **Video Extend > regen first-frame/last-frame pour etendre une scene** : insight strategique 2026-04-25 (Aziz post-production manuelle Thiaroye V5). Pour etendre une scene de N secondes a N+5 secondes, prefere Video Extend (`reference-to-video`) a la generation d'une nouvelle image de continuation. Avantages : (1) coherence stylistique 100% preservee (pas de drift entre deux clips i2v independants), (2) pas de regen Gemini d'image intermediaire, (3) cout $0.1814/s (0.6x discount vs i2v classique a $0.30/s), (4) Seedance suit les prompts de continuation avec fidelite (R-VIVANT-PARTOUT respectee, micro-expressions executees). **Implication dashboard** : pour chaque scene depassant 10s, considerer en option "clip principal X secondes + Video Extend Ys" plutot que scinder en 2 clips i2v independants. Valide Thiaroye S2 et S4A 2026-04-25.

94. **R-DIRECTION-NARRATIVE — personnage qui s'eloigne = VU DE DOS dans l'image source** : si le script dit qu'un personnage "part", "s'en va", "marche vers X" (navire, horizon, ville), l'image source Gemini DOIT le montrer de dos ou de profil marchant vers sa destination. Un personnage face camera contredit la logique narrative (il semblerait revenir, pas partir). Claude DOIT detecter cette contrainte automatiquement en lisant le script AVANT de valider l'image source. Signal de danger : personnage de face dans une scene de depart. Correction : regener l'image avec consigne "CHARACTER walking AWAY from camera, seen from BEHIND, facing [destination]". Valide 2026-04-26, Abou Bakari II scene "depart" (Aziz a detecte que le personnage marchait vers la camera au lieu de s'eloigner vers son navire).

93. **R-DOT-EYES-SAFE-VERBS — INTERDIT sur projets dot-eyes : "eyes WIDE", "wide-eyed", "eyes widened", "eyes dilated", "eyes wide open"** : Seedance interprete ces instructions en agrandissant litteralement les yeux du personnage, quittant le style dot-eyes stylise pour un rendu quasi-realiste. Resultat : personnage avec grands yeux expressifs incompatibles avec le style paper-craft GeoAfrique. **Regle** : exprimer l'intensite emotionnelle UNIQUEMENT via verbes corporels (RECOILS, STAGGERS, BRACES, SHOUTS — mouth OPEN, STIFFENS, CLUTCHES, body TENSES). **Exception documentee** : gros plan d'action/terreur (ex: capitaine fleet-b) — les yeux expressifs sont acceptables car le contexte est l'intensite narrative, pas le portrait contemplatif (R-REVIEW-NARRATIF). La regle vise les personnages en plan moyen/large et les scenes contemplatives. Valide 2026-04-26, Abou Bakari II scene obsession-v1 (Aziz a detecte le drift apres review).
