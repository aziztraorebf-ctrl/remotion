# STORYBOARD / BRIEF CRÉATIF — fiche de déclenchement (lire AVANT d'écrire un brief ou de coder une scène)
> **49 % de tout le code du projet est du RE-TRAVAIL** (audit 2026-08-17). Schéma dominant : coder toute une
> partie → découvrir le bon modèle → tout refondre. Cas mesuré : `Partie2Blocage.tsx`, **13 retouches en une
> journée**, commit « refonte premium complète sur modèle 2.4 validé » — le modèle validé est arrivé APRÈS le code.
> Le storyboard déplace le jugement de goût d'APRÈS le code (cher) vers AVANT le code (gratuit).
> ⚠️ Si ce que tu lis ici ne correspond PAS au réel sous tes yeux : **c'est la fiche qui a tort**. Corrige-la.
> Dernière vérification des chemins : 2026-08-17.

## L'ORDRE — ne jamais l'inverser
⚠️ **AVANT l'intention de scène, il y a la FORME NARRATIVE de la vidéo** (non déclarée = héritée par
défaut = documentaire explicatif). Chaîne : **SUJET → FORME NARRATIVE → script → intention de scène →
forme visuelle → MOTEUR → code**. 7 formes, **UNE SEULE par vidéo**. Gate `.claude/hooks/forme-narrative-gate.sh`
(**bloque en exit 2** un nouveau fichier de script sans ligne `FORME:`). Doctrine : `memory/doctrines/FORMES-NARRATIVES.md`.
⚠️ *Statut : gate ACTIF, coût pas encore mesuré (doctrine du 2026-08-17). Inscrit ici parce qu'un gate
bloquant sans fiche qui prévienne est précisément le mode d'échec que ce système corrige — à requalifier
en « règle payée » au premier blocage réel.*
**INTENTION (1 verbe : ce qu'on veut faire RESSENTIR) → FORME (le geste visuel) → ⛔MOTEUR → TEMPLATE.**
Partir du catalogue = le piège des ~10 essais (`memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md`). Le catalogue
(`src/projects/_shared/INTENTION-FORME-INDEX.md`) s'ouvre APRÈS l'intention, comme question binaire
« a-t-on déjà cette forme ? ». ⛔ **Lire les listes jusqu'au bout** : 3 agents sur 3 ont manqué la 5e entrée
d'une liste de 5.

⛔⛔ **L'étape MOTEUR ne se saute pas.** 6 registres : carte Mapbox · géométrie D3 · objet/métaphore SVG ·
acteur stick-figure · matière filmée H3 · **LE RACCORD/montage — on a le droit de QUITTER la carte, couper,
alterner**. Amplitude prouvée de chacun + les 8 trous : `memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md`.
Coût de l'avoir sauté (2026-08-15, Gazoduc 4B) : storyboard entièrement en flèches/tracés — pas par manque
d'idées des modèles, mais parce que **le brief n'ouvrait aucune autre porte**. Un moteur absent du brief est
un moteur que le modèle ne proposera jamais. Gate : `.claude/hooks/moteur-visuel-gate.sh`.

## CADRER UN BRIEF — les 4 leviers
> Preuve : même beat, même modèle, 3 briefs. v1 → 6 panneaux de flèches. v2 → concepts **infaisables** (3D,
> perspective). v3 → 3 concepts originaux ET codables. Le modèle n'a pas changé, le brief si.
1. ⛔ **Ne JAMAIS écrire les concepts soi-même.** v1 contenait « OPTION A / OPTION B » rédigées par nous → les
   2 modèles ont **illustré** nos idées. Demander : *« propose 3 concepts DISTINCTS, dis lequel tu défends »*.
2. ⭐ **Montrer le MATÉRIAU réel, pas le nommer.** Dire « SVG » laisse imaginer de la 3D. Joindre une image
   DOUBLE : (A) frame de notre carte + (B) **frame d'un insert SVG de production réel**. Coût du manque :
   un mécanisme à biseaux métalliques auto-évalué « 100 % codable » — faux, repris sans vérifier.
   ⛔ Une note de faisabilité écrite par le modèle n'est PAS une faisabilité. Lister les interdits de matière.
3. ⭐⭐ **« Nomme LE geste unique par panneau »** (« le territoire se remplit », « le contour se déforme en
   barre »). *« Si un panneau demande trois gestes, il est trop cher : simplifie-le. »* Le coût devient visible
   sans demander au modèle de s'auto-évaluer — il se trompe systématiquement, dans le sens optimiste.
4. ⛔ **Contraindre le MATÉRIAU, jamais l'AMBITION.** Ne pas dire « fais simple » (→ images plates).
   **GUIDER SANS BRIDER** : exigence + arsenal (« voici ce qu'on sait faire, VA PLUS LOIN ») + interdits —
   jamais une checklist de techniques. Prouvé : les agents ont dépassé l'arsenal au lieu de le cocher.
⭐ La **frame de référence dicte la COMPOSITION**, pas que le style : joindre un insert composé → 6 panneaux
d'inserts. Poser un plafond chiffré (« AT MOST ONE composed insert in this ENTIRE beat »).
Gabarit prouvé : `memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/4B/PROMPT-storyboard-4B-v3.txt`.

## LA BOUCLE FERMÉE
`storyboard (N modèles concurrents)` → **validation Aziz** → `breakdown JSON` → `CODE` → **3e appel COMPARATIF**
→ corrections. Le code est le PREMIER BROUILLON, pas la fin. Gain mesuré (4A) : 13 écarts dont 6 majeurs,
activité visuelle 5,75 % → 10,28 % de pixels modifiés.
Recette : 5-6 frames aux ÉTATS du storyboard → planche 2×3 → image A/B verticale (cible en haut, rendu en bas)
→ `scripts/tools/openrouter-vision-breakdown.py --model openai/gpt-5.5`. Gabarit à copier tel quel :
`memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/PROMPT-comparatif-rendu-vs-storyboard.txt`.
3 règles payées : (1) déclarer le HORS-SCOPE (« the base map is FIXED and untouchable ») sinon il critique le
fond de carte ; (2) exiger des NOMBRES (*« not "make it more vivid" but the actual values to type »*) ;
(3) ⛔⛔ **vérifier chaque gap contre nos décisions** — sur 4A, un gap HIGH proposait de faire passer l'AAGP
par le Sahara alors qu'il **est** côtier : erreur factuelle + cohérence de série cassée. Un gap plausible ≠ vrai.
⭐ Après tout appel comparatif, TOUJOURS proposer le 2e appel génératif (« comment on corrige, avec notre
arsenal ? ») — c'est lui qui produit la valeur actionnable (`memory/doctrines/DA-BRIEF-GATE.md` § PATTERN 2 APPELS).

## ⛔⛔ LA MÉTHODE STORYBOARD — VERSION EN VIGUEUR (2026-08-18, décision d'Aziz)

> Remplace la méthode « 2 temps » (conception texte puis dessin) du 2026-08-17. Celle-ci avait été
> adoptée parce qu'on croyait que seuls GPT et Gemini dessinaient. **Faux** : Grok dessine aussi
> (`grok-imagine-image-2.0`). Avec 3 dessinateurs, l'étape texte devient un détour coûteux.

### 1. ⛔ AUDIT DU BRIEF — OBLIGATOIRE AVANT TOUT ENVOI
**Faire relire le brief par un modèle tiers** (`openai/gpt-5.5` via OpenRouter) avec une seule
consigne : *« détecte tout ce qui souffle une réponse »*. Puis corriger.
⭐ **Payé cher le 2026-08-18** : mon brief contenait `trench` dans une liste d'exemples,
`it has started digging` comme cœur dramatique, `underground` comme piste — **3 modèles sur 4 ont
proposé une tranchée**. Je croyais poser une question ouverte ; je leur avais soufflé la réponse.
Le concept a été codé, rendu, puis jeté par Aziz : *« on n'en parle pas dans la vidéo, ça complique
les choses pour rien »*.
⚠️ Le gate `moteur-visuel-gate.sh` n'attrape PAS ce biais-là : il cherche des concepts pré-écrits
(« OPTION A / OPTION B »), pas un **vocabulaire** glissé dans les exemples. D'où l'audit humain+LLM.
Biais que l'audit a trouvés et que je n'avais pas vus :
 - citer le CONTENU des actes qui marchent (« l'Acte 5 est une coupe de conduite avec deux vannes »)
   = souffler l'objet technique ;
 - décrire le défaut actuel en image (« une ligne qui se dessine ») = souffler l'image, même en négatif ;
 - sanctuariser l'existant (« validé, à garder ») = le rendre obligatoire de fait ;
 - un mot en CAPITALES dans le contexte (« VIRTUAL ») = orienter vers un registre.

### 2. UN SEUL APPEL PAR MODÈLE, 3 MODÈLES, 2 CONCEPTS PAR PLANCHE
| Modèle | Endpoint | Note |
|---|---|---|
| `grok-imagine-image-2.0` | `/v1/images/generations` (xAI) | ⭐ le meilleur sur planche annotée, 0,04 $ |
| GPT-image via fal.ai | `fal-ai/gpt-image-1/text-to-image` | matière plus riche, cadrage moins fiable |
| `gemini-3.1-flash-image-preview` | Google | ⛔ exige le tail anti-prose (voir § plus bas) |
⛔ **Kimi est SORTI de la chaîne storyboard** : il ne génère pas d'images. Il reste excellent en
conception texte pure si on a besoin d'un avis écrit, mais il n'a plus sa place ici.

**2 concepts par planche, pas 3.** 3 concepts × 3 modèles = 9 planches et 12 cases par planche :
chaque case tombe sous 400 px et redevient illisible (`1 image = 1 concept` plus bas). 2 × 3 = 6
propositions, 8 cases lisibles, arbitrage encore humainement tenable.

### 3. LE MODÈLE NE RÉDIGE PAS — IL POSE UN REPÈRE
Ne JAMAIS lui demander son analyse écrite dans l'image (c'est ce qui produit « Lee routes croisées »,
« CONCEEPT », les vignettes à 120 px). À la place :
> *« Mark the concept you would defend with a thin bright border around its row. No explanation, no
> title, no caption. The only text allowed is the timecode under each panel. »*
On récupère son choix sans lui faire dépenser sa capacité à écrire.

### 4. APRÈS LE CHOIX D'AZIZ — DEMANDER LA DESCRIPTION AU MODÈLE QUI A DESSINÉ
⭐ C'est le seul mérite de l'ancienne méthode qu'il faut conserver : la **description case par case**
sert ensuite à briefer le modèle SVG (Fable 5) sans que Claude réinjecte son interprétation.
→ Renvoyer **l'image retenue** à son auteur : *« décris chaque case assez précisément pour qu'un
illustrateur la dessine sans te poser de question »*. Un appel, sur le seul concept retenu.
⛔ Ne PAS écrire cette description soi-même : c'est exactement le biais corrigé au point 1.

## ⛔⛔ LA DERNIÈRE LIGNE DU BRIEF DÉCIDE SI TU REÇOIS UNE IMAGE (prouvé 2026-08-17, 36 appels réels)

> Cause racine de ~50 % d'échecs de storyboard, **diagnostiquée 2× et jamais appliquée** : le gotcha
> existait depuis le 2026-08-14 dans `memory/tools/openrouter-gpt-image-et-breakdown.md`, mais rien
> ne l'ouvrait au moment d'écrire un brief. C'est pour ça qu'il est ICI maintenant.

⛔ **CONCEVOIR et DESSINER sont 2 compétences — ne JAMAIS les demander au même appel.**
Un appel qui demande « les images **+ ton analyse écrite** » laisse le modèle choisir la sortie la
moins chère : Gemini écrit 8 000 caractères de markdown et 0 image ; GPT dessine une PAGE DE TEXTE
(vignettes à 120 px, titres corrompus « Lee routes croisées », « CONCEEPT », 3e concept hors cadre).

**Le tail décide, et il n'est PAS le même selon le modèle** (⚠️ le fix de l'un aggrave l'autre) :
- **Gemini image** — mesuré **1/6 → 3/3** en ne changeant QUE la dernière ligne. Il faut la négation
  explicite : `DELIVERABLE — GENERATE AN IMAGE (not a text description). […] Do not reply with prose.
  Output the image now.` Une formulation molle (« GENERATE THE STORYBOARD IMAGES NOW ») ne suffit pas : 1/4.
  ⛔ `responseModalities:["image"]` SEUL n'est pas le fix — testé, ça dégrade (`finishReason=NO_IMAGE`,
  `parts=[]`, plus aucun diagnostic possible). Garder `["image","text"]`.
- **GPT image** — la corruption du texte est **proportionnelle à la quantité de texte demandée**.
  Réduit aux SEULS timecodes → « 0,0s » « 3,5s », zéro faute. Lui demander ses notes DANS l'image →
  le pire résultat mesuré. ⛔ Ne jamais lui faire écrire d'analyse dans une planche.
- **Contenu coupé au bord** : ajouter `Leave a clear empty margin of at least 5% on ALL FOUR sides —
  nothing may touch or be cut off by the edge.` (sans : coupé ; avec : propre).

⚠️ **Méthode en 2 temps — REMPLACÉE le 2026-08-18** (voir § LA MÉTHODE EN VIGUEUR ci-dessus ;
conservée pour mémoire, et parce que l'étape texte reste utile si on veut un avis de Kimi) — `scripts/tools/storyboard-concepts-texte.py` :
1. **CONCEPTION en TEXTE**, N modèles en parallèle → débloque **Kimi** (meilleure vision artistique)
   et **Grok** (instinct accroche), jusque-là exclus parce qu'ils ne dessinent pas. Chacun rend ses
   concepts + la **description case par case** du concept qu'il défend, prête à dessiner.
2. **CHOIX HUMAIN** (Aziz tranche) — ⛔ pas forcément le concept que le modèle défend.
3. **DESSIN** : 1 concept = 1 planche, 4 cases horizontales, **timecodes comme seul texte**.
   ⛔ Ne PAS faire 1 appel par case : le problème était la charge de TEXTE, pas le nombre de cases.

## INTERDITS — erreurs déjà payées
⛔ **Coder avant validation de la direction.** Le modèle PROPOSE, Aziz valide, PUIS breakdown (prouvé 4×).
⛔ **1 image = 1 concept.** Un montage 3-concepts en 1024×1024 est illisible — et vérifier la résolution
RÉELLE reçue (`PIL Image.size`) avant de conclure à un échec de contenu.
⛔ **`storyboard-dual-gen.py` perdait 2 images sur 3** (retour au 1er `inlineData` alors que Gemini en
renvoie souvent 3) et écrivait du **JPEG dans un `.png`** — corrigé le 2026-08-17. Si tu retrouves ce
motif ailleurs : boucler sur toutes les parts, écrire l'extension d'après les magic bytes.
⛔ **Un DA-brief textuel ne remplace pas un storyboard IMAGE** (rendu Acte 3 plat malgré un brief écrit soigné).
⛔ **Le breakdown TRANSCRIT, il ne CRÉE pas** — et le demander au MODÈLE QUI A GÉNÉRÉ L'IMAGE, pas à Claude
qui interprète (un breakdown écrit par Claude a réintroduit un widget HUD déjà interdit → code rejeté).
⚠️ La doctrine contient encore l'ANCIENNE méthode (« Claude écrit le breakdown ») AVANT sa correction — c'est
la version corrigée qui fait foi.
⛔⛔ **REPRENDRE un STORYBOARD/PLAN/breakdown HÉRITÉ : chercher son VERDICT DE REJET AVANT de le rendre
ou de le présenter.** `grep -n "VERDICT\|REJET\|ne PAS repartir\|rejeté"` sur le breakdown, le STATUS **et**
le doc de fusion de l'épisode. Un livrable dont le rejet est documenté ne se « vérifie » pas — il se
**refait depuis la source approuvée**. Vécu 2026-08-14 (Gazoduc Acte 3) : v3 rendue et présentée à Aziz
en la croyant à jour, alors que `BREAKDOWN-SEGMENT-A-STORYBOARD-FUSION.md` contenait déjà « VERDICT AZIZ
— REJETÉ » avec les 3 défauts et « Ne PAS repartir du code v3 actuel ». Coût : 1 aller-retour complet +
un rendu invalide présenté. ⭐ Corollaire : un beat refait ne valide pas ses voisins — **un fichier n'est
jamais homogène en qualité**.
⛔ **Hériter d'une géo par continuité** : un texte sans relation spatiale réelle codé en carte = redite du beat
précédent, renommée. Aucune vérification technique ne détecte ça.
⛔ **Ajouter un geste pour « dépasser »** une référence éprouvée → confusion. Mieux EXÉCUTER le même geste.
⭐ Storyboard basse résolution → SVG premium : recadrer le panneau retenu, le renvoyer en référence avec
l'intention EN MOTS + corrections obligatoires + palette + groupes nommés. Prouvé 3× ; Fable 5 a gagné.
⭐ GPT Image 2 > Gemini pour le storyboard annoté (français propre, annotations caméra réalisateur,
panneaux numérotés). Encourager explicitement ces annotations, ne pas les traiter comme du bruit.

## SI UN CONCEPT EST REJETÉ 2×
**Seuil = 2 rejets sur le MÊME chantier** (pas au 1er jet). STOP, ne pas proposer une 3e variante soi-même :
Claude tourne en rond sur les mêmes idées. → skill **`creative-director-dual`** : 2 agents `creative-director`
en PARALLÈLE, brief strictement identique (script + historique des rejets + contraintes dures), **zéro
suggestion d'angle** de l'orchestrateur, chacun ignorant l'autre. Ils produisent des PROPOSITIONS, jamais du
code, et Aziz arbitre. Confirmé 2× (Sahel 2026-07-07 après 4 rejets ; Sénégal Short D3 2026-07-15).
Coût de ne pas l'avoir fait : 4 rejets.
