# Seedance 2.0 — Regles de Prompt
> 63 regles + anti-patterns. Consulter AVANT d'ecrire un prompt Seedance.
> Mise a jour : 2026-04-09

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

58. **Seedance 2.0 API dispo sur fal.ai** : 3 endpoints — `bytedance/seedance-2.0/text-to-video`, `bytedance/seedance-2.0/image-to-video` (first/last frame via `end_image_url`), `bytedance/seedance-2.0/reference-to-video` (Omni : 9 images + 3 videos + 3 audios). Prix : $0.30/s standard, $0.24/s fast, $0.18/s avec video ref. Atlas Cloud API ($0.10/s) existe mais **ignore les refs images** — inutilisable pour notre pipeline. Atlas Cloud playground ($0.216/s) fonctionne mais prix ~= fal.ai et pas automatisable. Volcengine officiel ($0.14/s) inaccessible (KYC chinois). **fal.ai = seul provider API fiable pour multi-ref.** Valide 2026-04-09/10.

59. **Reference-to-Video (Seedance 2.0 Omni) : limites officielles (corrige 2026-04-13)** :
    - Output : 4 a 15s au choix (parametre `duration`)
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

66. **fal.ai content policy : videos uploadees = filtre strict** : le filtre de moderation fal.ai flag les videos uploadees comme "likenesses of real people" meme si le contenu est en style BD/illustration. Les images de reference passent sans probleme. Pour le chaining via API, utiliser la derniere FRAME (image) plutot que les dernieres secondes (video) comme ref. Confirme sur test chaining Soundjata (10 avril 2026).

67. **API fal.ai : 1 ref Gemini par clip = la bonne approche** : ne pas envoyer de "styleref" separee montrant une autre scene. Seedance traite TOUTE image comme un element a animer, meme taguee "@Image2 is the style reference" dans le prompt. Le style doit etre porte par la ref de scene elle-meme (generee via Gemini dans le bon style). Confirme : 2 images = scene parasite inseree (test 1c). 1 image = scene correcte (test 1d). Valide 2026-04-10.

68. **Scenes calmes/contemplatives = peu de mouvement** : Seedance excelle dans l'action (charges, combats, collisions) mais produit des clips quasi-statiques pour les scenes calmes (marche, exil, contemplation). Les mouvements de camera (DOLLIES, aerial) et les micro-actions (tourne la tete, main sur l'epaule) sont ignores quand la scene est inheremment calme. Options : (a) dynamiser la scene dans le prompt (tempete, obstacles), (b) accepter le clip statique et l'utiliser comme plan pose dans Remotion (zoom lent + voix-off), (c) utiliser Kling pour ces scenes. Valide 2026-04-10 sur test exil Soundjata.

69. **Le tagging d'images ne fonctionne PAS — ni API ni Dreamina** : Seedance ne fait pas la distinction entre "reference de style" et "scene a animer", peu importe comment on tague l'image (texte dans le prompt ou boutons Dreamina web). Teste sur Dreamina (palais Abou Bakari anime au lieu de reference) et sur API fal.ai (styleref animee). Seule solution : chaque image doit montrer un element CONCRET de la scene a generer. Valide 2026-04-10.

---

## Regles de dynamisme (extraites de @drjoetw)

- **Verbes explosifs = animation rapide** : "BURSTS", "LAUNCHES", "SLICING", "SNAP" — densifier les verbes d'action pour scenes rapides
- **MAJUSCULES = intensite** : "SNAP ZOOMS", "BOOM", "EXTREME" — Seedance interprete comme pics d'energie
- **Sound cues = rythme visuel** : "Sound: knock... knock...", "silence", "BOOM" — indications sonores dans le prompt influencent le tempo
- **Descriptions d'impact** : "fabric compressing inward", "shockwave ripple" — descriptions physiques detaillees = meilleurs VFX
